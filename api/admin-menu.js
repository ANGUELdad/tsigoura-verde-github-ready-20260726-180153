const { configured, readMenuState, writeMenuState, adminPinOk, clean } = require('./_supabase');

const attempts = globalThis.__tvAdminMenuAttempts || (globalThis.__tvAdminMenuAttempts = new Map());
const ipOf = req => clean((req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) || 'local', 120).split(',')[0].trim() || 'local';

function tooManyAttempts(key) {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000;
  const recent = (attempts.get(key) || []).filter(t => now - t < windowMs);
  recent.push(now);
  attempts.set(key, recent);
  return recent.length > 30;
}

function payload(req) {
  return typeof req.body === 'object' && req.body ? req.body : JSON.parse(req.body || '{}');
}

function smallState(state) {
  const text = JSON.stringify(state || {});
  if (text.length > 2_000_000) {
    const err = new Error('state_too_large');
    err.status = 413;
    throw err;
  }
  return JSON.parse(text);
}

module.exports = async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok:false, error:'method_not_allowed' });
  }
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  try {
    if (!configured()) return res.status(503).json({ ok:false, configured:false, error:'supabase_not_configured' });

    const body = req.method === 'POST' ? payload(req) : req.query || {};
    const ip = ipOf(req);
    if (tooManyAttempts(ip)) return res.status(429).json({ ok:false, error:'too_many_attempts' });
    if (!adminPinOk(body.pin || body.password)) return res.status(401).json({ ok:false, error:'wrong_pin' });

    if (req.method === 'GET') {
      const row = await readMenuState();
      return res.status(200).json({ ok:true, configured:true, state:row && row.state, revision:row && row.revision, updatedAt:row && row.updated_at });
    }

    const state = smallState(body.state);
    if (!state || !Array.isArray(state.menu) || !Array.isArray(state.categories) || !state.settings) {
      return res.status(400).json({ ok:false, error:'invalid_state' });
    }
    const row = await writeMenuState(state, { revision:body.revision || Date.now(), updatedBy:ip });
    return res.status(200).json({ ok:true, configured:true, revision:row.revision, updatedAt:row.updated_at });
  } catch (err) {
    return res.status(err.status || 500).json({
      ok:false,
      error:err.message || 'server_error',
      detail:String(err.detail || '').slice(0, 300),
    });
  }
};
