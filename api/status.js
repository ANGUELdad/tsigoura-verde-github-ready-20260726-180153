/**
 * GET /api/status
 *
 * Setup check for the owner. Reports which environment settings are present.
 * Never returns a key or a secret, so it is safe to open in a browser.
 *
 * Menu source, best first: the live KV store (/api/menu), then the published
 * file `menu-live.js`, then the built-in catalogue in tsigoura-data.js.
 */
const { configured } = require('./_store');
const present = name => !!String(process.env[name] || '').trim();

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');

  const out = {
    ok: true,
    checkedAt: new Date().toISOString(),
    liveStore: {
      configured: configured(),
      kind: 'vercel-kv',
      howToEnable: 'Vercel → Storage → Create → KV. The connection variables are added automatically; just redeploy.',
    },
    menuSource: {
      kind: configured() ? 'live-store' : 'script-file',
      file: 'menu-live.js',
      howToPublish: 'With a KV store attached, admin edits go live instantly. Without one, use /admin → Ρυθμίσεις → "Κατέβασμα menu-live.js" → replace the file → redeploy.',
    },
    adminPinSet: present('ADMIN_PIN') || present('ADMIN_PASSWORD') || present('TSIGOURA_ADMIN_PIN'),
    imageUploads: {
      configured: present('BLOB_READ_WRITE_TOKEN') || present('BLOB_STORE_ID'),
      kind: 'vercel-blob',
      auth: present('BLOB_STORE_ID') ? 'oidc' : present('BLOB_READ_WRITE_TOKEN') ? 'read-write-token' : 'not-configured',
      howToEnable: 'Vercel → Storage → Create → Blob. Vercel connects it with short-lived OIDC credentials automatically; redeploy once.',
    },
    menuMode: {
      serviceOpen: String(process.env.PUBLIC_SERVICE_OPEN ?? 'true'),
      acceptOrders: String(process.env.PUBLIC_ACCEPT_ORDERS ?? 'true'),
      traditionalMenuOnly: String(process.env.PUBLIC_TRADITIONAL_MENU_ONLY ?? 'true'),
      note: 'Used only when menu-live.js has not been published yet. Once published, the file decides.',
    },
    nextStep: '',
  };

  if (!out.liveStore.configured) {
    out.nextStep = 'No live database yet. Vercel → Storage → Create → KV, attach it to this project, redeploy. Until then the menu uses the published menu-live.js file.';
  } else if (!out.adminPinSet) {
    out.nextStep = 'Database connected. Now set ADMIN_PIN in Vercel → Settings → Environment Variables — live saving is blocked without it.';
  } else if (!out.imageUploads.configured) {
    out.nextStep = 'Live menu is ready. Add Vercel Blob in Storage to enable image uploads from phones and computers.';
  } else {
    out.nextStep = 'All set. Admin changes save to the database instantly and reach every phone with no redeploy.';
  }

  return res.status(200).json(out);
};
