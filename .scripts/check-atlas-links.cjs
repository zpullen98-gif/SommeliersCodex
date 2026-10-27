/* Contextual Wine Atlas navigation on the complete shipped layer chain.
   All answers and history live in an isolated browser profile. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||path.join(__dirname,'..'));
const shared=path.resolve(process.env.OOT_SHARED||'C:/Users/zpull/WorldTable/static/shared');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/zpull/WorldTable/node_modules/playwright');
const base=(process.env.CODEX_URL||'http://codex.test/codex/').replace(/\/?$/,'/');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'};
const checks=[],errors=[];
function check(name,pass){checks.push({name,pass:!!pass});assert.ok(pass,name);console.log('PASS '+name);}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext({serviceWorkers:'block',viewport:{width:390,height:844}});
  if(!process.env.CODEX_URL)await context.route('**/*',async route=>{
   const url=new URL(route.request().url());if(url.origin!=='http://codex.test')return route.fulfill({status:404,body:''});
   const isShared=url.pathname.startsWith('/shared/'),dir=isShared?shared:root,prefix=isShared?'/shared/':'/codex/';
   if(!url.pathname.startsWith(prefix))return route.fulfill({status:404,body:''});
   const relative=decodeURIComponent(url.pathname.slice(prefix.length))||'index.html',file=path.resolve(dir,relative);
   if(!file.startsWith(dir+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return route.fulfill({status:404,body:''});
   let body=fs.readFileSync(file);
   if(!isShared&&relative==='index.html'&&!body.toString().includes('../shared/oot-house.js'))body=Buffer.from(body.toString().replace('<script src="js/data-questions.js','<script src="../shared/oot-house.js"></script><script src="../shared/oot-house-ui.js"></script>\n<script src="js/data-questions.js'));
   return route.fulfill({contentType:mime[path.extname(file)]||'application/octet-stream',body});
  });
  const page=await context.newPage();page.on('pageerror',e=>{errors.push(e.message);console.error('BROWSER '+e.message);});
  await page.goto(base+'?nosw&check=atlas-links#/v/houserehearsal');
  await page.waitForFunction(()=>V32.booted&&typeof v52WineTargets==='function'&&v32HasHouse());
  const store=()=>page.evaluate(()=>JSON.stringify({q:ST.q,srs:ST.srs,hist:ST.hist,results:S.results,idx:S.idx,correct:S.correct,mode:S.mode,answered:S.answered,picked:S.picked,saText:S.saText,saGraded:S.saGraded}));
  const refs=()=>page.evaluate(()=>{window.__atlasRefs={pool:S.pool,target:V51_TARGET,run:S._v32run,report:S._v25lt};});
  async function answer(wrong=false){
   await page.locator('.opts .opt').nth(await page.evaluate(w=>{const q=S.pool[S.idx];return w?(q.a+1)%q.opts.length:q.a;},wrong)).click();
   await page.locator('.reveal').waitFor();
  }
  async function detour(link,expectedView,label,keyboard=false){
   const before=await store();await refs();
   const href=await link.getAttribute('href'),id=await link.getAttribute('id'),depth=await page.evaluate(()=>V32.d);
   check(label+' has a canonical atlas destination',/^#\/v\/(fieldmap|worldmap|country|region)\/[a-z0-9-]+$/.test(href));
   check(label+' has a stable opener identity',!!id);
   await link.focus();if(keyboard)await link.press('Enter');else await link.click();
   await page.waitForFunction(h=>location.hash===h,href);
   if(href.startsWith('#/v/fieldmap/'))check(label+' opens the actual mapped region and place key',await page.locator('.v45-map .v45-key li').count()>0&&await page.evaluate(h=>!!v45Map(S._v45map)&&S._v45map===h.split('/').pop(),href));
   check(label+' opens exactly one history entry without changing marks',await page.evaluate(d=>V32.d===d+1,depth)&&await store()===before);
   check(label+' retains the actual quiz, card and recovery objects',await page.evaluate(()=>S.pool===__atlasRefs.pool&&S._v32run===__atlasRefs.run&&V51_TARGET===__atlasRefs.target&&S._v25lt===__atlasRefs.report));
   await page.locator('#v32-back').click();await page.waitForFunction(v=>S.view===v,expectedView);
   check(label+' Back retains the exact state and score',await store()===before&&await page.evaluate(()=>S.pool===__atlasRefs.pool&&S._v32run===__atlasRefs.run&&V51_TARGET===__atlasRefs.target&&S._v25lt===__atlasRefs.report));
   check(label+' Back restores the visible opener focus',await page.waitForFunction(id=>document.activeElement&&document.activeElement.id===id,id).then(()=>true)&&await page.locator('#'+id).isVisible());
  }
  const known=await page.evaluate(()=>{
   applyLevel('certified',true);
   const q=v27CellarHouseQs().find(q=>q.id.endsWith('-serve')&&v52ForQuestion(q).some(t=>t.view==='fieldmap'));
   if(!q)throw Error('No mapped Brennan service question');window.__atlasHouse=q;
   const mc=QUESTIONS.find(q=>!q.sa&&!q.mt&&!q.sel&&Array.isArray(q.opts)&&v52ForQuestion(q).some(t=>t.view==='fieldmap'));
   const sa=QUESTIONS.find(q=>q.sa&&!q.mt&&!q.sel&&q.ans&&v52ForQuestion(q).some(t=>t.view==='fieldmap'));
   if(!mc||!sa)throw Error('No mapped course question fixtures');window.__atlasMC=mc;window.__atlasSA=sa;
   return {wine:q.id.slice(2,-6),house:q.id,mc:mc.id,sa:sa.id};
  });
  console.log(JSON.stringify({fixtures:known}));
  await page.evaluate(()=>v28RunDrill([__atlasHouse,__atlasHouse],()=>{}));
  check('Brennan quiz front has no atlas clues, even in hidden DOM',await page.locator('.v52-atlas,.v52-atlas-link').count()===0);
  await answer();
  check('correct Brennan answer exposes its region beside feedback',await page.locator('.reveal .v52-atlas-link:visible').count()>0);
  await detour(page.locator('.reveal .v52-atlas-link:visible').first(),'quiz','Correct Brennan answer',true);
  await page.locator('.reveal .v49-learn > summary').click();
  await detour(page.locator('.reveal .v49-reading .v52-atlas-link:visible').first(),'quiz','Nested Learn why answer',true);
  check('Back reopens the exact Learn why disclosure around its atlas link',await page.locator('.reveal .v49-learn[open] .v52-atlas-link').first().isVisible());
  await page.locator('#nextbtn').click();
  check('next question hides all contextual map clues again',await page.locator('.v52-atlas,.v52-atlas-link').count()===0);
  await answer(true);await detour(page.locator('.reveal .v52-atlas-link:visible').first(),'quiz','Incorrect Brennan answer');
  await page.locator('#nextbtn').click();await page.waitForFunction(()=>S.view==='results');
  check('Brennan results teach regions for both missed and correct answers',await page.locator('.misslist .v52-atlas-link').count()>0&&await page.locator('.v49-completed .v52-atlas-link').count()>0);
  await detour(page.locator('.misslist .v52-atlas-link:visible').first(),'results','Missed-answer results');
  await page.locator('.v49-completed > summary').click();
  await detour(page.locator('.v49-completed .v52-atlas-link:visible').first(),'results','Correct-answer results');

  await page.evaluate(()=>v28RunDrill([__atlasMC,__atlasMC],()=>{}));
  check('course multiple-choice front has no atlas clues',await page.locator('.v52-atlas-link').count()===0);
  await answer();await detour(page.locator('.reveal .v52-atlas-link:visible').first(),'quiz','Course multiple-choice answer');
  await page.locator('#nextbtn').click();await answer(true);await page.locator('#nextbtn').click();await page.waitForFunction(()=>S.view==='results');
  check('course results have map connections for misses and optional correct-answer review',await page.locator('.misslist .v52-atlas-link').count()>0&&await page.locator('.v52-correct .v52-atlas-link').count()>0);
  await page.locator('.v52-correct > summary').click();await detour(page.locator('.v52-correct .v52-atlas-link:visible').first(),'results','Correct course results');
  await page.evaluate(()=>v28RunDrill([__atlasSA],()=>{}));
  check('short-answer front conceals atlas context',await page.locator('.v52-atlas-link').count()===0);
  await page.evaluate(()=>{S.saText=S.pool[S.idx].ans;submitSA();});
  await detour(page.locator('.reveal .v52-atlas-link:visible').first(),'quiz','Course short answer',true);

  await page.evaluate(()=>v39Open('region','champagne','push'));
  await page.waitForFunction(()=>v39RecReady(v39Find('champagne'))&&v39Questions(['champagne']).length>0);
  await page.evaluate(()=>{v39StartDrill(['champagne']);S.idx=S.pool.findIndex(q=>!q.sa&&!q.mt&&!q.sel);resetQ();render();});
  check('regional quiz front conceals the region link',await page.locator('.v52-atlas-link').count()===0);
  await answer();
  check('Champagne regional answer returns to the Champagne map',await page.locator('.reveal .v52-atlas-link[href="#/v/fieldmap/champagne"]').count()>0);
  await detour(page.locator('.reveal .v52-atlas-link:visible').first(),'quiz','Regional answer');

  for(const mode of ['mock','sim','finals']){
   await page.evaluate(mode=>{v28RunDrill([__atlasMC],()=>{});S.mode=mode;S.remain=123;S._fin=null;render();},mode);
   await answer();
   check(mode+' sitting withholds atlas shortcuts after answering',await page.locator('.v52-atlas-link').count()===0&&await page.evaluate(mode=>S.mode===mode&&S.remain===123,mode));
   await page.evaluate(()=>{S.view='results';V32.pend='push';render();});
   check(mode+' completed results expose optional atlas study',await page.locator('.v52-atlas-link').count()>0);
  }
  await page.evaluate(()=>{S._v25lt={lv:'certified',theory:[{q:__atlasMC,user:'An incorrect answer'}],grid:[],floor:[],gridSat:false,floorSat:false};S._fin=null;S.view='finalsreport';V32.pend='push';render();});
  check('level-test report adds the missed theory region',await page.locator('.lt-group .v52-atlas-link').count()>0);
  await detour(page.locator('.lt-group .v52-atlas-link:visible').first(),'finalsreport','Level-test report');
  await page.evaluate(()=>{S._v25lt=null;S._fin=null;S.mode=null;});

  await page.evaluate(wine=>v32Go({view:'cellar',arg:wine},'push'),known.wine);
  check('Brennan wine profile shows the atlas near its identity',await page.locator('.v28-card .v52-atlas-link:visible').count()>0||await page.locator('.v52-atlas-link:visible').count()>0);
  await detour(page.locator('.v52-atlas-link:visible').first(),'cellar','Brennan wine profile');
  await page.evaluate(wine=>v32StartRun('list',{cards:v32HouseCards([wine]),keepOrder:true,push:true}),known.wine);
  check('wine flashcard front has no region answer links',await page.locator('.v52-atlas-link').count()===0);
  await page.locator('[data-v32="flip"]').first().click();await page.locator('.v49-learn > summary').click();
  await detour(page.locator('.v49-reading .v52-atlas-link:visible').first(),'housedeck','Revealed wine card',true);
  check('card remains revealed after reading the map',await page.evaluate(()=>!!S._v32run.flip));
  await page.evaluate(()=>v29Open('cellar'));
  await page.locator('.v29-row').first().waitFor();
  await page.locator('.v29-row').first().click();
  check('printed wine-list detail has an atlas connection',await page.locator('.v29-detail:not([hidden]) .v52-atlas-link').count()>0);
  await detour(page.locator('.v29-detail:not([hidden]) .v52-atlas-link:visible').first(),'fulllist','Printed wine list');

  const recovery=await page.evaluate(wine=>{
   applyLevel('certified',true);const key='intro|h-'+wine+'-serve';ST.q[key]={c:0,w:1,s:0};v51Open();v51Start(key);
   S.idx=S.pool.findIndex(q=>q.id==='h-'+wine+'-serve');resetQ();render();return key;
  },known.wine);
  check('targeted recovery front has no region clue',await page.locator('.v52-atlas-link').count()===0);
  await answer();await detour(page.locator('.reveal .v52-atlas-link:visible').first(),'quiz','Exact-skill recovery',true);
  check('reading preserves recovered skill in its original level scope',await page.evaluate(key=>V51_TARGET.entry.key===key&&V51_TARGET.recorded&&V51_TARGET.correct&&ST.q[key].s===1,recovery));
  const axeFile=path.join(path.dirname(require.resolve(process.env.PLAYWRIGHT_MODULE||'C:/Users/zpull/WorldTable/node_modules/playwright')),'..','axe-core','axe.min.js');
  if(fs.existsSync(axeFile))await page.addScriptTag({path:axeFile});
  for(const width of [320,390])for(const theme of ['day','night']){
   await page.setViewportSize({width,height:844});
   await page.evaluate(theme=>OOT.service.set(theme),theme);
   check(theme+' service is applied at '+width+'px',await page.evaluate(theme=>document.documentElement.getAttribute('data-service')===theme,theme));
   check(theme+' atlas links fit '+width+'px without horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   check(theme+' atlas links retain usable touch targets at '+width+'px',await page.locator('.reveal .v52-atlas-link:visible').evaluateAll(nodes=>nodes.length>0&&nodes.every(n=>n.getBoundingClientRect().height>=44)));
   if(fs.existsSync(axeFile)){
    const violations=await page.evaluate(async()=>{const report=await axe.run({include:[['.reveal .v52-atlas']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return report.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)}));});
    if(violations.length)console.log(JSON.stringify({theme,width,violations}));
    check(theme+' atlas connections pass scoped accessibility checks at '+width+'px',violations.length===0);
   }
  }
  const firstHref=await page.locator('.reveal .v52-atlas-link:visible').first().getAttribute('href');
  await page.goto(base+'?nosw&check=atlas-links-deep'+firstHref);await page.waitForFunction(()=>V32.booted&&S.view==='fieldmap');
  check('shared direct map address resolves after a fresh reload',await page.locator('.v45-map h2').count()===1||await page.locator('.v45-map').count()===1);
  check('complete atlas-link journey raises no JavaScript errors',errors.length===0);
  if(process.env.CODEX_REPORT)fs.writeFileSync(process.env.CODEX_REPORT,JSON.stringify({checks,errors},null,2));
  console.log('Atlas links: all '+checks.length+' checks pass.');await context.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
