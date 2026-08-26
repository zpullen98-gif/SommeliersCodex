/* ============ Codex XIV: the home screen, given a shape ============
   Twenty-one tiles arrived on the home screen in one flat grid, because eleven
   layers each appended their own to `.modes` without any of them knowing what
   the others had added. Everything sat at equal weight: the Mock Exam beside
   Progress Transfer, the Service Ritual beside Hall of Fame. A student opening
   the app had to read all twenty-one to find the one thing they came for.

   This layer changes no tile and no handler. It runs last in the decorateHome
   chain, collects whatever the other layers produced, and re-parents the actual
   button nodes into four named sections. Re-parenting rather than cloning is
   the whole trick: appendChild moves a node and its listeners intact, so every
   onclick every other layer bound keeps working without being touched.

   A tile this file has never heard of still appears. Unknown ids fall into the
   last section rather than vanishing, so a future layer that adds a tile gets a
   home for it whether or not anyone remembers to edit this list.
   ============ */

var HOME_SECTIONS = [
  ['Today', 'What the Codex has set for you now',
    ['t-daily']],
  ['Examination', 'Sit the paper as the Court sets it',
    ['m-mock', 't-sim', 't-tast', 't-svc', 't-light', 't-sudden']],
  ['Practice', 'Drill what is weak until it is not',
    ['m-drill', 'm-endless', 't-weak', 't-flag']],
  ['Study', 'Read first, then drill what you read',
    ['t-prim', 'm-terroir', 'm-flash', 'm-prod', 't-compendium', 't-ency', 't-vid', 't-cellar']],
  ['Record', 'What you have done, and where it lives',
    ['t-dash', 't-hall', 't-sync']]
];

function organiseHome() {
  var grids = document.querySelectorAll('.modes');
  if (!grids.length || document.querySelector('.homesec')) return;

  /* Collect every tile currently on the page, keyed by id. */
  var tiles = {}, order = [];
  Array.prototype.forEach.call(grids, function (g) {
    Array.prototype.forEach.call(g.querySelectorAll('.mode'), function (b) {
      var key = b.id || ('anon-' + order.length);
      if (!tiles[key]) { tiles[key] = b; order.push(key); }
    });
  });
  if (order.length < 2) return;

  var host = grids[0].parentNode;
  var anchor = grids[0];
  var placed = {};

  var frag = document.createDocumentFragment();
  HOME_SECTIONS.forEach(function (sec) {
    var name = sec[0], blurb = sec[1], ids = sec[2];
    var mine = ids.filter(function (id) { return tiles[id]; });
    if (!mine.length) return;

    var wrap = el('<section class="homesec"></section>');
    wrap.appendChild(el('<div class="homesec-head"><h3>' + name +
      '</h3><span>' + blurb + '</span></div>'));
    var grid = el('<div class="modes homesec-grid"></div>');
    mine.forEach(function (id) {
      grid.appendChild(tiles[id]);   /* moves the node, listeners and all */
      placed[id] = 1;
    });
    wrap.appendChild(grid);
    frag.appendChild(wrap);
  });

  /* Anything this file does not know about still gets a home. */
  var strays = order.filter(function (id) { return !placed[id]; });
  if (strays.length) {
    var wrap = el('<section class="homesec"></section>');
    wrap.appendChild(el('<div class="homesec-head"><h3>More</h3>' +
      '<span>Everything else the Codex holds</span></div>'));
    var grid = el('<div class="modes homesec-grid"></div>');
    strays.forEach(function (id) { grid.appendChild(tiles[id]); });
    wrap.appendChild(grid);
    frag.appendChild(wrap);
  }

  host.insertBefore(frag, anchor);

  /* The old containers are empty now; remove them so the spacing is honest. */
  Array.prototype.forEach.call(document.querySelectorAll('.modes'), function (g) {
    if (!g.classList.contains('homesec-grid') && !g.querySelector('.mode')) {
      if (g.parentNode) g.parentNode.removeChild(g);
    }
  });
}

var _v14DecorateHome = decorateHome;
decorateHome = function () {
  _v14DecorateHome();
  try { organiseHome(); } catch (e) { /* a broken shell must never hide the tiles */ }
};

(function () {
  var css = document.createElement('style');
  css.textContent = [
    '.homesec{margin:26px 0 0}',
    '.homesec-head{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;',
    '  margin:0 0 10px;padding-bottom:7px;border-bottom:1px solid rgba(255,255,255,.10)}',
    '.homesec-head h3{margin:0;font-size:.78rem;letter-spacing:.20em;text-transform:uppercase;',
    '  font-weight:600;opacity:.95}',
    '.homesec-head span{font-size:.82rem;opacity:.52;font-style:italic}',
    '.homesec-grid{margin-top:0!important}',
    /* Today is the one call to action, so it is allowed to be wider. */
    '.homesec:first-of-type .homesec-grid .mode{grid-column:1/-1}',
    '@media(prefers-reduced-motion:no-preference){',
    '  .homesec{animation:homesecIn .4s ease both}',
    '  .homesec:nth-of-type(2){animation-delay:.04s}',
    '  .homesec:nth-of-type(3){animation-delay:.08s}',
    '  .homesec:nth-of-type(4){animation-delay:.12s}',
    '  .homesec:nth-of-type(5){animation-delay:.16s}',
    '}',
    '@keyframes homesecIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}'
  ].join('\n');
  document.head.appendChild(css);
})();
