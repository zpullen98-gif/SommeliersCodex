"""Verify the rewrite pilot is independent of the bank it replaces.

Run AFTER build-pilot.py. This is the first and only point at which the imported
source is read: generate from the syllabus, then verify independence. Reading
the source first would anchor the writing and produce paraphrases, which is the
failure mode the whole exercise exists to avoid.

Implements the multi-test approach the compliance framework asks for rather than
one score: exact stem match, longest shared word n-gram, sequence ratio, and
token overlap. It also applies the framework's false-positive rule — shared
domain vocabulary is expected and is not evidence of copying, so a shared
n-gram is only interesting when it is long or distinctive.

    py rewrite/check-similarity.py
"""

import io
import json
import os
import re
import sys
from difflib import SequenceMatcher

HERE = os.path.dirname(os.path.abspath(__file__))
JS = os.path.join(HERE, "..", "js")
CAT = "Viticulture & Winemaking"

# Thresholds. Deliberately conservative: these flag for human review, they do
# not clear anything.
SEQ_REVIEW = 0.60      # sequence ratio at or above this -> read it yourself
NGRAM_REVIEW = 6       # shared run of this many words or more -> read it


def load_objects(path, varname):
    s = io.open(path, encoding="utf-8").read()
    body = s[s.index(varname):]
    body = body[body.index("["):]
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
            break
    return out


def norm(s):
    return re.sub(r"[^a-z0-9 ]+", " ", s.lower()).split()


def longest_shared_ngram(a, b):
    """Longest run of consecutive words appearing in both."""
    sa, best = set(), 0
    for n in range(1, min(len(a), len(b)) + 1):
        grams_a = {" ".join(a[i:i + n]) for i in range(len(a) - n + 1)}
        grams_b = {" ".join(b[i:i + n]) for i in range(len(b) - n + 1)}
        hit = grams_a & grams_b
        if not hit:
            break
        best, sa = n, hit
    return best, (sorted(sa, key=len)[-1] if sa else "")


def main():
    pilot = load_objects(os.path.join(HERE, "pilot-viticulture-winemaking.js"),
                         "PILOT_INTRO_QUESTIONS")
    src_all = load_objects(os.path.join(JS, "data-intro.js"), "INTRO_QUESTIONS")
    src_cat = [q for q in src_all if q.get("cat") == CAT]

    print("Similarity check — Rank I rewrite pilot")
    print("  pilot questions:            %d" % len(pilot))
    print("  imported bank (whole):      %d" % len(src_all))
    print("  imported bank (%s): %d" % (CAT, len(src_cat)))
    if not pilot or not src_all:
        sys.exit("could not parse one of the banks")

    src_norm = [(q, norm(q.get("q", ""))) for q in src_all]
    src_stems = {q.get("q", "").strip().lower() for q in src_all}

    exact = []
    rows = []
    for p in pilot:
        pq = p.get("q", "")
        pn = norm(pq)
        if pq.strip().lower() in src_stems:
            exact.append(pq)
        best = (0.0, 0, "", "")
        for sq, sn in src_norm:
            ratio = SequenceMatcher(None, pn, sn).ratio()
            if ratio > best[0]:
                n, gram = longest_shared_ngram(pn, sn)
                best = (ratio, n, gram, sq.get("q", ""))
        rows.append((best[0], best[1], best[2], pq, best[3]))

    rows.sort(reverse=True, key=lambda r: r[0])

    print("\n  EXACT STEM MATCHES: %d" % len(exact))
    for e in exact:
        print("   !! %s" % e[:100])

    ratios = [r[0] for r in rows]
    ngrams = [r[1] for r in rows]
    print("\n  sequence ratio vs nearest source question:")
    print("     max %.3f   mean %.3f   min %.3f" %
          (max(ratios), sum(ratios) / len(ratios), min(ratios)))
    print("  longest shared word run:")
    print("     max %d   mean %.1f" % (max(ngrams), sum(ngrams) / float(len(ngrams))))

    flagged = [r for r in rows if r[0] >= SEQ_REVIEW or r[1] >= NGRAM_REVIEW]
    print("\n  FLAGGED FOR HUMAN REVIEW (ratio >= %.2f or shared run >= %d words): %d"
          % (SEQ_REVIEW, NGRAM_REVIEW, len(flagged)))
    for r in flagged:
        print("   - ratio %.3f  run %d  shared: %r" % (r[0], r[1], r[2]))
        print("     pilot:  %s" % r[3][:110])
        print("     source: %s" % (r[4] or "")[:110])

    print("\n  closest five regardless of threshold (context for the numbers):")
    for r in rows[:5]:
        print("   - ratio %.3f  run %d  shared: %r" % (r[0], r[1], r[2]))
        print("     pilot:  %s" % r[3][:110])
        print("     source: %s" % (r[4] or "")[:110])

    print("\n  NOTE: shared domain vocabulary is expected and is not evidence of")
    print("  copying. These numbers flag candidates for a human to read; they")
    print("  clear nothing on their own.")

    sys.exit(1 if (exact or flagged) else 0)


main()
