"""Rank II rewrite - Wine Fundamentals (32 questions: 10 MC, 22 short answer).

Certified level, and deliberately the MECHANISM rather than the vocabulary. Rank
I's Viticulture & Winemaking says sulphur dioxide protects wine; this asks why a
wine at pH 3.8 needs more of it than the same wine at pH 3.3. Rank I's Tasting &
Service says a corked bottle smells of damp cardboard; this asks how a cleaning
product sprayed on cellar timber years earlier became the molecule that does it.
Rank II Terroir owns the physics of climate and soil, Rank I Winemaking
Techniques owns the named cellar operation and what it changes in the glass, and
Rank II Service & Hospitality owns the fault at the table and the guest's
recourse. What is left, and what is written here, is the chemistry: which
molecule, by what route, and what measurement a cellar reads to know.

The running order is the order in which a winemaker actually meets each piece of
it. What the fruit brings in (the acids), how that is measured (titration
against the meter), what maceration pulls out (the phenolics), what the ferment
converts (sugar into alcohol), what is added to protect the result (sulphur
dioxide), what the bacteria change afterwards (malolactic), what oxygen does in
both directions, what goes wrong and why, and finally what a sealed bottle does
on its own. A student who works through it in order should be able to say not
just that a wine is faulty or flat but which reaction produced that.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards, by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and were
verified by executing a probe script rather than by eye: every displayed answer,
several natural phrasings of it, and every wrong answer that could be named were
run through the grader. No '~' entries appear anywhere, because the tilde is
exact-OR-containment and a one-word tilde grades any wrong answer holding that
word.

ex=True is used wherever a REAL and DIFFERENT thing extends
or inverts the right answer, or where the answer is a threshold that reads the
same in both directions under containment. Several were added only
AFTER the probe was executed, because matchSA's last branch is a plain substring
test rather than a whole-word one, and nothing in the question text shows it:

  acetic acid            "acetic acid bacteria" is the organism, not the acid,
                         and it swallows the answer whole.
  citric acid            "isocitric acid" and "isocitrate" are real and
                         different grape acids, and both graded until ex.
  potassium              "potassium bitartrate", "potassium metabisulphite" and
                         "potassium sorbate" are all real and all contain it.
  tenfold                a factor, so containment would grade its own inversion.
  polymerisation         "depolymerisation" is the exact inversion of the
                         answer and contains it as a substring; it graded.
  seed tannin            "skin and seed tannin" is the wrong half of the answer
                         and contains the right one.
  the sugar divisor      a threshold; graded loosely it reads the same whichever
                         side of the figure the student lands on.
  acetaldehyde           "methanal" contains "ethanal" as a substring, and
                         methanal is formaldehyde: a different compound.
  potassium metabisulphite  "sodium metabisulphite" is a real and different salt
                         that contains "metabisulphite".
  quinones               "hydroquinone" is the reduced form, a real and
                         different compound, and it contains "quinone".
  oxygen transmission rate  so that the three-letter abbreviation can be taken
                         at all, since below four characters matchSA is exact.
  4-ethylphenol          the numeral makes it a comparative-probe target, and
                         "less than 4-ethylphenol" would otherwise grade.
  TDN                    a three-letter abbreviation, exact by necessity.
  buffering capacity     "low buffering capacity" is the exact inversion of the
                         answer and contains it whole.
  molecular sulphur dioxide  free and bound sulphur dioxide are real and
                         different fractions sharing the tail of the name.

Each of those lists was then widened until the plain answer, the answer with an
article, the alternative spelling, the plural, the formula and the common
synonym all still grade, because exact matching rejects anything not written
down and an earlier wave killed sixteen honest phrasings by forgetting that.

One hole is left open deliberately and is recorded rather than patched. The
containment branch grades "anything but succinic acid" against the succinic acid
question, because "but" is not one of core.js NEG_WORDS. That is a property of
the shipped grader across every bank rather than a fault in this accept list, and
closing it here would cost the natural phrasings ex=True cannot enumerate while
leaving the same construction working everywhere else.

A second hole is left open for the same reason. engine_norm strips 'de' as a
stopword, so "de-polymerisation" normalises to the bare "polymerisation" before
any comparison is made and grades against the polymerisation question even under
ex=True, as do "de-condensation" and every "de-" phrasing built on a listed
entry. The unhyphenated "depolymerisation" rejects correctly. No accept list can
close it, because prefixing "de-" to ANY entry normalises back to that entry and
the bare entry cannot be dropped without failing self_grading_problems. Only
re-keying away from a process noun would, and it is not worth that: the stem
states the direction outright - pigment and tannin "join into ever larger
molecules that eventually fall out as sediment" - so the inversion contradicts
the sentence in front of the student rather than being the misconception the
question tests.

Facts are restricted to ones that do not drift: reaction pathways, dissociation
behaviour, molecular structure and long-settled analytical practice. The three
numbers that appear - the tenfold decade of the pH scale, the roughly even split
of sugar's weight between ethanol and carbon dioxide, and the seventeen grams
per litre of sugar behind one per cent of alcohol - are arithmetic and
long-settled fermentation yield rather than statistics, and none of them can be
overtaken by an appellation decree.
"""

from lib import Q, SA

CAT = "Wine Fundamentals"
SLUG = "r2-wine-fundamentals"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("The acids and what tells them apart", 4),
    ("Titratable acidity, pH and what each measures", 4),
    ("Phenolics, pigment and tannin", 4),
    ("Sugar into alcohol", 2),
    ("Sulphur dioxide: free, bound and molecular", 4),
    ("Malolactic conversion as chemistry", 3),
    ("Oxygen given and oxygen taken", 3),
    ("The chemistry of the faults", 6),
    ("What a bottle does afterwards", 2),
]

BANK = [
    # ------------------------------- The acids and what tells them apart (4) --
    Q("The acids and what tells them apart",
      "Analysed the week after picking and again after two years in barrel, one of a red's acids still anchors both reports while the others have vanished or appeared, and the only thing that has taken any of it is a cold cellar. Which property of that acid accounts for it?",
      ["Neither the yeast nor the malolactic bacteria consume it",
       "It is the only acid the vine puts into the berry at all",
       "It cannot dissolve at cellar temperature",
       "The yeast regenerate it as fast as the bacteria remove it"], 0,
      "Tartaric acid is the one the cellar's microbes leave alone, which is why it anchors a wine's acidity while malic disappears and lactic appears. What it does lose goes into crystals of potassium bitartrate on the coldest nights rather than into any organism, so the figure eases rather than collapses. The exception is a spoilage organism rather than a working one: certain Lactobacillus will degrade tartaric in a neglected, high-pH wine, and the resulting flat, dull fault is old enough to have a name of its own in French cellars."),
    SA("The acids and what tells them apart",
       "Fermentation leaves behind an acid the grape never carried, and tasters meet it as a bitter, faintly salty edge under the fruit of a dry wine. Name that acid.",
       "Succinic acid",
       ["succinic acid", "succinic", "succinate"],
       "Yeast make it in quantity during the alcoholic ferment, typically around a gram a litre, and no amount of it comes in on the fruit. Its taste is unlike the other acids in the glass, closer to a savoury salinity than to sourness, which is part of why a fermented drink tastes different from sweetened acidified juice."),
    SA("The acids and what tells them apart",
       "Adding one of the minor grape acids to a red before its bacterial conversion is a bad idea, because the bacteria break it down into vinegar and a buttery ketone. Name the acid that must not be there.",
       "Citric acid",
       ["citric acid", "citric", "citrate", "citric acid c6h8o7"],
       "The grape carries only a few tenths of a gram a litre of it, and lactic acid bacteria metabolise what there is into acetic acid and a strongly buttery by-product. That is why the addition is made after the conversion has finished, if at all, and why it is used more often to hold iron in solution than to sharpen a wine.",
       ex=True),
    SA("The acids and what tells them apart",
       "Steam driven through a wine carries one of its acids over into the distillate and leaves the rest behind, which is why the laboratory reports that one on a line of its own. Name it.",
       "Acetic acid",
       ["acetic acid", "acetic", "ethanoic acid", "ethanoic", "acetic acid vinegar",
        "acetic acid ethanoic acid", "ethanoic acid acetic acid",
        "acetic acid ch3cooh", "ch3cooh"],
       "The distillable fraction is what a certificate calls volatile acidity, and acetic acid supplies almost all of it. Every sound wine holds a little, because the ferment itself makes some, and the legal ceilings sit far above that background but close to the point at which a taster starts calling a wine volatile, so the limit is a backstop against the undrinkable rather than a guarantee that the wine is clean.",
       ex=True),

    # --------------------- Titratable acidity, pH and what each measures (4) --
    Q("Titratable acidity, pH and what each measures",
      "Six and a half grams per litre on the titration and 3.85 on the meter: the first figure looks healthy and the second is alarming. What is the meter reporting that the titration is not?",
      ["The concentration of hydrogen ions actually free in the wine",
       "The total weight of acid the wine contains",
       "The share of the acidity contributed by the volatile acids",
       "The proportion of the acid that has already precipitated"], 0,
      "A titration neutralises every acid group in the sample and reports the total, whether those groups were doing anything or not. The meter reports only the hydrogen ions loose in solution, and that is the number that governs microbial stability, colour and how hard the preservative works, which is why a wine can be generously acidic on paper and defenceless in practice."),
    SA("Titratable acidity, pH and what each measures",
       "A hot-climate red comes back from the laboratory with respectable total acidity and a pH of 3.9, and the cause is a cation the vine drew out of the soil and packed into the fruit. Name that element.",
       "Potassium",
       ["potassium", "potassium ion", "potassium ions", "potassium cation",
        "potassium cations", "element potassium", "potassium k", "k potassium",
        "k"],
       "Potassium taken up by the vine neutralises part of the wine's acid, and a neutralised acid group is lost to the titration just as it is lost to the meter. What keeps the grams per litre respectable is that tartaric acid carries two acid groups and potassium takes only the first: the bitartrate ion left behind still holds the second, and the titration counts that one in full to its endpoint. So half the tartaric acidity survives the exchange, while the meter records the whole of the swing. Warm regions, high yields, shaded canopies and late picking all push potassium up, and none of them bring in extra acid to cover it, which is why acidification in such places is aimed at the meter and not at the titration.",
       ex=True),
    SA("Titratable acidity, pH and what each measures",
       "An identical dose of tartaric acid moves one wine's pH by a fifth of a unit and another's by barely half that. Name the property of a wine that resists the change.",
       "Buffering capacity",
       ["buffering capacity", "buffer capacity", "buffering", "buffering power",
        "buffering ability", "high buffering capacity", "good buffering capacity",
        "strong buffering capacity", "high buffer capacity", "high buffering",
        "buffering capacity of the wine", "the wine's buffering capacity",
        "its buffering capacity", "buffering capacity buffer capacity",
        "it has a high buffering capacity", "the wine has a high buffering capacity",
        "the wine is well buffered", "well buffered", "buffering capacity is high",
        "buffer", "buffered", "it is well buffered", "the wine's buffer capacity",
        "its buffer capacity", "buffer capacity of the wine", "buffering effect",
        "buffer strength"],
       "A wine is a buffer because it holds weak acids alongside their own salts, and that pairing soaks up added hydrogen ions rather than letting them show on the meter. It is why acid trials are run on a bench sample rather than calculated, and why a heavily buffered wine can take a large addition and taste sharper without reading much lower.",
       ex=True),
    SA("Titratable acidity, pH and what each measures",
       "One red reads pH 3.4 and another pH 4.4. By what factor do their hydrogen ion concentrations differ? State the factor.",
       "Tenfold",
       ["tenfold", "ten fold", "ten times", "factor of ten", "by a factor of ten",
        "ten", "10", "10 times", "10 fold", "ten times higher", "ten times more",
        "ten times greater", "tenfold difference", "10 times higher", "10x", "x10",
        "factor of 10", "by a factor of 10", "10 times greater", "10 times more",
        "10 fold difference", "ten fold difference", "tenfold 10x",
        "order of magnitude", "one order of magnitude", "times ten", "times 10",
        "by ten", "by 10"],
       "The scale is logarithmic, so each whole unit is a decade and the gap between a fine white at 3.1 and a slack red at 4.1 is a factor of ten in the thing that actually matters. It also explains why cellar targets are argued over in hundredths: a shift of a tenth of a unit is a change of about a quarter in free hydrogen ions, which is enough to move both microbial risk and the working strength of any preservative added.",
       ex=True),

    # ------------------------------------- Phenolics, pigment and tannin (4) --
    Q("Phenolics, pigment and tannin",
      "Dropping a young red from pH 3.7 to pH 3.4 makes it look brighter and redder in the glass, and not one milligram of pigment has been added. What has the acid done to the colour?",
      ["Shifted the pigment into its red-coloured form",
       "Dissolved more pigment out of the suspended solids",
       "Bleached the brown compounds that had been masking it",
       "Bound the pigment onto tannin and deepened the hue"], 0,
      "Anthocyanins exist as several forms in equilibrium, and only one of them is strongly red; acid conditions push the balance toward it and a rising pH pushes it back toward colourless and blue-tinged forms. This is why a high-pH red looks dull and slightly blue however much pigment it holds, and why acidification is a colour decision as much as a taste one."),
    SA("Phenolics, pigment and tannin",
       "Twenty years turn a red paler and softer at once, as pigment and tannin join into ever larger molecules that eventually fall out as sediment. Name that reaction.",
       "Polymerisation",
       ["polymerisation", "polymerization", "polymerise", "polymerize",
        "polymerising", "polymerizing", "condensation", "condensation reaction",
        "tannin polymerisation", "tannin polymerization",
        "polymerisation of tannins", "polymerization of tannins",
        "they polymerise", "they polymerize", "the tannins polymerise",
        "the tannins polymerize", "polymerisation of tannin",
        "polymerization of tannin", "polymerization of pigment and tannin",
        "tannin condensation", "condensation of tannins",
        "polymerisation condensation",
        "polymerisation of pigment and tannin",
        "polymerisation and precipitation",
        "polymerisation and condensation", "polymerization and condensation",
        "condensation and polymerisation", "polymerised", "polymerized",
        "polymerisation reaction", "polymerization reaction",
        "tannin polymerisation and precipitation"],
       "It takes a molecule with several points of attachment to bind the proteins that lubricate the mouth, so it is the mid-sized tannins that grip hardest and the single units that are merely bitter. Keep joining them and two things happen at once: pigment locks onto the chain and blunts its reactivity toward those proteins, and the chain eventually grows past the size at which it stays in solution and drops out of the wine altogether. The pigment goes with it, which is why softening and fading are one process rather than two, and why the deposit in an old bottle is coloured.",
       ex=True),
    SA("Phenolics, pigment and tannin",
       "Condensed tannin is a chain of repeating flavan-3-ol units, and a single one of them free in the wine tastes bitter rather than astringent. Name that unit.",
       "Catechin",
       ["catechin", "catechins", "epicatechin", "epicatechins",
        "catechin unit", "catechin units", "catechin monomer",
        "catechin monomers", "catechin and epicatechin",
        "epicatechin and catechin", "catechin or epicatechin",
        "single catechin", "monomeric catechin",
        "it is catechin", "that is catechin", "it is called catechin",
        "the unit is catechin", "the monomer is catechin",
        "catechin monomer unit"],
       "Catechin and epicatechin, its epimer at the third carbon rather than its mirror image, are the building blocks, and the number of them strung together decides what the mouth feels: single units and pairs read as bitterness on the tongue, while chains of five or more are what dries the mouth. The chain is a mixture rather than one unit repeated, and its make-up is diagnostic: gallate esters ride on it, and skin tannin carries a fourth unit, epigallocatechin, that seed tannin does not. Bitterness and astringency therefore come from the same family of compounds at different sizes, which is why they can move in opposite directions as a wine ages.",
       ex=True),
    SA("Phenolics, pigment and tannin",
       "Squeezed hard at the end of the press cycle, a red picks up a green, bitter drying quality that a gentle cycle avoids altogether. Which fraction of the wine's tannin has just been added?",
       "Seed tannin",
       ["seed tannin", "seed tannins", "grape seed tannin", "grape seed tannins",
        "pip tannin", "pip tannins", "seed derived tannin", "seed derived tannins",
        "tannin from the seed", "tannin from the seeds", "tannins from the seeds",
        "tannin from the pips", "tannins from the pips",
        "seed tannin fraction", "seed tannins fraction",
        "tannin fraction from the seeds", "tannins from the seed",
        "tannin from grape seeds", "tannins from grape seeds"],
       "Seed tannins are smaller, more heavily decorated with gallic acid and markedly more bitter than the tannins in the skin, and the seeds only give them up once there is alcohol in the vat or a press has cracked them. It is why press fractions are kept apart and tasted before any of them is blended back, and why a slow press and an intact seed are worth the extra hours.",
       ex=True),

    # ------------------------------------------------- Sugar into alcohol (2) --
    Q("Sugar into alcohol",
      "A fermenting vat gets measurably lighter as it works, because sugar leaves it as two products and only one of them stays in the wine. Which figure comes closest to the share of the sugar's weight that departs as gas?",
      ["About half of it",
       "Almost all of it, since the gas escapes and the liquid stays",
       "About a quarter of it",
       "Under a tenth"], 0,
      "A molecule of sugar gives two of ethanol and two of carbon dioxide, and the two products come out at roughly the same weight, so close to half the sugar leaves the building. That is also why an enclosed fermentation hall is genuinely dangerous and why a sealed tank must be vented: the gas is heavy, invisible and produced by the tonne."),
    SA("Sugar into alcohol",
       "Cellars turn grams of sugar per litre into potential alcohol by dividing by a single figure, close enough for planning a harvest. Give that divisor.",
       "About seventeen grams per litre",
       ["about seventeen grams per litre", "seventeen grams per litre",
        "about 17 grams per litre", "17 grams per litre", "seventeen", "17",
        "about 17", "about seventeen", "roughly 17", "16 83", "17 g l",
        "17g l", "divide by 17", "divide by seventeen", "about 17 g l",
        "17 grams litre", "17 grams per litre of sugar",
        "seventeen grams of sugar per litre", "17 g per litre",
        "roughly seventeen grams per litre", "roughly 17 grams per litre",
        "approximately 17 grams per litre", "about 17 grams of sugar per litre",
        "17 g l of sugar", "divide by about 17", "seventeen grams a litre",
        "about seventeen grams a litre", "16 83 g l"],
       "Stoichiometry alone would ask for about fifteen and a half grams a litre, since a gram of sugar yields at most 0.51 grams of ethanol. A real ferment returns only about ninety-two per cent of that, because some of the sugar goes to glycerol, biomass and the ferment's own acids, so the sugar actually needed for each per cent climbs to a shade under seventeen and cellars round it. Two hundred and twenty grams a litre therefore points at around thirteen per cent, which is why a refractometer reading at the vineyard gate is enough to say whether a lot will need correcting before it is picked.",
       ex=True),

    # -------------------------- Sulphur dioxide: free, bound and molecular (4) --
    Q("Sulphur dioxide: free, bound and molecular",
      "A tech sheet gives total sulphur dioxide at 110 milligrams per litre and free at 28, and the winemaker says the missing 82 is gone for good. What has happened to it, and why can it not be recovered?",
      ["It has combined with carbonyl compounds the ferment left behind, and almost none of it returns",
       "It has escaped as gas through the bung, and the only remedy is to top the barrel up more often than this cellar has been doing",
       "It has been consumed by the yeast as a nutrient and turned into cell material during the ferment",
       "It has settled into the lees and is racked away"], 0,
      "Sulphur dioxide reacts with several compounds a ferment leaves behind, and the strongest of those bonds is effectively permanent: that sulphur neither preserves nor can be counted on. The weaker adducts, on pigment and on the keto acids, hand a little back as the free fraction is used up, which is why bound sulphur is discounted rather than ignored. A wine that binds heavily needs a larger total addition to reach the same free reading, which is why dirty or rot-affected fruit is expensive in sulphur long before anyone tastes the wine."),
    SA("Sulphur dioxide: free, bound and molecular",
       "Only a few per cent of a wine's free sulphur dioxide is the undissociated species that actually kills a spoilage yeast, and how large that share is depends entirely on pH. Name that species.",
       "Molecular sulphur dioxide",
       ["molecular sulphur dioxide", "molecular sulfur dioxide", "molecular so2",
        "molecular form", "molecular species", "molecular form of sulphur dioxide",
        "molecular sulphur dioxide so2", "molecular so2 molecular sulphur dioxide",
        "molecular sulphur dioxide molecular so2", "undissociated sulphur dioxide",
        "undissociated sulfur dioxide", "undissociated so2", "undissociated form",
        "undissociated molecule", "undissociated molecular sulphur dioxide",
        "molecular sulfur dioxide so2", "undissociated molecular so2",
        "molecular form of sulfur dioxide", "free molecular sulphur dioxide",
        "free molecular sulfur dioxide", "free molecular so2",
        "molecular so2 undissociated"],
       "The free fraction sits in equilibrium between the undissociated molecule and its charged forms, and only the neutral molecule crosses a microbial cell membrane; the charged forms are turned back at the lipid bilayer, and what does get in meets a near-neutral interior that converts it to bisulphite, which cannot get out again. The share of it roughly halves for every three-tenths of a pH unit climbed, so a wine at 3.6 needs about twice the free sulphur of one at 3.3 and about four times that of one at 3.0 to be equally defended, which is the whole reason cellars dose from a table rather than to a habit.",
       ex=True),
    SA("Sulphur dioxide: free, bound and molecular",
       "Sulphur dioxide added to a wine fresh off its fermentation vanishes from the free reading within hours, seized by a compound the yeast made on the way to ethanol and never finished reducing. Name that compound.",
       "Acetaldehyde",
       ["acetaldehyde", "ethanal", "acetaldehyde ethanal",
        "ethanal acetaldehyde", "acetaldehyde ch3cho", "ch3cho",
        "ethanal ch3cho"],
       "It is the strongest binder in wine, and the bond is effectively irreversible at cellar conditions. That cuts both ways: the sulphur is spent, but the acetaldehyde is also taken out of the aroma, which is why a lightly oxidised wine can be tidied up by an addition while a heavily bound one simply swallows everything it is given.",
       ex=True),
    SA("Sulphur dioxide: free, bound and molecular",
       "Cellar hands weigh out a white powder by the gram rather than handling any gas, and it releases the preservative on contact with wine. Name that salt.",
       "Potassium metabisulphite",
       ["potassium metabisulphite", "potassium metabisulfite",
        "potassium meta bisulphite", "potassium meta bisulfite", "pms",
        "potassium metabisulphite pms", "k2s2o5",
        "potassium metabisulphite powder", "kms",
        "potassium metabisulphite kms", "potassium pyrosulphite",
        "potassium pyrosulfite",
        "potassium metabisulfite pms", "potassium metabisulphite k2s2o5",
        "potassium metabisulfite k2s2o5", "potassium metabisulfite powder",
        "pms powder", "kms powder"],
       "About 57 per cent of the weight of the powder becomes sulphur dioxide in the wine, so the arithmetic of a dose is never one for one, and many cellars work to a round half as a margin because stock that has been open to the air delivers less than the label says. The salt is chosen over its sodium equivalent because nobody wants to add sodium to a wine, and it is dissolved in a little wine before use rather than tipped into a full tank.",
       ex=True),

    # ---------------------------------- Malolactic conversion as chemistry (3) --
    Q("Malolactic conversion as chemistry",
      "Titratable acidity falls after a red has been through its bacterial conversion, although every acid molecule removed has been replaced by another acid molecule. What accounts for the fall?",
      ["The acid lost carried two acid groups and the one replacing it carries one",
       "The bacteria neutralise part of the acidity with calcium released from the lees",
       "Alcohol made during the conversion dilutes what acid is left",
       "The wine warms as the bacteria work, driving acid off as vapour"], 0,
      "A titration counts acid groups, so swapping a molecule with two of them for a molecule with one removes half the countable acidity at a stroke, and carbon dioxide is given off as the extra group leaves. The softening a taster notices is therefore partly a genuine loss of acid and partly the milder character of what remains, which is why the conversion is a far larger intervention in a cool-climate wine than in a warm one."),
    SA("Malolactic conversion as chemistry",
       "One bacterial species does nearly all of the malolactic work in commercial cellars, because it tolerates low pH, high alcohol and sulphur better than its rivals. Name it.",
       "Oenococcus oeni",
       ["oenococcus oeni", "oenococcus", "o oeni", "leuconostoc oenos",
        "oenococcus oeni bacteria"],
       "It was known for years under an older name before being reclassified, and either name still turns up in cellar literature. Its tolerance is the whole reason it is chosen: the other lactic acid bacteria found in wine will work in a soft, high-pH environment but bring spoilage characters with them, so a cellar that wants the conversion without the risk inoculates rather than waits."),
    SA("Malolactic conversion as chemistry",
       "A cellar wants the softening of malolactic conversion without the dairy note that often comes with it, so it co-inoculates early and leaves the wine on its yeast lees afterwards. Which compound is that regime aimed at?",
       "Diacetyl",
       ["diacetyl", "2 3 butanedione", "butanedione", "diacetyl 2 3 butanedione",
        "diacetyl butanedione"],
       "Yeast reduce it to acetoin and then to butanediol, both of which are odourless at wine concentrations, so leaving the wine in contact with live yeast strips the character out again. Running the bacteria alongside the ferment rather than after it has the same effect for the same reason, which is why the buttery style is a choice rather than an inevitability."),

    # --------------------------------------- Oxygen given and oxygen taken (3) --
    Q("Oxygen given and oxygen taken",
      "Vitamin C goes into a white at bottling as an oxygen scavenger, and every textbook warns against using it in a wine short of sulphur dioxide. What is the danger?",
      ["Scavenging leaves hydrogen peroxide behind, which does the worse damage",
       "It strips the colour out of a white within days of bottling and leaves it looking tired",
       "It feeds any yeast that survived the filtration",
       "It binds whatever free sulphur dioxide is left"], 0,
      "Ascorbic acid takes up oxygen readily, and the product of that reaction is a peroxide that goes on to oxidise the wine faster than the oxygen it removed would have. Sulphur dioxide mops the peroxide up, so the pair are used together or not at all, and a bottle dosed with the vitamin alone can brown within months."),
    SA("Oxygen given and oxygen taken",
       "Oxygen does not attack a wine's alcohol directly. It is spent on the phenolics instead, producing a highly reactive product that browns a white and strips the aroma out of it. Name that product.",
       "Quinones",
       ["quinones", "quinone", "o quinones", "o quinone", "ortho quinones",
        "ortho quinone", "orthoquinones", "orthoquinone", "quinone compounds",
        "phenolic quinones", "phenolic quinone", "quinones o quinones",
        "o quinones quinones"],
       "Quinones are the fork in the road: they join up into the brown pigments that colour an old white, and they also seize on sulphur-bearing aroma compounds and take them out of the glass permanently. Making them is not a simple collision, because oxygen in its ordinary state is too unreactive to take a phenol on directly: the wine's traces of iron pass the electrons between the two, which is why metal content sets the pace at which a wine browns. That second reaction is why an oxidised aromatic white does not merely smell tired but smells of nothing, and why the loss cannot be reversed by any later addition.",
       ex=True),
    SA("Oxygen given and oxygen taken",
       "Closure suppliers sell screwcap liners and technical corks against a single published number, measured in milligrams a year. Name that specification.",
       "Oxygen transmission rate",
       ["oxygen transmission rate", "oxygen transfer rate", "otr",
        "oxygen transmission rate otr", "oxygen ingress rate",
        "rate of oxygen transmission", "oxygen transmission", "oxygen ingress",
        "otr oxygen transmission rate", "oxygen transfer rate otr"],
       "Quoting a figure lets a producer match the closure to the wine rather than to a tradition: an aromatic white wants the tightest liner available, while a structured red is often given a more permissive one on the argument that a trickle of air helps the tannin settle. It also made consistency measurable, which was the real complaint against natural cork rather than the average level of ingress.",
       ex=True),

    # ------------------------------------------- The chemistry of the faults (6) --
    Q("The chemistry of the faults",
      "Musty bottles keep appearing from one winery under every closure it uses, and the trail runs back to a chlorine-based cleaner sprayed on the cellar timbers years earlier. Which sequence turned that cleaner into a taint?",
      ["Chlorine made chlorophenols in the wood, and moulds then methylated those into a haloanisole",
       "Chlorine reacted directly with the wine's own alcohol in bottle to form a chlorinated ester with a musty smell",
       "Chlorine bleached the wine's phenolics, and the musty smell is what was left once the colour had gone",
       "Chlorine killed the cellar's flora, and the taint came from their decay"], 0,
      "Chlorine attacks the phenolic compounds in timber and cardboard to give chlorophenols, which are not especially smelly; the damage is done when ordinary cellar moulds add a methyl group and turn them into anisoles detectable at parts per trillion. The bromine equivalent works the same way off flame retardants and wood preservatives, which is why a building can taint every wine that passes through it whatever the bottles are sealed with."),
    SA("The chemistry of the faults",
       "Beetroot and damp earth on a wine made from rot-affected fruit is not a cork problem at all, but a compound made by moulds and soil bacteria out in the vineyard. Name it.",
       "Geosmin",
       ["geosmin", "geosmine", "geosmin taint"],
       "It is the same molecule that gives soil its smell after rain, and the nose finds it at a few parts per trillion in water and at a few tens of parts per trillion in wine, where the matrix hides some of it. Because it arrives on the fruit rather than through the cellar, the defence is sorting and speed at the crusher: activated carbon will pull some of it out afterwards and takes the wine's own aroma with it, which is why nobody counts that as a cure."),
    SA("The chemistry of the faults",
       "Asked to confirm Brettanomyces in a suspect barrel, a laboratory reports the volatile phenol that carries the horse-and-farmyard note, in micrograms per litre. Name that compound.",
       "4-ethylphenol",
       ["4 ethylphenol", "ethylphenol", "4 ethyl phenol", "ethyl phenol", "4ep",
        "4 ep", "four ethylphenol", "para ethylphenol",
        "4 ethylphenol 4 ep", "4 ep 4 ethylphenol"],
       "The yeast decarboxylates a hydroxycinnamic acid that every red already carries and then reduces the product, and the analysis is far more reliable than a plate count because the cells can be scarce while the compound is not. Its partner reads as smoke and clove rather than farmyard, and the ratio between the two is roughly constant, which is why a laboratory can report one figure and a cellar can act on it.",
       ex=True),
    Q("The chemistry of the faults",
      "Vinegar and nail varnish arrive together on a red left in an ullaged barrel, and the laboratory reports an acid and its ethyl ester side by side. Which organism made them, and out of what?",
      ["Acetobacter, from ethanol and air",
       "Lactic acid bacteria, out of the last grams of residual sugar left in the barrel",
       "Brettanomyces, working on the wine's glycerol",
       "Wine yeast, out of the sulphur compounds sitting in the lees"], 0,
      "Acetobacter and its relatives need oxygen, so the fault is a storage failure rather than a fermentation one: a barrel left short, a tank with a leaking valve, a cap allowed to dry out. The ester that smells of solvent is formed afterwards from the acid and the wine's own alcohol, which is why the two markers climb together and why the solvent note is often the first thing a taster catches."),
    SA("The chemistry of the faults",
       "A length of copper wire dropped into a tank that smells of rotten eggs clears the smell within minutes, leaving a black precipitate behind. Name the compound the copper has taken out.",
       "Hydrogen sulphide",
       ["hydrogen sulphide", "hydrogen sulfide", "h2s", "hydrogen sulphide h2s",
        "hydrogen sulfide h2s"],
       "Copper and sulphide form an insoluble black salt that drops out of solution, which is the whole of the trick. The treatment is far less reliable than it looks, because the heavier thiols and disulphides that give struck rubber and drains are not removed the same way and some of them are only masked, so a trial is run on a bench sample and the copper left in the wine is capped by law."),
    SA("The chemistry of the faults",
       "Left standing under a retailer's fluorescent tubes in clear glass, a rose picks up cooked cabbage and wet wool within weeks, and the reaction starts from a vitamin the wine carries. Name that fault.",
       "Lightstrike",
       ["lightstrike", "light strike", "light struck", "lightstruck",
        "light strike taint", "gout de lumiere"],
       "Riboflavin absorbs light in the blue and near-ultraviolet, and the excited molecule pulls a sulphur-bearing amino acid apart into compounds that smell of boiled vegetables. Green and brown glass filter most of the damaging wavelengths and flint glass filters almost none, which is why the fault is commonest in exactly the pale wines most often bottled in clear glass."),

    # ---------------------------------------- What a bottle does afterwards (2) --
    Q("What a bottle does afterwards",
      "Fifteen years under screwcap leave a Riesling honeyed and complex, and the total oxygen admitted over that time would not fill a teaspoon. What does that establish about maturation in glass?",
      ["Most of it is rearrangement among compounds already in the wine, not reaction with air",
       "Oxygen must be passing through the glass itself",
       "The wine had to have been oxidised deliberately before bottling",
       "A screwcap admits far more oxygen than a cork does over that span"], 0,
      "Aroma compounds sit in a young wine bound to sugars and hidden, and the wine's own acidity slowly cuts them loose without any oxygen involved; acids and alcohols also drift toward an equilibrium of esters over years. Oxygen matters at the margin and matters enormously once it is excessive, but the honeyed development of a well-sealed white is a rearrangement of what was already in the bottle."),
    SA("What a bottle does afterwards",
       "Sun exposure in the vineyard and years in bottle together build the petrol note of a mature Riesling out of carotenoid precursors laid down in the berry. Give the name of the compound responsible, or its usual abbreviation.",
       "TDN",
       ["tdn", "t d n", "trimethyldihydronaphthalene",
        "trimethyl dihydronaphthalene", "tdn trimethyldihydronaphthalene",
        "1 1 6 trimethyl 1 2 dihydronaphthalene",
        "1 1 6 trimethyldihydronaphthalene",
        "1 1 6 trimethyl dihydronaphthalene",
        "trimethyldihydronaphthalene tdn", "trimethyl dihydronaphthalene tdn",
        "1 1 6 trimethyl 1 2 dihydronaphthalene tdn",
        "1 1 6 trimethyldihydronaphthalene tdn",
        "1 1 6 trimethyl dihydronaphthalene tdn",
        "1 1 6 trimethyl 1 2 dihydronaphthalene or tdn"],
       "The precursor is odourless and accumulates in the skin under strong light and mild water stress, then converts slowly in the acid conditions of the bottle, which is why the character appears with age rather than at bottling and why a warm, exposed site delivers more of it. Shading the fruit and a cooler site both hold it down, and it is one of the few tertiary characters a grower can influence in the vineyard.",
       ex=True),
]
