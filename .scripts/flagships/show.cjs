#!/usr/bin/env node
/* show: what the Codex already holds on a group or a producer, printed for the author before a word is written
   (BRIEF.md, "Read first"). It reads the data files and the house pack as they are and writes nothing.

     node .scripts/flagships/show.cjs <group>          the group's plan, its region, then each pick in turn
     node .scripts/flagships/show.cjs <producerId>     one producer (a p- or w- id of WINE_PRODUCERS)
     node .scripts/flagships/show.cjs <pick key>       one pick of the plan, by its key

   Printed: the plan's group (title, region, country, batch, chunk, swaps) and pick (producer, producerId, wine, why, note);
   the region record's summary (REGIONS in js/data-regions.js); the region fragment's producers line for the house
   (.scripts/regions/fragments/*.json, a one line why under its p- id); the WINE_PRODUCERS record (js/data-producers.js:
   sub, founded, holdings, style, why, wines, traps; an empty field there is a true answer); and the house wines on
   Brennan's list whose producer folds to the house's name (the pack named by OOT_HOUSE_PACK, else WorldTable's
   static/shared/packs/brennans-new-orleans.v1.oothouse.json beside this checkout). Never contradict a reviewed fact
   of the library: where you believe one is wrong, keep your record right and say so in its report. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const S = require(path.join(__dirname, 'schema.cjs'));

function load(file, expose) {
  const p = path.join(S.JS_DIR, file);
  if (!fs.existsSync(p)) return null;
  const ctx = { window: {}, document: {}, navigator: {}, console: { log() { }, warn() { }, error() { } } };
  ctx.self = ctx; vm.createContext(ctx);
  try { vm.runInContext(fs.readFileSync(p, 'utf8') + '\n;this.__x = ' + expose + ';', ctx, { filename: file }); }
  catch (e) { console.log('(could not read js/' + file + ': ' + e.message + ')'); return null; }
  return ctx.__x;
}
function packFile() {
  const c = [process.env.OOT_HOUSE_PACK, path.join(S.ROOT, '..', 'worldtable', 'static', 'shared', 'packs', 'brennans-new-orleans.v1.oothouse.json'), path.join(S.ROOT, '..', 'WorldTable', 'static', 'shared', 'packs', 'brennans-new-orleans.v1.oothouse.json')];
  return c.find((p) => p && fs.existsSync(p)) || null;
}
function say(label, v) { console.log('\n## ' + label); console.log(typeof v === 'string' ? v : JSON.stringify(v, null, 1)); }
const ESTATE = /^(?:chateau|domaine|domaines|maison|bodegas?|weingut|tenuta|cantina|quinta|fattoria|podere|castello|marchesi|vina|vinedo|schloss|familia|famille|familie)\s+(?:(?:de|du|des|de la|del|della|di|do|da|dos)\s+)?/;
function core(name) { return S.fold(String(name || '').replace(/\([^)]*\)/g, ' ')).replace(/\bet\b/g, 'and').replace(ESTATE, '').trim(); }

const arg = process.argv[2];
if (!arg || arg === '--help' || arg === '-h') { console.log('usage: node .scripts/flagships/show.cjs <group> | <producerId> | <pick key>'); process.exit(arg ? 0 : 2); }
const plan = S.loadPlan();
const W = load('data-producers.js', 'typeof WINE_PRODUCERS !== "undefined" ? WINE_PRODUCERS : []') || [];
const R = load('data-regions.js', 'typeof REGIONS !== "undefined" ? { regions: REGIONS.regions, countries: REGIONS.countries } : null') || { regions: [], countries: {} };
const regionFragments = {};
const fragDir = path.join(S.ROOT, '.scripts', 'regions', 'fragments');
if (fs.existsSync(fragDir)) fs.readdirSync(fragDir).filter((f) => /\.json$/.test(f) && !/^techniques/.test(f)).forEach((f) => {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(fragDir, f), 'utf8'));
    const recs = Array.isArray(j) ? j : (j.regions || []);
    (Array.isArray(recs) ? recs : []).forEach((r) => { if (r && r.slug) regionFragments[r.slug] = r; });
  } catch (e) { /* a fragment that does not parse is the regions pipeline's concern */ }
});
let pack = null;
const pf = packFile();
if (pf) { try { pack = JSON.parse(fs.readFileSync(pf, 'utf8')); } catch (e) { pack = null; } }
const wines = pack && pack.house && Array.isArray(pack.house.wines) ? pack.house.wines : [];

function showPick(g, p) {
  console.log('\n# ' + p.producer + ' (' + p.key + '): ' + p.wine);
  say('The pick (plan.json)', p);
  const rf = regionFragments[g.region];
  const line = rf && Array.isArray(rf.producers) ? rf.producers.filter((x) => x && ((p.producerId && x.id === p.producerId) || core(x.name) === core(p.producer))) : [];
  say('The region\'s producers line (.scripts/regions/fragments)', line.length ? line : 'none: the region record does not list this house');
  const rec = p.producerId ? W.find((x) => x.id === p.producerId) : null;
  say('The library record (WINE_PRODUCERS)', rec || (p.producerId ? 'no record ' + p.producerId + ': run build-flagships.cjs --plan' : 'none: the house is not in the library, so every fact needs its two sources'));
  const wcore = core(p.wine);
  const wineRecs = W.filter((x) => /^w-/.test(x.id) && x.id !== p.producerId && wcore && (core(x.p) === wcore || (wcore.split(' ').length > 1 && core(x.p).indexOf(wcore) >= 0)));
  if (wineRecs.length) say('The library\'s record of the wine itself (WINE_PRODUCERS, w-)', wineRecs);
  const names = [core(p.producer), wcore].concat(rec ? [core(rec.p)].concat(Array.isArray(rec.aka) ? rec.aka.map(core) : []) : []);
  const ours = wines.filter((w) => { const c = core(w.producer); return c && names.some((n) => n && (c === n || c.indexOf(n + ' ') === 0 || n.indexOf(c + ' ') === 0)); });
  say('On Brennan\'s list (the house pack' + (pf ? '' : ': not found, set OOT_HOUSE_PACK') + ')', ours.length ? ours.map((w) => ({ id: w.id, name: w.name, region: w.region, vintage: w.vintage, grapes: w.grapes })) : 'none');
}
function showRegion(g) {
  const r = (R.regions || []).find((x) => x.slug === g.region);
  say('The region (REGIONS): ' + g.region, r ? { name: r.name, sheet: r.sheet, summary: r.summary } : 'no region ' + g.region);
}

const group = S.groupOf(plan, arg);
if (group) {
  say('The group (plan.json)', { key: group.key, title: group.title, region: group.region, country: group.country, batch: S.batchOf(group), chunk: group.chunk, swaps: group.swaps, picks: group.picks.map((p) => p.producer + ': ' + p.wine) });
  showRegion(group);
  group.picks.forEach((p) => showPick(group, p));
  process.exit(0);
}
const byKey = S.pickOf(plan, arg);
const byId = byKey ? null : (() => { let hit = null; plan.groups.forEach((g) => g.picks.forEach((p) => { if (p.producerId && p.producerId === arg) hit = { group: g, pick: p }; })); return hit; })();
const hit = byKey || byId;
if (hit) { showRegion(hit.group); showPick(hit.group, hit.pick); process.exit(0); }
const rec = W.find((x) => x.id === arg);
if (rec) { say('The library record (WINE_PRODUCERS): no pick of the plan names it', rec); process.exit(0); }
console.error('show: ' + JSON.stringify(arg) + ' is no group, pick key or producer id (plan.json, WINE_PRODUCERS)');
process.exit(1);
