const {
  configured, storeKind, readPublicConfig, writePublicConfig, sanitizePublicConfig,
  adminPinOk, adminPinConfigured, adminPinFromReq, clean,
  parseJsonBody, applyCors, handlePreflight
} = require('./_store');

const attempts = globalThis.__tvPublicConfigAttempts || (globalThis.__tvPublicConfigAttempts = new Map());
const ipOf = req => clean((req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) || 'local', 120).split(',')[0].trim() || 'local';

function blocked(key) {
  const now = Date.now(), windowMs = 5 * 60 * 1000;
  const recent = (attempts.get(key) || []).filter(t => now - t < windowMs);
  attempts.set(key, recent);
  return recent.length >= 12;
}
function failed(key) {
  const recent = attempts.get(key) || [];
  recent.push(Date.now());
  attempts.set(key, recent.slice(-12));
}

const env = (name, fallback = '') => String(process.env[name] || fallback);
const boolEnv = (name, fallback) => {
  const raw = process.env[name];
  if (raw == null || raw === '') return fallback;
  return /^(1|true|yes|on)$/i.test(String(raw).trim());
};
const wifiValue = (name, fallback) => {
  const value = env(name, fallback).trim();
  if (name === 'PUBLIC_WIFI_SSID' && /^TSIGOURA$/i.test(value)) return 'TSIGOURA 5G';
  if (name === 'PUBLIC_WIFI_PASS' && value === 'tsigoura2023') return 'Tsigoura2023';
  return value || fallback;
};

/* Env dump historically used PUBLIC_BOOKING_EMAIL; accept it as alias. */
function contactEmailEnv() {
  return env('PUBLIC_CONTACT_EMAIL') || env('PUBLIC_BOOKING_EMAIL') || 'reservations@tsigouraverderesort.gr';
}

function envDefaults() {
  return {
    venue: {
      name: env('PUBLIC_VENUE_NAME', 'Tsigoura Verde Resort'),
      subtitle: env('PUBLIC_VENUE_SUBTITLE', ''),
    },
    contact: {
      email: contactEmailEnv(),
      phone: env('PUBLIC_PHONE'),
      instagram: env('PUBLIC_INSTAGRAM'),
      facebook: env('PUBLIC_FACEBOOK'),
      maps: env('PUBLIC_MAPS_URL'),
      website: env('PUBLIC_WEBSITE_URL'),
    },
    wifi: {
      ssid: wifiValue('PUBLIC_WIFI_SSID', 'TSIGOURA 5G'),
      pass: wifiValue('PUBLIC_WIFI_PASS', 'Tsigoura2023'),
      enc: env('PUBLIC_WIFI_ENC', 'WPA'),
    },
    settings: {
      serviceOpen: boolEnv('PUBLIC_SERVICE_OPEN', true),
      acceptOrders: boolEnv('PUBLIC_ACCEPT_ORDERS', true),
      traditionalMenuOnly: boolEnv('PUBLIC_TRADITIONAL_MENU_ONLY', true),
    },
    legal: {
      companyName: env('PUBLIC_COMPANY_NAME'),
      afm: env('PUBLIC_AFM'),
      doy: env('PUBLIC_DOY'),
      gemi: env('PUBLIC_GEMI'),
      address: env('PUBLIC_ADDRESS'),
      mhte: env('PUBLIC_MHTE'),
      agoranomikos: env('PUBLIC_AGORANOMIKOS'),
    },
  };
}

function pick(stored, fallback) {
  const value = stored == null ? '' : String(stored).trim();
  return value || fallback;
}

function mergeSection(defaults, stored, keys) {
  const out = {};
  const src = stored && typeof stored === 'object' ? stored : {};
  keys.forEach(key => {
    out[key] = pick(src[key], defaults[key] == null ? '' : defaults[key]);
  });
  return out;
}

/* Stored admin overrides win over env defaults; env remains the fallback. */
function mergePublicConfig(defaults, stored) {
  const s = stored && typeof stored === 'object' ? stored : {};
  return {
    venue: mergeSection(defaults.venue, s.venue, ['name', 'subtitle']),
    contact: mergeSection(defaults.contact, s.contact, ['email', 'phone', 'instagram', 'facebook', 'maps', 'website']),
    wifi: mergeSection(defaults.wifi, s.wifi, ['ssid', 'pass', 'enc']),
    settings: defaults.settings,
    legal: mergeSection(defaults.legal, s.legal, ['companyName', 'afm', 'doy', 'gemi', 'address', 'mhte', 'agoranomikos']),
  };
}

function buildPublicPayload(merged, meta = {}) {
  return Object.assign({ ok: true }, merged, meta);
}

module.exports = async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  applyCors(req, res);

  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');

  const defaults = envDefaults();

  if (req.method === 'GET') {
    let storedDoc = null;
    if (configured()) {
      try {
        storedDoc = await readPublicConfig();
      } catch (e) {
        storedDoc = null;
      }
    }
    const merged = mergePublicConfig(defaults, storedDoc && storedDoc.config);
    return res.status(200).json(buildPublicPayload(merged, {
      persisted: !!(storedDoc && storedDoc.config),
      updatedAt: storedDoc && storedDoc.updatedAt || null,
      store: configured() ? storeKind() : 'none',
    }));
  }

  /* POST — admin-only save of venue/contact/wifi/legal overrides */
  try {
    if (!configured()) return res.status(503).json({ ok: false, configured: false, error: 'store_not_configured' });
    if (!adminPinConfigured()) return res.status(503).json({ ok: false, configured: true, error: 'admin_pin_not_set' });

    let data = {};
    try {
      data = await parseJsonBody(req);
    } catch (e) {
      if (e && e.status === 413) return res.status(413).json({ ok: false, error: 'body_too_large' });
      return res.status(400).json({ ok: false, error: 'invalid_json' });
    }

    const ip = ipOf(req);
    if (blocked(ip)) return res.status(429).json({ ok: false, error: 'too_many_attempts' });
    if (!adminPinOk(adminPinFromReq(req, data))) {
      failed(ip);
      return res.status(401).json({ ok: false, error: 'wrong_pin' });
    }
    attempts.delete(ip);

    const incoming = data.config && typeof data.config === 'object' ? data.config : data;
    const sanitized = sanitizePublicConfig(incoming);
    const doc = await writePublicConfig(sanitized, { updatedBy: ip });
    const merged = mergePublicConfig(defaults, doc.config);
    return res.status(200).json(buildPublicPayload(merged, {
      saved: true,
      persisted: true,
      updatedAt: doc.updatedAt,
      store: storeKind(),
    }));
  } catch (err) {
    return res.status(err.status || 500).json({
      ok: false,
      error: err.message || 'server_error',
      detail: String(err.detail || '').slice(0, 200),
    });
  }
};
