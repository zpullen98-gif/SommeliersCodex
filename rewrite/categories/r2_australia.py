"""Rank II rewrite - Australia (24 questions: 10 MC, 14 short answer).

Certified level, pitched deliberately above the Rank I "Australia" category,
which was read end to end before a word of this was written. Rank I owns the
eighty-five percent label rule, the zone-region-subregion ladder, the cigar of
red ground at Coonawarra and the naming of every headline region; nothing here
repeats one of those tasks. What is asked instead is what a professional knows
once the region is already on the table: what the GI machinery actually
adjudicates and why its defining fight was over a map; what gives the Barossa's
old-vine words their meaning when no law defines them; what the Hunter is
buying with a January pick and what Clare bought with a closure; who argued
Margaret River into existence and on what evidence; which lever cools each
member of the Pinot set; and how water, packaging and the show bench built and
still steer the commercial tier.

Boundaries were read and are kept. r2_sparkling_wine_world owns Tasmanian
sparkling and sparkling Shiraz, so Tasmania appears here only as still-wine
latitude. r1_dessert_sweet owns the Rutherglen tier ladder, so the topaque
question is about the renaming and never the rungs. r2_classifications_labels
owns cross-country classification mechanics, so the GI block stays entirely
inside Australian law. r2_terroir_climate_soil keys terra rossa, so those two
words appear nowhere below.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards, by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and
were verified by execution rather than eyeballed: a scratch script graded every
displayed answer, a set of natural phrasings, and every nameable wrong answer.
No '~' entries appear anywhere. Where a real and different thing extends or
truncates the right answer, the wrong form was run through the grader to
confirm it fails, and ex=True with enumerated phrasings was applied where it
did not: Yarra Valley against the Upper Yarra, Rhine Riesling against the
Riesling the Hunter printed, an oak cask against the cask Angove patented.
Each ex=True list was then widened until the bare form, the article form and
the with-verb forms of its own answer all still grade.

Facts are restricted to ones that do not drift. No production shares, no
prices, no current ownership; the numbers that appear are written into
regulation or into dated history - the 1965 paper, the 1965 patent, the 2003
boundary, the tiers of a published charter - and the styles described are the
settled regional signatures, not anybody's current cellar.
"""

from lib import Q, SA

CAT = "Australia"
SLUG = "r2-australia"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("The GI machine and the Coonawarra line", 4),
    ("Barossa floor, Eden altitude and the Old Vine Charter", 4),
    ("Hunter Semillon and the Riesling valleys", 5),
    ("Margaret River and the cool-climate set", 6),
    ("Rutherglen, the river and the show bench", 5),
]

BANK = [
    # ------------------------- The GI machine and the Coonawarra line (4) ----
    Q("The GI machine and the Coonawarra line",
      "Chianti, Frascati and Beaujolais began disappearing from Australian labels in the 1990s, and in the same decade Australia registered protected place names of its own for the first time. What linked the two changes?",
      ["A treaty with Europe: their names came off the labels, and Australia had to build a register of its own names to trade with",
       "A High Court ruling that borrowed names such as Chablis had become misleading once Australian wine began exporting at serious scale",
       "A trademark campaign by the big companies, which had registered Europe's names abroad and wanted them defended at home",
       "The Label Integrity Program, whose audits had no way to verify a borrowed name"], 0,
      "The 1994 wine agreement with the European Union committed Australia to phasing Europe's names off its labels, and that first wave went in the 1990s. The most valuable borrowings were not in it: Champagne, Chablis, Burgundy, Claret, Port and Sherry sat on an exempted list with no deadline at all, and only a second agreement retired them, with the last stock selling through in 2011. A country cannot demand protection for names it has never defined, so the law was amended to create a register of Geographical Indications with a committee to determine them, and the register exists to make origin enforceable, at home and in every market the agreement reaches."),
    Q("The GI machine and the Coonawarra line",
      "Before the register will call a district a region, its applicants must show far more than lines on a map. What is the test?",
      ["Measurable homogeneity in its grape growing, at least five independently owned vineyards of five hectares each, and around five hundred tonnes of grapes a year",
       "Fifty years of continuous documented viticulture inside the proposed line, proven from parish, council and company records",
       "A panel tasting finding that wines grown inside the line share a recognisable style that stops at the boundary",
       "A soil survey establishing that one mapped soil type runs unbroken across the whole area"], 0,
      "The regulations ask for a single tract of land, discrete from its neighbours and homogeneous in its growing attributes, with the five-vineyard, five-hectare and five-hundred-tonne figures as the floor of scale. Style and soil are deliberately absent from the test, which is the system in miniature: the law measures where, never how or what."),
    SA("The GI machine and the Coonawarra line",
       "Fixing one South Australian region's edge took an interim ruling, tribunal hearings, a Federal Court appeal and the better part of a decade, with excluded growers fighting their way inside the line. Name the region.",
       "Coonawarra",
       # No 'coonawarra in south australia': not an ex list, so matchSA's
       # reverse-containment branch graded the tail on its own and 'in South
       # Australia' passed a question that says "Name the region". Every
       # phrasing that names the region still grades through 'coonawarra'.
       ["coonawarra", "coonawarra region", "coonawarra gi"],
       "The committee's first determination hewed close to the famous strip, and the growers drawn outside appealed through the tribunal and the Federal Court until the final boundary of 2003 took in most of the contested land. The case is the system's defining demonstration that when a law promises origin and nothing else, the map is the entire argument."),
    Q("The GI machine and the Coonawarra line",
      "Growers spent years and serious money litigating over which paddocks fall inside a GI whose rules dictate nothing about grapes, yields or winemaking. What were they actually buying?",
      ["The name: origin is all a GI controls, so printing it is the line's whole value",
       "A yield ceiling: production caps inside the line prop up the price of every grower's fruit",
       "Water: in a shortage, South Australian irrigation allocations are cut along GI boundaries",
       "Rates: land inside a declared region is assessed and taxed as premium agricultural ground"], 0,
      "The premium attaches to the word on the label rather than to anything the rules make the wine do, so being drawn outside the line reprices a vineyard overnight. That is the inversion at the heart of the system: French law fights over practices, Australian law only ever fights over maps."),

    # ----------- Barossa floor, Eden altitude and the Old Vine Charter (4) ---
    Q("Barossa floor, Eden altitude and the Old Vine Charter",
      "Two Shiraz labels sit side by side, one reading Barossa and the other Barossa Valley, and the difference is not a house abbreviation. What does the shorter name allow?",
      ["Fruit from Eden Valley as well as the floor: Barossa is the zone holding both regions",
       "Fruit from anywhere in South Australia, the way South Eastern Australia works across the east",
       "Nothing extra: the words are interchangeable in law, and the choice between them is typographic",
       "Declassified young-vine fruit from the same vineyards, one tier down in the manner of a second label"], 0,
      "The Barossa zone holds exactly two regions, the warm valley floor and the high ridges of Eden Valley a couple of hundred metres above it, and a blend across the pair falls back to the zone name. Producers reach for the single word deliberately: floor Shiraz for flesh, hill fruit for line, and a label that stays legally exact about the whole."),
    Q("Barossa floor, Eden altitude and the Old Vine Charter",
      "Old vine appears on labels the world over with no law anywhere defining it, yet in the Barossa the words carry fixed ages. What gives them their teeth there?",
      ["A charter the growers wrote themselves, its tiers binding nobody but the producers who sign it",
       "Federal labelling law, which sets a national minimum age for the words and audits the claim through vineyard records",
       "The Barossa Valley GI, whose registered conditions of use write the age tiers into origin law",
       "A certification trademark held by the South Australian government, licensed vineyard by vineyard"], 0,
      "Its definitions bind only by signature, because Australian wine law is a law of origin: a GI says where and stops, and no statute anywhere in it defines the age of a vine. The charter exists to make the claim documented and auditable where the law offers nothing at all."),
    SA("Barossa floor, Eden altitude and the Old Vine Charter",
       "Seventy years in the ground moves a Barossa block onto the second rung of the Old Vine Charter. Which name does it earn?",
       "Survivor Vine",
       ["survivor vine", "survivor", "barossa survivor vine", "survivor vines",
        "survivor vine tier", "survivor tier"],
       "The rungs sit at thirty-five, seventy, one hundred and one hundred and twenty-five years of continuous production, so a Survivor block has stood through at least seventy vintages. Age is counted from planting and has to be documented, which is much of the point: an old vineyard with papers is worth keeping in the ground."),
    SA("Barossa floor, Eden altitude and the Old Vine Charter",
       "In the mid-1980s a South Australian government program paid growers to rip vineyards out, and Shiraz planted in the 1880s went with them. Name the program.",
       "The Vine Pull Scheme",
       ["vine pull scheme", "vine pull", "vine pull program",
        "1985 vine pull scheme", "south australian vine pull scheme"],
       "A grape glut and the collapse of fortified sales left old dry-grown blocks worth less than the land under them, and the scheme paid for clearance with no regard to age. Barossa Shiraz and Grenache from the 1880s went onto bonfires, and those losses are why the blocks that survived are now counted, documented and priced the way they are."),

    # ------------------------- Hunter Semillon and the Riesling valleys (5) --
    Q("Hunter Semillon and the Riesling valleys",
      "Mid-January, while most of the country's whites hang weeks from picking, pickers strip Hunter Semillon at barely ten and a half baume. What has the winemaker gained by refusing to wait?",
      ["Ferocious acid, alcohol near eleven percent, and the crop in before the February rains break",
       "The green capsicum edge the style is supposedly built on, which another fortnight of sun would burn away",
       "A base lean enough to fortify economically, in the manner of the old Hunter trade",
       "Bunches still firm enough for the machine harvesters the contracts require"], 0,
      "Hunter Semillon is a bet that flavour can be grown in bottle instead of on the vine: picked at ten to eleven baume it goes to tank, never sees oak, and tastes of lemon and little else at release. The same wine at ten years is toast, honey and lanolin, and the early date is also insurance, since the region's subtropical rain arrives in earnest just as the rest of the country starts picking."),
    SA("Hunter Semillon and the Riesling valleys",
       "Well into the 1980s, bottles of the Hunter's great dry white carried a varietal name that belonged to an entirely different grape. What did the labels say?",
       "Hunter River Riesling",
       # No bare 'riesling'. The question asks what the labels SAID, and the
       # labels said three words; 'Riesling' on its own is also the most
       # available white-grape word in this category, printed in the Clare
       # closure question, the Polish Hill River stem and the show-bench stem,
       # so it was gradeable by availability rather than by knowledge. The
       # other half, 'Hunter River', is rejected too: neither half is what was
       # on the bottle.
       ["hunter river riesling", "hunter riesling", "hunter valley riesling",
        "it was labelled hunter river riesling",
        "labelled hunter river riesling",
        "labelled as hunter river riesling",
        "they labelled it hunter river riesling",
        "they labelled it as hunter river riesling",
        "semillon labelled hunter river riesling",
        "semillon labelled as hunter river riesling",
        "sold as hunter river riesling",
        "it was sold as hunter river riesling",
        "marketed as hunter river riesling",
        "it was marketed as hunter river riesling",
        "they called it hunter river riesling",
        "it was called hunter river riesling",
        "was called hunter river riesling",
        "semillon sold as hunter river riesling",
        "labels said hunter river riesling",
        "label said hunter river riesling",
        "labels said it was hunter river riesling",
        "it said hunter river riesling",
        "they said hunter river riesling",
        "said hunter river riesling",
        "called it hunter river riesling"],
       "Varietal truth came late to Australian labels: the Hunter called its Semillon Riesling, Clare called Crouchen the same thing, and the true grape went by Rhine Riesling to keep them apart. The export boom and the label audits of the 1990s finished the habit, and the old name survives only on museum bottles.",
       ex=True),
    Q("Hunter Semillon and the Riesling valleys",
      "From a Clare cellar comes a pair of bottles of one Riesling from the season its maker changed closures, bottled under both. Twenty years on, what does the pair typically show?",
      ["The screwcapped wine paler and limier, the corked one deeper, broader and scattered bottle to bottle",
       "Nothing between them but luck: closures decide taint, and development runs at one pace under both",
       "The corked bottle the fresher of the two, its slow breath of oxygen keeping the fruit alive",
       "The screwcapped bottle the deeper gold of the pair, metal conducting cellar heat into the wine faster than cork can"], 0,
      "Under cork the same wine browned faster and no two bottles agreed, which for a wine sold on decade-long ageing made every case a lottery. The screwcap stretched the arc and made it uniform, and Clare and Eden Riesling are now built for exactly that: bone dry and taut at bottling, expected to be opened anywhere along a twenty-year road."),
    SA("Hunter Semillon and the Riesling valleys",
       "Ask at an Australian cellar door and the screwcap often answers to a French brand name from the 1970s trials. Give the name.",
       "Stelvin",
       ["stelvin", "stelvin cap", "stelvin closure", "stelvin screwcap"],
       "The cap was developed in France and trialled on Australian Riesling in the 1970s, a generation before the Clare growers revived it, and the brand went generic the way vacuum flasks became thermoses. Strictly it names one manufacturer's closure, but on an Australian list the word simply means the wine is not under cork."),
    SA("Hunter Semillon and the Riesling valleys",
       "Slate and shale break through the ground in one Clare Valley district whose Riesling runs flintier and sterner than the limestone valleys manage. Name the district.",
       "Polish Hill River",
       ["polish hill river", "polish hill", "polish hill river district",
        "polish hill river valley"],
       "The district takes its name from the Polish families who settled it in the nineteenth century, and its broken slate gives a slower-opening, stonier Riesling than Watervale's limestone, which drinks earlier and rounder. Tasting the two side by side is the standard Clare lesson in how much the ground shows through one grape."),

    # -------------------------- Margaret River and the cool-climate set (6) --
    SA("Margaret River and the cool-climate set",
       "A 1965 paper by a Perth agronomist matched an unplanted corner of Western Australia against Bordeaux's climate, and vineyards followed within a couple of years. Who wrote it?",
       "John Gladstones",
       ["john gladstones", "gladstones", "dr john gladstones",
        "the agronomist john gladstones"],
       "Gladstones compared temperature, sunshine and rainfall records against Bordeaux and concluded the district would ripen Cabernet more reliably than anywhere then planted in the state; the first vines went in at Vasse Felix in 1967. Margaret River stands among the few celebrated regions anywhere founded on a published scientific argument rather than a settler's hunch."),
    SA("Margaret River and the cool-climate set",
       "Ironstone gravel over granite ridges around one brook carries the district where Margaret River's founding Cabernet estates cluster. Name the district.",
       "Wilyabrup",
       ["wilyabrup", "willyabrup", "wilyabrup district", "wilyabrup valley"],
       "The gravelly loam drains freely and holds vigour down, which is the regional Cabernet claim in miniature, and the plantings of the late 1960s cluster on these ridges between the two capes. Wilyabrup began as growers' usage rather than a line in the register, and it appears on labels anyway because the trade knows what it means."),
    SA("Margaret River and the cool-climate set",
       "Straggly bunches of tiny seedless berries mixed among normal ones mark the clone most Margaret River Chardonnay is grown on. Name it.",
       "The Gin Gin clone",
       ["gin gin clone", "gin gin", "gingin clone", "gingin",
        "mendoza clone", "mendoza", "gin gin chardonnay clone"],
       "The clone came through the Gingin research station north of Perth and carries the Mendoza clone's hen-and-chicken set, which cuts yield and raises the skin-to-juice ratio. A good share of the intensity Margaret River Chardonnay is praised for is planted, not made."),
    Q("Margaret River and the cool-climate set",
      "Serious Australian Pinot Noir comes overwhelmingly from four places, each kept cool by a different lever. Which pairing runs true?",
      ["Hills east of Melbourne for the Yarra, water on three sides for Mornington, altitude for the Adelaide Hills, latitude for Tasmania",
       "Hills east of Melbourne for the Yarra, altitude for Mornington, water on three sides for the Adelaide Hills, latitude for Tasmania",
       "Latitude for the Yarra, water on three sides for Mornington, altitude for the Adelaide Hills, hills east of Melbourne for Tasmania",
       "Hills east of Melbourne for the Yarra, latitude for Mornington, altitude for the Adelaide Hills, water on three sides for Tasmania"], 0,
      "Each lever buys the same slow ripening a different way: the Yarra climbs into the ranges, Mornington sits in the sea, the Adelaide Hills stand hundreds of metres over a hot city, and Tasmania is simply further south than anywhere on the mainland. Knowing which region pulls which lever is what lets a taster explain why four Pinots off one shelf differ the way they do."),
    SA("Margaret River and the cool-climate set",
       "Up to four hundred metres at the valley's cool end, Chardonnay roots into deep red volcanic soil that the warmer floor around Coldstream lacks. Which part of the Yarra is that?",
       "The Upper Yarra",
       # ex=True keeps the Yarra Valley as a whole out, so the list has to
       # carry the phrasings the stem's own tail invites: it asks "which part
       # of the Yarra is that", and "the upper part of the Yarra" was rejected.
       ["upper yarra", "upper yarra valley", "upper yarra district",
        "upper yarra region", "upper yarra area",
        "upper yarra subregion", "upper yarra sub region",
        "the upper part of the yarra",
        "the upper part of the yarra valley",
        "the upper end of the yarra",
        "the upper end of the yarra valley",
        "upper yarra victoria", "upper yarra valley victoria"],
       "The Upper Yarra around Hoddles Creek and Gladysdale sits higher and cooler than the old estates of the floor, on deep red volcanic ground where the lower valley runs to grey-brown loams. Fruit from up there carries the acid line the Chardonnay and sparkling houses hunt, and it can come off the vine weeks after the floor.",
       ex=True),
    SA("Margaret River and the cool-climate set",
       "Basalt caps the highest planted ground on the Mornington Peninsula, holding its coolest and latest vineyards, and the trade names that whole band of high country after one small township on it. Name the township.",
       "Red Hill",
       ["red hill", "red hill south", "red hill district"],
       "The township is named for the iron-rich soil the basalt weathers to, which holds water into summer and sits high enough that picking runs weeks behind the sandier country toward Moorooduc, where the fruit ripens earlier and broader. The peninsula's tastings are organised by elevation as much as by producer, and Red Hill is the top of that ladder."),

    # ------------------------- Rutherglen, the river and the show bench (5) --
    SA("Rutherglen, the river and the show bench",
       "Under trade pressure, Rutherglen's Muscadelle fortified had to stop calling itself Tokay, because the name belonged to a wine region on the other side of the world. Which region?",
       "Tokaj",
       # No bare 'tokay' and no 'it was tokay'. The stem prints Tokay, so those
       # two graded a student who typed the stem's own word back and showed
       # nothing. The forms kept with that spelling all name Hungary as well,
       # which is the knowledge the question is after.
       ["tokaj", "tokaji", "hungary", "hungarian tokaj",
        "hungarian tokay", "tokaj in hungary", "tokay in hungary",
        "tokaji in hungary", "hungarian region of tokaj",
        "hungary's tokaj", "hungarys tokaj", "tokaj hegyalja",
        "tokaj hungary", "tokaji hungary", "tokaj region", "tokaji region",
        "region of tokaj", "tokaj region of hungary",
        "tokaj region in hungary", "it was tokaj", "it was hungary"],
       "Hungary's Tokaj is protected in every market the European agreements reach, so the borrowed spelling had to go. Rutherglen coined Topaque for its Muscadelle wine, an invented word with no place behind it, while the companion Muscat kept its name because Muscat names the grape rather than anybody's ground; the style never changed, only the passport.",
       ex=True),
    Q("Rutherglen, the river and the show bench",
      "A drought summer on the Murray, and some inland growers pick as normal while neighbours let whole blocks burn off unwatered. What decided who farmed?",
      ["The water market: allocations trade separately from land, and that year's price beat the crop",
       "Seniority: licences issued earliest draw first in a shortage, and the newest vineyards queue behind the old orchards",
       "Rainfall: the river districts lie far enough apart that summer storms soak some and miss others entirely",
       "A federal ballot that shares the river's water among growers in proportion to their planted hectares"], 0,
      "Murray-Darling water is held as entitlements separate from land title, with each season's allocation priced on an open market, so in a drought a grower weighs the water's sale value against the crop's. The commercial tier runs on that arithmetic: the inland river regions grow the bulk of the national crush, and their vineyards exist only as long as the sums work."),
    SA("Rutherglen, the river and the show bench",
       "In 1965 a Riverland winemaker patented a package that put a gallon of everyday wine in the fridge door, and it still moves a huge share of the commercial tier. What is it called in Australia?",
       "The wine cask",
       # ex=True is what keeps an oak cask out, so the everyday synonyms have to
       # be enumerated rather than left to containment.
       ["wine cask", "cask", "cask wine", "bag in box", "bag in box wine",
        "bag in box wine cask", "cardboard cask", "wine in a box",
        "goon bag", "goon sack", "goon", "box wine", "boxed wine",
        "box of wine", "wine box"],
       "Thomas Angove of Renmark patented the bag-in-box wine cask: a bladder that collapses as it empties, admitting no air, inside a carton that undercuts glass on every cost that matters. It is the natural package of the irrigated inland tier, and it taught a generation of Australians to buy wine by the litre.",
       ex=True),
    Q("Rutherglen, the river and the show bench",
      "At a capital-city wine show a single Riesling class ends the day with eleven gold medals, and nobody finds that odd. How are the medals decided?",
      ["Against a fixed score line: every wine that clears the mark takes a medal, whatever the rest of its class does",
       "By podium: the class is ranked and the top three take gold, silver and bronze, with ties shared",
       "By quota, with each judging panel issuing one gold for every ten entries that cross its bench",
       "By price bracket, the best wine under each price point taking home the gold for it"], 0,
      "The capital-city shows judge each class against a score standard, with a medal for every wine over the line and the trophies above them judged competitively. Medal stickers move stock off retail shelves, which is why companies enter at industrial scale and why show results have steered Australian style for a century."),
    SA("Rutherglen, the river and the show bench",
       "One Melbourne trophy for the show's best young red is credited with selling more wine than any review in the country. Name it.",
       "The Jimmy Watson Trophy",
       ["jimmy watson trophy", "jimmy watson", "jimmy watson memorial trophy"],
       "It has been awarded at the Melbourne show since 1962 in memory of a city wine merchant, and its commercial pull is famous and famously argued over. For decades it could go to an unfinished wine still in barrel, so the bottle a customer eventually bought was a promise rather than the wine the judges tasted."),
]
