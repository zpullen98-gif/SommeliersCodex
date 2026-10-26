/* Post-answer reading on the shipped final chain. All data is an isolated
   browser profile; real answers, keyboard controls and Back are exercised. */
'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const shared = path.resolve(process.env.OOT_SHARED || 'C:/Users/zpull/WorldTable/static/shared');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/zpull/WorldTable/node_modules/playwright');
const base = (process.env.CODEX_URL || 'http://codex.test/codex/').replace(/\/?$/, '/');
const mime = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2' };
const checks=[], errors=[];
function check(name, pass) { checks.push({name,pass:!!pass}); assert.ok(pass,name); console.log('PASS '+name); }
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  const context=await browser.newContext({serviceWorkers:'block',viewport:{width:390,height:844}});
  if(!process.env.CODEX_URL) await context.route('**/*',async route=>{
   const url=new URL(route.request().url()); if(url.origin!=='http://codex.test') return route.fulfill({status:404,body:''});
   const isShared=url.pathname.startsWith('/shared/'),dir=isShared?shared:root,prefix=isShared?'/shared/':'/codex/';
   if(!url.pathname.startsWith(prefix)) return route.fulfill({status:404,body:''});
   const relative=decodeURIComponent(url.pathname.slice(prefix.length))||'index.html',file=path.resolve(dir,relative);
   if(!file.startsWith(dir+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()) return route.fulfill({status:404,body:''});
   let body=fs.readFileSync(file);
   if(!isShared&&relative==='index.html'&&!body.toString().includes('../shared/oot-house.js')) body=Buffer.from(body.toString().replace('<script src="js/data-questions.js','<script src="../shared/oot-house.js"></script><script src="../shared/oot-house-ui.js"></script>\n<script src="js/data-questions.js'));
   return route.fulfill({contentType:mime[path.extname(file)]||'application/octet-stream',body});
  });
  const page=await context.newPage(); page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'?nosw&check=answer-learning#/v/houserehearsal');
  await page.waitForFunction(()=>V32.booted&&typeof v49Reading==='function'&&v32HasHouse());
  const inventory=await page.evaluate(()=>{
   const kinds={};
   const qs=v27CellarHouseQs().concat(v27PairQuestions());
   for(const q of qs){const k=q.id.split('-').slice(3).join('-');kinds[k]=(kinds[k]||0)+1;}
   return {questions:qs.length,uniqueQuestions:new Set(qs.map(q=>q.id)).size,kinds,missing:qs.filter(q=>!q._v49reading||q._v49reading.length<500).map(q=>q.id),
    wines:v32HouseCards(v32Ids({})).length, floor:v32DeckDef('bottles').cards.length,words:v32WordCards().length,
    components:v32DeckDef('components').cards.length,producers:v32DeckDef('producers').cards.length,
    calls:v27ReciteDeck(v27Current()).length,say:v27SayItems().length,guests:v27GuestDeck(v27Current()).length,
    idsStable:qs.every(q=>/^h-[a-z]-[a-z0-9]{8}-/.test(q.id)),four:qs.every(q=>q.opts.length===4&&new Set(q.opts).size===4),
    labelled:qs.every(q=>/saved/.test(q.q))};
  });
  console.log(JSON.stringify(inventory));
  check('every house question has a full explanation and stable identity',inventory.questions>100&&!inventory.missing.length&&inventory.idsStable);
  check('recognition and pairing questions identify the saved source and retain four distinct options',inventory.labelled&&inventory.four);
  check('all nine house question families are represented',Object.keys(inventory.kinds).length===9);
  const resultStore=()=>page.evaluate(()=>JSON.stringify({q:ST.q,srs:ST.srs,hist:ST.hist,results:S.results,idx:S.idx,correct:S.correct}));
  async function choose(index){await page.locator('.opts .opt').nth(index).click();await page.locator('.reveal .v49-learn').waitFor();}
  await page.evaluate(()=>{const q=v27CellarHouseQs().find(q=>q.id.endsWith('-serve'));v28RunDrill([q,q],()=>{});});
  check('unanswered quiz has no explanation, profile link or hidden reading in DOM',await page.locator('.v49-learn,.v49-profile-link,.v49-reading').count()===0);
  await choose(await page.evaluate(()=>S.pool[S.idx].a));
  const afterCorrect=await resultStore();
  const summary=page.locator('.reveal .v49-learn > summary'); await summary.focus(); await summary.press('Enter');
  check('Enter opens Learn why instead of advancing the question',await page.locator('.reveal .v49-learn[open]').count()===1&&await page.evaluate(()=>S.idx)===0);
  check('answer reading contains full profile, service and tableside wording',await page.locator('.v49-reading').innerText().then(t=>t.length>700&&/Serving the wine/.test(t)&&/Put it into words/.test(t)));
  check('reading never grades or moves the round',await resultStore()===afterCorrect);
  await page.locator('.v49-profile-link').first().click(); await page.waitForFunction(()=>S.view==='cellar');
  await page.locator('#v32-back').click(); await page.waitForFunction(()=>S.view==='quiz');
  check('full wine profile and Back retain the exact answered question and score',await resultStore()===afterCorrect&&await page.locator('.reveal').count()===1);
  await page.locator('#nextbtn').click();
  check('next question starts with its reading concealed',await page.locator('.v49-learn').count()===0);
  await choose(await page.evaluate(()=>(S.pool[S.idx].a+1)%4));
  check('incorrect answer also has the correct wine explanation',await page.locator('.reveal .v49-learn').count()===1&&await page.evaluate(()=>S.results[1].ok)===false);
  await page.locator('#nextbtn').click(); await page.waitForFunction(()=>S.view==='results');
  check('results retain Learn why for misses and optional review of correct answers',await page.locator('.misslist .v49-learn').count()===1&&await page.locator('.v49-completed .v49-learn').count()===1);
  for(const kind of ['section','wineGoesWith','firstPickFor','zeroProofFor','producerOf','producerWhere','producerDish','producerPour']){
   await page.evaluate(kind=>{const q=v27CellarHouseQs().concat(v27PairQuestions()).find(q=>q.id.endsWith('-'+kind));v28RunDrill([q,q],()=>{});},kind);
   await choose(await page.evaluate(()=>S.pool[S.idx].a));
   await page.locator('.v49-learn > summary').click();
   check(kind+' opens the correct context without changing its answer',await page.locator('.v49-reading').innerText().then(t=>t.length>500)&&await page.evaluate(()=>S.answered&&S.idx===0));
   await page.locator('#nextbtn').click();await choose(await page.evaluate(()=>(S.pool[S.idx].a+1)%4));
   await page.locator('.v49-learn > summary').click();
   check(kind+' also teaches the correct record after an incorrect answer',await page.locator('.v49-reading').innerText().then(t=>t.length>500)&&await page.evaluate(()=>S.results[1].ok===false&&S.idx===1));
  }
  for(const deck of ['list','bottles','menu-words','cellar-compass','components','producers']){
   await page.evaluate(deck=>v32StartRun(deck,{push:true}),deck); await page.waitForFunction(()=>S.view==='housedeck');
   check(deck+' front has no Learn why content',await page.locator('.v49-learn').count()===0);
   await page.locator('[data-v32="flip"]').first().click(); await page.locator('.v49-learn > summary').click();
   const before=await resultStore();
   check(deck+' revealed card has a substantial explanation',await page.locator('.v49-reading').innerText().then(t=>t.length>180));
   await page.locator('.v49-learn > summary').focus(); await page.keyboard.press('Enter');
   check(deck+' reading keyboard does not grade the card',await resultStore()===before);
  }
  await page.evaluate(()=>startHouseRecite());
  check('list by heart has no reading until reveal',await page.locator('.v49-learn').count()===0);
  await page.locator('#hr-flip').click(); await page.locator('.v49-learn > summary').click();
  check('list by heart opens the complete answer profile',await page.locator('.v49-profile').count()===1);
  await page.evaluate(()=>startCellarRecite());
  check('personal cellar recitation also conceals its reading',await page.locator('.v49-learn').count()===0);
  await page.locator('#cw-flip').click(); await page.locator('.v49-learn > summary').click();
  check('personal cellar recitation connects the revealed wine',await page.locator('.v49-profile').count()===1);
  await page.evaluate(()=>v27OpenSay());
  check('Say the pour conceals its expanded explanation before Check',await page.locator('.v49-learn').count()===0);
  await page.locator('#hs-said').fill('A bright, refreshing wine.'); await page.locator('#hs-check').click();
  const sayBefore=await resultStore(); await page.locator('.v49-learn > summary').click();
  check('Say the pour explains the full wine and the limits of word matching',await page.locator('.v49-reading').innerText().then(t=>/rehearsal aid/.test(t)&&t.length>700));
  check('reading a spoken-answer explanation does not record the grade',await resultStore()===sayBefore&&await page.evaluate(()=>!S._v27say.recorded));
  await page.evaluate(()=>v27OpenGuest());
  check('guest exercise has no explanation before Check',await page.locator('.v49-learn').count()===0);
  await page.locator('#hg-said').fill('I will confirm the details with the team.'); await page.locator('#hg-check').click();
  await page.locator('.v49-learn > summary').click();
  check('guest answer has full response, reasoning and exact referenced items',await page.locator('.v49-reading').innerText().then(t=>/The full response/.test(t)&&/Practise the reasoning/.test(t))&&await page.locator('.v49-example').count()>0);
  for(const service of ['day','night']){
   await page.setViewportSize({width:320,height:844});await page.evaluate(service=>document.documentElement.setAttribute('data-service',service),service);
   await page.locator('.v49-learn').scrollIntoViewIfNeeded();
   check(service+' phone reading has no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   check(service+' reading text remains at least 17px with a 44px disclosure',await page.locator('.v49-reading').evaluate(n=>parseFloat(getComputedStyle(n).fontSize)>=17)&&await page.locator('.v49-learn > summary').evaluate(n=>n.getBoundingClientRect().height>=44));
   if(process.env.CODEX_SCREENSHOTS)await page.screenshot({path:path.join(process.env.CODEX_SCREENSHOTS,'codex-answer-'+service+'-320.png')});
  }
  await context.setOffline(true); await page.locator('.v49-learn > summary').click();await page.locator('.v49-learn > summary').click();
  check('already loaded answer reading opens offline',await page.locator('.v49-reading').isVisible()); await context.setOffline(false);
  const boundary=await page.evaluate(()=>{
   const item={id:'w-12345678',name:'<img src=x onerror=alert(1)>',kind:'wine',profile:{by:'maitre',value:'UNKEPT SECRET'},guest:{by:'person',value:'A <b>kept</b> line'},kept:[{q:'Tell me about it.',a:'OLD DESCRIPTION'},{q:'Tell me about it.',a:'<script>evil()</script>'}]};
   const div=document.createElement('div');div.innerHTML=v49Profile(item,null);
   const q=v27CellarHouseQs()[0],before=v49ForQuestion(q),original=v27Current;
   v27Current=function(){return null};const after=v49ForQuestion(q);v27Current=original;
   const h={wines:[item]},unknown=v49QuestionReading({itemId:item.id},'futureType',h),grapes=v49QuestionReading({itemId:item.id},'wineGrapes',h);
   const component=v27Current().components.find(c=>c.termIds&&c.termIds.length&&v49Text(v49Kept(c,'explain'))),term=component&&v49Find(v27Current(),component.termIds[0]);
   const termReading=term&&v49Word({id:term.id,front:term.term,back:v49Kept(term,'toGuest')});
   const termNode=document.createElement('div');termNode.innerHTML=termReading||'';
   return {safe:!div.querySelector('script,img,b')&&div.textContent.includes('<script>')&&!div.textContent.includes('UNKEPT SECRET'),snapshot:before===after,
    latest:!div.textContent.includes('OLD DESCRIPTION'),neutral:!unknown.includes('food description')&&grapes.includes('recorded grapes'),termDefinition:!!(termReading&&v49Kept(component,'explain').split(/\n\s*\n/).every(p=>termNode.textContent.includes(p)))};
  });
  check('imported values are escaped and unkept marks stay hidden',boundary.safe);
  check('dealt explanations remain tied to their saved answer if house changes',boundary.snapshot);
  check('latest kept description is used and unknown question kinds have neutral reasoning',boundary.latest&&boundary.neutral);
  check('term readings include the linked full component definition',boundary.termDefinition);
  check('final chain produced no JavaScript errors',errors.length===0);
  if(process.env.CODEX_REPORT)fs.writeFileSync(process.env.CODEX_REPORT,JSON.stringify({inventory,checks,errors},null,2));
  console.log('Answer learning: all '+checks.length+' checks pass.'); await context.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
