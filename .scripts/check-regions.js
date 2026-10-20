/**
 * THE REGIONS IN DEPTH: THE GATE FOR codex39's DATA AND WIRING
 *
 * codex39 (the regions edition, October 2026) reads js/data-regions.js, built
 * by .scripts/regions/build-regions.cjs from the writers' fragments, and
 * js/data-service-ref.js, the service reference tables. This gate holds the
 * built file to the same rules check-fragment.cjs holds a fragment to, and
 * proves what only the whole file can prove:
 *
 *   1. the files: js/data-regions.js, the index the shell precaches, present,
 *      a classic script declaring REGIONS with its parts, under 1,100,000
 *      bytes, its header saying what built it; every reading file it names
 *      (js/regions/<part>.json, fetched on first open and never precached)
 *      present, JSON, under 400,000 bytes, stamped with the FNV-1a 64 of its
 *      own bytes, holding only the records of its part, and no stray file
 *      beside them; every index record's reading in its file, no field told
 *      twice (the grapes aside, cut to name and role in the index, and those
 *      agreeing); every string British, dash free, nothing at or above
 *      U+2190, never the retired word for study and never a numbered level,
 *      and every prose string per cent and towards (an accept list may take
 *      either). The index and the reading are merged before everything below,
 *      so every later proof reads the whole article
 *   2. coverage: every ATLAS_V2 region has exactly one article at its index,
 *      named as the atlas names it; every sheet and map-less country present
 *      once; slugs unique and never a country key
 *   3. the records: every article and country through check-fragment's own
 *      per-record rules (a synthetic fragment per sheet, a part when the
 *      sheet is incomplete, and one for the map-less countries)
 *   4. the join: every alias, terroir row, chapter, grape and country-only
 *      entry resolves to an article or a country of the file; an alias names
 *      one target, or a list of targets in different countries
 *   5. the questions: every id an r- id, unique across the file, and the
 *      keyed positions of the multiple choice dealt evenly within every
 *      article and country (no position keyed more than once over another)
 *   6. the house: every wine of the shipped pack that names a region resolves
 *      through .scripts/regions/regions-join.cjs, the resolver codex39's
 *      v39SlugFor mirrors; the line reads
 *      "house wines: n of N resolve, a to an article, c to a country" and
 *      anything under 100 per cent fails; and codex39.js, loaded beside the
 *      data, answers every house string, name and alias as regions-join does
 *   7. the service references: js/data-service-ref.js, when present, under
 *      the same voice rules and the shape .scripts/regions/service-ref-schema.json
 *      gives (the ten tables with their columns, 8 to 40 rows each, every row
 *      the columns' length, 20 to 40 cards, 12 to 24 multiple choice questions)
 *   8. the wiring: codex39.js declares with var and function only, names
 *      nobody and ships no key; index.html loads data-regions.js,
 *      data-service-ref.js and codex39.js after codex38.js, followed by the
 *      exact data-cellar-compass.js, codex40.js and codex41.js triple when
 *      present, then boot.js, each once with ?v=; sw.js lists the three after
 *      codex38.js and its CACHE is past codex-v95, keeps js/regions/ out of
 *      ASSETS and serves it from a cache of its own that a bump never reaps;
 *      codex39.js merges a reading file into the index as the build splits
 *      it; the places of every article and map-less country, drawn by the
 *      layer, set no bare level name beside a place (a depth reads asked from
 *      Premier Cru, never Premier Cru alone, which would pass for the place's
 *      own cru), every depth drawn once naming its level, and the key heads
 *      The places whenever a place carries one; the seven gates that list
 *      codex38.js list codex39.js too
 *   9. the Village tasting: four wines, two white and two red, the written
 *      grid, 45 minutes. In a sandbox standing in for codex20, the Quizzes
 *      row reads so; the run deals four GRAPES profiles of the level, two
 *      whites then two reds, under a 45 minute clock with the shape
 *      four-wines (the clock drawn only for that shape); and a pool short of
 *      two of either colour keeps gridStart's four. The clock counts from a
 *      stored end time: answers that draw the grid again never reset it or
 *      start a second timer, and leaving the grid holds what is left. Pour
 *      another flight (codex20's gridAgain) deals the tasting again, a
 *      Finals grid still moves on through codex21's branch, and any other
 *      grid keeps codex20's own again
 *
 * Usage:
 *   node .scripts/check-regions.js [jsDir] [--pack <path>]
 *
 * jsDir defaults to this repo's js/ and may be the site's wing copy
 * (codex/js). The pack defaults to <jsDir>/../../shared/packs/
 * brennans-new-orleans.v1.oothouse.json when that exists (the site's layout),
 * else OOT_SHARED/packs/..., else the site checkout beside this repo's home.
 *
 * Exits non-zero on any failure. The last line is the verdict.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const CF = require(path.join(__dirname, 'regions', 'check-fragment.cjs'));
const JOIN = require(path.join(__dirname, 'regions', 'regions-join.cjs'));
const SR_SCHEMA = JSON.parse(fs.readFileSync(path.join(__dirname, 'regions', 'service-ref-schema.json'), 'utf8'));

const ARGS = process.argv.slice(2);
if (ARGS.indexOf('--help') >= 0 || ARGS.indexOf('-h') >= 0) {
  console.log('usage: node .scripts/check-regions.js [jsDir] [--pack <path>]');
  process.exit(0);
}
let PACK_ARG = null;
const positional = [];
for (let i = 0; i < ARGS.length; i++) {
  if (ARGS[i] === '--pack') PACK_ARG = ARGS[++i];
  else if (ARGS[i].charAt(0) === '-') { console.error('check-regions: unknown option ' + ARGS[i]); process.exit(2); }
  else positional.push(ARGS[i]);
}
const JS = positional[0] || path.join(__dirname, '..', 'js');
const ROOT = path.join(JS, '..');
const PACK_NAME = path.join('packs', 'brennans-new-orleans.v1.oothouse.json');
const SITE_PACK = '/home/user/zpullen98-gif.github.io/shared/' + PACK_NAME;
function packPath() {
  if (PACK_ARG) return PACK_ARG;
  const beside = path.join(JS, '..', '..', 'shared', PACK_NAME);
  if (fs.existsSync(beside)) return beside;
  if (process.env.OOT_SHARED && fs.existsSync(path.join(process.env.OOT_SHARED, PACK_NAME))) return path.join(process.env.OOT_SHARED, PACK_NAME);
  return SITE_PACK;
}
const PACK = packPath();
/* The whole build is near 2.9 MB: too much for the shell precache a phone downloads at install. The index the
   shell precaches is held to its own limit and each reading file, fetched on first open, to another. */
const MAX_INDEX_BYTES = 1100000;
const MAX_PART_BYTES = 400000;
const PARTS_DIR = 'regions';
const PAST_CACHE = 95;
const HEADER_LINE = 'built by .scripts/regions/build-regions.cjs from .scripts/regions/fragments, never edited by hand';
const SEVEN = ['check-home.js', 'check-merge.js', 'check-components.js', 'check-nav.js', 'check-atlas-ui.js', 'check-videos.js', 'check-winelist.js'];

let passed = 0, failed = 0;
function check(what, ok, detail) {
  if (ok) { passed++; console.log('  ok    ' + what); }
  else { failed++; console.log('  FAIL  ' + what + (detail ? '  :: ' + detail : '')); }
}
function section(name) { console.log(''); console.log('--- ' + name + ' ---'); }
function few(list, n) { return list.slice(0, n || 8).join('; ') + (list.length > (n || 8) ? '; and ' + (list.length - (n || 8)) + ' more' : ''); }
const NUMERAL_RE = /\bLevel\s+(I|II|III|IV)\b/;
/* The strictest voice rule a layer's source is held to (check-producers-house's): a layer's CSS says color, so no spelling rule here. */
function layerProblems(s) {
  const out = [];
  if (s.indexOf(String.fromCharCode(0x2014)) >= 0) out.push('a long dash (U+2014)');
  if (s.indexOf(String.fromCharCode(0x2013)) >= 0) out.push('an en dash (U+2013)');
  if (/&(mdash|ndash|#8212|#8211|#x2014|#x2013);/i.test(s)) out.push('a dash entity');
  if (/\x20-{2}\x20/.test(s)) out.push('a double hyphen');
  if (/practi[cs]e/i.test(s.replace(/(^|[^\w])Practise(?!\w)/g, '$1'))) out.push('the retired word for study'); /* the tab word Practise, that exact token, is the one use let through */
  if (NUMERAL_RE.test(s)) out.push('a level numeral: ' + s.match(NUMERAL_RE)[0]);
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c >= 0x2190) { out.push('a mark U+' + c.toString(16).toUpperCase()); break; }
  }
  return out;
}
function unescape(src) { return src.replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16))); }
function loadData(file) {
  const ctx = { window: {}, self: {} }; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: path.basename(file) });
  return ctx;
}

/* ================================================================ */
section('1. the index and the reading files');
const codex = CF.loadCodex(JS);
const atlas = codex.atlas;
const REG_FILE = path.join(JS, 'data-regions.js');
const BUILD = require(path.join(__dirname, 'regions', 'build-regions.cjs'));
let R = null;
let regBytes = 0;
let partBytes = 0;
let partCount = 0;
const proseOf = (v, where) => { const out = []; CF.walkStrings(v, where, (s, w) => CF.proseProblems(s, w).forEach((p) => out.push(p))); return out; };
check('js/data-regions.js is present', fs.existsSync(REG_FILE), REG_FILE);
if (fs.existsSync(REG_FILE)) {
  const text = fs.readFileSync(REG_FILE, 'utf8');
  regBytes = Buffer.byteLength(text, 'utf8');
  check('the index is under 1,100,000 bytes (the shell precaches it)', regBytes < MAX_INDEX_BYTES, regBytes + ' bytes');
  check('its header says what built it, never a hand', text.split('\n')[0].indexOf(HEADER_LINE) >= 0);
  try { R = loadData(REG_FILE).REGIONS; } catch (e) { check('parses as a classic script', false, e.message); }
  if (R) check('declares REGIONS with regions, countries, join and parts', Array.isArray(R.regions) && R.countries && typeof R.countries === 'object' && R.join && typeof R.join === 'object' && R.parts && typeof R.parts === 'object' && !Array.isArray(R.parts));
  const vp = CF.voiceProblems(text, 'data-regions.js');
  check('the index: every string British, dash free, nothing at or above U+2190, never the retired word, never a numbered level', vp.length === 0, few(vp));
}
if (!R || !Array.isArray(R.regions) || !R.countries || !R.join) R = { regions: Array.isArray(R && R.regions) ? R.regions : [], countries: (R && R.countries) || {}, join: (R && R.join) || {}, parts: (R && R.parts) || {} };
const PARTS = R.parts && typeof R.parts === 'object' && !Array.isArray(R.parts) ? R.parts : {};
const PDIR = path.join(JS, PARTS_DIR);
/* the part each index record reads from, as the build assigns it */
const wantPart = {};
R.regions.forEach((r) => { if (r && r.slug) wantPart[r.slug] = BUILD.partName(r, false); });
Object.keys(R.countries).forEach((k) => { if (R.countries[k]) wantPart[k] = BUILD.partName(R.countries[k], true); });
const neededParts = Array.from(new Set(Object.values(wantPart))).sort();
check('REGIONS.parts names exactly the reading files the records need (' + neededParts.length + ')', JSON.stringify(Object.keys(PARTS).sort()) === JSON.stringify(neededParts), 'parts: ' + Object.keys(PARTS).sort().join(', ') + '; needed: ' + neededParts.join(', '));
const partProblems = [];
const partVoice = [];
const partStrays = fs.existsSync(PDIR) ? fs.readdirSync(PDIR).filter((f) => !(/\.json$/.test(f) && Object.prototype.hasOwnProperty.call(PARTS, f.slice(0, -5)))) : [];
const reading = {};
Object.keys(PARTS).sort().forEach((p) => {
  const f = path.join(PDIR, p + '.json');
  if (!fs.existsSync(f)) { partProblems.push(p + ': ' + f + ' is missing'); return; }
  const raw = fs.readFileSync(f, 'utf8');
  const bytes = Buffer.byteLength(raw, 'utf8');
  partBytes += bytes; partCount++;
  if (bytes >= MAX_PART_BYTES) partProblems.push(p + ': ' + bytes + ' bytes, over ' + MAX_PART_BYTES);
  if (BUILD.stampOf(raw) !== PARTS[p]) partProblems.push(p + ': stamped ' + PARTS[p] + ' in the index, but its bytes give ' + BUILD.stampOf(raw) + ' (rebuild, so the address changes with the file)');
  CF.voiceProblems(raw, PARTS_DIR + '/' + p + '.json').forEach((x) => partVoice.push(x));
  let d = null;
  try { d = JSON.parse(raw); } catch (e) { partProblems.push(p + ': ' + e.message); return; }
  if (!d || d.part !== p || !d.records || typeof d.records !== 'object' || Array.isArray(d.records)) { partProblems.push(p + ': { part: "' + p + '", records: { ... } }'); return; }
  Object.keys(d.records).forEach((k) => {
    if (wantPart[k] !== p) { partProblems.push(p + ': holds ' + k + ', which ' + (wantPart[k] ? 'reads from ' + wantPart[k] : 'is no record of the index')); return; }
    reading[k] = d.records[k];
  });
});
check('every reading file is present, JSON, under 400,000 bytes, stamped with its own bytes and holding only its part (' + partCount + ' files, ' + partBytes + ' bytes)', partProblems.length === 0, few(partProblems));
check('no stray file in js/regions/', partStrays.length === 0, few(partStrays));
check('the reading files: every string British, dash free, nothing at or above U+2190, never the retired word, never a numbered level', partVoice.length === 0, few(partVoice));
/* the merge: every record's reading put back on its index record, as codex39's v39TakePart does */
const mergeProblems = [];
const INDEX_KEYS = { region: BUILD.INDEX_REGION, country: BUILD.INDEX_COUNTRY };
const mergeOne = (rec, k, keys) => {
  const rd = reading[k];
  if (!rd) { mergeProblems.push(k + ': no reading in ' + PARTS_DIR + '/' + wantPart[k] + '.json'); return; }
  Object.keys(rec).forEach((f) => { if (keys.indexOf(f) < 0 && f !== 'grapes') mergeProblems.push(k + ': the index carries ' + f + ', a reading field'); });
  Object.keys(rd).forEach((f) => { if (keys.indexOf(f) >= 0) mergeProblems.push(k + ': the reading repeats ' + f + ', an index field'); });
  const lite = Array.isArray(rec.grapes) ? rec.grapes : [];
  const full = Array.isArray(rd.grapes) ? rd.grapes : [];
  if (JSON.stringify(lite) !== JSON.stringify(full.map((g) => ({ name: g && g.name, role: g && g.role })))) mergeProblems.push(k + ': the index grapes are not the reading\'s grapes cut to name and role');
  Object.keys(rd).forEach((f) => { rec[f] = rd[f]; });
};
R.regions.forEach((r) => { if (r && r.slug) mergeOne(r, r.slug, INDEX_KEYS.region); });
Object.keys(R.countries).forEach((k) => { if (R.countries[k]) mergeOne(R.countries[k], k, INDEX_KEYS.country); });
check('every record\'s reading is in its file and no field is told twice (the grapes in the index cut to name and role)', mergeProblems.length === 0, few(mergeProblems));
const pp = proseOf(R.regions, 'regions').concat(proseOf(R.countries, 'countries'));
check('every prose string says per cent and towards, never percent or toward (an accept list may take either)', pp.length === 0, few(pp));

/* ================================================================ */
section('2. coverage');
const bySheet = {};
const strays = [];
CF.SHEETS.forEach((s) => { bySheet[s] = atlas.sheets[s].regions.map(() => []); });
R.regions.forEach((r, i) => {
  if (!r || typeof r !== 'object' || !bySheet[r.sheet] || !Number.isInteger(r.index) || !bySheet[r.sheet][r.index]) { strays.push('regions[' + i + '] (' + (r && (r.slug || r.name)) + ')'); return; }
  bySheet[r.sheet][r.index].push(r);
});
check('every article names a sheet and an index of ATLAS_V2', strays.length === 0, few(strays));
const missingRegions = [];
const doubled = [];
const misnamed = [];
CF.SHEETS.forEach((s) => bySheet[s].forEach((list, i) => {
  const want = atlas.sheets[s].regions[i].name;
  if (!list.length) missingRegions.push(s + ' ' + i + ' (' + want + ')');
  if (list.length > 1) doubled.push(s + ' ' + i + ' (' + list.map((r) => r.slug).join(', ') + ')');
  list.forEach((r) => { if (r.name !== want) misnamed.push(r.slug + ': "' + r.name + '" for "' + want + '"'); });
}));
const total = CF.SHEETS.reduce((n, s) => n + atlas.sheets[s].regions.length, 0);
check('every ATLAS_V2 region has an article at its index (' + (total - missingRegions.length) + ' of ' + total + ')', missingRegions.length === 0, 'missing: ' + few(missingRegions, 12));
check('no index is written twice', doubled.length === 0, few(doubled));
check('every article is named exactly as the atlas names its region', misnamed.length === 0, few(misnamed));
const countryKeys = Object.keys(R.countries);
const wantKeys = CF.SHEETS.concat(CF.MAPLESS);
const missingCountries = wantKeys.filter((k) => !R.countries[k]);
const strayCountries = countryKeys.filter((k) => wantKeys.indexOf(k) < 0);
const mismatchedKeys = countryKeys.filter((k) => R.countries[k] && R.countries[k].key !== k);
check('every sheet and map-less country is present (' + (wantKeys.length - missingCountries.length) + ' of ' + wantKeys.length + ')', missingCountries.length === 0, 'missing: ' + few(missingCountries, 24));
check('no country outside the atlas sheets and the map-less list', strayCountries.length === 0, few(strayCountries));
check('every country record carries its own key', mismatchedKeys.length === 0, few(mismatchedKeys));
const slugs = R.regions.map((r) => r && r.slug);
const dupSlugs = slugs.filter((s, i) => s && slugs.indexOf(s) !== i);
const keyLike = slugs.filter((s) => s && wantKeys.indexOf(s) >= 0);
check('slugs are unique', dupSlugs.length === 0, few(dupSlugs));
check('no slug equals a country key', keyLike.length === 0, few(keyLike));
/* asked is closed upwards by the build: a region the exam asks at a level is asked at every level above it, so the
   Quick quiz's region picks at Premier Cru hold every region Village asks */
const openAsked = R.regions.filter((r) => r && r.slug && JSON.stringify(r.asked) !== JSON.stringify(BUILD.closeAsked(r.asked))).map((r) => r.slug + ' (' + (r.asked || []).join(', ') + ')');
check('every article is asked at every level above the lowest that asks it', openAsked.length === 0, few(openAsked, 12));
const targets = new Set(slugs.filter(Boolean).concat(countryKeys));

/* ================================================================ */
section('3. the records, by check-fragment\'s rules');
CF.SHEETS.forEach((s) => {
  const present = [];
  bySheet[s].forEach((list, i) => { if (list.length === 1) present.push(i); });
  const country = R.countries[s];
  if (!present.length && !country) { check(s + ': nothing to check yet', false, 'no article and no country'); return; }
  const complete = present.length === bySheet[s].length;
  const frag = { sheet: s, regions: present.map((i) => bySheet[s][i][0]) };
  if (complete && country) frag.country = country;
  else { frag.part = { indices: present, country: !!country }; if (country) frag.country = country; }
  if (!complete) { check(s + ': complete', false, (bySheet[s].length - present.length) + ' of ' + bySheet[s].length + ' articles missing'); }
  if (!country) check(s + ': its country', false, 'missing');
  const problems = CF.checkFragment(frag, s, codex);
  check(s + ': ' + present.length + ' article(s)' + (country ? ' and the country' : '') + ' pass the per-record rules', problems.length === 0, few(problems, 10));
});
const maplessPresent = CF.MAPLESS.filter((k) => R.countries[k]);
if (maplessPresent.length) {
  const problems = CF.checkFragment({ countries: maplessPresent.map((k) => R.countries[k]) }, 'mapless', codex);
  check('mapless: ' + maplessPresent.length + ' countries pass the per-record rules', problems.length === 0, few(problems, 10));
} else check('mapless: nothing to check yet', false, 'no map-less country');

/* ================================================================ */
section('4. the join');
const J = R.join;
const jp = [];
const aliases = J.aliases && typeof J.aliases === 'object' ? J.aliases : null;
/* an alias names one target, or a list of two or more when the key is a place in each of two or more countries (never two in one) */
const countryOfTarget = (t) => { const r = R.regions.find((x) => x && x.slug === t); return r ? JOIN.countryGroup(r.sheet) : (R.countries[t] ? JOIN.countryGroup(t) : null); };
if (!aliases) jp.push('aliases: an object'); else Object.keys(aliases).forEach((k) => {
  if (k !== CF.fold(k)) jp.push('aliases["' + k + '"]: not folded');
  const v = aliases[k];
  if (Array.isArray(v) && (v.length < 2 || v.some((t) => typeof t !== 'string'))) jp.push('aliases["' + k + '"]: a target, or a list of two or more');
  else if (!Array.isArray(v) && typeof v !== 'string') jp.push('aliases["' + k + '"]: a target, or a list of two or more');
  const list = JOIN.targetList(v);
  list.forEach((t) => { if (!targets.has(t)) jp.push('aliases["' + k + '"]: ' + t + ' resolves to nothing'); });
  const seen = {};
  list.forEach((t) => { const c = countryOfTarget(t); if (c && seen[c]) jp.push('aliases["' + k + '"]: ' + seen[c] + ' and ' + t + ' are two targets in one country'); if (c) seen[c] = t; });
});
const aliasHasCountry = (k) => !!aliases && JOIN.targetList(aliases[k]).some((t) => !!R.countries[t]);
const terroir = J.terroir && typeof J.terroir === 'object' ? J.terroir : null;
if (!terroir) jp.push('terroir: an object'); else Object.keys(terroir).forEach((k) => {
  if (!codex.terroir.has(k)) jp.push('terroir["' + k + '"]: not a TERROIR row name');
  if (!targets.has(terroir[k])) jp.push('terroir["' + k + '"]: ' + terroir[k] + ' resolves to nothing');
});
const cats = J.cats && typeof J.cats === 'object' ? J.cats : null;
if (!cats) jp.push('cats: an object'); else Object.keys(cats).forEach((k) => {
  if (!codex.cats.has(k)) jp.push('cats["' + k + '"]: not a PRIMERS cat or an INTRO_PRIMERS id');
  if (!Array.isArray(cats[k]) || !cats[k].length) jp.push('cats["' + k + '"]: an empty list');
  else cats[k].forEach((s) => { if (!targets.has(s)) jp.push('cats["' + k + '"]: ' + s + ' resolves to nothing'); });
});
const grapes = J.grapes && typeof J.grapes === 'object' ? J.grapes : null;
if (!grapes) jp.push('grapes: an object'); else Object.keys(grapes).forEach((k) => {
  if (!Array.isArray(grapes[k]) || !grapes[k].length) jp.push('grapes["' + k + '"]: an empty list');
  else grapes[k].forEach((s) => { if (!targets.has(s)) jp.push('grapes["' + k + '"]: ' + s + ' resolves to nothing'); });
});
const countryOnly = Array.isArray(J.countryOnly) ? J.countryOnly : null;
if (!countryOnly) jp.push('countryOnly: a list'); else {
  countryOnly.forEach((k) => { if (!R.countries[k] && !aliasHasCountry(k)) jp.push('countryOnly: ' + k + ' is no country key and no alias to one'); });
  countryKeys.forEach((k) => { if (countryOnly.indexOf(k) < 0) jp.push('countryOnly: lacks the country key ' + k); });
  if (aliases) Object.keys(aliases).forEach((k) => { if (aliasHasCountry(k) && countryOnly.indexOf(k) < 0) jp.push('countryOnly: lacks the alias ' + k + ' (to ' + JOIN.targetList(aliases[k]).join(', ') + ')'); });
}
check('every join entry resolves (' + (aliases ? Object.keys(aliases).length : 0) + ' aliases, ' + (terroir ? Object.keys(terroir).length : 0) + ' terroir rows, ' + (cats ? Object.keys(cats).length : 0) + ' chapters, ' + (grapes ? Object.keys(grapes).length : 0) + ' grapes, ' + (countryOnly ? countryOnly.length : 0) + ' country-only keys)', jp.length === 0, few(jp, 12));

/* ================================================================ */
section('5. the questions');
const ids = {};
const idProblems = [];
let nQuestions = 0, nCards = 0;
const takeIds = (owner, rec) => {
  (rec.questions || []).forEach((q, i) => {
    nQuestions++;
    const where = owner + '.questions[' + i + ']';
    if (!q || !/^r-[0-9a-z]{8}$/.test(q.id || '')) { idProblems.push(where + ': no r- id'); return; }
    if (ids[q.id]) idProblems.push(where + ': duplicate id ' + q.id + ' (' + ids[q.id] + ')');
    ids[q.id] = where;
  });
  nCards += (rec.cards || []).length;
};
R.regions.forEach((r) => { if (r && r.slug) takeIds(r.slug, r); });
countryKeys.forEach((k) => takeIds(k, R.countries[k]));
check('every question carries an r- id, unique across the file (' + nQuestions + ' questions)', nQuestions > 0 && idProblems.length === 0, nQuestions ? few(idProblems) : 'no questions');
/* the builder deals the keyed positions round robin (bakeOptionOrder), since the engine never shuffles options: within one
   article or country no position may be keyed more than once over any other */
const dealProblems = [];
let nMc = 0;
const dealOf = (owner, rec) => {
  const counts = [0, 0, 0, 0];
  (rec.questions || []).forEach((q) => { if (q && q.sa !== 1 && Array.isArray(q.opts) && q.opts.length === 4 && Number.isInteger(q.a) && q.a >= 0 && q.a < 4) { counts[q.a]++; nMc++; } });
  if (Math.max.apply(null, counts) - Math.min.apply(null, counts) > 1) dealProblems.push(owner + ' keys the positions ' + counts.join('/'));
};
R.regions.forEach((r) => { if (r && r.slug) dealOf(r.slug, r); });
countryKeys.forEach((k) => dealOf(k, R.countries[k]));
check('the keyed positions are dealt evenly within every article and country, no position more than once over another (' + nMc + ' multiple choice)', nMc > 0 && dealProblems.length === 0, nMc ? few(dealProblems) : 'no multiple choice');

/* ================================================================ */
section('6. the house');
let houseLine = 'house wines: no pack';
console.log('  pack: ' + PACK);
if (!fs.existsSync(PACK)) check('the shipped pack is at ' + PACK + ' (pass --pack)', false);
else {
  let pack = null;
  try { pack = JSON.parse(fs.readFileSync(PACK, 'utf8')); } catch (e) { check('the pack parses', false, e.message); }
  const wines = pack && pack.house && Array.isArray(pack.house.wines) ? pack.house.wines : [];
  const named = wines.filter((w) => w && typeof w.region === 'string' && w.region.trim());
  const index = JOIN.joinIndex(R);
  let a = 0, c = 0;
  const unresolved = {};
  named.forEach((w) => {
    const hit = JOIN.slugFor(w.region, index);
    if (hit && hit.slug) a++;
    else if (hit && hit.key) c++;
    else unresolved[w.region] = (unresolved[w.region] || 0) + 1;
  });
  const n = a + c;
  houseLine = 'house wines: ' + n + ' of ' + named.length + ' resolve, ' + a + ' to an article, ' + c + ' to a country';
  console.log('  ' + houseLine + (wines.length > named.length ? ' (' + (wines.length - named.length) + ' wines name no region)' : ''));
  const list = Object.keys(unresolved).sort().map((k) => k + (unresolved[k] > 1 ? ' (' + unresolved[k] + ')' : ''));
  check('every house wine that names a region resolves through regions-join (the rule codex39\'s v39SlugFor mirrors)', named.length > 0 && n === named.length, list.length ? 'unresolved: ' + few(list, 40) : 'no wines');
  /* the mirror: codex39.js loaded beside the data answers every house string, every region and country name and every
     alias exactly as regions-join does, so the two copies can never drift */
  const L39F = path.join(JS, 'codex39.js');
  if (fs.existsSync(L39F) && fs.existsSync(REG_FILE)) {
    let appSlug = null;
    try {
      const actx = { console: { log() {}, warn() {}, error() {} }, S: {}, render: function () {}, window: {}, setTimeout: setTimeout, clearTimeout: clearTimeout };
      actx.self = actx; vm.createContext(actx);
      vm.runInContext(fs.readFileSync(REG_FILE, 'utf8'), actx, { filename: 'data-regions.js' });
      vm.runInContext(fs.readFileSync(L39F, 'utf8'), actx, { filename: 'codex39.js' });
      appSlug = typeof actx.v39SlugFor === 'function' ? actx.v39SlugFor : null;
      if (!appSlug) check('codex39.js declares v39SlugFor', false);
    } catch (e) { check('codex39.js loads beside the data for the resolver proof', false, e.message); }
    if (appSlug) {
      const strings = named.map((w) => w.region);
      R.regions.forEach((r) => { if (r && r.name) strings.push(r.name, r.name + ', ' + ((R.countries[r.sheet] && R.countries[r.sheet].name) || r.sheet)); });
      countryKeys.forEach((k) => strings.push(k, (R.countries[k] && R.countries[k].name) || k));
      if (aliases) Object.keys(aliases).forEach((k) => strings.push(k, k + ', Spain', k + ', USA'));
      const diffs = [];
      strings.forEach((s) => {
        const h = JOIN.slugFor(s, index);
        const t = h ? (h.slug || h.key) : '';
        let a;
        try { a = appSlug(s) || ''; } catch (e) { a = 'threw ' + e.message; }
        if (a !== t) diffs.push('"' + s + '": regions-join ' + (t || 'nothing') + ', v39SlugFor ' + (a || 'nothing'));
      });
      check('codex39\'s v39SlugFor answers as regions-join does on all ' + strings.length + ' strings (the ' + named.length + ' house strings, every name, every alias)', diffs.length === 0, few(diffs, 12));
    }
  }
}

/* ================================================================ */
section('7. the service references');
const SR_FILE = path.join(JS, 'data-service-ref.js');
let srCards = 0, srQuestions = 0;
if (!fs.existsSync(SR_FILE)) console.log('  note  no js/data-service-ref.js yet; its shape is not checked (the shell check below still asks for it)');
else {
  const text = fs.readFileSync(SR_FILE, 'utf8');
  // External URL slugs retain the publisher's spelling; visible source titles
  // and all teaching text still follow the house voice. Validate URLs below.
  const serviceProse = text.replace(/("url"\s*:\s*)"https?:\/\/[^"]*"/g, '$1""');
  const vp = CF.voiceProblems(serviceProse, 'data-service-ref.js');
  check('data-service-ref.js: every visible string British, dash free, nothing at or above U+2190, never the retired word', vp.length === 0, few(vp));
  let SR = null;
  try { SR = loadData(SR_FILE).SERVICE_REF; } catch (e) { check('data-service-ref.js parses as a classic script', false, e.message); }
  if (SR) { const sp2 = proseOf(JSON.parse(JSON.stringify(SR, (key, value) => key === 'url' ? '' : value)), 'SERVICE_REF'); check('data-service-ref.js: every prose string says per cent and towards', sp2.length === 0, few(sp2)); }
  const sp = [];
  if (!SR || typeof SR !== 'object') sp.push('declares SERVICE_REF');
  else {
    const req = SR_SCHEMA.tables_required;
    const tables = Array.isArray(SR.tables) ? SR.tables : [];
    if (!Array.isArray(SR.tables)) sp.push('tables: a list');
    const keys = tables.map((t) => t && t.key);
    Object.keys(req).forEach((k) => {
      const have = tables.filter((t) => t && t.key === k);
      if (have.length !== 1) { sp.push('tables: ' + k + ' ' + (have.length ? 'twice' : 'missing')); return; }
      const t = have[0];
      const w = 'tables[' + k + ']';
      if (!t.title || typeof t.title !== 'string') sp.push(w + '.title: required');
      if (t.line !== undefined && typeof t.line !== 'string') sp.push(w + '.line: a sentence');
      if (!Array.isArray(t.columns) || t.columns.join('\u0001') !== req[k].join('\u0001')) sp.push(w + '.columns: exactly ' + JSON.stringify(req[k]));
      const rows = Array.isArray(t.rows) ? t.rows : [];
      if (!Array.isArray(t.rows) || rows.length < 8 || rows.length > 40) sp.push(w + '.rows: 8 to 40 rows (' + rows.length + ')');
      rows.forEach((row, i) => {
        if (!Array.isArray(row) || row.length !== req[k].length || row.some((cell) => typeof cell !== 'string')) sp.push(w + '.rows[' + i + ']: ' + req[k].length + ' strings');
        else if (!row[0].trim()) sp.push(w + '.rows[' + i + ']: the first cell is the row\'s name');
      });
      if (t.notes !== undefined && (!Array.isArray(t.notes) || t.notes.length > 6 || t.notes.some((x) => typeof x !== 'string'))) sp.push(w + '.notes: 0 to 6 lines');
      if (t.say !== undefined) (Array.isArray(t.say) ? t.say : []).forEach((p, i) => { if (!Array.isArray(p) || p.length !== 2 || !p[0] || !p[1] || !/[A-Z]{2,}/.test(p[1])) sp.push(w + '.say[' + i + ']: a pair, the respelling capping its stressed syllable'); });
      if (t.sources !== undefined) (Array.isArray(t.sources) ? t.sources : []).forEach((s, i) => {
        if (!s || !s.title || !s.asOf) sp.push(w + '.sources[' + i + ']: title and asOf');
        if (s && s.url !== undefined) {
          try {
            const u = new URL(s.url);
            if (!/^https?:$/.test(u.protocol) || !u.hostname || u.username || u.password) throw new Error('unsafe URL');
          } catch (_) { sp.push(w + '.sources[' + i + '].url: an absolute public http or https URL'); }
        }
      });
    });
    keys.forEach((k) => { if (k && !req[k]) sp.push('tables: ' + k + ' is no table of the schema'); });
    const cards = Array.isArray(SR.cards) ? SR.cards : [];
    srCards = cards.length;
    if (cards.length < 20 || cards.length > 40) sp.push('cards: 20 to 40 (' + cards.length + ')');
    cards.forEach((c, i) => {
      if (!c || typeof c.f !== 'string' || CF.words(c.f) < 3) sp.push('cards[' + i + '].f: a front of at least three words');
      if (!c || typeof c.b !== 'string' || CF.words(c.b) < 1 || CF.words(c.b) > 40) sp.push('cards[' + i + '].b: a back of at most 40 words');
    });
    const qs = Array.isArray(SR.questions) ? SR.questions : [];
    const svcIds = {};
    srQuestions = qs.length;
    if (qs.length < 12 || qs.length > 24) sp.push('questions: 12 to 24 (' + qs.length + ')');
    const stems = new Set();
    qs.forEach((q, i) => {
      const w = 'questions[' + i + ']';
      if (!q || typeof q !== 'object') { sp.push(w + ': an object'); return; }
      if (q.sa !== undefined) sp.push(w + ': all multiple choice');
      if (typeof q.cat !== 'string' || !q.cat.trim()) sp.push(w + '.cat: required');
      if (typeof q.q !== 'string' || CF.words(q.q) < 5) sp.push(w + '.q: a stem of at least five words');
      if (/\b(NOT|EXCEPT)\b/.test(q.q || '') || /all of the above|none of the above/i.test((q.opts || []).join(' '))) sp.push(w + ': no NOT, EXCEPT, all or none of the above');
      if (q.q && stems.has(CF.fold(q.q))) sp.push(w + ': a duplicate stem');
      stems.add(CF.fold(q.q || ''));
      if (!Array.isArray(q.opts) || q.opts.length !== 4 || q.opts.some((o) => typeof o !== 'string' || !o.trim())) sp.push(w + '.opts: four strings');
      else if (new Set(q.opts.map(CF.fold)).size !== 4) sp.push(w + '.opts: four distinct options');
      if (!Number.isInteger(q.a) || q.a < 0 || q.a > 3) sp.push(w + '.a: an index 0 to 3');
      if (typeof q.exp !== 'string' || CF.words(q.exp) < 10 || CF.words(q.exp) > 60) sp.push(w + '.exp: 10 to 60 words');
      /* every question carries the s- id it was minted once (codex39 deals none without one, so no answer is kept under a stem) */
      if (typeof q.id !== 'string' || !BUILD.SERVICE_ID_RE.test(q.id)) sp.push(w + '.id: an s- id, minted once (pin "' + BUILD.mintServiceId(q.q || '') + '")');
      else if (ids[q.id]) sp.push(w + '.id: ' + q.id + ' is a regions id');
      else if (svcIds[q.id]) sp.push(w + '.id: ' + q.id + ' twice');
      if (typeof q.id === 'string') svcIds[q.id] = 1;
    });
  }
  check('SERVICE_REF has the ten tables with their columns, 8 to 40 rows each of the columns\' length, 20 to 40 cards and 12 to 24 multiple choice questions with exp and a unique s- id', sp.length === 0, few(sp, 12));
}

/* ================================================================ */
section('8. the wiring');
const L39 = path.join(JS, 'codex39.js');
check('js/codex39.js is present', fs.existsSync(L39), L39);
if (fs.existsSync(L39)) {
  const src = fs.readFileSync(L39, 'utf8');
  const lp = layerProblems(unescape(src));
  check('codex39.js: no dash, no glyph, no level numeral, never the retired word (its escapes read as what they are)', lp.length === 0, lp.join(', '));
  check('codex39.js declares with var and function only, no arrow', !/^\s*(let|const|class)\s/m.test(src) && src.indexOf('=>') < 0);
  check('codex39.js names nobody and ships no key', !/Lizzy|sk-ant|api[_-]?key/i.test(src));
  /* the loader's contract with the build: codex39 beside the index alone holds a record unread, and merging a reading
     file puts back exactly the fields the build took off */
  if (fs.existsSync(REG_FILE) && Object.keys(PARTS).length) {
    try {
      const actx = { console: { log() {}, warn() {}, error() {} }, S: {}, render: function () {}, window: {}, setTimeout: setTimeout, clearTimeout: clearTimeout };
      actx.self = actx; vm.createContext(actx);
      vm.runInContext(fs.readFileSync(REG_FILE, 'utf8'), actx, { filename: 'data-regions.js' });
      vm.runInContext(src, actx, { filename: 'codex39.js' });
      const lp2 = [];
      if (typeof actx.v39TakePart !== 'function' || typeof actx.v39PartReady !== 'function' || typeof actx.v39Record !== 'function') lp2.push('codex39.js declares v39TakePart, v39PartReady and v39Record');
      else {
        Object.keys(PARTS).forEach((p) => {
          const f = path.join(PDIR, p + '.json');
          if (!fs.existsSync(f)) return;
          if (actx.v39PartReady(p)) lp2.push(p + ': ready before its file was read');
          const d = JSON.parse(fs.readFileSync(f, 'utf8'));
          if (!actx.v39TakePart(p, d)) { lp2.push(p + ': v39TakePart refused it'); return; }
          if (!actx.v39PartReady(p)) lp2.push(p + ': not ready after its file was merged');
          Object.keys(d.records).forEach((k) => {
            const rec = actx.v39Record(k);
            const whole = R.regions.find((r) => r && r.slug === k) || R.countries[k];
            if (!rec || !whole) { lp2.push(p + ': ' + k + ' is no record'); return; }
            if (JSON.stringify(BUILD.sortKeys(rec)) !== JSON.stringify(BUILD.sortKeys(whole))) lp2.push(p + ': ' + k + ' merged is not the whole record');
          });
        });
      }
      check('codex39.js merges every reading file into the index as the build split it (v39TakePart, ' + Object.keys(PARTS).length + ' files)', lp2.length === 0, few(lp2));
    } catch (e) { check('codex39.js loads beside the index for the merge proof', false, e.message); }
  }
}
/* the layer's own dealing, in a sandbox standing in for codex32, core and codex27 with the least each wrapper needs:
   the service deck and the service drill deal (a deck on the Flashcards root graded in its own slot, a drill on
   Quizzes dealing every s- question through the engine, never scheduled, never level progress, known to qidAudit),
   the references page carries both doors, the house landing draws a region page again, and the colour rose reads rosé */
if (fs.existsSync(L39) && fs.existsSync(REG_FILE) && fs.existsSync(SR_FILE)) {
  const dp = [];
  try {
    const store = {};
    const dctx = {
      console: { log() {}, warn() {}, error() {} }, window: {}, setTimeout: setTimeout, clearTimeout: clearTimeout,
      localStorage: { getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } }
    };
    dctx.self = dctx; vm.createContext(dctx);
    vm.runInContext([
      'var S = { view: "home" }; var activeLevel = "certified"; var RENDERS = 0; var SRS = []; var V27 = 0;',
      'var V25_GO = {}, V25_AREA = {}, V25_VIEWS = {}, V25_UNDER = {}, V32_OWNER = {}, V32_PARENT = {};',
      'function render() { RENDERS++; }',
      'function resetQ() {}',
      'function v32DeckDef(id) { var d = { id: id, name: "", cards: [], kind: "house" }; d.learnt = v32Learnt(d); return d; }',
      'function v32Learnt(def) { return 0; }',
      'function v32Grade(got) { var r = S._v32run; if (r && r.flip && r.deck.length) r.deck.shift(); }',
      'function v32CardFace(c, run) { return ""; }',
      'function v32StartRun(id, o) { S._ran = id; return true; }',
      'function v32DeckRow(id, name) { var d = v32DeckDef(id); return d.cards.length ? "<li data-deck=\\"" + id + "\\">" + name + "</li>" : ""; }',
      'function v32GoRow(key, name, line, arg) { return "<li data-go=\\"" + key + "\\">" + name + ": " + line + "</li>"; }',
      'function v32Group(title, rows, id) { return rows ? "<section id=\\"" + id + "\\"><h3>" + title + "</h3><ul>" + rows + "</ul></section>" : ""; }',
      'function v32FlashcardsHtml() { return "<div class=\\"v25page\\"></div>"; }',
      'function v32QuizzesHtml() { return "<div class=\\"v25page\\"></div>"; }',
      'function keyOwned(k, lvl) { return true; }',
      'function srsRecord(q, ok) { SRS.push(q && q.id); }',
      'function qidAudit() { return { orphanedKeys: { q: [QID_S, "intro|" + QID_S, QID_R, "c-zzzzzzzz"] } }; }',
      'function v27Redraw() { V27++; }'
    ].join('\n'), dctx, { filename: 'stubs.js' });
    vm.runInContext(fs.readFileSync(REG_FILE, 'utf8'), dctx, { filename: 'data-regions.js' });
    vm.runInContext(fs.readFileSync(SR_FILE, 'utf8'), dctx, { filename: 'data-service-ref.js' });
    const SRD = dctx.SERVICE_REF;
    dctx.QID_S = SRD.questions[0] && SRD.questions[0].id;
    dctx.QID_R = (R.regions.find((r) => r && r.questions && r.questions.length) || { questions: [{ id: 'r-00000000' }] }).questions[0].id;
    vm.runInContext(fs.readFileSync(L39, 'utf8'), dctx, { filename: 'codex39.js' });
    const G = (x) => vm.runInContext(x, dctx);
    /* the deck */
    const def = G('v32DeckDef("service")');
    if (!def || def.kind !== 'service' || def.cards.length !== SRD.cards.length) dp.push('v32DeckDef("service") deals ' + (def ? def.cards.length + ' ' + def.kind : 'nothing') + ' cards, not the ' + SRD.cards.length + ' service cards');
    else if (def.cards.some((c, i) => c.id !== 'service/' + i || c.front !== SRD.cards[i].f || c.back !== SRD.cards[i].b)) dp.push('a service card is not its data card');
    if (G('v32FlashcardsHtml()').indexOf('data-deck="service"') < 0) dp.push('the Flashcards root has no Service references deck');
    G('S._v32run = { flip: true, deck: [0, 1], cards: v32DeckDef("service").cards }; v32Grade(true);');
    let slot = {};
    try { slot = JSON.parse(store['oot-codex-servicecards-v1'] || '{}'); } catch (e) { slot = {}; }
    if (slot['service/0'] !== 'got') dp.push('a graded service card is not kept in oot-codex-servicecards-v1');
    if (store['oot-codex-regioncards-v1']) dp.push('a service card was graded into the region slot');
    if (G('v32DeckDef("service").learnt') !== 1) dp.push('the deck does not count the card it kept');
    /* the drill */
    if (typeof dctx.V25_GO.servicedrill !== 'function') dp.push('V25_GO.servicedrill is missing');
    else {
      G('V25_GO.servicedrill()');
      const pool = G('S.pool') || [];
      const want = SRD.questions.filter((q) => q && BUILD.SERVICE_ID_RE.test(q.id || '')).length;
      if (G('S.mode') !== 'drill' || G('S.view') !== 'quiz' || pool.length !== SRD.questions.length || pool.length !== want) dp.push('the service drill deals ' + pool.length + ' questions in ' + G('S.mode') + ' on ' + G('S.view') + ', not the ' + SRD.questions.length + ' service questions in a drill');
      if (pool.some((q) => !BUILD.SERVICE_ID_RE.test(q.id || ''))) dp.push('the service drill deals a question with no s- id');
      if (new Set(pool.map((q) => q.id)).size !== pool.length) dp.push('the service drill deals a question twice');
    }
    if (G('v32QuizzesHtml()').indexOf('data-go="servicedrill"') < 0) dp.push('Quizzes has no Service references drill');
    if (G('keyOwned(QID_S, "certified")') !== false || G('keyOwned("intro|" + QID_S, "intro")') !== false) dp.push('an s- key counts as level progress');
    if (G('keyOwned(QID_R, "certified")') !== false) dp.push('an r- key counts as level progress');
    G('srsRecord({ id: QID_S }, true); srsRecord({ id: QID_R }, true); srsRecord({ id: "c-zzzzzzzz" }, true);');
    if (JSON.stringify(G('SRS')) !== JSON.stringify(['c-zzzzzzzz'])) dp.push('srsRecord schedules an r- or s- question: ' + JSON.stringify(G('SRS')));
    if (JSON.stringify(G('qidAudit().orphanedKeys.q')) !== JSON.stringify(['c-zzzzzzzz'])) dp.push('qidAudit reports an r- or s- key as an orphan: ' + JSON.stringify(G('qidAudit().orphanedKeys.q')));
    /* the references page */
    const ref = G('v39RefHtml()');
    if (ref.indexOf('data-v39="svcflash"') < 0 || ref.indexOf('Flash these') < 0) dp.push('the references page has no Flash these');
    if (ref.indexOf('data-v39="svcdrill"') < 0 || ref.indexOf('Drill these') < 0) dp.push('the references page has no Drill these');
    /* the house landing */
    const before = G('RENDERS'), v27 = G('V27');
    G('S.view = "region"; v27Redraw(); S.view = "country"; v27Redraw(); S.view = "regions"; v27Redraw();');
    if (G('RENDERS') - before !== 3 || G('V27') !== v27) dp.push('v27Redraw does not draw the region, country and regions views again');
    G('S.view = "cellar"; v27Redraw();');
    if (G('V27') !== v27 + 1) dp.push('v27Redraw no longer reaches codex27 on its own screens');
    /* the colour word */
    const wines = G('v39ArticleSections({ slug: "x", wines: [{ style: "Rosado", colour: "rose" }, { style: "Tinto", colour: "red" }] })').map((x) => x.body).join('');
    if (wines.indexOf('>ros\u00e9<') < 0 || wines.indexOf('>rose<') >= 0 || wines.indexOf('>red<') < 0) dp.push('the colour rose is not drawn as ros\u00e9');
  } catch (e) { dp.push('the sandbox threw: ' + e.message); }
  check('codex39 deals the service references (a deck in oot-codex-servicecards-v1, a drill of every s- question, never scheduled, never level progress, known to qidAudit, both doors on the page), draws its views again when the house lands, and shows rose as ros\u00e9', dp.length === 0, few(dp));
}
/* the Village tasting: the Court pours the Village candidate four wines, two white and two red, on the written grid in
   45 minutes. A sandbox stands in for codex20 (gridPool, gridStart, gridDealOpts, gridView) and core's shuffle: the
   Quizzes row says so in those words, the run deals two whites then two reds of the level's pool under a 45 minute
   clock with the shape four-wines, the clock is drawn for that shape, and a pool short of a colour keeps gridStart's four */
const TASTING_LINE = 'four wines, two white and two red, the written grid, 45 minutes';
if (fs.existsSync(L39) && fs.existsSync(REG_FILE)) {
  const tp = [];
  try {
    const tctx = { console: { log() {}, warn() {}, error() {} }, window: {}, setTimeout: function () { return 0; }, clearTimeout: function () {}, setInterval: function () { tctx.TIMERS++; return 1; }, clearInterval: function () {}, TIMERS: 0 };
    tctx.self = tctx; vm.createContext(tctx);
    vm.runInContext([
      'var S = { view: "home" }; var activeLevel = "certified"; var RENDERS = 0; var DEALT = 0; var FINALS = 0;',
      'var NOW = 1000000; Date.now = function () { return NOW; };',
      'var V25_GO = {}, V25_AREA = {}, V25_VIEWS = {}, V25_UNDER = {}, V32_OWNER = {}, V32_PARENT = {};',
      'var POOL = [{ g: "W1", c: "w" }, { g: "R1", c: "r" }, { g: "W2", c: "w" }, { g: "R2", c: "r" }, { g: "W3", c: "w" }, { g: "R3", c: "r" }, { g: "R4", c: "r" }];',
      'function render() { RENDERS++; }',
      'function shuffle(a) { return a.slice().reverse(); }',
      'function gridPool() { return POOL.slice(); }',
      'function gridStart(n) { S.tg = { deck: gridPool().slice(0, n || 6), idx: 0, step: 0, opts: [] }; S.view = "grid"; gridDealOpts(); render(); }',
      'function gridDealOpts() { DEALT++; S.tg.opts = [S.tg.deck[S.tg.idx].g]; }',
      'function gridView() { return { firstChild: null, kids: [], insertBefore: function (n) { this.kids.unshift(n); } }; }',
      'function gridAgain() { gridStart(S.tg ? S.tg.deck.length : 6); }',
      'var _finAgain = gridAgain; gridAgain = function () { if (S._fin && S._fin.phase === "grid") { FINALS++; return; } return _finAgain.apply(this, arguments); };',
      'var document = { createElement: function () { return { setAttribute: function () {} }; }, getElementById: function () { return null; } };',
      'function v32GoRow(key, name, line, arg) { return "<li data-go=\\"" + key + "\\">" + name + ": " + line + "</li>"; }',
      'function v32Group(title, rows, id) { return rows ? "<section id=\\"" + id + "\\"><h3>" + title + "</h3><ul>" + rows + "</ul></section>" : ""; }',
      'function v32QuizzesHtml() { return "<div class=\\"v25page\\"></div>"; }'
    ].join('\n'), tctx, { filename: 'stubs.js' });
    vm.runInContext(fs.readFileSync(REG_FILE, 'utf8'), tctx, { filename: 'data-regions.js' });
    vm.runInContext(fs.readFileSync(L39, 'utf8'), tctx, { filename: 'codex39.js' });
    const T = (x) => vm.runInContext(x, tctx);
    if (T('V39_WORDS.tastingRow') !== 'The Village tasting' || T('V39_WORDS.tastingLine') !== TASTING_LINE) tp.push('the words read ' + T('V39_WORDS.tastingRow') + ': ' + T('V39_WORDS.tastingLine'));
    if (T('v32QuizzesHtml()').indexOf('data-go="villagetasting">The Village tasting: ' + TASTING_LINE + '<') < 0) tp.push('Quizzes has no row reading The Village tasting: ' + TASTING_LINE);
    if (typeof tctx.V25_GO.villagetasting !== 'function') tp.push('V25_GO.villagetasting is missing');
    else {
      T('V25_GO.villagetasting()');
      const deck = T('S.tg && S.tg.deck.map(function (g) { return g.c; }).join("")');
      if (T('S.view') !== 'grid' || deck !== 'wwrr') tp.push('the run deals ' + deck + ' on ' + T('S.view') + ', not two whites then two reds on the grid');
      if (T('S.tg.idx') !== 0 || T('S.tg.opts[0]') !== T('S.tg.deck[0].g')) tp.push('the first glass of the re-dealt four is not the one the options were dealt for');
      if (T('S.tg.clock') !== 45 * 60) tp.push('the clock starts at ' + T('S.tg.clock') + ' seconds, not 45 minutes');
      if (T('S.tg.shape') !== 'four-wines') tp.push('the shape is ' + T('S.tg.shape') + ', not four-wines');
      if (T('gridView().kids.length') !== 1) tp.push('the clock is not drawn above the grid for the four-wines run');
      /* the clock: 3.5 seconds idle, then ten answers 0.7 seconds apart, each drawing the grid again */
      T('NOW += 3500; gridView();');
      if (T('S.tg.clock') !== 2697) tp.push('after 3.5 seconds the clock reads ' + T('S.tg.clock') + ' seconds, not 2697');
      const timers = tctx.TIMERS;
      T('for (var i = 0; i < 10; i++) { NOW += 700; gridView(); }');
      if (T('S.tg.clock') !== 2690) tp.push('after 10.5 seconds of answering the clock reads ' + T('S.tg.clock') + ' seconds, not 2690: a render resets the count');
      if (tctx.TIMERS !== timers) tp.push('a render starts the timer again (' + (tctx.TIMERS - timers) + ' more)');
      T('S.view = "home"; render(); NOW += 60000; S.view = "grid"; gridView();');
      if (T('S.tg.clock') !== 2690) tp.push('leaving the grid for a minute and coming back reads ' + T('S.tg.clock') + ' seconds, not the 2690 left');
      /* Pour another flight deals the Village tasting again; a Finals grid moves on through codex21's branch */
      T('NOW += 5000; gridView(); gridAgain();');
      if (T('S.tg.deck.map(function (g) { return g.c; }).join("")') !== 'wwrr' || T('S.tg.shape') !== 'four-wines' || T('S.tg.clock') !== 45 * 60) tp.push('Pour another flight deals ' + T('S.tg.deck.map(function (g) { return g.c; }).join("")') + ' with shape ' + T('S.tg.shape') + ' and ' + T('S.tg.clock') + ' seconds, not the Village tasting again');
      T('S._fin = { phase: "grid" }; var f0 = FINALS; gridAgain();');
      if (T('FINALS - f0') !== 1 || T('S.tg.shape') !== 'four-wines') tp.push('inside a Finals, Pour another flight no longer moves on through codex21\'s branch');
      T('S._fin = null; S.tg.shape = "other"');
      if (T('gridView().kids.length') !== 0) tp.push('the clock is drawn for a grid that is not the Village tasting');
      T('S.tg = { deck: gridPool().slice(0, 6), idx: 0 }; gridAgain();');
      if (T('S.tg.deck.length') !== 6 || T('S.tg.shape') !== undefined) tp.push('a grid that is not the Village tasting no longer keeps codex20\'s own again');
      T('POOL = [{ g: "W1", c: "w" }, { g: "R1", c: "r" }, { g: "R2", c: "r" }, { g: "R3", c: "r" }, { g: "R4", c: "r" }]; V25_GO.villagetasting();');
      if (T('S.tg.deck.length') !== 4 || T('S.tg.deck.map(function (g) { return g.g; }).join(",")') !== 'W1,R1,R2,R3' || T('S.tg.clock') !== 45 * 60) tp.push('a pool with one white does not keep gridStart\'s four under the clock');
    }
  } catch (e) { tp.push('the sandbox threw: ' + e.message); }
  check('the Village tasting: ' + TASTING_LINE + ' (the Quizzes row says so; two whites then two reds under a 45 minute clock, shape four-wines; a render never resets the clock; Pour another flight deals it again, after codex21\'s Finals branch; a pool short of a colour keeps gridStart\'s four)', tp.length === 0, few(tp));
}
/* the places' depth word: a place's depth is a level of the Codex, and a bare level name beside a place reads as the
   place's own cru (La Romanee PREMIER CRU: the smallest grand cru appellation; Oger and Oiry PREMIER CRU: Grand Cru
   villages). Every article's places and every map-less country's, drawn by the layer from the merged records: no bare
   level name sits beside a place, each depth is drawn once, framed, naming its level, and the key heads The places
   whenever a place carries one (and never when none does) */
if (fs.existsSync(L39) && fs.existsSync(REG_FILE)) {
  const dw = [];
  let deep = 0, drawn = 0, keyed = 0;
  try {
    const pctx = { console: { log() {}, warn() {}, error() {} }, S: {}, render: function () {}, window: {}, setTimeout: setTimeout, clearTimeout: clearTimeout };
    pctx.self = pctx; vm.createContext(pctx);
    vm.runInContext(fs.readFileSync(REG_FILE, 'utf8'), pctx, { filename: 'data-regions.js' });
    vm.runInContext(fs.readFileSync(L39, 'utf8'), pctx, { filename: 'codex39.js' });
    const P = (x) => vm.runInContext(x, pctx);
    const NAMES = CF.LEVELS.map((k) => P('v39LevelName(' + JSON.stringify(k) + ')'));
    const BARE = new Set(NAMES.map(CF.fold).concat(['premier cru', 'grand cru', 'premiers crus', 'grands crus']));
    const unesc = (s) => String(s).replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
    const depthsOf = (list, out) => { (Array.isArray(list) ? list : []).forEach((p) => { if (p && typeof p.name === 'string' && p.name.trim()) { if (p.depth === 'advanced' || p.depth === 'master') out.push(p.depth); depthsOf(p.places, out); } }); return out; };
    const proveBody = (who, body, places) => {
      const want = depthsOf(places, []);
      deep += want.length;
      /* any tag right after a place's bold name, whatever its class */
      [...body.matchAll(/<\/b>\s*<span[^>]*>([\s\S]*?)<\/span>/g)].forEach((m) => {
        if (BARE.has(CF.fold(unesc(m[1])))) dw.push(who + ': a bare level name beside a place: ' + unesc(m[1]));
      });
      const tags = [...body.matchAll(/<span class="v39-depth">([\s\S]*?)<\/span>/g)].map((m) => unesc(m[1]));
      drawn += tags.length;
      if (tags.length !== want.length) dw.push(who + ': ' + want.length + ' places carry a depth, ' + tags.length + ' depth words drawn');
      tags.forEach((t, i) => {
        const level = NAMES[CF.LEVELS.indexOf(want[i])] || '';
        if (BARE.has(CF.fold(t))) dw.push(who + ': the depth word is a bare level name: ' + t);
        else if (!level || t.indexOf(level) < 0) dw.push(who + ': the depth word "' + t + '" does not frame ' + (level || 'its level'));
      });
      const keyAt = body.indexOf('v39-placeskey');
      const listAt = body.indexOf('<ul class="v39-places"');
      if (want.length) {
        if (keyAt < 0 || listAt < 0 || keyAt > listAt) dw.push(who + ': no key at the head of The places');
        else {
          keyed++;
          const key = unesc((body.match(/<p class="[^"]*v39-placeskey[^"]*">([\s\S]*?)<\/p>/) || [])[1] || '');
          if (key.indexOf(NAMES[2]) < 0 || key.indexOf(NAMES[3]) < 0) dw.push(who + ': the key does not name ' + NAMES[2] + ' and ' + NAMES[3]);
        }
      } else if (keyAt >= 0) dw.push(who + ': a key with no place carrying a depth');
    };
    R.regions.forEach((r) => {
      if (!r || !r.slug || !Array.isArray(r.places) || !r.places.length) return;
      const sec = Array.from(P('v39ArticleSections(' + JSON.stringify(r) + ')')).find((x) => x && x.id === 'v39-sec-places');
      if (!sec) { dw.push(r.slug + ': no The places section'); return; }
      proveBody(r.slug, String(sec.body), r.places);
    });
    Object.keys(R.countries).forEach((k) => {
      const c = R.countries[k];
      if (!c || !Array.isArray(c.places) || !c.places.length) return;
      const html = String(P('v39CountryHtml(' + JSON.stringify(c) + ')'));
      const at = html.indexOf('id="v39-sec-places"');
      if (at < 0) { dw.push(k + ': its places are not drawn on the country page'); return; }
      const end = html.indexOf('</details>', at);
      proveBody(k, html.slice(at, end < 0 ? html.length : end), c.places);
    });
  } catch (e) { dw.push('the sandbox threw: ' + e.message); }
  check('the places\' depth word: no bare level name beside a place, every depth framed and naming its level (' + drawn + ' of ' + deep + '), the key heading The places (' + keyed + ' pages)', dw.length === 0 && deep > 0 && drawn === deep, few(dw));
}
check('js/data-service-ref.js is present (the shell loads it)', fs.existsSync(SR_FILE), SR_FILE);
const INDEX = path.join(ROOT, 'index.html');
const SW = path.join(ROOT, 'sw.js');
if (fs.existsSync(INDEX)) {
  /* Read every local script, including an unversioned duplicate, so a missing
     version cannot disappear from the order or uniqueness proof. */
  const sources = [...fs.readFileSync(INDEX, 'utf8').matchAll(/<script\b[^>]*\bsrc=["'](js\/[^"']+)["'][^>]*>\s*<\/script>/g)].map((m) => m[1]);
  const scripts = sources.map((src) => src.slice(3).split(/[?#]/)[0]);
  const at = scripts.indexOf('codex38.js');
  const compass = ['data-cellar-compass.js', 'codex40.js', 'codex41.js'];
  const hasCompass = compass.some((f) => scripts.includes(f) || fs.existsSync(path.join(JS, f)));
  const learning = ['codex42.js', 'codex43.js', 'codex44.js', 'data-field-atlas.js', 'codex45.js'].filter(f => fs.existsSync(path.join(JS, f)));
  const tail = ['codex38.js', 'data-regions.js', 'data-service-ref.js', 'codex39.js'].concat(hasCompass ? compass : [], learning, ['boot.js']);
  check('index.html keeps the regions sequence after codex38.js, the exact Cellar Compass triple (its data, codex40 and codex41) when present, then boot.js, each once with ?v=',
    at >= 0 && JSON.stringify(scripts.slice(at, at + tail.length)) === JSON.stringify(tail)
      && tail.every((f) => scripts.filter((s) => s === f).length === 1 && /^js\/[^?]+\?v=\d+$/.test(sources[scripts.indexOf(f)])),
    scripts.slice(Math.max(0, at), at + tail.length).join(' '));
} else check('index.html is beside js/', false, INDEX);
if (fs.existsSync(SW)) {
  const sw = fs.readFileSync(SW, 'utf8');
  const i38 = sw.indexOf("'./js/codex38.js'");
  const iR = sw.indexOf("'./js/data-regions.js'");
  const iS = sw.indexOf("'./js/data-service-ref.js'");
  const i39 = sw.indexOf("'./js/codex39.js'");
  check('sw.js lists data-regions.js, data-service-ref.js and codex39.js in ASSETS after codex38.js', i38 > 0 && iR > i38 && iS > iR && i39 > iS);
  const n = Number((sw.match(/const CACHE = '(?:oot-)?codex-v(\d+)';/) || [])[1]);
  check('sw.js moved its CACHE past codex-v' + PAST_CACHE, n > PAST_CACHE, String(n));
  /* the reading files: never in ASSETS (the install would download them all again), served from a cache whose name
     no bump reaps (no codex- or oot-codex- prefix), matched by the exact address so a new stamp is a new fetch */
  const assets = (sw.match(/const ASSETS = \[([\s\S]*?)\];/) || [])[1] || '';
  const rootM = sw.match(/const REGIONS_ROOT = new URL\('\.\/js\/regions\/', self\.location\.href\);/);
  const nameM = sw.match(/const REGIONS_CACHE = '([a-z0-9-]+)' \+ encodeURIComponent/);
  const ruleAt = sw.indexOf('url.pathname.startsWith(REGIONS_ROOT.pathname)');
  const catchAll = sw.indexOf("caches.match(e.request, { ignoreSearch: true })");
  check('sw.js keeps js/regions/ out of ASSETS and serves it, before its catch-all, from a cache of its own that no bump reaps',
    assets && assets.indexOf('js/regions/') < 0 && !!rootM && !!nameM && !/^(oot-)?codex-/.test(nameM[1]) && ruleAt > 0 && (catchAll < 0 || ruleAt < catchAll),
    (assets.indexOf('js/regions/') >= 0 ? 'ASSETS lists a reading file; ' : '') + (!rootM ? 'no REGIONS_ROOT; ' : '') + (!nameM ? 'no REGIONS_CACHE; ' : (/^(oot-)?codex-/.test(nameM[1]) ? 'the cache name ' + nameM[1] + ' would be reaped; ' : '')) + (ruleAt < 0 ? 'no fetch rule for it' : ''));
} else check('sw.js is beside js/', false, SW);
SEVEN.forEach((f) => {
  const p = path.join(__dirname, f);
  if (!fs.existsSync(p)) return;
  const s = fs.readFileSync(p, 'utf8');
  const lists = (s.match(/'codex38\.js'\s*[,\]]/g) || []).length;
  check(f + ' names codex39.js in every list that names codex38.js (' + lists + ')', lists > 0 && (s.match(/'codex39\.js'\s*[,\]]/g) || []).length >= lists);
});
const me = fs.readFileSync(__filename, 'utf8');
check('this gate carries no dash either', layerProblems(unescape(me)).filter((p) => !/retired|numeral/.test(p)).length === 0);

/* ================================================================ */
console.log('');
console.log('--- summary ---');
const rows = [
  ['regions', R.regions.length + ' of ' + total],
  ['countries', countryKeys.length + ' of ' + wantKeys.length],
  ['questions', nQuestions + (srQuestions ? ' (and ' + srQuestions + ' service)' : '')],
  ['cards', nCards + (srCards ? ' (and ' + srCards + ' service)' : '')],
  ['index', regBytes + ' bytes of ' + MAX_INDEX_BYTES + ' (precached)'],
  ['reading', partCount + ' files, ' + partBytes + ' bytes (fetched on first open)']
];
rows.forEach((r) => console.log('  ' + r[0].padEnd(10) + ' ' + r[1]));
console.log('  ' + houseLine);
console.log('');
console.log('check-regions: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
