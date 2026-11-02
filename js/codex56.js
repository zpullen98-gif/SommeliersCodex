/* ================== CODEX LVI: THE WINE ATLAS MADE A COURSE ==================

   The Wine Atlas made a course, 2 November 2026. Loaded after codex55.js,
   before boot.js. It edits no earlier layer and no data file; every wrapper
   is typeof guarded and outermost, every registry is extended key by key,
   never replaced, and the layer declares with var and function only. Every
   string it shows lives in V56_WORDS (read by v56W); the data's own fields
   (the readings, the maps' notes) are drawn as they are written, save the
   field atlas's American spellings and its en dashes, which are put right at
   display (section 9). Its CSS lives in its own v56-style element.

   The owner asked for the Wine Atlas to be reviewed, expanded and made
   easier to learn from. Two read-only reviews found the content strong and
   the learning hard to reach: no study door on the root, a region's drill
   below thousands of words of reading, no guided order, no schedule and no
   readiness for region study, the districts and the map drawn twice, and
   about 2 MB fetched on the first visit. This layer is the flow: the
   content (the fourteen places the Court names that the atlas lacked) is
   built into the data by the regions pipeline, and this layer reads it.

   WHAT THIS LAYER OWNS:

   1. THE WORDS AND THE STYLE: V56_WORDS, v56W, and the v56-style element.

   2. THE COURSE ORDER: every region and country in the Court's order (the
      subjects of CMS in their order, each subject's map regions then its
      map countries, each once), then whatever the subjects leave out, in the
      order of the maps; Previous and Next across the whole atlas, never one
      sheet; a country page read is kept in the layer's own slot.

   3. REGION STUDY SCHEDULED: due dates for the region and district cards
      and the region questions, by codex3's own spaced repetition rule (SM-2
      lite: one day, three days, then the interval times the ease), kept in
      the slot oot-codex-regionsrs-v1 beside codex39's grades, which stay;
      the due count; Today's region cards as a deck; the questions due as a
      drill; and a region's answers feeding the CMS readiness of every
      subject whose map names the region.

   4. THE ROOT OPENS ON THE LEARNER: Start here, or Continue with the next
      unread step of the course; the study doors (Today's region cards with
      the due count, Drill a country, Map quiz, District cards, Compare two
      regions); every country with its readiness line (read, cards known,
      questions right); then codex55's sheets and full list. The root fetches
      nothing on a visit: a district count comes from the index's field
      districts when the data carries it, else from a reading already on the
      device; a search reads the rest when it is first typed.

   5. THE REGION PAGE LEADS WITH STUDY: a sticky study row under the title
      (Summary, Map, Districts, Read, Flash, Drill, Map quiz, Previous,
      Next), In one minute (a summary card drawn from the record's own
      fields), the inline map loaded only as it nears the view, The
      districts showing eight with Show all, and a district marked beside
      itself, the page never thrown to the map.

   6. NEW DRILLS FROM THE DATA: a map quiz on any field map (find the named
      place on the map; name the marked place from four), district cards (a
      district to its note and region) and compare two regions side by side,
      each with an address and a parent in the Wine Atlas, with a chooser for
      a country's drill.

   7. DUPLICATES FOLDED: the field map screen draws as the region page (a
      country map as its country page) and the field atlas index as the root,
      their addresses kept; answer links open the region page; the regions
      index draws the root's country list; the sheet view gains its study
      doors; a technique opened from the atlas lights Wine Atlas and climbs
      back to it.

   8. THE ARTICLES OFF THE MAP: a record with mapless 1 and no index takes
      its place under its country on the root and in the course order, and
      its page shows its country's sheet with a line that its field map is to
      come.

   9. THE FIELD ATLAS SHOWN CLEANLY: its American spellings and en dashes
      put right where they are drawn; the data is untouched.

  10. THE SHELL: index.html loads js/codex56.js after codex55.js and before
      boot.js; the worker is codex-v115 and lists it.
*/

/* =========== 1. the words =========== */

var V56_WORDS = {
  /* the course */
  stepOf: 'Step {k} of {n}',
  prevTo: 'Previous: {name}',
  nextTo: 'Next: {name}',
  prev: 'Previous',
  next: 'Next',
  courseNone: 'The course is not on this device yet.'
};

function v56W(key, vars) {
  var v = vars || {};
  return String(Object.prototype.hasOwnProperty.call(V56_WORDS, key) ? V56_WORDS[key] : key).replace(/\{(\w+)\}/g, function (m, k) {
    return Object.prototype.hasOwnProperty.call(v, k) ? String(v[k]) : m;
  });
}
function v56Esc(s) {
  if (typeof v32Esc === 'function') return v32Esc(s == null ? '' : String(s));
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function v56Str(s) { return typeof s === 'string' ? s.trim() : (typeof s === 'number' ? String(s) : ''); }
function v56List(x) { return Array.isArray(x) ? x : []; }
function v56Own(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
function v56Fold(s) {
  if (typeof v39Fold === 'function') return v39Fold(s);
  var t = String(s == null ? '' : s);
  try { t = t.normalize('NFD'); } catch (e) { }
  return t.replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
/* "one", "two and three", "one, two and three" */
function v56And(list) {
  var l = v56List(list).filter(Boolean);
  return l.length < 2 ? (l[0] || '') : l.slice(0, -1).join(', ') + ' and ' + l[l.length - 1];
}
/* The first sentence of a paragraph. */
function v56First(s) {
  var t = v56Str(s).split(/\n\s*\n/)[0] || '';
  var m = /^(.+?[.!?])(\s|$)/.exec(t);
  return m ? m[1] : t;
}
function v56Doc() { return (typeof document !== 'undefined' && document && typeof document.getElementById === 'function') ? document : null; }

/* =========== the style =========== */

(function () {
  if (typeof document === 'undefined' || !document || typeof document.createElement !== 'function') return;
  var css = document.createElement('style');
  css.id = 'v56-style';
  css.textContent = [
    /* every control the layer draws stands at least 44px */
    '.wrap .v56 .btn,.wrap .v56 .v28-chip,.wrap .v56 .v25row{min-height:44px;box-sizing:border-box}',
    '.wrap .v56 .btn{white-space:normal;text-align:left;max-width:100%}',
    '.wrap .v56 [hidden]{display:none!important}',
    '.wrap .v56 [tabindex="-1"]:focus{outline:none}',
    '.wrap .v56 [tabindex="-1"]:focus-visible{outline:2px solid var(--gold-hi);outline-offset:3px}',
    '.wrap .v56 .v32-sec{margin-top:26px}',
    '.wrap .v56-line{font-size:16px;line-height:1.5;color:var(--parch2);margin:6px 0 0}'
  ].join('\n');
  try { document.head.appendChild(css); } catch (e) { }
})();
