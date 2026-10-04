/* ================== CODEX XXXIV: WHAT IT IS MADE OF, AND COMPARE WITH ==================

   The component deep dive (WorldTable plan, 5 October 2026): the owner asked
   for an explanation and a flash card for every grape, region, method and
   story behind each wine on the list, and a comparison to something the app
   already holds. The House carries them (house.components, one card per
   component shared by every item that uses it, and an item's compare mark,
   the shapes in the World Table's src/lib/house/house-schema.ts). This layer
   is the Codex's half. codex33 holds the illustrated guides; new work belongs
   in the next layer, so this is codex34.

   WHAT IT DOES, and the rule each part keeps:

   1. WHAT IT IS MADE OF, ON A WINE'S CARD. Before the five parts, the wine's
      components grouped Ingredients, Techniques, Stories, each a closed
      disclosure that opens to how to say it, the explanation, the card's
      question and answer, and the videos that teach it (links out, never a
      player). Flash these components deals the wine's component deck.

   2. COMPARE WITH, ON A WINE'S CARD. One or two comparisons: a grape, a
      producer or a primer opens through codex28's own doors (the grape's
      profile run for a grape on the level's list, its profile in words for
      one beyond it), a house wine opens its card, a World Table recipe or
      technique and a Ledger cocktail are links into their rooms on the
      suite's path when the room answers, and a classic is words. Each says
      what is the same and what differs.

   3. THE DECKS. codex32's one card screen gains three: components, every
      component; components:{kind}, Ingredients, Techniques or Stories; and
      item-components:{id}, one wine's components in the order its card
      shows them, never shuffled. The Flashcards root lists a deck per kind
      under What it's made of. A grade is recorded as the words are, under
      h-{component id}-component.

   4. THE DOOR FROM ANOTHER ROOM. #ref={a grape, a producer or a primer} is
      read once at load and opens that door on the first render, so a
      comparison in the World Table or the Ledger lands where it points.

   KEPT ONLY: every mark read here is a person's (v28KV). NO OOT AT ALL is the
   standalone build and every Node gate: no house, no block, nothing drawn.

   House rules observed: a new layer, no edits to earlier files; top-level
   declarations are var and function only, no arrow; no pictorial glyph and
   no mark at or above U+2190 in anything this file writes; no dash of any
   spelling; British spelling in the app's own words; nobody named. */

/* =========== the words =========== */

var V34_WORDS = {
  madeOf: 'What it’s made of',
  flashThese: 'Flash these components',
  compareWith: 'Compare with',
  same: 'The same',
  different: 'What differs',
  classic: 'A classic, for comparison',
  cardFront: 'On the card',
  cardBack: 'The answer',
  say: 'Say it',
  inRoom: 'in the {room}',
  grapeCard: 'The grape card',
  producerDoor: 'The producer',
  primerDoor: 'The chapter',
  ourWine: 'On our list',
  everyComponent: 'Every component',
  itemDeck: '{name}: what it is made of',
  videoNote: 'Each video opens on YouTube or Vimeo in a new tab, and needs a connection.',
  offlineRoom: '(open the {room} once online and it stays with you offline)'
};
var V34_KINDS = ['ingredient', 'technique', 'story'];
var V34_LABELS = { ingredient: 'Ingredients', technique: 'Techniques', story: 'Stories' };
var V34_ROOM_NAME = { table: 'World Table', ledger: 'Ledger' };

function v34W(key, vars) {
  var v = vars || {};
  return String(V34_WORDS[key] || key).replace(/\{(\w+)\}/g, function (m, k) { return Object.prototype.hasOwnProperty.call(v, k) ? String(v[k]) : m; });
}
function v34Esc(s) { return (typeof v28Esc === 'function') ? v28Esc(s) : String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function v34Str(s) { return typeof s === 'string' ? s.trim() : ''; }
function v34Kept(m) { return m && typeof m === 'object' && m.by === 'person' && m.value !== undefined && m.value !== null ? m.value : null; }
function v34House() { try { return (typeof v28House === 'function') ? v28House() : null; } catch (e) { return null; } }
function v34Lib(name, local) {
  var lib = null;
  try { lib = (typeof OOT !== 'undefined' && OOT && OOT.houseLib) ? OOT.houseLib : null; } catch (e) { lib = null; }
  return lib && typeof lib[name] === 'function' ? lib[name] : local;
}
function v34Paras(s) {
  return String(s == null ? '' : s).split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean)
    .map(function (p) { return '<p>' + v34Esc(p) + '</p>'; }).join('');
}

/* =========== the rules, the engine's when it ships them =========== */

function v34GroupsLocal(h, id) {
  var mine = (h && Array.isArray(h.components) ? h.components : []).filter(function (c) { return c && Array.isArray(c.itemIds) && c.itemIds.indexOf(id) >= 0; });
  return V34_KINDS.map(function (k) {
    return { kind: k, label: V34_LABELS[k], components: mine.filter(function (c) { return c.kind === k; }) };
  }).filter(function (g) { return g.components.length; });
}
function v34Groups(h, id) { return h ? v34Lib('componentGroups', v34GroupsLocal)(h, id) : []; }
function v34Videos(h, cid) {
  var ok = function (v) { return v && (typeof v30UrlOk === 'function' ? v30UrlOk(v.url) : false) && v34Str(v.title); };
  return (h && Array.isArray(h.videos) ? h.videos : []).filter(function (v) { return ok(v) && Array.isArray(v.componentIds) && v.componentIds.indexOf(cid) >= 0; });
}
function v34Card(c) {
  var v = v34Kept(c && c.card);
  return v && v34Str(v.front) && v34Str(v.back) ? { front: v34Str(v.front), back: v34Str(v.back) } : null;
}

/* The house's component cards, one per component with a kept card, as the
   card screen deals them: { kind: 'component', id, front, back, label }. */
function v34Cards(h) {
  if (!h) return [];
  var out = [];
  (Array.isArray(h.components) ? h.components : []).forEach(function (c) {
    var card = v34Card(c);
    if (card && c.id) out.push({ kind: 'component', id: c.id, ck: c.kind, front: card.front, back: card.back, label: V34_LABELS[c.kind] || '' });
  });
  return out;
}
/* One wine's component cards, Ingredients then Techniques then Stories. */
function v34ItemCards(h, id) {
  var cards = v34Cards(h);
  var out = [];
  v34Groups(h, id).forEach(function (g) {
    g.components.forEach(function (c) { cards.forEach(function (x) { if (x.id === c.id) out.push(x); }); });
  });
  return out;
}

/* =========== what it is made of =========== */

function v34MadeOfHtml(h, id) {
  var groups = v34Groups(h, id);
  if (!groups.length) return '';
  var cards = 0;
  var body = groups.map(function (g) {
    return '<h4 class="v28-eyebrow v34-kind" data-kind="' + v34Esc(g.kind) + '">' + v34Esc(g.label) + '</h4><ul class="v34-comps">'
      + g.components.map(function (c) {
        var say = v34Str(v34Kept(c.say));
        var explain = v34Str(v34Kept(c.explain));
        var card = v34Card(c);
        if (card) cards++;
        var vids = v34Videos(h, c.id);
        return '<li data-component="' + v34Esc(c.id) + '"><details class="v28-q v34-comp"><summary>' + v34Esc(v34Str(c.name)) + '</summary><div class="v34-body">'
          + (say ? '<p><span class="v28-soft">' + v34W('say') + ':</span> ' + v34Esc(say) + '</p>' : '')
          + (explain ? v34Paras(explain) : '')
          + (card ? '<dl class="v28-dl"><dt>' + v34W('cardFront') + '</dt><dd>' + v34Esc(card.front) + '</dd><dt>' + v34W('cardBack') + '</dt><dd>' + v34Esc(card.back) + '</dd></dl>' : '')
          + (vids.length && typeof v30Item === 'function' ? '<p class="v28-soft">' + v34W('videoNote') + '</p><ul class="v30-list">' + vids.map(function (v) { return v30Item(h, v, false); }).join('') + '</ul>' : '')
          + '</div></details></li>';
      }).join('') + '</ul>';
  }).join('');
  return '<section class="v28-block v34-madeof" aria-labelledby="v34-madeof-h"><h3 class="secgroup" id="v34-madeof-h">' + v34W('madeOf') + '</h3>' + body
    + (cards ? '<div class="v28-btnrow"><button type="button" class="btn gold" data-v28="v34flash" data-id="' + v34Esc(id) + '">' + v34W('flashThese') + '</button></div>' : '')
    + '</section>';
}

/* =========== compare with =========== */

function v34Fold(s) { return (typeof v28Fold === 'function') ? v28Fold(s) : String(s || '').toLowerCase(); }
function v34Grape(ref) {
  var f = v34Fold(ref);
  var hit = null;
  [['GRAPES', true], ['GRAPES_PLUS', false]].some(function (p) {
    var list = null;
    try { list = p[0] === 'GRAPES' ? (typeof GRAPES !== 'undefined' ? GRAPES : null) : (typeof GRAPES_PLUS !== 'undefined' ? GRAPES_PLUS : null); } catch (e) { list = null; }
    return Array.isArray(list) && list.some(function (g) { if (g && typeof g.g === 'string' && v34Fold(g.g) === f) { hit = { g: g, flash: p[1] }; return true; } return false; });
  });
  return hit;
}
function v34Producer(ref) {
  if (typeof WINE_PRODUCERS === 'undefined' || !Array.isArray(WINE_PRODUCERS)) return null;
  var f = v34Fold(ref);
  var hit = null;
  WINE_PRODUCERS.some(function (r) { if (r && typeof r.p === 'string' && v34Fold(r.p) === f) { hit = r; return true; } return false; });
  return hit;
}
/* A chapter at the current level by its category: the level's own chapter of
   that name, else the Regionale chapter the home's map files under it (the
   Intro chapters carry no category, codex28's rule); { key, name } or null. */
function v34Primer(ref) {
  if (typeof PRIMERS === 'undefined' || !Array.isArray(PRIMERS)) return null;
  var f = v34Fold(ref);
  var hit = null;
  PRIMERS.some(function (p) { if (p && typeof p.cat === 'string' && v34Fold(p.cat) === f) { hit = { key: p.cat, name: p.cat }; return true; } return false; });
  if (hit) return hit;
  if (typeof V25_INTRO_CHAPTERS !== 'undefined' && V25_INTRO_CHAPTERS) {
    Object.keys(V25_INTRO_CHAPTERS).some(function (cat) {
      if (v34Fold(cat) !== f) return false;
      PRIMERS.forEach(function (p, i) { if (!hit && p && typeof p.cat !== 'string' && p.id === V25_INTRO_CHAPTERS[cat]) hit = { key: i, name: cat }; });
      return true;
    });
  }
  return hit;
}
function v34Suite() {
  try { return typeof location !== 'undefined' && location && typeof location.pathname === 'string' && location.pathname.indexOf('/codex') === 0; } catch (e) { return false; }
}
/* A link into another room on the suite's path when the room answers, else words with the offline note. */
function v34RoomLink(room, href, label) {
  if (!href || !v34Suite()) return '<span class="v34-label">' + v34Esc(label) + '</span>';
  var online = typeof v28Online === 'function' ? v28Online() : true;
  var installed = typeof V28_ROOMS !== 'undefined' && V28_ROOMS && V28_ROOMS[room] === true;
  if (online || installed) return '<a class="v28-link v34-label" href="' + v34Esc(href) + '">' + v34Esc(label) + '</a> <span class="v28-soft">' + v34W('inRoom', { room: V34_ROOM_NAME[room] }) + '</span>';
  return '<span class="v34-label">' + v34Esc(label) + '</span> <span class="v28-soft">' + v34W('offlineRoom', { room: V34_ROOM_NAME[room] }) + '</span>';
}
function v34LedgerSlug(name) { return String(name).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }

/* The head of one comparison: its label and the door it opens. */
function v34CompareHead(h, e) {
  var label = v34Str(e.label);
  var ref = v34Str(e.ref);
  if (e.app === 'classic' || !ref) return '<span class="v34-label">' + v34Esc(label) + '</span>' + (e.app === 'classic' ? ' <span class="v28-soft">' + v34W('classic') + '</span>' : '');
  if (e.app === 'table') return v34RoomLink('table', /^(recipe|technique)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(ref) ? '/table/' + ref : '', label);
  if (e.app === 'ledger') return v34RoomLink('ledger', '/ledger/#/library/' + v34LedgerSlug(ref), label);
  /* the Codex's own doors */
  var wine = /^w-[a-z0-9]{8}$/.test(ref) && h && Array.isArray(h.wines) ? h.wines.filter(function (w) { return w && w.id === ref; })[0] : null;
  if (wine) return '<button type="button" class="v28-link v34-door" data-v28="open" data-id="' + v34Esc(ref) + '">' + v34Esc(label) + '</button> <span class="v28-soft">' + v34W('ourWine') + '</span>';
  var grape = v34Grape(ref);
  if (grape && grape.flash) return '<button type="button" class="v28-link v34-door" data-v28="grape" data-g="' + v34Esc(grape.g.g) + '">' + v34Esc(label) + '</button> <span class="v28-soft">' + v34W('grapeCard') + '</span>';
  if (grape) {
    var rows = [];
    if (grape.g.st) rows.push(['Structure', grape.g.st]);
    if (grape.g.tell) rows.push(['Giveaway', grape.g.tell]);
    return '<span class="v34-label">' + v34Esc(label) + '</span>' + (rows.length && typeof v28Dl === 'function' ? v28Dl(rows) : '');
  }
  var prod = v34Producer(ref);
  if (prod && prod.id) return '<button type="button" class="v28-link v34-door" data-v28="producer" data-k="' + v34Esc(prod.id) + '">' + v34Esc(label) + '</button> <span class="v28-soft">' + v34W('producerDoor') + '</span>';
  var primer = v34Primer(ref);
  if (primer) return '<button type="button" class="v28-link v34-door" data-v28="primer" data-k="' + v34Esc(String(primer.key)) + '">' + v34Esc(label) + '</button> <span class="v28-soft">' + v34W('primerDoor') + '</span>';
  return '<span class="v34-label">' + v34Esc(label) + '</span>';
}
function v34CompareHtml(h, item) {
  var entries = v34Kept(item && item.compare);
  if (!Array.isArray(entries)) return '';
  var rows = entries.filter(function (e) { return e && v34Str(e.label); }).map(function (e) {
    return '<li data-app="' + v34Esc(e.app) + '">' + v34CompareHead(h, e)
      + (v34Str(e.same) ? '<span class="v34-sub"><span class="v28-soft">' + v34W('same') + ':</span> ' + v34Esc(v34Str(e.same)) + '</span>' : '')
      + (v34Str(e.different) ? '<span class="v34-sub"><span class="v28-soft">' + v34W('different') + ':</span> ' + v34Esc(v34Str(e.different)) + '</span>' : '')
      + '</li>';
  });
  if (!rows.length) return '';
  return '<section class="v28-block v34-compare" aria-labelledby="v34-compare-h"><h3 class="secgroup" id="v34-compare-h">' + v34W('compareWith') + '</h3><ul class="v34-cmp">' + rows.join('') + '</ul></section>';
}

/* =========== on the card =========== */

/* Before the five parts when the card shows them, else before the service note. */
if (typeof v28CardHtml === 'function') {
  var _v34CardHtml = v28CardHtml;
  v28CardHtml = function (id) {
    var html = _v34CardHtml(id);
    var h = v34House();
    if (!html || !h) return html;
    var item = Array.isArray(h.wines) ? h.wines.filter(function (w) { return w && w.id === id; })[0] : null;
    if (!item) return html;
    var blocks = v34MadeOfHtml(h, id) + v34CompareHtml(h, item);
    if (!blocks) return html;
    var parts = typeof v28W === 'function' ? '<section class="v28-block"><h3 class="secgroup">' + v28W('parts') + '</h3>' : '';
    var note = typeof v28W === 'function' ? '<section class="v28-block"><p class="v28-eyebrow">' + v28W('eyebrow') : '';
    var at = parts ? html.indexOf(parts) : -1;
    if (at < 0 && note) at = html.indexOf(note);
    if (at < 0) return html;
    return html.slice(0, at) + blocks + html.slice(at);
  };
}

/* The card's flash button: the wine's component deck, dealt at once. */
if (typeof v28Act === 'function') {
  var _v34Act = v28Act;
  v28Act = function (act, node) {
    if (act === 'v34flash') {
      var id = node && typeof node.getAttribute === 'function' ? node.getAttribute('data-id') || '' : '';
      if (typeof v32StartRun === 'function') v32StartRun('item-components:' + id, { push: true, keepOrder: true });
      return;
    }
    return _v34Act(act, node);
  };
}

/* =========== the decks =========== */

if (typeof v32DeckDef === 'function') {
  var _v34DeckDef = v32DeckDef;
  v32DeckDef = function (id) {
    var s = String(id || '');
    var m;
    if (s === 'components' || (m = /^components:(ingredient|technique|story)$/.exec(s)) || (m = /^item-components:(w-[a-z0-9]{8})$/.exec(s))) {
      var h = v34House();
      var def = { id: s, name: '', cards: [], kind: 'component' };
      if (s === 'components') { def.name = v34W('everyComponent'); def.cards = v34Cards(h); }
      else if (s.indexOf('components:') === 0) { def.name = V34_LABELS[m[1]]; def.cards = v34Cards(h).filter(function (c) { return c.ck === m[1]; }); }
      else {
        var w = h && Array.isArray(h.wines) ? h.wines.filter(function (x) { return x && x.id === m[1]; })[0] : null;
        def.name = v34W('itemDeck', { name: w ? w.name : 'One wine' });
        def.cards = v34ItemCards(h, m[1]);
      }
      def.learnt = v32Learnt(def);
      return def;
    }
    return _v34DeckDef(id);
  };
}
if (typeof v32Learnt === 'function') {
  var _v34Learnt = v32Learnt;
  v32Learnt = function (def) {
    if (def && def.kind === 'component') return def.cards.filter(function (c) { return typeof v32Latest === 'function' && v32Latest(c.id) === 'got'; }).length;
    return _v34Learnt(def);
  };
}
/* One wine's components are dealt in the order its card shows them. */
if (typeof v32StartRun === 'function') {
  var _v34StartRun = v32StartRun;
  v32StartRun = function (deckId, opts) {
    var o = opts || {};
    if (/^item-components:/.test(String(deckId || ''))) o.keepOrder = true;
    return _v34StartRun(deckId, o);
  };
}
/* A component's grade is recorded as a word's is, under its own key. */
if (typeof v32Grade === 'function') {
  var _v34Grade = v32Grade;
  v32Grade = function (got) {
    var r = S._v32run;
    var c = r && r.flip && r.deck && r.deck.length ? r.cards[r.deck[0]] : null;
    if (c && c.kind === 'component' && typeof v27RecordHouse === 'function') v27RecordHouse('h-' + c.id + '-component', 'Our List', c.front, !!got);
    return _v34Grade(got);
  };
}
if (typeof v32CardFace === 'function') {
  var _v34CardFace = v32CardFace;
  v32CardFace = function (c, run) {
    if (!c || c.kind !== 'component') return _v34CardFace(c, run);
    var head = '<span class="v28-eyebrow v28-ink">' + v32W('front') + (c.label ? ' · ' + v34Esc(c.label) : '') + '</span>';
    if (!run.flip) return '<button type="button" class="card v28-front" data-v32="flip" id="v32-face">' + head + '<span class="v28-fname">' + v34Esc(c.front) + '</span></button>';
    return '<div class="card v28-back" id="v32-face"><p class="v28-eyebrow v28-ink">' + v32W('answer') + (c.label ? ' · ' + v34Esc(c.label) : '') + '</p>'
      + '<h3 class="v28-bname" tabindex="-1" id="v32-ans">' + v34Esc(c.front) + '</h3><p>' + v34Esc(c.back) + '</p></div>';
  };
}
/* The Flashcards root: a deck per kind, under What it's made of, before the words. */
if (typeof v32FlashcardsHtml === 'function') {
  var _v34FlashcardsHtml = v32FlashcardsHtml;
  v32FlashcardsHtml = function () {
    var html = _v34FlashcardsHtml();
    if (!v34House() || typeof v32Group !== 'function' || typeof v32DeckRow !== 'function') return html;
    var rows = V34_KINDS.map(function (k) { return v32DeckRow('components:' + k); }).join('');
    var group = v32Group(v34W('madeOf'), rows, 'v34-fc-made');
    if (!group) return html;
    var at = html.indexOf('<section class="v32-group" aria-labelledby="v32-fc-words"');
    if (at < 0) at = html.lastIndexOf('</div>');
    return at < 0 ? html : html.slice(0, at) + group + html.slice(at);
  };
}

/* =========== the door from another room =========== */

var V34_WANT = null;
(function () {
  try {
    if (typeof location === 'undefined' || !location) return;
    var hash = typeof location.hash === 'string' ? location.hash : '';
    var m = /^#ref=(.+)$/.exec(hash);
    if (!m) return;
    var ref = '';
    try { ref = decodeURIComponent(m[1]); } catch (e) { ref = m[1]; }
    if (!ref || ref.length > 200) return;
    V34_WANT = ref;
    if (typeof history !== 'undefined' && history && typeof history.replaceState === 'function') {
      history.replaceState(null, '', (location.pathname || '') + (typeof location.search === 'string' ? location.search : ''));
    }
  } catch (e) { V34_WANT = null; }
})();

/* Opens the door a ref names: a grape's profile in the run of every grape, a producer, a primer. True when one opened. */
function v34OpenRef(ref) {
  var grape = v34Grape(ref);
  if (grape && typeof v32StartRun === 'function') return v32StartRun('grapes-all', { push: true, first: grape.g.g }) !== false;
  var prod = v34Producer(ref);
  if (prod && prod.id) {
    var ci = 0;
    try { if (typeof prodGroups === 'function') prodGroups().forEach(function (g, i) { if (g.rows.indexOf(prod) >= 0) ci = i; }); } catch (e) { }
    S._v25area = 'library'; S._prod = { c: ci, id: prod.id }; S.view = 'producers';
    if (typeof V32 !== 'undefined' && V32) V32.pend = 'push';
    render();
    return true;
  }
  var primer = v34Primer(ref);
  if (primer) {
    S._v25area = 'library'; S.primerKey = primer.key; S.view = 'primer';
    if (typeof V32 !== 'undefined' && V32) V32.pend = 'push';
    render();
    return true;
  }
  return false;
}

/* The outermost render: the first one honours the door, once. */
var _v34Render = render;
render = function () {
  if (V34_WANT) {
    var want = V34_WANT;
    V34_WANT = null;
    var out = _v34Render.apply(this, arguments);
    try { v34OpenRef(want); } catch (e) { }
    return out;
  }
  return _v34Render.apply(this, arguments);
};
