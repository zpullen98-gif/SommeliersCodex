/* The deeper atlas edition's roster (22 October 2026): every new name and slug fixed before any writer runs.

   check-fragment.cjs, build-regions.cjs, apply-roster.cjs, the gates and the content workflows read it,
   so a slug, a country key or a technique is written once, here, and nowhere else is it invented.

   MORE: the articles with no numbered place on their country's map yet. Each keeps its country's sheet
   (so the join, the reading file, the decks and the climb to the country work unchanged), carries
   mapless: 1 and no index, and lives in fragments/<sheet>.more.json in the order given here. The country
   page lists them after the mapped articles; the sheet's regionsOrder is the map's slugs, then these.
   takes: the places an older article holds today that this article now owns; the older article keeps
   a one line pointer. aliases: the folded keys the article claims (apply-roster moves them from their
   old target inside the same country). Never a bare "orange": Orange is also a Rhone town, and orange
   is a wine colour.

   NEW_MAPLESS: the countries with no map sheet yet, written like the seven already there (places, no
   regions). GEORGIA_MOVE: the keys that leave eastern-europe for georgia.

   CODEX56 (2 November 2026): MORE holds the fourteen articles this edition writes, at the Certified depth (no
   deeper list); the other fifteen wait in DEFERRED_MORE and the seven new countries in DEFERRED_MAPLESS, so
   NEW_MAPLESS is empty and the Georgia split does not run. A takes entry names the older article's place exactly
   as its fragment writes it.

   TECHNIQUES: the companion, [slug, name, group] in reading order, in the groups of GROUPS. A technique
   slug never equals a region slug or a country key. MUST_LINK: a record that carries deeper must link
   these techniques in its techniques list. */
'use strict';

const MORE = {
  france: [
    { slug: 'jura', name: 'Jura', aliases: ['jura', 'arbois', 'chateau chalon', 'l etoile', 'cotes du jura', 'vin jaune', 'vin de paille jura'] },
    { slug: 'savoie', name: 'Savoie and Bugey', aliases: ['savoie', 'bugey', 'vin de savoie', 'roussette de savoie', 'cerdon', 'chignin', 'apremont', 'abymes'] },
    { slug: 'south-west-france', name: 'South West France', aliases: ['south west france', 'sud ouest', 'cahors', 'madiran', 'jurancon', 'irouleguy', 'bergerac', 'monbazillac', 'gaillac', 'fronton', 'marcillac', 'pacherenc du vic bilh', 'cotes de gascogne', 'saint mont', 'buzet', 'tursan'] },
    { slug: 'corsica', name: 'Corsica', aliases: ['corsica', 'corse', 'patrimonio', 'ajaccio', 'vin de corse', 'muscat du cap corse', 'calvi', 'sartene', 'porto vecchio', 'figari'] },
  ],
  italy: [
    { slug: 'emilia-romagna', name: 'Emilia-Romagna', aliases: ['emilia romagna', 'emilia', 'romagna', 'lambrusco', 'lambrusco di sorbara', 'lambrusco grasparossa di castelvetro', 'lambrusco salamino di santa croce', 'romagna sangiovese', 'albana di romagna', 'colli piacentini', 'gutturnio'] },
    { slug: 'marche', name: 'Marche', takes: { abruzzo: ['Marche, the neighbour to the north'] }, aliases: ['marche', 'verdicchio', 'verdicchio dei castelli di jesi', 'verdicchio di matelica', 'castelli di jesi', 'matelica', 'rosso conero', 'conero', 'rosso piceno', 'lacrima di morro d alba', 'vernaccia di serrapetrona', 'offida'] },
    { slug: 'liguria-valle-d-aosta', name: 'Liguria and Valle d\'Aosta', aliases: ['liguria', 'cinque terre', 'sciacchetra', 'riviera ligure di ponente', 'rossese di dolceacqua', 'colli di luni', 'valle d aosta', 'vallee d aoste', 'aosta', 'donnas', 'enfer d arvier', 'blanc de morgex et de la salle', 'torrette'] },
    { slug: 'lazio', name: 'Lazio', takes: { umbria: ['Lazio, the neighbour to the south'] }, aliases: ['lazio', 'frascati', 'est est est di montefiascone', 'cesanese del piglio', 'castelli romani', 'cannellino di frascati', 'roma doc'] },
    { slug: 'calabria-basilicata', name: 'Calabria and Basilicata', takes: { campania: ['Basilicata, the neighbour to the east'] }, aliases: ['calabria', 'ciro', 'greco di bianco', 'savuto', 'basilicata', 'aglianico del vulture', 'vulture', 'monte vulture', 'rionero in vulture', 'barile', 'matera'] },
  ],
  spain: [
    { slug: 'canary-islands', name: 'Canary Islands', aliases: ['canary islands', 'canarias', 'tenerife', 'lanzarote', 'la palma', 'gran canaria', 'el hierro', 'la gomera', 'tacoronte acentejo', 'valle de la orotava', 'ycoden daute isora', 'abona', 'valle de guimar', 'islas canarias'] },
    { slug: 'txakoli', name: 'Txakoli and the Basque Country', aliases: ['txakoli', 'txakolina', 'getariako txakolina', 'bizkaiko txakolina', 'arabako txakolina', 'chacoli', 'basque country', 'pais vasco'] },
    { slug: 'ribeiro-ribeira-sacra', name: 'Ribeiro, Ribeira Sacra and Valdeorras', takes: { bierzo: ['Valdeorras and Ribeira Sacra'] }, aliases: ['ribeiro', 'ribeira sacra', 'valdeorras', 'monterrei', 'amandi', 'sil', 'galicia inland'] },
  ],
  germany: [
    { slug: 'mittelrhein', name: 'Mittelrhein', aliases: ['mittelrhein', 'middle rhine', 'bacharach', 'boppard', 'oberwesel', 'loreley'] },
  ],
  'new-york': [
    { slug: 'virginia', name: 'Virginia', aliases: ['virginia', 'monticello', 'middleburg virginia', 'shenandoah valley virginia', 'virginia peninsula'] },
  ],
};

/* DEFERRED_MORE (2 November 2026, codex56): the roster's other fifteen articles off the map, written for a later
   edition. Nothing reads them as articles: check-fragment refuses one in a .more fragment, the build and the gates
   count only MORE, and the deep fixture (CODEX_ROSTER_WHOLE=1) proves their machinery with the whole roster. */
const DEFERRED_MORE = {
  spain: [
    { slug: 'aragon', name: 'Aragón', aliases: ['aragon', 'somontano', 'campo de borja', 'calatayud', 'carinena', 'cava aragon'] },
    { slug: 'valencia', name: 'Valencia and Utiel-Requena', aliases: ['valencia', 'utiel requena', 'utiel', 'requena', 'moscatel de valencia', 'manchuela valencia'] },
  ],
  portugal: [
    { slug: 'azores', name: 'Azores', aliases: ['azores', 'acores', 'pico', 'pico island', 'graciosa', 'biscoitos', 'terceira'] },
    { slug: 'beira-interior', name: 'Beira Interior', aliases: ['beira interior', 'castelo rodrigo', 'pinhel', 'cova da beira', 'tavora varosa', 'tavora', 'varosa'] },
  ],
  germany: [
    { slug: 'saale-unstrut-sachsen', name: 'Saale-Unstrut and Sachsen', aliases: ['saale unstrut', 'sachsen', 'saxony', 'freyburg', 'meissen', 'radebeul', 'elbtal'] },
  ],
  austria: [
    { slug: 'thermenregion-carnuntum', name: 'Thermenregion and Carnuntum', takes: { 'wachau-kamptal-kremstal': ['Thermenregion', 'Carnuntum'] }, aliases: ['thermenregion', 'carnuntum', 'gumpoldskirchen', 'baden bei wien', 'gols carnuntum', 'gottlesbrunn', 'rubin carnuntum'] },
    { slug: 'wagram-traisental', name: 'Wagram and Traisental', takes: { 'wachau-kamptal-kremstal': ['Wagram', 'Traisental'] }, aliases: ['wagram', 'traisental', 'feuersbrunn', 'kirchberg am wagram', 'traismauer'] },
  ],
  oregon: [
    { slug: 'southern-oregon', name: 'Southern Oregon', aliases: ['southern oregon', 'rogue valley', 'umpqua valley', 'applegate valley', 'red hill douglas county', 'elkton oregon'] },
  ],
  california: [
    { slug: 'lodi-sierra-foothills', name: 'Lodi and the Sierra Foothills', aliases: ['lodi', 'mokelumne river', 'clements hills', 'sierra foothills', 'amador county', 'shenandoah valley california', 'fiddletown', 'el dorado', 'calaveras county'] },
    { slug: 'mendocino-lake', name: 'Mendocino and Lake County', takes: { 'napa-sonoma': ['Mendocino', 'Lake'] }, aliases: ['mendocino', 'mendocino county', 'anderson valley', 'redwood valley', 'potter valley', 'mendocino ridge', 'lake county', 'red hills lake county', 'clear lake', 'high valley'] },
  ],
  australia: [
    { slug: 'victoria', name: 'Victoria', aliases: ['victoria', 'heathcote', 'mornington peninsula', 'mornington', 'geelong', 'macedon ranges', 'macedon', 'grampians', 'great western', 'pyrenees victoria', 'beechworth', 'king valley', 'goulburn valley', 'nagambie lakes', 'gippsland', 'sunbury', 'bendigo', 'henty'] },
    { slug: 'adelaide-hills', name: 'Adelaide Hills', takes: { 'clare-valley': ['Adelaide Hills'] }, aliases: ['adelaide hills', 'lenswood', 'piccadilly valley', 'basket range'] },
    { slug: 'great-southern', name: 'Great Southern', takes: { 'margaret-river': ['Great Southern'] }, aliases: ['great southern', 'frankland river', 'mount barker', 'porongurup', 'denmark western australia', 'albany western australia'] },
    { slug: 'orange-mudgee', name: 'Orange and Mudgee', aliases: ['orange nsw', 'orange new south wales', 'mudgee', 'hilltops', 'canberra district', 'cowra', 'tumbarumba'] },
  ],
  'new-zealand': [
    { slug: 'auckland-waiheke', name: 'Auckland and Waiheke', aliases: ['auckland', 'waiheke', 'waiheke island', 'kumeu', 'matakana', 'northland', 'west auckland'] },
  ],
};

const DEFERRED_MAPLESS = [
  { key: 'israel', name: 'Israel', aliases: ['israel', 'golan heights', 'galilee', 'upper galilee', 'judean hills', 'samson', 'shomron', 'negev'] },
  { key: 'georgia', name: 'Georgia', aliases: ['sakartvelo'] },
  { key: 'turkey', name: 'Turkey', aliases: ['turkey', 'turkiye', 'thrace', 'aegean turkey', 'anatolia', 'cappadocia', 'elazig'] },
  { key: 'cyprus', name: 'Cyprus', aliases: ['cyprus', 'commandaria', 'troodos', 'limassol', 'paphos'] },
  { key: 'japan', name: 'Japan', aliases: ['japan', 'koshu valley', 'yamanashi', 'nagano', 'hokkaido', 'katsunuma'] },
  { key: 'china', name: 'China', aliases: ['china', 'ningxia', 'helan mountain', 'helan mountains', 'xinjiang', 'shandong', 'yantai', 'yunnan wine', 'hebei'] },
  { key: 'brazil', name: 'Brazil', aliases: ['brazil', 'serra gaucha', 'vale dos vinhedos', 'campanha gaucha', 'serra do sudeste', 'vale do sao francisco'] },
];

/* NEW_MAPLESS: the new map-less countries this edition builds. Empty in codex56: the seven wait in DEFERRED_MAPLESS,
   so check-fragment refuses their keys, apply-roster gives them no alias and the Georgia split (GEORGIA_MOVE) never
   runs, since it runs only once georgia is a NEW_MAPLESS country in a fragment. */
const NEW_MAPLESS = [];

/* The keys that leave eastern-europe (mapless.2.json) for georgia, and the grapes that go with them. */
const GEORGIA_MOVE = ['georgia', 'georgian', 'sakartvelo', 'kakheti', 'kakhetia', 'telavi', 'alazani valley', 'tsinandali', 'mukuzani', 'kindzmarauli', 'akhasheni', 'napareuli', 'manavi', 'kvareli', 'gurjaani', 'kartli', 'imereti', 'racha', 'racha lechkhumi', 'khvanchkara'];
const GEORGIA_GRAPES = ['Saperavi', 'Rkatsiteli', 'Mtsvane'];

const GROUPS = [
  ['sparkling', 'Sparkling'],
  ['sweet', 'Sweet'],
  ['fortified', 'Fortified'],
  ['contact', 'Colour and skins'],
  ['winery', 'In the cellar'],
  ['vineyard', 'In the vineyard'],
  ['terroir', 'Terroir'],
  ['ageing', 'Ageing'],
];

const TECHNIQUES = [
  ['traditional-method', 'Traditional method', 'sparkling'],
  ['tank-method', 'Tank method (Charmat)', 'sparkling'],
  ['ancestral-method', 'Ancestral method', 'sparkling'],
  ['noble-rot', 'Noble rot (botrytis)', 'sweet'],
  ['ice-wine', 'Ice wine and Eiswein', 'sweet'],
  ['dried-grapes', 'Dried grapes (appassimento and passito)', 'sweet'],
  ['ripasso', 'Ripasso', 'sweet'],
  ['late-harvest', 'Late harvest', 'sweet'],
  ['port-fortification', 'Fortification and Port', 'fortified'],
  ['solera-and-flor', 'Flor and the solera', 'fortified'],
  ['madeira-estufagem-canteiro', 'Madeira: estufagem and canteiro', 'fortified'],
  ['vin-doux-naturel', 'Vin doux naturel', 'fortified'],
  ['skin-contact-orange', 'Skin contact and orange wine', 'contact'],
  ['rose-methods', 'Making rosé', 'contact'],
  ['carbonic-maceration', 'Carbonic maceration', 'contact'],
  ['whole-bunch', 'Whole bunch', 'contact'],
  ['extraction', 'Extraction: soaks, punching down and pumping over', 'contact'],
  ['malolactic', 'Malolactic conversion', 'winery'],
  ['oak', 'Oak', 'winery'],
  ['lees-batonnage', 'Lees ageing and bâtonnage', 'winery'],
  ['sur-lie', 'Sur lie', 'winery'],
  ['governo', 'Governo', 'winery'],
  ['enrichment-acidification', 'Chaptalisation and acidification', 'winery'],
  ['amphora-qvevri', 'Amphora and qvevri', 'winery'],
  ['blending-assemblage', 'Blending (assemblage)', 'winery'],
  ['sous-voile', 'Sous voile', 'winery'],
  ['stabilisation-sulphur', 'Fining, filtering and sulphur', 'winery'],
  ['fermentation-yeast', 'Fermentation and yeast', 'winery'],
  ['training-pruning', 'Training and pruning', 'vineyard'],
  ['phylloxera-rootstocks', 'Phylloxera and rootstocks', 'vineyard'],
  ['organic-biodynamic', 'Organic and biodynamic', 'vineyard'],
  ['frost', 'Frost', 'vineyard'],
  ['heat-irrigation', 'Heat, drought and irrigation', 'vineyard'],
  ['clonal-massal', 'Clones and massal selection', 'vineyard'],
  ['canopy-yield', 'Canopy and yield', 'vineyard'],
  ['harvest-sorting', 'Harvest and sorting', 'vineyard'],
  ['steep-slopes', 'Steep slopes and terraces', 'vineyard'],
  ['old-vines-density', 'Old vines and planting density', 'vineyard'],
  ['altitude-diurnal', 'Altitude and the diurnal range', 'terroir'],
  ['maritime-fog', 'Sea, fog and wind', 'terroir'],
  ['soils-drainage', 'Soils and drainage', 'terroir'],
  ['ageing-terms', 'Ageing terms on the label', 'ageing'],
  ['oxidative-rancio', 'Oxidative ageing and rancio', 'ageing'],
];

/* A deepened record must link at least these techniques (it may link more, up to its cap). */
const MUST_LINK = {
  champagne: ['traditional-method', 'blending-assemblage'],
  penedes: ['traditional-method'],
  loire: ['sur-lie', 'noble-rot'],
  bordeaux: ['noble-rot', 'blending-assemblage'],
  beaujolais: ['carbonic-maceration'],
  burgundy: ['whole-bunch', 'oak'],
  veneto: ['dried-grapes', 'ripasso', 'tank-method'],
  tuscany: ['governo', 'dried-grapes'],
  piedmont: ['extraction', 'oak'],
  jerez: ['solera-and-flor'],
  douro: ['port-fortification', 'steep-slopes'],
  madeira: ['madeira-estufagem-canteiro'],
  tokaj: ['noble-rot'],
  mosel: ['steep-slopes'],
  rheingau: ['late-harvest'],
  'wachau-kamptal-kremstal': ['steep-slopes'],
  burgenland: ['noble-rot'],
  rhone: ['vin-doux-naturel', 'whole-bunch'],
  'languedoc-roussillon': ['vin-doux-naturel', 'oxidative-rancio'],
  rioja: ['ageing-terms', 'oak'],
  santorini: ['training-pruning', 'dried-grapes'],
  samos: ['port-fortification'],
  rutherglen: ['oxidative-rancio'],
  'barossa-eden': ['old-vines-density'],
  marlborough: ['maritime-fog'],
  mendoza: ['altitude-diurnal', 'heat-irrigation'],
  salta: ['altitude-diurnal'],
  'aconcagua-casablanca': ['maritime-fog'],
  'napa-sonoma': ['maritime-fog'],
  alsace: ['late-harvest'],
  jura: ['sous-voile', 'oxidative-rancio'],
  savoie: ['altitude-diurnal'],
  'canary-islands': ['training-pruning', 'phylloxera-rootstocks'],
  azores: ['training-pruning'],
  georgia: ['amphora-qvevri', 'skin-contact-orange'],
  canada: ['ice-wine'],
  england: ['traditional-method'],
  cyprus: ['dried-grapes'],
};

/* CODEX_ROSTER_WHOLE=1 in the environment restores the whole roster as first written: each sheet's deferred articles
   after its own in MORE, and the deferred countries in NEW_MAPLESS. Only the deep fixture sets it (it proves Southern
   Oregon and the Georgia split, the machinery of the families this edition defers); the Codex's build, apply-roster
   and the gates read the trimmed roster. */
const SHEET_ORDER = ['france', 'italy', 'spain', 'portugal', 'germany', 'austria', 'california', 'oregon', 'washington', 'new-york', 'argentina', 'chile', 'australia', 'new-zealand', 'south-africa', 'hungary', 'greece'];
const WHOLE = typeof process !== 'undefined' && process.env && process.env.CODEX_ROSTER_WHOLE === '1';
if (WHOLE) {
  const all = {};
  SHEET_ORDER.forEach((s) => { const list = (MORE[s] || []).concat(DEFERRED_MORE[s] || []); if (list.length) all[s] = list; });
  Object.keys(MORE).forEach((s) => { delete MORE[s]; });
  Object.keys(all).forEach((s) => { MORE[s] = all[s]; });
  DEFERRED_MAPLESS.forEach((c) => NEW_MAPLESS.push(c));
}

function listOf(table) {
  const out = [];
  Object.keys(table).forEach((sheet) => table[sheet].forEach((a, i) => out.push(Object.assign({ sheet, order: i }, a))));
  return out;
}
const MORE_LIST = listOf(MORE);
const DEFERRED_MORE_LIST = WHOLE ? [] : listOf(DEFERRED_MORE);
const TECHNIQUE_SLUGS = TECHNIQUES.map((t) => t[0]);
const GROUP_KEYS = GROUPS.map((g) => g[0]);

module.exports = { MORE, MORE_LIST, DEFERRED_MORE, DEFERRED_MORE_LIST, NEW_MAPLESS, DEFERRED_MAPLESS, GEORGIA_MOVE, GEORGIA_GRAPES, GROUPS, GROUP_KEYS, TECHNIQUES, TECHNIQUE_SLUGS, MUST_LINK, WHOLE };

if (require.main === module) {
  console.log('roster' + (WHOLE ? ' (whole, CODEX_ROSTER_WHOLE=1)' : '') + ': ' + MORE_LIST.length + ' articles off the map on ' + Object.keys(MORE).length + ' sheets, ' + NEW_MAPLESS.length + ' new map-less countries, ' + (WHOLE ? '' : DEFERRED_MORE_LIST.length + ' articles and ' + DEFERRED_MAPLESS.length + ' countries deferred, ') + TECHNIQUES.length + ' techniques in ' + GROUPS.length + ' groups, ' + Object.keys(MUST_LINK).length + ' must-links');
}
