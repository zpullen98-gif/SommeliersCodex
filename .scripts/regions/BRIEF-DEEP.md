# The atlas in depth: the brief (22 October 2026)

This brief adds to `BRIEF.md`, which still holds every rule that never bends (your own words, an empty field
is a true answer, British spelling, no dash, respellings, the question rules, the house). Read both. The owner
studies for the Court of Master Sommeliers and asked for every country, region, technique and terroir taken
to Master depth, **marked**, so the Certified reading stays clear at the top. Every name and slug you may use
is fixed in `roster.cjs`; never invent a slug, a key or a technique.

## The levels, as the app names them
Régionale is the Introductory exam (`intro`), **Village is Certified** (`certified`), Premier Cru is Advanced
(`advanced`), Grand Cru is Master (`master`). Never write a level as a number. In prose say "asked from
Premier Cru", never "Premier Cru" alone where it could be read as a cru.

## Certified first, then deeper
A record's existing fields are its **Certified (Village) reading**: summary, terroir, grapes, wines, made,
law, the untagged places, producers, exam, traps, say, the untagged cards and questions. Everything the
Village exam asks stays there, written plainly. The summary stays 60 to 120 words and readable by a
Certified candidate.

The deeper material goes in **one list per record**:

```
"deeper": [ { "sec": "made", "depth": "advanced", "head": "Pressing and the cuvée", "text": "...", "src": [0, 2] } ]
```
- `sec`: the section it deepens. Articles: `land`, `grapes`, `made`, `law`, `places`, `producers`, `exam`.
  Countries: `overview`, `grapes`, `law`, `places`, `exam`. Techniques: `how`, `why`, `law`, `where`, `exam`.
- `depth`: `advanced` (asked from Premier Cru) or `master` (asked from Grand Cru).
- `head`: optional, at most eight words.
- `text`: 30 to 220 words, a paragraph.
- `src`: the indices (from 0) of the record's `sources` it rests on. **A text holding a digit cites two
  sources, or one marked `"primary": 1`** (the law itself, the regulator, the consorzio, the appellation body).
- A deepened record carries 3 to 14 entries, over at least three sections, at least one `advanced` and at
  least one `master`.
- Places the exam asks only from Premier Cru or above keep `depth` on the place, as now (crus, MGAs, Grosse
  Lagen, lieux-dits, contrade, UGAs, AVAs, wards, parajes). Go down to the level a Master candidate is asked.
- Cards and questions may carry `"depth": "advanced"` or `"master"`. A deepened record has at least 8 cards
  (at least 2 tagged, at least 6 untagged, at most 14) and at least 8 questions (at least 2 tagged, at least
  5 untagged, at least 3 multiple choice, at most 12).

## The caps (words, as check-fragment counts them)
- Articles: terroir climate, soils, topography 15 to 160 each (water 0 to 160); made.viticulture and
  made.winemaking 60 to 300 each; law.classification 40 to 260. **Certified prose** (summary, terroir, wine
  notes, made, law.classification, untagged place notes) 800 to 1,800. **Deeper prose** (deeper texts and
  depth-tagged place notes) 300 to 2,000. The whole record at most 3,600.
- Countries: summary 80 to 160, overview 200 to 700, Certified prose 400 to 1,400, deeper 150 to 1,400.
- Exam and traps 3 to 10 lines. Sources: a deepened record at least 2.

## The existing records (deepening)
- Keep every question's pinned `id`. Reword a stem only when it is wrong; delete the `id` only when the
  question now asks a different fact. Never reorder or remove cards: **append** new ones.
- Names stay the atlas's; slugs never change.
- Correct what is wrong anywhere in the record, and log it. Thin sections are deepened: Burgundy's vineyard
  section, for one, is 105 words today.
- Places that the roster gives to a new article (`takes`) become a one line pointer in the old article
  ("Marche: its own article, Marche, holds Verdicchio and the Conero.").
- Source titles name the work and its publisher, never an author: "Wine Grapes (Penguin, 2012)", not the
  writers' names.

## The new articles (off the map)
- Exactly the roster's slug, name and sheet; `mapless: 1`; no `index`. They are written deepened from the
  start, to the same caps. Their country's `regionsOrder` is set by `apply-roster.cjs`, never by hand.
- The fragment is `<sheet>.more.json`: `{ "sheet": "<sheet>", "more": true, "regions": [ ... ], "aliases": { ... } }`,
  the articles in roster order, the aliases the roster gives (and more where a place needs one, folded).

## The new countries
Written like the seven map-less countries (places, no regions), deepened from the start, in
`mapless.3.json` and `mapless.4.json`. Georgia is split out of eastern-europe: the georgia record takes its
places and grapes (`GEORGIA_MOVE`, `GEORGIA_GRAPES`), and the eastern-europe record keeps a one line
pointer.

## Techniques
Every record lists the techniques at work in it: `"techniques": ["traditional-method", "oak"]` (articles 0
to 8, countries 0 to 10), slugs from the roster only, and at least the roster's `MUST_LINK` for that record.

A technique record (`techniques.<n>.json`, `{ "techniques": [ ... ] }`):
```
{ "slug", "name", "group" (all three exactly as the roster), "asked": [levels], "aka": [0 to 8 other names],
  "cats": [PRIMERS cats or INTRO_PRIMERS ids it belongs to, may be empty],
  "summary" (60 to 120), "how" (80 to 300: how it is done), "steps": [[step, detail]] (3 to 10),
  "why" (40 to 200: what it gives the wine), "law" (0 to 200: where the law requires, names or forbids it),
  "where": [[place, note]] (2 to 10: where it is used, by region name), "deeper" (sections how, why, law,
  where, exam), "exam" (3 to 10), "traps" (3 to 10), "say" (at least 1), "cards" (8 to 12, at least 2
  tagged), "questions" (6 to 10, cat equal to the name, at least 3 multiple choice, at least 2 tagged),
  "sources" (at least 2), "related": [0 to 6 technique slugs] }
```
Never `videos` or `watchSearch`: those are written by `apply-videos.cjs` from the video evidence.

## Facts
- A fact rests on a standard reference, the law or the appellation body, or two independent sources. A
  number, a date or a legal rule in deeper text cites as above. Prefer ranges where sources disagree.
- No superlatives ("best", "finest", "greatest", "most famous", "iconic") unless measured and sourced
  ("the steepest vineyard in Europe" needs its source). check-fragment prints a note for each; resolve it.
- No living person anywhere in the text: a winemaker, an owner, a critic, a writer. A producer is named
  by its estate's trading name; a historical founder may be named with a date.
- Nothing volatile as fact: no current owner, hectares, current winemaker, recent vintage verdicts.
- Your search allowance is small (your prompt gives it): spend it on law changes from 2020 to 2026 and on a
  fact you cannot settle from the Codex's own chapters, the atlas notes and standard knowledge.

## Videos (the video finder and the video checker, never the author)
A video is an external link the owner taps; nothing is embedded. YouTube, oEmbed and fetching pages are
blocked here, so a video counts only when **two different searches return the same
`www.youtube.com/watch?v=<id>` with the identical title**, and it clearly teaches the subject. Search results
seldom print a channel, so (the owner's rule, 23 October 2026) a film whose channel no result shows is
`channelKind: "unknown"` and ships with our label and watchFor only, never a channel name; a channel a result
does show must be the same in both searches, and only a channel some result shows can be named:
1. **The finder** runs one search (for example `<name> wine region GuildSomm youtube`, or the trade body:
   Wines of Portugal, Austrian Wine, Wines of Germany, Wine Australia, Bourgogne Wines). It keeps a
   `watch?v=` result from a channel in `companies.json` or a recognised educator (a person's channel ships
   with our label only, never its title or channel name), and records the title, the channel and up to three
   results verbatim (a result with no channel shown is recorded without one). One more search at most;
   otherwise the verdict is `search`.
2. **The checker**, a separate agent, sees only the candidate and runs a different search: the exact title in
   quotes, with the channel when one is known, never the id. It passes the video only when the same id and the
   identical title come back (and the same channel, wherever a result shows one).
- Not a Short, a playlist, music, an advert or a trailer. It must teach the region, country or technique.
- Evidence: `.scripts/regions/videos/<key>.json` (never shipped):
  `{ key, kind: region|country|technique, name, verdict: pass|search, watchSearch, video: { url, id, title,
  channel?, channelKind: company|person|unknown, label, watchFor }, searches: [ { by: finder|checker, query,
  results: [ { url, title, channel? } ] } ] }`.
- `label` is our own words (3 to 12, nobody named); `watchFor` what to watch for (8 to 30 words, only what
  the results show or what any good film on the subject shows). `watchSearch` (3 to 8 words) builds the
  fallback search link when no film passes.
