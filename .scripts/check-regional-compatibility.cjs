#!/usr/bin/env node
/* Regression checks for the future atlas roster against both regional resolvers.
   Reads the shipped data and adds proposed names in memory only. No authored
   content, generated files, study progress or browser storage is changed. */
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const JOIN = require('./regions/regions-join.cjs');
const ROSTER = require('./regions/roster.cjs');
const ROOT = path.resolve(__dirname, '..');
const context = {
  console: { log() {}, warn() {}, error() {} },
  S: {}, window: {}, render() {}, setTimeout, clearTimeout
};
context.self = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/data-regions.js'), 'utf8'), context);
const data = context.REGIONS;

for (const item of ROSTER.MORE_LIST) {
  if (!data.regions.some((region) => region.slug === item.slug)) {
    data.regions.push({ slug: item.slug, name: item.name, sheet: item.sheet, mapless: 1 });
  }
}
for (const country of ROSTER.NEW_MAPLESS) {
  if (!data.countries[country.key]) {
    data.countries[country.key] = { key: country.key, name: country.name, mapless: 1 };
  }
}
context.v25MapSheets = () => Object.keys(data.countries).filter((key) => data.countries[key].sheet).map((id) => ({ id }));
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/codex39.js'), 'utf8'), context);
const index = JOIN.joinIndex(data);
const target = (value) => {
  const result = JOIN.slugFor(value, index);
  return result ? result.slug || result.key : '';
};
let checks = 0;
function resolves(value, expected) {
  assert.equal(target(value), expected, 'build resolver: ' + value);
  assert.equal(context.v39SlugFor(value), expected, 'browser resolver: ' + value);
  checks += 2;
}

for (const [key, country] of Object.entries(data.countries)) {
  resolves(key.replace(/-/g, ' '), key);
  resolves(country.name, key);
}
for (const [query, expected] of [
  [' France , ', 'france'],
  ['Oregon, USA', 'oregon'],
  ['South West France', 'south-west-france'],
  ['South West France, France', 'south-west-france'],
  ['Southern Oregon, Oregon, USA', 'southern-oregon'],
  ['Bordeaux vineyards, France', 'bordeaux'],
  ['France, Bordeaux vineyards', 'bordeaux'],
  ['France, South West France vineyards', 'south-west-france'],
  ['Oregon, Southern Oregon vineyards, USA', 'southern-oregon'],
  ['Fleurie, Beaujolais, Burgundy, France', 'beaujolais'],
  ['Rioja Alta, La Rioja, Spain', 'rioja'],
  ['Bordeaux, Italy', 'italy'],
  ['', ''],
  ['No such wine place', '']
]) resolves(query, expected);

const strings = new Set();
for (const region of data.regions) {
  strings.add(region.name);
  strings.add(region.name + ', ' + data.countries[region.sheet].name);
}
for (const alias of Object.keys(data.join.aliases)) {
  strings.add(alias);
  strings.add(alias + ', Spain');
  strings.add(alias + ', USA');
}
for (const query of strings) {
  assert.equal(context.v39SlugFor(query), target(query), 'resolver parity: ' + query);
  checks++;
}

const beforeRendering = JSON.stringify(data);
const base = data.regions.find((region) => region.slug === 'champagne');
assert.ok(base, 'Champagne is present for the map-action regression');
function hasMapAction(changes) {
  const record = Object.assign({}, base, changes);
  const html = context.v39ArticleHtml(record, '<p>Opening the reading</p>');
  return /id="v39-act-map"/.test(html);
}
assert.equal(hasMapAction({ index: 0 }), true, 'zero is a valid map index');
assert.equal(hasMapAction({ index: 1 }), true, 'a mapped article retains its map door');
assert.equal(hasMapAction({ mapless: 1, index: 0 }), false, 'mapless always suppresses the numbered-map door');
for (const invalid of [undefined, null, NaN, Infinity, -1, 0.5, '0']) {
  assert.equal(hasMapAction({ index: invalid }), false, 'no numbered-map door for index ' + String(invalid));
  checks++;
}
for (const item of ROSTER.MORE_LIST) {
  const records = data.regions.filter((region) => region.slug === item.slug);
  assert.equal(records.length, 1, item.name + ' has exactly one roster article');
  const record = records[0];
  assert.deepEqual({ name: record.name, sheet: record.sheet, mapless: record.mapless },
    { name: item.name, sheet: item.sheet, mapless: 1 }, item.name + ' retains its expected reading-only identity');
  const html = context.v39ArticleHtml(record, '<p>Opening the reading</p>');
  assert.equal(/id="v39-act-map"/.test(html), false, item.name + ' has no numbered-map door');
  assert.ok(!/data-index="NaN"/.test(html), item.name + ' never emits a NaN map target');
  checks += 4;
}
for (const country of ROSTER.NEW_MAPLESS) {
  const record = data.countries[country.key];
  assert.ok(record, country.name + ' has a roster country record');
  assert.deepEqual({ key: record.key, name: record.name, mapless: record.mapless },
    { key: country.key, name: country.name, mapless: 1 }, country.name + ' retains its expected reading-only identity');
  checks += 2;
}
assert.equal(JSON.stringify(data), beforeRendering, 'rendering and resolving leave all records and IDs unchanged');
checks += 5;
console.log('Regional compatibility: ' + checks + ' assertions passed; country precedence, specific regions, resolver parity and mapless doors.');
