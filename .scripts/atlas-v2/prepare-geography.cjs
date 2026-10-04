/* One-time extraction from unmodified Natural Earth GeoJSON downloads.
   Usage: node .scripts/atlas-v2/prepare-geography.cjs <download-directory>
   The compact result is committed, so normal SVG rebuilds need no network. */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const dir = process.argv[2];
if (!dir) throw new Error('Provide the directory containing Natural Earth downloads.');
const catalog = require('./catalog.cjs');
const files = ['ne_10m_admin_0_countries','ne_10m_admin_1_states_provinces','ne_10m_rivers_lake_centerlines','ne_10m_lakes','ne_10m_lakes_europe','ne_10m_rivers_europe','ne_10m_lakes_north_america','ne_10m_rivers_north_america'];
const source = {}, hashes = {};
for (const n of files) { const b = fs.readFileSync(path.join(dir,n+'.json')); source[n] = JSON.parse(b); hashes[n] = crypto.createHash('sha256').update(b).digest('hex'); }
const countries = source.ne_10m_admin_0_countries.features;
const states = source.ne_10m_admin_1_states_provinces.features;
const features = {};
const countryCodes = new Set(Object.values(catalog.sheets).map(x=>x._layout.geo).filter(x=>!x.startsWith('US-')));
// Neighbor outlines are geographic context; no wine-region boundaries are encoded.
for (const c of ['USA','CAN','MEX','PRT','ESP','FRA','GBR','IRL','DEU','CHE','AUT','ITA','BEL','LUX','NLD','DNK','CZE','POL','SVK','HUN','SVN','HRV','BIH','SRB','ROU','UKR','MNE','ALB','MKD','BGR','GRC','TUR','MAR','CHL','ARG','BOL','PER','BRA','URY','PRY','ZAF','NAM','BWA','ZWE','MOZ','LSO','SWZ','AUS','NZL']) countryCodes.add(c);
for (const code of countryCodes) { const f = countries.find(f=>f.properties.ADM0_A3===code); if (!f) throw Error(code); features[code] = {name:f.properties.ADMIN,geometry:f.geometry}; }
for (const code of ['US-CA','US-OR','US-WA','US-NY']) { const f=states.find(f=>f.properties.iso_3166_2===code);if(!f)throw Error(code);features[code]={name:f.properties.name,geometry:f.geometry}; }
const riverNames = /^(Rhine|Rhein|Rhin|Rhône|Rhone|Loire|Mosel|Moselle|Danube|Donau|Duna|Douro|Duero|Tejo|Tagus|Ebro|Garonne|Dordogne|Main|Neckar|Nahe|Ahr|Adige|Po|Columbia|Willamette|Hudson|Snake|Yakima|Sacramento|San Joaquin|Río Negro|Negro|Neuquén|Murray|Breede|Bodrog|Tisza)$/i;
const lakeNames = /Balaton|Neusied|Fertő|Seneca|Cayuga|Ontario|Erie|Champlain|Bodensee|Constance|Geneva|Garda|Maggiore|Taupo|Wakatipu|Wanaka|Dunstan/i;
const water = [];
for(const [n, collection] of Object.entries(source)) {
  if(!/lakes|rivers/.test(n))continue;
  for(const f of collection.features) {
    const p=f.properties, names=[p.name,p.name_en,p.name_alt,p.label].filter(Boolean);
    if(names.some(v=>(n.includes('lakes')?lakeNames:riverNames).test(v))) water.push({name:p.name_en||p.name||p.label,kind:n.includes('lakes')?'lake':'river',geometry:f.geometry,source:n});
  }
}
const result = {license:'Public domain',licenseUrl:'https://www.naturalearthdata.com/about/terms-of-use/',reference:'Natural Earth, 1:10 million. Generalized physical and administrative geography; not surveyed legal boundaries.',retrieved:'2026-09-27',upstream:'https://github.com/nvkelso/natural-earth-vector',revision:'ca96624a56bd078437bca8184e78163e5039ad19',hashes,features,water};
fs.writeFileSync(path.join(__dirname,'geography.json'),JSON.stringify(result));
console.log('Wrote geography:',Object.keys(features).length,'outlines;',water.length,'water features.');
