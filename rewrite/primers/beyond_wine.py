# -*- coding: utf-8 -*-
"""Beyond Wine study chapters. Written from the competency list in the Rank I
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
began as insurance on a long voyage; porter and stout, defined by roast rather
than strength; Bavarian wheat beer, whose banana and clove come from the yeast,
not the grain; and the Belgian ranks of witbier, tripel and saison. Lambic
stands apart, left overnight in an open pan for the air of the Senne valley to
inoculate, then blended young with old to make gueuze.</p>
"""),

    CH("Beyond Wine", "sake", "Sake", """
<h4>Rice, water and a mould</h4>
<p>Sake is brewed rather than distilled, and its method sits nearer to beer than
to wine. Rice is full of starch but, unlike barley, has no way of releasing it,
so the enzymes must be supplied from outside: a mould, Aspergillus oryzae, is
grown on steamed rice in a warm humid room to make koji. Koji frees sugar only
as fast as the yeast can eat it, so saccharification and fermentation run
together in the same tank, and that arrangement carries the mash close to twenty
percent alcohol with nothing added. Water is roughly four fifths of the bottle,
which is why breweries sit on a particular spring: hard water drives a firm, dry
ferment, soft water a gentler and rounder one. Brewing rice differs from eating
rice in carrying a chalky starch core the mould can penetrate, and Yamada
Nishiki is the variety brewers treat as the benchmark.</p>

<h4>Reading the label</h4>
<p>Milling sets the ginjo grades. Seimaibuai names what remains of each grain rather
than what was taken off, so a lower figure means more was polished away, and
what goes first is the fat and protein near the surface that read coarse. Sixty
percent or less opens ginjo, fifty percent or less daiginjo, and both also
demand the cool, slow ferment that builds melon and pear perfume. Junmai
promises rice, water, koji and yeast alone; honjozo allows a small measured
addition of distilled alcohol, which lifts aroma out of the mash rather than
stretching the volume. Other words describe treatment instead:</p>
<p>${INTRO_CHIP('genshu')}${INTRO_CHIP('nama')}${INTRO_CHIP('nigori')}${INTRO_CHIP('koshu')}</p>
<p>Undiluted, unpasteurised, cloudy and deliberately aged, in that order. Send a
daiginjo out chilled, since warmth drives off the esters it was brewed slowly to
build, and keep warming for the sturdier junmai and honjozo.</p>
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
does the rest, at the cost of a few percent a year through the staves, the
angels' share.</p>

<h4>Categories, and where each starts</h4>
<p>The raw material names most of them. Grape brandy gives Cognac, distilled
twice in a pot still from thin, sharp Ugni Blanc, best on the chalk of Grande
and Petite Champagne, and Armagnac, traditionally taken in a single pass through
a small continuous column of Gascon design, more rustic for it. Normandy
distils cider and calls it Calvados. Grain gives whisky: Scotch must spend three
years in oak in Scotland, single names one distillery, not one cask, and smoke
arrives when malt is dried over peat. Bourbon needs at least 51 percent corn and
new charred oak, and because those casks serve once only, the rest of the world
matures in what bourbon distillers discard. Agave gives tequila, one species and
steamed, and mezcal, many species and pit-roasted, hence its smoke. Sugarcane
gives rum, molasses in most of the Caribbean and fresh juice for rhum agricole.
Brazil ferments fresh cane too, but its law keeps cachaca its own category, not
a rum. Gin must lead with juniper whatever else is in it; vodka is rectified
until the base leaves no fingerprint. Liqueurs are sweetened and flavoured, and
the bitter Italian amari are what guests ask for after a meal.</p>
"""),
]
