#!/usr/bin/env node
/* The atlas in the final shipped navigation chain, in an isolated browser profile (the Wine Atlas tab and More's
   Library, codex55, 2 November 2026; first written for codex47's Wine Atlas tab, moved for codex53's six words).

   The contract since codex55: six words in one row, Home, the house's name, CMS, Grapes, Wine Atlas and More, the
   bar nav.v32nav without codex47's v47nav class, the due pill on More alone (Practise lives under More, in the
   Library). The atlas (the Wine Atlas root, the country sheets, the country and region readings, the field atlas
   and the field maps) is the Wine Atlas tab's again: it is entered through its word, every atlas screen and a
   region's deck and drill light Wine Atlas, and a cold Back climbs through the root to Home. The Library is
   More's: More opens with its group, the Library lights More and climbs to it. The route walk (the root, a
   sheet, country, region, field map, deck, drill), the cold Back table, the leave guard and the keyboard checks
   are codex47's, moved to the owners codex55 gives them.

   One layer on (codex56, the Wine Atlas made a course, 2 November 2026): the root opens on Start here or Continue
   and the study doors, its Field maps chip gone; the field atlas and the regions index draw as the root and a field
   map as its region page (a country's map as its country page), so a cold Back climbs a country, the root and Home;
   the region page carries the map's own field notes and its offline copy where its door to the field map stood, and
   its study row holds Flash and Drill; the map quiz's chooser lists every field map; the Workshop opened from the
   root lights Wine Atlas and climbs back to it. codex56's own addresses (the course, a map quiz, compare) climb cold
   to the root.

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
const WORDS = 'home,brennans,cms,grapes,worldmap,more';
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
      await target.waitForFunction(() => typeof _v55NavHtml === 'function' && V32.booted && document.querySelector('nav.v32nav [data-nav="worldmap"]'));
    }
    async function view(target, name) { await target.waitForFunction(name => S.view === name, name); }
    async function owner(target, word) {
      return target.locator('nav.v32nav [aria-current="page"]').evaluateAll((nodes, word) => nodes.length === 1 && nodes[0].getAttribute('data-nav') === word, word);
    }
    async function back(target, expected) { await target.locator('#v32-back').click(); await view(target, expected); }
    async function regionalReady(target, slug) {
      await target.waitForFunction(slug => S.view === 'region' && S._v39region === slug && v39RecReady(v39Find(slug)) && !document.querySelector('#v39-wait'), slug);
    }
    async function atlasRoot(target) {
      await target.locator('#nav-worldmap').click(); await view(target, 'worldmap');
      await target.waitForFunction(() => !S.wmap && document.querySelector('#v55-hub'));
    }

    await boot(page, '#/');
    await page.waitForFunction(() => v32HasHouse());
    const saved = await page.evaluate(() => localStorage.getItem('codexStats'));
    ok('six destinations in their order, Home, the house, CMS, Grapes, Wine Atlas and More, with no Library word', await page.locator('nav.v32nav [data-nav]').evaluateAll((nodes, words) => nodes.map(n => n.dataset.nav).join(',') === words, WORDS)
      && await page.locator('#nav-worldmap').textContent() === 'Wine Atlas' && await page.locator('#nav-library').count() === 0);
    ok('the bar is nav.v32nav without codex47\'s v47nav class', await page.locator('nav.v32nav').count() === 1 && await page.locator('nav.v47nav, .v47nav').count() === 0);
    ok('existing house name and the due count on More are preserved, and no other word carries the pill', await page.evaluate(() => {
      const pill = document.querySelector('#nav-more .v32pill'), due = v32DueToday().total;
      return document.querySelector('#nav-brennans').textContent === v41TabWord()
        && (due ? !!pill && Number.parseInt(pill.textContent, 10) === due : !pill)
        && document.querySelectorAll('nav.v32nav .v32pill').length === (due ? 1 : 0);
    }));

    /* the atlas through its own word */
    await atlasRoot(page);
    ok('the Wine Atlas word opens the root (#/v/worldmap), Wine Atlas lit, with Start here or Continue, the five study doors, the seventeen sheets and the Workshop (codex56: no Field maps chip)', await page.evaluate(() => location.hash === '#/v/worldmap') && await owner(page, 'worldmap')
      && await page.locator('#v55-hub #v56-continue[data-v56="course"]').count() === 1 && await page.locator('#v55-hub .v56-studydoors .v25row').count() === 5
      && await page.locator('#v55-hub [data-v39="openmap"][data-sheet]').count() === 17 && await page.locator('#v55-chip-fields, #v55-hub [data-go="fieldatlas"]').count() === 0 && await page.locator('#v55-chip-techniques[data-go="techniques"]').count() === 1);
    const rootDepth = await page.evaluate(() => ({ depth: V32.d, length: history.length }));
    await page.locator('#nav-worldmap').click();
    ok('tapping the lit Wine Atlas word on its root does not add a history entry', await page.evaluate(before => S.view === 'worldmap' && !S.wmap && V32.d === before.depth && history.length === before.length, rootDepth));
    await page.locator('#v55-sheet-france').click();
    await page.waitForFunction(() => S.view === 'worldmap' && S.wmap === 'france');
    ok('a sheet door opens codex31\'s country sheet, Wine Atlas lit', await owner(page, 'worldmap') && await page.locator('.v31-sheet').count() >= 1);
    await atlasRoot(page);
    ok('the Wine Atlas word returns from a country sheet to the root', await owner(page, 'worldmap') && await page.locator('#v55-hub').count() === 1);
    await back(page, 'worldmap');
    await page.waitForFunction(() => S.wmap === 'france');
    ok('warm Back restores the country sheet after rerooting', await owner(page, 'worldmap'));
    await back(page, 'worldmap');
    await page.waitForFunction(() => !S.wmap && document.querySelector('#v55-hub'));
    await page.locator('#v55-c-france').click(); await view(page, 'country');
    ok('the root\'s country door opens the country reading, Wine Atlas lit', await owner(page, 'worldmap') && await page.evaluate(() => S._v39country === 'france'));
    await page.locator('.v39-country [data-v39="region"][data-slug="champagne"]').click(); await regionalReady(page, 'champagne');
    ok('country readings lead to the complete regional lesson, its map inline, Wine Atlas lit', await owner(page, 'worldmap') && await page.locator('.v39-article .v39-sections details').count() >= 3 && await page.locator('.v39-article .v39-sources a').count() >= 1
      && await page.locator('.v55-map .v45-figure').count() === 1 && await page.locator('.v55-districts').count() === 1);
    /* codex56: the field map screen is this page now; the map's own field notes and its offline copy stand where its door stood */
    ok('the regional lesson carries the field map\'s own notes and its offline copy, with no door to the folded field map screen', await owner(page, 'worldmap') && await page.locator('[data-v45="map"][data-v45-arg="champagne"]').count() === 0
      && await page.locator('.v55-map details.v56-fieldnotes .v45-studies').count() === 1 && await page.locator('.v55-map details.v56-fieldnotes').evaluate(node => node.textContent.length > 1000)
      && await page.locator('.v55-map [data-v45="keep"][data-v45-arg="champagne"], .v55-map .v45-storage').count() >= 1);
    const fieldDepth = await page.evaluate(() => V32.d);
    await page.evaluate(() => v45Go('champagne')); await regionalReady(page, 'champagne');
    ok('codex45\'s door to the field map opens the regional reading itself, Wine Atlas lit', await owner(page, 'worldmap') && await page.evaluate(() => location.hash === '#/v/region/champagne'));
    await back(page, 'region');
    ok('warm Back returns to the regional reading it was opened from', await page.evaluate(depth => S._v39region === 'champagne' && V32.d === depth, fieldDepth) && await owner(page, 'worldmap'));
    await page.locator('#v56-s-flash').click(); await page.waitForFunction(() => S._v32run && S._v32run.deckId === 'region:champagne');
    ok('the study row\'s Flash deals the existing regional cards, Wine Atlas lit', await owner(page, 'worldmap'));
    await back(page, 'region');
    await atlasRoot(page);
    await page.locator('#v56-mapquiz').click(); await view(page, 'v56mapquiz');
    ok('the map quiz\'s chooser lists every field map (129) and belongs to Wine Atlas', await owner(page, 'worldmap') && await page.locator('#v56-quizpick [data-go="v56mapquiz"][data-arg]').count() === 129);
    await back(page, 'worldmap');
    ok('warm Back returns from the map quiz\'s chooser to the root', await page.evaluate(() => !S.wmap) && await page.locator('#v55-hub').count() === 1 && await owner(page, 'worldmap'));
    await page.locator('#v55-chip-techniques').click(); await view(page, 'techniques');
    ok('Workshop chip opens all 43 lessons, lit Wine Atlas (codex56: the Workshop opened from the atlas is the atlas\'s)', await owner(page, 'worldmap') && await page.locator('.v46-group li').count() === 43);
    await back(page, 'worldmap');
    ok('warm Back returns from the Workshop to its atlas entrance', await owner(page, 'worldmap') && await page.locator('#v55-chip-techniques').count() === 1);
    ok('navigation and reading do not invent study marks', await page.evaluate(() => localStorage.getItem('codexStats')) === saved);

    /* the Library is More's */
    await page.locator('#nav-more').click(); await view(page, 'more');
    ok('More opens with The Library: Practise, The question bank and The reading rooms, More lit', await owner(page, 'more')
      && await page.locator('.v55-libgroup [data-go="v55lib"]').evaluateAll(nodes => nodes.map(n => n.querySelector('.v25row-name').textContent).join('|') === 'Practise|The question bank|The reading rooms'));
    await page.locator('#v55-lib-bank').click(); await view(page, 'library');
    ok('a Library row opens the Library (#/library), More lit, with no atlas section', await owner(page, 'more') && await page.evaluate(() => /^#\/library/.test(location.hash)) && await page.locator('.v53-atlas, [data-to="v53-atlas-h"]').count() === 0);
    await back(page, 'more');
    ok('Back from the Library returns to More', await owner(page, 'more'));

    // Separate pages establish genuine cold addresses with no in-app history.
    const coldRoutes = [
      { route: '#/v/worldmap', initial: 'worldmap', parents: ['home'] },
      { route: '#/v/worldmap/france', initial: 'worldmap', parents: ['worldmap', 'home'] },
      { route: '#/v/regions', initial: 'worldmap', parents: ['home'] },
      { route: '#/v/country/france', initial: 'country', parents: ['worldmap', 'home'] },
      { route: '#/v/region/champagne', initial: 'region', parents: ['country', 'worldmap', 'home'] },
      { route: '#/v/fieldatlas', initial: 'worldmap', parents: ['home'] },
      { route: '#/v/fieldmap/champagne', initial: 'region', parents: ['country', 'worldmap', 'home'] },
      { route: '#/v/v56course', initial: 'v56course', parents: ['worldmap', 'home'] },
      { route: '#/v/v56mapquiz/champagne', initial: 'v56mapquiz', parents: ['region', 'country', 'worldmap', 'home'] },
      { route: '#/v/v56compare/champagne~burgundy', initial: 'v56compare', parents: ['region', 'country', 'worldmap', 'home'] },
      { route: '#/library', initial: 'library', parents: ['more', 'home'], lit: 'more' }
    ];
    for (const test of coldRoutes) {
      const cold = watch(await ctx.newPage());
      const lit = test.lit || 'worldmap';
      await boot(cold, test.route); await view(cold, test.initial);
      assert.ok(await owner(cold, lit), test.route + ' initial owner');
      for (const parent of test.parents) {
        await back(cold, parent);
        assert.ok(await owner(cold, parent === 'home' ? 'home' : lit), test.route + ' parent owner: ' + parent);
        if (parent === 'worldmap') assert.ok(await cold.evaluate(() => !S.wmap && !!document.querySelector('#v55-hub')), test.route + ' cold parent is the root');
        if (parent === 'country') assert.equal(await cold.evaluate(() => S._v39country), 'france');
      }
      ok('cold Back hierarchy: ' + test.route + ' climbs ' + test.parents.join(', '), true);
      await cold.close();
    }

    await boot(page, '#/v/fieldmap/champagne'); await regionalReady(page, 'champagne');
    await page.locator('#v56-s-drill').click(); await view(page, 'quiz');
    ok('regional questions still open a real quiz, Wine Atlas lit', await owner(page, 'worldmap') && await page.evaluate(() => S.pool.length > 0 && S.mode === 'drill'));
    // An injected hook isolates the existing optional guard contract, without
    // pretending that ordinary drills themselves display a confirmation dialog.
    const quizBefore = await page.evaluate(() => {
      window.__atlasGuard = { original: typeof leaveSitting === 'function' ? leaveSitting : null, calls: 0 };
      window.leaveSitting = function () { window.__atlasGuard.calls++; return false; };
      return JSON.stringify({ view: S.view, mode: S.mode, idx: S.idx, ids: S.pool.map(q => q.id), answered: S.answered, results: S.results, correct: S.correct, hash: location.hash, depth: V32.d, stats: localStorage.getItem('codexStats') });
    });
    try {
      await page.locator('#nav-worldmap').click();
      ok('the Wine Atlas word honours a cancelled optional leave guard without changing the live quiz', await page.evaluate(before => window.__atlasGuard.calls === 1 && before === JSON.stringify({ view: S.view, mode: S.mode, idx: S.idx, ids: S.pool.map(q => q.id), answered: S.answered, results: S.results, correct: S.correct, hash: location.hash, depth: V32.d, stats: localStorage.getItem('codexStats') }), quizBefore) && await owner(page, 'worldmap'));
      await page.evaluate(() => { window.leaveSitting = function () { window.__atlasGuard.calls++; return true; }; });
      await page.locator('#nav-worldmap').click(); await view(page, 'worldmap');
      ok('accepted leave guard opens the Wine Atlas root and clears active quiz mode', await page.evaluate(() => window.__atlasGuard.calls === 2 && S.mode === null && !S.wmap) && await page.locator('#v55-hub').count() === 1 && await owner(page, 'worldmap'));
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
      ok('house naming stays escaped and More carries the due pill alone', await page.evaluate(() => document.querySelector('#nav-brennans').textContent === 'Brennan\'s <Reserve> & Restaurant' && !document.querySelector('#nav-brennans reserve') && Number.parseInt(document.querySelector('#nav-more .v32pill').textContent, 10) === 999 && document.querySelectorAll('nav.v32nav .v32pill').length === 1));
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
          await atlasRoot(page);
          ok(service + ' at ' + width + 'px: CMS, Grapes and Wine Atlas stay usable, the Wine Atlas word opening its root', await owner(page, 'worldmap') && await page.evaluate(() => !S.wmap));
        }
      }
    } finally {
      await page.evaluate(() => { v28House = window.__atlasNavOriginals.house; v32DueToday = window.__atlasNavOriginals.due; delete window.__atlasNavOriginals; render(); });
    }
    await page.setViewportSize({ width: 1360, height: 900 });
    ok('desktop keeps all six navigation targets visible and at least 44px', await page.locator('nav.v32nav [data-nav]').evaluateAll(nodes => nodes.length === 6 && nodes.every(node => { const r = node.getBoundingClientRect(); return r.width >= 44 && r.height >= 44 && r.x >= 0 && r.right <= innerWidth; })));
    await page.locator('#nav-more').focus(); await page.keyboard.press('Enter'); await view(page, 'more');
    await page.locator('#nav-worldmap').focus(); await page.keyboard.press('Enter'); await view(page, 'worldmap');
    await page.waitForFunction(() => !S.wmap && document.querySelector('#v55-hub'));
    await page.locator('#v55-r-champagne').focus(); await page.keyboard.press('Enter');
    await regionalReady(page, 'champagne');
    ok('the More and Wine Atlas words and a region row on the root remain keyboard operable', await owner(page, 'worldmap'));
    ok('no browser exceptions', errors.length === 0);
    console.log('check-atlas-nav: all ' + passed + ' checks pass');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
