"""Rank I rewrite - Producers & Icons (50 questions, all multiple choice).

Written from the syllabus below. The imported bank was not read while writing.

The one idea the running order is built around is the wine list itself: the
blocks run in the order a beginner meets these names on a page, from Champagne
at the top through the French classics, into Italy and Iberia, then Germany, and
out to the New World and the icons that belong to no classification at all. A
server working down the list meets each house at the point where it would
actually be asked about.

Every question asks WHICH HOUSE, or what a named house is known for. Vineyard
holdings, cuvee composition, succession and anything that turns on price or
ownership are left to the Rank II category that has to sit above this one, and
the facts chosen here are the durable ones: a label, a practice, a signature
wine. Regional categories already own their own appellations, classifications
and history, so where a house of theirs is named the task is deliberately
different: Bordeaux owns the 1855 list, and what is asked here is whose tower is
on the label.

Every stem opener is distinct, the constructions in lib.BANNED_TEMPLATES are
avoided by design, and each stem leads with a label, a building, a wine or a
practice so the house arrives as the answer rather than as the first clause.
Option length was watched from the first draft rather than repaired afterwards.
"""

from lib import Q

CAT = "Producers & Icons"
SLUG = "r1-producers-icons"
PREFIX = "i"
RANK = "Rank I"
SOURCE = "data-intro.js"

SYLLABUS = [
    ("Champagne houses and growers", 5),
    ("Bordeaux estates by name", 4),
    ("Burgundy domaines and negociants", 5),
    ("Rhone benchmarks", 5),
    ("Piedmont and Tuscany", 6),
    ("Spanish bodegas and Sherry houses", 4),
    ("Port shippers of the Douro", 4),
    ("Mosel and Rhine estates", 4),
    ("California and the Pacific Northwest", 5),
    ("Australia and New Zealand", 4),
    ("Icons beyond the classic names", 4),
]

BANK = [
    # ------------------------------- champagne houses and growers (5) -------
    Q("Champagne houses and growers",
      "Dom Perignon carries a vintage year on every bottle and is never blended across harvests. Which house releases it?",
      ["Moet et Chandon", "Louis Roederer", "Perrier-Jouet", "Pol Roger"], 0,
      "The cuvee appears only in years the house is prepared to declare, so it skips harvests entirely rather than filling the gap with a blend. A prestige cuvee is a house's flagship bottling rather than a legal category, and each of the great houses keeps one."),
    Q("Champagne houses and growers",
      "An unmistakable bright yellow label has identified one house's non-vintage brut since the nineteenth century. Which house?",
      ["Veuve Clicquot", "Piper-Heidsieck", "Lanson", "Mumm"], 0,
      "The colour was registered as a trademark and is recognisable across a crowded room, which is exactly what a house livery is for. Mumm's diagonal red sash does the same work, and both predate most modern branding by a century."),
    Q("Champagne houses and growers",
      "Cuvee Sir Winston Churchill honours a customer who drank the house's wine devotedly from 1944 until his death. Which house bottles it?",
      ["Pol Roger", "Charles Heidsieck", "Louis Roederer", "Bollinger"], 0,
      "It is released only in vintage years and only in bottle and magnum, never in half bottles. The style is deliberately Pinot-led and firm rather than delicate, which the house says answers what he actually liked to drink."),
    Q("Champagne houses and growers",
      "Base wines are fermented in small oak casks rather than in steel, a practice this house kept when its neighbours gave it up. Which house?",
      ["Krug", "Taittinger", "Ruinart", "Deutz"], 0,
      "Every parcel and every year is fermented as a separate lot in cask and then kept apart in tank, so the blending table draws on a working library of reserve wines running back many years. The oak is old and is used for texture and slow oxygen rather than for any flavour of its own."),
    Q("Champagne houses and growers",
      "Growers who bottle their own wine may use a distinctive heavyweight bottle for their best cuvee only after their peers have tasted it blind and approved it. Which association runs that scheme?",
      ["The Club Tresors de Champagne", "The Union des Maisons de Champagne",
       "The Ordre des Coteaux de Champagne", "The Comite Champagne"], 0,
      "Members submit each vintage to the other members and a wine that fails cannot wear the bottle, which is why the mark is worth something. A grower has no famous house name to trade on, so a shared guarantee does that job instead."),

    # ----------------------------------- bordeaux estates by name (4) -------
    Q("Bordeaux estates by name",
      "From the 1945 vintage onward a different painter has been commissioned each year to make the artwork for the label. Which estate does this?",
      ["Chateau Mouton Rothschild", "Chateau Haut-Brion", "Chateau Margaux", "Chateau Latour"], 0,
      "Braque, Picasso, Warhol, Bacon and Hockney have all contributed, and the artist is paid in wine rather than in money. The labels are now collected in their own right, and a complete run is a minor art collection as well as a cellar."),
    Q("Bordeaux estates by name",
      "A squat stone tower standing among the vines within sight of the Gironde appears on the label of which classified Medoc estate?",
      ["Chateau Latour", "Chateau Lafite Rothschild", "Chateau Pichon Baron", "Chateau Beychevelle"], 0,
      "The building is a seventeenth-century dovecote raised on the site of an older fortified tower that once watched the river, and the estate takes its name from it. Beychevelle answers a similar question with a ship on its label, drawn from a different piece of local legend."),
    Q("Bordeaux estates by name",
      "Visitors arriving at Chateau Cos d'Estournel in Saint-Estephe are met by a facade that looks nothing like a Medoc chateau. What did its founder build there?",
      ["A set of oriental pagodas", "A neoclassical mansion in the manner of a Paris opera house",
       "A Gothic revival abbey with a bell tower", "A moated keep"], 0,
      "Louis-Gaspard d'Estournel sold a great deal of his wine into India and the East and built a cellar that advertised the fact. There is no living accommodation in it at all, and the estate is still nicknamed the Maharajah of Saint-Estephe."),
    Q("Bordeaux estates by name",
      "One estate ranked a third growth in 1855 is regularly drunk and discussed alongside the second growths of Margaux, helped by an unusually high proportion of Merlot for the Left Bank. Which estate?",
      ["Chateau Palmer", "Chateau Cantenac Brown", "Chateau Giscours", "Chateau Kirwan"], 0,
      "Its vineyard lies on the deep gravel of Cantenac beside the commune's leading properties, and roughly half the planting is Merlot where most of the Medoc leans far harder on Cabernet Sauvignon. Rank and reputation were fixed at different moments, so a gap between the two is ordinary rather than surprising."),

    # ----------------------------- burgundy domaines and negociants (5) -----
    Q("Burgundy domaines and negociants",
      "Trial plots farmed conventionally and biodynamically side by side through the 1990s convinced one Puligny-Montrachet estate to convert the whole property. Which estate?",
      ["Domaine Leflaive", "Domaine Armand Rousseau", "Maison Louis Latour", "Domaine Dujac"], 0,
      "The comparison ran for several years before the decision was taken, which is why it is quoted whenever biodynamics comes up in Burgundy. The holdings are almost entirely white and are concentrated on the slope that carries the Montrachet grands crus."),
    Q("Burgundy domaines and negociants",
      "Parcels in both Chambertin and Chambertin-Clos de Beze put one Gevrey-Chambertin family at the head of nearly every list for the village. Which domaine?",
      ["Domaine Armand Rousseau", "Domaine des Comtes Lafon", "Maison Joseph Drouhin",
       "Domaine Leflaive"], 0,
      "The two sit side by side on the slope above the village, and Clos de Beze may be sold as Chambertin though Chambertin may never be sold as Clos de Beze. The domaine was bottling and selling under its own name in the 1930s, when most Burgundy still left the cellar in cask for a merchant to raise and name."),
    Q("Burgundy domaines and negociants",
      "After tasting Willamette Valley Pinot Noir in the early 1980s, one Beaune negociant house bought land in the Dundee Hills and built a winery on it. Which house?",
      ["Maison Joseph Drouhin", "Maison Louis Latour", "Maison Louis Jadot", "Maison Faiveley"], 0,
      "The Oregon operation has been run by a member of the family since it opened, and the wines are made in a deliberately Burgundian manner. It followed rather than led the local growers who had already proved the valley could ripen the grape."),
    Q("Burgundy domaines and negociants",
      "Flower-covered labels and a relentless export campaign made one Beaujolais negociant a household name well outside France. Which firm?",
      ["Georges Duboeuf", "Chateau des Jacques", "Maison Trenel", "Domaine Lapierre"], 0,
      "The firm bottled from growers all over the region and gave the whole range one recognisable look, which a district of thousands of tiny holdings could never have done for itself. Its greatest commercial success was the young wine released within weeks of the harvest."),
    Q("Burgundy domaines and negociants",
      "A head of Bacchus on the capsule and a walled monopole in Beaune called the Clos des Ursules belong to which negociant house?",
      ["Maison Louis Jadot", "Maison Joseph Drouhin", "Domaine Leroy", "Maison Champy"], 0,
      "The house buys grapes and must right across Burgundy while also farming a large domaine of its own, which is the ordinary modern shape of a Beaune merchant. The Ursules parcel sits inside the premier cru Les Vignes Franches and is held entire by the one firm."),

    # ---------------------------------------- rhone benchmarks (5) ----------
    Q("Rhone benchmarks",
      "Three single-vineyard Cote-Rotie bottlings, each with a name beginning La, come from one house at Ampuis. Which house?",
      ["E. Guigal", "M. Chapoutier", "Paul Jaboulet Aine", "Domaine Jamet"], 0,
      "La Mouline, La Landonne and La Turque are made in very small quantities and raised in new oak for around three years, far longer than the appellation's habit. The same house also bottles a widely sold Cotes du Rhone, so its range runs from the supermarket shelf to the auction room."),
    Q("Rhone benchmarks",
      "Rather than bottle its parcels separately, one family that has farmed the hill of Hermitage since the fifteenth century assembles fruit from right across it into a single red each year. Which domaine?",
      ["Domaine Jean-Louis Chave", "Domaine du Vieux Telegraphe", "Paul Jaboulet Aine",
       "Chateau Rayas"], 0,
      "The blend draws on Les Bessards, Le Meal, L'Hermite and other named sectors of the slope, and putting them together is treated as the whole art of the appellation, because each supplies something the others cannot. The negociant houses of the hill assemble across the slope as well, but none of them can show vines held by one family for five centuries."),
    Q("Rhone benchmarks",
      "Hermitage La Chapelle takes its name from the small white chapel standing at the top of the hill. Which house bottles it?",
      ["Paul Jaboulet Aine", "Domaine Jean-Louis Chave", "M. Chapoutier", "Delas Freres"], 0,
      "The building is a medieval hermitage above the terraces and its image goes on the label. The wine is drawn from parcels across the whole slope and has long been the bottling against which the appellation is measured."),
    Q("Rhone benchmarks",
      "An unusually high proportion of Mourvedre, and the habit of blending every variety the appellation permits into the one red, mark out one Chateauneuf-du-Pape estate. Which one?",
      ["Chateau de Beaucastel", "Domaine du Pegau", "Domaine de la Janasse", "Chateau Rayas"], 0,
      "Mourvedre wants heat and a long season and gives a savoury, meaty frame that ages slowly, where most of the appellation leans far harder on Grenache. The estate also heats its picked fruit briefly before fermentation, a treatment almost nobody else there uses."),
    Q("Rhone benchmarks",
      "Every label from one Rhone house has carried its text in raised Braille dots since the 1990s. Which house?",
      ["M. Chapoutier", "Domaine Georges Vernay", "Delas Freres", "E. Guigal"], 0,
      "The practice began after the head of the house realised that a wine label tells a blind buyer nothing whatever. It is applied across the entire range, from the largest Cotes du Rhone bottling to the single-vineyard wines."),

    # --------------------------------------- piedmont and tuscany (6) -------
    Q("Piedmont and Tuscany",
      "Single vineyard names went onto Barbaresco labels in the 1960s, and the same producer pushed Piedmont onto restaurant lists far outside Italy. Which producer?",
      ["Gaja", "Produttori del Barbaresco", "Marchesi di Gresy", "Bruno Giacosa"], 0,
      "Sori San Lorenzo, Sori Tildin and Costa Russi were bottled as separate wines instead of being blended into one Barbaresco, which was an unusual step in a region that blended by tradition. The house later bought land in Barolo and in Tuscany, but the Barbaresco crus remain what it is known for."),
    Q("Piedmont and Tuscany",
      "A red label meant a Riserva and a white label the standard bottling, and the red appeared only in years the producer judged outstanding. Whose labels worked that way?",
      ["Bruno Giacosa", "Giacomo Conterno", "Roberto Voerzio", "Vietti"], 0,
      "The house bought fruit from trusted growers as well as farming its own vines, and the colour of the label was the only signal a buyer got about how the year had been rated. It applied in both Barolo and Barbaresco, and there were vintages in which no red label appeared at all."),
    Q("Piedmont and Tuscany",
      "Monfortino is made only in favoured years and spends far longer in large old casks than the appellation demands. Which Barolo house makes it?",
      ["Giacomo Conterno", "Marchesi di Barolo", "Bruno Giacosa", "Elio Altare"], 0,
      "It is a Riserva drawn from the Francia vineyard at Serralunga and is held in wood for around seven years before bottling. It is the standing reference for the traditional style of Barolo, against which the shorter-macerated, barrique-aged school defined itself."),
    Q("Piedmont and Tuscany",
      "Sassicaia was first sold commercially with the 1968 vintage, having been made privately for the family table before that. Which estate bottles it?",
      ["Tenuta San Guido", "Tenuta dell'Ornellaia", "Marchesi Antinori", "Castello di Ama"], 0,
      "The vines were Cabernet Sauvignon put onto stony ground because the owner wanted a wine in the Bordeaux manner for himself, with no thought of selling it. It went to market as a humble table wine for years before the rules caught up with it."),
    Q("Piedmont and Tuscany",
      "At Il Greppo outside Montalcino a Riserva is declared only in outstanding years, and old bottles are called back to the cellar to be topped up and recorked. Which estate?",
      ["Biondi-Santi", "Casanova di Neri", "Castello Banfi", "Il Poggione"], 0,
      "The library vintages reach back into the nineteenth century and the recorking sessions are how they have survived at all. The estate is the name most closely tied to Brunello existing as a wine sold under that name."),
    Q("Piedmont and Tuscany",
      "One Florentine family has traded wine without a break since 1385 and now puts its name on bottles from Chianti Classico out to the Tuscan coast. Which house?",
      ["Marchesi Antinori", "Marchesi de' Frescobaldi", "Castello di Brolio", "Tenuta San Guido"], 0,
      "The family entered the Florentine winemakers' guild in the fourteenth century and the business has passed down inside it ever since. Its modern standing rests as much on wines made outside the denomination rules of the day as on its Chianti Classico."),

    # ------------------------- spanish bodegas and sherry houses (4) --------
    Q("Spanish bodegas and Sherry houses",
      "White Rioja that has spent a decade in old oak before release, from deliberately unswept cellars at Haro, comes from which bodega?",
      ["R. Lopez de Heredia", "Marques de Riscal", "Bodegas Muga", "CVNE"], 0,
      "The house bottles Vina Tondonia and Vina Bosconia and puts both reds and whites on the market many years after the harvest, which almost nobody else in Rioja still does. The style is unapologetically old-fashioned and tastes of long slow oxidation in cask rather than of fruit."),
    Q("Spanish bodegas and Sherry houses",
      "A fino sold under the name Tio Pepe is the flagship of which Jerez house?",
      ["Gonzalez Byass", "Emilio Lustau", "Barbadillo", "Osborne"], 0,
      "The name honours an uncle of the founder who urged him to concentrate on the pale dry style rather than the sweet blends then selling. It has been the reference point for the whole fino category ever since, and the house built much of its early trade on brandy alongside it."),
    Q("Spanish bodegas and Sherry houses",
      "L'Ermita comes from a steep terraced vineyard above Gratallops in Priorat and is bottled by which producer?",
      ["Alvaro Palacios", "Costers del Siurana", "Clos Mogador", "Mas Doix"], 0,
      "He was one of a small group who arrived at the end of the 1980s to replant a district that had almost emptied out, and this single vineyard became its most celebrated wine. The same producer went on to make wine in Bierzo and back home in Rioja."),
    Q("Spanish bodegas and Sherry houses",
      "Fermentation in oak vats, fining with fresh egg whites and a working cooperage inside the winery mark out which Haro bodega?",
      ["Bodegas Muga", "Bodegas Riojanas", "La Rioja Alta", "CVNE"], 0,
      "Every stage from vat to barrel is wood, and the house keeps its own coopers to build and repair them rather than buying in. Egg-white fining clarifies a red gently and by hand, and very few houses of any size still bother with it."),

    # ---------------------------------- port shippers of the douro (4) ------
    Q("Port shippers of the Douro",
      "A black-caped figure in a wide Spanish hat, drawn in silhouette in 1928, still serves as the trademark of which Port and Sherry house?",
      ["Sandeman", "Offley Forrester", "Ramos Pinto", "Croft"], 0,
      "The figure wears a Portuguese student's cape and an Andalusian hat, because the house sold both Port and Sherry and wanted a single mark to carry the pair. It is one of the most recognisable trademarks in the drinks trade and has been in unbroken use since 1928."),
    Q("Port shippers of the Douro",
      "Inside one Douro quinta a small walled plot of ungrafted vines is picked and bottled on its own under the name Nacional. Which quinta?",
      ["Quinta do Noval", "Quinta do Vesuvio", "Quinta de la Rosa", "Quinta do Crasto"], 0,
      "The plot has never been grafted onto American rootstock and yields very little, so the wine appears in only a handful of years. Everything else the property makes is grafted in the ordinary way, which is what makes keeping the plot separate worth the trouble."),
    Q("Port shippers of the Douro",
      "A family shipping house of Dutch origin led the Douro's move into serious dry red table wine in the 1990s, with bottlings called Redoma and Batuta. Which house?",
      ["Niepoort", "Warre and Company", "Churchill Graham", "Taylor Fladgate"], 0,
      "The grapes and the vineyards are the same ones Port comes from, but the wines are fermented dry and never fortified, which was close to unthinkable in the valley a generation earlier. It gave the region a second business that does not depend on fortified wine at all."),
    Q("Port shippers of the Douro",
      "Vargellas, high up the valley where the Douro is at its hottest and driest, is the flagship property of which Port shipper?",
      ["Taylor Fladgate", "Graham", "Fonseca", "Dow"], 0,
      "The house is known for a firm, dry style of vintage Port that takes many years to come round. Its name belongs to the group of British and Scottish merchant families who built the Port trade out of Oporto and gave so many of the shippers English surnames."),

    # ------------------------------------- mosel and rhine estates (4) ------
    Q("Mosel and Rhine estates",
      "Scharzhofberg, the great vineyard of the Saar, is most closely associated with which family estate?",
      ["Egon Muller", "Weingut Robert Weil", "Weingut Fritz Haag", "Weingut Dr. Loosen"], 0,
      "The estate labels its wines simply Scharzhofberger and leaves the village name off, because the site is famous enough that adding it would say nothing. The Saar ripens later and far more precariously than the main Mosel valley, which is why its great years are talked about for decades."),
    Q("Mosel and Rhine estates",
      "A sundial cut into the slate above the village of Wehlen names one of the Mosel's finest sites, and one estate is inseparable from it. Which estate?",
      ["Weingut Joh. Jos. Prum", "Weingut Karthauserhof", "Weingut Egon Muller",
       "Weingut Dr. Loosen"], 0,
      "The dial was built in the nineteenth century so that pickers strung out along the slope could tell the time, and several such dials survive along the river. The estate's wines are notoriously closed and sulphurous in youth and are meant to be left alone for years."),
    Q("Mosel and Rhine estates",
      "A walled vineyard called the Steinberg was laid out by monks in the Rheingau in the twelfth century, and the monastery beside it still works as a wine estate. Which estate?",
      ["Kloster Eberbach", "Schloss Johannisberg", "Weingut Robert Weil", "Schloss Vollrads"], 0,
      "The wall took centuries to finish and the site is still farmed as one block, which is very unusual in a country of divided holdings. The monastery buildings survive almost intact and the cellars beneath them are still in use."),
    Q("Mosel and Rhine estates",
      "Records of wine sold from one Rheingau estate above Winkel run back to 1211, and the moated tower it is named for still stands in the middle of the property. Which estate?",
      ["Schloss Vollrads", "Schloss Reinhartshausen", "Weingut Georg Breuer",
       "Weingut Robert Weil"], 0,
      "It claims one of the longest unbroken records of wine sales anywhere in the world. It is planted to Riesling alone, which in the Rheingau is less a decision than a description of the region."),

    # ------------------------ california and the pacific northwest (5) ------
    Q("California and the Pacific Northwest",
      "Back labels listing every ingredient used, at a time when American law required none of it, are the habit of which Santa Cruz Mountains winery?",
      ["Ridge Vineyards", "Mount Eden Vineyards", "Rhys Vineyards", "Heitz Cellar"], 0,
      "Grapes, yeast, oak and every addition have been printed on the label since the 2011 vintage, when the winery became the first in the United States to do it, and it treats the practice as a matter of principle rather than marketing. Its Monte Bello Cabernet comes from a ridge-top vineyard above the fog line, and it also made a name for old-vine Zinfandel."),
    Q("California and the Pacific Northwest",
      "From the 1966 vintage one Napa winery put the name of the Oakville vineyard that grew the fruit onto its Cabernet label, and the wine became known for a minty, eucalyptus note. Which winery?",
      ["Heitz Cellar", "Robert Mondavi Winery", "Beaulieu Vineyard", "Freemark Abbey"], 0,
      "Martha's Vineyard was among the first Californian vineyards named on a label the way a Bordeaux estate names itself, and it made the case that site mattered in Napa. Growers still argue about whether the mint comes from trees along the edge of the block or from the vines."),
    Q("California and the Pacific Northwest",
      "Caves dug into a Napa hillside in the nineteenth century were reopened in 1965 for traditional-method sparkling wine, and the result was poured at a state banquet in Beijing in 1972. Which house?",
      ["Schramsberg", "Iron Horse Vineyards", "Domaine Chandon", "Roederer Estate"], 0,
      "It was the first house in California to take Chardonnay-based sparkling wine seriously by the traditional method, rather than making a sweet bulk-process wine. The caves were originally cut by Chinese labourers in the 1870s and are still where the second fermentation happens."),
    Q("California and the Pacific Northwest",
      "Eroica, a Riesling made in Washington State in partnership with a leading Mosel producer, comes from which winery?",
      ["Chateau Ste. Michelle", "Columbia Crest", "Quilceda Creek", "L'Ecole No 41"], 0,
      "The cold, dry, continental country east of the Cascades suits Riesling and the state grows a great deal of it. The partnership brought a German judgement about the balance of sweetness and acidity to a region that had mostly been making the grape as a simple sweet wine."),
    Q("California and the Pacific Northwest",
      "A long adobe arch and bell tower beside the highway at Oakville, put up in 1966, announced the first substantial new winery built in Napa since Prohibition. Whose was it?",
      ["The Robert Mondavi Winery", "Stag's Leap Wine Cellars", "Charles Krug", "Beringer"], 0,
      "The building was designed to be seen from the road and to receive visitors, which was itself a new idea in the valley. The same winery pressed hard for varietal labelling, for naming vineyards, and for a working relationship with the university researchers at Davis."),

    # ---------------------------------- australia and new zealand (4) -------
    Q("Australia and New Zealand",
      "First made experimentally in 1951 and matured in new American oak, one South Australian Shiraz became the wine against which the country's reds are measured. Which wine?",
      ["Grange", "John Riddoch Cabernet", "Mount Edelstone", "The Armagh"], 0,
      "It is overwhelmingly Shiraz, with a small proportion of Cabernet Sauvignon in most years, and part of the fermentation is finished in barrel. Penfolds, the house behind it, also runs a numbered bin system that lets a buyer follow one style through decades of releases."),
    Q("Australia and New Zealand",
      "Shiraz vines planted in the Eden Valley in the 1860s, in a single block facing a small stone church, give which wine?",
      ["Hill of Grace", "The Signature", "Grange", "Astralis"], 0,
      "The family that farms the block has bottled it separately since 1958 and skips the wine altogether in years the fruit does not justify it. Australia never lost plantings of that age, so blocks of nineteenth-century Shiraz are still in production there when they are rare almost everywhere else."),
    Q("Australia and New Zealand",
      "A barrel of fortified wine has been set aside in the Barossa every year since 1878, and each one is released only on reaching a hundred years of age. Which estate does that?",
      ["Seppeltsfield", "Chateau Tanunda", "Penfolds", "Yalumba"], 0,
      "The run has never been broken, so a wine of exactly a hundred years is available in every single year, which no other cellar in the world can offer. It is a tawny built on Grenache and Shiraz, thick and dark and concentrated by a century of evaporation."),
    Q("Australia and New Zealand",
      "Marlborough Sauvignon Blanc reached the London trade in the mid-1980s under one label, and international demand for the style followed from it. Which winery?",
      ["Cloudy Bay", "Brancott Estate", "Te Mata Estate", "Villa Maria"], 0,
      "It was founded in 1985 by an Australian who had tasted the region's fruit and understood what it could do abroad. A very young industry was handed one recognisable name to travel on, and the region's whole export trade was built in its wake."),

    # ------------------------------- icons beyond the classic names (4) -----
    Q("Icons beyond the classic names",
      "Cabernet Sauvignon, Cinsault and Carignan grown in the Bekaa Valley, released around seven years after the harvest, come from which estate?",
      ["Chateau Musar", "Domaine des Tourelles", "Chateau Kefraya", "Massaya"], 0,
      "The estate went on making wine through fifteen years of civil war, missing only two vintages, with the fruit trucked over the mountains to a cellar near the coast. The wines are unfiltered and high in volatile acidity by modern standards, and drinkers either love them or cannot get past them."),
    Q("Icons beyond the classic names",
      "Malbec replanted in Mendoza at heights nobody believed could ripen it, alongside published research on altitude and the grape, belongs to which family estate?",
      ["Catena Zapata", "Achaval-Ferrer", "Bodega Colome", "Zuccardi"], 0,
      "The Adrianna vineyard is farmed as mapped blocks, each picked and fermented separately, so the differences within one site can be tasted side by side. The work changed how Argentina thought about a grape that had been treated as bulk material for most of the twentieth century."),
    Q("Icons beyond the classic names",
      "Don Melchor, first bottled in 1987 and the longest-running of Chile's icon Cabernets, belongs to which producer?",
      ["Concha y Toro", "Santa Rita", "Errazuriz", "Undurraga"], 0,
      "It comes from one estate close to the Andes and is now made and cellared apart from the rest of the company's range, with its own team. Chile's whole icon category began with it, and every other major producer answered within a decade."),
    Q("Icons beyond the classic names",
      "A Stellenbosch estate on the Simonsberg foothills is the reference point for Pinotage and also bottles a Bordeaux blend called Paul Sauer. Which estate?",
      ["Kanonkop", "Boekenhoutskloof", "Rustenberg", "Meerlust"], 0,
      "Its old bush-vine Pinotage is what people mean when they argue the grape can be serious, and the style has been held steady for decades. Paul Sauer carries the name of the family who planted the property and is built on Cabernet Sauvignon."),
]
