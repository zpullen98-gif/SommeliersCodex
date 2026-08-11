"""Mint stable question ids into the four banks.

Question identity used to be the first 80 characters of the stem, which made
every stat, SRS card, note, bookmark and error report hostage to the wording.
Each bank entry now carries an `id`; core.js's missKey prefers it.

    py .scripts/mint-ids.py            # dry run, reports what it would do
    py .scripts/mint-ids.py --apply    # write
    py .scripts/mint-ids.py --strip    # remove every id (paired with --apply)

Idempotent and ADDITIVE: an object that already carries "id" is left
byte-for-byte alone. That is the whole safety property -- re-running this after
editing a stem must never re-mint, because a changed id orphans progress just as
badly as the old scheme did. The seed is json.dumps([cat, q]) so the mint is
reproducible and unambiguous (the JSON quoting is what keeps a category ending
in a quote from colliding with a question beginning with one).

Ids are `<letter>-<8 base36 chars>` and deliberately contain no '|', because
codex7's keyOwned() and codex8's keyLevel() still read the level from the key
prefix (certified stays unprefixed).

Rewrites are surgical: the id is inserted directly after the opening brace of
each one-line object and every other byte of the file is preserved, header
comments included. Run `qidAudit()` in the browser console afterwards.

--strip exists so the corpus can be re-minted wholesale while nothing depends on
the ids yet. Once real progress has been saved against them, stripping orphans
every store -- treat it as a pre-ship tool only.
"""

import io
import json
import os
import re
import sys

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "js")
BANKS = [
    ("data-questions.js", "QUESTIONS", "c"),
    ("data-intro.js", "INTRO_QUESTIONS", "i"),
    ("data-advanced.js", "ADV_QUESTIONS", "a"),
    ("data-master.js", "MASTER_QUESTIONS", "m"),
]
# Guard rails: if a count drifts, the parse went wrong -- investigate, don't --apply.
EXPECT = {"QUESTIONS": 1283, "INTRO_QUESTIONS": 1778, "ADV_QUESTIONS": 562, "MASTER_QUESTIONS": 445}

APPLY = "--apply" in sys.argv
STRIP = "--strip" in sys.argv
ID_RE = re.compile(r'"id"\s*:\s*"[^"]*"\s*,\s*')


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


def depth_delta(line):
    """Bracket depth change, ignoring brackets inside JSON strings."""
    d = 0
    instr = False
    esc = False
    for ch in line:
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
        if ch in "[{":
            d += 1
        elif ch in "]}":
            d -= 1
    return d


all_ids = {}
problems = []
report = []

for fn, var, letter in BANKS:
    path = os.path.normpath(os.path.join(BASE, fn))
    src = io.open(path, encoding="utf-8", newline="").read()
    nl = "\r\n" if "\r\n" in src else "\n"
    lines = src.split(nl)

    start = None
    for i, l in enumerate(lines):
        if re.match(r"^\s*var\s+" + var + r"\s*=\s*\[", l):
            start = i
            break
    if start is None:
        raise SystemExit("array %s not found in %s" % (var, fn))

    tail = lines[start].split("[", 1)[1]
    if tail.strip():
        raise SystemExit("unexpected content after '[' in %s: %r" % (fn, tail))

    out = list(lines)
    depth = depth_delta(tail)
    minted = kept = stripped = n_obj = 0
    slices = {}
    i = start + 1

    while i < len(lines):
        line = lines[i]
        s = line.strip()
        if depth == 0 and s in ("];", "]"):
            break
        if depth == 0 and s.startswith("{"):
            body = s[:-1] if s.endswith(",") else s
            try:
                obj = json.loads(body)
            except Exception as e:
                raise SystemExit("%s L%d: not JSON: %s" % (fn, i + 1, e))
            n_obj += 1
            qtext = obj.get("q", "")
            slices.setdefault(qtext[:80], []).append(i + 1)
            if "|" in qtext[:80]:
                problems.append("%s L%d: '|' in stem breaks keyLevel()" % (fn, i + 1))

            if STRIP:
                if "id" in obj:
                    brace = line.index("{")
                    head, rest = line[: brace + 1], line[brace + 1 :]
                    new = ID_RE.sub("", rest, count=1)
                    if new != rest:
                        out[i] = head + new
                        stripped += 1
            elif "id" in obj:
                if obj["id"] in all_ids:
                    problems.append("%s L%d: duplicate id %s" % (fn, i + 1, obj["id"]))
                all_ids[obj["id"]] = (fn, i + 1)
                kept += 1
            else:
                seed = json.dumps([obj.get("cat", ""), qtext], ensure_ascii=False)
                n = 0
                while True:
                    qid = letter + "-" + b36(fnv1a64(seed if n == 0 else seed + "#" + str(n)), 8)
                    if qid not in all_ids:
                        break
                    n += 1
                all_ids[qid] = (fn, i + 1)
                brace = line.index("{")
                out[i] = line[: brace + 1] + '"id":"' + qid + '",' + line[brace + 1 :]
                minted += 1
        depth += depth_delta(line)
        i += 1

    for sl, at in slices.items():
        if len(at) > 1:
            problems.append("%s: lines %s share an 80-char stem slice" % (fn, at))

    exp = EXPECT.get(var)
    flag = "OK" if exp is None or n_obj == exp else "COUNT MISMATCH (expected %d)" % exp
    if flag != "OK":
        problems.append("%s: %s" % (fn, flag))
    report.append("%-20s %-17s %5d objects  %5d minted  %5d kept  %5d stripped   %s"
                  % (fn, var, n_obj, minted, kept, stripped, flag))

    if APPLY and (minted or stripped):
        with io.open(path, "w", encoding="utf-8", newline="") as fh:
            fh.write(nl.join(out))

print("\n".join(report))
print("\ntotal distinct ids: %d" % len(all_ids))
if problems:
    print("\nPROBLEMS:")
    for p in problems:
        print("  " + p)
else:
    print("no problems detected")
print("\nMODE: %s%s" % ("STRIP " if STRIP else "", "APPLIED" if APPLY else "DRY RUN (pass --apply to write)"))
sys.exit(1 if problems else 0)
