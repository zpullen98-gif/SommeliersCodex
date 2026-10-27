/* Live browser regression for explicit spoken self-assessment. Uses an
   isolated profile only; no owner browser or progress is read. */
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
  await context.addInitScript(()=>{
   window.SpeechRecognition=function(){window.__assessmentRecognition=this;this.start=function(){};this.stop=function(){if(this.onend)this.onend();};};
  });
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
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'?nosw&check=training-assessment#/v/houserehearsal');
  await page.waitForFunction(()=>V32.booted&&typeof v50Record==='function'&&v32HasHouse());
  const untouched=await page.evaluate(()=>JSON.stringify({srs:ST.srs,hist:ST.hist,level:ST.activeLevel}));
  const stats=()=>page.evaluate(()=>JSON.stringify(ST.q));
  async function openSay(length='s10'){
   await page.evaluate(length=>{v27OpenSay();v27SayPick('w-dbz9e960');v27SayLength(length);render();},length);
   await page.locator('#hs-said').waitFor();
  }
  async function doCheck(kind,text){const p=kind==='say'?'hs':'hg';await page.locator('#'+p+'-said').fill(text);await page.locator('#'+p+'-check').click();await page.locator('.v50-assessment').waitFor();}
  async function rate(kind,values=['met','met','met','met']){
   for(let i=0;i<4;i++)await page.locator('[data-v50-kind="'+kind+'"][data-v50-criterion="'+i+'"][value="'+values[i]+'"]').check();
  }
  const model=await page.evaluate(()=>{v27SayPick('w-dbz9e960');return v27Wine('w-dbz9e960').lines.value.s10;});
  await openSay();
  check('no model answer or assessment is revealed before Check',await page.locator('.v50-assessment,.v49-learn').count()===0);
  const before=await stats();
  await doCheck('say','This is not Piper Heidsieck house Champagne. It is not Extra Brut, very dry or crisp.');
  check('contradictory keyword-rich answer does not create a success record',await stats()===before&&await page.locator('#hs-record').isDisabled());
  check('keyword assistance has no automatic verdict or claim of complete accuracy',await page.locator('.v50-feedback').innerText().then(t=>t.includes('Key terms found')&&t.includes('not a passing assessment')&&!/Verdict:|Every part is there/.test(t)));
  check('none of the four assessment criteria is preselected',await page.locator('[data-v50-criterion]:checked').count()===0);
  check('record function also refuses unassessed answers',await page.evaluate(()=>v27SayRecord()===null)&&await stats()===before);
  await rate('say',['practice','practice','practice','met']);
  await page.locator('#hs-record').click();
  check('explicit needs-practice assessment is recorded as a miss under the original key',await page.evaluate(()=>{const k=Object.keys(ST.q).find(k=>k.endsWith('|h-w-dbz9e960-say-s10'));return !!k&&ST.q[k].w===1&&ST.q[k].c===0;}));
  const recorded=await stats();
  check('recording is once per exact assessed attempt',await page.evaluate(()=>v27SayRecord()===null)&&await stats()===recorded);
  check('recorded result identifies self-assessment',await page.locator('.v50-assessment').innerText().then(t=>t.includes('Recorded self-assessment: Needs practice')));

  await openSay();await doCheck('say','Piper Champagne dry');
  check('three-word keyword bag does not automatically pass',await page.locator('#hs-record').isDisabled()&&await stats()===recorded);
  await openSay('s20');await doCheck('say','Piper Champagne dry turtle');
  check('partial matching shows an honest count without Every part',await page.locator('.v50-feedback').innerText().then(t=>/4 of 5 reference parts/.test(t)&&!t.includes('Every part')));

  await openSay('s10');
  const paraphrase='Brennan’s Essential by Piper-Heidsieck is our Champagne: an elegant aperitif, refreshing and low in sweetness.';
  await doCheck('say',paraphrase);await rate('say');await page.locator('#hs-record').click();
  check('supported natural paraphrase can be explicitly assessed despite imperfect keyword coverage',await page.evaluate(()=>S._v27say.grade.coverage<1&&S._v27say.recorded&&S._v27say._v50assessment.outcome===true));
  await openSay('s20');await doCheck('say','Crémant is not Champagne. Brennan’s Essential by Piper-Heidsieck is our house Champagne, very dry and crisp, a fine aperitif.');
  await rate('say');await page.locator('#hs-record').click();
  check('valid negation is not blocked by a crude negative-word blacklist',await page.evaluate(()=>S._v27say.recorded&&S._v27say._v50assessment.outcome===true));

  await openSay();await doCheck('say',model);await rate('say');const beforeEdit=await stats();
  await page.locator('#hs-said').fill('I have no idea.');
  check('typing after Check invalidates feedback and all criterion ratings',await page.locator('.v50-assessment,.v50-feedback,#hs-record').count()===0&&await page.evaluate(()=>!S._v27say.grade&&!S._v27say._v50assessment));
  check('stale answer cannot be recorded by calling the old record entry point',await page.evaluate(()=>v27SayRecord()===null)&&await stats()===beforeEdit);
  await doCheck('say',model);await rate('say');
  await page.evaluate(()=>{document.getElementById('hs-said').value='Changed without an input event.';});
  check('record time rejects a DOM change even without an input event',await page.evaluate(()=>v27SayRecord()===null)&&await stats()===beforeEdit);
  await page.evaluate(()=>render());
  check('stale feedback does not reappear on render',await page.locator('.v50-assessment,.v50-feedback').count()===0);

  await doCheck('say',model);await rate('say');
  await page.locator('#hs-said').evaluate(el=>{el.value='A pasted revision.';el.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertFromPaste',data:'A pasted revision.'}));});
  check('paste invalidates the assessed answer',await page.locator('#hs-record').count()===0&&await page.evaluate(()=>!S._v27say.grade));
  await doCheck('say',model);await rate('say');await page.locator('#hs-speak').click();
  await page.evaluate(()=>window.__assessmentRecognition.onresult({results:[[{transcript:'An additional spoken revision'}]]}));
  check('speech transcription invalidates the assessed answer',await page.locator('#hs-record').count()===0&&await page.evaluate(()=>!S._v27say.grade));
  await page.evaluate(()=>v27StopListening());
  await page.locator('#hs-said').fill(model);await page.locator('#hs-speak').click();
  await page.evaluate(()=>window.__previousAssessmentRecognition=window.__assessmentRecognition);
  await page.locator('#hs-check').click();await rate('say');
  check('checking stops a running recogniser before freezing the answer',await page.evaluate(()=>V27_LISTEN===null));
  await page.evaluate(()=>window.__previousAssessmentRecognition.onresult({results:[[{transcript:'A late result after Check'}]]}));
  check('late speech callback cannot alter a newly checked answer or its assessment',await page.evaluate(model=>S._v27say.said===model&&S._v27say._v50assessment.said===model&&v50CanRecord('say'),model));
  await doCheck('say',model);await rate('say');await page.locator('[data-hs-len="s45"]').click();
  check('duration change clears the assessment',await page.locator('.v50-assessment').count()===0&&await page.evaluate(()=>!S._v27say._v50assessment));
  await doCheck('say',model);await rate('say');await page.locator('#hs-next').click();
  check('wine selection change clears the assessment',await page.locator('.v50-assessment').count()===0&&await page.evaluate(()=>!S._v27say._v50assessment));
  await openSay();await doCheck('say',model+' '+Array(50).fill('wine').join(' '));await rate('say');await page.locator('#hs-record').click();
  check('exceeding a timed cap cannot record an all-criteria success',await page.evaluate(()=>S._v27say.recorded&&S._v27say._v50assessment.outcome===false));
  await openSay();await doCheck('say','');await rate('say');
  check('empty answer cannot be recorded even with all criteria selected',await page.locator('#hs-record').isDisabled()&&await page.evaluate(()=>v27SayRecord()===null));

  await page.evaluate(()=>{v27OpenGuest();v27GuestPick('s-h0nvunh0');render();});
  const guestBefore=await stats();
  const badGuest='Congratulations! We do not pour a prestige vintage Champagne by the glass: Rare, not kept fresh under a Coravin stopper, not at $75. For something lighter, not our house Piper-Heidsieck Extra Brut. And if you are here on a Friday at 5, we never saber Champagne in the courtyard.';
  await doCheck('guest',badGuest);
  check('contradictory guest response is assistance only and records no automatic success',await page.locator('#hg-record').isDisabled()&&await stats()===guestBefore);
  await page.locator('.v49-learn>summary').click();
  check('complete guest response, principle and exact item readings remain available',await page.locator('.v49-reading').innerText().then(t=>t.includes('The full response')&&t.includes('Practise the reasoning'))&&await page.locator('.v49-example').count()>0);
  await rate('guest',['practice','practice','practice','met']);await page.locator('#hg-record').click();
  check('guest self-assessment uses its stable original key',await page.evaluate(()=>Object.entries(ST.q).some(([k,v])=>k.endsWith('|h-s-h0nvunh0-guest')&&v.w===1&&v.c===0)));
  const guestModel=await page.evaluate(()=>S._v27guest.grade.keptYou);
  await doCheck('guest',guestModel);await rate('guest');const guestEditBefore=await stats();
  await page.locator('#hg-said').fill('I have no idea.');
  check('guest editing also clears old feedback and prevents a stale record',await page.locator('#hg-record').count()===0&&await page.evaluate(()=>v27GuestRecord()===null)&&await stats()===guestEditBefore);
  await doCheck('guest',guestModel);await rate('guest');await page.locator('#hg-speak').click();
  await page.evaluate(()=>window.__assessmentRecognition.onresult({results:[[{transcript:'A revised guest answer'}]]}));
  check('guest speech changes also invalidate assessment',await page.locator('#hg-record').count()===0&&await page.evaluate(()=>!S._v27guest.grade));
  await page.evaluate(()=>v27StopListening());
  await doCheck('guest',guestModel);await rate('guest');await page.locator('#hg-next').click();
  check('moving to a different guest clears criterion selection',await page.locator('.v50-assessment').count()===0&&await page.evaluate(()=>!S._v27guest._v50assessment));

  await openSay('s20');await doCheck('say',model);await rate('say');
  await page.locator('.v49-learn>summary').click();
  check('full wine explanations are preserved',await page.locator('.v49-reading').innerText().then(t=>t.length>700&&t.includes('rehearsal aid')));
  const beforeReading=await stats();await page.locator('.v49-learn>summary').focus();await page.keyboard.press('Enter');
  check('keyboard disclosure never records an assessment',await stats()===beforeReading&&!await page.evaluate(()=>S._v27say.recorded));
  await page.locator('[data-v50-criterion="0"][value="met"]').focus();await page.keyboard.press('ArrowRight');
  check('native keyboard ratings work without grading the attempt',await page.locator('[data-v50-criterion="0"][value="practice"]').isChecked()&&await stats()===beforeReading);
  await context.setOffline(true);await page.locator('.v49-learn>summary').click();
  check('already loaded full response and assessment work offline',await page.locator('.v49-reading').isVisible()&&await page.locator('.v50-assessment').isVisible());await context.setOffline(false);
  for(const width of [320,390,1120])for(const service of ['day','night']){
   await page.setViewportSize({width,height:844});
   const button=page.getByRole('button',{name:service==='night'?'Day service on. Switch to night service':'Night service on. Switch to day service',exact:true});
   if(await button.count())await button.click();
   check(width+'px '+service+' assessment has no overflow and comfortable controls',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)&&await page.locator('.v50-options label').evaluateAll(ns=>ns.every(n=>n.getBoundingClientRect().height>=44)));
   if(process.env.CODEX_SCREENSHOTS&&width===390){await page.locator('.v50-assessment').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(process.env.CODEX_SCREENSHOTS,'training-assessment-'+service+'.png')});}
  }
  check('spoken assessment does not change course SRS, history or active level',await page.evaluate(()=>JSON.stringify({srs:ST.srs,hist:ST.hist,level:ST.activeLevel}))===untouched);
  const oldKey=await page.evaluate(()=>{const key=qKey({id:'h-w-dbz9e960-say-s10'});return {key,value:ST.q[key]};});
  await page.reload();await page.waitForFunction(()=>V32.booted&&v32HasHouse());
  check('existing question marks remain readable after reload',await page.evaluate(old=>JSON.stringify(ST.q[old.key])===JSON.stringify(old.value),oldKey));
  check('assessment ratings and answer snapshots are ephemeral',await page.evaluate(()=>!JSON.stringify(ST).includes('_v50assessment')));
  check('no JavaScript errors',errors.length===0);
  if(process.env.CODEX_REPORT)fs.writeFileSync(process.env.CODEX_REPORT,JSON.stringify({checks,errors},null,2));
  console.log('Training assessment: all '+checks.length+' checks pass.');await context.close();
 }finally{await browser.close();}
})().catch(e=>{if(process.env.CODEX_REPORT)fs.writeFileSync(process.env.CODEX_REPORT,JSON.stringify({checks,errors,failure:String(e)},null,2));console.error(e);process.exit(1);});
