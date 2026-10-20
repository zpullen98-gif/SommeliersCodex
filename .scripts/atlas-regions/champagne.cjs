'use strict';

// Authored teaching notes checked against the primary sources below on 2026-10-20.
// Coordinates are French government commune centres, not vineyard or appellation boundaries.
module.exports = {
  id: 'champagne',
  overview: 'Begin with the cool hills around Reims and Épernay, then follow the Marne west and the chalk country south towards the Aube. Champagne is a mosaic of sites united by an appellation and bottle fermentation. Place, grapes, harvest conditions, blending and cellar decisions all contribute to the finished wine.',
  terroir: [
    'Climate: oceanic weather brings moisture and moderation, while continental influences bring winter cold and summer heat. Spring frost, hail and wet-season disease pressure matter. Cool conditions help retain acidity, but ripeness varies by site and year; do not describe every base wine as thin or unripe.',
    'Chalk: porous chalk can store water and make it available to roots while allowing drainage. It is prominent in the Côte des Blancs, Côte de Sézanne and Vitryat. This is a growing environment, not proof that a chalky taste has travelled directly from rock into wine.',
    'Other ground: clay, marl, sand and hard limestone are also important. The Marne Valley is not uniformly chalk, and the Côte des Bar includes Jurassic limestone and marl. Treat the soil descriptions as regional tendencies rather than a geological classification for every parcel.',
    'Montagne de Reims: vineyards occupy different sides of a wooded plateau between the Vesle and Marne. Pinot Noir is prominent, but Chardonnay and Meunier also grow here. Compare the north-facing country around Verzenay with the southern flank around Bouzy before predicting ripeness from the district name.',
    'Marne and Côte des Blancs: the eastern valley near Épernay and Aÿ has substantial Pinot Noir; Meunier becomes more prominent westwards. South of Épernay, the Côte des Blancs is especially associated with Chardonnay. These are useful orientations, not exclusive planting rules.',
    'Southern and outlying vineyards: the Côte des Bar lies south-east of Troyes and is strongly associated with Pinot Noir. Montgueux, west of Troyes, is a separate chalk hill known for Chardonnay. Côte de Sézanne and the Vitryat deserve attention beyond the familiar four-district summary.'
  ],
  grapes: [
    'Pinot Noir commonly contributes body, structure and red-fruit character. Chardonnay often contributes freshness and citrus or floral notes. Meunier can contribute fruit and roundness; its later budburst can help in frost-prone sites. A grape name alone does not establish quality or a wine’s lifespan.',
    'Current authorised principal varieties: Arbane, Chardonnay, Chardonnay rose, Meunier, Petit Meslier, Pinot Blanc, Pinot Gris and Pinot Noir. Chardonnay rose was added in July 2025. The main trio still dominates plantings; older seven-grape summaries need updating.',
    'Voltis is a separate variety of interest for adaptation, subject to an agreement and controls. The usual holding limit is 5 per cent and the blend limit 10 per cent. Specified plantings near inhabited locations are excluded from the holding calculation. It is not an unrestricted ninth principal variety.',
    'Blanc de Blancs means white-grape Champagne, usually Chardonnay, rather than a guarantee of Chardonnay alone. Blanc de Noirs uses black grapes, Pinot Noir, Meunier or both. Rosé colour can come from blending in red wine or from skin contact; colour does not establish sweetness.'
  ],
  growing: [
    'Learn the yearly decisions: pruning establishes the fruiting structure; shoot positioning and canopy work manage the crop; growers monitor ripeness and fruit health before deciding when to pick. Harvest dates vary by village and variety, not simply by a fixed calendar date.',
    'Whole bunches are harvested by hand and transported carefully to the press. Gentle handling helps control unwanted extraction from skins and oxidation before pressing. Black grapes can yield white juice when contact with their coloured skins is limited.',
    'Wet seasons can require intensive disease monitoring. Frost and hail can sharply reduce yields, while hot, dry years pose different ripening challenges. A vintage report is more useful than assuming that all slopes face the same risks or that one grape is immune to frost.'
  ],
  cellar: [
    'Build the sequence: press, ferment a still base wine, select and blend, add the tirage mixture, ferment again in bottle, mature with the lees, riddle, disgorge, adjust with dosage where appropriate, and close the bottle. Bottle fermentation makes the bubbles; it is distinct from the first fermentation.',
    'Blending can combine grapes, places and harvest years. Reserve wines from earlier harvests can help maintain style and add complexity. A non-vintage label does not make a wine inferior, and a named vintage does not by itself promise greater richness or quality.',
    'Lees are the spent yeast remaining after fermentation. Their breakdown during maturation can contribute bread, pastry and other developed impressions. Riddling collects sediment in the neck; disgorgement removes it. These are separate jobs.',
    'Keep the clocks separate: release requires at least 15 months from tirage, or 36 months for vintage Champagne. Disgorgement cannot occur before 12 months from tirage. Producers often mature wines longer. Do not turn the vintage release minimum into a universal claim of 36 months on lees.',
    'Dosage helps establish the finished style. Brut is under 12 grams of sugar per litre; Extra Dry is 12 to 17, so Extra Dry is the sweeter category. Brut Nature is under 3 grams per litre with no sugar added after secondary fermentation. Ask for the actual cuvée information when precision matters.'
  ],
  service: [
    'Start with the guest: crisp and restrained, fruitier and rounder, or more mature and savoury. Then check the actual producer, cuvée, vintage and sweetness indication. A geographic story should support the recommendation, not replace knowledge of the bottle.',
    'Comité Champagne recommends about 8 to 10 °C and a tulip-shaped glass. Keep the cork controlled and the bottle pointed away from people while opening. Follow Brennan’s agreed service method, pour size and glassware; those house details are not established by this map.',
    'Tableside rehearsal: “Champagne comes from several distinct districts. This bottle’s blend and ageing shape its balance of fruit, freshness and savoury depth. I can help choose the style that suits your dish and the flavours you enjoy.” Replace the general description with verified details of the chosen wine.'
  ],
  compare: [
    'Locate Avize and Château-Thierry. Explain why Chardonnay is a useful first association for the Côte des Blancs and Meunier for the western Marne Valley, without claiming either is the only grape.',
    'Locate Verzenay and Bouzy on different flanks of the Montagne de Reims. Discuss how aspect and local conditions can change exposure; the regional name alone cannot predict a finished wine.',
    'Compare non-vintage and vintage by blending and minimum release time. Avoid equating either label with a fixed quality level or flavour profile.',
    'Explain three different ideas aloud: where the grapes grew, how the wine developed its bubbles and texture, and how sweet the finished wine is. Terroir, method and dosage answer different questions.'
  ],
  mapBounds: [3.05, 47.82, 4.95, 49.43],
  places: [
    { name: 'Reims', lon: 4.0551, lat: 49.2535, kind: 'commune', note: 'Northern city anchor beside the Montagne de Reims; a centre for Champagne houses and cellars.', sourceUrl: 'https://geo.api.gouv.fr/communes/51454?fields=nom,centre' },
    { name: 'Verzenay', lon: 4.1482, lat: 49.1588, kind: 'commune', note: 'Northern flank of the Montagne de Reims; compare its setting with Bouzy to the south.', sourceUrl: 'https://geo.api.gouv.fr/communes/51613?fields=nom,centre' },
    { name: 'Bouzy', lon: 4.1297, lat: 49.0861, kind: 'commune', note: 'Southern flank of the Montagne de Reims; useful Pinot Noir reference village.', sourceUrl: 'https://geo.api.gouv.fr/communes/51079?fields=nom,centre' },
    { name: 'Épernay', lon: 3.9282, lat: 49.0391, kind: 'commune', note: 'Marne Valley town and a starting point for the vineyards stretching south towards the Côte des Blancs.', sourceUrl: 'https://geo.api.gouv.fr/communes/51230?fields=nom,centre' },
    { name: 'Aÿ-Champagne', lon: 4.0414, lat: 49.0561, kind: 'commune', note: 'Current commune anchor for the eastern valley. This administrative centre does not identify an individual vineyard or the old village boundary.', sourceUrl: 'https://geo.api.gouv.fr/communes/51030?fields=nom,centre' },
    { name: 'Château-Thierry', lon: 3.3784, lat: 49.0556, kind: 'commune', note: 'Western Marne Valley reference town in the Aisne; Meunier is important in the surrounding district.', sourceUrl: 'https://geo.api.gouv.fr/communes/02168?fields=nom,centre' },
    { name: 'Avize', lon: 4.0056, lat: 48.9724, kind: 'commune', note: 'Côte des Blancs reference village south of Épernay, strongly associated with Chardonnay.', sourceUrl: 'https://geo.api.gouv.fr/communes/51029?fields=nom,centre' },
    { name: 'Sézanne', lon: 3.7244, lat: 48.7240, kind: 'commune', note: 'Town anchor for the Côte de Sézanne, a further Chardonnay-growing district to the south-west.', sourceUrl: 'https://geo.api.gouv.fr/communes/51535?fields=nom,centre' },
    { name: 'Vitry-le-François', lon: 4.5947, lat: 48.7292, kind: 'commune', note: 'Town anchor near the Vitryat vineyards, an eastern chalk and Chardonnay district.', sourceUrl: 'https://geo.api.gouv.fr/communes/51649?fields=nom,centre' },
    { name: 'Montgueux', lon: 3.9551, lat: 48.2967, kind: 'commune', note: 'Chalk hill west of Troyes, with a particular association with Chardonnay.', sourceUrl: 'https://geo.api.gouv.fr/communes/10248?fields=nom,centre' },
    { name: 'Bar-sur-Aube', lon: 4.7166, lat: 48.2330, kind: 'commune', note: 'Eastern Côte des Bar town anchor; distinguish it from Bar-sur-Seine farther west.', sourceUrl: 'https://geo.api.gouv.fr/communes/10033?fields=nom,centre' },
    { name: 'Les Riceys', lon: 4.3793, lat: 47.9907, kind: 'commune', note: 'Southern Côte des Bar reference commune; the still Rosé des Riceys has its own appellation.', sourceUrl: 'https://geo.api.gouv.fr/communes/10317?fields=nom,centre' }
  ],
  sources: [
    { title: 'Comité Champagne: the Champagne region and its four broad districts', url: 'https://www.champagne.fr/en/about-champagne/a-great-blended-wine/the-champagne-region' },
    { title: 'Comité Champagne: soil and subsoil', url: 'https://www.champagne.fr/en/about-champagne/the-champagne-terroir/champagne-and-its-soil' },
    { title: 'Comité Champagne: climate', url: 'https://www.champagne.fr/en/about-champagne/the-champagne-terroir/champagne-and-its-climate' },
    { title: 'Comité Champagne: topography and exposure', url: 'https://www.champagne.fr/en/about-champagne/the-champagne-terroir/champagne-and-its-topography' },
    { title: 'Comité Champagne: grape varieties', url: 'https://www.champagne.fr/en/about-champagne/a-great-blended-wine/champagne-and-its-grape-varieties' },
    { title: 'Comité Champagne: Chardonnay rose recognition, 16 October 2025', url: 'https://www.champagne.fr/fr/approfondir/mediaroom/communique-presse-champagne/le-chardonnay-rose-un-cepage-oublie-qui-retrouve' },
    { title: 'French agriculture ministry: Champagne specification approved 31 July 2025', url: 'https://info.agriculture.gouv.fr/boagri/document_administratif-677d59b2-d392-4220-9fa3-e65dbc723244' },
    { title: 'Comité Champagne: maturation with lees', url: 'https://www.champagne.fr/en/about-champagne/how-champagne-is-made/maturation' },
    { title: 'Laurent-Perrier: the purpose of reserve-wine blending', url: 'https://www.laurent-perrier.com/en/the-maison/savoir-faire/blending-reserve-wines/' },
    { title: 'Comité Champagne: production, wine styles and service questions', url: 'https://www.champagne.fr/en/champagne-frequently-asked-questions?nid=609' },
    { title: 'Comité Champagne: the tasting experience', url: 'https://www.champagne.fr/en/champagne-tasting/the-tasting-experience' },
    { title: 'Comité Champagne: wet-season growing challenges, 2024 harvest report', url: 'https://www.champagne.fr/en/find-out-more/mediaroom/champagne-press/Together-for-the-Champagne-Harvest' },
    { title: 'Comité Champagne: from terroir to wine, regional background', url: 'https://www.champagne.fr/system/files/2022-11/brochure_civc_2020_en_bd.pdf' },
    { title: 'French government geographic API: commune centres used as approximate reference points', url: 'https://geo.api.gouv.fr/decoupage-administratif/communes' }
  ]
};
