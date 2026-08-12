const { clean, parseJsonBody, applyCors, handlePreflight } = require('./_store');

const attempts = globalThis.__tvBookAttempts || (globalThis.__tvBookAttempts = new Map());
const ipOf = req => clean((req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) || 'local', 120).split(',')[0].trim() || 'local';

function blocked(key) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const recent = (attempts.get(key) || []).filter(t => now - t < windowMs);
  attempts.set(key, recent);
  return recent.length >= 8;
}
function hit(key) {
  const recent = attempts.get(key) || [];
  recent.push(Date.now());
  attempts.set(key, recent.slice(-8));
}

function env(...names) {
  for (const name of names) {
    const value = clean(process.env[name], 300);
    if (value) return value;
  }
  return '';
}

function bookingToEmail() {
  return env('BOOKING_TO_EMAIL', 'BOOKING_EMAIL', 'PUBLIC_CONTACT_EMAIL', 'PUBLIC_BOOKING_EMAIL')
    || 'reservations@tsigouraverderesort.gr';
}

function bookingFromEmail() {
  return env('BOOKING_FROM_EMAIL', 'RESEND_FROM_EMAIL')
    || 'Tsigoura Verde Resort <onboarding@resend.dev>';
}

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
}

function sanitizePayload(raw) {
  const src = raw && typeof raw === 'object' ? raw : {};
  return {
    name: clean(src.name, 80),
    phone: clean(src.phone, 40),
    email: clean(src.email, 100),
    date: clean(src.date, 32),
    time: clean(src.time, 16),
    people: Math.max(1, Math.min(80, parseInt(src.people, 10) || 1)),
    message: clean(src.message, 500),
    lang: clean(src.lang, 8) || 'el',
    source: clean(src.source, 300),
  };
}

async function sendWithResend(payload) {
  const apiKey = env('RESEND_API_KEY');
  if (!apiKey) {
    const err = new Error('resend_not_configured');
    err.status = 503;
    throw err;
  }
  const to = bookingToEmail();
  const from = bookingFromEmail();
  const subject = `Booking request · ${payload.date} ${payload.time} · ${payload.name}`;
  const text = [
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email || '-'}`,
    `Date: ${payload.date}`,
    `Time: ${payload.time}`,
    `People: ${payload.people}`,
    `Lang: ${payload.lang}`,
    `Source: ${payload.source || '-'}`,
    '',
    'Message:',
    payload.message || '-',
  ].join('\n');

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email || undefined,
      subject,
      text,
    }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const err = new Error((data && (data.message || data.name)) || 'resend_failed');
    err.status = 502;
    err.detail = String((data && data.message) || '').slice(0, 200);
    throw err;
  }
  return data;
}

module.exports = async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  applyCors(req, res);
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  try {
    const ip = ipOf(req);
    if (blocked(ip)) return res.status(429).json({ ok: false, error: 'too_many_attempts' });

    let body = {};
    try {
      body = await parseJsonBody(req);
    } catch (e) {
      if (e && e.status === 413) return res.status(413).json({ ok: false, error: 'body_too_large' });
      return res.status(400).json({ ok: false, error: 'invalid_json' });
    }

    const payload = sanitizePayload(body);
    if (!payload.name || !payload.phone || !payload.date || !payload.time) {
      return res.status(400).json({ ok: false, error: 'missing_fields' });
    }
    if (payload.email && !isEmail(payload.email)) {
      return res.status(400).json({ ok: false, error: 'invalid_email' });
    }

    hit(ip);
    const sent = await sendWithResend(payload);
    return res.status(200).json({ ok: true, id: sent && sent.id || null });
  } catch (err) {
    return res.status(err.status || 500).json({
      ok: false,
      error: err.message || 'server_error',
      detail: String(err.detail || '').slice(0, 200),
    });
  }
};
