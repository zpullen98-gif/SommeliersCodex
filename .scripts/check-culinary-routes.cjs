/* Complete shipped script chain: cold links, Back/reload, and phone layout.
   An isolated context serves only local app files and a read-only house pack. */
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const root = path.resolve(process.argv[2] || path.join(__dirname,'..'));
const pack = path.resolve(process.argv[3] || path.join(root,'..','WorldTable','static','shared','packs','brennans-new-orleans.v1.oothouse.json'));
const shared = path.resolve(process.env.OOT_SHARED || path.join(path.dirname(pack),'..'));
const {chromium} = require(process.argv[4] || path.join(root,'..','WorldTable','node_modules','@playwright','test'));
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'};
let checks=0;
function check(name,value){assert.ok(value,name);checks++;console.log('  ok  '+name);}
(async()=>{
  const browser=await chromium.launch({headless:true});
  try{
    async function device(hash,early){
      const context=await browser.newContext({serviceWorkers:'block',viewport:{width:390,height:844}});
      await context.addInitScript(()=>{window.testPushes=0;const push=history.pushState;history.pushState=function(){window.testPushes++;return push.apply(this,arguments);};});
      const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
      await page.route('**/*',async route=>{
        const url=new URL(route.request().url());if(url.origin!=='http://codex.test')return route.fulfill({status:404,body:''});
        if(url.pathname==='/shared/packs/brennans-new-orleans.v1.oothouse.json')return route.fulfill({contentType:'application/json',body:fs.readFileSync(pack)});
        if(url.pathname.startsWith('/shared/')){
          const file=path.resolve(shared,decodeURIComponent(url.pathname.slice('/shared/'.length)));
          if(!file.startsWith(shared+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return route.fulfill({status:404,body:''});
          return route.fulfill({contentType:mime[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)});
        }
        if(!url.pathname.startsWith('/codex/'))return route.fulfill({status:404,body:''});
        const relative=decodeURIComponent(url.pathname.slice('/codex/'.length))||'index.html',file=path.resolve(root,relative);
        if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return route.fulfill({status:404,body:''});
        let body=fs.readFileSync(file);
        // The standalone source omits the suite engine. Serve its real sibling
        // engine for this integration gate, never a replacement house function.
        if(relative==='index.html'&&!body.toString('utf8').includes('../shared/oot-house.js'))body=Buffer.from(body.toString('utf8').replace('<script src="js/data-questions.js','<script src="../shared/oot-house.js"></script><script src="../shared/oot-house-ui.js"></script>\n<script src="js/data-questions.js'));
        if(early&&relative==='js/codex36.js')body=Buffer.from(body.toString('utf8')+'\nrender();\n'+(early==='navigate'?'v32Go({view:"library"},"push");\n':''));
        return route.fulfill({contentType:mime[path.extname(file)]||'application/octet-stream',body});
      });
      await page.goto('http://codex.test/codex/?nosw'+hash);
      await page.waitForFunction(()=>typeof v37Go==='function'&&V32.booted&&!V32.rendering);
      const read=()=>page.evaluate(()=>({view:S.view,id:S._v37lesson||'',hash:location.hash,depth:V32.d,pushes:testPushes}));return{context,page,read,errors};
    }
    for(const early of [false,true])for(const id of ['', 'fruit', 'bottle-check', 'condition', 'guest-care']){
      const hash='#/v/culinary'+(id?'/'+id:''),d=await device(hash,early),state=await d.read(),label=(early?'intervening render':'normal startup')+' '+(id||'overview');
      check(label+': cold link reaches exact lesson',state.view==='culinary'&&state.id===id&&state.hash===hash);
      check(label+': startup replaces existing history entry',state.depth===0&&state.pushes===0);
      check(label+': correct complete screen renders',await d.page.locator('.v37-culinary').count()===1);
      check(label+': no script errors',d.errors.length===0);
      await d.page.locator('#v32-back').click();check(label+': Back reaches Library without a push',(await d.read()).view==='library'&&(await d.read()).pushes===0);
      await d.context.close();
    }
    const unknown=await device('#/v/culinary/missing',true);check('unknown lesson falls back to overview',(await unknown.read()).hash==='#/v/culinary'&&await unknown.page.locator('.v37-lesson-card').count()===8);await unknown.context.close();
    const moved=await device('#/v/culinary/fruit','navigate');check('later navigation is not overwritten by startup recovery',(await moved.read()).view==='library'&&(await moved.read()).depth===1);await moved.context.close();
    const d=await device('#/library');await d.page.getByRole('button',{name:'Explore the culinary companion',exact:true}).click();
    check('Library door focuses the destination instead of an unrelated lesson button',await d.page.evaluate(()=>document.activeElement.id==='view'));
    check('overview leads with the eight lessons and keeps detailed scope closed',await d.page.locator('.v37-lessons + .v37-boundaries:not([open])').count()===1&&await d.page.locator('.v37-lesson-card').count()===8&&await d.page.getByText('About these training examples',{exact:true}).isVisible());
    await d.page.getByRole('button',{name:'Open Fresh, ripe and cooked fruit',exact:true}).click();const before=await d.read();
    check('opening a lesson focuses its destination',await d.page.evaluate(()=>document.activeElement.id==='view'));
    await d.page.reload();await d.page.waitForFunction(()=>typeof v37Go==='function'&&V32.booted);const after=await d.read();
    check('reload preserves lesson route and depth',before.depth===2&&after.depth===2&&before.hash===after.hash&&after.id==='fruit'&&after.pushes===0);
    await d.page.locator('#v32-back').click();await d.page.waitForFunction(()=>S.view==='culinary'&&!S._v37lesson);check('Back after reload returns to collection overview',(await d.read()).depth===1);
    for(const width of [320,390])for(const theme of ['day','night']){
      await d.page.setViewportSize({width,height:844});
      await d.page.evaluate(theme=>{document.documentElement.setAttribute('data-service',theme);},theme);
      for(const id of ['describe','fruit','aromas','sauce','bottle-check','condition','guest-care','recommend']){
        await d.page.evaluate(id=>v37Go(id),id);
        check(width+'px '+theme+' '+id+': no horizontal overflow',await d.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      }
      await d.page.getByLabel('Choose a dish comparison',{exact:true}).selectOption('hussarde');
      await d.page.locator('.v37-options input').first().check();
      check(width+'px '+theme+': choice benefit and trade-off fit the page',await d.page.locator('.v37-choice-result h4').count()===2&&await d.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    }
    await d.page.waitForFunction(()=>v35House()&&v35House().wines.length);
    await d.page.evaluate(()=>v37Go('recommend'));
    await d.page.locator('.v37-options input').first().check();
    const wine=await d.page.locator('.v37-choice-result button').textContent();
    await d.page.locator('.v37-choice-result button').click();
    check('wine study door opens its exact reference and focuses the destination',await d.page.evaluate(()=>S.view==='cellar'&&document.activeElement.id==='view')&&await d.page.locator('#v28-card').count()===1&&await d.page.locator('#v28-card').textContent().then(text=>text.includes(wine.slice('Study '.length))));
    for(const key of ['faults','glassware','temperatures','decanting','sparkling','aperitifs','digestifs']){
      await d.page.evaluate(key=>v39Open('serviceref',key,'push'),key);
      const expected=await d.page.evaluate(key=>SERVICE_REF.tables.find(t=>t.key===key).sources.filter(s=>s.url).map(s=>s.url).sort(),key);
      const actual=await d.page.locator('.v39-sources a').evaluateAll(links=>links.map(a=>a.getAttribute('href')).sort());
      check(key+': reviewed sources are clickable with exact URLs',expected.length>0&&JSON.stringify(actual)===JSON.stringify(expected)&&await d.page.locator('.v39-sources a[target="_blank"][rel="noopener"]').count()===expected.length);
    }
    check('navigation and phone views produce no page errors',d.errors.length===0);await d.context.close();
    console.log('Culinary routes: '+checks+' checks passed.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
