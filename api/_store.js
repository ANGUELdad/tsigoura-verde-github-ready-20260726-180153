/* ============================================================================
   Live menu store — no manual configuration.

   Persistence backends (first available wins):
   1. Vercel KV / Upstash Redis REST (`KV_REST_API_*`)
   2. Vercel Blob (`BLOB_STORE_ID` or `BLOB_READ_WRITE_TOKEN`)
   3. Local filesystem (`.data/menu-store.json`, or `MENU_STORE_PATH` /
      `MENU_STORE_DIR`). Enabled automatically off Vercel; on Vercel only when
      a path env is set (never uses ephemeral /tmp by accident).

   Plain fetch for KV. Blob uses `@vercel/blob`. If nothing is attached,
   guests fall back to the published menu-live.js file.
   ========================================================================== */

const KEY = 'tsigoura:menu:v1';
const BACKUP_KEY = 'tsigoura:menu:backups:v1';
const HISTORY_KEY = 'tsigoura:menu:history:v1';
const PUBLIC_CONFIG_KEY = 'tsigoura:public-config:v1';
const BLOB_PATHS = {
  [KEY]: 'tsigoura/menu-v1.json',
  [BACKUP_KEY]: 'tsigoura/menu-backups-v1.json',
  [HISTORY_KEY]: 'tsigoura/menu-history-v1.json',
  [PUBLIC_CONFIG_KEY]: 'tsigoura/public-config-v1.json',
};
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const clean = (v, max = 400) => String(v || '').trim().slice(0, max);
/* IDs may be numeric 0 — never collapse with `|| ''`. */
const idOf = (v, max = 48) => String(v == null ? '' : v).trim().slice(0, max);

function kvConfig() {
  const url = clean(
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.REDIS_REST_API_URL,
    300
  ).replace(/\/+$/, '');
  const token = clean(
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.REDIS_REST_API_TOKEN,
    800
  );
  return { url, token };
}

function kvConfigured() {
  const c = kvConfig();
  return !!(c.url && c.token);
}

function blobConfigured() {
  return !!(clean(process.env.BLOB_READ_WRITE_TOKEN, 800) || clean(process.env.BLOB_STORE_ID, 120));
}

function fsStorePath() {
  if (process.env.MENU_STORE_PATH) return path.resolve(process.env.MENU_STORE_PATH);
  if (process.env.MENU_STORE_DIR) return path.resolve(process.env.MENU_STORE_DIR, 'menu-store.json');
  /* Durable local/dev fallback. Skip on Vercel unless a path was set above —
     serverless /tmp is not shared across instances. */
  if (process.env.VERCEL === '1') return '';
  return path.join(process.cwd(), '.data', 'menu-store.json');
}

function fsConfigured() {
  return !!fsStorePath();
}

function configured() {
  return kvConfigured() || blobConfigured() || fsConfigured();
}

function storeKind() {
  if (kvConfigured()) return 'vercel-kv';
  if (blobConfigured()) return 'vercel-blob';
  if (fsConfigured()) return 'fs';
  return 'none';
}

function notConfiguredError() {
  const err = new Error('store_not_configured');
  err.status = 503;
  return err;
}

/* Upstash REST accepts a command as a JSON array: ["SET", key, value] */
async function kvCommand(args) {
  const c = kvConfig();
  if (!c.url || !c.token) throw notConfiguredError();
  const r = await fetch(c.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${c.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  const text = await r.text().catch(() => '');
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch (e) {}
  if (!r.ok) {
    const err = new Error('store_request_failed');
    err.status = r.status;
    err.detail = text.slice(0, 300);
    throw err;
  }
  return json;
}

async function streamToText(stream) {
  if (!stream) return '';
  if (typeof Response !== 'undefined' && typeof stream.getReader === 'function') {
    return await new Response(stream).text();
  }
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

function blobSdk() {
  try {
    return require('@vercel/blob');
  } catch (e) {
    const err = new Error('blob_module_missing');
    err.status = 503;
    err.detail = String((e && e.message) || e).slice(0, 200);
    throw err;
  }
}

async function blobFetchJson(url, bust) {
  if (!url) return null;
  const token = encodeURIComponent(String(bust || Date.now()));
  const full = url + (url.includes('?') ? '&' : '?') + 'tv=' + token;
  const r = await fetch(full, {
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
  });
  if (!r.ok) return null;
  const text = await r.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch (e) { return null; }
}

async function blobRead(pathname) {
  const { list, get } = blobSdk();
  /* Public Blob CDN keeps serving stale bodies after in-place overwrite.
     Menu docs use revisioned paths + a tiny pointer file (see blobWrite).
     For legacy single-file paths, prefer list→etag-busted URL fetch. */
  try {
    if (pathname === BLOB_PATHS[KEY] || pathname.endsWith('/menu-v1.json')) {
      const listed = await list({ prefix: 'tsigoura/menu-rev/', limit: 200 });
      const blobs = (listed.blobs || []).slice().sort((a, b) => {
        const ta = Date.parse(a.uploadedAt || 0) || 0;
        const tb = Date.parse(b.uploadedAt || 0) || 0;
        return tb - ta;
      });
      for (const blob of blobs.slice(0, 5)) {
        const doc = await blobFetchJson(blob.url, blob.etag || blob.uploadedAt || Date.now());
        if (doc && doc.state) return doc;
      }
      const pointerListed = await list({ prefix: 'tsigoura/menu-pointer.json', limit: 10 });
      const pointerBlob = (pointerListed.blobs || []).find(b => b.pathname === 'tsigoura/menu-pointer.json');
      if (pointerBlob && pointerBlob.url) {
        const pointer = await blobFetchJson(pointerBlob.url, pointerBlob.etag || Date.now());
        if (pointer && pointer.url) {
          const doc = await blobFetchJson(pointer.url, pointer.revision || pointer.etag || Date.now());
          if (doc && doc.state) return doc;
        }
      }
    }
    const listed = await list({ prefix: pathname, limit: 100 });
    const exact = (listed.blobs || []).find(b => b.pathname === pathname);
    if (exact && exact.url) {
      const doc = await blobFetchJson(exact.url, exact.etag || exact.uploadedAt || Date.now());
      if (doc != null) return doc;
    }
  } catch (e) {
    /* fall through to SDK get */
  }
  const result = await get(pathname, { access: 'public', useCache: false });
  if (!result || result.statusCode === 304 || !result.stream) return null;
  const text = await streamToText(result.stream);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

async function blobWrite(pathname, value) {
  const { put, list, del } = blobSdk();
  const body = JSON.stringify(value);
  /* Vercel Blob rejects cacheControlMaxAge below 60s for public stores; 0 was
     ignored and left long CDN caching in place. */
  const putOpts = {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    cacheControlMaxAge: 60,
  };

  /* Menu JSON: write a NEW revisioned object so CDN cannot serve a stale
     overwrite of the same URL. Keep a pointer + a small rolling set. */
  if (pathname === BLOB_PATHS[KEY] || pathname.endsWith('/menu-v1.json')) {
    const revision = (value && value.revision) || Date.now();
    const revPath = 'tsigoura/menu-rev/' + String(revision) + '.json';
    const putResult = await put(revPath, body, putOpts);
    const pointer = {
      revision,
      pathname: revPath,
      url: putResult && putResult.url,
      updatedAt: (value && value.updatedAt) || new Date().toISOString(),
    };
    await put('tsigoura/menu-pointer.json', JSON.stringify(pointer), putOpts);
    /* Best-effort legacy path for older readers still mid-deploy. */
    try { await put(pathname, body, putOpts); } catch (e) {}
    /* Prune older revisions (keep newest ~12). */
    try {
      const listed = await list({ prefix: 'tsigoura/menu-rev/', limit: 200 });
      const blobs = (listed.blobs || []).slice().sort((a, b) => {
        const ta = Date.parse(a.uploadedAt || 0) || 0;
        const tb = Date.parse(b.uploadedAt || 0) || 0;
        return tb - ta;
      });
      const stale = blobs.slice(12).map(b => b.url).filter(Boolean);
      if (stale.length) await del(stale);
    } catch (e) {}
    return;
  }

  await put(pathname, body, putOpts);
}

function readFsBundle() {
  const file = fsStorePath();
  if (!file) return {};
  try {
    if (!fs.existsSync(file)) return {};
    const raw = fs.readFileSync(file, 'utf8');
    const json = raw ? JSON.parse(raw) : {};
    return json && typeof json === 'object' ? json : {};
  } catch (e) {
    return {};
  }
}

function writeFsBundle(bundle) {
  const file = fsStorePath();
  if (!file) throw notConfiguredError();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.' + process.pid + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(bundle), 'utf8');
  fs.renameSync(tmp, file);
}

async function readJson(key) {
  if (kvConfigured()) {
    const out = await kvCommand(['GET', key]);
    const raw = out && out.result;
    if (!raw) return null;
    try {
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (e) {
      return null;
    }
  }
  if (blobConfigured()) {
    return blobRead(BLOB_PATHS[key] || ('tsigoura/' + key.replace(/:/g, '-') + '.json'));
  }
  if (fsConfigured()) {
    const bundle = readFsBundle();
    const value = bundle[key];
    return value == null ? null : value;
  }
  throw notConfiguredError();
}

async function writeJson(key, value) {
  if (kvConfigured()) {
    await kvCommand(['SET', key, JSON.stringify(value)]);
    return;
  }
  if (blobConfigured()) {
    await blobWrite(BLOB_PATHS[key] || ('tsigoura/' + key.replace(/:/g, '-') + '.json'), value);
    return;
  }
  if (fsConfigured()) {
    const bundle = readFsBundle();
    bundle[key] = value;
    writeFsBundle(bundle);
    return;
  }
  throw notConfiguredError();
}

async function readMenu() {
  return readJson(KEY);
}

function sanitizePublicConfig(input) {
  const src = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  const venue = src.venue && typeof src.venue === 'object' ? src.venue : {};
  const contact = src.contact && typeof src.contact === 'object' ? src.contact : {};
  const wifi = src.wifi && typeof src.wifi === 'object' ? src.wifi : {};
  const legal = src.legal && typeof src.legal === 'object' ? src.legal : {};
  const encRaw = clean(wifi.enc, 16);
  const encUpper = encRaw.toUpperCase();
  let enc = 'WPA';
  if (encUpper === 'WEP') enc = 'WEP';
  else if (encUpper === 'NOPASS' || /^nopass$/i.test(encRaw)) enc = 'nopass';
  else if (encUpper === 'WPA') enc = 'WPA';
  return {
    venue: {
      name: clean(venue.name, 80),
      subtitle: clean(venue.subtitle, 120),
    },
    contact: {
      email: clean(contact.email, 120),
      phone: clean(contact.phone, 40),
      instagram: clean(contact.instagram, 300),
      facebook: clean(contact.facebook, 300),
      maps: clean(contact.maps, 300),
      website: clean(contact.website, 300),
    },
    wifi: {
      ssid: clean(wifi.ssid, 64),
      pass: clean(wifi.pass, 64),
      enc,
    },
    legal: {
      companyName: clean(legal.companyName, 120),
      afm: clean(legal.afm, 40),
      doy: clean(legal.doy, 80),
      gemi: clean(legal.gemi, 80),
      address: clean(legal.address, 200),
      mhte: clean(legal.mhte, 80),
      agoranomikos: clean(legal.agoranomikos, 120),
    },
  };
}

async function readPublicConfig() {
  const doc = await readJson(PUBLIC_CONFIG_KEY);
  if (!doc || typeof doc !== 'object') return null;
  const payload = doc.config && typeof doc.config === 'object' ? doc.config : doc;
  return {
    config: sanitizePublicConfig(payload),
    updatedAt: clean(doc.updatedAt, 40) || null,
    updatedBy: clean(doc.updatedBy, 80) || null,
  };
}

async function writePublicConfig(config, meta = {}) {
  const now = new Date().toISOString();
  const doc = {
    config: sanitizePublicConfig(config),
    updatedAt: now,
    updatedBy: clean(meta.updatedBy || 'admin', 80),
  };
  await writeJson(PUBLIC_CONFIG_KEY, doc);
  return doc;
}

function stable(v) {
  try { return JSON.stringify(v == null ? null : v); } catch (e) { return ''; }
}

function changeCounts(before, after) {
  before = before || {};
  after = after || {};
  const out = { prices:0, visibility:0, availability:0, schedules:0, dishes:0, content:0, categories:0, presets:0, announcement:0, settings:0, tables:0, orders:0 };
  const oldItems = new Map((Array.isArray(before.menu) ? before.menu : []).map(x => [String(x && x.id), x || {}]));
  const newItems = new Map((Array.isArray(after.menu) ? after.menu : []).map(x => [String(x && x.id), x || {}]));
  const ids = new Set([...oldItems.keys(), ...newItems.keys()]);
  ids.forEach(id => {
    const a = oldItems.get(id), b = newItems.get(id);
    if (!a || !b) { out.dishes++; return; }
    if (Number(a.price) !== Number(b.price) || String(a.priceText||'') !== String(b.priceText||'')) out.prices++;
    if (!!a.hidden !== !!b.hidden) out.visibility++;
    if ((a.available !== false) !== (b.available !== false)) out.availability++;
    if (stable(a.schedule) !== stable(b.schedule)) out.schedules++;
    const contentKeys=['cat','unit','icon','image','order','t','allergens','allergensReviewed','removable','popular','chefPick','veg','spicy','prepMin'];
    if(contentKeys.some(k=>stable(a[k])!==stable(b[k]))) out.content++;
  });
  const oldCats = new Map((Array.isArray(before.categories) ? before.categories : []).map(x => [String(x && x.id), x || {}]));
  const newCats = new Map((Array.isArray(after.categories) ? after.categories : []).map(x => [String(x && x.id), x || {}]));
  const catIds = new Set([...oldCats.keys(), ...newCats.keys()]);
  catIds.forEach(id => {
    const a=oldCats.get(id), b=newCats.get(id);
    if(!a||!b||!!a.hidden!==!!b.hidden||stable(a.t)!==stable(b.t)||Number(a.order)!==Number(b.order)) out.categories++;
  });
  const oldSettings=before.settings||{}, newSettings=after.settings||{};
  if(stable(oldSettings.eventPresets)!==stable(newSettings.eventPresets)) out.presets++;
  if(stable(oldSettings.announcement)!==stable(newSettings.announcement)) out.announcement++;
  const settingKeys=['serviceOpen','acceptOrders','traditionalMenuOnly','defaultLang','headerActions','design'];
  if(settingKeys.some(k=>stable(oldSettings[k])!==stable(newSettings[k]))) out.settings++;
  if(stable(before.tables)!==stable(after.tables)) out.tables++;
  if(stable(before.orders)!==stable(after.orders)) out.orders++;
  return out;
}

async function storeDailyBackup(previous, now) {
  if (!previous || !previous.state) return false;
  const day=now.slice(0,10);
  const backups=await readJson(BACKUP_KEY);
  const list=Array.isArray(backups)?backups:[];
  if(list.some(x=>x&&x.day===day)) return false;
  list.unshift({
    id:`backup-${day}`,
    day,
    createdAt:now,
    revision:Number(previous.revision)||0,
    state:previous.state
  });
  await writeJson(BACKUP_KEY,list.slice(0,14));
  return true;
}

async function recordHistory(previous, doc, reason) {
  const history=await readJson(HISTORY_KEY);
  const list=Array.isArray(history)?history:[];
  list.unshift({
    id:`change-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
    createdAt:doc.updatedAt,
    revision:doc.revision,
    reason:clean(reason||'edit',24),
    changes:changeCounts(previous&&previous.state,doc.state)
  });
  await writeJson(HISTORY_KEY,list.slice(0,60));
}

async function writeMenu(state, meta = {}) {
  const previous=await readMenu();
  const now=new Date().toISOString();
  try { await storeDailyBackup(previous,now); } catch (e) {}
  /* The revision doubles as the guest cache key: index.html polls
     /api/menu?revision=N and ignores anything not strictly newer. It arrives
     from the admin BROWSER's clock, so a skewed or second device could write a
     revision <= the stored one and freeze every guest on the old menu forever.
     Force it strictly upward so a publish always reaches phones. */
  const revisionNum = Number(meta.revision);
  const previousRevision = Number(previous && previous.revision) || 0;
  let revision = Number.isFinite(revisionNum) && revisionNum > 0 ? revisionNum : Date.now();
  if (revision <= previousRevision) revision = previousRevision + 1;
  const doc = {
    state,
    revision,
    updatedAt: now,
    updatedBy: clean(meta.updatedBy || 'admin', 80),
  };
  await writeJson(KEY, doc);
  try { await recordHistory(previous,doc,meta.reason); } catch (e) {}
  return doc;
}

async function readAdminHistory() {
  const [backups,history]=await Promise.all([readJson(BACKUP_KEY),readJson(HISTORY_KEY)]);
  return {
    backups:(Array.isArray(backups)?backups:[]).map(x=>({
      id:x.id,day:x.day,createdAt:x.createdAt,revision:Number(x.revision)||0,
      dishes:x.state&&Array.isArray(x.state.menu)?x.state.menu.length:0,
      categories:x.state&&Array.isArray(x.state.categories)?x.state.categories.length:0
    })),
    history:Array.isArray(history)?history:[]
  };
}

async function restoreMenuBackup(id, meta = {}) {
  const backups=await readJson(BACKUP_KEY);
  const found=(Array.isArray(backups)?backups:[]).find(x=>x&&x.id===id&&x.state);
  if(!found) return null;
  return writeMenu(found.state,Object.assign({},meta,{reason:'restore'}));
}

/* Writes are only allowed when a real PIN has been set — otherwise anyone who
   finds the URL could rewrite the menu. */

/* Vercel treats values that start with "@" as shared-env references. Owners who
   want a PIN that begins with "@" should prefix the value with "pin:"
   (e.g. pin:@secret) in ADMIN_PIN or ADMIN_PIN_LITERAL. */
function resolveAdminPin() {
  const raw = clean(
    process.env.ADMIN_PIN_LITERAL ||
    process.env.ADMIN_PIN ||
    process.env.ADMIN_PASSWORD ||
    process.env.TSIGOURA_ADMIN_PIN,
    120
  );
  if (raw.toLowerCase().startsWith('pin:')) return raw.slice(4);
  return raw;
}

function adminPinConfigured() {
  return !!resolveAdminPin();
}
function adminPinOk(pin) {
  const expected = resolveAdminPin();
  const supplied = clean(pin, 120);
  if (!expected || !supplied) return false;
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const SESSION_COOKIE = 'tv_admin_session';
const SESSION_MAX_AGE_SEC = 12 * 60 * 60;

function sessionSecret() {
  return clean(process.env.ADMIN_SESSION_SECRET, 200) || resolveAdminPin() || 'tv-dev-session';
}
function b64url(input) {
  return Buffer.from(input).toString('base64url');
}
function fromB64url(input) {
  return Buffer.from(String(input || ''), 'base64url').toString('utf8');
}
function signSession(payload) {
  return crypto.createHmac('sha256', sessionSecret()).update(payload).digest('base64url');
}
function createAdminSessionToken(pin, maxAgeSec = SESSION_MAX_AGE_SEC) {
  const body = JSON.stringify({
    pin: clean(pin, 120),
    exp: Date.now() + Math.max(60, Number(maxAgeSec) || SESSION_MAX_AGE_SEC) * 1000,
  });
  const payload = b64url(body);
  return `${payload}.${signSession(payload)}`;
}
function pinFromSessionToken(token) {
  const raw = clean(token, 800);
  const parts = raw.split('.');
  if (parts.length !== 2) return '';
  const [payload, sig] = parts;
  const expected = signSession(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return '';
  try {
    const data = JSON.parse(fromB64url(payload));
    if (!data || !data.exp || Date.now() > Number(data.exp)) return '';
    return clean(data.pin, 120);
  } catch (e) {
    return '';
  }
}
function parseCookies(req) {
  const header = clean((req && req.headers && req.headers.cookie) || '', 4000);
  const out = {};
  header.split(';').forEach(part => {
    const idx = part.indexOf('=');
    if (idx <= 0) return;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  });
  return out;
}
function requestIsHttps(req) {
  const proto = clean((req && req.headers && req.headers['x-forwarded-proto']) || '', 40)
    .split(',')[0]
    .trim()
    .toLowerCase();
  if (proto === 'https') return true;
  if (proto === 'http') return false;
  return !!(req && req.socket && req.socket.encrypted);
}
function buildSessionCookie(token, req, maxAgeSec = SESSION_MAX_AGE_SEC) {
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${Math.max(60, Number(maxAgeSec) || SESSION_MAX_AGE_SEC)}`,
  ];
  if (requestIsHttps(req)) parts.push('Secure');
  return parts.join('; ');
}
function clearSessionCookie(req) {
  const parts = [
    `${SESSION_COOKIE}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
  ];
  if (requestIsHttps(req)) parts.push('Secure');
  return parts.join('; ');
}
function appendSetCookie(res, value) {
  if (!res || !value) return;
  const prev = res.getHeader && res.getHeader('Set-Cookie');
  if (!prev) {
    res.setHeader('Set-Cookie', value);
    return;
  }
  const list = Array.isArray(prev) ? prev.concat(value) : [prev, value];
  res.setHeader('Set-Cookie', list);
}
function corsOriginAllowed(req) {
  const origin = clean((req && req.headers && req.headers.origin) || '', 300);
  if (!origin) return '';
  const host = clean((req && req.headers && req.headers.host) || '', 200).toLowerCase();
  try {
    const url = new URL(origin);
    const oh = url.host.toLowerCase();
    if (host && oh === host) return origin;
    if (oh.endsWith('.vercel.app') || (host && host.endsWith('.vercel.app'))) return origin;
    if (oh === 'localhost' || oh.startsWith('localhost:') || oh === '127.0.0.1' || oh.startsWith('127.0.0.1:')) {
      return origin;
    }
  } catch (e) {}
  return '';
}
function applyCors(req, res) {
  const allowed = corsOriginAllowed(req);
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', allowed);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Admin-Pin, X-Upload-Kind, X-Upload-Id, X-File-Name'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Max-Age', '86400');
}
function handlePreflight(req, res) {
  applyCors(req, res);
  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') {
      const out = res.status(204);
      if (out && typeof out.end === 'function') out.end();
      else if (typeof res.end === 'function') res.end();
    } else {
      res.statusCode = 204;
      if (typeof res.end === 'function') res.end();
    }
    return true;
  }
  return false;
}

function adminPinFromReq(req, data = {}) {
  const headers = (req && req.headers) || {};
  const auth = clean(headers.authorization, 180);
  const bearer = /^Bearer\s+(.+)$/i.exec(auth);
  const cookies = parseCookies(req);
  const fromSession = pinFromSessionToken(cookies[SESSION_COOKIE]);
  return clean(
    headers['x-admin-pin'] ||
    (bearer && bearer[1]) ||
    (data && data.pin) ||
    (data && data.password) ||
    fromSession,
    120
  );
}

/* Vercel may give JSON as object, string, Buffer, or an unread stream. */
async function readRawBody(req, limit = 2_000_000) {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return Buffer.from(req.body);
  if (req.body && typeof req.body === 'object' && typeof req.body.pipe !== 'function' && !Buffer.isBuffer(req.body)) {
    return null;
  }
  if (!req || typeof req.on !== 'function') return Buffer.alloc(0);
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buf.length;
    if (size > limit) {
      const err = new Error('body_too_large');
      err.status = 413;
      throw err;
    }
    chunks.push(buf);
  }
  return Buffer.concat(chunks);
}

async function parseJsonBody(req) {
  if (Buffer.isBuffer(req.body)) {
    const text = req.body.toString('utf8').trim();
    return text ? JSON.parse(text) : {};
  }
  if (typeof req.body === 'string') {
    const text = req.body.trim();
    return text ? JSON.parse(text) : {};
  }
  if (req.body && typeof req.body === 'object') {
    if (ArrayBuffer.isView(req.body)) {
      const text = Buffer.from(req.body).toString('utf8').trim();
      return text ? JSON.parse(text) : {};
    }
    if (typeof req.body.pipe !== 'function' && !Array.isArray(req.body)) {
      return req.body;
    }
  }
  const raw = await readRawBody(req, 2_000_000);
  if (!raw || !raw.length) return {};
  return JSON.parse(raw.toString('utf8'));
}

/* Sanitize catalogue shape/limits. Operational fields (orders, table status,
   notes) are preserved on admin writes. Strip them only for public reads or
   when the caller explicitly passes { resetOps:true }. */
const TABLE_STATUSES = new Set(['open', 'occupied', 'reserved', 'closed']);

function sanitizeMenuState(input, options = {}) {
  let state;
  try {
    state = JSON.parse(JSON.stringify(input || {}));
  } catch (e) {
    state = {};
  }

  if (!Array.isArray(state.menu)) state.menu = [];
  if (!Array.isArray(state.categories)) state.categories = [];
  if (!state.settings || typeof state.settings !== 'object' || Array.isArray(state.settings)) {
    state.settings = {};
  }

  const seenCats = new Set();
  state.categories = state.categories.slice(0, 50).map((category, ix) => {
    if (!category || typeof category !== 'object') return null;
    const id = idOf(category.id, 48) || ('cat' + (ix + 1));
    /* Keep duplicate ids intact so validateMenuState can reject them. */
    seenCats.add(id);
    return Object.assign({}, category, { id });
  }).filter(Boolean);

  const categoryIds = new Set(state.categories.map(c => c.id));
  const fallbackCat = state.categories[0] && state.categories[0].id;
  state.menu = state.menu.slice(0, 500).map((dish, ix) => {
    if (!dish || typeof dish !== 'object') return null;
    const id = idOf(dish.id, 48) || String(9000 + ix);
    let cat = idOf(dish.cat, 48);
    if (!categoryIds.has(cat)) cat = fallbackCat || cat;
    return Object.assign({}, dish, { id, cat });
  }).filter(Boolean);

  const stripOps = !!(options.public || options.resetOps);
  if (stripOps) {
    state.orders = [];
  } else if (Array.isArray(state.orders)) {
    state.orders = state.orders.slice(0, 500).filter(o => o && typeof o === 'object');
  } else {
    state.orders = [];
  }

  if (Array.isArray(state.tables)) {
    state.tables = state.tables.slice(0, 200).map(table => {
      if (!table || typeof table !== 'object') return null;
      const safe = Object.assign({}, table);
      if (stripOps) {
        safe.status = 'open';
        if (options.public) safe.note = '';
      } else {
        const status = clean(safe.status, 24);
        safe.status = TABLE_STATUSES.has(status) ? status : 'open';
        if (safe.note != null) safe.note = clean(safe.note, 240);
      }
      return safe;
    }).filter(Boolean);
  } else {
    state.tables = [];
  }
  return state;
}

function validateMenuState(state) {
  if (!state || !Array.isArray(state.menu) || !Array.isArray(state.categories) || !state.settings || typeof state.settings !== 'object') {
    return 'invalid_state';
  }
  if (state.menu.length > 500 || state.categories.length > 50) return 'state_limits_exceeded';
  const categoryIds = new Set();
  for (const category of state.categories) {
    const id = idOf(category && category.id, 48);
    if (!id || categoryIds.has(id)) return 'invalid_categories';
    categoryIds.add(id);
  }
  if (state.menu.length && !categoryIds.size) return 'invalid_categories';
  const dishIds = new Set();
  for (const dish of state.menu) {
    const id = idOf(dish && dish.id, 48);
    const cat = idOf(dish && dish.cat, 48);
    if (!id || dishIds.has(id) || !categoryIds.has(cat)) return 'invalid_menu';
    dishIds.add(id);
  }
  return '';
}

module.exports = {
  configured, storeKind, kvConfigured, blobConfigured, fsConfigured,
  readMenu, writeMenu, readAdminHistory, restoreMenuBackup,
  readPublicConfig, writePublicConfig, sanitizePublicConfig,
  adminPinOk, adminPinConfigured, adminPinFromReq, sanitizeMenuState, validateMenuState,
  clean, idOf, KEY, BACKUP_KEY, HISTORY_KEY, PUBLIC_CONFIG_KEY, changeCounts,
  resolveAdminPin, parseJsonBody, readRawBody, applyCors, handlePreflight,
  createAdminSessionToken, buildSessionCookie, clearSessionCookie, appendSetCookie,
  SESSION_COOKIE, SESSION_MAX_AGE_SEC
};
