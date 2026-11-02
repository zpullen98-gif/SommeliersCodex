/* ================== CODEX LV: THE WINE ATLAS TAB AND MORE'S LIBRARY ==================

   The Wine Atlas tab and More's Library, 2 November 2026. Loaded after
   codex54.js, before boot.js. It edits no earlier layer and no data file;
   every wrapper is typeof guarded and outermost, every registry is extended
   key by key, never replaced (V25_NAV alone is reassigned whole, as codex41
   and codex53 reassigned it), and the layer declares with var and function
   only. Every string it shows lives in V55_WORDS (read by v55W); the data's
   own fields (the readings, the maps' notes) are drawn as they are written.
   Its CSS lives in its own v55-style element.

   The owner asked for the Library tab to move into More, for the Wine Atlas
   to come back to the bar, and for every region to carry its maps, its
   knowledge and the districts within it. Nothing is written new: the layer
   assembles what the Codex already holds (codex31's seventeen sheets,
   codex45's 129 field maps, codex39's readings, codex46's techniques,
   codex53's grapes, subjects and the Court's grid reads).

   WHAT THIS LAYER OWNS:

   1. THE WORDS AND THE STYLE: V55_WORDS, v55W, and the v55-style element.

   2. THE BAR reads Home, the house's name, CMS, Grapes, Wine Atlas and the
      quiet More. V25_NAV is reassigned whole; the Wine Atlas word is
      codex47's key, worldmap. The drawn bar keeps codex47's v47nav class
      off (so css/house-atlas-nav.css's two row grid never applies) and the
      due pill rides on More, where Practise lives now. A tap on Wine Atlas
      opens the atlas root (a push from anywhere else; on the root itself,
      back to the top), a tap on More opens More the same way.

   3. THE OWNERS AND THE PARENTS: the six atlas views (worldmap, regions,
      country, region, fieldatlas, fieldmap) are owned by worldmap again;
      every view owned by library (the Library, the bank, Practise, the
      decks, the quizzes, the drills and the runs that lit Library) is owned
      by more, and V25_AREA follows. The atlas root climbs to Home, the
      regions index and the field atlas to the root, the Library to More.
      The lit word answers more wherever it answered library, with one rule
      on the content (codex54's rule for a grape deck): a region's deck, its
      cards and a region drill light Wine Atlas wherever they were opened
      from, and a region's deck climbs to its region.

   4. MORE AND THE LIBRARY: More opens with a group, The Library, whose rows
      open the Library page at its sections (Practise, The question bank,
      The reading rooms); then More's groups as before. The Library page
      keeps its address, climbs to More, and loses its atlas section, its
      jump chip and the atlas doors the earlier layers put in it (the atlas
      is the tab now).

   5. THE WINE ATLAS ROOT: #/v/worldmap with no sheet draws a hub: chips
      (The World Map, Countries, Every region, Field maps, Techniques), the
      seventeen sheets as doors in MAP_GROUPS order, every country as a
      door, then every country with each of its regions beneath, one row a
      region with its district count, opening the region page. A sheet's
      address (#/v/worldmap/{sheet}) still draws codex31's sheet. The hub
      fetches each sheet's reading through codex39's own loader, so the
      counts are whole and the readings are kept for offline use.

   6. THE REGION PAGE (codex39's region view wrapped): the head and the
      lead, then the field map drawn inline by codex45's own renderer (its
      figure, its enlarging viewer, its image failure note), else a door to
      the sheet with the region marked; then The districts, one list joining
      the reading's places (names, notes, sub-places, depth words) and the
      field map's places (kind and note), matched by folded name so a
      district shows once, each mapped place with a button that marks its
      point on the inline map; then the reading as codex39 draws it, its own
      The places folded into The districts; then In the Codex (the
      techniques used there, the Court's subject, the Court's grid reads for
      the region, the grapes' pages, the region's flashcards and drill);
      then codex39's own row of doors. The field map screen keeps its
      address; its Read in depth button opens this page.

   7. THE COUNTRY PAGE (codex39's country view wrapped): its map inline
      (the country's field map where one exists, chosen among several for
      the group of Eastern Europe; else its sheet), then the reading as
      codex39 draws it, its regions drawn as rows with their district
      counts in place of codex39's list.

   8. THE SHELL: index.html loads js/codex55.js after codex54.js and before
      boot.js; the worker is codex-v114 and lists it.
*/

/* =========== 1. the words =========== */

var V55_WORDS = {
  /* the bar */
  tab: 'Wine Atlas',
  /* the root */
  hubH: 'The Wine Atlas',
  hubSub: '{sheets} maps, {countries} countries and {regions} regions',
  hubLine: 'Every region opens on its field map, its districts and everything the Codex holds about it.',
  jumps: 'On this page',
  chipWorld: 'The World Map',
  chipCountries: 'Countries',
  chipRegions: 'Every region',
  chipField: 'Field maps',
  chipTech: 'Techniques',
  findLabel: 'Find a country, a region or a district',
  findHolder: 'For example, Burgundy or Chablis',
  findCount: '{n} of {m} regions',
  findNone: 'Nothing matches yet. Try a country or a region, or clear the search.',
  sheetsH: 'The World Map',
  sheetsLine: 'Seventeen sheets, each a country or a state with its regions numbered on it.',
  sheetOne: '1 numbered region',
  sheetMany: '{n} numbered regions',
  sheetFields: '{line}, {k} field maps',
  sheetField: '{line}, 1 field map',
  countriesH: 'Countries',
  countriesLine: 'Each country carries its map, the law, the label words and its regions.',
  regionsH: 'Every region',
  regionsLine: 'Every country in the order of the maps, with each of its regions and the districts within it.',
  countryRow: '{name}, the country',
  countryRowLine: 'The country, the ladder, the label words and its map',
  maplessH: 'Also asked',
  maplessLine: 'Asked by place, each with a field map of its own',
  maplessRow: 'A field map of {m} places',
  maplessRows: '{k} field maps',
  districtOne: '1 district',
  districtMany: '{n} districts',
  onMap: '{m} on its field map',
  regionNumber: 'Number {n} on the map',
  /* the map on a region or a country page */
  mapH: 'The map',
  fieldDoor: 'The field map and its notes',
  sheetDoor: 'See {name} on the map of {sheet}',
  sheetOpen: 'Open the map and its guide',
  sheetEnlarge: 'Enlarge map',
  sheetAlt: 'The map of {name}, its regions numbered. The regions are listed on this page.',
  chooseMap: 'Choose a map',
  /* the districts */
  districtsH: 'The districts',
  districtsLine: '{n} districts and places from the reading, {m} of them marked on the map.',
  districtsLineOne: '{n} districts and places from the reading, 1 of them marked on the map.',
  districtsWait: 'The places on the map, while the reading opens; its districts join them when it arrives.',
  dotKey: 'A numbered dot marks a town or a settlement; it never draws an appellation boundary or a single vineyard.',
  onMapAt: 'On the map, number {n}: {kind}.',
  pin: 'Show on the map',
  pinNamed: 'Show {name}',
  pinAria: 'Show {name} on the map',
  pinSaid: '{name} is marked on the map, number {n}.',
  pinGone: 'The map artwork is not on this device; the place is number {n} in the list.',
  alsoH: 'Also on the map',
  alsoLine: 'The region’s own marker, the towns and the reference places, for your bearings.',
  kind_study: 'the region’s own marker',
  kind_lesson: 'a town of the reading',
  kind_context: 'a town for your bearings',
  kind_commune: 'a commune',
  kind_town: 'a town',
  kind_reference: 'a reference place',
  kind_other: 'a place',
  /* In the Codex */
  codexH: 'In the Codex',
  techH: 'The techniques',
  subjectH: 'The Court’s subject',
  gridH: 'On the Court’s grid',
  gridDoor: '{grape}, {region}',
  grapesH: 'The grapes',
  studyH: 'Flashcards and drill',
  /* More and the Library */
  libraryG: 'The Library',
  libPractise: 'Practise',
  libPractiseLine: 'The decks, the short rounds and the Court’s curriculum',
  libPractiseDue: '{n} due today, then the decks and the short rounds',
  libBank: 'The question bank',
  libBankLine: 'The {level} bank by category, its mock and the level test',
  libReading: 'The reading rooms',
  libReadingLine: 'The chapters, the producers, the references and the Wine Workshop',
  libLine: 'For {level}: Practise and the question bank first, then the reading rooms.',
  libLineAll: 'For every level: Practise and the question bank first, then the reading rooms.'
};

function v55W(key, vars) {
  var v = vars || {};
  return String(Object.prototype.hasOwnProperty.call(V55_WORDS, key) ? V55_WORDS[key] : key).replace(/\{(\w+)\}/g, function (m, k) {
    return Object.prototype.hasOwnProperty.call(v, k) ? String(v[k]) : m;
  });
}
function v55Esc(s) {
  if (typeof v32Esc === 'function') return v32Esc(s == null ? '' : String(s));
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function v55Str(s) { return typeof s === 'string' ? s.trim() : (typeof s === 'number' ? String(s) : ''); }
function v55List(x) { return Array.isArray(x) ? x : []; }
function v55Own(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
/* codex39's folding (regions-join.cjs's): accents off, lower case, every run of anything but a letter or a digit one space */
function v55Fold(s) {
  if (typeof v39Fold === 'function') return v39Fold(s);
  var t = String(s == null ? '' : s);
  try { t = t.normalize('NFD'); } catch (e) { }
  return t.replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
function v55Num(n) { return String(Number(n) || 0); }

/* =========== the style =========== */

(function () {
  if (typeof document === 'undefined' || !document || typeof document.createElement !== 'function') return;
  var css = document.createElement('style');
  css.id = 'v55-style';
  css.textContent = [
    /* every control on the layer's pages stands at least 44px */
    '.wrap .v55 .btn,.wrap .v55 .v28-chip{min-height:44px;box-sizing:border-box}',
    '.wrap .v55 .btn{white-space:normal;text-align:left;max-width:100%}',
    '.wrap .v55 [tabindex="-1"]:focus{outline:none}',
    '.wrap .v55 [tabindex="-1"]:focus-visible{outline:2px solid var(--gold-hi);outline-offset:3px}',
    '.wrap .v55 .v32-sec{margin-top:28px}'
  ].join('\n');
  try { document.head.appendChild(css); } catch (e) { }
})();

/* =========== 2. the bar =========== */

var V55_ATLAS_VIEWS = ['worldmap', 'regions', 'country', 'region', 'fieldatlas', 'fieldmap'];

V25_NAV = [['home', 'Home'], ['brennans', (typeof v41TabWord === 'function') ? v41TabWord() : 'Brennan’s'], ['cms', 'CMS'], ['grapes', 'Grapes'], ['worldmap', v55W('tab')], ['more', 'More']];

/* The drawn bar, outermost: codex47's class kept off (every selector of its
   stylesheet carries it, so its two row grid never applies), and the due
   pill on More alone, where Practise lives now. */
function v55NavShape(html) {
  var out = String(html || '').split(' v47nav').join('');
  out = out.replace(/ <span class="v32pill">[\s\S]*?<\/span><\/span>/g, '');
  var pill = '';
  try { pill = (typeof v32Pill === 'function') ? v32Pill() : ''; } catch (e) { pill = ''; }
  if (pill) out = out.replace(/(<button[^>]* data-nav="more"[^>]*>[^<]*)<\/button>/, function (m, open) { return open + pill + '</button>'; });
  return out;
}
if (typeof v25NavHtml === 'function') {
  var _v55NavHtml = v25NavHtml;
  v25NavHtml = function () {
    var html = _v55NavHtml.apply(this, arguments);
    try { return v55NavShape(html); } catch (e) { return html; }
  };
}

/* A tap on a word: Wine Atlas opens the atlas root and More opens More (a
   push from anywhere else; on the root itself, back to the top); every
   other word falls through to the layers below. */
function v55OnRoot(word) {
  if (word === 'worldmap') return S.view === 'worldmap' && !S.wmap;
  if (word === 'more') return S.view === 'more' || S.view === 'mine';
  return false;
}
if (typeof v25Nav === 'function') {
  var _v55Nav = v25Nav;
  v25Nav = function (word) {
    if (word !== 'worldmap' && word !== 'more') return _v55Nav.apply(this, arguments);
    if (v55OnRoot(word)) {
      try { window.scrollTo(0, 0); } catch (e) { }
      return;
    }
    if (typeof v25Leave === 'function' && !v25Leave()) return;
    S._v32scopeOpen = false;
    v32Go(word === 'worldmap' ? { view: 'worldmap', arg: '' } : { view: 'more' }, 'push');
  };
}

/* =========== 3. the owners, the parents and the lit word =========== */

(function () {
  var tables = [];
  if (typeof V32_OWNER !== 'undefined' && V32_OWNER) tables.push(V32_OWNER);
  if (typeof V25_UNDER !== 'undefined' && V25_UNDER) tables.push(V25_UNDER);
  if (typeof V25_HUB !== 'undefined' && V25_HUB) tables.push(V25_HUB);
  /* every view the Library owned is More's now, key by key */
  tables.forEach(function (t) {
    Object.keys(t).forEach(function (k) { if (t[k] === 'library') t[k] = 'more'; });
  });
  /* the six atlas views are the Wine Atlas's again */
  V55_ATLAS_VIEWS.forEach(function (k) { tables.forEach(function (t) { t[k] = 'worldmap'; }); });
  if (typeof V25_AREA !== 'undefined' && V25_AREA) {
    Object.keys(V25_AREA).forEach(function (k) { if (V25_AREA[k] === 'library') V25_AREA[k] = 'more'; });
    V25_AREA.worldmap = 'worldmap';
    V25_AREA.regions = 'worldmap';
    V25_AREA.fieldatlas = 'worldmap';
    V25_AREA.v55lib = 'more';
  }
  if (typeof V32_PARENT !== 'undefined' && V32_PARENT) {
    V32_PARENT.worldmap = 'home';
    V32_PARENT.regions = 'worldmap';
    V32_PARENT.fieldatlas = 'worldmap';
    V32_PARENT.library = 'more';
  }
})();

/* A region's deck, its cards and a region drill are the atlas's content, so
   they light Wine Atlas wherever they were opened from (codex54's rule for a
   grape deck); every other screen that lit Library lights More. */
function v55DeckId() {
  var v = S.view;
  if (v === 'deck') return String(S._v32deck || '');
  if (v === 'housedeck' || v === 'flash') { var run = S._v32run; return (run && run.v32) ? String(run.deckId || '') : ''; }
  return '';
}
function v55RegionDeck(id) { return !!id && typeof V39_DECK_RE !== 'undefined' && V39_DECK_RE && V39_DECK_RE.test(String(id)); }
function v55RegionRun() {
  var v = S.view;
  if (v !== 'quiz' && v !== 'results') return false;
  var first = S.pool && S.pool[0];
  var section = (typeof v39W === 'function') ? v39W('drillSection') : 'The regions';
  return String(S.section || '') === section && !!first && typeof v39IsOwnId === 'function' && v39IsOwnId(String(first.id || ''));
}
if (typeof v25NavWord === 'function') {
  var _v55NavWord = v25NavWord;
  v25NavWord = function () {
    try { if (v55RegionDeck(v55DeckId()) || v55RegionRun()) return 'worldmap'; } catch (e) { }
    var word = _v55NavWord.apply(this, arguments);
    return word === 'library' ? 'more' : word;
  };
}

/* Back at depth 0: the atlas root to Home, a sheet and the regions index to
   the root, the Library to More, a region's deck to its region, a sheet's
   deck to its country and the deck of every region to the root. */
if (typeof v32ParentRoute === 'function') {
  var _v55ParentRoute = v32ParentRoute;
  v32ParentRoute = function () {
    try {
      var v = S.view;
      if (v === 'worldmap') return S.wmap ? { view: 'worldmap', arg: '' } : { view: 'home' };
      if (v === 'regions') return { view: 'worldmap', arg: '' };
      if (v === 'library') return { view: 'more' };
      if (v === 'deck') {
        var m = (typeof V39_DECK_RE !== 'undefined' && V39_DECK_RE) ? V39_DECK_RE.exec(String(S._v32deck || '')) : null;
        if (m) {
          if (m[3] && typeof v39Find === 'function' && v39Find(m[3])) return { view: 'region', arg: m[3] };
          if (m[3] && typeof v39Country === 'function' && v39Country(m[3])) return { view: 'country', arg: m[3] };
          if (m[2] && typeof v39SheetCountry === 'function') {
            var c = v39SheetCountry(m[2]);
            if (c && typeof v39CountryKey === 'function') return { view: 'country', arg: v39CountryKey(c) };
          }
          if (m[1] === 'regions') return { view: 'worldmap', arg: '' };
        }
      }
    } catch (e) { }
    return _v55ParentRoute.apply(this, arguments);
  };
}

/* The root's name in the main landmark. */
if (typeof v25MainName === 'function') {
  var _v55MainName = v25MainName;
  v25MainName = function () {
    if (S && S.view === 'worldmap' && !S.wmap) return v55W('hubH');
    return _v55MainName.apply(this, arguments);
  };
}
