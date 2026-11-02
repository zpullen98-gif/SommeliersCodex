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

/* =========== 3. the card =========== */

/* The row a card draws and its neighbours, by codex28's own rule: the list
   as shown (the meal, the search, the section), the position in its
   section or among the found, Previous and Next in the list's order. */
function v54RowOf(id) {
  var h = v54House();
  var st = v28State();
  var rows = v28Rows();
  var meal = v28Meal(v28MealNames(h, rows));
  var list = v28Shown(v28MealRows(rows, meal), st);
  var r = v28Find(list, id) || v28Find(rows, id);
  if (!r) return null;
  if (!v28Find(list, id)) list = [r];
  var inSec = list.filter(function (x) { return x.section === r.section && x.bottle === r.bottle; });
  var pos = v54Str(st.q) ? v28W('found', { i: list.indexOf(r) + 1, n: list.length })
    : v28W('position', { i: inSec.indexOf(r) + 1, n: inSec.length, section: r.section });
  return { h: h, st: st, r: r, item: r.item || null, pos: pos, prev: v28Pick(r, list, -1), next: v28Pick(r, list, 1) };
}

function v54Open(id) {
  var st = (typeof v28State === 'function') ? v28State() : null;
  var card = st && st.v54open && st.v54open.card === id ? st.v54open : null;
  return function (sec) { return !!(card && card.secs && card.secs[sec]); };
}
function v54Block(id, title, body, cls) {
  if (!body) return '';
  return '<section class="v28-block v54-block' + (cls ? ' ' + cls : '') + '" id="v54-' + id + '" aria-labelledby="v54-' + id + '-h">'
    + '<h3 class="secgroup v54-h" id="v54-' + id + '-h">' + v54Esc(title) + '</h3>' + body + '</section>';
}
/* A closed section: a disclosure whose summary is the heading; its open state kept by the DOM pass. */
function v54Closed(id, title, body, open, cls) {
  if (!body) return '';
  return '<section class="v28-block v54-block' + (cls ? ' ' + cls : '') + '" id="v54-' + id + '">'
    + '<details class="v28-q v54-fold" data-v54-sec="' + v54Esc(id) + '"' + (open ? ' open' : '') + '><summary class="secgroup v54-h">' + v54Esc(title) + '</summary>'
    + '<div class="v54-foldbody">' + body + '</div></details></section>';
}
function v54Eyebrow(word) { return '<h4 class="v28-eyebrow">' + v54Esc(word) + '</h4>'; }
function v54Ul(items) { var list = items.filter(Boolean); return list.length ? '<ul class="v28-list">' + list.join('') + '</ul>' : ''; }
function v54Quote(s) { return s ? '<span class="v28-say">"' + v54Esc(s) + '"</span>' : ''; }
function v54Q(s) { return (typeof V28_QUOTE === 'function') ? V28_QUOTE(s) : v54Esc(s); }

/* A dish named once as a link on the card, plain words after (codex28's rule for a second mention). */
function v54Linker() {
  var seen = {};
  return function (d) {
    if (!d) return '';
    if (seen[d.id]) return v54Esc(d.name);
    seen[d.id] = 1;
    return v28RoomName('table', d.id, d.name);
  };
}

/* 3.1 the title row: the position and one Next, the eyebrow, the name, the bin and the size on one line, the price */
function v54TitleHtml(C) {
  var r = C.r, item = C.item, h = C.h;
  var html = '<div class="v28-cardnav v54-titlerow"><span class="v28-pos">' + v54Esc(C.pos) + '</span>'
    + (C.next ? '<button type="button" class="btn small ghost" data-v28="open" data-id="' + v54Esc(C.next.id) + '" data-step="1">' + v54W('next') + '</button>' : '')
    + '</div>';
  var brow = [r.section];
  if (item && item.signature) brow.push('Signature');
  html += '<p class="v28-eyebrow v28-top">' + v54Esc(brow.join(' · ')) + '</p>';
  html += '<h2 class="v28-title" id="v28-h" tabindex="-1">' + v54Esc(r.name) + '</h2>';
  var bits = '';
  if (v54Str(item.bin)) bits += '<span class="lvltag v29-bintag">' + v54Esc((typeof v29W === 'function') ? v29W('binOf', { bin: v54Str(item.bin) }) : 'Bin ' + v54Str(item.bin)) + '</span>';
  if (v54Str(item.size)) bits += '<span class="v29-size">' + v54Esc(item.size) + '</span>';
  if (bits) html += '<p class="v29-binline v54-binline">' + bits + '</p>';
  if (r.price && v28Printed(item)) {
    html += '<p class="v28-price-line"><span class="lvltag">' + v54Esc(r.price) + '</span></p>';
    if (h && h.menusReadOn) html += '<p class="v28-soft">' + v54Esc(v28W('asPrinted', { date: v28Date(h.menusReadOn) })) + '</p>';
  } else if (r.price) html += '<p class="v28-pour">' + v54Esc(r.price) + '</p>';
  return html;
}

/* 3.2 At the table */
function v54Lines(item) {
  var l = v28LinesShown(item);
  var raw = v54KV(item, 'lines') || {};
  l.sale = v54Str(raw.sale);
  return l;
}
function v54TableHtml(C) {
  var item = C.item;
  var l = v54Lines(item);
  var say = v54Str(v54KV(item, 'say'));
  var sale = l.sale ? '<hr class="v54-rule"><p class="v28-eyebrow v54-sale-h">' + v54W('sale') + '</p><p class="v54-sale">' + v54Esc(l.sale) + '</p>' : '';
  var body = '';
  if (l.s45) body += '<p class="v28-eyebrow">' + v54W('fortyFive') + '</p><p class="v28-timed v54-fortyfive" id="v28-s45">' + v54Esc(l.s45) + '</p>' + sale;
  if (l.s10) body += '<p class="v28-eyebrow">' + v54W('ten') + '</p><p class="v28-ten v54-ten" id="v28-s10">' + v54Esc(l.s10) + '</p>';
  if (!l.s45) body += sale;
  if (l.s20) body += '<p class="v28-eyebrow">' + v54W('twenty') + '</p><p class="v28-timed v54-twenty" id="v28-s20">' + v54Esc(l.s20) + '</p>';
  if (say) body += '<p class="v28-eyebrow">' + v54W('say') + '</p><p class="v28-sayit">' + v54Esc(say) + '</p>';
  return v54Block('table', v54W('atTable'), body, 'v54-table');
}

/* 3.3 Where we pour it: every list read from the dishes' own pairings */
function v54Pairings(h, id) {
  var out = { first: [], second: [], bottles: [], zero: [] };
  v54List(h && h.dishes).forEach(function (d) {
    var p = d && v54KV(d, 'pairing');
    if (!p || typeof p !== 'object') return;
    if (p.wineId === id) {
      out.first.push({ dish: d, sayIt: v54Str(p.sayIt) });
      var c = p.zeroProofId && typeof v28Drink === 'function' ? v28Drink(h, p.zeroProofId) : null;
      if (c) out.zero.push({ drink: c, dish: d });
    }
    if (p.secondId === id) out.second.push({ dish: d });
    var b = p.bottles;
    if (b && typeof b === 'object') {
      ['value', 'classic', 'splurge', 'half'].forEach(function (t) {
        if (b[t] && b[t].wineId === id) out.bottles.push({ dish: d, tier: t, sayIt: v54Str(b[t].sayIt) });
      });
    }
  });
  return out;
}
function v54TierWord(t) {
  var keys = { value: 'tierValue', classic: 'tierClassic', splurge: 'tierSplurge', half: 'tierHalf' };
  var w = (typeof v29W === 'function') ? v29W(keys[t] || '') : '';
  return w || t;
}
function v54WhereHtml(C, link) {
  var h = C.h, item = C.item;
  var P = v54Pairings(h, item.id);
  var body = '';
  if (P.first.length) body += v54Eyebrow(v54W('firstFor')) + v54Ul(P.first.map(function (x) { return '<li>' + link(x.dish) + v54Quote(x.sayIt) + '</li>'; }));
  if (P.second.length) body += v54Eyebrow(v54W('secondFor')) + v54Ul(P.second.map(function (x) { return '<li>' + link(x.dish) + '</li>'; }));
  if (P.bottles.length) body += v54Eyebrow(v54W('byBottle')) + v54Ul(P.bottles.map(function (x) {
    return '<li><span class="v29-tier">' + v54Esc(v54TierWord(x.tier)) + ':</span> ' + link(x.dish) + v54Quote(x.sayIt) + '</li>';
  }));
  var pours = (typeof v28Pours === 'function') ? v28Pours(h, item.id) : [];
  if (pours.length) body += v54Eyebrow(v54W('tastings')) + v54Ul(pours.map(function (p) {
    var dishes = v54List(p.course && p.course.dishIds).map(function (did) { return link(v28Dish(h, did)); }).filter(Boolean);
    var label = v54Str(p.course.label) || v54W('course', { n: p.course.n });
    return '<li>' + v54Esc(v54Str(p.tasting.name)) + ', ' + v54Esc(label) + (v54Str(p.course.pourText) ? ', ' + v54Esc(p.course.pourText) : '')
      + (dishes.length ? ', ' + v54W('withDishes', { dishes: dishes.join(v54W('orWord')) }) : '') + '</li>';
  }));
  if (P.zero.length) body += v54Eyebrow(v54W('zeroHead')) + v54Ul(P.zero.map(function (x) {
    return '<li>' + v54W('zeroWith', { drink: v28RoomName('ledger', x.drink.id, x.drink.name), dish: v54Esc(x.dish.name) }) + '</li>';
  }));
  return v54Block('where', v54W('where'), body, 'v54-where');
}

/* 3.4 The wine: the facts, the profile, how we pour it, what it goes with, and About it closed */
function v54WineHtml(C, open) {
  var h = C.h, item = C.item, r = C.r;
  var facts = [];
  var add = function (label, v) { if (v54Str(v)) facts.push([label, v54Str(v)]); };
  add(v54W('producer'), item.producer);
  add(v54W('wineName'), item.wine);
  add(v54W('vintage'), item.vintage);
  add(v54W('region'), item.region);
  add(v54W('grapes'), v28Grapes(item).join(', '));
  add(v54W('style'), item.style);
  if (v28IsBottle(item)) add(v54W('bottle'), v28PriceLine(item, h) || item.bottle);
  else {
    var hasPrice = v54List(item.prices).some(function (p) { return p && v54Str(p.printed); });
    if (hasPrice) add(v54W('byGlass'), v28PriceLine(item, h));
    else if (v28Pours(h, item.id).length) add(v54W('byGlass'), v54W('onTastings'));
    add(v54W('bottle'), v54Str(item.bottle) || v28W('bottleNone'));
  }
  var body = v28Dl(facts);
  if (v28IsBottle(item) && item.verifiedOn) body += '<p class="v28-soft">' + v54Esc(v28W('verified', { date: v28Date(item.verifiedOn) })) + '</p>';
  var profile = v54Str(v54KV(item, 'profile'));
  var serve = v54Str(v54KV(item, 'serve'));
  var goes = v54Str(v54KV(item, 'goesWith'));
  var pairs = v54Str(v54KV(item, 'pairs'));
  if (profile) body += v54Eyebrow(v54W('profile')) + '<p>' + v54Esc(profile) + '</p>';
  if (serve) body += v54Eyebrow(v54W('served')) + '<p>' + v54Esc(serve) + '</p>';
  if (goes || pairs) {
    body += v54Eyebrow(v54W('goesWith'));
    if (goes) body += '<p>' + v54Esc(goes) + '</p>';
    if (pairs && v28Fold(pairs) !== v28Fold(goes)) body += '<p>' + v54Esc(pairs) + '</p>';
  }
  var notes = v28NotesFor(item);
  if (notes.about) body += '<details class="v28-q v54-about" data-v54-sec="about"' + (open('about') ? ' open' : '') + '><summary>' + v54W('about') + '</summary><div class="v28-about">' + v28Paras(notes.about.a) + '</div></details>';
  void r;
  return v54Block('wine', v54W('wine'), body, 'v54-wine');
}

/* 3.5 In the Codex: one door per destination */

/* The Court's subject a wine belongs to: the subject whose map lists the
   wine's region slug, else the one place subject whose map lists its
   country key; a place subject before a styles one, a styles one before
   a foundation, and among those the one that names the fewest places (the
   narrowest), then the syllabus order. */
function v54Places(s) { var m = (s && s.map) || {}; return v54List(m.regions).length + v54List(m.countries).length; }
/* a place subject (a country's or a region's) is 0, a styles one 1, the rest (foundations, beyond wine, business) 2 */
var V54_PLACE_GROUPS = { france: 1, italy: 1, 'spain-portugal': 1, 'central-europe': 1, 'north-america': 1, 'southern-hemisphere': 1 };
function v54SubjectKind(s) { return v54Own(V54_PLACE_GROUPS, s && s.group) ? 0 : (s && s.group === 'styles' ? 1 : 2); }
function v54SubjectRank(a, b) {
  var sa = v54SubjectKind(a), sb = v54SubjectKind(b);
  if (sa !== sb) return sa - sb;
  var pa = v54Places(a), pb = v54Places(b);
  if (pa !== pb) return pa - pb;
  return (Number(a.order) || 0) - (Number(b.order) || 0);
}
function v54SubjectFor(item) {
  var region = v54Str(item && item.region);
  if (!region || typeof v39SlugFor !== 'function') return null;
  var subs = (typeof v53Subjects === 'function') ? v53Subjects() : ((typeof CMS !== 'undefined' && CMS && Array.isArray(CMS.subjects)) ? CMS.subjects : []);
  if (!subs.length) return null;
  var slug = v39SlugFor(region);
  if (!slug) return null;
  var art = (typeof v39Find === 'function') ? v39Find(slug) : null;
  var country = art ? v54Str(art.sheet) : ((typeof v39Country === 'function' && v39Country(slug)) ? slug : '');
  var hits = function (key, want) {
    if (!want) return [];
    return subs.filter(function (s) { return s && v54Str(s.id) && v54List(((s.map || {})[key])).indexOf(want) >= 0; }).sort(v54SubjectRank);
  };
  var byRegion = art ? hits('regions', slug) : [];
  if (byRegion.length) return byRegion[0];
  /* by the country only when one place subject holds it (France's seven never pick one for Arbois) */
  var byCountry = hits('countries', country);
  var places = byCountry.filter(function (s) { return v54SubjectKind(s) === 0; });
  if (places.length === 1) return places[0];
  return places.length ? null : (byCountry[0] || null);
}

/* The Court's grid reads a grape in named places; the card's door opens a
   grape's grid only when one of those places is, word for word, a part of
   the wine's own region (Côte de Beaune in "Meursault, Côte de Beaune,
   Burgundy, France"), never by a country or a near name. */
function v54GridReads() {
  if (typeof v53GridReads === 'function') { try { return v53GridReads() || {}; } catch (e) { return {}; } }
  return (typeof GRID_READS !== 'undefined' && GRID_READS && typeof GRID_READS === 'object') ? GRID_READS : {};
}
function v54GrapeSlugs(item) {
  var out = [];
  if (typeof v53GrapeKey !== 'function') return out;
  v28Grapes(item).forEach(function (g) { var s = v53GrapeKey(g); if (s && out.indexOf(s) < 0) out.push(s); });
  return out;
}
function v54GridFor(item) {
  var parts = v54Str(item && item.region).split(',').map(v54Fold).filter(Boolean);
  if (!parts.length) return null;
  var R = v54GridReads();
  var hit = null;
  v54GrapeSlugs(item).some(function (slug) {
    var g = v54Own(R, slug) ? R[slug] : null;
    return v54List(g && g.reads).some(function (read) {
      var places = v54Str(read && read.region).split(/,| and /).map(v54Fold).filter(Boolean);
      var at = places.filter(function (p) { return parts.indexOf(p) >= 0; })[0];
      if (!at) return false;
      hit = { slug: slug, grape: v54Str(g.name) || slug, region: v54Str(read.region) };
      return true;
    });
  });
  return hit;
}

function v54Chip(act, attrs, dest, label) {
  return '<button type="button" class="btn small ghost" data-v28="' + act + '"' + attrs + ' data-v54-dest="' + v54Esc(dest) + '">' + v54Esc(label) + '</button>';
}
function v54CodexDoors(item) {
  var doors = [];
  var seen = {};
  var add = function (dest, html) { if (!dest || !html || seen[dest]) return; seen[dest] = 1; doors.push(html); };
  /* the grape pages */
  v54GrapeSlugs(item).forEach(function (slug) {
    var name = (typeof v53GrapeName === 'function') ? v53GrapeName(slug) : slug;
    add('grape:' + slug, v54Chip('v54grape', ' data-k="' + v54Esc(slug) + '"', 'grape:' + slug, v54W('grapeDoor', { name: name })));
  });
  /* the region in depth, or its country: codex39's own door, named for this layer */
  if (typeof v39CardDoor === 'function') {
    var reg = '';
    try { reg = v39CardDoor(item) || ''; } catch (e) { reg = ''; }
    var m = /data-slug="([^"]+)"/.exec(reg);
    if (m) add('region:' + m[1], reg.replace('<button ', '<button data-v54-dest="region:' + m[1] + '" '));
  }
  /* one map */
  var terroir = (typeof v28Terroir === 'function') ? v28Terroir(item) : [];
  var sheet = (typeof v28Map === 'function') ? v28Map(item, terroir) : null;
  if (sheet && sheet.id) add('map:' + sheet.id, v54Chip('map', ' data-k="' + v54Esc(sheet.id) + '"', 'map:' + sheet.id, v54W(sheet.overview ? 'mapOverview' : 'mapDoor', { sheet: sheet.name || sheet.id })));
  /* the producer, the chapter */
  var prod = (typeof v28Producer === 'function') ? v28Producer(item) : null;
  if (prod && prod.id) add('producer:' + prod.id, v54Chip('producer', ' data-k="' + v54Esc(prod.id) + '"', 'producer:' + prod.id, v54W('producerDoor', { name: prod.p })));
  var primer = (typeof v28Primer === 'function') ? v28Primer(item) : null;
  if (primer) add('chapter:' + primer.key, v54Chip('primer', ' data-k="' + v54Esc(String(primer.key)) + '"', 'chapter:' + primer.key, v54W('chapterDoor', { cat: primer.name })));
  /* the Court's subject, the Court's grid */
  var sub = v54SubjectFor(item);
  if (sub) add('subject:' + sub.id, v54Chip('v54subject', ' data-k="' + v54Esc(sub.id) + '"', 'subject:' + sub.id, v54W('subjectDoor', { name: v54Str(sub.name) || sub.id })));
  var grid = v54GridFor(item);
  if (grid) add('grid:' + grid.slug, v54Chip('v54grid', ' data-k="' + v54Esc(grid.slug) + '"', 'grid:' + grid.slug, v54W('gridDoor', { grape: grid.grape, region: grid.region })));
  /* the illustrated guides codex36 maps to this wine */
  var guides = (typeof v36WineGuides === 'function') ? v36WineGuides(item) : [];
  guides.forEach(function (gid) {
    var e = (typeof CodexTeachingCache !== 'undefined' && CodexTeachingCache && typeof CodexTeachingCache.entry === 'function') ? CodexTeachingCache.entry(gid) : null;
    if (e) add('illus:' + gid, v54Chip('v54illus', ' data-k="' + v54Esc(gid) + '"', 'illus:' + gid, v54W('illusDoor', { title: v54Str(e.title) || gid })));
  });
  /* the culinary lessons codex37 maps to this wine, in a row of codex37's own class */
  var lessons = (typeof v37Mapped === 'function') ? v37Mapped('wineLessons', item.id) : [];
  var cul = lessons.map(function (lid) {
    var L = (typeof v37Lesson === 'function') ? v37Lesson(lid) : null;
    if (!L || seen['culinary:' + lid]) return '';
    seen['culinary:' + lid] = 1;
    return v54Chip('v54culinary', ' data-k="' + v54Esc(lid) + '"', 'culinary:' + lid, v54W('culinaryDoor', { title: v54Str(L.title) || lid }));
  }).filter(Boolean);
  return { doors: doors, culinary: cul, seen: seen, terroir: terroir };
}

/* Compare with, as a sub list: codex35's entries, a door already on the row above named in plain words */
function v54CompareHtml(h, item, seen) {
  if (typeof v35CompareHtml !== 'function') return '';
  var html = v35CompareHtml(h, item) || '';
  var m = /<ul class="v35-cmp">[\s\S]*<\/ul>/.exec(html);
  if (!m) return '';
  var list = m[0].replace(/<button type="button" class="v28-link v35-door" data-v28="(primer|producer)" data-k="([^"]*)">([\s\S]*?)<\/button>/g, function (all, act, k, label) {
    var dest = (act === 'primer' ? 'chapter:' : 'producer:') + k.replace(/&amp;/g, '&');
    return seen[dest] ? '<span class="v35-label">' + label + '</span>' : all;
  });
  return v54Eyebrow(v54W('compare')) + list;
}

/* The land, closed: the grapes and the region as the Codex's reference data has them */
function v54LandHtml(item, terroir) {
  var body = '';
  var grapes = (typeof v28GrapeProfiles === 'function') ? v28GrapeProfiles(item) : [];
  if (grapes.length) body += v54Eyebrow(v54W('landGrapes')) + grapes.map(function (g) {
    var p = g.p, rows = [];
    if (p.st) rows.push([v54W('structure'), v54Q(p.st), 1]);
    if (p.tell) rows.push([v54W('tell'), v54Q(p.tell), 1]);
    if (p.confuse) rows.push([v54W('confuse'), v54Q(p.confuse), 1]);
    return '<div class="v28-ref"><p class="v28-refname">' + v54Q(p.g) + '</p>' + v28Dl(rows) + '</div>';
  }).join('');
  if (terroir.length) body += v54Eyebrow(v54W('landRegion')) + terroir.map(function (t) {
    var rows = [];
    if (t.r.cl) rows.push([v54W('climate'), v54Q(t.r.cl), 1]);
    if (t.r.so) rows.push([v54W('soil'), v54Q(t.r.so), 1]);
    if (t.r.note) rows.push([v54W('note'), v54Q(t.r.note), 1]);
    return '<div class="v28-ref"><p class="v28-refname">' + v54Q(t.r.r) + '</p>' + v28Dl(rows) + '</div>';
  }).join('') + (typeof refView === 'function' ? '<div class="v28-btnrow"><button type="button" class="btn small ghost" data-v28="terroir" data-k="' + v54Esc(terroir[0].r.r) + '">' + v54W('terroir') + '</button></div>' : '');
  return body;
}

function v54CodexHtml(C, open) {
  var item = C.item;
  var D = v54CodexDoors(item);
  var body = '';
  if (D.doors.length) body += '<div class="v28-btnrow v54-chips v54-doors">' + D.doors.join('') + '</div>';
  if (D.culinary.length) body += '<div class="v28-btnrow v54-chips v37-doors">' + D.culinary.join('') + '</div>';
  body += v54CompareHtml(C.h, item, D.seen);
  var land = v54LandHtml(item, D.terroir);
  if (land) body += '<details class="v28-q v54-land" data-v54-sec="land"' + (open('land') ? ' open' : '') + '><summary>' + v54W('land') + '</summary>' + land + '</details>';
  return v54Block('codex', v54W('codex'), body, 'v54-codex');
}

/* 3.6 Who makes it, What it's made of: codex38's and codex35's blocks as
   they draw them, less the producers' library link (the producer's door is
   In the Codex), less the per component films (each film is under Watch,
   once) and less their flash rows (Practise this wine carries both), with
   Pronounced: for every respelling. */
function v54Pronounced(html) {
  var said = [];
  if (typeof v35W === 'function') said.push(v35W('say'));
  if (typeof v38W === 'function') said.push(v38W('say'));
  said.filter(function (w, i, all) { return w && all.indexOf(w) === i; }).forEach(function (w) {
    html = html.split('<span class="v28-soft">' + w + ':</span>').join('<span class="v28-soft">' + v54W('pronounced') + ':</span>');
  });
  return html;
}
function v54Rehead(html, oldId, id, title) {
  var at = html.indexOf('<h3 class="secgroup" id="' + oldId + '">');
  var end = at >= 0 ? html.indexOf('</h3>', at) : -1;
  if (end < 0) return '';
  var open = html.slice(0, html.indexOf('>') + 1);
  var rest = html.slice(end + '</h3>'.length);
  var cls = (/class="([^"]*)"/.exec(open) || ['', 'v28-block'])[1];
  return '<section class="' + cls + ' v54-block" id="v54-' + id + '" aria-labelledby="v54-' + id + '-h"><h3 class="secgroup v54-h" id="v54-' + id + '-h">' + v54Esc(title) + '</h3>' + rest;
}
function v54CutRow(html) {
  /* the block's own button row, the last before its closing tag */
  return html.replace(/<div class="v28-btnrow">(?:(?!<div)[\s\S])*?<\/div><\/section>$/, '</section>');
}
function v54WhoHtml(C) {
  if (typeof v38WhoHtml !== 'function') return '';
  var html = v38WhoHtml(C.h, C.item.id) || '';
  if (!html) return '';
  html = html.replace(/<p><button type="button" class="v28-link v35-door v38-lib"[^>]*>[\s\S]*?<\/button><\/p>/g, '');
  html = v54CutRow(html);
  return v54Pronounced(v54Rehead(html, 'v38-who-h', 'who', (typeof v38W === 'function') ? v38W('whoMakes') : 'Who makes it'));
}
function v54MadeOfHtml(C) {
  if (typeof v35MadeOfHtml !== 'function') return '';
  var html = v35MadeOfHtml(C.h, C.item.id) || '';
  if (!html) return '';
  var note = (typeof v35W === 'function') ? v35W('videoNote') : '';
  if (note) html = html.split('<p class="v28-soft">' + note + '</p>').join('');
  html = html.replace(/<ul class="v30-list">[\s\S]*?<\/ul>/g, '');
  html = v54CutRow(html);
  return v54Pronounced(v54Rehead(html, 'v35-madeof-h', 'madeof', (typeof v35W === 'function') ? v35W('madeOf') : 'What it’s made of'));
}

/* 3.7 The five parts, closed */
function v54PartsHtml(C, open) {
  var parts = v28PartsShown(C.item);
  return parts.length ? v54Closed('parts', v54W('parts'), v28Dl(parts), open('parts'), 'v54-parts') : '';
}

/* 3.8 On the floor: The guide's line first, then codex28's coaching (as
   codex29 lets a floor bottle have it), the house's words and the guests
   at the table that name this wine */
function v54FloorHtml(C) {
  var h = C.h, item = C.item;
  var l = v28LinesShown(item);
  var body = l.guestShown ? v54Eyebrow(v54W('guide')) + '<p class="v54-guide">' + v54Esc(l.guest) + '</p>' : '';
  var floor = v28FloorBlock(h, item) || '';
  var m = /^<section class="v28-block"><h3 class="secgroup">[^<]*<\/h3>([\s\S]*)<\/section>$/.exec(floor);
  body += m ? m[1] : '';
  var lu = v28Lineup(h, item.id);
  var terms = lu.terms.filter(function (t) { return t && t.term; });
  if (terms.length) body += v54Eyebrow(v54W('houseWords')) + '<dl class="v28-dl">' + terms.map(function (t) {
    var say = v54Str(v54KV(t, 'say')), guest = v54Str(v54KV(t, 'toGuest'));
    return '<dt>' + v54Esc(t.term) + '</dt><dd>' + (say ? '<span class="v28-soft">' + v54Esc(say) + '</span> ' : '') + v54Esc(guest) + '</dd>';
  }).join('') + '</dl>';
  var scen = lu.scenarios.filter(function (s) { return s && (s.title || s.guest); });
  if (scen.length) body += v54Eyebrow(v54W('scenes')) + v54Ul(scen.map(function (s) {
    return '<li>' + v54Esc(v54Str(s.title) || v54Str(s.guest)) + (v54Str(s.guest) && v54Str(s.title) ? v54Quote(s.guest) : '') + '</li>';
  }));
  return v54Block('floor', v54W('floor'), body, 'v54-floor');
}

/* 3.9 The service note */
function v54NoteHtml(C) {
  var note = v54Str(C.item.serviceNote);
  return v54Block('note', v54W('serviceNote'), '<p class="v28-eyebrow">' + v28W('eyebrow') + '</p><p>' + (note ? v54Esc(note) : v28W('noteNone')) + '</p>', 'v54-note');
}

/* 3.10 Watch: the wine's films and its components' films, each once, by id */
function v54Films(h, id) {
  var out = [], seen = {};
  var add = function (v) { if (v && v.id && !seen[v.id]) { seen[v.id] = 1; out.push(v); } };
  if (typeof v30VideosFor === 'function') v54List(v30VideosFor(h, id)).forEach(add);
  if (typeof v35Groups === 'function' && typeof v35Videos === 'function') {
    v54List(v35Groups(h, id)).forEach(function (g) { v54List(g && g.components).forEach(function (c) { if (c && c.id) v54List(v35Videos(h, c.id)).forEach(add); }); });
  }
  return out;
}
function v54WatchHtml(C) {
  if (typeof v30Item !== 'function') return '';
  var vids = v54Films(C.h, C.item.id);
  if (!vids.length) return '';
  var note = (typeof v30W === 'function') ? v30W('note') : '';
  return v54Block('watch', v54W('watch'), (note ? '<p class="v28-soft">' + v54Esc(note) + '</p>' : '')
    + '<ul class="v30-list">' + vids.map(function (v) { return v30Item(C.h, v, false); }).join('') + '</ul>', 'v30-watch');
}

/* 3.11 Practise this wine: one row */
function v54PractiseHtml(C) {
  var h = C.h, item = C.item, r = C.r;
  var b = function (cls, act, attrs, label) { return '<button type="button" class="btn ' + cls + '" data-v28="' + act + '"' + attrs + '>' + v54Esc(label) + '</button>'; };
  var id = ' data-id="' + v54Esc(item.id) + '"';
  var row = [];
  if (v28CardOf(item, h)) row.push(b('gold', 'cardsone', id, v54W('flashThis')));
  if (typeof v27OpenSay === 'function' && v28LinesShown(item).s10) row.push(b('ghost', 'say', id, v54W('sayPour')));
  var scen = v28Lineup(h, item.id).scenarios.filter(function (s) { return s && s.id && (s.title || s.guest); });
  if (scen.length && typeof v27OpenGuest === 'function') row.push(b('ghost', 'guest', ' data-k="' + v54Esc(scen[0].id) + '"', v54W('guestPlay')));
  if (typeof v38ItemCards === 'function' && v54List(v38ItemCards(h, item.id)).length) row.push(b('ghost', 'v38flash', id, v54W('itsProducers')));
  if (typeof v35ItemCards === 'function' && v54List(v35ItemCards(h, item.id)).length) row.push(b('ghost', 'v35flash', id, v54W('itsComponents')));
  var grapes = (typeof v28GrapeProfiles === 'function') ? v28GrapeProfiles(item).filter(function (g) { return g.flash; }) : [];
  grapes.forEach(function (g) {
    row.push(b('ghost', 'grape', ' data-g="' + v54Esc(g.p.g) + '"', grapes.length > 1 ? v54W('itsGrapeCardsOf', { grape: g.p.g }) : v54W('itsGrapeCards')));
  });
  var secN = v28Wines(h).filter(function (w) { return !v28IsBottle(w) && v54Str(w.section) === r.section; }).length;
  if (!v28IsBottle(item) && secN >= 3) row.push(b('ghost', 'drillsec', ' data-s="' + v54Esc(r.section) + '"', v54W('drillSection')));
  else row.push(b('ghost', 'drill', '', v54W('drillList')));
  return v54Block('practise', v54W('practise'), '<div class="v28-btnrow v54-practise-row">' + row.join('') + '</div>', 'v54-practise');
}

/* 3.12 the footer: Edit, Previous, Next */
function v54FootHtml(C) {
  var html = '';
  if (v28HasHers(C.item)) html += '<p class="v28-soft">' + v28W('hers') + '</p>';
  return html + '<div class="v28-btnrow v28-foot"><button type="button" class="btn small ghost" data-v28="edit" data-id="' + v54Esc(C.r.id) + '">' + v28W('edit') + '</button>'
    + (C.prev ? '<button type="button" class="btn small ghost" data-v28="open" data-id="' + v54Esc(C.prev.id) + '" data-step="1">' + v54Esc(v28W('prev', { name: C.prev.name })) + '</button>' : '')
    + (C.next ? '<button type="button" class="btn small ghost" data-v28="open" data-id="' + v54Esc(C.next.id) + '" data-step="1">' + v54Esc(v28W('next', { name: C.next.name })) + '</button>' : '')
    + '</div>';
}

/* The card as one flow. Null for her own rows (no house record), which keep the earlier layers' card. */
function v54CardHtml(id) {
  var C = v54RowOf(id);
  if (!C || !C.item) return null;
  var open = v54Open(id);
  var link = v54Linker();
  return '<div class="v28 v28-card v54-card" id="v28-card">'
    + v54TitleHtml(C)
    + v54TableHtml(C)
    + v54WhereHtml(C, link)
    + v54WineHtml(C, open)
    + v54CodexHtml(C, open)
    + v54WhoHtml(C)
    + v54MadeOfHtml(C)
    + v54PartsHtml(C, open)
    + v54FloorHtml(C)
    + v54NoteHtml(C)
    + v54WatchHtml(C)
    + v54PractiseHtml(C)
    + v54FootHtml(C)
    + '</div>';
}

if (typeof v28CardHtml === 'function') {
  var _v54CardHtml = v28CardHtml;
  v28CardHtml = function (id) {
    var html = _v54CardHtml.apply(this, arguments);
    if (!html) return html;
    try { return v54CardHtml(id) || html; } catch (e) { return html; }
  };
}

/* =========== 4. the doors =========== */

if (typeof V28_DOORS !== 'undefined' && V28_DOORS) {
  ['v54grape', 'v54subject', 'v54grid', 'v54illus', 'v54culinary'].forEach(function (k) { V28_DOORS[k] = 1; });
}
if (typeof v28Act === 'function') {
  var _v54Act = v28Act;
  v28Act = function (act, node) {
    var out = _v54Act.apply(this, arguments);
    if (!/^v54/.test(String(act || ''))) return out;
    var k = node && typeof node.getAttribute === 'function' ? (node.getAttribute('data-k') || '') : '';
    var go = (typeof V25_GO !== 'undefined' && V25_GO) ? V25_GO : {};
    try {
      if (act === 'v54grape' && typeof go.grape === 'function') go.grape(k);
      else if (act === 'v54subject' && typeof go.cmssubject === 'function') go.cmssubject(k);
      else if (act === 'v54grid' && typeof go.griddrill === 'function') go.griddrill(k);
      else if (act === 'v54illus' && typeof v36Go === 'function') v36Go(k);
      else if (act === 'v54culinary' && typeof v37Go === 'function') v37Go(k);
    } catch (e) { }
    return out;
  };
}

/* =========== 5. the flash card back: the sale under the ten =========== */

function v54SaleBack(html, sale) {
  if (!sale || !html || html.indexOf('v54-sale') >= 0) return html;
  var at = html.indexOf('<p class="v28-ten">');
  var end = at >= 0 ? html.indexOf('</p>', at) : -1;
  if (end < 0) return html;
  end += '</p>'.length;
  return html.slice(0, end) + '<p class="v28-eyebrow v28-ink v54-sale-h">' + v54W('sale') + '</p><p class="v54-sale">' + v54Esc(sale) + '</p>' + html.slice(end);
}
if (typeof v28CardOf === 'function') {
  var _v54CardOf = v28CardOf;
  v28CardOf = function (item, h) {
    var c = _v54CardOf.apply(this, arguments);
    if (!c || !c.back) return c;
    try { var sale = v54Lines(item).sale; if (sale) c.back.sale = sale; } catch (e) { }
    return c;
  };
}
if (typeof v28DeckHtml === 'function') {
  var _v54DeckHtml = v28DeckHtml;
  v28DeckHtml = function () {
    var html = _v54DeckHtml.apply(this, arguments);
    try {
      var d = S._v28deck;
      if (!d || !d.flipped || typeof v28DeckCard !== 'function') return html;
      var c = v28DeckCard();
      return v54SaleBack(html, c && c.back && c.back.sale);
    } catch (e) { return html; }
  };
}
if (typeof v32CardFace === 'function') {
  var _v54CardFace = v32CardFace;
  v32CardFace = function (c, run) {
    var html = _v54CardFace.apply(this, arguments);
    try {
      if (!c || c.kind !== 'house' || !run || !run.flip) return html;
      return v54SaleBack(html, c.c && c.c.back && c.c.back.sale);
    } catch (e) { return html; }
  };
}
