'use strict';
/* Human-reviewed disambiguation of settlement centres. IDs come from the
   pinned GeoNames extracts. lesson is an existing regional-guide heading.
   A settlement can orient a named wine district without defining its boundary. */
module.exports={
 // Natural Earth's 1:10m coastline omits Thirasia. Keep its lesson readable,
 // but do not draw town dots in apparent water or invent an island outline.
 excludedIds:{santorini:[252916,10400367]},
 preferred:{
  loire:['Nantes','Savennières','Saumur','Chinon','Bourgueil','Vouvray','Montlouis-sur-Loire','Sancerre','Menetou-Salon','Pouilly-sur-Loire'],
  burgundy:['Chablis','Gevrey-Chambertin','Vosne-Romanée','Nuits-Saint-Georges','Beaune','Meursault','Puligny-Montrachet','Chassagne-Montrachet','Mercurey','Mâcon'],
  bordeaux:['Saint-Estèphe','Pauillac','Saint-Julien-Beychevelle','Margaux','Pessac','Léognan','Saint-Émilion','Pomerol','Sauternes','Barsac'],
  alsace:['Barr','Mittelbergheim','Colmar','Ribeauvillé','Riquewihr','Kaysersberg','Turckheim','Eguisheim','Rouffach','Thann'],
  piedmont:['Barolo','La Morra','Serralunga d’Alba','Monforte d’Alba','Barbaresco','Neive','Alba','Asti','Gavi','Carema'],
  rhone:['Condrieu','Cornas','Crozes-Hermitage','Saint-Péray','Châteauneuf-du-Pape','Gigondas','Vacqueyras','Cairanne','Tavel','Vinsobres']
 },
 omit:{
  loire:['Touraine'],
  burgundy:['Musigny'],
  rhone:['La Crau','Saint-Joseph'],
  provence:['Pierrefeu and Notre-Dame des Anges'],
  bordeaux:['Graves','Saint-Julien','Castillon and Francs Côtes de Bordeaux'],
  lombardy:['Grumello','Inferno','Valgella','San Colombano'],
  abruzzo:['Molise, the neighbour to the south'],
  puglia:['Salento'],
  'vinho-verde':['Sousa','Lima','Basto','Cávado and Ave'],
  dao:['Castendo and Alva','Terras de Senhorim','Terras de Azurara','Besteiros'],
  tejo:['Bairro','Campo','Charneca'],
  pfalz:['Kalkofen','Kirchenstück','Jesuitengarten','Ungeheuer','Pechstein','Hohenmorgen'],
  'wachau-kamptal-kremstal':['Wagram','Spitzer Graben'],
  'long-island':['The Hamptons, Long Island'],
  'margaret-river':['Geographe'],
  badacsony:['Zala']
 },
 pick:{
  loire:[{id:2967612,lesson:'Vouvray'}],
  burgundy:[
   {id:2981274,lesson:'Saint-Bris'},{id:2995489,lesson:'Marsannay'},
   {id:2967726,lesson:'Volnay'},{id:2981610,lesson:'Saint-Aubin'},
   {id:3015894,lesson:'Givry'},{id:2993110,lesson:'Montagny'}
  ],
  provence:[{id:2987297,lesson:'Pierrefeu and Notre-Dame des Anges'}],
  bordeaux:[
   {id:2980317,lesson:'Saint-Estèphe'},{id:3225388,lesson:'Saint-Julien'},
   {id:2980392,lesson:'Saint-Émilion'},{id:3034807,lesson:'Barsac'},
   {id:2987805,lesson:'Pessac-Léognan'},{id:3003067,lesson:'Pessac-Léognan'},
   {id:3016969,lesson:'Fronsac and Canon-Fronsac'},{id:2986435,lesson:'Pomerol'}
  ],
  lombardy:[
   {id:3166397,lesson:'Valtellina'},{id:3165647,lesson:'Valtellina'},
   {id:3175447,lesson:'Franciacorta'},{id:6534541,lesson:'Franciacorta'},
   {id:6534214,lesson:'Moscato di Scanzo'},{id:3168463,lesson:'San Colombano'},
   {id:3166499,lesson:'Lugana'},{id:3179745,lesson:'Oltrepò Pavese'}
  ],
  veneto:[{id:3166468,lesson:'Soave'}],
  friuli:[{id:3219957,lesson:'Prepotto'}],
  umbria:[{id:3172941,lesson:'Montefalco'}],
  campania:[{id:6535641,lesson:'Tufo'}],
  navarra:[
   {id:3115162,lesson:'Ribera Alta'},{id:3122762,lesson:'Tierra Estella'},
   {id:3112732,lesson:'Valdizarbe'},{id:3107418,lesson:'Ribera Baja'},
   {id:3110327,lesson:'Baja Montaña'}
  ],
  'vinho-verde':[{id:2737523,lesson:'Monção'}],
  douro:[
   {id:2736223,lesson:'Pinhão'},{id:2736316,lesson:'Baixo Corgo'},
   {id:2732546,lesson:'Douro Superior'},{id:2734483,lesson:'Cima Corgo'}
  ],
  lisboa:[{id:2265485,lesson:'Óbidos'},{id:2266961,lesson:'Lourinhã'}],
  tejo:[{id:2263480,lesson:'Santarém'},{id:2271926,lesson:'Almeirim'}],
  alentejo:[{id:2268406,lesson:'Évora'},{id:2265686,lesson:'Moura'}],
  'central-coast':[
   {id:5393052,lesson:'Santa Cruz Mountains'},{id:5363208,lesson:'Monterey'},
   {id:5393180,lesson:'Santa Maria Valley'},{id:5392952,lesson:'Santa Barbara County'},
   {id:5367788,lesson:'Sta. Rita Hills'},{id:5368559,lesson:'Los Olivos District'}
  ],
  'columbia-valley':[
   {id:5816605,lesson:'Yakima Valley'},{id:5816719,lesson:'Rattlesnake Hills'},
   {id:5812604,lesson:'Snipes Mountain'},{id:5786990,lesson:'Red Mountain'},
   {id:5814916,lesson:'Walla Walla Valley'},{id:5789826,lesson:'Lake Chelan'},
   {id:5815342,lesson:'Royal Slope, White Bluffs, The Burn and Rocky Reach'},
   {id:5802636,lesson:'Wahluke Slope'},{id:5807713,lesson:'Ancient Lakes of Columbia Valley'}
  ],
  'la-rioja':[{id:3832606,lesson:'Valle del Bermejo'}],
  patagonia:[
   {id:3855065,lesson:'Alto Valle del Río Negro'},{id:3866242,lesson:'Alto Valle del Río Negro'},
   {id:3861056,lesson:'Alto Valle del Río Negro'}
  ],
  coonawarra:[{id:2170528,lesson:'Coonawarra village and the strip'}],
  'hunter-valley':[
   {id:2171845,lesson:'Lower Hunter'},{id:2173926,lesson:'Broke Fordwich'}
  ],
  rutherglen:[{id:2150788,lesson:'Rutherglen township and the loams'}],
  tasmania:[
   {id:2160517,lesson:'Tamar Valley'},{id:2151648,lesson:'Coal River Valley'},
   {id:2147736,lesson:'East Coast'},{id:2162873,lesson:'Huon Valley and the Channel'}
  ],
  martinborough:[{id:6226278,lesson:'The Martinborough Terrace'}],
  'canterbury-waipara':[
   {id:2180027,lesson:'Waipara Valley'},{id:2185626,lesson:'Omihi hills'}
  ],
  franschhoek:[{id:3367877,lesson:'The valley floor'}],
  'walker-bay':[{id:3361084,lesson:'Stanford Foothills'}],
  naoussa:[{id:735030,lesson:'Naoussa'}],
  amyndeon:[{id:736882,lesson:'Amyndeon'}],
  kefalonia:[{id:252327,lesson:'The Omala valley'}]
 }
};
