/* ================== CODEX LIX: THE CHAMPAGNE HOUSES ==================

   The Champagne houses tab of the house tab, November 2026. Loaded after
   codex58.js and js/data-champagne.js, before boot.js. It edits no earlier
   layer and no data file; every wrapper is typeof guarded and outermost,
   every registry is extended key by key, never replaced, and the layer
   declares with var and function only. Every string it shows lives in
   V59_WORDS (read by v59W); the records' own fields (CHAMPAGNE_HOUSES, built
   by .scripts/champagne) are drawn as they are written. Its CSS lives in its
   own v59-style element, every selector under .wrap, every colour one of the
   house's own tokens so the night page and day service both read well.

   The owner asked for a Champagne House tab under the house tab, with a deep
   study and a tableside description of each house and its prestige cuvée:
   the 23 houses of a class sheet, each matched to its cuvée. The content is
   one record a house in CHAMPAGNE_HOUSES.houses, in the sheet's order; this
   layer reads it. It is a display overlay: WINE_PRODUCERS, FLAGSHIPS, the
   house and every earlier view are never changed.

   THIS FILE IS THE SHELL. The spec step ships the words table, its reader
   and the style element, so that the chain, the worker and every gate carry
   the layer's two files from the first commit; the views, the doors, the
   decks and the quiz are the layer engineer's, built to
   .scripts/champagne/BRIEF.md ("The layer"). Nothing is drawn yet, no
   function is wrapped and no registry is touched.

   WHAT THIS LAYER OWNS:

   1. THE WORDS AND THE STYLE: V59_WORDS, v59W, and the v59-style element.

   2. THE SHELL: index.html loads js/data-champagne.js then js/codex59.js
      after codex58.js and before boot.js; the worker is codex-v122 and
      lists both.
*/

/* =========== 1. the words =========== */

var V59_WORDS = {
  tab: 'Champagne houses'
};
function v59W(key, vars) {
  var v = vars || {};
  return String(Object.prototype.hasOwnProperty.call(V59_WORDS, key) ? V59_WORDS[key] : key).replace(/\{(\w+)\}/g, function (m, k) {
    return Object.prototype.hasOwnProperty.call(v, k) ? String(v[k]) : m;
  });
}

/* =========== 2. the style =========== */

(function () {
  if (typeof document === 'undefined' || !document || typeof document.createElement !== 'function') return;
  if (typeof document.getElementById === 'function' && document.getElementById('v59-style')) return;
  var css = document.createElement('style');
  css.id = 'v59-style';
  css.textContent = [
    '.wrap .v59 [hidden]{display:none!important}'
  ].join('\n');
  try { document.head.appendChild(css); } catch (e) { }
})();
