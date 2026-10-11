#!/usr/bin/env node
/* build-regions: merges every fragment under .scripts/regions/fragments into js/data-regions.js and js/regions/.

   Usage: node .scripts/regions/build-regions.cjs [--check] [--partial] [--fragments <dir>] [--out <file>] [jsDir]

   A fragment is <sheet>.json (a whole sheet), <sheet>.<n>.json (a part of one, carrying
   part: { indices, country }) or mapless.json / mapless.<n>.json (the map-less countries).
   Every fragment is held to check-fragment.cjs first. The parts of a sheet are grouped and
   their regions ordered by index; unless --partial, every sheet of ATLAS_V2 must be complete
   (every index once, exactly one country) and every map-less country present once.

   The join is derived here: aliases (merged; one key keeps one target, or a list of targets when
   it names a place in each of two or more countries, the four US sheets counting as one; two
   targets in one country, or an alias whose key is another article's folded name in its own
   country, is a failure naming both), terroir (the terroirRows merged), cats (merged, a cat two fragments name gets both
   lists), grapes (every article's and country's grapes[].name to the slugs and keys that grow
   it) and countryOnly (every map-less key, every sheet key and every alias whose target is a
   country key). A question with no id is minted one: 'r-' plus eight base36 digits of FNV-1a 64
   over JSON.stringify([slug or key, stem]), the port of mint-ids.py; an existing id is kept (a
   writer who rewords a stem pins the old id in the fragment) and a duplicate is a failure. An
   article's asked is closed upwards (a region asked at Village is asked at Premier Cru and Grand
   Cru too), so the Quick quiz's region picks at a level hold every region a lower level asks.
   Object keys are sorted, so the output is byte-identical run to run.

   THE SPLIT (11 October 2026). The whole build is near 2.9 MB, too much for the shell precache a
   phone downloads at install, so it is written in two layers. js/data-regions.js is the INDEX the
   shell loads and precaches: the join, the sheets, and for every article and country the fields
   the layer needs before anything is read (INDEX_REGION, INDEX_COUNTRY: the names, the place on
   the map, the levels, the summary, the cards and the questions, so every deck and drill works
   offline from install) with its grapes cut to name and role, plus REGIONS.parts, the stamp of each
   reading file. The READING (every other field, the grapes whole) is js/regions/<sheet>.json, one
   file per atlas sheet holding its articles and its country, and js/regions/mapless.json for the
   map-less countries: { part, records: { slug or key: fields }, version }. codex39 fetches a file
   the first time a page of that sheet opens and merges it into the index's records; the worker
   keeps it in a cache of its own. The stamp is FNV-1a 64 over the file's bytes, so the address
   (js/regions/<sheet>.json?v=<stamp>) changes exactly when the file does. A stale file in
   js/regions/ is removed. check-regions.js merges the two back and proves the whole.

   --check builds in memory and compares the index and every reading file with the disk, writing
   nothing (exit 1 when one differs, is missing or is stale). --partial builds what exists and
   prints what is missing, for testing. --fragments and --out point the build elsewhere, for a
   fixture (the reading files go to regions/ beside --out). Exits 1 with every problem named. */
'use strict';
const fs = require('fs');
const path = require('path');
const CF = require(path.join(__dirname, 'check-fragment.cjs'));
const JOIN = require(path.join(__dirname, 'regions-join.cjs'));

const HEADER = '/* The regions in depth: built by .scripts/regions/build-regions.cjs from .scripts/regions/fragments, never edited by hand.\n'
  + '   This is the index: REGIONS.regions holds one record per atlas region, in sheet and map order, and REGIONS.countries\n'
  + '   one per country key, each with its names, levels, summary, grapes (name and role), cards and questions; the rest of\n'
  + '   each article is in js/regions/<part>.json, fetched on first open (REGIONS.parts, the stamp of each). REGIONS.join\n'
  + '   holds the aliases, chapters, country-only keys, grapes and terroir rows the resolver in .scripts/regions/regions-join.cjs\n'
  + '   reads. Every string is British, dash free and names nobody living. */\n';

/* The split: what the index keeps of a record; every other field goes to its reading file. */
const INDEX_REGION = ['asked', 'cards', 'index', 'name', 'questions', 'sheet', 'slug', 'summary'];
const INDEX_COUNTRY = ['cards', 'key', 'mapless', 'name', 'questions', 'regionsOrder', 'sheet', 'summary'];
const PARTS_DIR = 'regions';
/* The reading file a record belongs to: an article's sheet, a sheet country's sheet, mapless for the rest. */
function partName(rec, isCountry) { return isCountry ? (rec.mapless === 1 || !rec.sheet ? 'mapless' : rec.sheet) : rec.sheet; }
function splitRecord(rec, keep) {
  const index = {};
  const reading = {};
  Object.keys(rec).forEach((k) => {
    if (keep.indexOf(k) >= 0) index[k] = rec[k];
    else reading[k] = rec[k];
  });
  if (Array.isArray(rec.grapes)) index.grapes = rec.grapes.map((g) => ({ name: g && g.name, role: g && g.role }));
  return { index, reading };
}
function stampOf(text) { return b36(fnv1a64(text), 10); }

/* The id mint, the port of mint-ids.py lines 52 to 65. */
function fnv1a64(s) {
  let h = 0xcbf29ce484222325n;
  for (const b of Buffer.from(String(s), 'utf8')) {
    h ^= BigInt(b);
    h = (h * 0x100000001b3n) & 0xffffffffffffffffn;
  }
  return h;
}
function b36(n, width) {
  const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
  let out = '';
  let v = n;
  while (v) { out = digits[Number(v % 36n)] + out; v = v / 36n; }
  return out.padStart(width, '0').slice(-width);
}
function mintId(owner, stem) { return 'r-' + b36(fnv1a64(JSON.stringify([owner, stem])), 8); }
const ID_RE = /^r-[0-9a-z]{8}$/;
/* The service references' mint (js/data-service-ref.js is written by hand, not built): 's-' plus eight base36 digits
   of FNV-1a 64 over JSON.stringify(['service', stem]). Minted once, written into the question and never re-minted, so
   a reworded stem keeps its id; check-regions.js asks every service question for one and names the id to pin. */
function mintServiceId(stem) { return 's-' + b36(fnv1a64(JSON.stringify(['service', stem])), 8); }
const SERVICE_ID_RE = /^s-[0-9a-z]{8}$/;
/* The levels a region is asked at, closed upwards: an exam that asks a region at one level asks it at every level
   above (the Premier Cru paper assumes the Village one), so a writer's [intro, certified] becomes all four. */
function closeAsked(asked) {
  const list = Array.isArray(asked) ? asked : [];
  const lo = CF.LEVELS.findIndex((l) => list.indexOf(l) >= 0);
  return lo < 0 ? list.slice() : CF.LEVELS.slice(lo);
}
/* The option deal, the port of rewrite/lib.py's _det_shuffle and bake_option_order. The engine
   (core.js) never shuffles options, and writers key the answer first, so the build deals the
   answer positions round robin over each article's multiple choice questions, shuffles that deal
   and orders the distractors from the stem, all deterministically: the spread within an article
   differs by at most one, and a second build is the same bytes. Ids are minted from the owner and
   the stem, never from the options, so the deal can move no id. */
function detShuffle(seq, seed) {
  let h = fnv1a64(seed);
  const out = seq.slice();
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 6364136223846793005n + 1442695040888963407n) & 0xffffffffffffffffn;
    const j = Number((h >> 33n) % BigInt(i + 1));
    const t = out[i]; out[i] = out[j]; out[j] = t;
  }
  return out;
}
function bakeOptionOrder(owner, list) {
  const mc = (list || []).filter((q) => q && q.sa !== 1 && Array.isArray(q.opts) && q.opts.length === 4 && Number.isInteger(q.a));
  const targets = detShuffle(mc.map((_, i) => i % 4), 'deal:' + owner);
  mc.forEach((q, i) => {
    const correct = q.opts[q.a];
    const rest = detShuffle(q.opts.filter((_, k) => k !== q.a), 'distractors:' + q.q);
    rest.splice(targets[i], 0, correct);
    q.opts = rest;
    q.a = targets[i];
  });
}

function sortKeys(v) {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === 'object') {
    const o = {};
    Object.keys(v).sort().forEach((k) => { o[k] = sortKeys(v[k]); });
    return o;
  }
  return v;
}
/* JSON that a classic script parses whatever the engine: the two line separators escaped. */
/* One entry per line between the brackets, or the empty pair. */
function block(open, lines, close) { return lines.length ? open + '\n' + lines.join(',\n') + '\n' + close : open + close; }
function json(v) { return JSON.stringify(sortKeys(v)).split(String.fromCharCode(0x2028)).join('\\u2028').split(String.fromCharCode(0x2029)).join('\\u2029'); }

function parseArgs(argv) {
  const o = { check: false, partial: false, fragments: null, out: null, jsDir: null, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--check') o.check = true;
    else if (a === '--partial') o.partial = true;
    else if (a === '--fragments') o.fragments = argv[++i];
    else if (a === '--out') o.out = argv[++i];
    else if (a === '--help' || a === '-h') o.help = true;
    else if (a.charAt(0) === '-') throw new Error('unknown option ' + a);
    else o.jsDir = a;
  }
  return o;
}

/* Reads and groups the fragments. Returns { problems, missing, regions, countries, join, files }. */
function build(opts) {
  const jsDir = opts.jsDir;
  const dir = opts.fragments;
  const problems = [];
  const notes = [];
  const codex = CF.loadCodex(jsDir);
  const atlas = codex.atlas;
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /\.json$/.test(f)).sort() : [];
  if (!fs.existsSync(dir)) notes.push('no fragments folder at ' + dir);

  const bySheet = {};
  CF.SHEETS.forEach((s) => { bySheet[s] = { regions: new Array(atlas.sheets[s].regions.length).fill(null), from: new Array(atlas.sheets[s].regions.length).fill(null), country: null, countryFrom: null }; });
  const mapless = {};
  const maplessFrom = {};
  const aliasEntries = {};
  const terroir = {};
  const terroirFrom = {};
  const cats = {};

  for (const f of files) {
    const file = path.join(dir, f);
    const m = /^([a-z-]+?)(?:\.(\d+))?\.json$/.exec(f);
    if (!m) { problems.push(f + ': a fragment is <sheet>.json, <sheet>.<n>.json, mapless.json or mapless.<n>.json'); continue; }
    const base = m[1];
    if (base !== 'mapless' && CF.SHEETS.indexOf(base) < 0) { problems.push(f + ': ' + base + ' is no atlas sheet and not mapless'); continue; }
    let frag;
    try { frag = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { problems.push(f + ': ' + e.message); continue; }
    if (base === 'mapless') { if (frag.sheet !== undefined) { problems.push(f + ': a mapless fragment carries no sheet'); continue; } }
    else if (frag.sheet !== base) { problems.push(f + ': sheet must be ' + base + ' (the file name), found ' + JSON.stringify(frag.sheet)); continue; }
    const fp = CF.checkFragment(frag, file, codex);
    if (fp.length) {
      if (opts.partial) { notes.push(f + ': skipped, ' + fp.length + ' check-fragment problem(s): ' + fp.slice(0, 3).join('; ') + (fp.length > 3 ? '; ...' : '')); continue; }
      fp.forEach((p) => problems.push(f + ': ' + p));
      continue;
    }
    if (frag.sheet !== undefined) {
      const S = bySheet[frag.sheet];
      const part = frag.part && typeof frag.part === 'object' ? frag.part : null;
      const indices = part ? part.indices : frag.regions.map((r, i) => i);
      frag.regions.forEach((r, k) => {
        const i = indices[k];
        if (S.regions[i]) { problems.push(f + ': ' + frag.sheet + ' index ' + i + ' is written twice, here and in ' + S.from[i]); return; }
        S.regions[i] = r; S.from[i] = f;
      });
      if (!part || part.country === true) {
        if (S.country) problems.push(f + ': ' + frag.sheet + ' carries two countries, here and in ' + S.countryFrom);
        else { S.country = frag.country; S.countryFrom = f; }
      }
    } else {
      frag.countries.forEach((c) => {
        if (mapless[c.key]) { problems.push(f + ': the map-less country ' + c.key + ' is written twice, here and in ' + maplessFrom[c.key]); return; }
        mapless[c.key] = c; maplessFrom[c.key] = f;
      });
    }
    /* every (key, target) once, in file order; whether two targets of one key share a country is judged below, once every article's sheet is known */
    Object.keys(frag.aliases || {}).forEach((k) => {
      const t = frag.aliases[k];
      if (!aliasEntries[k]) aliasEntries[k] = [];
      if (!aliasEntries[k].some((e) => e.t === t)) aliasEntries[k].push({ t, from: f });
    });
    Object.keys(frag.terroirRows || {}).forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(terroir, k) && terroir[k] !== frag.terroirRows[k]) { problems.push('terroirRows["' + k + '"]: ' + f + ' says ' + frag.terroirRows[k] + ' and ' + terroirFrom[k] + ' says ' + terroir[k]); return; }
      terroir[k] = frag.terroirRows[k]; if (!terroirFrom[k]) terroirFrom[k] = f;
    });
    Object.keys(frag.cats || {}).forEach((k) => {
      if (!cats[k]) cats[k] = [];
      frag.cats[k].forEach((s) => { if (cats[k].indexOf(s) < 0) cats[k].push(s); });
    });
  }

  /* completeness */
  const missing = [];
  CF.SHEETS.forEach((s) => {
    const S = bySheet[s];
    const gaps = [];
    S.regions.forEach((r, i) => { if (!r) gaps.push(i + ' (' + atlas.sheets[s].regions[i].name + ')'); });
    if (gaps.length) missing.push(s + ': regions ' + gaps.join(', '));
    if (!S.country) missing.push(s + ': its country');
  });
  CF.MAPLESS.forEach((k) => { if (!mapless[k]) missing.push('mapless: ' + k); });
  if (missing.length && !opts.partial) problems.push('the build is incomplete: ' + missing.length + ' missing (listed above); pass --partial to build what exists');

  /* the records in order */
  const regions = [];
  const countries = {};
  CF.SHEETS.forEach((s) => {
    const S = bySheet[s];
    S.regions.forEach((r) => { if (r) regions.push(r); });
    if (S.country) {
      countries[s] = S.country;
      const slugs = S.regions.map((r) => (r ? r.slug : null));
      if (slugs.every((x) => x) && S.country.regionsOrder.join() !== slugs.join()) problems.push(S.countryFrom + ': country.regionsOrder must be the sheet\'s slugs in map order: ' + slugs.join(', '));
    }
  });
  CF.MAPLESS.forEach((k) => { if (mapless[k]) countries[k] = mapless[k]; });

  /* slugs */
  const keySet = new Set(CF.SHEETS.concat(CF.MAPLESS).concat(Object.keys(countries)));
  const seenSlug = {};
  regions.forEach((r) => {
    if (seenSlug[r.slug]) problems.push('slug ' + r.slug + ' is used by two articles (' + seenSlug[r.slug] + ' and ' + r.name + ')');
    seenSlug[r.slug] = r.name;
    if (keySet.has(r.slug)) problems.push('slug ' + r.slug + ' (' + r.name + ') equals a country key');
  });
  const targets = new Set(Object.keys(seenSlug).concat(Object.keys(countries)));

  /* the aliases: one target per key, or a list when the key names a place in each of two or more countries
     (la rioja, san rafael); two targets in ONE country is a clash, and so is an alias whose key is another
     article's folded name in its own country (the four US sheets are one country) */
  const sheetOf = {};
  regions.forEach((r) => { sheetOf[r.slug] = r.sheet; });
  const countryOfTarget = (t) => (Object.prototype.hasOwnProperty.call(sheetOf, t) ? JOIN.countryGroup(sheetOf[t]) : (Object.prototype.hasOwnProperty.call(countries, t) ? JOIN.countryGroup(t) : null));
  const nameOwners = {};
  regions.forEach((r) => { const k = CF.fold(r.name); (nameOwners[k] = nameOwners[k] || []).push(r.slug); });
  const aliases = {};
  const aliasFrom = {};
  Object.keys(aliasEntries).sort().forEach((k) => {
    const list = aliasEntries[k];
    let clash = false;
    list.forEach((e, i) => list.slice(0, i).forEach((d) => {
      const ce = countryOfTarget(e.t), cd = countryOfTarget(d.t);
      if (ce && ce === cd) { clash = true; problems.push('aliases["' + k + '"]: ' + e.from + ' says ' + e.t + ' and ' + d.from + ' says ' + d.t + ', two targets in one country'); }
    }));
    list.forEach((e) => (nameOwners[k] || []).forEach((slug) => {
      if (slug !== e.t && countryOfTarget(slug) && countryOfTarget(slug) === countryOfTarget(e.t)) { clash = true; problems.push('aliases["' + k + '"]: ' + e.from + ' sends it to ' + e.t + ', but it is the name of the article ' + slug + ' in the same country'); }
    }));
    if (clash) return;
    aliases[k] = list.length === 1 ? list[0].t : list.map((e) => e.t);
    aliasFrom[k] = list.map((e) => e.from).join(' and ');
  });
  const aliasTargets = (k) => JOIN.targetList(aliases[k]);

  /* the join */
  const grapes = {};
  const addGrape = (list, to) => (list || []).forEach((g) => { if (!g || !g.name) return; if (!grapes[g.name]) grapes[g.name] = []; if (grapes[g.name].indexOf(to) < 0) grapes[g.name].push(to); });
  regions.forEach((r) => addGrape(r.grapes, r.slug));
  Object.keys(countries).forEach((k) => addGrape(countries[k].grapes, k));
  const countryOnly = new Set(Object.keys(countries));
  Object.keys(aliases).forEach((k) => { if (aliasTargets(k).some((t) => Object.prototype.hasOwnProperty.call(countries, t))) countryOnly.add(k); });
  Object.keys(aliases).forEach((k) => aliasTargets(k).forEach((t) => { if (!targets.has(t)) problems.push('aliases["' + k + '"]: ' + t + ' is no slug or country key of the build (' + aliasFrom[k] + ')'); }));
  Object.keys(terroir).forEach((k) => { if (!targets.has(terroir[k])) problems.push('terroirRows["' + k + '"]: ' + terroir[k] + ' is no slug or country key of the build (' + terroirFrom[k] + ')'); });
  Object.keys(cats).forEach((k) => cats[k].forEach((s) => { if (!targets.has(s)) problems.push('cats["' + k + '"]: ' + s + ' is no slug or country key of the build'); }));
  const join = { aliases, cats, countryOnly: Array.from(countryOnly).sort(), grapes, terroir };

  /* the levels, closed upwards */
  let closed = 0;
  regions.forEach((r) => { const c = closeAsked(r.asked); if (c.join() !== (r.asked || []).join()) closed++; r.asked = c; });
  if (closed) notes.push(closed + ' article(s) asked at a level and not at every level above it; the build asks them upwards');

  /* the ids */
  const ids = {};
  let minted = 0, kept = 0, questions = 0, cards = 0;
  const mint = (owner, list, where) => (list || []).forEach((q, i) => {
    questions++;
    if (q.id !== undefined && ID_RE.test(q.id)) kept++;
    else { q.id = mintId(owner, q.q); minted++; }
    if (ids[q.id]) problems.push(where + '.questions[' + i + ']: duplicate id ' + q.id + ' (also ' + ids[q.id] + ')');
    ids[q.id] = where + '.questions[' + i + ']';
  });
  regions.forEach((r) => { bakeOptionOrder(r.slug, r.questions); mint(r.slug, r.questions, r.slug); cards += (r.cards || []).length; });
  Object.keys(countries).forEach((k) => { bakeOptionOrder(k, countries[k].questions); mint(k, countries[k].questions, k); cards += (countries[k].cards || []).length; });

  const sheets = CF.SHEETS.filter((s) => bySheet[s].country || bySheet[s].regions.some((r) => r));
  /* the split: the reading files first, since the index carries their stamps */
  const reading = {};
  const indexRegions = regions.map((r) => {
    const sp = splitRecord(r, INDEX_REGION);
    const p = partName(r, false);
    (reading[p] = reading[p] || {})[r.slug] = sp.reading;
    return sp.index;
  });
  const indexCountries = {};
  Object.keys(countries).forEach((k) => {
    const sp = splitRecord(countries[k], INDEX_COUNTRY);
    const p = partName(countries[k], true);
    (reading[p] = reading[p] || {})[k] = sp.reading;
    indexCountries[k] = sp.index;
  });
  const parts = {};
  const stamps = {};
  Object.keys(reading).sort().forEach((p) => {
    const recs = reading[p];
    parts[p] = '{\n"part": ' + JSON.stringify(p) + ',\n"records": ' + block('{', Object.keys(recs).sort().map((k) => JSON.stringify(k) + ': ' + json(recs[k])), '}') + ',\n"version": 2\n}\n';
    stamps[p] = stampOf(parts[p]);
  });
  const text = HEADER + 'var REGIONS = {\n'
    + '"countries": ' + block('{', Object.keys(indexCountries).sort().map((k) => JSON.stringify(k) + ': ' + json(indexCountries[k])), '}') + ',\n'
    + '"join": ' + block('{', Object.keys(join).sort().map((k) => JSON.stringify(k) + ': ' + json(join[k])), '}') + ',\n'
    + '"parts": ' + json(stamps) + ',\n'
    + '"regions": ' + block('[', indexRegions.map((r) => json(r)), ']') + ',\n'
    + '"sheets": ' + json(sheets) + ',\n'
    + '"version": 2\n'
    + '};\n';
  const partBytes = Object.keys(parts).reduce((n, p) => n + Buffer.byteLength(parts[p], 'utf8'), 0);
  return { problems, notes, missing, text, parts, stamps, files, stats: { regions: regions.length, countries: Object.keys(countries).length, questions, minted, kept, cards, aliases: Object.keys(aliases).length, bytes: Buffer.byteLength(text, 'utf8'), parts: Object.keys(parts).length, partBytes } };
}

module.exports = { build, fnv1a64, b36, mintId, sortKeys, HEADER, ID_RE, detShuffle, bakeOptionOrder, INDEX_REGION, INDEX_COUNTRY, PARTS_DIR, partName, stampOf, mintServiceId, SERVICE_ID_RE, closeAsked };

if (require.main === module) {
  let opts;
  try { opts = parseArgs(process.argv.slice(2)); } catch (e) { console.error('build-regions: ' + e.message); process.exit(2); }
  if (opts.help) {
    console.log('usage: node .scripts/regions/build-regions.cjs [--check] [--partial] [--fragments <dir>] [--out <file>] [jsDir]');
    console.log('  --check      build in memory and compare with the file on disk, writing nothing');
    console.log('  --partial    build what exists and print what is missing');
    console.log('  --fragments  the folder of fragments (default .scripts/regions/fragments)');
    console.log('  --out        the index to write (default <jsDir>/data-regions.js); the reading files go to regions/ beside it');
    process.exit(0);
  }
  opts.jsDir = opts.jsDir || path.join(__dirname, '..', '..', 'js');
  opts.fragments = opts.fragments || path.join(__dirname, 'fragments');
  opts.out = opts.out || path.join(opts.jsDir, 'data-regions.js');
  let r;
  try { r = build(opts); } catch (e) { console.error('build-regions: ' + e.message); process.exit(1); }
  r.notes.forEach((n) => console.log('note: ' + n));
  if (r.missing.length) {
    console.log((opts.partial ? 'missing (partial build): ' : 'missing: ') + r.missing.length);
    r.missing.forEach((m) => console.log('  ' + m));
  }
  if (r.problems.length) {
    r.problems.forEach((p) => console.log('build-regions: ' + p));
    console.log('\nbuild-regions: ' + r.problems.length + ' problem(s), nothing written');
    process.exit(1);
  }
  const s = r.stats;
  const summary = r.files.length + ' fragment(s), ' + s.regions + ' regions, ' + s.countries + ' countries, ' + s.questions + ' questions (' + s.minted + ' minted, ' + s.kept + ' kept), ' + s.cards + ' cards, ' + s.aliases + ' aliases, index ' + s.bytes + ' bytes, ' + s.parts + ' reading files ' + s.partBytes + ' bytes';
  const partsDir = path.join(path.dirname(opts.out), PARTS_DIR);
  const want = Object.keys(r.parts).map((p) => p + '.json');
  const stale = fs.existsSync(partsDir) ? fs.readdirSync(partsDir).filter((f) => /\.json$/.test(f) && want.indexOf(f) < 0) : [];
  if (opts.check) {
    const diffs = [];
    if (!fs.existsSync(opts.out)) diffs.push(opts.out + ' is missing');
    else if (fs.readFileSync(opts.out, 'utf8') !== r.text) diffs.push(opts.out + ' differs');
    Object.keys(r.parts).forEach((p) => {
      const f = path.join(partsDir, p + '.json');
      if (!fs.existsSync(f)) diffs.push(f + ' is missing');
      else if (fs.readFileSync(f, 'utf8') !== r.parts[p]) diffs.push(f + ' differs');
    });
    stale.forEach((f) => diffs.push(path.join(partsDir, f) + ' is stale (no part of the build)'));
    if (diffs.length) { diffs.forEach((d) => console.log('build-regions --check: ' + d)); console.log('build-regions --check: the files are not the build of the fragments; run the build'); process.exit(1); }
    console.log('build-regions --check: ' + opts.out + ' and ' + partsDir + ' are the build of the fragments (' + summary + ')');
    process.exit(0);
  }
  fs.writeFileSync(opts.out, r.text);
  if (!fs.existsSync(partsDir)) fs.mkdirSync(partsDir, { recursive: true });
  Object.keys(r.parts).forEach((p) => fs.writeFileSync(path.join(partsDir, p + '.json'), r.parts[p]));
  stale.forEach((f) => { fs.unlinkSync(path.join(partsDir, f)); console.log('build-regions: removed the stale ' + path.join(partsDir, f)); });
  console.log('build-regions: wrote ' + opts.out + ' and ' + Object.keys(r.parts).length + ' reading files in ' + partsDir + ' (' + summary + ')');
  process.exit(0);
}
