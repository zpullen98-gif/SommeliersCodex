#!/usr/bin/env node
/* THE CMS EDITION IN A BROWSER: the final chain, the house under its own tab (codex53, 29 October 2026).

   Playwright on the final chain index.html loads, in an isolated profile with the canonical shared house pack
   (check-house-flow's route idiom), never the owner's browser or stored answers. It proves:

   1. the bar: Home, the house, CMS, Grapes, Library and More, in that order, as nav.v32nav with no v47nav class;
      the due pill on Library alone; the house's name as codex41 escapes it; one row at 320, 375 and 390 px, night
      and day, every tab at least 44 px, every word whole, no sideways scroll
   2. the lit word on every owner: Library on the six atlas views, the Practise root, a deck, Quizzes, the bank,
      the Library and the quick quiz; CMS on its six views; Grapes on its four; the house on its four rooms, a wine's
      card, a house deck and a house drill
   3. the cold Back chains: CMS to Home; a subject to CMS to Home; a grape to Grapes to Home; the bank, the Practise
      root and the readings to Library to Home; a country sheet to the World Map to Library to Home; a field map to
      the field atlas, the World Map, Library and Home
   4. the house-only sweep: Home (outside the bar and its one row to the house), the level page, the Practise root,
      the Library, Quizzes and the bank draw no house deck, no house door, no wine or house question id and never
      "our list" or "My restaurant"; ten quick deals carry no house question, two from the regions and eight from
      the level's bank; Due today is the level's alone and deals no house question; the Library's search for
      Minuty, Brennan and Champagne finds no house wine, no record of the person's own and no Compass row
   5. every piece taken off is found in its room: the house's due, the producers' and the components' decks, the
      cellar selection, the wine cards, the drills and the rehearsals in Service rehearsal; the Compass, the
      Culinary Companion and the house videos in Wine studies; the producers and the full list in House reference
   6. the bank: its counts are the real bank's, Drill and Exam stand on every category at 44 px, and the mock deals
      70 at Régionale in 45 minutes, 45 at Village in 38, 60 at Premier Cru in 35 and the Gauntlet's 50 in 50
   7. the Court's grid: a glass of Chardonnay answered perfectly is right on every line once the sale is self
      marked, and kept per device in oot-codex-courtgrid-v1
   8. the Village tasting on the Court's grid: four glasses, the two whites first, the clock at 1800 seconds, its
      end time kept across a render and held while away
   9. codexStats unchanged across the whole walk, and no page error

   Usage: node .scripts/check-house-only.cjs [codexRoot] [playwrightModule]
   CODEX_URL targets a served edition (the source served with the site's shared layer, or the public wing);
   without it the files are routed from codexRoot (default this repo) with the pack from OOT_SHARED.
   PLAYWRIGHT_MODULE names Playwright; CODEX_SHOTS an existing folder for the walk's screenshots at 390;
   CODEX_REPORT a JSON file for the results. Every check runs; the last line is the verdict, exit 1 on any failure. */
'use strict';
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const shared = path.resolve(process.env.OOT_SHARED || 'C:/Users/zpull/WorldTable/static/shared');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || process.argv[3] || 'C:/Users/zpull/WorldTable/node_modules/playwright');
const base = (process.env.CODEX_URL || 'http://codex.test/codex/').replace(/\/?$/, '/');
const SHOTS = process.env.CODEX_SHOTS || '';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const WORDS = 'home,brennans,cms,grapes,library,more';
const HOUSE_DECK = /data-deck="(list|list:[^"]*|list-weak|one:[^"]*|bottles|bottles:[^"]*|menu-words|misses|due|cellar-compass|cellar-path:[^"]*|producers|producers:[^"]*|components|components:[^"]*|components-all|item-[^"]*|v51-recovery)"/;
const HOUSE_DOOR = /data-(go|v32|v48-route)="(brennans|houseproducers|housestudies|houserehearsal|housereference|cellarcompass|fullwine|housevideos|drilllist|cellarrecite|houserecite|housepair|housesay|houseguest|cellardrill|house|housereview|culinary)"/;
const HOUSE_ID = /data-id="w-|data-q="h-|"h-[a-z0-9]{8}|data-v28="open"/;
const HOUSE_WORDS = /our list|My restaurant/;
const results = [], errors = [];
let n = 0;
function check(name, pass, detail) {
  results.push({ name, pass: !!pass });
  console.log((pass ? 'PASS ' : 'FAIL ') + name + (!pass && detail ? '  :: ' + String(detail).slice(0, 600) : ''));
}
async function step(name, fn) {
  try { await fn(); } catch (e) { check(name + ' (the step ran to its end)', false, e.message.split('\n')[0]); }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 }, timezoneId: 'America/New_York' });
    if (!process.env.CODEX_URL) await context.route('**/*', async route => {
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
    function watch(page) {
      page.on('pageerror', e => errors.push(e.message));
      page.on('dialog', d => d.accept());
      return page;
    }
    const page = watch(await context.newPage());
    async function boot(target, hash) {
      await target.goto(base + '?nosw&check=house-only-' + (++n) + hash);
      await target.waitForFunction(() => typeof V32 !== 'undefined' && V32.booted && typeof _v53NavHtml === 'function' && typeof v32HasHouse === 'function' && v32HasHouse());
      await target.waitForTimeout(150);
    }
    const go = hash => boot(page, hash);
    const view = (target, v) => target.waitForFunction(v => S.view === v, v);
    const lit = target => target.evaluate(() => { const b = document.querySelector('nav.v32nav [aria-current="page"]'); return b ? b.getAttribute('data-nav') : ''; });
    const shot = async name => { if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: path.join(SHOTS, 'house-only-' + name + '.png'), fullPage: true }); } };
    const body = async () => page.evaluate(() => {
      const box = document.querySelector('.wrap') || document.body, nav = document.querySelector('nav.appnav.v32nav');
      return box.innerHTML.replace(nav ? nav.outerHTML : '', '');
    });
    function sweepProblems(html, home) {
      const out = [];
      const deck = html.match(HOUSE_DECK); if (deck) out.push('a house deck ' + deck[0]);
      const rest = home ? html.replace(/data-go="brennans"/, '') : html;
      if (home && (html.match(/data-go="brennans"/g) || []).length !== 1) out.push('Home holds ' + (html.match(/data-go="brennans"/g) || []).length + ' rows to the house, not one');
      const door = rest.match(HOUSE_DOOR); if (door) out.push('a house door ' + door[0]);
      const id = html.match(HOUSE_ID); if (id) out.push('a house id ' + id[0]);
      const at = html.search(HOUSE_WORDS); if (at >= 0) out.push('the words ' + JSON.stringify(html.slice(Math.max(0, at - 80), at + 40).replace(/<[^>]+>/g, ' ')));
      return out;
    }

    /* the walk starts at Village, chosen as a card tap chooses it (a fresh profile opens on the lowest level not yet
       met), with one weak wine on the house's list, so the house's due has something to deal */
    await go('#/v/brennans');
    await page.evaluate(() => { if (typeof v25Choose === 'function') v25Choose(); applyLevel('certified', true); const id = v28Rows()[0].id; ST.q['h-' + id + '-card'] = { c: 0, w: 1, s: 0 }; stSave(); render(); });
    await page.waitForTimeout(150);
    const stats0 = await page.evaluate(() => localStorage.getItem('codexStats'));
    const SUBJECT = await page.evaluate(() => { const ids = v53Subjects().map(s => s.id); return ids.indexOf('bordeaux') >= 0 ? 'bordeaux' : ids[0]; });

    /* 1. the bar */
    await step('the bar', async () => {
      await go('#/');
      const bar = await page.evaluate(() => {
        const nav = document.querySelector('nav.v32nav'), due = v32DueToday().total, pills = [...document.querySelectorAll('nav.v32nav .v32pill')];
        return { words: [...nav.querySelectorAll('[data-nav]')].map(b => b.dataset.nav).join(','), v47: document.querySelectorAll('.v47nav').length, due, pills: pills.map(p => p.closest('[data-nav]').dataset.nav), pill: pills[0] ? Number.parseInt(pills[0].textContent, 10) : 0, house: document.querySelector('#nav-brennans').textContent, word: v41TabWord() };
      });
      check('the bar reads ' + WORDS + ', as nav.v32nav with no v47nav class', bar.words === WORDS && bar.v47 === 0, JSON.stringify(bar));
      check('the due pill rides on Library alone, with Due today\'s count', bar.due ? (bar.pills.join() === 'library' && bar.pill === bar.due) : bar.pills.length === 0, JSON.stringify(bar));
      check('the second word is the house\'s name as codex41 gives it', bar.house === bar.word && !!bar.word, JSON.stringify(bar));
      for (const width of [320, 375, 390]) for (const service of ['day', 'night']) {
        await page.setViewportSize({ width, height: 844 });
        await page.evaluate(s => { OOT.service.set(s); render(); }, service);
        await page.waitForTimeout(80);
        const lay = await page.evaluate(() => {
          const nav = document.querySelector('nav.v32nav'), rects = [...nav.querySelectorAll('[data-nav]')].map(b => { const r = b.getBoundingClientRect(); return { id: b.dataset.nav, x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height), mid: r.y + r.height / 2, right: r.right, whole: b.scrollWidth <= b.clientWidth + 1 }; });
          return { rects, row: rects.every(r => Math.abs(r.mid - rects[0].mid) < 1), big: rects.every(r => r.w >= 44 && r.h >= 44), whole: rects.every(r => r.whole), fit: document.documentElement.scrollWidth <= innerWidth + 1 && nav.scrollWidth <= nav.clientWidth + 1 && rects.every(r => r.right <= innerWidth + 1), service: document.documentElement.getAttribute('data-service') };
        });
        check(width + ' px ' + service + ': one row, every tab at least 44 px, every word whole, no sideways scroll', lay.service === service && lay.row && lay.big && lay.whole && lay.fit, JSON.stringify(lay.rects.map(r => r.id + ' ' + r.w + 'x' + r.h + (r.whole ? '' : ' cut'))) + ' row ' + lay.row + ' fit ' + lay.fit);
        if (width === 390) await shot('home-' + service);
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await page.evaluate(() => { OOT.service.set('night'); render(); });
    });

    /* 2. the lit word on every owner */
    await step('the lit words', async () => {
      const owners = [
        ['#/v/worldmap', 'worldmap', 'library'], ['#/v/worldmap/france', 'worldmap', 'library'], ['#/v/regions', 'regions', 'library'],
        ['#/v/country/france', 'country', 'library'], ['#/v/region/champagne', 'region', 'library'], ['#/v/fieldatlas', 'fieldatlas', 'library'],
        ['#/v/fieldmap/champagne', 'fieldmap', 'library'], ['#/practise', 'flashcards', 'library'], ['#/flashcards/grapes', 'deck', 'library'],
        ['#/quizzes', 'quizzes', 'library'], ['#/v/bank', 'bank', 'library'], ['#/library', 'library', 'library'],
        ['#/v/cms', 'cms', 'cms'], ['#/v/cmsday', 'cmsday', 'cms'], ['#/v/cmstasting', 'cmstasting', 'cms'], ['#/v/cmsgrid', 'cmsgrid', 'cms'],
        ['#/v/cmssubject/' + SUBJECT, 'cmssubject', 'cms'], ['#/v/cmsready', 'cmsready', 'cms'],
        ['#/v/grapes', 'grapes', 'grapes'], ['#/v/grape/chardonnay', 'grape', 'grapes'], ['#/v/griddrill', 'griddrill', 'grapes'], ['#/v/courttasting', 'courttasting', 'grapes'],
        ['#/v/brennans', 'brennans', 'brennans'], ['#/v/housestudies', 'housestudies', 'brennans'], ['#/v/houserehearsal', 'houserehearsal', 'brennans'],
        ['#/v/housereference', 'housereference', 'brennans'], ['#/flashcards/list', 'deck', 'brennans']
      ];
      const wrong = [];
      for (const [hash, v, word] of owners) {
        await go(hash);
        await view(page, v);
        const got = await lit(page);
        if (got !== word) wrong.push(hash + ' lights ' + got);
      }
      check('every owner lights its word: Library on the atlas, the Practise root, a deck, Quizzes, the bank and the Library; CMS on its six; Grapes on its four; the house on its rooms and its deck (' + owners.length + ' addresses)', wrong.length === 0, wrong.join('; '));
      await go('#/practise');
      await page.locator('[data-v32="quick"]').first().click(); await view(page, 'quiz');
      check('the quick quiz lights Library', await lit(page) === 'library', await lit(page));
      await go('#/v/houserehearsal');
      await page.locator('[data-v32="drilllist"]').first().click(); await view(page, 'quiz');
      check('a house drill lights the house', await lit(page) === 'brennans', await lit(page));
      await go('#/v/brennans');
      await page.locator('details.v48-wine-group > summary').first().click();
      await page.locator('details.v48-wine-group .v28-row').first().click();
      await page.waitForFunction(() => S.view === 'cellar' && v28State().open);
      check('a wine\'s card lights the house', await lit(page) === 'brennans', await lit(page));
    });

    /* 3. the cold Back chains */
    await step('the cold Back chains', async () => {
      const chains = [
        ['#/v/cms', 'cms', ['home']], ['#/v/cmssubject/' + SUBJECT, 'cmssubject', ['cms', 'home']], ['#/v/grape/chardonnay', 'grape', ['grapes', 'home']],
        ['#/v/bank', 'bank', ['library', 'home']], ['#/practise', 'flashcards', ['library', 'home']], ['#/v/regions', 'regions', ['library', 'home']],
        ['#/v/worldmap/france', 'worldmap', ['worldmap', 'library', 'home']], ['#/v/fieldmap/champagne', 'fieldmap', ['fieldatlas', 'worldmap', 'library', 'home']]
      ];
      for (const [hash, first, parents] of chains) {
        const cold = watch(await context.newPage());
        try {
          await boot(cold, hash); await view(cold, first);
          const seen = [];
          for (const p of parents) {
            await cold.locator('#v32-back').click();
            await view(cold, p);
            if (p === 'worldmap' && await cold.evaluate(() => !!S.wmap)) seen.push('worldmap kept its sheet');
            seen.push(p);
          }
          check('cold Back: ' + hash + ' climbs ' + parents.join(', '), seen.join(',') === parents.join(','), seen.join(','));
        } catch (e) { check('cold Back: ' + hash + ' climbs ' + parents.join(', '), false, e.message.split('\n')[0]); }
        await cold.close();
      }
    });

    /* 4. the house-only sweep */
    await step('the house-only sweep', async () => {
      for (const [name, hash, v, home] of [['Home', '#/', 'home', true], ['the level page', '#/level', 'level'], ['the Practise root', '#/practise', 'flashcards'], ['the Library', '#/library', 'library'], ['Quizzes', '#/quizzes', 'quizzes'], ['the bank', '#/v/bank', 'bank']]) {
        await go(hash); await view(page, v);
        const probs = sweepProblems(await body(), home);
        check(name + ' draws no house deck, door, id or wording' + (home ? ' outside its one row to the house' : ''), probs.length === 0, probs.join('; '));
        await shot(v);
      }
      await go('#/level');
      const lvl = await page.evaluate(() => ({ h2: [...document.querySelectorAll('#view h2')].map(h => h.textContent), due: (document.querySelector('#view') || document.body).innerText.slice(0, 1500) }));
      check('the level page holds no My restaurant and its due line names no wine', lvl.h2.indexOf('My restaurant') < 0 && !/\d+ wines? /.test(lvl.due), JSON.stringify(lvl.h2));
      const deals = await page.evaluate(() => { const bank = {}; LEVELS[activeLevel].bank.forEach(q => { bank[q.id] = 1; }); const out = []; for (let i = 0; i < 10; i++) out.push(v32QuickPool().map(q => q.id)); return out.map(d => ({ n: d.length, h: d.filter(id => /^h-/.test(id)).length, r: d.filter(id => /^r-/.test(id)).length, lv: d.filter(id => bank[id]).length })); });
      check('ten quick deals: ten questions each, no house question, two from the regions and eight from the level\'s bank', deals.every(d => d.n === 10 && d.h === 0 && d.r === 2 && d.lv === 8), JSON.stringify(deals.slice(0, 3)));
      const due = await page.evaluate(() => { const t = v32DueToday(); return { a: t.a, ids: (t.houseIds || []).length, total: t.total }; });
      check('Due today is the level\'s arithmetic alone', due.a === 0 && due.ids === 0, JSON.stringify(due));
      await go('#/practise');
      if (await page.locator('[data-v32="due"]').count()) {
        await page.locator('[data-v32="due"]').first().click();
        await page.waitForFunction(() => S.view === 'quiz' || S.view === 'deck' || S.view === 'flash');
        const dealt = await page.evaluate(() => ({ view: S.view, ids: (S.pool || []).map(q => q.id), deck: S._v32deck || '' }));
        check('Due today deals the level\'s questions and no house card or question', dealt.view === 'quiz' && dealt.ids.length > 0 && !dealt.ids.some(id => /^h-/.test(String(id))) && !/^(due|list)/.test(dealt.deck), JSON.stringify({ view: dealt.view, n: dealt.ids.length, deck: dealt.deck }));
      } else check('Due today has nothing to deal, so it deals no house card', due.total === 0, JSON.stringify(due));
      await go('#/library');
      for (const q of ['Minuty', 'Brennan', 'Champagne']) {
        await page.fill('#cf-in', q);
        await page.waitForTimeout(450);
        const found = await page.evaluate(() => (document.getElementById('cf-in-out') || document.getElementById('cf-out') || { innerHTML: '' }).innerHTML);
        const probs = sweepProblems(found, false).concat(/v44-group-(wines|own)|cellarcompass/.test(found) ? ['a wines, own or Compass group'] : []);
        check('the Library\'s search for ' + q + ' finds no house wine, no record of the person\'s own and no Compass row' + (q === 'Champagne' ? ', and finds the Codex\'s own' : ''), probs.length === 0 && (q !== 'Champagne' || found.replace(/<[^>]+>/g, '').length > 40), probs.join('; '));
      }
      const help = await page.evaluate(() => (document.getElementById('cf-in-help') || { textContent: '' }).textContent);
      check('the search help names no restaurant', help.length > 0 && help.indexOf('restaurant') < 0, help);
    });

    /* 5. every piece taken off, found in its room */
    await step('the rooms', async () => {
      await go('#/v/houserehearsal');
      const reh = await body();
      const want = ['data-v53="housedue"', 'data-deck="producers"', 'data-deck="components"', 'data-deck="cellar-compass"', 'data-deck="list"', 'data-v32="drilllist"', 'data-go="housesay"', 'data-go="houserecite"', 'data-go="houseguest"', 'data-go="housepair"', 'data-deck="list-weak"', 'data-deck="bottles"', 'data-deck="menu-words"', 'data-go="cellarrecite"', 'data-go="cellardrill"'];
      check('Service rehearsal holds the house\'s due, the producers\' and components\' decks, the cellar selection, the wine cards, the drills and the rehearsals, and no data-v32="due"', want.every(w => reh.indexOf(w) >= 0) && reh.indexOf('data-v32="due"') < 0, want.filter(w => reh.indexOf(w) < 0).join(', '));
      const hd = await page.evaluate(() => { const b = document.querySelector('#v53-housedue'); const r = b ? b.getBoundingClientRect() : null; return { h: r ? Math.round(r.height) : 0, line: (document.querySelector('#v48-heading-today + p') || {}).textContent || '' }; });
      check('the house\'s due names the weak wine and its button is at least 44 px tall', hd.h >= 44 && /1 wine from our list to look at again/.test(hd.line), JSON.stringify(hd));
      await shot('houserehearsal');
      await page.locator('#v53-housedue').click();
      await page.waitForFunction(() => S.view === 'deck' || S.view === 'housedeck' || S.view === 'flash');
      check('the house\'s due deals the weak wine under the house\'s word', await lit(page) === 'brennans', await lit(page));
      await go('#/v/housestudies');
      const stu = await body();
      const wantS = ['data-v48-route="cellarcompass"', 'data-v48-route="culinary"', 'data-v48-route="illustrations"', 'data-v48-route="techniques"'];
      const vids = await page.evaluate(() => { try { return v30Groups(v28House()).reduce((n, g) => n + g.videos.length, 0); } catch (e) { return 0; } });
      if (vids) wantS.push('data-v48-route="housevideos"');
      check('Wine studies holds the Compass, the Culinary Companion, the illustrations, the Workshop' + (vids ? ' and the house videos' : ''), wantS.every(w => stu.indexOf(w) >= 0), wantS.filter(w => stu.indexOf(w) < 0).join(', '));
      await go('#/v/housereference');
      const ref = await body();
      const wantR = ['data-v48-route="houseproducers"', 'data-v32="fullwine"'];
      check('House reference holds the producers and the full printed list', wantR.every(w => ref.indexOf(w) >= 0), wantR.filter(w => ref.indexOf(w) < 0).join(', '));
    });

    /* 6. the bank and the mocks */
    await step('the bank', async () => {
      await go('#/v/bank');
      const b = await page.evaluate(() => {
        const trains = [...document.querySelectorAll('.v53-cat .train')];
        const nq = LEVELS[activeLevel].bank.length, cats = {};
        LEVELS[activeLevel].bank.forEach(q => { cats[q.cat] = 1; });
        return { nq, m: Object.keys(cats).length, sub: (document.querySelector('.viewhead .sub') || {}).textContent, rows: document.querySelectorAll('.v53-cat').length, trains: trains.length, big: trains.filter(t => { const r = t.getBoundingClientRect(); return r.width >= 44 && r.height >= 44; }).length, closed: document.querySelectorAll('.v53-cat details, details .v53-cat').length };
      });
      check('the bank counts the real bank (' + b.nq + ' questions in ' + b.m + ' categories)', b.sub === b.nq.toLocaleString('en-GB') + ' questions in ' + b.m + ' categories', b.sub);
      check('Drill and Exam stand on every category, never in a disclosure, each at least 44 by 44', b.rows === b.m && b.trains === 2 * b.m && b.big === b.trains && b.closed === 0, JSON.stringify(b));
      const want = { intro: [70, 45], certified: [45, 38], advanced: [60, 35], master: [50, 50] };
      const got = {};
      for (const lv of Object.keys(want)) {
        await page.evaluate(lv => { applyLevel(lv, true); v32Go({ view: 'bank' }, 'replace'); }, lv);
        await view(page, 'bank');
        await page.locator('[data-k="mock"]').first().click();
        await page.waitForFunction(() => S.view === 'quiz' && S.pool && S.pool.length > 0);
        got[lv] = await page.evaluate(() => [S.pool.length, Math.round((S.remain || 0) / 60)]);
        await page.evaluate(() => { if (typeof stopTimer === 'function') stopTimer(); S.mode = null; S.pool = []; S._oral = false; });
      }
      check('the mock deals 70 at Régionale in 45 minutes, 45 at Village in 38, 60 at Premier Cru in 35 and the Gauntlet\'s 50 in 50', Object.keys(want).every(lv => JSON.stringify(got[lv]) === JSON.stringify(want[lv])), JSON.stringify(got));
      await page.evaluate(() => { applyLevel('certified', true); render(); });
    });

    /* 7. the Court's grid */
    await step('the Court\'s grid', async () => {
      await go('#/v/griddrill/chardonnay');
      const named = await page.locator('#v53-pour-named').count();
      check('the grid drill offers a glass of Chardonnay by name', named === 1);
      if (named) {
        await page.locator('#v53-pour-named').click();
        await page.waitForFunction(() => S._v53grid && S._v53grid.grape === 'chardonnay' && document.querySelector('form.v53-sheet'));
        await page.evaluate(() => { const g = S._v53grid, a = v53GridPerfect(v53GlassRead(g), g.colour, g.grape); delete a.sellMark; Object.keys(a).forEach(k => { g.answers[k] = a[k]; }); render(); });
        await shot('griddrill');
        await page.locator('#v53-gmark').click();
        await page.locator('#v53-self-right').click();
        const m = await page.evaluate(() => { const m = S._v53grid.marked, r = v53CourtGridRec().chardonnay; return { right: m.right, total: m.total, grape: m.grapeOk, rec: r ? [r.n, r.c] : null }; });
        check('a perfect sheet is right on every line once the sale is self marked, the grape named, and the glass kept in oot-codex-courtgrid-v1', m.right === m.total && m.total > 20 && m.grape && !!m.rec && m.rec[0] >= 1 && m.rec[1] >= 1, JSON.stringify(m));
      }
    });

    /* 8. the Village tasting on the Court's grid */
    await step('the Village tasting', async () => {
      await go('#/v/courttasting');
      const can = await page.locator('#v53-grunstart').count();
      check('the reads hold two whites and two reds, so the run offers its flight', can === 1, 'no Pour the flight button: the shipped grid reads hold fewer than two whites and two reds');
      if (can) {
        await page.locator('#v53-grunstart').click();
        await page.waitForFunction(() => S._v53tg && S._v53tg.deck && S._v53tg.deck.length && typeof S._v53tg.clockEnd === 'number');
        const r0 = await page.evaluate(() => ({ n: S._v53tg.deck.length, colours: S._v53tg.deck.map(g => g.colour).join(), clock: S._v53tg.clock, end: S._v53tg.clockEnd, text: (document.getElementById('v53-clock') || {}).textContent || '' }));
        check('the run deals four glasses, the two whites first, with the clock at 1800 seconds', r0.n === 4 && r0.colours === 'white,white,red,red' && r0.clock === 1800 && /30:00|29:5\d/.test(r0.text), JSON.stringify(r0));
        await shot('courttasting');
        await page.evaluate(() => render());
        check('a render keeps the end time', await page.evaluate(end => S._v53tg.clockEnd === end, r0.end));
        await page.waitForTimeout(1200);
        await page.locator('#nav-grapes').click(); await view(page, 'grapes');
        const held = await page.evaluate(() => ({ end: S._v53tg.clockEnd, clock: S._v53tg.clock }));
        await page.waitForTimeout(1200);
        const still = await page.evaluate(() => S._v53tg.clock);
        check('leaving holds what is left: no end time and the seconds kept while away', held.end === null && held.clock < 1800 && held.clock >= 1790 && still === held.clock, JSON.stringify(held) + ' ' + still);
        await page.evaluate(() => v53ClockStop());
      }
    });

    /* 9. the stored answers and the console */
    const stats1 = await page.evaluate(() => localStorage.getItem('codexStats'));
    check('codexStats unchanged across the whole walk', stats0 === stats1);
    check('no page errors', errors.length === 0, errors.slice(0, 4).join(' | '));
    await context.close();
  } finally { await browser.close(); }
  const failed = results.filter(r => !r.pass).length;
  if (process.env.CODEX_REPORT) fs.writeFileSync(process.env.CODEX_REPORT, JSON.stringify({ checks: results.length, failed, results, errors }, null, 2) + '\n');
  console.log('check-house-only: ' + (results.length - failed) + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
})().catch(error => { console.error(error); console.log('check-house-only: threw'); process.exit(1); });
