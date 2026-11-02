/* walk54.mjs: the phone walk of the five-star card and the flow (codex54), and of the Wine Atlas tab and More's
   Library (codex55, 2 November 2026), in Chromium on the served source.

   At 375 and 390 px, day and night, each in an isolated profile with a pack whose every wine carries a sale:
   on a glass wine, a tasting pour, a Bubbles bottle and a floor bottle, the block order on screen, the forty-five
   at 20 px with The sale under it, the ten and the twenty quiet, no guest line at the top, every In the Codex door
   and every Practise this wine chip opened with Back returning to the card and its open sections, one visible Next;
   the bank with its lifted rows and #/quizzes drawing it, a quiz started on the bank climbing back to it; Grapes'
   four Tasting rows and The Village tasting on its 30:00 clock; the Library's sections (no atlas since codex55); the
   level page; the Rehearsal room on an empty cellar; Wine studies; Back from housesay and houseguest; cold loads of
   a card, #/quizzes, #/v/bank and #/v/grapes with Back to Home; the bar on one row; every control at least 44 px;
   no sideways scroll; a clean console. Since codex55: the bar at 320, 375 and 390 px in each walk's service, one
   row, Home, the house, CMS, Grapes, Wine Atlas and More, every word at least 44 px, the pill on More alone; More
   opening with The Library, each row opening the Library at its heading lit More, Back returning to More; the Wine
   Atlas root (its chips, seventeen sheets, every country and every region with its counts, a district found by the
   search); Burgundy, Napa and Sonoma and Rioja opened from the root with the inline map loaded, a district tapped
   and its point marked, every In the Codex door opened with Back returning to the region, and Back to the root;
   France's country page with its sheet inline and its regions; cold reloads of #/v/region/burgundy, #/v/worldmap
   and #/library with Back climbing to Home.

     PLAYWRIGHT_MODULE=... OOT_HOUSE_PACK=... WALK_PACK=<a pack with sales> SITE_ROOT=<a root whose shared/ is
     WorldTable's static/shared> node .wip/walk54.mjs [width] [day|night]

   CODEX_URL names a server already running; without it the walk starts .wip/serve.mjs on a free port and stops it.
   WALK_PACK is served in place of the shipped pack; without it a sale is written in memory into every wine of
   OOT_HOUSE_PACK. Work in progress, kept on codex54-wip and extended on codex55-wip. */
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

/* the pack: every wine with a sale */
let packText;
if (process.env.WALK_PACK) packText = fs.readFileSync(process.env.WALK_PACK, 'utf8');
else {
  const p = JSON.parse(fs.readFileSync(process.env.OOT_HOUSE_PACK, 'utf8'));
  p.house.wines.forEach((w) => { if (w.lines && w.lines.value && !w.lines.value.sale) w.lines.value.sale = 'A walk sale for ' + String(w.name).replace(/\s+/g, ' ') + ': a bright glass that lifts the table. Offer it with confidence and let the guest taste it.'; });
  packText = JSON.stringify(p);
}
const PACK = JSON.parse(packText);
const house = PACK.house;
const str = (s) => (typeof s === 'string' ? s.trim() : '');
function packKind(w) {
  if (w.list === 'bottle') return /half/i.test(str(w.section)) || /375/.test(str(w.size)) ? 'floor-half' : 'floor';
  const menuBottle = !str(w.glass) && !!str(w.bottle);
  const printed = (Array.isArray(w.prices) ? w.prices : []).some((p) => p && str(p.printed));
  if (printed && !menuBottle) return 'glass';
  const poured = (house.tastings || []).some((t) => (t.courses || []).some((c) => c && c.pourId === w.id));
  if (!printed && poured) return 'pour';
  if (menuBottle) return /bubbles at/i.test(str(w.section)) ? 'bubbles' : 'half';
  return 'glass';
}
const pick = (k, f) => house.wines.find((w) => packKind(w) === k && (!f || f(w)));
const WINES = [
  ['a glass wine', pick('glass')],
  ['a tasting pour', pick('pour')],
  ['a Bubbles bottle', pick('bubbles')],
  ['a floor bottle', pick('floor', (w) => w.offeredWith && w.firstPickIds) || pick('floor', (w) => w.offeredWith)]
].filter((x) => x[1]).map(([k, w]) => ({ kind: k, id: w.id, name: w.name, sale: str(((w.lines || {}).value || {}).sale) }));
const ORDER = ['table', 'where', 'wine', 'codex', 'who', 'madeof', 'parts', 'floor', 'note', 'watch', 'practise'];

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
  const back = async () => { await page.click('#v32-back'); await settle(250); };
  const state = () => page.evaluate(() => ({ view: S.view, hash: location.hash }));
  const wide = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  /* every visible control in the page at least 44 px each way, inline links in running text aside */
  const small = (inline) => page.evaluate((inline) => {
    const out = [];
    const nodes = document.querySelectorAll('.wrap button, .wrap a[href], .wrap summary, .wrap input:not([type=hidden]), .wrap select, .wrap [role=button], nav.v32nav [data-nav], #v32-back');
    nodes.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') return;
      if (el.closest('p, li, dd, td') && cs.display === 'inline' && /link/.test(el.className)) return;
      /* a reading's own links in its running text (its sources, its notes) are inline, as the Chromium proof reads them */
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

  await boot('#/v/brennans');
  await page.evaluate(() => { if (typeof v25Choose === 'function') v25Choose(); applyLevel('certified', true); const id = v28Rows()[0].id; ST.q['h-' + id + '-card'] = { c: 0, w: 1, s: 0 }; stSave(); render(); });
  await settle();
  check('the service is ' + mode, (await page.evaluate(() => document.documentElement.getAttribute('data-service'))) === mode);

  /* the bar */
  await step('the bar', async () => {
    await go('#/');
    /* codex55: the bar measured at 320, 375 and 390 in this walk's service, then the walk's own width again */
    for (const bw of [320, 375, 390]) {
      await page.setViewportSize({ width: bw, height: 844 });
      await settle(150);
      const lay = await page.evaluate(() => {
        const nav = document.querySelector('nav.v32nav');
        const rects = [...nav.querySelectorAll('[data-nav]')].map((b) => { const r = b.getBoundingClientRect(); return { id: b.dataset.nav, text: b.firstChild ? b.firstChild.textContent.trim() : '', w: r.width, h: r.height, mid: r.y + r.height / 2, right: r.right, whole: b.scrollWidth <= b.clientWidth + 1 }; });
        const pills = [...nav.querySelectorAll('.v32pill')].map((x) => x.closest('[data-nav]').dataset.nav);
        return { n: rects.length, words: rects.map((r) => r.id).join(','), atlas: (rects[4] || {}).text, pills, due: v32DueToday().total, row: rects.every((r) => Math.abs(r.mid - rects[0].mid) < 1), big: rects.every((r) => r.w >= 44 && r.h >= 44), whole: rects.every((r) => r.whole), fit: rects.every((r) => r.right <= innerWidth + 1) && nav.scrollWidth <= nav.clientWidth + 1 && document.documentElement.scrollWidth <= innerWidth + 1, widths: rects.map((r) => r.w.toFixed(1)).join(' ') };
      });
      console.log('    the bar at ' + bw + ' px: ' + lay.widths + ' (pill ' + lay.due + ' on ' + lay.pills.join(',') + ')');
      check('the bar at ' + bw + ' px, ' + mode + ': Home, the house, CMS, Grapes, Wine Atlas and More on one row, every word at least 44 px and whole, inside the screen', lay.n === 6 && lay.words === 'home,brennans,cms,grapes,worldmap,more' && lay.atlas === 'Wine Atlas' && lay.row && lay.big && lay.whole && lay.fit, JSON.stringify(lay));
      check('the bar at ' + bw + ' px, ' + mode + ': the due pill on More alone', lay.due ? (lay.pills.length === 1 && lay.pills[0] === 'more') : lay.pills.length === 0, JSON.stringify(lay.pills));
    }
    await page.setViewportSize({ width, height: 844 });
    await settle(150);
    await screen('Home');
  });

  /* the card on four wines */
  for (const W of WINES) {
    await step('the card on ' + W.kind, async () => {
      console.log('  [' + W.kind + ': ' + W.id + ' ' + W.name + ']');
      await go('#/');
      const cardHash = '#/v/cellar/' + W.id;
      await go(cardHash);
      const c = await page.evaluate((id) => {
        const card = document.querySelector('#v28-card.v54-card');
        if (!card) return { none: true, view: S.view, hash: location.hash };
        const item = v28House().wines.find((w) => w.id === id);
        const l = v28LinesShown(item);
        const secs = [...card.children].filter((n) => n.tagName === 'SECTION').map((n) => n.id || ('?' + n.className));
        const firstSec = card.querySelector('section');
        const pre = []; for (let n = card.firstElementChild; n && n !== firstSec; n = n.nextElementSibling) pre.push(n.textContent);
        const s45 = document.querySelector('#v28-s45'), s10 = document.querySelector('#v28-s10'), s20 = document.querySelector('#v28-s20');
        const fs = (n) => (n ? getComputedStyle(n).fontSize : '');
        const fw = (n) => (n ? getComputedStyle(n).fontWeight : '');
        const tbl = card.querySelector('#v54-table');
        const tblKids = tbl ? [...tbl.children].filter((n) => n.tagName !== 'H3') : [];
        const firstTimed = tblKids.find((n) => !n.classList.contains('v28-eyebrow'));
        const rule = s45 && s45.nextElementSibling, saleH = rule && rule.nextElementSibling, sale = saleH && saleH.nextElementSibling;
        const nexts = [...document.querySelectorAll('.wrap button')].filter((b) => b.textContent.trim() === 'Next' && b.getBoundingClientRect().height > 0);
        const guestWord = (typeof v28W === 'function') ? v28W('guestLine') : '';
        const floor = card.querySelector('#v54-floor');
        const beforeFloor = floor ? card.innerText.slice(0, card.innerText.indexOf(floor.innerText)) : card.innerText;
        return {
          secs, pre: pre.join(' | '), s45: fs(s45), s45fam: s45 ? getComputedStyle(s45).fontFamily : '', s10: fs(s10), s20: fs(s20), w10: fw(s10), w20: fw(s20),
          firstTimed: firstTimed ? firstTimed.id : '', rule: !!(rule && rule.matches('hr.v54-rule')), saleH: saleH ? saleH.textContent : '', sale: sale && sale.matches('.v54-sale') ? sale.textContent : '',
          nexts: nexts.length, nextInTitle: nexts.every((b) => !!b.closest('.v54-titlerow')), hasNextRow: !!card.querySelector('.v28-foot [data-step]:last-child'),
          guest: l.guestShown ? l.guest : '', s10t: l.s10, s45t: l.s45, s20t: l.s20, guide: (card.querySelector('.v54-guide') || {}).textContent || '',
          guestWordTop: !!guestWord && beforeFloor.indexOf(guestWord) >= 0, tableText: tbl ? tbl.textContent : '',
          foreign: [...card.children].filter((n) => n.tagName === 'SECTION' && !/^v54-/.test(n.id)).length
        };
      }, W.id);
      if (c.none) { check(W.kind + ': the card is drawn', false, JSON.stringify(c)); return; }
      const seen = c.secs.filter((s) => s.startsWith('v54-')).map((s) => s.slice(4));
      const inOrder = seen.every((s, i) => ORDER.indexOf(s) >= 0 && (i === 0 || ORDER.indexOf(s) > ORDER.indexOf(seen[i - 1])));
      console.log('    blocks: ' + seen.join(' > '));
      check(W.kind + ': the blocks stand in the card\'s order, At the table first, Practise this wine last, no foreign block', inOrder && seen[0] === 'table' && seen[seen.length - 1] === 'practise' && c.foreign === 0 && ['wine', 'codex', 'floor', 'note'].every((s) => seen.indexOf(s) >= 0), c.secs.join(' > '));
      check(W.kind + ': the forty-five opens At the table, at 20 px in the house reading face', c.firstTimed === 'v28-s45' && c.s45 === '20px' && !!c.s45fam, c.firstTimed + ' ' + c.s45 + ' ' + c.s45fam);
      check(W.kind + ': The sale stands under the forty-five, under a gold rule, as the pack wrote it', c.rule && c.saleH === 'The sale' && !!W.sale && c.sale === W.sale, JSON.stringify({ rule: c.rule, h: c.saleH, sale: c.sale.slice(0, 60), want: W.sale.slice(0, 60) }));
      check(W.kind + ': the ten and the twenty quiet, smaller and lighter than the forty-five', (!c.s10t || (c.s10 === '16px' && Number(c.w10) <= 400)) && (!c.s20t || (c.s20 === '16px' && Number(c.w20) <= 400)), JSON.stringify({ s10: c.s10, w10: c.w10, s20: c.s20, w20: c.w20 }));
      const repeat = c.guest && (c.guest === c.s10t || c.guest === c.s45t || c.guest === c.s20t);
      check(W.kind + ': no guest line at the top; The guide\'s line under On the floor, never a repeat of a timed line', !c.guestWordTop && (!c.guest || repeat || (c.guide === c.guest && c.pre.indexOf(c.guest) < 0 && c.tableText.indexOf(c.guest) < 0)) && (!repeat || !c.guide), JSON.stringify({ top: c.guestWordTop, guest: c.guest.slice(0, 50), guide: c.guide.slice(0, 50), repeat }));
      check(W.kind + ': one visible Next, in the title row', c.nexts === 1 && c.nextInTitle, JSON.stringify({ n: c.nexts, title: c.nextInTitle }));
      await screen(W.kind + '\'s card');

      /* open two closed sections, so each door's Back can be seen to keep them */
      const opened = await page.evaluate(() => {
        const out = [];
        ['parts', 'land', 'about'].forEach((k) => { const d = document.querySelector('#v28-card details[data-v54-sec="' + k + '"]'); if (d && !d.open && out.length < 2) { d.querySelector('summary').click(); out.push(k); } });
        return out;
      });
      await settle(120);
      const keptOpen = () => page.evaluate((ks) => ks.filter((k) => { const d = document.querySelector('#v28-card details[data-v54-sec="' + k + '"]'); return !(d && d.open); }), opened);
      const returnsHome = async (label) => {
        await back();
        try { await page.waitForFunction((h) => location.hash === h && !!document.querySelector('#v28-card.v54-card'), cardHash, { timeout: 4000 }); } catch (e) { }
        const st = await state();
        const lost = await keptOpen();
        check(W.kind + ': Back from ' + label + ' returns to the card with its open sections (' + opened.join(', ') + ')', st.hash === cardHash && st.view === 'cellar' && lost.length === 0, JSON.stringify({ st, lost }));
      };

      /* every door In the Codex */
      const doors = await page.evaluate(() => [...document.querySelectorAll('#v54-codex .v54-chips button')].map((b) => ({ label: b.textContent.trim(), dest: b.getAttribute('data-v54-dest') || b.getAttribute('data-v28') })));
      check(W.kind + ': In the Codex holds its doors, one per destination', doors.length > 0 && new Set(doors.map((d) => d.dest)).size === doors.length, JSON.stringify(doors.map((d) => d.dest)));
      for (let i = 0; i < doors.length; i++) {
        const d = doors[i];
        await page.locator('#v54-codex .v54-chips button').nth(i).click();
        try { await page.waitForFunction((h) => location.hash !== h, cardHash, { timeout: 4000 }); } catch (e) { }
        await settle(250);
        const st = await state();
        check(W.kind + ': the door ' + d.dest + ' opens its screen (' + st.view + ')', st.hash !== cardHash && st.view !== 'cellar', JSON.stringify(st));
        await returnsHome(d.dest);
      }

      /* every chip of Practise this wine */
      const chips = await page.evaluate(() => [...document.querySelectorAll('#v54-practise button')].map((b) => ({ label: b.textContent.trim(), act: b.getAttribute('data-v28') })));
      check(W.kind + ': Practise this wine is one row of chips', chips.length > 0 && (await page.evaluate(() => document.querySelectorAll('#v54-practise .v54-practise-row').length)) === 1, JSON.stringify(chips));
      for (let i = 0; i < chips.length; i++) {
        const ch = chips[i];
        await page.locator('#v54-practise button').nth(i).click();
        try { await page.waitForFunction((h) => location.hash !== h, cardHash, { timeout: 4000 }); } catch (e) { }
        await settle(250);
        const st = await state();
        check(W.kind + ': Practise chip ' + ch.label + ' opens its screen (' + st.view + ')', st.hash !== cardHash && st.view !== 'cellar', JSON.stringify(st));
        await page.evaluate(() => { if (typeof stopTimer === 'function') stopTimer(); });
        await returnsHome(ch.label);
      }
    });
  }

  /* the bank and Quizzes */
  await step('the bank', async () => {
    await go('#/');
    await go('#/v/bank');
    const b = await page.evaluate(() => ({ view: S.view, lifted: !!document.querySelector('.v54-lifted'), heads: [...document.querySelectorAll('.v54-lifted h2, .v54-lifted h3')].map((h) => h.textContent.trim()), rows: [...document.querySelectorAll('.wrap .v25row')].map((r) => (r.querySelector('.v25row-name') || r).textContent.trim()), flight: !!document.querySelector('.wrap [data-go="flight"]'), tasting45: !!document.querySelector('.wrap [data-go="villagetasting"]') }));
    console.log('    the bank\'s lifted sections: ' + b.heads.join(' | '));
    check('the bank holds the lifted sections (four) with their rows, no Blind flight, no 45 minute tasting', b.view === 'bank' && b.lifted && b.heads.length >= 4 && b.rows.length > 4 && !b.flight && !b.tasting45, JSON.stringify(b).slice(0, 300));
    await screen('the bank');
    await go('#/quizzes');
    const q = await page.evaluate(() => ({ view: S.view, h: ((document.querySelector('.wrap h2') || {}).textContent || '').trim(), bank: !!document.querySelector('.v54-quizbank'), rows: [...document.querySelectorAll('.wrap .v25row')].map((r) => (r.querySelector('.v25row-name') || r).textContent.trim()) }));
    check('#/quizzes draws the bank: its title and the bank\'s rows', q.view === 'quizzes' && q.bank && /question bank$/.test(q.h) && JSON.stringify(q.rows) === JSON.stringify(b.rows), JSON.stringify({ h: q.h, bank: q.bank, n: q.rows.length, m: b.rows.length }));
    await screen('#/quizzes');
    await go('#/v/bank');
    await page.locator('.wrap .v53-trains button').first().click();
    await settle(300);
    const qz = await state();
    check('a quiz starts from the bank', qz.view === 'quiz', JSON.stringify(qz));
    await screen('a quiz from the bank');
    await back();
    await page.evaluate(() => { if (typeof stopTimer === 'function') stopTimer(); });
    const st = await state();
    check('Back from a quiz started on the bank returns to the bank', st.view === 'bank', JSON.stringify(st));
  });

  /* Grapes: the four Tasting rows, the Village tasting on its 30:00 clock */
  await step('Grapes', async () => {
    await go('#/');
    await go('#/v/grapes');
    const g = await page.evaluate(() => {
      const sec = document.querySelector('[aria-labelledby="v53-g-tasting"]');
      return { rows: sec ? [...sec.querySelectorAll('.v25row-name')].map((n) => n.textContent.trim()) : [], flight: !!(sec && sec.querySelector('[data-go="flight"]')), method: !!(sec && sec.querySelector('[data-go="tastegrid"]')) };
    });
    console.log('    Tasting: ' + g.rows.join(' | '));
    check('Grapes\' Tasting reads four rows: the grid drill, The Village tasting, Warm up: call the structure, the deductive grid; no Blind flight, no method', g.rows.length === 4 && /grid drill/i.test(g.rows[0]) && /^The Village tasting/.test(g.rows[1]) && g.rows[2] === 'Warm up: call the structure' && /deductive grid/i.test(g.rows[3]) && !g.flight && !g.method, JSON.stringify(g));
    await screen('Grapes');
    await page.locator('[aria-labelledby="v53-g-tasting"] .v25row').nth(1).click();
    await settle(300);
    const t = await state();
    check('The Village tasting opens on the Court\'s grid', t.view === 'courttasting', JSON.stringify(t));
    if (await page.locator('#v53-grunstart').count()) {
      await page.locator('#v53-grunstart').click();
      await settle(300);
      const clock = await page.evaluate(() => ({ clock: S._v53tg && S._v53tg.clock, text: (document.getElementById('v53-clock') || {}).textContent || '' }));
      check('The Village tasting runs on its 30:00 clock', clock.clock === 1800 && /30:00|29:5\d/.test(clock.text), JSON.stringify(clock));
      await screen('The Village tasting');
      await page.evaluate(() => { if (typeof v53ClockStop === 'function') v53ClockStop(); });
    } else check('The Village tasting offers its flight', false, 'no #v53-grunstart');
    await back();
    check('Back from The Village tasting returns to Grapes', (await state()).view === 'grapes', JSON.stringify(await state()));
  });

  /* the Library (codex55: no atlas section, no regions door; it lights More) */
  await step('the Library', async () => {
    await go('#/');
    await go('#/library');
    const lib = await page.evaluate(() => {
      const reading = document.querySelector('.v53-reading');
      return { heads: [...document.querySelectorAll('.wrap section h2, .wrap section h3')].map((h) => h.textContent.trim()), atlas: !!document.querySelector('.wrap .v53-atlas'), reg: !!document.querySelector('.wrap .v39-door-regions'), chip: !!document.querySelector('.wrap [data-to="v53-atlas-h"]'), map: document.querySelectorAll('.wrap [data-go="worldmap"]').length, method: !!(reading && /How to taste: the method/.test(reading.textContent)), terroir: document.querySelectorAll('.wrap [data-go="terroir"]').length };
    });
    console.log('    the Library: ' + lib.heads.join(' | '));
    check('the Library: its sections, no atlas section, chip, regions door or World Map row, How to taste: the method in the reading rooms, no Terroir row', lib.heads.length >= 3 && !lib.atlas && !lib.reg && !lib.chip && lib.map === 0 && lib.method && lib.terroir === 0, JSON.stringify(lib));
    check('the Library lights More', (await lit()) === 'more', await lit());
    await screen('the Library');
  });

  /* More opens with The Library */
  await step('More\'s Library', async () => {
    await go('#/');
    await page.click('#nav-more');
    await page.waitForFunction(() => S.view === 'more');
    await settle();
    const first = await page.evaluate(() => { const g = document.querySelector('#view .v32-group'); return g ? { lib: g.classList.contains('v55-libgroup'), head: (g.querySelector('h3') || {}).textContent, rows: [...g.querySelectorAll('.v25row-name')].map((n) => n.textContent) } : null; });
    check('More opens with The Library: Practise, The question bank, The reading rooms, lit More', !!first && first.lib && first.head === 'The Library' && first.rows.join(',') === 'Practise,The question bank,The reading rooms' && (await lit()) === 'more', JSON.stringify(first));
    await screen('More');
    for (const [id, head, label] of [['v55-lib-practise', 'v53-practise-h', 'Practise'], ['v55-lib-bank', 'v53-bank-h', 'The question bank'], ['v55-lib-reading', 'v53-reading-h', 'The reading rooms']]) {
      await page.click('#' + id);
      await page.waitForFunction(() => S.view === 'library');
      await settle(350);
      const at = await page.evaluate((h) => { const n = document.getElementById(h); const r = n ? n.getBoundingClientRect() : null; return { has: !!n, top: r ? Math.round(r.top) : -1, hash: location.hash }; }, head);
      check('More\'s ' + label + ' opens the Library (#/library) at its heading, lit More', at.has && at.top >= 0 && at.top < 260 && /^#\/library/.test(at.hash) && (await lit()) === 'more', JSON.stringify(at));
      await back();
      check('Back from the Library (' + label + ') returns to More', (await state()).view === 'more', JSON.stringify(await state()));
    }
  });

  /* the Wine Atlas root */
  const atlasRoot = async () => {
    await page.click('#nav-worldmap');
    await page.waitForFunction(() => S.view === 'worldmap' && !S.wmap && document.querySelector('#v55-hub'));
    await settle(250);
  };
  await step('the Wine Atlas root', async () => {
    await go('#/');
    await atlasRoot();
    await page.waitForFunction(() => v55Regions().every((a) => v39RecReady(a)), null, { timeout: 30000 });
    await settle(300);
    const hub = await page.evaluate(() => ({
      hash: location.hash, chips: [...document.querySelectorAll('.v55-chips .v28-chip')].map((c) => c.textContent.trim()), sheets: document.querySelectorAll('#v55-hub [data-v39="openmap"]').length,
      countries: document.querySelectorAll('#v55-hub .v55-countrychips [data-v39="country"]').length, groups: document.querySelectorAll('#v55-hub .v55-country').length, want: v55CountryOrder().length,
      regions: document.querySelectorAll('#v55-hub .v55-regions [data-v39="region"]').length, all: v55Regions().length,
      counted: [...document.querySelectorAll('#v55-hub [data-v55-count]')].filter((n) => /districts? · \d+ on its field map$/.test(n.textContent)).length
    }));
    console.log('    the root: ' + hub.sheets + ' sheets, ' + hub.countries + ' countries, ' + hub.regions + ' regions, ' + hub.counted + ' counted');
    check('Wine Atlas opens the root (#/v/worldmap), lit Wine Atlas', hub.hash === '#/v/worldmap' && (await lit()) === 'worldmap', hub.hash);
    check('the root: its five chips, seventeen sheet doors, every country as a chip and a group, every region as a row with its counts filled', hub.chips.join(',') === 'The World Map,Countries,Every region,Field maps,Techniques' && hub.sheets === 17 && hub.countries === hub.want && hub.groups === hub.want && hub.regions === hub.all && hub.counted === hub.all, JSON.stringify(hub));
    await page.fill('#v55-find', 'chablis');
    await settle(150);
    const found = await page.evaluate(() => [...document.querySelectorAll('#v55-hub .v55-regions li[data-v55-slug]')].filter((li) => !li.hidden).map((li) => li.getAttribute('data-v55-slug')));
    check('the search finds a district: Chablis finds Burgundy', found.length === 1 && found[0] === 'burgundy', JSON.stringify(found));
    await page.fill('#v55-find', '');
    await settle(150);
    await screen('the Wine Atlas root', true);
  });

  /* three regions opened from the root: the map, a district marked, every door In the Codex, Back */
  const regionReady = (slug) => page.waitForFunction((s) => S.view === 'region' && S._v39region === s && v39RecReady(v39Find(s)) && !document.querySelector('#v39-wait') && !!document.querySelector('.v55-districts'), slug, { timeout: 30000 });
  for (const [slug, place] of [['burgundy', 'Meursault'], ['napa-sonoma', 'Napa'], ['rioja', 'Haro']]) {
    await step(slug, async () => {
      await go('#/');
      await atlasRoot();
      const row = page.locator('#v55-r-' + slug);
      await row.scrollIntoViewIfNeeded();
      await row.click();
      await regionReady(slug);
      await page.waitForFunction(() => { const i = document.querySelector('.v55-mapfig img'); return i && i.complete && i.naturalWidth > 0; }, null, { timeout: 30000 });
      await settle(300);
      const regionHash = (await state()).hash;
      check(slug + ': opened from its row on the root, lit Wine Atlas, the inline map loaded above The districts', regionHash === '#/v/region/' + slug && (await lit()) === 'worldmap' && await page.evaluate(() => document.querySelector('.v55-map').compareDocumentPosition(document.querySelector('.v55-districts')) === Node.DOCUMENT_POSITION_FOLLOWING), regionHash);
      const name = await page.evaluate((p) => { const b = [...document.querySelectorAll('[data-v55="pin"]')].find((x) => x.getAttribute('data-name') === p) || document.querySelector('.v55-districts .v55-dlist:not(.v55-also) [data-v55="pin"]'); return b ? b.getAttribute('data-name') : ''; }, place);
      const btn = page.locator('[data-v55="pin"][data-name="' + name + '"]').first();
      await btn.scrollIntoViewIfNeeded();
      await btn.click();
      await settle(350);
      const mark = await page.evaluate(() => {
        const pin = document.querySelector('.v55-pin'), ring = pin.querySelector('.v55-pin-ring').getBoundingClientRect();
        const img = document.querySelector('.v55-mapfig img').getBoundingClientRect();
        const b = document.querySelector('[data-v55="pin"][aria-pressed="true"]');
        if (!b) return { none: true };
        const s = Math.min(img.width / 1200, img.height / 1500);
        const want = [img.left + (img.width - 1200 * s) / 2 + Number(b.getAttribute('data-x')) * s, img.top + (img.height - 1500 * s) / 2 + Number(b.getAttribute('data-y')) * s];
        const got = [ring.left + ring.width / 2, ring.top + ring.height / 2];
        return { hidden: pin.hidden, tag: pin.textContent, off: Math.hypot(got[0] - want[0], got[1] - want[1]), inImage: got[0] >= img.left && got[0] <= img.right && got[1] >= img.top && got[1] <= img.bottom, inView: ring.top >= 0 && ring.bottom <= innerHeight, said: document.getElementById('v55-pin-said').textContent, pressed: document.querySelectorAll('[data-v55="pin"][aria-pressed="true"]').length, here: !!b.closest('.v55-d.v55-here') };
      });
      check(slug + ': a tap on ' + name + ' marks its point on the map (' + (mark.off || 0).toFixed(2) + ' px from the dot), in view, its button pressed, its district lit and the mark said', !mark.none && !mark.hidden && mark.off < 1.5 && mark.inImage && mark.inView && mark.pressed === 1 && mark.here && mark.said.indexOf(name) === 0 && mark.tag.indexOf(name) > 0, JSON.stringify(mark));
      await screen(slug, true);
      const doors = await page.evaluate(() => [...document.querySelectorAll('.v55-codex button')].map((b) => ({ label: b.textContent.trim(), kind: b.getAttribute('data-go') || (b.getAttribute('data-v46') ? 'technique' : '') || b.getAttribute('data-v39') || '' })));
      console.log('    In the Codex: ' + doors.length + ' doors (' + doors.map((d) => d.kind).join(', ') + ')');
      check(slug + ': In the Codex holds its doors (techniques, the Court\'s subject, the grid, the grapes, flashcards and drill)', doors.length >= 5 && ['cmssubject', 'grape', 'flash', 'drill'].every((k) => doors.some((d) => d.kind === k)), JSON.stringify(doors.map((d) => d.kind)));
      for (let i = 0; i < doors.length; i++) {
        const d = doors[i];
        const door = page.locator('.v55-codex button').nth(i);
        await door.scrollIntoViewIfNeeded();
        await door.click();
        try { await page.waitForFunction((h) => location.hash !== h, regionHash, { timeout: 4000 }); } catch (e) { }
        await settle(300);
        const st = await state();
        check(slug + ': the door ' + d.kind + ' (' + d.label + ') opens its screen (' + st.view + ')', st.hash !== regionHash && st.view !== 'region', JSON.stringify(st));
        await page.evaluate(() => { if (typeof stopTimer === 'function') stopTimer(); });
        await back();
        try { await regionReady(slug); } catch (e) { }
        const st2 = await state();
        check(slug + ': Back from ' + d.kind + ' returns to the region', st2.view === 'region' && st2.hash === regionHash && (await lit()) === 'worldmap', JSON.stringify(st2));
      }
      await back();
      const up = await page.evaluate(() => ({ view: S.view, wmap: S.wmap || '', hub: !!document.querySelector('#v55-hub') }));
      check(slug + ': Back returns to the Wine Atlas root', up.view === 'worldmap' && !up.wmap && up.hub, JSON.stringify(up));
    });
  }

  /* France's country page */
  await step('france', async () => {
    await go('#/');
    await atlasRoot();
    const door = page.locator('#v55-c-france');
    await door.scrollIntoViewIfNeeded();
    await door.click();
    await page.waitForFunction(() => S.view === 'country' && S._v39country === 'france' && v39RecReady(v39CountryOf('france')) && document.querySelector('.v55-sheetfig img'), null, { timeout: 30000 });
    await page.waitForFunction(() => { const i = document.querySelector('.v55-sheetfig img'); return i && i.complete && i.naturalWidth > 0; }, null, { timeout: 30000 });
    await settle(300);
    const fr = await page.evaluate(() => ({ hash: location.hash, want: v39SheetRegions('france').length, rows: document.querySelectorAll('.v55-cregions [data-v39="region"]').length, counts: [...document.querySelectorAll('.v55-cregions [data-v55-count]')].filter((n) => /districts? · \d+ on its field map$/.test(n.textContent)).length, door: !!document.querySelector('#view .v45-door'), sections: document.querySelectorAll('.v39-country details').length }));
    check('france: its sheet inline, every region (' + fr.want + ') as a row with its counts, the reading kept, lit Wine Atlas', fr.hash === '#/v/country/france' && fr.rows === fr.want && fr.counts === fr.want && !fr.door && fr.sections >= 2 && (await lit()) === 'worldmap', JSON.stringify(fr));
    await screen('france', true);
    const first = page.locator('.v55-cregions [data-v39="region"]').first();
    const slug = await first.getAttribute('data-slug');
    await first.scrollIntoViewIfNeeded();
    await first.click();
    await regionReady(slug);
    check('france: a region row opens its region (' + slug + ')', (await state()).hash === '#/v/region/' + slug);
    await back();
    check('france: Back from the region returns to France', (await state()).view === 'country' && (await state()).hash === '#/v/country/france', JSON.stringify(await state()));
    await back();
    check('france: Back from France returns to the Wine Atlas root', await page.evaluate(() => S.view === 'worldmap' && !S.wmap && !!document.querySelector('#v55-hub')));
  });

  /* the level page */
  await step('the level page', async () => {
    await go('#/level');
    const l = await page.evaluate(() => ({ view: S.view, door: document.querySelectorAll('.wrap .v36-level-door').length, map: document.querySelectorAll('.wrap [data-go="worldmap"]').length, shop: document.querySelectorAll('.wrap [data-go="techniques"]').length, search: !!document.querySelector('#v32-q') }));
    check('the level page: no World Map row, no illustrated door, no search box, the Workshop row kept', l.view === 'level' && l.door === 0 && l.map === 0 && l.shop === 1 && !l.search, JSON.stringify(l));
    await screen('the level page');
  });

  /* Brennan's rooms */
  await step('the Rehearsal room', async () => {
    await go('#/v/houserehearsal');
    const r = await page.evaluate(() => {
      const html = document.querySelector('.wrap').innerHTML;
      return { own: v28Rows().filter((x) => x.own).length, revisit: (document.querySelector('#v53-housedue .v25row-name') || {}).textContent || '', weak: /data-deck="list-weak"/.test(html), recite: /data-go="cellarrecite"/.test(html), drill: /data-go="cellardrill"/.test(html), flight: /data-go="flight"/.test(html), say: /data-go="housesay"/.test(html), guest: /data-go="houseguest"/.test(html) };
    });
    check('the Rehearsal room: Wine cards to revisit, no list-weak deck, no Blind flight, no own-bottle rows on an empty cellar', r.own === 0 && r.revisit === 'Wine cards to revisit' && !r.weak && !r.flight && !r.recite && !r.drill && r.say && r.guest, JSON.stringify(r));
    await screen('the Rehearsal room');
    for (const k of ['housesay', 'houseguest']) {
      await go('#/v/houserehearsal');
      await page.locator('.wrap [data-go="' + k + '"]').first().click();
      await settle(300);
      const s = await state();
      check('the Rehearsal room opens ' + k, s.view === k, JSON.stringify(s));
      await screen(k);
      await back();
      check('Back from ' + k + ' returns to the Rehearsal room', (await state()).view === 'houserehearsal', JSON.stringify(await state()));
      await page.evaluate(() => { V32.d = 0; });
      await go('#/v/' + k);
      await back();
      check('Back from ' + k + ' with no history climbs to the Rehearsal room', (await state()).view === 'houserehearsal', JSON.stringify(await state()));
    }
  });
  await step('Wine studies', async () => {
    await go('#/v/housestudies');
    const html = await page.evaluate(() => document.querySelector('.wrap').innerHTML);
    const gone = ['route="worldmap"', 'route="serviceref"', 'data-deck="grapes"', 'data-deck="grapes:w"', 'data-deck="grapes:r"', 'data-deck="grapes-all"', 'wider-study'].filter((w) => html.indexOf(w) >= 0);
    check('Wine studies: no World Map, no grape study cards, no service reference; the Culinary Companion kept', gone.length === 0 && html.indexOf('data-v48-route="culinary"') >= 0, gone.join(', '));
    await screen('Wine studies');
  });

  /* cold loads, Back to Home */
  const cold = [['#/v/cellar/' + WINES[0].id, 'cellar'], ['#/quizzes', 'quizzes'], ['#/v/bank', 'bank'], ['#/v/grapes', 'grapes']];
  for (const [hash, v] of cold) {
    await step('the cold load of ' + hash, async () => {
      await boot(hash);
      const s0 = await state();
      const trail = [s0.view];
      for (let i = 0; i < 5 && trail[trail.length - 1] !== 'home'; i++) { await back(); trail.push((await state()).view); }
      check('a cold load of ' + hash + ' draws ' + v + ' and Back climbs to Home (' + trail.join(' > ') + ')', s0.view === v && trail[trail.length - 1] === 'home' && trail.length <= 4, JSON.stringify(trail));
    });
  }

  /* codex55: cold reloads of a region, the Wine Atlas root and the Library, Back climbing through their parents to Home */
  const coldAtlas = [['#/v/region/burgundy', ['region', 'country', 'regions', 'worldmap', 'home']], ['#/v/worldmap', ['worldmap', 'home']], ['#/library', ['library', 'more', 'home']]];
  for (const [hash, want] of coldAtlas) {
    await step('the cold reload of ' + hash, async () => {
      await boot(hash);
      if (want[0] === 'region') { await regionReady('burgundy'); await settle(200); }
      const s0 = await state();
      const first = await page.evaluate(() => ({ map: !!document.querySelector('.v55-map .v45-figure'), hub: !!document.querySelector('#v55-hub'), lib: !!document.querySelector('.v53-reading') }));
      const trail = [s0.view];
      const lits = [await lit()];
      for (let i = 0; i < 6 && trail[trail.length - 1] !== 'home'; i++) { await back(); trail.push((await state()).view); lits.push(await lit()); }
      const drawn = want[0] === 'region' ? first.map : (want[0] === 'worldmap' ? first.hub : first.lib);
      check('a cold reload of ' + hash + ' draws ' + want[0] + ' whole and Back climbs ' + want.slice(1).join(', ') + ' (' + trail.join(' > ') + '; lit ' + lits.join(' > ') + ')', drawn && JSON.stringify(trail) === JSON.stringify(want) && lits[lits.length - 1] === 'home' && lits.slice(0, -1).every((w) => w === (want[0] === 'library' ? 'more' : 'worldmap')), JSON.stringify({ trail, lits, first }));
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
totals.forEach((t) => console.log('walk54 ' + t.width + ' ' + t.mode + ': ' + t.ok + ' ok, ' + t.bad + ' failed'));
const failed = totals.reduce((s, t) => s + t.bad, 0);
console.log('walk54: ' + totals.reduce((s, t) => s + t.ok, 0) + ' ok, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
