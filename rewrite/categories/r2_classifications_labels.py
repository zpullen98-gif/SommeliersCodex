"""Rank II rewrite - Classifications & Labels (51 questions: 13 MC, 38 short answer).

Certified level. The subject is not what the tiers are but how a classification
behaves as an instrument. Who wrote it and on whose authority; how it is revised
and what a revision does to wine already in glass; what a judge will and will not
look at when an estate sues; what the rank on the bottle actually commits anybody
to; and where every one of those answers changes at a border.

The running order follows a classification through its own life. First the author,
then the revision, then the courtroom, then the honest account of what a rank
guarantees. Then the word cru taken apart country by country, then the ageing
words that recur across half of Europe and exactly what each demands, then the
maps and registers that make a ranking of ground enforceable at all, and last the
professional reading of the claim as it reaches the table.

Boundaries were read before writing and are kept. Wine Law and Label Reading are
committed Rank I categories, so nothing here re-asks what a protected name
promises, how the European framework is built, or how to decode a bottler
statement; this sits a full step above them, on the mechanics those categories
take for granted. The 1855 and Saint-Emilion lists belong to Rank II Bordeaux and
are never named. Burgundy's tiers belong to Rank II Burgundy. No single country's
ageing ladder is taken apart where that country holds its own category: Spain's
national floor is used only against a denomination that exceeds it, Italy's
Riserva only as a qualifier that needs a rulebook to attach to, and the rest of
the block is drawn from Austria, Greece and the words that promise nothing.

Written from the syllabus below. The imported bank was not read while writing; it
is read only afterwards, by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and were
run rather than eyeballed. The three '~' entries all carry whole phrases of four
words or more, for the reason set out below; no one-word tilde appears anywhere,
because the tilde is exact-OR-containment and a one-word tilde grades any wrong
answer that happens to carry that word. Note that core.js norm() strips 'de',
'des', 'du', 'la' and 'le',
which collapses several Spanish and Italian phrases into each other - 'cava de
paraje calificado' and 'cava paraje calificado' are one string to the grader - so
every list here was checked for entries that normalise to the same thing. The
three threshold answers carry ex=True, because a duration graded by containment
reads the same in both directions, and each of those lists was then widened until
every natural form of its own answer grades: digits and words, per cent, percent
and abv on the alcohol figure, the vessel named or left out on the durations, and
the bare number with at least, minimum and a trailing minimum on all three.

The lists were then run against check-stem-echo.py, which grades every n-gram of
a stem with that question's own grader, and the first attempt at what it found
did real damage, so the whole episode is recorded here. Three stems scored. Two
were the branch that takes an input contained in an accept entry when the input
holds 60 per cent of its words: 'on the label' paid out on the entry 'roble on
the label', and 'growing area' on 'delimiting the growing area'. The roble entry
was cut and nothing died with it, since the bare 'roble' still grades the whole
sentence by containment.

The growing-area entry was the mistake. It was lengthened to 'delimiting the
growing area first', on the reasoning that a longer entry demands more words of a
stem run than the run has. That is true, and it closed the echo. What it missed
is that lengthening an entry also lengthens the substring the containment branch
has to find, so the anchor stopped being three words and became four with 'first'
nailed to the end of it. Eleven phrasings that graded before stopped grading:
'delimiting the growing area comes first', 'you start by delimiting the growing
area', 'delimiting the growing area before anything else' and the rest of that
family. A student who knew the answer was told it was wrong, which is a worse
outcome than the echo it bought.

The instrument that closes an echo without closing an open class of correct
answers is the tilde, and the branch order is the whole of the reason. matchSA
tests a '~' entry FIRST and then moves on, so a tilde is exact match or
whole-phrase containment and nothing else: no truncation, no 60 per cent ratio,
no substring found inside a longer word. '~delimiting the growing area' therefore
grades every sentence containing that phrase and still refuses 'growing area',
which is not that phrase. The plural needs a second tilde of its own, because
whole-phrase containment stops at a word boundary and 'areas' is not 'area'. The
one rule these have to obey is that a tilde is never a single word: '~port' would
grade 'tawny port', and lib.loose_tilde_problems fails the build on it. Four
words and up is safe, and it is what an open answer wants.

The passive family was widened at the same time, and beside the zone entry
already there it now carries '~the area has to be delimited', which grades 'the
area has to be delimited before anything can be ranked'. That phrasing was
rejected before and should not have been. It cannot be reached by a contrarian:
anything carrying no, not or never trips the negation guard, and 'nothing has to
be delimited' does not contain the phrase at all.

The third flag was not an accept fault. The cru stem printed first growth and
second growth and then asked what the noun means, so the answer was legible in
the question and no accept edit could have closed it, since the displayed answer
is guaranteed to grade. The stem now asks through premier cru and grand cru, and
the English rendering moved into the explanation, where it teaches after the
grading rather than before it. That is a better question on its own merits and
would be worth making with no checker in the room.

All three echoes are closed and no phrasing that graded before the pass fails
now, both measured by grading every accept entry, every framed form of it and
every stem and explanation n-gram against the old lists and the new.

Facts are restricted to ones that do not drift. No membership lists, no current
holders of any rank, no ownership and no prices. Procedure, statute, the structure
of the instruments and long-settled history carry the weight, and the three
numbers that appear are written into law rather than into anybody's cellar.
"""

from lib import Q, SA

CAT = "Classifications & Labels"
SLUG = "r2-classifications-labels"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("Who writes the list", 6),
    ("Revision, promotion and the closed list", 6),
    ("Challenge, annulment and the limits of review", 7),
    ("What a rank guarantees, and what it does not", 5),
    ("The cru concept compared", 5),
    ("Ageing terms as an instrument", 6),
    ("Reserva, Riserva and Reserve across borders", 5),
    ("Drawing the line, and recording the ground", 6),
    ("Reading the claim on the label", 5),
]

BANK = [
    # ------------------------------------------------ Who writes the list (6) --
    Q("Who writes the list",
      "A grower resigns from the association whose pyramid ranked his best parcel, and from the next vintage that ranking may not appear on his label. Which kind of classification behaves that way?",
      ["One owned by a private association, where the right to print the rank comes with membership",
       "One enacted by decree, where the rank attaches to the estate itself",
       "One granted by a government agency after a petition to delimit a boundary, which the agency withdraws only for a breach of the rules",
       "One written into the production rules of the appellation, where the rank is a condition of the name rather than a benefit of belonging to anything"], 0,
      "Membership and the ranking are the same thing in a private scheme, so the words leave with the grower. A rank granted by decree or written into an appellation's rulebook belongs to the estate or to the ground, and no falling out with the neighbours can take it away."),
    SA("Who writes the list",
       "Officials of the Prussian state ranked every vineyard along the Mosel in 1868, from the finest slopes down to the poorest, and no wine merchant had asked them to. What was that survey drawn up to do?",
       "Assess land tax",
       ["assess land tax", "land tax", "assessing land tax", "taxation", "tax assessment",
        "to tax the land", "set the land tax", "land taxation", "property tax"],
       "The map priced ground for the revenue, so the best sites were taxed hardest and the ranking fell out of the arithmetic. It is still cited when a Mosel site's standing is argued over, which makes it the clearest case of a classification whose authority comes from having been written by people with no stake in wine at all."),
    SA("Who writes the list",
       "Italy gives every denomination a body that may police the use of the name, run its seal and put amendments to the ministry, and yet a grower inside the zone can decline to join it. What is such a body called?",
       "A consorzio di tutela",
       ["consorzio di tutela", "consorzio", "consorzi di tutela", "protection consortium",
        "consorzio tutela"],
       "Membership is voluntary, so a consorzio speaks for the growers who joined it and its weight depends on how much of the zone that turns out to be. Its powers are delegated rather than inherent: policing the name, issuing the seal and proposing amendments are all done on the ministry's authority and can be withdrawn."),
    SA("Who writes the list",
       "Where a consortium speaks for a large enough majority of a denomination, the state can make its stricter rules bind every producer in the zone, members and refusers alike. What is that extension known as?",
       "Erga omnes",
       ["erga omnes", "erga omnes extension", "erga omnes powers", "an erga omnes decree"],
       "Latin for towards everyone, and it is the only route by which a voluntary body ends up binding somebody who never signed anything. The threshold is deliberately high, because the alternative is a private club writing law for its competitors."),
    SA("Who writes the list",
       "Spain hands the boundary, the yields, the registers and the day-to-day policing of a denomination to a body of its own rather than to a national institute. Name it.",
       "The Consejo Regulador",
       ["consejo regulador", "consejo", "regulatory council", "regulating council",
        "regulatory board"],
       "One body proposes the rulebook, keeps the registers and runs the inspections, which makes a Spanish denomination look far more self-contained than a French one. The separation between writing the rules and certifying against them is still there, because European law obliges the control and certification arm to be accredited like any outside certifier and to sit independently of the organs that manage the name, and some denominations hand the job to an external body altogether. The trade-off is the obvious one: the body writing the rules is drawn from the growers who have to live with them."),
    Q("Who writes the list",
      "For most of the last century the panel deciding whether a French wine could use its appellation was drawn from that appellation's own growers. Who carries out the check now?",
      ["An independent inspection or certification body, working to a control plan the national institute has approved",
       "The growers' syndicate, exactly as before",
       "Inspectors sent out by the European Commission",
       "The customs service, at the moment the wine leaves the cellar"], 0,
      "Separating the people who write the rules from the people who verify compliance is the whole point of the reform, on the plain ground that no body can audit itself. Checks are also risk-based rather than universal, so an estate with a clean record is sampled less often than one that has been in trouble."),

    # ------------------------- Revision, promotion and the closed list (6) -----
    Q("Revision, promotion and the closed list",
      "A ranking adds a new tier above its old summit, and not one estate is demoted by a single word. What has happened to the estates that stood at the top?",
      ["They have been relegated in substance, since the rank they hold is no longer the highest available",
       "Nothing whatever, because a rank means what its own rulebook says and carries no comparison with anything above it",
       "They enter the new tier automatically for one review cycle, after which they must earn it at the next revision like anybody else",
       "Their rank lapses until they apply for the new one, since a list that gains a tier has to be rebuilt from the applications upwards"], 0,
      "Adding at the top is the least confrontational way to revise a list, because nobody is demoted and so nobody has an obvious complaint to bring. It also devalues every rank beneath it, which is why a word that used to mean the best now has to be explained to a guest instead of simply read."),
    Q("Revision, promotion and the closed list",
      "Published in the spring, a new ranking names the harvest from which it takes effect. Where does that leave bottles of earlier vintages still in the trade?",
      ["They keep the ranking that was in force when they were made",
       "They must be relabelled before they can be sold on",
       "They lose all ranking, since only the current list has force",
       "The merchant may print whichever of the two rankings he prefers"], 0,
      "A ranking bites on wine made after it takes effect, so a cellar can hold bottles ranked under three or four versions of one list at once. It also means a demotion costs an estate nothing on stock already in glass, which is why the argument is always about the vintages still to come."),
    SA("Revision, promotion and the closed list",
       "Italy will not consider a wine for its highest denomination until it has served a stated minimum at the tier below. How long is that apprenticeship?",
       "Ten years",
       ["ten years", "ten years as a doc", "ten years at doc level", "ten years at doc",
        "10 years", "10 years as a doc", "10 years at doc level", "10 years at doc",
        "at least ten years", "at least ten years as a doc",
        "at least ten years at doc level", "at least ten years at doc",
        "at least 10 years", "at least 10 years as a doc",
        "at least 10 years at doc level", "at least 10 years at doc",
        "minimum ten years", "minimum ten years as a doc",
        "minimum ten years at doc level", "minimum ten years at doc", "minimum 10 years",
        "minimum 10 years as a doc", "minimum 10 years at doc level",
        "minimum 10 years at doc", "ten years minimum", "ten years minimum as a doc",
        "ten years minimum at doc level", "ten years minimum at doc", "10 years minimum",
        "10 years minimum as a doc", "10 years minimum at doc level",
        "10 years minimum at doc", "ten", "10", "a decade", "ten full years",
        "at least a decade", "a decade at doc level", "a decade minimum"],
       "The waiting period is what stops the top rank being handed to a name invented last season: the wine has to have existed, been made to a rulebook and been checked for a decade before anyone will look at it. The rung below works the same way on a shorter clock, so a new denomination climbs the ladder rather than stepping onto it halfway up.",
       ex=True),
    SA("Revision, promotion and the closed list",
       "Every protected European name rests on one document setting out its boundary, its varieties, its yields and its methods, and amending an appellation means amending that document. What is it called?",
       "The product specification",
       ["product specification", "cahier des charges", "specification",
        "product specification document", "disciplinare", "disciplinare di produzione",
        "pliego de condiciones", "technical file"],
       "Nothing about an appellation lives outside it, so the argument about a rule change is an argument about a paragraph, brought by the producer group and approved above them. Because the document is public, it is also the only honest way to answer what a name actually demands rather than what it is reputed to demand."),
    SA("Revision, promotion and the closed list",
       "A rulebook is tightened and a variety already in the ground is struck off the permitted list. Growers are rarely made to pull the vines up that same winter. What is the allowance called?",
       "A transitional period",
       ["transitional period", "transition period", "transitory period", "grandfathering",
        "grandfather clause", "phasing out period", "a period of transition", "grace period",
        "a period of grace", "transitional arrangement", "transitional measure"],
       "A vine takes years to repay its planting, so a rule that bit immediately would confiscate the investment of everyone who had followed the old rules. The allowance is normally counted in vintages rather than years, and it is why a variety can appear in a wine for a decade after it stopped being permitted."),
    SA("Revision, promotion and the closed list",
       "Judging a candidate estate on one bottle would reward a single lucky year, so a classification tasting almost never does it. What does a candidate submit instead?",
       "A run of consecutive vintages",
       ["run of consecutive vintages", "consecutive vintages", "several consecutive vintages",
        "a series of vintages", "run of vintages", "sequence of vintages",
        "successive vintages", "several vintages", "multiple vintages",
        "a number of vintages", "vintages in a row"],
       "A run catches the wet years and the hot ones, which is exactly the point: a rank is meant to describe what an estate does reliably rather than what it managed once. It also raises the cost of applying, since the estate has to have kept the wine, which quietly favours the established over the new."),

    # ------------------- Challenge, annulment and the limits of review (7) -----
    Q("Challenge, annulment and the limits of review",
      "Demoted at a revision, an estate goes to court insisting its wine is plainly better than several that were promoted. What will the judges actually examine?",
      ["Whether the decision was reached by the procedure the rules laid down",
       "Whether the wine tastes better than those ranked above it, on expert evidence",
       "Whether the estate's sales have fallen since the revision",
       "Whether the classification body was entitled to exist at all"], 0,
      "Courts review legality and not merit, so an argument about how good a wine is happens to be the one argument that cannot succeed. A judge asks whether the decision was properly made, which means the challenge has to be built out of the paperwork rather than out of the glass."),
    Q("Challenge, annulment and the limits of review",
      "Suppose a court quashes the order that enacted a new ranking. Which list governs the following morning?",
      ["The ranking the quashed one replaced, since an annulment wipes out the new list from the start",
       "No ranking at all, until a fresh one is published, because quashing an order leaves the field empty instead of reviving anything",
       "The quashed ranking, until the legislature replaces it, since a court may criticise an order without stopping it from operating",
       "Whichever of the two rankings an estate prefers to print, the choice resting with the producer while the position is unsettled"], 0,
      "An annulment works backwards rather than forwards: the act is treated as never having been made, so the earlier position revives of its own accord. That is what makes it so disruptive in trade, because labels, price lists and cartons all refer overnight to a rank that has ceased to exist."),
    SA("Challenge, annulment and the limits of review",
       "Wine rankings are undone in court on procedure far more often than on substance, and one objection recurs above all others: somebody judging had a stake in the result. Name that objection.",
       "Conflict of interest",
       ["conflict of interest", "conflicts of interest", "bias", "apparent bias", "partiality",
        "an interest in the outcome"],
       "The problem is structural rather than personal, because a small region has few people qualified to judge and most of them own or sell wine inside it. The usual answers are outside panellists, recusal and tasting under numbers, so that the judging can be shown to have been fair as well as being fair."),
    SA("Challenge, annulment and the limits of review",
       "Not everybody who dislikes a ranking may challenge it; a claimant has to show that the decision actually affects him. What is that threshold requirement called?",
       "Standing",
       ["standing", "locus standi", "legal standing", "sufficient interest",
        "an interest in bringing the claim"],
       "A merchant who merely sells the wine, or a neighbour who never applied, is usually turned away at that first hurdle however strong the complaint. It is why nearly every challenge comes from the estates immediately below a line, and why a revision that promotes without demoting is so rarely tested."),
    SA("Challenge, annulment and the limits of review",
       "Litigation runs for years while the estates promoted at a revision go on printing their new rank. What must a challenger win early to stop that happening in the meantime?",
       "A suspension",
       ["suspension", "an interim suspension", "interim relief", "injunction",
        "an interim injunction", "a stay", "interim order"],
       "Without it the ranking stays in force throughout, and by the time judgment arrives the promoted wines have been sold under the new rank for several vintages. A judgment cannot unprint a label, which is the practical reason challengers go for the early order and settle for it when they get it."),
    SA("Challenge, annulment and the limits of review",
       "Refused a rank, a candidate is entitled to more than the bare result, and without it a challenge could never be framed at all. What must the body provide?",
       "Its reasons",
       ["reasons", "reasons for the decision", "a statement of reasons",
        "grounds for the decision", "written reasons"],
       "A decision given without them is unreviewable, because there is nothing on the record for a court to test the outcome against. Bodies that resisted the duty generally lost, and the modern practice of returning a scored sheet to every candidate, successful or not, is the direct consequence."),
    SA("Challenge, annulment and the limits of review",
       "Judging candidates against a standard that was never published leaves a ranking indefensible the moment anyone objects. What has to be in the open before the tasting begins?",
       "The criteria",
       ["criteria", "the criteria for admission", "published criteria",
        "the standards to be applied", "the criteria and their weightings"],
       "Publishing them in advance is what converts a private opinion into a decision that can be defended, and it also disciplines the body, which cannot invent a requirement once it sees who applied. The weightings matter as much as the headings, because a scheme that scores reputation heavily will simply return the ranking it started with."),

    # ------------------ What a rank guarantees, and what it does not (5) -------
    Q("What a rank guarantees, and what it does not",
      "Inside a classified zone sits a celebrated property carrying no rank whatever, and its wine outsells most of those that hold one. What is the likeliest explanation?",
      ["It never entered, because a classification ranks the estates that applied to it",
       "It was demoted at the last revision, and a demotion bars an estate from ever being considered again",
       "Its wines are sold outside the appellation system altogether",
       "Estates above a certain size are excluded by rule, a ranking being meant to reward small holdings rather than large commercial ones"], 0,
      "A classification is a list of candidates and not a survey of a region, so an estate that stays out simply does not appear and its absence proves nothing about the wine. Where entry costs money, opens the cellar to inspectors and risks a public demotion, a property that already sells everything it makes has a real calculation to run."),
    Q("What a rank guarantees, and what it does not",
      "Asked whether a grand cru from one country beats a grand cru from another, since both sit at the top of their ladders, what is the honest reply?",
      ["Each rank was awarded by a different authority against different criteria, so the two cannot be compared as ranks",
       "Yes, because European law sets one standard for the words",
       "Yes, because the top of any ladder means the same thing",
       "No, because the term belongs in law to a single region"], 0,
      "A classification is a closed system: it orders the candidates on its own list against its own criteria and says nothing whatever about anything outside it. Shared words look like a common currency and are not one, so the first question at the table is which list a word came from and the second is what that list was measuring."),
    SA("What a rank guarantees, and what it does not",
       "A rank is printed as an addition to something else on the label, and a wine that loses that other claim may not print its rank either. Which claim is it?",
       "The appellation",
       ["appellation", "appellation of origin", "protected designation of origin",
        "denomination", "denomination of origin", "the protected name"],
       "A rank rides on a protected name rather than standing on its own, so it can only appear where the wine qualified for the name in that vintage. Anything declassified for any reason takes its rank down with it, which is why a classification has nothing to say about the wine an estate failed to get through the year's checks."),
    SA("What a rank guarantees, and what it does not",
       "A bottle reaches the shelf printing a rank its producer never held. Which body of law is reached for to punish that label?",
       "Consumer protection law",
       ["consumer protection law", "consumer protection", "consumer law", "trading standards law",
        "misleading practices law", "consumer protection rules", "unfair commercial practices",
        "false advertising", "misleading advertising"],
       "A false rank is a misleading commercial claim, and it is pursued by whoever polices misleading claims in that market rather than by anyone in wine. The classification body's own sanction is narrower and slower, since all it can withdraw is the right to use its words in future."),
    SA("What a rank guarantees, and what it does not",
       "A classification's boundary runs between rows of vines on ground that does not change at all across the line. Which lines did the mapmakers follow?",
       "The land registry boundaries",
       ["land registry boundaries", "land registry", "cadastral boundaries", "cadastral lines",
        "property boundaries", "the existing parcel boundaries", "cadastre"],
       "A boundary has to be walkable and enforceable, so it follows parcels somebody already owns rather than a line a geologist would draw. It is the standard reason a classification looks arbitrary at its edges, and the standard defence is that a boundary a surveyor cannot mark is a boundary nobody can police."),

    # --------------------------------------- The cru concept compared (5) -----
    Q("The cru concept compared",
      "One country's cru is a delimited parcel of ground, another's a whole village and a third's a business with a name and an address. What follows for anyone reading the word cold?",
      ["It names a rank without saying what was ranked, so the system behind it has to be identified first",
       "It always means the same thing, being fixed for the whole union in European law, which sets one meaning for cru wherever it is printed",
       "It is reliable for vineyards and unreliable for villages, since a parcel can be surveyed while a parish is too large to hold to any standard",
       "It means nothing at all outside France, every other country having borrowed the word as decoration rather than writing it into a rulebook"], 0,
      "The unit is the entire content of the claim, so grand cru can mean four hectares of hillside in one glass and a whole parish in the next. Burgundy ranks ground and Beaujolais uses the word for whole appellations, while other systems rank villages or companies, and none of that is visible on the bottle."),
    SA("The cru concept compared",
       "Premier cru and grand cru cross into English untranslated, and the noun they share began life as the past participle of a French verb. Rendered literally, what does that noun mean?",
       "Growth",
       ["growth", "grown", "what grew there", "the thing that grew",
        "growth in the sense of what grew there"],
       "Cru is the past participle of croitre, to grow, so a cru is literally a growth: the thing that grew, and by extension the ground that grew it. English says it both ways without noticing, keeping the French noun in premier cru and translating that same noun in first growth. The word carries no rank of its own until a classification attaches one, which is why it turns up in systems that rank nothing at all."),
    SA("The cru concept compared",
       "Italian law lets one word stand in front of a vineyard name, and only where the plot is on the denomination's register and its fruit was vinified apart from everything else. Which word?",
       "Vigna",
       ["vigna", "vigna followed by the vineyard name", "the word vigna",
        "vigna plus the plot name"],
       "The register and the separate vinification are the whole of the requirement, and nothing about the ground is assessed, so the word certifies provenance and bookkeeping rather than rank. Anyone reading it as an Italian grand cru has read a great deal more into it than the rulebook contains."),
    SA("The cru concept compared",
       "Piedmontese growers keep a dialect word for the slope where the snow goes first, and it stands at the front of some of the most expensive vineyard names in Barbaresco. What is the word?",
       "Sori",
       ["sori", "sori slope", "sori in piedmont", "sori a south facing slope"],
       "It names a south-facing pitch that thaws and ripens ahead of its neighbours, so the word does the work a cru name does anywhere else: this ground is not the ground beside it. Nothing in law ranks any of them, which is why the names were famous for a generation before any register existed to hold them."),
    SA("The cru concept compared",
       "Estates rather than vineyards were ranked by a decree of 1955 in a region that has never revised the list, and the number of holders has only ever fallen. Which region?",
       "Provence",
       ["provence", "cotes de provence", "provence in southern france"],
       "A rank there attaches to the property as it stood in 1955 and does not survive it being broken up or absorbed, so holders drop off and none is ever added. It is the purest form of a closed list: no review, no promotion, no appeal, and a slow shrinking that nobody ever has to decide on."),

    # ------------------------------- Ageing terms as an instrument (6) --------
    Q("Ageing terms as an instrument",
      "Ageing minimums are almost never counted from the day the wine was actually made. What do they run from instead?",
      ["A fixed calendar date after the harvest, the same for every producer in the denomination",
       "The day the wine was pressed off its skins",
       "The day the producer declares the wine finished",
       "The day the wine is first offered for sale"], 0,
      "A fixed date is auditable: an inspector reads a bottling record against a calendar rather than establishing when fermentation stopped in each cellar. It also holds two wines of one harvest to the same clock though one was pressed a fortnight earlier, which is the only way a requirement can mean the same thing twice."),
    SA("Ageing terms as an instrument",
       "Beyond the length of the ageing and the vessel it happens in, a rulebook commonly fixes one more thing, and it is the one an importer's diary turns on. What is it?",
       "A release date",
       ["release date", "the earliest release date", "the date of release",
        "when the wine may be sold", "earliest date of sale", "the first day it may be sold"],
       "Fixing the first day of sale brings a whole region to market at once, which is why a wine can be finished, bottled and still unavailable. It also gives the inspectors a single date to police instead of thousands of separate bottling records."),
    SA("Ageing terms as an instrument",
       "Sold as twenty years old, a fortified wine carries a number that no ledger in the lodge could ever prove. Who decides whether the blend deserves it?",
       "A tasting panel",
       ["tasting panel", "panel of tasters", "an official tasting panel", "a panel",
        "the chamber of tasters", "a tasting committee"],
       "The figure describes a style and an average rather than an audited fact, so it is settled by tasting against reference samples instead of by reading a cellar book. It is the one corner of wine law where an age claim rests on a palate, which is also why the categories jump in decades rather than in single years."),
    SA("Ageing terms as an instrument",
       "Spain fixes national minimums for its ageing words and lets a denomination demand more, which several do. How long must a red spend in oak to be sold as Gran Reserva under the national rule?",
       "Eighteen months",
       ["eighteen months", "eighteen months in oak", "eighteen months in barrel",
        "eighteen months in cask", "eighteen months in wood", "18 months",
        "18 months in oak", "18 months in barrel", "18 months in cask",
        "18 months in wood", "at least eighteen months",
        "at least eighteen months in oak", "at least eighteen months in barrel",
        "at least eighteen months in cask", "at least eighteen months in wood",
        "at least 18 months", "at least 18 months in oak",
        "at least 18 months in barrel", "at least 18 months in cask",
        "at least 18 months in wood", "minimum eighteen months",
        "minimum eighteen months in oak", "minimum eighteen months in barrel",
        "minimum eighteen months in cask", "minimum eighteen months in wood",
        "minimum 18 months", "minimum 18 months in oak", "minimum 18 months in barrel",
        "minimum 18 months in cask", "minimum 18 months in wood",
        "eighteen months minimum", "eighteen months minimum in oak",
        "eighteen months minimum in barrel", "eighteen months minimum in cask",
        "eighteen months minimum in wood", "18 months minimum",
        "18 months minimum in oak", "18 months minimum in barrel",
        "18 months minimum in cask", "18 months minimum in wood", "eighteen", "18",
        "a year and a half", "one and a half years", "eighteen months in oak barrels",
        "18 months in oak barrels"],
       "Sixty months in all, of which at least eighteen in wood and the rest largely in glass. Denominations that built their name on ageing set a longer clock than that, so the national figure describes the least a producer can have done and never what the serious ones actually do.",
       ex=True),
    SA("Ageing terms as an instrument",
       "An ageing minimum is worth exactly as much as the paperwork behind it. Which record does an inspector read to establish when a lot went into wood and when it came out?",
       "The cellar register",
       ["cellar register", "cellar records", "cellar book", "cellar ledger", "the cellar log",
        "movement records of the cellar", "cellar movement records", "records of the cellar",
        "register of the cellar", "winery records", "winery register"],
       "Every movement of a lot is entered as it happens, so the requirement is tested against a document written months before anyone came to check it. It is the same principle that carries origin claims: nothing in the glass proves how long a wine sat in a barrel, and only the written record does."),
    SA("Ageing terms as an instrument",
       "An ageing rule fixes how long and often where, and leaves untouched the one variable that changes a bottle more than either. What is it?",
       "The temperature it is kept at",
       ["temperature", "storage temperature", "the temperature of the cellar",
        "how warm the wine is kept", "cellar temperature", "the temperature it is stored at"],
       "Two cellars can satisfy the same rule and hand a guest two different wines, because heat is what actually moves a wine along and no rulebook measures it. It is also why a bottle that met its minimum in a warm warehouse can taste older than one that spent twice as long somewhere cold."),

    # ------------------ Reserva, Riserva and Reserve across borders (5) -------
    Q("Reserva, Riserva and Reserve across borders",
      "A guest holding a Spanish Reserva and a Californian Reserve asks whether the two words promise the same thing. What do you tell them?",
      ["The Spanish word carries minimum times in cask and in bottle, and the American one carries no requirement at all",
       "Both carry the same minimum ageing, the term having been harmonised by treaty, so the word can be read once and applied to either bottle",
       "The American word carries the longer requirement of the two, federal rules setting a floor in oak that the Spanish ladder never reaches",
       "Neither carries any requirement, both being marketing words a producer may print at whatever age the wine happens to have reached"], 0,
      "Spain writes its ageing words into law and audits them, which is what lets a guest compare one bodega with another. In the United States the word is unregulated, so it is worth precisely what the producer's own reputation is worth, and on a few labels that is a great deal."),
    SA("Reserva, Riserva and Reserve across borders",
       "Austria hangs its Reserve on a number that has nothing to do with time in cask. Which threshold must the wine reach?",
       "Thirteen percent alcohol",
       ["13%", "13% alcohol", "13% abv", "13 percent", "13 percent alcohol",
        "13 percent abv", "13 per cent", "13 per cent alcohol", "13 per cent abv",
        "thirteen percent", "thirteen percent alcohol", "thirteen percent abv",
        "thirteen per cent", "thirteen per cent alcohol", "thirteen per cent abv",
        "at least 13%", "at least 13% alcohol", "at least 13% abv",
        "at least 13 percent", "at least 13 percent alcohol", "at least 13 percent abv",
        "at least 13 per cent", "at least 13 per cent alcohol",
        "at least 13 per cent abv", "at least thirteen percent",
        "at least thirteen percent alcohol", "at least thirteen percent abv",
        "at least thirteen per cent", "at least thirteen per cent alcohol",
        "at least thirteen per cent abv", "minimum 13%", "minimum 13% alcohol",
        "minimum 13% abv", "minimum 13 percent", "minimum 13 percent alcohol",
        "minimum 13 percent abv", "minimum 13 per cent", "minimum 13 per cent alcohol",
        "minimum 13 per cent abv", "minimum thirteen percent",
        "minimum thirteen percent alcohol", "minimum thirteen percent abv",
        "minimum thirteen per cent", "minimum thirteen per cent alcohol",
        "minimum thirteen per cent abv", "13 %", "13 % alcohol", "13 % abv", "13",
        "thirteen", "13 abv", "thirteen abv", "13% alcohol by volume",
        "13 percent alcohol by volume", "13 per cent alcohol by volume",
        "thirteen percent alcohol by volume", "thirteen per cent alcohol by volume",
        "a minimum of 13%", "a minimum of 13 percent", "a minimum of 13% alcohol",
        "a minimum of 13 percent alcohol", "a minimum of thirteen percent",
        "a minimum of thirteen percent alcohol", "13% minimum", "13 percent minimum",
        "thirteen percent minimum", "13 percent alcohol minimum",
        "thirteen percent alcohol minimum"],
       "Reserve there is a ripeness claim, reachable on a good site in a warm year and out of reach in a cool one, which is the opposite of a rule counted in months. It comes with a later release than an ordinary Qualitatswein, and that is the only part of the definition resembling the ageing words used elsewhere.",
       ex=True),
    SA("Reserva, Riserva and Reserve across borders",
       "Reserve and Grande Reserve are legal ageing terms with fixed spells in cask and in bottle, and the country using them is not one usually taught for its ageing rules. Which country?",
       "Greece",
       ["greece", "greek", "greek wine law"],
       "Both terms sit on top of a Greek protected designation and each demands a stated time in wood followed by a stated time in glass, with reds held longer than whites. The reserve family of words is legislated far more widely than the two or three systems usually taught, which is why the word alone settles nothing."),
    SA("Reserva, Riserva and Reserve across borders",
       "Riserva is a qualifier attached to a denomination rather than a word standing on its own, so the tier immediately below the denominations may never print it. Which tier is that?",
       "IGT wines",
       ["igt wines", "igt", "igp wines", "igp", "indicazione geografica tipica",
        "indicazione geografica protetta", "wines at igt level", "igt and igp wines",
        "igt tier", "igt level", "igt category", "igp tier"],
       "The word is only available where a rulebook fixes what it demands, and the rules at that tier fix no ageing minimum for it to be stricter than. It is also why the same word can mean two years in one denomination and twice that in another: the number lives in each rulebook rather than in the word."),
    SA("Reserva, Riserva and Reserve across borders",
       "Four months in barrel leaves a Spanish red short of the lowest rung of the ageing ladder, and the bodega still wants the oak mentioned on the label. Which word does it reach for?",
       "Roble",
       ["roble", "vino de roble", "the word roble"],
       "Roble simply means oak, and the wine does have to have sat in oak vessels of no more than six hundred litres to carry the word, with chips and staves in a tank expressly ruled out. What no national rule fixes is how long, so four months and fourteen both read as roble unless the denomination has written a floor of its own. A guest who hears a junior rung of the crianza ladder in it has heard something that is not there."),

    # ------------------------ Drawing the line, and recording the ground (6) --
    Q("Drawing the line, and recording the ground",
      "Estates falling just below the cut-off in a ranking lose far more than the difference in their wine would suggest. Why does that happen?",
      ["A ranking turns a continuous spread of quality into a few steps, so a hair's difference lands on one side of a line",
       "Buyers are told which estates were nearly promoted and avoid them",
       "The rules oblige estates just below the line to be marked as such",
       "Estates near the line are inspected more often and pay higher levies"], 0,
      "Any classification draws lines through a distribution that has none, and the wines either side of a line are always more alike than the ranks make them look. That is where the value on a list usually sits, in the bottle just under the cut-off, sold at the price of its rank rather than at the price of its quality."),
    SA("Drawing the line, and recording the ground",
       "Ranking ground is only enforceable because every planted parcel in the European Union sits on one compulsory record showing who farms it, what is planted and when it went in. Name that record.",
       "The vineyard register",
       ["vineyard register", "vine register", "vineyard registry", "register of vineyards",
        "vineyard cadastre"],
       "Without it a claim about a parcel could not be checked at all, since the wine itself carries no evidence of which rows it came from. The register is also what makes a boundary change bite immediately: the parcel is either inside the line on the day of the harvest declaration or it is not."),
    SA("Drawing the line, and recording the ground",
       "Somewhere with no delimited wine-growing area at all decides to rank its best sites. What has to be settled before any ranking can mean anything?",
       "Delimitation of the area",
       ["delimitation", "delimitation of the area", "delimiting the area",
        "delimitation of the zone", "delimiting the region", "drawing the boundary first",
        "delimit the area", "the area must be delimited", "delimiting the vineyard area",
        "~delimiting the growing area", "~delimiting the growing areas",
        "~the area has to be delimited", "the area has to be delimited first",
        "the zone has to be delimited first", "settling the delimitation"],
       "A rank is a statement about somewhere, so somewhere has to exist in law before anything inside it can be ranked. That order is why young regions spend a decade arguing over a boundary that looks obvious afterwards, and why the ranking, if it comes at all, arrives a generation later."),
    SA("Drawing the line, and recording the ground",
       "Cava added a tier at the top in 2017 for wine off one delimited plot, vinified separately and held on its lees for at least three years. What is that tier called?",
       "Cava de Paraje Calificado",
       ["cava de paraje calificado", "paraje calificado", "paraje calificado tier"],
       "The rank belongs to the plot rather than to the house, which is unusual in a denomination built on blending across half a country. It also requires the same producer to have farmed, pressed and bottled the wine, so it is a single-vineyard claim in the Burgundian sense rather than a longer-aged version of the wines beneath it."),
    SA("Drawing the line, and recording the ground",
       "One Catalan denomination on slate built a Burgundian ladder of its own, climbing from the region through a named village to individually classified single vineyards. What is the village rung called?",
       "Vi de Vila",
       ["vi de vila", "vins de vila", "vi de vila priorat", "village wine vi de vila"],
       "The rungs above it narrow to a named place and then to a classified single vineyard, so the ladder ranks ground rather than producers. Bierzo and Rioja wrote ground-based tiers of their own in 2017, so it is no longer the only Spanish scheme of the kind, but it remains the fullest. It was written by the denomination itself in deliberate imitation of Burgundy, and it is the clearest modern case of the cru idea being imported whole."),
    SA("Drawing the line, and recording the ground",
       "Vineyards were sorted into first, second and third class in a Hungarian region during the eighteenth century, generations before any French list did the same. Which region?",
       "Tokaj",
       ["tokaj", "tokaji", "tokaj hegyalja", "tokaj in hungary"],
       "The survey graded the ground rather than the producers, and it was made for a crown that wanted to protect and to tax a valuable export. Its classes were carried into the region's later rules, which is why it is usually cited as the earliest vineyard classification still recognisable in its modern form."),

    # -------------------------------- Reading the claim on the label (5) ------
    Q("Reading the claim on the label",
      "Four phrases turn up across a shelf of European bottles: Grand Cru Classe, Vieilles Vignes, Riserva and Cuvee. Which pair may anybody print without meeting any rule at all?",
      ["Vieilles Vignes and Cuvee", "Grand Cru Classe and Cuvee",
       "Riserva and Vieilles Vignes", "Grand Cru Classe and Riserva"], 0,
      "Grand Cru Classe and Riserva are protected terms with rulebooks and inspectors behind them, and the other two are the producer's own prose: cuvee means a vatful, and old vines means whatever the estate thinks old is. The habit worth building is to sort every word on a label into those two piles before saying anything about the wine."),
    SA("Reading the claim on the label",
       "Two Spanish denominations have been promoted to the rung above DO in more than thirty years of the system, one writing the extra word in Castilian and the other in Catalan. Name them.",
       "Rioja and Priorat",
       ["rioja and priorat", "priorat and rioja", "rioja priorat", "priorat rioja",
        "rioja doca and priorat doq", "doca rioja and doq priorat",
        "priorat doq and rioja doca", "rioja calificada and priorat qualificada"],
       "Rioja took the qualified rank first and Priorat followed a decade later, and nothing has joined them since, which is a fair measure of how rarely the top rung opens. The requirements reach past the wine into how the denomination polices its own members, so the promotion is as much about the body as about the bottles."),
    SA("Reading the claim on the label",
       "Leaving a Spanish denomination, every bottle carries a numbered label on its back, issued by the regulating body and counted against what the bodega declared. Name it.",
       "The contraetiqueta",
       ["contraetiqueta", "contraetiquetas", "contra etiqueta", "contraetiqueta seal",
        "contraetiqueta back label"],
       "Issuing the seals in a fixed quantity is how a denomination polices volume, because the number handed out cannot exceed what the registered vineyard could lawfully have produced. It also carries the ageing tier, so the claim on the front is matched by a strip on the back that the body itself printed. A plain etiqueta is any label at all, and it is the contra that makes this one the regulator's.",
       ex=True),
    SA("Reading the claim on the label",
       "Nothing in wine law stands behind a private ranking, and yet its owner can stop an outsider printing the same words. Which body of law does that work?",
       "Trademark law",
       ["trademark law", "trade mark law", "trademark", "trade mark registration",
        "law of trademarks", "intellectual property law"],
       "A ranking that is not a law is a name, and a name is protected by registering it, which is why private schemes register their words and their emblems and go to court as brand owners rather than as appellations. It also shapes how they behave: an owner who tolerates a copy risks the mark going generic, so a private scheme has to police its words far more visibly than a state body ever does."),
    SA("Reading the claim on the label",
       "Caught breaking the rules attached to a private association's top rank, a member faces the only real sanction such a body holds. What is it?",
       "Expulsion",
       ["expulsion", "expelled", "expelling the member", "expulsion from the association",
        "expelled from the association", "losing membership", "loss of membership",
        "removal from the association"],
       "A private scheme cannot fine anybody and has no inspectorate with a statutory footing, so its whole leverage is the right to use the mark and the company of the other members. That is why such schemes are often stricter than the law on paper and slower than the law in practice, since throwing out a famous name is a public act with consequences in both directions."),
]
