# -*- coding: utf-8 -*-
"""Beyond Wine study chapters. Written from the competency list in the Regionale
question modules, not from the chapter this replaces."""
from primerlib import CH

CHAPTERS = [
    CH("Beyond Wine", "beer", "Beer", """
<h4>Four ingredients, and what each does</h4>
<p>Beer is a grain drink, and everything follows from one problem: starch has to
become sugar before yeast can touch it. Barley solves it twice, since
germinating the grain wakes enzymes that cut starch into sugar and its husk
settles into a filter bed when the wort runs off. Malting is that controlled
sprouting, stopped by kilning, and the heat of the kiln sets colour and flavour
together, from pale bready base malt through caramel to the coffee bite of
unmalted roasted barley. Hard roasting destroys the enzymes, so dark malts
season a pale base rather than replace it. Hops go into the boil, where heat
turns their acids into soluble bitterness while the oils that smell of citrus
and pine escape, so aroma must be added late, or cold afterwards. Water is not
neutral: sulphate sharpens
bitterness and made Burton a pale ale town, carbonate flatters roast and made
Dublin a stout one.</p>

<h4>Two families, one decision</h4>
<p>Ale and lager divide on yeast and temperature. A warm ferment throws fruity
esters and finishes in days; a cold one works slowly and then rests for weeks
near freezing, which is lagering, leaving a clean beer where malt and hops speak
plainly. Cold fermentation gave Bohemia, Germany and Austria their classics, and
colour is not body: schwarzbier is jet black and light.</p>
<p>${INTRO_CHIP('Pilsner')}${INTRO_CHIP('Helles')}${INTRO_CHIP('Vienna')}${INTRO_CHIP('Marzen')}${INTRO_CHIP('Bock')}${INTRO_CHIP('Schwarzbier')}</p>
<p>Warm fermentation carries the rest: pale ale, and the IPA whose heavy hopping
is traditionally explained by the long voyage to India; porter and stout, defined
by roast rather than strength; Bavarian wheat beer, whose banana and clove come
from the yeast, not the grain; and the Belgian ranks of witbier, dubbel, tripel
and saison. Trappist is a protected word for beer brewed inside a working
Trappist monastery, while abbey beer is only a style and often a licence. Lambic
stands apart, left overnight in an open pan for the air of the Senne valley to
inoculate, then blended young with old to make gueuze.</p>

<h4>The spec sheet and the glass</h4>
<p>A beer list speaks in numbers. Alcohol by volume runs from a three per cent mild
to a barleywine past ten, and paces an evening; bitterness units count the hop
acids dissolved in the beer, though malt sweetness can hide a high figure;
original gravity is the sugar in the wort before fermentation, and its fall to
final gravity is what became alcohol. Light lagers and wheat beers go out cold,
strong and dark ales warmer, since cold mutes aroma. The glass is rinsed clean,
because grease kills the head, and draught lines need cleaning every week or
two. At the table, roasted stout echoes char on the grill, and bitterness turns
harsh beside a sweet pudding.</p>
"""),

    CH("Beyond Wine", "sake", "Sake", """
<h4>Rice, water and a mould</h4>
<p>Sake is brewed rather than distilled, and its method sits nearer to beer than
to wine. Rice is full of starch but, unlike barley, has no way of releasing it,
so the enzymes must be supplied from outside: a mould, Aspergillus oryzae, is
grown on steamed rice in a warm humid room to make koji. Koji frees sugar only
as fast as the yeast can eat it, so saccharification and fermentation run
together in the same tank, the arrangement called multiple parallel
fermentation, and it carries the mash close to twenty per cent alcohol with
nothing added. Water is roughly four fifths of the bottle,
which is why breweries sit on a particular spring: hard water drives a firm, dry
ferment, soft water a gentler and rounder one. Brewing rice differs from eating
rice in carrying a chalky starch core the mould can penetrate, and Yamada
Nishiki is the variety brewers treat as the benchmark.</p>

<h4>Reading the label</h4>
<p>Milling sets the ginjo grades. Seimaibuai names what remains of each grain rather
than what was taken off, so a lower figure means more was polished away, and
what goes first is the fat and protein near the surface that read coarse. Sixty
per cent or less opens ginjo, fifty per cent or less daiginjo, and both also
demand the cool, slow ferment that builds melon and pear perfume. Junmai
promises rice, water, koji and yeast alone; honjozo, milled to seventy per cent
or less, allows a small measured addition of distilled alcohol, capped at a tenth
of the rice's weight, which lifts aroma out of the mash rather than stretching
the volume. The trap is that a ginjo or daiginjo without the word junmai carries
that addition too. Ordinary futsushu sits outside these special grades and is
most of what Japan drinks. Other words describe treatment instead:</p>
<p>${INTRO_CHIP('genshu')}${INTRO_CHIP('nama')}${INTRO_CHIP('nigori')}${INTRO_CHIP('koshu')}</p>
<p>Undiluted, unpasteurised, cloudy and deliberately aged, in that order.
Most sake is cut with water to fifteen or sixteen per cent before bottling, and
a Sake Meter Value above zero signals a drier sake, below zero a sweeter one.
Send a daiginjo out chilled, since warmth drives off the esters it was brewed
slowly to build, and keep warming, up to hot atsukan near fifty degrees, for the
sturdier junmai and honjozo. Sake is made to be drunk young, nama must stay
refrigerated, and an opened bottle fades within weeks.</p>
"""),

    CH("Beyond Wine", "spirits", "Spirits & Liqueurs", """
<h4>What the still is doing</h4>
<p>Distillation concentrates alcohol and never creates any. Ethanol boils near
78 degrees Celsius and water at 100, so the vapour drawn off is richer in
alcohol than the liquid left behind. A pot still works batch by batch and carries
flavour over with the alcohol, which is why the aromatic categories use one; a
column still runs without pause and gives a cleaner, stronger spirit. The
distiller keeps only the middle, cutting away the volatile heads and oily tails,
which usually go back into the next charge. Time in oak
does the rest, at the cost of a few per cent a year through the staves, the
angels' share. On Scotch and Cognac an age describes the youngest spirit in
the blend, never the average.</p>

<h4>Categories, and where each starts</h4>
<p>The raw material names most of them. Grape brandy gives Cognac, distilled
twice in a pot still from thin, sharp Ugni Blanc, best on the chalk of Grande
and Petite Champagne, its VS, VSOP and XO meaning at least two, four and ten
years in oak; and Armagnac, traditionally taken in a single pass through
a small continuous column of Gascon design, more rustic for it. Normandy
distils cider and calls it Calvados. Grain gives whisky: Scotch must spend three
years in oak in Scotland, single names one distillery, not one cask, and smoke
arrives when malt is dried over peat. Irish whiskey is often distilled three
times and seldom peated. Bourbon needs at least 51 per cent corn and new charred
oak, and may be made anywhere in the United States, not only Kentucky; because
those casks serve once only, much of the world's whisky matures in what bourbon
distillers discard. Tennessee whiskey adds a filtering through maple charcoal
before the cask. Agave gives tequila, from the single blue Weber species,
steamed, and mezcal, from many species, pit-roasted, hence its smoke; a tequila
not labelled 100 per cent agave need hold only 51 per cent. Sugarcane gives rum, molasses in most of the Caribbean
and fresh juice for rhum agricole. Brazil ferments fresh cane too, but its law
keeps cachaca its own category, not a rum. Gin must lead with juniper whatever
else is in it; vodka is distilled to high strength and filtered towards
neutrality, though some now let the base show. Liqueurs are sweetened and
flavoured, from the Carthusian monks' green and yellow Chartreuse to the bitter
red Campari of the Negroni, and the bitter Italian amari are what guests ask for
after a meal.</p>
"""),
]
