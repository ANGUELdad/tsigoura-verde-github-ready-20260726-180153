const { put } = require('@vercel/blob');
const {
  adminPinOk, adminPinConfigured, adminPinFromReq, clean
} = require('./_store');

const MAX_BYTES = 4 * 1024 * 1024;
const TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};
const attempts = globalThis.__tvUploadAttempts || (globalThis.__tvUploadAttempts = new Map());
const ipOf = req => clean((req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) || 'local', 120).split(',')[0].trim() || 'local';

function limited(key) {
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter(t => now - t < 60_000);
  attempts.set(key, recent);
  return recent.length >= 30;
}

function record(key) {
  const recent = attempts.get(key) || [];
  recent.push(Date.now());
  attempts.set(key, recent.slice(-30));
}

function safePart(value, fallback) {
  return clean(value, 80)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || fallback;
}

module.exports.config = { api: { bodyParser: false } };

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok:false, error:'method_not_allowed' });
  }

  const ip = ipOf(req);
  if (limited(ip)) return res.status(429).json({ ok:false, error:'too_many_uploads' });
  if (!adminPinConfigured()) return res.status(503).json({ ok:false, error:'admin_pin_not_set' });
  if (!adminPinOk(adminPinFromReq(req))) {
    record(ip);
    return res.status(401).json({ ok:false, error:'wrong_pin' });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    return res.status(503).json({ ok:false, error:'blob_not_configured' });
  }

  const type = clean(req.headers['content-type'], 80).toLowerCase().split(';')[0];
  const length = Number(req.headers['content-length'] || 0);
  if (!TYPES.has(type)) return res.status(415).json({ ok:false, error:'unsupported_image_type' });
  if (!length || length > MAX_BYTES) return res.status(413).json({ ok:false, error:'image_too_large' });

  const kind = req.headers['x-upload-kind'] === 'category' ? 'categories' : 'dishes';
  const id = safePart(req.headers['x-upload-id'], 'item');
  const original = safePart(req.headers['x-file-name'], 'image');
  const pathname = `menu/${kind}/${id}-${original}.${EXTENSIONS[type]}`;

  try {
    const blob = await put(pathname, req, {
      access: 'public',
      addRandomSuffix: true,
      contentType: type,
    });
    record(ip);
    return res.status(201).json({ ok:true, url:blob.url, pathname:blob.pathname });
  } catch (error) {
    return res.status(500).json({ ok:false, error:'upload_failed' });
  }
};
