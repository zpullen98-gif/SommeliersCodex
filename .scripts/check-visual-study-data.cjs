/* Actual manifest + study joins + current canonical Brennan pack.
   node .scripts/check-visual-study-data.cjs [Codex root] [house pack path]
   Complements image-byte validation and the browser interaction gate. */
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const packPath = path.resolve(process.argv[3] || path.join(root, '..', 'WorldTable', 'static', 'shared', 'packs', 'brennans-new-orleans.v1.oothouse.json'));
let checks = 0;
function check(name, value) { assert.ok(value, name); checks++; }
const c = vm.createContext({ URL });
for (const file of ['data-teaching-images.js', 'teaching-cache.js', 'data-visual-studies.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, 'js', file), 'utf8'), c, { filename: file });
}
const data = c.CODEX_VISUAL_STUDIES, entries = c.CodexTeachingCache.entries();
const house = JSON.parse(fs.readFileSync(packPath, 'utf8')).house;
const ids = entries.map(e => e.id), grouped = data.groups.flatMap(g => g.ids);
const equalSet = (a, b) => a.length === b.length && new Set(a).size === a.length && [...a].sort().join('|') === [...b].sort().join('|');
check('fourteen registered teaching entries, each with a unique ID', ids.length === 14 && new Set(ids).size === 14 && ids.every(id => c.CodexTeachingCache.entry(id)));
check('four uniquely named collections', data.groups.length === 4 && new Set(data.groups.map(g => g.id)).size === 4 && data.groups.every(g => g.id && g.title && g.ids.length));
check('collections cover each manifest entry exactly once', equalSet(grouped, ids));
check('every guide has exactly one purpose', equalSet(Object.keys(data.purposes), ids) && ids.every(id => typeof data.purposes[id] === 'string' && data.purposes[id].trim()));
check('every guide has question, answer and practice', equalSet(Object.keys(data.recall), ids) && ids.every(id => ['question', 'answer', 'practise'].every(k => typeof data.recall[id][k] === 'string' && data.recall[id][k].trim())));
for (const name of ['wineGuides', 'componentGuides', 'grapeGuides', 'primerGuides']) {
  check(name + ': every join is nonempty, unique and registered', Object.values(data[name]).every(list => Array.isArray(list) && list.length && new Set(list).size === list.length && list.every(id => ids.includes(id))));
}
const wines = house.wines, wineIds = wines.map(w => w.id), components = new Set(house.components.map(x => x.id));
check('all 271 current house wines are joined by their exact IDs', wineIds.length === 271 && equalSet(Object.keys(data.wineGuides), wineIds));
check('every mapped component exists in the current pack', Object.keys(data.componentGuides).length > 0 && Object.keys(data.componentGuides).every(id => components.has(id)));
check('every house wine gets the bottle verification guide', wineIds.every(id => data.wineGuides[id].includes('service-bottle-check')));

// Independently read the pack's menu classifications, not the implementation's
// generator or name-matching rules. Unknown sections require editorial review.
const sparklingSections = new Set(['Champagne & sparkling', 'Birthday Bubbles: Champagne half bottles', 'Birthday Bubbles: Champagne large formats', "Bubbles at Brennan's: rosé bottles"]);
const stillSections = new Set(['Riesling & aromatic whites', 'Dry & crisp whites', 'Chardonnay & fuller whites', 'Dry rosé', 'Light reds, Pinot Noir', 'Medium-bodied reds', 'Full-bodied reds', 'Dessert wines']);
const menu = wines.filter(w => w.list !== 'bottle');
check('the focused menu and featured selection contains 34 wines', menu.length === 34);
check('all menu sections have a reviewed still or sparkling classification', menu.every(w => sparklingSections.has(w.section) || stillSections.has(w.section)));
for (const wine of menu) {
  const sparkling = sparklingSections.has(wine.section), expected = sparkling ? 'service-sparkling-control' : 'service-still-opening';
  const opposite = sparkling ? 'service-still-opening' : 'service-sparkling-control';
  check(wine.name + ': correct service guide without the opposite opening method', data.wineGuides[wine.id].includes(expected) && !data.wineGuides[wine.id].includes(opposite));
}

// Exercise the real runtime mapping helpers, stopping before UI registration.
const layer = fs.readFileSync(path.join(root, 'js', 'codex36.js'), 'utf8');
const boundary = layer.indexOf('function v36Go(');
check('runtime mapping helpers are independently loadable', boundary > 0);
vm.runInContext(layer.slice(0, boundary), c, { filename: 'codex36-mapping-helpers' });
const known = wineIds[0], expected = JSON.stringify(data.wineGuides[known]);
const identityOnly = { id: known };
for (const field of ['name', 'section', 'region', 'grape', 'grapes', 'style']) Object.defineProperty(identityOnly, field, { get() { throw new Error('Mapping read descriptive field: ' + field); } });
check('runtime wine joins read identity, not descriptive fields', JSON.stringify(c.v36WineGuides(identityOnly)) === expected);
check('runtime cannot infer joins from a plausible wine name', c.v36WineGuides({ id: 'w-not-reviewed', name: '1946 Rubicon Chardonnay Champagne Pinot Noir', region: 'Burgundy', section: 'Champagne & sparkling' }).length === 0);
check('inherited property names cannot create a mapping', c.v36WineGuides({ id: 'toString' }).length === 0 && c.v36WineGuides({ id: '__proto__' }).length === 0);
check('all current wine joins round-trip through the runtime helper', wines.every(w => JSON.stringify(c.v36WineGuides(w)) === JSON.stringify(data.wineGuides[w.id])));
check('missing wine or identity draws no door', c.v36WineGuides(null).length === 0 && c.v36WineGuides({ name: wines[0].name }).length === 0);
const oldLayer = fs.readFileSync(path.join(root, 'js', 'codex33.js'), 'utf8');
check('reference wine cards delegate to the exact mapping helper', /v36WineGuides\(item\)/.test(oldLayer) && !/Rubicon\.\*2010|Chardonnay\|Burgundy\|Bourgogne\|Chablis\|Rubicon/.test(oldLayer));
console.log('Visual study data: ' + checks + ' checks passed; 14 guides, 271 wine joins, ' + Object.keys(data.componentGuides).length + ' component joins, 34 menu service routes.');
