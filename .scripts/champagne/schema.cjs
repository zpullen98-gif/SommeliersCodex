#!/usr/bin/env node
/* schema: the one validator of the Champagne houses tab of Brennan's (codex59): a house's fragment (one record) and
   the plan.

     const S = require('./schema.cjs');
     const plan = S.loadPlan();                       // .scripts/champagne/plan.json
     const problems = S.validateRecord(rec, plan);    // [] when sound
     const notes = S.adviseRecord(rec, plan);         // never a failure: what a second reader should look at
     const planned = S.planProblems(plan, facts);     // the plan, against the app when facts are given

   Every problem names its field first and then the rule ("table.house45: 84 words, 90 to 110"). build-champagne
   refuses a record that fails here, and a gate reads the same rules, so each lives once. Nothing here writes a file.

   The voice is the Codex's own and is reused, never written again: the Flagships tab's refusals (.scripts/flagships/
   schema.cjs: JUDGE, SCORE, VOLATILE, AMERICAN_MORE, its people.json through livingIn, and, read from its source,
   the per cent sign, the numbered level, the hyphen range, the spaced hyphen, the house's own name and the three
   advice patterns), the dash, glyph and American tests of build-cms.cjs, the retired word and the per cent and
   towards spellings of check-fragment.cjs, and the Grapes tab's price, degree sign, generic refusal of a bare
   family word and rules of a spoken line (.scripts/grapes/schema.cjs). What is this tab's own is named below: the
   sheet (SHEET, the class sheet as printed, never corrected), the chunks, the caps (CAPS, the one statement of
   every limit), the appellation's own words for a producer (KINDS), the living people of this folder's
   people.json, and the shape of every field.

   node .scripts/champagne/schema.cjs --caps prints the caps as the brief states them.
   node .scripts/champagne/schema.cjs --test proves the rules on the pilot fragments: each of a list of faults is
   seeded into a sound pilot and must be refused by the rule that names it. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const CF = require(path.join(__dirname, '..', 'regions', 'check-fragment.cjs'));
const CMS = require(path.join(__dirname, '..', 'cms', 'build-cms.cjs'));
const GS = require(path.join(__dirname, '..', 'grapes', 'schema.cjs'));
const FS = require(path.join(__dirname, '..', 'flagships', 'schema.cjs'));

const DIR = __dirname;
const ROOT = path.join(__dirname, '..', '..');
const JS_DIR = path.join(ROOT, 'js');

/* The class sheet the owner photographed on 22 November 2026, row by row as printed: the house, then the prestige
   cuvée, spellings kept (the third row is cut off at the page edge after "Franco"). plan.json's houses are these 23
   in this order and each pick's sheet is the second column exactly: the sheet is a fact, never corrected. */
const SHEET = [
  ['Armand de Brignac', 'Brut Gold NV'], ['Ayala', 'Grand Cuvée/Perle d\'Ayala'], ['Billecart-Salmon', 'Clos St. Hilaire/Cuvée Nicolas Franco'],
  ['Bollinger', 'La Grand Année'], ['Delamotte', '(Salon) Blanc de Blancs'], ['Salon', 'Le Mesnil'], ['Deutz', 'Amour de Deutz'],
  ['Duval-Leroy', 'Cuvée Femme'], ['Drappier', 'Grand Sendrée'], ['Gosset', 'Celebris'], ['Henriot', 'Cuvée des Enchanteleurs/Hemera'],
  ['Krug', 'Grand Cuvée'], ['Laurent-Perrier', 'Grand Siècle'], ['Louis Roederer', 'Cristal'], ['Moët & Chandon', 'Dom Pérignon'],
  ['Nicolas Feuillatte', 'Cuvée Palms d\'Or'], ['Perrier-Jouët', 'Belle Époque'], ['Philipponnat', 'Clos de Goisses'], ['Piper-Heidsieck', 'Formerly Rare'],
  ['Pol Roger', 'Sir Winston Churchill'], ['Ruinart', 'Dom Ruinart'], ['Taittinger', 'Comtes de Chamoagne'], ['Veuve Clicquot', 'La Grande Dame']
];
const HOUSES = SHEET.length;
/* the chunks, and the keys each holds, in the plan's order within a chunk */
const CHUNKS = ['pilots', 'h1', 'h2', 'h3', 'h4', 'h5'];
const CHUNK_OF = {
  pilots: ['ayala', 'bollinger'],
  h1: ['armand-de-brignac', 'billecart-salmon', 'delamotte', 'salon'],
  h2: ['deutz', 'duval-leroy', 'drappier', 'gosset'],
  h3: ['henriot', 'krug', 'laurent-perrier', 'louis-roederer'],
  h4: ['moet-chandon', 'nicolas-feuillatte', 'perrier-jouet', 'philipponnat'],
  h5: ['piper-heidsieck', 'pol-roger', 'ruinart', 'taittinger', 'veuve-clicquot']
};
const PICK_FIELDS = ['key', 'house', 'cuvee', 'sheet', 'also', 'producerId', 'cuveeId', 'pick', 'chunk', 'why', 'note'];
const PICK_NEEDS = PICK_FIELDS.filter((k) => k !== 'also');
const ALSO_PLAN_FIELDS = ['name', 'sheet', 'standing'];
/* how a second cuvée stands to the first: made beside it, made before it (history) or made after it left the house */
const STANDINGS = ['beside', 'before', 'after'];
/* the id prefix of a record, a card and a question: hc- and eight base36 digits (build-champagne proves no other mint) */
const ID_PREFIX = 'hc-';
const ID_RE = /^hc-[0-9a-z]{8}$/;
const KEY_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/* a record's fields, in the order the build ships them (also only where the plan gives the house a second cuvée) */
const FIELDS = ['key', 'house', 'producerId', 'cuveeId', 'pick', 'say', 'founded', 'place', 'kind', 'story', 'style', 'cuvee', 'also', 'table', 'guests', 'traps', 'sheet', 'cards', 'questions', 'sources'];
/* provenance: read by the refuter and the integrator, never shipped */
const PROVENANCE = ['report', 'checked'];
/* copied from the plan exactly */
const COPIED = ['house', 'producerId', 'cuveeId', 'pick'];
const DATED_FIELDS = ['year', 'what'];
const KIND_FIELDS = ['code', 'means'];
/* The appellation's own words for who made the bottle, the two letters the label carries before the producer's
   number, as the Comité Champagne gives them. "" stands where the letters could not be sourced. */
const KINDS = {
  NM: 'négociant manipulant', RM: 'récoltant manipulant', CM: 'coopérative de manipulation', RC: 'récoltant coopérateur',
  SR: 'société de récoltants', ND: 'négociant distributeur', MA: 'marque d\'acheteur'
};
const STYLE_FIELDS = ['line', 'grapes', 'reserve', 'vessels', 'malolactic', 'lees', 'dosage', 'nv'];
/* the five the house states or does not: "" is a true answer, and at least STYLE_STATED of them are stated */
const STYLE_OPTIONAL = ['reserve', 'vessels', 'malolactic', 'lees', 'dosage'];
const STYLE_STATED = 3;
const NV_FIELDS = ['name', 'note'];
const CUVEE_FIELDS = ['name', 'say', 'first', 'kind', 'rhythm', 'blend', 'sites', 'making', 'lees', 'bottle', 'young', 'aged', 'forms', 'serve'];
const CUVEE_KINDS = ['vintage', 'multi-vintage', 'non-vintage'];
const ALSO_FIELDS = ['name', 'say', 'standing', 'first', 'note', 'line'];
const TABLE_FIELDS = ['house45', 'house10', 'cuvee45', 'sale', 'cuvee10', 'cuvee20'];
const GUEST_FIELDS = ['q', 'a'];
const SHEET_FIELDS = ['prints', 'label', 'note'];
const CARD_FIELDS = ['kind', 'front', 'back'];
/* the three recall cards, in this order: the house to its cuvée, the cuvée to its house, one number or term */
const CARD_KINDS = ['house', 'cuvee', 'term'];
const QUESTION_FIELDS = ['q', 'opts', 'a', 'exp', 'tag'];
/* the three questions: one matching the house and its cuvée, one on the house, one on the cuvée */
const QUESTION_TAGS = ['match', 'house', 'cuvee'];
const SOURCE_FIELDS = FS.SOURCE_FIELDS;
const SOURCE_KINDS = FS.SOURCE_KINDS;
const SOURCE_READS = FS.SOURCE_READS;
const CHECKED_FIELDS = FS.CHECKED_FIELDS;
const VERDICTS = FS.VERDICTS;

/* Every limit, in words unless named otherwise. A pair is [least, most]. The spoken lines are the Grapes tab's:
   forty five seconds is 90 to 110 words, twenty seconds two sentences, ten seconds one, the sale exactly two. */
const CAPS = {
  say: [0, 12],
  place: [2, 14],
  dated: [5, 30], /* founded.what, cuvee.first.what, also.first.what: what the year is the year of */
  kindMeans: [8, 40],
  story: [150, 230],
  storyYears: 3, /* a story is dated history: at least three dated turning points */
  style: { line: [15, 50], grapes: [8, 50], reserve: [0, 45], vessels: [0, 40], malolactic: [0, 35], lees: [0, 35], dosage: [0, 35], nvName: [0, 8], nvNote: [8, 45] },
  cuvee: { name: [1, 10], rhythm: [10, 50], blend: [6, 45], sites: [5, 55], making: [20, 90], lees: [4, 35], bottle: [0, 50], young: [15, 50], aged: [12, 50], serve: [10, 45] },
  forms: { n: [0, 3], name: [1, 10], note: [4, 35] },
  also: { name: [1, 10], note: [30, 90], line: [12, 25] },
  lines: { house45: [90, 110], house10: [12, 25], cuvee45: [90, 110], sale: [15, 45], cuvee10: [12, 25], cuvee20: [25, 50] },
  lineSentences: { house45: [4, 8], house10: [1, 1], cuvee45: [4, 8], sale: [2, 2], cuvee10: [1, 1], cuvee20: [2, 2] },
  lineSentenceWords: GS.CAPS.lineSentenceWords, /* no sentence of a spoken line runs longer: it must be said in a breath */
  lineList: GS.CAPS.lineList, /* no list longer than three in a spoken line */
  nameWithin: { house45: 6, cuvee45: 8 }, /* a forty five second line opens on its subject's name */
  guests: { n: [2, 4], q: [3, 20], a: [8, 50] },
  traps: { n: [2, 4], line: [8, 40] },
  sheet: { label: [1, 14], note: [8, 50] },
  cards: { n: 3, front: [5, 20], back: [2, 40] },
  questions: { n: 3, stem: [8, 55], option: [1, 14], exp: [12, 50] },
  sources: { n: [3, 10], title: [2, 20], web: 1 },
  serveDegrees: [6, 13], /* the Codex's service reference: sparkling 8 to 10 degrees Celsius, a fuller oak aged Champagne 9 to 12 */
  report: 12,
  entry: 1700 /* the reading words a record shows: everything above the cards, the questions and the sources */
};

/* small readers */
function isStr(v) { return typeof v === 'string'; }
function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
function isList(v) { return Array.isArray(v); }
function words(s) { return CF.words(s); }
function fold(s) { return CF.fold(s); }
function hasPhrase(text, term) { return FS.hasPhrase(text, term); }
function sentenceList(s) { return GS.sentenceList(s); }
function firstWords(s, n) { return String(s || '').trim().split(/\s+/).slice(0, n).join(' '); }
function loadPlan(file) { return JSON.parse(fs.readFileSync(file || path.join(DIR, 'plan.json'), 'utf8')); }
function roster(plan) { return (plan && isList(plan.houses) ? plan.houses : []).filter(isObj); }
function pickOf(plan, key) { return roster(plan).find((p) => p.key === key) || null; }
function indexOf(plan, key) { return roster(plan).findIndex((p) => p.key === key); }
/* the sheet and the label differ: a spelling, a word more or fewer, a second name */
function sheetDiffers(pick) { return !!pick && fold(pick.sheet) !== fold(pick.cuvee); }

/* a rule of the Flagships tab that its schema keeps private, read from its source as it reads the Grapes tab's */
const FS_SRC = fs.readFileSync(path.join(__dirname, '..', 'flagships', 'schema.cjs'), 'utf8');
function fromFlagships(name) {
  const m = FS_SRC.match(new RegExp('\\nconst ' + name + ' = (\\/.*\\/[a-z]*);'));
  if (!m) throw new Error('schema: the Flagships schema no longer declares ' + name);
  return vm.runInNewContext(m[1]);
}
const PER_CENT_SIGN = fromFlagships('PER_CENT_SIGN');
const NUMBERED_LEVEL = fromFlagships('NUMBERED_LEVEL');
const HYPHEN_RANGE = fromFlagships('HYPHEN_RANGE');
const SPACED_HYPHEN = fromFlagships('SPACED_HYPHEN');
const HOUSE_NAME = fromFlagships('HOUSE_NAME');
const TITLED = fromFlagships('TITLED');
const EST = fromFlagships('EST');
const NOW = fromFlagships('NOW');
/* the two fields that describe a single vineyard, where its size in hectares is a fact that stands */
const SIZE_PATH = /^(?:cuvee\.sites|also\.note)$/;
/* a spoken line holds no bracket (the Grapes tab's rule, private there) */
const LINE_BRACKET = /[()\[\]{}]/;

/* what the Codex holds: the library's producers and the published flagships records of the Champagne group */
const FACTS = {};
function facts(jsDir) {
  const dir = path.resolve(jsDir || JS_DIR);
  if (FACTS[dir]) return FACTS[dir];
  const f = { dir, producers: {}, picks: {} };
  const P = FS.facts(dir);
  f.producers = P.producers || {};
  try {
    const fplan = FS.loadPlan();
    const g = FS.groupOf(fplan, 'champagne');
    const frag = JSON.parse(fs.readFileSync(path.join(FS.DIR, 'fragments', 'champagne.json'), 'utf8'));
    (g ? g.picks : []).forEach((p) => { const rec = (frag.records || []).find((r) => r && r.key === p.key); f.picks[p.key] = { producer: p.producer, producerId: p.producerId, wine: p.wine, founded: rec ? rec.founded : '' }; });
  } catch (e) { f.picks = {}; }
  FACTS[dir] = f;
  return f;
}

/* the people never named: the Flagships tab's list and this folder's own */
let PEOPLE = null;
function people() {
  if (PEOPLE) return PEOPLE;
  const out = { names: [], problems: [] };
  let j = null;
  try { j = JSON.parse(fs.readFileSync(path.join(DIR, 'people.json'), 'utf8')); } catch (e) { out.problems.push('people.json: ' + e.message); }
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
/* The living named in a string. own is the names a record may always print because they are the label: the house,
   the cuvée and the second cuvée, each taken out first (Pol Roger, Nicolas Feuillatte and Sir Winston Churchill are
   bottles before they are people). Then the Flagships tab's list and its living writers, then this folder's. */
function livingIn(s, own, address) {
  let t = String(s || '');
  (own || []).filter((n) => isStr(n) && n).sort((a, b) => b.length - a.length).forEach((n) => { t = t.split(n).join(' '); });
  if (address) (own || []).filter((n) => isStr(n) && fold(n)).forEach((n) => { t = (' ' + fold(t) + ' ').split(' ' + fold(n) + ' ').join(' '); });
  const hits = FS.livingIn(t, '', false);
  const f = ' ' + fold(t) + ' ';
  people().names.forEach((n) => { if (f.indexOf(' ' + fold(n) + ' ') >= 0 && hits.indexOf(n) < 0) hits.push(n); });
  return hits;
}
function ownNames(rec, pick) {
  const out = [];
  if (pick) { out.push(pick.house, pick.cuvee); if (isObj(pick.also)) out.push(pick.also.name); }
  if (isObj(rec)) {
    if (isStr(rec.house)) out.push(rec.house);
    if (isObj(rec.cuvee) && isStr(rec.cuvee.name)) out.push(rec.cuvee.name);
    if (isObj(rec.also) && isStr(rec.also.name)) out.push(rec.also.name);
  }
  return out.filter((n, i) => isStr(n) && n && out.indexOf(n) === i);
}

/* the kinds of a string, by its path in the record */
function pathKind(where) {
  if (/(?:^|\.)sources\[\d+\]\.url$/.test(where)) return 'url';
  if (/(?:^|\.)sources\[\d+\]\.title$/.test(where)) return 'title';
  if (/(?:^|\.)(?:report\[\d+\]|checked(?:\.|$))/.test(where)) return 'provenance';
  if (/(?:^|\.)(?:key|producerId|cuveeId|pick|say|founded\.year|kind\.code|cuvee\.say|cuvee\.kind|cuvee\.first\.year|also\.say|also\.standing|also\.first\.year|sheet\.prints|cards\[\d+\]\.kind|questions\[\d+\]\.tag|sources\[\d+\]\.(?:kind|read)|id)$/.test(where)) return 'key';
  return 'prose';
}
/* the fields whose prose describes the glass, where a bare family word is refused */
function tastePath(where) { return /^(?:style\.line|cuvee\.(?:young|aged)|also\.(?:note|line)|table\.|guests\[\d+\]\.a|cards\[\d+\]\.(?:front|back)|questions\[\d+\]\.(?:q|exp|opts\[\d+\]))/.test(where); }
function tidyProblems(s, where) {
  const out = [];
  if (s !== s.trim()) out.push(where + ': a space at an end');
  if (/\s{2,}|[\t\n\r]/.test(s)) out.push(where + ': two spaces together, a tab or a line break');
  return out;
}
/* every string of a record, by its path */
function voiceProblems(rec, pick) {
  const out = [];
  const own = ownNames(rec, pick);
  CF.walkStrings(rec, '', (s, at) => {
    const where = at.replace(/^\./, '');
    const kind = pathKind(where);
    if (kind === 'url') {
      if (s) CF.urlProblems(s, where).forEach((p) => out.push(p));
      const lv = livingIn(s.replace(/[-_/.]+/g, ' '), own, true);
      if (lv.length) out.push(where + ': the address names a living person (' + lv[0] + ')');
      return;
    }
    CMS.dashProblems(s, where).forEach((p) => out.push(p));
    if (SPACED_HYPHEN.test(s)) out.push(where + ': a hyphen standing alone between spaces (a dash by another name: use a comma, a colon or a full stop)');
    if (GS.DEGREE.test(s)) out.push(where + ': a degree sign (write the word degrees)');
    tidyProblems(s, where).forEach((p) => out.push(p));
    if (kind === 'provenance') return;
    if (where === 'sheet.prints') return; /* the sheet as printed, spellings kept: held to the plan, not to the voice */
    const lv = /^(?:key|producerId|cuveeId|pick)$/.test(where) ? [] : livingIn(s, own);
    if (lv.length) out.push(where + ': names a living person (' + lv.join(', ') + '): say the family, the founder\'s heir, the cellar master');
    if (HOUSE_NAME.test(s)) out.push(where + ': names the house where the owner works (a record never does: say the class sheet)');
    if (kind === 'key') return;
    CF.voiceProblems(s, where).filter((p) => /retired word|numbered level/.test(p)).forEach((p) => out.push(p));
    if (kind === 'title') return;
    if (NUMBERED_LEVEL.test(s)) out.push(where + ': a numbered level (levels are named, never numbered)');
    CMS.americanProblems(s, where).forEach((p) => out.push(p));
    CF.proseProblems(s, where).forEach((p) => out.push(p));
    const am = s.match(FS.AMERICAN_MORE);
    if (am) out.push(where + ': American spelling "' + am[0] + '"');
    const j = s.match(FS.JUDGE);
    if (j) out.push(where + ': "' + j[0].toLowerCase() + '" judges or ranks (famous may describe, never rank: say what the wine is and why it matters)');
    if (PER_CENT_SIGN.test(s)) out.push(where + ': a per cent sign (write per cent, or better a share in words: about two thirds)');
    const pr = s.match(GS.PRICE);
    if (pr) out.push(where + ': "' + pr[0] + '" talks price (no price anywhere)');
    const sc = s.match(FS.SCORE);
    if (sc) out.push(where + ': "' + sc[0] + '" is a score or a rating (none anywhere, and no medal)');
    /* a walled vineyard's size does not move: hectares may stand where the single vineyard is described, and nowhere else */
    const vo = (SIZE_PATH.test(where) ? s.replace(/\bhectares?\b/gi, ' ') : s).match(FS.VOLATILE);
    if (vo) out.push(where + ': "' + vo[0] + '" is volatile (no size, production, present owner, present role or recent release; ownership told with its year is history)');
    if (HYPHEN_RANGE.test(s)) out.push(where + ': a range with a hyphen (write "1855 to 1973", "8 to 10")');
    if (tastePath(where)) GS.genericInProse(s).forEach((g) => out.push(where + ': the family word "' + g + '" stands alone: name the thing (toasted brioche, white peach, roasted hazelnut, candied lemon peel)'));
  });
  return out;
}

/* the pieces of a record */
function capped(out, where, v, lo, hi, empty) {
  if (!isStr(v)) { out.push(where + ': a string'); return false; }
  if (!v.trim()) { if (!empty && lo > 0) out.push(where + ': a string of ' + lo + ' words or more'); else if (!empty) out.push(where + ': a string'); return false; }
  const n = words(v);
  if (n < lo || n > hi) out.push(where + ': ' + n + ' words, ' + (lo > 0 ? lo + ' to ' + hi : 'at most ' + hi));
  return true;
}
function unknown(out, rec, allowed, where, what) {
  Object.keys(rec).filter((k) => allowed.indexOf(k) < 0).forEach((k) => out.push((where ? where + '.' : '') + k + ': no field of ' + what + ' (' + allowed.join(', ') + ')'));
}
function missing(out, rec, needed, where) { needed.filter((k) => !(k in rec)).forEach((k) => out.push((where ? where + '.' : '') + k + ': missing')); }
function counted(out, where, list, lo, hi, what) {
  if (!isList(list)) { out.push(where + ': a list of ' + what); return false; }
  if (list.length < lo || list.length > hi) out.push(where + ': ' + (lo === hi ? 'exactly ' + lo : lo + ' to ' + hi) + ' ' + what + ' (' + list.length + ')');
  return true;
}
function endsStop(out, where, s) { if (isStr(s) && s.trim() && !/[.!?]["'’”)]?$/.test(s.trim())) out.push(where + ': ends on a full stop'); }

function sayProblems(s, where) {
  const out = [];
  if (!isStr(s)) return [where + ': a respelling, or "" where a guest would not stumble'];
  if (!s) return out;
  if (words(s) > CAPS.say[1]) out.push(where + ': ' + words(s) + ' words, at most ' + CAPS.say[1]);
  if (!/^[A-Za-z][A-Za-z ,'-]*$/.test(s)) out.push(where + ': letters, hyphens, commas and spaces only (no marks, no brackets, no stop)');
  const one = /^[A-Z]{2,}$/.test(s);
  if (!one && (!/[A-Z]{2,}/.test(s) || s.indexOf('-') < 0)) out.push(where + ': syllables joined by hyphens, the stressed one in capitals (bol-an-ZHAY), or one syllable in capitals (KROOG)');
  return out;
}
/* a year and what it is the year of: { year: "1860" or "", what: a sentence } */
function datedProblems(v, where, what) {
  const out = [];
  if (!isObj(v)) return [where + ': { year, what }: ' + what];
  unknown(out, v, DATED_FIELDS, where, 'a dated fact');
  missing(out, v, DATED_FIELDS, where);
  if ('year' in v) {
    if (!isStr(v.year)) out.push(where + '.year: a year as text, or "" where nobody is sure');
    else if (v.year && (!/^\d{4}$/.test(v.year) || +v.year > new Date().getFullYear())) out.push(where + '.year: a year in figures ("1860"), or "" where nobody is sure (an empty field is a true answer)');
  }
  if ('what' in v && capped(out, where + '.what', v.what, CAPS.dated[0], CAPS.dated[1])) endsStop(out, where + '.what', v.what);
  return out;
}
/* the report may answer a published record: a sentence that names the library or the flagships record and the year */
function reportAnswers(rec, word, year) { return isList(rec.report) && rec.report.some((x) => isStr(x) && new RegExp('\\b' + word + '\\b', 'i').test(x) && x.indexOf(String(year)) >= 0); }

function foundedProblems(rec, pick, f) {
  const out = datedProblems(rec.founded, 'founded', 'the year the house dates itself from, and what that year is');
  const y = isObj(rec.founded) && isStr(rec.founded.year) ? rec.founded.year : '';
  if (!y) return out;
  const lib = pick.producerId && f.producers[pick.producerId] ? String(f.producers[pick.producerId].founded || '') : '';
  if (/^\d{4}$/.test(lib) && lib !== y && !reportAnswers(rec, 'library', lib)) out.push('founded.year: the library (' + pick.producerId + ') says ' + lib + ': agree with it, or keep yours and say in report why the library\'s ' + lib + ' is not yours');
  const fl = pick.pick && f.picks[pick.pick] ? String(f.picks[pick.pick].founded || '') : '';
  if (/^\d{4}$/.test(fl) && fl !== y && !reportAnswers(rec, 'flagships', fl)) out.push('founded.year: the published flagships record (' + pick.pick + ') says ' + fl + ': agree with it, or keep yours and say in report why the flagships record\'s ' + fl + ' is not yours');
  return out;
}

function kindProblems(rec) {
  const out = [];
  const k = rec.kind;
  if (!isObj(k)) return ['kind: { code, means }: what the house is in the appellation\'s own terms'];
  unknown(out, k, KIND_FIELDS, 'kind', 'the kind');
  missing(out, k, KIND_FIELDS, 'kind');
  if ('code' in k && k.code !== '' && !Object.prototype.hasOwnProperty.call(KINDS, k.code)) out.push('kind.code: the two letters on the label, one of ' + Object.keys(KINDS).join(', ') + ', or "" where they could not be sourced');
  if ('means' in k && capped(out, 'kind.means', k.means, CAPS.kindMeans[0], CAPS.kindMeans[1])) {
    endsStop(out, 'kind.means', k.means);
    if (k.code && Object.prototype.hasOwnProperty.call(KINDS, k.code) && !hasPhrase(k.means, KINDS[k.code])) out.push('kind.means: says the term the letters stand for, ' + KINDS[k.code] + ', and what it means of this house');
  }
  return out;
}

function styleProblems(rec) {
  const out = [];
  const s = rec.style;
  if (!isObj(s)) return ['style: { ' + STYLE_FIELDS.join(', ') + ' }'];
  unknown(out, s, STYLE_FIELDS, 'style', 'the style');
  missing(out, s, STYLE_FIELDS, 'style');
  ['line', 'grapes'].concat(STYLE_OPTIONAL).forEach((k) => {
    if (!(k in s)) return;
    const opt = STYLE_OPTIONAL.indexOf(k) >= 0;
    if (capped(out, 'style.' + k, s[k], CAPS.style[k][0], CAPS.style[k][1], opt)) endsStop(out, 'style.' + k, s[k]);
  });
  const stated = STYLE_OPTIONAL.filter((k) => isStr(s[k]) && s[k].trim()).length;
  if (STYLE_OPTIONAL.every((k) => k in s) && stated < STYLE_STATED) out.push('style: at least ' + STYLE_STATED + ' of ' + STYLE_OPTIONAL.join(', ') + ' as the house states them (' + stated + '); "" only where the house does not say, and the report says which');
  if ('nv' in s) {
    if (!isObj(s.nv)) out.push('style.nv: { name, note }: the non vintage wine a guest knows the house by (name "" where the house makes none, the note saying so)');
    else {
      unknown(out, s.nv, NV_FIELDS, 'style.nv', 'the non vintage wine');
      missing(out, s.nv, NV_FIELDS, 'style.nv');
      if ('name' in s.nv) capped(out, 'style.nv.name', s.nv.name, CAPS.style.nvName[0], CAPS.style.nvName[1], true);
      if ('note' in s.nv && capped(out, 'style.nv.note', s.nv.note, CAPS.style.nvNote[0], CAPS.style.nvNote[1])) endsStop(out, 'style.nv.note', s.nv.note);
    }
  }
  return out;
}

function serveProblems(out, where, s) {
  if (!isStr(s)) return;
  const m = s.match(/\b(\d{1,2})(?:\s+to\s+(\d{1,2}))?\s+degrees\s+Celsius\b/);
  if (!m) out.push(where + ': the temperature in figures and degrees Celsius ("9 to 11 degrees Celsius")');
  else [m[1], m[2]].filter(Boolean).forEach((d) => { if (+d < CAPS.serveDegrees[0] || +d > CAPS.serveDegrees[1]) out.push(where + ': ' + d + ' degrees is outside the Codex\'s service reference for Champagne (' + CAPS.serveDegrees[0] + ' to ' + CAPS.serveDegrees[1] + ' degrees Celsius)'); });
  if (/Fahrenheit/i.test(s)) out.push(where + ': degrees Celsius alone');
  if (!/\bdecant|\bcarafe/i.test(s)) out.push(where + ': says whether to decant');
  if (!/\b(?:glass|glasses|tulip|flute|bowl|coupe)\b/i.test(s)) out.push(where + ': names the glass');
}

function cuveeProblems(rec, pick) {
  const out = [];
  const c = rec.cuvee;
  if (!isObj(c)) return ['cuvee: { ' + CUVEE_FIELDS.join(', ') + ' }'];
  unknown(out, c, CUVEE_FIELDS, 'cuvee', 'the cuvée');
  missing(out, c, CUVEE_FIELDS, 'cuvee');
  if ('name' in c && capped(out, 'cuvee.name', c.name, CAPS.cuvee.name[0], CAPS.cuvee.name[1]) && !hasPhrase(c.name, pick.cuvee)) out.push('cuvee.name: holds the plan\'s words for the cuvée, "' + pick.cuvee + '", as the label prints them (the label may add a word; another cuvée is the engineer\'s change to plan.json)');
  if ('say' in c) sayProblems(c.say, 'cuvee.say').forEach((p) => out.push(p));
  if ('first' in c) datedProblems(c.first, 'cuvee.first', 'the first vintage or the first release, and which of the two the year is').forEach((p) => out.push(p));
  if (isObj(c.first) && isStr(c.first.what) && c.first.what.trim() && !/vintage|release|harvest|made|creat|launch|blend|bottl/i.test(c.first.what)) out.push('cuvee.first.what: says what the year is: the first vintage, the first release, the year it was created');
  if ('kind' in c && CUVEE_KINDS.indexOf(c.kind) < 0) out.push('cuvee.kind: one of ' + CUVEE_KINDS.join(', '));
  ['rhythm', 'blend', 'sites', 'making', 'lees', 'bottle', 'young', 'aged', 'serve'].forEach((k) => {
    if (!(k in c)) return;
    if (capped(out, 'cuvee.' + k, c[k], CAPS.cuvee[k][0], CAPS.cuvee[k][1], k === 'bottle')) endsStop(out, 'cuvee.' + k, c[k]);
  });
  if (isStr(c.young) && /\d/.test(c.young)) out.push('cuvee.young: in words, no figure');
  if ('serve' in c) serveProblems(out, 'cuvee.serve', c.serve);
  if ('forms' in c && counted(out, 'cuvee.forms', c.forms, CAPS.forms.n[0], CAPS.forms.n[1], 'other forms')) {
    const seen = {};
    c.forms.forEach((x, i) => {
      const w = 'cuvee.forms[' + i + ']';
      if (!isObj(x)) { out.push(w + ': { name, note }'); return; }
      unknown(out, x, ['name', 'note'], w, 'a form');
      if (capped(out, w + '.name', x.name, CAPS.forms.name[0], CAPS.forms.name[1])) { if (seen[fold(x.name)]) out.push(w + '.name: given twice'); seen[fold(x.name)] = 1; if (isStr(c.name) && fold(x.name) === fold(c.name)) out.push(w + '.name: the cuvée itself'); }
      if (capped(out, w + '.note', x.note, CAPS.forms.note[0], CAPS.forms.note[1])) endsStop(out, w + '.note', x.note);
    });
  }
  return out;
}

function alsoProblems(rec, pick) {
  const out = [];
  const want = isObj(pick.also) ? pick.also : null;
  if (!want) { if ('also' in rec) out.push('also: the plan gives ' + pick.house + ' no second cuvée (a record carries also only where plan.json does)'); return out; }
  const a = rec.also;
  if (!isObj(a)) return ['also: { ' + ALSO_FIELDS.join(', ') + ' }: the plan gives ' + pick.house + ' a second cuvée, ' + want.name];
  unknown(out, a, ALSO_FIELDS, 'also', 'the second cuvée');
  missing(out, a, ALSO_FIELDS, 'also');
  if ('name' in a && capped(out, 'also.name', a.name, CAPS.also.name[0], CAPS.also.name[1]) && !hasPhrase(a.name, want.name)) out.push('also.name: holds the plan\'s words for the second cuvée, "' + want.name + '"');
  if ('say' in a) sayProblems(a.say, 'also.say').forEach((p) => out.push(p));
  if ('standing' in a && a.standing !== want.standing) out.push('also.standing: copied from plan.json exactly, ' + JSON.stringify(want.standing) + ' (' + STANDINGS.join(', ') + ': made beside the first, before it, or after it)');
  if ('first' in a) datedProblems(a.first, 'also.first', 'its first vintage or first release, and which the year is').forEach((p) => out.push(p));
  if ('note' in a && capped(out, 'also.note', a.note, CAPS.also.note[0], CAPS.also.note[1])) endsStop(out, 'also.note', a.note);
  if ('line' in a) lineProblems(out, 'also.line', a.line, CAPS.also.line, [1, 1], ownNames(rec, pick));
  if (isStr(a.line) && isStr(a.name) && !hasPhrase(a.line, want.name) && !hasPhrase(a.line, a.name)) out.push('also.line: names the second cuvée (' + want.name + ')');
  return out;
}

/* a spoken line: its words, its sentences, and what cannot be said at a table (the Grapes tab's rules). own is taken
   out before the signs are looked for, so Moët & Chandon may be said. */
function lineProblems(out, where, s, cap, sentences, own) {
  if (!capped(out, where, s, cap[0], cap[1])) return;
  const list = sentenceList(s);
  if (list.length < sentences[0] || list.length > sentences[1]) out.push(where + ': ' + (sentences[0] === sentences[1] ? (sentences[0] === 1 ? 'one sentence, one breath' : 'exactly ' + sentences[0] + ' sentences') : sentences[0] + ' to ' + sentences[1] + ' sentences') + ', found ' + list.length);
  if (!/[.!?]$/.test(s.trim())) out.push(where + ': ends on a full stop');
  list.forEach((sen) => {
    if (words(sen) > CAPS.lineSentenceWords) out.push(where + ': a sentence of ' + words(sen) + ' words ("' + firstWords(sen, 6) + '..."), at most ' + CAPS.lineSentenceWords + ' in a spoken line');
    if (GS.longList(sen, CAPS.lineList)) out.push(where + ': a list longer than three ("' + firstWords(sen, 6) + '..."): say three things, then stop');
  });
  if (LINE_BRACKET.test(s)) out.push(where + ': a bracket (a spoken line has none)');
  if (/;/.test(s)) out.push(where + ': a semicolon (a spoken line has none)');
  let bare = s;
  (own || []).slice().sort((a, b) => b.length - a.length).forEach((n) => { bare = bare.split(n).join(' '); });
  const ab = bare.match(GS.LINE_ABBREVIATION);
  if (ab) out.push(where + ': "' + ab[0] + '" is an abbreviation or a sign (say the words: non vintage, and)');
  const al = s.match(GS.LINE_ALCOHOL);
  if (al) out.push(where + ': a figure of alcohol ("' + al[0] + '")');
  const ja = s.match(GS.LINE_JARGON);
  if (ja) out.push(where + ': "' + ja[0] + '" is a term no guest should need explained (say what it does to the wine)');
}
/* a line names the cuvée: the plan's words, or the name the record gives the label */
function namesCuvee(text, rec, pick) { return hasPhrase(text, pick.cuvee) || (isObj(rec.cuvee) && isStr(rec.cuvee.name) && hasPhrase(text, rec.cuvee.name)); }
function namesHouse(text, pick) { return hasPhrase(text, pick.house) || FS.names(text, pick.house); }

function tableProblems(rec, pick) {
  const out = [];
  const T = rec.table;
  if (!isObj(T)) return ['table: { ' + TABLE_FIELDS.join(', ') + ' }'];
  unknown(out, T, TABLE_FIELDS, 'table', 'the table');
  missing(out, T, TABLE_FIELDS, 'table');
  const own = ownNames(rec, pick);
  TABLE_FIELDS.forEach((k) => { if (k in T) lineProblems(out, 'table.' + k, T[k], CAPS.lines[k], CAPS.lineSentences[k], own); });
  ['house45', 'house10'].forEach((k) => { if (isStr(T[k]) && T[k].trim() && !namesHouse(T[k], pick)) out.push('table.' + k + ': names the house (' + pick.house + ')'); });
  ['cuvee45', 'sale', 'cuvee10', 'cuvee20'].forEach((k) => { if (isStr(T[k]) && T[k].trim() && !namesCuvee(T[k], rec, pick)) out.push('table.' + k + ': names the cuvée (' + pick.cuvee + ')'); });
  if (isStr(T.house45) && namesHouse(T.house45, pick) && !namesHouse(firstWords(T.house45, CAPS.nameWithin.house45), pick)) out.push('table.house45: opens on the house\'s name (within its first ' + CAPS.nameWithin.house45 + ' words)');
  if (isStr(T.cuvee45) && namesCuvee(T.cuvee45, rec, pick) && !namesCuvee(firstWords(T.cuvee45, CAPS.nameWithin.cuvee45), rec, pick)) out.push('table.cuvee45: opens on the cuvée\'s name (within its first ' + CAPS.nameWithin.cuvee45 + ' words)');
  return out;
}

function guestsProblems(rec) {
  const out = [];
  if (!counted(out, 'guests', rec.guests, CAPS.guests.n[0], CAPS.guests.n[1], 'questions a guest asks')) return out;
  const seen = {};
  rec.guests.forEach((g, i) => {
    const w = 'guests[' + i + ']';
    if (!isObj(g)) { out.push(w + ': { q, a }'); return; }
    unknown(out, g, GUEST_FIELDS, w, 'a guest\'s question');
    missing(out, g, GUEST_FIELDS, w);
    if (capped(out, w + '.q', g.q, CAPS.guests.q[0], CAPS.guests.q[1])) { if (!/\?$/.test(g.q.trim())) out.push(w + '.q: a question, ending on a question mark'); if (seen[fold(g.q)]) out.push(w + '.q: the same question twice'); seen[fold(g.q)] = 1; }
    if (capped(out, w + '.a', g.a, CAPS.guests.a[0], CAPS.guests.a[1])) endsStop(out, w + '.a', g.a);
  });
  return out;
}

function trapsProblems(rec) {
  const out = [];
  if (!counted(out, 'traps', rec.traps, CAPS.traps.n[0], CAPS.traps.n[1], 'traps')) return out;
  rec.traps.forEach((t, i) => { if (capped(out, 'traps[' + i + ']', t, CAPS.traps.line[0], CAPS.traps.line[1])) endsStop(out, 'traps[' + i + ']', t); });
  return out;
}

function sheetProblems(rec, pick) {
  const out = [];
  const s = rec.sheet;
  if (!isObj(s)) return ['sheet: { prints, label, note }: what the class sheet prints and what the label prints'];
  unknown(out, s, SHEET_FIELDS, 'sheet', 'the sheet');
  missing(out, s, SHEET_FIELDS, 'sheet');
  if ('prints' in s && s.prints !== pick.sheet) out.push('sheet.prints: copied from plan.json exactly, ' + JSON.stringify(pick.sheet) + ' (the sheet as printed, spellings kept)');
  if ('label' in s && capped(out, 'sheet.label', s.label, CAPS.sheet.label[0], CAPS.sheet.label[1])) {
    if (!hasPhrase(s.label, pick.cuvee)) out.push('sheet.label: holds the label\'s words for the cuvée, "' + pick.cuvee + '"');
    if (isObj(pick.also) && pick.also.sheet && !hasPhrase(s.label, pick.also.name)) out.push('sheet.label: the sheet prints two names, so the label\'s words for the second stand here too, "' + pick.also.name + '"');
  }
  if ('note' in s && capped(out, 'sheet.note', s.note, CAPS.sheet.note[0], CAPS.sheet.note[1])) endsStop(out, 'sheet.note', s.note);
  return out;
}

function cardsProblems(rec, pick) {
  const out = [];
  if (!counted(out, 'cards', rec.cards, CAPS.cards.n, CAPS.cards.n, 'cards')) return out;
  const seen = {};
  rec.cards.forEach((c, i) => {
    const w = 'cards[' + i + ']';
    if (!isObj(c)) { out.push(w + ': { kind, front, back }'); return; }
    if ('id' in c) out.push(w + '.id: only the build mints ids');
    unknown(out, c, CARD_FIELDS, w, 'a card');
    missing(out, c, CARD_FIELDS, w);
    if (c.kind !== CARD_KINDS[i]) out.push(w + '.kind: the three cards in this order, ' + CARD_KINDS.join(', ') + ' (the house to its cuvée, the cuvée to its house, one number or term): ' + JSON.stringify(CARD_KINDS[i]) + ' here');
    const okF = capped(out, w + '.front', c.front, CAPS.cards.front[0], CAPS.cards.front[1]);
    const okB = capped(out, w + '.back', c.back, CAPS.cards.back[0], CAPS.cards.back[1]);
    if (okF) { const k = fold(c.front); if (seen[k]) out.push(w + '.front: the same cue twice'); seen[k] = 1; }
    if (!okF || !okB) return;
    if (fold(c.back) && (' ' + fold(c.front) + ' ').indexOf(' ' + fold(c.back) + ' ') >= 0) out.push(w + ': the front gives the back away');
    const frontLessCuvee = [pick.cuvee, isObj(rec.cuvee) ? rec.cuvee.name : ''].filter((n) => isStr(n) && n).sort((a, b) => b.length - a.length).reduce((t, n) => (' ' + fold(t) + ' ').split(' ' + fold(n) + ' ').join(' '), c.front);
    if (c.kind === 'house') {
      if (!namesHouse(c.front, pick)) out.push(w + '.front: the house to its cuvée: the front names the house (' + pick.house + ')');
      if (namesCuvee(c.front, rec, pick)) out.push(w + '.front: the house to its cuvée: the front does not give the cuvée (' + pick.cuvee + ')');
      if (!namesCuvee(c.back, rec, pick)) out.push(w + '.back: the house to its cuvée: the back names the cuvée as the label prints it (' + pick.cuvee + ')');
    } else if (c.kind === 'cuvee') {
      if (!namesCuvee(c.front, rec, pick)) out.push(w + '.front: the cuvée to its house: the front names the cuvée (' + pick.cuvee + ')');
      if (namesHouse(frontLessCuvee, pick)) out.push(w + '.front: the cuvée to its house: the front does not give the house (' + pick.house + ') beyond the cuvée\'s own name');
      if (!namesHouse(c.back, pick)) out.push(w + '.back: the cuvée to its house: the back names the house (' + pick.house + ')');
    } else if (c.kind === 'term') {
      if (!namesHouse(c.front + ' ' + c.back, pick) && !namesCuvee(c.front + ' ' + c.back, rec, pick)) out.push(w + ': names the house or its cuvée on one face (a card is dealt in a mixed deck)');
    }
  });
  return out;
}

function questionsProblems(rec) {
  const out = [];
  if (!counted(out, 'questions', rec.questions, CAPS.questions.n, CAPS.questions.n, 'questions')) return out;
  const stems = {};
  const tags = {};
  rec.questions.forEach((q, i) => {
    const w = 'questions[' + i + ']';
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
    if (isStr(q.exp)) { const n = words(q.exp); if (n < CAPS.questions.exp[0] || n > CAPS.questions.exp[1]) out.push(w + '.exp: ' + n + ' words, ' + CAPS.questions.exp[0] + ' to ' + CAPS.questions.exp[1] + ' (an explanation that teaches: why the key is right and why the nearest wrong answer is wrong)'); }
    if (QUESTION_TAGS.indexOf(q.tag) < 0) out.push(w + '.tag: match (the house and its cuvée), house (its history or its style) or cuvee (the wine itself)');
    else tags[q.tag] = (tags[q.tag] || 0) + 1;
  });
  if (QUESTION_TAGS.some((t) => tags[t] !== 1)) out.push('questions: one tagged match, one tagged house and one tagged cuvee');
  const fronts = (isList(rec.cards) ? rec.cards : []).map((c) => (c && isStr(c.front)) ? fold(c.front) : '');
  rec.questions.forEach((q, i) => { if (q && isStr(q.q) && fronts.indexOf(fold(q.q)) >= 0) out.push('questions[' + i + '].q: the same words as a card\'s front'); });
  return out;
}

function sourcesProblems(rec) {
  const out = [];
  if (!counted(out, 'sources', rec.sources, CAPS.sources.n[0], CAPS.sources.n[1], 'sources')) return out;
  const urls = {}; const titles = {};
  let web = 0;
  rec.sources.forEach((s, i) => {
    const w = 'sources[' + i + ']';
    if (!isObj(s)) { out.push(w + ': { title, url, kind, read }'); return; }
    unknown(out, s, SOURCE_FIELDS, w, 'a source');
    missing(out, s, SOURCE_FIELDS, w);
    capped(out, w + '.title', s.title, CAPS.sources.title[0], CAPS.sources.title[1]);
    if (isStr(s.title) && (/\bby\s+[A-Z][a-z]+\s+[A-Z]/.test(s.title) || /\b(?:ed\.|edited by|author)\b/i.test(s.title))) out.push(w + '.title: a work is cited by its publisher and title alone, never its author or editor');
    if (isStr(s.title)) { const t = fold(s.title); if (titles[t]) out.push(w + '.title: the same source twice'); titles[t] = 1; }
    if (!isStr(s.url)) out.push(w + '.url: an https address, or "" for a reference work cited by its title');
    else if (s.url) { web++; if (urls[s.url]) out.push(w + '.url: the same address twice'); urls[s.url] = 1; }
    if ('kind' in s && SOURCE_KINDS.indexOf(s.kind) < 0) out.push(w + '.kind: primary (the house\'s own pages for its own dates and methods, the Comité Champagne for the appellation\'s rules) or secondary');
    if ('read' in s && SOURCE_READS.indexOf(s.read) < 0) out.push(w + '.read: page (the page itself was read), search (a search summary drawn from that site) or book (a reference work, url "")');
    if (s.read === 'book' && isStr(s.url) && s.url) out.push(w + '.read: book is a reference work cited by its title, with url ""');
    if (s.read !== 'book' && isStr(s.url) && !s.url) out.push(w + '.url: "" only for a reference work (read: book)');
  });
  if (web < CAPS.sources.web) out.push('sources: at least ' + CAPS.sources.web + ' with an https address');
  return out;
}

function checkedProblems(rec) {
  const out = [];
  const c = rec.checked;
  if (c === undefined || c === null) return out;
  if (!isObj(c)) return ['checked: null, or the refuter\'s { ' + CHECKED_FIELDS.join(', ') + ' }'];
  unknown(out, c, CHECKED_FIELDS, 'checked', 'the check');
  missing(out, c, CHECKED_FIELDS, 'checked');
  if ('date' in c && (!isStr(c.date) || !/^\d{4}-\d{2}-\d{2}$/.test(c.date))) out.push('checked.date: YYYY-MM-DD');
  if ('by' in c && c.by !== 'refuter') out.push('checked.by: refuter');
  if ('verdict' in c && VERDICTS.indexOf(c.verdict) < 0) out.push('checked.verdict: sound (nothing changed) or changed (what changed is listed)');
  ['changed', 'open'].forEach((k) => { if (k in c && (!isList(c[k]) || c[k].some((x) => !isStr(x) || !x.trim()))) out.push('checked.' + k + ': a list of sentences ([] for none)'); });
  if (c.verdict === 'changed' && isList(c.changed) && !c.changed.length) out.push('checked.changed: a changed verdict lists what changed');
  if (c.verdict === 'sound' && isList(c.changed) && c.changed.length) out.push('checked.verdict: changed, since changes are listed');
  return out;
}

/* the reading words of a record: what its page shows above the cards, the questions and the sources */
function readingWords(rec) {
  let n = 0;
  if (!isObj(rec)) return 0;
  const add = (v) => { if (isStr(v)) n += words(v); };
  add(rec.place); add(rec.story);
  if (isObj(rec.founded)) add(rec.founded.what);
  if (isObj(rec.kind)) add(rec.kind.means);
  if (isObj(rec.style)) { ['line', 'grapes'].concat(STYLE_OPTIONAL).forEach((k) => add(rec.style[k])); if (isObj(rec.style.nv)) { add(rec.style.nv.name); add(rec.style.nv.note); } }
  if (isObj(rec.cuvee)) {
    ['name', 'rhythm', 'blend', 'sites', 'making', 'lees', 'bottle', 'young', 'aged', 'serve'].forEach((k) => add(rec.cuvee[k]));
    if (isObj(rec.cuvee.first)) add(rec.cuvee.first.what);
    (isList(rec.cuvee.forms) ? rec.cuvee.forms : []).forEach((x) => { if (x) { add(x.name); add(x.note); } });
  }
  if (isObj(rec.also)) { add(rec.also.name); add(rec.also.note); add(rec.also.line); if (isObj(rec.also.first)) add(rec.also.first.what); }
  if (isObj(rec.table)) TABLE_FIELDS.forEach((k) => add(rec.table[k]));
  (isList(rec.guests) ? rec.guests : []).forEach((g) => { if (g) { add(g.q); add(g.a); } });
  (isList(rec.traps) ? rec.traps : []).forEach(add);
  if (isObj(rec.sheet)) { add(rec.sheet.label); add(rec.sheet.note); }
  return n;
}

/* one record: a house's fragment */
function validateRecord(rec, plan, opts) {
  const o = opts || {};
  const out = people().problems.slice();
  if (!isObj(rec)) return out.concat(['fragment: one object, the house\'s record']);
  const pick = isStr(rec.key) ? pickOf(plan, rec.key) : null;
  if (!pick) return out.concat(['key: ' + JSON.stringify(rec.key) + ' is no house of plan.json']);
  if (o.key && rec.key !== o.key) out.push('key: the fragment ' + o.key + '.json holds the record of ' + o.key + ' (found ' + rec.key + ')');
  const f = o.facts || facts(o.jsDir);
  const needed = FIELDS.filter((k) => k !== 'also' || isObj(pick.also));
  missing(out, rec, needed, '');
  unknown(out, rec, FIELDS.concat(PROVENANCE), '', 'a record');
  COPIED.forEach((k) => { if (k in rec && rec[k] !== pick[k]) out.push(k + ': copied from plan.json exactly, ' + JSON.stringify(pick[k])); });
  if ('id' in rec) out.push('id: only the build mints ids');
  if ('say' in rec) sayProblems(rec.say, 'say').forEach((p) => out.push(p));
  if ('founded' in rec) foundedProblems(rec, pick, f).forEach((p) => out.push(p));
  if ('place' in rec) capped(out, 'place', rec.place, CAPS.place[0], CAPS.place[1]);
  if ('kind' in rec) kindProblems(rec).forEach((p) => out.push(p));
  if ('story' in rec && capped(out, 'story', rec.story, CAPS.story[0], CAPS.story[1])) {
    endsStop(out, 'story', rec.story);
    const years = (rec.story.match(/\b1\d{3}\b|\b20[0-2]\d\b/g) || []);
    if (new Set(years).size < CAPS.storyYears) out.push('story: at least ' + CAPS.storyYears + ' dated turning points (the founding, a widow, a war, a sale told with its year, the first vintage of the cuvée)');
  }
  if ('style' in rec) styleProblems(rec).forEach((p) => out.push(p));
  if ('cuvee' in rec) cuveeProblems(rec, pick).forEach((p) => out.push(p));
  alsoProblems(rec, pick).forEach((p) => out.push(p));
  if ('table' in rec) tableProblems(rec, pick).forEach((p) => out.push(p));
  if ('guests' in rec) guestsProblems(rec).forEach((p) => out.push(p));
  if ('traps' in rec) trapsProblems(rec).forEach((p) => out.push(p));
  if ('sheet' in rec) sheetProblems(rec, pick).forEach((p) => out.push(p));
  if ('cards' in rec) cardsProblems(rec, pick).forEach((p) => out.push(p));
  if ('questions' in rec) questionsProblems(rec).forEach((p) => out.push(p));
  if ('sources' in rec) sourcesProblems(rec).forEach((p) => out.push(p));
  if (rec.report !== undefined && (!isList(rec.report) || rec.report.length > CAPS.report || rec.report.some((x) => !isStr(x) || !x.trim()))) out.push('report: a list of at most ' + CAPS.report + ' sentences when present (facts left out, tensions with the Codex\'s published records)');
  checkedProblems(rec).forEach((p) => out.push(p));
  const total = readingWords(rec);
  if (total > CAPS.entry) out.push('record: ' + total + ' reading words, at most ' + CAPS.entry);
  voiceProblems(rec, pick).forEach((p) => out.push(p));
  return out;
}

/* what a second reader should look at: never a failure */
function adviseRecord(rec, plan) {
  const out = [];
  if (!isObj(rec)) return out;
  const pick = isStr(rec.key) ? pickOf(plan, rec.key) : null;
  const own = ownNames(rec, pick);
  CF.walkStrings(rec, '', (s, at) => {
    const where = at.replace(/^\./, '');
    if (pathKind(where) !== 'prose') return;
    sentenceList(s).forEach((sen) => {
      const bare = own.reduce((t, n) => t.split(n).join(' '), sen);
      if (TITLED.test(bare) && !/\b1\d{3}\b|\b20[0-2]\d\b/.test(bare)) out.push(where + ': "' + bare.match(TITLED)[0] + '..." names a titled person with no date in the sentence: the long dead carry their dates once in the story, the living are never named');
    });
    const e = s.match(EST);
    /* a first vintage and a first release are this tab's daily bread, each dated in cuvee.first: no note for those */
    if (e && !/^the\s+first\s+(?:vintage|release)\b/i.test(e[0])) out.push(where + ': "' + e[0] + '" is a claim of rank or of a first: two sources, or cut it');
    /* a still wine is a wine without bubbles, not a word of the present */
    const nw = s.replace(/\bstill\s+(?:red|white|ros[eé]|wines?)\b/gi, ' ').match(NOW);
    if (nw) out.push(where + ': "' + nw[0] + '" speaks of the present: keep only what will not age');
    if (/^table\./.test(where) || where === 'also.line') { const soft = s.match(GS.LINE_JARGON_SOFT); if (soft && !/^cuv[eé]e$/i.test(soft[0])) out.push(where + ': "' + soft[0] + '" is a cellar word in a spoken line: fine when the same breath says what it does'); }
  });
  if (pick && sheetDiffers(pick) && isList(rec.traps) && isObj(rec.sheet) && !rec.traps.some((t) => isStr(t) && /\bsheet\b/i.test(t))) out.push('traps: the class sheet prints ' + JSON.stringify(pick.sheet) + ' and the label ' + JSON.stringify(pick.cuvee) + ': a trap on the difference helps where a guest or an examiner would stumble on it');
  if (isObj(rec.kind) && rec.kind.code === '') out.push('kind.code: the letters on the label were not sourced: the report should say so');
  if (isObj(rec.style)) STYLE_OPTIONAL.filter((k) => rec.style[k] === '').forEach((k) => out.push('style.' + k + ': left empty: the report should say the house does not state it'));
  if (rec.checked === undefined || rec.checked === null) out.push('checked: not yet checked by a refuter (the whole build refuses an unchecked record)');
  else if (isObj(rec.checked) && isList(rec.checked.open) && rec.checked.open.length) out.push('checked.open: ' + rec.checked.open.length + ' question(s) left open for the integrator');
  if (isList(rec.sources) && !rec.sources.some((s) => s && s.kind === 'primary')) out.push('sources: no primary source: every fact then needs two independent secondary ones');
  out.push('record: ' + readingWords(rec) + ' reading words of ' + CAPS.entry);
  return out;
}

/* The plan itself. f, when given, is facts(jsDir): every producerId and cuveeId a record of WINE_PRODUCERS, every
   pick a record of the Champagne group of Producers and flagships whose library id is the same. The 23 houses are
   the sheet's, in the sheet's order, each with the sheet's own wording; each sits in the chunk CHUNK_OF names. */
function planProblems(plan, f) {
  const out = people().problems.slice();
  if (!isObj(plan) || !isList(plan.houses)) return out.concat(['plan.json: { houses: [...] }']);
  if (plan.prefix !== ID_PREFIX) out.push('plan.prefix: ' + ID_PREFIX);
  if (JSON.stringify(plan.chunks) !== JSON.stringify(CHUNKS)) out.push('plan.chunks: ' + CHUNKS.join(', '));
  if (!isStr(plan.edition) || !/^\d{4}-\d{2}-\d{2}$/.test(plan.edition)) out.push('plan.edition: a date, YYYY-MM-DD');
  if (plan.houses.length !== HOUSES) out.push('plan.houses: the sheet\'s ' + HOUSES + ' houses, never more or fewer (' + plan.houses.length + ')');
  const keys = {}; const ids = {};
  plan.houses.forEach((p, i) => {
    const at = 'plan.houses[' + i + '] ' + JSON.stringify(p && p.key);
    if (!isObj(p)) { out.push(at + ': an object'); return; }
    unknown(out, p, PICK_FIELDS, at, 'a house');
    PICK_NEEDS.filter((k) => !(k in p)).forEach((k) => out.push(at + '.' + k + ': missing'));
    if (!isStr(p.key) || !KEY_RE.test(p.key)) out.push(at + '.key: lower case words and hyphens');
    if (keys[p.key]) out.push(at + '.key: twice in the plan (a key seeds the record\'s frozen id)'); keys[p.key] = 1;
    const row = SHEET[i];
    if (row) {
      if (p.house !== row[0]) out.push(at + '.house: the sheet\'s row ' + (i + 1) + ' is ' + JSON.stringify(row[0]) + ' (the sheet\'s order is the plan\'s)');
      if (p.sheet !== row[1]) out.push(at + '.sheet: the sheet prints ' + JSON.stringify(row[1]) + ' for ' + row[0] + ', spellings kept');
    }
    if (!isStr(p.cuvee) || !p.cuvee.trim()) out.push(at + '.cuvee: the prestige cuvée as the label prints it');
    if ('also' in p) {
      if (!isObj(p.also)) out.push(at + '.also: { name, sheet, standing }');
      else {
        unknown(out, p.also, ALSO_PLAN_FIELDS, at + '.also', 'a second cuvée');
        ALSO_PLAN_FIELDS.filter((k) => !(k in p.also)).forEach((k) => out.push(at + '.also.' + k + ': missing'));
        if (!isStr(p.also.name) || !p.also.name.trim()) out.push(at + '.also.name: the second cuvée as the label prints it');
        if (!isStr(p.also.sheet)) out.push(at + '.also.sheet: what the sheet prints for it, or "" where the sheet does not print it');
        else if (p.also.sheet && isStr(p.sheet) && p.sheet.indexOf(p.also.sheet) < 0) out.push(at + '.also.sheet: ' + JSON.stringify(p.also.sheet) + ' is not in the sheet\'s row, ' + JSON.stringify(p.sheet));
        if (STANDINGS.indexOf(p.also.standing) < 0) out.push(at + '.also.standing: one of ' + STANDINGS.join(', '));
        if (isStr(p.also.name) && isStr(p.cuvee) && fold(p.also.name) === fold(p.cuvee)) out.push(at + '.also.name: the cuvée itself');
      }
    }
    const chunk = CHUNKS.find((c) => CHUNK_OF[c].indexOf(p.key) >= 0);
    if (!chunk) out.push(at + '.key: in no chunk of the schema (CHUNK_OF)');
    else if (p.chunk !== chunk) out.push(at + '.chunk: ' + chunk);
    ['producerId', 'cuveeId'].forEach((k) => {
      if (!isStr(p[k])) { out.push(at + '.' + k + ': a WINE_PRODUCERS id, or ""'); return; }
      if (!p[k]) return;
      if (ids[p[k]]) out.push(at + '.' + k + ': ' + p[k] + ' is ' + ids[p[k]] + '\'s too'); ids[p[k]] = p.key;
      if (f && Object.keys(f.producers).length && !f.producers[p[k]]) out.push(at + '.' + k + ': ' + p[k] + ' is no record of WINE_PRODUCERS');
    });
    if (!isStr(p.pick)) out.push(at + '.pick: the key of the house\'s record in Producers and flagships, or ""');
    else if (p.pick && f && Object.keys(f.picks).length) {
      const fp = f.picks[p.pick];
      if (!fp) out.push(at + '.pick: ' + p.pick + ' is no pick of the Champagne group of .scripts/flagships/plan.json');
      else if (fp.producerId !== p.producerId) out.push(at + '.pick: the flagships pick ' + p.pick + ' is ' + fp.producerId + ', not ' + p.producerId);
    }
    if (!isStr(p.why) || words(p.why) < 8) out.push(at + '.why: one line, eight words or more');
    if (!isStr(p.note) || words(p.note) < 8) out.push(at + '.note: what the author must settle, eight words or more');
    [p.house, p.cuvee, p.why, p.note, isObj(p.also) ? p.also.name : ''].forEach((s) => { if (isStr(s)) CMS.dashProblems(s, at).forEach((x) => out.push(x)); });
    [p.why, p.note].forEach((s) => {
      if (!isStr(s)) return;
      const j = s.match(FS.JUDGE); if (j) out.push(at + ': "' + j[0] + '" judges or ranks');
      const lv = livingIn(s, [p.house, p.cuvee, isObj(p.also) ? p.also.name : '']); if (lv.length) out.push(at + ': names a living person (' + lv.join(', ') + ')');
      CMS.americanProblems(s, at).forEach((x) => out.push(x));
      CF.voiceProblems(s, at).filter((x) => /retired word/.test(x)).forEach((x) => out.push(x));
    });
  });
  if (f && Object.keys(f.picks).length) Object.keys(f.picks).forEach((k) => { const fp = f.picks[k]; const mine = plan.houses.find((p) => isObj(p) && p.producerId && p.producerId === fp.producerId); if (mine && mine.pick !== k) out.push('plan: ' + mine.key + ' is ' + fp.producerId + ', which Producers and flagships holds as ' + k + ': its pick is ' + JSON.stringify(k)); });
  return out;
}

/* --test: the rules proved on the pilots. Each fault is seeded into a sound pilot and must be refused by a problem
   that holds the words given; a fault that passes, or a pilot that is not sound to begin with, fails the test. */
function selfTest() {
  const out = [];
  const plan = loadPlan();
  const load = (k) => { const p = path.join(DIR, 'fragments', k + '.json'); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null; };
  const pilots = { ayala: load('ayala'), bollinger: load('bollinger') };
  Object.keys(pilots).forEach((k) => {
    if (!pilots[k]) { out.push('the pilot fragments/' + k + '.json is not written: the test needs both pilots'); return; }
    const p = validateRecord(pilots[k], plan, { key: k });
    if (p.length) out.push('the pilot ' + k + ' is not sound (' + p.length + ' problems, the first: ' + p[0] + ')');
  });
  if (out.length) return { problems: out, run: 0 };
  const living = people().names[0];
  const FAULTS = [
    ['a dash in the story', 'ayala', (r) => { r.story = r.story.replace('. ', ' — '); }, 'story: '],
    ['a spaced hyphen in a trap', 'ayala', (r) => { r.traps[0] = r.traps[0].replace(/, | /, ' - '); }, 'traps[0]: a hyphen standing alone'],
    ['a living name in a spoken line', 'ayala', (r) => { r.table.house10 = r.table.house10.replace(/\.$/, ', says ' + living + '.'); }, 'table.house10: names a living person'],
    ['a living name in an address', 'ayala', (r) => { r.sources[0].url = 'https://example.org/' + fold(living).split(' ').join('-'); }, 'sources[0].url: the address names a living person'],
    ['the retired word', 'ayala', (r) => { r.guests[0].a = 'In ' + 'pract' + 'ice it is the same wine. ' + r.guests[0].a; }, 'guests[0].a'],
    ['a price', 'ayala', (r) => { r.cuvee.aged = r.cuvee.aged.replace(/\.$/, ', and it is not cheap.'); }, 'talks price'],
    ['a superlative', 'bollinger', (r) => { r.style.line = 'The finest house of Aÿ. ' + r.style.line; }, 'judges or ranks'],
    ['a score', 'bollinger', (r) => { r.cuvee.aged = r.cuvee.aged.replace(/\.$/, ', rated 98 points.'); }, 'is a score'],
    ['a present owner', 'ayala', (r) => { r.story = r.story.replace(/\.$/, ', and it is owned by the same family.'); }, 'is volatile'],
    ['a per cent sign', 'ayala', (r) => { r.cuvee.blend = '80% Chardonnay. ' + r.cuvee.blend; }, 'a per cent sign'],
    ['American spelling', 'ayala', (r) => { r.cuvee.young = r.cuvee.young.replace(/\.$/, ', a bright color.'); }, 'cuvee.young'],
    ['the house where the owner works', 'ayala', (r) => { r.sheet.note = 'Brennan\'s sheet prints two names. ' + r.sheet.note; }, 'names the house where the owner works'],
    ['the sheet corrected', 'bollinger', (r) => { r.sheet.prints = 'La Grande Année'; }, 'sheet.prints: copied from plan.json exactly'],
    ['another cuvée on the label', 'bollinger', (r) => { r.cuvee.name = 'Special Cuvée'; }, 'cuvee.name: holds the plan\'s words'],
    ['a house line too short', 'ayala', (r) => { r.table.house45 = sentenceList(r.table.house45).slice(0, 3).join(' '); }, 'table.house45: '],
    ['a sale of three sentences', 'ayala', (r) => { r.table.sale = r.table.sale + ' Shall I pour it?'; }, 'table.sale: exactly 2 sentences'],
    ['a sign in a spoken line', 'ayala', (r) => { r.table.cuvee10 = r.table.cuvee10.replace(/\.$/, ' & more.'); }, 'is an abbreviation or a sign'],
    ['a bracket in a spoken line', 'bollinger', (r) => { r.table.cuvee20 = r.table.cuvee20.replace(/\.$/, ' (a vintage wine).'); }, 'a bracket'],
    ['a line that does not name the cuvée', 'bollinger', (r) => { r.table.cuvee10 = 'The vintage wine of the house is fermented in old oak barrels and aged under cork.'; }, 'table.cuvee10: names the cuvée'],
    ['the cards out of order', 'ayala', (r) => { r.cards = [r.cards[1], r.cards[0], r.cards[2]]; }, 'cards[0].kind'],
    ['a house card that gives the cuvée', 'bollinger', (r) => { r.cards[0].front = 'Bollinger and La Grande Année: which is the house?'; }, 'cards[0].front: the house to its cuvée: the front does not give the cuvée'],
    ['a tag twice', 'ayala', (r) => { r.questions[2].tag = r.questions[1].tag; }, 'questions: one tagged match'],
    ['an id written by hand', 'ayala', (r) => { r.cards[0].id = 'hc-00000000'; }, 'only the build mints ids'],
    ['the founding year against the library', 'bollinger', (r) => { r.founded.year = '1830'; }, 'founded.year: the library'],
    ['no temperature in the service', 'ayala', (r) => { r.cuvee.serve = 'Serve it cool, no need to decant, in a tulip glass rather than a flute.'; }, 'cuvee.serve: the temperature'],
    ['a figure in the young glass', 'ayala', (r) => { r.cuvee.young = '3 notes: ' + r.cuvee.young; }, 'cuvee.young: in words'],
    ['a bare family word in the glass', 'bollinger', (r) => { r.cuvee.young = 'Citrus, spice and oak. ' + r.cuvee.young; }, 'stands alone'],
    ['the second cuvée left out', 'ayala', (r) => { delete r.also; }, 'also: missing'],
    ['a second cuvée the plan does not give', 'bollinger', (r) => { r.also = JSON.parse(JSON.stringify(pilots.ayala.also)); }, 'also: the plan gives Bollinger no second cuvée'],
    ['a story with one date', 'ayala', (r) => { let seen = false; r.story = r.story.replace(/\b(?:1\d{3}|20[0-2]\d)\b/g, (m) => { if (!seen) { seen = true; return m; } return 'that year'; }); }, 'story: at least'],
    ['a kind the appellation does not have', 'ayala', (r) => { r.kind.code = 'XX'; }, 'kind.code'],
    ['two sources only', 'bollinger', (r) => { r.sources = r.sources.slice(0, 2); }, 'sources: 3 to 10'],
    ['a copied field changed', 'bollinger', (r) => { r.pick = ''; }, 'pick: copied from plan.json exactly'],
    ['a checker who is not the refuter', 'ayala', (r) => { r.checked = { date: '2026-11-22', by: 'author', verdict: 'sound', changed: [], open: [] }; }, 'checked.by: refuter']
  ];
  FAULTS.forEach((x) => {
    const rec = JSON.parse(JSON.stringify(pilots[x[1]]));
    try { x[2](rec); } catch (e) { out.push(x[0] + ': the fault could not be seeded (' + e.message + ')'); return; }
    if (JSON.stringify(rec) === JSON.stringify(pilots[x[1]])) { out.push(x[0] + ': the fault changed nothing in ' + x[1]); return; }
    const got = validateRecord(rec, plan, { key: x[1] });
    if (!got.some((p) => p.indexOf(x[3]) >= 0)) out.push(x[0] + ': not refused by a problem holding "' + x[3] + '" (' + (got.length ? got[0] : 'no problem at all') + ')');
  });
  /* the plan's own rules */
  const planFaults = [
    ['the sheet corrected in the plan', (p) => { pickOf(p, 'bollinger').sheet = 'La Grande Année'; }, 'the sheet prints'],
    ['a house out of the sheet\'s order', (p) => { const a = p.houses[0]; p.houses[0] = p.houses[1]; p.houses[1] = a; }, 'the sheet\'s row'],
    ['a house in another chunk', (p) => { pickOf(p, 'krug').chunk = 'h1'; }, '.chunk: h3'],
    ['a producerId the library does not hold', (p) => { pickOf(p, 'krug').producerId = 'p-nobody'; }, 'is no record of WINE_PRODUCERS'],
    ['a flagships pick dropped', (p) => { pickOf(p, 'krug').pick = ''; }, 'which Producers and flagships holds as krug'],
    ['a house lost', (p) => { p.houses.pop(); }, 'never more or fewer']
  ];
  const f = facts();
  const base = planProblems(plan, f);
  if (base.length) out.push('plan.json is not sound (' + base[0] + ')');
  planFaults.forEach((x) => {
    const p = JSON.parse(JSON.stringify(plan));
    x[1](p);
    const got = planProblems(p, f);
    if (!got.some((g) => g.indexOf(x[2]) >= 0)) out.push(x[0] + ': not refused by a problem holding "' + x[2] + '" (' + (got.length ? got[0] : 'no problem at all') + ')');
  });
  return { problems: out, run: FAULTS.length + planFaults.length };
}

module.exports = {
  validateRecord, adviseRecord, planProblems, selfTest, loadPlan, roster, pickOf, indexOf, sheetDiffers, facts, people, livingIn, ownNames,
  readingWords, words, fold, hasPhrase, sentenceList, voiceProblems, tastePath, pathKind, namesCuvee, namesHouse,
  SHEET, HOUSES, CHUNKS, CHUNK_OF, PICK_FIELDS, ALSO_PLAN_FIELDS, STANDINGS, ID_PREFIX, ID_RE, KEY_RE,
  CAPS, FIELDS, PROVENANCE, COPIED, DATED_FIELDS, KIND_FIELDS, KINDS, STYLE_FIELDS, STYLE_OPTIONAL, STYLE_STATED, NV_FIELDS, CUVEE_FIELDS, CUVEE_KINDS, ALSO_FIELDS,
  TABLE_FIELDS, GUEST_FIELDS, SHEET_FIELDS, CARD_FIELDS, CARD_KINDS, QUESTION_FIELDS, QUESTION_TAGS, SOURCE_FIELDS, SOURCE_KINDS, SOURCE_READS, CHECKED_FIELDS, VERDICTS,
  DIR, ROOT, JS_DIR
};

if (require.main === module) {
  const arg = process.argv[2];
  if (arg === '--test') {
    const r = selfTest();
    r.problems.forEach((p) => console.log('schema --test: ' + p));
    console.log(r.problems.length ? 'schema --test: FAILED (' + r.problems.length + ')' : 'schema --test: the two pilots are sound and ' + r.run + ' seeded faults are each refused by the rule that names it');
    process.exit(r.problems.length ? 1 : 0);
  }
  if (arg !== '--caps') { console.log('usage: node .scripts/champagne/schema.cjs --caps   (the caps; the validator is required by build-champagne.cjs)\n       node .scripts/champagne/schema.cjs --test   (the rules proved on the pilots)'); process.exit(arg === '--help' || arg === '-h' ? 0 : 2); }
  const pair = (p) => (Array.isArray(p) ? (p[0] === p[1] ? 'exactly ' + p[0] : (p[0] ? p[0] + ' to ' + p[1] : 'at most ' + p[1])) : 'at most ' + p);
  const sen = (k) => { const p = CAPS.lineSentences[k]; return p[0] === p[1] ? (p[0] === 1 ? 'one sentence' : 'exactly ' + p[0] + ' sentences') : p[0] + ' to ' + p[1] + ' sentences'; };
  const rows = [
    ['key, house, producerId, cuveeId, pick', 'copied from plan.json exactly'],
    ['say', pair(CAPS.say) + ' words: a respelling of the house where a guest would stumble, else ""'],
    ['founded', '{ year, what }: a year in figures or "", and what it is the year of in ' + pair(CAPS.dated) + ' words'],
    ['place', pair(CAPS.place) + ' words: the village and the part of Champagne'],
    ['kind', '{ code, means }: ' + Object.keys(KINDS).join(', ') + ' or "", and ' + pair(CAPS.kindMeans) + ' words saying the term and what it means of this house'],
    ['story', pair(CAPS.story) + ' words, at least ' + CAPS.storyYears + ' dated turning points, ownership as dated history'],
    ['style.line', pair(CAPS.style.line) + ' words: the house style and where it comes from'],
    ['style.grapes', pair(CAPS.style.grapes) + ' words: the grapes and their sources'],
    ['style.reserve, vessels, malolactic, lees, dosage', 'at most ' + CAPS.style.reserve[1] + ', ' + CAPS.style.vessels[1] + ', ' + CAPS.style.malolactic[1] + ', ' + CAPS.style.lees[1] + ' and ' + CAPS.style.dosage[1] + ' words, as the house states them; "" where it does not, at least ' + STYLE_STATED + ' of the five stated'],
    ['style.nv', '{ name, note }: the non vintage wine a guest knows the house by, name ' + pair(CAPS.style.nvName) + ' words ("" where it makes none), note ' + pair(CAPS.style.nvNote)],
    ['cuvee.name', pair(CAPS.cuvee.name) + ' words, holding the plan\'s words for the cuvée as the label prints them'],
    ['cuvee.say', pair(CAPS.say) + ' words, else ""'],
    ['cuvee.first', '{ year, what }: the first vintage or first release, and which the year is, in ' + pair(CAPS.dated) + ' words'],
    ['cuvee.kind', CUVEE_KINDS.join(', ')],
    ['cuvee.rhythm', pair(CAPS.cuvee.rhythm) + ' words: how often it has been made, as history'],
    ['cuvee.blend', pair(CAPS.cuvee.blend) + ' words: the grapes in words, no per cent sign'],
    ['cuvee.sites', pair(CAPS.cuvee.sites) + ' words: the villages or the single vineyard'],
    ['cuvee.making', pair(CAPS.cuvee.making) + ' words'],
    ['cuvee.lees', pair(CAPS.cuvee.lees) + ' words: the time on its lees'],
    ['cuvee.bottle', pair(CAPS.cuvee.bottle) + ' words, "" where the bottle has no story'],
    ['cuvee.young', pair(CAPS.cuvee.young) + ' words, named things, no figure, no bare family word'],
    ['cuvee.aged', pair(CAPS.cuvee.aged) + ' words: how it tastes with age'],
    ['cuvee.forms', pair(CAPS.forms.n) + ' { name, note }: a rosé, a late disgorged release; name ' + pair(CAPS.forms.name) + ', note ' + pair(CAPS.forms.note) + ' words'],
    ['cuvee.serve', pair(CAPS.cuvee.serve) + ' words: degrees Celsius in figures within ' + CAPS.serveDegrees[0] + ' to ' + CAPS.serveDegrees[1] + ', decant or not, the glass'],
    ['also', 'only where the plan gives a second cuvée: { name, say, standing, first, note, line }, note ' + pair(CAPS.also.note) + ' words, line ' + pair(CAPS.also.line) + ' words in one sentence naming it'],
    ['table.house45', pair(CAPS.lines.house45) + ' words, ' + sen('house45') + ', opening on the house\'s name'],
    ['table.house10', pair(CAPS.lines.house10) + ' words, ' + sen('house10') + ', naming the house'],
    ['table.cuvee45', pair(CAPS.lines.cuvee45) + ' words, ' + sen('cuvee45') + ', opening on the cuvée\'s name'],
    ['table.sale', pair(CAPS.lines.sale) + ' words, ' + sen('sale') + ', naming the cuvée'],
    ['table.cuvee10', pair(CAPS.lines.cuvee10) + ' words, ' + sen('cuvee10') + ', naming the cuvée'],
    ['table.cuvee20', pair(CAPS.lines.cuvee20) + ' words, ' + sen('cuvee20') + ', naming the cuvée'],
    ['a spoken line', 'no sentence over ' + CAPS.lineSentenceWords + ' words, no list longer than ' + CAPS.lineList + ', no bracket, semicolon, abbreviation or sign'],
    ['guests', pair(CAPS.guests.n) + ' { q, a }: q ' + pair(CAPS.guests.q) + ' words ending on a question mark, a ' + pair(CAPS.guests.a)],
    ['traps', pair(CAPS.traps.n) + ', each ' + pair(CAPS.traps.line) + ' words'],
    ['sheet', '{ prints, label, note }: prints copied from the plan, label ' + pair(CAPS.sheet.label) + ' words holding the cuvée, note ' + pair(CAPS.sheet.note)],
    ['cards', 'exactly ' + CAPS.cards.n + ', kind ' + CARD_KINDS.join(', ') + ' in that order, front ' + pair(CAPS.cards.front) + ', back ' + pair(CAPS.cards.back) + ' words'],
    ['questions', 'exactly ' + CAPS.questions.n + ' (tagged ' + QUESTION_TAGS.join(', ') + ', one each), four options, stem ' + pair(CAPS.questions.stem) + ', an option at most ' + CAPS.questions.option[1] + ', exp ' + pair(CAPS.questions.exp) + ' words'],
    ['sources', pair(CAPS.sources.n) + ', title ' + pair(CAPS.sources.title) + ' words, kind primary or secondary, read page, search or book, at least ' + CAPS.sources.web + ' https address'],
    ['report', 'at most ' + CAPS.report + ' sentences, never shipped'],
    ['checked', '{ date, by: refuter, verdict: sound or changed, changed: [], open: [] }, never shipped; the whole build needs it'],
    ['entry', 'at most ' + CAPS.entry + ' reading words']
  ];
  rows.forEach((r) => console.log(r[0] + ': ' + r[1]));
  process.exit(0);
}
