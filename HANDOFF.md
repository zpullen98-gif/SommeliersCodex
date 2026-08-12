# The Sommelier's Codex — project handoff

Paste-ready context for a new session. Deeper engineering detail lives in `CLAUDE.md`;
the verified content backlog lives in `CONTENT-FIXES.md`.

---

## What it is

An offline-first installable PWA that trains candidates for all four **Court of Master
Sommeliers** examinations in one app. Vanilla JS, no framework, no build step.

```bash
py C:\Users\zpull\SommeliersCodex\serve.py 8632
```

Use `serve.py`, not `python -m http.server` — it sends `Cache-Control: no-cache` so edits
appear on reload. Launch config name for the preview tool: `sommeliers-codex` (port 8632).

Live at **https://zpullen98-gif.github.io/SommeliersCodex/** (GitHub Pages, deploy-from-branch
on `master` — every push rebuilds). Currently at service-worker cache **`codex-v32`**.
~2.5 MB on disk, ~1.7 MB of JS. Cold load
~2s; a returning user gets DOM-ready in ~53 ms with zero network (everything from the SW).

## Origin

Built from single-file HTML apps the user already had in `~/Downloads` (all still there,
untouched, as archives):

- `cms-certified-practice-exam_22_1.html` → split into this project's layer stack
- `cms-intro-practice-exam.html` → the 1,778-question Intro bank + 5 reference compendia
- `cms-intro-study.html` → the 39 Intro study chapters

The **Advanced and Master banks and their 72 chapters were authored by an AI assistant inside
this project.** That distinction matters constantly — see *Content accuracy* below.

## Content inventory

| Rank | Key | Questions | Categories | Format mix |
|---|---|---|---|---|
| I · Page | `intro` | 1,778 | 31 (own taxonomy) | all multiple choice |
| II · Squire | `certified` | 1,283 | 36 | 792 SA · 460 MC · 15 matching · 16 select-all |
| III · Knight | `advanced` | 562 | 36 | 475 SA · 57 MC · 29 matching · 1 select-all |
| IV · Ruler | `master` | 445 | 36 | 445 SA (oral-style prompts) |
| **Total** | **4,068** | | |

Also: 150 study chapters (39/36/36/36), 47 grape profiles (23 + 24 authored), the Intro
Compendium (12 hand-drawn SVG country maps with 98 regions, 12 classification pyramids,
winemaking / soil / dessert references), 91 curated video topics, a 7-part service ritual.

---

## Architecture

### The layer stack

`index.html` loads ~20 classic scripts in a fixed order into one shared global scope. Each
`codexN.js` **monkey-patches the previous layer** by reassigning globals:

```js
var _origRender = render;
render = function(){ /* new views */ _origRender(); };
```

Load order (order is load-bearing):

```
data-questions → reference → core → codex2 → codex3 → codex4 → codex5
→ data-primers → codex6 → data-intro → data-primers-intro → data-grapes-plus
→ data-advanced → data-primers-advanced → data-master → data-primers-master
→ codex7 → codex8 → codex9 → codex10 → codex11 → boot
```

- **core.js** — state `S`, quiz engine, `render()`, `el()`, `topbar()`, `matchSA` fuzzy grader
- **codex2** — stats `ST` (localStorage `codexStats`), dashboard, encyclopedia, weakness /
  lightning / sudden-death modes, bookmark flags
- **codex3** — SM-2-lite SRS + Daily Review, exam simulations, achievements, matching/select cards
- **codex4** — notes, session history, export/import merge, trend chart, keyboard map
- **codex5** — Video Scriptorium (links to YouTube *searches*, deliberately, to avoid link rot)
- **codex6** — deductive tasting flights, study primers, service ritual
- **codex7** — **the level engine** (below)
- **codex8** — the study coach: honest self-grading, exam-date plan, spoken oral mode,
  actionable dashboard, content error reports
- **codex9** — list-aware short-answer grading
- **codex10** — stable question identity: the one-time rekey migration and `qidAudit()`
- **codex11** — honest readiness: per-section standing, and a verdict only where one belongs
- **boot.js** — the final `render()` (layers decorate home *after* core's first render), SW
  registration, update toast

### The level engine (codex7)

Levels switch by **rebinding the data globals** — every earlier layer resolves
`QUESTIONS / GRAPES / PRIMERS / DRILL_GROUPS / MOCK_N / qKey` at call time, so adding four
banks required no edits to any earlier layer. `LEVELS = {intro, certified, advanced, master}`;
the active level persists in `localStorage.codexLevel`.

Mock formats: Page 70Q/45min · Squire 45Q/38min · Knight 60Q/35min · Ruler =
`startGauntlet()`, a 50-minute all-short-answer **Oral Gauntlet** (`speechSynthesis` reads the
prompt aloud, no text field, self-grade mandatory before advancing).

### State

One localStorage key, `codexStats`, holding `ST` with seventeen stores: `q days best flags srs
ach sess hist notes tast court grader bad exam paceDays mig serv`. `ST_DEFAULTS` in codex8 is the
canonical schema — **any new store must be added there** or the reset button will drop it.
(codex10 registers `mig`, codex11 registers `serv`, both by extending `ST_DEFAULTS` at load
rather than editing codex8.)

Six of those stores are keyed by question: `q srs flags notes grader bad`. Nothing else is.

---

## Decisions worth not reversing

1. **Certified stat keys stay unprefixed.** `qKey` prefixes non-certified levels
   (`intro|…`, `advanced|…`) so four banks share one store, but Certified keys are left bare
   so progress predating the level engine still counts. Don't "tidy" this. The minted ids
   contain no `|` for exactly this reason — `keyOwned`/`keyLevel` still read the level off the
   prefix, so a certified key is still "the one without a pipe".

2. **Question ids are frozen, and minting is additive.** `.scripts/mint-ids.py` skips any entry
   that already has an `id`. Never regenerate existing ids: a changed id orphans progress just
   as thoroughly as the stem-slice scheme it replaced. The `--strip` flag is a pre-ship tool
   only. The seed is `json.dumps([cat, q])`, so a first mint is reproducible, but after that
   the value is opaque.

3. **`ST.days` is court-wide; `ST.paceDays` is per level.** The streak counts study anywhere;
   the study plan's "on pace" verdict must be per level or grinding Intro reports you ready
   for Certified. Don't merge them.

4. **The Content Report is deliberately court-wide.** Content problems belong to the Codex,
   not to the level you happen to be studying.

5. **`S._oral` is not cleared by `finish()`** — the results view reads it to frame the
   Gauntlet tally. So `oralActive()` also requires `S.mode==='mock'`, and `home()` clears it.
   Both guards are needed; without them the next Master drill opens with no typing field.

6. **Palette is context-dependent.** Inside `.card` (parchment) use `--ink`, `--ink-soft`,
   `--claret`. On the dark page use `--parch`, `--gold-soft`, `--gold`. `--gold-soft` on
   parchment measures ~1.2:1 and shipped invisible for several layers before a contrast
   sweep caught it. `.btn.ghost` defaults to dark-page colours; `.card .btn.ghost` is the
   parchment variant.

7. **No pictorial icons anywhere.** No emoji, dingbats, fleurons or emblems — hierarchy is
   type, rule and space. State that used a glyph now uses a word (Bookmark/Bookmarked,
   Voice on/Voice off, Correct/Incorrect). Data files still carry `ic`/`flag` fields; they
   are simply not rendered. Don't re-add them to templates.

8. **Deploy discipline.** Bump `?v=N` on changed files in `index.html` **and** bump `CACHE`
   in `sw.js`. That cache string is the entire update mechanism — installed clients get a
   "new edition is pressed" toast. New file ⇒ add to `ASSETS` in `sw.js` *and* a script tag.

9. **Layer discipline.** New features go in a **new** `codex12.js` that wraps
   `render`/`decorateHome`. Only edit earlier layers to fix bugs in them.

10. **Rank names are display copy; the level KEYS are load-bearing.** The ladder reads
    Page / Squire / Knight / Ruler, but the keys are still `intro / certified / advanced /
    master` — `qKey` bakes them into every stored stat key (`advanced|a-kpyi8t6m`), so
    renaming a key orphans progress exactly as the old stem-slice scheme did. Change
    `label` / `short` / `note` freely; never touch a key. The CMS names survive only in
    code comments, where a maintainer needs the mapping.

11. **Possessive apostrophes break single-quoted string literals.** The rank rename put
    "Page's" and "squire's" inside `'…'` in codex3 and codex7 and took the whole layer
    stack down — and because the layers share one global scope, the console blamed
    codex8 and codex11 rather than the file with the typo. Run
    `node .scripts/check-syntax.js` after any bulk edit to the copy.

12. **A verdict is only ever shown for `mock` and `sim`.** Every other mode is practice and
    reports a tally. Weakness Review in particular is *designed* to serve your worst material,
    so stamping a fail on it punishes correct use of the tool. Equally, `EXAM_SECTIONS` says
    the Introductory is theory-only — do not "helpfully" require tasting and service there;
    the Court does not examine them at that level.

---

## Current state

Everything below is built, verified in-browser, and deployed:

- Four levels with a Court Standing strip (roman-numeral pins showing coverage / best mock,
  gilding on a passed mock). The level numeral also sits in the header seal.
- Exam-date **study plan**: enter a date and home shows a prescription — days out, SRS due,
  coverage, per-level pace, and the single highest-priority action.
- **Honest short-answer grading**: coverage-based "the grader is unsure" state for long-form
  answers, one-keystroke `R`/`W` self-grade, every override logged to `ST.grader`.
- **List-aware grading** (codex9): enumerations graded item by item — "5 of 9", with the
  missed crus named. 78 questions currently qualify (35 Certified, 27 Advanced, 16 Master).
- Deductive tasting flights (Master adds an origin call), service ritual checklist, primers,
  encyclopedia, dashboard whose rows drill or open the chapter, content error reporting.
- Accessibility: WCAG AA contrast across every view at every level, all controls labelled,
  no horizontal overflow on mobile.
- **Honest readiness (codex11).** The Master bar is 0.75, not 0.6. A pass/fail verdict is now
  shown only for `mock` and `sim` — practice modes report a tally, and Weakness Review says
  outright that it serves your worst material by design. Mock results name the actual level
  and its actual bar (an Advanced mock used to be judged as "Certified theory … 60%"), the
  Gauntlet carries a self-reported caveat, and every mock says which sections it does *not*
  cover. Readiness reads theory, tasting and service — the Court Standing pin says
  "Theory passed" and only gilds to "Ready" when every examined section clears its bar.
  The Introductory is theory-only, so it is never asked for tasting or service.
- **Stable question identity.** All 4,068 questions carry a minted `id`; `missKey` prefers it
  and keeps the 80-char stem slice only as a legacy fallback. codex10 ships the one-time rekey
  across all six question-keyed stores — non-destructive, so a legacy key with no counterpart
  in the banks stays where it is rather than being dropped. Verified in-browser: rewriting a
  stem now leaves stats, SRS, notes, bookmarks and `findByKey` all intact.

### Recently fixed (don't reintroduce)

- Correct oral answers were being logged as *grader errors*, poisoning the Content Report.
- "Reset all statistics" wiped six stores it didn't know about and crashed `render()`.
- The `W` key cleared state but never re-rendered, so the screen appeared frozen.
- Export/import dropped six newer stores; `mergeStats` is now wrapped to carry them.

---

## What's left, in priority order

Ranked by (impact on actually passing an exam) × feasibility.

1. **Turn the tasting flight the right way round — an evening, then a long project.** It
   currently prints the target grape's own descriptors and asks for a four-way guess, i.e. the
   exam task inverted. Cheap 80%: drive glass count and clock from the level config (Certified
   is two wines, not six), run a real countdown, un-gate the origin call at Advanced, strip the
   ALL-CAPS tells, reveal sight → nose → palate progressively. Full version: an "Open a Bottle"
   mode with a fillable CMS grid, self-graded against a real bottle.

2. **Rebuild the home screen around one prescription — a weekend.** Twenty co-equal tiles,
   ten of them doors to the same bank, because eight layers each appended a row. Always render
   `studyPlan().acts[0]`; collapse into three doors (Today / Drill / Sit an exam) plus a
   reference group. New capability goes *inside* those doors — no new tiles.

3. **Durability — an evening each.** `stSave()` swallows `QuotaExceededError` silently.
   `mergeStats` sums answer counts, so a laptop→phone→laptop round trip double-counts; stamp
   exports with a uuid and refuse re-import of a seen one. (The related *rekey* hazard is
   already closed: codex10 wraps `mergeStats` to rekey an incoming payload before it merges,
   so a progress file exported from a pre-id install still lands. Verified in-browser.)

4. **Service ritual is recognition, not recall — a long project.** One static list at all four
   levels, unscored and unclocked. codex11 now **persists** it (`ST.serv`) so readiness can
   see it, but that is all: it still does not branch per level, is not timed, and ticking a
   box is not evidence you can pour. Remaining: branch per level, add a clock, and make it
   cost something to claim.

5. **Two content projects.** `data-vintages.js` (region × year, the Advanced level note
   promises vintages and the bank has none), and sub-region datasets for the atlas renderer —
   which is genuinely good cartography currently locked behind `activeLevel==='intro'`.

### Explicitly do not do

Don't rewrite the wrapper architecture — a view/tile registry is worth doing *when you write
codex12*, not as its own project. Don't touch: the LEVELS engine and `applyLevel`, the SRS
scheduler, `stratMock`, codex8's "grader is unsure" mechanism, the primers, the encyclopedia,
or the `exp` field voice — the explanatory tone is the app's best writing.

---

## Content accuracy — read before trusting the banks

A multi-agent audit fact-checked the AI-authored material with adversarial verification.
**39 errors confirmed, 6 claimed errors refuted** (the refuted ones are recorded in
`CONTENT-FIXES.md` and must not be "fixed" — each correction would introduce an error).

**All 39 have been applied** (47 edits; see `CONTENT-FIXES.md` for the reasoning behind
each). All were in the Advanced/Master material — none in the imported Intro or Certified
banks; in one case the Certified bank was the ground truth that convicted an Advanced primer.

They cluster into three kinds, and the pattern is diagnostic:

1. **Quantified counts and superlatives** (~half) — five vs eleven Sauternes premiers, seven
   vs four Champagne grapes, "smallest grand cru", "largest DOC".
2. **Attribution** — the wrong family attached to a château, a grower moved to the wrong village.
3. **Near-miss technical relations** — "half-sibling" for sibling, "genetically identical" for
   offspring-of-a-relative.

That is the signature of fluent generation: a plausible number, a plausible neighbour, a
plausible relation. Two consequences worth acting on:

- **The `ans` and `accept` fields are markedly more trustworthy than the stems and `exp`
  strings** — in a large share of cases the item contradicted *itself*, with the answer key
  right and the stem wrong.
- Most remaining risk is **mechanically detectable**. Write a lint pass flagging: any numeral
  in a stem disagreeing with the item count in its own `ans`; every superlative; every
  ownership or founder claim; and the vocabulary of genetic relation. That will surface most
  of what's left for a fraction of the effort. (codex9's list detector already found one this
  way — "Name the four ingredients of sake" whose answer parsed to three.)
- **Do not rebuild the banks.** One in six claimed errors was itself wrong. Prefer additive
  hedging, never change a defensible keyed answer, and treat `exp` as the safe place for nuance.
- **Editing `ans` can silently change how codex9 grades.** Three of the 39 did, and none of it
  was visible without the harness: an item longer than 40 characters drops a question out of
  list grading entirely, and a number word in the stem that happens to equal the item count
  hijacks `need`. Always run the harness (feed each detected question its own `ans`; it must
  score full marks) and diff the *detected set* before and after, not just the pass count.

Bottom line for the user: verify against GuildSomm or the CMS curriculum before exam-critical
use, and use the in-app error flag (⚑ in every reveal) to collect fixes as you study.

---

## Testing notes

- Run `node .scripts/check-syntax.js` first — it parses every layer without executing it.
  A stray character stops one file parsing, every global it defines vanishes, and the errors
  surface in the layers *above* it. Cheapest possible check, and it has already earned itself.
- Verify in the browser, not by reasoning. The preview tool's `javascript_tool` can drive the
  app directly: `applyLevel('master')`, `startMock()`, `submitSA()`, `stReset()`, etc.
- **bfcache**: revisiting a URL can restore the old JS heap without re-running scripts. Always
  test with a unique query string — `?fresh=anything`. `?nosw` skips SW registration.
- **`?nosw` is not enough on a profile that has already registered the worker.** It only skips
  *registration*; an installed SW still controls the page, and the fetch handler matches with
  `ignoreSearch:true`, so `?v=` and `?fresh=` are both ignored and you silently test stale
  JavaScript. This cost real time during the id work — a verification pass "passed" against
  the previous build. Before trusting any in-browser result, confirm the page is running the
  code you just wrote (compare a known value against disk), or clear properly first:
  `navigator.serviceWorker.getRegistrations().then(r=>r.forEach(x=>x.unregister()))` and
  `caches.keys().then(k=>k.forEach(c=>caches.delete(c)))`, then reload.
- After a deploy, the SW installs but waits; push it with
  `navigator.serviceWorker.getRegistration().then(r=>r.waiting&&r.waiting.postMessage('skipWaiting'))`.
- Useful sweeps that have each caught real bugs: walk every view at every level and (a) scan
  for codepoints above U+2000 outside a keep-set, (b) composite alpha layers to check contrast
  — a naive `backgroundColor` walk gives ~100 false positives because cards use gradients,
  (c) check `scrollWidth > clientWidth` at 375px.
- Before editing any `ans` field on a list-detected question, re-run the offline harness: the
  author's own model answer must still score full marks (it was 80/80).
- After any change to a bank, run `py .scripts/mint-ids.py` (dry run — it exits non-zero on a
  count mismatch, duplicate id, or a `|` in a stem) and `qidAudit()` in the console.
