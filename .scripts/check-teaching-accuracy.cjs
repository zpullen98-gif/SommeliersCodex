/* Targeted regressions for the October 2026 teaching review.
   node .scripts/check-teaching-accuracy.cjs [Codex root]
   Checks run the real classic-script data and reference renderers. They protect
   recorded case identities and exercise grading while removing false shortcuts.
   Scope: these checks do not certify every question or simulate hands-on service.

   Sources reviewed 2026-10-10:
   CMS general and 2025 Advanced/Master standards (linked in serviceView).
   https://www.wsetglobal.com/knowledge-centre/blog/2023/august/24/common-wine-faults-and-how-to-spot-them
   https://www.awri.com.au/industry_support/winemaking_resources/frequently_asked_questions/copper/
   https://www.sherry.wine/sherry-wine/production/ageing
   https://www.wsetglobal.com/knowledge-centre/blog/2023/july/13/four-rules-to-masterful-food-and-wine-pairing
   https://www.wsetglobal.com/knowledge-centre/blog/2021/september/23/what-determines-the-colour-of-wine
   https://www.wsetglobal.com/media/11766/wset_l3wines_sat_en_may2022_issue2.pdf
   https://arxiv.org/abs/1909.09898
*/
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const assert = require('node:assert/strict'), crypto = require('node:crypto');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
let checks = 0;
function check(name, condition) { assert.ok(condition, name); checks++; }
const nodes = [];
const context = vm.createContext({
  ST: {}, S: {}, document: { addEventListener() {} },
  encyView() {}, dashView() {}, decorateHome() {}, render() {},
  el(html) {
    const controls = {};
    const node = { html, querySelectorAll() { return []; }, querySelector(key) { return controls[key] || (controls[key] = {}); } };
    nodes.push(node); return node;
  }
});
for (const file of ['data-tasting.js', 'data-floor.js', 'data-pairing.js', 'codex6.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, 'js', file), 'utf8'), context, { filename: file });
}
const read = expression => vm.runInContext(expression, context);
const hash = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');

// Frozen IDs, levels, answer slots and profile structure from the reviewed source.
// Text and jamon's corrected priorities may change without renaming past marks.
check('floor IDs, levels and answer slots preserved', hash(read('FLOOR.map(x => [x.id, x.lvl, x.best])')) === '5a97a03eb2d6635b79499e40414769e81e7f40808f604fc341144bede3b89f7a');
check('pairing IDs, levels and answer slots preserved', hash(read('PAIRS.map(x => [x.id, x.lvl, x.best])')) === '38710303e300b4526115769c8aee234bb4bed80c9c43e139315d0551d5a96bc2');
check('all 47 tasting profiles and structure grading values preserved', hash(read('TASTE')) === 'cc5805c934e3377a17beb52715b7de770e0af3ef66828e49f62f0f99a86cd500');
check('service rehearsal positions preserved', JSON.stringify(read('SERVICE.map(x => x.steps.length)')) === '[5,5,7,6,6,6,5]');
for (const isRed of [false, true]) {
  const observations = [0, 1, 2, 3].map(body => context.tasteSight({ body }, isRed));
  check('sight does not disclose the body answer: ' + isRed, new Set(observations).size === 1);
  check('missing observed sight is explained: ' + isRed, /not supplied/i.test(observations[0]));
}
const evidence = read('TASTE_EVIDENCE');
check('four body sensation cues remain distinct', evidence.body.length === 4 && new Set(evidence.body).size === 4);
check('body cues do not use glass tears or legs', !/glass|legs|sheet|crawl/.test(evidence.body.join(' ')));
check('alcohol cue no longer suggests a consumption quantity', !/drink a lot/.test(evidence.alc.join(' ')));

const grid = Object.fromEntries(read('TASTING_GRID').flatMap(section => section[1]));
check('clarity accounts for style before faults', /haze alone does not/i.test(grid['Clarity & brightness']));
check('colour cannot establish grape or age', /cannot prove/.test(grid['Color & hue']));
check('geographic origin is a hypothesis', /hypothesis/.test(grid['Old World or New']));
check('length alone does not establish quality', /balance.*intensity.*complexity/.test(grid['Finish & complexity']));
check('tears are not a dependable measurement', /not a dependable measure/.test(grid['Extract & staining']));
const service = context.SERVICE.map(x => x.steps.map(s => s.join(' ')).join(' ')).join(' ');
check('polishing uses steam and clean linen', /steam and clean linen/i.test(service) && !/breathe, polish/.test(service));
check('service order is gender neutral', /regardless of gender/.test(service) && !/Women first/.test(service));
check('glass fractions and universal five-ounce pours are removed', !/5–6 oz|two-thirds/.test(service));
check('control precedes sparkling cage loosening', /Control the cork before loosening/.test(service));
check('settled side-stored bottles can be handled in a cradle', /side-stored bottle.*lined cradle/.test(service) && !/cannot be decanted clean/.test(service));
check('sediment stopping point is the shoulder', /stop as fine sediment reaches the shoulder/.test(service));
check('age is not an automatic decant decision', /age or appellation alone does not decide/i.test(service));
const rendered = context.serviceView().html;
check('service view distinguishes local practice', /not a Brennan’s procedure/.test(rendered));
check('service source links are visible and safe', /CMS-Hospitality-Service-Standards.pdf/.test(rendered) && /2025-ADV-MS-HS-Standards-and-Guidlines-FINAL.pdf/.test(rendered) && /rel="noopener"/.test(rendered));

const floor = read('FLOOR'), pair = read('PAIRS');
const reduction = floor.find(x => x.id === 'f-reduction-cornas');
check('reduction answer respects guest choice', /offer a replacement/.test(reduction.opts[reduction.best]) && /with his agreement/.test(reduction.opts[reduction.best]));
check('reduction does not guarantee a cure or identical bottle', /not a guaranteed cure/.test(reduction.why) && /Another bottle may differ/.test(reduction.why));
const heat = floor.find(x => x.id === 'f-heat-struck-sancerre');
check('heat case calls for assessment, not visual diagnosis', /assess condition/.test(heat.opts[heat.best]) && /not proof of heat damage/.test(heat.why));
const va = floor.find(x => x.id === 'f-va-over-line');
check('VA correct option and rationale both assess before diagnosis', /assess with the sommelier.*then explain/.test(va.opts[va.best]) && /^Assess before announcing a diagnosis/.test(va.why));
check('VA rationale does not allege a producer deliberately makes faulty wine', !/by design/.test(va.why));
const jamon = pair.find(x => x.id === 'p-jamon-iberico-bellota');
check('jamon priorities agree with rationale', JSON.stringify(jamon.needs) === '["low-tannin","low-oak"]' && /low tannin and restrained oak/.test(jamon.why));
check('flor is taught as biological ageing', /Flor ageing is biological ageing/.test(jamon.why));
const turbot = pair.find(x => x.id === 'p-turbot-beurre-blanc');
check('turbot leaves realistic alternatives open', /Meursault can work very well/.test(turbot.why) && /None must turn metallic or fail/.test(turbot.why));
check('pairing cases use supported grade keys', pair.every(x => x.needs.every(k => ['acid', 'tannin', 'low-tannin', 'sweet', 'body', 'low-alc', 'bubbles', 'oak', 'low-oak'].includes(k))));
check('all case answer slots resolve', floor.every(x => x.opts[x.best]) && pair.every(x => x.wines[x.best]));
console.log('Teaching accuracy: ' + checks + ' checks passed.');
