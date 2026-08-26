"""Rank II rewrite - Southern France (21 questions: 9 MC, 12 short answer).

Certified level. The Languedoc, Roussillon and Provence, pitched at the named
places and the rules that mark them out: the cru ladder the Languedoc has been
climbing since 1999, Fitou's split map, Limoux's cellar law, and Provence taken
as a set of exceptions - Bandol's Mourvedre floor and its ageing clock, Cassis
white in a pink country, Palette and Bellet each an island of its own.

The running order is built around one idea: the Midi has stopped being a bulk
vineyard and become a ladder of named ground, so the category climbs it - the
regional floor first, then the limestone and schist crus, then the coastal
oddities at Fitou and the Thau lagoon, then Limoux's cool-country departure,
then Provence's exceptions, and last the two names that bracket the story, the
varietal IGP and the Catalan coast.

The fortified south is out of bounds here: Banyuls, Maury, Rivesaltes and the
Muscats belong to the committed fortified and dessert categories, so Collioure
appears only as the dry wine of that ground and no vin doux naturel is asked.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and were
tested by execution rather than by eye: for every short answer the displayed
answer and several natural phrasings were graded True, and every nameable wrong
answer was graded False, with a scratch probe script as the record. No '~'
entries appear anywhere, since the tilde is exact-OR-containment and a one-word
tilde grades any wrong answer holding that word. ex=True is used where a real
and different thing extends or inverts an entry: the Bandol minimum, a threshold
that containment reads the same in both directions, and Mauzac, which the real
Mauzac Noir extends. Note that core.js norm() strips 'la' and 'de', so 'La
Clape' grades as 'clape' and 'Picpoul de Pinet' as 'picpoul pinet'; every list
was checked for entries that collapse together once normalised, and bare
'Corbieres' was confirmed by execution NOT to grade the Corbieres-Boutenac
answer.

Facts are restricted to ones that do not drift: decrees, promotions long
settled, geology and geography. No ownership, no volumes, no market shares.
"""

from lib import Q, SA

CAT = "Southern France"
SLUG = "r2-southern-france"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("The cru ladder and the limestone crus", 4),
    ("Schist country and the western crus", 4),
    ("Fitou, Picpoul and the lagoon coast", 3),
    ("Limoux", 3),
    ("Provence", 5),
    ("Pays d'Oc and the Catalan coast", 2),
]

BANK = [
    # ------------------------------ The cru ladder and the limestone crus (4) -
    Q("The cru ladder and the limestone crus",
      "Printed alone on a label, the one word Languedoc claims fruit from a wider territory than most buyers guess. How wide?",
      ["From the gates of Nimes all the way down to the Spanish border",
       "The Herault department alone, the historic heart of the Midi",
       "The communes of the former Coteaux du Languedoc and no more",
       "The Aude, the Herault and the Gard, but nothing south of them"], 0,
      "The name replaced Coteaux du Languedoc in 2007 and was stretched over the appellation communes of the whole of greater Languedoc-Roussillon, so a Cotes du Roussillon grower may declassify into it while nobody can move the other way. It is the floor of the regional pyramid: the named appellations stand on it, and the crus stand on them."),
    Q("The cru ladder and the limestone crus",
      "Tasted beside a red off the coastal plain, a Pic Saint-Loup shows cooler fruit and brighter acidity. What accounts for the difference?",
      ["It sits far inland under the Cevennes, higher and cooler at night",
       "Its slopes all face north, away from the midday sun",
       "Sea air off the Golfe du Lion cools the vineyard through August",
       "The decree keeps Syrah out of the blend, judging it too heavy for the site"], 0,
      "The cru sits in the first folds of the Cevennes well back from the sea, and its summer nights run cold while the coast barely cools, so acidity survives that the plain loses. Syrah in fact leads the reds, the appellation covers red and rose only, and it catches more rain than almost anywhere else in the Languedoc."),
    SA("The cru ladder and the limestone crus",
       "Cold air slides off the Larzac causse onto the vineyards under its cliffs every summer night, and that swing between day and night built the case for a red-only cru promoted in 2014. Name it.",
       "Terrasses du Larzac",
       ["terrasses du larzac", "les terrasses du larzac",
        "terrasses du larzac aoc", "the terrasses du larzac cru",
        "terrasses du larzac appellation"],
       "The causse is the high limestone plateau at the region's back, and the cold air draining off it stretches ripening out in a district that is otherwise seriously hot, which is why the wines keep a freshness the coast cannot manage. The appellation is red only, and it had gathered many of the Languedoc's most ambitious estates before it ever held a decree of its own."),
    SA("The cru ladder and the limestone crus",
       "Roman sailors knew it as an island off Narbonne; the Aude's silt has since tied its limestone bulk to the shore, and its salty whites carry its reputation among the crus. Name the massif.",
       "La Clape",
       ["la clape", "la clape aoc", "the la clape massif",
        "massif de la clape", "la clape cru"],
       "Stony garrigue between Narbonne and the sea, it is one of the driest and sunniest corners of France, and the whites must carry a substantial share of late-ripening Bourboulenc, which tastes of salt and fennel here. The reds are solid, but the whites are the reason the massif is counted among the crus."),

    # -------------------------------- Schist country and the western crus (4) -
    SA("Schist country and the western crus",
       "Beneath every row of one Languedoc cru lies the same folded schist, with no limestone anywhere inside its boundary. Name the cru.",
       "Faugeres",
       ["faugeres", "faugeres aoc", "aoc faugeres", "the faugeres cru",
        "faugeres appellation"],
       "The schist runs from one end of the appellation to the other, which no other cru of the region can claim, and the soils above it are thin, acid and fast-draining, holding the vines to small crops. Carignan, Grenache, Syrah and Mourvedre carry the reds, and the rock is the first word every grower there reaches for."),
    Q("Schist country and the western crus",
      "Since 2005 a Saint-Chinian label may carry one of two village names, both earned in the schist north of the appellation. Which pair?",
      ["Berlou and Roquebrun", "Cessenon and Cebazan",
       "Assignan and Creissan", "Vieussan and Pierrerue"], 0,
      "Both villages lie in the hill country toward the Orb where the appellation runs onto schist, and both subzones are for red wine held to stricter rules than plain Saint-Chinian. The southern half of the appellation sits on limestone and clay and earns no village name, which is the split the two names exist to mark."),
    Q("Schist country and the western crus",
      "A hilltop village of the Minervois earned in 1999 a distinction no Languedoc village had ever held. Which distinction?",
      ["It was the first village raised to a cru of its own",
       "It is the only commune of the Minervois permitted to bottle rose",
       "It alone lies in the Aude, while the rest of the Minervois is Herault",
       "Its decree was the first in France to require hand harvesting"], 0,
      "The promotion came in 1999 as Minervois-La-Liviniere, and the pattern it set, a tighter boundary, lower yields and a village name after the appellation, is the one every later cru has copied. The commune lies on the Petit Causse on the Herault side of the appellation, whose larger share is in the Aude."),
    SA("Schist country and the western crus",
       "Old bush-vine Carignan is not merely tolerated but required, at a minimum of thirty percent of the blend, in a cru created in 2005 inside the Languedoc's largest appellation. Name the cru.",
       "Corbieres-Boutenac",
       ["corbieres boutenac", "boutenac", "corbieres boutenac aoc",
        "the corbieres boutenac cru", "boutenac cru"],
       "The rule is a floor in both vineyard and vat: Carignan must hold at least thirty percent of the plantings and of the blend, Carignan with Grenache and Mourvedre must together make at least seventy percent, and no single variety may pass eighty. The low pebbled hills of the zone carry some of the Midi's oldest bush vines, which is precisely what the cru was drawn to keep in the ground."),

    # -------------------------------- Fitou, Picpoul and the lagoon coast (3) -
    Q("Fitou, Picpoul and the lagoon coast",
      "Two separate blocks of vines, kilometres apart, share the single name Fitou. What occupies the ground between the seaside zone and the high one?",
      ["A corridor of Corbieres hills, whose vines answer to that name instead",
       "The salt lagoon of Leucate",
       "The city of Narbonne and its suburbs",
       "A military zone closed to farming since the war"], 0,
      "The seaside parcels lie on clay and limestone by the lagoons at Fitou, La Palme and Leucate, while the high parcels sit under Mont Tauch around Tuchan and Paziols, and the hills between the two belong to Corbieres. One name covers two genuinely different wines, which is why serious producers say which zone a bottling came from."),
    SA("Fitou, Picpoul and the lagoon coast",
       "Decades before its neighbours were promoted, one appellation for red wine was decreed in 1948, the first in the Languedoc. Name it.",
       "Fitou",
       ["fitou", "fitou aoc", "aoc fitou", "the fitou appellation"],
       "The decree came when most of the Midi still sold anonymous bulk wine, and Carignan with Grenache remains the base of the blend. The fortified Muscats of the coast hold older decrees still, which is why the claim is worded for red wine rather than for the appellation system entire."),
    SA("Fitou, Picpoul and the lagoon coast",
       "Facing the oyster beds of the Etang de Thau grows a white-only appellation whose grape's name is said to mean it stings the lip. Name it.",
       "Picpoul de Pinet",
       ["picpoul de pinet", "piquepoul de pinet", "picpoul de pinet aoc",
        "the picpoul de pinet appellation"],
       "Piquepoul Blanc holds sharp acidity at full ripeness beside a warm lagoon, which is exactly what a wine poured with raw shellfish needs, and the appellation stood on its own from 2013 after years as a named white within the regional AOC. The producers even share a tall green bottle, a rare case of the Languedoc building one recognisable package."),

    # ----------------------------------------------------------- Limoux (3) --
    Q("Limoux",
      "High in the cool upper valley of the Aude, the still whites of Limoux obey a cellar rule almost no other French appellation writes into law. Which rule?",
      ["Fermentation of the whites must take place in oak barrels",
       "A compulsory year on gross lees in tank before any racking",
       "Malolactic conversion is forbidden in every colour and style",
       "Bottling is allowed only in the squat regional flask"], 0,
      "The whites must be fermented and raised in oak, a demand written into the decree rather than left to the house, and the cool upper valley gives fruit with the acidity to carry it. Chardonnay leads most cuvees with Chenin Blanc and the old local grape beside them, and the results taste nearer to Burgundy than to the plain below."),
    SA("Limoux",
       "White down on the underside of its leaves gave the grape of Blanquette de Limoux a local nickname, and the nickname became the wine's name. Which variety is it?",
       "Mauzac",
       # "it s mauzac" is deliberate: it is the engine_norm image of the
       # contraction "it's mauzac", which ex=True matches exactly.
       ["mauzac", "mauzac blanc", "the mauzac grape", "the grape mauzac",
        "the mauzac variety", "it is mauzac", "it s mauzac"],
       "The word is blanquette, the Occitan for that pale felting, and the sparkling wine of Limoux still rests on the variety. Its flavour runs to bruised apple and fresh-cut hay, and outside the upper Aude and a pocket at Gaillac it has nearly disappeared.",
       ex=True),
    SA("Limoux",
       "A ledger of 1531 from a Benedictine abbey in the hills above Limoux records white wine taking a sparkle of its own accord, a century before Champagne's earliest claim. Name the abbey.",
       "Saint-Hilaire",
       ["saint hilaire", "st hilaire", "abbey of saint hilaire",
        "saint hilaire abbey", "the abbey of st hilaire"],
       "The monks had bottled before the ferment was truly finished, and the wine woke with the spring warmth and sparkled. Limoux has dined out on the date ever since, and its Blanquette still includes a bottling made the old way, finishing its single fermentation in the bottle."),

    # --------------------------------------------------------- Provence (5) --
    Q("Provence",
      "No red leaves a Bandol cellar young; the decree sees to it. What must the wine do first?",
      ["Spend eighteen months in wooden casks",
       "Rest three full years in bottle",
       "Pass a second winter on its lees in tank",
       "Serve thirty months in new oak barriques"], 0,
      "The wood is usually the big old foudre rather than the new barrique, and the rule exists because Mourvedre is harsh, dark and reductive in its youth and needs slow air to open. Rose and white run under no such clock, which is why the pink is poured by Easter while the red of the same harvest is still asleep."),
    SA("Provence",
       "Whatever else goes into the vat, a Bandol red is anchored to Mourvedre by law. Give the minimum share of the blend the decree reserves for it.",
       "Fifty percent",
       ["fifty percent", "50 percent", "50%", "fifty per cent", "50 per cent",
        "half", "one half", "at least half", "at least fifty percent",
        "at least 50 percent", "at least 50%", "a minimum of fifty percent",
        "a minimum of 50 percent", "minimum 50 percent", "minimum fifty percent",
        "50 percent minimum", "fifty percent minimum", "50% minimum",
        "half the blend", "at least half the blend", "half of the blend",
        "fifty percent of the blend", "50 percent of the blend",
        "50% of the blend", "half mourvedre", "at least half mourvedre",
        "fifty percent mourvedre", "50 percent mourvedre", "50% mourvedre",
        "50", "fifty", "50 %", "at least 50 per cent", "50 per cent minimum",
        "at least fifty per cent", "fifty per cent minimum", "a minimum of half",
        "half minimum"],
       "The floor is half the blend, and serious estates run far past it toward the ceiling the decree also sets. Grenache and Cinsault fill the balance, and the requirement is why Bandol tastes like no other Provencal red: dark, peppery, slow to open and built to age for decades.",
       ex=True),
    SA("Provence",
       "Under a great rust-red sea cliff east of Marseille, one small port appellation sells most of its wine as white, from Marsanne and Clairette, while its neighbours live on pink. Name it.",
       "Cassis",
       ["cassis", "cassis aoc", "aoc cassis", "the cassis appellation"],
       "The cliff is Cap Canaille, the highest sea cliff in France, and the terraces beneath it now compete with holiday houses for every square metre. Marsanne this far south is an oddity, the appellation drinks its own crop with the port's sea urchins and bouillabaisse, and the rose economy of the rest of the coast has never tempted it."),
    SA("Provence",
       "Pine woods ring a few dozen hectares of cool north-facing limestone just outside Aix-en-Provence, and one estate has stood for nearly the whole appellation for a century. Name the appellation.",
       "Palette",
       ["palette", "palette aoc", "aoc palette", "the palette appellation"],
       "Chateau Simone long stood for nearly the whole appellation, still farms about half the delimited ground, and keeps alive dozens of old permitted varieties alongside Grenache, Mourvedre and Clairette. The limestone amphitheatre faces north under pine forest, so the wines come out fresher and stranger than the latitude promises, and they age remarkably."),
    SA("Provence",
       "Inside the city limits of Nice, vine terraces climbing toward 300 metres carry Braquet and Folle Noire, grapes hardly grown anywhere else in France. Name the appellation.",
       "Bellet",
       ["bellet", "bellet aoc", "aoc bellet", "the bellet appellation",
        "vin de bellet"],
       "The terraces hang above the Var valley at the back of the city, high enough that the wines stay light and perfumed through a Riviera summer. Braquet makes a pale, strawberry-scented rose and Folle Noire a firm, dark red, Rolle carries the whites, and nearly all of it is drunk in the restaurants of Nice itself."),

    # ----------------------------------- Pays d'Oc and the Catalan coast (2) --
    Q("Pays d'Oc and the Catalan coast",
      "Merlot and Chardonnay with the grape named on the front label built the Midi's export revival. What does IGP Pays d'Oc offer that the appellations of the hills do not?",
      ["Varietal labels, and grapes the appellation decrees shut out",
       "Freedom from any yield limit at all",
       "The right to buy finished wine from anywhere in France and blend it in",
       "An exemption from every analysis and tasting control"], 0,
      "The IGP is where varietal labelling and the international varieties live: Chardonnay has an appellation home at Limoux, while Merlot and Cabernet reach the appellation map only in the Atlantic-facing blends of Cabardes and Malepere, so a wine sold on its grape name needs the IGP either way. Nearly every other appellation works from a fixed Mediterranean variety list, and one region runs two wine economies side by side."),
    Q("Pays d'Oc and the Catalan coast",
      "Down where the Pyrenees drop into the sea, Grenache fermented dry rather than muted goes out as Collioure, once a red alone. Which colours may the label claim today?",
      ["Red, rose or white alike",
       "Red only, as at the start",
       "Red or rose, but never white",
       "Red or white, but never rose"], 0,
      "The red dates from 1971, the rose followed, and the white joined the decree in 2002, built on Grenache Blanc and Gris. The vineyard is the same terraced schist the sweet wine is drawn from, and a grower decides vat by vat whether to ferment dry or to mute, so one terrace can end the year under either name."),
]
