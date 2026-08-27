"""Rank II rewrite - Terroir: Climate & Soil (56 questions: 28 MC, 28 short answer).

Certified level, pitched a full step above the Rank I "Viticulture & Winemaking"
soil and climate blocks and above the Rank I "Soil & Terroir" category that will
eventually sit under this one. Where Introductory asks what a continental climate
is, this asks which measurement separates a continental site from a maritime one
at the same mean temperature. Where Introductory says slate holds heat, this asks
what the second job of a fractured rock is. No task here repeats a Rank I task.

The running order is a single descent in scale. It starts at the whole region and
narrows to the canopy, then walks the site down the hill, then goes into the
ground, then asks what the vine actually does with the water it finds there, and
ends on the argument about how much any of it explains. A student who works
through it in order should finish able to say why two blocks in one appellation
are not the same wine, and where the explanation stops being physical.

Written from the syllabus below. The imported bank was not read while writing; it
is read only afterwards, by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and were
run against adversarial inputs rather than eyeballed. '~' entries appear on one
question only and every one of them is a whole phrase of two words or more: the
tilde is exact-OR-whole-phrase-containment, so a one-word tilde grades any wrong
answer holding that word and is never used here.

ex=True is used where containment grading would hand a point to something that
is not the answer. Four questions are of that shape, each one where a WRONG
answer would otherwise contain the right one plus a distinguishing word:

  specific heat capacity  "low specific heat capacity" is the exact inversion the
                          question tests, and it contains the right answer.
  hail                    "hail cannon" and "hail netting" are devices, not the
                          hazard, and both swallow "hail".
  deficit irrigation      "sustained deficit irrigation" is a real and different
                          strategy that contains "deficit irrigation".
  climate                 "climate change" is a real and different thing that
                          contains "climate".

A word of the STEM can be a truncation of the answer as well, so retyping the
question scores. Containment runs in both directions and the second direction is
the one that leaks. Two of those were closed and one was not.

  vintage variation   the stem says "from year to year", and the accepted
                      phrasing "year to year variation" is long enough that the
                      bare "year to year" grades as a subphrase of it. Closed
                      with ex=True plus '~' entries, which is the combination
                      this file exists to demonstrate: matchSA checks the tilde
                      branch BEFORE it consults ex, and that branch keeps
                      whole-phrase containment. So "significant vintage
                      variation" and "vintage variation in quality" still grade,
                      while the bare stem phrase does not, because "year to year"
                      is not a whole phrase of any accepted entry.
  loess               "wind blown loess" sat beside "loess" and graded the stem's
                      "wind-blown" on its own. Deleting it costs nothing, since
                      a student who writes "wind blown loess" still grades on the
                      "loess" inside it. No exactness needed.
  mesoclimate         NOT closed, and that is a decision rather than an
                      oversight. The stem asks which scale of climate, and
                      "climate" sits inside "mesoclimate" as a plain substring,
                      so the answer's own entry grades the stem word. The entry
                      cannot be dropped, because SA() reinserts the displayed
                      answer when the list fails to grade it. ex=True would close
                      the echo and then reject "mesoclimate effect", which is the
                      wording this question's own explanation uses, along with
                      "block mesoclimate", "his mesoclimate", "a warmer
                      mesoclimate" and every other modifier form a student
                      actually writes. The tilde rescue is unavailable because
                      the answer is one word and a one-word tilde grades that
                      word anywhere. The class of correct phrasings is open, so
                      the echo is conceded: a student typing "climate" collects a
                      point they did not earn, which is far cheaper than telling
                      a student who wrote "mesoclimate effect" that they are
                      wrong.

Each ex=True list was then widened until every natural phrasing of its own answer
still grades, because exact matching rejects anything not written down. The
accept lists in the code below are the record of what is taken; an enumeration up
here only goes stale, and did.

Facts are restricted to ones that do not drift. No ownership, no production
volumes, no recent denomination changes. Physics, geology, plant response and
long-settled geography carry the weight, and the two numbers that appear (the
Winkler base and the lapse rate) are textbook constants rather than statistics.
"""

from lib import Q, SA

CAT = "Terroir: Climate & Soil"
SLUG = "r2-terroir-climate-soil"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("Scales of climate", 4),
    ("Climate models and the metrics that separate them", 8),
    ("Slope, aspect, elevation and cold-air drainage", 6),
    ("Water, fog and rain shadow", 5),
    ("Frost, hail and vintage extremes", 6),
    ("Limestone, chalk and marl", 5),
    ("Clay, gravel, sand and loess", 6),
    ("Schist, granite and volcanic ground", 5),
    ("Drainage, water stress and vigour", 5),
    ("Rootstock as a soil decision", 3),
    ("What terroir explains and what it does not", 3),
]

BANK = [
    # ------------------------------------------------------ Scales of climate (4)
    Q("Scales of climate",
      "Fruit sitting deep inside a dense canopy runs three degrees cooler than fruit on the outside of the same vine on the same afternoon. Which scale of climate has just been measured?",
      ["Microclimate", "Mesoclimate", "Macroclimate", "Seasonal climate"], 0,
      "Microclimate is the air within and immediately around the canopy, measured in metres and often in centimetres. It is the only one of the three scales a grower can change in an afternoon, which is why leaf removal and shoot positioning alter fruit chemistry without altering the site at all."),
    Q("Scales of climate",
      "One of the interventions listed here alters the air immediately around the bunches and changes nothing else about the site. Which is it?",
      ["Removing leaves from the fruiting zone",
       "Planting the next block higher up the slope",
       "Choosing a drought-tolerant rootstock",
       "Delaying the harvest date by ten days"], 0,
      "Opening the fruiting zone changes light, temperature and airflow at the bunch, which is microclimate work. Moving up the slope changes the mesoclimate because it changes the site, and rootstock and picking date change the vine's response rather than the air around it."),
    SA("Scales of climate",
       "A grower points out that his hillside block ripens a full week ahead of the valley-floor block he also owns, though the appellation and the weather station serving them are the same. Which scale of climate is he describing?",
       "Mesoclimate",
       # Deliberately NOT ex=True. See the mesoclimate paragraph at the top of
       # this file: exactness here closes the "climate" stem echo and rejects
       # "mesoclimate effect", which the explanation below uses in its own voice.
       # Kept short on purpose. Without ex, "mesoclimate" already grades every
       # elaboration that contains it, so a longer entry adds no coverage and
       # does add harm: "mesoclimate of the site" would grade the fragment "of
       # the site" through the reverse-containment branch. The one spelling that
       # must be listed separately is the spaced one, which is a different word
       # to the matcher. "mesoscale" is deliberately absent: it would grade the
       # bare stem word "scale".
       ["mesoclimate", "mesoclimates", "meso climate", "meso climates",
        "meso scale", "site climate"],
       "Mesoclimate is the climate of a particular site, running from a few metres to a few kilometres, and it is what site selection is really about. The appellation shares a macroclimate, so anything that separates two blocks inside it is a mesoclimate effect: slope, aspect, elevation, exposure, air drainage."),
    SA("Scales of climate",
       "Published thirty-year averages from a lowland weather station mislead a producer whose vines sit a hundred and fifty metres above it on a ridge. Which climatic scale do those figures actually describe?",
       "Macroclimate",
       ["macroclimate", "macro climate", "regional macroclimate", "the macroclimate scale"],
       "A macroclimate covers a whole region and is what published regional averages describe. It cannot resolve a ridge, a lake shore or a frost hollow, so station data is where site assessment starts rather than where it finishes, and a serious buyer asks for on-site loggers instead."),

    # ------------------- Climate models and the metrics that separate them (8) --
    Q("Climate models and the metrics that separate them",
      "Take two regions with an identical mean annual temperature: in one, the hottest and coldest months lie eight degrees apart, in the other twenty-four. Which measure is that gap?",
      ["Continentality", "Diurnal range", "Heat summation", "Mean July temperature"], 0,
      "Continentality is the spread between the mean temperature of the warmest month and that of the coldest, and it is the figure that separates a continental site from a maritime one when the annual mean cannot. Diurnal range measures the same kind of spread over a day rather than a year, and the two are independent of each other."),
    Q("Climate models and the metrics that separate them",
      "Warmest-month mean of twenty-two degrees, coldest-month mean of one degree, rainfall spread fairly evenly through the year. Which climate model do those figures together indicate?",
      ["Continental", "Maritime", "Mediterranean", "Tropical"], 0,
      "A twenty-one degree annual swing is far too wide for a maritime site, where water damps the extremes at both ends. Even rainfall rules out the Mediterranean model, whose signature is not warmth but a dry summer with the rain concentrated in the mild winter."),
    Q("Climate models and the metrics that separate them",
      "Cold nights do not add acid to a berry; they change what the berry does with the acid it already holds. Which process is being slowed?",
      ["Respiration of malic acid", "Photosynthesis in the leaf",
       "Malolactic conversion", "Transpiration through the stomata"], 0,
      "Malic acid is a respiratory substrate, and the rate at which the berry burns it climbs steeply with temperature. Tartaric acid is barely respired at all, which is why a warm region loses its malic first and ends up with wines that are flat rather than merely low in total acidity."),
    Q("Climate models and the metrics that separate them",
      "Two heat-summation totals come out identical for a northern site and a southern one, though the northern site enjoys far longer midsummer days. Which index applies a day-length coefficient to correct for that?",
      ["The Huglin index", "The Winkler index", "The continentality index",
       "Growing season temperature"], 0,
      "Huglin weights accumulated heat by a latitude coefficient, on the reasoning that a long northern day gives the vine more hours to use the warmth it gets. Winkler counts degree days without any such correction, which is why the two indices rank a German site and a Spanish one differently."),
    SA("Climate models and the metrics that separate them",
       "Amerine and Winkler summed the daily degrees above ten Celsius from April through October to sort California into bands. What is the resulting quantity called?",
       "Growing degree days",
       ["growing degree days", "growing degree day total", "degree days",
        "accumulated degree days", "degree day accumulation", "heat summation",
        "growing degree day summation", "growing degree days gdd", "gdd"],
       "Ten degrees is the threshold below which the vine does essentially nothing, so only the warmth above it is counted. The measure is blind to how the heat arrived, which is its weakness: one brutal August week and a long even summer can total the same and ripen fruit quite differently."),
    SA("Climate models and the metrics that separate them",
       "Rather than a full-year mean, the classification most used in wine climatology today averages temperature over the seven months from April to October in the north. Name that average.",
       "Growing season temperature",
       ["growing season temperature", "mean growing season temperature",
        "growing season mean temperature", "growing season average temperature",
        "average growing season temperature", "mean temperature of the growing season",
        "average temperature of the growing season", "growing season temperature gst",
        "gst"],
       "Averaging only the months the vine is awake removes the winter noise that makes annual means useless for comparing regions. The bands it produces, from cool through intermediate and warm to hot, map onto variety suitability far better than latitude does."),
    SA("Climate models and the metrics that separate them",
       "Two coastal regions share a narrow annual temperature range, yet one bakes dry every summer while the other faces rot pressure at picking. Which variable separates them?",
       "The seasonal distribution of rainfall",
       ["seasonal distribution of rainfall", "rainfall distribution",
        "seasonal rainfall distribution", "distribution of rainfall through the year",
        "when the rain falls", "when the rain comes", "when the rain arrives",
        "rainfall timing", "timing of rainfall", "rainfall seasonality",
        "seasonality of rainfall", "rainfall pattern"],
       "Maritime and Mediterranean climates are both moderate, so temperature alone will not tell them apart. The Mediterranean model puts its rain in the winter and leaves the growing season dry, which is why irrigation and drought are its arguments while the maritime regions argue about fungicide and picking dates."),
    SA("Climate models and the metrics that separate them",
       "Water changes temperature far more slowly than the land beside it, and that single physical property is the whole of why a coastal vineyard is moderate. Name the property.",
       "High specific heat capacity",
       ["high specific heat capacity", "specific heat capacity",
        "specific heat capacity of water", "high specific heat capacity of water",
        "water's high specific heat capacity", "water has a high specific heat capacity",
        "specific heat", "high specific heat", "heat capacity", "high heat capacity",
        "thermal inertia", "high thermal inertia", "thermal mass", "high thermal mass",
        "thermal mass of water"],
       "It takes roughly five times as much energy to warm a mass of water by one degree as it does the same mass of rock, so a large body of water lags the air around it in both directions. That lag is what shortens winters, delays autumn and blunts heat spikes; depth matters more than surface area, which is why a deep lake moderates better than a shallow one of the same size.",
       ex=True),

    # -------------------- Slope, aspect, elevation and cold-air drainage (6) ----
    Q("Slope, aspect, elevation and cold-air drainage",
      "Tilting the ground toward the sun buys far more energy at fifty degrees of latitude than at thirty. What accounts for the difference?",
      ["The sun sits lower at high latitude, so a slope faces it more squarely",
       "High-latitude air holds more moisture, which traps heat against the slope",
       "Days are shorter at high latitude, so each hour of sunshine must do more work",
       "Soils at high latitude are darker and absorb more of the energy reaching them"], 0,
      "Energy per square metre depends on the angle at which light strikes the ground, and the closer that angle comes to perpendicular the more of the beam a given patch of ground collects. Near the equator the sun is close to overhead and a slope gains almost nothing, which is why aspect is an obsession on the Mosel and an irrelevance in Mendoza, where elevation does the work instead."),
    Q("Slope, aspect, elevation and cold-air drainage",
      "Set sunlight aside: the celebrated sites in steep regions still sit on the slope rather than on the flat ground below it. What has gravity done to those two soils over the centuries?",
      ["Fine material has washed downhill from the slope to the flat",
       "Rainfall totals are higher on slopes than on valley floors",
       "Slopes accumulate a deeper topsoil than the ground below them",
       "Slopes hold more organic matter, so hillside vines are better fed"], 0,
      "Erosion strips clay and organic matter off a gradient and dumps it at the bottom, so the slope keeps a thin, stony, poor profile and the valley floor collects the richness. Poor and thin is what restrains vigour, which is why the hillside is planted and the fertile flat is left to other crops."),
    Q("Slope, aspect, elevation and cold-air drainage",
      "Vineyards planted within a few degrees of the equator ought to lose all their acidity, and above two thousand metres they do not. Which feature of high tropical sites rescues them?",
      ["A very wide diurnal swing", "A short growing season",
       "A pronounced winter dormancy", "Long summer daylight hours"], 0,
      "Thin air at altitude radiates its heat away fast after sunset, so tropical highland sites can run twenty degrees between afternoon and dawn. Nothing else is available to them: there is no winter to enforce dormancy and no seasonal variation in day length at all, so the diurnal swing is doing all of the work."),
    SA("Slope, aspect, elevation and cold-air drainage",
       "Climbing a hillside costs a vineyard about six-tenths of a degree of mean temperature for every hundred metres gained. Name that rate of cooling with height.",
       "The lapse rate",
       ["lapse rate", "environmental lapse rate", "adiabatic lapse rate",
        "temperature lapse rate"],
       "The figure is why elevation substitutes for latitude: three hundred metres up is worth roughly two degrees, which is a large slice of the difference between one growing season band and the next. It is also why altitude is the standard answer to a warming climate in regions that have run out of cooler latitudes to move to."),
    SA("Slope, aspect, elevation and cold-air drainage",
       "On a still clear night the coldest air in a valley collects on the floor, while the ridge top cools by exposure, leaving a warmer band lying between them. What do growers call that band?",
       "The thermal belt",
       ["thermal belt", "thermal zone", "thermal belt of the slope", "the warm thermal belt"],
       "Mid-slope sits above the pooled cold air and below the exposed summit, which is why the oldest vineyards on a hillside are so often in the middle third of it. The belt is a frost-season phenomenon and it moves with the depth of the cold pool, so its lower boundary is worth marking in a bad spring rather than assuming."),
    SA("Slope, aspect, elevation and cold-air drainage",
       "Dense cold air slides downhill under gravity on a windless night, behaving far more like water than like wind. Meteorology has a name for that downslope flow. Give it.",
       "Katabatic flow",
       ["katabatic flow", "katabatic wind", "katabatic drainage", "katabatic"],
       "Because it behaves like a fluid, anything that dams it matters: a solid wall, a dense hedge or an embankment across the bottom of a slope will pond cold air behind it and turn a safe site into a frost trap. The remedy is usually to open a gap rather than to buy machinery."),

    # ------------------------------------------- Water, fog and rain shadow (5) -
    Q("Water, fog and rain shadow",
      "Rainfall on the seaward flank of a coastal range routinely runs to three times the total recorded a short distance inland. Which process concentrates it there?",
      ["Orographic lift", "Convection over warm ground", "Katabatic drainage",
       "A collision of warm and cold fronts"], 0,
      "Air forced up over the barrier cools as it expands, passes its dew point and drops its moisture on the windward side. Everything downwind is then working with air that has already been wrung out, which is the whole mechanism behind a rain shadow."),
    Q("Water, fog and rain shadow",
      "A summer marine layer pushes through gaps in a coast range and lies over the vineyards until late morning. What does that fog most directly buy the fruit?",
      ["A cooler, shorter effective day",
       "A measurable increase in growing-season rainfall",
       "A rise in ultraviolet exposure that thickens the skins",
       "A supply of nitrogen deposited out of the marine air"], 0,
      "The fog caps the temperature and cuts the hours of full sun, so sugar accumulates slowly and acid holds while flavour and tannin catch up. It is a cooling mechanism that works in a region with no rain at all in summer, which is why the coldest sites in California can sit at the latitude of North Africa."),
    SA("Water, fog and rain shadow",
       "Winter survival in Ontario's Niagara Peninsula depends on Lake Ontario, but the moderated air has to be held over the vineyards by a landform standing behind them. Name it.",
       "The Niagara Escarpment",
       ["niagara escarpment", "escarpment", "niagara escarpment in ontario"],
       "The escarpment traps lake-warmed air on the bench between rock face and shoreline and sets up a circulation that keeps it moving over the vines. Water alone is not enough this far into a continental winter: without the wall behind it the moderated air would simply drain away inland."),
    SA("Water, fog and rain shadow",
       "Air that has already dumped its moisture climbing the windward slope arrives on the far side warm, dry and gusting, and the Alpine name for that wind is used across the wine world. Give it.",
       "Foehn",
       ["foehn", "fohn", "foehn wind", "fohn wind"],
       "The air warms as it descends and is compressed, and having lost its water on the way up it arrives far drier than it began. Alto Adige and the Valais both bank on it to dry the canopy and finish ripening, and it is the same physics as the Chinook and the Zonda under different names."),
    SA("Water, fog and rain shadow",
       "Moist air moving horizontally over a surface colder than its own dew point produces fog with no overnight cooling of the ground involved at all. Name that class of fog.",
       "Advection fog",
       ["advection fog", "advective fog", "sea fog"],
       "Advection fog needs wind to keep the moist air arriving, so it forms and persists in conditions that would blow radiation fog away. That is why coastal fog rolls in during the afternoon and evening while river-valley radiation fog appears at dawn and burns off by mid-morning."),

    # ------------------------------------- Frost, hail and vintage extremes (6) -
    Q("Frost, hail and vintage extremes",
      "A wind machine turned all night and the crop froze anyway, because the cold had arrived as a freezing air mass under cloud with a stiff breeze behind it. What did the machine have nothing to work with?",
      ["A warmer layer of air sitting above the vineyard for it to pull down",
       "Enough fuel to run through to dawn",
       "Sprinkler nozzles at ground level",
       "An outlet at the base of the slope for cold air to escape through"], 0,
      "A wind machine does not heat anything; it mixes down the warm air of a nocturnal inversion. An advective freeze is a whole cold air mass arriving horizontally, so the air aloft is cold too and there is nothing above the vineyard worth fetching, which is why advective events are the ones nobody can defend against."),
    Q("Frost, hail and vintage extremes",
      "Once ice has formed on the buds the sprinklers must not be switched off until it thaws, and stopping early does more damage than never starting. Why?",
      ["Melting and evaporation then pull heat out of the bud",
       "The ice sheet cracks and severs the shoot",
       "The added water washes sugars out through the bud scales",
       "Wet buds attract downy mildew before dawn"], 0,
      "Protection comes from the latent heat given up as water freezes, which holds the bud at about zero as long as fresh water keeps arriving and keeps freezing. Cut the supply and the latent heat runs the other way: evaporation from the wet ice, and melting behind it, take heat back out of the bud they were protecting and drive it below the temperature it would have reached unprotected."),
    Q("Frost, hail and vintage extremes",
      "A run of forty-degree afternoons in midsummer stalls a vineyard rather than pushing it forward. Which response of the vine produces the stall?",
      ["Stomata close and carbon uptake stops",
       "The vine flowers for a second time",
       "Malic acid is synthesised rather than respired",
       "Root growth accelerates in search of water"], 0,
      "Above the mid-thirties the vine closes its stomata to defend against losing water it cannot replace, and that shuts down carbon dioxide uptake at the same time. Sugar accumulation therefore pauses while acid continues to be burnt off, which is how a heatwave manages to deliver unripe flavours and flabby wines together."),
    SA("Frost, hail and vintage extremes",
       "Clear sky, dry air and no wind: the ground gives up its heat to space, bud height falls below zero, and the air a few metres up stays mild. What kind of frost is that?",
       "Radiation frost",
       ["radiation frost", "radiative frost", "radiational frost", "frost by radiation"],
       "Longwave radiation escapes to space unimpeded on a clear night, cooling the surface faster than the air above it and setting up an inversion. That inversion is what every defence exploits, whether by mixing the warm layer down with fans and helicopters or by adding heat underneath it with burners."),
    SA("Frost, hail and vintage extremes",
       "Silver iodide fired into an approaching storm cell is meant to multiply the ice nuclei so that whatever forms stays small. Which vineyard hazard is being fought?",
       "Hail",
       ["hail", "hailstorm", "hailstorms", "hail storm", "hail storms", "hailstone",
        "hailstones", "hail stone", "hail stones", "hail damage", "damage from hail"],
       "Seeding does not stop the storm; it tries to share the available moisture among more and therefore smaller stones that melt before landing. The evidence for it is contested, which is why growers who can afford the outlay put the money into netting instead, a physical barrier over the fruit being the one defence whose effect can actually be measured.",
       ex=True),
    SA("Frost, hail and vintage extremes",
       "A region whose growing-season weather barely shifts from year to year makes dependable wine but lacks something collectors prize in Burgundy and the Mosel. Name what it lacks.",
       "Vintage variation",
       # Every entry is a '~' whole phrase, and that is load bearing. matchSA
       # tests the tilde branch before it reaches ex, so these keep whole-phrase
       # containment while ex=True kills the truncation branch that let the bare
       # stem phrase "year to year" score. Adjective and tail forms therefore
       # still grade; the stem echo does not, because it is nobody's whole phrase.
       ["~vintage variation", "~vintage variations", "~vintage variability",
        "~variation between vintages", "~variability between vintages",
        "~variation between years", "~variability between years",
        "~year to year variation", "~year to year variability",
        "~variation from year to year", "~variability from year to year",
        "~vintage to vintage variation", "~variation from vintage to vintage",
        "~variability from vintage to vintage"],
       "Marginal climates sit near the edge of ripening, so a degree either way rewrites the whole harvest and the vintage chart becomes worth reading. Reliability and vintage character are two ends of one trade, which is why the same weather pattern is a commercial virtue in one region and a collector's disappointment in another.",
       ex=True),

    # ----------------------------------------------- Limestone, chalk and marl (5)
    Q("Limestone, chalk and marl",
      "Roots in a chalk soil never drown, though the rock beneath them is holding a great deal of water. Which combination of properties allows both to be true?",
      ["Very high porosity, with fissures that drain freely",
       "A dark colour, which evaporates surface water quickly",
       "A high clay fraction, which binds water into a gel",
       "Strong alkalinity, which stops roots taking up excess water"], 0,
      "Chalk can hold a third of its volume as water in pores too fine to release it to gravity, while the joints and fissures running through it carry surplus water straight down. The vine therefore gets a slow reserve through a dry summer without ever sitting in standing water, which is the combination almost no other rock offers."),
    Q("Limestone, chalk and marl",
      "A Burgundian points at a bed of roughly equal parts limestone and clay and calls it the best ground he has. Which rock has he named?",
      ["Marl", "Flysch", "Loess", "Gypsum"], 0,
      "Marl is a limestone and clay mixture, and it combines the water reserve and nutrient holding of clay with the drainage and structure of limestone. Pure clay would be too cold and too wet and pure limestone too thin, which is why the marl bands on a slope so often carry the best-regarded parcels."),
    SA("Limestone, chalk and marl",
       "Leaves yellow between veins that stay green, on a block where the active lime reads very high, and no fertiliser regime corrects it. Name the disorder.",
       "Iron chlorosis",
       ["iron chlorosis", "lime induced chlorosis", "lime induced iron chlorosis",
        "iron deficiency", "iron deficiency chlorosis", "ferric chlorosis",
        "chlorosis from lime", "lime chlorosis"],
       "Iron is present in the soil but locked into forms the root cannot take up at high pH, so adding more of it to the ground achieves nothing. The durable fix is a lime-tolerant rootstock at replanting, which is why chalk regions rely on a narrow group of berlandieri crosses rather than on the whole rootstock catalogue."),
    SA("Limestone, chalk and marl",
       "A grey marl studded with small comma-shaped fossil oysters runs from Chablis northeast into the Aube and surfaces again on the Dorset coast. Name the geological stage.",
       "Kimmeridgian",
       ["kimmeridgian", "kimmeridgian marl", "kimmeridgien", "kimmeridgian limestone"],
       "The stage is named for Kimmeridge in Dorset, and the little oyster is Exogyra virgula, which is why the soil is sometimes described by the fossil rather than the age. The younger Portlandian limestone lying above it is harder and purer and gives a leaner, less generous wine, and the boundary between the two is argued over vineyard by vineyard."),
    SA("Limestone, chalk and marl",
       "A brilliant white soil in Jerez crusts over as it dries, sealing the winter rain beneath it through a rainless summer. Name that soil.",
       "Albariza",
       ["albariza", "albariza soil", "albarizas", "albariza chalk"],
       "The crust cuts evaporation from a profile that may hold most of a year's water by March, in a region that will get almost none between May and September. Its whiteness does a second job, bouncing light back into a low canopy, and the clay barros and the sandy arenas around it do neither well."),

    # ------------------------------------------ Clay, gravel, sand and loess (6) -
    Q("Clay, gravel, sand and loess",
      "Deep gravel banks were chosen in the Medoc for reasons that have nothing to do with what the stones contain. Which reason?",
      ["They drain fast and warm quickly",
       "They are unusually rich in potassium",
       "They hold water far into a dry summer",
       "They are the one soil phylloxera cannot enter"], 0,
      "Gravel is chemically close to inert; its contribution is physical. Fast drainage forces roots deep to find the clay beneath, and a stony surface warms early and stays warm, which is precisely what a variety that ripens late and hates wet feet needs."),
    Q("Clay, gravel, sand and loess",
      "Planted on heavy clay, an early-ripening variety comes in later and fleshier than the same variety on the gravel next to it. Which property of clay causes the delay?",
      ["It holds water and warms slowly",
       "It reflects light back into the canopy", "It raises soil pH sharply",
       "It confines roots to the top twenty centimetres"], 0,
      "Water has a high heat capacity, so a wet soil takes far longer to warm than a dry stony one, the root zone stays cold well into spring and the whole cycle from budbreak onward is pushed back. The same water reserve is what fills the berry and gives the wine its flesh, so the delay and the texture arrive together."),
    Q("Clay, gravel, sand and loess",
      "Ungrafted vinifera survives in a handful of European pockets where every neighbouring vineyard had to be replanted on American roots. Which soil explains those pockets?",
      ["Deep sand the louse cannot cross",
       "Chalk, whose high pH kills the louse",
       "Volcanic ash, which is sterile", "Heavy clay, which is airless"], 0,
      "Phylloxera needs to tunnel through soil to reach roots, and sand collapses behind it so the galleries cannot hold. The protection is a matter of physics rather than chemistry, and it fails as soon as the sand is mixed with enough silt or clay to hold a structure."),
    SA("Clay, gravel, sand and loess",
       "Wind-blown silt piled up during the ice ages gives deep, pale, free-draining soils that are easy to work, along the Danube and in eastern Washington. Name that material.",
       "Loess",
       ["loess", "loess soil", "aeolian loess", "loess deposit"],
       "Loess is a windborne dust deposit, so its particles are uniformly fine and unsorted by water, which is why it stands in vertical faces when cut and why it drains well despite being fine-grained. It is fertile and deep, so vigour rather than drought is the problem it sets a grower."),
    SA("Clay, gravel, sand and loess",
       "A thin layer of iron-stained red clay sitting straight on a limestone pan is the whole of Coonawarra's reputation. Name that soil.",
       "Terra rossa",
       ["terra rossa", "terra rosa", "terra rossa soil", "red earth over limestone"],
       "The red comes from iron oxide left behind as the limestone beneath weathers away, and the layer is often only a few tens of centimetres deep. Its value is the combination of a shallow warm rooting zone above a limestone reservoir the roots can crack into, and the strip where it occurs is narrow enough to be mapped by colour from the road."),
    SA("Clay, gravel, sand and loess",
       "The Medoc's gravel was not laid down by the Gironde itself: ice-age rivers carried it from the Pyrenees and the Massif Central. What is the general term for a river-laid deposit of that kind?",
       "Alluvium",
       ["alluvium", "alluvial deposit", "alluvial gravel", "alluvial", "fluvial deposit"],
       "Alluvium is anything a river drops when it loses the energy to carry it, and the coarsest material travels furthest only when the flow is strongest. Successive glacial melt pulses laid the Medoc terraces at different heights, which is why the oldest and highest gravel banks are also the poorest and the most highly rated."),

    # ---------------------------------- Schist, granite and volcanic ground (5) -
    Q("Schist, granite and volcanic ground",
      "Blue-black slate on a Mosel slope stores heat, and the way the rock has fractured does a second job for a region living on the edge of ripening. What is that second job?",
      ["Rain drains through the fissures and roots follow",
       "It supplies nitrogen to the vine",
       "It shields the fruit from ultraviolet light",
       "It buffers the soil to a high pH"], 0,
      "Slate splits along cleavage planes, so a weathered slope is a mass of tilted plates with routes between them. Water disappears fast and roots go a long way down, which is how vines on a slope with almost no soil survive a dry summer; the rock is acidic, so any talk of high pH belongs to limestone instead."),
    Q("Schist, granite and volcanic ground",
      "Weathered granite gives a coarse, pale, acidic sand that is quick to warm and holds very little. Which consequence for the vine follows most directly?",
      ["Restrained vigour and small berries",
       "High vigour and large berries", "A pronounced delay in budbreak",
       "Chlorosis from excess active lime"], 0,
      "Granite weathers into gruss, a gritty sand with poor water and nutrient holding, so the vine is naturally held in check without any intervention. It is acidic ground, so lime-induced chlorosis is the one disorder it will not produce, and rootstocks chosen for granite are picked for drought tolerance rather than lime tolerance."),
    Q("Schist, granite and volcanic ground",
      "Volcanic soils get the credit for smoke and salinity in the glass, but their reliable agronomic advantage is a good deal more prosaic. What is it?",
      ["They are deep and free-draining but still hold water",
       "They are rich in both nitrogen and available phosphorus",
       "They are strongly alkaline",
       "They suppress fungal disease in the canopy"], 0,
      "Ash and pumice weather into a light, open profile that takes water in fast and gives it back slowly, which is a rare combination. Fresh ejecta carry almost no nitrogen, and the allophane that forms as they weather binds phosphate so hard that phosphorus availability is the classic limit on volcanic ground; the flavour claims made for these soils are far harder to demonstrate than the drainage is."),
    SA("Schist, granite and volcanic ground",
       "Slate taken deeper, under more heat and pressure, recrystallises into a coarser rock whose mica flakes catch the light, and it carries Priorat and the Douro. Name it.",
       "Schist",
       ["schist", "schist rock", "mica schist", "metamorphic schist"],
       "Slate, schist and gneiss are one metamorphic sequence at increasing grade, so the practical difference is grain size and how the rock breaks. Schist splits into plates a root can force apart, which is what lets vines reach water through several metres of rock in regions with almost no summer rain. Priorat's llicorella sits nearer the slate end of that sequence and is called schist in the trade anyway, which is a fair warning that vineyard soil names are usage rather than petrology."),
    SA("Schist, granite and volcanic ground",
       "A dark soil and a pale soil take in the same sunshine, and the dark one runs several degrees warmer at the surface. Name the measurable property that differs.",
       "Albedo",
       ["albedo", "reflectivity", "surface albedo", "solar reflectance"],
       "Albedo is the fraction of incoming radiation a surface throws back, so a low-albedo dark soil converts more of it into heat and a high-albedo pale one returns it. The returned light is not wasted: chalk and albariza bounce it up into a low canopy, which is a real advantage where the sun angle is poor or the vines are trained close to the ground."),

    # ---------------------------------------- Drainage, water stress and vigour (5)
    Q("Drainage, water stress and vigour",
      "Mild water shortage after veraison is sought deliberately in red wine vineyards rather than avoided. What does the shortage do to the berry?",
      ["Berry expansion stops early",
       "Malic acid rises sharply", "Skins thin, so colour extracts faster",
       "A second flowering is triggered"], 0,
      "A berry that stops swelling ends up small, so its skin-to-pulp ratio is high and there is proportionally more colour and tannin per unit of juice. Timing is the whole art: a deficit before veraison works on shoot growth and berry size rather than on ripening, and a severe one at any stage shuts photosynthesis down and leaves the fruit unripe."),
    Q("Drainage, water stress and vigour",
      "Fruit buried in an over-large canopy stays herbaceous even in a warm season. Which soil description most often lies behind a canopy like that?",
      ["Fertile and deep, with a reliable water supply",
       "A shallow stony profile over fractured rock", "A very high active-lime content",
       "A coarse sand with almost no organic matter"], 0,
      "Water and nitrogen together drive shoot growth, and a vine that keeps growing after veraison shades its own fruit and competes with it for sugar. Shaded bunches keep their methoxypyrazines and never build colour, which is why vigour control on rich sites matters more than any cellar decision taken afterwards."),
    Q("Drainage, water stress and vigour",
      "Not all the water a soil holds is available to the vine. Which pair of measurements brackets the portion that is?",
      ["Field capacity and permanent wilting point", "Bulk density and total porosity",
       "Cation exchange capacity and soil pH", "Surface albedo and infiltration"], 0,
      "Field capacity is what a soil retains after gravity has drained it; the permanent wilting point is where the remaining water is held too tightly for roots to extract. The gap between them is the reserve a vine can actually draw on, and it is why a deep clay can carry a vine through a drought that kills one on shallow gravel."),
    SA("Drainage, water stress and vigour",
       "Clay's ability to hold nutrients as well as water comes from an electrical charge on the surface of its platelets, and soil analysis reports it as a single figure. Name that figure.",
       "Cation exchange capacity",
       ["cation exchange capacity", "cation exchange",
        "cation exchange capacity of the soil", "cation exchange capacity cec",
        "base exchange capacity", "cec"],
       "Clay platelets carry a net negative charge, so they hold positively charged nutrients such as potassium, calcium and magnesium against being washed out. Sand and gravel have almost none of it, which is why nutrition on a gravel bank has to be managed rather than assumed and why clay is the fertility half of any soil description."),
    SA("Drainage, water stress and vigour",
       "Water is applied at less than the vine's full demand from fruit set onward, holding it under mild stress rather than relieving it. Name that irrigation strategy.",
       "Regulated deficit irrigation",
       ["regulated deficit irrigation", "deficit irrigation", "controlled deficit irrigation",
        "regulated deficit", "regulated deficit irrigation rdi", "rdi"],
       "The point is to keep the vine slightly short of water at the stages when shoot growth should stop, then hold it there rather than letting it swing between drought and flood. It demands real measurement, whether by soil probe or by reading the vine's own water status, because the margin between useful stress and shutdown is narrow.",
       ex=True),

    # ------------------------------------------- Rootstock as a soil decision (3)
    Q("Rootstock as a soil decision",
      "A block on very high active lime yellows between the veins year after year, and replanting is the only remedy left. Which rootstock property should the new vines be chosen for?",
      ["Tolerance of active lime", "Drought tolerance", "Nematode resistance",
       "The ability to confer high vigour"], 0,
      "Lime tolerance is a species trait: Vitis berlandieri evolved on Texan limestone and carries it, while riparia and rupestris parentage does not. That is why chalk and limestone regions plant a narrow group of berlandieri crosses, and why importing a rootstock that performs well on granite is a reliable way to produce a chlorotic vineyard."),
    Q("Rootstock as a soil decision",
      "Replanting a deep, fertile, irrigated site is one of the few situations where a high-vigour rootstock is the wrong call. Which of these is the vigorous choice to avoid?",
      ["110R", "Riparia Gloire", "420A", "101-14"], 0,
      "110 Richter is a berlandieri and rupestris cross bred for drought tolerance and deep rooting, and it pushes growth hard on a site that does not need pushing. Riparia Gloire, 420A and 101-14 are all low-vigour rootstocks, which is exactly what a rich, well-watered soil calls for."),
    SA("Rootstock as a soil decision",
       "Sandy soils suit a family of microscopic roundworms that feed on vine roots, the worst of which also carry fanleaf virus between them, and rootstock choice is the standard defence. Name the pest.",
       "Nematodes",
       ["nematodes", "nematode", "root knot nematodes", "dagger nematodes",
        "xiphinema", "xiphinema index"],
       "Root-knot nematodes damage the root system directly, while the dagger nematode does its real harm as a vector for grapevine fanleaf virus. Sand is the classic problem soil because the pest moves through it easily, which is the irony of a soil that keeps phylloxera out."),

    # -------------------------- What terroir explains and what it does not (3) --
    Q("What terroir explains and what it does not",
      "Vines take up almost none of what a taster calls minerality, which is the strongest objection to reading terroir straight off a geological map. Which account does the evidence support instead?",
      ["Soil acts on wine through water supply and vigour",
       "Dissolved rock travels up the sap and reaches the glass directly",
       "Soil has no measurable effect on the finished wine",
       "Flavour compounds pass from stone into the berry through the leaves"], 0,
      "Mineral ions taken up by the root are present in wine at concentrations far below any sensory threshold, so the stone is not being tasted. What the soil demonstrably controls is how much water and nitrogen the vine gets and therefore how vigorous it is, and vigour drives berry size, canopy density and ripeness, which are tasted very clearly indeed."),
    SA("What terroir explains and what it does not",
       "European law folds into terroir something that is neither weather nor rock: the accumulated local decisions about variety, training, pruning and picking date. Name that component.",
       "The human factor",
       ["human factor", "human element", "savoir faire", "the human component"],
       "The INAO definition explicitly includes human practices, which is why an appellation can specify pruning method and yield alongside its boundary. It also settles an old argument honestly: a delimitation records where growers have historically succeeded, so the map is partly a record of human choice rather than a pure reading of the ground."),
    SA("What terroir explains and what it does not",
       "Of everything gathered under the word terroir, one component has by far the largest measured effect on wine style, and it is not the rock. Name it.",
       "Climate",
       ["climate", "climate of the site", "site climate", "growing season climate"],
       "Move a variety across a growing season temperature band and the wine changes beyond recognition; move it across a soil type within one climate and the change is real but far smaller. Soil earns its reputation because within a single climate it is the variable that remains, which is exactly the situation on a Burgundian slope where every other factor is held constant.",
       ex=True),
]
