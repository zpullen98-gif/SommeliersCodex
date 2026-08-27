# -*- coding: utf-8 -*-
"""Did an edit change a question id?

    py rewrite/check-ids.py                     # every category, against HEAD
    py rewrite/check-ids.py r1_beer r1_loire    # named categories
    py rewrite/check-ids.py --ref HEAD~5        # against any commit

Ids are minted `i-<8 base36>` from an FNV-1a 64 over `json.dumps([cat, stem])`, so
the STEM is the identity. Options, `exp` and accept lists can be edited freely;
touch a stem and the id moves, and every stat key that referenced it is orphaned:
`missKey` prefers the id, and a Rank II key looks like `advanced|a-kpyi8t6m`.

Today that costs nothing - no Supabase project exists and nothing has been sold,
which is exactly why `mint-ids.py --strip` calls re-minting a pre-ship tool. After
launch it strands every paying venue's review history, and the failure is silent:
the bank still loads, the questions still render, and the student simply finds
their progress gone.

So this is cheap insurance on any pass that edits question data. The option-length
repair touched 2,254 multiple-choice questions across 36 categories on the promise
that it changed options and explanations only; this is what turned that promise
into something checkable. It reported ALL IDS STABLE for all of them.

Exits non-zero if any id moved.
"""

import importlib
import importlib.util
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "categories"))

import lib  # noqa: E402


def load_at_ref(name, ref):
    """The category module as it stood at `ref`, or None if it did not exist.

    Written to a temp file inside categories/ so its `from lib import Q` resolves
    the same way the real module's does.
    """
    rel = "rewrite/categories/%s.py" % name
    p = subprocess.run(["git", "show", "%s:%s" % (ref, rel)], cwd=REPO, capture_output=True)
    if p.returncode != 0:
        return None
    fd, tmp = tempfile.mkstemp(suffix=".py", dir=os.path.join(HERE, "categories"))
    os.write(fd, p.stdout)
    os.close(fd)
    try:
        spec = importlib.util.spec_from_file_location("_old_%s" % name, tmp)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        return mod
    finally:
        os.unlink(tmp)


def ids_of(mod):
    prefix = getattr(mod, "PREFIX", "i")
    return [lib.mint(mod.CAT, e["q"], prefix) for e in mod.BANK]


def main():
    argv = sys.argv[1:]
    ref = "HEAD"
    if "--ref" in argv:
        i = argv.index("--ref")
        ref = argv[i + 1]
        del argv[i:i + 2]

    names = [a for a in argv if not a.startswith("-")]
    if not names:
        d = os.path.join(HERE, "categories")
        names = sorted(f[:-3] for f in os.listdir(d)
                       if f.endswith(".py") and not f.startswith("_"))

    moved = 0
    checked = 0
    for name in names:
        new = importlib.import_module("categories.%s" % name)
        old = load_at_ref(name, ref)
        if old is None:
            print("%-32s  (new file, nothing at %s)" % (name, ref))
            continue
        new_ids, old_ids = ids_of(new), ids_of(old)
        sn, so = set(new_ids), set(old_ids)
        checked += len(new_ids)
        if sn == so and len(new_ids) == len(old_ids):
            print("%-32s  ok, %d ids unchanged" % (name, len(new_ids)))
            continue
        moved += 1
        lost, gained = so - sn, sn - so
        print("%-32s  ORPHANED: %d ids lost, %d new" % (name, len(lost), len(gained)))
        by_id = dict(zip(old_ids, [e["q"] for e in old.BANK]))
        for i in sorted(lost)[:5]:
            print("      %s  %s" % (i, by_id.get(i, "")[:70]))
        if len(lost) > 5:
            print("      ... and %d more" % (len(lost) - 5))

    print("")
    if moved:
        print("*** %d categor%s changed ids. A stem was edited; every stat key that"
              % (moved, "y" if moved == 1 else "ies"))
        print("*** referenced it is orphaned. Revert the stem, or accept the loss knowingly.")
    else:
        print("ALL IDS STABLE across %d questions - no stored progress orphaned." % checked)
    sys.exit(1 if moved else 0)


main()
