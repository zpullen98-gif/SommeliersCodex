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
      is drawn for a group with no record on the device. The countries come
      in the atlas's own order (codex56's), their regions and groups in the
      plan's.

   3. THE THREE VIEWS, each owned by the Wine Atlas and lit Wine Atlas,
      answering its address warm and cold, Back climbing a house to its
      group, a group to the root and the root to the Wine Atlas root:
      flagships (the root: the countries as chips and sections, each region
      with its groups, each group's five houses as rows naming the flagship
      and a row opening the five at a glance); flaggroup/{key} (the five as
      cards: the house, its flagship, the place and the year, the line for
      the table; then the region, the region's other groups and the root,
      and the groups before and after); flagship/{id} (the house, how to say
      it and the year; At the table first, the line for the table set as
      codex57 sets its forty-five second line; the flagship in full; the
      story; other wines; traps; In the Codex: the library producer page,
      the region page, the grape pages through v53GrapeKey, the group and
      the root; the sources closed at the foot; the houses before and
      after). A screen keeps codex32's one Back: the layer draws no Back of
      its own. The layer's controls carry data-v58 where a page is not built
      by codex32 (V58_ACTS says what each does, one listener hears them all),
      data-go where it is.

   4. THE DOORS: the Wine Atlas root's study doors (codex56's Study) gain
      Producers and flagships, last; a region's page (codex55's, as codex56
      shapes it) gains Five producers before In the Codex, its group or
      groups as doors, with a chip in codex56's study row after Read, and
      nothing where the region has no group; a library producer's page
      (codex16's profile, opened by codex38's doors) with a flagship gains a
      door to it before its drill (v55HubHtml, v55RegionHtml and
      prodProfileView wrapped, typeof guarded and outermost).

   5. ON THE HOUSE'S LIST: on a house's page, after Traps, the house's
      wines of that producer (v53House, v28Wines; the producer and the wine
      alone, read live from the house), matched by codex38's own rule to the
      library when the record is a library producer, else by the bare name;
      each opens its wine card through the list's own door and Back returns
      to the house; the heading names the house (On {name} list where the
      name is already a possessive, else On the list at {name}), and nothing
      is drawn when no house is loaded or it pours none.

   9. THE SHELL: index.html loads js/data-flagships.js then js/codex58.js
      after codex57.js and before boot.js; the worker is codex-v117 and lists
      both.
*/

/* =========== 1. the words =========== */

var V58_WORDS = {
  tab: 'Producers and flagships',
  noData: 'The producers and their flagships are not on this device yet.',
  /* the root */
  rootSub: '{houses} in {groups}, across {regions}',
  oneHouse: 'One house',
  nHouses: '{n} houses',
  oneGroup: 'one group',
  nGroups: '{n} groups',
  oneRegion: 'one region',
  nRegions: '{n} regions',
  rootLine: 'Five houses a region, each with the one wine a sommelier is expected to know: the line to say at the table, the wine in full and the story behind it.',
  partialLine: '{built} of the {roster} houses are written so far; the rest follow as they are finished.',
  countriesNav: 'Countries',
  groupRow: 'The five at a glance',
  groupRowLine: '{title}: the houses as cards, with the line for the table',
  /* a group */
  foundedIn: 'Founded {year}',
  groupLine5: 'Five houses and the wine each is known for. A card opens the house and its flagship in full.',
  groupLineN: '{n} of the five houses are written so far. A card opens the house and its flagship in full.',
  moreH: 'In the Codex',
  regionDoor: 'The region: {name}',
  rootDoor: 'Every region and its five',
  prev: 'Previous: {name}',
  next: 'Next: {name}',
  stepsGroups: 'The groups before and after',
  stepsHouses: 'The houses before and after',
  /* a house */
  sayIt: 'Say it',
  founded: 'Founded',
  atTable: 'At the table',
  sectionsNav: 'Sections',
  wineH: 'The flagship',
  wineChip: 'The flagship',
  grapes: 'The grapes',
  sites: 'The vineyards',
  making: 'How it is made',
  glass: 'In the glass',
  ageing: 'Ageing',
  serve: 'Serving',
  label: 'On the label',
  storyH: 'The story',
  storyChip: 'The story',
  othersH: 'Other wines of the house',
  othersChip: 'Other wines',
  trapsH: 'Traps',
  trapsChip: 'Traps',
  codexH: 'In the Codex',
  codexChip: 'In the Codex',
  codexProducerH: 'The producer profile',
  codexRegionH: 'The region',
  codexGrapesH: 'The grapes',
  codexMoreH: 'Producers and flagships',
  groupDoor: '{title}: all five',
  sourcesH: 'Sources',
  opensNew: ' (opens in a new tab)',
  /* the doors */
  studyH: 'Study',
  atlasLine: '{houses} across {regions}, five to a group, each with its flagship wine',
  oneHouseLow: 'one house',
  and: ' and ',
  fiveH: 'Five producers',
  fiveChip: 'Producers',
  fiveLine: 'The houses of {name} a sommelier is expected to know, each with its flagship wine.',
  fiveLineMany: 'The houses of {name} a sommelier is expected to know, five to a group, each with its flagship wine.',
  libH: 'Its flagship',
  libHMany: 'Its flagships',
  libOpen: 'Open',
  /* on the house's list */
  listH: 'On our list',
  listHOwn: 'On {house} list',
  listHAt: 'On the list at {house}',
  listChip: 'On our list',
  listOne: 'One wine of {name} is on the list. It opens its card.',
  listMany: '{n} wines of {name} are on the list. Each opens its card.'
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
    '.wrap .v58 [hidden]{display:none!important}',
    /* the three views, on the page\'s own ground: a heading moved to takes no ring unless a keyboard put it there */
    '.wrap .v58-view [tabindex="-1"]:focus{outline:none}',
    '.wrap .v58-view [tabindex="-1"]:focus-visible{outline:2px solid var(--gold-hi);outline-offset:3px}',
    /* the chips of the countries and of a house\'s sections: one line that scrolls sideways, each chip whole */
    '.wrap .v58-chips,.wrap .v58-jumps{flex-wrap:nowrap;overflow-x:auto;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;scrollbar-width:thin;margin:14px 0 6px;padding:8px 0}',
    '.wrap .v58-chips .v28-chip,.wrap .v58-jumps .v28-chip{flex:0 0 auto;white-space:nowrap}',
    /* the root: a country, its regions, each group\'s five houses as rows and the row of the five at a glance */
    '.wrap .v58-root .v58-partial{color:var(--gold-soft)}',
    '.wrap .v58-root .v58-country{margin-top:26px}',
    '.wrap .v58-region{margin:0 0 10px}',
    '.wrap .v58-region-h{margin-top:16px}',
    '.wrap .v58-group-h{font-family:var(--house-display,\'Cinzel\',Georgia,serif);font-size:15px;line-height:1.4;letter-spacing:.04em;font-weight:500;color:var(--gold-soft);margin:14px 0 2px;overflow-wrap:anywhere}',
    '.wrap .v58-grouprow .v25row-name{color:var(--gold-hi);font-family:var(--house-display,\'Cinzel\',Georgia,serif);letter-spacing:.03em}',
    /* a group: the five as cards, one under the other on a phone, each card one door with the house its name */
    '.wrap .v58-cards{list-style:none;margin:16px 0 0;padding:0;display:grid;grid-template-columns:minmax(0,1fr);gap:14px}',
    '@media(min-width:720px){.wrap .v58-cards{grid-template-columns:repeat(2,minmax(0,1fr))}}',
    '.wrap .v58-card{position:relative;margin:0;padding:16px 18px 18px;border-radius:6px;min-width:0}',
    '.wrap .v58-card-h{margin:0;padding:0;border:0;font-size:inherit;line-height:inherit}',
    '.wrap .v58-card-open{display:block;width:100%;min-height:44px;margin:0;padding:0;background:none;border:0;border-radius:0;text-align:left;cursor:pointer;font-family:var(--house-display,\'Cinzel\',Georgia,serif);font-size:22px;line-height:1.3;font-weight:600;letter-spacing:.02em;color:var(--claret);overflow-wrap:anywhere}',
    '.wrap .v58-card-open::after{content:"";position:absolute;inset:0;border-radius:6px}',
    '.wrap .v58-card-open:focus{outline:none}',
    '.wrap .v58-card:has(.v58-card-open:focus-visible){outline:2px solid var(--gold-hi);outline-offset:3px}',
    '.wrap .v58-card .v58-card-wine{font-family:var(--house-reading,Georgia,serif);font-size:18px;line-height:1.4;font-weight:600;color:var(--ink);margin:2px 0 0;overflow-wrap:anywhere}',
    '.wrap .v58-card .v58-card-place{font-size:15px;line-height:1.45;color:var(--ink-soft);margin:2px 0 0}',
    '.wrap .v58-card .v58-card-table{font-size:16px;line-height:1.55;color:var(--ink);margin:12px 0 0;padding-left:10px;border-left:2px solid var(--gold)}',
    /* doors and the steps before and after */
    '.wrap .v58-more{margin-top:28px}',
    '.wrap .v58-doors{display:flex;flex-wrap:wrap;gap:8px 10px;margin:8px 0 10px}',
    '.wrap .v58-doors .btn{margin:0;min-height:44px;white-space:normal;text-align:left}',
    '.wrap .v58-cgroup .secgroup{margin-top:14px}',
    '.wrap .v58-steps{display:flex;flex-wrap:wrap;gap:10px;margin:28px 0 8px}',
    '.wrap .v58-steps .btn{margin:0;min-height:44px;flex:1 1 14em;white-space:normal;text-align:left}',
    '.wrap .v58-steps .v58-next{text-align:right}',
    /* a house: how to say it and the year, then At the table as codex57 sets its forty-five second line */
    '.wrap .v58-facts{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:4px 14px;align-items:baseline;margin:12px 0 0}',
    '.wrap .v58-facts dt{font-family:var(--house-display,\'Cinzel\',Georgia,serif);font-size:13px;letter-spacing:.06em;color:var(--gold-soft);margin:0}',
    '.wrap .v58-facts dd{margin:0;font-size:17px;line-height:1.45;color:var(--parch);overflow-wrap:anywhere}',
    '.wrap .v58-table{margin:8px 0 4px}',
    '.wrap .v58-table>.v58-table-h{font-family:var(--house-display,\'Cinzel\',Georgia,serif);border-bottom:1px solid var(--line);margin-top:14px}',
    '.wrap .v58-tline{font-family:var(--house-reading,Georgia,serif);font-size:20px;line-height:1.5;font-weight:600;color:var(--parch);margin:10px 0 0;padding-left:12px;border-left:2px solid var(--line)}',
    /* the sections, on the page\'s own ground */
    '.wrap .v58-sec{margin:28px 0 0}',
    '.wrap .v58-sec p,.wrap .v58-sec li,.wrap .v58-sec dd{font-size:17px;line-height:1.6;color:var(--parch)}',
    '.wrap .v58-sec .v58-wname{font-family:var(--house-display,\'Cinzel\',Georgia,serif);font-size:23px;line-height:1.3;font-weight:600;letter-spacing:.02em;color:var(--gold-hi);margin:8px 0 2px;overflow-wrap:anywhere}',
    '.wrap .v58-sec .v58-wapp{margin:0}',
    '.wrap .v58-sec .v58-wcolour{font-family:var(--house-display,\'Cinzel\',Georgia,serif);font-size:13px;letter-spacing:.06em;color:var(--gold-soft);margin:2px 0 0}',
    '.wrap .v58-rows,.wrap .v58-terms{margin:8px 0 0}',
    '.wrap .v58-rows dt{font-family:var(--house-display,\'Cinzel\',Georgia,serif);font-size:13px;letter-spacing:.05em;line-height:1.5;color:var(--gold-soft);margin:16px 0 2px}',
    '.wrap .v58-terms dt{font-family:var(--house-reading,Georgia,serif);font-size:17px;line-height:1.45;font-weight:700;color:var(--parch);margin:12px 0 1px;overflow-wrap:anywhere}',
    '.wrap .v58-rows dd,.wrap .v58-terms dd{margin:0;overflow-wrap:anywhere}',
    '.wrap .v58-labelh{margin-top:22px}',
    '.wrap .v58-sec .v58-story{margin:8px 0 0}',
    '.wrap .v58-others,.wrap .v58-traps{list-style:none;margin:8px 0 0;padding:0}',
    '.wrap .v58-others li{margin:0;padding:10px 0;border-bottom:1px solid var(--line)}',
    '.wrap .v58-others li:last-child{border-bottom:0}',
    '.wrap .v58-oname{display:block;font-weight:700;color:var(--gold-hi);overflow-wrap:anywhere}',
    '.wrap .v58-onote{display:block}',
    '.wrap .v58-traps li{margin:0 0 12px;padding:2px 0 2px 12px;border-left:3px solid var(--claret)}',
    '.wrap .v58-sourcesbox{margin-top:28px}',
    /* the doors: Five producers on a region\'s page, a library page\'s door to its flagship */
    '.wrap .v58-five{margin:28px 0 8px}',
    '.wrap .v58-five .v32-line{margin:6px 0 10px}',
    '.wrap .v58-libdoor{margin:8px 0 0}',
    '.wrap .v58-libdoor .secbtn{min-height:44px}',
    /* the house\'s wines of the producer: a row a wine, the producer over the wine, each a 48px door to its card */
    '.wrap .v58-sec .v58-listline{margin:4px 0 0}',
    '.wrap .v58-wines{list-style:none;margin:6px 0 0;padding:0}',
    '.wrap .v58-sec .v58-wines li{margin:0;border-bottom:1px solid var(--line)}',
    '.wrap .v58-sec .v58-wines li:last-child{border-bottom:0}',
    '.wrap .v58-wine{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:1px;width:100%;min-height:48px;box-sizing:border-box;padding:8px 0;margin:0;background:none;border:0;border-radius:0;text-align:left;cursor:pointer;font-family:inherit;color:var(--parch)}',
    '.wrap .v58-wine-p{font-size:17px;line-height:1.35;font-weight:700;color:var(--gold-hi);overflow-wrap:anywhere}',
    '.wrap .v58-wine-w{font-size:16px;line-height:1.4;color:var(--parch);overflow-wrap:anywhere}',
    '.wrap .v58-wine:focus-visible{outline:2px solid var(--gold-hi);outline-offset:2px}'
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
/* The group a record belongs to, by its key; null when the device holds no record of it. */
function v58Group(key) {
  var k = v58Str(key);
  var hit = null;
  if (!k) return null;
  v58Groups().some(function (g) { if (g.key === k) { hit = g; return true; } return false; });
  return hit;
}
/* Every record the device holds, in the plan's order (group by group). */
function v58Roster() {
  var out = [];
  v58Groups().forEach(function (g) { g.ids.forEach(function (id) { var r = v58Rec(id); if (r) out.push(r); }); });
  return out;
}
/* The groups of an atlas region, in the plan's order. */
function v58GroupsOf(slug) {
  var s = v58Str(slug);
  return s ? v58Groups().filter(function (g) { return g.region === s; }) : [];
}
/* The records whose house is a library producer (an id of WINE_PRODUCERS). */
function v58OfProducer(pid) {
  var p = v58Str(pid);
  return p ? v58Roster().filter(function (r) { return v58Str(r.producerId) === p; }) : [];
}
/* The atlas's own names: a region's and a country's, the key when the atlas lacks it. */
function v58Region(slug) {
  try { return (typeof v39Find === 'function' && slug) ? v39Find(String(slug)) : null; } catch (e) { return null; }
}
function v58RegionName(slug) { var a = v58Region(slug); return (a && v58Str(a.name)) || v58Str(slug); }
function v58CountryName(key) {
  var c = null;
  try { c = (typeof v39CountryOf === 'function' && key) ? v39CountryOf(String(key)) : null; } catch (e) { c = null; }
  return (c && v58Str(c.name)) || v58Str(key);
}
/* The countries in the atlas's own order (codex56's, the order of the maps), each with its regions in the plan's
   order and each region with its groups; a country the atlas does not list follows, in the plan's order. */
function v58Countries() {
  var groups = v58Groups();
  var order = [];
  try { if (typeof v56Countries === 'function') order = v56Countries().map(function (row) { return v58Str(row && row.key); }); } catch (e) { order = []; }
  var keys = [];
  order.forEach(function (k) { if (k && keys.indexOf(k) < 0 && groups.some(function (g) { return g.country === k; })) keys.push(k); });
  groups.forEach(function (g) { if (g.country && keys.indexOf(g.country) < 0) keys.push(g.country); });
  return keys.map(function (k) {
    var regions = [];
    groups.forEach(function (g) {
      if (g.country !== k) return;
      var at = -1;
      regions.forEach(function (x, i) { if (x.slug === g.region) at = i; });
      if (at < 0) { regions.push({ slug: g.region, name: v58RegionName(g.region), groups: [] }); at = regions.length - 1; }
      regions[at].groups.push(g);
    });
    return { key: k, name: v58CountryName(k), regions: regions };
  });
}
function v58Count(n, one, many) { return Number(n) === 1 ? v58W(one) : v58W(many, { n: Number(n) || 0 }); }
function v58Cap(s) { var t = v58Str(s); return t ? t.charAt(0).toUpperCase() + t.slice(1) : ''; }
function v58P(cls, s) { var t = v58Str(s); return t ? '<p' + (cls ? ' class="' + cls + '"' : '') + '>' + v58Esc(t) + '</p>' : ''; }
/* Labelled rows, a label over its text: [[label, text], ...]; a row with no text is left out. */
function v58Rows(rows, cls) {
  var list = v58List(rows).filter(function (p) { return p && v58Str(p[0]) && v58Str(p[1]); });
  return list.length ? '<dl class="' + (cls || 'v58-rows') + '">' + list.map(function (p) { return '<dt>' + v58Esc(v58Str(p[0])) + '</dt><dd>' + v58Esc(v58Str(p[1])) + '</dd>'; }).join('') + '</dl>' : '';
}

/* =========== 3. the views =========== */

var V58_VIEWS = {};
var V58_ARGS = {};
function v58Go(view, arg, mode) {
  if (typeof v32Go === 'function') v32Go({ view: view, arg: arg == null ? '' : String(arg) }, mode || 'push');
}
function v58Build(html) {
  if (typeof v53CmsBuild === 'function') return v53CmsBuild(html);
  if (typeof v32Build === 'function') return v32Build(html);
  var box = document.createElement('div');
  box.innerHTML = html;
  return box;
}
function v58Head(title, sub) {
  if (typeof v32Head === 'function') return v32Head(title, sub);
  return '<div class="viewhead"><h2 tabindex="-1" class="v32-h">' + v58Esc(title) + '</h2>' + (sub ? '<div class="sub">' + v58Esc(sub) + '</div>' : '') + '</div>';
}
/* A view of the layer: owned by the Wine Atlas, its parent and its lit word the atlas's, drawn from its own
   argument. A def holds draw(arg), accept(arg) (the argument the view keeps, '' when it names nothing the device
   holds; the view then falls to the root), parent(arg) and name(arg). */
function v58View(name, def) {
  V58_VIEWS[name] = def;
  if (typeof V32_PARENT !== 'undefined' && V32_PARENT) V32_PARENT[name] = 'worldmap';
  if (typeof V32_OWNER !== 'undefined' && V32_OWNER) V32_OWNER[name] = 'worldmap';
  if (typeof V25_UNDER !== 'undefined' && V25_UNDER) V25_UNDER[name] = 'worldmap';
  if (typeof V25_HUB !== 'undefined' && V25_HUB) V25_HUB[name] = 'worldmap';
  if (typeof V25_AREA !== 'undefined' && V25_AREA) V25_AREA[name] = 'worldmap';
  if (typeof V25_VIEWS !== 'undefined' && V25_VIEWS) V25_VIEWS[name] = function () { return v58Build(def.draw(V58_ARGS[name] || '')); };
  if (typeof V25_GO !== 'undefined' && V25_GO) V25_GO[name] = function (arg) { v58Go(name, arg); };
}
if (typeof v32Arg === 'function') {
  var _v58Arg = v32Arg;
  v32Arg = function (v) {
    if (v58Own(V58_VIEWS, v)) return String(V58_ARGS[v] || '');
    return _v58Arg.apply(this, arguments);
  };
}
if (typeof v32Apply === 'function') {
  var _v58Apply = v32Apply;
  v32Apply = function (r) {
    if (r && v58Own(V58_VIEWS, r.view)) {
      var view = r.view;
      var def = V58_VIEWS[view];
      var arg = String(r.arg || '');
      if (typeof def.accept === 'function') { try { arg = String(def.accept(arg) || ''); } catch (e) { arg = ''; } }
      if (!arg && def.needsArg) { view = 'flagships'; arg = ''; }
      V58_ARGS[view] = arg;
      S._v25area = 'worldmap';
      S._v28edit = false;
      S.view = view;
      return arg ? { view: view, arg: arg } : { view: view };
    }
    return _v58Apply.apply(this, arguments);
  };
}
if (typeof v32ParentRoute === 'function') {
  var _v58ParentRoute = v32ParentRoute;
  v32ParentRoute = function () {
    try {
      if (v58Own(V58_VIEWS, S.view)) {
        var def = V58_VIEWS[S.view];
        return typeof def.parent === 'function' ? def.parent(V58_ARGS[S.view] || '') : { view: 'worldmap', arg: '' };
      }
    } catch (e) { }
    return _v58ParentRoute.apply(this, arguments);
  };
}
if (typeof v25NavWord === 'function') {
  var _v58NavWord = v25NavWord;
  v25NavWord = function () {
    try { if (v58Own(V58_VIEWS, S.view)) return 'worldmap'; } catch (e) { }
    return _v58NavWord.apply(this, arguments);
  };
}
if (typeof v25MainName === 'function') {
  var _v58MainName = v25MainName;
  v25MainName = function () {
    try { if (S && v58Own(V58_VIEWS, S.view) && typeof V58_VIEWS[S.view].name === 'function') return V58_VIEWS[S.view].name(V58_ARGS[S.view] || ''); } catch (e) { }
    return _v58MainName.apply(this, arguments);
  };
}

/* 3.1 the root, #/v/flagships: the countries in the atlas's order as chips and sections; under each, its regions,
   each region's groups, each group's five houses as rows (the house, its flagship under it) and a row that opens
   the five at a glance. */
/* The flagship as a row or a card names it: its name, and where the name is the house's own (a grand vin of
   Bordeaux) its appellation after it, so the row never reads the house twice. */
function v58WineLine(r) {
  var w = v58Obj(r && r.wine);
  var name = v58Str(w.name);
  if (name && v58Fold(name) === v58Fold(r && r.producer) && v58Str(w.appellation)) return name + ' · ' + v58Str(w.appellation);
  return name;
}
function v58HouseRow(r) {
  var line = v58WineLine(r);
  return '<li><button class="v25row v58-houserow" type="button" data-go="flagship" data-arg="' + v58Esc(r.id) + '" id="v58-h-' + v58Esc(r.id) + '">'
    + '<span class="v25row-name">' + v58Esc(v58Str(r.producer)) + '</span>'
    + (line ? '<span class="v25row-line">' + v58Esc(line) + '</span>' : '') + '</button></li>';
}
function v58GroupRow(g) {
  return '<li><button class="v25row v58-grouprow" type="button" data-go="flaggroup" data-arg="' + v58Esc(g.key) + '" id="v58-g-' + v58Esc(g.key) + '">'
    + '<span class="v25row-name">' + v58Esc(v58W('groupRow')) + '</span>'
    + '<span class="v25row-line">' + v58Esc(v58W('groupRowLine', { title: g.title })) + '</span></button></li>';
}
function v58RootHtml() {
  var countries = v58Countries();
  var roster = v58Roster();
  var meta = v58Meta();
  if (!roster.length) return '<div class="v25page v58 v58-view v58-root">' + v58Head(v58W('tab'), '') + '<p class="v32-line">' + v58Esc(v58W('noData')) + '</p></div>';
  var nGroups = v58Groups().length;
  var nRegions = 0;
  countries.forEach(function (c) { nRegions += c.regions.length; });
  var sub = v58W('rootSub', { houses: v58Count(roster.length, 'oneHouse', 'nHouses'), groups: v58Count(nGroups, 'oneGroup', 'nGroups'), regions: v58Count(nRegions, 'oneRegion', 'nRegions') });
  var html = '<div class="v25page v58 v58-view v58-root" id="v58-root">' + v58Head(v58W('tab'), sub)
    + '<p class="v32-line">' + v58Esc(v58W('rootLine')) + '</p>';
  if (meta.partial && Number(meta.roster) > roster.length) html += '<p class="v32-line v58-partial">' + v58Esc(v58W('partialLine', { built: roster.length, roster: Number(meta.roster) })) + '</p>';
  if (countries.length > 1) {
    html += '<nav class="v32chips v58-chips" aria-label="' + v58Esc(v58W('countriesNav')) + '">' + countries.map(function (c) {
      return '<button type="button" class="v28-chip" data-v53="jump" data-to="v58-c-' + v58Esc(c.key) + '">' + v58Esc(c.name) + '</button>';
    }).join('') + '</nav>';
  }
  countries.forEach(function (c) {
    html += '<section class="v32-sec v58-country" aria-labelledby="v58-c-' + v58Esc(c.key) + '"><h2 class="v32-h2" id="v58-c-' + v58Esc(c.key) + '" tabindex="-1">' + v58Esc(c.name) + '</h2>';
    c.regions.forEach(function (rg) {
      html += '<div class="v58-region" data-v58-region="' + v58Esc(rg.slug) + '"><h3 class="secgroup v32-gh v58-region-h">' + v58Esc(rg.name) + '</h3>';
      rg.groups.forEach(function (g) {
        var own = rg.groups.length > 1 || v58Fold(g.title) !== v58Fold(rg.name);
        html += '<div class="v58-group" data-v58-group="' + v58Esc(g.key) + '">' + (own ? '<h4 class="v58-group-h">' + v58Esc(g.title) + '</h4>' : '')
          + '<ul class="v25rows v32rows v58-houses">' + g.ids.map(function (id) { return v58HouseRow(v58Rec(id)); }).join('') + v58GroupRow(g) + '</ul></div>';
      });
      html += '</div>';
    });
    html += '</section>';
  });
  return html + '</div>';
}

/* 3.2 a group, #/v/flaggroup/{key}: its five houses as cards (the house, its flagship, the place and the year,
   the line for the table), each card opening the house; then the region, the region's other groups, the root, and
   the groups before and after it in the plan's order. */
function v58Founded(r) { var y = v58Str(r && r.founded); return y ? v58W('foundedIn', { year: y }) : ''; }
function v58CardHtml(r) {
  var where = [v58Str(r.place), v58Founded(r)].filter(Boolean).join(' · ');
  return '<li class="card v58-card" data-v58-card="' + v58Esc(r.id) + '">'
    + '<h3 class="v58-card-h"><button type="button" class="v58-card-open" data-go="flagship" data-arg="' + v58Esc(r.id) + '" id="v58-card-' + v58Esc(r.id) + '">' + v58Esc(v58Str(r.producer)) + '</button></h3>'
    + v58P('v58-card-wine', v58WineLine(r)) + v58P('v58-card-place', where) + v58P('v58-card-table', r.table) + '</li>';
}
function v58Door(attrs, label, id) {
  return '<button type="button" class="btn ghost" ' + attrs + (id ? ' id="' + v58Esc(id) + '"' : '') + '>' + v58Esc(label) + '</button>';
}
function v58StepsHtml(prev, next, kind) {
  var b = function (x, key, dir) {
    if (!x) return '';
    var attrs = kind === 'group' ? 'data-go="flaggroup" data-arg="' + v58Esc(x.key) + '"' : 'data-go="flagship" data-arg="' + v58Esc(x.id) + '"';
    var name = kind === 'group' ? x.title : v58Str(x.producer);
    return '<button type="button" class="btn ghost v58-step v58-' + dir + '" ' + attrs + ' id="v58-' + dir + '">' + v58Esc(v58W(key, { name: name })) + '</button>';
  };
  var inner = b(prev, 'prev', 'prev') + b(next, 'next', 'next');
  return inner ? '<nav class="v58-steps" aria-label="' + v58Esc(v58W(kind === 'group' ? 'stepsGroups' : 'stepsHouses')) + '">' + inner + '</nav>' : '';
}
function v58GroupHtml(key) {
  var g = v58Group(key);
  if (!g) return v58RootHtml();
  var all = v58Groups();
  var at = -1;
  all.forEach(function (x, i) { if (x.key === g.key) at = i; });
  var region = v58Region(g.region);
  var sub = [v58RegionName(g.region), v58CountryName(g.country)].filter(Boolean).join(', ');
  var html = '<div class="v25page v58 v58-view v58-groupview" data-v58-group="' + v58Esc(g.key) + '">' + v58Head(g.title, sub)
    + '<p class="v32-line">' + v58Esc(g.ids.length >= 5 ? v58W('groupLine5') : v58W('groupLineN', { n: g.ids.length })) + '</p>'
    + '<ol class="v58-cards">' + g.ids.map(function (id) { return v58CardHtml(v58Rec(id)); }).join('') + '</ol>';
  var doors = '';
  if (region) doors += v58Door('data-v39="region" data-slug="' + v58Esc(region.slug) + '"', v58W('regionDoor', { name: v58Str(region.name) }), 'v58-region-door');
  v58GroupsOf(g.region).forEach(function (x) { if (x.key !== g.key) doors += v58Door('data-go="flaggroup" data-arg="' + v58Esc(x.key) + '"', x.title, 'v58-sib-' + x.key); });
  doors += v58Door('data-go="flagships"', v58W('rootDoor'), 'v58-root-door');
  html += '<section class="v32-sec v58-more" aria-labelledby="v58-more-h"><h2 class="v32-h2" id="v58-more-h" tabindex="-1">' + v58Esc(v58W('moreH')) + '</h2><div class="v58-doors">' + doors + '</div></section>';
  html += v58StepsHtml(at > 0 ? all[at - 1] : null, at >= 0 && at < all.length - 1 ? all[at + 1] : null, 'group');
  return html + '</div>';
}

/* 3.3 a house, #/v/flagship/{id}: the house (its name, how to say it, where and since when); At the table first,
   the line for the table large as codex57 draws its forty-five second line; the flagship in full; the story; the
   house's other wines; the traps; In the Codex; the sources closed at the foot; the houses before and after it. */
function v58GrapeSlugs(text) {
  var out = [];
  if (typeof v53GrapeKey !== 'function') return out;
  var words = v58Fold(text).split(' ').filter(Boolean);
  var i = 0;
  while (i < words.length) {
    var hit = '', len = 0;
    for (var n = Math.min(3, words.length - i); n >= 1 && !hit; n--) {
      var k = '';
      try { k = v58Str(v53GrapeKey(words.slice(i, i + n).join(' '))); } catch (e) { k = ''; }
      if (k) { hit = k; len = n; }
    }
    if (hit) { if (out.indexOf(hit) < 0) out.push(hit); i += len; } else i++;
  }
  return out.filter(function (s) { try { return typeof v53GrapeFind !== 'function' || !!v53GrapeFind(s); } catch (e) { return false; } });
}
function v58GrapeName(slug) {
  try { if (typeof v53GrapeName === 'function') { var n = v58Str(v53GrapeName(slug)); if (n) return n; } } catch (e) { }
  try { if (typeof v53GrapeFind === 'function') { var r = v53GrapeFind(slug); if (r && v58Str(r.name)) return v58Str(r.name); } } catch (e2) { }
  return slug;
}
function v58Library(pid) {
  try { return (typeof prodById === 'function' && pid) ? prodById(String(pid)) : null; } catch (e) { return null; }
}
function v58Sec(id, title, body, cls) {
  if (!body) return '';
  return '<section class="v58-sec' + (cls ? ' ' + cls : '') + '" aria-labelledby="' + id + '"><h2 class="v32-h2 v58-sec-h" id="' + id + '" tabindex="-1">' + v58Esc(title) + '</h2>' + body + '</section>';
}
function v58WineBody(r) {
  var w = v58Obj(r.wine);
  var app = [v58Str(w.appellation), v58Str(w.classification)].filter(Boolean).join(' · ');
  var html = v58P('v58-wname', w.name) + v58P('v58-wapp', app) + v58P('v58-wcolour', v58Cap(w.colour));
  html += v58Rows([[v58W('grapes'), w.grapes], [v58W('sites'), w.sites], [v58W('making'), w.making], [v58W('glass'), w.glass], [v58W('ageing'), w.ageing], [v58W('serve'), w.serve]], 'v58-rows v58-winerows');
  var terms = v58Rows(v58List(w.label).map(function (x) { return [x && x.term, x && x.means]; }), 'v58-terms');
  if (terms) html += '<h3 class="secgroup v32-gh v58-labelh">' + v58Esc(v58W('label')) + '</h3>' + terms;
  return html;
}
function v58OthersBody(r) {
  var rows = v58List(r.others).map(function (o) {
    var n = v58Str(o && o.name), t = v58Str(o && o.note);
    return n ? '<li><span class="v58-oname">' + v58Esc(n) + '</span>' + (t ? '<span class="v58-onote">' + v58Esc(t) + '</span>' : '') + '</li>' : '';
  }).join('');
  return rows ? '<ul class="v58-others">' + rows + '</ul>' : '';
}
function v58TrapsBody(r) {
  var rows = v58List(r.traps).map(function (t) { var s = v58Str(t); return s ? '<li>' + v58Esc(s) + '</li>' : ''; }).join('');
  return rows ? '<ul class="v58-traps">' + rows + '</ul>' : '';
}
function v58CodexBody(r) {
  var groups = [];
  var lib = v58Library(r.producerId);
  if (lib) groups.push(['codexProducerH', v58Door('data-v58="producer" data-id="' + v58Esc(lib.id) + '"', v58Str(lib.p) || v58Str(r.producer), 'v58-lib-door')]);
  var region = v58Region(r.region);
  if (region) groups.push(['codexRegionH', v58Door('data-v39="region" data-slug="' + v58Esc(region.slug) + '"', v58Str(region.name), 'v58-region-door')]);
  var grapes = v58GrapeSlugs(v58Obj(r.wine).grapes);
  if (grapes.length) groups.push(['codexGrapesH', grapes.map(function (s) { return v58Door('data-go="grape" data-arg="' + v58Esc(s) + '"', v58GrapeName(s), 'v58-grape-' + s); }).join('')]);
  var g = v58Group(r.group);
  groups.push(['codexMoreH', (g ? v58Door('data-go="flaggroup" data-arg="' + v58Esc(g.key) + '"', v58W('groupDoor', { title: g.title }), 'v58-group-door') : '') + v58Door('data-go="flagships"', v58W('rootDoor'), 'v58-root-door')]);
  return groups.map(function (x) { return '<div class="v58-cgroup"><h3 class="secgroup v32-gh">' + v58Esc(v58W(x[0])) + '</h3><div class="v58-doors">' + x[1] + '</div></div>'; }).join('');
}
function v58SourcesBody(r) {
  var rows = v58List(r.sources).map(function (s) {
    var title = v58Str(s && s.title), url = v58Str(s && s.url);
    if (!title) return '';
    return '<li>' + (/^https:\/\//i.test(url) ? '<a href="' + v58Esc(url) + '" target="_blank" rel="noopener">' + v58Esc(title) + '<span class="sr-only">' + v58Esc(v58W('opensNew')) + '</span></a>' : v58Esc(title)) + '</li>';
  }).join('');
  return rows ? '<ul class="v39-lines v39-sources v58-sources">' + rows + '</ul>' : '';
}
/* The page's sections, in order: [id, its chip, body, class, its heading]. A section with no body is left out with
   its chip. The layer's later parts add theirs through V58_SECS (extended key by key: { after, make(r) }). */
var V58_SECS = {};
function v58Sections(r) {
  var list = [
    ['v58-s-wine', v58W('wineChip'), v58WineBody(r), 'v58-wine', v58W('wineH')],
    ['v58-s-story', v58W('storyChip'), v58P('v58-story', r.story), 'v58-storysec', v58W('storyH')],
    ['v58-s-others', v58W('othersChip'), v58OthersBody(r), 'v58-otherssec', v58W('othersH')],
    ['v58-s-traps', v58W('trapsChip'), v58TrapsBody(r), 'v58-trapssec', v58W('trapsH')],
    ['v58-s-codex', v58W('codexChip'), v58CodexBody(r), 'v58-codex', v58W('codexH')]
  ];
  Object.keys(V58_SECS).forEach(function (k) {
    var x = V58_SECS[k];
    var sec = null;
    try { sec = (x && typeof x.make === 'function') ? x.make(r) : null; } catch (e) { sec = null; }
    if (!sec || !sec[2]) return;
    var at = -1;
    list.forEach(function (y, i) { if (y[0] === x.after) at = i; });
    list.splice(at >= 0 ? at + 1 : list.length, 0, sec);
  });
  return list.filter(function (x) { return !!x[2]; });
}
function v58PageHtml(id) {
  var r = v58Rec(id);
  if (!r) return v58RootHtml();
  var roster = v58Roster();
  var at = -1;
  roster.forEach(function (x, i) { if (x.id === r.id) at = i; });
  var html = '<div class="v25page v58 v58-view v58-page" data-v58-flagship="' + v58Esc(r.id) + '">' + v58Head(v58Str(r.producer), v58Str(r.place));
  html += v58Rows([[v58W('sayIt'), r.say], [v58W('founded'), r.founded]], 'v58-facts');
  html += '<section class="v58-table" aria-labelledby="v58-table-h"><h3 class="secgroup v58-table-h" id="v58-table-h">' + v58Esc(v58W('atTable')) + '</h3>' + v58P('v58-tline', r.table) + '</section>';
  var secs = v58Sections(r);
  html += '<nav class="v32chips v58-jumps" aria-label="' + v58Esc(v58W('sectionsNav')) + '">' + secs.map(function (s) {
    return '<button type="button" class="v28-chip" data-v53="jump" data-to="' + s[0] + '" id="' + s[0] + '-chip">' + v58Esc(s[1]) + '</button>';
  }).join('') + '</nav>';
  html += secs.map(function (s) { return v58Sec(s[0], s[4], s[2], s[3]); }).join('');
  var src = v58SourcesBody(r);
  if (src) html += '<details class="v28-q v39-sec v58-sourcesbox" id="v58-s-sources"><summary>' + v58Esc(v58W('sourcesH')) + '</summary><div class="v39-body">' + src + '</div></details>';
  html += v58StepsHtml(at > 0 ? roster[at - 1] : null, at >= 0 && at < roster.length - 1 ? roster[at + 1] : null, 'house');
  return html + '</div>';
}

/* The library producer page, from a house's In the Codex: pushed, so Back returns to the house. */
function v58OpenProducer(id) {
  var rec = v58Library(id);
  if (!rec) return false;
  v58Go('producers', rec.id, 'push');
  return true;
}

v58View('flagships', {
  draw: function () { return v58RootHtml(); },
  accept: function () { return ''; },
  name: function () { return v58W('tab'); },
  parent: function () { return { view: 'worldmap', arg: '' }; }
});
v58View('flaggroup', {
  needsArg: true,
  draw: function (arg) { return v58GroupHtml(arg); },
  accept: function (arg) { var g = v58Group(arg); return g ? g.key : ''; },
  name: function (arg) { var g = v58Group(arg); return g ? g.title : v58W('tab'); },
  parent: function () { return { view: 'flagships' }; }
});
v58View('flagship', {
  needsArg: true,
  draw: function (arg) { return v58PageHtml(arg); },
  accept: function (arg) { var r = v58Rec(arg); return r ? r.id : ''; },
  name: function (arg) { var r = v58Rec(arg); return r ? v58Str(r.producer) : v58W('tab'); },
  parent: function (arg) { var r = v58Rec(arg); var g = r ? v58Group(r.group) : null; return g ? { view: 'flaggroup', arg: g.key } : { view: 'flagships' }; }
});

/* =========== the acts =========== */

/* What a control of the layer does, by its data-v58 word: extended key by key. One listener for them all. */
var V58_ACTS = {
  producer: function (node) { return v58OpenProducer(node && typeof node.getAttribute === 'function' ? node.getAttribute('data-id') : ''); },
  open: function (node) {
    var id = node && typeof node.getAttribute === 'function' ? v58Str(node.getAttribute('data-id')) : '';
    if (!v58Rec(id)) return false;
    v58Go('flagship', id, 'push');
    return true;
  }
};
(function () {
  if (typeof document === 'undefined' || !document || typeof document.addEventListener !== 'function') return;
  document.addEventListener('click', function (e) {
    var t = e && e.target;
    var node = t && typeof t.closest === 'function' ? t.closest('[data-v58]') : null;
    if (!node || node.disabled) return;
    var act = node.getAttribute('data-v58');
    if (!v58Own(V58_ACTS, act) || typeof V58_ACTS[act] !== 'function') return;
    if (typeof e.preventDefault === 'function') e.preventDefault();
    try { if (typeof v32Remember === 'function') v32Remember(node); } catch (err) { }
    try { V58_ACTS[act](node, e); } catch (err2) { }
  });
})();

/* =========== 4. the doors =========== */

/* 4.1 the Wine Atlas root: Producers and flagships joins codex56's study doors, after Compare two regions; on a
   chain with no study doors, a section of its own ahead of the sheets. */
function v58AtlasRow() {
  var n = v58Roster().length;
  if (!n) return '';
  return '<li><button class="v25row" type="button" data-go="flagships" id="v58-atlas-door"><span class="v25row-name">' + v58Esc(v58W('tab')) + '</span>'
    + '<span class="v25row-line">' + v58Esc(v58W('atlasLine', { houses: v58Count(n, 'oneHouseLow', 'nHouses'), regions: v58Count(v58RegionCount(), 'oneRegion', 'nRegions') })) + '</span></button></li>';
}
function v58RegionCount() {
  var seen = {}, n = 0;
  v58Groups().forEach(function (g) { if (g.region && !seen[g.region]) { seen[g.region] = 1; n++; } });
  return n;
}
function v58HubShape(html) {
  var s = String(html || '');
  if (s.indexOf('id="v58-atlas-door"') >= 0) return s;
  var row = v58AtlasRow();
  if (!row) return s;
  var at = s.indexOf('<ul class="v25rows v32rows v56-doors">');
  var end = at >= 0 ? s.indexOf('</ul>', at) : -1;
  if (end >= 0) return s.slice(0, end) + row + s.slice(end);
  var sec = '<section class="v32-sec v58 v58-atlasdoors" aria-labelledby="v58-atlas-h"><h2 class="v32-h2" id="v58-atlas-h" tabindex="-1">' + v58Esc(v58W('studyH')) + '</h2><ul class="v25rows v32rows">' + row + '</ul></section>';
  var sheets = s.indexOf('<section class="v32-sec v55-sheets"');
  return sheets >= 0 ? s.slice(0, sheets) + sec + s.slice(sheets) : s;
}
if (typeof v55HubHtml === 'function') {
  var _v58HubHtml = v55HubHtml;
  v55HubHtml = function () {
    var html = _v58HubHtml.apply(this, arguments);
    try { return v58HubShape(html); } catch (e) { return html; }
  };
}

/* 4.2 a region's page: Five producers, its group or groups as doors (each the group's title over its five
   houses), before In the Codex; a chip in codex56's study row after Read. Nothing when the region has no group. */
function v58And(list) {
  var l = v58List(list).filter(Boolean);
  if (l.length < 2) return l.join('');
  return l.slice(0, -1).join(', ') + v58W('and') + l[l.length - 1];
}
function v58FiveHtml(a) {
  var groups = v58GroupsOf(a && a.slug);
  if (!groups.length) return '';
  var rows = groups.map(function (g) {
    var names = g.ids.map(function (id) { var r = v58Rec(id); return r ? v58Str(r.producer) : ''; });
    return '<li><button class="v25row" type="button" data-go="flaggroup" data-arg="' + v58Esc(g.key) + '" id="v58-five-' + v58Esc(g.key) + '"><span class="v25row-name">' + v58Esc(g.title) + '</span>'
      + '<span class="v25row-line">' + v58Esc(v58And(names)) + '</span></button></li>';
  }).join('');
  return '<section class="v58 v58-five" aria-labelledby="v58-five-h"><h2 class="v32-h2" id="v58-five-h" tabindex="-1">' + v58Esc(v58W('fiveH')) + '</h2>'
    + '<p class="v32-line">' + v58Esc(v58W(groups.length > 1 ? 'fiveLineMany' : 'fiveLine', { name: v58Str(a.name) })) + '</p><ul class="v25rows v32rows">' + rows + '</ul></section>';
}
function v58RegionShape(html, a) {
  var s = String(html || '');
  if (!a || s.indexOf('id="v58-five-h"') >= 0) return s;
  var five = v58FiveHtml(a);
  if (!five) return s;
  var at = s.indexOf('<section class="v55-codex"');
  if (at < 0) at = s.lastIndexOf('<div class="v28-btnrow v39-acts">');
  if (at >= 0) s = s.slice(0, at) + five + s.slice(at);
  else { var close = s.lastIndexOf('</div>'); s = close >= 0 ? s.slice(0, close) + five + s.slice(close) : s + five; }
  var read = s.indexOf('id="v56-s-read"');
  var end = read >= 0 ? s.indexOf('</button>', read) : -1;
  if (end > 0) s = s.slice(0, end + 9) + '<button type="button" class="v28-chip" data-v56="jump" data-to="v58-five-h" id="v58-s-five">' + v58Esc(v58W('fiveChip')) + '</button>' + s.slice(end + 9);
  return s;
}
if (typeof v55RegionHtml === 'function') {
  var _v58RegionHtml = v55RegionHtml;
  v55RegionHtml = function (a) {
    var html = _v58RegionHtml.apply(this, arguments);
    try { return v58RegionShape(html, a); } catch (e) { return html; }
  };
}

/* 4.3 a library producer's page (codex16's profile, read by codex38's doors): a house with a flagship gains a
   door to it, in the page's own markup, before the drill. The page is a node; the door is put in place. */
function v58ProfileDoor(v, rec) {
  if (!v || typeof v.querySelector !== 'function' || !rec || !rec.id) return;
  var list = v58OfProducer(rec.id);
  if (!list.length || v.querySelector('.v58-libdoor')) return;
  var box = document.createElement('div');
  box.className = 'v58 v58-libdoor';
  box.innerHTML = '<div class="secgroup">' + v58Esc(v58W(list.length > 1 ? 'libHMany' : 'libH')) + '</div>' + list.map(function (r) {
    return '<button type="button" class="secbtn v58-libbtn" data-v58="open" data-id="' + v58Esc(r.id) + '" id="v58-lib-' + v58Esc(r.id) + '"><span>' + v58Esc(v58Str(v58Obj(r.wine).name)) + '</span><span class="n">' + v58Esc(v58W('libOpen')) + '</span></button>';
  }).join('');
  var row = v.querySelector('.centerrow');
  var host = row && row.parentNode ? row.parentNode : (v.firstElementChild || v);
  if (row && row.parentNode) host.insertBefore(box, row);
  else host.appendChild(box);
}
if (typeof prodProfileView === 'function') {
  var _v58ProfileView = prodProfileView;
  prodProfileView = function (rec) {
    var v = _v58ProfileView.apply(this, arguments);
    try { v58ProfileDoor(v, rec); } catch (e) { }
    return v;
  };
}

/* =========== 5. on the house's list =========== */

/* The house: codex53's, else codex32's; null when none is loaded. */
function v58House() {
  try { return (typeof v53House === 'function') ? v53House() : ((typeof v32House === 'function') ? v32House() : null); } catch (e) { return null; }
}
/* A field of a house wine as plain text: the value as the pack holds it, or the value a person kept. */
function v58Field(item, k) {
  if (!item) return '';
  if (typeof item[k] === 'string') return item[k].trim();
  var v = null;
  try { v = (typeof v28KV === 'function') ? v28KV(item, k) : null; } catch (e) { v = null; }
  return typeof v === 'string' ? v.trim() : '';
}
/* A name as codex38 reads a house: folded whole, the estate word at its front taken off. */
function v58Bare(s) {
  if (typeof v38Bare === 'function') { try { return v58Str(v38Bare(s)); } catch (e) { } }
  return v58Fold(s).replace(/ et(?= )/g, ' and').replace(/^(?:domaine|domaines|chateau|maison|weingut|bodega|bodegas|tenuta|cantina|quinta|champagne|famille|familia|familie) (?:(?:des|de la|de l|du|de|d) )?/, '').trim();
}
/* Whether a house wine's producer is the record's house: by codex38's own match to the library when the record
   is a library producer and the house's name finds a library record; else by the bare name, the same or one the
   start of the other on a whole word (Biondi Santi (Tenuta Greppo) is Biondi-Santi). */
function v58IsHouse(r, producer) {
  var p = v58Str(producer);
  if (!p || !r) return false;
  var pid = v58Str(r.producerId);
  if (pid && pid.indexOf('p-') === 0 && typeof v38Library === 'function') {
    var lib = null;
    try { lib = v38Library([p, typeof v38ShortWho === 'function' ? v38ShortWho(p) : p]); } catch (e) { lib = null; }
    if (lib && lib.id) return lib.id === pid;
  }
  var a = v58Bare(p.replace(/\([^)]*\)/g, ' ')), b = v58Bare(v58Str(r.producer));
  if (!a || !b) return false;
  return a === b || a.indexOf(b + ' ') === 0 || b.indexOf(a + ' ') === 0;
}
/* The house's wines of a record's producer, in the list's own order, each { id, producer, wine }: the producer and
   the wine alone, never a price, a year, a bin or a note; a wine the list holds twice is one row, opening the
   first. Empty when no house is loaded. */
function v58HouseWines(r) {
  var out = [];
  var h = v58House();
  if (!r || !h || typeof v28Wines !== 'function') return out;
  var seen = {};
  var wines = [];
  try { wines = v28Wines(h) || []; } catch (e) { wines = []; }
  wines.forEach(function (w) {
    var producer = v58Field(w, 'producer'), wine = v58Field(w, 'wine');
    if (!w || !w.id || !v58IsHouse(r, producer)) return;
    var k = v58Fold(producer) + '|' + v58Fold(wine);
    if (seen[k]) return;
    seen[k] = 1;
    out.push({ id: w.id, producer: producer, wine: wine });
  });
  return out;
}
/* The heading names the house: On {name} list where the house's name is a possessive, else On the list at {name}. */
function v58ListTitle() {
  var h = v58House();
  var name = v58Str(h && h.name);
  if (!name) return v58W('listH');
  return /['’]s$/i.test(name) ? v58W('listHOwn', { house: name }) : v58W('listHAt', { house: name });
}
function v58ListBody(r) {
  var list = v58HouseWines(r);
  if (!list.length) return '';
  return v58P('v58-listline', list.length === 1 ? v58W('listOne', { name: v58Str(r.producer) }) : v58W('listMany', { n: list.length, name: v58Str(r.producer) }))
    + '<ul class="v58-wines">' + list.map(function (x) {
      return '<li><button type="button" class="v58-wine" data-v58="wine" data-id="' + v58Esc(x.id) + '" id="v58-w-' + v58Esc(x.id) + '">'
        + '<span class="v58-wine-p">' + v58Esc(x.producer || x.wine) + '</span>'
        + ((x.producer && x.wine) ? '<span class="v58-wine-w">' + v58Esc(x.wine) + '</span>' : '') + '</button></li>';
    }).join('') + '</ul>';
}
/* A house wine's card, opened as codex57 opens one from a grape's page: the list's own card screen, pushed, so
   Back returns to the house. */
function v58OpenWine(id) {
  var wid = v58Str(id);
  if (!wid) return false;
  var known = false;
  try { known = typeof v28Wines === 'function' && v28Wines(v58House()).some(function (w) { return w.id === wid; }); } catch (e) { known = false; }
  if (!known) return false;
  if (typeof v32OpenWine === 'function') { v32OpenWine(wid); return true; }
  if (typeof v28Open !== 'function') return false;
  try { S._v28edit = false; S.view = 'cellar'; } catch (e) { return false; }
  v28Open(wid, false);
  return true;
}
V58_SECS.list = {
  after: 'v58-s-traps',
  make: function (r) { return ['v58-s-list', v58W('listChip'), v58ListBody(r), 'v58-list', v58ListTitle()]; }
};
V58_ACTS.wine = function (node) { return v58OpenWine(node && typeof node.getAttribute === 'function' ? node.getAttribute('data-id') : ''); };

/* =========== the cold address =========== */

/* A reload on one of the layer's views: codex32 read the address before they were known, so it is read again
   here, once, and the first render replaces (codex39's way). This block stays last. */
(function () {
  try {
    if (typeof V32 === 'undefined' || !V32 || V32.moved || typeof v32Parse !== 'function' || typeof v32Apply !== 'function') return;
    var hash = typeof V32.initialHash === 'string' ? V32.initialHash : '';
    if (!hash && typeof location !== 'undefined' && location && typeof location.hash === 'string') hash = location.hash;
    var m = /^#\/v\/([a-z0-9]+)(\/|$)/.exec(hash);
    if (!m || !v58Own(V58_VIEWS, m[1])) return;
    var r = v32Parse(hash);
    if (!r) return;
    v32Apply(r, typeof v32CurState === 'function' ? v32CurState() : null);
    V32.pend = 'replace';
  } catch (e) { }
})();
