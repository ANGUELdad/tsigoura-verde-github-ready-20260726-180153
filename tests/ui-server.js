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
const sendJson = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(body));
};

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === '/api/admin-login') {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      let pin = '';
      try { pin = JSON.parse(raw || '{}').pin || ''; } catch {}
      sendJson(res, pin === 'ui-test-owner' ? 200 : 401, { ok: pin === 'ui-test-owner' });
    });
    return;
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
    return sendJson(res, 200, {
      ok: true,
      wifi: { ssid: 'TSIGOURA 5G', pass: 'Tsigoura2023', enc: 'WPA' },
      social: {},
      contact: {},
      legal: {},
    });
  }
  if (url.pathname === '/api/menu') {
    return sendJson(res, 503, { ok: false, error: 'fixture_uses_static_menu' });
  }
  if (url.pathname === '/api/admin-menu') {
    if (req.method === 'POST') {
      req.resume();
      return req.on('end', () => sendJson(res, 200, { ok: true, revision: Date.now() }));
    }
    return sendJson(res, 503, { ok: false, error: 'fixture_uses_local_admin_state' });
  }
  if (url.pathname === '/api/admin-history') {
    return sendJson(res, 200, { ok: true, backups: [], history: [] });
  }
  if (url.pathname === '/api/admin-upload') {
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
    res.writeHead(200, {
      'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    fs.createReadStream(file).pipe(res);
  });
}).listen(port, '127.0.0.1', () => {
  process.stdout.write(`UI test server listening on ${port}\n`);
});
