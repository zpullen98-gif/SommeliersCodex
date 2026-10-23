#!/usr/bin/env node
/* Real-browser checks in an isolated profile. Never reads the owner's answers.
   CODEX_URL may point to the published preview; PLAYWRIGHT_MODULE is optional. */
'use strict';
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/zpull/WorldTable/node_modules/playwright');
const base = (process.env.CODEX_URL || 'http://127.0.0.1:8791/codex/').replace(/\/$/, '') + '/?nosw';
let passed = 0;
function ok(name, value) { assert.ok(value, name); passed++; console.log('PASS ' + name); }
(async () => {
 const browser = await chromium.launch({ headless: true });
 try {
  const ctx = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage(), errors = [];
  page.on('pageerror', e => errors.push(e.message));
  async function open(route) { await page.goto(base + route); await page.waitForFunction(() => typeof V46 !== 'undefined' && V32.booted); }
  async function ready() { await page.waitForFunction(() => S.view === 'technique' && v39RecReady(v46Find(S._v46technique)) && document.querySelector('.v46-steps')); }
  await open('#/v/technique/traditional-method'); await ready();
  ok('cold lesson address and title', await page.evaluate(() => location.hash === '#/v/technique/traditional-method' && document.querySelector('.viewhead h2').textContent === 'Traditional method'));
  ok('complete 43-topic collection and 344 question IDs', await page.evaluate(() => v46List().length === 43 && new Set(v46List().flatMap(t => t.questions.map(q => q.id))).size === 344));
  ok('foundation has six cards and six questions without advanced paragraphs', await page.evaluate(() => v46Cards(v46Find('traditional-method')).length === 6 && v46Questions(['traditional-method']).length === 6 && !document.querySelector('.v46-deeper')));
  const initialIds = await page.evaluate(() => v46Cards(v46Find('traditional-method')).map(c => c.id));
  const course = await page.evaluate(() => activeLevel);
  await page.locator('[data-v46="depth"][data-v46-arg="advanced"]').click();
  ok('Premier Cru adds one card and question, and only advanced paragraphs', await page.evaluate(() => v46Cards(v46Find('traditional-method')).length === 7 && v46Questions(['traditional-method']).length === 7 && [...document.querySelectorAll('.v46-deeper .v46-eyebrow')].every(e => e.textContent.includes('Premier Cru'))));
  await page.locator('[data-v46="depth"][data-v46-arg="master"]').click();
  ok('Grand Cru retains the foundations and adds both deeper levels', await page.evaluate(() => v46Cards(v46Find('traditional-method')).length === 8 && v46Questions(['traditional-method']).length === 8 && document.querySelectorAll('.v46-deeper').length >= 3));
  ok('depth never changes course level or existing card identities', await page.evaluate(({ initialIds, course }) => activeLevel === course && initialIds.every(id => v46Cards(v46Find('traditional-method')).some(c => c.id === id)), { initialIds, course }));
  ok('depth selection keeps keyboard focus', await page.evaluate(() => document.activeElement.getAttribute('data-v46-arg') === 'master'));
  const ids = await page.evaluate(() => v46List().map(t => t.slug));
  for (const id of ids) {
   await page.evaluate(id => v46Go(id), id); await ready();
   const result = await page.evaluate(() => ({ count: document.querySelectorAll('.v46-steps li').length, sources: document.querySelectorAll('[data-v46-section="sources"] .v46-sources a').length, deep: document.querySelectorAll('.v46-deeper').length, overflow: document.documentElement.scrollWidth > innerWidth + 1 }));
   assert.ok(result.count >= 3 && result.sources >= 2 && result.deep >= 3 && !result.overflow, id + ': complete mobile reading');
  }
  ok('all 43 lessons render full steps, deeper explanations and source links on mobile', true);
  await page.evaluate(() => v46Go(''));
  ok('all eight groups show all 43 lessons', await page.locator('.v46-group').count() === 8 && await page.locator('.v46-group li').count() === 43);
  await page.getByLabel('Find a technique', { exact: true }).fill('qvevri');
  ok('search finds both qvevri references and their lesson doors', await page.locator('.v46-group li').count() === 2 && await page.locator('.v46-group [data-v46-arg="amphora-qvevri"]').count() === 1 && await page.locator('.v46-group [data-v46-arg="skin-contact-orange"]').count() === 1);
  await page.getByLabel('Explore a group', { exact: true }).selectOption('sparkling');
  ok('combined filters have an honest empty state', await page.locator('.v46-empty').count() === 1);
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  ok('clear restores every result and search focus', await page.locator('.v46-group li').count() === 43 && await page.evaluate(() => document.activeElement.id === 'v46-find'));
  await page.evaluate(() => v46Go('oak')); await ready();
  await page.locator('[data-v46="deck"]').first().click();
  ok('lesson opens its own deck with depth controls', await page.evaluate(() => S.view === 'deck' && S._v32deck === 'technique:oak') && await page.locator('.v46-depth').count() === 1);
  await page.locator('[data-v46="depth"][data-v46-arg="certified"]').click();
  await page.evaluate(() => v39CardMark('champagne/0', true));
  await page.locator('#v32-start').click();
  const first = await page.evaluate(() => v32RunCard().id);
  ok('cards hide the answer and lesson shortcut until revealed', await page.locator('[data-v46="lesson"]').count() === 0);
  await page.locator('[data-v32="flip"]').last().click();
  ok('revealed card offers its technique reading', await page.locator('[data-v46="lesson"][data-v46-arg="oak"]').count() === 1);
  await page.locator('[data-v32="again"]').click();
  ok('Again records only the exact technique card and preserves a regional mark', await page.evaluate(first => v39CardRec()[first] === 'again' && v39CardRec()['champagne/0'] === 'got', first));
  while (await page.evaluate(() => !!v32RunCard())) {
   await page.locator('[data-v32="flip"]').last().click(); await page.locator('[data-v32="got"]').click();
  }
  await page.locator('[data-v32="runmisses"]').click();
  ok('retry is the exact missed card, not a new sample', await page.evaluate(first => S._v32run.total === 1 && v32RunCard().id === first, first));
  await page.locator('[data-v32="flip"]').last().click(); await page.locator('[data-v32="got"]').click();
  await page.evaluate(() => { V46.depth = 'master'; v46StartDrill('oak'); });
  ok('drill uses all eight authored questions at Grand Cru', await page.evaluate(() => S.view === 'quiz' && S.pool.length === 8 && S.pool.every(q => /^r-/.test(q.id))));
  ok('technique questions are known without becoming scheduled course questions', await page.evaluate(() => {
   const q = S.pool[0], before = JSON.stringify(ST.srs); srsRecord(q, false);
   return !!v39Index().qids[q.id] && !keyOwned(q.id) && before === JSON.stringify(ST.srs);
  }));
  ok('a real wrong answer records one miss without orphaning or scheduling it', await page.evaluate(() => {
   S.idx = S.pool.findIndex(q => Array.isArray(q.opts)); resetQ(); render();
   const q = S.pool[S.idx], key = qKey(q), before = JSON.stringify(ST.srs), old = ST.q[key] && ST.q[key].w || 0;
   pickMC((q.a + 1) % q.opts.length);
   return S.answered && ST.q[key].w === old + 1 && before === JSON.stringify(ST.srs)
    && !Object.values(qidAudit().orphanedKeys || {}).flat().includes(key);
  }));
  await page.evaluate(() => { S.view = 'techniques'; render(); v46StartDrill(''); });
  ok('mixed technique drill is capped at ten unique questions', await page.evaluate(() => S.pool.length === 10 && new Set(S.pool.map(q => q.id)).size === 10));
  await open('#/v/fieldmap/champagne');
  await page.waitForSelector('.v46-links [data-v46-arg="traditional-method"]');
  await page.locator('.v46-links [data-v46-arg="traditional-method"]').click(); await ready();
  ok('map to technique is one working transition', await page.evaluate(() => S._v46technique === 'traditional-method'));
  await page.goBack(); await page.waitForFunction(() => S.view === 'fieldmap');
  ok('browser Back returns to the map', await page.evaluate(() => S._v45map === 'champagne'));
  await open('#/v/region/tuscany');
  ok('regional reading exposes its authored technique links', await page.locator('.v46-links [data-v46-arg="governo"]').count() === 1);
  await open('#/library');
  ok('Library has a workshop entrance and technique search entries', await page.locator('[data-v46="index"]').count() === 1 && await page.evaluate(() => v44Index().learn.filter(e => e.arg === 'technique').length === 43));
  await open('#/level');
  ok('Today leads to the workshop', await page.locator('[data-go="techniques"]').count() === 1);
  await open('#/practise');
  ok('Practise exposes the technique deck', await page.locator('[data-deck="techniques"]').count() === 1);
  const coldPage = await ctx.newPage();
  await coldPage.goto(base + '#/flashcards/technique:oak');
  await coldPage.waitForFunction(() => typeof V46 !== 'undefined' && V32.booted);
  await coldPage.evaluate(() => v32Back());
  ok('cold deck Back climbs to its lesson', await coldPage.evaluate(() => S.view === 'technique' && S._v46technique === 'oak'));
  await coldPage.evaluate(() => v32Back());
  ok('cold lesson Back climbs to the collection', await coldPage.evaluate(() => S.view === 'techniques'));
  await coldPage.close();
  await open('#/v/technique/no-such-technique');
  ok('unknown technique falls back to the collection', await page.evaluate(() => S.view === 'techniques'));
  for (const width of [320, 390, 1360]) {
   await page.setViewportSize({ width, height: 900 });
   for (const service of ['day', 'night']) {
    await page.evaluate(service => { document.documentElement.setAttribute('data-service', service); V46.depth = 'master'; v46Go('extraction'); }, service); await ready();
    ok(service + ' reading fits width ' + width, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
   }
  }
  const failCtx = await browser.newContext({ serviceWorkers: 'block' }), failPage = await failCtx.newPage();
  let fail = true;
  await failPage.route('**/js/regions/techniques.json?*', route => fail ? route.abort() : route.continue());
  await failPage.goto(base + '#/v/technique/traditional-method');
  await failPage.locator('#v39-retry').waitFor();
  ok('unavailable reading shows retry while cards remain usable', await failPage.locator('[data-v46="deck"]').count() > 0);
  fail = false; await failPage.locator('#v39-retry').click();
  await failPage.waitForSelector('.v46-steps');
  ok('retry restores the actual lesson', true);
  await failCtx.close();
  ok('no browser exceptions', errors.length === 0);
  console.log('check-workshop-ui: all ' + passed + ' checks pass');
 } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
