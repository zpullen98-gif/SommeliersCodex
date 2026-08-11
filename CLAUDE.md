# The Sommelier's Codex — PWA

Installable, offline-first study app covering **all four CMS levels** —
Introductory, Certified, Advanced, Master — in one install. Vanilla JS, no
frameworks, no build step. Split from the single-file
`Downloads/cms-certified-practice-exam_22_1.html` into this project (Aug 2026),
then extended with the Intro import and authored Advanced/Master banks.

## Run it

```bash
py serve.py 8632
```

Then open http://localhost:8632. Use `serve.py` (not `python -m http.server`) — it sends
`Cache-Control: no-cache` so edits show up on reload.

## Architecture

- `index.html` — shell + script tags. **Load order matters**: classic scripts share one
  global scope and later files monkey-patch earlier ones (`var _origRender=render; render=function(){...}`).
  Asset URLs carry `?v=N`.
- `js/data-questions.js` — QUESTIONS (1,283 across 36 categories; mc / sa / mt / sel formats)
- `js/reference.js` — TERROIR atlas, PRODUCERS codex, GRAPES flashcard data + their views
- `js/core.js` — state `S`, quiz engine, mock/drill/endless/review, `render()`, `el()`, `topbar()`
- `js/codex2.js` — stats `ST` (localStorage `codexStats`), adaptive weakness mode, lightning,
  sudden death, flags, dashboard, encyclopedia
- `js/codex3.js` — SM-2-lite SRS + daily review, exam simulations, achievements, matching/select formats
- `js/codex4.js` — session history, notes, keyboard map, export/import merge, trend chart
- `js/codex5.js` — VIDEOS data + Video Scriptorium (curated YouTube searches per topic)
- `js/data-primers.js` — PRIMERS: 36 written study chapters (lead / exam focus / facts / traps)
- `js/codex6.js` — Codex VI layer: Deductive Tasting (grid reference + blind flights from GRAPES),
  Study Primers views, Service Ritual rehearsal checklist; wires new home tiles + routing
- `js/data-intro.js` — INTRO_QUESTIONS (1,778, own 31-cat taxonomy), INTRO_GRAPES (53),
  INTRO_ATLAS / INTRO_CLASS / INTRO_CLASS_TRAPQ / INTRO_WINE / INTRO_SOIL / INTRO_DESS, INTRO_GROUPS
- `js/data-primers-intro.js` — INTRO_PRIMERS: 39 HTML-body chapters `{g,id,t,body}`
- `js/data-grapes-plus.js` — GRAPES_PLUS: 24 extra profiles for Advanced/Master flights (47 total)
- `js/data-advanced.js` / `js/data-master.js` — ADV_QUESTIONS (489, SA-heavy), MASTER_QUESTIONS
  (391, all oral-style SA); both on the Certified 36-category taxonomy
- `js/data-primers-advanced.js` / `js/data-primers-master.js` — ADV_PRIMERS / MASTER_PRIMERS, 36 each
- `js/codex7.js` — **the level engine**: LEVELS registry, `applyLevel()`, key namespacing,
  Court Standing strip, Oral Gauntlet, Master origin call, Intro Compendium
- `js/codex8.js` — **the study coach**, in four parts: honest short-answer grading,
  the exam-date study plan, spoken oral mode, and the actionable dashboard + content report
- `js/codex9.js` — **list-aware short-answer grading**: enumeration questions are graded
  item by item instead of on first accept-hit
- `js/boot.js` — final `render()` (layers decorate home after core's first render), SW registration,
  update toast
- `sw.js` — cache-first service worker, explicit precache list

## The four-level engine (codex7.js)

Levels switch by **rebinding data globals** — every earlier layer resolves
`QUESTIONS/GRAPES/PRIMERS/DRILL_GROUPS/MOCK_N/qKey` at call time, so no earlier layer needed
editing. `LEVELS = {intro, certified, advanced, master}`; active level in `localStorage.codexLevel`.

- **Stats namespacing**: `qKey` is reassigned to prefix non-certified levels (`intro|…`). Certified
  keys stay **unprefixed** so pre-existing progress survives. `ST.days/best/hist/ach/tast` are
  deliberately court-wide; `ST.court[level] = {best, passed}` drives the pin strip.
- **Known hazards handled** (don't undo these): codex3's `startMock` wrapper hard-codes 45/38min
  when `S._simN` is falsy — codex7 sets `S._simN` before calling through, and **replaces** `startSim`.
  codex3's `finish` sets `ST.best.passed` on any ≥45Q mock — codex7's outer `finish` snapshots and
  restores it for non-certified levels. `achCheck` is gated to certified only.
- **`applyLevel()` resets** timers, `S.mode/pool/idx/results/section/suddenDead/_simN`, the mt/sel
  caches, `S.fc` (must be **null**, not `{}`), `S.tt`, `S.cmp`, `MISS`, `document.onkeydown`.
- **Mocks**: Intro 70Q/45min · Certified 45Q/38min · Advanced 60Q/35min · Master = `startGauntlet()`,
  a 50-minute all-short-answer run flagged `S._oral`.
- **Primers**: Intro chapters are HTML-body (`p.body`); codex7 wraps `primerList`/`primerView` to
  branch. Advanced/Master use the native `{cat,lead,exam,facts,traps}` format.
- **New grape profiles** must ship all 8 fields (`g,c,st,fruit,other,tell,regions,confuse`) with
  `st` segments `·`-separated — `ttSplit`/`TT_COLORS` in codex6 parse them, and codex7's origin
  call reads the first phrase of `regions`.

## The study coach (codex8.js)

- **Grading**: `saCoverage()` scores the candidate's text against the model answer's distinctive
  vocabulary. Below `SA_UNSURE` (0.35) the grader keeps its ✗; above it the verdict becomes
  "the grader is unsure" and self-grade is promoted. `R`/`W` grade in one keystroke. Every
  override lands in `ST.grader` and surfaces in the Content Report — **these are the accept
  lists that need widening.** Only true short answer is touched (`saTrueSA` excludes mt/sel).
- **Study plan**: `ST.exam[level]` holds an ISO date; `studyPlan()` returns a prioritized
  prescription from SRS due count, weakest section, coverage and 7-day pace. Home shows the
  top action; `S.view='plan'` shows all of it plus the pace verdict.
- **Oral mode**: gauntlet only (`oralActive()` requires `S._oral`). `speechSynthesis` reads the
  prompt, the text field becomes a reveal button, space reveals, and the grade is mandatory
  before advancing. `ST.oralVoice` persists the toggle. All exits call `speakStop()`.
- **Content report**: `ST.bad` holds per-question error reports (flag lives in every reveal).
  `S.view='disputes'` shows grader disagreements and reported errors together — the surface
  to export when fixing content.
- **`mergeStats` is wrapped** so `grader`, `bad`, `exam`, `court`, `tast` and `paceDays` survive an
  export/import round trip; codex4's original merge predates all six.
- **Pace is per level** (`ST.paceDays[level][date]`, written by a `statRecord` wrapper and pruned
  at 30 days) because the plan's target is per level. `ST.days` stays court-wide — it drives the
  streak. Don't merge the two.
- **The Content Report is deliberately court-wide.** Content problems belong to the Codex, not to
  the level you happen to be studying, so `graderDisputes()`/`badReports()` resolve keys against
  every bank via `keyLevel()`/`findByKey()` and tag each entry with its level.

## Update discipline (deploying a change)

1. Edit files.
2. Bump `?v=N` on the changed files' URLs in `index.html` (any new number).
3. **Bump `CACHE` in `sw.js`** (currently `codex-v27`). This is the whole update
   mechanism — installed clients show a "new edition is pressed" toast, tap to refresh.
4. If you add a file, add it to `ASSETS` in `sw.js` AND a `<script>`/`<link>` tag.

## Dev gotchas (hard-won, shared with BartendersLedger)

- **Stale caches**: `?nosw` in the URL skips SW registration. The SW precaches with
  `cache:'reload'` requests so it never snapshots the browser's stale HTTP cache.
- **bfcache**: navigating to an already-visited URL can restore the old JS heap without
  re-executing scripts. When testing, use a unique query string (`?fresh=anything`).
- **Progress data**: localStorage key `codexStats` (`ST`): `q{c,w,s}`, `days`, `best`,
  `flags[]`, `srs{ef,iv,n,due}`, `ach[]`, `hist[]`, `notes{}`, `tast{n,c}`. Question identity
  is `missKey(q)` = the question's minted `id` (`c-`/`i-`/`a-`/`m-` + 8 base36 chars), falling
  back to the first 80 chars of the stem only for an object that predates minting. **Question
  text is therefore safe to edit.** Ids are frozen at mint time and never recomputed — mint new
  ones with the additive generator, never regenerate existing ones. All schema changes must be
  additive, and any new store must be registered in `ST_DEFAULTS` (codex8) or reset drops it.
- **Migrating from the old single file**: progress lives per-origin. Use the app's
  Progress Transfer view (export from the old file, import here) — imports merge.
- **Layer discipline**: new features go in a new `codex11.js` that wraps `render`/`decorateHome`
  like its predecessors. Don't edit earlier layers except for bugs.
- **Adding a level or bank**: append questions to the level's data file, then mint ids for the
  new entries (the generator skips any object that already has one) and confirm in console that
  category names match the level's `groups`, or the drill/dashboard rows silently vanish. Run
  `qidAudit()` afterwards: it reports missing ids, duplicate ids, and stored keys that no longer
  resolve to a question.

## Fonts & icons

Self-hosted woff2 (Cinzel, Cinzel Decorative, EB Garamond; latin + latin-ext) in `fonts/`,
declared at the top of `css/codex.css`. The CSS base mentions Fraunces/Archivo but the
illuminated-theme overrides supersede them — Georgia fallback covers the rest; don't add fonts.

`icons/icon.svg` is the master. Regenerate PNGs with `@resvg/resvg-js`
(scratch script: render 512/192/180 + maskable at 80% on the dark felt).
Gotcha: gradients on zero-width strokes vanish in resvg — use filled rects for straight lines.

## Interface rule: typography, not pictures

The UI carries **no pictorial icons** — no emoji, dingbats, fleurons or emblems. Hierarchy is
made with type, rule and space. This is deliberate; do not reintroduce them.

- Removed in Codex IX: all `.mode .ic` tile icons, `.medal .mic`, `.vplay` discs, service-ritual
  and compendium section icons, country-flag emoji, and every ornamental mark (✦ ⚜ ⚗ ⚑ ⚠ 📍 etc.).
- State that used a glyph now uses a word: bookmark reads **Bookmark / Bookmarked**, the voice
  toggle reads **Voice on / Voice off**, verdicts read **Correct / Incorrect** with no ✓/✗.
- The only non-ASCII marks that remain are typographic or data: `— – ' ' " " … ·`, `→` and `›`
  as directional affordances, `●○` as the grape structure meter, `☐☑` as select-all controls,
  `✓` as the service-checklist tick, and `≈ ≠ ₂ °` inside content.
- Data files still carry `ic`/`flag` fields (INTRO_ATLAS, INTRO_CLASS, INTRO_WINE, SERVICE…).
  They are simply **not rendered** — don't re-add them to the templates.
- Guard when editing: run the sweep that walks every view at every level and reports any
  codepoint above U+2000 outside the keep-set. It caught leftovers three times.

## Contrast rule (learned the hard way)

Controls rendered **inside `.card`** sit on parchment; controls on a view body sit on the dark
page. The palette tokens are not interchangeable:

- On parchment use `--ink`, `--ink-soft`, `--claret`. On the dark page use `--parch`,
  `--gold-soft`, `--gold`.
- `--gold-soft` on parchment measures ~1.2:1 — invisible. `.notetoggle`, `.watchlink` and
  `.notesaved` shipped that way for several layers before a contrast sweep caught it.
- `.btn.ghost` defaults to the dark-page colours; `.card .btn.ghost` is the parchment variant.
- Verify with the compositing contrast sweep (walks every view, composites alpha layers and
  reads the first gradient stop). A naive `backgroundColor` walk gives ~100 false positives
  because the cards use gradients and the buttons use translucent fills.

## Oral mode gotcha

`S._oral` is intentionally **not** cleared by `finish()` — the results view reads it to frame the
Gauntlet tally. It therefore leaks past the run, so `oralActive()` also requires
`S.mode==='mock'`, and `home()` clears the flag. Without both, the next Master drill opens with
no typing field.

## List grading (codex9.js)

`matchSA` awards full marks on the first accept-hit, so "Name all nine grands crus of
Gevrey-Chambertin" scored 100% for typing "Clos de Bèze" — and under the Advanced clock the
score-optimal move became typing the shortest accepted token, the exact habit that loses marks
on the real paper. codex9 grades enumerations per item.

- **Detection is precision-first and data-derived**: the stem must state a count
  (`listParseNeed`) *and* the model answer must parse into at least that many discrete items
  (`listParseItems`). Anything else falls through to `matchSA` untouched. Currently 78 questions
  qualify (35 certified, 27 advanced, 16 master); Intro is all multiple choice so none.
- A question may declare the shape outright: `{list:1, items:[...], need:n}` — prefer this when
  authoring new enumerations rather than relying on the parser.
- **Grading splits the candidate's text on delimiters first.** `norm()` strips punctuation, so
  "Chambertin, Clos de Bèze" would otherwise read as the single cru Chambertin-Clos de Bèze.
  Two passes: exact matches claim their entry first, loose containment second, each typed entry
  spent only once.
- `spec` is cached on the question as a non-enumerable `_ls` so it never reaches the export.
- **Regression bar**: the author's own `ans` must score full marks on every detected question.
  The offline harness in the scratchpad checks this — it was 80/80. Re-run it after editing any
  `ans` field in a detected question.
- Rejected by design: compound asks ("name three X **and one** Y"), answers containing a colon
  (definitions), items over 40 chars or 6 words, and any stem whose count exceeds the item count
  (that combination is a content bug, not a list — it surfaced one, since fixed).
