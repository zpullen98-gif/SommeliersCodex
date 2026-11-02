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
