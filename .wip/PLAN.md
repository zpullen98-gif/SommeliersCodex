# NOW (9 Nov 2026): the Grapes tab at the table (codex57): a tableside description at the top of every grape, the glass in specific words, Old World and New World side by side, and the grapes the tab lacks

## Context
The owner asks the Sommelier's Codex to expand and improve the Grapes tab: a tableside description at the top of each grape, tasting language more descriptive than the bare word "citrus", the difference between the Old World and New World styles of the same grape (Chardonnay, Cabernet), and whatever else a master sommelier would improve. A read-only review of Codex master 7d14d1c (codex56) found:
- **No tableside text.** 59 grape pages are joined at runtime from six data sets (`v53GrapeJoin`, js/codex53.js:2110). None carries a line to say at the table; the only spoken text is a "Say it" respelling on 20 of them.
- **Bare generics at the top.** The page's glass summary, the root row and the cards of twelve grapes draw `INTRO_GRAPES.aroma` ("citrus, green apple"); 11 of 53 hold a bare family word. The specific notes (`GRAPES.fruit`) exist for 47 grapes but sit lower down.
- **No Old World and New World.** Only a one-word flag (`TASTE.world`: old, new or both) printed as "Where it is grown". Nothing describes the two styles of one grape.
- **Twelve thin pages** with no profile or tells: Cortese, Garganega, Glera, Palomino, Pinot Blanc, Roussanne, Silvaner, Cinsault, Dolcetto, Nero d'Avola, Petit Verdot, Zweigelt.
- **House grapes with no page:** Meunier (23 wines on Brennan's list), Petite Sirah (3), Graciano (3); and label names that resolve to nothing (Carignane, Rolle, Moscato Bianco, Pinot Meunier, Durif, Viura, Macabeo, Ugni Blanc, Fumé Blanc).
- **Nothing for service:** no temperature, glass, decanting, pairing, label words or guest questions on a grape page, and no door from a grape to the house wines made of it.

The outcome: every grape opens on what to say at the table, describes the glass in named fruit, and (where it travels) shows the Old World and the New World side by side, with the house's own bottles of each.

## A. What every grape gains (new content: one record per grape in a generated `GRAPE_TABLE`)
- **At the table, first on the page** (the wine card's order, replacing the lone Say it line):
  - the forty-five second description (90 to 110 words: what the grape is, where it is at home, how it tastes, how it is made, what it suits);
  - **The sale** (two sentences);
  - the ten and twenty second lines;
  - **Say it**, a respelling for every grape, not twenty.
- **In the glass, in specific words:**
  - a lead sentence, then notes grouped by family with the fruit itself named (Chardonnay reads "lemon curd, green apple, white peach; from oak, toasted hazelnut and brioche", never "citrus");
  - a climate ladder (cool, moderate, warm: where, and what changes in the glass);
  - one line of structure (acidity, tannin, alcohol, body).
  - The build refuses a bare family word standing alone (`citrus`, `red fruit`, `black fruit`, `stone fruit`, `tropical fruit`, `floral`, `spice`, `mineral`, `oak`).
- **Old World and New World:**
  - **Side by side, for about thirty grapes grown in both:** Chardonnay, Cabernet Sauvignon, Pinot Noir, Syrah and Shiraz, Sauvignon Blanc, Merlot, Malbec, Riesling, Chenin Blanc, Grenache, Zinfandel and Primitivo, Sémillon, Tannat, Carmenère, Pinot Grigio and Gris, Viognier, Cabernet Franc, Mourvèdre, and every grape the Codex already flags as both.
  - **Each side states** where, in the glass, and in the cellar.
  - **Then three lines:** why they differ (climate, ripeness, oak, the law); where the line blurs (cool New World sites, modern Old World cellars); the blind call (what tips it).
  - **The grapes that stay at home** get "At home and abroad" in place of the side by side.
- **Service and the table:** temperature, the glass, decanting, age; three to five dishes with the reason.
- **On the label:** two to five words a guest meets (Shiraz, Fumé Blanc, Blanc de Blancs, Spätburgunder).
- **What guests ask** (two to four, with answers) and **Compare with** (one to three neighbour grapes and the tell).
- **On Brennan's list:** the house's wines of this grape, split Old World and New World, each opening its wine card. Read live from the pack; producer and wine only, no price or vintage.
- **Study:** three recall cards and three questions a grape (one on Old World against New World where it applies); sources for every record.
- **The twelve thin grapes** get a full profile (colour, structure, fruit, other notes, the tell, regions, what it is confused with).
- **Sixteen new pages (59 becomes 75):** Meunier, Petite Sirah, Graciano, Aligoté, Arneis, Fiano, Grenache Blanc, Macabeo (Viura), Müller-Thurgau, Pedro Ximénez, Trebbiano (Ugni Blanc, a family), Verdicchio, Agiorgitiko, Montepulciano, Touriga Franca, Lambrusco (a family). The nine label names above become aliases. Strike any of the sixteen and the rest stands.
- **The rules, as ever:** nobody living named, no price, nothing volatile, no superlative, British spelling, no dash, every fact in two sources or one primary.

## B. The layer (`js/codex57.js`, after codex56 and before boot; nothing in codex1 to codex56 or any data file edited)
- **House rules:** var and function only; every wrapper typeof guarded and outermost; every shown string in `V57_WORDS` read by `v57W`; CSS in its own `v57-style` element, every selector starting `.wrap`. Display only: `GRAPES`, `GRAPES_PLUS`, `INTRO_GRAPES`, `TASTE` and the grid data are never mutated; existing question ids, stems and a card's `g` name are never touched.
- **The join** (wrap `v53GrapeJoin`, codex53:2110): decorate the returned object once. Add the sixteen records in the join's own shape, give the twelve thin grapes their profile, and add the alias keys first writer wins. Auxerrois, Traminer and the blends' minor grapes stay unresolved, as the gates pin.
- **The page** (wrap `v53GrapeHtml`, codex53:3041):
  - the At the table block replaces the Say it line (codex53:3048), restating codex54's tableside look (`v54TableHtml`, codex54:262) in `v57-style`;
  - the glass lead opens the fruit section;
  - new sections, each with its chip: Old World and New World (before the regions), Service and the table, On the label, On Brennan's list (before the Court's grid);
  - the "Where it is grown" pair is dropped where the new section says more;
  - the six existing section ids, and Previous, Next and All, are kept.
- **The root** (wrap `v53GrapeShort` 2848 and `v53GrapesRootHtml` 2852): each row shows the grape's ten second glass line; a new section "At the table" with three doors and a filter (white, red, on our list):
  - **Old World and New World** (`grapeworlds`): the index of side by side grapes and a call drill ("Old World or New World?" from a described glass);
  - **Compare two grapes** (`grapecompare`): side by side, the glass, the structure, the tell;
  - **Present it** (`grapepresent`): the name is shown, you speak, the forty-five second line is revealed, you mark it.
- **Study:**
  - new decks `grapecards`, `grapecards:<slug>` and `grapesdue` through `v32DeckDef`, a card face `gtable` through `v32CardFace`;
  - due dates in the Codex's own steps (`v56Step`, `v56Today`, `v56AddDays` reused, typeof guarded) in a slot of their own, `oot-codex-grapesrs-v1`;
  - the table's questions join each grape's drill (wrap `v53GrapeQuestions`, 2305) with a per grape exclusion list, so a Montepulciano key cannot pull Vino Nobile questions.
- **House wines by grape:** `v53House()`, `v28Wines`, `v28Grapes`, `v28KV` and `v53GrapeKey` reused; the country is the last part of `region`, through a small `V57_WORLD` map; the row opens the card through the existing `data-v28="open"` door.

## C. Pipeline, gates and pins
- **Pipeline** `.scripts/grapes/` (the regions and CMS pipelines' shape): `BRIEF.md`, `schema.cjs` (the caps, the two sentence sale, the generic refusal, the voice rules reused from `.scripts/regions/check-fragment.cjs`), `plan.json` (the 75 slugs, the mode of each: side by side or at home), `fragments/<slug>.json`, `keys.v1.json` (ids frozen), `build-grapes.cjs` with `--check`. It writes `js/data-grapes-table.js` (`var GRAPE_TABLE`, about 0.5 MB, precached so the page works offline).
- **New gate** `.scripts/check-grapes-table.js` with `--mutations`: the roster whole, every cap, the sale's two sentences, no bare generic, every side by side grape with both sides, aliases and compare slugs resolving, all 75 pages drawn clean with the block first, the join's old keys unchanged, house rows opening real cards, the decks and the schedule on seeded grades, data equal to the build, the shell.
- **Pins that move:** index.html (two tags after codex56), sw.js (`codex-v116`, two assets), the nine exact script-order lists (check-atlas-ui, check-brennans, check-cms, check-components, check-nav, check-videos, check-winelist, check-regions, check-atlas-course), check-grapes.js (59 to 75, the thin count to none, the root chips), check-card.js (59 to 75; no card synthesised), check-house-only.cjs (the three views). Codex CLAUDE.md gains the section and names codex58 next.

## D. How it runs (one workflow on pushed branch `codex57-wip`; every agent commits by path and pushes as it goes)
0. Inline first: fetch the Codex, merge anything ChatGPT has published into master, branch `codex57-wip`.
1. **Spec** (one agent): the pipeline, the schema, the shell (empty layer, tags, worker, script-order pins), four pilot grapes (Chardonnay, Cabernet Sauvignon, Meunier, Glera), every gate green.
2. **In parallel:**
   - **The layer engineer:** the join, then the page, the root, study, the three views.
   - **Three content lanes** over the other 71 grapes in chunks of six. Each chunk goes to a master sommelier author (WebSearch, two sources), then an adversarial checker who tries to refute every fact and runs the build on the chunk.
3. **Gates** (one agent): check-grapes-table with mutations, the moved pins, the Playwright walk at 375 and 390 px, day and night.
4. **Review** (two agents): an independent read of codex57 against the wrapper rules, and a second lens on every Old World and New World entry.
5. **Integrator:** build, freeze the keys, every gate, a reading of six grapes at 390 px.
6. **Publish:** Codex master; site `sync-wing codex`, `bump-shared --apply` (oot-codex-v164), check-all with clean source worktrees, the walk on the wing, push the branch and main, Pages.
- **Cost:** about 31 agents and 8 to 10 million agent tokens; the content is about 65,000 words, each fact researched and then checked. To spend less: strike the sixteen new grapes (about 2 million less), then the root filter and Present it.

## Verification
- **Codex:** every `.scripts` gate, with check-grapes-table and its mutations, check-grapes, check-card, check-atlas-course and `build-grapes --check`; all 75 pages through the clean-markup check; the walk at 375 and 390 px, day and night, clean console: the root rows and filter, Chardonnay and Cabernet Sauvignon (the block first, the side by side, a house wine opened and Back), Meunier (a new page reached from a house card), Glera (a thin grape filled), the three views, a card graded and due tomorrow, cold reloads.
- **Site:** check-all 9 of 9; the walk on the served wing; Pages success confirmed.


# TECHNICAL APPENDIX (for the agents; measured against master 7d14d1c, codex56)

Everything below was measured read-only before the build. Line numbers are true at 7d14d1c; verify before you lean on one.

## 0. The owner's request, verbatim
"Now let's expand and improve our Grapes tab under the Sommeliers Codex and have a table side description at the top of each grape, and be more descriptive than just using the word citrus, along with any other improvements you as a master sommelier can see. Let's also describe the differences between old world vs new world style of the same grape such as chardonnay or cabernet"

## 1. The roster: 75 grapes (59 the join holds today, 16 new)
Slugs of the 59, exactly as `v53GrapeJoin().list` holds them:
albarino, chardonnay, chenin-blanc, gewurztraminer, gruner-veltliner, muscat-blanc, pinot-grigio, riesling, sauvignon-blanc, torrontes, viognier, cabernet-franc, cabernet-sauvignon, gamay, grenache, malbec, merlot, nebbiolo, pinot-noir, sangiovese, syrah, tempranillo, zinfandel, assyrtiko, furmint, semillon, melon-de-bourgogne, vermentino, verdejo, godello, savagnin, marsanne, petit-manseng, xinomavro, mencia, aglianico, blaufrankisch, nerello-mascalese, touriga-nacional, carignan, mourvedre, barbera, corvina, sagrantino, tannat, pinotage, carmenere, and the twelve thin ones (no profile, no TASTE): roussanne, garganega, cortese, glera, silvaner, pinot-blanc, palomino, cinsault, petit-verdot, nero-d-avola, dolcetto, zweigelt.

`TASTE.world` today: both = chardonnay, sauvignon-blanc, cabernet-sauvignon, merlot, pinot-noir, syrah, semillon, tannat; new = torrontes, malbec, zinfandel, pinotage, carmenere; old = the other 34 full grapes.

The sixteen new (a slug must equal `v53GrapeSlugOf(name)`; none resolves through `v53GrapeKey` today): Meunier, Petite Sirah, Graciano, Aligoté, Arneis, Fiano, Grenache Blanc, Macabeo, Müller-Thurgau, Pedro Ximénez, Trebbiano (kind family), Verdicchio, Agiorgitiko, Montepulciano, Touriga Franca, Lambrusco (kind family).

Aliases to add (each must resolve to its own grape and to no other): Carignane (carignan), Rolle (vermentino), Moscato Bianco (muscat-blanc), Pinot Meunier (meunier), Durif (petite-sirah), Viura (macabeo), Macabeu (macabeo), Ugni Blanc (trebbiano), Fumé Blanc (sauvignon-blanc), PX (pedro-ximenez) only if a two letter key is safe in `v53Hays`.
Must stay unresolved (gates pin some of these): Auxerrois, Traminer, Grenache Gris, Corvinone, Rondinella, Caladoc, Marselan, Clairette, Counoise, Welschriesling.

### The chunks (plan.json records each grape's chunk)
- pilots (the spec agent writes these four in full): Chardonnay, Cabernet Sauvignon, Meunier, Glera
- g1: Sauvignon Blanc, Chenin Blanc, Melon de Bourgogne, Aligoté, Pinot Blanc, Sémillon
- g2: Riesling, Gewürztraminer, Grüner Veltliner, Muscat Blanc, Silvaner, Müller-Thurgau
- g3: Viognier, Marsanne, Roussanne, Grenache Blanc, Vermentino, Pinot Gris / Grigio
- g4: Albariño, Godello, Verdejo, Macabeo, Palomino, Pedro Ximénez
- g5: Garganega, Cortese, Arneis, Fiano, Verdicchio, Trebbiano
- g6: Torrontés, Assyrtiko, Furmint, Savagnin, Petit Manseng
- g7: Merlot, Cabernet Franc, Malbec, Petit Verdot, Carmenère, Tannat
- g8: Pinot Noir, Gamay, Zweigelt, Blaufränkisch, Pinotage, Cinsault
- g9: Syrah / Shiraz, Grenache / Garnacha, Mourvèdre / Monastrell, Carignan, Petite Sirah, Zinfandel
- g10: Nebbiolo, Sangiovese, Barbera, Dolcetto, Corvina, Montepulciano
- g11: Aglianico, Sagrantino, Nero d'Avola, Nerello Mascalese, Lambrusco, Xinomavro
- g12: Tempranillo, Graciano, Mencía, Touriga Nacional, Touriga Franca, Agiorgitiko

### Old World and New World: which grapes take the side by side (`worlds.contrast`)
The rule: a grape takes the side by side when a guest can meet a recognised style of it from both worlds on a wine list. Certain: Chardonnay, Cabernet Sauvignon, Pinot Noir, Syrah / Shiraz, Sauvignon Blanc, Merlot, Malbec, Riesling, Chenin Blanc, Grenache, Zinfandel (as Primitivo in Puglia against California), Sémillon, Tannat, Carmenère, Pinot Gris / Grigio, Viognier, Cabernet Franc, Mourvèdre, and every grape `TASTE.world` flags `both`. Judge on the same rule: Gewürztraminer, Muscat Blanc, Sangiovese, Tempranillo, Barbera, Carignan, Cinsault, Petit Verdot, Pinot Blanc, Roussanne, Marsanne, Petite Sirah, Vermentino, Grenache Blanc, Albariño, Nebbiolo, Gamay, Meunier. Every other grape takes `worlds.home` (at home, and abroad where it travels at all). plan.json fixes the mode per grape; expect about thirty side by side.

## 2. What the data holds today (never mutate any of it)
- `GRAPES` / `CERT_GRAPES` js/reference.js:193 to 217 (23 grapes), `GRAPES_PLUS` js/data-grapes-plus.js (24), `TASTE` js/data-tasting.js (47; `world` is old, new or both), `INTRO_GRAPES` js/data-intro.js:1793 to 1848 (53; `aroma` is the bare generic line), generated `GRID_READS` / `GRID_SAY` / `GRID_ALIASES` js/data-grid.js (the Court's twenty; `GRID_SAY` at 1758 is pinned to the twenty), `CMS.tasting`, `REGIONS.join.grapes`.
- `GRAPES.fruit` is already specific with a cool and warm split and feeds the blind flight clue (codex6:57), the grid reveal (codex20:199), the card face (codex32:1626) and search (codex44:68; codex2:265 to 277). `INTRO_GRAPES.aroma` is drawn on the Grapes tab at codex53.js:2913 (the page), 2850 (the root row of thin grapes) and 2234 (the twelve synthesised cards), and at codex7.js:503 (the Intro course's own summary: leave that one alone).
- So codex57 is a DISPLAY overlay on the Grapes tab's own surfaces. No question id hashes from these strings; never touch an existing stem, id (`missKey`, core.js:106) or a card's `g` name (the key of `oot-codex-grapecards-v1`, codex32.js:233).
- Brennan's pack (271 wines): chardonnay 76, pinot-noir 58, cabernet-sauvignon 43, merlot 32, cabernet-franc 19, riesling 15, syrah 15, sauvignon-blanc 12, grenache 12; house grapes with no page today: Meunier 23, Petite Sirah 3, Graciano 3. 22 wines carry no grape.

## 3. codex53's Grapes section (js/codex53.js, 3195 lines)
`v53GrapeParts` 2066, `v53GrapeAlias` 2070, `v53GrapeSlugOf` 2075, `v53GrapeProfiles` 2081, `v53IntroGrapes` 2089, `v53Taste` 2092, `v53GrapeResolve` 2101, `v53GrapeJoin` 2110 (identity signature cache 2113 to 2114; record shape at 2118: `{slug, name, colour, g, intro: null, taste: null, court: '', tasting: null, keys: [], targets: []}`; `key()` 2123 to 2127 first writer wins; the targets pass from `R.join.grapes` 2158 to 2165), `v53GrapeKey` 2170, `v53GrapeFind` 2171, `v53GrapeOrder` 2182 (returns `{twenty, whites, reds, all}`), `v53GrapeCardRec` 2225 (synthetic cards at 2234), deck and nav wrappers 2240 to 2287, `v53Hays` 2291, `v53GrapeQuestions(slug, lv)` 2305, `v53GrapeChoices` 2544, `v53GrapeRowHtml` 2847, `v53GrapeShort` 2848, `v53GrapesRootHtml` 2852 to 2889, `v53ProfileBody` 2892 (prints "Where it is grown" from `TASTE.world` at 2905), `v53FruitBody` 2909, `v53TellBody` 2917, `v53RegionsBody` 2942, `v53ReadsBody` 3001, `v53GrapeCardsBody` 3009, `v53WatchBody` 3036, `v53GrapeHtml(r)` 3041 to 3066 (the lone "Say it" line at 3048 to 3049), building blocks 1223 to 1262 (`v53Details` gives `<details class="v28-q v39-sec" id=...>`, `v53Chips` gives `<nav class="v39-steps v53-steps" aria-label="Sections">` of `data-v39="chip" data-sec=...` buttons, `v53Sections`, `v53Pairs`), views registered 3185 to 3195, `v53House()` 107, `/^grapes?/` regexes 201 to 320 (unverified against new deck ids).

## 4. The wrappers (js/codex57.js; all outermost, all typeof guarded)
The idiom (codex54:978 to 994, codex56:503 to 509):
```js
if (typeof fn === 'function') {
  var _v57Fn = fn;
  fn = function () {
    var html = String(_v57Fn.apply(this, arguments) || '');
    try { /* splice */ } catch (e) { return html; }
    return html;
  };
}
```
- **`v53GrapeJoin`**: decorate the returned J once per object:
```js
if (typeof v53GrapeJoin === 'function') {
  var _v57GrapeJoin = v53GrapeJoin;
  v53GrapeJoin = function () {
    var J = _v57GrapeJoin.apply(this, arguments);
    try { if (J && J.list && !J.v57) { J.v57 = 1; v57JoinAdd(J); } } catch (e) { }
    return J;
  };
}
```
  `v57JoinAdd` mirrors the record shape; new keys go into `J.byKey` first writer wins (an existing key is never taken); the targets for a new slug come from its record's `targets` (each must exist in `REGIONS`) and from re-running the `R.join.grapes` pass for it; a thin or new grape gets `r.g` from the table's `profile` with `g` forced to `r.name` at run time (never authored). Reached through the global: `v53GrapeKey`, `v53GrapeFind`, `v53GrapeOrder`, `v54GrapeEntries` (codex54:1109), `v54CodexDoors` (codex54:463), `v55Grapes` (codex55:958), the `grape:<slug>` decks, `v53GrapeChoices`. NOT reached: the decks `grapes` and `grapes-all` (they read the raw arrays, codex32.js:423 to 434), the blind flight, `v28GrapeProfiles`, the Régionale table. Leave those as they are.
- **`v53GrapeHtml`** (3041): replace `<p class="v39-lead v53-say">...</p>` with the At the table block; where that line is absent insert the block before `<nav class="v39-steps v53-steps" aria-label="Sections">`. Keep the six `id="v53-gs-*"` details and `v53-g-prev`, `v53-g-next`, `v53-g-all`; add no `<table class="v53-reads">`; do not re-register `V25_VIEWS.grape`; keep tags balanced for `cleanProblem`. The glass: lead the fruit section (after the first `<summary>...</summary>` of `<details class="v28-q v39-sec" id="v53-gs-fruit"`), keeping the Fruit and Non fruit rows below it. New sections: `v57-gs-worlds` before `id="v53-gs-regions"`; `v57-gs-service`, `v57-gs-label`, `v57-gs-list` before `id="v53-gs-grid"`, else before `id="v53-gs-cards"`; add the matching `data-v39="chip" data-sec="v57-gs-..."` buttons to the nav; drop the "Where it is grown" pair where `worlds` exists.
- The At the table block restates codex54's look (`v54TableHtml`, codex54:262 to 276: the forty-five second line, a rule, The sale, the ten second line, the twenty second line, Say it) in `v57-style`. `v54-style` (codex54:185 to 193) is scoped `.wrap .v28` and does not reach a `.v53` page, so restate the rules; never reuse the ids `v28-s45`, `v28-s10`, `v28-s20`.
- **`v53GrapeShort`** (2848): return the table's `glass.lead` (the root HTML must still pass check-card.js:557).
- **`v53GrapesRootHtml`** (2852, already wrapped at codex54:978): a new `<section aria-labelledby="v57-g-table">` before the `<section` holding `aria-labelledby="v53-g-tasting"` (the anchor codex54:983 uses). Add no `data-go="grape" data-arg=` button (check-grapes.js:162); keep out of `v53-g-tasting` (check-card 593 to 595) and `v53-g-cards` (597); a sixth jump chip moves the five chip pin; the filter sets `hidden` on rows by their `data-arg` in a `[data-v57]` listener.
- **`v32DeckDef`** (codex32:403, wrapped at codex53:2240): new ids `grapecards`, `grapecards:<slug>`, `grapesdue`; `grape:<slug>` stays one card with `id === r.name`.
- **`v32CardFace`** (codex32:1597): a new kind `gtable`; the stock eight field face is left alone.
- **`v32Grade`** (codex32:507, wrapped at codex56:635) and **`v32Learnt`** (codex32:441): schedule `gtable` cards in the v57 slot; the inner grape mark must still run.
- **`v53GrapeQuestions`** (2305): concat the table's questions for the slug; apply the grape's `notIn` phrases (alias keys feed the drill through `v53Hays`: a `montepulciano` key would otherwise pull Vino Nobile di Montepulciano questions).
- **`v32Arg`, `v32Apply`, `v32ParentRoute`, `v25MainName`, `v25NavWord`**: the views `grapeworlds`, `grapecompare`, `grapepresent` (owner `grapes`, parent the Grapes root); add their rows to check-house-only.cjs (152 to 156).
- Leave `v53Readiness` and `v53ReadyBody` unwrapped (codex56:784 and 801 own them; figures pinned in check-atlas-course.js).
- Reuse from codex56, typeof guarded with a local fallback: the pure `v56Step(r, ok)` (579 to 593), `v56Today` (566), `v56AddDays` (570). Do NOT reuse `V56_SLOT` (356), `v56CardKey` (614), `v56Sched` (622), `v56Due` (676), `v56View` (826, hardcodes `worldmap`), `v56CmpPair` to `v56CmpView` (1678 to 1738). So: a slot of its own `oot-codex-grapesrs-v1` through `OOT.profiles.key`, its own `V57_VIEWS`, `V57_ARGS`, `V57_ACTS` and one listener on `[data-v57]`.
- **On Brennan's list**: `v53House()` (codex53:107) to `v32House()` (codex32:243) to `v28House()` (codex28:211); wines from `v28Wines(h)` (codex28:280) or `v32Wines()` (codex32:244); kept values through `v28KV(item, field)` (codex28:216); grapes through `v28Grapes(item)` (codex28:261) then `v53GrapeKey`; the row is `<button type="button" class="v28-row" data-v28="open" data-id="ID">` (codex28:838, handled by `v28Open`, codex28:1496). There is no country field: the last comma part of `region` is the country or the US state (France 160, California 41, Italy 18, Germany 12, Portugal 12, Spain 10, Austria 6, seven singles), so a small `V57_WORLD` map decides Old World or New World and an unknown part goes under neither heading. Print producer and wine only (no price, vintage, bin, `serviceNote` or pack prose). Compute at run time; omit the section when no house is loaded or the house pours none.
- Unverified, check before you rely on it: the exact `<dt>` markup of `v53Pairs`, whether each body function takes `r`, the `/^grapes?/` regexes against the new deck ids, whether the drill pool pins in check-grapes.js are exact.

## 5. The `GRAPE_TABLE` schema (one record per join slug; the spec agent may tighten a cap, never loosen one)
- `name`, `colour` (white or red), `kind` (`grape` or `family`), `aliases` [], `notIn` [] (phrases whose questions must not join this grape's drill).
- `say`: a respelling for speaking, the stressed syllable in capitals, at most 14 words.
- `lines`: `s10` 12 to 25 words, `s20` 25 to 50, `s45` 90 to 110, `sale` 15 to 45 words in exactly two sentences. `s10` and `s45` name the grape. (The Ledger's limits, tools/caskstyles/schema.mjs:36 and 225, are the model.)
- `glass`: `lead` at most 28 words; `notes` 3 to 6 of `{family (an enum), notes [2 to 4, each 1 to 4 words]}`; `ladder` 2 or 3 rungs `{climate (cool, moderate, warm), where, notes [2 to 4]}`; `structure` at most 30 words.
- `worlds`: either `contrast` `{old {where 12, glass 40, cellar 30}, new {where 12, glass 40, cellar 30}, why 40, blur 30, call 25}` or `home` `{home 60, abroad 40}` (word caps).
- `service`: `temp`, `glass`, `decant`, `age`, each at most 20 words. `food.with`: 3 to 5 of `{dish, why}`.
- `labels`: 2 to 5 of `{term (5 words), means (20)}`. `guest`: 2 to 4 of `{q (20), a (40)}`. `compare`: 1 to 3 of `{slug (in the roster), tell (30)}`.
- `profile` (thin and new grapes only): `c, st, fruit, other, tell, regions, confuse`, the fields the stock grape card and page read, each non empty and at most 30 words. `targets` (new grapes only): slugs that exist in `REGIONS`.
- `cards`: exactly 3 `{front 6 to 14 words, back at most 40}`. `questions`: exactly 3 four option questions with one key and an explanation (one tagged `worlds` for a side by side grape). `sources`: 2 to 4 `{title, url}`.
- **The generic refusal**: a family word may appear only as a `family` label. A bare `citrus`, `red fruit`, `black fruit`, `stone fruit`, `tropical fruit`, `floral`, `spice`, `mineral` or `oak` standing alone between commas, or as a whole note, in any note or prose list is an error: name the thing (lemon curd, Morello cherry, cassis, white peach, pineapple, violet, cracked black pepper, wet slate, toasted hazelnut).
- Ids: minted with a prefix nothing else in the Codex uses, from `['grape:' + slug, text]` (the FNV-1a 64 and base36 of `.scripts/cms/build-cms.cjs`, `mintId` at 170), frozen in `keys.v1.json`. Answer positions dealt round robin at build.
- An entry reads in at most 900 words. The whole file is about 0.5 MB and is precached as a classic script (the join, the rows and search need it synchronously, the sandbox has no fetch, and the tableside block must work offline).

## 6. The pipeline and who may write the data file
`.scripts/grapes/`: `BRIEF.md` (the writer's brief), `schema.cjs`, `plan.json` (75 grapes: slug, name, colour, kind, chunk, mode, aliases, thin or new, compare candidates), `fragments/<slug>.json`, `keys.v1.json`, `build-grapes.cjs`.
- `node .scripts/grapes/build-grapes.cjs --lint <slug> [<slug> ...]` validates the named fragments and WRITES NOTHING. Authors and checkers use only this.
- `node .scripts/grapes/build-grapes.cjs [--partial]` writes `js/data-grapes-table.js` (`var GRAPE_TABLE`); `--check` proves the file equals the build. `--partial` accepts a roster not yet whole and skips, with a note, a fragment that fails. ONLY the spec agent, the gates agent and the integrator run the writing build; the engineers leave the data file as they find it.
- Model code: `.scripts/cms/build-cms.cjs` (exports at 800), `.scripts/regions/check-fragment.cjs` (exports 769 to 774; `voiceProblems` 123, `AMERICAN` 46, `proseProblems` 50, `SUPERLATIVE` 59), `.scripts/cms/chain.cjs` (loads what index.html names into a vm; `cleanProblem`, `drawnVoiceProblem`).

## 7. The shell and the pins that move
- index.html: two tags between lines 134 and 135 (`js/data-grapes-table.js?v=1` then `js/codex57.js?v=1`, after codex56, before boot). sw.js: line 3 to `codex-v116`; two ASSETS entries after line 163.
- The exact script-order lists (four of them require `?v=<digits>` on the tag): check-atlas-ui.js:198, check-brennans.js:660, check-cms.js:505, check-components.js:373, check-nav.js:608, check-videos.js:336, check-winelist.js:460, check-regions.js:937 (add both to `learning`), check-atlas-course.js:334. No pins in check-syntax.js or check-library-search.cjs. Cache floors elsewhere only; the new gate asks for 116 or more.
- Counts: check-grapes.js:108 (59 to 75), 109 (`g` 47 to 75, `introOnly` 12 to none), 162, 172, 174, 175 (index 58 to 74), 192 and the five chip pin; check-card.js:684 (59 to 75) and 697 to 699 (rewritten to assert no card is synthesised). While the data is partial a gate run with `--partial` expects 59 plus the new grapes the data holds.
- Codex CLAUDE.md: lines 52 to 53, 72 to 73, 171 to 172 and the gate usage at 148, 223, 293; a new section for this edition; codex58 named next.

## 8. Order of work for the layer
1. the join extension and its pins, every gate; 2. the page wrap; 3. the root row line and the root section; 4. On Brennan's list; 5. the cards, questions and schedule; 6. the three views and the filter.

## 9. Risks, highest first
1. Join side effects on other tabs (house card doors, region pages, the Court grid's distractors, drill pools through new keys). 2. A missed script-order list among the nine. 3. The content: about 65,000 words under the voice rules. 4. `worlds` contradicting `TASTE.world`. 5. Storage keys (a card's `g` name, frozen ids). 6. Scope: if something must go, the root filter and Present it go first.
