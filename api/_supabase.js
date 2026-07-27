const clean = (value, max = 400) => String(value || '').trim().slice(0, max);

function config() {
  const url = clean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL, 300).replace(/\/+$/, '');
  const key = clean(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY,
    800
  );
  return { url, key, table: clean(process.env.SUPABASE_MENU_TABLE, 80) || 'tv_menu_state' };
}

function configured() {
  const c = config();
  return !!(c.url && c.key);
}

async function supabaseFetch(path, options = {}) {
  const c = config();
  if (!c.url || !c.key) {
    const err = new Error('supabase_not_configured');
    err.status = 503;
    throw err;
  }
  const r = await fetch(`${c.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: c.key,
      Authorization: `Bearer ${c.key}`,
      ...(options.headers || {}),
    },
  });
  const text = await r.text().catch(() => '');
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch (e) {}
  if (!r.ok) {
    const err = new Error('supabase_request_failed');
    err.status = r.status;
    err.detail = text.slice(0, 500);
    throw err;
  }
  return json;
}

async function readMenuState() {
  const c = config();
  const rows = await supabaseFetch(`${encodeURIComponent(c.table)}?id=eq.main&select=id,state,revision,updated_at&limit=1`, {
    method: 'GET',
    headers: { 'Cache-Control': 'no-store' },
  });
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

async function writeMenuState(state, meta = {}) {
  const c = config();
  const revision = Number(meta.revision || Date.now());
  const rows = await supabaseFetch(`${encodeURIComponent(c.table)}?on_conflict=id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify([{
      id: 'main',
      state,
      revision,
      updated_by: clean(meta.updatedBy || 'admin', 80),
      updated_at: new Date().toISOString(),
    }]),
  });
  return Array.isArray(rows) && rows.length ? rows[0] : { revision };
}

function adminPinOk(pin) {
  const expected = clean(process.env.ADMIN_PIN || process.env.ADMIN_PASSWORD || process.env.TSIGOURA_ADMIN_PIN, 120);
  return !!(expected && clean(pin, 120) === expected);
}

module.exports = { configured, readMenuState, writeMenuState, adminPinOk, clean };
