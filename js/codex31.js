/* ================== CODEX XXXI: FOUR TABS, BACK ON EVERY SCREEN ==================

   The consolidation (WorldTable docs/consolidation-design.md, sections 2 and
   5, designed 4 October 2026). The owner, a new server at Brennan's studying
   between shifts, found the Codex hard to move through: four nav words that
   differed from the other two apps, about forty views behind them, and a
   phone's back gesture that left the app from almost every screen. This
   layer is the Codex's half of the shared contract.

   WHAT IT DOES, and the rule each part keeps:

   1. THE BAR reads Home, Flashcards, Quizzes, Library, then a quiet More,
      in one row at 390px. V25_NAV is reassigned; the topbar wrapper codex25
      wrote draws it by global name. The lit word is the owner of the view
      (V31_OWNER), with aria-current and the existing underline. Flashcards
      carries the due count as a pill with a hidden word.

   2. HOME is the four level cards and nothing else: v25HomeHtml is
      reassigned to return codex25's section.levels alone.

   3. THE LEVEL PAGE (V25_VIEWS.level, and today and mine land where they
      should): Today's study (Due today, Quick quiz, Next reading, and Your
      first week while it is unfinished), My restaurant (the desk band, the
      house line, the count, three study doors, the sections as chips, the
      quiet setup links), Search, and a closed What {Level} holds.

   4. FLASHCARDS, QUIZZES, LIBRARY, MORE: one picker each, built from the
      engines that already exist. One deck screen and one card screen: every
      house deck, the grape cards and the menu's words are drawn in one
      frame, graded by the records the engines already keep (v27RecordHouse
      for the house, a per-device slot for the grapes, which kept nothing).

   5. THE ROUTER. Every render writes the hash from S.view and its argument:
      a push when the screen key changed, a replace when it did not, when the
      change is within a screen, or when a run moves on (its questions, its
      cards, its results share one entry). A popstate applies the hash and
      renders; a run reached by Back renders from memory while memory holds
      it, and falls to its parent otherwise. Each entry carries its depth as
      `ootd`, mirrored to sessionStorage. codex28's and codex29's own
      listeners are removed and their pushes folded in: v28Push marks the
      next render as a push, so one action makes one entry.

   6. BACK is one ghost button, the first thing in #view on every view but
      home, sticky under the masthead and moved clear of the suite's badge
      once it sticks. Depth above 0: history.back(). Depth 0: the view's
      logical parent, by a replace, so a cold deep link walks up one screen
      a press and the history never gains a loop. Every older way back on a
      screen (each "Back to" button) is removed as the screen is drawn.

   NO OOT AT ALL is the standalone build and every Node gate: no house, so
   My restaurant offers Our Wine List and the desk, and nothing is fetched.

   House rules observed: a new layer, no edits to earlier files; top-level
   declarations are var and function only, no arrow; CSS injected from here;
   no pictorial glyph and no mark at or above U+2190 in anything this file
   writes; no dash of any spelling; British spelling; levels named, never
   numbered; nobody named; every control at least 44px; every state a word. */

/* =========== the words =========== */

var V31_WORDS = {
  back: 'Back',
  more: 'More',
  due: ' due',
  from: 'Opened from {app}. Your phone\'s back gesture returns there.',
  scopeLabel: 'Level',
  showAll: 'show all levels',
  allLevels: 'All levels',
  showOnly: 'show {level} only',
  change: '{level}, change level',
  yourLevel: 'Your level',
  todayH: 'Today\'s study',
  dueRow: 'Due today',
  quickRow: 'Quick quiz',
  nextRow: 'Next reading',
  weekRow: 'Your first week',
  weekLine: '{done} of {total} steps done.',
  weekHead: 'Your first week. Finish it and you have been over the ground a new hire is expected to know.',
  restH: 'My restaurant',
  noHouse: 'No restaurant on this device yet.',
  countLine: '{house}: {n} wines in {s} sections.',
  studied: '{x} studied, {y} to see again.',
  studiedOnly: '{x} studied.',
  studiedNone: 'Nothing studied yet.',
  studyList: 'Study our list',
  studyListLine: 'every wine on the list, a card for each',
  cardsList: 'Flashcards for our list',
  cardsListLine: 'the whole list, front and back',
  drillList: 'Drill our list',
  drillListLine: 'four answers to choose from, the list\'s grapes, regions and pours',
  fullWine: 'The full wine list',
  menuDesk: 'The Menu Desk',
  theHouse: 'The house',
  herMarks: 'Look over her marks',
  secChips: 'Sections of our list',
  searchH: 'Search',
  searchLabel: 'Search the Codex and our list',
  searchHint: 'A wine, a grape, a producer',
  fromList: 'From our list',
  inCodex: 'In the Codex',
  nothing: 'Nothing found for "{q}".',
  nothingAt: 'Nothing at {level} for "{q}".',
  otherLevels: 'At other levels',
  holds: 'what {level} holds',
  dueLine2: '{d} due and {k} new: {parts}.',
  dueLineD: '{d} due: {parts}.',
  dueLineK: '{k} new cards to start: {parts}.',
  dueNone: 'Nothing due today and nothing new at {level}. Try the quick quiz.',
  dueWines: '{a} wines from our list',
  dueWine: '1 wine from our list',
  dueQs: '{b} questions at {level}',
  dueQ: '1 question at {level}',
  quickLine: 'Ten questions: five from our list, five from {level}.',
  quickLineLevel: 'Ten questions from {level}.',
  nextLine: '{title} \u00b7 {level}',
  nextNone: 'Everything at {level} is read. The Library holds the rest.',
  fcH: 'Flashcards',
  startToday: 'Start today\'s cards',
  fcRest: 'My restaurant',
  fcNoHouse: 'No restaurant on this device yet. Set one up from a level page.',
  everyLevel: 'Every level',
  words: 'Words',
  refCards: 'Reference cards',
  wholeList: 'The whole list',
  weakOnes: 'My weak ones',
  floorBottles: 'The floor\'s bottles',
  menuWords: 'The menu\'s words',
  grapeCards: 'Grape cards',
  redGrapes: 'Red grapes',
  whiteGrapes: 'White grapes',
  everyGrape: 'Every grape',
  rowLine: '{n} cards \u00b7 {m} learnt',
  deckLine: '{n} cards \u00b7 {m} learnt',
  ways: 'Choose how to study',
  nameFront: 'Name on the front',
  profileFront: 'Profile on the front',
  narrow: 'the filters to narrow this deck',
  start: 'Start',
  empty: 'No cards in this deck yet.',
  cardPos: 'Card {i} of {n} \u00b7 {deck}',
  front: 'Front',
  answer: 'Answer',
  flip: 'Flip',
  got: 'Got it',
  again: 'Again',
  deckDone: 'Deck done',
  doneLine: '{g} got it, {a} to see again.',
  doneLineAll: '{g} got it.',
  studyMisses: 'Study the misses',
  anotherDeck: 'Another deck',
  nowDue: 'Now the {n} questions due',
  missesDeck: 'The misses',
  oneWine: 'One wine',
  qzH: 'Quizzes',
  startQuick: 'Start the quick quiz',
  quickSection: 'Quick quiz',
  handsOn: 'Hands on',
  wholePaper: 'The whole paper',
  domainLine: 'Domain exam: {n} questions across {s}',
  movesYou: 'This moves you to {level}.',
  cellarDrill: 'The cellar drill',
  classicPairs: 'Classic pairings',
  recite: 'Recite our list',
  libH: 'Library',
  libLine: 'Reading for {level}. Nothing here is graded.',
  libLineAll: 'Reading for every level. Nothing here is graded.',
  chaptersAt: 'Study Chapters \u00b7 {level}',
  videosH: 'Videos for our list',
  videosLine: 'Each video opens in a new tab and needs a connection.',
  videosNone: 'No videos for this restaurant yet.',
  moreH: 'More',
  recordG: 'Record and progress',
  toolsG: 'Tools',
  backupG: 'Backup and data',
  maitreG: 'The Ma\u00eetre d\u2019',
  settingsG: 'Settings',
  aboutG: 'About',
  whoRow: 'Who is studying',
  missH: 'What you missed',
  missAns: 'Answer: ',
  missNone: 'Nothing missed.',
  studyCard: 'Study this card',
  readChapter: 'Read the chapter',
  dealAnother: 'Deal another',
  show: 'Show ',
  hide: 'Hide '
};

function v31W(key, vars) {
  var s = String(V31_WORDS[key] == null ? key : V31_WORDS[key]);
  if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(String(vars[k])); });
  return s;
}
function v31Esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function v31Str(s) { return typeof s === 'string' ? s.trim() : ''; }
function v31Fn(name) { try { return typeof window !== 'undefined' && window && typeof window[name] === 'function'; } catch (e) { return false; } }

/* The rooms of the suite, by their path, for the cross-room line. */
var V31_ROOMS = { table: 'The World Table', ledger: 'The Bartender\'s Ledger', codex: 'The Sommelier\'s Codex' };
var V31_QUICK = 'Quick quiz';

/* =========== per-device slots, never exported, every touch in try =========== */

var V31_NAV_KEY = 'oot-nav-codex-v1';
var V31_SCROLL_KEY = 'oot-scroll-codex-v1';
var V31_GRAPE_BASE = 'oot-codex-grapecards-v1';

function v31SessGet(k) {
  try {
    var s = (typeof sessionStorage !== 'undefined' && sessionStorage) ? sessionStorage.getItem(k) : null;
    return s ? JSON.parse(s) : null;
  } catch (e) { return null; }
}
function v31SessSet(k, v) {
  try { if (typeof sessionStorage !== 'undefined' && sessionStorage) sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { }
}
function v31GrapeKey() {
  try {
    return (typeof OOT !== 'undefined' && OOT && OOT.profiles && typeof OOT.profiles.key === 'function')
      ? OOT.profiles.key(V31_GRAPE_BASE) : V31_GRAPE_BASE;
  } catch (e) { return V31_GRAPE_BASE; }
}
/* { grapeName: 'got' | 'again' }, the last answer to each grape card. */
function v31GrapeRec() {
  try {
    var s = (typeof localStorage !== 'undefined' && localStorage) ? localStorage.getItem(v31GrapeKey()) : null;
    var o = s ? JSON.parse(s) : null;
    return o && typeof o === 'object' ? o : {};
  } catch (e) { return {}; }
}
function v31GrapeMark(name, got) {
  try {
    var o = v31GrapeRec();
    o[name] = got ? 'got' : 'again';
    if (typeof localStorage !== 'undefined' && localStorage) localStorage.setItem(v31GrapeKey(), JSON.stringify(o));
  } catch (e) { }
}

/* =========== the house, read through codex28 =========== */

function v31House() { try { return (typeof v28House === 'function') ? v28House() : null; } catch (e) { return null; } }
function v31Wines() { try { return (typeof v28Wines === 'function') ? v28Wines(v31House()) : []; } catch (e) { return []; } }
function v31HasHouse() { return v31Wines().length > 0; }
function v31Ids(scope) { try { return (typeof v28DeckIds === 'function') ? v28DeckIds(scope || {}) : []; } catch (e) { return []; } }
function v31Prog(ids) {
  try { return (typeof v28Progress === 'function') ? v28Progress(ids) : { total: ids.length, studied: 0, got: 0, again: 0, againIds: [] }; }
  catch (e) { return { total: ids.length, studied: 0, got: 0, again: 0, againIds: [] }; }
}
function v31Latest(id) { try { return (typeof v28Latest === 'function') ? v28Latest(id) : null; } catch (e) { return null; } }
function v31Wine(id) {
  var hit = null;
  v31Wines().some(function (w) { if (w.id === id) { hit = w; return true; } return false; });
  return hit;
}

/* A section's name as an address segment: folded, words joined by hyphens.
   It sits after the literal "section/", so it can never be read as a wine's
   id (every house wine id is w- and eight letters or digits). */
function v31Slug(s) {
  var t = String(s == null ? '' : s).toLowerCase();
  try { t = t.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) { }
  return t.replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/* The glass list's sections, all day, in the house's order, with counts. */
function v31Sections() {
  var out = [], by = {};
  try {
    v28Rows().forEach(function (r) {
      if (r.bottle || r.own) return;
      if (!(r.section in by)) { by[r.section] = 0; out.push(r.section); }
      by[r.section]++;
    });
  } catch (e) { }
  return out.map(function (s) { return { section: s, count: by[s] }; });
}
function v31FloorSections() {
  var out = [], by = {};
  try {
    v28Rows().forEach(function (r) {
      if (!r.bottle) return;
      if (!(r.section in by)) { by[r.section] = 0; out.push(r.section); }
      by[r.section]++;
    });
  } catch (e) { }
  return out.map(function (s) { return { section: s, count: by[s] }; });
}
function v31SecBySlug(slug, floor) {
  var hit = '';
  (floor ? v31FloorSections() : v31Sections()).some(function (s) { if (v31Slug(s.section) === slug) { hit = s.section; return true; } return false; });
  return hit;
}

/* =========== the level =========== */

function v31Lv() { return (typeof v25Here === 'function') ? v25Here() : { key: 'certified', name: 'Village', n: 2 }; }
function v31Levels() { return (typeof v25Present === 'function') ? v25Present() : []; }
function v31LvByKey(k) { return (typeof v25Level === 'function') ? v25Level(k) : null; }

/* The scope each root was left in, never stored: Flashcards, Quizzes, Library. */
function v31All() {
  if (!S._v31all) S._v31all = { flashcards: false, quizzes: false, library: false };
  return S._v31all;
}

/* =========== Due today: one count for the row, the root and the pill ===========

   The house step first: the wines last answered Again, or, with none, the
   wines never graded, in the list's order, ten at most. Then codex3's own
   spaced review, startDaily, exactly as it deals: what is due, topped up
   with unseen questions to twenty, thirty at most. */
function v31DueToday() {
  var lv = v31Lv();
  var weak = [], fresh = [];
  if (v31HasHouse()) {
    var all = v31Ids({});
    weak = v31Prog(all).againIds.slice(0, 20);
    if (!weak.length) fresh = all.filter(function (id) { return !v31Latest(id); }).slice(0, 10);
  }
  var dueQ = 0, unseen = 0;
  try { dueQ = (typeof v25Due === 'function') ? v25Due() : 0; } catch (e) { dueQ = 0; }
  var newQ = 0;
  if (dueQ < 20) {
    try { unseen = (typeof v25Unseen === 'function') ? v25Unseen() : 0; } catch (e) { unseen = 0; }
    newQ = Math.min(20 - dueQ, unseen);
  }
  var dQ = Math.min(dueQ, 30);
  var nQ = Math.min(newQ, 30 - dQ);
  var houseIds = weak.length ? weak : fresh;
  return {
    level: lv.name, houseIds: houseIds, a: houseIds.length, b: dQ + nQ,
    d: weak.length + dQ, k: fresh.length + nQ, total: houseIds.length + dQ + nQ
  };
}

function v31DueLine(t) {
  t = t || v31DueToday();
  if (!t.total) return v31W('dueNone', { level: t.level });
  var parts = [];
  if (t.a) parts.push(t.a === 1 ? v31W('dueWine') : v31W('dueWines', { a: t.a }));
  if (t.b) parts.push(t.b === 1 ? v31W('dueQ', { level: t.level }) : v31W('dueQs', { b: t.b, level: t.level }));
  var p = parts.join(', ');
  if (t.d && t.k) return v31W('dueLine2', { d: t.d, k: t.k, parts: p });
  if (t.d) return v31W('dueLineD', { d: t.d, parts: p });
  return v31W('dueLineK', { k: t.k, parts: p });
}

/* =========== the decks =========== */

/* Every grape profile the four levels taste, and the twenty-four extra
   ones, each once. */
function v31AllGrapes() {
  var seen = {}, out = [];
  var add = function (g) { if (g && typeof g.g === 'string' && !seen[g.g]) { seen[g.g] = 1; out.push(g); } };
  try {
    (typeof LEVEL_ORDER !== 'undefined' ? LEVEL_ORDER : []).forEach(function (k) {
      var L = LEVELS[k];
      (L && Array.isArray(L.grapes) ? L.grapes : []).forEach(add);
    });
  } catch (e) { }
  try { (typeof GRAPES !== 'undefined' && Array.isArray(GRAPES) ? GRAPES : []).forEach(add); } catch (e) { }
  try { (typeof GRAPES_PLUS !== 'undefined' && Array.isArray(GRAPES_PLUS) ? GRAPES_PLUS : []).forEach(add); } catch (e) { }
  return out;
}
function v31LevelGrapes() {
  try { return (typeof GRAPES !== 'undefined' && Array.isArray(GRAPES)) ? GRAPES.slice() : []; } catch (e) { return []; }
}

/* The house's words: the engine's term cards over the kept lexicon. */
function v31WordCards() {
  var h = v31House();
  if (!h) return [];
  var lib = null;
  try { lib = (typeof OOT !== 'undefined' && OOT && OOT.houseLib) ? OOT.houseLib : null; } catch (e) { lib = null; }
  var fn = lib && lib.drills && typeof lib.drills.buildFlashcards === 'function' ? lib.drills.buildFlashcards
    : lib && typeof lib.buildFlashcards === 'function' ? lib.buildFlashcards : null;
  if (!fn) return [];
  try {
    return (fn(h) || []).filter(function (c) { return c && c.kind === 'term' && c.front && c.back; })
      .map(function (c, i) { return { kind: 'word', id: String(c.itemId || ('t' + i)), front: String(c.front), back: String(c.back), n: i }; });
  } catch (e) { return []; }
}

/* The members of the misses deck, carried in its address. */
var V31_MISSES = [];

function v31HouseCards(ids) {
  var h = v31House();
  var out = [];
  ids.forEach(function (id) {
    var w = v31Wine(id);
    var c = null;
    try { c = w ? v28CardOf(w, h) : null; } catch (e) { c = null; }
    if (c) out.push({ kind: 'house', id: id, c: c });
  });
  return out;
}
function v31GrapeCards(list) { return list.map(function (g) { return { kind: 'grape', id: g.g, g: g }; }); }

/* A deck by its id: its name, its cards in dealing order, how many are learnt. */
function v31DeckDef(id) {
  id = String(id || '');
  var def = { id: id, name: '', cards: [], kind: 'house' };
  var m;
  if (id === 'list') { def.name = v31W('wholeList'); def.cards = v31HouseCards(v31Ids({})); }
  else if ((m = /^list:(.+)$/.exec(id))) {
    var sec = v31SecBySlug(m[1], false);
    def.name = sec || m[1]; def.cards = sec ? v31HouseCards(v31Ids({ section: sec })) : [];
  }
  else if (id === 'list-weak') { def.name = v31W('weakOnes'); def.cards = v31HouseCards(v31Prog(v31Ids({})).againIds); }
  else if ((m = /^one:(w-[a-z0-9]{8})$/.exec(id))) {
    var w = v31Wine(m[1]);
    def.name = w ? w.name : v31W('oneWine'); def.cards = v31HouseCards([m[1]]);
  }
  else if (id === 'bottles') { def.name = v31W('floorBottles'); def.cards = v31HouseCards(v31Ids({ section: '#bottles' })); }
  else if ((m = /^bottles:(.+)$/.exec(id))) {
    var fs = v31SecBySlug(m[1], true);
    def.name = fs || m[1]; def.cards = fs ? v31HouseCards(v31Ids({ section: '#bottles|' + fs })) : [];
  }
  else if (id === 'menu-words') { def.kind = 'word'; def.name = v31W('menuWords'); def.cards = v31WordCards(); }
  else if (id === 'grapes' || id === 'grapes:r' || id === 'grapes:w') {
    def.kind = 'grape';
    def.name = id === 'grapes' ? v31W('grapeCards') : id === 'grapes:r' ? v31W('redGrapes') : v31W('whiteGrapes');
    var c = id.slice(7);
    def.cards = v31GrapeCards(v31LevelGrapes().filter(function (g) { return !c || g.c === c; }));
  }
  else if (id === 'grapes-all' || id === 'grapes-all:r' || id === 'grapes-all:w') {
    def.kind = 'grape';
    def.name = id === 'grapes-all' ? v31W('everyGrape') : id === 'grapes-all:r' ? v31W('redGrapes') : v31W('whiteGrapes');
    var c2 = id.slice(11);
    def.cards = v31GrapeCards(v31AllGrapes().filter(function (g) { return !c2 || g.c === c2; }));
  }
  else if (id === 'misses') { def.name = v31W('missesDeck'); def.cards = v31HouseCards(V31_MISSES.slice()); }
  else if (id === 'due') { def.name = v31W('dueRow'); def.cards = v31HouseCards(v31DueToday().houseIds); }
  def.learnt = v31Learnt(def);
  return def;
}

function v31Learnt(def) {
  if (def.kind === 'grape') {
    var rec = v31GrapeRec();
    return def.cards.filter(function (c) { return rec[c.id] === 'got'; }).length;
  }
  if (def.kind === 'word') {
    var seen = {};
    return def.cards.filter(function (c) {
      if (seen[c.id]) return false;
      seen[c.id] = 1;
      return v31Latest(c.id) === 'got';
    }).length;
  }
  return v31Prog(def.cards.map(function (c) { return c.id; })).got;
}

function v31DeckRow(id, name) {
  var def = v31DeckDef(id);
  if (!def.cards.length) return '';
  return '<li><button class="v25row" type="button" data-v31="deck" data-deck="' + v31Esc(id) + '">'
    + '<span class="v25row-name">' + v31Esc(name || def.name) + '</span>'
    + '<span class="v25row-line">' + v31Esc(v31W('rowLine', { n: def.cards.length, m: def.learnt })) + '</span></button></li>';
}

/* =========== the run: one card screen for every deck =========== */

/* S._v31run = { v31, deckId, kind, label, cards, deck (indices still to
   deal, the first is showing), flip, done, again, total, missed, dir,
   filter }. While it deals grapes it is S.fc too, so core's keys (space to
   flip, 1 and 2 to grade) and codex28's grape door keep working on it. */
function v31StartRun(deckId, opts) {
  var o = opts || {};
  var def = v31DeckDef(deckId);
  if (o.cards) def.cards = o.cards;
  if (!def.cards.length) { if (typeof toast === 'function') toast(v31W('empty')); return false; }
  var order = def.cards.map(function (c, i) { return i; });
  if (def.kind !== 'house' || (deckId !== 'due' && deckId !== 'misses')) {
    if (typeof shuffle === 'function' && order.length > 1 && !o.keepOrder) order = shuffle(order);
  }
  if (o.first) {
    var at = -1;
    def.cards.forEach(function (c, i) { if (c.id === o.first) at = i; });
    if (at >= 0) order = [at].concat(order.filter(function (i) { return i !== at; }));
  }
  var prevDir = S._v31run && S._v31run.dir ? S._v31run.dir : (S.fc && S.fc.dir) || 'n2p';
  var run = {
    v31: 1, deckId: deckId, kind: def.kind, label: def.name, cards: def.cards, deck: order,
    flip: false, done: 0, again: 0, total: order.length, missed: [], dir: o.dir || prevDir,
    filter: 'all', after: o.after || null
  };
  S._v31run = run;
  S._v28deck = null;
  S.fc = def.kind === 'grape' ? run : null;
  S.view = def.kind === 'grape' ? 'flash' : 'housedeck';
  if (o.push) V31.pend = 'push';
  render();
  v31ShowCard();
  return true;
}

function v31RunCard() {
  var r = S._v31run;
  if (!r || !r.deck.length) return null;
  return r.cards[r.deck[0]] || null;
}

function v31Grade(got) {
  var r = S._v31run;
  if (!r || !r.flip || !r.deck.length) return;
  var i = r.deck.shift();
  var c = r.cards[i];
  if (c) {
    if (c.kind === 'house' && typeof v27RecordHouse === 'function') v27RecordHouse('h-' + c.id + '-card', 'Our List', c.c.name, !!got);
    else if (c.kind === 'word' && typeof v27RecordHouse === 'function') v27RecordHouse('h-' + c.id + '-word', 'Our List', c.front, !!got);
    else if (c.kind === 'grape') v31GrapeMark(c.id, !!got);
  }
  if (got) r.done++;
  else {
    r.again++;
    if (r.missed.indexOf(i) < 0) r.missed.push(i);
    /* the grape cards keep their own rule: a card sent back comes round again within four */
    if (c && c.kind === 'grape') r.deck.splice(Math.min(4, r.deck.length), 0, i);
  }
  r.flip = false;
}

/* =========== the router =========== */

/* d: the depth of the current entry; key: the screen it shows; pend: what
   the next render does with the history ('push', 'replace', 'none');
   liveRun and liveTok: the run the app holds in memory and its entry;
   toks: the token each run number was made for, so a pop to any entry,
   not only the newest, can tell whether memory still holds its run. */
var V31 = {
  d: 0, key: null, view: null, pend: 'none', booted: false, moved: false, rendering: false,
  run: 0, liveRun: 0, liveTok: null, toks: {}, lastPress: null, from: '', v28state: null, wantSec: null, focusFor: {}, renders: 0
};

var V31_RUN = { quiz: 1, results: 1, grid: 1, floor: 1, floortally: 1, pairs: 1, pairtally: 1, tasting: 1, finalsreport: 1, housedeck: 1, flash: 1 };

/* Who owns each view: the word lit in the bar. */
var V31_OWNER = {
  home: 'home', level: 'home', today: 'home', cellar: 'home', menudesk: 'home', winepaste: 'home', house: 'home', housereview: 'home', firstweek: 'home',
  flashcards: 'flashcards', deck: 'flashcards', flash: 'flashcards', housedeck: 'flashcards',
  quizzes: 'quizzes', quiz: 'quizzes', results: 'quizzes', drillpick: 'quizzes', sim: 'quizzes', grid: 'quizzes', floor: 'quizzes',
  floortally: 'quizzes', pairs: 'quizzes', pairtally: 'quizzes', finalsreport: 'quizzes', tasting: 'quizzes', service: 'quizzes',
  cellarrecite: 'quizzes', houserecite: 'quizzes', housesay: 'quizzes', houseguest: 'quizzes',
  library: 'library', primers: 'library', primer: 'library', ency: 'library', producers: 'library', worldmap: 'library',
  compendium: 'library', terroir: 'library', videos: 'library', tastegrid: 'library', fulllist: 'library', housevideos: 'library',
  more: 'more', mine: 'more', record: 'more', dash: 'more', hall: 'more', sync: 'more', plan: 'more', disputes: 'more',
  exams: 'more', maitre: 'more', 'oot-pass': 'more'
};

/* The logical parent of each view, for Back at depth 0 (5.9). */
var V31_PARENT = {
  home: null, level: 'home', today: 'home', firstweek: 'level',
  cellar: 'level', menudesk: 'level', winepaste: 'level', house: 'level', housereview: 'level',
  flashcards: 'home', deck: 'flashcards', housedeck: 'deck', flash: 'deck',
  quizzes: 'home', quiz: 'quizzes', results: 'quizzes', drillpick: 'quizzes', sim: 'quizzes', grid: 'quizzes', floor: 'quizzes',
  floortally: 'quizzes', pairs: 'quizzes', pairtally: 'quizzes', tasting: 'quizzes', service: 'quizzes', cellarrecite: 'quizzes',
  houserecite: 'quizzes', housesay: 'quizzes', houseguest: 'quizzes', finalsreport: 'quizzes',
  library: 'home', primers: 'library', primer: 'primers', ency: 'library', producers: 'library', worldmap: 'library',
  compendium: 'library', terroir: 'library', videos: 'library', tastegrid: 'library', fulllist: 'library', housevideos: 'library',
  more: 'home', mine: 'home', record: 'more', dash: 'more', hall: 'more', sync: 'more', plan: 'more', disputes: 'more',
  exams: 'more', maitre: 'more', 'oot-pass': 'more'
};

function v31Path() {
  try { return (location.pathname || '') + (location.search || ''); } catch (e) { return ''; }
}

/* The argument a view carries in its address. */
function v31Arg(v) {
  try {
    if (v === 'primer') return S.primerKey == null ? '' : String(S.primerKey);
    if (v === 'producers') {
      var p = S._prod || {};
      if (p.id) return String(p.id);
      return (p.c === null || p.c === undefined) ? '' : 'c' + p.c;
    }
    if (v === 'worldmap') return S.wmap ? String(S.wmap) : '';
    if (v === 'compendium') return S.cmp && S.cmp.sec ? String(S.cmp.sec) : '';
    if (v === 'videos') return S.vidFocus ? String(S.vidFocus) : '';
  } catch (e) { }
  return '';
}

function v31DeckSeg(id) {
  if (id === 'misses') return 'misses/' + V31_MISSES.join(',');
  return id;
}

/* The screen showing now: its key (what decides push or replace) and its
   address (which also carries the in-screen state a reload should keep). */
function v31Route() {
  var v = S.view, all = v31All();
  var R = function (key, hash) { return { view: v, key: key, hash: hash }; };
  if (v === 'home') return R('home', '#/');
  if (v === 'level' || v === 'today') return R('level', '#/level');
  if (v === 'flashcards') return R('flashcards', '#/flashcards' + (all.flashcards ? '/all' : ''));
  if (v === 'deck') return R('deck/' + S._v31deck, '#/flashcards/' + v31DeckSeg(S._v31deck));
  if (v === 'housedeck' || v === 'flash') {
    var r = S._v31run;
    var id = r && r.v31 ? r.deckId : 'grapes';
    return R('card/' + id, '#/flashcards/' + v31DeckSeg(id) + '/card');
  }
  if (v === 'quizzes') return R('quizzes', '#/quizzes' + (all.quizzes ? '/all' : ''));
  if (v === 'quiz' && S.section === V31_QUICK) return R('quiz', '#/quizzes/quick');
  if (v === 'library') return R('library', '#/library' + (all.library ? '/all' : ''));
  if (v === 'more' || v === 'mine') return R('more', '#/more');
  if (v === 'cellar') {
    var st = S._v28 || {};
    if (st.open) return R('cellar/' + st.open, '#/v/cellar/' + st.open);
    if (st.sec && st.sec.indexOf('#bottles|') === 0) return R('cellar', '#/v/cellar/section/floor/' + v31Slug(st.sec.slice(9)));
    if (st.sec === '#bottles') return R('cellar', '#/v/cellar/section/floor');
    if (st.sec) return R('cellar', '#/v/cellar/section/' + v31Slug(st.sec));
    return R('cellar', '#/v/cellar');
  }
  var arg = v31Arg(v);
  return R(v + (arg ? '/' + arg : ''), '#/v/' + v + (arg ? '/' + encodeURIComponent(arg) : ''));
}

/* An address read back into a route: { view, arg, all, deck, card, sec, floor }. */
function v31Parse(hash) {
  var h = String(hash || '');
  if (h === '' || h === '#' || h === '#/') return { view: 'home' };
  if (h.indexOf('#/') !== 0) return null;
  var parts = h.slice(2).split('/').map(function (p) { try { return decodeURIComponent(p); } catch (e) { return p; } });
  var a = parts[0];
  if (a === 'level') return { view: 'level' };
  if (a === 'flashcards') {
    if (!parts[1]) return { view: 'flashcards' };
    if (parts[1] === 'all') return { view: 'flashcards', all: true };
    if (parts[1] === 'misses') {
      var ids = String(parts[2] || '').split(',').filter(function (x) { return /^w-[a-z0-9]{8}$/.test(x); });
      return { view: parts[3] === 'card' ? 'card' : 'deck', deck: 'misses', ids: ids };
    }
    return { view: parts[2] === 'card' ? 'card' : 'deck', deck: parts[1] };
  }
  if (a === 'quizzes') {
    if (parts[1] === 'quick') return { view: 'quick' };
    return { view: 'quizzes', all: parts[1] === 'all' };
  }
  if (a === 'library') return { view: 'library', all: parts[1] === 'all' };
  if (a === 'more') return { view: 'more' };
  if (a === 'v' && parts[1]) {
    var v = parts[1];
    if (v === 'mine' || v === 'more') return { view: 'more' };
    if (v === 'today' || v === 'level') return { view: 'level' };
    if (!Object.prototype.hasOwnProperty.call(V31_PARENT, v)) return { view: 'home' };
    if (v === 'cellar') {
      if (parts[2] === 'section') {
        if (parts[3] === 'floor') return { view: 'cellar', floor: true, sec: parts[4] || '' };
        return { view: 'cellar', sec: parts[3] || '' };
      }
      if (/^w-[a-z0-9]{8}$/.test(parts[2] || '')) return { view: 'cellar', arg: parts[2] };
      return { view: 'cellar' };
    }
    return { view: v, arg: parts.slice(2).join('/') };
  }
  return { view: 'home' };
}

/* The token of the run a view shows, so a pop can tell whether memory still
   holds the run its entry was made for. */
function v31Tok(v) {
  if (v === 'quiz' || v === 'results') return (S.pool && S.pool.length) ? S.pool : null;
  if (v === 'housedeck' || v === 'flash') return S._v31run || null;
  if (v === 'grid') return S.tg || null;
  if (v === 'floor' || v === 'floortally') return S.fl || null;
  if (v === 'pairs' || v === 'pairtally') return S.pr || null;
  if (v === 'tasting') return S.tt || null;
  if (v === 'finalsreport') return S._v25lt || S._fin || null;
  return null;
}
function v31InMemory(v, state) {
  var tok = v31Tok(v);
  if (!tok) return false;
  /* an entry that names its run is held to that run's own token: Study the
     misses pushes a new run, and the results below it still render from
     memory while S.pool and S.results hold their round */
  var held = (state && typeof state.run === 'number')
    ? (Object.prototype.hasOwnProperty.call(V31.toks, state.run) ? V31.toks[state.run] : null)
    : V31.liveTok;
  if (!held) return false;
  if (S._v25lt && (v === 'quiz' || v === 'grid' || v === 'floor' || v === 'finalsreport')) return tok === held || held === S._v25lt;
  if (v === 'results') return !!(S.results && S.results.length) && tok === held;
  return tok === held;
}

/* The token a run number was made for, the newest sixty kept. */
function v31KeepTok(run, tok) {
  if (typeof run !== 'number' || !tok) return;
  V31.toks[run] = tok;
  var ks = Object.keys(V31.toks);
  if (ks.length > 60) {
    ks.map(Number).sort(function (a, b) { return a - b; }).slice(0, ks.length - 60).forEach(function (k) { delete V31.toks[k]; });
  }
}

/* Puts S where a route says. Returns the route actually shown, which for a
   run memory no longer holds is its parent. */
function v31Apply(r, state) {
  if (!r) r = { view: 'home' };
  var v = r.view;
  var all = v31All();
  S._v25area = null;
  if (v === 'home') { S.view = 'home'; S.mode = null; return r; }
  if (v === 'level') { S.view = 'level'; return r; }
  if (v === 'flashcards') { all.flashcards = !!r.all; S.view = 'flashcards'; return r; }
  if (v === 'deck') {
    if (r.deck === 'misses' && r.ids) V31_MISSES = r.ids.slice();
    S._v31deck = r.deck; S.view = 'deck'; return r;
  }
  if (v === 'card') {
    var run = S._v31run;
    if (run && run.v31 && run.deckId === r.deck && v31InMemory(run.kind === 'grape' ? 'flash' : 'housedeck', state)) {
      S.view = run.kind === 'grape' ? 'flash' : 'housedeck';
      if (run.kind === 'grape') S.fc = run;
      return r;
    }
    if (r.deck === 'due') { S.view = 'flashcards'; return { view: 'flashcards' }; }
    var one = /^one:(w-[a-z0-9]{8})$/.exec(r.deck || '');
    if (one) return v31Apply({ view: 'cellar', arg: one[1] }, null);
    if (r.deck === 'misses' && r.ids && r.ids.length) {
      V31_MISSES = r.ids.slice();
      var def = v31DeckDef('misses');
      if (def.cards.length) {
        S._v31run = null;
        var o = { v31: 1, deckId: 'misses', kind: 'house', label: def.name, cards: def.cards, deck: def.cards.map(function (c, i) { return i; }),
          flip: false, done: 0, again: 0, total: def.cards.length, missed: [], dir: 'n2p', filter: 'all' };
        S._v31run = o; S.view = 'housedeck';
        return r;
      }
    }
    S._v31deck = r.deck; S.view = 'deck';
    return { view: 'deck', deck: r.deck };
  }
  if (v === 'quizzes') { all.quizzes = !!r.all; S.view = 'quizzes'; return r; }
  if (v === 'quick') {
    if (S.section === V31_QUICK && v31InMemory('quiz', state)) { S.view = 'quiz'; return r; }
    S.view = 'quizzes'; return { view: 'quizzes' };
  }
  if (v === 'library') { all.library = !!r.all; S.view = 'library'; return r; }
  if (v === 'more') { S.view = 'more'; return r; }
  if (v === 'cellar') {
    var st = (typeof v28State === 'function') ? v28State() : (S._v28 || (S._v28 = {}));
    S._v28edit = false;
    st.door = null; st.q = st.q || '';
    S.view = 'cellar';
    if (r.arg) {
      var found = false;
      try { found = !!v28Find(v28Rows(), r.arg); } catch (e) { found = false; }
      if (found) { st.open = r.arg; st.pushed = true; st.focus = 'head'; }
      else { st.open = null; try { V28_WANT = { wine: r.arg }; } catch (e) { } }
    } else {
      st.open = null;
      if (r.sec !== undefined || r.floor) {
        if (r.floor && !r.sec) st.sec = '#bottles';
        else {
          var name = v31SecBySlug(r.sec, !!r.floor);
          if (name) st.sec = r.floor ? '#bottles|' + name : name;
          else V31.wantSec = { slug: r.sec, floor: !!r.floor };
        }
      } else st.sec = '';
      st.focus = 'restore';
    }
    return r;
  }
  if (V31_RUN[v]) {
    if (v31InMemory(v, state)) { S.view = v; return r; }
    var up = V31_PARENT[v] || 'quizzes';
    S.view = up;
    return { view: up };
  }
  var arg = r.arg || '';
  if (v === 'primer') {
    if (!arg) { S.view = 'primers'; return { view: 'primers' }; }
    S.primerKey = /^\d+$/.test(arg) && typeof activeLevel !== 'undefined' && activeLevel === 'intro' ? Number(arg) : arg;
  } else if (v === 'producers') {
    var pc = /^c(\d+)$/.exec(arg);
    if (pc) S._prod = { c: Number(pc[1]), id: null };
    else if (arg) {
      var ci = null;
      try {
        var rec = prodById(arg);
        if (rec) prodGroups().forEach(function (g, i) { if (g.rows.indexOf(rec) >= 0) ci = i; });
      } catch (e) { }
      S._prod = ci === null ? { c: null, id: null } : { c: ci, id: arg };
    } else S._prod = { c: null, id: null };
  } else if (v === 'worldmap') S.wmap = arg || null;
  else if (v === 'compendium') S.cmp = arg ? { sec: arg, idx: null, reg: null } : null;
  else if (v === 'videos') S.vidFocus = arg || null;
  S.view = v;
  return r;
}

/* The route one step up the tree from the screen showing. */
function v31ParentRoute() {
  var v = S.view;
  if (v === 'today') v = 'level';
  if (v === 'mine') v = 'more';
  if (v === 'cellar') {
    var st = S._v28 || {};
    if (st.open) {
      var sec = st.sec || '';
      if (!sec) return { view: 'cellar' };
      if (sec === '#bottles') return { view: 'cellar', floor: true, sec: '' };
      if (sec.indexOf('#bottles|') === 0) return { view: 'cellar', floor: true, sec: v31Slug(sec.slice(9)) };
      return { view: 'cellar', sec: v31Slug(sec) };
    }
    return { view: 'level' };
  }
  if (v === 'housedeck' || v === 'flash') {
    var r = S._v31run;
    if (!r || !r.v31) return { view: 'flashcards' };
    var one = /^one:(w-[a-z0-9]{8})$/.exec(r.deckId);
    if (one) return { view: 'cellar', arg: one[1] };
    if (r.deckId === 'due') return { view: 'flashcards' };
    return { view: 'deck', deck: r.deckId, ids: r.deckId === 'misses' ? V31_MISSES.slice() : null };
  }
  if (v === 'quiz' && S.section === V31_QUICK) return { view: 'quizzes' };
  var arg = v31Arg(v);
  if (v === 'producers' && arg) {
    if (/^c\d+$/.test(arg)) return { view: 'producers' };
    var p = S._prod || {};
    return (p.c === null || p.c === undefined) ? { view: 'producers' } : { view: 'producers', arg: 'c' + p.c };
  }
  if ((v === 'worldmap' || v === 'compendium' || v === 'videos') && arg) return { view: v };
  var up = Object.prototype.hasOwnProperty.call(V31_PARENT, v) ? V31_PARENT[v] : 'home';
  return { view: up || 'home' };
}

function v31Mirror() {
  var href = '';
  try { href = location.href; } catch (e) { href = ''; }
  v31SessSet(V31_NAV_KEY, { d: V31.d, href: href });
}

function v31Hist(kind, state, url) {
  try {
    if (typeof history === 'undefined' || !history) return false;
    if (kind === 'push' && typeof history.pushState === 'function') { history.pushState(state, '', url); return true; }
    if (kind === 'replace' && typeof history.replaceState === 'function') { history.replaceState(state, '', url); return true; }
  } catch (e) { }
  return false;
}

function v31CurState() {
  try { return (typeof history !== 'undefined' && history && history.state && typeof history.state === 'object') ? history.state : {}; }
  catch (e) { return {}; }
}

/* After every render: write the entry for the screen now showing. */
function v31After(prevView) {
  var r = v31Route();
  var url = v31Path() + r.hash;
  var mode = V31.pend;
  V31.pend = null;
  if (!V31.booted) mode = 'none';
  var runPair = !!(prevView && V31_RUN[prevView] && V31_RUN[S.view]);
  var cur = v31CurState();
  var tok = V31_RUN[S.view] ? v31Tok(S.view) : null;
  var state;
  if (mode === 'push' || (mode !== 'none' && mode !== 'replace' && r.key !== V31.key && !runPair)) {
    V31.d += 1;
    V31.moved = true;
    V31.from = '';
    state = Object.assign({}, V31.v28state || {}, { ootd: V31.d });
    if (tok) { V31.run += 1; V31.liveRun = V31.run; V31.liveTok = tok; state.run = V31.run; v31KeepTok(state.run, tok); }
    v31Hist('push', state, url);
  } else {
    state = Object.assign({}, cur, V31.v28state || {}, { ootd: V31.d });
    if (tok && tok !== V31.liveTok) {
      /* a new run in the same entry (Deal another, Study the misses after a deck) */
      if (typeof cur.run !== 'number' || mode !== 'none') { V31.run += 1; V31.liveRun = V31.run; state.run = V31.run; }
      else { state.run = cur.run; V31.liveRun = cur.run; }
      V31.liveTok = tok;
      v31KeepTok(state.run, tok);
    } else if (tok && typeof cur.run === 'number') { state.run = cur.run; V31.liveRun = cur.run; v31KeepTok(state.run, tok); }
    v31Hist('replace', state, url);
  }
  V31.v28state = null;
  V31.key = r.key;
  V31.view = S.view;
  V31.booted = true;
  v31Mirror();
}

function v31SaveScroll() {
  try {
    var href = location.href;
    var y = window.scrollY || window.pageYOffset || 0;
    var map = v31SessGet(V31_SCROLL_KEY) || { k: [], y: {} };
    if (!map.k || !map.y) map = { k: [], y: {} };
    if (!(href in map.y)) map.k.push(href);
    map.y[href] = y;
    while (map.k.length > 60) { var old = map.k.shift(); delete map.y[old]; }
    v31SessSet(V31_SCROLL_KEY, map);
  } catch (e) { }
}
function v31RestoreScroll() {
  var y = 0;
  try {
    var map = v31SessGet(V31_SCROLL_KEY);
    y = map && map.y && typeof map.y[location.href] === 'number' ? map.y[location.href] : 0;
  } catch (e) { y = 0; }
  var go = function () { try { window.scrollTo(0, y); } catch (e) { } };
  go();
  try {
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(function () { requestAnimationFrame(go); });
  } catch (e) { }
}

/* The opener of a move, remembered so a Back can focus it again: by id
   where it has one, else by the data attributes that name it (codex28's
   rows carry data-id and no id). */
var V31_FOCUS_ATTRS = ['data-v28', 'data-v31', 'data-go', 'data-nav', 'data-id', 'data-deck', 'data-cat', 'data-g', 'data-lv', 'data-k', 'data-s', 'data-find-p'];
function v31FocusKey(el) {
  try {
    if (!el || el.nodeType !== 1 || typeof el.getAttribute !== 'function') return '';
    if (el === document.body || el === document.documentElement) return '';
    if (el.id) return 'id:' + el.id;
    var sel = '';
    V31_FOCUS_ATTRS.forEach(function (k) {
      var v = el.getAttribute(k);
      if (v !== null && v !== '') sel += '[' + k + '="' + String(v).replace(/["\\]/g, '\\$&') + '"]';
    });
    return sel ? 'sel:' + String(el.tagName || '').toLowerCase() + sel : '';
  } catch (e) { return ''; }
}
function v31Remember(el) {
  var k = v31FocusKey(el);
  try { if (k) V31.focusFor[location.href] = k; } catch (e) { }
}
/* The control pressed last: a tap on a phone does not always focus it. */
function v31PushOpener() {
  try {
    var a = document.activeElement;
    var c = V31.lastPress;
    if (a && a !== document.body && v31FocusKey(a)) { v31Remember(a); return; }
    if (c && c.isConnected !== false && document.contains && document.contains(c)) v31Remember(c);
  } catch (e) { }
}
function v31Focus(href) {
  var k = V31.focusFor[href];
  try {
    var n = null;
    if (k && k.indexOf('sel:') === 0) n = document.querySelector('#view ' + k.slice(4)) || document.querySelector(k.slice(4));
    else if (k) n = document.getElementById(k.indexOf('id:') === 0 ? k.slice(3) : k);
    if (n && typeof n.focus === 'function') { n.focus({ preventScroll: true }); return; }
  } catch (e) { }
  if (typeof v25FocusMain === 'function') v25FocusMain();
}

/* A running round left by a move: the guard each wing asks, and core's own
   teardown, exactly as a nav word does. */
function v31Running() {
  return S.view === 'quiz' && !!S.mode && !!(S.pool && S.pool.length);
}

/* A starter that may decline (a toast, nothing to deal) leaves no push
   waiting for some later render. */
function v31Push(fn) {
  var n = V31.renders;
  V31.pend = 'push';
  try { fn(); } finally { if (V31.renders === n) V31.pend = null; }
}

/* One move: apply a route, render, and record it as asked. */
function v31Go(route, mode) {
  try { v31Remember(document.activeElement); } catch (e) { }
  v31Apply(route, null);
  V31.pend = mode || 'push';
  render();
  if (typeof v25FocusMain === 'function') v25FocusMain();
}

/* The Back control. */
function v31Back() {
  if (v31Running() && typeof v25Leave === 'function' && !v25Leave()) return;
  if (V31.d > 0) {
    try { history.back(); return; } catch (e) { }
  }
  v31Go(v31ParentRoute(), 'replace');
}

function v31OnPop(e) {
  var st = (e && e.state && typeof e.state === 'object') ? e.state : null;
  if (!st || typeof st.ootd !== 'number') {
    /* an entry the browser made for the app (a hash link): adopted, one deeper */
    var adopt = Object.assign({}, st || {}, { ootd: V31.d + 1 });
    v31Hist('replace', adopt, null);
    st = adopt;
  }
  if (v31Running() && typeof v25Leave === 'function' && !v25Leave()) {
    /* the sitting stays: put back the entry the gesture took */
    v31Hist('push', Object.assign({}, v31CurState(), { ootd: V31.d }), v31Path() + v31Route().hash);
    return;
  }
  V31.d = st.ootd;
  /* the address is already the popped entry's: the page leaving is not saved under it */
  V31.popping = true;
  var route = null;
  try { route = v31Parse(location.hash); } catch (e2) { route = null; }
  v31Apply(route || { view: 'home' }, st);
  V31.pend = 'none';
  render();
  v31RestoreScroll();
  v31Focus(location.href);
}

/* An in-app link to an address goes through the push, never through a
   location.hash assignment, so it makes one entry with its depth. */
function v31LinkClick(e) {
  try {
    var t = e && e.target;
    var a = t && typeof t.closest === 'function' ? t.closest('a[href^="#/"]') : null;
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    v31Go(v31Parse(a.getAttribute('href')), 'push');
  } catch (err) { }
}

/* =========== the old pushes, folded in =========== */

if (typeof v28Push === 'function') {
  v28Push = function (state) { V31.pend = 'push'; V31.v28state = state || null; return true; };
}
/* codex28's own pushes (a row opening its card, a door) remember their
   opener too, so Back focuses the row that opened the card. */
if (typeof v28Push === 'function') {
  var _v31V28Push = v28Push;
  v28Push = function (state) { v31PushOpener(); return _v31V28Push.apply(this, arguments); };
}
if (typeof v28Replace === 'function') {
  v28Replace = function (state) { if (V31.pend !== 'push') V31.pend = 'replace'; V31.v28state = state || null; };
}
if (typeof v28Back === 'function') v28Back = function () { v31Back(); };
if (typeof v28CloseCard === 'function') v28CloseCard = function () { v31Back(); };
if (typeof v28DeckClose === 'function') v28DeckClose = function () { v31Back(); };
if (typeof v29Close === 'function') v29Close = function () { v31Back(); };
if (typeof v29Leave === 'function') v29Leave = function () { v31Back(); };
if (typeof V25_TRAIN !== 'undefined' && V25_TRAIN && V25_TRAIN.backlevel) {
  V25_TRAIN.backlevel.go = function () { v31Back(); };
  if (typeof V25_GO !== 'undefined' && V25_GO) V25_GO.backlevel = V25_TRAIN.backlevel.go;
}
/* The deep link's wish, honoured at load or after the first sync, is the
   landing itself, not a move: it replaces. */
if (typeof v28Want === 'function') {
  var _v31Want = v28Want;
  v28Want = function () {
    var ok = _v31Want.apply(this, arguments);
    if (ok && !V31.moved) V31.pend = 'none';
    return ok;
  };
}
/* codex28's and codex29's own listeners leave: codex31's one listener
   renders every entry, theirs included. */
try {
  if (typeof window !== 'undefined' && window && typeof window.removeEventListener === 'function') {
    if (typeof v28OnPop === 'function') window.removeEventListener('popstate', v28OnPop);
    if (typeof v29OnPop === 'function') window.removeEventListener('popstate', v29OnPop);
  }
} catch (e) { }

/* Every house deck a codex28 button starts opens the one deck screen; a
   single wine's cards start at once. */
if (typeof startHouseDeck === 'function') {
  startHouseDeck = function (scope) {
    var s = scope || {};
    if (s.itemIds && s.itemIds.length === 1) return v31StartRun('one:' + s.itemIds[0], { push: true });
    var id = 'list';
    if (s.weak) id = 'list-weak';
    else if (typeof s.section === 'string' && s.section) {
      if (s.section === '#bottles') id = 'bottles';
      else if (s.section.indexOf('#bottles|') === 0) id = 'bottles:' + v31Slug(s.section.slice(9));
      else id = 'list:' + v31Slug(s.section);
    }
    v31OpenDeck(id);
    return true;
  };
}
/* The grape cards, from anywhere, are a run on the one card screen. */
if (typeof startFlash === 'function') {
  startFlash = function () { return v31StartRun('grapes', { push: true }); };
}
if (typeof flashGrade === 'function') {
  flashGrade = function (ok) { v31Grade(!!ok); render(); };
}

function v31OpenDeck(id) {
  S._v31deck = id;
  S.view = 'deck';
  V31.pend = 'push';
  render();
  if (typeof v25FocusMain === 'function') v25FocusMain();
}

/* =========== starting what Today's study offers =========== */

function v31StartDue() {
  var t = v31DueToday();
  if (t.a) {
    var cards = v31HouseCards(t.houseIds);
    if (cards.length) return v31StartRun('due', { cards: cards, keepOrder: true, push: true, after: t.b ? 'daily' : null });
  }
  if (t.b && typeof startDaily === 'function') { v31Push(function () { startDaily(); }); return true; }
  return v31StartQuick();
}

/* Five house questions, dealt one at a time by the engine (codex27's kinds
   and its question literal), never the whole round: dealing every question
   the house holds to keep five is seconds of work on a phone. */
function v31DealHouse(kinds, cat, want) {
  var out = [], seen = {};
  var h = v31House();
  var lib = (typeof v27Lib === 'function') ? v27Lib() : null;
  if (!h || !lib || typeof lib.dealQuestion !== 'function' || typeof v27Question !== 'function') return out;
  try { if (typeof v27HasKept === 'function' && !v27HasKept(h)) return out; } catch (e) { return out; }
  var ks = (typeof shuffle === 'function') ? shuffle((kinds || []).slice()) : (kinds || []).slice();
  if (!ks.length) return out;
  var views = {};
  for (var t = 0; t < want * 6 && out.length < want; t++) {
    var k = ks[t % ks.length];
    var house = h;
    if (k.view) { if (!views[k.key]) { try { views[k.key] = k.view(h); } catch (e) { views[k.key] = null; } } house = views[k.key]; }
    if (!house) continue;
    var dq = null;
    try { dq = lib.dealQuestion(house, k.kind, Math.random); } catch (e) { dq = null; }
    if (!dq || seen[dq.itemId + k.key]) continue;
    var q = null;
    try { q = v27Question(dq, k.key, k.label(), cat); } catch (e) { q = null; }
    if (!q) continue;
    seen[dq.itemId + k.key] = 1;
    out.push(q);
  }
  return out;
}

function v31QuickPool() {
  var house = v31DealHouse(typeof V27_CELLAR_KINDS !== 'undefined' ? V27_CELLAR_KINDS : [], typeof V27_CELLAR_SECTION !== 'undefined' ? V27_CELLAR_SECTION : 'Our List', 5);
  if (house.length < 5) house = house.concat(v31DealHouse(typeof V27_PAIR_KINDS !== 'undefined' ? V27_PAIR_KINDS : [], typeof V27_PAIR_SECTION !== 'undefined' ? V27_PAIR_SECTION : 'Pair the menu', 5 - house.length));
  house = house.slice(0, 5);
  var bank = (typeof QUESTIONS !== 'undefined' && QUESTIONS) ? QUESTIONS : [];
  var mc = shuffle(bank.filter(function (q) { return q && !q.sa && !q.mt && !q.sel && q.opts; }));
  var need = 10 - house.length;
  var lvl = mc.slice(0, need);
  if (lvl.length < need) {
    var rest = shuffle(bank.filter(function (q) { return lvl.indexOf(q) < 0; }));
    lvl = lvl.concat(rest.slice(0, need - lvl.length));
  }
  var out = [];
  var i = 0, j = 0;
  while (i < house.length || j < lvl.length) {
    if (i < house.length) out.push(house[i++]);
    if (j < lvl.length) out.push(lvl[j++]);
  }
  return out.slice(0, 10);
}

function v31StartQuick() {
  var pool = v31QuickPool();
  if (!pool.length) { render(); return false; }
  if (typeof stopTimer === 'function') stopTimer();
  S._fin = null; S._v25lt = null;
  S.mode = 'drill'; S.section = V31_QUICK; S._again = v31StartQuick;
  S.pool = pool; S.idx = 0; S.correct = 0; S.results = [];
  if (typeof resetQ === 'function') resetQ();
  S.view = 'quiz';
  if (!V31_RUN[V31.view]) V31.pend = 'push';
  render();
  return true;
}

/* Whether the house can deal its five, asked once per house record: dealing
   every question to count them is far too dear for a line drawn on every render. */
var V31_HQ = { h: null, n: 0 };
function v31HouseQCount() {
  var h = v31House();
  if (!h) return 0;
  var key = String(h.id) + '|' + JSON.stringify(h.lastWrite || h.createdAt || '') + '|' + (Array.isArray(h.wines) ? h.wines.length : 0);
  if (V31_HQ.h === key) return V31_HQ.n;
  var n = v31DealHouse(typeof V27_CELLAR_KINDS !== 'undefined' ? V27_CELLAR_KINDS : [], 'Our List', 1).length;
  V31_HQ.h = key; V31_HQ.n = n;
  return n;
}

function v31QuickLine() {
  var lv = v31Lv().name;
  return v31HouseQCount() ? v31W('quickLine', { level: lv }) : v31W('quickLineLevel', { level: lv });
}

/* The chapter of the first section at this level not yet met. */
function v31NextReading(lv) {
  lv = lv || activeLevel;
  var hit = null;
  try {
    v25Subs(lv).some(function (s) {
      if (s.kind !== 'domain') return false;
      return s.cats.some(function (c) {
        var t = s.tally[c] || { met: 0, total: 0 };
        if (t.total && t.met >= t.total) return false;
        if (!v25HasChapter(c, lv)) return false;
        hit = { cat: c, title: v31ChapterTitle(c, lv) };
        return true;
      });
    });
  } catch (e) { hit = null; }
  return hit;
}
function v31ChapterTitle(cat, lv) {
  if (lv === 'intro' && typeof V25_INTRO_CHAPTERS !== 'undefined') {
    var id = V25_INTRO_CHAPTERS[cat];
    var L = LEVELS[lv];
    var p = null;
    ((L && L.primers) || []).some(function (x) { if (x && x.id === id) { p = x; return true; } return false; });
    return p && p.t ? p.t : cat;
  }
  return cat;
}

function v31FirstWeek() { try { return (typeof v25FirstWeek === 'function') ? v25FirstWeek() : null; } catch (e) { return null; } }

/* =========== the pieces every page is built from =========== */

function v31Head(title, sub) {
  return '<div class="viewhead"><h2 tabindex="-1" class="v31-h">' + v31Esc(title) + '</h2>'
    + (sub ? '<div class="sub">' + v31Esc(sub) + '</div>' : '') + '</div>';
}
function v31Row(act, name, line, attrs) {
  return '<li><button class="v25row" type="button" data-v31="' + act + '"' + (attrs || '') + '>'
    + '<span class="v25row-name">' + v31Esc(name) + '</span>'
    + (line ? '<span class="v25row-line">' + v31Esc(line) + '</span>' : '') + '</button></li>';
}
function v31GoRow(key, name, line, arg) {
  return '<li><button class="v25row" type="button" data-go="' + v31Esc(key) + '"' + (arg != null ? ' data-arg="' + v31Esc(arg) + '"' : '') + '>'
    + '<span class="v25row-name">' + v31Esc(name) + '</span>'
    + (line ? '<span class="v25row-line">' + v31Esc(line) + '</span>' : '') + '</button></li>';
}
/* A registry row (V25_LIBRARY, V25_RECORD, V25_MINE, V27_DRILL_ROWS) by key, drawn only when it shows. */
function v31RegRow(list, key, name, line) {
  var r = null;
  (list || []).some(function (x) { if (x && x.key === key) { r = x; return true; } return false; });
  if (!r) return '';
  try { if (!r.show()) return ''; } catch (e) { return ''; }
  var l = line;
  if (l === undefined) { try { l = r.line(); } catch (e) { l = ''; } }
  if (typeof V25_GO !== 'undefined' && V25_GO && typeof V25_GO[key] !== 'function') V25_GO[key] = r.go;
  return v31GoRow(key, name || r.name, l);
}
function v31Rows(html) { return html ? '<ul class="v25rows v31rows">' + html + '</ul>' : ''; }
function v31Group(title, rows, id) {
  if (!rows) return '';
  return '<section class="v31-group"' + (id ? ' aria-labelledby="' + id + '"' : '') + '><h3 class="secgroup v31-gh"' + (id ? ' id="' + id + '"' : '') + '>' + v31Esc(title) + '</h3>' + v31Rows(rows) + '</section>';
}

/* The scope chip: the level by name and the way to every level, in words. */
function v31Scope(root) {
  var all = v31All()[root];
  var L = v31Lv();
  var open = !!S._v31scopeOpen;
  var html = '<div class="v31scope" role="group" aria-label="' + v31W('scopeLabel') + '">';
  if (all) {
    html += '<span class="v31scope-t">' + v31W('allLevels') + '</span><span class="v31scope-dot" aria-hidden="true"> \u00b7 </span>'
      + '<button type="button" class="v31scope-b" data-v31="scope-one">' + v31Esc(v31W('showOnly', { level: L.name })) + '</button>';
  } else {
    html += '<button type="button" class="v31scope-b v31scope-name" data-v31="scope-name" aria-expanded="' + (open ? 'true' : 'false') + '" aria-label="'
      + v31Esc(v31W('change', { level: L.name })) + '">' + v31Esc(L.name) + '</button><span class="v31scope-dot" aria-hidden="true"> \u00b7 </span>'
      + '<button type="button" class="v31scope-b" data-v31="scope-all">' + v31W('showAll') + '</button>';
  }
  html += '</div>';
  if (open && !all) {
    html += '<div class="v31scope-list" role="group" aria-label="' + v31W('scopeLabel') + '">' + v31Levels().map(function (x) {
      var on = x.key === L.key;
      return '<button type="button" class="v28-chip" data-v31="scope-pick" data-lv="' + x.key + '" aria-pressed="' + (on ? 'true' : 'false') + '">'
        + v31Esc(x.name) + (on ? ' \u00b7 ' + v31W('yourLevel') : '') + '</button>';
    }).join('') + '</div>';
  }
  return html;
}

/* =========== Home =========== */

var _v31HomeHtml = (typeof v25HomeHtml === 'function') ? v25HomeHtml : null;
if (_v31HomeHtml) {
  v25HomeHtml = function () {
    var html = _v31HomeHtml.apply(this, arguments);
    var at = html.indexOf('<nav class="quiet"');
    return at >= 0 ? html.slice(0, at) : html;
  };
}

/* =========== the level page =========== */

function v31TodayRows(lv) {
  var L = v31LvByKey(lv) || v31Lv();
  var t = v31DueToday();
  var rows = v31Row('due', v31W('dueRow'), v31DueLine(t), ' id="v31-due"')
    + v31Row('quick', v31W('quickRow'), v31QuickLine(), ' id="v31-quick"');
  var next = v31NextReading(lv);
  rows += next ? v31Row('chapter', v31W('nextRow'), v31W('nextLine', { title: next.title, level: L.name }), ' data-cat="' + v31Esc(next.cat) + '" id="v31-next"')
    : v31Row('library', v31W('nextRow'), v31W('nextNone', { level: L.name }), ' id="v31-next"');
  var fw = v31FirstWeek();
  if (fw && fw.done < fw.total) rows += v31Row('firstweek', v31W('weekRow'), v31W('weekLine', { done: fw.done, total: fw.total }), ' id="v31-week"');
  return rows;
}

function v31CountLine() {
  var h = v31House();
  var glass = v31Wines().filter(function (w) { return !(typeof v28IsBottle === 'function' && v28IsBottle(w)); });
  var secs = v31Sections();
  var p = v31Prog(v31Ids({ keepMeal: false }));
  var s = v31W('countLine', { house: (h && h.name) || '', n: glass.length, s: secs.length });
  if (!p.studied) return s + ' ' + v31W('studiedNone');
  return s + ' ' + (p.again ? v31W('studied', { x: p.studied, y: p.again }) : v31W('studiedOnly', { x: p.studied }));
}

function v31RestaurantHtml() {
  var html = '<section class="v31-sec" aria-labelledby="v31-rest-h"><h2 class="v31-h2" id="v31-rest-h">' + v31W('restH') + '</h2>';
  try { html += (typeof v25InboxHtml === 'function') ? v25InboxHtml() : ''; } catch (e) { }
  if (!v31HasHouse()) {
    html += '<p class="v31-line">' + v31W('noHouse') + '</p>';
    var setup = v31RegRow(typeof V25_MINE !== 'undefined' ? V25_MINE : [], 'house')
      || v31RegRow(typeof V25_MINE !== 'undefined' ? V25_MINE : [], 'cellar');
    var desk = v31RegRow(typeof V25_MINE !== 'undefined' ? V25_MINE : [], 'menudesk');
    return html + v31Rows(setup + desk) + '</section>';
  }
  var line = '';
  try { line = (typeof V27_HOUSE_ROW !== 'undefined' && V27_HOUSE_ROW) ? V27_HOUSE_ROW.line() : ''; } catch (e) { line = ''; }
  if (line) html += '<p class="v31-line v31-houseline">' + v31Esc(line) + '</p>';
  html += '<p class="v31-line">' + v31Esc(v31CountLine()) + '</p>';
  html += v31Rows(v31Row('studylist', v31W('studyList'), v31W('studyListLine'), ' id="v31-studylist"')
    + v31Row('deck', v31W('cardsList'), v31W('rowLine', { n: v31DeckDef('list').cards.length, m: v31DeckDef('list').learnt }), ' data-deck="list" id="v31-cardslist"')
    + v31Row('drilllist', v31W('drillList'), v31W('drillListLine'), ' id="v31-drilllist"'));
  var secs = v31Sections();
  if (secs.length) {
    html += '<div class="v31chips" role="group" aria-label="' + v31W('secChips') + '">' + secs.map(function (s) {
      return '<button type="button" class="v28-chip" data-v31="sec" data-s="' + v31Esc(s.section) + '">' + v31Esc(s.section) + ' ' + s.count + '</button>';
    }).join('') + '</div>';
  }
  var quiet = '';
  if (typeof V29_MINE_ROW !== 'undefined' && V29_MINE_ROW) {
    try { if (V29_MINE_ROW.show()) quiet += '<button type="button" class="v31quiet" data-v31="fullwine">' + v31W('fullWine') + '</button>'; } catch (e) { }
  }
  if (typeof deskView === 'function') quiet += '<button type="button" class="v31quiet" data-go="menudesk">' + v31W('menuDesk') + '</button>';
  if (typeof V27_HOUSE_ROW !== 'undefined' && V27_HOUSE_ROW) {
    try { if (V27_HOUSE_ROW.show()) quiet += '<button type="button" class="v31quiet" data-go="house">' + v31W('theHouse') + '</button>'; } catch (e) { }
  }
  if (typeof V27_REVIEW_ROW !== 'undefined' && V27_REVIEW_ROW) {
    try { if (V27_REVIEW_ROW.show()) quiet += '<button type="button" class="v31quiet" data-go="housereview">' + v31W('herMarks') + '</button>'; } catch (e) { }
  }
  if (quiet) html += '<div class="v31quietrow">' + quiet + '</div>';
  return html + '</section>';
}

function v31SearchHtml(id) {
  return '<section class="v31-sec" aria-labelledby="v31-search-h"><h2 class="v31-h2" id="v31-search-h">' + v31W('searchH') + '</h2>'
    + '<div class="codexfind v31find"><label class="sr-only" for="' + id + '">' + v31W('searchLabel') + '</label>'
    + '<input id="' + id + '" class="sainput" type="search" autocomplete="off" spellcheck="false" placeholder="' + v31W('searchHint') + '">'
    + '<div id="' + id + '-out" class="v31find-out" aria-live="polite"></div></div></section>';
}

/* The domains and the other subsections, each with its word and figure,
   each section a link to its chapter where the level has one. */
function v31HoldsHtml(lv) {
  var L = v31LvByKey(lv) || v31Lv();
  var subs = [];
  try { subs = v25Subs(lv); } catch (e) { subs = []; }
  var what = v31W('holds', { level: L.name });
  var html = '<details class="secs v31holds"><summary data-what="' + v31Esc(what) + '">' + v31Esc(v31W('show') + what) + '</summary>'
    + '<ol class="subsections v31subs">';
  subs.forEach(function (s) {
    html += '<li class="subsection sub-' + s.kind + '"><h3 class="v31-subh">' + v31Esc(s.name) + '</h3>'
      + '<p class="sub-meta"><span class="sub-n">' + v31Esc(s.line) + '</span><span class="sub-stat">' + v31Esc(s.word) + '</span></p>';
    if (s.kind === 'domain') {
      html += '<ul class="v31secs">' + s.cats.map(function (c) {
        var t = s.tally[c] || { met: 0, total: 0 };
        var meta = (typeof v25MetWord === 'function') ? v25MetWord(t.met, t.total) : '';
        var name = v25HasChapter(c, lv)
          ? '<button type="button" class="v31link" data-v31="chapter" data-cat="' + v31Esc(c) + '">' + v31Esc(c) + '</button>'
          : '<span class="v31plain">' + v31Esc(c) + '</span>';
        return '<li>' + name + '<span class="v31secmeta">' + v31Esc(t.total + ' at this level \u00b7 ' + meta) + '</span></li>';
      }).join('') + '</ul>';
    } else if (s.kind === 'tasting') {
      html += '<p class="v31secmeta"><button type="button" class="v31link" data-go="tastegrid">Study the grid</button></p>';
    }
    html += '</li>';
  });
  return html + '</ol></details>';
}

function v31LevelHtml(lv) {
  lv = lv || activeLevel;
  var L = v31LvByKey(lv);
  if (!L) return '';
  var stat = '';
  try { stat = v25LevelStat(lv).word; } catch (e) { stat = ''; }
  return '<div class="lv-page v31-level">'
    + '<h1 class="lv-h1" tabindex="-1">' + v31Esc(L.name) + '</h1>'
    + '<p class="lv-blurb">' + v31Esc(L.blurb) + '</p>'
    + '<p class="v31-stat">' + v31Esc(stat) + (lv === activeLevel ? ' \u00b7 <span class="v31-here">' + v31W('yourLevel') + '</span>' : '') + '</p>'
    + '<section class="v31-sec" aria-labelledby="v31-today-h"><h2 class="v31-h2" id="v31-today-h">' + v31W('todayH') + '</h2>'
    + v31Rows(v31TodayRows(lv)) + '</section>'
    + v31RestaurantHtml()
    + v31SearchHtml('v31-q')
    + v31HoldsHtml(lv)
    + '</div>';
}

/* The search: our list first, then the producers, the grapes and the
   chapters; a chapter at another level when none at this one matches. */
function v31SearchResults(q) {
  var t = v31Str(q);
  if (t.length < 2) return '';
  var html = '';
  var L = v31Lv();
  var house = [];
  try {
    var tokens = v28Tokens(t);
    house = v28Rows().filter(function (r) { return !r.own && v28Matches(v28Hay(r), tokens); }).slice(0, 8);
  } catch (e) { house = []; }
  if (house.length) {
    html += '<h3 class="secgroup">' + v31W('fromList') + '</h3><ul class="v31hits">' + house.map(function (r) {
      return '<li><button type="button" class="secbtn" data-v31="wine" data-id="' + v31Esc(r.id) + '"><span>' + v31Esc(r.name) + '</span><span class="n">' + v31Esc(r.section) + '</span></button></li>';
    }).join('') + '</ul>';
  }
  var inner = '';
  var f = t.toLowerCase();
  try { f = f.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) { }
  var fold = function (s) { var x = String(s || '').toLowerCase(); try { x = x.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) { } return x; };
  try {
    var res = codexFind(t);
    (res && res.producers ? res.producers.slice(0, 6) : []).forEach(function (r) {
      inner += '<li><button type="button" class="secbtn" data-v31="prod" data-id="' + v31Esc(r.id) + '"><span>' + v31Esc(r.p) + '</span><span class="n">' + v31Esc(r.r || r.country || '') + '</span></button></li>';
    });
  } catch (e) { }
  v31AllGrapes().filter(function (g) { return fold(g.g).indexOf(f) >= 0; }).slice(0, 4).forEach(function (g) {
    inner += '<li><button type="button" class="secbtn" data-v31="grape" data-g="' + v31Esc(g.g) + '"><span>' + v31Esc(g.g) + '</span><span class="n">' + v31W('grapeCards') + '</span></button></li>';
  });
  var chapters = v31ChapterHits(activeLevel, f, fold);
  chapters.forEach(function (c) {
    inner += '<li><button type="button" class="secbtn" data-v31="chapter" data-cat="' + v31Esc(c.cat) + '"><span>' + v31Esc(c.title) + '</span><span class="n">Study Chapters \u00b7 ' + v31Esc(L.name) + '</span></button></li>';
  });
  if (inner) html += '<h3 class="secgroup">' + v31W('inCodex') + '</h3><ul class="v31hits">' + inner + '</ul>';
  if (!chapters.length) {
    var away = [];
    v31Levels().forEach(function (x) {
      if (x.key === activeLevel) return;
      v31ChapterHits(x.key, f, fold).forEach(function (c) { away.push({ lv: x, c: c }); });
    });
    if (away.length) {
      html += '<p class="v31-line">' + v31Esc(v31W('nothingAt', { level: L.name, q: t })) + '</p>'
        + '<h3 class="secgroup">' + v31W('otherLevels') + '</h3><ul class="v31hits">' + away.slice(0, 6).map(function (x) {
          return '<li><button type="button" class="secbtn" data-v31="chapterat" data-lv="' + x.lv.key + '" data-cat="' + v31Esc(x.c.cat) + '"><span>' + v31Esc(x.c.title) + '</span><span class="n">'
            + v31Esc(x.lv.name + '. ' + v31W('movesYou', { level: x.lv.name })) + '</span></button></li>';
        }).join('') + '</ul>';
    }
  }
  return html || '<p class="v31-line">' + v31Esc(v31W('nothing', { q: t })) + '</p>';
}
function v31ChapterHits(lv, f, fold) {
  var out = [];
  try {
    var L = LEVELS[lv];
    (L && L.primers ? L.primers : []).forEach(function (p) {
      if (!p) return;
      if (lv === 'intro') {
        if (fold(p.t).indexOf(f) < 0) return;
        var cat = null;
        Object.keys(V25_INTRO_CHAPTERS).some(function (k) { if (V25_INTRO_CHAPTERS[k] === p.id) { cat = k; return true; } return false; });
        if (cat) out.push({ cat: cat, title: p.t });
      } else if (fold(p.cat).indexOf(f) >= 0) out.push({ cat: p.cat, title: p.cat });
    });
  } catch (e) { }
  return out.slice(0, 4);
}

/* The query lives in S, per box, so every render of the screen, the one a
   Back makes included, draws the same results before the scroll returns. */
function v31Query(id, v) {
  if (!S._v31q || typeof S._v31q !== 'object') S._v31q = {};
  if (typeof v === 'string') S._v31q[id] = v;
  return typeof S._v31q[id] === 'string' ? S._v31q[id] : '';
}
function v31WireSearch(box, id) {
  var inp = box.querySelector('#' + id), out = box.querySelector('#' + id + '-out');
  if (!inp || !out || typeof inp.addEventListener !== 'function') return;
  var q = v31Query(id);
  if (q) { inp.value = q; out.innerHTML = v31SearchResults(q); }
  inp.addEventListener('input', function () { v31Query(id, String(inp.value || '')); out.innerHTML = v31SearchResults(inp.value); });
}

function v31WireDetails(box) {
  Array.prototype.forEach.call(box.querySelectorAll('details.secs'), function (d) {
    var sum = d.querySelector('summary');
    if (!sum || typeof d.addEventListener !== 'function') return;
    d.addEventListener('toggle', function () {
      sum.textContent = (d.open ? v31W('hide') : v31W('show')) + sum.getAttribute('data-what');
    });
  });
}

function v31Build(html, after) {
  var box = (typeof v25Build === 'function') ? v25Build(html) : (function () { var b = document.createElement('div'); b.innerHTML = html; return b; })();
  v31Wire(box);
  if (typeof after === 'function') { try { after(box); } catch (e) { } }
  return box;
}

function v31LevelView() {
  return v31Build(v31LevelHtml(activeLevel), function (box) { v31WireDetails(box); v31WireSearch(box, 'v31-q'); });
}

/* Your first week, the wing's path, on a screen of its own. */
function v31FirstWeekView() {
  var html = '<div class="v25page">' + v31Head(v31W('weekRow'), v31W('weekHead'));
  var fw = v31FirstWeek();
  try {
    if (fw && typeof OOT !== 'undefined' && OOT && OOT.home && typeof OOT.home.firstPath === 'function') {
      var p = (ST && ST.path) || {};
      var done = {};
      FIRST_PATH.forEach(function (s) { if (p[s.id]) done[s.id] = 1; });
      html += OOT.home.firstPath(FIRST_PATH.map(function (s) {
        return { id: s.id, t: s.t, mins: s.mins, act: 'data-go="path" data-arg="' + v31Esc(s.id) + '"' };
      }), done) || '';
    }
  } catch (e) { }
  return v31Build(html + '</div>');
}

/* =========== Flashcards =========== */

function v31FlashcardsHtml() {
  var all = v31All().flashcards;
  var L = v31Lv();
  var t = v31DueToday();
  var html = '<div class="v25page v31-root">' + v31Head(v31W('fcH')) + v31Scope('flashcards');
  html += '<section class="v31-due" aria-labelledby="v31-due-h"><h3 class="secgroup v31-gh" id="v31-due-h">' + v31W('dueRow') + '</h3>'
    + '<p class="v31-line">' + v31Esc(v31DueLine(t)) + '</p>'
    + (t.total ? '<button type="button" class="btn gold v31-go" data-v31="due" id="v31-due-go">' + v31W('startToday') + '</button>' : '') + '</section>';
  if (v31HasHouse()) {
    var rows = v31DeckRow('list');
    v31Sections().forEach(function (s) { rows += v31DeckRow('list:' + v31Slug(s.section), s.section); });
    rows += v31DeckRow('list-weak');
    rows += v31DeckRow('bottles');
    v31FloorSections().forEach(function (s) { rows += v31DeckRow('bottles:' + v31Slug(s.section), s.section); });
    html += v31Group(v31W('fcRest'), rows, 'v31-fc-rest');
  } else {
    html += '<section class="v31-group"><h3 class="secgroup v31-gh">' + v31W('fcRest') + '</h3><p class="v31-line">' + v31W('fcNoHouse') + '</p></section>';
  }
  if (all) {
    html += v31Group(v31W('everyLevel'), v31DeckRow('grapes-all') + v31DeckRow('grapes-all:r') + v31DeckRow('grapes-all:w'), 'v31-fc-lv');
  } else {
    html += v31Group(L.name, v31DeckRow('grapes') + v31DeckRow('grapes:r') + v31DeckRow('grapes:w'), 'v31-fc-lv');
  }
  html += v31Group(v31W('words'), v31DeckRow('menu-words'), 'v31-fc-words');
  if (!all) html += v31Group(v31W('refCards'), v31DeckRow('grapes-all'), 'v31-fc-ref');
  return html + '</div>';
}
function v31FlashcardsView() { return v31Build(v31FlashcardsHtml()); }

/* The deck screen. */
function v31DeckHtml() {
  var def = v31DeckDef(S._v31deck);
  var html = '<div class="v25page v31-deckpage">' + v31Head(def.name || v31W('fcH'));
  if (!def.cards.length) return html + '<p class="v31-line">' + v31W('empty') + '</p></div>';
  html += '<p class="v31-line">' + v31Esc(v31W('deckLine', { n: def.cards.length, m: def.learnt })) + '</p>';
  if (def.kind === 'grape') {
    var dir = (S._v31run && S._v31run.dir) || (S.fc && S.fc.dir) || S._v31dir || 'n2p';
    html += '<h3 class="secgroup v31-gh">' + v31W('ways') + '</h3><div class="v31chips" role="group" aria-label="' + v31W('ways') + '">'
      + '<button type="button" class="v28-chip" data-v31="dir" data-dir="n2p" aria-pressed="' + (dir === 'n2p' ? 'true' : 'false') + '">' + v31W('nameFront') + '</button>'
      + '<button type="button" class="v28-chip" data-v31="dir" data-dir="p2n" aria-pressed="' + (dir === 'p2n' ? 'true' : 'false') + '">' + v31W('profileFront') + '</button></div>';
    var base = S._v31deck.indexOf('grapes-all') === 0 ? 'grapes-all' : 'grapes';
    var cur = S._v31deck.slice(base.length + 1);
    var what = v31W('narrow');
    html += '<details class="secs v31narrow"><summary data-what="' + v31Esc(what) + '">' + v31Esc(v31W('show') + what) + '</summary><div class="v31chips">'
      + [['', 'All'], ['w', 'Whites'], ['r', 'Reds']].map(function (f) {
        return '<button type="button" class="v28-chip" data-v31="narrow" data-deck="' + base + (f[0] ? ':' + f[0] : '') + '" aria-pressed="' + (cur === f[0] ? 'true' : 'false') + '">' + f[1] + '</button>';
      }).join('') + '</div></details>';
  } else if (def.kind === 'house' && /^(list|list:|bottles)/.test(S._v31deck)) {
    var meals = [], meal = '';
    try { meals = v28MealNames(v31House(), v28Rows()); meal = v28Meal(meals); } catch (e) { meals = []; }
    if (meals.length) {
      html += '<details class="secs v31narrow"><summary data-what="' + v31Esc(v31W('narrow')) + '">' + v31Esc(v31W('show') + v31W('narrow')) + '</summary><div class="v31chips" role="group" aria-label="The shift">'
        + [''].concat(meals).map(function (m) {
          return '<button type="button" class="v28-chip" data-v31="meal" data-m="' + v31Esc(m) + '" aria-pressed="' + (m === meal ? 'true' : 'false') + '">' + v31Esc(m || 'All day') + '</button>';
        }).join('') + '</div></details>';
    }
  }
  return html + '<button type="button" class="btn gold v31-go" data-v31="start" id="v31-start">' + v31W('start') + '</button></div>';
}
function v31DeckView() { return v31Build(v31DeckHtml(), v31WireDetails); }

/* The card screen: the position line rides in the back row (one sticky
   strip), then the face, then the controls in one row. */
function v31CardFace(c, run) {
  if (c.kind === 'house') {
    var b = c.c.back || {};
    if (!run.flip) {
      return '<button type="button" class="card v28-front" data-v31="flip" id="v31-face"><span class="v28-eyebrow v28-ink">' + v31W('front') + (c.c.section ? ' \u00b7 ' + v31Esc(c.c.section) : '') + '</span>'
        + '<span class="v28-fname">' + v31Esc(c.c.name) + '</span>'
        + '<span class="v28-fhint">' + v31Esc(typeof v28W === 'function' ? v28W('front') : '') + '</span></button>';
    }
    return '<div class="card v28-back" id="v31-face"><p class="v28-eyebrow v28-ink">' + v31W('answer') + '</p>'
      + '<h3 class="v28-bname" tabindex="-1" id="v31-ans">' + v31Esc(c.c.name) + '</h3>'
      + (b.s10 ? '<p class="v28-eyebrow v28-ink">In ten seconds</p><p class="v28-ten">' + v31Esc(b.s10) + '</p>' : '')
      + (b.price ? '<p><span class="v28-ink-tag">' + v31Esc(b.price) + '</span></p>' : '')
      + (b.pairs || []).map(function (p) { return '<p><b>' + v31Esc(p[0]) + ':</b> ' + v31Esc(p[1]) + '</p>'; }).join('')
      + (b.parts && b.parts.length && typeof v28Dl === 'function' ? '<details class="v28-q"><summary>The five parts</summary>' + v28Dl(b.parts) + '</details>' : '')
      + (b.say ? '<p class="v28-eyebrow v28-ink">Say it</p><p>' + v31Esc(b.say) + '</p>' : '')
      + '</div>';
  }
  if (c.kind === 'word') {
    if (!run.flip) {
      return '<button type="button" class="card v28-front" data-v31="flip" id="v31-face"><span class="v28-eyebrow v28-ink">' + v31W('front') + '</span>'
        + '<span class="v28-fname">' + v31Esc(c.front) + '</span></button>';
    }
    return '<div class="card v28-back" id="v31-face"><p class="v28-eyebrow v28-ink">' + v31W('answer') + '</p>'
      + '<h3 class="v28-bname" tabindex="-1" id="v31-ans">' + v31Esc(c.front) + '</h3><p>' + v31Esc(c.back) + '</p></div>';
  }
  /* a grape: the reference data's own fields, quoted as they stand */
  var g = c.g;
  var colour = g.c === 'w' ? 'White' : 'Red';
  var row = function (tag, k, val) { return '<' + tag + ' class="v31-gl"><b>' + k + ':</b> ' + v31Esc(val) + '</' + tag + '>'; };
  var profile = row('p', 'Structure', g.st) + row('p', 'Fruit', g.fruit) + row('p', 'Non-fruit', g.other);
  var profileSpans = row('span', 'Structure', g.st) + row('span', 'Fruit', g.fruit) + row('span', 'Non-fruit', g.other);
  var idPack = '<p><b>Giveaway:</b> ' + v31Esc(g.tell) + '</p><p><b>Regions:</b> ' + v31Esc(g.regions) + '</p><p><b>Not to be confused with:</b> ' + v31Esc(g.confuse) + '</p>';
  if (!run.flip) {
    if (run.dir === 'p2n') {
      return '<button type="button" class="card v28-front v31-gfront" data-v31="flip" id="v31-face"><span class="v28-eyebrow v28-ink">' + v31W('front') + ' \u00b7 ' + colour + '</span>'
        + '<span class="v31-prof">' + profileSpans + '</span></button>';
    }
    return '<button type="button" class="card v28-front" data-v31="flip" id="v31-face"><span class="v28-eyebrow v28-ink">' + v31W('front') + ' \u00b7 ' + colour + '</span>'
      + '<span class="v28-fname">' + v31Esc(g.g) + '</span></button>';
  }
  return '<div class="card v28-back" id="v31-face"><p class="v28-eyebrow v28-ink">' + v31W('answer') + ' \u00b7 ' + colour + '</p>'
    + '<h3 class="v28-bname" tabindex="-1" id="v31-ans">' + v31Esc(g.g) + '</h3>'
    + (run.dir === 'p2n' ? '' : profile) + idPack + '</div>';
}

function v31PosText() {
  var r = S._v31run;
  if (!r || !r.deck.length) return '';
  return v31W('cardPos', { i: Math.min(r.total, r.total - r.deck.length + 1), n: r.total, deck: r.label });
}

function v31CardHtml() {
  var r = S._v31run;
  if (!r || !r.v31) return '<div class="v25page"><p class="v31-line">' + v31W('empty') + '</p></div>';
  var html = '<div class="v28 v28-deck v31card">';
  var c = v31RunCard();
  if (!c) {
    html += '<div class="viewhead v28-head"><h2 class="v31-h" tabindex="-1">' + v31W('deckDone') + '</h2></div>'
      + '<div class="card v28-end"><p>' + v31Esc(r.again ? v31W('doneLine', { g: r.done, a: r.again }) : v31W('doneLineAll', { g: r.done })) + '</p></div><div class="v28-btnrow v31-acts">';
    var missed = r.missed.map(function (i) { return r.cards[i]; }).filter(Boolean);
    if (missed.length) html += '<button type="button" class="btn gold" data-v31="runmisses">' + v31W('studyMisses') + '</button>';
    var dueN = 0;
    if (r.after === 'daily') { try { dueN = v31DueToday().b; } catch (e) { dueN = 0; } }
    if (dueN) html += '<button type="button" class="btn ' + (missed.length ? 'ghost' : 'gold') + '" data-v31="daily">' + v31Esc(v31W('nowDue', { n: dueN })) + '</button>';
    else html += '<button type="button" class="btn ghost" data-v31="another">' + v31W('anotherDeck') + '</button>';
    return html + '</div></div>';
  }
  html += v31CardFace(c, r);
  if (!r.flip) html += '<div class="v28-grade v31-ctrl"><button type="button" class="btn gold" data-v31="flip">' + v31W('flip') + '</button></div>';
  else {
    html += '<div class="v28-grade v31-ctrl"><button type="button" class="btn gold" data-v31="got">' + v31W('got') + '</button>'
      + '<button type="button" class="btn ghost" data-v31="again">' + v31W('again') + '</button></div>';
  }
  return html + '</div>';
}
function v31CardView() { return v31Build(v31CardHtml()); }

/* The card to the top of the screen, under the sticky back row, after the
   first card and every flip and grade. */
function v31ShowCard() {
  try {
    var row = document.querySelector('.v31back');
    if (!row || typeof row.getBoundingClientRect !== 'function') return;
    var top = row.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0);
    window.scrollTo(0, Math.max(0, top));
  } catch (e) { }
}

/* =========== Quizzes =========== */

function v31DomainRows(lv, other) {
  var L = v31LvByKey(lv);
  var out = '';
  var doms = [];
  try { doms = v25Domains(lv); } catch (e) { doms = []; }
  var tally = {};
  try { tally = v25CatTally(lv); } catch (e) { tally = {}; }
  doms.forEach(function (d) {
    var n = 0;
    d[1].forEach(function (c) { n += (tally[c] || { total: 0 }).total; });
    var line = v31W('domainLine', { n: n, s: d[1].length === 1 ? '1 section' : d[1].length + ' sections' });
    if (other) line += ' ' + v31W('movesYou', { level: L.name });
    out += '<li class="v31dom"><button class="v25row" type="button" data-v31="lvgo" data-lv="' + lv + '" data-k="domexam" data-arg="' + v31Esc(d[0]) + '">'
      + '<span class="v25row-name">' + v31Esc(d[0]) + '</span><span class="v25row-line">' + v31Esc(line) + '</span></button>';
    if (!other) {
      var what = d[1].length === 1 ? 'the section' : 'the ' + v25Words(d[1].length) + ' sections';
      out += '<details class="secs"><summary data-what="' + v31Esc(what) + '">' + v31Esc(v31W('show') + what) + '</summary><ol class="sections">'
        + d[1].map(function (c) {
          var t = tally[c] || { met: 0, total: 0 };
          return '<li class="section"><span class="sec-name">' + v31Esc(c) + '</span>'
            + '<span class="sec-meta">' + v31Esc(t.total + ' at this level \u00b7 ' + v25MetWord(t.met, t.total)) + '</span>'
            + '<span class="sec-trains">' + v25Train('drill', c, 'Drill', 'Drill ' + c) + v25Train('secexam', c, 'Exam', 'Exam, ' + c) + '</span></li>';
        }).join('') + '</ol></details>';
    }
    out += '</li>';
  });
  return out;
}

function v31TestRow(lv, other) {
  var L = v31LvByKey(lv);
  var line = '';
  try { line = v25TestLine(lv); } catch (e) { line = ''; }
  if (other) line += ' ' + v31W('movesYou', { level: L.name });
  return '<li><button class="v25row v31test" type="button" data-v31="lvgo" data-lv="' + lv + '" data-k="leveltest">'
    + '<span class="v25row-name">' + v31Esc('The ' + L.name + ' test') + '</span><span class="v25row-line">' + v31Esc(line) + '</span></button></li>';
}

function v31QuizzesHtml() {
  var all = v31All().quizzes;
  var L = v31Lv();
  var html = '<div class="v25page v31-root">' + v31Head(v31W('qzH')) + v31Scope('quizzes');
  html += '<section class="v31-due" aria-labelledby="v31-quick-h"><h3 class="secgroup v31-gh" id="v31-quick-h">' + v31W('quickRow') + '</h3>'
    + '<p class="v31-line">' + v31Esc(v31QuickLine()) + '</p>'
    + '<button type="button" class="btn gold v31-go" data-v31="quick" id="v31-quick-go">' + v31W('startQuick') + '</button></section>';
  var M = typeof V25_MINE !== 'undefined' ? V25_MINE : [];
  var D = typeof V27_DRILL_ROWS !== 'undefined' ? V27_DRILL_ROWS : [];
  if (v31HasHouse()) {
    var rest = v31Row('drilllist', v31W('drillList'), v31W('drillListLine'))
      + v31RegRow(M, 'cellarrecite', v31W('recite'))
      + v31RegRow(D, 'houserecite') + v31RegRow(D, 'housepair') + v31RegRow(D, 'housesay') + v31RegRow(D, 'houseguest')
      + v31RegRow(M, 'cellardrill', v31W('cellarDrill'));
    html += v31Group(v31W('fcRest'), rest, 'v31-qz-rest');
  } else {
    var mine = v31RegRow(M, 'cellardrill', v31W('cellarDrill')) + v31RegRow(M, 'cellarrecite', v31W('recite'));
    html += v31Group(v31W('fcRest'), mine, 'v31-qz-rest');
  }
  html += v31Group(L.name, v31DomainRows(activeLevel, false), 'v31-qz-lv');
  var paper = '';
  ['weak', 'endless', 'lightning', 'sudden'].forEach(function (k) {
    paper += v31GoRow(k, V25_TRAIN[k].label, v31PaperLine(k));
  });
  var nMiss = (typeof MISS !== 'undefined' && MISS) ? MISS.length : 0;
  if (nMiss) paper += v31GoRow('review', 'Review misses', nMiss + ' to retire by answering right');
  paper += v31RegRow(typeof V25_RECORD !== 'undefined' ? V25_RECORD : [], 'flagged');
  if (typeof FLOOR !== 'undefined' && FLOOR && FLOOR.length) paper += v31GoRow('floor', 'The Floor', 'a situation on the floor, and what a master does');
  if (typeof PAIRS !== 'undefined' && PAIRS && PAIRS.length) paper += v31GoRow('pairs', v31W('classicPairs'), 'a dish is set down, you choose the wine');
  html += v31Group(v31W('wholePaper'), paper, 'v31-qz-paper');
  var hands = '';
  var grapes = [];
  try { grapes = v25Grapes(activeLevel); } catch (e) { grapes = []; }
  if (grapes.length) {
    hands += v31GoRow('grid', 'The Blind Grid', 'a glass is poured blind, you call its structure and the grape');
    hands += v31GoRow('flight', 'Blind flight', 'a flight of glasses, the deductive grid out loud');
  }
  hands += v31GoRow('service', 'The Service Ritual', 'the steps of service, rehearsed until they are habit');
  html += v31Group(v31W('handsOn'), hands, 'v31-qz-hands');
  if (all) {
    v31Levels().forEach(function (x) {
      if (x.key === activeLevel) return;
      html += v31Group(x.name, v31DomainRows(x.key, true) + v31TestRow(x.key, true), 'v31-qz-' + x.key);
    });
  }
  html += '<section class="v31-group v31-testgroup">' + v31Rows(v31TestRow(activeLevel, false)) + '</section>';
  return html + '</div>';
}
function v31PaperLine(k) {
  return {
    weak: 'your weakest questions at this level first',
    endless: 'the whole paper, untimed, reshuffled forever',
    lightning: 'quick fire against the clock',
    sudden: 'the round ends at the first miss'
  }[k] || '';
}
function v31QuizzesView() { return v31Build(v31QuizzesHtml(), v31WireDetails); }

/* =========== Library =========== */

function v31LibraryHtml() {
  var all = v31All().library;
  var L = v31Lv();
  var lib = typeof V25_LIBRARY !== 'undefined' ? V25_LIBRARY : [];
  var html = '<div class="v25page v31-root">' + v31Head(v31W('libH')) + v31Scope('library')
    + '<p class="v31-line">' + v31Esc(all ? v31W('libLineAll') : v31W('libLine', { level: L.name })) + '</p>'
    + '<div class="codexfind"><input id="cf-in" class="sainput" autocomplete="off" spellcheck="false"'
    + ' aria-label="Find a producer, a wine, or a bottle on our list" placeholder="Find a producer, a wine, or a bottle on our list"><div id="cf-out"></div></div>';
  var rows = '';
  if (typeof V29_MINE_ROW !== 'undefined' && V29_MINE_ROW) {
    try { if (V29_MINE_ROW.show()) rows += v31Row('fullwine', v31W('fullWine'), V29_MINE_ROW.line()); } catch (e) { }
  }
  if (all) {
    v31Levels().forEach(function (x) {
      var n = 0;
      try { n = (LEVELS[x.key].primers || []).length; } catch (e) { n = 0; }
      var line = n + ' chapters at ' + x.name + (x.key === activeLevel ? '' : '. ' + v31W('movesYou', { level: x.name }));
      rows += v31Row('chaptersat', v31W('chaptersAt', { level: x.name }), line, ' data-lv="' + x.key + '"');
    });
  } else rows += v31RegRow(lib, 'primers');
  rows += v31RegRow(lib, 'compendium') + v31RegRow(lib, 'ency') + v31RegRow(lib, 'producers') + v31RegRow(lib, 'worldmap') + v31RegRow(lib, 'terroir');
  if (typeof tasteGridView === 'function') rows += v31GoRow('tastegrid', 'Study the grid', 'the deductive grid, step by step, to read before you taste');
  rows += v31RegRow(lib, 'videos');
  var h = v31House();
  if (h && typeof v30Groups === 'function') {
    var n2 = 0;
    try { n2 = v30Groups(h).reduce(function (t, g) { return t + g.videos.length; }, 0); } catch (e) { n2 = 0; }
    if (n2) rows += v31Row('housevideos', v31W('videosH'), n2 + ' videos \u00b7 ' + v31W('videosLine'));
  }
  return html + v31Rows(rows) + '</div>';
}
function v31LibraryView() {
  return v31Build(v31LibraryHtml(), function (box) {
    if (typeof v25WireFind !== 'function') return;
    v25WireFind(box);
    /* codex25's box, its query kept in S the same way as the level page's */
    var inp = box.querySelector('#cf-in');
    if (!inp || typeof inp.oninput !== 'function') return;
    var draw = inp.oninput;
    inp.oninput = function () { v31Query('cf-in', String(inp.value || '')); return draw.apply(this, arguments); };
    var q = v31Query('cf-in');
    if (q) { inp.value = q; draw.call(inp); }
  });
}

function v31VideosView() {
  var h = v31House();
  var body = '';
  try { body = (h && typeof v30VideosHtml === 'function') ? v30VideosHtml(h) : ''; } catch (e) { body = ''; }
  var html = '<div class="v25page v28">' + v31Head(v31W('videosH'), v31W('videosLine'))
    + (body || '<p class="v31-line">' + v31W('videosNone') + '</p>') + '</div>';
  var box = v31Build(html);
  /* a wine a video teaches opens its card, a push like any other */
  if (typeof box.addEventListener === 'function') {
    box.addEventListener('click', function (e) {
      var t = e && e.target;
      var n = t && typeof t.closest === 'function' ? t.closest('[data-v28="open"]') : null;
      if (!n) return;
      if (typeof e.preventDefault === 'function') e.preventDefault();
      v31OpenWine(n.getAttribute('data-id'));
    });
  }
  return box;
}

/* =========== More =========== */

function v31MoreHtml() {
  var R = typeof V25_RECORD !== 'undefined' ? V25_RECORD : [];
  var pass = (typeof v25Pass === 'function') ? v25Pass() : { strip: '', settings: '' };
  var html = '<div class="v25page v31-root">' + v31Head(v31W('moreH'));
  html += v31Group(v31W('recordG'), v31RegRow(R, 'dash') + v31RegRow(R, 'hall') + v31RegRow(R, 'exams') + v31RegRow(R, 'plan') + v31RegRow(R, 'disputes'), 'v31-more-rec');
  var backup = v31RegRow(R, 'sync');
  if (backup || pass.strip || pass.settings) {
    html += '<section class="v31-group" aria-labelledby="v31-more-bak"><h3 class="secgroup v31-gh" id="v31-more-bak">' + v31W('backupG') + '</h3>'
      + (pass.strip || '') + v31Rows(backup) + (pass.settings || '') + '</section>';
  }
  html += v31Group(v31W('maitreG'), v31RegRow(R, 'maitre'), 'v31-more-mai');
  var who = (typeof v25Who === 'function') ? v25Who() : '';
  if (who) html += '<section class="v31-group" aria-labelledby="v31-more-set"><h3 class="secgroup v31-gh" id="v31-more-set">' + v31W('settingsG') + '</h3>'
    + '<p class="v31-line">' + v31W('whoRow') + '</p>' + who + '</section>';
  html += '<section class="v31-group" aria-labelledby="v31-more-about"><h3 class="secgroup v31-gh" id="v31-more-about">' + v31W('aboutG') + '</h3>'
    + '<p class="v31-line">' + v31Esc(typeof V25_NONAFFIL !== 'undefined' ? V25_NONAFFIL : '') + '</p></section>';
  return html + '</div>';
}
function v31MoreView() { return v31Build(v31MoreHtml(), function (box) { if (typeof v25BindPass === 'function') v25BindPass(box); }); }

/* =========== the acts =========== */

function v31OpenWine(id) {
  if (!id || typeof v28State !== 'function') return;
  var st = v28State();
  S._v28edit = false;
  st.q = ''; st.sec = '';
  S.view = 'cellar';
  if (typeof v28Open === 'function') v28Open(id, false);
}

function v31Act(act, node) {
  var get = function (k) { return node && typeof node.getAttribute === 'function' ? (node.getAttribute(k) || '') : ''; };
  var all = v31All();
  switch (act) {
    case 'deck': v31OpenDeck(get('data-deck')); return;
    case 'start': v31StartRun(S._v31deck, { push: true }); return;
    case 'due': v31StartDue(); return;
    case 'quick': v31StartQuick(); return;
    case 'flip': {
      var r = S._v31run;
      if (r && r.deck.length) { r.flip = !r.flip; render(); v31ShowCard(); try { var a = document.getElementById(r.flip ? 'v31-ans' : 'v31-face'); if (a) a.focus({ preventScroll: true }); } catch (e) { } }
      return;
    }
    case 'got': v31Grade(true); render(); v31ShowCard(); return;
    case 'again': v31Grade(false); render(); v31ShowCard(); return;
    case 'runmisses': {
      var run = S._v31run;
      if (!run) return;
      var cards = run.missed.map(function (i) { return run.cards[i]; }).filter(Boolean);
      if (run.kind === 'house') {
        V31_MISSES = cards.map(function (c) { return c.id; });
        v31StartRun('misses', { push: false });
      } else v31StartRun(run.deckId, { cards: cards, push: false });
      return;
    }
    case 'daily': if (typeof startDaily === 'function') startDaily(); return;
    case 'another': v31Go({ view: 'flashcards' }, 'push'); return;
    case 'dir': {
      S._v31dir = get('data-dir');
      if (S._v31run) S._v31run.dir = S._v31dir;
      if (S.fc) S.fc.dir = S._v31dir;
      V31.pend = 'replace'; render(); return;
    }
    case 'narrow': S._v31deck = get('data-deck'); V31.pend = 'replace'; render(); return;
    case 'meal': if (typeof v28SetMeal === 'function') v28SetMeal(get('data-m')); V31.pend = 'replace'; render(); return;
    case 'scope-name': S._v31scopeOpen = !S._v31scopeOpen; V31.pend = 'replace'; render(); v31FocusSel('.v31scope-name'); return;
    case 'scope-all': case 'scope-one': {
      var root = S.view;
      if (all.hasOwnProperty(root)) all[root] = act === 'scope-all';
      S._v31scopeOpen = false;
      V31.pend = 'replace'; render(); v31FocusSel('.v31scope-b'); return;
    }
    case 'scope-pick': {
      var lv = get('data-lv');
      /* codex7's applyLevel sends S.view home; the choice refilters the
         screen it was made on, in place (design 2.4 and 5.5) */
      var keepView = S.view, keepDeck = S._v31deck, keepAll = Object.assign({}, all);
      S._v31scopeOpen = false;
      if (lv && lv !== activeLevel && typeof applyLevel === 'function') applyLevel(lv, true);
      if (activeLevel === lv && typeof v25Choose === 'function') v25Choose();
      S.view = keepView; S._v31deck = keepDeck; Object.assign(v31All(), keepAll);
      S._v31scopeOpen = false;
      V31.pend = 'replace'; render(); v31FocusSel('.v31scope-name'); return;
    }
    case 'sec': {
      var stc = v28State();
      S._v28edit = false; stc.open = null; stc.q = ''; stc.sec = get('data-s'); stc.focus = 'restore'; stc.y = 0;
      S.view = 'cellar'; V31.pend = 'push'; render(); return;
    }
    case 'studylist': {
      var sts = v28State();
      S._v28edit = false; sts.open = null; sts.q = ''; sts.sec = ''; sts.y = 0;
      S.view = 'cellar'; V31.pend = 'push'; render(); return;
    }
    case 'drilllist':
      if (typeof startHouseSectionDrill === 'function') v31Push(function () { startHouseSectionDrill(''); });
      return;
    case 'fullwine': if (typeof v29Open === 'function') v29Open('level'); return;
    case 'wine': v31OpenWine(get('data-id')); return;
    case 'chapter': if (typeof v25OpenChapter === 'function') v31Push(function () { v25OpenChapter(get('data-cat')); }); return;
    case 'chapterat': {
      var l2 = get('data-lv');
      if (l2 && l2 !== activeLevel) applyLevel(l2, true);
      if (typeof v25OpenChapter === 'function') v31Push(function () { v25OpenChapter(get('data-cat')); });
      return;
    }
    case 'chaptersat': {
      var l3 = get('data-lv');
      if (l3 && l3 !== activeLevel) applyLevel(l3, true);
      S.view = 'primers'; V31.pend = 'push'; render(); return;
    }
    case 'grape': v31StartRun('grapes-all', { push: true, first: get('data-g') }); return;
    case 'prod': {
      var id = get('data-id'), ci = 0;
      try { var rec = prodById(id); if (rec) prodGroups().forEach(function (g, i) { if (g.rows.indexOf(rec) >= 0) ci = i; }); } catch (e) { }
      S._prod = { c: ci, id: id }; S.view = 'producers'; V31.pend = 'push'; render(); return;
    }
    case 'lvgo': {
      var l4 = get('data-lv');
      if (l4 && l4 !== activeLevel) applyLevel(l4, true);
      if (typeof v25Go === 'function') v31Push(function () { v25Go(get('data-k'), get('data-arg') || null); });
      return;
    }
    case 'library': v31Go({ view: 'library' }, 'push'); return;
    case 'firstweek': v31Go({ view: 'firstweek' }, 'push'); return;
    case 'housevideos': v31Go({ view: 'housevideos' }, 'push'); return;
    case 'back': v31Back(); return;
    default: return;
  }
}

function v31FocusSel(sel) {
  try { var n = document.querySelector(sel); if (n && typeof n.focus === 'function') n.focus({ preventScroll: true }); } catch (e) { }
}

function v31Wire(box) {
  if (!box || typeof box.addEventListener !== 'function') return;
  box.addEventListener('click', function (e) {
    var t = e && e.target;
    var node = t && typeof t.closest === 'function' ? t.closest('[data-v31]') : null;
    if (!node || node.disabled) return;
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
    try { v31Remember(node); } catch (err) { }
    v31Act(node.getAttribute('data-v31'), node);
  }, true);
}

/* =========== the results: what you missed, each with its card =========== */

function v31MissLink(q) {
  if (!q) return null;
  var m = /^h-(w-[a-z0-9]{8})-/.exec(q.id || '');
  if (m && v31Wine(m[1]) && v31HouseCards([m[1]]).length) return { kind: 'card', id: m[1] };
  try { if (q.cat && v25HasChapter(q.cat)) return { kind: 'chapter', cat: q.cat }; } catch (e) { }
  return null;
}

function v31DecorateResults(v) {
  if (!v || typeof v.querySelectorAll !== 'function') return v;
  var misses = (S.results || []).filter(function (r) { return r && !r.ok; });
  Array.prototype.forEach.call(v.querySelectorAll('.viewhead h2'), function (h) {
    if (/^Review misses/.test(h.textContent || '')) h.textContent = v31W('missH');
  });
  var list = v.querySelector('.misslist');
  if (list) {
    if (!misses.length) list.innerHTML = '<div class="miss"><p class="lt-none">' + v31W('missNone') + '</p></div>';
    var nodes = list.querySelectorAll('.miss');
    var cardIds = [];
    misses.forEach(function (r, i) {
      var n = nodes[i];
      if (!n) return;
      var ma = n.querySelector('.ma');
      if (ma && ma.textContent.indexOf(v31W('missAns')) !== 0) ma.insertBefore(document.createTextNode(v31W('missAns')), ma.firstChild);
      var link = v31MissLink(r.q);
      if (!link) return;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn small ghost v31misslink';
      if (link.kind === 'card') {
        if (cardIds.indexOf(link.id) < 0) cardIds.push(link.id);
        b.textContent = v31W('studyCard');
        b.setAttribute('data-v31', 'wine'); b.setAttribute('data-id', link.id);
      } else {
        b.textContent = v31W('readChapter');
        b.setAttribute('data-v31', 'chapter'); b.setAttribute('data-cat', link.cat);
      }
      b.id = 'v31-miss-' + i;
      n.appendChild(b);
    });
    var row = v.querySelector('.centerrow');
    if (row && cardIds.length) {
      var sm = document.createElement('button');
      sm.type = 'button'; sm.className = 'btn gold'; sm.id = 'v31-studymisses';
      sm.textContent = v31W('studyMisses');
      sm.onclick = function () { V31_MISSES = cardIds.slice(); v31StartRun('misses', { push: true }); };
      row.insertBefore(sm, row.firstChild);
    }
  }
  if (S.section === V31_QUICK) {
    var again = v.querySelector('#again');
    if (again) { again.textContent = v31W('dealAnother'); again.onclick = function () { v31StartQuick(); }; }
  }
  v31Wire(v);
  return v;
}

var _v31ResultsView = (typeof resultsView === 'function') ? resultsView : null;
if (_v31ResultsView) {
  resultsView = function () {
    var v = _v31ResultsView.apply(this, arguments);
    try { v31DecorateResults(v); } catch (e) { }
    return v;
  };
}

/* The level test's report: each theory miss gains its chapter. */
var _v31FinalsReportView = (typeof finalsReportView === 'function') ? finalsReportView : null;
if (_v31FinalsReportView) {
  finalsReportView = function () {
    var v = _v31FinalsReportView.apply(this, arguments);
    try {
      var t = S._v25lt;
      var group = v && v.querySelector ? v.querySelector('.lt-group') : null;
      if (t && group) {
        var nodes = group.querySelectorAll('.miss');
        t.theory.forEach(function (m, i) {
          var link = v31MissLink(m.q);
          if (!link || !nodes[i]) return;
          var b = document.createElement('button');
          b.type = 'button'; b.className = 'btn small ghost v31misslink';
          if (link.kind === 'card') { b.textContent = v31W('studyCard'); b.setAttribute('data-v31', 'wine'); b.setAttribute('data-id', link.id); }
          else { b.textContent = v31W('readChapter'); b.setAttribute('data-v31', 'chapter'); b.setAttribute('data-cat', link.cat); }
          nodes[i].appendChild(b);
        });
      }
      v31Wire(v);
    } catch (e) { }
    return v;
  };
}

/* Our List's card: its own way back goes, the Back control is the one. */
if (typeof v28CardHtml === 'function') {
  var _v31CardHtml = v28CardHtml;
  v28CardHtml = function (id) {
    var html = _v31CardHtml(id);
    return String(html || '').replace(/<button type="button" class="btn small ghost" data-v28="back">[^<]*<\/button>/, '');
  };
}

/* =========== the nav =========== */

V25_NAV = [['home', 'Home'], ['flashcards', 'Flashcards'], ['quizzes', 'Quizzes'], ['library', 'Library'], ['more', 'More']];
V25_HUB = { home: 'home', level: 'home', today: 'home', flashcards: 'flashcards', deck: 'flashcards', quizzes: 'quizzes', library: 'library', more: 'more', mine: 'more', record: 'more' };
V25_UNDER = {};
Object.keys(V31_OWNER).forEach(function (k) { V25_UNDER[k] = V31_OWNER[k]; });

v25NavWord = function () { return V31_OWNER[S.view] || 'home'; };

function v31Pill() {
  var n = 0;
  try { n = v31DueToday().total; } catch (e) { n = 0; }
  return n ? ' <span class="v31pill">' + n + '<span class="sr-only">' + v31W('due') + '</span></span>' : '';
}

v25NavHtml = function () {
  var cur = v25NavWord();
  return '<nav class="appnav v31nav" aria-label="The Codex">' + V25_NAV.map(function (w) {
    var quiet = w[0] === 'more';
    return '<button type="button" class="navword' + (quiet ? ' v31more' : '') + '" id="nav-' + w[0] + '" data-nav="' + w[0] + '"'
      + (cur === w[0] ? ' aria-current="page"' : '') + '>' + w[1] + (w[0] === 'flashcards' ? v31Pill() : '') + '</button>';
  }).join('') + '</nav>';
};

v25Nav = function (word) {
  var root = { home: 'home', flashcards: 'flashcards', quizzes: 'quizzes', library: 'library', more: 'more', levels: 'level', mine: 'more' }[word] || 'home';
  if (S.view === root || (root === 'more' && S.view === 'mine')) {
    try { window.scrollTo(0, 0); } catch (e) { }
    return;
  }
  if (typeof v25Leave === 'function' && !v25Leave()) return;
  S._v31scopeOpen = false;
  v31Go({ view: root, all: root !== 'home' && root !== 'more' ? !!v31All()[root] : false }, 'push');
};

/* =========== the views =========== */

V25_VIEWS.level = v31LevelView;
V25_VIEWS.today = v31LevelView;
V25_VIEWS.mine = v31MoreView;
V25_VIEWS.more = v31MoreView;
V25_VIEWS.flashcards = v31FlashcardsView;
V25_VIEWS.deck = v31DeckView;
V25_VIEWS.quizzes = v31QuizzesView;
V25_VIEWS.library = v31LibraryView;
V25_VIEWS.housedeck = v31CardView;
V25_VIEWS.flash = v31CardView;
V25_VIEWS.housevideos = v31VideosView;
V25_VIEWS.firstweek = v31FirstWeekView;

if (typeof v25MainName === 'function') {
  var _v31MainName = v25MainName;
  v25MainName = function () {
    var v = S.view;
    if (v === 'flashcards') return v31W('fcH');
    if (v === 'quizzes') return v31W('qzH');
    if (v === 'library') return v31W('libH');
    if (v === 'more' || v === 'mine') return v31W('moreH');
    if (v === 'deck') return v31DeckDef(S._v31deck).name || v31W('fcH');
    if (v === 'housedeck' || v === 'flash') return (S._v31run && S._v31run.label) || v31W('fcH');
    if (v === 'housevideos') return v31W('videosH');
    if (v === 'firstweek') return v31W('weekRow');
    if (v === 'level' || v === 'today') return v31Lv().name;
    return _v31MainName.apply(this, arguments);
  };
}

/* =========== the Back row, drawn on every screen but home =========== */

var V31_OLD_BACK = /^(Back|Back to\b.*|All countries)$/;

function v31BackRow(main) {
  var row = document.createElement('div');
  row.className = 'v31back';
  var b = document.createElement('button');
  b.type = 'button'; b.className = 'btn ghost'; b.id = 'v31-back';
  b.textContent = v31W('back');
  b.onclick = function () { v31Back(); };
  row.appendChild(b);
  if (S.view === 'housedeck' || S.view === 'flash') {
    var pos = v31PosText();
    if (pos) {
      var s = document.createElement('span');
      s.className = 'v31pos'; s.setAttribute('role', 'status');
      s.textContent = pos;
      row.appendChild(s);
    }
  }
  if (V31.from && V31.d === 0) {
    var p = document.createElement('p');
    p.className = 'v31from';
    p.textContent = v31W('from', { app: V31.from });
    row.appendChild(p);
  }
  var sentinel = document.createElement('div');
  sentinel.className = 'v31sentinel';
  sentinel.setAttribute('aria-hidden', 'true');
  main.insertBefore(row, main.firstChild);
  main.insertBefore(sentinel, row);
  try {
    if (typeof IntersectionObserver === 'function') {
      if (V31.io) V31.io.disconnect();
      V31.io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) { row.classList.toggle('is-stuck', !en.isIntersecting); });
      }, { threshold: 0 });
      V31.io.observe(sentinel);
    }
  } catch (e) { }
}

/* Every older way back on the screen leaves: one Back per screen. */
function v31StripOldBacks(main) {
  Array.prototype.forEach.call(main.querySelectorAll('button, a'), function (b) {
    if (b.id === 'v31-back') return;
    var t = String(b.textContent || '').replace(/\s+/g, ' ').trim();
    var old = V31_OLD_BACK.test(t) || b.getAttribute('data-v28') === 'back' || b.getAttribute('data-v28') === 'deckclose'
      || b.getAttribute('data-go') === 'backlevel' || b.id === 'hr-back' || b.id === 'hs-back' || b.id === 'hg-back'
      || b.id === 'cw-back' || b.id === 'pr-back' || b.id === 'pr-up' || (b.className && /\bfnhome\b/.test(String(b.className)));
    if (old && b.parentNode) b.parentNode.removeChild(b);
  });
}

function v31Decorate() {
  var main = document.getElementById('view');
  if (!main || typeof main.insertBefore !== 'function') return;
  document.body.setAttribute('data-codex-page', S.view || 'home');
  if (S.view === 'home') return;
  v31StripOldBacks(main);
  v31BackRow(main);
}

/* =========== the render, outermost =========== */

function v31Normalise() {
  if (S.view === 'today') S.view = 'level';
  if (S.view === 'mine') S.view = 'more';
  if (V31.wantSec && S.view === 'cellar' && v31HasHouse()) {
    var w = V31.wantSec;
    V31.wantSec = null;
    var name = v31SecBySlug(w.slug, w.floor);
    if (name) v28State().sec = w.floor ? '#bottles|' + name : name;
  }
}

var _v31Render = render;
render = function () {
  if (V31.rendering) return _v31Render.apply(this, arguments);
  V31.rendering = true;
  V31.renders++;
  var prevView = V31.view;
  var out;
  try {
    if (V31.booted && !V31.popping) v31SaveScroll();
    V31.popping = false;
    v31Normalise();
    out = _v31Render.apply(this, arguments);
  } finally { V31.rendering = false; }
  try { v31Decorate(); } catch (e) { }
  try { v31After(prevView); } catch (e) { }
  return out;
};

/* Escape closes the scope chip's list and never navigates. */
function v31Key(e) {
  if (!e || e.key !== 'Escape' || !S._v31scopeOpen) return;
  S._v31scopeOpen = false;
  V31.pend = 'replace';
  render();
  v31FocusSel('.v31scope-name');
}

/* =========== at load: the address, the depth, the room it came from =========== */

(function () {
  try { if (typeof history !== 'undefined' && history && 'scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) { }
  try {
    var st = v31CurState();
    var href = location.href;
    if (typeof st.ootd === 'number') V31.d = st.ootd;
    else {
      var m = v31SessGet(V31_NAV_KEY);
      V31.d = (m && m.href === href && typeof m.d === 'number') ? m.d : 0;
    }
    if (typeof st.run === 'number') V31.liveRun = -1;
    /* run numbers begin past any an earlier load of this tab gave out, so an
       entry left by that load never names a run of this one */
    V31.run = Math.max(V31.run, typeof st.run === 'number' ? st.run : 0, Date.now());
  } catch (e) { V31.d = 0; }
  try {
    var hash = (typeof location !== 'undefined' && location && typeof location.hash === 'string') ? location.hash : '';
    if (hash.indexOf('#/') === 0) {
      var r = v31Parse(hash);
      if (r) v31Apply(r, v31CurState());
    }
  } catch (e) { }
  try {
    var ref = (typeof document !== 'undefined' && document && typeof document.referrer === 'string') ? document.referrer : '';
    if (ref && V31.d === 0) {
      var u = new URL(ref);
      var here = location.pathname || '';
      if (u.origin === location.origin) {
        ['table', 'ledger', 'codex'].forEach(function (k) {
          if (u.pathname.indexOf('/' + k + '/') === 0 && here.indexOf('/' + k + '/') !== 0) V31.from = V31_ROOMS[k];
        });
      }
    }
  } catch (e) { }
  try {
    if (typeof window !== 'undefined' && window && typeof window.addEventListener === 'function') {
      window.addEventListener('popstate', v31OnPop);
      if (typeof document !== 'undefined' && document && typeof document.addEventListener === 'function') {
        document.addEventListener('click', function (ev) {
          try {
            var t = ev && ev.target;
            V31.lastPress = (t && typeof t.closest === 'function') ? t.closest('button,a,[role="button"]') : null;
          } catch (e) { V31.lastPress = null; }
        }, true);
      }
      window.addEventListener('pageshow', function (ev) {
        if (!ev || !ev.persisted) return;
        var s = v31CurState();
        if (typeof s.ootd === 'number') V31.d = s.ootd;
      });
    }
    if (typeof document !== 'undefined' && document && typeof document.addEventListener === 'function') {
      document.addEventListener('click', v31LinkClick);
      document.addEventListener('keydown', v31Key);
    }
  } catch (e) { }
})();

/* =========== the styles ===========
   The art's own tokens and components only: the navword box, the ghost
   button's ink for More, the codex28 chips and deck bars, the v25 rows. */
(function () {
  if (typeof document === 'undefined' || !document || typeof document.createElement !== 'function') return;
  var css = document.createElement('style');
  css.id = 'v31-style';
  css.textContent = [
    /* the bar: four tabs and a quiet More, one row at 390px */
    '.wrap .house-topbar .appnav.v31nav,.appnav.v31nav{display:flex;flex-wrap:nowrap;align-items:stretch;gap:0}',
    '.appnav.v31nav .navword{flex:1 1 auto;min-width:44px;padding-inline:4px;white-space:nowrap}',
    /* More is quieter than the tabs (design 2.1): the tabs' type and ink, a
       muted ghost border, lit only when it is the screen showing */
    '.appnav.v31nav .navword.v31more{flex:0 0 auto;margin:8px 0 8px 4px;padding:4px 8px;min-height:44px;border:1px solid var(--line);border-radius:3px;color:var(--parch2)}',
    '.wrap .house-topbar .appnav.v31nav .navword.v31more{min-height:44px;margin:8px 0 8px 4px;padding:4px 8px;border:1px solid var(--line);border-radius:3px;color:var(--parch2);opacity:.86}',
    '.wrap .house-topbar .appnav.v31nav .navword.v31more:hover{opacity:1;color:var(--gold-hi)}',
    '.wrap .house-topbar .appnav.v31nav .navword.v31more[aria-current="page"]{opacity:1;color:var(--gold-hi);border-color:var(--gold);box-shadow:inset 0 -2px 0 var(--gold-hi);background:#d5b16c0a}',
    '.v31pill{display:inline-block;min-width:1.6em;margin-left:4px;padding:0 5px;border-radius:9px;background:var(--claret);color:var(--parch);font-family:var(--house-reading,Georgia),serif;font-size:13px;line-height:1.5;letter-spacing:0;font-variant:normal;text-align:center}',
    /* at a phone's width the tab words keep the house's 12px; the room comes
       from the letter spacing, the bar's side margins and More's padding */
    '@media(max-width:420px){.wrap .house-topbar .appnav.v31nav{margin-left:12px;margin-right:12px}.wrap .house-topbar .appnav.v31nav .navword{font-size:12px;letter-spacing:0;padding-inline:2px}.wrap .house-topbar .appnav.v31nav .navword.v31more{padding:4px 6px;margin-left:2px}.v31pill{font-size:12px;margin-left:2px;padding:0 4px}}',

    /* Back: the first thing in #view, sticky, clear of the badge once stuck */
    '.v31sentinel{height:1px;margin:0}',
    '.v31back{position:sticky;top:0;z-index:30;display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px;margin:0 0 6px;padding:6px 0;background:var(--bg)}',
    '.v31back.is-stuck{padding-left:calc(64px + env(safe-area-inset-left, 0px));border-bottom:1px solid var(--line)}',
    '.v31back #v31-back{min-height:44px;min-width:44px;padding:8px 18px}',
    '.v31back .v31pos{font-size:16px;color:var(--gold-soft)}',
    '.v31back .v31from{flex:1 0 100%;margin:0;font-size:15px;line-height:1.5;color:var(--parch2)}',
    'body[data-codex-page="cellar"] .wrap .v28-bar{top:58px}',

    /* the level page */
    '.v31-stat{margin:0 0 6px;font-size:16px;color:var(--gold-soft)}',
    '.v31-here{font-variant:small-caps;letter-spacing:.05em;color:var(--gold-hi)}',
    '.v31-sec{margin:18px 0 0}',
    '.v31-h2{font-family:var(--house-display,\'Cinzel\',Georgia,serif);font-weight:500;font-size:21px;line-height:1.3;letter-spacing:.03em;color:var(--gold-hi);margin:0 0 6px;padding-bottom:6px;border-bottom:1px solid var(--line)}',
    '.wrap .v31rows{margin-top:10px}',
    '.wrap .v31rows .v25row{min-height:0}',
    '.v31-line{margin:8px 0;font-size:16px;line-height:1.5;color:var(--parch)}',
    '.v31-houseline{color:var(--gold-soft)}',
    '.v31chips{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 0}',
    '.v31quietrow{display:flex;flex-wrap:wrap;gap:4px 16px;margin:12px 0 0}',
    '.v31quiet,.v31link{min-height:44px;padding:8px 2px;background:none;border:0;color:var(--gold-soft);font-family:var(--house-reading,\'EB Garamond\',Georgia,serif);font-size:16px;text-decoration:underline;text-underline-offset:3px;cursor:pointer;text-align:left}',
    '.v31quiet:hover,.v31link:hover{color:var(--gold-hi)}',
    '.v31find{margin-top:10px}',
    '.v31find .sainput{width:100%;min-height:44px;box-sizing:border-box}',
    '.v31hits{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:8px}',
    '.v31hits .secbtn{width:100%;min-height:44px}',
    '.v31holds{margin-top:20px}',
    '.wrap .v31subs{margin-top:12px}',
    '.v31-subh{font-family:var(--house-display,\'Cinzel\',Georgia,serif);font-weight:500;font-size:18px;color:var(--gold-hi);margin:0 0 6px}',
    '.v31secs{list-style:none;margin:8px 0 0;padding:0}',
    '.v31secs li{display:flex;flex-wrap:wrap;align-items:center;gap:0 12px;border-bottom:1px solid rgba(201,162,39,.13)}',
    '.v31plain{min-height:44px;display:inline-flex;align-items:center;font-size:16px;color:var(--parch)}',
    '.v31secmeta{font-size:15px;color:var(--parch2)}',

    /* the roots */
    '.v31scope{display:flex;flex-wrap:wrap;align-items:center;gap:0 4px;margin:0 0 6px;font-size:16px;color:var(--parch2)}',
    '.v31scope-b{min-height:44px;padding:8px 4px;background:none;border:0;color:var(--gold-hi);font-family:var(--house-reading,\'EB Garamond\',Georgia,serif);font-size:16px;text-decoration:underline;text-underline-offset:3px;cursor:pointer}',
    '.v31scope-name{font-weight:600}',
    '.v31scope-t{font-weight:600;color:var(--parch)}',
    '.v31scope-list{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 10px}',
    '.v31-due{margin:10px 0 0;padding:16px;border:1px solid var(--line);border-radius:3px;background:var(--house-panel,transparent)}',
    '.v31-due .secgroup{margin-top:0}',
    '.v31-go{min-height:48px;width:100%;margin-top:6px}',
    '.v31-group{margin-top:22px}',
    '.v31-gh{font-family:var(--house-display,\'Cinzel\',Georgia,serif)}',
    '.v31dom{display:flex;flex-direction:column;gap:6px}',
    '.v31dom .secs{margin-top:0}',
    '.v31-testgroup{margin-top:28px;padding-top:18px;border-top:3px double var(--line)}',
    '.v31-deckpage .v31-go{margin-top:18px}',
    '.v31narrow{margin-top:14px}',

    /* the card screen */
    '.wrap .v31card .v28-front{min-height:240px}',
    '.wrap .v31card .v31-gfront{align-items:flex-start;text-align:left}',
    '.wrap .v31card .v31-prof .v31-gl{display:block;color:var(--ink);font-size:17px;line-height:1.5;margin:0 0 8px}',
    '.wrap .v31card .v31-ctrl .btn{flex:1 1 50%;min-height:56px}',
    '.wrap .v31card .v31-acts{display:flex;flex-wrap:wrap;gap:10px}',
    '.v31misslink{margin-top:10px;min-height:44px}',
    '@media(max-width:599px){.v31-h2{font-size:19px}.v31-due{padding:14px}}'
  ].join('\n');
  try { document.head.appendChild(css); } catch (e) { }
})();
