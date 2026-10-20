/* Reproducible, pinned Natural Earth extraction for regional study maps.
   Run: node .scripts/atlas-regions/prepare-geography.cjs <scratch-directory>
   Retains source geometry; does not invent appellation boundaries or relief. */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const prior = require('../atlas-v2/geography.json');
const revision = prior.revision;
const scratch = process.argv[2];
if (!scratch) throw new Error('Provide a scratch directory for pinned source downloads.');
const files = [
  'ne_10m_admin_0_countries',
  'ne_10m_populated_places',
  'ne_10m_rivers_lake_centerlines',
  'ne_10m_rivers_europe',
  'ne_10m_lakes',
  'ne_10m_lakes_europe'
];
const source = {}, provenance = [];
async function main() {
  fs.mkdirSync(scratch, {recursive:true});
  for (const name of files) {
    const url = `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/${revision}/geojson/${name}.geojson`;
    const dest = path.join(scratch,name+'.geojson');
    let bytes;
    if (fs.existsSync(dest)) bytes = fs.readFileSync(dest);
    else {
      const response = await fetch(url,{signal:AbortSignal.timeout(60000)});
      if (!response.ok) throw new Error(name+': HTTP '+response.status);
      bytes = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(dest,bytes);
    }
    const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
    if (prior.hashes[name] && sha256 !== prior.hashes[name]) throw new Error('Pinned source hash mismatch: '+name);
    source[name] = JSON.parse(bytes.toString('utf8'));
    provenance.push({name,url,sha256,bytes:bytes.length});
    console.log(name,bytes.length,sha256);
  }
  const features = {...prior.features};
  for (const feature of source.ne_10m_admin_0_countries.features) {
    const p=feature.properties, code=p.ADM0_A3;
    // Complete country coverage prevents neighboring land from becoming the sea
    // background in a fitted viewport (Russia north of Georgia, for example).
    features[code]={name:p.ADMIN,geometry:feature.geometry};
  }
  // Retain the global named waterways. Rendering clips them to each actual map
  // window, so a large regional viewport need not silently lose a tributary.
  const water=[], seen=new Set();
  for (const name of ['ne_10m_rivers_lake_centerlines','ne_10m_rivers_europe','ne_10m_lakes','ne_10m_lakes_europe']) {
    for(const f of source[name].features) {
      const label=f.properties.name_en||f.properties.name;
      if(!label) continue;
      const key=JSON.stringify(f.geometry);
      if(seen.has(key))continue;
      seen.add(key);
      water.push({name:label,kind:name.includes('rivers')?'river':'lake',geometry:f.geometry,source:name});
    }
  }
  // These are actual town/city points, not vineyard or appellation centroids.
  // The source omits many small villages; authored vineyard-area dots remain
  // explicitly approximate in the separate catalogs.
  const places=source.ne_10m_populated_places.features.map(f=>{
    const p=f.properties;
    return {name:p.NAME,lon:f.geometry.coordinates[0],lat:f.geometry.coordinates[1],
      country:p.ADM0NAME,region:p.ADM1NAME,iso:p.SOV_A3,rank:p.SCALERANK,
      population:p.POP_MAX,source:'ne_10m_populated_places'};
  });
  const out={license:prior.license,licenseUrl:prior.licenseUrl,revision,
    reference:'Natural Earth 1:10 million; complete country coverage, selected state, named water and populated-place geometry.',
    features,water,places};
  fs.writeFileSync(path.join(__dirname,'geography.json'),JSON.stringify(out)+'\n');
  fs.writeFileSync(path.join(__dirname,'provenance.json'),JSON.stringify({
    revision,retrieved:new Date().toISOString().slice(0,10),
    license:prior.license,licenseUrl:prior.licenseUrl,sources:provenance,
    inheritedStateGeometry:'../atlas-v2/geography.json; source hashes retained there',
    scope:'Orientation geography only. Country boundaries reflect the pinned cartographic dataset. Wine areas use approximate representative points, not legal boundaries.'
  },null,2)+'\n');
  console.log(JSON.stringify({features:Object.keys(features).length,water:water.length,places:places.length}));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
