const assert = require('assert');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const closeButtons = html.match(
  /<button type="button" class="close" data-x aria-label="Close">✕<\/button>/g
) || [];

assert.strictEqual(closeButtons.length, 11, 'every customer sheet needs an accessible close button');
assert.match(
  html,
  /document\.addEventListener\('pointerdown',e=>\{\s*const close=e\.target\.closest\('\[data-x\]'\);/,
  'sheet close buttons must capture pointerdown so taps cannot be lost during animation'
);
assert.match(
  html,
  /document\.addEventListener\('pointerup',e=>\{[\s\S]*?closeSheets\(\);\s*\},\{capture:true\}\);/,
  'sheet close buttons must dismiss on pointerup without clicking through to the menu'
);
assert.match(
  html,
  /\.sheet \.close\{[^}]*width:44px;height:44px;/s,
  'sheet close buttons need a 44px touch target'
);
assert.match(
  html,
  /\.sheet\.on > \*:not\(\.grip\):not\(\.close\)/,
  'sheet entrance animation must not move the close control'
);

[
  ['wifiBtn', /id="wifiBtn"/, /wb\.onclick=\(\)=>\{renderWifi\(\);openSheet\('wifiSheet'\);\}/],
  ['socialBtn', /id="socialBtn"/, /sb\.onclick=\(\)=>\{ renderSocial\(\); openSheet\('socialSheet'\); \}/],
  ['langBtn', /id="langBtn"/, /document\.getElementById\('langBtn'\)\.onclick=/],
  ['clearSearch', /id="clearSearch"/, /clearBtn\.onclick=clearSearch/],
  ['privacy', /id="privLink"/, /pl\.onclick=\(\)=>\{ renderPriv\(\); openSheet\('privSheet'\); \}/],
].forEach(([name, control, handler]) => {
  assert.match(html, control, `${name} control is missing`);
  assert.match(html, handler, `${name} handler is missing`);
});

console.log(`UI interaction contract: ${closeButtons.length} sheets and 5 primary control paths verified`);
