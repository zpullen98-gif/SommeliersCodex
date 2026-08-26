# -*- coding: utf-8 -*-
"""France study chapters. Written from the competency list in the Rank I
question modules, not from the chapter this replaces."""
from primerlib import CH

CHAPTERS = [

    CH("France", "bordeaux", "Bordeaux", """
<p>Bordeaux is a maritime region built around a tidal estuary in the south-west
of France. The Atlantic keeps winters mild and summers moderate, the pine forest
of the Landes blunts the wind off the sea, and rain can spoil flowering in June
or the picking in September. Where the weather cannot be relied on, nobody
stakes a crop on one grape: blending varieties that flower and ripen at
different moments is the local insurance, and the proportions are settled afresh
in the cellar every year.</p>

<h4>Gravel and clay</h4>
<p>The Garonne and the Dordogne meet north of the city to form the Gironde, and
the region divides along that water. Left Bank soils are deep gravel that drains
fast and stores the day's heat, which is what lets late-ripening Cabernet
Sauvignon finish this far north; the Medoc communes run northward from Margaux
through Saint-Julien and Pauillac to Saint-Estephe, and Pessac-Leognan holds the
same gravel south of the city. The Right Bank is cooler clay and limestone, so
earlier Merlot leads at Saint-Emilion and Pomerol, with Cabernet Franc beside
it. Whites pair Sauvignon Blanc, for aroma and acidity, with Semillon for
weight: dry in Entre-Deux-Mers and Pessac-Leognan, sweet in Sauternes, where
mist off the cold Ciron brings the noble rot that shrivels Semillon on the
vine.</p>

<h4>Rank and trade</h4>
<p>The 1855 classification ranked Left Bank estates on the prices they had long
fetched: five tiers of red that have scarcely moved since, and a separate
ranking of Sauternes in two tiers of classified growth under Yquem alone.
Saint-Emilion by contrast rewrites its list every decade or so, and Pomerol has
never had one at all.
Other words on a label carry their own weight:
${INTRO_CHIP('Cru Bourgeois')}${INTRO_CHIP('Grand Cru Classe')}${INTRO_CHIP('Bordeaux Superieur')}
Most estates sell through negociant merchants rather than to the drinker, and
the sought-after wines are offered as futures while still in barrel.</p>
"""),

    CH("France", "burgundy", "Burgundy", """
<p>Burgundy asks one question repeatedly: what does a single grape taste like
from one particular piece of ground? Pinot Noir for red and Chardonnay for white
are held constant, and the vineyard is the variable. The climate is continental
and unforgiving, with cold winters, spring frost, hail and the threat of rain at
harvest, so one year differs sharply from the next. The core of the region is a
narrow limestone escarpment facing broadly east, the Cote d'Or, and the best
sites sit mid-slope: above the frost that pools on the flat, below the crown of
the hill where the topsoil has washed away.</p>

<h4>Four tiers of land</h4>
<p>The hierarchy ranks ground, not estates:
${INTRO_CHIP('Regional')}${INTRO_CHIP('Village')}${INTRO_CHIP('Premier Cru')}${INTRO_CHIP('Grand Cru')}
On the Cote d'Or a Grand Cru stands under its vineyard name alone; a Premier
Cru names the village first and the vineyard after. Grand Cru is a sliver of the whole and
regional Bourgogne most of it. Inheritance law split holdings among heirs for
generations, so one celebrated vineyard may carry dozens of owners, which is why
the grower matters as much as the address. The Cote de Nuits to the north is
almost entirely red; the Cote de Beaune makes the great whites around Meursault
and the two Montrachet villages, plus the hill of Corton.</p>

<p>Chablis lies well north of the Cote d'Or, growing Chardonnay on cold,
frost-prone Kimmeridgian limestone, and is defined by acidity and reticence with
oak; its Grand Cru is a single appellation carrying seven named climats rather
than seven names of its own. Running south come the Cote Chalonnaise and then
the Maconnais, the region's largest single source of Chardonnay. Beaujolais at
the far end sits on granite rather
than limestone, and its Gamay, often fermented in whole bunches, tastes
unrelated to anything above it.</p>
"""),

    CH("France", "loire", "Loire Valley", """
<p>The Loire is a river first and a wine region second, and the wines change as
the river does. At the Atlantic mouth the climate is maritime and mild; four
hundred kilometres inland at Sancerre it is continental, with hard winters and a
real frost risk each spring. The rock changes with it. West of Saumur lies the
old hard ground of the Massif Armoricain, schist and granite; east of it begins
the soft limestone of the Paris Basin, the tuffeau that built the chateaux and
now holds the cellars.</p>

<h4>Mouth to source</h4>
<p>Around Nantes, Melon de Bourgogne makes Muscadet: dry, low in alcohol and
often bottled straight off its fine lees, which leaves a faint prickle and a
yeasty texture and earns the term sur lie. Anjou and Saumur are Chenin Blanc
country, austere and bone dry on the dark schist of Savennieres, sweet on the
Layon slopes where autumn mist brings noble rot, and sparkling in the quarried
tuffeau. Cabernet Franc is the red grape from here through Touraine, leafy and
raspberry-scented on light tannin, at Saumur-Champigny, Chinon and Bourgueil.
Vouvray and Montlouis take Chenin across the full range from dry to sweet to
sparkling, the grower choosing once the autumn has shown its hand. Upstream in
the Centre, Sauvignon Blanc on chalky marl, stony limestone and flint gives
Pouilly-Fume, which is white and nothing else, and Sancerre, which adds Pinot
Noir for red and rose.</p>

<p>Chenin's acidity is what makes that range possible, and it is why the sweet
wines of ${INTRO_CHIP('Coteaux du Layon')}${INTRO_CHIP('Quarts de Chaume')}${INTRO_CHIP('Bonnezeaux')}
taste fresh rather than cloying after decades.</p>
"""),

    CH("France", "rhone", "Rhône Valley", """
<p>The Rhone is two wine regions sharing one river. Between Valence and
Montelimar the vines nearly stop for some fifty kilometres, and on either side
of that gap the climate, the soil, the training and the blend all differ.</p>

<h4>The granite north</h4>
<p>North of the gap the climate is continental, so a cool year and a warm one
give noticeably different wine. The slopes are steep enough that terraces need
dry stone walls and each vine may be tied to its own wooden stake. Soils are
thin and granitic. The only black grape is Syrah, peppery and firm, at
Cote-Rotie above Ampuis, on the granite hill of Hermitage behind Tain, and at
Crozes-Hermitage, Saint-Joseph and Cornas. White vines were long interplanted
among the black and picked with them, so most of these appellations still allow
a little white in the red, provided it goes into the vat and ferments there
rather than being blended in later: twenty percent Viognier at Cote-Rotie,
fifteen percent Marsanne or Roussanne at Hermitage and at
Crozes-Hermitage, ten percent at Saint-Joseph. Few growers approach the ceiling, and Cornas
permits none at all. White wine itself is Viognier at Condrieu, and Marsanne
with Roussanne elsewhere.</p>

<h4>The Mediterranean south</h4>
<p>South of the gap the valley opens out, the climate turns Mediterranean and
the mistral funnels down it, cold and dry, keeping the canopy dry and fungal
disease in check. Heat suits bush-trained Grenache, joined by Syrah for colour
and pepper and Mourvedre for tannin and savour. Blends grow long:
Chateauneuf-du-Pape permits thirteen named varieties, and part of its ground is
covered in galets, rounded stones that hold the day's heat into the night.
Labels climb a ladder from Cotes du Rhone to Villages, then Villages with a
named commune, then the crus, which drop the regional name entirely:
${INTRO_CHIP('Gigondas')}${INTRO_CHIP('Vacqueyras')}${INTRO_CHIP('Tavel')}${INTRO_CHIP('Lirac')}${INTRO_CHIP('Rasteau')}
Tavel makes rose and nothing else, while Rasteau and Beaumes-de-Venise also
fortify sweet wine.</p>
"""),

    CH("France", "champagne", "Champagne", """
<p>Champagne sits near the northern limit at which grapes ripen at all, around
forty-nine degrees. Fruit picked there is high in acid and low in sugar, which
makes a thin, sharp still wine and an ideal base for a sparkling one. Beneath
the best slopes lies deep chalk, which banks winter rain, drains a wet summer
and throws light back into the canopy; galleries quarried out of it under Reims
and Epernay hold bottles at a steady ten degrees. Since any one harvest this far
north can disappoint, the traditional unit of quality is the blend rather than
the vineyard, assembled across villages, grapes and years.</p>

<h4>Grapes and districts</h4>
<p>Chardonnay dominates the Cote des Blancs and brings acidity and long life;
Pinot Noir rules the Montagne de Reims and the Cote des Bar and brings body;
Meunier fills the frost-prone Vallee de la Marne, budding late and ripening
early. Blanc de Blancs means white grapes only, Blanc de Noirs black grapes
only. Cru rank here attaches to an entire village rather than to a parcel, and
seventeen villages hold Grand Cru.</p>

<h4>How the bubbles arrive</h4>
<p>Bunches reach the press whole, so the juice runs clean and black skins give
up no colour. The blended base wine is bottled with sugar and yeast for a second
fermentation, which builds roughly six atmospheres of pressure. The wine then
rests on the spent yeast, whose slow breakdown gives the bready register and a
finer bead. The deposit is worked into the neck, frozen, expelled, and the
bottle topped up with a dosage that fixes the style:
${INTRO_CHIP('Brut Nature')}${INTRO_CHIP('Extra Brut')}${INTRO_CHIP('Brut')}${INTRO_CHIP('Extra Dry')}${INTRO_CHIP('Sec')}${INTRO_CHIP('Demi-Sec')}${INTRO_CHIP('Doux')}
Extra Dry is sweeter than Brut, which catches almost everyone.</p>
"""),

    CH("France", "alsace", "Alsace", """
<p>Alsace grows its vines on the eastern flank of the Vosges, inside the rain
shadow the mountains cast. Wet Atlantic weather is forced up over the range and
sheds its water on the far side, leaving Colmar among the driest towns in
France. Dry autumns, unhurried ripening and very little rot follow, and they are
why grapes we think of as German ripen fully here. The vineyards occupy foothill
slopes facing east and south-east, above the frost-prone plain and below the
cold forest. When the Rhine valley dropped along its fault, the shoulder left
behind was shattered, so granite, sandstone, limestone, marl, schist and
volcanic rock all turn up within a few kilometres.</p>

<h4>The label names the grape</h4>
<p>Almost alone in France, Alsace puts the variety on the front of the bottle,
and a wine sold as a variety must be that variety entire. Riesling is fermented
dry, taut and citrus-driven; Gewurztraminer is deep gold, low in acid and heady
with lychee and rose; Pinot Gris is broad and smoky; Muscat smells of fresh
grapes and still finishes dry. Those four are the noble varieties and normally
the only ones allowed at Grand Cru level. Sylvaner, Pinot Blanc and Auxerrois
carry the everyday wine, and Pinot Noir is the one black grape.</p>

<p>Fifty-one Grand Cru sites are separately delimited, with lower yields and a
compulsory vintage. Two late-harvest categories are defined in law and limited
to the noble four:
${INTRO_CHIP('Vendanges Tardives')}${INTRO_CHIP('Selection de Grains Nobles')}
Elsewhere the level of sweetness is house style rather than law, though since
the 2021 vintage every other still white must declare it on the label, as sec,
demi-sec, moelleux or doux or on a printed scale. Cremant d'Alsace is
the bottle-fermented sparkling wine, and Edelzwicker and Gentil are the
blends.</p>
"""),

]
