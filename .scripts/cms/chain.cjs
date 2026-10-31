/* The final chain in a node sandbox, for the CMS edition's two gates (check-cms.js, check-grapes.js).

   loadChain(jsDir, opts) reads index.html beside jsDir (jsDir/../index.html), takes every classic script it loads
   from js/ in its order (the shared service controller and the rewrite preview left out, as check-home leaves them),
   and runs them in one vm context with inert registries and a stub DOM: localStorage a plain object the caller can
   read, history and the timers inert, fetch refused. It is the harness the layer's own smokes proved over the whole
   chain through codex53 (the VM gates' chains stop at codex41 by design; this one does not, because the CMS and
   grape views draw strings, and every DOM call they make is answered by the stub).

   Returns { ctx, G, J, tryG, store, files, last }: G(expr) runs an expression in the chain, J(expr) returns its
   value through JSON, tryG(expr) returns null on a throw and keeps the message in last(). A file that fails to
   load throws with its name. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SKIP = ['oot-service.js', 'rewrite-preview.js'];

function chainFiles(jsDir) {
  const index = path.join(jsDir, '..', 'index.html');
  if (!fs.existsSync(index)) throw new Error('no index.html beside ' + jsDir);
  const html = fs.readFileSync(index, 'utf8');
  return [...html.matchAll(/<script\b[^>]*\bsrc=["']js\/([^"'?#]+)(?:[?#][^"']*)?["'][^>]*>\s*<\/script>/g)].map((m) => m[1]).filter((f) => SKIP.indexOf(f) < 0);
}

function stubNode() {
  let NODE;
  NODE = {
    style: {}, dataset: {}, value: '', checked: false, disabled: false, hidden: false, id: '', className: '',
    classList: { add() { }, remove() { }, contains: () => false, toggle() { } },
    children: [], childNodes: [],
    appendChild: (c) => c, insertBefore: (c) => c, removeChild: (c) => c, remove() { }, replaceChildren() { },
    setAttribute() { }, getAttribute: () => null, removeAttribute() { }, hasAttribute: () => false,
    addEventListener() { }, removeEventListener() { }, dispatchEvent: () => true,
    focus() { }, blur() { }, click() { }, scrollIntoView() { },
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 }),
    getClientRects: () => [],
    querySelector: () => NODE, querySelectorAll: () => [],
    closest: () => NODE, contains: () => false, cloneNode: () => NODE, matches: () => false,
    get parentNode() { return NODE; }, get parentElement() { return NODE; },
    get firstChild() { return NODE; }, get firstElementChild() { return NODE; },
    get lastChild() { return null; }, get nextSibling() { return null; }, get nextElementSibling() { return null; },
    get innerHTML() { return ''; }, set innerHTML(v) { },
    get textContent() { return ''; }, set textContent(v) { },
    get innerText() { return ''; }, set innerText(v) { }
  };
  return NODE;
}

function loadChain(jsDir, opts) {
  opts = opts || {};
  const files = chainFiles(jsDir);
  const store = Object.create(null);
  Object.keys(opts.seed || {}).forEach((k) => { store[k] = opts.seed[k]; });
  const NODE = stubNode();
  const stubEl = () => NODE;
  const sandbox = {
    console: { log() { }, warn() { }, error() { }, info() { } },
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      key: (i) => Object.keys(store)[i] || null,
      get length() { return Object.keys(store).length; }
    },
    location: { href: 'http://localhost/', search: '', hash: '', pathname: '/' },
    navigator: { userAgent: 'node', onLine: true },
    setTimeout: () => 0, clearTimeout() { }, setInterval: () => 0, clearInterval() { },
    matchMedia: () => ({ matches: false, addEventListener() { }, addListener() { } }),
    requestAnimationFrame: () => 0,
    alert() { }, confirm: () => false, prompt: () => null,
    fetch: () => Promise.reject(new Error('no network in this sandbox')),
    scrollTo() { }, scrollBy() { }, getComputedStyle: () => ({ getPropertyValue: () => '' }),
    innerWidth: 1024, innerHeight: 768, devicePixelRatio: 1, scrollY: 0,
    addEventListener() { }, removeEventListener() { },
    history: { pushState() { }, replaceState() { }, back() { }, length: 1, state: null },
    speechSynthesis: undefined, Notification: undefined,
    performance: { now: () => 0 },
    URL: globalThis.URL, Blob: globalThis.Blob, TextEncoder: globalThis.TextEncoder,
    Intl: globalThis.Intl, Date: globalThis.Date, Math: globalThis.Math, JSON: globalThis.JSON,
    Promise: globalThis.Promise, IntersectionObserver: undefined
  };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.document = {
    documentElement: stubEl(), head: stubEl(), body: stubEl(),
    createElement: stubEl, createDocumentFragment: stubEl, createTextNode: () => stubEl(),
    getElementById: stubEl, querySelector: stubEl, querySelectorAll: () => [],
    addEventListener() { }, removeEventListener() { },
    readyState: 'complete', title: '', hidden: false,
    get activeElement() { return null; }
  };
  sandbox.sessionStorage = { getItem: () => null, setItem() { }, removeItem() { } };
  const ctx = vm.createContext(sandbox);
  for (const f of files) {
    const p = path.join(jsDir, f);
    if (!fs.existsSync(p)) throw new Error('index.html loads js/' + f + ', which is not in ' + jsDir);
    try { vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f }); }
    catch (e) { throw new Error('js/' + f + ' failed to load in the sandbox: ' + e.message); }
  }
  let last = '';
  const G = (expr) => vm.runInContext(expr, ctx);
  const tryG = (expr) => { try { return G(expr); } catch (e) { last = e.message; return null; } };
  const J = (expr) => { const s = tryG('JSON.stringify(' + expr + ')'); try { return s == null ? null : JSON.parse(s); } catch (e) { return null; } };
  return { ctx, G, J, tryG, store, files, last: () => last };
}

/* An HTML string drawn clean: long enough, no undefined, NaN, [object Object] or a bare null, and its block tags balanced. */
const BAD = /undefined|NaN|\[object Object\]|null<|>null|"null"/;
const TAGS = ['div', 'section', 'details', 'table', 'ul', 'dl', 'fieldset', 'form', 'label'];
function tagBalance(s, t) { return (s.match(new RegExp('<' + t + '\\b', 'g')) || []).length - (s.match(new RegExp('</' + t + '>', 'g')) || []).length; }
function cleanProblem(html) {
  if (typeof html !== 'string') return 'not a string';
  if (html.length < 100) return 'only ' + html.length + ' characters';
  const bad = html.match(/.{0,50}(undefined|NaN|\[object Object\]|null<|>null|"null").{0,30}/);
  if (bad) return 'draws ' + JSON.stringify(bad[0]);
  const off = TAGS.filter((t) => tagBalance(html, t) !== 0);
  return off.length ? 'unbalanced ' + off.map((t) => t + ' ' + tagBalance(html, t)).join(', ') : '';
}

/* The voice of what the layer draws: no dash of any kind, never the retired word once the tab word Practise is taken
   out, no level by numeral, no star mark. */
const DASH_RE = new RegExp('[' + String.fromCharCode(0x2012) + '-' + String.fromCharCode(0x2015) + ']|&(mdash|ndash|#8212|#8211|#x2014|#x2013);|(^|\\s)-{2,}(\\s|$)', 'i');
const STAR_RE = new RegExp(String.fromCharCode(0x2605));
function drawnVoiceProblem(html) {
  const s = String(html || '');
  if (DASH_RE.test(s)) return 'a dash';
  if (/practi[cs]e/i.test(s.replace(/\bPractise\b/g, '').replace(/(["'#\/-])practise\b/g, '$1'))) return 'the retired word';
  if (/\bLevel\s+(I|II|III|IV|[1-4])\b/.test(s)) return 'a numbered level';
  if (STAR_RE.test(s)) return 'a star mark';
  return '';
}

module.exports = { loadChain, chainFiles, cleanProblem, drawnVoiceProblem, tagBalance };
