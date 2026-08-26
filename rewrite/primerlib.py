# -*- coding: utf-8 -*-
"""Shared machinery for the study-chapter rewrite.

The 39 Introductory chapters in js/data-primers-intro.js say plainly at the top
that they were imported from cms-intro-study.html, and COMPLIANCE.md scores them
red 85. They are the last imported content in the Codex now that both question
banks are original.

Same method as the questions, and for the same reason: write from a syllabus,
never from the source chapter. Paraphrasing carries the original's exposure plus
the wasted effort. The syllabus for each chapter is the competency list in
rewrite/primers/<group>.py, and the richest legitimate source for it is the
rewritten question bank for the same region, which is already original work.

    CH(group, id, title, body)

group, id and title are STRUCTURAL and are carried across unchanged. The engine
keys chapters by id, the group drives the section list, and a title like
"Bordeaux" is a place name rather than anyone's creative expression. Only `body`
is rewritten, which is the only part that was ever copyrightable.
"""

import re

# Tags the chapter renderer actually styles. Anything outside this list either
# renders unstyled or breaks the card layout, so it is refused at build time
# rather than discovered on a phone.
ALLOWED = {"p", "b", "em", "i", "h4", "ul", "ol", "li", "br", "small", "span"}

TAG = re.compile(r"</?([a-z0-9]+)[^>]*>", re.I)
CHIP = re.compile(r"\$\{INTRO_CHIP\('([^']*)'\)\}")


def CH(g, id, t, body):
    return {"g": g, "id": id, "t": t, "body": body.strip()}


def problems(ch, seen_ids):
    """Everything that would break the page, checked before it can ship."""
    out = []
    where = "%s/%s" % (ch["g"], ch["id"])

    if not ch["body"]:
        out.append("%s: empty body" % where)
        return out
    if ch["id"] in seen_ids:
        out.append("%s: duplicate id" % where)

    for tag in set(m.group(1).lower() for m in TAG.finditer(ch["body"])):
        if tag not in ALLOWED:
            out.append("%s: <%s> is not a tag the chapter card styles" % (where, tag))

    # Unbalanced tags render as a broken card rather than an error, so they are
    # caught here where somebody is watching.
    for tag in ALLOWED - {"br"}:
        o = len(re.findall(r"<%s[ >]" % tag, ch["body"], re.I))
        c = len(re.findall(r"</%s>" % tag, ch["body"], re.I))
        if o != c:
            out.append("%s: <%s> opened %d times, closed %d" % (where, tag, o, c))

    if "<p>" not in ch["body"] and "<ul>" not in ch["body"]:
        out.append("%s: no paragraph or list; the card needs block content" % where)

    # A chapter that is only headings and chips teaches nothing.
    prose = re.sub(r"<[^>]+>", " ", CHIP.sub(r"\1", ch["body"]))
    words = len(prose.split())
    if words < 60:
        out.append("%s: %d words of prose, too thin to be a chapter" % (where, words))
    if words > 700:
        out.append("%s: %d words, longer than the card is built for" % (where, words))

    if "${" in ch["body"] and not CHIP.search(ch["body"]):
        out.append("%s: a ${...} that is not INTRO_CHIP('...') will not interpolate" % where)

    return out


def plain(ch):
    """The chapter as running text, for the similarity pass."""
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", CHIP.sub(r"\1", ch["body"]))).strip()
