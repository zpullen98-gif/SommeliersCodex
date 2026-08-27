"""Rank II rewrite - Burgundy (49 questions: 19 MC, 30 short answer).

Certified level, pitched deliberately above the Rank I "Burgundy" category.
Where Rank I counts the tiers of the pyramid, this asks what a grower may write
on the label after blending three premier cru climats together; where Rank I
names the Beaujolais crus, this asks where the gas in a closed vat of unbroken
bunches actually comes from. Nothing here repeats a Rank I task.

The running order follows the way a Burgundy label has to be read: the tiers
first, then the vocabulary of the map, then the Cote d'Or commune by commune,
then the grand crus and the monopoles, then the outlying regions, and last the
trading arrangements that decide whose name goes on the bottle.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and were
tested by execution rather than eyeballed. No '~' entries appear anywhere: the
tilde is exact-OR-containment, so a one-word tilde grades any wrong answer that
happens to hold that word. Note that core.js norm() strips 'de', 'des', 'du',
'la' and 'le' as stopwords, which collapses half of Burgundy's place names into
each other, so every list here was checked for entries that normalise to the same
string. Where a real and different wine extends or truncates the right answer -
Romanee against Romanee-Conti, Charlemagne against Corton-Charlemagne, Maranges
against Sampigny-les-Maranges, Bourgogne Cote d'Or against the bare escarpment
name - the wrong form was run through match_sa to confirm it does NOT grade, and
ex=True with listed phrasings was applied to the seven questions where it did.
Two of those seven were found only by running the probe rather than by reading:
matchSA also matches when the INPUT sits inside an accept entry, so 'Cote de
Nuits' graded Cote de Nuits-Villages and 'Batard-Montrachet' graded
Criots-Batard-Montrachet. Both are real and different things, and neither is
visible in the question text. Each ex=True list was then widened until case,
hyphenation, article and AOC-suffix variants of its own answer all still grade,
because exact matching rejects anything not written down.

A later pass ran every contiguous n-gram of each stem through that question's own
grader, which is what check-stem-echo.py does, and three stems paid out on their
own words. Two are closed. The combe list carried 'a combe in the cote d'or',
which graded the bare escarpment name because matchSA also matches when the INPUT
sits inside an accept entry; that entry was dropped, since plain 'combe' already
grades any answer holding the word and nothing else died with it. La Romanee was
not an accept-list fault at all: norm() strips 'la', so 'La Romanee' and 'Romanee'
are one string to the engine and no list can take the first while refusing the
second, so the stem now points at the monopole below rather than printing its
name.

The third is left open deliberately, and the reasoning is worth keeping. The
metayage list grades 'share', lifted from 'a share of the crop', through the bare
one-word entry 'sharecropping': matchSA matches when the input sits inside an
accept entry, and a one-word entry puts the word-count floor at one. Every way of
closing it costs more than it saves. Deleting 'sharecropping' rejects the standard
English trade term, because under a containment list no longer entry can grade a
bare single word. Switching to ex=True closes the echo but converts an open class
of correct answers into a closed one, so 'metayages', 'the metayage system', 'it
is called metayage' and every other phrasing nobody thought to write down are
marked wrong; and because the answer is a bare noun, no multi-word '~' entry can
carry that class either. A student who knows the word and is told they are wrong
is the worse outcome by a distance, so the list stays on containment and the echo
is conceded. Two real phrasings were added while the question was open: 'share
cropping' spaced, and 'a moitie', which is the name the explanation itself teaches
and which the list had never taken.

Facts are restricted to ones that do not drift. Ownership, prices, hectare counts
and production shares are deliberately absent; appellation rules, label mechanics,
geology, geography and the tenancy arrangements carry the weight instead. The one
exception is La Romanee, whose sub-hectare size is written into the appellation
itself rather than into anybody's holding.
"""

from lib import Q, SA

CAT = "Burgundy"
SLUG = "r2-burgundy"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("The tiers and what each one covers", 5),
    ("Climat, lieu-dit and reading the map", 4),
    ("The Cote de Nuits commune by commune", 6),
    ("The Cote de Beaune commune by commune", 6),
    ("Grands crus and monopoles", 5),
    ("Chablis and the Grand Auxerrois", 6),
    ("Chalonnaise, Hautes-Cotes and Maconnais", 6),
    ("Beaujolais and its crus", 5),
    ("Grapes beyond the two", 3),
    ("Domaine, negociant and metayage", 3),
]

BANK = [
    # ------------------------------- The tiers and what each one covers (5) --
    Q("The tiers and what each one covers",
      "A grower in Meursault owns slivers of three separate premier cru climats and blends them into a single cuvee. What may the label say?",
      ["Meursault Premier Cru, with no vineyard named",
       "Meursault Premier Cru followed by all three climat names",
       "The name of the largest of the three climats, followed by Premier Cru",
       "Nothing above village level, since the blend forfeits the tier"], 0,
      "Premier cru standing belongs to the land, so blending across climats within one village keeps the tier and forfeits only the site name. That is why an unnamed premier cru is often the cheapest way into a serious village, and why a grower with many small parcels reaches for it."),
    Q("The tiers and what each one covers",
      "A negociant blends red from two different communes of the southern Cote d'Or. Which appellation can carry the wine without dropping it to regional level?",
      ["Cote de Beaune-Villages", "Cote de Beaune", "Bourgogne Hautes-Cotes de Beaune",
       "Coteaux Bourguignons"], 0,
      "Cote de Beaune-Villages is red only and draws on the Cote de Beaune's village appellations with four excepted: Aloxe-Corton, Beaune, Pommard and Volnay are barred from the blend, which leaves the lesser names, and odd lots of those are exactly what the appellation exists to absorb. Plain Cote de Beaune is a separate and much smaller appellation for vineyards on the hill above the town of Beaune itself, and it is not a blending name."),
    SA("The tiers and what each one covers",
       "Regional Bourgogne may be grown almost anywhere in the region, so growers on the famous escarpment pressed for a regional name that only their own slopes could use. Name it.",
       "Bourgogne Cote d'Or",
       ["bourgogne cote d'or", "bourgogne cote dor", "bourgogne cote d'or aoc",
        "aoc bourgogne cote d'or", "the bourgogne cote d'or appellation"],
       "Created in 2017, it sits above plain Bourgogne and below the village names, and the fruit must come from the Cote de Nuits or the Cote de Beaune. The point is commercial as much as geological: a Bourgogne from the escarpment had no way of saying so, while one from the flat land beyond the motorway carried the same three words.",
       ex=True),
    SA("The tiers and what each one covers",
       "Every grand cru site in Burgundy holds an appellation of its own, with Chablis Grand Cru counting once. Give the total.",
       "Thirty-three",
       ["thirty three", "33", "thirty three grand crus", "33 grand crus",
        "thirty three appellations", "33 appellations", "thirty three grand cru appellations"],
       "Thirty-two of them lie on the Cote d'Or and the thirty-third is Chablis Grand Cru, which is a single appellation covering seven climats rather than seven appellations. Counting the Chablis climats separately is the usual way to arrive at the wrong number.",
       ex=True),
    SA("The tiers and what each one covers",
       "Bourgogne Grand Ordinaire was retired in 2011, and its replacement now sits at the foot of the hierarchy taking Gamay and Pinot Noir alike from across the region. Name that appellation.",
       "Coteaux Bourguignons",
       ["coteaux bourguignons", "coteaux bourguignon",
        "the coteaux bourguignons appellation"],
       "It reaches from Chablis to the bottom of Beaujolais and admits Gamay, Pinot Noir, Chardonnay, Aligote and Melon, which no other Burgundian name does. The rename was a marketing decision: Grand Ordinaire told a shopper the wine was ordinary in a language they could read."),

    # --------------------------- Climat, lieu-dit and reading the map (4) ----
    Q("Climat, lieu-dit and reading the map",
      "On a village-level Chassagne-Montrachet the parcel name must be printed no more than half the height of the appellation name. Which kind of name is being held down that way?",
      ["A lieu-dit", "A climat", "A clos", "A monopole"], 0,
      "A lieu-dit is simply a name in the land registry, and every scrap of ground has one whether or not it is distinguished. The half-height rule exists so that a village wine naming its parcel cannot be mistaken at a glance for a premier cru, where the vineyard name is printed the same size as the appellation."),
    Q("Climat, lieu-dit and reading the map",
      "Monks walled parcels of the Cote d'Or to mark and protect them, and the practice left a word behind on the labels. What does Clos record?",
      ["A vineyard that is or was enclosed by a wall",
       "A vineyard held entire by one owner",
       "A vineyard whose wine is aged wholly in new oak",
       "A vineyard ranked between premier cru and grand cru"], 0,
      "The wall is the whole of the meaning, and plenty of clos have lost theirs and kept the name. A vineyard in one pair of hands is a monopole, which is a separate idea altogether: Clos de Vougeot is walled and shared among dozens of owners at once."),
    SA("Climat, lieu-dit and reading the map",
       "Burgundian growers still size a plot in an old unit reckoned as the ground one man could work in a day. Name that unit.",
       "Ouvree",
       ["ouvree", "ouvrees", "an ouvree of vines"],
       "An ouvree runs to a little over four ares, so eight of them make a journal, the day's work of a man with a horse, and it takes something like twenty-four to make a hectare. The unit survives because Burgundian holdings are small enough that hectares are a clumsy way to describe them, and a sale is still gossiped about in ouvrees."),
    SA("Climat, lieu-dit and reading the map",
       "Dry transverse valleys cut back into the Cote d'Or escarpment, swinging aspect around and funnelling cold air down onto the slope. What are they called locally?",
       "Combe",
       ["combe", "combes"],
       "A combe interrupts the even east-facing wall of the Cote and exposes north and south flanks within a few hundred metres of each other, which is why the vineyard quality can change so abruptly beside one. The cold air draining out of them also explains why the ground directly at a combe mouth is usually village land rather than premier cru."),

    # -------------------------- The Cote de Nuits commune by commune (6) -----
    Q("The Cote de Nuits commune by commune",
      "Most of one Cote de Nuits grand cru lies in Chambolle-Musigny, with a slice of it falling inside Morey-Saint-Denis. Which grand cru?",
      ["Bonnes-Mares", "Musigny", "Clos de la Roche", "Clos Saint-Denis"], 0,
      "The commune boundary runs straight through it, so one name covers two soils: pale marl the growers call terres blanches on the Morey side, and redder, iron-stained ground on the Chambolle side. The Morey portion gives the firmer wine, which is much of why Bonnes-Mares tastes stouter than Musigny a few hundred metres away."),
    Q("The Cote de Nuits commune by commune",
      "One Gevrey grand cru may be sold under its neighbour's name, though the traffic runs only one way. Which vineyard holds that right?",
      ["Chambertin-Clos de Beze", "Charmes-Chambertin", "Latricieres-Chambertin",
       "Ruchottes-Chambertin"], 0,
      "Clos de Beze may be labelled simply Chambertin; Chambertin may not be labelled Clos de Beze. The abbey of Beze was given the land in the seventh century, and the story runs that a man called Bertin planted the field alongside it, which is the order the naming rule still respects."),
    SA("The Cote de Nuits commune by commune",
       "Fixin and Brochon at the northern end, Corgoloin and Prissey at the southern: these communes share one village-level appellation. Name it.",
       "Cote de Nuits-Villages",
       ["cote de nuits villages", "cote de nuits village",
        "cotes de nuits villages", "cote de nuits villages aoc",
        "the cote de nuits villages appellation"],
       "The name gathers up the ends of the Cote where the escarpment is lower and the ground stonier, and it sits at village level rather than regional level. Fixin also holds a village appellation of its own, so a grower there chooses which of the two to use.",
       ex=True),
    SA("The Cote de Nuits commune by commune",
       "At the southern end of the Cote de Nuits, one commune is better known for the hard pale limestone cut from its quarries than for its wine. Name the commune.",
       "Comblanchien",
       ["comblanchien", "the commune of comblanchien",
        "comblanchien in the cote de nuits"],
       "The stone is polished and sold as a marble substitute, and it has faced buildings across France. The same hard bed is why the vineyard there is thin and stony and sells under Cote de Nuits-Villages rather than under its own name."),
    SA("The Cote de Nuits commune by commune",
       "Gevrey-Chambertin's most sought-after premier cru sits above the village on ground that turns to face east, and its promotion is argued for every few years. Name it.",
       "Clos Saint-Jacques",
       ["clos saint jacques", "clos st jacques",
        "clos saint jacques in gevrey chambertin"],
       "It lies north of the grand cru band rather than within it, which is an accident of where the boundary was drawn in the 1930s rather than a verdict on the slope. The wine routinely outprices several of the grand crus it was passed over for, and that is the argument its supporters make."),
    SA("The Cote de Nuits commune by commune",
       "Inside the Vougeot commune a walled premier cru has been planted to white grapes since the Cistercians held it. Name that vineyard.",
       "Clos Blanc de Vougeot",
       ["clos blanc de vougeot", "clos blanc", "vougeot clos blanc",
        "clos blanc de vougeot premier cru",
        "the clos blanc de vougeot vineyard"],
       "It sits just outside the wall of the grand cru and has grown Chardonnay for something close to nine hundred years, which makes it the oldest white plot of the Cote de Nuits. White at grand cru level here is confined to Musigny, so a white Vougeot can rise no higher than premier cru.",
       ex=True),

    # ------------------------- The Cote de Beaune commune by commune (6) -----
    Q("The Cote de Beaune commune by commune",
      "A hamlet on the boundary of Meursault and Puligny-Montrachet has an appellation covering red wine only, its whites going out under the neighbouring village names. Which appellation?",
      ["Blagny", "Saint-Romain", "Auxey-Duresses", "Monthelie"], 0,
      "Blagny is red and nothing else. Chardonnay from the identical slope is labelled Meursault or Puligny-Montrachet depending on which commune the row falls in, so a single grower can bottle three appellations off adjoining vines and never move the tractor far."),
    Q("The Cote de Beaune commune by commune",
      "Grand cru ground on the Corton hill is shared by more than one commune. Which set of communes holds it?",
      ["Aloxe-Corton, Pernand-Vergelesses and Ladoix-Serrigny",
       "Aloxe-Corton, Savigny-les-Beaune and Chorey-les-Beaune",
       "Aloxe-Corton and Beaune", "Beaune, Pommard and Volnay"], 0,
      "Corton and Corton-Charlemagne wrap around the shoulder of the hill and cross both boundaries, which is why a Ladoix or Pernand grower can own grand cru without their village ever appearing on the bottle. It is also why those two village names are among the best value on the Cote de Beaune: the reputation went to the hill, not to them."),
    SA("The Cote de Beaune commune by commune",
       "Of the five grand crus on the Montrachet hill, Montrachet itself and Batard-Montrachet cross the Puligny-Chassagne boundary. Which one lies wholly inside Chassagne-Montrachet?",
       "Criots-Batard-Montrachet",
       ["criots batard montrachet", "criots", "criots batard",
        "criots batard montrachet grand cru", "criots batard montrachet aoc",
        "the criots batard montrachet vineyard"],
       "Criots sits at the southern foot of Batard, entirely in Chassagne. Chevalier-Montrachet and Bienvenues-Batard-Montrachet are the mirror case, both wholly inside Puligny, which is why Puligny is usually credited with the finer end of the hill.",
       ex=True),
    SA("The Cote de Beaune commune by commune",
       "Tucked in a valley behind the Montrachet hill, one village sells most of its vineyard at premier cru level and is the standard recommendation for white Burgundy that does not cost a fortune. Name it.",
       "Saint-Aubin",
       ["saint aubin", "st aubin", "saint aubin aoc"],
       "En Remilly and Les Murgers des Dents de Chien run right up to the Chevalier-Montrachet boundary, and the wines from them are recognisably of the same slope. The village sits in a side valley off the main Cote, which is the whole reason it was never priced with its neighbours."),
    SA("The Cote de Beaune commune by commune",
       "Past Santenay the Cote de Beaune runs out in one last appellation, created in 1989 from villages that had hyphenated a shared vineyard name onto their own. Name it.",
       "Maranges",
       ["maranges", "maranges aoc", "the maranges appellation",
        "maranges in the cote de beaune"],
       "Cheilly, Dezize and Sampigny had all appended les-Maranges to their names, and the appellation simply took the vineyard name and dropped the villages. The ground faces south rather than east here as the Cote swings round, and it is the last of the Cote d'Or before the Chalonnaise begins.",
       ex=True),
    SA("The Cote de Beaune commune by commune",
       "Red wine from a premier cru lying inside the commune of Meursault goes to market under the Volnay name instead. Name that climat.",
       "Santenots",
       ["santenots", "les santenots", "volnay santenots"],
       "Meursault sells white and Volnay sells red, so the rules let the Pinot Noir grown at Santenots take the name that will move it. White from the same rows stays Meursault. It is the plainest case in Burgundy of an appellation following reputation rather than the map."),

    # ----------------------------------------- Grands crus and monopoles (5) -
    Q("Grands crus and monopoles",
      "A guest asks why they cannot compare one producer's Clos de Tart against another's, the way they might with Clos de Vougeot. What is the answer?",
      ["Clos de Tart is a monopole, held entire by a single owner",
       "Clos de Tart is a premier cru, so no producer may print its name",
       "Clos de Tart is a brand rather than a delimited vineyard",
       "Clos de Tart may only be sold as Morey-Saint-Denis"], 0,
      "Cistercian nuns planted it in the twelfth century and it has never been divided, so there is exactly one wine to taste in any vintage. Clos de Vougeot is the opposite case: one wall around ground that slopes from the road to the top of the hill, split among dozens of owners who each make something different from it."),
    Q("Grands crus and monopoles",
      "Bressandes, Clos du Roi and Renardes appear on labels appended to a single grand cru name. Which grand cru takes them?",
      ["Corton", "Chambertin", "Musigny", "Montrachet"], 0,
      "Corton covers a long sweep of hillside, so the decree lets a grower add the climat to the grand cru name and say where on the hill the fruit grew. Gevrey works the other way round: each of its climats is an appellation in its own right, so Charmes-Chambertin is a name rather than a qualification of Chambertin."),
    SA("Grands crus and monopoles",
       "A white grand cru appellation on the Corton hill is almost never seen on a bottle, because everyone entitled to it prefers a better-known name. Name the unused appellation.",
       "Charlemagne",
       ["charlemagne", "the charlemagne appellation", "charlemagne grand cru",
        "charlemagne aoc"],
       "It remains on the books, and every grower who could use it labels the wine Corton-Charlemagne instead, which the market recognises and pays for. The two appellations cover overlapping ground, so the choice costs nothing and the shorter name has simply died of neglect.",
       ex=True),
    SA("Grands crus and monopoles",
       "A Morey-Saint-Denis climat was reassembled from scattered parcels over decades and raised from premier cru to grand cru in 1981. Name it.",
       "Clos des Lambrays",
       ["clos des lambrays", "lambrays", "the clos des lambrays vineyard"],
       "The vineyard had been split among many hands after the Revolution and was patiently bought back into one piece, which is what made the case for promotion arguable at all. A tiny fragment stayed outside the reassembly, so the grand cru is very nearly but not quite a monopole."),
    SA("Grands crus and monopoles",
       "Directly above the most famous monopole in Vosne lies a grand cru of well under a hectare, the smallest appellation in France. Name it.",
       "La Romanee",
       ["la romanee", "la romanee grand cru", "la romanee aoc",
        "the la romanee vineyard"],
       "It is a strip of slope no wider than a tennis court is long, and the whole appellation makes a few hundred cases in a generous year. Answering Romanee-Conti here is the standard error: that is the vineyard immediately below, and it is more than twice the size.",
       ex=True),

    # ------------------------------------ Chablis and the Grand Auxerrois (6) -
    Q("Chablis and the Grand Auxerrois",
      "Chablis growers spent the 1970s in a public fight over where the appellation's edge should fall. What were the rival criteria?",
      ["Whether soil alone should qualify, or slope and exposure too",
       "Whether machine harvesting should be permitted below the premier cru rank",
       "Whether oak ageing should be compulsory at premier cru and above",
       "Whether the river should form the eastern limit of all planting"], 0,
      "One camp held that the grey Kimmeridgian marl was the appellation and nothing else could be Chablis; the other argued that a well-sited slope on the younger Portlandian limestone above it ripens perfectly well. The expansionists largely won, which is why the planted area is a multiple of what it was and why the argument still surfaces whenever a poor vintage is discussed."),
    Q("Chablis and the Grand Auxerrois",
      "Every one of the seven Chablis grand cru climats shares a single slope with the premier cru Montee de Tonnerre. Which bank of the Serein is it on, and which way does it face?",
      ["The right bank, facing southwest", "The left bank, facing northeast",
       "The right bank, facing due north", "The left bank, facing due south"], 0,
      "The Serein runs northwest through the town, and the right bank carries the one continuous southwest-facing wall of hillside that holds all seven grand cru climats, with Montee de Tonnerre and Fourchaume continuing it. Left bank climats such as Vaillons and Montmains face the other way and give lighter, quicker wines."),
    Q("Chablis and the Grand Auxerrois",
      "Twenty kilometres from Chablis, a village appellation makes red from Pinot Noir with a permitted minority of a rare local grape. Which grape may it add?",
      ["Cesar", "Tressot", "Sacy", "Gamay"], 0,
      "Irancy is the Yonne's red appellation, and Cesar is a dark, tannic relation of Pinot Noir grown essentially nowhere else. A little of it stiffens a Pinot picked at the northern limit of ripeness, and too much of it makes the wine hard, which is why the ceiling is low."),
    SA("Chablis and the Grand Auxerrois",
       "One Burgundian village appellation is planted to Sauvignon Blanc rather than Chardonnay, which is much of why it waited until 2003 for recognition. Name it.",
       "Saint-Bris",
       ["saint bris", "st bris", "saint bris aoc", "sauvignon de saint bris"],
       "It sat as a VDQS for decades because the authorities were reluctant to grant an appellation to a grape with no Burgundian standing. The vineyard is on the same Kimmeridgian ground as Chablis, close enough that a grower may own rows of both."),
    SA("Chablis and the Grand Auxerrois",
       "A named parcel straddling Vaudesir and Les Preuses is treated as grand cru without being one of the seven climats. Name that parcel.",
       "La Moutonne",
       ["la moutonne", "la moutonne monopole", "la moutonne in chablis"],
       "It is a monopole whose name is older than the 1938 decree but does not appear in it, since that decree lists only the seven climats; grand cru standing was granted to the parcel separately at the turn of the 1950s, so the label carries Chablis Grand Cru and the parcel name rather than either of the two climats it lies across. Anyone reciting the seven climats and expecting to have named every grand cru bottling has missed it."),
    SA("Chablis and the Grand Auxerrois",
       "Chablis keeps a traditional cask of its own, smaller than the standard Burgundian barrel and still used there as a unit of account. Name it.",
       "Feuillette",
       ["feuillette", "feuillettes", "the chablis feuillette"],
       "The Chablis feuillette holds a hundred and thirty-two litres against the two hundred and twenty-eight of a Burgundian piece, and confusingly the Cote d'Or has a feuillette of its own at a hundred and fourteen. Crops and contracts in the Yonne are still quoted in them long after the wine went into tank."),

    # -------------------------- Chalonnaise, Hautes-Cotes and Maconnais (6) --
    Q("Chalonnaise, Hautes-Cotes and Maconnais",
      "Behind the Cote d'Or escarpment, on a plateau appreciably higher and further from the plain, sit two regional appellations. How do their wines read against those of the slope below?",
      ["Later ripening and higher acidity",
       "Higher alcohol and markedly lower acidity",
       "Deeper colour and firmer tannin",
       "Sweetness from botrytis in most vintages"], 0,
      "The Hautes-Cotes de Nuits and Hautes-Cotes de Beaune sit a couple of hundred metres higher, so budbreak and harvest both run late and the fruit arrives leaner, which shows in the glass as higher acidity and a lighter body. Warm vintages have done more for them than for anywhere else in Burgundy, which is why they now appear on lists that ignored them for a generation."),
    Q("Chalonnaise, Hautes-Cotes and Maconnais",
      "Besides Pouilly-Fuisse, the Maconnais carries the Pouilly name on two much smaller appellations. Which pair?",
      ["Pouilly-Loche and Pouilly-Vinzelles", "Pouilly-Fume and Pouilly-sur-Loire",
       "Pouilly-Solutre and Pouilly-Vergisson", "Pouilly-Chaintre and Pouilly-Davaye"], 0,
      "Both are Chardonnay like Pouilly-Fuisse, and a Loche grower may sell the wine as Vinzelles if they prefer. Pouilly-Fume and Pouilly-sur-Loire are three hundred kilometres away on the Loire and made from Sauvignon Blanc and Chasselas, which is the confusion the name invites on every list that carries both."),
    SA("Chalonnaise, Hautes-Cotes and Maconnais",
       "The southern Maconnais has a Chardonnay appellation split into blocks lying either side of Pouilly-Fuisse. Name it.",
       "Saint-Veran",
       ["saint veran", "st veran", "saint veran aoc"],
       "The northern block sits around Davaye and Prisse and the southern around Leynes and Chasselas, with Pouilly-Fuisse wedged between them. Growers in the northern block work the same limestone slopes as Pouilly-Fuisse itself, which is why the appellation is the standard place to look for that style at a lower price."),
    SA("Chalonnaise, Hautes-Cotes and Maconnais",
       "Two Macon-Villages communes were detached in 1999 and given a hyphenated appellation of their own. Name it.",
       "Vire-Clesse",
       ["vire clesse", "vire clesse aoc", "the vire clesse appellation"],
       "Vire and Clesse had long been the two best-regarded communes entitled to add their names to Macon, and the promotion took them out of that system entirely. The zone also had a tradition of leaving a little residual sugar, which the appellation rules then had to accommodate."),
    SA("Chalonnaise, Hautes-Cotes and Maconnais",
       "Wine from the Chalonnaise that does not qualify for one of the five village appellations falls back on a regional name of its own. Give that name.",
       "Bourgogne Cote Chalonnaise",
       ["bourgogne cote chalonnaise", "cote chalonnaise",
        "bourgogne cote chalonnaise aoc"],
       "Bouzeron, Rully, Mercurey, Givry and Montagny are the five village names, and everything else on those hills sells under the regional one. It ranks with Bourgogne Cote d'Or and the Hautes-Cotes as a regional appellation restricted to a stated stretch of ground rather than to the whole region."),
    SA("Chalonnaise, Hautes-Cotes and Maconnais",
       "A Maconnais red may not use the label form its white neighbours use freely. Which appellation is closed to red wine?",
       "Macon-Villages",
       ["macon villages", "macon villages aoc", "the macon villages appellation"],
       "Macon-Villages is Chardonnay and nothing else. A red from the same ground goes out as plain Macon, or as Macon followed by its commune where that is permitted, so the word Villages on a Maconnais label is a reliable signal that the wine in the bottle is white."),

    # ---------------------------------------------- Beaujolais and its crus (5)
    Q("Beaujolais and its crus",
      "A Beaujolais vat is filled with unbroken bunches and closed, yet no carbon dioxide is added to it. Where does the gas that blankets the fruit come from?",
      ["Juice at the base of the vat ferments and gives it off",
       "The berries respire the oxygen out of the vat before any fermentation begins",
       "Dry ice is added at filling and is not counted as an addition",
       "Malolactic bacteria release it before the yeast start work"], 0,
      "The juice is there because the weight of the fruit above crushes the bottom bunches, and once it ferments the gas rises through the vat and blankets the whole berries. That is the difference between semi-carbonic and true carbonic maceration: the first makes its own blanket, the second has the gas piped in. In the semi-carbonic vat two fermentations run at once, a conventional yeast ferment in the free-run juice below and an intracellular one inside the whole berries above."),
    Q("Beaujolais and its crus",
      "Two Beaujolais crus share a name; one covers the flanks of a single hill of hard blue-green volcanic rock, the other the gentler ground around it. Which is the hillside one?",
      ["Cote de Brouilly", "Brouilly", "Chiroubles", "Regnie"], 0,
      "Mont Brouilly is a lump of hard blue-tinged rock standing clear of the granite, and wine off its flanks is firmer and more mineral than the wine around its base. Brouilly is the larger appellation on the lower ground, and the two are among the easiest names on a list to transpose."),
    SA("Beaujolais and its crus",
       "Morgon's most serious bottlings come off a dome of crumbling schist at the centre of the cru. Name that site.",
       "Cote du Py",
       ["cote du py", "cote du py in morgon", "the cote du py slope"],
       "The rock there weathers to an orange-brown crumb the growers call roche pourrie, rotten rock, and it gives a denser wine than the sandier ground below. Bottles off it are the usual evidence for the claim that Beaujolais can age, since they take on a dark kirsch and earth character over a decade."),
    SA("Beaujolais and its crus",
       "One Beaujolais cru is named for the oak wood felled to plant its vines. Name the cru.",
       "Chenas",
       ["chenas", "chenas cru", "the chenas appellation"],
       "The name comes from chene, oak, and the forest went to make room for the vineyard. Its ground runs into Moulin-a-Vent on one side, which is where a good deal of its fruit historically ended up, and its own name has always been the quieter of the two."),
    SA("Beaujolais and its crus",
       "Beaujolais held nine crus until 1988, when a tenth was raised from Beaujolais-Villages. Name the newest of them.",
       "Regnie",
       ["regnie", "regnie cru", "the regnie appellation"],
       "It sits on pink granite sand between Morgon and Brouilly and gives the lightest and most floral of the crus, which is part of why the promotion was argued about. No eleventh has followed, so the list has been fixed for a generation now."),

    # ------------------------------------------------ Grapes beyond the two (3)
    Q("Grapes beyond the two",
      "A red co-fermented from Pinot Noir and Gamay is sold as Bourgogne Passe-Tout-Grains. What minimum share must the Pinot Noir supply?",
      ["Thirty percent", "Fifteen percent", "Fifty percent", "Eighty-five percent"], 0,
      "At least thirty percent Pinot Noir and at least fifteen percent Gamay, and the two must go into the vat together rather than be blended afterwards. Eighty-five is the most Pinot the rule leaves room for rather than the least it demands. The name records the old peasant practice of throwing every grape on the holding into one fermenter, which is exactly what the co-fermentation rule preserves."),
    SA("Grapes beyond the two",
       "Bouzeron insists on one of Aligote's two forms, the golden-berried and lower-yielding one. Name it.",
       "Aligote Dore",
       ["aligote dore", "dore aligote", "the golden aligote dore"],
       "The other form, Aligote Vert, crops far more heavily and gives the thin, sharp wine that gave the grape its reputation as something to drown in cassis. Bouzeron's rules were written around the golden strain precisely to make the case that Aligote can be a serious wine."),
    SA("Grapes beyond the two",
       "Pinot Gris survives in old Burgundian plantings under a local name and may still be blended into a white Burgundy. Give that name.",
       "Pinot Beurot",
       ["pinot beurot", "beurot", "beurot in burgundy"],
       "It is the same grape as Alsace's Pinot Gris and Italy's Pinot Grigio, a colour mutation of Pinot Noir, and it is permitted in small amounts in several white appellations. The old vineyards were interplanted rather than blocked out by variety, which is how scattered vines of it came to be there at all."),

    # ------------------------------------- Domaine, negociant and metayage (3)
    Q("Domaine, negociant and metayage",
      "Two bottles from one village read mis en bouteille au domaine and mis en bouteille par. What does the difference tell a buyer?",
      ["The first was bottled by the grower of the fruit; the second need not be",
       "The first was bottled in France, the second shipped in bulk and bottled abroad",
       "The first is a premier cru and the second a village wine",
       "The first was bottled by hand and the second on a mobile line"], 0,
      "Au domaine means estate-bottled at the property that farmed the vines, and it is the only one of the two phrases that says anything about who grew the grapes. Mis en bouteille par followed by a name tells you only who filled the bottle, and mis en bouteille dans nos caves says the same thing rather more coyly."),
    SA("Domaine, negociant and metayage",
       "An owner who no longer farms lets a grower work the vines and takes payment as a share of the crop rather than in cash. Name that arrangement.",
       "Metayage",
       ["metayage", "en metayage", "metayage sharecropping", "sharecropping",
        "share cropping", "a moitie"],
       "The share was traditionally half, which is why the arrangement is also described as farming a moitie, and the tenant hands back wine rather than money. Inheritance split Burgundy into parcels too small for their owners to live off, and this is how a great deal of that land is actually worked."),
    SA("Domaine, negociant and metayage",
       "A Beaune house buys young wine in barrel, raises it in its own cellars and bottles it under its own label. Give the compound term for such a house.",
       "Negociant-eleveur",
       ["negociant eleveur", "a negociant eleveur house", "negociant eleveur in burgundy"],
       "Elevage is the raising of the wine between fermentation and bottling, so the second half of the term claims the part of the work that shapes the finished bottle. A house that only buys and resells finished wine has no claim on it, and the distinction is why two negociant bottlings of the same climat can taste unalike."),
]
