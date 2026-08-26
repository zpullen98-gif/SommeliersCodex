# -*- coding: utf-8 -*-
"""Questions a student can score by retyping the question.

The defect: an accept list that grades words visible in the stem. A student who
copies part of the question back scores without knowing anything, and on a
short answer that is the whole examination.

    stem   "...Give the French cellar term for that running-off."
    accept ["ecoulage", "decuvage", "running off", ...]
    typed  "running off"                                    -> CORRECT

That question demanded the French term and accepted the English one it had just
printed. Two more of the same shape shipped in the same category: one naming
"the 500-litre format" that took "500 litre", and one ending "Name what the
stems have done" that took "stems have".

WHY THIS ONE IS MECHANICAL WHEN cross_question_giveaway WAS NOT. That check
tried to guess whether one question leaked another, and the README records what
it cost: 319 flags of 1,824 at a two-word threshold, 17%, and at three words it
missed both real cases. It was guessing at meaning. This is not guessing. It
takes every contiguous n-gram of the stem, grades it with the question's OWN
grader, and reports the ones that score. If typing part of the question is worth
a point, the question is broken - there is no judgement call and no threshold.

Measured over the finished corpus: 39 of 807 short answers, 4.8%. Low enough to
read and act on, which is the bar cross_question_giveaway failed.

NOT a build gate, for the same reason check-cross-category is not: it reads the
whole corpus rather than the category being built, and its flags are editorial
decisions rather than mechanical failures. Run it as a pass, like the others.

    py rewrite/check-stem-echo.py                # everything
    py rewrite/check-stem-echo.py r2_austria     # one or more categories
"""
import os
import sys
import importlib

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "categories"))

import lib  # noqa: E402

# The longest run of stem words anyone would plausibly type as an answer. Past
# this the "answer" is a sentence copied wholesale, which the shorter n-grams
# inside it have already flagged.
MAXN = 8


def stem_echoes(e):
    """Stem n-grams that grade correct against this question's own grader.

    Only maximal hits are kept: once "running off" scores, "that running off"
    and "for that running off" are the same defect seen three times, not three
    defects.
    """
    words = lib.engine_norm(e["q"]).split()
    hits, seen = [], set()
    for n in range(1, MAXN + 1):
        for i in range(len(words) - n + 1):
            g = " ".join(words[i:i + n])
            if g in seen:
                continue
            seen.add(g)
            try:
                if lib.match_sa(e, g):
                    hits.append(g)
            except Exception:
                pass
    if not hits:
        return []
    minimal = [h for h in hits if not any(h != o and o in h for o in hits)]
    return sorted(set(minimal or hits))


def categories(argv):
    if argv:
        return list(argv)
    return sorted(f[:-3] for f in os.listdir(os.path.join(HERE, "categories"))
                  if f.endswith(".py") and not f.startswith("_"))


def main(argv):
    mods = categories(argv)
    total, flagged = 0, []
    for m in mods:
        try:
            mod = importlib.import_module("categories." + m)
        except Exception as exc:
            print("  skip %s: %s" % (m, exc))
            continue
        for e in mod.BANK:
            # Matching and select questions carry a list answer and are graded
            # by gradeList, not matchSA, so the stem test does not apply.
            if lib.is_mc(e) or not isinstance(e.get("ans"), str):
                continue
            total += 1
            hits = stem_echoes(e)
            if hits:
                flagged.append((m, e, hits))

    print("")
    print("  stem echo   %d short answers across %d categories" % (total, len(mods)))
    print("  flagged     %d (%.1f%%) — a student typing these words scores"
          % (len(flagged), 100.0 * len(flagged) / max(1, total)))
    if not flagged:
        print("")
        print("  nothing to review.")
        return 0

    by_mod = {}
    for m, e, hits in flagged:
        by_mod.setdefault(m, []).append((e, hits))
    for m in sorted(by_mod):
        print("")
        print("  %s (%d)" % (m, len(by_mod[m])))
        for e, hits in by_mod[m]:
            print("    answer   %s" % e["ans"][:70])
            print("    scores   %s" % ", ".join(repr(h) for h in hits[:4]))
            print("    stem     %s" % e["q"][:96])
    print("")
    print("  Fixing one means removing the entry that grades the echo, then")
    print("  checking what died with it: that entry may be the only carrier of a")
    print("  real phrasing, in which case replace it with a longer form that")
    print("  cannot be truncated back to a stem word. Verify both directions.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
