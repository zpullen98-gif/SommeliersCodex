// The content lint the HANDOFF asks for.
//
//   node .scripts/check-claims.js            lint the live tree
//   node .scripts/check-claims.js <jsDir>    lint some other copy
//   node .scripts/check-claims.js --counts   only the count disagreements
//
// WHY THIS EXISTS, in the HANDOFF's own words: the review passes found that what
// survives in the banks has a signature, and it is the signature of fluent
// generation rather than of ignorance. A plausible NUMBER, a plausible
// NEIGHBOUR, a plausible RELATION. Roughly half the confirmed errors were
// quantified counts and superlatives; the rest were attribution and near-miss
// technical relations. All three are mechanically detectable, and surfacing them
// costs a fraction of another read-through.
//
// THIS TOOL FLAGS. IT DOES NOT FIX, AND IT MUST NOT.
// One in six claimed errors in the last pass was itself wrong, and `ans` proved
// markedly more trustworthy than the stems around it. So every line below is a
// question to be checked against GuildSomm or the CMS curriculum by a person,
// not a defect to be swept. A clean run does not mean the content is right; it
// means the mechanically visible shapes are accounted for.
//
// The count check is the sharp one, and it is not a new opinion about the banks:
// codex9's own saListSpec ALREADY refuses to grade a question whose stem demands
// more items than its answer holds, at the line commented "a content bug; do not
// grade". It just refuses silently. This says which ones, which is the whole
// difference between a guard and a report.

const fs = require('fs'), vm = require('vm'), path = require('path');
const HERE = __dirname;
const LIVE = path.join(HERE, '..', 'js');
const JS = process.argv.slice(2).find((a) => a.charAt(0) !== '-') || LIVE;
const ONLY_COUNTS = process.argv.includes('--counts');

// The same prelude the list harness uses, and for the same reason: the list
// machinery has to be the SHIPPED one, or this reports on a copy that has
// drifted. If you add a core.js dependency to codex9, extract it here too.
const coreSrc = fs.readFileSync(path.join(LIVE, 'core.js'), 'utf8');
const normSrc = coreSrc.slice(coreSrc.indexOf('function norm(s){'), coreSrc.indexOf('function normNum'));
if (!normSrc.startsWith('function norm')) throw new Error('could not extract norm() from core.js');
const negSrc = coreSrc.slice(coreSrc.indexOf('var NEG_RE'), coreSrc.indexOf('function matchSA'));
if (!negSrc.startsWith('var NEG_RE')) throw new Error('could not extract the negation guard from core.js');
const c9Src = fs.readFileSync(path.join(LIVE, 'codex9.js'), 'utf8');
const listSrc = c9Src.slice(0, c9Src.indexOf('/* ---- grade the submission ----'));
if (!listSrc) throw new Error('could not slice the list machinery out of codex9.js');

const ctx = {};
vm.createContext(ctx);
vm.runInContext(normSrc + '\n' + negSrc + '\n' + listSrc, ctx, { filename: 'lint-prelude' });
for (const f of ['data-questions.js', 'data-intro.js', 'data-advanced.js', 'data-master.js'])
  vm.runInContext(fs.readFileSync(path.join(JS, f), 'utf8'), ctx, { filename: f });

const BANKS = [
  ['Certified', ctx.QUESTIONS],
  ['Intro', ctx.INTRO_QUESTIONS],
  ['Advanced', ctx.ADV_QUESTIONS],
  ['Master', ctx.MASTER_QUESTIONS],
];

const findings = { counts: [], superlative: [], attribution: [], relation: [] };

/* ---- 1. a stem that asks for more items than its answer holds ------------
   The first cut counted every numeral in the stem, and four of its eight
   findings were sentences like "Sauternes and Barsac name two of the five
   communes. Name the three others", where the five is context and the three is
   the ask. A stem is prose, and prose is full of numbers.

   So it asks codex9 instead. listParseNeed is the SHIPPED function that decides
   how many items a stem wants, and saListSpec already treats need > items.length
   as a content bug and declines to grade. Using the same function means this
   cannot form an opinion the app disagrees with, and a fix to the parser fixes
   the lint for free. */
for (const [bank, list] of BANKS) {
  for (const q of list || []) {
    if (!q || !q.sa || q.mt || q.sel || typeof q.ans !== 'string') continue;
    const items = ctx.listParseItems(q.ans);
    if (!items || items.length < 2) continue;
    const need = ctx.listParseNeed(q.q, items.length);
    if (need === null || need === -1) continue;
    if (need >= 1 && need <= items.length) continue;   /* gradeable: nothing to say */
    findings.counts.push({ bank, id: q.id, cat: q.cat, q: q.q, ans: q.ans,
      items: items.length, asks: String(need) });
  }
}
/* ---- 2, 3, 4: the three claim shapes, over stems, answers and explanations
   These are flags, not failures. A superlative is not an error; it is a claim
   with a single right answer and no margin, which is precisely where a fluent
   guess is indistinguishable from knowledge until somebody checks it. */
const SHAPES = [
  ['superlative', /\b(largest|smallest|biggest|longest|shortest|highest|lowest|oldest|newest|first|last|only|sole|greatest|finest|most\s+\w+|least\s+\w+|northernmost|southernmost|easternmost|westernmost|steepest|driest|wettest|coolest|warmest)\b/i],
  ['attribution', /\b(owned by|owner of|founded by|founded in|established by|acquired by|purchased by|bought by|belongs to|family of|the \w+ family|created by|invented by|named after|monopole of|run by|held by)\b/i],
  ['relation', /\b(sibling|half-sibling|half sibling|parent of|offspring|progeny|natural cross|crossing of|genetically identical|clone of|mutation of|descended from|ancestor of|related to|the same grape as|synonym for)\b/i],
];

for (const [bank, list] of BANKS) {
  for (const q of list || []) {
    if (!q) continue;
    for (const [kind, re] of SHAPES) {
      /* Superlatives came to 1517 across three fields, which is longer than the
         banks and therefore nobody's reading list. A superlative in an `exp` is
         colour; one in a STEM is the thing the question is testing, and it is
         the only place where being wrong marks a right answer wrong. So the
         superlative sweep reads stems alone. Attribution and relation stay
         across all three, because a wrong founder in an explanation is still a
         wrong founder being taught. */
      const fields = kind === 'superlative'
        ? [['q', q.q]]
        : [['q', q.q], ['ans', typeof q.ans === 'string' ? q.ans : ''], ['exp', q.exp || '']];
      for (const [field, text] of fields) {
        if (!text) continue;
        const m = String(text).match(re);
        if (!m) continue;
        findings[kind].push({ bank, id: q.id, cat: q.cat, field, hit: m[0],
          text: String(text).slice(0, 170) });
        break;   /* one flag per question per shape: this is a reading list, not a tally */
      }
    }
  }
}

/* ---- report ------------------------------------------------------------- */
const total = BANKS.reduce((a, [, l]) => a + ((l || []).length), 0);
console.log('\n  Content claim lint, over ' + total + ' questions in ' + BANKS.length + ' banks');
console.log('  Every line is a claim to CHECK, not a defect to sweep. `ans` is more');
console.log('  trustworthy than the stem around it; never change a defensible keyed answer.\n');

console.log('  count disagreements (the sharp one) : ' + findings.counts.length);
console.log('  superlatives                        : ' + findings.superlative.length);
console.log('  ownership and founder claims        : ' + findings.attribution.length);
console.log('  genetic relation claims             : ' + findings.relation.length);

if (findings.counts.length) {
  console.log('\n  ---- STEM ASKS FOR MORE ITEMS THAN ITS ANSWER HOLDS ----');
  console.log('  codex9 refuses to grade these, silently. Each one is either a stem');
  console.log('  that overcounts or an answer that is short an item.\n');
  for (const f of findings.counts) {
    console.log('  [' + f.bank + '] ' + f.id + '  ' + f.cat);
    console.log('    stem asks for: ' + f.asks + '   answer parses to ' + f.items + ' items');
    console.log('    q  : ' + f.q);
    console.log('    ans: ' + f.ans.slice(0, 220));
    console.log('');
  }
}

if (!ONLY_COUNTS) {
  for (const [kind, label] of [['superlative', 'SUPERLATIVES'],
                               ['attribution', 'OWNERSHIP AND FOUNDER CLAIMS'],
                               ['relation', 'GENETIC RELATION CLAIMS']]) {
    if (!findings[kind].length) continue;
    console.log('\n  ---- ' + label + ' (' + findings[kind].length + ') ----');
    const byCat = new Map();
    for (const f of findings[kind]) {
      if (!byCat.has(f.cat)) byCat.set(f.cat, []);
      byCat.get(f.cat).push(f);
    }
    for (const [cat, rows] of [...byCat.entries()].sort((a, b) => b[1].length - a[1].length)) {
      console.log('\n    ' + cat + '  (' + rows.length + ')');
      for (const f of rows) {
        console.log('      ' + f.id + ' [' + f.field + '] "' + f.hit + '"');
        console.log('         ' + f.text.replace(/\s+/g, ' '));
      }
    }
  }
}

console.log('\n  A count disagreement is the only line here that is certainly wrong.');
console.log('  Everything else is a claim with no margin: check it, or leave it.\n');
/* Exit non-zero ONLY on the count disagreements, because those are the ones
   codex9 has already decided are content bugs. The claim shapes are a reading
   list and must never fail a build, or the next person deletes the check. */
process.exit(findings.counts.length ? 1 : 0);
