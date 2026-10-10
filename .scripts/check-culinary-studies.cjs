/* Isolated real-browser contracts: no user profile, network or stored progress.
   Run against source or a public Codex directory. */
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const {chromium} = require(process.argv[3] || path.join(root, '..', 'WorldTable', 'node_modules', '@playwright', 'test'));
let checks = 0;
function check(name, value) { assert.ok(value, name); checks++; console.log('  ok  ' + name); }
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage({viewport:{width:390,height:844}}), errors = [], pictures = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => {
      if (/\.webp$/.test(route.request().url())) { pictures.push(route.request().url()); return route.fulfill({status:404,body:''}); }
      return route.fulfill({contentType:'text/html',body:'<!doctype html><html><body><main id="app"></main></body></html>'});
    });
    await page.goto('http://codex.test/codex/');
    await page.addScriptTag({content:`
      var S={view:'culinary'},ST={marks:11},V32={pend:'none'},V25_VIEWS={},V32_PARENT={},V32_OWNER={},V25_UNDER={};
      var PRIMERS=[{cat:'Food & Pairing'}], storageWrites=0, testHouse={wines:[{id:'w-exact',name:'Exact reviewed wine'}]};
      Storage.prototype.setItem=function(){storageWrites++;};
      function box(html){var d=document.createElement('div');d.innerHTML=html;return d;}
      function render(){var f=V25_VIEWS[S.view];if(f)document.querySelector('#app').replaceChildren(f());}
      function v32Esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
      function v32Arg(v){return '';}
      function v32Apply(r){S.view=r.view;S.otherArg=r.arg;return r;}
      function v32Go(r,mode){v32Apply(r,null);V32.pend=mode||'push';render();}
      function v32LibraryView(){return box('<div class="v25page"><div class="viewhead"><h2>Library</h2></div><div class="codexfind"></div></div>');}
      function v32LevelView(){return box('<div class="v32-level"><section class="v32-sec"></section></div>');}
      function primerView(){return box('<h2>Food &amp; Pairing</h2><div class="centerrow"></div>');}
      function serviceView(){return box('<div class="centerrow"></div>');}
      function tasteGridView(){return box('<h2>Grid</h2><div class="centerrow"></div>');}
      function cellarView(){return box(S.ref?'<div id="v28-card"><div class="v28-foot"></div></div>':'');}
      function v28State(){return {open:'w-exact'};} function v28Rows(){return [{item:{id:'w-exact'}}];} function v28Find(rows){return rows[0];}
      function v35House(){return testHouse;}
      function v32RunCard(){var r=S._v32run;return r&&r.cards[r.deck[0]];}
      function v32CardFace(c,r){return '<div id="v32-face">'+(r.flip?'Answer':'Question')+'</div>';}
      function v32CardView(){return box(v32CardFace(v32RunCard(),S._v32run));}
      document.addEventListener('keydown',function(e){if(S._v32run&&['r','w','Enter',' '].includes(e.key)){ST.marks++;S._v32run.flip=false;S._v32run.deck.shift();}});
    `});
    for (const file of ['data-teaching-images.js','teaching-cache.js','data-visual-studies.js','codex33.js','codex36.js']) await page.addScriptTag({content:fs.readFileSync(path.join(root,'js',file),'utf8')});
    await page.addScriptTag({content:`
      var CODEX_CULINARY_STUDIES={title:'Read the dish, describe the wine',subtitle:'Observe and explain',boundaries:['Training choices require the current dish and bottle.'],sources:[{id:'source',title:'Training source',url:'https://example.org/reference'}],
        lessons:[['describe','Describe before identifying'],['fruit','Fresh, ripe and cooked fruit'],['aromas','Herbs, spice and cellar aromas'],['sauce','The sauce changes the question'],['recommend','Recommend, explain, adapt']].map(x=>({id:x[0],title:x[1],intro:'Practise one observation.',body:['Read this lesson in context.'],guideIds:x[0]==='fruit'?['grid-colour-rim']:[],practice:{question:'What can you observe?',answer:'Name the observation before an inference.',practise:'Explain aloud.'},sources:['source']})),
        structure:[{id:'sweet',label:'Sweetness',observe:'Taste sweetness.',distinguish:'Fruity aroma is separate.'},{id:'acid',label:'Acidity',observe:'Notice salivation.',distinguish:'Different from drying tannin.'}],
        dishes:[{id:'oysters',title:'Oyster preparations',description:'Compare the whole preparation.',variables:[{label:'Sauce',detail:'Acidity and seasoning matter.'}],options:[{id:'fresh',label:'A fresh white',wineId:'w-exact',benefit:'Freshness beside the dish.',tradeoff:'Check sauce intensity.'},{id:'textured',label:'A textured option',wineId:'w-unavailable',benefit:'Texture alongside richness.',tradeoff:'Ask about oak preference.'}],guestQuestion:'What style do you enjoy?',boundary:'Illustrative possibilities.',sources:['source']},{id:'eggs',title:'Eggs and two sauces',description:'Compare both sauces.',variables:[],options:[],guestQuestion:'Which flavours do you prefer?',sources:['source']}],
        wineLessons:{'w-exact':['fruit','recommend']},componentLessons:{'c-exact':['aromas']},grapeLessons:{'Pinot Noir':['fruit']},primerLessons:{'Food & Pairing':['sauce','recommend']}};
    `});
    await page.addScriptTag({content:fs.readFileSync(path.join(root,'js','codex37.js'),'utf8')});
    await page.evaluate(() => render());
    check('overview exposes exactly five lessons',await page.locator('.v37-lesson-card').count()===5);
    check('scope notes start closed after the lessons',await page.locator('.v37-boundaries:not([open])').count()===1&&await page.locator('.v37-lessons + .v37-boundaries').count()===1);
    check('overview neither creates pictures nor requests art',await page.locator('img').count()===0&&pictures.length===0);
    const exact = await page.evaluate(() => ({a:v37Mapped('wineLessons','w-exact'),b:v37Mapped('wineLessons','toString'),c:v37CardLessons({kind:'grape',g:{g:'Pinot'}}),d:v37CardLessons({kind:'component',id:'c-exact'})}));
    check('lesson joins are exact and inherited keys never match',exact.a.length===2&&exact.b.length===0&&exact.c.length===0&&exact.d[0]==='aromas');
    await page.getByRole('button',{name:'Open Describe before identifying',exact:true}).click();
    check('selected lesson registers Library parent and route argument',await page.evaluate(()=>S.view==='culinary'&&v32Arg('culinary')==='describe'&&V32_PARENT.culinary==='library'&&V32_OWNER.culinary==='library'));
    check('structure comparisons start closed and practice starts concealed',await page.locator('.v37-sensation:not([open])').count()===2&&await page.locator('.v37-practice details:not([open])').count()===1);
    await page.getByText('Sweetness',{exact:true}).click();
    check('structure distinguishes aroma from sweetness',await page.getByText('Fruity aroma is separate.',{exact:true}).isVisible());
    await page.getByRole('button',{name:'3. Herbs, spice and cellar aromas',exact:true}).click();
    check('five-step navigation keeps one active lesson',await page.locator('.v37-steps [aria-current="step"]').count()===1&&await page.evaluate(()=>S._v37lesson)==='aromas');
    await page.getByRole('button',{name:'5. Recommend, explain, adapt',exact:true}).click();
    check('pairing has no preselected answer',await page.locator('.v37-options input:checked').count()===0);
    await page.getByLabel('A fresh white',{exact:true}).check();
    check('choice reveals benefit and trade-off as readable text',await page.getByText('Freshness beside the dish.',{exact:true}).isVisible()&&await page.getByText('Check sauce intensity.',{exact:true}).isVisible());
    await page.getByLabel('Practise your recommendation',{exact:true}).fill('I would suggest this; how do you feel about oak?');
    check('rehearsal is editable and writes neither storage nor marks',await page.getByLabel('Practise your recommendation',{exact:true}).inputValue()==='I would suggest this; how do you feel about oak?'&&await page.evaluate(()=>storageWrites===0&&ST.marks===11));
    await page.getByLabel('A textured option',{exact:true}).check();
    check('unavailable exact wine never opens a fabricated reference',await page.locator('.v37-choice-result button').count()===0);
    await page.getByLabel('Choose a dish comparison',{exact:true}).selectOption('eggs');
    check('dish choice updates the exact reviewed comparison',await page.locator('[data-v37-dish="eggs"]').count()===1&&await page.getByText('Which flavours do you prefer?',{exact:true}).isVisible());
    await page.getByLabel('Choose a dish comparison',{exact:true}).selectOption('oysters');
    check('changing a comparison preserves this screen\'s unsaved rehearsal',await page.getByLabel('Practise your recommendation',{exact:true}).inputValue()==='I would suggest this; how do you feel about oak?'&&await page.getByLabel('A textured option',{exact:true}).isChecked());
    await page.evaluate(()=>{v32Apply({view:'culinary',arg:'not-real'});render();});
    check('unknown lesson falls back to collection overview',await page.locator('.v37-lesson-card').count()===5&&await page.evaluate(()=>v32Arg('culinary'))==='');
    check('Library, grid and exact primer expose lesson doors',await page.evaluate(()=>v32LibraryView().textContent.includes('Explore the culinary companion')&&tasteGridView().querySelectorAll('.v37-doors button').length===3&&(S.primerKey='Food & Pairing',primerView().querySelectorAll('.v37-doors button').length===2)));
    check('wine reference joins exact identity and skips edit mode',await page.evaluate(()=>{S.ref=true;var n=cellarView().querySelectorAll('.v37-doors button').length;S._v28edit=true;var e=cellarView().querySelectorAll('.v37-doors').length;S._v28edit=false;return n===2&&e===0;}));
    await page.evaluate(()=>{S._v32run={v32:1,deckId:'list',cards:[{kind:'house',id:'w-exact'}],deck:[0],flip:false,done:3,again:2};S.view='housedeck';render();});
    check('unrevealed card contains no culinary door or image hint',await page.locator('[data-v37-lesson],img,[data-teaching-id]').count()===0);
    check('house, component and grape fronts all conceal culinary hints',await page.evaluate(()=>[{kind:'house',id:'w-exact'},{kind:'component',id:'c-exact'},{kind:'grape',g:{g:'Pinot Noir'}}].every(c=>!v32CardFace(c,{flip:false}).includes('data-v37-lesson'))));
    await page.evaluate(()=>{S._v32run.flip=true;render();});
    check('revealed card exposes only the exact lessons without loading images',await page.locator('[data-v37-lesson]').count()===2&&await page.locator('img').count()===0);
    const before = await page.evaluate(()=>JSON.stringify({run:S._v32run,stats:ST,view:S.view,storage:storageWrites}));
    await page.locator('[data-v37-lesson="recommend"]').click();
    await page.getByLabel('A fresh white',{exact:true}).check();
    check('card modal does not offer navigation away into wine references',await page.locator('.v37-viewer .v37-choice-result button').count()===0);
    await page.getByLabel('Practise your recommendation',{exact:true}).focus();
    await page.keyboard.type('red or white');
    for (const key of ['Enter','r','w','Space']) await page.keyboard.press(key);
    check('modal typing cannot flip, advance, mark or persist a card',await page.evaluate(()=>JSON.stringify({run:S._v32run,stats:ST,view:S.view,storage:storageWrites}))===before);
    check('native editing works inside keyboard-isolated dialog',(await page.getByLabel('Practise your recommendation',{exact:true}).inputValue()).startsWith('red or white'));
    await page.keyboard.press('Escape');
    await page.locator('.v37-viewer').waitFor({state:'detached'});
    check('Escape closes and restores the revealed card and opener focus',await page.locator('.v37-viewer').count()===0&&await page.locator('[data-v37-lesson="recommend"]').evaluate(n=>document.activeElement===n)&&await page.evaluate(()=>JSON.stringify({run:S._v32run,stats:ST,view:S.view,storage:storageWrites}))===before);
    await page.locator('[data-v37-lesson="fruit"]').click();
    check('closed lesson guide does not request an image',pictures.length===0&&await page.locator('img').count()===0);
    await page.locator('.v37-viewer [data-teaching-id="grid-colour-rim"] > summary').click();
    await page.getByRole('button',{name:'Retry illustration',exact:true}).waitFor();
    check('failed optional art leaves lesson and practice usable',await page.locator('.v37-viewer .v33-reading').isVisible()&&await page.getByText('What can you observe?',{exact:true}).isVisible());
    check('art requests remain the exact registered full and thumbnail paths',pictures.length===2&&pictures.every(url=>/\/assets\/teach\/grid-colour-rim-v1(?:\.thumb)?\.webp$/.test(url)));
    await page.getByRole('button',{name:'Close practice',exact:true}).click();
    await page.locator('.v37-viewer').waitFor({state:'detached'});
    check('close button restores same card',await page.evaluate(()=>JSON.stringify({run:S._v32run,stats:ST,view:S.view,storage:storageWrites}))===before);
    check('no page errors or storage writes',errors.length===0&&await page.evaluate(()=>storageWrites)===0);
    console.log('Culinary studies: '+checks+' real-browser checks passed.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
