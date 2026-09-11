// The structural gate on the producer corpus.
//
//   node .scripts/check-producers.js          gate the live tree
//   node .scripts/check-producers.js <jsDir>  gate some other copy
//
// WHAT THIS IS FOR, AND WHAT IT IS NOT FOR. It cannot tell you whether Chateau
// Margaux is in Margaux. Nothing mechanical can, which is why the corpus was
// written region by region and then read back by a second pass whose only job
// was to refute it, and why .scripts/check-claims.js exists to surface the
// shapes that fluent generation gets wrong. This gate covers the other half:
// the failures that are invisible to a reader and fatal to the app.
//
// Every check below is a bug that shipped somewhere in this project before:
//
//   1. A DUPLICATE ID silently drops a record. prodCorpus() keys on id and
//      keeps the first, so the second producer just is not there, and nothing
//      anywhere says so.
//   2. AN UNKNOWN COUNTRY makes a group of one. The producer view groups on
//      the string, so "Spain & Portugal" and "Spain and Portugal" become two
//      countries in the list and the reader sees the same place twice.
//   3. A RECORD THAT GENERATES NO QUESTION is a record you cannot study. It
//      looks complete on the page and is dead weight in the rotation.
//   4. A SHARED BOTTLING NAME makes "Who makes X?" a question with two right
//      answers and one accepted. codex16 skips that facet when it sees one,
//      but a corpus where it happens forty times has quietly lost forty
//      questions, so this counts them and says so out loud.
//   5. A PICTORIAL GLYPH breaks the app's oldest rule, and an EM-DASH breaks
//      the published tree's dash baseline. Both are one codepoint and neither
//      is visible in a diff.
//   6. AN ICON WINE POINTING AT A PRODUCER THAT IS NOT THERE renders a "Made
//      by" line that says nothing.
//
// Exits non-zero on any failure. The counts are printed either way.

const fs = require('fs'), vm = require('vm'), path = require('path');
const JS = process.argv.slice(2).find((a) => a.charAt(0) !== '-')
  || path.join(__dirname, '..', 'js');

const sandbox = {};
const load = (f) => {
  const p = path.join(JS, f);
  if (!fs.existsSync(p)) return false;
  vm.runInNewContext(fs.readFileSync(p, 'utf8'), sandbox);
  return true;
};
if (!load('data-producers.js')) {
  console.log('\n  js/data-producers.js is not there yet. Nothing to gate.\n');
  process.exit(0);
}
load('reference.js');
const W = vm.runInNewContext(
  '({WINE_PRODUCERS, PRODUCERS: (typeof PRODUCERS!=="undefined"?PRODUCERS:null)})', sandbox);
const ROWS = W.WINE_PRODUCERS || [];

const fail = [], say = [], warn = [];
const fold = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');

/* ---- 0. the shape ------------------------------------------------------- */
const REQUIRED = ['id', 'p', 'country', 'r', 'sub', 'founded', 'holdings', 'style', 'wines', 't', 'why', 'traps'];
const shapeBad = [];
ROWS.forEach((r, i) => {
  if (!r || typeof r !== 'object') { shapeBad.push('row ' + i + ' is not an object'); return; }
  REQUIRED.forEach((k) => {
    if (!Object.prototype.hasOwnProperty.call(r, k)) shapeBad.push((r.id || 'row ' + i) + ' has no ' + k);
  });
  if (!Array.isArray(r.wines)) shapeBad.push((r.id || 'row ' + i) + ': wines is not an array');
  if (!Array.isArray(r.traps)) shapeBad.push((r.id || 'row ' + i) + ': traps is not an array');
  (r.wines || []).forEach((w, j) => {
    if (!w || typeof w.n !== 'string' || !w.n.trim()) shapeBad.push((r.id || i) + ' wine ' + j + ' has no name');
  });
});
if (shapeBad.length) fail.push(['records missing a required field', shapeBad]);
else say.push(`all ${ROWS.length} records carry every required field`);

/* ---- 1. ids are unique, and shaped ------------------------------------- */
const seen = {}, dupes = [], badId = [];
ROWS.forEach((r) => {
  const id = r && r.id;
  if (!id) return;
  if (seen[id]) dupes.push(id); else seen[id] = 1;
  if (!/^[pw]-[a-z0-9-]+$/.test(id)) badId.push(id);
  /* No pipe, ever: level-prefixed stat keys split on it, which is the rule
     codex12 wrote down when it minted bottle ids. */
  if (id.indexOf('|') >= 0) badId.push(id + ' (contains a pipe)');
});
if (dupes.length) fail.push(['duplicate ids, each of which silently drops a record', dupes]);
else say.push('every id is unique');
if (badId.length) fail.push(['ids that are not p- or w- followed by lowercase slug', badId]);

const producers = ROWS.filter((r) => String(r.id).charAt(0) === 'p');
const icons = ROWS.filter((r) => String(r.id).charAt(0) === 'w');
say.push(`${producers.length} estates and ${icons.length} wines in their own right`);

/* ---- 2. countries group cleanly ---------------------------------------- */
const byCountry = {};
ROWS.forEach((r) => { byCountry[r.country] = (byCountry[r.country] || 0) + 1; });
const countries = Object.keys(byCountry);
const nearDupes = [];
countries.forEach((a, i) => countries.slice(i + 1).forEach((b) => {
  /* "Spain & Portugal" against "Spain and Portugal": same place, two headings. */
  const na = fold(a).replace(/\band\b|&/g, '').replace(/\s+/g, '');
  const nb = fold(b).replace(/\band\b|&/g, '').replace(/\s+/g, '');
  if (na === nb) nearDupes.push(a + '  vs  ' + b);
}));
if (nearDupes.length) fail.push(['countries that differ only in punctuation, so the list shows the same place twice', nearDupes]);
const thin = countries.filter((c) => byCountry[c] < 3);
if (thin.length) warn.push('country groups with fewer than three records: '
  + thin.map((c) => c + ' (' + byCountry[c] + ')').join(', '));
say.push(`${countries.length} country groups, largest ${Math.max(...Object.values(byCountry))} records`);

/* ---- 3. every record can be studied ------------------------------------ */
/* Run the SHIPPED generator, not a copy of its rules: codex16 is where the
   facets are decided and this must not be able to disagree with it. */
let drill = null;
try {
  const box = { window: {}, document: { createElement: () => ({ style: {}, appendChild() {} }), head: { appendChild() {} } } };
  box.WINE_PRODUCERS = ROWS;
  box.PRODUCERS = W.PRODUCERS;
  box.S = {}; box.ST = { cellar: [] };
  box.el = () => ({ querySelector: () => null, querySelectorAll: () => [] });
  box.escT = (s) => String(s);
  box.shuffle = (a) => a.slice();
  box.uniqOpts = (c, d) => { const s2 = {}, o = [c]; s2[c] = 1; for (let k = 0; k < d.length && o.length < 4; k++) { if (d[k] && !s2[d[k]]) { s2[d[k]] = 1; o.push(d[k]); } } return o; };
  box.prodView = () => null; box.cellarView = () => null; box.render = () => { };
  box.decorateHome = () => { }; box.applyLevel = () => { }; box.keyOwned = () => true;
  box.bottleLabel = () => ''; box.stopTimer = () => { }; box.resetQ = () => { };
  const src = fs.readFileSync(path.join(JS, 'codex16.js'), 'utf8');
  vm.runInNewContext(src, box);
  drill = vm.runInNewContext('({prodDrillPool, prodCorpus})', box);
} catch (e) {
  fail.push(['codex16.js would not load against this corpus, so nothing can be drilled', [e.message]]);
}

if (drill) {
  const pool = drill.prodDrillPool({});
  const asked = {};
  pool.forEach((q) => { const id = q.id.replace(/^pr-/, '').replace(/-(rg|mk|gr|wn)$/, ''); asked[id] = (asked[id] || 0) + 1; });
  const silent = ROWS.filter((r) => !asked[r.id]);
  if (silent.length) fail.push(['records that generate no question at all, so they cannot be studied',
    silent.map((r) => r.id + '  ' + r.p)]);
  else say.push(`all ${ROWS.length} records generate at least one question (${pool.length} in total)`);

  const thinQ = ROWS.filter((r) => asked[r.id] === 1);
  if (thinQ.length) warn.push(thinQ.length + ' records generate only one question: '
    + thinQ.slice(0, 6).map((r) => r.p).join(', ') + (thinQ.length > 6 ? ', ...' : ''));

  /* Every generated MCQ must be answerable: four distinct options and an
     index that points at one of them. */
  const broken = pool.filter((q) => !q.sa && (!q.opts || q.opts.length !== 4
    || new Set(q.opts).size !== 4 || !(q.a >= 0 && q.a < 4)));
  if (broken.length) fail.push(['generated questions that cannot be answered',
    broken.slice(0, 20).map((q) => q.id + ' | ' + q.q)]);
  else say.push('every generated multiple choice has four distinct options and a valid answer');

  const noAccept = pool.filter((q) => q.sa && (!q.accept || !q.accept.length || !String(q.accept[0]).trim()));
  if (noAccept.length) fail.push(['short answers with nothing to accept', noAccept.map((q) => q.id)]);
}

/* ---- 4. a bottling name that two estates share -------------------------- */
/* Estates, not records: an icon wine and the estate that makes it are one
   claimant, which is why this keys on  where there is one. codex16 decides
   the same way and the two must not be able to disagree. */
const nameOwners = {};
ROWS.forEach((r) => (r.wines || []).forEach((w) => {
  const f = fold(w.n); if (!f) return;
  const estate = r.by || r.id;
  const set = (nameOwners[f] = nameOwners[f] || {});
  set[estate] = r.p;
}));
const shared = Object.keys(nameOwners).filter((f) => Object.keys(nameOwners[f]).length > 1);
if (shared.length) {
  warn.push(shared.length + ' bottling name(s) are claimed by more than one estate, so the '
    + '"who makes this" question is skipped for them: '
    + shared.slice(0, 8).map((f) => Object.values(nameOwners[f]).slice(0,2).join(' / ')).join(', ')
    + (shared.length > 8 ? ', ...' : ''));
} else say.push('no two estates claim a bottling of the same name');

/* ---- 5. the glyph rules ------------------------------------------------- */
/* The keep-set is what the app already ships and the sweep has always
   allowed: the middle dot it uses as a separator, curly quotes in prose, and
   the arrow on its buttons. Everything else above U+2000 is a new pictorial
   character and this is where it stops. */
const KEEP = new Set(['·', '‘', '’', '“', '”', '…', '→']);
const glyphs = [], dashes = [];
const walk = (rec) => {
  const s = JSON.stringify(rec);
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (ch === '—' || ch === '–') { dashes.push(rec.id + ': ' + ch); continue; }
    if (cp > 0x2000 && !KEEP.has(ch)) glyphs.push(rec.id + ': U+' + cp.toString(16).toUpperCase() + ' ' + ch);
  }
};
ROWS.forEach(walk);
if (glyphs.length) fail.push(['pictorial characters, which this app forbids outright',
  [...new Set(glyphs)]]);
else say.push('no pictorial characters anywhere in the corpus');
if (dashes.length) fail.push(['em-dashes and en-dashes, which the published tree counts against a baseline',
  [...new Set(dashes)].slice(0, 30)]);
else say.push('no em-dashes or en-dashes');

/* ---- 6. an icon wine points at a real producer -------------------------- */
const orphan = icons.filter((r) => r.by && !seen[r.by]);
if (orphan.length) fail.push(['icon wines naming a producer that is not in the corpus',
  orphan.map((r) => r.id + ' -> ' + r.by)]);
else if (icons.length) say.push(`every one of the ${icons.length} icon wines either names a producer in the corpus or names none`);

/* ---- 6b. an icon wine that is only its estate under another name -------
   Screaming Eagle is the estate AND the wine, so a w- record for it says
   nothing the p- record does not and the country list prints the name twice,
   once under Estates and once under Wines in their own right. An icon record
   earns its place only when the wine is famous under a name the estate does
   not carry: Sassicaia, not Tenuta San Guido. */
const estateNames = {};
producers.forEach((r) => { estateNames[fold(r.p)] = r.id; });
const echoes = icons.filter((r) => estateNames[fold(r.p)]);
if (echoes.length) fail.push(['icon wines that merely repeat an estate of the same name',
  echoes.map((r) => r.id + '  repeats  ' + estateNames[fold(r.p)])]);
else if (icons.length) say.push('no icon wine merely repeats an estate of the same name');

/* ---- 7. an empty wines array --------------------------------------------- */
const noWine = ROWS.filter((r) => !(r.wines || []).length);
if (noWine.length) fail.push(['records with no bottling at all', noWine.map((r) => r.id + '  ' + r.p)]);
else say.push('every record names at least one bottling');

/* ---- report -------------------------------------------------------------- */
console.log('\n  Checking the producer corpus\n');
for (const s of say) console.log('  ' + s);
if (warn.length) { console.log(''); for (const w of warn) console.log('  note: ' + w); }
if (fail.length) {
  console.log('');
  for (const [what, list] of fail) {
    console.log('  x ' + what + ': ' + list.length);
    for (const r of list.slice(0, 20)) console.log('      ' + r);
    if (list.length > 20) console.log('      ... and ' + (list.length - 20) + ' more');
  }
  console.log('\n  check-producers: FAIL\n');
  process.exit(1);
}
console.log('\n  check-producers: OK\n');
