'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto'),assert=require('assert/strict');
const root=path.resolve(process.argv[2]||path.join(__dirname,'..')),ctx={};
for(const name of ['data-regions.js','data-field-atlas.js'])vm.runInNewContext(fs.readFileSync(path.join(root,'js',name),'utf8'),ctx);
const maps=ctx.FIELD_ATLAS.maps, regions=ctx.REGIONS.regions, countries=ctx.REGIONS.countries;
assert.equal(maps.length,129);assert.equal(new Set(maps.map(m=>m.id)).size,129);
assert.equal(maps.filter(m=>m.type==='region').length,115);
assert.equal(maps.filter(m=>m.type==='country').length,14);
const wanted=['canada','england','lebanon','mexico','switzerland','uruguay','eastern-europe'];
for(const key of wanted)assert(maps.some(m=>m.type==='country'&&m.countryKey===key),'Missing country '+key);
let places=0,bytes=0;
for(const m of maps){
 assert(countries[m.countryKey],'Unknown group '+m.id);
 assert(/^maps\/regions-v1\/[a-z0-9-]+\.svg$/.test(m.file));
 if(m.type==='region')assert(regions.some(r=>r.slug===m.id&&r.sheet===m.sheet),'Bad region join '+m.id);
 assert(m.places.length&&m.places.length<=12,'Place budget '+m.id);
 assert(m.sources.some(s=>/^https:/.test(s.url)),'No sources '+m.id);
 for(const p of m.places){
  assert(p.name&&Number.isFinite(p.lon)&&Number.isFinite(p.lat),'Invalid place '+m.id);
  assert(p.lon>=m.bounds[0]&&p.lon<=m.bounds[2]&&p.lat>=m.bounds[1]&&p.lat<=m.bounds[3],'Outside view '+m.id+': '+p.name);
  if(p.sourceUrl)assert(/^https:/.test(p.sourceUrl));
 }
 const svg=fs.readFileSync(path.join(root,m.file),'utf8');
 assert(svg.includes('<title id="title">')&&svg.includes('<desc id="desc">'));
 assert(!/(?:NaN|Infinity)/.test(svg.replace(/data:image[^"']+/g,'')),'Invalid path '+m.id);
 assert(!/<script|onload=|onerror=/.test(svg));
 assert.equal(crypto.createHash('sha256').update(svg).digest('hex'),m.sha256);
 assert.equal(Buffer.byteLength(svg),m.bytes);bytes+=m.bytes;places+=m.places.length;
}
for(const id of ['champagne','tuscany'])for(const k of ['terroir','grapes','growing','cellar','service','compare'])assert(maps.find(m=>m.id===id).notes[k].length);
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8'),index=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(sw.indexOf('url.pathname.startsWith(FIELD_ROOT.pathname)')<sw.indexOf('url.pathname.startsWith(MAP_ROOT.pathname)'));
assert(!sw.slice(sw.indexOf('const ASSETS'),sw.indexOf("self.addEventListener('install'")).includes('maps/regions-v1'));
for(const f of ['data-field-atlas.js','codex45.js'])assert.equal((index.match(new RegExp('src="js/'+f.replace('.','\\.')+'\\?v=','g'))||[]).length,1);
assert(index.indexOf('js/data-field-atlas.js')<index.indexOf('js/codex45.js'));
assert(index.indexOf('js/codex45.js')<index.indexOf('js/boot.js'));
console.log(`PASS: ${maps.length} maps, all ${regions.length} regional joins, 14 country maps, ${places} locations, ${(bytes/1048576).toFixed(1)} MiB, exact hashes, bounds, safe SVG and shell/cache integration.`);
