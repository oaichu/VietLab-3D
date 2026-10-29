import fs from 'fs';
import path from 'path';
import { localizeSharedShell, findShellBoundary, scanJsCjkSegments } from './localize-shell.mjs';

const root = 'D:/tongjiang-lab';
const dir = path.join(root, 'courses');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let remainingShellCjk = new Set();

for (const f of files) {
  const html = fs.readFileSync(path.join(dir, f), 'utf8');
  const b = findShellBoundary(html);
  if (!b) {
    console.error('FAIL: No boundary in', f);
    process.exit(1);
  }
  const localized = localizeSharedShell(html);
  // Find where the tail starts in localized
  const tailLen = html.length - b.endIdx;
  const locShell = localized.slice(b.varStart, localized.length - tailLen);
  scanJsCjkSegments(locShell, seg => {
    remainingShellCjk.add(seg.dec);
  });
}

if (remainingShellCjk.size > 0) {
  console.error('Remaining CJK in shell:', [...remainingShellCjk]);
  process.exit(1);
}
console.log('PASS: 0 CJK segments remaining in shared shell across all', files.length, 'courses!');
