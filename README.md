# The Sommelier's Codex

An offline-first, installable study hall for the four examinations of the Court —
**Page, Squire, Knight, Master** — in one app.

**[Open the Codex →](https://zpullen98-gif.github.io/SommeliersCodex/)**

Vanilla JavaScript. No framework, no build step, no dependencies, no network calls.
Install it once and it works on a plane.

---

## What's in it

| Rank | Questions | The sitting | Format |
|---|---:|---|---|
| **I · Page** | 1,778 | 70 questions, 45 min, 60% | all multiple choice |
| **II · Squire** | 1,283 | 45 questions, 38 min, 60% | 792 short answer · 460 MC · 15 matching · 16 select-all |
| **III · Knight** | 562 | 60 questions, 35 min, 60% | 475 short answer · 57 MC · 29 matching · 1 select-all |
| **IV · Master** | 445 | 50 min, spoken, 75% per section | oral-style prompts, self-graded |
| **Total** | **4,068** | | |

The four ranks are the Codex's own names for the Court of Master Sommeliers' ladder —
Introductory, Certified, Advanced and Master. The app teaches the structure by making you
climb it rather than by putting the certification body's branding on every screen.

Alongside the banks: 150 study chapters, 47 grape profiles, 12 hand-drawn SVG country
maps covering 98 regions, 12 classification pyramids, a 7-part service ritual, and a
curated video scriptorium.

## How it trains you

- **Short answer, not recognition.** Above Introductory the exam makes you *produce* the
  answer. Typed answers are graded with fuzzy matching, with a one-keystroke self-grade
  override when the grader is too narrow — and every override is logged, because a
  disagreement is a content bug worth fixing.
- **List-aware grading.** Enumerations are marked item by item — "5 of 9", with the missed
  crus named — instead of pass/fail on the whole answer.
- **Spaced repetition.** An SM-2 variant schedules a Daily Review across whichever level
  you're studying.
- **Exam-date study plan.** Enter your sitting date and the home screen prescribes the
  single highest-priority action: days out, cards due, coverage, and per-level pace.
- **The Oral Gauntlet.** The Master mock is fifty minutes of spoken prompts read aloud by
  the browser, with no text field and a mandatory self-grade before advancing.
- **Deductive tasting and service.** Blind flights and the service ritual checklist, because
  theory is only one of three sections.

## Running it locally

```bash
py serve.py 8632
```

Then open http://localhost:8632. Use `serve.py` rather than `python -m http.server` — it
sends `Cache-Control: no-cache` so edits show up on reload instead of hiding behind the
browser cache.

## Development

- `CLAUDE.md` — engineering detail and conventions
- `HANDOFF.md` — architecture, decisions not to reverse, and the ranked backlog
- `CONTENT-FIXES.md` — the verified content-correction backlog
- `.scripts/mint-ids.py` — mints stable per-question ids; additive, never regenerates

The app is ~20 classic scripts loaded in a fixed order into one shared scope, each layer
decorating the previous one. Deploying means bumping `?v=` on changed files in `index.html`
**and** bumping `CACHE` in `sw.js` — that cache string is the entire update mechanism.

## On accuracy

The Introductory and Certified banks were imported from established material. The Advanced
and Master banks were drafted with AI assistance and then fact-checked by an adversarial
audit, which confirmed and corrected 39 errors — clustered in quantified counts,
attribution, and near-miss technical relations.

Treat this as a drilling tool, not an authority. **Verify anything exam-critical against
GuildSomm or the CMS curriculum**, and use the error flag in every answer reveal to collect
corrections as you study.

## Licence

Personal study project. No affiliation with the Court of Master Sommeliers.
