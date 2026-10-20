/* Exercise the final script chain through real controls, in an isolated browser.
   CODEX_URL can point at the source preview or the published wing. */
const assert = require('node:assert/strict');
const {chromium} = require(process.argv[2] || 'C:/Users/zpull/WorldTable/node_modules/playwright');
const base = (process.env.CODEX_URL || 'http://127.0.0.1:8791/codex/').replace(/\/?$/, '/');
let passed = 0;
function check(label, ok) { assert.ok(ok, label); passed++; console.log('ok ' + label); }
(async () => {
  const browser = await chromium.launch({headless:true});
  const context = await browser.newContext({serviceWorkers:'block',viewport:{width:390,height:844}});
  const page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    async function open(hash) {
      await page.goto(base + '?nosw&review=learning' + hash);
      await page.waitForFunction(() => typeof V42_PATHS !== 'undefined' && V32.booted && v32HasHouse());
    }
    await open('#/');
    const saved = await page.evaluate(() => localStorage.getItem('codexStats'));
    check('Home has a clearly named starting point and all four levels', await page.locator('#v42-home-title').count() === 1 && await page.locator('button.level').count() === 4);
    await page.getByRole('button',{name:'Today’s study',exact:true}).click();
    check('Today is one click from Home', await page.evaluate(() => S.view === 'level'));
    await page.getByRole('button',{name:'Choose a learning path',exact:true}).click();
    check('Today opens six learning paths', await page.locator('.v42-path').count() === 6);
    check('Navigation never fabricates study marks', await page.evaluate(() => localStorage.getItem('codexStats')) === saved);
    const paths = await page.evaluate(() => V42_PATHS.map(path => ({id:path.id,steps:path.steps.map(step => step.slice(0,3))})));
    for (const path of paths) {
      for (let i=0;i<path.steps.length;i++) {
        await open('#/v/learning');
        const before = await page.evaluate(() => localStorage.getItem('codexStats'));
        await page.locator('#v42-path-' + path.id).locator('..').locator('ol button').nth(i).click();
        const state = await page.evaluate(() => ({view:S.view, lesson:S._v37lesson, text:document.querySelector('#view').innerText}));
        check(path.id + ' step ' + (i+1) + ' opens its study destination', state.view !== 'learning' && state.view !== 'home' && state.text.length > 50);
        if (path.steps[i][0] === 'culinary') check('exact lesson ' + path.steps[i][1], state.lesson === path.steps[i][1]);
        check('opening ' + path.steps[i][2] + ' leaves grades unchanged', await page.evaluate(() => localStorage.getItem('codexStats')) === before);
        await page.goBack();
        await page.waitForFunction(() => S.view === 'learning');
        check(path.id + ' step ' + (i+1) + ' returns to the guide', await page.locator('.v42-path').count() === 6);
      }
    }
    await open('#/practise');
    await page.getByLabel('Find a deck or activity',{exact:true}).fill('Champagne');
    check('practice filter narrows activities', await page.locator('.v25rows>li:visible').count() > 0 && await page.locator('.v25rows>li:visible').count() < 10);
    await page.locator('.v25rows>li:visible [data-deck]').first().click();
    await page.goBack();
    await page.waitForFunction(() => S.view === 'flashcards');
    check('Back retains practice filter', await page.getByLabel('Find a deck or activity',{exact:true}).inputValue() === 'Champagne');
    await page.getByLabel('Find a deck or activity',{exact:true}).fill('quick quiz');
    check('quick quiz remains findable without a false empty result', await page.locator('.v41-quick').isVisible() && !(await page.locator('#v42-practice-count').textContent()).startsWith('No matching'));
    await page.getByLabel('Find a deck or activity',{exact:true}).fill('zzzz-unfindable');
    check('empty practice search gives a recovery action', (await page.locator('#v42-practice-count').textContent()).startsWith('No matching') && await page.getByRole('button',{name:'Clear search',exact:true}).isVisible());
    await page.getByRole('button',{name:'Clear search',exact:true}).click();
    check('Clear restores all activities and input focus', await page.locator('.v25rows>li:visible').count() > 50 && await page.getByLabel('Find a deck or activity',{exact:true}).evaluate(el => el === document.activeElement));
    const options = await page.locator('#v42-practice-jump option').evaluateAll(options => options.map(option => option.value).filter(Boolean));
    await page.getByLabel('Jump to a collection').selectOption(options.at(-1));
    check('collection jump focuses its heading', await page.evaluate(id => document.activeElement.id === id, options.at(-1)));
    await open('#/more');
    await page.getByRole('button',{name:/The Learning Compass Six short paths/}).click();
    check('guide remains discoverable under More', await page.locator('.v42-guide').count() === 1);
    const missing = await browser.newContext({serviceWorkers:'block',viewport:{width:390,height:844}});
    await missing.route('**/shared/packs/**', route => route.fulfill({status:404,body:''}));
    const withoutHouse = await missing.newPage();
    withoutHouse.on('pageerror', error => errors.push(error.message));
    await withoutHouse.goto(base + '?nosw&review=no-house#/v/learning');
    await withoutHouse.waitForFunction(() => typeof V42_PATHS !== 'undefined' && V32.booted);
    check('a first visit without a downloaded house pack remains usable', await withoutHouse.evaluate(() => !v32HasHouse()) && await withoutHouse.locator('.v42-path').count() === 6);
    for (const arg of ['cellar-compass','housesay','houseguest','housepair']) {
      await withoutHouse.evaluate(() => v32Go({view:'learning'},'replace'));
      await withoutHouse.locator('[data-v42-arg="' + arg + '"]').click();
      check('missing house data gives a recovery page for ' + arg, await withoutHouse.evaluate(() => S.view === 'brennans') && await withoutHouse.locator('.v41-brennans').innerText().then(text => text.length > 40));
    }
    await missing.close();
    check('no runtime errors across journeys', errors.length === 0);
    console.log('Learning flow: ' + passed + ' checks passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
