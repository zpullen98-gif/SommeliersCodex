'use strict';
/* Build a small, attributable gazetteer subset for the regional reading guides.
   Usage: node .scripts/atlas-regions/prepare-lesson-places.cjs <external-cache-directory>
   Downloaded data stays outside the repository. The committed subset is sufficient
   for the map build; re-fetching GeoNames is an explicit preparation step. */
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto'),zlib=require('zlib');
const root=path.resolve(__dirname,'../..');
const windows=require('./windows.cjs'),catalog=require('../atlas-v3/catalog.cjs');
const overrides=require('./lesson-place-overrides.cjs');
const expectedZip='2b80cc4a7d9a7c784ba4892f7fdc1900ffff73ab9780bc064ffe5c539a6fabac';
const countryArchives=['FR','DE','IT','ES','PT','AT','AU','NZ','HU','GR','ZA'];
const archiveHashes={
 FR:'fe680cf3ddb855b336dbd431f6632eaaa8a6f45cc85200a3adf7943b138fd379',
 DE:'c18dbe1ae5b0206280234af9e021b210bac72128334ec32398270206c6508b9f',
 IT:'35b3bd2606e57519658b719f7b8a9669fbdabedb4ff790babe693f673e9b5392',
 ES:'7a2d513c28adfe8f8e58ddbac2690a17572dbd27c6784267fecb7802b63bd363',
 PT:'4836cf3da587f9254f74b274e502fccabba7b7323cb8182d60d3243eaed42f9c',
 AT:'27c0f6a6e0c44fc397ab3c4dabb8a760d8829b8160196797ab72cb46ab42b42d',
 AU:'df6a8abcbed675bed496b4586a8b9876d0e8918b6d1fc952c269752296251ec4',
 NZ:'eee7824c1d349b752e97e49cbb39c23891c98dac9bf87fce868bc6f5ed258d3c',
 HU:'92a6d92c6947131c85b041a3a061ec33edf799abb2421bfa03452522999f1474',
 GR:'8b93dfac1a39d8a23a5eab650ac1d06ba1b90d8c5865dbd14c03b6c91e0f3bde',
 ZA:'258b103300e5db8aaaa4b24fa3ce2e2129cd842cf3ec36d1ca576702b66254f6'
};
const countryCodes={FRA:'FR',ITA:'IT',ESP:'ES',PRT:'PT',DEU:'DE',AUT:'AT',ARG:'AR',CHL:'CL',AUS:'AU',NZL:'NZ',ZAF:'ZA',HUN:'HU',GRC:'GR','US-CA':'US','US-OR':'US','US-WA':'US','US-NY':'US'};
const norm=s=>String(s).normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/ß/g,'ss').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const inBounds=(p,b)=>p.lon>=b[0]&&p.lon<=b[2]&&p.lat>=b[1]&&p.lat<=b[3];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const distance=(a,b)=>Math.hypot((a.lon-b.lon)*Math.cos(a.lat*Math.PI/180),a.lat-b.lat);
function unzip(buffer,name){
 let end=buffer.length-22;while(end>=Math.max(0,buffer.length-65558)&&buffer.readUInt32LE(end)!==0x06054b50)end--;
 if(end<0)throw Error('ZIP directory missing');
 let at=buffer.readUInt32LE(end+16);
 for(let i=0;i<buffer.readUInt16LE(end+10);i++){
  if(buffer.readUInt32LE(at)!==0x02014b50)throw Error('Invalid ZIP directory');
  const n=buffer.readUInt16LE(at+28),extra=buffer.readUInt16LE(at+30),comment=buffer.readUInt16LE(at+32);
  if(buffer.toString('utf8',at+46,at+46+n)===name){
   const off=buffer.readUInt32LE(at+42),start=off+30+buffer.readUInt16LE(off+26)+buffer.readUInt16LE(off+28);
   const content=buffer.subarray(start,start+buffer.readUInt32LE(at+20));
   const method=buffer.readUInt16LE(at+10);
   if(method!==0&&method!==8)throw Error('Unsupported ZIP method');
   return method===8?zlib.inflateRawSync(content):content;
  }at+=46+n+extra+comment;
 }throw Error('Missing ZIP member '+name);
}
function candidates(name){
 const out=[name,name.replace(/\s*\([^)]*\)/g,'')];
 for(const m of name.matchAll(/\(([^)]+)\)/g))out.push(m[1]);
 for(const s of [...out])for(const part of s.split(/\s+and\s+|\s+e\s+|,\s*|\s*\/\s*/))out.push(part);
 return [...new Set(out.map(norm).filter(n=>n.length>=3))];
}
function flatten(places,parent='',depth=0){
 return (places||[]).flatMap(p=>[{...p,parent,treeDepth:depth},...flatten(p.places,p.name,depth+1)]);
}
function selectSpread(points,limit,bounds,preferred=[]){
 if(points.length<=limit)return points;
 // Begin with the earliest course example, then span the district rather than
 // exhausting one dense northern cluster before a southern district is shown.
 const desired=preferred.map(name=>points.find(p=>norm(p.name)===norm(name))).filter(Boolean);
 const required=[...desired,...points.filter(p=>p.reviewedMatch&&!desired.includes(p))];
 const selected=required.length?required.slice(0,limit):[points[0]],remaining=points.filter(p=>!selected.includes(p));
 while(selected.length<limit&&remaining.length){
  let best=0,bestScore=-Infinity;
  remaining.forEach((p,i)=>{
   const score=Math.min(...selected.map(s=>distance(s,p)))+(p.priority||0)*Math.min(bounds[2]-bounds[0],bounds[3]-bounds[1])*.015;
   if(score>bestScore){best=i;bestScore=score;}
  });
  selected.push(remaining.splice(best,1)[0]);
 }
 return selected.sort((a,b)=>a.order-b.order);
}
async function main(){
 const cache=process.argv[2];if(!cache)throw Error('Pass an external cache directory');
 fs.mkdirSync(cache,{recursive:true});
 const zipPath=path.join(cache,'cities500.zip'),url='https://download.geonames.org/export/dump/cities500.zip';
 if(!fs.existsSync(zipPath)){const response=await fetch(url);if(!response.ok)throw Error('Download failed '+response.status);fs.writeFileSync(zipPath,Buffer.from(await response.arrayBuffer()));}
 const zip=fs.readFileSync(zipPath),zipHash=hash(zip);
 if(zipHash!==expectedZip)throw Error('GeoNames snapshot changed. Review its date and contents before updating the pinned preparation hash.');
 const content=unzip(zip,'cities500.txt'),towns=[],townIds=new Set(),extraProvenance=[];
 function ingest(buffer,archive){
  for(const line of buffer.toString('utf8').split(/\r?\n/)){
   const a=line.split('\t');if(a.length<19||a[6]!=='P'||/^(PPLQ|PPLH|PPLW)$/.test(a[7])||townIds.has(+a[0]))continue;
   townIds.add(+a[0]);
   towns.push({id:+a[0],name:a[1],ascii:a[2],aliases:a[3].split(','),lat:+a[4],lon:+a[5],country:a[8],admin1:a[10],population:+a[14],modified:a[18],archive,featureCode:a[7]});
  }
 }
 ingest(content,'cities500');
 for(const code of countryArchives){
  const extraPath=path.join(cache,code+'.zip');
  if(!fs.existsSync(extraPath))throw Error('Download the reviewed '+code+'.zip into the external cache before preparation.');
  const extraZip=fs.readFileSync(extraPath),extra=unzip(extraZip,code+'.txt');
  if(hash(extraZip)!==archiveHashes[code])throw Error('GeoNames country snapshot changed: '+code+'. Review before repinning.');
  extraProvenance.push({country:code,url:'https://download.geonames.org/export/dump/'+code+'.zip',zipSha256:hash(extraZip),textSha256:hash(extra),zipBytes:extraZip.length,textBytes:extra.length});
  ingest(extra,code);
 }
 const ctx={};vm.runInNewContext(fs.readFileSync(path.join(root,'js/data-regions.js'),'utf8'),ctx);
 const output={version:1,reviewed:'2026-10-20',attribution:'Settlement coordinates from GeoNames, licensed under Creative Commons Attribution 4.0. Names and positions are adapted into a selected teaching gazetteer; no appellation boundaries are implied.',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',sourceUrl:'https://www.geonames.org/',regions:{}};
 const diagnostics=[];
 for(const r of ctx.REGIONS.regions){
  const source=JSON.parse(fs.readFileSync(path.join(root,'js/regions',r.sheet+'.json'),'utf8')).records[r.slug];
  const b=windows[r.slug],iso=countryCodes[catalog.sheets[r.sheet]._layout.geo];
  if(!iso)throw Error('Country missing '+r.sheet);
  const excludedIds=overrides.excludedIds?.[r.slug]||[];
  const local=towns.filter(t=>t.country===iso&&inBounds(t,b)&&!excludedIds.includes(t.id)),allPlaces=flatten(source.places),matches=[],unmatched=[],ambiguous=[];
  const lookup=new Map();
  for(const t of local)for(const n of new Set([t.name,t.ascii,...t.aliases].map(norm).filter(n=>n.length>=3))){
   if(!lookup.has(n))lookup.set(n,[]);lookup.get(n).push(t);
  }
  let order=0;
  function add(t,p,method,reviewedMatch=false){
   if(matches.some(x=>x.geonameId===t.id)){
    if(reviewedMatch)matches.find(x=>x.geonameId===t.id).reviewedMatch=true;
    return;
   }
   matches.push({name:t.name,lon:t.lon,lat:t.lat,kind:'lesson town',geonameId:t.id,sourceUrl:'https://www.geonames.org/'+t.id+'/',
    lessonName:p.name,lessonParent:p.parent,match:method,note:'Town or settlement centre associated with “'+p.name+'” in the regional guide. The dot locates the settlement, not an appellation boundary or an individual vineyard.',
    lessonNote:p.note,order:order++,priority:p.depth==='advanced'?0:1,...(reviewedMatch?{reviewedMatch:true}:{})});
  }
  for(const p of allPlaces){
   if((overrides.omit[r.slug]||[]).includes(p.name)){unmatched.push(p.name);continue;}
   let found=false;
   for(const n of candidates(p.name)){
    let a=(lookup.get(n)||[]).filter((t,i,x)=>x.findIndex(y=>y.id===t.id)===i);
    const direct=a.filter(t=>norm(t.name)===n||norm(t.ascii)===n);
    if(direct.length)a=direct;
    if(a.length===1){add(a[0],p,'exact normalized lesson heading');found=true;}
    else if(a.length>1)ambiguous.push({lesson:p.name,candidate:n,ids:a.map(t=>t.id)});
   }
   if(!found)unmatched.push(p.name);
  }
  for(const pick of overrides.pick[r.slug]||[]){
   const t=local.find(t=>t.id===pick.id),p=allPlaces.find(p=>p.name===pick.lesson);
   if(!t)throw Error('Reviewed settlement absent from country/window '+r.slug+' / '+pick.id);
   if(!p)throw Error('Reviewed lesson no longer exists '+r.slug+' / '+pick.lesson);
   add(t,p,'reviewed settlement centre associated with lesson',true);
  }
  // Do not mine prose automatically: vineyard/grape names can be homonyms of
  // unrelated settlements (for example Brunate and Marsanne).
  const study=selectSpread(matches,10,b,overrides.preferred[r.slug]||[]).map(({priority,order,...p})=>p);
  const context=[];
  const centres=study.length?study:catalog.sheets[r.sheet].regions[r.index].anchors;
  const eligible=local.filter(t=>!study.some(s=>s.geonameId===t.id)).sort((a,b)=>{
   const da=Math.min(...centres.map(p=>distance(p,a))),db=Math.min(...centres.map(p=>distance(p,b)));
   return da-db||b.population-a.population;
  });
  // Sparse small-town districts get extra context, explicitly styled as context.
  const count=study.length<3?Math.min(5,7-study.length):2;
  const sep=Math.min(b[2]-b[0],b[3]-b[1])*.045;
  for(const t of eligible){
   if(context.length>=count)break;
   if([...study,...context].some(s=>distance(s,t)<sep))continue;
   context.push({name:t.name,lon:t.lon,lat:t.lat,kind:'town / city context',geonameId:t.id,sourceUrl:'https://www.geonames.org/'+t.id+'/',note:'Nearby settlement for geographic orientation. Inclusion does not assert that it is a vineyard or a recognised wine appellation.'});
  }
  output.regions[r.slug]={study,context,unmatched};
  diagnostics.push({id:r.slug,matched:matches.length,selected:study.map(s=>s.name),allMatches:matches.map(p=>({name:p.name,id:p.geonameId,lesson:p.lessonName,lon:p.lon,lat:p.lat})),context:context.map(s=>s.name),unmatched,ambiguous});
 }
 const outputText=JSON.stringify(output,null,2)+'\n';
 fs.writeFileSync(path.join(__dirname,'lesson-places.json'),outputText);
  const provenance={reviewed:'2026-10-20',source:'GeoNames',dataset:'cities500 plus selected country extracts',description:'Populated-place records from the cities500 set and small settlements from country extracts.',license:'Creative Commons Attribution 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',documentation:'https://download.geonames.org/export/dump/',downloadUrl:url,downloaded:'2026-10-20',zipSha256:zipHash,textSha256:hash(content),zipBytes:zip.length,textBytes:content.length,extraSources:extraProvenance,subsetSha256:hash(Buffer.from(outputText)),selection:'Exact normalized lesson-heading matches; conservative compound-heading splits; reviewed GeoNames IDs in lesson-place-overrides.cjs; all same ISO country and within the authored map window. Ambiguous matches omitted unless specifically reviewed. Nearby context is labelled separately. Selection spread over up to ten lesson towns, with selected regional teaching priorities. Prose is not automatically mined for settlement names.',scope:'Settlement points, never legal appellation outlines or exact vineyard parcels.',rawDataStoredOutsideRepository:true};
 fs.writeFileSync(path.join(__dirname,'lesson-places-provenance.json'),JSON.stringify(provenance,null,2)+'\n');
 fs.writeFileSync(path.join(cache,'lesson-matching-report.json'),JSON.stringify(diagnostics,null,2)+'\n');
 console.log(JSON.stringify({regions:diagnostics.length,study:diagnostics.reduce((s,r)=>s+r.selected.length,0),context:diagnostics.reduce((s,r)=>s+r.context.length,0),sparse:diagnostics.filter(r=>r.selected.length<3).map(r=>({id:r.id,study:r.selected,context:r.context})),ambiguous:diagnostics.filter(r=>r.ambiguous.length).map(r=>({id:r.id,ambiguous:r.ambiguous}))},null,2));
}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={unzip,norm};
