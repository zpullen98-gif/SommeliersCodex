// Would the app accept its own model answer?
//
//   node .scripts/sa-harness.js                 every bank
//   node .scripts/sa-harness.js adv master      named banks
//   node .scripts/sa-harness.js --list          print every offender
//   node .scripts/sa-harness.js --json out.json machine-readable, for a repair pass
//
// A student reads `ans` on the reveal screen and types it back next time. If the
// app then marks them wrong, they learn something false and stop trusting the
// grader. rewrite/lib.py's SA() constructor guarantees this can never happen in
// the rewritten Rank I and II banks - it prepends the model answer to the accept
// list when it does not already grade. The Advanced and Master banks were
// hand-authored as JSON and carry no such guarantee, and nothing had ever checked
// them.
//
// THE VERDICT HAS THREE VALUES, and only one of them is a real defect. This
// matters, because counting only the matchSA result overstates the problem by
// roughly a factor of four:
//
//   ok       matchSA or codex9's gradeList accepts it. Nothing to do.
//   unsure   it misses, but saCoverage >= SA_UNSURE, so codex8 replaces the
//            verdict with "The grader is unsure - call it yourself" and makes
//            self-grade the primary action. Recoverable: overrideGrade(true)
//            calls missRemove and statOverride, so pressing R fully undoes it.
//            Still not free - submitSA has ALREADY run statRecord(q,false) and
//            missAdd(q) by then, so the miss stands until the student acts, and
//            S.correct never incremented, which depresses a mock score.
//   wrong    it misses AND coverage is under the threshold, so the app states
//            flatly that the model answer is incorrect and offers no nudge to
//            self-correct. This is the one to fix. In Sudden Death it also ends
//            the run outright.
//
// The grader is assembled from the real source rather than reimplemented, the
// way .scripts/list-harness.js does it, so this tests what actually ships.

const fs = require('fs'), vm = require('vm'), path = require('path');
const HERE = __dirname;
const LIVE = path.join(HERE, '..', 'js');

function slice(src, from, to, what) {
  const a = src.indexOf(from);
  const b = to ? src.indexOf(to, a + 1) : src.length;
  if (a < 0 || b < 0) throw new Error('could not extract ' + what);
  return src.slice(a, b);
}

const core = fs.readFileSync(path.join(LIVE, 'core.js'), 'utf8');
const c8 = fs.readFileSync(path.join(LIVE, 'codex8.js'), 'utf8');
const c9 = fs.readFileSync(path.join(LIVE, 'codex9.js'), 'utf8');

// norm, normNum, escRe, the negation guard and matchSA, in one contiguous run.
const graderSrc = slice(core, 'function norm(s){', '/* ---------- flow ---------- */', 'the grader from core.js');
if (graderSrc.indexOf('function matchSA') === -1) throw new Error('matchSA missing from the slice');
if (graderSrc.indexOf('function negatedAgainst') === -1) throw new Error('negatedAgainst missing');

// SA_STOP, saKeyTerms, saCoverage, SA_UNSURE.
const covSrc = slice(c8, 'var SA_STOP=', 'function saAcceptList', 'the coverage model from codex8.js');
// codex9's list detection and grading.
const listSrc = c9.slice(0, c9.indexOf('/* ---- grade the submission ----'));
if (!listSrc || listSrc.indexOf('saListSpec') === -1) throw new Error('could not extract the list machinery');

const ctx = { saTrueSA: q => q.sa && !q.mt && !q.sel };
vm.createContext(ctx);
vm.runInContext(graderSrc + '\n' + covSrc + '\n' + listSrc, ctx, { filename: 'sa-harness-prelude' });

const BANKS = [
  ['intro', 'data-intro.js', 'INTRO_QUESTIONS'],
  ['certified', 'data-questions.js', 'QUESTIONS'],
  ['adv', 'data-advanced.js', 'ADV_QUESTIONS'],
  ['master', 'data-master.js', 'MASTER_QUESTIONS'],
];
for (const [, file] of BANKS)
  vm.runInContext(fs.readFileSync(path.join(LIVE, file), 'utf8'), ctx, { filename: file });

const want = process.argv.slice(2).filter(a => a.charAt(0) !== '-');
const wantList = process.argv.includes('--list');
const jsonAt = process.argv.indexOf('--json');

const offenders = [];
const rows = [];
for (const [name, , varName] of BANKS) {
  if (want.length && want.indexOf(name) === -1) continue;
  const bank = ctx[varName] || [];
  let n = 0, ok = 0, unsure = 0, wrong = 0;
  for (const q of bank) {
    if (!ctx.saTrueSA(q)) continue;
    if (typeof q.ans !== 'string' || !q.ans) continue;
    n++;
    const spec = ctx.saListSpec(q);
    const graded = spec ? ctx.gradeList(spec, q.ans).ok : ctx.matchSA(q, q.ans);
    if (graded) { ok++; continue; }
    const cov = ctx.saCoverage(q, q.ans);
    const verdict = cov >= ctx.SA_UNSURE ? 'unsure' : 'wrong';
    if (verdict === 'unsure') unsure++; else wrong++;
    offenders.push({ bank: name, id: q.id, cat: q.cat, verdict, coverage: +cov.toFixed(2),
                     q: q.q, ans: q.ans, accept: q.accept || [], ex: !!q.ex });
  }
  rows.push({ name, n, ok, unsure, wrong });
}

// --regress [ref]: every accept entry that graded at `ref` must still grade now.
// This is the guard the README bought the hard way - a pass that closed 33 mild
// stem echoes with ex=True broke 23 correct answers, including phrasings taken
// from the questions' own explanations. Those strings are the project's written
// declaration that each is a correct answer, so if one stops grading, the edit
// revoked a correctness already committed to. No heuristic and no threshold.
const regressAt = process.argv.indexOf('--regress');
if (regressAt > -1) {
  const cp = require('child_process');
  const REPO = path.join(HERE, '..');
  const ref = (process.argv[regressAt + 1] && process.argv[regressAt + 1].charAt(0) !== '-')
    ? process.argv[regressAt + 1] : 'HEAD';
  let revoked = 0, checked = 0;
  for (const [name, file, varName] of BANKS) {
    if (want.length && want.indexOf(name) === -1) continue;
    const r = cp.spawnSync('git', ['show', ref + ':js/' + file], { cwd: REPO, maxBuffer: 1 << 28 });
    if (r.status !== 0) { console.log(name + ': not present at ' + ref + ', skipped'); continue; }
    const old = {};
    vm.createContext(old);
    vm.runInContext(r.stdout.toString('utf8'), old, { filename: ref + ':' + file });
    const now = {};
    for (const q of (ctx[varName] || [])) if (q.id) now[q.id] = q;
    for (const q of (old[varName] || [])) {
      if (!ctx.saTrueSA(q) || !now[q.id]) continue;
      const cur = now[q.id];
      // A list-detected question never consults its accept list: codex9's
      // submitSA calls gradeList(spec, txt) and matchSA is not reached, so those
      // entries are decorative and always "fail" this probe. 166 of them across
      // 32 questions, every one a false alarm. Skip them or the tool cries wolf
      // on every run and stops being read.
      if (ctx.saListSpec(cur)) continue;
      for (const a of (q.accept || [])) {
        const probe = String(a).replace(/^~/, '');
        if (!probe) continue;
        checked++;
        const spec = ctx.saListSpec(cur);
        const ok = spec ? ctx.gradeList(spec, probe).ok : ctx.matchSA(cur, probe);
        if (!ok) {
          revoked++;
          if (revoked <= 12) {
            console.log('REVOKED [' + name + '] ' + q.id);
            console.log('    was accepted: ' + probe.slice(0, 88));
            console.log('    q           : ' + cur.q.slice(0, 88));
          }
        }
      }
    }
  }
  console.log('--regress vs ' + ref + ': ' + checked + ' previously-accepted strings probed, '
    + revoked + ' now REVOKED'
    + (revoked ? '  <<< each is a correct answer this edit made wrong' : ' - none'));
  process.exit(revoked ? 1 : 0);
}

console.log('bank          SA    grades    unsure     WRONG');
console.log('-'.repeat(48));
let T = { n: 0, ok: 0, unsure: 0, wrong: 0 };
for (const r of rows) {
  for (const k of ['n', 'ok', 'unsure', 'wrong']) T[k] += r[k];
  console.log(r.name.padEnd(12) + String(r.n).padStart(5) + String(r.ok).padStart(10) +
              String(r.unsure).padStart(10) + String(r.wrong).padStart(10));
}
console.log('-'.repeat(48));
console.log('TOTAL'.padEnd(12) + String(T.n).padStart(5) + String(T.ok).padStart(10) +
            String(T.unsure).padStart(10) + String(T.wrong).padStart(10));

if (wantList) {
  for (const o of offenders.filter(x => x.verdict === 'wrong').slice(0, 400)) {
    console.log('\n[' + o.bank + '] ' + o.id + '  ' + o.cat + '  coverage ' + o.coverage);
    console.log('  q  : ' + o.q.slice(0, 100));
    console.log('  ans: ' + o.ans.slice(0, 100));
    console.log('  acc: ' + JSON.stringify(o.accept).slice(0, 100));
  }
}
if (jsonAt > -1 && process.argv[jsonAt + 1]) {
  fs.writeFileSync(process.argv[jsonAt + 1], JSON.stringify(offenders, null, 1));
  console.log('\nwrote ' + offenders.length + ' offenders to ' + process.argv[jsonAt + 1]);
}
process.exit(T.wrong ? 1 : 0);
