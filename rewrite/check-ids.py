# -*- coding: utf-8 -*-
"""Did an edit change a question id?

    py rewrite/check-ids.py                     # every category, against HEAD
    py rewrite/check-ids.py r1_beer r1_loire    # named categories
    py rewrite/check-ids.py --ref HEAD~5        # against any commit
    py rewrite/check-ids.py --logged .scripts/review/applied-rewrite.json

`--logged FILE` reads the `movedIds.rows` (or a `movedIds` list) of an edition's applied file (each row a
`module`, an `old` id and its `new` one) and accepts a move only when that exact
pair is logged for that module. Any move the file does not name still fails, so
the default run is unchanged and the flag never admits an unrecorded move; it
turns "every id that moved is logged" from a reading by eye into a check. A
logged row whose old id no longer moves (the edition committed, say) is a note.

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


def logged_moves(path):
    """{module: {old id: new id}} from an applied file's movedIds rows."""
    import json
    with open(path, encoding="utf-8") as fh:
        data = json.load(fh)
    moved = data.get("movedIds")
    # An edition's file may hold the rows under movedIds.rows, or as the list itself
    # (the CMS edition's applied-cms-rewrite.json); both shapes name the same rows.
    rows = moved if isinstance(moved, list) else ((moved or {}).get("rows") or [])
    out = {}
    for r in rows:
        if r.get("module") and r.get("old") and r.get("new"):
            out.setdefault(r["module"], {})[r["old"]] = r["new"]
    return out


def main():
    argv = sys.argv[1:]
    ref = "HEAD"
    if "--ref" in argv:
        i = argv.index("--ref")
        ref = argv[i + 1]
        del argv[i:i + 2]
    logged = None
    if "--logged" in argv:
        i = argv.index("--logged")
        path = argv[i + 1]
        del argv[i:i + 2]
        if not os.path.isabs(path):
            path = os.path.join(REPO, path) if not os.path.exists(path) else path
        logged = logged_moves(path)

    names = [a for a in argv if not a.startswith("-")]
    if not names:
        d = os.path.join(HERE, "categories")
        names = sorted(f[:-3] for f in os.listdir(d)
                       if f.endswith(".py") and not f.startswith("_"))

    moved = 0
    knowingly = 0
    stale = []
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
        log = (logged or {}).get(name, {})
        stale += ["%s %s" % (name, o) for o in sorted(log) if o not in so - sn]
        if sn == so and len(new_ids) == len(old_ids):
            print("%-32s  ok, %d ids unchanged" % (name, len(new_ids)))
            continue
        lost, gained = so - sn, sn - so
        if logged is not None and len(new_ids) == len(old_ids) and lost and \
                all(log.get(o) in gained for o in lost) and \
                len(set(log[o] for o in lost)) == len(gained):
            knowingly += len(lost)
            print("%-32s  moved knowingly: %d id%s, each logged old to new"
                  % (name, len(lost), "" if len(lost) == 1 else "s"))
            continue
        moved += 1
        if logged is not None:
            lost = set(o for o in lost if log.get(o) not in gained)
            gained = gained - set(log[o] for o in so - sn if o in log)
        print("%-32s  ORPHANED: %d ids lost, %d new" % (name, len(lost), len(gained)))
        by_id = dict(zip(old_ids, [e["q"] for e in old.BANK]))
        for i in sorted(lost)[:5]:
            print("      %s  %s" % (i, by_id.get(i, "")[:70]))
        if len(lost) > 5:
            print("      ... and %d more" % (len(lost) - 5))

    print("")
    if logged is not None:
        print("logged moves: %d ids moved knowingly, each named old to new in the applied file" % knowingly)
        if stale:
            print("note: %d logged row%s no longer move%s against %s: %s"
                  % (len(stale), "" if len(stale) == 1 else "s", "s" if len(stale) == 1 else "",
                     ref, ", ".join(stale[:6]) + (" ..." if len(stale) > 6 else "")))
    if moved:
        print("*** %d categor%s changed ids%s. A stem was edited; every stat key that"
              % (moved, "y" if moved == 1 else "ies", " the applied file does not log" if logged is not None else ""))
        print("*** referenced it is orphaned. Revert the stem, or accept the loss knowingly.")
    elif knowingly:
        print("NO UNLOGGED MOVE across %d questions: the %d moved ids are each logged." % (checked, knowingly))
    else:
        print("ALL IDS STABLE across %d questions - no stored progress orphaned." % checked)
    sys.exit(1 if moved else 0)


main()
