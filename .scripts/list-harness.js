// codex9 offline list-grading harness.
//
//   node .scripts/list-harness.js            check the live tree
//   node .scripts/list-harness.js <jsDir>    check some other copy (e.g. a backup)
//
// For every question codex9 detects as an enumeration, this feeds the question's
// OWN model answer back in as the candidate's typed response. It must score full
// marks. Run it before and after ANY edit to an `ans` field.
//
// Two failure modes it exists to catch, both of which bit during the 39-fix pass
// and neither of which is visible by reading the diff:
//
//   * an item longer than 40 characters trips listParseItems' clause guard and
//     drops the whole question out of list grading, silently;
//   * a number word in the stem that happens to equal the item count is picked up
//     by listParseNeed's bare-number fallback and becomes `need` — so a stem
//     saying "name three" can start demanding all eleven.
//
// So compare the DETECTED COUNT as well as the pass count. A question quietly
// leaving the detected set is a regression even though nothing fails.

const fs = require('fs'), vm = require('vm'), path = require('path');
const HERE = __dirname;
const LIVE = path.join(HERE, '..', 'js');
const JS = process.argv[2] || LIVE;

// norm() and the list machinery always come from the live source, so the harness
// tests the current grader against whichever bank you point it at.
const coreSrc = fs.readFileSync(path.join(LIVE, 'core.js'), 'utf8');
const normSrc = coreSrc.slice(coreSrc.indexOf('function norm(s){'), coreSrc.indexOf('function normNum'));
if (!normSrc.startsWith('function norm')) throw new Error('could not extract norm() from core.js');

const c9Src = fs.readFileSync(path.join(LIVE, 'codex9.js'), 'utf8');
const listSrc = c9Src.slice(0, c9Src.indexOf('/* ---- grade the submission ----'));
if (!listSrc) throw new Error('could not slice the list machinery out of codex9.js');

const ctx = {};
vm.createContext(ctx);
vm.runInContext(normSrc + '\n' + listSrc, ctx, { filename: 'harness-prelude' });
for (const f of ['data-questions.js', 'data-intro.js', 'data-advanced.js', 'data-master.js'])
  vm.runInContext(fs.readFileSync(path.join(JS, f), 'utf8'), ctx, { filename: f });

const BANKS = [
  ['Certified', ctx.QUESTIONS],
  ['Intro', ctx.INTRO_QUESTIONS],
  ['Advanced', ctx.ADV_QUESTIONS],
  ['Master', ctx.MASTER_QUESTIONS],
];

let detected = 0, pass = 0;
const failures = [], detectedIds = [], perBank = {};

for (const [name, bank] of BANKS) {
  perBank[name] = { detected: 0, pass: 0 };
  for (const q of bank) {
    const sp = ctx.saListSpec(q);
    if (!sp) continue;
    detected++; perBank[name].detected++;
    detectedIds.push(q.id + ' need=' + sp.need + '/' + sp.items.length);
    const g = ctx.gradeList(sp, q.ans);
    if (g.n >= g.total && g.ok) { pass++; perBank[name].pass++; }
    else failures.push({ name, id: q.id, q: q.q, ans: q.ans, n: g.n, total: g.total, need: g.need, missed: g.missed });
  }
}

console.log('bank        detected  full-marks');
for (const [name] of BANKS)
  console.log(name.padEnd(12) + String(perBank[name].detected).padStart(8) + String(perBank[name].pass).padStart(12));
console.log('-'.repeat(32));
console.log('TOTAL'.padEnd(12) + String(detected).padStart(8) + String(pass).padStart(12));

if (process.argv.includes('--ids')) {
  console.log('\ndetected ids (diff this between runs):');
  for (const s of detectedIds.sort()) console.log('  ' + s);
}

if (failures.length) {
  console.log('\nFAILURES (' + failures.length + '):');
  for (const f of failures) {
    console.log('\n  [' + f.name + '] ' + f.id + '  scored ' + f.n + '/' + f.total + ' (need ' + f.need + ')');
    console.log('    q  : ' + f.q.slice(0, 110));
    console.log('    ans: ' + String(f.ans).slice(0, 150));
    console.log('    missed: ' + f.missed.join(' | '));
  }
  console.log('\nNOTE: three of these are long-standing and predate the 39-fix pass —');
  console.log('a-62mb28xz, a-egn9hhiq, a-xrebfxf7. Each has an "(also X, Y)" tail whose');
  console.log('first extra shares a comma-token with the item before it, and the longer');
  console.log('item claims the token. They still grade correctly for candidates (n >= need).');
} else {
  console.log('\nAll detected enumerations score full marks on their own model answer.');
}
process.exit(failures.length ? 1 : 0);
