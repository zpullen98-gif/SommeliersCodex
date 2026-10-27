/* Final-chain Brennan's learning flow, in an isolated browser profile.
   CODEX_URL can target a served source/public edition; otherwise files are
   served by Playwright routes with the canonical shared house pack.
   No owner browser, marks, menu records or localStorage are touched. */
'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const shared = path.resolve(process.env.OOT_SHARED || 'C:/Users/zpull/WorldTable/static/shared');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || process.argv[3] || 'C:/Users/zpull/WorldTable/node_modules/playwright');
const base = (process.env.CODEX_URL || 'http://codex.test/codex/').replace(/\/?$/, '/');
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.webmanifest':'application/manifest+json', '.svg':'image/svg+xml', '.webp':'image/webp', '.png':'image/png', '.woff2':'font/woff2' };
const checks = [], errors = [];
function check(name, pass) { checks.push({ name, pass: !!pass }); assert.ok(pass, name); console.log('PASS ' + name); }
const views = ['brennans', 'housestudies', 'houserehearsal', 'housereference'];
const words = ['Wine list', 'Wine studies', 'Service rehearsal', 'House reference'];

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    async function device() {
      const context = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 }, timezoneId: 'America/New_York' });
      if (!process.env.CODEX_URL) await context.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.origin !== 'http://codex.test') return route.fulfill({ status:404, body:'' });
        const isShared = url.pathname.startsWith('/shared/'), dir = isShared ? shared : root, prefix = isShared ? '/shared/' : '/codex/';
        if (!url.pathname.startsWith(prefix)) return route.fulfill({ status:404, body:'' });
        const relative = decodeURIComponent(url.pathname.slice(prefix.length)) || 'index.html', file = path.resolve(dir, relative);
        if (!file.startsWith(dir + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return route.fulfill({ status:404, body:'' });
        let body = fs.readFileSync(file);
        if (!isShared && relative === 'index.html' && !body.toString().includes('../shared/oot-house.js')) body = Buffer.from(body.toString().replace('<script src="js/data-questions.js', '<script src="../shared/oot-house.js"></script><script src="../shared/oot-house-ui.js"></script>\n<script src="js/data-questions.js'));
        return route.fulfill({ contentType: mime[path.extname(file)] || 'application/octet-stream', body });
      });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      return { context, page };
    }
    async function boot(page, hash = '#/v/brennans') {
      await page.goto(base + '?nosw&check=house-flow' + hash);
      await page.waitForFunction(() => V32.booted && typeof V48_HUBS !== 'undefined' && v32HasHouse());
      await page.locator('nav[data-v48-nav],.v48-nav').first().waitFor();
    }
    async function mainView(page, view) {
      await page.locator('[data-v48-route="' + view + '"]').first().click();
      await page.waitForFunction(view => S.view === view, view);
    }
    async function back(page, view) {
      await page.locator('#v32-back').click();
      await page.waitForFunction(view => S.view === view, view);
      await page.waitForTimeout(100);
    }
    async function marks(page) { return page.evaluate(() => JSON.stringify({ stats:ST, saved:localStorage.getItem('codexStats'), house:v28House() })); }
    const { context, page } = await device();
    await boot(page);
    const original = await page.evaluate(() => ({
      ids: v28MealRows(v28Rows(), '').map(row => row.id),
      menu: v28Rows().filter(row => !row.bottle).length,
      floor: v28Rows().filter(row => row.bottle).length,
      paths: v40Paths().length,
      prompts: v40Paths().reduce((n, item) => n + item.prompts.length, 0),
      workshops: v40Workshops().length
    }));
    check('all 271 study wines remain, including 34 menu wines and 237 floor bottles', original.ids.length === 271 && original.menu === 34 && original.floor === 237 && new Set(original.ids).size === 271);
    check('all 12 readings, 60 recall prompts and eight pairing workshops remain', original.paths === 12 && original.prompts === 60 && original.workshops === 8);
    await page.evaluate(() => {
      const id = v28Rows()[0].id, key = 'h-' + id + '-card';
      ST.q[key] = { c: 2, w: 1, s: 1 };
      ST.cellarCompassSeen = ST.cellarCompassSeen || {};
      ST.cellarCompassSeen[v28House().id] = { [id]: Date.now() - 86400000 };
      stSave(); render();
    });
    const before = await marks(page);
    check('four named sections replace the scattered jump row', await page.locator('[data-v48-route]').evaluateAll((nodes, words) => nodes.slice(0,4).map(node => node.textContent.trim()).every((word,index) => word === words[index]), words) && await page.locator('.v41-jumps').count() === 0);
    check('five compact wine groups start closed', await page.locator('details.v48-wine-group').count() === 5 && await page.locator('details.v48-wine-group[open]').count() === 0);
    check('all wine rows are retained once in their established order', await page.locator('.v28-row').evaluateAll((nodes, ids) => nodes.length === ids.length && nodes.map(n => n.dataset.id).join('|') === ids.join('|'), original.ids));
    check('list has one labelled section selector and visible result count', await page.locator('#v48-section').count() === 1 && await page.locator('#v48-count').isVisible() && /271/.test(await page.locator('#v48-count').textContent()) && await page.locator('.v28-chips').count() === 0);
    check('the list no longer appends the Compass, producer, video and editor sections', await page.locator('#v41-compass-h,#v41-producers-h,#v41-videos-h,#v41-house-h').count() === 0);

    // A real user opens a folder and a wine, then returns to the same button.
    await page.locator('details.v48-wine-group[data-v48-kind="glass"] > summary').click();
    const first = page.locator('details.v48-wine-group[data-v48-kind="glass"] .v28-row').first();
    const firstId = await first.getAttribute('data-id');
    await first.evaluate(node => node.scrollIntoView({ block:'center' }));
    await page.waitForTimeout(100);
    const listScroll = await page.evaluate(() => scrollY);
    await first.click();
    await page.waitForFunction(id => S.view === 'cellar' && v28State().open === id, firstId);
    check('opening a wine preserves its exact existing card address', await page.evaluate(id => location.hash.includes(id), firstId));
    check('three timed descriptions remain the canonical stored text', await page.evaluate(id => {
      const item = v28Find(v28House().wines, id), lines = v28LinesShown(item);
      return document.querySelector('.v41-ten .v28-ten').textContent === lines.s10 && document.querySelector('#v28-s20').textContent === lines.s20 && document.querySelector('#v28-s45').textContent === lines.s45;
    }, firstId));
    check('wine detail retains producer, grape, service and teaching connections', await page.locator('.v38-who').count() > 0 && await page.locator('.v28-block').count() > 3);
    await back(page, 'brennans');
    await page.waitForTimeout(150);
    check('Back retains the open group and exact wine-button focus', await page.locator('details.v48-wine-group[data-v48-kind="glass"][open]').count() === 1 && await page.evaluate(id => document.activeElement.getAttribute('data-id') === id, firstId));
    check('Back restores the wine-list scroll position', Math.abs(await page.evaluate(() => scrollY) - listScroll) < 8);

    await page.locator('#v28-q').fill('Minuty');
    check('search reveals all matching rows and their group', await page.locator('.v28-row:visible').count() > 0 && await page.locator('.v28-row').count() === await page.locator('.v28-row:visible').count() && / of /.test(await page.locator('#v48-count').textContent()));
    const found = page.locator('.v28-row').first(), foundId = await found.getAttribute('data-id');
    await found.click(); await back(page, 'brennans');
    check('Back preserves a search and returns to its exact result', await page.locator('#v28-q').inputValue() === 'Minuty' && await page.evaluate(id => document.activeElement.getAttribute('data-id') === id, foundId));
    await page.locator('#v28-q').fill('qzz-no-such-wine');
    check('no-match search offers a visible clear action', await page.locator('.v28-row').count() === 0 && await page.locator('#v48-clear').isVisible() && /no|0/i.test(await page.locator('#v48-count').textContent()));
    await page.locator('#v48-clear').click();
    check('clear restores the collection and input focus', await page.locator('#v28-q').inputValue() === '' && await page.locator('.v28-row').count() === 271 && await page.evaluate(() => document.activeElement.id === 'v28-q'));
    await page.locator('#v48-section').selectOption('#bottles');
    check('bottle filter includes every one of the 237 floor bottles', await page.locator('.v28-row').count() === 237 && await page.locator('.v28-row:visible').count() === 237);
    const nested = await page.locator('#v48-section option').evaluateAll(nodes => nodes.map(n => n.value).find(value => value.startsWith('#bottles|')));
    check('floor sections remain individually selectable', !!nested);
    await page.locator('#v48-section').selectOption(nested);
    const nFloor = await page.locator('.v28-row').count();
    check('a floor section narrows the list without losing its original wines', nFloor > 0 && nFloor < 237 && await page.locator('.v28-row').evaluateAll((nodes, ids) => nodes.every(n => ids.includes(n.dataset.id)), original.ids));
    await page.locator('.v28-row').last().click(); await back(page, 'brennans');
    check('Back retains the precise floor section', await page.locator('#v48-section').inputValue() === nested && await page.locator('.v28-row').count() === nFloor);
    await page.locator('#v48-section').selectOption('');

    for (let i = 1; i < views.length; i++) {
      await mainView(page, views[i]);
      check(words[i] + ' has its own address and house ownership', await page.evaluate(view => location.hash === '#/v/' + view && document.querySelector('#nav-brennans').getAttribute('aria-current') === 'page', views[i]));
      check(words[i] + ' retains all four clear section choices', await page.locator('[data-v48-route]').count() >= 4);
      const entry = await page.evaluate(() => ({ depth:V32.d, length:history.length, hash:location.hash }));
      await page.locator('.v48-nav [aria-current="page"]').click();
      check('selecting the current ' + words[i] + ' tab adds no history entry', await page.evaluate(before => V32.d === before.depth && history.length === before.length && location.hash === before.hash, entry));
    }
    check('browsing, opening cards and filtering preserve saved answers and house records', await marks(page) === before);

    // The new rooms lead to the original content, and Back remembers the
    // precise door even when several doors share a route or deck action.
    await mainView(page, 'housestudies');
    for (const [arg, kind, expected] of [['','paths',12],['workshops','workshops',8],['wines','wines',271]]) {
      const selector = '[data-v48-route="cellarcompass"][data-v48-arg="' + arg + '"]';
      const opener = await page.locator(selector).getAttribute('id');
      await page.locator(selector).click();
      await page.waitForFunction(() => S.view === 'cellarcompass');
      check('Wine studies opens the complete Compass ' + kind + ' collection', await page.evaluate(({kind,expected}) => v40State().kind === kind && (kind === 'paths' ? v40Paths().length : kind === 'workshops' ? v40Workshops().length : v40Rows().length) === expected, {kind,expected}));
      await back(page, 'housestudies');
      check('Back returns to the exact ' + kind + ' door', await page.evaluate(id => document.activeElement.id === id, opener));
    }
    await page.locator('#v48-summary-illustrated').click();
    for (const route of ['illustrations','culinary','techniques']) {
      const selector = '[data-v48-route="' + route + '"]', opener = await page.locator(selector).getAttribute('id');
      await page.locator(selector).click(); await page.waitForFunction(view => S.view === view, route);
      check(route + ' retains its full authored collection', await page.locator('#view').innerText().then(text => text.length > 300));
      await back(page, 'housestudies');
      check('Back preserves illustrated disclosure and ' + route + ' focus', await page.locator('[data-v48-keep="illustrated"][open]').count() === 1 && await page.evaluate(id => document.activeElement.id === id, opener));
    }
    await page.locator('#v48-summary-videos').click();
    const videoOpener = await page.locator('[data-v48-route="housevideos"]').getAttribute('id');
    await page.locator('[data-v48-route="housevideos"]').click(); await page.waitForFunction(() => S.view === 'housevideos');
    check('house videos remain accessible from the studies room', await page.locator('#view').innerText().then(text => text.length > 300));
    await back(page, 'housestudies');
    check('Back keeps Watch the technique expanded and its opener focused', await page.locator('[data-v48-keep="videos"][open]').count() === 1 && await page.evaluate(id => document.activeElement.id === id, videoOpener));

    await mainView(page, 'houserehearsal');
    check('service rehearsal presents recall, description and guest guidance in order', await page.locator('.v48-steps h3').allTextContents().then(text => text.join('|') === 'Recall the wine|Describe the pour|Guide the guest'));
    for (const id of ['cellar-compass','list']) {
      const selector = '[data-deck="' + id + '"]', opener = await page.locator(selector).first().getAttribute('id');
      await page.locator(selector).first().click(); await page.waitForFunction(() => S.view === 'deck');
      check('rehearsal opens the existing ' + id + ' deck', await page.evaluate(id => S._v32deck === id && v32DeckDef(id).cards.length > 0, id));
      await back(page, 'houserehearsal');
      check('Back focuses the precise ' + id + ' activity', await page.evaluate(id => document.activeElement.id === id, opener));
    }
    for (const [key, view] of [['housesay','housesay'],['houserecite','houserecite'],['houseguest','houseguest'],['housepair','quiz']]) {
      const selector = '[data-go="' + key + '"]', opener = await page.locator(selector).getAttribute('id');
      await page.locator(selector).click(); await page.waitForFunction(view => S.view === view, view);
      check(key + ' still opens its existing rehearsal', await page.locator('#view').innerText().then(text => text.length > 50));
      await back(page, 'houserehearsal');
      if (!await page.evaluate(id => document.activeElement.id === id, opener)) console.error('Rehearsal focus:', key, opener, await page.evaluate(() => ({ actual:document.activeElement.id, text:document.activeElement.textContent.slice(0,120), remembered:V32.focusFor[location.href], hash:location.hash })));
      check(key + ' returns to its own activity button', await page.evaluate(id => document.activeElement.id === id, opener));
    }
    await page.locator('#v48-summary-focused-rounds').click();
    const focused = await page.locator('[data-v48-keep="focused-rounds"] [data-deck]').evaluateAll(nodes => nodes.map(node => node.dataset.deck));
    check('focused rounds retain every existing menu and floor section deck', await page.evaluate(ids => v32Sections().every(sec => ids.includes('list:' + v32Slug(sec.section))) && v32FloorSections().every(sec => ids.includes('bottles:' + v32Slug(sec.section))) && ids.includes('menu-words') && ids.includes('bottles'), focused));
    const focusDeck = focused.find(id => id.startsWith('bottles:'));
    await page.locator('[data-deck="' + focusDeck + '"]').click(); await page.waitForFunction(() => S.view === 'deck');
    check('floor section round keeps the original bottle card IDs', await page.evaluate(id => S._v32deck === id && v32DeckDef(id).cards.every(card => v28Rows().some(row => row.id === card.id)), focusDeck));
    await back(page, 'houserehearsal');
    check('Back retains the expanded focused rounds', await page.locator('[data-v48-keep="focused-rounds"][open]').count() === 1);

    await mainView(page, 'housereference');
    for (const [selector, view] of [['[data-v48-route="houseproducers"]','houseproducers'],['[data-v32="fullwine"]','fulllist']]) {
      const opener = await page.locator(selector).getAttribute('id');
      await page.locator(selector).click(); await page.waitForFunction(view => S.view === view, view);
      if (view === 'fulllist') await page.waitForFunction(() => typeof V29_LIST !== 'undefined' && V29_LIST.status === 'ready' && document.querySelector('#view').innerText.length > 100);
      check(view + ' remains accessible from House reference', await page.locator('#view').innerText().then(text => text.length > 100));
      await back(page, 'housereference');
      check(view + ' returns to its exact reference door', await page.evaluate(id => document.activeElement.id === id, opener));
    }
    if (await page.locator('#v48-summary-house-notes').count()) {
      await page.locator('#v48-summary-house-notes').click();
      await page.waitForFunction(() => document.querySelector('#v48-house-read').textContent.length > 100);
      check('house notes and vocabulary load the existing read-only collection', await page.locator('#v48-house-read').innerText().then(text => /must.knows|tastings|vocabulary|terms/i.test(text)));
      await mainView(page, 'housestudies'); await mainView(page, 'housereference');
      check('returning to House reference keeps its notes open', await page.locator('[data-v48-keep="house-notes"][open]').count() === 1 && await page.locator('#v48-house-read').innerText().then(text => text.length > 100));
    } else {
      check('no unsupported read-only house UI is presented', await page.evaluate(() => !v28HouseDoorOn()));
      check('house notes remain a visible reference doorway', await page.locator('[data-go="house"]').isVisible());
      const opener = await page.locator('[data-go="house"]').getAttribute('id');
      await page.locator('[data-go="house"]').click(); await page.waitForFunction(() => S.view === 'house');
      check('the existing house collection and its notes remain available', await page.locator('#view').innerText().then(text => text.length > 100));
      await back(page, 'housereference');
      check('Back returns to the exact house-notes doorway', await page.evaluate(id => document.activeElement.id === id, opener));
    }
    check('all hub activity launches and reading preserve existing grades and house records', await marks(page) === before);

    // All four views are accessible directly and cold Back has a useful parent.
    for (const view of views) {
      const cold = await context.newPage(); cold.on('pageerror', e => errors.push(e.message));
      await boot(cold, '#/v/' + view);
      check('direct address opens ' + view, await cold.evaluate(view => S.view === view, view));
      await back(cold, view === 'brennans' ? 'home' : 'brennans');
      check('cold Back from ' + view + ' reaches its structural parent', true);
      await cold.close();
    }
    const nestedRoutes = [
      ['houseproducers','housereference'], ['housevideos','housestudies'], ['fulllist','housereference'], ['cellarcompass','level']
    ];
    for (const [view, parent] of nestedRoutes) {
      const cold = await context.newPage(); cold.on('pageerror', e => errors.push(e.message));
      await cold.goto(base + '?nosw&check=cold-house-flow#/v/' + view);
      await cold.waitForFunction(() => V32.booted && v32HasHouse());
      await cold.waitForFunction(view => S.view === view, view);
      await back(cold, parent);
      check('cold ' + view + ' returns to ' + parent, true);
      await cold.close();
    }

    for (const width of [320,390,1120]) for (const theme of ['day','night']) {
      await page.setViewportSize({ width, height: 844 });
      await page.evaluate(theme => OOT.service.set(theme), theme);
      for (const view of views) {
        await mainView(page, view);
        await page.waitForTimeout(80);
        const fit = await page.evaluate(() => ({
          fit: document.documentElement.scrollWidth <= innerWidth + 1,
          controls: Array.from(document.querySelectorAll('[data-v48-route],#v48-section,#v48-clear,.v48-flow summary')).filter(n => n.getClientRects().length).every(n => { const r = n.getBoundingClientRect(); return r.height >= 43.5 && r.width >= 43.5; })
        }));
        check(width + 'px ' + theme + ' ' + view + ' fits with comfortable controls', fit.fit && fit.controls);
        if (width === 390 && process.env.CODEX_SHOTS) {
          fs.mkdirSync(process.env.CODEX_SHOTS, { recursive: true });
          await page.locator('.v48-flow details[open]').evaluateAll(nodes => nodes.forEach(node => { node.open = false; }));
          await page.waitForTimeout(100);
          await page.screenshot({ path: path.join(process.env.CODEX_SHOTS, 'house-flow-' + view + '-' + theme + '.png'), fullPage: true });
        }
      }
    }
    check('the whole navigation and reading walk keeps stored training unchanged', await marks(page) === before);

    // Exercise source data boundaries without importing or altering a house.
    // Only this isolated browser's reader function is substituted temporarily.
    await page.evaluate(() => { window.__houseFlowOriginal = v27Current; window.__houseFlowHouse = v27Current(); });
    try {
      await page.evaluate(() => {
        const original = window.__houseFlowHouse;
        const custom = Object.assign({}, original, { id:'h-other001', name:'Another <Cellar> & Table', pack:null, wines:original.wines.slice(0,3), dishes:[], cocktails:[], tastings:[] });
        v27Current = function () { return custom; };
        v32Go({view:'brennans'}, 'replace');
      });
      check('another house uses its escaped name, three house wines and preserved personal bottles', await page.evaluate(() => v28Rows().filter(row => !row.own).length === 3 && document.querySelectorAll('.v28-row').length === v28Rows().length) && await page.locator('#nav-brennans').textContent() === 'Another <Cellar> & Table' && await page.locator('cellar').count() === 0);
      for (const view of views.slice(1)) {
        await mainView(page, view);
        check('custom house can open ' + view, await page.evaluate(view => S.view === view, view));
      }
      await page.evaluate(() => { v27Current = function () { return null; }; v32Go({view:'brennans'}, 'replace'); });
      check('no-house list gives a usable recovery page', await page.locator('.v48-flow').innerText().then(text => text.length > 100) && await page.locator('.v28-row').count() === 0);
      for (const view of views.slice(1)) {
        await mainView(page, view);
        check('no-house ' + view + ' explains the missing collection and remains navigable', await page.locator('.v48-flow').innerText().then(text => /not loaded/.test(text)) && await page.locator('.v48-nav [data-v48-route]').count() === 4);
      }
    } finally {
      await page.evaluate(() => { v27Current = window.__houseFlowOriginal; delete window.__houseFlowOriginal; delete window.__houseFlowHouse; v32Go({view:'brennans'}, 'replace'); });
    }
    check('restoring the house recovers all 271 wines without changing its saved records', await page.locator('.v28-row').count() === 271 && await marks(page) === before);
    check('no JavaScript errors during the complete interaction run', errors.length === 0);
    await context.close();
    console.log('Brennan\'s learning flow: all ' + checks.length + ' checks pass.');
    if (process.env.CODEX_REPORT) fs.writeFileSync(process.env.CODEX_REPORT, JSON.stringify({ checks:checks.length, results:checks, errors }, null, 2) + '\n');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
