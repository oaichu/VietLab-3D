import fs from 'fs';
import path from 'path';
import { findShellBoundary, scanJsCjkSegments, SHARED_DICT, translateFactCitation } from './localize-shell.mjs';

const root = 'D:/tongjiang-lab';
const dir = path.join(root, 'courses');
const outDir = path.join(root, 'data', 'extracted');
fs.mkdirSync(outDir, { recursive: true });

const cat = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'));
const bySubj = { phys: [], chem: [], bio: [], geo: [] };

let totalRemaining = 0;

for (const item of cat) {
  const f = `${item.slug}.html`;
  const html = fs.readFileSync(path.join(dir, f), 'utf8');
  const b = findShellBoundary(html);
  const tail = html.slice(b.endIdx, b.scriptEnd);

  // Also capture HTML <title>
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const uniqueSegs = [];
  const seen = new Set();

  if (titleMatch && /[\u4e00-\u9fff]/.test(titleMatch[1])) {
    seen.add(titleMatch[1]);
    uniqueSegs.push(titleMatch[1]);
  }

  scanJsCjkSegments(tail, seg => {
    const s = seg.dec;
    if (SHARED_DICT[s] !== undefined) return;
    const factVi = translateFactCitation(s);
    if (factVi && !/[\u4e00-\u9fff]/.test(factVi)) return;
    if (!seen.has(s)) {
      seen.add(s);
      uniqueSegs.push(s);
    }
  });

  const indexed = {};
  uniqueSegs.forEach((s, i) => {
    indexed[String(i)] = s;
  });

  fs.writeFileSync(path.join(outDir, `${item.slug}.json`), JSON.stringify(indexed, null, 2), 'utf8');
  bySubj[item.subject].push({ slug: item.slug, title: item.title, count: uniqueSegs.length });
  totalRemaining += uniqueSegs.length;
}

console.log('Extracted 54 course string tables to D:/tongjiang-lab/data/extracted/*.json');
console.log('Total unique course-specific strings to translate:', totalRemaining, '(avg', (totalRemaining / 54).toFixed(1), 'per course)');
for (const [subj, list] of Object.entries(bySubj)) {
  console.log(`Subject ${subj} (${list.length} courses):`, list.map(x => `${x.slug}(${x.count})`).join(', '));
}
