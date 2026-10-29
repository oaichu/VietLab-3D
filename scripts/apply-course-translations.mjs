import fs from 'fs';
import path from 'path';
import vm from 'vm';
import {
  localizeSharedShell,
  findShellBoundary,
  scanJsCjkSegments,
  replaceJsCjkSegments,
  SHARED_DICT,
  translateFactCitation,
  decodeCjkEscapes
} from './localize-shell.mjs';

const root = 'D:/tongjiang-lab';
const coursesDir = path.join(root, 'courses');
const origDir = path.join(root, 'data', 'orig-courses');
const extractedDir = path.join(root, 'data', 'extracted');
const i18nDir = path.join(root, 'data', 'i18n');

fs.mkdirSync(origDir, { recursive: true });
fs.mkdirSync(i18nDir, { recursive: true });

// Ensure all original courses are backed up in data/orig-courses
for (const f of fs.readdirSync(coursesDir).filter(x => x.endsWith('.html'))) {
  const origPath = path.join(origDir, f);
  if (!fs.existsSync(origPath)) {
    fs.copyFileSync(path.join(coursesDir, f), origPath);
  }
}

export function compileCourse(slug) {
  const origPath = path.join(origDir, `${slug}.html`);
  const extPath = path.join(extractedDir, `${slug}.json`);
  const i18nPath = path.join(i18nDir, `${slug}.json`);
  const outPath = path.join(coursesDir, `${slug}.html`);

  if (!fs.existsSync(origPath)) throw new Error(`Missing orig course: ${origPath}`);
  if (!fs.existsSync(extPath)) throw new Error(`Missing extracted JSON: ${extPath}`);
  if (!fs.existsSync(i18nPath)) throw new Error(`Missing i18n JSON: ${i18nPath}`);

  const extracted = JSON.parse(fs.readFileSync(extPath, 'utf8'));
  const i18n = JSON.parse(fs.readFileSync(i18nPath, 'utf8'));

  const strMap = new Map();
  const missingKeys = [];
  const cjkKeys = [];

  for (const [k, zh] of Object.entries(extracted)) {
    const vi = i18n[k];
    if (typeof vi !== 'string' || vi.trim() === '') {
      missingKeys.push(k);
      continue;
    }
    const decVi = decodeCjkEscapes(vi);
    if (/[\u4e00-\u9fff]/.test(decVi)) {
      cjkKeys.push({ k, vi: decVi });
    }
    strMap.set(zh, vi);
  }

  if (missingKeys.length > 0) {
    throw new Error(`[${slug}] Missing keys in i18n/${slug}.json: ${missingKeys.slice(0, 10).join(', ')} (total ${missingKeys.length})`);
  }
  if (cjkKeys.length > 0) {
    throw new Error(`[${slug}] CJK characters found in i18n/${slug}.json keys: ${cjkKeys.map(x => `${x.k}="${x.vi}"`).slice(0, 5).join('; ')}`);
  }

  const origHtml = fs.readFileSync(origPath, 'utf8');
  const b = findShellBoundary(origHtml);
  if (!b) throw new Error(`[${slug}] Could not find shell boundary`);

  // 1. Localize shared shell
  let localizedHtml = localizeSharedShell(origHtml);
  const tailLen = origHtml.length - b.endIdx;
  const headAndShell = localizedHtml.slice(0, localizedHtml.length - tailLen);

  // Replace <title> in headAndShell
  const finalHeadAndShell = headAndShell.replace(/<title>([^<]+)<\/title>/, (m, t) => {
    const viTitle = strMap.get(t) || t.replace('铜匠实验室', 'VietLab 3D');
    return `<title>${viTitle.replace(/铜匠实验室/g, 'VietLab 3D')}</title>`;
  });

  // 2. Localize tail
  let tail = origHtml.slice(b.endIdx, b.scriptEnd);
  const postScript = origHtml.slice(b.scriptEnd);

  tail = replaceJsCjkSegments(tail, (seg) => {
    const s = seg.dec;
    if (strMap.has(s)) return strMap.get(s);
    if (SHARED_DICT[s] !== undefined) return SHARED_DICT[s];
    const factVi = translateFactCitation(s);
    if (factVi) return factVi;
    return s;
  });

  const fullHtml = finalHeadAndShell + tail + postScript;

  // 3. Verify JS syntax of <script type="module">
  const sStart = fullHtml.indexOf('<script type="module">') + '<script type="module">'.length;
  const sEnd = fullHtml.lastIndexOf('</script>');
  const scriptCode = fullHtml.slice(sStart, sEnd);

  try {
    new vm.Script(scriptCode, { filename: `${slug}.html` });
  } catch (err) {
    throw new Error(`[${slug}] JS SyntaxError after localization: ${err.message}`);
  }

  // 4. Verify zero CJK in tail segments
  const leftover = [];
  scanJsCjkSegments(tail, seg => {
    leftover.push(seg.dec);
  });
  if (leftover.length > 0) {
    throw new Error(`[${slug}] Leftover CJK in tail: ${leftover.slice(0, 5).join(' | ')}`);
  }

  fs.writeFileSync(outPath, fullHtml, 'utf8');
  return { slug, keys: Object.keys(extracted).length };
}

// CLI runner
const args = process.argv.slice(2);
if (args.length > 0) {
  const targets = args[0] === '--all'
    ? fs.readdirSync(extractedDir).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''))
    : args;
  let ok = 0;
  for (const slug of targets) {
    const res = compileCourse(slug);
    console.log(`OK: ${res.slug} (${res.keys} strings localized, JS syntax valid, 0 CJK)`);
    ok++;
  }
  console.log(`Done: ${ok}/${targets.length} courses compiled.`);
}
