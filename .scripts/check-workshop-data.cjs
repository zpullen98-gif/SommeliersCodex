#!/usr/bin/env node
/* Cross-file coverage and study-identity checks for the complete workshop. */
'use strict';
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const roster = require('./regions/roster.cjs');
const box = {};
vm.runInNewContext(fs.readFileSync(path.join(root, 'js/data-regions.js'), 'utf8'), box);
const data = JSON.parse(JSON.stringify(box.REGIONS));
const part = JSON.parse(fs.readFileSync(path.join(root, 'js/regions/techniques.json'), 'utf8'));
assert.equal(part.part, 'techniques');
assert.deepEqual(data.techniques.map(t => [t.slug, t.name, t.group]), roster.TECHNIQUES);
assert.equal(Object.keys(part.records).length, 43);
const owners = [...data.regions, ...Object.values(data.countries)];
const reading = {};
for (const name of Object.keys(data.parts)) Object.assign(reading, JSON.parse(fs.readFileSync(path.join(root, 'js/regions/' + name + '.json'), 'utf8')).records);
const ids = new Set(), cardIds = new Set();
for (const rec of owners) for (const q of rec.questions || []) { assert.ok(!ids.has(q.id), q.id); ids.add(q.id); }
let cards = 0, questions = 0, deeper = 0;
for (const t of data.techniques) {
 const r = part.records[t.slug];
 assert.ok(r && r.how && r.why && r.steps.length >= 3, t.slug + ': full reading');
 assert.equal(t.cards.length, 8, t.slug + ': eight cards');
 assert.equal(t.questions.length, 8, t.slug + ': eight questions');
 assert.ok(r.sources.length >= 2 && r.sources.every(s => /^https:\/\//.test(s.url || '') && s.asOf === '2026-10-23'), t.slug + ': dated linked sources');
 assert.ok(new Set(r.deeper.map(d => d.sec)).size >= 3, t.slug + ': deeper sections');
 for (const d of r.deeper) assert.ok(d.src.length && d.src.every(i => Number.isInteger(i) && r.sources[i]), t.slug + ': valid references');
 for (const records of [t.cards, t.questions]) {
  assert.equal(records.filter(c => !c.depth).length, 6, t.slug + ': six foundations');
  assert.equal(records.filter(c => c.depth === 'advanced').length, 1, t.slug + ': one advanced');
  assert.equal(records.filter(c => c.depth === 'master').length, 1, t.slug + ': one master');
 }
 for (const q of t.questions) { assert.ok(/^r-[a-z0-9]{8}$/.test(q.id) && !ids.has(q.id), t.slug + ': unique question identity'); ids.add(q.id); }
 t.cards.forEach((c, i) => { const id = 't:' + t.slug + '/' + i; assert.ok(!cardIds.has(id)); cardIds.add(id); });
 const expected = owners.filter(o => (reading[o.slug || o.key].techniques || []).includes(t.slug)).map(o => o.slug || o.key).sort();
 assert.deepEqual(t.usedBy, expected, t.slug + ': exact authored backlinks');
 assert.ok((r.related || []).every(slug => data.techniques.some(other => other.slug === slug) && slug !== t.slug), t.slug + ': real related lessons');
 cards += t.cards.length; questions += t.questions.length; deeper += r.deeper.length;
}
assert.equal(data.regions.length, 115, 'the separate future regional family is not partially released');
assert.equal(Object.keys(data.countries).length, 24, 'the separate future country family is not partially released');
assert.equal(data.regions.flatMap(r => r.questions).length + Object.values(data.countries).flatMap(r => r.questions).length, 1068, 'legacy question count');
assert.equal(data.regions.flatMap(r => r.cards).length + Object.values(data.countries).flatMap(r => r.cards).length, 1169, 'legacy card count');
console.log('check-workshop-data: 43 complete techniques, ' + cards + ' cards, ' + questions + ' unique questions, ' + deeper + ' sourced deeper explanations; 115 regions and 24 countries preserved');
