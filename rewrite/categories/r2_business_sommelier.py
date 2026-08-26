"""Rank II rewrite - Business of the Sommelier (28 questions: 8 MC, 20 short answer).

Certified level, and the subject is the venue's own profit and loss: what a
bottle costs, what its sale banks, and where the cash sleeps between the two.
The running order follows the money. First the arithmetic of cost percentage
against cash margin, then the markup architecture that prices a list and a
pour, then the cellar read as capital rather than as romance, then the page
itself as a selling instrument, then the glass programme with its losses and
the equipment that repays them, and last the relationships and the ledger
lines - the scarce cases, the training hour, the comp and the bottle nobody
can account for.

Boundaries were read before writing and are kept. Service & Hospitality owns
everything at the table and already asks for par, FIFO, corkage, the beverage
cost ratio by name and the preservation devices as objects, so nothing here
asks a student to name any of those; this category makes them do the sums and
the reasoning instead, and no stem hands a sibling's answer over. The market
outside the venue - auctions, provenance, investment - belongs to the trade
category in this same wave, so every question stays inside the building.
Label law stays with Classifications & Labels. No producer, no venue and no
current market price is named anywhere: every figure is invented, clean and
chosen so the arithmetic is the durable part.

Written from the syllabus below. The imported bank was not read while writing;
it is read only afterwards, by check-similarity.py.

Accept lists are built against lib.match_sa, a port of core.js matchSA, and
were run rather than eyeballed. Every numeric answer carries ex=True and no
'~' entry at all, because a threshold graded by containment reads the
same in both directions, and each ex list was then widened until digits,
words, currency forms and the natural spoken phrasings of its own answer all
still grade. ex=True also sits on the two accounting terms a real different
term extends - gross profit against gross profit percentage, working capital
against the working capital ratio - and on the second-cheapest slot, where
probing found the reverse hazard: matchSA also matches when the INPUT sits
inside an accept entry, so 'the cheapest bottle' graded against 'second
cheapest bottle' until the list went exact. The same probing separated
wastage from shrinkage: the first is counted and explained, the second is
precisely the loss that is not, so neither accept list may take the other's
word.

Two answers that are phrases rather than terms carry ex=True with '~' carriers,
and the reason is worth recording, because the obvious repair was tried first
and was wrong. A phrase graded by plain containment can be reversed by putting
a verb in front of it: 'stop buying the rest of the book' and 'cut staff
training' both contain the accepted phrase. Bare ex=True closes that, and it
also closes an OPEN class of correct answers, because a phrase answer arrives
with a subject, a modal and a verb in front of it in most of what a student
actually types, and no enumeration reaches the end of that cross product.
Measured: 68 correct phrasings graded before and were rejected after, among
them 'keep buying the rest of the book', 'buy the whole book', 'training our
staff' and 'more staff training'.

The tool that does the job is the '~' branch, which core.js checks BEFORE ex is
consulted, so a tilde entry keeps whole-phrase containment while every
bare-word and truncation match stays shut. Both lists therefore carry
multi-word '~' entries for the noun cores a correct answer is built on, and
plain exact entries for the terse forms whose normalised shape is a single
word. The reversals the engine can see are still refused, since the '~' branch
consults the same exclusion guard: don't, do not, never, no, stop buying,
refuse to, avoid buying, cease buying and decline to. The reversing verbs that
guard cannot see, quit and reduce and resist and cut back, are left open
deliberately. They are an engine matter rather than an accept-list one, and
closing them from the accept list cost all 68 of those correct answers; a
student who knows the answer and is told they are wrong is much the worse of
the two failures.

Single-word '~' entries appear nowhere. Those are the trap
lib.loose_tilde_problems exists to fail the build on, which is why bare
'training' is an exact entry and not a tilde: as a tilde it would grade 'guest
training' and 'training is a waste', and both stay refused.

The gross-profit list no longer takes the bare word 'profit', and that one
costs nothing to close. The entry was already exact, so it could only ever
match 'profit' or 'the profit', both lifted straight out of the stem's 'profit
and loss'; it graded a student who supplied nothing. 'Gross' is the whole of
what that question tests.
"""

from lib import Q, SA

CAT = "Business of the Sommelier"
SLUG = "r2-business-sommelier"
PREFIX = "c"
RANK = "Rank II"
SOURCE = "data-questions.js"

SYLLABUS = [
    ("Cost percentage against cash margin", 5),
    ("Markup architecture and the price of a pour", 5),
    ("Inventory as trapped cash", 5),
    ("Engineering the list", 4),
    ("The glass programme and preservation economics", 5),
    ("Allocations, training and the ledger", 4),
]

BANK = [
    # ------------------------------ Cost percentage against cash margin (5) --
    Q("Cost percentage against cash margin",
      "Tonight's till holds two bottle sales: one cost the venue 20 and sold for 80, the other cost 100 and sold for 220. The second ran much the worse cost percentage. Why can the ledger still prefer it?",
      ["It banked 120 against the other bottle's 60, and profit is deposited as cash rather than as a percentage",
       "Its higher selling price lifts the night's average check, and average check is the number head office actually watches",
       "The percentage will right itself when the next vintage arrives at a lower landed cost",
       "Expensive bottles are customarily excluded from the beverage cost calculation"], 0,
      "A percentage cannot be banked. The cheap bottle ran a flawless 25 percent cost and left 60 behind; the dear one ran about 45 and left 120. Beverage programmes are judged by the first number and live on the second, and confusing the two is how a list ends up refusing money."),
    SA("Cost percentage against cash margin",
       "Landed at 18 a bottle, a wine sells from the list at 90. Give the cost percentage.",
       "20 percent",
       ["20 percent", "20", "20%", "20 per cent", "twenty percent",
        "twenty per cent", "twenty", "one fifth", "a fifth", "0.2"],
       "Cost divided by selling price: 18 over 90 is 20 percent. The steep multiple is typical of the cheap end of a list, and even so the sale leaves only 72 in cash, which is the other half of the story.",
       ex=True),
    SA("Cost percentage against cash margin",
       "Out of a 150 sale, the venue keeps the 110 left once the bottle's 40 cost is taken out. On the profit and loss, what is that 110 called?",
       "Gross profit",
       ["gross profit", "gross margin", "cash margin", "margin",
        "contribution", "contribution margin", "gross profit in cash",
        "gross cash margin", "gross profit line", "gp"],
       "Price minus cost is gross profit, and the qualifier carries the meaning: gross is what the beverage operation earns before wages and rent take their share, and the bare word on its own names no line at all. The cost percentage is the same arithmetic read the other way round, and only one of the two can be spent.",
       ex=True),
    SA("Cost percentage against cash margin",
       "Priced throughout at a 30 percent beverage cost, a list takes on a bottle landed at 24. What does it sell for?",
       "80",
       ["80", "$80", "80 dollars", "eighty", "eighty dollars", "80 a bottle",
        "eighty a bottle"],
       "Divide the cost by the target: 24 over 0.3 is 80. Pricing to a percentage is quick and consistent, which is why a buyer translates a case quote into list prices in their head before agreeing to anything.",
       ex=True),
    SA("Cost percentage against cash margin",
       "Quarter on quarter the beverage cost percentage creeps upward, yet cash profit climbs with it, and no price, pour or supplier changed. What shifted?",
       "The sales mix shifted toward dearer bottles",
       ["sales mix", "mix", "product mix", "sales mix shifted", "mix shifted",
        "sales mix moved", "mix moved", "shift in sales mix",
        "sales mix changed", "sales mix has changed", "mix changed",
        "mix has changed", "change in sales mix", "change in mix",
        "diners are trading up", "customers are trading up",
        "people are trading up", "customers bought more expensive wine",
        "sales mix shifted toward dearer bottles",
        "mix shifted toward dearer bottles",
        "sales mix shifted toward more expensive bottles",
        "mix shifted toward more expensive bottles", "guests traded up",
        "customers traded up", "people traded up", "diners traded up",
        "guests trading up", "customers trading up", "guests are trading up",
        "trading up", "traded up", "guests bought more expensive bottles",
        "guests buying dearer bottles", "diners bought more expensive bottles",
        "people bought more expensive wine", "bought more expensive bottles",
        "buying more expensive bottles", "buying more expensive wine",
        "selling more expensive bottles", "selling dearer bottles",
        "more expensive bottles", "dearer bottles"],
       "Nothing went wrong: guests traded up. Dearer bottles carry a higher cost percentage and a bigger cash margin, so a mix moving toward them lifts both lines at once. A percentage read without the cash line beside it punishes exactly the selling a venue most wants.",
       ex=True),

    # --------------------- Markup architecture and the price of a pour (5) --
    Q("Markup architecture and the price of a pour",
      "Under the commonest by-the-glass pricing rule, the first glass sold pays back what the venue gave for the whole bottle. What is the rest of the bottle doing?",
      ["Carrying the programme's spoilage risk and its profit, so even a half-dumped bottle breaks even",
       "Funding the complimentary tastes that convention obliges the venue to pour before a guest commits to any glass",
       "Nothing, because the rule is only used where local licensing forbids selling the same wine by the bottle",
       "Stepping up in price with every pour, so the last glass out of the bottle is the dearest"], 0,
      "The glass is priced at roughly the bottle's wholesale cost, so the first pour clears the outlay and every later one is gain. A bottle that only half sells before it tires has still done no damage, and that safety is what lets a venue open wine on speculation."),
    Q("Markup architecture and the price of a pour",
      "Glass by glass, a by-the-glass bottle brings in 70; the same wine sells whole from the list for 48. What earns the venue that premium?",
      ["It carries the whole risk of the open bottle, and the guest buys freedom from committing to a full one",
       "Duty and sales tax fall per serving rather than per bottle, and the difference is passed on",
       "Licensing floors set a minimum per-pour price above the bottle equivalent",
       "The glass list is deliberately overpriced to push guests toward bottles"], 0,
      "Per millilitre the guest pays more and risks less: two people can drink two different wines without owning 750 ml of either. The venue's side of the bargain is the open bottle, which may never sell another pour after tonight."),
    SA("Markup architecture and the price of a pour",
       "Four times cost at the bottom of the list, sliding down to twice cost at the top: on that scale, a bottle landed at 90 sits in the top band. Give its list price.",
       "180",
       ["180", "$180", "180 dollars", "one hundred and eighty",
        "one hundred eighty", "180 a bottle", "one eighty"],
       "Twice 90 is 180. The multiple falls as cost rises because a fine bottle at four times cost would sit unsold forever, while at twice cost its cash margin still dwarfs the house pour's. That slide is why the percentage worsens up a list while the money improves.",
       ex=True),
    SA("Markup architecture and the price of a pour",
       "Five 150 ml pours come out of a by-the-glass bottle that cost the venue 25, and the pours sell at 15 apiece. Give the pour cost percentage.",
       "33 percent",
       ["33 percent", "33", "33%", "33 per cent", "thirty three percent",
        "thirty three per cent", "thirty three", "one third", "a third",
        "about a third", "one in three", "33.3", "33.3%", "about 33 percent",
        "33.3 percent", "33.3 per cent", "33.33", "33.33%", "33.33 percent",
        "33.33 per cent"],
       "The bottle gives five pours, so one pour costs 5 and sells at 15: 5 over 15 is 33 percent. That 33 percent is only the pencil figure: realized pour cost runs higher, because the glass programme carries losses a sealed bottle never suffers.",
       ex=True),
    SA("Markup architecture and the price of a pour",
       "For flagship pours the usual deadline on getting a bottle's cost back is loosened, though only slightly. Within how many pours does the trade still expect that money home?",
       "Two pours",
       ["two pours", "two", "2", "2 pours", "two glasses", "2 glasses",
        "first two pours", "within two pours", "in two pours"],
       "One pour is the standard and two is the concession, granted when full recovery in a single glass would price the wine past anyone willing to try it. Past two, the cost is riding on pours nobody can promise, and a flagship bottle is exactly the one a venue cannot afford to guess about.",
       ex=True),

    # ------------------------------------------ Inventory as trapped cash (5) --
    Q("Inventory as trapped cash",
      "Without delisting a single wine, a buyer wants the cellar to swallow less of the venue's cash. Which change in purchasing achieves it?",
      ["Smaller orders placed more often, leaving the stock in the distributor's warehouse",
       "Quarterly drops big enough to earn case discounts, cutting the landed cost of every bottle",
       "Settling every invoice on delivery, so early-payment discounts offset the cost of the cellar",
       "Consolidating with one supplier, so a single monthly order replaces a dozen small deliveries"], 0,
      "Stock in the distributor's warehouse is the distributor's cash problem; stock in the cellar is the venue's. Frequent small drops trade a little discount away for weeks of freed cash, and most operators come out ahead on the swap."),
    SA("Inventory as trapped cash",
       "Nine bottles of a rose leave the shelf in an average week, deliveries land weekly, and the buyer wants a 3-bottle cushion in hand against a big Saturday. To what count should a delivery restore the shelf?",
       "Twelve bottles",
       ["twelve bottles", "twelve", "12", "12 bottles", "a dozen",
        "a dozen bottles"],
       "A week's sales plus the cushion: nine and three make twelve. Set the standing count higher and the extra bottles are money asleep; set it lower and one busy weekend empties the bin, and the wine is off the list until the truck comes back.",
       ex=True),
    SA("Inventory as trapped cash",
       "Holding 60,000 of stock at cost across the year, a cellar feeds an annual beverage cost of sales of 180,000. How many times did the stock turn?",
       "Three turns a year",
       ["three turns a year", "three", "3", "three turns", "3 turns",
        "three times", "3 times", "three times a year", "3 times a year",
        "3 turns a year", "three turns per year", "3x", "it turns three times",
        "three times per year", "3 times per year", "3 turns per year",
        "three per year", "3 per year", "3x a year"],
       "Cost of sales over average stock: 180,000 over 60,000 turns three times. A grand cellar may turn barely once a year while a bistro turns monthly, and neither is wrong; the figure simply prices what that style of list costs to run.",
       ex=True),
    SA("Inventory as trapped cash",
       "Money the venue has already spent on wine still waiting to sell is, the accountant says, tied up rather than gone. Which two-word pool of funds is a deep cellar tying up?",
       "Working capital",
       ["working capital", "its working capital", "operating capital",
        "its operating capital"],
       "Working capital pays the wages, the produce order and the rent between now and the next busy Saturday. A bottle on the shelf still counts in it on paper, but as stock it can settle no bill until it sells and turns back into cash. Tied up, not gone, is the real cost of a deep cellar, and it never appears on the wine list.",
       ex=True),
    SA("Inventory as trapped cash",
       "Bottles sold across a period, divided by the bottles that sat available to sell: which measure is that?",
       "Sell-through",
       ["sell through", "sellthrough", "sell through rate",
        "sell through percentage", "sellthrough rate"],
       "Ten in the bin at the start and six gone is sixty percent sell-through. It reads the list wine by wine, which a whole-cellar turn figure cannot, and it flags a listing as a passenger long before its first birthday on the page."),

    # ------------------------------------------------ Engineering the list (4) --
    Q("Engineering the list",
      "Sorted for the quarterly list review, every wine lands in one of four boxes. Which two measurements draw that grid?",
      ["How often it sells, and how much cash each sale leaves behind",
       "Its beverage cost percentage, and the discount tier its supplier currently offers",
       "Its age on the list, and the value of the bin it occupies",
       "Its score in the press, and its price"], 0,
      "Volume and cash margin sort a list into workhorses, stars, puzzles and passengers, and each box has its own remedy: promote, protect, reprice or replace. Cost percentage appears nowhere in the grid, because a wine can hit its percentage and still earn almost nothing."),
    SA("Engineering the list",
       "Afraid of looking mean, most tables skip past the cheapest bottle on the page, and trade lore holds that one slot quietly outsells everything around it. Which slot?",
       "The second-cheapest bottle on the list",
       ["second cheapest", "second cheapest bottle", "second cheapest wine",
        "second cheapest slot", "second cheapest on the list",
        "second cheapest bottle on the list",
        "second cheapest wine on the list", "second from the bottom",
        "second lowest", "second lowest priced", "second least expensive",
        "one up from the cheapest", "next cheapest", "next cheapest bottle",
        "next to cheapest", "second cheapest on the page",
        "second cheapest bottle on the page",
        "second cheapest wine on the page", "2nd cheapest",
        "2nd cheapest bottle", "2nd cheapest wine"],
       "Nobody wants to read as the table's economist, so the finger settles one line up from the bottom. Buyers know it, which is why that slot so often carries the list's friendliest margin rather than its finest wine.",
       ex=True),
    SA("Engineering the list",
       "High on the first page sits a bottle priced beyond what almost anyone will pay, and the buyer never expected it to sell. What is it there to do?",
       "Anchoring: it makes the rest of the list look reasonable",
       ["anchoring", "anchor", "price anchoring", "price anchor", "decoy",
        "decoy pricing", "makes the rest of the list look reasonable",
        "making the rest of the list look reasonable",
        "makes the rest look reasonable", "making the rest look reasonable",
        "makes everything else look cheaper",
        "making everything else look cheaper",
        "makes the other bottles look reasonable",
        "makes the rest of the list look cheaper",
        "makes the other wines look cheap", "make the other wines look cheap",
        "makes the other bottles look cheaper", "look cheap by comparison",
        "look cheaper by comparison"],
       "Its work is done unsold: beside a 900 bottle, 120 reads as restraint. Placement does the arithmetic on the guest's behalf, and the effect costs the venue nothing so long as the bottle finds one buyer a year."),
    SA("Engineering the list",
       "Reading down a page priced 40, 48, 58 and 70, a guest can climb toward better wine in small, painless steps. Which pricing tactic built the page?",
       "Laddering",
       ["laddering", "price laddering", "price ladder", "ladder pricing",
        "laddered pricing", "ladder"],
       "Each rung asks a little more than the last and never a leap, so the climb from 40 to 70 happens one easy step at a time. Gaps work the other way: a page that jumps from 50 to 95 loses every guest standing at the edge of the jump."),

    # --------------------- The glass programme and preservation economics (5) --
    Q("The glass programme and preservation economics",
      "Every night a wine bar tips away two open bottles at an average cost of 20, and a 3,000 gas preservation system is proposed. What does the arithmetic say?",
      ["About 280 of wine a week stops going down the sink, so the system repays itself inside three months",
       "Gas refills will cost more over a year than the wine they save, so the case fails",
       "Two bottles a night is too small a loss to justify any capital spend",
       "Payback only arrives if glass prices rise alongside the equipment"], 0,
      "Two bottles at 20 is 40 a night and 280 a week, poured away. Against that, 3,000 of kit is under eleven weeks of losses, and everything after the payback is margin. Preservation is bought with wine that was already being thrown out."),
    Q("The glass programme and preservation economics",
      "Priced to recover its whole cost in one pour, a rare glass finds no takers; priced where guests bite, recovery takes three pours. What settles the argument for the lower price?",
      ["Under gas the remainder keeps for weeks, so the bottle can earn its cost back slowly",
       "Three pours from a single bottle is the ceiling most licences allow, so the arithmetic can never get worse",
       "An unsold rare bottle can always go back to the distributor for credit, so the downside was never real",
       "The lower price still clears the cost, and nothing else about a glass matters"], 0,
      "Preservation changes the deadline, and the deadline was the whole argument for aggressive pricing. Once the remainder keeps, the bottle can earn its cost across a week of single pours, and the lower price recruits the guests who make that happen."),
    SA("The glass programme and preservation economics",
       "Sunday night closes with the week's unsold open bottles poured down the sink and their cost value entered in the books. Under which heading does that loss go?",
       "Wastage",
       ["wastage", "waste", "spoilage", "spoilage loss",
        "spillage and wastage", "wastage and spillage", "waste and spoilage",
        "spoilage and waste", "wastage line", "waste line", "as wastage",
        "under wastage", "recorded as wastage", "wine waste"],
       "Wastage is the counted, explained loss: wine that tired before it sold, priced at cost and written down. Keeping it as its own line matters, because it is the one component of pour cost a manager can actually attack with equipment and discipline.",
       ex=True),
    SA("The glass programme and preservation economics",
       "Short and quick-selling is the only safe shape for a by-the-glass page poured without any preservation. What is the page's length being matched to?",
       "How fast each wine sells",
       ["how fast each wine sells", "how fast it sells",
        "how fast the wines sell", "how quickly each wine sells",
        "how quickly it sells", "sales velocity", "velocity", "rate of sale",
        "speed of sale", "pace of sale", "pace of sales",
        "how quickly bottles sell", "how fast bottles sell",
        "speed at which the wines sell", "speed at which they sell",
        "how fast bottles empty", "how quickly bottles empty",
        "how fast each bottle empties", "how fast the wine sells",
        "how fast they sell", "how quickly the wines sell",
        "how quickly they sell", "how quickly the wine sells", "sales pace",
        "selling speed"],
       "An unprotected open bottle has two or three days of honest life, so the page is sized to what will empty inside that window. Add gas and the constraint relaxes, which is why the length of a by-the-glass page is a statement about the bar's equipment."),
    SA("The glass programme and preservation economics",
       "Through the needle of a preservation device, a 400 bottle gives ten 75 ml tastes. To hold a 25 percent cost on the pour, what must one taste sell for?",
       "160",
       ["160", "$160", "160 dollars", "one hundred and sixty",
        "one hundred sixty", "one sixty", "160 a taste", "160 a pour",
        "160 a glass", "160 per taste", "160 per pour", "160 per glass",
        "160 each"],
       "Ten tastes from one bottle puts 40 of cost into each; 40 over 0.25 is 160. The arithmetic is the same as any pour cost, only the pour is smaller and the bottle dearer, which is how a 400 wine meets a guest who would never buy it whole.",
       ex=True),

    # -------------------------------- Allocations, training and the ledger (4) --
    SA("Allocations, training and the ledger",
       "Six bottles a year of a cult Pinot arrive only because the distributor chooses the venue, and the buyer knows the price of staying chosen. What is the venue expected to do in return?",
       "Buy the rest of the book",
       ["buy the rest of the book", "the book", "the portfolio", "the range",
        # The noun cores a correct answer is built on. Under '~' each of these
        # still grades inside any subject frame, modal or verb a student puts
        # in front of it, which is the whole class ex=True alone shut out.
        "~rest of the book", "~rest of the portfolio", "~rest of the range",
        "~rest of the wines",
        "~whole book", "~whole portfolio", "~whole range",
        "~whole of the book", "~whole of the portfolio",
        "~entire book", "~entire portfolio", "~entire range",
        "~their book", "~their portfolio", "~their range", "~their list",
        "~their wines", "~its book", "~its portfolio", "~its range",
        "~his book", "~his portfolio",
        "~distributor's book", "~distributors book",
        "~distributor's portfolio", "~distributors portfolio",
        "~distributor's range", "~distributors range",
        "~distributor's list", "~distributors list",
        "~distributor's wines", "~distributors wines",
        # "other wines" has to carry a possessive rather than stand alone: as a
        # bare '~' it graded the anchoring question's own accepted phrasings,
        # "makes the other wines look cheap" among them. The unqualified form
        # stays as an exact entry, where it cannot be swallowed by a sentence.
        "the other wines", "the other bottles", "the other labels",
        "~their other wines", "~its other wines", "~his other wines",
        "~distributor's other wines", "~distributors other wines",
        "~their other bottles", "~distributor's other bottles",
        "~their other labels", "~distributor's other labels",
        "~everyday wines", "~everyday bottles", "~everyday labels",
        "~commercial wines", "~bread and butter wines",
        "~everything else they sell", "~everything else the distributor sells",
        "~everything else in the book", "~everything else in the portfolio",
        # The bare object needs its own carriers, because "book" and
        # "portfolio" normalise to one word and a one-word '~' is the trap.
        "~buy the book", "~buys the book", "~buying the book",
        "~buy the portfolio", "~buys the portfolio", "~buying the portfolio",
        "~buy the range", "~buys the range", "~buying the range",
        "~take the book", "~takes the book", "~taking the book",
        "~take the portfolio", "~takes the portfolio", "~taking the portfolio",
        "~carry the book", "~carries the book", "~carrying the book",
        "~carry the portfolio", "~carries the portfolio",
        "~carrying the portfolio",
        "~support the book", "~supports the book", "~supporting the book",
        "~support the portfolio", "~supports the portfolio",
        "~supporting the portfolio",
        "~stock the book", "~stocks the book", "~stocking the book",
        "~stock the portfolio", "~stocks the portfolio",
        "~stocking the portfolio",
        "~across the book", "~across the portfolio", "~across the range"],
       "Scarce wine is currency, and the distributor spends it on accounts that carry the everyday bottles as well. Let those go and the cult ones quietly stop arriving; another venue is always happy to take the whole book.",
       ex=True),
    SA("Allocations, training and the ledger",
       "One line of beverage spend costs a few open bottles a week and pays for itself in what the floor can say at the table. Which spend is it?",
       "Staff training",
       ["training", "trainings", "the training budget",
        # '~' on the staff-side phrases, so an adjective, a possessive or a
        # sentence frame in front of them still grades. Bare "training" stays
        # exact, which is what keeps "guest training" and "training is a
        # waste" out.
        "~staff training", "~staff trainings", "~staff wine training",
        "~wine training", "~server training", "~floor training",
        "~team training", "~sommelier training", "~somm training",
        "~beverage training",
        "~training the staff", "~training our staff", "~training for the staff",
        "~training of the staff", "~training the floor",
        "~training for the floor", "~training the team",
        "~training for the team", "~training the servers",
        "~training our servers", "~training the new servers",
        "~training the sommeliers", "~training the somms",
        "~training the waiters", "~training the front of house",
        "~training up the staff", "~training up the floor",
        "~training up the team", "~training up the servers",
        "~front of house training", "~service training",
        "~tasting the staff", "~tasting the floor", "~tasting the team",
        "~tasting the servers", "~tasting the sommeliers",
        "~staff education", "~staff wine education", "~wine education",
        "~floor education", "~team education", "~server education",
        "~beverage education",
        "~educating the staff", "~educating our staff", "~educating the floor",
        "~educating the team", "~educating the servers",
        "~educating our servers", "~educating our floor",
        "~educating our team",
        "~educating the sommeliers", "~education for the staff",
        "~education for the floor",
        "~staff tastings", "~staff tasting", "~staff wine tastings",
        "~staff wine tasting", "~team tastings", "~team tasting",
        "~tastings for the staff", "~tasting for the staff",
        "~tastings with the staff", "~tasting with the staff",
        "~pre shift tastings", "~pre shift tasting", "~preshift tastings",
        "~preshift tasting", "~line up tastings", "~lineup tastings",
        "~weekly line up", "~weekly lineup", "~staff line up", "~staff lineup",
        "~training line", "~training spend", "~training programme",
        "~training program"],
       "A server who has tasted a wine sells it, and one who has not changes the subject. A weekly line-up costs a few bottles at wholesale and repays in better bottles leaving the cellar and slow bins finally moving, which no other line on the budget does at that price.",
       ex=True),
    Q("Allocations, training and the ledger",
      "On the owner's nod, two bottles go free of charge to a critic's table. How does a clean set of books record them?",
      ["At cost, on a promotion line rather than in beverage cost",
       "At full list price, rung through the till as a sale and immediately voided by a manager",
       "Nowhere, because accounts exist to record transactions and no money changed hands",
       "As breakage, since the stock left the cellar without any matching sale"], 0,
      "The bottles are a real cost and a deliberate one, so they move at cost value out of beverage cost and into promotion, where the spend was actually made. Left in beverage cost they poison the percentage; recorded nowhere, the stock count comes up short with nothing to say why."),
    SA("Allocations, training and the ledger",
       "Fourteen bottles left the cellar by the physical count, while the till shows twelve sold and one recorded comp. What does the fourteenth bottle become in the stock report?",
       "Variance, or shrinkage",
       ["variance", "shrinkage", "variance or shrinkage",
        "shrinkage or variance", "stock variance", "inventory variance",
        "unexplained loss", "unaccounted loss", "unaccounted for loss",
        "unaccounted for", "unexplained shrinkage", "stock discrepancy",
        "discrepancy", "unexplained variance", "stock loss",
        "unexplained stock loss", "stock shortage", "shortage"],
       "Twelve sold and one comped explains thirteen; the fourteenth is variance, the gap between what left and what was accounted for. A steady trickle of it is over-pouring or sloppy recording, a widening one is theft, and neither shows without the count.",
       ex=True),
]
