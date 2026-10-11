/* A synthetic REGIONS for the gates and the codex39 tests: two sheets
   (france with Champagne and Burgundy, germany with the Mosel), three
   regions and one map-less country (England). The shape is
   .scripts/regions/schema.json's; the prose is short and stands for the
   builder's. Never shipped: js/data-regions.js is the built file. */
var REGIONS = {
  version: 1,
  countries: {
    france: {
      key: 'france', name: 'France', sheet: 'france',
      summary: 'France is the reference the exam measures every other country against. Its wines are named for places, its law is a ladder from Vin de France to the appellation, and its great regions each teach one lesson: Champagne the method, Burgundy the village, Bordeaux the blend.',
      overview: 'The French system names wine by place rather than grape. A reader who knows where a village sits knows what is in the glass.\n\nThe ladder has three rungs. Vin de France carries a grape and a vintage and little else. IGP names a wide area. AOC, the appellation, names a delimited place and binds the grapes, the yields and the methods.\n\nThe exam leans on the appellations of Burgundy, Bordeaux, Champagne, the Loire, the Rhone and Alsace, and on the label words that tell a server what is in the bottle.',
      ladder: [['Vin de France', 'The base: a grape and a vintage may be named, the place is only France.'], ['IGP', 'Indication Geographique Protegee: a wide area, looser rules.'], ['AOC', 'Appellation d’Origine Controlee: a delimited place, the grapes, yields and methods bound by law.']],
      labels: [['Mis en bouteille au domaine', 'Bottled at the estate that grew the grapes.'], ['Vieilles vignes', 'Old vines, a term with no legal age.']],
      regionsOrder: ['champagne', 'burgundy'],
      grapes: [{ name: 'Chardonnay', role: 'lead', styles: 'From the chalk of Champagne to the limestone of Burgundy, the white grape of the north.' }],
      exam: ['Name the three rungs of the French ladder.', 'Place the great regions on a map from memory.', 'Read a French label aloud and say what each word binds.'],
      traps: ['Vin de France is not a fault, it is a category.', 'IGP replaced Vin de Pays in 2009; the old word still appears on older bottles.'],
      say: [['Appellation', 'ah-pel-ah-SYON'], ['Domaine', 'doh-MEN']],
      cards: [{ f: 'The three rungs of the French ladder', b: 'Vin de France, IGP, AOC.' }, { f: 'What does mis en bouteille au domaine bind?', b: 'The wine was bottled at the estate that grew the grapes.' }],
      questions: [
        { id: 'r-fr000001', cat: 'France', q: 'Which rung of the French ladder names a delimited place and binds its grapes, yields and methods?', opts: ['Vin de France', 'IGP', 'AOC', 'Vin de Table'], a: 2, exp: 'AOC, the appellation, delimits the place and binds the grapes, yields and methods. IGP names a wide area; Vin de France is the base.' },
        { id: 'r-fr000002', cat: 'France', q: 'In which year did IGP replace Vin de Pays on French labels?', opts: ['1935', '1985', '2009', '2015'], a: 2, exp: 'The reform of 2009 brought Vin de Pays under the IGP name; 1935 is the founding of the appellation system.' }
      ],
      sources: [{ title: 'INAO, the appellation body', url: 'https://www.inao.gouv.fr/', asOf: '2026' }]
    },
    germany: {
      key: 'germany', name: 'Germany', sheet: 'germany',
      summary: 'Germany is Riesling country: steep river valleys at the northern edge of ripening, a law that ranks wine by the ripeness of the grapes rather than the place, and a producer association that ranks the vineyards instead.',
      overview: 'The German law of 1971 ranks wine by must weight, from Kabinett to Trockenbeerenauslese. The VDP, an association of estates, ranks the vineyards instead, from Gutswein to Grosse Lage.\n\nThe exam asks the Pradikat ladder in order and the three words for sweetness: trocken, halbtrocken, feinherb.',
      ladder: [['Kabinett', 'The lightest Pradikat, picked at normal ripeness.'], ['Spatlese', 'Late picked, riper.'], ['Auslese', 'Selected bunches, riper still.'], ['Beerenauslese', 'Selected berries, botrytis, sweet.'], ['Trockenbeerenauslese', 'Shrivelled berries, the sweetest.']],
      labels: [['Trocken', 'Dry.'], ['Grosses Gewachs', 'The VDP’s dry wine from a Grosse Lage vineyard.']],
      regionsOrder: ['mosel'],
      grapes: [{ name: 'Riesling', role: 'lead', styles: 'Every style from bone dry to the sweetest wine made.' }],
      exam: ['The Pradikat ladder in order.', 'Which ladder is the law’s and which the VDP’s.'],
      traps: ['Kabinett is a ripeness level, not a dry wine by rule.', 'Grosses Gewachs is dry; Grosse Lage is the vineyard.'],
      say: [['Spatlese', 'SHPAYT-lay-zuh'], ['Trocken', 'TROK-en']],
      cards: [{ f: 'The five Pradikat levels in order', b: 'Kabinett, Spatlese, Auslese, Beerenauslese, Trockenbeerenauslese. Eiswein sits beside Beerenauslese.' }],
      questions: [
        { id: 'r-de000001', cat: 'Germany', q: 'Which Pradikat level is the lightest?', opts: ['Kabinett', 'Spatlese', 'Auslese', 'Beerenauslese'], a: 0, exp: 'Kabinett is picked at normal ripeness; each later level is riper.' }
      ],
      sources: [{ title: 'Deutsches Weininstitut', asOf: '2026' }]
    },
    england: {
      key: 'england', name: 'England', mapless: 1,
      summary: 'England makes traditional method sparkling wine on the same chalk that runs under Champagne, in a cool maritime climate at the northern edge of ripening. The exam asks it as a sparkling region, by county, and expects the three Champagne grapes.',
      overview: 'The chalk of the South Downs and the North Downs is the Paris basin’s chalk, the same seam as Champagne’s. The counties that matter are Sussex, Kent and Hampshire.\n\nThe wines are made by the traditional method from Chardonnay, Pinot Noir and Meunier, with high acidity and long lees ageing.',
      ladder: [['PDO English Wine', 'The protected name for still wine.'], ['PDO English Quality Sparkling Wine', 'Traditional method, the Champagne grapes among those allowed, nine months on lees at least.']],
      labels: [['Sussex', 'A county, and since 2022 a PDO of its own for wines grown there.']],
      regionsOrder: [],
      places: [
        { name: 'Sussex', note: 'The South Downs chalk, the county with the most planted vineyard.', places: [{ name: 'South Downs', note: 'The chalk ridge itself, the best sparkling sites on its slopes.', depth: 'advanced' }] },
        { name: 'Kent', note: 'The North Downs chalk and the Thames estuary’s shelter.' }
      ],
      grapes: [{ name: 'Chardonnay', role: 'lead', styles: 'Blanc de blancs on chalk.' }, { name: 'Pinot Noir', role: 'lead', styles: 'The blend’s weight and the rose.' }],
      exam: ['Which three grapes make English sparkling wine.', 'Which counties the exam names.'],
      traps: ['English wine is not British wine; the second is made from imported must.'],
      say: [['Sussex', 'SUSS-ex']],
      cards: [{ f: 'The three grapes of English sparkling wine', b: 'Chardonnay, Pinot Noir and Meunier, the Champagne grapes, on the same chalk.' }],
      questions: [
        { id: 'r-en000001', cat: 'England', q: 'Which rock runs under the best English sparkling vineyards?', opts: ['Chalk', 'Slate', 'Granite', 'Schist'], a: 0, exp: 'The chalk of the Downs is the same seam as Champagne’s.' },
        { id: 'r-en000002', cat: 'England', q: 'Which county gained a PDO of its own in 2022?', sa: 1, accept: ['Sussex'], ans: 'Sussex', exp: 'Sussex was granted a PDO in 2022 for wines grown in the county.' }
      ],
      sources: [{ title: 'WineGB', asOf: '2026' }]
    }
  },
  regions: [
    {
      slug: 'champagne', name: 'Champagne', sheet: 'france', index: 0,
      asked: ['intro', 'certified', 'advanced', 'master'],
      summary: 'Champagne is the cool chalk country north east of Paris where the traditional method was perfected. Three grapes, Chardonnay, Pinot Noir and Meunier, are blended across villages and years into a house style. The second fermentation happens in the bottle, the wine rests on its lees, and the dosage sets its sweetness. A server sells it by its style words: brut, blanc de blancs, rose, vintage.',
      terroir: {
        climate: 'Cool and continental with a maritime edge: frost in spring, rain at harvest, grapes that ripen with high acidity and modest sugar, which is what a sparkling base wine wants.',
        soils: 'Chalk, a deep porous bed under a thin topsoil, holding water in a dry summer and draining a wet one, and the cellars are cut into it.',
        topography: 'Low ridges and slopes above the Marne, the Montagne de Reims a plateau with vines on its flanks, the Cote des Blancs an east facing slope.',
        water: 'The Marne runs through the heart of the region, its valley the Meunier’s home.'
      },
      grapes: [
        { name: 'Chardonnay', role: 'lead', styles: 'Blanc de blancs from the Cote des Blancs: citrus, chalk, long ageing.' },
        { name: 'Pinot Noir', role: 'lead', styles: 'Weight and red fruit from the Montagne de Reims and the Aube.' },
        { name: 'Meunier', plain: 1, role: 'blending', styles: 'Fruit and early charm from the Vallee de la Marne.' }
      ],
      wines: [
        { style: 'Brut NV', colour: 'sparkling', note: 'The house style, blended across years. Dry, under twelve grams of sugar. Served cold in a tulip, with oysters or the turtle soup.' },
        { style: 'Blanc de blancs', colour: 'sparkling', note: 'Chardonnay alone: citrus and chalk, the aperitif glass.' },
        { style: 'Rose', colour: 'sparkling', note: 'Made by blending a little still red into the base, which only Champagne may do for rose.' }
      ],
      made: {
        viticulture: 'Vines are trained low on the chalk in four permitted systems, picked by hand because whole bunches go to the press, with yields set each year by the region. Spring frost and harvest rain are the hazards; the slopes and the chalk are the answer.',
        winemaking: 'The traditional method: a still base wine, the liqueur de tirage, a second fermentation in the bottle, months or years on the lees, riddling, disgorgement, dosage and cork. Non vintage rests fifteen months at least, vintage three years.'
      },
      law: {
        classification: 'One appellation covers the whole region. The villages are ranked on the echelle des crus: seventeen grand cru villages, forty two premier cru villages, and the rest. A grand cru on the label means every grape came from grand cru villages.',
        tiers: [['Grand cru', 'Seventeen villages; every grape from them for the word on the label.'], ['Premier cru', 'Forty two villages on the old scale.'], ['Champagne AOC', 'The whole region, the base of the ladder.']],
        labels: [['Brut', 'Under twelve grams of sugar per litre.'], ['Extra brut', 'Under six grams.'], ['Blanc de noirs', 'White wine from the black grapes alone.'], ['RM', 'Recoltant manipulant: a grower who makes the wine from its own grapes.']]
      },
      places: [
        { name: 'Montagne de Reims', note: 'The plateau south of Reims, Pinot Noir on its northern and eastern slopes.', places: [{ name: 'Bouzy', note: 'Grand cru village known for its Pinot Noir and its still red.', depth: 'advanced' }, { name: 'Verzenay', note: 'A north facing grand cru village whose Pinot Noir gives the blends their spine.', depth: 'master' }] },
        { name: 'Cote des Blancs', note: 'The east facing chalk slope south of Epernay, Chardonnay almost alone.', places: [{ name: 'Le Mesnil-sur-Oger', note: 'Grand cru village of the longest lived blanc de blancs.', depth: 'advanced' }] },
        { name: 'Vallee de la Marne', note: 'Meunier country along the river.' }
      ],
      producers: [
        { id: 'p-krug', name: 'Krug', why: 'The house of the oak fermented, long aged, multi vintage Grande Cuvee.' },
        { name: 'Billecart-Salmon', why: 'A family house known for its rose and its cool, slow fermentations.' }
      ],
      exam: ['The three grapes and where each is strongest.', 'The steps of the traditional method in order.', 'The sweetness scale from brut nature to doux.', 'The lees ageing minimums for non vintage and vintage.'],
      traps: ['Rose by blending is allowed here and almost nowhere else in Europe.', 'Brut is not the driest word: extra brut and brut nature are drier.', 'Meunier, not Pinot Meunier, is the name the region now uses.'],
      say: [['Epernay', 'ay-pair-NAY'], ['Montagne de Reims', 'mon-TAN-yuh duh RANCE'], ['Meunier', 'muh-NYAY']],
      cards: [
        { f: 'The three grapes of Champagne', b: 'Chardonnay, Pinot Noir, Meunier.' },
        { f: 'Minimum lees ageing, non vintage and vintage', b: 'Fifteen months for non vintage, three years for vintage, counted from tirage.' },
        { f: 'How many grand cru villages?', b: 'Seventeen.' }
      ],
      questions: [
        { id: 'r-ch000001', cat: 'Champagne', q: 'How many grand cru villages does Champagne have?', opts: ['Nine', 'Seventeen', 'Twenty four', 'Forty two'], a: 1, exp: 'Seventeen villages are grand cru; forty two are premier cru on the old scale.' },
        { id: 'r-ch000002', cat: 'Champagne', q: 'Which grape is strongest on the Cote des Blancs?', opts: ['Chardonnay', 'Pinot Noir', 'Meunier', 'Pinot Blanc'], a: 0, exp: 'The Cote des Blancs is Chardonnay country; the Montagne de Reims leans to Pinot Noir and the Marne valley to Meunier.' },
        { id: 'r-ch000003', cat: 'Champagne', q: 'What is the minimum lees ageing for a vintage Champagne?', opts: ['Twelve months', 'Fifteen months', 'Two years', 'Three years'], a: 3, exp: 'Vintage rests three years from tirage; non vintage fifteen months.' },
        { id: 'r-ch000004', cat: 'Champagne', q: 'What do the letters RM mean on a Champagne label?', sa: 1, accept: ['Recoltant manipulant', 'Récoltant manipulant', 'grower producer', 'grower'], ans: 'Recoltant manipulant, a grower who makes wine from its own grapes', exp: 'RM is recoltant manipulant: the grower made the wine from its own grapes. NM is a house that buys grapes.' }
      ],
      sources: [{ title: 'Comite Champagne', url: 'https://www.champagne.fr/', asOf: '2026' }, { title: 'The appellation decree', asOf: '2010' }]
    },
    {
      slug: 'burgundy', name: 'Burgundy', sheet: 'france', index: 3,
      asked: ['intro', 'certified', 'advanced', 'master'],
      summary: 'Burgundy is the home of Pinot Noir and Chardonnay grown one village at a time on a narrow limestone slope. The ladder climbs from regional wine to village, premier cru and grand cru, and the vineyard name is what a sommelier reads. Chablis to the north and the Maconnais to the south bracket the Cote d’Or. A server sells it by village and by producer, never by grape.',
      terroir: {
        climate: 'Continental: cold winters, hail in summer, a short ripening window that makes the vintage matter.',
        soils: 'Limestone and marl of the Jurassic, the proportions shifting slope by slope, which is the whole argument for the cru.',
        topography: 'A single east and south east facing escarpment, the Cote d’Or, with the best sites in the middle of the slope.',
        water: 'The Saone runs along the plain below; the vines keep to the slope above it.'
      },
      grapes: [
        { name: 'Pinot Noir', role: 'lead', styles: 'Red Burgundy, from light village wine to the grands crus of the Cote de Nuits.' },
        { name: 'Chardonnay', role: 'lead', styles: 'White Burgundy: steely in Chablis, rich on the Cote de Beaune, easy in the Maconnais.' },
        { name: 'Aligote', plain: 1, role: 'minor', styles: 'The second white, crisp, the base of the kir.' }
      ],
      wines: [
        { style: 'Chablis', colour: 'white', note: 'Chardonnay on Kimmeridgian limestone, unoaked or lightly oaked, oysters and shellfish.' },
        { style: 'Meursault', colour: 'white', note: 'The Cote de Beaune’s rich white, hazelnut and butter, with the roasted bird.' },
        { style: 'Gevrey-Chambertin', colour: 'red', note: 'The Cote de Nuits’ sturdy red, dark cherry and earth, with the lamb.' }
      ],
      made: {
        viticulture: 'Vines are planted dense, trained low in Guyot, and picked by hand on the slope. Frost and hail are the hazards; the slope’s drainage and its aspect are the asset. The best sites sit mid slope where the soil is thin and the sun long.',
        winemaking: 'Reds are fermented in open vats, with or without the stems, and aged in Burgundian barrels of 228 litres; whites are pressed whole and fermented in barrel with their lees stirred. Oak is a seasoning, new barrels rising with the cru.'
      },
      law: {
        classification: 'Four rungs. Regional appellations cover the whole region. Village appellations name a commune. Premier cru names a vineyard after the village. Grand cru names the vineyard alone, with no village on the label.',
        tiers: [['Grand cru', 'Thirty three vineyards, the vineyard name alone on the label.'], ['Premier cru', 'A named vineyard after its village: Meursault Perrieres.'], ['Village', 'A commune: Meursault.'], ['Regional', 'Bourgogne, the base.']],
        labels: [['Climat', 'A named vineyard parcel.'], ['Monopole', 'A vineyard owned by one estate.'], ['Domaine', 'An estate that grows and makes its own wine.']]
      },
      places: [
        { name: 'Chablis', note: 'The northern outpost on Kimmeridgian limestone, Chardonnay alone.', places: [{ name: 'Les Clos', note: 'The largest and most famous of the seven grand cru climats.', depth: 'advanced' }] },
        { name: 'Cote de Nuits', note: 'The northern half of the Cote d’Or, nearly all red.', places: [{ name: 'Gevrey-Chambertin', note: 'Nine grands crus, the most of any village.' }, { name: 'Vosne-Romanee', note: 'The village of the most expensive wine in the world.', depth: 'advanced' }] },
        { name: 'Cote de Beaune', note: 'The southern half, the great whites and softer reds.', places: [{ name: 'Meursault', note: 'No grand cru, the richest white village.' }, { name: 'Puligny-Montrachet', note: 'Shares Montrachet with Chassagne.' }] },
        { name: 'Maconnais', note: 'The south, easy Chardonnay, Pouilly-Fuisse its best.' }
      ],
      producers: [
        { id: 'p-dom-leflaive', name: 'Domaine Leflaive', why: 'The biodynamic reference for Puligny-Montrachet and its grands crus.' },
        { id: 'p-dom-romanee-conti', name: 'Domaine de la Romanee-Conti', why: 'The estate of the monopole Romanee-Conti and La Tache.' }
      ],
      exam: ['The four rungs and how each reads on a label.', 'The grands crus of Gevrey-Chambertin, by name.', 'Which villages are white and which red.', 'Chablis’ limestone by name.'],
      traps: ['A grand cru label carries no village name; a premier cru does.', 'Meursault has no grand cru.', 'Pouilly-Fuisse is Chardonnay in the Maconnais; Pouilly-Fume is Sauvignon Blanc in the Loire.'],
      say: [['Meursault', 'MUR-so'], ['Gevrey-Chambertin', 'zhev-RAY shom-bair-TAN'], ['Puligny-Montrachet', 'poo-lee-NYEE mon-rah-SHAY']],
      cards: [
        { f: 'The four rungs of Burgundy', b: 'Regional, village, premier cru, grand cru.' },
        { f: 'Chablis’ limestone', b: 'Kimmeridgian, with Portlandian on the higher Petit Chablis sites.' },
        { f: 'Grand cru of Gevrey-Chambertin: how many?', b: 'Nine, Chambertin and Chambertin-Clos de Beze at their head.' }
      ],
      questions: [
        { id: 'r-bg000001', cat: 'Burgundy', q: 'Which rung of Burgundy carries the vineyard name alone, with no village on the label?', opts: ['Regional', 'Village', 'Premier cru', 'Grand cru'], a: 3, exp: 'A grand cru label names the vineyard alone; a premier cru names the vineyard after its village.' },
        { id: 'r-bg000002', cat: 'Burgundy', q: 'Which white grape makes Chablis?', opts: ['Chardonnay', 'Aligote', 'Sauvignon Blanc', 'Chenin Blanc'], a: 0, exp: 'Chablis is Chardonnay on Kimmeridgian limestone; Pouilly-Fume, the Loire’s false friend, is Sauvignon Blanc.' },
        { id: 'r-bg000003', cat: 'Burgundy', q: 'How many grands crus does Gevrey-Chambertin hold?', opts: ['Five', 'Seven', 'Nine', 'Eleven'], a: 2, exp: 'Nine, the most of any Burgundy village.' },
        { id: 'r-bg000004', cat: 'Burgundy', q: 'Name the limestone under Chablis’ best vineyards.', sa: 1, accept: ['Kimmeridgian', 'Kimmeridgian limestone', 'Kimmeridge'], ans: 'Kimmeridgian limestone', exp: 'Kimmeridgian marl and limestone under Chablis and its grands crus; Portlandian under Petit Chablis.' }
      ],
      sources: [{ title: 'BIVB, the Burgundy wine board', url: 'https://www.bourgogne-wines.com/', asOf: '2026' }]
    },
    {
      slug: 'mosel', name: 'Mosel', sheet: 'germany', index: 1,
      asked: ['certified', 'advanced', 'master'],
      summary: 'The Mosel is Riesling on slate, on slopes so steep they are worked by hand and by winch. The river’s bends give south facing walls of blue and red slate that hold the day’s heat. The wines are light in alcohol, high in acid and often carry a little sweetness that balances them. A server sells them by village and vineyard and by the Pradikat word.',
      terroir: {
        climate: 'Cool and northern, among the coolest places that ripen Riesling; the slate and the river make it possible.',
        soils: 'Devonian slate, blue and grey in the middle Mosel, red where iron runs through it, warming by day and draining fast.',
        topography: 'Slopes of sixty degrees and more above the river bends, the best facing south and south west.',
        water: 'The Mosel itself, with the Saar and the Ruwer joining it, reflecting light and tempering frost.'
      },
      grapes: [
        { name: 'Riesling', role: 'lead', styles: 'From dry to Trockenbeerenauslese, lime, slate and a nerve of acidity.' },
        { name: 'Muller-Thurgau', plain: 1, role: 'minor', styles: 'The flatter land’s easy white.' }
      ],
      wines: [
        { style: 'Riesling Kabinett', colour: 'white', note: 'Light, off dry, eight percent alcohol, with the crab or on its own.' },
        { style: 'Riesling Auslese', colour: 'sweet', note: 'Sweet, honeyed, with foie gras or a fruit dessert.' }
      ],
      made: {
        viticulture: 'Single stake training on the steep slopes, every vine tended by hand, the harvest late and in passes through the vineyard to pick the ripest bunches. Erosion and the sheer labour are the hazards; the slate is the reason to bear them.',
        winemaking: 'Gentle pressing, cool fermentation in old oak Fuder or steel, a fermentation stopped to keep sweetness or a Sussreserve added back, and no new oak.'
      },
      law: {
        classification: 'The German law ranks by ripeness: Pradikatswein from Kabinett to Trockenbeerenauslese, Qualitatswein below it. The VDP ranks the vineyard: Grosse Lage at the top.',
        tiers: [['Pradikatswein', 'Kabinett, Spatlese, Auslese, Beerenauslese, Eiswein, Trockenbeerenauslese.'], ['Qualitatswein', 'Quality wine from one of the thirteen regions, may be chaptalised.']],
        labels: [['Feinherb', 'Off dry, a word with no legal bound.'], ['Alte Reben', 'Old vines.']]
      },
      places: [
        { name: 'Bernkastel', note: 'The middle Mosel’s heart, the Doctor vineyard above the town.', places: [{ name: 'Wehlen', note: 'The Sonnenuhr, the sundial vineyard.', depth: 'advanced' }] },
        { name: 'Saar', note: 'The coldest tributary, the most nervous Riesling.', depth: 'advanced' }
      ],
      producers: [
        { id: 'p-jj-prum', name: 'Joh. Jos. Prum', why: 'The Wehlener Sonnenuhr estate whose Kabinett and Spatlese set the middle Mosel style.' }
      ],
      exam: ['The Pradikat ladder in order.', 'The slate and why it matters.', 'The villages of the middle Mosel and their famous vineyards.'],
      traps: ['Kabinett is a ripeness level, not a dry wine.', 'Eiswein is harvested frozen, at Beerenauslese ripeness, and is not botrytised.'],
      say: [['Bernkastel', 'BAIRN-kass-tel'], ['Wehlener Sonnenuhr', 'VAY-len-er ZON-en-oor']],
      cards: [
        { f: 'The rock of the Mosel', b: 'Devonian slate, blue, grey and red, holding the day’s heat on steep slopes.' },
        { f: 'Typical alcohol of a Mosel Kabinett', b: 'Around eight percent, with residual sugar balancing high acidity.' }
      ],
      questions: [
        { id: 'r-mo000001', cat: 'Mosel', q: 'Which rock underlies the best Mosel vineyards?', opts: ['Slate', 'Chalk', 'Granite', 'Limestone'], a: 0, exp: 'Devonian slate, which holds the day’s heat and drains the steep slopes.' },
        { id: 'r-mo000002', cat: 'Mosel', q: 'Which grape is the Mosel’s lead?', opts: ['Riesling', 'Silvaner', 'Muller-Thurgau', 'Spatburgunder'], a: 0, exp: 'Riesling is the Mosel’s grape; Muller-Thurgau fills the flatter land.' },
        { id: 'r-mo000003', cat: 'Mosel', q: 'Name the two tributaries joined to the Mosel in the region’s name.', sa: 1, accept: ['Saar and Ruwer', 'Saar, Ruwer', 'Ruwer and Saar'], ans: 'The Saar and the Ruwer', exp: 'The region was Mosel-Saar-Ruwer until 2007; the Saar and the Ruwer are its two cold tributaries.' }
      ],
      sources: [{ title: 'Weinbauverband Mosel', asOf: '2026' }]
    }
  ],
  join: {
    aliases: {
      'montagne de reims': 'champagne', 'cote des blancs': 'champagne', 'vallee de la marne': 'champagne', 'aube': 'champagne',
      'cote de nuits': 'burgundy', 'cote de beaune': 'burgundy', 'cote d or': 'burgundy', 'maconnais': 'burgundy', 'chablis': 'burgundy', 'macon': 'burgundy',
      'bernkastel': 'mosel', 'saar': 'mosel', 'ruwer': 'mosel',
      'sussex': 'england', 'kent': 'england'
    },
    terroir: { 'Champagne': 'champagne', 'Chablis': 'burgundy', 'Côte d\'Or': 'burgundy', 'Mosel': 'mosel' },
    cats: { 'Champagne': ['champagne'], 'Burgundy': ['burgundy'], 'Germany': ['mosel'], 'champagne': ['champagne'], 'burgundy': ['burgundy'], 'Sparkling Wine World': ['champagne'] },
    grapes: { 'Chardonnay': ['champagne', 'burgundy'], 'Pinot Noir': ['champagne', 'burgundy'], 'Riesling': ['mosel'], 'Meunier': ['champagne'], 'Aligote': ['burgundy'], 'Muller-Thurgau': ['mosel'] },
    countryOnly: { 'france': 'france', 'germany': 'germany', 'england': 'england', 'val de loire': 'france', 'loire': 'france', 'deutschland': 'germany', 'uk': 'england', 'united kingdom': 'england' }
  }
};
