"""Shared machinery for the Rank I and II rewrite.

Category data lives in rewrite/categories/<name>.py as SYLLABUS + BANK.
The driver is rewrite/build.py; verification is rewrite/check-similarity.py.

Everything here is deterministic: same input, same ids, same option order, so a
rebuild is a no-op diff and a stem edit touches only its own question.
"""

import io
import json
import os
import re
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))

# A stem opener used more than this share of a bank reads as a template rut,
# regardless of any source. The pilot's finding was that independent authorship
# does not by itself produce varied constructions.
OPENER_SHARE_LIMIT = 0.15


def Q(block, q, opts, a, exp):
    return {"block": block, "q": q, "opts": opts, "a": a, "exp": exp}


# ---------------------------------------------------------------- minting ---
def fnv1a64(s):
    h = 0xCBF29CE484222325
    for b in s.encode("utf-8"):
        h ^= b
        h = (h * 0x100000001B3) & 0xFFFFFFFFFFFFFFFF
    return h


def b36(n, width):
    digits = "0123456789abcdefghijklmnopqrstuvwxyz"
    out = ""
    while n:
        out = digits[n % 36] + out
        n //= 36
    return out.rjust(width, "0")[-width:]


def mint(cat, q, prefix="i"):
    """Same scheme as .scripts/mint-ids.py, so these are the real minter's ids."""
    return prefix + "-" + b36(fnv1a64(json.dumps([cat, q])), 8)


def shuffle(opts, a, q):
    """Bake in the option order, seeded by the stem.

    Written correct-answer-first is natural and gives a spread a student can
    game without knowing anything. Ids are minted from [cat, q] and never from
    options, so shuffling cannot move an id.
    """
    h = fnv1a64("shuffle:" + q)
    idx = list(range(len(opts)))
    for i in range(len(idx) - 1, 0, -1):
        h = (h * 6364136223846793005 + 1442695040888963407) & 0xFFFFFFFFFFFFFFFF
        j = (h >> 33) % (i + 1)
        idx[i], idx[j] = idx[j], idx[i]
    return [opts[k] for k in idx], idx.index(a)


def norm(s):
    return re.sub(r"[^a-z0-9 ]+", " ", s.lower()).split()


# ----------------------------------------------------------------- checks ---
def structural(bank, syllabus, cat, prefix="i"):
    """Shape, coverage and answer-spread checks. Returns (problems, stats)."""
    problems = []

    counts = Counter(e["block"] for e in bank)
    for block, target in syllabus:
        if counts[block] != target:
            problems.append("block %r: %d written, %d targeted"
                            % (block, counts[block], target))
    for block in counts:
        if block not in {b for b, _ in syllabus}:
            problems.append("block %r is not in the syllabus" % block)

    seen_q, seen_id = set(), {}
    for e in bank:
        stem = e["q"][:60]
        if len(e["opts"]) != 4:
            problems.append("not 4 options: %s" % stem)
        if not (0 <= e["a"] < len(e["opts"])):
            problems.append("answer index out of range: %s" % stem)
        if len(set(e["opts"])) != len(e["opts"]):
            problems.append("duplicate option text: %s" % stem)
        if e["q"] in seen_q:
            problems.append("duplicate stem: %s" % stem)
        seen_q.add(e["q"])
        i = mint(cat, e["q"], prefix)
        if i in seen_id:
            problems.append("id collision %s" % i)
        seen_id[i] = e["q"]

    spread = Counter(e["a"] for e in bank)
    # With the shuffle baked in, a position holding more than half the answers
    # means the permutation is not doing its job.
    for pos, n in spread.items():
        if n > len(bank) * 0.5:
            problems.append("answer position %d holds %d of %d" % (pos, n, len(bank)))

    return problems, {"spread": dict(sorted(spread.items())), "ids": len(seen_id)}


def template_variety(bank):
    """Flag stem-template ruts, the pilot's actual finding.

    Independent authorship removed content dependence but not construction
    dependence: 'X is best described as' is simply the natural way to write a
    definition question, and two authors reach for it independently. This looks
    at the bank on its own terms, with no reference to any source.
    """
    openers = Counter(" ".join(norm(e["q"])[:3]) for e in bank)
    limit = max(2, int(len(bank) * OPENER_SHARE_LIMIT))
    problems = [
        "stem opener %r used %d times (limit %d)" % (op, n, limit)
        for op, n in openers.most_common() if n > limit
    ]
    return problems, openers


# ------------------------------------------------------------------- emit ---
def emit(bank, cat, slug, prefix="i", varname=None):
    varname = varname or ("REWRITE_" + slug.upper().replace("-", "_"))
    out = io.StringIO()
    out.write("/* ============ Rank I rewrite: %s ============\n" % cat)
    out.write("   Written independently from the syllabus in rewrite/categories/, NOT from\n")
    out.write("   the imported bank it replaces. Generated file - edit the category module,\n")
    out.write("   not this. Shape matches data-intro.js; ids use the same FNV-1a scheme as\n")
    out.write("   .scripts/mint-ids.py. ============ */\n")
    out.write("var %s=[\n" % varname)
    rows = [json.dumps({
        "id": mint(cat, e["q"], prefix), "cat": cat, "q": e["q"],
        "opts": e["opts"], "a": e["a"], "exp": e["exp"],
    }, ensure_ascii=False) for e in bank]
    out.write(",\n".join(rows))
    out.write("\n];\n")
    text = out.getvalue()
    dest = os.path.join(HERE, "pilot-%s.js" % slug)
    io.open(dest, "w", encoding="utf-8", newline="\n").write(text)
    return dest, len(text)
