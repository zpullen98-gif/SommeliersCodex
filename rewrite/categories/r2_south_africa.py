"""Rank II rewrite - South Africa (16 questions: 8 MC, 8 short answer).

Certified level, pitched deliberately above the Rank I South Africa category.
Rank I walks the map - the districts, the winds, the grapes and their Cape
names. This category owns the machinery and the ground: what the Wine of
Origin scheme actually demands tier by tier, what the certification seal is
withheld for, which rock does what beneath the vines, how the old-vine story
became auditable, and who dismantled the old order and what grew in its
place. Nothing here repeats a Rank I task.

The running order is built around one idea: start at the rulebook and dig
down, then climb back up. The scheme's mechanics first, then the rocks its
wards are drawn on, then the old vines the ground preserved, then the two
cellar arguments every Cape list provokes - Pinotage and Cap Classique - and
last the industry's remaking, from the KWV's statutory grip to the
Swartland's self-imposed code.

Written from the syllabus below. The imported bank was not read while
writing; it is read only afterwards by check-similarity.py.

Accept lists are graded by lib.match_sa, the port of core.js matchSA, and
were verified by execution rather than by eye: a scratch script grades every
displayed answer and several natural phrasings of it as correct, and every
nameable wrong answer - the neighbouring shale, the rival body, the inverted
threshold - as wrong. The two threshold answers, the scheme's birth year and
the lees minimum, carry ex=True with their carrier phrasings enumerated so no
comparative or negated form can grade. No '~' entries appear anywhere. Facts
are restricted to ones that do not drift: scheme mechanics, geology, settled
history and enacted regulation rather than prices, hectares or personnel.
"""

from lib import Q, SA

CAT = "South Africa"
SLUG = "r2-south-africa"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("The Wine of Origin machinery", 4),
    ("The rock beneath the winelands", 2),
    ("Old vines and the Chenin inheritance", 3),
    ("Pinotage", 2),
    ("Cap Classique", 2),
    ("The KWV and the Swartland answer", 3),
]

BANK = [
    # ------------------------------------ The Wine of Origin machinery (4) ---
    Q("The Wine of Origin machinery",
      "Drawing a new ward onto the Wine of Origin map takes evidence a new district never has to produce. What must the applicants demonstrate?",
      ["A distinct soil, climate and ecology in the ground itself",
       "That at least ten registered producers already make and bottle wine inside the proposed boundary",
       "That the area lies wholly within a single registered estate",
       "That the proposed name has a documented history of use on labels going back fifty years"], 0,
      "A district can follow broad geography and even administrative convenience, but the ward is the scheme's terroir tier and its boundary has to be argued from the land. That is why a ward name like Groenekloof carries real information on a label: it is a claim about the ground, not about a map-maker's tidiness."),
    Q("The Wine of Origin machinery",
      "Records alone cannot win a Cape wine its certification seal. What must the wine itself get through before the seal is granted?",
      ["A blind tasting panel and laboratory analysis",
       "Six months of maturation in tank or barrel before bottling",
       "A vineyard inspection at harvest",
       "A ballot of its district's producers"], 0,
      "Every certified wine is chemically analysed and tasted blind by the Wine and Spirit Board's panels, and a faulty wine fails whatever its paperwork says. The seal is therefore a statement about the liquid as well as the ledger, which is not true of every origin system in the world."),
    SA("The Wine of Origin machinery",
       "Europe's appellation idea reached the Cape as law in the early 1970s, and one vintage was the first sold under Wine of Origin seals. Give the year.",
       "1973",
       ["1973", "in 1973", "1973 vintage",
        "nineteen seventy three"],
       "The scheme was promulgated in 1972 and certified its first wines with the 1973 harvest, which makes it one of the oldest origin systems outside Europe. It borrowed the layered idea of place from the French model while refusing the link between place and permitted grape: a Cape origin says where the fruit grew, and nothing else.",
       ex=True),
    SA("The Wine of Origin machinery",
       "One producer, one cellar, and a flagship blend drawing on vineyards forty kilometres apart. Which label claim has the distance cost that wine?",
       "Estate wine",
       ["estate wine", "estate", "single estate", "the estate wine claim",
        "wine of origin estate wine",
        "estate wine designation", "the estate designation",
        "estate wine of origin", "the word estate",
        # US wording, not a Cape claim; kept deliberately as a
        # concept-equivalent, safe because ex=True is exact-only.
        "estate bottled"],
       "An estate wine must come off land farmed as one contiguous unit, with the wine made in a cellar standing on that unit, so scattered vineyards disqualify the words however good the farming. The claim is about unity of place and production, not quality: a second farm across the valley, or any bought-in fruit, bars a wine that may still be the best in the country.",
       ex=True),

    # ---------------------------------- The rock beneath the winelands (2) ---
    Q("The rock beneath the winelands",
      "Climbing from the Swartland's rolling grain country to a fold-mountain summit crosses the winelands' three great rocks in a single walk. In what order?",
      ["Shale in the low hills, granite on the middle slopes, sandstone at the top",
       "Granite in the low hills, shale across the middle slopes, sandstone capping the top",
       "Sandstone in the low hills, granite on the middle slopes, shale at the top",
       "Shale in the low hills, sandstone across the middle slopes, granite forming the summit"], 0,
      "The low country is shale ground, the domes and foot slopes - Paarl Mountain, the Paardeberg, the lower flanks of the Simonsberg - are granite, and the sandstone caps the peaks. Soils creep downhill, so a foot-slope block often farms a mixture of all three, which is one reason Cape growers name the rock rather than the topsoil."),
    SA("The rock beneath the winelands",
       "Every other rock in the winelands is younger than the one the whole Cape stands on, an ocean-floor mud pressed hard more than half a billion years ago. Name it.",
       "Malmesbury shale",
       ["malmesbury shale", "malmesbury", "malmesbury group",
        # Bare "malmesbury" matches by containment, so "malmesbury sandstone"
        # also grades correct. Deliberate: the group name is the identifying
        # fact the stem asks for, and the stem itself supplies the lithology.
        "malmesbury shales", "shale of the malmesbury group"],
       "The Malmesbury Group is Precambrian sediment, hardened before the first shelled creatures existed, and everything else under the vineyards is dramatically younger. It weathers to deep red-brown clay hills that hold winter rain well, and its sheer age is part of why Cape soils run so leached and naturally low in vigour."),

    # ---------------------------- Old vines and the Chenin inheritance (3) ---
    Q("Old vines and the Chenin inheritance",
      "Mid-century plantings of Chenin Blanc outlived the brandy boom that put them in. Why were so many old blocks never pulled up?",
      ["They kept bearing a cheap, usable crop on land where replanting promised no return",
       "Legislation forbids uprooting any vineyard more than fifty years old",
       "The KWV paid a premium for fruit off older vines, making them the most valuable blocks on a farm",
       "Phylloxera never crossed into the western districts, so nothing ever forced those vineyards to be replanted"], 0,
      "Nobody preserved them on purpose; they stood where pulling them out was an expense with no return, still yielding distilling and blending fruit at almost no cost. When a newer generation went looking for settled vigour and concentration, that neglect turned out to have banked something money cannot replant quickly, and old-block fruit now commands multiples of the district price."),
    SA("Old vines and the Chenin inheritance",
       "Vineyards that pass the Old Vine Project's audit may wear a neck seal announcing their standing. What is the seal called?",
       "Certified Heritage Vineyards",
       ["certified heritage vineyards", "heritage vineyards",
        "certified heritage vineyard", "heritage vineyard",
        "certified heritage vineyards seal", "heritage vineyards seal"],
       "The seal certifies blocks of thirty-five years and older and prints the year the vines went into the ground, so a claim most countries make loosely is auditable on a Cape bottle. Certification runs vineyard by vineyard rather than producer by producer, which is why one cellar can hold sealed and unsealed bottlings of the same variety."),
    SA("Old vines and the Chenin inheritance",
       "A Cape producer can prove a vine's age to the year, because every planting since the 1970s sits in one body's records. Which body keeps them?",
       "SAWIS",
       ["sawis", "south african wine industry information and systems",
        "south african wine industry information systems",
        "sa wine industry information and systems"],
       "SAWIS keeps the national vineyard register, fed by compulsory planting documentation, and the old-vine audits lean on that paper trail rather than on a grower's memory. Few wine countries can date a block so precisely, which is why the Cape's old-vine claim is verifiable where most are marketing."),

    # ------------------------------------------------------- Pinotage (2) ----
    Q("Pinotage",
      "A guidebook files Pinotage as 'South Africa's hybrid', and a Certified candidate should wince. What makes the word wrong?",
      ["Both parents are Vitis vinifera, so it is a crossing",
       "A hybrid must arise by accident in the field, and Pinotage was bred deliberately at a research station",
       "Hybrids are sterile by definition, and Pinotage sets viable seed in any vineyard",
       "The word hybrid is reserved for rootstocks rather than fruiting varieties"], 0,
      "Perold's 1925 cross joined two members of the same species, which makes Pinotage a crossing in exactly the sense the German breeding-station varieties are. Hybrid is reserved for crosses between species, vinifera with an American vine, and the distinction has teeth: hybrids face legal barriers in most European appellations that crossings never meet."),
    SA("Pinotage",
       "Old-style Pinotage drew one criticism above all: a reek of acetone and overripe banana. Which family of fermentation by-products is responsible?",
       "Esters",
       ["esters", "isoamyl acetate", "volatile esters",
        "fruity esters", "ester compounds"],
       "Isoamyl acetate is the named culprit, the same ester that flavours banana sweets, and Pinotage ferments throw it more readily than most red varieties. Producers rein it in with riper fruit, sounder ferments and more careful elevage, so the smell now dates a bottle to an era rather than defining the grape."),

    # -------------------------------------------------- Cap Classique (2) ----
    Q("Cap Classique",
      "Traditional-method Cape sparkling wine once borrowed French words for itself. Why does the category now carry a name of its own?",
      ["Trade agreements shut Champagne's terms, even methode champenoise, to outsiders",
       "French wording is barred outright from South African wine labels",
       "A licence fee was charged for every label carrying the French phrase",
       "The Cape's method departs far enough from Champagne's practice that the French term amounted to false description"], 0,
      "Producers coined Methode Cap Classique in 1992, ahead of the trade deals with Europe that formally retired methode champenoise along with borrowed names like port and sherry. The wording was deliberate: classique claims the classic method while Cap names the place, and the producers' association that grew around the term now guards it."),
    SA("Cap Classique",
       "After its second fermentation, a Cap Classique must wait before disgorging can even be scheduled. What is the legal minimum time on the lees?",
       "Twelve months",
       ["twelve months", "12 months", "twelve", "12", "one year", "a year",
        "1 year", "twelve months on the lees", "12 months on the lees", "at least twelve months", "at least 12 months",
        "minimum of twelve months", "a minimum of 12 months",
        "twelve months minimum", "12 months minimum", "minimum twelve months",
        "minimum of 12 months on the lees", "minimum of twelve months on the lees",
        "minimum 12 months on the lees", "minimum twelve months on the lees",
        "at least 12 months on the lees", "at least twelve months on the lees",
        "12 months lees ageing", "twelve months lees ageing",
        "12 months lees aging", "twelve months lees aging",
        "one year on the lees", "a year on the lees"],
       "The twelve-month floor entered the regulations at the start of the 2020s, replacing the nine months producers had previously worked to, and serious houses go well past it, with three years and more for prestige bottlings. The clock runs on the second fermentation's lees in the same bottle, which is where the category buys its biscuit depth, and it is the rule that most separates Cap Classique from tank-method fizz at the same price.",
       ex=True),

    # ----------------------------------- The KWV and the Swartland answer (3) -
    Q("The KWV and the Swartland answer",
      "For most of the twentieth century the Cape's problem was too much wine, not too little. What did the KWV do with the surplus its members delivered?",
      ["Distilled it, turning the surplus into brandy, fortified wine and spirit stocks",
       "Exported it in bulk at prices below the cost of production",
       "Bought it up and destroyed it under supervision",
       "Blended it into a national reserve held back against short harvests"], 0,
      "The KWV was founded on the surplus problem, and distillation was its answer: the guaranteed minimum price was pitched at distilling wine, so the pot still and the fortified cellar became the industry's safety valve. That is why brandy and fortified styles loomed so large in the old Cape, and why so much high-cropping white went into the ground."),
    Q("The KWV and the Swartland answer",
      "Statutory price floors and quotas ended in the 1990s, yet KWV remains a name on bottles and brandy. What became of the organisation?",
      ["It turned itself into an ordinary company and carried on as a producer",
       "It survives as a growers' union, stripped of any commercial arm",
       "It became the industry's certification authority",
       "It was dissolved and its name passed to the state"], 0,
      "The co-operative converted into a company in 1997, shedding its statutory powers, and today it competes as one producer among many, best known for brandy. Nothing replaced the quota system at all, and that vacuum is what let the vineyard map redraw itself around quality rather than volume; the replanting of the modern Cape dates from this deregulation."),
    SA("The KWV and the Swartland answer",
       "Growers around the Paardeberg and Riebeek-Kasteel bound themselves to a code - local fruit only, ambient-yeast ferments, no added acid, restraint with new oak - and badge their bottles for it. Name the group.",
       "The Swartland Independent Producers",
       ["swartland independent producers", "swartland independents",
        "independent producers", "swartland independent producers group",
        "swartland independent producers (sip)", "sip"],
       "Founded at the start of the 2010s by the district's new wave, the group wrote a production charter rather than a marketing club: members' wines must be grown in the Swartland and made within listed limits on additions and new wood. The same circle staged the Swartland Revolution tastings that pulled the world's attention north of Cape Town, and the philosophy of old vines, dry farming and minimal intervention has outlived the festival itself."),
]
