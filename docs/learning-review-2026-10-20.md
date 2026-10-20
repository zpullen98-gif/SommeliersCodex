# A clearer route through the Codex

The 20 October review connects the existing learning material to short, understandable journeys. It preserves the wine records, question identities, stored answers, notes and progress export format.

## Reader experience

- Home now opens Today's study directly and explains what a level selection changes.
- The Learning Compass, reached from Home, Today and More, offers six paths: prepare for a shift, build foundations, present a bottle, pair a dish, describe a wine and explore a region.
- Practise offers a search, a collection jump and recoverable empty results. Returning from a deck restores the search.
- Deck setup offers ten, twenty or the whole collection where applicable. Larger ordinary collections default to twenty and prioritise cards needing another look, then unseen cards. Existing daily selections, exact retries and Cellar Compass ordering retain their own rules.
- Library and Today search the same learning material. Lessons and service references appear alongside regions, grapes, chapters, producer profiles and restaurant cards. Results are grouped and expandable.
- The Culinary Companion grows from five to eight lessons. New lessons cover order confirmation, a doubtful bottle and dietary requests.
- Pairing explanations distinguish the chosen teaching model from other reasonable recommendations. Written tasting exercises explicitly teach reasoning from text and do not claim to assess sensory skill.

## Ownership

`codex42.js` owns the Home welcome, learning guide, practice filter and editorial framing. `codex43.js` owns bounded rounds, the Study Plan's manageable first action and text tasting clarity. `codex44.js` owns unified reading search. They load in that order after codex41 and before boot. The two new stylesheets use the established day and night tokens.

The earlier home and navigation VM gates still hold the original layers to their contracts. The browser gates below load the actual final chain and test the later Home extension and learning paths. No earlier question bank was rebuilt.

See [the service and pairing evidence log](service-editorial-review-2026-10-20.md) for the factual review, its authoritative sources and its boundaries. This release does not certify every historic examination question or claim that the saved house list is live inventory.

## Verification

Use the source preview with the canonical shared house pack, or set `CODEX_URL` to a running public preview. The browser gates use isolated profiles.

- `.scripts/check-learning-flow.cjs`: all eighteen guide steps, Today, practice filtering, return context and unchanged marks while reading.
- `.scripts/check-study-rounds.cjs`: every major deck family, sizes, existing grades, exact retries, completion and tasting.
- `.scripts/check-library-search.cjs`: representative searches, exact reading destinations, keyboard/focus, private wine records and query recovery.
- `.scripts/check-culinary-study-data.cjs` and `.scripts/check-culinary-routes.cjs`: eight lessons, sources, bindings, phone layouts and cold deep links.
- Existing syntax, regions, navigation, study and release gates remain required. Source and published wing are integrated through `tools/sync-wing.mjs`, not copied over.

Optional maps, region readings and teaching images keep their existing separate caches. The core worker cache advances for the new scripts and teaching text.
