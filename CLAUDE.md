# The Sommelier's Codex — PWA

Installable, offline-first study app covering **all four CMS levels** —
Introductory, Certified, Advanced, Master — in one install. Vanilla JS, no
frameworks, no build step. Split from the single-file
`Downloads/cms-certified-practice-exam_22_1.html` into this project (Aug 2026),
then extended with the Intro import and authored Advanced/Master banks.

## The review edition, 11 October 2026

Every question of the four banks was read line by line (the Régionale and Village banks in their rewrite modules, the
Premier Cru and Grand Cru banks in place), with the four levels' chapters, the 47 grape profiles, the Floor, Pairing and
Service data, and the exam format against the Court's own pages (`docs/certified-exam-2026.md`). The reviewers' logs
are under `.scripts/review/findings/`; what each integrator applied, every gate and every moved id are in
`.scripts/review/applied-rewrite.json` and `.scripts/review/applied-direct.json`. What moved: the Village tasting is
four wines, two white and two red, the written grid, 45 minutes (codex39, below); Ausbruch is taught as the current law
(the name Rust's alone since 2016, Ruster Ausbruch DAC at Trockenbeerenauslese weight from the 2020 vintage), never as a
rung between Beerenauslese and Trockenbeerenauslese; red Rioja Gran Reserva is 60 months with at least 24 in cask and 24
in bottle in every bank, chapter and region article; and the shown strings of the banks (the Régionale reference rows of
`js/data-intro.js` among them), chapters, grapes, producers, Floor and Pairing carry no em or en dash, no glyph at or
above U+2190, never the retired word, and per cent and towards wherever the string is not a stem (an accept list is
never shown, keeps its old form and gains the British one where the grader would not already take it). **Stems move
ids.** In the Régionale and Village banks an id is minted from the stem when `rewrite/ship.py` builds the bank, so a
reworded stem is a new question: its old progress is orphaned and it starts fresh (52 moved in this edition, each listed
old to new in both applied files; until the edition is committed `rewrite/check-ids.py` and `rewrite/check-regression.py`
exit 1 against HEAD, and `--logged .scripts/review/applied-rewrite.json` accepts exactly the logged moves and revoked
answers and fails on any other). Reword a Régionale or Village stem only when the stem itself is wrong or breaks a house
rule, and log the move. The Premier Cru and Grand Cru ids are frozen
literals, so a stem edit there moves no id, but it moves the stem-prefix keys of `rewrite/check-paid.py`: re-key an
entry of `rewrite/paid_known.py` only when it is the same flag on the same question with only the stem prefix changed,
never to admit a new flag. American spelling left in stems stays, listed for the owner. `rewrite/check-primer-similarity.py`
compares the Régionale chapters with the imported source at `8d535c8^` (`--ref` or `OOT_PRIMER_REF` changes it), since
`js/data-primers-intro.js` has held the rewrite itself since that commit.

## Illustrated reading guides (codex33, October 2026)

`js/data-teaching-images.js`, `js/teaching-cache.js`, `js/codex33.js` and
`css/house-teaching.css` add optional, closed teaching guides to reference views.
Layer 36 also links guides from revealed cards, never question/card fronts.
See `assets/teach/README.md` for the exact image budget,
caption and versioning contract, separate future zoom-map collection and source
checks. Current atlas-v3 artwork retains the reviewed geometry, joins and
installation-specific offline map keys.
Source worker is `codex-v102`; its two teaching imports have query versions which
must follow the matching index versions. New work belongs in the next layer
(codex42: codex34 is the colour/bottle-shape layer, codex35 the components layer,
codex36 the illustrated study index, codex37 the culinary companion, codex38 the producers layer,
codex39 the regions in depth, codex40 The Cellar Compass, codex41 Brennan's, the house tab).

## The Cellar Compass (15 October 2026)

`js/data-cellar-compass.js`, `js/codex40.js` and
`css/house-cellar-compass.css` add 12 guided studies, 60 unscored recall
prompts and eight fall-dish pairing workshops. Today, My Restaurant and
Flashcards (since codex41 Practise, with a door on the Brennan's page too) lead into the collection. `#/v/cellarcompass` is its root;
`path/{id}`, `workshop/{id}`, `workshops` and `wines` are its subroutes.
The wine directory searches the current house's developed wine cards,
including menu wines and floor bottles. The full printed reference is
separate and is never represented as fully researched or live stock.

The balanced `cellar-compass` deck chooses up to five menu wines and five
floor bottles, prioritising wines not yet studied on the local calendar day,
then weak, unseen and older reviews. `cellar-path:{id}` uses exact wine IDs
from the authored path. Both reuse existing `h-w-...` card grading and miss
retry. The existing Due today system and course banks remain unchanged.
House answers must never enter `ST.srs`. Optional
`ST.cellarCompassSeen[houseId][wineId]` timestamps provide recency only;
the layer registers the map in `ST_DEFAULTS`, validates and merges it during
progress import, and carries it through `v27Rekey`. Never infer a study date
for historical answers without timestamps. Export, reset and rename must
continue to cover this map. Reading prompts and workshop rehearsal text
do not record marks; rehearsal text is discarded when leaving the screen.

Exact bottle and producer corrections belong in World Table's canonical
Brennan's authoring pipeline, not in a second Codex bottle dataset.
See `docs/brennans-cellar-review.md` for review scope, sources and remaining
lineup checks. New source gates:
`node .scripts/check-cellar-compass-data.cjs [codexRoot] [worldTableRoot]`
and `node .scripts/check-cellar-compass-ui.cjs [codexRoot] [playwrightModule]`.
The latter accepts `OOT_SHARED` and `CODEX_URL` for a public preview;
it uses an isolated browser profile and never the owner's stored answers.

Layer 36 uses `data-visual-studies.js` for exact reviewed IDs and introduces no
new persisted state. Card dialogs preserve the current run and grade, isolate
keyboard shortcuts and restore focus. The 14 guides include four service
studies; captions distinguish generic practice from Brennan's current SOP.
The components overview defaults to wine-linked material; its full collection
remains accessible. Grape aliases and regional-overview links are explicit.

Layer 37 adds `data-culinary-studies.js`, `codex37.js` and
`css/house-culinary-studies.css`: five guided lessons at `#/v/culinary`, two
aroma-reference plates and two reused World Table sauce/component plates.
Dish alternatives are unscored, distinguish printed menus from proposed
pairings, and never promise live bottle availability. Exact wine, component,
grape and primer IDs connect the lessons. Rehearsal text lives only in the
current screen; no stored marks, schema or question IDs change. Card dialogs
preserve the run and focus. Gates: `check-culinary-study-data.cjs`,
`check-culinary-studies.cjs` and `check-culinary-routes.cjs` under `.scripts/`.

`js/codex34.js` adds colour/rim reading at Sight in Study the grid, bottle shapes
at Compendium > Winemaking and beside the house's full-list door, and the Pinot
Noir portrait only in that Compendium grape entry. It qualifies the grid's old
colour shortcuts as observations rather than proof of grape or age. No teaching
art is added to flashcard fronts, quizzes or blind flights. The unnumbered Pinot
portrait uses an unordered reading list. Its botanical reference is Plantgrape,
with Wine Australia on variability; VIVC photographs could not be independently
retrieved for this edition and must not be described as verified.

The install icon master keeps its original wine colour/mark on house forest
green and antique gold. Regenerate its four PNGs with
`node .scripts/render-icons.cjs [path to @resvg/resvg-js]`; do not recolour raster
files separately. The renderer may be installed in scratch outside this repo.

## Brennan's, the house tab (17 October 2026)

The owner asked for the World Table's treatment here too: a tab of the house's own, the wine list grouped by how each
wine is sold, starting by the glass, and the three timed lines at the top of every card. `js/codex41.js`, loaded after
codex40 and before boot, does it by wrapping; it edits no earlier layer and no data file. What a maintainer needs:

- **The bar** reads Home · Brennan’s · Practise · Library and the quiet More (`V25_NAV` keys `home`, `brennans`,
  `practise`, `library`, `more`). The second word is the house's name (`v41TabWord`; the literal `Brennan’s`, the
  shipped pack's own name, at first paint), read again at every draw and escaped; the due pill rides on Practise.
  Owners and parents are set key by key in `V32_OWNER`, `V25_UNDER`, `V25_HUB` and `V32_PARENT`, never by replacing a
  registry (check-nav's mutations edit codex32's literals and must still be caught): the list, the card, the house's
  screens, the full list, the producers, the videos and The Cellar Compass are lit by the house's word; every screen
  codex32 put under Flashcards or Quizzes, and any later one still owned by either, by Practise.
- **The addresses**: `#/v/brennans` is the house's page, a root whose parent is Home; a bare `#/v/cellar` and the old
  `#list` land on it and print `#/v/brennans`. Practise is the Flashcards root relabelled at `#/practise` and
  `#/practise/all`; `#/flashcards[/all]` still reads as it and prints the new form; decks and cards keep
  `#/flashcards/{deck}[/card]`; `#/quizzes` stays with its h1 and rows, owned by Practise, its parent the Practise
  root. A section, a card, the producers, the videos, the full list and the house's own screens climb to the page. The
  Cellar Compass keeps codex40's parent, the level page, where two of its three doors are, since its own gate
  (`check-cellar-compass-ui.cjs`) pins a cold Back there; pushed from the page, Back pops to the page. The initial
  address is read again once for the three new forms, and the first render replaces. The producers' address is read
  again there too, from `V32.initialHash`: codex38 reads `location.hash`, which a render before it loaded (the house
  arriving) can already have written over with Home's, so a first visit on `#/v/houseproducers` sometimes landed on
  Home (3 of 6 cold loads on ba5dcf1).
- **The house arriving**: `v27Redraw` draws the house's page again in place (never over a search being typed), and
  Practise, Quizzes, the level page and the Library once when the house lands after they were drawn without it (a
  first visit, or a reload that drew before the house was read; `V41_DRAWN` records what the last render drew), so
  Practise shows the house's decks and drills, the level page its lead door and the Library The full wine list; never
  over a search being typed or holding words. codex27 never drew those four again.
- **The house's page** (`v41View`): `div.v25page.v32-root.v41-brennans`, the house's name as its h2 with the date the
  menus were read, the list's sentence, a jump row (`nav.v32chips.v41-jumps` of `button.v28-chip[data-v41="jump"]`, 44
  px, no address and no history: each scrolls to a `tabindex="-1"` heading clear of the sticky Back and the list's
  search, then focuses it; a chip whose heading is absent, the in-page search's included, is hidden), codex28's study view whole in `#v41-list` (its
  h2 retitled The list, `#v41-list-h`; the lede and the videos left to the page), then the doors: The Cellar Compass,
  Who makes our wines, Videos and The house (the full wine list, the Menu Desk, the house, the marks review). A section
  chip on the page pushes the section as its own screen (the chip remembered, so Back focuses it); open, edit and edit
  all switch to the `cellar` view first, and `v28Open` does the same, so a card always carries its own address. Edit
  the list and its way out replace the entry, as codex28 had them, so leaving the editor never stacks the page twice.
- **The grouping** (`v41Kind`, from the pack's fields only; no section is renamed, so every chip, deck and the section
  quiz hold): By the glass (a printed price and not a menu bottle, 15, the guide's style sections inside as h3), On
  the tastings (no printed price and a tasting course, 6), Bubbles at Brennan’s and Birthday Bubbles (a menu bottle
  whose section or meal says Bubbles, 12), Dessert by the half bottle (the menu bottle left, the Auslese), By the
  bottle (the floor's 237 in their twelve sections), then any bottles of the person's own. `v28MealRows` is wrapped to
  return that order, each section together where it first appears, so Previous and Next follow the page;
  `v28RowsHtml` puts `h2.v32-h2.v41-group#v41-g-{kind}` "{head} · {n}" before each group. check-study pins the list
  without codex41; check-brennans pins the grouped order.
- **The level page**: My restaurant keeps its h2, codex40's Compass door, the house line, the count line and the
  section chips; its three study rows become one lead door to the page (`data-go="brennans"`, the house's name) and
  its quiet row moves to the page.
- **The card**: `v28CardHtml` is wrapped last, as a string pass: the ten box, the first picks, the two buttons with
  their hidden lines and the guest line are cut and written back where the ten box stood as `section.v41-lines` (a
  visually hidden h3 The lines, the ten box `.v41-ten`, then In twenty seconds `#v28-s20` and In forty-five seconds
  `#v28-s45`, never hidden, the forty-five in the reading face at the size the ten had), then the guest line where it
  differs from the twenty, then the first picks, then About it and the rest as before. The flash card back and Say
  the pour are untouched.
- **Practise** (`v32FlashcardsHtml` wrapped): Due today, Quick quiz (its round pushes `#/quizzes/quick`, Back returns
  here), the house's decks with codex40's Your cellar selection first, Drills on our list, Who makes our wines, the
  level's decks with a row to The {Level} rounds (`#/quizzes`), What it's made of, Words, Reference cards, The regions
  and Service references, Hands on, and the level test last.
- **The retired word**: the eight gates' `voiceProblems` test `/practi[cs]e/i` on the string with the exact whole
  token `Practise` taken out, so the tab word passes and practice, practise and Practice in prose still fail;
  `.scripts/regions/check-fragment.cjs` keeps the full rule. The tab's key and address are the word in lower case and
  are markup: check-home sweeps the bar with that key's id and `data-nav` taken out, check-brennans the layer's source
  with the key and address taken out.
- **The bar's widths** at 375 and 390, measured in Chromium under codex32's phone rule, are written in codex41's
  comment: one row, no tab under 44 px, night and day; the 11 px fallback is not needed. The styles live in the
  layer's own `v41-style` element, with the house's tokens and classes.
- **Gate**: `node .scripts/check-brennans.js [jsDir]`: the shell's whole chain through codex41 in check-nav's VM with
  the shared pack; the bar, ownership, the addresses, the page, the grouping counted against the pack, the cards, the
  Practise order, the level page, the Back chains, the wiring, the chain rule (every list in a gate that names
  `codex40.js` names `codex41.js`) and the voice. It takes the wing's `codex/js`, so the site's check-wings can run
  it, and skips a tree with no codex41. check-nav's sixth word mutation now breaks codex41's literal.

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
- `js/data-advanced.js` / `js/data-master.js` — ADV_QUESTIONS (720, SA-heavy), MASTER_QUESTIONS
  (576, all oral-style SA); both on the Certified 36-category taxonomy
- `js/data-primers-advanced.js` / `js/data-primers-master.js` — ADV_PRIMERS / MASTER_PRIMERS, 36 each
- `js/codex7.js` — **the level engine**: LEVELS registry, `applyLevel()`, key namespacing,
  Court Standing strip, Oral Gauntlet, Master origin call, Intro Compendium
- `js/codex8.js` — **the study coach**, in four parts: honest short-answer grading,
  the exam-date study plan, spoken oral mode, and the actionable dashboard + content report
- `js/codex9.js` — **list-aware short-answer grading**: enumeration questions are graded
  item by item instead of on first accept-hit
- `js/boot.js` — final `render()` (layers decorate home after core's first render), SW registration,
  update toast
- `js/menu-desk.js` — **GENERATED** by `WorldTable/tools/port-desk.mjs` from `src/lib/desk` (the
  Menu Desk: reader, sorter, desk file, inbox, the desk-share words); never edit it here, regenerate
  and re-run `check-port.mjs`. `js/wine-rows.js` is the wine half (`wineRowFromDesk`: page fields
  first, the Producers asked only about what the page left empty, every field naming its source,
  and a figure the page did not print blanked and named rather than filed: "4 oz" inside "3/4 oz"
  is not on the page), gated by `.scripts/check-wine-import.js`. `js/codex24.js` is the Menu Desk's screens (the
  `menudesk` view, a read-only review list with one-at-a-time Edit through codex16's form,
  `cellarAddMany`, the inbox band, `#live` + `say()`) and the Maître d' marks on a bottle
  (`maitre`, carried by `cellarSanitize` and the transfer merge, hers until kept).
- `js/codex25.js`: **the four-level home**, the Codex's half of the contract it shares with the
  World Table and the Bartender's Ledger. It takes over `homeView`, so on the home `#view` holds
  exactly `section.levels` (four `button.level`, ids `lv-1` to `lv-4`, each `lv-name` and
  `lv-stat`; the current one `on`, with `aria-pressed` and the words "Your level") then `nav.quiet`
  (the doors Today, Library, Record and Mine · Our Wine List), and the non-affiliation line is a
  `footer.colophon` beside `#view`. A card reads Untouched, N% met (clamped to 1..99) or Met: the
  MEAN of the level's counted subsections (the domains, Tasting, The Floor, Pairing, Service),
  and a question is met once it has been answered right once. `S.view` gains `level`, `library`,
  `record`, `mine` and `today` (the wing's), drawn by the outermost `render` wrapper with
  codex18's landmarks, and `nav.appnav` in the topbar (Home · Levels · Library · Mine) retires the
  Home button. Every destination is named once, in the registries `V25_TRAIN`, `V25_LIBRARY`,
  `V25_RECORD` and `V25_MINE`; every `data-go` resolves through `V25_GO`, which calls its handler
  by global name at click time so the wing's lock wrappers still apply. The level test is the
  Finals made scoreless by wrappers. `codexLevelChosen` (localStorage, not `ST`) is written only
  by a card tap. `HOME_SECTIONS` (codex14) and `V22_TILES` (codex22) are dead data from here on.
  **Named, never numbered** (the owner, 27 Sep 2026): no I to IV is shown or read aloud anywhere,
  hidden text included. The cards, the level page's h1, the Today line, the test ("The Village
  test"), the way back ("Back to Village"), the header seal (codex7, now a lozenge that fits
  Premier Cru) and the Court Standing strip all say the name; the integers 1 to 4 stay in ids,
  `data-level` and storage only.
  Gate: `node .scripts/check-home.js [jsDir]`, which runs against the wing's `codex/js` too and
  fails on any "Level" followed by a roman numeral in what the layer draws.
- `js/codex28.js`: **Our List, to study** (WorldTable `docs/study-menus-design.md`, sections 1, 2.4, 4.3). With a
  current house holding wines, `cellarView` returns the study view (header, the shift filter, a sticky search and
  section chips, compact rows, a card per wine); "Edit the list" (`S._v28edit`, never stored) shows codex27's list
  unchanged. The card draws KEPT marks only and links the grape profiles, the Terroir row, the level's chapter, the
  map sheet and the producer, each matched at runtime and drawn only when its target exists; cross-room links only
  on a `/codex` path. `#wine=<id>` and `#list` are read once at load (behind typeof and try) into `V28_WANT`.
  `startHouseDeck(scope)` is the house flash deck, recording `h-<id>-card` through `v27RecordHouse`;
  "Drill the list" and `startHouseSectionDrill` are codex27's house rounds and never call `startCellarDrill`.
  Opening a card or the deck pushes one history entry; a `popstate` closes it, or switches to the card the popped
  entry names. A step (Next, Previous) replaces only an entry the card itself pushed. A door followed from a card (the
  grape cards, the atlas, a chapter, the map, a producer, Say it, Guest) pushes `{v28:'door'}`, so back returns to the card;
  the atlas door lands on the card's region row. The 2.1 house door ("The house: must-knows, words and the table") calls
  `OOT.houseUI.readView(root, house, hooks, { study: true })` and stands only once the shared readView takes that option
  (a fourth parameter or `houseUI.study`); today's readView draws Kept, Edit and Discard, so the door is hidden.
  Styles in `css/house-list.css`; the card's and the deck's bars are padded 64px clear of the suite badge.
  Measured on Brennan's at Village: 19 of 20 wines link a chapter, 15 a grape, three a producer (Leflaive, Jadot,
  Inglenook). Gate: `node .scripts/check-study.js [jsDir]`.
- `js/codex32.js`: **the consolidation** (WorldTable `docs/consolidation-design.md`, sections 2 and 5, 4 Oct 2026).
  The bar read Home, Flashcards, Quizzes, Library and a quiet More (`V25_NAV` reassigned; More is `.v32more`, the
  ghost ink) until codex41 (17 October 2026, above) made it Home, Brennan’s (the house's page, `#/v/brennans`),
  Practise (the Flashcards root, `#/practise`), Library and More; the lit word is `V32_OWNER[S.view]`, one of those
  five keys; the Due today count rides on Practise as a pill. Home is
  `section.levels` alone (`v25HomeHtml` reassigned). The level page (`V25_VIEWS.level`, and `today` and `mine` land on
  the level page and More) is Today's study (Due today, Quick quiz, Next reading, Your first week), My restaurant
  (three study doors, the sections as chips to `#/v/cellar/section/{slug}`, quiet setup links; since codex41 one door
  to the house's page, the quiet links on that page), Search and a closed
  What {Level} holds. New views: `flashcards`, `deck`, `quizzes`, `more`, `housevideos`, `firstweek`; `housedeck` and
  `flash` are ONE card screen (`v32CardView`) for every deck (`v32DeckDef`: list, list:{slug}, list-weak, one:{id},
  bottles, bottles:{slug}, menu-words, grapes, grapes:r/w, grapes-all, misses, due); `startHouseDeck` opens the deck
  screen and `startFlash` starts a grape run there. Grape answers, which kept nothing before, go to the per-device
  slot `oot-codex-grapecards-v1` (never exported). `v32DueToday()` is the one count for the row, the root and the pill:
  the house's weak wines, else up to ten unseen in menu order, then codex3's `startDaily` exactly as it deals.
  **The router**: every render writes `#/...` (grammar in `v32Route`/`v32Parse`): a push when the screen key changes,
  a replace within a screen or when a run moves on; each entry carries `ootd` (the depth), mirrored to
  sessionStorage `oot-nav-codex-v1`, scroll in `oot-scroll-codex-v1`. A popstate applies the hash; a run renders from
  memory only while memory holds it (`state.run` looked up in `V32.toks`, the token each run number was made for, so
  the results under a pushed Study the misses still draw), else its parent; run numbers begin past `Date.now()` at
  load, so an entry from an earlier load never names a run of this one. The scope chip's level choice puts `S.view`
  back after `applyLevel` (which sends it home) and replaces in place. The search queries live in `S._v32q` (per box,
  `v32Query`), so a Back redraws the results before the scroll returns; the opener of a move is remembered by id or,
  for codex28's rows, by `data-v28`/`data-id` (`v32FocusKey`), and Back focuses it. codex28's and codex29's
  popstate listeners are REMOVED at load and `v28Push`/`v28Replace` only mark the next render, so one action makes one
  entry. Back (`#v32-back`, sticky, moved to x 64 once stuck) is drawn by the outermost render on every view but home;
  stuck is read from the sentinel above it (`v32StuckNow`) on every scroll, after the place is put back and by the
  IntersectionObserver, so a jump scroll never paints a frame with the stuck Back under the suite's badge:
  depth above 0 is `history.back()`, depth 0 replaces to `V32_PARENT`. Every older "Back to ..." button is stripped
  from `#view` as it is drawn (`V32_OLD_BACK`). Gate: `node .scripts/check-nav.js [jsDir] [--mutations]`.
- `js/codex35.js`: **what a wine is made of, and Compare with** (the component deep dive, 5 October 2026; WorldTable
  CLAUDE.md, "The components and the comparisons"). Wraps `v28CardHtml` to draw, before the five parts, the wine's
  components grouped Ingredients, Techniques, Stories (each a closed `v28-q` disclosure: say, explanation, card, videos
  through codex30's `v30Item`) with Flash these components (`v35flash` in a wrapped `v28Act`), and Compare with: a grape
  on the level's list through codex28's `grape` door, a house wine through `open`, a producer and a chapter through their
  doors, a Table technique or recipe and a Ledger cocktail as links on the suite's path, a classic as words. Wraps
  codex32's `v32DeckDef`, `v32Learnt`, `v32StartRun`, `v32Grade`, `v32CardFace` and `v32FlashcardsHtml` for the decks
  `components`, `components:{kind}` and `item-components:{id}` (dealt in the card's order; grades under
  `h-{id}-component` through `v27RecordHouse`). `#ref={grape|producer|primer}` is read once at load and opened on the
  first render (the outermost `render`). Gate: `node .scripts/check-components.js [jsDir]`.
- `js/codex38.js`: **who makes it** (the producers deep dive, section 3, October 2026). A component's kept producer
  mark (type, who, where, founded, history, facts, notes, sayIt, askKitchen) whose `itemIds` reach a house wine is a
  wine producer (`v38Rows`, memoised on the house object; the kitchen's and the bar's producers never show here). On
  the card, above codex35's What it's made of, Who makes it: each a closed `v28-q` disclosure (where, founded, say it,
  facts, the story in paragraphs, notes for the floor, Ask the sommelier only when `askKitchen` holds a question) and
  "In the Codex's producers" through codex28's `producer` door when `WINE_PRODUCERS` holds the house. That match is
  the folded whole name (the French et read as the and the fold makes of &, so Bouchard Père & Fils is Bouchard Père
  et Fils), else the same name with the estate word at the front taken off (Domaine, Château, Maison, Weingut and
  kin, the family words Famille, Familia and Familie among them, with de, du or des): Fichet is never Jean-Philippe Fichet, Comtes Lafon never Les Héritiers du Comte Lafon,
  Leflaive & Associés never Domaine Leflaive; a bare name two records share answers neither. A record also answers
  to its name up to an aside (Do Ferreiro (Gerardo Méndez) is Do Ferreiro, bare) and to the names in its optional
  `aka` list, each one a name its own text or the house's profile gives the estate (Thierry et Pascale Matrot for
  Domaine Matrot); 197 of the 200 Brennan's wine producers link, the three left being wines (`w-`) by design. Each
  card door carries its own id (`v38-lib-{c-id}`). Flash these producers (`item-producers:{id}`, in the card's order)
  and All producers under it. A producer is told once on a card: What it's made of (a `v35Groups` wrapper) leaves out
  the component of a producer Who makes it draws (its explanation is the opening of the profile's story) and a story
  under that producer's own name, unless it carries a film; their cards stay in the component decks. A door followed
  from a card (`v28DoorPush`) notes the card's open disclosures against its address and Back (`v32RestoreScroll`)
  opens them again before the scroll returns, so the page is as tall as it was and the pressed door takes focus. The view `houseproducers` (Our
  Wine List's Our producers, the level page's quiet The producers, `V25_GO.houseproducers`) is titled with the house's
  name, grouped by the region of each producer's first wine (`V38_GROUPS`: Champagne, Burgundy, Bordeaux, Rhône, the
  rest of France, Germany and Austria, Italy, Spain and Portugal, the United States, the rest of the world), region
  chips filter in place; a producer opens its profile with its wines as chips. Router: `v32Route`, `v32Apply` and
  `v32ParentRoute` are wrapped and `V32_OWNER`/`V32_PARENT` gain the view (owner home, parent cellar):
  `#/v/houseproducers/{c-id}` is a push, `#/v/houseproducers/g/{region}` a replace, and a reload on the view is read
  again at load; `v27Redraw` is wrapped so the view is drawn again when the house lands (a first visit on a
  producer's address). codex29's full list rows gain Read the full profile (the row's own card first, else its
  producer by the same name rule over the house's names (each wine's producer read whole and up to its aside, so
  Pazo das Bruxas (Familia Torres) answers to Pazo das Bruxas) and its Codex record's, else the list's own key: the
  other bottles of the row's producer key whose cards reach one house producer and no other, `v38ByListKey`; Duckhorn
  for Duckhorn Vineyards, Banfi for Castello Banfi; else the list's name, two words or more, as the opening of a house
  wine's label, `v38ByLabel`: Moulin d'Issan is Château d'Issan's whatever the vintage). Every one of the fourteen
  glasses offers its producer's profile. Decks `producers`, `producers:{region}`, `item-producers:{id}`
  on codex32's card screen, the engine's `buildFlashcards` producer cards (made here by the same rule for an older
  engine), each card graded on its own under `h-{component id}-producer-{n}` (the Table's card-producer-{n}), so a
  deck's learnt count is the cards answered; a group Who makes our wines on the Flashcards root under the house. `V27_CELLAR_KINDS`
  gains four kinds dealt by the engine over views (`v38ProducerView`: only the wines a kept producer reaches, each
  named without its maker, stems that two producers would share dropped and two wines of the same producers that
  fold to one stem kept once, so the glass and the bottle of one Champagne are never two options; `v38PourView`: each such wine named by its
  producer, for the first pick round): producerOf, producerWhere, producerDish, producerPour, recorded under
  `h-{item id}-{key}`. Nothing is drawn with no OOT or no wine producer. Gate:
  `node .scripts/check-producers-house.js [jsDir]`, on a fixture built from the shipped pack (its wine producers
  taken off, Domaine Leflaive, Domaine Fichet and Maison Louis Jadot under two names put on, two more for the quiz).
- `js/codex39.js`: **the regions in depth** (the regions edition, October 2026). `js/data-regions.js` is BUILT by
  `node .scripts/regions/build-regions.cjs` from the writers' fragments under `.scripts/regions/fragments/` (one per atlas
  sheet, or parts of one carrying `part: {indices, country}`, and the map-less countries; `schema.json` and `BRIEF.md`
  beside them are the contract, `check-fragment.cjs` proves one fragment, `--check` proves the files are the build of the
  fragments and `--partial` builds what exists) and is never edited by hand. **The build is split in two** (11 October
  2026: as one file it was 2.9 MB in the shell precache). `js/data-regions.js` (version 2) is the INDEX, in ASSETS: the
  join, the sheets, and for every record its names, place, levels, summary, grapes cut to name and role, cards and
  questions, so every deck and drill works from install, plus `REGIONS.parts`, the stamp (FNV-1a 64 of the bytes) of each
  READING file: `js/regions/<sheet>.json`, one per atlas sheet with its articles and its country, and
  `js/regions/mapless.json`, holding every other field. codex39 fetches a file the first time a page of that sheet opens
  (`v39LoadPart`, prefetched when the atlas sheet is drawn) and merges it into the index's records (`v39TakePart`); a page
  waiting on its file draws its head, summary and doors at once and the rest in place when the file lands, says in words
  when it is not on the device yet (Try again), and the regions index offers Keep every region on this device. The
  worker never precaches the reading: it serves `js/regions/` from its own cache, `codexregions-v1-` plus the installation
  folder (no `codex-` prefix, so a bump never reaps it), by exact address, dropping a file's older copy when a new stamp
  is stored and answering with the last copy when offline. The shell precache is about 8.3 MB over 99 ASSETS (10.2 MB
  with the single file). A writer who rewords a question's stem pins its old id in the fragment (`"id": "r-..."`), since
  the builder mints from the stem only when no id is given. `REGIONS.regions` holds one article per
  `ATLAS_V2` region at its index, named as the atlas names it: summary, terroir, grapes, wines, how it is made, the law,
  its places nested as the geography nests (a place the exam asks only from Premier Cru or Grand Cru carries `depth`),
  producers, exam lines, traps, respellings, cards and questions; `REGIONS.countries` one record per sheet key and
  map-less key; `REGIONS.join` the aliases, the terroir rows, the chapters (`cats`), the grapes and the country-only
  keys. Question ids are `r-` plus eight base36 of FNV-1a 64 over the slug (or key) and the stem, minted by the builder
  once and never re-minted. The layer opens an article from the atlas sheet, the Terroir row, the level's chapter and a
  house wine's card, each matched through the one resolver, `v39SlugFor`; deals the region and country cards as decks
  on codex32's card screen; drills the `r-` questions; runs The Village tasting: four wines, two white and two
  red, the written grid, 45 minutes, as the Court sets the Certified tasting (`docs/certified-exam-2026.md`): codex20's
  `gridStart(4)` re-dealt by `v39GridDeck` as two white GRAPES profiles of the level then two red, the whites first (a
  pool short of two of either colour keeps gridStart's four; never the regions' wines), shape `four-wines`, under a 45
  minute clock that reads a word when it is up, never stops the run and counts from a stored end time, so a render never
  resets it (leaving the grid holds what is left); Pour another flight deals the tasting again (codex20's `gridAgain`,
  wrapped behind codex21's Finals branch); check-regions, its item 9, and check-home hold the words, the deal, the clock,
  the again and the shape; says on the Quick quiz row what it deals (five from our list, three from
  the level, two from the regions; eight from the level and two from the regions with no house), wrapping codex32's
  `v32QuickLine`; keeps an article's or a country page's open sections across a door, noted against its address when
  codex32 saves the scroll and opened again before Back restores it (`V39_OPEN`, codex38's pattern); wraps `v27Redraw`
  (as codex38 does for its view) so the regions, a country page and an article are drawn again in place when the house
  lands, the open sections, the scroll and the focus kept, so a first visit on an article's address gains On our list;
  draws a wine's colour `rose` as rosé (`V39_WORDS.colour_rose`; the data keeps `rose`); and draws the
  service references (`js/data-service-ref.js`, `SERVICE_REF`: faults, glassware, bottles, temperatures, decanting,
  sparkling service, aperitifs, digestifs, spirits and cocktails, each a table with four columns, with their own cards
  and questions, per `.scripts/regions/service-ref-schema.json`). The references are dealt too: the deck `service`
  (Service references, its own group on the Flashcards root beside The regions, graded in the per-device slot
  `oot-codex-servicecards-v1`, never exported, as the region cards are in `oot-codex-regioncards-v1`), the drill Service
  references on Quizzes (`V25_GO.servicedrill`, every question through the core engine as `v39StartDrill` deals), and
  Flash these and Drill these on the references page. Every service question carries an `s-` id (eight base36 of
  FNV-1a 64 over `["service", stem]`, `mintServiceId` in build-regions.cjs), written into the data once and never
  re-minted; one without is never dealt. An `s-` key, like an `r-` key, is never level progress (`keyOwned`), never
  scheduled (`srsRecord`) and never an orphan to `qidAudit`. The builder closes each article's `asked` upwards (a
  region asked at Village is asked at Premier Cru and Grand Cru too), so the Quick quiz's region picks at a level hold
  every region a lower level asks. `v39SlugFor` is the mirror of
  `.scripts/regions/regions-join.cjs` step for step: fold, split on commas; find the string's country from the parts
  right to left (a country key, name or alias to one, or usa, us or united states; the four US sheets are one country);
  then MOST SPECIFIC FIRST, the parts left to right, an exact region name, alias or terroir row to an article of that
  country (another country's refused), then containment, then the country. So Elgin, Cape South Coast, South Africa is
  Elgin and Rioja Alta, La Rioja, Spain is Rioja. The index keeps a list of targets per folded key, and `join.aliases`
  holds one target or, for a key that names a place in each of two or more countries, a list (san rafael, central
  valley; la rioja is Spain's Rioja by alias and the Argentine La Rioja by name); the builder refuses two targets of one key in one country, and an alias whose key is another
  article's folded name in its own country. The two copies are proved equal by resolving every house string through
  both. The builder also deals the multiple choice answers round robin within each article and country
  (`bakeOptionOrder`, deterministic, ids untouched), since the engine never shuffles options. Gate: `node .scripts/check-regions.js [jsDir]
  [--pack <path>]`, which holds the index under 1,100,000 bytes and each reading file under 400,000, proves every file's
  stamp, part and voice, no stray file, every record's reading present and no field told twice, merges the two and holds
  the whole to check-fragment's rules (per cent and towards in prose, an accept list taking either), proves every join
  entry, every id (every service question an `s-` id, the one to pin named when it is missing), `asked` closed upwards,
  the even deal of the keyed positions within each article and country, codex39's merge of every file, the layer's own
  dealing in a sandbox (the service deck in its slot, the service drill of every `s-` question, neither scheduled nor
  level progress, both doors on the references page, the house landing drawing the region views again, rose as rosé),
  the shell, the worker's reading rule and the seven gate lists, and counts the house's wines through the resolver ("house wines: n of N resolve,
  a to an article, c to a country"), failing below 100 per cent. It runs on the wing's `codex/js` too and finds the
  site's pack beside it by default; the site's `tools/check-wings.mjs` runs it so. `check-home.js` loads
  `data-service-ref.js` in the chain and, when codex39 is there, holds the Quick quiz line to a real deal at every level
  and deals the service deck and drill through the real codex32 and core.
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
3. **Bump `CACHE` in `sw.js`** (currently `codex-v102`). This is the whole update
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
- **Layer discipline**: new features go in a new layer, the next being `codex42.js`, that wraps
  `render`/`decorateHome` like its predecessors. Don't edit earlier layers except for bugs.
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

## House art direction, 27 September 2026

The owner requested the Outside Of Time artistic identity throughout the Codex.
`js/codex26.js`, after codex25 and before boot, adds a decorative wine-library masthead
around the existing title and navigation. It also exposes only the active flashcard
face to assistive technology and gives Pairing choices explicit selected/answer states.
The original flashcard controls appear above the card so long profiles remain easy to use on phones. Wine-editor fields receive accessible names from their existing captions.
No study records or grading rules change. Keep this layer and the three `css/house*.css`
files identical in the standalone and `OutsideOfTime/codex` copies.

The house styles use forest green, warm gold and parchment, with existing self-hosted
type. The versioned `assets/codex-library-v1.webp` is decorative and precached; actual
wine-map images keep their original on-demand cache. The screen rules are separated
from print. New house art is an intentional exception to the earlier ornament rule
below, following the owner's request. Controls still use words, and wine-colour
teaching swatches must not be recoloured as branding.

## Reviewed teaching atlas, 27 September 2026

The owner requested a deep review and uniform artistic treatment of every teaching map.
`js/data-atlas-v2.js`, `js/atlas-cache.js`, `js/codex31.js` and `css/house-maps.css`
replace the old JPG presentation with seventeen geographic SVG plates and readable guides.
Load the three scripts in that order after codex30 and before boot. Keep these new files,
`maps/atlas-v2/`, `atlas-sources.html`, and both `assets/codex-atlas-*-v2.webp` assets paired
with `codex/` in the current public site checkout. Do not copy whole divergent trees over one another.

Generate geography from `.scripts/atlas-v2/`; sources and limitations are documented in
`maps/README.md`. Outlines, rivers and lakes use Natural Earth; editorial locations are
approximate representative points, never legal appellation polygons. The decorative
atlas-room image and embedded footer vignette are generated art, not geographic evidence.
All 115 mapped study headings remain. Virginia and Texas remain under Beyond this map
on the New York reading page. Original JPGs are retained for rollback but no longer shown
as current lessons. Course-bank IDs, progress, notes, grading and storage schemas are unchanged.

The SVGs remain optional downloads, outside the shell precache. Their cache is
`codexmaps-v2-` plus the encoded installation directory. Saved-state checks use exact URLs;
removal affects only that installation, including its own exact JPG keys in the old shared
cache. A future map revision must change the versioned asset paths/cache contract, not just
overwrite saved atlas-v2 files. Rebuild the bibliography after metadata changes with
`node .scripts/build-atlas-sources.cjs`; it must match the exact sources in the data module.

Verification: `node .scripts/check-atlas-cache.js`, `node .scripts/check-atlas-data.js`,
`node .scripts/check-atlas-ui.js`, and the existing home/syntax gates. The new gates accept
the other installation's root as an argument. Also verify browser layout, focus/zoom and
offline saving. Integrate committed source changes with the current site's
`tools/sync-wing.mjs codex`, manually copy new runtime maps/art/bibliography that the sync
intentionally skips, bump the wing worker and run `tools/check-all.mjs` before a normal
public-repo push. Follow that site's CLAUDE.md. The old private workshop and its staging
script are retired and must not overwrite the current public site; never push its history.

## Shared day and night service

`js/oot-service.js` is copied exactly from the canonical
`WorldTable/static/service/oot-service.js`. Update the canonical controller
first. It shares the device preference `oot.service.v1`, applies
`html[data-service="day"|"night"]`, and exposes `OOT.service.get/set/subscribe`.
`css/service-day.css` supplies the Codex day palette, including controls,
reference accents, results and the atlas viewer. Its screen-only rules keep
art headers dark and leave the actual atlas/wine-colour teaching images alone.
Both files belong in the shell cache.

The atlas helper in codex31 also recognises codex32's unified grape run
through `v32RunCard()`. Its deck indexes are not indexes into `GRAPES`.
Map links appear only after revealing an exactly matched profile; the native
map viewer must leave the card, deck and marks untouched. The atlas UI gate
checks both the legacy and unified card shapes.

## Earlier interface rule: typography, not pictures

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

### The one exception: the world maps

`maps/*.jpg` and the World Map tab (codex23) are the only raster images the UI renders, and
they are **content, not chrome** — study material, the same as the question banks and the
producer records, and they replaced ninety eight hand-drawn SVG pins that were the worst thing
in the app to look at.

The rule above is unchanged everywhere else. It forbids pictures used as *ornament or as a
substitute for a word*: an icon standing in for a label, a flag standing in for a country name.
It does not forbid the subject matter itself. If you are reaching for an image to decorate a
control or to save typing a word, the answer is still no.

Practical consequences, all of which have a reason written down in `js/codex23.js`:
the maps are never precached; they live in a cache called `codexmaps-v1`, whose name
deliberately matches neither worker's reap prefix; and the tab hides itself completely when the
folder is empty, so the app ships correctly with no pictures at all.

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
