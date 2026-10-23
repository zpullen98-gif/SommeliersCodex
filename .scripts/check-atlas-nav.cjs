#!/usr/bin/env node
/* Exercise the final shipped navigation chain in an isolated browser profile.
   CODEX_URL may point at the public wing; PLAYWRIGHT_MODULE is optional.
   The cancellation check supplies the optional leaveSitting hook explicitly:
   ordinary regional drills do not currently provide their own leave dialog. */
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
    const errors = [];
    function watch(page) { page.on('pageerror', error => errors.push(error.message)); return page; }
    const page = watch(await ctx.newPage());
    async function boot(target, route) {
      await target.goto(base + route);
      await target.waitForFunction(() => typeof _v47Nav === 'function' && V32.booted && document.querySelector('nav.v47nav'));
    }
    async function view(target, name) { await target.waitForFunction(name => S.view === name, name); }
    async function owner(target, word) {
      return target.locator('nav.v47nav [aria-current="page"]').evaluateAll((nodes, word) => nodes.length === 1 && nodes[0].getAttribute('data-nav') === word, word);
    }
    async function back(target, expected) { await target.locator('#v32-back').click(); await view(target, expected); }
    async function regionalReady(target, slug) {
      await target.waitForFunction(slug => S.view === 'region' && S._v39region === slug && v39RecReady(v39Find(slug)) && !document.querySelector('#v39-wait'), slug);
    }

    await boot(page, '#/');
    await page.waitForFunction(() => v32HasHouse());
    const saved = await page.evaluate(() => localStorage.getItem('codexStats'));
    ok('six destinations retain their order with Wine Atlas beside Practise', await page.locator('nav.v47nav [data-nav]').evaluateAll(nodes => nodes.map(n => n.dataset.nav).join(',') === 'home,brennans,practise,worldmap,library,more'));
    ok('existing house name and Practise due count are preserved', await page.evaluate(() => {
      const pill = document.querySelector('#nav-practise .v32pill'), due = v32DueToday().total;
      return document.querySelector('#nav-brennans').textContent === v41TabWord()
        && (due ? !!pill && Number.parseInt(pill.textContent, 10) === due : !pill);
    }));
    await page.locator('#nav-worldmap').click(); await view(page, 'worldmap');
    await page.locator('.v31-map-card[data-map="france"]').waitFor();
    ok('Atlas navigation opens the complete country overview', await page.evaluate(() => !S.wmap && location.hash === '#/v/worldmap') && await owner(page, 'worldmap'));
    ok('overview retains all three detailed study doors', await page.locator('.v45-door .v45-actions [data-v45="index"]').count() === 1
      && await page.locator('.v45-door .v45-actions [data-v47="readings"]').textContent() === 'Country and region readings'
      && await page.locator('.v45-door .v45-actions [data-v47="workshop"]').textContent() === 'The Wine Workshop');
    const rootDepth = await page.evaluate(() => ({ depth: V32.d, length: history.length }));
    await page.locator('#nav-worldmap').click();
    ok('tapping the current overview does not add a history entry', await page.evaluate(before => V32.d === before.depth && history.length === before.length, rootDepth));
    await page.locator('.v31-map-card[data-map="france"]').click();
    await page.waitForFunction(() => S.view === 'worldmap' && S.wmap === 'france');
    ok('country map retains Atlas ownership', await owner(page, 'worldmap'));
    await page.locator('#nav-worldmap').click();
    await page.waitForFunction(() => S.view === 'worldmap' && !S.wmap);
    ok('Atlas tab returns from a country sheet to the overview', await page.locator('.v31-map-card[data-map="france"]').count() === 1 && await owner(page, 'worldmap'));
    await back(page, 'worldmap');
    await page.waitForFunction(() => S.wmap === 'france');
    ok('warm Back restores the country sheet after rerooting', await owner(page, 'worldmap'));
    await page.locator('#nav-worldmap').click();
    await page.locator('[data-v47="readings"]').click(); await view(page, 'regions');
    ok('new reading door opens the country and region index under Atlas', await owner(page, 'worldmap') && await page.locator('#v39-row-france').count() === 1);
    await page.locator('#v39-row-france').click(); await view(page, 'country');
    await page.locator('.v39-country [data-v39="region"][data-slug="champagne"]').click(); await regionalReady(page, 'champagne');
    ok('country readings lead to the complete regional lesson under Atlas', await owner(page, 'worldmap') && await page.locator('.v39-article .v39-sections details').count() >= 3 && await page.locator('.v39-article .v39-sources a').count() >= 1);
    await page.locator('[data-v45="map"][data-v45-arg="champagne"]').first().click(); await view(page, 'fieldmap');
    ok('regional lesson opens the detailed field map without losing ownership', await owner(page, 'worldmap') && await page.locator('.v45-key li').count() >= 8 && await page.locator('#v45-note-content').innerText().then(text => text.length > 1000));
    await page.locator('[data-v45="reading"][data-v45-arg="champagne"]').first().click(); await regionalReady(page, 'champagne');
    ok('field map returns to the complete regional reading', await owner(page, 'worldmap'));
    await back(page, 'fieldmap');
    ok('warm Back returns to the exact field map', await page.evaluate(() => S._v45map === 'champagne') && await owner(page, 'worldmap'));
    await page.locator('[data-v45="deck"][data-v45-arg="region:champagne"]').first().click(); await view(page, 'deck');
    ok('map recall cards retain the existing regional deck and Practise ownership', await page.evaluate(() => S._v32deck === 'region:champagne') && await owner(page, 'practise'));
    await back(page, 'fieldmap');
    await page.locator('#nav-worldmap').click();
    await page.locator('[data-v45="index"]').first().click(); await view(page, 'fieldatlas');
    while (await page.locator('#v45-more').isVisible()) await page.locator('#v45-more').click();
    ok('regional field index remains complete and belongs to Atlas', await owner(page, 'worldmap') && await page.locator('.v45-card-open').count() === 129);
    await back(page, 'worldmap');
    await page.locator('[data-v47="workshop"]').click(); await view(page, 'techniques');
    ok('Workshop door opens all 43 lessons with Library ownership', await owner(page, 'library') && await page.locator('.v46-group li').count() === 43);
    await back(page, 'worldmap');
    ok('warm Back returns from the Workshop to its Atlas entrance', await owner(page, 'worldmap') && await page.locator('[data-v47="workshop"]').count() === 1);
    ok('navigation and reading do not invent study marks', await page.evaluate(() => localStorage.getItem('codexStats')) === saved);

    // Separate pages establish genuine cold addresses with no in-app history.
    const coldRoutes = [
      { route: '#/v/worldmap', initial: 'worldmap', parents: ['home'] },
      { route: '#/v/worldmap/france', initial: 'worldmap', parents: ['worldmap', 'home'] },
      { route: '#/v/regions', initial: 'regions', parents: ['worldmap', 'home'] },
      { route: '#/v/country/france', initial: 'country', parents: ['regions', 'worldmap', 'home'] },
      { route: '#/v/region/champagne', initial: 'region', parents: ['country', 'regions', 'worldmap', 'home'] },
      { route: '#/v/fieldatlas', initial: 'fieldatlas', parents: ['worldmap', 'home'] },
      { route: '#/v/fieldmap/champagne', initial: 'fieldmap', parents: ['fieldatlas', 'worldmap', 'home'] }
    ];
    for (const test of coldRoutes) {
      const cold = watch(await ctx.newPage());
      await boot(cold, test.route); await view(cold, test.initial);
      assert.ok(await owner(cold, 'worldmap'), test.route + ' initial owner');
      for (const parent of test.parents) {
        await back(cold, parent);
        assert.ok(await owner(cold, parent === 'home' ? 'home' : 'worldmap'), test.route + ' parent owner: ' + parent);
        if (parent === 'worldmap') assert.ok(await cold.evaluate(() => !S.wmap), test.route + ' cold parent is overview');
        if (parent === 'country') assert.equal(await cold.evaluate(() => S._v39country), 'france');
      }
      ok('cold Back hierarchy: ' + test.route, true);
      await cold.close();
    }

    await boot(page, '#/v/fieldmap/champagne');
    await page.locator('[data-v45="drill"][data-v45-arg="champagne"]').first().click(); await view(page, 'quiz');
    ok('regional questions still open a real quiz owned by Practise', await owner(page, 'practise') && await page.evaluate(() => S.pool.length > 0 && S.mode === 'drill'));
    // An injected hook isolates the existing optional guard contract, without
    // pretending that ordinary drills themselves display a confirmation dialog.
    const quizBefore = await page.evaluate(() => {
      window.__atlasGuard = { original: typeof leaveSitting === 'function' ? leaveSitting : null, calls: 0 };
      window.leaveSitting = function () { window.__atlasGuard.calls++; return false; };
      return JSON.stringify({ view: S.view, mode: S.mode, idx: S.idx, ids: S.pool.map(q => q.id), answered: S.answered, results: S.results, correct: S.correct, hash: location.hash, depth: V32.d, stats: localStorage.getItem('codexStats') });
    });
    try {
      await page.locator('#nav-worldmap').click();
      ok('Atlas honours a cancelled optional leave guard without changing the live quiz', await page.evaluate(before => window.__atlasGuard.calls === 1 && before === JSON.stringify({ view: S.view, mode: S.mode, idx: S.idx, ids: S.pool.map(q => q.id), answered: S.answered, results: S.results, correct: S.correct, hash: location.hash, depth: V32.d, stats: localStorage.getItem('codexStats') }), quizBefore) && await owner(page, 'practise'));
      await page.evaluate(() => { window.leaveSitting = function () { window.__atlasGuard.calls++; return true; }; });
      await page.locator('#nav-worldmap').click(); await view(page, 'worldmap');
      ok('accepted leave guard opens the overview and clears active quiz mode', await page.evaluate(() => window.__atlasGuard.calls === 2 && !S.wmap && S.mode === null) && await owner(page, 'worldmap'));
    } finally {
      await page.evaluate(() => { if (window.__atlasGuard.original) window.leaveSitting = window.__atlasGuard.original; else delete window.leaveSitting; delete window.__atlasGuard; });
    }

    await page.evaluate(() => {
      window.__atlasNavOriginals = { house: v28House, due: v32DueToday };
      v28House = function () { return Object.assign({}, window.__atlasNavOriginals.house.apply(this, arguments), { name: 'Brennan\'s <Reserve> & Restaurant' }); };
      v32DueToday = function () { return Object.assign({}, window.__atlasNavOriginals.due.apply(this, arguments), { total: 999 }); };
      render();
    });
    try {
      ok('house naming stays escaped and Practise retains its own due pill', await page.evaluate(() => document.querySelector('#nav-brennans').textContent === 'Brennan\'s <Reserve> & Restaurant' && !document.querySelector('#nav-brennans reserve') && Number.parseInt(document.querySelector('#nav-practise .v32pill').textContent, 10) === 999 && !document.querySelector('#nav-worldmap .v32pill')));
      for (const width of [320, 390]) {
        await page.setViewportSize({ width, height: 900 });
        for (const service of ['day', 'night']) {
          await page.evaluate(service => { OOT.service.set(service); render(); }, service);
          const layout = await page.evaluate(() => {
            const nav = document.querySelector('nav.v47nav'), buttons = [...nav.querySelectorAll('[data-nav]')];
            const rects = buttons.map(button => { const r = button.getBoundingClientRect(); return { id: button.dataset.nav, x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, scroll: button.scrollWidth, client: button.clientWidth }; });
            const first = rects.slice(0, 2), second = rects.slice(2);
            return {
              service: document.documentElement.getAttribute('data-service'),
              fits: document.documentElement.scrollWidth <= innerWidth + 1 && nav.scrollWidth <= nav.clientWidth + 1,
              targets: rects.every(r => r.width >= 44 && r.height >= 44 && r.x >= -1 && r.right <= innerWidth + 1 && r.scroll <= r.client + 1),
              // More retains its established inset margin, so compare row centres.
              rows: Math.abs(first[0].y - first[1].y) < 1 && second.every(r => Math.abs(r.y + r.height / 2 - second[0].y - second[0].height / 2) < 1) && second[0].y >= first[0].y + first[0].height - 1,
              spans: first.every(r => r.width > second[0].width * 1.8),
              rects
            };
          });
          if (!(layout.service === service && layout.fits && layout.targets && layout.rows && layout.spans)) console.error('Navigation layout:', JSON.stringify(layout));
          ok(service + ' at ' + width + 'px: readable 44px targets, four-column second row and no overflow', layout.service === service && layout.fits && layout.targets && layout.rows && layout.spans);
          await page.locator('#nav-practise').click(); await view(page, 'flashcards');
          await page.locator('#nav-worldmap').click(); await view(page, 'worldmap');
          ok(service + ' at ' + width + 'px: adjacent Practise and Atlas remain usable', await owner(page, 'worldmap') && await page.evaluate(() => !S.wmap));
        }
      }
    } finally {
      await page.evaluate(() => { v28House = window.__atlasNavOriginals.house; v32DueToday = window.__atlasNavOriginals.due; delete window.__atlasNavOriginals; render(); });
    }
    await page.setViewportSize({ width: 1360, height: 900 });
    ok('desktop keeps all six navigation targets visible and at least 44px', await page.locator('nav.v47nav [data-nav]').evaluateAll(nodes => nodes.length === 6 && nodes.every(node => { const r = node.getBoundingClientRect(); return r.width >= 44 && r.height >= 44 && r.x >= 0 && r.right <= innerWidth; })));
    await page.locator('#nav-worldmap').focus(); await page.keyboard.press('Enter');
    ok('Atlas navigation remains keyboard operable', await owner(page, 'worldmap') && await page.evaluate(() => S.view === 'worldmap' && !S.wmap));
    ok('no browser exceptions', errors.length === 0);
    console.log('check-atlas-nav: all ' + passed + ' checks pass');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
