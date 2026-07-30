const { configured, readMenu, sanitizeMenuState } = require('./_store');

/* GET /api/menu — public. Returns the live menu if a store is attached. */
module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok:false, error:'method_not_allowed' });
  }
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  try {
    if (!configured()) return res.status(200).json({ ok:false, configured:false, error:'store_not_configured' });
    const doc = await readMenu();
    if (!doc) return res.status(200).json({ ok:false, configured:true, empty:true });
    const knownRevision = Number(req.query && req.query.revision) || 0;
    if (knownRevision && knownRevision >= Number(doc.revision || 0)) {
      return res.status(200).json({ ok:true, configured:true, unchanged:true, revision:doc.revision, updatedAt:doc.updatedAt });
    }
    return res.status(200).json({ ok:true, configured:true, state:sanitizeMenuState(doc.state, { public:true }), revision:doc.revision, updatedAt:doc.updatedAt });
  } catch (err) {
    return res.status(200).json({ ok:false, configured:true, error:err.message || 'server_error' });
  }
};
