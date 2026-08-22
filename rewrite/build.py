"""Build one rewritten category.

    py rewrite/build.py bordeaux
    py rewrite/build.py viticulture_winemaking
    py rewrite/build.py --all

Category data lives in rewrite/categories/<name>.py as CAT, SLUG, SYLLABUS, BANK.
Emits rewrite/pilot-<slug>.js. Exits non-zero if any check fails.
"""

import importlib
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "categories"))

import lib  # noqa: E402


def build(name):
    mod = importlib.import_module("categories.%s" % name)
    bank = [dict(e) for e in mod.BANK]
    prefix = getattr(mod, "PREFIX", "i")
    rank = getattr(mod, "RANK", "Rank I")

    # Bake the option order in before checking or emitting, so the checks run
    # against exactly what ships. Short-answer entries have nothing to shuffle.
    lib.bake_option_order(bank, mod.CAT)

    problems, stats = lib.structural(bank, mod.SYLLABUS, mod.CAT, prefix)
    tmpl_problems, openers = lib.template_variety(bank)
    problems += tmpl_problems
    problems += lib.banned_template_problems(bank)
    problems += lib.option_reference_problems(bank)
    problems += lib.self_grading_problems(bank)
    problems += lib.loose_tilde_problems(bank)
    problems += lib.compound_answer_problems(bank)
    problems += lib.negation_probe_problems(bank)
    problems += lib.comparative_probe_problems(bank)
    problems += lib.cross_accept_problems(bank)
    problems += lib.duplicate_answers(bank)

    target = sum(t for _, t in mod.SYLLABUS)
    print("%s — %s (%s)" % (mod.CAT, mod.SLUG, rank))
    print("  written %d questions across %d syllabus blocks (target %d)"
          % (len(bank), len(mod.SYLLABUS), target))
    print("  types           %d multiple choice, %d short answer" % (stats["mc"], stats["sa"]))
    if stats["mc"]:
        print("  answer spread   %s" % stats["spread"])
    print("  unique ids      %d" % stats["ids"])
    print("  distinct stem openers %d of %d questions; most common %s"
          % (len(openers), len(bank), openers.most_common(1)[0] if openers else "-"))

    if problems:
        print("  PROBLEMS:")
        for p in problems:
            print("   - %s" % p)
    else:
        print("  checks          all passed")

    dest, size = lib.emit(bank, mod.CAT, mod.SLUG, prefix, rank)
    print("  wrote           %s (%d bytes)\n" % (os.path.basename(dest), size))
    return not problems


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    if "--all" in sys.argv:
        d = os.path.join(HERE, "categories")
        args = sorted(f[:-3] for f in os.listdir(d)
                      if f.endswith(".py") and not f.startswith("_"))
    if not args:
        sys.exit(__doc__)
    ok = all([build(a) for a in args])
    sys.exit(0 if ok else 1)


main()
