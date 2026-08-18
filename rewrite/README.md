# Rank I and II rewrite

Replacing the imported Page and Squire banks with original work. 3,061 questions and 39 study
chapters — 75% of the Codex. This directory holds the method, the tooling and the pilot; nothing
here is loaded by the app.

Why: `data-intro.js:2` and `data-primers-intro.js:2` name their sources, and
`OutsideOfTime/COMPLIANCE.md` §1a explains why moving them to the free tier reduced the charging
problem but not the reproduction one. Decision of 18 Aug 2026 was to rewrite rather than mitigate.

## The method

**Generate from a syllabus, never from the source question.** Rewriting question-by-question
produces paraphrases, which carry the same exposure as the original plus the wasted effort. The
unit of work is *a competency and a target count* — "Burgundy, 63 questions at Introductory
difficulty" — not a source question.

The order is load-bearing:

```
1. write the syllabus for the category      (competency blocks + counts)
2. write the questions from that syllabus   source NOT read
3. bake in the option shuffle               deterministic, seeded by the stem
4. run check-similarity.py                  source read HERE, for the first time
5. reframe whatever it flags                reframe the task, never swap synonyms
6. re-run 4 until clean
```

Reading the source before step 4 anchors the writing and is the one thing that makes the exercise
worthless.

**Reframing means changing the task, not the words.** If a stem is flagged, do not reach for
synonyms. Turn a definition question into an applied one — the competency stays, the construction
changes completely:

> flagged: "Carbonic maceration involves …"
> reframed: "Whole uncrushed clusters are sealed under carbon dioxide, and fermentation begins
> inside the intact berries. Which technique is this?"

## Tooling

| Script | Does |
|---|---|
| `build-pilot.py` | Holds the syllabus and the questions, bakes the option shuffle, mints ids, runs structural checks, emits the bank |
| `check-similarity.py` | Multi-test similarity against the imported bank: exact stem, longest shared word run, sequence ratio |

Ids are minted `i-<8 base36>` by the same FNV-1a 64 over `json.dumps([cat, q])` that
`.scripts/mint-ids.py` uses, so a generated id is exactly what the real minter would produce.
Options are shuffled deterministically from the stem, so rebuilds are reproducible and editing one
stem reshuffles only its own question.

**Remint now, not later.** `mint-ids.py --strip` says it plainly: re-minting is a pre-ship tool,
because once real progress exists the ids are load-bearing and stripping them orphans every store.
No Supabase project exists and nothing has been sold, so reminting the corpus costs nothing today
and strands every paying venue's review history after launch.

## Pilot result — Viticulture & Winemaking, 69 questions

Rank I's largest category, matched question-for-question in count and shape (100% four-option MC).

**The pilot found what it was built to find.** First pass flagged 11 of 69, including one stem at a
sequence ratio of **1.000** and another sharing a **7-word consecutive run**. Independent authorship
had removed the content dependence but not the *stem-template* dependence: "X is best described as"
is simply the natural way to write a definition question, and both authors reached for it.

| | first pass | after reframing |
|---|---|---|
| exact stem matches | 0 | 0 |
| max sequence ratio | **1.000** | 0.667 |
| longest shared word run | **7** | 5 |
| flagged for review | 11 | 4 |
| answer spread across A/B/C/D | 24/44/1/0 | 26/17/14/12 |

Seven stems were reframed from definition form into applied form. The answer-position spread was a
separate defect caught by the structural checks — writing correct-answer-first put 64% of answers at
B, which a student could game.

### The four remaining flags, reviewed and accepted

All four are shared *topic* vocabulary, which the compliance framework explicitly says is not
evidence of copying. Recorded here so they are not re-litigated on every run:

| Shared text | Verdict |
|---|---|
| `port is fortified` | The subject itself. No other way to name it. |
| `malolactic conversion changes` | The term itself. |
| `primary purpose of` (sulphur dioxide) | Common construction, unavoidable topic. |
| `are most associated with` (galets) | Common construction; the fact is a proper noun. |

The 0.60 ratio threshold is deliberately tight for short stems, so it over-flags. That is the right
direction of error: it flags for a human to read and clears nothing on its own.

## Scaling to the full job

| Bank | File | Questions | Categories |
|---|---|---|---|
| Rank I — Introductory | `js/data-intro.js` | 1,778 | 31 |
| Rank I study chapters | `js/data-primers-intro.js` | 39 chapters | — |
| Rank II — Certified | `js/data-questions.js` | 1,283 | 36 |

Rank II differs in shape: 476 MC and 823 short-answer, so it needs the `sa`/`accept`/`ans` fields
and generous accept lists, calibrated against the original Advanced bank rather than the imported one.

Per category: write the syllabus, generate, check, reframe, accept. Then run the whole rewritten
bank against the imported one in a single pass before deleting anything, because a question written
for Burgundy may land near one filed under Classifications.

**Not finished until** the imported files no longer ship, `README.md` loses both the "Personal study
project" licence line and the "imported from established material" note, the new file headers record
the real provenance, and `OutsideOfTime/COMPLIANCE.md` §2 is updated.
