const { configured, readMenu, sanitizeMenuState } = require('./_store');

function queryOf(req) {
  if (req && req.query && typeof req.query === 'object') return req.query;
  try {
    const raw = String((req && req.url) || '');
    const u = new URL(raw, 'http://local.invalid');
    return Object.fromEntries(u.searchParams.entries());
  } catch (e) {
    return {};
  }
}

function setNoStore(res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Vary', '*');
}

/* GET /api/menu — public. Returns the live menu if a store is attached. */
module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok:false, error:'method_not_allowed' });
  }
  setNoStore(res);
  try {
    if (!configured()) return res.status(200).json({ ok:false, configured:false, error:'store_not_configured' });
    const doc = await readMenu();
    if (!doc || !doc.state) return res.status(200).json({ ok:false, configured:true, empty:true });
    const q = queryOf(req);
    const knownRevision = Number(q.revision) || 0;
    const revision = Number(doc.revision) || 0;
    if (knownRevision && revision && knownRevision >= revision) {
      return res.status(200).json({ ok:true, configured:true, unchanged:true, revision, updatedAt:doc.updatedAt });
    }
    return res.status(200).json({
      ok:true,
      configured:true,
      state:sanitizeMenuState(doc.state, { public:true }),
      revision,
      updatedAt:doc.updatedAt
    });
  } catch (err) {
    return res.status(200).json({ ok:false, configured:true, error:err.message || 'server_error' });
  }
};
