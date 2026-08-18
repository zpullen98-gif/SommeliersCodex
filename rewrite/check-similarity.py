"""Verify a rewritten category is independent of the bank it replaces.

    py rewrite/check-similarity.py bordeaux
    py rewrite/check-similarity.py --all

Run AFTER build.py. This is the first and only point at which the imported
source is read: generate from the syllabus, then verify. Reading the source
first anchors the writing and produces paraphrases, which is the failure mode
the exercise exists to avoid.

Multi-test, per the compliance framework, rather than one score: exact stem,
longest shared word run, and sequence ratio. Shared domain vocabulary is
expected and is not evidence of copying, so a category module may declare
ACCEPTED phrases that a human has already reviewed and cleared.
"""

import importlib
import io
import json
import os
import re
import sys
from difflib import SequenceMatcher

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "categories"))

SEQ_REVIEW = 0.60      # sequence ratio at or above this -> a human reads it
NGRAM_REVIEW = 6       # shared run of this many words or more -> a human reads it


def load_objects(path, first_key='"id"'):
    s = io.open(path, encoding="utf-8").read()
    body = s[s.index("=["):]
    out, depth, start, instr, esc = [], 0, None, False, False
    for i, ch in enumerate(body):
        if esc:
            esc = False
            continue
        if ch == "\\":
            esc = True
            continue
        if ch == '"':
            instr = not instr
            continue
        if instr:
            continue
        if ch == "{":
            if depth == 0:
                start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and start is not None:
                try:
                    out.append(json.loads(body[start:i + 1]))
                except Exception:
                    pass
                start = None
        elif ch == "]" and depth == 0:
            # Stop at the end of the first array. data-intro.js also holds the
            # grape and compendia arrays; reading into them inflates the bank
            # count and misstates what is being compared against.
            break
    return out


def norm(s):
    return re.sub(r"[^a-z0-9 ]+", " ", s.lower()).split()


def longest_shared_ngram(a, b):
    best, hits = 0, set()
    for n in range(1, min(len(a), len(b)) + 1):
        ga = {" ".join(a[i:i + n]) for i in range(len(a) - n + 1)}
        gb = {" ".join(b[i:i + n]) for i in range(len(b) - n + 1)}
        hit = ga & gb
        if not hit:
            break
        best, hits = n, hit
    return best, (sorted(hits, key=len)[-1] if hits else "")


def check(name):
    mod = importlib.import_module("categories.%s" % name)
    accepted = {a.lower() for a in getattr(mod, "ACCEPTED", [])}

    source = getattr(mod, "SOURCE", "data-intro.js")
    ours = load_objects(os.path.join(HERE, "pilot-%s.js" % mod.SLUG))
    src_all = load_objects(os.path.join(HERE, "..", "js", source))
    src_cat = [q for q in src_all if q.get("cat") == mod.CAT]

    print("%s — similarity vs %s" % (mod.CAT, source))
    print("  rewritten            %d" % len(ours))
    print("  imported (whole)     %d" % len(src_all))
    print("  imported (this cat)  %d" % len(src_cat))

    src_norm = [(q.get("q", ""), norm(q.get("q", ""))) for q in src_all]
    src_stems = {q.get("q", "").strip().lower() for q in src_all}

    exact, rows = [], []
    for p in ours:
        pq = p.get("q", "")
        pn = norm(pq)
        if pq.strip().lower() in src_stems:
            exact.append(pq)
        best = (0.0, 0, "", "")
        for sq, sn in src_norm:
            r = SequenceMatcher(None, pn, sn).ratio()
            if r > best[0]:
                n, gram = longest_shared_ngram(pn, sn)
                best = (r, n, gram, sq)
        rows.append((best[0], best[1], best[2], pq, best[3]))
    rows.sort(reverse=True, key=lambda r: r[0])

    ratios = [r[0] for r in rows]
    ngrams = [r[1] for r in rows]
    print("  exact stem matches   %d" % len(exact))
    print("  sequence ratio       max %.3f  mean %.3f" % (max(ratios), sum(ratios) / len(ratios)))
    print("  longest shared run   max %d  mean %.1f" % (max(ngrams), sum(ngrams) / float(len(ngrams))))

    flagged = [r for r in rows if r[0] >= SEQ_REVIEW or r[1] >= NGRAM_REVIEW]
    new = [r for r in flagged if r[2].lower() not in accepted]
    cleared = len(flagged) - len(new)
    print("  flagged              %d (%d already reviewed and accepted)" % (len(flagged), cleared))

    for r in new:
        print("   ! ratio %.3f  run %d  shared: %r" % (r[0], r[1], r[2]))
        print("     ours:   %s" % r[3][:110])
        print("     source: %s" % r[4][:110])
    if not new:
        print("  nothing new to review.")
    print("  top three regardless of threshold:")
    for r in rows[:3]:
        print("     %.3f  run %d  %r" % (r[0], r[1], r[2]))
    print()
    return exact, new


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    if "--all" in sys.argv:
        d = os.path.join(HERE, "categories")
        args = sorted(f[:-3] for f in os.listdir(d)
                      if f.endswith(".py") and not f.startswith("_"))
    if not args:
        sys.exit(__doc__)
    bad = False
    for a in args:
        exact, new = check(a)
        bad = bad or bool(exact or new)
    print("NOTE: shared domain vocabulary is expected and is not evidence of")
    print("copying. These numbers flag candidates for a human to read; they")
    print("clear nothing on their own.")
    sys.exit(1 if bad else 0)


main()
