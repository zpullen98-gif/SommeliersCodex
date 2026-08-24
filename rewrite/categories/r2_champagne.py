"""Rank II rewrite - Champagne (35 questions: 14 MC, 21 short answer).

Certified level, pitched deliberately above the Rank I "Champagne" category.
Where Rank I names the district and its grape, this asks why a slope facing away
from the sun is ranked at the top of the scale; where Rank I names the cuvee and
the taille, this asks what a house is giving up when it sells its allowance of
the second one. Nothing here repeats a Rank I task.

The running order follows the wine forward from the ground: where the fruit
grows and how the ground was ranked, then the press house, then the blending
table and the reserve, then the bottle and the sugar in it, then the cellar
clock and the disgorging line, and last the small print that says who did all of
it - closing with the wines the region makes on the years it does not make
Champagne.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and were
tested by execution rather than eyeballed. No '~' entries appear anywhere: the
tilde is exact-OR-containment, so a one-word tilde grades any wrong answer that
happens to hold that word. Two hazards drove the ex=True decisions here. The
first is core.js norm(), which strips 'de', 'des', 'du', 'la' and 'le', so
'Rose des Riceys' and 'rose de Riceys' collapse to one string and every list was
checked for entries that normalise alike. The second is that matchSA also
matches when the INPUT sits inside an accept entry: 'Vallee de la Marne', a real
and different district, graded the Grande Vallee de la Marne until ex=True was
applied, and 'Bar-sur-Aube' graded the Aube, and 'liqueur de tirage' graded
tirage. None of that is visible in the question text. Every threshold answer -
the taille's litres, the tirage sugar, the Extra Brut band, the count of
premiers crus - carries ex=True as well, because a number graded by containment
reads the same in both directions. Each ex=True list was then widened until
figures, spelled numbers, abbreviations and article variants of its own answer
all still grade, since exact matching rejects anything not written down.

Facts are restricted to ones that do not drift: no house ownership, no volumes,
no market shares, no promotions. The rulebook, the press regime, the sugar
scale, the producer codes and the geology carry the weight instead.
"""

from lib import Q, SA

CAT = "Champagne"
SLUG = "r2-champagne"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("The five districts and what each gives", 4),
    ("The echelle des crus and the village ranking", 4),
    ("The press house and its fractions", 4),
    ("Assemblage, reserve wines and the perpetual reserve", 4),
    ("Tirage, dosage and the sugar scale", 4),
    ("Ageing minima and the prestige tier", 3),
    ("Riddling, disgorgement and the back label", 4),
    ("Reading the producer code", 3),
    ("Still wines of the Champagne vineyard", 3),
    ("The varieties beyond the famous three", 2),
]

BANK = [
    # ------------------------- The five districts and what each gives (4) ----
    Q("The five districts and what each gives",
      "Verzenay and Verzy face north, away from the sun, and both sit at the top of the village ranking for Pinot Noir. What makes that aspect workable?",
      ["The wood on the plateau shelters them and cold air drains away downhill",
       "The chalk lies bare at the surface there and throws back enough light to make up for the aspect",
       "The river runs directly below and holds enough warmth overnight to finish the ripening",
       "They are the lowest vineyards in the district, and the plain below them is the warmest ground in the region"], 0,
      "The forest crown on top of the plateau steadies temperature and humidity and takes the edge off the prevailing westerlies, and the slope falls away steeply enough that cold air drains down to the plain rather than settling on the vines. Ripening is slow and never excessive, which is exactly what a base wine wants: modest sugar with the acidity intact. The wines are correspondingly firm and slow to soften, and blenders buy them for structure rather than for charm."),
    Q("The five districts and what each gives",
      "South of the Cote des Blancs the same chalk seam reappears under a shorter run of slopes planted chiefly to Chardonnay, and the fruit off them arrives rounder and riper. Which district is this?",
      ["The Cote de Sezanne", "The Massif de Saint-Thierry", "The Vallee de la Marne",
       "The Cote des Bar"], 0,
      "The Sezannaise slopes carry the Cote des Blancs chalk on southwest beyond the Marais de Saint-Gond, but they turn more to the southeast and lie under a deeper cover of clay and silt, so the Chardonnay comes in fatter and less austere. It is the district a blender reaches for when a cuvee wants flesh rather than tension."),
    SA("The five districts and what each gives",
       "Meunier rules most of the Marne valley, but the short stretch either side of Epernay, from Cumieres and Hautvillers on the right bank east through Dizy, Ay and Mareuil-sur-Ay, is Pinot Noir country and is ranked far higher than the rest of it. What is that stretch called?",
       "Grande Vallee de la Marne",
       ["grande vallee de la marne", "grande vallee",
        "grande vallee de la marne in champagne"],
       "The valley narrows here, the slopes swing round to face south and the chalk comes close to the surface, so black grapes ripen properly instead of merely surviving. Houses buy from this stretch for the weight and the dark fruit it puts into a blend, and its villages sit at or near the top of the scale where the villages further downstream do not.",
       ex=True),
    SA("The five districts and what each gives",
       "A delimitation of 1908 drew the Champagne boundary and left one department outside it; growers rioted in 1911, and a law of 1927 brought that department back in. Name it.",
       "The Aube",
       ["aube", "the aube department", "department of the aube", "l aube",
        "the aube region"],
       "The excluded growers were a hundred kilometres south of the Marne heartland, and the disturbances of 1911 turned as much on merchants buying fruit from outside Champagne altogether as on where the line fell. The 1927 law fixed the outer limit commune by commune, and that boundary is essentially the one in force now.",
       ex=True),

    # ------------------- The echelle des crus and the village ranking (4) ----
    Q("The echelle des crus and the village ranking",
      "The percentage scale that once fixed what a grower was paid per kilogram no longer sets any price at all. What decides the price now?",
      ["Direct negotiation between the grower and the buyer, contract by contract",
       "A single figure per kilogram published each spring by the trade body and binding on every village in the appellation",
       "The village rating, converted into a fixed sum per kilogram and revised whenever a village is promoted",
       "The yield ceiling declared for the harvest, with the price rising as the permitted crop falls"], 0,
      "The scale survived the loss of its job. Grand cru and premier cru still identify villages and still go on labels, but nothing is calculated from the percentages any more, and prices vary village by village and buyer by buyer. A fashionable grower's fruit can now cost several times what the old rating would ever have allowed."),
    Q("The echelle des crus and the village ranking",
      "A cuvee is drawn from two grand cru villages and one premier cru village, with nothing else in it at all. What rank may the label claim?",
      ["Premier Cru, since every village in the blend holds at least that rank",
       "Grand Cru, because grand cru villages supply more of the blend than the premier cru village does",
       "No rank at all",
       "Grand Cru, provided the premier cru share is stated on the back label"], 0,
      "Grand Cru may be printed only when every grape came from a grand cru village; Premier Cru may be printed when every grape came from villages ranked premier cru or above. Grand cru fruit can therefore be blended down into a premier cru claim but never the other way, and a single load from an unranked village strips both words off the bottle."),
    SA("The echelle des crus and the village ranking",
       "Seventeen villages sit at the very top of Champagne's ranking. How many others are ranked immediately below it and no higher?",
       "Forty-two",
       ["forty two", "42", "forty two villages", "42 villages",
        "forty two premiers crus", "42 premiers crus",
        "forty two premier crus", "42 premier crus",
        "forty two premier cru villages", "42 premier cru villages"],
       "Forty-two premier cru villages sit between the seventeen at the top and the couple of hundred communes carrying no rank whatever. Some references print forty-four instead, counting twice over the two villages that were rated at the top for one colour of grape and a notch lower for the other. The band is broad enough either way that the wines inside it vary enormously, which is why a premier cru name on its own tells a buyer far less than a grand cru one does.",
       ex=True),
    SA("The echelle des crus and the village ranking",
       "Under the old percentage scale a couple of villages were rated at the full hundred for one colour of grape and a few points lower for the other. Name the Cote des Blancs village rated at the top for its Chardonnay alone.",
       "Chouilly",
       ["chouilly", "the village of chouilly", "chouilly in the cote des blancs",
        "chouilly grand cru", "grand cru chouilly",
        "chouilly grand cru for chardonnay"],
       "It stood at a hundred percent for white grapes and ninety-five for black, so under the scale its Chardonnay ranked at the top and its Pinot Noir did not. Tours-sur-Marne was the mirror case out in the valley, rated at the full hundred for black grapes only. Once the percentages stopped doing any work the distinction went with them: the cahier des charges now simply lists the seventeen communes entitled to grand cru, Chouilly and Tours-sur-Marne among them, without separating them by grape colour. The flat list of villages every student recites is the current legal position, and a simplification of the scale that produced it.",
       ex=True),

    # ----------------------------- The press house and its fractions (4) ----
    Q("The press house and its fractions",
      "Between one pressing and the next the cake is cut down from the sides of the press and heaped back over the middle. What is that operation called?",
      ["Retrousse", "Debourbage", "Egrappage", "Foulage"], 0,
      "The cake compacts against the walls and the juice stops finding a way out, so it is broken up and rebuilt before the pressure goes back on. Doing it well is what lets a shallow press take its full legal allowance out of a load without ever leaning on the fruit hard enough to draw colour or bitterness."),
    SA("The press house and its fractions",
       "Pressing beyond the volume the appellation allows from a load of grapes still yields juice, but that juice may never become Champagne. Name the fraction.",
       "Rebeche",
       ["rebeche", "vin de rebeche", "rebeche fraction"],
       "It goes to the distillery, and the requirement exists to stop anyone squeezing the last hard, phenolic juice out of the cake and calling it wine. The producer has to declare it, so the rebeche doubles as the arithmetic proof that the legal yield was respected.",
       ex=True),
    SA("The press house and its fractions",
       "The traditional Champagne press is wide and shallow rather than tall, built to take one load of four thousand kilograms whole, so the juice runs off a thin cake and never sits under its own weight. Name that press.",
       "Coquard",
       ["coquard", "coquard press", "pressoir coquard", "traditional coquard press",
        "vertical coquard press", "coquard vertical press"],
       "A shallow bed means low pressure and a short run for the juice, which is how black grapes are pressed without picking up colour from their skins. Modern pneumatic presses are approved and do the same job on a horizontal axis, but the shape the yield regime was written around is this one.",
       ex=True),
    SA("The press house and its fractions",
       "A Blanc de Blancs house takes only the first-running juice from every load and sells the rest of its allowance on. Of the 2,550 litres permitted, how many litres is it selling?",
       "Five hundred litres",
       ["five hundred litres", "500 litres", "500", "five hundred", "500 l",
        "five hundred litres of taille", "500 litres of taille",
        "500 liters", "five hundred liters", "500l"],
       "The taille is the last five hundred litres of the allowance and is richer in potassium, pigment and phenolics and lower in acid, so it matures quickly and can coarsen a wine meant to last. Houses buy it cheaply and put it into non-vintage blends and rose, where the colour and the early roundness are useful rather than a liability.",
       ex=True),

    # ------------- Assemblage, reserve wines and the perpetual reserve (4) ---
    Q("Assemblage, reserve wines and the perpetual reserve",
      "A generous harvest brings in more fruit than the trade has agreed to market that year. What may a grower do with the surplus, under a provision unusual in French appellation law?",
      ["Press it, make it into wine and lock it away in a personal reserve to be released in a short year",
       "Carry it forward as a credit against the following harvest's yield ceiling",
       "Sell it as base wine to a cremant producer outside the region",
       "Distil it and sell the spirit under the appellation name"], 0,
      "The reserve individuelle is blocked stock: it cannot be sold until the trade body releases it, which happens after a frost or a rot year when the crop will not fill the demand. It is why Champagne rides out disasters that would wreck a region living harvest to harvest, and it sits alongside, rather than instead of, the reserve wines a house keeps for blending."),
    Q("Assemblage, reserve wines and the perpetual reserve",
      "One house holds its reserve wines in stainless steel under inert gas; another keeps part of the stock in large old oak casks. What does the oak give the eventual blend?",
      ["A slow trickle of oxygen through the wood, which broadens the texture",
       "Vanilla and toast drawn from the staves, which is why such casks are replaced every few vintages",
       "Higher pressure at tirage, since wood-aged wine holds more dissolved gas",
       "A second malolactic conversion that a sealed steel tank cannot support"], 0,
      "The casks are old and neutral, and the point is the permeability of the wood rather than any flavour left in it. Oxygen taken up slowly builds texture and steadies the wine against later oxidation, which is why oak-raised reserves are prized for cuvees meant to age. Steel under gas does the opposite job and keeps the wine tight and primary."),
    SA("Assemblage, reserve wines and the perpetual reserve",
       "In the new year the blending table faces a hundred or more lots of still wine, dry, thin and painfully sharp, none of it sparkling yet. What are those wines called?",
       "Vins clairs",
       ["vins clairs", "vin clair", "les vins clairs"],
       "One of them on its own is a hard drink and gives very little idea of the finished wine, so blending here is done substantially from experience of how a given village and a given vessel behave over time. The tasting runs for weeks, and the decisions taken at it are the most consequential a house makes all year.",
       ex=True),
    SA("Assemblage, reserve wines and the perpetual reserve",
       "A grower keeps one vessel that is never emptied: every harvest tops it up and every blend draws from it, so a trace of all the years since it was started stays in the wine. Name that arrangement.",
       "Reserve perpetuelle",
       ["reserve perpetuelle", "perpetual reserve", "perpetual reserve system"],
       "It is a solera in everything but the name, and the older the vessel gets the less any single harvest can mark it. The trade-off is that the grower loses the ability to say what is in the blend year by year, and the stock can never be rebuilt from scratch if the vessel is emptied by accident.",
       ex=True),

    # -------------------------- Tirage, dosage and the sugar scale (4) ------
    Q("Tirage, dosage and the sugar scale",
      "Two bottles of one cuvee are analysed a year apart and their sugar readings come out a gram or so apart, yet both carry the same sweetness term. What permits that?",
      ["A tolerance of three grams per litre between the declared term and the analysed figure",
       "Sugar is consumed slowly in bottle, and the rules read the figure at the moment of dosage",
       "Dosage is measured before disgorgement, so the figure on the label is always an estimate",
       "The terms are set by each producer rather than by law"], 0,
      "European law lets the stated category sit within three grams per litre of the wine's actual sugar, which matters most at the boundaries: a wine analysed at thirteen grams can still go out as Brut. It also means the top of one category and the bottom of the next can be indistinguishable in the glass, and that the terms describe bands rather than recipes."),
    SA("Tirage, dosage and the sugar scale",
       "Bottling for the second fermentation carries sugar into the bottle, and the amount is calculated to reach the pressure the finished wine has to hold. Roughly how much sugar per litre goes in?",
       "Twenty-four grams per litre",
       ["twenty four grams per litre", "24 grams per litre", "24 g/l", "24 grams",
        "twenty four grams", "24", "about 24 grams per litre",
        "roughly 24 grams per litre", "around 24 grams per litre",
        "approximately 24 grams per litre", "24 grams of sugar per litre",
        "about 24 g/l", "24 g per litre", "24g/l", "24 grams per liter",
        "twenty four grams per liter", "roughly twenty four grams per litre",
        "about 24", "roughly 24", "roughly 24 g/l", "around 24 g/l",
        "approximately 24 g/l", "about 24 grams", "roughly 24 grams",
        "around 24 grams", "24g per litre", "24 grams litre",
        "24 grams sugar per litre", "24 g/l of sugar", "around 24",
        "approximately 24"],
       "Around four grams per litre generates one further atmosphere, so twenty-four takes a bottle to roughly six. The same fermentation lifts the alcohol by a little over one percent and leaves the spent yeast behind as the deposit the wine will then spend years on.",
       ex=True),
    SA("Tirage, dosage and the sugar scale",
       "A label reads Extra Brut. Give the band of residual sugar, in grams per litre, that the term permits.",
       "Zero to six grams per litre",
       ["zero to six grams per litre", "0 to 6 grams per litre",
        "up to six grams per litre", "up to 6 grams per litre",
        "no more than six grams per litre", "no more than 6 grams per litre",
        "six grams per litre or less", "6 grams per litre or less",
        "0 to 6 g/l", "zero to six g/l", "0-6 g/l", "0-6 grams per litre",
        "0-6", "0 to 6", "zero to six", "up to 6 g/l", "6 g/l or less",
        "less than six grams per litre", "less than 6 grams per litre",
        "under six grams per litre", "under 6 grams per litre",
        "0 to 6 grams per liter", "zero to six grams per liter",
        "0-6 grams per liter", "between 0 and 6 grams per litre",
        "between zero and six grams per litre", "between 0 and 6 g/l",
        "0 to 6 grams", "zero to six grams"],
       "Extra Brut sits between Brut Nature and Brut, and a wine at the top of the band is only marginally drier than a lightly dosed Brut. The category has grown because a well-ripened base wine no longer needs much sugar to be palatable, which was not true at all when the scale was written.",
       ex=True),
    SA("Tirage, dosage and the sugar scale",
       "Cane sugar dissolved in wine is the old way of sweetening a dosage. Name the colourless concentrated grape syrup that many houses now use in its place.",
       "Rectified concentrated grape must",
       ["rectified concentrated grape must", "rectified concentrated must",
        "concentrated rectified grape must", "mcr",
        "rectified concentrated grape must mcr",
        "mout de raisin concentre rectifie",
        "rcgm", "rectified concentrated grape must rcgm",
        "rectified grape must concentrate"],
       "Rectifying strips the must of colour, acid and aromatics and leaves essentially neutral grape sugar, so the addition sweetens without bringing anything else with it. A house that wants the dosage to bring something else goes the other way and uses an old reserve wine, sometimes held in cask for years expressly for the purpose.",
       ex=True),

    # ------------------------- Ageing minima and the prestige tier (3) ------
    Q("Ageing minima and the prestige tier",
      "A wine list describes three bottles as prestige cuvees. What does the appellation guarantee about them?",
      ["Nothing, since the term has no legal standing",
       "A minimum of six years on the lees and fruit drawn only from grand cru villages",
       "Fruit from villages rated at the full hundred on the old percentage scale",
       "A declared vintage and riddling done entirely by hand"], 0,
      "Tete de cuvee and prestige cuvee are trade language for a house's flagship, and each house writes its own rules for what qualifies. In practice such wines are usually vintage-dated, long-aged and drawn from the best crus, but none of that is required and the words on their own promise a buyer nothing."),
    Q("Ageing minima and the prestige tier",
      "Even in an outstanding year a house may not turn its whole crop into vintage wine. How much of the harvest has to be held back?",
      ["At least twenty percent, which goes into reserve for non-vintage blending",
       "Whatever the trade body fixes for that year, since the figure moves with the size of the crop",
       "None, provided the house declares its intention before the harvest is pressed",
       "At least half, so that the non-vintage blend is never short of base wine"], 0,
      "Vintage declaration is capped at eighty percent of a year's crop, so a fifth of even the finest harvest is set aside. The reasoning is commercial: non-vintage is the region's living, and a run of fine years in which every house declared everything would leave the blends starved of good reserve wine exactly when the next poor year arrived."),
    SA("Ageing minima and the prestige tier",
       "Champagne's ageing minima are counted in months, and the count begins neither at harvest nor at the end of the first fermentation. From what event does it run?",
       "Tirage",
       ["tirage", "from tirage", "date of tirage", "at tirage",
        "from the date of tirage",
        "bottling for the second fermentation", "the second fermentation bottling",
        "when the wine is bottled for its second fermentation"],
       "Fifteen months for a non-vintage and thirty-six for a vintage are both measured from the day the wine went into bottle with its sugar and yeast. That is also why a lot bottled late can hold up a release: the clock starts when the crown cap goes on, not when the fruit came in or when the blend was signed off.",
       ex=True),

    # ------------------- Riddling, disgorgement and the back label (4) ------
    Q("Riddling, disgorgement and the back label",
      "Side by side stand two bottles of one cuvee, one disgorged eight years ago and one last month. How will they differ?",
      ["The older disgorgement will taste more evolved and nutty, the recent one tighter and more citric",
       "The recent disgorgement will be the more evolved, having spent longer in the producer's cellar",
       "The older disgorgement will be the sweeter, because dosage sugar builds up with time in bottle",
       "They will taste alike, since ageing stops at disgorgement"], 0,
      "Autolysis is protective and slow; once the lees are gone and oxygen begins to reach the wine past the cork, development speeds up sharply. The bottle disgorged last month spent those eight years under a crown cap on its own deposit, so it arrives at the table younger in character than its neighbour despite being identical on paper. That is the whole reason for printing the date."),
    SA("Riddling, disgorgement and the back label",
       "Under the crown cap sits a small plastic cup that gathers the deposit and comes away with the frozen plug at disgorgement. Name it.",
       "Bidule",
       ["bidule", "bidule cup", "plastic bidule", "the plastic bidule cup",
        "bidule plastic cup"],
       "The word is French for thingamajig, which is about the ceremony it commands, but it does a job the older closures did badly. The sediment settles inside the cup and leaves with it; without one it freezes against the glass and the neck has to be cleaned by hand before the wine can be dosed.",
       ex=True),
    SA("Riddling, disgorgement and the back label",
       "A producer may buy bottles from another that have finished their second fermentation and are still lying on their lees, then disgorge, dose and label them as its own. Give the term for wine traded in that state.",
       "Sur lattes",
       ["sur lattes", "sur latte", "sold sur lattes", "wine sold sur lattes",
        "bottles sold sur lattes"],
       "The name comes from the wooden laths the bottles rest on while they age. Nothing on the finished label reveals it, which is why the trade dislikes the practice and why the negociant houses agreed among themselves to stop trading sur lattes with one another from 2004, leaving purchases from growers and cooperatives as what survives of it. It is still the usual explanation offered when a brand appears from nowhere in quantity.",
       ex=True),
    SA("Riddling, disgorgement and the back label",
       "A few houses still run the second fermentation under a natural cork rather than a crown cap, and that cork has to be clamped down against the pressure building beneath it. Name the metal clip that holds it.",
       "Agrafe",
       ["agrafe", "agraffe", "the agrafe clip", "agraffe clip",
        "agrafe staple", "agraffe staple"],
       "The clip is a sprung steel stirrup hooked under the lip of the bottle, and it was universal before the crown cap arrived and made the work quick. Running the second fermentation under cork is now a deliberate choice for a handful of prestige bottlings, argued for on the grounds that the wine takes in a trace of oxygen through the cork across its years on the lees.",
       ex=True),

    # ------------------------------------ Reading the producer code (3) -----
    Q("Reading the producer code",
      "A merchant registered in Champagne buys wine already in bottle, never handling grape or must at any point, and labels it in its own name on its own premises. Which code appears in the small print?",
      ["ND, negociant distributeur", "CM, cooperative de manipulation",
       "NM, negociant manipulant", "MA, marque d'acheteur"], 0,
      "A negociant distributeur is a merchant registered in the region that contributes nothing but the finishing and the label, put on its own premises onto bottles someone else made. The buyer's own brand code is the neighbouring case and a genuinely different one: there the name on the front belongs to an outside purchaser, typically a retailer or a restaurant, while the wine itself was made and labelled by a producer carrying a code of their own."),
    SA("Reading the producer code",
       "A grower sends the whole crop to a cooperative, and the cooperative hands it back as finished bottles which the grower sells under their own name and village. Which code must appear?",
       "RC",
       ["rc", "recoltant cooperateur", "rc recoltant cooperateur",
        "recoltant cooperateur rc"],
       "Recoltant cooperateur. The label reads like a grower's wine and in one sense it is, since the fruit was theirs, but the wine was made in a communal cellar from a communal pool, and a neighbour's bottle may hold exactly the same liquid under a different name and a different village.",
       ex=True),
    SA("Reading the producer code",
       "Several members of one family pool their vineyards into a company that presses, makes and sells the wine without joining any cooperative. Which code covers that arrangement?",
       "SR",
       ["sr", "societe de recoltants", "sr societe de recoltants",
        "societe de recoltants sr"],
       "Societe de recoltants. It exists because the grower codes assume an individual, and a family firm sharing presses and cellars across several separate holdings fits none of them. The wine is grower Champagne in substance, and this code is the only thing on the bottle that says so.",
       ex=True),

    # ------------------------ Still wines of the Champagne vineyard (3) -----
    Q("Still wines of the Champagne vineyard",
      "Still wine from the Champagne vineyard once went out under a name built on the word nature, dropped in 1974 as misleading. What replaced it?",
      ["Coteaux Champenois", "Cremant de Champagne", "Vin de la Marne", "Bouzy Rouge"], 0,
      "The old name was Vin Nature de la Champagne, and nature had come to mean something quite different in wine talk. Coteaux Champenois covers still red, white and rose from the same delimited vineyard and the same varieties as the sparkling wine, and the reds are what anyone actually hunts for."),
    SA("Still wines of the Champagne vineyard",
       "In one southern commune a still rose is made by bleeding Pinot Noir off its skins after a short maceration, declared only in years the grower judges good enough, and it holds an appellation of its own. Name that appellation.",
       "Rose des Riceys",
       ["rose des riceys", "rose des riceys aoc",
        "the rose des riceys appellation", "still rose des riceys",
        "rose des riceys aop",
        "rose des riceys appellation d origine protegee"],
       "The maceration is watched by eye and stopped the moment the winemaker judges the character has arrived, which is why the wine is not made every year and why quantities are tiny. It is one of the rare French appellations covering a rose alone, and the same vines can make sparkling wine or a still wine instead in a year that does not suit it.",
       ex=True),
    SA("Still wines of the Champagne vineyard",
       "Before the region turned to sparkling wine its reputation rested on still wine, and one Montagne de Reims village supplied what seventeenth-century London bought under the village's own name. Name the village.",
       "Sillery",
       ["sillery", "the village of sillery", "sillery in the montagne de reims",
        "sillery grand cru", "grand cru sillery"],
       "It was a byword in London for the still wine of the region long before anyone there had seen a sparkling one, and the family that held the estate promoted it hard at court. The village is still ranked at the top of the scale, but what it sells now is fruit for other people's blends rather than a wine under its own name.",
       ex=True),

    # ------------------------ The varieties beyond the famous three (2) -----
    Q("The varieties beyond the famous three",
      "A Champagne grower's planting declaration lists a grey-berried mutation of Pinot Noir under a local synonym rather than under the name the rest of France uses. Which name?",
      ["Fromenteau", "Beaunois", "Auvernat", "Morillon"], 0,
      "Fromenteau is what Champagne calls Pinot Gris, one of the seven principal varieties the appellation permits. Beaunois is what Chablis calls Chardonnay and Morillon is what Styria calls the same grape, so all of these are regional synonyms; only one of them belongs to this region."),
    SA("The varieties beyond the famous three",
       "A grower bottling all seven permitted varieties together needs a late-ripening white grape, once widespread in the south of the region and now down to a few hectares, with piercing acidity and a floral, almost herbal scent. Name it.",
       "Arbane",
       ["arbane", "arbanne", "the arbane grape", "l arbane"],
       "It ripens so late and crops so unreliably that it was very nearly abandoned, and the handful of growers who keep it do so partly as a museum piece and partly because it puts a nervy top note into a cuvee that nothing else supplies. Petit Meslier, Pinot Blanc and Pinot Gris are the other survivors alongside the famous three.",
       ex=True),
]
