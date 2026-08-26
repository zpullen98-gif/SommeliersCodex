"""Rank II rewrite - Alsace (19 questions: 9 MC, 10 short answer).

Certified level, pitched deliberately above the Rank I Alsace category. Where
Rank I teaches that four noble grapes own the grand cru tier, this asks about
the holes punched in that rule; where Rank I says the 2021 sweetness reform
exists, this asks for its exact terms and its exemptions; where Rank I dates
the tier's birth, this follows the 2011 change that made every cru an
appellation of its own. Nothing here repeats a Rank I task.

The running order is built around one idea: Alsace at this level is a study in
exceptions. The bank walks downhill from the top of the label - the cru rules
and their sanctioned breaches, the named ground below cru rank, the ripeness
ladder of the late-harvest terms, the words the 2021 reform added, the names
that deceive, the sparkling rules, and finally the faulted rock that explains
why fifty-one separate delimitations were worth legislating.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards by check-similarity.py.

Accept lists were graded by executing lib.match_sa - the port of core.js
matchSA - against each displayed answer, natural rephrasings of it, and every
wrong answer that extends or inverts a right one; the lists below are the
record of what was taken. No '~' entries appear anywhere. ex=True with
enumerated carriers is applied wherever a real, different thing contains or
extends the answer: probing showed a bare 'traminer' entry would grade
"Gewurztraminer" through the substring branch and a bare 'savagnin' would
grade "Savagnin Blanc" by containment, so the Klevener question is exact-match
only, as are the three threshold answers, whose lists spell out the at-least
and minimum phrasings a legal floor legitimately takes.

Facts are restricted to ones that do not drift: decree mechanics, dated
reforms, delimited geology. Production shares, prices and plantings are
deliberately absent.
"""

from lib import Q, SA

CAT = "Alsace"
SLUG = "r2-alsace"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("The grand cru exceptions", 4),
    ("Below the crus", 2),
    ("Vendanges Tardives and Selection de Grains Nobles by the numbers", 3),
    ("The 2021 sweetness scale", 2),
    ("Names that deceive", 3),
    ("Cremant d'Alsace", 2),
    ("Rocks and the fault", 3),
]

BANK = [
    # ---------------------------------------- The grand cru exceptions (4) --
    Q("The grand cru exceptions",
      "On paper Alsace's appellation count leapt from three to fifty-three in 2011, with not one new row of vines delimited. What happened?",
      ["Every grand cru site became a separate appellation, replacing the single shared Alsace Grand Cru",
       "Vendanges Tardives and Selection de Grains Nobles were raised from label terms to appellations",
       "Bas-Rhin and Haut-Rhin were each given a regional appellation of their own",
       "Cremant d'Alsace was split into separate white and rose appellations"], 0,
      "Each of the fifty-one grand cru sites received a cahier des charges of its own in 2011, replacing the single shared Alsace Grand Cru appellation of 1975, while regional Alsace and Cremant d'Alsace carried on unchanged. The vineyards did not move an inch; the point was legal machinery, since a site with its own decree can tighten yields, admit a grape or sanction a blend without dragging fifty others through the amendment."),
    Q("The grand cru exceptions",
      "Red wine reached the top of Alsace's hierarchy for the first time with the 2022 vintage, at two grand crus long planted to Pinot Noir; a decree of July 2024 admitted a third. Which three?",
      ["Hengst, Kirchberg de Barr and Vorbourg",
       "Schlossberg, Sommerberg and Wineck-Schlossberg",
       "Rosacker, Geisberg and Osterberg",
       "Rangen, Kitterle and Zinnkoepfle"], 0,
      "Hengst and Kirchberg de Barr had built serious Pinot Noir reputations across decades in which the grand cru tier admitted only white wine, and their amended decrees let the red carry the site name from the 2022 vintage; Vorbourg joined them when the arrete of 4 July 2024 rewrote its cahier. Each keeps its white rules too, so a Hengst may still be a Gewurztraminer; the red is an addition, not a replacement."),
    SA("The grand cru exceptions",
       "A 2005 amendment let one Alsace grand cru, Zotzenberg, write a grape from outside the noble four into its rules, honouring what its growers had always done best. Which grape?",
       "Sylvaner",
       ["sylvaner", "silvaner", "sylvaner grape", "it is sylvaner",
        "gruner sylvaner"],
       "Sylvaner had grown on Zotzenberg's marl and limestone for generations while the noble-grape rule kept its name off the label, and the 2005 amendment recognised the tradition rather than inventing one. The concession is strictly local: on no other cru may the word Sylvaner appear, and Zotzenberg keeps the noble four alongside it."),
    SA("The grand cru exceptions",
       "Site, vintage and the words Alsace Grand Cru appear on a bottle of Altenberg de Bergheim, yet nowhere does it name a grape. What does that silence say about what is in the bottle?",
       "A blend of several grapes",
       ["it is a blend of varieties", "it is a blend", "blend",
        "a blend of grapes", "a blend of varieties", "the wine is a blend",
        "field blend", "a blend of several varieties",
        "blended from several varieties", "a blend of permitted varieties",
        "a mix of several grapes", "a mix of varieties", "a mix of grapes",
        "a mix of grape varieties", "multiple grape varieties",
        "multiple varieties", "more than one variety"],
       "Altenberg de Bergheim and Kaefferkopf are the crus whose rules sanction a blend, and a blended grand cru names no variety at all: the site is the whole claim. A single-variety bottling from the same slope still carries its grape, so the absent line is information, not an oversight."),

    # ------------------------------------------------- Below the crus (2) ---
    Q("Below the crus",
      "Between plain Alsace and the crus, bottles labelled Alsace Cote de Rouffach or Alsace Ottrott occupy a rung of their own. What are those added names?",
      ["Communal denominations added to the appellation rules in 2011",
       "Fantasy names registered by merchant houses and protected as trademarks",
       "Grand cru sites relegated for exceeding their permitted yields",
       "Bereich names kept from the German decades for export labels"], 0,
      "The 2011 rules wrote a family of geographic denominations into AOC Alsace, communal names such as Cote de Rouffach, Vallee Noble and Ottrott among them, giving the region the middle ground it lacked between anonymous regional wine and the crus. Several are tied to Pinot Noir rather than to whites: Ottrott, Rodern and Saint-Hippolyte earned their names on the red."),
    SA("Below the crus",
       "Below the grand cru tier an Alsace grower may still put a vineyard name on the label, and the rules charge for the privilege. What do they demand of the wine?",
       "Lower yields and higher minimum ripeness than plain Alsace",
       ["lower yields and higher minimum ripeness",
        "lower yields and higher ripeness", "lower yields and riper fruit",
        "lower yields", "lower maximum yields", "reduced yields",
        "stricter yields and ripeness", "lower yields and higher must weights",
        "higher minimum ripeness", "a smaller crop and riper grapes",
        "a lower yield and a higher minimum ripeness",
        "smaller yields and riper grapes", "stricter yields",
        "a lower yield ceiling", "higher ripeness"],
       "A lieu-dit bottling must come in under a lower yield ceiling and reach a higher minimum ripeness than plain Alsace, the same bargain the crus strike at a higher pitch. The reward is a specific slope on the label without waiting for a grand cru list that has not grown since 2007."),

    # ------ Vendanges Tardives and Selection de Grains Nobles by the numbers (3)
    SA("Vendanges Tardives and Selection de Grains Nobles by the numbers",
       "Picking for Vendanges Tardives, a Riesling grower in Alsace needs the must to reach a legal minimum sugar concentration. Give the figure.",
       "235 grams per litre",
       ["235 grams per litre", "235 grams per liter",
        "235 grams of sugar per litre", "235 grams of sugar per liter",
        "235 grams per litre of sugar", "235 g/l", "235g/l",
        "235 g per litre", "235 g per liter", "235 grams", "235 g", "235",
        "at least 235 grams per litre", "minimum 235 grams per litre",
        "235 grams per litre minimum", "at least 235 g/l",
        "minimum of 235 grams per litre", "235 g/l minimum",
        "235 grams/litre", "minimum 235 g/l", "at least 235",
        "minimum 235", "235 g/l of sugar", "235 grams per litre of must",
        "235 grammes per litre"],
       "Riesling and Muscat qualify for Vendanges Tardives at 235 grams of natural sugar per litre of must, while Gewurztraminer and Pinot Gris, which fatten far more easily, face 257; the figures were raised to those levels in 2001. Chaptalisation is banned outright for the term, so every gram must hang on the vine into the autumn.",
       ex=True),
    SA("Vendanges Tardives and Selection de Grains Nobles by the numbers",
       "Shrivelled Gewurztraminer coming in for Selection de Grains Nobles faces the stiffest sugar minimum in the Alsace rulebook. What is the figure?",
       "306 grams per litre",
       ["306 grams per litre", "306 grams per liter",
        "306 grams of sugar per litre", "306 grams of sugar per liter",
        "306 grams per litre of sugar", "306 g/l", "306g/l",
        "306 g per litre", "306 g per liter", "306 grams", "306 g", "306",
        "at least 306 grams per litre", "minimum 306 grams per litre",
        "306 grams per litre minimum", "at least 306 g/l",
        "minimum of 306 grams per litre", "306 g/l minimum",
        "306 grams/litre", "minimum of 306 g/l", "minimum 306 g/l",
        "at least 306", "minimum 306", "306 grammes per litre"],
       "Gewurztraminer and Pinot Gris must reach 306 grams of sugar per litre of must for Selection de Grains Nobles, against 276 for Riesling and Muscat. At that concentration ferments crawl and stop early of their own accord, which is why an SGN is always frankly sweet where a Vendanges Tardives merely promises ripeness.",
       ex=True),
    Q("Vendanges Tardives and Selection de Grains Nobles by the numbers",
      "A parcel of clean, late-picked Alsace Pinot Gris comes in at 260 grams of sugar per litre of must. Which of the region's two late-harvest terms is within reach?",
      ["Vendanges Tardives only", "Selection de Grains Nobles only",
       "Either term", "Neither term"], 0,
      "The Vendanges Tardives floor for Pinot Gris stands at 257 grams per litre, so 260 clears it with a little in hand. Selection de Grains Nobles sits far above such fruit for the same grape and expects shrivelled, nobly rotted berries besides, so clean bunches at this ripeness leave one word open and one out of reach."),

    # -------------------------------------- The 2021 sweetness scale (2) ----
    Q("The 2021 sweetness scale",
      "Since the 2021 vintage a dryness indication is compulsory on Alsace's still whites, either as a printed scale or as one of four words. Which four?",
      ["Sec, demi-sec, moelleux, doux",
       "Brut, extra-dry, sec, demi-sec",
       "Trocken, halbtrocken, feinherb, mild",
       "Sec, tendre, moelleux, liquoreux"], 0,
      "The four words track the European bands: sec up to roughly four grams of residual sugar with some latitude where acidity is high, demi-sec to about twelve, moelleux to about forty-five, doux beyond. A producer who prefers not to print words may use the graduated dryness gauge instead, but one or the other must appear."),
    SA("The 2021 sweetness scale",
       "Two categories of Alsace white stand outside the 2021 rule that a sweetness level must appear on the label. Which two?",
       "Vendanges Tardives and Selection de Grains Nobles",
       ["vendanges tardives and selection de grains nobles",
        "selection de grains nobles and vendanges tardives",
        "vendanges tardives and selections de grains nobles",
        "vt and sgn", "sgn and vt", "vt sgn", "sgn vt",
        "the late harvest categories", "the two late harvest categories",
        "vendanges tardives and sgn", "sgn and vendanges tardives",
        "both vt and selection de grains nobles",
        "vendange tardive and selection de grains nobles",
        "the late harvest wines", "the two late harvest wines"],
       "Vendanges Tardives and Selection de Grains Nobles stand outside the obligation because each already answers to a legal regime of its own, with must weights and an official tasting behind the words. Every other still white claiming the Alsace name must carry the mention or the printed gauge from the 2021 vintage onward, and the arrete of 9 May 2022 wrote the same obligation, with the same two exceptions, into all fifty-one grand cru cahiers."),

    # ------------------------------------------- Names that deceive (3) -----
    SA("Names that deceive",
       "Around Heiligenstein and four neighbouring communes, and nowhere else in France, one old pink-skinned variety keeps a protected mention of its own. Which grape hides behind the name Klevener de Heiligenstein?",
       "Savagnin Rose",
       ["savagnin rose", "savagnin", "traminer", "savagnin rose grape",
        "it is savagnin rose", "rose savagnin", "pink savagnin",
        "roter traminer", "savagnin rose or traminer",
        "traminer or savagnin rose", "traminer rose", "rose traminer"],
       "Klevener with the extra syllable is Savagnin Rose, planted around Heiligenstein since the eighteenth century and protected as a mention for five communes of the Bas-Rhin: Heiligenstein, Bourgheim, Gertwiller, Goxwiller and Obernai. The near-identical Klevner names a different and far commoner grape, and the single letter has parted many candidates from an exam mark.",
       ex=True),
    Q("Names that deceive",
      "One guest adored last night's Gewurztraminer but wants something quieter, and the Alsace page of the list offers both Klevner and Klevener de Heiligenstein. Which bottle answers the request, and what makes it kin?",
      ["Klevener de Heiligenstein, a plainer cousin of the guest's grape",
       "Klevner, a lighter, earlier-picked style of the same Gewurztraminer",
       "Either one, since the two words are only spellings of a single grape",
       "Neither, as both name the house blend rather than any variety"], 0,
      "Klevener de Heiligenstein is Gewurztraminer's quiet relation, pink-skinned but without the perfume engine, so it reads as a gentler take on a familiar register. Klevner, one letter shorter, is merely the old Alsatian word for Pinot Blanc, an amiable everyday white with no family tie to the guest's bottle at all."),
    SA("Names that deceive",
       "Chasselas and Sylvaner dominate a tank-blended Alsace white, Pinot Blanc fills it out, and no vintage will go on the bottle. Gentil is out of reach, so what may the label say?",
       "Edelzwicker",
       ["edelzwicker", "edelzwicker blend", "alsace edelzwicker",
        "it may say edelzwicker", "label it edelzwicker",
        "edelzwicker on the label", "edelzwicker with no vintage",
        "non vintage edelzwicker"],
       "Edelzwicker takes any mix of Alsace's permitted whites in any proportion, co-pressed or blended in tank, vintage optional, which is exactly the freedom Gentil surrenders: that word requires at least half of the blend from the noble four, each component vinified separately and shown to a panel, with a vintage on the label. The two names split the region's blends into the everyday and the examined. The noble prefix is not decoration: plain Zwicker, the old unregulated name for a blend of ordinary grapes, is not a sanctioned mention, so only the full word earns its place on the label.",
       ex=True),

    # ------------------------------------------------ Cremant d'Alsace (2) --
    Q("Cremant d'Alsace",
      "Perfume rules two of the noble varieties out of Alsace's sparkling cellars, and no Cremant may contain them. Which pair?",
      ["Gewurztraminer and Muscat", "Pinot Gris and Gewurztraminer",
       "Riesling and Pinot Gris", "Riesling and Muscat"], 0,
      "The Cremant d'Alsace decree admits Pinot Blanc, Auxerrois, Pinot Gris, Pinot Noir, Riesling and Chardonnay, so of the noble four only the two most perfumed are missing. Gewurztraminer and Muscat would scent a base wine that the traditional method wants lean and neutral, while Chardonnay, unusable in still Alsace, is welcomed here for precisely that neutrality."),
    SA("Cremant d'Alsace",
       "Tirage happens in spring; the rules then hold every bottle of Cremant d'Alsace in the cellar for a minimum stretch before sale. How long, counted from tirage?",
       "Twelve months",
       ["twelve months", "12 months", "twelve", "12", "one year", "a year",
        "twelve months from tirage", "12 months from tirage",
        "twelve months after tirage", "12 months after tirage",
        "at least twelve months", "at least 12 months",
        "twelve months minimum", "12 months minimum",
        "minimum of twelve months", "a full year", "one year from tirage",
        "a year from tirage", "one year after tirage",
        "twelve months before sale", "12 months before sale",
        "twelve months before release",
        "twelve months in the cellar", "12 months in the cellar"],
       "Twelve months must separate tirage from sale, and most of that time is spent on the lees of the second fermentation; the floor is common to the French Cremant family since their rules were harmonised. Serious houses treat it as a starting point rather than a target, and the difference between the floor and a long-aged cuvee is easy to taste.",
       ex=True),

    # --------------------------------------------- Rocks and the fault (3) --
    Q("Rocks and the fault",
      "Above Kientzheim, the terraced Schlossberg grows celebrated Riesling on a thin, sandy, fast-draining soil. What rock breaks down into it?",
      ["Granite", "Dolomitic limestone", "Blue schist", "Volcanic greywacke"], 0,
      "Granite rots into a coarse acid sand, fast to warm, free-draining and poor, so vigour stays low and acidity stays high, which is the Riesling recipe. The same grape on Rosacker's dolomitic limestone or the volcanic rock above Thann turns broader and smokier by turns, which is the case for fifty-one separate delimitations in the first place."),
    SA("Rocks and the fault",
       "A dark island of Steige schist above the town of Andlau carries one small Alsace grand cru whose Riesling outlives most of the region's. Name it.",
       "Kastelberg",
       # No entry runs to three words, because the stem supplies the other two.
       # "kastelberg grand cru" and "grand cru kastelberg" were cut: matchSA's
       # reverse-containment branch takes a two-word truncation of a three-word
       # entry, so both graded a bare "grand cru", which the stem prints. The
       # plain entry still grades every one of those phrasings by containment,
       # so nothing legitimate went with them. "kastelberg above andlau" and
       # "kastelberg at andlau" went the same way and for the same reason: they
       # graded "above andlau" and "at andlau", which is the stem read back.
       # The two-word forms are safe, since a one-word truncation of them fails
       # matchSA's word-count floor.
       ["kastelberg", "the kastelberg cru", "kastelberg andlau"],
       "Kastelberg is the only Alsace grand cru on schist, a sliver of the dark Steige belt pinched against the granite above Andlau, and its Riesling is famously slow: austere young, mineral for decades. The abbey town has worked the slope since the early Middle Ages, which is roughly how long the site has held its name."),
    Q("Rocks and the fault",
      "Granite crus like Brand and Sommerberg sit at the mouths of Vosges valleys, while Alsace's marl and limestone names string along the lower foothills. What arranged them that way?",
      ["Valley streams sawed through the sedimentary skin to the old crystalline rock beneath",
       "Ice-age glaciers ferried granite blocks down from the summits and dumped them where the valleys open",
       "Limestone was laid down by the Rhine in terraces wherever the slope flattens toward the plain",
       "The abbeys held the marl under ancient planting rights while the towns worked the granite"], 0,
      "The foothill belt is the champ de fractures, a staircase of fault-dropped blocks whose limestone, marl and sandstone once roofed the whole range, and a valley is where a stream has cut clean through that roof into the granite and gneiss beneath. Which rock a cru sits on is therefore mostly a question of how much cover its patch of hillside has lost."),
]
