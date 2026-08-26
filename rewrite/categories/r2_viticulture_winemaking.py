"""Rank II rewrite - Viticulture & Winemaking (29 questions: 8 MC, 21 short answer).

Certified level, and deliberately the PRACTITIONER'S CHOICE rather than the
process. Rank I's Viticulture & Winemaking says what green harvest is; this asks
why the pass waits for veraison. Rank I's Winemaking Techniques says what a
punch-down does; this asks which vat gets the plunger and which gets the pump.
Every question is a decision a producer actually makes - a training system, a
rootstock, a leaf-pull calendar, a press cut, a stem percentage, a stave, a
stopping date - and the explanations price the decision where the price is the
point.

Three committed neighbours fence this module and the fences are recorded here so
they are not re-argued. r2_wine_fundamentals owns the chemistry, so tannin here
is a thing a press or a flame adds or spares, never a molecule. Terroir: Climate
& Soil owns rootstock as a SOIL verdict - the lime property, 110R's vigour, the
nematodes - so the rootstock block here is the catalogue decision instead: which
named stock answers which brief, and what each name records. The Rank I
categories own every basic definition, so no stem here asks what a thing is.
Tasks already committed elsewhere were found by grepping before writing and left
where they live: the assemblage timetable and soutirage to Rank II Bordeaux,
retrousse to Champagne, autolysis to two Rank I categories, demi-muid to
Producers & Icons, the gobelet and echalas keys to Rank I Rhone (so gobelet is
asked here as a why, never as a name), and the pergola family to Portugal, Spain
and South America.

The running order follows the producer's year: how the vine is trained, what it
is planted on, the summer's canopy and crop work, the press house, the
fermenting vat, and finally the barrel and the winter's lees.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards, by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and were
verified by executing a probe script: every displayed answer, several natural
phrasings, and every nameable wrong answer were run through the grader. ex=True
is used on five questions, each where a REAL and DIFFERENT thing extends,
inverts or truncates the right answer:

  cordon de royat   "double cordon de royat" is a real two-armed variant, and it
                    contains the whole answer.
  41B               a threshold-shaped designation with a digit, so containment
                    would grade "less than 41B"; and the bare containment branch
                    is the wrong tool for a catalogue code.
  SO4               the same shape for the same reason.
  shoot thinning    'budding' names bud grafting, a different operation, and it
                    sits inside 'disbudding'; only exact matching takes
                    disbudding while refusing its truncation.
  vin de presse     'press' is the stem's own bare noun and it sits inside both
                    'presse' and the English trade term 'pressings', so no
                    containment list can carry the trade term without handing
                    the stem word back.

Each ex list was then widened until the plain form, the spelled-out form and the
usual catalogue phrasings all still grade, because exact matching rejects
anything not written down. On vin de presse that widening is done with '~'
entries, the only ones in this category. A '~' entry is read before ex is
consulted and grades any answer CONTAINING that whole phrase, so "red press
wine", "first press wine" and "vin de presse or press wine" all still grade
while the bare "press" does not. Every one of them is two words after
normalising, because a one-word tilde grades that word anywhere in a wrong
answer and is no stricter than plain containment.

Elsewhere the hazards were closed by omission instead: no bare "guyot"
(ambiguous between single and double), no bare "thinning" (would grade the
crop-thinning it must be told apart from), no bare "scorch" ("leaf scorch" is a
different injury), no "racking" anywhere (it is an accept entry on Bordeaux's
soutirage), no "kiln" word near the seasoning list, no number-carrying entry on
puncheon (a "500 litre puncheon" entry let the stem's own "500 litre" score
through the input-inside-accept branch, while bare "puncheon" grades every real
phrasing of the format on its own), and no English "running off" on ecoulage,
which is the stem's own words handed back to a stem that asked for the French.

Two hazards are conceded rather than closed, because closing either one cost
correct answers and a wrongly rejected answer is the worse fault. Bare
"hardened" and bare "hardening" both stay on acclimatisation: they are the
primary English synonyms, and enumerating skin-specific phrasings in their place
rejected "hardened skins", "sun hardened" and "the skins are hardened". Bare
"topping" stays on hedging for the same reason, since dropping it rejected
"canopy topping", "mechanical topping" and "topping the vines". Each word can be
composed into a neighbouring answer, which is a point given away rather than a
point wrongly taken.

Facts are restricted to ones that do not drift: training geometry, rootstock
parentage, cooperage practice and the physics of a press. The numbers that
appear - 500 litres in a puncheon, the 2006 clearing of chips in the EU, forty
per cent active lime under 41B and about ten per cent under 3309C - are settled
specification and settled history rather than statistics.
"""

from lib import Q, SA

CAT = "Viticulture & Winemaking"
SLUG = "r2-viticulture-winemaking"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("Training systems and where each earns its keep", 5),
    ("Rootstock and planting material", 5),
    ("Canopy and crop decisions", 5),
    ("The press house", 4),
    ("Stems, caps and the working vat", 4),
    ("Oak and the elevage", 6),
]

BANK = [
    # ---------------- Training systems and where each earns its keep (5) -----
    Q("Training systems and where each earns its keep",
      "Neither post nor wire runs through an old Grenache vineyard on a windy, rainless Mediterranean plain, and the growers see no reason to change. What is the free-standing bush buying them?",
      ["A vine that carries itself, shades its own fruit and stands up to the wind, with nothing spent on posts or wire",
       "A larger crop than any trellised row could ripen, since every arm of the head is free to fruit",
       "Rows a mechanical harvester can straddle at speed, with no wires to snag its beaters on the way through",
       "Faster ripening, because a free-standing bush exposes every bunch to full sun"], 0,
      "Gobelet suits the dry and the windswept: a low, self-supporting head shrugs off gusts that would strain a trellis, and its umbrella of foliage keeps the worst of the sun off the bunches in a drought year. The costs are the mirror image - modest yields, awkward mechanisation, and in a damp climate a huddled canopy that invites rot - which is why the system stays southern."),
    SA("Training systems and where each earns its keep",
       "Every winter a pair of one-year canes is bent along the fruiting wire, one to each side of the head, and the rest of the wood is cut away. Name that training.",
       "Double guyot",
       ["double guyot", "guyot double", "the double guyot system",
        "double guyot training", "double guyot cane training"],
       "Guyot in either form is cane pruning: no permanent arm, the whole fruiting structure rebuilt from scratch each winter. The double form spreads the crop across two canes and suits wider spacing, which is why the Medoc classically trains it, while the single-cane form carries a smaller load on one wire and is the Cote d'Or's habit."),
    SA("Training systems and where each earns its keep",
       "One permanent horizontal arm carries a row of short spurs, and Champagne leans on it to hold Pinot Noir's natural yield down. Name the system.",
       "Cordon de Royat",
       ["cordon de royat", "royat", "the cordon de royat system",
        "cordon de royat training", "en cordon de royat",
        "trained en cordon de royat", "single cordon de royat", "royat cordon"],
       "The permanent cordon stores old wood and metes the vine out through spurs, which restrains vigour and holds the fruiting zone at one even height. Champagne permits four trainings and reaches for this spur-pruned one chiefly for its black grapes; a hard winter is its weakness, since a killed cordon takes years to rebuild where a cane system simply starts again.",
       ex=True),
    SA("Training systems and where each earns its keep",
       "Splitting one over-vigorous canopy down the middle, a trellis lifts the shoots in twin tilted curtains with a corridor of light between them. Name it.",
       "Lyre",
       ["lyre", "the lyre system", "lyre trellis", "lyre training", "open lyre"],
       "The divided canopy is an answer to fertile ground: rather than fight vigour, it doubles the leaf wall and opens the middle so light reaches fruit on both faces. Alain Carbonneau developed it in Bordeaux for exactly the deep soils that overwhelm a single curtain, and its price is a wide, expensive trellis that most machines cannot straddle."),
    SA("Training systems and where each earns its keep",
       "From Marlborough to Alsace the default trellis is the same: shoots tucked upward between paired foliage wires into one narrow green wall. Give its name.",
       "Vertical shoot positioning (VSP)",
       ["vertical shoot positioning", "vsp", "vertical shoot positioning vsp",
        "vertical shoot position", "vertical positioning", "vsp trellis",
        "vertical shoot positioning trellis", "vertically shoot positioned"],
       "One flat wall presents the fruit at a fixed height for spraying, trimming and machine picking, which is why it swept the world's moderate-vigour vineyards. Its limit is the same as its virtue: on rich ground a single plane cannot carry the growth, the wall stuffs itself with shade, and that is where the divided systems begin to pay."),

    # --------------------------- Rootstock and planting material (5) ---------
    Q("Rootstock and planting material",
      "Cool, rain-fed and lime-free: a grower replanting close-set Pinot Noir on deep loam asks the nursery for modest vigour and an early cycle. Which rootstock answers the brief?",
      ["3309 Couderc", "110 Richter", "140 Ruggeri", "1103 Paulsen"], 0,
      "3309C is a riparia and rupestris cross that damps growth and brings the fruit in early, which is what a cool site and close spacing want; in return it asks for reliable water and tolerates little active lime (about ten per cent), neither of which troubles this site. The other three are berlandieri and rupestris crosses built for drought and heat, and on a deep, watered soil they push growth the site never asked for."),
    SA("Rootstock and planting material",
       "Pure chalk with active lime beyond what almost any rootstock can stand made Champagne settle on a berlandieri cross whose other parent is a fruiting vinifera, Chasselas. Name it.",
       "41B",
       ["41b", "41 b", "rootstock 41b", "41b rootstock", "41 b rootstock",
        "41b millardet et de grasset", "millardet et de grasset 41b",
        "41b mgt", "mgt 41b"],
       "The vinifera half lifts its tolerance to roughly forty per cent active lime, far beyond the standard catalogue, and the berlandieri half brings enough phylloxera resistance for chalk, where the louse is in any case less aggressive. It is the price of the ground: a conventional American cross yellows and fails on such soils, so nearly the whole region sits on this one stock.",
       ex=True),
    SA("Rootstock and planting material",
       "Out of Sigmund Teleki's berlandieri-riparia seedlings, a German viticultural school selected the workhorse stock that now fills nursery catalogues worldwide, and its initials record the school's town. Give the designation.",
       "SO4",
       ["so4", "so 4", "selection oppenheim 4", "selection oppenheim no 4",
        "selection oppenheim number 4", "oppenheim 4", "so4 rootstock",
        "rootstock so4", "oppenheim selection 4", "s o 4",
        "selektion oppenheim 4", "selektion oppenheim no 4"],
       "Selection Oppenheim 4 took Teleki's Hungarian material and fixed a stock that grafts easily, takes most soils and advances ripening, which is what made it the default order. Its habits still matter at the margin: it roots shallow and runs thirsty in drought, and it is notorious for magnesium deficiency on light soils, which is why the default is not universal.",
       ex=True),
    SA("Rootstock and planting material",
       "Instead of ordering a thousand plants of one certified number, a grower spends the winter tagging his own best old vines and has the nursery graft cuttings from all of them. Name the practice.",
       "Massal selection",
       ["massal selection", "selection massale", "mass selection",
        "massale selection", "massal", "massale", "field selection"],
       "The bet is diversity: dozens of subtly different vines ripen, crop and fail differently, which steadies the whole block and keeps traits no single clone carries. The risk travels with the wood, since a tagged mother vine passes its viruses on, which is why serious estates test the marked vines before a knife touches them."),
    SA("Rootstock and planting material",
       "Rather than pull out a healthy vineyard of the wrong grape, the crew saws every vine back in spring and grafts buds of the new variety onto the established trunks, cropping again the season after. Name the operation.",
       "Top-working",
       ["top working", "top work", "top grafting", "field grafting",
        "grafting over", "graft over", "grafting the vineyard over",
        "reworking the vineyard", "vineyard reworking", "t budding",
        "chip budding", "changing variety by grafting"],
       "The roots and trunk stay, so the vine carries a small crop of the new variety in its second season, against the three or four barren years a replant costs. The trade is a graft union out in the weather on every single vine: takes fail, and a botched pass leaves a vineyard that is neither one thing nor the other."),

    # ------------------------------------ Canopy and crop decisions (5) ------
    Q("Canopy and crop decisions",
      "A June walk shows an obvious overcrop, yet the estate books its dropping pass for the week the berries turn colour. What does the delay buy?",
      ["A vine past compensating by swelling what it keeps, and laggard bunches that show themselves against the coloured crop",
       "Discarded fruit ripe enough to be sold off in bulk at the gate, so the pass pays for a share of its own labour instead of none of it",
       "A quicker job for the crew, since coloured bunches twist free of the shoot by hand where green ones must be cut",
       "Sweeter fruit left hanging, as sugar drains back out of the cut bunches into the vine"], 0,
      "Thinned early, a vine simply redirects into the crop it keeps, and berry size swells until much of the yield returns; at veraison that door is closing, and the bunches still green against coloured neighbours identify themselves as the ones to cut. The pass is priced accordingly - it is paid-for fruit dropped on the ground - which is why the decision is argued every year it is made."),
    SA("Canopy and crop decisions",
       "Morning-side leaves come off the fruiting zone in a hot region while the western face of every row keeps its cover. Which injury is the kept canopy there to prevent?",
       "Sunburn",
       ["sunburn", "sun burn", "sunscald", "sun scald", "sunburn of the fruit",
        "berry sunburn", "fruit sunburn", "sunburn damage", "sunburnt fruit",
        "sunburned fruit", "sun scorch", "sun scorching"],
       "East-facing fruit meets gentle light in the cool of the morning; the west side takes full sun in mid-afternoon, when air and berry are already at the day's peak heat, and exposed bunches cook. Stripping only the morning side buys the airflow and spray penetration the grower wanted while the afternoon face keeps its parasol, at no cost beyond telling the crew which side is which."),
    SA("Canopy and crop decisions",
       "Pulled at fruit set rather than at ripeness, fruiting-zone leaves leave the young berries in full light from the start, and their skins quietly prepare for the summer ahead. Name that response.",
       "Acclimatisation",
       ["acclimatisation", "acclimatization", "acclimation",
        "sun acclimatisation", "sun acclimatization", "sun acclimation",
        "hardened", "hardening", "sun hardening", "hardening off",
        "skin hardening",
        "the skins acclimatise", "they acclimatise", "acclimatising",
        "acclimatizing", "uv acclimation", "acclimatise", "acclimatize",
        "acclimatised", "acclimatized", "the berries acclimatise",
        "the skins harden"],
       "Skins exposed young thicken their cuticle and load protective pigments against ultraviolet, so the heat spike of the ripening weeks finds fruit already dressed for it. Unveil a shaded bunch at veraison and it has none of that armour, which is why the calendar of a leaf-pull matters as much as the fact of one."),
    SA("Canopy and crop decisions",
       "Weeks after budbreak, workers walk the rows rubbing surplus young shoots off head and trunk while the wood is still soft. Name the operation.",
       "Shoot thinning (ebourgeonnage)",
       ["shoot thinning", "shoot thinning ebourgeonnage", "ebourgeonnage",
        "disbudding", "debudding", "desuckering", "suckering", "epamprage",
        "bud rubbing", "shoot removal", "removing surplus shoots",
        "thinning the shoots", "removing shoots", "rubbing off shoots",
        "shoot thinning disbudding"],
       "It is the cheapest yield and balance decision of the year: a shoot rubbed off in spring costs a thumb's pressure, while the same correction made months later means cutting hardened wood or dropping grown fruit. The pass also chooses the vine's shape, since every shoot kept is a candidate cane or spur for next winter.",
       ex=True),
    SA("Canopy and crop decisions",
       "High summer finds a tractor shearing the tops and sides of every row where shoots have overgrown the wires and begun to flop. Name that operation.",
       "Hedging (rognage)",
       ["hedging", "rognage", "trimming", "shoot trimming", "summer trimming",
        "canopy trimming", "topping", "summer pruning",
        "hedging the canopy", "ecimage"],
       "A flopping canopy shades its own fruiting wire, so the trim keeps the wall upright and the light where it belongs, and it stops the vine spending on tips that no longer feed the bunches below. It is not free of consequence: every pass provokes lateral shoots, so a warm wet year can put the machine through four times, and each pass is diesel and hours."),

    # ------------------------------------------------ The press house (4) ----
    Q("The press house",
      "Minute by minute as the cycle climbs, the cellar master stands at the pan below the press tasting the Chenin as it runs. What is the tasting deciding?",
      ["Where one fraction ends and the next begins, as the juice turns broader, coarser and more phenolic",
       "When the last of the sugar has been squeezed from the skins, which is the signal that the press can finally stop and open",
       "Whether the load was ripe enough to be pressed at all, before the house commits the rest of the picking bins behind it",
       "How much rainwater the fruit took on board in the final week, and so how far the juice will need concentrating"], 0,
      "Early juice runs bright and delicate and the late squeeze turns broad and grippy, and no gauge reads that transition as reliably as a mouth. The cut diverts the flow to a separate tank, which keeps the decision reversible: fractions kept apart can be reunited at blending, while a coarse tail let into the fine tank can never be taken out again."),
    Q("The press house",
      "Days short of dryness, a couple of degrees Baume still on the gauge, a Syrah is pressed off its skins and run straight to barrel to finish. What is the cellar after?",
      ["A ferment that ends inside the wood, knitting the oak in while the wine is still warm and working",
       "A sweeter style, since pressing that early strands the last of the sugar in the wine unfermented",
       "More colour, since the skins give up their final charge of pigment only in the very last days before the wine falls dry",
       "Cleaner barrels at racking, because the yeast stay behind in the press with the skins rather than travelling"], 0,
      "Finishing the last of the sugar in barrel puts the most active phase of yeast work inside the wood, and wines handled that way tend to swallow their oak rather than wear it. The cost is vigilance, because a barrel is a poor place to warm or feed a ferment that falters, so the cellar commits only wines it trusts to run dry."),
    SA("The press house",
       "After the free-run has drained away, what the red press then yields is dark, structured and coarse, and it goes to a tank of its own under its own French name. Give that name.",
       "Vin de presse",
       ["~vin de presse", "~vins de presse", "~vin de presses",
        "~vin de press", "~vin de pressee", "~press wine", "~press wines",
        "~press fraction", "~press fractions", "~pressed wine",
        "~pressed wines", "pressings"],
       "One pressing can itself be split into first and hard fractions, each tasted on its own through the winter. The name matters at the blending bench: how much of it the final wine takes, and from which fraction, is decided cuvee by cuvee, and in a light year the answer is often more rather than less.",
       ex=True),
    SA("The press house",
       "Fermentation done, the valve opens and the new wine drains away from the soaked skins by gravity before anything goes near the press. Give the French cellar term for that running-off.",
       "Ecoulage",
       ["ecoulage", "decuvage", "devatting", "drawing off"],
       "What runs off under gravity is the vin de goutte, and everything the skins still hold goes to the press afterwards, so this is the moment the two identities part. Timing it is a real decision rather than housekeeping, because the day it happens ends the maceration as surely as any pressing schedule does."),

    # -------------------------------- Stems, caps and the working vat (4) ----
    Q("Stems, caps and the working vat",
      "Side by side in one cellar stand small open-top vats of delicate Pinot Noir and a sixty-tonne closed tank of contract Cabernet. Which cap regime belongs to which vessel?",
      ["Punch-downs for the small open Pinot vats, pump-overs for the sixty-tonne tank",
       "Pump-overs for the Pinot and punch-downs for the tank, since a plunger tells you more the bigger the cap it works",
       "Rack-and-return for the Pinot and nothing for the tank, whose sheer depth keeps the cap wet without any help",
       "Pump-overs for both wines, since one regime across the whole cellar keeps the crew on a single routine"], 0,
      "A plunger is a gentle, human-scaled tool: it needs an open top and a cap it can actually reach through, which is what a small vat of delicate fruit offers, and putting the hose on that vat instead would work its fruit harder for nothing. At sixty tonnes no arm reaches anything, and the tank's own pump moving wine from valve to spray head is the cap work that scales, so the vessel and the wine's constitution make the choice together."),
    SA("Stems, caps and the working vat",
       "Lying on its side, a closed steel drum turns the whole red ferment on a programmed schedule, tumbling skins through wine with no cellar hand near it. Name the vessel.",
       "Rotary fermenter",
       ["rotary fermenter", "rotary fermenters", "roto fermenter",
        "rotary fermentation tank", "rotary vinifier", "roto vinifier",
        "rotary fermentor", "roto fermentor", "rotary tank",
        "rotary drum fermenter", "rotating fermenter", "vinimatic"],
       "Tumbling is relentless, so extraction runs fast and complete, and one operator can run a battery of drums through a vintage, which is why the machine lives in high-volume red programmes. What it cannot do is be gentle: fruit meant for perfume and silk is worked far too hard in a drum, which is why the same building often keeps open vats standing beside them."),
    SA("Stems, caps and the working vat",
       "Snapping and chewing a stem from every block, the winemaker sets this year's whole-bunch percentage only after the green has gone out of the wood. Name what the stems have done.",
       "Lignification",
       ["lignification", "lignified", "stem lignification", "lignifying",
        "become lignified", "turned woody", "gone woody", "become woody",
        "stem ripening", "stem ripeness", "ripened"],
       "Green stems trade in bitterness and a vegetal edge; brown, woody ones give the spice, lift and structural frame that make cluster work worth doing at all. That is why the number is set vat by vat and year by year rather than by recipe, and why a cold season can push a habitual sixty per cent down to twenty."),
    SA("Stems, caps and the working vat",
       "Twice a day through the ferment, someone floats a weighted glass spindle in a cylinder of must and charts how deep it sits. Name the instrument.",
       "Hydrometer",
       ["hydrometer", "densimeter", "density meter", "mustimeter",
        "saccharometer", "areometer"],
       "Density falls as sugar becomes alcohol, so the readings draw the fermentation curve, and a curve that flattens early is the first warning of a ferment about to stick. The refractometer that served at picking is useless here, because alcohol bends light on its own account and wrecks the reading."),

    # ---------------------------------------------- Oak and the elevage (6) --
    Q("Oak and the elevage",
      "Less grip from the wood but more roast and spice in the nose: a winemaker orders the same barrels a level darker in toast. Why is that order not a contradiction?",
      ["Deep toasting breaks the wood's own tannins down even as it cooks up the roasted aromatics",
       "Darker toast chars a seal onto the inside of the stave, so the wood gives the wine nothing at all",
       "Toast and tannin come from different staves in the barrel, blended to order by the cooper",
       "The longer fire dries the staves far harder, and bone-dry wood keeps its tannin locked away from the wine"], 0,
      "Fire degrades the tannins in the surface layers of the stave while it cooks sugars and lignin into vanilla, spice and smoke, so grip and toast character move in opposite directions as the flame runs longer. The same toast scale is quoted on the chips and staves the EU cleared in 2006, which sell the flavour spectrum without the barrel or its slow oxygen, at a fraction of the cost."),
    SA("Oak and the elevage",
       "Planted on Colbert's orders to grow ship timber for the navy, one forest in the Allier now sells the slowest-grown, finest-grained oak a cooper can buy. Name it.",
       "Troncais",
       ["troncais", "foret de troncais", "troncais forest", "troncais oak"],
       "The plantation outlived the age of sail and became cooperage's benchmark: sessile oak crowded tight on poor soil grows slowly, and slow growth lays down the narrow rings that release aroma and tannin gently over an elevage. Bought stave by stave, the name on the invoice is as much a price as a place."),
    SA("Oak and the elevage",
       "Fast-grown pedunculate oak from one region of western France is so wide-ringed and tannin-rich that fine-wine coopers pass it over, and the brandy houses take nearly the whole harvest. Name the region.",
       "Limousin",
       ["limousin", "limousin oak", "limousin forest", "limousin region"],
       "Open stands on richer ground grow fast, and fast growth means wide rings, coarse grain and a heavy load of extractable tannin, which is an asset in a spirit that will sit in wood for decades and a liability in most wine. Cognac's cellars absorb the supply, which is why the name appears far more often on a brandy specification than on a wine cellar's barrel bill."),
    SA("Oak and the elevage",
       "Stacked in open pallets in the cooper's yard, rough-sawn staves sit under rain, sun and frost for a couple of years before a saw or a flame touches them. Name that stage.",
       "Seasoning",
       ["seasoning", "air seasoning", "open air seasoning", "natural seasoning",
        "air drying", "open air drying", "weathering", "stave seasoning",
        "seasoning the staves", "yard seasoning"],
       "The yard does two jobs at once: the wood dries to workable moisture, and rain and resident fungi leach and soften the harshest of its raw tannins, mellowing what the barrel will later give. A kiln can manage only the first job in a fraction of the time, which is why yard-seasoned wood commands the premium and specifications quote the months spent out in the weather."),
    SA("Oak and the elevage",
       "More than double a barrique in one cask, the 500-litre format lets Syrah producers buy oak's slow breathing without its vanilla shouting. Name the format.",
       "Puncheon",
       ["puncheon", "puncheons", "puncheon cask", "puncheon casks",
        "puncheon barrel", "puncheon barrels"],
       "More than doubling the volume cuts the wood surface each litre of wine touches by roughly a quarter, so flavour and oxygen both arrive at a gentler pace and the fruit stays in front. Syrah cellars from the northern Rhone to the Barossa lean on the size for exactly that restraint, often buying it new where a new barrique would shout."),
    Q("Oak and the elevage",
      "Creamy and broad by the new year, the barrels of Chardonnay lose their weekly stirring, and the rod is put away until the next vintage. What is the cellar protecting by stopping?",
      ["The acid line and the aromatic lift, which every further pass of the rod would trade away for breadth",
       "The lees themselves, which too much stirring would exhaust long before the wine has taken everything they have to give",
       "The malolactic bacteria, which the rod would scatter before the conversion has run its course",
       "The staves, which the rod scores a little more with every pass until the barrel begins to weep"], 0,
      "Stirred lees keep feeding texture, and past a point the wine grows broader than it is long, so the stopping date is a style decision made by taste rather than by calendar. Each pass also lifts the oxygen the wine sees, and a barrel roused too long and too often ends up rounder, deeper in colour and shorter-lived than the wine the vineyard sent in."),
]
