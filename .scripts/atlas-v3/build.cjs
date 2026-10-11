/* Deterministic, offline Explorer Atlas generator. No raster map or invented terrain.
   Run from any directory: node .scripts/atlas-v3/build.cjs [--mirror <codex-root>]
   Authored representative coordinates are in catalog.cjs; source outlines are
   public-domain Natural Earth data in geography.json. */
const fs = require('fs'), path = require('path');
const catalog = require('./catalog.cjs');
const geography = require('../atlas-v2/geography.json');
const root = path.resolve(__dirname,'../..');
const mirrorAt = process.argv.indexOf('--mirror');
const roots = [root,...(mirrorAt>=0?[path.resolve(process.argv[mirrorAt+1])]:[])];
const frameArt = fs.readFileSync(path.join(root,'assets/codex-atlas-frame-v3.webp')).toString('base64');
const esc = x => String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const num = v => Number(v.toFixed(2));
const pointInside = (a,b) => a.lon>=b[0]&&a.lon<=b[2]&&a.lat>=b[1]&&a.lat<=b[3];
function coordinates(geo) { return geo.type==='GeometryCollection'?geo.geometries.flatMap(coordinates):geo.coordinates; }
function extent(geo) {
  let e=[Infinity,Infinity,-Infinity,-Infinity];
  function visit(a) { if(typeof a[0]==='number'){e=[Math.min(e[0],a[0]),Math.min(e[1],a[1]),Math.max(e[2],a[0]),Math.max(e[3],a[1])];}else a.forEach(visit); }
  visit(coordinates(geo)); return e;
}
function intersects(a,b) {return a[0]<=b[2]&&a[2]>=b[0]&&a[1]<=b[3]&&a[3]>=b[1];}
function projection(bounds,box) {
  // Equirectangular with the sheet midpoint as standard parallel: angular
  // longitude is scaled by cos(latitude), preserving local proportions.
  const mid=(bounds[1]+bounds[3])/2, c=Math.cos(mid*Math.PI/180);
  const w=(bounds[2]-bounds[0])*c,h=bounds[3]-bounds[1];
  const scale=Math.min(box.w/w,box.h/h), ox=box.x+(box.w-w*scale)/2,oy=box.y+(box.h-h*scale)/2;
  const project = ([lon,lat]) => [num(ox+(lon-bounds[0])*c*scale),num(oy+(bounds[3]-lat)*scale)];
  // Letterboxing shows extra context. Record that actual visible extent so
  // graticules and the overview's gold rectangle describe the SAME window.
  project.bounds=[bounds[0]-(ox-box.x)/(c*scale),bounds[1]-(oy-box.y)/scale,bounds[2]+(ox-box.x)/(c*scale),bounds[3]+(oy-box.y)/scale];
  return project;
}
function simplify(points,tolerance=.32) {
  if(points.length<3)return points;
  const first=points[0],last=points[points.length-1],dx=last[0]-first[0],dy=last[1]-first[1],length=dx*dx+dy*dy;
  let furthest=-1, max=tolerance*tolerance;
  for(let i=1;i<points.length-1;i++){
   const p=points[i],t=length?Math.max(0,Math.min(1,((p[0]-first[0])*dx+(p[1]-first[1])*dy)/length)):0;
   const d=(p[0]-first[0]-t*dx)**2+(p[1]-first[1]-t*dy)**2;
   if(d>max){max=d;furthest=i;}
  }
  if(furthest<0)return[first,last];
  return [...simplify(points.slice(0,furthest+1),tolerance).slice(0,-1),...simplify(points.slice(furthest),tolerance)];
}
function geoPath(geometry,p) {
  const line = coords => {
   if(!intersects(extent({type:'LineString',coordinates:coords}),p.bounds))return '';
   return simplify(coords.map(p)).map((c,i)=>(i?'L':'M')+c.join(',')).join('');
  };
  switch(geometry.type) {
    case 'Polygon':return geometry.coordinates.map(a=>{const d=line(a);return d?d+'Z':'';}).join('');
    case 'MultiPolygon':return geometry.coordinates.flatMap(a=>a.map(b=>{const d=line(b);return d?d+'Z':'';})).join('');
    case 'LineString':return line(geometry.coordinates);
    case 'MultiLineString':return geometry.coordinates.map(line).join('');
    default:throw Error('Unsupported geometry '+geometry.type);
  }
}
function frame() {
  return `<rect width="1200" height="1500" fill="#071b14"/><image x="0" y="0" width="1200" height="1500" href="data:image/webp;base64,${frameArt}" aria-hidden="true"/>`;
}
function compass(x,y) {
 return `<g transform="translate(${x},${y})" stroke="#d5b16c" fill="none"><circle r="29" stroke-width=".7"/><circle r="23" stroke-width=".5"/><path d="M0-39L6-6L0 0L-6-6Z" fill="#d5b16c"/><path d="M0 39L6 6L0 0L-6 6ZM-39 0L-6-6L0 0L-6 6ZM39 0L6-6L0 0L6 6Z" stroke-width=".7"/><text y="-47" text-anchor="middle" stroke="none" fill="#ead19b" font-size="16">N</text></g>`;
}
function baseMap(key,bounds,box,clipId,{inset=false}={}) {
 const p=projection(bounds,box), e=extent(geography.features[key].geometry);
 bounds=p.bounds;
 let str=`<defs><clipPath id="${clipId}"><rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}"/></clipPath></defs><g clip-path="url(#${clipId})">`;
 // Neighbors are visible in lower contrast. Target fill is distinguished in the key.
 for(const [code,f] of Object.entries(geography.features)) {
   if(code===key||code.startsWith('US-')||!intersects(extent(f.geometry),bounds))continue;
   str+=`<path d="${geoPath(f.geometry,p)}" fill="#33483e" stroke="#849281" stroke-width=".7"/>`;
 }
 str+=`<path d="${geoPath(geography.features[key].geometry,p)}" fill="url(#land)" fill-rule="evenodd" stroke="#d5b16c" stroke-width="${inset?1:1.6}" stroke-linejoin="round"/>`;
 if(!inset)str+=`<path d="${geoPath(geography.features[key].geometry,p)}" fill="url(#print-grain)" fill-rule="evenodd" opacity=".18"/>`;
 const step=Math.max(bounds[2]-bounds[0],bounds[3]-bounds[1])>20?5:Math.max(bounds[2]-bounds[0],bounds[3]-bounds[1])>7?2:1;
 if(!inset) {
  for(let lon=Math.ceil(bounds[0]/step)*step;lon<bounds[2];lon+=step){const p1=p([lon,bounds[1]]),p2=p([lon,bounds[3]]);str+=`<path d="M${p1}L${p2}" stroke="#ead19b" stroke-width=".6" opacity=".16"/>`;}
  for(let lat=Math.ceil(bounds[1]/step)*step;lat<bounds[3];lat+=step){const p1=p([bounds[0],lat]),p2=p([bounds[2],lat]);str+=`<path d="M${p1}L${p2}" stroke="#ead19b" stroke-width=".6" opacity=".16"/>`;}
 }
 for(const f of geography.water) {
  if(!intersects(extent(f.geometry),bounds))continue;
  str+=f.kind==='lake'?`<path d="${geoPath(f.geometry,p)}" fill="#16413f" stroke="#d5dac0" stroke-opacity=".4" stroke-width=".65"/>`:`<path d="${geoPath(f.geometry,p)}" fill="none" stroke="#367574" stroke-width="${inset?.6:1.3}" stroke-linejoin="round"/>`;
 }
 str+='</g>';
 return {str,p,e,step,bounds};
}
function wrap(text,max=38) {
 const lines=[]; let row='';for(const word of text.split(' ')){if((row+' '+word).trim().length>max&&row){lines.push(row);row=word;}else row+=(row?' ':'')+word;}if(row)lines.push(row);return lines;
}
function markerLayout(markers,box) {
  // Labels may move; small anchor dots never move. Deterministic relaxation keeps
  // every number/letter separate even in Napa/Sonoma or the South Australian cluster.
  markers.forEach((m,i)=>{m.x=m.p[0]+(i%2?13:-13);m.y=m.p[1]-18;});
 for(let pass=0;pass<800;pass++) {
  for(let i=0;i<markers.length;i++)for(let j=i+1;j<markers.length;j++){
   const a=markers[i],b=markers[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),min=33;
   if(d<min){const ux=d?dx/d:(i%2?1:-1),uy=d?dy/d:.5,push=(min-d)/2+.05;a.x-=ux*push;a.y-=uy*push;b.x+=ux*push;b.y+=uy*push;}
  }
  for(let i=0;i<markers.length;i++)for(let j=0;j<markers.length;j++){
   const label=markers[i],anchor=markers[j].p,dx=label.x-anchor[0],dy=label.y-anchor[1],d=Math.hypot(dx,dy),min=22.5;
   if(d<min){const ux=d?dx/d:(i%2?1:-1),uy=d?dy/d:-1;label.x+=ux*(min-d+.05);label.y+=uy*(min-d+.05);}
  }
  for(const m of markers){m.x=Math.max(box.x+17,Math.min(box.x+box.w-17,m.x));m.y=Math.max(box.y+17,Math.min(box.y+box.h-17,m.y));}
 }
 for(let i=0;i<markers.length;i++){
  const a=markers[i];
  for(let j=i+1;j<markers.length;j++)if(Math.hypot(a.x-markers[j].x,a.y-markers[j].y)<32.99)throw Error('Label collision: '+a.label+' / '+markers[j].label);
  for(const b of markers)if(Math.hypot(a.x-b.p[0],a.y-b.p[1])<22.49)throw Error('Label covers locator: '+a.label+' / '+b.label);
 }
 // Geography first, labels last: no later leader or locator can overwrite a glyph.
 const leaders=markers.map(m=>`<path d="M${m.p}L${num(m.x)},${num(m.y)}" stroke="#f1d89e" stroke-width="1.25"/>`).join('');
 const dots=markers.map(m=>`<circle cx="${m.p[0]}" cy="${m.p[1]}" r="3.2" fill="#f6ecd5" stroke="#263b2d" stroke-width="1"/>`).join('');
 const labels=markers.map(m=>{const x=num(m.x),y=num(m.y);return `<g><title>${esc(m.key+' · '+m.label+': representative location')}</title><circle cx="${x}" cy="${y}" r="14" fill="${m.extra?'#183429':'#f3e9d5'}" stroke="#d5b16c" stroke-width="1.3"/><text x="${x}" y="${num(y+5.5)}" text-anchor="middle" font-size="17" font-weight="bold" fill="${m.extra?'#f3e9d5':'#17382a'}">${esc(m.key)}</text></g>`;}).join('');
 return leaders+dots+labels;
}
function render(id,sheet) {
 const layout=sheet._layout, bbox=layout.bounds;
 const mapBox={x:153,y:290,w:894,h:635};
 const main=baseMap(layout.geo,bbox,mapBox,'main-map');
 let body=frame();
 body+=`<text x="600" y="123" text-anchor="middle" fill="#e3bb72" font-size="17" letter-spacing="5">WINE ATLAS</text><text x="600" y="187" text-anchor="middle" fill="#f5e4bd" font-size="${sheet.title.length>12?49:60}" letter-spacing="2">${esc(sheet.title)}</text><path d="M445 212H575M625 212H755" stroke="#ac8547"/><path d="M600 206L606 212L600 218L594 212Z" fill="none" stroke="#edc981"/>`;
 body+='<rect x="124" y="260" width="952" height="716" rx="3" fill="url(#sea)" stroke="#d5b16c" stroke-width="1.3"/><rect x="134" y="270" width="932" height="696" fill="none" stroke="#ac8547" stroke-width=".6"/>';
 body+=main.str;
 // Grid labels identify true angular spacing; there is deliberately no scale bar.
 for(let lon=Math.ceil(main.bounds[0]/main.step)*main.step;lon<main.bounds[2];lon+=main.step){const xy=main.p([lon,main.bounds[1]]),displayLon=((lon+180)%360+360)%360-180;body+=`<text x="${xy[0]}" y="949" text-anchor="middle" fill="#d6c9a9" font-size="13">${Math.abs(displayLon)}°${Math.abs(displayLon)===180?'':displayLon<0?'W':displayLon>0?'E':''}</text>`;}
 for(let lat=Math.ceil(main.bounds[1]/main.step)*main.step;lat<main.bounds[3];lat+=main.step){const xy=main.p([main.bounds[0],lat]);body+=`<text x="139" y="${xy[1]+4}" fill="#eadabb" font-size="13" stroke="#102d29" stroke-width="3" paint-order="stroke">${Math.abs(lat)}°${lat<0?'S':lat>0?'N':''}</text>`;}
 let markers=[], insetMarkers=[];
 sheet.regions.forEach((r,i)=>r.anchors.forEach(a=>{
   const m={...a,key:String(i+1),extra:false};
   if(pointInside(a,bbox))markers.push({...m,p:main.p([a.lon,a.lat])});
   else if(layout.inset&&pointInside(a,layout.inset.bounds))insetMarkers.push(m);
   else throw Error(`${id}: anchor outside map and inset: ${a.label}`);
 }));
 sheet.extraAnchors.forEach((a,i)=>{if(!pointInside(a,bbox))throw Error('Extra outside '+a.label);markers.push({...a,key:String.fromCharCode(97+i),extra:true,p:main.p([a.lon,a.lat])});});
 body+=markerLayout(markers,mapBox);
 if(layout.inset){
  const inBox=layout.inset.overview?{x:862,y:302,w:169,h:240}:{x:186,y:698,w:234,h:191};
  body+=`<rect x="${inBox.x-10}" y="${inBox.y-29}" width="${inBox.w+20}" height="${inBox.h+70}" fill="#081d16" stroke="#d5b16c" stroke-width="1"/>`;
  const mini=baseMap(layout.inset.geo,layout.inset.bounds,inBox,'inset-map',{inset:true});body+=mini.str;
  if(layout.inset.overview){const b=main.bounds,p1=mini.p([b[0],b[3]]),p2=mini.p([b[2],b[1]]);body+=`<g clip-path="url(#inset-map)"><rect x="${p1[0]}" y="${p1[1]}" width="${num(p2[0]-p1[0])}" height="${num(p2[1]-p1[1])}" fill="#ead19b" fill-opacity=".1" stroke="#f1d89e" stroke-width="2"/></g>`;}
  else body+=markerLayout(insetMarkers.map(m=>({...m,p:mini.p([m.lon,m.lat])})),inBox);
  body+=`<text x="${inBox.x+inBox.w/2}" y="${inBox.y-10}" text-anchor="middle" fill="#ead19b" font-size="14">${esc(layout.inset.overview?'COUNTRY CONTEXT':'MADEIRA')}</text><text x="${inBox.x+inBox.w/2}" y="${inBox.y+inBox.h+21}" text-anchor="middle" fill="#d5c9a8" font-size="13">Separate scale</text>`;
 }
 // Long Island occupies the standard southeast ornament position.
 body+=id==='new-york'?compass(255,860):compass(995,864);
 body+='<rect x="124" y="994" width="952" height="263" rx="3" fill="#071d16" fill-opacity=".97" stroke="#ac8547" stroke-width=".8"/><path d="M149 1023H488M712 1023H1051" stroke="#927849"/><text x="600" y="1029" text-anchor="middle" fill="#e7c788" font-size="18" letter-spacing="3">STUDY KEY</text>';
 const legend=[...sheet.regions.map((r,i)=>({key:String(i+1),label:r.name})),...sheet.extraAnchors.map((a,i)=>({key:String.fromCharCode(97+i),label:a.label,extra:true}))];
 const cols=legend.length>12?3:2, rows=Math.ceil(legend.length/cols), gap=Math.min(36,174/rows), colWidth=cols===3?309:462;
 legend.forEach((item,i)=>{
   const col=Math.floor(i/rows), row=i%rows,x=151+col*colWidth,y=1069+row*gap;
   const size=cols===3?17:19, lines=wrap(item.label,cols===3?31:43);
   if(lines.length>2)throw Error(id+': study key label too long '+item.label);
   body+=`<circle cx="${x}" cy="${y-6}" r="11" fill="${item.extra?'#183429':'#f3e9d5'}" stroke="#d5b16c"/><text x="${x}" y="${y}" text-anchor="middle" fill="${item.extra?'#f3e9d5':'#17382a'}" font-size="15" font-weight="bold">${esc(item.key)}</text><text x="${x+22}" y="${y-(lines.length>1?6:0)}" fill="#f5e9ce" font-size="${size}">${lines.map((line,j)=>`<tspan x="${x+22}" dy="${j?17:0}">${esc(line)}</tspan>`).join('')}</text>`;
 });
 body+='<text x="600" y="1229" text-anchor="middle" fill="#c7ba9f" font-size="13">Dots: representative places · outlines: geography, not appellation boundaries</text>';
 const journey=wrap(sheet.journey,49);
 body+=`<rect x="327" y="1275" width="546" height="${journey.length*25+27}" rx="4" fill="#071b14" fill-opacity=".94" stroke="#ac8547" stroke-width=".7"/><text x="600" y="1303" text-anchor="middle" fill="#eed8aa" font-size="19" font-style="italic">${journey.map((line,i)=>`<tspan x="600" dy="${i?25:0}">${esc(line)}</tspan>`).join('')}</text>`;
 body+='<rect x="216" y="1450" width="768" height="28" rx="3" fill="#071b14" fill-opacity=".93"/><text x="600" y="1469" text-anchor="middle" fill="#ead8b4" font-size="13" letter-spacing=".4">Natural Earth geography · selected rivers &amp; lakes · north is up · explorer edition 3</text>';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500" role="img" aria-labelledby="atlas-title atlas-desc"><title id="atlas-title">${esc(sheet.title)} wine-growing study atlas</title><desc id="atlas-desc">${esc(sheet.intro+' '+sheet.scope+' '+sheet.regions.map((r,i)=>(i+1)+': '+r.name+'. '+r.note).join(' '))}</desc><defs><linearGradient id="sea" x2=".9" y2="1"><stop stop-color="#16413b"/><stop offset="1" stop-color="#081f1e"/></linearGradient><linearGradient id="land" x2=".8" y2="1"><stop stop-color="#e7d5a4"/><stop offset=".5" stop-color="#c9b981"/><stop offset="1" stop-color="#af9d69"/></linearGradient><pattern id="print-grain" width="23" height="19" patternUnits="userSpaceOnUse"><path d="M2 4h2m7 3h1m8 6h2M5 16h1M15 2h2" stroke="#f8edce" stroke-width=".6"/><path d="M8 2h1m8 7h2M2 12h1m8 5h2" stroke="#6e6a42" stroke-width=".45"/></pattern></defs><g font-family="Georgia, 'Times New Roman', serif">${body}</g></svg>\n`;
}
const publicData=JSON.parse(JSON.stringify(catalog));
for(const [id,sheet] of Object.entries(catalog.sheets)) {
 const svg=render(id,sheet);
 if(Buffer.byteLength(svg)>2*1024*1024)throw Error('Oversize '+id);
 for(const target of roots){fs.mkdirSync(path.join(target,'maps/atlas-v3'),{recursive:true});fs.writeFileSync(path.join(target,sheet.file),svg);}
 delete publicData.sheets[id]._layout;
 console.log(id,Buffer.byteLength(svg));
}
for(const target of roots)fs.writeFileSync(path.join(target,'js/data-atlas-v2.js'),'/* Explorer Atlas v3: reviewed location guide. Generated by .scripts/atlas-v3/build.cjs. Global name retained for classic-script compatibility. */\nvar ATLAS_V2 = '+JSON.stringify(publicData,null,2)+';\n');
