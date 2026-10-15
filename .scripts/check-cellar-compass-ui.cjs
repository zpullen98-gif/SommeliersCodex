/* Complete-script integration, isolated from the user's browser and marks.
   Optional CODEX_URL tests a running source/public preview instead of fixtures. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||path.join(__dirname,'..'));
const shared=path.resolve(process.env.OOT_SHARED||path.join(root,'..','WorldTable','static','shared'));
const {chromium}=require(process.argv[3]||path.join(root,'..','WorldTable','node_modules','playwright'));
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'};
const results=[];
function check(name,value){results.push({name,pass:!!value});assert.ok(value,name);console.log('  ok  '+name);}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  async function device(hash){
   const context=await browser.newContext({serviceWorkers:'block',timezoneId:'America/New_York',viewport:{width:390,height:844}}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   if(!process.env.CODEX_URL)await context.route('**/*',async route=>{
    const url=new URL(route.request().url());if(url.origin!=='http://codex.test')return route.fulfill({status:404,body:''});
    const isShared=url.pathname.startsWith('/shared/'),base=isShared?shared:root,prefix=isShared?'/shared/':'/codex/';
    if(!url.pathname.startsWith(prefix))return route.fulfill({status:404,body:''});
    const relative=decodeURIComponent(url.pathname.slice(prefix.length))||'index.html',file=path.resolve(base,relative);
    if(!file.startsWith(base+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return route.fulfill({status:404,body:''});
    let body=fs.readFileSync(file);
    if(!isShared&&relative==='index.html'&&!body.toString('utf8').includes('../shared/oot-house.js'))body=Buffer.from(body.toString('utf8').replace('<script src="js/data-questions.js','<script src="../shared/oot-house.js"></script><script src="../shared/oot-house-ui.js"></script>\n<script src="js/data-questions.js'));
    return route.fulfill({contentType:mime[path.extname(file)]||'application/octet-stream',body});
   });
   const base=(process.env.CODEX_URL||'http://codex.test/codex/').replace(/\/?$/,'/');
   await page.goto(base+'?nosw'+hash);
   await page.waitForFunction(()=>typeof v40Rows==='function'&&V32.booted&&v40Rows().length>0);
   return {context,page,errors};
  }
  const d=await device('#/level'),p=d.page;
  const info=await p.evaluate(()=>({rows:v40Rows().length,menu:v40Rows().filter(r=>!r.bottle).length,floor:v40Rows().filter(r=>r.bottle).length,paths:v40Paths().length,prompts:v40Paths().reduce((n,x)=>n+x.prompts.length,0),workshops:v40Workshops().length}));
  check('current house contains every 271 study wine',info.rows===271&&info.menu===34&&info.floor===237);
  check('authored 12 paths and 60 recall prompts are loaded',info.paths===12&&info.prompts===60);
  check('eight fall workshops are loaded',info.workshops===8);
  check('Today and My Restaurant each have a clear Compass doorway',await p.locator('[data-go="cellarcompass"]').count()===2);
  await p.getByRole('button',{name:'Your cellar study',exact:false}).click();
  check('Today doorway opens Compass',await p.locator('.v40-compass').count()===1);
  check('guided studies show all 12 paths',await p.locator('.v40-tile').count()===12);
  const daily=await p.evaluate(()=>{var ids=v40DailyIds();return{ids,menu:ids.filter(id=>!v32Wine(id).list).length,floor:ids.filter(id=>v32Wine(id).list==='bottle').length};});
  check('fresh daily run is 10 distinct wines split five menu and five floor',daily.ids.length===10&&new Set(daily.ids).size===10&&daily.menu===5&&daily.floor===5);
  check('existing Due today still uses the existing menu pool',await p.evaluate(()=>v32DueToday().houseIds.every(id=>!v32Wine(id).list)));
  for(const lv of ['intro','certified','advanced','master']){
   const same=await p.evaluate(lv=>{if(!LEVELS[lv])return false;var before=v40Rows().length;applyLevel(lv);return v40Rows().length===before;},lv);
   check('study wine collection is not gated by '+lv,same);
  }
  await p.evaluate(()=>v40Go('wines'));
  check('directory shows 271 and starts with 30 rows',await p.locator('#v40-result-count').textContent().then(t=>t.includes('271 of 271'))&&await p.locator('.v40-wine-row').count()===30);
  await p.getByLabel('Collection',{exact:true}).selectOption('bottle');
  check('floor filter exposes all 237',await p.locator('#v40-result-count').textContent().then(t=>t.startsWith('237 of 271')));
  await p.getByLabel('Collection',{exact:true}).selectOption('menu');
  check('menu filter exposes all 34',await p.locator('#v40-result-count').textContent().then(t=>t.startsWith('34 of 271')));
  await p.getByRole('button',{name:'Show more wines',exact:true}).click();
  check('show more reaches remaining menu wines',await p.locator('.v40-wine-row').count()===34);
  const chosen=await p.locator('.v40-wine-row').last().getAttribute('data-v40-wine');
  await p.locator('.v40-wine-row').last().click();
  check('directory opens exact existing wine card',await p.evaluate(id=>S.view==='cellar'&&v28State().open===id,chosen));
  check('wine card retains producer and component connections',await p.locator('.v38-who,.v35-madeof').count()>0);
  await p.locator('#v32-back').click();await p.waitForFunction(()=>S.view==='cellarcompass');
  check('Back restores directory filter and expanded rows',await p.getByLabel('Collection',{exact:true}).inputValue()==='menu'&&await p.locator('.v40-wine-row').count()===34);
  await p.getByRole('button',{name:'Clear filters',exact:true}).click();
  await p.getByLabel('Find a wine',{exact:true}).fill('A&B / Côte + ?');
  const filteredHash=await p.evaluate(()=>location.hash);await p.reload();await p.waitForFunction(()=>typeof v40Rows==='function'&&V32.booted&&v40Rows().length===271);
  check('reload preserves punctuation and accented search text',await p.getByLabel('Find a wine',{exact:true}).inputValue()==='A&B / Côte + ?'&&await p.evaluate(()=>location.hash)===filteredHash);
  await p.getByLabel('Find a wine',{exact:true}).fill('zzzz-no-such-wine');
  check('no-match state is actionable',await p.locator('.v40-empty').textContent().then(t=>t.includes('clear the filters')));
  await p.getByRole('button',{name:'Clear filters',exact:true}).click();
  const pathInfo=await p.evaluate(()=>({id:v40Paths()[0].id,n:v40WineIds(v40Paths()[0].wineIds).length}));
  await p.getByLabel('Study path',{exact:true}).selectOption(pathInfo.id);
  check('path filter uses exact authored wine identities',await p.locator('#v40-result-count').textContent().then(t=>t.startsWith(pathInfo.n+' of 271')));
  await p.evaluate(id=>v40Go('path/'+id),pathInfo.id);
  check('all five recall answers start concealed',await p.locator('.v40-prompt:not([open])').count()===5);
  const unchanged=await p.evaluate(()=>JSON.stringify(ST));
  await p.locator('.v40-prompt summary').first().click();
  check('recall disclosure reveals answer without grading',await p.locator('.v40-prompt[open] .v40-answer').isVisible()&&await p.evaluate(()=>JSON.stringify(ST))===unchanged);
  check('path has real sources with safe new-tab links',await p.locator('.v40-sources a').count()>0&&await p.locator('.v40-sources a').evaluateAll(nodes=>nodes.every(a=>a.href.startsWith('https://')&&a.rel.includes('noopener'))));
  await p.getByRole('button',{name:'Study these wine cards',exact:true}).click();
  check('path deck reuses exact wine IDs',await p.evaluate(id=>S._v32deck==='cellar-path:'+id&&v32DeckDef(S._v32deck).cards.every(c=>c.kind==='house'&&v40Paths()[0].wineIds.includes(c.id)),pathInfo.id));
  await p.evaluate(()=>{v32OpenDeck('cellar-compass');});await p.locator('#v32-start').click();
  check('daily run starts without answer art on its front',await p.locator('#v32-face').count()===1&&await p.locator('#v32-face img,[data-teaching-id]').count()===0&&await p.evaluate(()=>S._v32run.total===10&&!S._v32run.flip));
  const runIds=await p.evaluate(()=>S._v32run.cards.map(c=>c.id));
  for(let i=0;i<10;i++){await p.evaluate(()=>{S._v32run.flip=true;v32Grade(false);render();});}
  check('daily run completes and uses existing h-w-ID-card keys',await p.evaluate(ids=>S._v32run.deck.length===0&&ids.every(id=>Object.keys(ST.q).some(k=>k.endsWith('h-'+id+'-card'))),runIds));
  check('next daily run advances past wines already studied today',await p.evaluate(ids=>v40DailyIds().every(id=>!ids.includes(id)),runIds));
  await p.locator('[data-v32="runmisses"]').click();
  check('retry misses preserves all 10 original house card identities',await p.evaluate(ids=>S._v32run.deckId==='misses'&&S._v32run.cards.length===10&&S._v32run.cards.every(c=>ids.includes(c.id)),runIds));
  check('house card results do not create academic question IDs',await p.evaluate(()=>Object.keys(ST.q).every(k=>/^h-w-[a-z0-9]{8}-card$/.test(k.replace(/^[^|]+\|/,'')))));
  const scheduling=await p.evaluate(()=>{
   var keep=ST,rows=v40Rows(),menu=rows.filter(r=>!r.bottle),stamp=Date.now(),house=v32House().id,id=menu[menu.length-1].id;
   ST={q:{},srs:{},cellarCompassSeen:{}};var key='cert|h-'+id+'-card';ST.q[key]={c:0,w:1,s:0};ST.cellarCompassSeen[house]={[id]:stamp-86400000};
   var weak=v40DailyIds(stamp)[0]===menu[menu.length-1].id;
   ST.cellarCompassSeen[house][id]=stamp+86400000;var future=!v40Records(stamp)[id].day;
   ST.cellarCompassSeen[house][id]='2026-10-15';var invalid=!v40Records(stamp)[id].day;
   ST.cellarCompassSeen[house][id]=1e99;var enormous=!v40Records(stamp)[id].day;
   ST=keep;return{weak,future,invalid,enormous};
  });
  for(const key of Object.keys(scheduling))check('scheduler '+key+' contract',scheduling[key]);
  check('local study day does not roll over during the US evening',await p.evaluate(()=>v40Day(Date.parse('2026-10-16T03:59:00Z'))==='2026-10-15'));
  check('local study day rolls over at local midnight',await p.evaluate(()=>v40Day(Date.parse('2026-10-16T04:00:00Z'))==='2026-10-16'));
  const portability=await p.evaluate(()=>{
   var saved=JSON.stringify(ST),house=v32House().id,ids=v40Rows().slice(0,3).map(r=>r.id),now=Date.now();
   var exported=JSON.parse(exportPayload()).stats.cellarCompassSeen,exportedOK=!!exported&&Object.keys(exported[house]||{}).length===10;
   var raw={};raw[house]={[ids[0]]:now-5000,[ids[1]]:now+999999,[ids[2]]:'bad'};raw.__proto__={polluted:true};
   ST.cellarCompassSeen={[house]:{[ids[0]]:now-2000}};mergeStats({stats:{cellarCompassSeen:raw}});
   var mergeOlder=ST.cellarCompassSeen[house][ids[0]]===now-2000,clean=Object.keys(ST.cellarCompassSeen[house]).length===1;
   raw[house][ids[0]]=now-1000;mergeStats({stats:{cellarCompassSeen:raw}});var mergeNewer=ST.cellarCompassSeen[house][ids[0]]===now-1000;
   v27Rekey(ids[0],ids[1]);var rename=ST.cellarCompassSeen[house][ids[1]]===now-1000&&!ST.cellarCompassSeen[house][ids[0]];
   var qBefore=Object.keys(ST.q).length;stReset();var reset=Object.keys(ST.cellarCompassSeen).length===0&&Object.keys(ST.q).length===0;
   ST=JSON.parse(saved);stSave();return{exportedOK,mergeOlder,clean,mergeNewer,rename,reset,noHouseSrs:Object.keys(ST.srs).every(k=>!k.includes('h-w-'))};
  });
  for(const key of Object.keys(portability))check('recency portability '+key,portability[key]);
  await p.reload();await p.waitForFunction(()=>typeof v40Rows==='function'&&V32.booted&&v40Rows().length===271);
  check('recency survives reload and next selection still advances',await p.evaluate(ids=>v40DailyIds().every(id=>!ids.includes(id)),runIds));
  const lessons=await p.evaluate(()=>v40Paths().map(x=>({id:x.id,prompts:x.prompts.length,sections:x.sections.length})));
  for(const item of lessons){await p.evaluate(id=>v40Go('path/'+id),item.id);check(item.id+' renders all reading sections and hidden prompts',await p.locator('.v40-reading-section').count()===item.sections&&await p.locator('.v40-prompt:not([open])').count()===item.prompts);}
  const workshops=await p.evaluate(()=>v40Workshops().map(w=>w.id));
  for(const id of workshops){await p.evaluate(id=>v40Go('workshop/'+id),id);check(id+' workshop renders approaches and rehearsal',await p.locator('.v40-approach').count()>=2&&await p.locator('#v40-rehearsal').count()===1);}
  const ungraded=await p.evaluate(()=>JSON.stringify(ST));await p.getByLabel('Rehearse in your own words',{exact:true}).fill('I would ask about the sauce and the guest preference.');
  check('workshop rehearsal creates no study marks',await p.evaluate(()=>JSON.stringify(ST))===ungraded);
  const emptyCases=await p.evaluate(()=>{
   var original=v32House,keep=S._v40arg,real=original(),wines=real.wines.filter(w=>v28CardOf(w,real));S._v40arg='';
   v32House=function(){return null;};var empty=v40Rows().length===0&&v40View().querySelectorAll('.v40-tile').length===12;
   var custom={id:'h-custom01',name:'Another restaurant',wines:wines.slice(0,3)};v32House=function(){return custom;};S._v40arg='wines';
   var page=v40View(),text=page.textContent,limited=v40DailyIds().length===3&&new Set(v40DailyIds()).size===3;
   var scoped=text.includes('Your current house collection is different')&&!text.includes('thousands of entries')&&!Array.from(page.querySelectorAll('button')).some(b=>b.textContent==='Open the full printed list');
   v32House=original;S._v40arg=keep;return{empty,limited,scoped};
  });for(const key of Object.keys(emptyCases))check('house boundary '+key,emptyCases[key]);
  for(const width of [320,390])for(const theme of ['day','night']){
   await p.setViewportSize({width,height:844});await p.evaluate(theme=>document.documentElement.setAttribute('data-service',theme),theme);
   for(const arg of ['', 'wines','workshops','path/'+pathInfo.id,'workshop/'+workshops[0]]){
    await p.evaluate(arg=>v40Go(arg),arg);
    check(width+'px '+theme+' '+(arg||'overview')+' fits',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    check(width+'px '+theme+' '+(arg||'overview')+' controls at least 44px',await p.locator('.v40-compass button,.v40-compass input,.v40-compass select,.v40-compass summary').evaluateAll(nodes=>nodes.filter(n=>n.getClientRects().length).every(n=>n.getBoundingClientRect().height>=43.5)));
    if(!arg)check(width+'px '+theme+' daily action is visible without scrolling',await p.getByRole('button',{name:'Study 10 wines',exact:true}).evaluate(n=>n.getBoundingClientRect().bottom<=innerHeight));
   }
  }
  if(process.env.CODEX_SHOTS){fs.mkdirSync(process.env.CODEX_SHOTS,{recursive:true});for(const theme of ['day','night']){await p.evaluate(theme=>document.documentElement.setAttribute('data-service',theme),theme);for(const [name,arg] of [['overview',''],['directory','wines'],['path','path/'+pathInfo.id],['workshop','workshop/'+workshops[0]]]){await p.evaluate(arg=>v40Go(arg),arg);await p.screenshot({path:path.join(process.env.CODEX_SHOTS,'compass-'+name+'-'+theme+'-390.png'),fullPage:true});await p.screenshot({path:path.join(process.env.CODEX_SHOTS,'compass-'+name+'-'+theme+'-390-viewport.png')});}}}
  check('full interaction run has no JavaScript errors',d.errors.length===0);
  await d.context.close();
  for(const arg of ['', 'path/'+pathInfo.id,'workshop/'+workshops[0],'wines?type=bottle']){
   const x=await device('#/v/cellarcompass'+(arg?'/'+arg:''));
   check('cold route '+(arg||'overview')+' remains exact',await x.page.evaluate(arg=>S.view==='cellarcompass'&&v32Arg(S.view)===arg,arg));
   check('cold route '+(arg||'overview')+' has one Back',await x.page.locator('#v32-back').count()===1);
   await x.page.locator('#v32-back').click();
   check('cold Back '+(arg||'overview')+' reaches structural parent',await x.page.evaluate(arg=>arg.startsWith('path/')?S.view==='cellarcompass'&&v40State().kind==='paths':arg.startsWith('workshop/')?S.view==='cellarcompass'&&v40State().kind==='workshops':S.view==='level',arg));
   check('cold route '+(arg||'overview')+' has no script errors',x.errors.length===0);await x.context.close();
  }
  console.log('\nCellar Compass: '+results.length+' checks passed.');
  if(process.env.CODEX_REPORT)fs.writeFileSync(process.env.CODEX_REPORT,JSON.stringify({checks:results.length,results},null,2)+'\n');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
