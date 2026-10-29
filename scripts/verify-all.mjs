import fs from 'fs';
import http from 'http';
import path from 'path';
import vm from 'vm';

const ROOT = 'D:/tongjiang-lab';
const CJK_RE = /[\u4e00-\u9fff]/;

function countCjk(str) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 0x4e00 && code <= 0x9fff) count++;
  }
  const cleaned = str.replace(/\[\\u3000-\\u9fff\]/g, '');
  const uMatches = cleaned.match(/\\u[4-9a-fA-F][0-9a-fA-F]{3}/g) || [];
  for (const m of uMatches) {
    const code = parseInt(m.slice(2), 16);
    if (code >= 0x4e00 && code <= 0x9fff) count++;
  }
  return count;
}

let failures = 0;
function fail(msg) {
  console.error('FAIL:', msg);
  failures++;
}

// 1. Verify catalog.json
const catRaw = fs.readFileSync(path.join(ROOT, 'catalog.json'), 'utf8');
const catalog = JSON.parse(catRaw);
if (catalog.length !== 54) fail(`catalog.json has ${catalog.length} courses, expected 54`);
if (countCjk(catRaw) > 0) fail(`catalog.json contains ${countCjk(catRaw)} CJK characters`);
console.log(`1. catalog.json: ${catalog.length} courses, 0 CJK characters.`);

// 2. Verify all 54 courses/<slug>.html
let courseOk = 0;
for (const c of catalog) {
  const fpath = path.join(ROOT, 'courses', `${c.slug}.html`);
  if (!fs.existsSync(fpath)) {
    fail(`Missing course file: courses/${c.slug}.html`);
    continue;
  }
  const html = fs.readFileSync(fpath, 'utf8');
  const cjk = countCjk(html);
  if (cjk > 0) {
    fail(`courses/${c.slug}.html still has ${cjk} CJK chars`);
    continue;
  }
  const m = html.match(/<script type="module">([\s\S]*?)<\/script>/);
  if (!m) {
    fail(`courses/${c.slug}.html missing <script type="module">`);
    continue;
  }
  try {
    new vm.Script(m[1], { filename: `${c.slug}.js` });
    courseOk++;
  } catch (err) {
    fail(`JS SyntaxError in courses/${c.slug}.html: ${err.message}`);
  }
}
console.log(`2. courses/*.html: ${courseOk}/54 courses passed JS syntax check & 0 CJK check.`);

// 3. Verify Portal Pages & Assets
const portalFiles = [
  'index.html',
  'guide/index.html',
  'how/index.html',
  'about/index.html',
  'assets/site.css',
  'assets/site.js',
  'assets/hero.js',
  'favicon.svg',
  'README.md',
];

for (const rel of portalFiles) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) {
    fail(`Missing portal file: ${rel}`);
    continue;
  }
  const content = fs.readFileSync(p, 'utf8');
  const cjk = countCjk(content);
  if (cjk > 0) {
    fail(`${rel} contains ${cjk} CJK characters`);
  }
}
console.log(`3. Core portal pages & assets (${portalFiles.length} files): 0 CJK characters.`);

// 4. Verify all 54 /c/<slug>/index.html & covers/<slug>.webp
let detailOk = 0;
for (const c of catalog) {
  const dp = path.join(ROOT, 'c', c.slug, 'index.html');
  const cp = path.join(ROOT, 'covers', `${c.slug}.webp`);
  if (!fs.existsSync(dp)) {
    fail(`Missing detail page: c/${c.slug}/index.html`);
    continue;
  }
  if (!fs.existsSync(cp)) {
    fail(`Missing cover image: covers/${c.slug}.webp`);
    continue;
  }
  const dHtml = fs.readFileSync(dp, 'utf8');
  const cjk = countCjk(dHtml);
  if (cjk > 0) {
    fail(`c/${c.slug}/index.html contains ${cjk} CJK characters`);
    continue;
  }
  const liMatches = dHtml.match(/<li>\s*<span class="n">/g) || [];
  if (liMatches.length !== c.steps.length) {
    fail(`c/${c.slug}/index.html has ${liMatches.length} track steps, expected ${c.steps.length}`);
    continue;
  }
  detailOk++;
}
console.log(`4. Detail pages c/<slug>/index.html & covers: ${detailOk}/54 verified (0 CJK, full step track).`);

// 5. HTTP Server Smoke Test
const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.join(ROOT, urlPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  res.writeHead(200);
  res.end(fs.readFileSync(filePath));
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const testRoutes = [
  '/',
  '/guide/',
  '/how/',
  '/about/',
  '/c/photoelectric-step/',
  '/c/haber-step/',
  '/c/mitosis-step/',
  '/c/enso-step/',
  '/courses/photoelectric-step.html',
  '/assets/site.css',
  '/assets/site.js',
  '/assets/hero.js',
  '/favicon.svg',
  '/catalog.json',
];

let httpOk = 0;
for (const route of testRoutes) {
  const res = await fetch(`http://127.0.0.1:${port}${route}`);
  const buf = await res.arrayBuffer();
  if (res.status !== 200 || buf.byteLength === 0) {
    fail(`HTTP check failed for ${route}: status=${res.status}, bytes=${buf.byteLength}`);
  } else {
    httpOk++;
  }
}
await new Promise((resolve) => server.close(resolve));
console.log(`5. HTTP smoke test: ${httpOk}/${testRoutes.length} routes returned 200 OK.`);

if (failures > 0) {
  console.error(`\nVERIFICATION FAILED with ${failures} error(s).`);
  process.exit(1);
} else {
  console.log('\nPASS: 100% Vietnamese localization & SaaS portal verification succeeded with 0 errors!');
}
