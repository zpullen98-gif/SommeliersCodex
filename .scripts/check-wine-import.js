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
 * Since the Menu Desk the page is read FIRST. js/menu-desk.js (generated from
 * the World Table's desk modules; its own suite is there, and parser bugs
 * belong there) reads the region, the grapes, the style, the vintage and the
 * pours off the printed lines, and js/wine-rows.js turns each row into a draft
 * bottle that names the source of every field: `fromPage` for what the page
 * said, `fromCodex` for what the Producers filled where the page was silent.
 * So the rule is no longer "region and grape only from the corpus"; it is
 * "every field says where it came from, and the page is where it says".
 *
 * What is asserted, in rising order of how quietly it would fail:
 *
 *   1. THE READER STILL READS A LIST. A smoke test, not a suite.
 *
 *   2. EVERY FIELD THE ROW SAYS CAME OFF THE PAGE IS ON THE PAGE. Each field
 *      named in `fromPage` is compared, folded, against the raw lines of its
 *      row. The producer alone is exempt, and only when the corpus CONFIRMED
 *      its spelling ("Ch. Margaux" is the Court's "Château Margaux"), and then
 *      the corpus name, with or without its estate word, must itself be on
 *      the page. This is the check that catches a future "helpful" normaliser:
 *      the moment something expands NV to a year or tidies a name into one the
 *      list never printed, the substring test fails.
 *
 *   3. NOTHING IS FILLED FROM NOWHERE. Every filled producer, region, grape
 *      and style is in `fromPage` or in `fromCodex`; a `fromCodex` field needs
 *      a `matched` record; style comes from the page or not at all. Run with
 *      an EMPTY corpus, `fromCodex` is empty and `matched` is blank on every
 *      row, and whatever region, grape or style remains is on the page.
 *
 *   4. A VINTAGE IS A YEAR THAT IS ON THE PAGE. Case numbers, bin numbers,
 *      scores and years inside words are not vintages.
 *
 *   5. THE DESK PATH, END TO END. A cellar PDF's shape (bins, NV on its own
 *      line, the descriptor under the name, the price under that) goes through
 *      readMenu, wineRowFromDesk and cellarSanitize, and each bottle is what
 *      the page printed, with the corpus asked only about what it left empty.
 *
 *   6. ONE SAVE FOR THE BATCH, AND HER MARKS RIDE THROUGH THE COERCION.
 *      cellarAddMany skips a bottle already on the list and a bottle twice in
 *      the batch, refuses a row with neither producer nor name, and saves once;
 *      cellarSanitize carries `maitre` coerced and drops anything else,
 *      including any allergen key a tampered file might carry.
 *
 *   7. THE HASH IS THE PORT'S. The "never twice" check compares hash strings
 *      across three apps, so the seam here must equal hashText exactly.
 *
 *   8. A FIGURE THE PAGE DID NOT PRINT IS BLANKED, NOT FLAGGED AND FILED.
 *      readDeskFile keeps any string it finds in a bottle, a pour or a
 *      printed price, so a desk file from another device can carry a price
 *      the page never printed. wineRowFromDesk holds every figure against the
 *      row's raw lines; one that is not there leaves the field blank, is named
 *      in `priceBlanked` and `why`, and never reaches the note. "4 oz" inside
 *      "3/4 oz", "45" inside "145" and "9" inside "9.50" are not on the page.
 *
 *   9. HER READ LANDS IN THE SAME SHAPE AS THE WORLD TABLE'S. v24DeskFromMaitre
 *      is the plain-wing copy of maitre-adopt.ts: a pour is split on its
 *      measure word whichever way round she wrote it, the price line is her
 *      figures in parts, a priceless or over-long or client-flagged row is
 *      low with the reason, a dish she marked low stays low, rows come back
 *      in page order, and an unchecked read carries the notice.
 *
 *  10. "DONE FOR NOW" STRANDS NOTHING. The inbox share is stamped taken only
 *      when every row was added or left out; with a row undecided the share
 *      is still offered and the report says so.
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
  readFileSync(join(JS, 'menu-desk.js'), 'utf8') + ';\n' +
  readFileSync(join(JS, 'wine-rows.js'), 'utf8'), sandbox);
const W = vm.runInNewContext(
  '({parseWineText, wineRows, wineRowFromDesk, wineTakeVintage, winePlacePrice, wineMatchProducer, wineFold, ' +
  'wineCorpusForms, wineDeskHash, wineDeskSource, readMenu, readDeskFile, deskSource, hashText})', sandbox);

/* codex24 is loaded on top with the two functions it extends sliced out of
   codex12 (the shipped coercion, not a copy of it) and the three globals it
   needs to file a bottle. Every other hook in codex24 is behind a typeof
   guard, which is what lets it load against nothing. */
const c12 = readFileSync(join(JS, 'codex12.js'), 'utf8');
const slice = (name) => {
  const m = c12.match(new RegExp('function ' + name + '\\([^)]*\\)\\{[\\s\\S]*?\\n\\}'));
  if (!m) throw new Error('codex12.js no longer carries function ' + name);
  return m[0];
};
/* S, render and a Storage stand-in exist only so v24Finish can run: the port
   reads `localStorage` at call time through defaultStorage, so a stub named
   that way is the inbox. bottleLabel is codex12's, sliced like the others. */
vm.runInNewContext(
  slice('mintBottleId') + '\n' + slice('cellarSanitize') + '\n' + slice('bottleLabel') + '\n' +
  'var ST = { cellar: [] }; var SAVES = 0; function stSave() { SAVES++; }\n' +
  'var S = { view: "" }; var RENDERS = 0; function render() { RENDERS++; }\n' +
  'var localStorage = { _d: {}, getItem: function (k) { return Object.prototype.hasOwnProperty.call(this._d, k) ? this._d[k] : null; },' +
  ' setItem: function (k, v) { this._d[k] = String(v); }, removeItem: function (k) { delete this._d[k]; } };\n' +
  readFileSync(join(JS, 'codex24.js'), 'utf8'), sandbox);
const C = vm.runInNewContext('({cellarSanitize, cellarAddMany, v24DeskFromMaitre, v24Pour, v24Finish, v24Flags, v24Row, deskInbox, priceParts, V24_NO_PRICE_WHY, V24_UNVERIFIED})', sandbox);

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
  'Quinta do Noval Nacional Vintage Port 2011               400',
  'Chateau Petrus 2015                                     4200',
  'Sassicaia 2016                                          1,250'
].join('\n');

const CORPUS = [
  { id: 'p-krug', p: 'Krug', r: 'Reims', sub: 'Champagne', wines: [{ n: 'Grande Cuvee', grape: 'Chardonnay, Pinot Noir, Meunier' }] },
  { id: 'p-leflaive', p: 'Domaine Leflaive', r: 'Puligny-Montrachet', sub: '', wines: [{ n: 'Chevalier-Montrachet', grape: 'Chardonnay' }] },
  { id: 'p-domaine', p: 'Domaine', r: 'Nowhere At All', sub: '', wines: [{ n: 'Nothing', grape: 'Nonesuch' }] },
  { id: 'p-coche', p: 'Coche-Dury', r: 'Meursault', sub: '', wines: [{ n: 'Meursault Perrieres', grape: 'Chardonnay' }] },
  { id: 'p-donnhoff', p: 'Donnhoff', r: 'Nahe', sub: 'Oberhausen', wines: [{ n: 'Hermannshohle', grape: 'Riesling' }] },
  { id: 'p-noval', p: 'Quinta do Noval', r: 'Douro', sub: 'Pinhao', wines: [{ n: 'Nacional', grape: 'Field blend' }] },
  { id: 'p-noval-nac', p: 'Quinta do Noval Nacional', r: 'Douro', sub: 'Pinhao', wines: [{ n: 'Vintage Port', grape: 'Field blend' }] },
  { id: 'p-petrus', p: 'Chateau Petrus', r: 'Pomerol', sub: '', wines: [{ n: 'Petrus', grape: 'Merlot' }] },
  { id: 'p-san-guido', p: 'Tenuta San Guido', r: 'Bolgheri', sub: '', wines: [{ n: 'Sassicaia', grape: 'Cabernet Sauvignon, Cabernet Franc' }] },
  { id: 'w-sassicaia', p: 'Sassicaia', by: 'p-san-guido', r: 'Bolgheri', sub: '', wines: [{ n: 'Sassicaia', grape: 'Cabernet Sauvignon, Cabernet Franc' }] },
  /* for the desk fixture: a spelling to confirm, a sub that is a classification, an icon and its maker */
  { id: 'p-margaux', p: 'Château Margaux', r: 'Margaux', sub: 'Premier Cru Classé (1855), Margaux', wines: [{ n: 'Château Margaux', grape: 'Cabernet Sauvignon' }] },
  { id: 'p-penfolds', p: 'Penfolds', r: 'South Australia', sub: 'Barossa', wines: [{ n: 'Bin 389', grape: 'Cabernet Sauvignon, Shiraz' }] },
  { id: 'w-grange', p: 'Penfolds Grange', by: 'p-penfolds', r: 'South Australia', sub: '', wines: [{ n: 'Grange', grape: 'Shiraz' }] }
];

/* ---- the two substring rules, used on every path ------------------------ */

/* The note is the descriptor line verbatim plus, when the list printed more
   than one pour, "Pours: 5 oz 45.00, 2.5 oz 22.50" from printed figures. The
   word "Pours:" is the app's; every size and price after it must be the page's. */
function noteBits(note) {
  const at = note.indexOf('Pours: ');
  if (at < 0) return [note];
  const bits = [];
  if (at > 0) bits.push(note.slice(0, at).trim());
  note.slice(at + 7).split(', ').forEach((pour) => {
    pour.trim().split(/\s+(?=\S+$)/).forEach((b) => { if (b) bits.push(b); });
  });
  return bits;
}

/* Every field the row says came off the page, checked against the page.
   Returns the offences, one line each. */
function pageOffences(r, corpus) {
  const out = [];
  const raw = ' ' + fold(r.raw) + ' ';
  const on = (v) => raw.indexOf(fold(v)) >= 0;
  (r.fromPage || []).forEach((field) => {
    const v = r[field];
    if (!v) { out.push(`${r.raw.trim()} | ${field} is in fromPage but empty`); return; }
    if (field === 'producer' && r.matched) {
      /* The corpus spelling is preferred over the list's, so the corpus name
         itself, with or without its estate word, must be what the page said. */
      const rec = (corpus || []).find((c) => c.id === r.matched);
      const forms = rec ? W.wineCorpusForms(rec) : [];
      if (!forms.some((f) => raw.indexOf(' ' + f + ' ') >= 0)) {
        out.push(`${r.raw.trim()} | producer "${v}" was confirmed by ${r.matched}, which is not on the page in any spelling`);
      }
      return;
    }
    const bits = field === 'grapes' ? v.split(', ') : field === 'note' ? noteBits(v) : field === 'vintage' && v === 'NV' ? [] : [v];
    bits.forEach((b) => { if (b && !on(b)) out.push(`${r.raw.trim()} | ${field} = "${b}" is not in the line`); });
  });
  /* An NV row must actually say so. */
  if (r.vintage === 'NV' && !/\b(nv|mv|n\.v\.)\b/i.test(r.raw)) out.push(`${r.raw.trim()} | vintage NV, but the line never says NV`);
  /* A filled field that names no source, or names the corpus without a match. */
  ['producer', 'region', 'grapes', 'style'].forEach((field) => {
    if (!r[field]) return;
    const page = (r.fromPage || []).indexOf(field) >= 0, codex = (r.fromCodex || []).indexOf(field) >= 0;
    if (!page && !codex) out.push(`${r.raw.trim()} | ${field} = "${r[field]}" names no source`);
    if (codex && !r.matched) out.push(`${r.raw.trim()} | ${field} claims the codex but matched nothing`);
    if (field === 'style' && codex) out.push(`${r.raw.trim()} | style came from the codex, and style is only ever read off the page`);
  });
  return out;
}

/* ---- 1. the reader still reads a list ----------------------------------- */
const parsed = W.parseWineText(LIST);
if (!parsed || !Array.isArray(parsed.dishes) || parsed.dishes.length < 6) {
  fail.push(['the reader did not read the list at all', [JSON.stringify(parsed).slice(0, 200)]]);
} else {
  say.push(`the reader reads ${parsed.dishes.filter((d) => !d.noise && !d.blank).length} rows off a 16 line list`);
}

const { rows, skipped } = W.wineRows(LIST, CORPUS);
if (rows.length < 6) fail.push(['too few bottles came back', [String(rows.length)]]);
else {
  const wines = rows.filter((r) => r.kindRead === 'wine' || r.kindRead === 'unsure').length;
  say.push(`${rows.length} rows drafted (${wines} as wines, ${rows.length - wines} read as something else for a person to decide), ${skipped.length} note(s) about what was left out`);
}

/* ---- 2 and 3. on the page, or from a named source ----------------------- */
let invented = [];
rows.forEach((r) => { invented = invented.concat(pageOffences(r, CORPUS)); });
if (invented.length) fail.push(['fields that are not in the line they came from, or name no source', invented]);
else say.push('every field a row says came off the page is on the page, and every filled field names its source');

/* The strongest form: with nothing to infer from, infer nothing. */
const bare = W.wineRows(LIST, []).rows;
const bareLeak = bare.filter((r) => r.matched || r.fromCodex.length);
let bareInvented = [];
bare.forEach((r) => { bareInvented = bareInvented.concat(pageOffences(r, [])); });
if (bareLeak.length) {
  fail.push(['with an EMPTY corpus, rows still claim a match or a codex field',
    bareLeak.map((r) => r.raw.trim() + ' | ' + JSON.stringify({ matched: r.matched, fromCodex: r.fromCodex }))]);
} else if (bareInvented.length) {
  fail.push(['with an EMPTY corpus, a field is filled that the page did not print', bareInvented]);
} else {
  const filled = bare.filter((r) => r.region || r.grapes || r.style).length;
  say.push(`against an empty corpus nothing is in fromCodex on any of ${bare.length} rows, and the ${filled} that still carry a region, grape or style read it off the page`);
}

/* Style is a printed word or nothing: the rows that carry one say so. */
const styled = rows.filter((r) => r.style);
if (styled.length && styled.every((r) => r.fromPage.indexOf('style') >= 0)) say.push(`style is filled on ${styled.length} rows, every one from a word on the page`);
else if (styled.length) fail.push(['a style was filled without the page', styled.filter((r) => r.fromPage.indexOf('style') < 0).map((r) => r.raw.trim())]);

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

/* ---- an estate word in front of the name --------------------------------
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

/* ---- a classification is not a region ------------------------------------
   `sub` holds a commune on 565 corpus records, a classification on 69 and
   neither on the rest. Joining it to the region put "Premier Cru Classe
   (1855), Margaux" into a bottle's Region field, and the cellar drill then
   asks where that bottle comes from and grades the classification as the
   answer. The region may only come from `r`. */
const subLeak = rows.filter((r) => r.region && r.fromCodex.indexOf('region') >= 0 && CORPUS.some((c) => c.id === r.matched && c.sub
  && r.region.indexOf(c.sub) >= 0 && c.sub !== c.r));
if (subLeak.length) fail.push(['a record sub field reached a bottle region field',
  subLeak.map((r) => r.raw.trim() + ' | region = "' + r.region + '"')]);
else say.push('no bottle region carries a sub field, which is not reliably a place');

/* ---- a wine list prints four figures -------------------------------------
   PRICED_BARE capped a bare whole number at three digits, which is right for
   a food menu and loses the top of a wine list. A bottle at 1250 or 4200 was
   not a price, so either the number stayed inside the wine's name or, when
   the line followed a priced one, the whole line was absorbed as the previous
   bottle's tasting note and that bottle left the import in silence. The cap
   was protecting a YEAR, so a year is what is excluded now. */
const big = rows.find((r) => /petrus/i.test(r.raw));
if (!big) fail.push(['the four figure price case never reached a row', []]);
else if (big.bottle !== '4200') fail.push(['a four figure price was not read as a price',
  [big.raw.trim() + ' | bottle = ' + JSON.stringify(big.bottle) + ', name = ' + JSON.stringify(big.name)]]);
else if (/4200/.test(big.name)) fail.push(['the price was left inside the wine name', [big.name]]);
else say.push('a four figure price is read as a price and leaves the wine name');

const sep = rows.find((r) => /sassicaia/i.test(r.raw));
if (sep && sep.bottle !== '1,250') fail.push(['a thousands separator defeated the price',
  [sep.raw.trim() + ' | bottle = ' + JSON.stringify(sep.bottle)]]);
else if (sep) say.push('a price printed with a thousands separator is read whole');

/* And the thing the cap existed for still holds. */
const vintageAsPrice = rows.filter((r) => /^(19|20)\d{2}$/.test(String(r.bottle)) || /^(19|20)\d{2}$/.test(String(r.glass)));
if (vintageAsPrice.length) fail.push(['a vintage was read as a price',
  vintageAsPrice.map((r) => r.raw.trim() + ' | ' + r.glass + ' / ' + r.bottle)]);
else say.push('no vintage was read as a price');

/* ---- a wine looked up by its own name is not its own producer -------------
   103 corpus records exist so a candidate can find Sassicaia without knowing
   Tenuta San Guido. Head-matching found them first, so the wine's name went
   into the Producer field and the Wine field was left empty. The maker is in
   the record's `by`. */
if (sep) {
  if (sep.producer !== 'Tenuta San Guido') {
    fail.push(['an icon wine was imported as its own producer',
      [sep.raw.trim() + ' | producer = ' + JSON.stringify(sep.producer) + ', wine = ' + JSON.stringify(sep.name)]]);
  } else if (sep.name !== 'Sassicaia') {
    fail.push(['the icon wine lost its own name', [sep.raw.trim() + ' | wine = ' + JSON.stringify(sep.name)]]);
  } else if (sep.fromCodex.indexOf('producer') < 0) {
    fail.push(['an inferred producer did not declare itself in fromCodex', [sep.raw.trim()]]);
  } else {
    say.push('a wine looked up by its own name resolves to its maker, and says the maker was inferred');
  }
}

/* ---- 5. the desk path, end to end ---------------------------------------
   The fixture is a cellar PDF's shape: a bin number and a gap before the
   name, NV on its own line, the descriptor line under the name, the price
   under that. Every one of these lost the whole row under the old reader. */
const FIX = readFileSync(join(__dirname, 'fixtures', 'codex-pdf-list.txt'), 'utf8');
const file = W.readMenu(FIX, W.deskSource('paste', 'codex', FIX));
const dbad = [];
const desk = (file.items || []).map((i) => W.wineRowFromDesk(i, CORPUS));
if (file.items.length !== 8 || file.items.some((i) => i.kind !== 'wine')) dbad.push('want 8 wines, got ' + file.items.map((i) => i.kind).join(','));
if (file.unsorted.length) dbad.push('lines set aside: ' + JSON.stringify(file.unsorted));
if (file.source.readIn !== 'codex' || file.source.hash !== W.hashText(FIX)) dbad.push('the source block is not this room\'s: ' + JSON.stringify(file.source));
desk.forEach((r) => { pageOffences(r, CORPUS).forEach((o) => dbad.push(o)); });
const byRaw = (re) => desk.find((r) => re.test(r.raw));
const pin = (what, ok) => { if (!ok) dbad.push(what); };
desk.forEach((r) => {
  pin(`${r.raw.split('\n')[0]} | the bin number reached the bottle`, !/^\d/.test(r.producer) && !/^\d/.test(r.name));
  pin(`${r.raw.split('\n')[0]} | the bottle price is not the printed one`, r.bottle === r.raw.split('\n').pop().trim() && r.glass === '');
});
const ploy = byRaw(/Ployez/), krug = byRaw(/Krug/), lefB = byRaw(/Leflaive Bourgogne/), marg = byRaw(/Ch\. Margaux/),
  lynch = byRaw(/Lynch-Bages/), bin389 = byRaw(/Bin 389/), grange = byRaw(/Grange/);
pin('Ployez: NV on its own line is the vintage', !!ploy && ploy.vintage === 'NV');
pin('Ployez: the style is the printed word and from the page', !!ploy && ploy.style === 'Extra Brut' && ploy.fromPage.indexOf('style') >= 0);
pin('Ployez: region and country joined only because the page printed them so', !!ploy && ploy.region === 'Champagne, France');
pin('Ployez: an unknown house is the page\'s spelling and no match', !!ploy && ploy.producer === 'Ployez-Jacquemart' && ploy.matched === '' && !ploy.fromCodex.length);
pin('Krug: the page\'s region beats the corpus\'s (Champagne, not Reims)', !!krug && krug.region === 'Champagne, France' && krug.fromCodex.indexOf('region') < 0);
pin('Krug: the grapes the page left empty came from the Producers, and say so', !!krug && krug.matched === 'p-krug' && krug.grapes === 'Chardonnay, Pinot Noir, Meunier' && krug.fromCodex.indexOf('grapes') >= 0);
pin('Leflaive: the corpus name minus its own estate word finds Domaine Leflaive', !!lefB && lefB.matched === 'p-leflaive' && lefB.producer === 'Domaine Leflaive' && lefB.name === 'Bourgogne Blanc' && lefB.vintage === '2021');
pin('Ch. Margaux: the spelling is confirmed to the Court\'s, and the region stays the page\'s', !!marg && marg.matched === 'p-margaux' && marg.producer === 'Château Margaux' && marg.region === 'Margaux, Bordeaux, France' && marg.vintage === '2015');
pin('Ch. Margaux: the classification in sub never reaches the region', !!marg && marg.region.indexOf('1855') < 0);
pin('Lynch-Bages: a house the corpus lacks keeps the page\'s spelling', !!lynch && lynch.producer === 'Ch. Lynch-Bages' && lynch.matched === '');
pin('Bin 389: the bin stays in the wine name and is neither a price nor a vintage', !!bin389 && /Bin 389/.test(bin389.name) && bin389.vintage === '2018' && bin389.bottle === '1600');
pin('Grange: the icon resolves to Penfolds, declared, and keeps its own name', !!grange && grange.matched === 'p-penfolds' && grange.producer === 'Penfolds' && grange.name === 'Grange' && grange.fromCodex.indexOf('producer') >= 0);
/* Each draft through the shipped coercion: nine fields, id, ts, and nothing of the draft's scaffolding.
   `house` is the id of the House a bottle belongs to (codex27 carries it when set); a stray key is still refused. */
const ALLOWED = ['id', 'ts', 'producer', 'name', 'vintage', 'region', 'grapes', 'style', 'glass', 'bottle', 'note', 'maitre', 'house'];
desk.forEach((r) => {
  const rec = C.cellarSanitize(Object.assign({ id: 'w-test0001', ts: 1 }, r));
  const stray = Object.keys(rec).filter((k) => ALLOWED.indexOf(k) < 0);
  pin(`${r.raw.split('\n')[0]} | cellarSanitize let the draft's scaffolding into the record: ${stray.join(',')}`, !stray.length);
  pin(`${r.raw.split('\n')[0]} | cellarSanitize changed a page field`, ['producer', 'name', 'vintage', 'region', 'grapes', 'style', 'bottle', 'note'].every((k) => rec[k] === r[k]));
});
if (dbad.length) fail.push(['the desk path', dbad]);
else say.push(`the desk path reads ${desk.length} bins off the cellar PDF fixture, each what the page printed, the corpus filling only what the page left empty`);

/* Two pours under one name: the note carries the sizes with their prices,
   every figure the page's, the glass is the first pour, and there is no bottle. */
const POURS = 'OUR WINE PROGRAM\nWINE BY GLASS\nPloyez-Jacquemart\n45.00 / 22.50\n5 oz / 2.5 oz\n2010\nExtra-Brut, Champagne, France\n';
const pfile = W.readMenu(POURS, W.deskSource('paste', 'codex', POURS));
const prow = pfile.items.length === 1 ? W.wineRowFromDesk(pfile.items[0], CORPUS) : null;
const pourBad = prow ? pageOffences(prow, CORPUS) : ['the pours case read ' + pfile.items.length + ' rows, not 1'];
if (prow) {
  if (prow.glass !== '45.00' || prow.bottle !== '') pourBad.push('glass/bottle: ' + JSON.stringify([prow.glass, prow.bottle]));
  if (prow.note !== 'Extra-Brut, Champagne, France Pours: 5 oz 45.00, 2.5 oz 22.50') pourBad.push('note: ' + JSON.stringify(prow.note));
  if (prow.vintage !== '2010' || prow.style !== 'Extra-Brut') pourBad.push('vintage/style: ' + JSON.stringify([prow.vintage, prow.style]));
  if (prow.producer || prow.name !== 'Ployez-Jacquemart' || prow.matched) pourBad.push('producer/name: ' + JSON.stringify([prow.producer, prow.name, prow.matched]));
}
if (pourBad.length) fail.push(['two pours under one name', pourBad]);
else say.push('two pours under one name become a glass price and a note of printed sizes and figures, with no bottle invented');

/* ---- 6. one save for the batch, and her marks through the coercion ------- */
const mbad = [];
const dirty = C.cellarSanitize({
  id: 'w-mark0001', ts: 1, producer: 'Krug', name: 'Grande Cuvee', vintage: 'NV', region: 'Champagne', grapes: '', style: '', glass: '', bottle: '260', note: '',
  allergens: ['nuts'],
  maitre: {
    say: { value: 'kroog', by: 'robot', ts: '5' },
    guest: { value: '', by: 'person', ts: 6 },
    why: { value: 'x'.repeat(4100), by: 'person', ts: 9, model: 'claude-opus-5' },
    kept: [{ q: 'why', a: 'because', ts: 7 }, { q: 'no answer' }],
    allergens: 'none'
  }
});
if (!dirty.maitre) mbad.push('maitre was dropped by the coercion');
else {
  if (!dirty.maitre.say || dirty.maitre.say.by !== 'maitre' || dirty.maitre.say.ts !== 5) mbad.push('say: an unknown `by` must become hers, ts a number: ' + JSON.stringify(dirty.maitre.say));
  if (dirty.maitre.guest) mbad.push('guest: an empty value must not survive');
  /* 4000 since 3 Oct 2026: the House's prose cap, raised from 600 beside its reason in codex24. */
  if (!dirty.maitre.why || dirty.maitre.why.value.length !== 4000 || dirty.maitre.why.model !== 'claude-opus-5') mbad.push('why: capped at 4000 with its model kept: ' + JSON.stringify(dirty.maitre.why && dirty.maitre.why.value.length));
  if (!dirty.maitre.kept || dirty.maitre.kept.length !== 1) mbad.push('kept: one sound answer, the unanswered one dropped: ' + JSON.stringify(dirty.maitre.kept));
}
if (/allerg/i.test(JSON.stringify(dirty))) mbad.push('an allergen key rode through cellarSanitize: ' + JSON.stringify(dirty));
if (C.cellarSanitize({ id: 'w-plain0001', ts: 1, producer: 'Krug' }).maitre !== undefined) mbad.push('a bottle with no marks gained a maitre key');

sandbox.ST.cellar = [{ id: 'w-have0001', ts: 1, producer: 'Krug', name: 'Grande Cuvee', vintage: 'NV', region: '', grapes: '', style: '', glass: '', bottle: '260', note: '' }];
sandbox.SAVES = 0;
const res = C.cellarAddMany([
  { producer: 'KRUG', name: 'Grande Cuvée', vintage: 'nv', bottle: '260' },
  { producer: 'Pol Roger', name: 'Brut Reserve', vintage: 'NV', bottle: '110', maitre: { say: { value: 'pol ro-ZHAY', by: 'maitre', ts: 1 } } },
  { producer: 'Pol Roger', name: 'Brut Reserve', vintage: 'NV', bottle: '110' },
  { producer: '', name: '', vintage: '2019' },
  null
]);
if (res.added !== 1 || res.dup !== 2 || res.refused !== 2) mbad.push('the tally: ' + JSON.stringify(res) + ', wanted added 1, dup 2 (one on the list in another spelling, one twice in the batch), refused 2');
if (sandbox.SAVES !== 1) mbad.push('stSave ran ' + sandbox.SAVES + ' times for one batch');
if (sandbox.ST.cellar.length !== 2) mbad.push('the list has ' + sandbox.ST.cellar.length + ' bottles, wanted 2');
const added = sandbox.ST.cellar[1];
if (added) {
  if (!/^w-[0-9a-z]{8}$/.test(added.id)) mbad.push('the minted id is ' + JSON.stringify(added.id));
  if (!(added.ts > 0)) mbad.push('ts was not stamped');
  if (!added.maitre || !added.maitre.say || added.maitre.say.by !== 'maitre') mbad.push('her line did not ride into the record: ' + JSON.stringify(added.maitre));
  if (added.producer !== 'Pol Roger' || added.bottle !== '110') mbad.push('the record is not the row: ' + JSON.stringify(added));
}
const again = C.cellarAddMany([{ producer: 'Pol Roger', name: 'Brut Reserve', vintage: 'NV' }]);
if (again.added !== 0 || again.dup !== 1 || sandbox.SAVES !== 1) mbad.push('a second run of a bottle now on the list must add nothing and save nothing: ' + JSON.stringify(again) + ', saves ' + sandbox.SAVES);
if (mbad.length) fail.push(['one save for the batch, her marks through the coercion', mbad]);
else say.push('cellarAddMany adds once, skips a bottle already on the list and a bottle twice in the batch, refuses a nameless row and saves once; her marks ride through cellarSanitize and no allergen key does');

/* ---- 7. the hash is the port's -------------------------------------------- */
const hbad = [];
const pasted = '  STARTERS\n  Soup‍ of the day   9\n\n', linked = 'STARTERS\nSoup of the day\t9';
if (W.wineDeskHash(pasted) !== W.wineDeskHash(linked)) hbad.push('the same menu by two doors hashed differently');
if (W.wineDeskHash(linked) !== W.hashText(linked)) hbad.push('wineDeskHash is not hashText');
/* The port's own value for this text on the day the gate was written. If it
   moves, either the port's hashText changed (and every "already read" check
   across three apps with it) or the seam here stopped calling it. */
if (W.wineDeskHash('STARTERS\nSoup 9') !== 'aad7335f') hbad.push('the pinned value moved: ' + W.wineDeskHash('STARTERS\nSoup 9'));
const src = W.wineDeskSource('Soup 9', 'agent', { reader: 'maitre/claude-haiku-4-5' });
if (src.readIn !== 'codex' || src.kind !== 'agent' || src.reader !== 'maitre/claude-haiku-4-5' || src.hash !== W.hashText('Soup 9') || !src.at) hbad.push('the source block: ' + JSON.stringify(src));
if (W.wineDeskSource('x').kind !== 'paste' || W.wineDeskSource('x').reader !== 'desk-reader/1') hbad.push('the default source block is not a paste read here');
if (hbad.length) fail.push(['the hash and the source block', hbad]);
else say.push('the "never twice" hash is the port\'s own, the same by every door, and the source block says the read was here');

/* ---- 8. a figure the page did not print is blanked ----------------------- */
const gbad = [];
const wineItem = (over) => Object.assign({
  id: 'k-00000001', kind: 'wine', section: 'RED', name: 'Ridge Lytton Springs', producer: 'Ridge', wine: 'Lytton Springs',
  vintage: '2019', region: '', country: '', grapes: [], style: '', bin: '', pours: [], bottle: '', descriptors: '',
  price: { printed: '', parts: [] }, marks: [], confidence: 'high', why: [],
  raw: 'Ridge Lytton Springs 2019\n45.00 / 22.50\n5 oz / 2.5 oz', lines: [0, 2]
}, over);
const gpin = (what, ok) => { if (!ok) gbad.push(what); };
const noteHas = (r, fig) => r.note.indexOf(fig) >= 0;

/* A bottle price the page never printed. */
let g = W.wineRowFromDesk(wineItem({ bottle: '95' }), []);
gpin('a bottle price not on the page must be blank: ' + JSON.stringify(g.bottle), g.bottle === '');
gpin('a blanked bottle must leave fromPage: ' + JSON.stringify(g.fromPage), g.fromPage.indexOf('bottle') < 0);
gpin('a blanked bottle is listed in priceBlanked: ' + JSON.stringify(g.priceBlanked), Array.isArray(g.priceBlanked) && g.priceBlanked.indexOf('95') >= 0);
gpin('a blanked bottle is named in why: ' + JSON.stringify(g.why), g.why.some((w) => /No price on this line: 95 is not on the page/.test(w)));
gpin('the flag on screen says so', C.v24Flags({ draft: g, status: '' }, null).indexOf('No price on this line') >= 0);

/* A pour whose price is not on the page: the price goes, the printed size stays, the note carries no invented figure. */
g = W.wineRowFromDesk(wineItem({ pours: [{ price: '99.00', size: '5 oz' }, { price: '22.50', size: '2.5 oz' }] }), []);
gpin('a pour price not on the page must be blank: ' + JSON.stringify(g.pours), g.pours.length === 2 && g.pours[0].price === '' && g.pours[0].size === '5 oz' && g.pours[1].price === '22.50');
gpin('the glass is the first pour, now blank: ' + JSON.stringify(g.glass), g.glass === '' && g.fromPage.indexOf('glass') < 0);
gpin('the note carries the sizes and the printed figure only: ' + JSON.stringify(g.note), g.note === 'Pours: 5 oz, 2.5 oz 22.50' && !noteHas(g, '99'));
gpin('99.00 is listed as blanked', (g.priceBlanked || []).indexOf('99.00') >= 0);

/* "3/4 oz" is on the page; "4 oz" is not, though it is a substring of it. */
g = W.wineRowFromDesk(wineItem({ raw: 'House pour 3/4 oz 14', pours: [{ price: '14', size: '4 oz' }] }), []);
gpin('"4 oz" inside "3/4 oz" is not a printed measure: ' + JSON.stringify(g.pours), g.pours.length === 1 && g.pours[0].size === '' && g.pours[0].price === '14');
gpin('the measure is listed as blanked: ' + JSON.stringify(g.priceBlanked), (g.priceBlanked || []).indexOf('4 oz') >= 0);
g = W.wineRowFromDesk(wineItem({ raw: 'House pour 3/4 oz 14', pours: [{ price: '14', size: '3/4 oz' }] }), []);
gpin('"3/4 oz" itself is on the page: ' + JSON.stringify(g.pours), g.pours.length === 1 && g.pours[0].size === '3/4 oz' && !g.priceBlanked);

/* A figure inside a larger figure is not that figure. */
g = W.wineRowFromDesk(wineItem({ raw: 'Barolo 2016\n145', bottle: '45' }), []);
gpin('"45" inside "145" is not on the page: ' + JSON.stringify(g.bottle), g.bottle === '' && (g.priceBlanked || []).indexOf('45') >= 0);
g = W.wineRowFromDesk(wineItem({ raw: 'Soup 9.50', bottle: '9' }), []);
gpin('"9" inside "9.50" is not on the page: ' + JSON.stringify(g.bottle), g.bottle === '');
g = W.wineRowFromDesk(wineItem({ raw: 'Barolo 2016\n145', bottle: '145' }), []);
gpin('the printed figure itself passes: ' + JSON.stringify(g.bottle), g.bottle === '145' && g.fromPage.indexOf('bottle') >= 0 && !g.priceBlanked);

/* An unsure row's one printed price is held to the same rule. */
g = W.wineRowFromDesk({ id: 'k-00000002', kind: 'unsure', could: ['wine'], section: 'RED', name: 'Barolo', price: { printed: '145', parts: [] }, marks: [], confidence: 'low', why: [], raw: 'Barolo 45', lines: [0, 0] }, []);
gpin('an unsure row\'s printed price not on the page is blank: ' + JSON.stringify([g.glass, g.bottle]), g.glass === '' && g.bottle === '' && (g.priceBlanked || []).indexOf('145') >= 0);

/* Through the validator: readDeskFile keeps the bad string, the draft does not. */
const badFile = W.readDeskFile({ format: 'oot-menu-desk', version: 1, createdAt: new Date().toISOString(), source: W.deskSource('paste', 'table', 'x'), items: [wineItem({ bottle: '95', pours: [{ price: '99.00', size: '5 oz' }] })], unsorted: [] });
gpin('readDeskFile keeps the string it was given (which is why the draft must not)', !!badFile && badFile.items.length === 1 && badFile.items[0].bottle === '95' && badFile.items[0].pours[0].price === '99.00');
if (badFile) {
  const fromFile = W.wineRowFromDesk(badFile.items[0], CORPUS);
  gpin('after the validator the draft is still blank where the page is silent: ' + JSON.stringify([fromFile.bottle, fromFile.glass]), fromFile.bottle === '' && fromFile.glass === '');
  const rec = C.cellarSanitize(Object.assign({ id: 'w-test0002', ts: 1 }, fromFile));
  gpin('cellarSanitize files the blank and none of the scaffolding: ' + JSON.stringify(rec), rec.bottle === '' && rec.glass === '' && !('priceBlanked' in rec));
}

/* And the honest path is untouched: the fixture's eight bins still carry their printed bottle. */
gpin('the fixture rows are unchanged by the guard', desk.every((r) => r.bottle === r.raw.split('\n').pop().trim() && !r.priceBlanked));
if (gbad.length) fail.push(['a figure the page did not print', gbad]);
else say.push('a figure the page did not print is blanked and named, never filed: a bottle, a pour price, a pour size, "4 oz" inside "3/4 oz", "45" inside "145", an unsure row\'s price, and a desk file that carried one');

/* ---- 9. her read lands in the World Table's shape ----------------------- */
const abad = [];
const apin = (what, ok) => { if (!ok) abad.push(what); };
const TEXT = 'WINE BY GLASS\nPloyez-Jacquemart\n45.00 5 oz\n22.50 2.5 oz\n2010\n\nSTARTERS\nSoup of the day\n9\n\nCOCKTAILS\nHoly Trinity\n15\ngin | benedictine | lime\n';
const LONG = 'A name that runs on well past sixty characters to test the long name rule';
const flat = {
  desk: {
    dishes: [
      { section: 'STARTERS', name: 'Soup of the day', description: '', price: '9', ingredientsNamed: [' '], marks: ['V'], confidence: 'high', raw: 'Soup of the day\n9' },
      { section: 'STARTERS', name: 'Something', description: 'she was unsure of', price: '12', ingredientsNamed: [], marks: [], confidence: 'low', raw: 'Something\n12' }
    ],
    wines: [
      { producer: '', name: 'Ployez-Jacquemart', vintage: '2010', region: '', grapes: [], style: '', glass: '', bottle: '', pours: ['45.00 5 oz', '22.50 2.5 oz'], section: 'WINE BY GLASS', raw: 'Ployez-Jacquemart\n45.00 5 oz\n22.50 2.5 oz\n2010' },
      { producer: 'Krug', name: LONG, vintage: 'NV', region: '', grapes: [''], style: '', glass: '45', bottle: '260', pours: ['5 oz 45'], section: 'CHAMPAGNE', raw: 'Krug ' + LONG + ' 45 / 260' },
      { producer: 'Pol Roger', name: 'Brut Reserve', vintage: 'NV', region: '', grapes: [], style: '', glass: '', bottle: '', pours: [], section: 'CHAMPAGNE', raw: 'Pol Roger Brut Reserve NV' }
    ],
    cocktails: [
      { name: 'Holy Trinity', spec: ['gin', 'benedictine', 'lime', ' '], price: '15', section: 'COCKTAILS', method: 'stirred', glass: 'coupe', garnish: '', raw: 'Holy Trinity\n15\ngin | benedictine | lime' }
    ],
    unsure: [{ raw: 'Kiss the Crab', reason: 'could be a dish or a cocktail' }, { raw: '   ', reason: 'blank' }]
  },
  flags: [{ kind: 'cocktail', index: 0 }],
  provenance: { model: 'claude-haiku-4-5', priceCheck: 'verified' }
};
const her = C.v24DeskFromMaitre(flat, TEXT);
apin('readDeskFile accepted her read', !!her);
if (her) {
  const names = her.items.map((i) => i.name);
  apin('rows come back in page order, unplaced ones after in her order: ' + JSON.stringify(names),
    JSON.stringify(names) === JSON.stringify(['Ployez-Jacquemart', 'Soup of the day', 'Holy Trinity', 'Something', LONG, 'Brut Reserve']));
  const ploy = her.items[0], soup = her.items[1], holy = her.items[2], some = her.items[3], krug = her.items[4], pol = her.items[5];
  apin('a pour written price-first keeps both halves: ' + JSON.stringify(ploy.pours), ploy.kind === 'wine' && ploy.pours.length === 2 && ploy.pours[0].price === '45.00' && ploy.pours[0].size === '5 oz' && ploy.pours[1].price === '22.50' && ploy.pours[1].size === '2.5 oz');
  apin('the price line is her figures in parts, each with its word: ' + JSON.stringify(ploy.price), ploy.price.printed === '45.00 / 22.50' && ploy.price.parts.length === 2 && ploy.price.parts[0].label === '5 oz' && ploy.price.parts[1].amount === '22.50');
  apin('a priced wine with a short name is high, and says the line was assembled and the producer unread: ' + JSON.stringify(ploy.why), ploy.confidence === 'high' && ploy.why.some((w) => /assembled/.test(w)) && ploy.why.some((w) => /No producer/.test(w)) && ploy.why[0] === 'Read by the Maître d’ on claude-haiku-4-5.');
  apin('lines are where the row sits in the source: ' + JSON.stringify(ploy.lines), ploy.lines[0] === 1 && ploy.lines[1] === 4);
  /* adopt keys its dedupe on amount AND label, so a glass figure that is
     also a pour keeps both words as parts, and the printed line collapses
     the figure once; this pins the same. */
  apin('a glass price that is also the first pour is one figure on the line and keeps both words as parts: ' + JSON.stringify(krug.price), krug.price.parts.length === 3 && krug.price.printed === '45 / 260' && krug.price.parts[0].label === 'Glass' && krug.price.parts[1].label === '5 oz' && krug.price.parts[2].label === 'Bottle');
  apin('a name past sixty characters is low with the reason', krug.confidence === 'low' && krug.why.some((w) => /long name/.test(w)));
  apin('an empty grape is dropped', krug.grapes.length === 0);
  apin('a priceless wine is low with the reason', pol.confidence === 'low' && pol.why.some((w) => /No price printed/.test(w)));
  apin('a dish price goes through the port\'s priceParts: ' + JSON.stringify(soup.price), soup.price.printed === '9' && soup.price.parts.length === 1 && soup.price.parts[0].amount === '9');
  apin('marks are lower-cased and a blank ingredient dropped', soup.marks[0] === 'v' && soup.ingredientsNamed.length === 0 && soup.confidence === 'high');
  apin('a dish she marked low stays low, and says so', some.confidence === 'low' && some.why.some((w) => /Marked low/.test(w)));
  apin('a client-flagged row is blank and low with the shared sentence: ' + JSON.stringify([holy.price, holy.why]), holy.price.printed === '' && holy.price.parts.length === 0 && holy.confidence === 'low' && holy.why.indexOf(C.V24_NO_PRICE_WHY) >= 0);
  apin('method and glass travel as labelled prose, a blank spec part dropped', holy.description === 'Method: stirred. Glass: coupe.' && holy.spec.length === 3 && holy.baseSpirit === '');
  apin('the blank unsure line is dropped and the other keeps its reason and line: ' + JSON.stringify(her.unsorted), her.unsorted.length === 1 && her.unsorted[0].reason === 'could be a dish or a cocktail');
  apin('the source is an agent read in this room with the port\'s hash', her.source.kind === 'agent' && her.source.readIn === 'codex' && her.source.reader === 'maitre/claude-haiku-4-5' && her.source.hash === W.hashText(TEXT));
  apin('a verified read carries no notice', !her.notice);
  /* Her Ployez row through the wine half: the figures are on the page, so nothing is blanked. */
  const prow2 = C.v24Row(ploy, CORPUS);
  apin('her row through wineRowFromDesk keeps its pours and note: ' + JSON.stringify([prow2.draft.glass, prow2.draft.note]), prow2.draft.glass === '45.00' && prow2.draft.note === 'Pours: 5 oz 45.00, 2.5 oz 22.50' && !prow2.draft.priceBlanked);
  apin('and shows no price flag', C.v24Flags(prow2, her).indexOf('No price on this line') < 0);
}
const unchecked = C.v24DeskFromMaitre({ desk: { dishes: [], wines: [], cocktails: [], unsure: [] }, flags: [], provenance: { model: 'claude-haiku-4-5', priceCheck: 'unverified', sourceHash: 'abcd1234' } }, '');
apin('an unchecked read carries the notice and the client\'s fingerprint', !!unchecked && unchecked.notice === C.V24_UNVERIFIED && unchecked.source.hash === 'abcd1234');
apin('v24Pour: "5 oz 45.00"', JSON.stringify(C.v24Pour('5 oz 45.00')) === JSON.stringify({ price: '45.00', size: '5 oz' }));
apin('v24Pour: "45.00 5 oz"', JSON.stringify(C.v24Pour('45.00 5 oz')) === JSON.stringify({ price: '45.00', size: '5 oz' }));
apin('v24Pour: "125ml 8" keeps the ml size', JSON.stringify(C.v24Pour('125ml 8')) === JSON.stringify({ price: '8', size: '125ml' }));
apin('v24Pour: no measure keeps the whole text as the price', JSON.stringify(C.v24Pour('45.00')) === JSON.stringify({ price: '45.00', size: '' }));
apin('v24Pour: nothing is null', C.v24Pour('  ') === null);
if (abad.length) fail.push(['her read in the World Table\'s shape', abad]);
else say.push('her read lands in the World Table\'s shape: pours split on the measure word either way round, the price line in parts, low for no price, a long name or a client flag, her low kept, page order, the notice on an unchecked read');

/* ---- 10. "Done for now" strands nothing ---------------------------------- */
const fbad = [];
const fpin = (what, ok) => { if (!ok) fbad.push(what); };
const share = W.readMenu('RED\nKrug Grande Cuvee NV 260\nPol Roger Brut Reserve NV 110\n', W.deskSource('paste', 'table', 'Krug Pol'));
fpin('the share fixture reads two wines: ' + share.items.map((i) => i.kind).join(','), share.items.length === 2 && share.items.every((i) => i.kind === 'wine'));
const wrote = C.deskInbox.write(share);
fpin('the inbox took the share: ' + JSON.stringify(wrote && wrote.said), !!(wrote && wrote.ok));
const waiting = () => { const f = C.deskInbox.read(); return f ? C.deskInbox.share(f, 'wine').length : 0; };
fpin('two wines wait before the run', waiting() === 2);
const rowsOf = (statuses) => share.items.map((it, i) => Object.assign(C.v24Row(it, []), { status: statuses[i] }));
sandbox.S._desk = { from: 'inbox', file: C.deskInbox.read(), rows: rowsOf(['added', '']), look: null, handed: false };
sandbox.S.view = 'menudesk';
C.v24Finish();
fpin('with a row undecided the share is NOT stamped taken: ' + waiting() + ' waiting', waiting() === 2);
fpin('the report says the rest waits: ' + JSON.stringify(sandbox.S._wimpReport), !!sandbox.S._wimpReport && sandbox.S._wimpReport.added === 1 && sandbox.S._wimpReport.skipped.some((s) => /still waiting at the desk/.test(s)));
fpin('the desk is closed and the list shown', sandbox.S._desk === null && sandbox.S.view === 'cellar');
sandbox.S._desk = { from: 'inbox', file: C.deskInbox.read(), rows: rowsOf(['added', 'left']), look: null, handed: false };
C.v24Finish();
fpin('with every row decided the share is stamped taken and, being the only kind, the slot is gone', waiting() === 0 && C.deskInbox.read() === null);
fpin('the report names the one left out: ' + JSON.stringify(sandbox.S._wimpReport), !!sandbox.S._wimpReport && sandbox.S._wimpReport.skipped.some((s) => /Pol Roger.*was left out/.test(s)) && !sandbox.S._wimpReport.skipped.some((s) => /waiting/.test(s)));
/* A paste is never in the inbox, so nothing is stamped either way, and the report says where the rest is. */
C.deskInbox.write(share);
sandbox.S._desk = { from: 'paste', file: share, rows: rowsOf(['', '']), look: null, handed: false };
C.v24Finish();
fpin('a paste that was not handed on touches no share', waiting() === 2);
fpin('and its report says the list is still in the box: ' + JSON.stringify(sandbox.S._wimpReport), !!sandbox.S._wimpReport && sandbox.S._wimpReport.skipped.some((s) => /still in the box/.test(s)));
C.deskInbox.clear();
if (fbad.length) fail.push(['"Done for now" and the share', fbad]);
else say.push('"Done for now" leaves an undecided share waiting and says so; a share with every row decided is stamped taken; a paste touches no share');

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
