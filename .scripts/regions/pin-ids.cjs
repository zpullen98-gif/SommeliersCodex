#!/usr/bin/env node
/* pin-ids: writes into every fragment question the id the build gives it today, so a stem a writer
   rewords keeps its id and the progress filed under it (22 October 2026, the deeper atlas edition).

   Usage: node .scripts/regions/pin-ids.cjs [--check] [--fragments <dir>] [jsDir]

   A question with no id gets mintId(owner, stem), the owner being the article's slug, the country's
   key or, for a technique of techniques.<n>.json, 'technique:' + its slug (22 October 2026, the atlas
   in depth), exactly as build-regions.cjs mints it; an id already present is left alone. Every id written
   must already be in the shipped index js/data-regions.js, so nothing is pinned that the app has not
   filed progress under. A fragment is rewritten when it gains an id, as JSON with a one space indent
   and a final newline, the layout most fragments already had; the build reads parsed JSON, so the
   layout never reaches the app.
   --check writes nothing and exits 1 while an id is unpinned. Afterwards
   `node .scripts/regions/build-regions.cjs --check` must still pass, byte for byte. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const B = require(path.join(__dirname, 'build-regions.cjs'));

const args = process.argv.slice(2);
if (args.indexOf('--help') >= 0 || args.indexOf('-h') >= 0) {
  console.log('usage: node .scripts/regions/pin-ids.cjs [--check] [--fragments <dir>] [jsDir]');
  process.exit(0);
}
const check = args.indexOf('--check') >= 0;
const fi = args.indexOf('--fragments');
const dir = fi >= 0 ? args[fi + 1] : path.join(__dirname, 'fragments');
const rest = args.filter((a, i) => a.charAt(0) !== '-' && (fi < 0 || i !== fi + 1));
const jsDir = rest[0] || path.join(__dirname, '..', '..', 'js');

const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(jsDir, 'data-regions.js'), 'utf8') + '\nthis.REGIONS = REGIONS;', ctx);
const shipped = new Set();
(ctx.REGIONS.regions || []).forEach((r) => (r.questions || []).forEach((q) => shipped.add(q.id)));
Object.keys(ctx.REGIONS.countries || {}).forEach((k) => (ctx.REGIONS.countries[k].questions || []).forEach((q) => shipped.add(q.id)));
(ctx.REGIONS.techniques || []).forEach((t) => (t.questions || []).forEach((q) => shipped.add(q.id)));

const problems = [];
let pinned = 0, already = 0, files = 0;
fs.readdirSync(dir).filter((f) => /\.json$/.test(f)).sort().forEach((f) => {
  const file = path.join(dir, f);
  const raw = fs.readFileSync(file, 'utf8');
  const frag = JSON.parse(raw);
  const owners = [];
  (frag.regions || []).forEach((r) => owners.push([r.slug, r]));
  if (frag.country) owners.push([frag.country.key, frag.country]);
  (frag.countries || []).forEach((c) => owners.push([c.key, c]));
  (frag.techniques || []).forEach((t) => owners.push([B.techniqueOwner(t.slug), t]));
  let gained = 0;
  owners.forEach(([owner, rec]) => (rec.questions || []).forEach((q, i) => {
    if (q.id !== undefined) { already++; return; }
    const id = B.mintId(owner, q.q);
    if (!shipped.has(id)) { problems.push(f + ': ' + owner + '.questions[' + i + '] would pin ' + id + ', which the shipped index does not carry'); return; }
    if (!check) q.id = id;
    gained++;
  }));
  if (gained) {
    files++;
    pinned += gained;
    if (!check) fs.writeFileSync(file, JSON.stringify(frag, null, 1) + '\n');
  }
});
if (problems.length) {
  problems.forEach((p) => console.log('pin-ids: ' + p));
  console.log('pin-ids: ' + problems.length + ' problem(s)' + (check ? '' : ', the files above were left as they were'));
  process.exit(1);
}
if (check) {
  console.log('pin-ids --check: ' + pinned + ' question(s) in ' + files + ' fragment(s) unpinned, ' + already + ' pinned');
  process.exit(pinned ? 1 : 0);
}
console.log('pin-ids: pinned ' + pinned + ' id(s) in ' + files + ' fragment(s); ' + already + ' were pinned already');
