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
      Court's grid, and Sources closed at the foot.

   4. THE ROOT ROWS: each grape's row shows its glass in a line.

   5. ON THE HOUSE'S LIST: the house's wines of the grape under Old World and
      New World, each opening its wine card and Back returning to the grape;
      nothing is drawn when no house is loaded.

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
  say: 'Say it'
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
    '.wrap .v57 [hidden]{display:none!important}'
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
