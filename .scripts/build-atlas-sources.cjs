/* Build a readable, offline bibliography from the same literal atlas metadata.
   node .scripts/build-atlas-sources.cjs [Codex root] [--check]
   No source URLs are executed, fetched, or copied into request allowlists. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(process.argv.slice(2).find((arg) => !arg.startsWith('--')) || path.join(__dirname, '..'));
const input = fs.readFileSync(path.join(root, 'js/data-atlas-v2.js'), 'utf8');
const match = /^\s*(?:\/\*[\s\S]*?\*\/\s*)?var\s+ATLAS_V2\s*=\s*([\s\S]+);\s*$/.exec(input);
if (!match) throw new Error('Atlas metadata must be one JSON-compatible ATLAS_V2 declaration');
const atlas = JSON.parse(match[1]);
if (atlas.version !== '3' || !atlas.sheets || Object.keys(atlas.sheets).length !== 17) throw new Error('Expected all seventeen reviewed atlas sheets');
const escape = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const style = (name) => {
  const found = index.match(new RegExp('href="(css/' + name + '\\.css\\?v=\\d+)"'));
  if (!found) throw new Error('Missing versioned local stylesheet: ' + name);
  return found[1];
};
const sheets = Object.entries(atlas.sheets);
const sections = sheets.map(([id, sheet]) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || !Array.isArray(sheet.sources) || !sheet.sources.length) throw new Error('Invalid atlas source sheet: ' + id);
  const links = sheet.sources.map((source) => {
    const url = new URL(source.url);
    if (url.protocol !== 'https:' || url.username || url.password || !source.title) throw new Error('Invalid citation in ' + id);
    return '      <li><a href="' + escape(source.url) + '" target="_blank" rel="noopener noreferrer">' + escape(source.title) + '<span class="source-note"> (opens in a new tab)</span></a></li>';
  }).join('\n');
  return '  <section id="' + id + '" data-atlas-source-sheet="' + id + '" class="card">\n' +
    '    <h2>' + escape(sheet.title) + '</h2>\n' +
    '    <p>' + escape(sheet.scope) + '</p>\n    <ul>\n' + links + '\n    </ul>\n  </section>';
}).join('\n');
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#081510">
<meta name="apple-mobile-web-app-title" content="Outside Of Time">
<title>Sources of the Wine Atlas · The Sommelier’s Codex</title>
<link rel="stylesheet" href="${style('codex')}">
<link rel="stylesheet" href="${style('house')}">
<style>
.atlas-bibliography{max-width:980px;padding:clamp(18px,5vw,48px);margin:20px auto;box-sizing:border-box}
.atlas-bibliography header{max-width:760px;margin:0 auto 32px;text-align:center}
.atlas-bibliography h1{font-family:var(--house-display,Georgia,serif);font-size:clamp(27px,5vw,42px);color:var(--gold-hi,#ead19b);line-height:1.25}
.atlas-bibliography header p,.atlas-bibliography header a,.atlas-bibliography nav a{color:var(--parch,#f3e9d5)}
.atlas-bibliography nav{display:flex;flex-wrap:wrap;justify-content:center;gap:8px 18px;margin-top:24px}
.atlas-bibliography nav a,.atlas-bibliography .return{display:inline-flex;align-items:center;min-height:44px}
.atlas-bibliography .card{padding:clamp(18px,4vw,32px);margin:20px 0;scroll-margin-top:20px;color:var(--ink,#29271f)}
.atlas-bibliography .card h2{font-family:var(--house-display,Georgia,serif);font-size:24px;color:var(--ink,#29271f);margin:0 0 14px}
.atlas-bibliography .card p,.atlas-bibliography .card li{font-size:18px;line-height:1.65}
.atlas-bibliography .card ul{padding-left:22px}.atlas-bibliography .card li{padding:6px 0}
.atlas-bibliography .card a{color:var(--claret,#843d37);overflow-wrap:anywhere;text-decoration:underline}
.atlas-bibliography .source-note{font-size:15px}.atlas-bibliography :focus-visible{outline:3px solid currentColor;outline-offset:4px}
@media(max-width:600px){.atlas-bibliography{margin:0;border-left:0;border-right:0}.atlas-bibliography nav{justify-content:flex-start}}
@media print{.atlas-bibliography{border:0;box-shadow:none;background:white;color:black}.atlas-bibliography header *{color:black!important}.atlas-bibliography nav,.atlas-bibliography .return{display:none}.atlas-bibliography .card{background:white;break-inside:avoid;box-shadow:none}.atlas-bibliography .card a{color:black}}
</style>
</head>
<body>
<main class="wrap atlas-bibliography">
  <header>
    <h1>Sources of the Wine Atlas</h1>
    <p>Geography and regional reading for all seventeen sheets. Place markers identify study locations; they do not draw legal appellation boundaries.</p>
    <p>Reviewed 10 October 2026. External references need a connection; this bibliography stays available with the Codex.</p>
    <a class="return" href="index.html">Back to the Codex</a>
    <nav aria-label="Atlas source sheets">${sheets.map(([id, sheet]) => '<a href="#' + id + '">' + escape(sheet.title) + '</a>').join('')}</nav>
  </header>
${sections}
</main>
</body>
</html>
`;
const output = path.join(root, 'atlas-sources.html');
if (process.argv.includes('--check')) {
  if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== html) throw new Error('Atlas bibliography is stale; regenerate it');
  console.log('atlas-sources: exact metadata parity, seventeen source sections');
} else {
  fs.writeFileSync(output, html);
  console.log('atlas-sources: wrote ' + output);
}
