const esc = value => String(value || '').replace(/[<>&"]/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;' }[c]));
const clean = (value, max) => String(value || '').trim().slice(0, max);
const emailOk = value => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
const dateOk = value => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));
const timeOk = value => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value || ''));
const phoneOk = value => String(value || '').replace(/\D/g, '').length >= 7;
const ipOf = req => clean((req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) || '', 120);
const bookingAttempts = globalThis.__tvBookingAttempts || (globalThis.__tvBookingAttempts = new Map());

function tooManyBookings(key) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const recent = (bookingAttempts.get(key || 'local') || []).filter(t => now - t < windowMs);
  recent.push(now);
  bookingAttempts.set(key || 'local', recent);
  return recent.length > 8;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok:false, error:'method_not_allowed' });
  }

  try {
    const p = typeof req.body === 'object' && req.body ? req.body : JSON.parse(req.body || '{}');
    if (clean(p.company || p.website || p.url, 120)) {
      return res.status(200).json({ ok:true });
    }
    const ip = ipOf(req);
    if (tooManyBookings(ip)) {
      return res.status(429).json({ ok:false, error:'too_many_requests' });
    }

    const data = {
      venue: clean(p.venue, 80) || 'Tsigoura Verde Resort',
      name: clean(p.name, 80),
      phone: clean(p.phone, 40),
      email: clean(p.email, 100),
      date: clean(p.date, 20),
      time: clean(p.time, 20),
      people: Math.max(1, Math.min(80, parseInt(p.people, 10) || 1)),
      message: clean(p.message, 500),
      lang: clean(p.lang, 8),
      source: clean(p.source, 300),
      ip,
      userAgent: clean(req.headers && req.headers['user-agent'], 240),
    };

    if (!data.name || !data.phone || !data.date || !data.time) {
      return res.status(400).json({ ok:false, error:'missing_fields' });
    }
    if (!dateOk(data.date) || !timeOk(data.time) || !emailOk(data.email) || !phoneOk(data.phone)) {
      return res.status(400).json({ ok:false, error:'invalid_fields' });
    }
    const when = new Date(`${data.date}T${data.time}:00`);
    if (Number.isNaN(when.getTime())) {
      return res.status(400).json({ ok:false, error:'invalid_date' });
    }
    const min = new Date(); min.setHours(0, 0, 0, 0); min.setDate(min.getDate() - 1);
    const max = new Date(); max.setHours(23, 59, 59, 999); max.setFullYear(max.getFullYear() + 2);
    if (when < min || when > max) {
      return res.status(400).json({ ok:false, error:'invalid_date_range' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.BOOKING_TO_EMAIL || process.env.BOOKING_EMAIL || process.env.RESEND_TO_EMAIL;
    const from = process.env.BOOKING_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || 'Tsigoura Verde Resort <onboarding@resend.dev>';
    const replyTo = process.env.BOOKING_REPLY_TO || data.email || undefined;
    if (!apiKey || !to) return res.status(503).json({ ok:false, error:'email_not_configured' });

    const subject = `${data.venue} booking request · ${data.date} ${data.time}`;
    const html = `
      <h2>${esc(data.venue)} booking request</h2>
      <p><b>Name:</b> ${esc(data.name)}</p>
      <p><b>Phone:</b> ${esc(data.phone)}</p>
      <p><b>Email:</b> ${esc(data.email || '-')}</p>
      <p><b>Date:</b> ${esc(data.date)}</p>
      <p><b>Time:</b> ${esc(data.time)}</p>
      <p><b>People:</b> ${esc(data.people)}</p>
      <p><b>Message:</b><br>${esc(data.message || '-').replace(/\n/g, '<br>')}</p>
      <hr>
      <p style="color:#667">Language: ${esc(data.lang || '-')}</p>
      <p style="color:#667">Source: ${esc(data.source || '-')}</p>
      <p style="color:#667">IP: ${esc(data.ip || '-')}</p>
      <p style="color:#667">User agent: ${esc(data.userAgent || '-')}</p>`;

    const rr = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject, html, reply_to: replyTo }),
    });

    if (!rr.ok) {
      const text = await rr.text().catch(() => '');
      return res.status(502).json({ ok:false, error:'resend_failed', detail:text.slice(0, 300) });
    }

    return res.status(200).json({ ok:true });
  } catch (err) {
    return res.status(500).json({ ok:false, error:'server_error' });
  }
};
