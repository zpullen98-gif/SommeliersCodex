/* Shared drawing conventions from Explorer Atlas v3, using extended public-domain geography. */
const fs=require('fs'),path=require('path');
const geography=require('./geography.json');
const frameArt=fs.readFileSync(path.resolve(__dirname,'../../assets/codex-atlas-frame-v3.webp')).toString('base64');
const esc = x => String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const num = v => Number(v.toFixed(2));
const pointInside = (a,b) => a.lon>=b[0]&&a.lon<=b[2]&&a.lat>=b[1]&&a.lat<=b[3];
function coordinates(geo) { return geo.type==='GeometryCollection'?geo.geometries.flatMap(coordinates):geo.coordinates; }
const EXTENTS=new WeakMap();
function extent(geo) {
 if(EXTENTS.has(geo))return EXTENTS.get(geo);
  let e=[Infinity,Infinity,-Infinity,-Infinity];
  function visit(a) { if(typeof a[0]==='number'){e=[Math.min(e[0],a[0]),Math.min(e[1],a[1]),Math.max(e[2],a[0]),Math.max(e[3],a[1])];}else a.forEach(visit); }
  visit(coordinates(geo)); EXTENTS.set(geo,e); return e;
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
  // Only labels move. Choose the nearest clear ring position while protecting
  // every geographic dot and every label already placed. This terminates even
  // when several real settlements sit very close to an inherited region dot.
  const placed=[];
  for(const m of markers){
   let chosen=null;
   for(let radius=27;radius<700&&!chosen;radius+=7){
    for(let angle=0;angle<48;angle++){
     const theta=(angle*360/48-90)*Math.PI/180,x=m.p[0]+Math.cos(theta)*radius,y=m.p[1]+Math.sin(theta)*radius;
     if(x<box.x+17||x>box.x+box.w-17||y<box.y+17||y>box.y+box.h-17)continue;
     if(markers.some(a=>Math.hypot(x-a.p[0],y-a.p[1])<23))continue;
     if(placed.some(a=>Math.hypot(x-a.x,y-a.y)<34))continue;
     chosen={x,y};break;
    }
   }
   if(!chosen)throw Error('No clear label position: '+m.label);
   m.x=chosen.x;m.y=chosen.y;placed.push(m);
  }
 // Geography first, labels last: no later leader or locator can overwrite a glyph.
 const leaders=markers.map(m=>`<path d="M${m.p}L${num(m.x)},${num(m.y)}" stroke="#f1d89e" stroke-width="1.25"/>`).join('');
 const dots=markers.map(m=>`<circle cx="${m.p[0]}" cy="${m.p[1]}" r="3.2" fill="#f6ecd5" stroke="#263b2d" stroke-width="1"/>`).join('');
 const labels=markers.map(m=>{const x=num(m.x),y=num(m.y);return `<g><title>${esc(m.key+' · '+m.label+': representative location')}</title><circle cx="${x}" cy="${y}" r="14" fill="${m.extra?'#183429':'#f3e9d5'}" stroke="#d5b16c" stroke-width="1.3"/><text x="${x}" y="${num(y+5.5)}" text-anchor="middle" font-size="17" font-weight="bold" fill="${m.extra?'#f3e9d5':'#17382a'}">${esc(m.key)}</text></g>`;}).join('');
 return leaders+dots+labels;
}

module.exports={esc,num,extent,intersects,pointInside,projection,geoPath,frame,compass,baseMap,wrap,markerLayout,geography};
