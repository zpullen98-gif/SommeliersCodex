/* node .scripts/render-icons.cjs [path to @resvg/resvg-js]
   SVG is the source of truth. No raster palette edits or native dependencies
   are installed in this no-build app; the renderer may live in scratch. */
const fs = require('node:fs');
const path = require('node:path');
const { Resvg } = require(process.argv[2] || '@resvg/resvg-js');
const root = path.resolve(__dirname, '..', 'icons');
const svg = fs.readFileSync(path.join(root, 'icon.svg'), 'utf8');
for (const [name, width] of [['icon-512.png', 512], ['icon-192.png', 192], ['apple-touch-icon.png', 180]]) {
  fs.writeFileSync(path.join(root, name), new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng());
}
const mark = svg.replace(/<svg[^>]*>/, '<g>').replace(/<\/svg>\s*$/, '</g>');
const maskable = '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">' +
  '<rect width="512" height="512" fill="#081510"/><g transform="translate(51.2 51.2) scale(.8)">' + mark + '</g></svg>';
fs.writeFileSync(path.join(root, 'icon-maskable-512.png'), new Resvg(maskable).render().asPng());
console.log('Rendered four forest-green icons from icons/icon.svg.');
