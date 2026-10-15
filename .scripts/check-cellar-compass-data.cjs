/* Prove that the training's authored joins reach shipped records and that
   lessons remain usable without network artwork or unverified stock claims. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||path.join(__dirname,'..'));
const table=path.resolve(process.argv[3]||path.join(root,'..','WorldTable'));
const pack=JSON.parse(fs.readFileSync(path.join(table,'static/shared/packs/brennans-new-orleans.v1.oothouse.json'),'utf8')).house;
const fall=JSON.parse(fs.readFileSync(path.join(table,'src/lib/data/fall-menu-2026.json'),'utf8'));
const c=vm.createContext({});
for(const f of ['data-cellar-compass.js','data-teaching-images.js','data-culinary-studies.js'])vm.runInContext(fs.readFileSync(path.join(root,'js',f),'utf8'),c,{filename:f});
const d=c.CODEX_CELLAR_COMPASS,wines=new Set(pack.wines.map(w=>w.id)),sources=new Set(d.sources.map(s=>s.id)),guides=new Set(c.CODEX_TEACHING_IMAGES.entries.map(x=>x.id)),culinary=new Set(c.CODEX_CULINARY_STUDIES.lessons.map(x=>x.id));
let n=0; const check=(name,value)=>{assert.ok(value,name);n++;};
const text=s=>typeof s==='string'&&s.trim().length>0, unique=xs=>new Set(xs).size===xs.length;
check('versioned teaching data and honest scope',d.version===1&&d.scope.houseId===pack.id&&/targeted/.test(d.scope.note)&&/not been verified bottle by bottle/.test(d.scope.note));
check('source IDs unique and HTTPS',sources.size===d.sources.length&&d.sources.every(s=>text(s.title)&&/^https:\/\//.test(s.url)));
check('12 separate paths with stable IDs',d.paths.length===12&&unique(d.paths.map(p=>p.id)));
const questions=[];
for(const p of d.paths){
 check(p.id+': route-safe stable ID',/^[a-z0-9-]+$/.test(p.id));
 check(p.id+': reading has multiple concrete sections',text(p.title)&&text(p.intro)&&p.sections.length>=3&&p.sections.every(s=>text(s.title)&&s.body.length&&s.body.every(text)));
 check(p.id+': wine joins exist without a copied inventory',p.wineIds.length>0&&unique(p.wineIds)&&p.wineIds.every(id=>wines.has(id)));
 check(p.id+': evidence resolves',p.sourceIds.length>0&&unique(p.sourceIds)&&p.sourceIds.every(id=>sources.has(id)));
 check(p.id+': existing art and reading IDs resolve',p.guideIds.every(id=>guides.has(id))&&p.culinaryIds.every(id=>culinary.has(id)));
 check(p.id+': five independent unscored recall prompts',p.prompts.length===5&&p.prompts.every(q=>text(q.id)&&text(q.question)&&text(q.answer)&&!('correct' in q)&&!('score' in q)&&q.sourceIds.every(id=>sources.has(id))&&q.wineIds.every(id=>wines.has(id))));
 questions.push(...p.prompts.map(q=>q.id));
}
check('all60recallidentitiesunique',questions.length===60&&unique(questions));
check('eight distinct fall workshops',d.workshops.length===8&&unique(d.workshops.map(w=>w.id))&&unique(d.workshops.map(w=>w.dishId)));
const foodItems=Array.isArray(fall)?fall:fall.items||fall.dishes||[];
for(const w of d.workshops){
 const dish=foodItems.find(x=>x.id===w.dishId);
 check(w.id+': real fall dish',!!dish);
 check(w.id+': question, component evidence and scope',text(w.question)&&w.components.length>0&&w.components.every(text)&&/not an approved/.test(w.limits)&&text(w.foodSource));
 check(w.id+': two distinct wine approaches with trade-offs',w.approaches.length===2&&unique(w.approaches.flatMap(x=>x.wineIds))&&w.approaches.every(a=>text(a.title)&&text(a.explanation)&&a.wineIds.length&&a.wineIds.every(id=>wines.has(id))&&a.confirm.length&&a.confirm.every(text)&&text(a.guestLine)));
 check(w.id+': evidence resolves',w.sourceIds.length>0&&w.sourceIds.every(id=>sources.has(id)));
}
const raw=JSON.stringify(d);
check('plain prose avoids forbidden dash characters',!/[\u2013\u2014]/.test(raw));
check('Rubicon lesson carries the exact2010blend and its estate source',raw.includes('86 per cent Cabernet Sauvignon, 6 Cabernet Franc, 5 Petit Verdot and 3 Merlot')&&d.sources.some(s=>s.id==='rubicon-estate'&&s.url==='https://inglenook.com/product/rubicon/'));
check('Sparkling ranges overlap and describe finished wine',/ranges overlap/.test(raw)&&/finished wine/.test(raw)&&/amount added at dosage/.test(raw));
check('Minuty current composition does not claim a confirmed2024ratio',/not a substitute for a 2024 technical sheet/.test(raw));
check('fall workshops do not silently become official tasting pours',d.workshops.every(w=>/not an approved tasting-menu pairing/.test(w.limits)));
console.log('Cellar Compass data: '+n+' checks passed; 12 paths,60 prompts,8 workshops,'+d.sources.length+' sources.');
