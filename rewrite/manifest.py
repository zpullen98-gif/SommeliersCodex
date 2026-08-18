"""Progress across the whole Rank I and II rewrite.

    py rewrite/manifest.py            # summary + what is left, largest first
    py rewrite/manifest.py --all      # every category, done and pending

Reads the imported banks for the authoritative category list and counts, and
rewrite/categories/ for what has been written. Counts only: no question text
from the imported banks is printed, so this stays safe to run and paste.
"""

import io
import json
import os
import re
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
JS = os.path.join(HERE, "..", "js")
BS = chr(92)

BANKS = [("Rank I", "data-intro.js"), ("Rank II", "data-questions.js")]


def objs(path):
    s = io.open(path, encoding="utf-8").read()
    body = s[s.index("=["):]
    out, depth, start, instr, esc = [], 0, None, False, False
    for i, ch in enumerate(body):
        if esc:
            esc = False
            continue
        if ch == BS:
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


def done_categories():
    """Map (RANK, CAT) -> (module, written count).

    Keyed on the pair because category names repeat across ranks: there is a
    Bordeaux in Rank I and another in Rank II, with different counts and
    different question shapes. Keying on the name alone double-counts.
    """
    out = {}
    d = os.path.join(HERE, "categories")
    for f in sorted(os.listdir(d)):
        if not f.endswith(".py") or f.startswith("_"):
            continue
        src = io.open(os.path.join(d, f), encoding="utf-8").read()
        m = re.search(r'^CAT\s*=\s*"([^"]+)"', src, re.M)
        if not m:
            continue
        r = re.search(r'^RANK\s*=\s*"([^"]+)"', src, re.M)
        rank = r.group(1) if r else "Rank I"
        n = len(re.findall(r"^\s{4}(?:Q|SA)\(", src, re.M))
        out[(rank, m.group(1))] = (f[:-3], n)
    return out


def main():
    show_all = "--all" in sys.argv
    done = done_categories()
    grand_total = grand_done = 0
    pending_rows = []

    for rank, fname in BANKS:
        bank = objs(os.path.join(JS, fname))
        cats = Counter(q.get("cat", "") for q in bank)
        total = sum(cats.values())
        rank_done = sum(n for (r, c), (_, n) in done.items() if r == rank and c in cats)
        grand_total += total
        grand_done += rank_done
        print("%s — %s: %d questions across %d categories, %d written (%.0f%%)"
              % (rank, fname, total, len(cats), rank_done, 100.0 * rank_done / total))
        for c, n in cats.most_common():
            mc = sum(1 for q in bank if q.get("cat") == c and "opts" in q)
            sa = n - mc
            if (rank, c) in done:
                slug, written = done[(rank, c)]
                print("   [x] %-30s %3d  (MC %3d / SA %3d)  written %d as %s"
                      % (c, n, mc, sa, written, slug))
            else:
                pending_rows.append((n, rank, c, mc, sa))
                if show_all:
                    print("   [ ] %-30s %3d  (MC %3d / SA %3d)" % (c, n, mc, sa))
        print()

    n_cats = sum(len(Counter(q.get("cat", "") for q in objs(os.path.join(JS, f))))
                 for _, f in BANKS)
    print("TOTAL: %d of %d questions written (%.1f%%), %d of %d categories"
          % (grand_done, grand_total, 100.0 * grand_done / grand_total, len(done), n_cats))
    if not show_all:
        print("\nLargest remaining, in the order worth taking them:")
        for n, rank, c, mc, sa in sorted(pending_rows, reverse=True)[:10]:
            print("   %-8s %-30s %3d  (MC %3d / SA %3d)" % (rank, c, n, mc, sa))


main()
