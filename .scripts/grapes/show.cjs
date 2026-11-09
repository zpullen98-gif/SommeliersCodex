#!/usr/bin/env node
/* show: what the Codex already holds on a grape, printed for the author before a word is written (BRIEF.md, "Read
   first"). It reads the data files as they are and writes nothing.

     node .scripts/grapes/show.cjs <slug>          the roster row, then every record the Codex holds
     node .scripts/grapes/show.cjs --regions       every region slug and country key a target may name

   Printed: the roster row (plan.json); the profile (GRAPES or GRAPES_PLUS in js/reference.js and
   js/data-grapes-plus.js); the tasting dials (TASTE, js/data-tasting.js, with world); the Régionale row
   (INTRO_GRAPES, js/data-intro.js); the Court's respelling and what the grid reads (GRID_SAY and GRID_READS,
   js/data-grid.js); the regions that name the grape or one of its aliases (REGIONS.join.grapes, js/data-regions.js:
   these are the targets a new grape should carry); and the rows of the service reference that name it
   (js/data-service-ref.js). Never contradict a reviewed fact: where you believe one is wrong, keep your entry right
   and say so in the fragment's report. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const S = require(path.join(__dirname, 'schema.cjs'));

function load(files) {
  const ctx = { window: {}, document: {}, navigator: {}, console: { log() { }, warn() { }, error() { } } };
  ctx.self = ctx; vm.createContext(ctx);
  files.forEach((f) => {
    const p = path.join(S.JS_DIR, f);
    if (!fs.existsSync(p)) return;
    try { vm.runInContext(fs.readFileSync(p, 'utf8') + '\n;this.__x = { GRAPES: typeof GRAPES !== "undefined" ? GRAPES : null, GRAPES_PLUS: typeof GRAPES_PLUS !== "undefined" ? GRAPES_PLUS : null, TASTE: typeof TASTE !== "undefined" ? TASTE : null, INTRO_GRAPES: typeof INTRO_GRAPES !== "undefined" ? INTRO_GRAPES : null, GRID_READS: typeof GRID_READS !== "undefined" ? GRID_READS : null, GRID_SAY: typeof GRID_SAY !== "undefined" ? GRID_SAY : null, REGIONS: typeof REGIONS !== "undefined" ? REGIONS : null, SERVICE_REF: typeof SERVICE_REF !== "undefined" ? SERVICE_REF : null };', ctx, { filename: f }); }
    catch (e) { console.log('(could not read js/' + f + ': ' + e.message + ')'); }
  });
  return ctx.__x || {};
}
function say(label, v) { console.log('\n## ' + label); console.log(typeof v === 'string' ? v : JSON.stringify(v, null, 1)); }

const arg = process.argv[2];
if (!arg || arg === '--help' || arg === '-h') { console.log('usage: node .scripts/grapes/show.cjs <slug> | --regions'); process.exit(arg ? 0 : 2); }
const D = load(['reference.js', 'data-grapes-plus.js', 'data-tasting.js', 'data-intro.js', 'data-grid.js', 'data-regions.js', 'data-service-ref.js']);
if (arg === '--regions') {
  const R = D.REGIONS || { regions: [], countries: {} };
  console.log('regions: ' + R.regions.map((r) => r.slug).join(', '));
  console.log('countries: ' + Object.keys(R.countries).join(', '));
  process.exit(0);
}
const plan = S.loadPlan();
const row = S.rowOf(plan, arg);
if (!row) { console.error('show: ' + JSON.stringify(arg) + ' is no slug of the roster (plan.json)'); process.exit(1); }
const names = S.terms(row).map(S.fold);
const named = (s) => { const f = ' ' + S.fold(s) + ' '; return names.some((n) => f.indexOf(' ' + n + ' ') >= 0); };
const whole = (s) => { const parts = S.nameParts(s).map(S.fold); return names.indexOf(S.fold(String(s).replace(/\([^)]*\)/g, ' '))) >= 0 || parts.some((p) => names.indexOf(p) >= 0); };

say('The roster row', row);
const prof = [].concat(D.GRAPES || [], D.GRAPES_PLUS || []).filter((g) => g && whole(g.g));
say('The profile (GRAPES, GRAPES_PLUS)' + (prof.length ? '' : ': none, so the table writes one (profile)'), prof.length ? prof : '');
say('The tasting dials (TASTE)', (D.TASTE || []).filter((t) => t && whole(t.g)));
say('The Régionale row (INTRO_GRAPES)', (D.INTRO_GRAPES || []).filter((g) => g && whole(g.n)));
const gs = D.GRID_SAY && D.GRID_SAY[row.slug];
say('The Court\'s respelling (GRID_SAY)', gs || 'none: write say yourself');
const reads = D.GRID_READS && D.GRID_READS[row.slug];
say('What the grid reads (GRID_READS)', reads ? reads.reads.map((r) => ({ region: r.region, country: r.country, climate: r.climate, fruit: r.fruit, nonFruit: r.nonFruit, structure: r.structure, sell: r.sell, why: r.why })) : 'none');
const jg = (D.REGIONS && D.REGIONS.join && D.REGIONS.join.grapes) || {};
const targets = []; const by = {};
Object.keys(jg).forEach((n) => { if (whole(n)) { by[n] = jg[n]; [].concat(jg[n]).forEach((t) => { if (targets.indexOf(t) < 0) targets.push(t); }); } });
say('The regions that name it (REGIONS.join.grapes): a new grape\'s targets', { byName: by, targets });
const rows = [];
((D.SERVICE_REF || {}).tables || []).forEach((t) => (t.rows || []).forEach((r) => { if (Array.isArray(r) && r.some((c) => typeof c === 'string' && named(c))) rows.push({ table: t.key, row: r }); }));
say('The service reference rows that name it (SERVICE_REF)', rows.length ? rows : 'none by name: use the row for its style (BRIEF.md, Service)');
