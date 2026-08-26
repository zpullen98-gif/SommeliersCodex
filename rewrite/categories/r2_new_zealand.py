"""Rank II rewrite - New Zealand (13 questions: 7 MC, 6 short answer).

Certified level, pitched above the committed Rank I New Zealand category. Rank I
places the regions on the map; these thirteen separate the ground inside them:
the Awatere against the Wairau and the clay valleys behind both, the Central
Otago basins and what a hundred metres of elevation does between them, the
soil-drawn line and sourcing rule of the Gimblett Gravels, the Martinborough
terrace, and the nested names of Canterbury. The running order is built around
one idea: walk the contested ground from Marlborough south and back up the
North Island, then finish with the three things the industry decided as one
body rather than winery by winery - a clone, a statute and a closure. Nothing
here repeats a Rank I task.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards by check-similarity.py.

Accept lists were graded by executing lib.match_sa rather than by eye: for each
list the displayed answer and natural rephrasings of it were confirmed True and
every nameable wrong answer - the neighbouring subregion, the inverted
threshold, the rival statute - confirmed False, with the scratch script as the
record. No '~' entries appear anywhere. Every answer that carries a digit (a
percentage, a year, a clone code) is ex=True with its carrier phrasings
enumerated, because containment grades an inversion like "less than 95 percent"
and exact matching is the only door that shuts on it. Facts are limited to ones
that do not drift: geology, elevation, statute and the industry's own recorded
decisions rather than plantings, prices or ownership.
"""

from lib import Q, SA

CAT = "New Zealand"
SLUG = "r2-new-zealand"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("Inside Marlborough", 2),
    ("Central Otago's basins", 3),
    ("The Martinborough Terrace", 1),
    ("The Gimblett Gravels", 2),
    ("Names on the map and the law", 2),
    ("A clone and a closure", 3),
]

BANK = [
    # ------------------------------------------------ Inside Marlborough (2) -
    Q("Inside Marlborough",
      "Marlborough wineries holding fruit in both of the province's big valleys crush their Wairau blocks first every vintage; the Awatere lots follow as much as a fortnight later, greener and sharper. What holds the Awatere back?",
      ["Higher terraces, nearer the cold open sea",
       "Pick dates written into grower contracts, staggered to keep the press hall clear",
       "Heavy clay beneath the whole valley, holding cold water against the roots into summer",
       "A full degree more latitude, under which autumn light fails sooner"], 0,
      "The Awatere climbs onto old uplifted terraces well above the Wairau floor and lies open to cold southerly air off the Pacific, so heat accumulates slowly all season and the tomato-leaf, pyrazine side of the grape survives into the bottle. The two valleys sit at almost the same latitude, and the fortnight is the work of elevation and exposure, not daylength or soil."),
    SA("Inside Marlborough",
       "Fairhall, Omaka and Ben Morven leave the stony Wairau flats for cooler, clay-floored country in the hills, and Marlborough's growers know the set of them by one collective name. Give it.",
       "The Southern Valleys",
       ["southern valleys", "southern valleys of marlborough",
        "marlborough s southern valleys", "southern valleys subregion"],
       "The Southern Valleys angle into the hills from the Wairau's southern flank, and their clay bottoms hold water that the shingle of the open plain sheds at once, while cooler air drains down them at night. That steadier, cooler ground behaves quite differently from the stony flats, which is precisely the distinction the collective name exists to record."),

    # -------------------------------------------- Central Otago's basins (3) -
    Q("Central Otago's basins",
      "Thirty-odd kilometres separate one firm's Pinot Noir blocks at Bendigo from its rows at Gibbston, yet the two picks land weeks apart every autumn and never overlap. What separates the sites?",
      ["Elevation: the Gibbston vines stand about a hundred metres higher, and that costs weeks of season",
       "A sea breeze that reaches Bendigo up the Clutha but dies before the gorge",
       "Heavier clay soils under the Gibbston blocks, which hold cold spring water against the roots well into the summer",
       "Crop levels, because Gibbston growers hang double the fruit and heavy crops finish late"], 0,
      "Gibbston hangs in the Kawarau gorge, the highest and coolest ground in Central Otago, while Bendigo's terraces are among its warmest, and at the cool margin for Pinot Noir roughly a hundred metres of altitude moves harvest by weeks. No sea breeze reaches any of it; this is New Zealand's one semi-continental climate, where elevation and enclosure do the work that distance from the ocean does everywhere else."),
    SA("Central Otago's basins",
       "Sluicing for gold in the 1860s stripped whole hillsides above the Kawarau's southern bank, and the scarred, sun-baked amphitheatre the miners left is now the most densely planted ground in Central Otago. Name the subregion.",
       "Bannockburn",
       # No entry carries the stem's own words. "bannockburn in central otago"
       # was cut because matchSA let a student score by typing back the stem's
       # "in central otago" alone; the plain entry still grades that full
       # phrasing by containment, so nothing legitimate was lost. For the same
       # reason no "bannockburn central otago" form replaces it: the stem says
       # Central Otago, and that entry would grade the bare region name.
       ["bannockburn", "the bannockburn subregion", "bannockburn otago"],
       "Bannockburn sits where the Kawarau meets the Cromwell Basin, and the miners' water-cannon history is still legible in bare clay cliffs and tailings among the vines. Hot by day, cold at night and nearly desert-dry, it delivers the dense, dark end of Central Otago Pinot Noir and holds the tightest concentration of plantings in the region."),
    Q("Central Otago's basins",
      "Under four hundred millimetres of rain falls in a year on parts of the Cromwell Basin, and Bendigo's deep, free-draining terraces are the thirstiest ground in it. Which intervention makes a vineyard there possible at all?",
      ["Irrigation", "Wind machines", "Shade cloth", "Netting"], 0,
      "Central Otago is the one New Zealand region where drought rather than rain sets the farming calendar, and drip lines went in with the vines almost everywhere. Wind machines answer spring frost, a real Otago hazard but a different one; netting keeps birds off ripening fruit; shade cloth tempers sun on the berry; and none of them puts water into gravel that cannot hold it."),

    # ---------------------------------------- The Martinborough Terrace (1) --
    Q("The Martinborough Terrace",
      "Barely twenty metres of rise separate Martinborough's celebrated terrace from the paddocks around it, yet nearly every serious Pinot Noir block in the district crowds onto it. What do those few metres, and the deep shingle beneath them, actually buy?",
      ["Cold air slides off its edge on frost nights, and rain drains straight through the shingle",
       "A degree of extra coolness from altitude, which the district's whole style depends on",
       "Shelter from the northwesterly gales that hammer the rest of the valley all the way through flowering",
       "A shallow water table the roots can reach, sparing growers the cost of irrigation"], 0,
      "The terrace is an old bed of the Huangarua and Ruamahanga rivers, deep in free-draining gravels, and its edge lets cold air drain away to lower ground on still nights. Nothing about it blocks the wind, which still cuts the crop at flowering; what it offers is dry feet and safe hang time, the two things thin-skinned Pinot Noir most needs in a damp country."),

    # ---------------------------------------------- The Gimblett Gravels (2) -
    Q("The Gimblett Gravels",
      "Ripening on one patch of Hawke's Bay runs days ahead of the vineyards nearer the coast, and its Syrah and Cabernet carry a weight coastal growers rarely match. What gives the Gimblett Gravels that head start?",
      ["Distance blunts the afternoon sea breeze there, and the bare stones bank the day's heat and hand it back after sundown",
       "Several hundred metres of altitude, which lifts the vines clear of the marine cloud layer",
       "An association rule against irrigation, whose drought stress reads on the palate as ripeness",
       "Beds of dark volcanic ash beneath the shingle, holding warmth that grey stones cannot"], 0,
      "The old riverbed lies inland of Hastings, out of the afternoon breeze that cools Te Awanga and the coastal blocks, and its almost soil-free shingle stores heat and releases it into the evening, stretching the warm hours of every ripening day. The same stones are poor and free-draining, so crops stay naturally small, which is the other half of the district's concentration; the land itself is low-lying, and growers there irrigate freely."),
    SA("The Gimblett Gravels",
       "Printing the Gimblett Gravels name on a label takes more than farming inside the district: the growers' association licenses the words only when a wine's sourcing clears a bar stricter than the one national labelling law sets for any stated region. Give that minimum share.",
       "95 percent",
       ["95 percent", "95", "95%", "95 per cent", "ninety five percent",
        "ninety five", "at least 95 percent", "at least 95%",
        "a minimum of 95 percent", "95 percent of the fruit",
        "ninety five per cent", "at least 95 per cent",
        "at least ninety five percent", "minimum 95 percent",
        "95 percent minimum", "95 percent of the grapes",
        "ninety five percent of the fruit"],
       "Ninety-five percent of the fruit must come off the mapped shingle itself, and the name is enforced as a trademark held by the growers' association rather than as a registered geographical indication. The rule is the district insisting that its soil boundary is the whole point: a wine drawing meaningfully on other ground may not borrow the address.",
       ex=True),

    # -------------------------------------- Names on the map and the law (2) -
    Q("Names on the map and the law",
      "Three registered geographical indications can all appear truthfully on one grower's wine: Waipara Valley, North Canterbury and Canterbury. How do the three names relate?",
      ["They nest, smallest inside largest, and the producer may claim any of the three",
       "They are three registered names for a single identical boundary, kept so older labels can stay in print",
       "Waipara Valley is the widest of the three, reaching across the whole of the old provincial district",
       "Each one covers separate ground, so only one of them can ever be true of a given vineyard"], 0,
      "New Zealand's registrations may sit one inside another, and how tightly to pin the wine down is the producer's choice, provided the stated name meets the sourcing threshold that every origin claim carries. Waipara Valley is the smallest of the three and the one with a style attached to it; the broader the name chosen, the less it commits the wine to."),
    SA("Names on the map and the law",
       "Passed in 2006, then left dormant for over a decade until it finally came into force in 2017, one statute lets New Zealand's wine regions register their names. Name it.",
       "The Geographical Indications (Wine and Spirits) Registration Act",
       ["geographical indications wine and spirits registration act",
        "geographical indications registration act",
        "geographical indications act", "gi act", "gi registration act",
        "geographical indications wine and spirits act",
        "geographical indications wine spirits registration act"],
       "The Geographical Indications (Wine and Spirits) Registration Act defines a name's boundary and gives its users legal standing to defend it, at home and in trade negotiations abroad, and that is all it does: no variety, yield or winemaking rule attaches to any New Zealand name. Registration is voluntary and paid for by the applying industry body, which is why the register filled up only once export agreements made the protection worth buying."),

    # ---------------------------------------------- A clone and a closure (3) -
    SA("A clone and a closure",
       "One imported selection, bulked up through nursery after nursery as planting outran supply, stands behind almost every Sauvignon Blanc vine in Marlborough. Name the clone.",
       "UCD1",
       ["ucd1", "ucd 1", "clone ucd1", "clone ucd 1", "ucd clone 1",
        "davis clone 1", "the davis clone", "uc davis clone 1", "uc davis 1",
        "ucd1 clone", "it is ucd1", "uc davis clone", "ucd 1 clone",
        "university of california davis clone 1"],
       "UCD1 came direct from the University of California at Davis, imported by the government viticulturist and released to a trial block in 1970, and the speed of Marlborough's expansion meant nurseries multiplied the one proven selection rather than diversifying. A single set of genes across tens of thousands of hectares is much of why the style is so consistent at volume, and it concentrates risk the same way, which is why newer plantings finally blend in other material.",
       ex=True),
    Q("A clone and a closure",
      "Almost every Sauvignon Blanc vine in Marlborough shares one set of genes, and the industry's own scientists describe that uniformity as its largest structural exposure. What is the worry?",
      ["A weakness one vine has, every vine has, so a new pest, virus or shifted climate strikes the whole region at once",
       "The wines cannot legally be sold as varietal Sauvignon Blanc",
       "Uniform genetics leave the vines sterile, so nurseries must import fresh budwood every season",
       "Single-clone vineyards fail sustainability audits, which closes the main export channels"], 0,
      "Genetic uniformity means uniform susceptibility: a disease, a pest or a run of unsuitable vintages that finds one vine's weakness finds them all, with no diverse material standing as a fire break. That is why replanting programmes and newer vineyards now spread across additional clones and selections, trading a little of the region's famous consistency for resilience."),
    SA("A clone and a closure",
       "Tired of taint and bottle variation, a small band of wineries formed an initiative to move the whole country onto the screwcap, and within a decade the cork had become the exception on New Zealand shelves. Give the year they launched it.",
       "2001",
       ["2001", "in 2001", "the year 2001", "two thousand and one",
        "two thousand one", "launched in 2001", "it launched in 2001",
        "launched 2001", "founded in 2001", "it was founded in 2001",
        "it was 2001", "the year was 2001"],
       "The Screwcap Wine Seal Initiative was founded in 2001, Marlborough houses prominent among its members and the Clare Valley's Riesling producers a year ahead of them across the Tasman. Because it was an industry campaign rather than one winery's experiment, adoption ran to the top of the market as quickly as the bottom, and the argument soon moved on from whether to seal wine this way to how much oxygen a liner should admit.",
       ex=True),
]
