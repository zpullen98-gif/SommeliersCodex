#!/usr/bin/env node
/* extract-guide: the text pre-pass of the four Court documents (BRIEF-CMS.md, "The four documents").

   Usage: node .scripts/cms/extract-guide.cjs [--uploads <dir>] [--out <dir>]

   For each of the 44 subjects of the curriculum guide (SUBJECTS in build-cms.cjs, the one statement of the ids
   and pages) it runs pdftotext -layout over the subject's pages and writes extracted/<id>.txt, the pages
   concatenated with a "=== page N ===" line before each; then extracted/syllabus.txt, tasting.txt and grid.txt
   from the other three PDFs, every page, the same way. The text is a pre-pass for copying the Court's words
   exactly: the page image stays the authority for which column a cell sits in. Prints a table of subject, pages
   and lines, and exits 1 when a PDF is missing or pdftotext fails. Nothing under extracted/ ships. */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { SUBJECTS } = require(path.join(__dirname, 'build-cms.cjs'));

const UPLOADS = '/root/.claude/uploads/09201eae-82ec-5cba-9316-4d6cf5955e5e';
const OUT = path.join(__dirname, 'extracted');
/* The four documents: the name each is looked up by (a suffix of its file name), the text file it writes. */
const DOCS = {
  guide: 'Introductory-Sommelier-Course-and-Certified-Somm-Theory-Exam-Curriculum-Guide_2.pdf',
  syllabus: 'Certified-Sommelier-Exam-Syllabus.pdf',
  tasting: 'Certified-Sommelier-Level-Wines.pdf',
  grid: 'CMS-A-Certified-Sommelier-Deductive-Tasting-Grid.pdf'
};

function parseArgs(argv) {
  const o = { uploads: UPLOADS, out: OUT };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^#!.*\n\/\* /, '')); process.exit(0); }
    else if (a === '--uploads') o.uploads = path.resolve(argv[++i]);
    else if (a === '--out') o.out = path.resolve(argv[++i]);
    else { console.error('extract-guide: unknown argument ' + a); process.exit(1); }
  }
  return o;
}
function findPdf(dir, suffix) {
  if (!fs.existsSync(dir)) return null;
  const hit = fs.readdirSync(dir).filter((f) => f.endsWith(suffix)).sort();
  return hit.length ? path.join(dir, hit[0]) : null;
}
function pageCount(pdf) {
  const info = execFileSync('pdfinfo', [pdf], { encoding: 'utf8' });
  const m = info.match(/^Pages:\s+(\d+)/m);
  return m ? Number(m[1]) : 0;
}
function pageText(pdf, n) {
  return execFileSync('pdftotext', ['-layout', '-f', String(n), '-l', String(n), pdf, '-'], { encoding: 'utf8' }).replace(/\f/g, '');
}
function extract(pdf, pages) {
  return pages.map((n) => '=== page ' + n + ' ===\n' + pageText(pdf, n).replace(/\s+$/, '') + '\n').join('');
}
function lines(text) { return text.split('\n').filter((l) => l.trim()).length; }
function range(a, b) { const out = []; for (let i = a; i <= b; i++) out.push(i); return out; }
function pagesWord(pages) { return pages.length === 1 ? String(pages[0]) : pages[0] + ' to ' + pages[pages.length - 1]; }

function main() {
  const o = parseArgs(process.argv.slice(2));
  const problems = [];
  const pdfs = {};
  Object.keys(DOCS).forEach((k) => {
    pdfs[k] = findPdf(o.uploads, DOCS[k]);
    if (!pdfs[k]) problems.push(o.uploads + ': no file ending ' + DOCS[k]);
  });
  if (problems.length) { problems.forEach((p) => console.error('extract-guide: ' + p)); process.exit(1); }
  fs.mkdirSync(o.out, { recursive: true });
  const rows = [];
  const guidePages = pageCount(pdfs.guide);
  SUBJECTS.forEach((s) => {
    const over = s.pages.filter((p) => p > guidePages);
    if (over.length) { problems.push(s.id + ': page ' + over.join(', ') + ' past the guide\'s ' + guidePages); return; }
    const text = extract(pdfs.guide, s.pages);
    fs.writeFileSync(path.join(o.out, s.id + '.txt'), text);
    rows.push([s.id, pagesWord(s.pages), lines(text)]);
  });
  ['syllabus', 'tasting', 'grid'].forEach((k) => {
    const n = pageCount(pdfs[k]);
    if (!n) { problems.push(pdfs[k] + ': no pages'); return; }
    const text = extract(pdfs[k], range(1, n));
    fs.writeFileSync(path.join(o.out, k + '.txt'), text);
    rows.push([k + ' (whole)', pagesWord(range(1, n)), lines(text)]);
  });
  const w0 = Math.max.apply(null, rows.map((r) => r[0].length));
  const w1 = Math.max.apply(null, rows.map((r) => r[1].length));
  console.log('subject'.padEnd(w0) + '  ' + 'pages'.padEnd(w1) + '  lines');
  rows.forEach((r) => console.log(r[0].padEnd(w0) + '  ' + r[1].padEnd(w1) + '  ' + r[2]));
  console.log(rows.length + ' files written under ' + o.out);
  if (problems.length) { problems.forEach((p) => console.error('extract-guide: ' + p)); process.exit(1); }
}
main();
