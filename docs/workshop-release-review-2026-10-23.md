# The Wine Workshop review, 23 October 2026

The next step after the Regional Field Atlas is the complete 43-topic technique
family already specified in Claude's deeper-atlas roster. This release connects
growing and cellar choices to regional reading, recall and guest explanations.
It does not activate the separate future 29-article or seven-country families.

## Reading and study

Each lesson has a foundation, a process sequence, sensory implications, regional
examples, label or production-rule distinctions, pronunciation, common mix-ups
and linked sources. Premier Cru and Grand Cru explanations are optional additions.
These are study depths within the app, not a claim of examination endorsement or
complete coverage of an examination syllabus.

The collection contains 344 cards and 344 questions. Each lesson has six foundation
items and one item at each deeper level in both banks. Changing depth does not
change the user's course level, existing card identities or saved marks. The
collection starts with foundations each session. Reading and navigation never
manufacture grades; spoken service rehearsals are unscored.

Today, Library, Practise, search and the regional Learning Compass path provide
entrances. Explicit authored links join regional readings and field maps to
technique lessons. General technique knowledge does not establish the production
method or current availability of an individual Brennan's bottle.

## Evidence

The three companion reviews document source selection and topic-specific limits:

- `techniques-sparkling-sweet-review-2026-10-23.md`
- `techniques-cellar-review-2026-10-23.md`
- `techniques-vineyard-terroir-review-2026-10-23.md`

Educational explanations are original paraphrases. Regulatory claims are scoped
to their jurisdiction and checked against dated specifications or the responsible
body. Producer examples illustrate that producer's work and do not create a
regional rule. Sensory and food-service suggestions are conditional, not promises.
The existing regional corpus outside the touched Jerez material was not reverified
in its entirety during this release.

## Linked Jerez corrections

The workshop source review exposed contradictions in the older Jerez lesson.
The current specification is hosted by the Consejo Regulador:

https://www.sherry.wine/documents/597/21052026_Pliego_Jerez_1wBQg8y.pdf

The approval was published in BOJA:

https://www.juntadeandalucia.es/boja/2026/95/28

The consolidated May 2026 specification, especially sections B, C, D and F,
supports these corrections in `fragments/spain.2.json`:

- Protected wine and liqueur-wine categories distinguish eligible unfortified
  dry wines from fortified wines. Traditional fortification pathways remain
  useful teaching examples but are not universal requirements.
- Fino is 14 to 17 per cent alcohol and defined by biological ageing. The normal
  dry limit is 4 grams of sugar per litre, with a separate conditional provision
  for qualifying old wines. Fino's ageing area excludes Sanlúcar; Manzanilla has
  its own protected designation.
- Medium starts at 4 and remains below 115 grams per litre; Pale Cream starts at
  50 and remains below 115. Pale Dry is also identified. Sweet categories and
  the qualified-old-wine exception are kept distinct.
- Biological and oxidative ageing can use either criaderas and solera or the
  permitted vintage system. The normal oak-vessel limit is 1,000 litres.
- The defined area includes ten municipalities, including San José del Valle.
  Palomino is the principal dry-wine grape, not the only authorised variety.
- Oloroso's defining maturation is oxidative; the specification permits an
  initial flor veil, so the old explanation that it never had flor was removed.

All ten existing Jerez card positions and all eight question IDs are retained.
Question `r-3hqbetai` now explicitly asks about the traditional fortification
pathway, and `r-71uwk1ah` asks for the principal dry-wine grape. Both still test
the same fact with the same correct answer. Relevant answers and explanations
were corrected without transferring progress to a different learning concept.

## Verification

- Complete build is reproducible; all 1,412 regional/country/technique question
  IDs are pinned, including the 344 new technique questions.
- Coverage check confirms 43 complete lessons, 344 cards, 344 questions and 172
  deeper explanations, with valid links in both directions.
- Workshop browser checks pass all 39 assertions, including every lesson's full
  mobile reading, three depth levels, exact missed-card retry, grading, search,
  maps, cold links, Back, unavailable-reading recovery and both service colours
  at widths 320, 390 and 1,360 pixels. No browser exceptions occurred.
- The existing Learning Compass passes 78 checks, including its new technique
  step and the missing-house-data recovery paths.
- Regional data and wiring pass 74 checks; all 271 house wine region strings
  resolve. The merge proof now loads the actual technique extension and checks
  every field of all 19 reading files, rather than substituting a mock merger.
- A real service worker preserves the current technique reading across an
  offline reload. A different lesson, deeper reading, cards, grading and questions
  all work offline, preserving both an existing Champagne mark and a technique
  mark. The isolated test profile contains no user data.
- Compared with source commit `85b992d0a1116a4781aeed9afe7710239de524b3`, all 1,169
  existing card positions and 1,068 question IDs remain. The 138 legacy records
  outside Jerez retain identical card and question content. Jerez's correct
  answers retain the same learning concepts. The geographic join is unchanged.
- The field-atlas integrity check confirms all 129 map assets, 115 regional
  joins, 14 country maps and 1,284 locations with unchanged artwork hashes.
- Desktop night service and mobile day service were visually inspected.
- A separate read-only review checked runtime integration and all multiple-choice
  answers in the sparkling/sweet and cellar collections. It identified one
  ambiguous qvevri prompt, corrected before IDs were pinned. Giveaway distractors
  were replaced with plausible wine-related alternatives before the final build.

The source and public wing remain separate checkouts. Publication uses
`tools/sync-wing.mjs codex` and the public repository's full nine-gate release
suite, preserving its shared layer and the other apps.
