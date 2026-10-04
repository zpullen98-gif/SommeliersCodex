/* Optional provenance refresh. Normal builds read vendored geography.json and
   need no network. Node 20+. Usage: node download.cjs <destination-directory> */
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const snapshot=require('./geography.json');
const destination=process.argv[2];
if(!destination)throw Error('Provide a download directory.');
fs.mkdirSync(destination,{recursive:true});
(async()=>{
 for(const [name,expected] of Object.entries(snapshot.hashes)){
  const url=`https://raw.githubusercontent.com/nvkelso/natural-earth-vector/${snapshot.revision}/geojson/${name}.geojson`;
  const response=await fetch(url,{signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw Error(`${name}: HTTP ${response.status}`);
  const bytes=Buffer.from(await response.arrayBuffer());
  const hash=crypto.createHash('sha256').update(bytes).digest('hex');
  if(hash!==expected)throw Error('Source hash mismatch: '+name);
  fs.writeFileSync(path.join(destination,name+'.json'),bytes);
  console.log(name,hash);
 }
})().catch(error=>{console.error(error.message);process.exitCode=1;});
