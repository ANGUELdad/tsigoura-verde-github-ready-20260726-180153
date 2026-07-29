/* ============================================================================
   Live menu store — no manual configuration.

   Uses the Redis (Upstash / Vercel KV) REST API. When you add a KV store to the
   project in the Vercel dashboard, Vercel injects KV_REST_API_URL and
   KV_REST_API_TOKEN automatically, so there are no keys to copy anywhere.

   Plain fetch, no npm dependency. If no store is attached, everything degrades
   to the published menu-live.js file.
   ========================================================================== */

const KEY = 'tsigoura:menu:v1';

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
  const out = await command(['GET', KEY]);
  const raw = out && out.result;
  if (!raw) return null;
  try {
    const doc = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return doc && doc.state ? doc : null;
  } catch (e) {
    return null;
  }
}

async function writeMenu(state, meta = {}) {
  const doc = {
    state,
    revision: Number(meta.revision) || Date.now(),
    updatedAt: new Date().toISOString(),
    updatedBy: clean(meta.updatedBy || 'admin', 80),
  };
  await command(['SET', KEY, JSON.stringify(doc)]);
  return doc;
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

module.exports = { configured, readMenu, writeMenu, adminPinOk, adminPinConfigured, clean, KEY };
