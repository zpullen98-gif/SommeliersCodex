"""Rank II rewrite - Hungary & Greece (41 questions: 15 MC, 26 short answer).

Certified level. Two countries with the longest records in Europe and the
shortest modern ones, so the running order is built around a single idea: in
both places the old thing survived as a rule and the new thing is a rule about
the old thing. Tokaj classified its ground before anyone else and then spent
2013 rewriting what its own sweetness scale meant; Greece kept resinated wine
and vine-training older than the appellation system and then had to find a legal
box for both. So Hungary runs Tokaj first - the ground, the reformed rules, the
grapes - and then out to Eger, the south and the volcanic hills; Greece runs the
label words first and then Santorini, the Xinomavro north and the Peloponnese.

Pitched deliberately above Rank I. Rank I owns the aszu berry, the puttonyos
hod, eszencia, szamorodni as a style and Santorini's sun-dried sweet wine, and
r1_dessert_sweet was read before a line of this was written. Those things are
named here where they have to be, but no task is repeated: where Rank I asks
what a puttony was, this asks what 2013 left of the scale; where Rank I asks
which island sun-dries Assyrtiko, this asks how long the rules keep the wine in
oak afterwards. The committed Classifications & Labels category owns the
eighteenth-century Tokaj vineyard survey and the Reserve and Grande Reserve
terms, so neither is set as a task here and the survey is not alluded to at all.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and were
verified by executing a probe script rather than by eye: for every short answer
the displayed answer, two natural phrasings and a list of named wrong answers
were graded, and the wrong ones had to come back False. No '~' entries appear
anywhere, because the tilde is exact-OR-containment and a one-word tilde grades
any wrong answer holding that word. Every threshold answer carries ex=True with
its carriers enumerated - the bare number, the number with its unit, the spelled
form, the "at least" and "minimum" forms - because graded by containment a floor
and a ceiling read identically. Mavrodaphne carries ex=True as well, since
Mavrodaphne of Patras is a real and different thing that would otherwise extend
the grape name into a wine name and still grade. Layering and Topikos Oinos
joined them after probing: air layering is a real and different technique, and
"Epitrapezios Oinos, the regional wine tier" graded by containment against the
very tier it names. The accept lists in the code are the record; this note says
why, not what.

Facts are restricted to ones that do not drift: appellation rules, blending
rules, grape identity, geology and translation. No ownership, no volumes, no
rankings by size, and nothing promoted in the last few years.
"""

from lib import Q, SA

CAT = "Hungary & Greece"
SLUG = "r2-hungary-greece"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("Tokaj: the ground and its dulok", 4),
    ("Tokaj: the 2013 rules and the sweet styles", 5),
    ("The grapes of Tokaj", 3),
    ("Eger, Bikaver and the north", 4),
    ("Villany, Szekszard and the south", 3),
    ("Somlo, the Balaton and the sand country", 3),
    ("Greek appellations and the words on the label", 4),
    ("Santorini and the Aegean", 5),
    ("Xinomavro country: Naoussa, Amyndeon and Rapsani", 5),
    ("The Peloponnese and the Ionian", 5),
]

BANK = [
    # --------------------------------- Tokaj: the ground and its dulok (4) ----
    Q("Tokaj: the ground and its dulok",
      "Cellar walls in Tokaj carry a thick black felt that the growers take care never to scrub off. What is growing there?",
      ["A mould that lives on the alcohol evaporating through the casks",
       "Botrytis carried in from the vineyard on the fruit",
       "A crust of tartrate thrown out of the wine by the cold",
       "Soot laid down by centuries of candle smoke"], 0,
      "Cladosporium cellare is the cellar's own fungus and it feeds on what a wooden cask loses through its staves. Growers read a good coat of it as proof that the humidity is right, and it darkens any bottle left standing in the tunnel long enough, which is why old bottles from the region come up looking as though they were dug out of the ground."),
    Q("Tokaj: the ground and its dulok",
      "Vines at Tokaj root into ground weathered from the worn stumps of old volcanoes, and the pale rock beneath the topsoil is consolidated ash rather than cooled lava. Which rock is that?",
      ["Rhyolite tuff", "Chalk", "Slate", "Alluvial gravel"], 0,
      "Rhyolite is a pale silica-rich volcanic rock, and the ash it threw settled and hardened into a tuff soft enough to be cut by hand. That is why the region's cellars are tunnels rather than buildings, and the same rock weathers into a light soil that drains hard while the clay and loess over it hold water."),
    SA("Tokaj: the ground and its dulok",
       "Tokaji labels increasingly print the name of one delimited site instead of a village or a blend. What is the Hungarian word for such a site?",
       "Dulo",
       ["dulo", "dulok", "dulo vineyard", "dulo site", "named dulo"],
       "A dulo is a bounded and registered piece of ground, so the word does the work climat does in Burgundy and Einzellage does in Germany. Szarvas, Mezes Maly, Betsek and Szent Tamas are among the names a buyer meets, and a wine carrying one of them is picked, made and bottled apart rather than blended into a house cuvee."),
    SA("Tokaj: the ground and its dulok",
       "Sheltered from the north by a range of wooded hills that marks the edge of the Hungarian plain, the Tokaj vineyards face south and southeast off its lower slopes. Name the range.",
       "The Zemplen Mountains",
       ["zemplen mountains", "zemplen", "zemplen hills", "zemplen range",
        "zemplen mountain range"],
       "Tokaj-Hegyalja means the foothills of Tokaj, and the vineyards sit on exactly that skirt of ground where the hills run out into the flat. The barrier keeps the worst of the northern weather off and the slopes hold their warmth into autumn, which is what lets fruit shrivel on the vine rather than simply spoil."),

    # ---------------------- Tokaj: the 2013 rules and the sweet styles (5) ----
    Q("Tokaj: the 2013 rules and the sweet styles",
      "A Tokaji Aszu bottled under the rules in force since 2013 has to reach a stated residual sugar before it may carry the name. Which figure?",
      ["120 grams per litre", "30 grams per litre", "150 grams per litre",
       "90 grams per litre"], 0,
      "Sweetness is now written into the rulebook as a number rather than counted in hods tipped into a barrel. A wine short of the figure cannot be sold as Aszu at all and goes out as a late harvest or as the sweet form of szamorodni instead, so the reform tightened the name rather than merely relabelling it."),
    SA("Tokaj: the 2013 rules and the sweet styles",
       "Sweetness rungs below a certain number of hods disappeared from Tokaji Aszu labels with the 2013 reform. Give the lowest number a bottle may now carry.",
       "Five puttonyos",
       ["five puttonyos", "5 puttonyos", "five", "5", "puttonyos five",
        "at least five puttonyos", "at least 5 puttonyos",
        "a minimum of five puttonyos", "a minimum of 5 puttonyos",
        "five puttonyos minimum", "5 puttonyos minimum",
        "minimum five puttonyos", "minimum 5 puttonyos",
        "five puttonyos or more", "5 puttonyos or more",
        "five hods", "5 hods"],
       "Three and four puttonyos went, leaving only the top of the old scale in use, and the indication itself became optional, so plenty of bottles now print no number at all. Anything below the surviving level is sold under a different name rather than as a weaker Aszu, which is the change the reform was really making.",
       ex=True),
    SA("Tokaj: the 2013 rules and the sweet styles",
       "Before a Tokaji Aszu may be bottled the rules set a floor on its time in wood, and that floor was shortened when the region was reformed. How long is it?",
       "Eighteen months",
       ["eighteen months", "18 months", "eighteen months in wood",
        "18 months in wood", "eighteen months in barrel", "18 months in barrel",
        "eighteen months in oak", "18 months in oak",
        "eighteen months in cask", "18 months in cask",
        "a minimum of eighteen months", "a minimum of 18 months",
        "at least eighteen months", "at least 18 months",
        "minimum eighteen months", "minimum 18 months",
        "eighteen months minimum", "18 months minimum",
        "at least eighteen months in wood", "at least 18 months in wood",
        "at least eighteen months in oak", "at least 18 months in oak",
        "at least eighteen months in barrel", "at least 18 months in barrel",
        "at least eighteen months in cask", "at least 18 months in cask",
        "a minimum of eighteen months in wood", "a minimum of 18 months in wood",
        "a minimum of eighteen months in oak", "a minimum of 18 months in oak",
        "a minimum of eighteen months in barrel", "a minimum of 18 months in barrel",
        "a minimum of eighteen months in cask", "a minimum of 18 months in cask",
        "eighteen months in wood minimum", "18 months in wood minimum",
        "eighteen months in oak minimum", "18 months in oak minimum",
        "eighteen months in barrel minimum", "18 months in barrel minimum",
        "eighteen months in cask minimum", "18 months in cask minimum",
        "one and a half years", "a year and a half", "1.5 years",
        "a year and a half in barrel"],
       "The wine must also wait until the third year after the harvest before it is released, so the barrel floor is not the whole of the ageing. Cutting it back from the older two years in cask was pressed for by makers who wanted fresher, fruitier Aszu and resisted by those who held that the oxidative character was the point of the style.",
       ex=True),
    SA("Tokaj: the 2013 rules and the sweet styles",
       "The sweet form of szamorodni is separated from the dry one by a number rather than by a taste. What residual sugar must the sweet version reach?",
       "60 grams per litre",
       ["60 grams per litre", "60 grams per liter",
        "sixty grams per litre", "sixty grams per liter",
        "60 g/l", "60g/l", "60 g per litre", "60 g per liter",
        "60 grams", "sixty grams", "60",
        "at least 60 grams per litre", "at least 60 grams per liter",
        "at least 60 g/l",
        "a minimum of 60 grams per litre", "a minimum of 60 grams per liter",
        "minimum 60 grams per litre", "minimum 60 grams per liter",
        "60 grams per litre minimum", "60 grams per liter minimum",
        "60 grams of residual sugar per litre",
        "60 grams per litre of residual sugar",
        "60 grams residual sugar", "60 grams per litre residual sugar"],
       "Above the figure the wine is edes, the sweet one, while szaraz, the dry version, is held to a fraction of that sugar, so no szamorodni is bottled in the gap between them. The floor used to sit at the generic European figure for any wine called sweet and was lifted well clear of it, which changed the label on almost nothing, since the category is in practice bottled a good deal sweeter than either number. The same picking can give either style, so the year decides which the cellar ends up with rather than the maker.",
       ex=True),
    Q("Tokaj: the 2013 rules and the sweet styles",
      "One Tokaji category stood above Aszu in sweetness and was abolished outright by the 2013 reform. Which name went?",
      ["Aszu-Eszencia", "Szamorodni", "Forditas", "Tokaji Late Harvest"], 0,
      "It occupied the ground between the sweetest Aszu and the syrup that runs from the berries under nothing but their own weight, and the reformers took the view that it duplicated both ends of that gap. It was the only whole category the reform struck out, since Szamorodni, Forditas, Maslas and late harvest all stayed, though the Aszu sweetness scale itself was trimmed at the same time."),

    # ------------------------------------------- The grapes of Tokaj (3) ------
    Q("The grapes of Tokaj",
      "Tokaj's aromatic permitted variety is the grape Italy bottles as Moscato Bianco and Greece as Moschato Aspro. Which Hungarian name does it carry?",
      ["Sarga Muskotaly", "Koverszolo", "Budai Zold", "Kabar"], 0,
      "Sarga means yellow, which is how Hungary marks out the small-berried, finest member of the Muscat family from its coarser relatives. It is permitted in a blend and on its own account, and a varietal bottling is dry, light and scented of orange blossom, which surprises anyone expecting the region to taste only of sweet wine."),
    SA("The grapes of Tokaj",
       "Bred from Furmint and Bouvier, one permitted Tokaj variety rots early and readily, which is exactly why growers keep a little of it. Name that crossing.",
       "Zeta",
       ["zeta", "zeta grape", "zeta variety", "zeta crossing"],
       "It carried the name Oremus until it was renamed at the end of the 1990s, and it botrytises ahead of everything else on the estate, so a picking crew can start work on it while the Furmint is still sound. Its own wine is unremarkable and it earns its place by delivering shrivelled fruit early in a short autumn."),
    SA("The grapes of Tokaj",
       "Furmint gives Tokaj its acid spine but little scent, so a second variety is planted for perfume and body, and its name means linden leaf. Name it.",
       "Harslevelu",
       ["harslevelu", "harslevelu grape", "harslevelu variety"],
       "The leaf is broad and heart-shaped like a linden's, which is all the name records. It ripens later and to a higher sugar than its partner and brings honey and orange peel into a blend, and bottled on its own it makes a rounder, softer wine than the region's reputation would suggest."),

    # ----------------------------------- Eger, Bikaver and the north (4) ------
    Q("Eger, Bikaver and the north",
      "No single grape may take over an Egri Bikaver: the rules cap what any one variety may contribute to the blend. Where does that ceiling sit?",
      ["Fifty per cent", "Thirty per cent", "Seventy-five per cent",
       "Ten per cent"], 0,
      "The cap makes the wine a blend by construction rather than by custom, which is the whole point of a name that has been sold as a blend for well over a century. Above the everyday version sit stricter tiers asking for more varieties, lower yields and, at the top, fruit from one named site."),
    SA("Eger, Bikaver and the north",
       "One red variety is compulsory in every Egri Bikaver and supplies the acid and the peppery frame the blend is built on. Name it.",
       "Kekfrankos",
       ["kekfrankos", "kek frankos", "blaufrankisch", "lemberger"],
       "The same grape is Blaufrankisch across the Austrian border and Lemberger in Germany, and it is the backbone of Hungarian red wine wherever the ground is cool enough. It holds its acidity through a hot year, which is what keeps a blend fresh where Merlot and Cabernet on their own would turn soft and jammy."),
    SA("Eger, Bikaver and the north",
       "Eger answered its famous red with a white blend launched in the 2010s, and the name means star. Give that name.",
       "Egri Csillag",
       ["egri csillag", "star of eger", "egri csillag blend"],
       "The rules ask for several varieties with the majority drawn from grapes native to the Carpathian basin, so the category was designed to sell Hungarian white grapes rather than international ones. It is meant to be drunk young and aromatic, a deliberate contrast with the barrel-aged red it was built to sit beside."),
    SA("Eger, Bikaver and the north",
       "The name Bikaver is a plain compound of ordinary Hungarian words rather than a place. Translate it.",
       "Bull's blood",
       ["bull s blood", "bulls blood", "bull blood", "blood of the bull"],
       "The story attached to it puts the defenders of Eger's castle through the siege of 1552 on red wine, with the Turkish besiegers reading their stained beards as evidence that they were drinking the blood of bulls. The tale is a great deal younger than the siege and the name itself surfaces only in the nineteenth century, which has not slowed either of them down."),

    # ------------------------------ Villany, Szekszard and the south (3) ------
    Q("Villany, Szekszard and the south",
      "In Hungary's warmest corner, on a limestone ridge running east to west against the Croatian border, growers built a modern reputation on one Bordeaux variety and won a protected name for it. Which variety?",
      ["Cabernet Franc", "Cabernet Sauvignon", "Carmenere", "Merlot"], 0,
      "Villany is the region and Villanyi Franc the designation, which fixes a style as well as a grape: ripe, dark and oak-aged rather than leafy and cool. The variety reaches full ripeness there in a way it does not on the Loire, and that is the argument the growers made for giving it a name of its own."),
    SA("Villany, Szekszard and the south",
       "Thin skins, late ripening and pale colour made one old Hungarian red hard to grow and easy to lose, and it survives now mostly in the south, where it lends spice rather than weight. Name the grape.",
       "Kadarka",
       ["kadarka", "kadarka grape", "kadarka variety"],
       "It came up through the Balkans and carried Hungarian red wine before phylloxera, when it was planted in enormous quantity and too often picked before it was ready. Growers who persist with it get a perfumed, light-coloured wine with a paprika edge that no international variety supplies, and that is the whole case for the trouble it causes."),
    SA("Villany, Szekszard and the south",
       "Bikaver is not Eger's alone; one other Hungarian district may print the word on its labels. Name that district.",
       "Szekszard",
       ["szekszard", "szekszardi", "szekszard district"],
       "Its hills are deep wind-blown silt rather than the volcanic ground of the north, and they lie further south and warmer, so the wine comes out rounder and softer than the northern version of the same name. They are separate protected designations with separate rulebooks, and no third district may use the word at all."),

    # --------------------------- Somlo, the Balaton and the sand country (3) --
    Q("Somlo, the Balaton and the sand country",
      "Growers ruined by phylloxera replanted in quantity on the sandy plain between the Danube and the Tisza, and ungrafted vines still stand there. Which Hungarian region occupies that ground?",
      ["Kunsag", "Villany", "Badacsony", "Balatonfured-Csopak"], 0,
      "The louse needs a soil it can tunnel through and cannot manage sand of that kind, which is why the plain was the safe place to plant. It is flat, hot and enormous, and its trade has always been in everyday wine rather than in the bottles the hill regions are known for."),
    SA("Somlo, the Balaton and the sand country",
       "A bunch that curls like a sheep's tail gave one white variety its name, and it grows on a single isolated hill in western Hungary that is a wine district in its own right. Name the grape.",
       "Juhfark",
       ["juhfark", "juhfark grape", "juhfark variety"],
       "Somlo is the hill, the eroded plug of an old volcano standing out of flat farmland, and the wine off it is smoky, hard and so high in acid that it needs years before it gives anything up. It was long prescribed to couples wanting a son, which is the sort of story a wine of that size attracts."),
    SA("Somlo, the Balaton and the sand country",
       "Flowers on one Badacsony white cannot fertilise themselves, so a pollinating variety has to stand among the rows or the crop never sets. Name that grape.",
       "Keknyelu",
       ["keknyelu", "kek nyelu", "keknyelu grape"],
       "The name means blue stalk, and Budai Zold is the variety usually planted to do the fertilising. The arrangement makes it awkward and shy-cropping, so plantings on the basalt above Lake Balaton are small and the wine is hard to find, full-bodied and stony when it turns up."),

    # ------------------- Greek appellations and the words on the label (4) ----
    Q("Greek appellations and the words on the label",
      "A Greek bottle carries the word Cava and the guest assumes it must be sparkling. What does the word actually promise there?",
      ["That the wine was aged for a set minimum before release",
       "That the wine was made sparkling by a second fermentation in bottle",
       "That the fruit came from one delimited vineyard",
       "That the wine is sweet and fortified"], 0,
      "Greek law uses it as an ageing claim on wines outside the protected designations, with reds held longer than whites and a stated share of the time spent in barrel. It carries no method claim whatever, and it predates the confusion with the Spanish sparkling wine that now sits beside it on the same shelf."),
    Q("Greek appellations and the words on the label",
      "Pine resin rather than a place defines one protected Greek wine name, and it may be produced across much of the country. What kind of protection does that name hold?",
      ["A traditional designation rather than an origin claim",
       "A protected geographical indication covering the whole country",
       "A protected designation of origin shared by three regions",
       "A trademark held by a growers' association"], 0,
      "Retsina is defined by the addition of Aleppo pine resin to the fermenting must, so it names a practice rather than a vineyard, and versions tied to a particular area exist alongside it as geographical indications. The resin began as a preservative and a by-product of sealing amphorae, and it stayed on as a taste long after it had stopped being necessary."),
    SA("Greek appellations and the words on the label",
       "Most of the Attica vineyard is planted to one hardy white grape, and it is also the usual base for resinated wine. Name it.",
       "Savatiano",
       ["savatiano", "savvatiano", "savatiano grape"],
       "It is drought-tolerant and generous, which is how it survived a century of being asked for quantity on the hot plain outside Athens. Old bush vines of it, picked early and made without any resin at all, give a nutty, textured dry white that has changed a good many opinions of the variety."),
    SA("Greek appellations and the words on the label",
       "Below the protected designations sits the Greek regional tier, and it is where most experiments with international varieties and unorthodox blends are bottled. Give the Greek term for it.",
       "Topikos Oinos",
       ["topikos oinos", "topikos oenos", "topikos inos", "regional wine",
        "greek regional wine", "regional wine tier",
        "local wine", "greek local wine",
        "topikos oinos regional wine", "topikos oenos regional wine",
        "topikos inos regional wine", "topikos oinos regional wine tier",
        "regional wine topikos oinos", "local wine topikos oinos",
        "topikos oinos pgi", "topikos oinos greek pgi", "greek pgi",
        "topikos oinos igp",
        "topikos oinos greek regional wine", "topikos oinos local wine",
        "topikos oinos or regional wine", "topikos oinos or local wine",
        "topikos oinos regional wine pgi"],
       "It corresponds to the European protected geographical indication, and the freedom is the point: a designation works from a short list of varieties, while this tier works from a long one that admits international grapes, so a producer wanting Syrah beside Assyrtiko bottles it here. A good many of the country's most admired wines sit at this level by choice rather than by failure.",
       ex=True),

    # -------------------------------------------- Santorini and the Aegean (5)
    SA("Santorini and the Aegean",
       "Vines on Santorini are woven flat into low coiled baskets lying on the ground, with the bunches hanging on the inside of the coil. Name that training system.",
       "Kouloura",
       ["kouloura", "kouloures", "kouloura basket", "basket training"],
       "The wind is constant and salt-laden and a vine standing upright would be stripped, so the coil shelters the fruit inside it and collects what moisture the night brings. The baskets are rewoven by hand as they grow and nothing about the work can be mechanised, which is a large part of why the wine costs what it does."),
    Q("Santorini and the Aegean",
      "A Santorini white is not required to be pure Assyrtiko: the designation admits a pair of other island whites alongside it. Which pair?",
      ["Athiri and Aidani", "Malagousia and Vidiano", "Vilana and Dafni",
       "Mandilaria and Mavrotragano"], 0,
      "Assyrtiko has to supply the great bulk of the blend and the other two fill out the rest, Aidani bringing perfume and Athiri softening the attack. The red varieties of the island are bottled outside the designation altogether, so a Santorini red is a regional wine however good it is."),
    SA("Santorini and the Aegean",
       "Never grafted and often very old, a Santorini vine is renewed by burying one of its own canes to take root rather than by planting a new one. Name that technique.",
       "Layering",
       ["layering", "layering a cane", "layering the canes",
        "cane layering", "ground layering", "simple layering", "vine layering",
        "layering a shoot", "layering technique", "provignage", "marcottage",
        "layering provignage", "layering or provignage", "provignage layering",
        "layering marcottage", "layering or marcottage", "marcottage layering",
        "ground layering provignage", "ground layering marcottage",
        "propagation by layering", "layering propagation"],
       "The trunk above ground is replaced while the root system underneath it carries on, so the plant can be far older than anything visible, and phylloxera has never taken hold in the loose volcanic sand to force a grafted replant. The cane stays joined to its parent the whole time it is rooting, which is what separates the practice both from taking a cutting and from the air layering done above ground on standing wood. It is also why nobody on the island can tell you the age of a vineyard with any confidence.",
       ex=True),
    SA("Santorini and the Aegean",
       "A dry white Santorini bottled at no less than 13.5 per cent and given time in oak carries a name meaning work done through the night. Give the name.",
       "Nykteri",
       ["nykteri", "nichteri", "nychteri", "nikteri", "nykteri santorini"],
       "The picking and pressing were done in the dark so the fruit did not heat up on the way to the cellar, and the name records the labour rather than the style. The wine is fuller, riper and more textured than the island's ordinary dry white, which is the point of holding the fruit out for extra ripeness."),
    Q("Santorini and the Aegean",
      "Sun-dried Assyrtiko is pressed into a sweet wine on Santorini, and the rules will not release it until it has done a stated spell in oak. How long?",
      ["Two years", "Six months", "Five years", "Twenty years"], 0,
      "The must is so thick with sugar that fermentation runs slowly and never far, and the barrel time is what turns the wine mahogany and builds the coffee, dried fig and caramel character. Bottlings held for a decade or two beyond the minimum are a claim the producer makes on the label rather than anything the rulebook demands."),

    # ------------- Xinomavro country: Naoussa, Amyndeon and Rapsani (5) -------
    Q("Xinomavro country: Naoussa, Amyndeon and Rapsani",
      "Pale garnet in the glass, smelling of dried tomato, olive and sun-dried herb, gripping with high acid and firm tannin, and mistaken for Nebbiolo by half the room. Which Greek variety?",
      ["Xinomavro", "Mavrotragano", "Mandilaria", "Limnio"], 0,
      "The name is a compound of the words for sour and black, which describes the wine better than the colour in the glass does: it is pale from the start and browns early while carrying tannin that wants a decade. The Nebbiolo comparison is drawn so routinely that it has become the standard way of selling the grape abroad."),
    SA("Xinomavro country: Naoussa, Amyndeon and Rapsani",
       "Rapsani blends Xinomavro in equal parts with two other Thessalian reds grown on the same slopes. Name them.",
       "Krassato and Stavroto",
       ["krassato and stavroto", "stavroto and krassato", "krassato stavroto",
        "stavroto krassato", "krasato and stavroto", "krassato and stavrato"],
       "The vineyards climb the lower slopes of Mount Olympus and the blend is written into the designation rather than left to the maker. Krassato brings flesh and alcohol and Stavroto brings colour and aroma, which between them is a fair list of what the leading grape does not supply on its own."),
    SA("Xinomavro country: Naoussa, Amyndeon and Rapsani",
       "On a cool high plateau in western Macedonia the same red variety as Naoussa gives a lighter wine, and the designation there is the one permitted to make it sparkle. Name that designation.",
       "Amyndeon",
       ["amyndeon", "amynteo", "amyndeo", "amindeo", "amyntaio", "amyndaio",
        "amyntaion", "amynteon", "amyndeon pdo"],
       "The plateau sits high, much of it above six hundred metres, and is ringed by four lakes, so the fruit arrives with more acid and less tannin than it does further east, and rose, still and sparkling alike, matters there as much as red. It is the coolest red-wine ground in Greece and the wines are correspondingly pale and nervy."),
    Q("Xinomavro country: Naoussa, Amyndeon and Rapsani",
      "Naoussa admits no grape but Xinomavro, and its vineyards sit on the southeastern flank of a single mountain. Which mountain?",
      ["Mount Vermio", "Mount Parnassos", "Mount Taygetos", "Mount Athos"], 0,
      "The slope faces southeast between roughly two and four hundred metres, which is what makes ripening red fruit possible that far north. The designation is red only and unblended, and it asks for a year in oak before the wine may be sold; time in bottle beyond that is the producer's decision rather than something the designation demands."),
    SA("Xinomavro country: Naoussa, Amyndeon and Rapsani",
       "One Macedonian designation tempers Xinomavro by blending in a softer, fleshier local red grown beside it. Name the designation.",
       "Goumenissa",
       ["goumenissa", "goumenisa", "goumenissa pdo"],
       "Negoska is the blending partner and it fills out the middle of a wine that can be all edges on its own, so the style is rounder and readier to drink. The vineyards lie on the slopes of Mount Paiko north-west of Thessaloniki, on ground lower and gentler than the great Xinomavro sites."),

    # ---------------------------------- The Peloponnese and the Ionian (5) ----
    SA("The Peloponnese and the Ionian",
       "Nemea's vineyards run from a valley floor up to slopes several hundred metres higher, and a proposal to split the designation by altitude has been argued over for years. Which single red variety must all of it be?",
       "Agiorgitiko",
       ["agiorgitiko", "aghiorgitiko", "agiorghitiko", "aghiorghitiko",
        "agiorgitico", "agiorgitiko grape"],
       "The low ground ripens to a soft, dark, low-acid wine and the high ground gives something far tighter and later, and one name currently covers both, which is the whole case for zoning. The grape is named for Saint George, and its deep colour over gentle tannin makes it the most immediately likeable of the Greek reds."),
    SA("The Peloponnese and the Ionian",
       "Pink-skinned and heavily perfumed, one Peloponnese variety is pressed carefully to keep its wine white, and a cool plateau in Arcadia is its home. Name the grape.",
       "Moschofilero",
       ["moschofilero", "moscofilero", "moschofilero grape"],
       "Mantinia is the designation, sitting at around six hundred and fifty metres, and the wine is low in alcohol, sharp and floral, with rose petal and citrus peel. The skins carry enough colour that a longer maceration turns the wine pink, which is bottled at regional level rather than under the designation."),
    Q("The Peloponnese and the Ionian",
      "Robola vines on Cephalonia grow straight out of bare limestone scree, and the Venetians who ruled the island left a nickname recording it. What did they call the wine?",
      ["Wine of stone", "Wine of the friars", "Wine of the fleet",
       "Wine of the mountain"], 0,
      "Vino di sasso is the phrase, and the vineyards sit on rubble steep enough that every part of the work is done by hand. Robola gives a dry white with a lemon and crushed-stone character and a faintly waxy weight, and it is grown seriously almost nowhere else."),
    SA("The Peloponnese and the Ionian",
       "Black laurel is what the name of one grape means, and the sweet fortified red of Patras is built on it. Name the grape.",
       "Mavrodaphne",
       ["mavrodaphne", "mavrodafni", "mavrodaphni", "mavrodafne",
        "mavrodaphne grape", "mavrodafni grape", "mavrodaphni grape",
        "mavrodafne grape", "mavrodaphne variety", "mavrodafni variety",
        "mavrodaphni variety", "mavrodafne variety"],
       "The wine is fortified during fermentation and then aged oxidatively in cask, frequently by blending across vintages, so it arrives tasting of raisin, coffee and dried fig. A handful of producers make a dry red from the same grape, which is a very different and much rarer thing to meet on a list.",
       ex=True),
    SA("The Peloponnese and the Ionian",
       "A fortified rock town in the southeastern Peloponnese shipped sweet wine across medieval Europe and left its name on a family of grapes still grown from Italy to Madeira. Name the town.",
       "Monemvasia",
       ["monemvasia", "monemvassia", "monemvasia in the peloponnese"],
       "Malvasia is the name in its travelled form, and much of what the town shipped was probably gathered from the islands and merely sold through its harbour rather than grown behind it. A modern designation has revived the link, and the variety called Monemvasia on Paros is one of the family carrying the name home."),
]
