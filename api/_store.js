/* ============================================================================
   Live menu store — no manual configuration.

   Uses the Redis (Upstash / Vercel KV) REST API. When you add a KV store to the
   project in the Vercel dashboard, Vercel injects KV_REST_API_URL and
   KV_REST_API_TOKEN automatically, so there are no keys to copy anywhere.

   Plain fetch, no npm dependency. If no store is attached, everything degrades
   to the published menu-live.js file.
   ========================================================================== */

const KEY = 'tsigoura:menu:v1';
const BACKUP_KEY = 'tsigoura:menu:backups:v1';
const HISTORY_KEY = 'tsigoura:menu:history:v1';

const clean = (v, max = 400) => String(v || '').trim().slice(0, max);

function config() {
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

function configured() {
  const c = config();
  return !!(c.url && c.token);
}

/* Upstash REST accepts a command as a JSON array: ["SET", key, value] */
async function command(args) {
  const c = config();
  if (!c.url || !c.token) {
    const err = new Error('store_not_configured');
    err.status = 503;
    throw err;
  }
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

async function readMenu() {
  return readJson(KEY);
}

async function readJson(key) {
  const out = await command(['GET', key]);
  const raw = out && out.result;
  if (!raw) return null;
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (e) {
    return null;
  }
}

async function writeJson(key, value) {
  await command(['SET', key, JSON.stringify(value)]);
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
    const contentKeys=['cat','unit','icon','image','order','t','allergens','removable','popular','chefPick','veg','spicy','prepMin'];
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
  const doc = {
    state,
    revision: Number(meta.revision) || Date.now(),
    updatedAt: now,
    updatedBy: clean(meta.updatedBy || 'admin', 80),
  };
  await command(['SET', KEY, JSON.stringify(doc)]);
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
function adminPinConfigured() {
  return !!clean(process.env.ADMIN_PIN || process.env.ADMIN_PASSWORD || process.env.TSIGOURA_ADMIN_PIN, 120);
}
function adminPinOk(pin) {
  const expected = clean(process.env.ADMIN_PIN || process.env.ADMIN_PASSWORD || process.env.TSIGOURA_ADMIN_PIN, 120);
  return !!(expected && clean(pin, 120) === expected);
}

module.exports = {
  configured, readMenu, writeMenu, readAdminHistory, restoreMenuBackup,
  adminPinOk, adminPinConfigured, clean, KEY, BACKUP_KEY, HISTORY_KEY, changeCounts
};
