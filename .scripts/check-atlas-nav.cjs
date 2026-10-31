#!/usr/bin/env node
/* The atlas in the final shipped navigation chain, in an isolated browser profile (the CMS edition, codex53,
   29 October 2026; first written for codex47's Wine Atlas tab).

   The contract since codex53: six words in one row, Home, the house's name, CMS, Grapes, Library and More, the
   bar nav.v32nav without codex47's v47nav class, the due pill on Library alone. The atlas (the World Map, the
   country sheets, the country and region readings, the field atlas and the field maps) belongs to Library again:
   it is entered through the Library's atlas section, every atlas screen lights Library, and a cold Back climbs
   from the World Map to Library and then Home. The route walk (readings, country, region, field map, deck,
   drill), the cold Back table, the leave guard and the keyboard checks are codex47's, moved to the new owner.

   CODEX_URL may point at a served edition (the public wing, or the source served with the site's shared layer);
   without it the files are served by Playwright routes from the Codex root (argv[2], default this repo) with the
   canonical shared house pack from OOT_SHARED, as check-house-flow serves them. PLAYWRIGHT_MODULE, or argv[3],
   names Playwright. The cancellation check supplies the optional leaveSitting hook explicitly: ordinary regional
   drills do not currently provide their own leave dialog. */
'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const shared = path.resolve(process.env.OOT_SHARED || 'C:/Users/zpull/WorldTable/static/shared');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || process.argv[3] || 'C:/Users/zpull/WorldTable/node_modules/playwright');
const served = (process.env.CODEX_URL || 'http://codex.test/codex/').replace(/\/?$/, '/');
const base = served + '?nosw';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const WORDS = 'home,brennans,cms,grapes,library,more';
let passed = 0;
function ok(name, value) { assert.ok(value, name); passed++; console.log('PASS ' + name); }

async function routeFiles(context) {
  if (process.env.CODEX_URL) return;
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin !== 'http://codex.test') return route.fulfill({ status: 404, body: '' });
    const isShared = url.pathname.startsWith('/shared/'), dir = isShared ? shared : root, prefix = isShared ? '/shared/' : '/codex/';
    if (!url.pathname.startsWith(prefix)) return route.fulfill({ status: 404, body: '' });
    const relative = decodeURIComponent(url.pathname.slice(prefix.length)) || 'index.html', file = path.resolve(dir, relative);
    if (!file.startsWith(dir + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return route.fulfill({ status: 404, body: '' });
    let body = fs.readFileSync(file);
    if (!isShared && relative === 'index.html' && !body.toString().includes('../shared/oot-house.js')) body = Buffer.from(body.toString().replace('<script src="js/data-questions.js', '<script src="../shared/oot-house.js"></script><script src="../shared/oot-house-ui.js"></script>\n<script src="js/data-questions.js'));
    return route.fulfill({ contentType: mime[path.extname(file)] || 'application/octet-stream', body });
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const ctx = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 } });
    await routeFiles(ctx);
    const errors = [];
    function watch(page) { page.on('pageerror', error => errors.push(error.message)); return page; }
    const page = watch(await ctx.newPage());
    async function boot(target, route) {
      await target.goto(base + route);
      await target.waitForFunction(() => typeof _v53NavHtml === 'function' && V32.booted && document.querySelector('nav.v32nav [data-nav="library"]'));
    }
    async function view(target, name) { await target.waitForFunction(name => S.view === name, name); }
    async function owner(target, word) {
      return target.locator('nav.v32nav [aria-current="page"]').evaluateAll((nodes, word) => nodes.length === 1 && nodes[0].getAttribute('data-nav') === word, word);
    }
    async function back(target, expected) { await target.locator('#v32-back').click(); await view(target, expected); }
    async function regionalReady(target, slug) {
      await target.waitForFunction(slug => S.view === 'region' && S._v39region === slug && v39RecReady(v39Find(slug)) && !document.querySelector('#v39-wait'), slug);
    }
    async function libraryAtlas(target) {
      await target.locator('#nav-library').click(); await view(target, 'library');
      await target.locator('.v53-atlas').waitFor();
    }

    await boot(page, '#/');
    await page.waitForFunction(() => v32HasHouse());
    const saved = await page.evaluate(() => localStorage.getItem('codexStats'));
    ok('six destinations in their order, Home, the house, CMS, Grapes, Library and More, with no Wine Atlas word', await page.locator('nav.v32nav [data-nav]').evaluateAll((nodes, words) => nodes.map(n => n.dataset.nav).join(',') === words, WORDS)
      && await page.locator('#nav-worldmap').count() === 0);
    ok('the bar is nav.v32nav without codex47\'s v47nav class', await page.locator('nav.v32nav').count() === 1 && await page.locator('nav.v47nav, .v47nav').count() === 0);
    ok('existing house name and the due count on Library are preserved, and no other word carries the pill', await page.evaluate(() => {
      const pill = document.querySelector('#nav-library .v32pill'), due = v32DueToday().total;
      return document.querySelector('#nav-brennans').textContent === v41TabWord()
        && (due ? !!pill && Number.parseInt(pill.textContent, 10) === due : !pill)
        && document.querySelectorAll('nav.v32nav .v32pill').length === (due ? 1 : 0);
    }));

    /* the atlas through the Library's atlas section */
    await libraryAtlas(page);
    ok('the Library carries the atlas section with the World Map row and the field atlas door', await page.locator('.v53-atlas [data-go="worldmap"]').count() === 1 && await page.locator('.v53-atlas .v45-door [data-v45="index"]').count() === 1 && await owner(page, 'library'));
    const libDepth = await page.evaluate(() => ({ depth: V32.d, length: history.length }));
    await page.locator('#nav-library').click();
    ok('tapping the lit Library word on its root does not add a history entry', await page.evaluate(before => S.view === 'library' && V32.d === before.depth && history.length === before.length, libDepth));
    await page.locator('.v53-atlas [data-go="worldmap"]').click(); await view(page, 'worldmap');
    await page.locator('.v31-map-card[data-map="france"]').waitFor();
    ok('the Library\'s atlas opens the complete country overview, Library lit', await page.evaluate(() => !S.wmap && location.hash === '#/v/worldmap') && await owner(page, 'library'));
    ok('overview retains all three detailed study doors', await page.locator('.v45-door .v45-actions [data-v45="index"]').count() === 1
      && await page.locator('.v45-door .v45-actions [data-v47="readings"]').textContent() === 'Country and region readings'
      && await page.locator('.v45-door .v45-actions [data-v47="workshop"]').textContent() === 'The Wine Workshop');
    await page.locator('.v31-map-card[data-map="france"]').click();
    await page.waitForFunction(() => S.view === 'worldmap' && S.wmap === 'france');
    ok('country map keeps Library lit', await owner(page, 'library'));
    await page.locator('#nav-library').click(); await view(page, 'library');
    ok('the Library word returns from a country sheet to the Library', await page.locator('.v53-atlas').count() === 1 && await owner(page, 'library'));
    await back(page, 'worldmap');
    await page.waitForFunction(() => S.wmap === 'france');
    ok('warm Back restores the country sheet after rerooting', await owner(page, 'library'));
    await back(page, 'worldmap');
    await page.waitForFunction(() => !S.wmap);
    await page.locator('[data-v47="readings"]').click(); await view(page, 'regions');
    ok('the reading door opens the country and region index, Library lit', await owner(page, 'library') && await page.locator('#v39-row-france').count() === 1);
    await page.locator('#v39-row-france').click(); await view(page, 'country');
    await page.locator('.v39-country [data-v39="region"][data-slug="champagne"]').click(); await regionalReady(page, 'champagne');
    ok('country readings lead to the complete regional lesson, Library lit', await owner(page, 'library') && await page.locator('.v39-article .v39-sections details').count() >= 3 && await page.locator('.v39-article .v39-sources a').count() >= 1);
    await page.locator('[data-v45="map"][data-v45-arg="champagne"]').first().click(); await view(page, 'fieldmap');
    ok('regional lesson opens the detailed field map without losing ownership', await owner(page, 'library') && await page.locator('.v45-key li').count() >= 8 && await page.locator('#v45-note-content').innerText().then(text => text.length > 1000));
    await page.locator('[data-v45="reading"][data-v45-arg="champagne"]').first().click(); await regionalReady(page, 'champagne');
    ok('field map returns to the complete regional reading', await owner(page, 'library'));
    await back(page, 'fieldmap');
    ok('warm Back returns to the exact field map', await page.evaluate(() => S._v45map === 'champagne') && await owner(page, 'library'));
    await page.locator('[data-v45="deck"][data-v45-arg="region:champagne"]').first().click(); await view(page, 'deck');
    ok('map recall cards keep the existing regional deck, Library lit', await page.evaluate(() => S._v32deck === 'region:champagne') && await owner(page, 'library'));
    await back(page, 'fieldmap');
    await libraryAtlas(page);
    await page.locator('.v53-atlas [data-v45="index"]').first().click(); await view(page, 'fieldatlas');
    while (await page.locator('#v45-more').isVisible()) await page.locator('#v45-more').click();
    ok('regional field index remains complete and belongs to Library', await owner(page, 'library') && await page.locator('.v45-card-open').count() === 129);
    await back(page, 'library');
    await page.locator('.v53-atlas [data-go="worldmap"]').click(); await view(page, 'worldmap');
    await page.locator('[data-v47="workshop"]').click(); await view(page, 'techniques');
    ok('Workshop door opens all 43 lessons with Library ownership', await owner(page, 'library') && await page.locator('.v46-group li').count() === 43);
    await back(page, 'worldmap');
    ok('warm Back returns from the Workshop to its atlas entrance', await owner(page, 'library') && await page.locator('[data-v47="workshop"]').count() === 1);
    ok('navigation and reading do not invent study marks', await page.evaluate(() => localStorage.getItem('codexStats')) === saved);

    // Separate pages establish genuine cold addresses with no in-app history.
    const coldRoutes = [
      { route: '#/v/worldmap', initial: 'worldmap', parents: ['library', 'home'] },
      { route: '#/v/worldmap/france', initial: 'worldmap', parents: ['worldmap', 'library', 'home'] },
      { route: '#/v/regions', initial: 'regions', parents: ['library', 'home'] },
      { route: '#/v/country/france', initial: 'country', parents: ['regions', 'library', 'home'] },
      { route: '#/v/region/champagne', initial: 'region', parents: ['country', 'regions', 'library', 'home'] },
      { route: '#/v/fieldatlas', initial: 'fieldatlas', parents: ['worldmap', 'library', 'home'] },
      { route: '#/v/fieldmap/champagne', initial: 'fieldmap', parents: ['fieldatlas', 'worldmap', 'library', 'home'] }
    ];
    for (const test of coldRoutes) {
      const cold = watch(await ctx.newPage());
      await boot(cold, test.route); await view(cold, test.initial);
      assert.ok(await owner(cold, 'library'), test.route + ' initial owner');
      for (const parent of test.parents) {
        await back(cold, parent);
        assert.ok(await owner(cold, parent === 'home' ? 'home' : 'library'), test.route + ' parent owner: ' + parent);
        if (parent === 'worldmap') assert.ok(await cold.evaluate(() => !S.wmap), test.route + ' cold parent is overview');
        if (parent === 'country') assert.equal(await cold.evaluate(() => S._v39country), 'france');
      }
      ok('cold Back hierarchy: ' + test.route + ' climbs ' + test.parents.join(', '), true);
      await cold.close();
    }

    await boot(page, '#/v/fieldmap/champagne');
    await page.locator('[data-v45="drill"][data-v45-arg="champagne"]').first().click(); await view(page, 'quiz');
    ok('regional questions still open a real quiz, Library lit', await owner(page, 'library') && await page.evaluate(() => S.pool.length > 0 && S.mode === 'drill'));
    // An injected hook isolates the existing optional guard contract, without
    // pretending that ordinary drills themselves display a confirmation dialog.
    const quizBefore = await page.evaluate(() => {
      window.__atlasGuard = { original: typeof leaveSitting === 'function' ? leaveSitting : null, calls: 0 };
      window.leaveSitting = function () { window.__atlasGuard.calls++; return false; };
      return JSON.stringify({ view: S.view, mode: S.mode, idx: S.idx, ids: S.pool.map(q => q.id), answered: S.answered, results: S.results, correct: S.correct, hash: location.hash, depth: V32.d, stats: localStorage.getItem('codexStats') });
    });
    try {
      await page.locator('#nav-library').click();
      ok('the Library word honours a cancelled optional leave guard without changing the live quiz', await page.evaluate(before => window.__atlasGuard.calls === 1 && before === JSON.stringify({ view: S.view, mode: S.mode, idx: S.idx, ids: S.pool.map(q => q.id), answered: S.answered, results: S.results, correct: S.correct, hash: location.hash, depth: V32.d, stats: localStorage.getItem('codexStats') }), quizBefore) && await owner(page, 'library'));
      await page.evaluate(() => { window.leaveSitting = function () { window.__atlasGuard.calls++; return true; }; });
      await page.locator('#nav-library').click(); await view(page, 'library');
      ok('accepted leave guard opens the Library with its atlas and clears active quiz mode', await page.evaluate(() => window.__atlasGuard.calls === 2 && S.mode === null) && await page.locator('.v53-atlas').count() === 1 && await owner(page, 'library'));
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
      ok('house naming stays escaped and Library carries the due pill alone', await page.evaluate(() => document.querySelector('#nav-brennans').textContent === 'Brennan\'s <Reserve> & Restaurant' && !document.querySelector('#nav-brennans reserve') && Number.parseInt(document.querySelector('#nav-library .v32pill').textContent, 10) === 999 && document.querySelectorAll('nav.v32nav .v32pill').length === 1));
      for (const width of [320, 390]) {
        await page.setViewportSize({ width, height: 900 });
        for (const service of ['day', 'night']) {
          await page.evaluate(service => { OOT.service.set(service); render(); }, service);
          const layout = await page.evaluate(() => {
            const nav = document.querySelector('nav.v32nav'), buttons = [...nav.querySelectorAll('[data-nav]')];
            const rects = buttons.map(button => { const r = button.getBoundingClientRect(); return { id: button.dataset.nav, x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, scroll: button.scrollWidth, client: button.clientWidth }; });
            const mid = r => r.y + r.height / 2;
            return {
              service: document.documentElement.getAttribute('data-service'),
              fits: document.documentElement.scrollWidth <= innerWidth + 1 && nav.scrollWidth <= nav.clientWidth + 1,
              // Five words show whole; only the house's name may give way, with an ellipsis and its title.
              targets: rects.every(r => r.width >= 44 && r.height >= 44 && r.x >= -1 && r.right <= innerWidth + 1 && (r.id === 'brennans' || r.scroll <= r.client + 1)),
              house: (() => { const b = nav.querySelector('#nav-brennans'), cs = getComputedStyle(b); return b.title === b.textContent && (b.scrollWidth <= b.clientWidth + 1 || cs.textOverflow === 'ellipsis'); })(),
              // More retains its established inset margin, so compare row centres.
              row: rects.every(r => Math.abs(mid(r) - mid(rects[0])) < 1),
              order: rects.every((r, i) => i === 0 || r.x >= rects[i - 1].right - 1),
              rects
            };
          });
          if (!(layout.service === service && layout.fits && layout.targets && layout.house && layout.row && layout.order)) console.error('Navigation layout:', JSON.stringify(layout));
          ok(service + ' at ' + width + 'px: six readable 44px targets in one row, in order, with no overflow (a long house name gives way with an ellipsis and its title)', layout.service === service && layout.fits && layout.targets && layout.house && layout.row && layout.order);
          await page.locator('#nav-cms').click(); await view(page, 'cms');
          await page.locator('#nav-grapes').click(); await view(page, 'grapes');
          await libraryAtlas(page);
          await page.locator('.v53-atlas [data-go="worldmap"]').click(); await view(page, 'worldmap');
          ok(service + ' at ' + width + 'px: CMS, Grapes and Library stay usable, the atlas under Library', await owner(page, 'library') && await page.evaluate(() => !S.wmap));
        }
      }
    } finally {
      await page.evaluate(() => { v28House = window.__atlasNavOriginals.house; v32DueToday = window.__atlasNavOriginals.due; delete window.__atlasNavOriginals; render(); });
    }
    await page.setViewportSize({ width: 1360, height: 900 });
    ok('desktop keeps all six navigation targets visible and at least 44px', await page.locator('nav.v32nav [data-nav]').evaluateAll(nodes => nodes.length === 6 && nodes.every(node => { const r = node.getBoundingClientRect(); return r.width >= 44 && r.height >= 44 && r.x >= 0 && r.right <= innerWidth; })));
    await page.locator('#nav-library').focus(); await page.keyboard.press('Enter'); await view(page, 'library');
    await page.locator('.v53-atlas [data-go="worldmap"]').focus(); await page.keyboard.press('Enter');
    await view(page, 'worldmap');
    ok('the Library word and its atlas row remain keyboard operable', await owner(page, 'library') && await page.evaluate(() => S.view === 'worldmap' && !S.wmap));
    ok('no browser exceptions', errors.length === 0);
    console.log('check-atlas-nav: all ' + passed + ' checks pass');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
