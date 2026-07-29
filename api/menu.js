const { configured, readMenu } = require('./_store');

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
    return res.status(200).json({ ok:true, configured:true, state:doc.state, revision:doc.revision, updatedAt:doc.updatedAt });
  } catch (err) {
    return res.status(200).json({ ok:false, configured:true, error:err.message || 'server_error' });
  }
};
