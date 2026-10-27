/* Pure destination contract: source ownership, conservative geography, no
   distractors or producer-HQ inference, and stable course-bank identities. */
'use strict';
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const packFile = process.env.OOT_HOUSE_PACK || 'C:/Users/zpull/WorldTable/static/shared/packs/brennans-new-orleans.v1.oothouse.json';
const house = JSON.parse(fs.readFileSync(packFile, 'utf8')).house;
const c = { console, v27Current:() => house, v27BottleById:() => null };
vm.createContext(c);
function load(file) { vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), c, { filename:file }); }
['js/data-regions.js', 'js/data-field-atlas.js', 'js/data-maps.js', 'js/data-questions.js', 'js/data-intro.js', 'js/data-advanced.js', 'js/data-master.js'].forEach(load);
const regionCode = fs.readFileSync(path.join(root, 'js/codex39.js'), 'utf8');
vm.runInContext(regionCode.slice(0, regionCode.indexOf('/* =========== the reading')), c);
vm.runInContext('function v45Maps(){return FIELD_ATLAS.maps;} function v45Map(id){return v45Maps().filter(function(m){return m.id===id;})[0]||null;} function v45CountryMaps(key){return v45Maps().filter(function(m){return m.type==="country"&&m.countryKey===key;});}', c);
load('js/atlas-context.js');
const source = fs.readFileSync(path.join(root, 'js/atlas-context.js'), 'utf8');
assert.ok(!source.includes('=>'), 'runtime uses classic functions');
let checks = 0;
function check(name, pass) { assert.ok(pass, name); checks++; console.log('PASS ' + name); }
function ids(targets) { return Array.from(targets, t => t.view + '/' + t.arg); }
function targets(q) { return ids(c.v52QuestionTargets(q)); }
function has(q, target) { return targets(q).includes(target); }
function mc(q, correct, distractors = [], exp = '', cat = '') { return { id:'fixture', q, opts:[correct].concat(distractors), a:0, exp, cat }; }
function valid(t) { return t.view === 'fieldmap' ? !!c.v45Map(t.arg) : t.view === 'worldmap' && c.MAP_SHEETS.some(s => s.id === t.arg); }
check('Champagne bottle opens the detailed Champagne map', ids(c.v52WineTargets({region:'Champagne, France'})).join() === 'fieldmap/champagne');
check('specific Beaujolais takes precedence over surrounding Burgundy', ids(c.v52WineTargets({region:'Fleurie, Beaujolais, Burgundy, France'})).join() === 'fieldmap/beaujolais');
check('a country-only wine has an honest overview', ids(c.v52WineTargets({region:'France'})).join() === 'worldmap/france');
check('country map without overview sheet uses its actual ID', ids(c.v52WineTargets({region:'England'})).join() === 'fieldmap/country-uk');
check('Georgia country origin selects one country map', ids(c.v52WineTargets({region:'Kakheti, Georgia'})).join() === 'fieldmap/country-georgia');
check('US Georgia cannot become the Caucasus', c.v52WineTargets({region:'Georgia, USA'}).length === 0);
check('unknown custom region cannot reverse-contain an alias', c.v52WineTargets({region:'Unknown vineyard'}).length === 0);
check('grape-only origin cannot be converted to its famous region', c.v52WineTargets({region:'Aligoté'}).length === 0);
check('grape plus recorded country stays at country scope', ids(c.v52WineTargets({region:'Aligoté, France'})).join() === 'worldmap/france');
check('nearby chapter is not falsely claimed as the mapped origin', ids(c.v52WineTargets({region:'Adelaide Hills, Australia'})).join() === 'worldmap/australia');
check('house wine name, producer and grape never override its recorded region', ids(c.v52WineTargets({name:'Bordeaux discovery',producer:'Tuscany estate',grapes:['Aligoté'],region:'Loire, France'})).join() === 'fieldmap/loire');
check('empty wine origin remains unresolved even with place words in its name', c.v52WineTargets({name:'Bordeaux wine',producer:'Burgundy',region:''}).length === 0);
check('course correct answer links the named appellation', has(mc('Which place is this?', 'Chablis', ['Rioja','Napa','Marlborough']), 'fieldmap/burgundy'));
check('all incorrect choices are excluded', targets(mc('Which place is this?', 'Chablis', ['Rioja','Napa','Marlborough'])).join() === 'fieldmap/burgundy');
check('short-answer answer text resolves without options', has({id:'fixture', q:'Name this appellation.',sa:1,ans:'Chianti Classico',accept:['Bordeaux'],exp:''},'fieldmap/tuscany'));
check('accepted alternative strings are not mined as topic context', !has({id:'fixture',q:'Name this appellation.',sa:1,ans:'Chianti Classico',accept:['Bordeaux'],exp:''},'fieldmap/bordeaux'));
check('explanation supports more than one discussed region', has(mc('Compare these.', 'Chablis', [], 'Sancerre provides the comparison.'),'fieldmap/loire'));
check('Aligoté grape alone cannot imply Burgundy', targets(mc('Name this grape.', 'Aligoté')).length === 0);
check('ordinary port cannot imply Douro', targets(mc('Where is the customs office?', 'At the port')).length === 0);
check('Port in fortified-wine context links Douro', targets(mc('How does Vintage Port age?', 'In bottle', [], '', 'Fortified Wines')).join() === 'fieldmap/douro');
check('Sherry links its geographic training map', targets(mc('What is this Sherry style?', 'Amontillado')).join() === 'fieldmap/jerez');
check('Greek Cava ageing term cannot link Spain', !has(mc('Greek regional labels may say Cava.', 'An ageing term', [], '', 'Hungary & Greece'),'worldmap/spain'));
check('burgundy colour cannot imply Burgundy geography', targets(mc('What is the cloth colour?', 'Burgundy colour')).length === 0);
check('Georgia country name alone remains ambiguous', targets(mc('Where was the guest born?', 'Georgia')).length === 0);
check('Georgia with Caucasian wine context resolves', has(mc('Which country uses qvevri?', 'Georgia'),'fieldmap/country-georgia'));
check('George Washington cannot imply the wine state', targets(mc('Who was the president?', 'George Washington')).length === 0);
check('La Rioja Argentina does not open the Spanish map', targets(mc('Name the region.', 'La Rioja, Argentina')).join() === 'fieldmap/la-rioja');
check('La Rioja Spain does not open the Argentine map', targets(mc('Name the region.', 'La Rioja, Spain')).join() === 'fieldmap/rioja');
check('La Rioja without country remains ambiguous', targets(mc('Name the region.', 'La Rioja')).length === 0);
check('course category is a conservative fallback', targets(mc('What is the principal grape?', 'Chardonnay', [], '', 'Burgundy')).join() === 'fieldmap/burgundy');
check('select-all maps only correct answer indices', targets({id:'fixture',q:'Select the appellations discussed.',sa:1,sel:1,opts:['Chablis','Rioja','Chianti','Napa'],ans:[0,2],exp:''}).sort().join() === 'fieldmap/burgundy,fieldmap/tuscany');
check('matching question uses its authored answer', has({id:'fixture',q:'Match each place.',mt:1,sa:1,pairs:[['A','B']],ans:'Chablis: Burgundy',exp:''},'fieldmap/burgundy'));
check('Cachapoal is covered by the existing Rapel map', targets(mc('Which valley?', 'Cachapoal')).join() === 'fieldmap/colchagua');
check('Leyda does not imply containment in Casablanca', targets(mc('Which valley?', 'Leyda')).join() === 'worldmap/chile');
check('country category does not invent a specific region', targets(mc('What is the national classification?', 'DOCG', [], '', 'Italy North')).join() === 'worldmap/italy');
const rq = c.REGIONS.regions.find(r => r.slug === 'tuscany').questions[0];
check('exact regional owner survives an otherwise generic question', has({id:rq.id,q:'Recall the point.',opts:['The answer'],a:0,exp:''},'fieldmap/tuscany'));
const qw = house.wines[0], pairDish = house.dishes.find(d => d.pairing && d.pairing.by === 'person' && d.pairing.value.wineId);
check('house question uses its exact item identity', targets({id:'h-'+qw.id+'-serve',q:'Service?',opts:['A'],a:0}).join() === ids(c.v52WineTargets(qw)).join());
check('deal-time item and kind use the exact paired wine', targets({_v52itemId:pairDish.id,_v52kind:'firstPickFor',q:'Choose a wine',opts:['A'],a:0}).join() === ids(c.v52WineTargets(house.wines.find(w=>w.id===pairDish.pairing.value.wineId))).join());
check('zero-proof quiz never borrows a wine origin', c.v52QuestionTargets({_v52itemId:pairDish.id,_v52kind:'zeroProofFor'}).length === 0);
c.v38RowById = () => ({where:'Bordeaux, France',wines:[{id:qw.id}]});
check('producer quiz uses linked bottlings rather than headquarters', targets({_v52itemId:'c-12345678',_v52kind:'producerWhere'}).join() === ids(c.v52WineTargets(qw)).join());
c.V29_LIST = {places:{unknown:{title:'No region printed'},chablis:{title:'Chablis'}},producers:{x:{region:'Bordeaux',country:'France'}}};
check('printed card uses exact developed wine', ids(c.v52ListTargets({card:qw.id,place:'Bordeaux',section:'France'})).join() === ids(c.v52WineTargets(qw)).join());
check('printed place uses its own title', ids(c.v52ListTargets({pk:'x',place:'chablis',section:'France'})).join() === 'fieldmap/burgundy');
check('printed row never substitutes producer headquarters', c.v52ListTargets({pk:'x',place:'unknown',section:'White wines'}).length === 0);
c.V29_LIST.places.sparkling = {title:'Sparkling beyond Champagne'};
check('comparative printed heading cannot imply Champagne origin', c.v52ListTargets({place:'sparkling',section:'International ~ Sparkling'}).length === 0);
check('printed hierarchy keeps the narrowest region', ids(c.v52ListTargets({place:'France ~ Burgundy ~ Red ~ Beaujolais',section:'France ~ Burgundy ~ Red'})).join() === 'fieldmap/beaujolais');
check('plain text strips markup before decoding for a safely escaped sink', c.v52PlainText('A<br><b>Rh&ocirc;ne</b> &amp; wine').includes('& wine'));
const banks = {intro:c.INTRO_QUESTIONS,certified:c.QUESTIONS,advanced:c.ADV_QUESTIONS,master:c.MASTER_QUESTIONS};
const before = JSON.stringify(banks), report = {wine:{total:house.wines.length,linked:0,unresolved:[]},banks:{},regional:{total:0,linked:0},country:{total:0,linked:0},limits:['No geographic claim is inferred from grape alone, a producer headquarters, a distractor, or an unqualified ambiguous place.','An unmapped region opens a labelled country overview where curated geography establishes its location.','General process, service and business questions can legitimately have no place link.']};
for(const w of house.wines){const ts=c.v52WineTargets(w);if(ts.length)report.wine.linked++;else report.wine.unresolved.push({id:w.id,name:w.name,region:w.region});ts.forEach(t=>assert.ok(valid(t),'wine target '+JSON.stringify(t)));}
for(const [key,qs] of Object.entries(banks)){const unlinked=[];let linked=0;for(const q of qs){const ts=c.v52QuestionTargets(q);if(ts.length)linked++;else unlinked.push({id:q.id,cat:q.cat,q:q.q});ts.forEach(t=>assert.ok(valid(t),'course target '+JSON.stringify(t)));}report.banks[key]={total:qs.length,linked,unlinked:unlinked.length,unlinkedByCategory:Object.fromEntries([...new Set(unlinked.map(q=>q.cat))].map(cat=>[cat,unlinked.filter(q=>q.cat===cat).length]))};}
for(const [family,rows] of [['regional',c.REGIONS.regions],['country',Object.values(c.REGIONS.countries)]])for(const r of rows)for(const q of r.questions||[]){report[family].total++;const ts=c.v52QuestionTargets(q);if(ts.length)report[family].linked++;ts.forEach(t=>assert.ok(valid(t),'owned target '+JSON.stringify(t)));}
check('all 271 canonical Brennan wines resolve', report.wine.linked === report.wine.total && report.wine.total === 271);
check('every regional and country-owned question resolves', report.regional.total===report.regional.linked && report.country.total===report.country.linked);
check('course questions and all existing identities are unchanged', JSON.stringify(banks) === before);
console.log(JSON.stringify(report,null,2));
if(process.env.CODEX_REPORT)fs.writeFileSync(process.env.CODEX_REPORT,JSON.stringify({checks,...report},null,2)+'\n');
console.log('PASS '+checks+' atlas context checks');
