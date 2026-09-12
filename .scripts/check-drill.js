/**
 * DOES THE PRODUCER DRILL ASK REAL QUESTIONS?
 *
 * codex16 builds its questions at click time from the corpus, which is what
 * keeps 2,400 of them out of the banks. Nothing was checking that what it built
 * was worth answering, and it was not: on 122 records the first bottling is
 * named after the estate, so the drill asked "Who makes Chateau Ausone?" and
 * accepted "Chateau Ausone". Thirty eight per cent of the Bordeaux drill was a
 * tautology, and every one of those answers went into the spaced repetition
 * record as a thing the candidate had learned.
 *
 * A generated question fails in three ways and this looks for all three:
 *
 *   1. IT CONTAINS ITS OWN ANSWER. The stem names the thing the answer names.
 *   2. TWO TRUE OPTIONS. The corpus records some places at two granularities,
 *      so a region distractor could be correct for the same estate.
 *   3. IT CANNOT BE ANSWERED. Fewer than four distinct options, or an index
 *      pointing outside them.
 *
 * And the fourth question, which is the opposite failure: is every record still
 * asked about at all? A guard that silences a facet is easy to over-tighten.
 *
 *   node .scripts/check-drill.js            the live tree
 *   node .scripts/check-drill.js <jsDir>    another copy
 *
 * Exits non-zero on any of the four.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const JS = process.argv[2] || 'C:/Users/zpull/SommeliersCodex/js';
const box = {
  window: {}, console,
  document: { createElement: () => ({ style: {}, appendChild() { } }), head: { appendChild() { } } },
};
box.WINE_PRODUCERS = null; box.PRODUCERS = null;
vm.runInNewContext(fs.readFileSync(path.join(JS, 'data-producers.js'), 'utf8'), box);
vm.runInNewContext(fs.readFileSync(path.join(JS, 'reference.js'), 'utf8'), box);
box.S = {}; box.ST = { cellar: [] };
box.el = () => ({ querySelector: () => null, querySelectorAll: () => [] });
box.escT = (s) => String(s);
box.shuffle = (a) => a.slice();
box.uniqOpts = (c, d) => { const s = {}, o = [c]; s[c] = 1; for (let k = 0; k < d.length && o.length < 4; k++) { if (d[k] && !s[d[k]]) { s[d[k]] = 1; o.push(d[k]); } } return o; };
box.prodView = () => null; box.cellarView = () => null; box.render = () => { };
box.decorateHome = () => { }; box.applyLevel = () => { }; box.keyOwned = () => true;
box.bottleLabel = () => ''; box.stopTimer = () => { }; box.resetQ = () => { };
vm.runInNewContext(fs.readFileSync(path.join(JS, 'codex16.js'), 'utf8'), box);
const W = vm.runInNewContext('({prodDrillPool, prodCorpus, prodGroups})', box);

const fold = (s) => String(s == null ? '' : s).trim().toLowerCase().replace(/\s+/g, ' ');
const pool = W.prodDrillPool({});

/* 1. tautology */
const taut = pool.filter((q) => {
  if (q.sa) {
    const asked = fold(String(q.q).replace(/^Who makes /, '').replace(/\?$/, ''));
    return asked === fold(q.ans);
  }
  if (/known for\?$/.test(q.q)) {
    const est = fold(String(q.q).replace(/^Which wine is /, '').replace(/ known for\?$/, ''));
    return est === fold(q.opts[q.a]);
  }
  return false;
});

/* 2. a distractor that is also true: for the region facet, an option that
      contains the answer or is contained by it */
const twoTrue = pool.filter((q) => {
  if (q.sa || !/-rg$/.test(q.id)) return false;
  const ans = fold(q.opts[q.a]);
  return q.opts.some((o, i) => {
    if (i === q.a) return false;
    const f = fold(o);
    return f.indexOf(ans) >= 0 || ans.indexOf(f) >= 0;
  });
});

/* 3. four distinct options, answer in range */
const broken = pool.filter((q) => !q.sa && (!q.opts || q.opts.length !== 4
  || new Set(q.opts.map(fold)).size !== 4 || !(q.a >= 0 && q.a < 4)));

const byFacet = {};
pool.forEach((q) => { const f = String(q.id).slice(-2); byFacet[f] = (byFacet[f] || 0) + 1; });

console.log('corpus ' + W.prodCorpus().length + ' records, ' + W.prodGroups().length + ' groups');
console.log('pool   ' + pool.length + ' questions ' + JSON.stringify(byFacet));
console.log('');
let bad = 0;
const report = (n, what, sample) => {
  if (n) { bad++; console.log('  x ' + n + ' ' + what); sample.slice(0, 5).forEach((q) => console.log('      ' + q.q + '  ->  ' + (q.sa ? q.ans : q.opts[q.a]))); }
  else console.log('  ok no ' + what);
};
report(taut.length, 'questions that contain their own answer', taut);
report(twoTrue.length, 'region questions with a second true option', twoTrue);
report(broken.length, 'multiple choice that cannot be answered', broken);

/* every record still asked about */
const asked = {};
pool.forEach((q) => { asked[String(q.id).replace(/^pr-/, '').replace(/-(rg|mk|gr|wn)$/, '')] = 1; });
const silent = W.prodCorpus().filter((r) => !asked[r.id]);
report(silent.length, 'records that generate no question at all', silent.map((r) => ({ q: r.p, opts: [r.id], a: 0 })));

process.exitCode = bad ? 1 : 0;
