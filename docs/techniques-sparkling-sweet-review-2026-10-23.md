# Sparkling, sweet, fortified and contact-method review

Checked: 23 October 2026.

Scope: techniques roster positions 0 through 14 in `.scripts/regions/fragments/techniques.1.json`. This document records the evidence and editorial limits for these 15 original lessons. It is a source review, not a new restaurant wine list, cellar recipe or legal opinion.

## Delivery and validation

- 15 exact roster slugs, names and groups.
- 120 flashcards and 120 multiple-choice questions. Every record has six base, one advanced and one master entry in each bank.
- 60 deeper paragraphs, four per record, across at least three sections with both advanced and master coverage.
- 45 source associations, with at least two authority sources in each record. Producer and technical sources are distinguished from regulatory sources.
- Counted lesson prose ranges from 657 to 703 words per record, excluding flashcards, questions and source metadata.
- Question IDs are absent by design; the canonical builder creates them. No existing regional question positions or IDs were changed by this author.
- A further distractor review revised 97 of the 120 questions, replacing unrelated alternatives with plausible wine-process, regional or label misunderstandings. An invariant check confirmed that question stems, correct answer text and index, explanations, depth and every flashcard remained unchanged. The content checker also verifies that the correct option is not conspicuously longer than the alternatives.
- `node .scripts/regions/check-fragment.cjs .scripts/regions/fragments/techniques.1.json` passes without weakening the checker.
- Generated data, runtime integration and release checks belong to the coordinating task and were not built or edited as part of this scoped authoring pass.

The extra tasting and tableside scenarios are original teaching applications. Their food comparisons are explicitly suggestions to test with the actual bottle and dish, not claims about a verified Brennan's pairing or current inventory. Generic methods are separated from regional law. Publication or amendment dates are distinguished from the date a page was checked.

## Source review by lesson

### 1. Traditional method

Verified bottle second fermentation, the separate tirage and dosage stages, riddling, disgorgement and lees maturation. The BIVB source independently supports the Crémant de Bourgogne example. Do not infer exact lees duration from toast aromas. Champagne's release requirements were not exported to other appellations.

- [Bottling and second fermentation (Comité Champagne)](https://www.champagne.fr/en/about-champagne/how-champagne-is-made/bottling-and-second-fermentation) (regulator, intergovernmental body or regional wine authority).
- [Maturation on lees (Comité Champagne)](https://www.champagne.fr/en/about-champagne/how-champagne-is-made/maturation) (regulator, intergovernmental body or regional wine authority).
- [Dosage (Comité Champagne)](https://www.champagne.fr/en/about-champagne/how-champagne-is-made/dosage) (regulator, intergovernmental body or regional wine authority).
- [Disgorgement (Comité Champagne)](https://www.champagne.fr/en/about-champagne/how-champagne-is-made/disgorgement) (regulator, intergovernmental body or regional wine authority).
- [BIVB: Crémant de Bourgogne production](https://www.bourgogne-wines.com/wine-and-terroir/our-natural-assets/vinification-and-ageing/making-cremant-de-bourgogne-wines/making-cremant-de-bourgogne-wines-giving-that-extra-sparkle%2C2487%2C9272.html) (regulator, intergovernmental body or regional wine authority).

### 2. Tank method (Charmat)

Verified Prosecco's pressure-tank fermentation and bottling context, with the Extra Dry versus Brut distinction in the consortium's technical sheet. The official Asti press kit's indexed text supports partial fermentation of must as the contrast; direct PDF retrieval and the newer Moscato product page returned access restrictions. This limitation is retained here rather than claiming a full PDF inspection. The two Prosecco sources were opened. The lesson does not use numerical Asti thresholds or present a tank vessel as proof of two fermentations.

- [Prosecco technical sommelier sheet (Consorzio Prosecco DOC)](https://www.prosecco.wine/wp-content/uploads/2024/02/Scheda-Sommelier-Tecnici_EN_oro_compressed.pdf) (regulator, intergovernmental body or regional wine authority).
- [Prosecco production and method (Consorzio Prosecco DOC)](https://www.prosecco.wine/prosecco/) (regulator, intergovernmental body or regional wine authority).
- [Asti and Moscato d'Asti press kit (Consorzio Asti DOCG)](https://www.astidocg.it/wp-content/uploads/2022/02/PRESS-KIT_2021eng.pdf) (regulator, intergovernmental body or regional wine authority).

### 3. Ancestral method

Opened the Limoux syndicate method page, the INAO Cerdon product PDF and the named Cerdon producer's process description. Verified the first fermentation continuing in bottle, Limoux's Mauzac example and Cerdon's rosé identity. The original INAO general Bugey web route was restricted, so the lesson uses the successfully opened printable Cerdon PDF. Lunar language and broad claims about entirely natural production were not adopted. The producer source is not flagged as a regulatory primary source.

- [Limoux méthode ancestrale (Syndicat des vins AOC de Limoux)](https://www.limoux-aoc.com/en/aoc-limoux-methode-ancestrale) (regulator, intergovernmental body or regional wine authority).
- [INAO: Bugey Cerdon méthode ancestrale product sheet](https://www.inao.gouv.fr/node/32233/printable/pdf) (regulator, intergovernmental body or regional wine authority).
- [Méthode ancestrale production (Cave Girardi Dupoyet)](https://www.cerdon-dupoyet.fr/cerdon-methode-ancestrale/) (supporting first-hand or technical source; no regulatory primary flag).

### 4. Noble rot (botrytis)

Opened the Sauternes-Barsac and German Wine Institute pages. Verified favourable humidity and drying conditions, selective harvesting and concentration through berry changes. German Prädikat requirements are not treated as a worldwide sweetness ladder. The text separates beneficial botrytis from destructive grey rot and does not identify noble rot from honey aroma alone.

- [Wines and selective harvest (Sauternes Barsac appellation body)](https://www.sauternes-barsac.com/les-vins/) (regulator, intergovernmental body or regional wine authority).
- [Noble sweet specialities (Deutsches Weininstitut)](https://www.deutscheweine.de/wein-probieren/192/edels%C3%BC%C3%9Fe-spezialit%C3%A4ten) (regulator, intergovernmental body or regional wine authority).
- [Prädikate (Deutsches Weininstitut)](https://www.deutscheweine.de/qualitaetstandard/449/pr%C3%A4dikate) (regulator, intergovernmental body or regional wine authority).

### 5. Ice wine and Eiswein

Opened the Canadian national standard, BC Wine Authority Icewine guidance and German Prädikat guidance. Verified natural freezing on the vine and frozen pressing. The minus 8°C BC and minus 7°C German criteria are attributed to those jurisdictions, not a universal threshold. No national Canadian numerical harvest temperature is invented. Cryo-extraction is not presented as interchangeable with protected naturally frozen Icewine or Eiswein.

- [Canadian Standards of Identity, Volume 8 (CFIA)](https://inspection.canada.ca/en/about-cfia/acts-and-regulations/list-acts-and-regulations/documents-incorporated-reference/canadian-standards-identity-volume-8) (regulator, intergovernmental body or regional wine authority).
- [Icewine requirements (BC Wine Authority)](https://bcvqa.ca/information/icewine/) (regulator, intergovernmental body or regional wine authority).
- [Prädikate and Eiswein (Deutsches Weininstitut)](https://www.deutscheweine.de/qualitaetstandard/449/pr%C3%A4dikate) (regulator, intergovernmental body or regional wine authority).

### 6. Dried grapes (appassimento and passito)

Opened the Valpolicella consortium overview and the hosted Amarone and Ripasso specifications. Verified water loss before fermentation and the dry-versus-sweet contrast between Amarone and Recioto. Opened Borgo Scopeto's Vin Santo producer PDF to support the Tuscan example. That source is first-hand production evidence only, not a legal primary flag; its name-origin legend and bottle-specific durations were not adopted. The Amarone document includes amendments through 2019 and the Ripasso document through 2023, so the lesson avoids presenting old numerical thresholds as newly checked 2026 law.

- [Valpolicella wine types (Consorzio Tutela Vini Valpolicella)](https://landing.consorziovalpolicella.it/?Itemid=43&id=143&lang=it&option=com_content&task=view) (regulator, intergovernmental body or regional wine authority).
- [Amarone specification (Italian ministry, hosted by the Consorzio)](https://consorziovalpolicella.it/wp-content/uploads/2020/11/Disciplinare-Amarone-della-Valpolicella-DOCG.pdf) (regulator, intergovernmental body or regional wine authority).
- [Valpolicella Ripasso specification, 2023 amendment (Italian ministry)](https://www.consorziovalpolicella.it/wp-content/uploads/2024/02/DisciplinareValpolicella-Ripasso.pdf) (regulator, intergovernmental body or regional wine authority).
- [Borgo Scopeto: Vin Santo del Chianti Classico producer sheet](https://borgoscopeto.it/schedeVini/BORGO%20SCOPETO%20VIN%20SANTO%20DOC.pdf) (supporting first-hand or technical source; no regulatory primary flag).

### 7. Ripasso

Opened the consortium overview and the Ripasso specification hosted in 2024 with 2023 amendment history. Verified the Valpolicella base wine, contact with Amarone or Recioto pomace and renewed fermentation. The lesson does not describe Ripasso as simply soaking whole raisins, automatically sweet, or carrying Amarone's DOCG. Classico remains a geographical indication. No unsupported operational ratio or release threshold was introduced.

- [Consorzio Valpolicella: Valpolicella Ripasso production specification](https://www.consorziovalpolicella.it/wp-content/uploads/2024/02/DisciplinareValpolicella-Ripasso.pdf) (regulator, intergovernmental body or regional wine authority).
- [Consorzio Valpolicella: the wines and their production](https://landing.consorziovalpolicella.it/?Itemid=43&id=143&lang=it&option=com_content&task=view) (regulator, intergovernmental body or regional wine authority).

### 8. Late harvest

Opened German Wine Institute Prädikat guidance and the Alsace Vendanges Tardives page. Verified the distinction between harvest ripeness and retained sugar. German Spätlese is not equated with a mandatory sweet style. Alsace's page supports the regional concentrated-wine example but is not used to invent a worldwide sweetness threshold. The law field intentionally directs detailed regional conditions back to the applicable specification.

- [Deutsches Weininstitut: Prädikate and their requirements](https://www.deutscheweine.de/qualitaetstandard/449/pr%C3%A4dikate) (regulator, intergovernmental body or regional wine authority).
- [Vins d'Alsace: Vendanges Tardives](https://www.vinsalsace.com/en/gouts-et-couleurs/cepages/fra/vendanges-tardives/) (regulator, intergovernmental body or regional wine authority).

### 9. Fortification and Port

Opened the IVDP winemaking, category and glossary pages. Verified fermentation interruption, retained grape sugar, red-wine extraction and distinct ageing categories. No claim that all fortified wines are sweet was adopted. The IVDP category page contains a broad statement suggesting only Vintage Port ages in bottle, despite its own Crusted and LBV discussion; that simplification was rejected. The lesson uses category-specific handling and avoids a fixed decanting rule for all Port. A tawny age indication is not presented as an exact chronological age of every component.

- [IVDP: Port winemaking](https://ivdp.pt/en/wines/port-wines/the-winemaking/) (regulator, intergovernmental body or regional wine authority).
- [IVDP: Port special categories](https://www.ivdp.pt/en/wines/port-wines/special-categories/) (regulator, intergovernmental body or regional wine authority).
- [IVDP: wine glossary](https://ivdp.pt/en/wines/glossary/) (regulator, intergovernmental body or regional wine authority).

### 10. Flor and the solera

Opened the Consejo Regulador ageing page and the consolidated Jerez specification under the Order of 13 May 2026. The specification is authoritative for current rules; the older educational page supports biological mechanisms but cannot override it. See the explicit 2026 reconciliation below. Flor is kept separate from fractional blending, and the solera founding date is not taught as the age of every drop.

- [Consejo Regulador: Jerez specification consolidated under the Order of 13 May 2026](https://www.sherry.wine/documents/597/21052026_Pliego_Jerez_1wBQg8y.pdf) (regulator, intergovernmental body or regional wine authority).
- [Consejo Regulador: biological, oxidative and solera ageing](https://www.sherry.wine/sherry-wine/production/ageing) (regulator, intergovernmental body or regional wine authority).

### 11. Madeira: estufagem and canteiro

Opened IVBAM's vinification, categories, PDO and institute pages. Verified the distinction between controlled heating and warm-cask maturation, and the separation of sweetness from heating pathway. The institute confirms Madeira and Porto Santo as the demarcated origin. An erroneous English caption on the method page describes canteiro as bottle storage; its substantive text clearly describes casks, which the lesson follows. No numerical time or temperature rule from that translated page was inserted as a universal recipe.

- [IVBAM: vinification, estufagem and canteiro](https://vinhomadeira.com/o-vinho-madeira/vinificacao-e-envelhecimento) (regulator, intergovernmental body or regional wine authority).
- [IVBAM: Madeira wine categories](https://vinhomadeira.com/o-vinho-madeira/tipos-categorias) (regulator, intergovernmental body or regional wine authority).
- [IVBAM: Madeira protected designation](https://vinhomadeira.com/o-vinho-madeira/dop) (regulator, intergovernmental body or regional wine authority).
- [IVBAM: Madeira demarcated region](https://ivbam.madeira.gov.pt/) (regulator, intergovernmental body or regional wine authority).

### 12. Vin doux naturel

Opened the CIVR French method page and its English wine-family and VDN-style pages. Verified mutage with neutral grape alcohol during fermentation, retained grape sugar, fruit-preserving versus oxidative handling, and the distinction between Maury Doux and dry Maury. Inconsistent production-share percentages on the pages were ignored. Medieval discovery stories were not imported. Naturel is not misrepresented as unfortified or as an organic certificate.

- [CIVR: mutage and maturation pathways](https://www.roussillon.wine/vins-et-terroirs/nos-singularites/) (regulator, intergovernmental body or regional wine authority).
- [Wines of Roussillon: VDN appellations and styles](https://uk.winesofroussillon.com/vins-doux-naturels/) (regulator, intergovernmental body or regional wine authority).
- [Wines of Roussillon: dry and fortified wine families](https://uk.winesofroussillon.com/our-wines/) (regulator, intergovernmental body or regional wine authority).

### 13. Skin contact and orange wine

Opened OIV-ECO 647-2020 and Georgia's National Wine Agency regional method page. Verified white-grape pomace contact, possible amber colour and tannic texture, and the importance of regional Georgian variation. The one-month minimum is expressly scoped to the OIV technical category, not treated as binding law for every orange-labelled bottle worldwide. No assumption that all qvevri wines are orange, all amber wine is oxidised, or orange means sulphur-free was adopted.

- [OIV: Resolution OIV-ECO 647-2020, white wine with maceration](https://www.oiv.int/node/2760/download/pdf) (regulator, intergovernmental body or regional wine authority).
- [National Wine Agency of Georgia: regional winemaking methods](https://wine.gov.ge/En/WineMakingRegions) (regulator, intergovernmental body or regional wine authority).

### 14. Making rosé

Opened Vins de Provence production guidance and the Comité Champagne rosé and second-fermentation pages. Verified direct pressing and short maceration, plus Champagne's red-and-white base-wine blending route. Provence's simplified statement that rosé is not a blend is kept within its regional context, not exported into a universal prohibition. Exact maceration durations in promotional examples are not taught as universal definitions. Colour, sweetness and bubble formation remain separate questions.

- [Vins de Provence: rosé production routes](https://www.vinsdeprovence.com/en/le-rose/l-elaboration-du-rose) (regulator, intergovernmental body or regional wine authority).
- [Comité Champagne: Champagne rosé](https://www.champagne.fr/fr/deguster-le-champagne/types-de-Champagne/champagne-rose) (regulator, intergovernmental body or regional wine authority).
- [Comité Champagne: bottling and second fermentation](https://www.champagne.fr/en/about-champagne/how-champagne-is-made/bottling-and-second-fermentation) (regulator, intergovernmental body or regional wine authority).

### 15. Carbonic maceration

Opened the OIV process definition, Inter Beaujolais method article and AWRI technical resource. Verified intact-berry processes, overlapping yeast fermentation in released juice, completion after the berry phase and multiple possible carbon-dioxide sources. The AWRI resource is technical supporting evidence, not flagged as an appellation or legal primary. The regional article's overly absolute statements about semi-carbonic uniqueness and never adding gas are not adopted; commercial methods vary. Aroma alone is not treated as proof of the process.

- [OIV: carbonic maceration definition and process](https://www.oiv.int/standards/international-code-of-oenological-practices/part-ii-oenological-treatments-and-practices/grapes/carbonic-maceration) (regulator, intergovernmental body or regional wine authority).
- [Inter Beaujolais: regional vinification](https://www.beaujolais.com/en/2020/09/22/beaujolais-vinification-a-process-like-no-other/) (regulator, intergovernmental body or regional wine authority).
- [Australian Wine Research Institute: carbonic maceration technical resource](https://www.awri.com.au/industry_support/winemaking_resources/winemaking-practices/winemaking-treatment-carbonic-maceration/) (supporting first-hand or technical source; no regulatory primary flag).

## Current Jerez reconciliation

The [consolidated Jerez specification](https://www.sherry.wine/documents/597/21052026_Pliego_Jerez_1wBQg8y.pdf) identifies the Order of 13 May 2026 and publication on 20 May 2026 in its footer. The successfully opened PDF has 20 pages.

- B.1, printed page 1: protected products include wine and liqueur-wine categories. Fortification is not a requirement for every eligible dry Jerez wine.
- B.2, printed page 2: the Fino range is 14 to 17 per cent alcohol, with the specified sugar condition. The new technique does not add a numerical Fino quiz; the coordinator checked legacy wording that used 15 as a universal minimum.
- C.2, printed page 4: fortification is described for liqueur wines, including obtaining required strength where fermentation alone does not do so.
- C.3, printed page 5: biological and oxidative ageing can use either criaderas-and-solera or vintage ageing. The older claim that biological ageing can only succeed in a solera is not repeated.
- B.1 describes Oloroso's defining oxidative ageing after disappearance of an initial flor veil. The old Amontillado question explanation stating that Oloroso never had flor was reported to the coordinator for correction, preserving its ID.
- F, printed page 7: the authorised grape list includes the Palomino/Listán entries as well as Pedro Ximénez, Moscatel de Alejandría, Beba, Perruno and Vigiriega. Legacy wording that all dry styles must be solely Palomino was reported for correction.

The coordinating task, not this author, owns the resulting edits to the existing Jerez reading, flashcards and questions in `spain.2.json`. The source review deliberately prefers the dated specification over older marketing explanations when the two conflict.

## Access and interpretation limits

Every lesson has at least two opened authority-source URLs. The Asti press-kit text was readable through the search index, while direct access returned a restriction; the corroborating current Moscato page was also indexed but restricted when opened. No exact Asti alcohol or pressure threshold was used. The ancillary indexed evidence is identified rather than represented as a complete PDF review.

A producer sheet establishes that producer's method, not all appellation requirements. Regional educational pages often simplify complex production choices. Numerical claims are therefore restricted to the explicitly scoped Icewine/Eiswein conditions and the OIV white-with-maceration category, with current Jerez distinctions stated from its consolidated specification. The exercises do not prescribe winemaking parameters, claim that all bottles from a region use one method, or infer a legal category from one aroma.

