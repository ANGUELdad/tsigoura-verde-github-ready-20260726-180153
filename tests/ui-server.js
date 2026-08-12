const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.UI_TEST_PORT || 4173);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.woff2': 'font/woff2',
};

/* In-memory stand-in for Vercel KV so admin POST /api/admin-menu is visible to
   guest GET /api/menu in Playwright — same contract as production. */
let liveMenuDoc = null;
let livePublicConfig = null;

const noStoreHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Pragma': 'no-cache',
  'Expires': '0',
};

const sendJson = (res, status, body) => {
  res.writeHead(status, noStoreHeaders);
  res.end(JSON.stringify(body));
};

function readBody(req) {
  return new Promise(resolve => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { resolve({}); }
    });
  });
}

function sanitizePublic(state) {
  const copy = JSON.parse(JSON.stringify(state || {}));
  copy.orders = [];
  if (Array.isArray(copy.tables)) {
    copy.tables = copy.tables.map(table => Object.assign({}, table, { status: 'open', note: '' }));
  } else {
    copy.tables = [];
  }
  return copy;
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === '/api/admin-login') {
    const body = await readBody(req);
    const pin = String(body.pin || '');
    return sendJson(res, pin === 'ui-test-owner' ? 200 : 401, { ok: pin === 'ui-test-owner' });
  }
  if (url.pathname === '/api/status') {
    return sendJson(res, 200, {
      ok: true,
      adminPinSet: true,
      liveStore: { configured: true },
      imageUploads: { configured: true },
    });
  }
  if (url.pathname === '/api/public-config') {
    if (req.method === 'POST') {
      const pin = String(req.headers['x-admin-pin'] || '');
      if (pin !== 'ui-test-owner') {
        return sendJson(res, 401, { ok: false, error: 'wrong_pin' });
      }
      const body = await readBody(req);
      const cfg = body.config || body;
      livePublicConfig = {
        ok: true,
        persisted: true,
        venue: cfg.venue || {},
        contact: cfg.contact || {},
        wifi: cfg.wifi || {},
        legal: cfg.legal || {},
        settings: { serviceOpen: true, acceptOrders: true, traditionalMenuOnly: true },
      };
      return sendJson(res, 200, livePublicConfig);
    }
    return sendJson(res, 200, livePublicConfig || {
      ok: true,
      wifi: { ssid: 'TSIGOURA 5G', pass: 'Tsigoura2023', enc: 'WPA' },
      social: {},
      contact: {},
      legal: {},
    });
  }
  if (url.pathname === '/api/menu') {
    if (!liveMenuDoc || !liveMenuDoc.state) {
      return sendJson(res, 200, { ok: false, configured: true, empty: true });
    }
    const knownRevision = Number(url.searchParams.get('revision')) || 0;
    const revision = Number(liveMenuDoc.revision) || 0;
    if (knownRevision && revision && knownRevision >= revision) {
      return sendJson(res, 200, {
        ok: true,
        configured: true,
        unchanged: true,
        revision,
        updatedAt: liveMenuDoc.updatedAt,
      });
    }
    return sendJson(res, 200, {
      ok: true,
      configured: true,
      state: sanitizePublic(liveMenuDoc.state),
      revision,
      updatedAt: liveMenuDoc.updatedAt,
    });
  }
  if (url.pathname === '/api/admin-menu') {
    const pin = String(req.headers['x-admin-pin'] || '');
    if (pin !== 'ui-test-owner') {
      return sendJson(res, 401, { ok: false, error: 'wrong_pin' });
    }
    if (req.method === 'POST') {
      const body = await readBody(req);
      if (!body.state || !Array.isArray(body.state.menu) || !Array.isArray(body.state.categories)) {
        return sendJson(res, 400, { ok: false, error: 'invalid_state' });
      }
      const revision = Number(body.revision) || Date.now();
      /* Keep ops on admin writes (match production sanitizeMenuState). */
      liveMenuDoc = {
        state: body.state,
        revision,
        updatedAt: new Date().toISOString(),
      };
      return sendJson(res, 200, { ok: true, configured: true, revision, updatedAt: liveMenuDoc.updatedAt });
    }
    if (!liveMenuDoc) {
      return sendJson(res, 200, { ok: true, configured: true, state: null, revision: 0, updatedAt: null });
    }
    return sendJson(res, 200, {
      ok: true,
      configured: true,
      state: liveMenuDoc.state,
      revision: liveMenuDoc.revision,
      updatedAt: liveMenuDoc.updatedAt,
    });
  }
  if (url.pathname === '/api/admin-history') {
    return sendJson(res, 200, { ok: true, backups: [], history: [] });
  }
  if (url.pathname === '/api/admin-upload') {
    await readBody(req);
    return sendJson(res, 400, { ok: false, error: 'no_file' });
  }

  const requested = url.pathname === '/' ? '/index.html' : url.pathname;
  const file = path.resolve(root, `.${requested}`);
  if (!file.startsWith(`${root}${path.sep}`)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) {
      res.writeHead(404);
      return res.end('Not found');
    }
    const ext = path.extname(file).toLowerCase();
    const headers = {
      'Content-Type': mime[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    };
    if (ext === '.js' || ext === '.html') {
      headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0';
      headers.Pragma = 'no-cache';
      headers.Expires = '0';
    }
    res.writeHead(200, headers);
    fs.createReadStream(file).pipe(res);
  });
}).listen(port, '127.0.0.1', () => {
  process.stdout.write(`UI test server listening on ${port}\n`);
});
