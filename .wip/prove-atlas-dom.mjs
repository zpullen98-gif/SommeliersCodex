/* prove-atlas-dom.mjs: the Wine Atlas tab and More's Library (codex55) in Chromium on the served source. Work in progress.

   At 375 and 390 px, night and day, each in an isolated profile: the bar on one row, six words in order, every
   tab at least 44 px, every word whole, the due pill on More alone, the widths printed; Wine Atlas opens the root
   lit Wine Atlas, with its chips, seventeen sheet doors and 115 region rows, their counts filled once the readings
   land; More opens with The Library and its Practise row opens the Library at its heading, lit More, Back
   returning to More; Burgundy, Napa and Sonoma and Rioja with the inline map loaded, a district tapped and its mark
   standing on the point the artwork draws, its button pressed and the mark said aloud; France with its sheet
   inline; every control of those pages at least 44 px; no sideways scroll; a clean console.

     PLAYWRIGHT_MODULE=... SITE_ROOT=<a root whose shared/ is WorldTable's static/shared> node .wip/prove-atlas-dom.mjs [width] [night|day]

   CODEX_URL names a server already running; without it the proof starts .wip/serve.mjs on a free port and stops it. */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ONLY_W = Number(process.argv[2]) || 0;
const ONLY_M = process.argv[3] || '';

let server = null;
const freePort = () => new Promise((res) => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)); }); });
async function startServer() {
  const port = await freePort();
  server = spawn(process.execPath, [path.join(HERE, 'serve.mjs'), String(port)], { env: process.env, stdio: ['ignore', 'pipe', 'inherit'] });
  await new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('serve.mjs did not start')), 15000);
    server.stdout.on('data', (b) => { if (/serve: http/.test(String(b))) { clearTimeout(t); res(); } });
    server.on('exit', (c) => rej(new Error('serve.mjs exited ' + c)));
  });
  return 'http://127.0.0.1:' + port + '/codex/';
}
const stopServer = () => { if (server && server.exitCode === null) { try { server.kill('SIGTERM'); } catch (e) { } } };
process.on('exit', stopServer);
process.on('SIGINT', () => { stopServer(); process.exit(130); });
const BASE = (process.env.CODEX_URL || await startServer()).replace(/\/?$/, '/');

const totals = [];
const widths = [];
async function prove(browser, width, mode) {
  let ok = 0, bad = 0;
  const check = (what, pass, detail) => {
    if (pass) { ok++; console.log('  ok    ' + what); }
    else { bad++; console.log('  FAIL  ' + what + (detail ? '  :: ' + String(detail).slice(0, 600) : '')); }
  };
  const step = async (name, fn) => { try { await fn(); } catch (e) { check(name + ' (ran to its end)', false, String(e.message).split('\n')[0]); } };
  console.log('--- ' + width + ' px, ' + mode + ' ---');
  const ctx = await browser.newContext({ viewport: { width, height: 844 }, serviceWorkers: 'block', timezoneId: 'America/New_York' });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  page.on('dialog', (d) => d.accept());
  const settle = (ms) => page.waitForTimeout(ms || 250);
  const boot = async (hash) => {
    await page.goto(BASE + '?nosw' + (hash || ''), { waitUntil: 'load' });
    await page.waitForFunction(() => typeof V32 !== 'undefined' && V32.booted && typeof v32HasHouse === 'function' && v32HasHouse(), null, { timeout: 30000 });
    await page.evaluate((m) => { if (typeof v25Choose === 'function') v25Choose(); applyLevel('certified', true); if (typeof OOT !== 'undefined' && OOT.service && OOT.service.set) OOT.service.set(m); render(); }, mode);
    await settle(400);
  };
  const lit = () => page.evaluate(() => { const n = document.querySelectorAll('nav.v32nav [aria-current="page"]'); return n.length === 1 ? n[0].getAttribute('data-nav') : 'none:' + n.length; });
  const wide = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  const small = () => page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.wrap button, .wrap a[href], .wrap summary, .wrap input:not([type=hidden]), .wrap select, nav.v32nav [data-nav], #v32-back').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') return;
      if (el.closest('p, li, dd, td') && cs.display === 'inline' && el.tagName === 'A') return;
      if (r.height < 43.5 || r.width < 43.5) out.push((el.id ? '#' + el.id : el.tagName.toLowerCase() + '.' + String(el.className).split(' ').join('.')) + ' "' + (el.textContent || el.value || '').trim().slice(0, 30) + '" ' + Math.round(r.width) + 'x' + Math.round(r.height));
    });
    return out;
  });
  const screen = async (name) => {
    const s = await small();
    check(name + ': every control at least 44 px', s.length === 0, s.slice(0, 6).join('; '));
    check(name + ': no sideways scroll', await wide());
  };

  await boot('#/');
  check('the service is ' + mode, (await page.evaluate(() => document.documentElement.getAttribute('data-service'))) === mode);

  /* the bar */
  await step('the bar', async () => {
    const lay = await page.evaluate(() => {
      const nav = document.querySelector('nav.v32nav');
      const rects = [...nav.querySelectorAll('[data-nav]')].map((b) => { const r = b.getBoundingClientRect(); return { id: b.dataset.nav, text: b.firstChild ? b.firstChild.textContent.trim() : '', w: r.width, h: r.height, mid: r.y + r.height / 2, right: r.right, whole: b.scrollWidth <= b.clientWidth + 1 }; });
      const pills = [...nav.querySelectorAll('.v32pill')].map((p) => p.closest('[data-nav]').dataset.nav);
      return { rects, pills, due: v32DueToday().total, row: rects.every((r) => Math.abs(r.mid - rects[0].mid) < 1), big: rects.every((r) => r.w >= 44 && r.h >= 44), whole: rects.every((r) => r.whole), fit: rects.every((r) => r.right <= innerWidth + 1) && nav.scrollWidth <= nav.clientWidth + 1, v47: !!document.querySelector('.v47nav') };
    });
    const words = lay.rects.map((r) => r.id).join(',');
    widths.push(width + ' ' + mode + ': ' + lay.rects.map((r) => r.text + ' ' + r.w.toFixed(1)).join(', ') + ' (pill ' + lay.due + ' on ' + lay.pills.join(',') + ')');
    console.log('    widths: ' + lay.rects.map((r) => r.text + ' ' + r.w.toFixed(1) + 'x' + r.h.toFixed(0)).join(', '));
    check('the bar: Home, the house, CMS, Grapes, Wine Atlas and More in order, no v47nav class', words === 'home,brennans,cms,grapes,worldmap,more' && lay.rects[4].text === 'Wine Atlas' && !lay.v47, words);
    check('the bar: one row, every tab at least 44 px, every word whole, inside the screen', lay.row && lay.big && lay.whole && lay.fit, JSON.stringify(lay.rects.map((r) => [r.id, Math.round(r.w), Math.round(r.h), r.whole])));
    check('the due pill rides on More alone', lay.due ? (lay.pills.length === 1 && lay.pills[0] === 'more') : lay.pills.length === 0, JSON.stringify(lay.pills));
  });

  /* the Wine Atlas root */
  await step('the root', async () => {
    await page.click('#nav-worldmap');
    await page.waitForFunction(() => S.view === 'worldmap' && !S.wmap && document.querySelector('#v55-hub'));
    await page.waitForFunction(() => v55Regions().every((a) => v39RecReady(a)), null, { timeout: 30000 });
    await settle(300);
    const hub = await page.evaluate(() => ({
      hash: location.hash, chips: document.querySelectorAll('.v55-chips .v28-chip').length, sheets: document.querySelectorAll('#v55-hub [data-v39="openmap"]').length,
      regions: document.querySelectorAll('#v55-hub .v55-regions [data-v39="region"]').length,
      counted: [...document.querySelectorAll('#v55-hub [data-v55-count]')].filter((n) => /districts? · \d+ on its field map$/.test(n.textContent)).length
    }));
    check('Wine Atlas opens the root (#/v/worldmap), lit Wine Atlas', hub.hash === '#/v/worldmap' && (await lit()) === 'worldmap', hub.hash);
    check('the root: five chips, seventeen sheet doors, 115 region rows, every count filled once the readings land', hub.chips === 5 && hub.sheets === 17 && hub.regions === 115 && hub.counted === 115, JSON.stringify(hub));
    await page.fill('#v55-find', 'chablis');
    await settle(150);
    const found = await page.evaluate(() => [...document.querySelectorAll('#v55-hub .v55-regions li[data-v55-slug]')].filter((li) => !li.hidden).map((li) => li.getAttribute('data-v55-slug')));
    check('the search finds a district: Chablis finds Burgundy', found.length === 1 && found[0] === 'burgundy', JSON.stringify(found));
    await page.fill('#v55-find', '');
    await settle(150);
    await screen('the root');
  });

  /* More and its Library */
  await step('More', async () => {
    await page.click('#nav-more');
    await page.waitForFunction(() => S.view === 'more');
    const first = await page.evaluate(() => { const g = document.querySelector('#view .v32-group'); return g ? { lib: g.classList.contains('v55-libgroup'), rows: [...g.querySelectorAll('.v25row-name')].map((n) => n.textContent) } : null; });
    check('More opens with The Library: Practise, The question bank, The reading rooms', first && first.lib && first.rows.join(',') === 'Practise,The question bank,The reading rooms', JSON.stringify(first));
    check('More is lit More', (await lit()) === 'more');
    await page.click('#v55-lib-reading');
    await page.waitForFunction(() => S.view === 'library');
    await settle(300);
    const at = await page.evaluate(() => { const h = document.getElementById('v53-reading-h'); const r = h.getBoundingClientRect(); return { top: r.top, focus: document.activeElement === h, atlas: !!document.querySelector('.v53-atlas, .v39-door-regions, #view .v45-door, [data-to="v53-atlas-h"]') }; });
    check('The reading rooms opens the Library at its heading (at the top, focused), lit More, with no atlas section or door', at.top >= 0 && at.top < 200 && at.focus && !at.atlas && (await lit()) === 'more', JSON.stringify(at));
    await screen('the Library');
    await page.click('#v32-back');
    await page.waitForFunction(() => S.view === 'more');
    check('Back returns to More', (await lit()) === 'more');
  });

  /* three regions: the map, a district tapped, its mark on its point */
  for (const [slug, place] of [['burgundy', 'Meursault'], ['napa-sonoma', 'Napa'], ['rioja', 'Haro']]) {
    await step(slug, async () => {
      await page.evaluate((s) => v32Go({ view: 'region', arg: s }, 'push'), slug);
      await page.waitForFunction((s) => S.view === 'region' && S._v39region === s && v39RecReady(v39Find(s)) && document.querySelector('.v55-districts .v55-dlist'), slug, { timeout: 30000 });
      await page.waitForFunction(() => { const i = document.querySelector('.v55-mapfig img'); return i && i.complete && i.naturalWidth > 0; }, null, { timeout: 30000 });
      await settle(300);
      check(slug + ': lit Wine Atlas, the inline map loaded above The districts', (await lit()) === 'worldmap' && await page.evaluate(() => document.querySelector('.v55-map').compareDocumentPosition(document.querySelector('.v55-districts')) === Node.DOCUMENT_POSITION_FOLLOWING));
      const name = await page.evaluate((p) => { const b = [...document.querySelectorAll('[data-v55="pin"]')].find((x) => x.getAttribute('data-name') === p) || document.querySelector('.v55-districts .v55-dlist:not(.v55-also) [data-v55="pin"]'); return b ? b.getAttribute('data-name') : ''; }, place);
      const btn = page.locator('[data-v55="pin"][data-name="' + name + '"]').first();
      await btn.scrollIntoViewIfNeeded();
      await btn.click();
      await settle(350);
      const mark = await page.evaluate(() => {
        const pin = document.querySelector('.v55-pin'), ring = pin.querySelector('.v55-pin-ring').getBoundingClientRect();
        const img = document.querySelector('.v55-mapfig img').getBoundingClientRect();
        const b = document.querySelector('[data-v55="pin"][aria-pressed="true"]');
        const s = Math.min(img.width / 1200, img.height / 1500);
        const want = [img.left + (img.width - 1200 * s) / 2 + Number(b.getAttribute('data-x')) * s, img.top + (img.height - 1500 * s) / 2 + Number(b.getAttribute('data-y')) * s];
        const got = [ring.left + ring.width / 2, ring.top + ring.height / 2];
        return { hidden: pin.hidden, tag: pin.textContent, off: Math.hypot(got[0] - want[0], got[1] - want[1]), inView: ring.top >= 0 && ring.bottom <= innerHeight, said: document.getElementById('v55-pin-said').textContent, pressed: document.querySelectorAll('[data-v55="pin"][aria-pressed="true"]').length, here: !!b.closest('.v55-d.v55-here') };
      });
      check(slug + ': a tap on ' + name + ' marks its point on the map (' + mark.off.toFixed(2) + ' px from the dot), in view, its button pressed and the mark said', !mark.hidden && mark.off < 1.5 && mark.inView && mark.pressed === 1 && mark.here && mark.said.indexOf(name) === 0 && mark.tag.indexOf(name) > 0, JSON.stringify(mark));
      await screen(slug);
    });
  }

  /* France: its sheet inline */
  await step('france', async () => {
    await page.evaluate(() => v32Go({ view: 'country', arg: 'france' }, 'push'));
    await page.waitForFunction(() => S.view === 'country' && v39RecReady(v39CountryOf('france')) && document.querySelector('.v55-sheetfig img'));
    await settle(300);
    const fr = await page.evaluate(() => ({ rows: document.querySelectorAll('.v55-cregions [data-v39="region"]').length, counts: [...document.querySelectorAll('.v55-cregions [data-v55-count]')].filter((n) => /districts?/.test(n.textContent)).length, door: !!document.querySelector('#view .v45-door') }));
    check('france: its sheet inline, its nine regions as rows with their counts, lit Wine Atlas, codex45\'s door taken off', fr.rows === 9 && fr.counts === 9 && !fr.door && (await lit()) === 'worldmap', JSON.stringify(fr));
    await screen('france');
  });

  check('a clean console', errs.length === 0, errs.slice(0, 5).join(' | '));
  await ctx.close();
  totals.push([width + ' ' + mode, ok, bad]);
}

const browser = await chromium.launch();
try {
  for (const width of [375, 390]) {
    if (ONLY_W && width !== ONLY_W) continue;
    for (const mode of ['night', 'day']) {
      if (ONLY_M && mode !== ONLY_M) continue;
      await prove(browser, width, mode);
    }
  }
} finally { await browser.close(); stopServer(); }
console.log('');
console.log('widths:');
widths.forEach((w) => console.log('  ' + w));
const fails = totals.reduce((t, x) => t + x[2], 0), oks = totals.reduce((t, x) => t + x[1], 0);
totals.forEach((t) => console.log('  ' + t[0] + ': ' + t[1] + ' ok, ' + t[2] + ' failed'));
console.log(fails ? 'prove-atlas-dom: ' + fails + ' of ' + (oks + fails) + ' checks FAILED' : 'prove-atlas-dom: all ' + oks + ' checks passed');
process.exit(fails ? 1 : 0);
