#!/usr/bin/env node
/* show: what the Codex already holds on a house of the class sheet, printed for the author before a word is written
   (BRIEF.md, "Read first"). It reads the data files, the Flagships tab's fragment and the house pack as they are and
   writes nothing.

     node .scripts/champagne/show.cjs <house key>     one house of the plan (ayala, moet-chandon)
     node .scripts/champagne/show.cjs <chunk>         every house of a chunk in turn (pilots, h1 to h5)
     node .scripts/champagne/show.cjs --sheet         the sheet beside the labels, all 23 rows

   Printed for a house: the plan's row (the cuvée as the label prints it, what the sheet prints, the second cuvée, the
   why and the note of what you must settle); the library's record of the house (WINE_PRODUCERS in
   js/data-producers.js: sub, founded, holdings, style, why, wines, traps; an empty field there is a true answer) and
   its own record of the cuvée where it holds one; the published record of the house in Producers and flagships
   (.scripts/flagships/fragments/champagne.json, refuted: its wine, table line, story, others, traps, sources and what
   its refuter changed and left open); the Champagne region record's producers line for the house; and the house's
   wines on Brennan's list (the pack named by OOT_HOUSE_PACK, else WorldTable's static/shared/packs beside this
   checkout). Never contradict a published record: where you believe one is wrong, keep your record right and say so
   in its report. */
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
  const tail = ['static', 'shared', 'packs', 'brennans-new-orleans.v1.oothouse.json'];
  const c = [process.env.OOT_HOUSE_PACK, path.join.apply(path, [S.ROOT, '..', 'worldtable'].concat(tail)), path.join.apply(path, [S.ROOT, '..', 'WorldTable'].concat(tail))];
  return c.find((p) => p && fs.existsSync(p)) || null;
}
function say(label, v) { console.log('\n## ' + label); console.log(typeof v === 'string' ? v : JSON.stringify(v, null, 1)); }
function core(name) { return S.fold(String(name || '').replace(/\([^)]*\)/g, ' ')).replace(/\bet\b/g, 'and').replace(/^(?:champagne|maison)\s+/, '').trim(); }

const arg = process.argv[2];
if (!arg || arg === '--help' || arg === '-h') { console.log('usage: node .scripts/champagne/show.cjs <house key> | <chunk> | --sheet'); process.exit(arg ? 0 : 2); }
const plan = S.loadPlan();
if (arg === '--sheet') {
  S.roster(plan).forEach((p, i) => console.log((i + 1) + '. ' + p.house + ' [' + p.key + ', ' + p.chunk + ']\n   the sheet prints: ' + p.sheet + '\n   the label prints: ' + p.cuvee + (p.also ? '; and ' + p.also.name + ' (' + p.also.standing + (p.also.sheet ? ', the sheet: ' + p.also.sheet : ', not on the sheet') + ')' : '') + (S.sheetDiffers(p) ? '' : '   (the same)')));
  process.exit(0);
}
const W = load('data-producers.js', 'typeof WINE_PRODUCERS !== "undefined" ? WINE_PRODUCERS : []') || [];
let flag = null;
try { flag = JSON.parse(fs.readFileSync(path.join(S.ROOT, '.scripts', 'flagships', 'fragments', 'champagne.json'), 'utf8')); } catch (e) { flag = null; }
let region = null;
const fragDir = path.join(S.ROOT, '.scripts', 'regions', 'fragments');
if (fs.existsSync(fragDir)) fs.readdirSync(fragDir).filter((f) => /\.json$/.test(f) && !/^techniques/.test(f)).forEach((f) => {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(fragDir, f), 'utf8'));
    const recs = Array.isArray(j) ? j : (j.regions || []);
    (Array.isArray(recs) ? recs : []).forEach((r) => { if (r && r.slug === 'champagne') region = r; });
  } catch (e) { /* a fragment that does not parse is the regions pipeline's concern */ }
});
let pack = null;
const pf = packFile();
if (pf) { try { pack = JSON.parse(fs.readFileSync(pf, 'utf8')); } catch (e) { pack = null; } }
const wines = pack && pack.house && Array.isArray(pack.house.wines) ? pack.house.wines : [];

function showHouse(p) {
  console.log('\n# ' + p.house + ' (' + p.key + ', ' + p.chunk + '): ' + p.cuvee);
  say('The plan\'s row (plan.json)', p);
  say('The sheet and the label', 'the class sheet prints: ' + p.sheet + '\nthe label prints: ' + p.cuvee + (p.also ? '\nthe second cuvée: ' + p.also.name + ' (' + p.also.standing + ')' + (p.also.sheet ? ', which the sheet prints as: ' + p.also.sheet : ', which the sheet does not print') : '') + (S.sheetDiffers(p) ? '\nthey differ: sheet.note says how, and a trap may' : '\nthey agree'));
  const rec = p.producerId ? W.find((x) => x.id === p.producerId) : null;
  say('The library\'s record of the house (WINE_PRODUCERS)', rec || 'none: the house is not in the library, so every fact needs its two sources or one primary');
  const cu = p.cuveeId ? W.find((x) => x.id === p.cuveeId) : null;
  if (cu) say('The library\'s own record of the cuvée (' + p.cuveeId + ')', cu);
  const fl = p.pick && flag && Array.isArray(flag.records) ? flag.records.find((r) => r && r.key === p.pick) : null;
  say('The published record in Producers and flagships (codex58, key ' + (p.pick || 'none') + ')', fl ? { say: fl.say, place: fl.place, founded: fl.founded, wine: fl.wine, table: fl.table, story: fl.story, others: fl.others, traps: fl.traps, sources: fl.sources, report: fl.report, checked: fl.checked } : 'none: the house has no record there');
  const line = region && Array.isArray(region.producers) ? region.producers.filter((x) => x && ((p.producerId && x.id === p.producerId) || core(x.name) === core(p.house))) : [];
  say('The Champagne region record\'s producers line (.scripts/regions/fragments)', line.length ? line : 'none: the region record does not list this house');
  /* the house's bottles: the producer is the house, or the cuvée's own name where the list files it under that (Dom
     Pérignon, Rare Champagne), or the wine's name holds the cuvée's words (two words or more, so Rare alone is not read
     into another wine). The second cuvée's name is not searched: Grande Cuvée is Krug's on any list. */
  const houses = [core(p.house)].concat(cu ? [core(cu.p)] : [], S.words(p.cuvee) > 1 ? [core(p.cuvee)] : []);
  const ours = wines.filter((w) => {
    const c = core(w.producer); const n = ' ' + core(w.name) + ' ';
    return houses.some((x) => x && (c === x || c.indexOf(x + ' ') === 0 || x.indexOf(c + ' ') === 0)) || (S.words(p.cuvee) > 1 && n.indexOf(' ' + core(p.cuvee) + ' ') >= 0);
  });
  say('On Brennan\'s list (the house pack' + (pf ? '' : ': not found, set OOT_HOUSE_PACK') + ')', ours.length ? ours.map((w) => ({ id: w.id, producer: w.producer, name: w.name, region: w.region, vintage: w.vintage, grapes: w.grapes })) : 'none');
}

if (S.CHUNKS.indexOf(arg) >= 0) { S.roster(plan).filter((p) => p.chunk === arg).forEach(showHouse); process.exit(0); }
const pick = S.pickOf(plan, arg);
if (pick) { showHouse(pick); process.exit(0); }
console.error('show: ' + JSON.stringify(arg) + ' is no house key or chunk of plan.json (' + S.roster(plan).map((p) => p.key).join(', ') + ')');
process.exit(1);
