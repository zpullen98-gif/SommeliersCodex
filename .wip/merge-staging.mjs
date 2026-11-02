#!/usr/bin/env node
/* merge-staging.mjs: fold the staged sale chunks into tools/house/brennans/overrides.json, once.
   Reads tools/house/brennans/_staging/<name>.overrides.json ({ entries: [...] }) for each name given, in
   order, and appends every entry to overrides.json's entries. Refuses: a chunk file missing or not
   parsing; an entry without target, field and op; the same target and field in two chunks; and any write
   whose re-serialisation of overrides.json before the merge is not byte identical to the file on disk
   (so nothing but the merge changes). Dry by default (prints the counts by field); --apply writes.
   Usage: node merge-staging.mjs [--apply] [--wt /home/user/worldtable] sale-1 sale-2 ... */
import fs from 'node:fs';
import path from 'node:path';
const argv = process.argv.slice(2);
const APPLY = argv.includes('--apply');
const wtAt = argv.indexOf('--wt');
const WT = wtAt >= 0 ? argv[wtAt + 1] : '/home/user/worldtable';
const names = argv.filter((a, i) => a !== '--apply' && a !== '--wt' && (wtAt < 0 || i !== wtAt + 1));
const DIR = path.join(WT, 'tools/house/brennans');
const OVR = path.join(DIR, 'overrides.json');
const fail = (m) => { console.error('merge-staging: ' + m); process.exit(1); };
if (!names.length) fail('name at least one chunk');
const text = fs.readFileSync(OVR, 'utf8');
let indent = null;
for (const ind of ['  ', '\t', '    ']) if (JSON.stringify(JSON.parse(text), null, ind) + '\n' === text) { indent = ind; break; }
if (indent === null) fail(`${OVR}: re-serialising it is not byte identical with any indent, so a merge would change more than the merge`);
const base = JSON.parse(text);
if (!Array.isArray(base.entries)) fail(`${OVR}: no entries array`);
const seen = new Map();
const add = [];
const byField = {};
for (const n of names) {
  const f = path.join(DIR, '_staging', n + '.overrides.json');
  if (!fs.existsSync(f)) fail(`${f}: missing`);
  let j; try { j = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { fail(`${f}: ${e.message}`); }
  const es = Array.isArray(j) ? j : j.entries;
  if (!Array.isArray(es)) fail(`${f}: no entries array`);
  for (const e of es) {
    if (!e || !e.target || !e.field || !e.op) fail(`${f}: an entry lacks target, field or op: ${JSON.stringify(e).slice(0, 160)}`);
    const k = e.target + '\u0000' + e.field;
    if (seen.has(k) && seen.get(k) !== n) fail(`${e.target} ${e.field} is staged in both ${seen.get(k)} and ${n}`);
    seen.set(k, n);
    byField[e.field] = (byField[e.field] || 0) + 1;
    add.push(e);
  }
}
const sales = new Set(add.filter((e) => e.field === 'lines.sale').map((e) => e.target));
console.log(`merge-staging: ${names.length} chunk(s), ${add.length} entries ${JSON.stringify(byField)}, ${sales.size} distinct wines with a sale; overrides.json ${base.entries.length} entries before, ${base.entries.length + add.length} after`);
if (!APPLY) { console.log('merge-staging: dry run, nothing written (add --apply)'); process.exit(0); }
base.entries.push(...add);
fs.writeFileSync(OVR, JSON.stringify(base, null, indent) + '\n');
console.log(`merge-staging: wrote ${OVR}`);
