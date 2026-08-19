/* ============ Codex XIII: the displayed answer must always grade ============
   A student finishes a question, reads the model answer on the review screen,
   meets it again a week later, types back exactly what the app showed them —
   and is marked wrong. Measured in the real engine across the shipped banks:
   8 of 792 typed short answers in the imported Squire bank, 214 of 475 in
   Knight, 378 of 445 in Ruler. Knight and Ruler are the paid tier.

   The cause is not the matcher. `accept` was written as a handful of keywords
   while `ans` was written as a sentence, and nothing ever asserted the two
   agreed. The displayed answer to the Tastevinage question is "Selection in
   blind tasting by the Confrérie des Chevaliers du Tastevin"; its accept list
   holds three short phrases, none of them that sentence.

   rewrite/lib.py `SA()` guarantees this invariant at construction for every
   rewritten question, which is why the rewrite scores 0. This layer applies the
   same guarantee to the banks that already shipped.

   IT IS A SHORT-CIRCUIT, NOT AN ACCEPT ENTRY, and that distinction is the whole
   design. Prepending `ans` to `accept` also fixes the count, and was tried
   first: it took self-grading failures to zero and pushed negation accepts from
   45 to 297. A long prose answer very often contains one of NEG_RE's words —
   "rather", "no", "without" — and `negatedAgainst` deliberately stands down
   when the accepted phrase carries a negation of its own, so every such entry
   became reachable by "not <the whole answer>" through the containment branch.
   That is the exact false-accept class core.js and codex9.js were each fixed
   for. Exact equality cannot smuggle in a negation, so this route adds no
   containment surface at all.

   Only `matchSA` is wrapped. Questions graded by codex9's list path go through
   `gradeList`, which already grades every one of its own answers correctly. */

var SA_EXACT_ANSWER_GUARD = true;

(function () {
  var inner = matchSA;

  matchSA = function (q, ans) {
    if (q && typeof q.ans === 'string' && q.ans) {
      var a = norm(ans), m = norm(q.ans);
      if (a && m && a === m) return true;
    }
    return inner(q, ans);
  };
})();
