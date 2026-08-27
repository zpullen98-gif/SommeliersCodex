// Would this answer grade? Ask before you widen or narrow an accept list.
//
//   node .scripts/sa-probe.js a-9g38uovt "Confrerie des Chevaliers du Tastevin"
//   node .scripts/sa-probe.js a-9g38uovt "answer one" "answer two" "answer three"
//   node .scripts/sa-probe.js --show a-9g38uovt          just print the question
//
// Prints OK / unsure / WRONG for each probe, using the REAL grader assembled from
// core.js, codex8.js and codex9.js rather than a reimplementation — the same
// three-way verdict .scripts/sa-harness.js reports:
//
//   OK      matchSA (or codex9's gradeList) accepts it.
//   unsure  it misses, but saCoverage clears SA_UNSURE, so the app replaces the
//           verdict with "The grader is unsure — call it yourself". Recoverable by
//           the student, but submitSA has already recorded a miss and queued the
//           question for review by then, so it is not free.
//   WRONG   it misses and coverage is under the threshold. The app states flatly
//           that the answer is incorrect.
//
// This exists because the expensive mistake on this bank is the one that does not
// show up in any count: an accept list narrow enough to reject a phrasing a
// knowledgeable candidate would actually type. "Emmanuel Houillon, no added
// sulfur" grades WRONG on a question whose answer is Overnoy-Houillon and zero
// added SO2, because the entry says "overnoy houillon" and the negation guard
// blocks the rest. Nothing counts that. You have to ask.
//
// So before tightening an entry, probe the two or three answers a candidate would
// give. Before widening one, probe the wrong answer you are worried about.

const fs = require('fs'), vm = require('vm'), path = require('path');
const LIVE = path.join(__dirname, '..', 'js');

function slice(src, from, to, what) {
  const a = src.indexOf(from), b = to ? src.indexOf(to, a + 1) : src.length;
  if (a < 0 || b < 0) throw new Error('could not extract ' + what);
  return src.slice(a, b);
}

const core = fs.readFileSync(path.join(LIVE, 'core.js'), 'utf8');
const c8 = fs.readFileSync(path.join(LIVE, 'codex8.js'), 'utf8');
const c9 = fs.readFileSync(path.join(LIVE, 'codex9.js'), 'utf8');

const ctx = { saTrueSA: q => q.sa && !q.mt && !q.sel };
vm.createContext(ctx);
vm.runInContext(
  slice(core, 'function norm(s){', '/* ---------- flow ---------- */', 'grader') + '\n' +
  slice(c8, 'var SA_STOP=', 'function saAcceptList', 'coverage') + '\n' +
  c9.slice(0, c9.indexOf('/* ---- grade the submission ----')),
  ctx, { filename: 'sa-probe-prelude' });

for (const f of ['data-intro.js', 'data-questions.js', 'data-advanced.js', 'data-master.js'])
  vm.runInContext(fs.readFileSync(path.join(LIVE, f), 'utf8'), ctx, { filename: f });

const all = [].concat(ctx.INTRO_QUESTIONS || [], ctx.QUESTIONS || [],
                      ctx.ADV_QUESTIONS || [], ctx.MASTER_QUESTIONS || []);

const args = process.argv.slice(2);
const showOnly = args[0] === '--show';
const rest = showOnly ? args.slice(1) : args;
const id = rest[0];
const probes = rest.slice(1);

if (!id) {
  console.log('usage: node .scripts/sa-probe.js <question-id> "answer" ["answer" ...]');
  process.exit(2);
}
const q = all.find(x => x.id === id);
if (!q) { console.log('no question with id ' + id); process.exit(2); }

console.log('q     : ' + q.q);
console.log('ans   : ' + q.ans);
console.log('accept: ' + JSON.stringify(q.accept || []));
if (q.ex) console.log('ex    : 1  (every entry is exact-match only)');
const spec = ctx.saListSpec(q);
if (spec) console.log('list  : graded by codex9, needs ' + spec.need + ' of ' + spec.items.length +
                      ' items — the accept list is NOT consulted');
if (showOnly || !probes.length) process.exit(0);

console.log('');
let wrong = 0;
for (const p of probes) {
  const ok = spec ? ctx.gradeList(spec, p).ok : ctx.matchSA(q, p);
  let verdict = 'OK    ';
  if (!ok) {
    const cov = ctx.saCoverage(q, p);
    verdict = cov >= ctx.SA_UNSURE ? 'unsure' : 'WRONG ';
    if (verdict !== 'unsure') wrong++;
  }
  console.log('  ' + verdict + ' | ' + p);
}
process.exit(wrong ? 1 : 0);
