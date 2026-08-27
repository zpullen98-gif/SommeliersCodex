"""Rank II rewrite - Sweet Wines (25 questions: 8 MC, 17 short answer).

Certified level, in the territory the committed corpus leaves open. The other
categories own most of the sweet world - Tokaj and its numbers, the German
ladder, the Layon, Sauternes mechanics and cryoextraction, Icewine's Brix,
everything fortified - so this category lives where nothing else does: the
south-west French sweet belt from Jurancon to Monbazillac, the EU sweetness
bands as label law and where they actually bind, the craft of drying and of
arresting a ferment taken as craft rather than as any one wine's biography,
and the economics of pouring sweet wine by the glass without losing it to the
open bottle.

Stems lead with a scene, a measurement or a label and let the wine, the grape
or the rule be the answer. Facts are restricted to ones that do not drift:
decrees, geology, label law and traditions old enough to hold; no prices in
figures, no ownership, no production volumes.

Accept lists were built against lib.match_sa, the port of core.js matchSA, and
verified by execution in a scratch probe script: for every short answer the
displayed answer and several natural phrasings grade True, and every nameable
wrong answer grades False. ex=True guards the questions where a real and
different thing extends the right answer: Pacherenc du Vic-Bilh against its own
Sec, Petit Manseng against the hedge 'gros and petit manseng' (a hole the probe
found, not the eye), the Vendanges Tardives mention against the compound Alsace
answer, and moelleux against doux on the same ladder. Note that core.js norm()
strips 'de', 'du' and 'la', so 'Pacherenc du Vic-Bilh' grades as 'pacherenc vic
bilh' and 'la Saint-Sylvestre' as 'saint sylvestre'; every list was checked for
entries that collapse together once normalised.

One stem echo is conceded here rather than closed, and the reasoning belongs on
the record so nobody spends the afternoon on it again. The demi-sec comparison
prints the word Champagne in its stem and takes that name as its answer, so a
student who retypes it scores. Closing the echo by asking instead for the figure
at which the sparkling demi-sec band opens was tried and withdrawn. A MAGNITUDE
has an open set of correct phrasings: numeral or number word, litre or liter,
gram or grams or grammes or g, 'of sugar' in, out or trailing, and the lead-in
the stem's own grammar invites. The plain cross product of those runs past
twelve hundred members. A sixteen-form list written by eye graded sixteen of the
forty-five phrasings an outside check named, and a sixty-seven-form list built
by rule still covered about a twelfth of the cross product, so both were leaving
students who knew the figure marked wrong. ex=True can only ever take what is
written down. A '~' entry would take the rest, since the tilde branch keeps
whole-phrase containment even under ex=True, but '~32 grams' also takes 'less
than 32 grams per litre', which reads a floor as a ceiling, and
lib.comparative_probe_problems fails the build on exactly that.

So the general rule, learned here at some cost: a tilde widens the phrasings
around a NAME safely and the phrasings around a MAGNITUDE unsafely, because a
comparative can sit in front of a magnitude and mean the opposite. A student
who knows the answer must never be marked wrong to close an echo, so the name
question stands and the echo is the price. Its explanation carries the figures
the withdrawn version was built on, which is where they were always more use.
"""

from lib import Q, SA

CAT = "Sweet Wines"
SLUG = "r2-sweet-wines"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("Jurancon", 6),
    ("Pacherenc and the winter pick", 3),
    ("The Bergerac sweet belt", 5),
    ("Sweetness as label law", 4),
    ("Drying lofts and arrested ferments", 4),
    ("Sweet wine at the table", 3),
]

BANK = [
    # ------------------------------------------------------- Jurancon (6) ----
    Q("Jurancon",
      "Side by side on a Pyrenean list sit Jurancon and Jurancon sec. What does the shorter of the two names promise?",
      ["Sweetness: the plain name is the moelleux",
       "Dryness: sweetness is the style that needs the qualifying word here",
       "A boundary: the two names cover different slopes of the appellation",
       "Age: sec marks the wine bottled young for early drinking"], 0,
      "Jurancon was decreed in 1936 around its sweet wine, so the bare name means moelleux and it is dryness that must announce itself, the sec gaining its own recognition in 1975. That is the reverse of most French labelling, where dry is the default and sugar gets the extra word, and it is exactly the trap a list should brief its floor staff on."),
    SA("Jurancon",
       "Small thick-skinned berries in loose, airy bunches let one Pyrenean variety hang candying on the wire into December without rotting. Name it.",
       "Petit Manseng",
       ["petit manseng", "petit manseng grape", "petit manseng variety",
        "petit manseng vine", "manseng petit"],
       "The skin sheds rain and the open bunch lets wind pass through, which is what makes weeks of passerillage possible where tighter fruit would have split or moulded. The concentration here is drying on the vine rather than noble rot, which the dry Pyrenean autumns rarely deliver.",
       ex=True),
    SA("Jurancon",
       "Rounded Pyrenean pebbles cemented into a hard conglomerate underlie Jurancon's best slopes, and the rock's French name is borrowed from an English dessert. Give the name.",
       "Poudingue",
       ["poudingue", "poudingues", "pudding stone", "puddingstone", "pudding stones"],
       "Poudingue is a straight French borrowing of the English pudding stone: torrents off the young Pyrenees dumped rounded pebbles that later cemented into rock. It drains hard and holds little, which suits vines asked to hang ripe fruit deep into the wet months of autumn."),
    Q("Jurancon",
      "Trunks in Jurancon climb head-high before the first fruiting wire, roughly twice the height of a Bordeaux vine. What are the bunches being lifted clear of?",
      ["Spring frost, whose coldest air lies along the ground on a clear night",
       "Snow sliding off the Pyrenees, which would bury a low cordon in most winters",
       "Reflected summer heat near the pale soil",
       "Browsing deer and boar out of the woods"], 0,
      "Cold air behaves like water, draining downslope and pooling at the ground, so a bud at head height can pass a still, clear night unharmed while one at knee height freezes. The old hautains went further and trained the vines up living trees; the modern trellis keeps the principle without the acrobatics."),
    SA("Jurancon",
       "At his birth in Pau in 1553, the story runs, the infant's lips were brushed with garlic and a glass of the local sweet wine. Which future king was the infant?",
       "Henri IV",
       ["henri iv", "henry iv", "henri quatre", "henri de navarre",
        "henry of navarre", "henri of navarre", "henri iv of france",
        "henry iv of france", "henri iv de france", "henri de bourbon",
        "future henri iv", "king henri iv", "king henry iv"],
       "The baby was Henri de Navarre, born in the castle at Pau, and the wine in the tale is Jurancon. The legend has been the appellation's calling card for four and a half centuries, and whatever its truth it records how early this corner of Bearn had a court reputation for its sweet wine.",
       ex=True),
    SA("Jurancon",
       "Beyond its standard moelleux, Jurancon reserves a further label mention for lots picked weeks later still, deep into the autumn. Which mention?",
       "Vendanges Tardives",
       ["vendanges tardives", "vendange tardive", "late harvest",
        "jurancon vendanges tardives", "vendanges tardives mention"],
       "The mention demands later passes and riper must than the standard sweet wine, with enrichment forbidden, and in a good year the last lots hang until the frosts. It formalised what the serious growers were already doing, which is how most French mentions begin.",
       ex=True),

    # ------------------------------------ Pacherenc and the winter pick (3) --
    SA("Pacherenc and the winter pick",
       "The red-wine appellation of Madiran shares its exact boundaries with a white-wine twin whose harvest runs from October into the depths of winter. Name the twin.",
       "Pacherenc du Vic-Bilh",
       ["pacherenc du vic bilh", "pacherenc"],
       "Same communes, two appellations: red goes to market as Madiran, white as Pacherenc du Vic-Bilh, the name usually glossed as old Gascon for posts in a row, after the tall stakes of the traditional vineyards. Its sweet lots come off the vine pass by pass, and the latest fruit hangs far longer than anything red.",
       ex=True),
    SA("Pacherenc and the winter pick",
       "In the village of Viella the year's final picking has grown into a festival, with the sweetest Pacherenc cut from the vine on one particular evening. Which evening?",
       "Saint-Sylvestre, New Year's Eve",
       ["saint sylvestre", "st sylvestre", "new year's eve", "new years eve",
        "december 31", "31 december", "december 31st", "31st of december",
        "last day of the year", "31st december", "dec 31", "dec 31st"],
       "The Saint-Sylvestre pick on 31 December closes a run of passes that began in October, and fruit that has hung that long is pure passerille concentrate. The date has been kept since the early 1990s, and the torchlit harvest sells the wine's scarcity before a note of it is tasted."),
    SA("Pacherenc and the winter pick",
       "The Mansengs and Petit Courbu fill most Pacherenc rows, but a fourth local white, close to extinct outside this corner of Gascony, keeps its place in the blend. Name it.",
       "Arrufiac",
       ["arrufiac", "arrufiat", "ruffiac", "arrufiac grape"],
       "Arrufiac survives because Pacherenc's rules kept a seat for it, and its firm, faintly bitter fruit plays the seasoning part against the Mansengs' sugar and perfume. The local growers' union has made a cause of the area's old varieties, and this one is its clearest rescue."),

    # ----------------------------------------- The Bergerac sweet belt (5) ---
    SA("The Bergerac sweet belt",
       "Botrytis works the Dordogne exactly as it works the Garonne, and the biggest sweet-wine appellation of the Bergerac country sells honeyed richness at a fraction of the Sauternes price. Name it.",
       "Monbazillac",
       ["monbazillac", "monbazillac aoc", "monbazillac appellation"],
       "Monbazillac's communes rise south of the river opposite the town of Bergerac, and autumn mists off the Dordogne bring the rot in most years. The gap in price owes more to the absence of classified names than to any shortage of noble rot, which is why the appellation is a sommelier's standard answer to a Sauternes budget."),
    SA("The Bergerac sweet belt",
       "Held to a token share in most Sauternes blends, one of the classic sweet-white trio is planted in earnest across the Bergerac belt. Which grape?",
       "Muscadelle",
       ["muscadelle", "muscadelle grape", "muscadelle variety"],
       "Muscadelle is awkward in the vineyard and rots the wrong way as readily as the right one, so grand Sauternes mostly gave up on it; around Bergerac it kept real acreage and brings a grapey, floral register the other two lack. It is no relation of Muscat, whatever the nose suggests."),
    Q("The Bergerac sweet belt",
      "Across the Bergerac sweet belt the most prized rows look north over the Dordogne, an aspect planted away from almost everywhere else in France. What does it deliver here?",
      ["Cold misty mornings off the river, which is what a botrytis harvest runs on",
       "A longer arc of evening sun through the picking season",
       "Shelter from Atlantic rain arriving out of the west",
       "Protection from spring frost, which strikes sun-facing ground first"], 0,
      "A north slope above water holds its morning damp and warms slowly, so fog sits in the rows long enough for the fungus to work before the afternoon dries the fruit. On a dry-wine slope the same properties would be a fault, which is why aspect can only be judged against the wine being attempted."),
    SA("The Bergerac sweet belt",
       "A cluster of villages west along the Dordogne's left bank holds one of France's smallest appellations, and its decree admits nothing but sweet white wine. Name it.",
       "Saussignac",
       ["saussignac", "saussignac aoc", "cotes de saussignac"],
       "Saussignac works the same autumn fogs as its bigger neighbour, and its growers were early converts to organic farming for the zone. Dry lots from the same rows simply go out as Bergerac, which is what keeps the appellation itself entirely sweet."),
    SA("The Bergerac sweet belt",
       "Early in the 1990s the flagship botrytis name of the Bergerac belt struck one piece of equipment from its rules, pulling itself back toward the Sauternes model. Which equipment?",
       "The harvesting machine",
       ["harvesting machine", "harvesting machines", "machine harvester",
        "machine harvesters", "machine harvesting", "mechanical harvesting",
        "mechanical harvester", "mechanical harvesters", "harvest machines",
        "harvesting by machine", "machine picking", "mechanical picking",
        "harvester", "harvesters", "grape harvester", "grape harvesters",
        "mechanical grape harvester", "mechanical grape harvesters",
        "picking machine", "picking machines"],
       "A machine takes everything on the vine in a single pass, and a serious botrytis wine needs the opposite: hand crews returning in successive tries for the berries the rot has finished. The ban marked the appellation's turn back to selective picking, and its reputation has climbed ever since."),

    # ------------------------------------------ Sweetness as label law (4) ---
    Q("Sweetness as label law",
      "EU law lets most wine labels stay silent about sweetness, yet for one whole category the term is compulsory on every label. Which category?",
      ["Sparkling wine",
       "Still wine under a protected designation of origin",
       "Any wine above fifteen percent alcohol",
       "Wine made from botrytised fruit"], 0,
      "A sparkling label without brut, extra dry, demi-sec or one of their siblings is not legal, while a still wine may say nothing at all. Silence is the only free choice, though: the moment a still label does print a sweetness word, the word must sit inside the band the regulation defines for it."),
    Q("Sweetness as label law",
      "Nine grams of sugar sit in a still white that legally wears the word sec. What bought it the room above the usual four-gram line?",
      ["Acidity high enough to come within two grams of the sugar",
       "A vintage the authorities declared hot enough for a broader band",
       "Bottling done before the current rule took effect",
       "Alcohol above thirteen percent, which reads dry"], 0,
      "Balance is the point of the concession: the band stretches to nine grams when total acidity trails the sugar by no more than two grams per litre, because nine against seven of tartaric tastes drier than five against three. A parallel clause with a looser test, total acidity no more than ten grams below the sugar, stretches demi-sec from twelve grams to eighteen, which is why high-acid Chenin so often carries less sweetness on its label than the palate reports."),
    SA("Sweetness as label law",
       "Thirty grams of residual sugar stand in a still Loire Chenin, and the grower wants the sweetest word the wine has legally earned. Which word goes on the label?",
       "Moelleux",
       ["moelleux", "medium sweet", "medium"],
       "The still-wine ladder runs sec, demi-sec, moelleux, doux, and thirty grams sits squarely in the moelleux band, which reaches from the demi-sec ceiling up to forty-five grams. Doux would overstate the wine and demi-sec would undersell it, and either would be an illegal label rather than a stylistic choice.",
       ex=True),
    SA("Sweetness as label law",
       "A demi-sec Champagne stands beside a demi-sec still Vouvray on the same flight. Which bottle actually carries more sugar?",
       "The Champagne, by some distance",
       # No ex=True, deliberately. The answer is a NAME, so containment is the
       # safe branch: it takes every way a student wraps the name up, 'it is
       # the Champagne', 'the Champagne, obviously', 'the Champagne by miles',
       # and the wrong answer is a different word the list does not hold. The
       # elaborations are kept OUT of the list on purpose, because an entry
       # like 'champagne carries more sugar' lets the stem's own 'carries more
       # sugar' grade by reverse containment, which is a second echo bought
       # for nothing.
       ["champagne", "champagne by some distance", "sparkling",
        "sparkling wine", "fizz"],
       "The sparkling scale is shifted wholesale: demi-sec opens at thirty-two grams there and runs to fifty, while the same word on a still label is capped at twelve, or eighteen where the acidity concession applies. Dosage terms were calibrated for wines whose acidity and carbonation swallow sweetness, so the word on the two labels is a false friend, and demi-sec Champagne is honestly a dessert wine."),

    # ------------------------------ Drying lofts and arrested ferments (4) ---
    Q("Drying lofts and arrested ferments",
      "One sweet-wine tradition dries its bunches for months in a ventilated loft, another leaves them hanging on the wire. What does bringing the crop indoors chiefly secure?",
      ["Control: the fruit is picked at its best and put beyond the autumn weather",
       "Speed: a loft finishes in days what the vine would take months to do",
       "Warmth, which builds sugar beyond what water loss alone can give",
       "Noble rot, which will only take hold under a roof"], 0,
      "Drying off the vine separates two decisions the vineyard otherwise welds together: when the fruit is ripe and how long it concentrates. Once the bunches are on the racks the autumn weather can no longer touch them, where fruit left on the wire is at the mercy of every rain that comes. The price is labour and space, plus a winter spent walking the racks pulling out anything that spoils, because one mouldy bunch shares its taint with its neighbours."),
    Q("Drying lofts and arrested ferments",
      "Freshness is Moscato d'Asti's whole sales pitch, yet a bottle filled in June tastes as bright as one filled in November. What allows that?",
      ["Its must is held cold and unfermented, with batches fermented to order all year",
       "Every release is briefly refermented in tank to restore the prickle before it ships",
       "A share of fresh unfermented juice is blended into every bottling run, sussreserve-style",
       "Pasteurisation at bottling stops the wine developing at all afterwards"], 0,
      "The houses bank the vintage as chilled, sterile-filtered must and run a fermentation only when orders call for one, so the wine's aromatic clock starts weeks before bottling rather than at the harvest. Each ferment is then stopped early by chilling and filtration, which is what leaves the alcohol low and the sugar in the glass."),
    SA("Drying lofts and arrested ferments",
       "Tuscan tradition puts the sealed caratelli of Vin Santo not in a cellar but in a room under the roof tiles, where nobody moderates the seasons. What is that room called?",
       "The vinsantaia",
       ["vinsantaia", "vinsantaia attic", "vinsantaia loft"],
       "The vinsantaia bakes in August and freezes in January, and that cycling drives the wine's slow concentration and its nutty, oxidative depth. A tempered cellar would make a cleaner and duller wine; the room's discomfort is the recipe."),
    SA("Drying lofts and arrested ferments",
       "Most Vin Santo is pressed from white grapes, but a rosy version built on Sangiovese carries a name borrowed from a game bird's eye. Give the name.",
       "Occhio di Pernice",
       ["occhio di pernice", "vin santo occhio di pernice",
        "occhio di pernice vin santo"],
       "Occhio di Pernice, the partridge's eye, names the tawny-pink colour the dried red grapes give. The craft is unchanged - the drying, the sealed small casks, the years under the roof - so what changes in the glass is a red-fruit, tea-leaf register laid over the same nutty base."),

    # ------------------------------------------- Sweet wine at the table (3) -
    Q("Sweet wine at the table",
      "Down a well-built dessert list nearly every entry is a 375 millilitre bottle. What is the format's logic?",
      ["A dessert pour is small, so a half serves the whole table while it is fresh",
       "Sweet-wine appellations release only in the small format, leaving lists no choice",
       "Sweet wines throw heavy sediment, and the small bottle keeps the deposit manageable",
       "The format signals rarity, and rarity is what the dessert course trades on"], 0,
      "A dessert pour runs about half the size of a table pour, so a 375 covers a whole table's course and nothing sits open going stale. The same bottle also lands at a list price a table will actually spend at the end of a meal, which a full bottle of the identical wine rarely does."),
    SA("Sweet wine at the table",
       "Recorked and refrigerated, a botrytis wine can pour honestly for a week or more after opening, long after a dry white would have faded. What in the wine buys that time?",
       "Its sugar",
       ["sugar", "its sugar", "residual sugar", "high sugar", "sugar content",
        "all that sugar", "high residual sugar", "sugar level",
        "sweetness", "its sweetness", "residual sweetness"],
       "Concentrated sugar is a preservative in the jam sense: it denies microbes the water they need to work in the open bottle, and with the wine's acidity behind it, the sweetness also masks the first flavour costs of oxidation. The practical consequence is that sweet wine is the safest by-the-glass category in the building, holding days longer than anything dry."),
    SA("Sweet wine at the table",
       "Left at the back of the main wine list, sweet wine barely sells; printed on one other piece of paper it moves every night. Which piece of paper?",
       "The dessert menu",
       ["dessert menu", "dessert card", "pudding menu", "dessert list",
        "on the dessert menu"],
       "A guest choosing dessert is the only guest in the room thinking about sweetness, and a glass of botrytis wine listed beside the tart reads as part of the course rather than as more wine. It is the cheapest merchandising move in the building: same stock, same prices, different page, more sales."),
]
