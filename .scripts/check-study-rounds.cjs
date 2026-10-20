/* Isolated browser checks for bounded rounds and honest tasting rehearsal.
   CODEX_URL may name a source or public preview. No owner's browser is used. */
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require(process.argv[3] || 'C:/Users/zpull/WorldTable/node_modules/playwright');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const base = process.env.CODEX_URL || 'http://127.0.0.1:8791/codex/';
const checks = [];
function check(name, pass) { checks.push({ name, pass: !!pass }); assert.ok(pass, name); console.log('  ok  ' + name); }
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 } });
  const page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  /* Lets the layer be reviewed before index integration, without running twice. */
  await context.route('**/*', async route => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const response = await route.fetch();
    let html = await response.text();
    if (!html.includes('js/codex43.js')) html = html.replace('<script src="js/boot.js', '<script>' + fs.readFileSync(path.join(root, 'js/codex43.js'), 'utf8') + '</script>\n<script src="js/boot.js');
    await route.fulfill({ response, body: html });
  });
  try {
    await page.goto(base.replace(/\/?$/, '/') + '?nosw#/practise');
    await page.waitForFunction(() => V32.booted && v32HasHouse() && typeof v43Size === 'function');
    const ids = ['list', 'bottles', 'menu-words', 'grapes-all', 'components', 'components-all', 'producers', 'regions', 'service'];
    const bounded = await page.evaluate(ids => {
      return ids.map(id => {
        const before = localStorage.getItem('codexStats'), n = v32DeckDef(id).cards.length;
        v32StartRun(id, { push: false });
        return { id, n, total: S._v32run.total, saved: localStorage.getItem('codexStats') === before,
          valid: S._v32run.cards.every(card => v32DeckDef(id).cards.some(original => original.id === card.id && original.n === card.n)) };
      });
    }, ids);
    bounded.forEach(result => check(result.id + ': default 20, exact existing cards, no fabricated grades', result.total === Math.min(20, result.n) && result.saved && result.valid));
    check('selection shuffles the collection before taking a bounded slice', await page.evaluate(() => {
      const cards = Array.from({ length: 60 }, (_, i) => ({ kind: 'unknown', id: 'synthetic-' + i }));
      const original = shuffle; shuffle = list => list.slice().reverse();
      try { return v43Selection(cards, 10).map(c => c.id).join(',') === cards.slice(-10).reverse().map(c => c.id).join(','); }
      finally { shuffle = original; }
    }));
    check('existing Again and unseen verdicts take priority over learnt cards', await page.evaluate(() => {
      const read = v32GrapeRec;
      v32GrapeRec = () => ({ weak: 'again', known: 'got' });
      try {
        const cards = [{ kind: 'grape', id: 'known' }, { kind: 'grape', id: 'new' }, { kind: 'grape', id: 'weak' }];
        return v43Selection(cards, 2).map(card => card.id).join(',') === 'weak,new';
      } finally { v32GrapeRec = read; }
    }));
    check('explicit first card survives a bounded selection', await page.evaluate(() => {
      const cards = Array.from({ length: 60 }, (_, i) => ({ kind: 'unknown', id: 'test-' + i }));
      return v43Selection(cards, 10, 'test-59')[0].id === 'test-59';
    }));
    check('one-card counts use singular language', await page.evaluate(() => v32W('rowLine', { n: 1, m: 0 }) === '1 card · 0 learnt'));
    await page.evaluate(() => v32OpenDeck('regions'));
    check('deck setup clearly offers 10, 20 and the whole collection', await page.locator('[data-v43-size]').count() === 3 && await page.locator('[data-v43-size="20"]').getAttribute('aria-pressed') === 'true');
    await page.locator('[data-v43-size="10"]').click();
    await page.locator('#v32-start').click();
    check('visible ten-card choice starts exactly ten', await page.evaluate(() => S._v32run.total === 10));
    check('no answer or teaching guide appears on the card front', await page.locator('#v32-ans,.v36-card-guides,.v43-round-end').count() === 0);
    await page.getByRole('button', { name: 'Flip', exact: true }).click();
    const runBefore = await page.evaluate(() => ({ id: S._v32run.deckId, card: v32RunCard().id, total: S._v32run.total, flip: S._v32run.flip }));
    await page.evaluate(() => v32Go({ view: 'tastegrid' }, 'push'));
    await page.locator('#v32-back').click();
    await page.waitForFunction(() => S.view === 'housedeck');
    check('a reading detour and Back preserve the bounded card and reveal', await page.evaluate(before => S._v32run.deckId === before.id && v32RunCard().id === before.card && S._v32run.total === before.total && S._v32run.flip === before.flip, runBefore));
    await page.getByRole('button', { name: 'Again', exact: true }).click();
    for (let index = 1; index < 10; index++) {
      await page.getByRole('button', { name: 'Flip', exact: true }).click();
      await page.getByRole('button', { name: 'Got it', exact: true }).click();
    }
    check('completion reports a round and retains a clear miss retry', await page.getByText('Round complete', { exact: true }).count() === 1 && await page.getByRole('button', { name: 'Study the misses', exact: true }).count() === 1);
    check('round grade reaches the existing region record without a new record scheme', await page.evaluate(id => v39CardRec()[id] === 'again', runBefore.card));
    await page.getByRole('button', { name: 'Study the misses', exact: true }).click();
    check('miss retry contains the exact missed card', await page.evaluate(id => S._v32run.total === 1 && v32RunCard().id === id, runBefore.card));
    await page.evaluate(() => v32OpenDeck('regions'));
    await page.locator('[data-v43-size="all"]').click();
    await page.locator('#v32-start').click();
    check('whole-deck choice remains available without truncation', await page.evaluate(() => S._v32run.total === v32DeckDef('regions').cards.length));
    check('explicit card arrays are never truncated', await page.evaluate(() => {
      const cards = v32DeckDef('regions').cards.slice(0, 37);
      v32StartRun('regions', { cards, push: false });
      return S._v32run.total === 37;
    }));
    check('daily and Compass keep their dedicated selection sizes', await page.evaluate(() => {
      const daily = v32DeckDef('due').cards; v32StartRun('due', { cards: daily, keepOrder: true, push: false });
      const okay = S._v32run.total === daily.length;
      const compass = v40DailyIds(); v32StartRun('cellar-compass', { push: false });
      return okay && S._v32run.total === compass.length && S._v32run.cards.map(c => c.id).join(',') === compass.join(',');
    }));
    check('guided Compass paths retain all exact wines in order', await page.evaluate(() => {
      const path = v40Paths()[0], id = 'cellar-path:' + path.id, cards = v32DeckDef(id).cards;
      v32StartRun(id, { push: false });
      return S._v32run.cards.map(c => c.id).join(',') === cards.map(c => c.id).join(',');
    }));
    check('Study Plan replaces an unbounded coverage task with daily review', await page.evaluate(() => {
      const plan = studyPlan(), action = plan.acts.find(item => item.t === 'Build your knowledge in small rounds');
      if (!action) return false;
      action.go();
      return S.view === 'quiz' && S.pool.length <= 20 && S.pool.length > 0 && S.mode === 'daily';
    }));
    await page.evaluate(() => { S.tt = null; S.view = 'tasting'; render(); });
    check('tasting intro explains what a text exercise measures', (await page.locator('.v43-tasting-note').textContent()).includes('not sensory tasting ability'));
    await page.locator('#tt-start').click();
    check('in-flight rehearsal retains the explanation', await page.locator('.v43-tasting-note').count() === 1);
    await page.evaluate(() => {
      S.tt.missed = [S.tt.deck[0]]; S.tt.score = 0; S.tt.idx = S.tt.deck.length; render();
    });
    check('tasting completion avoids claiming measured palate skill', await page.getByText('PROFILE RECALL COMPLETE', { exact: true }).count() === 1 && await page.getByText('A STEADY PALATE', { exact: true }).count() === 0);
    const missedGrape = await page.evaluate(() => GRAPES[S.tt.missed[0]].g);
    await page.getByRole('button', { name: 'Review ' + missedGrape, exact: true }).click();
    check('missed tasting profile opens exactly that grape card', await page.evaluate(name => S._v32run.total === 1 && v32RunCard().id === name, missedGrape));
    check('no mobile overflow or browser exceptions', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth) && errors.length === 0);
    console.log('\n' + checks.length + ' study-round and tasting checks passed');
  } finally { await context.close(); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
