'use strict';
/* Deterministic supplemental maps. Viewing windows and dots are study aids,
   never legal appellation polygons. Run after .scripts/regions/build-regions.cjs. */
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const root=path.resolve(__dirname,'../..');
const D=require('./drawing.cjs'), windows=require('./windows.cjs');
const catalog=require('../atlas-v3/catalog.cjs'), countries=require('./countries.cjs').countries;
const ctx={};vm.runInNewContext(fs.readFileSync(path.join(root,'js/data-regions.js'),'utf8'),ctx);
// Roster articles without a numbered overview-map location remain reading only.
// They need reviewed map windows and geography before joining this collection.
const regions=ctx.REGIONS.regions.filter(r=>r.mapless!==1), featured={};
const lessonPlaces=fs.existsSync(path.join(__dirname,'lesson-places.json'))?require('./lesson-places.json'):{};
for(const id of ['champagne','tuscany'])if(fs.existsSync(path.join(__dirname,id+'.cjs')))featured[id]=require('./'+id+'.cjs');
const {esc,num,extent,intersects,pointInside,frame,compass,baseMap,wrap,markerLayout,geography}=D;
const sourcesGeo=[{title:'Natural Earth: public-domain geographic data',url:'https://www.naturalearthdata.com/about/terms-of-use/'}];
const scope='Orientation map with representative study locations and selected rivers and towns. Country and state outlines are geographic context, not appellation boundaries. No vineyard parcels or elevation model are implied.';
function cleanPlaces(places){return places.map(a=>({name:a.name||a.label,lon:a.lon,lat:a.lat,kind:a.kind||'study location',...(a.note?{note:a.note}:{}),...(a.sourceUrl?{sourceUrl:a.sourceUrl}:{})}));}
function notesFor(c){const n={};for(const key of ['terroir','grapes','growing','cellar','service','compare'])if(c[key])n[key]=Array.isArray(c[key])?c[key]:[c[key]];if(c.overview)n.overview=c.overview;return n;}
const maps=regions.map(r=>{
 const sheet=catalog.sheets[r.sheet], entry=sheet&&Number.isInteger(r.index)&&r.index>=0?sheet.regions[r.index]:null, f=featured[r.slug];
 if(!entry||entry.name!==r.name)throw Error('Join mismatch '+r.slug+' / '+(entry&&entry.name));
 if(!windows[r.slug])throw Error('Missing window '+r.slug);
 const full=JSON.parse(fs.readFileSync(path.join(root,'js/regions',r.sheet+'.json'),'utf8')).records[r.slug];
 return {id:r.slug,title:r.name,type:'region',countryKey:r.sheet,sheet:r.sheet,slug:r.slug,geo:sheet._layout.geo,
  bounds:[...(f&&f.mapBounds||windows[r.slug])],scope,summary:f?f.overview:entry.note,
  places:cleanPlaces(f?f.places:entry.anchors),sources:[...(f?f.sources:full.sources.filter(s=>s.url)),...sheet.sources,...sourcesGeo],
  ...(f?{notes:notesFor(f)}:{}),grapes:r.grapes.map(g=>g.name),_extras:sheet.extraAnchors};
});
for(const c of countries)maps.push({...c,countryKey:c.id==='country-georgia'&&ctx.REGIONS.countries.georgia?'georgia':c.countryKey,type:'country',bounds:[...c.bounds],places:cleanPlaces(c.anchors),notes:notesFor(c),sources:[...c.sources,...sourcesGeo],_extras:[]});
if(regions.length!==115||countries.length!==14||Object.keys(windows).length!==115)throw Error('Coverage changed; review expected counts');
function distance(a,b){return Math.hypot((a.lon-b.lon)*Math.cos(a.lat*Math.PI/180),a.lat-b.lat);}
function waterPoints(g){
 const visit=c=>typeof c[0]==='number'?[c]:c.flatMap(visit);
 return visit(g.coordinates);
}
// Prioritise the rivers used to orient these lessons. Names still join the
// geographic source exactly; this adds no invented course or water geometry.
const priorityWater={
 champagne:['Marne','Aube','Seine'],tuscany:['Arno','Tiber'],
 bordeaux:['Garonne','Dordogne'],burgundy:['Saône','Yonne'],
 loire:['Loire','Cher','Vienne'],rhone:['Rhône','Durance'],
 douro:['Duero'],mosel:['Mosel','Saar','Sauer'],
 rheingau:['Rhine','Main'],rheinhessen:['Rhine'],
 piedmont:['Tanaro','Po','Dora Baltea'],rioja:['Ebro'],
 mendoza:['Mendoza']
};
function addContext(m){
 // Expand authored window only enough to retain original reviewed teaching dots.
 const b=m.bounds,pad=Math.min(b[2]-b[0],b[3]-b[1])*.04;
 for(const a of m.places){b[0]=Math.min(b[0],a.lon-pad);b[1]=Math.min(b[1],a.lat-pad);b[2]=Math.max(b[2],a.lon+pad);b[3]=Math.max(b[3],a.lat+pad);}
 const minDistance=Math.max(b[2]-b[0],b[3]-b[1])*.035;
 const lessons=lessonPlaces.regions&&lessonPlaces.regions[m.id];
 const learned=lessons?lessons.study:[];
 for(const a of learned){if(m.places.length>=10)break;if(pointInside(a,b)&&m.places.every(p=>distance(p,a)>minDistance*.35))m.places.push(a);}
 if(learned.length)m.sources.push({title:'GeoNames gazetteer: town coordinates (CC BY 4.0)',url:'https://www.geonames.org/about.html'});
 const extra=[...(lessons?lessons.context:[]),...cleanPlaces(m._extras).filter(a=>pointInside(a,b)).map(a=>({...a,kind:'reference place'}))];
 const targetIso=m.geo.startsWith('US-')?'USA':m.geo;
 const towns=geography.places.filter(a=>pointInside(a,b)&&a.iso===targetIso).sort((a,b)=>(a.rank-b.rank)||b.population-a.population||a.name.localeCompare(b.name))
  .map(a=>({name:a.name,lon:a.lon,lat:a.lat,kind:'town / city context',note:'Geographic reference from Natural Earth; not a vineyard location.'}));
 for(const a of [...extra,...towns]){
  if(m.places.length>=12)break;
  if(m.places.every(p=>distance(p,a)>minDistance&&p.name.toLowerCase()!==a.name.toLowerCase()))m.places.push(a);
 }
 m.water=[...new Set(geography.water.filter(w=>intersects(extent(w.geometry),b)&&waterPoints(w.geometry).some(p=>pointInside({lon:p[0],lat:p[1]},b))).map(w=>w.name).filter(Boolean))].sort();
 delete m._extras;delete m.anchors;
}
function textBlock(text,x,y,size,max,color='#ead8b4'){
 return `<text x="${x}" y="${y}" fill="${color}" font-size="${size}">${wrap(text,max).map((t,i)=>`<tspan x="${x}" dy="${i?size*1.3:0}">${esc(t)}</tspan>`).join('')}</text>`;
}
function render(m){
 const box={x:153,y:298,w:894,h:600}, main=baseMap(m.geo,m.bounds,box,'main');
 let body=frame()+`<text x="600" y="118" text-anchor="middle" fill="#e3bb72" font-size="17" letter-spacing="5">THE EXPLORER'S FIELD ATLAS</text>`;
 const titleSize=m.title.length>33?31:m.title.length>23?37:m.title.length>16?46:58;
 body+=`<text x="600" y="183" text-anchor="middle" fill="#f5e4bd" font-size="${titleSize}">${esc(m.title)}</text><text x="600" y="223" text-anchor="middle" fill="#d4bc87" font-size="17" letter-spacing="2">${m.type==='region'?'REGIONAL STUDY':'COUNTRY STUDY'} · ${esc(geography.features[m.geo].name)}</text>`;
 body+='<rect x="124" y="266" width="952" height="678" fill="url(#sea)" stroke="#c6a564"/>'+main.str;
 const markers=m.places.map((a,i)=>({...a,label:a.name,key:String(i+1),extra:a.kind==='town / city context'||a.kind==='reference place',p:main.p([a.lon,a.lat])}));
 body+=markerLayout(markers,box);
 // Label only water with actual coordinates inside this view. Never infer a
 // river location from a feature's bounding rectangle.
 const used=[],priority=priorityWater[m.id]||[];
 const water=geography.water.filter(w=>m.water.includes(w.name)).sort((a,b)=>{
  const rank=n=>priority.includes(n)?priority.indexOf(n):priority.length;
  return rank(a.name)-rank(b.name);
 });
 for(const w of water){
  if(used.length>=5||used.some(u=>u.name===w.name))continue;
  const pts=waterPoints(w.geometry).filter(p=>pointInside({lon:p[0],lat:p[1]},main.bounds));
  if(!pts.length)continue;
  const name=w.name==='Duero'&&m.geo==='PRT'?'Douro':w.name,width=name.length*8+12;
  let label;
  for(const fraction of [.5,.35,.65,.2,.8,.1,.9]){
   const p=main.p(pts[Math.min(pts.length-1,Math.floor(pts.length*fraction))]);
   for(const dy of [-10,21]){
    const x=p[0],y=p[1]+dy;
    if(x<box.x+width/2+5||x>box.x+box.w-width/2-5||y<box.y+19||y>box.y+box.h-10)continue;
    if(markers.some(a=>(Math.abs(a.x-x)<width/2+22&&Math.abs(a.y-y)<25)||(Math.abs(a.p[0]-x)<width/2+7&&Math.abs(a.p[1]-y)<17))||used.some(a=>Math.abs(a.x-x)<(a.width+width)/2+5&&Math.abs(a.y-y)<25))continue;
    label={name:w.name,x,y,width};break;
   }
   if(label)break;
  }
  if(!label)continue;
  used.push(label);
  body+=`<text x="${num(label.x)}" y="${num(label.y)}" text-anchor="middle" fill="#164544" stroke="#e7d5a4" stroke-width="3" paint-order="stroke" font-size="16" font-style="italic">${esc(name)}</text>`;
 }
 // Coordinate labels remain outside the geography, with north stated explicitly.
 body+=`<text x="153" y="925" fill="#d5c9a8" font-size="13">${num(main.bounds[0])}° to ${num(main.bounds[2])}° longitude · ${num(main.bounds[1])}° to ${num(main.bounds[3])}° latitude</text><text x="1047" y="925" text-anchor="end" fill="#ead19b" font-size="14">NORTH IS UP</text>`;
 body+='<rect x="124" y="965" width="952" height="290" fill="#071d16" fill-opacity=".97" stroke="#ac8547"/><text x="600" y="997" text-anchor="middle" fill="#e7c788" font-size="18" letter-spacing="3">PLACES TO LOCATE</text>';
 const rows=6;
 m.places.forEach((a,i)=>{
  const col=Math.floor(i/rows),row=i%rows,x=154+col*465,y=1037+row*31;
  body+=`<circle cx="${x}" cy="${y-6}" r="11" fill="${markers[i].extra?'#183429':'#f3e9d5'}" stroke="#d5b16c"/><text x="${x}" y="${y}" text-anchor="middle" fill="${markers[i].extra?'#f3e9d5':'#17382a'}" font-size="15">${i+1}</text>`;
  body+=textBlock(a.name,x+23,y,a.name.length>40?14:18,48,'#f5e9ce');
 });
 body+='<text x="600" y="1234" text-anchor="middle" fill="#c7ba9f" font-size="13">Light markers: study locations · dark markers: geographic context · teal: water</text>';
 body+='<rect x="252" y="1273" width="696" height="139" rx="4" fill="#071b14" fill-opacity=".97" stroke="#ac8547"/>';
 body+=textBlock('Follow the land. Compare the wines.',290,1305,21,52,'#eed8aa');
 body+=textBlock('Open this map in the Codex for terroir, grapes, growing, cellar choices and service. Dots locate places; they do not define a wine area.',290,1340,16,67);
 body+='<rect x="167" y="1448" width="866" height="30" rx="3" fill="#071b14" fill-opacity=".95"/><text x="600" y="1468" text-anchor="middle" fill="#ead8b4" font-size="13">Natural Earth · GeoNames CC BY 4.0 · representative locations · no appellation boundaries</text>';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500" role="img" aria-labelledby="title desc"><title id="title">${esc(m.title)} study map</title><desc id="desc">${esc(m.scope+' '+m.places.map((a,i)=>(i+1)+': '+a.name).join('; '))}</desc><defs><linearGradient id="sea" x2=".9" y2="1"><stop stop-color="#16413b"/><stop offset="1" stop-color="#081f1e"/></linearGradient><linearGradient id="land" x2=".8" y2="1"><stop stop-color="#e7d5a4"/><stop offset=".5" stop-color="#c9b981"/><stop offset="1" stop-color="#af9d69"/></linearGradient><pattern id="print-grain" width="23" height="19" patternUnits="userSpaceOnUse"><path d="M2 4h2m7 3h1m8 6h2M5 16h1M15 2h2" stroke="#f8edce" stroke-width=".6"/></pattern></defs><g font-family="Georgia, 'Times New Roman', serif">${body}</g></svg>\n`;
}
fs.mkdirSync(path.join(root,'maps/regions-v1'),{recursive:true});
const rendered=[];
for(const m of maps){
 addContext(m);m.file='maps/regions-v1/'+m.id+'.svg';
 const svg=render(m);
 if(/(?:NaN|Infinity)/.test(svg.replace(/data:image[^\"']+/g,'')))throw Error('Invalid geometry '+m.id);
 rendered.push({file:m.file,svg});
 m.bytes=Buffer.byteLength(svg);m.sha256=crypto.createHash('sha256').update(svg).digest('hex');
 delete m.geo;delete m.terroir;delete m.growing;delete m.cellar;delete m.service;delete m.compare;
 console.log(m.id,m.places.length,m.bytes);
}
// Validate every drawing before replacing any output in the working collection.
for(const output of rendered)fs.writeFileSync(path.join(root,output.file),output.svg);
fs.writeFileSync(path.join(root,'js/data-field-atlas.js'),'/* Generated by .scripts/atlas-regions/build.cjs. */\nvar FIELD_ATLAS = '+JSON.stringify({version:'1',reviewed:'2026-10-20',maps},null,2)+';\n');
console.log('Complete:',maps.length,'maps;',Math.round(maps.reduce((n,m)=>n+m.bytes,0)/1024/1024)+' MiB');
