# -*- coding: utf-8 -*-
"""Did an edit make a correct answer wrong?

This exists because of a bad afternoon. A pass was run to close stem echoes -
accept lists that grade the question's own words back - and its brief said
ex=True was "frequently the right move". It is not. ex=True turns an OPEN class
of correct answers into a CLOSED enumerated list, and closing 33 mild leaks broke
23 correct answers, including phrasings taken verbatim from the questions' own
explanations.

    before   accept ["vintage variation", ...]      graded ANY answer containing it
    after    accept [... 14 exact strings ...], ex=True
    typed    "significant vintage variation"        -> WRONG

A false reject is the worst defect this app can ship. A student who scores by
copying the question gains a point they did not earn; a student who knows the
answer and is told they are wrong learns something false and stops trusting the
app. So this check exists to make the trade visible before it is committed.

THE TEST, and why it has no false positives. For every short answer it takes the
accept list AS IT STOOD AT THE REFERENCE COMMIT and grades every entry against
the CURRENT question. Those strings are the project's own written declaration
that each is a correct answer. If one of them no longer grades, the edit revoked
a correctness the project had already committed to - no heuristic, no threshold
and no judgement involved. It then does the same for the displayed answer and a
small battery of mechanical variants around it.

It also reports the other direction, more loosely: strings that were rejected at
the reference and grade now. Those are usually the intended effect of a
widening, so they are informational rather than failures.

    py rewrite/check-regression.py                    # against HEAD
    py rewrite/check-regression.py --ref HEAD~3       # against any commit
    py rewrite/check-regression.py r2_burgundy        # one or more categories
"""
import os
import re
import subprocess
import sys
import tempfile
import importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "categories"))

import lib  # noqa: E402


def at_ref(relpath, ref):
    """The file as it stood at `ref`, or None if it did not exist there."""
    p = subprocess.run(["git", "show", "%s:%s" % (ref, relpath)],
                       cwd=REPO, capture_output=True)
    if p.returncode != 0:
        return None
    return p.stdout.decode("utf-8", "replace")


def load_source(name, text):
    """Import a category from source text without touching the real module."""
    fd, path = tempfile.mkstemp(suffix=".py", prefix="ref_%s_" % name)
    os.close(fd)
    with open(path, "wb") as fh:
        fh.write(text.encode("utf-8"))
    try:
        spec = importlib.util.spec_from_file_location("ref_" + name, path)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        return mod
    finally:
        try:
            os.unlink(path)
        except OSError:
            pass


def variants(ans):
    """Mechanical phrasings a student plausibly types, built from the answer
    alone so nothing here is a guess about the subject matter."""
    a = ans.strip()
    low = a[0].lower() + a[1:] if a else a
    out = [a, low, "the " + low, "a " + low,
           "it is " + low, "that is " + low, "it is called " + low]
    # Only a single-word answer pluralises predictably. "Increases both" + s is
    # "Increases boths", which is not a phrasing any student types, and probing
    # it reports a difference nobody should act on.
    if " " not in a:
        if not a.endswith("s"):
            out.append(a + "s")
        elif len(a) > 2:
            out.append(a[:-1])
    return out


def pair_questions(old_bank, new_bank):
    """Match questions across the two versions.

    Ids are minted from the stem, so a reworded stem is a different id. Match on
    the stem first, then on the displayed answer, then give up: an unmatched
    question is reported rather than silently skipped, because a silent skip is
    exactly how a regression hides.
    """
    new_by_stem = {}
    new_by_ans = {}
    for e in new_bank:
        new_by_stem.setdefault(e["q"], []).append(e)
        if isinstance(e.get("ans"), str):
            new_by_ans.setdefault(e["ans"], []).append(e)
    pairs, orphans = [], []
    for o in old_bank:
        if lib.is_mc(o) or not isinstance(o.get("ans"), str):
            continue
        hit = None
        if new_by_stem.get(o["q"]):
            hit = new_by_stem[o["q"]].pop(0)
        elif new_by_ans.get(o["ans"]):
            hit = new_by_ans[o["ans"]].pop(0)
        if hit is None:
            orphans.append(o)
        else:
            pairs.append((o, hit))
    return pairs, orphans


def main(argv):
    ref = "HEAD"
    if "--ref" in argv:
        i = argv.index("--ref")
        ref = argv[i + 1]
        argv = argv[:i] + argv[i + 2:]
    mods = argv or sorted(
        f[:-3] for f in os.listdir(os.path.join(HERE, "categories"))
        if f.endswith(".py") and not f.startswith("_"))

    total_probes = 0
    regressions = []
    widenings = 0
    orphaned = []
    for name in mods:
        rel = "rewrite/categories/%s.py" % name
        text = at_ref(rel, ref)
        if text is None:
            continue                      # new since the reference: nothing to lose
        try:
            old = load_source(name, text)
            new = importlib.import_module("categories." + name)
        except Exception as exc:
            print("  skip %s: %s" % (name, exc))
            continue

        pairs, orphans = pair_questions(old.BANK, new.BANK)
        for o in orphans:
            orphaned.append((name, o["ans"]))
        for o, n in pairs:
            probes = [a[1:] if a.startswith("~") else a
                      for a in (o.get("accept") or [])]
            probes += variants(o["ans"])
            seen = set()
            for p in probes:
                if not p or p in seen:
                    continue
                seen.add(p)
                total_probes += 1
                was, now = lib.match_sa(o, p), lib.match_sa(n, p)
                if was and not now:
                    regressions.append((name, n["ans"], p))
                elif now and not was:
                    widenings += 1

    print("")
    print("  regression   %d probes across %d categories, against %s"
          % (total_probes, len(mods), ref))
    print("  lost         %d answers that graded at %s and do not now"
          % (len(regressions), ref))
    print("  gained       %d that did not grade at %s and do now" % (widenings, ref))
    if orphaned:
        print("  unmatched    %d question(s) whose stem AND answer both changed"
              % len(orphaned))
        for name, ans in orphaned[:12]:
            print("                 %s: %s" % (name, ans[:60]))

    if not regressions:
        print("")
        print("  no correct answer was made wrong.")
        return 0

    by_mod = {}
    for name, ans, probe in regressions:
        by_mod.setdefault(name, {}).setdefault(ans, []).append(probe)
    for name in sorted(by_mod):
        print("")
        print("  %s" % name)
        for ans in sorted(by_mod[name]):
            lost = by_mod[name][ans]
            print("    answer   %s" % ans[:70])
            print("    lost     %s%s"
                  % (", ".join(repr(x) for x in lost[:5]),
                     "  (+%d more)" % (len(lost) - 5) if len(lost) > 5 else ""))
    print("")
    print("  Each string above was on the accept list at %s, or is the displayed" % ref)
    print("  answer itself. The project already called it correct. If the edit that")
    print("  revoked it was closing a real defect, restore the phrasing with a")
    print("  multi-word '~' entry: the tilde branch of matchSA is tested BEFORE the")
    print("  ex guard, so it keeps whole-phrase containment even under ex=True.")
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
