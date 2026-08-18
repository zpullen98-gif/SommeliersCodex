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

| Path | Does |
|---|---|
| `categories/<name>.py` | One category: `CAT`, `SLUG`, `SYLLABUS`, `BANK`, plus `PREFIX`/`RANK`/`SOURCE` for Rank II and any `ACCEPTED` phrases a human has cleared |
| `lib.py` | Minting, balanced option dealing, emit, and five checks |
| `build.py` | Driver — `py rewrite/build.py r1_bordeaux`, or `--all` |
| `manifest.py` | Progress across all 67 categories, and what is largest next |
| `check-similarity.py` | Multi-test similarity against the imported bank — `--all` also works |

`ACCEPTED` records a human verdict so a reviewed false positive is not
re-litigated every run. Adding to it is a review decision, never a way to quiet
the checker.

The five checks, all run by `build.py` and all blocking:

| Check | Catches |
|---|---|
| `structural` | Shape, syllabus coverage, duplicate stems, id collisions, answer-position clustering, malformed accept lists |
| `self_grading_problems` | A short answer whose own displayed answer would grade WRONG |
| `cross_accept_problems` | An accept list broad enough to grade another question's answer |
| `duplicate_answers` | Two questions testing the same thing |
| `template_variety` | A stem opener used more than 15% of the time |
| `banned_template_problems` | A construction with a collision history, e.g. "is best described as" |

`match_sa` is a port of `core.js` `matchSA`, so accept lists are tested the way
the app will actually grade them rather than by eye.

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

## Second category — Bordeaux, 63 questions

Run to test the pilot's amendment: vary stem construction *deliberately from the
start* rather than reframing collisions afterwards. `lib.template_variety` now
enforces it, flagging any stem opener used more than 15% of the time.

It half worked, and the half that failed is the more useful result.

**Opener variation is necessary but not sufficient.** Bordeaux achieved **63
distinct stem openers across 63 questions** — perfect variety by that measure —
and still produced three collisions on the first pass, one sharing a **seven-word
consecutive run**:

> ours: "Pauillac contains how many of the five First Growths?"
> source: "Pauillac is home to how many of the five First Growths?"

The reason is that a narrow factual question has a genuinely small phrasing
space. There are only so many ways to ask how many First Growths sit in Pauillac.
Varying the *opening* does not help when the convergence is in the body of the
question.

The fix is the same as before and it is the only one that works: **change the
task, not the words.** That question became "Margaux and Haut-Brion are two of the
five First Growths. Where are the other three?" — same competency, different
cognitive operation, no shared run.

| | first pass | after |
|---|---|---|
| exact stem matches | 0 | 0 |
| max sequence ratio | 0.800 | **0.560** |
| longest shared word run | **7** | 5 |
| flagged for review | 3 | **0** |
| distinct stem openers | 63 / 63 | 63 / 63 |

Bordeaux clears with nothing flagged at all, which Viticulture did not manage.
The comparison between them is the argument for doing it deliberately: written
reactively, Viticulture ended at 62 distinct openers of 69 with "what is the"
used eight times; written deliberately, Bordeaux used no opener twice.

### Two rules for the remaining categories

1. **Vary the opener deliberately.** Cheap, enforced by the build, and it
   removes the whole class of template ruts.
2. **Expect narrow factual questions to converge anyway, and reframe the task
   when they do.** For any question whose answer is a number, a single name or a
   date, assume the phrasing space is small and choose a different angle on the
   fact from the outset.

## First Rank II category — Food & Pairing, 65 questions

Run early, before 30 more Rank I categories were written against tooling that had
never met a short answer. That was the right order: **Rank II has an entire class
of bug Rank I does not.**

A multiple-choice question carries its own answer. A short answer carries an
`accept` list, which is a grading contract that can be wrong in ways nothing
about the question text reveals. Four new checks came out of this category.

### The serious one: nine questions would have marked a correct student wrong

`self_grading_problems` grades every question's own displayed `ans` against its
own `accept` list, using a port of `core.js` `matchSA` — the real branches,
including `~`strict, numeric and containment. **Nine of 52 short answers failed
it.** A student reads the answer on the review screen, types exactly that back
next time, and is marked wrong for giving the answer the app showed them.

Nothing else catches this. It is invisible in the question text, invisible to
the similarity check, and it would have shipped.

Because it is mechanical rather than editorial, `SA()` now guarantees it: if the
displayed answer would not grade, it is prepended to the accept list at
construction. The check remains as verification.

### Accept lists that were too broad

`cross_accept_problems` flagged six. Some were genuinely loose — `serve it`
would have graded "serve it cooler", "serve it back to the kitchen" or anything
else opening that way. Others revealed redundancy: `fino` was the answer to two
different questions.

Both need fixing, for different reasons — tighten the first, differentiate the
second.

### Questions that were quietly duplicates

`duplicate_answers` found three questions circling the same sweetness rule.
Neither other check could see it: cross-accept only looks at short answers, and
the similarity check only ever compares against the source, never the bank
against itself.

It needed one refinement to be usable. Its first run flagged three Bordeaux
pairs whose answers were identical — "Cabernet Sauvignon", "Pomerol", "Merlot" —
which is not redundancy at all; two questions may legitimately share a one-word
answer while testing entirely different things. **Length is the discriminator.**
Independently writing the same nine-word sentence twice is not coincidence, so
the check now requires a substantial answer before it fires.

### Option positions are now dealt, not shuffled

The pilot's per-question shuffle is independently random, which clusters at
small counts: Food & Pairing's 13 multiple-choice questions put **seven answers
at position C**, gameable without knowing any wine. Positions are now dealt
round-robin across the bank and the deal itself shuffled, so the spread differs
by at most one at any size.

| | before | after |
|---|---|---|
| Viticulture (69 MC) | 26/17/17/12 → 18/17/17/17 |
| Bordeaux (63 MC) | 16/18/13/16 → 16/16/16/15 |
| Food & Pairing (13 MC) | 2/3/7/1 → 4/3/3/3 |

### Similarity

| | first pass | after |
|---|---|---|
| exact stem matches | 0 | 0 |
| max sequence ratio | 0.632 | **0.560** |
| longest shared word run | 6 | 5 |
| flagged | 2 | **0** |

Two collisions, both fixed by the rule Bordeaux established: change the task.
Notably the flag count keeps falling as the rules accumulate — 11 of 69, then 3
of 63, now 2 of 65.

## Burgundy and Tasting & Service — 129 more, and a third rule

Two Rank I categories written with both existing rules applied from the start.
Both produced findings, and neither was about wine.

### Documenting a rule does not enforce it

Burgundy came back with a **0.933 sequence ratio**: "Burgundy's climate is best
described as what?" against "Burgundy's climate is best described as:". That is
the *same construction the pilot flagged twice*, written into a new category by
the same author who had written the rule against it into this file.

The conclusion is not that the rule is wrong. It is that a rule living only in
prose gets reached for anyway. `BANNED_TEMPLATES` in `lib.py` now holds every
construction with a collision history, each annotated with where it collided,
and the build fails on them.

It earned its keep immediately: switching it on flagged a **latent** case in
Bordeaux — "Which is the largest of the Right Bank's fine wine appellations?" —
which had passed the similarity check because it happened not to collide in that
bank, while using a construction that collided in another.

### Rule three: do not lead with the subject

Tasting & Service flagged seven, and every one had the same shape:

| ours | source |
|---|---|
| "Primary aromas in wine originate from what?" | "Primary aromas in wine derive from:" |
| "Tannin is perceived as what kind of sensation?" | "Tannin is perceived as:" |
| "Decanting an old red is primarily done for what reason?" | "Decanting an old red wine is primarily done to:" |

Every collision was a stem that **leads with the subject noun and then asks about
it.** When the task is define-or-explain X, the subject has to come first, so
both authors write the same opening clause — and varying the opener cannot help,
because the opener is forced by the question type.

The fix is to invert: lead with the symptom, observation or scenario, and let
the subject become the answer.

> "Tannin is perceived as what kind of sensation?"
> becomes "Which wine component registers as touch rather than as a taste?"

> "Decanting an old red is primarily done for what reason?"
> becomes "A forty-year-old red has thrown a heavy deposit. What is the decant
> chiefly achieving?"

This also happens to be better assessment: recognising astringency from a
description is a more useful skill than reciting which component it belongs to.

| | Burgundy first pass | after | Tasting first pass | after |
|---|---|---|---|---|
| max sequence ratio | **0.933** | 0.545 | 0.769 | 0.533 |
| longest shared run | 7 | 4 | 6 | 4 |
| flagged | 6 | **0** | 7 | **0** |

### Categories are namespaced by rank

The manifest exposed a structural fault: **category names repeat across ranks.**
There is a Bordeaux in Rank I (63 questions, all multiple choice) and another in
Rank II (54, mostly short answer), and likewise Viticulture and Food & Pairing.
Modules keyed on name alone double-counted progress, and a Rank II Bordeaux would
have silently overwritten the Rank I output file.

Modules are now `r1_*` / `r2_*`, slugs carry the rank, and the manifest keys on
the pair. Cheap at three categories; expensive at thirty.

## Four categories in parallel, and a defect in the shipped grader

Service & Hospitality (64, Rank II), Sake & Spirits (64), United States (61) and
Italy (61) were written concurrently, one agent per category, each given the three
stem rules and the banned-construction list up front and hard-blocked from reading
the imported banks. Each was then fact-checked by two independent reviewers with
different lenses: one on factual claims, one attacking the answer keys.

Writing them with the rules in hand rather than discovering the rules worked: three
of the four came back with ZERO similarity flags on the first pass, against 11 of 69
for the original pilot.

The fact-check returned 0 critical and 10 moderate findings, with every answer key in
all four categories confirmed correct by both lenses. The catches were specific and
sourced: a distractor defining muroka as its exact opposite (it means WITHOUT
filtration); the California 100 percent appellation rule contradicting a blanket
"75 percent" claim; Sassicaia called a Bolgheri subzone when it has been an
independent DOC since 2013; Chianti Classico implied to be a Chianti subzone when it
has been separate since 1996.

### The tilde was never a strict match

The most valuable finding was about this tooling, not about wine. The tilde was
documented here as a strict match. It is not: core.js accepts a tilde entry on
whole-word CONTAINMENT, so a one-word tilde matches that word anywhere inside a
wrong answer.

    accept ['~young']    graded "old wine first, young wine second"
    accept ['~contrast'] graded "complement not contrast"

Both are the reverse of the intended answer, and one of them was in a category
written here. A reviewer found it by running this repo's own match_sa against
adversarial inputs, which none of the six checks then did.

### Which led to a defect in the product itself

Probing further showed the problem was never confined to the rewrite. Containment
matching cannot see a "not", so across the three shipped short-answer banks 1,750 of
1,773 questions graded at least one negation of their own answer as correct,
including 947 of 950 in the Knight and Ruler banks, which are the whole paid tier.

That cannot be fixed question by question, and it was fixed in js/core.js instead: a
guard that fires when the input carries a negation the accepted phrase does not, on
the containment and numeric branches only. Exact matches return first, so an answer
that legitimately contains a negation still grades. Result: 1,663 false accepts
removed, 95 percent of the defect, for 15 new false rejects, 0.9 percent.

The trade is the right way round. A false reject is recoverable through the existing
override screen, which exists precisely to record accept lists needing widening. A
false accept silently teaches the wrong fact and nobody ever sees it.

### Checks added, and one that lied

Four checks came out of this: negation_probe_problems (build negations from each
question's own answer and confirm the grader rejects them), loose_tilde_problems,
compound_answer_problems, and a widened duplicate_answers.

compound_answer_problems reported clean while it was broken. Heredoc escaping had
written its word-boundary escape as a literal backspace byte, so the pattern matched
nothing; cat -v showed the control character. It is now a token-set test with no
escapes to mangle. A check that reports clean because it is broken is worse than no
check at all.

Two checks had to be retuned rather than obeyed. The first tilde check flagged all 59
single-word entries, which is noise that gets ignored, so it now keys on whether the
word recurs in the category. cross_accept_problems was flagging an entry that simply
IS its own question's answer, and was ignoring that ex=True matches exactly.
Over-firing checks get switched off, so they are worth tuning.

### ex=True is not a blanket remedy

The repair pass applied ex=True to 13 short answers without widening their accept
lists, and a verifier caught that all 13 then rejected natural phrasings of their own
answer. It also caught three flags cleared by rewriting the stem so the checker
stopped looking, rather than by fixing the accept list.

ex=True is right only where a wrong answer can contain the right one as a qualified
phrase: tawny against vintage port, synthetic against natural cork, or "old wine
first, young wine second". The negation guard cannot see those, because there is no
negation word in them. It was relaxed on the nine questions that never had that
hazard.

## Scaling to the full job

**Progress: 576 of 3,061 questions (18.8%), 9 of 67 categories.** Rank I: Viticulture &
Winemaking (69), Tasting & Service (66), Sake & Spirits (64), Bordeaux (63), Burgundy (63),
United States (61), Italy (61). Rank II: Food & Pairing (65), Service & Hospitality (64).
All nine pass all nine checks and the similarity pass. Run `py rewrite/manifest.py` for the
live count.

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
