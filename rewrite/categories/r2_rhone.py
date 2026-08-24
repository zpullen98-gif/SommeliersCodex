"""Rank II rewrite - Rhone (33 questions: 15 MC, 18 short answer).

Certified level, pitched deliberately above the Rank I "Rhone" category. Where
Rank I names the grape that makes northern red, this asks what the decree demands
of the white grape sitting beside it in the vat; where Rank I places Condrieu on
the map, this asks which departments the map is cut into; where Rank I says the
galets hold heat, this asks what is underneath them that keeps the vine alive in
August. Nothing here repeats a Rank I task, and several obvious Rank II questions
were dropped precisely because Rank I had already taught the answer in an
explanation - the thirteen against eighteen varieties, the sandy sectors against
the stony ones, and Cornas admitting no white grape are all in the Introductory
bank and are therefore used here only as scenery.

The running order is one journey down the river, and at every stop the question
is what the rulebook demands rather than what the map shows: the terraces above
Ampuis, then Condrieu, then the hill of Tain, then the crus that finish the
north, then the co-fermentation rules that tie the two halves of the valley
together, then Chateauneuf as list and as ground, then the ladder the southern
villages climb, then the right bank and the sweet wines, and last the name itself
and how it came to be worth branding on a cask.

Written from the syllabus below. The imported bank was not read while writing; it
is read only afterwards, by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and were
verified by executing a probe script rather than by eye: for every short answer
the displayed answer, two natural rephrasings and a list of named wrong answers
were graded, and the wrong answers had to come back False. No '~' entries appear
anywhere, since the tilde is exact-OR-containment and a one-word tilde grades any
wrong answer holding that word. ex=True is used on thirteen questions, and eleven
of them were found only by running the probe rather than by reading:

  two percent     a threshold, which containment reads the same in both
                  directions, so "two percent maximum" graded a minimum.
  the Gard        "Gard and Vaucluse" is half right and swallows "Gard".
  Ermitage        matchSA's substring branch grades "Hermitage" against an
                  accepted "ermitage", which is the exact confusion the
                  question exists to test.
  Rhone/Loire/    an accept list of three departments grades "Loire and
  Ardeche         Ardeche", because two of three sit whole inside the phrase.
  Cotes du Rhone  "Cotes du Rhone" is a real and different appellation and it
  Primeur         sits whole inside "Cotes du Rhone Primeur".
  co-pigmentation "Pigmentation" sits inside the unhyphenated "copigmentation".
  lavender/thyme  "rosemary, lavender and thyme" adds a third shrub and still
                  carries the accepted pair whole inside it.
  the Rhone       a five-letter river name sits whole inside every hedge that
                  names it, so "the Durance, a tributary of the Rhone" graded
                  correct on the containment branch.
  Grenat          the stem names the oxidative style in the same sentence, so
                  the unresolved "Tuile or Grenat" carried "grenat" inside it.
  Safre           "safre and galets" hedges the right soil against a wrong one
                  and still carries "safre" whole inside it.
  Cairanne        "Cairanne Villages" and "Gigondas Villages" each display the
  Gigondas        exact misconception their question turns on, the step from
                  the Villages tier to a cru, and each carries the bare cru
                  name whole inside it.
  Grignan-les-    "Les Adhemar" is half the name, and producing the whole of
  Adhemar         it is the entire task.

Every one of those lists was then widened until case, article, hyphen, word-order
and unit variants of its own answer still grade, because exact matching rejects
anything not written down. Note that core.js norm() strips 'de', 'du', 'des',
'la' and 'le', which collapses several Rhone names into each other, so every list
was checked for entries normalising to the same string.

Facts are restricted to ones that do not drift: no ownership, no volumes, no
production shares, and no promotion more recent than a decade settled. Appellation
rules, label mechanics, geology and long-settled geography carry the weight.

Everything outside the CAT constant is unaccented ASCII. CAT itself must byte-match
the string the shipped app hardcodes in its France region list, in the codex5 topic
map and in the badge that tests s.cat('Rhone') at eighty, so it carries the one
circumflex permitted in this file.
"""

from lib import Q, SA

CAT = "Rhône"
SLUG = "r2-rhone"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("Cote-Rotie: the terraces above Ampuis", 3),
    ("Condrieu and the ground it shares", 3),
    ("The hill of Tain", 4),
    ("Crozes, Saint-Joseph, Cornas and Saint-Peray", 4),
    ("Co-fermentation and the white grape rules", 3),
    ("Chateauneuf-du-Pape: the list and the rulebook", 4),
    ("The ground beneath Chateauneuf", 3),
    ("From Cotes du Rhone up to cru", 4),
    ("The right bank and the sweet wines", 3),
    ("The name and the trade", 2),
]

BANK = [
    # -------------------------- Cote-Rotie: the terraces above Ampuis (3) ----
    Q("Cote-Rotie: the terraces above Ampuis",
      "Between the 1960s and the 1980s the delimited area above Ampuis grew several times over, and the growers who had stayed on the terraces objected to the ground being added. Where was that ground?",
      ["The flat plateau behind the top of the slope",
       "Alluvial islands and river flats at the foot of the terraces, where the soil runs deepest",
       "The left bank of the river, looking back at the terraces",
       "Terraces already replanted to Viognier for white wine"], 0,
      "The terraces had been abandoned by the hundred because no machine can work them, and planting the plateau behind was the only cheap way to enlarge the appellation. Fruit up there ripens later and rarely carries the perfume of the slope, which is why the appellation name alone now tells a buyer less than it once did."),
    SA("Cote-Rotie: the terraces above Ampuis",
       "Growers at Ampuis distinguish an old, small-berried, low-cropping local strain of the black grape from the high-yielding clones planted since the 1970s, and some print its name on the label. Give that name.",
       "Serine",
       ["serine", "serine syrah", "the serine selection", "serine massal selection"],
       "Serine is a massal selection rather than a separate variety, so it is Syrah to an ampelographer and something rather different in the vineyard: tiny bunches, small crops and a firmer, peppery wine. Growers replanting after the clonal wave of the 1970s went back to cuttings taken from old parcels to recover it, which is why the word turns up on labels at all."),
    SA("Cote-Rotie: the terraces above Ampuis",
       "A summer storm at Ampuis can strip the topsoil off a terrace in an hour, and a grower there reckons on more days a year at masonry than at pruning. What is being repaired?",
       "Dry-stone walls",
       ["dry stone walls", "dry stone wall", "dry stone retaining walls",
        "stone retaining walls", "dry stone terrace walls",
        "drystone walls", "drystone wall", "drystone retaining walls",
        "drystone terrace walls"],
       "The terraces are held by walls laid without mortar, and no machine can rebuild one; the labour is the reason so much of the slope went out of production in the middle of the twentieth century. Water that gets in behind a wall pushes it out, so the gaps between the stones are not sloppy work but the whole design."),

    # ------------------------------ Condrieu and the ground it shares (3) ----
    Q("Condrieu and the ground it shares",
      "A grower at Chavanay picks Viognier off one terrace and Syrah off the next, and bottles the two separately. Which pair of appellations do the wines carry?",
      ["Condrieu for the white and Saint-Joseph for the red",
       "Condrieu for the white and Cote-Rotie for the red",
       "Chateau-Grillet for the white and Cornas for the red",
       "Saint-Peray for the white and Crozes-Hermitage for the red"], 0,
      "Condrieu and Saint-Joseph overlap across several communes at the northern end of the valley, so a single hillside carries one name or the other according to what is planted on it. Cote-Rotie stops well short of Chavanay to the north, and Chateau-Grillet is a single enclosed amphitheatre a few kilometres upstream of it, at Verin and Saint-Michel-sur-Rhone, that no other grower may use."),
    Q("Condrieu and the ground it shares",
      "A sweet Condrieu appears on a list and a guest objects that the appellation covers dry white only. What is the position?",
      ["The decree permits a sweet wine from late-picked fruit, and a little is made most years",
       "The appellation is dry only, so the bottle must be labelled Vin de France",
       "Sweetness is allowed only in a vintage the syndicat declares for it",
       "The sweet wine exists but must go out as Chateau-Grillet"], 0,
      "Condrieu was historically as often sweet as dry and the decree still allows it, but the wines are rare because Viognier's acidity has usually collapsed by the time the sugar is high enough to be worth leaving. Look for moelleux or doux on the label, since the appellation name on its own will not tell you."),
    SA("Condrieu and the ground it shares",
       "Seven communes make Condrieu, and they fall in three different departments, one of which shares its name with a wine region three hundred kilometres to the north. Name the three departments.",
       "Rhone, Loire and Ardeche",
       ["rhone loire and ardeche", "rhone loire ardeche",
        "rhone ardeche and loire", "rhone ardeche loire",
        "loire rhone and ardeche", "loire rhone ardeche",
        "loire ardeche and rhone", "loire ardeche rhone",
        "ardeche rhone and loire", "ardeche rhone loire",
        "ardeche loire and rhone", "ardeche loire rhone",
        "rhone loire and ardeche departments",
        "rhone loire ardeche departments",
        "departments of rhone loire and ardeche",
        "departments of rhone loire ardeche",
        "departments of rhone ardeche and loire",
        "departements of rhone loire and ardeche"],
       "The town of Condrieu is in the Rhone, five of the seven communes are in the Loire, and Limony sits across in the Ardeche. The Loire here is the department named for the river's upper course through the Massif Central and has nothing to do with the Loire Valley's wines, and Chateau-Grillet, the enclave inside the Condrieu boundary, lies in it too.",
       ex=True),

    # ------------------------------------------------ The hill of Tain (4) ---
    Q("The hill of Tain",
      "A dessert wine turns up from the northern valley, made from bunches dried indoors on racks for weeks before a very slow pressing. Only one appellation there may produce it. Which?",
      ["Hermitage", "Cornas", "Crozes-Hermitage", "Saint-Joseph"], 0,
      "The straw wine is made from Marsanne and Roussanne raisined on mats or in ventilated lofts, then pressed through the winter, and the ferment can run for a year. Almost none of it leaves the region, but the Hermitage decree provides for it and no other decree in the valley does."),
    Q("The hill of Tain",
      "Almost all the granite of the northern valley lies on the right bank against the edge of the Massif Central, yet the hill behind Tain and the slopes running north from it stand on the left bank and are cut from the same rock. How did that rock get there?",
      ["The river shifted west and left a block of the Massif on its east bank",
       "It is a volcanic cone thrown up long after the Massif had formed",
       "It is a glacial erratic carried down and dropped by ice off the Alps",
       "It is an uplifted spur of the Alps that happens to share the mineralogy"], 0,
      "The Rhone once ran east of the hill and later cut a new course to the west of it, marooning a granitic spur of the Massif Central on the left bank. That is also why the hill faces due south while its neighbours face east, and why its fruit ripens so much more completely than theirs. The same stranded block carries on north behind Gervans and Serves, which is why the northern half of Crozes-Hermitage sits on granite while its southern half, out on the flat at Les Chassis, sits on glacial gravel."),
    SA("The hill of Tain",
       "At the very top of the hill above Tain, beside the chapel, lies a climat named for the solitary who is said to have lived up there. Give the name of that parcel.",
       "L'Hermite",
       ["l hermite", "lhermite", "hermite", "l ermite", "lermite", "ermite",
        "the l hermite climat"],
       "The hill's name and the parcel's name come from the same hermit. L'Hermite is the highest of the climats, on thin granite under a cap of windblown silt, and its wine is finer-boned than the wine off the bare granite lower down the western end. It is one of the parcel names most often printed under the appellation."),
    SA("The hill of Tain",
       "A white from the hill above Tain reaches the table with the appellation printed a letter shorter than the guest expects, and the importer insists the label is perfectly legal. What is that permitted spelling?",
       "Ermitage",
       ["ermitage", "ermitage aoc", "aoc ermitage", "the spelling ermitage",
        "spelled ermitage", "the ermitage spelling"],
       "The decree allows Hermitage and Ermitage alike, and Crozes-Hermitage may equally appear as Crozes-Ermitage. The older form dropped the initial letter and several estates have kept it. It is a spelling and nothing else, so it says nothing about the parcel, the style or the standing of the wine.",
       ex=True),

    # ------------------- Crozes, Saint-Joseph, Cornas and Saint-Peray (4) ----
    Q("Crozes, Saint-Joseph, Cornas and Saint-Peray",
      "Created in 1956 around a handful of villages, Saint-Joseph was enlarged in 1969 until it ran some fifty kilometres and took in a great deal of flat ground. What has the appellation been doing about that ever since?",
      ["Reviewing the delimitation parcel by parcel and pushing the vineyard back onto the slopes",
       "Splitting into a northern and a southern appellation under separate names",
       "Raising the permitted yield so the flat parcels can pay their way",
       "Adding a Villages tier for the granite core"], 0,
      "The 1969 enlargement was made when planting anywhere at all was encouraged, and it left the name attached to alluvial flats that never ripen Syrah properly. The revision runs parcel by parcel and takes decades, because a grower whose vines fall outside must either uproot them or sell the fruit under a lesser name."),
    Q("Crozes, Saint-Joseph, Cornas and Saint-Peray",
      "Saint-Peray's vineyard runs up to a crag crowned by a ruined fortress, and the rock of that crag sets the appellation apart from every slope upriver. What rock is it?",
      ["Limestone", "Basalt", "Gneiss", "Alluvial gravel"], 0,
      "Saint-Peray sits on granite along its northern edge and on limestone and clay beneath the crag of Crussol, which is why its whites carry a chalkier tension than the granite-grown whites further up the valley. Cornas, its immediate neighbour to the north, is the mirror image: granite throughout, one black grape, red wine and nothing else."),
    SA("Crozes, Saint-Joseph, Cornas and Saint-Peray",
       "One commune behind the hill of Tain is dug for a white clay that lines the bread ovens and pottery kilns of the region, and its vines sit on the same pale ground. Name the commune.",
       "Larnage",
       ["larnage", "the commune of larnage", "larnage behind tain"],
       "The white clay at Larnage is a kaolin weathered out of the granite, and growers call the soil terre blanche. It holds water where granite sand does not, so the whites off it are broader and the reds rounder than the wine off bare rock a few kilometres away. The commune carries Hermitage and Crozes-Hermitage vines alike."),
    SA("Crozes, Saint-Joseph, Cornas and Saint-Peray",
       "Syrah from young vines and Viognier grown outside every cru boundary in the northern valley go out under a geographical indication covering the hills either side of the river. Name it.",
       "Collines Rhodaniennes",
       ["collines rhodaniennes", "igp collines rhodaniennes",
        "the collines rhodaniennes igp", "vin de pays des collines rhodaniennes"],
       "It is the northern valley's safety net: a grower whose parcel falls outside Saint-Joseph or Cote-Rotie, or whose vines are still too young for the cru, sells the wine under it rather than losing the crop altogether. A good deal of serious northern Syrah appears under the name, so it is worth knowing rather than dismissing as a lesser tier. It is a zone indication and not a regional one: the regional IGP over the same ground is Comtes Rhodaniens, which reaches out to Savoie and the Bugey as well."),

    # -------------------- Co-fermentation and the white grape rules (3) ------
    Q("Co-fermentation and the white grape rules",
      "A tank of Viognier is fermented on its own at Ampuis and blended into the finished Syrah shortly before bottling, at well under the permitted share. What is the wine now?",
      ["Not Cote-Rotie: the white must ferment with the black, not be blended in later",
       "Cote-Rotie, since the Viognier is comfortably under the ceiling",
       "Cote-Rotie, provided both parcels lie inside the delimited area and share a vintage",
       "A rose in the eyes of the law, since blending a white wine into a red makes one"], 0,
      "The northern appellations that admit white grapes require them in the vat with the black, and the permission is for a co-ferment rather than for an assemblage. The two are genuinely different wines: white skins carried through the red fermentation change what comes out of it, which is why the rule is written that way rather than as a simple percentage."),
    Q("Co-fermentation and the white grape rules",
      "In the northern crus a white grape entering a red is capped at a stated share of the vat. What is the equivalent rule at Chateauneuf-du-Pape?",
      ["None: the white varieties sit on the same permitted list as the black",
       "White grapes are forbidden in the red altogether",
       "They are capped at five percent of the vat",
       "They are allowed only where the parcel is planted with both colours mixed together"], 0,
      "The decree lists the permitted varieties without separating them by colour or fixing any proportion between them, so a red may legally carry a good deal of Clairette, Bourboulenc or white Grenache. A few estates use a little for lift and most use none, but nothing in the rules obliges them either way."),
    SA("Co-fermentation and the white grape rules",
       "A red vinified with a proportion of white skins in the vat comes out deeper in colour than the same fruit without them, not paler. Name the effect responsible.",
       "Co-pigmentation",
       ["co pigmentation", "copigmentation", "colour co pigmentation",
        "colour copigmentation", "color co pigmentation", "color copigmentation",
        "co pigmentation of anthocyanins", "copigmentation of anthocyanins",
        "anthocyanin co pigmentation", "anthocyanin copigmentation",
        "the co pigmentation effect", "the copigmentation effect"],
       "Colourless compounds from the white grape stack with the anthocyanins and stabilise them, so a red co-fermented with a white grape is often deeper and steadier in colour than the same fruit vinified on its own. The aromatic lift growers talk about is a separate effect, and a great deal easier to smell than to measure.",
       ex=True),

    # --------------- Chateauneuf-du-Pape: the list and the rulebook (4) ------
    Q("Chateauneuf-du-Pape: the list and the rulebook",
      "One black grape planted in quantity right across the southern valley and the Languedoc is pointedly missing from the Chateauneuf-du-Pape list. Which?",
      ["Carignan", "Counoise", "Vaccarese", "Terret Noir"], 0,
      "Carignan crops heavily and ripens late, and the growers' charter that became this appellation set out to exclude exactly that sort of vine. It is permitted in Cotes du Rhone and in most of the southern crus, but never here. Counoise, Vaccarese and Terret Noir are all on the list and all barely planted, which is a quite different problem."),
    Q("Chateauneuf-du-Pape: the list and the rulebook",
      "Bush-trained Grenache at Chateauneuf-du-Pape stands far further apart than a vine in Burgundy or Bordeaux, and the appellation's minimum density is correspondingly low. What forces the wide spacing?",
      ["Each vine needs a large volume of dry soil",
       "The galets must be turned by machine between the rows each spring",
       "Close planting would stop the mistral drying the canopy",
       "A gobelet vine cannot be pruned in narrow rows"], 0,
      "Water rather than sunlight is the limiting resource on a stony southern plateau, and vines planted close together would leave every one of them short. Irrigation is not flatly banned here, whatever is often said: the decree allows it to be authorised, but an irrigated parcel has its permitted crop cut from 6,000 to 4,500 kilograms per hectare, so growers plant for drought rather than water their way out of it. The decree writes the density floor twice over. A vine in the square planting that gobelet vineyards use may occupy no more than four square metres, which comes out at 2,500 vines per hectare; a parcel planted in rows is held to 3,000 vines per hectare instead. Both sit far under the nine thousand a Cote d'Or village vineyard must carry, and neither rule sets a ceiling: a grower may plant as tightly as they can farm, and on the lighter soils some do."),
    SA("Chateauneuf-du-Pape: the list and the rulebook",
       "Every Chateauneuf-du-Pape grower must set aside a portion of the crop, which may not be made into appellation wine at all. Under the decree in force, what is the minimum that portion must reach?",
       "Two percent",
       ["two percent", "2 percent", "2%", "two per cent", "2 per cent",
        "two percent of the crop", "2% of the crop", "2 percent of the crop",
        "2 per cent of the crop", "two per cent of the crop",
        "two percent of the harvest", "2% of the harvest",
        "2 percent of the harvest", "2 per cent of the harvest",
        "two per cent of the harvest", "at least two percent",
        "at least 2 percent", "at least 2%", "at least two per cent",
        "at least 2 per cent", "a minimum of two percent",
        "a minimum of 2 percent", "a minimum of 2%", "minimum 2%",
        "minimum 2 percent", "minimum two percent", "2% minimum",
        "2 percent minimum", "two percent minimum",
        "2% of the volume claimed", "2 percent of the volume claimed"],
       "The sort is compulsory and may be done in the vineyard or at the cellar, and what it takes out is either destroyed or vinified as the rape, a wine the decree bars from carrying any geographical indication at all. The minimum rape stands at two percent of the volume claimed, in every vintage, so even a faultless year gives up its poorest fruit. Five percent is the figure most study guides still print, and it is not invented: the older rules set the bar there and the number was cut when the cahier des charges was rewritten. Carry the current figure with its date attached, and set it beside the appellation's low yields and its ban on the harvesting machine to see why the harvest regime here is among the most demanding in France.",
       ex=True),
    SA("Chateauneuf-du-Pape: the list and the rulebook",
       "The boundary of Chateauneuf-du-Pape was drawn in 1923 by a test taken from the wild plants on the ground: land qualified only where two aromatic shrubs of the garrigue grew of their own accord. Name them.",
       "Lavender and thyme",
       ["lavender and thyme", "thyme and lavender", "lavender thyme",
        "thyme lavender", "wild lavender and thyme", "wild thyme and lavender",
        "wild lavender and wild thyme", "wild thyme and wild lavender",
        "wild lavender wild thyme", "wild thyme wild lavender",
        "lavender and wild thyme", "wild lavender thyme", "wild thyme lavender"],
       "The reasoning was agronomic rather than romantic. Only ground poor enough, dry enough and hot enough for those two shrubs would ripen a vine properly, so the plants did the surveying. The same charter fixed a variety list, a minimum ripeness and a compulsory sort, and a decade later the national appellation system was built on that architecture.",
       ex=True),

    # ---------------------------- The ground beneath Chateauneuf (3) ---------
    Q("The ground beneath Chateauneuf",
      "A vine on the stone-covered plateau at Chateauneuf carries its crop through a rainless summer without wilting. What lies under the stones that makes that possible?",
      ["A deep bed of red clay holding water within reach of the roots",
       "A layer of chalk drawing moisture up to the surface",
       "A water table fed year round by the river",
       "Fissured granite storing rain in its cracks"], 0,
      "The stones are the part you can see, and they do cut evaporation and hold the day's heat, but the reservoir is the red clay underneath them. It is why a vine there can finish a summer that would stop a vine on light ground, and much of why the plateau gives the fullest wines of the appellation."),
    SA("The ground beneath Chateauneuf",
       "In the lighter sectors of Chateauneuf the topsoil sits on a soft yellow Miocene sandstone that roots drive straight into for water, and growers have a local word for it. Give the word.",
       "Safre",
       ["safre", "safres", "the safre subsoil", "safre sandstone",
        "the safre sand", "safre molasse"],
       "Safre is a weakly cemented marine sand, soft enough to break with a spade, and it is why parcels that look droughted are nothing of the kind. Wine grown over it is paler, more perfumed and finer in tannin than wine off the stone plateau, which is a large part of why single-parcel bottlings from those sectors have such a following.",
       ex=True),
    SA("The ground beneath Chateauneuf",
       "Alpine quartzite outcrops nowhere near Chateauneuf-du-Pape, yet the plateau is carpeted in it, standing well above the modern channel and well back from it. Which river's older and higher course laid the stones down there?",
       "The Rhone",
       ["rhone", "river rhone", "rhone river", "the ancient rhone",
        "the ancestral rhone", "the old rhone",
        "the ancient course of the rhone", "the old course of the rhone"],
       "The Rhone drains the Alps, and through the Quaternary glaciations it ran swollen with meltwater and loaded with rock torn off the mountains. It dropped that load, then cut down and swung west, leaving a staircase of terraces with the oldest and highest of them standing as the stone plateau and the younger gravels lying below it. Quartzite is far harder than any rock hereabouts, which is why the pebbles survived being rolled that distance and why they are still lying on the surface rather than weathered into the soil. The Durance is the usual wrong guess: its fossil delta is the Crau, away to the south, and it does not reach the Rhone until below Avignon.",
       ex=True),

    # ------------------------------ From Cotes du Rhone up to cru (4) --------
    Q("From Cotes du Rhone up to cru",
      "A Cotes du Rhone Villages label reads Plan de Dieu where a student expects the name of a village. What is Plan de Dieu?",
      ["A delimited area covering several communes rather than one village",
       "A brand registered by a group of growers who share a cooperative cellar",
       "A single commune that renamed itself after its own plateau",
       "A tier ranking above the crus"], 0,
      "Most of the named Villages are communes, but a few of the names are geographical units taking in more than one: Plan de Dieu is a stony plain shared by four villages, and Massif d'Uchaux and Signargues work the same way. What the label names is a delimited patch of ground, not a town hall, which is the rule worth carrying away."),
    SA("From Cotes du Rhone up to cru",
       "Rasteau's cru covers dry red alone. Name the neighbouring village whose own promotion brought white wine as well as red under the cru name.",
       "Cairanne",
       ["cairanne", "cairanne aoc", "aoc cairanne", "the cairanne appellation",
        "cairanne cru", "the cru of cairanne", "the village of cairanne"],
       "Cairanne had been among the strongest of the named Cotes du Rhone Villages for decades before it was raised in 2016, and its rules cover red and white but no rose. Rasteau's cru, granted six years earlier, is dry red only. Two neighbouring crus can therefore differ in what colours they are even allowed to make.",
       ex=True),
    SA("From Cotes du Rhone up to cru",
       "An appellation on the eastern edge of the valley abandoned the name it had carried since 1973, because that name had come to mean a nuclear site rather than a wine. Give the name it took instead.",
       "Grignan-les-Adhemar",
       ["grignan les adhemar", "aoc grignan les adhemar",
        "grignan les adhemar aoc", "the grignan les adhemar appellation"],
       "Coteaux du Tricastin shared its name with a power station a few kilometres away, and after a leak made the news the growers went to the authorities for another one. Grignan and the Adhemar family belong to the same corner of the Drome. The wine, mostly Grenache and Syrah, did not change in the slightest.",
       ex=True),
    SA("From Cotes du Rhone up to cru",
       "The step up from Cotes du Rhone Villages to a cru of its own was taken for the first time in 1971. Which appellation made it?",
       "Gigondas",
       ["gigondas", "gigondas aoc", "aoc gigondas", "the gigondas appellation",
        "gigondas cru", "the cru of gigondas"],
       "It set the pattern every later promotion has followed: a village that has long added its own name to the Villages tier, farming to lower yields inside a tighter boundary than its neighbours, applies to leave the tier altogether. Vacqueyras followed in 1990 and the rest have come along in ones and twos since.",
       ex=True),

    # ------------------------- The right bank and the sweet wines (3) --------
    Q("The right bank and the sweet wines",
      "Fermentation in a southern Rhone vin doux naturel is arrested by dosing the must with neutral grape spirit of at least ninety-six percent. What proportion of the volume may that spirit make up?",
      ["Between five and ten percent of the must", "Between one and two percent",
       "Between twenty and twenty-five percent",
       "Whatever is needed to bring the wine to twenty percent alcohol"], 0,
      "The spirit is close to neutral, so it lifts the alcohol without contributing flavour, and the narrow window holds the finished wine in the fifteen to eighteen percent band the category occupies. When it goes in is the decision that sets the style: earlier leaves more grape sugar and less fermented alcohol, later the reverse."),
    SA("The right bank and the sweet wines",
       "A Rasteau fortified sweet wine bottled early to keep its red fruit and its colour carries one word on the label; a wine given long contact with air until it turns tawny carries another. Give the word for the early-bottled style.",
       "Grenat",
       ["grenat", "rasteau grenat", "grenat rasteau", "the grenat style",
        "the grenat mention"],
       "Grenat is red Grenache muted young and kept away from air, so it stays purple and tastes of kirsch and crushed berry. The oxidative styles take Tuile if the wine was red and Ambre if it was white, and one held for many years in deliberate warmth may add Rancio to either. Note that the fortified wine is not made under the dry red cru of the same village but under a separate and much older appellation, Rasteau Vin Doux Naturel, in force since 1944, so a cru drawn for dry red alone took nothing away from it.",
       ex=True),
    SA("The right bank and the sweet wines",
       "Chateauneuf-du-Pape, Gigondas and Vacqueyras all lie in the Vaucluse. Tavel and Lirac sit across the water in another department, which they share with Costieres de Nimes. Name it.",
       "The Gard",
       ["gard", "gard department", "departement gard", "the gard in languedoc",
        "department of gard", "departement of gard"],
       "The river is the departmental boundary here, so the right bank belongs to the Gard and the administrative map of the Languedoc while the left bank is Vaucluse and Provence. It is part of why the right-bank appellations have always sat slightly apart from the rest of the southern crus.",
       ex=True),

    # ------------------------------------- The name and the trade (2) --------
    Q("The name and the trade",
      "Long before any appellation existed, the words Cote du Rhone named an administrative district whose casks were branded with its initials before shipping. Which bank of the river was that district on?",
      ["The right bank, around Roquemaure",
       "The left bank, around Chateauneuf-du-Pape and Orange",
       "Both banks, from Vienne down as far as Valence",
       "The left bank, around Avignon and Sorgues"], 0,
      "Roquemaure was the loading port for the district, and the letters burned into a cask head served as a mark of origin and a customs stamp at once. The appellation created in the twentieth century took the phrase and stretched it across the water, which is how a name that once meant one stretch of one bank came to cover the whole valley."),
    SA("The name and the trade",
       "Beaujolais is not the only French wine released on the third Thursday of November. The Rhone sends out a young wine of its own that day, under its regional appellation. Name it.",
       "Cotes du Rhone Primeur",
       ["cotes du rhone primeur", "cote du rhone primeur",
        "cotes du rhone nouveau", "cotes du rhone primeur nouveau",
        "cotes du rhone primeur or nouveau", "primeur cotes du rhone",
        "cotes du rhone primeur aoc", "aoc cotes du rhone primeur",
        "cotes du rhone nouveau primeur", "cotes du rhone nouveau or primeur"],
       "It is red or rose, made for drinking at once, and a grower must declare the intention at harvest rather than decide later that a tank will be sold that way. The trade in it is small beside Beaujolais Nouveau, but the release date is the same and the label must carry Primeur or Nouveau.",
       ex=True),
]
