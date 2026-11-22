# The Champagne houses tab of Brennan's: the authors', refuters' and layer engineer's brief (codex59, 22 November 2026)

The owner asked, in these words: "Also add a Champagne House tab under Brennan's Tab in the Sommelier's codex and do
a deep dive research and tableside description of each house and prestige cuvee". With it came a class sheet he
photographed: two columns, Champagne House and Prestige Cuvée, 23 rows. His standing wish: "make this the best app
possible to help me learn and progress in my career".

He works the floor and studies for the Court of Master Sommeliers. He will say these lines to guests, and in class he
will be asked to match each house to its prestige cuvée. So a wrong fact is worse than a missing one: what cannot be
sourced is left out, and the record's report says so.

One record a house, written as one JSON file: `.scripts/champagne/fragments/<key>.json`. This brief, `plan.json` and
the two pilots (`ayala`, `bollinger`) are all an author needs. The pilots are the measure: read both before you write
a word. A record is about two and a half times a Flagships record: the house, its prestige cuvée in depth, the lines
to say at the table, what guests ask, the traps, the sheet beside the label, three cards and three questions.

Outside Of Time is the owner's own study tool, never sold and used by the owner alone. No legal notice, no price, no
gating, ever.

## Who writes what

| chunk | houses, in the sheet's order |
|---|---|
| pilots (written, the measure) | Ayala, Bollinger |
| h1 | Armand de Brignac, Billecart-Salmon, Delamotte, Salon |
| h2 | Deutz, Duval-Leroy, Drappier, Gosset |
| h3 | Henriot, Krug, Laurent-Perrier, Louis Roederer |
| h4 | Moët & Chandon, Nicolas Feuillatte, Perrier-Jouët, Philipponnat |
| h5 | Piper-Heidsieck, Pol Roger, Ruinart, Taittinger, Veuve Clicquot |

An author writes a chunk, a refuter then tries to refute every record of it, and the layer engineer builds the tab.
The first refuter to finish a chunk refutes the two pilots as well, in a commit of its own: they are not yet refuted.

## What you may run, and what you may not

| You run | What it does |
|---|---|
| `node .scripts/champagne/show.cjs <key>` | Prints what the Codex already holds on a house: the plan's row, the library's record, its own record of the cuvée, the published record in Producers and flagships, the bottles on the list. Writes nothing. |
| `node .scripts/champagne/show.cjs <chunk>` | The same for every house of your chunk. |
| `node .scripts/champagne/show.cjs --sheet` | The sheet beside the labels, all 23 rows. |
| `node .scripts/champagne/build-champagne.cjs --lint <key> [<key> ...]` | Holds your fragment to `schema.cjs`. Writes nothing. |
| `node .scripts/champagne/build-champagne.cjs --lint --chunk <h1 to h5>` | The same, for your whole chunk. |
| `node .scripts/champagne/schema.cjs --caps` | Prints every cap. |

Prefix every node command with `nice -n 19`: other work shares the machine.

Authors and refuters run `--lint` and nothing else. You never run the writing build (`build-champagne.cjs` with no
`--lint`), never edit `js/data-champagne.js`, `keys.v1.json`, `schema.cjs`, `build-champagne.cjs`, `plan.json` or
another author's fragment, and never write an `id`: the build mints every id. Only the spec engineer, the layer
engineer and the integrator run the writing build. `people.json` may grow: whoever meets a living person adds the name
there in the same commit.

The lint prints two kinds of line. A line that starts `fragments/<key>.json:` is a PROBLEM: the field, then the rule.
Fix every one. A line that starts `note:` is advice for a second reader: a titled person with no date beside them, a
claim of a first or an only, a word that speaks of the present (today, now, still), a cellar word in a spoken line, a
field left empty, a record not yet refuted. Read each note, fix it if it is fair, leave it if the sentence is right.
`sound` means no problem stands.

Work on the branch `champagne-wip` in the worktree `/home/user/codex-champagne`. Commit by explicit path, never
`git add -A` or `git add .`, never `commit -a`, never rebase, amend or force push, never switch branch. Through the
lock, then push:

    flock <scratchpad>/flag/git.lock bash -c "cd /home/user/codex-champagne && \
      git add .scripts/champagne/fragments/<key>.json && git commit -q -F <msgfile> && git push -q origin champagne-wip"

If the push is refused because the remote moved, pull inside the lock with `git pull -q --no-rebase origin
champagne-wip` and push again. Every commit message ends with the two attribution lines the task gives. Never the name
of a model or an assistant in a file. Commit after each house, so nothing is lost if you are cut off.

## Read first

1. `node .scripts/champagne/show.cjs <key>`: the plan's row, with its `why` (what the planner knows, to be confirmed
   like any fact) and its `note` (what you must settle); the library's record of the house (`WINE_PRODUCERS`) and its
   own record of the cuvée where it holds one (Cristal, Dom Pérignon, Salon, Comtes de Champagne, Clos des Goisses,
   Sir Winston Churchill, and Rare as a house of its own); the published record in Producers and flagships for the
   four houses that have one (Krug, Moët & Chandon, Louis Roederer, Bollinger: researched and refuted, with what its
   refuter changed and left open); and the house's bottles on the list.
2. **A new record never contradicts a published one without saying so.** A fact the library or the flagships record
   states needs no new source. Where you believe one is wrong, keep your record right and say so in `report`, naming
   the record and the fact. `founded.year` must agree with the library's year and with the flagships record's, or the
   report must name the one you depart from and its year: the lint holds you to it.
3. Research the rest. WebSearch is the tool, within the share your task gives. WebFetch is refused by this network:
   do not try it. Restrict a search to a house's own domain (`allowed_domains`) to read the house through its search
   summary, and mark the source `"read": "search"`. The house's own pages come first: they are primary for the
   house's own dates and methods. The Comité Champagne (champagne.fr, champagne.education) and the Union des Maisons
   de Champagne (maisons-champagne.com, whose chronology is rich in dated ownership) are primary for the
   appellation's rules and the trade's own history.

## The house rules, for every string

They are the Flagships tab's, reused by the lint, not written again:

- No dash of any kind: not the long one, not the short one, not an entity, not two hyphens, not a hyphen standing
  alone between spaces. Use a comma, a colon or a full stop. A range is "7 to 15", "1941 to 1971", never with a hyphen.
  Nothing at or above U+2190.
- British spelling: colour, flavour, ageing, centre, litre, recognise, savoury, per cent, towards.
- Never the retired word for rehearsal, in either spelling: write rehearse, drill, study.
- Levels are named, never numbered: Régionale, Village, Premier Cru, Grand Cru.
- **Nobody living is named**, anywhere: not in prose, not in a source's title, not in a source's address. A house or a
  cuvée that carries a name is the label and is always allowed: Pol Roger, Louis Roederer, Nicolas Feuillatte, Sir
  Winston Churchill, Dom Pérignon, Nicolas François. Say the family, the founder's heir, the cellar master, the head
  of the house. `people.json` here and the Flagships tab's list are both refused by the lint.
- **The long dead are named with their dates**, once, where the story first meets them: "Elisabeth Bollinger, known
  as Lily (1899 to 1977)", "Barbe-Nicole Clicquot Ponsardin (1777 to 1866)". If you cannot find a person's dates in
  two sources, describe the person instead ("the son of a Colombian diplomat"), as the Ayala pilot does.
- No price and no currency: not cheap, expensive, costly, value, bargain, affordable.
- No score, no points, no rating, no medal.
- **Nothing volatile told as a present state**: no current owner, no current cellar master, no current release, no
  production, no "now owned by", "belongs to", "currently", "recent vintages". **Ownership is dated history**:
  "Bollinger's holding company bought it on 7 January 2005", "joined the group in 1987". Name the vintages instead of
  calling them recent. No hectares, with one exception the lint allows: the size of a single walled vineyard in
  `cuvee.sites` and `also.note`, where it is a fact that does not move.
- **No superlative of judgement**: not best, finest, greatest, top, iconic, legendary, renowned, cult, benchmark,
  unique, the most famous. Famous may describe, never rank. A measured first stands with two sources ("the first
  Champagne bottled as a single vineyard, in 1935") or as the house's own claim, said as its claim ("the house calls
  it the first dry Champagne").
- The class sheet is "the class sheet" or "the sheet". The house where the owner works is never named in a record.
- **An empty field is a true answer.** A year nobody is sure of is `""`. A method the house does not state is `""`,
  and the report says so. The letters on a label you could not source are `""`.
- **Every fact rests on two independent sources or one primary one.** A legend is told as a legend ("the story
  goes"). A house's claim is told as its claim ("by its own account"). What you cannot confirm, leave out, and say so
  in `report`.

## The fragment

One JSON object, the house's record. `node .scripts/champagne/schema.cjs --caps` prints every cap; the table is the
summary. Words are counted as the lint counts them.

| field | what it holds | the cap |
|---|---|---|
| `key`, `house`, `producerId`, `cuveeId`, `pick` | copied from your row of `plan.json`, exactly | |
| `say` | a respelling of the house where a guest would stumble, the stressed syllable in capitals (`bo-lan-ZHAY`), or one syllable in capitals (`KROOG`); `""` where no guest stumbles | at most 12 words |
| `founded` | `{ year, what }`: the year the house dates itself from, in figures or `""`, and what that year is the year of | what: 5 to 30 |
| `place` | the village, the part of Champagne, Champagne | 2 to 14 |
| `kind` | `{ code, means }`: the two letters the label carries (`NM`, `RM`, `CM`, `RC`, `SR`, `ND`, `MA`) or `""`, and a sentence that says the term and what it means of this house | means: 8 to 40 |
| `story` | the house as dated history | 150 to 230 words, at least three dated turning points |
| `style.line` | the house style and where it comes from | 15 to 50 |
| `style.grapes` | the grapes and their sources | 8 to 50 |
| `style.reserve`, `vessels`, `malolactic`, `lees`, `dosage` | reserve wines, oak or steel, malolactic, time on lees, dosage, each as the house states it; `""` where it does not | at most 45, 40, 35, 35, 35; at least three of the five stated |
| `style.nv` | `{ name, note }`: the non vintage wine a guest knows the house by (`name` `""` where the house makes none) | name at most 8, note 8 to 45 |
| `cuvee.name` | the prestige cuvée as the label prints it; it must hold the plan's words | 1 to 10 |
| `cuvee.say` | its respelling, or `""` | at most 12 |
| `cuvee.first` | `{ year, what }`: the first vintage or the first release, and which of the two the year is | what: 5 to 30 |
| `cuvee.kind` | `vintage`, `multi-vintage` or `non-vintage` | |
| `cuvee.rhythm` | how often it has been made, as history | 10 to 50 |
| `cuvee.blend` | the grapes in words: no per cent sign, no yearly figures | 6 to 45 |
| `cuvee.sites` | the villages, or the single vineyard | 5 to 55 |
| `cuvee.making` | how it is made | 20 to 90 |
| `cuvee.lees` | the time on its lees | 4 to 35 |
| `cuvee.bottle` | the bottle, where it has a story; else `""` | at most 50 |
| `cuvee.young` | how it tastes on release, in named things, no figure | 15 to 50 |
| `cuvee.aged` | how it tastes with age | 12 to 50 |
| `cuvee.forms` | 0 to 3 `{ name, note }`: a rosé, a late disgorged release, a zero dosage form | name 1 to 10, note 4 to 35 |
| `cuvee.serve` | degrees Celsius in figures (within 6 to 13), whether to decant, the glass | 10 to 45 |
| `also` | ONLY where your row of the plan has one: `{ name, say, standing, first, note, line }`, the second cuvée | note 30 to 90, line 12 to 25 in one sentence |
| `table.house45` | the house in forty five seconds, opening on its name | 90 to 110 words, 4 to 8 sentences |
| `table.house10` | the house in ten seconds | 12 to 25, one sentence |
| `table.cuvee45` | the cuvée in forty five seconds, opening on its name | 90 to 110 words, 4 to 8 sentences |
| `table.sale` | the sale: the hook, then the pour | 15 to 45, exactly two sentences |
| `table.cuvee10` | the cuvée in ten seconds | 12 to 25, one sentence |
| `table.cuvee20` | the cuvée in twenty seconds | 25 to 50, exactly two sentences |
| `guests` | 2 to 4 `{ q, a }`: what guests ask, and the answer | q 3 to 20, a 8 to 50 |
| `traps` | 2 to 4: what is confused with what | 8 to 40 each |
| `sheet` | `{ prints, label, note }`: what the class sheet prints (copied from the plan), what the label prints, and what differs | label 1 to 14, note 8 to 50 |
| `cards` | exactly 3 `{ kind, front, back }`, kinds `house`, `cuvee`, `term` in that order | front 5 to 20, back 2 to 40 |
| `questions` | exactly 3 `{ q, opts, a, exp, tag }`, tags `match`, `house`, `cuvee`, one each | stem 8 to 55, option at most 14, exp 12 to 50 |
| `sources` | 3 to 10 `{ title, url, kind, read }` | title 2 to 20 |
| `report` | never shipped: sentences for the refuter, the integrator and the owner | at most 12 |
| `checked` | never shipped: `null` until the refuter writes it | |

A record reads in at most 1,700 words above its cards, questions and sources. The pilots measure 1,536 (Ayala, with
a second cuvée) and 1,413 (Bollinger).

### The house

- `founded.what` says what the year is the year of: "The year three partners founded the house at Aÿ, under the name
  Renaudin Bollinger." A house that dates itself from a still wine business (Gosset, 1584), from an earlier firm
  (Taittinger, 1734 as Forest-Fourneaux) or from a brand's first release (Armand de Brignac, 2006) says exactly that.
- `kind`: the appellation's own terms for who made the bottle, as the Comité Champagne and the French consumer
  authority define them. `NM`, négociant manipulant: a house that buys grapes, must or wine beyond its own vines and
  makes the wine itself. `RM`, récoltant manipulant: a grower who makes wine from its own harvest alone. `CM`,
  coopérative de manipulation: a co-operative that makes and sells the wine of its members' grapes. `RC`, récoltant
  coopérateur: a grower who sells under its own name wine the co-operative made. `SR`, société de récoltants: a
  company of growers. `ND`, négociant distributeur: a merchant who labels finished bottles it bought. `MA`, marque
  d'acheteur: a buyer's own brand. `means` must say the French term the letters stand for and what it means of this
  house, in a sentence a learner can keep. Nicolas Feuillatte is the lesson of the co-operative; Armand de Brignac
  is a brand made by the Cattier family's house. **Read the letters from a label, a merchant's label photograph or
  the house's own sheet if you can.** If you can only infer them, as the pilots did, give the code, and say in
  `report` that the letters were not read on a label and what the inference rests on, so the refuter reads one. If
  you cannot even infer, `code` is `""`.
- `story`: tell it in order, as dated history, 150 to 230 words. The founding, the widows and the figures with
  their dates, the wars, the turning points, each change of hands with its year, the first vintage of the cuvée.
  Close on what stands today only in words that will not age.
- `style`: `line` is the style in a sentence or two. `grapes` says which grapes lead and where they come from.
  The five fields after it are "as the house states them": quote the house's own figures and say "by the house".
  Where its sheets disagree over time (the Brut Majeur blend moved between Ayala's sheets), give the range in words
  and say so in `report`. Where the house does not state a method, leave the field `""`: both pilots leave
  `malolactic` empty because no page read stated it. `nv` is the bottle a guest already knows: Brut Majeur, Special
  Cuvée, Yellow Label, Moët Impérial. Salon makes none: its `nv.name` is `""` and the note says so. Where the
  prestige cuvée is itself the wine a guest knows (Krug Grande Cuvée, Brut Gold), name it and say so in the note.

### The prestige cuvée

- `name`: as the label prints it. It must hold the plan's words (`Perle d'Ayala`, `La Grande Année`, `Nicolas
  François`, `Rare`); it may add what the label adds (`Cuvée Nicolas François`, `Rare Millésime`). A different cuvée
  is the engineer's change to `plan.json`, not yours: say why in your report and tell the lead.
- `first`: one year and what it is. A first vintage and a first release are different years for most of these wines
  (Dom Pérignon: the 1921 vintage, released in 1936): `first.year` is the first vintage where the cuvée is a
  vintage wine, and `what` says so and may give the release year too; for a multi vintage blend it is the first
  release. A renamed wine says what the year is: La Grande Année's 1976 is "the vintage with which the house's
  vintage wine took the name".
- `kind` and `rhythm`: vintage, multi-vintage (Krug Grande Cuvée, Grand Siècle, Brut Gold: blends of several
  harvests on purpose) or non-vintage. `rhythm` says how often it has been made, as history: the vintages the house
  has declared, a count the house itself gives ("the thirteenth vintage since 1995"), never "every few years" from
  nowhere.
- `blend`: "Pinot Noir, from about three fifths to two thirds, with Chardonnay for the rest; no Meunier." Refused: a
  per cent sign. Where the house has never published the blend (Sir Winston Churchill), say exactly that and give
  no proportion at all.
- `sites`: the villages by name and their part of Champagne, or the single vineyard, its village, its slope and
  its size. Where the villages change by vintage, say which vintage you are quoting.
- `making`, `lees`: vessels, cork or crown cap, riddling and disgorging, dosage in grams a litre where the house
  gives it, and the time on lees in the house's own words. Cellar terms are welcome here: this is a study page.
- `bottle`: only where the bottle has a story (Cristal's clear, flat bottomed glass; Belle Epoque's anemones of
  1902; Brut Gold's metal; Rare's tiara; Palmes d'Or's dimples; the Perle shape of 1995). Else `""`.
- `young`, `aged`: name the thing, never the family. The generic refusal of the Grapes tab holds here, in the
  table lines, the guests' answers, the cards and the questions: citrus, red fruit, stone fruit, floral, flowers,
  spice, mineral, minerality, oak, earthy, herbal standing alone between commas or beside an "and" is refused. Good:
  "toasted bread, hazelnut and candied orange peel over lemon zest". Draw the glass from the house's own notes and
  one critic's; never invent a note, and never say how long it keeps unless a source does.
- `forms`: its other forms and nothing else of the house's range: a rosé of the same name, a late disgorged or
  late released form (R.D., P2, Vinothèque), a zero dosage form. The house's other prestige wines are not forms:
  they belong in `traps` and `guests`.
- `serve`: "9 to 11 degrees Celsius, never ice cold; no need to decant; a tulip or a white wine glass." Agree with
  the Codex's service reference: sparkling 8 to 10 degrees Celsius, a fuller, oak aged Champagne 9 to 12. Where the
  house's own pages give a figure, say it.

### The second cuvée (`also`)

Only four rows carry one, and the plan says how each stands:

- **Ayala**, `before`: the sheet prints "Grand Cuvée/Perle d'Ayala". Grande Cuvée is the older vintage wine; Perle
  d'Ayala is the prestige cuvée made since 1995. The pilot shows how to teach a second cuvée that could barely be
  sourced: say what was found, leave the rest out, and keep `first.year` empty.
- **Billecart-Salmon**, `beside`: the sheet prints "Clos St. Hilaire/Cuvée Nicolas Franco" and is cut off at the page
  edge. The record's cuvée in depth is Nicolas François, the prestige cuvée a guest meets; Le Clos Saint-Hilaire, the
  single walled vineyard of Pinot Noir beside the house, is the second, made beside it.
- **Henriot**, `before`: the sheet prints "Cuvée des Enchanteleurs/Hemera". Hemera is the cuvée made since the 2005
  vintage; Cuvée des Enchanteleurs is the one before it, history.
- **Piper-Heidsieck**, `after`: the sheet prints "Formerly Rare". The record's cuvée in depth is Rare, as the cuvée
  that was Piper-Heidsieck's; the second is Hors-Série, what the house has made since Rare became a house of its
  own. The sheet does not print Hors-Série, so the plan's `also.sheet` is `""`. Teach both sides: the class answer
  is Rare, and a guest who asks for Piper-Heidsieck's prestige cuvée today deserves the true answer.

`also.standing` is copied from the plan. `also.note` says what the wine is, how it stands to the first and what a
learner must keep; `also.line` is one spoken sentence that names it.

Three more rows need a ruling the plan already made; follow it:

- **Delamotte**: the sheet fills the row with "(Salon) Blanc de Blancs". Delamotte has no cuvée with a prestige
  name. Its record's cuvée is the Blanc de Blancs, the non vintage and the vintage both told, and the record says
  plainly that Salon is its sister house, with a record of its own.
- **Armand de Brignac**: a brand, first released in 2006, made by the Cattier family's house; the sheet's "NV" is
  the trade's shorthand and is not on the label.
- **Deutz**: two prestige cuvées, Amour de Deutz (the sheet's) and Cuvée William Deutz. The record's cuvée is Amour
  de Deutz; a trap and a guest's question keep the other apart.

### At the table

Six spoken lines. They are said aloud to a guest, so the lint holds each to the Grapes tab's rules of a spoken
line: no sentence over 32 words, no list longer than three, no bracket, no semicolon, no abbreviation and no sign
(the house's own name may carry its ampersand; say "non vintage", never the two letters).

- `house45`, 90 to 110 words in 4 to 8 sentences, opening on the house's name: where it is, when it began and by
  whom, the one story a guest will remember, what makes the style, the wine most guests know, and the prestige
  cuvée by name. Ownership only with its year.
- `house10`, one sentence: the house in a breath.
- `cuvee45`, 90 to 110 words in 4 to 8 sentences, opening on the cuvée's name: what it is, its grapes and where
  they grow, the one thing that sets it apart, how it tastes in three named things, how you serve it.
- `sale`, exactly two sentences: the hook for a guest who is deciding, then the pour ("May I bring a bottle for the
  table?"). It names the cuvée, promises nothing a source does not, and never a price.
- `cuvee10`, one sentence; `cuvee20`, exactly two.

Cellar words (lees, dosage, disgorged, riddled) draw a note in a spoken line: keep one only where the same breath
says what it does ("cleared of its sediment by hand"). Say every line aloud before you commit.

### Guests, traps, the sheet

- `guests`: two to four questions a guest really asks, with the answer you would give: "Is Ayala the same as
  Bollinger?", "What does R.D. mean?", "Is it sweet?", "Does Bollinger make anything above La Grande Année?". Where
  it is fair to ask which wine is the house's true prestige cuvée (Bollinger's Vieilles Vignes Françaises, Krug's
  Clos du Mesnil, Billecart's Clos, Deutz's two), answer it here.
- `traps`: two to four confusions a candidate makes, the sheet's spellings among them wherever the sheet and the
  label differ (13 of the 23 rows). The cross house confusions are the heart of the class: Grande Cuvée (Krug)
  against the sheet's Grand Cuvée for Ayala, La Grande Année against La Grande Dame against Grand Siècle, Dom
  Pérignon against Dom Ruinart, the three Heidsiecks, Salon against Delamotte, the oldest Champagne house (Ruinart,
  1729) against the oldest wine house (Gosset, 1584). **A trap that two records share must read alike in both**:
  write it as the library already states it (`show.cjs` prints the library's traps).
- `sheet`: `prints` is copied from the plan, exactly, spellings kept; it is the one string the voice rules do not
  read. `label` is what the label prints (both names where the sheet prints two). `note` says what differs and why
  it matters, or that they agree. The sheet is never corrected and never mocked: it is a class handout, and the
  record's job is to let the owner answer it and know the label.

### Cards and questions

- `cards`, exactly three, in this order. `house`: the house to its cuvée (the front names the house and never the
  cuvée; the back names the cuvée as the label prints it, and the second name where the sheet prints two).
  `cuvee`: the cuvée to its house (the front names the cuvée and gives the house away only where the cuvée's own
  name holds it; the back names the house). `term`: one number or term a candidate must hold (a closure, a first
  vintage, what R.D. means, a village, a dosage). The front never gives the back away.
- `questions`, exactly three, four options, one right. `match`: the house and its cuvée, asked so the options are
  four cuvées or four houses of the sheet and the stem does not hold the key; choose the wrong options a candidate
  really confuses (the Bollinger pilot offers La Grande Dame, Grand Siècle and Grande Cuvée). `house`: its history
  or its style. `cuvee`: the wine itself. Never NOT or EXCEPT, never all or none of the above, the key never much
  the longest. `exp`, 12 to 50 words, teaches: why the key is right, and whose the nearest wrong answers are. Key
  the answer where you like: the build deals the positions.
- **A front and a stem are frozen once the integrator freezes the keys.** Word them as you would want them read in
  a year: a reworded front or stem is a new card or question and orphans a learner's record.

### Sources, report and checked

Each source is `{ "title", "url", "kind", "read" }`. `title` is the publisher and the page ("Bollinger: La Grande
Année 2014", "Union des Maisons de Champagne: Maison Ayala"), never an author, and neither title nor address names a
living person. `kind` is `primary` (the house's own pages for its own dates and methods, the Comité Champagne, the
Union des Maisons de Champagne, a decree) or `secondary`. `read` is `page`, `search` or `book` (a reference work
cited by its title alone, with `"url": ""`). Three to ten, at least one https address, and a record with no primary
source draws a note.

`report`, at most twelve sentences, is for the refuter, the integrator and the owner: every fact left out and why;
every tension with a published record (the library, the flagships record, the Champagne region record), named;
whether the label's letters were read; which style fields are empty; where two sources disagree and which you
followed. The pilots' reports are the measure. `checked` stays `null` until the refuter writes it.

## The refuter: refute, then record

A refuter reads each record of a chunk with one instruction: refute it. Every date, name, grape, village, method,
figure, label word and story beat is tried against two sources or one primary. The spoken lines are read aloud for a
claim no source carries. The refuter fixes what is wrong in place, cuts what cannot be confirmed, reads a label for
the house's letters where the author could not, lints the fragment sound, and writes on the record:

    "checked": { "date": "2026-11-23", "by": "refuter", "verdict": "sound" or "changed",
                 "changed": [ "cuvee.first: the first vintage was 1995, not 1994; the house's own page" ], "open": [] }

`changed` lists every change in a sentence; `open` lists what the refuter doubts and could not settle. The whole
build ships only records with a refuter's record, so nothing reaches the owner unrefuted. The refuter also writes
`.scripts/champagne/reviews/check-<key>.json`: the searches run, per field what was tested, every change with was,
now, why and its sources, what stays open, the living names met (added to `people.json` in the same commit), and
the published records of the Codex found in tension (`codexInTension`), which are listed for the owner and never
changed here. A refuter does not reword a card's front or a question's stem once the keys are frozen; before the
freeze, a front or a stem that is wrong is fixed like any other field.

## Changing the plan

`plan.json` is changed only by the spec engineer or the layer engineer, never by an author or a refuter, and never
by two agents at once. An author who finds that the label prints other words than the plan's `cuvee`, that a second
cuvée is missing or wrongly standing, or that a library id is wrong, writes the record as far as the plan allows,
says so in `report` and tells the lead. A house's `key` never changes once the keys are frozen: it seeds the
record's id. The sheet's wording (`sheet`) never changes at all: `schema.cjs` holds the sheet as a constant.

## The pilots

Read `.scripts/champagne/fragments/ayala.json` and `bollinger.json` whole. What each shows:

- **Ayala**: a house the library does not hold, so every fact stands on the house's own pages, the Union des
  Maisons de Champagne or two secondary sources. A founder whose dates were not found, described and not named. An
  ownership date found exact (7 January 2005) and another left out because sources disagree (the Frey group's
  purchase). A second cuvée barely sourced, taught as far as it could be. A label whose name moved by vintage (Perle
  d'Ayala, La Perle, Perle), said in `sheet.note`, a trap and the report.
- **Bollinger**: a house with a published flagships record. Every fact of that record is kept; what the house's own
  pages add (19 crus in the 2014 vintage, 11 in the 2015; the name Grande Année from the 1976 vintage) is added and
  the report says which refinements the integrator should see. The service temperature keeps the published 9 to 11
  degrees Celsius and reports the house's own range beside it. Where two sources date a detail differently (when La
  was added to the name), the record does not date it.

## What the lint cannot hear

The lint counts and refuses; it does not taste or read history. Before you commit, say each table line aloud: would
a guest follow it, and would the house recognise itself in it? Does every note in the glass belong to that wine?
Is every date in two sources or the house's own page, every legend told as a legend, every person either dead and
dated or not named? Would the owner, having learnt the three cards and the three questions, match this house to its
cuvée in class and tell a guest something true about it? Is anything in the record true only this year?

## Before you commit

1. `nice -n 19 node .scripts/champagne/build-champagne.cjs --lint <key>` prints `sound`.
2. Every note read and answered.
3. `report` written: what was left out, what is in tension, what the refuter should read on a label.
4. Stage your one fragment (and `people.json` if it grew) by path, commit through the lock, push.

## The pipeline, for the engineers

- `plan.json`: the 23 houses in the sheet's order. Each: `key`, `house`, `cuvee` (the label's words), `sheet` (the
  sheet's words, held to the constant `SHEET` in `schema.cjs`), `also` (four rows), `producerId` (19 rows) and
  `cuveeId` (7 rows) of `WINE_PRODUCERS`, `pick` (4 rows, the key in `.scripts/flagships/plan.json`'s Champagne
  group), `chunk`, `why`, `note`.
- `schema.cjs`: the one validator. `--caps` prints the caps; `--test` proves the two pilots sound and seeds 40
  faults (34 into a pilot, 6 into the plan), each refused by the rule that names it.
- `build-champagne.cjs`: `--lint <key>` or `--chunk` or `--all`; the writing build (whole: every house sound and
  refuted, else nothing is written); `--partial` (what exists, unrefuted records shipped when sound, the header
  saying so); `--check` (the file and the keys are the build, byte for byte); `--plan` (the plan against the sheet,
  the library, the flagships picks and the prefix); `--freeze` (the whole build, then the keys frozen).
- `js/data-champagne.js`: `var CHAMPAGNE_HOUSES = { meta, houses }`, one line a record, in the sheet's order, each
  record with its `id` first and then the schema's fields in order (`also` only where the record has one); `report`,
  `checked` and a source's `read` never ship. `meta`: `{ version, edition, roster, built, partial, prefix, cards,
  questions }`.
- The ids: `hc-` and eight base36 digits of FNV-1a 64 (build-regions.cjs's mint) over `JSON.stringify(['champagne',
  key])` for a record, `['champagne:' + id, front]` for a card and its stem for a question. `hc-` is a prefix
  nothing else under `js/` mints (`ch-` was refused because the library's ids hold it: `p-ch-montrose`). The answer
  positions are dealt by the build, round robin from three times the house's place in the sheet and shuffled from
  the key, so a deal moves no id.
- `keys.v1.json`: every id, unfrozen while the roster is written. The integrator freezes it from the whole build.

## The layer

For the layer engineer. `js/codex59.js` is on the chain as a shell: the head comment, `V59_WORDS`, `v59W` and the
`v59-style` element, nothing drawn, nothing wrapped. Build the tab in it. The house rules are codex58's: var and
function only; every wrapper typeof guarded, the guard on the line above it, and outermost; every registry extended
key by key and never replaced; every string the layer shows in `V59_WORDS`, read by `v59W`; its CSS in the
`v59-style` element, every selector starting `.wrap`, every colour a house token on its own ground; no published
layer (`codex1.js` to `codex58.js`), `boot.js`, `core.js` or published data file edited. The line numbers below are
this branch's at the spec step.

### Where the tab stands today

The house tab (Brennan's on the owner's device: the word is `v41TabWord()`, `js/codex41.js:126`, the house's own
name, never a literal in the layer) has four workspaces, which the code calls rooms:

- The rooms are one registry, `V48_ROOMS` (`js/house-learning-flow.js:4` to `7`): `brennans` Wine list,
  `housestudies` Wine studies, `houserehearsal` Service rehearsal, `housereference` House reference.
  `v48NavHtml(active)` (`:14` to `19`) draws them as a `nav.v48-nav` of `button.v48-nav-button`, each with
  `id="v48-nav-<view>"` and `data-v48-route="<view>"`, the active one `aria-current="page"`. `v48RoomName(view)`
  (`:10` to `13`) reads the same registry.
- The Wine list, `#/v/brennans`, is codex41's view as codex48 wraps it (`js/codex48.js:82` to `112`): it writes
  `v32Head(v41TabWord(), ...) + v48NavHtml('brennans')` and wires the page with `v48WireKeep(box, 'brennans', h)`.
- The other three are hubs: `V48_HUBS` (`js/codex48.js:4`) is walked once at load (`:123` to `131`) to set, for each,
  `V32_OWNER`, `V25_UNDER`, `V25_HUB`, `V25_AREA` and `V32_PARENT` to `brennans`, `V41_REDRAW[view] = 1`, a `V25_GO`
  that pushes the view and a `V25_VIEWS` that builds `v48HubHtml(view, h)` (`js/house-learning-flow.js:111` to `123`)
  and wires it with `v48WireKeep`. Pushing a name onto `V48_HUBS` later does nothing: it has been consumed.
- `v48WireKeep(box, view, h)` (`js/house-learning-flow.js:134` to `187`) is what makes any page a room: it gives
  every control an id, remembers open disclosures per house and room, and hears every click on `[data-v48-route]`
  (`:170` to `186`): a tap on the current room's own nav button scrolls to the top and adds no history entry; any
  other route is `v32Go({ view, arg }, 'push')`.
- The nav's layout is `css/house-learning-flow.css:3` (four equal columns) and `:39` (two columns at 600 px and
  under); day service colours the active button at `:41`.
- Back: `V32_PARENT[view] = 'brennans'` for the three hubs, and codex48 wraps `v32ParentRoute`
  (`js/codex48.js:132` to `139`) for the screens under them. A cold address is re-applied once at
  `js/codex48.js:143` to `147`.
- The addresses are codex32's: `#/v/<view>` and `#/v/<view>/<arg>` are read by `v32Parse` (`js/codex32.js:624`, the
  `v` branch at `:646` to `659`) into `{ view, arg }` for any view that `V32_PARENT` holds, and written by
  `v32Route` from `v32Arg(view)` (`:573`). A view not in `V32_PARENT` falls to Home.

### The ruling: a fifth room, one view, an argument

1. **Champagne houses is a fifth room of the house tab**, not a door inside House reference and not a view of the
   Wine Atlas. The owner asked for a tab of its own under Brennan's, so it stands in the row of rooms, last.
   codex59 extends the registry: `V48_ROOMS.push(['champagne', v59W('tab')])`, typeof guarded, once (never if the
   registry already holds the view). No published layer is edited and `v48NavHtml` is not wrapped: every room's
   nav, codex51's recovery page included (`js/codex51.js:107`), then draws five buttons, and `v48RoomName` knows the
   word. `house-learning-flow.js` is not a codex layer and may be maintained with care, but it needs no edit for this.
2. **One view, `champagne`, with an optional argument.** `#/v/champagne` is the root; `#/v/champagne/<key>` is a
   house, keyed as `plan.json` keys it (`ayala`, `moet-chandon`), which is the record's `key` in the data. An
   address naming no house the device holds falls to the root. Register the view as codex58 registers its three
   (`js/codex58.js:435` to `519`: `V58_VIEWS`, `V58_ARGS`, `v58View`, and the wraps of `v32Arg`, `v32Apply`,
   `v32ParentRoute`, `v25NavWord` and `v25MainName`), with the house tab in place of the Wine Atlas: `V32_OWNER`,
   `V25_UNDER`, `V25_HUB` and `V25_AREA` set to `brennans`, `V32_PARENT.champagne = 'brennans'`, `V41_REDRAW.champagne
   = 1`, and in `v32Apply` `S._v25area = 'brennans'`. Re-apply a cold address once, as `js/codex58.js:1542` to
   `1554` does.
3. **The pages are rooms.** Both write `v32Head(v41TabWord(), <the room's or the house's name>)` and
   `v48NavHtml('champagne')` under it, inside `div.v25page.v32-root.v48-flow` with the layer's own class beside
   them, and are wired with `v48WireKeep(box, 'champagne', h)` (typeof guarded) so the nav, the kept disclosures
   and the focus rules behave as in the other four. On a house page the Champagne houses button is still the
   current room: a tap on it must go to the root, so hear that tap in the layer before `v48WireKeep` treats it as
   "already here" (`js/house-learning-flow.js:174`), or draw the nav with no current room on a house page. Rule it
   one way and test it.
4. **Back** climbs a house to the root, the root to the Wine list (`#/v/brennans`), the Wine list to Home, warm and
   cold, through `v32ParentRoute`: `{ view: 'champagne' }` from a house, `{ view: 'brennans' }` from the root. The
   layer draws no Back of its own.
5. **The tab needs no house.** Its records are general knowledge: with no house loaded the root and every house
   page still draw whole, and only the section that reads the list is absent. The other rooms say "The house
   collection is not loaded" in that state; this one does not.
6. **Five buttons on a phone.** The nav's grid is four columns, two at 600 px and under, so a fifth button stands
   alone on a row. Restyle it in `v59-style` with selectors that start `.wrap` (five columns above 600 px; on a
   phone the fifth spanning both columns, or the row scrolling sideways), and read it at 320, 375 and 390 px, day
   and night: every word whole, every button at least 44 px, no sideways scroll of the page.

### What the pages hold

- **The root**: the 23 houses in the sheet's order, each a row naming the house and under it the cuvée as the
  label prints it (both names where the record has `also`), opening the house. Ahead of the rows, the sheet's own
  purpose: Study (the matching cards with the count due today, the quiz), and a line saying how many houses are
  written when the data is a partial build (`CHAMPAGNE_HOUSES.meta.partial`). A row for a house not yet built is
  not drawn: the layer reads `CHAMPAGNE_HOUSES.houses` as it grows and is not edited when it does.
- **A house**: the house, Say it, Founded (the year and what it is the year of), the place and what it is in the
  appellation's terms (`kind.code` with the French term from a table in `V59_WORDS`, then `kind.means`). **At the
  table first**: the forty five second line of the house at 20 px in the house reading face, as codex57 and
  codex58 set theirs, with the ten second line; then the cuvée's forty five second line, the sale, the ten and the
  twenty. Then chips and sections in this order: The prestige cuvée in full; The second cuvée (only with `also`,
  headed by how it stands: made beside it, made before it, made since); The house style; The story; What guests
  ask; Traps; The class sheet and the label (`sheet.prints` beside `sheet.label`, then the note); On the list;
  Study; In the Codex; Sources closed at the foot; the houses before and after in the sheet's order.
- **On the list**: the house's bottles of that producer, read live from the house (`v53House()`, `v28Wines`), the
  producer over the wine and never a price, each opening its wine card through the list's own door with Back
  returning to the house page. codex58 already solved the matching (`v58IsHouse`, `v58HouseWines`,
  `js/codex58.js:931` and `:947`, and `v58OpenWine`, `:983`): call them typeof guarded with `{ producer, producerId }`
  from the record, or follow them. Dom Pérignon and Rare are filed under their own names on the list: the record's
  `cuveeId` is the library record whose name to match as well. Nothing is drawn when no house is loaded or it pours
  none. On the 2 November pack the list holds bottles of Bollinger (La Grande Année 2015 among them), Krug, Moët &
  Chandon with Dom Pérignon P2, Piper-Heidsieck and more: `show.cjs <key>` prints each house's.
- **In the Codex**: the library producer page (`producerId`, 19 houses; `v58OpenProducer`, `js/codex58.js:747`, shows
  the way), the library's own record of the cuvée (`cuveeId`, 7), the house's page in Producers and flagships (the
  4 with a `pick`: the flagship record is the one whose `key` is the pick, its address `#/v/flagship/{id}`), and the
  Champagne region page. Back returns to the house page from each.
- **Study**: decks on codex32's one card screen, as codex58 wires its own (`js/codex58.js:1142` to `1263`):
  `champcards` (every card), `champmatch` (the `house` and `cuvee` cards alone: the class's matching drill, both
  ways), `champcards:{key}` (a house's three) and `champdue`; the card kind's face the question over the house's
  name, then the answer with a door to the house; each grade a due date by the Codex's own steps (`v56Step`,
  `v56Today`, `v56AddDays`, typeof guarded), kept per device in `oot-codex-champrs-v1` under `OOT.profiles.key`
  (`{ c, q }`), no other slot touched. The quiz deals the questions through the core engine as codex58 does
  (`:1270` to `1445`): a house's three, the `match` questions alone, or ten a round from all with the ones due
  first. An `hc-` key is never level progress, never in codex3's rotation, never an orphan: wrap `keyOwned`,
  `srsRecord`, `qidAudit`, `findByKey`, `graderDisputes` and `badReports` as codex58 does for `fl-`. The decks and
  the quiz light the house tab and climb to the root or the house they were opened from; codex54 decides a house
  deck's parent by `V54_HOUSE_DECKS` (`js/codex54.js:1238`), which does not know these names, so the layer's own
  `v32ParentRoute` wrapper must answer first.
- **No door outside the house tab is required.** The house-only rule (`check-house-only.cjs`, its section 4) keeps
  Home, the level page, the cards and quizzes root under More, the Library, Quizzes and the bank free of house doors, and its search
  for Champagne in the Library must still find no house wine. Do not add the tab to the Library's search or to
  Home. A door from the four Champagne pages of Producers and flagships to the house page here is welcome if it
  can be added through codex58's own registry (`V58_SECS`, `js/codex58.js:705`) without wrapping its page builder;
  if it cannot, leave it out and say so.

### The pins that move, and only with the fact they pin

Moved at the spec step, with the two files joining the chain: `index.html` (two tags after codex58); `sw.js`
(`codex-v122`, two assets after codex58); the literal order lists of `check-atlas-ui.js`, `check-brennans.js`,
`check-cms.js` (its order list, its chain list and their two descriptions), `check-components.js`, `check-nav.js`,
`check-videos.js` and `check-winelist.js`; the conditional lists of `check-regions.js`, `check-atlas-course.js`,
`check-grapes-table.js` (section 1, and its section 8 base, which now also leaves out codex59's two files and proves
no `V59_WORDS` in it) and `check-flagships.js` (section 1: codex59's two files stand between codex58 and boot where
the chain carries them); and the two worker mutation strings that name the worker's name of the day
(`check-flagships.js`, `check-grapes-table.js`). Every gate is green on that tree.

The ruling was tried at the spec step on a scratch copy of this tree, with a probe layer that did only what the
ruling says (the room pushed onto `V48_ROOMS`, the view registered, `v32Arg`, `v32Apply` and `v32ParentRoute`
wrapped, the cold address re-applied). In a browser at 390 px: every room's nav drew five buttons, the tab lit the
house tab, `#/v/champagne` and `#/v/champagne/<key>` answered warm and cold, Back climbed a house to the root to
the Wine list to Home, an unknown key fell to the root, and no page error was raised. Two things it showed that the
layer must settle: a tap on the Champagne houses button from a house page did nothing (ruling 3), and the fifth
button stood alone on a row at 320 px (where its two words wrapped to a second line), at 390 px and at 1,024 px
(ruling 6). Of the gates, exactly two failed, both named below: `check-house-flow.cjs` at its no-house count, and
`check-flagships.js` at its outermost check, which named `v32Arg`, `v32Apply` and `v32ParentRoute`. `check-card.js`,
`check-house-only.cjs`, `check-nav.js`, `check-brennans.js`, `check-home.js`, `check-house.js`, `check-study.js`,
`check-cms.js`, `check-grapes-table.js` and the learning and training gates passed untouched.

To move with the layer, each in the commit that changes the fact:

- `check-house-flow.cjs:269`: with no house loaded each hub's nav holds exactly four routes. It holds five once the
  room is registered: pin five where the page carries the layer (read `typeof V59_WORDS` in the page), four where
  it does not, so the gate still passes on a tree without codex59. `:72` reads the first four route texts in order
  and `:121` asks for at least four: both stand as they are, which is why the room is pushed last. `:14` and `:15`
  list the four rooms the gate walks; add the fifth to that walk (its address, the lit tab, the current button
  adding no history entry, cold Back to the Wine list) rather than loosening a check.
- `check-house-only.cjs:160` to `161` (it passed in the probe, so these are additions, not repairs): the owners
  table gains `#/v/champagne` and `#/v/champagne/ayala`, each
  lighting `brennans`; its cold Back chains (section 3) gain a house to the root to the Wine list to Home. `:56`,
  `HOUSE_DOOR`, is the list of doors that may not appear outside the house tab: add `champagne` to it, so the sweep
  proves the tab did not leak.
- `check-card.js:543` to `562`: it reads the rows of the Service rehearsal and Wine studies hubs through
  `v48HubHtml` and knows the attribute `data-v48-route`. It passed with the fifth button in the probe, so nothing
  of it moves for the room alone; run it again once the decks and their parents exist (its Back table, `:654` to
  `672`, is where a house deck's parent is pinned).
- `check-flagships.js:975` to `976`: codex58's wrappers are proved outermost by finding `_v58` in the source of the
  live function. codex59 will wrap several of the same functions (`v32Arg`, `v32Apply`, `v32ParentRoute`,
  `v25NavWord`, `v25MainName`, `v32DeckDef`, `v32StartRun`, `v32CardFace`, `v32CardHtml`, `v32Learnt`, `v32Grade`,
  `startDrill`, `keyOwned`, `srsRecord`, `qidAudit`, `findByKey`, `graderDisputes`, `badReports`), and that check
  will then fail as written. The fact it pins becomes: codex58's wrapper is on the chain directly under codex59's
  (the live function's source holds `_v59`, and the function codex59 saved holds `_v58`), or outermost where
  codex59 does not wrap. Move the check to say exactly that; do not delete it.
- `check-nav.js`: its order list moved at the spec step; its bar still draws four tabs and More, which the tab
  does not change.
- The worker: `CACHE` moves with every commit that changes a listed file, and the two mutation strings with it.
  The data stamp in `index.html` (`data-champagne.js?v=1`) moves when the data ships whole.
- `CLAUDE.md`: a codex59 section at the integration, and the "next layer" line to codex60.

### The gate to write

`.scripts/check-champagne.js [jsDir] [--partial] [--mutations]`, modelled on `check-flagships.js`: the load (the
two files after codex58 and before boot; the layer ran); the data (every record through `schema.cjs`, the data the
build byte for byte, the ids against the keys, the roster the sheet's 23 in the sheet's order once whole, the
counts pinned exact in one constant, nobody living, `schema.cjs --test`); every page drawn clean with every
section in its order and At the table first; the root; the fifth room on all five rooms' navs; the addresses warm
and cold and each Back; On the list on the fixture house; the decks, the face and the schedule on seeded grades;
the quiz; the `hc-` keys never level progress; the shell and the chain rule; the layer's file in the strictest
voice, its colours on their own ground. `--mutations` seeds faults, each caught by the check that names it. A tree
with no `codex59.js` is skipped, so the site's wing gates run it safely before the publish.

Run every gate with the runner the spec step left: `SITE_ROOT=<scratchpad>/flag/site-2nov PORT=<a free port>
nice -n 19 bash <scratchpad>/champagne/gates.sh [words]` (five house gates pin the 2 November pack, which is why the
shared layer is read from that copy). Then walk the tab on a phone at 320, 375 and 390 px, day and night.
