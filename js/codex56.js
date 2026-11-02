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

/* =========== 2. the course order =========== */

/* ----- the layer's slot: per device, never exported, every touch in try -----
   { c: card schedules, q: question schedules, r: country pages read, m: map
   quiz rounds }, under codex39's profile key rule. */
var V56_SLOT = 'oot-codex-regionsrs-v1';
function v56Key() {
  try {
    return (typeof OOT !== 'undefined' && OOT && OOT.profiles && typeof OOT.profiles.key === 'function') ? OOT.profiles.key(V56_SLOT) : V56_SLOT;
  } catch (e) { return V56_SLOT; }
}
function v56Rec() {
  var o = null;
  try {
    var s = (typeof localStorage !== 'undefined' && localStorage) ? localStorage.getItem(v56Key()) : null;
    o = s ? JSON.parse(s) : null;
  } catch (e) { o = null; }
  if (!o || typeof o !== 'object' || Array.isArray(o)) o = {};
  ['c', 'q', 'r', 'm'].forEach(function (k) { if (!o[k] || typeof o[k] !== 'object' || Array.isArray(o[k])) o[k] = {}; });
  return o;
}
function v56Put(o) {
  try { if (typeof localStorage !== 'undefined' && localStorage) localStorage.setItem(v56Key(), JSON.stringify(o)); } catch (e) { }
}

/* ----- the course ----- */

/* The atlas's countries in the order of the maps (codex55's own order). */
function v56Countries() {
  try { if (typeof v55CountryOrder === 'function') return v55CountryOrder(); } catch (e) { }
  var out = [];
  try {
    if (typeof v39Sheets === 'function') v39Sheets().forEach(function (id) { var c = v39CountryOf(id); if (c) out.push({ key: v39CountryKey(c), c: c, sheet: id, group: '' }); });
    if (typeof v39Mapless === 'function') v39Mapless().forEach(function (c) { out.push({ key: v39CountryKey(c), c: c, sheet: '', group: 'mapless' }); });
  } catch (e) { }
  return out;
}
function v56Subjects() {
  try { if (typeof v53Subjects === 'function') return v53Subjects(); } catch (e) { }
  try { return (typeof CMS !== 'undefined' && CMS && Array.isArray(CMS.subjects)) ? CMS.subjects : []; } catch (e) { return []; }
}
/* The course: each subject of the Court in its order, its map's regions then
   its map's countries, each step once; then every region and country the
   subjects leave out, country by country in the order of the maps (its
   regions, then the country), so Previous and Next reach the whole atlas.
   Rebuilt when the regions or the subjects change. */
var V56_COURSE = { src: null, cms: null, n: -1, list: [], at: {} };
function v56Course() {
  var d = (typeof v39Data === 'function') ? v39Data() : null;
  var cms = (typeof CMS !== 'undefined') ? CMS : null;
  var regions = (typeof v39Regions === 'function') ? v39Regions() : [];
  if (V56_COURSE.src === d && V56_COURSE.cms === cms && V56_COURSE.n === regions.length) return V56_COURSE.list;
  var list = [], at = {};
  var add = function (kind, key, subject) {
    var k = v56Str(key);
    if (!k) return;
    var id = kind + ':' + k;
    if (v56Own(at, id)) return;
    var rec = kind === 'region' ? v39Find(k) : v39Country(k);
    if (!rec) return;
    at[id] = list.length;
    list.push({ kind: kind, key: k, name: v56Str(rec.name) || k, subject: subject || '' });
  };
  if (d) {
    v56Subjects().forEach(function (s) {
      var map = s && s.map && typeof s.map === 'object' ? s.map : {};
      v56List(map.regions).forEach(function (k) { add('region', k, v56Str(s.id)); });
      v56List(map.countries).forEach(function (k) { add('country', k, v56Str(s.id)); });
    });
    v56Countries().forEach(function (row) {
      if (row.sheet && typeof v39SheetRegions === 'function') v39SheetRegions(row.sheet).forEach(function (a) { add('region', a.slug, ''); });
      add('country', row.key, '');
    });
    regions.forEach(function (a) { add('region', a.slug, ''); });
  }
  V56_COURSE = { src: d, cms: cms, n: regions.length, list: list, at: at };
  return list;
}
/* A step's place in the course, or -1. */
function v56At(kind, key) {
  v56Course();
  var id = kind + ':' + v56Str(key);
  return v56Own(V56_COURSE.at, id) ? V56_COURSE.at[id] : -1;
}
function v56Near(kind, key) {
  var list = v56Course();
  var i = v56At(kind, key);
  return { at: i, n: list.length, prev: i > 0 ? list[i - 1] : null, next: (i >= 0 && i + 1 < list.length) ? list[i + 1] : null };
}
/* Read: a region by codex39's own read slot, a country page by the layer's. */
function v56ReadRegions() {
  try { return (typeof v39Rec === 'function' && typeof V39_READ_BASE !== 'undefined') ? v39Rec(V39_READ_BASE) : {}; } catch (e) { return {}; }
}
function v56IsRead(item, regionsRead, rec) {
  if (!item) return false;
  if (item.kind === 'region') return !!(regionsRead || v56ReadRegions())[item.key];
  return !!(rec || v56Rec()).r[item.key];
}
function v56MarkCountry(key) {
  var k = v56Str(key);
  if (!k) return;
  var o = v56Rec();
  if (o.r[k]) return;
  o.r[k] = 1;
  v56Put(o);
}
/* How far the course is read, and its first unread step. */
function v56Progress() {
  var list = v56Course();
  var rr = v56ReadRegions(), rec = v56Rec();
  var read = 0, next = null, nextAt = -1;
  list.forEach(function (item, i) {
    if (v56IsRead(item, rr, rec)) read++;
    else if (!next) { next = item; nextAt = i; }
  });
  return { n: list.length, read: read, next: next, at: nextAt, first: list[0] || null, last: list[list.length - 1] || null };
}

/* A step of the course as a door: a region page, a country page. */
function v56CourseBtn(item, dir, cls, id) {
  if (!item) return '';
  return '<button type="button" class="' + (cls || 'btn ghost') + '" data-v56="course" data-kind="' + v56Esc(item.kind) + '" data-key="' + v56Esc(item.key) + '"'
    + (id ? ' id="' + v56Esc(id) + '"' : '') + '>' + v56Esc(v56W(dir === 'prev' ? 'prevTo' : 'nextTo', { name: item.name })) + '</button>';
}
/* Opens a step: a step to a step of the same kind is one screen moving on
   (a replace, as codex39's own Next), any other a push; the top of the page. */
function v56OpenStep(kind, key) {
  var view = kind === 'country' ? 'country' : 'region';
  if (typeof v39Open !== 'function') return;
  var same = S.view === view;
  v39Open(view, key, same ? 'replace' : 'push');
  try { if (same) window.scrollTo(0, 0); } catch (e) { }
}

/* The article's own doors: codex39's Previous and Next, bound to one sheet,
   give way to the course's, which cross the whole atlas. */
function v56ArticleShape(html, a) {
  var s = String(html || '');
  if (!a || !a.slug) return s;
  s = s.replace(/<button type="button" class="[^"]*" data-v39="(?:prev|next)" id="v39-act-(?:prev|next)"[^>]*>[^<]*<\/button>/g, '');
  var near = v56Near('region', a.slug);
  var btns = v56CourseBtn(near.prev, 'prev', 'btn ghost', 'v56-act-prev') + v56CourseBtn(near.next, 'next', 'btn ghost', 'v56-act-next');
  if (!btns) return s;
  var row = s.lastIndexOf('<div class="v28-btnrow v39-acts">');
  if (row >= 0) {
    var at = s.indexOf('<button type="button" class="btn ghost" data-v39="country" id="v39-act-country"', row);
    if (at < 0) at = s.indexOf('</div>', row);
    return s.slice(0, at) + btns + s.slice(at);
  }
  var close = s.lastIndexOf('</div>');
  return close >= 0 ? s.slice(0, close) + '<div class="v28-btnrow v39-acts">' + btns + '</div>' + s.slice(close) : s;
}
if (typeof v39ArticleHtml === 'function') {
  var _v56ArticleHtml = v39ArticleHtml;
  v39ArticleHtml = function (a) {
    var html = _v56ArticleHtml.apply(this, arguments);
    try { return v56ArticleShape(html, a); } catch (e) { return html; }
  };
}
/* The country page: the course's Previous and Next among its doors. */
function v56CountryShape(html, c) {
  var s = String(html || '');
  var key = (c && typeof v39CountryKey === 'function') ? v39CountryKey(c) : '';
  if (!key || s.indexOf('v56-act-next') >= 0 || s.indexOf('v56-act-prev') >= 0) return s;
  var near = v56Near('country', key);
  var btns = v56CourseBtn(near.prev, 'prev', 'btn ghost', 'v56-act-prev') + v56CourseBtn(near.next, 'next', 'btn ghost', 'v56-act-next');
  if (!btns) return s;
  var row = s.lastIndexOf('<div class="v28-btnrow v39-acts">');
  if (row >= 0) {
    var end = s.indexOf('</div>', row);
    return s.slice(0, end) + btns + s.slice(end);
  }
  var close = s.lastIndexOf('</div>');
  return close >= 0 ? s.slice(0, close) + '<div class="v28-btnrow v39-acts">' + btns + '</div>' + s.slice(close) : s;
}
if (typeof v39CountryHtml === 'function') {
  var _v56CountryHtml = v39CountryHtml;
  v39CountryHtml = function (c) {
    var html = _v56CountryHtml.apply(this, arguments);
    try { return v56CountryShape(html, c); } catch (e) { return html; }
  };
}
/* A country page drawn whole is a step read. */
if (typeof v39CountryView === 'function') {
  var _v56CountryView = v39CountryView;
  v39CountryView = function () {
    var view = _v56CountryView.apply(this, arguments);
    try {
      var c = (typeof v39CountryOf === 'function') ? v39CountryOf(S._v39country) : null;
      if (c && !c.bare && (typeof v39RecReady !== 'function' || v39RecReady(c))) v56MarkCountry(v39CountryKey(c));
    } catch (e) { }
    return view;
  };
}

/* ----- the layer's acts: one listener for every data-v56 control ----- */
var V56_ACTS = {};
V56_ACTS.course = function (node) { v56OpenStep(node.getAttribute('data-kind') || 'region', node.getAttribute('data-key') || ''); };
(function () {
  if (typeof document === 'undefined' || !document || typeof document.addEventListener !== 'function') return;
  document.addEventListener('click', function (e) {
    var t = e && e.target;
    var node = t && typeof t.closest === 'function' ? t.closest('[data-v56]') : null;
    if (!node || node.disabled) return;
    var act = node.getAttribute('data-v56');
    if (!v56Own(V56_ACTS, act) || typeof V56_ACTS[act] !== 'function') return;
    if (typeof e.preventDefault === 'function') e.preventDefault();
    try { if (typeof v32Remember === 'function') v32Remember(node); } catch (err) { }
    V56_ACTS[act](node, e);
  });
})();
