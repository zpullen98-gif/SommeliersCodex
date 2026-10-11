#!/usr/bin/env node
/* check-fragment: proves one regions fragment against .scripts/regions/schema.json.
   Usage: node .scripts/regions/check-fragment.cjs <fragment.json> [jsDir]
   Exits 1 with every problem named (file, path, rule). Exported for check-regions.js. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SHEETS = ['france', 'italy', 'spain', 'portugal', 'germany', 'austria', 'california', 'oregon', 'washington', 'new-york', 'argentina', 'chile', 'australia', 'new-zealand', 'south-africa', 'hungary', 'greece'];
const MAPLESS = ['canada', 'england', 'switzerland', 'eastern-europe', 'lebanon', 'uruguay', 'mexico'];
const LEVELS = ['intro', 'certified', 'advanced', 'master'];
const COUNTRY_KEYS = SHEETS.concat(MAPLESS);
const COUNTRY_WORDS = ['france', 'italy', 'spain', 'portugal', 'germany', 'austria', 'argentina', 'chile', 'australia', 'new zealand', 'south africa', 'hungary', 'greece', 'united states', 'canada', 'england', 'switzerland', 'lebanon', 'uruguay', 'mexico'];
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

function words(s) { return String(s || '').trim() ? String(s || '').trim().split(/\s+/).length : 0; }
function fold(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }

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

/* The prose-only spellings: where is the string's path, and an accept list's entries are spared. */
function proseProblems(s, where) {
  if (typeof s !== 'string' || ACCEPT_PATH.test(where)) return [];
  const m = s.match(AMERICAN_PROSE);
  return m ? [where + ': American spelling "' + m[0] + '" (write per cent, towards)'] : [];
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
function checkPlaces(places, where, out, depthRequired) {
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
function checkCards(list, where, out) {
  if (!Array.isArray(list) || list.length < 6 || list.length > 10) { out.push(where + ': 6 to 10 cards (' + (Array.isArray(list) ? list.length : 'none') + ')'); if (!Array.isArray(list)) return; }
  list.forEach((c, i) => {
    const w = where + '[' + i + ']';
    if (!c || typeof c.f !== 'string' || words(c.f) < 3) out.push(w + '.f: a front of at least three words');
    if (!c || typeof c.b !== 'string' || words(c.b) < 1 || words(c.b) > 40) out.push(w + '.b: a back of at most 40 words');
  });
}
function checkQuestions(list, where, out, cat) {
  if (!Array.isArray(list) || list.length < 6 || list.length > 8) { out.push(where + ': 6 to 8 questions (' + (Array.isArray(list) ? list.length : 'none') + ')'); if (!Array.isArray(list)) return; }
  let mc = 0;
  const stems = new Set();
  list.forEach((q, i) => {
    const w = where + '[' + i + ']';
    if (!q || typeof q !== 'object') { out.push(w + ': an object'); return; }
    if (q.cat !== cat) out.push(w + '.cat: must be "' + cat + '"');
    if (typeof q.q !== 'string' || words(q.q) < 5) out.push(w + '.q: a stem of at least five words');
    if (/\b(NOT|EXCEPT)\b/.test(q.q || '') || /all of the above|none of the above/i.test((q.opts || []).join(' '))) out.push(w + ': no NOT, EXCEPT, all or none of the above');
    if (q.q && stems.has(fold(q.q))) out.push(w + ': a duplicate stem');
    stems.add(fold(q.q || ''));
    if (typeof q.exp !== 'string' || words(q.exp) < 10 || words(q.exp) > 60) out.push(w + '.exp: 10 to 60 words');
    /* the build deals the options into a new order, so an explanation may never point at one by position */
    if (/\b(option|answer|choice)\s+[abcd1-4]\b|\b(first|second|third|fourth|last)\s+(option|answer|choice)\b|^\s*\(?[abcd]\)\s/i.test(q.exp || '')) out.push(w + '.exp: names an option by position (the build reorders the options)');
    if (q.id !== undefined && !/^r-[0-9a-z]{8}$/.test(q.id)) out.push(w + '.id: only the builder mints ids (r- and eight base36)');
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
  if (mc < 3) out.push(where + ': at least three multiple choice questions');
}
function checkSources(list, where, out) {
  if (!Array.isArray(list) || !list.length) { out.push(where + ': at least one source'); return; }
  list.forEach((s, i) => {
    if (!s || !s.title || !s.asOf) out.push(where + '[' + i + ']: title and asOf');
    if (s && s.url !== undefined && !/^https?:\/\//.test(s.url)) out.push(where + '[' + i + '].url: http(s)');
  });
}

function checkRegion(r, i, sheet, codex, out) {
  const w = 'regions[' + i + ']';
  if (!r || typeof r !== 'object') { out.push(w + ': an object'); return; }
  const atlas = codex.atlas.sheets[sheet].regions[i];
  if (!/^[a-z0-9-]+$/.test(r.slug || '')) out.push(w + '.slug: /^[a-z0-9-]+$/');
  if (r.name !== (atlas && atlas.name)) out.push(w + '.name: must be "' + (atlas && atlas.name) + '"');
  if (r.sheet !== sheet) out.push(w + '.sheet: must be ' + sheet);
  if (r.index !== i) out.push(w + '.index: must be ' + i);
  if (!Array.isArray(r.asked) || !r.asked.length || r.asked.some((l) => LEVELS.indexOf(l) < 0) || r.asked.join() !== LEVELS.filter((l) => r.asked.indexOf(l) >= 0).join()) out.push(w + '.asked: a non-empty subset of intro, certified, advanced, master in that order');
  let prose = checkRange(r.summary, w + '.summary', out, 60, 120);
  const t = r.terroir || {};
  if (!r.terroir) out.push(w + '.terroir: required');
  prose += checkRange(t.climate, w + '.terroir.climate', out, 15, 120);
  prose += checkRange(t.soils, w + '.terroir.soils', out, 15, 120);
  prose += checkRange(t.topography, w + '.terroir.topography', out, 15, 120);
  prose += checkRange(t.water === undefined ? '' : t.water, w + '.terroir.water', out, 0, 120);
  checkGrapes(r.grapes, w + '.grapes', out, codex);
  prose += checkWines(r.wines, w + '.wines', out);
  const m = r.made || {};
  if (!r.made) out.push(w + '.made: required');
  prose += checkRange(m.viticulture, w + '.made.viticulture', out, 60, 250);
  prose += checkRange(m.winemaking, w + '.made.winemaking', out, 60, 250);
  const l = r.law || {};
  if (!r.law) out.push(w + '.law: required');
  prose += checkRange(l.classification, w + '.law.classification', out, 40, 200);
  checkPairs(l.tiers, w + '.law.tiers', out, 1);
  checkPairs(l.labels, w + '.law.labels', out, 0);
  if (!Array.isArray(r.places) || !r.places.length) out.push(w + '.places: at least one place');
  checkPlaces(r.places, w + '.places', out);
  prose += placesWords(r.places);
  if (!Array.isArray(r.producers) || !r.producers.length) out.push(w + '.producers: at least one house');
  (r.producers || []).forEach((p, j) => {
    if (!p || !p.name || !p.why) out.push(w + '.producers[' + j + ']: name and why');
    if (p && p.id !== undefined && !codex.producers.has(p.id)) out.push(w + '.producers[' + j + '].id: ' + p.id + ' is not a WINE_PRODUCERS id');
  });
  checkLines(r.exam, w + '.exam', out, 3, 8);
  checkLines(r.traps, w + '.traps', out, 3, 8);
  checkSay(r.say, w + '.say', out, 2);
  checkCards(r.cards, w + '.cards', out);
  checkQuestions(r.questions, w + '.questions', out, r.name);
  checkSources(r.sources, w + '.sources', out);
  if (prose < 900 || prose > 1600) out.push(w + ': the article prose is 900 to 1,600 words over summary, terroir, made, law.classification, wines notes and places notes (' + prose + ')');
}

function checkCountry(c, w, codex, out, sheet, slugs) {
  if (!c || typeof c !== 'object') { out.push(w + ': an object'); return; }
  if (sheet) {
    if (c.key !== sheet) out.push(w + '.key: must be ' + sheet);
    if (c.sheet !== sheet) out.push(w + '.sheet: must be ' + sheet);
    if (c.mapless !== undefined) out.push(w + '.mapless: not for a sheet country');
    if (slugs === null) { if (!Array.isArray(c.regionsOrder) || !c.regionsOrder.length || c.regionsOrder.some((x) => !/^[a-z0-9-]+$/.test(x))) out.push(w + '.regionsOrder: every region slug of the whole sheet in map order (the other parts\' slugs included)'); }
    else if (!Array.isArray(c.regionsOrder) || c.regionsOrder.join() !== slugs.join()) out.push(w + '.regionsOrder: every region slug of the sheet in map order');
    if (c.places !== undefined && c.places.length) out.push(w + '.places: a sheet country keeps its places in the region articles');
  } else {
    if (MAPLESS.indexOf(c.key) < 0) out.push(w + '.key: one of ' + MAPLESS.join(', '));
    if (c.mapless !== 1) out.push(w + '.mapless: 1');
    if (c.sheet !== undefined) out.push(w + '.sheet: none for a mapless country');
    if (!Array.isArray(c.regionsOrder) || c.regionsOrder.length) out.push(w + '.regionsOrder: empty for a mapless country');
    if (!Array.isArray(c.places) || !c.places.length) out.push(w + '.places: the country\'s regions as places');
    checkPlaces(c.places, w + '.places', out);
  }
  if (!c.name) out.push(w + '.name: required');
  let prose = checkRange(c.summary, w + '.summary', out, 80, 160);
  prose += checkRange(c.overview, w + '.overview', out, 200, 500);
  prose += placesWords(c.places);
  checkPairs(c.ladder, w + '.ladder', out, 1);
  checkPairs(c.labels, w + '.labels', out, 0);
  checkGrapes(c.grapes, w + '.grapes', out, codex);
  checkLines(c.exam, w + '.exam', out, 3, 8);
  checkLines(c.traps, w + '.traps', out, 3, 8);
  checkSay(c.say, w + '.say', out, 1);
  checkCards(c.cards, w + '.cards', out);
  checkQuestions(c.questions, w + '.questions', out, c.name);
  checkSources(c.sources, w + '.sources', out);
  if (prose < 400 || prose > 1200) out.push(w + ': the country prose is 400 to 1,200 words over summary, overview and places notes (' + prose + ')');
}

function checkJoin(frag, out, slugs, keys, codex) {
  const targets = new Set(slugs.concat(keys));
  if (frag.country && Array.isArray(frag.country.regionsOrder)) frag.country.regionsOrder.forEach((x) => targets.add(x));
  if (frag.part && Array.isArray(frag.part.slugs)) frag.part.slugs.forEach((x) => targets.add(x));
  if (frag.aliases !== undefined) {
    if (!frag.aliases || typeof frag.aliases !== 'object' || Array.isArray(frag.aliases)) out.push('aliases: an object');
    else Object.keys(frag.aliases).forEach((k) => {
      if (k !== fold(k)) out.push('aliases["' + k + '"]: the key is folded (lower case, no accents, no punctuation)');
      if (!targets.has(frag.aliases[k])) out.push('aliases["' + k + '"]: ' + frag.aliases[k] + ' is no slug or country key of this fragment');
      /* the resolver also matches a part held inside a key, so a key naming a country ("burgundy france") would send a bare "France" to that article */
      if (COUNTRY_KEYS.indexOf(frag.aliases[k]) < 0 && COUNTRY_WORDS.some((c) => k !== c && (' ' + k + ' ').indexOf(' ' + c + ' ') >= 0)) out.push('aliases["' + k + '"]: an alias to an article may not name a country (a bare country name would resolve to it); drop it or point it at the country key');
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

function checkFragment(frag, file, codex) {
  const out = [];
  if (!frag || typeof frag !== 'object' || Array.isArray(frag)) return ['the fragment is not an object'];
  walkStrings(frag, '', (s, where) => voiceProblems(s, where).concat(proseProblems(s, where)).forEach((p) => out.push(p)));
  const slugs = [];
  const keys = [];
  if (frag.sheet !== undefined) {
    if (SHEETS.indexOf(frag.sheet) < 0) { out.push('sheet: one of ' + SHEETS.join(', ')); return out; }
    const want = codex.atlas.sheets[frag.sheet].regions.length;
    /* a part holds some of a sheet's regions: part: { indices: [0, 1, 2], country: true } (the country record rides with the part that says so) */
    const part = frag.part && typeof frag.part === 'object' ? frag.part : null;
    if (part && (!Array.isArray(part.indices) || !part.indices.length || part.indices.some((i) => !Number.isInteger(i) || i < 0 || i >= want))) out.push('part.indices: positions within 0 to ' + (want - 1));
    const indices = part && Array.isArray(part.indices) ? part.indices : Array.from({ length: want }, (_, i) => i);
    if (!Array.isArray(frag.regions) || frag.regions.length !== indices.length) out.push('regions: ' + indices.length + ' articles in map order (' + (frag.regions || []).length + ')');
    (frag.regions || []).forEach((r, k) => { const i = indices[k] === undefined ? k : indices[k]; checkRegion(r, i, frag.sheet, codex, out); if (r && r.slug) slugs.push(r.slug); });
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

module.exports = { checkFragment, loadCodex, voiceProblems, proseProblems, walkStrings, fold, words, SHEETS, MAPLESS, LEVELS, placesWords };

if (require.main === module) {
  const file = process.argv[2];
  const jsDir = process.argv[3] || path.join(__dirname, '..', '..', 'js');
  if (!file) { console.error('usage: check-fragment.cjs <fragment.json> [jsDir]'); process.exit(2); }
  let frag;
  try { frag = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { console.error(file + ': ' + e.message); process.exit(1); }
  const codex = loadCodex(jsDir);
  const problems = checkFragment(frag, file, codex);
  const n = frag.regions ? frag.regions.length : (frag.countries || []).length;
  if (problems.length) { console.log(problems.map((p) => file + ': ' + p).join('\n')); console.log('\ncheck-fragment: ' + problems.length + ' problem(s) in ' + file); process.exit(1); }
  console.log('check-fragment: ' + file + ' passes (' + n + (frag.regions ? ' regions and its country' : ' countries') + ')');
}
