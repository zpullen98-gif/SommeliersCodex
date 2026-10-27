# Brennan's training: reliable assessment and exact recovery

The owner's target is the CMS Certified Sommelier examination. Improvements to navigation must preserve the full theory, tasting vocabulary, wine identities, service reasoning and explanatory depth. A short guest description is a communication exercise, not a replacement for the complete technical reading. Do not reduce the course banks, change their passing rules, or automatically change the person's selected level.

## Release scope

Layers 50 and 51 follow the answer-reading layer. They address the assessment and recovery findings from the 27 October review. The four Brennan's rooms, 271 developed wines, 12 guided studies, eight pairing workshops, question identities and full answer readings remain available.

Spoken wine descriptions and guest responses now separate literal term matching from explicit self-assessment. The four original app criteria require factual precision, defensible reasoning, completeness and hospitable delivery. They are not official CMS scoring criteria. A term match cannot establish meaning, identify every valid paraphrase, judge physical service or certify exam readiness. Recognition questions continue to use their objective answer keys.

An assessment belongs to the exact answer, wine or guest, and selected duration. Typing, dictation and selection changes invalidate earlier feedback. Recording an attempt requires a current snapshot and all criteria to have been assessed. Existing history is preserved.

Recovery names the original missed skill and level. A targeted retest uses the original question key, rather than allowing a general wine-card recall mark to erase unrelated service or pairing mistakes. Missing or no-longer-resolvable prompts remain visible instead of silently disappearing from history.

## CMS benchmark and limits

Checked 27 October 2026:

- [CMS Americas Certified examination](https://www.mastersommeliers.org/certification/certification-levels/certified-sommelier-examination/): preparation must include theory, deductive tasting and service, rather than treating wine-list memorisation as a complete curriculum.
- [CMS Hospitality and Service Standards](https://www.mastersommeliers.org/wp-content/uploads/2023/12/CMS-Hospitality-Service-Standards.pdf): use the formal examination standards as a training benchmark while identifying Brennan's own approved procedures separately.

Self-assessed written or spoken practice is not an observed tasting or service performance. No app mark should claim CMS certification, examination approval or demonstrated physical service.

## Editorial companion

Canonical Brennan's producer and bottle explanations are maintained in WorldTable's house authoring pipeline. The companion correction addresses Agrapart's range, Chateau des Tours red blends, Pontet-Canet's blend wording and the distinction between a solera's history and the age of its contents. It preserves historical printed list data and uncertain grape information.

## Verification

Run the new final-chain browser gates:

```
node .scripts/check-training-assessment.cjs
node .scripts/check-training-recovery.cjs
node .scripts/check-answer-learning.cjs
node .scripts/check-house-flow.cjs
```

Use isolated browser contexts. Never test by overwriting the owner's saved progress. Verify both service colour schemes, narrow screens, keyboard use, imported text escaping, original level-prefixed keys and the separation of house history from course SRS.

The house-flow gate now waits for the printed-list data to finish loading before testing loaded content. This corrects a timing assertion; it does not skip the full-list check.

## Following releases

After this reliability release, connect existing resources into a resumable session while retaining independent study and reference access. Expand exact wine comparisons, observed comparative tasting and trainer-observed service. Do not make questions easier to achieve a visually cleaner interface. Preserve source uncertainty, actual vintage distinctions and explicit reasoning about guest preferences, budget, food and service.
