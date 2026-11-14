# The Flagships tab of the Wine Atlas: the authors' and checkers' brief (codex58, 11 November 2026)

The owner asked, in these words: "add a tab under Study in Wine Atlas section of the Sommelier Codex that will contain
5 of the most famous and well known producers in each wine region such as Champagne, Piedmont, Napa etcetera. Also
list their most famous flagship wine with deep full details and backstory on each."

So every region of the Wine Atlas gains five houses a sommelier is expected to know, each with the one flagship wine
a guest or the Court would expect you to know, told in depth: what is in the bottle, where it grows, how it is made,
how it tastes, how to serve it, the words on its label, the line to say at the table, and the story behind it. The
owner chose all 129 regions in two waves. Wave one is 43 classic regions in 51 groups of five: 255 records. You write
one group at a time, as one JSON file: `.scripts/flagships/fragments/<group>.json`. This brief, `plan.json` and the two
pilot fragments (`champagne`, `bordeaux-left`) are all you need. The pilots are the measure: read both before you write
a word.

Outside Of Time is the owner's own study tool, never sold and used by the owner alone. No legal notice, no price, no
gating, ever.

## Wave two (14 November 2026)

Wave two is the other 86 region records, one group of five producers each, published in three batches that each ship
whole: A (France, Italy, Spain, Portugal: 32 regions), B (Germany, Austria, Hungary, Greece: 27) and C (the New York
sheet, Argentina, Chile, Australia, New Zealand, South Africa: 27). Wave one's 255 records and their ids never change.

- **A group is keyed by its region slug** (`jura`, `finger-lakes`, `hawkes-bay`): its fragment is
  `fragments/<region slug>.json`, its `title` is the region page's own heading, it carries its `batch` and a chunk of
  wave two's, and it is the one group of its region record. Each record is written exactly as wave one's.
- **The thin region rule.** Where a region has few houses a guest would know, the group is still five: five real
  producers of the appellation itself, each with a real wine it makes there (its flagship where it has one, else the
  wine it is known by), and the `why` and the story say plainly what each is (a co-operative, a young estate, a house
  known at home and little abroad). Never inflated: no house grander than its sources make it. Where five cannot be
  sourced, tell the merge agent; a group never ships short.
- The whole build ships only the batches `plan.json`'s `built` names: a fragment of a batch not yet built is linted
  and never shipped. `node .scripts/flagships/build-flagships.cjs --lint --batch <A|B|C>` lints every written fragment
  of a batch.
- Wave two works on the branch `flagships-w2`: pull inside the lock before you start
  (`git pull -q --no-rebase origin flagships-w2`) and push there.
- Every other rule of this brief is unchanged: the house rules, the fragment and its caps, the sources, the
  checker's record and the swap.

## What you may run, and what you may not

| You run | What it does |
|---|---|
| `node .scripts/flagships/show.cjs <group>` | Prints what the Codex already holds on the group and each of its five houses. Writes nothing. |
| `node .scripts/flagships/show.cjs <pick key or producer id>` | The same for one house (`krug`, `p-ch-latour`). |
| `node .scripts/flagships/build-flagships.cjs --lint <group> [<group> ...]` | Holds your fragment to `schema.cjs`. Writes nothing. |
| `node .scripts/flagships/build-flagships.cjs --lint --chunk <f1 to f17>` | The same, for your whole chunk. |
| `node .scripts/flagships/schema.cjs --caps` | Prints every cap. |

Authors and checkers run `--lint` and nothing else. You never run the writing build (`build-flagships.cjs` with no
`--lint`), never edit `js/data-flagships.js`, `keys.v1.json`, `schema.cjs`, `build-flagships.cjs` or another lane's
fragment, and never write an `id`: the build mints every id. Only the spec agent, the gates agent, the voice editor
and the integrator run the writing build. `plan.json` changes only by a swap (below). `people.json` may grow: a checker
who finds a living person adds the name there in the same commit.

The lint prints two kinds of line. A line that starts `fragments/<group>.json:` is a PROBLEM: the field, then the
rule. Fix every one. A line that starts `note:` is advice for a second reader: a titled person with no date beside
them, a claim of a first or an only, a word that speaks of the present (today, now, still), a record with no primary
source, a record not yet refuted. Read each note, fix it if it is fair, leave it if the sentence is right. `sound`
means no problem stands.

Commit by explicit path, never `git add -A` or `git add .`, through the lock, then push:

    flock /tmp/claude-0/-home-user-zpullen98-gif-github-io/09201eae-82ec-5cba-9316-4d6cf5955e5e/scratchpad/flag/git.lock \
      sh -c 'git add -- .scripts/flagships/fragments/<group>.json && git commit -q -F <msgfile> && git push -q origin flagships-wip'

Every commit message ends with the two attribution lines the task gives. Never the name of a model or an assistant in
a file. Commit after each group, so nothing is lost if you are cut off.

## Read first

1. `node .scripts/flagships/show.cjs <group>`: the plan's group and its five picks (with the `why` and any `note` of
   what you must confirm), the region's summary, the region record's producers line for each house, the library's
   record (`WINE_PRODUCERS`: founded, holdings, style, why, wines, traps) and its record of the wine itself where the
   library holds one (`w-`), and the bottles of the house on Brennan's list.
2. Build on what the library already teaches and never contradict a reviewed fact. A fact the library record states
   needs no new source. Where you believe it is wrong, keep your record right and say so in `report`. `founded` must
   agree with the library's year when the library gives a bare year; the lint holds you to it.
3. Research the rest. WebFetch is refused for many hosts here: try a host once and never retry a refused one.
   WebSearch works; restrict it to a producer's or an appellation body's own domain (`allowed_domains`) to read that
   body through its search summary, and say so in the source (`"read": "search"`).

## The house rules, for every string

- No dash of any kind: not the long one, not the short one, not an entity, not two hyphens, not a hyphen standing
  alone between spaces. Use a comma, a colon or a full stop. A range is "1855 to 1973", "16 to 18", never with a
  hyphen. Nothing at or above U+2190 (no arrows, no stars).
- British spelling: colour, flavour, ageing, centre, litre, liquorice, recognise, savoury, per cent, towards.
- Never the word practice or practise: write rehearse, drill, study.
- Levels are named, never numbered: Régionale, Village, Premier Cru, Grand Cru.
- **Nobody living is named.** A house keeps its name (Gaja, Harlan Estate, Krug, Egon Müller, Álvaro Palacios), but a
  living person is never named in prose: say the family, the founder's great grandson, the cellar master, the
  founder's heir, the new owners. Never name a living owner, winemaker, consultant or critic, not in a source's title
  and not in its address either. `people.json` lists names the lint refuses; it grows as checkers find more.
- **The long dead are named with their dates**, once, where the story first meets them: "Joseph Krug (1800 to
  1866)", "Baron James de Rothschild (1792 to 1868)". Elsewhere in the record the name alone will do. If you cannot
  find a person's dates in two sources, describe the person instead ("a nephew of its owner").
- No price and no currency: not cheap, expensive, costly, value, bargain, affordable, auction prices.
- No score: no points, no marks out of a hundred, no rating.
- Nothing volatile: no hectares, acres, production, cases or bottles a year, allocation, current owner, current
  winemaker or cellar master, recent vintage report, "now owned by", "currently". **Ownership is history**: "bought by
  Baron James de Rothschild in 1868", "returned to French hands in 1993", "sold a majority to the Pearson group in 1963"
  all stand. A habit of the house that has held for decades (bottling at the château since 1924) stands; a claim
  about this year does not.
- **No superlative of judgement**: not best, finest, greatest, top, iconic, legendary, world class, renowned, cult,
  benchmark, unique, superb, the most famous. Famous may describe ("its 1961 is a vintage of history", "famous for
  consistency"), never rank. A measured fact may stand with two sources ("the first of the first growths to ferment
  in stainless steel, in 1961").
- **An empty field is a true answer.** A founding year nobody is sure of is `""`. A classification a wine does not
  have is `""`.
- **Every fact rests on two independent sources or one primary one**: the appellation body or its decree, a national
  or regional wine body (Comité Champagne, Bordeaux Wines, a consorzio, a consejo regulador), or the producer's own
  history page for its own dates, vineyards and methods, hedged where it is the house's claim ("by its own account",
  "as the house tells it"). A legend is told as a legend ("the story goes"). What you cannot confirm, leave out, and
  say so in `report`.

## The fragment

One JSON object: `{ "group": "<group key>", "records": [ five records, in the plan's order ] }`. Each record:

| field | what it holds | the cap |
|---|---|---|
| `key`, `group`, `region`, `producer`, `producerId` | copied from your pick in `plan.json`, exactly (`producerId` is `""` where the library does not hold the house) | |
| `say` | a respelling where a guest would stumble, the stressed syllable in capitals (`mo-ET eh shahn-DOHN, dom pay-ree-NYOHN`), or one syllable in capitals (`KROOG`); `""` where no guest stumbles | at most 10 words |
| `place` | the village or commune and the appellation, then the region | 2 to 14 words |
| `founded` | a year in figures (`"1743"`), or `""` | |
| `wine.name` | the flagship as the label prints it; it must hold the plan's words for the wine and may add the Prädikat or the style | 1 to 10 |
| `wine.appellation` | the appellation on the label | 1 to 10 |
| `wine.classification` | its rank, in words (`Premier Cru Classé in the 1855 classification of the Médoc`), or `""` | at most 16 |
| `wine.colour` | one of white, red, rosé, orange, sparkling, sparkling rosé, sweet white, sweet red, fortified | |
| `wine.grapes` | the cépage in words, a typical blend: no yearly percentages (`about two thirds`, `the great majority`) | 2 to 30 |
| `wine.sites` | the vineyards or parcels, the soil and the aspect where they matter | 3 to 50 |
| `wine.making` | fermentation, vessels, the élevage and its length, ending on a full stop | 20 to 80 |
| `wine.glass` | what it tastes like, in named things, no figure | 20 to 60 |
| `wine.ageing` | when it opens and how long it lasts, in words | 10 to 45 |
| `wine.serve` | temperature in figures and degrees Celsius, whether to decant, the glass | 10 to 40 |
| `wine.label` | 2 to 4 `{ term, means }`: the words a guest meets on the label | term 1 to 6, means 4 to 24 |
| `table` | the line to say at the table about the house and the flagship, naming both | 30 to 50 words, one or two sentences |
| `story` | the backstory | 150 to 230 words, at least two dated turning points |
| `others` | 1 to 3 `{ name, note }`: the house's other wines, the second wine first where there is one | name 1 to 10, note 4 to 30 |
| `traps` | 1 to 3 confusions a candidate makes | 8 to 40 each |
| `cards` | exactly 2 `{ front, back }` | front 5 to 20, back 2 to 40 |
| `questions` | exactly 2 `{ q, opts, a, exp, tag }`: one tagged `wine`, one tagged `story` | stem 8 to 55, option at most 14, exp 8 to 45 |
| `sources` | 2 to 5 `{ title, url, kind, read }` | title 2 to 20 |
| `report` | never shipped: sentences for the checker, the integrator and the owner | at most 8 |
| `checked` | never shipped: `null` until the checker writes it | |

A record reads in at most 680 words (the wine, the label, place, table, story, others and traps together); the pilots
measure 487 to 546.

### The wine, field by field

- `grapes`: "Pinot Noir, about two thirds, with Chardonnay for the rest." Refused: "66% Pinot Noir, 34% Chardonnay"
  (a per cent sign and a yearly figure).
- `sites`: name the vineyard, the parcel, the soil and why it matters: "L'Enclos, the walled heart of the estate on
  deep gravel above the Gironde". Refused: "the best plots" (a judgement that teaches nothing).
- `making`: "Every base wine is fermented in old oak barrels. The wine is then aged under natural cork rather than a
  crown cap, for seven years and more on its lees, and every bottle is riddled and disgorged by hand." Here the
  cellar terms (malolactic, élevage, lees, solera) are welcome: this is a study page, not a spoken line.
- `glass`: name the thing, never the family. The generic refusal of the Grapes tab holds: citrus, red fruit, black
  fruit, dark fruit, stone fruit, tropical fruit, floral, flowers, spice, spicy, mineral, minerality, oak, earthy,
  herbal standing alone between commas or beside an "and" is refused. Good: "Cedar, pencil shavings and cassis over
  violet and graphite, more perfume than power, with fine, firm tannin". Refused: "Black fruit, spice and oak."
- `ageing`: "Austere for fifteen to twenty years in a strong vintage, it then lasts for decades."
- `serve`: "16 to 18 degrees Celsius; decant a young bottle for two hours or more, an old one gently off its sediment;
  a Bordeaux glass." Agree with the Codex's service reference: sparkling 8 to 10 degrees Celsius (a fuller, oak aged
  Champagne 9 to 12), full whites 10 to 13, light reds 12 to 15, medium reds 15 to 17, full reds 16 to 18, sweet
  whites 6 to 8, Fino and Manzanilla 6 to 8, Vintage Port 16 to 18. Air is never promised to soften tannin.
- `label`: the words a guest meets and what they mean. Good: `{ "term": "Mis en bouteille au château", "means":
  "Bottled at the estate rather than by a merchant in Bordeaux." }`. Print only what you are sure the label carries;
  when unsure, choose the appellation and the plain terms.

### The table line

Thirty to fifty words, one or two sentences, naming the house and the flagship: what it is, where it comes from, how it
tastes or what makes it itself, and, where it helps, how to pour it. It is spoken, so no bracket and no list longer than
three. Good: "La Grande Année is Bollinger's vintage Champagne: Pinot Noir led, fermented entirely in oak barrels and
aged under cork for years before it is disgorged by hand. It has the weight to stand beside a main course." Refused:
"One of the greatest Champagnes in the world, loved by royalty." (a judgement, and no fact a guest can keep).

### The story

150 to 230 words, at least two dated turning points: the founding, the historic figures with their dates, the turning
points (a classification, a famous vintage of history, a war, a sale, a revival, a law), and why the flagship
matters. Tell it in order. Hedge a legend. Close on what the wine means to a sommelier. Good: the Latour pilot below.
Refused: "Founded long ago by a passionate family, this legendary estate makes some of the world's most sought after
wines." (no date, a judgement, a selling word).

### Others, traps, cards and questions

- `others`: the second wine first where the house has one ("Les Forts de Latour: the second wine, first released with
  the 1966 vintage"), then one or two wines a guest meets.
- `traps`: the confusions a candidate makes. "Pavillon Blanc is appellation Bordeaux Blanc, never appellation
  Margaux."
- `cards`: the front is a cue, the back the answer, the front never gives the back away, and one face names the house
  or its wine (a card is dealt in a mixed deck).
- `questions`: one tagged `wine` (its grapes, its classification, its sites, its making, its label) and one tagged
  `story` (its history). A scene at a table or a fact a candidate is asked. Four options of one kind, one key, never
  NOT or EXCEPT, never all or none of the above, the key never in the stem and never much the longest option; the
  explanation says why the key is right and why the nearest wrong option is wrong. Key the answer where you like:
  the build deals the positions.

### Sources

Each `{ "title", "url", "kind", "read" }`. `title` is the publisher and the page ("Château Margaux: Our history",
"Decanter: Château Lafite Rothschild producer profile"), never an author or an editor, and neither title nor address
names a living person: a writer's own site is no source, and an address with a writer's name in it is refused.
`kind` is `primary` (the appellation body, its decree, a wine body, the producer's own page for its own facts) or
`secondary`. `read` is `page` (you read the page), `search` (a search summary drawn from that site) or `book` (a
reference work cited by its title alone, with `"url": ""`: The Oxford Companion to Wine). At least one source carries
an https address.

### Report and checked

`report` is for the checker, the integrator and the owner: a library record you believe is wrong (which, why, your
source), a fact you left out for want of a second source, a doubt about the pick. `checked` stays `null` until the
checker writes it.

## The checker: refute, then record

A checker reads each record of a group with one instruction: refute it. Every date, name, grape, site, method,
classification, label term and story beat is tried against two sources or one primary. The checker fixes what is
wrong in place, cuts what cannot be confirmed, lints the fragment sound, and writes on every record:

    "checked": { "date": "2026-11-12", "by": "refuter", "verdict": "sound" or "changed",
                 "changed": [ "story: the founding year was 1734, the library's; now 1734" ], "open": [] }

`changed` lists every change in a sentence; `open` lists what the checker doubts and could not settle, for the
integrator. The whole build ships only records with a checker's record, so nothing reaches the owner unrefuted. The
two pilot groups are not yet refuted: the first checker to finish a chunk refutes `champagne` and `bordeaux-left` as
well, in a commit of its own.

## A swap

An author who believes a pick is wrong (a house a guest would not know, a flagship the house does not lead with, a
fact that rules it out) may propose a swap, with a reason, to the checker of the chunk. Only with the checker's
agreement is the pick replaced in `plan.json`, in the same commit as the fragment, with the swap recorded in the
group's `swaps`:

    { "from": "rieussec", "to": "gilette", "why": "the reason in eight words or more", "agreed": true, "date": "2026-11-12" }

The new pick takes a new `key` (a new id); `--plan` must still pass (the producerId real, the producer and the key
unique across the plan). Never two producers of one house, and never two picks of one producer.

## The worked example: Château Latour, from the pilot `bordeaux-left`

    {
     "key": "latour", "group": "bordeaux-left", "region": "bordeaux",
     "producer": "Château Latour", "producerId": "p-ch-latour",
     "say": "lah-TOOR",
     "place": "Pauillac, Haut-Médoc, Bordeaux",
     "founded": "",

`founded` is empty: the library gives no year, and a tower is not a founding.

     "wine": {
      "name": "Château Latour", "appellation": "Pauillac",
      "classification": "Premier Cru Classé in the 1855 classification of the Médoc",
      "colour": "red",
      "grapes": "Cabernet Sauvignon, by far the larger part, with Merlot and touches of Cabernet Franc and Petit Verdot.",
      "sites": "L'Enclos, the walled heart of the estate on deep gravel above the Gironde at the southern edge of Pauillac, by the Saint-Julien border; fruit from outside it goes to the second and third wines.",
      "making": "Fermented in temperature controlled stainless steel vats, first installed in 1964, and aged for well over a year in new oak barrels before bottling at the château; the wines are then held at the estate until it judges them ready.",
      "glass": "Cassis, blackberry and cigar box over graphite and an iron, almost bloody note; dense and grippy, with high, firm tannin, fresh acidity and a long, tight finish.",
      "ageing": "Austere for fifteen to twenty years in a strong vintage, it then lasts for decades, and it holds its shape even in weak years.",
      "serve": "16 to 18 degrees Celsius; decant a young bottle for two hours or more, an old one gently off its sediment; a Bordeaux glass.",
      "label": [
       { "term": "Grand Vin de Château Latour", "means": "The first wine, as the label prints it, drawn from L'Enclos." },
       { "term": "Pauillac", "means": "The commune appellation, red wine only, between Saint-Julien and Saint-Estèphe." },
       { "term": "Mis en bouteille au château", "means": "Bottled at the estate rather than by a merchant in Bordeaux." }
      ]
     },

The barrel time is "well over a year" because the sources read did not agree on a figure: say less rather than guess.

     "table": "Château Latour is the Pauillac first growth named for the tower that guarded the Gironde in the Hundred Years War. Mostly Cabernet Sauvignon from the walled Enclos, it is dense and firm and needs decades, so decant it well.",

House, flagship, place, grape, taste and service in 39 words a guest can follow.

     "story": "A fortified tower stood here in the fourteenth century, guarding the estuary during the Hundred Years War, and it gave the estate its name; the round tower that stands there now, and on every label, was built later. By the early eighteenth century Latour had joined Lafite in the hands of the Ségur family, and in 1855 the Bordeaux brokers ranked it among the four first growths. The Ségur heirs kept it until 1963, when they sold a majority to the British Pearson group, with Harveys of Bristol beside it. The new owners rebuilt the cellar and in 1964 replaced the old wooden vats with temperature controlled stainless steel, three years after Haut-Brion and well ahead of most of Bordeaux. Les Forts de Latour, the second wine, followed with the 1966 vintage, and the estate returned to French hands in 1993. Latour is famous for consistency: its deep gravel by the river gives a wine that holds its shape in weak years, and its 1961 is a vintage of history. With the 2012 vintage it left the en primeur system, the sale of wine still in barrel, and has since released its wines when it judges them ready to drink.",

Seven dated turning points, in order. Ownership is told as history (1963, 1993) and the owner of 1993 is not named,
because he is living. The year 1331 for the first tower, in one account only, became "the fourteenth century".

     "others": [
      { "name": "Les Forts de Latour", "note": "The second wine, first released with the 1966 vintage, mostly from parcels outside L'Enclos." },
      { "name": "Pauillac de Latour", "note": "The third wine, labelled simply by its commune." }
     ],
     "traps": [
      "Les Forts de Latour is the second wine, not the grand vin.",
      "Château Latour in Pauillac is a different estate from Latour-Martillac in Pessac-Léognan and La Tour Carnet in the Haut-Médoc.",
      "Latour left the en primeur system with the 2012 vintage, so its wines reach the market only when the estate releases them."
     ],
     "cards": [
      { "front": "Château Latour: what is L'Enclos, and what wine does it give?", "back": "The walled heart of the estate on deep gravel above the Gironde; it gives the grand vin, while other parcels go to the second and third wines." },
      { "front": "What did Château Latour change in its cellar in 1964?", "back": "It replaced its wooden vats with temperature controlled stainless steel, three years after Haut-Brion." }
     ],
     "questions": [
      { "q": "A guest asks why Château Latour is known for holding up even in weak vintages. Which reason fits?",
        "opts": ["Deep gravel by the Gironde in the walled Enclos", "A high share of Merlot on cool clay", "Grapes bought from across the Haut-Médoc", "Long ageing in large old casks"],
        "a": 0, "exp": "L'Enclos lies on deep, warm gravel beside the estuary, which drains well and ripens Cabernet Sauvignon even in hard years; the blend is mostly Cabernet, not Merlot.", "tag": "wine" },
      { "q": "In 1963 a majority of Château Latour was sold to new owners who then modernised its cellar. Who were they?",
        "opts": ["The British Pearson group, with Harveys of Bristol", "The Paris bank of the Rothschild family", "The Bordeaux merchant house of Ginestet", "A cooperative of Pauillac growers"],
        "a": 0, "exp": "The Ségur heirs sold a majority to Pearson, with Harveys of Bristol, in 1963; the new owners put in stainless steel vats in 1964.", "tag": "story" }
     ],
     "sources": [
      { "title": "Wikipedia: Château Latour", "url": "https://en.wikipedia.org/wiki/Ch%C3%A2teau_Latour", "kind": "secondary", "read": "search" },
      { "title": "Decanter: Wine Legend, Château Latour 1961", "url": "https://www.decanter.com/learn/wine-legend-chateau-latour-1961-369511/", "kind": "secondary", "read": "search" },
      { "title": "Decanter China: Chateau Latour producer page", "url": "https://www.decanterchina.com/en/knowledge/producers/chateau-latour", "kind": "secondary", "read": "search" },
      { "title": "The Oxford Companion to Wine", "url": "", "kind": "secondary", "read": "book" }
     ],
     "report": [
      "The estate's own site could not be reached from here; the facts rest on two secondary sources each and the library record.",
      "The year of the first tower is 1331 in one account only, so the story says the fourteenth century."
     ],
     "checked": null
    }

The estate's own domain refused the search tool, so the record says so in `report` and stands on two secondary sources
for each fact. Every option of a question is of one kind (four reasons, four sets of owners), and the key is not the
longest.

## What the lint cannot hear

The lint counts and refuses; it does not taste or read history. Before you commit, say the table line aloud: would a
guest follow it, and would the house recognise itself in it? Does every note in the glass belong to that wine and
not to its appellation in general? Is every date in two sources or the house's own page, every legend told as a
legend, every person either dead and dated or not named? Would a candidate who learnt the two cards and the two
questions know the wine at an examination and in a dining room? Is anything in the record true only this year?

## Before you commit

1. `node .scripts/flagships/build-flagships.cjs --lint <group>` prints `sound`.
2. Every note read and answered.
3. `report` written where you disagree with the library, left a fact out, or doubt the pick.
4. Stage your one fragment by its path, commit through the lock, push.
