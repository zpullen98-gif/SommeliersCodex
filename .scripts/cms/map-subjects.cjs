#!/usr/bin/env node
/* map-subjects: proposes each subject's doors into the Codex (BRIEF-CMS.md, map/<id>.json) for a reviewer to confirm.

   Usage: node .scripts/cms/map-subjects.cjs [--write] [--fragments <dir>] [jsDir]

   For every subject fragment present under <fragments>/subjects/ it reads the subject's name, its court line and
   its rows, folds them to tokens (check-fragment's fold: no marks, lower case, letters and digits), and proposes
   every Codex name that shares tokens with them: the question categories (INTRO_GROUPS, DRILL_GROUPS), the chapters
   (INTRO_PRIMERS ids and titles, PRIMERS cats), the regions (REGIONS names and slugs), the countries (names and
   keys), the grapes (GRAPES, GRAPES_PLUS, INTRO_GRAPES, each alternative of a "Pinot Gris / Grigio" name on its
   own), the techniques (roster names and the aka of each) and the service tables (titles and keys). A name is
   proposed when every token of it appears in the subject's words (a token may stand as the prefix of a longer one
   when it has four letters or more, so frost finds frosts), or, for a category, a chapter or a country, when one
   token of four letters or more that is not a generic word (south, valley, wine and the like) appears in the
   subject's NAME or COURT line, so "Beer & Cider" is proposed for Beer and "Italy North" for Piedmont. The
   proposals are candidates: a reviewer confirms every name, and the build refuses an unknown one.

   It writes <fragments>/extracted/map-report.json, a list of { id, proposed, existing, unknown, mappedQuestions },
   where existing is the map/<id>.json already written (or null), unknown the names of that map the Codex does
   not know, and mappedQuestions { intro, certified } the questions of INTRO_QUESTIONS and QUESTIONS whose category
   the map (the existing one, else the proposal) names. It prints one row per subject. With --write it also writes
   map/<id>.json where none exists, carrying the proposal and the notes "proposed by map-subjects.cjs, unchecked";
   a map already written is never touched. Exits 1 when a subject fragment cannot be read. */
'use strict';
const fs = require('fs');
const path = require('path');
const B = require(path.join(__dirname, 'build-cms.cjs'));
const CF = require(path.join(__dirname, '..', 'regions', 'check-fragment.cjs'));

const NOTES = 'proposed by map-subjects.cjs, unchecked';
const STOP = ['the', 'and', 'of', 'de', 'la', 'le', 'du', 'des', 'di', 'in', 'on', 'a', 'an', 'or', 'to', 'with', 'for'];
/* A word too general to propose a category, a chapter or a country on its own. */
const GENERIC = ['south', 'north', 'east', 'west', 'southern', 'northern', 'eastern', 'western', 'central', 'coast', 'valley', 'state', 'states', 'united', 'wine', 'wines', 'world', 'other', 'new', 'grape', 'grapes', 'variety', 'varieties', 'region', 'regions', 'production', 'terms', 'general', 'names', 'name', 'america', 'american'];

function parseArgs(argv) {
  const o = { write: false, fragments: __dirname, jsDir: path.join(B.ROOT, 'js') };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--write') o.write = true;
    else if (a === '--fragments') o.fragments = path.resolve(argv[++i]);
    else if (a === '--help' || a === '-h') { console.log('usage: node .scripts/cms/map-subjects.cjs [--write] [--fragments <dir>] [jsDir]'); process.exit(0); }
    else if (a.charAt(0) === '-') { console.error('map-subjects: unknown option ' + a); process.exit(2); }
    else o.jsDir = path.resolve(a);
  }
  return o;
}
function tokens(s) { return CF.fold(s).split(' ').filter((t) => t && STOP.indexOf(t) < 0); }
/* The alternatives a name offers: "Pinot Gris / Grigio" is pinot gris or grigio; an aside in brackets is dropped. */
function alternatives(name) {
  return String(name || '').replace(/\([^)]*\)/g, ' ').split(/\s*\/\s*/).map(tokens).filter((t) => t.length);
}
function has(set, tok) {
  if (set.has(tok)) return true;
  if (tok.length < 4) return false;
  for (const w of set) { if (w.length >= 4 && (w.startsWith(tok) || tok.startsWith(w)) && Math.min(w.length, tok.length) >= 4) return true; }
  return false;
}
function allIn(alt, set) { return alt.every((t) => has(set, t)); }
function oneStrong(alt, strong) { return alt.some((t) => t.length >= 4 && GENERIC.indexOf(t) < 0 && has(strong, t)); }
/* The candidates per field: [value shipped in the map, the names it answers to]. */
function candidates(names) {
  return {
    'cats.intro': names.introCats.map((c) => [c, [c]]),
    'cats.certified': names.certifiedCats.map((c) => [c, [c]]),
    'chapters.intro': names.introChapters.map((c) => [c.id, [c.t, c.id]]),
    'chapters.certified': names.certifiedChapters.map((c) => [c, [c]]),
    regions: names.regions.map((r) => [r.slug, [r.name, r.slug.replace(/-/g, ' ')]]),
    countries: names.countries.map((c) => [c.key, [c.name, c.key.replace(/-/g, ' ')]]),
    grapes: names.grapes.map((g) => [g, [g]]),
    techniques: names.techniques.map((t) => [t.slug, [t.name].concat(t.aka)]),
    serviceRef: names.serviceRef.map((t) => [t.key, [t.title, t.key]])
  };
}
const BROAD = ['cats.intro', 'cats.certified', 'chapters.intro', 'chapters.certified', 'countries'];
function propose(frag, cands) {
  const strong = new Set(tokens(frag.name + ' ' + frag.court));
  const all = new Set(strong);
  (frag.rows || []).forEach((r) => { tokens([r.topic, r.intro, r.certified].join(' ')).forEach((t) => all.add(t)); });
  const out = { cats: { intro: [], certified: [] }, chapters: { intro: [], certified: [] }, regions: [], countries: [], grapes: [], techniques: [], serviceRef: [] };
  const put = (field, v) => { const list = field.indexOf('.') > 0 ? out[field.split('.')[0]][field.split('.')[1]] : out[field]; if (list.indexOf(v) < 0) list.push(v); };
  Object.keys(cands).forEach((field) => {
    cands[field].forEach((c) => {
      const alts = [].concat.apply([], c[1].map(alternatives));
      if (alts.some((alt) => allIn(alt, all)) || (BROAD.indexOf(field) >= 0 && alts.some((alt) => oneStrong(alt, strong)))) put(field, c[0]);
    });
  });
  return out;
}
function countMapped(bank, cats) { const set = new Set(cats || []); return (bank || []).filter((q) => q && set.has(q.cat)).length; }
function size(m) { return m.cats.intro.length + m.cats.certified.length + m.chapters.intro.length + m.chapters.certified.length + m.regions.length + m.countries.length + m.grapes.length + m.techniques.length + m.serviceRef.length; }

function main() {
  const o = parseArgs(process.argv.slice(2));
  const names = B.loadNames(o.jsDir, { banks: true });
  const sets = B.nameSets(names);
  const cands = candidates(names);
  const subjectsDir = path.join(o.fragments, 'subjects');
  const mapDir = path.join(o.fragments, 'map');
  const files = fs.existsSync(subjectsDir) ? fs.readdirSync(subjectsDir).filter((f) => /\.json$/.test(f)).sort() : [];
  const problems = [];
  const frags = [];
  files.forEach((f) => {
    try { const frag = JSON.parse(fs.readFileSync(path.join(subjectsDir, f), 'utf8')); if (frag && frag.id) frags.push(frag); else problems.push('subjects/' + f + ': no id'); } catch (e) { problems.push('subjects/' + f + ': ' + e.message); }
  });
  frags.sort((a, b) => (B.SUBJECT_BY_ID[a.id] ? B.SUBJECT_BY_ID[a.id].order : 99) - (B.SUBJECT_BY_ID[b.id] ? B.SUBJECT_BY_ID[b.id].order : 99));
  const report = [];
  let written = 0;
  frags.forEach((frag) => {
    const proposed = propose(frag, cands);
    const mf = path.join(mapDir, frag.id + '.json');
    let existing = null;
    const unknown = [];
    if (fs.existsSync(mf)) {
      try { existing = JSON.parse(fs.readFileSync(mf, 'utf8')); } catch (e) { problems.push('map/' + frag.id + '.json: ' + e.message); }
      if (existing) B.mapProblems(existing, 'map', sets).filter((p) => / is no /.test(p)).forEach((p) => unknown.push(p));
    }
    const use = existing && existing.cats ? existing : proposed;
    const mapped = { intro: countMapped(names.banks.INTRO_QUESTIONS, use.cats && use.cats.intro), certified: countMapped(names.banks.QUESTIONS, use.cats && use.cats.certified) };
    report.push({ id: frag.id, proposed, existing, unknown, mappedQuestions: mapped });
    if (o.write && !existing && !fs.existsSync(mf)) {
      fs.mkdirSync(mapDir, { recursive: true });
      const map = { id: frag.id, cats: proposed.cats, chapters: proposed.chapters, regions: proposed.regions, countries: proposed.countries, grapes: proposed.grapes, techniques: proposed.techniques, serviceRef: proposed.serviceRef, notes: NOTES };
      fs.writeFileSync(mf, JSON.stringify(map, null, 2) + '\n');
      written++;
    }
  });
  const outDir = path.join(o.fragments, 'extracted');
  fs.mkdirSync(outDir, { recursive: true });
  const reportFile = path.join(outDir, 'map-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n');
  /* the table */
  const head = ['subject', 'cats i/c', 'chap i/c', 'reg', 'ctry', 'grapes', 'tech', 'svc', 'map', 'unknown', 'q intro/cert'];
  const rows = report.map((r) => {
    const p = r.proposed;
    return [r.id, p.cats.intro.length + '/' + p.cats.certified.length, p.chapters.intro.length + '/' + p.chapters.certified.length, String(p.regions.length), String(p.countries.length), String(p.grapes.length), String(p.techniques.length), String(p.serviceRef.length), r.existing ? 'yes' : 'none', String(r.unknown.length), r.mappedQuestions.intro + '/' + r.mappedQuestions.certified];
  });
  const widths = head.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
  const line = (cells) => cells.map((c, i) => c.padEnd(widths[i])).join('  ');
  console.log(line(head));
  rows.forEach((r) => console.log(line(r)));
  console.log(report.length + ' subject(s) read, ' + report.filter((r) => r.existing).length + ' with a map already, ' + report.reduce((n, r) => n + size(r.proposed), 0) + ' names proposed in all; report at ' + B.rel(reportFile) + (o.write ? '; ' + written + ' map file(s) written (' + NOTES + ')' : ''));
  report.forEach((r) => r.unknown.forEach((u) => console.log('unknown: map/' + r.id + '.json: ' + u)));
  if (problems.length) { problems.forEach((p) => console.error('map-subjects: ' + p)); process.exit(1); }
}
main();
