const assert = require('assert');

process.env.ADMIN_PIN = 'correct-horse-battery-staple';
process.env.KV_REST_API_URL = 'https://example.test';
process.env.KV_REST_API_TOKEN = 'test-token';
process.env.ADMIN_SESSION_SECRET = 'session-test-secret';

const store = new Map();
global.fetch = async (_url, options = {}) => {
  const command = JSON.parse(options.body || '[]');
  if (command[0] === 'GET') {
    return response(200, { result: store.get(command[1]) || null });
  }
  if (command[0] === 'SET') {
    store.set(command[1], command[2]);
    return response(200, { result: 'OK' });
  }
  return response(400, { error: 'unsupported_command' });
};

function response(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async text() { return JSON.stringify(body); },
  };
}

function invoke(handler, { method = 'GET', headers = {}, body, query = {} } = {}) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (status, payload) => {
      if (settled) return;
      settled = true;
      resolve({ status, body: payload, headers: res.headers });
    };
    const req = { method, headers, body, query };
    const res = {
      headers: {},
      statusCode: 200,
      setHeader(name, value) { this.headers[name] = value; },
      getHeader(name) { return this.headers[name]; },
      status(code) {
        this.statusCode = code;
        return {
          json: payload => {
            finish(code, payload);
            return payload;
          },
          end: () => finish(code, null),
        };
      },
      end(payload) { finish(this.statusCode || 200, payload == null ? null : payload); },
    };
    Promise.resolve(handler(req, res)).then(() => {
      if (!settled) finish(res.statusCode || 200, null);
    }).catch(reject);
  });
}

const login = require('../api/admin-login');
const adminMenu = require('../api/admin-menu');
const publicMenu = require('../api/menu');
const adminHistory = require('../api/admin-history');
const { createAdminSessionToken, SESSION_COOKIE } = require('../api/_store');

const fullState = {
  menu: [{
    id: 101,
    cat: 'appetizers',
    price: 7.25,
    priceText: 'special price',
    unit: 'portion',
    prepMin: 12,
    icon: 'dip',
    image: 'media/dishes/01-tzatziki.png',
    available: true,
    hidden: false,
    veg: true,
    spicy: false,
    popular: true,
    chefPick: true,
    schedule: { enabled: true, from: '2026-07-01', to: '2026-08-31' },
    allergensReviewed: true,
    allergens: ['milk'],
    ing: { el: 'γιαούρτι', en: 'yogurt' },
    removable: [{ el: 'σκόρδο', en: 'garlic' }],
    t: { el: { n: 'Τζατζίκι', d: 'Περιγραφή' }, en: { n: 'Tzatziki', d: 'Description' } },
  }],
  categories: [{
    id: 'appetizers',
    order: 1,
    hidden: false,
    icon: 'bowl',
    image: 'media/dishes/01-tzatziki.png',
    accent: '#38564F',
    tint: '#E7EEEA',
    t: { el: 'Ορεκτικά', en: 'Appetizers' },
  }],
  tables: [{ id: 'T1', status: 'occupied', note: 'private note', seats: 4 }],
  settings: { currency: '€', serviceOpen: true, acceptOrders: true },
  orders: [{ id: 'private-order', customer: 'private' }],
};

(async () => {
  let result = await invoke(login, { method: 'POST', body: { pin: 'wrong' } });
  assert.equal(result.status, 401);

  result = await invoke(login, { method: 'POST', body: { pin: process.env.ADMIN_PIN } });
  assert.equal(result.status, 200);
  assert.ok(String(result.headers['Set-Cookie'] || '').includes(SESSION_COOKIE));

  result = await invoke(login, {
    method: 'POST',
    body: Buffer.from(JSON.stringify({ pin: process.env.ADMIN_PIN }), 'utf8'),
  });
  assert.equal(result.status, 200, 'Buffer JSON bodies must authenticate');

  result = await invoke(login, { method: 'OPTIONS', headers: { origin: 'https://example.vercel.app', host: 'example.vercel.app' } });
  assert.equal(result.status, 204);

  result = await invoke(adminMenu, { query: { pin: process.env.ADMIN_PIN } });
  assert.equal(result.status, 401, 'PINs in URLs must not authenticate');

  result = await invoke(adminMenu, {
    method: 'POST',
    headers: { 'x-admin-pin': process.env.ADMIN_PIN },
    body: { state: fullState, revision: 1, reason: 'test' },
  });
  assert.equal(result.status, 200);

  result = await invoke(adminMenu, {
    method: 'POST',
    headers: { 'x-admin-pin': process.env.ADMIN_PIN },
    body: Buffer.from(JSON.stringify({ state: fullState, revision: 2, reason: 'buffer' }), 'utf8'),
  });
  assert.equal(result.status, 200, 'Buffer JSON bodies must save');

  const session = createAdminSessionToken(process.env.ADMIN_PIN);
  result = await invoke(adminMenu, {
    method: 'POST',
    headers: { cookie: `${SESSION_COOKIE}=${encodeURIComponent(session)}` },
    body: { state: fullState, revision: 3, reason: 'cookie' },
  });
  assert.equal(result.status, 200, 'HttpOnly session cookie must authorize edits');

  result = await invoke(adminMenu, { headers: { 'x-admin-pin': process.env.ADMIN_PIN } });
  assert.equal(result.status, 200);
  assert.equal(result.body.state.menu[0].priceText, 'special price');
  assert.equal(result.body.state.menu[0].prepMin, 12);
  assert.deepEqual(result.body.state.menu[0].removable, [{ el: 'σκόρδο', en: 'garlic' }]);
  /* Admin writes must keep kitchen/table ops — catalogue saves must not wipe them. */
  assert.deepEqual(result.body.state.orders, [{ id: 'private-order', customer: 'private' }]);
  assert.equal(result.body.state.tables[0].status, 'occupied');
  assert.equal(result.body.state.tables[0].note, 'private note');

  result = await invoke(publicMenu);
  assert.equal(result.status, 200);
  assert.deepEqual(result.body.state.orders, []);
  assert.equal(result.body.state.tables[0].status, 'open');
  assert.equal(result.body.state.tables[0].note, '');
  assert.match(String(result.headers['Cache-Control'] || ''), /no-store/i);
  assert.equal(result.headers.Pragma, 'no-cache');
  assert.equal(result.headers.Expires, '0');
  const liveRevision = Number(result.body.revision) || 0;

  result = await invoke(publicMenu, { query: { revision: liveRevision } });
  assert.equal(result.status, 200);
  assert.equal(result.body.unchanged, true);
  assert.equal(result.body.state, undefined);

  /* CRUD: edit + add must reach guests via GET /api/menu, without clearing ops. */
  const edited = JSON.parse(JSON.stringify(fullState));
  edited.menu[0].price = 9.5;
  edited.menu[0].t.el.n = 'Τζατζίκι Live';
  edited.menu.push({
    id: 202,
    cat: 'appetizers',
    price: 4.5,
    unit: 'portion',
    available: true,
    hidden: false,
    veg: false,
    spicy: false,
    popular: false,
    chefPick: false,
    allergensReviewed: true,
    allergens: [],
    removable: [],
    t: { el: { n: 'Νέο CRUD', d: 'Δοκιμή' }, en: { n: 'New CRUD', d: 'Test' } },
  });
  result = await invoke(adminMenu, {
    method: 'POST',
    headers: { 'x-admin-pin': process.env.ADMIN_PIN },
    body: { state: edited, revision: liveRevision + 1, reason: 'crud' },
  });
  assert.equal(result.status, 200);
  assert.equal(result.body.revision, liveRevision + 1);

  result = await invoke(adminMenu, { headers: { 'x-admin-pin': process.env.ADMIN_PIN } });
  assert.equal(result.status, 200);
  assert.deepEqual(result.body.state.orders, [{ id: 'private-order', customer: 'private' }]);
  assert.equal(result.body.state.tables[0].status, 'occupied');
  assert.equal(result.body.state.tables[0].note, 'private note');

  result = await invoke(publicMenu);
  assert.equal(result.status, 200);
  assert.equal(result.body.revision, liveRevision + 1);
  assert.equal(result.body.state.menu.length, 2);
  assert.equal(result.body.state.menu[0].price, 9.5);
  assert.equal(result.body.state.menu[0].t.el.n, 'Τζατζίκι Live');
  assert.equal(result.body.state.menu[1].t.el.n, 'Νέο CRUD');
  assert.equal(result.body.state.menu[1].price, 4.5);
  assert.deepEqual(result.body.state.orders, []);
  assert.equal(result.body.state.tables[0].status, 'open');
  assert.equal(result.body.state.tables[0].note, '');

  /* CRUD: add category + announcement + hide dish must reach guests. */
  const withCat = JSON.parse(JSON.stringify(edited));
  withCat.categories.push({
    id: 'custom-1',
    order: 2,
    hidden: false,
    icon: 'bowl',
    t: { el: 'Νέα κατηγορία', en: 'New category' },
  });
  withCat.menu.push({
    id: 9001,
    cat: 'custom-1',
    price: 6.5,
    available: true,
    hidden: false,
    t: { el: { n: 'Πιάτο νέας κατηγορίας', d: '' }, en: { n: 'New-cat dish', d: '' } },
  });
  withCat.menu[0].hidden = true;
  withCat.settings = Object.assign({}, withCat.settings || {}, {
    announcement: {
      on: true,
      from: '2026-08-01',
      to: '2026-08-31',
      emoji: '🔥',
      targetCat: 'custom-1',
      specialCats: ['custom-1'],
      t: { el: { title: 'Banner EL', body: 'Σώμα' }, en: { title: 'Banner EN', body: 'Body' } },
    },
  });
  result = await invoke(adminMenu, {
    method: 'POST',
    headers: { 'x-admin-pin': process.env.ADMIN_PIN },
    body: { state: withCat, revision: liveRevision + 2, reason: 'category-announcement' },
  });
  assert.equal(result.status, 200);

  result = await invoke(publicMenu);
  assert.equal(result.status, 200);
  assert.equal(result.body.revision, liveRevision + 2);
  assert.equal(result.body.state.categories.length, 2);
  assert.equal(result.body.state.categories[1].id, 'custom-1');
  assert.equal(result.body.state.categories[1].t.el, 'Νέα κατηγορία');
  assert.equal(result.body.state.menu.length, 3);
  assert.equal(result.body.state.menu[0].hidden, true);
  assert.equal(result.body.state.menu[2].cat, 'custom-1');
  assert.equal(result.body.state.menu[2].t.el.n, 'Πιάτο νέας κατηγορίας');
  assert.equal(result.body.state.settings.announcement.on, true);
  assert.equal(result.body.state.settings.announcement.t.el.title, 'Banner EL');
  assert.equal(result.body.state.settings.announcement.targetCat, 'custom-1');

  result = await invoke(publicMenu, { query: { revision: liveRevision + 2 } });
  assert.equal(result.status, 200);
  assert.equal(result.body.unchanged, true);

  /* Direct sanitize unit checks: preserve vs public vs resetOps. */
  const { sanitizeMenuState } = require('../api/_store');
  const preserved = sanitizeMenuState(fullState);
  assert.deepEqual(preserved.orders, [{ id: 'private-order', customer: 'private' }]);
  assert.equal(preserved.tables[0].status, 'occupied');
  assert.equal(preserved.tables[0].note, 'private note');

  const asPublic = sanitizeMenuState(fullState, { public: true });
  assert.deepEqual(asPublic.orders, []);
  assert.equal(asPublic.tables[0].status, 'open');
  assert.equal(asPublic.tables[0].note, '');

  const reset = sanitizeMenuState(fullState, { resetOps: true });
  assert.deepEqual(reset.orders, []);
  assert.equal(reset.tables[0].status, 'open');
  assert.equal(reset.tables[0].note, 'private note');

  /* Explicit resetOps on write clears ops; normal edits must not. */
  const wiped = JSON.parse(JSON.stringify(fullState));
  wiped.menu[0].price = 10;
  result = await invoke(adminMenu, {
    method: 'POST',
    headers: { 'x-admin-pin': process.env.ADMIN_PIN },
    body: { state: wiped, revision: liveRevision + 3, reason: 'reset', resetOps: true },
  });
  assert.equal(result.status, 200);
  result = await invoke(adminMenu, { headers: { 'x-admin-pin': process.env.ADMIN_PIN } });
  assert.equal(result.status, 200);
  assert.deepEqual(result.body.state.orders, []);
  assert.equal(result.body.state.tables[0].status, 'open');
  assert.equal(result.body.state.menu[0].price, 10);

  const invalid = JSON.parse(JSON.stringify(fullState));
  invalid.menu.push(Object.assign({}, invalid.menu[0]));
  result = await invoke(adminMenu, {
    method: 'POST',
    headers: { authorization: `Bearer ${process.env.ADMIN_PIN}` },
    body: { state: invalid },
  });
  assert.equal(result.status, 400);
  assert.equal(result.body.error, 'invalid_menu');

  result = await invoke(adminHistory, { headers: { 'x-admin-pin': process.env.ADMIN_PIN } });
  assert.equal(result.status, 200);

  delete process.env.ADMIN_PIN;
  delete process.env.ADMIN_PASSWORD;
  delete process.env.TSIGOURA_ADMIN_PIN;
  delete process.env.ADMIN_PIN_LITERAL;
  result = await invoke(adminMenu, {
    method: 'POST',
    headers: { 'x-admin-pin': 'anything' },
    body: { state: fullState },
  });
  assert.equal(result.status, 503);
  assert.equal(result.body.error, 'admin_pin_not_set');

  process.env.ADMIN_PIN_LITERAL = '@literal-pin-value';
  result = await invoke(login, { method: 'POST', body: { pin: '@literal-pin-value' } });
  assert.equal(result.status, 200, 'ADMIN_PIN_LITERAL must support leading @');

  /* Public config: env fallback + PUBLIC_BOOKING_EMAIL alias + admin overrides. */
  process.env.ADMIN_PIN = 'correct-horse-battery-staple';
  delete process.env.ADMIN_PIN_LITERAL;
  delete process.env.PUBLIC_CONTACT_EMAIL;
  process.env.PUBLIC_BOOKING_EMAIL = 'booking-alias@example.com';
  process.env.PUBLIC_PHONE = 'env-phone';
  process.env.PUBLIC_VENUE_NAME = 'Env Venue';
  const publicConfig = require('../api/public-config');

  result = await invoke(publicConfig);
  assert.equal(result.status, 200);
  assert.equal(result.body.contact.email, 'booking-alias@example.com');
  assert.equal(result.body.contact.phone, 'env-phone');
  assert.equal(result.body.venue.name, 'Env Venue');
  assert.equal(result.body.persisted, false);

  result = await invoke(publicConfig, {
    method: 'POST',
    headers: { 'x-admin-pin': 'wrong' },
    body: { config: { contact: { phone: '+30 111' } } },
  });
  assert.equal(result.status, 401);

  result = await invoke(publicConfig, {
    method: 'POST',
    headers: { 'x-admin-pin': process.env.ADMIN_PIN },
    body: {
      config: {
        venue: { name: 'Live Venue', subtitle: 'Patio' },
        contact: { phone: '+30 222', email: 'live@example.com', maps: 'https://maps.example', instagram: '', facebook: '', website: '' },
        wifi: { ssid: 'LIVE-WIFI', pass: 'LivePass1', enc: 'WPA' },
        legal: { companyName: 'Live Co', afm: '123', doy: 'DOY', gemi: 'G1', address: 'Addr', mhte: 'M1', agoranomikos: 'Owner' },
      },
    },
  });
  assert.equal(result.status, 200);
  assert.equal(result.body.saved, true);
  assert.equal(result.body.persisted, true);
  assert.equal(result.body.venue.name, 'Live Venue');
  assert.equal(result.body.contact.phone, '+30 222');
  assert.equal(result.body.contact.email, 'live@example.com');
  assert.equal(result.body.wifi.ssid, 'LIVE-WIFI');
  assert.equal(result.body.legal.afm, '123');

  result = await invoke(publicConfig);
  assert.equal(result.status, 200);
  assert.equal(result.body.venue.name, 'Live Venue');
  assert.equal(result.body.contact.phone, '+30 222');
  /* Empty stored social falls through to env (none set → ''). */
  assert.equal(result.body.contact.phone, '+30 222');

  console.log('security-and-persistence: CRUD + ops-preserve + cache + public-config assertions passed');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
