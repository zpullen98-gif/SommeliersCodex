# -*- coding: utf-8 -*-
"""The rewritten study chapters against the ones they replace.

    py rewrite/check-primer-similarity.py

This is the only place the imported chapters are read. Everyone writing a
chapter is blocked from opening js/data-primers-intro.js, for the same reason
the question writers were blocked from the question banks: reading the source
anchors the writing, produces a paraphrase, and destroys the point of the
exercise. The comparison happens here, afterwards, by machine.

Three tests, because one number hides too much:

  ratio       SequenceMatcher over the whole chapter. Catches wholesale reuse.
  n-gram      the longest run of consecutive shared words. Catches a sentence
              lifted intact out of an otherwise independent chapter, which the
              ratio dilutes to nothing on a long text.
  sentence    any sentence of six words or more appearing in both. This is the
              one that matters most for prose, and the questions pass had no
              equivalent because a stem is a single sentence already.

Shared vocabulary is expected and is not evidence of copying. There is one way
to say that Bordeaux's left bank is gravel. These numbers flag candidates for a
human to read; they clear nothing on their own.
"""

import io
import os
import re
import sys
from difflib import SequenceMatcher

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "primers"))

import primerlib  # noqa: E402

RATIO_FLAG = 0.60
NGRAM_FLAG = 8
SENT_WORDS = 6

SOURCE = os.path.join(REPO, "js", "data-primers-intro.js")
ENTRY = re.compile(r'\{g:"([^"]*)",\s*id:"([^"]*)",\s*t:"([^"]*)",\s*body:`(.*?)`\s*\}', re.S)


def words(s):
    return re.findall(r"[a-z0-9]+", s.lower())


def sentences(s):
    return [x.strip() for x in re.split(r"(?<=[.!?])\s+", s) if len(words(x)) >= SENT_WORDS]


def longest_run(a, b):
    m = SequenceMatcher(None, a, b, autojunk=False).find_longest_match(0, len(a), 0, len(b))
    return m.size, " ".join(a[m.a:m.a + m.size])


def load_source():
    if not os.path.exists(SOURCE):
        return {}
    text = io.open(SOURCE, encoding="utf-8").read()
    if "ORIGINAL WORK" in text.split("\n")[1:4][0] if text else False:
        pass
    out = {}
    for g, id_, t, body in ENTRY.findall(text):
        out[id_] = primerlib.plain({"body": body})
    return out


def main():
    import importlib
    import build_primers_shim  # noqa: F401  (never imported; kept for clarity)


if __name__ == "__main__":
    # Import the chapter modules the same way the builder does.
    sys.path.insert(0, os.path.join(HERE, "primers"))
    import importlib

    ORDER = ["foundations", "france", "italy", "spain", "iberia_central",
             "north_america", "southern", "cellar", "beyond_wine"]
    ours = []
    for modname in ORDER:
        try:
            mod = importlib.import_module(modname)
        except ImportError:
            continue
        ours += mod.CHAPTERS

    src = load_source()
    if not src:
        print("\n  no source chapters found; nothing to compare against.")
        sys.exit(0)

    print("")
    print("  comparing %d rewritten chapter(s) against %d source chapter(s)"
          % (len(ours), len(src)))

    flagged = []
    worst_ratio, worst_ngram = 0.0, 0
    shared_sentences = []

    for ch in ours:
        mine = primerlib.plain(ch)
        theirs = src.get(ch["id"])
        if theirs is None:
            continue
        a, b = words(mine), words(theirs)
        r = SequenceMatcher(None, mine, theirs, autojunk=False).ratio()
        n, gram = longest_run(a, b)
        worst_ratio = max(worst_ratio, r)
        worst_ngram = max(worst_ngram, n)

        mine_s = set(re.sub(r"\W+", " ", s.lower()).strip() for s in sentences(mine))
        theirs_s = set(re.sub(r"\W+", " ", s.lower()).strip() for s in sentences(theirs))
        both = mine_s & theirs_s
        if both:
            shared_sentences.append((ch["id"], sorted(both)[:3]))

        if r >= RATIO_FLAG or n >= NGRAM_FLAG or both:
            flagged.append((ch["id"], ch["t"], r, n, gram, len(both)))

    print("  max ratio        %.3f  (flag at %.2f)" % (worst_ratio, RATIO_FLAG))
    print("  longest shared   %d words  (flag at %d)" % (worst_ngram, NGRAM_FLAG))
    print("  shared sentences %d chapter(s)" % len(shared_sentences))

    if not flagged:
        print("")
        print("  nothing to review.")
        sys.exit(0)

    print("")
    for id_, t, r, n, gram, nsent in flagged:
        print("  %-12s %-32s ratio %.3f  run %d  sentences %d" % (id_, t, r, n, nsent))
        if n >= NGRAM_FLAG:
            print("      shared run: %s" % gram[:110])
    for id_, sents in shared_sentences:
        print("")
        print("  %s shares whole sentences:" % id_)
        for s in sents:
            print("      %s" % s[:110])
    print("")
    print("  Reframe by changing what the sentence DOES, not its words:")
    print("  teach the same fact from a different angle, or in a different order.")
    sys.exit(1)
