/* Fresh-route regression through the actual index and every shipped script.
   Local files answer an isolated Chromium context; no user storage, network
   service or substituted application function is involved. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const {chromium} = require(process.argv[3] || path.join(root, '..', 'WorldTable', 'node_modules', '@playwright', 'test'));
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'};
let checks = 0;
function check(name, condition) { assert.ok(condition, name); checks++; console.log('  ok  ' + name); }
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    async function device(hash, extraRender) {
      const context = await browser.newContext({serviceWorkers:'block'});
      await context.addInitScript(() => {
        window.testPushes = 0;
        const push = history.pushState;
        history.pushState = function () { window.testPushes++; return push.apply(this, arguments); };
      });
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.origin !== 'http://codex.test' || !url.pathname.startsWith('/codex/')) return route.fulfill({status:404,body:''});
        const relative = decodeURIComponent(url.pathname.slice('/codex/'.length)) || 'index.html';
        const file = path.resolve(root, relative);
        if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return route.fulfill({status:404,body:''});
        let body = fs.readFileSync(file);
        // A real render here reproduces a completed asynchronous operation
        // between layer loads. No routing or rendering function is replaced.
        if (extraRender && relative === 'js/codex35.js') body = Buffer.from(body.toString('utf8') + '\nrender();\n' + (extraRender === 'navigate' ? 'v32Go({view:"library"},"push");\n' : ''));
        await route.fulfill({contentType:mime[path.extname(file)] || 'application/octet-stream',body});
      });
      await page.goto('http://codex.test/codex/?nosw' + hash);
      await page.waitForFunction(() => typeof v36Go === 'function' && V32.booted && !V32.rendering);
      const read = () => page.evaluate(() => ({view:S.view,id:S._v36study||'',hash:location.hash,depth:V32.d,pushes:testPushes,initial:V32.initialHash}));
      return {context,page,read,errors};
    }
    for (const early of [false, true]) {
      const label = early ? 'with an intervening render' : 'normal startup';
      for (const id of ['', 'service-bottle-check']) {
        const hash = '#/v/illustrations' + (id ? '/' + id : '');
        const d = await device(hash, early), state = await d.read();
        check(label + ': fresh ' + (id || 'index') + ' resolves through the complete chain', state.view === 'illustrations' && state.id === id && state.hash === hash);
        check(label + ': initial route replaces one existing entry at depth zero', state.depth === 0 && state.pushes === 0);
        check(label + ': correct full application screen is drawn', await d.page.locator('.v36-studies').count() === 1);
        if (id) check(label + ': selected study is open', await d.page.locator('[data-teaching-id="' + id + '"][open]').count() === 1);
        check(label + ': startup has no script errors', d.errors.length === 0);
        await d.page.locator('#v32-back').click();
        check(label + ': cold-link Back goes to Library without a history push', (await d.read()).view === 'library' && (await d.read()).pushes === 0);
        await d.context.close();
      }
    }
    const unknown = await device('#/v/illustrations/not-a-study', true);
    check('unknown study safely opens the illustrated index', (await unknown.read()).hash === '#/v/illustrations' && (await unknown.read()).id === '');
    await unknown.context.close();
    const unrelated = await device('#/library', true);
    check('existing deep links retain their original destination', (await unrelated.read()).view === 'library' && (await unrelated.read()).hash === '#/library');
    await unrelated.context.close();
    const moved = await device('#/v/illustrations/service-bottle-check', 'navigate');
    check('an actual later navigation is never overwritten by startup recovery', (await moved.read()).view === 'library' && (await moved.read()).depth === 1);
    await moved.context.close();
    const reload = await device('#/library');
    await reload.page.getByRole('button',{name:'Explore illustrated studies',exact:true}).click();
    await reload.page.evaluate(() => v36Go('service-bottle-check'));
    const before = await reload.read();
    await reload.page.reload();
    await reload.page.waitForFunction(() => typeof v36Go === 'function' && V32.booted);
    const after = await reload.read();
    check('reloading a selected study preserves its address and navigation depth', before.depth === 2 && after.depth === before.depth && after.hash === before.hash && after.id === 'service-bottle-check' && after.pushes === 0);
    await reload.page.locator('#v32-back').click();
    await reload.page.waitForFunction(() => S.view === 'illustrations' && !S._v36study);
    check('Back after reload returns to the existing index entry', (await reload.read()).depth === 1);
    check('complete navigation sequence has no script errors', reload.errors.length === 0);
    await reload.context.close();
    console.log('check-visual-study-routes: ' + checks + ' checks passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
