const {
  adminPinOk, adminPinConfigured, clean, parseJsonBody,
  applyCors, handlePreflight, createAdminSessionToken,
  buildSessionCookie, appendSetCookie, SESSION_MAX_AGE_SEC
} = require('./_store');

const attempts = globalThis.__tvAdminLoginAttempts || (globalThis.__tvAdminLoginAttempts = new Map());
const ipOf = req => clean((req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) || 'local', 120).split(',')[0].trim() || 'local';

function blocked(key) {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000;
  const recent = (attempts.get(key) || []).filter(t => now - t < windowMs);
  attempts.set(key, recent);
  return recent.length >= 12;
}
function failed(key) {
  const recent = attempts.get(key) || [];
  recent.push(Date.now());
  attempts.set(key, recent.slice(-12));
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  if (handlePreflight(req, res)) return;
  applyCors(req, res);

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ ok:false, error:'method_not_allowed' });
  }

  try {
    const body = await parseJsonBody(req);
    const pin = clean(body.pin || body.password, 120);
    const ip = ipOf(req);

    if (blocked(ip)) {
      return res.status(429).json({ ok:false, error:'too_many_attempts' });
    }

    if (!adminPinConfigured()) {
      return res.status(503).json({ ok:false, error:'admin_pin_not_configured' });
    }
    if (adminPinOk(pin)) {
      attempts.delete(ip);
      const token = createAdminSessionToken(pin, SESSION_MAX_AGE_SEC);
      appendSetCookie(res, buildSessionCookie(token, req, SESSION_MAX_AGE_SEC));
      return res.status(200).json({ ok:true, session:true });
    }
    failed(ip);
    return res.status(401).json({ ok:false, error:'wrong_pin' });
  } catch (err) {
    return res.status(400).json({ ok:false, error:'bad_request' });
  }
};
