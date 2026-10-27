/* Isolated final-chain browser checks: original skill identity, independent
   recovery, level separation and the complete reading/retest journey. */
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
  await page.goto(base+'?nosw&check=training-recovery#/v/houserehearsal');
  await page.waitForFunction(()=>V32.booted&&typeof v51Entries==='function'&&v32HasHouse());
  const wine=await page.evaluate(()=>{const qs=v27CellarHouseQs();return qs.find(q=>q.id.endsWith('-serve')&&qs.some(p=>p.id===q.id.replace(/-serve$/,'-wineGoesWith'))).id.slice(2,-6);});
  const service='intro|h-'+wine+'-serve',pair='intro|h-'+wine+'-wineGoesWith';
  await page.evaluate(({service,pair})=>{
   applyLevel('certified',true);ST.q={};ST.q[service]={c:0,w:1,s:0};ST.q[pair]={c:0,w:1,s:0};
   ST.srs={'unchanged-course-test':{ef:2.5,iv:4,n:2,due:'2026-10-28'}};stSave();
   v32Go({view:'houserehearsal'},'replace');
  },{service,pair});
  const srsBefore=await page.evaluate(()=>JSON.stringify(ST.srs));
  check('Brennan’s rehearsal directly exposes outstanding exact skills',await page.locator('[data-v51-open]').count()>0);
  const doorDepth=await page.evaluate(()=>V32.d);
  await page.locator('[data-v51-open]').first().click();await page.waitForFunction(()=>S.view==='houserecovery');
  check('one recovery-door click produces one navigation entry',await page.evaluate(d=>V32.d===d+1,doorDepth));
  check('two misses on one wine are two independent skills with the original level',await page.locator('.v51-item').count()===2&&await page.locator('#v51-count').innerText().then(t=>t.startsWith('2 outstanding'))&&await page.locator('.v51-record-scope').first().innerText().then(t=>t.includes('Introductory')));
  const allBefore=await page.evaluate(()=>JSON.stringify(ST.q));
  await page.locator('.v51-item .v49-learn > summary').first().click();
  check('full reading is available without recording or clearing a skill',await page.locator('.v51-item .v49-reading').first().innerText().then(t=>t.length>700)&&await page.evaluate(()=>JSON.stringify(ST.q))===allBefore);
  await page.evaluate(()=>{window.__v51starts=0;const start=v51Start;v51Start=function(){window.__v51starts++;return start.apply(this,arguments)};window.__v51oldLen=cellarDrillLen;cellarDrillLen=()=>1;});
  await page.locator('[data-v51-retest="'+service+'"]').click();await page.waitForFunction(()=>S.view==='quiz');
  check('a single retest click starts one attempt with its target retained despite one-card preference',await page.evaluate(key=>__v51starts===1&&S.pool.length===4&&S.pool.filter(q=>qKey(q)===key).length===1,service));
  check('mixed recovery keeps four distinct answer choices and conceals the named target',await page.evaluate(()=>S.pool.every(q=>q.opts.length===4&&new Set(q.opts).size===4))&&await page.locator('.v51-target').innerText().then(t=>!t.includes('Piper'))&&await page.locator('.v49-learn').count()===0);
  await page.evaluate(()=>cellarDrillLen=window.__v51oldLen);
  async function finishRound(wrongTarget=false){
   for(let step=0;step<8&&await page.evaluate(()=>S.view==='quiz');step++){
    const answer=await page.evaluate(wrong=>{const q=S.pool[S.idx],target=V51_TARGET&&q.id===V51_TARGET.entry.bare;return wrong&&target?(q.a+1)%4:q.a;},wrongTarget);
    await page.locator('.opts .opt').nth(answer).click();
    await page.locator('#nextbtn').click();
   }
   await page.waitForFunction(()=>S.view==='results');
  }
  await finishRound();
  check('correct exact-skill retest repairs original Introductory key without a Certified duplicate',await page.evaluate(key=>ST.q[key].c===1&&ST.q[key].w===1&&ST.q[key].s===1&&!ST.q[key.slice(6)],service));
  check('independent pairing miss remains unresolved after successful service answer',await page.evaluate(key=>ST.q[key].w===1&&ST.q[key].s===0&&v51Entries().some(e=>e.key===key),pair));
  await page.locator('.v51-target [data-v51-open]').click();
  check('resolved service disappears from outstanding list while history remains',await page.locator('[data-v51-retest="'+service+'"]').count()===0&&await page.locator('[data-v51-retest="'+pair+'"]').count()===1);
  await page.evaluate(wine=>{v32StartRun('list',{cards:v32HouseCards([wine]),keepOrder:true,push:true});render();},wine);
  check('general wine card exposes exact recovery and distinguishes its Got it mark',await page.locator('.v51-entry').innerText().then(t=>t.includes('general recall only')));
  await page.locator('[data-v32="flip"]').first().click();await page.locator('[data-v32="got"]').click();
  check('generic wine Got it never clears a pairing failure',await page.evaluate(key=>ST.q[key].s===0&&v51Entries().some(e=>e.key===key),pair));
  await page.evaluate(key=>{v51Open();v51Start(key);},pair);await finishRound(true);
  check('incorrect targeted retest increases only its original miss count',await page.evaluate(key=>ST.q[key].w===2&&ST.q[key].s===0&&!ST.q[key.slice(6)],pair));
  await page.evaluate(()=>v51Open());
  const legacy=await page.evaluate(()=>{
   const key=v27CellarHouseQs().find(q=>q.id.endsWith('-section')).id;ST.q[key]={c:0,w:1,s:0};ST.q['certified|'+key]={c:0,w:1,s:0};
   ST.q['intro|h-w-zzzzzzzz-serve']={c:0,w:1,s:0};ST.q['intro|h-w-dbz9e960-retired']={c:0,w:1,s:0};render();
   return key;
  });
  check('legacy unprefixed and explicit Certified marks remain separately readable',await page.evaluate(()=>v51Entries().filter(e=>e.skill==='section'&&e.level==='certified').length===2));
  await page.evaluate(key=>v51Start(key),legacy);await finishRound();
  check('legacy Certified recovery does not merge the explicit-prefix record',await page.evaluate(key=>ST.q[key].s===1&&ST.q['certified|'+key].s===0,legacy));
  await page.evaluate(()=>v51Open());
  check('unsupported prompt is visibly retained with an honest unavailable path',await page.locator('[data-v51-key="intro|h-w-dbz9e960-retired"] .v51-unavailable').innerText().then(t=>t.includes('history is retained')));
  await page.locator('.v51-archive > summary').click();
  check('removed item is retained in unmatched records, never silently deleted',await page.locator('[data-v51-key="intro|h-w-zzzzzzzz-serve"] .v51-unavailable').isVisible()&&await page.evaluate(()=>!!ST.q['intro|h-w-zzzzzzzz-serve']));
  const unavailableBefore=await page.evaluate(()=>JSON.stringify(ST.q));await page.evaluate(()=>v51Start('intro|h-w-dbz9e960-retired'));
  check('attempting unavailable recovery does not fabricate a result',await page.evaluate(()=>JSON.stringify(ST.q))===unavailableBefore&&await page.locator('.v51-notice').isVisible());
  for(const kind of ['card','word','component','producer-0']){
   const key=await page.evaluate(kind=>{
    const cards=kind==='card'?v32HouseCards(['w-dbz9e960']):kind==='word'?v32WordCards():kind==='component'?v35Cards(v27Current(),'all'):v38Cards(v27Current()).filter(c=>c.n===0);
    const k='advanced|h-'+cards[0].id+'-'+kind;ST.q[k]={c:0,w:1,s:0};v51Open();v51Start(k);return k;
   },kind);
   await page.locator('[data-v32="flip"]').first().click();await page.locator('[data-v32="again"]').click();
   await page.locator('[data-v32="runmisses"]').click();
   await page.locator('[data-v32="flip"]').first().click();await page.locator('[data-v32="got"]').click();
   check(kind+' targeted card miss then Study the misses repairs its original Advanced key',await page.evaluate(k=>ST.q[k].c===1&&ST.q[k].w===2&&ST.q[k].s===1&&!ST.q[k.slice(9)],key));
  }
  async function assess(kind,okay){
   const p=kind==='say'?'hs':'hg';await page.locator('#'+p+'-said').fill(okay?'I have reviewed the full saved answer and can explain its service reasoning.':'This answer needs more work.');
   await page.locator('#'+p+'-check').click();
   for(let i=0;i<4;i++)await page.locator('[data-v50-kind="'+kind+'"][data-v50-criterion="'+i+'"][value="'+(okay?'met':'practice')+'"]').check();
   await page.locator('#'+p+'-record').click();
  }
  for(const kind of ['say','guest'])for(const restart of ['again','edit']){
   const key=await page.evaluate(kind=>{
    const id=kind==='say'?'w-dbz9e960':v27GuestDeck(v27Current())[0].id,k='intro|h-'+id+'-'+(kind==='say'?'say-s10':'guest');
    ST.q[k]={c:0,w:1,s:0};delete ST.q[k.slice(6)];v51Open();v51Start(k);return k;
   },kind);
   await assess(kind,false);
   if(restart==='again')await page.evaluate(kind=>{kind==='say'?v27SayAgain():v27GuestAgain();render();},kind);
   await assess(kind,true);
   check(kind+' failure then '+restart+' retry recovers only original level with explicit assessment',await page.evaluate(k=>ST.q[k].c===1&&ST.q[k].w===2&&ST.q[k].s===1&&!ST.q[k.slice(6)],key));
  }
  check('all recovery routes leave course SRS byte-for-byte unchanged',await page.evaluate(()=>JSON.stringify(ST.srs))===srsBefore);
  const exported=await page.evaluate(()=>exportPayload());
  const restored=await page.evaluate(raw=>{const expected=JSON.stringify(ST.q);ST.q={};mergeStats(JSON.parse(raw));return JSON.stringify(ST.q)===expected;},exported);
  check('export/import round trip preserves exact original and legacy skill keys',restored);
  await page.evaluate(()=>v32Go({view:'deck',deck:'list-weak'},'push'));
  check('existing Revisit list deck has a direct exact-skill recovery door',await page.locator('[data-v51-open]').count()>0);
  await page.evaluate(()=>v51Open());
  await page.setViewportSize({width:320,height:844});
  check('recovery page has no horizontal overflow at 320px',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  check('recovery controls keep a 44px target and 17px reading floor',await page.locator('[data-v51-retest]').first().evaluate(n=>n.getBoundingClientRect().height>=44)&&await page.locator('.v51-record-scope').first().evaluate(n=>parseFloat(getComputedStyle(n).fontSize)>=17));
  await context.setOffline(true);await page.locator('.v51-item .v49-learn > summary').first().click();
  check('loaded exact-skill reading remains usable offline',await page.locator('.v51-item .v49-reading').first().isVisible());await context.setOffline(false);
  await page.goto(base+'?nosw&check=training-recovery-deep#/v/houserecovery');await page.waitForFunction(()=>V32.booted&&S.view==='houserecovery');
  check('recovery is directly addressable after reload and retains unresolved history',await page.locator('#v51-count').innerText().then(t=>!t.startsWith('0 outstanding')));
  check('final chain produced no JavaScript errors',errors.length===0);
  if(process.env.CODEX_REPORT)fs.writeFileSync(process.env.CODEX_REPORT,JSON.stringify({checks,errors},null,2));
  console.log('Training recovery: all '+checks.length+' checks pass.');await context.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
