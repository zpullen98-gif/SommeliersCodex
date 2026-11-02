/* ================== CODEX LIV: THE FIVE-STAR CARD AND THE FLOW ==================

   The five-star card and the flow edition, 31 October 2026, rebuilt 2
   November 2026. Loaded after codex53.js, before boot.js. It edits no
   earlier layer and no data file; every wrapper is typeof guarded and
   outermost, every registry is extended key by key, never replaced, and the
   layer declares with var and function only.

   WHAT THIS LAYER OWNS:

   1. THE WORDS: V54_WORDS holds every string the layer shows, British and
      dash free; v54W reads them. The pack's own fields (the lines, the
      sale, the house's notes) are drawn as the house wrote them.

   2. THE STYLE: one style element, id v54-style, written by the layer.

   3. THE CARD (section 3): a wine's card as one flow, by a last string
      wrapper of v28CardHtml. The title row carries the position and one
      Next, the bin and the size on one line under the name. Then At the
      table (the forty-five large in the house reading face, The sale under
      a gold rule directly under it when the pack holds one, the ten and the
      twenty quiet, Say it); Where we pour it (first pick for, second choice
      for, by the bottle with the tier's word and its sayIt, on the
      tastings, the drink without alcohol; every list read from the dishes'
      own pairings); The wine; In the Codex (one door per destination: the
      grape page by v53GrapeKey, the region or country, one map, the
      producer, the chapter, the Court's subject by v54SubjectFor, the
      Court's grid by v54GridFor, the illustrated guide and the culinary
      lesson where mapped; Compare with as a sub list; The land closed);
      Who makes it without its library link; What it's made of without its
      per component films; Pronounced: for every respelling; The five parts
      closed; On the floor with The guide's line; the service note; Watch,
      each film once; Practise this wine as one row; the footer Edit,
      Previous, Next. Her own rows (a wine she added, with no house record)
      keep the card the earlier layers draw.

   4. THE DOORS: the new doors are codex28 acts (data-v28) listed in
      V28_DOORS, so a door pushes the card's own entry first and codex38
      keeps its open sections; Back reopens the card as it was left.

   5. THE FLASH CARD BACK: v28CardOf carries the sale, and the two faces
      that draw a house card's back (codex28's deck and codex32's runs) set
      it under the ten.

   6. THE DOM PASS: a cellarView wrapper registered after codex33's and
      codex37's. The culinary doors and the illustrated guides those two
      append to a card are taken off it (In the Codex carries both as
      doors), codex52's atlas box is hidden on the card only, and the open
      sections of the card are remembered for its next draw.
*/

/* =========== 1. the words =========== */

var V54_WORDS = {
  atTable: 'At the table',
  fortyFive: 'In forty-five seconds',
  sale: 'The sale',
  ten: 'In ten seconds',
  twenty: 'In twenty seconds',
  say: 'Say it',
  where: 'Where we pour it',
  firstFor: 'First pick for',
  secondFor: 'Second choice for',
  byBottle: 'By the bottle',
  tastings: 'On the tastings',
  zeroHead: 'Without alcohol',
  zeroWith: '{drink}, without alcohol with the {dish}',
  course: 'course {n}',
  withDishes: 'with {dishes}',
  orWord: ' or ',
  wine: 'The wine',
  producer: 'Producer',
  wineName: 'Wine',
  vintage: 'Vintage',
  region: 'Region',
  grapes: 'Grapes',
  style: 'Style',
  byGlass: 'By the glass',
  onTastings: 'Poured on the tastings',
  bottle: 'Bottle',
  profile: 'The profile',
  served: 'How we pour it',
  goesWith: 'What it goes with',
  about: 'About it',
  codex: 'In the Codex',
  grapeDoor: 'The grape: {name}',
  mapDoor: 'The map: {sheet}',
  mapOverview: 'The map: {sheet}, a regional overview',
  producerDoor: 'The producer: {name}',
  chapterDoor: 'The chapter: {cat}',
  subjectDoor: 'The Court’s subject: {name}',
  gridDoor: 'On the Court’s grid: {grape}, {region}',
  illusDoor: 'Illustrated guide: {title}',
  culinaryDoor: 'Culinary lesson: {title}',
  compare: 'Compare with',
  land: 'The land',
  landGrapes: 'The grapes',
  landRegion: 'The region',
  structure: 'Structure',
  tell: 'The tell',
  confuse: 'Not to be confused with',
  climate: 'Climate',
  soil: 'Soil',
  note: 'Note',
  terroir: 'Open the Terroir Atlas',
  pronounced: 'Pronounced',
  parts: 'The five parts',
  floor: 'On the floor',
  guide: 'The guide’s line',
  houseWords: 'The house’s words',
  scenes: 'Guests at the table',
  serviceNote: 'The service note',
  watch: 'Watch',
  practise: 'Practise this wine',
  flashThis: 'Flash this wine',
  sayPour: 'Say the pour',
  guestPlay: 'Guest at the table',
  itsProducers: 'Its producers',
  itsComponents: 'Its components',
  itsGrapeCards: 'Its grape cards',
  itsGrapeCardsOf: 'Its grape cards: {grape}',
  drillSection: 'Drill this section',
  drillList: 'Drill the list',
  next: 'Next',
  sections: 'The card’s sections'
};

function v54W(key, vars) {
  var s = V54_WORDS[key] || '';
  if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(String(vars[k])); });
  return s;
}

function v54Esc(s) {
  if (typeof v28Esc === 'function') return v28Esc(s);
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function v54Str(s) { return typeof s === 'string' ? s.trim() : (typeof s === 'number' ? String(s) : ''); }
function v54List(x) { return Array.isArray(x) ? x : []; }
function v54Own(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
function v54KV(item, field) { return (typeof v28KV === 'function') ? v28KV(item, field) : null; }
function v54Fold(s) {
  if (typeof v53cFold === 'function') return v53cFold(s);
  return (typeof v28Fold === 'function') ? v28Fold(s).trim() : String(s == null ? '' : s).toLowerCase().trim();
}
function v54House() { try { return (typeof v28House === 'function') ? v28House() : null; } catch (e) { return null; } }

/* =========== 2. the style =========== */

(function () {
  if (typeof document === 'undefined' || !document || typeof document.createElement !== 'function') return;
  var css = document.createElement('style');
  css.id = 'v54-style';
  css.textContent = [
    /* the title row: the position and one Next; the bin and the size on one line */
    '.wrap .v28 .v54-binline{display:flex;flex-wrap:nowrap;align-items:center;gap:0 12px;white-space:nowrap;margin:0 0 8px}',
    /* At the table: the forty-five large in the house reading face, the sale under a gold rule, the ten and the twenty quiet */
    '.wrap .v28 .v54-table .v28-eyebrow{margin-top:14px}',
    '.wrap .v28 .v54-table .v28-timed.v54-fortyfive{display:block;font-family:var(--house-reading);font-size:20px;line-height:1.5;font-weight:600;color:var(--parch);margin:4px 0 0}',
    '.wrap .v28 .v54-rule{height:0;border:0;border-top:1px solid var(--gold);margin:16px 0 0}',
    '.wrap .v28 .v54-table .v54-sale-h{margin-top:10px;color:var(--gold)}',
    '.wrap .v28 .v54-sale{font-size:18px;line-height:1.5;color:var(--parch);margin:2px 0 4px}',
    '.wrap .v28 .v54-table .v54-ten,.wrap .v28 .v54-table .v28-timed.v54-twenty{display:block;font-family:inherit;font-size:16px;line-height:1.5;font-weight:400;color:var(--parch2);margin:2px 0 0}',
    '.wrap .v28 .v54-table .v28-sayit{font-size:17px}',
    /* the doors In the Codex and the row of Practise this wine: chips that wrap, each 44px high */
    '.wrap .v28 .v54-chips{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 12px}',
    '.wrap .v28 .v54-chips .btn{display:inline-flex;align-items:center;min-height:44px;box-sizing:border-box;text-align:left;white-space:normal}',
    '.wrap .v28 .v54-chips.v37-doors{padding:0;border:0;background:none}',
    '.wrap .v28 .v54-fold{margin:0}',
    '.wrap .v28 .v54-fold>summary.secgroup{cursor:pointer;min-height:44px;display:flex;align-items:center}',
    '.wrap .v28 .v54-fold>.v54-foldbody{padding:4px 0 6px}',
    '.wrap .v28 .v54-guide{font-size:17px;line-height:1.5;color:var(--parch)}',
    '.wrap .v28 .v54-codex .v35-cmp{margin-top:4px}',
    '.wrap #v28-card .v52-atlas{display:none}'
  ].join('\n');
  try { document.head.appendChild(css); } catch (e) { }
})();
