/* No-network UI contract checks. The small DOM below exercises emitted markup,
   handlers and state changes; browser layout/focus containment require visual QA.
   node .scripts/check-atlas-ui.js [Codex root] */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ROOT = path.resolve(process.argv[2] || path.join(__dirname, '..'));
let checks = 0;
function check(name, value) { assert.ok(value, name); checks++; }
const decode = (s) => String(s).replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
const closedEvents = [];
let document;
class Node {
  constructor(tag = 'div', attrs = {}) {
    this.tagName = tag.toUpperCase(); this.attrs = attrs; this.children = []; this.parentNode = null;
    this.style = {}; this.listeners = {}; this.disabled = false; this.hidden = 'hidden' in attrs;
    this.scrollTop = this.scrollLeft = 0; this.clientWidth = 960; this.clientHeight = 540;
    this.complete = false; this.naturalWidth = 1200; this.open = false; this._text = '';
    this.classList = { contains: (v) => this.className.split(/\s+/).includes(v), add: (v) => { this.className += ' ' + v; },
      remove: (v) => { this.className = this.className.split(/\s+/).filter((s) => s !== v).join(' '); },
      toggle: (v, on) => on ? this.classList.add(v) : this.classList.remove(v) };
  }
  get className() { return this.attrs.class || ''; } set className(v) { this.attrs.class = v; }
  get isConnected() { return this === document.body || !!this.parentNode?.isConnected; }
  get nextSibling() { return this.parentNode?.children[this.parentNode.children.indexOf(this) + 1] || null; }
  setAttribute(k, v) { this.attrs[k] = String(v); } getAttribute(k) { return this.attrs[k] ?? null; }
  appendChild(n) { n.parentNode = this; this.children.push(n); return n; }
  removeChild(n) { this.children.splice(this.children.indexOf(n), 1); n.parentNode = null; return n; }
  insertBefore(n, ref) { n.parentNode = this; const at = this.children.indexOf(ref); this.children.splice(at < 0 ? this.children.length : at, 0, n); return n; }
  set innerHTML(html) {
    this.children = []; this._html = html; this._text = '';
    const stack = [this], voids = new Set(['img', 'input', 'br']);
    for (const token of html.match(/<[^>]*>|[^<]+/g) || []) {
      if (token.startsWith('</')) { stack.pop(); continue; }
      if (token.startsWith('<')) {
        const m = /^<([\w-]+)([^>]*)>$/.exec(token); if (!m) continue;
        const attrs = {}; for (const a of m[2].matchAll(/([\w-]+)(?:="([^"]*)")?/g)) attrs[a[1]] = decode(a[2] || '');
        const n = new Node(m[1], attrs); stack[stack.length - 1].appendChild(n); if (!voids.has(m[1])) stack.push(n);
      } else stack[stack.length - 1]._text += decode(token);
    }
  }
  get innerHTML() { return this._html || ''; }
  get textContent() { return this._text + this.children.map((n) => n.textContent).join(''); }
  set textContent(v) { this.children = []; this._text = String(v); }
  matches(selector) {
    if (selector.includes(',')) return selector.split(',').some((part) => this.matches(part.trim()));
    if (selector.includes(':not([hidden])')) { if (this.hidden) return false; selector = selector.replace(':not([hidden])', ''); }
    if (selector === '[hidden]') return this.hidden;
    if (selector[0] === '#') return this.attrs.id === selector.slice(1);
    if (selector[0] === '.') return this.classList.contains(selector.slice(1));
    const a = /^\[([\w-]+)(?:="([^"]*)")?\]$/.exec(selector);
    if (a) return a[2] === undefined ? a[1] in this.attrs : this.attrs[a[1]] === a[2];
    return this.tagName.toLowerCase() === selector;
  }
  querySelectorAll(selector) { const out = []; for (const n of this.children) { if (n.matches(selector)) out.push(n); out.push(...n.querySelectorAll(selector)); } return out; }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  fire(type, props = {}) { const e = { target: this, stopPropagation() { this.stopped = true; }, preventDefault() { this.prevented = true; }, ...props }; for (const fn of this.listeners[type] || []) fn(e); return e; }
  focus() { document.activeElement = this; }
  showModal() { this.open = true; this.querySelector('[autofocus]')?.focus(); }
  close() { this.open = false; closedEvents.push(() => this.fire('close')); }
  getBoundingClientRect() { return { left: 0, top: 0, width: this.clientWidth, height: this.clientHeight }; }
  getClientRects() { for (let n = this; n; n = n.parentNode) if (n.hidden) return []; return this.isConnected ? [this.getBoundingClientRect()] : []; }
  setPointerCapture() {}
}
document = { body: new Node('body'), activeElement: null, createElement: (t) => new Node(t),
  querySelector: (s) => document.body.querySelector(s), querySelectorAll: (s) => document.body.querySelectorAll(s),
  getElementById: (id) => document.body.querySelector('#' + id) };
const events = {}, announcements = [], drills = [], chapters = [];
const ctx = { console, document, URL, location: { href: 'https://example.test/codex/' },
  V23: { stored: {}, have: [], busy: '', lastMessage: '' }, S: { view: 'worldmap', wmap: null }, activeLevel: 'certified',
  addEventListener: (type, fn) => { (events[type] ||= []).push(fn); }, removeEventListener() {},
  v23Esc: (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'),
  say: (s) => announcements.push(s), v23HaveCaches: () => true,
  v23StoreAll: () => {}, v23Forget: () => {},
  cats: () => ctx.QUESTIONS.reduce((m, q) => { m[q.cat] = (m[q.cat] || 0) + 1; return m; }, {}),
  v25HasChapter: (cat) => !!ctx.cats()[cat], v25OpenChapter: (cat) => chapters.push(cat), startDrill: (cat) => drills.push(cat),
  el: (html) => { const holder = new Node(); holder.innerHTML = html; const node = holder.children[0]; holder.removeChild(node); return node; }
};
ctx.window = ctx;
ctx.render = function () {
  document.body.innerHTML = '';
  if (ctx.S.view === 'worldmap') document.body.appendChild(ctx.worldMapView());
  else document.body.appendChild(ctx.el('<div><div class="fcstage"><div id="fcard"></div></div><button id="grade">Got it</button></div>'));
};
vm.createContext(ctx);
for (const file of ['reference.js', 'data-questions.js', 'data-intro.js', 'data-advanced.js', 'data-master.js', 'data-maps.js', 'data-atlas-v2.js', 'codex31.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', file), 'utf8'), ctx, { filename: file });
}
ctx.mapFile = (id) => ctx.ATLAS_V2.sheets[id].file;
const original = JSON.stringify(ctx.MAP_SHEETS.map((s) => ctx.mapRegions(s.id)));
ctx.render();
check('all seventeen maps are discoverable without cached artwork', document.querySelectorAll('.v31-map-card').length === 17);
check('source bibliography is linked from gallery', document.querySelector('[href="atlas-sources.html"]'));
const france = document.querySelector('[data-map="france"]');
const gallery = document.querySelector('.v31-atlas');
ctx.v31Filter(gallery, 'Rioja');
check('region search keeps its country visible', !document.querySelector('[data-map="spain"]').hidden && france.hidden);
ctx.v31Filter(gallery, 'no such region');
check('empty search keeps a clear recovery message', !document.querySelector('.v31-empty').hidden);
ctx.v31Filter(gallery, '');
france.querySelector('img').fire('error');
check('gallery image failure preserves guide navigation', france.querySelector('img').hidden && !france.disabled && !france.querySelector('.v31-image-fail').hidden);
let regions = 0, courses = 0, orphans = 0;
for (const sheet of ctx.MAP_SHEETS) {
  ctx.S.wmap = sheet.id; ctx.render();
  const data = ctx.ATLAS_V2.sheets[sheet.id], rows = ctx.mapRegions(sheet.id);
  regions += document.querySelector('.v31-regions').children.length;
  courses += document.querySelectorAll('.v31-course-row').length;
  orphans += document.querySelector('.v31-beyond')?.querySelectorAll('.v31-course-row').length || 0;
  check(sheet.id + ': exact reviewed guide rows', document.querySelector('.v31-regions').children.length === data.regions.length);
  check(sheet.id + ': original course entries retained', document.querySelectorAll('.v31-course-row').length === rows.length);
  check(sheet.id + ': bibliography section link', document.querySelector('[href="atlas-sources.html#' + sheet.id + '"]'));
  check(sheet.id + ': exact cited links', data.sources.every((s) => document.querySelector('[href="' + s.url + '"]')));
}
check('all 115 mapped rows and 117 original records retained', regions === 115 && courses === 117 && orphans === 2);
ctx.S.wmap = 'new-york'; ctx.render();
check('Virginia and Texas are explicitly beyond New York', /Virginia/.test(document.querySelector('.v31-beyond').textContent) && /Texas/.test(document.querySelector('.v31-beyond').textContent));
const dummy = { n: 'Example', notes: ['bad inherited note'], g: 'original', soil: 'soil', climate: '' };
const corrected = ctx.v31CourseRow(dummy, { regions: [{ name: 'Example', studyNotes: { g: 'reviewed', notes: [] } }] });
check('reviewed empty notes replace inherited notes', corrected.g === 'reviewed' && corrected.notes.length === 0 && dummy.notes.length === 1);
const certified = ctx.QUESTIONS;
for (const [level, questions] of [['intro', ctx.INTRO_QUESTIONS], ['certified', certified], ['advanced', ctx.ADV_QUESTIONS], ['master', ctx.MASTER_QUESTIONS]]) {
  ctx.activeLevel = level; ctx.QUESTIONS = questions;
  for (const sheet of ctx.MAP_SHEETS) {
    ctx.S.wmap = sheet.id; ctx.render();
    const buttons = document.querySelectorAll('[data-atlas-drill]');
    check(level + '/' + sheet.id + ': no dead drill category', buttons.every((b) => ctx.cats()[b.getAttribute('data-atlas-drill')]));
    for (const b of buttons) { b.onclick(); check('drill handler receives exact category', drills.at(-1) === b.getAttribute('data-atlas-drill')); }
  }
}
ctx.activeLevel = 'intro'; ctx.QUESTIONS = ctx.INTRO_QUESTIONS;
check('intro Italian and US sheets use explicit level categories', ctx.v31Section('italy', 'Northern Italy') === 'Italy' && ctx.v31Section('oregon', 'Pacific NW, NY & Canada') === 'United States');
const grapeIndex = ctx.GRAPES.findIndex((g) => g.g === 'Cabernet Sauvignon');
ctx.S.view = 'flash'; ctx.S.fc = { flip: false, deck: [grapeIndex, 1, 2], done: 0, again: 0, total: 3 };
ctx.render(); check('unrevealed card receives no map hint', !document.querySelector('.v31-flash-maps'));
ctx.S.fc.flip = true; ctx.render();
const helper = document.querySelector('.v31-flash-maps'); check('revealed exact named profile gets map helper', helper);
const before = JSON.stringify(ctx.S.fc), open = helper.querySelector('[data-flash-map]'); open.focus();
document.body.style.overflow = 'auto'; open.onclick();
const firstDialog = ctx.V31.viewer.node;
check('native modal opens with accessible title and controls', firstDialog.open && firstDialog.getAttribute('aria-labelledby') === 'atlas-viewer-title' && firstDialog.querySelectorAll('[data-viewer]').length === 4);
const closeButton = firstDialog.querySelector('[data-viewer="close"]'), keySummary = firstDialog.querySelector('summary');
keySummary.focus(); const forwardTab = firstDialog.fire('keydown', { key: 'Tab', target: keySummary });
check('last visible modal control wraps Tab to Close map', forwardTab.prevented && document.activeElement === closeButton);
const reverseTab = firstDialog.fire('keydown', { key: 'Tab', shiftKey: true, target: closeButton });
check('first modal control wraps Shift+Tab to region key', reverseTab.prevented && document.activeElement === keySummary);
keySummary.hidden = true; firstDialog.querySelector('.v31-canvas').focus(); firstDialog.fire('keydown', { key: 'Tab', target: firstDialog.querySelector('.v31-canvas') });
check('focus wrap excludes hidden controls', document.activeElement === closeButton); keySummary.hidden = false;
firstDialog.querySelector('[data-viewer="in"]').onclick();
check('zoom increases actual artwork dimensions', parseFloat(firstDialog.querySelector('img').style.width) > 432);
const event = firstDialog.fire('keydown', { key: '1' }); check('map key events do not reach flashcard shortcuts', event.stopped);
firstDialog.querySelector('[data-viewer="close"]').onclick();
check('close immediately restores focus and body scrolling', document.activeElement === open && document.body.style.overflow === 'auto' && !ctx.V31.viewer);
open.onclick(); const second = ctx.V31.viewer.node;
closedEvents.splice(0).forEach((fn) => fn());
check('delayed prior close cannot close/re-focus the new viewer', ctx.V31.viewer.node === second && document.body.style.overflow === 'hidden');
second.querySelector('img').fire('error');
check('image failure keeps readable key and disables zoom', !second.querySelector('.v31-viewer-fail').hidden && second.querySelector('[data-viewer="in"]').disabled && second.querySelector('.v31-viewer-key'));
ctx.V31.viewer.close(); closedEvents.splice(0).forEach((fn) => fn());
check('map reading never grades or reorders the card', JSON.stringify(ctx.S.fc) === before);
check('all original map/course data remain unchanged', JSON.stringify(ctx.MAP_SHEETS.map((s) => ctx.mapRegions(s.id))) === original);
console.log(checks + ' atlas UI contract checks passed (mock DOM; no rendered layout assertion).');
