#!/usr/bin/env node
/* build-champagne: builds js/data-champagne.js, the data of the Champagne houses tab of Brennan's (codex59), from the
   plan (.scripts/champagne/plan.json, the class sheet's 23 houses in the sheet's order) and one fragment a house
   (.scripts/champagne/fragments/<key>.json, the house's one record). BRIEF.md is the authors' and refuters' contract
   and schema.cjs the one validator; the data file is GENERATED here and never edited by hand.

   Usage:
     node .scripts/champagne/build-champagne.cjs --lint <house> [<house> ...]   validate the named fragments; WRITES NOTHING
     node .scripts/champagne/build-champagne.cjs --lint --chunk <pilots|h1..h5>  the same, for a chunk of the plan
     node .scripts/champagne/build-champagne.cjs --lint --all                    the same, for every fragment on disk
     node .scripts/champagne/build-champagne.cjs [--partial]                     the writing build: the data file and keys.v1.json
     node .scripts/champagne/build-champagne.cjs --check                         prove the shipped file and the keys are the build; writes nothing
     node .scripts/champagne/build-champagne.cjs --plan                          prove plan.json against the sheet, the app and the id prefix
     node .scripts/champagne/build-champagne.cjs --freeze                        the whole build, then freeze keys.v1.json (refused with --partial)
     options: --fragments <dir>  --out <file>  --keys <file>  [jsDir]

   WHO RUNS WHAT. Authors and refuters run --lint and nothing else. Only the spec engineer, the layer engineer and
   the integrator run the writing build.

   The lint. Each named fragment is read, held to schema.cjs and printed with every problem (the field, then the
   rule) and every note (what a second reader should look at: never a failure). Exit 1 while a problem stands.

   The writing build. The plan is proved first (the sheet's 23 rows in the sheet's order, the app's producers, the
   flagships picks). Without --partial every house of the plan needs a sound fragment AND a refuter's record
   (checked): a missing, refused or unchecked record refuses the whole build and nothing is written. With --partial
   a missing house is listed, an unchecked record is shipped when sound, an unsound one is skipped with its
   problems, and the file says in its header that it is a partial build.

   The ids. A record's id is hc- and eight base36 digits of FNV-1a 64 (build-regions.cjs's mint) over
   JSON.stringify(['champagne', key]), key being the house's key in plan.json; a card's over
   JSON.stringify(['champagne:' + id, front]) and a question's over its stem. The record id is MINTED ONCE: once
   keys.v1.json holds a key's id the build reads it from there. hc- is a prefix nothing else in the Codex mints
   with (--plan and every writing build scan js/). While keys.v1.json says frozen: false it follows the build. Once
   the integrator has run --freeze, a build may add ids and may never lose one: an id is a learner's saved record,
   and a reworded front or stem is a new card or a new question; a frozen key the plan no longer holds refuses the
   build rather than leave the file.

   The deal. Authors key the answer where they like and the engine never shuffles, so the build deals the shipped
   copies as build-flagships.cjs does: the answer positions round robin over a record's three questions, the start
   carried from record to record by the sheet's order (three times the house's place in the plan, so a partial
   build deals a record exactly as the whole build will), that deal shuffled from 'deal:champagne:' + key and the
   distractors ordered from the stem. Ids come from the key and the text, never the options, so the deal moves no id.

   The output. js/data-champagne.js declares CHAMPAGNE_HOUSES = { meta, houses }: houses is the records in the
   sheet's order, one line a record, each with its id first and then schema.cjs's fields in order; meta states the
   edition, the roster's size, how many are built, whether the build is partial, the counts and the id prefix. The
   provenance (report, checked) and a source's read never ship. Raw UTF-8, as the Codex's other generated data
   files. --check builds in memory and compares with the file and with keys.v1.json; it builds as the shipped file
   was built (partial when its header says so). Exits 1 with every problem named. */
'use strict';
const fs = require('fs');
const path = require('path');
const S = require(path.join(__dirname, 'schema.cjs'));
const BR = require(path.join(__dirname, '..', 'regions', 'build-regions.cjs'));
const CMS = require(path.join(__dirname, '..', 'cms', 'build-cms.cjs'));

const ROOT = S.ROOT;
const PARTIAL_MARK = 'A PARTIAL BUILD';
const DATA_FILE = 'data-champagne.js';
const LAYER_FILE = 'codex59.js';

function rel(p) { const r = path.relative(ROOT, p); return (!r.startsWith('..') && !path.isAbsolute(r) ? r : p).split(path.sep).join('/'); }
function mint(seed) { return S.ID_PREFIX + BR.b36(BR.fnv1a64(JSON.stringify(seed)), 8); }
function recordId(key) { return mint(['champagne', key]); }
function itemId(id, text) { return mint(['champagne:' + id, text]); }

function parseArgs(argv) {
  const o = { lint: false, all: false, chunk: null, houses: [], check: false, partial: false, plan: false, freeze: false, fragments: null, out: null, keys: null, jsDir: null, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--lint') o.lint = true;
    else if (a === '--all') o.all = true;
    else if (a === '--chunk') o.chunk = argv[++i];
    else if (a === '--check') o.check = true;
    else if (a === '--partial') o.partial = true;
    else if (a === '--plan') o.plan = true;
    else if (a === '--freeze') o.freeze = true;
    else if (a === '--fragments') o.fragments = argv[++i];
    else if (a === '--out') o.out = argv[++i];
    else if (a === '--keys') o.keys = argv[++i];
    else if (a === '--help' || a === '-h') o.help = true;
    else if (a.charAt(0) === '-') throw new Error('unknown option ' + a);
    else if (o.lint) o.houses.push(a.replace(/^.*[\\/]/, '').replace(/\.json$/, ''));
    else o.jsDir = a;
  }
  return o;
}

function readFragment(dir, key) {
  const file = path.join(dir, key + '.json');
  if (!fs.existsSync(file)) return { key, file, missing: true };
  try { return { key, file, rec: JSON.parse(fs.readFileSync(file, 'utf8')) }; }
  catch (e) { return { key, file, broken: 'not valid JSON (' + e.message + ')' }; }
}

/* The deal, on the shipped copy of one record's questions. */
function deal(questions, key, start) {
  const mc = questions.filter((q) => Array.isArray(q.opts) && q.opts.length === 4 && Number.isInteger(q.a));
  const targets = BR.detShuffle(mc.map((_, i) => (start + i) % 4), 'deal:champagne:' + key);
  mc.forEach((q, i) => {
    const correct = q.opts[q.a];
    const rest = BR.detShuffle(q.opts.filter((_, k) => k !== q.a), 'distractors:' + q.q);
    rest.splice(targets[i], 0, correct);
    q.opts = rest;
    q.a = targets[i];
  });
}
function copy(v) { return JSON.parse(JSON.stringify(v)); }
/* A record as it ships: its id first, then the schema's fields in order; the provenance and a source's read left
   out, also only where the record carries it. */
function ship(rec, id, index) {
  const out = { id };
  S.FIELDS.forEach((k) => {
    if (k === 'also') { if (rec.also) out.also = copy(rec.also); return; }
    if (k === 'cards') out.cards = rec.cards.map((c) => ({ id: itemId(id, c.front), kind: c.kind, front: c.front, back: c.back }));
    else if (k === 'questions') out.questions = rec.questions.map((q) => ({ id: itemId(id, q.q), q: q.q, opts: copy(q.opts), a: q.a, exp: q.exp, tag: q.tag }));
    else if (k === 'sources') out.sources = rec.sources.map((s) => ({ title: s.title, url: s.url, kind: s.kind }));
    else out[k] = copy(rec[k]);
  });
  deal(out.questions, rec.key, (index * 3) % 4);
  return out;
}

function header(from, stats) {
  return '/* The Champagne houses tab of the house tab (codex59): built by .scripts/champagne/build-champagne.cjs from ' + from + ', never edited by hand.\n'
    + '   CHAMPAGNE_HOUSES.houses holds one record a house, in the order of the class sheet of 22 November 2026, each\n'
    + '   with its id (hc- and eight base36 digits, minted once from the plan\'s key and kept in\n'
    + '   .scripts/champagne/keys.v1.json): the house (its WINE_PRODUCERS id or "", the id of the library\'s own record of\n'
    + '   the cuvée or "", the key of its record in Producers and flagships or "", how to say it, the year it dates from\n'
    + '   and what that year is, its village, what it is in the appellation\'s own terms, its story and its style), its\n'
    + '   prestige cuvée in depth, the second cuvée where the sheet prints two, the lines to say at the table, what\n'
    + '   guests ask, the traps, what the sheet prints and what the label prints, three cards and three questions (ids\n'
    + '   minted from the record\'s id and the text; the answer positions dealt by the build) and the sources.\n'
    + '   CHAMPAGNE_HOUSES.meta states the edition and the counts. Every string is British and dash free, and names\n'
    + '   nobody living.'
    + (stats.partial ? '\n   ' + PARTIAL_MARK + ': ' + stats.built + ' of ' + stats.roster + ' records; the whole build replaces it.' : '') + ' */\n';
}
function line(v) { return JSON.stringify(v).split(String.fromCharCode(0x2028)).join('\\u2028').split(String.fromCharCode(0x2029)).join('\\u2029'); }

/* hc- is the tab's alone: no file under js/ but the data and its layer holds an hc- id or the prefix as a literal. */
function prefixProblems(jsDir, outFile) {
  const out = [];
  /* the data file as shipped, the file being written when --out names another, and the layer */
  const skip = new Set([path.resolve(path.join(jsDir, DATA_FILE)), path.resolve(outFile || path.join(jsDir, DATA_FILE)), path.resolve(path.join(jsDir, LAYER_FILE))]);
  const idRe = /\bhc-[0-9a-z]{8}\b/;
  const litRe = /["'`]hc-|\^hc-/;
  const walk = (dir) => {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { walk(p); return; }
      if (!/\.(?:js|json)$/.test(e.name) || skip.has(path.resolve(p))) return;
      const text = fs.readFileSync(p, 'utf8');
      const m = text.match(idRe) || text.match(litRe);
      if (m) out.push(rel(p) + ': holds ' + JSON.stringify(m[0]) + ', so ' + S.ID_PREFIX + ' is not the Champagne houses tab\'s alone');
    });
  };
  if (fs.existsSync(jsDir)) walk(jsDir);
  return out;
}

const KEYS_ABOUT = 'Every id of the Champagne houses tab, house by house in the sheet\'s order: the record\'s id (hc- and eight base36 digits, minted once from the house\'s key by build-champagne.cjs and read from here ever after), its three cards and its three questions (minted from the record\'s id and the text). While frozen is false the file follows the writing build. Once the integrator has frozen it (build-champagne.cjs --freeze, the roster whole) a build may add ids and may never lose one: an id is a learner\'s saved record, and a reworded front or stem is a new id that orphans it.';
function readKeys(file) {
  if (!fs.existsSync(file)) return { about: KEYS_ABOUT, frozen: false, keys: {} };
  const k = JSON.parse(fs.readFileSync(file, 'utf8'));
  return { about: typeof k.about === 'string' ? k.about : KEYS_ABOUT, frozen: k.frozen === true, keys: (k.keys && typeof k.keys === 'object') ? k.keys : {} };
}

/* Reads the plan and the fragments and builds the file in memory. have is keys.v1.json as it stands. */
function build(opts, have) {
  const problems = [];
  const notes = [];
  const missing = [];
  const skipped = [];
  const unchecked = [];
  const plan = S.loadPlan(opts.planFile);
  const f = S.facts(opts.jsDir);
  S.planProblems(plan, f).forEach((p) => problems.push(rel(opts.planFile || path.join(S.DIR, 'plan.json')) + ': ' + p));
  prefixProblems(opts.jsDir, opts.out).forEach((p) => problems.push(p));
  if (!fs.existsSync(opts.fragments)) problems.push('no fragments folder at ' + rel(opts.fragments));
  if (problems.length) return { problems, notes, missing, skipped, unchecked, plan, text: '', keys: {}, stats: {} };
  const all = S.roster(plan);
  const keysOf = all.map((p) => p.key);
  fs.readdirSync(opts.fragments).filter((x) => /\.json$/.test(x)).forEach((x) => {
    const k = x.replace(/\.json$/, '');
    if (keysOf.indexOf(k) < 0) (opts.partial ? notes : problems).push('fragments/' + x + ': ' + k + ' is no house of the plan');
  });
  const records = [];
  const ids = {};
  const keyIds = {};
  all.forEach((pick, index) => {
    const rf = readFragment(opts.fragments, pick.key);
    const name = 'fragments/' + pick.key + '.json';
    if (rf.missing) { missing.push(pick.key); return; }
    if (rf.broken) { (opts.partial ? notes : problems).push(name + ': ' + rf.broken); skipped.push(pick.key); return; }
    const rec = rf.rec;
    const bad = S.validateRecord(rec, plan, { facts: f, jsDir: opts.jsDir, key: pick.key });
    if (bad.length) { skipped.push(pick.key); bad.forEach((p) => (opts.partial ? notes : problems).push(name + ': ' + p)); return; }
    if (!rec.checked) {
      unchecked.push(pick.key);
      if (!opts.partial) { problems.push(name + ': ' + pick.key + ' has no refuter\'s record (checked): the whole build ships only refuted records'); return; }
    }
    const held = have.keys[pick.key];
    const id = held && typeof held.id === 'string' ? held.id : recordId(pick.key);
    if (!S.ID_RE.test(id)) { problems.push(rel(opts.keys) + ': ' + pick.key + ' holds ' + JSON.stringify(id) + ', no hc- id'); return; }
    const out = ship(rec, id, index);
    [out.id].concat(out.cards.map((c) => c.id), out.questions.map((q) => q.id)).forEach((x) => {
      if (ids[x]) problems.push(name + ': the id ' + x + ' is minted twice (also ' + ids[x] + ')');
      ids[x] = pick.key;
    });
    keyIds[pick.key] = { id: out.id, cards: out.cards.map((c) => c.id), questions: out.questions.map((q) => q.id) };
    records.push(out);
  });
  if (!opts.partial) {
    if (missing.length) problems.push('the roster is not whole: ' + missing.length + ' house(s) have no fragment (' + missing.join(', ') + '); pass --partial to build what exists');
    if (skipped.length) problems.push(skipped.length + ' record(s) refused (' + skipped.join(', ') + '): nothing is written');
  } else {
    if (skipped.length) notes.push('skipped, failing the schema: ' + skipped.join(', '));
    if (unchecked.length) notes.push('shipped before a refuter\'s check (partial only): ' + unchecked.join(', '));
  }
  const pos = [0, 0, 0, 0];
  records.forEach((r) => r.questions.forEach((q) => { pos[q.a]++; }));
  const stats = {
    roster: all.length, built: records.length, partial: !!opts.partial && records.length < all.length,
    cards: records.reduce((n, r) => n + r.cards.length, 0), questions: records.reduce((n, r) => n + r.questions.length, 0),
    words: records.reduce((n, r) => n + S.readingWords(r), 0), positions: pos, unchecked: unchecked.length,
    library: records.filter((r) => r.producerId).length, picks: records.filter((r) => r.pick).length, also: records.filter((r) => r.also).length,
    sources: records.reduce((n, r) => n + r.sources.length, 0), primary: records.reduce((n, r) => n + r.sources.filter((s) => s.kind === 'primary').length, 0)
  };
  const meta = { version: 1, edition: plan.edition, roster: stats.roster, built: stats.built, partial: stats.partial, prefix: S.ID_PREFIX, cards: stats.cards, questions: stats.questions };
  const text = header(rel(opts.fragments), stats)
    + 'var CHAMPAGNE_HOUSES = {\n"meta": ' + line(meta) + ',\n"houses": [\n' + records.map((r) => line(r)).join(',\n') + '\n]\n};\n';
  CMS.dashProblems(text, rel(opts.out)).forEach((p) => problems.push(p + ' (the built file itself)'));
  stats.bytes = Buffer.byteLength(text, 'utf8');
  return { problems, notes, missing, skipped, unchecked, plan, text, keys: keyIds, stats, records };
}

/* What keys.v1.json should hold after this build, and what a frozen file forbids. A frozen key the plan no longer
   holds is refused, never dropped. */
function frozenLost(have, plan) {
  if (!have || !have.frozen) return [];
  const picks = new Set(S.roster(plan).map((p) => p.key));
  return Object.keys(have.keys || {}).filter((k) => !picks.has(k)).map((k) => 'keys.v1.json: the frozen key ' + k + ' (' + ((have.keys[k] || {}).id || 'no id') + ') is no house of plan.json, so its record\'s id and its cards and questions would be lost: a house\'s key seeds its frozen id (restore it in plan.json)');
}
function nextKeys(have, built, plan, freeze) {
  const problems = frozenLost(have, plan);
  const keys = {};
  S.roster(plan).forEach((pick) => {
    const b = built[pick.key];
    const h = have.keys[pick.key];
    if (!have.frozen) { if (b) keys[pick.key] = b; else if (h) keys[pick.key] = h; return; }
    if (!h && !b) return;
    if (h && b && h.id !== b.id) problems.push('keys.v1.json: ' + pick.key + ' is frozen as ' + h.id + ', the build gives ' + b.id);
    const o = { id: h ? h.id : b.id, cards: (h ? h.cards : []).slice(), questions: (h ? h.questions : []).slice() };
    ['cards', 'questions'].forEach((kind) => {
      (h ? h[kind] : []).forEach((id) => { if (!b || b[kind].indexOf(id) < 0) problems.push('keys.v1.json: the frozen ' + (kind === 'cards' ? 'card' : 'question') + ' id ' + id + ' of ' + pick.key + ' is no longer minted (a reworded ' + (kind === 'cards' ? 'front' : 'stem') + ' is a new id and orphans a learner\'s record: restore the text)'); });
      (b ? b[kind] : []).forEach((id) => { if (o[kind].indexOf(id) < 0) o[kind].push(id); });
    });
    keys[pick.key] = o;
  });
  return { problems, file: { about: have.about, frozen: have.frozen || !!freeze, keys } };
}
function keysText(k) {
  const ks = Object.keys(k.keys);
  return '{\n "about": ' + JSON.stringify(k.about) + ',\n "frozen": ' + (k.frozen ? 'true' : 'false') + ',\n "keys": {' + (ks.length ? '\n' + ks.map((s) => '  ' + JSON.stringify(s) + ': ' + JSON.stringify(k.keys[s])).join(',\n') + '\n ' : '') + '}\n}\n';
}

/* --plan: the plan against the sheet and the app's own data, the prefix against every file under js/. */
function provePlan(jsDir, outFile) {
  const plan = S.loadPlan();
  const f = S.facts(jsDir);
  const problems = [];
  if (!Object.keys(f.producers).length) problems.push('no WINE_PRODUCERS in ' + rel(jsDir) + '/data-producers.js: the producers cannot be proved');
  if (!Object.keys(f.picks).length) problems.push('no Champagne group in .scripts/flagships: the flagships picks cannot be proved');
  S.planProblems(plan, f).forEach((p) => problems.push(p));
  prefixProblems(jsDir, outFile).forEach((p) => problems.push(p));
  return { problems, plan, facts: f };
}

function summary(s) {
  return s.built + ' of ' + s.roster + ' houses, ' + s.library + ' joined to WINE_PRODUCERS, ' + s.picks + ' with a record in Producers and flagships, ' + s.also + ' with a second cuvée, '
    + s.cards + ' cards, ' + s.questions + ' questions (answers A ' + s.positions[0] + ', B ' + s.positions[1] + ', C ' + s.positions[2] + ', D ' + s.positions[3] + '), '
    + s.words + ' reading words, ' + s.sources + ' sources, ' + s.primary + ' of them primary, ' + s.bytes + ' bytes' + (s.unchecked ? ', ' + s.unchecked + ' not yet refuted' : '') + (s.partial ? ', ' + PARTIAL_MARK : '');
}

module.exports = { build, ship, deal, mint, recordId, itemId, nextKeys, frozenLost, readKeys, keysText, prefixProblems, provePlan, header, summary, PARTIAL_MARK, KEYS_ABOUT, DATA_FILE, LAYER_FILE };

if (require.main === module) {
  let opts;
  try { opts = parseArgs(process.argv.slice(2)); } catch (e) { console.error('build-champagne: ' + e.message); process.exit(2); }
  if (opts.help) { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^#!.*\n/, '').replace(/^\/\*\s?/, '')); process.exit(0); }
  opts.jsDir = path.resolve(opts.jsDir || S.JS_DIR);
  opts.fragments = path.resolve(opts.fragments || path.join(S.DIR, 'fragments'));
  opts.out = path.resolve(opts.out || path.join(opts.jsDir, DATA_FILE));
  opts.keys = path.resolve(opts.keys || path.join(S.DIR, 'keys.v1.json'));

  if (opts.plan) {
    let r;
    try { r = provePlan(opts.jsDir, opts.out); } catch (e) { console.error('build-champagne --plan: ' + e.message); process.exit(1); }
    if (r.problems.length) { r.problems.forEach((p) => console.log('build-champagne --plan: ' + p)); console.log('\nbuild-champagne --plan: ' + r.problems.length + ' problem(s)'); process.exit(1); }
    const picks = S.roster(r.plan);
    console.log('build-champagne --plan: plan.json is proved against the sheet and the app: ' + picks.length + ' houses in the sheet\'s order, each with the sheet\'s own wording ('
      + picks.filter((p) => S.sheetDiffers(p)).length + ' where the sheet and the label differ, ' + picks.filter((p) => p.also).length + ' with a second cuvée), '
      + picks.filter((p) => p.producerId).length + ' producerIds and ' + picks.filter((p) => p.cuveeId).length + ' cuveeIds each a record of WINE_PRODUCERS, ' + picks.filter((p) => !p.producerId).length + ' houses not in the library, '
      + picks.filter((p) => p.pick).length + ' with a record in Producers and flagships; ' + r.plan.chunks.map((c) => c + ' ' + picks.filter((p) => p.chunk === c).length).join(', ')
      + '; the prefix ' + S.ID_PREFIX + ' is the tab\'s alone under ' + rel(opts.jsDir));
    process.exit(0);
  }

  if (opts.lint) {
    const plan = S.loadPlan();
    const f = S.facts(opts.jsDir);
    const pp = S.planProblems(plan, f);
    if (pp.length) { pp.forEach((p) => console.log('plan.json: ' + p)); process.exit(1); }
    let houses = opts.houses.slice();
    if (opts.chunk) {
      const inChunk = S.roster(plan).filter((p) => p.chunk === opts.chunk).map((p) => p.key);
      if (!inChunk.length) { console.error('build-champagne --lint: ' + JSON.stringify(opts.chunk) + ' is no chunk of the plan (' + plan.chunks.join(', ') + ')'); process.exit(2); }
      houses = houses.concat(inChunk);
    }
    if (opts.all) houses = houses.concat(S.roster(plan).map((p) => p.key).filter((k) => fs.existsSync(path.join(opts.fragments, k + '.json'))));
    houses = houses.filter((g, i) => houses.indexOf(g) === i);
    if (!houses.length) { console.error('usage: node .scripts/champagne/build-champagne.cjs --lint <house> [<house> ...] | --chunk <chunk> | --all'); process.exit(2); }
    let bad = 0;
    houses.forEach((k) => {
      const name = 'fragments/' + k + '.json';
      if (!S.pickOf(plan, k)) { console.log(name + ': ' + k + ' is no house of the plan'); bad++; return; }
      const rf = readFragment(opts.fragments, k);
      if (rf.missing) { console.log(name + ': not written yet'); bad++; return; }
      if (rf.broken) { console.log(name + ': ' + rf.broken); bad++; return; }
      const problems = S.validateRecord(rf.rec, plan, { facts: f, jsDir: opts.jsDir, key: k });
      S.adviseRecord(rf.rec, plan).forEach((n) => console.log('note: ' + name + ': ' + n));
      if (problems.length) { problems.forEach((p) => console.log(name + ': ' + p)); bad++; console.log(name + ': ' + problems.length + ' problem(s)'); }
      else console.log(name + ': sound (' + S.readingWords(rf.rec) + ' reading words, ' + (rf.rec.checked ? 'refuted' : 'not yet refuted') + ')');
    });
    console.log('build-champagne --lint: ' + houses.length + ' fragment(s), ' + (houses.length - bad) + ' sound, ' + bad + ' not; nothing written');
    process.exit(bad ? 1 : 0);
  }

  /* --check builds as the shipped file was built */
  if (opts.check && !opts.partial && fs.existsSync(opts.out) && fs.readFileSync(opts.out, 'utf8').slice(0, 4000).indexOf(PARTIAL_MARK) >= 0) opts.partial = true;
  if (opts.freeze && opts.partial) { console.error('build-champagne --freeze: the keys are frozen from the whole build, never a partial one'); process.exit(2); }
  let have, r, next;
  try { have = readKeys(opts.keys); } catch (e) { console.error('build-champagne: ' + rel(opts.keys) + ': ' + e.message); process.exit(1); }
  try { r = build(opts, have); } catch (e) { console.error('build-champagne: ' + (e && e.stack || e)); process.exit(1); }
  r.notes.forEach((n) => console.log('note: ' + n));
  if (r.missing.length) console.log((opts.partial ? 'not written yet (partial build): ' : 'missing: ') + r.missing.length + ' house(s): ' + r.missing.join(', '));
  if (!r.problems.length) { next = nextKeys(have, r.keys, r.plan, opts.freeze); next.problems.forEach((p) => r.problems.push(p)); }
  if (r.problems.length) {
    r.problems.forEach((p) => console.log('build-champagne: ' + p));
    console.log('\nbuild-champagne: ' + r.problems.length + ' problem(s), nothing written');
    process.exit(1);
  }
  const sum = summary(r.stats);
  const kt = keysText(next.file);
  if (opts.check) {
    const diffs = [];
    if (!fs.existsSync(opts.out)) diffs.push(rel(opts.out) + ' is missing');
    else if (fs.readFileSync(opts.out, 'utf8') !== r.text) diffs.push(rel(opts.out) + ' differs from the build of the fragments');
    if (!fs.existsSync(opts.keys)) diffs.push(rel(opts.keys) + ' is missing');
    else if (fs.readFileSync(opts.keys, 'utf8') !== kt) diffs.push(rel(opts.keys) + ' does not hold the ids this build mints');
    if (diffs.length) { diffs.forEach((d) => console.log('build-champagne --check: ' + d)); console.log('build-champagne --check: the files are not the build of the fragments; run the writing build'); process.exit(1); }
    console.log('build-champagne --check: ' + rel(opts.out) + ' is the build of the fragments and ' + rel(opts.keys) + ' holds its ids' + (next.file.frozen ? ' (frozen)' : '') + ' (' + sum + ')');
    process.exit(0);
  }
  fs.writeFileSync(opts.out, r.text);
  fs.writeFileSync(opts.keys, kt);
  console.log('build-champagne: wrote ' + rel(opts.out) + ' and ' + rel(opts.keys) + (next.file.frozen ? ' (frozen)' : '') + ' (' + sum + ')');
  process.exit(0);
}
