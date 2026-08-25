"""Rank II rewrite - Pacific NW, NY & Canada (33 questions: 12 MC, 21 short answer).

Certified level, covering North America outside California: Oregon, Washington,
Idaho, New York and Canada. Pitched deliberately above the committed Rank I
"United States" category, which was read first. Where Rank I asks which soil is
the calling card of the Dundee Hills, this asks what the pale sedimentary ground
north of it is called and which rivers named it; where Rank I says the Finger
Lakes keep vines alive, this asks which lake the prevailing wind crosses before
it reaches the mildest shore in the region. Nothing here repeats a Rank I task.
California is left alone entirely - the committed r2_california.py owns the AVA
system, the 85 percent rule and every Californian place - and the two answers
another committed category has already taken in this territory, the Niagara
Escarpment and loess, are deliberately absent.

The running order is built around the one question every region in this file
answers differently: what keeps the vine alive. Oregon answers with a label rule
and a gap in the Coast Range, Washington with a rain shadow, a spare trunk and
its own roots, Idaho with elevation, New York with deep water, and Canada with a
lake, a bench and a burial. So the file runs Oregon law, the Willamette, the
south, then Washington's ground and Washington's appellations, then Idaho, the
Finger Lakes, Long Island, British Columbia and last Ontario.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and every
one was run through it in a scratch script rather than eyeballed: the displayed
answer graded True, two natural phrasings graded True, and every wrong answer
that could be named graded False. No '~' entries appear anywhere, since the tilde
is exact-OR-containment and a one-word tilde grades any wrong answer holding that
word. ex=True now stands on nineteen of the twenty-one short answers; only Horse
Heaven Hills and Wahluke Slope still grade by containment. It began on the
questions where a REAL and DIFFERENT thing extends or inverts the right answer -
Willakenzie against the Willamette and against the estate of the same name,
Laurelwood the soil against the district of that name, Cayuga Lake against Cayuga
White, the North Fork of Long Island against the North Fork of Roanoke, and both
threshold answers, Oregon's appellation minimum and the icewine must weight,
because a threshold graded by containment reads the same in both directions -
and later passes extended it to the rest, each list widened until article,
suffix, gloss and word-order variants of its own answer still grade.

Facts are restricted to ones that do not drift. No ownership, no acreage, no
production shares, no ranking by size and no appellation delimited in the last
few years; label law, geology, glacial history, climate mechanism and long-settled
appellation boundaries carry the weight instead.
"""

from lib import Q, SA

CAT = "Pacific NW, NY & Canada"
SLUG = "r2-pacific-nw-ny-canada"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("Oregon's stricter label law", 3),
    ("The Willamette Valley and its nested AVAs", 5),
    ("Southern Oregon", 2),
    ("Washington's ground: floods, basalt and cold", 4),
    ("Washington's nested appellations", 4),
    ("Idaho and the Snake River", 2),
    ("The Finger Lakes", 4),
    ("Long Island, hybrids and labrusca", 3),
    ("British Columbia and the Okanagan", 3),
    ("Ontario, the VQA and Icewine", 3),
]

BANK = [
    # ------------------------------------------- Oregon's stricter label law (3)
    Q("Oregon's stricter label law",
      "Generic borrowings such as Chablis and Burgundy stayed legal on American labels for decades after one state had already barred them from its own. Which state moved first, at the end of the 1970s?",
      ["Oregon", "Washington", "Ohio", "Idaho"], 0,
      "The federal government still tolerates a short list of semi-generic European names under a grandfather arrangement, so this was a state legislating well ahead of Washington DC. The package it belonged to was written to force the state's producers to sell on the name of their own grape and their own place rather than on a borrowed one, and it set several minimums above the federal floors at the same time."),
    Q("Oregon's stricter label law",
      "Fruit is trucked across a state line, crushed and bottled at the buyer's own winery, and the label is then refused the appellation the grapes actually grew in. Which federal requirement blocks it?",
      ["A wine naming an AVA must be fully finished in the state that AVA lies in",
       "An AVA name may only be used by a winery standing inside the appellation's own boundary",
       "Grapes may not cross a state line before they are crushed",
       "An AVA name requires the producer to own the vineyard"], 0,
      "The rule sits beside the fruit percentage in the same body of federal regulation, and it exists so that an appellation claim cannot be assembled in a cellar a thousand miles from the vineyard. Cellar treatment and blending that does not change the class or type of the wine are the only steps allowed elsewhere. Where an appellation straddles a state line, finishing in either of them satisfies the rule, which is why a cross-border name is the usual way around the problem."),
    SA("Oregon's stricter label law",
       "Fifteen percent of a Dundee Hills bottling is fruit grown outside that boundary, which federal law would wave through. The state it sits in will not. Where does that state set its own minimum?",
       "Ninety-five percent",
       ["ninety five percent", "95 percent", "95%", "95 per cent", "ninety five per cent",
        "95", "ninety five",
        "at least 95 percent", "at least 95%", "at least ninety five percent",
        "a minimum of 95 percent", "a minimum of ninety five percent",
        "minimum 95 percent", "minimum 95%",
        "95 percent minimum", "95 per cent minimum",
        "95 percent or more", "no less than 95 percent", "must be 95 percent",
        "95 percent of the fruit", "95 percent of the grapes",
        "ninety five percent of the fruit", "ninety five percent of the grapes",
        "95 percent from the appellation", "ninety five percent from the appellation"],
       "Federal law asks 85 percent of the fruit for an AVA name and Oregon demands ninety-five, so a blend that would ship happily from another state has to be relabelled to a broader name here. The same instinct runs through the state's other rules, which is why Oregon labels tend to carry either a very precise place or a frankly regional one and little in between.",
       ex=True),

    # --------------------------- The Willamette Valley and its nested AVAs (5) --
    Q("The Willamette Valley and its nested AVAs",
      "Which of these Willamette sub-appellations is wrapped entirely inside another sub-appellation rather than sitting directly in the valley?",
      ["Ribbon Ridge", "Chehalem Mountains", "Yamhill-Carlton", "McMinnville"], 0,
      "Ribbon Ridge is a spur thrown off the Chehalem Mountains, standing above the valley floor on every side, so its boundary falls wholly within that larger appellation and a grower there may print either name. Chehalem Mountains is the parent rather than a fellow tenant, and Yamhill-Carlton and McMinnville each meet the valley floor directly. Ribbon Ridge is the smallest of the original Willamette sub-appellations and the most uniform, being one landform with one soil type across it, and it was the first of a nested pair: a second sub-appellation, drawn later, sits wholly inside the Chehalem Mountains in the same way."),
    Q("The Willamette Valley and its nested AVAs",
      "Before Dijon selections reached Oregon at the end of the 1980s, almost every Pinot Noir vine in the Willamette came from one of two older clones. Which pair?",
      ["Pommard and Wadenswil", "Mariafeld and Geisenheim", "Dijon 115 and Dijon 777",
       "Wente and Rued"], 0,
      "Pommard, catalogued at Davis as UCD 5, gives the darker and more structured wine, while Wadenswil, UCD 2, is lighter, higher toned and more aromatic, and old plantings are often a field mix of the two. The Dijon selections that followed ripen earlier and in smaller clusters, which in a valley whose autumn rain arrives on schedule is worth more than any flavour argument."),
    SA("The Willamette Valley and its nested AVAs",
       "Uplifted ancient seabed underlies the northern Willamette, weathering to a pale, silty, low-vigour ground quite unlike the red basalt soils of the hills alongside it. That soil series carries a name run together from the rivers of the valley floor. Name it.",
       "Willakenzie",
       ["willakenzie", "willakenzie soil", "willakenzie soils", "willakenzie series",
        "willakenzie soil series", "willakenzie sedimentary soil",
        "willakenzie marine sedimentary soil"],
       "The name is a contraction of the Willamette and the McKenzie, the two rivers of the valley floor, and the material itself is old marine sandstone and siltstone lifted out of the sea rather than anything volcanic. It is shallower and less fertile than the basalt soils, so vines set smaller crops on it without persuasion, and Yamhill-Carlton is the appellation most often quoted as its home ground.",
       ex=True),
    SA("The Willamette Valley and its nested AVAs",
       "On the northern face of the Chehalem Mountains an ice-age wind laid a deep cap of fine silt over the basalt, thick enough to farm in its own right. Name that soil.",
       "Laurelwood",
       ["laurelwood", "laurelwood soil", "laurelwood soils", "laurelwood series",
        "laurelwood soil series", "laurelwood loess", "laurelwood silt"],
       "Laurelwood is loess, wind-carried dust dropped downwind of the glacial floods and piled up against the north side of the range over many thousands of years. Because the silt sits on basalt rather than replacing it, a vineyard there can have both materials inside the same root zone, which is the argument its growers make for the ground being distinct from either the basalt or the marine sediment on their own.",
       ex=True),
    SA("The Willamette Valley and its nested AVAs",
       "Wind pouring through a break in the Coast Range scours one group of basalt hills a few miles east of that gap every afternoon, and the fruit comes in small-berried and firm. Name that sub-appellation.",
       "Eola-Amity Hills",
       ["eola amity hills", "eola amity", "eola amity hills ava",
        "eola amity hills appellation", "eola and amity hills",
        "eola amity hills in the willamette valley"],
       "The break is the Van Duzer Corridor, a gap where the Coast Range drops low enough for marine air to run straight inland, and it is now an appellation in its own right, sitting on marine sedimentary ground rather than basalt. The wind through it can knock several degrees off an afternoon. Wind of that persistence shuts the stomata and thickens skins, so the wines carry more tannin and more colour than the valley average, and harvest there runs later than in the hills to the north.",
       ex=True),

    # -------------------------------------------------------- Southern Oregon (2)
    Q("Southern Oregon",
      "An umbrella appellation created in 2004 lets a grower in the south of the state blend across two separate river valleys and still name a place. Which two does it gather?",
      ["The Umpqua Valley and the Rogue Valley", "The Willamette Valley and the Umpqua Valley",
       "The Rogue Valley and the Columbia Gorge", "The Willamette Valley and the Columbia Gorge"], 0,
      "Southern Oregon was drawn to cover both valleys and everything nested inside them, because producers there were routinely buying across the two and had no legal way of saying so. The country is warmer, drier and far more broken than the Willamette, sheltered by mountains on three sides, and it grows Syrah, Tempranillo and the Bordeaux varieties rather than the Pinot Noir the state is known for."),
    SA("Southern Oregon",
       "A tributary valley nested inside the Rogue runs warm and dry enough for Syrah and Cabernet Sauvignon, where the parent appellation is otherwise a patchwork of climates. Name the nested appellation.",
       "Applegate Valley",
       ["applegate valley", "applegate", "applegate valley ava",
        "applegate valley appellation", "applegate valley in oregon",
        "applegate valley in the rogue valley"],
       "The Applegate River drains north out of the Siskiyou Mountains into the Rogue, and its valley is narrow, sheltered and consistently warmer than the rest of the parent zone, with decomposed granite underfoot. The Rogue Valley appellation around it swings from that heat to the cool, wet Illinois Valley in the west, which is why one description of the parent has never fitted.",
       ex=True),

    # ------------------------- Washington's ground: floods, basalt and cold (4) --
    Q("Washington's ground: floods, basalt and cold",
      "Vines across the Columbia basin are trained with two or three trunks rising from the ground rather than one, and an own-rooted block can be brought back from the base after the worst nights. Which hazard shapes both practices?",
      ["A hard winter freeze, which can kill the wood above ground",
       "Phylloxera arriving through the graft union",
       "Wind off the river snapping a single trunk",
       "Spring frost during flowering"], 0,
      "Arctic air spilling south over the Rockies is the one thing that limits where the state can plant, and it arrives every few years rather than every year. A spare trunk means a killed one can be cut out without losing the vine, and because so much of the state is planted on its own roots, a shoot from below is the same variety and can simply be trained up as a replacement. A grafted vine's basal shoot would be rootstock, which is why the same accident costs a Napa grower a replanting."),
    Q("Washington's ground: floods, basalt and cold",
      "The Columbia Valley appellation does not stop at the Washington state line. Which neighbouring state does it continue into?",
      ["Oregon", "Idaho", "Montana", "British Columbia"], 0,
      "The appellation follows the river's basin rather than any political boundary, so it takes in a strip on the Oregon side as well, and Walla Walla Valley and Columbia Gorge both straddle the line in the same way. British Columbia is a province rather than a state and lies well north of the boundary in any case, since an American viticultural area cannot cross an international border."),
    SA("Washington's ground: floods, basalt and cold",
       "Where the ice-age floods backed up behind a narrow gap in the basalt, the ponded water dropped its silt in rhythmic layers that now floor the deepest vineyard soils of the Walla Walla Valley. Name those slackwater deposits.",
       "The Touchet beds",
       ["touchet beds", "touchet bed", "touchet", "touchets",
        "touchet formation", "touchet beds formation",
        "touchet silts", "touchet sediments", "touchet deposits",
        "touchet rhythmites",
        "touchet slackwater deposits", "touchet slackwater beds",
        "touchet beds slackwater deposits",
        "touchet beds of the walla walla valley",
        "touchet beds in the walla walla valley"],
       "Wallula Gap is the bottleneck: the floodwater arrived faster than the gap could pass it and ponded back up the tributary valleys, settling out fine material every time it stalled. Each flood left a layer, so the beds are stacked like pages and can be counted in a road cut, and where they are deep the vine roots never reach the cobbles beneath them at all.",
       ex=True),
    SA("Washington's ground: floods, basalt and cold",
       "Under the silt and the flood gravel of eastern Washington lies a stack of lava flows more than a mile thick, poured out long before any ice age. Name that rock formation.",
       "The Columbia River Basalt Group",
       ["columbia river basalt group", "columbia river basalt", "columbia river basalts",
        "columbia river flood basalts", "columbia river flood basalt",
        "columbia flood basalts", "columbia flood basalt",
        "columbia river basalt formation", "columbia river basalt group crbg",
        "crbg"],
       "The flows erupted from long fissures and spread out flat, filling the basin layer on layer and damming rivers as they went. Everything a Washington grower farms sits on that stack: the ridges are folds in it, the cobbles the floods carried are broken pieces of it, and the same rock reappears west of the Cascades as the hills of the northern Willamette.",
       ex=True),

    # ------------------------------------- Washington's nested appellations (4) --
    Q("Washington's nested appellations",
      "The boundary of one American appellation was drawn to follow a single soil series, a fan of dark cobbles dumped where a river leaves the mountains. Which appellation?",
      ["The Rocks District of Milton-Freewater", "Ancient Lakes of Columbia Valley",
       "Snipes Mountain", "Naches Heights"], 0,
      "The petition argued the case from the soil survey, so the boundary is the outline of a single soil series on a single alluvial fan and nothing else. The stones are rounded basalt, dark enough to hold the day's heat well into the night, and the wines off them carry a savoury, smoked character growers claim to recognise blind. It lies wholly in Oregon, although the town it is named for sits at the Washington line."),
    SA("Washington's nested appellations",
       "Washington's first appellation, delimited in 1983, sits as a middle tier with Columbia Valley above it and several smaller appellations nested inside it. Name it.",
       "Yakima Valley",
       ["yakima valley", "yakima", "yakima valley ava", "yakima valley appellation",
        "yakima valley in washington"],
       "Red Mountain, Rattlesnake Hills and Snipes Mountain all sit inside it, and every one of them can also print Columbia Valley, so a single wine may legitimately carry any of three names of decreasing size. The valley is the oldest planted part of the state and runs cooler than the country east of it, which is why so much of the state's white fruit comes from there.",
       ex=True),
    SA("Washington's nested appellations",
       "Wind rolling up off the Columbia River never lets up on the long Washington slope that falls south from a valley rim to the water, and growers there bank on the small berries and thick skins it gives them. Name that appellation.",
       "Horse Heaven Hills",
       ["horse heaven hills", "horse heaven", "horse heaven hills ava",
        "the horse heaven hills appellation"],
       "The ground runs down toward the river in a single tilted sheet, so the aspect is uniform and the wind has nothing to break it. That wind is a working tool rather than a nuisance: it shrinks berries and raises the skin to juice ratio, and it dries the canopy fast enough that fungal disease is close to unknown there."),
    SA("Washington's nested appellations",
       "One Washington appellation sees barely six inches of rain in a year, and every acre of it is planted where canal water can be lifted onto a single unbroken incline below the Saddle Mountains. Name it.",
       "Wahluke Slope",
       ["wahluke slope", "wahluke", "wahluke slope ava", "the wahluke slope appellation"],
       "It is among the warmest and driest ground in the state, with the mountains cutting off the north wind and the river below it moderating nothing very much. Nothing grows there without irrigation, which means the grower sets vine vigour entirely by the tap, and the fruit ripens early and dependably enough that it is a major source for red blends made elsewhere in the state."),

    # ---------------------------------------------- Idaho and the Snake River (2)
    Q("Idaho and the Snake River",
      "Idaho's vineyards run hot by day, freeze hard in winter and work a short season besides. Which single geographic fact drives all three?",
      ["Elevation, in a basin far inland from any ocean",
       "A rain shadow cast by the Coast Range, which strips the marine air out before it arrives",
       "Latitude north of the forty-seventh parallel, further north than any Washington vineyard",
       "A valley floor that opens directly onto the Pacific and takes the weather first"], 0,
      "Vineyards there sit well above two thousand feet, higher than anything planted in Washington, and thin air at that height sheds the day's heat fast once the sun goes down. The result is a diurnal swing wide enough to hold acidity through a hot afternoon, a winter cold enough to demand hardy training, and a frost-free window short enough that late-ripening varieties are a gamble."),
    SA("Idaho and the Snake River",
       "Vines in Idaho cluster in one appellation southwest of Boise, floored by the sediments of a lake that drained away in the Pliocene, and it reaches west across the state line. Name it.",
       "Snake River Valley",
       ["snake river valley", "snake river valley ava", "snake river valley appellation",
        "snake river valley in idaho"],
       "The old lake bed left silts and sands over basalt, and the appellation crosses into eastern Oregon because the same basin does. Growers plant on the slopes and terraces above the river rather than on the flat, since cold air pools on the floor in winter and the difference between a bench and the ground below it can decide whether a block survives.",
       ex=True),

    # ------------------------------------------------------- The Finger Lakes (4)
    Q("The Finger Lakes",
      "Buds on a slope above a Finger Lake come through a night at ten below zero Fahrenheit while a planting a few miles inland is killed outright. What is the water doing?",
      ["Giving back the heat it stored through summer, and keeping the air moving",
       "Raising the humidity so the buds cannot desiccate",
       "Reflecting low winter sunlight back onto the slope",
       "Holding budbreak back until the frost season has ended"], 0,
      "A deep lake takes all summer to warm and all winter to give that heat up, so it is still releasing warmth in January when the vineyard needs it most. The stirring matters as much as the warmth: air rising off the water pulls cold air off the slopes instead of letting it settle, which is why the vineyard sits on the sides of the trough and not on the flat ground at either end."),
    SA("The Finger Lakes",
       "Prevailing westerlies cross the deepest of the Finger Lakes before they reach the far shore, which is why growers on that side see the mildest winters in the region. Name the lake.",
       "Seneca Lake",
       ["seneca lake", "lake seneca", "seneca", "seneca lake ava", "lake seneca ava",
        "seneca lake appellation", "seneca lake in the finger lakes",
        "seneca lake new york", "seneca lake in new york"],
       "It runs to more than six hundred feet deep, enough that it effectively never freezes over, and the wind picks up warmth and moisture the whole way across before it reaches the eastern shore. That shore carries the densest planting in the region, and the difference between it and the western side of the same lake is measured in whole degrees rather than fractions.",
       ex=True),
    SA("The Finger Lakes",
       "One of the Finger Lakes forks into a Y, and the region's wine industry began on its shore at Hammondsport in the 1860s. Name that lake.",
       "Keuka Lake",
       ["keuka lake", "lake keuka", "keuka", "keuka lake ava", "lake keuka ava",
        "keuka lake appellation", "keuka lake in the finger lakes",
        "keuka lake new york", "keuka lake in new york"],
       "The Y shape gives it far more shoreline for its length than a straight trough would, and the bluff between the two branches is planted on both faces. The industry that started there was built on native and hybrid varieties and on sweet sparkling wine, and vinifera only arrived a century later, which is why the oldest cellars in the region look nothing like the newest.",
       ex=True),
    SA("The Finger Lakes",
       "Delimited in 1988, the first appellation ever nested inside the Finger Lakes AVA follows the shoreline slopes of the longest lake in the region. Name it.",
       "Cayuga Lake",
       ["cayuga lake", "lake cayuga", "cayuga", "cayuga lake ava", "lake cayuga ava",
        "cayuga lake appellation", "cayuga lake in the finger lakes",
        "cayuga lake new york", "cayuga lake in new york"],
       "It runs some thirty-eight miles north to south, longer than any of its neighbours though not the deepest, and the appellation follows its shoreline slopes rather than the country between the lakes. The second nested appellation was drawn fifteen years later around a neighbouring lake, and everything outside the two of them carries the regional name alone.",
       ex=True),

    # -------------------------------------- Long Island, hybrids and labrusca (3)
    Q("Long Island, hybrids and labrusca",
      "Federal law lets a wine made from Concord or Niagara print its variety at a lower minimum than a Chardonnay needs. What is the figure for those native varieties?",
      ["51 percent", "75 percent", "85 percent", "Every grape in the bottle"], 0,
      "The allowance exists because labrusca character is so assertive that a bare majority of it already dominates a blend, and the wines were traditionally softened with something neutral. A label using it has to carry an appellation of origin as well, and the ordinary 75 percent minimum still applies to everything else, so a Riesling and a Concord standing side by side on a New York shelf are held to different rules."),
    SA("Long Island, hybrids and labrusca",
       "Sand and gravel dumped at the edge of an ice sheet floor the strip of Long Island that carries almost all of the island's vineyard, and that strip holds an appellation distinct from the umbrella one. Name it.",
       "The North Fork of Long Island",
       ["north fork of long island", "north fork", "north fork of long island ava",
        "north fork of long island appellation", "long island north fork",
        "north fork ava", "the north fork appellation"],
       "The forks are the two arms of a terminal moraine and its outwash, left where the ice stalled, so the ground is sandy and drains hard. Water on three sides stretches the autumn out by weeks against anywhere inland, which is why Merlot and Cabernet Franc ripen there and why a tropical storm arriving in September is the hazard growers actually plan around.",
       ex=True),
    SA("Long Island, hybrids and labrusca",
       "A pungent grape-jelly note gives away Concord and its relatives in a blind glass, and one ester carries most of the blame for it. Name that compound.",
       "Methyl anthranilate",
       ["methyl anthranilate", "methylanthranilate", "ester methyl anthranilate",
        "methyl anthranilate ester", "the compound methyl anthranilate"],
       "It is present in labrusca and its hybrids at levels vinifera never reaches, and it is the same compound used to flavour grape soda and sweets, which is why the association runs the way it does. Tasters usually call the character foxy, and a small proportion of a labrusca variety in a blend is enough to make a wine smell of it.",
       ex=True),

    # -------------------------------------- British Columbia and the Okanagan (3)
    Q("British Columbia and the Okanagan",
      "In 1988 British Columbia paid its growers to tear out roughly two thirds of the province's vines inside a single season. What forced that?",
      ["A trade agreement opened the border to cheaper wine",
       "Phylloxera reached the valley and forced a wholesale replanting on resistant rootstock",
       "Two winters in a row killed the vineyard outright",
       "A federal ban on the use of hybrid grapes for wine"], 0,
      "The vineyard at the time was mostly hybrid and labrusca material planted for volume, and it could not survive being priced against imports. The pull-out looks brutal on paper and was the making of the modern industry: what went back in was vinifera on the warmest sites, and the appellation system that followed a couple of years later was written to protect the replanting."),
    SA("British Columbia and the Okanagan",
       "Deep windblown sand on the east side of the valley floor south of Oliver carries the ripest Bordeaux reds in Canada. Name that bench.",
       "Black Sage Bench",
       ["black sage bench", "black sage", "black sage bench sub gi",
        "black sage bench in the okanagan"],
       "The sand is deep enough that vines can be planted on their own roots, and it warms fast and drains completely, which at that latitude matters more than any nutrient it lacks. This is the driest end of the valley, close to true desert, and everything there is irrigated from the lakes that run down the middle of it.",
       ex=True),
    SA("British Columbia and the Okanagan",
       "The first sub-appellation ever delimited inside the Okanagan Valley sits on the valley's western side above Oliver, where the slopes take the morning sun and fall into shade early. Name it.",
       "Golden Mile Bench",
       ["golden mile bench", "golden mile", "golden mile bench sub gi",
        "golden mile bench appellation", "golden mile bench in the okanagan"],
       "Facing east means the fruit warms early and is then shaded through the hottest part of the afternoon, which holds acidity in a valley that can be punishingly hot in August. The bench sits on an alluvial fan below the mountains, and the neighbouring Similkameen Valley over the ridge to the west is the other place in the province regularly compared with it.",
       ex=True),

    # ----------------------------------------- Ontario, the VQA and Icewine (3) --
    SA("Ontario, the VQA and Icewine",
       "Bulk wine shipped in from abroad and blended with Ontario fruit puts a bottle outside the VQA system altogether, and Canadian labelling rules set out what it has to say about itself instead. Give that label statement.",
       "International blend from imported and domestic wines",
       ["international blend from imported and domestic wines",
        "international blend from domestic and imported wines",
        "international blend of imported and domestic wines",
        "international blend",
        "international canadian blend", "international canadian blends",
        "international canadian blend icb", "icb"],
       "VQA guarantees that every grape was grown in the province named, that the variety and the ripeness at harvest meet a written standard, and that the wine itself has satisfied a tasting panel before the term may be used, none of which an American appellation asks. A blend carrying imported wine can meet none of that, so the label has to declare it, and the order of the words tracks the blend: imported first when most of the wine came from abroad, domestic first when most of it is Canadian. The trade and the shelf tags still call the category an International Canadian Blend, or ICB, but Cellared in Canada, the wording these bottles carried for years, was retired when the labelling rules changed and is no longer permitted.",
       ex=True),
    SA("Ontario, the VQA and Icewine",
       "Temperature at picking is only half of Canada's icewine rule: the juice coming off the press has to reach a stated concentration as well. Give that minimum must weight.",
       "Thirty-five degrees Brix",
       ["thirty five degrees brix", "35 degrees brix", "35 brix", "thirty five brix",
        "35",
        "minimum 35 brix", "35 brix minimum", "at least 35 brix",
        "at least thirty five brix", "a minimum of 35 brix",
        "minimum 35 degrees brix", "35 degrees brix minimum",
        "a minimum of 35 degrees brix", "at least 35 degrees brix",
        "at least thirty five degrees brix", "thirty five degrees brix minimum",
        "35 brix or more", "35 degrees brix or more", "no less than 35 brix",
        "must weight of 35 brix", "minimum must weight of 35 brix",
        "35 brix must weight",
        "35 brix at pressing", "thirty five brix at pressing",
        "35 degrees brix at the press"],
       "Both halves are enforced, and either one can end a harvest: a mild winter that never delivers the cold means no picking, and fruit that has hung too long in damp weather can arrive dilute even when it is frozen solid. The finished wine carries a residual sugar floor as well, so a producer cannot press to weight and then ferment the sweetness away.",
       ex=True),
    SA("Ontario, the VQA and Icewine",
       "Growers in one Ontario appellation lay the canes down and plough soil over them every November, then uncover them in spring, because winter there kills anything left standing. Name that appellation.",
       "Prince Edward County",
       ["prince edward county", "prince edward county ontario",
        "prince edward county ontario canada",
        "prince edward county appellation", "prince edward county in ontario",
        "prince edward county wine region", "prince edward county ava",
        "prince edward county vqa", "pec",
        "prince edward county pec", "pec prince edward county"],
       "It lies out in Lake Ontario well east of the main Ontario vineyard, and the water lengthens the season there, but the Bay of Quinte behind it and the shallow water inshore freeze in deep winter and stop moderating anything at the moment it is needed. Midwinter lows near thirteen below zero Fahrenheit will kill an exposed vine outright. The soil is a thin, stony loam straight onto limestone, which is what persuades people to bother, and burying the vines by hand every autumn is the price of farming Chardonnay and Pinot Noir there at all.",
       ex=True),
]
