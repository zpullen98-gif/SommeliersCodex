# Champagne regional atlas review

The authored regional study is in `.scripts/atlas-regions/champagne.cjs`.
Primary-source checks were performed on 20 October 2026. This is a targeted
Champagne review, not a certification of every inherited French wine question.

## Regulatory source hierarchy

Use the [Champagne specification published by the French agriculture ministry
on 7 August 2025](https://info.agriculture.gouv.fr/boagri/document_administratif-677d59b2-d392-4220-9fa3-e65dbc723244)
for the provisions used here. Its landing page identifies the approval of
31 July 2025 and supersession of the February 2024 text. The variety provisions
are on PDF page 2, the blend and disgorgement rules on page 18, and the release
timing on page 20.

The INAO search index also returns a July 2026 national opposition procedure.
A proposed amendment is not evidence that it has been approved. No proposed
2026 change has been promoted into these teaching notes.

The [Comité Champagne announcement of 16 October 2025](https://www.champagne.fr/fr/approfondir/mediaroom/communique-presse-champagne/le-chardonnay-rose-un-cepage-oublie-qui-retrouve)
confirms the Chardonnay rose change. Its current grape page is more current on
this point than the site's general FAQ. Where sources disagree, prefer the
dated specification and announcement over undated summary copy.

## Narrow inherited corrections

Only the Champagne record in `.scripts/regions/fragments/france.1.json` was
changed. The corrections cover:

- The principal-variety list and the separate conditional status of Voltis.
- Blanc de Blancs wording in the grape note, wine description, label guide and
  existing flashcard answer.
- Western versus eastern Marne Valley grape tendencies in the lesson and
  existing quiz explanation.
- Removal of universal lifespan promises tied to grape or district.
- The exact lower sweetness-category threshold in the label guide and
  existing dosage card.
- More accurate growing challenges and removal of the unqualified pruning
  restriction inherited from earlier prose.
- Current primary-source links.

Card fronts, card order, question text, options, accepted answers, correct-answer
positions and question order were compared before and after the edit and are
unchanged: ten cards and eight questions. The regional builder was deliberately
not run by this research subtask; the release owner integrates all fragment
changes together.

## Geographic meaning

All twelve points come from the French government's geographic API `centre`
field, queried by commune and then recorded with its INSEE identifier. They are
approximate commune-centre reference points. They are not winery locations,
village squares, vineyard outlines or legal appellation boundaries. This matters
especially for the modern merged commune Aÿ-Champagne.

The frame includes the northern vineyards, the western Marne Valley, Côte de
Sézanne, Vitryat, Montgueux and the southern Côte des Bar. No vineyard polygon
was traced from a copyrighted commercial or official illustration.

One tourist page on the Comité site describes Montgueux as east of Troyes;
the government location confirms it lies west. The new study uses the verified
western location.

## Teaching design

The study separates broad regional tendencies from a bottle's actual character.
The rehearsal prompts distinguish geographic origin, production method and
sweetness. Serving recommendations remain separate from Brennan's own bottle
list, pour sizes and service procedures.
