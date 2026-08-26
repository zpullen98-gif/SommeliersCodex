"""Rank II rewrite - Wine Trade & Aging (27 questions: 10 MC, 17 short answer).

Certified level. The subject is the fine-wine market and the craft of keeping,
seen from outside the cellar door: what a buyer, a cataloguer and a broker can
observe and decide. The saleroom's arithmetic and the exchange's standing
market; the toolkit that catches an invented bottle; the bond that lets a case
trade for decades without moving or being taxed; the fill of an old bottle read
as evidence; the drinking window read as a trajectory rather than a date; and
the formats, lists and futures logic that decide who gets scarce wine at all.

Boundaries were read before writing and are kept. Rank II Bordeaux owns La
Place, en primeur and the courtier-negociant chain, so futures appear here only
generically, and the question asked about them is the buyer's exposure rather
than the machinery. The business category in this wave owns the venue's own
economics, so nothing here prices a list or pours a glass. Rank II Wine
Fundamentals owns the chemistry of aging, so bottles here develop, shut down,
fade and vary without a molecule being named; what is tested is the verdict a
taster or a trader reaches, not the reaction underneath it. Classifications &
Labels owns the cellar register and the law of ageing words. Rank I Label
Reading owns the branded cork, the bubble seal and the magnum's identity, so
none of those tasks is repeated here; where this category meets the same
objects it asks a different question of them.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards, by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and
were verified by executing a probe script rather than by eye: every displayed
answer, several natural phrasings of it, and every wrong answer that could be
named were run through the grader. ex=True is applied where a REAL and
DIFFERENT thing extends or inverts the right answer under containment: the
total invoice extends the hammer price, a duty-paid warehouse extends the
bonded one, "original market value" extends market value, and a waiting list is
adjacent to but not the mailing list.

Where the whole discriminating content of an answer is one word inside a longer
phrase - WHICH counterparty fails, WHICH point the fill is measured from - the
list carries no entry that leaves that word out, whether the list is exact or
not. Containment cannot see a word that has been swapped, so a bare "insolvency"
grades the auction house's, and a bare "in centimetres" grades a reading taken
from the shoulder the question has just ruled out. The entries that survive all
name the merchant, or all name the cork.

TWO LESSONS ARE WRITTEN INTO THE LISTS BELOW, both learned by execution.

First, the reverse-containment branch is a second mouth for the same defect. An
input sitting INSIDE an accept entry grades once it reaches 0.6 of that entry's
words, so a three-word entry hands the mark to its own two-word fragment:
"it is closed" graded bare "it is", and "making fake wine" would have graded
bare "fake wine". Removing a bad entry is not enough if the replacement can be
truncated back to it.

Second, and the more expensive of the two: ex=True is NOT the general repair.
It converts an open class of correct answers into a closed enumeration, and a
pass that reached for it here marked knowledgeable students wrong - "the wine
merchant fails" and "the merchant collapses", the phrasing the futures question
prints in its own explanation, both rejected. Where the class is open the entry
is a '~' one. matchSA tests a tilde BEFORE the ex guard and grades any answer
CONTAINING the whole phrase, so ex=True still kills the bare word and the
truncation while every qualifier a student might add stays free. The one rule
is that a tilde is never a single word: "~port" grades "tawny port", and
lib.loose_tilde_problems fails the build on it. Two words or more is the tool.

A false reject is worse than the echo it closes. A student who knows the answer
and is told they are wrong learns something false; a student who scores by
copying the question merely gains a point they did not earn.

Facts are restricted to ones that do not drift: the ullage scale's conventions,
the logic of bond, premium and brokerage, and trade practice old enough to have
a vocabulary. No prices, no named houses or platforms, no percentage of the
market, and the only figures anywhere are the premium's rough fifth-to-quarter
and the centimetre readings of a Burgundy fill, both conventions of
description rather than statistics.
"""

from lib import Q, SA

CAT = "Wine Trade & Aging"
SLUG = "r2-wine-trade-aging"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("The saleroom and the exchange", 6),
    ("Counterfeits and the authentication toolkit", 5),
    ("Bond, storage and trading in place", 5),
    ("Ullage and the old bottle", 4),
    ("Windows, peaks and what improves", 4),
    ("Formats, lists and futures beyond Bordeaux", 3),
]

BANK = [
    # ---------------------------------- The saleroom and the exchange (6) ----
    Q("The saleroom and the exchange",
      "Selling a case of a blue-chip vintage, a merchant weighs entering it in an auction against posting an offer on the trade's exchange. What does the exchange route give that the saleroom cannot?",
      ["A standing market: the case can be offered at the merchant's own price on any day of the year",
       "A guaranteed buyer, because the exchange itself takes in any case that fails to find a bid within the month",
       "A wider audience, since exchanges are open to the public while salerooms admit only registered trade buyers",
       "An immediate cash advance, secured against the case while it waits to sell"], 0,
      "An exchange holds standing bids and offers the way a stock market does, so a seller names a price and waits for it to be lifted, with no consignment deadline, no sale calendar and a flat transaction charge. The saleroom's strengths run the other way: theatre, a worldwide audience gathered on one afternoon, and the chance that two bidders push each other past any listed price."),
    Q("The saleroom and the exchange",
      "Offered a parcel by a private client, one firm pays the same week and takes the cases into its own stock; another circulates the offer to its customers and pays the client only when a buyer signs. What is the second firm doing?",
      ["Broking the parcel: it never takes ownership, earns a commission on the sale, and leaves the waiting and the price risk with the seller",
       "Consigning it to auction on the client's behalf, with a reserve set at the level of the first firm's offer",
       "Underwriting it, guaranteeing the client a floor price whatever a buyer eventually pays",
       "Warehousing it, charging rent until the market catches up with the asking price"], 0,
      "A merchant buys stock outright, so the client is paid at once and the firm's margin is whatever the market later allows; a broker sells first and settles after, keeping a cut without ever owning a bottle. The broker's client usually nets more and always waits longer, and the merchant's client trades a slice of the price for certainty and speed."),
    SA("The saleroom and the exchange",
       "The seller's settlement from a saleroom is built down from the figure at which the bidding stopped, and the buyer's invoice is built up from the same figure. What is that figure called?",
       "The hammer price",
       # No '~' here, deliberately. The wrong answer this ex=True guard exists
       # for is the total invoice, and "the hammer price plus the buyer's
       # premium" contains the phrase, so a "~hammer price" entry would grade
       # the one answer the question is testing against. The sentence forms are
       # written out instead.
       ["hammer price", "hammer prices", "hammer", "final hammer price",
        "its hammer price", "the hammer price of the lot", "the hammer figure",
        "it is the hammer price", "it's the hammer price",
        "that is the hammer price", "knock down price", "knockdown price"],
       "Everything in an auction settles around it: the seller is typically paid it minus the house's selling commission, and the buyer pays it plus the house's charges, so the number called out in the room is usually one that neither side pays or receives exactly. Estimates and reserves are quoted against it too, which is why one lot can be honestly reported at three different figures: what the room heard, what the seller banked and what the buyer finally paid.",
       ex=True),
    SA("The saleroom and the exchange",
       "A winning bid of ten thousand becomes an invoice for twelve and a half before delivery has even been arranged. Name the charge that grew it.",
       "The buyer's premium",
       ["buyer's premium", "buyers premium", "buyer premium", "premium",
        "premiums", "buyer's premiums", "buyers premiums",
        "the auction house's premium", "auction house premium",
        "the auction house's buyer's premium", "auction premium",
        "the house's premium", "the house premium",
        "it is the buyer's premium", "it's the buyer's premium",
        "that is the buyer's premium"],
       "It is the house's charge to the winning bidder, added as a percentage on top of the bid, and at the major houses it runs to a fifth or a quarter of it. Comparing an auction result against a merchant's list price without adding it on is the classic way to overstate what the saleroom saves.",
       ex=True),
    SA("The saleroom and the exchange",
       "One word on a catalogue page carries where a bottle has spent its life, in whose hands and in what conditions, and it moves the price more than the tasting note beside it. Give the word.",
       "Provenance",
       # The possessive forms are '~' entries because as plain ones they are
       # three words to the engine ("wine s provenance"), and the
       # reverse-containment branch then graded the bare two-word fragments
       # "the wine's" and "the bottle's". A tilde wants the whole phrase.
       ["provenance", "its provenance", "good provenance",
        "documented provenance", "~the wine's provenance",
        "~the bottle's provenance", "~provenance of the bottle"],
       "It is the record of custody and keeping: who bought the bottle, where it lay, how it travelled. Two physically identical bottles can part on price several times over on the strength of that record, because storage cannot be tasted in advance and the written history is the only forecast a buyer gets without pulling the cork."),
    SA("The saleroom and the exchange",
       "Back vintages released by the producing estate itself, having never left its own walls, are listed under a hyphenated term that reliably commands a premium. Give the term.",
       "Ex-cellar",
       ["ex cellar", "ex cellars", "ex cellar release", "ex cellar stock",
        "released ex cellar", "sold ex cellar",
        # Normalises to "ex" (chateau and domaine are engine stopwords), so
        # this one entry exact-matches ex-chateau and ex-domaine alike. Do not
        # also add "ex domaine": it normalises identically and accept_problems
        # flags the duplicate. Known and accepted quirk: the bare input "ex"
        # also exact-matches this entry, and nothing else does (two characters
        # is below every containment threshold), so it is left to stand.
        "ex chateau"],
       "The premium is for certainty: the storage history is a single line, the labels and corks are beyond argument, and the market has had no chance to substitute or damage anything. Estates have learned to bank that certainty, releasing old vintages in measured parcels at prices the trade reads as the wine's new floor."),

    # ----------------------- Counterfeits and the authentication toolkit (5) --
    Q("Counterfeits and the authentication toolkit",
      "Under a loupe, the label of a supposed 1920s bottle resolves into the tidy rosette of dots a modern press lays down. What has the examiner established?",
      ["That the label was printed by a modern process never used on wine labels of the claimed era",
       "That the paper was artificially aged, regular dots being the mark bleach leaves as it breaks down the fibres of a modern sheet",
       "That the ink has faded evenly, which is what six decades in a dark cellar produces",
       "That the label is a legitimate replacement, reissued by the estate for damaged stock"], 0,
      "Labels of that era were printed by letterpress or stone lithography, which lay down solid areas of ink; the even rosette of dots is the mark of modern offset and digital presses, which wine labels only met decades later. The finding condemns the label absolutely and the bottle almost as surely, since a genuine bottle has little reason to wear paper from the wrong half of the century, and it is the kind of physical evidence no story about the wine can argue with."),
    Q("Counterfeits and the authentication toolkit",
      "A magnum surfaces carrying a celebrated estate's label and a vintage twenty years before the estate's own records show it first made that wine. What has the check against the records established?",
      ["That the bottle is a fake, since the wine it claims to be was never made",
       "That a lost bottling has surfaced, ledgers of that era being too patchy to prove a negative",
       "That the label has merely been misdated, leaving the wine inside above suspicion",
       "That an old cellar mix-up occurred, the magnum having been dressed in a neighbouring estate's labels before shipping"], 0,
      "A producer's own registers are the one reference a forger cannot fully study in advance, and a vintage that predates the wine's existence is the cleanest verdict there is: no tasting, no laboratory and no argument. Several celebrated counterfeiting cases broke on exactly this check, on large formats of vintages the estate never bottled in that size or never made at all."),
    SA("Counterfeits and the authentication toolkit",
       "Ends of service in serious restaurants can finish with the night's grandest empties scored, smashed or stripped before the bins go out. What use is being denied to somebody?",
       "Refilling them as counterfeits",
       # The stem asks what USE is denied, so every entry names one. The bare
       # category nouns carried here before ("fakes", "counterfeit",
       # "counterfeiting", "forgery", "fake wine") named no use at all, and all
       # of them are live on the page two questions earlier, whose key calls a
       # bottle a fake and whose explanation talks about counterfeiting cases.
       # The verb forms replace them, and cannot be reached by a student who has
       # only read the block heading.
       #
       # The first repair wrote only the "making X" family and lost the
       # "to make X" and "for X" families with the bare nouns, so "using them to
       # make fakes" and "for counterfeiting" - answers that name a use, which
       # is exactly what the stem asks for - were marked wrong. The '~' entries
       # carry them back. A tilde grades only an answer containing the whole
       # phrase, so it can never be truncated to the bare noun the way a plain
       # entry can: "fakes" does not contain "to make fakes".
       ["refilling them as counterfeits", "refilling", "refilling them",
        "refills", "refilled", "being refilled", "refilling them with lesser wine",
        "refilling with cheap wine", "counterfeit refills",
        "refilling and reselling", "passing them off refilled",
        "making fakes", "making counterfeits",
        # "making fake wine" at three words would have handed the mark back to
        # bare "fake wine", which sits inside it above the 0.6 word ratio the
        # reverse-containment branch applies. At five words the fragment fails
        # the ratio and the full phrasing still grades.
        "making fake wine from them", "making counterfeit wine from them",
        "~to make fakes", "~to make counterfeits", "~to make fake wine",
        "~to make counterfeit wine", "~to fake wine", "~to counterfeit wine",
        "~for fakes", "~for counterfeits", "~for counterfeiting",
        "~for faking", "~for making fakes", "~for making counterfeits",
        "~refill and resell", "~refill them"],
       "A convincing fake starts from a genuine bottle, and an intact empty of a great name, its label and capsule undamaged, is worth real money to the wrong buyer. Defacing the shell costs the restaurant nothing and removes the raw material, which is why some cellars log and destroy their empties as carefully as they logged the full bottles in."),
    SA("Counterfeits and the authentication toolkit",
       "Before a large cellar is catalogued, a specialist walks it bottle by bottle, noting fills, labels, capsules and cases. Name the document that comes out of that visit.",
       "A condition report",
       ["condition report", "condition reports", "inspection report",
        "condition notes", "cellar condition report", "condition survey",
        "report on condition"],
       "Every serious sale rests on it: the catalogue's fill levels, label descriptions and case notes are lifted from that inspection, and the buyer's remedies afterwards reach only as far as what it disclosed. It is also the moment doubtful bottles are quietly pulled, because a house's name suffers more from one fake sold than from a hundred lots declined."),
    SA("Counterfeits and the authentication toolkit",
       "Sixty years old yet filled high into the neck, a bottle escapes suspicion because its back label records a visit to the estate, where it was opened, assessed, brought back to level and resealed. What is that service called?",
       "Reconditioning",
       ["reconditioning", "reconditioned", "being reconditioned", "recorking",
        "recorked",
        # engine_norm turns "re-corking" into "re corking", so the hyphenated
        # spellings (Penfolds brands it the Re-corking Clinic) need entries in
        # this normalised form.
        "re corking", "re corked",
        "a recorking clinic", "recorking and topping up",
        "topping up and recorking", "estate reconditioning"],
       "A few estates run clinics for exactly this, certifying what they refresh, and an honest catalogue always says when a bottle has been through one. Opinion divides on the result: the level and the seal are renewed, but a little young wine has entered an old bottle, and some buyers discount the intervention more steeply than they would have discounted the risk."),

    # ---------------------------- Bond, storage and trading in place (5) -----
    Q("Bond, storage and trading in place",
      "Priced side by side, a case at 800 in bond and the same case at 990 with taxes paid are nearer in true cost than the gap suggests. What narrows it?",
      ["Duty and sales tax fall due on withdrawal, so the saving is real only for a buyer who sells on in bond",
       "Storage and insurance charges on the bonded case, which mount year after year until they have swallowed the whole of the difference",
       "Nothing narrows it, wine in bond being the cheaper route in every circumstance",
       "The taxes-paid price includes insurance and delivery, which the warehouse bills separately"], 0,
      "In bond means the case has never had duty or sales tax paid on it, and both charges crystallise the moment it is withdrawn, calculated at whatever rates then apply. For a buyer who means to drink the wine the two offers are nearly level; for one who may resell, the untaxed case is worth more, because the next buyer inherits the same deferral and an export never triggers the charges at all."),
    Q("Bond, storage and trading in place",
      "Three owners in a decade, and the case has never once left its rack: the trade counts that a virtue. Why?",
      ["Every journey risks heat, shock and a break in the storage record, so ownership moves across the keeper's books while the wine sits still",
       "Wine sold at auction may not travel until every earlier owner has signed off its release, which can take years",
       "Moving a case voids the insurance under which the first owner stored it, and cover cannot be cheaply rebought",
       "Each move triggers a fresh round of duty, so a case that travels is taxed three times over"], 0,
      "A case is a physical object whose value rests partly on how it has been kept, so the fewer vans and hands it meets the better, and a keeper who records each change of owner lets title move while the wine does not. Staying put also keeps the storage history unbroken under one roof, which is precisely the thing the next buyer will pay for."),
    SA("Bond, storage and trading in place",
       "A case can lie for thirty years under a roof the revenue treats as though it were outside the country, its keeper standing surety for the tax on everything stored there. Name the building.",
       "A bonded warehouse",
       # "bond", "in bond" and "wine bond" were carried here and had to go.
       # None of them names a building, and all three are printed two questions
       # earlier, in the stem, the key, a distractor and the explanation of the
       # in-bond pricing question, so the list was grading a student who had
       # only read that page back. The stem was rewritten for the same reason,
       # since it used to state that pricing question's key outright. Nothing in
       # the stem may echo the list either: "customs warehouse" is still taken,
       # so the stem says revenue rather than customs.
       # '~' rather than a plain enumeration under ex=True, so every way of
       # qualifying the building grades without each one having to be written
       # down: "a government bonded warehouse", "it is a bonded warehouse", "an
       # excise bonded warehouse". The wrong answer the ex guard exists for is
       # the duty-paid warehouse, and no phrase here appears in it.
       ["~bonded warehouse", "~bonded warehouses", "~bonded wine warehouse",
        "~customs warehouse", "~excise warehouse", "~bonded store",
        "~bonded storage", "~bonded warehousing", "freeport", "free port"],
       "The name is literal: the keeper's bond is a guarantee lodged with the revenue, and behind it the duty and sales tax sit as a liability carried by the case rather than a cost already paid. A sale from one account to another inside the walls hands that liability on with the wine, which is why so much fine wine spends its entire life under one roof, changing hands on paper and never on a pallet.",
       ex=True),
    SA("Bond, storage and trading in place",
       "After a warehouse fire, a collection insured for what it originally cost cannot be rebought at today's prices. Which basis should the policy have been written on?",
       "Replacement value",
       # "replacement" is the discriminating word, so the phrases carrying it
       # are '~' entries and every qualifier is free. The market-value family
       # stays exact: ex=True is here because "original market value" - the
       # basis the question rules out - extends "market value" under
       # containment, and a tilde on that phrase would grade it.
       ["~replacement value", "~replacement cost", "~replacement price",
        "market value", "current market value", "today's market value",
        "todays market value", "current market price", "market price",
        "today's market price", "todays market price",
        "present market value", "current value", "market valuation",
        "current market valuation", "todays value", "today's value"],
       "Fine wine appreciates, so a policy indexed to old invoices is quietly underinsured a little more each year, and the gap surfaces on the worst possible day. Professional storage policies track a market valuation and move with it, which is why insurers ask for a cellar to be revalued from time to time rather than merely listed once.",
       ex=True),
    SA("Bond, storage and trading in place",
       "Listings compress it to three letters, and twelve bottles still in one outsell the same twelve repacked into cardboard. What do the letters OWC stand for?",
       "Original wooden case",
       ["original wooden case", "original wood case", "original wooden cases",
        "in its original wooden case", "its original wooden case"],
       "The branded case is part of the object: it protects the bottles, carries the estate's marks, and implies the parcel has stayed together and undisturbed since it left the property. Auction convention states it in the catalogue line, and a case broken up or repacked surrenders a measurable slice of the price."),

    # --------------------------------------- Ullage and the old bottle (4) ---
    Q("Ullage and the old bottle",
      "Forty years from the vintage, four bottles of one claret show fills at base of neck, top shoulder, mid shoulder and low shoulder. Which one does the trade refuse, and why?",
      ["Low shoulder, loss on that scale pointing to a failed cork rather than to age",
       "Base of neck, a fill that high after forty years being possible only in a bottle that has been opened and topped back up",
       "Top shoulder, any fill below the base of the neck meaning the seal has already given way",
       "Mid shoulder, the halfway mark on the scale being where buyers draw the line whatever the age"], 0,
      "Gentle loss is the normal work of four decades, so base of neck is excellent, top shoulder unremarkable, and even mid shoulder within the range a cataloguer will describe rather than reject. Low shoulder is different in kind: that much wine has not slipped slowly past a sound cork, it has escaped past a failing one, and air has been taking its place the whole time."),
    SA("Ullage and the old bottle",
       "Catalogues grade every mature lot by the gap that has opened between the bottom of the cork and the surface of the wine. What is the gap called?",
       "Ullage",
       ["ullage", "its ullage", "ullage level"],
       "The word covers both the space itself and the scale of descriptions built on it, and a little of it is the expected cost of decades under cork. What a cataloguer actually reads is the rate: a level normal for fifty years is alarming at fifteen, and two bottles of one vintage with very different levels have led different lives."),
    SA("Ullage and the old bottle",
       "Slope-shouldered bottles give the shoulder scale nothing to point at, so the fill of an old Burgundy is reported another way. How?",
       "In centimetres below the cork",
       # Every entry names the point the reading is taken FROM. A bare unit
       # ("in centimetres", "in cm") was carried here and had to go: the list
       # grades by containment, so it also graded "top shoulder in centimetres"
       # and "in centimetres below the shoulder", which reinstate the very scale
       # the stem rules out. The unit is not the discriminating content and a
       # bare unit is not a complete answer, because a Bordeaux fill can be
       # given in centimetres too; the cork is what makes the answer right.
       ["in centimetres below the cork", "centimetres below the cork",
        "in centimeters below the cork", "centimeters below the cork",
        "cm below the cork", "in cm below the cork",
        "centimetres from the cork", "centimeters from the cork",
        "cm from the cork", "distance below the cork", "distance from the cork",
        "as a distance below the cork",
        # '~' on the four-and-more-word forms, because as plain entries they
        # graded their own three-word fragments: "below base of", "centimetres
        # of", "of ullage" and "cm of" all scored, and the first of those is the
        # normalised form of a run printed in the ullage question's WRONG
        # option ("any fill below the base of the neck"). The full phrasings all
        # still grade, since a tilde matches the whole phrase wherever it sits.
        "~below the base of the cork", "~from the base of the cork",
        "~centimetres of ullage", "~centimeters of ullage", "~cm of ullage",
        # Written out in full rather than as "ullage in centimetres": at three
        # words that entry would have let the bare unit back in through the
        # reverse-containment branch, which takes an input sitting inside an
        # accept entry once it reaches 0.6 of its words.
        "ullage in centimetres below the cork", "ullage in cm below the cork",
        # The natural word order with the verb in the middle, which none of the
        # entries above reaches: "in centimetres, measured below the cork" puts
        # a word between the unit and the point, so no run above sits inside it.
        # It graded before the bare unit was removed and has to be carried
        # deliberately now. A '~' rather than a plain entry, because a plain one
        # would offer the reverse-containment branch a fresh set of fragments;
        # the tilde grades only an answer holding the whole phrase, and it names
        # the cork, which is the test every entry here has to pass.
        "~measured below the cork", "~measured from the cork"],
       "A Bordeaux bottle's straight shoulder gives the scale its named stations, and a Burgundy has none, so the trade states the plain distance from the base of the cork to the wine. Up to three centimetres is unremarkable in a mature bottle, four or five earns a cautionary note, and beyond that the price is expected to answer for the risk."),
    SA("Ullage and the old bottle",
       "Same case, same cellar, ten years on: one bottle sings and its neighbour is tired, and an old trade saying blames the bottles rather than the wine. Name the phenomenon.",
       "Bottle variation",
       # The long forms are '~' entries. As plain ones they handed the mark to
       # their own fragments, and one of those fragments was "bottle by bottle",
       # printed word for word in the condition-report question's stem two
       # blocks earlier. A tilde grades the phrase and not the piece of it.
       ["bottle variation", "bottle variance", "~bottle to bottle variation",
        "~bottle by bottle variation", "~variation between bottles",
        "~variation from bottle to bottle"],
       "Corks are natural and individual, so every bottle has been running its own experiment down the years, and the differences compound with age. It is why the saying goes that there are no great old wines, only great old bottles, and why a serious tasting of an old vintage opens several and judges the wine on the best of them."),

    # --------------------------------- Windows, peaks and what improves (4) --
    Q("Windows, peaks and what improves",
      "Beside its score for a young Medoc, a critic prints the range 2030-2055. What is that range actually claiming?",
      ["An estimate of the years in which the wine should show its best, revisable as it evolves",
       "A warranty that the wine remains sound until the second date printed, and turns undrinkable once that year has passed",
       "The span during which the producer has undertaken to replace any bottle that turns out corked",
       "The period in which the vintage may lawfully be resold at auction"], 0,
      "A window is a forecast of trajectory: when the structure should have knitted, how long the fruit should hold, and when the balance is likeliest to please. Critics revise them at re-tastings, sometimes by a decade, and a wine at the far edge of its window has not expired; it has merely entered the years in which decline becomes the way to bet."),
    Q("Windows, peaks and what improves",
      "Twenty years into a case, the fruit is drying out while the tannin still rasps. What should the owner conclude about the bottles that remain?",
      ["Drink or sell them now, because lost fruit does not come back and the structure will outlast what is left of it",
       "Hold them for another decade at least, tannin that still rasps being the surest sign that the wine has not yet arrived in its drinking window",
       "Decant the next bottle for several hours, the rasp being travel shock rather than maturity",
       "Serve the next bottle warmer, since tannin always reads harder in a cold glass"], 0,
      "Maturity is a race between the softening of structure and the fading of fruit, and once the fruit is losing there is nothing later years can add: tannin outliving flavour is the classic profile of a wine going downhill. The response is commercial as much as sensory, because the market pays for wine approaching its best years and discounts wine leaving them."),
    SA("Windows, peaks and what improves",
       "Midway between vibrant youth and mature complexity, a serious red can spend years offering hardly any aroma at all. What does the trade call that stretch?",
       "The dumb phase",
       ["dumb phase", "dumb period", "dumb stage", "its dumb phase",
        "closed phase", "closed period", "closed stage", "shut down phase",
        # The sentence forms are '~' entries, not plain ones, and the difference
        # is the whole point. As a plain entry "it is closed" is three words, so
        # the reverse-containment branch took the two-word input "it is" and
        # marked it correct - two of the commonest words in English scoring full
        # marks. "The wine is closed" did the same for "wine is". A tilde grades
        # only an answer holding the whole phrase, so the sentence still counts
        # and the fragment does not.
        "~it is closed", "~it's closed", "~its closed",
        "~wine is closed", "~bottle is closed",
        "it has shut down", "closed down", "awkward phase",
        "adolescent phase", "the sulk", "sulking"],
       "Primary fruit recedes before the rewards of age arrive to replace it, and in that trough the wine can taste of remarkably little without anything being wrong. Opening a great vintage during the sulk is the classic way to conclude, wrongly, that it was overrated, which is why the windows on serious wines often start a surprising number of years out."),
    SA("Windows, peaks and what improves",
       "Built to repay keeping rather than to charm on release, such a wine goes under a three-word French term every buyer of fine lists knows. Give the term.",
       "Vin de garde",
       ["vin de garde", "vins de garde"],
       "The phrase means a wine for keeping, and it marks out the minority built with the concentration and structure to be better in ten years than now. Its opposite number is the wine made for the year of its release, which does not improve however carefully it is stored: cellaring can only ripen what was put in the bottle to begin with."),

    # ----------------------- Formats, lists and futures beyond Bordeaux (3) --
    Q("Formats, lists and futures beyond Bordeaux",
      "Opened together at twenty years, the half bottles of a vintage are fading while the magnums are barely ready. What explains the spread?",
      ["Cork and headspace hardly change with bottle size, so the smaller volume feels their influence sooner",
       "Half bottles spend more of their lives standing upright on shelves and in fridges, and standing up wears a wine out early",
       "Magnums are traditionally filled from the best barrels in the cellar, a custom the leading estates keep to this day",
       "Thicker magnum glass shuts out light and temperature swings entirely"], 0,
      "Every size is stoppered with much the same cork over much the same gap of air, so the ration of air per litre shrinks as the format grows, and the wine in a magnum has more of itself to share the work across. That is why large formats are the collector's choice for the long haul, and why halves are opened early to find out what a vintage has in it."),
    SA("Formats, lists and futures beyond Bordeaux",
       "Certain Californian cellars sell nothing through shops: a customer waits years to be offered a place, and once admitted must take up every release or lose the spot. What is the customer's name finally on?",
       "The mailing list",
       # "the list" had to go: engine_norm drops the article, so it exact-matched
       # bare "list" and "a list" and handed the mark to a student holding the
       # waiting-list model that the ex=True guard exists to reject. Every entry
       # now spells out whose list it is or what kind.
       #
       # Written as '~' entries so the whole class stays open under ex=True:
       # "the estate's mailing list", "their mailing list" and "it is the
       # mailing list" all contain the phrase and grade, while "the waiting
       # list" and bare "list" do not contain it and reject. That is what a
       # tilde buys over an enumeration - the qualifier is free and the swap is
       # still fatal.
       ["~mailing list", "~mailing lists", "~allocation list"],
       "The list is the whole route to market for the American cult wine: no merchant, no shelf, just an offer sent to each name and a file of hopefuls waiting for a name to drop off. Skipping a release forfeits the place, which is how weak vintages sell out as quickly as great ones, and a spot on the best lists has itself become something collectors boast of.",
       ex=True),
    SA("Formats, lists and futures beyond Bordeaux",
       "Money handed over long before the bottles exist can be lost without the price ever moving. Which failure does a futures buyer actually need to fear?",
       "The merchant's insolvency",
       # WHICH party fails is the entire content of the answer, and the failure
       # word is not. The bare failure words ("insolvency", "bankruptcy",
       # "liquidation", "administration", "goes bankrupt") were carried here and
       # graded by containment, so they marked right the student who feared the
       # auction house, the shipping line, the estate or even their own
       # bankruptcy. "The firm going bust" went for the same reason: it also
       # matched inside the storage firm's failure.
       #
       # ex=True is what removes them, because a pruned plain list is not
       # enough: chateau and domaine are engine stopwords, so "the chateau going
       # bankrupt" normalises to "going bankrupt", which sits inside "merchant
       # going bankrupt" at two words of three and is taken by the
       # reverse-containment branch. Deleting the actor works as well as
       # swapping it, and only exact matching sees the difference.
       #
       # But ex=True ALONE closed an open class and marked knowledgeable
       # students wrong: this answer has no fixed wording, only a fixed party.
       # "The wine merchant fails", "the merchant collapses" (the phrasing this
       # question's own explanation uses) and "the merchant's insolvency before
       # delivery" all rejected under a bare exact list. Hence the '~' entries
       # below. matchSA tests a tilde BEFORE it reaches the ex guard, and grades
       # any answer CONTAINING the whole phrase, so the phrase that has to
       # appear is the one naming the party. Every qualifier a student might add
       # is then free, while "the auction house's insolvency" still rejects
       # because no accepted phrase survives the swap. Never write one of these
       # as a single word: "~merchant" would grade any answer mentioning a
       # merchant at all, and lib.loose_tilde_problems fails the build on it.
       [
        # The possessive sweep. engine_norm turns "merchant's" into "merchant s",
        # so this one entry carries insolvency, bankruptcy, failure, collapse,
        # liquidation, administration, receivership and "the merchant's firm
        # going bust" together.
        "~merchant's", "~seller's", "~counterparty's",
        # The party named without the possessive.
        "~merchant insolvency", "~merchant insolvent", "~merchant bankruptcy",
        "~merchant bankrupt", "~merchant failure", "~merchant liquidation",
        "~merchant administration", "~merchant receivership",
        "~merchant collapse", "~merchant default",
        "~merchants insolvency", "~merchants bankruptcy", "~merchants failure",
        "~merchants collapse",
        "~seller insolvency", "~seller bankruptcy", "~seller failure",
        "~seller collapse", "~seller default",
        "~counterparty insolvency", "~counterparty bankruptcy",
        "~counterparty failure", "~counterparty collapse",
        "~counterparty default", "~counterparty risk",
        # The party named with a verb. "~merchant going" carries bust, bankrupt,
        # under, into liquidation, into administration and into receivership at
        # once, which is why the verb families are cut this short.
        "~merchant going", "~merchant goes", "~merchant becoming",
        "~merchant becomes", "~merchant fails", "~merchant failing",
        "~merchant collapses", "~merchant collapsing", "~merchant defaults",
        "~merchant defaulting", "~merchant folds", "~merchant folding",
        "~merchant ceasing",
        "~seller going", "~seller goes", "~seller becoming", "~seller becomes",
        "~seller fails", "~seller failing", "~seller collapses",
        "~seller collapsing", "~seller defaults", "~seller defaulting",
        "~counterparty going", "~counterparty goes", "~counterparty fails",
        "~counterparty failing", "~counterparty defaults",
        "~counterparty defaulting",
        # The party named after the failure, or qualified before it.
        "~of the merchant", "~of the seller", "~wine merchant",
        "~merchant you paid", "~merchant i paid"],
       "Until specific cases are identified as the buyer's property, the money is only an unsecured claim on the firm, and wine ordered but never segregated goes into the pot for all the creditors. Merchant collapses have burned futures buyers in exactly this way, which is why the careful ones ask where their wine will lie, and in whose name, before they pay.",
       ex=True),
]
