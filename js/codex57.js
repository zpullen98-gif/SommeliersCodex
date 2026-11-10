/* ================== CODEX LVII: THE GRAPES TAB AT THE TABLE ==================

   The Grapes tab at the table, 9 November 2026. Loaded after codex56.js and
   js/data-grapes-table.js, before boot.js. It edits no earlier layer and no
   data file; every wrapper is typeof guarded and outermost, every registry is
   extended key by key, never replaced, and the layer declares with var and
   function only. Every string it shows lives in V57_WORDS (read by v57W); the
   table's own fields (GRAPE_TABLE, built by .scripts/grapes) are drawn as
   they are written. Its CSS lives in its own v57-style element, every
   selector under .wrap, every colour one of the house's own tokens so the
   night page and day service both read well.

   The owner asked for the Grapes tab to be expanded and improved: a tableside
   description at the top of each grape, tasting language more descriptive
   than the bare word citrus, the difference between the Old World and the
   New World styles of the same grape, and whatever else a master sommelier
   would improve. A read-only review found no line to say at the table, a
   bare family word at the top of the glass, a one word flag where the two
   worlds should be described, twelve thin pages, house grapes with no page
   and nothing for service. The content is one record a grape in GRAPE_TABLE;
   this layer reads it. It is a display overlay on the Grapes tab's own
   surfaces: GRAPES, GRAPES_PLUS, INTRO_GRAPES, TASTE and the grid data are
   never changed, and no question id, stem or card name is touched. A grape
   with no record in the table is drawn exactly as codex53 draws it.

   WHAT THIS LAYER OWNS:

   1. THE WORDS AND THE STYLE: V57_WORDS, v57W, and the v57-style element.

   2. THE JOIN: codex53's joined book of grapes, decorated once per object.
      The grapes the table adds take the join's own record shape; a grape the
      Codex held without a profile takes the table's; the table's label names
      become keys, first writer wins, so a name that resolved before resolves
      as it did; a new grape's regions are its record's and the regions'
      join's. The decks grapes and grapes-all, the blind flight and the
      Régionale table read the raw lists and are untouched.

   3. THE PAGE: At the table first (the forty-five second line, a rule, the
      sale, the ten and the twenty second lines, Say it), the glass leading
      the fruit section in named fruit (the lead, the notes by family, the
      climate ladder, the line of structure), Old World and New World side by
      side (or At home and abroad) before the regions, then Service and the
      table, What guests ask, On the label and Compare with before the
      Court's grid, and Sources closed at the foot. Each new section has its
      chip, the chips one line that scrolls sideways; the glass and the two
      worlds stand open; the sections a reader opened on a grape's page are
      kept for the sitting, so Back returns to the page as it was left. The
      one word flag Where it is grown and the row of bare family words leave
      where the table says more.

   4. THE ROOT ROWS: each grape's row shows its glass in a line.

   5. ON THE HOUSE'S LIST: the house's wines of the grape under Old World and
      New World (the producer and the wine alone, read live from the house),
      each opening its wine card and Back returning to the grape; nothing is
      drawn when no house is loaded. The layer's controls carry data-v57;
      V57_ACTS says what each does and one listener hears them all.

   6. THE SHELL: index.html loads js/data-grapes-table.js then js/codex57.js
      after codex56.js and before boot.js; the worker is codex-v116 and lists
      both.
*/

/* =========== 1. the words =========== */

var V57_WORDS = {
  /* at the table */
  atTable: 'At the table',
  fortyFive: 'In forty-five seconds',
  sale: 'The sale',
  ten: 'In ten seconds',
  twenty: 'In twenty seconds',
  say: 'Say it',
  /* the glass */
  ladderH: 'From cool to warm',
  climate_cool: 'Cool',
  climate_moderate: 'Moderate',
  climate_warm: 'Warm',
  structureH: 'Structure',
  cardH: 'As the grape card reads it',
  /* the two worlds */
  worldsH: 'Old World and New World',
  homeH: 'At home and abroad',
  oldWorld: 'Old World',
  newWorld: 'New World',
  where: 'Where',
  inGlass: 'In the glass',
  inCellar: 'In the cellar',
  why: 'Why they differ',
  blur: 'Where the line blurs',
  call: 'The blind call',
  atHome: 'At home',
  abroad: 'Abroad',
  /* service, the guest, the label, the neighbours, the sources */
  serviceH: 'Service and the table',
  temp: 'Temperature',
  glassware: 'Glass',
  decant: 'Decanting',
  age: 'Age',
  foodH: 'At the table, with food',
  guestH: 'What guests ask',
  labelH: 'On the label',
  compareH: 'Compare with',
  sourcesH: 'Sources',
  opensNew: ' (opens in a new tab)',
  /* the house's list */
  listH: 'On our list',
  listOne: 'One wine on our list is made with this grape. It opens its card.',
  listMany: '{n} wines on our list are made with this grape. Each opens its card.',
  worldCount: '{world} · {n}',
  elsewhere: 'Elsewhere',
  toList: 'On our list · {n}'
};

function v57W(key, vars) {
  var v = vars || {};
  return String(Object.prototype.hasOwnProperty.call(V57_WORDS, key) ? V57_WORDS[key] : key).replace(/\{(\w+)\}/g, function (m, k) {
    return Object.prototype.hasOwnProperty.call(v, k) ? String(v[k]) : m;
  });
}
function v57Esc(s) {
  if (typeof v32Esc === 'function') return v32Esc(s == null ? '' : String(s));
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function v57Str(s) { return typeof s === 'string' ? s.trim() : (typeof s === 'number' ? String(s) : ''); }
function v57List(x) { return Array.isArray(x) ? x : []; }
function v57Obj(x) { return (x && typeof x === 'object' && !Array.isArray(x)) ? x : {}; }
function v57Own(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
function v57Fold(s) {
  if (typeof v53cFold === 'function') return v53cFold(s);
  var t = String(s == null ? '' : s);
  try { t = t.normalize('NFD'); } catch (e) { }
  return t.replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/* The table: one record a grape, keyed by the join's slug; {} when the data is not on the device. */
function v57Table() {
  try { return (typeof GRAPE_TABLE !== 'undefined' && GRAPE_TABLE && typeof GRAPE_TABLE === 'object' && !Array.isArray(GRAPE_TABLE)) ? GRAPE_TABLE : {}; } catch (e) { return {}; }
}
/* A grape's record in the table, or null: a grape with none is drawn as codex53 draws it. */
function v57T(slug) {
  var t = v57Table();
  var s = v57Str(slug);
  var r = (s && v57Own(t, s)) ? t[s] : null;
  return (r && typeof r === 'object' && !Array.isArray(r)) ? r : null;
}

/* =========== the style =========== */

(function () {
  if (typeof document === 'undefined' || !document || typeof document.createElement !== 'function') return;
  var css = document.createElement('style');
  css.id = 'v57-style';
  css.textContent = [
    '.wrap .v57 [hidden]{display:none!important}',
    /* At the table, on the page's own ground: codex54's look restated (its rules reach a wine card alone). The
       forty-five large in the house reading face, the sale under a gold rule, the ten and the twenty quiet */
    '.wrap .v57-table{margin:6px 0 4px}',
    '.wrap .v57-table>.secgroup{font-family:var(--house-display,\'Cinzel\',Georgia,serif);border-bottom:1px solid var(--line);margin-top:14px}',
    '.wrap .v57-eyebrow{font-family:var(--house-display,\'Cinzel\',Georgia,serif);font-size:14px;letter-spacing:.07em;font-weight:500;color:var(--gold-soft);margin:14px 0 6px}',
    '.wrap .v57-fortyfive{font-family:var(--house-reading,Georgia,serif);font-size:20px;line-height:1.5;font-weight:600;color:var(--parch);margin:4px 0 0;padding-left:12px;border-left:2px solid var(--line)}',
    '.wrap .v57-rule{height:0;border:0;border-top:1px solid var(--gold);margin:16px 0 0}',
    '.wrap .v57-eyebrow.v57-sale-h{margin-top:10px;color:var(--gold)}',
    '.wrap .v57-sale{font-size:18px;line-height:1.5;color:var(--parch);margin:2px 0 4px}',
    '.wrap .v57-ten,.wrap .v57-twenty{font-size:16px;line-height:1.5;font-weight:400;color:var(--parch2);margin:2px 0 0}',
    '.wrap .v57-twenty{padding-left:12px;border-left:2px solid var(--line)}',
    '.wrap .v57-sayit{font-size:17px;line-height:1.5;color:var(--parch);margin:2px 0 0}',
    /* the sections' chips: fourteen on a phone, so one line that scrolls sideways, each chip whole */
    '.wrap .v57-page .v53-steps{flex-wrap:nowrap;overflow-x:auto;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;scrollbar-width:thin;margin:18px 0 20px;padding:10px 0}',
    '.wrap .v57-page .v53-steps .v28-chip{flex:0 0 auto;white-space:nowrap}',
    /* the glass, in the parchment section: the lead in the reading face, each family a quiet label beside its notes */
    '.wrap .v39-body .v57-glead{font-family:var(--house-reading,Georgia,serif);font-size:19px;line-height:1.5;font-weight:600;color:var(--ink);margin:6px 0 12px}',
    '.wrap .v57-notes{display:grid;grid-template-columns:minmax(0,7.4em) minmax(0,1fr);gap:6px 12px;margin:0 0 6px}',
    '.wrap .v57-notes dt{font-family:var(--house-display,\'Cinzel\',Georgia,serif);font-size:13px;letter-spacing:.05em;line-height:1.5;color:var(--ink-soft);padding-top:4px;overflow-wrap:anywhere}',
    '.wrap .v57-notes dd{margin:0;overflow-wrap:anywhere}',
    '.wrap .v57-ladder{list-style:none;margin:0 0 6px;padding:0}',
    '.wrap .v57-ladder li{margin:0 0 10px;padding:2px 0 2px 12px;border-left:3px solid var(--line)}',
    '.wrap .v57-ladder li.v57-cool{border-left-color:var(--green)}',
    '.wrap .v57-ladder li.v57-moderate{border-left-color:var(--gold)}',
    '.wrap .v57-ladder li.v57-warm{border-left-color:var(--claret)}',
    '.wrap .v57-climate{display:block;font-family:var(--house-display,\'Cinzel\',Georgia,serif);font-size:14px;letter-spacing:.05em;color:var(--claret)}',
    '.wrap .v39-body .v57-where{display:block;font-size:15px;line-height:1.45;color:var(--ink-soft)}',
    '.wrap .v57-rnotes{display:block}',
    '.wrap .v39-body .v57-structure{margin:0 0 4px}',
    /* the two worlds: two cards of the same three rows, one under the other on a phone, side by side from 600px */
    '.wrap .v57-sides{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;margin:6px 0 14px}',
    '@media(min-width:600px){.wrap .v57-sides{grid-template-columns:repeat(2,minmax(0,1fr))}}',
    '.wrap .v57-side{min-width:0;padding:12px 14px 14px;border:1px solid var(--field-line,var(--line));border-top:3px solid var(--claret);border-radius:3px}',
    '.wrap .v57-side.v57-new{border-top-color:var(--green)}',
    '.wrap .v57-side .v57-side-h{margin:0 0 8px}',
    '.wrap .v57-side p{margin:0}',
    '.wrap .v57-side .v57-sidedoor,.wrap .v39-body .v57-sidedoor{margin:12px 0 0}',
    '.wrap .v57-sidedoor .btn{font-size:16px}',
    '.wrap .v57-page h4[tabindex="-1"]:focus{outline:none}',
    '.wrap .v57-page h4[tabindex="-1"]:focus-visible{outline:2px solid var(--claret);outline-offset:3px}',
    '.wrap .v57-rows{margin:0}',
    '.wrap .v57-rows dt{font-family:var(--house-display,\'Cinzel\',Georgia,serif);font-size:13px;letter-spacing:.05em;line-height:1.5;color:var(--ink-soft);margin:10px 0 1px}',
    '.wrap .v57-rows dt:first-child{margin-top:0}',
    '.wrap .v57-rows dd{margin:0}',
    '.wrap .v57-rows.v57-after dt{font-size:14px;color:var(--claret);margin-top:14px}',
    /* what guests ask and the words on a label: the question or the word as it is written, its answer under it */
    '.wrap .v57-qa{margin:0 0 6px}',
    '.wrap .v57-qa dt{font-family:var(--house-reading,Georgia,serif);font-size:17px;line-height:1.45;font-weight:700;color:var(--ink);margin:14px 0 2px}',
    '.wrap .v57-qa dt:first-child{margin-top:4px}',
    '.wrap .v57-qa dd{margin:0}',
    '.wrap .v57-food{margin-top:0}',
    /* a neighbour: the door to its page, the tell under it */
    '.wrap .v57-compare{list-style:none;margin:6px 0 4px;padding:0}',
    '.wrap .v57-compare li{margin:0 0 16px}',
    '.wrap .v57-compare .btn{font-size:16px}',
    '.wrap .v39-body .v57-tell{margin:6px 0 0}',
    /* the house\'s wines of the grape: a row a wine, the producer over the wine, each a 44px door to its card */
    '.wrap .v39-body .v57-listline{margin:4px 0 0}',
    '.wrap .v57-wines{list-style:none;margin:0 0 6px;padding:0}',
    '.wrap .v57-wines li{margin:0;border-bottom:1px solid var(--field-line,var(--line))}',
    '.wrap .v57-wines li:last-child{border-bottom:0}',
    '.wrap .v57-wine{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:1px;width:100%;min-height:48px;box-sizing:border-box;padding:8px 0;margin:0;background:none;border:0;border-radius:0;text-align:left;cursor:pointer;font-family:inherit;color:var(--ink)}',
    '.wrap .v57-wine-p{font-size:17px;line-height:1.35;font-weight:700;color:var(--claret);overflow-wrap:anywhere}',
    '.wrap .v57-wine-w{font-size:16px;line-height:1.4;color:var(--ink);overflow-wrap:anywhere}',
    '.wrap .v57-wine:focus-visible{outline:2px solid var(--claret);outline-offset:2px}'
  ].join('\n');
  try { document.head.appendChild(css); } catch (e) { }
})();

/* =========== 2. the join =========== */

/* The profile the join keeps for a grape, from the table's: the eight fields
   the stock grape card and page read. The name is the join's own, set here
   and never authored, so the card keeps the name its grade is stored under;
   the colour letter is the join's colour. null unless every field is written. */
var V57_PROFILE_FIELDS = ['st', 'fruit', 'other', 'tell', 'regions', 'confuse'];
function v57Profile(t, name, colour) {
  var p = v57Obj(t && t.profile);
  if (!v57Str(name) || !V57_PROFILE_FIELDS.every(function (k) { return !!v57Str(p[k]); })) return null;
  var g = { g: name, c: colour === 'white' ? 'w' : 'r' };
  V57_PROFILE_FIELDS.forEach(function (k) { g[k] = v57Str(p[k]); });
  return g;
}
/* The slugs the regions data holds: its articles and its countries. */
function v57Places() {
  var have = {};
  var R = null;
  try { R = (typeof REGIONS !== 'undefined' && REGIONS && typeof REGIONS === 'object') ? REGIONS : null; } catch (e) { R = null; }
  if (!R) return have;
  v57List(R.regions).forEach(function (a) { var s = v57Str(a && a.slug); if (s) have[s] = 1; });
  Object.keys(v57Obj(R.countries)).forEach(function (k) { have[k] = 1; });
  return have;
}
function v57TableAliases() {
  try { return (typeof GRAPE_TABLE_ALIASES !== 'undefined' && GRAPE_TABLE_ALIASES && typeof GRAPE_TABLE_ALIASES === 'object' && !Array.isArray(GRAPE_TABLE_ALIASES)) ? GRAPE_TABLE_ALIASES : {}; } catch (e) { return {}; }
}
/* The joined book of grapes, decorated once: the grapes the table adds in the
   join's own record shape, a profile for a grape the Codex held without one,
   the table's label names as keys (first writer wins, so a key the join held
   is never taken and a name that resolved before resolves as it did), and
   the regions of a grape the table adds: its record's own, each one the
   regions data holds, then the regions' own join read again, so a name that
   now resolves brings its places. The record shape is codex53's, field for
   field; nothing else is hung on a record. */
function v57JoinAdd(J) {
  var T = v57Table();
  var slugs = Object.keys(T).filter(function (s) { var t = v57T(s); return !!t && v57Str(t.slug) === s; });
  if (!slugs.length || !J || !Array.isArray(J.list) || !J.bySlug || !J.byKey) return;
  var key = function (k, slug) {
    if (!k || !v57Own(J.bySlug, slug)) return;
    if (!v57Own(J.byKey, k)) J.byKey[k] = slug;
    if (J.byKey[k] === slug && J.bySlug[slug].keys.indexOf(k) < 0) J.bySlug[slug].keys.push(k);
  };
  var parts = function (n) {
    if (typeof v53GrapeParts === 'function') return v53GrapeParts(n);
    return String(n == null ? '' : n).replace(/\([^)]*\)/g, ' ').split('/').map(v57Fold).filter(Boolean);
  };
  var names = function (n, slug) {
    var p = parts(n);
    key(p.join(' '), slug);
    p.forEach(function (x) { key(x, slug); });
  };
  var added = [];
  slugs.forEach(function (slug) {
    var t = v57T(slug);
    var r = v57Own(J.bySlug, slug) ? J.bySlug[slug] : null;
    if (r) {
      if (!r.g) { var p = v57Profile(t, r.name, r.colour); if (p) r.g = p; }
      return;
    }
    var name = v57Str(t.name);
    var colour = v57Str(t.colour) === 'white' ? 'white' : 'red';
    var g = v57Profile(t, name, colour);
    if (!g) return;
    r = { slug: slug, name: name, colour: colour, g: g, intro: null, taste: null, court: '', tasting: null, keys: [], targets: [] };
    J.bySlug[slug] = r;
    J.list.push(r);
    added.push(slug);
    names(name, slug);
  });
  slugs.forEach(function (slug) {
    if (!v57Own(J.bySlug, slug)) return;
    v57List(v57T(slug).aliases).forEach(function (a) { key(v57Fold(a), slug); });
  });
  var al = v57TableAliases();
  Object.keys(al).forEach(function (k) { if (typeof al[k] === 'string') key(v57Fold(k), al[k]); });
  var have = v57Places();
  added.forEach(function (slug) {
    var r = J.bySlug[slug];
    v57List(v57T(slug).targets).forEach(function (x) { var s = v57Str(x); if (s && v57Own(have, s) && r.targets.indexOf(s) < 0) r.targets.push(s); });
  });
  if (typeof v53GrapeResolve !== 'function') return;
  var jg = {};
  try { jg = v57Obj(v57Obj(v57Obj(typeof REGIONS !== 'undefined' ? REGIONS : null).join).grapes); } catch (e) { jg = {}; }
  Object.keys(jg).forEach(function (n) {
    var s = v53GrapeResolve(J, n);
    if (!s || !v57Own(J.bySlug, s)) return;
    var r = J.bySlug[s];
    var v = jg[n];
    (Array.isArray(v) ? v : [v]).forEach(function (x) { if (typeof x === 'string' && x && r.targets.indexOf(x) < 0) r.targets.push(x); });
  });
}
if (typeof v53GrapeJoin === 'function') {
  var _v57GrapeJoin = v53GrapeJoin;
  v53GrapeJoin = function () {
    var J = _v57GrapeJoin.apply(this, arguments);
    try { if (J && J.list && !J.v57) { J.v57 = 1; v57JoinAdd(J); } } catch (e) { }
    return J;
  };
}

/* =========== 3. the page =========== */

function v57Cap(s) { var t = v57Str(s); return t ? t.charAt(0).toUpperCase() + t.slice(1) : ''; }
function v57P(cls, s) { var t = v57Str(s); return t ? '<p' + (cls ? ' class="' + cls + '"' : '') + '>' + v57Esc(t) + '</p>' : ''; }
function v57H4(key, cls) { return '<h4' + (cls ? ' class="' + cls + '"' : '') + '>' + v57Esc(v57W(key)) + '</h4>'; }
function v57Eyebrow(key, cls) { return '<p class="v57-eyebrow' + (cls ? ' ' + cls : '') + '">' + v57Esc(v57W(key)) + '</p>'; }
/* Labelled rows, a label over its text: [[label, text], ...]; a row with no text is left out. */
function v57Rows(rows, cls) {
  var list = v57List(rows).filter(function (p) { return p && v57Str(p[0]) && v57Str(p[1]); });
  return list.length ? '<dl class="' + (cls || 'v57-rows') + '">' + list.map(function (p) { return '<dt>' + v57Esc(v57Str(p[0])) + '</dt><dd>' + v57Esc(v57Str(p[1])) + '</dd>'; }).join('') + '</dl>' : '';
}
/* A section of the page and its chip, in codex53's own markup. */
function v57Details(id, title, body, open) {
  if (!body) return '';
  if (typeof v53Details === 'function') return v53Details(id, title, body, !!open);
  return '<details class="v28-q v39-sec" id="' + v57Esc(id) + '" data-chip="' + v57Esc(id) + '"' + (open ? ' open' : '') + '><summary>' + v57Esc(title) + '</summary><div class="v39-body">' + body + '</div></details>';
}
function v57Chip(id, title) {
  return '<button type="button" class="v28-chip" data-v39="chip" data-sec="' + v57Esc(id) + '">' + v57Esc(title) + '</button>';
}
var V57_SEC_HEAD = '<details class="v28-q v39-sec" id="';
var V57_CHIP_HEAD = '<button type="button" class="v28-chip" data-v39="chip" data-sec="';
/* Where a section stands in the page: from its opening tag to the end of its closing one, or null. No section
   of the page holds another. */
function v57SecAt(s, id) {
  var a = s.indexOf(V57_SEC_HEAD + id + '"');
  var b = a >= 0 ? s.indexOf('</details>', a) : -1;
  return b >= 0 ? { a: a, b: b + 10 } : null;
}

/* 3.1 At the table: the forty-five second line, a rule, the sale, the ten and the twenty second lines, Say it.
   The respelling is the table's, or the Court's own where the table writes none. '' when the table holds no line. */
function v57TableHtml(t, say0) {
  var l = v57Obj(t && t.lines);
  var s45 = v57Str(l.s45), s10 = v57Str(l.s10), s20 = v57Str(l.s20), sale = v57Str(l.sale);
  if (!s45 && !s10 && !s20 && !sale) return '';
  var say = v57Str(t && t.say) || v57Str(say0);
  var saleHtml = sale ? '<hr class="v57-rule">' + v57Eyebrow('sale', 'v57-sale-h') + v57P('v57-sale', sale) : '';
  var body = '';
  if (s45) body += v57Eyebrow('fortyFive') + v57P('v57-fortyfive', s45) + saleHtml;
  if (s10) body += v57Eyebrow('ten') + v57P('v57-ten', s10);
  if (!s45) body += saleHtml;
  if (s20) body += v57Eyebrow('twenty') + v57P('v57-twenty', s20);
  if (say) body += v57Eyebrow('say') + v57P('v57-sayit', say);
  return '<section class="v57 v57-table" aria-labelledby="v57-table-h"><h3 class="secgroup v57-h" id="v57-table-h">' + v57Esc(v57W('atTable')) + '</h3>' + body + '</section>';
}

/* 3.2 the glass: the lead, the notes by family (each family a quiet label, its notes named), the climate ladder
   from cool to warm with where, the line of structure. */
function v57GlassHtml(t) {
  var g = v57Obj(t && t.glass);
  var html = v57P('v57-glead', g.lead);
  var notes = v57List(g.notes).map(function (n) {
    var fam = v57Cap(n && n.family);
    var list = v57List(n && n.notes).map(v57Str).filter(Boolean);
    return (fam && list.length) ? '<dt>' + v57Esc(fam) + '</dt><dd>' + v57Esc(list.join(', ')) + '</dd>' : '';
  }).join('');
  if (notes) html += '<dl class="v57-notes">' + notes + '</dl>';
  var rungs = v57List(g.ladder).map(function (x) {
    var c = v57Str(x && x.climate).toLowerCase();
    var where = v57Str(x && x.where);
    var list = v57List(x && x.notes).map(v57Str).filter(Boolean);
    if (!c || (!where && !list.length)) return '';
    var known = v57Own(V57_WORDS, 'climate_' + c);
    return '<li' + (known ? ' class="v57-' + c + '"' : '') + '><span class="v57-climate">' + v57Esc(known ? v57W('climate_' + c) : v57Cap(c)) + '</span>'
      + (where ? '<span class="v57-where">' + v57Esc(where) + '</span>' : '')
      + (list.length ? '<span class="v57-rnotes">' + v57Esc(list.join(', ')) + '</span>' : '') + '</li>';
  }).join('');
  if (rungs) html += v57H4('ladderH') + '<ol class="v57-ladder">' + rungs + '</ol>';
  var st = v57P('v57-structure', g.structure);
  if (st) html += v57H4('structureH') + st;
  return html ? '<div class="v57-glass">' + html + '</div>' : '';
}

/* 3.3 Old World and New World: the two sides as two cards of the same three rows (where, in the glass, in the
   cellar), then why they differ, where the line blurs and the blind call; or, for a grape that stays at home,
   At home and Abroad. Given the house's wines of the grape (v57HouseWines), each side the house pours carries a
   door to its part of On our list. */
function v57ListDoor(world, n) {
  return n ? '<p class="v57-sidedoor"><button type="button" class="btn small ghost" data-v57="list" data-world="' + v57Esc(world) + '">' + v57Esc(v57W('toList', { n: n })) + '</button></p>' : '';
}
function v57WorldsMode(t) {
  var w = v57Obj(t && t.worlds);
  var c = v57Obj(w.contrast), h = v57Obj(w.home);
  if (v57Str(v57Obj(c.old).glass) && v57Str(v57Obj(c['new']).glass)) return 'contrast';
  return (v57Str(h.home) || v57Str(h.abroad)) ? 'home' : '';
}
function v57WorldsBody(t, hw) {
  var mode = v57WorldsMode(t);
  var w = v57Obj(t && t.worlds);
  var poured = v57Obj(hw);
  if (mode === 'contrast') {
    var c = v57Obj(w.contrast);
    var side = function (key, o, cls, world) {
      return '<div class="v57-side ' + cls + '">' + v57H4(key, 'v57-side-h') + v57Rows([[v57W('where'), o.where], [v57W('inGlass'), o.glass], [v57W('inCellar'), o.cellar]])
        + v57ListDoor(world, v57List(poured[world]).length) + '</div>';
    };
    return '<div class="v57-sides">' + side('oldWorld', v57Obj(c.old), 'v57-old', 'old') + side('newWorld', v57Obj(c['new']), 'v57-new', 'new') + '</div>'
      + v57Rows([[v57W('why'), c.why], [v57W('blur'), c.blur], [v57W('call'), c.call]], 'v57-rows v57-after');
  }
  if (mode === 'home') {
    var h = v57Obj(w.home);
    var card = function (key, s, cls) { return v57Str(s) ? '<div class="v57-side ' + cls + '">' + v57H4(key, 'v57-side-h') + v57P('', s) + '</div>' : ''; };
    return '<div class="v57-sides">' + card('atHome', h.home, 'v57-old') + card('abroad', h.abroad, 'v57-new') + '</div>' + v57ListDoor('', Number(poured.n) || 0);
  }
  return '';
}

/* 3.4 Service and the table: temperature, the glass, decanting and age, then the dishes with the reason. */
function v57ServiceBody(t) {
  var s = v57Obj(t && t.service);
  var html = v57Rows([[v57W('temp'), s.temp], [v57W('glassware'), s.glass], [v57W('decant'), s.decant], [v57W('age'), s.age]], 'v39-pairs');
  var food = v57List(v57Obj(t && t.food)['with']).map(function (f) {
    var d = v57Str(f && f.dish), why = v57Str(f && f.why);
    return d ? '<li><b>' + v57Esc(d) + '</b>' + (why ? ': ' + v57Esc(why) : '') + '</li>' : '';
  }).join('');
  if (food) html += v57H4('foodH') + '<ul class="v39-lines v57-food">' + food + '</ul>';
  return html;
}
/* 3.5 What guests ask, and the words a guest meets on a label. */
function v57GuestBody(t) {
  return v57Rows(v57List(t && t.guest).map(function (x) { return [x && x.q, x && x.a]; }), 'v57-qa');
}
function v57LabelBody(t) {
  return v57Rows(v57List(t && t.labels).map(function (x) { return [x && x.term, x && x.means]; }), 'v57-qa v57-terms');
}
/* 3.6 Compare with: each neighbour a door to its page, the tell under it. A neighbour the Codex holds no page
   for yet keeps its tell and has no door. */
function v57CompareBody(t) {
  var rows = v57List(t && t.compare).map(function (c) {
    var slug = v57Str(c && c.slug), tell = v57Str(c && c.tell);
    if (!tell) return '';
    var r = null;
    try { r = (slug && typeof v53GrapeFind === 'function') ? v53GrapeFind(slug) : null; } catch (e) { r = null; }
    var door = (r && r.slug === slug)
      ? '<button type="button" class="btn small ghost" data-go="grape" data-arg="' + v57Esc(r.slug) + '">' + v57Esc(r.name) + '</button>' : '';
    return '<li>' + door + v57P('v57-tell', tell) + '</li>';
  }).join('');
  return rows ? '<ul class="v57-compare">' + rows + '</ul>' : '';
}
/* 3.7 Sources: codex39's own list of links, each opening a new tab. */
function v57SourcesBody(t) {
  var rows = v57List(t && t.sources).map(function (s) {
    var title = v57Str(s && s.title), url = v57Str(s && s.url);
    if (!title) return '';
    return '<li>' + (/^https?:\/\//i.test(url) ? '<a href="' + v57Esc(url) + '" target="_blank" rel="noopener">' + v57Esc(title) + '<span class="sr-only">' + v57Esc(v57W('opensNew')) + '</span></a>' : v57Esc(title)) + '</li>';
  }).join('');
  return rows ? '<ul class="v39-lines v39-sources v57-sources">' + rows + '</ul>' : '';
}

/* 3.8 the sections a reader opened on a grape's page, kept for the sitting: a card or a neighbour opened from
   one and Back returns to the page as it was left. Per grape, in memory only. */
var V57_OPEN = {};
function v57OpenApply(s, slug) {
  var rec = v57Own(V57_OPEN, slug) ? V57_OPEN[slug] : null;
  if (!rec) return s;
  Object.keys(rec).forEach(function (id) {
    if (!/^v5[37]-gs-[a-z]+$/.test(id)) return;
    var head = V57_SEC_HEAD + id + '" data-chip="' + id + '"';
    var at = s.indexOf(head);
    if (at < 0) return;
    var end = at + head.length;
    var isOpen = s.substr(end, 6) === ' open>';
    if (rec[id] && !isOpen && s.charAt(end) === '>') s = s.slice(0, end) + ' open' + s.slice(end);
    else if (!rec[id] && isOpen) s = s.slice(0, end) + s.slice(end + 5);
  });
  return s;
}
(function () {
  if (typeof document === 'undefined' || !document || typeof document.addEventListener !== 'function') return;
  document.addEventListener('toggle', function (e) {
    try {
      var d = e && e.target;
      if (!d || typeof d.closest !== 'function' || !/^v5[37]-gs-[a-z]+$/.test(String(d.id || ''))) return;
      var page = d.closest('.v57-page[data-grape]');
      var slug = page ? v57Str(page.getAttribute('data-grape')) : '';
      if (!slug || !v57T(slug)) return;
      if (!v57Own(V57_OPEN, slug)) V57_OPEN[slug] = {};
      V57_OPEN[slug][d.id] = d.open ? 1 : 0;
    } catch (err) { }
  }, true);
})();

/* 3.9 the page shaped. A grape with no record in the table is returned as codex53 drew it. The six sections of
   codex53, Previous, Next and All grapes stay; nothing of the Court's grid is touched. */
function v57PageShape(html, r) {
  var s = String(html || '');
  var t = v57T(r && r.slug);
  if (!t) return s;
  var root = '<div class="v25page v53 v53-grape"';
  if (s.indexOf(root) === 0) s = '<div class="v25page v53 v53-grape v57-page"' + s.slice(root.length);
  /* At the table, in place of the lone Say it line; where the page drew none, ahead of whatever follows the title */
  var say0 = '';
  try { say0 = (typeof v53GridSay === 'function') ? v57Str(v57Obj(v53GridSay())[r.slug]) : ''; } catch (e) { say0 = ''; }
  var block = v57TableHtml(t, say0);
  if (block) {
    var m = /<p class="v39-lead v53-say">[\s\S]*?<\/p>/.exec(s);
    if (m) s = s.slice(0, m.index) + block + s.slice(m.index + m[0].length);
    else {
      var nav = s.indexOf('<nav class="v39-steps v53-steps" aria-label="Sections">');
      var line = s.indexOf('<p class="v32-line">');
      var at = (line >= 0 && (nav < 0 || line < nav)) ? line : nav;
      if (at >= 0) s = s.slice(0, at) + block + s.slice(at);
    }
  }
  /* the glass leads the fruit section, shown open; the row of bare family words gives way to it */
  var glass = v57GlassHtml(t);
  var f = glass ? v57SecAt(s, 'v53-gs-fruit') : null;
  if (f) {
    var sec = s.slice(f.a, f.b);
    var mark = '</summary><div class="v39-body">';
    var k = sec.indexOf(mark);
    if (k >= 0) {
      var rest = sec.slice(k + mark.length).replace(/<dt>(?:In brief|Aromas)<\/dt><dd>[^<]*<\/dd>/, '').replace('<dl class="v39-pairs"></dl>', '');
      if (rest.indexOf('<dl class="v39-pairs">') === 0) rest = v57H4('cardH') + rest;
      sec = sec.slice(0, k + mark.length) + glass + rest;
      var head = V57_SEC_HEAD + 'v53-gs-fruit" data-chip="v53-gs-fruit">';
      if (sec.indexOf(head) === 0) sec = head.slice(0, -1) + ' open>' + sec.slice(head.length);
      s = s.slice(0, f.a) + sec + s.slice(f.b);
    }
  }
  /* the new sections, each with its chip, each ahead of the first of its anchors the page draws */
  var mode = v57WorldsMode(t);
  var hw = v57HouseWines(r.slug);
  var put = function (id, title, body, open, anchors) {
    if (!body) return false;
    for (var i = 0; i < anchors.length; i++) {
      var at = s.indexOf(V57_SEC_HEAD + anchors[i] + '"');
      if (at < 0) continue;
      s = s.slice(0, at) + v57Details(id, title, body, open) + s.slice(at);
      var chip = s.indexOf(V57_CHIP_HEAD + anchors[i] + '"');
      if (chip >= 0) s = s.slice(0, chip) + v57Chip(id, title) + s.slice(chip);
      return true;
    }
    return false;
  };
  var worlds = put('v57-gs-worlds', v57W(mode === 'contrast' ? 'worldsH' : 'homeH'), v57WorldsBody(t, hw), true, ['v53-gs-regions', 'v53-gs-grid', 'v53-gs-cards']);
  var tail = ['v53-gs-grid', 'v53-gs-cards'];
  put('v57-gs-service', v57W('serviceH'), v57ServiceBody(t), false, tail);
  put('v57-gs-guest', v57W('guestH'), v57GuestBody(t), false, tail);
  put('v57-gs-label', v57W('labelH'), v57LabelBody(t), false, tail);
  put('v57-gs-compare', v57W('compareH'), v57CompareBody(t), false, tail);
  put('v57-gs-list', v57W('listH'), v57ListBody(r, hw), false, tail);
  /* Sources, closed at the foot: after the last section the page draws */
  var src = v57SourcesBody(t);
  var last = src ? (v57SecAt(s, 'v53-gs-watch') || v57SecAt(s, 'v53-gs-cards')) : null;
  if (last) {
    s = s.slice(0, last.b) + v57Details('v57-gs-sources', v57W('sourcesH'), src, false) + s.slice(last.b);
    var navEnd = s.indexOf('</nav>', s.indexOf('<nav class="v39-steps v53-steps" aria-label="Sections">'));
    if (navEnd >= 0 && s.indexOf('<nav class="v39-steps v53-steps" aria-label="Sections">') >= 0) s = s.slice(0, navEnd) + v57Chip('v57-gs-sources', v57W('sourcesH')) + s.slice(navEnd);
  }
  /* the one word flag leaves where the two worlds are described */
  if (worlds) {
    var p = v57SecAt(s, 'v53-gs-profile');
    if (p) s = s.slice(0, p.a) + s.slice(p.a, p.b).replace(/<dt>Where it is grown<\/dt><dd>[^<]*<\/dd>/, '') + s.slice(p.b);
  }
  return v57OpenApply(s, r.slug);
}
if (typeof v53GrapeHtml === 'function') {
  var _v57GrapeHtml = v53GrapeHtml;
  v53GrapeHtml = function (r) {
    var html = String(_v57GrapeHtml.apply(this, arguments) || '');
    try { return v57PageShape(html, r); } catch (e) { return html; }
  };
}

/* =========== 4. the root rows =========== */

/* A grape's line on the root: its glass in a line, for every grape the table describes. */
if (typeof v53GrapeShort === 'function') {
  var _v57GrapeShort = v53GrapeShort;
  v53GrapeShort = function (r) {
    try {
      var t = v57T(r && r.slug);
      var lead = t ? v57Str(v57Obj(t.glass).lead) : '';
      if (lead) return lead;
    } catch (e) { }
    return _v57GrapeShort.apply(this, arguments);
  };
}

/* =========== 5. on the house's list =========== */

/* Old World or New World, by the last part of a wine's region as the house writes it: a country, or a state of
   the United States. A part the map does not hold goes under neither. */
var V57_WORLD = {};
(function () {
  ['France', 'Italy', 'Spain', 'Portugal', 'Germany', 'Austria', 'Switzerland', 'Greece', 'Hungary', 'England', 'Wales', 'United Kingdom', 'Luxembourg',
    'Slovenia', 'Croatia', 'Romania', 'Bulgaria', 'Czech Republic', 'Slovakia', 'Georgia', 'Moldova', 'Cyprus', 'Turkey', 'Lebanon', 'Israel', 'Armenia',
    'North Macedonia', 'Serbia'].forEach(function (n) { V57_WORLD[v57Fold(n)] = 'old'; });
  ['United States', 'USA', 'California', 'Oregon', 'Washington', 'Washington State', 'New York', 'Virginia', 'Texas', 'Michigan', 'Idaho', 'Arizona',
    'New Mexico', 'Canada', 'Mexico', 'Argentina', 'Chile', 'Uruguay', 'Brazil', 'Australia', 'New Zealand', 'South Africa'].forEach(function (n) { V57_WORLD[v57Fold(n)] = 'new'; });
})();
function v57WorldOf(region) {
  var parts = String(region == null ? '' : region).split(',').map(v57Fold).filter(Boolean);
  var last = parts.length ? parts[parts.length - 1] : '';
  return (last && v57Own(V57_WORLD, last)) ? V57_WORLD[last] : '';
}
/* A field of a house wine as plain text: the value as the pack holds it, or the value a person kept. */
function v57Field(item, k) {
  if (!item) return '';
  if (typeof item[k] === 'string') return item[k].trim();
  var v = null;
  try { v = (typeof v28KV === 'function') ? v28KV(item, k) : null; } catch (e) { v = null; }
  return typeof v === 'string' ? v.trim() : '';
}
function v57House() {
  try { return (typeof v53House === 'function') ? v53House() : ((typeof v32House === 'function') ? v32House() : null); } catch (e) { return null; }
}
/* The house's wines of a grape, in the list's own order: { old, new, other, n }, each wine { id, producer, wine }.
   A wine counts when one of its grapes resolves to the slug. The producer and the wine alone are read, never a
   price, a year, a bin or a note; a wine the list holds twice (by the glass and by the bottle, two sizes, two
   years) is one row, opening the first. Empty when no house is loaded. */
function v57HouseWines(slug) {
  var out = { old: [], 'new': [], other: [], n: 0 };
  var s = v57Str(slug);
  var h = v57House();
  if (!s || !h || typeof v28Wines !== 'function' || typeof v28Grapes !== 'function' || typeof v53GrapeKey !== 'function') return out;
  var seen = {};
  v28Wines(h).forEach(function (w) {
    var hit = false;
    try { hit = v28Grapes(w).some(function (g) { return v53GrapeKey(g) === s; }); } catch (e) { hit = false; }
    if (!hit) return;
    var producer = v57Field(w, 'producer'), wine = v57Field(w, 'wine');
    if (!producer && !wine) return;
    var k = v57Fold(producer) + '|' + v57Fold(wine);
    if (seen[k]) return;
    seen[k] = 1;
    var world = v57WorldOf(v57Field(w, 'region'));
    out[world || 'other'].push({ id: w.id, producer: producer, wine: wine });
    out.n++;
  });
  return out;
}
function v57ListBody(r, read) {
  var hw = (read && typeof read === 'object') ? read : v57HouseWines(r && r.slug);
  if (!hw.n) return '';
  var group = function (key, list, world) {
    if (!list.length) return '';
    return '<h4 id="v57-list-' + world + '" tabindex="-1">' + v57Esc(v57W('worldCount', { world: v57W(key), n: list.length })) + '</h4><ul class="v57-wines">' + list.map(function (x) {
      return '<li><button type="button" class="v57-wine" data-v57="wine" data-id="' + v57Esc(x.id) + '" id="v57-w-' + v57Esc(x.id) + '">'
        + '<span class="v57-wine-p">' + v57Esc(x.producer || x.wine) + '</span>'
        + ((x.producer && x.wine) ? '<span class="v57-wine-w">' + v57Esc(x.wine) + '</span>' : '') + '</button></li>';
    }).join('') + '</ul>';
  };
  return v57P('v57-listline', hw.n === 1 ? v57W('listOne') : v57W('listMany', { n: hw.n }))
    + group('oldWorld', hw.old, 'old') + group('newWorld', hw['new'], 'new') + group('elsewhere', hw.other, 'other');
}
/* On our list opened at a world's heading, from the door on that side of the two worlds. */
function v57Land(node) {
  if (typeof v39Land === 'function') { v39Land(node); return; }
  try {
    if (!node || typeof node.getBoundingClientRect !== 'function') return;
    window.scrollTo(0, Math.max(0, node.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0) - 72));
    if (typeof node.focus === 'function') node.focus({ preventScroll: true });
  } catch (e) { }
}
function v57ToList(world) {
  var d = null;
  try { d = document.getElementById('v57-gs-list'); } catch (e) { d = null; }
  if (!d) return false;
  d.open = true;
  var w = v57Str(world);
  var at = null;
  try { at = (/^(old|new|other)$/.test(w) ? document.getElementById('v57-list-' + w) : null) || d.querySelector('summary'); } catch (e2) { at = null; }
  v57Land(at || d);
  return true;
}
/* A house wine's card, opened from a grape's page as codex39 opens one from a region's: the list's own card
   screen, pushed, so Back returns to the grape. */
function v57OpenWine(id) {
  var wid = v57Str(id);
  if (!wid) return false;
  var known = false;
  try { known = typeof v28Wines === 'function' && v28Wines(v57House()).some(function (w) { return w.id === wid; }); } catch (e) { known = false; }
  if (!known) return false;
  if (typeof v32OpenWine === 'function') { v32OpenWine(wid); return true; }
  if (typeof v28Open !== 'function') return false;
  try { S._v28edit = false; S.view = 'cellar'; } catch (e) { return false; }
  v28Open(wid, false);
  return true;
}

/* =========== the acts =========== */

/* What a control of the layer does, by its data-v57 word: extended key by key. One listener for them all. */
var V57_ACTS = {
  wine: function (node) { return v57OpenWine(node && typeof node.getAttribute === 'function' ? node.getAttribute('data-id') : ''); },
  list: function (node) { return v57ToList(node && typeof node.getAttribute === 'function' ? node.getAttribute('data-world') : ''); }
};
(function () {
  if (typeof document === 'undefined' || !document || typeof document.addEventListener !== 'function') return;
  document.addEventListener('click', function (e) {
    var t = e && e.target;
    var node = t && typeof t.closest === 'function' ? t.closest('[data-v57]') : null;
    if (!node || node.disabled) return;
    var act = node.getAttribute('data-v57');
    if (!v57Own(V57_ACTS, act) || typeof V57_ACTS[act] !== 'function') return;
    if (typeof e.preventDefault === 'function') e.preventDefault();
    try { if (typeof v32Remember === 'function') v32Remember(node); } catch (err) { }
    try { V57_ACTS[act](node, e); } catch (err2) { }
  });
})();
