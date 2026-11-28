/* ================== CODEX LX: THE PAST WINE LIST ==================

   The Brennan's wine list read again on 28 November 2026. The owner asked
   for the bottles and glasses no longer on the list to go to a past tab, as
   the food did. Loaded after codex59.js and before boot.js. It edits no
   earlier layer and no data file; every wrapper is typeof guarded and
   outermost, and the layer declares with var and function only. Every
   string it shows lives in V60_WORDS (read by v60W); its CSS lives in its
   own v60-style element, every selector under .wrap, every colour one of
   the house's own tokens.

   WHAT THIS LAYER DOES, and the rule each part keeps:

   1. THE PAST RULE IS THE ENGINE'S OWN. A wine is past when
      OOT.houseLib.isPast says so; an engine that does not carry it is read
      by the same rule written out (a section that, trimmed, begins
      "Past "). Past wines leave every deck, drill, weak list, progress line,
      header sentence and chip count the Codex builds itself: codex28's
      v28Wines reads the served wines, so Our List, its chips, the decks of
      codex28, codex29 and codex32, the cellar compass and every count read
      through it lose them; the producers (codex38) and the component cards
      (codex35) read the served house (OOT.houseLib.liveHouse, or the same
      rule); Our list by heart, Guest at the table and Say the pour deal no
      past wine. The floor chip counts served bottles only. codex35's house
      is the served house, so the component decks, Practise with our wine
      list (codex36) and the culinary Study buttons (codex37) reach no past
      wine; the videos (codex30) name served items only; Our List's search
      names no past dish under Elsewhere and its line under the list counts
      the dishes and drinks served; a card's Where we pour it names served
      dishes only, as the pack's firstPickIds do. A past wine is read whole
      only while its own card is drawn.

   2. THE PAST WINE LIST, a door at the foot of Our List in place of the
      past chips: the past glass wines, the past tasting pours and the past
      bottles, one group a past section in the house's order, each row
      opening the whole card read only (no Flash cards, no Say the pour, no
      drill, no edit, no Practise this wine), the note "Why did it leave the list?" (or the pour's
      "Why did it leave the pairing?") drawn first under the name.

   3. THE PAST OF THE FULL LIST. Where the list file carries past groups, a
      chip "Past (n)" after the list's sections. Pressed, each group under
      "Last printed <date>", its rows under the list's sections in the
      list's order, each with its name, vintage, size, bin and last price,
      opening in place to the producer's line and tell and the section's
      line, and to Open the full card where the group's cards names a wine
      the house holds. The search and the price and size chips work on the
      past rows while the chip is pressed, and the section chips and Every
      section count the past rows then, not the live list's. A past row's
      element id carries its group's date, since a row's number is unique
      only in its group.

   4. A list file with no past key and a pack with no past section draw
      exactly as before.

   5. THE WHOLE LIST, one tap from the room: a plain door at the top of Our
      List, beside the carded wines, "The whole list (3,560 bottles)", the
      count read from the list file once it is read (the read starts when
      Our List is drawn, never at load), the door plain until then.

   House rules observed: a new layer, no edits to earlier files; top-level
   declarations are var and function only; no pictorial glyph and no mark
   at or above U+2190 in anything this file writes; no dash of any
   spelling; British spelling; nobody named. */

/* =========== the words =========== */

var V60_WORDS = {
  wholeDoor: 'The whole list ({n} bottles)',
  wholeDoorPlain: 'The whole list',
  wholeLine: 'Every bottle the list prints, searchable by name, producer, grape, region or bin.',
  pastDoor: 'Past wine list ({n})',
  pastLine: 'Wines no longer poured or printed on the list. Each card is kept to be read; none is dealt in a deck or a drill.',
  pastCard: 'No longer on the list: kept to be read, never dealt.',
  pastChip: 'Past ({n})',
  lastPrinted: 'Last printed {date}',
  lastPrice: 'last {price}',
  pastNone: 'Nothing on the past list matches. Clear a chip or the search.',
  otherPlace: 'Elsewhere on the list',
  dishOne: '1 dish',
  dishMany: '{n} dishes',
  drinkOne: '1 drink',
  drinkMany: '{n} drinks'
};

function v60W(key, vars) {
  var s = V60_WORDS[key] || '';
  if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(String(vars[k])); });
  return s;
}
function v60Esc(s) { return (typeof v28Esc === 'function') ? v28Esc(s) : String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function v60Str(s) { return typeof s === 'string' ? s.trim() : ''; }
function v60Big(n) { try { return Number(n).toLocaleString('en-GB'); } catch (e) { return String(n); } }

/* =========== 1. the past rule =========== */

var V60_PREFIX = 'Past ';
var V60_WHY_RE = /^Why did it leave the /;

function v60Lib() {
  try { return (typeof OOT !== 'undefined' && OOT && OOT.houseLib) ? OOT.houseLib : null; } catch (e) { return null; }
}

/* The engine's own rule, else the same rule written out. */
function v60IsPast(item) {
  var lib = v60Lib();
  if (lib && typeof lib.isPast === 'function') { try { return !!lib.isPast(item); } catch (e) { } }
  return !!item && typeof item.section === 'string' && item.section.trim().indexOf(V60_PREFIX) === 0;
}

/* While above nought the house's wines are read whole: a past card is being drawn. */
var V60_WHOLE = 0;
function v60Whole(fn) {
  V60_WHOLE++;
  try { return fn(); } finally { V60_WHOLE--; }
}

function v60House() { try { return (typeof v28House === 'function') ? v28House() : null; } catch (e) { return null; } }
function v60AllWines(h) { return (h && Array.isArray(h.wines) ? h.wines : []).filter(function (w) { return w && typeof w.id === 'string' && typeof w.name === 'string' && w.name; }); }
function v60PastWines(h) { return v60AllWines(h).filter(v60IsPast); }
function v60PastItem(id) {
  var hit = null;
  if (!id) return null;
  v60AllWines(v60House()).some(function (w) { if (w.id === id) { hit = w; return true; } return false; });
  return hit && v60IsPast(hit) ? hit : null;
}

/* The house as it is served: the engine's liveHouse, else the same rule
   (the past items off their three lists, and off the lexicon and the
   components any record that names items and names only past ones). The
   very object back when nothing is past; one copy kept per house object, so
   a reader that keeps its work against the house it read keeps it. */
var V60_LIVE = { h: null, out: null };
function v60Live(h) {
  if (!h || typeof h !== 'object') return h;
  if (V60_LIVE.h === h) return V60_LIVE.out;
  /* the served house read again is itself */
  if (V60_LIVE.out === h) return h;
  var out = h;
  var lib = v60Lib();
  var any = [h.dishes, h.wines, h.cocktails].some(function (list) { return Array.isArray(list) && list.some(v60IsPast); });
  if (any) {
    if (lib && typeof lib.liveHouse === 'function' && typeof lib.isPast === 'function') {
      try { out = lib.liveHouse(h); } catch (e) { out = null; }
    } else out = null;
    if (!out) {
      var past = {};
      [h.dishes, h.wines, h.cocktails].forEach(function (list) { (Array.isArray(list) ? list : []).forEach(function (x) { if (v60IsPast(x) && x.id) past[x.id] = 1; }); });
      var served = function (list) { return (Array.isArray(list) ? list : []).filter(function (x) { return !v60IsPast(x); }); };
      var hangs = function (r) { return !(r && Array.isArray(r.itemIds) && r.itemIds.length > 0 && r.itemIds.every(function (id) { return past[id]; })); };
      out = {};
      Object.keys(h).forEach(function (k) { out[k] = h[k]; });
      out.dishes = served(h.dishes); out.wines = served(h.wines); out.cocktails = served(h.cocktails);
      out.lexicon = (Array.isArray(h.lexicon) ? h.lexicon : []).filter(hangs);
      if (h.components) out.components = (Array.isArray(h.components) ? h.components : []).filter(hangs);
    }
  }
  V60_LIVE.h = h; V60_LIVE.out = out;
  return out;
}

/* codex28's wines are the served wines; the whole list only while a past card is drawn. */
if (typeof v28Wines === 'function') {
  var _v60Wines = v28Wines;
  v28Wines = function (h) {
    var all = _v60Wines.apply(this, arguments);
    if (V60_WHOLE > 0) return all;
    var out = all.filter(function (w) { return !v60IsPast(w); });
    return out.length === all.length ? all : out;
  };
}

/* A past wine kept on the device's own list (the cellar mirrors the house) is
   not the person's own bottle: it leaves Our List's rows with its house record. */
if (typeof v28Rows === 'function') {
  var _v60Rows = v28Rows;
  v28Rows = function () {
    var rows = _v60Rows.apply(this, arguments);
    if (V60_WHOLE > 0 || !Array.isArray(rows)) return rows;
    var past = {};
    v60PastWines(v60House()).forEach(function (w) { past[w.id] = 1; });
    var out = rows.filter(function (r) { return !(r && r.own && past[r.id]); });
    return out.length === rows.length ? rows : out;
  };
}

/* The producers of Our List read the served house. */
if (typeof v38Rows === 'function') {
  var _v60Rows38 = v38Rows;
  v38Rows = function (h) {
    return _v60Rows38.call(this, V60_WHOLE > 0 ? h : v60Live(h));
  };
}

/* The component cards the card screen deals read the served house; one
   wine's own (scope all, drawn on its card) read it whole. */
if (typeof v35Cards === 'function') {
  var _v60Cards35 = v35Cards;
  v35Cards = function (h, scope) {
    if (scope === 'all' || V60_WHOLE > 0) return _v60Cards35.apply(this, arguments);
    return _v60Cards35.call(this, v60Live(h), scope);
  };
}

/* codex35's house is the served house, whole only while a past card is drawn:
   so the component decks (every component, one wine's own), Practise with our
   wine list (codex36) and the culinary lessons' Study buttons (codex37) reach
   no past wine, and a served card compares with served wines only. */
if (typeof v35House === 'function') {
  var _v60House35 = v35House;
  v35House = function () {
    var h = _v60House35.apply(this, arguments);
    return V60_WHOLE > 0 ? h : v60Live(h);
  };
}

/* The videos of Our List and of the Videos view name served wines only. */
if (typeof v30VideosHtml === 'function') {
  var _v60Videos30 = v30VideosHtml;
  v30VideosHtml = function (h) {
    return _v60Videos30.call(this, V60_WHOLE > 0 ? h : v60Live(h));
  };
}

/* A card's Where we pour it reads the dishes served, past card or not, as the
   pack's own firstPickIds, secondFor and offeredWith do: a past dish is no
   first pick, second choice or bottle tier of any wine. */
if (typeof v54Pairings === 'function') {
  var _v60Pairings54 = v54Pairings;
  v54Pairings = function (h, id) {
    return _v60Pairings54.call(this, v60Live(h), id);
  };
}

/* Our List's search names served dishes and drinks only under Elsewhere. */
if (typeof v28Elsewhere === 'function') {
  var _v60Elsewhere = v28Elsewhere;
  v28Elsewhere = function (h, q) {
    return _v60Elsewhere.call(this, V60_WHOLE > 0 ? h : v60Live(h), q);
  };
}

/* Our list by heart and Guest at the table deal from the served house. */
if (typeof v27ReciteDeck === 'function') {
  var _v60ReciteDeck = v27ReciteDeck;
  v27ReciteDeck = function (h) { return _v60ReciteDeck.call(this, v60Live(h)); };
}
if (typeof v27GuestDeck === 'function') {
  var _v60GuestDeck = v27GuestDeck;
  v27GuestDeck = function (h) { return _v60GuestDeck.call(this, v60Live(h)); };
}

/* Say the pour offers no past wine. */
if (typeof v27SayItems === 'function') {
  var _v60SayItems = v27SayItems;
  v27SayItems = function () {
    var items = _v60SayItems.apply(this, arguments);
    if (!Array.isArray(items)) return items;
    var out = items.filter(function (x) { return !(x && v60PastItem(x.id)); });
    return out.length === items.length ? items : out;
  };
}

/* =========== 2. the past wine list on Our List =========== */

var V60_STATE = { pastOpen: false };

/* The past wines as Our List draws a row: one group a past section, in the house's order. */
function v60PastGroups() {
  var h = v60House();
  if (!h || typeof v28Rows !== 'function') return [];
  var rows = v60Whole(function () { return v28Rows(); }).filter(function (r) { return r && r.item && v60IsPast(r.item); });
  var order = [], by = {};
  rows.forEach(function (r) {
    if (!by[r.section]) { by[r.section] = []; order.push(r.section); }
    by[r.section].push(r);
  });
  return order.map(function (s) { return { section: s, rows: by[s] }; });
}

/* The door's rows are drawn only while it is open, so the list's own rows are
   the only rows of Our List until the door is opened. */
function v60PastBodyHtml(groups) {
  var html = '<p class="v28-soft v60-pastline">' + v60Esc(v60W('pastLine')) + '</p>';
  (groups || v60PastGroups()).forEach(function (g) {
    html += '<div class="v60-pastgroup"><h3 class="secgroup">' + v60Esc(g.section) + ' · ' + g.rows.length + '</h3>'
      + g.rows.map(function (r) { return typeof v28RowHtml === 'function' ? v28RowHtml(r, []) : ''; }).join('') + '</div>';
  });
  return html;
}
function v60PastDoorHtml() {
  var groups = v60PastGroups();
  var n = 0;
  groups.forEach(function (g) { n += g.rows.length; });
  if (!n) return '';
  return '<details class="v28-q v60-past" id="v60-past"' + (V60_STATE.pastOpen ? ' open' : '') + '><summary>' + v60Esc(v60W('pastDoor', { n: n })) + '</summary>'
    + '<div class="v60-pastbody">' + (V60_STATE.pastOpen ? v60PastBodyHtml(groups) : '') + '</div></details>';
}

/* The whole list's size, once the list file is read. */
function v60WholeCount() {
  try {
    var h = v60House();
    if (typeof V29_LIST === 'undefined' || !V29_LIST || typeof v29ListUrl !== 'function') return 0;
    if (V29_LIST.status !== 'ready' || V29_LIST.url !== v29ListUrl(h) || !Array.isArray(V29_LIST.rows)) return 0;
    return V29_LIST.rows.length;
  } catch (e) { return 0; }
}
function v60WholeLabel() {
  var n = v60WholeCount();
  return n ? v60W('wholeDoor', { n: v60Big(n) }) : v60W('wholeDoorPlain');
}
function v60WholeDoorHtml() {
  try { if (typeof v29ListUrl !== 'function' || !v29ListUrl(v60House())) return ''; } catch (e) { return ''; }
  return '<div class="v60-whole"><button type="button" class="btn v60-wholebtn" data-v28="fulllist">'
    + '<span class="v60-wholename" data-v60-whole="1">' + v60Esc(v60WholeLabel()) + '</span>'
    + '<span class="v60-wholeline">' + v60Esc(v60W('wholeLine')) + '</span></button></div>';
}

/* The line under Our List that counts the house's dishes and drinks, counted
   served: drawn again only when the house has a past item, in codex28's words
   and links. */
function v60AlsoHtml(h) {
  var dishes = h && Array.isArray(h.dishes) ? h.dishes.length : 0;
  var drinks = h && Array.isArray(h.cocktails) ? h.cocktails.length : 0;
  if ((!dishes && !drinks) || typeof v28W !== 'function') return '';
  var d = dishes === 1 ? v60W('dishOne') : v60W('dishMany', { n: dishes });
  var k = drinks === 1 ? v60W('drinkOne') : v60W('drinkMany', { n: drinks });
  var online = true;
  try { online = typeof v28Online === 'function' ? v28Online() : true; } catch (e) { online = true; }
  if (typeof V28_SUITE !== 'undefined' && V28_SUITE && online) { d = '<a class="v28-link" href="/table/menu">' + d + '</a>'; k = '<a class="v28-link" href="/ledger/#/menu">' + k + '</a>'; }
  return '<p class="v28-soft v28-also">' + v28W('alsoHouse', { dishes: d, drinks: k }) + '</p>';
}
function v60AlsoServed(html) {
  var h = v60House();
  var live = v60Live(h);
  if (!h || live === h) return html;
  var at = html.indexOf('<p class="v28-soft v28-also">');
  if (at < 0) return html;
  var end = html.indexOf('</p>', at);
  if (end < 0) return html;
  return html.slice(0, at) + v60AlsoHtml(live) + html.slice(end + '</p>'.length);
}

/* Our List: the whole list's door at the top, above the progress line, the
   search and the carded wines; the past wine list at the foot of the whole
   list, in place of the past chips (not while a chip or a search narrows it). */
if (typeof v28StudyHtml === 'function') {
  var _v60StudyHtml = v28StudyHtml;
  v28StudyHtml = function () {
    var html = _v60StudyHtml.apply(this, arguments);
    if (!html || typeof html !== 'string') return html;
    html = v60AlsoServed(html);
    var door = v60WholeDoorHtml();
    if (door) {
      var top = html.indexOf('<div class="v28-progrow"');
      if (top < 0) top = html.indexOf('<div class="v28-bar');
      if (top >= 0) html = html.slice(0, top) + door + html.slice(top);
    }
    var st = (typeof v28State === 'function') ? v28State() : {};
    var past = (!v60Str(st.q) && !st.sec) ? v60PastDoorHtml() : '';
    if (past) {
      var close = html.lastIndexOf('</div>');
      if (close >= 0) html = html.slice(0, close) + past + html.slice(close);
    }
    return html;
  };
}

/* The view of Our List: the past door keeps its open state, and the whole
   list is read in the background (never at load) so its door can say its size. */
if (typeof v28StudyView === 'function') {
  var _v60StudyView = v28StudyView;
  v28StudyView = function () {
    var box = _v60StudyView.apply(this, arguments);
    try {
      var d = box && typeof box.querySelector === 'function' ? box.querySelector('#v60-past') : null;
      if (d && d.id === 'v60-past' && typeof d.addEventListener === 'function') d.addEventListener('toggle', function () {
        V60_STATE.pastOpen = !!d.open;
        var body = typeof d.querySelector === 'function' ? d.querySelector('.v60-pastbody') : null;
        if (body && d.open && !body.firstChild) body.innerHTML = v60PastBodyHtml();
      });
    } catch (e) { }
    v60ReadWhole();
    return box;
  };
}

function v60ReadWhole() {
  try {
    var h = v60House();
    if (typeof v29ListUrl !== 'function' || typeof v29Load !== 'function' || typeof V29_LIST === 'undefined' || !V29_LIST) return;
    var url = v29ListUrl(h);
    if (!url || typeof fetch !== 'function') return;
    if (V29_LIST.url === url && V29_LIST.status !== 'idle') return;
    v29Load(h).then(function () {
      try {
        if (typeof document === 'undefined' || !document || typeof document.querySelectorAll !== 'function') return;
        var label = v60WholeLabel();
        Array.prototype.forEach.call(document.querySelectorAll('[data-v60-whole]'), function (node) { node.textContent = label; });
      } catch (e) { }
    });
  } catch (e) { }
}

/* A past row opened from the door keeps the door open on the way back. */
if (typeof v28Open === 'function') {
  var _v60Open = v28Open;
  v28Open = function (id) {
    if (v60PastItem(id)) V60_STATE.pastOpen = true;
    return _v60Open.apply(this, arguments);
  };
}

/* A past card's note on why it left, newest first. */
function v60WhyNote(item) {
  var hit = null;
  (item && Array.isArray(item.kept) ? item.kept : []).forEach(function (n) {
    if (!n || typeof n.q !== 'string' || typeof n.a !== 'string' || !V60_WHY_RE.test(n.q.trim())) return;
    if (!hit || (Number(n.ts) || 0) > (Number(hit.ts) || 0)) hit = n;
  });
  return hit;
}

/* The note drawn first is not drawn again among the card's other notes. */
if (typeof v28NotesFor === 'function') {
  var _v60NotesFor = v28NotesFor;
  v28NotesFor = function (item) {
    var out = _v60NotesFor.apply(this, arguments);
    if (!(V60_WHOLE > 0) || !item || !v60IsPast(item) || !out) return out;
    var why = v60WhyNote(item);
    if (!why) return out;
    if (Array.isArray(out.more)) out.more = out.more.filter(function (n) { return n !== why; });
    if (Array.isArray(out.earlier)) out.earlier = out.earlier.filter(function (n) { return n !== why; });
    return out;
  };
}

/* The study buttons a past card never draws: it is read, never dealt or edited. */
var V60_STUDY_ACTS = ['cardsone', 'say', 'drillsec', 'drill', 'edit'];
function v60ReadOnly(html, item) {
  var out = html;
  out = out.replace(/<div class="v28-btnrow v28-acts">[\s\S]*?<\/div>/g, '');
  /* codex54's Practise this wine goes whole: a past card deals nothing */
  out = out.replace(/<section class="v28-block v54-block v54-practise"[\s\S]*?<\/section>/g, '');
  V60_STUDY_ACTS.forEach(function (a) {
    out = out.replace(new RegExp('<button type="button" class="[^"]*" data-v28="' + a + '"[^>]*>[\\s\\S]*?<\\/button>', 'g'), '');
  });
  /* the line under the study buttons that says a section is too small to drill alone goes with them */
  if (typeof v28W === 'function' && item) out = out.split('<p class="v28-soft">' + v60Esc(v28W('tooSmall', { section: v60Str(item.section) || 'The list' })) + '</p>').join('');
  return out;
}

/* A past card: drawn whole, its neighbours its own section's, read only, the
   note on why it left first under its name. */
if (typeof v28CardHtml === 'function') {
  var _v60CardHtml = v28CardHtml;
  v28CardHtml = function (id) {
    var item = v60PastItem(id);
    if (!item) return _v60CardHtml.apply(this, arguments);
    var st = (typeof v28State === 'function') ? v28State() : null;
    var keep = st ? { q: st.q, sec: st.sec } : null;
    var args = arguments, self = this;
    var html;
    try {
      if (st) { st.q = ''; st.sec = (typeof v28IsBottle === 'function' && v28IsBottle(item) ? '#bottles|' : '') + v60Str(item.section); }
      html = v60Whole(function () { return _v60CardHtml.apply(self, args); });
    } finally {
      if (st && keep) { st.q = keep.q; st.sec = keep.sec; }
    }
    if (!html || typeof html !== 'string') return html;
    html = v60ReadOnly(html, item);
    var why = v60WhyNote(item);
    var block = '<p class="v60-pasttag">' + v60Esc(v60W('pastCard')) + '</p>';
    if (why) {
      var paras = (typeof v28Paras === 'function') ? v28Paras(why.a) : '<p>' + v60Esc(why.a) + '</p>';
      block += '<section class="v28-block v60-why"><h3 class="secgroup">' + v60Esc(why.q.trim()) + '</h3>' + paras + '</section>';
    }
    var at = html.indexOf('</h2>');
    if (at < 0) return html;
    at += '</h2>'.length;
    var bin = html.indexOf('<p class="v29-binline">', at);
    if (bin === at) at = html.indexOf('</p>', bin) + '</p>'.length;
    return html.slice(0, at) + block + html.slice(at);
  };
}

/* =========== 3. the past of the full list =========== */

var V60_PAST = { data: null, groups: [], rows: [] };

/* The list file's past groups, each indexed as codex29 indexes the list:
   the same producers, places and sections, the group's own cards. */
function v60PastIndex() {
  if (typeof V29_LIST === 'undefined' || !V29_LIST || V29_LIST.status !== 'ready' || !V29_LIST.data) return null;
  var data = V29_LIST.data;
  if (!Array.isArray(data.past) || !data.past.length || typeof v29Index !== 'function') return null;
  if (V60_PAST.data === data) return V60_PAST.rows.length ? V60_PAST : null;
  var groups = [], all = [];
  data.past.forEach(function (g) {
    if (!g || typeof g !== 'object' || !Array.isArray(g.entries)) return;
    var date = String(g.lastPrinted || '');
    var ix = v29Index({ producers: data.producers, places: data.places, sections: data.sections, cards: g.cards && typeof g.cards === 'object' ? g.cards : {}, entries: g.entries });
    var rows = ix.rows.map(function (r) {
      delete r.shared;
      r.past = true; r.group = date; r.key = date + '-' + r.n;
      r.home = r.section || String(r.place || '').split(' ~ ')[0];
      return r;
    });
    if (!rows.length) return;
    groups.push({ date: date, source: String(g.source || ''), rows: rows });
    all = all.concat(rows);
  });
  V60_PAST.data = data; V60_PAST.groups = groups; V60_PAST.rows = all;
  return all.length ? V60_PAST : null;
}

function v60PastOn(st) { return !!(st && st.past && v60PastIndex()); }

/* While the chip is pressed the section chips and Every section count the
   past rows, the rows drawn under them; unpressed, the live list's own. */
function v60SecCounts(st) {
  if (!v60PastOn(st)) return { all: V29_LIST.rows.length, by: V29_LIST.secCount || {} };
  var by = {};
  V60_PAST.rows.forEach(function (r) { if (r.section) by[r.section] = (by[r.section] || 0) + 1; });
  return { all: V60_PAST.rows.length, by: by };
}

function v60SecLabel(value, counts) {
  if (typeof v29W !== 'function') return '';
  if (!value) return v29W('allSections', { n: counts.all });
  return (typeof v29PlaceTitle === 'function' ? v29PlaceTitle(value) : value) + ' ' + (counts.by[value] || 0);
}

function v60Unesc(s) { return String(s).replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'); }

function v60SecChips(html, st) {
  var counts = v60SecCounts(st);
  return html.replace(/(<button type="button" class="v28-chip" data-v29="sec" data-v=")([^"]*)(" aria-pressed="(?:true|false)">)[^<]*(<\/button>)/g, function (m, a, v, b, c) {
    return a + v + b + v60Esc(v60SecLabel(v60Unesc(v), counts)) + c;
  });
}

/* The section chips already drawn take the counts again, in place. */
function v60RelabelSecs(box, st) {
  try {
    var counts = v60SecCounts(st);
    Array.prototype.forEach.call(box.querySelectorAll('[data-v29="sec"]'), function (b) {
      b.textContent = v60SecLabel(b.getAttribute('data-v') || '', counts);
    });
  } catch (e) { }
}

/* While the chip is pressed the search and the chips run over the past rows. */
if (typeof v29Filtered === 'function') {
  var _v60Filtered = v29Filtered;
  v29Filtered = function (st) {
    if (!v60PastOn(st)) return _v60Filtered.apply(this, arguments);
    var tokens = (typeof v29Fold === 'function' ? v29Fold(st.q) : ' ' + String(st.q || '').toLowerCase() + ' ').trim().split(' ').filter(Boolean);
    return V60_PAST.rows.filter(function (r) {
      if (st.sec && r.section !== st.sec) return false;
      if (st.band && r.band !== st.band) return false;
      if (st.size && r.sizeKind !== st.size) return false;
      for (var i = 0; i < tokens.length; i++) if (r.hay.indexOf(tokens[i]) < 0) return false;
      return true;
    });
  };
}

function v60PastId(r) { return 'v60-d' + String(r.group).replace(/[^0-9A-Za-z]+/g, '-') + '-' + r.n; }

function v60PastRowHtml(r, open) {
  var price = typeof v29Price === 'function' ? v29Price(r.price) : String(r.price);
  if (price && r.glass && typeof v29W === 'function') price += ' ' + v29W('glass');
  var sizeName = (typeof V29_SIZE_NAME !== 'undefined' && V29_SIZE_NAME && typeof v29SizeKey === 'function') ? V29_SIZE_NAME[v29SizeKey(r.size)] : '';
  var under = [];
  if (r.size && !r.glass) under.push(r.size + (sizeName ? ', ' + sizeName : ''));
  under.push(typeof v29PlaceTitle === 'function' ? v29PlaceTitle(r.place) : r.place);
  var id = v60PastId(r);
  var bin = r.bin && typeof v29W === 'function' ? '<span class="v29-bin">' + v60Esc(v29W('binOf', { bin: r.bin })) + '</span> ' : '';
  var html = '<button type="button" class="v28-row v29-row v60-prow" data-v29="prow" data-g="' + v60Esc(r.group) + '" data-n="' + v60Esc(r.n) + '" aria-expanded="' + (open ? 'true' : 'false') + '" aria-controls="' + id + '">'
    + '<span class="v28-rowtop"><span class="v28-name">' + bin + v60Esc(r.name) + (r.vintage ? ' ' + v60Esc(r.vintage) : '') + '</span>'
    + (price ? '<span class="lvltag v28-price">' + v60Esc(v60W('lastPrice', { price: price })) + '</span>' : '') + '</span>'
    + '<span class="v28-short">' + v60Esc(under.join(' · ')) + '</span></button>';
  html += '<div class="v29-detail" id="' + id + '"' + (open ? '' : ' hidden') + '>' + (open && typeof v29DetailHtml === 'function' ? v29DetailHtml(r) : '') + '</div>';
  return html;
}

function v60SecTitle(key) {
  if (!key) return v60W('otherPlace');
  return typeof v29PlaceTitle === 'function' ? v29PlaceTitle(key) : key;
}

/* The past rows the chips and the search leave, each group under the date it
   was last printed, its rows under the list's sections in the list's order. */
function v60PastResultsHtml(st) {
  var rows = v29Filtered(st);
  if (!rows.length) return '<p class="v28-soft">' + v60Esc(v60W('pastNone')) + '</p>';
  var shown = rows.slice(0, st.shown);
  var order = Array.isArray(V29_LIST.sections) ? V29_LIST.sections.slice() : [];
  var html = '';
  V60_PAST.groups.forEach(function (g) {
    var mine = shown.filter(function (r) { return r.group === g.date; });
    if (!mine.length) return;
    var date = (typeof v28Date === 'function' ? v28Date(g.date) : '') || g.date;
    html += '<h3 class="secgroup v60-printed">' + v60Esc(v60W('lastPrinted', { date: date })) + '</h3>';
    var keys = order.slice();
    mine.forEach(function (r) { if (keys.indexOf(r.home) < 0) keys.push(r.home); });
    keys.forEach(function (k) {
      var here = mine.filter(function (r) { return r.home === k; });
      if (!here.length) return;
      html += '<h4 class="v60-sechead">' + v60Esc(v60SecTitle(k)) + ' · ' + here.length + '</h4>'
        + here.map(function (r) { return v60PastRowHtml(r, st.open === r.key); }).join('');
    });
  });
  if (rows.length > shown.length && typeof v29W === 'function') html += '<div class="v28-btnrow v29-morerow"><button type="button" class="btn ghost" data-v29="more">' + v29W('more') + '</button></div>';
  return html;
}

if (typeof v29ResultsHtml === 'function') {
  var _v60ResultsHtml = v29ResultsHtml;
  v29ResultsHtml = function (st) {
    if (!v60PastOn(st)) return _v60ResultsHtml.apply(this, arguments);
    return v60PastResultsHtml(st);
  };
}

/* The chip, after the list's sections, drawn only when the file carries past groups. */
if (typeof v29BarHtml === 'function') {
  var _v60BarHtml = v29BarHtml;
  v29BarHtml = function (st) {
    var html = _v60BarHtml.apply(this, arguments);
    var ix = v60PastIndex();
    if (!ix || typeof html !== 'string') return html;
    if (v60PastOn(st)) html = v60SecChips(html, st);
    var chip = '<button type="button" class="v28-chip v60-pastchip" data-v29="past" aria-pressed="' + (st && st.past ? 'true' : 'false') + '">' + v60Esc(v60W('pastChip', { n: ix.rows.length })) + '</button>';
    var at = html.indexOf('<div class="v28-chips"');
    var end = at >= 0 ? html.indexOf('</div>', at) : -1;
    return end >= 0 ? html.slice(0, end) + chip + html.slice(end) : html;
  };
}

/* The chip pressed and a past row opened in place. */
if (typeof v29Act === 'function') {
  var _v60V29Act = v29Act;
  v29Act = function (act, node, box) {
    var get = function (k) { return node && typeof node.getAttribute === 'function' ? (node.getAttribute(k) || '') : ''; };
    var st = (typeof v29State === 'function') ? v29State() : null;
    if (act === 'past' && st) {
      st.past = !st.past; st.shown = (typeof V29_PAGE === 'number' ? V29_PAGE : 40); st.open = null;
      try { if (node && typeof node.setAttribute === 'function') node.setAttribute('aria-pressed', st.past ? 'true' : 'false'); } catch (e) { }
      v60RelabelSecs(box, st);
      if (typeof v29Repaint === 'function') v29Repaint(box);
      return;
    }
    if (act === 'prow' && st && v60PastIndex()) {
      var key = get('data-g') + '-' + get('data-n');
      var row = null;
      V60_PAST.rows.some(function (r) { if (r.key === key) { row = r; return true; } return false; });
      if (!row) return;
      st.open = st.open === key ? null : key;
      try {
        Array.prototype.forEach.call(box.querySelectorAll('.v29-row[aria-expanded="true"]'), function (b) {
          if (b === node) return;
          b.setAttribute('aria-expanded', 'false');
          var d = box.querySelector('#' + b.getAttribute('aria-controls'));
          if (d) { d.hidden = true; d.innerHTML = ''; }
        });
        var detail = box.querySelector('#' + v60PastId(row));
        if (detail) {
          detail.hidden = st.open !== key;
          detail.innerHTML = st.open === key && typeof v29DetailHtml === 'function' ? v29DetailHtml(row) : '';
        }
        node.setAttribute('aria-expanded', st.open === key ? 'true' : 'false');
      } catch (e) { }
      return;
    }
    return _v60V29Act.apply(this, arguments);
  };
}

/* =========== the style =========== */

(function () {
  if (typeof document === 'undefined' || !document || typeof document.createElement !== 'function') return;
  if (typeof document.getElementById === 'function') { var had = document.getElementById('v60-style'); if (had && had.id === 'v60-style') return; }
  var css = document.createElement('style');
  css.id = 'v60-style';
  css.textContent = [
    '.wrap .v60-whole{margin:14px 0 10px}',
    '.wrap .v60-wholebtn{display:flex;flex-direction:column;align-items:flex-start;gap:4px;width:100%;min-height:56px;box-sizing:border-box;margin:0;padding:12px 16px;text-align:left;border:1px solid var(--gold-soft);border-radius:6px;background:var(--bg2);color:var(--parch);white-space:normal}',
    '.wrap .v60-wholename{font-family:var(--house-display,\'Cinzel\',Georgia,serif);font-size:18px;line-height:1.3;font-weight:600;letter-spacing:.02em;color:var(--gold-hi)}',
    '.wrap .v60-wholeline{font-family:var(--house-reading,\'EB Garamond\',Georgia,serif);font-size:16px;line-height:1.45;font-weight:400;letter-spacing:normal;text-transform:none;font-variant:normal;color:var(--parch2)}',
    '.wrap .v60-past{margin-top:18px;border-top:1px solid var(--line)}',
    '.wrap .v60-pastline{margin:4px 0 8px}',
    '.wrap .v60-pastgroup .secgroup{margin-top:14px}',
    '.wrap .v60-pasttag{margin:4px 0 10px;font-size:16px;line-height:1.45;font-style:italic;color:var(--gold-soft)}',
    '.wrap .v60-why{border-left:2px solid var(--gold-soft);padding-left:12px}',
    '.wrap .v60-why .secgroup{margin-top:4px}',
    '.wrap .v60-printed{margin-top:18px}',
    '.wrap .v60-sechead{font-family:var(--house-display,\'Cinzel\',Georgia,serif);font-size:14px;letter-spacing:.05em;font-weight:500;color:var(--gold-soft);margin:14px 0 4px}'
  ].join('\n');
  try { (document.head || document.documentElement).appendChild(css); } catch (e) { }
})();
