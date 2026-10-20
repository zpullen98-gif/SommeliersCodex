# Study rounds and tasting rehearsal

Layer 43, reviewed 20 October 2026.

The Practise collection contained decks as large as 1,169 regional cards, 824
house component cards and 600 producer cards. Starting one dealt the entire
collection. Deck setup now offers 10 cards, 20 cards or the whole deck, with
20 as the default. The collection and all existing card identities remain
intact.

A bounded selection reads the existing Again/Got it records for its card
type. Again cards come first, then unseen cards, then previously recalled
cards. Equal-priority cards are shuffled before the slice is taken, so the
round does not repeatedly select the first page of a collection. Ordered
component and producer collections for one wine keep their authored order.

The selected size is remembered only while this tab remains open. This
layer adds no local-storage keys, saved marks or question IDs. The active
round keeps its existing history token and card state. Returning from a
reading detour restores the current card and its revealed answer.

Daily review, the ten-wine Cellar Compass selection, exact guided Compass
paths, one-wine cards and explicit supplied-card runs are not shortened.
In particular, a retry includes the exact missed cards. Grape cards retain
their established behaviour: Again brings a card back within the round
until the learner recalls it.

Completion now identifies a shortened session as a round, offers the
existing miss retry and lets the learner begin another round. Grades still
go through the original functions and record stores.

The Study Plan's coverage recommendation opens the existing bounded daily
question engine instead of Endless. Other plan recommendations are unchanged.

The blind-flight introduction, active exercise and tally explicitly explain
that written clues measure profile recall, not sensory tasting skill. The
tally offers a single exact grape card for each missed profile, plus the
tasting-grid reference. Real-wine tasting remains essential for developing
sensory skill.

## Verification

`node .scripts/check-study-rounds.cjs [codexRoot] [playwrightModule]`

The browser test accepts `CODEX_URL` for a source or public preview and uses
an isolated context. Its 30 checks cover every deck type, priority and
shuffle order, singular grammar, visible round controls, unchanged saved
marks when starting, answer-side behaviour, reading detours and Back,
completion, exact miss retry, whole-deck access, Daily and Compass
selection, the Study Plan, tasting clarity and exact missed-profile cards.
