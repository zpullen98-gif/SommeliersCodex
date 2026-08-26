"""Rank II rewrite - Sake (20 questions: 9 MC, 11 short answer).

Certified level, pitched deliberately above the Rank I "Sake & Spirits"
category. Where Rank I asks what the seimaibuai figure means, this asks what
floor the koji-rice ratio sets beneath every premium grade; where Rank I names
sokujo from its added lactic acid, this asks which organisms the traditional
starters wait for and which of kimoto and yamahai still swings the poles.
Shochu and everything distilled stays with Spirits & Cocktails, which
deliberately left brewing to this module, and the committed Service &
Hospitality module already owns naming the seimaibuai and serving a daiginjo
cold, so neither task is repeated here.

The running order follows the way a sommelier actually meets a bottle: what
the designation on the label promises, how the brew earned it, what the style
words add, what the numbers on the back mean, whose rice and whose hands made
it, and last how it reaches the table and how two legal systems file it.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and
were tested by execution rather than eyeballed: for every list the displayed
answer and several natural phrasings were run and graded True, and every
nameable wrong answer was run and graded False. No '~' entries appear
anywhere. ex=True is applied only where a real and different thing extends or
inverts the right answer: the two numeric thresholds, where "less than" and
"more than" read the same to a containment grader, and the starter-organism
question, where "lactic acid" alone - the bottled addition of the modern
method - sits inside "lactic acid bacteria" and would otherwise grade. Each
ex=True list was then widened until the natural phrasings of its own answer
all still grade, because exact matching rejects anything not written down.

Facts are restricted to ones that do not drift: the designation rules as
revised in 2004, the Liquor Tax Act's definition of seishu, federal
classification in the United States, rice pedigree and starter microbiology.
No production volumes, no prefecture rankings, no prices.
"""

from lib import Q, SA

CAT = "Sake"
SLUG = "r2-sake"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("Polishing and the designations", 4),
    ("Koji, moto and the ferment", 4),
    ("Nama, wood and age", 3),
    ("The meter and the acid", 3),
    ("Rice and the toji", 3),
    ("Service and the law", 3),
]

BANK = [
    # ------------------------------------ Polishing and the designations (4) --
    Q("Polishing and the designations",
      "Of the eight premium designations, one has carried no minimum polishing requirement at all since a 2004 rule change. Which is it?",
      ["Junmai", "Honjozo", "Ginjo", "Junmai ginjo"], 0,
      "Until the 2004 revision junmai carried the same 70 percent bar as honjozo; the revision dropped the polishing bar alone, so the rule now asks that the rice be graded, that the koji floor be met, and that nothing but rice, water and koji go in. The change freed brewers to work deliberately low-polish styles, so a junmai with no milling figure on its label is not hiding anything."),
    Q("Polishing and the designations",
      "Top daiginjo brewers dose the mash with a little distilled alcohol even when economy is no object. What are they buying with it?",
      ["Aroma carried out of the lees and a lighter, drier finish",
       "Extra volume, since the addition can triple the yield",
       "Sweetness, since the spirit arrests the ferment early",
       "Longer shelf life, with no pasteurisation needed"], 0,
      "Ginjo esters dissolve more readily in alcohol than in water, so a dose added just before pressing pulls aroma out of the lees that would otherwise be discarded with them, and it dries and lightens the finish. At the premium designations the quantity is tightly capped, which is what separates aruten brewing from the volume-stretching triple sake of the postwar shortage years."),
    SA("Polishing and the designations",
       "Milling is not the only bar a premium designation must clear: a floor is also set on how much of the total rice must go through the mould room as koji rice. What is that floor?",
       "Fifteen percent",
       ["fifteen percent", "15 percent", "15%", "15 per cent", "fifteen per cent",
        "at least 15 percent", "at least fifteen percent", "15 percent or more",
        "fifteen percent or more", "15", "fifteen", "a minimum of 15 percent",
        "15 percent minimum", "15 percent koji rice", "fifteen percent koji rice",
        "15% or more", "15 percent of the rice", "at least 15%",
        "minimum 15 percent", "15% minimum", "15 percent of total rice"],
       "The floor stops a brewery skimping on the most laborious stage: koji rice is worked grain by grain in the warm room while the rest of the charge is simply steamed. Fall below fifteen percent and the sake drops out of the premium system entirely, whatever its polish.",
       ex=True),
    SA("Polishing and the designations",
       "Junmai, honjozo, ginjo and their compound grades sit together under one collective legal term for premium sake. Give that term.",
       "Tokutei meisho-shu",
       ["tokutei meisho shu", "tokutei meishoshu", "tokutei meisho",
        "tokutei meisho sake", "special designation sake", "special designation"],
       "The tokutei meisho system took its present shape in 1990 and holds eight names: junmai, junmai ginjo, junmai daiginjo and tokubetsu junmai on the pure-rice side, honjozo, ginjo, daiginjo and tokubetsu honjozo on the other. Everything outside the eight is futsu-shu, which answers to far looser rules and fills most of the market."),

    # ---------------------------------------- Koji, moto and the ferment (4) --
    Q("Koji, moto and the ferment",
      "Steamed rice turns sweet in the koji room though no sugar has been added. Which enzyme, secreted by the mould as it grows into the grain, is doing the work?",
      ["Amylase", "Protease", "Lipase", "Invertase"], 0,
      "The mould, Aspergillus oryzae, ferments nothing itself; it secretes amylases as it grows through the grain, and the yeast drinks the glucose those enzymes release. Its proteases work alongside, cutting rice protein into the amino acids behind sake's savoury depth, but the road to alcohol starts at amylase."),
    Q("Koji, moto and the ferment",
      "Between the two traditional starter methods, the only real difference is a step in which workers grind steamed rice to a paste with long poles. Which method keeps that labour, and which gave it up?",
      ["Kimoto keeps the pole work; yamahai did away with it",
       "Yamahai keeps it; kimoto is the one that did away with it",
       "Both keep it; only sokujo abandoned the poles",
       "Neither does; both now acidify with a bottled addition"], 0,
      "Yamahai is short for yamaoroshi haishi, the abolition of the pole work, after brewers showed early in the twentieth century that the koji's own enzymes dissolve the rice without any mashing. Everything else the two methods share, including the slow wild acidification that leaves their sake broader, gamier and higher in acid than the modern norm."),
    SA("Koji, moto and the ferment",
       "Scaled up from the starter with further additions of rice, koji and water, the brew then ferments for weeks in its biggest tank. What is that fermenting mash called?",
       "Moromi",
       ["moromi", "moromi mash"],
       "The moromi runs three to five weeks at low temperature, saccharification and fermentation proceeding together in the one tank, which is how the strength climbs so high without any addition. Pressing it is what legally turns it into sake, and the solids the press holds back are the kasu."),
    SA("Koji, moto and the ferment",
       "The modern starter method takes its acidity from a bottle; kimoto and yamahai take theirs from organisms that drift in from the brewery's air and timbers. Name those organisms.",
       "Wild lactic acid bacteria",
       ["wild lactic acid bacteria", "lactic acid bacteria",
        "ambient lactic acid bacteria", "airborne lactic acid bacteria",
        "natural lactic acid bacteria", "naturally occurring lactic acid bacteria",
        "wild lactic bacteria", "lactic bacteria", "lactobacillus", "lab",
        "wild lactobacillus", "airborne lactic bacteria", "ambient lactic bacteria"],
       "A kimoto or yamahai starter spends its first weeks as an open ecology, nitrate-reducing bacteria first and then the lactic acid bacteria whose acid clears the field for the sake yeast. That month of succession is what sokujo's bottled lactic acid buys back, and losing it is why the quick starter reads cleaner and slimmer.",
       ex=True),

    # ------------------------------------------------ Nama, wood and age (3) --
    Q("Nama, wood and age",
      "Stored all summer unpasteurised, then given its single heat treatment only as it goes into the bottle: which label term fits that sake?",
      ["Namachozo", "Namazume", "Namazake", "Genshu"], 0,
      "Namachozo skips the usual first pasteurisation and keeps the one at shipping; namazume is its mirror, heated once going into storage and bottled raw, and hiyaoroshi, the autumn release, is namazume by another calendar. Only namazake skips both treatments, which is why it alone demands an unbroken cold chain from brewery to glass."),
    SA("Nama, wood and age",
       "Fresh from a few days in a newly coopered cask, a festival sake pours with a distinct resinous scent. Which wood put it there?",
       "Japanese cedar (sugi)",
       ["japanese cedar", "cedar", "sugi", "cryptomeria", "yoshino cedar",
        "japanese cedar sugi", "cedar sugi", "yoshino sugi"],
       "Taruzake takes its name from the taru, a cask of Japanese cedar classically cut in Yoshino in Nara, and days rather than weeks is the point, because the fresh wood gives up its resin fast. New Year and shrine celebrations are the style's home ground, where the cask lid is broken open with mallets at kagami biraki."),
    SA("Nama, wood and age",
       "Years in tank turn a sake amber and push its flavour toward soy, caramel and roasted nuts. Which reaction, between residual sugars and amino acids, is doing that?",
       "The Maillard reaction",
       ["maillard reaction", "maillard", "maillard browning",
        "amino carbonyl reaction", "amino carbonyl"],
       "Koshu carries both reactants in unusual quantity, glucose the ferment left behind and amino acids from the rice, so it browns at cellar temperature with no oxygen involved at all. That is what separates its ambering from the oxidative browning of an old wine, and why even a sealed, topped-up tank of it darkens anyway."),

    # -------------------------------------------- The meter and the acid (3) --
    Q("The meter and the acid",
      "Two bottles both read plus three on the sake meter value, yet one tastes markedly drier at the table. What most likely explains the difference?",
      ["Higher acidity in the drier one, unseen by the meter",
       "A misprint, since equal readings must taste identical",
       "Added alcohol in the drier one, which the meter reads as sugar",
       "Warmer storage of the sweeter bottle, building extra sugar"], 0,
      "The meter is a hydrometer, so residual sugar and density are all it can report, and acid never moves it. Acidity is what turns a given sugar level crisp or cloying on the palate, which is why the trade reads the two figures together and why quoting the meter value alone is guessing."),
    SA("The meter and the acid",
       "A guest wants the driest sake on the list, and the menu prints every bottle's meter value. Toward which end of the scale should the recommendation move?",
       "The positive end",
       ["positive end", "positive", "plus", "plus end", "positive side",
        "plus side", "positive numbers", "toward positive", "toward positive end",
        "toward plus", "toward plus end", "higher smv", "positive smv",
        "plus direction", "positive direction", "higher", "higher end",
        "high end", "higher numbers", "toward higher numbers", "up the scale",
        "into positive numbers", "plus territory", "positive territory",
        "higher sake meter value"],
       "Zero is anchored at the density of water: sugar-rich sake is denser and buoys the float higher, putting the waterline at the negative figures, while drier sake lets the float sink and the reading climbs into positive ones. Most premium sake sits between about minus two and plus ten, so a plus sign after the number is the quickest dryness signal a list can carry.",
       ex=True),
    SA("The meter and the acid",
       "Domestic labels print the sake meter value under its Japanese name. Give that name.",
       "Nihonshudo",
       ["nihonshudo", "nihonshu do", "nihon shudo", "nihon shu do"],
       "Nihonshudo reads literally as Japan sake degree, and export labels translate it as the sake meter value or SMV. Domestic bottles rarely translate it, so recognising the figure beside its plus or minus sign is one of the small literacies a floor sommelier actually uses."),

    # ------------------------------------------------- Rice and the toji (3) --
    Q("Rice and the toji",
      "Tanrei karakuchi, the light, clean, bone-dry ideal of Niigata brewing, leans on one rice variety that resists dissolving into the mash. Which variety?",
      ["Gohyakumangoku", "Yamada Nishiki", "Miyama Nishiki", "Koshihikari"], 0,
      "Bred in and for Niigata, Gohyakumangoku has a hard grain that melts reluctantly, so the ferment stays tidy and the sake comes out light and transparent, exactly the local ideal. Yamada Nishiki dissolves generously and builds broader, rounder sake, prized elsewhere and beside the point in tanrei country, while Miyama Nishiki plays a similar workhorse role in cold Nagano."),
    SA("Rice and the toji",
       "Discovered in Okayama in the mid nineteenth century and never crossbred since, the oldest brewing rice still in commercial use gives deep, earthy, herbal sake. Name it.",
       "Omachi",
       ["omachi", "omachi rice"],
       "About two-thirds of modern brewing rices, Yamada Nishiki among them, carry Omachi somewhere in their pedigree, but Omachi itself is a pure selection from a wayside find, never crossed with anything. It grows tall, ripens late and lodges in wind, and it repays the trouble with a broad, wild, savoury style that has a devoted following."),
    SA("Rice and the toji",
       "Hired for the season, one figure commands the brewery crew and answers for every tank while the owner keeps to the business side. Give that figure's title.",
       "Toji",
       ["toji", "master brewer", "head brewer", "toji master brewer",
        "brewmaster", "chief brewer"],
       "The toji system was seasonal labour: rice farmers travelled to the breweries after their own harvest, worked the winter under a master trained and placed by a regional guild, Nanbu and Echigo the largest, and went home in spring. Year-round hiring and owner-brewers are eroding the arrangement, but the title stays with whoever commands the brewhouse."),

    # ----------------------------------------------- Service and the law (3) --
    Q("Service and the law",
      "Somewhere on the list is a bottle that gentle warming will flatter rather than flatten. Which is the best candidate?",
      ["A yamahai junmai, savoury and high in acidity",
       "A junmai daiginjo prized for its fragile aroma",
       "A namazake kept chilled since pressing",
       "A lightly sparkling nigori finished sweet"], 0,
      "Warmth magnifies body and umami, and a yamahai's high acidity keeps the warmed sake in balance, which is exactly the yamahai trade; the same degrees strip the esters a daiginjo was fermented cold to keep. A sake that improves with heat is called kan-agari; namazake and anything carbonated are the reliable losers, one for stability and the other for obvious reasons."),
    Q("Service and the law",
      "In the United States a restaurant lists sake by the glass. What is the drink's standing under federal law?",
      ["Taxed as a beer but labelled under the rules for wine",
       "Taxed and labelled as a wine, exactly like a grape wine",
       "Taxed and labelled as a beer in every respect",
       "Treated as a spirit because of its strength"], 0,
      "The Internal Revenue Code writes sake into its definition of beer, since it is brewed from a grain, so it pays brewery excise; the labelling side runs under the Federal Alcohol Administration Act, which treats sake of seven percent or more like a wine. The split is why sake sits on wine lists and in wine competitions while being taxed like an ale."),
    SA("Service and the law",
       "Japan's Liquor Tax Act refuses the name seishu to any rice brew at or above a certain strength. Where does that ceiling sit?",
       "Twenty-two percent",
       ["twenty two percent", "22 percent", "22%", "22 per cent",
        "twenty two per cent", "under 22 percent", "below 22 percent",
        "less than 22 percent", "under twenty two percent",
        "below twenty two percent", "less than twenty two percent",
        "22", "twenty two", "22 percent abv", "22 abv", "22 percent alcohol",
        "22 percent alcohol by volume", "22% abv", "22 degrees",
        "twenty two degrees", "less than 22%", "under 22%", "below 22%"],
       "The same definition demands that the fermenting mash be strained, which is why doburoku, the unstrained farm brew, is legally not sake at all, and why even the murkiest nigori has passed through at least a coarse mesh. The ceiling is also the outer legal wall for undiluted genshu: a rice brew at twenty-two or above changes legal identity, though in practice the yeast gives out first and most genshu land between seventeen and twenty percent.",
       ex=True),
]
