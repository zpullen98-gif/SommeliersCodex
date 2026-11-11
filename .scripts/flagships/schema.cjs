#!/usr/bin/env node
/* schema: the one validator of the Flagships tab of the Wine Atlas (codex58): a group's fragment, its five records, and
   the plan.

     const S = require('./schema.cjs');
     const plan = S.loadPlan();                          // .scripts/flagships/plan.json
     const problems = S.validateFragment(frag, plan);    // [] when sound: the group's five records
     const one = S.validateRecord(rec, plan, group);     // one record
     const notes = S.adviseRecord(rec);                  // never a failure: what a second reader should look at
     const planned = S.planProblems(plan, facts);        // the plan, against the app when facts are given

   Every problem names its field first and then the rule ("records[2].story: 141 words, 150 to 230"). build-flagships
   refuses a record that fails here, and a gate reads the same rules, so each lives once. Nothing here writes a file.

   The voice is the Codex's own and is reused, never copied: the dash, glyph and American tests of build-cms.cjs
   (dashProblems, americanProblems), the retired word, the numbered level and the per cent and towards spellings of
   check-fragment.cjs (voiceProblems, proseProblems), the further American forms, the price, the degree sign and the
   living writers of the Grapes tab (.scripts/grapes/schema.cjs: AMERICAN_MORE is read from its source, PRICE, DEGREE,
   LIVING) and its generic refusal of a bare family word in the glass (genericInProse). The rules of this tab's own
   are named constants below: the caps (CAPS, the one statement of every limit), the judgement words (JUDGE), the
   score (SCORE), the volatile fact (VOLATILE: ownership is history and may be told with its year; a present owner, a
   size, a production, a current winemaker or a recent vintage may not), the living people of people.json, and the
   shape of every field.

   node .scripts/flagships/schema.cjs --caps prints the caps as the brief states them. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const CF = require(path.join(__dirname, '..', 'regions', 'check-fragment.cjs'));
const CMS = require(path.join(__dirname, '..', 'cms', 'build-cms.cjs'));
const GS = require(path.join(__dirname, '..', 'grapes', 'schema.cjs'));

const DIR = __dirname;
const ROOT = path.join(__dirname, '..', '..');
const JS_DIR = path.join(ROOT, 'js');

/* the plan's own words */
const CHUNKS = ['pilots', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12', 'f13', 'f14', 'f15', 'f16', 'f17'];
const GROUPS = 51;
const PICKS = 5;
const GROUP_FIELDS = ['key', 'title', 'region', 'country', 'chunk', 'swaps', 'picks'];
const PICK_FIELDS = ['key', 'producer', 'producerId', 'wine', 'why', 'note'];
const SWAP_FIELDS = ['from', 'to', 'why', 'agreed', 'date'];
/* the id prefix of a record, a card and a question: fl- and eight base36 digits (build-flagships proves no other mint) */
const ID_PREFIX = 'fl-';
const ID_RE = /^fl-[0-9a-z]{8}$/;
const KEY_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/* a record's fields, in the order the build ships them */
const FIELDS = ['key', 'group', 'region', 'producer', 'producerId', 'say', 'place', 'founded', 'wine', 'table', 'story', 'others', 'traps', 'cards', 'questions', 'sources'];
/* provenance: read by the checker and the integrator, never shipped */
const PROVENANCE = ['report', 'checked'];
/* copied from the plan exactly */
const COPIED = ['group', 'region', 'producer', 'producerId'];
const WINE_FIELDS = ['name', 'appellation', 'classification', 'colour', 'grapes', 'sites', 'making', 'glass', 'ageing', 'serve', 'label'];
const COLOURS = ['white', 'red', 'rosé', 'orange', 'sparkling', 'sparkling rosé', 'sweet white', 'sweet red', 'fortified'];
const QUESTION_FIELDS = ['q', 'opts', 'a', 'exp', 'tag'];
const QUESTION_TAGS = ['wine', 'story'];
const SOURCE_FIELDS = ['title', 'url', 'kind', 'read'];
const SOURCE_KINDS = ['primary', 'secondary'];
const SOURCE_READS = ['page', 'search', 'book'];
const CHECKED_FIELDS = ['date', 'by', 'verdict', 'changed', 'open'];
const VERDICTS = ['sound', 'changed'];

/* Every limit, in words unless named otherwise. A pair is [least, most]. */
const CAPS = {
  say: [0, 10],
  place: [2, 14],
  wine: {
    name: [1, 10], appellation: [1, 10], classification: [0, 16], grapes: [2, 30], sites: [3, 50],
    making: [20, 80], glass: [20, 60], ageing: [10, 45], serve: [10, 40]
  },
  label: { n: [2, 4], term: [1, 6], means: [4, 24] },
  table: [30, 50],
  tableSentences: [1, 2],
  story: [150, 230],
  storyYears: 2, /* a story names at least two dated turning points */
  others: { n: [1, 3], name: [1, 10], note: [4, 30] },
  traps: { n: [1, 3], line: [8, 40] },
  cards: { n: 2, front: [5, 20], back: [2, 40] },
  questions: { n: 2, stem: [8, 55], option: [1, 14], exp: [8, 45] },
  sources: { n: [2, 5], title: [2, 20], web: 1 },
  report: 8,
  entry: 680 /* the reading words a record shows: the wine's fields, the label's meanings, table, story, others' notes and traps */
};

/* small readers */
function isStr(v) { return typeof v === 'string'; }
function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
function isList(v) { return Array.isArray(v); }
function words(s) { return CF.words(s); }
function fold(s) { return CF.fold(s); }
function hasPhrase(text, term) { const t = fold(term); return !!t && (' ' + fold(text) + ' ').indexOf(' ' + t + ' ') >= 0; }
function sentenceList(s) { return GS.sentenceList(s); }
function loadPlan(file) { return JSON.parse(fs.readFileSync(file || path.join(DIR, 'plan.json'), 'utf8')); }
function groupOf(plan, key) { return (plan && isList(plan.groups) ? plan.groups : []).find((g) => g && g.key === key) || null; }
function pickOf(plan, key) {
  let hit = null;
  (plan && isList(plan.groups) ? plan.groups : []).forEach((g) => (isList(g.picks) ? g.picks : []).forEach((p, i) => { if (p && p.key === key) hit = { group: g, pick: p, index: i }; }));
  return hit;
}
/* the plan's picks in order, each with its group and its place in the roster (0 to 254) */
function roster(plan) {
  const out = [];
  (plan && isList(plan.groups) ? plan.groups : []).forEach((g) => (isList(g.picks) ? g.picks : []).forEach((p) => out.push({ group: g, pick: p, index: out.length })));
  return out;
}
/* the words of a name that a sentence must carry to name it: the estate words and the particles left out */
const ESTATE_WORDS = ['chateau', 'domaine', 'domaines', 'maison', 'bodega', 'bodegas', 'weingut', 'tenuta', 'cantina', 'azienda', 'quinta', 'fattoria', 'podere', 'castello', 'marchesi', 'vina', 'vinedo', 'vinedos', 'schloss', 'kloster', 'estate', 'wines', 'winery', 'vineyard', 'vineyards', 'cellars', 'cellar', 'family', 'familia', 'famille', 'vintners', 'company', 'the', 'and', 'des', 'del', 'della', 'de', 'du', 'la', 'le', 'les', 'di', 'do', 'da', 'dos', 'von', 'van', 'et', 'fils', 'pere', 'erben', 'dr', 'wwe', 'h', 'sa', 'cie', 'co', 'e'];
function nameWords(name) { return fold(name).split(' ').filter((w) => w.length >= 3 && ESTATE_WORDS.indexOf(w) < 0); }
function names(text, name) { const ws = nameWords(name); if (!ws.length) return hasPhrase(text, name); const t = ' ' + fold(text) + ' '; return ws.some((w) => t.indexOf(' ' + w + ' ') >= 0); }

/* what the Codex holds: the regions, the countries and the producers' ids */
const FACTS = {};
function runData(jsDir, file, expose) {
  const p = path.join(jsDir, file);
  if (!fs.existsSync(p)) return null;
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(p, 'utf8') + '\n;this.__out = ' + expose + ';', ctx, { filename: file });
  return ctx.__out;
}
function facts(jsDir) {
  const dir = path.resolve(jsDir || JS_DIR);
  if (FACTS[dir]) return FACTS[dir];
  const f = { dir, regions: {}, countries: {}, producers: {} };
  try {
    const R = runData(dir, 'data-regions.js', '({ regions: REGIONS.regions.map(function (r) { return { slug: r.slug, name: r.name, sheet: r.sheet }; }), countries: Object.keys(REGIONS.countries).map(function (k) { return { key: k, name: REGIONS.countries[k].name }; }) })');
    if (R) { R.regions.forEach((r) => { f.regions[r.slug] = r; }); R.countries.forEach((c) => { f.countries[c.key] = c; }); }
  } catch (e) { /* no regions data in this tree: the plan cannot be proved against it */ }
  try {
    const P = runData(dir, 'data-producers.js', '(typeof WINE_PRODUCERS !== "undefined" ? WINE_PRODUCERS : []).map(function (p) { return { id: p.id, p: p.p, r: p.r, founded: p.founded }; })') || [];
    P.forEach((p) => { f.producers[p.id] = p; });
  } catch (e) { f.producers = {}; }
  FACTS[dir] = f;
  return f;
}

/* the people never named */
let PEOPLE = null;
function people() {
  if (PEOPLE) return PEOPLE;
  const file = path.join(DIR, 'people.json');
  const out = { names: [], problems: [] };
  let j = null;
  try { j = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { out.problems.push('people.json: ' + e.message); }
  if (j && isList(j.names)) {
    const seen = {};
    j.names.forEach((n, i) => {
      if (!isStr(n) || !fold(n)) { out.problems.push('people.json names[' + i + ']: a name'); return; }
      if (seen[fold(n)]) out.problems.push('people.json names[' + i + ']: ' + n + ' twice');
      seen[fold(n)] = 1;
      out.names.push(n);
    });
  } else if (j) out.problems.push('people.json: { about, names: [...] }');
  PEOPLE = out;
  return out;
}
/* the living named in a string: the record's own producer name, written whole, is a house and is taken out first */
function livingIn(s, producer) {
  let t = String(s || '');
  if (producer) t = t.split(producer).join(' ');
  const f = ' ' + fold(t) + ' ';
  const hits = [];
  people().names.forEach((n) => {
    if (producer && fold(n) === fold(producer)) return;
    if (f.indexOf(' ' + fold(n) + ' ') >= 0) hits.push(n);
  });
  const m = t.match(GS.LIVING);
  if (m) hits.push(m[0]);
  return hits;
}

/* the voice: rules of this tab's own */
/* judgement, never allowed: famous may describe, never rank; "top" stands only as the top of something */
const JUDGE = /\b(?:best|finest|greatest|most\s+famous|iconic|legendary|world[- ]class|top(?!\s+of\b|soil)|noblest|grandest|most\s+(?:celebrated|prized|revered|renowned|sought|popular|important|prestigious|noble|loved|beloved|admired|coveted|expensive|collectable|collectible|desirable|acclaimed)|world\s+famous|world\s+renowned|renowned|unrivall?ed|unparalleled|peerless|ultimate|quintessential|king\s+of|queen\s+of|holy\s+grail|cult|sought[- ]after|award[- ]winning|unbeatable|unsurpassed|second\s+to\s+none|benchmark|superb|outstanding|masterpiece|pinnacle|unique|incomparable|stunning|exquisite|magnificent|sublime)\b/i;
/* a score: points, a mark out of a hundred, a rating */
const SCORE = /\b\d{2,3}\s*(?:points?|pts)\b|\/\s?100\b|\b(?:100|hundred)[- ]point|\bperfect\s+(?:score|marks?)\b|\bscor(?:e|es|ed|ing)\b|\bratings?\b|\brated\b/i;
/* a volatile fact: a size, a production, a present owner or a present role. Ownership told with its year is history. */
const VOLATILE = /\b(?:hectares?|acres?|acreage|allocat\w*|now\s+owns?|now\s+owned|currently|current(?:ly)?\s+(?:owners?|winemakers?|cellar\s+masters?|chefs?\s+de\s+cave|proprietors?|directors?|managers?)|today\s+owned|owned\s+today|is\s+owned\s+by|are\s+owned\s+by|belongs\s+to|sold\s+out|in\s+stock|market\s+share|best[- ]selling|top[- ]selling|cases\s+(?:a|per|each)\s+year|bottles\s+(?:a|per|each)\s+year|annual\s+production|production\s+of\s+(?:about|around|some|roughly)|produces\s+(?:about|around|some|roughly)|per\s+annum|latest\s+vintage|current\s+vintage|recent\s+vintages?)\b/i;
const PER_CENT_SIGN = /%/;
const NUMBERED_LEVEL = /\bLevel\s+(?:I|II|III|IV|[1-4]|one|two|three|four)\b/i;
const HYPHEN_RANGE = /(?<![\d-])\d+\s?-\s?\d+(?![\d-])/;
const SPACED_HYPHEN = /\s-\s/;
const HOUSE_NAME = /Brennan/i;
/* American forms the Grapes tab refuses beyond check-fragment's list, read from that schema's own source */
const AMERICAN_MORE = (function () {
  const src = fs.readFileSync(path.join(__dirname, '..', 'grapes', 'schema.cjs'), 'utf8');
  const m = src.match(/const AMERICAN_MORE = (\/.*\/[a-z]*);/);
  return m ? vm.runInNewContext(m[1]) : /(?!)/;
})();
/* the fields whose prose describes the glass, where a bare family word is refused */
function tastePath(where) { return /(?:^|\.)wine\.glass$|(?:^|\.)table$|\.cards\[\d+\]\.(?:front|back)$|\.questions\[\d+\]\.(?:q|exp|opts\[\d+\])$|\.others\[\d+\]\.note$/.test(where); }
function pathKind(where) {
  if (/\.sources\[\d+\]\.url$/.test(where)) return 'url';
  if (/\.sources\[\d+\]\.title$/.test(where)) return 'title';
  if (/\.(?:report\[\d+\]|checked(?:\.|$))/.test(where)) return 'provenance';
  if (/\.(?:key|group|region|producerId|say|founded|wine\.colour|questions\[\d+\]\.tag|sources\[\d+\]\.(?:kind|read))$/.test(where)) return 'key';
  return 'prose';
}
function tidyProblems(s, where) {
  const out = [];
  if (s !== s.trim()) out.push(where + ': a space at an end');
  if (/\s{2,}|[\t\n\r]/.test(s)) out.push(where + ': two spaces together, a tab or a line break');
  return out;
}
/* every string of a record, by its path from the fragment: records[i].field */
function voiceProblems(rec, at) {
  const out = [];
  const producer = isObj(rec) && isStr(rec.producer) ? rec.producer : '';
  CF.walkStrings(rec, at, (s, where) => {
    const kind = pathKind(where);
    if (kind === 'url') {
      if (s) CF.urlProblems(s, where).forEach((p) => out.push(p));
      const lv = livingIn(s.replace(/[-_/.]+/g, ' '), producer);
      if (lv.length) out.push(where + ': the address names a living person (' + lv[0] + ')');
      return;
    }
    CMS.dashProblems(s, where).forEach((p) => out.push(p));
    if (SPACED_HYPHEN.test(s)) out.push(where + ': a hyphen standing alone between spaces (a dash by another name: use a comma, a colon or a full stop)');
    if (GS.DEGREE.test(s)) out.push(where + ': a degree sign (write the word degrees)');
    tidyProblems(s, where).forEach((p) => out.push(p));
    if (kind === 'provenance') return;
    const lv = livingIn(s, producer);
    if (lv.length) out.push(where + ': names a living person (' + lv.join(', ') + '): say the family, the founder\'s heir, the cellar master');
    if (HOUSE_NAME.test(s)) out.push(where + ': names the house where the owner works (a record never does)');
    if (kind === 'key') return;
    CF.voiceProblems(s, where).filter((p) => /retired word|numbered level/.test(p)).forEach((p) => out.push(p));
    if (kind === 'title') return;
    if (NUMBERED_LEVEL.test(s)) out.push(where + ': a numbered level (levels are named, never numbered)');
    CMS.americanProblems(s, where).forEach((p) => out.push(p));
    CF.proseProblems(s, where).forEach((p) => out.push(p));
    const am = s.match(AMERICAN_MORE);
    if (am) out.push(where + ': American spelling "' + am[0] + '"');
    const j = s.match(JUDGE);
    if (j) out.push(where + ': "' + j[0].toLowerCase() + '" judges or ranks (famous may describe, never rank: say what the wine is and why it matters)');
    if (PER_CENT_SIGN.test(s)) out.push(where + ': a per cent sign (write per cent)');
    const pr = s.match(GS.PRICE);
    if (pr) out.push(where + ': "' + pr[0] + '" talks price (no price anywhere)');
    const sc = s.match(SCORE);
    if (sc) out.push(where + ': "' + sc[0] + '" is a score or a rating (none anywhere)');
    const vo = s.match(VOLATILE);
    if (vo) out.push(where + ': "' + vo[0] + '" is volatile (no size, production, present owner, present role or recent vintage; ownership told with its year is history)');
    if (HYPHEN_RANGE.test(s)) out.push(where + ': a range with a hyphen (write "1855 to 1973", "16 to 18")');
    if (tastePath(where)) GS.genericInProse(s).forEach((g) => out.push(where + ': the family word "' + g + '" stands alone: name the thing (blackcurrant, pencil shavings, toasted brioche, white peach)'));
  });
  return out;
}

/* the pieces of a record */
function capped(out, where, v, lo, hi, empty) {
  if (!isStr(v)) { out.push(where + ': a string'); return false; }
  if (!v.trim()) { if (!empty && lo > 0) out.push(where + ': a string' + (lo ? ' of ' + lo + ' words or more' : '')); return false; }
  const n = words(v);
  if (n < lo || n > hi) out.push(where + ': ' + n + ' words, ' + (lo > 0 ? lo + ' to ' + hi : 'at most ' + hi));
  return true;
}
function unknown(out, rec, allowed, where, what) {
  Object.keys(rec).filter((k) => allowed.indexOf(k) < 0).forEach((k) => out.push(where + '.' + k + ': no field of ' + what + ' (' + allowed.join(', ') + ')'));
}
function counted(out, where, list, lo, hi, what) {
  if (!isList(list)) { out.push(where + ': a list of ' + what); return false; }
  if (list.length < lo || list.length > hi) out.push(where + ': ' + (lo === hi ? 'exactly ' + lo : lo + ' to ' + hi) + ' ' + what + ' (' + list.length + ')');
  return true;
}
function endsStop(out, where, s) { if (isStr(s) && s.trim() && !/[.!?]["'’”)]?$/.test(s.trim())) out.push(where + ': ends on a full stop'); }

function sayProblems(rec, at) {
  const out = [];
  const s = rec.say;
  if (!isStr(s)) return [at + '.say: a respelling, or "" where a guest would not stumble'];
  if (!s) return out;
  if (words(s) > CAPS.say[1]) out.push(at + '.say: ' + words(s) + ' words, at most ' + CAPS.say[1]);
  if (!/^[A-Za-z][A-Za-z ,'-]*$/.test(s)) out.push(at + '.say: letters, hyphens, commas and spaces only (no marks, no brackets, no stop)');
  const one = /^[A-Z]{2,}$/.test(s); /* a name of one syllable is written whole in capitals: KROOG */
  if (!one && (!/[A-Z]{2,}/.test(s) || s.indexOf('-') < 0)) out.push(at + '.say: syllables joined by hyphens, the stressed one in capitals (mo-ET eh shahn-DOHN), or one syllable in capitals (KROOG)');
  return out;
}

function wineProblems(rec, at, pick) {
  const out = [];
  const W = rec.wine;
  const w = at + '.wine';
  if (!isObj(W)) return [w + ': { ' + WINE_FIELDS.join(', ') + ' }'];
  WINE_FIELDS.filter((k) => !(k in W)).forEach((k) => out.push(w + '.' + k + ': missing'));
  unknown(out, W, WINE_FIELDS, w, 'the wine');
  ['name', 'appellation', 'classification', 'grapes', 'sites', 'making', 'glass', 'ageing', 'serve'].forEach((k) => {
    if (k in W) capped(out, w + '.' + k, W[k], CAPS.wine[k][0], CAPS.wine[k][1], k === 'classification');
  });
  if (pick && isStr(W.name) && !hasPhrase(W.name, pick.wine)) out.push(w + '.name: holds the plan\'s words for the flagship, "' + pick.wine + '" (the label may add the Prädikat or the style; a different wine is a swap in plan.json)');
  if ('colour' in W && COLOURS.indexOf(W.colour) < 0) out.push(w + '.colour: one of ' + COLOURS.join(', '));
  ['making', 'glass', 'ageing', 'serve', 'sites'].forEach((k) => endsStop(out, w + '.' + k, W[k]));
  if (isStr(W.glass) && /\d/.test(W.glass)) out.push(w + '.glass: in words, no figure');
  if (isStr(W.serve)) {
    if (!/\b\d{1,2}(?:\s+to\s+\d{1,2})?\s+degrees\s+Celsius\b/.test(W.serve)) out.push(w + '.serve: the temperature in figures and degrees Celsius ("16 to 18 degrees Celsius")');
    if (/Fahrenheit/i.test(W.serve)) out.push(w + '.serve: degrees Celsius alone');
    if (!/\bdecant|\bcarafe/i.test(W.serve)) out.push(w + '.serve: says whether to decant');
    if (!/\b(?:glass|glasses|tulip|flute|bowl|copita)\b/i.test(W.serve)) out.push(w + '.serve: names the glass');
  }
  if ('label' in W && counted(out, w + '.label', W.label, CAPS.label.n[0], CAPS.label.n[1], 'terms')) {
    const seen = {};
    W.label.forEach((x, i) => {
      const l = w + '.label[' + i + ']';
      if (!isObj(x)) { out.push(l + ': { term, means }'); return; }
      unknown(out, x, ['term', 'means'], l, 'a label term');
      capped(out, l + '.term', x.term, CAPS.label.term[0], CAPS.label.term[1]);
      capped(out, l + '.means', x.means, CAPS.label.means[0], CAPS.label.means[1]);
      if (isStr(x.term)) { if (seen[fold(x.term)]) out.push(l + '.term: given twice'); seen[fold(x.term)] = 1; }
    });
  }
  return out;
}

function othersProblems(rec, at) {
  const out = [];
  if (!counted(out, at + '.others', rec.others, CAPS.others.n[0], CAPS.others.n[1], 'other wines')) return out;
  const seen = {};
  rec.others.forEach((x, i) => {
    const w = at + '.others[' + i + ']';
    if (!isObj(x)) { out.push(w + ': { name, note }'); return; }
    unknown(out, x, ['name', 'note'], w, 'another wine');
    capped(out, w + '.name', x.name, CAPS.others.name[0], CAPS.others.name[1]);
    capped(out, w + '.note', x.note, CAPS.others.note[0], CAPS.others.note[1]);
    if (isStr(x.name)) {
      if (seen[fold(x.name)]) out.push(w + '.name: given twice'); seen[fold(x.name)] = 1;
      if (isObj(rec.wine) && isStr(rec.wine.name) && fold(x.name) === fold(rec.wine.name)) out.push(w + '.name: the flagship itself');
    }
  });
  return out;
}

function trapsProblems(rec, at) {
  const out = [];
  if (!counted(out, at + '.traps', rec.traps, CAPS.traps.n[0], CAPS.traps.n[1], 'traps')) return out;
  rec.traps.forEach((t, i) => { capped(out, at + '.traps[' + i + ']', t, CAPS.traps.line[0], CAPS.traps.line[1]); endsStop(out, at + '.traps[' + i + ']', t); });
  return out;
}

function cardsProblems(rec, at) {
  const out = [];
  if (!counted(out, at + '.cards', rec.cards, CAPS.cards.n, CAPS.cards.n, 'cards')) return out;
  const seen = {};
  rec.cards.forEach((c, i) => {
    const w = at + '.cards[' + i + ']';
    if (!isObj(c)) { out.push(w + ': { front, back }'); return; }
    if ('id' in c) out.push(w + '.id: only the build mints ids');
    unknown(out, c, ['front', 'back'], w, 'a card');
    capped(out, w + '.front', c.front, CAPS.cards.front[0], CAPS.cards.front[1]);
    capped(out, w + '.back', c.back, CAPS.cards.back[0], CAPS.cards.back[1]);
    if (isStr(c.front)) { const k = fold(c.front); if (seen[k]) out.push(w + '.front: the same cue twice'); seen[k] = 1; }
    if (isStr(c.front) && isStr(c.back) && fold(c.back) && (' ' + fold(c.front) + ' ').indexOf(' ' + fold(c.back) + ' ') >= 0) out.push(w + ': the front gives the back away');
    if (isStr(c.front) && isStr(c.back) && isStr(rec.producer) && !names(c.front + ' ' + c.back, rec.producer) && !(isObj(rec.wine) && isStr(rec.wine.name) && names(c.front + ' ' + c.back, rec.wine.name))) out.push(w + ': names the house or its wine on one face (a card is dealt in a mixed deck)');
  });
  return out;
}

function questionsProblems(rec, at) {
  const out = [];
  if (!counted(out, at + '.questions', rec.questions, CAPS.questions.n, CAPS.questions.n, 'questions')) return out;
  const stems = {};
  const tags = {};
  rec.questions.forEach((q, i) => {
    const w = at + '.questions[' + i + ']';
    if (!isObj(q)) { out.push(w + ': { q, opts, a, exp, tag }'); return; }
    if ('id' in q) out.push(w + '.id: only the build mints ids');
    unknown(out, q, QUESTION_FIELDS, w, 'a question');
    CMS.questionProblems({ q: q.q, opts: q.opts, a: q.a, exp: q.exp }, w, { grapes: [], topics: [] }).forEach((p) => out.push(p));
    if (isStr(q.q)) {
      const n = words(q.q);
      if (n < CAPS.questions.stem[0] || n > CAPS.questions.stem[1]) out.push(w + '.q: ' + n + ' words, ' + CAPS.questions.stem[0] + ' to ' + CAPS.questions.stem[1]);
      if (!/\?$/.test(q.q.trim())) out.push(w + '.q: a question, ending on a question mark');
      const k = fold(q.q); if (stems[k]) out.push(w + '.q: the same stem twice'); stems[k] = 1;
    }
    if (isList(q.opts)) q.opts.forEach((o, j) => { if (isStr(o) && words(o) > CAPS.questions.option[1]) out.push(w + '.opts[' + j + ']: ' + words(o) + ' words, at most ' + CAPS.questions.option[1]); });
    if (isStr(q.exp) && words(q.exp) > CAPS.questions.exp[1]) out.push(w + '.exp: ' + words(q.exp) + ' words, at most ' + CAPS.questions.exp[1]);
    if (QUESTION_TAGS.indexOf(q.tag) < 0) out.push(w + '.tag: wine (its grapes, classification, sites or making) or story (its history)');
    else tags[q.tag] = (tags[q.tag] || 0) + 1;
  });
  if (tags.wine !== 1 || tags.story !== 1) out.push(at + '.questions: one tagged wine and one tagged story');
  const fronts = (isList(rec.cards) ? rec.cards : []).map((c) => (c && isStr(c.front)) ? fold(c.front) : '');
  rec.questions.forEach((q, i) => { if (q && isStr(q.q) && fronts.indexOf(fold(q.q)) >= 0) out.push(at + '.questions[' + i + '].q: the same words as a card\'s front'); });
  return out;
}

function sourcesProblems(rec, at) {
  const out = [];
  if (!counted(out, at + '.sources', rec.sources, CAPS.sources.n[0], CAPS.sources.n[1], 'sources')) return out;
  const urls = {}; const titles = {};
  let web = 0;
  rec.sources.forEach((s, i) => {
    const w = at + '.sources[' + i + ']';
    if (!isObj(s)) { out.push(w + ': { title, url, kind, read }'); return; }
    unknown(out, s, SOURCE_FIELDS, w, 'a source');
    SOURCE_FIELDS.filter((k) => !(k in s)).forEach((k) => out.push(w + '.' + k + ': missing'));
    capped(out, w + '.title', s.title, CAPS.sources.title[0], CAPS.sources.title[1]);
    if (isStr(s.title) && (/\bby\s+[A-Z][a-z]+\s+[A-Z]/.test(s.title) || /\b(?:ed\.|edited by|author)\b/i.test(s.title))) out.push(w + '.title: a work is cited by its publisher and title alone, never its author or editor');
    if (isStr(s.title)) { const t = fold(s.title); if (titles[t]) out.push(w + '.title: the same source twice'); titles[t] = 1; }
    if (!isStr(s.url)) out.push(w + '.url: an https address, or "" for a reference work cited by its title');
    else if (s.url) { web++; if (urls[s.url]) out.push(w + '.url: the same address twice'); urls[s.url] = 1; }
    if ('kind' in s && SOURCE_KINDS.indexOf(s.kind) < 0) out.push(w + '.kind: primary (the appellation, its decree, a wine body, the producer\'s own history page for its own facts) or secondary');
    if ('read' in s && SOURCE_READS.indexOf(s.read) < 0) out.push(w + '.read: page (the page itself was read), search (a search summary drawn from that site) or book (a reference work, url "")');
    if (s.read === 'book' && isStr(s.url) && s.url) out.push(w + '.read: book is a reference work cited by its title, with url ""');
    if (s.read !== 'book' && isStr(s.url) && !s.url) out.push(w + '.url: "" only for a reference work (read: book)');
  });
  if (web < CAPS.sources.web) out.push(at + '.sources: at least ' + CAPS.sources.web + ' with an https address');
  return out;
}

function checkedProblems(rec, at) {
  const out = [];
  const c = rec.checked;
  if (c === undefined || c === null) return out;
  const w = at + '.checked';
  if (!isObj(c)) return [w + ': null, or the checker\'s { ' + CHECKED_FIELDS.join(', ') + ' }'];
  unknown(out, c, CHECKED_FIELDS, w, 'the check');
  CHECKED_FIELDS.filter((k) => !(k in c)).forEach((k) => out.push(w + '.' + k + ': missing'));
  if ('date' in c && (!isStr(c.date) || !/^\d{4}-\d{2}-\d{2}$/.test(c.date))) out.push(w + '.date: YYYY-MM-DD');
  if ('by' in c && c.by !== 'refuter') out.push(w + '.by: refuter');
  if ('verdict' in c && VERDICTS.indexOf(c.verdict) < 0) out.push(w + '.verdict: sound (nothing changed) or changed (what changed is listed)');
  ['changed', 'open'].forEach((k) => { if (k in c && (!isList(c[k]) || c[k].some((x) => !isStr(x) || !x.trim()))) out.push(w + '.' + k + ': a list of sentences ([] for none)'); });
  if (c.verdict === 'changed' && isList(c.changed) && !c.changed.length) out.push(w + '.changed: a changed verdict lists what changed');
  if (c.verdict === 'sound' && isList(c.changed) && c.changed.length) out.push(w + '.verdict: changed, since changes are listed');
  return out;
}

/* the reading words of a record: what its page shows above the cards and the questions */
function readingWords(rec) {
  let n = 0;
  if (!isObj(rec)) return 0;
  if (isObj(rec.wine)) {
    ['name', 'appellation', 'classification', 'grapes', 'sites', 'making', 'glass', 'ageing', 'serve'].forEach((k) => { if (isStr(rec.wine[k])) n += words(rec.wine[k]); });
    (isList(rec.wine.label) ? rec.wine.label : []).forEach((x) => { if (x) n += words(x.term) + words(x.means); });
  }
  ['place', 'table', 'story'].forEach((k) => { if (isStr(rec[k])) n += words(rec[k]); });
  (isList(rec.others) ? rec.others : []).forEach((x) => { if (x) n += words(x.name) + words(x.note); });
  (isList(rec.traps) ? rec.traps : []).forEach((x) => { if (isStr(x)) n += words(x); });
  return n;
}

/* one record */
function validateRecord(rec, plan, group, i, opts) {
  const o = opts || {};
  const at = 'records[' + (i == null ? 0 : i) + ']';
  const out = [];
  if (!isObj(rec)) return [at + ': one object'];
  const hit = isStr(rec.key) ? pickOf(plan, rec.key) : null;
  if (!hit) return [at + '.key: ' + JSON.stringify(rec.key) + ' is no pick of plan.json'];
  const g = hit.group; const pick = hit.pick;
  if (group && g.key !== group) out.push(at + '.key: ' + rec.key + ' is a pick of ' + g.key + ', not of ' + group);
  const f = o.facts || facts(o.jsDir);
  FIELDS.filter((k) => !(k in rec)).forEach((k) => out.push(at + '.' + k + ': missing'));
  unknown(out, rec, FIELDS.concat(PROVENANCE), at, 'a record');
  const want = { group: g.key, region: g.region, producer: pick.producer, producerId: pick.producerId };
  COPIED.forEach((k) => { if (k in rec && rec[k] !== want[k]) out.push(at + '.' + k + ': copied from plan.json exactly, ' + JSON.stringify(want[k])); });
  if ('say' in rec) sayProblems(rec, at).forEach((p) => out.push(p));
  if ('place' in rec) capped(out, at + '.place', rec.place, CAPS.place[0], CAPS.place[1]);
  if ('founded' in rec) {
    if (!isStr(rec.founded)) out.push(at + '.founded: a year as text, or "" where nobody is sure');
    else if (rec.founded && (!/^\d{3,4}$/.test(rec.founded) || +rec.founded > new Date().getFullYear())) out.push(at + '.founded: a year in figures ("1743"), or "" where nobody is sure (an empty field is a true answer)');
    else if (rec.founded && isStr(rec.producerId) && f.producers[rec.producerId] && /^\d{4}$/.test(String(f.producers[rec.producerId].founded || '')) && f.producers[rec.producerId].founded !== rec.founded) out.push(at + '.founded: the library (' + rec.producerId + ') says ' + f.producers[rec.producerId].founded + ': agree with it, or keep yours and say why in report');
  }
  if ('wine' in rec) wineProblems(rec, at, pick).forEach((p) => out.push(p));
  if ('table' in rec && capped(out, at + '.table', rec.table, CAPS.table[0], CAPS.table[1])) {
    const n = sentenceList(rec.table).length;
    if (n < CAPS.tableSentences[0] || n > CAPS.tableSentences[1]) out.push(at + '.table: one or two sentences, found ' + n);
    endsStop(out, at + '.table', rec.table);
    if (!names(rec.table, pick.producer)) out.push(at + '.table: names the house (' + nameWords(pick.producer).join(' or ') + ')');
    if (isObj(rec.wine) && isStr(rec.wine.name) && !names(rec.table, pick.wine)) out.push(at + '.table: names the flagship (' + pick.wine + ')');
  }
  if ('story' in rec && capped(out, at + '.story', rec.story, CAPS.story[0], CAPS.story[1])) {
    endsStop(out, at + '.story', rec.story);
    const years = (rec.story.match(/\b1\d{3}\b|\b20[0-2]\d\b/g) || []);
    if (new Set(years).size < CAPS.storyYears) out.push(at + '.story: at least ' + CAPS.storyYears + ' dated turning points (the founding, a classification, a vintage of history, a war, a revival)');
  }
  if ('others' in rec) othersProblems(rec, at).forEach((p) => out.push(p));
  if ('traps' in rec) trapsProblems(rec, at).forEach((p) => out.push(p));
  if ('cards' in rec) cardsProblems(rec, at).forEach((p) => out.push(p));
  if ('questions' in rec) questionsProblems(rec, at).forEach((p) => out.push(p));
  if ('sources' in rec) sourcesProblems(rec, at).forEach((p) => out.push(p));
  if (rec.report !== undefined && (!isList(rec.report) || rec.report.length > CAPS.report || rec.report.some((x) => !isStr(x) || !x.trim()))) out.push(at + '.report: a list of at most ' + CAPS.report + ' sentences when present (what the checker, the integrator and the owner should know)');
  checkedProblems(rec, at).forEach((p) => out.push(p));
  const total = readingWords(rec);
  if (total > CAPS.entry) out.push(at + ': ' + total + ' reading words (the wine, the label, place, table, story, others and traps), at most ' + CAPS.entry);
  voiceProblems(rec, at).forEach((p) => out.push(p));
  return out;
}

/* a group's fragment: { group, records: [five, in plan order] } */
function validateFragment(frag, plan, opts) {
  const out = people().problems.slice();
  if (!isObj(frag)) return out.concat(['fragment: { group, records }']);
  unknown(out, frag, ['group', 'records'], 'fragment', 'a fragment');
  const g = groupOf(plan, frag.group);
  if (!g) return out.concat(['group: ' + JSON.stringify(frag.group) + ' is no group of plan.json']);
  if (!isList(frag.records)) return out.concat(['records: a list of the group\'s five records, in the plan\'s order']);
  const order = g.picks.map((p) => p.key);
  const keys = frag.records.map((r) => (isObj(r) ? r.key : null));
  if (frag.records.length !== PICKS) out.push('records: exactly ' + PICKS + ' (' + frag.records.length + ')');
  if (keys.join('|') !== order.join('|')) out.push('records: the plan\'s order, ' + order.join(', ') + ' (found ' + keys.join(', ') + ')');
  frag.records.forEach((r, i) => validateRecord(r, plan, g.key, i, opts).forEach((p) => out.push(p)));
  return out;
}
/* the problems of one record within its fragment's list, for the build's record by record judgement */
function recordProblems(frag, plan, i, opts) { return validateRecord(frag.records[i], plan, frag.group, i, opts); }

/* what a second reader should look at: never a failure */
const TITLED = /\b(?:Baron|Baroness|Count|Countess|Comte|Comtesse|Marquis|Marquise|Marchese|Marchesa|Duke|Duc|Duchess|Sir|Lord|Lady|Madame|Monsieur|Dom|Don|Doña|Prince|Princess|Graf|Freiherr|Fürst|Tsar|King|Queen|Emperor|Empress|Pope|Abbé)\s+[A-Z]/;
const EST = /\b(?:the\s+(?:most|least)\s+[a-z]+|(?:old|larg|bigg|small|high|low|rich|rar|earli|lat|light|heavi|dark|sweet|long|short)est|the\s+first\s+(?:[a-z]+\s+){0,4}(?:to|in|of)|the\s+only)\b/i;
const NOW = /\b(?:today|now|still|nowadays|these days|modern day)\b/i;
function adviseRecord(rec, i) {
  const out = [];
  const at = 'records[' + (i == null ? 0 : i) + ']';
  if (!isObj(rec)) return out;
  const own = [rec.producer, isObj(rec.wine) ? rec.wine.name : ''].filter((x) => isStr(x) && x);
  CF.walkStrings(rec, at, (s, where) => {
    if (pathKind(where) !== 'prose') return;
    sentenceList(s).forEach((sen) => {
      const bare = own.reduce((t, n) => t.split(n).join(' '), sen);
      if (TITLED.test(bare) && !/\b1\d{3}\b|\b20[0-2]\d\b/.test(bare)) out.push(where + ': "' + bare.match(TITLED)[0] + '..." names a titled person with no date in the sentence: the long dead carry their dates once in the story, the living are never named');
    });
    const e = s.match(EST);
    if (e && !/\.sources/.test(where)) out.push(where + ': "' + e[0] + '" is a claim of rank or of a first: two sources, or cut it');
    const nw = s.match(NOW);
    if (nw) out.push(where + ': "' + nw[0] + '" speaks of the present: keep only what will not age');
  });
  if (rec.checked === undefined || rec.checked === null) out.push(at + '.checked: not yet checked by a refuter (the whole build refuses an unchecked record)');
  else if (isObj(rec.checked) && isList(rec.checked.open) && rec.checked.open.length) out.push(at + '.checked.open: ' + rec.checked.open.length + ' question(s) left open for the integrator');
  if (isList(rec.sources) && !rec.sources.some((s) => s && s.kind === 'primary')) out.push(at + '.sources: no primary source: every fact then needs two independent secondary ones');
  out.push(at + ': ' + readingWords(rec) + ' reading words of ' + CAPS.entry);
  return out;
}

/* the plan itself.
   f, when given, is facts(jsDir): every region slug real, its country the region's sheet, every producerId real. */
function planProblems(plan, f) {
  const out = people().problems.slice();
  if (!isObj(plan) || !isList(plan.groups)) return out.concat(['plan.json: { groups: [...] }']);
  if (plan.prefix !== ID_PREFIX) out.push('plan.prefix: ' + ID_PREFIX);
  if (JSON.stringify(plan.chunks) !== JSON.stringify(CHUNKS)) out.push('plan.chunks: ' + CHUNKS.join(', '));
  if (!isStr(plan.edition) || !/^\d{4}-\d{2}-\d{2}$/.test(plan.edition)) out.push('plan.edition: a date, YYYY-MM-DD');
  if (plan.wave !== 1) out.push('plan.wave: 1');
  if (plan.groups.length !== GROUPS) out.push('plan.groups: ' + GROUPS + ' groups (' + plan.groups.length + ')');
  const gkeys = {}; const pkeys = {}; const producers = {}; const ids = {};
  plan.groups.forEach((g, gi) => {
    const at = 'plan.groups[' + gi + '] ' + JSON.stringify(g && g.key);
    if (!isObj(g)) { out.push(at + ': an object'); return; }
    unknown(out, g, GROUP_FIELDS, at, 'a group');
    GROUP_FIELDS.filter((k) => !(k in g)).forEach((k) => out.push(at + '.' + k + ': missing'));
    if (!isStr(g.key) || !KEY_RE.test(g.key)) out.push(at + '.key: lower case words and hyphens');
    if (gkeys[g.key]) out.push(at + '.key: twice'); gkeys[g.key] = 1;
    if (!isStr(g.title) || !g.title.trim()) out.push(at + '.title: the heading');
    if (CHUNKS.indexOf(g.chunk) < 0) out.push(at + '.chunk: ' + CHUNKS.join(', '));
    if (f && Object.keys(f.regions).length) {
      const r = f.regions[g.region];
      if (!r) out.push(at + '.region: ' + JSON.stringify(g.region) + ' is no region slug of REGIONS');
      else if (r.sheet !== g.country) out.push(at + '.country: the region ' + g.region + ' is on the ' + r.sheet + ' sheet');
      if (!f.countries[g.country]) out.push(at + '.country: ' + JSON.stringify(g.country) + ' is no country key of REGIONS');
    }
    if (!isList(g.swaps)) out.push(at + '.swaps: a list ([] for none)');
    else g.swaps.forEach((s, si) => {
      const w = at + '.swaps[' + si + ']';
      if (!isObj(s)) { out.push(w + ': { from, to, why, agreed, date }'); return; }
      unknown(out, s, SWAP_FIELDS, w, 'a swap');
      SWAP_FIELDS.filter((k) => !(k in s)).forEach((k) => out.push(w + '.' + k + ': missing'));
      if (s.agreed !== true) out.push(w + '.agreed: true, once the checker agrees');
      if (!isStr(s.why) || words(s.why) < 8) out.push(w + '.why: the reason, eight words or more');
      if (isStr(s.date) && !/^\d{4}-\d{2}-\d{2}$/.test(s.date)) out.push(w + '.date: YYYY-MM-DD');
    });
    if (!isList(g.picks)) { out.push(at + '.picks: a list of five'); return; }
    if (g.picks.length !== PICKS) out.push(at + '.picks: exactly ' + PICKS + ' (' + g.picks.length + ')');
    g.picks.forEach((p, pi) => {
      const w = at + '.picks[' + pi + '] ' + JSON.stringify(p && p.key);
      if (!isObj(p)) { out.push(w + ': an object'); return; }
      unknown(out, p, PICK_FIELDS, w, 'a pick');
      ['key', 'producer', 'producerId', 'wine', 'why'].filter((k) => !(k in p)).forEach((k) => out.push(w + '.' + k + ': missing'));
      if (!isStr(p.key) || !KEY_RE.test(p.key)) out.push(w + '.key: lower case words and hyphens');
      if (pkeys[p.key]) out.push(w + '.key: twice in the plan (a key seeds the record\'s frozen id)'); pkeys[p.key] = 1;
      if (!isStr(p.producer) || !p.producer.trim()) out.push(w + '.producer: the house as it writes its name');
      else { const k = fold(p.producer); if (producers[k]) out.push(w + '.producer: ' + p.producer + ' is a pick of ' + producers[k] + ' too (one flagship a producer)'); producers[k] = g.key; }
      if (!isStr(p.producerId)) out.push(w + '.producerId: a WINE_PRODUCERS id, or ""');
      else if (p.producerId) {
        if (ids[p.producerId]) out.push(w + '.producerId: ' + p.producerId + ' is ' + ids[p.producerId] + '\'s too'); ids[p.producerId] = p.key;
        if (f && Object.keys(f.producers).length && !f.producers[p.producerId]) out.push(w + '.producerId: ' + p.producerId + ' is no record of WINE_PRODUCERS');
      }
      if (!isStr(p.wine) || !p.wine.trim()) out.push(w + '.wine: the flagship');
      if (!isStr(p.why) || words(p.why) < 6) out.push(w + '.why: one line, six words or more');
      if ('note' in p && (!isStr(p.note) || words(p.note) < 4)) out.push(w + '.note: what the author must confirm, when present');
      [p.producer, p.wine, p.why, p.note].forEach((s) => { if (isStr(s)) CMS.dashProblems(s, w).forEach((x) => out.push(x)); });
      [p.why, p.note].forEach((s) => {
        if (!isStr(s)) return;
        const j = s.match(JUDGE); if (j) out.push(w + ': "' + j[0] + '" judges or ranks');
        const lv = livingIn(s, p.producer); if (lv.length) out.push(w + ': names a living person (' + lv.join(', ') + ')');
        CMS.americanProblems(s, w).forEach((x) => out.push(x));
      });
    });
  });
  [g => g.title].forEach((get) => plan.groups.forEach((g, gi) => { if (isObj(g) && isStr(get(g))) CMS.dashProblems(get(g), 'plan.groups[' + gi + '].title').forEach((x) => out.push(x)); }));
  CHUNKS.forEach((c) => { if (!plan.groups.some((g) => g && g.chunk === c)) out.push('plan.chunks: ' + c + ' holds no group'); });
  if (Object.keys(pkeys).length !== GROUPS * PICKS) out.push('plan: ' + (GROUPS * PICKS) + ' picks (' + Object.keys(pkeys).length + ')');
  return out;
}

module.exports = {
  validateFragment, validateRecord, recordProblems, adviseRecord, planProblems, loadPlan, groupOf, pickOf, roster, facts, people, livingIn,
  readingWords, words, fold, hasPhrase, names, nameWords, sentenceList, voiceProblems, tastePath, pathKind,
  CAPS, FIELDS, PROVENANCE, COPIED, WINE_FIELDS, COLOURS, QUESTION_FIELDS, QUESTION_TAGS, SOURCE_FIELDS, SOURCE_KINDS, SOURCE_READS,
  CHECKED_FIELDS, VERDICTS, GROUP_FIELDS, PICK_FIELDS, SWAP_FIELDS, CHUNKS, GROUPS, PICKS, ID_PREFIX, ID_RE, KEY_RE,
  JUDGE, SCORE, VOLATILE, AMERICAN_MORE, DIR, ROOT, JS_DIR
};

if (require.main === module) {
  const arg = process.argv[2];
  if (arg !== '--caps') { console.log('usage: node .scripts/flagships/schema.cjs --caps   (the caps; the validator is required by build-flagships.cjs)'); process.exit(arg === '--help' || arg === '-h' ? 0 : 2); }
  const pair = (p) => (Array.isArray(p) ? (p[0] === p[1] ? 'exactly ' + p[0] : (p[0] ? p[0] + ' to ' + p[1] : 'at most ' + p[1])) : 'at most ' + p);
  const rows = [
    ['say', pair(CAPS.say) + ' words: a respelling where a guest would stumble, else ""'],
    ['place', pair(CAPS.place) + ' words: the village or commune and the appellation'],
    ['founded', 'a year in figures, or "" where nobody is sure'],
    ['wine.name', pair(CAPS.wine.name) + ' words, holding the plan\'s words for the flagship'],
    ['wine.appellation', pair(CAPS.wine.appellation) + ' words'],
    ['wine.classification', pair(CAPS.wine.classification) + ' words, "" if none'],
    ['wine.colour', COLOURS.join(', ')],
    ['wine.grapes', pair(CAPS.wine.grapes) + ' words: the cépage in words, a typical blend, no yearly percentages'],
    ['wine.sites', pair(CAPS.wine.sites) + ' words: the vineyards or parcels'],
    ['wine.making', pair(CAPS.wine.making) + ' words: fermentation, vessels, the élevage and its length'],
    ['wine.glass', pair(CAPS.wine.glass) + ' words, named things, no figure, no bare family word'],
    ['wine.ageing', pair(CAPS.wine.ageing) + ' words: when it opens and how long it lasts'],
    ['wine.serve', pair(CAPS.wine.serve) + ' words: degrees Celsius in figures, decant or not, the glass'],
    ['wine.label', pair(CAPS.label.n) + ' terms, term ' + pair(CAPS.label.term) + ', means ' + pair(CAPS.label.means) + ' words'],
    ['table', pair(CAPS.table) + ' words, ' + pair(CAPS.tableSentences) + ' sentences, naming the house and the flagship'],
    ['story', pair(CAPS.story) + ' words, at least ' + CAPS.storyYears + ' dated turning points'],
    ['others', pair(CAPS.others.n) + ', name ' + pair(CAPS.others.name) + ', note ' + pair(CAPS.others.note) + ' words; the second wine first'],
    ['traps', pair(CAPS.traps.n) + ', each ' + pair(CAPS.traps.line) + ' words'],
    ['cards', 'exactly ' + CAPS.cards.n + ', front ' + pair(CAPS.cards.front) + ', back ' + pair(CAPS.cards.back) + ' words, the house or its wine on one face'],
    ['questions', 'exactly ' + CAPS.questions.n + ' (one tagged wine, one tagged story), stem ' + pair(CAPS.questions.stem) + ', an option at most ' + CAPS.questions.option[1] + ', exp ' + pair(CAPS.questions.exp) + ' words'],
    ['sources', pair(CAPS.sources.n) + ', title ' + pair(CAPS.sources.title) + ' words, kind primary or secondary, read page, search or book, at least ' + CAPS.sources.web + ' https address'],
    ['report', 'at most ' + CAPS.report + ' sentences, never shipped'],
    ['checked', '{ date, by: refuter, verdict: sound or changed, changed: [], open: [] }, never shipped; the whole build needs it'],
    ['entry', 'at most ' + CAPS.entry + ' reading words']
  ];
  rows.forEach((r) => console.log(r[0] + ': ' + r[1]));
  process.exit(0);
}
