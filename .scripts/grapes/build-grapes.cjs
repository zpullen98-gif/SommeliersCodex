#!/usr/bin/env node
/* build-grapes: builds js/data-grapes-table.js, the data of the Grapes tab at the table (codex57), from the roster
   (.scripts/grapes/plan.json) and one fragment per grape (.scripts/grapes/fragments/<slug>.json). BRIEF.md is the
   writer's brief and schema.cjs the one validator; the data file is GENERATED here and never edited by hand.

   Usage:
     node .scripts/grapes/build-grapes.cjs --lint <slug> [<slug> ...]   validate the named fragments; WRITES NOTHING
     node .scripts/grapes/build-grapes.cjs --lint --chunk <g1..g12|pilots>   the same, for a chunk of the roster
     node .scripts/grapes/build-grapes.cjs --lint --all                 the same, for every fragment on disk
     node .scripts/grapes/build-grapes.cjs [--partial]                  the writing build: the data file and keys.v1.json
     node .scripts/grapes/build-grapes.cjs --check                      prove the shipped file is the build; writes nothing
     node .scripts/grapes/build-grapes.cjs --plan                       prove plan.json against the app and the id prefix against the Codex
     node .scripts/grapes/build-grapes.cjs --freeze                     the whole build, then freeze keys.v1.json
     options: --fragments <dir>  --out <file>  --keys <file>  [jsDir]

   WHO RUNS WHAT. Authors and checkers run --lint and nothing else. Only the spec agent, the gates agent and the
   integrator run the writing build; the engineers leave the data file as they find it.

   The lint. Each named fragment is read, held to schema.cjs and printed with every problem (the field, then the rule)
   and every note (what a second reader should look at: never a failure). Exit 1 while a problem stands.

   The writing build. The roster is proved first (its own shape; --plan proves it against the app). Every grape of the
   roster needs a sound fragment; without --partial a missing or a refused one refuses the whole build and nothing is
   written. With --partial the roster need not be whole: a missing fragment is listed, a failing one is skipped with a
   note and its problems, and the file says in its header that it is a partial build.

   The ids. A card's id is gt- and eight base36 digits of FNV-1a 64 (build-regions.cjs's mint) over
   JSON.stringify(['grape:' + slug, front]); a question's the same over its stem. gt- is a prefix nothing else in the
   Codex mints with (--plan and every writing build scan js/ for it). A fragment never carries an id: the build mints,
   and keys.v1.json holds every id it has minted, grape by grape. While that file says frozen: false it follows the
   build. Once the integrator has run --freeze it says frozen: true, and from then on a build may add ids and may
   never lose one: an id is a learner's saved record, and a reworded front or stem is a new card or a new question.

   The deal. Writers key the answer where they like and the engine never shuffles, so the build deals the shipped
   copies as build-cms.cjs does: the answer positions round robin over a grape's three questions, the start carried
   from grape to grape by the roster's order (three times the grape's place in plan.json, so a partial build deals a
   grape exactly as the whole build will), that deal shuffled from 'deal:grape:' + slug and the distractors ordered
   from the stem. Ids come from the slug and the text, never the options, so the deal moves no id.

   The output. js/data-grapes-table.js declares GRAPE_TABLE (one record per slug, in the roster's order, one line a
   record), GRAPE_TABLE_ALIASES (a folded label name to its grape's slug, for the records the file holds) and
   GRAPE_TABLE_META (edition, the roster's size, how many are built, whether the build is partial, the id prefix).
   A record ships the fragment's fields in schema.cjs's order with slug, status, mode and court from the roster; the
   provenance (sayWhy, report, checked) never ships. Raw UTF-8, as the Codex's other generated data files.
   --check builds in memory and compares with the file and with keys.v1.json, writing nothing; it builds as the
   shipped file was built (partial when its header says so). Exits 1 with every problem named. */
'use strict';
const fs = require('fs');
const path = require('path');
const S = require(path.join(__dirname, 'schema.cjs'));
const BR = require(path.join(__dirname, '..', 'regions', 'build-regions.cjs'));

const ROOT = S.ROOT;
const PARTIAL_MARK = 'A PARTIAL BUILD';

function rel(p) { const r = path.relative(ROOT, p); return (!r.startsWith('..') && !path.isAbsolute(r) ? r : p).split(path.sep).join('/'); }
function mintId(slug, text) { return S.ID_PREFIX + BR.b36(BR.fnv1a64(JSON.stringify(['grape:' + slug, text])), 8); }

function parseArgs(argv) {
  const o = { lint: false, all: false, chunk: null, slugs: [], check: false, partial: false, plan: false, freeze: false, fragments: null, out: null, keys: null, jsDir: null, help: false };
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
    else if (o.lint) o.slugs.push(a.replace(/^.*[\\/]/, '').replace(/\.json$/, ''));
    else o.jsDir = a;
  }
  return o;
}

function readFragment(dir, slug) {
  const file = path.join(dir, slug + '.json');
  if (!fs.existsSync(file)) return { slug, file, missing: true, problems: [], notes: [] };
  let frag;
  try { frag = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return { slug, file, problems: ['not valid JSON (' + e.message + ')'], notes: [] }; }
  return { slug, file, frag, problems: [], notes: [] };
}
function judge(rec, plan, jsDir) {
  if (rec.missing || !rec.frag) return rec;
  if (S.rowOf(plan, rec.slug) && rec.frag && rec.frag.slug !== rec.slug) rec.problems.push('slug: the file is ' + rec.slug + '.json, the slug ' + JSON.stringify(rec.frag.slug));
  S.validate(rec.frag, plan, { jsDir }).forEach((p) => rec.problems.push(p));
  rec.notes = S.advise(rec.frag, plan);
  return rec;
}

/* The deal, on the shipped copy of one grape's questions. */
function deal(questions, slug, start) {
  const mc = questions.filter((q) => Array.isArray(q.opts) && q.opts.length === 4 && Number.isInteger(q.a));
  const targets = BR.detShuffle(mc.map((_, i) => (start + i) % 4), 'deal:grape:' + slug);
  mc.forEach((q, i) => {
    const correct = q.opts[q.a];
    const rest = BR.detShuffle(q.opts.filter((_, k) => k !== q.a), 'distractors:' + q.q);
    rest.splice(targets[i], 0, correct);
    q.opts = rest;
    q.a = targets[i];
  });
}
function copy(v) { return JSON.parse(JSON.stringify(v)); }
/* A record as it ships: the fragment's fields in the schema's order, the roster's facts beside them, the ids minted. */
function ship(frag, row, index) {
  const out = { slug: row.slug, name: row.name, colour: row.colour, kind: row.kind, status: row.status, mode: row.mode };
  if (row.court) out.court = true;
  out.aliases = row.aliases.slice();
  out.notIn = frag.notIn.slice();
  out.say = frag.say;
  out.lines = {}; S.LINE_FIELDS.forEach((k) => { out.lines[k] = frag.lines[k]; });
  out.glass = { lead: frag.glass.lead, notes: frag.glass.notes.map((g) => ({ family: g.family, notes: g.notes.slice() })), ladder: frag.glass.ladder.map((r) => ({ climate: r.climate, where: r.where, notes: r.notes.slice() })), structure: frag.glass.structure };
  if (row.mode === 'contrast') {
    const C = frag.worlds.contrast;
    const side = (x) => ({ where: x.where, glass: x.glass, cellar: x.cellar });
    out.worlds = { contrast: { old: side(C.old), new: side(C.new), why: C.why, blur: C.blur, call: C.call } };
  } else out.worlds = { home: { home: frag.worlds.home.home, abroad: frag.worlds.home.abroad } };
  out.service = {}; S.SERVICE_FIELDS.forEach((k) => { out.service[k] = frag.service[k]; });
  out.food = { with: frag.food.with.map((x) => ({ dish: x.dish, why: x.why })) };
  out.labels = frag.labels.map((x) => ({ term: x.term, means: x.means }));
  out.guest = frag.guest.map((x) => ({ q: x.q, a: x.a }));
  out.compare = frag.compare.map((x) => ({ slug: x.slug, tell: x.tell }));
  if (row.status !== 'full') { out.profile = {}; S.PROFILE_FIELDS.forEach((k) => { out.profile[k] = frag.profile[k]; }); }
  if (row.status === 'new') out.targets = frag.targets.slice();
  out.cards = frag.cards.map((c) => ({ id: mintId(row.slug, c.front), front: c.front, back: c.back }));
  out.questions = frag.questions.map((q) => { const o = { id: mintId(row.slug, q.q), q: q.q, opts: copy(q.opts), a: q.a, exp: q.exp }; if (q.tag) o.tag = q.tag; return o; });
  deal(out.questions, row.slug, (index * 3) % 4);
  out.sources = frag.sources.map((s) => ({ title: s.title, url: s.url }));
  return out;
}

function header(from, stats) {
  return '/* The Grapes tab at the table: built by .scripts/grapes/build-grapes.cjs from ' + from + ', never edited by hand.\n'
    + '   GRAPE_TABLE holds one record per grape slug in the roster\'s order (.scripts/grapes/plan.json): how to say the name\n'
    + '   (say), what to say at the table (lines: the ten, twenty and forty-five second lines and the sale), the glass in\n'
    + '   named fruit (glass: a lead, the notes by family, the climate ladder, the structure), the Old World and the New\n'
    + '   World side by side or the grape at home and abroad (worlds), service, food, the words on a label, what guests ask,\n'
    + '   the neighbours it is confused with, a profile where the Codex held none, the regions of a new grape (targets),\n'
    + '   three cards and three questions (ids gt- and eight base36 digits, minted from the slug and the text; the answer\n'
    + '   positions dealt by the build, about a quarter at each) and its sources. GRAPE_TABLE_ALIASES maps a folded label\n'
    + '   name to its grape\'s slug; GRAPE_TABLE_META states the edition and the counts. Every string is British, dash\n'
    + '   free, and names nobody living and no producer.'
    + (stats.partial ? '\n   ' + PARTIAL_MARK + ': ' + stats.built + ' of ' + stats.roster + ' grapes; the whole build replaces it.' : '') + ' */\n';
}
function line(v) { return JSON.stringify(v).split(String.fromCharCode(0x2028)).join('\\u2028').split(String.fromCharCode(0x2029)).join('\\u2029'); }

/* gt- is nobody else's: no file under js/ but the table itself and its layer holds the prefix as an id or as a literal. */
function prefixProblems(jsDir, outFile) {
  const out = [];
  const skip = new Set([path.resolve(outFile || path.join(jsDir, 'data-grapes-table.js')), path.resolve(path.join(jsDir, 'codex57.js'))]);
  const idRe = /\bgt-[0-9a-z]{8}\b/;
  const litRe = /["'`]gt-|\^gt-/;
  const walk = (dir) => {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { walk(p); return; }
      if (!/\.(?:js|json)$/.test(e.name) || skip.has(path.resolve(p))) return;
      const text = fs.readFileSync(p, 'utf8');
      const m = text.match(idRe) || text.match(litRe);
      if (m) out.push(rel(p) + ': holds ' + JSON.stringify(m[0]) + ', so ' + S.ID_PREFIX + ' is not the table\'s alone');
    });
  };
  if (fs.existsSync(jsDir)) walk(jsDir);
  return out;
}

/* Reads the roster and the fragments and builds the file in memory. */
function build(opts) {
  const problems = [];
  const notes = [];
  const missing = [];
  const skipped = [];
  const plan = S.loadPlan(opts.planFile);
  S.planProblems(plan).forEach((p) => problems.push(rel(opts.planFile || path.join(S.DIR, 'plan.json')) + ': ' + p));
  prefixProblems(opts.jsDir, opts.out).forEach((p) => problems.push(p));
  if (!fs.existsSync(opts.fragments)) problems.push('no fragments folder at ' + rel(opts.fragments));
  if (problems.length) return { problems, notes, missing, skipped, plan, text: '', keys: {}, stats: {} };
  const slugs = plan.grapes.map((g) => g.slug);
  fs.readdirSync(opts.fragments).filter((f) => /\.json$/.test(f)).forEach((f) => {
    const s = f.replace(/\.json$/, '');
    if (slugs.indexOf(s) < 0) (opts.partial ? notes : problems).push('fragments/' + f + ': ' + s + ' is no slug of the roster');
  });
  const records = [];
  const ids = {};
  plan.grapes.forEach((row, index) => {
    const rec = judge(readFragment(opts.fragments, row.slug), plan, opts.jsDir);
    if (rec.missing) { missing.push(row.slug); return; }
    if (rec.problems.length) {
      skipped.push(row.slug);
      rec.problems.forEach((p) => (opts.partial ? notes : problems).push('fragments/' + row.slug + '.json: ' + p));
      return;
    }
    const out = ship(rec.frag, row, index);
    out.cards.concat(out.questions).forEach((x) => {
      if (ids[x.id]) problems.push('fragments/' + row.slug + '.json: the id ' + x.id + ' is minted twice (also ' + ids[x.id] + ')');
      ids[x.id] = row.slug;
    });
    records.push(out);
  });
  if (!opts.partial) {
    if (missing.length) problems.push('the roster is not whole: ' + missing.length + ' grape(s) have no fragment (' + missing.join(', ') + '); pass --partial to build what exists');
    if (skipped.length) problems.push(skipped.length + ' fragment(s) refused (' + skipped.join(', ') + '): nothing is written');
  } else if (skipped.length) notes.push('skipped, failing the schema: ' + skipped.join(', '));

  const aliases = {};
  records.forEach((r) => r.aliases.forEach((a) => {
    const k = S.fold(a);
    if (aliases[k] && aliases[k] !== r.slug) problems.push('the alias "' + a + '" is ' + aliases[k] + '\'s and ' + r.slug + '\'s');
    aliases[k] = r.slug;
  }));
  const sortedAliases = {}; Object.keys(aliases).sort().forEach((k) => { sortedAliases[k] = aliases[k]; });
  const keys = {};
  records.forEach((r) => { keys[r.slug] = { cards: r.cards.map((c) => c.id), questions: r.questions.map((q) => q.id) }; });
  const pos = [0, 0, 0, 0];
  let words = 0;
  records.forEach((r) => { r.questions.forEach((q) => { pos[q.a]++; }); });
  plan.grapes.forEach((row) => { const rec = records.find((r) => r.slug === row.slug); if (rec) words += S.readingWords(rec); });
  const stats = {
    roster: plan.grapes.length, built: records.length, partial: !!opts.partial && records.length < plan.grapes.length,
    contrast: records.filter((r) => r.mode === 'contrast').length, home: records.filter((r) => r.mode === 'home').length,
    fresh: records.filter((r) => r.status === 'new').length, thin: records.filter((r) => r.status === 'thin').length,
    cards: records.reduce((n, r) => n + r.cards.length, 0), questions: records.reduce((n, r) => n + r.questions.length, 0),
    words, positions: pos, aliases: Object.keys(aliases).length
  };
  const meta = { version: 1, edition: plan.edition, roster: stats.roster, built: stats.built, partial: stats.partial, prefix: S.ID_PREFIX };
  const text = header(rel(opts.fragments), stats)
    + 'var GRAPE_TABLE = {\n' + records.map((r) => JSON.stringify(r.slug) + ': ' + line(r)).join(',\n') + '\n};\n'
    + 'var GRAPE_TABLE_ALIASES = ' + line(sortedAliases) + ';\n'
    + 'var GRAPE_TABLE_META = ' + line(meta) + ';\n';
  stats.bytes = Buffer.byteLength(text, 'utf8');
  return { problems, notes, missing, skipped, plan, text, keys, stats, records };
}

const KEYS_ABOUT = 'Every id of the Grapes tab at the table, grape by grape in the roster\'s order: three cards and three questions each, gt- and eight base36 digits minted by build-grapes.cjs from the slug and the text (a card\'s front, a question\'s stem). While frozen is false the file follows the writing build. Once the integrator has frozen it (build-grapes.cjs --freeze, the roster whole) a build may add ids and may never lose one: an id is a learner\'s saved record, and a reworded front or stem is a new id that orphans it.';
function readKeys(file) {
  if (!fs.existsSync(file)) return { about: KEYS_ABOUT, frozen: false, keys: {} };
  const k = JSON.parse(fs.readFileSync(file, 'utf8'));
  return { about: typeof k.about === 'string' ? k.about : KEYS_ABOUT, frozen: k.frozen === true, keys: (k.keys && typeof k.keys === 'object') ? k.keys : {} };
}
/* What keys.v1.json should hold after this build, and what a frozen file forbids. */
function nextKeys(have, built, plan, freeze) {
  const problems = [];
  const keys = {};
  plan.grapes.forEach((row) => {
    const b = built[row.slug];
    const h = have.keys[row.slug];
    if (!have.frozen) { if (b) keys[row.slug] = b; return; }
    if (!h && !b) return;
    const o = { cards: (h ? h.cards : []).slice(), questions: (h ? h.questions : []).slice() };
    ['cards', 'questions'].forEach((kind) => {
      (h ? h[kind] : []).forEach((id) => { if (!b || b[kind].indexOf(id) < 0) problems.push('keys.v1.json: the frozen ' + (kind === 'cards' ? 'card' : 'question') + ' id ' + id + ' of ' + row.slug + ' is no longer minted (a reworded ' + (kind === 'cards' ? 'front' : 'stem') + ' is a new id and orphans a learner\'s record: restore the text)'); });
      (b ? b[kind] : []).forEach((id) => { if (o[kind].indexOf(id) < 0) o[kind].push(id); });
    });
    keys[row.slug] = o;
  });
  return { problems, file: { about: have.about, frozen: have.frozen || !!freeze, keys } };
}
function keysText(k) {
  return '{\n "about": ' + JSON.stringify(k.about) + ',\n "frozen": ' + (k.frozen ? 'true' : 'false') + ',\n "keys": {\n'
    + Object.keys(k.keys).map((s) => '  ' + JSON.stringify(s) + ': ' + JSON.stringify(k.keys[s])).join(',\n') + '\n }\n}\n';
}

/* --plan: the roster against the app itself, through the chain the gates use. */
function provePlan(jsDir, outFile) {
  const CHAIN = require(path.join(__dirname, '..', 'cms', 'chain.cjs'));
  const plan = S.loadPlan();
  const ch = CHAIN.loadChain(jsDir);
  const list = ch.J('(function () { var p = {}; v53GrapeProfiles().forEach(function (g) { p[g.g] = 1; }); return v53GrapeJoin().list.map(function (r) { return { slug: r.slug, name: r.name, colour: r.colour, court: !!r.court, world: r.taste ? r.taste.world : null, profile: !!p[r.name] }; }); })()');
  if (!Array.isArray(list)) throw new Error('the chain gave no grape join (' + ch.last() + ')');
  const join = {
    list,
    slugOf: (n) => ch.G('v53GrapeSlugOf(' + JSON.stringify(n) + ')'),
    keyOf: (n) => ch.G('v53GrapeKey(' + JSON.stringify(n) + ')')
  };
  const problems = S.planProblems(plan, join).concat(prefixProblems(jsDir, outFile));
  return { problems, plan, joined: list.length };
}

function summary(s) {
  return s.built + ' of ' + s.roster + ' grapes (' + s.contrast + ' side by side, ' + s.home + ' at home; ' + s.fresh + ' new, ' + s.thin + ' thin filled), '
    + s.cards + ' cards, ' + s.questions + ' questions (answers A ' + s.positions[0] + ', B ' + s.positions[1] + ', C ' + s.positions[2] + ', D ' + s.positions[3] + '), '
    + s.words + ' reading words, ' + s.aliases + ' aliases, ' + s.bytes + ' bytes' + (s.partial ? ', ' + PARTIAL_MARK : '');
}

module.exports = { build, ship, deal, mintId, nextKeys, readKeys, keysText, prefixProblems, provePlan, header, summary, PARTIAL_MARK, KEYS_ABOUT };

if (require.main === module) {
  let opts;
  try { opts = parseArgs(process.argv.slice(2)); } catch (e) { console.error('build-grapes: ' + e.message); process.exit(2); }
  if (opts.help) { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^#!.*\n/, '').replace(/^\/\*\s?/, '')); process.exit(0); }
  opts.jsDir = path.resolve(opts.jsDir || S.JS_DIR);
  opts.fragments = path.resolve(opts.fragments || path.join(S.DIR, 'fragments'));
  opts.out = path.resolve(opts.out || path.join(opts.jsDir, 'data-grapes-table.js'));
  opts.keys = path.resolve(opts.keys || path.join(S.DIR, 'keys.v1.json'));

  if (opts.plan) {
    let r;
    try { r = provePlan(opts.jsDir, opts.out); } catch (e) { console.error('build-grapes --plan: ' + e.message); process.exit(1); }
    if (r.problems.length) { r.problems.forEach((p) => console.log('build-grapes --plan: ' + p)); console.log('\nbuild-grapes --plan: ' + r.problems.length + ' problem(s)'); process.exit(1); }
    const g = r.plan.grapes;
    console.log('build-grapes --plan: plan.json is proved against the app: ' + g.length + ' grapes, ' + g.filter((x) => x.status !== 'new').length + ' in the join\'s own order and names (the join holds ' + r.joined + '), '
      + g.filter((x) => x.status === 'new').length + ' new slugs as v53GrapeSlugOf gives them, ' + g.reduce((n, x) => n + x.aliases.length, 0) + ' aliases resolving to no other grape, ' + r.plan.unresolved.length + ' names still unresolved; '
      + g.filter((x) => x.mode === 'contrast').length + ' side by side, ' + g.filter((x) => x.mode === 'home').length + ' at home; the prefix ' + S.ID_PREFIX + ' is the table\'s alone under ' + rel(opts.jsDir));
    process.exit(0);
  }

  if (opts.lint) {
    const plan = S.loadPlan();
    const pp = S.planProblems(plan);
    if (pp.length) { pp.forEach((p) => console.log('plan.json: ' + p)); process.exit(1); }
    let slugs = opts.slugs.slice();
    if (opts.chunk) {
      const inChunk = plan.grapes.filter((g) => g.chunk === opts.chunk).map((g) => g.slug);
      if (!inChunk.length) { console.error('build-grapes --lint: ' + JSON.stringify(opts.chunk) + ' is no chunk of the roster (' + S.CHUNKS.join(', ') + ')'); process.exit(2); }
      slugs = slugs.concat(inChunk);
    }
    if (opts.all) slugs = slugs.concat(plan.grapes.map((g) => g.slug).filter((s) => fs.existsSync(path.join(opts.fragments, s + '.json'))));
    slugs = slugs.filter((s, i) => slugs.indexOf(s) === i);
    if (!slugs.length) { console.error('usage: node .scripts/grapes/build-grapes.cjs --lint <slug> [<slug> ...] | --chunk <chunk> | --all'); process.exit(2); }
    let bad = 0;
    slugs.forEach((slug) => {
      const name = 'fragments/' + slug + '.json';
      if (!S.rowOf(plan, slug)) { console.log(name + ': ' + slug + ' is no slug of the roster'); bad++; return; }
      const rec = judge(readFragment(opts.fragments, slug), plan, opts.jsDir);
      if (rec.missing) { console.log(name + ': not written yet'); bad++; return; }
      rec.notes.forEach((n) => console.log('note: ' + name + ': ' + n));
      if (rec.problems.length) { rec.problems.forEach((p) => console.log(name + ': ' + p)); bad++; console.log(name + ': ' + rec.problems.length + ' problem(s)'); }
      else console.log(name + ': sound (' + S.readingWords(rec.frag) + ' reading words)');
    });
    console.log('build-grapes --lint: ' + slugs.length + ' fragment(s), ' + (slugs.length - bad) + ' sound, ' + bad + ' not; nothing written');
    process.exit(bad ? 1 : 0);
  }

  /* --check builds as the shipped file was built */
  if (opts.check && !opts.partial && fs.existsSync(opts.out) && fs.readFileSync(opts.out, 'utf8').slice(0, 4000).indexOf(PARTIAL_MARK) >= 0) opts.partial = true;
  if (opts.freeze && opts.partial) { console.error('build-grapes --freeze: the keys are frozen from the whole build, never a partial one'); process.exit(2); }
  let r;
  try { r = build(opts); } catch (e) { console.error('build-grapes: ' + e.message); process.exit(1); }
  r.notes.forEach((n) => console.log('note: ' + n));
  if (r.missing.length) console.log((opts.partial ? 'not written yet (partial build): ' : 'missing: ') + r.missing.length + ' (' + r.missing.join(', ') + ')');
  let have, next;
  if (!r.problems.length) {
    try { have = readKeys(opts.keys); } catch (e) { r.problems.push(rel(opts.keys) + ': ' + e.message); }
    if (have) { next = nextKeys(have, r.keys, r.plan, opts.freeze); next.problems.forEach((p) => r.problems.push(p)); }
  }
  if (r.problems.length) {
    r.problems.forEach((p) => console.log('build-grapes: ' + p));
    console.log('\nbuild-grapes: ' + r.problems.length + ' problem(s), nothing written');
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
    if (diffs.length) { diffs.forEach((d) => console.log('build-grapes --check: ' + d)); console.log('build-grapes --check: the files are not the build of the fragments; run the writing build'); process.exit(1); }
    console.log('build-grapes --check: ' + rel(opts.out) + ' is the build of the fragments and ' + rel(opts.keys) + ' holds its ids' + (next.file.frozen ? ' (frozen)' : '') + ' (' + sum + ')');
    process.exit(0);
  }
  fs.writeFileSync(opts.out, r.text);
  fs.writeFileSync(opts.keys, kt);
  console.log('build-grapes: wrote ' + rel(opts.out) + ' and ' + rel(opts.keys) + (next.file.frozen ? ' (frozen)' : '') + ' (' + sum + ')');
  process.exit(0);
}
