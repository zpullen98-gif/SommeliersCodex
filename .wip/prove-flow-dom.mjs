/* The flow's DOM passes (codex54), proven in Chromium on the served source.

   The level page without codex36's illustrated door, the Library's regions
   door moved into The atlas and its search's placeholder, a quiz under
   codex12's list section named Our wine list on screen with its stored key
   unchanged, the bank and #/quizzes drawn, a drill's Back to the screen that
   started it, the Culinary Companion's Back to Wine studies; at 375 and
   390, with the console clean.

     CODEX_URL=http://127.0.0.1:<port>/codex/ PLAYWRIGHT_MODULE=... node .wip/prove-flow-dom.mjs

   Serve the source with .wip/serve.mjs (a shared root whose shared/ is
   WorldTable's static/shared). Work in progress, kept on codex54-wip. */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE);
const URL = process.env.CODEX_URL;
let passed = 0, failed = 0;
const check = (what, ok, detail) => { if (ok) { passed++; console.log('  ok    ' + what); } else { failed++; console.log('  FAIL  ' + what + (detail ? '  :: ' + String(detail).slice(0, 400) : '')); } };
const browser = await chromium.launch();
for (const width of [375, 390]) {
  console.log('--- ' + width + ' px ---');
  const ctx = await browser.newContext({ viewport: { width, height: 844 }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.route(/\/codex\/(index\.html)?(\?.*)?$/, async (r) => {
    const res = await r.fetch(); let html = await res.text();
    const at = html.indexOf('<script src="js/');
    html = html.slice(0, at) + '<script src="../shared/oot-house.js"></script><script src="../shared/oot-house-ui.js"></script>' + html.slice(at);
    await r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
  });
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction(() => typeof v28House === 'function' && v28House() && (v28House().wines || []).length > 200, null, { timeout: 30000 });
  const go = async (route) => { await page.evaluate((r) => v32Go(r, 'push'), route); await page.waitForTimeout(150); };
  const wide = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

  await go({ view: 'level' });
  const lvl = await page.evaluate(() => ({ door: document.querySelectorAll('#app .v36-level-door').length, search: !!document.querySelector('#v32-q'), atlas: document.querySelectorAll('#app [data-go="worldmap"]').length, shop: document.querySelectorAll('#app [data-go="techniques"]').length }));
  check('the level page: no illustrated door, no search box, no World Map row, the Workshop row kept', lvl.door === 0 && !lvl.search && lvl.atlas === 0 && lvl.shop === 1, JSON.stringify(lvl));
  check('the level page: no sideways scroll', await wide());

  await go({ view: 'library' });
  const lib = await page.evaluate(() => {
    const atlas = document.querySelector('.v53-atlas'), reading = document.querySelector('.v53-reading');
    const reg = document.querySelector('.v39-door-regions');
    const input = document.querySelector('#cf-in');
    return { inAtlas: !!(atlas && reg && atlas.contains(reg)), inReading: !!(reading && reg && reading.contains(reg)),
      order: atlas ? Array.from(atlas.querySelectorAll('h2, h3, .v25row-name')).map((n) => n.textContent.trim()) : [],
      ph: input ? input.placeholder : '', terroir: document.querySelectorAll('#app [data-go="terroir"]').length,
      line: (document.querySelector('.v53-library .v32-line') || {}).textContent || '' };
  });
  check('the Library: the regions door stands in The atlas, not the reading rooms', lib.inAtlas && !lib.inReading, JSON.stringify(lib.order));
  console.log('  The atlas: ' + lib.order.join(' | '));
  check('the Library: the search reads A chapter, a grape, a place, a producer or a subject', lib.ph === 'A chapter, a grape, a place, a producer or a subject', lib.ph);
  check('the Library: no Terroir row; the line is true', lib.terroir === 0 && /Practise and the question bank first, then the reading rooms and the atlas\./.test(lib.line), lib.line);
  await page.fill('#cf-in', 'pinot noir');
  await page.waitForTimeout(150);
  const hit = page.locator('#cf-in-out [data-v44-kind="route"][data-v44-arg="grape"]').first();
  check('the Library\'s search: a grape hit is a grape page', (await hit.count()) === 1);
  await hit.click(); await page.waitForTimeout(150);
  check('a grape hit opens the grape\'s page', await page.evaluate(() => S.view === 'grape' && /^#\/v\/grape\//.test(location.hash)), await page.evaluate(() => S.view + ' ' + location.hash));
  await page.click('#v32-back'); await page.waitForTimeout(150);
  await page.fill('#cf-in', 'bordeaux'); await page.waitForTimeout(150);
  check('the Library\'s search: the Court’s subjects group answers bordeaux', (await page.locator('#v44-group-subjects').count()) === 1);
  check('the Library: no sideways scroll', await wide());

  await go({ view: 'quizzes' });
  const qz = await page.evaluate(() => ({ h: (document.querySelector('#app h2') || {}).textContent, view: S.view, hash: location.hash, word: v25NavWord(), lifted: !!document.querySelector('.v54-lifted') }));
  check('#/quizzes draws the bank under its own address', qz.view === 'quizzes' && /question bank$/.test(qz.h) && qz.lifted && qz.hash.indexOf('#/quizzes') === 0, JSON.stringify(qz));
  await page.click('#v32-back'); await page.waitForTimeout(150);
  check('Back from #/quizzes reaches the Library', await page.evaluate(() => S.view === 'library'), await page.evaluate(() => S.view));

  await go({ view: 'bank' });
  await page.locator('#app .v53-trains button').first().click(); await page.waitForTimeout(200);
  const drill = await page.evaluate(() => ({ view: S.view, parent: JSON.stringify(v32ParentRoute()) }));
  check('a drill started from the bank climbs to the bank', drill.view === 'quiz' && drill.parent === '{"view":"bank"}', JSON.stringify(drill));
  await page.evaluate(() => { V32.d = 0; }); await page.click('#v32-back'); await page.waitForTimeout(200);
  check('Back with no history from that drill draws the bank', await page.evaluate(() => S.view === 'bank'), await page.evaluate(() => S.view));

  const list = await page.evaluate(() => {
    if (typeof startCellarDrill !== 'function') return { skip: true };
    ST.cellar = (ST.cellar || []).concat([{ id: 'prove-own', name: 'Prove sentinel', producer: 'Own wine', region: 'Test place', grapes: 'Chardonnay', glass: '14' }]);
    try { startCellarDrill(); } catch (e) { return { err: e.message }; }
    const t = document.querySelector('#app').innerText;
    return { view: S.view, section: S.section, old: /Our List/.test(t), now: /Our wine list/.test(t) };
  });
  check('a quiz under codex12\'s list section reads Our wine list on screen, its key unchanged', (list.view === 'quiz' && list.section === 'Our List' && !list.old && list.now), JSON.stringify(list));
  await page.evaluate(() => { ST.cellar = ST.cellar.filter((w) => w.id !== 'prove-own'); S.view = 'home'; render(); });

  await go({ view: 'housestudies' });
  await go({ view: 'culinary' });
  await page.evaluate(() => { V32.d = 0; }); await page.click('#v32-back'); await page.waitForTimeout(200);
  check('Back from the Culinary Companion with no history reaches Wine studies', await page.evaluate(() => S.view === 'housestudies'), await page.evaluate(() => S.view));
  const word = await page.evaluate(() => { S.view = 'culinary'; return v25NavWord(); });
  check('the Culinary Companion lights the house', word === 'brennans', word);

  await go({ view: 'houserehearsal' });
  const reh = await page.evaluate(() => ({ revisit: !!document.querySelector('#v53-housedue .v25row-name'), note: /Due today follows/.test(document.querySelector('#app').innerText), sw: document.documentElement.scrollWidth <= window.innerWidth }));
  check('Service rehearsal: Wine cards to revisit drawn as a row, the schedule note gone, no sideways scroll', reh.revisit && !reh.note && reh.sw, JSON.stringify(reh));
  await go({ view: 'grapes' });
  check('Grapes: no sideways scroll', await wide());
  check('console clean at ' + width, errs.length === 0, errs.slice(0, 3).join(' | '));
  await ctx.close();
}
await browser.close();
console.log('');
console.log('prove-flow-dom: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
