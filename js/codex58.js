/* ================== CODEX LVIII: THE PRODUCERS AND THEIR FLAGSHIPS ==================

   The Producers and flagships tab of the Wine Atlas, November 2026. Loaded
   after codex57.js and js/data-flagships.js, before boot.js. It edits no
   earlier layer and no data file; every wrapper is typeof guarded and
   outermost, every registry is extended key by key, never replaced, and the
   layer declares with var and function only. Every string it shows lives in
   V58_WORDS (read by v58W); the records' own fields (FLAGSHIPS, built by
   .scripts/flagships) are drawn as they are written. Its CSS lives in its own
   v58-style element, every selector under .wrap, every colour one of the
   house's own tokens so the night page and day service both read well.

   The owner asked for a tab under Study in the Wine Atlas holding five of the
   most famous producers of each wine region, each with its flagship wine in
   deep and full detail and its story. The content is one record a producer
   in FLAGSHIPS, five a group, one group or more a region (FLAGSHIP_GROUPS);
   this layer reads it. It is a display overlay: REGIONS, WINE_PRODUCERS, the
   house and every earlier view are never changed.

   WHAT THIS LAYER OWNS:

   1. THE WORDS AND THE STYLE: V58_WORDS, v58W, and the v58-style element.

   2. THE DATA AS READ: the records by id, the groups in the plan's order,
      the groups of a region and the records of a library producer; nothing
      is drawn for a group with no record on the device.

   9. THE SHELL: index.html loads js/data-flagships.js then js/codex58.js
      after codex57.js and before boot.js; the worker is codex-v117 and lists
      both.
*/

/* =========== 1. the words =========== */

var V58_WORDS = {
  tab: 'Producers and flagships'
};

function v58W(key, vars) {
  var v = vars || {};
  return String(Object.prototype.hasOwnProperty.call(V58_WORDS, key) ? V58_WORDS[key] : key).replace(/\{(\w+)\}/g, function (m, k) {
    return Object.prototype.hasOwnProperty.call(v, k) ? String(v[k]) : m;
  });
}
function v58Esc(s) {
  if (typeof v32Esc === 'function') return v32Esc(s == null ? '' : String(s));
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function v58Str(s) { return typeof s === 'string' ? s.trim() : (typeof s === 'number' ? String(s) : ''); }
function v58List(x) { return Array.isArray(x) ? x : []; }
function v58Obj(x) { return (x && typeof x === 'object' && !Array.isArray(x)) ? x : {}; }
function v58Own(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
function v58Fold(s) {
  if (typeof v53cFold === 'function') return v53cFold(s);
  var t = String(s == null ? '' : s);
  try { t = t.normalize('NFD'); } catch (e) { }
  return t.replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/* =========== the style =========== */

(function () {
  if (typeof document === 'undefined' || !document || typeof document.createElement !== 'function') return;
  var css = document.createElement('style');
  css.id = 'v58-style';
  css.textContent = [
    '.wrap .v58 [hidden]{display:none!important}'
  ].join('\n');
  try { document.head.appendChild(css); } catch (e) { }
})();

/* =========== 2. the data as read =========== */

/* The records by id; {} when the data is not on the device. */
function v58Data() {
  try { return (typeof FLAGSHIPS !== 'undefined' && FLAGSHIPS && typeof FLAGSHIPS === 'object' && !Array.isArray(FLAGSHIPS)) ? FLAGSHIPS : {}; } catch (e) { return {}; }
}
/* A record by its id, or null. */
function v58Rec(id) {
  var d = v58Data();
  var s = v58Str(id);
  var r = (s && v58Own(d, s)) ? d[s] : null;
  return (r && typeof r === 'object' && !Array.isArray(r) && r.id === s) ? r : null;
}
/* The groups in the plan's order, each { key, title, region, country, ids } with only the ids the device holds;
   a group with none is left out. */
function v58Groups() {
  var raw = [];
  try { raw = (typeof FLAGSHIP_GROUPS !== 'undefined' && Array.isArray(FLAGSHIP_GROUPS)) ? FLAGSHIP_GROUPS : []; } catch (e) { raw = []; }
  var out = [];
  raw.forEach(function (g) {
    if (!g || typeof g !== 'object' || !v58Str(g.key)) return;
    var ids = v58List(g.ids).filter(function (id) { return !!v58Rec(id); });
    if (!ids.length) return;
    out.push({ key: v58Str(g.key), title: v58Str(g.title) || v58Str(g.key), region: v58Str(g.region), country: v58Str(g.country), ids: ids });
  });
  return out;
}
function v58Meta() {
  try { return (typeof FLAGSHIP_META !== 'undefined' && FLAGSHIP_META && typeof FLAGSHIP_META === 'object') ? FLAGSHIP_META : {}; } catch (e) { return {}; }
}
