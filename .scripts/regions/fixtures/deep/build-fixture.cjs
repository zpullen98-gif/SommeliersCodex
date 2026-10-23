#!/usr/bin/env node
/* build-fixture: the atlas in depth proved end to end on the fixtures beside this file (23 October 2026).

   Usage: node .scripts/regions/fixtures/deep/build-fixture.cjs [--out <dir>] [jsDir]
   For example, with the house pack beside it and the scratch build kept out of the Codex:
     OOT_SHARED=<site>/shared node .scripts/regions/fixtures/deep/build-fixture.cjs --out <scratchpad>/atlas-fixture
   It builds with build-regions.cjs --partial --fragments <out>/fragments --out <out>/js/data-regions.js, so the index
   and the reading files land in <out>/js and <out>/js/regions; --out inside the Codex's js/ is refused.

   The fixtures, each a fragment the writers' contract (BRIEF-DEEP.md, schema.json, roster.cjs) accepts:
     oregon.json         the real fragments/oregon.json with Willamette Valley deepened: a deeper list over four
                         sections, two tagged cards and two tagged questions appended, two sources marked primary,
                         a techniques list; its country's regionsOrder left as the first edition had it
     oregon.more.json    the roster's one article off the map for oregon, Southern Oregon, deepened
     mapless.3.json      the roster's new country Georgia, deepened, holding the GEORGIA_MOVE keys
     techniques.1.json   two roster techniques, traditional-method and carbonic-maceration
     videos/*.json       video evidence, SYNTHETIC (ids FIXTURE...), never real and never in .scripts/regions/videos:
                         a film whose channel no result shows (channelKind unknown, the owner's rule of 23 October
                         2026), a listed company's channel shown by one result, a video of the house pack, and a
                         search verdict

   What it does, writing only under --out (default <tmp>/codex-atlas-fixture; never the Codex's js/):
     1. check-fragment on every fixture where it lies;
     2. copies them, and the real fragments/mapless.2.json (eastern-europe, for the Georgia split), to <out>/fragments;
     3. apply-roster: --dry, then for real, then again (it must move nothing the second time); the moves it must make
        are asserted (the Southern Oregon keys off oregon.json, GEORGIA_MOVE off mapless.2.json, the regionsOrder);
     4. apply-videos from videos/ with --date 2026-10-23, twice (the second run writes nothing);
     5. check-fragment on every copied fragment, the videos now in place;
     6. build-regions --partial into <out>/js, and asserts the build: REGIONS.techniques in roster order with usedBy,
        the technique ids minted over 'technique:' + slug, the article off the map after the mapped one with
        mapless: 1 and no index, the regionsOrder, the reading files, the videos, and the join through the resolver;
     7. the same build with oregon.more.json named oregon.more.1.json, which must give the same bytes;
     8. the mutation cases: every rule the pipeline adds, broken once, must be refused by name (and a URL that holds
        a retired word must not be).
   Prints ok or FAIL per step and exits 1 on any failure. Run it with OOT_SHARED set (the house pack for the pack
   video and the resolver), or the site checkout beside this repo is used. */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const cp = require('child_process');

const HERE = __dirname;
const REG = path.join(HERE, '..', '..');
const REPO = path.join(REG, '..', '..');
const CF = require(path.join(REG, 'check-fragment.cjs'));
const B = require(path.join(REG, 'build-regions.cjs'));
const JOIN = require(path.join(REG, 'regions-join.cjs'));
const AV = require(path.join(REG, 'apply-videos.cjs'));
const ROSTER = require(path.join(REG, 'roster.cjs'));

const args = process.argv.slice(2);
if (args.indexOf('--help') >= 0 || args.indexOf('-h') >= 0) { console.log('usage: node .scripts/regions/fixtures/deep/build-fixture.cjs [--out <dir>] [jsDir]'); process.exit(0); }
const oi = args.indexOf('--out');
const OUT = path.resolve(oi >= 0 ? args[oi + 1] : path.join(os.tmpdir(), 'codex-atlas-fixture'));
const rest = args.filter((a, i) => a !== '--out' && !(oi >= 0 && i === oi + 1));
const JS = path.resolve(rest[0] || path.join(REPO, 'js'));
if ((OUT + path.sep).indexOf(path.resolve(REPO, 'js') + path.sep) === 0 || OUT === path.resolve(REPO)) { console.error('build-fixture: --out must lie outside the Codex (never its js/)'); process.exit(2); }
const PACK = process.env.OOT_SHARED ? path.join(process.env.OOT_SHARED, 'packs', 'brennans-new-orleans.v1.oothouse.json') : path.join(REPO, '..', 'zpullen98-gif.github.io', 'shared', 'packs', 'brennans-new-orleans.v1.oothouse.json');
const FIXTURES = ['oregon.json', 'oregon.more.json', 'mapless.3.json', 'techniques.1.json'];

let passed = 0, failed = 0;
function check(what, ok, detail) {
  if (ok) { passed++; console.log('  ok    ' + what); }
  else { failed++; console.log('  FAIL  ' + what + (detail ? '  :: ' + detail : '')); }
}
function section(s) { console.log('\n--- ' + s + ' ---'); }
function readJson(f) { return JSON.parse(fs.readFileSync(f, 'utf8')); }
function clone(o) { return JSON.parse(JSON.stringify(o)); }
function node(script, argv) {
  const r = cp.spawnSync(process.execPath, [script].concat(argv), { encoding: 'utf8', env: process.env });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
}
function fresh(dir) { fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true }); }

const codex = CF.loadCodex(JS);

/* ---------------------------------------------------------------- */
section('1. check-fragment on the fixtures where they lie');
FIXTURES.forEach((f) => {
  const p = CF.checkFragment(readJson(path.join(HERE, f)), path.join(HERE, f), codex);
  check(f + ' passes check-fragment', p.length === 0, p.slice(0, 6).join('; '));
});

/* ---------------------------------------------------------------- */
section('2. the scratch copy');
fs.mkdirSync(OUT, { recursive: true });
const FR = path.join(OUT, 'fragments');
const OJS = path.join(OUT, 'js');
fresh(FR); fresh(OJS);
FIXTURES.forEach((f) => fs.copyFileSync(path.join(HERE, f), path.join(FR, f)));
fs.copyFileSync(path.join(REG, 'fragments', 'mapless.2.json'), path.join(FR, 'mapless.2.json'));
check('copied ' + (FIXTURES.length + 1) + ' fragments to ' + FR, fs.readdirSync(FR).length === FIXTURES.length + 1);

/* ---------------------------------------------------------------- */
section('3. apply-roster');
const AR = path.join(REG, 'apply-roster.cjs');
const before = fs.readdirSync(FR).map((f) => fs.readFileSync(path.join(FR, f), 'utf8')).join('');
const dry = node(AR, ['--dry', '--fragments', FR, JS]);
check('--dry exits 0 and writes nothing', dry.code === 0 && fs.readdirSync(FR).map((f) => fs.readFileSync(path.join(FR, f), 'utf8')).join('') === before, dry.out.split('\n').slice(-3).join(' / '));
const wantMoves = ['southern oregon', 'umpqua valley', 'umpqua', 'rogue valley', 'applegate valley', 'red hill douglas county'].map((k) => 'move   aliases["' + k + '"]: oregon.json (oregon) -> oregon.more.json (southern-oregon)');
check('--dry moves the Southern Oregon keys off oregon.json (' + wantMoves.length + ')', wantMoves.every((m) => dry.out.indexOf(m) >= 0), wantMoves.filter((m) => dry.out.indexOf(m) < 0).join('; '));
const gm = ROSTER.GEORGIA_MOVE.filter((k) => dry.out.indexOf('move   aliases["' + k + '"]: mapless.2.json (eastern-europe) -> mapless.3.json (georgia)') < 0);
check('--dry moves all ' + ROSTER.GEORGIA_MOVE.length + ' GEORGIA_MOVE keys off mapless.2.json, the Georgia split', gm.length === 0, 'not moved: ' + gm.join(', '));
check('--dry sets oregon\'s regionsOrder to the map slug, then the article off the map', dry.out.indexOf('order  oregon.json: country.regionsOrder willamette-valley -> willamette-valley, southern-oregon') >= 0);
check('--dry skips the roster alias the join refuses ("elkton oregon")', /skip   the roster's alias "elkton oregon" for southern-oregon/.test(dry.out));
check('--dry leaves "elkton oregon" with oregon (its new owner never claimed it)', dry.out.indexOf('aliases["elkton oregon"]: oregon.json') < 0);
const live = node(AR, ['--fragments', FR, JS]);
check('apply-roster writes oregon.json and mapless.2.json, nothing else', live.code === 0 && /wrote (mapless\.2\.json, oregon\.json|oregon\.json, mapless\.2\.json)$/m.test(live.out.trim()), live.out.split('\n').slice(-1)[0]);
const again = node(AR, ['--fragments', FR, JS]);
check('a second run moves nothing (idempotent)', again.code === 0 && /nothing to move/.test(again.out), again.out.split('\n').slice(-1)[0]);
const m2 = readJson(path.join(FR, 'mapless.2.json'));
check('mapless.2.json keeps no GEORGIA_MOVE key', ROSTER.GEORGIA_MOVE.every((k) => !Object.prototype.hasOwnProperty.call(m2.aliases, k)));
check('mapless.2.json keeps its other keys (croatia, slovenia, moldova)', ['croatia', 'slovenia', 'moldova'].every((k) => m2.aliases[k] === 'eastern-europe'));

/* ---------------------------------------------------------------- */
section('4. apply-videos');
const AVS = path.join(REG, 'apply-videos.cjs');
const v1 = node(AVS, ['--fragments', FR, '--videos', path.join(HERE, 'videos'), '--pack', PACK, '--date', '2026-10-23']);
check('apply-videos writes the evidence (2 by two searches, 1 from the pack, 1 search link)', v1.code === 0 && /\(2 passed by two searches, 1 from the pack, 1 search links\)/.test(v1.out), v1.out.split('\n').slice(-2).join(' / '));
const v2 = node(AVS, ['--fragments', FR, '--videos', path.join(HERE, 'videos'), '--pack', PACK, '--date', '2026-10-23']);
check('a second run writes nothing (idempotent)', v2.code === 0 && /nothing to write/.test(v2.out), v2.out.split('\n').slice(-1)[0]);

/* ---------------------------------------------------------------- */
section('5. check-fragment on the scratch copy');
fs.readdirSync(FR).sort().forEach((f) => {
  const p = CF.checkFragment(readJson(path.join(FR, f)), path.join(FR, f), codex);
  check(f + ' passes check-fragment after apply-roster and apply-videos', p.length === 0, p.slice(0, 6).join('; '));
});

/* ---------------------------------------------------------------- */
section('6. the build');
const BR = path.join(REG, 'build-regions.cjs');
const OUTFILE = path.join(OJS, 'data-regions.js');
const b1 = node(BR, ['--partial', '--fragments', FR, '--out', OUTFILE, JS]);
check('build-regions --partial builds the scratch copy', b1.code === 0, b1.out.split('\n').filter((l) => /build-regions:/.test(l)).slice(0, 4).join(' / '));
let R = null;
try { const ctx = {}; vm.createContext(ctx); vm.runInContext(fs.readFileSync(OUTFILE, 'utf8') + '\nthis.R = REGIONS;', ctx); R = ctx.R; } catch (e) { check('the index loads', false, e.message); }
if (R) {
  const part = (p) => readJson(path.join(OJS, 'regions', p + '.json')).records;
  check('the header names the articles off the map and the techniques', fs.readFileSync(OUTFILE, 'utf8').indexOf(B.HEADER_DEEP) > 0);
  check('version 2', R.version === 2);
  check('REGIONS.techniques holds the two, in roster order', Array.isArray(R.techniques) && R.techniques.map((t) => t.slug).join() === 'traditional-method,carbonic-maceration');
  check('a technique index entry holds exactly INDEX_TECHNIQUE', R.techniques.every((t) => Object.keys(t).sort().join() === B.INDEX_TECHNIQUE.slice().sort().join()), R.techniques.map((t) => Object.keys(t).sort().join(' ')).join(' | '));
  const tm = R.techniques[0];
  check('usedBy of traditional-method is the sorted lists that name it (georgia, willamette-valley)', JSON.stringify(tm.usedBy) === JSON.stringify(['georgia', 'willamette-valley']), JSON.stringify(tm.usedBy));
  check('usedBy of carbonic-maceration is empty (no record names it here)', JSON.stringify(R.techniques[1].usedBy) === '[]', JSON.stringify(R.techniques[1].usedBy));
  const srcT = readJson(path.join(HERE, 'techniques.1.json')).techniques;
  const idOk = R.techniques.every((t) => t.questions.every((q) => { const s = srcT.find((x) => x.slug === t.slug).questions.find((x) => x.q === q.q); return s && (s.id || B.mintId(B.techniqueOwner(t.slug), q.q)) === q.id; }));
  check('every technique question id is minted over [\'technique:\' + slug, stem]', idOk);
  const deal = R.techniques.every((t) => { const c = [0, 0, 0, 0]; t.questions.forEach((q) => { if (q.sa !== 1) c[q.a]++; }); return Math.max.apply(null, c) - Math.min.apply(null, c) <= 1; });
  check('every technique\'s keyed positions are dealt evenly (owner technique:<slug>)', deal);
  const tr = part('techniques');
  check('js/regions/techniques.json holds the reading (how, steps, why, law, where, deeper, sources, related)', ['how', 'steps', 'why', 'law', 'where', 'deeper', 'sources', 'related'].every((k) => tr['traditional-method'] && tr['traditional-method'][k] !== undefined));
  check('REGIONS.parts names mapless, oregon and techniques', Object.keys(R.parts).sort().join() === 'mapless,oregon,techniques', Object.keys(R.parts).join());
  check('REGIONS.regions runs the map\'s article, then the article off the map', R.regions.map((r) => r.slug).join() === 'willamette-valley,southern-oregon', R.regions.map((r) => r.slug).join());
  const so = R.regions[1];
  check('the article off the map keeps its sheet, mapless: 1 and no index', so.sheet === 'oregon' && so.mapless === 1 && so.index === undefined);
  check('oregon\'s regionsOrder is willamette-valley, southern-oregon', R.countries.oregon.regionsOrder.join() === 'willamette-valley,southern-oregon');
  const or = part('oregon');
  const sv = or['southern-oregon'].videos;
  check('Southern Oregon\'s film ships with channelKind unknown and no channel', Array.isArray(sv) && sv.length === 1 && sv[0].channelKind === 'unknown' && sv[0].channel === undefined && sv[0].verifiedBy === 'websearch' && sv[0].checkedOn === '2026-10-23', JSON.stringify(sv));
  const wv = or['willamette-valley'].videos;
  check('Willamette Valley\'s film ships its listed company channel', Array.isArray(wv) && wv[0].channelKind === 'company' && wv[0].channel === 'Willamette Valley Wineries Association', JSON.stringify(wv));
  const tv = tr['traditional-method'].videos;
  check('traditional-method\'s film is the house pack\'s, verifiedBy pack', Array.isArray(tv) && tv[0].id === 'um10vnGXxw4' && tv[0].verifiedBy === 'pack' && tv[0].url === CF.VIDEO_URL + 'um10vnGXxw4', JSON.stringify(tv));
  const ge = part('mapless').georgia;
  check('Georgia gains watchSearch and no video (a search verdict)', ge && ge.watchSearch === 'Georgian qvevri wine Kakheti explained' && ge.videos === undefined);
  const index = JOIN.joinIndex(R);
  const res = (s) => { const h = JOIN.slugFor(s, index); return h ? (h.slug || h.key) : null; };
  [['Rogue Valley, Oregon', 'southern-oregon'], ['Umpqua Valley, Southern Oregon, USA', 'southern-oregon'], ['Willamette Valley, Oregon', 'willamette-valley'], ['Dundee Hills, Willamette Valley, Oregon', 'willamette-valley'],
    ['Kakheti, Georgia', 'georgia'], ['Tsinandali', 'georgia'], ['Georgia', 'georgia'], ['Croatia', 'eastern-europe'], ['Slovenia', 'eastern-europe']].forEach((p) => check('the join: "' + p[0] + '" resolves to ' + p[1] + ' (the mapless article keeps its sheet, so countryGroup needs no change)', res(p[0]) === p[1], res(p[0])));
  /* the roster's article name holds its state's name, so a bare state string is captured by containment (a finding
     for the owner: check-regions fails on it; printed here, not asserted either way) */
  const bare = B.bareCountryMisses(R);
  console.log('  known ' + (bare.length ? 'a bare country string goes astray: ' + bare.join('; ') : 'every bare country string resolves to its country'));
}

/* ---------------------------------------------------------------- */
section('7. <sheet>.more.<n>.json');
const FR2 = path.join(OUT, 'fragments-more-n');
const OJS2 = path.join(OUT, 'js-more-n');
fresh(FR2); fresh(OJS2);
fs.readdirSync(FR).forEach((f) => fs.copyFileSync(path.join(FR, f), path.join(FR2, f === 'oregon.more.json' ? 'oregon.more.1.json' : f)));
const b2 = node(BR, ['--partial', '--fragments', FR2, '--out', path.join(OJS2, 'data-regions.js'), JS]);
const same = b2.code === 0 && fs.readFileSync(path.join(OJS2, 'data-regions.js'), 'utf8') === fs.readFileSync(OUTFILE, 'utf8')
  && fs.readdirSync(path.join(OJS, 'regions')).every((f) => fs.readFileSync(path.join(OJS2, 'regions', f), 'utf8') === fs.readFileSync(path.join(OJS, 'regions', f), 'utf8'));
check('the build with oregon.more.1.json gives the same bytes', same, b2.out.split('\n').slice(-1)[0]);

/* ---------------------------------------------------------------- */
section('8. the mutation cases');
const F = {};
FIXTURES.forEach((f) => { F[f] = readJson(path.join(FR, f)); });
/* one mutation: mutate a clone of fixture f, check it as file name, expect a problem holding want (or none when want is null) */
function refuse(label, f, mutate, want, name) {
  const frag = clone(F[f]);
  mutate(frag);
  const p = CF.checkFragment(frag, name || f, codex);
  if (want === null) check(label + ' (no problem)', p.length === 0, p.slice(0, 3).join('; '));
  else check(label, p.some((x) => x.indexOf(want) >= 0), p.length ? p.slice(0, 3).join('; ') : 'no problem found');
}
/* the retired word for study, built here so this file never writes it whole */
const RETIRED = 'prac' + 'tice';
const so0 = (fr) => fr.regions[0];
refuse('an article off the map carries no index', 'oregon.more.json', (fr) => { so0(fr).index = 0; }, '.index: none for an article off the map');
refuse('an article off the map is named as the roster names it', 'oregon.more.json', (fr) => { so0(fr).name = 'South Oregon'; }, 'must be "Southern Oregon" (the roster)');
refuse('an article off the map carries mapless: 1', 'oregon.more.json', (fr) => { delete so0(fr).mapless; }, '.mapless: 1');
refuse('an article off the map is written deepened', 'oregon.more.json', (fr) => { delete so0(fr).deeper; }, '.deeper: an article off the map is written deepened');
refuse('a .more fragment carries no country', 'oregon.more.json', (fr) => { fr.country = clone(F['oregon.json'].country); }, 'a .more fragment carries no country');
refuse('a .more fragment holds only the roster\'s articles of its sheet', 'oregon.more.json', (fr) => { so0(fr).slug = 'rogue-valley'; }, 'is no roster article off the map for oregon');
refuse('a sheet article never says mapless', 'oregon.json', (fr) => { so0(fr).mapless = 1; }, 'only an article of <sheet>.more.json is off the map');
refuse('a deeper text holding a digit cites two sources or a primary one', 'oregon.more.json', (fr) => { const s = so0(fr); s.sources.forEach((x) => delete x.primary); const d = s.deeper.find((x) => /\d/.test(x.text)) || s.deeper[0]; if (!/\d/.test(d.text)) d.text += ' It was approved in 2004.'; d.src = [2]; }, 'cites two sources, or one marked primary: 1');
refuse('a deeper list holds an advanced and a master entry', 'oregon.json', (fr) => { so0(fr).deeper.forEach((d) => { d.depth = 'advanced'; }); }, 'at least one advanced and one master entry');
refuse('a deeper list spans three sections', 'oregon.json', (fr) => { so0(fr).deeper.forEach((d) => { d.sec = d.sec === 'land' ? 'land' : 'law'; }); }, 'at least three sections');
refuse('a deeper section is one of the article\'s', 'oregon.json', (fr) => { so0(fr).deeper[0].sec = 'overview'; }, '.sec: one of land, grapes, made, law, places, producers, exam');
refuse('a deeper head is at most eight words', 'oregon.json', (fr) => { so0(fr).deeper[0].head = 'one two three four five six seven eight nine'; }, '.head: at most 8 words');
refuse('a deeper text is 30 to 220 words', 'oregon.json', (fr) => { so0(fr).deeper[0].text = 'Too short a paragraph to teach anything at all.'; }, '.text: 30 to 220 words');
refuse('a deeper src names one of the record\'s sources', 'oregon.json', (fr) => { so0(fr).deeper[0].src = [9]; }, 'is no index of the record\'s');
refuse('a deeper entry carries no other field', 'oregon.json', (fr) => { so0(fr).deeper[0].level = 'master'; }, '.level: no such field');
refuse('a deepened article holds at least 8 cards', 'oregon.json', (fr) => { so0(fr).cards = so0(fr).cards.slice(0, 7); }, 'at least 8 cards');
refuse('a deepened article tags at least 2 cards', 'oregon.json', (fr) => { so0(fr).cards.forEach((c) => delete c.depth); }, 'at least 2 cards tagged');
refuse('a deepened article tags at least 2 questions', 'oregon.json', (fr) => { so0(fr).questions.forEach((q) => delete q.depth); }, 'at least 2 questions tagged');
refuse('a deepened article keeps 5 untagged questions', 'oregon.json', (fr) => { so0(fr).questions.slice(0, 6).forEach((q) => { q.depth = 'master'; }); }, 'at least 5 untagged questions');
refuse('a deepened article cites at least 2 sources', 'oregon.more.json', (fr) => { const s = so0(fr); s.sources = s.sources.slice(0, 1); s.deeper.forEach((d) => { d.src = [0]; }); }, 'at least 2 sources');
refuse('a card depth is advanced or master', 'oregon.json', (fr) => { so0(fr).cards[0].depth = 'premier'; }, '.depth: advanced or master');
refuse('a deepened article\'s Certified prose is 800 to 1,800 words (untagged places count, tagged ones do not)', 'oregon.json', (fr) => { const s = so0(fr); const cut = (x, n) => x.split(' ').slice(0, n).join(' '); s.places.forEach((p) => { if (!p.depth) p.depth = 'master'; }); s.made.viticulture = cut(s.made.viticulture, 60); s.made.winemaking = cut(s.made.winemaking, 60); ['climate', 'soils', 'topography'].forEach((k) => { s.terroir[k] = cut(s.terroir[k], 20); }); s.wines = s.wines.slice(0, 1); }, 'the Certified prose is 800 to 1,800 words');
refuse('the whole record is at most 3,600 words', 'oregon.json', (fr) => { const s = so0(fr); const t = s.deeper[0].text.split(' ').slice(0, 30).join(' ') + ' '; s.deeper = s.deeper.concat(Array.from({ length: 10 }, (_, i) => ({ sec: 'exam', depth: 'master', text: (t + t + t + t + t + t + t).trim() + ' ' + i, src: [0, 4] }))); }, 'the whole record is at most 3,600 words');
refuse('a first edition article keeps one prose total of 800 to 1,800', 'oregon.json', (fr) => { const s = so0(fr); delete s.deeper; s.cards.forEach((c) => delete c.depth); s.questions.forEach((q) => delete q.depth); s.summary = s.summary.split(' ').slice(0, 60).join(' '); s.places = s.places.slice(0, 1); s.terroir.climate = s.terroir.climate.split(' ').slice(0, 20).join(' '); s.terroir.soils = s.terroir.soils.split(' ').slice(0, 20).join(' '); s.terroir.topography = s.terroir.topography.split(' ').slice(0, 20).join(' '); s.wines = s.wines.slice(0, 1); }, 'the article prose is 800 to 1,800 words');
refuse('terroir fields are 15 to 160 words', 'oregon.json', (fr) => { so0(fr).terroir.soils = (so0(fr).terroir.soils + ' ').repeat(3).trim(); }, '.terroir.soils: 15 to 160 words');
refuse('exam lines are 3 to 10', 'oregon.json', (fr) => { const s = so0(fr); s.exam = s.exam.concat(s.exam, s.exam).slice(0, 11); }, '.exam: 3 to 10 lines');
refuse('a deepened record links its MUST_LINK (georgia: amphora-qvevri)', 'mapless.3.json', (fr) => { fr.countries[0].techniques = fr.countries[0].techniques.filter((t) => t !== 'amphora-qvevri'); }, 'MUST_LINK for georgia');
refuse('a record links roster technique slugs only', 'oregon.json', (fr) => { so0(fr).techniques.push('sparkling'); }, 'is no roster technique slug');
refuse('a record links a technique once', 'oregon.json', (fr) => { so0(fr).techniques.push('oak'); }, 'oak twice');
refuse('an article links at most 8 techniques', 'oregon.json', (fr) => { so0(fr).techniques = ROSTER.TECHNIQUE_SLUGS.slice(0, 9); }, 'at most 8 techniques');
refuse('a new map-less country is written deepened', 'mapless.3.json', (fr) => { delete fr.countries[0].deeper; }, 'a new map-less country is written deepened');
refuse('a new map-less country takes the roster\'s name', 'mapless.3.json', (fr) => { fr.countries[0].name = 'Sakartvelo'; }, 'must be "Georgia" (the roster)');
refuse('a country deeper section is one of the country\'s', 'mapless.3.json', (fr) => { fr.countries[0].deeper[0].sec = 'land'; }, '.sec: one of overview, grapes, law, places, exam');
refuse('a technique is named as the roster names it', 'techniques.1.json', (fr) => { fr.techniques[0].name = 'Methode champenoise'; }, 'must be "Traditional method" (the roster)');
refuse('a technique keeps the roster\'s group', 'techniques.1.json', (fr) => { fr.techniques[0].group = 'winery'; }, '.group: must be sparkling');
refuse('a technique is never related to itself', 'techniques.1.json', (fr) => { fr.techniques[0].related.push('traditional-method'); }, 'never related to itself');
refuse('a technique never carries usedBy', 'techniques.1.json', (fr) => { fr.techniques[0].usedBy = []; }, 'the build computes usedBy');
refuse('a technique question\'s cat is its name', 'techniques.1.json', (fr) => { fr.techniques[0].questions[0].cat = 'Sparkling'; }, '.cat: must be "Traditional method"');
refuse('a technique cites at least 2 sources', 'techniques.1.json', (fr) => { const t = fr.techniques[0]; t.sources = t.sources.slice(0, 1); t.deeper.forEach((d) => { d.src = [0]; }); }, 'at least 2 sources');
refuse('a technique holds 8 to 12 cards', 'techniques.1.json', (fr) => { fr.techniques[0].cards = fr.techniques[0].cards.slice(0, 7); }, '8 to 12 cards');
refuse('a technique tags at least 2 questions', 'techniques.1.json', (fr) => { fr.techniques[0].questions.forEach((q) => delete q.depth); }, 'at least 2 questions tagged');
refuse('a technique holds 3 to 10 steps', 'techniques.1.json', (fr) => { fr.techniques[0].steps = fr.techniques[0].steps.slice(0, 2); }, '.steps: at least 3 entries');
refuse('a technique\'s law is a string', 'techniques.1.json', (fr) => { delete fr.techniques[0].law; }, '.law: must be a string');
refuse('a technique\'s cats are real chapters', 'techniques.1.json', (fr) => { fr.techniques[0].cats = ['Bubbles']; }, 'is not a PRIMERS cat or an INTRO_PRIMERS id');
refuse('a technique\'s prose is at most 2,600 words', 'techniques.1.json', (fr) => { const t = fr.techniques[0]; const x = t.deeper[0].text.split(' ').slice(0, 30).join(' ') + ' '; t.deeper = t.deeper.concat(Array.from({ length: 10 }, (_, i) => ({ sec: 'exam', depth: 'master', text: (x + x + x + x + x + x + x).trim() + ' ' + i, src: [1] }))); }, 'the technique prose is at most 2,600 words');
refuse('a techniques fragment holds techniques only', 'techniques.1.json', (fr) => { fr.aliases = {}; }, 'a techniques fragment holds techniques only');
const vid = (extra) => Object.assign({ url: CF.VIDEO_URL + 'FIXTUREso01', id: 'FIXTUREso01', label: 'The valleys of Southern Oregon', channelKind: 'unknown', watchFor: 'How the valleys run warmer and drier than the Willamette Valley', verifiedBy: 'websearch', checkedOn: '2026-10-23' }, extra || {});
refuse('a video whose channel no result showed passes as channelKind unknown with no channel (the owner\'s rule of 23 October 2026)', 'oregon.more.json', (fr) => { so0(fr).videos = [vid()]; }, null);
refuse('a video whose channel the searches could not confirm ships no channel', 'oregon.more.json', (fr) => { so0(fr).videos = [vid({ channel: 'Somebody' })]; }, 'ships with our label only');
refuse('a person\'s video ships no channel', 'oregon.more.json', (fr) => { so0(fr).videos = [vid({ channelKind: 'person', channel: 'A Teacher' })]; }, 'ships with our label only');
refuse('a company channel is one of companies.json', 'oregon.more.json', (fr) => { so0(fr).videos = [vid({ channelKind: 'company', channel: 'Rogue Valley Vintners' })]; }, 'named exactly as companies.json names it');
refuse('a video url is exactly the watch address of its id', 'oregon.more.json', (fr) => { so0(fr).videos = [vid({ url: 'https://youtu.be/FIXTUREso01' })]; }, '.url: exactly https://www.youtube.com/watch?v=FIXTUREso01');
refuse('a video id is eleven characters', 'oregon.more.json', (fr) => { so0(fr).videos = [vid({ id: 'short', url: CF.VIDEO_URL + 'short' })]; }, 'an eleven character YouTube id');
refuse('a record holds at most 2 videos', 'oregon.more.json', (fr) => { so0(fr).videos = [vid(), vid({ id: 'FIXTUREso02', url: CF.VIDEO_URL + 'FIXTUREso02' }), vid({ id: 'FIXTUREso03', url: CF.VIDEO_URL + 'FIXTUREso03' })]; }, 'at most 2 videos');
refuse('a video carries a checkedOn date', 'oregon.more.json', (fr) => { so0(fr).videos = [vid({ checkedOn: '2026-02-30' })]; }, '.checkedOn: a date, YYYY-MM-DD');
refuse('watchSearch is 3 to 8 words', 'oregon.more.json', (fr) => { so0(fr).watchSearch = 'Oregon'; }, '.watchSearch: 3 to 8 words');
refuse('a source url is https only', 'oregon.json', (fr) => { so0(fr).sources[0].url = 'http://www.willamettewines.com/'; }, '.url: https only');
refuse('a source url holds no whitespace', 'oregon.json', (fr) => { so0(fr).sources[0].url = 'https://www.example.org/a page'; }, 'a URL holds no whitespace');
/* the URL exemption spares spelling only: a dash, glyph or entity, or a glyph at or above U+2190, is refused in a URL as
   anywhere (23 October 2026, the adversarial verification; the entity is built here so this file never writes it whole) */
refuse('a source url holds no em dash', 'oregon.json', (fr) => { so0(fr).sources[0].url = 'https://www.example.org/a\u2014b'; }, '.url: a dash (em or en)');
refuse('a source url holds no dash entity', 'oregon.json', (fr) => { so0(fr).sources[0].url = 'https://www.example.org/a&' + 'mdash;b'; }, '.url: a dash entity');
refuse('a video url holds no glyph at or above U+2190', 'oregon.more.json', (fr) => { so0(fr).videos = [vid({ url: CF.VIDEO_URL + 'FIXTUREso01\u2192' })]; }, '.url: a glyph at or above U+2190');
refuse('a slug is a string', 'oregon.json', (fr) => { so0(fr).slug = 5; }, '.slug: a string');
refuse('a source url keeps the publisher\'s spelling: a retired word or an American spelling in it is no voice problem', 'oregon.json', (fr) => { so0(fr).sources[0].url = 'https://www.example.org/best-' + RETIRED + '/aging--flavor'; }, null);
refuse('the same word in a source title is a voice problem', 'oregon.json', (fr) => { so0(fr).sources[0].title = 'Vineyard best ' + RETIRED; }, 'the retired word');
refuse('primary is 1 or omitted', 'oregon.json', (fr) => { so0(fr).sources[0].primary = true; }, '.primary: 1');
refuse('an alias to an article never names a United States sheet', 'oregon.more.json', (fr) => { fr.aliases['elkton oregon'] = 'southern-oregon'; }, 'may not name a country or a United States sheet');
refuse('an alias to an article never names a country', 'oregon.more.json', (fr) => { fr.aliases['rogue valley usa united states'] = 'southern-oregon'; }, 'may not name a country');
refuse('an article carries no unknown field (a misspelt deeper)', 'oregon.json', (fr) => { so0(fr).deep = so0(fr).deeper; delete so0(fr).deeper; }, '.deep: no field of an article');
refuse('a country carries no unknown field', 'mapless.3.json', (fr) => { fr.countries[0].technique = []; }, '.technique: no field of a country');
refuse('oregon.more.1.json may hold a .more fragment', 'oregon.more.json', () => {}, null, 'oregon.more.1.json');
refuse('a sheet fragment is never named <sheet>.more.json', 'oregon.json', () => {}, 'a .more file holds', 'oregon.more.json');
refuse('a .more fragment is never named <sheet>.json', 'oregon.more.json', () => {}, 'never more: true', 'oregon.json');
const sn = CF.superlativeNotes({ regions: [{ summary: 'An iconic and legendary hill, the best known in the valley, world-class.', sources: [{ url: 'https://example.org/best' }] }] });
check('superlatives are notes, never problems (and never in a URL)', sn.length === 1 && /iconic/.test(sn[0]) && /legendary/.test(sn[0]) && /best/.test(sn[0]) && /world-class/.test(sn[0]), JSON.stringify(sn));

/* the evidence: apply-videos' readEvidence on mutated copies */
let pack = null;
try { pack = AV.packIds(PACK); } catch (e) { pack = null; }
check('the house pack is read for the pack rule (' + PACK + ')', !!pack && pack.size > 0);
const E = {};
fs.readdirSync(path.join(HERE, 'videos')).forEach((f) => { E[f.replace(/\.json$/, '')] = readJson(path.join(HERE, 'videos', f)); });
const target = (key) => {
  if (key === 'southern-oregon') return { kind: 'region', rec: F['oregon.more.json'].regions[0], f: 'oregon.more.json' };
  if (key === 'willamette-valley') return { kind: 'region', rec: F['oregon.json'].regions[0], f: 'oregon.json' };
  if (key === 'traditional-method') return { kind: 'technique', rec: F['techniques.1.json'].techniques[0], f: 'techniques.1.json' };
  return { kind: 'country', rec: F['mapless.3.json'].countries[0], f: 'mapless.3.json' };
};
function evidence(label, key, mutate, want) {
  const ev = clone(E[key]);
  mutate(ev);
  const r = AV.readEvidence(ev, path.join(HERE, 'videos', key + '.json'), target(key), { date: '2026-10-23' }, pack);
  if (typeof want === 'function') check(label, r.problems.length === 0 && want(r.write), r.problems.slice(0, 3).join('; ') || JSON.stringify(r.write));
  else check(label, r.problems.some((x) => x.indexOf(want) >= 0), r.problems.length ? r.problems.slice(0, 3).join('; ') : 'no problem found');
}
const fin = (ev) => ev.searches.find((s) => s.by === 'finder');
const chk = (ev) => ev.searches.find((s) => s.by === 'checker');
evidence('evidence as written: unknown passes and ships no channel', 'southern-oregon', () => {}, (w) => w.videos[0].channelKind === 'unknown' && w.videos[0].channel === undefined);
evidence('unknown ships no channel even when the evidence names one', 'southern-oregon', (ev) => { ev.video.channel = 'Somebody'; }, (w) => w.videos[0].channel === undefined);
evidence('the finder and the checker search with different queries', 'southern-oregon', (ev) => { chk(ev).query = fin(ev).query; }, 'the two-search rule fails');
evidence('the checker never searches the id', 'southern-oregon', (ev) => { chk(ev).query = 'FIXTUREso01 Southern Oregon'; }, 'holds the id');
evidence('the checker never searches the id in another case (a search engine reads none)', 'southern-oregon', (ev) => { chk(ev).query = '"' + ev.video.title + '" fixtureso01'; }, 'holds the id');
evidence('both searches return the identical title', 'southern-oregon', (ev) => { chk(ev).results[0].title = 'Fixture film: the valleys of southern Oregon'; }, 'the two-search rule fails');
evidence('both searches return the same id', 'southern-oregon', (ev) => { chk(ev).results[0].url = 'https://www.youtube.com/watch?v=FIXTUREso02'; }, 'the two-search rule fails');
evidence('a finder search and a checker search are both there', 'southern-oregon', (ev) => { ev.searches = [fin(ev)]; }, 'a finder search and a checker search');
evidence('a channel results show is the same in both searches, whatever the kind', 'southern-oregon', (ev) => { fin(ev).results[0].channel = 'Channel A'; chk(ev).results[0].channel = 'Channel B'; }, 'channels for FIXTUREso01');
evidence('unknown with one channel shown consistently still ships no channel', 'southern-oregon', (ev) => { fin(ev).results[0].channel = 'Channel A'; }, (w) => w.videos[0].channel === undefined);
evidence('a Short is never a video', 'southern-oregon', (ev) => { ev.video.url = 'https://www.youtube.com/shorts/FIXTUREso01'; }, 'never a Short or a playlist');
evidence('the evidence names the record as the fragments do', 'southern-oregon', (ev) => { ev.name = 'South Oregon'; }, 'name must be "Southern Oregon"');
evidence('the evidence kind is the record\'s', 'southern-oregon', (ev) => { ev.kind = 'country'; }, 'kind must be region');
evidence('evidence as written: a listed company shown by one result ships its channel', 'willamette-valley', () => {}, (w) => w.videos[0].channel === 'Willamette Valley Wineries Association');
evidence('a company channel is shown by at least one result', 'willamette-valley', (ev) => { fin(ev).results[0].channel = null; }, 'no result shows "Willamette Valley Wineries Association"');
evidence('a company channel never disagrees with a result', 'willamette-valley', (ev) => { chk(ev).results[0].channel = 'Oregon Wine Board'; }, 'channels for FIXTUREwv01');
evidence('a company channel is one of companies.json', 'willamette-valley', (ev) => { ev.video.channel = 'Rogue Valley Vintners'; fin(ev).results[0].channel = 'Rogue Valley Vintners'; }, 'named exactly as companies.json names it');
evidence('a person shown by a result passes and ships no channel', 'willamette-valley', (ev) => { ev.video.channelKind = 'person'; ev.video.channel = 'A Teacher'; fin(ev).results[0].channel = 'A Teacher'; }, (w) => w.videos[0].channelKind === 'person' && w.videos[0].channel === undefined);
evidence('a person\'s channel is shown by at least one result', 'willamette-valley', (ev) => { ev.video.channelKind = 'person'; ev.video.channel = 'A Teacher'; }, 'no result shows "A Teacher"');
evidence('a company kind names its channel (a channel no result shows is the kind unknown)', 'willamette-valley', (ev) => { delete ev.video.channel; }, 'video.channel: the channel as the results print it');
evidence('the " - YouTube" a search appends to a result\'s title is set aside on both sides', 'southern-oregon', (ev) => { ev.searches.forEach((s) => s.results.forEach((r) => { r.title += ' - YouTube'; })); }, (w) => w.videos[0].id === 'FIXTUREso01' && w.videos[0].channelKind === 'unknown');
evidence('with the suffix set aside, the titles must still be identical', 'southern-oregon', (ev) => { fin(ev).results[0].title += ' - YouTube'; chk(ev).results[0].title = ev.video.title + '! - YouTube'; }, 'the two-search rule fails');
evidence('a result of another id never stands in for the candidate', 'southern-oregon', (ev) => { chk(ev).results = [{ url: 'https://www.youtube.com/watch?v=FIXTUREso09', title: ev.video.title }]; }, 'the two-search rule fails');
evidence('evidence as written: the pack video passes with no searches', 'traditional-method', () => {}, (w) => w.videos[0].verifiedBy === 'pack' && w.videos[0].channel === 'GuildSomm International');
evidence('verifiedBy pack names a video of the house pack', 'traditional-method', (ev) => { ev.video.id = 'FIXTUREtm01'; ev.video.url = CF.VIDEO_URL + 'FIXTUREtm01'; }, 'is no video of the house pack');
evidence('a pack video\'s company channel is the pack\'s', 'traditional-method', (ev) => { ev.video.channel = 'Wine Folly'; }, 'the house pack names "GuildSomm International"');
evidence('evidence as written: a search verdict writes watchSearch and takes videos off', 'georgia', () => {}, (w) => w.videos === null && w.watchSearch === 'Georgian qvevri wine Kakheti explained');
evidence('watchSearch is 3 to 8 words', 'georgia', (ev) => { ev.watchSearch = 'Georgia'; }, 'watchSearch: 3 to 8 words');

console.log('\nbuild-fixture: ' + passed + ' passed, ' + failed + ' failed (scratch at ' + OUT + ')');
process.exit(failed ? 1 : 0);
