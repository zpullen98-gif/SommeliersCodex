/* ============ Introductory level: 39 study chapters ============
   Imported from cms-intro-study.html STUDY array. Each: {g:group, id, t:title,
   body: HTML}. Rendered by the level engine's html-primer branch. ============ */

/* =====================================================================
   STUDY CONTENT
   ===================================================================== */
var INTRO_CHIP = function(c){ return '<span class="chip">'+c+'</span>'; };
var INTRO_PRIMERS = [
 {g:"Foundations", id:"vit", t:"Grape Growing — Viticulture", body:`
   <p><b>Viticulture</b> = the factors that influence grape growing: nature plus human decisions in the vineyard that affect quality. <em>Climate ≠ weather</em> — climate is the long-term average.</p>
   <h4>Climate</h4>
   <p>Types: ${INTRO_CHIP('Continental')}${INTRO_CHIP('Maritime')}${INTRO_CHIP('Mediterranean')}${INTRO_CHIP('Desert/Arid')} · Descriptors: cool, moderate, warm, hot.</p>
   <p>Most regions sit between <b>30–50°</b> latitude. Outliers exist thanks to <b>moderators</b>: altitude, diurnal shifts, sunshine hours, bodies of water, wind, rain-shadow effect.</p>
   <h4>Soil — match these</h4>
   <p>${INTRO_CHIP('Champagne')}${INTRO_CHIP('Chablis')}${INTRO_CHIP("Côte d'Or")}${INTRO_CHIP('Haut-Médoc')}${INTRO_CHIP('Pomerol')}${INTRO_CHIP('St-Émilion')}${INTRO_CHIP('Châteauneuf-du-Pape')}${INTRO_CHIP('Mosel')}</p>
   <h4>The vine</h4>
   <p>Genus <b>Vitis</b>; quality species is <b>Vitis vinifera</b> (~10,000 varieties). <b>Botrytis cinerea</b> = noble rot (can be good). <b>Phylloxera</b> = vine louse (pest).</p>
   <h4>Other factors</h4>
   <ul><li><b>Yield</b> — tons/acre or hectoliters/hectare.</li>
   <li><b>Harvest</b> — sugar measured in <b>Brix</b>; hand or machine.</li>
   <li><b>Terroir</b> — <em>goût de terroir</em>, the sum of environmental impacts.</li></ul>`},

 {g:"Foundations", id:"vin", t:"Winemaking — Vinification", body:`
   <p><b>Vinification</b> = winery decisions from harvest to bottling. Driven by goal, style, price, law, sustainability.</p>
   <h4>Steps</h4>
   <ul>
   <li><b>White:</b> Crush → Press → Ferment → Fine/Filter → Bottle.</li>
   <li><b>Red:</b> Crush → Macerate → Ferment (skin contact) → Press → Age → Fine/Filter → Bottle → Bottle age.</li>
   <li><b>Rosé:</b> Crush red grapes → short skin contact → Press → Ferment → Bottle.</li></ul>
   <p><b>Three rosé methods:</b> maceration, blending (sparkling), saignée (largely obsolete).</p>
   <h4>Fermentation</h4>
   <p>Sugar + Yeast → Alcohol + CO₂ + Heat + Aromas + Flavors. Vessels: wood, stainless steel, concrete.</p>
   <h4>Closures</h4>
   <p>Cork · composites · screw cap (${INTRO_CHIP('Stelvin')}) · glass top (${INTRO_CHIP('Vinolok')}).</p>`},

 {g:"France", id:"bordeaux", t:"Bordeaux", body:`
   <p>SW France, Atlantic coast. Maritime → continental inland. Water: Atlantic, Gironde Estuary, Garonne &amp; Dordogne rivers.</p>
   <table class="t"><tr><th></th><th>Grapes</th></tr>
   <tr><td><b>White</b></td><td>Sauvignon Blanc, Sémillon (+ Muscadelle)</td></tr>
   <tr><td><b>Red</b></td><td>Cabernet Sauvignon, Merlot, Cabernet Franc (+ Malbec, Petit Verdot, Carménère)</td></tr></table>
   <p><b>Soil:</b> gravel, clay, limestone, sand — <em>Cab Sauv in gravel, Merlot in clay.</em></p>
   <h4>Appellations</h4>
   <p><b>Left Bank:</b> Médoc, Haut-Médoc; communes ${INTRO_CHIP('Margaux')}${INTRO_CHIP('Pauillac')}${INTRO_CHIP('St-Estèphe')}${INTRO_CHIP('St-Julien')}. Graves → Pessac-Léognan, Sauternes.<br>
   <b>Right Bank:</b> Pomerol, St-Émilion, St-Émilion Grand Cru.</p>
   <h4>1855 Classification</h4>
   <p>Only one change ever: <b>Mouton Rothschild</b> raised 2nd → 1st Growth in <b>1973</b>. First Growths: Lafite, Latour, Mouton Rothschild, Margaux, Haut-Brion.</p>
   <p><b>Pomerol:</b> no classification. <b>St-Émilion:</b> multi-tiered, revised, controversial. <b>Cru Bourgeois:</b> from the 1930s, three levels.</p>
   <div class="trap"><b>Pomerol has no classification.</b> The famous Right-Bank names (Petrus, Lafleur) are reputation, not rank.</div>`},

 {g:"France", id:"burgundy", t:"Burgundy", body:`
   <p>Five non-contiguous regions in eastern France. <b>Cool Continental.</b> Whites: Chardonnay, Aligoté. Reds: Pinot Noir, Gamay.</p>
   <p><b>Soil:</b> Chablis &amp; Côte d'Or = limestone/clay; Beaujolais = granite.</p>
   <h4>Five regions (W→E)</h4>
   <p>1. Chablis · 2. Côte d'Or (Côte de Nuits + Côte de Beaune) · 3. Côte Chalonnaise · 4. Mâconnais · 5. Beaujolais</p>
   <h4>Hierarchy</h4>
   <p>Regional (Bourgogne) → Villages → Premier Cru → Grand Cru.</p>
   <p><b>Côte de Nuits villages:</b> Gevrey-Chambertin, Morey-St.-Denis, Chambolle-Musigny, Vougeot, Vosne-Romanée, Nuits-St.-Georges.<br>
   <b>Côte de Beaune villages:</b> Pommard, Volnay, Meursault, Chassagne-Montrachet, Puligny-Montrachet.<br>
   Recognize Grand Cru ${INTRO_CHIP('Les Clos')} (Chablis) and Cru ${INTRO_CHIP('Morgon')} (Beaujolais).</p>
   <p><b>Label terms:</b> Négociant, Domaine, Clos, Monopole, Vieilles Vignes.</p>`},

 {g:"France", id:"loire", t:"Loire Valley", body:`
   <p>Atlantic coast → central France; the Loire is France's longest river. Four regions W→E.</p>
   <table class="t"><tr><th>Region</th><th>Grapes</th><th>Key AOPs</th></tr>
   <tr><td>Pays Nantais</td><td>Melon B (Melon de Bourgogne)</td><td>Muscadet, Muscadet de Sèvre-et-Maine</td></tr>
   <tr><td>Anjou-Saumur</td><td>Chenin Blanc, Cabernet Franc</td><td>Saumur, Savennières, Quarts-de-Chaume, Bonnezeaux</td></tr>
   <tr><td>Touraine</td><td>Chenin Blanc, Cabernet Franc</td><td>Chinon, Bourgueil, Vouvray</td></tr>
   <tr><td>Central Vineyards</td><td>Sauvignon Blanc, Pinot Noir</td><td>Sancerre, Pouilly-Fumé</td></tr></table>
   <p>Muscadet ages <b>sur lie</b>. Vouvray spans sparkling/dry/off-dry/sweet. Soil: Tuffeau in Vouvray.</p>
   <div class="trap"><b>Pouilly-Fumé</b> = Loire, Sauvignon Blanc. <b>Pouilly-Fuissé</b> = Burgundy/Mâconnais, Chardonnay.</div>`},

 {g:"France", id:"rhone", t:"Rhône Valley", body:`
   <p>Between Burgundy &amp; Provence; ~30-mile gap between N and S. The <b>Mistral</b> wind matters.</p>
   <table class="t"><tr><th></th><th>North</th><th>South</th></tr>
   <tr><td>Climate</td><td>Moderate Continental</td><td>Mediterranean</td></tr>
   <tr><td>Soil</td><td>Decomposed granite, schist</td><td><b>Galets</b>, alluvial, limestone</td></tr>
   <tr><td>White</td><td>Viognier, Marsanne, Roussanne</td><td>Grenache Blanc</td></tr>
   <tr><td>Red</td><td>Syrah</td><td>Grenache, Mourvèdre</td></tr>
   <tr><td>Style</td><td>Co-fermented</td><td>Blended</td></tr></table>
   <p><b>North AOPs:</b> Côte-Rôtie, Crozes-Hermitage, Hermitage, St.-Joseph, Condrieu, Cornas.<br>
   <b>South tiers:</b> Côtes-du-Rhône → CdR Villages → Crus (Châteauneuf-du-Pape, Tavel, Gigondas, Vacqueyras, Muscat de Beaumes-de-Venise).</p>`},

 {g:"France", id:"champagne", t:"Champagne", body:`
   <p>49th parallel, one of the northernmost regions. <b>Cool Continental</b>, no Atlantic protection. Soil: limestone, chalk. Grapes: Chardonnay; Pinot Noir, Meunier.</p>
   <h4>Champagne Method</h4>
   <p>1. Still wine → 2. Assemblage of cuvée → 3. Bubbles via <b>liqueur de tirage</b> → 4. Sur lie aging / <b>autolysis</b> → 5. Riddling (<b>rémuage</b>) → 6. Disgorging (<b>dégorgement</b>) → 7. Dosage via <b>liqueur d'expédition</b>.</p>
   <h4>Wine law</h4>
   <p>Subregions: Vallée de la Marne, Côte des Blancs, Montagne de Reims. NV = <b>15 months</b> total (12 on lees); Vintage = <b>36 months</b> total. Échelle des Crus = Grand/Premier Cru villages.</p>
   <p><b>Producers:</b> Moët &amp; Chandon, Roederer, Veuve Clicquot, Taittinger, Charles Heidsieck, Krug. Riddling rack credited to Madame Clicquot.</p>
   <div class="trap"><b>Sweetness, driest → sweetest:</b> Brut Nature · Extra Brut · Brut · <b>Extra Dry</b> · Sec · Demi-Sec · Doux. Extra Dry is <em>sweeter</em> than Brut.</div>`},

 {g:"France", id:"alsace", t:"Alsace", body:`
   <p>NE France, German border. Cool continental, dry/sunny — the <b>Vosges Mountains</b> create a rain shadow. Very diverse soils.</p>
   <p>Whites: Riesling, Gewurztraminer, Pinot Gris, Muscat. Red: Pinot Noir. Aged in neutral <b>foudre</b>; little new oak.</p>
   <p>If a grape is named, the wine is <b>100%</b> that variety. Bottled in the tall <b>Flûte d'Alsace</b>.</p>
   <h4>Appellations</h4>
   <p><b>Alsace Grand Cru</b> — 51 vineyards; traditional 4 grapes (Riesling, Pinot Gris, Gewurztraminer, Muscat) — <b>Pinot Noir added as the 5th from 2022</b>. Crémant d'Alsace = traditional-method sparkling.</p>
   <p><b>VT</b> (Vendange Tardive) = late harvest, not always sweet. <b>SGN</b> (Sélection de Grains Nobles) = botrytis, top vintages only.</p>`},

 {g:"Italy", id:"piedmont", t:"Piedmont", body:`
   <p>Swiss/French border. <b>Continental.</b> "Foothills of the Alps." Tanaro River, Langhe Hills. Whites: Moscato, Arneis, Cortese. Reds: Nebbiolo, Barbera, Dolcetto, Brachetto.</p>
   <h4>Key DOCGs</h4>
   <ul><li><b>Barolo</b> / <b>Barbaresco</b> — dry red, Nebbiolo (aged in large barrels; aging laws apply).</li>
   <li><b>Moscato d'Asti</b> — off-dry, semi-sparkling, Moscato.</li>
   <li><b>Gavi</b> — dry white, Cortese.</li>
   <li><b>Barbera d'Asti</b> — dry red, Barbera.</li></ul>
   <p><b>Nebbia</b> = local fog. Terms: Normale, Riserva.</p>
   <div class="trap"><b>Vino Nobile di Montepulciano</b> = Tuscany, Sangiovese. <b>Montepulciano d'Abruzzo</b> = the grape, in Abruzzo.</div>`},

 {g:"Italy", id:"lombardy", t:"Lombardy & Emilia-Romagna", body:`
   <p>Lombardy (Swiss border); Emilia-Romagna straddles N/Central. <b>Cool Continental.</b></p>
   <h4>Franciacorta DOCG</h4>
   <p>Pinot Nero, Chardonnay, Pinot Bianco. <b>Metodo Classico</b> spumante; min 18 months on lees. Compared to Champagne.</p>
   <h4>Lambrusco</h4>
   <p>Frizzante or spumante; commonly <b>cuve close</b> (can be Metodo Classico / Methode Ancestrale).</p>`},

 {g:"Italy", id:"northeast", t:"Trentino-Alto Adige / Friuli / Veneto", body:`
   <p>TAA = Austria/Switzerland border; Friuli = Slovenia border; Veneto = Venice &amp; Verona. TAA/Friuli cool continental; Veneto cool Mediterranean.</p>
   <p>TAA/Friuli emphasize <b>single-variety</b> wines named on the label. Veneto grapes: Garganega, Glera, Corvina, Rondinella.</p>
   <h4>Veneto wines</h4>
   <ul><li><b>Prosecco DOC</b> — spumante, <b>Charmat method</b>, Glera.</li>
   <li><b>Soave DOC / Superiore DOCG</b> — dry white, mostly Garganega.</li>
   <li><b>Valpolicella DOC</b> — dry red, Corvina + Rondinella.</li>
   <li><b>Amarone della Valpolicella DOCG</b> — <b>Appassimento</b> (dried grapes), min <b>14% abv</b>.</li></ul>`},

 {g:"Italy", id:"tuscany", t:"Tuscany", body:`
   <p>Ligurian Sea → Apennine foothills. Reds: Sangiovese, Brunello/Sangiovese Grosso. Soil: Galestro. Sangiovese = moderate color, tart acidity &gt; tannin.</p>
   <p><b>Appellations:</b> Chianti, Chianti Classico, Brunello di Montalcino, Rosso di Montalcino, Vin Santo (all DOCG except Vin Santo here).</p>
   <p><b>Terms:</b> Superiore (more alcohol), Classico (classic center), Riserva (longer aging), Gran Selezione.<br>
   <b>Super Tuscan:</b> Bordeaux blends, Bordeaux + Sangiovese, or pure Sangiovese. Gallo Nero on Chianti Classico.</p>`},

 {g:"Italy", id:"southitaly", t:"Central & Southern Italy", body:`
   <p>Central = Maritime coast / Continental inland; South = Mediterranean. Campania soil = volcanic.</p>
   <p>Whites: Fiano, Greco, Verdicchio. Reds: Aglianico, Montepulciano, Sagrantino, Primitivo.</p>
   <ul><li><b>Umbria:</b> Sagrantino di Montefalco DOCG.</li>
   <li><b>Abruzzo:</b> Montepulciano d'Abruzzo DOC.</li>
   <li><b>Campania:</b> Taurasi DOCG, Greco di Tufo DOCG, Fiano di Avellino DOCG.</li></ul>`},

 {g:"Italy", id:"islands", t:"Sicily & Sardinia", body:`
   <p>Mediterranean islands. <b>Mt. Etna</b> — volcanic soil.</p>
   <p><b>Sicily:</b> Carricante (W); Nerello Mascalese, Nero d'Avola, Frappato (R).<br>
   <b>Sardinia:</b> Vermentino (W); Cannonau (R).</p>`},

 {g:"Spain", id:"galicia", t:"Galicia", body:`
   <p>NW Iberian Peninsula ("Green Spain"). Maritime, humid, cooler. Water: Atlantic, Miño/Minho. <em>Rías Baixas = "low estuaries."</em></p>
   <p>High canopy trellising (humidity); modern stainless steel; lees aging. White: <b>Albariño</b>.</p>
   <p><b>Rías Baixas DO:</b> wines labeled Albariño must be <b>100%</b> Albariño. Classic with shellfish &amp; bivalves.</p>`},

 {g:"Spain", id:"rioja", t:"La Rioja", body:`
   <p>North Central Spain. Cantabrian rain shadow; <b>Continental</b>. Ebro River. Traditionally aged in <b>American oak</b>.</p>
   <p>White: Viura. Reds: Tempranillo, Garnacha.</p>
   <p><b>La Rioja DOCa.</b> Subzones: Rioja Alta, Rioja Oriental, Rioja Alavesa.<br>
   Aging tiers (ascending): <b>Crianza → Reserva → Gran Reserva</b>.</p>`},

 {g:"Spain", id:"castilla", t:"Castilla y León", body:`
   <p>North Central Spain; high-altitude meseta; <b>Continental</b> with extreme diurnal shifts. <b>Duero River</b> (= Douro in Portugal).</p>
   <p>Whites: Verdejo, Sauvignon Blanc. Red: Tempranillo (synonyms Tinta del País, Tinta de Toro).</p>
   <ul><li><b>Toro DO</b> — ripe Tempranillo reds.</li>
   <li><b>Ribera del Duero DO</b> — Tempranillo blends, Crianza/Reserva/Gran Reserva.</li>
   <li><b>Rueda DO</b> — fresh Verdejo + Sauvignon Blanc whites.</li></ul>`},

 {g:"Spain", id:"catalonia", t:"Catalonia", body:`
   <p>NE Spain, Pyrenees foothills, near Barcelona. Priorat = hot/dry Mediterranean, terraced, <b>Llicorella</b> soil.</p>
   <ul><li><b>Cava DO</b> — traditional-method sparkling; native grapes <b>Xarel-lo, Parellada, Macabeo</b>; gyropalette (a Spanish invention).</li>
   <li><b>Priorat DOCa</b> — powerful dry reds: <b>Garnacha, Cariñena</b> + international; French oak.</li></ul>
   <p>Priorat is a modern style, not traditional.</p>`},

 {g:"Iberia & Central Europe", id:"portugal", t:"Portugal", body:`
   <p>W Iberian Peninsula. Maritime (Atlantic) → warm continental inland. <b>Douro River</b>; schist soils, terraces.</p>
   <p>Grapes: Vinho Verde = Alvarinho; Madeira = Sercial/Verdelho/Bual/Malmsey; Douro/Porto = Touriga Nacional.</p>
   <ul><li><b>Vinho Verde DOP</b> — low alcohol, slight fizz.</li>
   <li><b>Douro DOP</b> — bold dry reds.</li>
   <li><b>Porto DOP</b> — fortified sweet red.</li>
   <li><b>Madeira DOP</b> — fortified white; dry → sweet.</li></ul>`},

 {g:"Iberia & Central Europe", id:"germany", t:"Germany", body:`
   <p>SW corner, vineyards at <b>49°N+</b>. <b>Cool Continental.</b> Rhine + tributaries moderate; Mosel soil = <b>slate</b>. White: Riesling (most important). Red: Spätburgunder (Pinot Noir). <b>Chaptalization</b> = adding sugar to must to raise alcohol.</p>
   <h4>Classification</h4>
   <p>Deutscher Wein → Landwein → <b>Qualitätswein</b> (13 Anbaugebiete) → <b>Prädikatswein</b> (by ripeness at harvest; no chaptalization).</p>
   <h4>Six Prädikate (ascending ripeness)</h4>
   <p>1. Kabinett · 2. Spätlese · 3. Auslese · 4. Beerenauslese (BA) · 5. <b>Eiswein</b> · 6. Trockenbeerenauslese (TBA)</p>
   <p><b>Anbaugebiete:</b> Mosel (slate, Riesling — Erden, Ürzig, Wehlen, Bernkastel-Kues, Piesport), Pfalz, Rheinhessen (largest), Rheingau (Johannisberg).</p>
   <div class="trap"><b>Eiswein vs. BA:</b> same must-weight floor — but Eiswein concentrates by <b>freezing</b> (no botrytis), BA by <b>noble rot</b>.</div>`},

 {g:"Iberia & Central Europe", id:"austria", t:"Austria", body:`
   <p>Eastern Austria. <b>Continental.</b> Danube River, steep hillsides. Very dry OR very sweet whites; little new oak. White: <b>Grüner Veltliner</b>.</p>
   <p>Hierarchy: Wein → Landwein → Qualitätswein → <b>DAC</b> (appellation, dry-focused) → Prädikatswein (rare). Region: Niederösterreich — <b>Kamptal, Kremstal, Wachau DAC</b>. Recognize the Austrian capsule (banderole).</p>
   <div class="trap"><b>Austrian Kabinett</b> is a <b>Qualitätswein</b> level (dry) — not a Prädikat as it is in Germany.</div>`},

 {g:"Iberia & Central Europe", id:"hungary", t:"Hungary", body:`
   <p>East of Austria. The Bodrog River brings humidity to <b>Tokaj</b>. <b>Puttonyos</b> = the traditional aszú basket; <b>Aszú</b> = shrivelled botrytis berries. White: Furmint. Tokaji bottled in <b>500ml</b>.</p>`},

 {g:"North America", id:"calnorth", t:"California — North Coast", body:`
   <p>Coastal counties N of San Pablo Bay. Extensive new French (sometimes American) oak; MLF on Chardonnay; traditional-method sparkling in cool zones (Carneros, Anderson Valley).</p>
   <p>Whites: Chardonnay, Sauvignon Blanc. Reds: Pinot Noir, Merlot, Cab Sauv, Zinfandel, Syrah.</p>
   <h4>AVAs by county</h4>
   <ul><li><b>Mendocino:</b> Anderson Valley.</li>
   <li><b>Sonoma:</b> Carneros, Sonoma Coast, Alexander Valley, Russian River Valley, Dry Creek Valley.</li>
   <li><b>Napa:</b> Carneros, Stags Leap District, Oakville, Rutherford, Howell Mountain.</li></ul>
   <div class="trap"><b>US labeling:</b> 75% variety · 85% AVA · 95% vintage · 95% single-vineyard · 100% estate (same county). "Reserve" has no legal meaning.</div>`},

 {g:"North America", id:"calcentral", t:"California — Central Coast", body:`
   <p>Coastal counties S of San Francisco Bay, N of Santa Barbara city. Monterey &amp; Santa Barbara = cool maritime; <b>Paso Robles</b> = warm continental, big diurnal shifts.</p>
   <p>AVAs: Monterey County; Paso Robles (San Luis Obispo); Santa Barbara County. Same US labeling percentages.</p>`},

 {g:"North America", id:"newyork", t:"New York State", body:`
   <p>NE US, Continental with lake/river/Atlantic moderation. <b>Finger Lakes AVA</b> — deep glacial lakes. Whites: Riesling, Gewürztraminer, Chardonnay. Reds: Pinot Noir, Merlot, Cab Franc. History: Dr. Konstantin Frank.</p>`},

 {g:"North America", id:"pnw", t:"Pacific Northwest", body:`
   <p>Willamette Valley (OR, cool Mediterranean/maritime) &amp; Columbia Valley (WA, warm desert). Rain shadows from Coastal Range + Cascades; Columbia needs irrigation.</p>
   <p>Soil: Willamette = volcanic/marine sediment; Columbia = gravel.</p>
   <p>Willamette: Pinot Noir, Pinot Gris (most planted), Chardonnay, Riesling. Columbia: Chardonnay, Riesling, Merlot, Cab Sauv, Syrah.</p>
   <p><b>Oregon law:</b> 90% variety (with exceptions like Cab Sauv, Merlot), 95% AVA. History: David Lett (Eyrie Vineyards).</p>`},

 {g:"North America", id:"canada", t:"Canada", body:`
   <p>Cool/Continental/Desert. Winter-hardy varieties; hybrids like <b>Vidal</b>. No national law; <b>VQA</b> regulates. <b>Ice Wine</b> — leading global producer, <b>90% from Ontario</b>, frozen grapes on the vine (Riesling, Cab Franc, Vidal). Producer: Inniskillin.</p>`},

 {g:"North America", id:"mexico", t:"México", body:`
   <p>Hot Mediterranean → semi-desert. Pacific fog; sandy soils keep out phylloxera. Key region: <b>Baja California – Valle de Guadalupe</b> (~90% of production). Oldest wine industry outside Europe; no wine laws.</p>`},

 {g:"South America & Southern Hemisphere", id:"chile", t:"Chile", body:`
   <p>W coast of South America, 17–53°S. Moderators: Atacama, Pacific, Andes, Coastal Range, <b>Humboldt Current</b>. Sandy soils → <b>no phylloxera</b>, mostly ungrafted. Signature red: <b>Carménère</b>.</p>
   <p><b>DO</b> = origin only. Aconcagua → Casablanca (cool). Valle Central (80% of production) → Valle de Maipo (Cab Sauv). Producers: Concha y Toro, Santa Rita, Errázuriz.</p>`},

 {g:"South America & Southern Hemisphere", id:"argentina", t:"Argentina", body:`
   <p>E of Andes. Continental → arid; Andes rain shadow. <b>Salta</b> = highest elevation (Cafayate → Torrontés); <b>Mendoza</b> = Luján de Cuyo, Uco Valley → <b>Malbec</b>. Patagonia = cool. 85% min to list variety. Producer: Catena.</p>`},

 {g:"South America & Southern Hemisphere", id:"safrica", t:"South Africa", body:`
   <p>Western Cape. Maritime → Mediterranean/hot inland. <b>Cape Doctor</b> wind &amp; cold Atlantic currents. Whites: Chenin Blanc, Chardonnay, Sauvignon Blanc. Reds: Syrah, Pinot Noir, <b>Pinotage</b> (Cinsault × Pinot Noir).</p>
   <p><b>Wine of Origin (WO):</b> single appellation = 100%. Hierarchy: Geographical Unit → Region → District → Ward. <b>KWV</b> historic co-op. Coastal Region: Stellenbosch, Paarl, Constantia.</p>`},

 {g:"South America & Southern Hemisphere", id:"nz", t:"New Zealand", body:`
   <p>North &amp; South Islands. <b>Marlborough</b> = cool maritime (Sauvignon Blanc); Central Otago = cool continental (Pinot Noir); Hawke's Bay = moderate maritime. <b>Gimblett Gravels</b> = gravel. Clean modern winemaking, screwcaps.</p>
   <p>GIs = trademark only. 85% min to list variety. Whites unoaked, high intensity + acidity. Producers: Cloudy Bay, Felton Road, Villa Maria.</p>`},

 {g:"South America & Southern Hemisphere", id:"australia", t:"Australia", body:`
   <p>Cool maritime → hot/arid. Traditional = cross-region blending + American oak; Modern = single GI + French oak. Whites: Riesling, Chardonnay, Sauvignon Blanc/Semillon. Reds: Shiraz, Grenache, Cab Sauv.</p>
   <p>GI = origin only; Australia → State → Zone → Region → Sub-Region. 85% labeling. <b>South Eastern Australia</b> = high-volume super-GI. South Australia: Barossa, McLaren Vale, Clare, Eden. Producer: Penfold's Grange. Coonawarra soil = Terra Rossa.</p>`},

 {g:"Across the Cellar", id:"sparkling", t:"World Sparkling Wines", body:`
   <table class="t"><tr><th>Method</th><th>Where 2nd fermentation happens</th><th>Examples</th></tr>
   <tr><td><b>Classic / Traditional</b></td><td>In the bottle (riddled, disgorged)</td><td>Champagne, Crémant, Cava, Franciacorta</td></tr>
   <tr><td><b>Transfer</b></td><td>In bottle, then disgorged into tanks under pressure</td><td>Very large/small formats</td></tr>
   <tr><td><b>Charmat / Cuve Close</b></td><td>In pressurized tanks</td><td>Prosecco, Moscato d'Asti, Lambrusco</td></tr>
   <tr><td><b>Méthode Ancestrale</b></td><td>Single ferment finished in bottle</td><td>Pét-Nat</td></tr></table>
   <p><b>Crémant</b> = French traditional-method sparkling made <b>outside Champagne</b> (Bourgogne, Alsace, Loire).</p>`},

 {g:"Across the Cellar", id:"sweet", t:"Sweet Wines", body:`
   <h4>Noble rot (Botrytis)</h4>
   <table class="t"><tr><th>Region</th><th>Wine</th><th>Grape</th></tr>
   <tr><td>Bordeaux</td><td>Sauternes</td><td>Sémillon</td></tr>
   <tr><td>Alsace</td><td>VT / SGN</td><td>Riesling, Pinot Gris, Gewürz, Muscat</td></tr>
   <tr><td>Germany</td><td>Auslese, BA, TBA</td><td>Riesling</td></tr>
   <tr><td>Loire</td><td>Quarts-de-Chaume, Bonnezeaux, Vouvray Moelleux</td><td>Chenin Blanc</td></tr>
   <tr><td>Hungary</td><td>Tokaji Aszú</td><td>Furmint</td></tr></table>
   <h4>Drying (Appassimento)</h4>
   <p>Italy: Vin Santo (Trebbiano), Recioto di Soave (Garganega), Recioto della Valpolicella (Corvina).</p>
   <h4>Freezing</h4>
   <p>Germany/Austria = Eiswein; Canada = Icewine. Must be <b>free of noble rot</b>.</p>`},

 {g:"Across the Cellar", id:"fortified", t:"Fortified Wines", body:`
   <table class="t"><tr><th>Wine</th><th>Region</th><th>Fortified</th></tr>
   <tr><td><b>Port</b></td><td>Douro, Portugal (schist)</td><td>During fermentation</td></tr>
   <tr><td><b>Madeira</b></td><td>Madeira (volcanic)</td><td>During fermentation; oxidized, heated</td></tr>
   <tr><td><b>Sherry</b></td><td>Jerez (Albariza chalk)</td><td>After fermentation; oxidized</td></tr>
   <tr><td><b>Marsala</b></td><td>Sicily</td><td>—</td></tr></table>
   <p>French <b>Vins Doux Naturels</b>: Banyuls (Grenache), Muscat de Beaumes-de-Venise — made by <b>mutage</b>.</p>
   <p><b>Madeira, driest → sweetest:</b> Sercial → Verdelho → Bual → Malmsey. <b>Port:</b> Ruby (Basic, LBV, Single Quinta, Vintage) &amp; Aged Tawny (10/20/30/40-yr).</p>`},

 {g:"Beyond Wine", id:"beer", t:"Beer", body:`
   <p>Fermented from cereal grains (mainly <b>barley</b>), water, hops, yeast. <b>Ales</b> = top-fermenting (fruity/spicy). <b>Lagers</b> = bottom-fermenting (clean, crisp). Hops add aroma, flavor, bitterness; act as preservative.</p>
   <p>Ales: Hefeweizen, Pale Ale, IPA, Porter, Stout, Lambic, Wit. Lagers: Pilsner (Czech origin), Bock, Doppelbock, Oktoberfest.</p>`},

 {g:"Beyond Wine", id:"sake", t:"Sake", body:`
   <p>Fermented from <b>rice</b>, mostly Japan. <b>Koji-kin</b> (<em>Aspergillus oryzae</em>) converts starch → sugar; yeast → alcohol (~15–22% abv). Premium tiers: <b>Junmai, Honjozo, Ginjo, Daiginjo</b>. <b>Junmai = no added alcohol.</b></p>`},

 {g:"Beyond Wine", id:"spirits", t:"Spirits & Liqueurs", body:`
   <h4>Clear &amp; agave</h4>
   <p>Vodka (anywhere, often grain) · Rum (sugarcane/molasses) · Gin (neutral grain + juniper) · <b>Tequila</b> (Jalisco, blue agave; Blanco/Reposado/Añejo) · <b>Mezcal</b> (Oaxaca, smoky pit-roast).</p>
   <h4>Whisk(e)y</h4>
   <p>Bourbon (51% corn, new charred American oak) · Tennessee (maple-charcoal filtered) · Irish (barley, triple pot) · <b>Scotch</b> (barley; Islay = smokiest; peat).</p>
   <h4>Brandy</h4>
   <p>Cognac &amp; Armagnac (Ugni Blanc, France) · Calvados (apples/pears) · Eaux de Vie (fruit, unaged) · Grappa/Marc (pomace).</p>`},
];
