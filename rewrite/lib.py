"""Shared machinery for the Rank I and II rewrite.

Category data lives in rewrite/categories/<name>.py as CAT, SLUG, SYLLABUS, BANK
and optionally ACCEPTED, SOURCE, PREFIX, RANK. The driver is rewrite/build.py;
verification is rewrite/check-similarity.py.

Everything here is deterministic: same input, same ids, same option order, so a
rebuild is a no-op diff and a stem edit touches only its own question.
"""

import io
import json
import os
import re
import unicodedata
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))

# A stem opener used more than this share of a bank reads as a template rut,
# regardless of any source. The pilot's finding was that independent authorship
# does not by itself produce varied constructions.
OPENER_SHARE_LIMIT = 0.15

# core.js norm() strips these before matching, so an accept entry made only of
# them can never match anything.
ENGINE_STOPWORDS = {"the", "a", "an", "chateau", "domaine", "de", "du", "des", "la", "le"}


def Q(block, q, opts, a, exp):
    """Multiple choice."""
    return {"block": block, "q": q, "opts": opts, "a": a, "exp": exp}


def SA(block, q, ans, accept, exp, ex=False):
    """Short answer. `accept` is graded by core.js matchSA; see accept_problems.

    READ THIS BEFORE USING '~'. The tilde is NOT a strict match. core.js accepts
    a tilde entry when the input equals it OR CONTAINS IT AS A WHOLE WORD, so a
    single-word tilde entry matches that word anywhere in a wrong answer:

        accept ['~young']  grades "old wine first, young wine second"  -> CORRECT
        accept ['~port']   grades "tawny port"                          -> CORRECT
        accept ['~contrast'] grades "complement not contrast"           -> CORRECT

    Each of those is the opposite of the intended answer. For a one-word answer
    the real strict mode is ex=True, which makes EVERY accept entry exact-match
    only; then list the exact phrasings you will take, e.g.
        SA(..., "Contrast", ["contrast", "contrasting", "by contrast"], ..., ex=True)
    lib.loose_tilde_problems enforces this and the build fails on it.
    """
    e = {"block": block, "q": q, "sa": 1, "accept": list(accept), "ans": ans, "exp": exp}
    if ex:
        e["ex"] = 1
    # The displayed answer must always grade as correct. A student reads `ans`
    # on the review screen and types it back next time; if the accept list does
    # not cover it they are marked wrong for giving the answer the app showed
    # them. This is mechanical rather than editorial, so it is guaranteed here
    # instead of being left to whoever writes the list.
    if not match_sa(e, ans):
        e["accept"] = [ans.lower()] + e["accept"]
    return e


def is_mc(e):
    return "opts" in e


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


def _det_shuffle(seq, seed):
    """Fisher-Yates driven by a fixed LCG, so the result is reproducible."""
    h = fnv1a64(seed)
    out = list(seq)
    for i in range(len(out) - 1, 0, -1):
        h = (h * 6364136223846793005 + 1442695040888963407) & 0xFFFFFFFFFFFFFFFF
        j = (h >> 33) % (i + 1)
        out[i], out[j] = out[j], out[i]
    return out


def bake_option_order(bank, cat):
    """Deal correct-answer positions evenly across the bank, then permute.

    A per-question shuffle is independently random, which clusters at small MC
    counts: 13 questions put seven answers at position C, which a student can
    game without knowing anything. An exam bank should be balanced by
    construction, so positions are dealt round-robin, the deal itself is
    shuffled, and the distractors are ordered from the stem. The spread then
    differs by at most one at any n.

    Ids are minted from [cat, q] and never from options, so none of this can
    move an id.
    """
    mc = [e for e in bank if is_mc(e)]
    targets = _det_shuffle([i % 4 for i in range(len(mc))], "deal:" + cat)
    for e, target in zip(mc, targets):
        correct = e["opts"][e["a"]]
        rest = _det_shuffle([o for k, o in enumerate(e["opts"]) if k != e["a"]],
                            "distractors:" + e["q"])
        rest.insert(target, correct)
        e["opts"], e["a"] = rest, target


def norm(s):
    return re.sub(r"[^a-z0-9 ]+", " ", s.lower()).split()


def engine_norm(s):
    """Port of core.js norm(), so accept lists can be checked the way the app
    will actually grade them: lowercase, accents stripped, punctuation to space,
    a fixed stopword list removed, whitespace collapsed."""
    s = (s or "").lower()
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"[^a-z0-9%$ ]", " ", s)
    s = " ".join(w for w in s.split() if w not in ENGINE_STOPWORDS)
    return s.strip()


# ----------------------------------------------------------------- checks ---
def accept_problems(e):
    """Validate one short-answer entry against how core.js will grade it."""
    out = []
    stem = e["q"][:55]
    acc = e.get("accept") or []
    if not acc:
        return ["no accept list: %s" % stem]
    if not e.get("ans"):
        out.append("no ans (display answer): %s" % stem)

    seen = set()
    for a in acc:
        raw = a[1:] if a.startswith("~") else a
        if raw != raw.lower():
            out.append("accept not lowercase %r: %s" % (a, stem))
        n = engine_norm(raw)
        if not n:
            out.append("accept %r normalises to nothing, can never match: %s" % (a, stem))
            continue
        if n in seen:
            out.append("accept %r duplicates another entry once normalised: %s" % (a, stem))
        seen.add(n)
        # Below four characters matchSA falls through to exact-match only. That is
        # worth surfacing normally, but under ex=True exact matching is the whole
        # point of the entry, so it would be pure noise.
        # A short entry only matches exactly, which is worth surfacing unless it
        # is a deliberate shorthand sitting alongside a fuller form in the same
        # list ("six" beside "six half turns"), or the question is ex=True where
        # exact matching is the whole point.
        covered = any(other is not a and n in engine_norm(other.lstrip("~")).split()
                      for other in acc)
        # A purely numeric entry ("80%", "6") is meant to be exact: matchSA has a
        # dedicated numeric branch for it, and no spelled-out variant covers it
        # because engine_norm keeps the percent sign.
        numeric = re.match(r"^[\d.,%$]+$", n) is not None
        if len(n) < 4 and not a.startswith("~") and not e.get("ex") and not covered and not numeric:
            out.append("accept %r is short, so only an exact match will grade it: %s" % (a, stem))
    return out


def structural(bank, syllabus, cat, prefix="i"):
    """Shape, coverage, accept-list and answer-spread checks."""
    problems = []

    counts = Counter(e["block"] for e in bank)
    for block, target in syllabus:
        if counts[block] != target:
            problems.append("block %r: %d written, %d targeted" % (block, counts[block], target))
    for block in counts:
        if block not in {b for b, _ in syllabus}:
            problems.append("block %r is not in the syllabus" % block)

    seen_q, seen_id = set(), {}
    for e in bank:
        stem = e["q"][:55]
        if is_mc(e):
            if len(e["opts"]) != 4:
                problems.append("not 4 options: %s" % stem)
            if not (0 <= e["a"] < len(e["opts"])):
                problems.append("answer index out of range: %s" % stem)
            if len(set(e["opts"])) != len(e["opts"]):
                problems.append("duplicate option text: %s" % stem)
        else:
            problems += accept_problems(e)
        if not e.get("exp"):
            problems.append("no explanation: %s" % stem)
        if e["q"] in seen_q:
            problems.append("duplicate stem: %s" % stem)
        seen_q.add(e["q"])
        i = mint(cat, e["q"], prefix)
        if i in seen_id:
            problems.append("id collision %s" % i)
        seen_id[i] = e["q"]

    mc = [e for e in bank if is_mc(e)]
    spread = Counter(e["a"] for e in mc)
    for pos, n in spread.items():
        if mc and n > len(mc) * 0.5:
            problems.append("answer position %d holds %d of %d MC" % (pos, n, len(mc)))

    return problems, {
        "spread": dict(sorted(spread.items())),
        "ids": len(seen_id),
        "mc": len(mc),
        "sa": len(bank) - len(mc),
    }


NEG_WORDS = {"not", "no", "never", "without", "lack", "lacks", "lacking",
             "absence", "opposite", "rather", "wrong", "incorrect"}


def _negated_against(input_norm, accept_norm):
    """Mirror of core.js negatedAgainst. A containment match cannot see a "not",
    so the guard fires when the INPUT carries a negation the accepted phrase does
    not. Exact matches are returned before this is consulted, so an answer that
    legitimately contains a negation still grades."""
    toks = set(input_norm.split())
    if not (toks & NEG_WORDS):
        return False
    return not (set(accept_norm.split()) & NEG_WORDS)


def match_sa(entry, text):
    """Port of core.js matchSA, so an accept list can be tested the way the app
    will actually grade it, including the ~strict, numeric and containment
    branches."""
    a = engine_norm(text)
    if not a:
        return False
    input_nums = re.findall(r"\d+(?:\.\d+)?", a)

    def norm_num(x):
        x = re.sub(r"[,$%\s]", "", str(x).lower())
        x = re.sub(r"\.0+$", "", x)
        return re.sub(r"dollars?", "", x).strip()

    for acc in entry.get("accept") or []:
        if acc.startswith("~"):
            nc = engine_norm(acc[1:])
            if nc and (a == nc or (len(nc) >= 4 and not _negated_against(a, nc) and
                                   re.search(r"(^| )%s( |$)" % re.escape(nc), a))):
                return True
            continue
        na = engine_norm(acc)
        if not na:
            continue
        if a == na:
            return True
        if entry.get("ex"):
            continue
        if re.match(r"^\$?\d+(\.\d+)?%?$", acc.strip()):
            if not _negated_against(a, na) and any(norm_num(n) == norm_num(acc) for n in input_nums):
                return True
            continue
        if len(na) >= 4 and not _negated_against(a, na) and            re.search(r"(^| )%s( |$)" % re.escape(na), a):
            return True
        aw, nw = len(a.split()), len(na.split())
        import math
        if len(a) >= 5 and not _negated_against(a, na) and aw >= max(1, math.ceil(nw * 0.6)) and            re.search(r"(^| )%s( |$)" % re.escape(a), na):
            return True
        if len(na) >= 5 and not _negated_against(a, na) and re.search(r"[a-z]", na) and            (na in a or (a in na and len(a) >= 5 and aw >= max(1, math.ceil(nw * 0.6)))):
            return True
    return False


def self_grading_problems(bank):
    """Every short answer must grade its OWN displayed answer as correct.

    The most consequential accept-list bug there is: a student reads `ans` on
    the review screen, types exactly that next time, and is marked wrong.
    Nothing else catches it.
    """
    out = []
    for e in bank:
        if is_mc(e):
            continue
        if not match_sa(e, e.get("ans", "")):
            out.append("its own ans would grade WRONG: %r (ans %r)"
                       % (e["q"][:44], e.get("ans", "")[:50]))
    return out


def loose_tilde_problems(bank):
    """Flag single-word '~' accepts, which match that word anywhere in the input.

    Found by an adversarial fact-check, not by any check written here: '~young'
    on a question about serving young wine before old grades "old wine first,
    young wine second" as correct, confirming a student in the exact reverse of
    the rule. The tilde was documented as a strict match and is not one.

    A multi-word tilde entry is far safer, since a whole phrase appearing inside
    a wrong answer is unlikely. The single-word case is the trap, and ex=True is
    the genuine strict mode.

    Flagging EVERY single-word tilde produces mostly noise: '~coravin' is
    harmless because no wrong answer to that question contains "coravin". The
    discriminator is whether the word RECURS ELSEWHERE IN THE CATEGORY. If it
    turns up in other stems, answers or explanations, it is live vocabulary in
    this subject and a wrong answer plausibly contains it, which is exactly how
    '~young' came to grade "old wine first, young wine second" as correct.
    """
    corpus = " ".join(
        engine_norm(" ".join([e.get("q", ""), e.get("ans", ""), e.get("exp", "")] +
                             list(e.get("opts") or [])))
        for e in bank
    ).split()
    from collections import Counter
    freq = Counter(corpus)

    out = []
    for e in bank:
        # Deliberately NOT skipping ex=True. In core.js the '~' branch returns or
        # continues before the ex check is ever reached, so ex=True does not make
        # a tilde entry strict. Skipping those questions here left the riskiest
        # combination unchecked.
        if is_mc(e):
            continue
        own = set(engine_norm(" ".join([e.get("q", ""), e.get("ans", ""), e.get("exp", "")])).split())
        for a in e.get("accept") or []:
            if not a.startswith("~"):
                continue
            n = engine_norm(a[1:])
            if not n or len(n.split()) != 1:
                continue
            # Occurrences beyond this question's own stem/answer/explanation.
            elsewhere = freq[n] - (1 if n in own else 0)
            if elsewhere >= 2:
                out.append("accept %r is one word and %r appears %d more times in this "
                           "category, so a wrong answer can contain it; use ex=True with "
                           "exact phrasings: %r" % (a, n, elsewhere, e["q"][:44]))
    return out


# A token set rather than a regex: an escaped word-boundary in this file was
# once written as a literal backspace byte, so the pattern silently matched
# nothing and the check reported clean. Tokens cannot be mangled that way.
COMPOUND_WORDS = {"two", "three", "both", "pair", "each"}


def compound_answer_problems(bank):
    """Flag a question demanding several items whose accept list takes one word.

    The tilde-recurrence check misses this: '~fino' on "Which TWO Sherry styles
    are served cold?" grades "fino and amontillado" correct, because the entry
    only ever verifies half the answer. Amontillado is oxidatively aged and is
    the opposite of what the question tests. Found by adversarial fact-check.
    """
    out = []
    for e in bank:
        if is_mc(e) or not (set(engine_norm(e.get("q", "")).split()) & COMPOUND_WORDS):
            continue
        for a in e.get("accept") or []:
            n = engine_norm(a[1:] if a.startswith("~") else a)
            if n and len(n.split()) == 1:
                out.append("stem asks for several items but accept %r is one word, so it "
                           "grades a half-right answer as correct: %r" % (a, e["q"][:44]))
    return out


NEGATION_FRAMES = [
    "not %s", "no %s", "lack of %s", "absence of %s", "without %s",
    "%s is wrong", "rather than %s", "opposite of %s", "never %s",
]


def negation_probe_problems(bank):
    """Probe every short answer with negated forms of its own answer.

    This is the general form of a bug two adversarial reviewers found and the
    earlier heuristics only approximated. Any accept entry that core.js matches
    by CONTAINMENT will also match a wrong answer that contains it inside a
    negation, because containment cannot see the "not":

        accept ['~vibration'] grades "absence of vibration"        -> CORRECT
        accept ['~oxidation'] grades "reduction rather than oxidation" -> CORRECT
        accept ['fifo']       grades "not fifo, lifo"              -> CORRECT

    Rather than guessing which words are risky, construct the negations from the
    question's own answer and accept list and check the grader rejects them. If
    the student can be marked right for saying the opposite, the entry is unsafe
    whatever it looks like.
    """
    out = []
    for e in bank:
        if is_mc(e):
            continue
        seeds = [e.get("ans", "")] + [a[1:] if a.startswith("~") else a
                                      for a in (e.get("accept") or [])]
        seen = set()
        for seed in seeds:
            n = engine_norm(seed)
            if not n or n in seen:
                continue
            seen.add(n)
            for frame in NEGATION_FRAMES:
                probe = frame % n
                if match_sa(e, probe):
                    out.append("grades the NEGATION %r as correct, so a student can be "
                               "marked right for saying the opposite: %r"
                               % (probe, e["q"][:44]))
                    break
            else:
                continue
            break
    return out


def cross_accept_problems(bank):
    """Catch an accept list broad enough to grade a DIFFERENT question's answer
    correct. A loose entry like 'acid' is the classic way a bank starts marking
    wrong answers right, and it cannot be seen by looking at one question."""
    out = []
    sa = [e for e in bank if not is_mc(e)]
    for e in sa:
        mine = engine_norm(e.get("ans", ""))
        if not mine:
            continue
        for other in sa:
            if other is e:
                continue
            # Under ex=True the other question's accepts match EXACTLY, so they
            # cannot swallow this question's answer by containment and the
            # analysis below does not apply to them.
            if other.get("ex"):
                continue
            for a in other.get("accept") or []:
                if a.startswith("~"):
                    continue
                na = engine_norm(a[1:] if a.startswith("~") else a)
                # An entry that simply IS its own question's answer is legitimate
                # even when another question shares that answer: "acidity" on a
                # question answered "Acidity" is not too broad. The real target
                # is a generic fragment like "serve it".
                if na == engine_norm(other.get("ans", "")):
                    continue
                if len(na) >= 4 and re.search(r"(^| )%s( |$)" % re.escape(na), mine):
                    out.append("accept %r on %r would also grade the answer to %r"
                               % (a, other["q"][:40], e["q"][:40]))
    return out


def duplicate_answers(bank, limit=0.85, min_words=5):
    """Flag two questions in one bank whose correct answers are near-identical.

    Neither of the other checks sees this: cross_accept_problems only looks at
    short answers, and the similarity check only compares against the source.
    Two questions testing the same fact is a quality problem in its own right —
    a student meets what reads as the same question twice.

    min_words is what makes it usable. Short answers coincide harmlessly: two
    Bordeaux questions can both answer "Cabernet Sauvignon" while testing
    completely different things. A long answer repeated is redundancy, because
    the odds of independently writing the same nine-word sentence twice are not
    coincidence.
    """
    from difflib import SequenceMatcher
    def answer(e):
        return e["opts"][e["a"]] if is_mc(e) else e.get("ans", "")
    out = []
    for i, a in enumerate(bank):
        na = engine_norm(answer(a))
        if len(na.split()) < min_words:
            continue
        for b in bank[i + 1:]:
            nb = engine_norm(answer(b))
            if len(nb.split()) < min_words:
                continue
            r = SequenceMatcher(None, na, nb).ratio()
            if r >= limit:
                out.append("answers %.0f%% alike, likely redundant: %r / %r"
                           % (r * 100, a["q"][:44], b["q"][:44]))
    return out


# Stem constructions that have actually produced a collision with the imported
# bank. Each earned its place by being flagged at least once — the point is that
# documenting "vary your templates" in the README did not stop them being
# reached for again, so the rule is enforced here instead of trusted.
BANNED_TEMPLATES = [
    ("is best described as", "flagged in Viticulture twice and Burgundy once"),
    ("are there", "Burgundy: 'How many Beaujolais crus are there?'"),
    ("made by which method", "Burgundy: collided with a Prosecco question"),
    ("which is the largest", "Burgundy: collided with a Northern Rhone question"),
    ("what share of", "Burgundy: collided with the same Grand Cru share question"),
    ("defined as", "Tasting & Service: collided with a Vinification question"),
]


def banned_template_problems(bank):
    """Flag stem constructions with a collision history.

    These are not forbidden English; they are constructions that two authors
    independently reach for when asking the same kind of question, which is
    exactly how a stem ends up matching a source it was never read from.
    """
    out = []
    for e in bank:
        stem = " ".join(norm(e["q"]))
        for phrase, why in BANNED_TEMPLATES:
            if phrase in stem:
                out.append("stem uses %r, which has collided before (%s): %r"
                           % (phrase, why, e["q"][:60]))
    return out


# An explanation may not point at an option by POSITION. bake_option_order
# deals the correct answer round-robin and orders the distractors from the
# stem, so "the second option" names whatever landed there at build time,
# which is never reliably what the author meant. In Austria all three
# instances were wrong once dealt, and one of them told the student that the
# option they had just got right was Germany's VDP pyramid.
OPTION_POSITION = re.compile(
    r"\b(?:first|second|third|fourth|last|final)\s+(?:option|answer|choice|distractor)\b"
    r"|\b(?:option|answer|choice)\s+[abcd]\b"
    r"|\bthe\s+(?:other\s+)?(?:two|three)\s+(?:options|answers|choices)\s+above\b",
    re.I)


def option_reference_problems(bank):
    """Flag an explanation or stem that identifies an option by its position."""
    out = []
    for e in bank:
        for field in ("q", "exp"):
            m = OPTION_POSITION.search(e.get(field) or "")
            if m:
                out.append(
                    "%s refers to an option by position (%r); bake_option_order "
                    "re-deals positions, so name the option instead: %r"
                    % ("stem" if field == "q" else "explanation",
                       m.group(0), e["q"][:60]))
    return out


def template_variety(bank):
    """Flag stem-template ruts, the pilot's finding.

    Independent authorship removed content dependence but not construction
    dependence. Looks at the bank on its own terms, with no reference to source.
    """
    openers = Counter(" ".join(norm(e["q"])[:3]) for e in bank)
    limit = max(2, int(len(bank) * OPENER_SHARE_LIMIT))
    problems = [
        "stem opener %r used %d times (limit %d)" % (op, n, limit)
        for op, n in openers.most_common() if n > limit
    ]
    return problems, openers


# ------------------------------------------------------------------- emit ---
def emit(bank, cat, slug, prefix="i", rank="Rank I", varname=None):
    varname = varname or ("REWRITE_" + re.sub(r"[^A-Z0-9]+", "_", slug.upper()))
    out = io.StringIO()
    out.write("/* ============ %s rewrite: %s ============\n" % (rank, cat))
    out.write("   Written independently from the syllabus in rewrite/categories/, NOT from\n")
    out.write("   the imported bank it replaces. Generated file - edit the category module,\n")
    out.write("   not this. Ids use the same FNV-1a scheme as .scripts/mint-ids.py.\n")
    out.write("   ============ */\n")
    out.write("var %s=[\n" % varname)
    rows = []
    for e in bank:
        row = {"id": mint(cat, e["q"], prefix), "cat": cat, "q": e["q"]}
        if is_mc(e):
            row["opts"] = e["opts"]
            row["a"] = e["a"]
        else:
            row["sa"] = 1
            row["accept"] = e["accept"]
            row["ans"] = e["ans"]
            if e.get("ex"):
                row["ex"] = 1
        row["exp"] = e["exp"]
        rows.append(json.dumps(row, ensure_ascii=False))
    out.write(",\n".join(rows))
    out.write("\n];\n")
    text = out.getvalue()
    dest = os.path.join(HERE, "pilot-%s.js" % slug)
    io.open(dest, "w", encoding="utf-8", newline="\n").write(text)
    return dest, len(text)
