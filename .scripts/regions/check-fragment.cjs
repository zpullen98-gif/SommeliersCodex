#!/usr/bin/env node
/* check-fragment: proves one regions fragment against .scripts/regions/schema.json.
   Usage: node .scripts/regions/check-fragment.cjs <fragment.json> [jsDir]
   Exits 1 with every problem named (file, path, rule). Exported for check-regions.js, build-regions.cjs,
   apply-roster.cjs and apply-videos.cjs.

   THE ATLAS IN DEPTH (22 October 2026). The rules follow BRIEF-DEEP.md, and every new name comes from
   roster.cjs. A fragment is one of four kinds:
     <sheet>.json, <sheet>.<n>.json  the articles of an atlas sheet (or a part of one) and its country;
     <sheet>.more[.<n>].json         { sheet, more: true, regions, aliases?, terroirRows?, cats? }: the roster's
                                     articles off the map for that sheet (all, or some), in roster order, each
                                     with mapless: 1 and no index, always deepened, no country and no part;
     mapless.json, mapless.<n>.json  the map-less countries (fourteen keys; the seven new ones deepened);
     techniques.<n>.json             { techniques: [...] }: the companion's technique records.
   A record is DEEPENED when it carries a deeper list. A record that is not keeps one prose total and the
   first edition's minimums; a deepened one splits its prose into the Certified reading and the deeper
   reading, and the deepened minimums apply (CAPS below, the one statement of every limit). Every record
   may carry techniques (roster slugs; a deepened one carries its MUST_LINK), up to two videos and a
   watchSearch. A source url and a video's url and id are not prose: the spelling rules skip them and
   urlProblems holds them instead (no dash and nothing at or above U+2190 there either). Superlatives are a
   note, never a failure (superlativeNotes). */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROSTER = require(path.join(__dirname, 'roster.cjs'));

const SHEETS = ['france', 'italy', 'spain', 'portugal', 'germany', 'austria', 'california', 'oregon', 'washington', 'new-york', 'argentina', 'chile', 'australia', 'new-zealand', 'south-africa', 'hungary', 'greece'];
/* The seven map-less countries of the first edition, then the roster's seven new ones (written deepened from the start). */
const MAPLESS_FIRST = ['canada', 'england', 'switzerland', 'eastern-europe', 'lebanon', 'uruguay', 'mexico'];
const NEW_MAPLESS_KEYS = ROSTER.NEW_MAPLESS.map((c) => c.key);
const MAPLESS = MAPLESS_FIRST.concat(NEW_MAPLESS_KEYS);
const LEVELS = ['intro', 'certified', 'advanced', 'master'];
const COUNTRY_KEYS = SHEETS.concat(MAPLESS);
const COUNTRY_WORDS = ['france', 'italy', 'spain', 'portugal', 'germany', 'austria', 'argentina', 'chile', 'australia', 'new zealand', 'south africa', 'hungary', 'greece', 'united states', 'canada', 'england', 'switzerland', 'lebanon', 'uruguay', 'mexico', 'israel', 'japan', 'china', 'georgia', 'brazil', 'turkey', 'turkiye', 'cyprus'];
/* The four United States sheets are country keys to the join as well (JOIN.countryGroup makes them one country), so
   an alias to an article may not name one either: "shenandoah valley california" sent to an article would capture the
   house's bare "California" by containment (measured on the roster, 23 October 2026). */
const SHEET_WORDS = ['california', 'oregon', 'washington', 'new york'];
const ROLES = ['lead', 'blending', 'minor', 'rising'];
const COLOURS = ['white', 'red', 'rose', 'sparkling', 'sweet', 'fortified', 'orange'];
const DEPTHS = ['advanced', 'master'];
/* American spellings the house refuses in its own prose (the wine's printed name is exempt nowhere: write it as the label does only inside wines[].style) */
const AMERICAN = /\b(colou?rs?|flavor(s|ed|ful|ing)?|centers?|aging|liters?|meters?|gray|molds?|favorites?|honors?|labor|neighbors?|organiz(e|es|ed|ing|ation)|characteriz(e|es|ed|ing)|recogniz(e|es|ed|ing)|minimiz(e|es|ed|ing)|maximiz(e|es|ed|ing)|realiz(e|es|ed|ing)|emphasiz(e|es|ed|ing)|specializ(e|es|ed|ing)|stabiliz(e|es|ed|ing)|oxidiz(e|es|ed|ing)|sulfur|sulfite(s)?|caliber|defense|catalog|plow(ed|ing)?|traveled|labeled|modeling|canceled|fulfill|skillful|specialty|harbors?|vapors?|vigor|rumors?|savor(y|ed)?|armor|endeavors?|programs?|humor)\b/;
const AMERICAN_OK = /\bcolou?r/; /* colour and colours are British; the regex above matches color only through the optional u, so filter it */
/* Two American forms that only prose refuses: an accept list still takes "85 percent" and "toward" so the grader
   marks either spelling right, so these are checked on every string but those of an accept list (proseProblems). */
const AMERICAN_PROSE = /\b(percent|toward)\b/i;
const ACCEPT_PATH = /\.accept\[\d+\]$/;
/* The URL exemption: a source's url and a video's url and id keep the publisher's spelling and are no prose, so the
   spelling and prose rules skip them and urlProblems holds them instead, the dash and glyph rules included
   (check-regions blanks them in its raw sweeps and proves them here, record by record). */
const URL_PATH = /\.sources\[\d+\]\.url$|\.videos\[\d+\]\.(url|id)$/;
const VIDEO_ID_RE = /^[A-Za-z0-9_-]{11}$/;
const VIDEO_URL = 'https://www.youtube.com/watch?v=';
/* Noted, never failed: a superlative stands only when measured and sourced (BRIEF-DEEP, Facts). */
const SUPERLATIVE = /\b(best|finest|greatest|most\s+famous|iconic|legendary|world-class)\b/gi;

/* Every limit, in words unless named otherwise (22 October 2026, BRIEF-DEEP "The caps"). */
const CAPS = {
  summary: [60, 120],
  terroir: [15, 160],
  water: [0, 160],
  made: [60, 300],
  classification: [40, 260],
  articleProse: [800, 1800], /* a record not deepened: every prose word, every place note included */
  articleCertified: [800, 1800], /* deepened: summary, terroir, wines notes, made, law.classification, untagged places notes */
  articleDeeper: [300, 2000], /* deepened: deeper texts and depth-tagged places notes */
  articleWhole: 3600, /* deepened: Certified and deeper together */
  countrySummary: [80, 160],
  overview: [200, 700],
  countryProse: [400, 1400], /* not deepened: summary, overview and every place note */
  countryCertified: [400, 1400], /* deepened: summary, overview and untagged places notes */
  countryDeeper: [150, 1400],
  lines: [3, 10], /* exam and traps */
  cards: [6, 14],
  questions: [6, 12],
  deepCards: { min: 8, tagged: 2, untagged: 6 },
  deepQuestions: { min: 8, tagged: 2, untagged: 5 },
  mc: 3,
  sources: 1,
  deepSources: 2,
  deeper: [3, 14],
  deeperSecs: 3,
  deeperHead: 8,
  deeperText: [30, 220],
  techniquesArticle: 8,
  techniquesCountry: 10,
  videos: 2,
  watchSearch: [3, 8],
  videoLabel: [3, 12],
  videoWatchFor: [8, 30],
  url: 500,
  technique: {
    aka: 8, summary: [60, 120], how: [80, 300], steps: [3, 10], why: [40, 200], law: [0, 200], where: [2, 10],
    cards: [8, 12], cardsTagged: 2, questions: [6, 10], questionsTagged: 2, sources: 2, related: 6, prose: 2600
  }
};
/* The sections a deeper entry may deepen, per record kind (BRIEF-DEEP "Certified first, then deeper"). */
const DEEPER_SECS = {
  region: ['land', 'grapes', 'made', 'law', 'places', 'producers', 'exam'],
  country: ['overview', 'grapes', 'law', 'places', 'exam'],
  technique: ['how', 'why', 'law', 'where', 'exam']
};
const DEEPER_KEYS = ['sec', 'depth', 'head', 'text', 'src'];
const VIDEO_KEYS = ['url', 'id', 'label', 'channel', 'channelKind', 'watchFor', 'verifiedBy', 'checkedOn'];
const TECHNIQUE_KEYS = ['slug', 'name', 'group', 'asked', 'aka', 'cats', 'summary', 'how', 'steps', 'why', 'law', 'where', 'deeper', 'exam', 'traps', 'say', 'cards', 'questions', 'sources', 'related', 'videos', 'watchSearch'];
/* The fields an article and a country may carry (23 October 2026): a record is deepened by the presence of deeper, so a
   misspelt field ("deep", "technique") would leave it silently first edition; every other field is refused by name. */
const REGION_KEYS = ['slug', 'name', 'sheet', 'index', 'mapless', 'asked', 'summary', 'terroir', 'grapes', 'wines', 'made', 'law', 'places', 'producers', 'exam', 'traps', 'say', 'cards', 'questions', 'sources', 'deeper', 'techniques', 'videos', 'watchSearch'];
const COUNTRY_FIELDS = ['key', 'name', 'sheet', 'mapless', 'summary', 'overview', 'ladder', 'labels', 'regionsOrder', 'places', 'grapes', 'exam', 'traps', 'say', 'cards', 'questions', 'sources', 'deeper', 'techniques', 'videos', 'watchSearch'];
function unknownFields(rec, allowed, w, out, what) {
  Object.keys(rec).forEach((k) => { if (allowed.indexOf(k) < 0) out.push(w + '.' + k + ': no field of ' + what + ' (' + allowed.join(', ') + ')'); });
}

function words(s) { return String(s || '').trim() ? String(s || '').trim().split(/\s+/).length : 0; }
function fold(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
function isDeepened(rec) { return !!rec && typeof rec === 'object' && rec.deeper !== undefined; }
function n2(n) { return n.toLocaleString('en-GB'); }

function voiceProblems(s, where) {
  const out = [];
  if (typeof s !== 'string') return out;
  if (/—|–/.test(s)) out.push(where + ': a dash (em or en)');
  if (/&(m|n)dash;|&#8211;|&#8212;|&#x201[34];/i.test(s)) out.push(where + ': a dash entity');
  if (/ -- /.test(s)) out.push(where + ': a spaced double hyphen');
  if (/practi[cs]e/i.test(s)) out.push(where + ': the retired word practice (use rehearse, drill, study)');
  if (/\bLevel\s+(I|II|III|IV)\b/.test(s)) out.push(where + ': a numbered level');
  for (const ch of s) { const c = ch.codePointAt(0); if (c >= 0x2190) { out.push(where + ': a glyph at or above U+2190 (' + ch + ')'); break; } }
  const am = s.match(AMERICAN);
  if (am && !(am[0].toLowerCase().startsWith('colou'))) out.push(where + ': American spelling "' + am[0] + '"');
  return out;
}

/* The prose-only spellings: where is the string's path, and an accept list's entries and the URL paths are spared. */
function proseProblems(s, where) {
  if (typeof s !== 'string' || ACCEPT_PATH.test(where) || URL_PATH.test(where)) return [];
  const m = s.match(AMERICAN_PROSE);
  return m ? [where + ': American spelling "' + m[0] + '" (write per cent, towards)'] : [];
}

/* A URL path's own rule in place of the voice rules: https only, no whitespace, at most 500 characters, an absolute
   public address; a video's id is an eleven character YouTube id (its url is held to the id by checkVideos). The
   exemption spares a URL the spelling rules only (the American forms, the retired word, a numbered level): a dash, as
   a glyph or an entity, and a glyph at or above U+2190 are refused in a URL as everywhere else (URL_VOICE), since the
   site's dash count reads every shipped byte and check-regions blanks URLs before its raw sweep, so this is the one
   rule that sees them (23 October 2026, the adversarial verification). */
const URL_VOICE = /: a dash|: a spaced double hyphen|: a glyph at or above U\+2190/;
function urlProblems(s, where) {
  if (/\.videos\[\d+\]\.id$/.test(where)) return typeof s === 'string' && VIDEO_ID_RE.test(s) ? [] : [where + ': an eleven character YouTube id (letters, digits, _ and -)'];
  if (typeof s !== 'string') return [where + ': a URL string'];
  const out = voiceProblems(s, where).filter((p) => URL_VOICE.test(p));
  if (!/^https:\/\//.test(s)) out.push(where + ': https only');
  if (/\s/.test(s)) out.push(where + ': a URL holds no whitespace');
  if (s.length > CAPS.url) out.push(where + ': a URL of at most ' + CAPS.url + ' characters (' + s.length + ')');
  if (!out.length) {
    try {
      const u = new URL(s);
      if (u.protocol !== 'https:' || !u.hostname || u.username || u.password) out.push(where + ': an absolute public https URL');
    } catch (e) { out.push(where + ': not a URL'); }
  }
  return out;
}

/* The superlatives, as notes: every string but a URL path and an accept list. */
function superlativeNotes(frag) {
  const out = [];
  walkStrings(frag, '', (s, where) => {
    if (URL_PATH.test(where) || ACCEPT_PATH.test(where)) return;
    const m = s.match(SUPERLATIVE);
    if (m) out.push(where + ': a superlative ("' + Array.from(new Set(m.map((x) => x.toLowerCase().replace(/\s+/g, ' ')))).join('", "') + '"): measure and source it, or cut it');
  });
  return out;
}

/* companies.json: the channels whose name a video may ship. Read once. */
let COMPANIES = null;
function companies() {
  if (COMPANIES) return COMPANIES;
  const file = path.join(__dirname, 'companies.json');
  const out = { names: new Set(), list: [], problems: [] };
  let list = [];
  try { list = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { out.problems.push('companies.json: ' + e.message); }
  if (!Array.isArray(list)) { out.problems.push('companies.json: a list of { name, kind, site }'); list = []; }
  list.forEach((c, i) => {
    const w = 'companies.json[' + i + ']';
    if (!c || typeof c.name !== 'string' || !c.name.trim()) { out.problems.push(w + '.name: required'); return; }
    if (out.names.has(c.name)) out.problems.push(w + ': ' + c.name + ' twice');
    if (['board', 'school', 'publisher', 'producer', 'retailer'].indexOf(c.kind) < 0) out.problems.push(w + '.kind: board, school, publisher, producer or retailer');
    urlProblems(c.site, w + '.site').forEach((p) => out.problems.push(p));
    voiceProblems(c.name, w + '.name').concat(proseProblems(c.name, w + '.name')).forEach((p) => out.problems.push(p));
    out.names.add(c.name);
    out.list.push(c);
  });
  COMPANIES = out;
  return out;
}

function loadCodex(jsDir) {
  const ctx = { window: {}, document: {}, navigator: {}, localStorage: { getItem() { return null; }, setItem() {} }, console: { log() {}, warn() {}, error() {} } };
  ctx.self = ctx; vm.createContext(ctx);
  for (const f of ['reference.js', 'data-primers.js', 'data-primers-intro.js', 'data-grapes-plus.js', 'data-maps.js', 'data-atlas-v2.js', 'data-intro.js', 'data-producers.js']) {
    const p = path.join(jsDir, f);
    if (!fs.existsSync(p)) throw new Error('missing ' + p);
    vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f });
  }
  const grapes = new Set();
  (ctx.GRAPES || []).forEach((g) => grapes.add(fold(g.g)));
  (ctx.GRAPES_PLUS || []).forEach((g) => grapes.add(fold(g.g)));
  (ctx.INTRO_GRAPES || []).forEach((g) => grapes.add(fold(g.n)));
  const producers = new Set((ctx.WINE_PRODUCERS || []).map((p) => p.id));
  const terroir = new Set(); (ctx.TERROIR || []).forEach((g) => g.regions.forEach((r) => terroir.add(r.r)));
  const cats = new Set((ctx.PRIMERS || []).map((p) => p.cat)); (ctx.INTRO_PRIMERS || []).forEach((p) => cats.add(p.id));
  return { atlas: ctx.ATLAS_V2, grapes, producers, terroir, cats };
}

function walkStrings(v, where, fn) {
  if (typeof v === 'string') fn(v, where);
  else if (Array.isArray(v)) v.forEach((x, i) => walkStrings(x, where + '[' + i + ']', fn));
  else if (v && typeof v === 'object') Object.keys(v).forEach((k) => walkStrings(v[k], where + '.' + k, fn));
}

function checkPairs(list, where, out, min, max) {
  if (!Array.isArray(list)) { out.push(where + ': must be a list of [name, note] pairs'); return; }
  if (min !== undefined && list.length < min) out.push(where + ': at least ' + min + ' entries');
  if (max !== undefined && list.length > max) out.push(where + ': at most ' + max + ' entries');
  list.forEach((p, i) => { if (!Array.isArray(p) || p.length !== 2 || !p[0] || !p[1] || typeof p[0] !== 'string' || typeof p[1] !== 'string') out.push(where + '[' + i + ']: a pair of two strings'); });
}
function checkLines(list, where, out, min, max) {
  if (!Array.isArray(list)) { out.push(where + ': must be a list of lines'); return; }
  if (list.length < min || list.length > max) out.push(where + ': ' + min + ' to ' + max + ' lines (' + list.length + ')');
  list.forEach((l, i) => { if (typeof l !== 'string' || words(l) < 3) out.push(where + '[' + i + ']: a line of at least three words'); });
}
function checkRange(s, where, out, min, max) {
  const n = words(s);
  if (typeof s !== 'string') { out.push(where + ': must be a string'); return 0; }
  if (n < min || n > max) out.push(where + ': ' + min + ' to ' + max + ' words (' + n + ')');
  return n;
}
function placesWords(places) {
  let n = 0;
  (places || []).forEach((p) => { n += words(p.note); n += placesWords(p.places); });
  return n;
}
/* The places notes split by depth: a place that carries depth, and everything nested under it, is deeper reading. */
function placesSplit(places, tagged) {
  const o = { plain: 0, tagged: 0 };
  (Array.isArray(places) ? places : []).forEach((p) => {
    if (!p || typeof p !== 'object') return;
    const t = !!tagged || DEPTHS.indexOf(p.depth) >= 0;
    if (t) o.tagged += words(p.note); else o.plain += words(p.note);
    const sub = placesSplit(p.places, t);
    o.plain += sub.plain; o.tagged += sub.tagged;
  });
  return o;
}
function checkPlaces(places, where, out) {
  if (!Array.isArray(places)) { out.push(where + ': must be a list'); return; }
  places.forEach((p, i) => {
    const w = where + '[' + i + ']';
    if (!p || typeof p !== 'object') { out.push(w + ': an object'); return; }
    if (!p.name || typeof p.name !== 'string') out.push(w + '.name: required');
    if (typeof p.note !== 'string' || words(p.note) < 8) out.push(w + '.note: at least eight words');
    if (p.depth !== undefined && DEPTHS.indexOf(p.depth) < 0) out.push(w + '.depth: advanced or master');
    if (p.places !== undefined) checkPlaces(p.places, w + '.places', out);
  });
}
function checkGrapes(list, where, out, codex) {
  if (!Array.isArray(list) || !list.length) { out.push(where + ': at least one grape'); return; }
  list.forEach((g, i) => {
    const w = where + '[' + i + ']';
    if (!g || !g.name) { out.push(w + '.name: required'); return; }
    const known = codex.grapes.has(fold(g.name));
    if (!known && g.plain !== 1) out.push(w + ': "' + g.name + '" is in no grape list; mark it plain: 1 or spell it as the Codex does');
    if (known && g.plain === 1) out.push(w + ': "' + g.name + '" is a Codex grape; drop plain');
    if (ROLES.indexOf(g.role) < 0) out.push(w + '.role: lead, blending, minor or rising');
    if (typeof g.styles !== 'string' || words(g.styles) < 5) out.push(w + '.styles: a sentence or two');
  });
}
function checkWines(list, where, out) {
  if (!Array.isArray(list) || !list.length) { out.push(where + ': at least one wine'); return 0; }
  let n = 0;
  list.forEach((x, i) => {
    const w = where + '[' + i + ']';
    if (!x || !x.style) out.push(w + '.style: required');
    if (COLOURS.indexOf(x && x.colour) < 0) out.push(w + '.colour: ' + COLOURS.join(', '));
    if (!x || typeof x.note !== 'string' || words(x.note) < 8) out.push(w + '.note: at least eight words');
    n += words(x && x.note);
  });
  return n;
}
function checkSay(list, where, out, min) {
  if (!Array.isArray(list)) { out.push(where + ': a list of [word, respelling] pairs'); return; }
  if (list.length < min) out.push(where + ': at least ' + min + ' respellings');
  list.forEach((p, i) => {
    if (!Array.isArray(p) || p.length !== 2 || !p[0] || !p[1]) { out.push(where + '[' + i + ']: a pair'); return; }
    if (!/[A-Z]{2,}/.test(p[1])) out.push(where + '[' + i + ']: the respelling caps its stressed syllable (' + p[1] + ')');
  });
}
/* A depth on a card or a question: advanced or master; returns whether the item is tagged. */
function tagOf(x, w, out) {
  if (!x || x.depth === undefined) return false;
  if (DEPTHS.indexOf(x.depth) < 0) { out.push(w + '.depth: advanced or master'); return false; }
  return true;
}
/* range: [min, max]; deep: { min, tagged, untagged? } when the record is deepened (a technique always is). */
function checkCards(list, where, out, range, deep) {
  const lo = range[0], hi = range[1];
  if (!Array.isArray(list) || list.length < lo || list.length > hi) { out.push(where + ': ' + lo + ' to ' + hi + ' cards (' + (Array.isArray(list) ? list.length : 'none') + ')'); if (!Array.isArray(list)) return; }
  let tagged = 0;
  list.forEach((c, i) => {
    const w = where + '[' + i + ']';
    if (!c || typeof c.f !== 'string' || words(c.f) < 3) out.push(w + '.f: a front of at least three words');
    if (!c || typeof c.b !== 'string' || words(c.b) < 1 || words(c.b) > 40) out.push(w + '.b: a back of at most 40 words');
    if (tagOf(c, w, out)) tagged++;
  });
  if (deep) {
    if (list.length < deep.min) out.push(where + ': a deepened record holds at least ' + deep.min + ' cards (' + list.length + ')');
    if (tagged < deep.tagged) out.push(where + ': at least ' + deep.tagged + ' cards tagged advanced or master (' + tagged + ')');
    if (deep.untagged && list.length - tagged < deep.untagged) out.push(where + ': at least ' + deep.untagged + ' untagged cards, the Certified reading (' + (list.length - tagged) + ')');
  }
}
function checkQuestions(list, where, out, cat, range, deep) {
  const lo = range[0], hi = range[1];
  if (!Array.isArray(list) || list.length < lo || list.length > hi) { out.push(where + ': ' + lo + ' to ' + hi + ' questions (' + (Array.isArray(list) ? list.length : 'none') + ')'); if (!Array.isArray(list)) return; }
  let mc = 0, tagged = 0;
  const stems = new Set();
  list.forEach((q, i) => {
    const w = where + '[' + i + ']';
    if (!q || typeof q !== 'object') { out.push(w + ': an object'); return; }
    if (q.cat !== cat) out.push(w + '.cat: must be "' + cat + '"');
    if (typeof q.q !== 'string' || words(q.q) < 5) out.push(w + '.q: a stem of at least five words');
    if (/\b(NOT|EXCEPT)\b/.test(q.q || '') || /all of the above|none of the above/i.test((Array.isArray(q.opts) ? q.opts : []).join(' '))) out.push(w + ': no NOT, EXCEPT, all or none of the above');
    if (q.q && stems.has(fold(q.q))) out.push(w + ': a duplicate stem');
    stems.add(fold(q.q || ''));
    if (typeof q.exp !== 'string' || words(q.exp) < 10 || words(q.exp) > 60) out.push(w + '.exp: 10 to 60 words');
    /* the build deals the options into a new order, so an explanation may never point at one by position */
    if (/\b(option|answer|choice)\s+[abcd1-4]\b|\b(first|second|third|fourth|last)\s+(option|answer|choice)\b|^\s*\(?[abcd]\)\s/i.test(q.exp || '')) out.push(w + '.exp: names an option by position (the build reorders the options)');
    if (q.id !== undefined && !/^r-[0-9a-z]{8}$/.test(q.id)) out.push(w + '.id: only the builder mints ids (r- and eight base36)');
    if (tagOf(q, w, out)) tagged++;
    if (q.sa === 1) {
      if (!Array.isArray(q.accept) || q.accept.length < 2 || q.accept.length > 8 || q.accept.some((a) => typeof a !== 'string' || !a.trim())) out.push(w + '.accept: 2 to 8 strings');
      if (typeof q.ans !== 'string' || !q.ans.trim()) out.push(w + '.ans: the canonical answer');
      if (Array.isArray(q.accept) && q.ans && q.accept[0] !== q.ans) out.push(w + '.accept: the canonical answer comes first');
      if (q.opts !== undefined) out.push(w + ': a short answer carries no opts');
    } else {
      mc++;
      if (!Array.isArray(q.opts) || q.opts.length !== 4 || q.opts.some((o) => typeof o !== 'string' || !o.trim())) out.push(w + '.opts: four strings');
      if (Array.isArray(q.opts) && new Set(q.opts.map(fold)).size !== q.opts.length) out.push(w + '.opts: four distinct options');
      if (!Number.isInteger(q.a) || q.a < 0 || q.a > 3) out.push(w + '.a: an index 0 to 3');
      if (Array.isArray(q.opts) && Number.isInteger(q.a) && q.opts[q.a]) {
        const lens = q.opts.map((o) => o.length); const mx = Math.max.apply(null, lens);
        if (q.opts[q.a].length === mx && lens.filter((l) => l === mx).length === 1 && mx > 1.6 * (lens.reduce((a, b) => a + b, 0) - mx) / 3) out.push(w + ': the answer is the longest option by far');
      }
    }
  });
  if (mc < CAPS.mc) out.push(where + ': at least three multiple choice questions');
  if (deep) {
    if (list.length < deep.min) out.push(where + ': a deepened record holds at least ' + deep.min + ' questions (' + list.length + ')');
    if (tagged < deep.tagged) out.push(where + ': at least ' + deep.tagged + ' questions tagged advanced or master (' + tagged + ')');
    if (deep.untagged && list.length - tagged < deep.untagged) out.push(where + ': at least ' + deep.untagged + ' untagged questions, the Certified reading (' + (list.length - tagged) + ')');
  }
}
function checkSources(list, where, out, min) {
  if (!Array.isArray(list) || list.length < min) { out.push(where + ': at least ' + (min === 1 ? 'one source' : min + ' sources') + ' (' + (Array.isArray(list) ? list.length : 'none') + ')'); if (!Array.isArray(list)) return; }
  list.forEach((s, i) => {
    if (!s || !s.title || !s.asOf) out.push(where + '[' + i + ']: title and asOf');
    if (s && s.url !== undefined && typeof s.url !== 'string') out.push(where + '[' + i + '].url: a URL string'); /* the string itself: urlProblems, through the walk */
    if (s && s.primary !== undefined && s.primary !== 1) out.push(where + '[' + i + '].primary: 1 (the law, the regulator or the appellation body) or omitted');
  });
}

/* The deeper list: returns the words of its texts. */
function checkDeeper(list, where, out, kind, sources) {
  if (!Array.isArray(list)) { out.push(where + ': a list of { sec, depth, head?, text, src }'); return 0; }
  const secsAllowed = DEEPER_SECS[kind];
  const src = Array.isArray(sources) ? sources : [];
  if (list.length < CAPS.deeper[0] || list.length > CAPS.deeper[1]) out.push(where + ': ' + CAPS.deeper[0] + ' to ' + CAPS.deeper[1] + ' entries (' + list.length + ')');
  const secs = new Set();
  const depths = new Set();
  let n = 0;
  list.forEach((d, i) => {
    const w = where + '[' + i + ']';
    if (!d || typeof d !== 'object' || Array.isArray(d)) { out.push(w + ': an object { sec, depth, head?, text, src }'); return; }
    Object.keys(d).forEach((k) => { if (DEEPER_KEYS.indexOf(k) < 0) out.push(w + '.' + k + ': no such field (sec, depth, head, text, src)'); });
    if (secsAllowed.indexOf(d.sec) < 0) out.push(w + '.sec: one of ' + secsAllowed.join(', ')); else secs.add(d.sec);
    if (DEPTHS.indexOf(d.depth) < 0) out.push(w + '.depth: advanced or master'); else depths.add(d.depth);
    if (d.head !== undefined && (typeof d.head !== 'string' || !d.head.trim() || words(d.head) > CAPS.deeperHead)) out.push(w + '.head: at most ' + CAPS.deeperHead + ' words, or omitted');
    n += checkRange(d.text, w + '.text', out, CAPS.deeperText[0], CAPS.deeperText[1]);
    const cited = [];
    if (!Array.isArray(d.src) || !d.src.length) out.push(w + '.src: a non-empty list of the record\'s source indices (from 0)');
    else d.src.forEach((x, j) => {
      if (!Number.isInteger(x) || x < 0 || x >= src.length) out.push(w + '.src[' + j + ']: ' + JSON.stringify(x) + ' is no index of the record\'s ' + src.length + ' sources');
      else if (cited.indexOf(x) >= 0) out.push(w + '.src[' + j + ']: ' + x + ' twice');
      else cited.push(x);
    });
    if (typeof d.text === 'string' && /\d/.test(d.text) && !(cited.length >= 2 || cited.some((x) => src[x] && src[x].primary === 1))) out.push(w + ': a text holding a digit cites two sources, or one marked primary: 1');
  });
  if (secs.size < CAPS.deeperSecs) out.push(where + ': at least three sections (' + secs.size + (secs.size ? ': ' + Array.from(secs).join(', ') : '') + ')');
  if (!depths.has('advanced') || !depths.has('master')) out.push(where + ': at least one advanced and one master entry');
  return n;
}

/* The techniques a record lists: roster slugs, no duplicate, at most max; a deepened record carries its MUST_LINK. */
function checkTechniqueList(list, where, out, max, deep, owner) {
  const must = Object.prototype.hasOwnProperty.call(ROSTER.MUST_LINK, owner) ? ROSTER.MUST_LINK[owner] : [];
  if (list === undefined) { if (deep && must.length) out.push(where + ': a deepened record links ' + must.join(', ') + ' (the roster\'s MUST_LINK for ' + owner + ')'); return; }
  if (!Array.isArray(list)) { out.push(where + ': a list of technique slugs'); return; }
  if (list.length > max) out.push(where + ': at most ' + max + ' techniques (' + list.length + ')');
  const seen = new Set();
  list.forEach((t, i) => {
    if (ROSTER.TECHNIQUE_SLUGS.indexOf(t) < 0) out.push(where + '[' + i + ']: ' + JSON.stringify(t) + ' is no roster technique slug');
    else if (seen.has(t)) out.push(where + '[' + i + ']: ' + t + ' twice');
    seen.add(t);
  });
  if (deep) {
    const missing = must.filter((t) => !seen.has(t));
    if (missing.length) out.push(where + ': a deepened record links ' + missing.join(', ') + ' (the roster\'s MUST_LINK for ' + owner + ')');
  }
}

/* videos (0 to 2) and watchSearch (3 to 8 words), on every record and technique. */
function checkVideos(rec, where, out) {
  if (rec.watchSearch !== undefined) checkRange(rec.watchSearch, where + '.watchSearch', out, CAPS.watchSearch[0], CAPS.watchSearch[1]);
  if (rec.videos === undefined) return;
  const w0 = where + '.videos';
  if (!Array.isArray(rec.videos)) { out.push(w0 + ': a list of at most ' + CAPS.videos + ' videos'); return; }
  if (rec.videos.length > CAPS.videos) out.push(w0 + ': at most ' + CAPS.videos + ' videos (' + rec.videos.length + ')');
  const ids = new Set();
  const names = companies().names;
  rec.videos.forEach((v, i) => {
    const w = w0 + '[' + i + ']';
    if (!v || typeof v !== 'object' || Array.isArray(v)) { out.push(w + ': an object'); return; }
    Object.keys(v).forEach((k) => { if (VIDEO_KEYS.indexOf(k) < 0) out.push(w + '.' + k + ': no such field (' + VIDEO_KEYS.join(', ') + ')'); });
    if (typeof v.id !== 'string' || !VIDEO_ID_RE.test(v.id)) out.push(w + '.id: an eleven character YouTube id');
    else {
      if (v.url !== VIDEO_URL + v.id) out.push(w + '.url: exactly ' + VIDEO_URL + v.id);
      if (ids.has(v.id)) out.push(w + '.id: ' + v.id + ' twice');
      ids.add(v.id);
    }
    checkRange(v.label, w + '.label', out, CAPS.videoLabel[0], CAPS.videoLabel[1]);
    checkRange(v.watchFor, w + '.watchFor', out, CAPS.videoWatchFor[0], CAPS.videoWatchFor[1]);
    if (v.channelKind === 'company') {
      if (typeof v.channel !== 'string' || !names.has(v.channel)) out.push(w + '.channel: a company channel is named exactly as companies.json names it (' + JSON.stringify(v.channel) + ')');
    } else if (v.channelKind === 'person' || v.channelKind === 'unknown') {
      /* unknown (23 October 2026, the owner's rule): the searches proved the film and its title but showed no channel */
      if (v.channel !== undefined) out.push(w + '.channel: a ' + (v.channelKind === 'person' ? 'person\'s channel' : 'channel the searches could not confirm') + ' ships with our label only, never a name');
    } else out.push(w + '.channelKind: company, person or unknown');
    if (['websearch', 'pack'].indexOf(v.verifiedBy) < 0) out.push(w + '.verifiedBy: websearch or pack');
    if (typeof v.checkedOn !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v.checkedOn) || isNaN(Date.parse(v.checkedOn + 'T00:00:00Z')) || new Date(v.checkedOn + 'T00:00:00Z').toISOString().slice(0, 10) !== v.checkedOn) out.push(w + '.checkedOn: a date, YYYY-MM-DD');
  });
}

function checkAsked(asked, w, out) {
  if (!Array.isArray(asked) || !asked.length || asked.some((l) => LEVELS.indexOf(l) < 0) || asked.join() !== LEVELS.filter((l) => asked.indexOf(l) >= 0).join()) out.push(w + '.asked: a non-empty subset of intro, certified, advanced, master in that order');
}

/* An article. roster is undefined for an article of the map (held to the atlas at index i), else the roster's entry
   (null when the slug is no roster article): an article off the map, held to the roster and always deepened. */
function checkRegion(r, i, sheet, codex, out, roster) {
  const more = roster !== undefined;
  const w = 'regions[' + i + ']';
  if (!r || typeof r !== 'object' || Array.isArray(r)) { out.push(w + ': an object'); return; }
  unknownFields(r, REGION_KEYS, w, out, 'an article');
  if (typeof r.slug !== 'string' || !/^[a-z0-9-]+$/.test(r.slug)) out.push(w + '.slug: a string, /^[a-z0-9-]+$/');
  if (more) {
    if (roster && r.name !== roster.name) out.push(w + '.name: must be "' + roster.name + '" (the roster)');
    if (r.mapless !== 1) out.push(w + '.mapless: 1 (an article off the map)');
    if (r.index !== undefined) out.push(w + '.index: none for an article off the map');
    if (r.deeper === undefined) out.push(w + '.deeper: an article off the map is written deepened (a deeper list is required)');
  } else {
    const atlas = codex.atlas.sheets[sheet].regions[i];
    if (r.name !== (atlas && atlas.name)) out.push(w + '.name: must be "' + (atlas && atlas.name) + '"');
    if (r.index !== i) out.push(w + '.index: must be ' + i);
    if (r.mapless !== undefined) out.push(w + '.mapless: only an article of <sheet>.more.json is off the map');
  }
  if (r.sheet !== sheet) out.push(w + '.sheet: must be ' + sheet);
  checkAsked(r.asked, w, out);
  const deep = isDeepened(r);
  let cert = checkRange(r.summary, w + '.summary', out, CAPS.summary[0], CAPS.summary[1]);
  const t = r.terroir || {};
  if (!r.terroir) out.push(w + '.terroir: required');
  cert += checkRange(t.climate, w + '.terroir.climate', out, CAPS.terroir[0], CAPS.terroir[1]);
  cert += checkRange(t.soils, w + '.terroir.soils', out, CAPS.terroir[0], CAPS.terroir[1]);
  cert += checkRange(t.topography, w + '.terroir.topography', out, CAPS.terroir[0], CAPS.terroir[1]);
  cert += checkRange(t.water === undefined ? '' : t.water, w + '.terroir.water', out, CAPS.water[0], CAPS.water[1]);
  checkGrapes(r.grapes, w + '.grapes', out, codex);
  cert += checkWines(r.wines, w + '.wines', out);
  const m = r.made || {};
  if (!r.made) out.push(w + '.made: required');
  cert += checkRange(m.viticulture, w + '.made.viticulture', out, CAPS.made[0], CAPS.made[1]);
  cert += checkRange(m.winemaking, w + '.made.winemaking', out, CAPS.made[0], CAPS.made[1]);
  const l = r.law || {};
  if (!r.law) out.push(w + '.law: required');
  cert += checkRange(l.classification, w + '.law.classification', out, CAPS.classification[0], CAPS.classification[1]);
  checkPairs(l.tiers, w + '.law.tiers', out, 1);
  checkPairs(l.labels, w + '.law.labels', out, 0);
  if (!Array.isArray(r.places) || !r.places.length) out.push(w + '.places: at least one place');
  checkPlaces(r.places, w + '.places', out);
  const pw = placesSplit(r.places);
  if (!Array.isArray(r.producers) || !r.producers.length) out.push(w + '.producers: at least one house');
  (Array.isArray(r.producers) ? r.producers : []).forEach((p, j) => {
    if (!p || !p.name || !p.why) out.push(w + '.producers[' + j + ']: name and why');
    if (p && p.id !== undefined && !codex.producers.has(p.id)) out.push(w + '.producers[' + j + '].id: ' + p.id + ' is not a WINE_PRODUCERS id');
  });
  checkLines(r.exam, w + '.exam', out, CAPS.lines[0], CAPS.lines[1]);
  checkLines(r.traps, w + '.traps', out, CAPS.lines[0], CAPS.lines[1]);
  checkSay(r.say, w + '.say', out, 2);
  checkCards(r.cards, w + '.cards', out, CAPS.cards, deep ? CAPS.deepCards : null);
  checkQuestions(r.questions, w + '.questions', out, r.name, CAPS.questions, deep ? CAPS.deepQuestions : null);
  checkSources(r.sources, w + '.sources', out, deep ? CAPS.deepSources : CAPS.sources);
  checkTechniqueList(r.techniques, w + '.techniques', out, CAPS.techniquesArticle, deep, r.slug);
  checkVideos(r, w, out);
  if (deep) {
    const dw = checkDeeper(r.deeper, w + '.deeper', out, 'region', r.sources);
    cert += pw.plain;
    const deeper = dw + pw.tagged;
    if (cert < CAPS.articleCertified[0] || cert > CAPS.articleCertified[1]) out.push(w + ': the Certified prose is ' + n2(CAPS.articleCertified[0]) + ' to ' + n2(CAPS.articleCertified[1]) + ' words over summary, terroir, wines notes, made, law.classification and the untagged places notes (' + cert + ')');
    if (deeper < CAPS.articleDeeper[0] || deeper > CAPS.articleDeeper[1]) out.push(w + ': the deeper prose is ' + n2(CAPS.articleDeeper[0]) + ' to ' + n2(CAPS.articleDeeper[1]) + ' words over the deeper texts and the depth-tagged places notes (' + deeper + ')');
    if (cert + deeper > CAPS.articleWhole) out.push(w + ': the whole record is at most ' + n2(CAPS.articleWhole) + ' words of prose, Certified and deeper (' + (cert + deeper) + ')');
  } else {
    const total = cert + pw.plain + pw.tagged;
    if (total < CAPS.articleProse[0] || total > CAPS.articleProse[1]) out.push(w + ': the article prose is ' + n2(CAPS.articleProse[0]) + ' to ' + n2(CAPS.articleProse[1]) + ' words over summary, terroir, made, law.classification, wines notes and places notes (' + total + ')');
  }
}

/* A sheet country's regionsOrder: the map's slugs in map order, then any of the roster's articles off the map for the
   sheet, in roster order (which of them the build holds is the build's to judge). */
function regionsOrderOk(order, mapSlugs, moreSlugs) {
  if (!Array.isArray(order) || order.length < mapSlugs.length) return false;
  if (order.slice(0, mapSlugs.length).join() !== mapSlugs.join()) return false;
  let last = -1;
  return order.slice(mapSlugs.length).every((s) => { const at = moreSlugs.indexOf(s); if (at <= last) return false; last = at; return true; });
}

function checkCountry(c, w, codex, out, sheet, slugs) {
  if (!c || typeof c !== 'object' || Array.isArray(c)) { out.push(w + ': an object'); return; }
  unknownFields(c, COUNTRY_FIELDS, w, out, 'a country');
  if (sheet) {
    if (c.key !== sheet) out.push(w + '.key: must be ' + sheet);
    if (c.sheet !== sheet) out.push(w + '.sheet: must be ' + sheet);
    if (c.mapless !== undefined) out.push(w + '.mapless: not for a sheet country');
    const more = (ROSTER.MORE[sheet] || []).map((a) => a.slug);
    if (slugs === null) { if (!Array.isArray(c.regionsOrder) || !c.regionsOrder.length || c.regionsOrder.some((x) => !/^[a-z0-9-]+$/.test(x))) out.push(w + '.regionsOrder: every region slug of the whole sheet in map order (the other parts\' slugs included), then the roster\'s articles off the map'); }
    else if (!regionsOrderOk(c.regionsOrder, slugs, more)) out.push(w + '.regionsOrder: every region slug of the sheet in map order, then the roster\'s articles off the map in roster order' + (more.length ? ' (' + more.join(', ') + ')' : ''));
    if (c.places !== undefined && c.places.length) out.push(w + '.places: a sheet country keeps its places in the region articles');
  } else {
    if (MAPLESS.indexOf(c.key) < 0) out.push(w + '.key: one of ' + MAPLESS.join(', '));
    if (c.mapless !== 1) out.push(w + '.mapless: 1');
    if (c.sheet !== undefined) out.push(w + '.sheet: none for a mapless country');
    if (!Array.isArray(c.regionsOrder) || c.regionsOrder.length) out.push(w + '.regionsOrder: empty for a mapless country');
    if (!Array.isArray(c.places) || !c.places.length) out.push(w + '.places: the country\'s regions as places');
    checkPlaces(c.places, w + '.places', out);
    const ro = ROSTER.NEW_MAPLESS.find((x) => x.key === c.key);
    if (ro) {
      if (c.name !== ro.name) out.push(w + '.name: must be "' + ro.name + '" (the roster)');
      if (c.deeper === undefined) out.push(w + '.deeper: a new map-less country is written deepened (a deeper list is required)');
    }
  }
  if (!c.name) out.push(w + '.name: required');
  const deep = isDeepened(c);
  let cert = checkRange(c.summary, w + '.summary', out, CAPS.countrySummary[0], CAPS.countrySummary[1]);
  cert += checkRange(c.overview, w + '.overview', out, CAPS.overview[0], CAPS.overview[1]);
  const pw = placesSplit(c.places);
  checkPairs(c.ladder, w + '.ladder', out, 1);
  checkPairs(c.labels, w + '.labels', out, 0);
  checkGrapes(c.grapes, w + '.grapes', out, codex);
  checkLines(c.exam, w + '.exam', out, CAPS.lines[0], CAPS.lines[1]);
  checkLines(c.traps, w + '.traps', out, CAPS.lines[0], CAPS.lines[1]);
  checkSay(c.say, w + '.say', out, 1);
  checkCards(c.cards, w + '.cards', out, CAPS.cards, deep ? CAPS.deepCards : null);
  checkQuestions(c.questions, w + '.questions', out, c.name, CAPS.questions, deep ? CAPS.deepQuestions : null);
  checkSources(c.sources, w + '.sources', out, deep ? CAPS.deepSources : CAPS.sources);
  checkTechniqueList(c.techniques, w + '.techniques', out, CAPS.techniquesCountry, deep, c.key);
  checkVideos(c, w, out);
  if (deep) {
    const dw = checkDeeper(c.deeper, w + '.deeper', out, 'country', c.sources);
    cert += pw.plain;
    const deeper = dw + pw.tagged;
    if (cert < CAPS.countryCertified[0] || cert > CAPS.countryCertified[1]) out.push(w + ': the Certified prose is ' + n2(CAPS.countryCertified[0]) + ' to ' + n2(CAPS.countryCertified[1]) + ' words over summary, overview and the untagged places notes (' + cert + ')');
    if (deeper < CAPS.countryDeeper[0] || deeper > CAPS.countryDeeper[1]) out.push(w + ': the deeper prose is ' + n2(CAPS.countryDeeper[0]) + ' to ' + n2(CAPS.countryDeeper[1]) + ' words over the deeper texts and the depth-tagged places notes (' + deeper + ')');
  } else {
    const total = cert + pw.plain + pw.tagged;
    if (total < CAPS.countryProse[0] || total > CAPS.countryProse[1]) out.push(w + ': the country prose is ' + n2(CAPS.countryProse[0]) + ' to ' + n2(CAPS.countryProse[1]) + ' words over summary, overview and places notes (' + total + ')');
  }
}

/* A technique record of the companion (BRIEF-DEEP "Techniques"): always deepened, never a join target. */
function checkTechnique(t, i, codex, out) {
  const w = 'techniques[' + i + ']';
  const T = CAPS.technique;
  if (!t || typeof t !== 'object' || Array.isArray(t)) { out.push(w + ': an object'); return; }
  Object.keys(t).forEach((k) => { if (TECHNIQUE_KEYS.indexOf(k) < 0) out.push(w + '.' + k + ': no field of a technique record' + (k === 'usedBy' ? ' (the build computes usedBy)' : '')); });
  const ro = ROSTER.TECHNIQUES.find((x) => x[0] === t.slug);
  if (!ro) out.push(w + '.slug: ' + JSON.stringify(t.slug) + ' is no roster technique slug');
  else {
    if (t.name !== ro[1]) out.push(w + '.name: must be "' + ro[1] + '" (the roster)');
    if (t.group !== ro[2]) out.push(w + '.group: must be ' + ro[2] + ' (the roster)');
  }
  checkAsked(t.asked, w, out);
  if (!Array.isArray(t.aka)) out.push(w + '.aka: a list of other names (may be empty)');
  else {
    if (t.aka.length > T.aka) out.push(w + '.aka: at most ' + T.aka + ' names (' + t.aka.length + ')');
    t.aka.forEach((a, j) => { if (typeof a !== 'string' || !a.trim()) out.push(w + '.aka[' + j + ']: a name'); });
  }
  if (!Array.isArray(t.cats)) out.push(w + '.cats: a list of PRIMERS cats or INTRO_PRIMERS ids (may be empty)');
  else t.cats.forEach((c, j) => { if (!codex.cats.has(c)) out.push(w + '.cats[' + j + ']: ' + JSON.stringify(c) + ' is not a PRIMERS cat or an INTRO_PRIMERS id'); });
  let prose = checkRange(t.summary, w + '.summary', out, T.summary[0], T.summary[1]);
  prose += checkRange(t.how, w + '.how', out, T.how[0], T.how[1]);
  checkPairs(t.steps, w + '.steps', out, T.steps[0], T.steps[1]);
  (Array.isArray(t.steps) ? t.steps : []).forEach((p) => { if (Array.isArray(p)) prose += words(p[1]); });
  prose += checkRange(t.why, w + '.why', out, T.why[0], T.why[1]);
  prose += checkRange(t.law, w + '.law', out, T.law[0], T.law[1]);
  checkPairs(t.where, w + '.where', out, T.where[0], T.where[1]);
  (Array.isArray(t.where) ? t.where : []).forEach((p) => { if (Array.isArray(p)) prose += words(p[1]); });
  if (t.deeper === undefined) out.push(w + '.deeper: a technique is written deepened (a deeper list is required)');
  else prose += checkDeeper(t.deeper, w + '.deeper', out, 'technique', t.sources);
  checkLines(t.exam, w + '.exam', out, CAPS.lines[0], CAPS.lines[1]);
  checkLines(t.traps, w + '.traps', out, CAPS.lines[0], CAPS.lines[1]);
  checkSay(t.say, w + '.say', out, 1);
  checkCards(t.cards, w + '.cards', out, T.cards, { min: T.cards[0], tagged: T.cardsTagged });
  checkQuestions(t.questions, w + '.questions', out, t.name, T.questions, { min: T.questions[0], tagged: T.questionsTagged });
  checkSources(t.sources, w + '.sources', out, T.sources);
  if (!Array.isArray(t.related)) out.push(w + '.related: a list of technique slugs (may be empty)');
  else {
    if (t.related.length > T.related) out.push(w + '.related: at most ' + T.related + ' techniques (' + t.related.length + ')');
    const seen = new Set();
    t.related.forEach((s, j) => {
      if (ROSTER.TECHNIQUE_SLUGS.indexOf(s) < 0) out.push(w + '.related[' + j + ']: ' + JSON.stringify(s) + ' is no roster technique slug');
      else if (s === t.slug) out.push(w + '.related[' + j + ']: a technique is never related to itself');
      else if (seen.has(s)) out.push(w + '.related[' + j + ']: ' + s + ' twice');
      seen.add(s);
    });
  }
  checkVideos(t, w, out);
  if (prose > T.prose) out.push(w + ': the technique prose is at most ' + n2(T.prose) + ' words over summary, how, why, law, the steps\' details, the where notes and the deeper texts (' + prose + ')');
}

/* An alias key's own rules, as the join reads it: folded, and naming no country unless its target is a country key
   (the resolver also matches a part held inside a key, so "burgundy france" would send a bare "France" to that article). */
function aliasKeyProblems(k, target) {
  const out = [];
  if (k !== fold(k)) out.push('the key is folded (lower case, no accents, no punctuation)');
  if (COUNTRY_KEYS.indexOf(target) < 0 && COUNTRY_WORDS.concat(SHEET_WORDS).some((c) => k !== c && (' ' + k + ' ').indexOf(' ' + c + ' ') >= 0)) out.push('an alias to an article may not name a country or a United States sheet (a bare country or state name would resolve to it); drop it or point it at the country key');
  return out;
}

function checkJoin(frag, out, slugs, keys, codex) {
  const targets = new Set(slugs.concat(keys));
  if (frag.country && Array.isArray(frag.country.regionsOrder)) frag.country.regionsOrder.forEach((x) => targets.add(x));
  if (frag.part && Array.isArray(frag.part.slugs)) frag.part.slugs.forEach((x) => targets.add(x));
  if (frag.aliases !== undefined) {
    if (!frag.aliases || typeof frag.aliases !== 'object' || Array.isArray(frag.aliases)) out.push('aliases: an object');
    else Object.keys(frag.aliases).forEach((k) => {
      if (!targets.has(frag.aliases[k])) out.push('aliases["' + k + '"]: ' + frag.aliases[k] + ' is no slug or country key of this fragment');
      aliasKeyProblems(k, frag.aliases[k]).forEach((p) => out.push('aliases["' + k + '"]: ' + p));
    });
  }
  if (frag.terroirRows !== undefined) Object.keys(frag.terroirRows || {}).forEach((k) => {
    if (!codex.terroir.has(k)) out.push('terroirRows["' + k + '"]: not a TERROIR row name');
    if (!targets.has(frag.terroirRows[k])) out.push('terroirRows["' + k + '"]: ' + frag.terroirRows[k] + ' is no slug or key of this fragment');
  });
  if (frag.cats !== undefined) Object.keys(frag.cats || {}).forEach((k) => {
    if (!codex.cats.has(k)) out.push('cats["' + k + '"]: not a PRIMERS cat or an INTRO_PRIMERS id');
    const v = frag.cats[k];
    if (!Array.isArray(v) || !v.length || v.some((s) => !targets.has(s))) out.push('cats["' + k + '"]: a list of slugs or keys of this fragment');
  });
}

/* The kind of a parsed fragment: 'techniques', 'more', 'sheet' or 'mapless'. */
function fragmentKind(frag) {
  if (frag && frag.techniques !== undefined) return 'techniques';
  if (frag && frag.sheet !== undefined) return frag.more === true ? 'more' : 'sheet';
  return 'mapless';
}

/* The names the build reads: <sheet>.json, <sheet>.<n>.json, <sheet>.more.json, <sheet>.more.<n>.json (two writers'
   halves of one sheet's articles off the map, merged by the build in roster order), mapless[.<n>].json and
   techniques[.<n>].json. m[1] is the base, m[2] 'more', 'more.<n>' or '<n>'. */
const FRAGMENT_NAME = /^([a-z-]+?)(?:\.(more(?:\.\d+)?|\d+))?\.json$/;
/* A file named as the build names fragments must hold that kind (the build refuses the rest; this says so to a writer
   who checks one staged file): <sheet>.more[.<n>].json a .more fragment of that sheet, techniques[.<n>].json
   techniques, mapless[.<n>].json countries, <sheet>[.<n>].json that sheet's articles. Any other name (a fixture, a
   synthetic fragment of check-regions) is not judged. */
function fileNameProblems(file, frag, kind) {
  const m = FRAGMENT_NAME.exec(path.basename(String(file || '')));
  if (!m) return [];
  const base = m[1], more = /^more/.test(m[2] || '');
  const name = path.basename(String(file));
  if (base === 'techniques') {
    if (more) return [name + ': only an atlas sheet has a .more fragment'];
    return kind === 'techniques' ? [] : [name + ': a techniques file holds { techniques: [ ... ] }'];
  }
  if (base === 'mapless') return more || kind !== 'mapless' ? [name + ': a mapless file holds { countries: [ ... ] } and no sheet'] : [];
  if (SHEETS.indexOf(base) < 0) return [];
  if (more && (kind !== 'more' || frag.sheet !== base)) return [name + ': a .more file holds { sheet: "' + base + '", more: true, regions: [ ... ] }'];
  if (!more && (kind !== 'sheet' || frag.sheet !== base)) return [name + ': a sheet file holds the articles of ' + base + ' (sheet: "' + base + '"), never more: true'];
  return [];
}

function checkFragment(frag, file, codex) {
  const out = [];
  if (!frag || typeof frag !== 'object' || Array.isArray(frag)) return ['the fragment is not an object'];
  walkStrings(frag, '', (s, where) => {
    if (URL_PATH.test(where)) { urlProblems(s, where).forEach((p) => out.push(p)); return; }
    voiceProblems(s, where).concat(proseProblems(s, where)).forEach((p) => out.push(p));
  });
  const slugs = [];
  const keys = [];
  const kind = fragmentKind(frag);
  fileNameProblems(file, frag, kind).forEach((p) => out.push(p));
  if (kind === 'techniques') {
    ['sheet', 'more', 'part', 'country', 'countries', 'regions', 'aliases', 'terroirRows', 'cats'].forEach((k) => { if (frag[k] !== undefined) out.push(k + ': a techniques fragment holds techniques only'); });
    if (!Array.isArray(frag.techniques) || !frag.techniques.length) { out.push('techniques: a list of technique records'); return out; }
    const seen = [];
    frag.techniques.forEach((t, i) => { checkTechnique(t, i, codex, out); if (t && t.slug) seen.push(t.slug); });
    if (new Set(seen).size !== seen.length) out.push('techniques: duplicate slugs');
    return out;
  }
  if (kind === 'more' || kind === 'sheet') {
    if (SHEETS.indexOf(frag.sheet) < 0) { out.push('sheet: one of ' + SHEETS.join(', ')); return out; }
    if (frag.more !== undefined && frag.more !== true) out.push('more: true (a fragment of articles off the map) or omitted');
  }
  if (kind === 'more') {
    /* <sheet>.more.json: the roster's articles off the map for the sheet, in roster order, and nothing else */
    ['part', 'country', 'countries'].forEach((k) => { if (frag[k] !== undefined) out.push(k + ': a .more fragment carries no ' + k); });
    const roster = ROSTER.MORE[frag.sheet] || [];
    if (!roster.length) out.push('more: the roster holds no article off the map for ' + frag.sheet);
    if (!Array.isArray(frag.regions) || !frag.regions.length) out.push('regions: the roster\'s articles off the map for ' + frag.sheet + ' in roster order (' + roster.map((a) => a.slug).join(', ') + ')');
    let last = -1;
    (Array.isArray(frag.regions) ? frag.regions : []).forEach((r, k) => {
      const at = roster.findIndex((a) => r && a.slug === r.slug);
      if (at < 0) out.push('regions[' + k + '].slug: ' + JSON.stringify(r && r.slug) + ' is no roster article off the map for ' + frag.sheet + ' (' + roster.map((a) => a.slug).join(', ') + ')');
      else if (at <= last) out.push('regions[' + k + ']: the articles go in roster order (' + roster.map((a) => a.slug).join(', ') + ')');
      else last = at;
      checkRegion(r, k, frag.sheet, codex, out, at < 0 ? null : roster[at]);
      if (r && r.slug) slugs.push(r.slug);
    });
    if (new Set(slugs).size !== slugs.length) out.push('regions: duplicate slugs');
    keys.push(frag.sheet);
  } else if (kind === 'sheet') {
    const want = codex.atlas.sheets[frag.sheet].regions.length;
    /* a part holds some of a sheet's regions: part: { indices: [0, 1, 2], country: true } (the country record rides with the part that says so) */
    const part = frag.part && typeof frag.part === 'object' ? frag.part : null;
    if (part && (!Array.isArray(part.indices) || !part.indices.length || part.indices.some((i) => !Number.isInteger(i) || i < 0 || i >= want))) out.push('part.indices: positions within 0 to ' + (want - 1));
    const indices = part && Array.isArray(part.indices) ? part.indices : Array.from({ length: want }, (_, i) => i);
    if (!Array.isArray(frag.regions) || frag.regions.length !== indices.length) out.push('regions: ' + indices.length + ' articles in map order (' + (Array.isArray(frag.regions) ? frag.regions.length : 'none') + ')');
    (Array.isArray(frag.regions) ? frag.regions : []).forEach((r, k) => { const i = indices[k] === undefined ? k : indices[k]; checkRegion(r, i, frag.sheet, codex, out); if (r && r.slug) slugs.push(r.slug); });
    if (new Set(slugs).size !== slugs.length) out.push('regions: duplicate slugs');
    keys.push(frag.sheet);
    const wantsCountry = !part || part.country === true;
    if (wantsCountry) checkCountry(frag.country, 'country', codex, out, frag.sheet, part ? null : slugs);
    else if (frag.country !== undefined) out.push('country: only the part that says part.country: true carries the country');
    if (frag.countries !== undefined) out.push('countries: a sheet fragment carries one country');
  } else {
    if (!Array.isArray(frag.countries) || !frag.countries.length) { out.push('countries: a mapless fragment holds a list of countries'); return out; }
    frag.countries.forEach((c, i) => { checkCountry(c, 'countries[' + i + ']', codex, out, null, []); if (c && c.key) keys.push(c.key); });
    if (new Set(keys).size !== keys.length) out.push('countries: duplicate keys');
  }
  checkJoin(frag, out, slugs, keys, codex);
  return out;
}

module.exports = {
  checkFragment, loadCodex, voiceProblems, proseProblems, urlProblems, superlativeNotes, walkStrings, fold, words, placesWords, placesSplit,
  checkVideos, checkDeeper, aliasKeyProblems, regionsOrderOk, fragmentKind, fileNameProblems, isDeepened, companies,
  SHEETS, MAPLESS, MAPLESS_FIRST, NEW_MAPLESS_KEYS, COUNTRY_KEYS, COUNTRY_WORDS, SHEET_WORDS, LEVELS, DEPTHS, CAPS, DEEPER_SECS,
  TECHNIQUE_KEYS, REGION_KEYS, COUNTRY_FIELDS, FRAGMENT_NAME, URL_PATH, ACCEPT_PATH, VIDEO_ID_RE, VIDEO_URL, SUPERLATIVE, ROSTER
};

if (require.main === module) {
  const file = process.argv[2];
  if (file === '--help' || file === '-h') { console.log('usage: check-fragment.cjs <fragment.json> [jsDir]'); process.exit(0); }
  const jsDir = process.argv[3] || path.join(__dirname, '..', '..', 'js');
  if (!file) { console.error('usage: check-fragment.cjs <fragment.json> [jsDir]'); process.exit(2); }
  let frag;
  try { frag = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { console.error(file + ': ' + e.message); process.exit(1); }
  const codex = loadCodex(jsDir);
  const problems = companies().problems.concat(checkFragment(frag, file, codex));
  const notes = superlativeNotes(frag);
  const kind = fragmentKind(frag);
  const n = kind === 'techniques' ? (frag.techniques || []).length : (frag.regions ? frag.regions.length : (frag.countries || []).length);
  const what = kind === 'techniques' ? ' techniques' : kind === 'more' ? ' articles off the map' : frag.regions ? ' regions' + (frag.country ? ' and its country' : '') : ' countries';
  notes.forEach((x) => console.log('note: ' + file + ': ' + x));
  if (problems.length) { console.log(problems.map((p) => file + ': ' + p).join('\n')); console.log('\ncheck-fragment: ' + problems.length + ' problem(s) in ' + file); process.exit(1); }
  console.log('check-fragment: ' + file + ' passes (' + n + what + (notes.length ? '; ' + notes.length + ' superlative note(s) to resolve' : '') + ')');
}
