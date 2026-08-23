"""Rank I rewrite - Geography & Maps (50 questions, all multiple choice).

Written from the syllabus below. The imported bank was not read while writing.

The one idea the running order is built around is scale. It opens at the whole
globe, with the two belts and why they stop where they do, then halves that into
the two hemispheres and the calendar they keep. From there it comes down a step
at a time: the great rivers and the regions strung along them, then countries and
the regions they contain, then regions that touch one another, then the ranges
and the seas that decide what a place gets, then ordering by distance from the
equator and from the water. It ends on the map itself, because a student who
cannot read a contour or a bank is guessing at every question above it.

The fence around this category was drawn before a word was written, and it is
narrow on purpose. Twenty-two regional categories are already committed and each
one owns its own interior: the order of the Douro's sub-regions, the commune
south of Pauillac, the four Loire regions inland from the sea, the meanders of
the Mosel, the Chilean labels that read Costa and Andes. Soil & Terroir owns
soil-to-place, and Rank II "Terroir: Climate & Soil" owns every climate metric,
the lapse rate, orographic lift and continentality. What is left, and what this
category takes, is position: what lies north of what, what a river connects, what
a range stands between, which country a name belongs to, and how far a place sits
from the equator or the sea. If it can be answered off a map with no other
knowledge, it is here; if it needs the region's grapes, soils or laws, it is not.

Every stem opener is distinct, the constructions in lib.BANNED_TEMPLATES are
avoided by design, and no stem opens with the name of the thing being asked
about: the river, the range, the country or the sea arrives as the answer,
reached from a barge, a vineyard diary, a drive, a contour line.

Option length was watched from the first question rather than repaired
afterwards. Several sets are deliberately equal in length, which is the only
construction that carries no length signal at all, and the key is short as often
as it is long.

Facts are restricted to ones that do not drift. Latitudes, river courses,
coastlines, mountain chains and national borders carry the weight; there are no
volumes, no owners, no rankings and no recent boundary changes.
"""

from lib import Q

CAT = "Geography & Maps"
SLUG = "r1-geography-maps"
PREFIX = "i"
RANK = "Rank I"
SOURCE = "data-intro.js"

SYLLABUS = [
    ("The two latitude bands", 5),
    ("Hemispheres and the harvest calendar", 5),
    ("Rivers and the regions along them", 6),
    ("Which country holds which region", 6),
    ("Neighbours and shared borders", 5),
    ("Mountain ranges and what they shelter", 5),
    ("Oceans, seas and the coast", 5),
    ("North to south, and distance from the equator", 5),
    ("Distance from the sea and the inland extremes", 4),
    ("Reading the map itself", 4),
]

BANK = [
    # -------------------------------------------- the two latitude bands (5) --
    Q("The two latitude bands",
      "Plot the world's established wine regions on a globe and two belts appear, one in each hemisphere, with a broad empty gap straddling the equator. What keeps that gap empty?",
      ["Constant heat with no winter, so the vine never rests",
       "Rainfall near the equator is too low for a vine to survive without irrigation",
       "The tropics have no soils deep enough to root a vine in",
       "Days there are too short to ripen fruit"], 0,
      "A vine needs a cold dormant spell to set the following year's buds, and heat with no relief drives sugar up while the acid burns away. Where tropical vineyards do exist they sit high in the mountains, which is an exception bought at a price rather than a contradiction of the rule."),
    Q("The two latitude bands",
      "Head north through Germany or south through New Zealand and the vineyards thin out, then stop altogether. Which limit has been reached at that edge of the belt?",
      ["Not enough summer heat to ripen the fruit",
       "Ground that stays frozen right through the growing season",
       "Summer days that grow too long for the vine to flower properly",
       "Rain in quantities no vine can tolerate"], 0,
      "Both belts end where the season runs out of warmth rather than where the winter turns hard: on these maritime margins the vine comes through the winter easily enough, but it cannot finish ripening in a summer that closes too early. Every advance past the old limits has come from warmer seasons, earlier varieties or a site that gathers more sun than its neighbours."),
    Q("The two latitude bands",
      "Four vineyards report their positions as eleven degrees, thirty-four degrees, forty-one degrees and forty-eight degrees from the equator. Which of them sits outside the belts that carry nearly all the world's wine?",
      ["Eleven degrees", "Thirty-four degrees", "Forty-one degrees", "Forty-eight degrees"], 0,
      "Both belts sit in the middle latitudes, well clear of the tropics at one end and of the very short summers at the other, so the three larger figures all fall comfortably inside. Eleven degrees is deep in the tropics, where a vineyard is either a curiosity or sits so high that its altitude has bought back the cold nights its position never supplies."),
    Q("The two latitude bands",
      "Compare the two belts and the southern one carries a small fraction of the regions the northern one does. Which fact about the globe accounts for that?",
      ["Ocean covers most of that belt, leaving very little land",
       "The southern belt spans fewer degrees of latitude than the northern",
       "Sunlight is measurably weaker south of the equator",
       "Vines only crossed the equator in the twentieth century"], 0,
      "In the south the belt crosses the lower cone of South America, the southern tip of Africa, the bottom of Australia and New Zealand, and nothing else but water. That is why a handful of countries account for almost all southern hemisphere wine while Europe alone holds dozens of regions."),
    Q("The two latitude bands",
      "One line of latitude is quoted so often that growers on both sides of the Alps claim it for themselves. Through which pair of regions does the forty-fifth parallel run closest?",
      ["Bordeaux and Piedmont", "Champagne and the Mosel", "Jerez and Sicily",
       "Rioja and the Douro"], 0,
      "Bordeaux stands at about forty-five degrees north and so does the hill country of Piedmont, which is why the parallel gets invoked in both places. Champagne and the Mosel lie several degrees further north and Jerez and Sicily several degrees south, so no single line joins either of those pairs."),

    # ------------------------------- hemispheres and the harvest calendar (5) --
    Q("Hemispheres and the harvest calendar",
      "A Chilean red and a Bordeaux red both carry 2019 on the label. Which was picked first, and by roughly how much?",
      ["The Chilean, by about six months",
       "The Bordeaux, by about six months",
       "The Chilean, by two or three weeks",
       "Neither of them, since picking dates are set by ripeness rather than by the calendar"], 0,
      "Seasons invert across the equator, so a southern crop labelled with a given year came in during the first months of that year while the northern crop of the same year came in toward its end. Two bottles sharing a vintage number were therefore never grown in the same weather, which is why a good year in one hemisphere says nothing about the other."),
    Q("Hemispheres and the harvest calendar",
      "A grower in Chile and a grower in Germany each point out the sunny side of the hill as their best ground. Which way does each of those slopes face?",
      ["The Chilean block faces north, the German block south",
       "Both face south, which is the sunny aspect the world over",
       "The Chilean faces south and the German north",
       "Both face north, since the summer sun tracks poleward"], 0,
      "Outside the tropics the sun stands in the southern half of the sky as seen from north of the equator and in the northern half as seen from south of it, so the aspect that gathers the most light is mirrored. It is the first correction to make when reading a southern hemisphere vineyard description with European habits."),
    Q("Hemispheres and the harvest calendar",
      "Vines in Marlborough flower in December and the fruit is picked the following March, so one growing season falls across two calendar years. Which of the two is printed as the vintage?",
      ["The year of the harvest", "The year of flowering", "The year the wine was bottled",
       "Both years, printed as a span"], 0,
      "A vintage names the year the grapes came in, which in the southern hemisphere is the second of the two years its season occupies. Flowering dates and bottling dates never appear on a label, so the number on the bottle always points at the picking."),
    Q("Hemispheres and the harvest calendar",
      "Four wines are open by the glass: Rias Baixas, Casablanca Valley, Wachau and Willamette Valley. Which of those regions lies south of the equator?",
      ["Casablanca Valley", "Rias Baixas", "Wachau", "Willamette Valley"], 0,
      "Casablanca is Chilean, set in coastal hills on the road from the capital to the sea. Rias Baixas sits on the Atlantic coast of Spain, the Wachau follows the Danube in Austria, and the Willamette Valley runs south from Portland in Oregon, so those three are northern."),
    Q("Hemispheres and the harvest calendar",
      "Vineyard notes record budbreak in September, flowering in November and veraison in January. Where in the world is this vineyard?",
      ["South of the equator", "North of the equator, in an unusually early season",
       "Within a few degrees of the equator, where the vine never rests",
       "On the equator itself, where day length swings widest through the year"], 0,
      "Budbreak follows the local spring, so a September start puts the vineyard in Chile, Argentina, South Africa, Australia or New Zealand. Reading a vineyard diary is the quickest way to place a wine on the globe when nothing on the label says where it came from."),

    # ---------------------------------- rivers and the regions along them (6) --
    Q("Rivers and the regions along them",
      "One river forms part of the boundary between France and Germany, then swings past the vineyards of the Rheingau, then leaves the continent through the Netherlands. Name it.",
      ["The Rhine", "The Danube", "The Elbe", "The Rhone"], 0,
      "Alsace lies on the plain along its western side, and beyond the Rheingau it runs north to the Dutch delta and out into the North Sea. It carried wine long before it divided anyone, which is why so many of the towns that trade in it stand on its banks rather than inland."),
    Q("Rivers and the regions along them",
      "A barge leaving the vineyards of Lower Austria and running downstream past Hungary, Serbia and Romania would end its journey in which sea?",
      ["The Black Sea", "The Adriatic", "The Baltic", "The Caspian"], 0,
      "The Danube crosses central Europe from west to east and empties through a delta on the Romanian coast. That single line explains why so many central and eastern European wine countries share one river, and why their wine moved along it centuries before there were roads worth using."),
    Q("Rivers and the regions along them",
      "Before it ever enters France, the river that ends in the Camargue delta on the Mediterranean passes through a large Alpine lake with terraced vineyards above its northern shore. Which lake?",
      ["Lake Geneva", "Lake Constance", "Lake Garda", "Lake Neuchatel"], 0,
      "The Rhone rises in the Swiss Alps, runs the length of the Valais, crosses Lake Geneva and only then turns south toward Lyon. The terraces of Lavaux stand above that northern shore, which puts Swiss vineyards on the same water as French ones several hundred kilometres downstream."),
    Q("Rivers and the regions along them",
      "From the Cantabrian mountains to a delta on the Mediterranean below Tortosa, one river runs the whole length of Rioja. Name that river.",
      ["The Ebro", "The Duero", "The Tagus", "The Guadalquivir"], 0,
      "The Ebro is the one large Spanish river draining east to the Mediterranean, while the Duero, the Tagus and the Guadalquivir all run west to the Atlantic. It rises barely forty kilometres from the Bay of Biscay and then spends its whole length travelling in the opposite direction."),
    Q("Rivers and the regions along them",
      "Bottles of Riesling grown along a single river valley can carry a French, a Luxembourgish or a German address. Which river runs through all three countries?",
      ["The Moselle", "The Saar", "The Meuse", "The Rhine"], 0,
      "It rises in the Vosges in France, marks the boundary between Luxembourg and Germany for a long stretch, and joins the Rhine at Koblenz. Three national wine laws therefore apply to slopes above the same water, which is a useful reminder that a river valley and a wine country are not the same unit."),
    Q("Rivers and the regions along them",
      "Beaujolais lies along one river and the steep crus of the northern Rhone along another, and the two waters meet at Lyon. Which pair is it?",
      ["The Saone and the Rhone", "The Loire and the Allier", "The Doubs and the Rhone",
       "The Isere and the Saone"], 0,
      "The Saone comes down from the north through the Burgundian plain, and the Rhone arrives from the east out of Switzerland. Everything upstream of that junction belongs to one wine world and everything downstream to another, which is a cleaner boundary than any administrative line drawn nearby."),

    # ----------------------------------- which country holds which region (6) --
    Q("Which country holds which region",
      "A high plateau lying between two parallel mountain ranges, planted through a long history of conflict, produces the wines of the Bekaa Valley. Which country is that?",
      ["Lebanon", "Israel", "Turkey", "Syria"], 0,
      "The Bekaa sits between the Lebanon and Anti-Lebanon ranges at around a thousand metres, and that height supplies the cool nights the summer heat would otherwise deny it. It is one of the oldest continuously planted wine districts anywhere, and altitude there does the work that distance from the equator does elsewhere."),
    Q("Which country holds which region",
      "East of the Black Sea and south of the Caucasus watershed lies a country whose principal wine province is Kakheti. Name the country.",
      ["Georgia", "Armenia", "Bulgaria", "Moldova"], 0,
      "Georgia sits between the Greater Caucasus to the north and the Lesser Caucasus to the south, with the Black Sea along its western edge. Kakheti lies in the far east of the country, beyond Tbilisi and on the far side of the mountains from the coast."),
    Q("Which country holds which region",
      "A list offers a white from Brda and another from Vipava, both grown in a small country bounded by Italy, Austria, Hungary and Croatia. Which country?",
      ["Slovenia", "Slovakia", "Croatia", "Serbia"], 0,
      "Slovenia touches four countries and reaches the Adriatic in one corner, and Brda is the continuation of Italy's Collio hills across the frontier. Slovakia lies well to the north-east with no Italian border at all, which is the confusion the two names invite on a list."),
    Q("Which country holds which region",
      "Benches above a long narrow lake in the west, and a peninsula beside a Great Lake in the east, hold the two main vineyard areas of one country. Which is it?",
      ["Canada", "The United States", "Russia", "Argentina"], 0,
      "The Okanagan Valley in British Columbia and the Niagara Peninsula in Ontario stand nearly four thousand kilometres apart, which is a fair measure of how thinly a very large country is planted. Both depend on a body of water deep enough to hold off the worst of a continental winter."),
    Q("Which country holds which region",
      "Nemea, Naoussa and Santorini appear together on an importer's list. Which country do all three belong to?",
      ["Greece", "Turkey", "Cyprus", "Italy"], 0,
      "Nemea sits in the Peloponnese in the south, Naoussa in Macedonia in the north, and Santorini is an island out in the southern Aegean, so the three of them span most of the country. Greek appellations are usually named for the place rather than the grape, which is what makes such a list look unfamiliar at first glance."),
    Q("Which country holds which region",
      "A valley eighty kilometres south of the border with the United States, on a peninsula reaching down the Pacific coast, is the centre of one country's wine industry. Which country?",
      ["Mexico", "The United States", "Chile", "Peru"], 0,
      "The Valle de Guadalupe lies in Baja California, inland from Ensenada and close enough to the Pacific for morning fog to reach it. It sits at about thirty-two degrees north, the same distance from the equator as parts of North Africa, and that fog is most of what makes the difference."),

    # --------------------------------------- neighbours and shared borders (5) --
    Q("Neighbours and shared borders",
      "Stand in an Alsace vineyard, look east across the river, and you are looking at the vineyards of which German region?",
      ["Baden", "The Pfalz", "The Rheingau", "Franken"], 0,
      "Baden runs down the eastern side of the rift valley directly opposite Alsace, so the two share one warm sheltered trench with a river between them. The Pfalz continues northward on the German side and is Alsace's neighbour along the line rather than across the water."),
    Q("Neighbours and shared borders",
      "Drive south from Narbonne along the Mediterranean and the last French vineyards before the Spanish frontier sit in which region?",
      ["Roussillon", "Provence", "The Languedoc", "Gascony"], 0,
      "Roussillon fills the last corner of French coast before the frontier, and Catalan is still spoken on both sides of that line. The Languedoc lies immediately north of it along the same coast, and Provence further east again beyond the Rhone delta."),
    Q("Neighbours and shared borders",
      "One lake in the northern Alps has vineyards on shores belonging to three different countries. Which lake?",
      ["Lake Constance", "Lake Geneva", "Lake Balaton", "Lake Neuchatel"], 0,
      "Germany, Switzerland and Austria all reach the water the Germans call the Bodensee, and vines grow on each of their shores. The lake is deep enough to carry warmth into the autumn, which is the only reason vineyards work at that height and that far north."),
    Q("Neighbours and shared borders",
      "Two Californian counties famous for wine lie side by side, divided by a single line of hills running roughly north to south. Name that ridge.",
      ["The Mayacamas Mountains", "The Santa Lucia Highlands", "The Vaca range",
       "The Sierra Nevada"], 0,
      "The Mayacamas separate Napa from Sonoma, while the Vaca range closes Napa on its eastern side, so the valley sits in a trough with a wall on either hand. The divide matters because one side is open to ocean air and the other is not, so a few kilometres across a ridge changes the whole growing season."),
    Q("Neighbours and shared borders",
      "Cross the line east of Saint-Emilion and the same grapes grow on similar ground under a different appellation and a far lower price. Which region has been entered?",
      ["Bergerac", "Cahors", "Madiran", "Gaillac"], 0,
      "Bergerac begins where Bordeaux ends, on the same Dordogne and with much the same varieties permitted. The boundary is administrative rather than geological, which is as plain an illustration as exists that an appellation line is drawn by people and not by the ground."),

    # ------------------------------- mountain ranges and what they shelter (5) --
    Q("Mountain ranges and what they shelter",
      "Two low mountain ranges face each other across a wide flat-bottomed valley, one carrying French vineyards on its eastern foot and the other German vineyards on its western foot. Name the pair.",
      ["The Vosges and the Black Forest", "The Jura and the Alps",
       "The Ardennes and the Eifel", "The Harz and the Taunus"], 0,
      "The floor of the valley dropped between the two ranges along a fault, leaving a broad warm trench with a wall on either shoulder. It is the Vosges that strips the western weather, so Alsace lies in a rain shadow and the sheltered ground beyond the river stays warm and sunny as well, while the Black Forest closes the trench on the east and catches the rain that is left."),
    Q("Mountain ranges and what they shelter",
      "A single chain runs from the Atlantic to the Mediterranean and separates the vineyards of two countries along its whole length. Which chain?",
      ["The Pyrenees", "The Alps", "The Apennines", "The Cantabrian mountains"], 0,
      "The Pyrenees run about four hundred and fifty kilometres from the Bay of Biscay to the Mediterranean, with France on the northern side and Spain on the southern. Vines sit at both ends of the chain and hardly any in the middle, where it is at its highest and least hospitable."),
    Q("Mountain ranges and what they shelter",
      "Two countries grow wine on opposite flanks of the same chain, one facing the Pacific and one turned away from it. Which chain, and which country lies on the eastern side?",
      ["The Andes, with Argentina to the east", "The Andes, with Chile to the east",
       "The Sierra Madre, with Chile to the east",
       "The Sierra Madre, with Argentina to the east"], 0,
      "Chile occupies the narrow Pacific strip and Argentina the wide interior beyond the crest, so one range is a coastal wall for one country and an inland one for the other. Mendoza sits close under the eastern flank at altitude, while the Chilean regions lie low and within reach of the ocean."),
    Q("Mountain ranges and what they shelter",
      "France's longest river rises on the eastern edge of an upland within sight of Rhone country, then swings north and west for a thousand kilometres to the Atlantic. On which upland does it rise?",
      ["The Massif Central", "The Vosges", "The Jura", "The Ardennes"], 0,
      "The Loire starts high in the Ardeche and takes a very long arc to reach the sea. That arc is why one river passes through so many different climates on its way, and why its headwaters and its mouth have almost nothing in common."),
    Q("Mountain ranges and what they shelter",
      "Vineyards in New South Wales sit either on the coastal side of a long eastern range or on the tablelands behind it. Name that range.",
      ["The Great Dividing Range", "The Flinders Ranges", "The Mount Lofty Ranges",
       "The Grampians"], 0,
      "The range runs for thousands of kilometres down the eastern edge of the continent, and the tablelands behind it carry the state's coolest sites. The Flinders and Mount Lofty ranges belong to South Australia and the Grampians to western Victoria, so none of the three reaches New South Wales at all."),

    # ------------------------------------------- oceans, seas and the coast (5) --
    Q("Oceans, seas and the coast",
      "Four French regions sit within reach of salt water: Provence, Roussillon, the Pays Nantais and the Languedoc. Which one faces the Atlantic?",
      ["The Pays Nantais", "Provence", "Roussillon", "The Languedoc"], 0,
      "Muscadet is grown around Nantes at the western end of the Loire, so its weather is ocean weather: mild, wet and unreliable at picking. The other three line the Mediterranean, where the summer is dry and wind rather than rain is the hazard a grower plans for."),
    Q("Oceans, seas and the coast",
      "One sea has vineyards on European, Asian and African shores alike, and the climate named after it is quoted in Australia and California too. Name the sea.",
      ["The Mediterranean", "The Black Sea", "The Red Sea", "The Caspian"], 0,
      "Spain, France, Italy and Greece line its northern side, Lebanon and Turkey close its eastern end, and Morocco, Algeria and Tunisia run along the south. The name travelled with the weather pattern, which is why regions many thousands of kilometres away are described by a sea they have no contact with."),
    Q("Oceans, seas and the coast",
      "Cool-climate whites come off a coast whose latitude ought to bake them, and cold water lying offshore is the reason. On which side of a continent does that arrangement usually occur?",
      ["On the western coast, in either hemisphere",
       "On the eastern coast of any continent",
       "On the western coast in the north and the eastern coast in the south",
       "It depends on latitude alone rather than on which coast"], 0,
      "Cold currents run toward the equator up the western side of the continents in both hemispheres, and the water is colder still where wind drags deeper water to the surface. That is why the cool corners of California, Chile, southern Africa and Portugal all face west, while an eastern seaboard at the same latitude is warm and humid instead."),
    Q("Oceans, seas and the coast",
      "Four island wine regions come up in one conversation: Sicily, Corsica, Crete and Madeira. Which of them stands in the open Atlantic rather than in an enclosed sea?",
      ["Madeira", "Sicily", "Corsica", "Crete"], 0,
      "Madeira lies some seven hundred kilometres off the coast of Morocco and close to a thousand from Lisbon, so its climate is oceanic and subtropical rather than Mediterranean. The other three sit inside an enclosed sea, near enough to their mainlands for a ferry crossing of a few hours."),
    Q("Oceans, seas and the coast",
      "A sommelier describes a wine as coming from Italy's eastern seaboard. Which sea is that coast on?",
      ["The Adriatic", "The Tyrrhenian", "The Ligurian", "The Aegean"], 0,
      "The Adriatic runs up the eastern side of the peninsula toward Venice, with Croatia and Albania facing it from the far shore. The Tyrrhenian is the western sea between the mainland, Sardinia and Sicily, the Ligurian the north-western corner, and the Aegean lies away to the east with no Italian shore on it at all."),

    # ----------------------- north to south, and distance from the equator (5) --
    Q("North to south, and distance from the equator",
      "Put four French regions in order from the Channel toward the Mediterranean: Burgundy, Champagne, the Languedoc, the northern Rhone. Which order is right?",
      ["Champagne, Burgundy, the northern Rhone, the Languedoc",
       "Champagne, the northern Rhone, Burgundy, the Languedoc",
       "Burgundy, Champagne, the Languedoc, the northern Rhone",
       "The Languedoc, the northern Rhone, Champagne, Burgundy"], 0,
      "Champagne is the northernmost of the four at about forty-nine degrees, Burgundy follows at about forty-seven, the northern Rhone begins below Lyon at about forty-five, and the Languedoc sits on the Mediterranean at about forty-three. Almost every French wine map becomes easier to hold once that spine is fixed."),
    Q("North to south, and distance from the equator",
      "Rank these by distance from the equator, nearest first: Salta, Stellenbosch, Marlborough, Central Otago.",
      ["Salta, Stellenbosch, Marlborough, Central Otago",
       "Stellenbosch, Salta, Central Otago, Marlborough",
       "Central Otago, Marlborough, Stellenbosch, Salta",
       "Marlborough, Salta, Stellenbosch, Central Otago"], 0,
      "Salta sits at about twenty-five degrees south, Stellenbosch at about thirty-four, Marlborough at about forty-one and Central Otago at about forty-five. Salta works at that latitude only because its vineyards are among the highest planted anywhere, which is the standard exception to reading a climate straight off a latitude."),
    Q("North to south, and distance from the equator",
      "Four European regions appear on one page: Rioja, Bordeaux, Burgundy and the Mosel. Which of them sits furthest north?",
      ["The Mosel", "Rioja", "Bordeaux", "Burgundy"], 0,
      "Rioja lies furthest south of the four, in northern Spain, with Bordeaux and then Burgundy above it and the Mosel further north again, close to the practical limit of ripening in Europe. Ripeness falls roughly along that line and so does the risk that the fruit will not ripen at all, which is why the northernmost of them argues about sugar while the southernmost argues about alcohol."),
    Q("North to south, and distance from the equator",
      "Of Champagne, Napa Valley, Barossa Valley and Hunter Valley, which lies nearest the equator?",
      ["Hunter Valley", "Champagne", "Napa Valley", "Barossa Valley"], 0,
      "The Hunter sits at about thirty-three degrees south, the Barossa at about thirty-five, Napa at about thirty-eight north and Champagne at about forty-nine north. Nearness to the equator settles nothing on its own: the Hunter is humid and subtropical while Napa, further away from it, is drier and often hotter in the afternoon."),
    Q("North to south, and distance from the equator",
      "One grower shifts his plantings north and another shifts his south, and both say the move takes them further from the equator. Can both be right?",
      ["Yes, if one of them works north of the equator and the other south",
       "No, since moving away from the equator always means moving north",
       "No, since the two growers cannot both be reading the map correctly",
       "Yes, but only for vineyards within a few degrees of the equator"], 0,
      "Distance from the equator is measured outward in both directions, so a grower north of the line moves away from it by heading north and a grower south of the line by heading south. Both are right, and it is the habit of treating north as the cool direction that makes the southern grower's move look wrong at first."),

    # ----------------------- distance from the sea and the inland extremes (4) --
    Q("Distance from the sea and the inland extremes",
      "Of Bordeaux, Tokaj, Rias Baixas and the Douro, which vineyards lie furthest from any ocean?",
      ["Tokaj", "Bordeaux", "Rias Baixas", "The Douro"], 0,
      "Tokaj sits in the far north-east of Hungary, several hundred kilometres from the nearest sea in any direction, which is why its winters bite and its summers are hot. The other three all lie within an hour or two of the Atlantic, and each of them is moderated by it."),
    Q("Distance from the sea and the inland extremes",
      "Vines in one region are unearthed each spring and buried again each autumn, because no sea lies near enough to soften the winter. Which region works that way?",
      ["Ningxia, in northern China", "Mendoza, in western Argentina",
       "Stellenbosch, in South Africa", "Marlborough, in New Zealand"], 0,
      "Ningxia lies on the edge of the Gobi, more than a thousand kilometres from the coast, and midwinter there falls far below anything a dormant vine will survive uncovered. Burying the rows is the only defence, and the labour it takes sets that region's costs apart from anything in a maritime climate."),
    Q("Distance from the sea and the inland extremes",
      "Four wine countries appear on a list and one of them has no coastline at all. Which?",
      ["Austria", "Portugal", "Chile", "Greece"], 0,
      "Austria is landlocked, with eight neighbours and no sea of its own. Portugal faces the Atlantic along its whole western edge, Chile the Pacific for more than four thousand kilometres, and Greece has more coastline than either of them."),
    Q("Distance from the sea and the inland extremes",
      "Barely forty kilometres separate one region from a cold ocean, and it is still among the hottest in its country. What must stand between the two?",
      ["Hills high enough to block the sea air",
       "A desert, which the sea air crosses and dries out",
       "A large lake, which stores the day's heat",
       "A river, which draws warm air inland"], 0,
      "Sea air moves inland only where the ground lets it, so a coastal wall a few hundred metres high leaves everything behind it hot and dry. That is why two regions the same distance from the same ocean can differ by ten degrees on a summer afternoon, and why the distance alone means little until you know what lies in between."),

    # ------------------------------------------------ reading the map itself (4) --
    Q("Reading the map itself",
      "Two growers argue about which side of a river their village stands on. Which rule settles it?",
      ["Face downstream, and the left bank is on your left",
       "Face upstream, and the left bank is on your left",
       "The left bank is whichever side lies nearer the sea",
       "The left bank is always the western bank"], 0,
      "The convention is fixed by the direction of flow rather than by the compass, so a river that bends can put the same bank on the north side in one place and the south side in another. It is a navigator's rule rather than a cartographer's, which is why a bank keeps its name through every turn the water takes."),
    Q("Reading the map itself",
      "On a vineyard map the brown contour lines are packed tightly across one parcel and widely spaced across the next. What does that difference show?",
      ["The first parcel is much steeper",
       "The first parcel is bigger in area",
       "The first parcel stands at a higher elevation than the second",
       "The first parcel holds far more vines to the hectare"], 0,
      "Each contour joins points at one height, so the closer together they are drawn the more height is gained across a given distance. Reading them is the fastest way to find a slope on a map, and slope is most of what separates one vineyard from its neighbour on identical ground."),
    Q("Reading the map itself",
      "An atlas prints an appellation as a solid block of colour covering a whole valley, yet the drive through it passes wheat, woodland and villages. What does that colour actually show?",
      ["The outline of the delimited area",
       "Every parcel currently under vine within the area",
       "The land owned by the region's growers",
       "The extent of a single soil type"], 0,
      "A delimitation is a legal outline, and within it only ground that meets the rules may carry the appellation's name. On the map that outline is solid; on the ground the vines are a patchwork inside it, which is why a coloured map overstates how much of a region is vineyard, sometimes by a very wide margin."),
    Q("Reading the map itself",
      "A student wants to know how far a vineyard sits from the equator, and finds two sets of lines printed across the globe. Which set answers the question?",
      ["The parallels of latitude", "The meridians of longitude",
       "The lines marking the time zones", "The tropics and the polar circles"], 0,
      "Parallels run east to west and are numbered from zero at the equator to ninety at each pole, so a vineyard's latitude is its distance from the equator stated in degrees. Meridians run the other way and measure how far east or west a place lies, which settles its clock and tells you nothing about its climate."),
]
