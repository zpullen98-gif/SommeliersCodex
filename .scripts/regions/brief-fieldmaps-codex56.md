# Fourteen field maps for the Wine Atlas: the brief for ChatGPT (codex56, 2 November 2026)

Outside Of Time is the owner's own study tool. These fourteen region articles are new in the Sommelier's Codex (codex56) and have no field map yet: each page shows its country's sheet with a line that its field map is to come. Claude does the engineering; you draw the maps. Draw one field map per article below, as the 115 region maps in `js/data-field-atlas.js` are drawn, and hand back the records and the art in that file's contract.

## The contract (one record per map in `FIELD_ATLAS.maps`)

- `id`: the article's slug, given below. `title`: the article's name, exactly as given. `type`: `"region"`.
- `countryKey` and `sheet`: the article's sheet, given below (the four United States sheets are one country to the resolver; Virginia lives on `new-york`, the East).
- `slug`: the same as `id`.
- `bounds`: `[west, south, east, north]` in degrees of longitude and latitude. The windows below are authored study windows, not appellation polygons; widen one only as far as it takes to hold every pin, since the gate refuses a place outside the view.
- `scope`: the house sentence, word for word: "Orientation map with representative study locations and selected rivers and towns. Country and state outlines are geographic context, not appellation boundaries. No vineyard parcels or elevation model are implied."
- `summary`: one orientation line, given below.
- `places`: at most 12. The first is the article's study location (`kind: "study location"`, the article's name) where one is given. Each lesson pin is a GeoNames town centre (`kind: "lesson town"`, `name` as GeoNames spells it, `lon`, `lat`, `geonameId`, `sourceUrl` `https://www.geonames.org/<id>/`), with `lessonName` the article's place name exactly as written below, `lessonParent` the place it sits under (empty at the top level), `match` `"exact normalized lesson heading"`, `note` the house's generic line, word for word with the place's lessonName in it ("Town or settlement centre associated with “<lessonName>” in the regional guide. The dot locates the settlement, not an appellation boundary or an individual vineyard.") and `lessonNote` the article's note given below. The district join on the region page reads `lessonName`, so it must match the article's place name character for character. Context towns from Natural Earth (`kind: "town / city context"`) may fill the budget after the lesson pins.
- `sources`: the article's sources that carry an https address (listed below), then the sheet's and the geographic ones the other maps cite (Natural Earth country outlines, rivers and lakes; GeoNames for town coordinates). Every map carries at least one https source.
- `grapes`: the article's grape names, given below. `water`: the rivers, lakes and seas to draw, named as Natural Earth names them (a suggestion is given; keep only what the geographic source holds, and invent no course).
- `file`: `maps/regions-v1/<slug>.svg`. The SVG is self-contained, with `<title id="title">` and `<desc id="desc">`, no script and no event attribute, and no NaN or Infinity in a path; `bytes` and `sha256` are measured from the file as shipped. Draw in the house style of the other region maps (the 1200 by 1500 sheet, the sea and land gradients, the print grain, serif lettering).

## The house rules for every string

British spelling (colour, centre, ageing, per cent, towards); no dash of any kind, neither the long nor the short one, nor an entity or a spaced double hyphen standing in for one: use a comma, a colon or a full stop; levels named, never numbered (Régionale, Village, Premier Cru, Grand Cru); nobody living named; no superlative; never the retired word for study (say rehearse, drill or study). A place the exam asks only from Premier Cru or Grand Cru is marked so below; draw it lighter or smaller if you mark depth at all, and never label it with a bare level name.

## What Claude does when the maps come back

The field atlas builder (`.scripts/atlas-regions/build.cjs`) and its gate (`.scripts/check-field-atlas.cjs`) hold the collection to 115 region maps, one per numbered atlas region, and leave the articles off the map unillustrated. Claude extends both to take these fourteen (a window and anchors per article in place of a catalogue entry), lifts the "field map to come" line from the fourteen pages once a map lands, and proves the shell and the cache as for the other maps.

## The fourteen

| # | id | title | sheet | bounds [west, south, east, north] | pins |
|---|---|---|---|---|---|
| 1 | `jura` | Jura | `france` | [5.25, 46.4, 6.05, 47.1] | 10 |
| 2 | `savoie` | Savoie and Bugey | `france` | [5.2, 45.2, 6.9, 46.5] | 12 |
| 3 | `south-west-france` | South West France | `france` | [-1.8, 42.9, 3.3, 45.2] | 12 |
| 4 | `corsica` | Corsica | `france` | [8.4, 41.3, 9.7, 43.1] | 10 |
| 5 | `emilia-romagna` | Emilia-Romagna | `italy` | [9.2, 43.7, 12.8, 45.2] | 12 |
| 6 | `marche` | Marche | `italy` | [12.2, 42.65, 14, 44] | 10 |
| 7 | `liguria-valle-d-aosta` | Liguria and Valle d'Aosta | `italy` | [6.75, 43.7, 10.2, 46] | 12 |
| 8 | `lazio` | Lazio | `italy` | [11.4, 40.9, 14.1, 42.9] | 10 |
| 9 | `calabria-basilicata` | Calabria and Basilicata | `italy` | [15.2, 37.85, 17.3, 41.2] | 11 |
| 10 | `canary-islands` | Canary Islands | `spain` | [-18.3, 27.55, -13.3, 29.45] | 11 |
| 11 | `txakoli` | Txakoli and the Basque Country | `spain` | [-3.5, 42.45, -1.2, 43.55] | 9 |
| 12 | `ribeiro-ribeira-sacra` | Ribeiro, Ribeira Sacra and Valdeorras | `spain` | [-8.4, 41.8, -6.4, 42.75] | 12 |
| 13 | `mittelrhein` | Mittelrhein | `germany` | [7.05, 49.9, 8, 50.75] | 9 |
| 14 | `virginia` | Virginia | `new-york` | [-83.7, 36.5, -75.2, 39.5] | 11 |

### 1. Jura (`jura`)

- `id` and `slug`: `jura`; `title`: Jura; `type`: `region`; `countryKey` and `sheet`: `france` (France)
- `bounds`: `[5.25, 46.4, 6.05, 47.1]`
- `summary`: Eastern France between Burgundy and Switzerland: a narrow band of slopes from Arbois south past Lons-le-Saunier.
- `water` (suggested): Doubs, Loue, Ain
- `grapes`: Chardonnay, Savagnin, Poulsard, Trousseau, Pinot Noir, Pinot Gris / Grigio
- `sources` with an address: Comité Interprofessionnel des Vins du Jura, the appellations and grapes (2026), https://www.jura-vins.com/

The pins, in drawing order (look each town up in GeoNames by the name given):

| # | lessonName | lessonParent | kind | look up | depth | lessonNote |
|---|---|---|---|---|---|---|
| 1 | Jura |  | study location | between Poligny and Château-Chalon |  | The article's study location; no note. |
| 2 | Arbois |  | lesson town | Arbois |  | The northern capital of Jura wine and a commune appellation covering every colour and style around the town where Louis Pasteur (1822 to 1895) grew up and later studied fermentation. |
| 3 | Pupillin | Arbois | lesson town | Pupillin |  | A hilltop village above Arbois whose name may follow Arbois on the label; it calls itself the capital of Poulsard, spelt Ploussard here. |
| 4 | Montigny-lès-Arsures | Arbois | lesson town | Montigny-lès-Arsures |  | A village just north of Arbois whose warm, well drained gravels suit Trousseau, which it claims as its own grape. |
| 5 | Château-Chalon |  | lesson town | Château-Chalon |  | A village perched on a cliff above the Seille, whose appellation is vin jaune alone, from Savagnin on grey marl; Chardonnay or red grown inside the boundary is sold as Côtes du Jura. |
| 6 | Domblans, Ménétru-le-Vignoble and Nevy-sur-Seille | Château-Chalon | lesson town | Ménétru-le-Vignoble | asked from Grand Cru | With Château-Chalon itself, the four communes the appellation covers, Domblans only in part. |
| 7 | L'Étoile |  | lesson town | L'Étoile |  | A small appellation just north of Lons-le-Saunier for white wines only, named, by the usual account, for the star-shaped fossil fragments of sea lilies in its marls: Chardonnay and Savagnin, with a little Poulsard pressed white. |
| 8 | Poligny | Côtes du Jura | lesson town | Poligny | asked from Premier Cru | A town in the middle of the vineyard, better known for Comté cheese, whose slopes make Côtes du Jura in every style. |
| 9 | Arlay | Côtes du Jura | lesson town | Arlay | asked from Premier Cru | A village south of Château-Chalon around an old château estate known for vin jaune and vin de paille. |
| 10 | Sud Revermont | Côtes du Jura | lesson town | Rotalier | asked from Grand Cru | The southern stretch of the Côtes du Jura around Rotalier and Gevingey, on marl and limestone, where several estates bottle topped-up Chardonnay from named parcels. |

Every place of the article, as the region page lists The districts (the pins above are chosen from these; the rest stay in the reading):

- Arbois
  - Pupillin
  - Montigny-lès-Arsures
- Château-Chalon
  - Domblans, Ménétru-le-Vignoble and Nevy-sur-Seille (asked from Grand Cru)
- L'Étoile
- Côtes du Jura
  - Poligny (asked from Premier Cru)
  - Arlay (asked from Premier Cru)
  - Sud Revermont (asked from Grand Cru)

### 2. Savoie and Bugey (`savoie`)

- `id` and `slug`: `savoie`; `title`: Savoie and Bugey; `type`: `region`; `countryKey` and `sheet`: `france` (France)
- `bounds`: `[5.2, 45.2, 6.9, 46.5]`
- `summary`: The French Alps south of Lake Geneva, around Chambéry and the Lac du Bourget, with Bugey across the Rhône in the Ain.
- `water` (suggested): Rhône, Isère, Arve, Lake Geneva, Lac du Bourget
- `grapes`: Jacquère, Altesse, Mondeuse Noire, Roussanne, Chasselas, Gamay, Pinot Noir, Chardonnay, Gringet, Persan
- `sources` with an address: none in the article; cite the geographic sources and the sheet's

The pins, in drawing order (look each town up in GeoNames by the name given):

| # | lessonName | lessonParent | kind | look up | depth | lessonNote |
|---|---|---|---|---|---|---|
| 1 | Savoie and Bugey |  | study location | Chambéry |  | The article's study location; no note. |
| 2 | Lake Geneva |  | lesson town | Thonon-les-Bains |  | The vineyards on the French shore of the lake, in the Chablais near Thonon-les-Bains, where Chasselas makes the crus Crépy, Marin, Marignan and Ripaille on gravel and moraine. |
| 3 | Ayze |  | lesson town | Ayze | asked from Premier Cru | A cru in the Arve valley below the Mont Blanc massif, where the rare Gringet makes still and sparkling whites. |
| 4 | Seyssel |  | lesson town | Seyssel |  | Two towns of the same name facing each other across the Rhône, one in the Ain and one in Haute-Savoie, an appellation since 1942 for still Altesse whites and a traditional method sparkling wine that keeps the local Molette. |
| 5 | Chautagne | Seyssel | lesson town | Ruffieux | asked from Premier Cru | A Vin de Savoie cru between the Rhône and the north end of the Lac du Bourget, known for light reds as well as whites. |
| 6 | Jongieux |  | lesson town | Jongieux | asked from Premier Cru | A cru on the slopes above the Rhône west of the Lac du Bourget, for Jacquère, Gamay, Mondeuse and Pinot Noir. |
| 7 | Apremont and Abymes |  | lesson town | Apremont |  | Two Jacquère crus south of Chambéry on the rubble of the Mont Granier, whose face collapsed in November 1248; the broken limestone drains fast and warms quickly. |
| 8 | Chignin | Combe de Savoie | lesson town | Chignin |  | A cru at the head of the Combe, for Jacquère whites and some red as Chignin and for Roussanne alone as Chignin-Bergeron, on limestone scree. |
| 9 | Arbin | Combe de Savoie | lesson town | Arbin |  | The cru for Mondeuse Noire, dark and peppery red on warm south-east facing slopes. |
| 10 | Tarentaise and Maurienne |  | lesson town | Moûtiers | asked from Grand Cru | The high valleys of the Isère and the Arc, where a few estates have revived vineyards on schist with Persan, Mondeuse and Jacquère, sold mostly as IGP Vin des Allobroges. |
| 11 | Bugey |  | lesson town | Belley |  | Across the Rhône in the Ain, between Savoie and the Jura: Chardonnay, Gamay, Pinot Noir, Mondeuse and Altesse under the appellations Bugey and Roussette du Bugey, both AOC since 2009. |
| 12 | Cerdon | Bugey | lesson town | Cerdon |  | The Bugey cru for a sweet, pink, lightly sparkling wine of Gamay and Poulsard made by the ancestral method. |

Every place of the article, as the region page lists The districts (the pins above are chosen from these; the rest stay in the reading):

- Lake Geneva
  - Ripaille (asked from Premier Cru)
  - Crépy, Marin and Marignan (asked from Premier Cru)
- Ayze (asked from Premier Cru)
- Seyssel
  - Frangy (asked from Premier Cru)
  - Chautagne (asked from Premier Cru)
- Jongieux (asked from Premier Cru)
  - Marestel (asked from Premier Cru)
  - Monthoux and Monterminod (asked from Premier Cru)
- Apremont and Abymes
- Combe de Savoie
  - Chignin
  - Arbin
  - Cruet, Montmélian, Saint-Jean-de-la-Porte and Saint-Jeoire-Prieuré (asked from Premier Cru)
- Tarentaise and Maurienne (asked from Grand Cru)
- Bugey
  - Cerdon
  - Montagnieu (asked from Premier Cru)
  - Manicle and Virieu-le-Grand (asked from Grand Cru)

### 3. South West France (`south-west-france`)

- `id` and `slug`: `south-west-france`; `title`: South West France; `type`: `region`; `countryKey` and `sheet`: `france` (France)
- `bounds`: `[-1.8, 42.9, 3.3, 45.2]`
- `summary`: The inland south-west between Bordeaux and the Pyrenees, from the Dordogne and the Lot down to the Basque Country.
- `water` (suggested): Dordogne, Lot, Tarn, Garonne, Adour
- `grapes`: Malbec, Tannat, Petit Manseng, Gros Manseng, Merlot, Cabernet Franc, Cabernet Sauvignon, Sémillon, Sauvignon Blanc, Muscadelle, Colombard, Fer Servadou, Négrette, Mauzac, Len de l'El
- `sources` with an address: Union Interprofessionnelle du Vin de Cahors, the Cahors vineyard (2026), https://vindecahors.fr/en/cahors-vineyard; Vins de Fronton, the appellation (2026), https://vins-de-fronton.com/en/laop/

The pins, in drawing order (look each town up in GeoNames by the name given):

| # | lessonName | lessonParent | kind | look up | depth | lessonNote |
|---|---|---|---|---|---|---|
| 1 | South West France |  | study location | Agen |  | The article's study location; no note. |
| 2 | Bergerac |  | lesson town | Bergerac |  | The Dordogne's wine town, south-east of Bordeaux's Right Bank, at the heart of a regional AOC for every colour from Bordeaux's grapes, with stricter names inside it. |
| 3 | Monbazillac | Bergerac | lesson town | Monbazillac |  | Clay-limestone slopes on the south bank facing the town across the river, where autumn mists bring noble rot to Sémillon, Sauvignon and Muscadelle for sweet wine. |
| 4 | Côtes de Duras, Buzet and Côtes du Marmandais |  | lesson town | Duras | asked from Premier Cru | Bordeaux's neighbours on the Dropt and the Garonne, making Bordeaux-style reds, rosés and whites from Merlot, the Cabernets and Sauvignon; the Marmandais adds the local Abouriou. |
| 5 | Cahors |  | lesson town | Cahors |  | The Lot valley's red appellation around the town of Cahors: Malbec on the river's gravel terraces, giving rounder wines, and on the limestone causse above, giving firmer, longer-lived ones. |
| 6 | Gaillac |  | lesson town | Gaillac |  | An old vineyard on both banks of the Tarn north-east of Toulouse, making every style: Mauzac and Len de l'El for dry, sweet and sparkling whites, Duras, Braucol and Syrah for reds. |
| 7 | Fronton |  | lesson town | Fronton | asked from Premier Cru | Red and rosé on the Tarn's old terraces north of Toulouse, led by the soft, violet-scented Négrette. |
| 8 | Marcillac |  | lesson town | Marcillac-Vallon | asked from Premier Cru | A red appellation in the Aveyron on red clay and sandstone, almost wholly Fer Servadou, called Mansois here: peppery and fresh, with red berry and iron notes. |
| 9 | Côtes de Gascogne |  | lesson town | Eauze |  | The IGP of the Gers, Armagnac country, where Colombard and Ugni Blanc once grown for brandy now make crisp, inexpensive whites, with Gros Manseng and Sauvignon Blanc. |
| 10 | Madiran |  | lesson town | Madiran |  | Hill country north of Pau where the Gers, the Hautes-Pyrénées and the Pyrénées-Atlantiques meet: red only, led by Tannat on clay and pebbly slopes. |
| 11 | Jurançon |  | lesson town | Jurançon |  | Steep, south-facing slopes in the Pyrenean foothills south and west of Pau, on clay, sandstone and conglomerate: white only, dry as Jurançon Sec and sweet from shrivelled grapes. |
| 12 | Irouléguy |  | lesson town | Saint-Étienne-de-Baïgorry |  | The French Basque Country's appellation around Saint-Étienne-de-Baïgorry, on terraced red sandstone near Spain: firm Tannat-led reds and rosés, and whites from the Mansengs and Petit Courbu. |

Every place of the article, as the region page lists The districts (the pins above are chosen from these; the rest stay in the reading):

- Bergerac
  - Monbazillac
  - Pécharmant (asked from Premier Cru)
  - Saussignac
  - Montravel (asked from Grand Cru)
- Côtes de Duras, Buzet and Côtes du Marmandais (asked from Premier Cru)
- Cahors
- Gaillac
- Fronton (asked from Premier Cru)
- Marcillac (asked from Premier Cru)
  - Entraygues-Le Fel, Estaing and Côtes de Millau (asked from Grand Cru)
- Côtes de Gascogne
  - Saint-Mont (asked from Premier Cru)
  - Tursan (asked from Grand Cru)
- Madiran
  - Pacherenc du Vic-Bilh
- Jurançon
- Irouléguy
- Béarn (asked from Grand Cru)

### 4. Corsica (`corsica`)

- `id` and `slug`: `corsica`; `title`: Corsica; `type`: `region`; `countryKey` and `sheet`: `france` (France)
- `bounds`: `[8.4, 41.3, 9.7, 43.1]`
- `summary`: A mountainous Mediterranean island south-east of Provence and north of Sardinia.
- `water` (suggested): Golo, Tavignano
- `grapes`: Sangiovese, Sciaccarello, Vermentino, Muscat Blanc, Grenache / Garnacha, Biancu Gentile, Minustellu, Aleatico
- `sources` with an address: Agence du Tourisme de la Corse, a renowned terroir and wines with a strong identity (2026), https://www.visit-corsica.com/en/Explore-Corsica/Our-inspirations/Wine-inspirations/A-renowned-terroir-and-wines-which-have-a-strong-identity

The pins, in drawing order (look each town up in GeoNames by the name given):

| # | lessonName | lessonParent | kind | look up | depth | lessonNote |
|---|---|---|---|---|---|---|
| 1 | Corsica |  | study location | Corte |  | The article's study location; no note. |
| 2 | Patrimonio |  | lesson town | Patrimonio |  | The Nebbio around the Gulf of Saint-Florent, west of Bastia, a pocket of limestone and clay-limestone on an island of granite and schist: Nielluccio reds and rosés and Vermentino whites. |
| 3 | Ajaccio |  | lesson town | Ajaccio |  | Granite hills around the island's capital on the west coast, an appellation of its own since 1984: pale, peppery Sciaccarello reds and rosés and Vermentino whites. |
| 4 | Calvi | Corse or Vin de Corse | lesson town | Calvi | asked from Premier Cru | The Balagne in the north-west, granite hills between the mountains and the sea, for wines of all three colours. |
| 5 | Sartène | Corse or Vin de Corse | lesson town | Sartène | asked from Premier Cru | Granite valleys in the south-west around the town of Sartène, home ground of Sciaccarello. |
| 6 | Figari | Corse or Vin de Corse | lesson town | Figari | asked from Premier Cru | A windswept granite plateau in the far south, between Sartène and Bonifacio. |
| 7 | Porto-Vecchio | Corse or Vin de Corse | lesson town | Porto-Vecchio | asked from Premier Cru | Granite slopes on the south-east coast behind the gulf, for Vermentino whites and Sciaccarello and Nielluccio reds. |
| 8 | Coteaux du Cap Corse | Corse or Vin de Corse | lesson town | Rogliano | asked from Premier Cru | Schist slopes on the northern peninsula, for dry Vermentino whites and a few reds and rosés. |
| 9 | Muscat du Cap Corse |  | lesson town | Luri |  | The vin doux naturel of Muscat Blanc à Petits Grains from the schist of Cap Corse and the Patrimonio communes, an appellation since 1993. |
| 10 | The eastern plain |  | lesson town | Aléria | asked from Premier Cru | The flat alluvial coast south of Bastia around Aléria, which Greek settlers from Phocaea founded in the sixth century BC: the island's volume vineyard, mostly Vin de Corse and IGP Île de Beauté. |

Every place of the article, as the region page lists The districts (the pins above are chosen from these; the rest stay in the reading):

- Patrimonio
- Ajaccio
- Corse or Vin de Corse
  - Calvi (asked from Premier Cru)
  - Sartène (asked from Premier Cru)
  - Figari (asked from Premier Cru)
  - Porto-Vecchio (asked from Premier Cru)
  - Coteaux du Cap Corse (asked from Premier Cru)
- Muscat du Cap Corse
- The eastern plain (asked from Premier Cru)

### 5. Emilia-Romagna (`emilia-romagna`)

- `id` and `slug`: `emilia-romagna`; `title`: Emilia-Romagna; `type`: `region`; `countryKey` and `sheet`: `italy` (Italy)
- `bounds`: `[9.2, 43.7, 12.8, 45.2]`
- `summary`: Northern Italy south of the Po, from Piacenza east past Bologna to the Adriatic at Rimini.
- `water` (suggested): Po, Trebbia, Taro, Secchia, Panaro, Reno
- `grapes`: Lambrusco di Sorbara, Lambrusco Grasparossa, Lambrusco Salamino, Ancellotta, Sangiovese, Albana, Trebbiano Romagnolo, Pignoletto, Malvasia di Candia Aromatica, Barbera, Croatina
- `sources` with an address: Disciplinari di produzione dei vini DOP e IGP dell'Emilia-Romagna: Lambrusco di Sorbara, Gutturnio, Colli Bolognesi Pignoletto and Romagna (Regione Emilia-Romagna, Agricoltura) (2026), https://agricoltura.regione.emilia-romagna.it/dop-igp/temi/vini-dop-e-igp-emilia-romagna; Enoteca Regionale Emilia-Romagna, the DOP wines (2026), https://www.enotecaemiliaromagna.it/en/wines-and-wineries/dop-wines; Italian Wine Central, the denominations (Italian Wine Central) (2026), https://italianwinecentral.com/

The pins, in drawing order (look each town up in GeoNames by the name given):

| # | lessonName | lessonParent | kind | look up | depth | lessonNote |
|---|---|---|---|---|---|---|
| 1 | Emilia-Romagna |  | study location | Bologna |  | The article's study location; no note. |
| 2 | Modena |  | lesson town | Modena |  | The Lambrusco heart of Emilia, the plain and foothills around the city of balsamic vinegar, holding the three DOCs the Court names. |
| 3 | Sorbara | Modena | lesson town | Sorbara |  | A village on the plain north of Modena between the Secchia and the Panaro, whose sandy alluvium grows the pale, sharp Lambrusco di Sorbara. |
| 4 | Castelvetro | Modena | lesson town | Castelvetro di Modena |  | A hill town south of Modena at the heart of Lambrusco Grasparossa di Castelvetro, on clay and marl foothills that give a dark, tannic wine. |
| 5 | Santa Croce | Modena | lesson town | Carpi |  | A village near Carpi, north of Modena, that names Lambrusco Salamino di Santa Croce, the deep, fruity Lambrusco of the plain. |
| 6 | Reggio Emilia |  | lesson town | Reggio nell'Emilia | asked from Premier Cru | The province west of Modena, home of the Reggiano DOC, whose Lambrusco blends often take Ancellotta and come off dry or sweet, and of the large cooperatives behind the export trade. |
| 7 | Colli Piacentini |  | lesson town | Ziano Piacentino | asked from Premier Cru | The hills south of Piacenza on the Lombard border, a DOC for the white Ortrugo, aromatic Malvasia di Candia and the rare sweet Vin Santo di Vigoleno. |
| 8 | Colli di Parma |  | lesson town | Langhirano | asked from Grand Cru | The hills south of Parma, the prosciutto country, for frizzante Malvasia and light reds of Barbera and Croatina. |
| 9 | Colli Bolognesi |  | lesson town | Monteveglio | asked from Grand Cru | The hills south-west of Bologna, home of the Colli Bolognesi Pignoletto DOCG for Grechetto Gentile whites, still or frizzante. The DOCG was created in 2010 as Colli Bolognesi Classico Pignoletto and renamed in 2014, when a broader Pignoletto DOC was drawn around it; that DOC has been named Emilia-Romagna DOC since the 2024 harvest. |
| 10 | Romagna |  | lesson town | Faenza |  | The eastern half, from Imola to Rimini, where hills of clay, marl and spungone run down towards the Adriatic: Sangiovese for red, Albana and Trebbiano for white. |
| 11 | The Romagna Sangiovese subzones | Romagna | lesson town | Bertinoro | asked from Premier Cru | Romagna Sangiovese may name a hill subzone on its label, among them Bertinoro, Brisighella, Modigliana, Predappio, Oriolo and Serra: spungone at Bertinoro and Brisighella, sandstone and marl high in the Apennines at Modigliana. |
| 12 | Bosco Eliceo |  | lesson town | Mesola | asked from Grand Cru | Sandy coastal land by the Po delta between Ferrara and Ravenna, where Fortana makes a light, sharp and often frizzante red. |

Every place of the article, as the region page lists The districts (the pins above are chosen from these; the rest stay in the reading):

- Modena
  - Sorbara
  - Castelvetro
  - Santa Croce
- Reggio Emilia (asked from Premier Cru)
  - Colli di Scandiano e di Canossa
- Colli Piacentini (asked from Premier Cru)
  - Gutturnio
- Colli di Parma (asked from Grand Cru)
- Colli Bolognesi (asked from Grand Cru)
- Romagna
  - The Romagna Sangiovese subzones (asked from Premier Cru)
- Bosco Eliceo (asked from Grand Cru)

### 6. Marche (`marche`)

- `id` and `slug`: `marche`; `title`: Marche; `type`: `region`; `countryKey` and `sheet`: `italy` (Italy)
- `bounds`: `[12.2, 42.65, 14, 44]`
- `summary`: Central Italy on the Adriatic, between the Apennines and the sea, south of Romagna and north of Abruzzo.
- `water` (suggested): Esino, Metauro, Potenza, Chienti, Tronto
- `grapes`: Verdicchio, Montepulciano, Sangiovese, Pecorino, Passerina, Lacrima, Vernaccia Nera, Bianchello
- `sources` with an address: Disciplinari di produzione: Castelli di Jesi Verdicchio Riserva DOCG and Verdicchio di Matelica Riserva DOCG (2010), Conero DOCG, Offida DOCG (Ministero dell'agricoltura, as published by the Associazione Italiana Sommelier) (2026), https://aisitalia.it/Disciplinari/Marche/DOCG/Offida.pdf; Federdoc, the DOC and DOCG wines of the Marche (Federdoc, 2024) (2024), https://www.federdoc.com/new/regioni/en/Marches.pdf; Italian Wine Central, the denominations (Italian Wine Central) (2026), https://italianwinecentral.com/

The pins, in drawing order (look each town up in GeoNames by the name given):

| # | lessonName | lessonParent | kind | look up | depth | lessonNote |
|---|---|---|---|---|---|---|
| 1 | Marche |  | study location | Ancona |  | The article's study location; no note. |
| 2 | Castelli di Jesi |  | lesson town | Jesi |  | The hills west of Ancona on both banks of the Esino, named for the walled hill towns, the castelli, around Jesi: the larger Verdicchio zone, nearer the sea, with Classico covering its historic core. |
| 3 | Cupramontana and Staffolo | Castelli di Jesi | lesson town | Cupramontana | asked from Premier Cru | Hill towns on the higher right bank of the Esino, among the zone's cooler sites, whose Verdicchio is taut and slow to age. |
| 4 | Matelica |  | lesson town | Matelica |  | A high inland valley in the Apennines, running north to south between two ridges and closed to the sea, so its climate is continental with cold nights; its Verdicchio is leaner, sharper and slower to open than Jesi's. |
| 5 | Conero |  | lesson town | Sirolo |  | Monte Conero, a limestone headland rising straight from the Adriatic south of Ancona, whose slopes grow Montepulciano for Rosso Conero and the Conero DOCG. |
| 6 | Piceno |  | lesson town | Ascoli Piceno |  | The hills of the south around Ascoli Piceno, home of Rosso Piceno, a blend of Montepulciano and Sangiovese, with its Superiore from a smaller area near Ascoli. |
| 7 | Offida | Piceno | lesson town | Offida | asked from Premier Cru | A hill town north of Ascoli whose DOCG covers Pecorino, Passerina and a Montepulciano led Rosso. |
| 8 | Morro d'Alba |  | lesson town | Morro d'Alba | asked from Premier Cru | A village in the hills north-west of Ancona, home of the scented red Lacrima di Morro d'Alba. |
| 9 | Serrapetrona |  | lesson town | Serrapetrona | asked from Premier Cru | A hill village in the province of Macerata whose DOCG makes Vernaccia Nera into a sparkling red, dry or sweet, by three fermentations. |
| 10 | Bianchello del Metauro |  | lesson town | Fossombrone | asked from Grand Cru | The Metauro valley inland from Fano in the north of the region, a DOC for the light white Bianchello, Biancame by its variety name. |

Every place of the article, as the region page lists The districts (the pins above are chosen from these; the rest stay in the reading):

- Castelli di Jesi
  - Cupramontana and Staffolo (asked from Premier Cru)
- Matelica
- Conero
- Piceno
  - Offida (asked from Premier Cru)
- Morro d'Alba (asked from Premier Cru)
- Serrapetrona (asked from Premier Cru)
- Bianchello del Metauro (asked from Grand Cru)

### 7. Liguria and Valle d'Aosta (`liguria-valle-d-aosta`)

- `id` and `slug`: `liguria-valle-d-aosta`; `title`: Liguria and Valle d'Aosta; `type`: `region`; `countryKey` and `sheet`: `italy` (Italy)
- `bounds`: `[6.75, 43.7, 10.2, 46]`
- `summary`: North-western Italy: the Ligurian coast from the French border to La Spezia, and the Alpine valley of Aosta to the north.
- `water` (suggested): Dora Baltea, Ligurian Sea
- `grapes`: Vermentino, Pigato, Bosco, Albarola, Rossese, Dolcetto, Petit Rouge, Fumin, Nebbiolo, Prié Blanc, Petite Arvine, Cornalin, Muscat Blanc, Pinot Gris / Grigio
- `sources` with an address: Le Cinque Terre, the wines of the Cinque Terre and Sciacchetrà (DOC of 29 May 1973) (2026), https://www.lecinqueterre.org/eng/cinqueterrewines.php; Linkiesta, fifty years of the Rossese DOC, Liguria's first (2022), https://www.linkiesta.it/2022/08/rossese-prima-doc-ligure/; Disciplinare di produzione della DOC Rossese di Dolceacqua o Dolceacqua (DPR 28 January 1972) (2026), https://aisitalia.it/Disciplinari/Liguria/Rossese%20di%20Dolceacqua%20o%20Dolceacqua.pdf; Italian Wine Central, Valle d'Aosta or Vallée d'Aoste DOC (2026), https://italianwinecentral.com/denomination/valle-daosta-vallee-daoste-doc/; Regione Autonoma Valle d'Aosta, lovevda: Blanc de Morgex et de La Salle DOC (2026), https://www.lovevda.it/en/food-and-wine/wines/blanc-de-morgex-et-de-la-salle-doc

The pins, in drawing order (look each town up in GeoNames by the name given):

| # | lessonName | lessonParent | kind | look up | depth | lessonNote |
|---|---|---|---|---|---|---|
| 1 | Liguria and Valle d'Aosta |  | study location | Genoa |  | The article's study location; no note. |
| 2 | Rossese di Dolceacqua | Riviera di Ponente | lesson town | Dolceacqua |  | The valleys of the Nervia and its neighbours behind Ventimiglia, around the village of Dolceacqua near the French border: pale, perfumed Rossese reds, Liguria's first DOC in 1972. |
| 3 | Albenga | Riviera di Ponente | lesson town | Albenga | asked from Premier Cru | The plain and hills around Albenga in Savona province, the heartland of Pigato, whose wines are fuller and more savoury than the coast's Vermentino. |
| 4 | Ormeasco di Pornassio | Riviera di Ponente | lesson town | Pornassio | asked from Premier Cru | High hills of the upper Arroscia valley in Imperia province, towards Piedmont, where Dolcetto is called Ormeasco and makes a red and the rosé Sciac-trà; a DOC of its own since 2003. |
| 5 | Riviera di Levante |  | lesson town | Sestri Levante |  | The coast east of Genoa to Tuscany, steeper and more rugged, with Vermentino, Bosco, Albarola and Bianchetta Genovese on terraces above the sea. |
| 6 | Cinque Terre | Riviera di Levante | lesson town | Riomaggiore |  | Five villages on the cliffs north-west of La Spezia, Monterosso al Mare, Vernazza, Corniglia, Manarola and Riomaggiore, with terraced vineyards over the sea, worked by hand and by monorail: the dry white and the sweet Sciacchetrà. |
| 7 | Colli di Luni | Riviera di Levante | lesson town | Ortonovo | asked from Premier Cru | The hills around the old Roman port of Luni at Liguria's eastern end, a DOC that crosses into Tuscany, known for full, saline Vermentino. |
| 8 | Valle d'Aosta |  | lesson town | Aosta |  | The Alpine valley of the Dora Baltea between Mont Blanc and Piedmont, with one DOC and seven named sub-zones on the sunny north side of the valley. |
| 9 | Blanc de Morgex et de La Salle | Valle d'Aosta | lesson town | Morgex |  | The upper valley under Mont Blanc, from about 900 to 1,200 metres: ungrafted Prié Blanc on low pergolas, still or sparkling. |
| 10 | Enfer d'Arvier | Valle d'Aosta | lesson town | Arvier | asked from Premier Cru | A hot, sheltered bowl of rock at Arvier west of Aosta, whose name means hell for its summer heat; reds of Petit Rouge, once a DOC of its own. |
| 11 | Chambave | Valle d'Aosta | lesson town | Chambave | asked from Premier Cru | The middle valley east of Nus, known for Moscato Bianco made dry and as the sweet Flétri, and for a red of Petit Rouge. |
| 12 | Donnas | Valle d'Aosta | lesson town | Donnas |  | The last sub-zone before Piedmont, at the mouth of the valley: Nebbiolo, called Picotendro, on terraces and stone-pillared pergolas, once a DOC of its own. |

Every place of the article, as the region page lists The districts (the pins above are chosen from these; the rest stay in the reading):

- Riviera di Ponente
  - Rossese di Dolceacqua
  - Albenga (asked from Premier Cru)
  - Ormeasco di Pornassio (asked from Premier Cru)
- Riviera di Levante
  - Cinque Terre
  - Colli di Luni (asked from Premier Cru)
  - Golfo del Tigullio-Portofino and Colline di Levanto (asked from Grand Cru)
- Valle d'Aosta
  - Blanc de Morgex et de La Salle
  - Enfer d'Arvier (asked from Premier Cru)
  - Torrette (asked from Premier Cru)
  - Nus (asked from Premier Cru)
  - Chambave (asked from Premier Cru)
  - Arnad-Montjovet (asked from Premier Cru)
  - Donnas

### 8. Lazio (`lazio`)

- `id` and `slug`: `lazio`; `title`: Lazio; `type`: `region`; `countryKey` and `sheet`: `italy` (Italy)
- `bounds`: `[11.4, 40.9, 14.1, 42.9]`
- `summary`: Central Italy on the Tyrrhenian around Rome, from Lake Bolsena in the north to the Frosinone hills in the south-east.
- `water` (suggested): Tiber, Lake Bolsena, Lake Bracciano, Lake Albano
- `grapes`: Malvasia del Lazio, Malvasia Bianca di Candia, Trebbiano Toscano, Bellone, Cesanese, Montepulciano, Aleatico, Merlot
- `sources` with an address: Disciplinari di produzione: Frascati DOC (DPR 3 March 1966), Frascati Superiore DOCG and Cannellino di Frascati DOCG (DM 20 September 2011), Cesanese del Piglio DOCG, Est! Est!! Est!!! di Montefiascone DOC, Roma DOC (DM 2 August 2011) and Cesanese di Olevano Romano DOC (Ministero dell'agricoltura, as published by the Associazione Italiana Sommelier) (2026), https://aisitalia.it/Disciplinari/Lazio/DOC/Roma.pdf; Federdoc, the DOC and DOCG wines of Lazio (Federdoc) (2024), https://www.federdoc.com/new/regioni/en/Latium.pdf; Italian Wine Central, the denominations (Italian Wine Central) (2026), https://italianwinecentral.com/

The pins, in drawing order (look each town up in GeoNames by the name given):

| # | lessonName | lessonParent | kind | look up | depth | lessonNote |
|---|---|---|---|---|---|---|
| 1 | Lazio |  | study location | Rome |  | The article's study location; no note. |
| 2 | Castelli Romani |  | lesson town | Velletri |  | The ring of hill towns on the rim of the old Alban volcano, around Lakes Albano and Nemi just south-east of Rome, on light, porous volcanic soil: Rome's own vineyard for centuries, with a regional Castelli Romani DOC beside the town DOCs. |
| 3 | Frascati | Castelli Romani | lesson town | Frascati |  | The town that names the Castelli's white, a DOC since 1966; Frascati Superiore and Cannellino di Frascati became DOCGs in 2011, the Cannellino zone taking in Frascati, Grottaferrata, Monte Porzio Catone and parts of Monte Compatri and Rome. |
| 4 | Marino | Castelli Romani | lesson town | Marino | asked from Premier Cru | A Castelli town above Lake Albano with a DOC of its own for Malvasia led whites. |
| 5 | Montefiascone and Lake Bolsena |  | lesson town | Montefiascone |  | A hill town on the rim of the Bolsena crater in the north, home of Est! Est!! Est!!! di Montefiascone, a Procanico led white named for a tale of a bishop's servant who marked the inns where the wine was good. |
| 6 | Gradoli | Montefiascone and Lake Bolsena | lesson town | Gradoli | asked from Grand Cru | A village above the north-western shore of Lake Bolsena whose DOC makes sweet red Aleatico, still or fortified. |
| 7 | Piglio |  | lesson town | Piglio |  | Hills in the province of Frosinone, south-east of Rome below the Ernici mountains, where Cesanese del Piglio, the red DOCG of 2008, grows on volcanic soil, red clay and limestone. |
| 8 | Olevano Romano and Affile | Piglio | lesson town | Olevano Romano | asked from Premier Cru | Hill towns north-west of Piglio with Cesanese DOCs of their own; Affile gives its name to the small berried Cesanese di Affile vine. |
| 9 | Orvieto in Lazio |  | lesson town | Castiglione in Teverina | asked from Premier Cru | The Orvieto DOC crosses from Umbria into the province of Viterbo; its Lazio side grows the same Grechetto and Procanico whites, taught under Umbria. |
| 10 | Agro Pontino |  | lesson town | Latina | asked from Grand Cru | The coastal plain south of Rome around Latina, reclaimed from marsh in the 1930s, a source of international reds and of revived Bellone near Anzio and Nettuno. |

Every place of the article, as the region page lists The districts (the pins above are chosen from these; the rest stay in the reading):

- Castelli Romani
  - Frascati
  - Marino (asked from Premier Cru)
- Montefiascone and Lake Bolsena
  - Gradoli (asked from Grand Cru)
- Piglio
  - Olevano Romano and Affile (asked from Premier Cru)
- Roma (asked from Premier Cru)
- Orvieto in Lazio (asked from Premier Cru)
- Agro Pontino (asked from Grand Cru)

### 9. Calabria and Basilicata (`calabria-basilicata`)

- `id` and `slug`: `calabria-basilicata`; `title`: Calabria and Basilicata; `type`: `region`; `countryKey` and `sheet`: `italy` (Italy)
- `bounds`: `[15.2, 37.85, 17.3, 41.2]`
- `summary`: Southern Italy: Basilicata's Vulture and Matera in the instep, and Calabria's toe between the Tyrrhenian and the Ionian.
- `water` (suggested): Ofanto, Agri, Basento, Crati, Savuto
- `grapes`: Aglianico, Gaglioppo, Magliocco, Greco Bianco, Greco Nero, Mantonico, Malvasia, Zinfandel
- `sources` with an address: Disciplinare di produzione della DOCG Aglianico del Vulture Superiore (DM 2 August 2010, modified 3 July 2014) (2014), https://aisitalia.it/Disciplinari/Basilicata/DOCG/Aglianico%20del%20Vulture%20Superiore.pdf; Camera di commercio della Basilicata, disciplinare della DOC Aglianico del Vulture (DPR 18 February 1971) (2026), https://www.basilicata.camcom.it/sites/default/files/contenuto_redazione/pagina_base/allegati/disciplinare_doc_aglianico_del_vulture_1.pdf; Italian Wine Central, Aglianico del Vulture Superiore DOCG (2026), https://italianwinecentral.com/denomination/aglianico-del-vulture-superiore-docg/; Disciplinare di produzione della DOC Cirò (2026), https://aisitalia.it/Disciplinari/Calabria/Ciro.pdf; Decanter, what is Cirò: a regional profile (2025), https://www.decanter.com/learn/what-is-ciro-a-regional-profile-532273/; Gambero Rosso, DOCG Cirò Classico (2025), https://www.gamberorosso.it/notizie/vino/docg-ciro-classico/; DoctorWine, Cirò now has its own DOCG, Cirò Classico (2025), https://www.doctorwine.wine/pot-pourri-en/wine-world-news/ciro-now-has-its-own-docg-ciro-classico/?lang=en

The pins, in drawing order (look each town up in GeoNames by the name given):

| # | lessonName | lessonParent | kind | look up | depth | lessonNote |
|---|---|---|---|---|---|---|
| 1 | Vulture |  | lesson town | Melfi |  | The extinct volcano in the north of Basilicata near Melfi, whose slopes of tuff and ash carry Aglianico del Vulture and its Superiore DOCG; a different region and a different ground from Campania's Taurasi. |
| 2 | Rionero in Vulture and Barile | Vulture | lesson town | Rionero in Vulture | asked from Premier Cru | Two towns high on the volcano's eastern slope, the heart of the zone, with old cellars cut into the soft tuff beneath their streets. |
| 3 | Venosa | Vulture | lesson town | Venosa | asked from Premier Cru | The Roman town on the lower, warmer north-eastern edge of the zone, the poet Horace's birthplace, whose Aglianico is riper and rounder. |
| 4 | Matera |  | lesson town | Matera | asked from Premier Cru | The province of the cave city of Matera in eastern Basilicata, towards the Ionian Sea, with a DOC for Primitivo, red blends, Greco and Malvasia whites and sparkling wine. |
| 5 | Terre dell'Alta Val d'Agri and Grottino di Roccanova |  | lesson town | Roccanova | asked from Grand Cru | Two small DOCs in the hills of southern Basilicata, for reds and rosés of local and international grapes, with a white of Malvasia at Grottino di Roccanova. |
| 6 | Cirò |  | lesson town | Cirò Marina |  | The Ionian coast of Crotone province, on clay, marl and sand: Gaglioppo reds and rosés and Greco Bianco whites under the Cirò DOC, Calabria's flagship name. |
| 7 | Melissa |  | lesson town | Melissa | asked from Premier Cru | Hills just south of Cirò in Crotone province, a DOC for Gaglioppo reds and Greco Bianco whites in Cirò's style. |
| 8 | Greco di Bianco |  | lesson town | Bianco |  | The town of Bianco and its neighbours on the Ionian coast near the toe of Calabria, home of the sweet wine of dried Greco Bianco grapes and of sweet Mantonico. |
| 9 | Savuto |  | lesson town | Rogliano | asked from Premier Cru | The valley of the Savuto river on the Tyrrhenian side, between the provinces of Cosenza and Catanzaro, where terraced hills give Gaglioppo reds and rosés with Magliocco and other local grapes. |
| 10 | Lamezia |  | lesson town | Lamezia Terme | asked from Premier Cru | The hills behind the Gulf of Sant'Eufemia on the Tyrrhenian coast, a DOC for Gaglioppo, Magliocco and Greco reds and whites. |
| 11 | Terre di Cosenza |  | lesson town | Cosenza | asked from Premier Cru | The province of Cosenza in northern Calabria, from the Pollino to the Crati valley, a broad DOC with named sub-zones such as Donnici and Pollino, where Magliocco leads many reds. |

Every place of the article, as the region page lists The districts (the pins above are chosen from these; the rest stay in the reading):

- Vulture
  - Rionero in Vulture and Barile (asked from Premier Cru)
  - Venosa (asked from Premier Cru)
- Matera (asked from Premier Cru)
- Terre dell'Alta Val d'Agri and Grottino di Roccanova (asked from Grand Cru)
- Cirò
  - Cirò Classico
- Melissa (asked from Premier Cru)
- Greco di Bianco
- Savuto (asked from Premier Cru)
- Lamezia (asked from Premier Cru)
- Terre di Cosenza (asked from Premier Cru)

### 10. Canary Islands (`canary-islands`)

- `id` and `slug`: `canary-islands`; `title`: Canary Islands; `type`: `region`; `countryKey` and `sheet`: `spain` (Spain)
- `bounds`: `[-18.3, 27.55, -13.3, 29.45]`
- `summary`: Spanish volcanic islands in the Atlantic off the coast of Morocco, from Lanzarote in the east to El Hierro in the west.
- `water` (suggested): Atlantic Ocean
- `grapes`: Listán Blanco, Listán Negro, Malvasía Volcánica, Malvasía Aromática, Negramoll, Marmajuelo, Baboso Negro, Muscat
- `sources` with an address: Consejo Regulador de la DOP Islas Canarias (Canary Wine), información institucional (2026), https://www.canarywine.com/descargas/transparencia/informacion_institucional.pdf; Ministerio de Agricultura, Pesca y Alimentación, certificate of registration of the DOP Islas Canarias (2026), https://www.mapa.gob.es/es/dam/jcr:b5c85d1b-4337-4f48-b2dc-78a183b90a5c/can_islascanarias_certificateofregistration-ao-1252_es.pdf; Consejo Regulador de la DO La Palma, pliego de condiciones (2015), https://www.vinoslapalma.com/ficheros/pliego-de-condiciones-mayo-2015.pdf; Consejo Regulador de la DO Valle de la Orotava, cultivation (2026), https://dovalleorotava.com/en/cultivation/; Ayuntamiento de La Orotava, cordón trenzado tradicional o cordón trenzado múltiple (2026), https://www.laorotava.es/sites/default/files/documentos/cordon_trenzado_tradicional_o_cordon_trenzado_multiple.pdf; Foods and Wines from Spain (ICEX), La Palma DO (2026), https://www.foodswinesfromspain.com/en/wine/regions/the-islands/la-palma-do; Decanter, Spain's exciting island wines: Canaries and Balearics (2026), https://www.decanter.com/premium/spains-exciting-island-wines-canaries-and-balearics-438851

The pins, in drawing order (look each town up in GeoNames by the name given):

| # | lessonName | lessonParent | kind | look up | depth | lessonNote |
|---|---|---|---|---|---|---|
| 1 | Lanzarote |  | lesson town | San Bartolomé |  | The eastern island of black volcanic fields, where each vine is planted in a pit dug through ash and sheltered by a crescent of stone, for dry and sweet Malvasía Volcánica, Listán Negro and Moscatel under the DO Lanzarote. |
| 2 | La Geria | Lanzarote | lesson town | Uga | asked from Grand Cru | The vine landscape at the island's centre, thousands of hoyos ringed by zocos in the picón of the eruptions of the 1730s, worked by hand and protected as a landscape. |
| 3 | Tacoronte-Acentejo | Tenerife | lesson town | Tacoronte | asked from Premier Cru | The wetter north-east of the island, chiefly Listán Negro reds, many of them young; granted in 1992, the first DO of the Canaries. |
| 4 | Valle de la Orotava | Tenerife | lesson town | La Orotava | asked from Premier Cru | The valley on the north coast below Teide, where the cordón trenzado braids long canes of Listán Blanco and Listán Negro into ropes held up on props. |
| 5 | Ycoden-Daute-Isora | Tenerife | lesson town | Icod de los Vinos | asked from Premier Cru | The north-west around Icod de los Vinos, with vineyards from the coast to high slopes and many old varieties among the Listán. |
| 6 | Valle de Güímar | Tenerife | lesson town | Güímar | asked from Premier Cru | The east-facing valley south of Santa Cruz, whose vineyards climb high on the slopes, chiefly for whites of Listán Blanco. |
| 7 | Abona | Tenerife | lesson town | Vilaflor | asked from Premier Cru | The dry south, with vineyards on pumice and ash that climb above 1,000 metres around Vilaflor; whites of Listán Blanco lead. |
| 8 | La Palma |  | lesson town | Fuencaliente de la Palma | asked from Premier Cru | The steep north-western island, a DO with three subzones, Fuencaliente, Hoyo de Mazo and the north: Fuencaliente's sweet Malvasía grows on the ash of the San Antonio eruption of 1677, and the north makes vino de tea. |
| 9 | El Hierro |  | lesson town | Valverde | asked from Grand Cru | The island at the western end of the chain, where Listán Blanco, Vijariego and Baboso Negro grow on terraces and volcanic slopes under the DO El Hierro. |
| 10 | La Gomera |  | lesson town | San Sebastián de la Gomera | asked from Grand Cru | A round, ravine-cut island beside Tenerife whose DO makes chiefly whites, many of them from the local Forastera Blanca. |
| 11 | Gran Canaria |  | lesson town | Santa Brígida | asked from Grand Cru | The round central island, with vineyards from the coast to the high interior and one DO for the whole island. |

Every place of the article, as the region page lists The districts (the pins above are chosen from these; the rest stay in the reading):

- Lanzarote
  - La Geria (asked from Grand Cru)
- Tenerife
  - Tacoronte-Acentejo (asked from Premier Cru)
  - Valle de la Orotava (asked from Premier Cru)
  - Ycoden-Daute-Isora (asked from Premier Cru)
  - Valle de Güímar (asked from Premier Cru)
  - Abona (asked from Premier Cru)
- La Palma (asked from Premier Cru)
- El Hierro (asked from Grand Cru)
- La Gomera (asked from Grand Cru)
- Gran Canaria (asked from Grand Cru)

### 11. Txakoli and the Basque Country (`txakoli`)

- `id` and `slug`: `txakoli`; `title`: Txakoli and the Basque Country; `type`: `region`; `countryKey` and `sheet`: `spain` (Spain)
- `bounds`: `[-3.5, 42.45, -1.2, 43.55]`
- `summary`: The Basque coast and valleys of northern Spain on the Bay of Biscay, from Bilbao to San Sebastián, with Álava inland.
- `water` (suggested): Nervión, Oria, Bay of Biscay
- `grapes`: Hondarrabi Zuri, Hondarrabi Beltza, Gros Manseng, Petit Manseng, Petit Courbu, Folle Blanche, Riesling
- `sources` with an address: Gobierno Vasco, Departamento de Alimentación, Desarrollo Rural, Agricultura y Pesca, DOP Getariako Txakolina (2026), https://www.euskadi.eus/web01-a2elikal/es/contenidos/informacion/dop_txakoli_getaria/es_dapa/index.shtml; Pliego de condiciones de la DOP Getariako Txakolina (Gobierno Vasco, 29 June 2011) (2011), https://euskadi.eus/contenidos/informacion/dop_txakoli_getaria/eu_dapa/adjuntos/PLIEGO-CR-GT_29-06-2011.pdf; Boletín Oficial del Estado, the regulation of the DO Getariako Txakolina with the order of 27 April 2007 (2 January 2010) (2010), https://boe.gob.es/boe/dias/2010/01/02/pdfs/BOE-A-2010-124.pdf; Pliego de condiciones de la DOP Bizkaiko Txakolina, consolidated text (Gobierno Vasco, 28 November 2024) (2024), https://www.euskadi.eus/contenidos/informacion/dop_txakoli_bizkaia/es_dapa/adjuntos/BIZKAIKO-TXAKOLINAren-pliegoak-20241128-consolidado.pdf; Documento único de la DOP Arabako Txakolina (Gobierno Vasco) (2026), https://www.euskadi.eus/contenidos/informacion/dop_txakoli_araba/es_dapa/adjuntos/documento_unico_txakolialava.pdf; Consejo Regulador de la DO Getariako Txakolina, designation of origin and press dossier (2026), https://www.getariakotxakolina.eus/en/designation-of-origin/; Foods and Wines from Spain (ICEX), Arabako Txakolina DO (2026), https://www.foodswinesfromspain.com/en/wine/regions/green-spain/chacoli-de-alava-arabako-txakolina-txakoli-de-alava-do; Decanter, a fresh look at txakoli (2026), https://www.decanter.com/magazine/a-fresh-look-at-txakoli-466446/

The pins, in drawing order (look each town up in GeoNames by the name given):

| # | lessonName | lessonParent | kind | look up | depth | lessonNote |
|---|---|---|---|---|---|---|
| 1 | Txakoli and the Basque Country |  | study location | Zumaia |  | The article's study location; no note. |
| 2 | Getaria |  | lesson town | Getaria |  | The fishing town on the Gipuzkoa coast west of San Sebastián that names the first txakoli DO; its vineyards climb the slopes above the town and the sea. |
| 3 | Zarautz | Getaria | lesson town | Zarautz | asked from Premier Cru | The beach town beside Getaria, one of the three communes of the DO in 1989, with vineyards on the hills behind it. |
| 4 | Aia | Getaria | lesson town | Aia | asked from Premier Cru | The hill commune inland of Getaria and Zarautz, the third of the original communes, with vineyards set back from the sea. |
| 5 | Bizkaia |  | lesson town | Bilbao |  | The province of Bilbao, whose DO, Bizkaiko Txakolina, gathers vineyards scattered across the province, on the coast and in the valleys inland. |
| 6 | Bakio | Bizkaia | lesson town | Bakio | asked from Premier Cru | A coastal town north of Bilbao, a historic centre of Bizkaia's txakoli, with vineyards on slopes facing the sea. |
| 7 | Ayala valley |  | lesson town | Amurrio |  | The valley of the Nervión in northern Álava, around Amurrio, Llodio, Okondo, Artziniega and Ayala itself, sheltered by the Sierra Salvada but on the Atlantic side: the zone of Arabako Txakolina, with riper, less salty wines. |
| 8 | Rioja Alavesa |  | lesson town | Laguardia |  | The south of Álava, beyond the Sierra de Cantabria, belongs to the Rioja DOCa; its own article, Rioja, holds it. |
| 9 | Irouléguy |  | lesson town | Saint-Étienne-de-Baïgorry | asked from Premier Cru | The wine of the French Basque Country, across the Pyrenees; its own article, South West France, holds it. |

Every place of the article, as the region page lists The districts (the pins above are chosen from these; the rest stay in the reading):

- Getaria
  - Zarautz (asked from Premier Cru)
  - Aia (asked from Premier Cru)
- Bizkaia
  - Bakio (asked from Premier Cru)
- Ayala valley
- Rioja Alavesa
- Irouléguy (asked from Premier Cru)

### 12. Ribeiro, Ribeira Sacra and Valdeorras (`ribeiro-ribeira-sacra`)

- `id` and `slug`: `ribeiro-ribeira-sacra`; `title`: Ribeiro, Ribeira Sacra and Valdeorras; `type`: `region`; `countryKey` and `sheet`: `spain` (Spain)
- `bounds`: `[-8.4, 41.8, -6.4, 42.75]`
- `summary`: Inland Galicia in Ourense and Lugo, along the Miño and the Sil, with Monterrei on the Portuguese border and Bierzo upstream.
- `water` (suggested): Miño, Sil, Avia, Arnoia, Bibei, Támega
- `grapes`: Treixadura, Godello, Mencía, Albariño, Loureira, Torrontés (Galicia), Merenzao, Brancellao, Sousón, Doña Blanca, Garnacha Tintorera, Palomino
- `sources` with an address: Axencia Galega da Calidade Alimentaria (Xunta de Galicia), ficha técnica DO Ribeira Sacra 2025 (2025), https://agacal.xunta.gal/sites/default/files/Ficha%20t%C3%A9cnica%20DO%20Ribeira%20Sacra%202025.pdf; Consello Regulador DO Ribeira Sacra, pliego de condiciones (18 February 2025) (2025), https://ribeirasacra.org/media/documentos/25%2002%2018%20Pliego%20de%20Condiciones.pdf; Axencia Galega da Calidade Alimentaria (Xunta de Galicia), pliego de condiciones de la DOP Ribeiro (April 2025) (2025), https://agacal.xunta.gal/sites/default/files/calidade-alimentaria/vinos/Pliego_Condiciones_DOP_Ribeiro_abril_2025_ES.pdf; Axencia Galega da Calidade Alimentaria (Xunta de Galicia), ficha técnica DO Ribeiro 2025 (2025), https://agacal.xunta.gal/sites/default/files/Ficha%20t%C3%A9cnica%20DO%20Ribeiro%202025.pdf; Axencia Galega da Calidade Alimentaria (Xunta de Galicia), ficha técnica DO Valdeorras 2025 (2025), https://agacal.xunta.gal/sites/default/files/Ficha%20t%C3%A9cnica%20DO%20Valdeorras%202025.pdf; Axencia Galega da Calidade Alimentaria (Xunta de Galicia), documento único da DOP Monterrei (July 2025) (2025), https://agacal.xunta.gal/sites/default/files/calidade-alimentaria/vinos/Documento-unico-Monterrei-xullo-2025_GAL.pdf; Interprofesional del Vino de España, Zona Atlántica DO (2023), https://interprofesionaldelvino.es/wp-content/uploads/2023/11/Zona-Atlantica-DO.pdf; Foods and Wines from Spain (ICEX), Ribeira Sacra: the heroic wine region (2020), https://www.foodswinesfromspain.com/en/wine/articles/2020/may/ribeira-sacra-the-heroic-wine-region

The pins, in drawing order (look each town up in GeoNames by the name given):

| # | lessonName | lessonParent | kind | look up | depth | lessonNote |
|---|---|---|---|---|---|---|
| 1 | Ribeiro, Ribeira Sacra and Valdeorras |  | study location | Ourense |  | The article's study location; no note. |
| 2 | Ribeiro |  | lesson town | Leiro |  | The valleys of the Miño, Avia and Arnoia around Ribadavia in Ourense province, Galicia's historic export white: Treixadura-led blends, reds of native grapes and the sweet Tostado. |
| 3 | Ribadavia | Ribeiro | lesson town | Ribadavia | asked from Premier Cru | The old town where the Avia meets the Miño, with its medieval quarter, long the trading heart of Ribeiro's wine, which was shipped to England and northern Europe in the late Middle Ages. |
| 4 | Ribeira Sacra |  | lesson town | Monforte de Lemos |  | The canyons of the Sil and the Miño in Lugo and Ourense provinces, terraced by hand and named for the monasteries along the rivers; Mencía reds, Godello and Albariño whites. |
| 5 | Amandi | Ribeira Sacra | lesson town | Sober | asked from Premier Cru | On the Sil's north bank in Lugo province, south-facing terraces of slate that give ripe, deep Mencía; a name often seen on labels. |
| 6 | Chantada | Ribeira Sacra | lesson town | Chantada | asked from Premier Cru | The Miño around the town of Chantada, on granite, with gentler and cooler slopes than the Sil's. |
| 7 | Quiroga-Bibei | Ribeira Sacra | lesson town | Quiroga | asked from Premier Cru | The eastern subzone, on the Sil and its tributary the Bibei towards Valdeorras, warmer and drier than the rest. |
| 8 | Ribeiras do Sil | Ribeira Sacra | lesson town | Parada de Sil | asked from Premier Cru | The Sil's southern bank in Ourense province, across the canyon from Amandi, with cooler, mostly north-facing terraces. |
| 9 | Valdeorras |  | lesson town | A Rúa |  | The Sil valley in eastern Ourense around O Barco and A Rúa, beside Bierzo, on slate, granite and river terraces: the home of Godello, with Mencía reds. |
| 10 | O Barco de Valdeorras | Valdeorras | lesson town | O Barco de Valdeorras | asked from Premier Cru | The main town of the valley, on the Sil near the border with Bierzo. |
| 11 | Verín | Monterrei | lesson town | Verín | asked from Premier Cru | The town at the heart of the valley, below the castle of Monterrei that gives the DO its name. |
| 12 | Bierzo |  | lesson town | Ponferrada |  | Upstream on the Sil in Castilla y León, sharing Mencía, Godello and slate; its own article, Bierzo, holds it. |

Every place of the article, as the region page lists The districts (the pins above are chosen from these; the rest stay in the reading):

- Ribeiro
  - Ribadavia (asked from Premier Cru)
- Ribeira Sacra
  - Amandi (asked from Premier Cru)
  - Chantada (asked from Premier Cru)
  - Quiroga-Bibei (asked from Premier Cru)
  - Ribeiras do Miño (asked from Premier Cru)
  - Ribeiras do Sil (asked from Premier Cru)
- Valdeorras
  - O Barco de Valdeorras (asked from Premier Cru)
- Monterrei
  - Verín (asked from Premier Cru)
- Bierzo

### 13. Mittelrhein (`mittelrhein`)

- `id` and `slug`: `mittelrhein`; `title`: Mittelrhein; `type`: `region`; `countryKey` and `sheet`: `germany` (Germany)
- `bounds`: `[7.05, 49.9, 8, 50.75]`
- `summary`: The Rhine gorge between Bingen and Koblenz, running on north to the Seven Mountains across from Bonn.
- `water` (suggested): Rhine, Nahe, Lahn, Moselle
- `grapes`: Riesling, Pinot Noir, Müller-Thurgau, Kerner, Pinot Blanc, Pinot Gris / Grigio
- `sources` with an address: Deutsches Weininstitut, Wines of Germany: the Mittelrhein growing area (2026), https://www.winesofgermany.com/our-regions/growing-area/71/mittelrhein/; VDP. Die Prädikatsweingüter, vineyard online: Im Hahn, Bacharach, VDP.Grosse Lage (2026), https://www.vdp.de/en/the-wines/vineyardonline/lage/3070-im-hahn; Mittelrhein-Wein, the regional wine body: the Bacharacher Wolfshöhle site (2026), https://www.mittelrhein-wein.com/en/a-weinbergslage-bacharacher-wolfshoehle; UNESCO World Heritage Centre, Upper Middle Rhine Valley (inscribed 29 June 2002) (2026), https://whc.unesco.org/en/list/1066; wein.plus glossary (wein.plus): Loreley and Siebengebirge (2026), https://glossary.wein.plus/loreley

The pins, in drawing order (look each town up in GeoNames by the name given):

| # | lessonName | lessonParent | kind | look up | depth | lessonNote |
|---|---|---|---|---|---|---|
| 1 | Mittelrhein |  | study location | Sankt Goar |  | The article's study location; no note. |
| 2 | Bacharach | Bereich Loreley | lesson town | Bacharach |  | A walled medieval town on the left bank under Stahleck castle, the wine town of the southern gorge, with steep slate vineyards on the Rhine and behind the town. |
| 3 | Steeg | Bereich Loreley | lesson town | Steeg | asked from Premier Cru | A village in a side valley running west from Bacharach, known for the St. Jost, a steep slate site sheltered from the river's winds. |
| 4 | Oberwesel | Bereich Loreley | lesson town | Oberwesel | asked from Premier Cru | A walled town of towers on the left bank, upstream of the Lorelei: the Oelsberg above the Rhine, and the Engehöll, a side valley of slate. |
| 5 | Kaub | Bereich Loreley | lesson town | Kaub | asked from Premier Cru | A right-bank village facing the toll castle of Pfalzgrafenstein, which stands on its island in the river; steep slate slopes face the Rhine. |
| 6 | Loreley | Bereich Loreley | lesson town | Sankt Goarshausen |  | The slate cliff on the right bank at St. Goarshausen, some 130 metres above the river where the Rhine narrows and bends hard; the heart of the gorge and of its Romantic legend, with vineyards at St. Goar and St. Goarshausen. |
| 7 | Boppard | Bereich Loreley | lesson town | Boppard |  | A Roman town on the left bank where the Rhine swings round a great loop; the steep slate wall on its outer side, the Bopparder Hamm, is a long run of vineyard turned to the sun. |
| 8 | Leutesdorf and Hammerstein | Bereich Loreley | lesson town | Leutesdorf | asked from Premier Cru | Right-bank villages below Koblenz and the Neuwied basin, where the valley narrows again; slate and greywacke slopes face south-west over the river. |
| 9 | Bereich Siebengebirge |  | lesson town | Königswinter |  | The northern tip of the region around Königswinter, across the Rhine from Bonn and in North Rhine-Westphalia: a few slopes on the weathered volcanic rock of the Seven Mountains, under the Grosslage name Petersberg. |

Every place of the article, as the region page lists The districts (the pins above are chosen from these; the rest stay in the reading):

- Bereich Loreley
  - Bacharach
    - Hahn (asked from Premier Cru)
    - Wolfshöhle (asked from Premier Cru)
    - Heylesen Werth (asked from Grand Cru)
  - Steeg (asked from Premier Cru)
  - Oberwesel (asked from Premier Cru)
  - Kaub (asked from Premier Cru)
  - Loreley
  - Boppard
    - Bopparder Hamm (asked from Premier Cru)
  - Leutesdorf and Hammerstein (asked from Premier Cru)
- Bereich Siebengebirge
  - Drachenfels (asked from Grand Cru)

### 14. Virginia (`virginia`)

- `id` and `slug`: `virginia`; `title`: Virginia; `type`: `region`; `countryKey` and `sheet`: `new-york` (the United States (the New York sheet, the East))
- `bounds`: `[-83.7, 36.5, -75.2, 39.5]`
- `summary`: The Mid-Atlantic United States south of Washington, from the Chesapeake Bay west across the Piedmont to the Blue Ridge and the Shenandoah Valley.
- `water` (suggested): Potomac, Rappahannock, York, James, Shenandoah, Chesapeake Bay
- `grapes`: Viognier, Cabernet Franc, Petit Manseng, Petit Verdot, Chardonnay, Merlot, Norton, Albariño, Vidal Blanc
- `sources` with an address: Alcohol and Tobacco Tax and Trade Bureau, Establishment of the Middleburg Virginia Viticultural Area (Federal Register, 13 September 2012) (2012), https://www.govinfo.gov/content/pkg/FR-2012-09-13/html/2012-22596.htm; Alcohol and Tobacco Tax and Trade Bureau, Establishment of the Virginia Peninsula Viticultural Area (Federal Register, 25 August 2021) (2021), https://regulations.justia.com/regulations/fedreg/2021/08/25/2021-18209.html; Code of Federal Regulations, title 27, parts 4 and 9: labelling and the American Viticultural Areas (2026), https://www.law.cornell.edu/cfr/text/27/9.279; Laws enacted by the First General Assembly of Virginia, 1619 (Online Library of Liberty, Liberty Fund) (2026), https://oll.libertyfund.org/pages/1619-laws-enacted-by-the-first-general-assembly-of-virginia; Virginia Vineyards Association, Viognier: Virginia's signature grape (2026), https://virginiavineyardsassociation.org/viognier-virginias-signature-grape/; WineAmerica, State profile: Virginia wine country (2026), https://wineamerica.org/news/state-profile-virginia-wine-country/

The pins, in drawing order (look each town up in GeoNames by the name given):

| # | lessonName | lessonParent | kind | look up | depth | lessonNote |
|---|---|---|---|---|---|---|
| 1 | Virginia |  | study location | Richmond |  | The article's study location; no note. |
| 2 | Monticello |  | lesson town | Charlottesville |  | The AVA of the Piedmont and the eastern Blue Ridge foothills around Charlottesville, named for Jefferson's hilltop house: the historic heart of Virginia wine, where Filippo Mazzei planted for Jefferson in the 1770s and where Viognier, Cabernet Franc and Petit Manseng do well today. |
| 3 | Northern Virginia |  | lesson town | Leesburg |  | Loudoun and Fauquier counties west of Washington, in the foothills of the Blue Ridge and the Bull Run Mountains: a large cluster of estates within reach of the capital, known for Bordeaux blends, Cabernet Franc and Petit Manseng. |
| 4 | Middleburg Virginia | Northern Virginia | lesson town | Middleburg | asked from Premier Cru | The AVA of 2012 around the horse country town of Middleburg in Loudoun and Fauquier counties, petitioned by Boxwood Winery: rolling hills of weathered rock, Bordeaux grapes and Cabernet Franc. |
| 5 | Shenandoah Valley |  | lesson town | Harrisonburg |  | The limestone valley between the Blue Ridge and the Alleghenies, an AVA shared with West Virginia, sheltered and drier than the Piedmont with colder winters. In the early 1980s it kept the bare name, so California's AVA in Amador County became California Shenandoah Valley. |
| 6 | Virginia Peninsula | The Coastal Plain | lesson town | Williamsburg | asked from Premier Cru | The AVA of 2021 between the James and the York rivers around Williamsburg, petitioned by the Williamsburg Winery; sandy soils and a long, warm season. |
| 7 | Northern Neck George Washington Birthplace | The Coastal Plain | lesson town | Montross | asked from Grand Cru | One AVA, not two: the peninsula between the Potomac and the Rappahannock, named for Washington's birthplace in Westmoreland County. |
| 8 | Virginia's Eastern Shore | The Coastal Plain | lesson town | Onancock | asked from Grand Cru | The Virginia tip of the Delmarva Peninsula between the Chesapeake Bay and the Atlantic, a flat, sandy, sea-tempered AVA. |
| 9 | Rocky Knob | The south-west | lesson town | Floyd | asked from Grand Cru | A small AVA on the Blue Ridge plateau in Floyd and Patrick counties, at altitude, with cool nights. |
| 10 | North Fork of Roanoke | The south-west | lesson town | Blacksburg | asked from Grand Cru | The valley of the Roanoke River's north fork in Montgomery and Roanoke counties, a small AVA between the ridges. |
| 11 | Appalachian High Country | The south-west | lesson town | Independence | asked from Grand Cru | A mountain AVA shared with North Carolina and Tennessee, cold in winter, for hardy hybrids and a few vinifera. |

Every place of the article, as the region page lists The districts (the pins above are chosen from these; the rest stay in the reading):

- Monticello
- Northern Virginia
  - Middleburg Virginia (asked from Premier Cru)
- Shenandoah Valley
- The Coastal Plain
  - Virginia Peninsula (asked from Premier Cru)
  - Northern Neck George Washington Birthplace (asked from Grand Cru)
  - Virginia's Eastern Shore (asked from Grand Cru)
- The south-west
  - Rocky Knob (asked from Grand Cru)
  - North Fork of Roanoke (asked from Grand Cru)
  - Appalachian High Country (asked from Grand Cru)

## Hand back

For each map: the record as JSON in the shape above (without `bytes` and `sha256`, which the build measures) and the SVG file named `<slug>.svg`. Keep every `lessonName` exactly as written here, the coordinates as GeoNames gives them, and every string in the house voice.
