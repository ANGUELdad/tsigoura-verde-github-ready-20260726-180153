const { configured, readMenuState } = require('./_supabase');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok:false, error:'method_not_allowed' });
  }
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  try {
    if (!configured()) return res.status(200).json({ ok:false, configured:false, error:'supabase_not_configured' });
    const row = await readMenuState();
    if (!row || !row.state) return res.status(200).json({ ok:false, configured:true, empty:true });
    return res.status(200).json({ ok:true, configured:true, state:row.state, revision:row.revision, updatedAt:row.updated_at });
  } catch (err) {
    return res.status(err.status || 500).json({
      ok:false,
      configured:true,
      error:err.message || 'server_error',
      detail:String(err.detail || '').slice(0, 300),
    });
  }
};
