/* prove-course-dom.mjs: THE WINE ATLAS MADE A COURSE in Chromium (codex56, 2 November 2026). Work in progress.

   On the served source, at 375 px at night and 390 px by day (and the root and a region page at 375 by day and 390 at
   night), each in an isolated profile: the course order from the root's Start here through the study row's Next; the
   due counts on seeded grades; the root's sections in order, with no reading fetched on the visit; Burgundy and Rioja
   with the study row sticking under Back, every chip at least 44 px, In one minute, the inline map waiting for the
   view and loading as it nears it, The districts showing eight and then all, a district marked beside itself with the
   page left where it was, a jump chip landing its section under the row; a map quiz answered both ways, by a tap at
   the dot and by name, its key never shown; district cards dealt and graded; compare two regions side by side; the
   folded addresses (a field map, the field atlas, the regions index) landing on the region page and the root; an
   article off the map from a fixture copy of the index; no sideways scroll; a clean console.

     PLAYWRIGHT_MODULE=... OOT_SHARED=... OOT_HOUSE_PACK=... SITE_ROOT=<a root whose shared/ is WorldTable's
     static/shared> node .wip/prove-course-dom.mjs

   It starts .wip/serve.mjs twice on free ports (the source, and a fixture tree whose index carries one article off
   the map) and stops both. FIXTURE_DIR names where the fixture tree is made (default: a folder under the system's
   temporary directory). */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, '..');
const { offMapFixture } = require(path.join(HERE, 'prove-course.cjs'));

let passed = 0, failed = 0;
const fails = [];
function check(what, ok, detail) {
  if (ok) { passed++; console.log('  ok    ' + what); }
  else { failed++; fails.push(what); console.log('  FAIL  ' + what + (detail ? '  :: ' + String(detail).slice(0, 600) : '')); }
}
const section = (name) => { console.log(''); console.log('--- ' + name + ' ---'); };

/* ---------------- the servers ---------------- */
const servers = [];
const freePort = () => new Promise((res) => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)); }); });
async function startServer(codexSrc) {
  const port = await freePort();
  const child = spawn(process.execPath, [path.join(HERE, 'serve.mjs'), String(port)], { env: Object.assign({}, process.env, { CODEX_SRC: codexSrc }), stdio: ['ignore', 'pipe', 'inherit'] });
  servers.push(child);
  await new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('serve.mjs did not start')), 15000);
    child.stdout.on('data', (b) => { if (/serve: http/.test(String(b))) { clearTimeout(t); res(); } });
    child.on('exit', (c) => rej(new Error('serve.mjs exited ' + c)));
  });
  return 'http://127.0.0.1:' + port + '/codex/';
}
const stopServers = () => servers.forEach((s) => { if (s.exitCode === null) { try { s.kill('SIGTERM'); } catch (e) { } } });
process.on('exit', stopServers);
process.on('SIGINT', () => { stopServers(); process.exit(130); });

/* the fixture tree: the source by symbolic links, its index and France's reading replaced by the fixture's */
function fixtureTree() {
  const OFF = offMapFixture();
  if (OFF.shipped) return { dir: SRC, slug: OFF.slug, from: 'the shipped index (' + OFF.shipped.join(', ') + ')' };
  const dir = process.env.FIXTURE_DIR || path.join(os.tmpdir(), 'codex56-offmap-fixture');
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(path.join(dir, 'js', 'regions'), { recursive: true });
  for (const f of fs.readdirSync(SRC)) { if (f !== 'js' && f !== '.git') fs.symlinkSync(path.join(SRC, f), path.join(dir, f)); }
  for (const f of fs.readdirSync(path.join(SRC, 'js'))) {
    if (f === 'regions' || f === 'data-regions.js') continue;
    fs.symlinkSync(path.join(SRC, 'js', f), path.join(dir, 'js', f));
  }
  fs.writeFileSync(path.join(dir, 'js', 'data-regions.js'), OFF.fixture['data-regions.js']);
  for (const f of fs.readdirSync(path.join(SRC, 'js', 'regions'))) {
    const name = f.replace(/\.json$/, '');
    if (OFF.fixture.regions[name] != null) fs.writeFileSync(path.join(dir, 'js', 'regions', f), OFF.fixture.regions[name]);
    else fs.symlinkSync(path.join(SRC, 'js', 'regions', f), path.join(dir, 'js', 'regions', f));
  }
  return { dir, slug: OFF.slug, from: 'a fixture copy of the index carrying ' + OFF.from };
}

const BASE = await startServer(SRC);
const FX = fixtureTree();
const FXBASE = await startServer(FX.dir);
const logs = [];

/* ---------------- a profile ---------------- */
async function profile(browser, width, mode, base) {
  const ctx = await browser.newContext({ viewport: { width, height: width === 375 ? 812 : 844 }, serviceWorkers: 'block' });
  await ctx.addInitScript((m) => { try { localStorage.setItem('oot.service.v1', m); } catch (e) { } }, mode);
  const page = await ctx.newPage();
  const tag = width + ' ' + mode;
  page.fetched = [];
  page.on('pageerror', (e) => logs.push(tag + ' pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') logs.push(tag + ' ' + m.type() + ': ' + m.text()); });
  page.on('request', (r) => { if (/\/js\/regions\/[a-z0-9-]+\.json/.test(r.url())) page.fetched.push(r.url().replace(/^.*\/js\/regions\//, '').replace(/\?.*$/, '')); });
  page.on('dialog', (d) => d.accept());
  let n = 0;
  page.boot = async (hash, wait) => {
    await page.goto((base || BASE) + '?nosw&c56=' + (++n) + (hash || ''), { waitUntil: 'load' });
    await page.waitForFunction(() => typeof V32 !== 'undefined' && V32.booted && typeof v56Course === 'function', null, { timeout: 30000 });
    await page.waitForTimeout(wait || 400);
  };
  page.settle = (ms) => page.waitForTimeout(ms || 250);
  page.state = () => page.evaluate(() => ({ view: S.view, hash: location.hash }));
  page.wide = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  page.small = (sel) => page.evaluate((sel) => {
    const out = [];
    document.querySelectorAll(sel).forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') return;
      if (r.height < 43.5 || r.width < 43.5) out.push((el.id ? '#' + el.id : el.tagName.toLowerCase()) + ' "' + (el.textContent || '').trim().slice(0, 24) + '" ' + Math.round(r.width) + 'x' + Math.round(r.height));
    });
    return out;
  }, sel);
  page.waitReady = (slug) => page.waitForFunction((s) => typeof v39RecReady === 'function' && v39RecReady(v39Find(s)) && !!document.querySelector('#v56-read'), slug, { timeout: 20000 });
  return { ctx, page };
}

/* ---------------- the walk ---------------- */
async function walk(browser, width, mode, full) {
  section(width + ' px, ' + mode + (full ? '' : ' (the root and a region page)'));
  const { ctx, page } = await profile(browser, width, mode);
  const W = width + ' ' + mode + ': ';

  /* the root, on a fresh profile: no reading fetched on the visit */
  await page.boot('#/v/worldmap', 900);
  const root = await page.evaluate(() => {
    const at = (sel) => { const n = document.querySelector(sel); return n ? n.getBoundingClientRect().top + scrollY : -1; };
    return {
      start: (document.querySelector('#v56-start-h') || {}).textContent, cont: (document.querySelector('#v56-continue') || {}).textContent,
      doors: Array.from(document.querySelectorAll('.v56-studydoors .v25row-name')).map((n) => n.textContent),
      countries: document.querySelectorAll('.v56-countryrows [data-v39="country"]').length,
      lines: Array.from(document.querySelectorAll('.v56-countryrows .v25row-line')).slice(0, 2).map((n) => n.textContent),
      order: [at('.v56-start'), at('.v56-studydoors'), at('#v55-find'), at('.v56-countries'), at('section.v55-sheets'), at('section.v55-regions')],
      sheets: document.querySelectorAll('section.v55-sheets [data-v39="openmap"]').length,
      regions: document.querySelectorAll('section.v55-regions [data-v39="region"]').length
    };
  });
  check(W + 'the root opens on the learner: ' + root.start + ', "' + root.cont + '"; the doors ' + root.doors.join(', '), root.start === 'Start here' && root.cont === 'Begin with Champagne' && root.doors.join('|') === 'Today’s region cards|Drill a country|Map quiz|District cards|Compare two regions', JSON.stringify(root));
  check(W + 'then every country with its readiness (' + root.countries + ': "' + root.lines[0] + '"), the 17 sheets and every region (' + root.regions + '), in that order', root.countries === 24 && /^0 of \d+ read · 0 of \d+ cards known · 0 of \d+ questions right$/.test(root.lines[0]) && root.sheets === 17 && root.regions >= 115 && root.order.every((y, i) => y > 0 && (i === 0 || y > root.order[i - 1])), JSON.stringify(root.order));
  check(W + 'the visit fetched no reading (' + page.fetched.length + ')', page.fetched.length === 0, page.fetched.join(' '));
  check(W + 'the root: every control at least 44 px, no sideways scroll', (await page.small('.wrap .v56 button, .wrap .v56-countryrows button')).length === 0 && await page.wide(), (await page.small('.wrap .v56 button')).join('; '));

  /* the course from the root: Start here opens Champagne, the row's Next moves on to Burgundy */
  await page.click('#v56-continue');
  await page.settle(400);
  const s1 = await page.state();
  check(W + 'Start here opens the first step (' + s1.hash + ')', s1.view === 'region' && s1.hash === '#/v/region/champagne', JSON.stringify(s1));
  await page.waitReady('champagne');
  await page.click('#v56-s-next');
  await page.settle(400);
  const s2 = await page.state();
  check(W + 'the study row\'s Next moves the course on to Burgundy, the screen replaced (' + s2.hash + ')', s2.view === 'region' && s2.hash === '#/v/region/burgundy', JSON.stringify(s2));
  await page.waitReady('burgundy');

  for (const slug of ['burgundy', 'rioja']) {
    if (slug !== 'burgundy') { await page.boot('#/v/region/' + slug, 600); await page.waitReady(slug); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.settle(300);
    const p0 = await page.evaluate(() => {
      const row = document.querySelector('.v56-srow');
      const img = document.querySelector('.v55-mapfig img');
      return {
        chips: Array.from(row.querySelectorAll('button')).map((b) => b.textContent),
        minute: Array.from(document.querySelectorAll('.v56-minute dt')).map((n) => n.textContent),
        lazy: img ? [img.hasAttribute('data-v56-lazy'), (img.getAttribute('src') || '').slice(0, 5), img.getBoundingClientRect().top - innerHeight] : null
      };
    });
    check(W + slug + ': the study row reads ' + p0.chips.join(', '), p0.chips.join('|') === 'Summary|Map|Districts|Read|Flash|Drill|Map quiz|Previous|Next', JSON.stringify(p0.chips));
    check(W + slug + ': In one minute: ' + p0.minute.join(', '), p0.minute.join('|') === 'The climate|The main grapes|The ladder|One exam line|One trap');
    check(W + slug + ': every chip of the row at least 44 px, the row on one line that scrolls on its own, no sideways scroll of the page', (await page.small('.v56-srow button')).length === 0 && await page.wide() && await page.evaluate(() => { const r = document.querySelector('.v56-srow'); const b = r.querySelectorAll('button'); return b[0].getBoundingClientRect().top === b[b.length - 1].getBoundingClientRect().top; }));
    if (p0.lazy && p0.lazy[2] > 220) check(W + slug + ': the inline map waits while it is ' + Math.round(p0.lazy[2]) + ' px below the view (a blank of its shape)', p0.lazy[0] === true && p0.lazy[1] === 'data:', JSON.stringify(p0.lazy));
    await page.evaluate(() => { const f = document.querySelector('.v55-mapfig'); window.scrollTo(0, f.getBoundingClientRect().top + scrollY - innerHeight + 60); });
    await page.waitForFunction(() => { const i = document.querySelector('.v55-mapfig img'); return i && !i.hasAttribute('data-v56-lazy') && i.complete && i.naturalWidth > 0; }, null, { timeout: 15000 }).catch(() => { });
    const loaded = await page.evaluate(() => { const i = document.querySelector('.v55-mapfig img'); return [i.hasAttribute('data-v56-lazy'), i.getAttribute('src'), i.naturalWidth]; });
    check(W + slug + ': as it nears the view the artwork loads (' + loaded[1] + ', ' + loaded[2] + ' wide)', loaded[0] === false && /^maps\/regions-v1\//.test(loaded[1]) && loaded[2] === 1200, JSON.stringify(loaded));
    /* the sticky row under Back, further down */
    await page.evaluate(() => { const d = document.querySelector('.v55-districts'); window.scrollTo(0, d.getBoundingClientRect().top + scrollY + 200); });
    await page.settle(300);
    const stuck = await page.evaluate(() => { const r = document.querySelector('.v56-srow').getBoundingClientRect(); const b = document.querySelector('#view > .v32back').getBoundingClientRect(); return { row: r.top, h: r.height, back: b.bottom }; });
    check(W + slug + ': scrolled into The districts, the study row sticks under Back (row at ' + stuck.row.toFixed(1) + ', Back ends at ' + stuck.back.toFixed(1) + ')', Math.abs(stuck.row - stuck.back) <= 1.5 && stuck.h >= 50, JSON.stringify(stuck));
    /* eight districts, then all */
    const shown = () => page.evaluate(() => Array.from(document.querySelectorAll('.v55-districts li.v55-d')).filter((li) => li.offsetParent !== null).length);
    const total = await page.evaluate(() => document.querySelectorAll('.v55-districts li.v55-d').length);
    const few = await shown();
    await page.click('#v56-alld');
    await page.settle(150);
    const all = await shown();
    check(W + slug + ': The districts show ' + few + ', then all ' + all + ' of ' + total + ' with Show all', few === 8 && all === total && total > 8, JSON.stringify({ few, all, total }));
    /* a district marked: the page stays, the mark beside it and on the map */
    const pinSel = '.v55-districts [data-v55="pin"]';
    await page.evaluate((sel) => { const b = document.querySelector(sel); window.scrollTo(0, b.getBoundingClientRect().top + scrollY - 300); }, pinSel);
    await page.settle(200);
    const y0 = await page.evaluate(() => scrollY);
    await page.click(pinSel);
    await page.settle(500);
    const mark = await page.evaluate((sel) => {
      const b = document.querySelector(sel);
      const inset = b.closest('.v55-pinrow').nextElementSibling;
      const ring = inset && inset.querySelector('.v56-inset-ring');
      const pic = inset && inset.querySelector('img');
      const ir = inset ? inset.getBoundingClientRect() : null, rr = ring ? ring.getBoundingClientRect() : null, pr = pic ? pic.getBoundingClientRect() : null;
      /* the ring's centre, read back into the artwork's units through the inset's own image box */
      const svgX = pr ? (rr.left + rr.width / 2 - pr.left) / pr.width * 1200 : null, svgY = pr ? (rr.top + rr.height / 2 - pr.top) / pr.height * 1500 : null;
      const pin = document.querySelector('.v55-mapfig .v55-pin');
      return { y: scrollY, pressed: b.getAttribute('aria-pressed'), inset: !!(inset && inset.classList.contains('v56-inset')), loaded: pic ? pic.naturalWidth : 0, svg: [svgX, svgY], want: [Number(b.getAttribute('data-x')), Number(b.getAttribute('data-y'))], mapMark: pin ? !pin.hidden : false, said: (document.querySelector('#v55-pin-said') || {}).textContent, insetH: ir ? ir.height : 0,
        colour: [getComputedStyle(b).color, getComputedStyle(b).backgroundColor] };
    }, pinSel);
    check(W + slug + ': a district marked leaves the page where it was (' + y0 + ' to ' + mark.y + ') and shows the mark beside the district, on its dot (' + mark.svg.map((v) => v && v.toFixed(1)).join(', ') + ' for ' + mark.want.join(', ') + '), and on the map', Math.abs(mark.y - y0) <= 2 && mark.pressed === 'true' && mark.inset && mark.loaded === 1200 && Math.hypot(mark.svg[0] - mark.want[0], mark.svg[1] - mark.want[1]) < 3 && mark.mapMark && /is marked beside it and on the map/.test(mark.said), JSON.stringify(mark));
    check(W + slug + ': the pressed district button is legible (' + mark.colour.join(' on ') + ')', mark.colour[0] !== mark.colour[1], JSON.stringify(mark.colour));
    /* a jump chip lands its section under the row */
    await page.click('#v56-s-map');
    await page.settle(400);
    const jump = await page.evaluate(() => { const h = document.querySelector('#v55-map-h').getBoundingClientRect(); const r = document.querySelector('.v56-srow').getBoundingClientRect(); return { h: h.top, under: r.bottom, focus: document.activeElement && document.activeElement.id }; });
    check(W + slug + ': the Map chip lands The map just under the row (' + jump.h.toFixed(0) + ' under ' + jump.under.toFixed(0) + ')', jump.h >= jump.under - 1 && jump.h <= jump.under + 24, JSON.stringify(jump));
    if (!full) break;
  }
  if (!full) { await ctx.close(); return; }

  /* the due counts on seeded grades */
  await page.evaluate(() => {
    const o = v56Rec(); const y = v56AddDays(-1), t = v56Today(), f = v56AddDays(5);
    o.c['champagne/0'] = { ef: 2.5, iv: 1, n: 1, due: y }; o.c['champagne/1'] = { ef: 2.5, iv: 0, n: 0, due: t }; o.c['france/0'] = { ef: 2.3, iv: 3, n: 2, due: y }; o.c['mosel/0'] = { ef: 2.5, iv: 8, n: 3, due: f };
    const qs = v39Questions(['champagne']); o.q[qs[0].id] = { ef: 2.5, iv: 1, n: 1, due: y }; o.q[qs[1].id] = { ef: 2.5, iv: 0, n: 0, due: t }; o.q[qs[2].id] = { ef: 2.5, iv: 3, n: 2, due: f };
    v56Put(o);
  });
  await page.boot('#/v/worldmap', 600);
  const due = await page.evaluate(() => ({ today: (document.querySelector('#v56-today .v25row-line') || {}).textContent, drill: !!document.querySelector('#v56-duedrill'), cont: (document.querySelector('#v56-continue') || {}).textContent, next: v56Progress().next.name, read: v56Progress().read }));
  check(W + 'the due counts on seeded grades: "' + due.today + '", the questions their own door; Continue with the first unread step (' + due.cont + ', ' + due.read + ' read)', due.today === '3 cards and 2 questions due' && due.drill && due.cont === 'Continue with ' + due.next && due.next === 'Bordeaux', JSON.stringify(due));
  await page.click('#v56-today');
  await page.settle(400);
  const run = await page.evaluate(() => ({ view: S.view, deck: S._v32run && S._v32run.deckId, n: S._v32run && S._v32run.total, lit: (document.querySelector('nav.v32nav [aria-current="page"]') || {}).getAttribute ? document.querySelector('nav.v32nav [aria-current="page"]').getAttribute('data-nav') : '' }));
  check(W + 'Today\'s region cards deals the three due on the card screen, Wine Atlas lit', run.view === 'housedeck' && run.deck === 'regionsdue' && run.n === 3 && run.lit === 'worldmap', JSON.stringify(run));

  /* the map quiz, answered both ways */
  await page.boot('#/v/v56mapquiz/burgundy', 900);
  await page.waitForFunction(() => { const i = document.querySelector('.v56-qfig img'); return i && i.complete && i.naturalWidth > 0; }, null, { timeout: 15000 }).catch(() => { });
  const q = await page.evaluate(() => { const it = V56_Q.items[V56_Q.i]; return { mode: it.mode, name: it.p.name, n: it.p.n, x: it.p.x, y: it.p.y }; });
  /* the figure's inner box (inside its one pixel frame) read in the artwork's units */
  const crop = await page.evaluate(() => { const fig = document.querySelector('.v56-qfig'); const f = fig.getBoundingClientRect(); const i = fig.querySelector('img').getBoundingClientRect(); const t = f.top + fig.clientTop, b = t + fig.clientHeight; return { top: (t - i.top) / i.height * 1500, bottom: (b - i.top) / i.height * 1500, overflow: getComputedStyle(fig).overflow }; });
  check(W + 'the map quiz shows the map alone: the artwork from ' + crop.top.toFixed(0) + ' to ' + crop.bottom.toFixed(0) + ' of its 1500 units, the key under it (from 980) cut away', Math.abs(crop.top - 270) < 2 && crop.bottom > 900 && crop.bottom <= 921 && crop.overflow === 'hidden', JSON.stringify(crop));
  const box = await page.evaluate(() => { const r = document.querySelector('.v56-qfig img').getBoundingClientRect(); return { left: r.left, top: r.top, width: r.width, height: r.height }; });
  /* a tap a pixel off the dot, as a finger lands */
  await page.mouse.click(box.left + q.x / 1200 * box.width + 1, box.top + q.y / 1500 * box.height - 1);
  await page.settle(300);
  const f1 = await page.evaluate(() => (document.querySelector('#v56-qfeed') || {}).textContent);
  check(W + 'a find question (' + q.name + ') answered by a tap at its dot: "' + f1 + '"', q.mode === 'find' && f1 === 'Right: number ' + q.n + ' is ' + q.name + '.', JSON.stringify({ q, f1 }));
  await page.click('#v56-qnext');
  await page.settle(300);
  const q2 = await page.evaluate(() => { const it = V56_Q.items[V56_Q.i]; return { mode: it.mode, name: it.p.name, n: it.p.n }; });
  const optBtns = await page.$$('.v56-qopts [data-v56="qpick"]');
  for (const b of optBtns) { if ((await b.textContent()) === q2.name) { await b.click(); break; } }
  await page.settle(300);
  const f2 = await page.evaluate(() => (document.querySelector('#v56-qfeed') || {}).textContent);
  check(W + 'a name question answered from four: "' + f2 + '"', q2.mode === 'name' && optBtns.length === 4 && f2 === 'Right: number ' + q2.n + ' is ' + q2.name + '.', JSON.stringify({ q2, f2 }));
  check(W + 'the map quiz: every control at least 44 px, no sideways scroll, its address #/v/v56mapquiz/burgundy', (await page.small('.v56-quiz button')).length === 0 && await page.wide() && (await page.state()).hash === '#/v/v56mapquiz/burgundy', (await page.small('.v56-quiz button')).join('; '));

  /* district cards */
  await page.boot('#/flashcards/districts:burgundy', 900);
  await page.waitForFunction(() => typeof v39RecReady === 'function' && v39RecReady(v39Find('burgundy')), null, { timeout: 15000 });
  await page.evaluate(() => { V32.pend = 'replace'; render(); });
  await page.settle(300);
  const dk = await page.evaluate(() => ({ view: S.view, title: (document.querySelector('#view h2') || {}).textContent, n: v32DeckDef('districts:burgundy').cards.length }));
  await page.evaluate(() => v32StartRun('districts:burgundy', { keepOrder: true, push: true }));
  await page.settle(300);
  const front = await page.evaluate(() => (document.querySelector('#v32-face') || {}).textContent);
  await page.click('#v32-face');
  await page.settle(250);
  const back = await page.evaluate(() => (document.querySelector('#v32-face') || {}).textContent);
  check(W + 'district cards: ' + dk.title + ' (' + dk.n + '), the front asks for the region and the note, the back gives them', dk.view === 'deck' && dk.n > 20 && /Its region, and what it is known for/.test(front) && /Burgundy: /.test(back), JSON.stringify({ dk, front: front.slice(0, 80), back: back.slice(0, 80) }));

  /* compare two regions */
  await page.boot('#/v/v56compare/burgundy~rioja', 600);
  await page.waitForFunction(() => document.querySelectorAll('.v56-cmpsec').length === 6, null, { timeout: 20000 }).catch(() => { });
  const cmp = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.v56-cmprow'));
    return { n: document.querySelectorAll('.v56-cmpsec').length, heads: Array.from(document.querySelectorAll('.v56-cmpsec h3')).map((h) => h.textContent), side: rows.every((r) => { const c = r.children; const a = c[0].getBoundingClientRect(), b = c[1].getBoundingClientRect(); return Math.abs(a.top - b.top) < 1 && b.left > a.right && a.width > 130 && b.width > 130; }) };
  });
  check(W + 'compare Burgundy and Rioja: ' + cmp.heads.join(', ') + ', each side by side', cmp.n === 6 && cmp.side && await page.wide(), JSON.stringify(cmp));

  /* the folded addresses */
  for (const [hash, want, extra] of [['#/v/fieldmap/burgundy', '#/v/region/burgundy'], ['#/v/fieldatlas', '#/v/worldmap'], ['#/v/regions', '#/v/worldmap', 'countries']]) {
    await page.boot(hash, 700);
    const st = await page.state();
    let ok = st.hash === want;
    let note = '';
    if (extra === 'countries') {
      const top = await page.evaluate(() => { const h = document.querySelector('#v55-countries-h'); return h ? h.getBoundingClientRect().top : -1; });
      ok = ok && top >= 40 && top < 160;
      note = ', at its countries (' + Math.round(top) + ' px down)';
    }
    check(W + 'the folded address ' + hash + ' lands on ' + want + note, ok, JSON.stringify(st));
  }
  await ctx.close();
}

/* ---------------- the article off the map ---------------- */
async function offMap(browser) {
  section('an article off the map: ' + FX.slug + ', from ' + FX.from);
  const { ctx, page } = await profile(browser, 375, 'night', FXBASE);
  await page.boot('#/v/worldmap', 700);
  const line = await page.evaluate((s) => (document.querySelector('[data-v55-count="' + s + '"]') || {}).textContent, FX.slug);
  check('the root lists it under France, its line "' + line + '"', /field map to come$/.test(line || ''), line);
  await page.boot('#/v/region/' + FX.slug, 600);
  await page.waitReady(FX.slug);
  const pg = await page.evaluate(() => ({ come: (document.querySelector('.v56-tocome') || {}).textContent, sheet: !!document.querySelector('.v55-sheetfig[data-v55-sheet="france"]'), chips: Array.from(document.querySelectorAll('.v56-srow button')).map((b) => b.textContent), districts: !!document.querySelector('#v55-districts-h') }));
  check('its page shows France\'s sheet with "' + (pg.come || '').slice(0, 60) + '...", its study row ' + pg.chips.join(', '), pg.sheet && /is to come/.test(pg.come || '') && pg.chips[1] === 'Map' && pg.chips.indexOf('Map quiz') < 0 && pg.districts, JSON.stringify(pg));
  check('its page: no sideways scroll, every chip at least 44 px', await page.wide() && (await page.small('.v56-srow button')).length === 0);
  await ctx.close();
}

const browser = await chromium.launch();
try {
  await walk(browser, 375, 'night', true);
  await walk(browser, 390, 'day', true);
  await walk(browser, 375, 'day', false);
  await walk(browser, 390, 'night', false);
  await offMap(browser);
  section('the console');
  const noisy = logs.filter((l) => !/favicon/.test(l));
  check('a clean console across every walk (' + logs.length + ' lines)', noisy.length === 0, noisy.slice(0, 8).join(' | '));
} catch (e) {
  check('the proof ran to its end', false, e && e.stack || e);
} finally {
  await browser.close();
  stopServers();
}
console.log('');
if (failed) { console.log('prove-course-dom: ' + failed + ' of ' + (passed + failed) + ' checks FAILED'); fails.forEach((f) => console.log('  ' + f)); process.exit(1); }
console.log('prove-course-dom: all ' + passed + ' checks passed');
process.exit(0);
