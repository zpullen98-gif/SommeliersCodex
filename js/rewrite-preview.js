/* ============ Rewrite preview — a review tool, not a feature ============
   Opens the Page and Squire banks on the REWRITTEN questions instead of the
   imported ones, so the rewrite can be read and drilled inside the real engine.

   Inert unless the page is opened with ?rewrite. Without that flag this file
   defines two names and returns, loads nothing, and touches no global — which
   is why it is safe to ship even though it is only ever used in development.

   Why it exists: 1,514 original questions had passed ten build checks, a
   similarity pass, a cross-category pass and several rounds of fact-checking
   without ever once being loaded by the app that will ship them. Grading, the
   section menus, the SRS, the review screen and the level switch had never
   seen this content.

   Stats are sandboxed. qKey is wrapped to prefix every stored key with
   'preview|', so drilling the rewrite cannot touch real study progress:
   keyOwned() matches 'intro|...' or an unprefixed certified key and never a
   'preview|' one, so preview answers stay out of every count and every
   readiness figure. Nothing here writes to the real namespace.

   Only rewritten categories appear, so everything on screen in this mode is
   original work. Knight and Ruler are left alone; they were original already.
   ============ */

var REWRITE_PREVIEW_ON = /(^|[?&])rewrite($|[=&])/.test(location.search);

function rewritePreviewBanner(msg, tone) {
  var el = document.getElementById('rewrite-preview-bar');
  if (!el) {
    el = document.createElement('div');
    el.id = 'rewrite-preview-bar';
    el.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:99999;' +
      'font:12px/1.5 system-ui,sans-serif;padding:6px 12px;text-align:center;' +
      'letter-spacing:.02em;box-shadow:0 1px 6px rgba(0,0,0,.35)';
    document.body.appendChild(el);
    document.body.style.paddingTop = '30px';
  }
  el.style.background = tone === 'bad' ? '#5b1616' : '#1d3b2a';
  el.style.color = tone === 'bad' ? '#ffd9d9' : '#d6f5e3';
  el.innerHTML = msg;
}

(function () {
  if (!REWRITE_PREVIEW_ON) return;

  function strip() {
    var q = location.search.replace(/(^\?|&)rewrite(=[^&]*)?/, '$1').replace(/^\?$/, '');
    return location.pathname + (q && q !== '?' ? q : '');
  }

  function fail(why) {
    rewritePreviewBanner(
      'REWRITE PREVIEW FAILED — ' + why +
      ' &nbsp;·&nbsp; <a href="' + strip() + '" style="color:inherit">leave preview</a>', 'bad');
  }

  var s = document.createElement('script');
  s.src = 'rewrite/preview-bank.js?t=' + Date.now();   // never cached; it changes every build

  s.onerror = function () {
    fail('rewrite/preview-bank.js did not load. Run <code>py rewrite/build-preview.py</code>.');
  };

  s.onload = function () {
    if (typeof REWRITE_PREVIEW === 'undefined' || !REWRITE_PREVIEW.intro) {
      return fail('preview-bank.js loaded but defined no bank.');
    }
    if (typeof LEVELS === 'undefined' || !LEVELS.intro) {
      return fail('LEVELS is not defined; this layer must load after codex7.js.');
    }

    // Sandbox the stats before a single answer can be recorded.
    var realQKey = qKey;
    qKey = function (q) { return 'preview|' + realQKey(q); };

    LEVELS.intro.bank = REWRITE_PREVIEW.intro;
    LEVELS.certified.bank = REWRITE_PREVIEW.certified;

    var m = REWRITE_PREVIEW.meta;
    var counts = m.intro.questions + ' Page questions in ' + m.intro.categories.length +
                 ' sections, ' + m.certified.questions + ' Squire in ' + m.certified.categories.length;

    // Re-enter the current level so QUESTIONS rebinds off the new bank.
    try {
      applyLevel(activeLevel === 'advanced' || activeLevel === 'master' ? 'intro' : activeLevel);
    } catch (e) {
      return fail('applyLevel threw: ' + e.message);
    }

    rewritePreviewBanner(
      '<strong>REWRITE PREVIEW</strong> &nbsp;·&nbsp; ' + counts +
      ' &nbsp;·&nbsp; original work only, imported bank hidden' +
      ' &nbsp;·&nbsp; progress is sandboxed' +
      ' &nbsp;·&nbsp; <a href="' + strip() + '" style="color:inherit">leave preview</a>');
  };

  document.head.appendChild(s);
})();
