# -*- coding: utf-8 -*-
"""Find questions duplicated ACROSS rewritten categories.

    py rewrite/check-cross-category.py

Every other gate in this project looks at one category at a time.
lib.duplicate_answers compares a bank against itself; check-similarity.py
compares a bank against the imported source. Nothing has ever compared the
rewritten categories against EACH OTHER, and the README predicted the gap:
"a question written for Burgundy may land near one filed under Classifications".

It is real. At 25 categories this found a Prosecco grape question written twice,
a Prosecco tank-fermentation question written twice, and the German Pradikat
ladder asked in identical form in two categories. A student meets the same item
twice under two different headings, and every existing check reported clean.

Two tests, because one of them alone misses half of it:

  same-answer   Two questions whose ANSWERS agree and whose stems are asking
                the same thing. This is the one that matters. It catches the
                pair whose wording diverged - "in a sealed pressure tank"
                against "in a sealed pressurised tank" - which a stem-text
                comparison scores far too low to flag.
  near-stem     Two stems that are textually close regardless of answer.

Answers are compared on their normalised token sets, so inflection and filler
do not hide a match, and short answers are excluded: two questions may
legitimately share a one or two word answer while testing different things.
That was lib.duplicate_answers' finding and it applies here too.

Read-only. It prints candidates for a human to read and clears nothing on
its own.

REVIEWED below records a human verdict on a pair already read, the way a
module's ACCEPTED records one for check-similarity, so a reviewed pair is not
re-litigated on every run. It is keyed by BOTH question ids, and an id is minted
from the stem, so rewording either stem puts the pair back in front of a reader.
A reviewed pair is still printed, with its verdict; only a pair nobody has read
fails the run. Adding to it is a review decision, never a way to quiet the
checker: read both questions whole and write why they set different tasks.
"""

import io
import json
import os
import sys

from difflib import SequenceMatcher

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "categories"))

import lib  # noqa: E402

ANS_STRONG = 0.80      # answers this alike, and substantial -> flag on the answer alone
ANS_STRONG_WORDS = 3   # ...where substantial means this many words
ANS_JACCARD = 0.60     # answers merely similar -> only flag if the stems agree too
ANS_MIN_WORDS = 2      # shorter answers are legitimately shared
STEM_SAME_ANS = 0.40   # with a similar answer, stems this close -> flag
STEM_ALONE = 0.72      # regardless of answer, stems this close -> flag
NGRAM_ALONE = 7        # or a shared consecutive run this long

# Pairs a human has read and judged to set different tasks (review edition,
# 11 October 2026). Keyed by both ids; the verdict says why.
REVIEWED = {
    frozenset(("i-za5ja7ux", "i-cjolpyjv")):
        "Chateauneuf-du-Pape answers both, but one asks for the appellation of thirteen grapes "
        "and the other for the galets: two different facts about one place.",
    frozenset(("i-kg5kw4ho", "c-3i8ky62n")):
        "Regionale asks which categories became law in 1984; Village asks which stand outside "
        "the 2021 sweetness-labelling rule. Same two names, two different rules.",
    frozenset(("i-06gzb6jh", "i-e02yb2ia")):
        "One asks for Margaret River's signature white blend, the other for the base of white "
        "Bordeaux: the Australian question tests the copy, the Bordeaux one the original.",
    frozenset(("i-7irscmb9", "c-erek37i5")):
        "Regionale names the wine from dried Garganega; Village asks for Veneto's first DOCG of "
        "1998. The second tests the classification history, not the method.",
    frozenset(("i-nny2fmxc", "i-76odp6jd")):
        "Zibibbo on Pantelleria against the DNA parent of Torrontes: the same grape reached "
        "from two unrelated facts.",
    frozenset(("i-xmvm1i97", "i-osfs6v9y")):
        "Loire tuffeau cellars against Bairrada's sparkling with leitao: one asks what a cellar "
        "suits, the other what a dish is paired with.",
    frozenset(("i-0nuz9341", "i-oa42up64")):
        "Two countries' ladders: the Austrian base tier is Wein and the German Deutscher Wein, "
        "and telling the two systems apart is the point of setting both.",
    frozenset(("i-55p91ojs", "c-0tdbku2z")):
        "Regionale asks which commune has an appellation of its own (Barsac); Village asks "
        "for the three other communes. The shared run is the appellation's own definition.",
    frozenset(("i-fqj9q1nw", "c-mq61v321")):
        "Godello in Valdeorras against Schioppettino in Friuli: the shared run is a common "
        "piece of history, the grapes and the places differ.",
    frozenset(("i-67129uf8", "c-nb7s3xai")):
        "Dornfelder bred for colour against Corvinone proved distinct from Corvina: the "
        "shared run is a stock phrase about grape identity.",
}


def load(path):
    """Pull the emitted question objects out of a pilot-*.js bank."""
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
            break
    return out


def longest_run(a, b):
    best, hits = 0, set()
    for n in range(1, min(len(a), len(b)) + 1):
        ga = {" ".join(a[i:i + n]) for i in range(len(a) - n + 1)}
        gb = {" ".join(b[i:i + n]) for i in range(len(b) - n + 1)}
        hit = ga & gb
        if not hit:
            break
        best, hits = n, hit
    return best, (sorted(hits, key=len)[-1] if hits else "")


def answer_of(q):
    if "opts" in q:
        return q["opts"][q.get("a", 0)]
    return q.get("ans", "")


def main():
    rows = []
    for f in sorted(os.listdir(HERE)):
        if f.startswith("pilot-") and f.endswith(".js"):
            slug = f[6:-3]
            for q in load(os.path.join(HERE, f)):
                rows.append((slug, q, lib.norm(q.get("q", "")),
                             set(lib.norm(answer_of(q)))))

    cats = sorted({r[0] for r in rows})
    print("cross-category duplication")
    print("  %d questions across %d rewritten categories\n" % (len(rows), len(cats)))

    words = [set(r[2]) for r in rows]        # stem word sets, for the ngram bound

    same_ans, near_stem = [], []
    for i in range(len(rows)):
        si, qi, ni, ai = rows[i]
        wi = words[i]
        for j in range(i + 1, len(rows)):
            sj, qj, nj, aj = rows[j]
            if si == sj:
                continue                      # within a category is already checked
            # -- test one: the answers agree
            #
            # Two thresholds, because one alone leaks. A substantial answer that
            # matches almost exactly is worth reading whatever the stems look
            # like: the Prosecco tank pair scored 1.00 on meaning and only 0.30
            # on stem text, because one author wrote "in a sealed pressure tank"
            # and the other "in a sealed pressurised tank". A merely similar
            # answer needs the stems to agree as well, or every question sharing
            # a region name flags.
            if len(ai) >= ANS_MIN_WORDS and len(aj) >= ANS_MIN_WORDS:
                union = ai | aj
                jac = len(ai & aj) / float(len(union)) if union else 0.0
                substantial = min(len(ai), len(aj)) >= ANS_STRONG_WORDS
                if jac >= ANS_JACCARD:
                    r = SequenceMatcher(None, ni, nj).ratio()
                    if (jac >= ANS_STRONG and substantial) or r >= STEM_SAME_ANS:
                        same_ans.append((jac, r, si, qi, sj, qj))
                        continue
            # -- test two: the stems alone
            #
            # Both of these are expensive and almost every pair fails both, so
            # each gets an exact cheap upper bound first. At 2,130 questions the
            # unguarded loop ran SequenceMatcher.ratio() and longest_run() over
            # 2.27 million pairs and took more than two minutes; the corpus ends
            # at 3,061, which is 4.7 million. A check nobody waits for is a check
            # nobody runs.
            #
            # A shared run of N consecutive words needs at least N words in
            # common, so the set intersection bounds it exactly. quick_ratio is
            # difflib's own multiset upper bound on ratio. Neither can hide a
            # pair that the full test would have flagged.
            common = len(wi & words[j])
            need_ngram = common >= NGRAM_ALONE
            sm = SequenceMatcher(None, ni, nj)
            need_ratio = sm.quick_ratio() >= STEM_ALONE
            if not (need_ngram or need_ratio):
                continue
            r = sm.ratio() if need_ratio else 0.0
            n, gram = longest_run(ni, nj) if need_ngram else (0, "")
            if r >= STEM_ALONE or n >= NGRAM_ALONE:
                if not need_ratio:
                    r = sm.ratio()   # only for the few we actually print, so the
                                     # reported ratio is the real one and not 0.0
                near_stem.append((r, n, gram, si, qi, sj, qj))

    same_ans.sort(reverse=True, key=lambda t: (t[0], t[1]))
    near_stem.sort(reverse=True)

    def verdict(qa, qb):
        return REVIEWED.get(frozenset((qa.get("id"), qb.get("id"))))
    reviewed = [(t[3], t[5]) for t in same_ans if verdict(t[3], t[5])]
    reviewed += [(t[4], t[6]) for t in near_stem if verdict(t[4], t[6])]
    same_ans = [t for t in same_ans if not verdict(t[3], t[5])]
    near_stem = [t for t in near_stem if not verdict(t[4], t[6])]

    print("=" * 78)
    print("SAME ANSWER, SAME QUESTION  (answer overlap >= %.2f, stem ratio >= %.2f)"
          % (ANS_JACCARD, STEM_SAME_ANS))
    print("=" * 78)
    for jac, r, si, qi, sj, qj in same_ans:
        print("\n  answer overlap %.2f   stem ratio %.3f" % (jac, r))
        print("    %-30s %s" % (si, qi.get("q", "")[:100]))
        print("       -> %s" % answer_of(qi)[:90])
        print("    %-30s %s" % (sj, qj.get("q", "")[:100]))
        print("       -> %s" % answer_of(qj)[:90])
    if not same_ans:
        print("none.")

    print()
    print("=" * 78)
    print("NEAR-IDENTICAL STEMS  (ratio >= %.2f or shared run >= %d)"
          % (STEM_ALONE, NGRAM_ALONE))
    print("=" * 78)
    for r, n, gram, si, qi, sj, qj in near_stem:
        print("\n  ratio %.3f  run %d  shared: %r" % (r, n, gram))
        print("    %-30s %s" % (si, qi.get("q", "")[:100]))
        print("    %-30s %s" % (sj, qj.get("q", "")[:100]))
    if not near_stem:
        print("none.")

    if reviewed:
        print()
        print("=" * 78)
        print("REVIEWED  (a human verdict on file, keyed by both ids)")
        print("=" * 78)
        for qa, qb in reviewed:
            print("\n  %s  %s" % (qa.get("id"), qa.get("q", "")[:60]))
            print("  %s  %s" % (qb.get("id"), qb.get("q", "")[:60]))
            print("     verdict: %s" % verdict(qa, qb))
    stale = len(REVIEWED) - len(reviewed)
    if stale > 0:
        print("\nnote: %d reviewed pair(s) no longer flag (a stem moved, or the pair cleared)." % stale)

    total = len(same_ans) + len(near_stem)
    print("\n%d candidate pair(s) for review, %d reviewed." % (total, len(reviewed)))
    print("Shared topic vocabulary is expected; two questions setting the same")
    print("TASK are not. Read each pair and reframe one side, or accept it.")
    sys.exit(1 if total else 0)


main()
