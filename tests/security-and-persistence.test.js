const assert = require('assert');

process.env.ADMIN_PIN = 'correct-horse-battery-staple';
process.env.KV_REST_API_URL = 'https://example.test';
process.env.KV_REST_API_TOKEN = 'test-token';

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
    const req = { method, headers, body, query };
    const res = {
      headers: {},
      setHeader(name, value) { this.headers[name] = value; },
      status(code) {
        return {
          json: payload => {
            resolve({ status: code, body: payload, headers: res.headers });
            return payload;
          },
        };
      },
    };
    Promise.resolve(handler(req, res)).catch(reject);
  });
}

const login = require('../api/admin-login');
const adminMenu = require('../api/admin-menu');
const publicMenu = require('../api/menu');
const adminHistory = require('../api/admin-history');

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

  result = await invoke(adminMenu, { query: { pin: process.env.ADMIN_PIN } });
  assert.equal(result.status, 401, 'PINs in URLs must not authenticate');

  result = await invoke(adminMenu, {
    method: 'POST',
    headers: { 'x-admin-pin': process.env.ADMIN_PIN },
    body: { state: fullState, revision: 1, reason: 'test' },
  });
  assert.equal(result.status, 200);

  result = await invoke(adminMenu, { headers: { 'x-admin-pin': process.env.ADMIN_PIN } });
  assert.equal(result.status, 200);
  assert.equal(result.body.state.menu[0].priceText, 'special price');
  assert.equal(result.body.state.menu[0].prepMin, 12);
  assert.deepEqual(result.body.state.menu[0].removable, [{ el: 'σκόρδο', en: 'garlic' }]);
  assert.deepEqual(result.body.state.orders, []);
  assert.equal(result.body.state.tables[0].status, 'open');
  assert.equal(result.body.state.tables[0].note, 'private note');

  result = await invoke(publicMenu);
  assert.equal(result.status, 200);
  assert.deepEqual(result.body.state.orders, []);
  assert.equal(result.body.state.tables[0].status, 'open');
  assert.equal(result.body.state.tables[0].note, '');

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
  result = await invoke(adminMenu, {
    method: 'POST',
    headers: { 'x-admin-pin': 'anything' },
    body: { state: fullState },
  });
  assert.equal(result.status, 503);
  assert.equal(result.body.error, 'admin_pin_not_set');

  console.log('security-and-persistence: 14/14 assertions passed');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
