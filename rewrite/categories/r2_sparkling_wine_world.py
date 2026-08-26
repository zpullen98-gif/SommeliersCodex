"""Rank II rewrite - Sparkling Wine World (22 questions: 10 MC, 12 short answer).

Certified level, pitched deliberately above the Rank I sparkling material. Where
Rank I asks a student to name the transfer method from its description, this
asks what the words bottle fermented on an American back label are quietly
admitting; where Rank I says the ancestral method finishes one fermentation in
glass, this asks where a pet-nat maker actually sets the pressure. Nothing here
repeats a Rank I task.

The bank is built around one idea: everything in it lives where Champagne's
shadow does not reach. It opens with the methods that undercut, imitate or
predate the traditional one, then follows the model outward to the places that
transplanted it - England on its chalk, the Cape, Tasmania and Australia, the
French houses' American ventures - and closes in Piedmont and Emilia with the
tank wines that never wanted to be Champagne at all. The regions that own their
own categories are fenced out: Champagne, Cava, Franciacorta and Prosecco,
Loire bubbles, Sekt and New Zealand all belong elsewhere, and the South Africa
module already carries Cap Classique's statutory lees floor, so the Cape
contributes its history here rather than its rulebook.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and
were tested by execution rather than eyeballed: a scratch script graded every
displayed answer, a set of natural phrasings and every nameable wrong answer.
No '~' entries appear anywhere. Where a real and different thing extends or
inverts an answer, the wrong form was run through the grader to confirm it
fails: bare Burgundy against Sparkling Burgundy, Louis Roederer against
Roederer Estate, plain Charmat against Charmat lungo, Mexico against New
Mexico, petillant against perlant. The one threshold answer, the spumante
pressure floor, carries ex=True with its figure, spelled and unit variants
enumerated, because a threshold graded by containment reads the same in both
directions; perlant is ex=True as well, since petillant sits one legal band
above it and exact matching is the only wall between them. Two of the failures
were found only by running the probes, never by reading: the grader also
matches when the input sits inside an accept entry, so metodo charmat graded
Charmat lungo until the longer entries were cut, and it matches a bare accept
as a substring, so Jansz graded Janszoon, the very patronymic its own stem
names, until the question went ex=True.

Facts are restricted to ones that do not drift: method mechanics, label law,
pressure bands, and founding history that is already history. No production
volumes, no market shares, no current ownership beyond ventures whose founding
is a dated event.
"""

from lib import Q, SA

CAT = "Sparkling Wine World"
SLUG = "r2-sparkling-wine-world"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("The methods at depth", 6),
    ("English sparkling wine", 4),
    ("The southern hemisphere", 4),
    ("The Americans and their French parents", 4),
    ("Asti, Lambrusco and the tank", 4),
]

BANK = [
    # ------------------------------------------- The methods at depth (6) ----
    Q("The methods at depth",
      "A pet-nat maker wants a gentle two and a half bar in the finished wine rather than a spumante's six. Where is that decision actually made?",
      ["On bottling day, in how much unfermented sugar is still in the wine as it goes under the cap",
       "At disgorgement, where pressure is vented along with the frozen plug of sediment",
       "In the liqueur de tirage, by cutting back the sugar and yeast added for the second fermentation",
       "In the cellar's temperature, cold storage setting how much carbon dioxide the finished wine can keep dissolved"], 0,
      "An ancestral wine has one fermentation and nothing is ever added to provoke another, so the only gas it will ever hold comes from whatever sugar the ferment has not yet eaten when the wine goes into glass. Each four grams or so per litre finishes into roughly one further atmosphere, which is why the style sits naturally at modest pressures and often keeps a touch of sweetness: the tail of a chilled ferment rarely eats the bottle dry. There is no tirage liqueur to adjust and frequently no disgorgement either, so the maker's whole control is the timing of that one bottling."),
    Q("The methods at depth",
      "Two American sparklers stand together: the back of one reads fermented in this bottle, the other only bottle fermented. What is the shorter phrase quietly admitting?",
      ["The wine left the bottle it fermented in, finished in tank and rebottled: the transfer method",
       "The second fermentation ran in a sealed tank and the wine was bottled under counter-pressure",
       "The bubble was injected on the bottling line, as it would be into a soft drink",
       "Nothing; American labelling treats the phrases as interchangeable"], 0,
      "American convention reserves fermented in THIS bottle for wine sold in the glass it refermented in, while plain bottle fermented covers transfer wine, which took its bubble and its lees character in bottle and was then emptied under pressure, filtered, dosed and refilled in one batch operation. The economics are the point: the whole run is cleaned up in tank instead of being riddled and disgorged a bottle at a time. The label wording is often the only clue a buyer gets."),
    Q("The methods at depth",
      "Five years on from a shared disgorging date, a Brut and its Brut Nature sibling taste further apart than a few grams of sugar explain. What has the dosage been doing all that time?",
      ["Reacting slowly with what the yeast left behind, steering the dosed wine toward toast and roast",
       "Feeding a refermentation that has quietly raised the dosed bottle's pressure",
       "Nothing beyond sweetness; sugar is inert once dissolved, and the gap is the tasters' expectation",
       "Fermenting out, so the Brut has been drifting toward its sibling's dryness"], 0,
      "Dosage sugar is not inert: over years in bottle it takes part in slow browning chemistry with the nitrogen compounds autolysis left in the wine, and that pushes development toward the roasted, toasted register. The undosed wine ages along a leaner, more saline road rather than simply tasting less sweet, which is why houses speak of dosage needing time to marry and why the choice between the two styles is a choice of trajectory, not just of sugar."),
    SA("The methods at depth",
       "Spumante on an Italian label is a legal claim about pressure, not a style note, and there is a floor the dissolved gas must clear. Give that floor.",
       "Three bar",
       ["three bar", "3 bar", "three bars", "3 bars",
        "three atmospheres", "3 atmospheres", "three atm", "3 atm",
        "3", "three", "at least 3 bar", "at least three bar",
        "at least 3 atmospheres", "at least three atmospheres",
        "3 bar of pressure", "three bar of pressure",
        "3 atmospheres of pressure", "three atmospheres of pressure",
        "3 bar overpressure", "three bar overpressure",
        "above 3 bar", "above three bar", "more than 3 bar",
        "more than three bar", "over 3 bar", "over three bar",
        "minimum 3 bar", "minimum three bar", "3 bar minimum",
        "three bar minimum", "minimum of 3 bar", "minimum of three bar",
        "min 3 bar", "3 bar of overpressure", "three bar of overpressure",
        "3 bar or more", "three bar or more",
        "at least 3 bars", "at least three bars"],
       "Three bar of overpressure at twenty degrees is where European law draws the line for a fully sparkling wine, with frizzante occupying the band from one to two and a half. The quality-sparkling category that most Cremant and metodo classico wines sit in actually demands slightly more, three and a half, so a wine at three point two can be spumante and still fail that tier. Below one bar the law reads the wine as still, whatever prickle it shows.",
       ex=True),
    SA("The methods at depth",
       "Under one bar of pressure French law reads a wine as still, yet lists and back labels keep a word for that faint natural prick in the glass. Give the word.",
       "Perlant",
       ["perlant", "vin perlant", "perlant wine", "perlant style",
        "perle", "vin perle", "perlant wines"],
       "Perlant sits below petillant on the old French ladder: petillant carries a real if gentle sparkle in the one to two and a half bar band, while perlant is barely a whisper of gas, the sort a Muscadet bottled on its lees keeps from the winter's fermentation. The word makes no legal promise at all, which is exactly the point: it names a sensation the law has stopped measuring.",
       ex=True),
    SA("The methods at depth",
       "Months on yeast inside the pressure tank, rather than the usual quick turnaround, give some tank wines a bready depth the process is not famous for. Italians have a name for that slow variant. Give it.",
       "Charmat lungo",
       ["charmat lungo", "long charmat", "martinotti lungo", "lungo charmat"],
       "The standard tank turnaround is measured in weeks, which is the whole commercial point of the method, so leaving the finished wine on its fermentation lees under pressure for six months or more is a deliberate trade of throughput for texture. Autolysis proceeds in a tank exactly as it does in a bottle, only spread through a far greater volume of wine, so what the long version buys is a rounder mouthfeel and a suggestion of bread rather than the full biscuit of years in glass."),

    # --------------------------------------------- English sparkling wine (4) -
    Q("English sparkling wine",
      "Hambledon's 1950s replanting and most English vineyards for the next four decades leaned on German crossings plus one French-bred hybrid hardy enough for the climate. Which hybrid?",
      ["Seyval Blanc", "Villard Blanc", "Vidal Blanc", "Baco Noir"], 0,
      "Seyval Blanc, a Seyve-Villard cross, carried the acidity and rot resistance a cold wet season demands and made respectable bottle-fermented wine at estates like Breaky Bottom. Its hybrid parentage kept it outside the European quality-wine categories, which is one reason the industry swung so hard to Chardonnay and the Pinots once the warming climate let them ripen."),
    Q("English sparkling wine",
      "One English county's name has stood since 2022 as a protected wine origin in its own right, the first drawn at county scale. Which county?",
      ["Sussex", "Hampshire", "Cornwall", "Essex"], 0,
      "The Sussex PDO took seven years from application to grant and binds its users more tightly than the countrywide English designation, including the traditional method for its sparkling wine. The argument it caused was less about the rules than the map: fruit and presses cross the county line constantly, and growers elsewhere have so far preferred the broader name."),
    SA("English sparkling wine",
       "Most of England's vineyard crowds into the southeastern corner, where the Downs run their chalk toward the Channel, and adjoining counties there hold the bulk of it. Name the pair.",
       "Kent and Sussex",
       ["kent and sussex", "sussex and kent", "kent sussex", "sussex kent",
        "kent and east sussex", "kent and west sussex"],
       "Kent and Sussex between them hold the largest share of the national vineyard, with Hampshire next and Essex climbing fastest on its warm clay. The chalk gets the attention, but a surprising number of well-regarded sites actually sit on greensand, so the county and the rock are separate claims and a label naming one is not promising the other."),
    SA("English sparkling wine",
       "In 1988 a West Sussex estate planted Chardonnay, Pinot Noir and Meunier and nothing else, a bet on the traditional method made while nearly every English vine was a crossing or a hybrid. Name the estate.",
       "Nyetimber",
       ["nyetimber", "nyetimber estate", "nyetimber in west sussex"],
       "Its first releases in the mid-1990s took national trophies and did more than any argument on paper to turn the industry toward the Champagne varieties. The founding vineyards sit on greensand rather than the chalk the region is celebrated for, a useful correction to the idea that England's case rests on chalk alone, and the name itself belongs to a manor recorded in Domesday."),

    # -------------------------------------------- The southern hemisphere (4) -
    Q("The southern hemisphere",
      "Inky, firmly tannic, and yet almost every sparkling Shiraz leaves the cellar with a generous dosage. What is the sugar doing in a wine like that?",
      ["Cushioning the tannin, which carbon dioxide sharpens beyond what a still red would show",
       "Deepening the colour, pigment binding to sugar as the bottle ages",
       "Raising the pressure, since a sweeter dosage means a livelier mousse",
       "Covering under-ripeness, the style being built on fruit picked early and green for acidity"], 0,
      "Carbonic acid and the scrub of the bubbles both amplify bitterness and astringency, so tannin that reads supple in a still Shiraz turns aggressive under gas, and the dosage is a counterweight rather than a sweet tooth. The serious versions are traditional method from fully ripe, often old-vine fruit with years on lees, and the sugar is calibrated against the tannin exactly as it is against acidity in colder places."),
    SA("The southern hemisphere",
       "The first bottle-fermented sparkling wine South Africa ever put on sale was made in 1971 under an Afrikaans name, and the label is still poured today. Give that name.",
       "Kaapse Vonkel",
       ["kaapse vonkel", "simonsig kaapse vonkel",
        "kaapse vonkel from simonsig"],
       "Frans Malan of Simonsig made it from Chenin Blanc in 1971 and sold it from 1973 once its lees ageing was done, years before the Cape had a category to put it in; the phrase means Cape sparkle. The wine later moved over to the Champagne varieties, and when the industry needed its own term for the method two decades on, this bottle stood as the precedent: claim the method, name the Cape."),
    SA("The southern hemisphere",
       "A Pipers River label begun in the mid-1980s as a Champagne house's Tasmanian joint venture takes its name from the patronymic of Abel Tasman himself. Name the label.",
       "Jansz",
       ["jansz", "jansz tasmania", "the jansz label", "jansz of tasmania",
        "jansz sparkling"],
       "The partner was Louis Roederer, whose venture with Heemskerk was the first serious Champagne investment in Tasmania and settled the question of whether the island could carry the traditional method. The label later passed to the Hill-Smith family and marketed its wine as Methode Tasmanoise, a joke with a point in it: name the place, borrow nothing.",
       ex=True),
    SA("The southern hemisphere",
       "For the better part of a century Australia's festive sparkling red sold under a borrowed French name, retired once place-name protection reached the shelves. What was the style called?",
       "Sparkling Burgundy",
       ["sparkling burgundy", "australian sparkling burgundy",
        "sparkling burgundies"],
       "The style dates to the 1890s at Great Western in Victoria, where a Champagne-trained cellar hand put the local red through a second fermentation, and burgundy in that era was British shorthand for any soft red rather than a claim about Pinot Noir. Agreements with Europe struck the borrowed names off Australian labels, so the wine was rebadged sparkling Shiraz, which had been the grape inside all along."),

    # -------------------------- The Americans and their French parents (4) ----
    Q("The Americans and their French parents",
      "On the Carneros highway stands a copy of an eighteenth-century Champagne residence, built as the public face of one house's American venture. Which house?",
      ["Taittinger", "Moet et Chandon", "Louis Roederer", "Piper-Heidsieck"], 0,
      "Domaine Carneros, opened at the end of the 1980s, is modelled on the Chateau de la Marquetterie, the Taittinger property near Epernay, and the theatre is deliberate: a visible chateau announces a long commitment in a landscape of sheds. Moet had led the way into California in 1973 with Domaine Chandon at Yountville but kept the architecture Californian, and Piper-Heidsieck's venture ran under the Piper Sonoma name."),
    Q("The Americans and their French parents",
      "Korbel prints California Champagne on its labels to this day, and no American regulator objects. What protects the wording?",
      ["A grandfather clause: labels approved before the 2006 wine accord with Europe keep semi-generic names beside their true origin",
       "American law treats champagne as a common noun that any producer remains free to adopt for a sparkling wine",
       "A licence from the Champagne trade body, renewed by a royalty on every bottle sold",
       "The wine is traditional method, and in American usage the word certifies method rather than place"], 0,
      "The 2006 agreement froze the semi-generic names rather than abolishing them: no new label may take up champagne, chablis or burgundy, while brands already holding approval carry on, provided the true origin stands beside the borrowed word. That is why the survivors are old California brands, why the class shrinks by attrition, and why no new producer can ever join it."),
    SA("The Americans and their French parents",
       "A grower family from Bethon in Champagne planted Chardonnay and Pinot Noir at thirteen hundred metres in the high desert of an unlikely American state. Which state?",
       "New Mexico",
       ["new mexico", "the state of new mexico", "new mexico usa"],
       "Gilbert Gruet planted near Truth or Consequences in 1984, on cheap land whose altitude does what latitude will not: desert nights cold enough to hold acidity through a fierce summer. The family's Albuquerque winery built its reputation on traditional-method Brut priced against far grander addresses, and the lesson travels: a sparkling base is a question of site arithmetic, not postcode."),
    SA("The Americans and their French parents",
       "Its Champagne parent transplanted the house rules to Anderson Valley whole: every grape from its own ranches, and reserve wines raised in oak for the blend. Name the California estate.",
       "Roederer Estate",
       ["roederer estate", "roederer estate in anderson valley",
        "roederer estate california"],
       "Roederer arrived in 1982, chose fog-cooled Anderson Valley over the safer prestige of Napa, and refused bought fruit from the first vintage. The oak-aged reserve wines are the signature it shares with the parent house, and the vintage prestige bottling, L'Ermitage, made the case that American traditional method could age. The operation reads less like a subsidiary than a second house."),

    # ------------------------------------ Asti, Lambrusco and the tank (4) ----
    Q("Asti, Lambrusco and the tank",
      "Same Canelli grower, same Moscato Bianco: one bottle wears a wire cage and reaches about seven percent alcohol, the other a plain straight cork, a soft prickle and five. Which is which?",
      ["The caged bottle is Asti, the corked one Moscato d'Asti",
       "The caged bottle is Moscato d'Asti, the corked one Asti",
       "Both are Moscato d'Asti, bottled at the two pressures the rules allow",
       "The caged bottle is Brachetto d'Acqui, the corked one Moscato d'Asti"], 0,
      "The two share a denomination and a grape; the fork is how far the single fermentation is allowed to run. Asti ferments on to full spumante pressure and a couple of points more alcohol, so the closure must be the caged mushroom cork, while Moscato d'Asti is arrested sooner, keeping more sugar and staying below the sparkling threshold, which is why it may seal and pour like a still wine."),
    Q("Asti, Lambrusco and the tank",
      "Dry Lambrusco and sweet Asti both take their sparkle in tank, yet only one of them ever gets a second fermentation. Which one, and why?",
      ["The Lambrusco: a finished dry base wine referments in tank, where Asti is one fermentation stopped partway",
       "The Asti: reaching full pressure on grape sugar alone takes a second fermentation on top of the first",
       "Both referment; sparkle made in tank is a second fermentation by definition",
       "Neither referments; tank sparkle is dissolved into the wine under pressure rather than fermented"], 0,
      "Asti's tank run starts from must and simply never finishes, which is where its sweetness and low alcohol come from; there is nothing left over for a second act. Lambrusco is made as an ordinary dry wine first and then set going again in tank with a measured addition, which is why it can finish bone dry at normal strength. One name covers two genuinely different sequences, and each wine has the one it needs."),
    SA("Asti, Lambrusco and the tank",
       "One member of the Lambrusco family covers more Emilian vineyard than any other. Name it.",
       "Lambrusco Salamino",
       ["lambrusco salamino", "salamino",
        "lambrusco salamino di santa croce", "salamino di santa croce"],
       "The name records its tight, cylindrical bunches, shaped like little salami, which in Emilia counts as affectionate. It anchors the workhorse blends around Reggio and Modena and holds a denomination of its own at Santa Croce, and blenders lean on it for colour and easy fruit rather than for structure."),
    SA("Asti, Lambrusco and the tank",
       "Ripeness shows in one Lambrusco's very name: as harvest nears, its stalks and bunch stems flush red. Name it.",
       "Lambrusco Grasparossa",
       ["lambrusco grasparossa", "grasparossa",
        "lambrusco grasparossa di castelvetro", "grasparossa di castelvetro"],
       "Graspa is the local word for the stalk, and the red flush runs through stem and leaf as the fruit comes in. It grows on the foothills south of Modena around Castelvetro and gives the fullest and grippiest wine of the family, the one traditionally poured against the fattest plates on the Emilian table."),
]
