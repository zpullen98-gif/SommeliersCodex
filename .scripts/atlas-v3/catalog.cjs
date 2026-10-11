/* Explorer edition, reviewed 10 October 2026. Coordinates are approximate
   representative locations, not appellation centroids or legal boundaries.
   Bank names/order are preserved. The journey captions are editorial invitations,
   not additional classifications, tasting promises or geographic evidence. */
const a = (label, lon, lat, note) => ({label, lon, lat, ...(note ? {note} : {})});
const r = (name, anchors, note, studyNotes) => ({name, anchors, note, ...(studyNotes ? {studyNotes} : {})});
const s = (title, url) => ({title, url});
const common = 'Approximate study locations, not appellation boundaries. Numbers refer to the study key; a shared number connects places in one grouped lesson.';
const sheets = {};
function sheet(id, title, geo, bounds, intro, reading, sources, regions, extraAnchors=[], inset) {
  sheets[id] = {file:`maps/atlas-v3/${id}.svg`,title,intro,scope:common,reading,sources,regions,extraAnchors,width:1200,height:1500,
    _layout:{geo,bounds,...(inset?{inset}:{})}};
}

sheet('france','France','FRA',[-5.3,41.2,9.7,51.3],
  'Follow the Atlantic west, continental northeast and Mediterranean south through nine established study groupings.',
  ['Champagne lies north of Burgundy; Alsace follows the eastern border.','The Loire runs across western and central France; two locators show its breadth.','The Rhône lesson spans northern and southern vineyards. This selection is not every French wine region.'],
  [s('Atout France · Destination Vignobles','https://www.atout-france.fr/sites/default/files/imce/plaquette_dv_2022_def.pdf')],[
  r('Champagne',[a('Champagne',4.03,49.05)],'Northeastern France, around Reims and Épernay; north of Burgundy.'),
  r('Alsace',[a('Alsace',7.3,48.15)],'Eastern France, between the Vosges foothills and the Rhine plain.'),
  r('Loire Valley',[a('Middle Loire',0.05,47.26),a('Upper Loire',2.84,47.33)],'A long west–east corridor. These middle and upper Loire locators do not imply one compact vineyard zone.'),
  r('Burgundy',[a('Burgundy',4.85,47.05)],'East-central France; the representative Côte d’Or location does not cover all Burgundy vineyards.'),
  r('Beaujolais',[a('Beaujolais',4.65,46.15)],'South of the Mâconnais and north of Lyon.'),
  r('Rhône Valley',[a('Northern Rhône',4.84,45.07),a('Southern Rhône',4.85,44.1)],'Two locators distinguish the narrow northern corridor from the broader southern vineyards.'),
  r('Provence',[a('Provence',6.2,43.45)],'Mediterranean southeastern France, east of the lower Rhône.'),
  r('Bordeaux',[a('Bordeaux',-0.48,44.95)],'Southwestern France around the Gironde estuary and adjoining river valleys.'),
  r('Languedoc-Roussillon',[a('Languedoc',3.1,43.35),a('Roussillon',2.8,42.75)],'Mediterranean arc west of the Rhône; Roussillon lies nearer the Spanish border.')]);

sheet('italy','Italy','ITA',[6.4,35.4,19,47.4],
  'Read the peninsula from the Alps to the Mediterranean islands, keeping administrative regions distinct from individual wine denominations.',
  ['The twelve labels are broad regional study headings, not twelve DOC or DOCG boundaries.','Sardinia lies west of the peninsula; Sicily is southwest of its toe.','Campania and Basilicata are distinct regions. Vulture belongs to Basilicata, not Campania.'],
  [s('Federdoc · Italian wine denominations and regional maps','https://www.federdoc.com/new/wp-content/uploads/2023/11/booklet-2023.pdf')],[
  r('Piedmont',[a('Piedmont',8.03,44.7)],'Northwest Italy; the Langhe/Monferrato locator is south of Turin.'),
  r('Lombardy',[a('Lombardy',10.05,45.59)],'Northern Italy, east of Piedmont; shown near Franciacorta, one of several distinct wine areas.'),
  r('Veneto',[a('Veneto',11.1,45.5)],'Northeastern Italy, west of Friuli; several wine districts span the region.'),
  r('Friuli',[a('Friuli',13.3,46)],'Far northeastern Italy near Slovenia; the regional heading abbreviates Friuli Venezia Giulia.'),
  r('Trentino-Alto Adige',[a('Trentino',11.12,46.08),a('Alto Adige',11.3,46.5)],'The Adige corridor north of Veneto; two locators distinguish Trentino and Alto Adige.'),
  r('Tuscany',[a('Tuscany',11.25,43.47)],'West-central Italy, south of the northern regions and west of Umbria.'),
  r('Umbria',[a('Umbria',12.42,42.99)],'Landlocked central Italy, east of Tuscany.'),
  r('Abruzzo',[a('Abruzzo',13.94,42.29)],'Central-eastern Italy, facing the Adriatic.'),
  r('Campania',[a('Campania',14.98,41.02)],'Southwestern Italy around Naples and inland Irpinia; Vulture lies in neighboring Basilicata.',{g:'Aglianico; Fiano; Greco',soil:'Varied by site; volcanic, calcareous and clay-rich soils occur in the region.',climate:'Southern latitude, with substantial coastal and inland elevation differences.',notes:['Campania includes Taurasi, Fiano di Avellino and Greco di Tufo.','Aglianico del Vulture is in Basilicata and is not part of this Campania locator.']}),
  r('Puglia',[a('Puglia',17.1,40.85)],'Southeastern Italy, including the heel of the peninsula.'),
  r('Sicily',[a('Sicily',14,37.65)],'The large Mediterranean island southwest of Calabria.'),
  r('Sardinia',[a('Sardinia',9,40)],'The island west of mainland Italy and south of Corsica.')],[a('Etna',15.02,37.79)]);

sheet('spain','Spain','ESP',[-9.5,35.6,4.5,44],
  'Locate Atlantic Galicia, the inland plateaus, the Ebro corridor, Catalonia and southern Andalucía.',
  ['Rueda and Toro are separate neighboring denominations; their shared number preserves the grouped lesson.','Penedès is a historic center for Cava, but Cava extends across four officially defined zones.','The study selection focuses on mainland wine areas; it is not a complete register of Spanish denominations.'],
  [s('ICEX · Spanish wine regions','https://www.foodswinesfromspain.com/content/icex-foodswines/en/wine/regions.html'),s('Cava regulatory board · Four zones','https://www.cava.wine/en/origin-cava/4-zones/'),s('D.O. Rías Baixas · Terroir and five subzones','https://doriasbaixas.com/en/terroir-rias-baixas-a-natural-paradise/')],[
  r('Rías Baixas',[a('Val do Salnés',-8.78,42.5)],'Atlantic Galicia in the far northwest. The land-based locator represents Val do Salnés, one of the denomination’s five separate subzones; it does not mark their full extent.'),
  r('Bierzo',[a('Bierzo',-6.7,42.6)],'Northwestern inland Spain, east of Galicia.'),
  r('Ribera del Duero',[a('Ribera del Duero',-3.7,41.65)],'Northern plateau along the Duero, upstream and east of Rueda and Toro.'),
  r('Rueda / Toro',[a('Rueda',-4.96,41.41),a('Toro',-5.39,41.52)],'Two distinct denominations near the Duero; Toro lies west of Rueda.'),
  r('Rioja',[a('Rioja',-2.7,42.5)],'Northern Spain along the Ebro corridor, west of Navarra.'),
  r('Navarra',[a('Navarra',-1.65,42.49)],'Northeastern inland Spain, between the Pyrenean foothills and the Ebro basin.'),
  r('Penedès (Cava)',[a('Penedès',1.73,41.35)],'Catalonia southwest of Barcelona. This Penedès locator is not a boundary for the entire Cava denomination.',{notes:['Penedès is central to Cava’s history, but DO Cava is not confined to Penedès.','Cava’s four zones are Comtats de Barcelona, Valle del Ebro, Viñedos de Almendralejo and Requena.']}),
  r('Priorat',[a('Priorat',0.82,41.18)],'Inland Catalonia, southwest of Penedès.'),
  r('La Mancha',[a('La Mancha',-3.1,39.35)],'The broad south-central plateau; one locator represents a large area.'),
  r('Jumilla / Yecla',[a('Jumilla',-1.33,38.48),a('Yecla',-1.11,38.61)],'Distinct southeastern inland denominations north of Murcia.'),
  r('Jerez (Sherry)',[a('Jerez',-6.13,36.68)],'Southwestern Andalucía near the Atlantic; the locator does not define the full production or maturation zones.')]);

sheet('portugal','Portugal','PRT',[-9.8,36.6,-6,42.3],
  'Follow mainland Portugal from the Atlantic northwest to the warmer south, then locate Madeira separately in the Atlantic.',
  ['Vinho Verde lies northwest of the inland Douro; Dão is inland from Bairrada.','Lisboa and Setúbal are coastal; Tejo and Alentejo extend inland.','Madeira is an Atlantic island far southwest of the mainland. Its inset uses a separate scale.'],
  [s('ViniPortugal · Wine regions','https://winesofportugal.com/pt/descobrir/regioes-vitivinicolas/'),s('IVV · Regional map','https://www.ivv.gov.pt/regioes-vitivinicolas/mapa-das-regioes/')],[
  r('Vinho Verde',[a('Vinho Verde',-8.4,41.67)],'Northwestern Portugal, north of Porto; the locator stands for a broad, varied region.'),
  r('Douro / Port',[a('Douro',-7.55,41.18)],'The inland Douro valley east of Porto. Port’s vineyard origin and the coastal trade centers should not be conflated.'),
  r('Dão',[a('Dão',-7.92,40.6)],'Inland central-northern Portugal, south of the Douro.'),
  r('Bairrada',[a('Bairrada',-8.45,40.4)],'West of Dão and closer to the Atlantic.'),
  r('Lisboa',[a('Lisboa',-9.07,39.08)],'Atlantic-influenced wine country north of Lisbon.'),
  r('Tejo',[a('Tejo',-8.54,39.23)],'The Tagus corridor northeast of Lisbon.'),
  r('Setúbal',[a('Setúbal',-8.85,38.58)],'The peninsula southeast of Lisbon, across the Tagus estuary.'),
  r('Alentejo',[a('Alentejo',-7.9,38.58)],'A broad inland region east and southeast of Lisbon.'),
  r('Madeira',[a('Madeira',-16.97,32.75)],'Atlantic island southwest of mainland Portugal and west of Morocco; displayed in a separately scaled inset.')],[],{geo:'PRT',bounds:[-17.35,32.55,-16.2,33.25],title:'Madeira · separate scale',location:'Atlantic island · 32.8° N, 17° W'});

sheet('germany','Germany','DEU',[5.7,47.1,15.4,55.2],
  'Trace selected wine regions along western river valleys and the southern German landscape.',
  ['Most regions in this lesson cluster in the southwest; the country outline deliberately remains complete.','Mosel, Nahe and Rheingau are distinct river-linked areas, not a single western region.','These nine study headings are a selection of Germany’s thirteen quality-wine regions.'],
  [s('German Wine Institute · Region map','https://www.winesofgermany.com/our-regions/region-map')],[
  r('Ahr',[a('Ahr',7.04,50.54)],'A small western river valley south of Bonn and north of the Mosel.'),
  r('Mosel',[a('Mosel',6.95,49.92)],'Western Germany along the winding Mosel; its wine region also includes Saar and Ruwer vineyards.'),
  r('Rheingau',[a('Rheingau',8.02,50)],'A short Rhine corridor west of Wiesbaden.'),
  r('Nahe',[a('Nahe',7.8,49.83)],'The Nahe valley southwest of the Rhine–Main confluence.'),
  r('Rheinhessen',[a('Rheinhessen',8.1,49.8)],'West of the Rhine, south of Mainz and north of the Pfalz.'),
  r('Pfalz',[a('Pfalz',8.1,49.3)],'A north–south western strip toward the French border.'),
  r('Franken',[a('Franken',9.93,49.79)],'Inland northern Bavaria, especially around the Main and Würzburg.'),
  r('Württemberg',[a('Württemberg',9.22,49)],'Southwestern Germany around the Neckar and its tributaries.'),
  r('Baden',[a('Baden',7.85,48.07)],'A long discontinuous southwestern region; the locator near Freiburg represents only part of its extent.')]);

sheet('austria','Austria','AUT',[9.4,46.3,17.3,49.2],
  'Austria’s principal wine-growing concentration lies in the east, while the western Alps remain geographic context.',
  ['Wachau, Kremstal and Kamptal are three separate areas near the Danube.','Weinviertel lies north of Vienna; Burgenland lies to its southeast.','Styria occupies the southeastern wine landscape near Slovenia.'],
  [s('Austrian Wine · Official vineyard atlas','https://www.austrianvineyards.com/'),s('University of Vienna · Austrian vineyard atlas methodology','https://ica-proc.copernicus.org/articles/4/63/2021/')],[
  r('Wachau / Kamptal / Kremstal',[a('Wachau',15.42,48.38),a('Kamptal',15.69,48.47),a('Kremstal',15.61,48.42)],'Three distinct Lower Austrian areas west and northwest of Vienna; the grouped lesson does not merge their identities.'),
  r('Wien (Vienna)',[a('Vienna',16.34,48.28)],'Vineyards within and around the northern edge of Austria’s capital.'),
  r('Weinviertel',[a('Weinviertel',16.17,48.6)],'Northeastern Lower Austria, north of Vienna.'),
  r('Burgenland',[a('Burgenland',16.7,47.8)],'Eastern Austria along the Hungarian border; the locator near Lake Neusiedl is not the whole region.'),
  r('Steiermark (Styria)',[a('Styria',15.5,46.8)],'Southeastern Austria, south of Graz and near Slovenia.')]);

sheet('california','California','US-CA',[-124.65,32.3,-113.8,42.3],
  'Orient the North Coast and Central Coast, with selected additional wine places from the wider California landscape.',
  ['Napa and Sonoma are adjacent but distinct; they share a course heading, not one appellation.','Central Coast extends across many districts; Monterey, Paso Robles and Santa Barbara illustrate its north–south range.','Lettered places mix AVAs, counties and broad geographic areas. They are reference locations, not equivalent legal categories.'],
  [s('California Wine Institute · Wine map','https://discovercaliforniawines.com/wp-content/uploads/2019/09/CAWineMap.2019.18x24.V04Web.pdf'),s('TTB · AVA Map Explorer','https://www.ttb.gov/regulated-commodities/beverage-alcohol/wine/ava-map-explorer')],[
  r('Napa & Sonoma (CA)',[a('Napa Valley',-122.36,38.49),a('Sonoma',-122.8,38.48)],'North of San Francisco Bay; Sonoma lies west of Napa.'),
  r('Central Coast (CA)',[a('Central Coast',-120.7,35.62)],'A long coastal wine region south of the Bay Area; the reference places show some of its internal range.')],
  [a('Redwood Valley',-123.2,39.27),a('Mendocino County',-123.21,39.12),a('Lake County',-122.88,38.95),a('Solano County',-122.09,38.25),a('Livermore Valley',-121.75,37.67),a('Lodi',-121.27,38.13),a('Santa Cruz Mountains',-122.04,37.12),a('Monterey',-121.36,36.46),a('Paso Robles',-120.68,35.63),a('San Luis Obispo',-120.63,35.24),a('Santa Barbara County',-120.15,34.64),a('South Coast',-117.08,33.53),a('Sierra Foothills',-120.68,38.43),a('San Joaquin Valley',-119.8,36.74)]);

sheet('oregon','Oregon','US-OR',[-124.85,41.85,-116.3,46.5],
  'Distinguish the western Willamette and southern valleys from the Columbia corridor and eastern Snake River country.',
  ['Willamette Valley lies between the Coast Range and Cascades, south of Portland.','Columbia Gorge and Columbia Valley cross state lines; state borders do not define those AVAs.','Southern Oregon includes the Umpqua and Rogue valleys; Applegate Valley is within the Rogue Valley area.'],
  [s('Oregon Wine Board · Regions','https://www.oregonwine.org/regions/'),s('TTB · AVA Map Explorer','https://www.ttb.gov/regulated-commodities/beverage-alcohol/wine/ava-map-explorer')],[
  r('Willamette Valley (OR)',[a('Willamette Valley',-123.02,44.94)],'Western Oregon south of Portland, between the Coast Range and Cascades. The single locator is not the valley’s extent.')],
  [a('Chehalem Mountains',-122.92,45.37),a('Dundee Hills',-123.02,45.29),a('Eola-Amity Hills',-123.16,45.08),a('Columbia Gorge',-121.52,45.62),a('Snake River Valley',-117.12,43.78),a('Umpqua Valley',-123.35,43.21),a('Rogue Valley',-122.82,42.31),a('Applegate Valley',-123.21,42.28)]);

sheet('washington','Washington','US-WA',[-125.1,45.4,-116.65,49.3],
  'Follow the inland Columbia wine country east of the Cascades, while keeping Puget Sound distinct on the western side.',
  ['Columbia Valley extends across a large part of central and southeastern Washington and into Oregon.','Nested wine areas require different scales; numbered and lettered dots are representative locations only.','Puget Sound lies west of the Cascades; Goose Gap, Red Mountain and the Yakima Valley lie in the inland Columbia landscape.','Columbia Gorge crosses the river into Oregon and is distinct from the adjoining Columbia Valley AVA. Its locator on this sheet marks the Washington side.'],
  [s('Washington State Wine Commission · Regions and AVAs','https://www.washingtonwine.org/regions-and-avas/'),s('Washington State Wine Commission · Columbia Gorge','https://www.washingtonwine.org/resource/columbia-gorge/'),s('TTB · AVA Map Explorer','https://www.ttb.gov/regulated-commodities/beverage-alcohol/wine/ava-map-explorer')],[
  r('Columbia Valley (WA)',[a('Columbia Valley',-119.63,46.65)],'A large inland region east of the Cascades, extending into northern Oregon; no single dot can show its footprint.')],
  [a('Yakima Valley',-120.02,46.44),a('Red Mountain',-119.45,46.29),a('Wahluke Slope',-119.69,46.77),a('Ancient Lakes',-119.87,47.2),a('Puget Sound',-122.56,47.65),a('Goose Gap',-119.4,46.24),a('Walla Walla Valley',-118.35,46.03),a('Columbia Gorge',-121.52,45.76,'The AVA spans Washington and Oregon; this locator represents its Washington side.')]);

sheet('new-york','New York','US-NY',[-80,40.45,-71.7,45.2],
  'A state-scale view connects the western Great Lakes, inland Finger Lakes, Hudson corridor and Atlantic-facing Long Island.',
  ['Finger Lakes sits in west-central New York; Long Island extends east from New York City.','Lake Erie and Niagara Escarpment are western areas; Champlain Valley of New York lies along the northeastern border.','Virginia and Texas remain separate course notes beyond this map, without New York markers.'],
  [s('New York Wine & Grape Foundation · Wine guide','https://newyorkwines.org/wp-content/uploads/2020/08/2019-NY-Wine-Guide.pdf'),s('TTB · AVA Map Explorer','https://www.ttb.gov/regulated-commodities/beverage-alcohol/wine/ava-map-explorer')],[
  r('Finger Lakes (NY)',[a('Finger Lakes',-76.9,42.67)],'West-central New York; the elongated lakes and surrounding slopes span a much broader area than the locator.'),
  r('Long Island (NY)',[a('Long Island',-72.61,40.97)],'Southeastern New York, on the Atlantic-facing island east of New York City.')],
  [a('Lake Erie',-79.45,42.4),a('Niagara Escarpment',-78.69,43.18),a('Hudson River Region',-73.93,41.76),a('Champlain Valley of NY',-73.47,44.53)]);

sheet('argentina','Argentina','ARG',[-72.6,-41.3,-63.4,-21.6],
  'A focused view follows the wine-growing corridor along the Andes, from high northern valleys to northern Patagonia.',
  ['Cafayate lies far north of Mendoza; La Rioja and San Juan lie between them.','Luján de Cuyo and the Uco Valley are separate Mendoza reference locations.','Río Negro and Neuquén are southern relative to Mendoza, but not at Argentina’s far southern tip. The overview shows the crop.'],
  [s('Wines of Argentina · Regional maps','https://api.winesofargentina.org/uploads/2021/07/F6odkpjYXf_WOFA_Argentine_Wine_Regions_2021.pdf'),s('Argentina INV · Regional reports','https://www.argentina.gob.ar/node/112999')],[
  r('Salta / Cafayate',[a('Cafayate',-65.98,-26.07)],'Cafayate is a high northern valley within Salta province, south of Salta city.'),
  r('La Rioja',[a('La Rioja',-67.5,-29.3)],'Inland western Argentina, south of Salta and north of San Juan; not the Spanish region of the same name.'),
  r('San Juan',[a('San Juan',-68.5,-31.55)],'Western Argentina north of Mendoza.'),
  r('Mendoza (Uco, Luján de Cuyo)',[a('Luján de Cuyo',-68.91,-33.04),a('Uco Valley',-69.15,-33.6)],'Mendoza lies east of the Andes; Uco Valley lies south of Luján de Cuyo.'),
  r('Patagonia (Río Negro/Neuquén)',[a('Neuquén',-68.3,-38.55),a('Río Negro',-67.58,-39.03)],'Northern Patagonian river-valley vineyards south of Mendoza. These locators do not imply all Patagonia is planted.')],[],{geo:'ARG',bounds:[-74,-56,-53,-21],title:'Argentina · wider context',location:'Gold box marks the main map crop',overview:true});

sheet('chile','Chile','CHL',[-73.9,-38.4,-68.6,-29.2],
  'Travel north to south through selected Chilean valleys, distinguishing Pacific-facing sites from inland valleys near the Andes.',
  ['Elqui and Limarí are north of Aconcagua and the central valleys.','Casablanca is coastal; inland Aconcagua is a different setting despite their grouped lesson.','Colchagua is part of the wider Rapel grouping. Itata and Bío Bío lie farther south.'],
  [s('Wines of Chile · Wine regions map','https://www.winesofchile.org/wine-regions-map/'),s('Wines of Chile · Wine-growing regions','https://www.winesofchile.org/winegrowing-regions/')],[
  r('Elqui / Limarí',[a('Elqui',-70.73,-30.03),a('Limarí',-71.18,-30.6)],'Two northern valleys; Elqui is north of Limarí.'),
  r('Aconcagua / Casablanca',[a('Aconcagua',-70.65,-32.77),a('Casablanca',-71.41,-33.32)],'Inland Aconcagua and coastal Casablanca are distinct wine settings; their shared number preserves the course grouping.',{g:'Aconcagua: Cabernet Sauvignon, Syrah and other red varieties; Casablanca: Sauvignon Blanc, Chardonnay and Pinot Noir.',soil:'Varies substantially between valleys and sites; do not transfer one soil description to both.',climate:'Inland Aconcagua is generally warmer; Casablanca is more directly moderated by the Pacific.',notes:['Aconcagua Valley and Casablanca Valley should be studied separately within this grouped heading.','Leyda is another coastal valley and is not a synonym for either Aconcagua or Casablanca.']}),
  r('Maipo Valley',[a('Maipo',-70.64,-33.72)],'The central valley around and south of Santiago, with important east–west and elevation differences.'),
  r('Rapel / Colchagua',[a('Colchagua',-71.29,-34.64),a('Cachapoal',-70.85,-34.28)],'Rapel encompasses the Cachapoal and Colchagua groupings; Colchagua lies farther south.'),
  r('Curicó / Maule',[a('Curicó',-71.24,-35),a('Maule',-71.67,-35.43)],'Neighboring central valleys south of Colchagua; Maule lies south of Curicó.'),
  r('Itata / Bío Bío',[a('Itata',-72.6,-36.55),a('Bío Bío',-72.3,-37.25)],'Southern wine areas; Itata lies north of Bío Bío.')],[],{geo:'CHL',bounds:[-76,-56,-66,-17],title:'Chile · wider context',location:'Gold box marks the main map crop',overview:true});

sheet('australia','Australia','AUS',[112,-44.4,154.8,-10],
  'A continent-scale orientation places western, southeastern and island wine regions in their true relative positions.',
  ['Margaret River sits in the far southwest, separated by a continent from the eastern regions.','Barossa Valley and Eden Valley are adjacent but distinct; Clare is farther north and separate.','Tasmania is an island south of the mainland. Numbers cluster in South Australia because those regions are geographically close.'],
  [s('Wine Australia · Register of geographical indications','https://www.wineaustralia.com/labelling/register-of-protected-gis-and-other-terms/geographical-indications'),s('Wine Australia · Wine zones map','https://www.wineaustralia.com/getmedia/e2f60e4c-ad52-454e-a22e-eff6b5c729f9/Australian-Wine-Zones.pdf')],[
  r('Margaret River (WA)',[a('Margaret River',115.1,-33.95)],'The southwestern corner of Western Australia, between maritime coastlines.'),
  r('Barossa / Eden Valley (SA)',[a('Barossa Valley',138.95,-34.55),a('Eden Valley',139.1,-34.65)],'Neighboring South Australian regions northeast of Adelaide. Eden Valley is generally higher and cooler.',{g:'Barossa Valley: notably Shiraz; Eden Valley: notably Riesling and Shiraz.',soil:'Varied soils across both regions; a single soil label cannot describe the pair.',climate:'Barossa Valley is generally warmer; Eden Valley’s higher sites are generally cooler.',notes:['Barossa is a zone containing the separate Barossa Valley and Eden Valley regions.','Do not treat the Barossa Valley locator as the entire Barossa zone.']}),
  r('Clare Valley (SA)',[a('Clare Valley',138.61,-33.84)],'North of the Barossa area, inland in South Australia.',{g:'Riesling; Shiraz; Cabernet Sauvignon',climate:'Warm days and cool nights vary with elevation and site.',notes:['Clare Valley is a separate region in the Mount Lofty Ranges zone, not part of Eden Valley.']}),
  r('McLaren Vale (SA)',[a('McLaren Vale',138.55,-35.22)],'South of Adelaide near Gulf St Vincent.'),
  r('Coonawarra (SA)',[a('Coonawarra',140.83,-37.29)],'Southeastern South Australia near the Victorian border.'),
  r('Hunter Valley (NSW)',[a('Hunter Valley',151.3,-32.78)],'Eastern New South Wales, north of Sydney and inland from Newcastle.'),
  r('Yarra Valley (VIC)',[a('Yarra Valley',145.48,-37.66)],'Southern Victoria, northeast of Melbourne.'),
  r('Rutherglen (VIC)',[a('Rutherglen',146.46,-36.06)],'Northeastern Victoria near the Murray River and New South Wales border.'),
  r('Tasmania',[a('Tasmania',147.15,-42.1)],'The island south of mainland Australia; one locator represents several widely separated vineyard districts.')],[a('Riverland',140.6,-34.2),a('Mudgee',149.59,-32.59)]);

sheet('new-zealand','New Zealand','NZL',[165.4,-47.6,179.3,-34],
  'Follow a two-island sequence from northeastern Gisborne to inland Central Otago, retaining the true position of each coast.',
  ['Gisborne and Hawke’s Bay are on the North Island’s east; Wairarapa is near its southern end.','Nelson is on the northern South Island west of Marlborough.','Central Otago is inland in the southern South Island; Canterbury and Waipara are farther northeast.'],
  [s('New Zealand Winegrowers · National and regional maps','https://www.nzwine.com/en/trade/learning/maps/'),s('New Zealand Winegrowers · North Canterbury','https://www.nzwine.com/en/regions/northcanterbury/')],[
  r('Gisborne',[a('Gisborne',177.9,-38.62)],'Eastern North Island around Poverty Bay.'),
  r("Hawke's Bay",[a('Hawke’s Bay',176.84,-39.6)],'Eastern North Island, south of Gisborne.'),
  r('Martinborough (Wairarapa)',[a('Martinborough',175.46,-41.22)],'Southern North Island east of the Remutaka Range; Martinborough is within Wairarapa.'),
  r('Marlborough',[a('Marlborough',173.86,-41.51)],'Northeastern South Island around Blenheim and adjoining valleys.'),
  r('Nelson',[a('Nelson',173.06,-41.31)],'Northern South Island, west of Marlborough near Tasman Bay.'),
  r('Canterbury / Waipara',[a('Waipara Valley',172.77,-43.06),a('Canterbury Plains',172.51,-43.52)],'Eastern South Island. Waipara Valley lies north of Christchurch; New Zealand Winegrowers presents it and the Canterbury Plains as subregions of North Canterbury. The course retains its grouped Canterbury / Waipara heading.'),
  r('Central Otago',[a('Central Otago',169.19,-45.04)],'Inland southern South Island around several basins and valleys.')],[a('Northland',173.95,-35.27),a('Auckland',174.56,-36.77)]);

sheet('south-africa','South Africa','ZAF',[17.55,-34.85,21.25,-32.55],
  'An enlarged Cape view separates the tightly clustered western wine districts without moving them across South Africa.',
  ['Stellenbosch is east of Cape Town and south of Paarl; Franschhoek lies southeast of Paarl.','Elgin and Walker Bay lie farther southeast toward the coast; Robertson is inland to the east.','This is a Cape focus, not a map of every South African wine region. The overview shows its place in the country.'],
  [s('Wines of South Africa · Regional maps','https://wine.wosa.co.za/sa/maps.php'),s('Wines of South Africa · Maps and links','https://www.wosa.co.za/Multimedia/Maps-Links/')],[
  r('Swartland',[a('Swartland',18.73,-33.38)],'North of Cape Town, around the Malmesbury and Riebeek landscape.'),
  r('Stellenbosch',[a('Stellenbosch',18.85,-33.94)],'East of Cape Town and south of Paarl, close to False Bay.'),
  r('Paarl',[a('Paarl',18.97,-33.76)],'Northeast of Cape Town and north of Stellenbosch.'),
  r('Franschhoek',[a('Franschhoek',19.12,-33.91)],'An inland valley southeast of Paarl and east of Stellenbosch.'),
  r('Constantia',[a('Constantia',18.42,-34.03)],'On the Cape Peninsula immediately south of central Cape Town.'),
  r('Elgin',[a('Elgin',19.05,-34.16)],'An elevated basin southeast of Stellenbosch, inland from the coast.'),
  r('Walker Bay / Hemel-en-Aarde',[a('Walker Bay',19.24,-34.34)],'The southern coastal area near Hermanus; Hemel-en-Aarde lies inland of the bay.'),
  r('Robertson',[a('Robertson',19.88,-33.81)],'Inland in the Breede River landscape, east of the Cape Town–Stellenbosch cluster.')],[],{geo:'ZAF',bounds:[16,-35,33,-22],title:'South Africa · wider context',location:'Gold box marks the Cape focus',overview:true});

sheet('hungary','Hungary','HUN',[15.7,45.65,23.1,48.75],
  'Place nine selected study areas around northeastern hills, western volcanic landscapes, southern districts and the central plain.',
  ['Tokaj lies in the northeast; Sopron is at the western border near Austria.','Badacsony is beside Lake Balaton; Somló is a separate hill farther northwest.','These nine course headings are a selection, not a claim that Hungary has nine wine districts.'],
  [s('Wines of Hungary · Wine regions and districts','https://bor.hu/en/wine-regions/'),s('Wines of Tokaj · Location','https://www.winesoftokaj.hu/en/wine-region/location')],[
  r('Tokaj',[a('Tokaj',21.35,48.17)],'Northeastern Hungary at the Zemplén foothills; the Hungarian region is more extensive than this locator.'),
  r('Eger',[a('Eger',20.38,47.9)],'Northern Hungary southwest of Tokaj.'),
  r('Mátra',[a('Mátra',19.94,47.78)],'Northern Hungary around the Mátra foothills, west of Eger.'),
  r('Sopron',[a('Sopron',16.59,47.68)],'Far western Hungary near Austria and Lake Neusiedl/Fertő.'),
  r('Badacsony (Balaton)',[a('Badacsony',17.5,46.81)],'On the northern shore of Lake Balaton.'),
  r('Somló',[a('Somló',17.37,47.14)],'A distinct volcanic hill northwest of Lake Balaton.'),
  r('Szekszárd',[a('Szekszárd',18.71,46.34)],'Southern Hungary west of the Danube, north and east of Villány.'),
  r('Villány',[a('Villány',18.45,45.87)],'Far southern Hungary near Croatia.'),
  r('Kunság',[a('Kunság',19.36,46.75)],'The broad central plain between the Danube and Tisza; one locator cannot show its full extent.')]);

sheet('greece','Greece','GRC',[19.1,34.65,28.4,41.9],
  'Connect the northern mainland and Peloponnese with distinct Ionian and Aegean island wine areas.',
  ['Naoussa, Amyndeon and Goumenissa are northern mainland areas; Rapsani lies farther south.','Nemea and Mantinia lie in the Peloponnese.','Kefalonia lies west of mainland Greece; Samos is in the eastern Aegean, Santorini farther southwest, and Crete to the south.'],
  [s('Wines of Greece · Wine-growing regions','https://winesofgreece.org/regions-wineries/winegrowing-regions-2/')],[
  r('Naoussa',[a('Naoussa',22.07,40.63)],'Northern mainland Greece in Imathia, west of Thessaloniki.'),
  r('Amyndeon',[a('Amyndeon',21.68,40.69)],'Northwestern Greek Macedonia, west of Naoussa.'),
  r('Goumenissa',[a('Goumenissa',22.45,40.95)],'Northern Greek Macedonia, northwest of Thessaloniki.'),
  r('Rapsani',[a('Rapsani',22.55,39.9)],'Thessaly near the southern foothills of Mount Olympus.'),
  r('Nemea',[a('Nemea',22.66,37.82)],'Northeastern Peloponnese, southwest of Corinth.'),
  r('Mantinia',[a('Mantinia',22.4,37.62)],'The inland Arcadian plateau in the central Peloponnese.'),
  r('Santorini',[a('Santorini',25.44,36.38)],'A small island group in the southern Aegean, north of Crete.'),
  r('Crete',[a('Crete',25.1,35.15)],'The long southern Greek island; several wine areas lie across it.'),
  r('Kefalonia',[a('Kefalonia',20.58,38.18)],'An Ionian island west of mainland Greece.'),
  r('Samos',[a('Samos',26.83,37.77)],'An eastern Aegean island close to the Turkish coast.')]);

const journeys = {
  france: 'Follow river valleys from Atlantic cellars toward a Mediterranean table.',
  italy: 'Explore from the Adige corridor to island shores, one regional table at a time.',
  spain: 'Let Atlantic Galicia, inland plateaus and the Ebro guide the next glass.',
  portugal: 'Trace the Douro inland, then carry the journey across the Atlantic to Madeira.',
  germany: 'Follow the western river valleys and discover the place behind each pour.',
  austria: 'Travel from the Danube vineyards to the southeastern hills, with a place at the table.',
  california: 'Explore the North Coast and Central Coast, connecting each glass to its landscape.',
  oregon: 'From Willamette to the southern valleys, let the landscape begin the conversation.',
  washington: 'Cross the Cascades in the atlas, from Puget Sound to Columbia wine country.',
  'new-york': 'Journey from the Great Lakes and Finger Lakes toward an Atlantic island table.',
  argentina: 'Follow the Andes from northern valleys to northern Patagonia, glass by glass.',
  chile: 'Read the valleys between Pacific and Andes, then share their stories at the table.',
  australia: 'Explore across a continent, from Margaret River to the eastern regions and Tasmania.',
  'new-zealand': 'Two islands invite a journey from eastern shores to the inland basins of Central Otago.',
  'south-africa': 'Explore the Cape from coastal settings to inland valleys, one welcoming table at a time.',
  hungary: 'Discover volcanic hills, lake shores and the central plain through the stories of wine.',
  greece: 'Trace mainland valleys and island shores, bringing a sense of place to the table.'
};

for (const [id, sheet] of Object.entries(sheets)) {
  sheet.journey = journeys[id];
  sheet.sources.push(
    s('Natural Earth · Country outlines','https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-0-countries/'),
    ...(sheet._layout.geo.startsWith('US-')?[s('Natural Earth · State outlines','https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-1-states-provinces/')]:[]),
    s('Natural Earth · Selected rivers','https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-rivers-lake-centerlines/'),
    s('Natural Earth · Selected lakes','https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-lakes/')
  );
}
module.exports = {version:'3', sheets};
