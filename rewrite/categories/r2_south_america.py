"""Rank II rewrite - South America (23 questions: 10 MC, 13 short answer).

Certified level, pitched deliberately above the Rank I South America category.
Rank I places the countries, the currents and the signature grapes; this file
owns what sits underneath them: the 2011 zone terms as Chilean law, the old-vine
secano and its revival, why an unthreatened vineyard still grafts, the Uco
Valley's soils and water, the GI ladder, and the Atlantic edge of the continent.
Nothing here repeats a Rank I task.

The running order follows the continent's water. Chile first, read east to west
the way its law now reads it, then down into the dry-farmed south; across the
Andes to Argentina, where height does the work the ocean does elsewhere and the
water has to be found underground; and finally out to the Atlantic coast, where
Uruguay and Brazil farm the one climate the other two engineered away.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards by check-similarity.py.

Accept lists are built against lib.match_sa, the port of core.js matchSA, and
were verified by executing a probe script rather than by eye: every displayed
answer and several natural phrasings of it must grade True, and every real
wrong answer worth naming - Moscatel rosada against Moscatel de Alejandria,
Bio-Bio against Malleco, parral against latada, limestone against caliche,
snowmelt against groundwater - must grade False. The two '~' entries,
'~microoxygenation' and '~groundwater', match exact or whole-word only, and
neither token recurs anywhere else in the category, so neither can swallow a
wrong answer. '~groundwater' earns its tilde: listed plainly it graded the bare
stem word 'water' as a correct truncation, and the tilde refuses that while
every real phrasing built on the word still grades. ex=True is applied only
where a real and different grape extends the right answer as a qualified
phrase; the probe script is the record of what was tested. Facts are restricted
to ones that do not drift: decrees, geology, varieties and founding dates
rather than hectares, prices or ownership.

A note for the next pass over this file, because the mistake has been made once
already. ex=True is NOT a general-purpose way to close a stem echo. It forfeits
containment for every entry in the list at once, which is fatal wherever the
correct-answer class is open rather than enumerable - the Uco irrigation
question is the example, where the right answer can be phrased as any sentence
naming the aquifer, the boreholes or the wells. Close such an echo on the one
entry that carries it, with a tilde, and leave the rest of the list alone.
"""

from lib import Q, SA

CAT = "South America"
SLUG = "r2-south-america"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("Chile: the bands and the map", 3),
    ("Chile: the old-vine south", 3),
    ("Chile: Carmenere and ungrafted vines", 2),
    ("Argentina: elevation as the variable", 5),
    ("Argentina: the GI ladder, Torrontes and Patagonia", 4),
    ("Uruguay: Tannat on an Atlantic coast", 3),
    ("Brazil: Serra Gaucha and its sparkling wines", 3),
]

BANK = [
    # ------------------------------------ Chile: the bands and the map (3) ---
    Q("Chile: the bands and the map",
      "Morning fog off the Pacific reaches a Colchagua vineyard planted in the coastal hills, and the producer wants the label to say so. Which complementary term, written into Chilean law in 2011, applies?",
      ["Costa", "Entre Cordilleras", "Andes", "Secano Interior"], 0,
      "The 2011 decree added three official zone terms because Chile's valley names run from the mountains to the sea and lump cold coastal fruit in with warm inland fruit. Costa marks the maritime band, so a Colchagua Costa Sauvignon Blanc announces a different wine from one grown an hour inland at Apalta. Secano Interior is a separate legal term for dry-farmed traditional areas, not one of the three zones."),
    SA("Chile: the bands and the map",
       "Snow-fed rivers cross Chile's wine country from the Andes to the ocean, and the valleys they cut run east to west rather than along the country's length. What are these valleys called?",
       "Transverse valleys",
       ["transverse valleys", "transversal valleys", "transverse river valleys",
        "east west valleys", "transverse"],
       "Each transverse valley samples every climate Chile has, from fog-cooled coast to Andean foothill, which is why a valley name alone says so little about a wine's style. The complementary zone terms added in 2011 exist to supply exactly the east-west information the valley names miss."),
    SA("Chile: the bands and the map",
       "Pinot Noir and Chardonnay ripen slowly around Traiguen, at the cold, rainy southern frontier where Chilean quality planting petered out for decades. Which valley is this?",
       "Malleco",
       ["malleco", "malleco valley"],
       "Malleco lies south of Bio-Bio in the Araucania, with rainfall Bordeaux would recognise and a season short enough that variety choice narrows to the early ripeners. A handful of pioneering vineyards around Traiguen made its reputation, and planting has since crept even further south."),

    # --------------------------------------- Chile: the old-vine south (3) ---
    SA("Chile: the old-vine south",
       "Granite hills around Guarilihue carry century-old, dry-farmed bush vines of Moscatel de Alejandria, for generations the backbone of one southern valley's everyday wine. Name the valley.",
       "Itata",
       ["itata", "itata valley", "valle del itata", "valle de itata",
        "itata in the south", "chile's itata valley"],
       "Itata's Moscatel de Alejandria went into bulk blends and the local jug trade for generations, and the same old vines now supply taut, saline whites for producers who farm them exactly as they were always farmed. Cinsault and Pais carry the red half of the same story.",
       ex=True),
    Q("Chile: the old-vine south",
      "A growers' pact in Maule sells old-vine Carignan under one shared trademark. What do its rules demand of the vineyards behind the label?",
      ["Old bush vines, dry-farmed, in Maule's secano",
       "Young drip-irrigated plantings on Andean gravel",
       "Organic certification and hand harvesting",
       "Grafted vines above five hundred metres"], 0,
      "VIGNO ties the trademark to head-trained, unirrigated vines of serious age in Maule's dry-farmed country, because the whole point is rescuing a patrimony that predates the modern industry. Each member bottles its own wine, so the name guarantees the farming rather than a house style."),
    SA("Chile: the old-vine south",
       "Southern taverns pour a cloudy, tart country wine, mostly Pais, sold young in jugs and demijohns and now fashionable in natural wine bars abroad. What is it called?",
       "Pipeno",
       ["pipeno", "pipeno wine"],
       "Pipeno is the smallholder wine of Itata, Bio-Bio and Maule, fermented simply and sold without pretension, and the natural wine movement adopted it as proof that Chile's south never stopped making honest wine. Its new cachet has put money back into exactly the old vineyards the revival needs."),

    # ---------------------------- Chile: Carmenere and ungrafted vines (2) ---
    Q("Chile: Carmenere and ungrafted vines",
      "Green capsicum keeps showing up in a Rapel Carmenere even in warm years. Which change in the vineyard attacks the problem at its source?",
      ["Open the canopy, ease late-season water and hold the fruit longer",
       "Shade the fruit zone completely so direct sun never touches the skins",
       "Pick earlier to keep the fruit fresh",
       "Replant on cool coastal ground"], 0,
      "Methoxypyrazines break down with sunlight on the fruit and with time on the vine, and Carmenere's late season plus its vigour on fertile, well-watered ground is what keeps them high. Shading and earlier picking both push in the wrong direction, and the cold coast would leave the variety greener still."),
    Q("Chile: Carmenere and ungrafted vines",
      "Despite facing no phylloxera at all, plenty of new Chilean vineyards go in grafted onto rootstock. What drives the choice?",
      ["Nematodes in old soils, and rootstocks bred for drought",
       "European buyers who insist on grafted vineyards before purchase",
       "Quarantine rules that admit only pre-grafted imported vines",
       "Grafted vines cost less to establish"], 0,
      "Root-knot nematodes build up in ground that has carried vines for decades, and no own-rooted vinifera resists them, while the right rootstock also spends scarce water more carefully. Freedom from phylloxera closes off one reason to graft, not every reason."),

    # ---------------------------- Argentina: elevation as the variable (5) ---
    Q("Argentina: elevation as the variable",
      "Tasted side by side, a Malbec from Gualtallary at sixteen hundred metres stands apart from one grown in Lujan de Cuyo at a thousand. Which shift does the extra height explain?",
      ["Firmer acidity and a tauter, less fleshy build",
       "Deeper colour and softer, riper tannin",
       "Higher alcohol from the stronger sunlight",
       "An earlier harvest by roughly a month"], 0,
      "Every hundred metres climbed cools the site the way a move poleward would, so the high Uco picks later, holds more natural acid and trades Lujan's plush mid-palate for tension and floral lift. Sunlight does intensify with altitude, but it thickens skins rather than pushing alcohol up."),
    SA("Argentina: elevation as the variable",
       "Pale crusts coat the stones under Gualtallary's vineyards, and marketing shorthand calls the district limestone country. Strictly, the pale material is a surface deposit of what?",
       "Calcium carbonate (caliche)",
       ["calcium carbonate", "caliche", "calcareous crusts", "calcareous crust",
        "calcrete", "carbonate crusts"],
       "The carbonate arrived dissolved in water and was left coating gravels and binding sand as caliche, rather than lying under the vines as a sedimentary limestone bedrock. It still does what growers want from lime-rich ground, restraining vigour and firming the wines, which is why the shorthand persists."),
    SA("Argentina: elevation as the variable",
       "Soil pits and the true edges of an alluvial fan, rather than any administrative line, fixed the boundary of a San Carlos GI in 2013, a first for Argentina. Name it.",
       "Paraje Altamira",
       ["paraje altamira", "altamira"],
       "Paraje Altamira was drawn around the fan of the Tunuyan river after growers commissioned soil mapping, putting geology above municipal convenience for the first time in an Argentine GI. The precedent stuck, and later Uco Valley GIs followed the same logic."),
    SA("Argentina: elevation as the variable",
       "Beyond the reach of Mendoza's old surface channels, the new plantings high in the Uco had to find their own water. What supplies their drip lines?",
       "Groundwater pumped from wells",
       # The stem prints the word 'water', and a plainly listed 'groundwater'
       # graded that bare truncation correct: matchSA's last branch takes an
       # input that is a substring of a single-token accept entry, so 'water'
       # rode inside 'groundwater'. The tilde is the repair. It keeps exact and
       # whole-word matching, so 'pumped groundwater' and 'they pump
       # groundwater' still grade, and it never reaches the substring branch,
       # so 'water' does not.
       #
       # ex=True was tried here and reverted. It closes the echo but forfeits
       # containment for EVERY entry, and the correct-answer class on this
       # question is open: 'boreholes sunk deep into the aquifer' is the
       # wording of this question's own explanation, and no enumeration covers
       # the free-form sentences a student actually writes. Measured against
       # this list, ex=True cost 260 correct phrasings.
       #
       # 'well' on its own is deliberately NOT listed. It is a real false
       # reject, but the only entry that could grade it is the bare four-letter
       # word, which then grades the whole word 'well' anywhere in an answer
       # and takes 'melted snow as well as rain' with it. The false accept is
       # worse than the false reject, so the singular stays out.
       ["~groundwater", "ground water", "wells", "boreholes", "bore hole",
        "well water", "aquifer", "underground water", "subterranean water"],
       "Boreholes sunk deep into the aquifer under the alluvial fans feed the drip network, metering water out vine by vine. Pumping is what made the high Uco plantable at all, and it is why groundwater regulation has become a live argument in Mendoza."),
    SA("Argentina: elevation as the variable",
       "High in the Calchaqui Valleys near Molinos, an estate founded in 1831 farms Malbec above 3,000 metres at its Altura Maxima site. Name the estate.",
       "Bodega Colome",
       ["colome", "bodega colome"],
       "Colome claims standing as Argentina's oldest working winery, and its Altura Maxima terraces are among the highest commercial vineyards anywhere. At that height the ultraviolet load is brutal and the nights are cold, which shows in wines of savage colour and acid."),

    # --------------- Argentina: the GI ladder, Torrontes and Patagonia (4) ---
    Q("Argentina: the GI ladder, Torrontes and Patagonia",
      "Beyond certifying where the grapes grew, Argentina's two DOCs impose something its ordinary geographical indications do not. What?",
      ["Production rules covering varieties, yields and ageing",
       "A guarantee that the wine was estate-bottled inside the zone",
       "Minimum cellar-door prices fixed each vintage",
       "A ban on irrigation"], 0,
      "An Indicacion Geografica in Argentina is a delimited origin and nothing more, while the DOC framework adds a rulebook in the European manner. Most producers have preferred the freedom of the IG, which is why only Lujan de Cuyo and San Rafael ever took DOC status and few wines invoke it even there."),
    Q("Argentina: the GI ladder, Torrontes and Patagonia",
      "Riojano, Sanjuanino and Mendocino all appear after the word Torrontes in Argentine ampelography. What is the actual relationship among the three?",
      ["Three distinct varieties, with Riojano the one that matters",
       "Three clones of a single variety, selected province by province",
       "One identical variety travelling under three provincial trade names",
       "Two table grapes and a wine grape that happen to share a name"], 0,
      "DNA work separates them into three different varieties rather than clones or synonyms, and Torrontes Riojano is the aromatic one that built Cafayate's reputation. Sanjuanino and Mendocino mostly feed the domestic and bulk trade, so a bottle labelled simply Torrontes is almost always Riojano."),
    Q("Argentina: the GI ladder, Torrontes and Patagonia",
      "Barely three hundred metres above sea level, Rio Negro's vineyards still make taut, fresh-fruited wine. What substitutes for the altitude Mendoza depends on?",
      ["Southerly latitude and the cool season it brings",
       "Cold Atlantic fog rolling up the valley each morning",
       "Limestone bedrock lying beneath the whole valley floor",
       "Meltwater irrigation straight off the Andes"], 0,
      "At thirty-nine degrees south the season is long, windy and cool, with wide day-night swings doing the freshening work that height does further north. The Atlantic lies hundreds of kilometres away across dry plateau, so no fog ever reaches the Alto Valle."),
    SA("Argentina: the GI ladder, Torrontes and Patagonia",
       "Trevelin and Sarmiento push Argentine viticulture to its southern limit, where a freeze can arrive in any month. Which province are they in?",
       "Chubut",
       ["chubut", "chubut province"],
       "Chubut sits south of Rio Negro's classic valleys, and its scattered plantings of Pinot Noir, Chardonnay and Riesling gamble on a season that barely closes. Otronia at Sarmiento, beside Lake Musters, farms some of the southernmost vineyards in the world."),

    # ---------------------------- Uruguay: Tannat on an Atlantic coast (3) ---
    Q("Uruguay: Tannat on an Atlantic coast",
      "Rain arrives in every season on Uruguay's vineyards, and no mountain wall or cold current shelters them. Which continental habit does the country therefore break?",
      ["Farming irrigated desert in a rain shadow",
       "Harvesting in the southern hemisphere autumn",
       "Building a reputation on one signature grape",
       "Bottling reds from a thick-skinned variety"], 0,
      "Chile and Argentina both farm arid land in the lee of mountains and supply the water themselves, while Uruguay's Atlantic climate reads more like Bordeaux: real rain, real vintage variation and humidity to manage. Dry-farming is the norm there, and disease pressure rather than drought sets the farming calendar."),
    SA("Uruguay: Tannat on an Atlantic coast",
       "Thin soils over granite near Punta del Este, cooled by the open South Atlantic, have drawn ambitious new wineries and Uruguay's best Albarino. Which department is this?",
       "Maldonado",
       ["maldonado", "maldonado department"],
       "Maldonado's rocky hills and sea wind give whites a salinity the clay of Canelones cannot match, and Albarino, at home on Atlantic granite in Galicia, has proved the shrewdest match for the place. Bodega Garzon put the department on the international map."),
    SA("Uruguay: Tannat on an Atlantic coast",
       "Tiny, measured doses of oxygen bubbled through young red wine were first engineered to tame Tannat, and Uruguayan cellars adopted the technique early. What is it called?",
       "Micro-oxygenation",
       ["micro oxygenation", "micro oxidation", "micro ox", "microbullage",
        "~microoxygenation"],
       "Patrick Ducournau worked it out in Madiran in the early 1990s, polymerising Tannat's tannins softer without waiting years in barrel, and Uruguay took it up for the same grape's same problem. Done well it rounds the wine; overdone it dries the fruit out, which is why the dose is metered in millilitres per litre per month."),

    # -------------------- Brazil: Serra Gaucha and its sparkling wines (3) ---
    SA("Brazil: Serra Gaucha and its sparkling wines",
       "Juice, jug wine and table grapes soak up most of Serra Gaucha's harvest, drawn from an American hybrid that out-plants any vinifera there. Name it.",
       "Isabel",
       ["isabel", "isabella", "isabel grape", "isabella grape"],
       "Isabel, the Isabella of nineteenth-century North America, shrugged off the Serra's rain and fungus where European vines struggled, and the immigrant families never stopped growing it. Brazilian law reserves the term vinho fino for wine made from vinifera, which is precisely the line Isabel cannot cross.",
       ex=True),
    Q("Brazil: Serra Gaucha and its sparkling wines",
      "Sweet, grapey and gently alcoholic, the espumante of Farroupilha answers Asti rather than Champagne. How is it put together?",
      ["Moscatel grapes, their sparkle raised in a tank",
       "Riesling Italico finishing its first fermentation inside the bottle",
       "Chardonnay and Pinot Noir refermented in the bottle",
       "Isabel juice carbonated at bottling"], 0,
      "Farroupilha holds a geographical indication specifically for its Moscatels, and fermenting the sparkle up inside a sealed tank preserves the grape's fresh perfume the way it does in Asti. The Serra's traditional-method houses work mostly with Chardonnay and Pinot Noir, so the two styles split the market between them."),
    SA("Brazil: Serra Gaucha and its sparkling wines",
       "Vines climb onto overhead frames well above head height across much of Serra Gaucha, a system the Italian settlers brought and kept for its generous yields. What is the system called there?",
       "Latada (pergola)",
       ["latada", "pergola", "overhead pergola", "pergola trellis"],
       "The latada, a full overhead pergola, carries the big crops the region's juice and jug trade depends on. Quality-minded estates have been converting to vertical espaldeira rows, trading volume for exposure, and the choice of trellis maps the split between the two industries almost exactly."),
]
