"""Rank II rewrite - California (40 questions: 18 MC, 22 short answer).

Certified level, pitched deliberately above the Rank I "United States" category.
Where Rank I asks how much fruit an AVA name requires, this hands the student a
blend that misses the figure and asks what is left to print; where Rank I says
Howell Mountain sits above the fog, this asks what the ground there is made of.
The Rank I bank was read first and nothing here repeats one of its tasks. Oregon,
Washington and New York are left alone: a later Rank II category owns them.

The running order follows the state from the label inwards - first what an
American appellation does and does not promise, then Napa floor, Napa hills,
Sonoma, the Central Coast north to south, the inland old-vine country, and last
the three events that made the modern industry.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and were
run through it rather than eyeballed. Exactly one answer uses '~' entries and
both of them run to three words, because a one-word tilde grades that word
anywhere in a wrong answer while a phrase that long cannot appear in an answer
that does not already name the place. Two answers needed deliberate narrowing:
"Napa Valley" does NOT accept a bare "Napa", because Napa County is a real and
different - and in that question wrong - appellation, and the Carneros list
accepts the place name only, never the bare word "valley".

A later pass closed four lists that graded words a student could read straight
off the stem. Three lost their long trailing entries, which carried nothing the
short form did not already grade by containment: "goldridge sandy loam" let a
bare "sandy loam" through, "chalone appellation" let "one appellation" through
on the substring branch, and both of the Templeton Gap entries naming the Santa
Lucias let a piece of the stem through. Note the shape of that last one: cutting
the first entry only exposed the second, since a truncation that clears the
word-count ratio grades against any long entry it sits inside, so the fix is to
stop appending the stem's own scenery to an accept list rather than to trim one
entry and stop.

Santa Lucia Highlands could not be closed by deletion at all, because the carrier
was the answer itself and the stem names the Santa Lucia range a few words
earlier. Read that list with lib.match_sa open, because the pairing of ex=True
with '~' entries is the whole of it: ex=True kills the truncation and containment
branches, so a bare "santa lucia" copied off the stem no longer scores, while the
tilde branch is tested BEFORE ex is consulted and so keeps whole-phrase
containment alive. "Santa Lucia Highlands, Monterey County", "Santa Lucia
Highlands (SLH)" and "the Santa Lucia Highlands of Monterey" all still grade.
A first attempt at this closed the echo with a bare ex=True over an enumerated
list instead, and that rejected nine correct phrasings, because a place name
takes a trailing qualifier and no enumeration of those qualifiers is ever
finished. Where the class of right answers is open, the tilde is the tool and the
enumeration is the trap. The explanation carries a closing line separating the
range from the appellation, since that distinction is what the question now
actually tests.

Facts are restricted to ones that do not drift. No ownership, no acreage, no
production shares and no appellation approved in the last few years; geology,
geography, elevation floors, label law and history carry the weight.
"""

from lib import Q, SA

CAT = "California"
SLUG = "r2-california"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("AVA law and the American label", 5),
    ("Napa Valley floor", 5),
    ("Napa's mountains and Carneros", 5),
    ("Sonoma County", 6),
    ("Santa Cruz Mountains and Monterey", 5),
    ("Paso Robles and San Luis Obispo", 3),
    ("Santa Barbara County", 4),
    ("Sierra Foothills and Lodi", 4),
    ("Phylloxera, Paris and the modern trade", 3),
]

BANK = [
    # -------------------------------------- AVA law and the American label (5) -
    Q("AVA law and the American label",
      "State law obliges any wine using a Napa sub-appellation such as Oakville or Rutherford to print Napa Valley on the same label. What is that requirement called?",
      ["Conjunctive labeling", "Nested appellation disclosure", "Appellation transfer",
       "Compound origin marking"], 0,
      "Nothing federal demands it: the TTB approves an AVA boundary and then says nothing about how the name is used alongside a larger one. California legislated it to stop the parent name being diluted by sub-appellations trading on their own, and Sonoma County growers later won the same protection for theirs."),
    Q("AVA law and the American label",
      "A back label reads Produced and Bottled by, followed by a winery name and its town. How much of the wine must that winery have fermented itself?",
      ["Seventy-five percent of it", "Fifty-one percent of it", "Eighty-five percent of it",
       "All of it"], 0,
      "Produced and Made are the two phrases that carry a fermentation threshold, and the federal rule sets both at 75 percent fermented at the stated address. Cellared and Bottled by, Vinted and Bottled by or Prepared and Bottled by cover wine bought in finished and merely given cellar treatment there, and Blended and Bottled by means only that wines of the same class and type were mixed at that address. None of those four tells the guest who actually made it."),
    SA("AVA law and the American label",
       "Eighty percent of a blend comes off Rutherford and the remaining fifth off Oakville, so neither sub-appellation may go on the label. What is the tightest appellation this wine may still claim?",
       "Napa Valley",
       ["napa valley", "napa valley ava", "napa valley appellation"],
       "An AVA name needs 85 percent of the fruit from inside its boundary, and no single sub-appellation clears that here. Both benches sit wholly inside Napa Valley, however, so the parent AVA is satisfied at 100 percent and is the tightest claim left. Dropping to Napa County or to California would be legal but needlessly vague.",
       ex=True),
    SA("AVA law and the American label",
       "Federal rules would happily let a wine calling itself Sonoma County carry a quarter of its fruit from outside the state altogether. A California statute shuts that door. What does the state demand instead?",
       "One hundred percent California grown",
       ["one hundred percent california grown", "100 percent california grown",
        "100% california grown", "100% california", "100 percent california",
        "one hundred percent california", "100% california grapes", "100% california fruit",
        "100 percent california grapes", "100 percent california fruit",
        "all california grapes", "all california fruit", "entirely california grown",
        "all of the fruit must be grown in california", "every grape must be grown in california",
        "all the grapes must come from california", "all the grapes must be grown in california",
        "all of the grapes must be grown in california", "the grapes must all be grown in california",
        "every grape must come from california", "all the fruit must come from california",
        "all the fruit has to come from california", "all fruit grown in california",
        "every grape grown in california", "100% of the grapes must be grown in california",
        "100% of the fruit must be grown in california", "100% of the grapes must be from california",
        "100 percent of the grapes must be grown in california",
        "one hundred percent of the fruit from california",
        "one hundred percent of the grapes from california",
        "every grape has to be grown in california", "all of the fruit has to be grown in california",
        "the wine must be entirely from california grapes", "one hundred percent californian fruit"],
       "Federal law asks only 75 percent for a county or state name, which would let a Sonoma County bottling be topped up from anywhere. California overrides that: a wine carrying any Californian appellation of origin must be made entirely from Californian fruit. It is one of several places where state law is stricter than the federal floor rather than merely different from it.",
       ex=True),
    SA("AVA law and the American label",
       "Fruit grown in one state is blended in a cellar with fruit from another, leaving the broadest appellation on the books as the only one available. What may the label no longer state?",
       "The vintage",
       ["vintage", "vintage date", "vintage year", "year of harvest", "harvest year",
        "harvest date", "the year the grapes were harvested", "the year the grapes were picked"],
       "Two or three states that are contiguous can share an appellation of their own, with the percentage from each printed on the label, and a wine carrying it keeps its vintage. Where that is not available the wine falls back to American, which is a country-level appellation, and a vintage date is permitted only when the appellation is something other than a country. So the harvest year is the price of the fallback. It is a useful reminder that the appellation on an American label controls far more than geography."),

    # ------------------------------------------------------ Napa Valley floor (5)
    Q("Napa Valley floor",
      "Afternoon air off San Pablo Bay passes bare volcanic palisades that give the day's heat back after dark, and the Cabernet grown beneath them is the valley's most supple. Which appellation is this?",
      ["Stags Leap District", "Yountville", "Oak Knoll District", "St. Helena"], 0,
      "The rock face on the eastern side stores heat and radiates it into the night while the bay air holds the afternoons in check, and the wines are the softest-textured of Napa's Cabernet districts. The appellation is spelled without an apostrophe, a compromise reached because two neighbouring wineries both used one in their own names."),
    Q("Napa Valley floor",
      "Andre Tchelistcheff arrived at Beaulieu in 1938 and spent decades insisting that one stretch of valley floor grew Napa's finest Cabernet. Which appellation did he champion?",
      ["Rutherford", "Calistoga", "Chiles Valley District", "Wild Horse Valley"], 0,
      "It takes Rutherford dust to grow great Cabernet is the line attributed to him, describing the fine, dusty grain of tannin off the alluvial fans on the western side of the river. His influence reaches well past one appellation: he brought controlled cold fermentation and deliberate malolactic conversion to California and trained most of the next generation of winemakers."),
    SA("Napa Valley floor",
       "Hamilton Crabb planted a bench on the western side of Oakville in the 1860s and gave it a Greek name meaning the highest beauty. Which vineyard is that?",
       "To Kalon",
       ["to kalon", "to kalon vineyard", "tokalon", "to kalon in oakville"],
       "The bench is an alluvial fan spilling off the Mayacamas, deep and gravelly enough that the fruit ripens evenly across a large block, which is why so many separate bottlings come off it. The name has been fought over in trademark court precisely because more than one label carries it."),
    SA("Napa Valley floor",
       "At its northern end the valley narrows sharply beneath Mount St. Helena, and daytime highs on that stretch of floor run the warmest in Napa. Which appellation sits in the neck?",
       "Calistoga",
       ["calistoga", "calistoga ava", "calistoga appellation", "calistoga in napa valley"],
       "Heat by day is only half of it: cold air drains down off the mountain and in from Knights Valley at night, so the diurnal swing is wide despite the highs. The soils are volcanic sediment and ash washed off the surrounding hills rather than the river gravel of the mid-valley benches."),
    SA("Napa Valley floor",
       "A horseshoe of low hills east of the city of Napa opens straight onto San Pablo Bay, and Cabernet there ripens weeks behind Oakville's. Name that appellation.",
       "Coombsville",
       ["coombsville", "coombsville ava", "coombsville appellation",
        "coombsville in napa valley"],
       "Nothing stands between it and the water, so bay air arrives undiluted and it is one of the coolest corners of Napa, cooler than any mid-valley bench and behind only Carneros itself. The soils are ash and tuff shed by the long-collapsed Mount George volcano, free-draining and poor, and the wines come in leaner and higher in acid than the mid-valley norm."),

    # ------------------------------------------ Napa's mountains and Carneros (5)
    Q("Napa's mountains and Carneros",
      "One Napa mountain appellation is planted on uplifted marine sandstone and shale, and fossil seashells turn up between its vineyard rows. Which one?",
      ["Mount Veeder", "Howell Mountain", "Atlas Peak", "Diamond Mountain District"], 0,
      "The Mayacamas expose old Franciscan seabed here rather than the volcanic material that dominates the ranges either side of the valley. The soils are thin, acidic and low in vigour, which gives tiny berries and a severe young tannin that needs a decade, and it is the standard contrast drawn against the ash and tuff of the Vaca side."),
    Q("Napa's mountains and Carneros",
      "Glittering fragments of volcanic rock in the soil gave a Mayacamas appellation above Calistoga its name. Which appellation?",
      ["Diamond Mountain District", "Chiles Valley District", "Oak Knoll District",
       "Yountville"], 0,
      "The soils are weathered volcanic ash and tuff, red, sharp-draining and shot through with the fragments the name records. It occupies the northern end of the Mayacamas above the warmest part of the valley floor, and the wines are dark and firmly built even by mountain standards."),
    SA("Napa's mountains and Carneros",
       "Water rising out of the Mayacamas hillside above St. Helena named the district planted there, and its vineyards sit in clearings cut from forest rather than in continuous blocks. Name it.",
       "Spring Mountain District",
       ["spring mountain district", "spring mountain", "spring mountain district ava",
        "spring mountain district in napa"],
       "It faces the Pacific weather first and is the wettest corner of Napa, so dry farming is realistic there in a way it is not on the valley floor. Its geology is a patchwork of sedimentary and volcanic material rather than one or the other, which is why it resists the neat characterisation its neighbours get."),
    SA("Napa's mountains and Carneros",
       "A Vaca-range appellation above St. Helena farms a deep red iron-rich volcanic loam alongside a pale weathered ash that locals miscall tufa. Which appellation?",
       "Howell Mountain",
       ["howell mountain", "howell mountain ava", "howell mountain appellation",
        "howell mountain in napa"],
       "The red material is Aiken loam, weathered from old lava flows and unusually deep for a mountain site. The pale material is properly tuff, consolidated volcanic ash; tufa is a calcareous spring deposit and has nothing to do with volcanoes, so the local usage is a misnomer that has stuck. Both soils are poor, acidic and free-draining."),
    SA("Napa's mountains and Carneros",
       "Sheep grazed the low hills where Napa and Sonoma counties run down to the bay long before vines did, and the appellation there still carries the Spanish word for them. Name it.",
       "Los Carneros",
       ["los carneros", "carneros", "los carneros ava", "carneros ava"],
       "Carneros is Spanish for rams. The boundary was drawn around the reach of the cold bay air rather than around a county line, so the same appellation appears on Napa labels and Sonoma labels alike. Shallow clay sitting on a dense hardpan keeps roots near the surface and vigour naturally low."),

    # ---------------------------------------------------------- Sonoma County (6)
    Q("Sonoma County",
      "Pale soil underfoot named one Sonoma appellation, though a geologist would not call the material chalk at all. What is it?",
      ["Volcanic ash", "Diatomaceous earth", "Kimmeridgian marl", "Wind-blown loess"], 0,
      "The white ash weathered out of the Sonoma Volcanics and simply looks chalky to the eye. There is no limestone beneath it, so none of the calcareous virtues the name implies are actually in play, and the appellation sits in the warmer northeastern corner of the Russian River Valley, nested wholly inside it."),
    Q("Sonoma County",
      "Fog lingers longest over one small appellation nested inside the Russian River Valley, on sandy loam that drains fast and holds vine vigour down. Which one?",
      ["Green Valley of Russian River Valley", "Chalk Hill",
       "Pine Mountain-Cloverdale Peak", "Fountaingrove District"], 0,
      "It occupies the southwestern corner of the parent AVA, closest to the ocean and to the wind gap south of it, and is the coldest and latest-ripening part of the whole zone. The full name carries the parent appellation because another Green Valley already exists in Solano County, and two AVAs may not share a bare name."),
    Q("Sonoma County",
      "A grower on a ridge within sight of the Pacific and a grower on warm flats near Carneros may print exactly the same Sonoma appellation. Which one is drawn that broadly?",
      ["Sonoma Coast", "Dry Creek Valley", "Northern Sonoma", "Sonoma Valley"], 0,
      "It was drawn wide in the 1980s so that estates holding vineyards in several parts of the county could use a single name, and the result spans climates no one label can honestly describe. Fort Ross-Seaview, high on the ridges above the ocean and above the fog line, was later carved out of it for exactly that reason."),
    SA("Sonoma County",
       "Fine sandy loam weathered out of an uplifted seabed underlies the western Russian River Valley and is the soil named most often on a Sonoma Pinot Noir back label. Name it.",
       "Goldridge",
       ["goldridge", "gold ridge", "goldridge soil"],
       "It is a light, free-draining loam over sandstone, low in nutrients, so vines set small crops without much persuasion and roots run deep chasing water. The eastern side of the valley runs to heavier clay loams that hold water and push vigour, and growers treat the two as separate farming problems on the same appellation."),
    SA("Sonoma County",
       "High above Lake Sonoma, one appellation admits no vineyard below eight hundred feet, which puts every acre of it clear of the fog. Name it.",
       "Rockpile",
       ["rockpile", "rockpile ava", "rockpile appellation", "rockpile in sonoma county"],
       "An elevation floor written into the boundary is the same device Howell Mountain uses in Napa, and it guarantees full sun and warm nights above the marine layer. The ground is steep, rocky and poor, planted almost entirely to Zinfandel and Cabernet Sauvignon, and the fruit is trucked out because there is nowhere up there to crush it."),
    SA("Sonoma County",
       "A long break in the coastal hills between Bodega Bay and San Pablo Bay funnels wind rather than merely fog, and the appellation drawn around it rests on that wind. Name it.",
       "Petaluma Gap",
       ["petaluma gap", "petaluma gap ava", "petaluma gap appellation",
        "petaluma gap in sonoma", "petaluma wind gap"],
       "Wind was the distinguishing feature the petition argued from, which no American appellation had leaned on before. Persistent afternoon wind thickens skins and shuts photosynthesis down, so fruit hangs late and arrives small-berried, dark and high in acid. The gap crosses the county line into Marin, so the appellation does too."),

    # ---------------------------------------- Santa Cruz Mountains and Monterey (5)
    Q("Santa Cruz Mountains and Monterey",
      "Rather than following ridgelines or county lines, one California appellation is bounded by a contour, so a vineyard either sits high enough to qualify or it does not. Which appellation?",
      ["Santa Cruz Mountains", "Sierra Foothills", "San Benito", "Livermore Valley"], 0,
      "The boundary is drawn largely along the fog line: roughly 400 feet on the ocean side and 800 feet on the bay side, the higher figure needed inland because the marine layer lies deeper there, with roads and section lines closing the stretches where no contour serves. It was among the first American appellations defined by elevation rather than by administrative boundary, and it takes in parts of three counties."),
    Q("Santa Cruz Mountains and Monterey",
      "Cold water lies unusually close inshore at Monterey Bay, and the wind that pours up the valley behind it is fiercer than at any comparable latitude. Which offshore feature keeps that water cold?",
      ["A submarine canyon close to the shore",
       "A chain of offshore islands", "A warm counter-current running north",
       "A shallow sandbar across the bay mouth"], 0,
      "The canyon is one of the deepest on the continental margin and its head reaches almost to the shoreline at Moss Landing, so it brings cold water from far below the surface within reach of the shore. The Salinas Valley opens straight onto it, so the afternoon wind is strong enough that row orientation and trellis height are planned around it rather than around sunlight."),
    SA("Santa Cruz Mountains and Monterey",
       "Rounded river stones the size of a fist litter one Monterey appellation, and growers there call them Greenfield potatoes. Name that appellation.",
       "Arroyo Seco",
       ["arroyo seco", "arroyo seco ava", "arroyo seco appellation",
        "arroyo seco in monterey county"],
       "The cobbles were dropped by the river as it left the Santa Lucia range, and they store heat through the day and give it back at night in a valley that is otherwise cold and wind-scoured. That stored warmth is why aromatic whites ripen there while Pinot Noir does better on the benches above."),
    SA("Santa Cruz Mountains and Monterey",
       "Terraces cut into east-facing benches of the Santa Lucia range sit above the worst of the Salinas Valley wind and have become Monterey's most sought-after Pinot Noir ground. Name that appellation.",
       "Santa Lucia Highlands",
       ["~santa lucia highlands", "~santa lucia highland", "slh"],
       "Facing east means the fruit takes the morning sun and is then shaded as the wind builds, which is the reverse of the usual hillside logic and exactly what that valley needs. The benches are gravelly alluvial fans, far better drained than the deep silt of the valley floor below them. Note that the range and the appellation are not the same thing: the Santa Lucias run most of the length of the Central Coast, while the appellation is the strip of benchland on their eastern flank.",
       ex=True),
    SA("Santa Cruz Mountains and Monterey",
       "Limestone is scarce under California vineyards, but one appellation high on the Gabilan range east of the Salinas Valley is built on it and on decomposed granite. Name it.",
       "Chalone",
       ["chalone", "chalone ava", "chalone in monterey county"],
       "The Gabilan range carries a band of limestone that surfaces here and again at Mount Harlan across the county line, which is why the two are so often named in the same breath. Vineyards sit around 1,800 feet, above the fog and clear of the valley wind, on ground poor enough that yields stay minute without any deliberate restriction."),

    # ------------------------------------------ Paso Robles and San Luis Obispo (3)
    Q("Paso Robles and San Luis Obispo",
      "Paso Robles is picked across a spread of dates wide enough for two separate regions, and the divide runs along the Salinas River. Which half is the cooler and later one?",
      ["The west side, on calcareous shale reached by marine air",
       "The east side, on deep alluvial soils well away from the fog",
       "The northern end, where elevation runs highest",
       "The southern end, nearest the Cuesta Grade"], 0,
      "Marine air comes through a break in the Santa Lucia range and reaches the western hills first, so they ripen later and hold acidity while the eastern flats bake and finish early. Those western soils are pale and strongly calcareous, weathered out of the Monterey Formation. The appellation was eventually divided into eleven sub-appellations because a single description of it had stopped meaning anything."),
    SA("Paso Robles and San Luis Obispo",
       "Marine air reaches the western half of Paso Robles through a single break in the Santa Lucia range. Name that break.",
       "The Templeton Gap",
       ["templeton gap", "gap at templeton"],
       "Cold air off Morro Bay pushes through in the afternoon and evening and can drop temperatures thirty degrees Fahrenheit or more overnight, which is why the west side behaves like a different region from the east. Gaps of this kind are the whole story of cool-climate viticulture in a state that is otherwise walled off from its own ocean."),
    SA("Paso Robles and San Luis Obispo",
       "A small San Luis Obispo appellation takes an unobstructed sweep of marine air funnelled in from Morro Bay through the Los Osos Valley, and records one of the longest growing seasons in California. Name it.",
       "Edna Valley",
       ["edna valley", "edna valley ava", "edna valley appellation",
        "edna valley in san luis obispo"],
       "The bay itself lies some fifteen miles to the northwest, but the Los Osos gap is a wide mouth and the hills around the valley hold what comes through it, so daytime highs stay low and fruit routinely hangs into November. A line of old volcanic plugs known as the Nine Sisters runs through the district, and the soils mix that volcanic material with marine sediment beneath it."),

    # ----------------------------------------------------- Santa Barbara County (4)
    Q("Santa Barbara County",
      "One Santa Barbara appellation prints an abbreviated form of its own name on every label, the result of an objection raised from another continent. Whose objection forced it?",
      ["A Chilean estate called Santa Rita",
       "A Spanish denomination of the same name",
       "A Portuguese quinta of the same name",
       "An Argentine bodega of the same name"], 0,
      "The Chilean house had been selling under that name for well over a century before the appellation was approved, and the abbreviation is the legal settlement that followed rather than a stylistic quirk, which is why it is always written that way and never spelled out in full. The appellation itself occupies the cold, wind-scoured western end of its valley, where the transverse ranges let the ocean straight in."),
    Q("Santa Barbara County",
      "Within the Santa Ynez Valley a sub-appellation was drawn around the strengths of a single red variety, which is unusual for an American appellation. Which variety?",
      ["Syrah", "Pinot Noir", "Cabernet Sauvignon", "Grenache"], 0,
      "Ballard Canyon runs north to south across the middle of the valley, between the cold western end and the hot eastern one, and the grape ripens there without either losing acidity or staying green. No AVA can legally restrict what is planted inside it, so the focus is a matter of grower agreement and reputation rather than of rule."),
    SA("Santa Barbara County",
       "Planted in 1973, a single Santa Maria Valley vineyard supplies so many producers that its name turns up on labels from all over the state. Name it.",
       "Bien Nacido",
       ["bien nacido", "bien nacido vineyard", "bien nacido in santa maria valley"],
       "Selling fruit rather than making wine is the whole point of the place, and a vineyard designation of that kind obliges the buyer to take 95 percent of the wine from the named site. The valley is among the coldest growing areas in the state, so the fruit comes in late and with high natural acidity whoever ferments it."),
    SA("Santa Barbara County",
       "Santa Ynez is not the only Santa Barbara valley running east to west toward the ocean. Name the northernmost of them.",
       "Santa Maria Valley",
       ["santa maria valley", "santa maria", "santa maria valley ava",
        "santa maria valley appellation"],
       "It opens onto the sea near Guadalupe, so the marine layer runs the full length of it with no ridge to stop it, and the Los Alamos Valley lies between it and Santa Ynez. Growing seasons there are among the longest anywhere in California, with fruit hanging into November in an ordinary year."),

    # -------------------------------------------------- Sierra Foothills and Lodi (4)
    Q("Sierra Foothills and Lodi",
      "Amador County's best-known Zinfandel appellation had to qualify its name because a far better-known valley on the other side of the country carries the same one. What is the Californian one called?",
      ["California Shenandoah Valley", "Fiddletown", "Fair Play",
       "Shenandoah Valley of Virginia"], 0,
      "Two American viticultural areas may not carry the same bare name, and the two Shenandoah Valley petitions sat before the bureau at the same time in the early 1980s. The eastern valley was the nationally recognised name, so the western claimant took the state prefix rather than the other way about. The regulation gives the name as Shenandoah Valley qualified by the word California in direct conjunction with it, and the bureau lists and labels it with the state name leading. The valley sits around 1,500 to 2,000 feet on decomposed granite, and its Zinfandel runs broad, briary and high in alcohol, quite unlike the version grown on the Sonoma benchlands."),
    Q("Sierra Foothills and Lodi",
      "Old Vine is printed on Zinfandel from Lodi and from the Sierra Foothills alike. What does that phrase oblige the producer to have done?",
      ["Nothing at all, since the phrase is not defined in law",
       "Use fruit only from vines at least fifty years old",
       "Use fruit only from vines at least twenty-five years old",
       "Use fruit only from vines growing on their own roots"], 0,
      "There is no federal or state standard behind it, so it means whatever the producer decides, exactly as Reserve does. Estate Bottled, the appellation minimums and the varietal minimum are the American label terms that actually bind. Growers' private conventions vary wildly, some reserving the phrase for pre-Prohibition plantings and others applying it at thirty years."),
    SA("Sierra Foothills and Lodi",
       "Documented as planted in 1869, a block of Zinfandel in Amador County is generally reckoned the oldest of its variety still cropping in California. Name that vineyard.",
       "Grandpere",
       ["grandpere", "grand pere", "grandpere vineyard", "original grandpere vineyard"],
       "The vines are head-trained, dry-farmed and on their own roots, and they crop a fraction of what a modern trellised block would. Vineyards of that age survive in the foothills because the granite sand they sit in is hostile to phylloxera and because nobody had a commercial reason to pull them out."),
    SA("Sierra Foothills and Lodi",
       "Lodi is subdivided, and one of its sub-appellations on deep river sand holds nearly all of the region's century-old vines. Name it.",
       "Mokelumne River",
       ["mokelumne river", "mokelumne", "mokelumne river ava", "mokelumne river appellation"],
       "The sand was laid down by the river and phylloxera cannot establish in it, so those plantings were never grafted over or torn out during the replanting that reshaped the North Coast. Most of the other Lodi sub-appellations run to heavier clay and to higher ground on the eastern side, though Cosumnes River in the northwest lies lower still on the delta floor and Jahant sits on its own pink loam north of the river."),

    # --------------------------------- Phylloxera, Paris and the modern trade (3)
    Q("Phylloxera, Paris and the modern trade",
      "The rootstock that failed across Napa and Sonoma through the late 1980s had been recommended by the state's own university for decades. What was wrong with it?",
      ["One of its parents was Vitis vinifera, which has no resistance",
       "It had been propagated from virus-infected material",
       "It was bred for lime tolerance and could not cope with acid soils",
       "It was a pure Vitis riparia selection with roots too shallow to anchor"], 0,
      "AXR number 1 crosses Aramon, a vinifera, with Vitis rupestris, and the vinifera half was always the weak point; a phylloxera biotype eventually found it. French growers had abandoned the cross long before on the same evidence. Rupestris St. George, the older Californian standard, carries no vinifera at all and came through untouched."),
    Q("Phylloxera, Paris and the modern trade",
      "An Englishman running a wine shop and a wine school in Paris assembled the 1976 tasting that first set California in front of French judges. Name him.",
      ["Steven Spurrier", "Michael Broadbent", "Harry Waugh", "Hugh Johnson"], 0,
      "He ran the Caves de la Madeleine and the Academie du Vin, put together a panel entirely of French judges who expected the French wines to win, and did not vote himself. A single American journalist happened to be in the room, which is the only reason the result was ever reported."),
    SA("Phylloxera, Paris and the modern trade",
       "Robert Mondavi and the proprietor of a Bordeaux First Growth founded a Napa estate together at the end of the 1970s, the first partnership of its kind between the two regions. Name that estate.",
       "Opus One",
       ["opus one", "opus 1", "opus one winery", "opus one in oakville",
        "opus one napa"],
       "The Bordeaux partner was Baron Philippe de Rothschild of Mouton Rothschild, and the wine was priced from the first vintage at a level no Californian bottle had attempted. It is usually read as the commercial consequence of the Paris result: European houses had started treating Napa as somewhere to invest rather than somewhere to dismiss.",
       ex=True),
]
