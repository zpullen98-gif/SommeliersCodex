"""Rank II rewrite - Portugal (29 questions: 12 MC, 17 short answer).

Certified level, and confined to UNFORTIFIED Portugal. The committed Fortified
Wines category owns Port and Madeira outright - the beneficio as a fortification
licence, the lodges, the ladder, Terrantez - so the beneficio appears here only
as the economic shadow it throws over Douro table wine. Rank I's Portugal owns
the Introductory layer: the cooperative history of the Dao, the sand and cane
screens of Colares, the walled currais of Pico, cork. Nothing here repeats a
task from either, and nothing here NAMES the answers they own. Currais and
Terrantez are absent from the shipped text altogether, and Verdelho appears
once, on Madeira, never as a grape of the Azores: an explanation that supplies
another question's answer with its defining clue hands that question over, and
the Azorean-Verdelho-on-Madeira link is another question's whole task.

The running order walks the country north to south and then out to sea: the
Minho's subregions and training, the Douro's dry wines and the licence that
shaped their economics, the Dao and Bairrada with the 2003 rules fight, the
Alentejo and the clay of the talha, the two survivors near Lisbon, the islands'
unfortified revival, and finally the institutions whose seals sit on every one
of those bottles.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and were
tested by execution rather than by eye: every displayed answer, several natural
phrasings of it and every named wrong answer were run through the grader. Two
lists carry '~' entries, Sousao and Rabigato; the paragraphs below say why, and
every one of those entries is two words or longer.

EIGHT answers carry ex=True, which switches every containment path off and takes
only the phrasings listed. Nine and Eight, because a count reads the same in
both directions under containment; Berry, for the same reason in words; Acores,
which the real and different Arinto dos Acores extends; Espadeiro and IVV, whose
lists are many spellings of one term; and Sousao and Rabigato, which containment
graded wrong. Those last two are the instructive pair. 'Sousa' is five letters
inside 'sousao' and is also a Vinho Verde subregion this module names twice, so
containment marked the Minho subregion right on a Douro grape question; and
containment takes any modifier appended to an answer, so 'Rabigato Franco', a
separately registered Douro white, graded as Rabigato. Nothing in build.py sees
either: loose_tilde_problems only inspects '~' entries.

ex=True on its own was too blunt for that pair. Switching containment off also
switches off every phrasing nobody happened to list, and an A/B against the
pre-fix lists showed the bill: 'sousao / souzao', 'black grape sousao', 'it is
sousao', 'rabigato white variety', 'white rabigato' and 'rabigato, the cat's
tail' were all being marked WRONG although each graded right before. A student
who knows the grape and is told they do not is the worst thing an accept list
can do, worse than the false accept the switch was closing. The repair is the
one branch ex never reaches: matchSA tests '~' entries FIRST and continues past
the ex check, so a tilde keeps whole-phrase containment even under ex=True.
Both lists therefore pair ex=True with two-word tilde phrases - '~sousao grape',
'~grape sousao', '~is sousao', '~rabigato white', '~rabigato cats tail' - which
reopen the modifier, spelling-pair and verb frames while still rejecting 'sousa'
and 'Rabigato Franco', neither of which contains any of those phrases. Two words
is the floor: a one-word tilde matches that word anywhere in a wrong answer,
which is the trap lib.loose_tilde_problems exists to catch.

One residual is disclosed rather than dressed up. '~is rabigato' takes the verb
frames a knowing student writes, and whole-phrase containment cannot say "and
nothing after it", so "it is rabigato franco" passes too. Bare 'rabigato franco',
which is how anyone naming that grape writes it, still fails, as do 'rabigato
franco grape', 'white rabigato franco' and 'rabigato moleto'. That is the trade
taken deliberately: rejecting a student who knows the grape costs more than
crediting a rare phrasing of one who does not. 'white rabigato' is listed exact
rather than as a tilde for the same reason in reverse, since '~white rabigato'
would have taken "white rabigato franco" as well.

The lists still on containment were probed against the wrong answers nearest
them - Cima Corgo against Baixo Corgo, Esgana Cao against Sercial, herdade
against monte, enforcado against uveira, pergola and cruzeta - and none of those
grades. The CVR list is Portuguese only on purpose: the stem asks for the words
behind a Portuguese initialism, and an English gloss built out of 'regional' and
'commission' demonstrates nothing when a neighbouring stem uses both words.

Facts are restricted to ones that do not drift: subregion rosters, soil
delimitations, vessel rules, name equivalences and who certifies what. The dates
are all history rather than current regulation and cannot move: the Dao
demarcated in 1908, Bairrada espumante from the 1890s, the Vinho Verde
commission of 1926, the Adega Regional de Colares founded in 1931 and
liberalised in the 1990s, Bairrada's 2003 revision.
"""

from lib import Q, SA

CAT = "Portugal"
SLUG = "r2-portugal"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("Vinho Verde and the Minho", 5),
    ("The Douro unfortified", 5),
    ("Dao and Bairrada", 5),
    ("Alentejo and the talha", 4),
    ("Bucelas and Colares", 3),
    ("The islands unfortified", 4),
    ("Who certifies what", 3),
]

BANK = [
    # ---------------------------------------- Vinho Verde and the Minho (5) --
    Q("Vinho Verde and the Minho",
      "Beside plain Vinho Verde, an importer's book lists a Vinho Verde Sousa and a Vinho Verde Moncao e Melgaco. What has each of those producers taken on?",
      ["Fruit drawn entirely from the named subregion, and from the varieties it recommends",
       "A vintage declaration, which plain Vinho Verde is not permitted to carry",
       "Estate bottling, since subregion names are closed to merchant blends",
       "A minimum year in bottle before release, to justify the longer name"], 0,
      "A subregion on the label ties the wine to that ground alone and to the grapes the rules recommend for it, which is the region's own map of quality: Alvarinho around Moncao e Melgaco, Loureiro along the Lima, Avesso inland at Baiao. Plain Vinho Verde may carry a vintage perfectly freely, and merchants blend subregional wine like anyone else."),
    Q("Vinho Verde and the Minho",
      "Thirteen percent of alcohol in a Moncao e Melgaco Alvarinho startles a guest who knows Vinho Verde as a feather-light spritz. What makes the wine legal?",
      ["Varietal Alvarinho is given its own higher alcohol band than ordinary Vinho Verde",
       "Nothing does; above eleven and a half percent the wine has to leave the DOC and sell as Minho regional",
       "The producer declassified it to espumante, where strength is uncapped",
       "A dispensation bought vintage by vintage from the regional commission"], 0,
      "Ordinary Vinho Verde is capped at eleven and a half percent, where its light style lives, while varietal Alvarinho may climb to fourteen. Moncao e Melgaco sits in the warm, dry lee of the mountains along the Spanish border, and the ripeness Alvarinho finds there is the whole reason the exception exists."),
    SA("Vinho Verde and the Minho",
       "From Moncao e Melgaco in the north down to Baiao on the Douro's doorstep, subregions partition the whole of Vinho Verde. Give the count.",
       "Nine",
       ["nine", "9", "nine subregions", "9 subregions", "nine sub regions",
        "9 sub regions", "nine in total", "9 in total", "nine in all", "9 in all",
        "there are nine", "there are 9", "nine of them", "9 of them",
        "there are nine subregions", "there are 9 subregions",
        "there are nine sub regions", "there are 9 sub regions",
        "nine subregions in total", "9 subregions in total",
        "nine sub regions in total", "9 sub regions in total"],
       "Amarante, Ave, Baiao, Basto, Cavado, Lima, Moncao e Melgaco, Paiva and Sousa make the nine, each following a river or a market town. Only a few of them mean anything on an export label, which is exactly why the ones that do are worth knowing.",
       ex=True),
    SA("Vinho Verde and the Minho",
       "Old Minho photographs show vines scrambling ten metres up poplars and chestnuts at the field edges. Give the local name for that training.",
       "Vinha de enforcado",
       ["vinha de enforcado", "vinhas de enforcado", "enforcado"],
       "The enforcado, the hanged vine, climbed a living tree called an uveira: the uveira is the tree itself, the enforcado the vine trained up it, and only enforcado names a way of training. Hanging the fruit ten metres up kept it above the damp air at ground level and left the soil below free for cabbages and maize. Pergolas did the same job along the lanes, and modern cordon rows have replaced both wherever the holding is large enough to bother."),
    SA("Vinho Verde and the Minho",
       "Pale rose now leaves the Vinho Verde region in serious quantity, most of it from one generously cropping black grape kept largely for the purpose. Name it.",
       "Espadeiro",
       ["espadeiro", "espadeiro grape", "espadeiro grape variety",
        "espadeiro variety", "espadeiro rose", "espadeiro rosado",
        "espadeiro rose grape", "espadeiro rosado grape",
        "espadeiro black grape", "black grape espadeiro"],
       "Espadeiro crops heavily and colours lightly, which is precisely what a pale, sharp, faintly prickling rose asks of a grape. Padeiro plays the same role around Basto, and neither makes red of any consequence.",
       ex=True),

    # -------------------------------------------- The Douro unfortified (5) --
    Q("The Douro unfortified",
      "One Douro parcel, one grape, two prices: the lot sold for Port fetches several times what the lot sold for dry red does. What is being paid for?",
      ["The fortification licence attached to the fruit, the beneficio, rather than the fruit itself",
       "Higher must weights, since Port fruit hangs later and comes in sweeter",
       "The cost of the fortifying spirit, which the grower is expected to supply with the grapes",
       "Hand harvesting, which the Port houses demand and the table-wine cellars do not"], 0,
      "The beneficio rations fortification rights across the valley by each parcel's graded score, and the licence, not the grape, carries the premium. For most of a century table wine was simply what the licence left behind, which is the shadow the valley's dry reds grew up under; the best estates now route old-vine fruit to them by choice rather than by default."),
    Q("The Douro unfortified",
      "Persuaded by a hillside parcel of Syrah, a Douro estate bottles it varietally and finds the DOC closed to it. Under which designation does the wine sell?",
      ["Vinho Regional Duriense", "Vinho Regional Transmontano",
       "Vinho Regional Minho", "DOC Tras-os-Montes"], 0,
      "The Douro DOC admits an approved list of overwhelmingly native varieties, so anything outside it drops to the regional tier, and Duriense covers the same ground with looser rules. Transmontano and Tras-os-Montes belong to the high country north of the valley, a separate region altogether."),
    SA("The Douro unfortified",
       "Deep in colour and stubborn about keeping its acid through a Douro heatwave, one dark-fleshed grape is the blender's tool for freshness; the Minho grows the same vine as Vinhao. Give the Douro's name for it.",
       "Sousao",
       # ex=True is forced: 'sousao' contains 'sousa', so the reverse-containment
       # branch grades the Minho subregion on any list holding the bare answer.
       # The '~' entries run before the ex check and give the open phrasings back.
       ["sousao", "souzao", "sousaos", "souzaos",
        "sousao or souzao", "souzao or sousao",
        "sousao and souzao", "souzao and sousao",
        "sousao also souzao", "sousao also spelled souzao",
        "sousao also spelt souzao",
        "~sousao souzao", "~souzao sousao",
        "~sousao grape", "~souzao grape", "~grape sousao", "~grape souzao",
        "~sousao variety", "~souzao variety",
        "~sousao black", "~souzao black", "~sousao red", "~souzao red",
        "~sousao dark",
        "~is sousao", "~sousao is", "~is souzao", "~souzao is",
        "~sousao called", "~sousao known",
        "~sousao douro", "~douro sousao", "~sousao in the douro"],
       "Sousao carries pigment in its pulp as well as its skin and holds malic acid that the valley's heat strips from everything else, so a modest share of it steadies a blend. One vine, two careers: bracing young red in the wet north, seasoning grape in the hot east. Sousa, one letter short of it, is a Minho subregion and nothing to do with the grape.",
       ex=True),
    SA("The Douro unfortified",
       "Its long, loose bunch reminded someone of a cat's tail, and the name stuck to a white grape now prized for the Douro's high-altitude whites. Name it.",
       "Rabigato",
       # ex=True keeps Rabigato Franco and Rabigato Moleto, separately registered
       # Douro whites, from grading as Rabigato; the '~' entries keep every
       # phrasing that merely dresses the answer up.
       ["rabigato", "rabigatos",
        "~rabigato grape", "~grape rabigato", "~rabigato variety",
        "~rabigato white", "white rabigato",
        "~rabigato cats tail", "~rabigato cat's tail",
        "~is rabigato", "~rabigato is",
        "~douro rabigato", "~rabigato in the douro"],
       "Rabigato, the cat's tail, brings acid and a stony austerity to parcels planted five and six hundred metres up, usually alongside Viosinho and Gouveio. It is not to be confused with Rabo de Ovelha, the ewe's tail, nor with Rabigato Franco, which adds a word to the name and is a separate Douro white again.",
       ex=True),
    SA("The Douro unfortified",
       "Pinhao sits where its own tributary meets the river, ringed by the densest concentration of top-graded quintas in the valley. Which Douro sub-region is this?",
       "Cima Corgo",
       ["cima corgo", "cima corgo subregion", "cima corgo sub region"],
       "The Cima Corgo is the historic heart of the valley, and the amphitheatres around Pinhao hold more A-graded vineyard than anywhere else on the river. The same slopes that command the best fortification licences now yield many of the most serious dry reds, which is the valley's economics in one view."),

    # ------------------------------------------------- Dao and Bairrada (5) --
    Q("Dao and Bairrada",
      "A 2003 rewrite of Bairrada's DOC rules still divides the region's growers. What did it do?",
      ["Opened the DOC's reds to outside varieties, Cabernet Sauvignon and Syrah among them",
       "Made Baga compulsory at eighty-five percent of every red carrying the name, squeezing the rest out",
       "Stripped sparkling wine out of the DOC and handed it a separate denomination",
       "Closed the DOC to purchased fruit, ending the merchant trade overnight"], 0,
      "Before 2003 a Bairrada red meant Baga above all; the revision admitted Touriga Nacional, Cabernet Sauvignon, Merlot and Syrah, and traditionalists read it as the region trading its identity for easy ripeness. The dissenters' answer was Baga Friends, a growers' alliance pledged to the old grape, and some celebrated estates still prefer the Beira Atlantico regional label to the widened DOC."),
    Q("Dao and Bairrada",
      "Trace Touriga Nacional's paper trail back far enough and it runs home to one region, where old growers still call it Tourigo. Which region?",
      ["The Dao", "The Douro", "The Alentejo", "Bairrada"], 0,
      "The grape's oldest documented home is the Dao's granite, where Tourigo and Mortagua survive as its local names, and the Douro adopted it from there. Miserly yields nearly finished it before selection work rebuilt the plantings, and the Dao's red blends still lean on it first."),
    SA("Dao and Bairrada",
       "Stricter sourcing and longer ageing than the plain DOC demands let a Dao label add one word, the Portuguese for noble. Give the word.",
       "Nobre",
       ["nobre", "dao nobre"],
       "Nobre sits above the ordinary appellation and its Reserva, asking for the region's recommended grapes and more time before release, and it is claimed rarely enough that many drinkers have never met one. The Dao was demarcated in 1908, among Portugal's first, and Encruzado whites and Touriga-led reds are the word's natural candidates."),
    SA("Dao and Bairrada",
       "Small, thick-skinned and mean-yielding, Bairrada's defining grape bears a name that is simply the Portuguese for the thing itself. Translate baga.",
       "Berry",
       ["berry", "berries", "grape berry", "small berry", "it means berry",
        "means berry", "single berry", "baga means berry", "baga is berry"],
       "Baga means berry, and the bunches are packed with small, thick-skinned ones, which is where the colour, the fierce tannin and the rot worry on wet clay all begin. The grape covers most of Bairrada's red vineyard and shoulders much of its espumante base besides.",
       ex=True),
    SA("Dao and Bairrada",
       "Dao growers saddled one white grape with the name Borrado das Moscas, fly droppings, for its speckled skins; Bairrada treats the same grape as the backbone of its whites. Give its Bairrada name.",
       "Bical",
       ["bical", "bical grape"],
       "Bical ripens early, holds its acid on the cold clay, and anchors both the still whites and the traditional-method espumante Bairrada has made since the 1890s. Maria Gomes, its usual partner there, supplies the perfume Bical keeps to itself."),

    # ------------------------------------------- Alentejo and the talha (4) --
    Q("Alentejo and the talha",
      "Clay touches a great deal of Alentejo wine; the Vinho de Talha DOC asks for much more than a finishing spell in it. Where does the rule draw the line?",
      ["Fermentation itself must happen in the clay, skins and all, in the old Roman manner",
       "The vessels must predate phylloxera, and wine from new-made clay is disqualified",
       "Only fruit grown in the Vidigueira subregion may claim it, wherever the cellar stands",
       "The wine must rest in the clay a full five years, twice what a Reserva serves, before bottling"], 0,
      "The designation protects a method rather than a flavour of ageing: the grapes ferment in the talha with their skins, the cap sinking back as the ferment dies, and the wine rests there under a film of olive oil until Saint Martin's Day in November, when tradition taps the first vessel. Amphora wine made any other way sells as plain Alentejo, however much clay it saw."),
    Q("Alentejo and the talha",
      "Weeks before vintage an Alentejo cellar warms its empty talhas and melts a dark paste across their insides. What is the paste doing?",
      ["Sealing the porous clay with pez, a blend of pine resin and beeswax",
       "Baking cooked must onto the walls, which darkens the wine and rounds its finish",
       "Laying down a lime wash to disinfect the clay after last year's lees are scrubbed out",
       "Building up a wax skin that will be peeled away together with the finished wine"], 0,
      "Pez, resin and beeswax in proportions each house keeps to itself, is all that stands between the wine and the open pores of fired clay; the coating is renewed because a failed seal turns a talha into a slow drain. Tasters credit the resin with a quiet part of the style as well, the way the pine speaks in some old Mediterranean wines."),
    SA("Alentejo and the talha",
       "Borba, Redondo, Reguengos and Vidigueira head the roll of the Alentejo DOC's subregions. Give the full count.",
       "Eight",
       ["eight", "8", "eight subregions", "8 subregions", "eight sub regions",
        "8 sub regions", "eight in total", "8 in total", "eight in all", "8 in all",
        "there are eight", "there are 8", "eight of them", "8 of them",
        "there are eight subregions", "there are 8 subregions",
        "there are eight sub regions", "there are 8 sub regions",
        "eight subregions in total", "8 subregions in total",
        "eight sub regions in total", "8 sub regions in total"],
       "Portalegre, Evora, Granja-Amareleja and Moura complete the eight, every one a delimited DOC subregion inside the wider Alentejo. The spread is greater than one name suggests, from mountain vineyards in the north to some of the hottest ground in Portugal at Granja-Amareleja.",
       ex=True),
    SA("Alentejo and the talha",
       "Great southern landholdings put a word on Alentejo labels where a northern label would say quinta. Give the word.",
       "Herdade",
       ["herdade", "herdades"],
       "A herdade is the Alentejo's vast agricultural holding, wine one crop among cork, olives and grazing, and the scale is the point: hundreds of hectares where a Douro quinta might count dozens. Monte, which also appears on labels, is strictly the farmhouse standing on the property rather than the property itself."),

    # ---------------------------------------------- Bucelas and Colares (3) --
    Q("Bucelas and Colares",
      "Neighbours a few hundred metres apart near Sintra grow the same grapes, yet one label reads Colares and the other must say Lisboa. What separates the two?",
      ["Only vines rooted in the deep dune sand, the chao de areia, may claim the DOC",
       "The DOC requires trench planting by hand, and one grower cut corners with a machine auger",
       "One vineyard stands grafted, and Colares admits only ungrafted stock",
       "One parcel falls inside protected Sintra parkland that the appellation excludes"], 0,
      "Colares is delimited by its soil: the DOC belongs to the wind-blown sand that defeated phylloxera, while the firm clay ground behind it, the chao rijo, grows the same Ramisco and Malvasia de Colares for the regional label. The sand is the appellation, and everything else about the place follows from it."),
    SA("Bucelas and Colares",
       "Sharp enough that its name means dog-strangler, the traditional second grape of white Bucelas is the same variety Madeira grows as Sercial. Give the mainland name.",
       "Esgana Cao",
       ["esgana cao", "esgana"],
       "Esgana Cao keeps its acid in real heat, which earned it both the name and its place beside Arinto, the grape that must itself supply at least seventy-five percent of any white Bucelas. Rabo de Ovelha is the other traditional supporting variety in this small, white-only appellation."),
    SA("Bucelas and Colares",
       "Between 1931 and the 1990s no grower could sell Colares at all without passing the wine through a single institution's cellars. Name it.",
       "Adega Regional de Colares",
       ["adega regional de colares", "adega de colares", "colares regional adega",
        "regional adega of colares", "adega regional of colares"],
       "The Adega Regional de Colares was founded in 1931 and held a legal monopoly on vinifying the appellation for six decades, which is why old Colares carries one cellar's stamp whoever grew the fruit. Liberalisation in the 1990s let independent producers emerge, and the Adega still makes and ages much of what little Colares exists."),

    # ------------------------------------------ The islands unfortified (4) --
    Q("The islands unfortified",
      "Sharing a name across a thousand miles of ocean, the Arinto of Bucelas and the Arinto dos Acores of Pico invite an assumption. What is the truth of it?",
      ["They are unrelated; the island grape merely wears a mainland name",
       "They are a single variety, its acid sharpened by the volcanic ground",
       "The island vine descends from cuttings the first settlers carried out",
       "The mainland grape is a parent, crossed on the island with a native vine"], 0,
      "Ampelography separates them cleanly: Arinto dos Acores is a variety of its own that happens to wear a borrowed name, and its salty, smoky whites taste nothing like Bucelas. A shared name settles nothing about parentage in Portugal, where growers named vines for what they looked like and the same word turns up two provinces away on something else entirely."),
    Q("The islands unfortified",
      "Grown above Funchal and fermented dry, a still red of Tinta Negra cannot call itself Madeira. What may the label say?",
      ["Madeirense under the island's own DOC, with Terras Madeirenses covering the regional tier",
       "Madeira Seco, the term the rules reserve for the island's unfortified wine",
       "Vinho Regional Atlantico, a designation shared with the Azores",
       "Nothing at all; the island's table wine may only be sold to visitors on the spot"], 0,
      "The bare name Madeira belongs to the fortified wine, so the island's growing table-wine trade ships as DOC Madeirense or as Terras Madeirenses regional wine. Dry Tinta Negra reds and Verdelho whites lead it, much of the fruit coming off the cooler north coast."),
    SA("The islands unfortified",
       "Azorean wine grown outside the demarcated islands' appellations sells under a regional designation covering the whole archipelago. Give it.",
       "Acores",
       ["acores", "azores", "vinho regional acores", "vinho regional azores",
        "regional acores", "regional azores", "igp acores", "igp azores",
        "vr acores", "vr azores"],
       "The Acores regional designation catches everything the island appellations do not, and a good deal of the modern revival ships under it by choice, varietal labelling being freer there. The volcanic rock and the salt wind mark the wines whichever name they carry.",
       ex=True),
    SA("The islands unfortified",
       "Pico has its DOC and Terceira has Biscoitos; one more Azorean island carries a wine appellation of its own. Name it.",
       "Graciosa",
       ["graciosa", "ilha graciosa", "graciosa island", "graciosa doc"],
       "Graciosa, gentler and lower than its neighbours, is the third demarcated wine island, its light dry white drawn from an old field mix rather than from any single variety. Biscoitos is a parish on Terceira's north coast rather than an island of its own, which is the trap: three islands hold an appellation, and Graciosa is the one that gets forgotten."),

    # ----------------------------------------------- Who certifies what (3) --
    Q("Who certifies what",
      "Almost every Portuguese wine region answers to a grower-funded regional commission, but two answer to standing public institutes instead. Which two?",
      ["The Douro and Madeira", "Vinho Verde and the Dao",
       "Alentejo and Setubal", "Bairrada and the Azores"], 0,
      "The Douro's institute certifies the valley's unfortified DOC wine as well as Port, one body for both trades, and Madeira keeps a public institute of its own. Everywhere else the tasting panels and the numbered seal on the back label belong to the region's own commission."),
    SA("Who certifies what",
       "Planting rights, the national record of who grows what, and the whole sector's oversight sit with one Lisbon institute above all the regional bodies. Give its initials.",
       "IVV",
       ["ivv", "i v v", "instituto da vinha e do vinho",
        "instituto da vinha e vinho"],
       "The Instituto da Vinha e do Vinho is the national umbrella: it holds the records of what is planted where, manages planting authorisations and answers for Portugal in Brussels, while day-to-day certification is delegated regionally. Nothing about an individual bottle passes through it, which is exactly the division of labour the system intends.",
       ex=True),
    SA("Who certifies what",
       "Three letters, CVR, open the name of most of Portugal's certifying bodies for wine, the ones answering for Lisboa and the Tejo among them. Write the Portuguese out in full.",
       "Comissao Vitivinicola Regional",
       ["comissao vitivinicola regional", "comissoes vitivinicolas regionais"],
       "Each Comissao Vitivinicola Regional is funded by its growers and trade, runs the tasting panels, and polices both the DOC and the regional wine of its area, issuing the numbered guarantee seals. Two of them wear older names: the Vinho Verde body, founded in 1926 and the model the rest were built on, is still the Comissao de Viticultura da Regiao dos Vinhos Verdes, and the Algarve's certifier is the Comissao Vitivinicola do Algarve, with no Regional in it at all."),
]
