#!/usr/bin/env node
/* build-flagships: builds js/data-flagships.js, the data of the Wine Atlas's Flagships tab (codex58), from the plan
   (.scripts/flagships/plan.json) and one fragment per group (.scripts/flagships/fragments/<group>.json, the group's
   five records in the plan's order). BRIEF.md is the authors' and checkers' contract and schema.cjs the one validator;
   the data file is GENERATED here and never edited by hand.

   Usage:
     node .scripts/flagships/build-flagships.cjs --lint <group> [<group> ...]   validate the named fragments; WRITES NOTHING
     node .scripts/flagships/build-flagships.cjs --lint --chunk <chunk>          the same, for a chunk of plan.chunks
     node .scripts/flagships/build-flagships.cjs --lint --batch <one|A|B|C>      the same, for every written fragment of a batch
     node .scripts/flagships/build-flagships.cjs --lint --all                    the same, for every fragment on disk
     node .scripts/flagships/build-flagships.cjs [--partial]                     the writing build: the data file and keys.v1.json
     node .scripts/flagships/build-flagships.cjs --check                         prove the shipped file and the keys are the build; writes nothing
     node .scripts/flagships/build-flagships.cjs --plan                          prove plan.json against the app and the id prefix against the Codex
     node .scripts/flagships/build-flagships.cjs --freeze                        the whole build, then freeze keys.v1.json (refused with --partial)
     options: --fragments <dir>  --out <file>  --keys <file>  [jsDir]

   WHO RUNS WHAT. Authors and checkers run --lint and nothing else. Only the spec agent, the gates agent, the voice
   editor and the integrator run the writing build; the engineers leave the data file as they find it.

   The lint. Each named fragment is read, held to schema.cjs and printed with every problem (the field, then the rule)
   and every note (what a second reader should look at: never a failure). Exit 1 while a problem stands.

   The batches. A group of plan.json with no batch is wave one's ("one"); wave two's groups carry batch A, B or C.
   plan.built names the batches the whole build ships (["one"], then ["one", "A"], and so on, each batch published
   whole), and FLAGSHIP_META names them once a letter is among them (with wave one alone the file is as wave one
   shipped it, byte for byte).

   The writing build. The plan is proved first, every group of every batch (its shape and the app's regions and
   producers). Without --partial every record of every group of plan.built, in the plan's order, needs a sound
   fragment AND a checker's record (checked, by the refuter): a missing, refused or unchecked record refuses the whole
   build and nothing is written. A written fragment of a batch not built is linted, its problems printed as notes,
   and never shipped. With --partial (scratch copies only) every group of every batch is in scope: a missing group is
   listed, a failing or unchecked record is shipped only when sound (an unsound one is skipped with its problems),
   and the file says in its header that it is a partial build.

   The ids. A record's id is fl- and eight base36 digits of FNV-1a 64 (build-regions.cjs's mint) over
   JSON.stringify(['flagship', key]), key being the pick's key in plan.json; a card's over
   JSON.stringify(['flagship:' + id, front]) and a question's over its stem. The record id is MINTED ONCE: once
   keys.v1.json holds a key's id the build reads it from there and never mints it again. fl- is a prefix nothing else
   in the Codex mints with (--plan and every writing build scan js/: the one literal allowed is codex21's keyOwned
   guard, which already keeps fl- keys out of a level's progress). While keys.v1.json says frozen: false it follows
   the build. Once the integrator has run --freeze, a build may add ids and may never lose one: an id is a learner's
   saved record, and a reworded front or stem is a new card or a new question.

   The deal. Authors key the answer where they like and the engine never shuffles, so the build deals the shipped
   copies as build-grapes.cjs does: the answer positions round robin over a record's two questions, the start carried
   from record to record by the plan's order (twice the record's place among its own batch's picks, so wave one is
   dealt as it always was however wave two's groups sit in the plan, and a partial build deals a record exactly as
   the whole build will), that deal shuffled from 'deal:flagship:' + key and the distractors ordered from the stem.
   Ids come from the key and the text, never the options, so the deal moves no id.

   The output. js/data-flagships.js declares FLAGSHIPS (one record per id, in the plan's order, one line a record),
   FLAGSHIP_GROUPS (the plan's groups in order, each with key, title, region, country and the ids of its built
   records, a group with none left out) and FLAGSHIP_META (edition, wave, the batches built once a letter is among
   them, the roster's size (the picks of the batches built, or of the whole plan in a partial build), how many are
   built, whether the build is partial, the counts, the id prefix). A record ships its fields in schema.cjs's order with its
   id first; the provenance (report, checked) and a source's read never ship. Raw UTF-8, as the Codex's other generated
   data files. --check builds in memory and compares with the file and with keys.v1.json; it builds as the shipped
   file was built (partial when its header says so). Exits 1 with every problem named. */
'use strict';
const fs = require('fs');
const path = require('path');
const S = require(path.join(__dirname, 'schema.cjs'));
const BR = require(path.join(__dirname, '..', 'regions', 'build-regions.cjs'));
const CMS = require(path.join(__dirname, '..', 'cms', 'build-cms.cjs'));

const ROOT = S.ROOT;
const PARTIAL_MARK = 'A PARTIAL BUILD';
/* the one place outside the tab where the prefix may stand, and why */
const PREFIX_ALLOWED = [{ file: 'codex21.js', text: "k.indexOf('fl-') === 0", why: 'codex21 wraps keyOwned so that an fl- key is never a level\'s progress, which is how a flagship key must be read anyway' }];

function rel(p) { const r = path.relative(ROOT, p); return (!r.startsWith('..') && !path.isAbsolute(r) ? r : p).split(path.sep).join('/'); }
function mint(seed) { return S.ID_PREFIX + BR.b36(BR.fnv1a64(JSON.stringify(seed)), 8); }
function recordId(key) { return mint(['flagship', key]); }
function itemId(id, text) { return mint(['flagship:' + id, text]); }

function parseArgs(argv) {
  const o = { lint: false, all: false, chunk: null, batch: null, groups: [], check: false, partial: false, plan: false, freeze: false, fragments: null, out: null, keys: null, jsDir: null, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--lint') o.lint = true;
    else if (a === '--all') o.all = true;
    else if (a === '--chunk') o.chunk = argv[++i];
    else if (a === '--batch') o.batch = argv[++i];
    else if (a === '--check') o.check = true;
    else if (a === '--partial') o.partial = true;
    else if (a === '--plan') o.plan = true;
    else if (a === '--freeze') o.freeze = true;
    else if (a === '--fragments') o.fragments = argv[++i];
    else if (a === '--out') o.out = argv[++i];
    else if (a === '--keys') o.keys = argv[++i];
    else if (a === '--help' || a === '-h') o.help = true;
    else if (a.charAt(0) === '-') throw new Error('unknown option ' + a);
    else if (o.lint) o.groups.push(a.replace(/^.*[\\/]/, '').replace(/\.json$/, ''));
    else o.jsDir = a;
  }
  return o;
}

function readFragment(dir, group) {
  const file = path.join(dir, group + '.json');
  if (!fs.existsSync(file)) return { group, file, missing: true };
  try { return { group, file, frag: JSON.parse(fs.readFileSync(file, 'utf8')) }; }
  catch (e) { return { group, file, broken: 'not valid JSON (' + e.message + ')' }; }
}

/* The deal, on the shipped copy of one record's questions. */
function deal(questions, key, start) {
  const mc = questions.filter((q) => Array.isArray(q.opts) && q.opts.length === 4 && Number.isInteger(q.a));
  const targets = BR.detShuffle(mc.map((_, i) => (start + i) % 4), 'deal:flagship:' + key);
  mc.forEach((q, i) => {
    const correct = q.opts[q.a];
    const rest = BR.detShuffle(q.opts.filter((_, k) => k !== q.a), 'distractors:' + q.q);
    rest.splice(targets[i], 0, correct);
    q.opts = rest;
    q.a = targets[i];
  });
}
function copy(v) { return JSON.parse(JSON.stringify(v)); }
/* A record as it ships: its id first, then the schema's fields in order; the provenance and a source's read left out. */
function ship(rec, id, index) {
  const out = { id };
  S.FIELDS.forEach((k) => {
    if (k === 'wine') { out.wine = {}; S.WINE_FIELDS.forEach((w) => { out.wine[w] = copy(rec.wine[w]); }); }
    else if (k === 'cards') out.cards = rec.cards.map((c) => ({ id: itemId(id, c.front), front: c.front, back: c.back }));
    else if (k === 'questions') out.questions = rec.questions.map((q) => ({ id: itemId(id, q.q), q: q.q, opts: copy(q.opts), a: q.a, exp: q.exp, tag: q.tag }));
    else if (k === 'sources') out.sources = rec.sources.map((s) => ({ title: s.title, url: s.url, kind: s.kind }));
    else out[k] = copy(rec[k]);
  });
  deal(out.questions, rec.key, (index * 2) % 4);
  return out;
}

function header(from, stats) {
  return '/* The Flagships tab of the Wine Atlas: built by .scripts/flagships/build-flagships.cjs from ' + from + ', never edited by hand.\n'
    + '   FLAGSHIPS holds one record per producer, keyed by its id (fl- and eight base36 digits, minted once from the plan\'s\n'
    + '   key and frozen in .scripts/flagships/keys.v1.json), in the plan\'s order: the house (producer, its WINE_PRODUCERS id\n'
    + '   or "", how to say it, its place, the year it was founded or "" where nobody is sure), its flagship wine (name,\n'
    + '   appellation, classification, colour, grapes, sites, making, the glass in named things, ageing, service and the\n'
    + '   words on its label), the line to say at the table, the story, its other wines, the traps, two cards and two\n'
    + '   questions (ids minted from the record\'s id and the text; the answer positions dealt by the build) and the\n'
    + '   sources. FLAGSHIP_GROUPS lists the groups in the plan\'s order with the ids of their records; FLAGSHIP_META states\n'
    + '   the edition and the counts. Every string is British and dash free, and names nobody living.'
    + (stats.partial ? '\n   ' + PARTIAL_MARK + ': ' + stats.built + ' of ' + stats.roster + ' records; the whole build replaces it.' : '') + ' */\n';
}
function line(v) { return JSON.stringify(v).split(String.fromCharCode(0x2028)).join('\\u2028').split(String.fromCharCode(0x2029)).join('\\u2029'); }

/* fl- is the tab's alone: no file under js/ but the data and its layer holds an fl- id or the prefix as a literal,
   but for the allowed guard. */
function prefixProblems(jsDir, outFile) {
  const out = [];
  const skip = new Set([path.resolve(outFile || path.join(jsDir, 'data-flagships.js')), path.resolve(path.join(jsDir, 'codex58.js'))]);
  const idRe = /\bfl-[0-9a-z]{8}\b/;
  const litRe = /["'`]fl-|\^fl-/;
  const walk = (dir) => {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { walk(p); return; }
      if (!/\.(?:js|json)$/.test(e.name) || skip.has(path.resolve(p))) return;
      let text = fs.readFileSync(p, 'utf8');
      PREFIX_ALLOWED.forEach((a) => { if (e.name === a.file) text = text.split(a.text).join(''); });
      const m = text.match(idRe) || text.match(litRe);
      if (m) out.push(rel(p) + ': holds ' + JSON.stringify(m[0]) + ', so ' + S.ID_PREFIX + ' is not the Flagships tab\'s alone');
    });
  };
  if (fs.existsSync(jsDir)) walk(jsDir);
  return out;
}

const KEYS_ABOUT = 'Every id of the Flagships tab, record by record in the plan\'s order: the record\'s id (fl- and eight base36 digits, minted once from the pick\'s key by build-flagships.cjs and read from here ever after), its two cards and its two questions (minted from the record\'s id and the text). While frozen is false the file follows the writing build. Once the integrator has frozen it (build-flagships.cjs --freeze, the roster whole) a build may add ids and may never lose one: an id is a learner\'s saved record, and a reworded front or stem is a new id that orphans it.';
function readKeys(file) {
  if (!fs.existsSync(file)) return { about: KEYS_ABOUT, frozen: false, keys: {} };
  const k = JSON.parse(fs.readFileSync(file, 'utf8'));
  return { about: typeof k.about === 'string' ? k.about : KEYS_ABOUT, frozen: k.frozen === true, keys: (k.keys && typeof k.keys === 'object') ? k.keys : {} };
}

/* The batches a build ships: the whole build plan.built, a partial build every batch the plan holds a group of. */
function shippedBatches(plan, partial) {
  const built = S.builtOf(plan);
  if (!partial) return built;
  return S.BATCHES.filter((b) => built.indexOf(b) >= 0 || (Array.isArray(plan.groups) ? plan.groups : []).some((g) => S.batchOf(g) === b));
}
/* FLAGSHIP_META's batches and wave: wave one alone names none and is wave 1, as wave one shipped */
function metaBatches(batches) { return batches.some((b) => b !== 'one') ? batches.slice() : null; }

/* Reads the plan and the fragments and builds the file in memory. have is keys.v1.json as it stands. */
function build(opts, have) {
  const problems = [];
  const notes = [];
  const missing = [];
  const skipped = [];
  const unchecked = [];
  const lintedOnly = [];
  const plan = S.loadPlan(opts.planFile);
  const f = S.facts(opts.jsDir);
  S.planProblems(plan, f).forEach((p) => problems.push(rel(opts.planFile || path.join(S.DIR, 'plan.json')) + ': ' + p));
  prefixProblems(opts.jsDir, opts.out).forEach((p) => problems.push(p));
  if (!fs.existsSync(opts.fragments)) problems.push('no fragments folder at ' + rel(opts.fragments));
  if (problems.length) return { problems, notes, missing, skipped, unchecked, lintedOnly, plan, text: '', keys: {}, stats: {} };
  const gkeys = plan.groups.map((g) => g.key);
  fs.readdirSync(opts.fragments).filter((x) => /\.json$/.test(x)).forEach((x) => {
    const g = x.replace(/\.json$/, '');
    if (gkeys.indexOf(g) < 0) (opts.partial ? notes : problems).push('fragments/' + x + ': ' + g + ' is no group of the plan');
  });
  const batches = shippedBatches(plan, opts.partial);
  const all = S.roster(plan, batches);
  const records = [];
  const groups = [];
  const ids = {};
  const keyIds = {};
  plan.groups.forEach((g) => {
    const rf = readFragment(opts.fragments, g.key);
    const name = 'fragments/' + g.key + '.json';
    const batch = S.batchOf(g);
    /* a group of a batch not built: its fragment, when written, is linted and never shipped */
    if (batches.indexOf(batch) < 0) {
      if (rf.missing) return;
      lintedOnly.push(g.key);
      const at = name + ' (batch ' + batch + ', not built: linted, never shipped)';
      if (rf.broken) { notes.push(at + ': ' + rf.broken); return; }
      S.validateFragment(rf.frag, plan, { facts: f, jsDir: opts.jsDir }).forEach((p) => notes.push(at + ': ' + p));
      return;
    }
    if (rf.missing) { g.picks.forEach((p) => missing.push(p.key)); return; }
    if (rf.broken) { (opts.partial ? notes : problems).push(name + ': ' + rf.broken); g.picks.forEach((p) => skipped.push(p.key)); return; }
    const frag = rf.frag;
    const whole = S.validateFragment(frag, plan, { facts: f, jsDir: opts.jsDir });
    const shapeOnly = whole.filter((p) => !/^records\[\d+\]/.test(p));
    if (shapeOnly.length || !Array.isArray(frag.records)) {
      shapeOnly.forEach((p) => (opts.partial ? notes : problems).push(name + ': ' + p));
      g.picks.forEach((p) => skipped.push(p.key));
      return;
    }
    const built = [];
    g.picks.forEach((pick, i) => {
      const rec = frag.records[i];
      const at = all.find((r) => r.pick.key === pick.key);
      const mine = whole.filter((p) => p.indexOf('records[' + i + ']') === 0);
      if (mine.length) { skipped.push(pick.key); mine.forEach((p) => (opts.partial ? notes : problems).push(name + ': ' + p)); return; }
      if (!rec.checked) {
        unchecked.push(pick.key);
        if (!opts.partial) { problems.push(name + ': records[' + i + '] ' + pick.key + ' has no checker\'s record (checked): the whole build ships only refuted records'); return; }
      }
      const held = have.keys[pick.key];
      const id = held && typeof held.id === 'string' ? held.id : recordId(pick.key);
      if (!S.ID_RE.test(id)) { problems.push(rel(opts.keys) + ': ' + pick.key + ' holds ' + JSON.stringify(id) + ', no fl- id'); return; }
      const out = ship(rec, id, at.place);
      [out.id].concat(out.cards.map((c) => c.id), out.questions.map((q) => q.id)).forEach((x) => {
        if (ids[x]) problems.push(name + ': the id ' + x + ' is minted twice (also ' + ids[x] + ')');
        ids[x] = pick.key;
      });
      keyIds[pick.key] = { id: out.id, cards: out.cards.map((c) => c.id), questions: out.questions.map((q) => q.id) };
      records.push(out);
      built.push(out.id);
    });
    if (built.length) groups.push({ key: g.key, title: g.title, region: g.region, country: g.country, ids: built });
  });
  if (!opts.partial) {
    if (missing.length) problems.push('the built set (' + S.builtKey(batches) + ') is not whole: ' + missing.length + ' record(s) have no fragment (' + missing.join(', ') + '); pass --partial in a scratch copy to build what exists');
    if (skipped.length) problems.push(skipped.length + ' record(s) refused (' + skipped.join(', ') + '): nothing is written');
  } else {
    if (skipped.length) notes.push('skipped, failing the schema: ' + skipped.join(', '));
    if (unchecked.length) notes.push('shipped before a refuter\'s check (partial only): ' + unchecked.join(', '));
  }
  const pos = [0, 0, 0, 0];
  records.forEach((r) => r.questions.forEach((q) => { pos[q.a]++; }));
  const shipped = metaBatches(opts.partial ? S.BATCHES.filter((b) => groups.some((x) => S.batchOf(S.groupOf(plan, x.key)) === b)) : batches);
  const stats = {
    batches: shipped || ['one'], lintedOnly: lintedOnly.length,
    roster: all.length, built: records.length, partial: !!opts.partial && records.length < all.length, groups: groups.length,
    whole: groups.filter((g) => g.ids.length === S.PICKS).length,
    cards: records.reduce((n, r) => n + r.cards.length, 0), questions: records.reduce((n, r) => n + r.questions.length, 0),
    words: records.reduce((n, r) => n + S.readingWords(r), 0), positions: pos, unchecked: unchecked.length,
    library: records.filter((r) => r.producerId).length
  };
  const meta = Object.assign({ version: 1, edition: plan.edition, wave: shipped ? 2 : 1 }, shipped ? { batches: shipped } : {}, { roster: stats.roster, built: stats.built, groups: stats.groups, partial: stats.partial, prefix: S.ID_PREFIX, cards: stats.cards, questions: stats.questions });
  const text = header(rel(opts.fragments), stats)
    + 'var FLAGSHIPS = {\n' + records.map((r) => JSON.stringify(r.id) + ': ' + line(r)).join(',\n') + '\n};\n'
    + 'var FLAGSHIP_GROUPS = [\n' + groups.map((g) => line(g)).join(',\n') + '\n];\n'
    + 'var FLAGSHIP_META = ' + line(meta) + ';\n';
  CMS.dashProblems(text, rel(opts.out)).forEach((p) => problems.push(p + ' (the built file itself)'));
  stats.bytes = Buffer.byteLength(text, 'utf8');
  return { problems, notes, missing, skipped, unchecked, lintedOnly, plan, text, keys: keyIds, stats, records, groups };
}

/* What keys.v1.json should hold after this build, and what a frozen file forbids. */
function nextKeys(have, built, plan, freeze) {
  const problems = [];
  const keys = {};
  S.roster(plan).forEach(({ pick }) => {
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

/* --plan: the plan against the app's own data, the prefix against every file under js/. */
function provePlan(jsDir, outFile) {
  const plan = S.loadPlan();
  const f = S.facts(jsDir);
  const problems = [];
  if (!Object.keys(f.regions).length) problems.push('no REGIONS in ' + rel(jsDir) + '/data-regions.js: the regions cannot be proved');
  if (!Object.keys(f.producers).length) problems.push('no WINE_PRODUCERS in ' + rel(jsDir) + '/data-producers.js: the producers cannot be proved');
  S.planProblems(plan, f).forEach((p) => problems.push(p));
  prefixProblems(jsDir, outFile).forEach((p) => problems.push(p));
  return { problems, plan, facts: f };
}

function summary(s) {
  return 'the batches ' + S.builtKey(s.batches) + ': ' + s.built + ' of ' + s.roster + ' records in ' + s.groups + ' group(s), ' + s.whole + ' whole, ' + s.library + ' joined to WINE_PRODUCERS, '
    + s.cards + ' cards, ' + s.questions + ' questions (answers A ' + s.positions[0] + ', B ' + s.positions[1] + ', C ' + s.positions[2] + ', D ' + s.positions[3] + '), '
    + s.words + ' reading words, ' + s.bytes + ' bytes' + (s.unchecked ? ', ' + s.unchecked + ' not yet refuted' : '') + (s.partial ? ', ' + PARTIAL_MARK : '')
    + (s.lintedOnly ? '; ' + s.lintedOnly + ' fragment(s) of a batch not built linted and not shipped' : '');
}
/* the batches a shipped file names: FLAGSHIP_META's, wave one alone when it names none */
function fileBatches(text) {
  const m = /\nvar FLAGSHIP_META = (\{.*\});\n/.exec(String(text || ''));
  let meta = null;
  try { meta = m ? JSON.parse(m[1]) : null; } catch (e) { meta = null; }
  return meta && Array.isArray(meta.batches) ? meta.batches : (meta ? ['one'] : null);
}

module.exports = { build, ship, deal, mint, recordId, itemId, nextKeys, readKeys, keysText, prefixProblems, provePlan, header, summary, shippedBatches, metaBatches, fileBatches, PARTIAL_MARK, KEYS_ABOUT, PREFIX_ALLOWED };

if (require.main === module) {
  let opts;
  try { opts = parseArgs(process.argv.slice(2)); } catch (e) { console.error('build-flagships: ' + e.message); process.exit(2); }
  if (opts.help) { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^#!.*\n/, '').replace(/^\/\*\s?/, '')); process.exit(0); }
  opts.jsDir = path.resolve(opts.jsDir || S.JS_DIR);
  opts.fragments = path.resolve(opts.fragments || path.join(S.DIR, 'fragments'));
  opts.out = path.resolve(opts.out || path.join(opts.jsDir, 'data-flagships.js'));
  opts.keys = path.resolve(opts.keys || path.join(S.DIR, 'keys.v1.json'));

  if (opts.plan) {
    let r;
    try { r = provePlan(opts.jsDir, opts.out); } catch (e) { console.error('build-flagships --plan: ' + e.message); process.exit(1); }
    if (r.problems.length) { r.problems.forEach((p) => console.log('build-flagships --plan: ' + p)); console.log('\nbuild-flagships --plan: ' + r.problems.length + ' problem(s)'); process.exit(1); }
    const picks = S.roster(r.plan);
    const regions = new Set(r.plan.groups.map((g) => g.region));
    const per = S.BATCHES.map((b) => { const n = r.plan.groups.filter((g) => S.batchOf(g) === b).length; return (b === 'one' ? 'wave one ' + n : 'batch ' + b + ' ' + n + ' of ' + S.BATCH_GROUPS[b]); }).join(', ');
    console.log('build-flagships --plan: plan.json is proved against the app, every group of every batch: ' + r.plan.groups.length + ' groups (' + per + '; built ' + S.builtKey(S.builtOf(r.plan)) + ') over ' + regions.size + ' region records of REGIONS, each on its own country\'s sheet, '
      + picks.length + ' picks with unique keys and producers, ' + picks.filter((x) => x.pick.producerId).length + ' producerIds each a record of WINE_PRODUCERS, '
      + picks.filter((x) => !x.pick.producerId).length + ' not in the library; ' + r.plan.chunks.length + ' chunks; the prefix ' + S.ID_PREFIX + ' is the tab\'s alone under ' + rel(opts.jsDir)
      + ' (allowed: ' + PREFIX_ALLOWED.map((a) => a.file).join(', ') + ')');
    process.exit(0);
  }

  if (opts.lint) {
    const plan = S.loadPlan();
    const f = S.facts(opts.jsDir);
    const pp = S.planProblems(plan, f);
    if (pp.length) { pp.forEach((p) => console.log('plan.json: ' + p)); process.exit(1); }
    let groups = opts.groups.slice();
    if (opts.chunk) {
      const inChunk = plan.groups.filter((g) => g.chunk === opts.chunk).map((g) => g.key);
      if (!inChunk.length) { console.error('build-flagships --lint: ' + JSON.stringify(opts.chunk) + ' is no chunk of the plan (' + plan.chunks.join(', ') + ')'); process.exit(2); }
      groups = groups.concat(inChunk);
    }
    if (opts.batch) {
      if (S.BATCHES.indexOf(opts.batch) < 0) { console.error('build-flagships --lint: ' + JSON.stringify(opts.batch) + ' is no batch (' + S.BATCHES.join(', ') + ')'); process.exit(2); }
      groups = groups.concat(plan.groups.filter((g) => S.batchOf(g) === opts.batch).map((g) => g.key).filter((k) => fs.existsSync(path.join(opts.fragments, k + '.json'))));
    }
    if (opts.all) groups = groups.concat(plan.groups.map((g) => g.key).filter((k) => fs.existsSync(path.join(opts.fragments, k + '.json'))));
    groups = groups.filter((g, i) => groups.indexOf(g) === i);
    if (!groups.length) { console.error('usage: node .scripts/flagships/build-flagships.cjs --lint <group> [<group> ...] | --chunk <chunk> | --batch <one|A|B|C> | --all (a batch with no fragment written lints nothing)'); process.exit(2); }
    let bad = 0;
    groups.forEach((g) => {
      const name = 'fragments/' + g + '.json';
      if (!S.groupOf(plan, g)) { console.log(name + ': ' + g + ' is no group of the plan'); bad++; return; }
      const rf = readFragment(opts.fragments, g);
      if (rf.missing) { console.log(name + ': not written yet'); bad++; return; }
      if (rf.broken) { console.log(name + ': ' + rf.broken); bad++; return; }
      const problems = S.validateFragment(rf.frag, plan, { facts: f, jsDir: opts.jsDir });
      (Array.isArray(rf.frag.records) ? rf.frag.records : []).forEach((rec, i) => S.adviseRecord(rec, i).forEach((n) => console.log('note: ' + name + ': ' + n)));
      if (problems.length) { problems.forEach((p) => console.log(name + ': ' + p)); bad++; console.log(name + ': ' + problems.length + ' problem(s)'); }
      else console.log(name + ': sound (' + rf.frag.records.length + ' records, ' + rf.frag.records.reduce((n, r) => n + S.readingWords(r), 0) + ' reading words, ' + rf.frag.records.filter((r) => r.checked).length + ' refuted)');
    });
    console.log('build-flagships --lint: ' + groups.length + ' fragment(s), ' + (groups.length - bad) + ' sound, ' + bad + ' not; nothing written');
    process.exit(bad ? 1 : 0);
  }

  /* --check builds as the shipped file was built */
  if (opts.check && !opts.partial && fs.existsSync(opts.out) && fs.readFileSync(opts.out, 'utf8').slice(0, 4000).indexOf(PARTIAL_MARK) >= 0) opts.partial = true;
  if (opts.freeze && opts.partial) { console.error('build-flagships --freeze: the keys are frozen from the whole build, never a partial one'); process.exit(2); }
  let have, r, next;
  try { have = readKeys(opts.keys); } catch (e) { console.error('build-flagships: ' + rel(opts.keys) + ': ' + e.message); process.exit(1); }
  try { r = build(opts, have); } catch (e) { console.error('build-flagships: ' + (e && e.stack || e)); process.exit(1); }
  r.notes.forEach((n) => console.log('note: ' + n));
  if (r.missing.length) console.log((opts.partial ? 'not written yet (partial build): ' : 'missing: ') + r.missing.length + ' record(s) in ' + r.plan.groups.filter((g) => r.missing.indexOf(g.picks[0].key) >= 0).length + ' group(s)');
  if (!r.problems.length) { next = nextKeys(have, r.keys, r.plan, opts.freeze); next.problems.forEach((p) => r.problems.push(p)); }
  if (r.problems.length) {
    r.problems.forEach((p) => console.log('build-flagships: ' + p));
    console.log('\nbuild-flagships: ' + r.problems.length + ' problem(s), nothing written');
    process.exit(1);
  }
  const sum = summary(r.stats);
  const kt = keysText(next.file);
  if (opts.check) {
    const diffs = [];
    if (!fs.existsSync(opts.out)) diffs.push(rel(opts.out) + ' is missing');
    else {
      const was = fs.readFileSync(opts.out, 'utf8');
      const named = fileBatches(was);
      if (!opts.partial && named && S.builtKey(named) !== S.builtKey(r.stats.batches)) diffs.push(rel(opts.out) + ' ships the batches ' + S.builtKey(named) + ', and plan.built names ' + S.builtKey(r.stats.batches));
      if (was !== r.text) diffs.push(rel(opts.out) + ' differs from the build of the fragments');
    }
    if (!fs.existsSync(opts.keys)) diffs.push(rel(opts.keys) + ' is missing');
    else if (fs.readFileSync(opts.keys, 'utf8') !== kt) diffs.push(rel(opts.keys) + ' does not hold the ids this build mints');
    if (diffs.length) { diffs.forEach((d) => console.log('build-flagships --check: ' + d)); console.log('build-flagships --check: the files are not the build of the fragments; run the writing build'); process.exit(1); }
    console.log('build-flagships --check: ' + rel(opts.out) + ' is the build of the fragments and ' + rel(opts.keys) + ' holds its ids' + (next.file.frozen ? ' (frozen)' : '') + ' (' + sum + ')');
    process.exit(0);
  }
  fs.writeFileSync(opts.out, r.text);
  fs.writeFileSync(opts.keys, kt);
  console.log('build-flagships: wrote ' + rel(opts.out) + ' and ' + rel(opts.keys) + (next.file.frozen ? ' (frozen)' : '') + ' (' + sum + ')');
  process.exit(0);
}
