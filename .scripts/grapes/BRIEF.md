# The Grapes tab at the table: the writer's brief (codex57, 9 November 2026)

The owner asked, in these words: "Now let's expand and improve our Grapes tab under the Sommeliers Codex and have a
table side description at the top of each grape, and be more descriptive than just using the word citrus, along with
any other improvements you as a master sommelier can see. Let's also describe the differences between old world vs new
world style of the same grape such as chardonnay or cabernet".

So every grape of the tab opens on what a sommelier says at the table, describes the glass in named fruit, and (where
the grape travels) sets the Old World beside the New World. You write that, one grape at a time, as one JSON file:
`.scripts/grapes/fragments/<slug>.json`. This brief, `plan.json` and the four pilot fragments (`chardonnay`,
`cabernet-sauvignon`, `meunier`, `glera`) are all you need. The pilots are the measure: read all four before you
write a word.

Outside Of Time is the owner's own study tool, never sold and used by the owner alone. No legal notice, no price, no
gating, ever.

## What you may run, and what you may not

| You run | What it does |
|---|---|
| `node .scripts/grapes/show.cjs <slug>` | Prints what the Codex already holds on the grape. Writes nothing. |
| `node .scripts/grapes/show.cjs --regions` | Prints every region slug and country key a target may name. |
| `node .scripts/grapes/build-grapes.cjs --lint <slug> [<slug> ...]` | Holds your fragment to `schema.cjs`. Writes nothing. |
| `node .scripts/grapes/build-grapes.cjs --lint --chunk <g1 to g12>` | The same, for a whole chunk. |
| `node .scripts/grapes/schema.cjs --caps` | Prints every cap and the glass families. |

You never run the writing build (`build-grapes.cjs` with no `--lint`), never edit `js/data-grapes-table.js`,
`keys.v1.json`, `plan.json`, `schema.cjs` or another author's fragment, and never write an `id` into a fragment: the
build mints every id from the slug and the text. Lint until the fragment is sound, then commit that one file.

The lint prints two kinds of line. A line that starts `fragments/<slug>.json:` is a PROBLEM: the field, then the rule.
Fix every one. A line that starts `note:` is advice for a second reader (a family word inside a sentence, a word that
reads as a superlative, a term in a spoken line that wants explaining): read it, fix it if it is fair, leave it if the
sentence is right. `sound` means no problem stands.

## Read first

1. `node .scripts/grapes/show.cjs <slug>`: the roster row (status, mode, aliases, neighbours), the reviewed profile
   (`GRAPES`, `GRAPES_PLUS`), the dials (`TASTE`, with `world`), the Régionale row (`INTRO_GRAPES`), the Court's
   respelling and grid reads (`GRID_SAY`, `GRID_READS`), the regions that name the grape and the service rows that
   name it.
2. Build on what the Codex already teaches and never contradict a reviewed fact. A fact those records state needs no
   new source. Where you believe a record is wrong, keep your entry right and say so in the fragment's `report`.
3. Research what is new (at most six searches a grape). The sources rule is below.

## The house rules, for every string

- No dash of any kind: not the long one, not the short one, not an entity, not two hyphens, not a hyphen standing
  alone between spaces. Use a comma, a colon or a full stop. A range is written with "to": "10 to 13", never "10-13".
- British spelling in our own words: colour, flavour, ageing, centre, litre, liquorice, chilli, recognise, per cent,
  towards. The lint refuses the American forms.
- Never the word practice or practise in prose. Use rehearse, drill, study.
- Nobody living is named, anywhere: not in prose, not in a source's title, not in a source's address. The long dead
  are named only where the fact needs them, by name alone with no title ("bred by Hermann Müller in 1882" stands;
  a winemaker, a critic, a consultant or an owner by name is refused). Write "researchers at the University of
  California, Davis", never the researchers' names.
- No producer is named in an entry: no estate, house, winery or brand. The house's own bottles are drawn live on
  the page from the house list. Refused: "Try Domaine Leflaive", "Krug makes one", "Kistler Vineyards". An
  appellation or a vineyard is a place and may be named (Chablis, Clos de Vougeot, Cartizze).
- No price and no currency: not cheap, expensive, bargain, value, affordable, cost.
- Nothing volatile: no rankings, hectares, acres, plantings, "most planted", allocations, owners.
- No superlative and nothing that sells where it should teach: not best, finest, greatest, most famous, iconic,
  legendary, world-class, renowned, king of, cult, ultimate. Note that "best" is refused in every sense: write "it
  suits" or "pour it with", never "best with".
- Levels are named, never numbered: Régionale, Village, Premier Cru, Grand Cru.
- No degree sign and no per cent sign: write "degrees" and "per cent".
- Never the name of the house. Never the name of a model or an assistant, in a file or a commit message.

## The fragment, field by field

One JSON object. The four fields `name`, `colour`, `kind` and `aliases` are COPIED from your grape's row in
`plan.json`, exactly. The caps are words; the lint counts them. An entry reads in at most 900 words (the lines,
the glass, the worlds, service, food, labels, guest and the compare tells together), so every field earns its room:
the pilots measure 884, 819, 710 and 684.

### `slug`, `name`, `colour`, `kind`, `aliases`
The roster's own. Good: `"name": "Pinot Gris / Grigio"` as the plan writes it. Refused: `"name": "Pinot Gris"`.

### `notIn`
A list of folded phrases (lower case, no marks) whose questions must NOT join this grape's drill, `[]` for none. The
drill gathers every bank question that names the grape, so a name shared with a place needs this.
Good, for Montepulciano: `["vino nobile", "vino nobile di montepulciano", "rosso di montepulciano"]`.
Refused: `["montepulciano"]` (the grape's own name: it would shut its own questions out).

### `say` (at most 14 words)
A respelling in hyphenated syllables, the stressed syllable in capitals, letters only. Give the local form too where
a guest meets both, after a comma. For the Court's twenty (`court: true` in the plan) it must OPEN on the Court's own
respelling (`GRID_SAY`, printed by `show.cjs`); if you are sure that one is wrong, write yours and add `sayWhy`, a
sentence of eight words or more, and say so in `report`.
Good: `"shar-doh-NAY"`; `"muh-NYAY, or PEE-noh muh-NYAY"`. Refused: `"shar-doh-nay"` (no stress); `"(shar-doh-NAY)"`.

### `lines`: what is said at the table
Four lines, each a string. They are SPOKEN: plain declarative sentences a sommelier says standing at a table. In all
four: no bracket, no semicolon, no abbreviation or sign (not AOC, DOC, AVA, ABV, a slash or an ampersand), no figure
of alcohol, no list longer than three, no sentence longer than 32 words, no term a guest would need explained unless
the same breath explains it (say "a second, softening fermentation adds a note of butter", never "malolactic
conversion"; pyrazine, terpene, thiol, phenolic, autolysis and their kind are refused outright).

- `s10`, the ten second line: 12 to 25 words, ONE sentence, one breath. It names the grape.
  Good: "Glera is the grape of Prosecco: light, bright bubbles that taste of green apple, pear and white peach."
  Refused: "A light sparkling white with citrus and floral notes." (no grape named, two bare family words).
- `s20`, the twenty second line: 25 to 50 words, exactly TWO sentences, two breaths.
  Good: "Meunier is the third grape of Champagne, a black grape pressed gently for white juice. It brings ripe pear,
  yellow plum and a soft, round middle, and it makes a Champagne ready to enjoy young."
  Refused: one long sentence, or three short ones.
- `s45`, the forty-five second line: 90 to 110 words, 4 to 8 sentences. It is what you say when a guest asks what
  this grape is like. It OPENS on the grape's name (within the first five words) and moves through five beats, in
  this order: (1) what it is and where it is at home; (2) how it tastes, in named fruit and then structure in plain
  words; (3) what the cellar does to it, and in one clause how the Old World and the New World differ where that
  applies; (4) what to eat with it; (5) one line of story or a hook.
  Good: the Chardonnay pilot, whole. Its beats: "Chardonnay is the white grape of Burgundy, and it now grows almost
  everywhere wine is made." / "On its own it is quiet: lemon, green apple and white peach, dry, with a rounded,
  medium to full body." / "New oak barrels add toasted hazelnut and vanilla ... Burgundy tends to be leaner and more
  chalky, while California and Australia are often riper and creamier." / "Pour it with roast chicken, lobster or
  anything in a butter sauce." / "Its parents, found by DNA in 1999, are Pinot and a lowly, almost forgotten grape
  called Gouais Blanc."
  Refused: "This noble variety (the queen of whites) shows citrus, stone fruit, tropical fruit and oak; 13.5 per cent
  alcohol." (does not open on the name, a bracket, a selling phrase, a list of four bare family words, a semicolon,
  a figure of alcohol).
- `sale`, the sale: 15 to 45 words, exactly TWO sentences: the hook (why this grape tonight), then the pour (the dish
  or the guest it suits).
  Good: "Cabernet Sauvignon has the cassis fruit and the firm grip that a fatty cut of beef calls for. Tonight I
  would pour it with a ribeye, and decant it while the kitchen works."
  Refused: "The best red on the list. Great value. Try it!" (a superlative, price talk, three sentences).

Vary your openings and your hooks: across the 75, no construction may open more than a handful of forty-five second
lines, and no two sales may share a hook. "X is the grape of Y" is the pilots' way in; find the grape's own.

### `glass`: the glass names the thing, never the family
- `lead`: 8 to 28 words, ONE sentence ending on a full stop. It also stands as the grape's line on the tab's root.
  Good: "Cassis and blackberry over cedar and graphite, on a full body with firm, drying tannin."
  Refused: "Black fruit, spice and oak." (three bare family words).
- `notes`: 3 to 6 groups. Each is `{ "family": <one of the nineteen>, "notes": [2 to 4 notes] }`, a family once, a
  note once among the groups, each note 1 to 4 words with no comma in it. The families, written exactly:

  | family | name the thing, for example |
  |---|---|
  | citrus | lemon zest, Meyer lemon, lime cordial, pink grapefruit, bergamot |
  | orchard fruit | green apple, russet apple, ripe pear, quince |
  | stone fruit | white peach, nectarine, apricot kernel, yellow plum |
  | tropical fruit | pineapple, mango, passion fruit, guava, lychee, honeydew melon |
  | red fruit | sour cherry, wild strawberry, raspberry, cranberry, redcurrant |
  | black fruit | cassis, blackberry, black plum, bilberry |
  | blue fruit | blueberry, damson, boysenberry |
  | dried fruit | raisin, dried fig, prune, date |
  | floral | violet, rose petal, orange blossom, acacia blossom, honeysuckle, elderflower |
  | herbal | cut grass, green bell pepper, mint, eucalyptus, bay leaf, thyme, tomato leaf |
  | spice | cracked black pepper, clove, liquorice, star anise, cinnamon |
  | earth | forest floor, dried leaves, truffle, tar, leather, tobacco leaf |
  | mineral | wet slate, crushed chalk, struck flint, oyster shell, graphite |
  | savoury | cured meat, black olive, bacon fat, soy |
  | nutty | bitter almond, marzipan, walnut |
  | honeyed | acacia honey, beeswax, orange marmalade, saffron |
  | lees and cellar | brioche, bread dough, fresh cream, butter, struck match |
  | oak | vanilla pod, toasted hazelnut, cedar, coconut, coffee, wood smoke |
  | age | petrol, dried mushroom, honey, hazelnut, old leather |

  Good: `{ "family": "citrus", "notes": ["lemon zest", "lemon curd"] }`.
  Refused: `{ "family": "citrus", "notes": ["citrus", "citrus zest"] }`; `"red berries"`; `"white flowers"`;
  `"baking spice"`; `"minerality"`; `"oak notes"`; `"dried herbs"`. The family word is the label; the note is the
  thing a taster could point to.
- `ladder`: 2 or 3 rungs, climbing from cool to warm, each climate once: `{ "climate": "cool" | "moderate" | "warm",
  "where": 2 to 12 words, "notes": [2 to 4 notes] }`. It is honest: what truly changes in the glass from a cool
  site to a warm one, and where. Agree with the Court's grid reads for the climate of a region (it calls the Côte de
  Beaune cool and Napa moderate for Chardonnay, the Médoc moderate and Napa warm for Cabernet). A grape with no true
  cool home takes two rungs.
  Good: `{ "climate": "warm", "where": "Napa Valley, Paso Robles, Maipo and the Barossa", "notes": ["ripe blackberry",
  "black cherry", "black plum"] }`. Refused: a rung of `"notes": ["tropical fruit"]`; warm before cool.
- `structure`: 6 to 30 words, in words and never figures. It states the acidity, the alcohol and the body, and for a
  red the tannin. Agree with the reviewed profile's `st`.
  Good: "Dry. Acidity medium plus, tannin high and drying, alcohol medium plus to high, body full."
  Refused: "Balanced and elegant." (states nothing); "Alcohol 14 per cent." (a figure).

The generic refusal reaches past the notes. In every field that describes the glass (the lines, `glass.lead`,
`glass.structure`, the two `glass` sides, `blur`, `call`, `worlds.home`, `guest`, the compare tells, the profile's
`fruit`, `other`, `tell` and `confuse`, the cards and the questions) a family word standing ALONE between commas or
beside an "and" is refused: citrus, orchard fruit, stone fruit, tropical fruit, red fruit, black fruit, dark fruit,
blue fruit, dried fruit, red berries, floral, flowers, white flowers, blossom, spice, spicy, baking spice, sweet
spice, mineral, minerality, oak, oaky, earth, earthy, herbal, herbs. "Lemon, citrus and green apple" is refused;
"cedar and oak" is refused; "cedar from new oak barrels" stands, because there the oak is a cause and the note is
named. In `cellar`, `why`, `service`, `food` and `labels` oak and spice are things, not notes, and stand.

### `worlds`: the Old World and the New World
The plan fixes your grape's `mode`. The Old World is Europe and the Mediterranean rim; the New World is the Americas,
Australia, New Zealand and South Africa.

**`mode: contrast`** (the side by side): `"worlds": { "contrast": { "old": {...}, "new": {...}, "why", "blur",
"call" } }`.
- `old` and `new`, each `{ "where": 2 to 12 words, "glass": 15 to 40, "cellar": 8 to 30 }`. Describe the TYPICAL
  styles a guest meets on a list, hedged honestly: tends to, typically, often, usually. Never "always" or "never":
  the lint refuses an absolute here, and refuses a pair of glasses with no hedge in either.
  Good, old glass: "Tends to be leaner and more restrained: lemon, green apple and white peach over crushed chalk,
  with bright acidity and moderate alcohol. The place leads and the fruit follows."
  Good, new cellar: "Often bottled under the grape's own name, alone or with a little Merlot; picked riper and aged
  in a larger share of new oak."
  Refused: "Old World wines are always earthy and never oaky." (two absolutes, a bare family word, and false).
- `why`: 15 to 40 words. The causes: climate and ripeness, oak, yeast and lees, the law, the label naming a place or
  a grape.
  Good: "Bordeaux's mild, damp, maritime climate ripens Cabernet only just, so it is blended and stays firm.
  Sunnier, drier New World sites ripen it fully. The label follows: Bordeaux names the place, the New World the
  grape."
- `blur`: 10 to 30 words. It must admit the exceptions: cool New World sites, modern or warm Old World cellars.
  Good: "Cool New World sites such as the Sonoma Coast, Tasmania and the Yarra Valley now make lean, bright wines,
  and a warm year in Burgundy gives ripe, creamy ones." Refused: "The difference is clear in every bottle."
- `call`: 8 to 25 words. The one tell a blind taster leans on, both ways.
  Good: "Cedar, graphite and a dry, firm finish at moderate alcohol lean Bordeaux; ripe blackberry, mint and vanilla
  at higher alcohol lean New World."

**`mode: home`** (at home and abroad): `"worlds": { "home": { "home": 25 to 60 words, "abroad": 8 to 40 } }`.
`home` is where the grape belongs, what it is there and how it is made; `abroad` is where else it grows, if it
travels at all, and how it differs. A grape whose home is the New World (Torrontés, Pinotage, Petite Sirah) is at
home there. Good: the Meunier and Glera pilots. Refused: a `contrast` block on a home grape, or the reverse: the
form follows the plan. If you believe the plan's mode is wrong, write the form the plan asks and say so in `report`; a
reviewer changes the plan and the fragment together.

Never contradict `TASTE.world`: a grape the Codex flags `both` is always a contrast.

### `service` (each 3 to 20 words)
`temp`, `glass`, `decant`, `age`. Agree with the Codex's own service reference. `temp` gives degrees Fahrenheit and
THEN degrees Celsius, in figures, with the word degrees. The reference's rows, in that form:

| Style | Write |
|---|---|
| Light sparkling (Cava, Prosecco) | 43 to 46 degrees Fahrenheit, 6 to 8 degrees Celsius |
| Champagne and vintage sparkling | 46 to 50 degrees Fahrenheit, 8 to 10 degrees Celsius |
| Light aromatic whites and rosé | 45 to 50 degrees Fahrenheit, 7 to 10 degrees Celsius |
| Full whites (oaked Chardonnay, white Rhône, Viognier) | 50 to 55 degrees Fahrenheit, 10 to 13 degrees Celsius |
| Orange and skin contact whites | 54 to 57 degrees Fahrenheit, 12 to 14 degrees Celsius |
| Sweet whites | 43 to 46 degrees Fahrenheit, 6 to 8 degrees Celsius |
| Light reds (Beaujolais, Pinot Noir, Valpolicella) | 54 to 59 degrees Fahrenheit, 12 to 15 degrees Celsius |
| Medium reds (Chianti, Rioja, Côtes du Rhône, Merlot) | 59 to 63 degrees Fahrenheit, 15 to 17 degrees Celsius |
| Full tannic reds (Cabernet, Barolo, Syrah, Zinfandel) | 61 to 64 degrees Fahrenheit, 16 to 18 degrees Celsius |
| Fino and Manzanilla | 43 to 46 degrees Fahrenheit, 6 to 8 degrees Celsius |
| Amontillado, Palo Cortado, dry Oloroso, tawny Port | 50 to 57 degrees Fahrenheit, 10 to 14 degrees Celsius |
| Ruby, late bottled and vintage Port | 61 to 64 degrees Fahrenheit, 16 to 18 degrees Celsius |

Glass, from the same reference: a white wine glass for light whites and rosé; a Burgundy bowl for Pinot Noir,
Nebbiolo, Grenache, aromatic reds and rich Chardonnay; a Bordeaux glass for structured reds; a tulip for sparkling
(a flute holds the mousse and hides some perfume); a small tulip or copita for fortified; a small glass for sweet
wine. Decanting, from the same reference: a young tannic red, consider it after tasting a sample; an old red with
sediment, consider it to separate the deposit; a light aromatic white or a light red, usually unnecessary; sparkling,
rarely and only on request. Air is never promised to remove tannin. `age` is how the wine keeps, in years written as
words or figures, and agrees with `TASTE.age` where the Codex holds one.
Good: "61 to 64 degrees Fahrenheit, 16 to 18 degrees Celsius: cool room temperature, never warm."
Refused: "16 to 18 C (61 to 64 F)"; "Serve chilled."

### `food.with` (3 to 5 dishes)
Each `{ "dish": 1 to 8 words, "why": 3 to 12 words }`: the dish, then the reason in a few words. ONE dish may come
from the Creole table of the owner's dining room, where it truly suits: Gulf oysters, shrimp remoulade, gumbo,
redfish, crawfish étouffée, turtle soup, bananas Foster. Never a menu item by its printed name, and never force one
on a grape it does not suit (the Cabernet pilot has none).
Good: `{ "dish": "Ribeye or a rib of beef", "why": "fat and protein soften the tannin" }`.
Refused: `{ "dish": "Seafood", "why": "goes well" }`.

### `labels` (2 to 5)
Each `{ "term": 1 to 5 words, "means": 4 to 20 words }`: a word a guest meets on a label or a list and what it
means. Synonyms (Shiraz, Spätburgunder), a place that stands for the grape (Chablis, Sancerre), a style word (Fumé
Blanc, Blanc de Blancs, Extra Dry).
Good: `{ "term": "Extra Dry", "means": "Sweeter than Brut, not drier: a soft, slightly sweet style long traditional
for Prosecco." }`. Refused: a producer's own brand name as a term.

### `guest` (2 to 4)
Each `{ "q": 3 to 20 words, ending on a question mark, "a": 8 to 40 words }`: what guests truly ask, in their words,
and what you answer, in yours.
Good: `{ "q": "If the grape is black, why is the wine white?", "a": "The colour is in the skins and the juice runs
clear. Champagne presses whole bunches gently and takes the juice away before the skins can tint it." }`.
Refused: `"q": "Tell me about tannin."` (no question).

### `compare` (1 to 3)
Each `{ "slug": a slug of the roster, never the grape itself, "tell": 8 to 30 words }`. Compare with the neighbours
a guest or a blind taster truly confuses it with; the plan's `neighbours` are candidates, not a limit. The tell
names both grapes and what parts them, and agrees with the reviewed profile's `confuse`.
Good: `{ "slug": "merlot", "tell": "Merlot is softer and rounder, with plum where Cabernet has cassis, and less of
the drying grip and cedar." }`. Refused: `{ "slug": "auxerrois", ... }` (not in the roster).

### `profile` (thin and new grapes ONLY; a full grape must not carry one)
`{ "c", "st", "fruit", "other", "tell", "regions", "confuse" }`, the fields the stock grape card and page read, in
the manner of `GRAPES` in `js/reference.js`: `c` is `"w"` or `"r"`; each of the others 2 to 30 words; `st` the
colour and structure with a middle dot between its parts; `fruit` and `other` named, never by family; `tell` what
gives it away; `regions` where; `confuse` the neighbours and what parts them. Never write `g`: the layer sets it.
Good: the Glera pilot's `"tell": "Light and softly sparkling, with green apple, pear and acacia blossom and no
bready note: tank method fruit, not bottle age"`. Refused: `"fruit": "Red fruit, spice"`.

### `targets` (new grapes ONLY)
1 to 12 region slugs or country keys of `REGIONS`: the pages a reader of this grape should reach. `show.cjs` prints
the regions that already name the grape or an alias; add only what the entry itself supports.
Good: `["champagne", "england", "wurttemberg", "tasmania", "willamette-valley"]`. Refused: `["reims"]`.

### `cards` (exactly 3)
Each `{ "front": 6 to 14 words, "back": 2 to 40 words }`. The front is a cue, the back the answer; the front never
gives the back away. A card is dealt in a mixed deck, so the front names the grape unless the grape is the answer.
For a contrast grape, one card on the blind call earns its place.
Good: `{ "front": "On a Prosecco label, which is sweeter: Brut or Extra Dry?", "back": "Extra Dry. Brut holds less
than 12 grams of sugar a litre; Extra Dry holds 12 to 17, and Dry 17 to 32." }`.
Refused: `{ "front": "Tell me about it", "back": "..." }` (three words too few, and no grape).

### `questions` (exactly 3)
Each `{ "q", "opts": [four], "a": 0 to 3, "exp" }`, and on ONE question of a contrast grape `"tag": "worlds"` (Old
World against New World); a home grape carries no tag. A question is a scene at a table or a blind glass. The stem
is 8 to 55 words and ends on a question mark; four options of ONE kind (four places, four grapes, four reasons),
each at most 12 words, all different; one key; never all or none of the above, never NOT or EXCEPT; the answer never
in the stem and never much the longest option; an explanation of 8 to 45 words that says why the key is right and
why the nearest wrong option is wrong. Key the answer where you like: the build deals the positions.
Good: the Cabernet pilot's first: "Two glasses of Cabernet Sauvignon are poured blind. One is cedary and firm at
moderate alcohol, the other riper, with mint, vanilla and higher alcohol. Which pair of origins fits, in that
order?" with four pairs of origins.
Refused: "Which is the best pairing?" (a superlative, no scene); a stem that names the key; three grapes and a
region as options.

### `sources` (2 to 4)
Each `{ "title": 2 to 20 words, "url" }`. Every fact stands on two sources or on ONE primary one: the appellation's
own rule, the regional or national wine body (Comité Champagne, Bourgogne Wines, Bordeaux Wines, the consortium, Wine
Australia, Wines of Germany), a university, or a standard reference work cited by its title alone with `"url": ""`
(The Oxford Companion to Wine; Wine Grapes). At least one source carries an https address you read. A title is the
publisher and the page, never an author or an editor; neither the title nor the address names a living person, so a
writer's own site is no source. Leave out what you cannot confirm. A fact the Codex's reviewed records already state
needs no new source; everything new does.
Good: `{ "title": "Comité Champagne: Champagne and its grape varieties", "url": "https://www.champagne.fr/en/..." }`.
Refused: a title with "by" and a name; a writer's site; an http address; five sources.

### `report`, `sayWhy`, `checked` (never shipped)
`report` is a list of sentences for the integrator and the owner: a Codex record you believe is wrong (which, why,
your source), a fact you left out for want of a source, a doubt about the plan's mode or an alias. `checked` is the
checker's record. All three keep to the dash rule.

## The shape, in one glance

```json
{
  "slug": "", "name": "", "colour": "", "kind": "", "aliases": [], "notIn": [],
  "say": "",
  "lines": { "s10": "", "s20": "", "s45": "", "sale": "" },
  "glass": {
    "lead": "",
    "notes": [ { "family": "", "notes": ["", ""] } ],
    "ladder": [ { "climate": "cool", "where": "", "notes": ["", ""] } ],
    "structure": ""
  },
  "worlds": { "contrast": { "old": { "where": "", "glass": "", "cellar": "" }, "new": { "where": "", "glass": "", "cellar": "" }, "why": "", "blur": "", "call": "" } },
  "service": { "temp": "", "glass": "", "decant": "", "age": "" },
  "food": { "with": [ { "dish": "", "why": "" } ] },
  "labels": [ { "term": "", "means": "" } ],
  "guest": [ { "q": "", "a": "" } ],
  "compare": [ { "slug": "", "tell": "" } ],
  "cards": [ { "front": "", "back": "" } ],
  "questions": [ { "q": "", "opts": ["", "", "", ""], "a": 0, "exp": "", "tag": "worlds" } ],
  "sources": [ { "title": "", "url": "" } ]
}
```

A home grape writes `"worlds": { "home": { "home": "", "abroad": "" } }` and no `tag`. A thin or a new grape adds
`"profile": { "c": "", "st": "", "fruit": "", "other": "", "tell": "", "regions": "", "confuse": "" }`; a new grape
adds `"targets": []` too.

## What the lint cannot hear

The lint counts and refuses; it does not taste. Before you commit, say the forty-five second line aloud: is it what
a sommelier would say at a table, five beats in order, nothing a guest must have explained? Would a blind taster nod
at every note? Is each Old World and New World line true of the typical bottle and fairly hedged, does `blur` name
the real exceptions, would `call` survive a flight? Are the four options of one kind, with one defensible key? Is
every fact in two sources or one primary one, and does anything contradict what `show.cjs` printed? A family word
dressed up ("citrus fruits", "red berries", "floral notes") is still a family word.

## Before you commit

1. `node .scripts/grapes/build-grapes.cjs --lint <slug>` prints `sound`.
2. Every note read and answered.
3. `report` written where you disagree with a Codex record or left a fact out.
4. Stage and commit your one fragment, and nothing else.
