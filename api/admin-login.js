const clean = (value, max = 200) => String(value || '').trim().slice(0, max);
const attempts = globalThis.__tvAdminLoginAttempts || (globalThis.__tvAdminLoginAttempts = new Map());
const ipOf = req => clean((req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) || 'local', 120).split(',')[0].trim() || 'local';

function tooManyAttempts(key) {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000;
  const recent = (attempts.get(key) || []).filter(t => now - t < windowMs);
  recent.push(now);
  attempts.set(key, recent);
  return recent.length > 12;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok:false, error:'method_not_allowed' });
  }

  try {
    const body = typeof req.body === 'object' && req.body ? req.body : JSON.parse(req.body || '{}');
    const pin = clean(body.pin || body.password, 120);
    const expected = clean(process.env.ADMIN_PIN || process.env.ADMIN_PASSWORD || process.env.TSIGOURA_ADMIN_PIN, 120);
    const ip = ipOf(req);

    if (tooManyAttempts(ip)) {
      return res.status(429).json({ ok:false, error:'too_many_attempts' });
    }

    if (!expected) {
      return res.status(503).json({ ok:false, error:'admin_pin_not_configured' });
    }
    if (pin && pin === expected) {
      return res.status(200).json({ ok:true });
    }
    return res.status(401).json({ ok:false, error:'wrong_pin' });
  } catch (err) {
    return res.status(400).json({ ok:false, error:'bad_request' });
  }
};
