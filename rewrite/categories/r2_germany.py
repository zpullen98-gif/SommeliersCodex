"""Rank II rewrite - Germany (37 questions: 13 MC, 24 short answer).

Certified level, pitched deliberately above the Rank I "Germany" category. Where
Rank I asks what Spatlese records, this asks what the growers' association demands
of the fruit before a dry wine may claim its top site; where Rank I places the
Mosel and the Rheingau, this asks what separates one block of a vineyard from the
larger site around it. Nothing here repeats a Rank I task.

The running order is built around the one thing a German label has always been
asked to do two ways at once: state how ripe the fruit was, and state how tightly
drawn the place is. The 2021 reform put the second of those in charge, so the
questions run down the origin pyramid from the region to the parcel, then through
the collective names that made the old map unreadable, then the association's own
ladder, then the regions and the great sites themselves, and only at the end the
words that qualify what is in the glass - sweetness, sparkle and the crossings.

Written from the syllabus below. The imported bank was not read while writing; it
is read only afterwards by check-similarity.py.

Accept lists were built against lib.match_sa, a port of core.js matchSA, and were
tested by execution rather than by eye. No '~' entries appear anywhere. German is
full of names that extend or truncate each other, so every list was probed with the
real and different thing beside it: Badische Bergstrasse against Hessische
Bergstrasse, Maindreieck against Mainviereck, Scharzberg against Scharzhofberg,
Erdener Treppchen against Erdener Pralat, Grosses Gewachs against Erstes Gewachs,
and Niersteiner Domtal against the full collective name. Two entries had to become
ex=True because matchSA also matches when the INPUT sits inside an accept entry:
"Brauneberger Juffer" graded the Juffer-Sonnenuhr block, and "Auslese, which means
selection" graded the label term Selection. Both are real and different things and
neither is visible in the question text. The two threshold answers - the Einzellage
floor and the Grosse Lage yield ceiling - are ex=True for the reason the SA()
docstring gives, and each ex list was then widened until spelling, hyphen, article
and unit variants of its own answer all still grade.

Facts are restricted to ones that do not drift: statute, label mechanics, the
association's rulebook, geology and geography. No ownership, no hectare totals, no
production shares, no promotions from the last few years.

Everything is ASCII: Pradikat, Grosslage, Gewachs, Wurttemberg, Suss.
"""

from lib import Q, SA

CAT = "Germany"
SLUG = "r2-germany"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("The 2021 reform and the origin pyramid", 5),
    ("Ort, Einzellage and the words on the map", 4),
    ("Grosslage: the name that covers a county", 4),
    ("The VDP and Grosses Gewachs", 5),
    ("Placing the thirteen and their specialities", 4),
    ("Great sites of the Mosel and Rheingau", 5),
    ("Dry, sweet and the words in between", 4),
    ("Sekt, Winzersekt and Perlwein", 3),
    ("Reds, crossings and the breeding stations", 3),
]

BANK = [
    # -------------------------- The 2021 reform and the origin pyramid (5) ---
    Q("The 2021 reform and the origin pyramid",
      "Two German bottles from one estate, a village wine and a single-vineyard wine off the same hill, are ranked in that order by the law rewritten in 2021. Which principle puts them there?",
      ["The narrower the stated origin, the higher the wine ranks",
       "The riper the fruit was at picking, the higher the wine ranks",
       "The longer the wine is held back before release, the higher it ranks",
       "The smaller the holding that made it, the higher it ranks"], 0,
      "The reform borrowed the Romance idea that a place, tightly drawn, is itself the quality claim, and set the steps as Anbaugebiet, then Region, then Ort, then Einzellage. Germany's older ladder measured sugar in the juice instead, so the two systems answer different questions and both still appear on labels."),
    Q("The 2021 reform and the origin pyramid",
      "A label from the early 2000s carries a variety, a vintage and the single word Classic, and names no vineyard at all. What did that word commit the producer to?",
      ["A single traditional variety of the region, in a dry style",
       "Fruit picked by hand from one delimited site, named on the label",
       "A wine held in cask for at least two years before it may be sold",
       "A blend of at least three permitted varieties"], 0,
      "Classic arrived in 2000 to give a dry wine one plain word a shopper could read, with the alcohol a point above the region's Qualitatswein minimum, the residual sugar capped at fifteen grams a litre and the vineyard name deliberately left off. That cap sits above what trocken itself allows, which is why the style is described as harmoniously dry rather than simply dry. It was never widely taken up: an estate that wanted to say dry simply wrote trocken, which everyone already understood."),
    SA("The 2021 reform and the origin pyramid",
       "Under the reformed law the lower of the ranked classes of site has a protected term of its own for the dry wine grown there. Give that term.",
       "Erstes Gewachs",
       ["erstes gewachs", "erstes gewaechs", "the erstes gewachs term"],
       "The Rheingau had run a legal version of this idea of its own since the late 1990s, and the reform generalised it to the whole country. Each region's producers' body decides which sites qualify and what the wine must do, so the bar behind the words is set locally rather than in Berlin, and the term above it is one a growers' association had used for decades before the law adopted it."),
    SA("The 2021 reform and the origin pyramid",
       "One dry-wine term added to German law in 2000 demanded a hand harvest, a single named vineyard and fruit at Auslese ripeness, and almost nobody used it. Name that term.",
       "Selection",
       ["selection", "selection wine", "selection designation",
        "selection label term", "term selection", "selection term",
        "word selection"],
       "It asked for a yield well under the ordinary ceiling, a wine finished dry, and no release until the September after the harvest. That is a great deal of discipline in exchange for a word no drinker outside Germany recognised, and the estates capable of meeting it mostly had better-known words of their own to use.",
       ex=True),
    SA("The 2021 reform and the origin pyramid",
       "Below the single vineyard the reformed law admits a still smaller named parcel, a strip of ground a grower may now print underneath the vineyard name. What is that unit called?",
       "Gewann",
       ["gewann", "gewanne", "gewann parcel", "gewann within an einzellage"],
       "A Gewann is a traditional field name inside an Einzellage, sometimes only a few rows across, and the wine has to come wholly from within it. It is the bottom rung of the origin pyramid and the narrowest claim a German label is allowed to make."),

    # ------------------------ Ort, Einzellage and the words on the map (4) ---
    Q("Ort, Einzellage and the words on the map",
      "A Rheingau label carries a district name borrowed from one of the region's famous estates, and that district takes in every vineyard the region has. Which name is it?",
      ["Johannisberg", "Bernkastel", "Nierstein", "Schloss Bockelheim"], 0,
      "The Rheingau is a single Bereich, so Bereich Johannisberg means the whole region rather than the ground around the estate whose name it took. Bernkastel and Nierstein are districts in the Mosel and in Rheinhessen, and both of those regions are cut into several. Schloss Bockelheim was one on the Nahe until 1993, when it was folded together with Kreuznach into a single district, Nahetal, so the Nahe now has exactly one as well."),
    SA("Ort, Einzellage and the words on the map",
       "Schloss Vollrads and the Steinberg print no village name at all, though the ordinary Rheingau label must carry one. What is the legal status that allows it?",
       "Ortsteil",
       ["ortsteil", "ortsteile", "ortsteil status", "recognised as an ortsteil"],
       "An Ortsteil is a recognised part of a municipality that may stand where the village name normally stands, so the estate or walled-site name does that work instead. It is why such bottles look nothing like the usual village-plus-vineyard construction, and why a reader cannot tell from them which commune the fruit grew in. The Rheingau recognises only a handful of them, Schloss Reichartshausen among the others. Schloss Reinhartshausen at Erbach is not one of them and prints its village like everybody else, which is how close two of those names run."),
    SA("Ort, Einzellage and the words on the map",
       "Downstream of Zell the valley narrows and the vineyards have to be carried on dry-stone terraces rather than laid on open slate slopes, and growers there market under a name of their own. Give it.",
       "Terrassenmosel",
       ["terrassenmosel", "terrassen mosel", "die terrassenmosel",
        "terrassenmosel in the lower mosel"],
       "The stretch between Zell and Koblenz sits in the Bereich Burg Cochem, where the rock will not hold a continuous slope and every row stands on a wall somebody built. A wall knocked out by a hard winter has to be rebuilt by hand before anything can be pruned above it, and that cost is written into the price of every bottle the stretch sells.",
       ex=True),
    SA("Ort, Einzellage and the words on the map",
       "Faced with a site name on an older German label, a buyer cannot tell from the wording whether it belongs to one hillside or to forty villages. Which official register settles it?",
       "Weinbergsrolle",
       ["weinbergsrolle", "amtliche weinbergsrolle", "die weinbergsrolle"],
       "Each federal state keeps the roll, and it records every delimited site and every collective name with its boundaries. Nothing in the label wording does that job, which is precisely the flaw the 2021 reform set out to close."),

    # ------------------------ Grosslage: the name that covers a county (4) ---
    Q("Grosslage: the name that covers a county",
      "Zeller Schwarze Katz and Kroever Nacktarsch were shipped by the tanker for decades and read on a label exactly like a great single site. What kind of vineyard name is each of them?",
      ["A Grosslage, one name gathering the vineyards of many villages at once",
       "An Einzellage of unusually large area",
       "A Bereich, the district a region is divided into",
       "A shipper's brand with no vineyard behind it"], 0,
      "A collective name can run across thousands of hectares and a dozen parishes, and the older label form gives a reader nothing whatever to tell it apart from a single site. Both of these gather in the ground around a Mosel village that had a memorable name and not a great deal of memorable vineyard."),
    Q("Grosslage: the name that covers a county",
      "One Mosel collective name was the reverse of the usual complaint: it took in only a handful of the steepest sites around a single town, so the wine under it was reliably serious. Which name?",
      ["Bernkasteler Badstube", "Bernkasteler Kurfurstlay", "Graacher Munzlay",
       "Piesporter Michelsberg"], 0,
      "Badstube covered the steep slate immediately around Bernkastel and behaved more like a village name than a regional blend, and in 2025 the growers there had it dissolved and the name remade as a single vineyard. Kurfurstlay wraps around it and reaches far up the valley and out onto the flat, and on a shelf the two looked identical in form."),
    SA("Grosslage: the name that covers a county",
       "The most notorious collective name in Rheinhessen borrows a celebrated river village's name for a blend drawn mostly from villages well inland of it. Name that collective site.",
       "Niersteiner Gutes Domtal",
       ["niersteiner gutes domtal", "gutes domtal", "nierstein gutes domtal",
        "grosslage gutes domtal"],
       "The fruit may come from around fifteen parishes, most of them back from the river on gentle ground that grows nothing like the wine the name suggests. It became the standard cheap German white of the export trade, and it did as much harm to the reputation of the village it names as anything else in the century."),
    SA("Grosslage: the name that covers a county",
       "When thousands of German vineyard names were struck off in 1971, a surviving single site had to clear a minimum area. What was that floor?",
       "Five hectares",
       ["five hectares", "5 hectares", "5 ha", "five ha", "5ha", "5 hectare",
        "five hectare", "at least five hectares", "at least 5 hectares",
        "at least 5 ha", "minimum of five hectares", "minimum of 5 hectares",
        "minimum of 5 ha", "minimum five hectares", "minimum 5 hectares",
        "minimum 5 ha", "five hectares or more", "5 hectares or more",
        "5 hectares minimum", "5 ha minimum", "five hectare minimum",
        "five hectares minimum"],
       "The floor was meant to make the map legible, and its side effect was to erase exactly the small distinctions the old names had recorded, since anything under it was absorbed into a neighbour. A handful of celebrated sites were let through beneath it, which is why one or two of the most expensive vineyards in Germany are also among the smallest.",
       ex=True),

    # ----------------------------------- The VDP and Grosses Gewachs (5) -----
    Q("The VDP and Grosses Gewachs",
      "A VDP member's dry wines are named by where they came from, while one older vocabulary is held back for a different sort of wine altogether. What does the association reserve Kabinett, Spatlese and Auslese for?",
      ["Wines that keep a noticeable amount of residual sugar into the bottle",
       "Wines from its top classified sites only",
       "Wines offered at the autumn auctions",
       "Wines held back five years after the vintage"], 0,
      "Members label dry wine by origin - estate, then village, then the two classes of site - and keep the ripeness words for bottles where sugar survives into the glass, so the word is a promise about taste rather than about juice. German law asks for nothing of the sort, which is why a Spatlese trocken from a non-member is perfectly correct."),
    Q("The VDP and Grosses Gewachs",
      "A member estate wants to bottle Sauvignon Blanc off its best classified parcel and is told the top tier is closed to it. What rule stops the wine?",
      ["Classified sites admit only the varieties the association counts as traditional in that region",
       "The top tier is open to Riesling alone, in every region of Germany",
       "The top tier is closed to any variety bred in a laboratory",
       "The vines must have stood on that particular parcel for at least fifty years before the tier opens"], 0,
      "The permitted list changes from region to region: Riesling in the Rheingau, Silvaner in Franken, the Pinot family in Baden. A grower planting outside it keeps the vineyard's rank and loses the right to print it on that particular wine, which is the clearest way the rulebook is stricter than the law, since the law cares about ripeness and not at all about what is planted."),
    SA("The VDP and Grosses Gewachs",
       "Fruit for a VDP Grosse Lage wine must be picked by hand and cropped well below what German law would allow. What yield ceiling does the association set for that class?",
       "Fifty hectolitres per hectare",
       ["fifty hectolitres per hectare", "50 hectolitres per hectare", "50 hl/ha",
        "fifty hl/ha", "50 hl per ha", "fifty hl per ha",
        "fifty hectolitres a hectare", "50 hectolitres a hectare",
        "50 hectoliters per hectare", "fifty hectoliters per hectare",
        "50 hectoliters a hectare", "50 hectolitres", "fifty hectolitres",
        "50 hl", "fifty hl", "maximum of 50 hectolitres per hectare",
        "maximum of 50 hl/ha", "max 50 hl/ha", "50 hl/ha maximum",
        "50 hectolitres per hectare maximum", "50 hectolitres to the hectare",
        "no more than 50 hl/ha", "no more than 50 hectolitres per hectare"],
       "That is roughly half of what the law permits a Qualitatswein in most regions, and it comes bundled with the hand harvest and a stated minimum ripeness. The class below is allowed sixty, and the estate wine at the foot of the pyramid seventy-five.",
       ex=True),
    SA("The VDP and Grosses Gewachs",
       "Before a dry wine may go out as Grosses Gewachs it has to reach a stated ripeness at picking, given as one of the rungs of the older ladder. Which rung?",
       "Spatlese",
       ["spatlese", "spaetlese", "spatlese ripeness", "spaetlese ripeness",
        "spatlese must weight", "spaetlese must weight", "at least spatlese",
        "at least spaetlese", "at least spatlese ripeness", "minimum spatlese",
        "minimum of spatlese", "spatlese minimum", "spatlese or higher",
        "spatlese or above", "spatlese level", "spatlese or more"],
       "The must weight behind that rung differs by region and by grape, so the requirement is a floor that moves rather than one figure on the Oechsle scale. It matters because the wine is dry: the sugar the rung records is fermented away, and what the estate has bought with it is ripeness of flavour.",
       ex=True),
    SA("The VDP and Grosses Gewachs",
       "Leading German estates banded together in 1910 to sell wine at auction under a name that promised one thing about how it had been made. Which practice did that name rule out?",
       "Chaptalisation",
       ["chaptalisation", "chaptalization", "chaptalising", "chaptalizing",
        "adding sugar", "addition of sugar", "sugar addition", "beet sugar",
        "enrichment", "sugaring the must", "adding sugar to the must"],
       "The founding name described its members as auctioneers of Naturwein, and the word then meant a wine that had reached its alcohol from the vineyard alone rather than from the sugar sack. The eagle on the capsule descends from that association, and the autumn auctions it was founded to run are still held."),

    # --------------------- Placing the thirteen and their specialities (4) ---
    Q("Placing the thirteen and their specialities",
      "Between Bingen and Bonn the river runs through a gorge lined with castles, and the terraces above it are so steep that a great deal of the vineyard has gone out of production. Which Anbaugebiet is this?",
      ["Mittelrhein", "Ahr", "Nahe", "Sachsen"], 0,
      "The Mittelrhein runs from the edge of Rheinhessen down past the Lorelei toward the Siebengebirge, and it is Riesling on slate almost throughout. It is the clearest case in Germany of a region whose vineyard keeps shrinking while the wine from what survives keeps improving."),
    SA("Placing the thirteen and their specialities",
       "The western end of Franken sits on red sandstone rather than on the shell limestone around Wurzburg, and it grows a surprising amount of Spatburgunder. Which of the region's districts is that?",
       "Mainviereck",
       ["mainviereck", "main viereck", "bereich mainviereck", "mainviereck district"],
       "Mainviereck, the square of the Main, is the stretch around Miltenberg and Klingenberg where Buntsandstein comes to the surface. Maindreieck, the triangle, holds Wurzburg and its limestone, and Steigerwald further east sits on gypsum-bearing marl, so the region changes rock three times along one river."),
    SA("Placing the thirteen and their specialities",
       "A Wurttemberg carafe wine is neither a rose nor a blend of finished wines: red and white grapes go into the fermenter together. What is that wine called?",
       "Schillerwein",
       ["schillerwein", "schiller wein", "schillerwein rotling", "wurttemberg schillerwein"],
       "Fermenting the two colours together makes a Rotling, and Schillerwein is the Wurttemberg version of it, protected to that region and permitted only at Qualitatswein level or above. The name records the shifting colour rather than the poet, and Baden sells its own version of the idea as Badisch Rotgold."),
    SA("Placing the thirteen and their specialities",
       "Almond and apricot blossom opens early along an old road on the western flank of the Odenwald, and the vineyards strung along it make up one of the thirteen. Name that Anbaugebiet.",
       "Hessische Bergstrasse",
       ["hessische bergstrasse", "hessische bergstrasse anbaugebiet",
        "the hessische bergstrasse region"],
       "The Bergstrasse is the old route at the foot of the Odenwald between Darmstadt and Heidelberg, sheltered from the west and among the mildest ground in the country. The Hessian stretch is an Anbaugebiet in its own right; the Baden stretch of the same road is only a district inside Baden, which is the trap the name sets."),

    # ----------------------------- Great sites of the Mosel and Rheingau (5) -
    Q("Great sites of the Mosel and Rheingau",
      "Several Mosel sites carry Sonnenuhr in their names, and each has a real one built into the slope. Why were they put there?",
      ["So that workers on the hill could tell the time",
       "To mark where one owner's parcel ended and the next began",
       "To measure how much sun the site takes in over a season",
       "To display the owner's arms to the river"], 0,
      "They went up in the nineteenth century for pickers and pruners who were a long walk from any church clock, and the wall carrying the dial is usually the warmest stone on the slope. The names then stuck to the ground around them, so Wehlen and Zeltingen each have a Sonnenuhr on the label as well as on the hill."),
    SA("Great sites of the Mosel and Rheingau",
       "Erbach and Hattenheim spent much of the nineteenth century arguing over which of them could print the name of the vineyard around a boundary spring between them. Name the vineyard.",
       "Marcobrunn",
       ["marcobrunn", "erbacher marcobrunn", "markobrunn", "marcobrunner"],
       "The Markbrunnen was a well on the line between the two villages, and Erbach won: the wine goes out as Erbacher Marcobrunn. The site is a narrow strip of deep, clay-rich ground close to the river, which is why it gives the broadest and slowest-developing wine in the village."),
    SA("Great sites of the Mosel and Rheingau",
       "Above a single farmstead outside Wiltingen rises the slope most often called the finest ground on the Saar. Name the vineyard.",
       "Scharzhofberg",
       ["scharzhofberg", "scharzhofberger", "der scharzhofberg",
        "scharzhofberg in the saar", "the scharzhofberg vineyard",
        "wiltinger scharzhofberg", "wiltinger scharzhofberger",
        "scharzhofberg wiltingen", "scharzhofberg in wiltingen",
        "scharzhofberg saar"],
       "The Scharzhof stands below it and gives the site its name, and the vineyard is blue Devonian slate at an angle that makes every pass up it real work. Its wines were among the most expensive in the world before the First World War, and the reputation rests on the vintages where the Saar ripens fully, which it does not always manage.",
       ex=True),
    SA("Great sites of the Mosel and Rheingau",
       "A cliff of red slate shelters a sliver of vineyard barely above the water at Erden, and it is reckoned the warmest pocket on the Mosel. Name that site.",
       "Erdener Pralat",
       ["erdener pralat", "pralat", "erdener praelat", "praelat"],
       "The Pralat lies at the foot of a sheer crag of red slate that throws the afternoon heat back onto a sliver of scree, and some of the vines standing in it are old and ungrafted. Treppchen, the little staircase, adjoins it along the same hillside and gives a firmer, later wine off cooler ground."),
    SA("Great sites of the Mosel and Rheingau",
       "Opposite the village of Brauneberg the slope steepens around an old dial, and the block of ground about it is treated as the core of the much larger vineyard there. Name that block.",
       "Juffer-Sonnenuhr",
       ["juffer sonnenuhr", "brauneberger juffer sonnenuhr",
        "juffer sonnenuhr brauneberg", "brauneberger juffer sonnenuhr einzellage"],
       "The Juffer runs a long way along the hill, and the Juffer-Sonnenuhr is the steepest part of it, looking straight across the water at the village. A wine from the whole site and a wine from the block inside it are labelled almost identically, so the extra word carries the difference and is worth reading twice.",
       ex=True),

    # ------------------------------- Dry, sweet and the words in between (4) -
    Q("Dry, sweet and the words in between",
      "One bottle on a by-the-glass list reads halbtrocken and the next feinherb, and a guest asks which of the pair is sweeter. What can be said with confidence?",
      ["Only that halbtrocken is capped by law and feinherb is not",
       "That feinherb is the sweeter, since it is the softer-sounding word",
       "That halbtrocken is the sweeter, since it names a measured band",
       "That both sit inside the same statutory range, which the two words simply label differently"], 0,
      "Halbtrocken is capped by statute; feinherb was never defined at all, and an estate may hang it on anything from a whisper of sugar to a wine most drinkers would call sweet outright. So the honest answer is to taste them or to ask the estate, because the word describes house style rather than grams."),
    Q("Dry, sweet and the words in between",
      "In September a German bakery sells cloudy, faintly sweet, barely alcoholic bottles under a loose cap, with a warning not to lay them down. What is in them?",
      ["Must still in mid-fermentation, throwing carbon dioxide as it goes",
       "Wine drawn from the cask before filtration or fining",
       "A light sparkling wine made in a sealed tank",
       "A dry wine sweetened with juice held back from the harvest"], 0,
      "Federweisser is sold while the yeast is still working, which is why the cap has to vent and why the bottle will not travel or wait. It is drunk with onion tart within days of being filled, and the same liquid a fortnight later is simply young wine."),
    SA("Dry, sweet and the words in between",
       "Residual sugar on a German still wine climbs past forty-five grams a litre, so lieblich is no longer the term available. Which word takes over?",
       "Suss",
       ["suss", "suess", "suss sweet", "the word suss"],
       "German still wine runs trocken, halbtrocken, lieblich and suss, and the last of the four begins where lieblich stops. They are EU sweetness categories wearing German names, so an Italian dolce and a French doux start at exactly the same place.",
       ex=True),
    SA("Dry, sweet and the words in between",
       "German law lets a Qualitatswein made wholly from Riesling, and picked appreciably riper than its region's minimum, add one further word to the label. Which word?",
       "Hochgewachs",
       ["hochgewachs", "hochgewaechs", "riesling hochgewachs", "hochgewachs riesling"],
       "The wine has to beat the ordinary Qualitatswein must weight for its region by a set margin and score above a bare pass in the official tasting. It is a modest distinction dating from the 1980s that never carried abroad, and it turns up mostly on Mosel labels."),

    # ------------------------------------- Sekt, Winzersekt and Perlwein (3) -
    Q("Sekt, Winzersekt and Perlwein",
      "A bottle reads simply Sekt, with a German producer's address and no region named anywhere on it. What may the base wine be?",
      ["Wine from anywhere in the European Union",
       "Wine from any of the thirteen German regions, blended together",
       "Wine from one German region, which need not be named on the label",
       "Wine from German fruit alone, of a vintage the producer need not print"], 0,
      "Sekt on its own is a category rather than an origin, and the base is very often bought elsewhere in Europe, tankered in and made sparkling on arrival. Deutscher Sekt is the tighter claim, demanding German fruit throughout, so the word standing in front of Sekt is where all the information sits."),
    SA("Sekt, Winzersekt and Perlwein",
       "Fruit for one class of German sparkling wine must come entirely from a single one of the thirteen regions, which then has to appear on the label. Give the name of that class.",
       "Sekt bestimmter Anbaugebiete",
       ["sekt bestimmter anbaugebiete", "sekt b.a.", "sekt ba",
        "bestimmter anbaugebiete sekt"],
       "It ties a sparkling wine to one Anbaugebiet the way a still Qualitatswein is tied, and the region must be printed. It says nothing at all about method: such a wine may be tank-fermented, and a great deal of it is. Winzersekt is the tighter claim, demanding the grower's own fruit and a second fermentation in the bottle."),
    SA("Sekt, Winzersekt and Perlwein",
       "A German bottle shows a light prickle rather than a mousse, sits well under the pressure a sparkling wine has to hold, and is often closed with a crown cap. Which category is it?",
       "Perlwein",
       ["perlwein", "perlwein semi sparkling", "perlwein category", "german perlwein"],
       "Perlwein carries between one and two and a half bar against the three and a half a Sekt must reach, and much of it is made by dissolving carbon dioxide into a finished still wine rather than by a second fermentation. The lower pressure keeps it clear of the sparkling wine duty, which is a good deal of why the category persists."),

    # --------------------- Reds, crossings and the breeding stations (3) -----
    Q("Reds, crossings and the breeding stations",
      "A crossing released from a German vine-breeding institute in the 1990s was taken up by organic growers above all, because it needs a fraction of the spraying its neighbours do. Which variety?",
      ["Regent", "Dornfelder", "Portugieser", "Trollinger"], 0,
      "Regent came out of the institute at Geilweilerhof in the Pfalz, carrying American vine species well back in its pedigree, through the French-American hybrid Chambourcin, for resistance to mildew. It gives a deeply coloured, soft red, and it is the disease-resistant variety that got furthest in Germany before the newer generation of them arrived."),
    SA("Reds, crossings and the breeding stations",
       "A Wurttemberg grower pours a pale, soft red and says it is the grape a Champagne house would call Meunier. What name does the German label use?",
       "Schwarzriesling",
       ["schwarzriesling", "mullerrebe", "muellerrebe", "muller rebe",
        "schwarzriesling or mullerrebe", "schwarzriesling also called mullerrebe"],
       "The name means black Riesling and has nothing whatever to do with Riesling; the grape is a member of the Pinot family, and both its German alternative Mullerrebe and its French name record the flour-dusted look of the young leaves. Wurttemberg and Baden bottle it as a still red, which is the one place a drinker is likely to meet it under a name of its own.",
       ex=True),
    SA("Reds, crossings and the breeding stations",
       "Crossing Trollinger with Riesling at Weinsberg in 1929 produced a white grape named after a local physician who wrote drinking songs. Name the variety.",
       "Kerner",
       ["kerner", "the kerner grape", "kerner crossing"],
       "It ripens more dependably than Riesling and keeps a good deal of acidity while doing so, which is how it spread through the Pfalz and Rheinhessen and then, improbably, up into the Alto Adige. German crossings often carry a person's name, Dornfelder and Scheurebe among them, but those two honour men who worked in wine, while Justinus Kerner was a doctor and poet in the town who had nothing to do with vines beyond writing songs about drinking what came off them."),
]
