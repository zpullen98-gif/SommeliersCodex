# Tuscany teaching review

Reviewed on 20 October 2026. The authored regional study is in `.scripts/atlas-regions/tuscany.cjs`; canonical lesson corrections are confined to the Tuscany record in `.scripts/regions/fragments/italy.2.json`. The regional builder has not been run by this work.

## Regulatory corrections

- **Chianti DOCG:** the decree of 5 June 2026, published on 12 June, applies from the 2026/27 harvest campaign. Its red-wine Sangiovese minimum is 60 per cent, rather than the former general 70 per cent. White grapes remain limited to 10 per cent. Terre di Vinci is the eighth sub-zone. The amendment also authorises Chianti Rosé, with a special provision for eligible 2025 lots. The consortium's older overview still shows seven sub-zones and 70 per cent; the published specification takes precedence. Earlier vintages remain subject to their applicable rules.
  [Official Gazette, 12 June 2026](https://www.gazzettaufficiale.it/do/gazzetta/downloadPdf?dataPubblicazioneGazzetta=20260612&edizione=0&estensione=pdf&home=true&numeroGazzetta=134&numeroSupplemento=0&progressivo=0&tipoSerie=SG&tipoSupplemento=GU).
- **Chianti Classico Gran Selezione:** retain the 2027 vintage transition to at least 90 per cent Sangiovese with native complementary red grapes. Remove the implication that a UGA must appear on every label. UGA eligibility and blend requirements are separate matters.
  [2023 official amendment](https://www.gazzettaufficiale.it/eli/id/2023/07/01/23A03731/sg), [consortium statement reproduced by Qualivita](https://www.qualivita.it/news/approvate-le-modifiche-al-disciplinare-di-produzione-del-chianti-classico-dop/).
- **Morellino di Scansano:** the 2026 amendment introduces Superiore, retains at least 85 per cent Sangiovese for ordinary wine and Superiore, and raises Riserva to at least 90 per cent. Do not apply the new requirement indiscriminately to older vintages.
  [Official Gazette, 9 February 2026](https://www.gazzettaufficiale.it/eli/gu/2026/02/09/32/sg/pdf), [EU publication C/2026/2835](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ%3AC_202602835).
- **Vernaccia Riserva:** at least 11 months of ageing, including three in bottle; oak is optional.
  [Consortium specification](https://vernaccia.it/wp-content/uploads/2025/02/DOCG-Vernaccia-di-San-Gimignano_DISCIPLINARE-2024.pdf).
- **Sassicaia:** specify the actual minimum of two years, including 18 months in 225-litre oak barrels, instead of the vague claim that most ageing is in barrique.
  [Consortium specification](https://www.bolgheridoc.com/wp-content/uploads/2020/10/disciplinare-sassicaia-en.pdf).

## Teaching corrections

- Super Tuscan is informal. Some such wines are Toscana IGT, while Ornellaia is Bolgheri Superiore and Sassicaia has its own DOC. Remove statements that all are IGT or that classification establishes quality.
- Masseto is Merlot-led, with Cabernet Franc documented in some vintages. Replace the assertion that every vintage is pure Merlot.
  [Estate's 2019 technical sheet](https://www.masseto.com/filemanager/view/725a53b4-5a70-4746-a04f-8c147d9828b8).
- Replace unsupported rankings and guarantees: a single best altitude or soil mixture, Rufina as the smallest and highest sub-zone, fixed north/south Montalcino styles, Montepulciano as necessarily lower, guaranteed coastal ripeness, and universal barrique fermentation or oak flavours.
- Keep geology as vineyard context rather than a direct transfer of rock flavour into wine. Broaden Maremma beyond coastal plain and distinguish its overlapping appellations.
- Pairing and tableside suggestions are original training exercises. They do not assert that a particular wine is on Brennan's current list or establish the house's service procedure.

## Study identity and map integrity

- All Tuscany region identifiers, producer identifiers, list positions and list counts are preserved.
- Flashcard index 5 changes from `Chianti DOCG sub-zones: name the seven` to `Chianti DOCG sub-zones: name the eight`. Its array position is unchanged.
- Quiz index 7 changes from `Which single grape variety makes Masseto?` to `Which grape variety leads Masseto?`. Merlot remains the answer. The existing runtime ID **`r-7l28s0ma`** is explicitly pinned in the canonical fragment; the builder already supports retained IDs.
- Twelve town points use coordinates published in Visit Tuscany's page map metadata. Each point carries its own official source URL. They locate towns, not vineyards, UGA centroids or appellation boundaries. No copyrighted wine-map geometry was copied.
- Both files use current-vintage distinctions rather than silently applying revised rules to older bottles.

## Verification

- The canonical Italy fragment passes `check-fragment.cjs`.
- The authored study exports the requested schema and twelve points within the map bounds.
- The changed canonical record is Tuscany only. The parent workflow will build the regional output and audit retained IDs once all regional changes are ready.

## Follow-up correction: Abruzzo

A subsequent read-only scan found that Abruzzo still taught a two-DOCG count. With the parent task's approval, `.scripts/regions/fragments/italy.3.json` now includes **Casauria**, recognised in 2025, in the Abruzzo summary, classification, tiers, places, exam reminder and existing flashcard. Other regional records in that fragment remain unchanged. Two aliases, `casauria` and `terre di casauria`, resolve to Abruzzo.

The former Montepulciano d'Abruzzo sub-zone in Pescara province requires at least 90 per cent Montepulciano. Minimum ageing is 18 months, or 24 for Riserva, counted from 1 November following the harvest. [Official recognition notice](https://www.gazzettaufficiale.it/atto/serie_generale/caricaDettaglioAtto/originario?atto.codiceRedazionale=25A06247&atto.dataPubblicazioneGazzetta=2025-11-22&elenco30giorni=true), [ministry specification](https://www.masaf.gov.it/flex/cm/pages/ServeAttachment.php/L/IT/D/1%252F5%252F7%252FD.c05ba8c5327d359dec79/P/BLOB%3AID%3D19827/E/pdf?mode=download).

Flashcard index 1 changes from `Abruzzo's two DOCGs` to `Abruzzo's three DOCGs`, retaining its position. Quiz index 2 is now `Which former Montepulciano d'Abruzzo sub-zone became a DOCG in 2003?`, so Casauria does not make the old question ambiguous. Its answer remains Colline Teramane and its existing ID **`r-o566n8yj`** is explicitly retained. The fragment validator and whitespace check pass.
# Narrow France follow-up, 20 October 2026

These edits accompany the regional atlas release but do not claim a complete audit of every French lesson.

- Bordeaux: Entre-deux-Mers is no longer a white-only appellation. Its winegrowers confirm recognition of red wines in 2023. Updated the white style note, cellar paragraph, district tier, place note, exam trap and existing quiz explanation. [Appellation source](https://vinsentredeuxmers.com/en/red/).
- Bordeaux question `r-67o947d9`: “Which Bordeaux appellation is reserved for dry white wine alone?” became “Which Bordeaux appellation added red wine to its formerly white-only rules in 2023?” The answer remains Entre-Deux-Mers and the explicit original ID preserves study history.
- France and Alsace: removed the claim that Alsace is the only French region to name grapes on labels. Retained the useful teaching point that varietal labelling is especially characteristic of Alsace.
- Alsace: replaced a blanket dry-style description with a reminder to check the bottle. The 2021 sweetness rule is stated specifically for AOC Alsace white wines, excluding Vendanges Tardives and Sélection de Grains Nobles. [DREETS regulatory guidance](https://www.ava-aoc.fr/sites/default/files/bevs_alsace_-_mention_de_la_sucrosite_v2.pdf), [ministerial order, Article 7](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000043576207).
- Alsace: qualified the blanket “varietal label means 100 per cent” claim. Pinot Blanc can include Auxerrois, as CIVA explains. [CIVA Pinot Blanc](https://www.vinsalsace.com/en/gouts-et-couleurs/cepages/pinot-blanc-dalsace/pinot-blanc-dalsace/).
- Alsace question `r-xv7j6svw`: “What share of the named grape must an Alsace wine labelled by variety contain?” became “What proportion of Riesling must an AOC Alsace wine labelled Riesling contain?” The answer remains 100 per cent. The explanation teaches the Pinot Blanc exception and the explicit original ID preserves history.
- Existing card positions and all region identifiers are unchanged. No rebuild was run by this reviewer. France fragments 1 and 3 pass the canonical fragment validator.
