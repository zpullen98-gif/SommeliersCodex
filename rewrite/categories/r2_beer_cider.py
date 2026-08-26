"""Rank II rewrite - Beer & Cider (20 questions: 7 MC, 13 short answer).

Certified level, written for a beverage director rather than a server. The
committed Rank I Beer category owns the families, the raw materials, the
ale/lager split and the numbers on a spec sheet, and it deliberately left cider
and the deeper chemistry alone; this category is what it left. Distilled apples
and pears belong to Spirits & Cocktails and stay out entirely. Nothing here
repeats a Rank I task.

The running order follows the questions as they reach a director's desk: first
what the brewhouse did to the wort, then what the fermenting room and the
cellar must do to the beer, then the wild Belgian tradition a serious list is
built around, then the orchard - the apple classes, the pear, and the three
cider cultures a program can be organised by - and last the service policies
the director actually signs.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards by check-similarity.py.

Accept lists are graded by lib.match_sa, the port of core.js matchSA, and were
verified by executing a scratch script against every list rather than by eye:
the displayed answer and natural phrasings of it must grade True, and every
wrong-but-adjacent real thing that could extend or truncate an entry must grade
False. No '~' entries appear anywhere. ex=True is applied only where a real,
different thing sits inside or alongside the answer - a bare 'spile' names the
sealing hard spile as readily as the porous soft one, and 'sweet' lives inside
'bittersweet' - and each ex list was then widened until article, plural and
phrasing variants of its own answer all still grade. The code is the record of
which questions those are.

Facts are restricted to ones that do not drift: process chemistry, settled
legal history, classification schemes and the service standards of long
traditions. The only numbers examined are ones written into the trade itself.
"""

from lib import Q, SA

CAT = "Beer & Cider"
SLUG = "r2-beer-cider"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("Hops, the kettle and the mash", 4),
    ("Fermentation and conditioning", 3),
    ("Cask against keg", 2),
    ("Lambic and gueuze", 3),
    ("Cider apples and perry", 3),
    ("Cider traditions", 3),
    ("Service policy", 2),
]

BANK = [
    # ------------------------------------- Hops, the kettle and the mash (4) --
    Q("Hops, the kettle and the mash",
      "Part of the mash is pumped to a separate vessel, boiled hard, and returned to lift the whole mass to its next rest temperature. Which mashing regime is that?",
      ["Decoction mashing", "Step infusion in a single heated tun",
       "Parti-gyle brewing", "Continuous sparging"], 0,
      "Boiling a portion of the grain drove the temperature steps in the centuries before thermometers, and it builds melanoidins an infusion mash never makes, which is why Czech and Bavarian brewers kept the labour long after it stopped being necessary. A step infusion reaches the same rests with hot water additions or heating coils, and never boils grain at all."),
    Q("Hops, the kettle and the mash",
      "This year's bales of a bittering hop assay at 2.9 percent alpha acid where last year's lot ran 4.2. To hold a flagship beer's bitterness on target, what does the head brewer scale?",
      ["The weight of the kettle charge, recalculated from the new assay",
       "The length of the boil, stretching it until the missing bitterness is extracted",
       "The fermentation temperature, warming it a degree",
       "The mash pH, dropping it with acidulated malt"], 0,
      "Alpha acid content moves with variety, farm and vintage, so bittering hops are bought and dosed by assay rather than by weight alone, and the charge is recalculated for every lot. Boil length does affect utilisation, but it is fixed by the brewhouse schedule and dragging it out moves colour and volume along with the bitterness."),
    SA("Hops, the kettle and the mash",
       "Saaz, Hallertau Mittelfrueh, Tettnang and Spalt sell at a premium in spite of unimpressive alpha acid figures, prized for fine, spicy aroma. Under which collective name does the trade group them?",
       "Noble hops",
       ["noble hops", "noble hop varieties", "noble varieties", "noble hop"],
       "Low alpha acid and a high share of delicate aromatic oils are what the term points at: hops grown for aroma rather than for bittering economy, and the signature of pilsner, helles and Czech lager. The American high-alpha varieties deliver bitterness far more cheaply, but they read citrus and resin, which is a different tradition altogether."),
    SA("Hops, the kettle and the mash",
       "Weeks after packaging, a heavily dry-hopped IPA measures stronger and drier than its release spec, and cans have begun to swell. Which phenomenon, introduced with the hops themselves, is at work?",
       "Hop creep",
       ["hop creep", "dry hop creep"],
       "Hop material carries enzymes that keep cutting unfermentable dextrins into sugars the yeast can eat, so fermentation quietly restarts inside the sealed package and alcohol, carbon dioxide and off-flavours all rise. Cold storage, earlier dry-hop timing or pasteurisation are the defences a production plan reaches for, and a buyer who cellars hazy IPA warm learns the hard way why the date code matters."),

    # ------------------------------------- Fermentation and conditioning (3) --
    Q("Fermentation and conditioning",
      "Printed proudly on a Munich brewery's menu, the word Reinheitsgebot invites a guest to ask what the 1516 decree still controls. What is the accurate answer?",
      ["It survives only through later German law binding domestic brewers; imports have been exempt since a European court ruling in 1987",
       "It was written into European Union law, so every beer brewed in a member state must comply with its ingredient list",
       "It binds every beer sold in Germany today, imported bottles included",
       "It lapsed entirely, leaving German brewers free of any ingredient rules"], 0,
      "The 1516 Bavarian text is a historical document; what operates now is Germany's provisional beer law of 1993, which holds bottom-fermented beer sold as Bier to malted barley, hops, yeast and water while allowing other malts and sugars in top-fermented styles. The European Court of Justice ruled in 1987 that purity rules could not be used to shut out beer lawfully made elsewhere, so the decree lives on as a domestic standard and a marketing story rather than as a general law."),
    SA("Fermentation and conditioning",
       "Near the end of a lager's primary fermentation the brewer lets the tank rise a few degrees and holds it there, so the yeast reabsorbs its own vicinal diketones before the long chill. What is that holding step called?",
       "Diacetyl rest",
       ["diacetyl rest", "vdk rest"],
       "Warm, active yeast takes the diacetyl it made during growth back up and reduces it to near-flavourless butanediol, and the reaction runs many times faster at eighteen degrees than at eight. Large plants confirm completion with a laboratory VDK assay before chilling, because the flavourless precursor still in the beer converts to diacetyl later, and no palate can taste what has not yet formed."),
    SA("Fermentation and conditioning",
       "Forbidden by its own purity rules from priming tanks with sugar, a Bavarian brewery carbonates by dosing finished beer with a measured share of vigorously fermenting young wort. Name the technique.",
       "Krausening",
       ["krausening", "krausened", "kraeusening", "kraeusened"],
       "The young beer at high krausen brings fermentable sugar and a fresh crop of healthy yeast, so the sealed tank carbonates naturally while the new yeast also scrubs residual compounds from the finished beer. The addition is nothing but beer in the making, which is what keeps the method legal where added sugar is not."),

    # ------------------------------------------------- Cask against keg (2) --
    Q("Cask against keg",
      "Delivered filtered bright, force-carbonated and sealed under gas, a firkin is refused a place on a festival's real ale bar. Which requirement did it fail?",
      ["It must still be conditioning on its own live yeast in the vessel it is served from, without applied gas pressure",
       "It must be dispensed through a handpump behind the bar, since gravity pours straight from the cask tap are not recognised",
       "It must be brewed from malted barley alone",
       "It must stay below five percent alcohol"], 0,
      "Real ale is defined by a secondary fermentation continuing in the container it is served from and by dispense without extraneous carbon dioxide, and a gravity pour straight from the tap qualifies exactly as a handpump does. Brewery filtration, force carbonation or gas pushing the beer to the tap each move it into keg territory, whatever the vessel looks like from outside."),
    SA("Cask against keg",
       "Two days before a cask goes on sale the cellar manager taps a porous peg into the shive and lets the excess condition hiss away through it. Name the peg.",
       "Soft spile",
       ["soft spile", "soft spiles", "porous spile", "porous spiles",
        "soft porous spile", "soft porous spiles", "porous soft spile",
        "porous soft spiles", "soft peg", "soft spile peg"],
       "The soft spile's porous bamboo or cane lets carbon dioxide escape while the beer drops bright on the stillage, and it is swapped for a sealing hard spile once condition is right, then again between sessions to hold what remains. That venting routine is the labour that separates cask from keg, and it is why a broached cask has a working life measured in days.",
       ex=True),

    # ------------------------------------------------ Lambic and gueuze (3) --
    Q("Lambic and gueuze",
      "Bales left to oxidise in an attic for three years, at a price no pale ale brewer would pay for fresh ones, are exactly what a Brussels lambic house orders. What is that hop charge for?",
      ["Preservation, with bitterness and aroma deliberately faded away",
       "A bargain source of bittering, since alpha acids concentrate as the bales dry",
       "The cheesy, oxidised note that defines the finished beer's aroma",
       "Colour, drawn from the browned leaf during the long boil"], 0,
      "A wort that will spend years fermenting needs the antiseptic side of the hop without its flavour, so lambic brewers hop heavily with bales whose alpha acids and oils have decayed to almost nothing. Fresh aromatic hops would fight the character the wild fermentation is meant to build, and their bitterness would sit badly in a beer this acidic."),
    SA("Lambic and gueuze",
       "Flour-cloudy wort, rich in raw starch and unfermentable dextrin, is exactly what a lambic brewhouse wants: rations for years of slow wild fermentation. Which mashing regime produces it?",
       "Turbid mash",
       ["turbid mash", "turbid mashing"],
       "Milky, starchy liquid is pulled off early in the mash and the grist leans on a large share of unmalted wheat, leaving material a clean single-strain fermentation could never use. The organisms that arrive over the following years in the barrel can, and the regime remains standard practice in every traditional lambic brewhouse."),
    SA("Lambic and gueuze",
       "One word, protected across the EU as a traditional guarantee, sits in front of Geuze or Lambik on serious lists and separates the old-method article from its sweetened, filtered namesakes. Which word?",
       "Oude",
       ["oude", "oude geuze", "oude gueuze", "vieille", "oude or vieille"],
       "Oude, vieille on French-language labels, is the traditional speciality guaranteed designation, and it requires the old method throughout: wholly spontaneous fermentation, real age in wood behind the bottle, and none of the sweetening and pasteurising the industrial versions lean on. On a list it is the single most reliable word for telling the sharp, cellarable article from the soda-sweet bottle at the same shelf height."),

    # ------------------------------------------ Cider apples and perry (3) --
    Q("Cider apples and perry",
      "Sharps, sweets, bittersharps and bittersweets: the traditional Long Ashton scheme files every cider apple into one of four classes. Which two juice measurements draw the boundaries?",
      ["Acidity and tannin", "Sugar and total acidity", "Sugar and tannin",
       "Pectin and nitrogen"], 0,
      "The thresholds sit near two grams a litre of tannin and four and a half of malic acid, and the two lines cut the fruit into four quadrants. Sugar hardly separates cider fruit at all, since nearly everything grown for the press ferments fully; what a blender is balancing is bite against structure."),
    SA("Cider apples and perry",
       "Low in malic acid and heavy in tannin, fruit of one class is the backbone of the classic West Country and Norman blends, giving a structure no dessert apple can. Which class is it?",
       "Bittersweet",
       ["bittersweet", "bittersweets", "bittersweet apples", "bittersweet apple",
        "bittersweet class", "bittersweet category", "bittersweet cider apples",
        "bitter sweet", "bitter sweets"],
       "Bittersharps carry the same tannin with high acid on top, sharps bring acid alone, and sweets bring neither, so the bittersweet quadrant is the only one that gives body and grip without turning the blend austere. Dabinett and Yarlington Mill are the varieties an orchardist would name first.",
       ex=True),
    SA("Cider apples and perry",
       "Even when every fermentable sugar is gone, a perry keeps a gentle sweetness, because pear juice carries a sugar alcohol that yeast cannot touch. Name it.",
       "Sorbitol",
       ["sorbitol"],
       "Sorbitol passes through fermentation untouched, so it survives into the driest perry as softness on the finish, along with the mildly laxative reputation older drinkers joke about. Pears also carry more citric acid than apples do, which is why a perry can taste brighter than a cider even while it finishes rounder."),

    # ------------------------------------------------- Cider traditions (3) --
    SA("Cider traditions",
       "Weeks pass in a Norman cider house while a brown pectin cap rises on the juice, the clear middle drawn off beneath it so starved of nutrients that the ferment crawls and stops sweet on its own. Name the technique.",
       "Keeving",
       ["keeving", "keeved", "defecation"],
       "Pectin sets into a gel that floats off with most of the yeast nutrients, and the cidermaker racks the clean juice from under the chapeau brun. A fermentation that cannot finish is the whole point: the sweetness of a traditional cidre doux is kept by starvation rather than by filtration, pasteurisation or anything added."),
    SA("Cider traditions",
       "Held at arm's length overhead, the bottle in an Asturian sidreria is crashed in a thin stream against the lip of a wide glass below, one short culin at a time, drunk off at once. Name that pour.",
       "Escanciado",
       ["escanciado", "escanciar", "escanciando", "throwing the cider"],
       "The long drop knocks carbon dioxide briefly out of solution, so a still, sharp sidra natural reaches the mouth with a fleeting sparkle it never had in the bottle. Pouring only a swallow at a time follows from the same physics, since the lift is gone within moments and the glass is meant to be emptied before it fades."),
    SA("Cider traditions",
       "Winter cold, not machinery, does the concentrating for most of Quebec's cidre de glace: autumn-pressed juice stands outdoors until the water locks up as ice and a dense syrup is drawn from beneath. Name that method.",
       "Cryoconcentration",
       ["cryoconcentration", "cryo concentration", "freeze concentration"],
       "Concentrating the juice before fermentation is what lets ice cider reach its weight of sugar and acid in a climate built for the job. The rarer route presses whole apples left hanging frozen on the tree, and Quebec's rules recognise both while insisting the cold be the winter's own rather than a freezer's."),

    # -------------------------------------------------- Service policy (2) --
    Q("Service policy",
      "Twelve degrees Celsius shows on the cellar thermometer, and a guest has just sent back a handpulled best bitter as too warm. What should the director's note to the floor team say?",
      ["The cellar is right: cask bitter is meant for eleven to thirteen degrees, and colder service mutes it",
       "Move the casks to the four-degree cold room with the lagers overnight",
       "Fit an in-line chiller so every pint reaches the glass at four degrees",
       "Apologise and take cask beer off the list for the summer months"], 0,
      "Cellar temperature is the style's specification rather than a refrigeration failure: at eleven to thirteen degrees the low carbonation and the malt read as intended, while at lager temperature the same beer tastes flat and empty. The guest-facing answer is a word of explanation and an offered alternative, not chilling a living beer into silence."),
    SA("Service policy",
       "Wide at the rim, usually stemmed, often printed with an abbey crest: one glass shape anchors the service standard for Trappist and abbey ales. Name the shape.",
       "Goblet",
       ["goblet", "chalice", "goblet or chalice", "chalice or goblet"],
       "A wide mouth lets the dense head settle to a thin cap and lifts the yeast and spice aromatics to the nose, and the open bowl gives a nine percent beer room to warm and unfold as it sits. The stem keeps the hand off the bowl, for the same reason it does on a wine glass: these are beers served closer to cellar than to fridge."),
]
