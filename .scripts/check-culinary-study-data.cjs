/* Cross-check the reviewed culinary companion against actual house and course
   records. No browser, user store, network, or scored practice is involved.
   node .scripts/check-culinary-study-data.cjs [Codex root] [house pack path] */
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const packPath = path.resolve(process.argv[3] || path.join(root, '..', 'WorldTable', 'static', 'shared', 'packs', 'brennans-new-orleans.v1.oothouse.json'));
const c = vm.createContext({});
for (const name of ['data-culinary-studies.js', 'data-visual-studies.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, 'js', name), 'utf8'), c, { filename: name });
}
const data = c.CODEX_CULINARY_STUDIES, house = JSON.parse(fs.readFileSync(packPath, 'utf8')).house;
let checks = 0;
function check(name, condition) { assert.ok(condition, name); checks++; }
const words = s => typeof s === 'string' && s.trim().length > 0;
const unique = a => new Set(a).size === a.length;
const lessonIds = data.lessons.map(x => x.id);
const sourceIds = data.sources.map(x => x.id);
const wineIds = new Set(house.wines.map(x => x.id)), dishIds = new Set(house.dishes.map(x => x.id));
const componentIds = new Set(house.components.map(x => x.id));
check('eight coherent lessons retain the five original route identifiers and add three service conversations', lessonIds.join('|') === 'describe|fruit|aromas|sauce|recommend|bottle-check|condition|guest-care');
check('source records have unique IDs and primary-source HTTPS links', unique(sourceIds) && data.sources.every(x => words(x.title) && /^https:\/\/((www\.)?(wsetglobal\.com|brennansneworleans\.com|mastersommeliers\.org|awri\.com\.au|food\.gov\.uk|ttb\.gov)|resources\.escoffier\.edu)\//.test(x.url)));
check('review date and house boundaries are present', /^\d{4}-\d{2}-\d{2}$/.test(data.reviewedOn) && data.boundaries.length >= 3 && data.boundaries.every(words));
for (const lesson of data.lessons) {
  check(lesson.id + ': full reading and recall remain available without artwork', words(lesson.title) && words(lesson.intro) && lesson.body.length > 1 && lesson.body.every(words) && ['question', 'answer', 'practise'].every(k => words(lesson.practice[k])));
  check(lesson.id + ': cited evidence resolves', lesson.sources.length > 0 && unique(lesson.sources) && lesson.sources.every(id => sourceIds.includes(id)));
  check(lesson.id + ': illustration joins are reviewed IDs, never arbitrary image URLs', Array.isArray(lesson.guideIds) && unique(lesson.guideIds) && lesson.guideIds.every(id => /^[a-z0-9-]+$/.test(id)));
}
check('six independent sensory observations include their limits', data.structure.length === 6 && unique(data.structure.map(x => x.id)) && data.structure.every(x => words(x.label) && words(x.observe) && words(x.distinguish)));
check('four distinct dish conversations with no scored winner', data.dishes.length === 4 && unique(data.dishes.map(x => x.id)) && data.dishes.every(x => !('best' in x) && !('score' in x)));
const usedWineIds = new Set();
for (const dish of data.dishes) {
  check(dish.id + ': exact dish IDs exist in the canonical pack', dish.dishIds.length > 0 && unique(dish.dishIds) && dish.dishIds.every(id => dishIds.has(id)));
  check(dish.id + ': readable observations, guest question and scope', words(dish.description) && dish.variables.length > 1 && dish.variables.every(x => words(x.label) && words(x.detail)) && words(dish.guestQuestion) && words(dish.boundary));
  check(dish.id + ': sources resolve', dish.sources.length > 0 && dish.sources.every(id => sourceIds.includes(id)));
  check(dish.id + ': two genuinely explained alternatives with existing wine IDs', dish.options.length === 2 && unique(dish.options.map(x => x.id)) && unique(dish.options.map(x => x.wineId)) && dish.options.every(x => wineIds.has(x.wineId) && words(x.label) && words(x.benefit) && words(x.tradeoff)));
  dish.options.forEach(x => usedWineIds.add(x.wineId));
  check(dish.id + ': optional art only references a reviewed local guide', dish.art === null || (Object.keys(dish.art).join('|') === 'guideId' && /^[a-z0-9-]+$/.test(dish.art.guideId)));
}
for (const name of ['wineLessons', 'componentLessons', 'grapeLessons', 'primerLessons']) {
  check(name + ': every join reaches a real lesson exactly once', Object.keys(data[name]).length > 0 && Object.values(data[name]).every(ids => ids.length > 0 && unique(ids) && ids.every(id => lessonIds.includes(id))));
}
check('wine lesson joins use actual house IDs', Object.keys(data.wineLessons).every(id => wineIds.has(id)));
check('component lesson joins use actual house IDs', Object.keys(data.componentLessons).every(id => componentIds.has(id)));
check('every proposed wine has a two-way sauce/recommend connection', [...usedWineIds].every(id => data.wineLessons[id]?.includes('sauce') && data.wineLessons[id]?.includes('recommend')));
const existingGrapes = new Set(Object.keys(c.CODEX_VISUAL_STUDIES.grapeGuides));
check('grape additions are deliberate named records, without substring rules', Object.keys(data.grapeLessons).every(name => existingGrapes.has(name) || ['Albariño', 'Sauvignon Blanc'].includes(name)));
const primers = new Set();
for (const [file, name] of [['data-primers-intro.js', 'INTRO_PRIMERS'], ['data-primers.js', 'PRIMERS'], ['data-primers-advanced.js', 'ADV_PRIMERS'], ['data-primers-master.js', 'MASTER_PRIMERS']]) {
  const ctx = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(root, 'js', file), 'utf8'), ctx, { filename: file });
  ctx[name].forEach(x => primers.add(x.id || x.cat));
}
check('primer doors target actual chapters across the four levels', Object.keys(data.primerLessons).every(id => primers.has(id)));
const raw = data.dishes.find(x => x.id === 'raw-oysters'), bbq = data.dishes.find(x => x.id === 'bbq-oysters');
check('the printed tasting wine is distinguished from an a la carte promise', raw.options.some(x => x.wineId === 'w-3yaps1gt' && /tasting menu/i.test(x.benefit) && /confirm/i.test(x.tradeoff) && /la carte/i.test(x.tradeoff)));
check('oyster method uncertainty remains visible beside the exercise', /confirm/i.test(bbq.variables.map(x => x.detail).join(' ')) && /cooking and plating/i.test(bbq.boundary));
const content = JSON.stringify(data);
check('no unsupported Berres numeric sugar or alcohol figures added', !/11\.5|twenty grams|20\s*g\s*\/\s*l/i.test(content));
check('fresh fruit and aroma plates distinguish perception from identity', /not ingredients/i.test(content) && /does not alone prove/i.test(content) && /separate choices/i.test(content));
const condition = data.lessons.find(x => x.id === 'condition'), care = data.lessons.find(x => x.id === 'guest-care'), bottle = data.lessons.find(x => x.id === 'bottle-check');
check('condition lesson does not guarantee recovery through air or unfiltered status', /never promise/i.test(condition.body.join(' ')) && /not a guarantee/i.test(condition.practice.answer));
check('dietary lesson separates vegan status, allergy and naturally occurring sulphites', /separate/i.test(care.practice.answer) && /occur naturally/i.test(care.body.join(' ')) && /check, not that it is safe/i.test(care.practice.answer));
check('bottle lesson requires approval for a vintage change', /approval before opening/i.test(bottle.practice.answer));
console.log('Culinary study data: ' + checks + ' checks passed; eight lessons, four dish conversations, eight alternatives and exact house joins.');
