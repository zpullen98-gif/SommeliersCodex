/* Real Chromium contracts for codex36 without a server, user storage or network.
   node .scripts/check-visual-studies.cjs [Codex root] [Playwright module path]
   Uses the existing sibling WorldTable test dependency unless one is supplied.
   Full application navigation and real artwork layout are separate release QA. */
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const { chromium } = require(process.argv[3] || path.join(root, '..', 'WorldTable', 'node_modules', '@playwright', 'test'));
let checks = 0;
function check(name, condition) { assert.ok(condition, name); checks++; }
const source = name => fs.readFileSync(path.join(root, 'js', name), 'utf8');
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [], pictures = []; let pictureMode = 'fail';
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', async route => {
      const url = route.request().url();
      if (/\.webp$/.test(url)) {
        pictures.push(url);
        if (pictureMode === 'fail') await route.fulfill({ status: 404, body: '' });
        else await route.fulfill({ contentType: 'image/png', body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j7XcAAAAASUVORK5CYII=', 'base64') });
      } else await route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><body><main id="app"></main></body></html>' });
    });
    await page.goto('http://codex.test/codex/');
    await page.addScriptTag({ content: `
      var S = {view:'illustrations'}, ST = {marks:7}, V32 = {pend:'none'}, V25_VIEWS={}, V32_PARENT={}, V32_OWNER={}, V25_UNDER={};
      var PRIMERS=[{cat:'Service',id:'service'}], cacheHits={}, cachedNames=[], cacheError=false;
      Object.defineProperty(window,'caches',{value:{keys:async()=>{if(cacheError)throw Error('denied');return cachedNames;},open:async()=>({match:async url=>cacheHits[url]?{status:200}:undefined})},configurable:true});
      function box(html){var d=document.createElement('div');d.innerHTML=html;return d;}
      function render(){var f=V25_VIEWS[S.view];if(f)document.querySelector('#app').replaceChildren(f());}
      function v32Esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
      function v32Arg(v){return v==='primer'?String(S.primerKey):'';}
      function v32Apply(r){S.view=r.view;S.otherArg=r.arg;return r;}
      function v32LibraryView(){return box('<div class="v25page"><div class="viewhead"><h2>Library</h2></div><div class="codexfind"></div></div>');}
      function v32LevelView(){return box('<div class="lv-page v32-level"><h1>Today</h1><p>My restaurant</p><section class="v32-sec"></section></div>');}
      function primerView(){return box('<h2>Service</h2><div class="centerrow"></div>');}
      function serviceView(){return box(['Mise en Place','Order of Service','Opening Still Wine','Sparkling Wine','The Decanting Ritual'].map(t=>'<div class="secgroup">'+t+' <span>0/5</span></div><p>Rehearse</p>').join('')+'<div class="centerrow"></div>');}
      function tasteGridView(){return box('<div class="gridrow"><div class="gridt">Clarity & brightness</div></div>');}
      function cellarView(){return box('');}
      function v35House(){return window.testHouse||null;}
      function v32RunCard(){var r=S._v32run;return r&&r.cards[r.deck[0]];}
      function v32CardFace(c,r){return '<div id="v32-face">'+(r.flip?'Answer':'Question')+'</div>';}
      function v32CardView(){return box(v32CardFace(v32RunCard(),S._v32run));}
      document.addEventListener('keydown',function(e){if(S._v32run&&['r','w','Enter',' '].includes(e.key)){ST.marks++;S._v32run.flip=false;S._v32run.deck.shift();}});
    ` });
    await page.addScriptTag({ content: source('data-teaching-images.js') });
    await page.addScriptTag({ content: source('teaching-cache.js') });
    await page.addScriptTag({ content: `
      ['service-bottle-check','service-still-opening','service-sparkling-control','service-decanting'].forEach(id=>{if(!CodexTeachingCache.entry(id))CODEX_TEACHING_IMAGES.entries.push({id,kind:'teach',file:'assets/teach/'+id+'-v1.webp',title:id,alt:'An educational service illustration with readable notes.',width:1536,height:1024,caption:'A teaching example for service practice.',key:[['Observe','Practise carefully.']],sources:[{title:'Source',url:'https://example.org/'}]});});
      var CODEX_VISUAL_STUDIES={groups:[{id:'bottle',title:'Bottle clues',ids:['bottle-ullage','bottle-heat-damage']},{id:'glass',title:'In the glass',ids:['grid-colour-rim','pinot-noir']},{id:'service',title:'Hands of service',ids:['service-bottle-check','service-still-opening','service-sparkling-control','service-decanting']}],recall:{'bottle-ullage':{question:'What would you inspect?',answer:'Inspect condition in context.',practise:'Describe one clue aloud.'}},wineGuides:{'w-exact':['bottle-ullage','missing-entry']},componentGuides:{'c-exact':['bottle-heat-damage']},grapeGuides:{'Pinot Noir':['pinot-noir']},primerGuides:{Service:['service-still-opening']},purposes:{'bottle-ullage':'Read the fill level.'}};
    ` });
    await page.addScriptTag({ content: source('codex33.js') });
    await page.addScriptTag({ content: source('codex36.js') });
    await page.evaluate(() => render());
    check('all eight fixture guides are closed', await page.locator('.v33-guide:not([open])').count() === 8);
    check('closed index creates no images or requests', await page.locator('img').count() === 0 && pictures.length === 0);
    check('search has a visible label', await page.getByLabel('Find an illustrated study').count() === 1);
    await page.getByLabel('Find an illustrated study').fill('fill level');
    check('search narrows by readable content', await page.locator('.v36-study:visible').count() === 1);
    await page.getByLabel('Find an illustrated study').fill('');
    await page.getByRole('button', { name: 'Hands of service', exact: true }).click();
    check('collection filter narrows without picture requests', await page.locator('.v36-study:visible').count() === 4 && pictures.length === 0);
    await page.getByRole('button', { name: 'All studies', exact: true }).click();
    await page.locator('[data-teaching-id="bottle-ullage"] > summary').click();
    await page.getByRole('button', { name: 'Retry illustration', exact: true }).waitFor();
    check('failure leaves the reading and practice', await page.getByText('What would you inspect?', { exact: true }).isVisible());
    check('failure requests only exact approved renditions', pictures.length === 2 && pictures.every(url => !url.includes('?')));
    pictureMode = 'ok';
    await page.getByRole('button', { name: 'Retry illustration', exact: true }).click();
    await page.waitForFunction(() => { const i=document.querySelector('[data-teaching-id="bottle-ullage"] img');return i&&!i.hidden&&i.complete&&i.naturalWidth>0; });
    check('retry restores image and enlarge', await page.getByRole('button', { name: 'Enlarge illustration', exact: true }).isVisible());
    check('practice answer starts closed', await page.locator('.v36-answer[open]').count() === 0);
    await page.getByText('Reveal practice answer', { exact: true }).click();
    check('practice answer can be read without grading', await page.getByText('Inspect condition in context.', { exact: true }).isVisible() && await page.evaluate(() => ST.marks) === 7);

    const exact = await page.evaluate(() => ({ wine:v36WineGuides({id:'w-exact'}),wrong:v36WineGuides({id:'w-other',name:'1946 Rubicon Chardonnay'}),component:v36CardGuides({kind:'component',id:'c-exact'}),grape:v36CardGuides({kind:'grape',g:{g:'Pinot Noir'}}),wrongGrape:v36CardGuides({kind:'grape',g:{g:'Pinot'}}) }));
    check('wine joins are exact and remove unavailable entries', JSON.stringify(exact.wine) === '["bottle-ullage"]' && exact.wrong.length === 0);
    check('component and grape joins are exact', exact.component[0] === 'bottle-heat-damage' && exact.grape[0] === 'pinot-noir' && exact.wrongGrape.length === 0);
    await page.evaluate(() => {v32Apply({view:'illustrations',arg:'service-bottle-check'});render();});
    check('registered selected study survives route argument', await page.evaluate(() => v32Arg('illustrations')) === 'service-bottle-check');
    check('fictional practice label is explicit', await page.getByText('Practice example — fictional label', { exact:true }).isVisible());
    check('label exercise mismatch answer stays closed', await page.locator('.v36-label-study details:not([open])').count() === 1);
    check('illustrated study parent and nav owner are Library', await page.evaluate(() => V32_PARENT.illustrations === 'library' && V32_OWNER.illustrations === 'library'));
    await page.evaluate(() => v32Apply({view:'illustrations',arg:'not-real'}));
    check('unknown study falls back to index', await page.evaluate(() => v32Arg('illustrations')) === '');
    await page.evaluate(() => v32Apply({view:'primer',arg:'Service'}));
    check('other routes retain existing behaviour', await page.evaluate(() => S.view === 'primer' && S.otherArg === 'Service'));
    check('exact primer guide appears once', await page.evaluate(() => {S.primerKey='Service';return primerView().querySelectorAll('[data-teaching-id="service-still-opening"]').length;}) === 1);
    check('four service guides attach to rehearsal sections', await page.evaluate(() => serviceView().querySelectorAll('.v33-guide').length) === 4);
    check('Library exposes the study door', await page.evaluate(() => v32LibraryView().textContent.includes('Explore illustrated studies')));
    check('level view exposes a compact study door', await page.evaluate(() => v32LevelView().textContent.includes('Illustrated studies: observe, explain, rehearse')));

    await page.evaluate(() => {
      S._v32run={v32:1,deckId:'list',cards:[{kind:'house',id:'w-exact'}],deck:[0],flip:false,done:3,again:2};S.view='housedeck';render();
    });
    check('card front has no illustration door, alt or URL', await page.locator('[data-v36-guide],img,[data-teaching-id]').count() === 0);
    check('all three card types conceal guide hints before reveal', await page.evaluate(() => ['house','component','grape'].every(kind=>!v32CardFace({kind,id:kind==='house'?'w-exact':'c-exact',g:{g:'Pinot Noir'}},{flip:false}).includes('data-v36-guide'))));
    await page.evaluate(() => {S._v32run.flip=true;render();});
    check('revealed card offers a study without requesting it', await page.locator('[data-v36-guide="bottle-ullage"]').count() === 1 && await page.locator('img').count() === 0);
    const before = await page.evaluate(() => JSON.stringify({run:S._v32run,marks:ST,view:S.view}));
    await page.locator('[data-v36-guide="bottle-ullage"]').click();
    await page.locator('dialog[open] .v33-canvas').focus();
    for (const key of ['r', 'w', 'Enter', 'Space']) await page.keyboard.press(key);
    check('modal keys cannot flip, advance or grade underlying run', await page.evaluate(() => JSON.stringify({run:S._v32run,marks:ST,view:S.view})) === before);
    await page.getByRole('button', {name:'Close illustration',exact:true}).click();
    check('closing restores the same card and opener focus', await page.evaluate(() => JSON.stringify({run:S._v32run,marks:ST,view:S.view})) === before && await page.locator('[data-v36-guide="bottle-ullage"]').evaluate(n=>document.activeElement===n));
    await page.evaluate(() => {
      testHouse={wines:Array.from({length:19},(_,i)=>({id:'w-related-'+i,name:i===18?'Château Special 2023':'Practice wine '+i,region:'Burgundy'}))};
      testHouse.wines.forEach(w=>CODEX_VISUAL_STUDIES.wineGuides[w.id]=['service-bottle-check']);
      S.view='illustrations';document.querySelector('#app').replaceChildren(v36Related('service-bottle-check'));
    });
    check('closed related wine list builds no wine controls', await page.locator('.v36-related .v36-text-button').count() === 0);
    await page.locator('.v36-related > summary').click();
    await page.locator('.v36-related .v36-text-button').first().waitFor();
    check('large related wine list initially shows only eight', await page.locator('.v36-related .v36-text-button').count() === 8);
    await page.getByLabel('Find a wine for this study').fill('Chateau Special');
    check('related wine search finds an accent-insensitive exact record beyond the first page', await page.locator('.v36-related .v36-text-button').count() === 1 && await page.getByRole('button',{name:'Château Special 2023',exact:true}).isVisible());
    await page.getByRole('button',{name:'Château Special 2023',exact:true}).click();
    check('related wine search opens that exact wine ID', await page.evaluate(() => S.view==='cellar'&&S.otherArg==='w-related-18'));
    await page.getByLabel('Find a wine for this study').fill('');
    await page.getByRole('button',{name:'Show more wines (11 remaining)',exact:true}).click();
    await page.getByRole('button',{name:'Show more wines (3 remaining)',exact:true}).click();
    check('every related wine remains accessible by progressive expansion', await page.locator('.v36-related .v36-text-button').count() === 19 && await page.locator('.v36-related-more').isHidden());
    const cacheChecks = await page.evaluate(async () => {
      const item=CodexTeachingCache.entry('bottle-ullage'),name=CodexTeachingCache.cacheName(item.kind,location.href);
      const none=await v36SavedText(item);cachedNames=[name];cacheHits[new URL(item.thumb.file,location.href).href]=true;
      const small=await v36SavedText(item);cacheHits[new URL(item.file,location.href).href]=true;
      const full=await v36SavedText(item);cacheError=true;const denied=await v36SavedText(item);
      return {none,small,full,denied};
    });
    check('saved status is based on confirmed cache presence', /not been confirmed/.test(cacheChecks.none) && /^Smaller illustration saved/.test(cacheChecks.small) && /^Full illustration saved/.test(cacheChecks.full));
    check('cache denial is handled honestly', /could not be checked/.test(cacheChecks.denied));
    check('no page errors', errors.length === 0);
    console.log('Visual studies: ' + checks + ' real-browser checks passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
