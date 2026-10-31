# The CMS edition: the brief (29 October 2026)

The owner studies for the Court of Master Sommeliers, Americas Certified Sommelier Examination and uploaded four
CMS-A documents. This edition (codex53) carries them into the app as the study spine. This brief fixes the files,
the ids, the shapes and the rules every agent follows. Read it whole. `BRIEF.md` and `BRIEF-DEEP.md` in
`.scripts/regions/` hold the house voice rules that never bend (British spelling in our own words, no dash of any
kind: not U+2014, not U+2013, not an entity, not a spaced double hyphen; levels named never numbered: Régionale,
Village, Premier Cru, Grand Cru; nobody living named in our own words; "per cent" and "towards"; never the word
practice or practise in prose).

## The four documents
Uploaded at `/root/.claude/uploads/09201eae-82ec-5cba-9316-4d6cf5955e5e/`:
- `97a70d57-Certified-Sommelier-Exam-Syllabus.pdf` (10 pages, CMS-A 7.2023).
- `37439511-Introductory-Sommelier-Course-and-Certified-Somm-Theory-Exam-Curriculum-Guide_2.pdf` (93 pages, CMS-A 8.2023).
- `807a48ca-Certified-Sommelier-Level-Wines.pdf` (3 pages, CMS-A 9.2025): the tasting exam's grapes and regions.
- `57e5ff4b-CMS-A-Certified-Sommelier-Deductive-Tasting-Grid.pdf` (2 pages, CMS-A 1-2025): white then red.
Read a PDF with the Read tool and its `pages` parameter (at most 20 pages a call). `pdftotext -layout -f N -l N`
gives a text pre-pass, useful for copying words exactly; the page image is the authority for which column a
cell sits in.

## The quoting rule
The Court's words are QUOTED VERBATIM wherever the shape below says "quoted": every row's cells, the learning
outcomes, the syllabus's lines, the tasting list's notes, the grid's labels. American spelling stays there
("color", "flavor"). Capitalisation, numerals and punctuation stay as printed, with two exceptions: a long dash
(U+2014 or U+2013) in the Court's text is transcribed as a comma, or a colon where it introduces a list, and
logged in the fragment's `edits`; a bullet mark or a line break inside one cell becomes "; " between the items.
A cell that is blank in the guide is `""`. Never summarise, never add, never correct the Court's text (a Court
error is logged in `edits` and left as printed). Everything that is OUR OWN copy (a question, an explanation, a
label, a note, a `sell` line) is British, dash free, and names nobody living.

## The 44 subjects, their ids, groups, pages and order
Order is the guide's. `certifiedOnly` subjects are the four the guide marks "CERTIFIED SOMMELIER EXAM ONLY".

| order | id | name | group | pages | certifiedOnly |
|---|---|---|---|---|---|
| 1 | viticulture | Grape Growing: Viticulture | foundations | 3 to 6 | |
| 2 | vinification | Winemaking: Vinification | foundations | 7 to 8 | |
| 3 | bordeaux | France: Bordeaux | france | 9 to 11 | |
| 4 | burgundy | France: Burgundy | france | 12 to 14 | |
| 5 | loire | France: Loire Valley | france | 15 to 16 | |
| 6 | rhone | France: The Rhône Valley | france | 17 to 18 | |
| 7 | champagne | France: Champagne | france | 19 to 20 | |
| 8 | alsace | France: Alsace | france | 21 to 22 | |
| 9 | south-france | France: South France | france | 23 to 25 | yes |
| 10 | piedmont | Italy: Piedmont | italy | 26 to 27 | |
| 11 | lombardy-emilia-romagna | Italy: Lombardy and Emilia-Romagna | italy | 28 to 29 | |
| 12 | trentino-friuli-veneto | Italy: Trentino-Alto Adige, Friuli and Veneto | italy | 30 to 31 | |
| 13 | tuscany | Italy: Tuscany | italy | 32 to 33 | |
| 14 | central-southern-italy | Italy: Central and Southern Italy | italy | 34 to 35 | |
| 15 | sicily-sardinia | Italy: Sicily and Sardinia | italy | 36 | |
| 16 | galicia | Spain: Galicia | spain-portugal | 37 | |
| 17 | rioja | Spain: La Rioja | spain-portugal | 38 to 39 | |
| 18 | castilla-y-leon | Spain: Castilla y León | spain-portugal | 40 to 41 | |
| 19 | catalonia | Spain: Catalonia | spain-portugal | 42 to 43 | |
| 20 | spain-other-dos | Spain: Other DOs | spain-portugal | 44 to 45 | yes |
| 21 | portugal | Portugal | spain-portugal | 46 | |
| 22 | germany | Germany | central-europe | 47 to 51 | |
| 23 | austria | Austria | central-europe | 52 to 53 | |
| 24 | hungary | Hungary | central-europe | 54 | |
| 25 | greece | Greece | central-europe | 55 | yes |
| 26 | california-north-coast | North America: California, North Coast | north-america | 56 to 57 | |
| 27 | california-central-coast | North America: California, Central Coast | north-america | 58 to 59 | |
| 28 | new-york | North America: New York State | north-america | 60 | |
| 29 | pacific-northwest | North America: Pacific Northwest | north-america | 61 to 62 | |
| 30 | canada | North America: Canada | north-america | 63 to 64 | |
| 31 | mexico | North America: Mexico | north-america | 65 to 66 | |
| 32 | chile | South America: Chile | southern-hemisphere | 67 to 68 | |
| 33 | argentina | South America: Argentina | southern-hemisphere | 69 to 70 | |
| 34 | south-africa | South Africa | southern-hemisphere | 71 to 72 | |
| 35 | new-zealand | New Zealand | southern-hemisphere | 73 to 74 | |
| 36 | australia | Australia | southern-hemisphere | 75 to 76 | |
| 37 | world-sparkling-wines | World Sparkling Wines | styles | 77 to 78 | |
| 38 | sweet-wines | Sweet Wines | styles | 79 to 80 | |
| 39 | fortified-wines | Fortified Wines | styles | 81 to 82 | |
| 40 | beer | Beer | beyond-wine | 83 to 85 | |
| 41 | sake | Sake | beyond-wine | 86 to 87 | |
| 42 | spirits-liqueurs | Spirits and Liqueurs | beyond-wine | 88 to 91 | |
| 43 | cocktails | Cocktails | beyond-wine | 92 | yes |
| 44 | business-of-the-sommelier | Business of the Sommelier | business | 93 | |

Group names as the app prints them: foundations "Viticulture and vinification"; france "France"; italy "Italy";
spain-portugal "Spain and Portugal"; central-europe "Germany, Austria, Hungary and Greece"; north-america
"North America"; southern-hemisphere "South America, South Africa, New Zealand and Australia"; styles
"Sparkling, sweet and fortified"; beyond-wine "Beer, sake, spirits and cocktails"; business "The business of
the sommelier".

## The fragments (what the extractors write; what `build-cms.cjs` reads)
All under `.scripts/cms/`, JSON with two space indent and a final newline, UTF-8.

### `subjects/<id>.json`
```
{
  "id": "bordeaux",
  "name": "France: Bordeaux",
  "court": "FRANCE - BORDEAUX",               quoted: the Subject Name line as printed (its hyphen is the Court's)
  "group": "france",
  "order": 3,
  "pages": [9, 10, 11],
  "certifiedOnly": false,
  "outcome": { "intro": "After studying this section, a student will ...", "certified": "After studying this section, a candidate will ..." },   quoted; intro is "" on a certifiedOnly subject
  "rows": [
    { "topic": "Geography: Location", "intro": "Southwest France, along the Atlantic coast", "certified": "" },
    { "topic": "Wine Law / Classification", "intro": "...", "certified": "...", "red": 1 }
  ],
  "edits": [ "page 10, row Wine Law / Classification: an en dash before 'Inclusion of Haut Brion' transcribed as a comma" ],
  "checked": null
}
```
- `topic` is the first column as printed (the bold label, with its qualifier after a colon when the guide
  prints one, for example "Geography: Climate Categories", "Wine: White Grape Variety Names"). A row whose topic
  cell is blank in the guide (a continuation of the row above) is folded into the row above with "; ". A topic row the guide prints with both cells blank is not written as a row: it is omitted and logged in `edits` ("page N, row Topic: printed with both cells blank, omitted"), because the build refuses a row blank in both cells.
- `intro` and `certified` are the two columns, verbatim. On a `certifiedOnly` subject the guide has ONE column
  (or several regional columns): write it into `certified` and leave `intro` as "". Where a Certified-only
  subject spreads over regional columns (South France: Provence, Languedoc-Roussillon, Southwest France,
  Dordogne; Spain other DOs: País Vasco, Murcia, DO Pago), the cell is "Provence: ...; Languedoc-Roussillon: ...;
  Southwest France: ...; Dordogne: ..." in the columns' printed order, naming only the columns with text.
- The Spirits and Liqueurs tables (one column per spirit) become one row per attribute per table:
  `topic` "Clear spirits: Region of origin" with the cell "Vodka: Anywhere in the world; Rum: Can be anywhere but
  traditionally Caribbean; Gin: Anywhere in the world", and so on for Agave, Whisky, Brandy, Liqueurs and
  cordials. Text printed in red (Certified level) goes in `certified` with `"red": 1` on the row; black text in
  `intro`. A table with no Introductory/Certified split (Cocktails) puts everything in `certified`.
- Cocktails: one row per cocktail in the printed order (33 names), `intro` "", `certified` "" (the guide prints
  names only; the specs are ours and come later as questions).
- `red: 1` only where the guide prints that cell in red (Spirits). Never elsewhere.
- `edits` lists every transcription decision (a dash, a bullet, a Court typo left as printed, a cell split). It is provenance that never ships: it may quote the Court's American spelling (so it is spared from the spelling rule) but it carries no dash of any kind (29 October, after the first run).
- `checked` is written by the checker: `{ "on": "2026-10-29", "by": "checker", "rowsCompared": 23, "fixes": [ "..." ] }`.

### `syllabus.json` (the 10 page syllabus, quoted)
```
{ "source": "CMS-A 7.2023", "purpose": "...", "description": "...", "prerequisites": ["...", "..."], "who": "...",
  "skills": ["Working theoretical knowledge of principal beverage alcohol.", "Proficiency in tableside service, including: Still and sparkling wine bottle and glass pour service; Food and wine pairing sales ...", "..."],
  "roles": { "restaurant": "Lead Server, Captain, ...", "other": "Winery Tasting Room, ..." },
  "punctuality": "...",
  "schedule": [ { "at": "7:45 AM", "what": "Check-in: Photo ID is required." }, { "at": "8:00 AM", "what": "Introduction" }, { "at": "8:15-8:45 AM", "what": "Tasting Examination" }, ... ],
  "sections": [ { "key": "tasting", "name": "Deductive Tasting Examination" }, { "key": "theory", "name": "Theory Examination" }, { "key": "service", "name": "Hospitality and Service Practical" } ],
  "passing": ["A student must achieve 60 percent or higher on EACH exam section to become a Certified Sommelier.", "All three portions must be passed at the same time at the same exam.", "..."],
  "feedback": "...", "retake": "...", "recusal": "...",
  "rules": { "devices": "...", "food": "...", "cheating": "..." },
  "dress": ["...", "..."], "policies": { "cancellation": "...", "transfer": "..." }, "integrity": ["..."], "rights": ["..."] }
```
Every string quoted. The "8:15-8:45 AM" hyphen is the Court's and stays inside the quoted `at`.

### `tasting.json` (the 3 page list, quoted names and notes)
```
{ "source": "CMS-A 9.2025", "title": "CMS-A CERTIFIED SOMMELIER TASTING EXAM GRAPE VARIETIES AND GROWING REGIONS",
  "whites": [
    { "name": "Albariño", "regions": [ { "country": "Spain", "places": ["Rías Baixas"], "notes": ["No Oak"] } ] },
    { "name": "Chardonnay", "regions": [
        { "country": "France - Burgundy", "places": ["Chablis", "Côte de Beaune", "Mâconnais"], "notes": ["Chablis: No New Oak", "Côte de Beaune: New Oak", "Mâconnais: New Oak", "Village or Premier Cru Only"] },
        { "country": "United States - California", "places": ["Napa Valley", "Sonoma County", "Central Coast"], "notes": ["New Oak"] } ] },
    ... 8 whites in printed order ],
  "reds": [ ... 12 reds in printed order ] }
```
`places` split the slash separated list; `notes` are the starred italics as printed, one per note.

### `grid.json` (the 2 page grid, quoted labels)
```
{ "source": "CMS-A 1-2025", "instructions": "Every line on this test paper has a question that must be answered. ...",
  "white": {
    "colour": { "label": "The primary color is:", "options": ["Straw", "Yellow", "Gold"] },
    "fruit": [ { "key": "apple-pear", "label": "Apple / Pear", "note": "If \"Yes\" provide one specific apple or pear fruit. If \"No\" do not leave blank, write \"None.\"" }, ... citrus, stone-fruit, tropical ],
    "condition": { "options": ["Tart", "Ripe", "Overripe / Jammy / Candied", "Baked / Dried / Bruised"], "nose": "Select one or two fruit condition descriptors for the Nose - see exam.", "palate": "..." },
    "nonFruit": [ { "key": "flowers", "label": "Flowers" }, { "key": "fresh-herbs", "label": "Fresh Herbs, Hay" }, ... every line in printed order ],
    "nonFruitNote": "Non-fruit descriptors combine NOSE and PALATE. ...",
    "structure": [ { "key": "bitterness", "label": "Phenolic Bitterness", "options": ["Yes", "No"] }, { "key": "sweetness", "label": "Sweetness", "options": ["Dry", "Off-Dry"] }, { "key": "acidity", "label": "Acidity", "options": ["Low to Medium -", "Medium", "Medium +", "High"] }, { "key": "alcohol", "label": "Alcohol", "options": [...] } ],
    "conclusion": { "grape": { "label": "Primary Grape Variety", "note": "Select from Examinable Grape Varieties", "choices": 6, "explain": "Explain Why:" }, "climate": { "label": "Climate", "options": ["Cool", "Moderate", "Warm"], "explain": "Explain Why:" }, "country": { "label": "Country of Origin" }, "age": { "label": "Age Range", "options": ["1-2 Years", "3-4 Years", "5+ Years"] } },
    "sell": "Sell this wine to a guest in two sentences or less." },
  "red": { ... the same shape: colour Purple, Ruby, Garnet; fruit red, black, blue; its own nonFruit lines; structure tannin, acidity, alcohol; age 1-3, 4-6, 7+ } }
```
Keys (`key`) are our own lower case hyphenated handles, stable: white fruit `apple-pear`, `citrus`, `stone-fruit`,
`tropical`; red fruit `red`, `black`, `blue`; white non fruit `flowers`, `fresh-herbs`, `green`, `variety-spice`,
`noble-rot`, `oxidation`, `lees`, `malolactic`, `petrol`, `earth`, `mineral`, `new-oak`; red non fruit `flowers`,
`fresh-herbs`, `dried-herbs`, `green`, `mint`, `pepper`, `coffee`, `meat`, `balsamic`, `carbonic`, `earth`,
`mineral`, `new-oak`; structure `bitterness`, `sweetness`, `acidity`, `alcohol`, `tannin`.

### `map/<id>.json` (the subject's doors into the Codex; our own, hand checked)
```
{ "id": "bordeaux",
  "cats": { "intro": ["Bordeaux"], "certified": ["Bordeaux"] },        question categories: exact names from INTRO_GROUPS (js/data-intro.js) and DRILL_GROUPS (js/core.js)
  "chapters": { "intro": ["bordeaux"], "certified": ["Bordeaux"] },    Régionale chapter ids (INTRO_PRIMERS[].id) and Village chapter cats (PRIMERS[].cat)
  "regions": ["bordeaux"],                                             REGIONS region slugs
  "countries": ["france"],                                             REGIONS country keys
  "grapes": ["Cabernet Sauvignon", "Merlot", "Cabernet Franc", "Sauvignon Blanc", "Sémillon"],   names as GRAPES, GRAPES_PLUS or INTRO_GRAPES print them
  "techniques": ["oak", "noble-rot", "blending-assemblage"],           slugs from .scripts/regions/roster.cjs TECHNIQUES
  "serviceRef": [],                                                    SERVICE_REF table keys: faults, glassware, bottles, temperatures, decanting, sparkling, aperitifs, digestifs, spirits, cocktails
  "notes": "why each door, in a line" }
```
`map-subjects.cjs` proposes these; a reviewer confirms every name; the build refuses an unknown one.

### `questions/<id>.json` (the CMS bank, ours)
```
{ "subject": "bordeaux", "questions": [
  { "q": "Which Bordeaux commune ...?", "opts": ["Pauillac", "Margaux", "Saint-Julien", "Saint-Estèphe"], "a": 0, "exp": "...", "grapes": ["Cabernet Sauvignon"], "row": "Wine Law / Classification" },
  { "q": "A 750 ml bottle at a cost of $30 is listed at $120. What is the cost percentage?", "sa": 1, "ans": "25 per cent", "accept": ["25", "25%", "25 per cent", "twenty five per cent"], "exp": "...", "row": "Calculations - Cost %" } ] }
```
Ids are minted by the build (`e-` plus eight base36 of FNV-1a 64 over `JSON.stringify(['cms:' + subject, q])`)
and written back once; never hand written, never `c-` (that is the Village bank's prefix). `row` names the
Court's row the question drills. The rules of `.scripts/regions/BRIEF.md` for a question hold: one fact, one
defensible key, four options of one kind, no answer in the stem, an explanation that teaches, British, no dash,
nobody living, nothing volatile. A short answer carries `ans` (the model answer) and `accept` (every form
`matchSA` should take, lower case, numbers as digits and as words where a candidate might write either).

### `grid/<slug>.json` (what the grid reads, ours; one file per Certified grape)
```
{ "slug": "chardonnay", "name": "Chardonnay", "colour": "white", "say": "shar-doh-NAY",
  "reads": [
    { "region": "Chablis", "country": "France", "climate": "Cool",
      "colour": ["Straw", "Yellow"],
      "fruit": { "apple-pear": ["green apple", "pear"], "citrus": ["lemon", "lime"], "stone-fruit": [], "tropical": [] },
      "condition": { "nose": ["Tart", "Ripe"], "palate": ["Tart", "Ripe"] },
      "nonFruit": ["lees", "mineral", "malolactic"],
      "structure": { "bitterness": "No", "sweetness": "Dry", "acidity": ["Medium +", "High"], "alcohol": ["Medium"] },
      "age": ["1-2 Years", "3-4 Years"],
      "sell": "Two sentences in our own words a server could say.",
      "why": { "grape": "one line on what gives Chardonnay away here", "climate": "one line" } },
    ... one entry per examinable region group as tasting.json prints them ] }
```
Every `fruit` key, `nonFruit` key and `structure` key is a grid line of that colour (the keys above); every
option is one of the grid's printed options; a red entry carries `tannin` and no `bitterness`/`sweetness`
unless the grid has them. `fruit` lists the accepted specific descriptors (lower case); an empty list means
the line is "No". `nonFruit` lists the lines a candidate should mark Yes; every other line is No. `sell` is at
most two sentences, British, nobody named. Sources: the Codex's own GRAPES/GRAPES_PLUS prose (`fruit`, `other`,
`tell`), TASTE's steps (acid, tan, body, alc, oak 0 to 3 read as Low to Medium -, Medium, Medium +, High) and the
region readings in js/regions/*.json (oak, lees, malolactic, carbonic per region), with the Court's own
descriptor vocabulary from grid.json only.

## The build and the gates
- `build-cms.cjs` writes `js/data-cms.js` as `var CMS = {...};` with a provenance header, keys sorted, from the
  fragments in the order above; `--check` proves the file is the build; it refuses a fragment that breaks a rule
  here. `js/data-grid.js` is written the same way from `grid/*.json` as `var GRID_READS = {...}; var GRID_SAY =
  {...}; var GRID_ALIASES = {...};`.
- `.scripts/check-cms.js` and `.scripts/check-grapes.js` are the gates; `check-house-only.cjs` the browser gate.
- Nothing under `.scripts/cms/` ships; the two js files do.
