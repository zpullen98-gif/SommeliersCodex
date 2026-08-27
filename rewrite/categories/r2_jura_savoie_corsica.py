"""Rank II rewrite - Jura, Savoie & Corsica (24 questions: 5 MC, 19 short answer).

France's mountain and island fringe at Certified level. The Jura carries half the
weight because its rules are the examinable ones: what may become vin jaune, how
long the voile works, which bottle the result may use, and where everything the
rules exclude must go. Savoie is read the way its labels are read, cru by
appended cru, and Corsica through its rocks, since granite, schist and one
limestone pocket explain where each of its grapes sits.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards by check-similarity.py.

Boundary decisions, recorded so they are not re-litigated. Macvin and Muscat du
Cap Corse are named and placed - juice plus marc, the island's lone VDN - but
the mechanics of mutage belong to Fortified Wines and stay there. Vin de paille
gets a passing mention and no task, since Dessert & Sweet owns it. Bugey never
appears at all. Nielluccio is treated as a Corsican fact with a Tuscan echo, not
as Italian ground. Chateau-Chalon's vintage-refusing committee is already a
question in Producers & Icons, so this file tests the appellation's OTHER rule -
vin jaune only, everything else out the regional door - and leaves the
declassification story to the category that owns it rather than restating it and
handing that question's answer over. Trousseau's accept list deliberately
excludes Bastardo for the same reason: that synonym is the entire task of a
Fortified Wines question, and accepting it here would blur the line that
question exists to draw.

Accept lists were built against lib.match_sa and verified by execution, not by
eye. No tilde entries anywhere. ex=True marks the six questions where a real,
different thing extends or inverts the right answer: non-ouille is a genuine
label term for the opposite cellar path, Savagnin Rose, Mondeuse Blanche and
Trousseau Gris are genuine other grapes, bare Cap Corse is a place and an
aperitif rather than the wine, and the six-years-and-three-months threshold
reads the same in both directions to a containment matcher. Each ex list then
had its natural phrasings enumerated, since exact matching rejects anything not
written down.

Facts are chosen not to drift: a landslide of 1248, an AOC grant of 1968, the
rock under Ajaccio and the spelling on a Corsican label do not move. Hectare
counts, prices and minimum percentages are absent throughout.
"""

from lib import Q, SA

CAT = "Jura, Savoie & Corsica"
SLUG = "r2-jura-savoie-corsica"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("Vin jaune and the clavelin", 5),
    ("The wider Jura", 5),
    ("Savoie", 7),
    ("Corsica", 7),
]

BANK = [
    # ------------------------------------ Vin jaune and the clavelin (5) -----
    SA("Vin jaune and the clavelin",
       "Green walnut, curry spice and a saline edge: whichever village makes it, vin jaune begins as a single permitted variety. Name it.",
       "Savagnin",
       ["savagnin", "savagnin blanc", "savagnin grape", "only savagnin",
        "savagnin only", "100 savagnin", "100% savagnin"],
       "Savagnin is the whole recipe: not even Chardonnay, the Jura's most planted grape, may enter a vin jaune. A member of the Traminer family, it hangs late into the autumn and keeps the acidity that carries the wine through its long years in cask.",
       ex=True),
    SA("Vin jaune and the clavelin",
       "From harvest to the earliest legal bottling, the wine that will become vin jaune waits longer in cask than any other unfortified wine of France. State the minimum wait.",
       "Six years and three months",
       ["six years and three months", "six years three months",
        "6 years and 3 months", "6 years 3 months", "75 months",
        "seventy five months", "six and a quarter years",
        "six years and three months in cask",
        "six years and three months in barrel",
        "six years and three months in oak",
        "six years and three months from harvest",
        "at least six years and three months",
        "minimum of six years and three months",
        "six years and three months minimum",
        "minimum six years and three months",
        "six years and three months under the veil",
        "six years and three months under voile",
        "6 years and three months", "six years and 3 months",
        "6 years and 3 months minimum", "minimum 6 years and 3 months",
        "at least 6 years and 3 months", "minimum of 6 years and 3 months",
        "6 years and 3 months in cask", "6 years and 3 months in barrel",
        "6 years and 3 months in oak", "6 years and 3 months from harvest",
        "at least 75 months", "75 months minimum", "minimum 75 months",
        "75 months from harvest",
        "six years and three months of ageing",
        "six years and three months of aging",
        "six years and three months ageing",
        "six years and three months aging",
        "6 years 3 months minimum",
        "75 months in cask"],
       "Six years and three months separate the picking from the bottle, and for at least sixty of those months the voile of yeast must be at work on the untopped cask. Nothing is refilled as the level falls, and over a third of the wine is surrendered to the air before a drop is sold.",
       ex=True),
    SA("Vin jaune and the clavelin",
       "Just 62 centilitres, squat and heavy-shouldered: the law reserves one bottle for the Jura's vin jaune and permits it no other. Name it.",
       "Clavelin",
       ["clavelin", "clavelin bottle"],
       "The clavelin holds what is left of a litre, so the story runs, after the years of evaporation under the voile, the missing thirty-eight centilitres having gone to the angels. French law reserves the shape for vin jaune, so the bottle announces the style across the room."),
    Q("Vin jaune and the clavelin",
      "Chardonnay grown inside Chateau-Chalon's boundary can never be sold as Chateau-Chalon. Which appellation takes it as a still, unfortified wine instead?",
      ["Cotes du Jura", "Arbois", "L'Etoile", "Macvin du Jura"], 0,
      "Chateau-Chalon's decree admits one wine only, Savagnin aged under the voile, so there is no white, red or sparkling version to fall back on. As still wine, Chardonnay from those marls sells under the regional Cotes du Jura, the name that catches what the stricter appellations exclude; the fruit's only other legal exits are the sparkling Cremant du Jura and the mistelle Macvin du Jura."),
    SA("Vin jaune and the clavelin",
       "Pear, white flowers and not a walnut in sight: a modern Arbois Savagnin spent its cask life topped full to the bung. What word on the label announces that choice?",
       "Ouille",
       ["ouille", "ouillage", "topped up", "kept topped up",
        "topped up ouille", "ouille topped up", "ouille or topped up",
        "topped up or ouille", "ouille style"],
       "Ouille is from ouillage, the topping up of casks: the evaporated share is replaced, no voile forms, and the Savagnin stays pale, floral and tense. Sous-voile is the opposite cellar path, aged under the yeast film that brings walnut and spice, and Jura lists now sort their whites by these two words.",
       ex=True),

    # ------------------------------------------------- The wider Jura (5) ----
    SA("The wider Jura",
       "Pupillin, a hamlet above Arbois, styles itself the world capital of a red grape so thin-skinned its wines pass for dark rose. Name the grape.",
       "Poulsard",
       ["poulsard", "ploussard"],
       "Poulsard, spelled Ploussard around Pupillin itself, covers more of the Jura's red vineyard than any other variety. Big berries and thin skins give a wine the colour of faded cherry even after weeks on the skins, which is why it drinks as a red that behaves like something lighter."),
    SA("The wider Jura",
       "Warm gravels around Montigny-les-Arsures suit the Jura's most demanding red grape, darker and firmer than its famous pale neighbour. Name it.",
       "Trousseau",
       ["trousseau", "trousseau noir", "trousseau grape"],
       "Trousseau is the Jura's late ripener, and it concentrates on the warm, well-drained gravels around Montigny-les-Arsures, the village that calls itself its capital. It has been a quiet winner from the warming summers, and plantings are creeping up again.",
       ex=True),
    SA("The wider Jura",
       "Fossilised star-shaped segments of sea lilies litter the marl around one village near Lons-le-Saunier, and its white-wine appellation is named for them. Which appellation?",
       "L'Etoile",
       ["l'etoile", "etoile", "letoile"],
       "L'Etoile, the star, takes its name from the five-pointed fossil stems of sea lilies scattered through its marls, with a local embellishment that five hills ring the village in a star as well. The appellation is for white wine only, Chardonnay and Savagnin above all with a little white-pressed Poulsard permitted, in every Jura idiom from ouille to the veil-aged."),
    SA("The wider Jura",
       "Straight from the press, Jura juice meets the region's oak-aged marc before any yeast can work, and the sweet result holds an AOC of its own. Name it.",
       "Macvin du Jura",
       ["macvin du jura", "macvin"],
       "Macvin du Jura is a mistelle: the marc's strength stops fermentation before it starts, so the sweetness is grape sugar that never met a working yeast. The AOC arrived in 1991, all three colours are made, and most of it is poured cold as an aperitif in its home region."),
    Q("The wider Jura",
      "Five varieties, and only five, may enter the Jura's appellation wines. Savagnin and Chardonnay are two; which trio completes the list?",
      ["Poulsard, Trousseau and Pinot Noir",
       "Poulsard, Trousseau and Gamay",
       "Poulsard, Mondeuse Noire and Pinot Noir",
       "Trousseau, Gamay and Mondeuse Noire"], 0,
      "Pinot Noir is the fifth, grown in the Jura for centuries as a blending partner and increasingly on its own. Gamay never earned a place despite Burgundy sitting an hour away, and every appellation of the region, still or sparkling, builds from some arrangement of the five."),

    # ------------------------------------------------------------ Savoie (7) -
    SA("Savoie",
       "In November 1248 the face of Mont Granier tore away and buried a string of parishes; vines followed onto the rubble, and two Savoie crus grow on it today. Name the pair.",
       "Apremont and Abymes",
       ["apremont and abymes", "abymes and apremont", "apremont abymes",
        "abymes apremont", "apremont et abymes", "abymes et apremont",
        "apremont and les abymes", "les abymes and apremont",
        "apremont les abymes", "les abymes apremont",
        "apremont and abimes", "abimes and apremont", "apremont abimes",
        "abimes apremont", "apremont et abimes", "abimes et apremont",
        "apremont and les abimes", "les abimes and apremont",
        "apremont les abimes", "les abimes apremont"],
       "Apremont, the bitter mountain, and Abymes, the abysses, both remember the night the mountain fell. The rubble weathered into a chaos of broken limestone that drains fast and warms quickly, and the vineyards planted across it now stand at the foot of the scar."),
    SA("Savoie",
       "Alongside the fondue pot goes a carafe of Savoie's most planted white, feather-light and faintly alpine, rarely much past eleven degrees. Which grape is it?",
       "Jacquere",
       ["jacquere"],
       "Jacquere covers more Savoie ground than any other variety, cropped generously and bottled young for wines of snow-water lightness. The style is the region's house pour, and the local advice is to drink it within the year, preferably within sight of the mountains that grew it."),
    SA("Savoie",
       "Roussanne crossed into the mountains long ago, took the local alias Bergeron, and earned a Savoie cru reserved for it alone. Name the cru.",
       "Chignin-Bergeron",
       ["chignin bergeron"],
       "Chignin-Bergeron is Roussanne by itself, grown on limestone scree above Chignin and riper, more apricot-fleshed, than anything else the region bottles. Plain Chignin without the hyphen is a different and lighter wine, which makes the pair one of Savoie's small label traps."),
    SA("Savoie",
       "Arbin has staked its name on a deep-hued, white-peppered red with real tannin, the exception in a region of featherweights. Name the variety.",
       "Mondeuse",
       ["mondeuse", "mondeuse noire", "mondeuse grape"],
       "Mondeuse Noire is Savoie's structural red, dark and peppery where the rest of the region runs light, and Arbin bottles it to the exclusion of everything else. Warm recent vintages have moved the wines from rustic toward genuinely serious, and the cru anchors the case that Savoie can make reds that age.",
       ex=True),
    Q("Savoie",
      "Apremont, Chignin, Arbin, Jongieux: names like these may follow Vin de Savoie on the label. What does the appended name certify?",
      ["Fruit from a cru with its own yield and grape rules",
       "Bottling carried out in the named commune",
       "Membership of that village's cooperative cellar",
       "An extra year of ageing before the wine is sold"], 0,
      "The appellation gathers sixteen crus, each a delimited zone with tighter yields and its own permitted grapes, so the appended word does the real work on a Savoie label. What reads as one appellation is really a scatter of separate mountain vineyards, and the cru name says which one is in the bottle."),
    Q("Savoie",
      "France's alpine wine country holds one appellation whose vines face each other across the Rhone itself, one bank in Ain and the other in Haute-Savoie. Which is it?",
      ["Seyssel", "Chautagne", "Ripaille", "Marignan"], 0,
      "Seyssel is two towns of the same name facing each other across the river, and the appellation, granted in 1942, takes in both banks. The local Molette grape survives largely in its traditional sparkling wine, which the town has bottled since the nineteenth century."),
    SA("Savoie",
       "Roussette de Savoie, with or without a village after it, must now be pressed from a single variety. Name that grape.",
       "Altesse",
       ["altesse"],
       "Altesse is the grape behind every Roussette de Savoie, fuller and far more age-worthy than the region's everyday whites, and Roussette is simply its local synonym, so the label names the grape twice over. The tale of an arrival from Cyprus is legend rather than record, but it suits a grape named highness."),

    # ----------------------------------------------------------- Corsica (7) -
    SA("Corsica",
       "Tuscans would recognise Patrimonio's backbone grape at once and call it Sangiovese. What name do Corsicans use?",
       "Nielluccio",
       ["nielluccio", "niellucciu"],
       "Nielluccio, Niellucciu in the island's own spelling, is genetically Sangiovese, almost certainly carried across during the centuries when Genoa ruled Corsica. It ripens late, holds its acid, and gives the island's most structured reds along with much of its serious rose."),
    SA("Corsica",
       "Around the capital, Ajaccio, growers champion a pale, white-peppered red as the most Corsican grape of all. Name it.",
       "Sciaccarello",
       ["sciaccarello", "sciaccarellu", "sciacarello", "sciacarellu"],
       "Sciaccarello, the name usually glossed as crunchy, makes reds of modest colour with red fruit and white pepper, and some of the island's best rose. France grows it nowhere but Corsica, and Corsica grows it best on its western side, which is why Ajaccio has made it the house grape."),
    Q("Corsica",
      "Beneath its maquis, Corsica splits into two great blocks of rock, and the island's growers farm both. How does the split run?",
      ["Granite through the west and south, schist across the northeast",
       "Schist through the west and south, with granite across the northeast",
       "Limestone through the west and south, with basalt across the northeast",
       "Granite along every coastline, with schist confined to the high interior"], 0,
      "Ajaccio and Sartene farm the granite that builds the island's west and south; the Cap Corse and the country at its base work the schist folded across the northeast. The seam between the two runs roughly through Corte, and growers read the texture of their wines by which side of it they farm."),
    SA("Corsica",
       "One amphitheatre of chalky clay behind the gulf of Saint-Florent breaks the island's granite-and-schist monotony, and Corsica's first AOC, granted in 1968, sits on it. Name the appellation.",
       "Patrimonio",
       ["patrimonio", "patrimoniu"],
       "Patrimonio's pocket of chalky clay is rare rock on an island of granite and schist, and it carries the reds with the firmest grip in Corsica. The appellation led the island into the AOC system in 1968, ahead of every other name on the island."),
    SA("Corsica",
       "Along the island's long northern finger, terraces above the sea grow small-berried Muscat for Corsica's lone vin doux naturel. Name the appellation.",
       "Muscat du Cap Corse",
       ["muscat du cap corse", "cap corse muscat", "muscat du cap corse aoc",
        "aoc muscat du cap corse", "muscat du cap corse vdn",
        "the muscat du cap corse appellation",
        "muscat du cap corse vin doux naturel",
        "muscat du cap corse vin doux naturel appellation"],
       "The Cap Corse is the island's northern peninsula, and its sea-facing terraces grow Muscat Blanc a Petits Grains for a golden wine of apricot and candied citrus. It stands as Corsica's only vin doux naturel appellation, made in small volumes and mostly drunk on the island itself.",
       ex=True),
    SA("Corsica",
       "Liguria and Sardinia grow Corsica's leading white grape as well, but island labels write its name their own way. What do they call it?",
       "Vermentinu",
       ["vermentinu", "malvoisie de corse"],
       "Vermentinu is the same grape as Italy's Vermentino and Provence's Rolle, and it carries almost all of Corsica's serious white wine. Older islanders and a few labels also call it Malvoisie de Corse, a name surviving from the days when every Mediterranean white of substance was a malvoisie of somewhere."),
    SA("Corsica",
       "Most of the island's harvest never sees an AOC, travelling instead under an IGP whose name is France's compliment to Corsica. Give the IGP.",
       "Ile de Beaute",
       ["ile de beaute", "l'ile de beaute", "igp ile de beaute"],
       "Ile de Beaute, the isle of beauty, is the mainland's affectionate name for Corsica and the IGP that moves most of the island's wine, from varietal bottlings to the pink staples of the beach season. The appellations keep the prestige sites; the IGP carries the volume."),
]
