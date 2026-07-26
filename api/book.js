const esc = value => String(value || '').replace(/[<>&"]/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;' }[c]));
const clean = (value, max) => String(value || '').trim().slice(0, max);
const emailOk = value => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
const dateOk = value => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));
const timeOk = value => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value || ''));
const phoneOk = value => String(value || '').replace(/\D/g, '').length >= 7;
const ipOf = req => clean((req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) || '', 120);
const bookingAttempts = globalThis.__tvBookingAttempts || (globalThis.__tvBookingAttempts = new Map());
const nl2br = value => esc(value).replace(/\n/g, '<br>');

function tooManyBookings(key) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const recent = (bookingAttempts.get(key || 'local') || []).filter(t => now - t < windowMs);
  recent.push(now);
  bookingAttempts.set(key || 'local', recent);
  return recent.length > 8;
}

function bookingRef(data) {
  const seed = `${data.name}|${data.phone}|${data.date}|${data.time}|${Date.now()}`;
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  return `TV-${data.date.replace(/-/g, '')}-${Math.abs(h).toString(36).toUpperCase().slice(0, 5)}`;
}

function emailShell(title, eyebrow, body) {
  return `<!doctype html><html><body style="margin:0;background:#f5f0e3;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#142c2c;">
  <div style="max-width:640px;margin:0 auto;background:#fffaf0;border:1px solid #dfd3bf;border-radius:22px;overflow:hidden;box-shadow:0 18px 42px rgba(24,43,33,.12);">
    <div style="background:linear-gradient(135deg,#173f2a,#0d2f28);padding:26px 28px;color:#fffaf0;">
      <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#d3ba82;font-weight:700;">${esc(eyebrow)}</div>
      <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:31px;line-height:1.05;font-weight:700;">${esc(title)}</h1>
    </div>
    <div style="padding:24px 28px;">${body}</div>
    <div style="padding:16px 28px;background:#f2ead7;color:#6c7368;font-size:12px;line-height:1.5;">
      Tsigoura Verde Resort · This message was sent by the booking form.
    </div>
  </div>
</body></html>`;
}

function detailTable(data, ref) {
  const row = (label, value) => `<tr><td style="padding:10px 0;color:#6c7368;font-size:13px;border-bottom:1px solid #eee3ce;">${esc(label)}</td><td style="padding:10px 0;text-align:right;font-weight:700;border-bottom:1px solid #eee3ce;">${esc(value || '-')}</td></tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
    ${row('Reference', ref)}
    ${row('Name', data.name)}
    ${row('Phone', data.phone)}
    ${row('Email', data.email)}
    ${row('Date', data.date)}
    ${row('Time', data.time)}
    ${row('People', String(data.people))}
  </table>`;
}

async function sendResendEmail(apiKey, payload) {
  const rr = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const text = await rr.text().catch(() => '');
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch (e) {}
  if (!rr.ok) {
    const err = new Error('resend_failed');
    err.status = rr.status;
    err.detail = text.slice(0, 300);
    throw err;
  }
  return json || { ok:true };
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

    if (!data.name || !data.phone || !data.email || !data.date || !data.time) {
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

    const ref = bookingRef(data);
    const ownerSubject = `Νέα κράτηση ${ref} · ${data.date} ${data.time} · ${data.people} άτομα`;
    const ownerHtml = emailShell('Νέα κράτηση τραπεζιού', 'Owner notification', `
      <p style="margin:0 0 18px;color:#344744;font-size:16px;line-height:1.55;">Ήρθε νέο αίτημα κράτησης από το e-menu. Καλέστε ή απαντήστε στον πελάτη για τελική επιβεβαίωση.</p>
      ${detailTable(data, ref)}
      <div style="margin-top:20px;padding:16px;border-radius:16px;background:#f7f1e3;border:1px solid #dfd3bf;">
        <div style="font-size:12px;color:#6c7368;font-weight:700;margin-bottom:6px;">Σημείωση πελάτη</div>
        <div style="font-size:15px;line-height:1.55;">${nl2br(data.message || '-')}</div>
      </div>
      <div style="margin-top:20px;">
        <a href="tel:${esc(data.phone.replace(/\s+/g, ''))}" style="display:inline-block;background:#173f2a;color:#fffaf0;text-decoration:none;border-radius:999px;padding:12px 18px;font-weight:700;margin-right:8px;">Κλήση πελάτη</a>
        ${data.email ? `<a href="mailto:${esc(data.email)}?subject=${encodeURIComponent(`${data.venue} · Επιβεβαίωση κράτησης ${ref}`)}" style="display:inline-block;background:#fffaf0;color:#173f2a;text-decoration:none;border:1px solid #dfd3bf;border-radius:999px;padding:11px 17px;font-weight:700;">Απάντηση email</a>` : ''}
      </div>
      <p style="margin:20px 0 0;color:#7a7569;font-size:12px;line-height:1.5;">Source: ${esc(data.source || '-')}<br>IP: ${esc(data.ip || '-')}<br>User agent: ${esc(data.userAgent || '-')}</p>
    `);

    const ownerResult = await sendResendEmail(apiKey, {
      from,
      to: [to],
      subject: ownerSubject,
      html: ownerHtml,
      reply_to: replyTo,
    });

    let clientResult = null;
    if (data.email) {
      const clientSubject = `${data.venue} · λάβαμε την κράτησή σας ${ref}`;
      const clientHtml = emailShell('Λάβαμε την κράτησή σας', 'Booking request received', `
        <p style="margin:0 0 18px;color:#344744;font-size:16px;line-height:1.55;">Ευχαριστούμε. Λάβαμε το αίτημά σας και θα επικοινωνήσουμε μαζί σας για την τελική επιβεβαίωση.</p>
        ${detailTable(data, ref)}
        ${data.message ? `<div style="margin-top:20px;padding:16px;border-radius:16px;background:#f7f1e3;border:1px solid #dfd3bf;"><div style="font-size:12px;color:#6c7368;font-weight:700;margin-bottom:6px;">Η σημείωσή σας</div><div style="font-size:15px;line-height:1.55;">${nl2br(data.message)}</div></div>` : ''}
        <p style="margin:20px 0 0;color:#7a7569;font-size:13px;line-height:1.5;"><b>Σημαντικό:</b> αυτό το email επιβεβαιώνει ότι λάβαμε το αίτημα. Η κράτηση ολοκληρώνεται όταν σας απαντήσει το κατάστημα.</p>
      `);
      clientResult = await sendResendEmail(apiKey, {
        from,
        to: [data.email],
        subject: clientSubject,
        html: clientHtml,
        reply_to: to,
      });
    }

    return res.status(200).json({
      ok:true,
      bookingRef: ref,
      ownerEmailSent: true,
      clientEmailSent: !!clientResult,
      ownerEmailId: ownerResult && ownerResult.id,
      clientEmailId: clientResult && clientResult.id,
    });
  } catch (err) {
    if (err && err.message === 'resend_failed') {
      return res.status(502).json({ ok:false, error:'resend_failed', detail:String(err.detail || '').slice(0, 300) });
    }
    return res.status(500).json({ ok:false, error:'server_error' });
  }
};
