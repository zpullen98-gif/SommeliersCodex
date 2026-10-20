/* Supplemental country studies, reviewed 20 October 2026.
   Coordinates are approximate representative wine-area/town locations.
   They do not establish appellation boundaries, vineyard eligibility or
   a producer's vineyard holdings. Service prompts are editorial exercises. */
'use strict';
const a=(name,lon,lat)=>({name,lon,lat});
const s=(title,url)=>({title,url});
const scope='Representative places for orientation. These dots are not legal wine-area boundaries. Named towns locate the surrounding study area; the country window may omit distant territory.';
const countries=[
{
 id:'country-canada',title:'Canada',countryKey:'canada',geo:'CAN',bounds:[-124,41,-59,52],
 anchors:[a('Okanagan Valley',-119.59,49.49),a('Niagara Peninsula',-79.25,43.16),a('Prince Edward County',-77.15,44.00),a('Annapolis Valley',-64.50,45.08),a('Eastern Townships',-72.75,45.25)],
 summary:'Two distant centres make the first comparison: lakeside Ontario and the interior valleys of British Columbia. Nova Scotia and Quebec broaden the picture.',
 terroir:'Lake Ontario and the Niagara Escarpment shape Niagara mesoclimates. The Okanagan has glacial soils, warm summers and marked variation from its cooler north to warmer south.',
 grapes:'Riesling, Chardonnay, Pinot Noir and Cabernet Franc are important in Niagara. Okanagan plantings also include Merlot, Pinot Gris and Syrah. Vidal is important for Icewine.',
 growing:'Study winter injury, frost exposure and lake moderation. A country-wide latitude alone cannot predict ripening across these widely separated sites.',
 cellar:'Ontario Icewine uses grapes frozen naturally on the vine. Do not confuse this method with ordinary late harvest or assume all Canadian wine is sweet.',
 service:'Ask whether the guest wants a dry table wine, sparkling wine or Icewine. At Brennan’s, verify the Inniskillin bottle and current list before discussing the vintage or price.',
 sources:[s('Ontario Wine Appellation Authority: Niagara Peninsula','https://vqaontario.ca/ontario-appellations/niagara-peninsula/'),s('Ontario Wine Appellation Authority: categories and labelling','https://vqaontario.ca/vqa-wine-program/wine-categories-and-labelling/'),s('Wines of British Columbia: Okanagan Valley','https://winebc.com/discover-bc-wine-country/okanagan-valley/')]
},
{
 id:'country-uk',title:'United Kingdom: England and Wales',countryKey:'england',geo:'GBR',bounds:[-6.2,49.7,2.0,55.8],
 anchors:[a('Kent',0.88,51.14),a('Sussex',-0.05,50.93),a('Hampshire',-1.22,51.12),a('Essex',0.63,51.90),a('Monmouthshire',-2.72,51.81),a('Cornwall',-4.75,50.42)],
 summary:'England and Wales are the focus of this UK study window. Sparkling wine is a useful starting point, but still whites, reds and other styles are part of the story.',
 terroir:'The southeast includes chalk, Greensand and clay rather than one uniform soil. Essex and Kent are relatively warm and dry; western sites face stronger maritime influence.',
 grapes:'Chardonnay, Pinot Noir and Meunier underpin many traditional-method sparkling wines. Bacchus is an important still-wine name; Welsh vineyards also use varieties such as Seyval Blanc and Solaris.',
 growing:'Site exposure, ripening time and seasonal weather are central. Cooler northern and western sites require careful grape and site selection.',
 cellar:'Traditional method describes a bottle-fermentation process, not Champagne origin. Check sweetness and lees ageing on the individual wine.',
 service:'For a guest who enjoys Champagne, offer an English sparkling comparison by grape, method and taste. Brennan’s list has included Chapel Down and Ridgeview; confirm the bottle in hand.',
 sources:[s('WineGB: wine regions','https://winegb.co.uk/wines/regions/'),s('WineGB: English and Welsh wines','https://winegb.co.uk/wines/')]
},
{
 id:'country-lebanon',title:'Lebanon',countryKey:'lebanon',geo:'LBN',bounds:[35.05,33.0,36.8,34.8],
 anchors:[a('Bekaa near Zahle',35.90,33.85),a('Western Bekaa near Kefraya',35.73,33.65),a('Batroun hinterland',35.73,34.24),a('Jezzine',35.58,33.54),a('Ghazir: Musar cellar reference',35.66,34.02)],
 summary:'Separate the high Bekaa vineyard corridor from wineries and vineyards nearer the Mediterranean. A cellar address is not automatically the grape origin.',
 terroir:'The Bekaa lies inland between mountain ranges. Musar describes its southern Bekaa red vineyards on gravelly soils over limestone, with white vineyards higher on mountain slopes.',
 grapes:'Château Musar Red combines Cabernet Sauvignon, Cinsault and Carignan. Obaideh and Merwah are key names for its white; other Lebanese producers grow a wider range.',
 growing:'Elevation and exposure create important differences within a sunny Mediterranean setting. Producer-specific vineyard information is more reliable than a single national climate formula.',
 cellar:'Musar’s long maturation and separate cuvées reward bottle-specific study. Do not apply one Musar recipe or ageing schedule to every Lebanese wine.',
 service:'Brennan’s has listed older Musar and Hochar. Confirm cuvée, vintage and condition, then discuss the actual bottle; neither an old vintage nor a traditional reputation excuses a fault.',
 sources:[s('Château Musar: vineyard and wine guide','https://chateaumusar.com/wp-content/uploads/2019/10/CHATEAU-MUSAR-2019-2020.pdf'),s('OIV: Lebanon’s vitivinicultural sector','https://www.oiv.int/lebanons-vitivinicultural-sector-in-the-spotlight'),s('Batroun Mountains: producer','https://batrounmountains.wine/')]
},
{
 id:'country-mexico',title:'Mexico',countryKey:'mexico',geo:'MEX',bounds:[-117.5,18.5,-97.0,33.0],
 anchors:[a('Valle de Guadalupe',-116.58,32.02),a('Parras, Coahuila',-102.18,25.44),a('Querétaro near Ezequiel Montes',-99.88,20.52),a('Guanajuato near San Miguel',-100.74,20.91),a('Aguascalientes',-102.30,21.89)],
 summary:'Begin with Baja California, then compare inland highland production in Coahuila, Querétaro and Guanajuato. This map focuses on selected wine areas rather than all Mexican agriculture.',
 terroir:'The Pacific coast and interior plateaus offer distinct growing settings. Region, elevation, water access and the producer’s own vineyard evidence matter more than a broad latitude rule.',
 grapes:'Learn the variety or blend on the bottle before predicting flavour. Mexico’s regional diversity supports numerous international varieties, rather than a single defining grape.',
 growing:'Water supply, local exposure and harvest weather should be checked for the specific site. Avoid importing Baja conditions into every inland vineyard.',
 cellar:'Mexico now has protected geographical indications: Vinos de la Región Vitivinícola de Querétaro received protection in March 2025. Older statements that Mexico has no such protected wine geography need updating.',
 service:'Lead with the actual region, grapes and style. Explain an unfamiliar origin through a familiar flavour comparison without promising that it tastes like the comparison wine.',
 sources:[s('Mexico Ministry of Agriculture: wine-growing geography','https://www.gob.mx/agricultura/es/articulos/franja-del-vino-tradicion-vinicola'),s('IMPI: Querétaro wine geographical indication, 10 March 2025','https://sidof.segob.gob.mx/notas/5751385'),s('Consejo Mexicano Vitivinícola','https://www.uvayvino.mx/')]
},
{
 id:'country-switzerland',title:'Switzerland',countryKey:'switzerland',geo:'CHE',bounds:[5.8,45.7,10.7,47.9],
 anchors:[a('Valais near Sion',7.36,46.23),a('Vaud: Lavaux',6.73,46.49),a('Geneva vineyards',6.02,46.20),a('Three Lakes near Neuchâtel',6.93,46.99),a('Ticino near Bellinzona',8.96,46.17),a('Lake Zurich vineyards',8.64,47.25)],
 summary:'Six broad wine regions link Alpine valleys, lakes and several language traditions. These regions are not six uniform soils or six individual appellations.',
 terroir:'Valais follows the upper Rhône; Vaud includes Lake Geneva terraces; Ticino faces south of the Alps. Slope, aspect and lake influence vary at a much finer scale.',
 grapes:'Chasselas is a key western white. Pinot Noir and Müller-Thurgau are central in German-speaking Switzerland; Merlot dominates Ticino.',
 growing:'Steep or terraced sites change access and labour. Compare exposure and local climate rather than assuming every Alpine vineyard is cold or high.',
 cellar:'Swiss styles include still, sparkling and sweet wines. Read canton, appellation, variety and producer together; a national map does not establish an AOC’s rules.',
 service:'Translate an unfamiliar name into grape, texture and intended use. A Chasselas suggestion can begin with a delicate white style, then be refined by tasting the particular wine.',
 sources:[s('Swiss Wine Promotion: six wine regions','https://www.swisswine.com/en/swiss-wine-regions'),s('Swiss Wine Promotion: regional map','https://www.swisswine.com/api/proxy?imageUrl=https%3A%2F%2Fstrapi.swisswine.ch%2Fuploads%2FSWP_carte_vignoble_EN_prod_1df8678d6d.pdf')]
},
{
 id:'country-uruguay',title:'Uruguay',countryKey:'uruguay',geo:'URY',bounds:[-58.7,-35.3,-53.1,-30.0],
 anchors:[a('Canelones',-56.28,-34.52),a('Montevideo vineyards',-56.22,-34.78),a('Maldonado',-54.95,-34.77),a('Colonia',-57.85,-34.25),a('Rivera',-55.50,-30.92),a('Salto',-57.88,-31.40)],
 summary:'Read the southern Río de la Plata vineyards against Atlantic Maldonado and warmer northern sites. Tannat is the leading identity, not the country’s only style.',
 terroir:'Canelones and Montevideo have sediment-derived soils and river-estuary influence. Maldonado has stronger Atlantic exposure and varied rocky sites; northern regions are generally warmer.',
 grapes:'Tannat is the emblematic red. Albariño, Sauvignon Blanc, Chardonnay and Viognier widen the white selection; Merlot and Cabernet Franc are useful red comparisons.',
 growing:'Rainfall and humidity affect vineyard decisions. Canopy, airflow and harvest timing matter; avoid equating every southern-hemisphere vineyard with a dry climate.',
 cellar:'Tannat can be made in different extraction and maturation styles. The grape name alone does not establish oak use, ageability or how much tannin a guest will perceive.',
 service:'Ask about preferred weight and tannin. Offer a tasted Tannat with a suitably rich dish when its structure fits; use the sauce and guest preference to refine the match.',
 sources:[s('INAVI: wine regions','https://www.inavi.com.uy/regiones/'),s('INAVI: grape varieties','https://www.inavi.com.uy/variedades/'),s('Uruguay Wine: Tannat','https://uruguay.wine/en/varieties/')]
},
{
 id:'country-croatia',title:'Croatia',countryKey:'eastern-europe',geo:'HRV',bounds:[13.2,42.3,19.6,46.7],
 anchors:[a('Istria near Motovun',13.83,45.34),a('Pelješac',17.38,42.92),a('Korčula',16.91,42.94),a('Slavonia near Kutjevo',17.88,45.43),a('Danube near Ilok',19.36,45.22),a('Plešivica',15.67,45.73)],
 summary:'Contrast Mediterranean islands and coast with continental uplands and the eastern Danube country. The four broad wine regions contain many smaller identities.',
 terroir:'Dalmatia faces the Adriatic; Istria links maritime and inland hills; the Croatian Uplands and Slavonia sit farther inland. The climate gradient is the first map lesson.',
 grapes:'Connect Plavac Mali with Dalmatia, Malvazija Istarska with Istria and Graševina with the continental interior. Pošip is another important island white.',
 growing:'Island and coastal slopes differ from inland hills. Site exposure and water availability should be studied locally, rather than inferred from Croatia’s national coastline.',
 cellar:'The same grape can appear in young, matured, still or sparkling styles. Graševina is Welschriesling, not a Croatian synonym for Riesling.',
 service:'Use one clear bridge: a coastal white for a guest seeking freshness, or a tasted Plavac Mali for a guest seeking fuller red structure. Verify the producer’s actual style.',
 sources:[s('Croatian Chamber of Economy: wine regions','https://vinacroatia.hr/en/croatian-wine-regions/'),s('Croatian Ministry of Agriculture and Chamber: wine map','https://vinacroatia.hr/wp-content/uploads/2017/04/roll_up_karta.pdf')]
},
{
 id:'country-slovenia',title:'Slovenia',countryKey:'eastern-europe',geo:'SVN',bounds:[13.3,45.35,16.65,46.95],
 anchors:[a('Brda',13.53,46.00),a('Vipava',13.96,45.85),a('Kras near Sežana',13.87,45.71),a('Slovenian Istria',13.78,45.49),a('Podravje near Maribor',15.64,46.55),a('Posavje near Novo Mesto',15.17,45.80)],
 summary:'Three main wine regions provide the frame: Primorska in the west, Podravje in the northeast and Posavje in the southeast.',
 terroir:'Primorska receives Mediterranean influence; eastern vineyards have a more continental setting. Brda, Vipava, Kras and Slovenian Istria are distinct districts within Primorska.',
 grapes:'Rebula, Malvazija and Refošk are useful western names. Eastern studies include Sauvignon, Riesling, Welschriesling and Šipon, the local name for Furmint.',
 growing:'Topography and exposure create differences within each broad region. Do not turn a national climate description into a claim about a particular vineyard.',
 cellar:'Skin-contact whites are an important part of the modern conversation, but Slovenian white wine is not automatically orange wine. Confirm skin contact and maturation bottle by bottle.',
 service:'Explain amber wine through method and texture before aroma poetry: a white grape fermented with its skins may bring more grip. Ask whether that texture appeals to the guest.',
 sources:[s('Government of Slovenia: wine regions and districts','https://www.gov.si/en/topics/slovenian-wines/'),s('Slovenian Tourist Board: wines of Slovenia','https://www.slovenia.info/en/things-to-do/food-and-wine/wines-of-slovenia')]
},
{
 id:'country-georgia',title:'Georgia',countryKey:'eastern-europe',geo:'GEO',bounds:[39.8,41.0,46.8,43.7],
 anchors:[a('Kakheti near Telavi',45.47,41.92),a('Kakheti near Kvareli',45.82,41.94),a('Kartli near Gori',44.11,41.98),a('Imereti near Kutaisi',42.70,42.25),a('Racha near Ambrolauri',43.15,42.52),a('Samegrelo near Zugdidi',41.87,42.51)],
 summary:'Locate Kakheti in the east before comparing central Kartli and western Imereti, Racha and Samegrelo. Georgia is a country in the Caucasus, distinct from the US state.',
 terroir:'The country spans humid western and more continental eastern settings. Mountains, valleys and exposure create regional differences that cannot be reduced to one national soil.',
 grapes:'Saperavi and Rkatsiteli are key starting points in Kakheti. Imereti brings names including Tsitska and Tsolikouri; regional varieties broaden the study beyond those two eastern grapes.',
 growing:'Match grape and site to the regional climate. Harvest date, fruit condition and the intended style matter alongside a wine’s traditional identity.',
 cellar:'Qvevri are earthenware vessels associated with Georgian traditional winemaking. Skin and stem handling varies by region and producer; qvevri does not mean every wine is amber or sweet.',
 service:'Ask whether a guest wants dry or sweet, then red, white or amber. Describe a tasted amber wine’s grip clearly; the vessel alone does not guarantee a particular flavour.',
 sources:[s('National Wine Agency of Georgia: regions','https://wine.gov.ge/En/WineMakingRegions/'),s('Wines of Georgia: country overview','https://www.winesgeorgia.com/overview/'),s('Wines of Georgia: regional and qvevri guide','https://winesgeorgia.com/wp-content/uploads/2023/09/Georgia-The-Cradle-of-Wine_Web.pdf')]
},
{
 id:'country-romania',title:'Romania',countryKey:'eastern-europe',geo:'ROU',bounds:[20.0,43.5,30.0,48.4],
 anchors:[a('Dealu Mare near Urlați',26.23,44.98),a('Cotnari',26.94,47.35),a('Târnave near Jidvei',24.11,46.22),a('Drăgășani',24.26,44.66),a('Murfatlar',28.41,44.18),a('Recaș',21.51,45.80)],
 summary:'The Carpathian arc helps organise a varied wine country. Compare southern hill vineyards, the Transylvanian plateau, northeastern Cotnari and Black Sea-facing Dobrogea.',
 terroir:'Region and elevation matter across Romania’s inland and coastal settings. Dealu Mare is a southern foothill reference; Târnave lies within the Transylvanian interior.',
 grapes:'Separate the white Fetească Albă and Fetească Regală from the red Fetească Neagră. Romanian bottles also use numerous international grapes.',
 growing:'Different exposures and ripening conditions support different styles. A broad country profile should lead to the appellation and producer’s specific vineyard information.',
 cellar:'Romania has DOC specifications for individual wine origins and styles. A ripe-harvest term should not be treated as a universal guarantee of finished sweetness.',
 service:'Introduce the unfamiliar variety first, then describe the tasted wine’s fruit, acidity and texture. Do not conflate Romania’s historic Moldavia region with the Republic of Moldova.',
 sources:[s('ONIV: appellation specifications','https://oniv.ro/caiete-de-sarcini/'),s('Dealu Mare producers’ association','https://dealu-mare.ro/?lang=en'),s('Wines of Romania: grape varieties','https://winesofromania.com/soiuri/')]
},
{
 id:'country-bulgaria',title:'Bulgaria',countryKey:'eastern-europe',geo:'BGR',bounds:[22.2,41.1,28.9,44.3],
 anchors:[a('Thracian Valley near Plovdiv',24.75,42.14),a('Struma Valley near Melnik',23.39,41.52),a('Danube Plain near Pleven',24.62,43.42),a('Black Sea near Varna',27.84,43.24),a('Rose Valley near Karlovo',24.80,42.64),a('Sakar near Harmanli',25.90,41.93)],
 summary:'Use the Balkan Mountains to orient north and south, then distinguish the Black Sea coast and the southwestern Struma Valley.',
 terroir:'The Danube Plain lies north of the Balkan range. The Thracian Valley is a southern reference; the Struma Valley has stronger Mediterranean influence and the coast a maritime setting.',
 grapes:'Mavrud and Rubin are useful Thracian names. Broad-leaved Melnik belongs to the southwestern story; Gamza is associated with the north, while Dimyat is important near the coast.',
 growing:'Exposure and the timing of ripening differ across these settings. The country’s indigenous varieties should be learned alongside their regional homes.',
 cellar:'Regional travel routes, protected origins and individual wine labels are different layers. These study dots locate places without claiming to trace legal denominations.',
 service:'Offer a local-grape comparison using the wine’s actual body, acidity and tannin. Avoid making every Bulgarian red sound like the same heavy, oaked style.',
 sources:[s('Bulgaria tourism: wine regions and routes','https://visitbulgaria.com/wine-tourism-landing-page/'),s('Bulgarian Ministry of Tourism: wine routes guide','https://visitbulgaria.com/wp-content/uploads/2021/09/Wine-tours-in-Bulgaria-MT_bulgariatravel_.pdf')]
},
{
 id:'country-moldova',title:'Moldova',countryKey:'eastern-europe',geo:'MDA',bounds:[26.4,45.3,30.2,48.6],
 anchors:[a('Codru near Ialoveni',28.78,46.94),a('Ștefan Vodă',29.66,46.51),a('Purcari',29.87,46.54),a('Valul lui Traian near Comrat',28.66,46.30),a('Cahul',28.19,45.90)],
 summary:'Codru, Ștefan Vodă and Valul lui Traian organise the principal wine-PGI study. Divin is a protected wine-spirit origin, not a fourth equivalent table-wine zone.',
 terroir:'Codru lies centrally; Ștefan Vodă is in the southeast; Valul lui Traian spans the south. Hills, exposure and soil variation matter within each broad region.',
 grapes:'Rară Neagră, Fetească Neagră, Fetească Albă and Fetească Regală are useful local names. Viorica is a further distinctive variety to recognise.',
 growing:'Read the precise origin and producer before inferring growing conditions. A wine-PGI name describes a defined region, not an identical vineyard environment everywhere inside it.',
 cellar:'Modern Moldovan bottles include varietal wines, blends and sparkling wines. Verify the individual production method instead of assuming sweetness or Soviet-era bulk-wine style.',
 service:'Say Republic of Moldova clearly when confusion with Romanian Moldavia is possible. Introduce a local grape through the tasted wine, then connect it to the guest’s preferred style.',
 sources:[s('National Office for Vine and Wine: wine regions','https://wineofmoldova.com/en/wine-regions/'),s('National Office for Vine and Wine: local grapes','https://wineofmoldova.com/en/local-grape-varieties-in-moldova/'),s('Valul lui Traian PGI association','https://valulluitraian.com/')]
},
{
 id:'country-czechia',title:'Czechia',countryKey:'eastern-europe',geo:'CZE',bounds:[12.0,48.4,18.9,51.2],
 anchors:[a('Mikulov',16.64,48.81),a('Znojmo',16.05,48.86),a('Velké Pavlovice',16.82,48.90),a('Slovácko near Uherské Hradiště',17.46,49.07),a('Mělník',14.48,50.35),a('Litoměřice',14.13,50.53)],
 summary:'Separate Moravia in the southeast from the smaller Bohemian wine districts. Moravian subregions provide the main frame for this study.',
 terroir:'Mikulov, Znojmo, Velké Pavlovice and Slovácko form distinct Moravian study areas. Bohemian vineyards are farther north; local slopes and exposure still matter.',
 grapes:'Recognise Veltlínské zelené as Grüner Veltliner, Ryzlink rýnský as Riesling and Ryzlink vlašský as Welschriesling. These are not interchangeable names for one grape.',
 growing:'Cool-climate ripening and harvest conditions are useful questions for the grower. Do not derive a bottle’s sweetness from the country’s northerly position.',
 cellar:'The country makes whites, reds, rosés and sparkling wines. Harvest-ripeness terms and the finished wine’s sweetness are separate facts to check.',
 service:'Translate the grape name first. Then offer a concise description of the actual wine’s acidity, fruit and texture so unfamiliar spelling does not become a barrier.',
 sources:[s('Czech National Wine Centre: Czech wines','https://www.vinarskecentrum.cz/en/o-vine'),s('Czech National Wine Centre: grape-variety guide','https://www.vinarskecentrum.cz/storage/files/odrudy-vune-brozura-AJ-2021-web.pdf'),s('VisitCzechia: Moravian wine region','https://www.visitczechia.com/en-us/campaigns/2024/wine-tourism-in-czechia/moravia-wine-region')]
},
{
 id:'country-slovakia',title:'Slovakia',countryKey:'eastern-europe',geo:'SVK',bounds:[16.7,47.6,22.7,49.8],
 anchors:[a('Little Carpathians near Modra',17.31,48.33),a('Nitra',18.09,48.31),a('South Slovakia near Štúrovo',18.72,47.80),a('Central Slovakia near Veľký Krtíš',19.35,48.21),a('East Slovakia near Sobrance',22.18,48.74),a('Slovak Tokaj near Malá Tŕňa',21.68,48.47)],
 summary:'Six wine-growing regions follow Slovakia’s warmer lowlands and slopes, with the Little Carpathians in the west and the Slovak part of Tokaj in the east.',
 terroir:'The Little Carpathian foothills are a major western reference. Eastern Tokaj sits near the Bodrog basin and Zemplín hills; national borders do not make the shared Tokaj landscape disappear.',
 grapes:'Frankovka is a useful red name in the Little Carpathian story. Furmint, Lipovina and Yellow Muscat are key Slovak Tokaj names.',
 growing:'Southern slopes and local exposure help orient vineyard sites. Distinguish a wine region from a tourist wine route: their names and boundaries need not coincide.',
 cellar:'Tokaj includes a tradition of sweet wines and maturation in tuff cellars, but Slovak wine as a whole is not necessarily sweet. Confirm the category on the actual bottle.',
 service:'State the country and exact origin, especially for Tokaj. Ask the guest’s sweetness preference before recommending a bottle whose regional name alone may be unfamiliar.',
 sources:[s('Slovakia Travel: wine-growing regions','https://slovakia.travel/en/wine-growing'),s('Slovakia Travel: wine routes','https://slovakia.travel/en/things-to-see-and-do/gastronomia/wine-routes'),s('Slovakia Travel: regional wine routes and Tokaj','https://slovakia.travel/en/thematic-routes-across-slovakia')]
}
];
for(const country of countries){
 country.scope=scope;
 country.reviewed='2026-10-20';
 country.kind='country';
 country.serviceLabel='Tableside rehearsal';
}
module.exports={countries};
