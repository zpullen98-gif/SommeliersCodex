/* walk-grapes.mjs: the phone walk of the Grapes tab at the table (codex57, 9 November 2026), in Chromium on the
   served source, on walk54's harness and environment.

   At 375 and 390 px, day and night, each in an isolated profile with the house's pack: the Grapes root (every one
   of the 75 rows with its line, the 55 outside the Court's twenty with the table's glass lead; At the table with
   its four doors; the filter by white, red and On our list, the line that says what shows and Show all grapes);
   Chardonnay and Cabernet Sauvignon (At the table first, the forty-five second line at 20 px in the house reading
   face over the sale under its gold rule, the ten and the twenty at 16 px; the Old World and the New World as two
   cards one under the other, with why, blur and the blind call; a house wine opened from On our list and Back to the
   grape with the list still open); Meunier reached from a house wine's grape door, and Back to the card; Glera, a
   thin grape filled from the table; Old World and New World with a round of the call drill played through to the
   score, Back to the index and to the root; Compare two grapes chosen and drawn side by side; Present it, the line
   shown and marked said, due tomorrow; a table card graded Got it, due tomorrow, and Back to the grape where the
   card reads Due tomorrow; cold reloads of a grape page and of each view, Back climbing to Home. Every screen: each
   control at least 44 px (inline links in running text aside), no sideways scroll; a clean console at the end.
   At 390 px, day and night, it saves the top of Chardonnay, its side by side, the root, Meunier, Glera and each
   view under SHOTS (default the session's scratchpad grapes57/shots/gates).

     PLAYWRIGHT_MODULE=... OOT_HOUSE_PACK=... SITE_ROOT=... node .wip/walk-grapes.mjs [width] [day|night]

   CODEX_URL names a server already running; without it the walk starts .wip/serve.mjs on a free port and stops it.
   Work in progress, kept on codex57-wip. */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ONLY_W = Number(process.argv[2]) || 0;
const ONLY_M = process.argv[3] || '';
const SHOTS = process.env.SHOTS || '/tmp/claude-0/-home-user-zpullen98-gif-github-io/09201eae-82ec-5cba-9316-4d6cf5955e5e/scratchpad/grapes57/shots/gates';
fs.mkdirSync(SHOTS, { recursive: true });

const packText = fs.readFileSync(process.env.OOT_HOUSE_PACK, 'utf8');

/* the server */
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
const shots = [];

async function walk(browser, width, mode) {
  let ok = 0, bad = 0;
  const fails = [];
  const check = (what, pass, detail) => {
    if (pass) { ok++; console.log('  ok    ' + what); }
    else { bad++; fails.push(what); console.log('  FAIL  ' + what + (detail ? '  :: ' + String(detail).slice(0, 500) : '')); }
  };
  const step = async (name, fn) => { try { await fn(); } catch (e) { check(name + ' (ran to its end)', false, String(e.message).split('\n')[0]); } };
  console.log('--- ' + width + ' px, ' + mode + ' ---');
  const ctx = await browser.newContext({ viewport: { width, height: 844 }, serviceWorkers: 'block', timezoneId: 'America/New_York' });
  await ctx.route(/\/shared\/packs\/brennans-new-orleans\.v1\.oothouse\.json/, (r) => r.fulfill({ status: 200, contentType: 'application/json; charset=utf-8', body: packText }));
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  page.on('dialog', (d) => d.accept());
  let n = 0;
  const boot = async (hash) => {
    await page.goto(BASE + '?nosw&walk=' + (++n) + (hash || ''), { waitUntil: 'load' });
    await page.waitForFunction(() => typeof V32 !== 'undefined' && V32.booted && typeof v32HasHouse === 'function' && v32HasHouse() && typeof v28House === 'function' && (v28House().wines || []).length > 200, null, { timeout: 30000 });
    await page.evaluate((m) => { if (typeof OOT !== 'undefined' && OOT.service && OOT.service.set) OOT.service.set(m); render(); }, mode);
    await page.waitForTimeout(200);
  };
  const settle = (ms) => page.waitForTimeout(ms || 200);
  const go = async (hash) => { await page.evaluate((h) => v32Go(v32Parse(h), 'push'), hash); await settle(); };
  const back = async () => { await page.click('#v32-back'); await settle(300); };
  const state = () => page.evaluate(() => ({ view: S.view, hash: location.hash }));
  const wide = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  /* walk54's measure: every visible control in the page at least 44 px each way, inline links in running text aside */
  const small = (inline) => page.evaluate((inline) => {
    const out = [];
    const nodes = document.querySelectorAll('.wrap button, .wrap a[href], .wrap summary, .wrap input:not([type=hidden]), .wrap select, .wrap [role=button], nav.v32nav [data-nav], #v32-back');
    nodes.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') return;
      if (el.closest('p, li, dd, td') && cs.display === 'inline' && /link/.test(el.className)) return;
      if (inline && el.closest('p, li, dd, td') && cs.display === 'inline' && el.tagName === 'A') return;
      if (r.height < 43.5 || r.width < 43.5) out.push((el.id ? '#' + el.id : el.tagName.toLowerCase() + '.' + String(el.className).split(' ').join('.')) + ' "' + (el.textContent || el.value || '').trim().slice(0, 30) + '" ' + Math.round(r.width) + 'x' + Math.round(r.height));
    });
    return out;
  }, !!inline);
  const lit = () => page.evaluate(() => { const n = document.querySelectorAll('nav.v32nav [aria-current="page"]'); return n.length === 1 ? n[0].getAttribute('data-nav') : 'none:' + n.length; });
  const screen = async (name, inline) => {
    const s = await small(inline);
    check(name + ': every control at least 44 px', s.length === 0, s.slice(0, 6).join('; '));
    check(name + ': no sideways scroll', await wide());
  };
  const shot = async (name, sel) => {
    if (width !== 390) return;
    if (sel) {
      await page.evaluate((s) => { const n = document.querySelector(s); if (n) window.scrollTo(0, Math.max(0, n.getBoundingClientRect().top + window.scrollY - 64)); }, sel);
      await settle(150);
    } else { await page.evaluate(() => window.scrollTo(0, 0)); await settle(100); }
    const f = path.join(SHOTS, width + '-' + mode + '-' + name + '.png');
    await page.screenshot({ path: f });
    shots.push(f);
  };
  const T = await (async () => { await boot('#/v/grapes'); return page.evaluate(() => { var o = {}; Object.keys(GRAPE_TABLE).forEach(function (k) { var t = GRAPE_TABLE[k]; o[k] = { name: t.name, colour: t.colour, lead: t.glass.lead, s45: t.lines.s45, sale: t.lines.sale, s10: t.lines.s10, s20: t.lines.s20, mode: t.mode, status: t.status }; }); return o; }); })();
  await page.evaluate(() => { if (typeof v25Choose === 'function') v25Choose(); applyLevel('certified', true); render(); });
  await settle();
  check('the service is ' + mode, (await page.evaluate(() => document.documentElement.getAttribute('data-service'))) === mode);
  const twenty = await page.evaluate(() => v53TastingList().map((t) => v53GrapeKey(t.name)));

  /* the root */
  await step('the root', async () => {
    await go('#/v/grapes');
    const r = await page.evaluate(() => {
      const rows = [...document.querySelectorAll('.v53-grapes button.v25row[data-go="grape"]')].map((b) => ({ slug: b.getAttribute('data-arg'), line: ((b.querySelector('.v25row-line') || {}).textContent || '').trim(), shown: b.offsetParent !== null }));
      const sec = document.querySelector('section.v57-gtable');
      const doors = sec ? [...sec.querySelectorAll('.v57-doors .v25row-name')].map((x) => x.textContent.trim()) : [];
      const chips = sec ? [...sec.querySelectorAll('[data-v57="filter"]')].map((x) => x.getAttribute('data-f')) : [];
      const jumps = [...document.querySelectorAll('.v53-jumps [data-to]')].map((b) => b.getAttribute('data-to'));
      return { rows, doors, chips, jumps, lit: (document.querySelector('nav.v32nav [aria-current="page"]') || {}).getAttribute ? document.querySelector('nav.v32nav [aria-current="page"]').getAttribute('data-nav') : '' };
    });
    const leads = r.rows.filter((x) => twenty.indexOf(x.slug) < 0 && T[x.slug] && x.line === T[x.slug].lead).length;
    check('the root lists the 75 once each, a line on every row, the 55 outside the twenty with the table\'s glass lead', r.rows.length === 75 && new Set(r.rows.map((x) => x.slug)).size === 75 && r.rows.every((x) => x.line && x.shown) && leads === 55, r.rows.length + ' rows, ' + leads + ' leads');
    check('At the table on the root: Cards at the table, Old World and New World, Compare two grapes, Present it; the filter all, white, red, On our list; its jump between Every grape and Tasting', JSON.stringify(r.doors) === JSON.stringify(['Cards at the table', 'Old World and New World', 'Compare two grapes', 'Present it']) && JSON.stringify(r.chips) === JSON.stringify(['all', 'white', 'red', 'list']) && r.jumps.indexOf('v57-g-table') === r.jumps.indexOf('v53-g-every') + 1 && r.jumps.indexOf('v53-g-tasting') === r.jumps.indexOf('v57-g-table') + 1, JSON.stringify({ doors: r.doors, chips: r.chips, jumps: r.jumps }));
    await screen('the root');
    await shot('root');
    await shot('root-at-the-table', 'section.v57-gtable');
    const showing = async (f) => {
      await page.locator('section.v57-gtable [data-v57="filter"][data-f="' + f + '"]').click();
      await settle(250);
      return page.evaluate(() => ({ n: [...document.querySelectorAll('.v53-grapes button.v25row[data-go="grape"]')].filter((b) => b.offsetParent !== null).length, line: (() => { const l = document.getElementById('v57-filterline'); return l && !l.hidden ? l.textContent.trim() : ''; })(), pressed: (document.querySelector('section.v57-gtable [aria-pressed="true"]') || {}).getAttribute ? document.querySelector('section.v57-gtable [aria-pressed="true"]').getAttribute('data-f') : '' }));
    };
    const whites = Object.keys(T).filter((s) => T[s].colour === 'white').length;
    const w = await showing('white');
    check('the filter White shows the ' + whites + ' whites, the line under the jumps saying so with Show all grapes', w.n === whites && /Showing the white grapes, 37 of 75\./.test(w.line) && /Show all grapes/.test(w.line) && w.pressed === 'white', JSON.stringify(w));
    await screen('the root filtered to white');
    const rd = await showing('red');
    check('the filter Red shows the ' + (75 - whites) + ' reds', rd.n === 75 - whites && rd.pressed === 'red', JSON.stringify(rd));
    const li = await showing('list');
    const poured = await page.evaluate(() => Object.keys(v57HouseSlugs()).filter((s) => !!GRAPE_TABLE[s]).length);
    check('the filter On our list shows the ' + poured + ' grapes the house pours', li.n === poured && poured >= 20 && /on our list/.test(li.line), JSON.stringify(li));
    await page.locator('#v57-filter-clear').click();
    await settle(250);
    const all = await page.evaluate(() => ({ n: [...document.querySelectorAll('.v53-grapes button.v25row[data-go="grape"]')].filter((b) => b.offsetParent !== null).length, line: document.getElementById('v57-filterline').hidden }));
    check('Show all grapes brings the 75 back and the line leaves', all.n === 75 && all.line, JSON.stringify(all));
  });

  /* a grape page with the two worlds and the house's wines: Chardonnay, Cabernet Sauvignon */
  const grapePage = async (slug, shotName) => {
    await step(T[slug].name, async () => {
      await go('#/v/grapes');
      await page.locator('.v53-grapes button.v25row[data-arg="' + slug + '"]').first().click();
      await settle(300);
      const st = await state();
      check(T[slug].name + ': opened from its row on the root', st.view === 'grape' && st.hash === '#/v/grape/' + slug, JSON.stringify(st));
      const b = await page.evaluate(() => {
        const pageEl = document.querySelector('.v57-page');
        const block = pageEl && pageEl.querySelector('section.v57-table');
        const nav = pageEl && pageEl.querySelector('nav.v53-steps');
        const s45 = block && block.querySelector('.v57-fortyfive'), sale = block && block.querySelector('.v57-sale'), s10 = block && block.querySelector('.v57-ten'), s20 = block && block.querySelector('.v57-twenty');
        const rule = s45 && s45.nextElementSibling, saleH = rule && rule.nextElementSibling;
        const cs = (n) => (n ? getComputedStyle(n) : null);
        const firstSec = pageEl ? [...pageEl.querySelectorAll('section, details, nav.v53-steps')][0] : null;
        return {
          block: !!block, first: firstSec === block, before: !!(block && nav && (block.compareDocumentPosition(nav) & 4)),
          s45: s45 ? s45.textContent : '', s45px: cs(s45) ? cs(s45).fontSize : '', s45fam: cs(s45) ? cs(s45).fontFamily : '', s45top: s45 ? Math.round(s45.getBoundingClientRect().top) : -1,
          rule: !!(rule && rule.matches('hr.v57-rule')), ruleColour: cs(rule) ? cs(rule).borderTopColor : '', saleH: saleH ? saleH.textContent : '', sale: sale ? sale.textContent : '',
          s10px: cs(s10) ? cs(s10).fontSize : '', s20px: cs(s20) ? cs(s20).fontSize : '', say: !!(block && /Say it/.test(block.textContent))
        };
      });
      check(T[slug].name + ': At the table first, before the chips; the forty-five second line on the first screen at 20 px in the house reading face', b.block && b.first && b.before && b.s45 === T[slug].s45 && b.s45px === '20px' && /Georgia|serif/i.test(b.s45fam) && b.s45top > 0 && b.s45top < 844, JSON.stringify({ first: b.first, before: b.before, px: b.s45px, top: b.s45top, fam: b.s45fam }));
      check(T[slug].name + ': The sale under a gold rule, the ten and the twenty at 16 px, Say it', b.rule && b.saleH === 'The sale' && b.sale === T[slug].sale && b.s10px === '16px' && b.s20px === '16px' && b.say, JSON.stringify(b).slice(0, 300));
      await screen(T[slug].name + '\'s page', true);
      await shot(shotName + '-top');
      const w = await page.evaluate(() => {
        const d = document.getElementById('v57-gs-worlds');
        const sides = d ? [...d.querySelectorAll('.v57-side')] : [];
        const r = sides.map((s) => s.getBoundingClientRect());
        return { open: !!(d && d.open), heads: sides.map((s) => (s.querySelector('h4') || {}).textContent), stacked: r.length === 2 && r[1].top >= r[0].bottom - 1, inside: r.every((x) => x.left >= 0 && x.right <= innerWidth + 1), after: d ? [...d.querySelectorAll('.v57-after dt')].map((x) => x.textContent) : [], doors: d ? d.querySelectorAll('[data-v57="list"]').length : 0 };
      });
      check(T[slug].name + ': Old World and New World stand open as two cards, one under the other on the phone, with why, blur and the blind call, a door to the list on each side', w.open && JSON.stringify(w.heads) === JSON.stringify(['Old World', 'New World']) && w.stacked && w.inside && JSON.stringify(w.after) === JSON.stringify(['Why they differ', 'Where the line blurs', 'The blind call']) && w.doors === 2, JSON.stringify(w));
      await shot(shotName + '-side-by-side', '#v57-gs-worlds');
      /* the house's wine, from the side's own door to On our list */
      await page.locator('#v57-gs-worlds [data-v57="list"][data-world="new"]').click();
      await settle(300);
      const l = await page.evaluate(() => { const d = document.getElementById('v57-gs-list'); const h = document.getElementById('v57-list-new'); return { open: !!(d && d.open), top: h ? Math.round(h.getBoundingClientRect().top) : -1, rows: d ? d.querySelectorAll('button.v57-wine').length : 0 }; });
      check(T[slug].name + ': the New World door opens On our list at its New World wines', l.open && l.top >= 0 && l.top < 400 && l.rows > 0, JSON.stringify(l));
      await screen(T[slug].name + '\'s list', true);
      const wine = await page.evaluate(() => { const b = document.querySelector('#v57-gs-list button.v57-wine'); return b ? { id: b.getAttribute('data-id'), text: b.textContent.trim() } : null; });
      await page.locator('#v57-gs-list button.v57-wine').first().click();
      try { await page.waitForFunction(() => !!document.querySelector('#v28-card'), null, { timeout: 4000 }); } catch (e) { }
      await settle(300);
      const card = await page.evaluate(() => ({ view: S.view, hash: location.hash, card: !!document.querySelector('#v28-card') }));
      check(T[slug].name + ': a house wine (' + (wine && wine.text.slice(0, 40)) + ') opens its card', card.view === 'cellar' && card.card && wine && card.hash === '#/v/cellar/' + wine.id, JSON.stringify(card));
      await back();
      try { await page.waitForFunction((s) => S.view === 'grape' && location.hash === '#/v/grape/' + s, slug, { timeout: 4000 }); } catch (e) { }
      const backed = await page.evaluate(() => ({ view: S.view, hash: location.hash, list: !!(document.getElementById('v57-gs-list') || {}).open, lit: (document.querySelector('nav.v32nav [aria-current="page"]') || { getAttribute: () => '' }).getAttribute('data-nav') }));
      check(T[slug].name + ': Back returns to the grape, On our list still open, lit Grapes', backed.view === 'grape' && backed.hash === '#/v/grape/' + slug && backed.list && backed.lit === 'grapes', JSON.stringify(backed));
    });
  };
  await grapePage('chardonnay', 'chardonnay');
  await grapePage('cabernet-sauvignon', 'cabernet-sauvignon');

  /* Meunier, from a house wine's grape door */
  await step('Meunier', async () => {
    const id = await page.evaluate(() => { const w = v28Wines(v53House()).find((x) => v28Grapes(x).some((g) => v53GrapeKey(g) === 'meunier')); return w ? w.id : ''; });
    await go('#/');
    await go('#/v/cellar/' + id);
    const door = page.locator('#v54-codex [data-v54-dest="grape:meunier"]');
    check('a Champagne on the list made with Meunier carries a door to Meunier\'s page', (await door.count()) === 1, id);
    await door.click();
    try { await page.waitForFunction(() => location.hash === '#/v/grape/meunier', null, { timeout: 4000 }); } catch (e) { }
    await settle(300);
    const m = await page.evaluate(() => ({ view: S.view, hash: location.hash, block: !!document.querySelector('.v57-page section.v57-table'), name: ((document.querySelector('.v57-page h2') || {}).textContent || '').trim(), list: document.querySelectorAll('#v57-gs-list button.v57-wine').length, home: !!document.querySelector('#v57-gs-worlds .v57-side') }));
    check('the grape door opens Meunier, new: At the table, its two worlds and its ' + m.list + ' wines on our list', m.view === 'grape' && m.hash === '#/v/grape/meunier' && m.block && m.list >= 20 && m.home, JSON.stringify(m));
    await screen('Meunier', true);
    await shot('meunier');
    await back();
    const s = await state();
    check('Back from Meunier returns to the wine\'s card', s.view === 'cellar' && s.hash === '#/v/cellar/' + id, JSON.stringify(s));
  });

  /* Glera, a thin grape filled */
  await step('Glera', async () => {
    await go('#/v/grape/glera');
    const g = await page.evaluate(() => {
      const p = document.getElementById('v53-gs-profile'), t = document.getElementById('v53-gs-tell');
      return { block: !!document.querySelector('.v57-page section.v57-table'), structure: !!(p && /The structure/.test(p.textContent)), tell: !!(t && /The tell/.test(t.textContent)), synth: /No comparison is written/.test(document.querySelector('.wrap').textContent), home: [...document.querySelectorAll('#v57-gs-worlds .v57-side h4')].map((x) => x.textContent) };
    });
    check('Glera, thin at master, filled: At the table, the profile\'s structure and tell from the table, no synthesised line, at home and abroad', g.block && g.structure && g.tell && !g.synth && JSON.stringify(g.home) === JSON.stringify(['At home', 'Abroad']), JSON.stringify(g));
    await screen('Glera', true);
    await shot('glera');
  });

  /* Old World and New World, and a round of the call drill */
  await step('Old World and New World', async () => {
    await go('#/v/grapes');
    await page.locator('#v57-door-worlds').click();
    await settle(300);
    const w = await page.evaluate(() => ({ view: S.view, hash: location.hash, rows: document.querySelectorAll('[data-v57="worlds"][data-slug]').length, lit: document.querySelector('nav.v32nav [aria-current="page"]').getAttribute('data-nav') }));
    check('Old World and New World opens its index of 27 grapes, lit Grapes', w.view === 'grapeworlds' && w.hash === '#/v/grapeworlds' && w.rows === 27 && w.lit === 'grapes', JSON.stringify(w));
    await screen('Old World and New World');
    await shot('grapeworlds');
    await page.locator('#v57-callstart').click();
    await settle(300);
    const c0 = await page.evaluate(() => ({ view: S.view, hash: location.hash, glass: (document.getElementById('v57-call-glass') || {}).textContent || '', pos: ((document.querySelector('.v57-call .sub') || {}).textContent || '').trim() }));
    check('Call 10 glasses opens the drill on its first glass', c0.hash === '#/v/grapeworlds/call' && !!c0.glass && /Glass 1 of 10/.test(c0.pos), JSON.stringify(c0));
    await screen('the call drill');
    await shot('grapeworlds-call');
    let right = 0;
    for (let i = 0; i < 10; i++) {
      const side = i % 3 ? 'old' : 'new';
      await page.locator('#v57-call-' + side).click();
      await settle(200);
      const v = await page.evaluate(() => ({ h: (document.getElementById('v57-call-verdict') || {}).textContent || '' }));
      if (/^Right/.test(v.h)) right++;
      if (i === 0) { await screen('a called glass'); await shot('grapeworlds-call-verdict', '#v57-call-verdict'); }
      await page.locator('#v57-call-next').click();
      await settle(200);
    }
    const sc = await page.evaluate(() => ({ h: ((document.querySelector('.v57-call h2') || {}).textContent || '').trim(), sub: ((document.querySelector('.v57-call .sub') || {}).textContent || '').trim(), n: document.querySelectorAll('#v57-call-score li').length, kept: v57Rec().w }));
    check('the round ends on its score: ' + sc.sub, sc.h === 'The round' && sc.n === 10 && sc.kept && sc.kept.last === right && sc.kept.of === 10 && (right === 10 ? /All 10/.test(sc.sub) : sc.sub === right + ' of 10 called right.'), JSON.stringify(sc));
    await screen('the round\'s score');
    await shot('grapeworlds-score');
    await back();
    const b1 = await state();
    await back();
    const b2 = await state();
    check('Back from the drill climbs to the index, then to the Grapes root', b1.view === 'grapeworlds' && b1.hash === '#/v/grapeworlds' && b2.view === 'grapes', JSON.stringify([b1, b2]));
  });

  /* Compare two grapes */
  await step('Compare two grapes', async () => {
    await go('#/v/grapes');
    await page.locator('#v57-door-compare').click();
    await settle(300);
    const c0 = await state();
    check('Compare two grapes opens on a pair', c0.view === 'grapecompare' && /^#\/v\/grapecompare\/[a-z-]+~[a-z-]+$/.test(c0.hash), JSON.stringify(c0));
    await page.selectOption('#v57-cmp-a', 'chardonnay');
    await page.selectOption('#v57-cmp-b', 'viognier');
    await page.locator('#v57-cmpgo').click();
    await settle(400);
    const c = await page.evaluate(() => {
      const rows = [...document.querySelectorAll('.v57-cmprow')].map((r) => { const k = [...r.children].map((x) => x.getBoundingClientRect()); return k.length === 2 && Math.abs(k[0].top - k[1].top) < 1 && k[0].right <= k[1].left + 1 && k[1].right <= innerWidth + 1; });
      return { hash: location.hash, heads: [...document.querySelectorAll('.v57-cmpsec h3')].map((h) => h.textContent), rows, lit: document.querySelector('nav.v32nav [aria-current="page"]').getAttribute('data-nav') };
    });
    check('Chardonnay and Viognier chosen: ' + c.heads.join(', ') + ', two columns side by side on the phone, lit Grapes', c.hash === '#/v/grapecompare/chardonnay~viognier' && c.rows.length === 5 && c.rows.every(Boolean) && ['In the glass', 'The notes', 'Structure', 'The tell', 'Service'].every((h) => c.heads.indexOf(h) >= 0) && c.lit === 'grapes', JSON.stringify(c));
    await screen('Compare two grapes');
    await shot('grapecompare');
    await back();
    check('Back from Compare two grapes climbs to the Grapes root', (await state()).view === 'grapes', JSON.stringify(await state()));
  });

  /* Present it */
  await step('Present it', async () => {
    await go('#/v/grapes');
    await page.locator('#v57-door-present').click();
    await settle(300);
    const p0 = await page.evaluate(() => ({ view: S.view, hash: location.hash, name: (document.getElementById('v57-pname') || {}).textContent || '', line: !!document.querySelector('.v57-ptable') }));
    check('Present it names a grape (' + p0.name + ') and hides its line', p0.view === 'grapepresent' && !!p0.name && !p0.line, JSON.stringify(p0));
    await screen('Present it');
    await shot('grapepresent');
    const slug = await page.evaluate(() => V57_ARGS.grapepresent);
    await page.locator('#v57-reveal').click();
    await settle(300);
    const p1 = await page.evaluate(() => ({ line: ((document.querySelector('.v57-ptable .v57-fortyfive') || {}).textContent || ''), px: getComputedStyle(document.querySelector('.v57-ptable .v57-fortyfive')).fontSize }));
    check('Show the line shows its forty-five second line', p1.line === T[slug].s45, JSON.stringify(p1).slice(0, 200));
    await screen('Present it, the line shown');
    await shot('grapepresent-line', '#v57-p-h');
    await page.locator('#v57-mark-yes').click();
    await settle(300);
    const p2 = await page.evaluate((s) => ({ said: (document.getElementById('v57-p-marked') || {}).textContent || '', rec: v57Rec().p[s], one: v57AddDays(1) }), slug);
    check('Said it marks it, due tomorrow', /comes back tomorrow/.test(p2.said) && p2.rec && p2.rec.due === p2.one, JSON.stringify(p2));
    await screen('Present it, marked');
    await back();
    check('Back from Present it climbs to the Grapes root', (await state()).view === 'grapes', JSON.stringify(await state()));
  });

  /* a table card graded and due later */
  await step('a table card graded', async () => {
    await go('#/v/grape/chardonnay');
    await page.evaluate(() => { const d = document.getElementById('v53-gs-cards'); if (d) d.open = true; });
    await settle(150);
    await page.locator('#v57-gcards').click();
    await settle(400);
    const c0 = await page.evaluate(() => ({ view: S.view, deck: S._v32run && S._v32run.deckId, id: S._v32run && S._v32run.cards[S._v32run.deck[0]].id, lit: document.querySelector('nav.v32nav [aria-current="page"]').getAttribute('data-nav') }));
    check('Study these cards deals Chardonnay\'s three on the card screen, lit Grapes', c0.view === 'housedeck' && c0.deck === 'grapecards:chardonnay' && c0.lit === 'grapes', JSON.stringify(c0));
    await screen('the table card, its front');
    await page.locator('.v28-grade [data-v32="flip"]').click();
    await settle(250);
    await screen('the table card, its answer');
    await page.locator('.v28-grade [data-v32="got"]').click();
    await settle(250);
    const g = await page.evaluate((id) => ({ rec: v57Rec().c[id], one: v57AddDays(1) }), c0.id);
    check('Got it: the card is due tomorrow, in the layer\'s slot', g.rec && g.rec.due === g.one && g.rec.n === 1, JSON.stringify(g));
    await back();
    try { await page.waitForFunction(() => S.view === 'grape', null, { timeout: 4000 }); } catch (e) { }
    const st = await page.evaluate(() => { const d = document.getElementById('v53-gs-cards'); if (d) d.open = true; return { view: S.view, hash: location.hash, states: [...document.querySelectorAll('.v57-cardstate')].map((x) => x.textContent) }; });
    check('Back returns to Chardonnay, where the card reads Due tomorrow', st.view === 'grape' && st.hash === '#/v/grape/chardonnay' && st.states.indexOf('Due tomorrow') >= 0, JSON.stringify(st));
  });

  /* cold reloads */
  const cold = [['#/v/grape/chardonnay', ['grape', 'grapes', 'home']], ['#/v/grapeworlds', ['grapeworlds', 'grapes', 'home']], ['#/v/grapeworlds/call', ['grapeworlds', 'grapeworlds', 'grapes', 'home']], ['#/v/grapecompare/chardonnay~merlot', ['grapecompare', 'grapes', 'home']], ['#/v/grapepresent/glera', ['grapepresent', 'grapes', 'home']]];
  for (const [hash, want] of cold) {
    await step('the cold reload of ' + hash, async () => {
      await boot(hash);
      await settle(200);
      const s0 = await page.evaluate(() => ({ view: S.view, hash: location.hash, drawn: !!document.querySelector('.v57-page section.v57-table, .v57-view') }));
      const trail = [s0.view];
      const lits = [await lit()];
      for (let i = 0; i < 5 && trail[trail.length - 1] !== 'home'; i++) { await back(); trail.push((await state()).view); lits.push(await lit()); }
      check('a cold reload of ' + hash + ' draws ' + want[0] + ' and Back climbs ' + want.slice(1).join(', ') + ' (' + trail.join(' > ') + ')', s0.hash === hash && s0.drawn && JSON.stringify(trail) === JSON.stringify(want) && lits.slice(0, -1).every((w) => w === 'grapes') && lits[lits.length - 1] === 'home', JSON.stringify({ s0, trail, lits }));
    });
  }

  check('the console is clean', errs.length === 0, errs.slice(0, 4).join(' | '));
  await ctx.close();
  console.log('  ' + width + ' px ' + mode + ': ' + ok + ' ok, ' + bad + ' failed');
  totals.push({ width, mode, ok, bad, fails });
}

const browser = await chromium.launch();
try {
  for (const width of [375, 390]) for (const mode of ['day', 'night']) {
    if ((ONLY_W && width !== ONLY_W) || (ONLY_M && mode !== ONLY_M)) continue;
    await walk(browser, width, mode);
  }
} finally { await browser.close(); stopServer(); }
console.log('');
if (shots.length) console.log('screenshots (' + shots.length + '):\n' + shots.map((s) => '  ' + s).join('\n'));
totals.forEach((t) => console.log('walk-grapes ' + t.width + ' ' + t.mode + ': ' + t.ok + ' ok, ' + t.bad + ' failed'));
const failed = totals.reduce((s, t) => s + t.bad, 0);
console.log('walk-grapes: ' + totals.reduce((s, t) => s + t.ok, 0) + ' ok, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
