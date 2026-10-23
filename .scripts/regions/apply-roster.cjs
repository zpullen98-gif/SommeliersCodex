#!/usr/bin/env node
/* apply-roster: hands the keys the roster's new records claim to their new owners, splits Georgia out of
   eastern-europe and sets each sheet country's regionsOrder (22 October 2026, the atlas in depth).

   Usage: node .scripts/regions/apply-roster.cjs [--dry] [--fragments <dir>] [jsDir]

   A NEWER fragment is a <sheet>.more.json (the roster's articles off the map) or a mapless fragment holding
   the roster's new countries; every other fragment is OLDER. A newer fragment claims:
     the roster's aliases of each of its articles and countries (written into its aliases when missing and
       when the join's key rules allow them; one they refuse is printed and skipped),
     its own aliases and terroirRows keys,
     the folded names of its articles and countries (and a new country's key);
   georgia, once a newer fragment holds it, also claims GEORGIA_MOVE.
   For every claimed key, an older fragment's alias or TERROIR row whose target lies in the same country group
   (JOIN.countryGroup: the four US sheets are one) is taken off it; a TERROIR row the newer fragment does not
   map yet moves with it, so the row keeps a target. A key whose old target is in another country group is
   never touched (Thrace stays Greece's as it becomes Turkey's too). GEORGIA_MOVE leaves eastern-europe's
   fragment for georgia's. Each sheet country's regionsOrder becomes the map's slugs, then the roster's
   articles off the map present in the fragments, in roster order.

   A CLASH writes nothing and exits 1: two newer fragments claiming one key for two targets in one country, a
   claimed key that is an older article's own name in its country, a TERROIR row claimed across countries
   (a row has one target), a newer fragment sending a roster alias elsewhere, a new slug or key an older record
   already uses, or a mapless fragment mixing first edition and new countries. Every move is printed;
   --dry prints the same and writes nothing. Idempotent: a second run moves nothing. Fragments are written
   as JSON with a one space indent and a final newline, and only when they change. */
'use strict';
const fs = require('fs');
const path = require('path');
const CF = require(path.join(__dirname, 'check-fragment.cjs'));
const JOIN = require(path.join(__dirname, 'regions-join.cjs'));
const ROSTER = require(path.join(__dirname, 'roster.cjs'));

function own(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }

/* Plans every change over the parsed fragments of dir; returns { files, lines, clashes, changed }. The atlas (from
   jsDir, the Codex's js/ by default) tells a whole sheet from a part of one when regionsOrder is set. */
function plan(dir, jsDir) {
  const atlas = CF.loadCodex(jsDir || path.join(__dirname, '..', '..', 'js')).atlas;
  const lines = [];
  const clashes = [];
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /\.json$/.test(f)).sort() : [];
  const frags = [];
  files.forEach((f) => {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    let frag;
    try { frag = JSON.parse(raw); } catch (e) { clashes.push(f + ': ' + e.message); return; }
    const kind = CF.fragmentKind(frag);
    if (kind === 'techniques') return; /* a technique is no join target */
    const news = kind === 'mapless' ? (frag.countries || []).filter((c) => c && CF.NEW_MAPLESS_KEYS.indexOf(c.key) >= 0) : [];
    const olds = kind === 'mapless' ? (frag.countries || []).filter((c) => c && CF.NEW_MAPLESS_KEYS.indexOf(c.key) < 0) : [];
    if (news.length && olds.length) clashes.push(f + ': a mapless fragment mixes first edition and new countries (' + olds.map((c) => c.key).join(', ') + ' with ' + news.map((c) => c.key).join(', ') + '); keep the new ones in a fragment of their own');
    frags.push({ f, frag, raw, kind, newer: kind === 'more' || news.length > 0, news });
  });

  /* where every target lives */
  const sheetOf = {};
  const slugFrom = {};
  frags.forEach((x) => (x.frag.regions || []).forEach((r) => {
    if (!r || !r.slug) return;
    if (own(sheetOf, r.slug) && slugFrom[r.slug] !== x.f) clashes.push('slug ' + r.slug + ' is written in ' + slugFrom[r.slug] + ' and ' + x.f);
    sheetOf[r.slug] = x.frag.sheet; slugFrom[r.slug] = x.f;
  }));
  const groupOf = (t) => (own(sheetOf, t) ? JOIN.countryGroup(sheetOf[t]) : (CF.COUNTRY_KEYS.indexOf(t) >= 0 ? JOIN.countryGroup(t) : null));
  const older = frags.filter((x) => !x.newer);
  const newer = frags.filter((x) => x.newer);
  const olderNames = {};
  older.forEach((x) => (x.frag.regions || []).forEach((r) => { if (r && r.name) (olderNames[CF.fold(r.name)] = olderNames[CF.fold(r.name)] || []).push({ slug: r.slug, f: x.f }); }));
  const olderKeys = new Set();
  older.forEach((x) => { if (x.frag.country && x.frag.country.key) olderKeys.add(x.frag.country.key); (x.frag.countries || []).forEach((c) => c && olderKeys.add(c.key)); });

  /* 1. the newer fragments: the roster's aliases written in, then every claim gathered */
  const claims = {}; /* folded key: { target, group, f } */
  const rowClaims = {}; /* TERROIR row: { target, group, f } */
  const claim = (table, k, target, f, what) => {
    const g = groupOf(target);
    if (own(table, k) && table[k].target !== target && table[k].group === g) { clashes.push(what + ': ' + table[k].f + ' gives it to ' + table[k].target + ' and ' + f + ' to ' + target + ', two targets in one country'); return; }
    if (!own(table, k)) table[k] = { target, group: g, f };
  };
  let georgia = null;
  newer.forEach((x) => {
    const recs = x.kind === 'more'
      ? (x.frag.regions || []).filter((r) => r && r.slug).map((r) => ({ id: r.slug, name: r.name, ro: (ROSTER.MORE[x.frag.sheet] || []).find((a) => a.slug === r.slug), country: false }))
      : x.news.map((c) => ({ id: c.key, name: c.name, ro: ROSTER.NEW_MAPLESS.find((n) => n.key === c.key), country: true }));
    recs.forEach((rec) => {
      if (own(slugFrom, rec.id) && slugFrom[rec.id] !== x.f && !newer.some((y) => y.f === slugFrom[rec.id])) clashes.push(x.f + ': ' + rec.id + ' is already the slug of an article in ' + slugFrom[rec.id]);
      if (rec.country && olderKeys.has(rec.id)) clashes.push(x.f + ': ' + rec.id + ' is already a country of an older fragment');
      const wanted = (rec.ro ? rec.ro.aliases : []).slice();
      if (rec.id === 'georgia') { georgia = x; ROSTER.GEORGIA_MOVE.forEach((k) => { if (wanted.indexOf(k) < 0) wanted.push(k); }); }
      wanted.forEach((k) => {
        const redundant = k === CF.fold(rec.name) || (rec.country && k === rec.id);
        if (own(x.frag.aliases, k)) {
          if (x.frag.aliases[k] !== rec.id) clashes.push(x.f + ': aliases["' + k + '"] sends it to ' + x.frag.aliases[k] + ', but the roster gives it to ' + rec.id);
          return;
        }
        if (redundant) return; /* the name or the key is in the join already */
        const p = CF.aliasKeyProblems(k, rec.id);
        if (p.length) { lines.push('skip   the roster\'s alias "' + k + '" for ' + rec.id + ': ' + p.join('; ')); return; }
        if (!x.frag.aliases || typeof x.frag.aliases !== 'object') x.frag.aliases = {};
        x.frag.aliases[k] = rec.id;
        x.changed = true;
        lines.push('add    aliases["' + k + '"] -> ' + rec.id + ' in ' + x.f + ' (the roster)');
      });
      claim(claims, CF.fold(rec.name), rec.id, x.f, 'the name "' + rec.name + '"');
      if (rec.country) claim(claims, CF.fold(rec.id), rec.id, x.f, 'the key ' + rec.id);
    });
    Object.keys(x.frag.aliases || {}).forEach((k) => claim(claims, k, x.frag.aliases[k], x.f, 'aliases["' + k + '"]'));
    Object.keys(x.frag.terroirRows || {}).forEach((k) => claim(rowClaims, k, x.frag.terroirRows[k], x.f, 'terroirRows["' + k + '"]'));
  });
  const byFile = {};
  frags.forEach((x) => { byFile[x.f] = x; });

  /* 2. the older fragments give up what is claimed in their own country */
  older.forEach((x) => {
    Object.keys(x.frag.aliases || {}).forEach((k) => {
      if (!own(claims, k)) return;
      const c = claims[k];
      const t = x.frag.aliases[k];
      if (georgia && t === 'eastern-europe' && ROSTER.GEORGIA_MOVE.indexOf(k) >= 0) return; /* the Georgia split, step 3 */
      if (t === c.target || groupOf(t) === c.group) {
        delete x.frag.aliases[k];
        x.changed = true;
        lines.push('move   aliases["' + k + '"]: ' + x.f + ' (' + t + ') -> ' + c.f + ' (' + c.target + ')');
      } else lines.push('leave  aliases["' + k + '"]: ' + x.f + ' keeps ' + t + ' (' + groupOf(t) + '); ' + c.f + ' sends it to ' + c.target + ' (' + c.group + ') too');
    });
    Object.keys(x.frag.terroirRows || {}).forEach((row) => {
      const t = x.frag.terroirRows[row];
      if (own(rowClaims, row)) {
        const c = rowClaims[row];
        if (t === c.target || groupOf(t) === c.group) {
          delete x.frag.terroirRows[row];
          x.changed = true;
          lines.push('move   terroirRows["' + row + '"]: ' + x.f + ' (' + t + ') -> ' + c.f + ' (' + c.target + ')');
        } else clashes.push('terroirRows["' + row + '"]: ' + x.f + ' gives it to ' + t + ' and ' + c.f + ' to ' + c.target + ' in another country; a TERROIR row has one target');
        return;
      }
      const k = CF.fold(row);
      if (!own(claims, k)) return;
      const c = claims[k];
      if (t === c.target || groupOf(t) === c.group) {
        delete x.frag.terroirRows[row];
        x.changed = true;
        const to = byFile[c.f];
        if (!to.frag.terroirRows || typeof to.frag.terroirRows !== 'object') to.frag.terroirRows = {};
        to.frag.terroirRows[row] = c.target;
        to.changed = true;
        lines.push('move   terroirRows["' + row + '"]: ' + x.f + ' (' + t + ') -> ' + c.f + ' (' + c.target + '), the row with the key "' + k + '"');
      } else lines.push('leave  terroirRows["' + row + '"]: ' + x.f + ' keeps ' + t + ' (another country)');
    });
  });
  /* a claimed key that is an older article's own name in its country: the build would refuse the alias */
  Object.keys(claims).forEach((k) => (olderNames[k] || []).forEach((o) => {
    if (o.slug !== claims[k].target && groupOf(o.slug) === claims[k].group) clashes.push('"' + k + '": ' + claims[k].f + ' claims it for ' + claims[k].target + ', but it is the name of the article ' + o.slug + ' (' + o.f + ') in the same country');
  }));

  /* 3. Georgia: GEORGIA_MOVE leaves eastern-europe's fragment once georgia is in a newer one */
  if (georgia) {
    older.filter((x) => (x.frag.countries || []).some((c) => c && c.key === 'eastern-europe')).forEach((x) => {
      ROSTER.GEORGIA_MOVE.forEach((k) => {
        if (!own(x.frag.aliases, k)) return;
        if (x.frag.aliases[k] !== 'eastern-europe') { lines.push('leave  aliases["' + k + '"]: ' + x.f + ' sends it to ' + x.frag.aliases[k] + ', not eastern-europe'); return; }
        delete x.frag.aliases[k];
        x.changed = true;
        lines.push('move   aliases["' + k + '"]: ' + x.f + ' (eastern-europe) -> ' + georgia.f + ' (georgia), the Georgia split');
      });
      Object.keys(x.frag.terroirRows || {}).forEach((row) => {
        if (ROSTER.GEORGIA_MOVE.indexOf(CF.fold(row)) < 0 || x.frag.terroirRows[row] !== 'eastern-europe') return;
        delete x.frag.terroirRows[row];
        if (!georgia.frag.terroirRows || typeof georgia.frag.terroirRows !== 'object') georgia.frag.terroirRows = {};
        if (!own(georgia.frag.terroirRows, row)) georgia.frag.terroirRows[row] = 'georgia';
        x.changed = true; georgia.changed = true;
        lines.push('move   terroirRows["' + row + '"]: ' + x.f + ' (eastern-europe) -> ' + georgia.f + ' (georgia), the Georgia split');
      });
    });
  }

  /* 4. every sheet country's regionsOrder: the map's slugs, then the roster's articles off the map present */
  CF.SHEETS.forEach((s) => {
    const holder = frags.find((x) => x.kind === 'sheet' && x.frag.sheet === s && x.frag.country && (!x.frag.part || x.frag.part.country === true));
    if (!holder) return;
    const c = holder.frag.country;
    const moreAll = (ROSTER.MORE[s] || []).map((a) => a.slug);
    const at = [];
    frags.filter((x) => x.kind === 'sheet' && x.frag.sheet === s).forEach((x) => (x.frag.regions || []).forEach((r) => { if (r && Number.isInteger(r.index)) at.push([r.index, r.slug]); }));
    at.sort((a, b) => a[0] - b[0]);
    const whole = at.length === atlas.sheets[s].regions.length && at.every((p, i) => p[0] === i);
    const mapSlugs = whole ? at.map((p) => p[1]) : (Array.isArray(c.regionsOrder) ? c.regionsOrder.filter((x) => moreAll.indexOf(x) < 0) : []);
    const present = moreAll.filter((slug) => frags.some((x) => x.kind === 'more' && x.frag.sheet === s && (x.frag.regions || []).some((r) => r && r.slug === slug)));
    const want = mapSlugs.concat(present);
    if (!Array.isArray(c.regionsOrder) || c.regionsOrder.join() !== want.join()) {
      lines.push('order  ' + holder.f + ': country.regionsOrder ' + (Array.isArray(c.regionsOrder) ? c.regionsOrder.join(', ') : 'none') + ' -> ' + want.join(', '));
      c.regionsOrder = want;
      holder.changed = true;
    }
  });

  const changed = frags.filter((x) => x.changed && JSON.stringify(x.frag, null, 1) + '\n' !== x.raw);
  return { files, newer: newer.map((x) => x.f), lines, clashes, changed };
}

module.exports = { plan };

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.indexOf('--help') >= 0 || args.indexOf('-h') >= 0) {
    console.log('usage: node .scripts/regions/apply-roster.cjs [--dry] [--fragments <dir>] [jsDir]');
    console.log('  --dry        print every move and write nothing');
    console.log('  --fragments  the folder of fragments (default .scripts/regions/fragments)');
    process.exit(0);
  }
  const dry = args.indexOf('--dry') >= 0;
  const fi = args.indexOf('--fragments');
  const rest = args.filter((a, i) => a !== '--dry' && a !== '--fragments' && !(fi >= 0 && i === fi + 1));
  const unknown = rest.filter((a) => a.charAt(0) === '-');
  if (unknown.length || rest.length > 1) { console.error('apply-roster: unknown argument ' + (unknown[0] || rest[1])); process.exit(2); }
  const dir = fi >= 0 ? args[fi + 1] : path.join(__dirname, 'fragments');
  if (!dir || !fs.existsSync(dir)) { console.error('apply-roster: no fragments folder at ' + dir); process.exit(1); }
  const r = plan(dir, rest[0]);
  r.lines.forEach((l) => console.log(l));
  if (r.clashes.length) {
    r.clashes.forEach((c) => console.log('clash  ' + c));
    console.log('\napply-roster: ' + r.clashes.length + ' clash(es), nothing written');
    process.exit(1);
  }
  const head = 'apply-roster' + (dry ? ' --dry' : '') + ': ' + r.files.length + ' fragment(s), ' + r.newer.length + ' newer (' + (r.newer.join(', ') || 'none: no .more fragment and no new country') + ')';
  if (!r.changed.length) { console.log(head + '; nothing to move'); process.exit(0); }
  if (!dry) r.changed.forEach((x) => fs.writeFileSync(path.join(dir, x.f), JSON.stringify(x.frag, null, 1) + '\n'));
  console.log(head + '; ' + (dry ? 'would write ' : 'wrote ') + r.changed.map((x) => x.f).join(', '));
  process.exit(0);
}
