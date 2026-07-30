const { configured, readMenu, writeMenu, adminPinOk, adminPinConfigured, clean } = require('./_store');

const attempts = globalThis.__tvMenuAttempts || (globalThis.__tvMenuAttempts = new Map());
const ipOf = req => clean((req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) || 'local', 120).split(',')[0].trim() || 'local';

function tooMany(key) {
  const now = Date.now(), windowMs = 5 * 60 * 1000;
  const recent = (attempts.get(key) || []).filter(t => now - t < windowMs);
  recent.push(now); attempts.set(key, recent);
  return recent.length > 60;
}

function body(req) {
  return typeof req.body === 'object' && req.body ? req.body : JSON.parse(req.body || '{}');
}

/* GET  /api/admin-menu — read back (PIN)
   POST /api/admin-menu — save the live menu (PIN). Takes effect immediately. */
module.exports = async function handler(req, res) {
  if (!['GET','POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok:false, error:'method_not_allowed' });
  }
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  try {
    if (!configured()) return res.status(503).json({ ok:false, configured:false, error:'store_not_configured' });
    if (!adminPinConfigured()) return res.status(503).json({ ok:false, configured:true, error:'admin_pin_not_set' });

    const data = req.method === 'POST' ? body(req) : (req.query || {});
    if (tooMany(ipOf(req))) return res.status(429).json({ ok:false, error:'too_many_attempts' });
    if (!adminPinOk(data.pin || data.password)) return res.status(401).json({ ok:false, error:'wrong_pin' });

    if (req.method === 'GET') {
      const doc = await readMenu();
      return res.status(200).json({ ok:true, configured:true, state:doc && doc.state, revision:doc && doc.revision, updatedAt:doc && doc.updatedAt });
    }

    const state = data.state;
    if (!state || !Array.isArray(state.menu) || !Array.isArray(state.categories) || !state.settings) {
      return res.status(400).json({ ok:false, error:'invalid_state' });
    }
    if (JSON.stringify(state).length > 2_000_000) {
      return res.status(413).json({ ok:false, error:'state_too_large' });
    }
    const doc = await writeMenu(state, { revision:data.revision, updatedBy:ipOf(req), reason:data.reason });
    return res.status(200).json({ ok:true, configured:true, revision:doc.revision, updatedAt:doc.updatedAt });
  } catch (err) {
    return res.status(err.status || 500).json({ ok:false, error:err.message || 'server_error', detail:String(err.detail||'').slice(0,200) });
  }
};
