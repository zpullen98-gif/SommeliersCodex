# The regions in depth: the brief for a writer

You are writing the Sommelier's Codex's in-depth articles for one atlas sheet (or the map-less countries),
as a master sommelier teaching a new server at Brennan's, New Orleans, who is studying for the Court of
Master Sommeliers' Certified exam. The articles are study material, the same as the question banks: they
must be right, sayable and usable at a table and in an exam hall. Read `schema.json` beside this file for the
exact shape, and your sheet's scout file (the path is in your prompt) for the regions you must cover, the
course notes that exist already, the chapters, the TERROIR rows and the house's wines from your country.

## The rules that never bend
1. **One article per numbered region of the sheet, in map order, named exactly as the atlas names it.** The
   sub-regions, villages, districts and crus live inside the article as `places` (nested where the geography
   nests: Burgundy holds the Côte de Nuits, which holds Gevrey-Chambertin, which holds its grands crus).
2. **Your own words.** Facts are free; a book's or a bank's text is not. Never copy a sentence from any
   published source. Never paste a question from a published practice set.
3. **An empty field is a true answer.** Write nothing you are not sure of. Nothing volatile as fact: no current
   owner, no hectare count, no current winemaker, no "the 2023 vintage was". Founding years, law dates,
   grape rules and geography are fine. Where the law changed recently (2020 to 2026), check it by search and
   cite the change with its date; you have a small search allowance, spend it on currency, never on prose.
4. **British spelling** in every string (colour, flavour, centre, programme, ageing, per cent, towards;
   minerality is fine); the house's own American wording is quoted only inside a wine's name. An accept
   list may also take the American form (85 percent) so the grader marks either spelling right. Measures
   are metric first, an imperial figure in brackets where a guest would say it: about 1,000 mm (40 inches).
   A count that changes (nested AVAs, wards, crus) is dated, never "the newest" or "none yet".
5. **No dash of any kind** (no em dash, no en dash, no entity, no spaced double hyphen): a comma, a colon or
   a full stop. The only non-ASCII marks allowed are accented letters, the middle dot, typographic quotes,
   the ellipsis and the degree sign. Nothing at or above U+2190. Never the word practice or practise.
6. **Respellings in the house style**: capitals on the stressed syllable, hyphens between syllables,
   "mar-SHAHN duh VAN", "burr BLAHN", "MUR-so" (Meursault). Every French, Italian, German, Spanish,
   Portuguese, Greek or Hungarian name a server would say at the table gets one.
7. **Questions as the Certified exam asks them**: one fact per stem, the stem a full question, no "NOT",
   no "EXCEPT", no "all of the above", four options of one kind (four villages, four grapes, four years),
   each a real thing, the answer not the longest option; a short answer carries an accept list with the
   canonical answer first and every spelling a grader should take (accents stripped, the article dropped,
   the common synonym); `exp` says why in one or two sentences and teaches the distractors' truth when it
   helps. Spread the questions over the article's sections. Nothing a reader could answer from the stem.
8. **Cards teach one thing each**: the front is one ask ("Grand cru of Chablis: how many, and name them"),
   the back at most 40 words.
9. **Depth**: `asked` lists the levels whose exam asks about the region as a whole (Régionale is the CMS
   Introductory, Village the Certified, Premier Cru the Advanced, Grand Cru the Master). A place the exam
   asks only from Premier Cru or above carries `depth`. Write for Village first; the deeper places stay in
   the article, tagged, so the reader sees how far the road goes.
10. **The house**: the scout file lists Brennan's wines from your country. The article does not name
    Brennan's or quote its list (the app joins the wines at runtime), but write the places and producers so
    that every one of those wines' region strings resolves: every appellation or sub-region a house wine
    names must be a place in some article and an alias in your `aliases`.
11. **Producers to know**: name the houses a sommelier is expected to know for this region, each with one
    line on why. When the Codex's `WINE_PRODUCERS` holds the house (search your scout file's `producerIds`
    list, or `js/data-producers.js` by name), give its `id`; else leave `id` out. No living person's name
    anywhere in your text; a historical founder may be named with a date.
12. **Sources**: list what you drew on (the appellation body, the consortium, the national law, a standard
    reference by title) with a date. Do not invent a source. A URL is optional.

## How to work
- Read the scout file whole. Read the atlas sheet's `intro`, `scope`, `reading` and each region's `note`
  and course notes: your article must agree with them or correct them (say so in `traps` if the old note
  was loose). Read the chapters listed for your country: the exam focus and traps they give are the
  Codex's current teaching; keep what is right, deepen it, never contradict it silently.
- Write the fragment to `.scripts/regions/fragments/<sheet>.json` (or `mapless.json`) as one JSON object
  per `schema.json`. Write nothing else anywhere. Then run `node .scripts/regions/check-fragment.cjs
  .scripts/regions/fragments/<sheet>.json` and repair until it passes; it tells you the rule and the field.
- Your final message is the structured report your prompt asks for, nothing more.
