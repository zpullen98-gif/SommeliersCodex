# -*- coding: utf-8 -*-
"""The eleven content checks, run against the PAID banks.

    py rewrite/check-paid.py                  gate: fails on anything not in the baseline
    py rewrite/check-paid.py --all            list every problem, baselined or not
    py rewrite/check-paid.py --new            only what is not yet reviewed
    py rewrite/check-paid.py --update-baseline   re-record the baseline (a review decision)

WHY THIS EXISTS SEPARATELY FROM build.py

Rank I and II are written as syllabus modules in rewrite/categories/ and built by
build.py, which runs eleven blocking checks on every run. Advanced and Master were
hand-authored as JSON and live directly in js/data-advanced.js and js/data-master.js,
so none of those checks had ever touched them. They found 931 problems the first
time they were pointed at the paid tier — including 616 questions whose own displayed
answer would not grade, since nothing had ever guaranteed what lib.SA() guarantees for
the free banks.

The obvious tidy-up is to port the paid banks into category modules and delete this
file. Do not, unless you first solve the ids. Free-tier ids are MINTED from the stem at
build time; paid ids are literals that have survived stem edits, so 239 of the 1,007 no
longer reproduce from mint(cat, q). Porting them through the minting pipeline would
silently re-key a quarter of the paid tier and orphan every stat, SRS record and
bookmark attached to it. A port must carry explicit ids or it is a data-loss event.

THE BASELINE, and what it is for

Not every flag is a defect, and this is not a case of quieting a checker. An accept
list only ever grades its own question, so a string shared between two questions is a
collision only if one of them is wrong — and in Champagne it usually is not. Avize is
both Selosse's village and a grand cru; Le Mesnil-sur-Oger is both Salon's village and
a grand cru. Ten cross_accept flags there are facts about Champagne.

So the reviewed verdicts live in paid_known.py, keyed by the problem text, and this
script fails only on problems that are NOT in it. Adding to the baseline is a review
decision: you are recording that a human read the flag and judged the alternative
worse. The governing rule when you judge is the one this project paid for — a false
reject is worse than a scoring leak, and a pass that closed 33 mild leaks with ex=True
broke 23 correct answers, several of them phrasings lifted from the questions' own
explanations.
"""

import io
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "categories"))

import lib  # noqa: E402

BANKS = [("adv", "js/data-advanced.js", "ADV_QUESTIONS"),
         ("master", "js/data-master.js", "MASTER_QUESTIONS")]

CHECKS = [
    ("self_grading", lib.self_grading_problems),
    ("cross_accept", lib.cross_accept_problems),
    ("duplicate_answers", lib.duplicate_answers),
    ("loose_tilde", lib.loose_tilde_problems),
    ("compound_answer", lib.compound_answer_problems),
    ("negation_probe", lib.negation_probe_problems),
    ("comparative_probe", lib.comparative_probe_problems),
    ("option_reference", lib.option_reference_problems),
    ("banned_template", lib.banned_template_problems),
]


def read_bank(rel, var):
    """Pull the array out of the JS with node, which is the only parser that agrees
    with the file in every edge case."""
    script = (
        "const fs=require('fs'),vm=require('vm');const c={};vm.createContext(c);"
        "vm.runInContext(fs.readFileSync(process.argv[1],'utf8'),c);"
        "process.stdout.write(JSON.stringify(c[process.argv[2]]||[]))"
    )
    p = subprocess.run(["node", "-e", script, os.path.join(REPO, rel), var],
                       capture_output=True)
    if p.returncode != 0:
        raise SystemExit("could not read %s: %s" % (rel, p.stderr.decode("utf-8", "replace")))
    return json.loads(p.stdout.decode("utf-8"))


def to_entries(rows):
    """Shape the JSON rows the way lib's checks expect. Matching and select questions
    have no lib equivalent and are skipped rather than guessed at."""
    out = []
    for r in rows:
        if r.get("mt") or r.get("sel"):
            continue
        e = {"block": r.get("cat", "?"), "q": r["q"], "exp": r.get("exp", ""),
             "_id": r.get("id"), "_cat": r.get("cat", "?")}
        if "opts" in r:
            e["opts"] = r["opts"]
            e["a"] = r.get("a", 0)
        else:
            e["sa"] = 1
            e["accept"] = list(r.get("accept") or [])
            e["ans"] = r.get("ans", "")
            if r.get("ex"):
                e["ex"] = 1
        out.append(e)
    return out


def collect():
    found = []
    for bank, rel, var in BANKS:
        entries = to_entries(read_bank(rel, var))
        for name, fn in CHECKS:
            for text in fn(entries):
                found.append((bank, name, text))
        for e in entries:
            if not lib.is_mc(e):
                for text in lib.accept_problems(e):
                    found.append((bank, "accept_list", text))
    return found


def load_baseline():
    path = os.path.join(HERE, "paid_known.py")
    if not os.path.exists(path):
        return set()
    ns = {}
    exec(compile(io.open(path, encoding="utf-8").read(), path, "exec"), ns)
    return set(tuple(x) for x in ns.get("KNOWN", []))


def main():
    argv = sys.argv[1:]
    found = collect()
    known = load_baseline()
    keys = set((b, c, t) for b, c, t in found)
    new = [f for f in found if f not in known]
    gone = [k for k in known if k not in keys]

    if "--update-baseline" in argv:
        path = os.path.join(HERE, "paid_known.py")
        body = ["# -*- coding: utf-8 -*-",
                '"""Reviewed verdicts on paid-bank check flags. See check-paid.py.',
                "",
                "Each entry is (bank, check, problem text) that a human read and judged not",
                "worth closing — usually because the close would cost a correct answer. This",
                "is a record of decisions, not a way to silence the checker: anything not",
                "listed here fails the gate.",
                '"""',
                "",
                "KNOWN = ["]
        for b, c, t in sorted(found):
            body.append("    (%r, %r, %r)," % (b, c, t))
        body += ["]", ""]
        io.open(path, "w", encoding="utf-8", newline="\n").write("\n".join(body))
        print("baseline written: %d problems recorded as reviewed" % len(found))
        return 0

    counts = {}
    for b, c, t in found:
        counts[c] = counts.get(c, 0) + 1
    print("paid banks: %d problems across %d checks" % (len(found), len(counts)))
    for c in sorted(counts, key=lambda x: -counts[x]):
        print("   %-18s %4d" % (c, counts[c]))
    print("   %-18s %4d reviewed and accepted in paid_known.py" % ("baselined", len(found) - len(new)))

    show = new if "--new" in argv else (found if "--all" in argv else new)
    if show:
        print("\n%s:" % ("every problem" if "--all" in argv else "NOT in the baseline"))
        for b, c, t in show[:80]:
            print("  [%s/%s] %s" % (b, c, t[:150]))
        if len(show) > 80:
            print("  ... and %d more" % (len(show) - 80))

    if gone:
        print("\n%d baselined problems no longer occur — they were fixed. Re-run with"
              " --update-baseline to drop them." % len(gone))

    if new:
        print("\n%d NEW problem(s). Fix them, or review and baseline them deliberately."
              % len(new))
        return 1
    print("\nno new problems.")
    return 0


sys.exit(main())
