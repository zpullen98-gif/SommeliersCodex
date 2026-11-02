/* serve.mjs: the Codex source under /codex/ and a shared layer under /shared/ (from SITE_ROOT).
   node serve.mjs [port]   env: CODEX_SRC (default /home/user/sommelierscodex), SITE_ROOT (default
   /home/user/zpullen98-gif.github.io; point it at a scratch root whose shared/ copies the WorldTable
   static/shared to serve the new pack and oot-house.js). Work in progress for the codex54 edition. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const PORT = Number(process.argv[2] || process.env.PORT || 8791);
const CODEX = process.env.CODEX_SRC || '/home/user/sommelierscodex';
const SITE = process.env.SITE_ROOT || '/home/user/zpullen98-gif.github.io';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8' };
function resolve(urlPath) {
  const p = decodeURIComponent(urlPath.split('?')[0]);
  if (p === '/codex') return null;
  if (p.startsWith('/codex/')) return path.join(CODEX, p.slice('/codex/'.length) || 'index.html');
  return path.join(SITE, p);
}
http.createServer((req, res) => {
  if (req.url.split('?')[0] === '/codex') { res.writeHead(301, { Location: '/codex/' }); return res.end(); }
  let f = resolve(req.url);
  try { if (f && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch {}
  fs.readFile(f || '', (err, buf) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(buf);
  });
}).listen(PORT, '127.0.0.1', () => console.log(`serve: http://127.0.0.1:${PORT}/codex/ (codex ${CODEX}, shared from ${SITE})`));
