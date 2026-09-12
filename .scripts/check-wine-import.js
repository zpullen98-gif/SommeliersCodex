/**
 * THE IMPORTER MUST NOT INVENT A FACT ABOUT A WINE.
 *
 * A pasted wine list is somebody's actual list, and the bottles it produces go
 * straight into the study rotation: the drill asks "where does our X come
 * from?" and marks an answer right or wrong. A region this file guessed becomes
 * a region the app then TEACHES. That is the failure this gate exists to stop,
 * and it is the same rule, in the same words, as the Ledger's importer gate:
 * blank is a true answer, a guess is not.
 *
 * Four things are asserted, in rising order of how quietly they would fail:
 *
 *   1. THE PARSER STILL READS A LIST. The ported file is byte-for-byte the
 *      Ledger's, so this is a smoke test, not a suite: its own suite is
 *      BartendersLedger/tools/check-import.mjs and that is where parser bugs
 *      belong.
 *
 *   2. EVERY READ FIELD IS A SUBSTRING OF THE LINE IT CAME FROM. Producer,
 *      wine, vintage and both prices are compared, folded, against the raw
 *      line. This is the check that catches a future "helpful" normaliser: the
 *      moment something expands NV to a year or tidies a name into one the list
 *      never printed, the substring test fails.
 *
 *   3. NOTHING IS FILLED FROM NOWHERE. A region or a grape may only appear on
 *      a row that matched a producer in the corpus, and the row must say so in
 *      `fromCodex`. Style is never filled at all. Run with an EMPTY corpus,
 *      every row must come back with no region and no grape, which is the
 *      strongest form of this check: with nothing to infer from, the importer
 *      must infer nothing.
 *
 *   4. A VINTAGE IS A YEAR THAT IS ON THE PAGE. Case numbers, bin numbers,
 *      scores and years inside words are not vintages.
 *
 * Exits non-zero on any failure. Takes an optional js directory.
 */
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');

/* Takes a js directory, like the other gates, because this file is shared
   with the monorepo where the wing lives at codex/js rather than at js. */
const JS = process.argv.slice(2).find((a) => a.charAt(0) !== '-')
  || join(__dirname, '..', 'js');
const sandbox = {};
vm.runInNewContext(
  readFileSync(join(JS, 'wine-parse.js'), 'utf8') + ';\n' +
  readFileSync(join(JS, 'wine-rows.js'), 'utf8'), sandbox);
const W = vm.runInNewContext(
  '({parseWineText, wineRows, wineTakeVintage, winePlacePrice, wineMatchProducer, wineFold})', sandbox);

const fold = W.wineFold;
const fail = [];
const say = [];

/* A list with the shapes a real one has: two price columns, a single column
   under a heading that names the pour, continuation notes, NV, a producer the
   corpus knows and several it does not, and lines built to bait a wrong read. */
const LIST = [
  'CHAMPAGNE AND SPARKLING',
  '',
  'Krug Grande Cuvee NV                              45 / 260',
  'Pol Roger Brut Reserve NV                         110',
  '',
  'WHITE, BY THE GLASS',
  '',
  'Domaine Leflaive Puligny-Montrachet 2021          24 / 110',
  'Some Unknown Grower Field Blend 2018              19',
  '',
  'RED',
  '',
  'Ridge Lytton Springs 2019 - Zinfandel blend, Dry Creek     95',
  'Chateau Musar Bin 372 1000 Cases                  80',
  'Produttori del Barbaresco Riserva Montefico 2016  145',
  'Chardonnay, in the manner of Coche-Dury           30',
  'Weingut Donnhoff Oberhauser Brucke Riesling Spatlese 2019   19',
  'Quinta do Noval Nacional Vintage Port 2011               400'
].join('\n');

const CORPUS = [
  { id: 'p-krug', p: 'Krug', r: 'Reims', sub: 'Champagne', wines: [{ n: 'Grande Cuvee', grape: 'Chardonnay, Pinot Noir, Meunier' }] },
  { id: 'p-leflaive', p: 'Domaine Leflaive', r: 'Puligny-Montrachet', sub: '', wines: [{ n: 'Chevalier-Montrachet', grape: 'Chardonnay' }] },
  { id: 'p-domaine', p: 'Domaine', r: 'Nowhere At All', sub: '', wines: [{ n: 'Nothing', grape: 'Nonesuch' }] },
  { id: 'p-coche', p: 'Coche-Dury', r: 'Meursault', sub: '', wines: [{ n: 'Meursault Perrieres', grape: 'Chardonnay' }] },
  { id: 'p-donnhoff', p: 'Donnhoff', r: 'Nahe', sub: 'Oberhausen', wines: [{ n: 'Hermannshohle', grape: 'Riesling' }] },
  { id: 'p-noval', p: 'Quinta do Noval', r: 'Douro', sub: 'Pinhao', wines: [{ n: 'Nacional', grape: 'Field blend' }] },
  { id: 'p-noval-nac', p: 'Quinta do Noval Nacional', r: 'Douro', sub: 'Pinhao', wines: [{ n: 'Vintage Port', grape: 'Field blend' }] }
];

/* ---- 1. the parser still reads a list ---------------------------------- */
const parsed = W.parseWineText(LIST);
if (!parsed || !Array.isArray(parsed.dishes) || parsed.dishes.length < 6) {
  fail.push(['the parser did not read the list at all', [JSON.stringify(parsed).slice(0, 200)]]);
} else {
  say.push(`the parser reads ${parsed.dishes.filter((d) => !d.noise && !d.blank).length} rows off a 16 line list`);
}

const { rows, skipped } = W.wineRows(LIST, CORPUS);
if (rows.length < 6) fail.push(['too few bottles came back', [String(rows.length)]]);
else say.push(`${rows.length} bottles drafted, ${skipped.length} note(s) about what was left out`);

/* ---- 2. every read field is a substring of its own line ----------------- */
const invented = [];
rows.forEach((r) => {
  const raw = ' ' + fold(r.raw) + ' ';
  /* The producer is exempt ONLY when it came from the corpus, because the
     corpus spelling is deliberately preferred over the list's. Everything
     else must be on the page. */
  const mustBeOnPage = [['name', r.name], ['vintage', r.vintage === 'NV' ? '' : r.vintage],
  ['glass', r.glass], ['bottle', r.bottle], ['note', r.note]];
  if (!r.matched) mustBeOnPage.push(['producer', r.producer]);
  mustBeOnPage.forEach(([field, v]) => {
    if (!v) return;
    if (raw.indexOf(fold(v)) < 0) invented.push(`${r.raw.trim()} | ${field} = "${v}" is not in the line`);
  });
  /* An NV row must actually say so. */
  if (r.vintage === 'NV' && !/\b(nv|mv|n\.v\.)\b/i.test(r.raw)) {
    invented.push(`${r.raw.trim()} | vintage NV, but the line never says NV`);
  }
});
if (invented.length) fail.push(['fields that are not in the line they came from', invented]);
else say.push('every producer, wine, vintage, price and note is a substring of its own line');

/* ---- 3. nothing is filled from nowhere ---------------------------------- */
const leaked = [];
rows.forEach((r) => {
  if (r.style) leaked.push(`${r.raw.trim()} | style was filled, and style is never read from a list`);
  if (r.region && r.fromCodex.indexOf('region') < 0) leaked.push(`${r.raw.trim()} | region without a codex attribution`);
  if (r.grapes && r.fromCodex.indexOf('grapes') < 0) leaked.push(`${r.raw.trim()} | grapes without a codex attribution`);
  if (r.fromCodex.length && !r.matched) leaked.push(`${r.raw.trim()} | claims a codex source but matched nothing`);
});
if (leaked.length) fail.push(['fields filled without a source', leaked]);

/* The strongest form: with nothing to infer from, infer nothing. */
const bare = W.wineRows(LIST, []).rows;
const bareLeak = bare.filter((r) => r.region || r.grapes || r.style || r.matched || r.fromCodex.length);
if (bareLeak.length) {
  fail.push(['with an EMPTY corpus, rows still came back carrying a region, grape or match',
    bareLeak.map((r) => r.raw.trim() + ' | ' + JSON.stringify({ region: r.region, grapes: r.grapes, style: r.style }))]);
} else {
  say.push(`against an empty corpus all ${bare.length} rows come back with no region, no grape and no match`);
}
if (!leaked.length) say.push('every region and grape on a matched row names the codex as its source');

/* ---- 4. a vintage is a year that is on the page ------------------------- */
const V = [
  ['Ridge Lytton Springs 2019', '2019', 'a plain vintage'],
  ['Krug Grande Cuvee NV', 'NV', 'NV as printed'],
  ['Chateau Musar Bin 372 1000 Cases', '', 'a bin number and a case count are not vintages'],
  ['Barolo Riserva 2016 (95 points)', '2016', 'a score alongside a vintage'],
  ['Chateau Lafite 1855 Classification', '', '1855 is a classification, not this bottle\'s vintage'],
  ['Tignanello 2018', '2018', 'the last token'],
  ['Cuvee 1234', '', 'a four digit number that is not a year'],
  ['Vega Sicilia Unico', '', 'no year at all']
];
const vbad = [];
V.forEach(([line, want, why]) => {
  const got = W.wineTakeVintage(line).vintage;
  if (got !== want) vbad.push(`"${line}" | ${why} | want "${want}", got "${got}"`);
});
if (vbad.length) fail.push(['vintages read wrongly', vbad]);
else say.push(`all ${V.length} vintage cases read correctly, including the four that must yield nothing`);

/* A price column that arrives the wrong way round is read, not guessed. */
const P = [
  [['24 / 110', 'RED'], { glass: '24', bottle: '110' }],
  [['110 / 24', 'RED'], { glass: '24', bottle: '110' }],
  [['45', 'WHITE, BY THE GLASS'], { glass: '45', bottle: '' }],
  [['45', 'RED'], { glass: '', bottle: '45' }],
  [['', 'RED'], { glass: '', bottle: '' }]
];
const pbad = [];
P.forEach(([[price, section], want]) => {
  const got = W.winePlacePrice(price, section);
  if (got.glass !== want.glass || got.bottle !== want.bottle) {
    pbad.push(`"${price}" under "${section}" | want ${JSON.stringify(want)}, got ${JSON.stringify(got)}`);
  }
});
if (pbad.length) fail.push(['prices placed wrongly', pbad]);
else say.push(`all ${P.length} price placements follow the page`);

/* A producer named inside a note is being described, not bottled. */
const midline = rows.find((r) => /in the manner of/i.test(r.raw));
if (!midline) fail.push(['the mid-line producer case never reached a row, so it is untested', []]);
else if (midline.matched) fail.push(['a producer named mid-line was read as the maker',
  [midline.raw.trim() + ' | matched ' + midline.matched]]);
else say.push('a producer named inside a tasting note is not read as the maker');

/* Longest match wins, or every Burgundian estate collapses into "Domaine". */
const lef = rows.find((r) => /leflaive/i.test(r.raw));
if (!lef) fail.push(['the longest-match case never reached a row', []]);
else if (lef.matched !== 'p-leflaive') fail.push(['longest match did not win',
  [lef.raw.trim() + ' | matched ' + (lef.matched || 'nothing') + ', wanted p-leflaive']]);
else say.push('the longer producer name wins over the shorter one it contains');

/* ---- 5. an estate word in front of the name ----------------------------
   A German list writes "Weingut Donnhoff", a Portuguese one "Quinta do",
   an Italian one "Azienda Agricola". Head-matching the raw line missed every
   one of them and left the producer blank, which is the importer failing
   silently rather than loudly. The wine name must survive the skip too: the
   first cut returned the producer and an EMPTY wine, having eaten the bottle. */
const don = rows.find((r) => /donnhoff/i.test(r.raw));
if (!don) fail.push(['the estate-word case never reached a row, so it is untested', []]);
else if (don.matched !== 'p-donnhoff') fail.push(['an estate word in front of the name defeated the match',
  [don.raw.trim() + ' | matched ' + (don.matched || 'nothing')]]);
else if (!don.name) fail.push(['the estate-word skip ate the wine name',
  [don.raw.trim() + ' | producer ' + don.producer + ', wine is empty']]);
else say.push('an estate word in front of the name is skipped, and the wine name survives it');

/* The longer real name still beats the shorter one it contains. */
const nac = rows.find((r) => /nacional/i.test(r.raw));
if (nac && nac.matched !== 'p-noval-nac') fail.push(['the estate-word skip broke longest-match',
  [nac.raw.trim() + ' | matched ' + (nac.matched || 'nothing') + ', wanted p-noval-nac']]);
else if (nac) say.push('the longer estate name still wins after an estate word is skipped');

/* ---- 6. a classification is not a region ------------------------------
    holds a commune on 565 corpus records, a classification on 69 and
   neither on the rest. Joining it to the region put "Premier Cru Classe
   (1855), Margaux" into a bottle's Region field, and the cellar drill then
   asks where that bottle comes from and grades the classification as the
   answer. The region may only come from . */
const subLeak = rows.filter((r) => r.region && CORPUS.some((c) => c.id === r.matched && c.sub
  && r.region.indexOf(c.sub) >= 0 && c.sub !== c.r));
if (subLeak.length) fail.push(['a record sub field reached a bottle region field',
  subLeak.map((r) => r.raw.trim() + ' | region = "' + r.region + '"')]);
else say.push('no bottle region carries a sub field, which is not reliably a place');

/* ---- report -------------------------------------------------------------- */
console.log('\n  Checking what the wine list importer is allowed to say\n');
for (const s of say) console.log('  ' + s);
if (fail.length) {
  console.log('');
  for (const [what, list] of fail) {
    console.log('  x ' + what + ': ' + list.length);
    for (const r of list.slice(0, 15)) console.log('      ' + r);
    if (list.length > 15) console.log('      ... and ' + (list.length - 15) + ' more');
  }
  console.log('\n  check-wine-import: FAIL\n');
  process.exit(1);
}
console.log('\n  check-wine-import: OK\n');
