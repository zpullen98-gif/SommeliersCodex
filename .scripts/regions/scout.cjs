#!/usr/bin/env node
/* scout: the read-only source bundle for one content chunk of the atlas in depth (22 October 2026).

   Usage: node .scripts/regions/scout.cjs <chunk input.json> [jsDir]

   input.json is { chunk, family: T|N|C|D, keys: [...], sheet?, file? }: T techniques, N new articles off the
   map, C new map-less countries, D existing records deepened (file names their fragment). scout.json is
   written beside it and nothing else is touched. For every key it gathers:
     the current record from the fragments, or the roster's entry for a new one;
     the atlas region (name, note, studyNotes, anchors) and its sheet (title, intro, scope, reading), and the
       sheet's other regions whose note names the place (where a place now moves);
     the TERROIR rows that resolve to it, the chapters (PRIMERS, ADV_PRIMERS, MASTER_PRIMERS and INTRO_PRIMERS
       bodies whose cat or text names the place, best first, at most six, each cut to 1,500 words), the
       house's wines whose region string resolves to it, the WINE_PRODUCERS houses that fit, and the aliases
       pointing at it, all read through the join as it will stand once the roster is applied (the new
       articles and countries and their aliases added, GEORGIA_MOVE given to georgia);
     the roster's MUST_LINK and takes for it (and, for an older article, the new articles that take from it);
   and for a technique: its roster entry, the chapters naming it, the records whose MUST_LINK names it and the
   articles and countries whose text mentions its words. The roster's technique list (slug, name, group)
   heads the file once. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const CF = require(path.join(__dirname, 'check-fragment.cjs'));
const JOIN = require(path.join(__dirname, 'regions-join.cjs'));
const ROSTER = require(path.join(__dirname, 'roster.cjs'));

const PACK_NAME = path.join('packs', 'brennans-new-orleans.v1.oothouse.json');
const CHAPTER_WORDS = 1500;
const CHAPTERS = 6;
const STOP = new Set(['and', 'the', 'of', 'on', 'in', 'wine', 'wines', 'method', 'label', 'making', 'over']);

function own(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
function clip(s, n) { const w = String(s || '').trim().split(/\s+/); return w.length > n ? w.slice(0, n).join(' ') + ' ...' : String(s || '').trim(); }
function stripHtml(s) { return String(s || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim(); }
function hits(folded, term) { let n = 0, at = 0; const hay = ' ' + folded + ' ', needle = ' ' + term + ' '; while ((at = hay.indexOf(needle, at)) >= 0) { n++; at += needle.length - 1; } return n; }

function loadData(jsDir) {
  const ctx = { window: {}, document: {}, navigator: {}, localStorage: { getItem() { return null; }, setItem() {} }, console: { log() {}, warn() {}, error() {} } };
  ctx.self = ctx; vm.createContext(ctx);
  ['reference.js', 'data-primers.js', 'data-primers-advanced.js', 'data-primers-master.js', 'data-primers-intro.js', 'data-grapes-plus.js', 'data-maps.js', 'data-atlas-v2.js', 'data-intro.js', 'data-producers.js', 'data-regions.js'].forEach((f) => {
    const p = path.join(jsDir, f);
    if (!fs.existsSync(p)) throw new Error('missing ' + p);
    vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f });
  });
  vm.runInContext('this.__R = REGIONS;', ctx);
  return { atlas: ctx.ATLAS_V2, terroir: ctx.TERROIR || [], primers: ctx.PRIMERS || [], adv: ctx.ADV_PRIMERS || [], master: ctx.MASTER_PRIMERS || [], intro: ctx.INTRO_PRIMERS || [], producers: ctx.WINE_PRODUCERS || [], R: ctx.__R };
}

/* The fragments' records: { key: { kind, rec, f, sheet } }. */
function fragmentRecords(dir) {
  const at = {};
  (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /\.json$/.test(f)).sort() : []).forEach((f) => {
    const frag = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    (frag.regions || []).forEach((r) => { if (r && r.slug) at[r.slug] = { kind: 'region', rec: r, f, sheet: frag.sheet }; });
    if (frag.country && frag.country.key) at[frag.country.key] = { kind: 'country', rec: frag.country, f, sheet: frag.sheet };
    (frag.countries || []).forEach((c) => { if (c && c.key) at[c.key] = { kind: 'country', rec: c, f, sheet: null }; });
    (frag.techniques || []).forEach((t) => { if (t && t.slug) at[t.slug] = { kind: 'technique', rec: t, f, sheet: null }; });
  });
  return at;
}

/* The join as it stands once the roster is applied: the index REGIONS with the new articles and countries added,
   their roster aliases taking a key from an old target in the same country, GEORGIA_MOVE given to georgia. */
function rosterJoin(R) {
  const A = { regions: (R.regions || []).map((r) => ({ slug: r.slug, name: r.name, sheet: r.sheet })), countries: {}, join: { aliases: {}, terroir: Object.assign({}, (R.join && R.join.terroir) || {}) } };
  Object.keys(R.countries || {}).forEach((k) => { A.countries[k] = { key: k, name: R.countries[k].name }; });
  Object.keys((R.join && R.join.aliases) || {}).forEach((k) => { A.join.aliases[k] = JOIN.targetList(R.join.aliases[k]); });
  ROSTER.MORE_LIST.forEach((a) => { if (!A.regions.some((r) => r.slug === a.slug)) A.regions.push({ slug: a.slug, name: a.name, sheet: a.sheet }); });
  ROSTER.NEW_MAPLESS.forEach((c) => { if (!A.countries[c.key]) A.countries[c.key] = { key: c.key, name: c.name }; });
  const sheetOf = {};
  A.regions.forEach((r) => { sheetOf[r.slug] = r.sheet; });
  const group = (t) => (own(sheetOf, t) ? JOIN.countryGroup(sheetOf[t]) : JOIN.countryGroup(t));
  const give = (k, t) => {
    const list = (A.join.aliases[k] || []).filter((x) => x !== t && group(x) !== group(t));
    list.push(t);
    A.join.aliases[k] = list;
  };
  /* a roster alias the join's key rules refuse is never written (apply-roster skips it), so it moves nothing here */
  ROSTER.MORE_LIST.forEach((a) => a.aliases.forEach((k) => { if (!CF.aliasKeyProblems(k, a.slug).length) give(k, a.slug); }));
  ROSTER.NEW_MAPLESS.forEach((c) => c.aliases.forEach((k) => { if (!CF.aliasKeyProblems(k, c.key).length) give(k, c.key); }));
  ROSTER.GEORGIA_MOVE.forEach((k) => { if (A.join.aliases[k]) A.join.aliases[k] = A.join.aliases[k].filter((t) => t !== 'eastern-europe'); give(k, 'georgia'); });
  Object.keys(A.join.aliases).forEach((k) => { const l = A.join.aliases[k]; A.join.aliases[k] = l.length === 1 ? l[0] : l; });
  return A;
}

function chapterList(D) {
  const out = [];
  D.primers.forEach((p) => out.push({ level: 'certified', cat: p.cat, text: [p.lead, p.exam].concat((p.facts || []).map((f) => f.join(': ')), p.traps || []).join('\n') }));
  D.adv.forEach((p) => out.push({ level: 'advanced', cat: p.cat, text: [p.lead, p.exam].concat((p.facts || []).map((f) => f.join(': ')), p.traps || []).join('\n') }));
  D.master.forEach((p) => out.push({ level: 'master', cat: p.cat, text: [p.lead, p.exam].concat((p.facts || []).map((f) => f.join(': ')), p.traps || []).join('\n') }));
  D.intro.forEach((p) => out.push({ level: 'intro', cat: p.id, title: p.t, text: stripHtml(p.body) }));
  out.forEach((c) => { c.folded = CF.fold(c.text); c.foldedCat = CF.fold(c.cat + ' ' + (c.title || '')); });
  return out;
}
function chaptersFor(chapters, terms, cats) {
  const scored = chapters.map((c) => {
    let s = 0;
    terms.forEach((t) => { s += hits(c.folded, t); if (hits(c.foldedCat, t)) s += 10; });
    if (cats.indexOf(c.cat) >= 0) s += 20;
    return { c, s };
  }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, CHAPTERS);
  return scored.map((x) => { const o = { level: x.c.level, cat: x.c.cat }; if (x.c.title) o.title = x.c.title; o.score = x.s; o.text = clip(x.c.text, CHAPTER_WORDS); return o; });
}

/* the folded terms a place is searched by: its name, the parts of a name joined by "and", and the roster's aliases */
function placeTerms(name, aliases) {
  const t = new Set();
  const f = CF.fold(name);
  if (f) t.add(f);
  String(name || '').split(/\band\b|,/).forEach((p) => { const x = CF.fold(p); if (x.length >= 4) t.add(x); });
  (aliases || []).forEach((a) => { if (a && a.length >= 4) t.add(a); });
  return Array.from(t);
}
/* the folded terms a technique is searched by */
function techniqueTerms(t) {
  const out = new Set();
  const full = CF.fold(t[1]);
  out.add(full);
  t[1].split(/[():,]|\band\b/).forEach((p) => { const x = CF.fold(p); if (x.length >= 5 && !STOP.has(x)) out.add(x); });
  out.add(CF.fold(t[0].replace(/-/g, ' ')));
  return Array.from(out).filter((x) => x && !STOP.has(x));
}

function scout(input, opts) {
  const problems = [];
  const D = loadData(opts.jsDir);
  const recs = fragmentRecords(opts.fragments);
  const A = rosterJoin(D.R);
  const index = JOIN.joinIndex(A);
  const chapters = chapterList(D);
  let pack = null;
  if (opts.pack && fs.existsSync(opts.pack)) { try { pack = JSON.parse(fs.readFileSync(opts.pack, 'utf8')); } catch (e) { problems.push('the house pack: ' + e.message); } }
  const wines = pack && pack.house && Array.isArray(pack.house.wines) ? pack.house.wines : null;
  const keyOf = (s) => { const h = JOIN.slugFor(s, index); return h ? (h.slug || h.key) : null; };
  const catsOf = {};
  Object.keys((D.R.join && D.R.join.cats) || {}).forEach((c) => (D.R.join.cats[c] || []).forEach((k) => { (catsOf[k] = catsOf[k] || []).push(c); }));
  const families = { T: 'technique', N: 'more', C: 'country', D: 'existing' };
  if (!own(families, input.family)) problems.push('family: T, N, C or D');
  if (!Array.isArray(input.keys) || !input.keys.length) problems.push('keys: a list of record keys');
  const out = {
    chunk: input.chunk || input.id || null, family: input.family, sheet: input.sheet || null, file: input.file || null,
    techniques: ROSTER.TECHNIQUES.map((t) => ({ slug: t[0], name: t[1], group: t[2] })),
    groups: ROSTER.GROUPS.map((g) => ({ key: g[0], name: g[1] })),
    keys: {}
  };
  (input.keys || []).forEach((key) => {
    const tech = ROSTER.TECHNIQUES.find((t) => t[0] === key);
    const more = ROSTER.MORE_LIST.find((a) => a.slug === key);
    const nc = ROSTER.NEW_MAPLESS.find((c) => c.key === key);
    const have = own(recs, key) ? recs[key] : null;
    const kind = tech ? 'technique' : more ? 'region' : nc ? 'country' : have ? have.kind : null;
    if (!kind) { problems.push(key + ': no record, roster article, roster country or technique'); return; }
    const isNew = !have;
    const fam = input.family;
    if ((fam === 'T' && !tech) || (fam === 'N' && !more) || (fam === 'C' && !nc) || (fam === 'D' && (isNew || tech || more || nc))) problems.push(key + ': not a key of family ' + fam);
    if (fam === 'D' && input.file && have && have.f !== input.file) problems.push(key + ': lives in ' + have.f + ', not ' + input.file);
    const keySheet = have ? have.sheet : (more ? more.sheet : null);
    if (input.sheet && !tech && keySheet !== input.sheet) problems.push(key + ': is ' + (keySheet ? 'on the sheet ' + keySheet : 'on no sheet') + ', not ' + input.sheet);
    const e = { key, kind, new: isNew, fragment: have ? have.f : null, record: have ? have.rec : null };
    if (tech) {
      e.roster = { slug: tech[0], name: tech[1], group: tech[2], groupName: (ROSTER.GROUPS.find((g) => g[0] === tech[2]) || [])[1] };
      const terms = techniqueTerms(tech);
      e.terms = terms;
      e.chapters = chaptersFor(chapters, terms, []);
      e.mustLinkedBy = Object.keys(ROSTER.MUST_LINK).filter((k) => ROSTER.MUST_LINK[k].indexOf(key) >= 0);
      const used = [];
      Object.keys(recs).forEach((k) => {
        const x = recs[k];
        if (x.kind === 'technique') return;
        const texts = [];
        CF.walkStrings(x.rec, '', (s, w) => { if (!/\.(questions|cards|sources|say)\[|\.id$|\.slug$/.test(w)) texts.push(s); });
        let n = 0;
        const snippets = [];
        texts.forEach((s) => {
          const fs2 = CF.fold(s);
          terms.forEach((t) => {
            const h = hits(fs2, t);
            if (!h) return;
            n += h;
            if (snippets.length < 2) {
              const sentence = s.split(/(?<=[.!?])\s+/).find((z) => hits(CF.fold(z), t)) || s;
              const c = clip(sentence, 40);
              if (snippets.indexOf(c) < 0) snippets.push(c);
            }
          });
        });
        if (n) used.push({ key: k, kind: x.kind, name: x.rec.name, sheet: x.sheet || null, hits: n, snippets });
      });
      e.mentionedBy = used.sort((a, b) => b.hits - a.hits || (a.key < b.key ? -1 : 1)).slice(0, 40);
      out.keys[key] = e;
      return;
    }
    const name = have ? have.rec.name : (more ? more.name : nc.name);
    const sheet = have ? have.sheet : (more ? more.sheet : null);
    e.name = name;
    if (more) e.roster = { slug: more.slug, name: more.name, sheet: more.sheet, aliases: more.aliases, takes: more.takes || null };
    if (nc) e.roster = { key: nc.key, name: nc.name, aliases: nc.aliases };
    /* the roster's aliases that check-fragment refuses (a key naming a country or a United States sheet): leave them out */
    if (e.roster) e.roster.aliasesRefused = e.roster.aliases.filter((k) => CF.aliasKeyProblems(k, key).length);
    const rosterAliases = (more ? more.aliases : nc ? nc.aliases : []).concat(key === 'georgia' ? ROSTER.GEORGIA_MOVE : []);
    /* the atlas */
    if (sheet && D.atlas.sheets[sheet]) {
      const S = D.atlas.sheets[sheet];
      e.sheet = { key: sheet, title: S.title, intro: S.intro, scope: S.scope, reading: S.reading };
      if (kind === 'region' && have && Number.isInteger(have.rec.index)) {
        const a = S.regions[have.rec.index] || {};
        e.atlas = { sheet, index: have.rec.index, name: a.name, note: a.note || null, studyNotes: a.studyNotes || null, anchors: a.anchors || [] };
      } else if (kind === 'region') e.atlas = { sheet, index: null, mapless: true, note: 'off the map: its own map is to come' };
      const terms = placeTerms(name, rosterAliases);
      e.atlasMentions = S.regions.map((r, i) => ({ index: i, name: r.name, note: r.note, studyNotes: r.studyNotes })).filter((r) => r.name !== name && terms.some((t) => hits(CF.fold(r.note + ' ' + JSON.stringify(r.studyNotes || {})), t)));
    }
    const aliases = Object.keys(A.join.aliases).filter((k) => JOIN.targetList(A.join.aliases[k]).indexOf(key) >= 0).sort();
    e.aliases = aliases;
    e.terroirRows = [];
    D.terroir.forEach((g) => (g.regions || []).forEach((row) => {
      if ((D.R.join && D.R.join.terroir && D.R.join.terroir[row.r] === key) || keyOf(row.r) === key) e.terroirRows.push(Object.assign({ group: g.country }, row));
    }));
    const terms = placeTerms(name, rosterAliases.concat(kind === 'country' ? [] : aliases.filter((k) => k.length >= 6).slice(0, 12)));
    e.terms = terms;
    e.chapters = chaptersFor(chapters, terms, catsOf[key] || []);
    e.houseWines = wines ? wines.filter((w) => w && typeof w.region === 'string' && keyOf(w.region) === key).map((w) => ({ id: w.id, name: w.name, producer: w.producer || null, region: w.region, style: w.style || null })) : null;
    if (!wines) e.houseWinesNote = 'no house pack at ' + opts.pack;
    const groupOfKey = (k) => (index.group[k] || null);
    e.producerIds = D.producers.filter((p) => {
      const at = keyOf(p.r + ', ' + p.country);
      if (at === key) return true;
      /* a country takes every house its country holds (the four US sheets are one country, so a US sheet takes its own) */
      if (kind === 'country' && at && groupOfKey(at) === groupOfKey(key) && (JOIN.US_SHEETS.indexOf(key) < 0 || at === key || A.regions.some((r) => r.slug === at && r.sheet === key))) return true;
      const f = CF.fold(p.r + ' ' + (p.sub || ''));
      return kind === 'region' && terms.some((t) => t.length >= 5 && hits(f, t));
    }).slice(0, 40).map((p) => ({ id: p.id, p: p.p, r: p.r, country: p.country }));
    e.mustLink = ROSTER.MUST_LINK[key] || [];
    e.takes = more && more.takes ? more.takes : null;
    e.givesTo = ROSTER.MORE_LIST.filter((a) => a.takes && own(a.takes, key)).map((a) => ({ slug: a.slug, name: a.name, places: a.takes[key] }));
    if (key === 'georgia' || key === 'eastern-europe') {
      const ee = recs['eastern-europe'];
      e.georgia = {
        move: ROSTER.GEORGIA_MOVE, grapes: ROSTER.GEORGIA_GRAPES,
        easternEuropePlaces: ee ? (ee.rec.places || []).filter((p) => ROSTER.GEORGIA_MOVE.some((k) => hits(CF.fold(p.name + ' ' + p.note), k))) : []
      };
    }
    out.keys[key] = e;
  });
  return { problems, out };
}

module.exports = { scout, rosterJoin, placeTerms, techniqueTerms };

if (require.main === module) {
  const args = process.argv.slice(2);
  if (!args.length || args.indexOf('--help') >= 0 || args.indexOf('-h') >= 0) {
    console.log('usage: node .scripts/regions/scout.cjs <chunk input.json> [jsDir]   (writes scout.json beside the input)');
    process.exit(args.length ? 0 : 2);
  }
  const inputPath = args[0];
  const jsDir = args[1] || path.join(__dirname, '..', '..', 'js');
  let input;
  try { input = JSON.parse(fs.readFileSync(inputPath, 'utf8')); } catch (e) { console.error('scout: ' + inputPath + ': ' + e.message); process.exit(1); }
  const pack = process.env.OOT_SHARED ? path.join(process.env.OOT_SHARED, PACK_NAME) : path.join(__dirname, '..', '..', '..', 'zpullen98-gif.github.io', 'shared', PACK_NAME);
  let r;
  try { r = scout(input, { jsDir, fragments: path.join(__dirname, 'fragments'), pack }); } catch (e) { console.error('scout: ' + e.message); process.exit(1); }
  if (r.problems.length) { r.problems.forEach((p) => console.log('scout: ' + p)); console.log('scout: ' + r.problems.length + ' problem(s), nothing written'); process.exit(1); }
  const outPath = path.join(path.dirname(inputPath), 'scout.json');
  fs.writeFileSync(outPath, JSON.stringify(r.out, null, 1) + '\n');
  const k = Object.keys(r.out.keys);
  console.log('scout: wrote ' + outPath + ' (' + k.length + ' key(s): ' + k.map((x) => x + ' ' + (r.out.keys[x].chapters || []).length + ' chapters' + (r.out.keys[x].houseWines ? ', ' + r.out.keys[x].houseWines.length + ' house wines' : '')).join('; ') + ')');
}
