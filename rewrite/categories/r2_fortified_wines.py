"""Rank II rewrite - Fortified Wines (35 questions: 17 MC, 18 short answer).

Certified level, and pitched at the RULES rather than at the styles. Rank I
already teaches that spirit stops the ferment, that a tawny browns in wood and
that canteiro is the slow route on Madeira; this category asks what the licence
caps, what the label has to say, how many years the ladder demands and which
route a wine must have taken to be allowed the claim at all. Nothing here
repeats a Rank I task.

The running order is built around one idea: a fortified wine is defined by a
decision taken before it is made and by a rule that governs it afterwards. So
each family runs from the licence and the spirit, through the vessel and the
years, to the words the label is then permitted. Port first, since its
regulations are the most elaborate, then Madeira, then Marsala, then the French
mutage appellations.

Jerez is deliberately absent. It belongs to the committed Spain category, which
owns the solera, the flor, the marks and the age claims, and every fortified
contrast here is drawn against Port or Madeira instead.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and were
tested by execution rather than by eye: every displayed answer, two or three
natural phrasings of it and a list of named wrong answers were run through the
grader for each question. No '~' entries appear anywhere, since the tilde is
exact-OR-containment and a one-word tilde grades any wrong answer holding that
word. Every threshold answer carries ex=True - the fraction of stock a shipper
may sell, the alcohol band, the Grand Cru wood minimum - because containment
reads a threshold the same in both directions, and each of those lists was then
widened until the digits, the spelled form, the 'between' form and the 'at
least' form all still grade. Note that core.js norm() strips 'the', 'a', 'de',
'du', 'des', 'la' and 'le', so 'the pipe' and 'pipe' are one entry and not two;
every list here was checked for entries that collapse into each other.

Facts are restricted to ones that do not drift: licences, bands, minimum years,
label mentions, grape rules and the mechanics of a cask. No ownership, no
volumes, no market shares and no recent promotions.
"""

from lib import Q, SA

CAT = "Fortified Wines"
SLUG = "r2-fortified-wines"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("The Douro rules and the beneficio", 5),
    ("Wood ageing and the lodges of Gaia", 4),
    ("Vintage, late bottled and crusted", 3),
    ("White, rose and the Douro's other fortified wine", 3),
    ("Madeira: the heat and the rules", 4),
    ("Madeira: varieties, sweetness and single harvests", 5),
    ("Marsala: colour, sweetness and the ladder", 4),
    ("Vins doux naturels", 4),
    ("Vins de liqueur and the oxidative styles", 3),
]

BANK = [
    # ------------------------------ The Douro rules and the beneficio (5) ----
    Q("The Douro rules and the beneficio",
      "Before a single grape is picked, a figure is fixed for how much must may be turned into Port across the whole valley that year. What is that figure set against?",
      ["The stocks the trade already holds and what it sold last year",
       "The area under vine, at a fixed number of litres per hectare planted",
       "The average must weight measured in the week before picking",
       "The rainfall recorded between flowering and harvest"], 0,
      "The beneficio is a market control before it is a quality control: the authorities weigh the stock sitting in the lodges against what the trade has been selling, release only that much fortification, and then divide it among growers by the graded score of each parcel. Whatever is not licensed is fermented out dry and sold as unfortified Douro wine, which is why one vineyard feeds two entirely separate trades."),
    Q("The Douro rules and the beneficio",
      "Roughly one part spirit goes into four or five parts of fermenting must, and the distillate is bought at a strength the regulations fix rather than one the shipper prefers. Which strength?",
      ["Seventy-seven percent", "Forty percent",
       "Ninety-six percent", "Sixty percent"], 0,
      "Aguardente vinica at that strength is deliberately not neutral. It carries congeners of its own, so the choice of spirit seasons the wine and is argued over in the trade as hotly as the fruit is. A spirit taken up to ninety-six, which is about as neutral as a spirit can be made, would add alcohol and nothing else, and that is what a producer wants when the grape is supposed to do all the talking."),
    SA("The Douro rules and the beneficio",
       "Douro stocks, contracts and the annual fortification allowance are all counted in a traditional cask measure of five hundred and fifty litres. Name that measure.",
       "The pipe",
       ["pipe", "pipa", "port pipe", "porto pipe", "pipe cask", "pipes",
        "pipe of port", "pipe or pipa", "pipa or pipe", "pipe 550 litres",
        "pipe of 550 litres", "550 litre pipe", "pipe pipa", "pipa 550 litres",
        "pipa of 550 litres", "550 litre pipa", "port pipe of 550 litres"],
       "It works as a unit of account rather than as a description of any particular barrel, and the casks a lodge actually ages wine in vary around it. Holdings, licences and bottling runs are all quoted this way, so a shipper's entire position is described in a measure no drinker ever meets.",
       ex=True),
    SA("The Douro rules and the beneficio",
       "However much stock a shipper is sitting on, only a set fraction of it may be released to the market in any one year. Give the fraction.",
       "One third",
       ["one third", "third", "33 percent", "33 per cent", "33%", "1/3",
        "one third of stock", "one third of its stock",
        "one third of their stock", "one third of the total stock",
        "a third of the stock", "a third of their stock",
        "a third of the stock held", "one third each year", "a third each year",
        "one third a year", "one third per year", "one third of stock each year",
        "no more than one third", "up to one third", "a third per year",
        "up to a third", "no more than a third", "a third of its stock",
        "a third of his stock", "one third of the total", "one third of it",
        "one third annually", "one third of holdings",
        "one third of stock per year", "one third of the stock held"],
       "The rule is a brake on the whole trade. It stops a run of fine harvests being dumped into the market at once, and it forces every house to carry reserves far deeper than a year's trading needs, which is the only reason a blend of genuinely old cask wine can exist at all. What is on sale this year was settled by a stock ledger years ago.",
       ex=True),
    SA("The Douro rules and the beneficio",
       "Whatever the style in the bottle, the finished wine has to land inside a narrow alcohol band written into the Port regulations. Give that band.",
       "Nineteen to twenty-two percent",
       ["nineteen to twenty two percent", "nineteen to twenty two per cent",
        "nineteen to twenty two", "between nineteen and twenty two percent",
        "nineteen to twenty two percent alcohol",
        "nineteen to twenty two percent abv",
        "19 to 22 percent", "19 to 22 per cent", "19 to 22",
        "between 19 and 22 percent", "between 19 and 22%",
        "19% to 22%", "19-22%", "19%-22%", "19-22 percent", "19 to 22%",
        "19 to 22 percent alcohol", "19 to 22% alcohol",
        "19 to 22 percent abv", "19 to 22% abv", "19-22", "19-22 percent abv",
        "19 to 22 abv", "between 19 and 22 percent abv", "between 19% and 22%",
        "from 19 to 22 percent", "19 and 22 percent", "19% abv to 22% abv",
        "19 to 22 percent by volume", "19 to 22 percent alcohol by volume",
        "nineteen and twenty two percent"],
       "A wine that ferments too far to take enough spirit, or takes too little, is simply not Port and has to be sold as something else. The one exception the rules make is for the light dry white, which may come in at sixteen and a half so that it can be poured long over ice without flooring a guest before dinner.",
       ex=True),

    # ---------------------------- Wood ageing and the lodges of Gaia (4) -----
    Q("Wood ageing and the lodges of Gaia",
      "Two casks are filled from one lot of young Port; one goes down to a cool damp lodge on the estuary at Vila Nova de Gaia and the other stays in a store up the valley. Ten years on, how do they compare?",
      ["The valley cask has aged faster and given back far less wine",
       "The valley cask has aged more slowly, since dry heat seals the staves and keeps air out",
       "The Gaia cask has aged faster, since damp sea air drives oxygen through the wood",
       "Neither has moved, as a cask works on the wine only through the age of its own oak"], 0,
      "Heat drives everything a cask does, and a Douro summer up the valley is far fiercer than one at the river mouth. Wine raised up the valley browns sooner, concentrates faster and loses far more to evaporation, while the estuary lodges are cool and humid enough to hold a wine for decades without cooking it. That is why the trade grew up at the river mouth in the first place, and why choosing where to lay a lot down is a decision about style rather than about storage."),
    Q("Wood ageing and the lodges of Gaia",
      "Red colour drains out of a Port ageing in cask while a wine bottled at two years holds its own for decades. What is becoming of the pigment?",
      ["Air polymerises it and it falls out as sediment in the cask",
       "The wood absorbs it into the staves, which is why old casks look stained",
       "The spirit dissolves it, and it is lost at the next racking",
       "Heat bleaches it into a colourless compound"], 0,
      "Oxygen reaching the wine through the wood links the colour molecules into chains too heavy to stay in solution, so they settle and are racked away, leaving an amber wine that has thrown its deposit before it ever reaches glass. A wine sealed in bottle at two years has no such supply of air, so it keeps its colour and its sediment for the customer to deal with. Both a tawny with an indication of age and a colheita go through this; what separates them is only whether the casks held one harvest or many."),
    SA("Wood ageing and the lodges of Gaia",
       "A ruby, a tawny or a white judged by the tasting panel to stand clearly above the standard grade may add one word to its category name. Give the word.",
       "Reserve",
       ["reserve", "reserva", "reserve or reserva", "reserva or reserve",
        "reserve reserva", "word reserve", "word reserva", "reserve port",
        "reserva port", "ruby reserve", "tawny reserve", "white reserve",
        "white reserva", "ruby reserva", "tawny reserva", "reserva reserve",
        "porto reserve", "reserve designation"],
       "It is a quality claim rather than a stated age: the sample either passes the tasting panel or it does not, and a tawny carrying the word puts no number of years on the label, whatever spell in wood its own colour category demands before the claim is allowed. It occupies the step between the cheapest bottling and the wines that declare an age, which is where most of the trade in serious Port actually sits.",
       ex=True),
    SA("Wood ageing and the lodges of Gaia",
       "One rare Port style spends a few years in wood and then many years in sealed glass demijohns rather than cask, so it develops with almost no air at all. Name the style.",
       "Garrafeira",
       ["garrafeira", "garrafeira port", "port garrafeira", "garrafeira style"],
       "Glass gives up none of the oxygen wood does, so the wine stops taking on cask character and goes somewhere neither a bottle-aged nor a cask-aged Port arrives at, keeping fruit while turning silky. The rules ask for a spell in wood and then a long minimum in demijohn before the wine may be sold, and the two or three houses that still bother routinely leave it there for decades longer than that."),

    # ---------------------------- Vintage, late bottled and crusted (3) ------
    Q("Vintage, late bottled and crusted",
      "Casks from an outstanding harvest are tasted through the following winter, and a house that means to declare must give notice to the authorities inside a fixed window. When does that window fall?",
      ["In the second year after the harvest",
       "In the harvest year itself, before the ferment has even been muted",
       "In the fourth year, once the wine has passed three winters in wood",
       "At bottling, whenever in the wine's life the house chooses to bottle"], 0,
      "Notice goes in during the second year and the wine must be in bottle before the third year is out, which is what makes a Vintage Port bottle-aged by definition rather than by anyone's choice. A house that declines to declare may still bottle a vintage-dated wine from one of its own properties, and those single quinta bottlings run to exactly the same calendar."),
    Q("Vintage, late bottled and crusted",
      "Two late bottled vintages of one year sit on the list, and the dearer of the two says unfiltered. What follows for the guest who orders it?",
      ["It will throw a deposit, so it wants decanting, and it can still improve",
       "It will taste sweeter, since filtration takes sugar out along with the sediment",
       "It must be drunk inside a year, since an unfiltered wine is unstable in glass",
       "It will be paler, since filtration is what fixes colour in a young Port"], 0,
      "Filtration removes what would otherwise settle, and it removes the wine's capacity to go on developing with it, so a filtered LBV is finished on the day it is released while an unfiltered one behaves much more like a young vintage wine. Producers who bottle unfiltered say so on the label, sometimes as bottle matured, because the extra work at the table has to be justified to the buyer."),
    SA("Vintage, late bottled and crusted",
       "Several harvests are blended together, bottled without filtration and then given a long rest in glass before release. Which Port style is that?",
       "Crusted Port",
       ["crusted port", "crusted", "crusted porto", "crusted ports"],
       "It is the only Port that blends years and still behaves like a vintage wine in the bottle, which is exactly what the name warns: it deposits. The style was invented by the British trade as a way of getting the character of a declared wine without the price or the wait, and the three years in glass are what the rules ask in place of a declaration."),

    # ------------- White, rose and the Douro's other fortified wine (3) ------
    Q("White, rose and the Douro's other fortified wine",
      "A pink Port poured cold over ice is the newest thing in the category. Which description fits the way it is made?",
      ["A short maceration draws just enough colour, and the wine sees no wood at all",
       "White Port is blended with a little ruby just before bottling",
       "A tawny is drawn off the cask before it has finished browning",
       "The wine rests in old red casks until it takes up their pigment"], 0,
      "Everything about it is aimed at colour and fruit rather than at development: brief skin contact, protection from air throughout, early bottling and no cask ageing whatever. It is the one Port the rules treat as a wine to be drunk on release and never laid down."),
    SA("White, rose and the Douro's other fortified wine",
       "At the sweet end of the white Port range sits a style whose name means tear. Name it.",
       "Lagrima",
       ["lagrima", "lagrima port", "porto lagrima", "lagrimas"],
       "It carries well over a hundred grams of sugar a litre and is the one white Port that works as a dessert pour rather than long with tonic and ice. Drier whites are declared seco, and they get there by letting the ferment run further before the spirit goes in, which is the same lever that sets sweetness in every Port."),
    SA("White, rose and the Douro's other fortified wine",
       "High on the plateau above the river at Favaios, growers fortify a Muscat that is not Port at all and carries a denomination of its own. Name that wine.",
       "Moscatel do Douro",
       ["moscatel do douro", "moscatel douro", "moscatel de favaios",
        "favaios moscatel", "moscatel of favaios", "douro moscatel",
        "moscatel do douro doc"],
       "The grape is Moscatel Galego Branco, the small-berried aromatic Muscat, grown at around six hundred metres on the plateau rather than on the terraced valley slopes, and muted much as a Port is before ageing in wood. It is bottled both young and grapey and as an old cask wine, and it is the standing reminder that fortification in the Douro is not confined to the wine the valley is famous for."),

    # -------------------------------- Madeira: the heat and the rules (4) ----
    Q("Madeira: the heat and the rules",
      "Casks in a Madeira lodge begin their life on the top floor under the roof and are moved down the building as the years pass. What is the reasoning?",
      ["The roof space is the hottest part of the building, and heat drives the ageing",
       "The oldest casks are the heaviest and can no longer be lifted safely",
       "The lower floors are damper, and the wine needs that moisture as it ages",
       "Light through the roof windows is what drives the ageing"], 0,
      "Warmth is the engine of everything the island's wine does, so where a cask sits in the building is a decision about how fast it will develop. The youngest wine takes the strongest heat up under the roof and then matures more gently the further it descends. A lot may spend twenty years working its way down to the ground floor, and the lodge's own summer does all of it."),
    Q("Madeira: the heat and the rules",
      "Nothing may be bottled and sold as Madeira until it has served a minimum period of ageing. How long?",
      ["Three years", "One year", "Five years", "Ten years"], 0,
      "That is a floor rather than an average, so a wine on the bottom rung may well hold older material blended into it without being allowed to say so. The ladder above climbs in fives and tens, and each step up it is a claim the certifying body has to approve before the label may carry it."),
    SA("Madeira: the heat and the rules",
       "A blend that has come out drier than the house wants can be sweetened with must that was fortified before it ever fermented. Give the island's name for that sweetening wine.",
       "Vinho surdo",
       ["vinho surdo", "surdo", "surdo wine", "vinho surdo madeira"],
       "Muting a must before the yeast touches it keeps every gram of its sugar, and what strength it has comes from the spirit rather than from fermentation, so a small dose lifts sweetness without watering the blend down. It is the ordinary tool for holding a house style steady from one harvest to the next, and something equivalent exists in every region that fortifies."),
    SA("Madeira: the heat and the rules",
       "Certification of the island's wine sits with a public institute whose remit also covers embroidery and handicrafts. Give the initials it goes by.",
       "IVBAM",
       ["ivbam", "i.v.b.a.m.", "ivbam institute",
        "instituto do vinho do bordado e do artesanato da madeira"],
       "Wine, embroidery and handicrafts are the island's three protected trades, its wickerwork among the last of them, and one body certifies all of it, so the seal on a bottle comes from the same office as the seal on a tablecloth. Nothing may leave the island as Madeira without passing through it."),

    # -------------- Madeira: varieties, sweetness and single harvests (5) ----
    Q("Madeira: varieties, sweetness and single harvests",
      "Printing a grape name on a Madeira label commits the producer to a minimum share of that variety in the bottle. What does the rule ask for?",
      ["Eighty-five percent from the named grape",
       "Three quarters of it, and no less than that",
       "Half, with the balance from any permitted grape",
       "All of it, since no blending is allowed here"], 0,
      "Whatever makes up the balance is nearly always Tinta Negra, which can be vinified at any sweetness and disappears into a blend without argument. The threshold is why a wine sold under a variety and a wine sold under a sweetness term can start from very similar material and still taste unalike."),
    Q("Madeira: varieties, sweetness and single harvests",
      "A lodge sets aside a lot it hopes to sell one day with a harvest year on the label. Which ageing route must that wine have taken?",
      ["Cask on the lodge racks, with no artificial heat at any stage",
       "Three months in the heated tanks, then cask",
       "Six months in a gently warmed store, then cask",
       "Either route, provided the wine is old enough by the time it is bottled"], 0,
      "Heated tanks are for the everyday blends and cannot produce anything worth keeping for decades, so colheita and frasqueira are both restricted to slow cask ageing in the lodge. What separates those two claims from each other is only the number of years demanded before bottling, and one of them asks for a great many more than the other."),
    SA("Madeira: varieties, sweetness and single harvests",
       "Sweetness on a Madeira label is declared in four steps rather than left to a grape name to imply. Give the step that sits one drier than doce.",
       "Meio doce",
       ["meio doce", "medium sweet", "medium rich", "meio doce medium sweet",
        "medium sweet meio doce", "meio doce medium rich",
        "medium rich meio doce", "meio doce or medium sweet",
        "medium sweet or meio doce", "meio doce or medium rich",
        "medium rich or meio doce", "meio doce step"],
       "The scale runs seco, meio seco, meio doce, doce, and English labels render those as dry, medium dry, medium rich and sweet. It matters because most of the island's wine comes from a variety that implies no sweetness at all, so the label has to say in words what a noble variety name once said by itself.",
       ex=True),
    SA("Madeira: varieties, sweetness and single harvests",
       "A Madeiran saying warns that its grapes should be neither eaten nor given away, since God made them for wine. The variety nearly died out with phylloxera, and its wines finish dry and faintly bitter after a sweet attack. Name it.",
       "Terrantez",
       ["terrantez", "terrantez madeira", "terrantez grape", "madeira terrantez"],
       "It sits outside the four varieties the sweetness ladder was built around, and the surviving rows amount to very little, so old bottles fetch prices out of all proportion to their fame. The shape of the wine is its own: sweet at the front, then dry and gently bitter at the finish, which is precisely why it never fitted the ladder."),
    SA("Madeira: varieties, sweetness and single harvests",
       "One member of Madeira's noble set is a black grape, and the Jura bottles the same variety dry as Trousseau. Give its Madeiran name.",
       "Bastardo",
       ["bastardo", "bastardo madeira", "bastardo grape", "madeira bastardo"],
       "It all but vanished from the island after phylloxera and survives in a handful of rows and in very old bottles. Mainland Portugal grows it too, in the Douro and the Dao, and its presence in the noble set is the reminder that those varieties were never all white."),

    # ------------------- Marsala: colour, sweetness and the ladder (4) -------
    Q("Marsala: colour, sweetness and the ladder",
      "At the top of the Marsala ageing ladder sits a wine that must spend longer in wood than anything else in the denomination. How long?",
      ["Ten years", "Four years", "Twenty years", "Two years"], 0,
      "Vergine Stravecchio, also sold as Vergine Riserva, takes ten years where plain Vergine takes five, Superiore Riserva four, Superiore two and the entry grade one. The ladder is entirely a matter of time, most of which each step has to spend in wood, which is how one base wine can appear at four different points on the same list."),
    Q("Marsala: colour, sweetness and the ladder",
      "A Marsala label reads Rubino rather than Oro. Which grapes must have been in the vat?",
      ["Black varieties such as Perricone and Nero d'Avola",
       "Grillo and Catarratto, pressed off the skins at once",
       "Any permitted variety, since the word records sweetness rather than colour",
       "White varieties darkened by many years in cask"], 0,
      "Oro and Ambra are both made from the island's white grapes, so no taster can separate those two by variety. Rubino is the only one of the three colour categories the fruit itself decides, and it is much the rarest of them on a list."),
    SA("Marsala: colour, sweetness and the ladder",
       "One year of ageing is all the entry grade of Marsala has to serve, and its one-word name reads like praise. Name the grade.",
       "Fine",
       ["fine", "marsala fine", "fine marsala", "fine grade", "fine ip",
        "fine i p", "fine italia particolare", "italia particolare",
        "fine one year", "marsala fine ip", "marsala fine i p",
        "marsala fine italia particolare"],
       "Most of it is made to be cooked with rather than drunk, and that is the reputation the denomination has spent decades trying to shake off. The word is a grade and not a compliment, and everything above it on the ladder is defined by how many more years of ageing it has to serve before it may be sold.",
       ex=True),
    SA("Marsala: colour, sweetness and the ladder",
       "Colour and a burnt-sugar note in an amber Marsala come from a preparation of grape must reduced over heat. Give its Italian name.",
       "Mosto cotto",
       ["mosto cotto", "cooked must", "cooked grape must", "boiled must",
        "boiled grape must", "cooked down must", "mosto cotto cooked must",
        "cooked must mosto cotto", "mosto cotto boiled must",
        "boiled must mosto cotto", "mosto cotto or cooked must",
        "cooked must or mosto cotto", "mosto cotto or boiled must",
        "boiled must or mosto cotto", "il mosto cotto"],
       "It is must boiled down until it caramelises, and it goes in as one part of the concia, the blending preparation that also carries fortified must and spirit. Because it darkens and sweetens at once, colour and sweetness have to be declared separately on the label: the same wine can be adjusted for either.",
       ex=True),

    # ------------------------------------------- Vins doux naturels (4) ------
    Q("Vins doux naturels",
      "In a Banyuls cellar the spirit goes into the vat with the skins still in it, and the mass is left together for weeks afterwards. What is that buying?",
      ["Colour and tannin, which the alcohol draws out of the skins",
       "A second fermentation, since the added spirit brings sugar of its own",
       "Protection from oxygen, since the floating cap seals the surface of the vat",
       "A paler wine, since alcohol bleaches the pigment out of the skins"], 0,
      "Fermentation here is stopped after two or three days, which is nowhere near long enough to build a red wine, so the extraction is done afterwards by the alcohol, which is a better solvent than must is. Muting off the skins instead gives a lighter and fruitier wine, and the same appellation uses both routes for different bottlings."),
    Q("Vins doux naturels",
      "Leaving the Muscats aside, a Roussillon vin doux naturel draws its base only from a short list of varieties. Which set?",
      ["Grenache in its three colours, plus Macabeu and Malvoisie du Roussillon",
       "Syrah, Mourvedre and Carignan, exactly as in the dry reds made on the same hills",
       "Whatever the dry Cotes du Roussillon appellation permits",
       "Cinsault and Grenache Gris only"], 0,
      "Grenache Noir carries the dark styles, Grenache Blanc and Gris and their two partners the pale ones, and Malvoisie du Roussillon is the local name for Tourbat rather than for any Malvasia. The list is short because these wines depend on a variety that will pile up sugar in a stony, drought-stricken vineyard and still taste of something."),
    SA("Vins doux naturels",
       "Adding Grand Cru to a Banyuls label commits the wine to a minimum spell in wood the plain appellation does not ask for. Give it.",
       "Thirty months",
       ["thirty months", "30 months", "thirty months in wood", "30 months in wood",
        "thirty months in cask", "30 months in cask", "thirty months in oak",
        "30 months in oak", "two and a half years", "two and a half years in wood",
        "2.5 years", "at least thirty months", "at least 30 months",
        "minimum of thirty months", "minimum thirty months", "minimum 30 months",
        "thirty months minimum", "30 months minimum",
        "at least thirty months in wood", "at least 30 months in wood",
        "at least 30 months in cask", "at least 30 months in oak",
        "minimum 30 months in wood", "minimum 30 months in cask",
        "minimum of 30 months", "minimum of 30 months in wood",
        "thirty months minimum in wood", "thirty months minimum in cask",
        "30 months minimum in wood", "30 months minimum in cask",
        "30 months in wood minimum", "30 months of cask ageing",
        "thirty months of cask ageing", "thirty months in barrel",
        "30 months in barrel", "at least two and a half years",
        "30 months two and a half years"],
       "The Grand Cru also demands a higher proportion of Grenache Noir than the ordinary appellation, so it is a rule about grape and time together. Those years in wood change the wine altogether: a Grand Cru tastes of dried fig and cocoa where a young bottling tastes of kirsch and crushed berry.",
       ex=True),
    SA("Vins doux naturels",
       "A Rivesaltes or a Maury held five years or more before release may carry a phrase that says so without naming a number. Give the phrase.",
       "Hors d'age",
       ["hors d'age", "hors dage", "hors d'age mention"],
       "It means beyond age, and it suits a producer who wants to claim maturity without committing to a vintage or to a stated count of years. It is one of several mentions the appellations regulate, Rancio and the colour terms among them, and each carries conditions of its own, so the words on these labels are not interchangeable."),

    # --------------------- Vins de liqueur and the oxidative styles (3) ------
    Q("Vins de liqueur and the oxidative styles",
      "A Charentais grower who wants to make Pineau des Charentes cannot simply buy in a case of brandy for the job. What does the rule demand?",
      ["Cognac and juice from the grower's own holding",
       "Neutral spirit at ninety-six percent, the same as a vin doux naturel takes",
       "Any Cognac bought inside the delimited region, from whichever house has it",
       "Armagnac of at least three years"], 0,
      "Spirit and juice have to come off the same property, which makes Pineau a farm product in a way that very little fortified wine is. The Cognac must carry some age before it is used and the blend then spends time in cask, so a bottle represents two crops from one holding rather than a purchase."),
    Q("Vins de liqueur and the oxidative styles",
      "Walnut, coffee and old wood are welcomed in an old fortified wine and would condemn a table wine. What produces them?",
      ["Air and heat together, working on the wine over years",
       "A film of living yeast sealing the surface away from the air",
       "Bacteria converting the malic acid in the wine into lactic acid",
       "Long, cold, airless storage in a deep cellar"], 0,
      "Warmth accelerates oxidation and the slow chemistry that follows it, so a part-empty cask in a hot loft does in five years what a cool cellar would not manage in fifty. Producers court it deliberately, leaving casks ullaged or standing glass jars outdoors through summer and winter, and the trade's name for the result is rancio."),
    SA("Vins de liqueur and the oxidative styles",
       "In the Languedoc a grower mixes unfermented juice with grape spirit, often a local marc, and rests the result in wood. Name that drink.",
       "Cartagene",
       ["cartagene", "carthagene", "cartagene languedoc", "languedoc cartagene"],
       "It belongs to the same family as Pineau des Charentes and Floc de Gascogne: spirit into juice that never ferments, so all the sweetness is grape sugar and all the alcohol came out of a still. It was a farmhouse tradition for generations before anyone regulated it, and most of it is still drunk within a few kilometres of where it was made."),
]
