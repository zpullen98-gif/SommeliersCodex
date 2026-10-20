/* Library and Today search integration. Isolated browser, no owner data.
   node .scripts/check-library-search.cjs [codexRoot] [playwrightModule]
   OOT_SHARED selects canonical house files; CODEX_URL tests a served edition. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||path.join(__dirname,'..'));
const shared=path.resolve(process.env.OOT_SHARED||path.join(root,'..','WorldTable','static','shared'));
const {chromium}=require(process.argv[3]||path.join(root,'..','WorldTable','node_modules','playwright'));
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'};
(async()=>{
const browser=await chromium.launch({headless:true});
try {
const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
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
const page=await context.newPage();
const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
const start=new URL(process.env.CODEX_URL||'http://codex.test/codex/');start.searchParams.set('nosw','');start.hash='/library';await page.goto(start.href);
await page.waitForFunction(()=>typeof v44Index==='function'&&V32.booted&&v40Rows().length>0);
assert.equal(await page.evaluate(()=>typeof v44Index),'function','library layer loaded by index');
const initialMarks=await page.evaluate(()=>JSON.stringify({q:ST.q,srs:ST.srs}));
const counts=await page.evaluate(()=>Object.fromEntries(Object.entries(v44Index()).map(([key,rows])=>[key,rows.length])));
assert(counts.learn>40 && counts.places>100 && counts.chapters>70);
assert.equal(counts.chapters,await page.evaluate(()=>Object.keys(LEVELS).reduce((n,key)=>n+(LEVELS[key].primers||[]).length,0)),'every chapter is searchable');
const badTargets=await page.evaluate(()=>Object.values(v44Index()).flat().filter(row=>{
  if(row.kind==='route'){
    if(row.arg==='illustrations')return !CodexTeachingCache.entry(row.extra);
    if(row.arg==='culinary'&&row.extra)return !v37Lesson(row.extra);
    if(row.arg==='cellarcompass'&&row.extra){
      const [kind,id]=row.extra.split('/');
      return kind==='path'?!v40Find(v40Paths(),id):kind==='workshop'?!v40Find(v40Workshops(),id):true;
    }
    if(row.arg==='tastegrid')return typeof tasteGridView!=='function';
    if(row.arg==='worldmap')return typeof worldMapView!=='function';
    return !V25_VIEWS[row.arg];
  }
  if(row.kind==='regionroute')return row.arg==='region'?!v39Find(row.extra):row.arg==='country'?!v39Country(row.extra):!v39Table(row.extra);
  if(row.kind==='producer')return !prodById(row.arg);
  if(row.kind==='grape')return !v32AllGrapes().some(g=>g.g===row.arg);
  if(row.kind==='chapter')return !v25HasChapter(row.arg,row.extra);
  if(row.kind==='primer')return !LEVELS.intro.primers[Number(row.arg)];
  return true;
}).map(row=>({title:row.title,kind:row.kind,arg:row.arg,extra:row.extra})));
assert.deepEqual(badTargets,[],'every indexed learning destination resolves to authored content');
const results=[];
for(const query of ['Decanting','Champagne','Food pairing','Pinot Noir','Château','Gewurztraminer','acidity','hollandaise','mendoza','qzznomatches']) {
  await page.locator('#cf-in').fill(query);
  const result=await page.evaluate(()=>({text:document.querySelector('#cf-in-out').innerText,buttons:document.querySelectorAll('#cf-in-out [data-v44="open"]').length}));
  if(query==='qzznomatches') assert.match(result.text,/No matches/);
  else assert(result.buttons>0,query);
  results.push({query,buttons:result.buttons,text:result.text.slice(0,240)});
}
await page.getByRole('button',{name:'Clear search',exact:true}).click();
assert.equal(await page.locator('#cf-in').inputValue(),'');
await page.getByRole('button',{name:'Decanting',exact:true}).click();
assert.equal(await page.locator('#cf-in').inputValue(),'Decanting');
assert((await page.locator('#cf-in-out').innerText()).includes('Service reference'));
await page.locator('[data-v44-kind="regionroute"][data-v44-arg="serviceref"][data-v44-extra="decanting"]').click();
assert.equal(await page.evaluate(()=>S.view),'serviceref');
assert.equal(await page.evaluate(()=>S._v39table),'decanting');
await page.locator('#v32-back').click();
assert.equal(await page.locator('#cf-in').inputValue(),'Decanting');
assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('data-v44-extra')),'decanting');
await page.locator('#cf-in').fill('bordeaux');
for(const kind of ['route','regionroute','wine','grape','producer','chapter']) {
  const testQuery={route:'decanting',regionroute:'mendoza',wine:'pinot',grape:'pinot noir',producer:'chateau',chapter:'burgundy'}[kind];
  await page.locator('#cf-in').fill(testQuery);
  const button=page.locator(`[data-v44-kind="${kind}"]`).first();
  assert(await button.count(),kind);
  const expected=await button.evaluate(b=>({...b.dataset}));
  await button.click();
  assert.notEqual(await page.evaluate(()=>S.view),'library',kind);
  results.push({kind,expected,route:await page.evaluate(()=>location.hash)});
  await page.locator('#v32-back').click();
  assert.equal(await page.evaluate(()=>S.view),'library',kind+' Back');
  assert.equal(await page.locator('#cf-in').inputValue(),testQuery);
}
await page.locator('#cf-in').fill('chateau');
const more=page.locator('[data-v44="more"][data-v44-group="producers"]');
const before=await page.locator('#v44-group-producers').locator('..').locator('[data-v44="open"]').count();
await more.click();
const after=await page.locator('#v44-group-producers').locator('..').locator('[data-v44="open"]').count();
assert(after>before);
await page.locator('#cf-in').fill('<img src=x onerror=alert(1)>');
assert.equal(await page.locator('#cf-in-out img').count(),0);
assert.equal(await page.locator('#cf-in').inputValue(),'<img src=x onerror=alert(1)>');
await page.locator('#cf-in').fill('decanting');
assert.equal(await page.evaluate(()=>JSON.stringify({q:ST.q,srs:ST.srs})),initialMarks);
const unmapped=await page.evaluate(()=>v44Index().chapters.find(row=>row.kind==='primer'));
assert(unmapped,'Régionale includes chapters outside question categories');
await page.locator('#cf-in').fill(unmapped.title);
await page.locator('[data-v44-kind="primer"][data-v44-arg="'+unmapped.arg+'"]').click();
assert.equal(await page.evaluate(()=>activeLevel),'intro');
assert.equal(await page.evaluate(()=>S.primerKey),Number(unmapped.arg));
assert.match(await page.locator('#view').innerText(),new RegExp(unmapped.title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
await page.locator('#v32-back').click();
assert.equal(await page.locator('#cf-in').inputValue(),unmapped.title);
await page.locator('#cf-in').fill('decanting');
for(const theme of ['night','day']) {
  await page.evaluate(t=>OOT.service.set(t),theme);
  for(const width of [320,390,1120]) {
    await page.setViewportSize({width,height:844});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${theme} ${width} overflow`);
    const short=await page.locator('.v44-search button:visible').evaluateAll(bs=>bs.filter(b=>b.getBoundingClientRect().height<43).map(b=>b.innerText));
    assert.deepEqual(short,[],`${theme} ${width} touch targets`);
  }
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>scrollTo(0,0));
}
await page.evaluate(()=>{ ST.cellar.push({id:'personal-search-test',name:'Library sentinel',producer:'Own wine',region:'Test place',grapes:'Chardonnay'}); });
await page.locator('#cf-in').fill('Library sentinel');
assert.match(await page.locator('#v44-group-own').innerText(),/Your own wines\s+1/);
await page.locator('[data-v44-kind="wine"][data-v44-arg="personal-search-test"]').click();
assert.match(await page.locator('#view').innerText(),/Library sentinel/);
await page.locator('#v32-back').click();
await page.evaluate(()=>{ ST.cellar=ST.cellar.filter(w=>w.id!=='personal-search-test'); v32Go({view:'level'},'push'); });
assert(await page.locator('#v32-q').count(),'Today search present');
await page.locator('#v32-q').fill('decating');
await page.locator('#v32-q').evaluate(e=>e.setSelectionRange(4,4));
await page.locator('#v32-q').press('n');
assert.equal(await page.locator('#v32-q').inputValue(),'decanting','midword typing caret retained');
await page.locator('#v32-q-out [data-v44-kind="regionroute"][data-v44-arg="serviceref"][data-v44-extra="decanting"]').click();
await page.locator('#v32-back').click();
assert.equal(await page.locator('#v32-q').inputValue(),'decanting');
assert.equal(await page.evaluate(()=>JSON.stringify({q:ST.q,srs:ST.srs})),initialMarks);
assert.deepEqual(errors,[]);
console.log(JSON.stringify({counts,searches:results.length,errors,passed:true},null,2));
} finally { await browser.close(); }


})().catch(error=>{console.error(error);process.exitCode=1;});
