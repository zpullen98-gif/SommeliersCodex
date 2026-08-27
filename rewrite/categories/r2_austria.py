"""Rank II rewrite - Austria (26 questions: 13 MC, 13 short answer).

Certified level, pitched deliberately above the Rank I Austria category. Rank I
owns the concepts and the names: what DAC abbreviates, the four-tier law
pyramid, the Wachau ladder's three words, what the banderole certifies, the
Sekt Austria tiers. This category asks what the law has built around them:
which region proved the DAC idea and which one finished the roster, what the
two DAC ladder models actually measure, what the Wachau ordinance changed and
what it pointedly left private, how the 2023 collective decree turned Erste
Lage and Grosse Lage from a growers' badge into statute, and what Ried, the
banderole and Vienna's vineyard register each certify. Nothing here repeats a
Rank I task, and Ausbruch appears only as the DAC that fenced a name to one
town - its Pradikat rung belongs to Dessert & Sweet Wines, and everything
Hungarian to Hungary & Greece.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and
were tested by execution rather than by eye. The '~' entries sit on the Wachau
harvest question and on the Traditionsweingueter question. Two are negative
phrasings, where plain entries would let their positive truncations grade. The
rest are positive carriers that let a modal or a manual construction grade at
all, and they are tilde'd because matchSA also accepts an input that is a RAW
substring of an accept entry: as a plain entry, "hand only" grades the fragment
"and only". The '~' branch is whole-word or exact and has no substring branch
at all, which is exactly what those carriers need. None of them is a single
word, the case lib.loose_tilde_problems exists to block.

One claim that stood here was wrong and is corrected rather than deleted, since
it reads as a reason to tilde things that do not need it: tilde'ing did NOT
stop the fragment "y hand" grading. That fragment rides on the plain entries
"harvest by hand", "picked by hand" and three more of the same shape, through
the reverse-substring branch, and it graded before the carriers were tilde'd
and still grades now. It is a truncation of a correct answer rather than a
wrong answer, so it is left alone; what the tildes actually buy is the
anchoring described next.

EVERY POSITIVE CARRIER IS ANCHORED, and that is not decoration. A bare
"~by hand" was tried first and it graded "by hand or by machine", which is the
answer beside its own opposite and the most natural hedge a student writes on
this question. Each carrier now holds a second word that the hedge cannot
supply - "done by hand", "be by hand", "in by hand", "harvest is by hand" - so
the whole-phrase branch has something to bite on. The anchoring costs nothing:
all 74 natural phrasings probed still grade, including the eight modal and
manual shapes ("harvesting must be done by hand", "the harvest must be manual")
that plain entries alone rejected. On the association question "~otw erste
lage" is the same device used in reverse: the plain entry let bare "Erste Lage"
grade, which names the classification and not the growers, while the whole
phrase can only appear in an answer that has already named the OTW.

ex=True is applied where a real and different thing extends or truncates the
right answer - bare Gemischter Satz against Wiener Gemischter Satz, Sauvignon
against Cabernet Sauvignon - and on the one threshold-shaped answer, the 2020
vintage, so no comparative rephrasing of it can grade. Two more cases were
found only by running the probe, never by reading: matchSA's raw-substring
branch graded "Burgenland" against Mittelburgenland and "Steiermark" against
Weststeiermark, a generic term truncating the answer in each case, so both are
ex=True with spaced and DAC-suffixed forms of their own answers enumerated.

A THIRD WAS TRIED THERE AND REVERTED, so nobody re-applies it. The same branch
grades the stem's own word "region" against Thermenregion, and ex=True does
shut that. But Thermenregion is a single word with an open class of correct
phrasings around it, and ex=True turns an open class into a closed list: it was
measured to reject "it is the Thermenregion", "the Thermenregion DAC, from
2023", "Thermenregion, south of Vienna" and twenty-two more, every one of them
a student who knows the answer. The tilde that rescues an open class elsewhere
cannot help here, because the phrase to anchor on is one word and a one-word
tilde is the trap lib.loose_tilde_problems exists to block. Enumeration was
measured too and recovered only seventeen of thirty-two. So the echo is
conceded knowingly: a student typing "region" scores a point they did not earn,
which is the cheaper of the two faults by the margin this file's own SA
docstring sets out.

Facts are the durable kind: ordinance mechanics, floors written into law, the
historical order of adoption. Hectares, prices and membership counts, which
drift, are absent.

Everything is ASCII: Gruner Veltliner, Osterreichische Traditionsweingueter,
Sudsteiermark, Ruster Ausbruch, Deutsch Schutzen.
"""

from lib import Q, SA

CAT = "Austria"
SLUG = "r2-austria"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("How a DAC carves its levels", 5),
    ("The Wachau's two ladders", 4),
    ("Ried, the classification law and the banderole", 6),
    ("Burgenland shore to iron south", 6),
    ("Styria, Vienna and the field blend", 5),
]

BANK = [
    # ------------------------------------ How a DAC carves its levels (5) ----
    SA("How a DAC carves its levels",
       "Pepper in a dry Gruner Veltliner was the house style one region staked the entire DAC experiment on, standing alone for years before a second region followed. Name the pioneer.",
       "Weinviertel",
       ["weinviertel", "weinviertel dac", "weinviertel region"],
       "The Weinviertel carried the first DAC, and its rules bound the name to a single variety so that the region would mean one recognisable thing on a list. The gamble was that a huge, diffuse area could be branded by its best habit, and the system that grew from it is the evidence it worked."),
    Q("How a DAC carves its levels",
      "Klassik rising to Reserve in one DAC, district narrowing through village to single Ried in another: the two ladders are measuring different things. What?",
      ["Style and weight in the first case; tightness of origin in the second",
       "Sweetness in the first case; alcohol in the second",
       "Cask size in the first case; vine age in the second",
       "Price positioning in both cases, expressed in two different regional vocabularies"], 0,
      "The older DACs rank the wine itself: a Reserve must be riper, weightier and later to market than the plain bottling below it. The newer ones rank the ground instead, narrowing from the whole district to a village to a single named site, with the rules stiffening at each step. Austria runs both models side by side, which is why two DAC labels can look nothing alike."),
    SA("How a DAC carves its levels",
       "Blaufrankisch was the grape trusted with the first DAC ever written for a red wine. Which region wrote it?",
       "Mittelburgenland",
       ["mittelburgenland", "mittelburgenland dac", "blaufrankischland",
        "blaufraenkischland", "middle burgenland", "mittel burgenland",
        "mittelburgenland region", "mittelburgenland in burgenland"],
       "Mittelburgenland was the first DAC cut for a red wine, resting on Blaufrankisch from deep, water-holding clay. The choice was the easy part: nowhere else in Austria is a single red grape so overwhelmingly the local habit.",
       ex=True),
    Q("How a DAC carves its levels",
      "Somebody decided which grapes a Carnuntum red may carry and when it may be sold. Where does a DAC's rulebook actually come from?",
      ["The region's own wine committee drafts it; the ministry decrees it",
       "The federal tasting panel that assigns the Prufnummer",
       "Brussels writes it, since every DAC doubles as a European protected designation of origin",
       "The Austrian Wine Marketing Board, as a condition of its export funding"], 0,
      "Each region's wine committee - growers, cellars and the trade together - agrees what is typical of the place, and the agriculture ministry turns that agreement into a binding ordinance. That is why permitted varieties, tiers and release dates differ so sharply from one DAC to the next: every rulebook is written at home first."),
    SA("How a DAC carves its levels",
       "Zierfandler and Rotgipfler had to wait longest: their home region was the last to receive a DAC, in 2023. Name it.",
       "Thermenregion",
       # ex=True because the answer contains the stem's own word: "region" is a
       # substring of "thermenregion", so the containment branch grades a
       # candidate who types the one word the question already gave them. No
       # entry can be removed to fix that — the leak is inside the answer. The
       # cost is bounded here in a way it is not for Mesoclimate (see
       # r2_terroir_climate_soil): every phrasing the explanation itself uses,
       # "Thermenregion" and "Thermenregion DAC", is listed exactly.
       ["thermenregion", "thermenregion dac", "thermenregion region"],
       "The Thermenregion DAC arrived in 2023, the most recent of the roster. Before it, the name was an ordinary Qualitatswein origin with no agreed style behind it; now the region itself defines what may carry it, as the rest of Austria's classic names already did.", ex=True),

    # ---------------------------------------- The Wachau's two ladders (4) ---
    Q("The Wachau's two ladders",
      "A single Loibner Riesling carries both Wachau DAC and the word Federspiel on one label. How do the two claims stand to each other?",
      ["One is law, one a private codex, and one label may carry both",
       "Federspiel is the DAC's middle tier, adopted word for word into the ordinance when the region joined",
       "The older term lapsed when the DAC arrived, so the label is out of date",
       "Federspiel is the DAC's own name for its village-level wines"], 0,
      "The DAC ordinance built the Wachau's legal pyramid and left Steinfeder, Federspiel and Smaragd untouched: they remain the Vinea Wachau's property, defined by its codex and printable only by its members. The two ladders answer different questions - the law says where and under what rules, the codex word says how ripe and how weighty."),
    SA("The Wachau's two ladders",
       "One harvest rule binds every tier of the Wachau DAC, from regional wine up to the greatest single Ried. What is it?",
       "Harvest by hand",
       ["harvest by hand", "hand harvest", "hand harvesting", "hand harvested",
        "hand picked", "hand picking", "picked by hand", "harvested by hand",
        "harvesting by hand", "picking by hand", "manual harvest",
        "manual harvesting", "must be picked by hand",
        "grapes are picked by hand", "manual picking", "picked manually",
        "manually picked",
        "~done by hand", "~be by hand", "~in by hand", "~only by hand",
        "~all by hand", "~grapes by hand", "~crop by hand", "~fruit by hand",
        "~harvest is by hand", "~harvesting is by hand", "~hand only",
        "~be manual", "~is manual", "~harvested manually",
        "~manually harvested", "~done manually",
        "~machine harvesting is banned",
        "~machine harvesting is forbidden"],
       "Hand harvesting is written into the Wachau DAC for every category, which the terraces would demand anyway: no machine can work walled slopes. It is one of the clearest cases of a DAC codifying what the landscape already enforced."),
    Q("The Wachau's two ladders",
      "Climb the Wachau pyramid to a named Ried and the permitted varieties collapse to a pair. Which pair?",
      ["Gruner Veltliner and Riesling",
       "Riesling and Weissburgunder",
       "Gruner Veltliner and Muskateller",
       "Riesling and Neuburger"], 0,
      "Seventeen names sit on the Wachau's regional list and nine survive to village level, but a wine from one named Ried must be Gruner Veltliner or Riesling. The funnel is the design: the closer the origin, the fewer the styles the region will put its name behind."),
    SA("The Wachau's two ladders",
       "Long the most celebrated holdout, the Wachau eventually took a DAC of its own. Which vintage was the first entitled to the letters?",
       "2020",
       ["2020", "2020 vintage", "vintage 2020", "from 2020", "since 2020",
        "as of 2020", "from the 2020 vintage", "since the 2020 vintage",
        "as of the 2020 vintage"],
       "The Wachau's DAC applies from the 2020 vintage, nearly two decades after the first of the roster. The delay was self-inflicted in the best sense: the region's own private rules were already stricter than the law in several respects, so the case for joining took years to become pressing.",
       ex=True),

    # ---------------- Ried, the classification law and the banderole (6) -----
    Q("Ried, the classification law and the banderole",
      "Ried Lamm, Ried Kellerberg: the first word is never decoration. What is the law using it to certify?",
      ["That what follows is an officially delimited vineyard site, and the wine Qualitatswein",
       "That the site has been classified Erste Lage or better under the 2023 ranking rules",
       "That the vineyard is a monopole in the hands of a single estate",
       "That the wine was bottled at the estate, inside the named village"], 0,
      "Ried marks the name beside it as a registered vineyard site rather than a village, a brand or a fantasy, and vineyard names of that kind are reserved for Qualitatswein. Rank is a separate matter entirely: most Rieden are classified as nothing at all, and the word promises place, not pedigree."),
    Q("Ried, the classification law and the banderole",
      "For years Erste Lage stood on Kamptal labels with no law behind it, a private badge. What did the decree of 2023 change?",
      ["The words became categories of wine law rather than a club's badge",
       "They were suspended until every region had finished drawing up a ranking of its own, to keep the map fair",
       "Nothing at all; the decree merely fixed how large such words may be printed",
       "They were reserved for nobly sweet wines, on the model of the Pradikat ladder"], 0,
      "The 2023 collective decree wrote Erste Lage and Grosse Lage into wine law, with applications judged on a site's history, its soils and the standing of its wines. Germany's Grosse Lage remains a growers' association's term; Austria's now carries the state behind it, and vineyard classification in statute is something France has and almost nobody else."),
    Q("Ried, the classification law and the banderole",
      "However famous the site, no Austrian Ried can be born a Grosse Lage. What must come first?",
      ["Five years standing as an Erste Lage before promotion can even be applied for",
       "A decade of declared vintages from every producer with rows on the site",
       "Purchase of the site by a single owner, so the wine speaks with one voice",
       "A unanimous vote of the regional wine committee, renewed each spring"], 0,
      "A site is appraised first as Erste Lage, and only after five years at that rank may Grosse Lage be applied for. The stagger keeps the top tier from being minted overnight and gives the market time to test the first verdict before the second is passed."),
    SA("Ried, the classification law and the banderole",
       "Erste Lage cannot land on a village wine: the 2023 rules allow classification only for wines of one DAC tier. Name the tier.",
       "Riedenwein",
       ["riedenwein", "riedenwein tier", "riedenwein level", "riedenwein category",
        "ried wine", "ried wines", "ried level", "ried tier",
        "single vineyard wine", "single vineyard tier", "single vineyard level"],
       "Only a Riedenwein - the single-vineyard tier of a DAC's origin pyramid - can carry Erste Lage or Grosse Lage, so a region still ranking its wines by style has no rung for a classified site to stand on. The rule ties the new words to the narrowest origin the system knows: one wine, one named Ried."),
    SA("Ried, the classification law and the banderole",
       "Decades before the state moved, growers along the Danube banded together to map, rank and defend their best Rieden. Name their association.",
       "Osterreichische Traditionsweingueter",
       ["osterreichische traditionsweingueter", "osterreichische traditionsweinguter",
        "oesterreichische traditionsweingueter", "oesterreichische traditionsweinguter",
        "traditionsweingueter", "traditionsweinguter",
        "traditionsweingueter osterreich", "traditionsweinguter osterreich",
        "austrian traditional wine estates", "austrian traditional wineries",
        "otw", "the otw association", "~otw erste lage"],
       "The Osterreichische Traditionsweingueter formed in the early 1990s around the Kamptal and Kremstal and, from 2010, ranked its members' sites under a private Erste Lage of its own, beginning with the 2009 vintage. Its maps, criteria and annual tastings supplied the raw material for the official classification that followed."),
    Q("Ried, the classification law and the banderole",
      "Of three bottles on a shelf - a litre of Wein, a Landwein, a Kamptal Qualitatswein - exactly one wears the red-white-red strip. Which?",
      ["The Qualitatswein; nothing below that level wears the strip",
       "The Landwein; the strip marks country wine kept for the domestic market",
       "All three should wear it, so two of the bottles are out of compliance",
       "The litre of Wein; the strip stands in for the origin its label cannot state"], 0,
      "The banderole belongs to Qualitatswein and Pradikatswein alone; Landwein and plain Wein never carry it. Its absence is therefore information in itself, telling a buyer at a glance which side of the quality line a bottle stands on."),

    # ------------------------------------ Burgenland shore to iron south (6) -
    Q("Burgenland shore to iron south",
      "Under the Leithaberg DAC, what must a red wine contain?",
      ["At least eighty-five percent Blaufrankisch; the rest, Zweigelt, Sankt Laurent or Pinot Noir",
       "Blaufrankisch and nothing else, at every tier of the appellation",
       "A majority of Zweigelt, seasoned with Blaufrankisch grown on the schist",
       "Any red variety the wider Burgenland list allows, blended in whatever proportion the grower prefers"], 0,
      "The floor is eighty-five percent Blaufrankisch, and the remaining fifteen may come only from Zweigelt, Sankt Laurent or Pinot Noir, with the wine raised in barrel but not flavoured by it. The margin is for seasoning rather than restyling: the appellation wants its hills legible in the glass."),
    Q("Burgenland shore to iron south",
      "A hill range on the border with Lower Austria lends its name to a Burgenland DAC whose rulebook includes a rose. Which?",
      ["Rosalia", "Leithaberg", "Neusiedlersee", "Carnuntum"], 0,
      "Rosalia DAC takes its name from the Rosaliengebirge, the range along Burgenland's border with Lower Austria, and admits Blaufrankisch and Zweigelt as reds along with a rose, which few DAC rulebooks trouble to mention. Leithaberg is named for a range as well, so it is the pink wine in the rulebook and not the hills that settles which DAC the question means."),
    Q("Burgenland shore to iron south",
      "A Neusiedlersee DAC Reserve may be a blend. What holds it together?",
      ["Sixty percent at least of the lead grape, the balance from other local reds",
       "Equal parts of any two Burgenland reds, decided at the press house",
       "A spine of Cabernet Sauvignon, the international note export markets ask for",
       "Whatever the vintage gives, so long as the finished wine clears the alcohol floor"], 0,
      "Reserve wines must hold at least sixty percent of the region's lead variety, the balance drawn from other indigenous reds, and they see cask before release. The allowance recognises how the east shore actually farms: mixed red plantings that always found their way into the same vat."),
    SA("Burgenland shore to iron south",
       "Flat sandy country on the lake's eastern shore built its DAC around a single red grape. Which?",
       "Zweigelt",
       ["zweigelt", "blauer zweigelt", "rotburger"],
       "The Neusiedlersee DAC is built on Zweigelt, from fruity entry-level bottlings to the cask-aged Reserve, where it remains the compulsory backbone of any blend. The warm Seewinkel flats ripen it generously and reliably, which is exactly what a vigorous early ripener asks of a site."),
    SA("Burgenland shore to iron south",
       "Nowhere else does an Austrian DAC belong to a single town, and nowhere else is one written for nobly sweet wine alone. Name the DAC that is both.",
       "Ruster Ausbruch",
       ["ruster ausbruch", "ruster ausbruch dac", "ausbruch dac", "rust ausbruch"],
       "Ruster Ausbruch DAC covers botrytis dessert wine from the free city of Rust and nothing else, the only DAC drawn around one town and the only one devoted wholly to sweet wine. The name it protects is centuries old; the DAC's work was to fence it legally to the place that made it famous."),
    SA("Burgenland shore to iron south",
       "Growers around Deutsch Schutzen and Rechnitz, in Burgenland's far south, sell Blaufrankisch under a DAC named for a hill rather than for their region. Name it.",
       "Eisenberg",
       ["eisenberg", "eisenberg dac"],
       "The DAC borrowed the name of the green-schist hill at the centre of Sudburgenland rather than the region's own, and its writ runs from Rechnitz in the north down past Deutsch Schutzen. Only here does Austrian Blaufrankisch grow on green schist, which is much of why the wines stand apart from those grown on the deep clay further north."),

    # -------------------------------- Styria, Vienna and the field blend (5) -
    Q("Styria, Vienna and the field blend",
      "In 2018 an entire federal state joined the DAC system in one stroke, three regions at once. Name the trio.",
      ["Sudsteiermark, Vulkanland Steiermark and Weststeiermark",
       "Sudsteiermark, Mittelsteiermark and Vulkanland Steiermark",
       "Steirerland, Vulkanland Steiermark and Weststeiermark",
       "Sudsteiermark, Weststeiermark and Weinland Steiermark"], 0,
      "Styria's three regions took their DACs together for the 2018 vintage, sharing one architecture drawn up state-wide. Part of the naming was already new: Sud-Oststeiermark had earlier rebranded itself Vulkanland Steiermark, trading a compass direction for its extinct volcanoes."),
    Q("Styria, Vienna and the field blend",
      "Before a single berry is pressed, Vienna's DAC has already been enforced in the row. What must exist on paper for the wine to claim it?",
      ["An entry in the city's vineyard register recording the parcel as a mixed planting",
       "A harvest date fixed by the city magistrate and posted at the row ends",
       "A fresh soil analysis, renewed every five years by the federal cellars inspection",
       "Proof that the parcel has carried vines continuously since the Habsburg era"], 0,
      "The mixed planting has to exist as a fact of the land, recorded as such in the Viennese vineyard register, before any wine from the parcel can claim the DAC. That is the legal difference between a field blend and a cellar blend: the register can be checked, and a blend of separately grown lots has no entry to point to."),
    SA("Styria, Vienna and the field blend",
       "Every Styrian DAC lists it, and its single-Ried bottlings are what carry the state's reputation abroad. Name the white variety.",
       "Sauvignon Blanc",
       ["sauvignon blanc", "sauvignon", "muskat silvaner", "muskat sylvaner",
        "sauvignon blanc muskat silvaner", "muskat silvaner sauvignon blanc",
        "sauvignon blanc or muskat silvaner", "sauvignon blanc grape"],
       "Sauvignon Blanc is on the permitted list of all three Styrian DACs and is the variety the state's reputation now travels on, from taut regional bottlings up to the smoky, structured wines of a single Ried around villages like Gamlitz. Styria has grown it since the nineteenth century, long enough for the old local name Muskat-Silvaner to survive on cellar doors.",
       ex=True),
    SA("Styria, Vienna and the field blend",
       "Schilcher with a protected designation of origin can come from exactly one DAC. Which?",
       "Weststeiermark",
       ["weststeiermark", "weststeiermark dac", "west styria", "western styria",
        "schilcherland", "west steiermark", "west steiermark dac",
        "weststeiermark region", "schilcherland dac"],
       "Weststeiermark, nicknamed Schilcherland, holds the protected right to the style: Blauer Wildbacher pressed pink, screamingly fresh, off the steep hills around Stainz and Deutschlandsberg. The DAC lists white varieties too, but the pink wine is the reason the region has a name abroad.",
       ex=True),
    SA("Styria, Vienna and the field blend",
       "A Krems grower interplants five white varieties, harvests them in one pass and ferments them together. Vienna's DAC name is closed to him; which traditional term may his label still carry?",
       "Gemischter Satz",
       ["gemischter satz", "gemischter satz label", "gemischter satz field blend",
        "call it gemischter satz", "label it gemischter satz"],
       "Gemischter Satz is a general Austrian term for a co-planted, co-harvested, co-fermented field blend, and any region may use it. What Krems fruit can never carry is the word Wiener in front of it: the DAC fenced the city's name, not the practice itself.",
       ex=True),
]
