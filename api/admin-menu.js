const {
  configured, readMenu, writeMenu, adminPinOk, adminPinConfigured,
  adminPinFromReq, sanitizeMenuState, validateMenuState, clean, storeKind,
  parseJsonBody, applyCors, handlePreflight
} = require('./_store');

const attempts = globalThis.__tvMenuAttempts || (globalThis.__tvMenuAttempts = new Map());
const ipOf = req => clean((req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) || 'local', 120).split(',')[0].trim() || 'local';

function blocked(key) {
  const now = Date.now(), windowMs = 5 * 60 * 1000;
  const recent = (attempts.get(key) || []).filter(t => now - t < windowMs);
  attempts.set(key, recent);
  return recent.length >= 12;
}
function failed(key) {
  const recent = attempts.get(key) || [];
  recent.push(Date.now());
  attempts.set(key, recent.slice(-12));
}

/* GET  /api/admin-menu — read back (PIN)
   POST /api/admin-menu — save the live menu (PIN). Takes effect immediately. */
module.exports = async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  applyCors(req, res);

  if (!['GET','POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(405).json({ ok:false, error:'method_not_allowed' });
  }
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  try {
    if (!configured()) return res.status(503).json({ ok:false, configured:false, error:'store_not_configured' });
    if (!adminPinConfigured()) return res.status(503).json({ ok:false, configured:true, error:'admin_pin_not_set' });

    let data = {};
    if (req.method === 'POST') {
      try {
        data = await parseJsonBody(req);
      } catch (e) {
        if (e && e.status === 413) return res.status(413).json({ ok:false, error:'body_too_large' });
        return res.status(400).json({ ok:false, error:'invalid_json' });
      }
    }
    const ip = ipOf(req);
    if (blocked(ip)) return res.status(429).json({ ok:false, error:'too_many_attempts' });
    if (!adminPinOk(adminPinFromReq(req, data))) {
      failed(ip);
      return res.status(401).json({ ok:false, error:'wrong_pin' });
    }
    attempts.delete(ip);

    if (req.method === 'GET') {
      const doc = await readMenu();
      return res.status(200).json({
        ok:true, configured:true, store:storeKind(),
        state:doc && doc.state, revision:doc && doc.revision, updatedAt:doc && doc.updatedAt
      });
    }

    if (!data || typeof data !== 'object' || data.state == null) {
      return res.status(400).json({ ok:false, error:'invalid_state' });
    }
    const state = sanitizeMenuState(data.state, { resetOps: !!data.resetOps });
    const invalid = validateMenuState(state);
    if (invalid) return res.status(400).json({ ok:false, error:invalid });
    if (JSON.stringify(state).length > 2_000_000) {
      return res.status(413).json({ ok:false, error:'state_too_large' });
    }
    const doc = await writeMenu(state, { revision:data.revision, updatedBy:ipOf(req), reason:data.reason });
    return res.status(200).json({
      ok:true, configured:true, store:storeKind(),
      revision:doc.revision, updatedAt:doc.updatedAt
    });
  } catch (err) {
    return res.status(err.status || 500).json({ ok:false, error:err.message || 'server_error', detail:String(err.detail||'').slice(0,200) });
  }
};
