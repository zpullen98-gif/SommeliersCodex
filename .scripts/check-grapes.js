#!/usr/bin/env node
/**
 * THE GRAPES TAB, HELD TO ITS DESIGN (codex53, the CMS edition, 29 October 2026)
 *
 * codex53's section 11 joins the Codex's grape records into one book, draws a
 * page per grape, deals a one card deck and a drill per grape, sets a glass on
 * the Court's deductive grid and runs the Village tasting on it. This gate
 * loads the whole chain index.html loads, through codex53, in a node vm with
 * inert registries and a stub DOM (.scripts/cms/chain.cjs) and proves:
 *
 *   1. the join: 59 grapes (the 47 profiles of GRAPES and GRAPES_PLUS, the 53
 *      Régionale records, TASTE on the 47, 12 Régionale alone), every slug
 *      once, every grape white or red, the regions' join attached to most;
 *      the twenty names of the Court's tasting list resolve to twenty
 *      different grapes; a name resolves by part, alias and fold, and a
 *      synonym of another grape never does
 *   2. the grid reads: GRID_READS holds every grape of the tasting list, every
 *      place of every region the list prints named by a read of that grape in
 *      that country (the full cover; check-cms holds each read's shape), every
 *      read's lines the grid's lines of its colour and its options the printed
 *      ones, its sale within two sentences; GRID_SAY says the twenty and only
 *      them; every read slug a grape of the join
 *   3. the pages: the Grapes root at all four levels lists the 59 once each,
 *      the twenty first in the Court's order, with its five chips, the tasting
 *      doors and the grape decks; every grape page draws clean at all four
 *      levels (no undefined, its tags balanced, no dash, never the retired
 *      word, no numbered level, no star) with its profile, fruit, tell,
 *      regions, cards and watch sections, Previous and Next walking the
 *      root's order; a grape the Régionale book alone holds draws too
 *   4. the cards: v32DeckDef('grape:' + slug) is one grape card for every
 *      grape, kind grape, named as the grape, all eight fields written, graded
 *      in the grape cards' slot
 *   5. the drill: the grape drill's pool at Village is not empty for any of
 *      the twenty; Drill this grape deals it through the core engine and
 *      lights Grapes
 *   6. the Court's grid: a perfect sheet is right on every line with the
 *      grape named, a blank one wrong on every line, for every read; one
 *      wrong line costs that line alone; a glass poured blind never names its
 *      grape in the address; a marked glass is kept per device in
 *      oot-codex-courtgrid-v1, never in codexStats
 *   7. the Village tasting on the Court's grid: four glasses, two whites then
 *      two reds, four different grapes, the clock at 1800 seconds; the first
 *      draw stores the end time and a render never resets it; leaving holds
 *      what is left
 *
 * Usage:
 *   node .scripts/check-grapes.js [jsDir] [--partial]
 *
 * jsDir defaults to this repo's js/ and may be the site's wing copy
 * (codex/js). A tree with no codex53.js is SKIPPED. --partial accepts a seed
 * whose grid reads do not yet cover the tasting list: the cover and the run
 * are then noted, not failed.
 *
 * Exits non-zero on any failure. The last line is the verdict.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const CH = require(path.join(__dirname, 'cms', 'chain.cjs'));
const B = require(path.join(__dirname, 'cms', 'build-cms.cjs'));
const CF = require(path.join(__dirname, 'regions', 'check-fragment.cjs'));

const ARGS = process.argv.slice(2);
if (ARGS.indexOf('--help') >= 0 || ARGS.indexOf('-h') >= 0) {
  console.log('usage: node .scripts/check-grapes.js [jsDir] [--partial]');
  process.exit(0);
}
let PARTIAL = false;
const positional = [];
for (const a of ARGS) {
  if (a === '--partial') PARTIAL = true;
  else if (a.charAt(0) === '-') { console.error('check-grapes: unknown option ' + a); process.exit(2); }
  else positional.push(a);
}
const JS = path.resolve(positional[0] || path.join(__dirname, '..', 'js'));
if (!fs.existsSync(path.join(JS, 'codex53.js'))) {
  console.log('check-grapes: no codex53.js in ' + JS + ', SKIPPED');
  process.exit(0);
}

let passed = 0, failed = 0;
function check(what, ok, detail) {
  if (ok) { passed++; console.log('  ok    ' + what); }
  else { failed++; console.log('  FAIL  ' + what + (detail ? '  :: ' + String(detail).slice(0, 700) : '')); }
}
function note(what) { console.log('  note  ' + what); }
function section(name) { console.log(''); console.log('--- ' + name + ' ---'); }
function few(list, n) { return list.slice(0, n || 6).join('; ') + (list.length > (n || 6) ? '; and ' + (list.length - (n || 6)) + ' more' : ''); }
/* a check the seed cannot meet: failed on a full build, noted under --partial */
function cover(what, ok, detail) {
  if (ok || !PARTIAL) check(what, ok, detail);
  else note(what + ' (--partial: not yet) :: ' + String(detail || '').slice(0, 300));
}

let H;
try { H = CH.loadChain(JS, { seed: { codexLevel: 'certified' } }); }
catch (e) { console.log('  FAIL  the chain loads in the sandbox  :: ' + e.message); console.log('check-grapes: 0 passed, 1 failed'); process.exit(1); }
const { G, J, tryG } = H;
const lastErr = () => H.last();
tryG('applyLevel("certified", true)');
console.log('check-grapes: ' + H.files.length + ' scripts from ' + path.join(JS, '..', 'index.html') + ', codex53 at ' + (H.files.indexOf('codex53.js') + 1));

/* ================================================================ */
section('1. the join');
const JOIN = J('(function () { var j = v53GrapeJoin(); return { n: j.list.length, slugs: j.list.map(function (r) { return r.slug; }), names: j.list.map(function (r) { return r.name; }), colours: j.list.map(function (r) { return r.colour; }), g: j.list.filter(function (r) { return r.g; }).length, intro: j.list.filter(function (r) { return r.intro; }).length, taste: j.list.filter(function (r) { return r.taste; }).length, introOnly: j.list.filter(function (r) { return r.intro && !r.g; }).length, targets: j.list.map(function (r) { return (r.targets || []).length; }) }; })()');
check('the join holds 59 grapes', !!JOIN && JOIN.n === 59, JOIN && JOIN.n);
check('the join: the 47 profiles, the 53 Régionale records, TASTE on 47, 12 Régionale alone', !!JOIN && JOIN.g === 47 && JOIN.intro === 53 && JOIN.taste === 47 && JOIN.introOnly === 12, JOIN && [JOIN.g, JOIN.intro, JOIN.taste, JOIN.introOnly].join(' / '));
check('the join: every slug once, every grape white or red', !!JOIN && new Set(JOIN.slugs).size === JOIN.n && JOIN.colours.every((c) => c === 'white' || c === 'red'));
check('the join: the regions\' join attaches places to at least 50 grapes', !!JOIN && JOIN.targets.filter((n) => n > 0).length >= 50, JOIN && JOIN.targets.filter((n) => n > 0).length);
const TW = J('v53TastingList().map(function (t) { return { name: t.name, colour: t.colour, slug: v53GrapeKey(t.name), found: !!v53GrapeFind(v53GrapeKey(t.name)), regions: t.regions }; })') || [];
check('the tasting list is eight whites then twelve reds', TW.length === 20 && TW.slice(0, 8).every((t) => t.colour === 'white') && TW.slice(8).every((t) => t.colour === 'red'), TW.length);
check('the twenty tasting names resolve to grapes of the join', TW.length === 20 && TW.every((t) => t.slug && t.found), JSON.stringify(TW.filter((t) => !t.slug || !t.found).map((t) => t.name)));
check('the twenty resolve to twenty different grapes', new Set(TW.map((t) => t.slug)).size === 20);
const KEYS = J('[v53GrapeKey("Pinot Gris"), v53GrapeKey("Pinot Grigio"), v53GrapeKey("Shiraz"), v53GrapeKey("Garnacha"), v53GrapeKey("Grenache / Garnacha"), v53GrapeKey("Mourvèdre / Monastrell"), v53GrapeKey("Corvina (Valpolicella)"), v53GrapeKey("Muscat"), v53GrapeKey("Auxerrois"), v53GrapeKey("Traminer"), v53GrapeKey("Gewurztraminer"), v53GrapeKey("Carménère")]');
check('a name resolves by part, alias and fold, and a synonym of another grape never does', !!KEYS && KEYS.join('|') === 'pinot-grigio|pinot-grigio|syrah|grenache|grenache|mourvedre|corvina|muscat-blanc|||gewurztraminer|carmenere', KEYS && KEYS.join('|'));
check('an unknown slug finds no grape; a name in a slug form finds its grape', J('[v53GrapeFind("no-such-grape") === null, (v53GrapeFind("pinot-gris") || {}).slug]').join('|') === 'true|pinot-grigio');

/* ================================================================ */
section('2. the grid reads');
const GRID = J('CMS.grid') || null;
const READS = J('v53GridReads()') || {};
const SAY = J('v53GridSay()') || {};
const slugs = Object.keys(READS);
const tastingNames = new Set(TW.map((t) => CF.fold(t.name)));
const shape = [];
slugs.forEach((k) => {
  const r = READS[k];
  if (!r || r.slug !== k) { shape.push(k + ': keyed by ' + k + ', slug ' + JSON.stringify(r && r.slug)); return; }
  B.readsProblems({ slug: r.slug, name: r.name, colour: r.colour, say: SAY[k], reads: r.reads }, k, GRID, tastingNames).forEach((p) => shape.push(p));
});
check('every read\'s lines are the grid\'s lines of its colour, its options the printed ones, its sale within ' + B.MAX_SELL_SENTENCES + ' sentences (' + slugs.length + ' grape(s), ' + slugs.reduce((n, k) => n + ((READS[k] && READS[k].reads) || []).length, 0) + ' reads)', shape.length === 0, few(shape));
check('every read slug is a grape of the join', !!JOIN && slugs.every((s) => JOIN.slugs.indexOf(s) >= 0), slugs.filter((s) => !JOIN || JOIN.slugs.indexOf(s) < 0).join(', '));
const countryOf = (s) => CF.fold(String(s || '').split(/\s+-\s+|;|\//)[0]);
const gaps = [];
TW.forEach((t) => {
  const r = READS[t.slug];
  if (!r || !(r.reads || []).length) { gaps.push(t.name + ': no read'); return; }
  (t.regions || []).forEach((g) => {
    const c = countryOf(g.country);
    (g.places || []).forEach((p) => {
      const fp = CF.fold(p);
      const hit = r.reads.some((rd) => CF.fold(rd.country) === c && CF.fold(rd.region).indexOf(fp) >= 0);
      if (!hit) gaps.push(t.name + ': ' + p + ' (' + g.country + ')');
    });
  });
});
cover('GRID_READS covers the tasting list: every place of every region it prints is named by a read of that grape in that country', gaps.length === 0, few(gaps, 8));
const want = TW.map((t) => t.slug).sort();
cover('GRID_SAY says the twenty and only them', JSON.stringify(Object.keys(SAY).sort()) === JSON.stringify(want) && want.every((k) => typeof SAY[k] === 'string' && SAY[k].trim()), 'has ' + Object.keys(SAY).length + ': ' + Object.keys(SAY).join(', '));
check('GRID_SAY names exactly the read grapes', JSON.stringify(Object.keys(SAY).sort()) === JSON.stringify(slugs.slice().sort()));

/* ================================================================ */
section('3. the pages');
['intro', 'certified', 'advanced', 'master'].forEach((lv) => {
  tryG('applyLevel(' + JSON.stringify(lv) + ', true)');
  const name = tryG('v32Lv().name') || lv;
  const root = tryG('v53GrapesRootHtml()') || '';
  const rootProb = CH.cleanProblem(root) || CH.drawnVoiceProblem(root);
  const rows = (root.match(/data-go="grape" data-arg="([^"]+)"/g) || []).map((m) => m.replace(/.*data-arg="|"$/g, ''));
  check('the Grapes root at ' + name + ' draws clean and lists the 59 once each, the twenty first in the Court\'s order', !rootProb && rows.length === 59 && new Set(rows).size === 59 && TW.every((t, i) => rows[i] === t.slug), rootProb || rows.length + ': ' + rows.slice(0, 21).join(' '));
  check('the Grapes root at ' + name + ' has its five chips, the tasting doors and the grape decks', ['v53-g-whites', 'v53-g-reds', 'v53-g-twenty', 'v53-g-every', 'v53-g-tasting'].every((id) => root.indexOf('data-to="' + id + '"') >= 0 && root.indexOf('id="' + id + '"') >= 0)
    && ['grid', 'flight', 'tastegrid', 'cmsgrid'].every((k) => root.indexOf('data-go="' + k + '"') >= 0) && root.indexOf('data-deck="grapes"') >= 0 && root.indexOf('data-deck="grapes-all"') >= 0);
  const pages = J('v53GrapeOrder().all.map(function (r) { var h = ""; try { h = v53GrapeHtml(r); } catch (e) { h = "THREW " + e.message; } return { slug: r.slug, h: h }; })') || [];
  const bad = pages.map((p) => { const why = CH.cleanProblem(p.h) || CH.drawnVoiceProblem(p.h); return why ? p.slug + ': ' + why : ''; }).filter(Boolean);
  check('every grape page draws clean in the house voice at ' + name + ' (' + pages.length + ')', pages.length === 59 && bad.length === 0, few(bad, 4));
  const lacking = pages.filter((p) => !['v53-gs-profile', 'v53-gs-fruit', 'v53-gs-tell', 'v53-gs-regions', 'v53-gs-cards', 'v53-gs-watch'].every((id) => p.h.indexOf('id="' + id + '"') >= 0)).map((p) => p.slug);
  check('every grape page at ' + name + ' carries its profile, fruit, tell, regions, cards and watch sections', pages.length === 59 && lacking.length === 0, lacking.join(' '));
  const ends = pages.length === 59 && pages[0].h.indexOf('id="v53-g-prev"') < 0 && pages[0].h.indexOf('id="v53-g-next"') >= 0 && pages[58].h.indexOf('id="v53-g-next"') < 0 && pages.slice(1, 58).every((p) => p.h.indexOf('id="v53-g-prev"') >= 0 && p.h.indexOf('id="v53-g-next"') >= 0);
  check('Previous and Next walk the root\'s order at ' + name, ends);
});
tryG('applyLevel("certified", true)');
const ch = tryG('v53GrapeHtml(v53GrapeFind("chardonnay"))') || '';
check('Chardonnay\'s page: its examinable places marked, the region doors, its card, its drill and a search link out that opens a new tab', ch.indexOf('Examinable at Certified') >= 0 && ch.indexOf('data-arg="region:burgundy"') >= 0
  && ch.indexOf('data-deck="grape:chardonnay"') >= 0 && ch.indexOf('data-v53="gdrill"') >= 0 && ch.indexOf('https://www.youtube.com/results?search_query=') >= 0 && ch.indexOf('rel="noopener"') >= 0);
const nReadsCh = ((READS.chardonnay && READS.chardonnay.reads) || []).length;
check('Chardonnay\'s page draws one table of what the grid reads per read (' + nReadsCh + ')', (ch.match(/<table class="v53-reads"/g) || []).length === nReadsCh);
const glera = tryG('v53GrapeHtml(v53GrapeFind("glera"))') || '';
check('a grape the Régionale book alone holds draws its page (Glera) with a one card deck', !CH.cleanProblem(glera) && glera.indexOf('data-deck="grape:glera"') >= 0, CH.cleanProblem(glera));
check('the four grape views are registered with codex53\'s renderers', J('["grapes", "grape", "griddrill", "courttasting"].every(function (k) { return typeof V25_VIEWS[k] === "function" && String(V25_VIEWS[k]).indexOf("v53") >= 0; })') === true);

/* ================================================================ */
section('4. the cards');
const decks = J('v53GrapeJoin().list.map(function (r) { var d = v32DeckDef("grape:" + r.slug); var c = d.cards[0] || {}; var g = c.g || {}; return { slug: r.slug, kind: d.kind, n: d.cards.length, id: c.id, name: r.name, fields: ["g", "c", "st", "fruit", "other", "tell", "regions", "confuse"].every(function (k) { return typeof g[k] === "string" && g[k].length > 0; }) }; })') || [];
const badDecks = decks.filter((d) => !(d.kind === 'grape' && d.n === 1 && d.id === d.name && d.fields)).map((d) => JSON.stringify(d));
check('v32DeckDef(\'grape:\' + slug) is one grape card for every grape (' + decks.length + '), named as the grape, all eight fields written', decks.length === 59 && badDecks.length === 0, few(badDecks, 3));
check('a grape\'s card is graded in the grape cards\' slot, shared with the grape decks', J('(function () { v32GrapeMark("Chardonnay", true); return v32DeckDef("grape:chardonnay").learnt; })()') === 1 && 'oot-codex-grapecards-v1' in H.store);
tryG('S._v32deck = "grape:chardonnay"; S.view = "deck"; S._v53from = null;');
check('a grape\'s deck lights Grapes and climbs to its page', tryG('v25NavWord()') === 'grapes' && JSON.stringify(J('v32ParentRoute()')) === JSON.stringify({ view: 'grape', arg: 'chardonnay' }), tryG('v25NavWord()') + ' ' + JSON.stringify(J('v32ParentRoute()')));
tryG('S.view = "home";');

/* ================================================================ */
section('5. the drill');
const pools = J('v53TastingList().map(function (t) { var s = v53GrapeKey(t.name); return { s: s, n: v53GrapeQuestions(s, "certified").length }; })') || [];
check('the grape drill\'s pool at Village is not empty for any of the twenty', pools.length === 20 && pools.every((p) => p.n > 0), pools.filter((p) => !p.n).map((p) => p.s).join(', ') || pools.length);
const nCh = (pools.find((p) => p.s === 'chardonnay') || {}).n;
const started = tryG('var __v53render = render; render = function () {}; v53StartGrapeDrill("chardonnay")');
const run = J('{ mode: S.mode, section: S.section, drill: S._v53drill, n: S.pool.length, view: S.view, word: v25NavWord() }');
check('Drill this grape deals its pool through the core engine and lights Grapes', started === true && !!run && run.mode === 'drill' && run.section === 'Grape: Chardonnay' && run.drill === 'grape:chardonnay' && run.n === nCh && run.view === 'quiz' && run.word === 'grapes', JSON.stringify(run) + ' ' + lastErr());
tryG('render = __v53render; S.mode = null; S.pool = []; S.view = "home"; S._v53drill = null;');

/* ================================================================ */
section('6. the Court\'s grid');
const GR = J('(function () { var out = []; Object.keys(v53GridReads()).forEach(function (s) { var e = v53GridReads()[s]; v53ReadsOf(s).forEach(function (rd, i) {'
  + ' var col = e.colour === "red" ? "red" : "white"; var p = v53GridGrade(rd, v53GridPerfect(rd, col, s), col, s); var b = v53GridGrade(rd, {}, col, s);'
  + ' out.push({ s: s, i: i, pr: p.right, pt: p.total, pg: p.grapeOk, pall: p.lines.every(function (l) { return l.ok; }), br: b.right, bt: b.total, bnone: b.lines.every(function (l) { return !l.ok; }), same: p.lines.map(function (l) { return l.key; }).join() === b.lines.map(function (l) { return l.key; }).join() }); }); }); return out; })()') || [];
check('a perfect sheet is right on every line with the grape named, for every read (' + GR.length + ')', GR.length > 0 && GR.every((g) => g.pall && g.pr === g.pt && g.pg), few(GR.filter((g) => !(g.pall && g.pr === g.pt && g.pg)).map((g) => JSON.stringify(g)), 2));
check('a blank sheet is wrong on every line, marked on the same lines, for every read', GR.length > 0 && GR.every((g) => g.bnone && g.br === 0 && g.bt === g.pt && g.same), few(GR.filter((g) => !(g.bnone && g.br === 0 && g.same)).map((g) => JSON.stringify(g)), 2));
if (nReadsCh) {
  const one = J('(function () { var rd = v53ReadsOf("chardonnay")[0]; var a = v53GridPerfect(rd, "white", "chardonnay"); a["non-flowers"] = (rd.nonFruit || []).indexOf("flowers") >= 0 ? "No" : "Yes"; var m = v53GridGrade(rd, a, "white", "chardonnay"); return { right: m.right, total: m.total, wrong: m.lines.filter(function (l) { return !l.ok; }).map(function (l) { return l.key; }) }; })()');
  check('one wrong line costs that line alone', !!one && one.right === one.total - 1 && one.wrong.join() === 'non-flowers', JSON.stringify(one));
}
const fake = (o) => '{ getAttribute: function (k) { return (' + JSON.stringify(o) + ')[k] || ""; } }';
if (slugs.length) {
  tryG('S._v53gridGrape = ""; S._v53grid = null; S.view = "griddrill";');
  const poured = tryG('v53GrapeAct("gpour", ' + fake({ 'data-grape': '', 'data-colour': '' }) + ')');
  check('a glass poured blind deals a read grape with six choices or fewer of its colour, its grape among them, and names no grape in the address', poured === true
    && J('(function () { var g = S._v53grid; var j = v53GrapeJoin(); return !!g && !g.named && g.choices.indexOf(g.grape) >= 0 && g.choices.length <= 6 && g.choices.every(function (s) { return j.bySlug[s] && j.bySlug[s].colour === g.colour; }); })()') === true
    && tryG('v32Arg("griddrill")') === '', JSON.stringify(J('S._v53grid && { grape: S._v53grid.grape, named: S._v53grid.named, choices: S._v53grid.choices }')) + ' ' + lastErr());
  const sheet = tryG('v53GridDrillHtml()') || '';
  check('the sheet draws clean in the house voice', !CH.cleanProblem(sheet) && !CH.drawnVoiceProblem(sheet) && sheet.indexOf('data-v53="gmark"') >= 0, CH.cleanProblem(sheet) || CH.drawnVoiceProblem(sheet));
  tryG('(function () { var g = S._v53grid; var a = v53GridPerfect(v53GlassRead(g), g.colour, g.grape); delete a.sellMark; Object.keys(a).forEach(function (k) { g.answers[k] = a[k]; }); })()');
  const slug = tryG('S._v53grid.grape');
  const statsBefore = H.store.codexStats || '';
  const marked = tryG('v53GrapeAct("gmark", ' + fake({}) + ')') === true && tryG('v53GrapeAct("gself", ' + fake({ 'data-ok': '1' }) + ')') === true;
  check('Mark the sheet and the self mark of the sale make the sheet right on every line', marked && J('S._v53grid.marked.right === S._v53grid.marked.total') === true, lastErr());
  const rec = J('v53CourtGridRec()[' + JSON.stringify(slug) + ']');
  check('the glass is kept per device in oot-codex-courtgrid-v1: one glass, named right, every line once', !!rec && rec.n === 1 && rec.c === 1 && 'oot-codex-courtgrid-v1' in H.store && Object.keys(rec.lines || {}).length === J('S._v53grid.marked.total'), JSON.stringify(rec));
  check('the record never enters codexStats', (H.store.codexStats || '') === statsBefore && !String(H.store.codexStats || '').includes('courtgrid'));
  tryG('S._v53gridGrape = ""; S._v53grid = null; S.view = "home";');
} else check('the grid drill has a read to pour', false, 'GRID_READS is empty');

/* ================================================================ */
section('7. the Village tasting on the Court\'s grid');
tryG('S._v53tg = null; S.view = "courttasting";');
const tstart = tryG('v53CourtTastingHtml()') || '';
check('the run\'s start screen draws clean in the house voice', !CH.cleanProblem(tstart) && !CH.drawnVoiceProblem(tstart), CH.cleanProblem(tstart) || CH.drawnVoiceProblem(tstart));
const canRun = J('v53PourList("white").length >= 2 && v53PourList("red").length >= 2') === true;
tryG('S.view = "grapes";');
const ok = tryG('v53TastingStart()');
if (canRun) {
  const tg = J('(function () { var t = S._v53tg; return { n: t.deck.length, colours: t.deck.map(function (g) { return g.colour; }), clock: t.clock, idx: t.idx, view: S.view, distinct: new Set(t.deck.map(function (g) { return g.grape; })).size, own: t.deck.every(function (g) { return g.choices.indexOf(g.grape) >= 0; }) }; })()');
  check('the run deals four glasses, two whites then two reds, four different grapes, at 1800 seconds', ok === true && !!tg && tg.n === 4 && tg.colours.join() === 'white,white,red,red' && tg.distinct === 4 && tg.own && tg.clock === 1800 && tg.view === 'courttasting' && tg.idx === 0, JSON.stringify(tg));
  const g1 = tryG('v53CourtTastingHtml()') || '';
  const end1 = tryG('S._v53tg.clockEnd');
  check('the first draw stores the end time, the clock reads 30:00 and the glass is Glass 1 of 4, white', typeof end1 === 'number' && g1.indexOf('30:00 left') >= 0 && g1.indexOf('Glass 1 of 4') >= 0 && !CH.cleanProblem(g1), (g1.match(/v53-clock[^<]*/) || [''])[0]);
  tryG('v53CourtTastingHtml()');
  check('a render never resets the clock', tryG('S._v53tg.clockEnd') === end1);
  tryG('S.view = "grapes"; render();');
  check('leaving the run holds what is left and drops the end time', tryG('S._v53tg.clockEnd') === null && tryG('S._v53tg.clock') === 1800);
  tryG('v53ClockStop()');
} else {
  cover('the reads hold two whites and two reds, so the run can deal its four glasses', false, 'v53TastingStart() returned ' + ok + ' and the start screen says the reads are not on the device');
}

/* ================================================================ */
section('the gate itself');
const me = fs.readFileSync(__filename, 'utf8');
check('this gate carries no dash and no glyph at or above U+2190', B.dashProblems(me, 'check-grapes.js').length === 0 && B.dashProblems(me.replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16))), 'check-grapes.js').length === 0);

console.log('');
console.log('--- summary ---');
console.log('  join       ' + (JOIN ? JOIN.n : 0) + ' grapes, the twenty ' + (TW.length === 20 && TW.every((t) => t.found) ? 'resolved' : 'not all resolved'));
console.log('  reads      ' + slugs.length + ' grape(s), ' + GR.length + ' read(s)');
console.log('  pools      ' + pools.map((p) => p.s + ' ' + p.n).join(', '));
console.log('');
console.log('check-grapes: ' + passed + ' passed, ' + failed + ' failed' + (PARTIAL ? ' (--partial)' : ''));
process.exit(failed ? 1 : 0);
