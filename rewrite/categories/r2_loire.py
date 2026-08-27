"""Rank II rewrite - Loire (37 questions: 15 MC, 22 short answer).

Certified level, pitched deliberately above the Rank I "Loire" category. Where
Rank I names the grape of Muscadet, this asks which rock lies under the village
whose name is on the label; where Rank I places Savennieres on its schist, this
asks what the appellation still permits that its reputation denies; where Rank I
identifies the sweet wines of the Layon, this asks what the rulebook demands
before a commune name may be printed after them. Nothing here repeats a Rank I
task.

The running order is the same journey upriver that Rank I uses, because the
geology insists on it, but the question at every stop is different: not what is
made here, but what the rulebook asks of it. So the bank moves from the granite
and gabbro of the Nantais, through the schist of Anjou and the Layon ladder, on
to Savennieres, the tuffeau of Saumur, the plateau soils of Vouvray, the
Cabernet Franc of Touraine, and finally the three soils of Sancerre and the
Centre beyond it.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and were
tested by execution rather than eyeballed. No '~' entries appear anywhere. Note
that core.js norm() strips 'de', 'du', 'la' and 'le' as stopwords, which
collapses Loire place names into one another and produced two accept entries
that normalised identically before they were rewritten. Where a real and
different appellation extends or truncates the right answer - Quarts de Chaume
against Chaume, Saint-Nicolas-de-Bourgueil against Bourgueil, Anjou Coteaux de
la Loire against Anjou, Coteaux du Loir against Anjou Coteaux de la Loire - the
wrong form was run through match_sa to confirm it does NOT grade, and ex=True
with listed phrasings was applied to the five questions where it did. The last
of those five was found only by running the probe rather than by reading:
matchSA also matches when the INPUT sits inside an accept entry as a plain
substring, so "Coteaux du Loir" normalises to "coteaux loir", which is a
substring of "anjou coteaux loire", and the Anjou Coteaux de la Loire question
graded a different appellation on the other side of the region as correct. Each
ex=True list was then widened until case, hyphenation, article and AOC-suffix
variants of its own answer all still grade.

Facts are restricted to ones that do not drift: appellation rules, label
mechanics, geology and geography carry the weight. No ownership, no volumes, no
hectare counts, no promotions from the last few years.
"""

from lib import Q, SA

CAT = "Loire"
SLUG = "r2-loire"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("The valley end to end", 4),
    ("Muscadet, its lees and the crus communaux", 5),
    ("Anjou, the Layon and the sweet appellations", 5),
    ("Savennieres and its crus", 3),
    ("Saumur, its rock and its appellations", 4),
    ("Vouvray, Montlouis and the Touraine appellations", 4),
    ("Cabernet Franc and the Touraine reds", 5),
    ("Sancerre, Pouilly and the soils of the Centre", 4),
    ("The Centre beyond Sancerre", 3),
]

BANK = [
    # --------------------------------------------- The valley end to end (4) --
    Q("The valley end to end",
      "A list needs one Loire district able to pour Sauvignon Blanc, Chenin Blanc, Cabernet Franc and Pinot Noir, every one of them from its own appellations. Which district?",
      ["Touraine", "The Pays Nantais", "Anjou-Saumur", "The Centre"], 0,
      "Touraine reaches from the Cabernet Franc of Chinon and Bourgueil in the west to the light sandy country in the east, where Pinot Noir appears. Anjou-Saumur has Chenin and Cabernet Franc but no Sauvignon of consequence, the Centre has Sauvignon and Pinot Noir but no Chenin anywhere and only one Cabernet Franc appellation, the tiny red-only Orleans-Clery, and the Pays Nantais is in practice a one-grape region."),
    SA("The valley end to end",
       "Before the regional country-wine name was standardised as an IGP, unappellated Loire wine went out under a phrase that called the whole valley a garden. Give that phrase.",
       "Jardin de la France",
       ["jardin de la france", "vin de pays du jardin de la france",
        "garden of france"],
       "Vin de Pays du Jardin de la France covered the entire basin and became IGP Val de Loire when the category was renamed. The phrase is far older than any wine law: orchards, kitchen gardens and chateau parterres earned the valley the name centuries before anyone printed it on a bottle."),
    SA("The valley end to end",
       "White-only Jasnieres occupies a single south-facing bank on the river Loir, entirely surrounded by a wider appellation that also bottles red and rose from Pineau d'Aunis. Name that wider appellation.",
       "Coteaux du Loir",
       ["coteaux du loir", "coteaux du loir aoc", "aoc coteaux du loir",
        "the coteaux du loir appellation"],
       "The Loir, without its final e, is a separate river running well to the north and reaching the Loire only by way of the Sarthe. Jasnieres is an enclave of Chenin inside Coteaux du Loir, which takes all three colours, so the smaller name is the stricter one and it is where a grower's red cannot go.",
       ex=True),
    SA("The valley end to end",
       "Cheverny and the eastern Touraine appellations sit on light, acid sands blown off a wooded, pond-strewn country lying south of the river. Name that country.",
       "The Sologne",
       ["sologne", "sologne country", "the sologne region"],
       "The Sologne is heath, forest and fish ponds rather than farmland, and its sands wash north into the vineyards on the Loire's left bank. Soils there are acid and hungry where the middle Loire's are limestone, which is much of why the wines around Blois are lighter and quicker than those from the tuffeau."),

    # ------------------------- Muscadet, its lees and the crus communaux (5) --
    Q("Muscadet, its lees and the crus communaux",
      "Recognition of village crus reached Muscadet in 2011, and the names approved first all lay at the southern end of Sevre et Maine. Which set was it?",
      ["Clisson, Gorges and Le Pallet",
       "Goulaine, Vallet and Champtoceaux",
       "Monnieres-Saint-Fiacre, Mouzillon-Tillieres and Chateau-Thebaud",
       "Ancenis, Vertou and La Chapelle-Heulin"], 0,
      "All three sit on hard rock rather than on the sands of the plain, and the cru rules demand a minimum of 17 months on the lees at Le Pallet and 24 at Gorges and Clisson, rather than the single winter that sur lie allows. Further villages have been approved since, so the question is which came first and not which exist."),
    Q("Muscadet, its lees and the crus communaux",
      "Vines run down to a wide, shallow lake south-west of Nantes, and the wine off them carries a Muscadet name of its own. Which?",
      ["Muscadet Cotes de Grandlieu", "Muscadet Coteaux de la Loire",
       "Muscadet Sevre et Maine sur lie", "Coteaux d'Ancenis"], 0,
      "Lac de Grand-Lieu is a shallow marshland lake whose area roughly halves between winter and late summer, though even at its lowest it stays one of the largest natural lakes in France, and the vineyard on its shores was given its own name in 1994. The sandy ground there warms quickly and the water moderates the nights, so these are the roundest and earliest-drinking of the Muscadet zones."),
    SA("Muscadet, its lees and the crus communaux",
       "One Muscadet cru sits on a dark, dense rock that holds water and keeps its wines locked shut for years longer than the granite villages manage. The village is Gorges. Name the rock.",
       "Gabbro",
       ["gabbro", "gabbro bedrock", "gabbro rock"],
       "Gabbro is a coarse, dark intrusive rock, the deep-cooled equivalent of basalt, and it weathers into a heavy, cold clay that holds its water. The granite villages drain far harder and open sooner, which is the whole argument for putting a village name on a Muscadet label at all."),
    SA("Muscadet, its lees and the crus communaux",
       "The Armorican basement under the Pays Nantais throws up a pale, banded relation of granite, squeezed and recrystallised at depth until its light and dark minerals separated into stripes. Name it.",
       "Gneiss",
       ["gneiss", "orthogneiss", "gneiss bedrock"],
       "Gneiss weathers to a thin, stony, fast-draining soil with almost no water in reserve, so the vine crops lightly and the wine comes out taut. Muscadet is unusual in France for being described by its bedrock rather than by its topsoil, and the reason is that there is so little topsoil to describe."),
    SA("Muscadet, its lees and the crus communaux",
       "An off-dry white from the vineyards around Ancenis is labelled Malvoisie, a name with no connection to the Malvasia of the Mediterranean. Which grape is in the bottle?",
       "Pinot Gris",
       ["pinot gris", "pinot grigio", "grauburgunder"],
       "Malvoisie is the local name for Pinot Gris on this stretch of the river, and the wine is usually finished with a little sugar left in. The name travels badly, since Malvoisie and Malvasia are used across Europe for a scatter of unrelated varieties, and here it means one specific grape."),

    # ----------------------- Anjou, the Layon and the sweet appellations (5) --
    Q("Anjou, the Layon and the sweet appellations",
      "A Layon label reads Coteaux du Layon Saint-Aubin-de-Luigne rather than Coteaux du Layon alone. What did the grower have to meet before printing the commune?",
      ["A smaller permitted crop and riper fruit at picking",
       "A minimum of three years in bottle before release",
       "Fruit picked entirely by machine in a single pass",
       "A ban on residual sugar above the demi-sec level"], 0,
      "Six communes of the Layon may append their names, and the concession is paid for with a smaller crop and riper fruit than plain Coteaux du Layon asks for. The addition sits above plain Coteaux du Layon and below the named crus of the valley, so it is a rung on a ladder rather than a decoration."),
    Q("Anjou, the Layon and the sweet appellations",
      "Autumn mornings on the Layon are misty and its afternoons dry, while the coast a hundred kilometres west stays wet through October. Which feature of the land accounts for that?",
      ["Hills standing between the valley and the ocean, which dry the westerly air",
       "The width of the Loire, which pushes rain clouds northwards",
       "The valley's elevation, which lifts the vineyards clear of coastal weather",
       "A belt of forest planted along the Layon to shelter the vines"], 0,
      "The Mauges are the eastern shoulder of the old Armorican massif, and air crossing them arrives at the Layon drier than it left the sea. That rain shadow is what turns noble rot from a gamble into a reasonable expectation, because the fungus needs damp nights and dry afternoons in the same week."),
    SA("Anjou, the Layon and the sweet appellations",
       "One site above the Layon holds the only Premier Cru rank in the whole valley, a step below the Loire's single sweet Grand Cru. Name that site.",
       "Chaume",
       ["chaume", "coteaux du layon premier cru chaume", "coteaux du layon chaume",
        "premier cru chaume", "chaume premier cru", "1er cru chaume",
        "coteaux du layon chaume premier cru", "coteaux du layon chaume 1er cru",
        "coteaux du layon 1er cru chaume", "chaume 1er cru", "layon chaume",
        "layon premier cru chaume", "layon 1er cru chaume",
        "chaume coteaux du layon"],
       "Coteaux du Layon Premier Cru Chaume is the full form, and it demands lower yields and riper fruit than a commune-named Layon. The Grand Cru above it takes its name from the same hillside, which is why the shorter name is so often misread as an abbreviation of the longer one.",
       ex=True),
    SA("Anjou, the Layon and the sweet appellations",
       "Chaptalisation is barred outright in the Loire's sweet Grand Cru, and so is the trick of chilling picked fruit until the wateriest berries freeze and stay behind in the press. Name that barred technique.",
       "Cryoextraction",
       ["cryoextraction", "cryo extraction", "cryoextraction selective"],
       "The rules forbid it precisely because it manufactures in the press house what the appellation exists to demonstrate in the vineyard, which is fruit concentrated on the vine by rot or by raisining. Chaptalisation is barred for the same reason from the other end: neither the sugar nor the concentration may be bought indoors."),
    SA("Anjou, the Layon and the sweet appellations",
       "Sweet Chenin grown on the banks of the Loire itself around Angers, rather than up any of its tributaries, has an appellation of its own. Name it.",
       "Anjou Coteaux de la Loire",
       ["anjou coteaux de la loire", "aoc anjou coteaux de la loire",
        "anjou coteaux de la loire aoc",
        "the anjou coteaux de la loire appellation"],
       "The mists here come off the main river rather than off a tributary, and the wines are lighter and less regularly botrytised than a Layon. Anjou's sweet wine is generally thought of as a Layon speciality, and this is the appellation that shows it is not confined to the tributary valleys.",
       ex=True),

    # ---------------------------------------- Savennieres and its crus (3) ----
    Q("Savennieres and its crus",
      "A guest is poured a Savennieres carrying obvious sugar and asks whether the bottle has been mislabelled. What is the correct reply?",
      ["The appellation permits demi-sec and moelleux as well as dry wine",
       "Savennieres must be dry, so the bottle has indeed been mislabelled",
       "Only the cru appellations inside Savennieres may carry sugar",
       "Sugar is permitted only where the label declares a late harvest"], 0,
      "Off-dry Savennieres was once the norm, and the decree still allows demi-sec and moelleux; bone-dry is a modern preference rather than a rule. The slope can do either, because the schist ripens Chenin hard while the river brings the autumn mists, so the decision is made in the vineyard rather than in the rulebook."),
    SA("Savennieres and its crus",
       "Above the Savennieres slope stands a fortified outcrop that monks planted in the twelfth century, and the cru named after it covers far more ground than its neighbour. Name that cru.",
       "Roche aux Moines",
       ["roche aux moines", "savennieres roche aux moines", "roche aux moines cru"],
       "Roche aux Moines takes the monks' rock for its name and keeps Savennieres in front of it on the label, while the smaller cru on the same hillside stands alone as Coulee de Serrant. Both are dry Chenin off schist, and the larger is generally the broader and slower to open."),
    SA("Savennieres and its crus",
       "Chenin from the Savennieres slope that falls short of the appellation's minimum ripeness cannot be sold as a lesser Savennieres. Which broader appellation takes it instead?",
       "Anjou Blanc",
       ["anjou blanc", "anjou", "aoc anjou", "anjou aoc", "anjou blanc aoc",
        "aoc anjou blanc"],
       "Anjou is the regional appellation underneath the whole district, and declassified whites from Savennieres, the Layon and Saumur alike end up there. The name says nothing about the slope the fruit grew on, which is why a serious grower's Anjou Blanc is often among the better-value whites in the valley.",
       ex=True),

    # --------------------------- Saumur, its rock and its appellations (4) ----
    Q("Saumur, its rock and its appellations",
      "A pink wine from Saumur arrives noticeably sweet on the finish and is made from Cabernet Franc. Which appellation covers it?",
      ["Cabernet de Saumur", "Saumur Rose", "Rose de Loire", "Cremant de Loire Rose"], 0,
      "Cabernet de Saumur is the medium-dry pink of the zone, the counterpart to Cabernet d'Anjou a little downstream, and both are built on the Cabernets rather than on Grolleau. A Saumur Rose from the same cellar is finished dry, so a list carrying both names is drawing a sweetness distinction and not a geographical one."),
    Q("Saumur, its rock and its appellations",
      "A grower inside the Saumur-Champigny boundary presses Chenin Blanc from a plot lying among the Cabernet Franc. Under which name must that white be sold?",
      ["Saumur Blanc", "Saumur-Champigny Blanc", "Touraine Blanc", "Vin de France"], 0,
      "Saumur-Champigny is a red appellation and nothing else, so white from inside its boundary falls back on the Saumur name, which covers still white, still red, rose and sparkling alike. The plateau is identical; the rules simply do not recognise a white under the Champigny name."),
    SA("Saumur, its rock and its appellations",
       "A sommelier is asked for a sweet Chenin from Saumur rather than from the Layon. Which appellation should be poured?",
       "Coteaux de Saumur",
       ["coteaux de saumur", "aoc coteaux de saumur",
        "the coteaux de saumur appellation"],
       "Coteaux de Saumur is the tuffeau country's answer to the Layon: moelleux Chenin made in very small quantity, and only in vintages that deliver rot or raisining. Most growers make it when the year allows and sell their dry Chenin under the town's ordinary white name the rest of the time, so it turns up on a list only occasionally."),
    SA("Saumur, its rock and its appellations",
       "Red Cabernet Franc grown on the tuffeau around a hilltop collegiate church south-west of Saumur was given a village appellation of its own in 2009. Name it.",
       "Saumur Puy-Notre-Dame",
       ["saumur puy notre dame", "puy notre dame", "aoc saumur puy notre dame"],
       "Saumur Puy-Notre-Dame stands above the Saumur zone as Anjou-Villages stands above Anjou, with lower yields and later release. Its ground is the same tuffeau plateau that carries Saumur-Champigny, a good deal further back from the river."),

    # ---------------- Vouvray, Montlouis and the Touraine appellations (4) ----
    Q("Vouvray, Montlouis and the Touraine appellations",
      "Chenin Blanc must fill a Montlouis-sur-Loire completely, while the appellation facing it across the river may take a few percent of one other old Touraine white. Which grape?",
      ["Orbois", "Romorantin", "Sauvignon Blanc", "Folle Blanche"], 0,
      "Vouvray admits a small share of Orbois, known locally as Menu Pineau, and Montlouis admits nothing but Chenin. Orbois is a neutral, low-acid old variety surviving mostly in Touraine blends, and the allowance is a relic of the mixed plantings the appellation was drawn around."),
    Q("Vouvray, Montlouis and the Touraine appellations",
      "Growers on the plateau above Vouvray name their two soils: one is clay over limestone that holds water and slows the vine, the other a flinty clay that warms early. Which naming is correct?",
      ["Aubuis is the clay-limestone and perruches the flinty clay",
       "Perruches is the clay-limestone and aubuis the flinty clay",
       "Aubuis is the clay-limestone and varennes the flinty clay",
       "Silex is the clay-limestone and perruches the flinty clay"], 0,
      "Aubuis holds its water and keeps Chenin ripening slowly, which is why parcels destined for sweet wine tend to sit on it, while perruches drains and warms fast and suits the earlier styles. Both words belong to Touraine and appear in growers' conversation far more often than on labels."),
    SA("Vouvray, Montlouis and the Touraine appellations",
       "A Montlouis sparkling is bottled before its first fermentation has finished, so there is no second fermentation, no disgorging and no dosage. Which label term does the appellation give it?",
       "Petillant Originel",
       ["petillant originel", "montlouis petillant originel",
        "petillant originel montlouis"],
       "Petillant Originel is Montlouis' own designation for the ancestral method, and the wine keeps both its sediment and its low pressure. It sits outside the Cremant de Loire framework altogether, since a Cremant demands hand-picked whole bunches and a second fermentation in bottle, so the two are different wines under different rulebooks rather than two grades of one thing."),
    SA("Vouvray, Montlouis and the Touraine appellations",
       "A carafe of Touraine red is poured that is light, purple and juicy, and it holds no Cabernet Franc at all. Which grape fills the district's everyday red?",
       "Gamay",
       ["gamay", "gamay noir", "gamay noir a jus blanc"],
       "The district appellation leans on Gamay for red and on Sauvignon Blanc for white, which is why a wine labelled simply Touraine tastes nothing like Chinon or Vouvray. Cot appears in the reds as well, and the Gamay is usually the fresher and the cheaper of the two."),

    # -------------------------------- Cabernet Franc and the Touraine reds (5)
    Q("Cabernet Franc and the Touraine reds",
      "August turns dry in Touraine. Vines rooted in porous limestone carry on ripening while those on the river gravels shut down. What is the limestone doing for them?",
      ["Releasing water it has held in its pores back towards the roots",
       "Reflecting heat off its pale surface onto the bunches",
       "Raising the soil pH so that the roots take up more nitrogen",
       "Draining harder, so the roots must go deeper for water"], 0,
      "Tuffeau is a chalky sandstone riddled with pore space and it behaves as a reservoir, taking water in over winter and giving it back slowly through the summer. Gravel holds almost none, so a terrace vine lives on whatever rain the season happens to bring."),
    Q("Cabernet Franc and the Touraine reds",
      "South of Tours a very pale pink wine is made from a blend of Pinot Meunier, Pinot Gris and Pinot Noir. Which appellation is it?",
      ["Touraine Noble-Joue", "Touraine-Azay-le-Rideau", "Rose de Loire", "Reuilly"], 0,
      "Touraine Noble-Joue is a vin gris revived from vineyards that the suburbs of Tours had very nearly swallowed. The fruit is pressed straight off the skins so the colour barely arrives at all, and nothing else in the valley is built from that combination of grapes."),
    SA("Cabernet Franc and the Touraine reds",
       "Cabernet Franc fills the reds of Bourgueil, Saint-Nicolas-de-Bourgueil and Chinon, yet the rules let a grower add a small stated share of one other black variety. Name it.",
       "Cabernet Sauvignon",
       ["cabernet sauvignon", "a little cabernet sauvignon",
        "cabernet sauvignon in a small proportion"],
       "The allowance is small and most growers use none of it, because Cabernet Sauvignon ripens later than Cabernet Franc and this is close to its northern limit. Where the three appellations really part company is colour: only Chinon may bottle a white."),
    SA("Cabernet Franc and the Touraine reds",
       "At the eastern edge of Touraine an appellation covers red, white and rose alike, and shares its name with a pyramid-shaped goat cheese. Name it.",
       "Valencay",
       ["valencay", "valencay aoc", "aoc valencay"],
       "Valencay bottles Sauvignon Blanc whites and reds blended from Gamay, Cot and Pinot Noir, and wine and cheese carry the same appellation name from the same ground. The cheese's flat top has a legend attached to Napoleon's Egyptian campaign, which the cheesemakers repeat and the historians do not."),
    SA("Cabernet Franc and the Touraine reds",
       "A cuvee from vines in the commune of Saint-Nicolas-de-Bourgueil is judged too slight to carry its own village name. Which appellation of the same ground can take it instead?",
       "Bourgueil",
       ["bourgueil", "aoc bourgueil", "bourgueil aoc", "aop bourgueil",
        "bourgueil aop", "bourgueil ac", "the bourgueil appellation",
        "bourgueil rouge", "red bourgueil"],
       "Saint-Nicolas-de-Bourgueil is one of the communes inside the wider Bourgueil delimitation as well as an appellation in its own right, so the traffic runs one way only. A Saint-Nicolas grower may declassify into Bourgueil; a Bourgueil grower has no claim whatever on the village name.",
       ex=True),

    # ------------------- Sancerre, Pouilly and the soils of the Centre (4) ----
    Q("Sancerre, Pouilly and the soils of the Centre",
      "Sancerre and Pouilly-Fume look at one another across the Loire. Which sits on which bank?",
      ["Sancerre on the left bank, Pouilly-Fume on the right",
       "Sancerre on the right bank, Pouilly-Fume on the left",
       "Both lie on the left bank, with Pouilly-Fume the further north",
       "Both lie on the right bank, with Sancerre the further south"], 0,
      "The river runs roughly northwards here, so the left bank is the western side and the hill of Sancerre stands over it, while Pouilly lies across the water on the eastern side. The two appellations touch at no point at all, because the river itself is the boundary between them."),
    Q("Sancerre, Pouilly and the soils of the Centre",
      "A guest asks for a red Pouilly-Fume to set beside a red Sancerre. Why can the sommelier not oblige?",
      ["Pouilly-Fume is white only, while Sancerre covers all three colours",
       "Pouilly-Fume's red is made in exceptional vintages and is rarely exported",
       "Pouilly-Fume's red has to be sold under the Pouilly-sur-Loire name",
       "Pouilly-Fume's red is Gamay and is bottled only for the local trade"], 0,
      "Pouilly-Fume is Sauvignon Blanc and nothing else, and no red or rose exists under the name. Sancerre by contrast takes white from Sauvignon and red and rose from Pinot Noir, which is the sharpest rulebook difference between two appellations facing each other across the water."),
    SA("Sancerre, Pouilly and the soils of the Centre",
       "Above the hamlet of Chavignol one slope is steep enough that the pickers work it on foot, and its name says the labour damns those who do it. Name the slope.",
       "Les Monts Damnes",
       ["les monts damnes", "monts damnes", "monts damnes de chavignol"],
       "Les Monts Damnes rises off the heavy Kimmeridgian marl at a gradient no tractor will hold, and the wines are among the broadest and slowest in Sancerre. The appellation ranks no vineyard officially, so a famous name there is reputation rather than classification, and saying so at the table is worth doing."),
    SA("Sancerre, Pouilly and the soils of the Centre",
       "Around Bue the Sancerre vineyard works shallow, stony ground full of small hard limestone pebbles, and the wine off it is aromatic and quick to show. Give the local name for that soil.",
       "Caillottes",
       ["caillottes", "caillotte", "les caillottes"],
       "Caillottes are the stony Portlandian limestone soils of the central hills, shallow and warm, and they ripen fruit fast and give wine that drinks early. The heavier clay-limestone west of them and the flint east of them both give slower, longer-lived wine, which is how one appellation comes to taste so unalike from grower to grower."),

    # ---------------------------------------- The Centre beyond Sancerre (3) --
    Q("The Centre beyond Sancerre",
      "On the southern edge of the Centre, an appellation raised from VDQS in 2010 is known above all for a very pale vin gris made from Gamay. Which?",
      ["Chateaumeillant", "Menetou-Salon", "Pouilly-sur-Loire", "Orleans-Clery"], 0,
      "Chateaumeillant sits south-west of Bourges towards the edge of the Massif Central, and its speciality is a vin gris pressed off Gamay skins almost immediately. A vin gris is not a rose bled from a red vat: it is pressed like a white from black grapes, and this is the Loire appellation that made its name on the style."),
    SA("The Centre beyond Sancerre",
       "Between Sancerre and the town of Gien the vineyard runs along either side of the Loire, making whites from Sauvignon Blanc and reds from Gamay with Pinot Noir. Name the appellation.",
       "Coteaux du Giennois",
       ["coteaux du giennois", "giennois", "aoc coteaux du giennois"],
       "Coteaux du Giennois reaches north from the Sancerre boundary to Gien and works the same Sauvignon Blanc on far less celebrated ground. Its reds and roses must blend the two black grapes rather than use either on its own, which is a requirement no other appellation of the Centre imposes. So a grower here who wants a straight varietal red has to sell it outside the appellation altogether, and the rule shapes what leaves the cellar rather than merely describing what is planted."),
    SA("The Centre beyond Sancerre",
       "West of Bourges, away from the Loire altogether, a pair of Centre appellations works sand and gravel terraces on the Cher and its tributary the Arnon. Name them.",
       "Quincy and Reuilly",
       ["quincy and reuilly", "reuilly and quincy", "quincy reuilly",
        "reuilly quincy", "quincy aoc and reuilly aoc",
        "reuilly aoc and quincy aoc"],
       "Quincy is white only, from Sauvignon Blanc on wind-blown sand over gravel, and Reuilly adds red and rose to the same picture a little further west on the Arnon. Both sit well away from Sancerre on quite different ground, and their wines are rounder and quicker to open for it."),
]
