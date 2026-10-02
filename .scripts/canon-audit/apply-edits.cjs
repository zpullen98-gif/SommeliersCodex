/* Apply the canon audit's edits to the Codex repo.
 *
 *   node .scripts/canon-audit/apply-edits.cjs <workflow-output.json> [--dry]
 *
 * Each edit names a file (relative to the repo root), an exact "find" and a
 * "replace". An edit applies only when its find is in the file exactly once;
 * the second reader's betterReplace wins over the editor's replace, unless it
 * reads as an instruction ("Use find ... with replace ..."), which is reported
 * and not applied. JS files are parse-checked after every edit and an edit that
 * breaks the parse is reverted and reported. Python modules are checked
 * afterwards by the caller (py -m py_compile, then rewrite/ship.py).
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = process.argv[3] && !process.argv[3].startsWith('--') ? path.resolve(process.argv[3]) : path.resolve(__dirname, '..', '..');
const [, , runPath] = process.argv;
const dry = process.argv.includes('--dry');
const top = JSON.parse(fs.readFileSync(runPath, 'utf8'));
const jobs = (top.result || top).jobs;

const INSTRUCTION = /^(use find|replace |change |in the stem|in exp|keep |set |add |drop )/i;
const report = { applied: 0, missing: [], ambiguous: [], breaks: [], instructions: [], dashed: [] };
const files = new Map();
const read = (rel) => {
  if (!files.has(rel)) files.set(rel, fs.readFileSync(path.join(ROOT, rel), 'utf8'));
  return files.get(rel);
};

let total = 0;
for (const job of jobs) {
  const better = new Map(((job.check && job.check.problems) || []).map((p) => [p.id + '\u0000' + p.find, p.betterReplace]));
  for (const e of job.edits) {
    total++;
    let replace = e.replace;
    const b = better.get(e.id + '\u0000' + e.find);
    if (b !== undefined) {
      if (INSTRUCTION.test(b.trim())) { report.instructions.push(`${e.id} (${e.file}): ${b.slice(0, 120)}`); continue; }
      replace = b;
    }
    if (/[—–]/.test(replace)) report.dashed.push(`${e.id}: ${replace.slice(0, 80)}`);
    const text = read(e.file);
    const first = text.indexOf(e.find);
    if (first < 0) { report.missing.push(`${e.id} (${e.file}): ${JSON.stringify(e.find).slice(0, 100)}`); continue; }
    if (text.indexOf(e.find, first + 1) >= 0) { report.ambiguous.push(`${e.id} (${e.file}): ${JSON.stringify(e.find).slice(0, 80)}`); continue; }
    const next = text.slice(0, first) + replace + text.slice(first + e.find.length);
    if (e.file.endsWith('.js')) {
      try { new vm.Script(next, { filename: e.file }); } catch (err) {
        report.breaks.push(`${e.id} (${e.file}): ${String(err.message).slice(0, 60)}`);
        continue;
      }
    }
    files.set(e.file, next);
    report.applied++;
  }
}

if (!dry) for (const [rel, text] of files) fs.writeFileSync(path.join(ROOT, rel), text);
console.log(`${total} edits, ${report.applied} applied${dry ? ' (dry run, nothing written)' : ''}, across ${files.size} file(s)`);
for (const k of ['missing', 'ambiguous', 'breaks', 'instructions', 'dashed']) {
  if (report[k].length) { console.log(`  ${k} (${report[k].length}):`); for (const l of report[k]) console.log('    ' + l); }
}
