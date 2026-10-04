/* Atlas release closure: source coverage, original preservation, map safety,
   script order, bibliography freshness, paired files and shell asset closure.
   node .scripts/check-atlas-data.js [Codex root] [other Codex root]
   Uses the checked-in local scripts only; never fetches a reference URL. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const other = process.argv[3] && path.resolve(process.argv[3]);
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
let checks = 0;
const check = (label, value) => { assert.ok(value, label); checks++; };
const escape = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const context = vm.createContext({ URL, Response, Promise, atob, location: new URL('https://example.test/codex/'), window: {} });
for (const file of ['js/data-intro.js', 'js/reference.js', 'js/data-maps.js', 'js/data-atlas-v2.js']) {
  vm.runInContext(read(file), context, { filename: file });
}
const oldCache = read('js/codex23.js');
vm.runInContext(oldCache.slice(0, oldCache.indexOf('function v23Open')), context);
vm.runInContext(read('js/atlas-cache.js'), context);
const atlas = context.ATLAS_V2;
const ids = Array.from(context.MAP_SHEETS, (sheet) => sheet.id);
check('seventeen exact registered sheets, in established order', atlas.version === '2' &&
  JSON.stringify(Object.keys(atlas.sheets)) === JSON.stringify(ids) && ids.length === 17);
const originalNames = fs.readdirSync(path.join(root, 'maps')).filter((file) => /\.jpg$/.test(file)).sort();
check('all seventeen original JPGs remain', JSON.stringify(originalNames) === JSON.stringify(ids.map((id) => id + '.jpg').sort()));
const currentNames = fs.readdirSync(path.join(root, 'maps/atlas-v2')).filter((file) => /\.svg$/.test(file)).sort();
check('all seventeen current SVGs exist without a hidden eighteenth', JSON.stringify(currentNames) === JSON.stringify(ids.map((id) => id + '.svg').sort()));
const gitRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: root, encoding: 'utf8' }).trim();
let regions = 0, preservedRows = 0, mapBytes = 0, references = 0;
const orphans = [];
(async () => {
  for (const id of ids) {
    const sheet = atlas.sheets[id], rows = Array.from(context.mapRegions(id));
    preservedRows += rows.length;
    rows.filter((row) => row.orphan).forEach((row) => orphans.push(row.n));
    check(id + ': exact mapped row names and order', JSON.stringify(Array.from(sheet.regions, (row) => row.name)) ===
      JSON.stringify(rows.filter((row) => !row.orphan).map((row) => row.n)));
    regions += sheet.regions.length;
    check(id + ': explicit local versioned path and dimensions', sheet.file === 'maps/atlas-v2/' + id + '.svg' && sheet.width === 1200 && sheet.height === 1500 && context.mapFile(id) === sheet.file);
    check(id + ': readable introduction, scope and reading list', !!sheet.title && !!sheet.intro && !!sheet.scope && Array.isArray(sheet.reading) && sheet.reading.length > 0);
    check(id + ': cited primary reading list', Array.isArray(sheet.sources) && sheet.sources.length > 0 && sheet.sources.every((source) => {
      const url = new URL(source.url); references++;
      return Object.keys(source).sort().join(',') === 'title,url' && !!source.title && url.protocol === 'https:' && !url.username && !url.password;
    }));
    check(id + ': every study region has a finite geographic locator', sheet.regions.every((region) => Array.isArray(region.anchors) && region.anchors.length > 0 && region.anchors.every((a) =>
      !!a.label && Number.isFinite(a.lon) && a.lon >= -180 && a.lon <= 180 && Number.isFinite(a.lat) && a.lat >= -90 && a.lat <= 90)));
    check(id + ': extra reference points stay geographic', Array.isArray(sheet.extraAnchors) && sheet.extraAnchors.every((a) =>
      !!a.label && Number.isFinite(a.lon) && a.lon >= -180 && a.lon <= 180 && Number.isFinite(a.lat) && a.lat >= -90 && a.lat <= 90));
    const svg = read(sheet.file), buffer = fs.readFileSync(path.join(root, sheet.file));
    mapBytes += buffer.length;
    check(id + ': dimensions and accessible image description', /<svg\b[^>]*width="1200"[^>]*height="1500"[^>]*viewBox="0 0 1200 1500"/.test(svg) &&
      svg.includes('aria-labelledby="atlas-title atlas-desc"') && svg.includes('<title id="atlas-title">') && svg.includes('<desc id="atlas-desc">'));
    check(id + ': all numbered study names appear in the SVG key', sheet.regions.every((region, i) => svg.includes((i + 1) + ': ' + escape(region.name))));
    check(id + ': within bounded download size', buffer.length <= context.ATLAS_MAX_MAP_BYTES);
    await context.atlasCacheValidate(new Response(svg, { headers: { 'content-type': 'image/svg+xml' } })); checks++;
    const vignette = Array.from(svg.matchAll(/\b(?:href|src)="data:image\/webp;base64,([A-Za-z0-9+/=]+)"/g));
    check(id + ': exactly one embedded owned house illustration', vignette.length === 1 &&
      Buffer.from(vignette[0][1], 'base64').equals(fs.readFileSync(path.join(root, 'assets/codex-atlas-vignette-v2.webp'))));
    const originalPath = path.join(root, 'maps', id + '.jpg');
    const gitPath = path.relative(gitRoot, originalPath).replace(/\\/g, '/');
    const original = execFileSync('git', ['show', 'HEAD:' + gitPath], { cwd: gitRoot, maxBuffer: 2 * 1024 * 1024 });
    check(id + ': original source image preserved byte for byte', fs.readFileSync(originalPath).equals(original));
  }
  check('all115 mapped lessons retained', regions === 115);
  check('original117 rows preserved including Virginia and Texas', preservedRows === 117 && JSON.stringify(orphans) === JSON.stringify(['Virginia', 'Texas']));
  const handlers = {};
  const worker = vm.createContext({ URL, self: { location: new URL('https://example.test/codex/sw.js'), addEventListener: (event, fn) => { handlers[event] = fn; } } });
  worker.importScripts = (...files) => files.forEach((file) => vm.runInContext(read(file.split('?')[0]), worker));
  vm.runInContext(read('sw.js'), worker);
  const assets = Array.from(vm.runInContext('ASSETS', worker));
  check('no map image is in the shell install', !assets.some((asset) => /(?:^|\/)maps\//.test(asset)));
  const missing = assets.filter((asset) => !fs.existsSync(path.resolve(root, asset.split('?')[0])));
  check('every shell asset exists: ' + missing.join(', '), missing.length === 0);
  for (const file of ['css/house-maps.css', 'js/data-atlas-v2.js', 'js/atlas-cache.js', 'js/codex31.js', 'assets/codex-atlas-room-v2.webp', 'atlas-sources.html']) {
    check('offline shell includes ' + file, assets.includes('./' + file));
  }
  const index = read('index.html'), scripts = Array.from(index.matchAll(/<script\b[^>]*src="([^"?]+)(?:\?[^"]*)?"/g), (m) => m[1]);
  const order = ['js/codex26.js', 'js/codex27.js', 'js/codex28.js', 'js/codex29.js', 'js/codex30.js', 'js/data-atlas-v2.js', 'js/atlas-cache.js', 'js/codex31.js', 'js/boot.js'];
  check('classic script override order is exact', order.every((file, i) => scripts.filter((s) => s === file).length === 1 && (!i || scripts.indexOf(file) > scripts.indexOf(order[i - 1]))));
  check('gallery stylesheet is explicitly linked', /href="css\/house-maps\.css\?v=\d+"/.test(index));
  execFileSync(process.execPath, [path.join(__dirname, 'build-atlas-sources.cjs'), root, '--check'], { stdio: 'pipe' }); checks++;
  const bibliography = read('atlas-sources.html');
  check('bibliography has all17 source sections and no JavaScript', (bibliography.match(/data-atlas-source-sheet=/g) || []).length === 17 && !/<script\b/i.test(bibliography));
  if (other) {
    for (const file of ['js/data-atlas-v2.js', 'js/atlas-cache.js', 'js/codex31.js', 'css/house-maps.css', 'assets/codex-atlas-room-v2.webp', 'assets/codex-atlas-vignette-v2.webp', ...ids.map((id) => atlas.sheets[id].file)]) {
      check('paired file parity: ' + file, fs.readFileSync(path.join(root, file)).equals(fs.readFileSync(path.join(other, file))));
    }
    const otherBibliography = fs.readFileSync(path.join(other, 'atlas-sources.html'), 'utf8');
    const unstamped = (text) => text.replace(/css\/(codex|house)\.css\?v=\d+/g, 'css/$1.css');
    check('paired bibliography content agrees, allowing local stylesheet stamps', unstamped(bibliography) === unstamped(otherBibliography));
  }
  console.log('check-atlas-data: all ' + checks + ' checks pass; ' + ids.length + ' maps, ' + regions + ' mapped lessons, ' + preservedRows + ' original rows, ' + references + ' source links, ' + assets.length + ' shell assets, ' + mapBytes + ' SVG bytes (' + root + ')');
})().catch((error) => { console.error(error); process.exitCode = 1; });
