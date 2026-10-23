#!/usr/bin/env node
/* apply-videos: writes videos and watchSearch into the fragment records from the video evidence (22 October 2026,
   the atlas in depth; BRIEF-DEEP "Videos").

   Usage: node .scripts/regions/apply-videos.cjs [--dry] [--fragments <dir>] [--videos <dir>] [--pack <path>] [--date YYYY-MM-DD]

   Evidence is .scripts/regions/videos/<key>.json, never shipped:
     { key, kind: region|country|technique, name, verdict: pass|search, watchSearch, verifiedBy?: websearch|pack,
       checkedOn?: YYYY-MM-DD, video: { url, id, title, channel?, channelKind: company|person|unknown, label, watchFor },
       searches: [ { by: finder|checker, query, results: [ { url, title, channel } ] } ] }
   key is a region slug, a country key or a technique slug, and the file is named after it. verdict pass writes
     videos: [ { url: 'https://www.youtube.com/watch?v=' + id, id, label, channel (a company's only), channelKind,
                 watchFor, verifiedBy, checkedOn } ]
   and watchSearch; verdict search writes watchSearch alone and takes any videos off. A record with no evidence is
   left alone. A passing video must have passed the two-search rule: a finder search and a checker search with
   different queries, the checker's never holding the id (in any case) or watch?v=, and both result lists holding that id with the identical
   title; every channel a result shows for that id, in either search, must be one and the same name (23 October
   2026, the owner's rule: search results seldom print a channel, so a film whose channel no result shows ships as
   channelKind unknown, with our label only). A company or person channel must be that name, shown by at least
   one result. A title is compared as the film's own (titleKey): the " - YouTube" a search engine appends to every
   result's title is set aside on both sides, and nothing else is (measured on the evidence, 23 October 2026: the
   results print "<title> - YouTube" and the finder records "<title>"). Evidence whose key names no record in the fragments yet (a technique or a new article still in
   staging) is set aside and printed, never applied. With verifiedBy pack, the id must
   be a video of the house pack (house.videos, at OOT_SHARED/packs/brennans-new-orleans.v1.oothouse.json, or
   --pack). A company channel must be named exactly as companies.json names it; a person's channel, or one the
   searches never showed, never ships. checkedOn is the evidence's, else the
   date the record already carries for the same id, else --date, else today (UTC), so a second run changes nothing.
   Evidence that fails any rule refuses the whole run (exit 1, nothing written); --dry prints every write and
   writes nothing. Fragments are written as JSON with a one space indent and a final newline, only when changed. */
'use strict';
const fs = require('fs');
const path = require('path');
const CF = require(path.join(__dirname, 'check-fragment.cjs'));

const PACK_NAME = path.join('packs', 'brennans-new-orleans.v1.oothouse.json');

function own(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
/* the YouTube id a watch or youtu.be address names, or null; a Short or a playlist is never a video here */
function idOf(url) {
  const s = String(url || '');
  if (/\/shorts\//.test(s) || /[?&]list=/.test(s)) return null;
  let m = /^https?:\/\/(?:www\.|m\.)?youtube\.com\/watch\?(?:[^#]*&)?v=([A-Za-z0-9_-]{11})(?:[&#]|$)/.exec(s);
  if (!m) m = /^https?:\/\/youtu\.be\/([A-Za-z0-9_-]{11})(?:[?#]|$)/.exec(s);
  return m ? m[1] : null;
}
function norm(q) { return String(q || '').trim().replace(/\s+/g, ' ').toLowerCase(); }
/* A film's title as the two searches are held to it: trimmed, with the " - YouTube" a search engine appends to a
   result's title set aside; case, spelling and punctuation stay, so "identical" still means identical. */
function titleKey(t) { return typeof t === 'string' ? t.trim().replace(/\s+-\s+YouTube$/, '').trim() : ''; }

/* The house pack's videos by id (from each video's url): id to { title, channel }. */
function packIds(packPath) {
  const ids = new Map();
  if (!packPath || !fs.existsSync(packPath)) return null;
  const pack = JSON.parse(fs.readFileSync(packPath, 'utf8'));
  ((pack.house && pack.house.videos) || []).forEach((v) => { const id = idOf(v && v.url); if (id) ids.set(id, { title: v.title, channel: v.channel }); });
  return ids;
}

/* Every record a key may name, over the fragments: { key: { f, rec, kind } }. */
function indexRecords(frags, problems) {
  const at = {};
  const put = (key, f, rec, kind) => {
    if (!key) return;
    if (own(at, key)) { problems.push(key + ': names a record in ' + at[key].f + ' and in ' + f); return; }
    at[key] = { f, rec, kind };
  };
  frags.forEach((x) => {
    (x.frag.regions || []).forEach((r) => put(r && r.slug, x.f, r, 'region'));
    if (x.frag.country) put(x.frag.country.key, x.f, x.frag.country, 'country');
    (x.frag.countries || []).forEach((c) => put(c && c.key, x.f, c, 'country'));
    (x.frag.techniques || []).forEach((t) => put(t && t.slug, x.f, t, 'technique'));
  });
  return at;
}

/* One evidence file to the fields it writes, or problems. */
function readEvidence(ev, file, target, opts, pack) {
  const p = [];
  const w = path.basename(file);
  const say = (m) => p.push(w + ': ' + m);
  if (!ev || typeof ev !== 'object' || Array.isArray(ev)) { say('an object'); return { problems: p }; }
  if (ev.key !== path.basename(file, '.json')) say('key must be the file\'s name (' + path.basename(file, '.json') + '), found ' + JSON.stringify(ev.key));
  if (!target) { say('no region, country or technique in the fragments is keyed ' + JSON.stringify(ev.key)); return { problems: p }; }
  if (ev.kind !== target.kind) say('kind must be ' + target.kind + ' (' + ev.key + ' is a ' + target.kind + ' of ' + target.f + '), found ' + JSON.stringify(ev.kind));
  if (ev.name !== target.rec.name) say('name must be "' + target.rec.name + '", found ' + JSON.stringify(ev.name));
  if (['pass', 'search'].indexOf(ev.verdict) < 0) say('verdict: pass or search');
  if (typeof ev.watchSearch !== 'string') say('watchSearch: 3 to 8 words, the fallback search');
  else {
    const wsOut = [];
    CF.checkVideos({ watchSearch: ev.watchSearch }, 'evidence', wsOut);
    wsOut.forEach((m) => say(m));
    CF.voiceProblems(ev.watchSearch, 'watchSearch').concat(CF.proseProblems(ev.watchSearch, 'watchSearch')).forEach((m) => say(m));
  }
  if (ev.verdict !== 'pass') return { problems: p, write: { watchSearch: ev.watchSearch, videos: null } };
  const v = ev.video;
  if (!v || typeof v !== 'object') { say('video: the candidate that passed'); return { problems: p }; }
  if (typeof v.id !== 'string' || !CF.VIDEO_ID_RE.test(v.id)) say('video.id: an eleven character YouTube id');
  if (idOf(v.url) !== v.id) say('video.url must be a YouTube watch address of video.id (never a Short or a playlist): ' + JSON.stringify(v.url));
  const verifiedBy = ev.verifiedBy || v.verifiedBy || 'websearch';
  if (['websearch', 'pack'].indexOf(verifiedBy) < 0) say('verifiedBy: websearch or pack');
  if (verifiedBy === 'pack') {
    if (!pack) say('verifiedBy pack, but no house pack was found (pass --pack or set OOT_SHARED)');
    else if (!pack.has(v.id)) say('verifiedBy pack, but ' + v.id + ' is no video of the house pack');
    else if ((v.channelKind === 'company' || v.channelKind === 'person') && pack.get(v.id).channel !== v.channel) say('video.channel: the house pack names ' + JSON.stringify(pack.get(v.id).channel) + ' for ' + v.id + ', not ' + JSON.stringify(v.channel));
  } else {
    /* the two-search rule */
    const searches = Array.isArray(ev.searches) ? ev.searches : [];
    const finders = searches.filter((s) => s && s.by === 'finder');
    const checkers = searches.filter((s) => s && s.by === 'checker');
    if (!finders.length || !checkers.length) say('searches: a finder search and a checker search');
    if (typeof v.title !== 'string' || !v.title.trim()) say('video.title: the title as the results print it');
    const named = v.channelKind === 'company' || v.channelKind === 'person';
    if (named && (typeof v.channel !== 'string' || !v.channel.trim())) say('video.channel: the channel as the results print it (or channelKind unknown when no result shows one)');
    /* a search engine reads a query without regard to case, so the id in any case is the id (23 October 2026) */
    const holdsId = (q) => typeof v.id === 'string' && v.id !== '' && q.toLowerCase().indexOf(v.id.toLowerCase()) >= 0;
    checkers.forEach((c, i) => { if (typeof c.query !== 'string' || holdsId(c.query) || /watch\?v=/i.test(c.query)) say('searches: the checker\'s query ' + (i + 1) + ' holds the id; it searches the exact title and the channel, never the id'); });
    const shown = (r) => r && typeof r.channel === 'string' && r.channel.trim();
    const match = (r) => r && idOf(r.url) === v.id && titleKey(r.title) !== '' && titleKey(r.title) === titleKey(v.title);
    const holds = (s) => Array.isArray(s.results) && s.results.some(match);
    const ok = finders.some((f) => holds(f) && checkers.some((c) => holds(c) && typeof f.query === 'string' && typeof c.query === 'string' && norm(f.query) !== norm(c.query)));
    if (!ok) say('the two-search rule fails: a finder search and a checker search with different queries must both return ' + v.id + ' with the identical title');
    /* the channels the results show for this id, in both searches: one name at most, whatever the kind (a result
       showing another name means the searches disagree); a company or a person must be that name, shown at least once */
    const channels = [];
    searches.forEach((s) => (Array.isArray(s && s.results) ? s.results : []).forEach((r) => { if (r && idOf(r.url) === v.id && shown(r) && channels.indexOf(r.channel) < 0) channels.push(r.channel); }));
    if (channels.length > 1) say('video.channel: the results show ' + channels.length + ' channels for ' + v.id + ' (' + channels.map((c) => JSON.stringify(c)).join(', ') + '); a channel a result shows must be the same in both searches');
    if (named && channels.indexOf(v.channel) < 0) say('video.channel: no result shows ' + JSON.stringify(v.channel) + ' for ' + v.id + '; ship it as channelKind unknown');
  }
  const date = ev.checkedOn || v.checkedOn || ((target.rec.videos || []).find((x) => x && x.id === v.id) || {}).checkedOn || opts.date;
  const out = { url: CF.VIDEO_URL + v.id, id: v.id, label: v.label };
  if (v.channelKind === 'company') out.channel = v.channel;
  out.channelKind = v.channelKind;
  out.watchFor = v.watchFor;
  out.verifiedBy = verifiedBy;
  out.checkedOn = date;
  const vOut = [];
  CF.checkVideos({ videos: [out] }, 'video', vOut);
  vOut.forEach((m) => say(m));
  ['label', 'watchFor'].forEach((k) => CF.voiceProblems(out[k], 'video.' + k).concat(CF.proseProblems(out[k], 'video.' + k)).forEach((m) => say(m)));
  return { problems: p, write: { watchSearch: ev.watchSearch, videos: [out] } };
}

function run(opts) {
  const problems = [];
  const lines = [];
  const files = fs.existsSync(opts.fragments) ? fs.readdirSync(opts.fragments).filter((f) => /\.json$/.test(f)).sort() : [];
  const frags = files.map((f) => { const raw = fs.readFileSync(path.join(opts.fragments, f), 'utf8'); return { f, raw, frag: JSON.parse(raw) }; });
  const at = indexRecords(frags, problems);
  const evFiles = fs.existsSync(opts.videos) ? fs.readdirSync(opts.videos).filter((f) => /\.json$/.test(f)).sort() : [];
  let pack = null;
  try { pack = packIds(opts.pack); } catch (e) { problems.push('the house pack at ' + opts.pack + ': ' + e.message); }
  const tally = { pass: 0, pack: 0, search: 0, skipped: 0 };
  evFiles.forEach((ef) => {
    let ev;
    try { ev = JSON.parse(fs.readFileSync(path.join(opts.videos, ef), 'utf8')); } catch (e) { problems.push(ef + ': ' + e.message); return; }
    const target = ev && own(at, ev.key) ? at[ev.key] : null;
    /* evidence for a record the fragments do not hold yet (a technique or a new article still in staging) is set
       aside, never applied and never a refusal; its file must still be named after its key */
    if (!target && ev && typeof ev === 'object' && ev.key === path.basename(ef, '.json')) { tally.skipped++; lines.push('skip   ' + ef + ': no region, country or technique in the fragments is keyed ' + JSON.stringify(ev.key)); return; }
    const r = readEvidence(ev, path.join(opts.videos, ef), target, opts, pack);
    r.problems.forEach((x) => problems.push(x));
    if (r.problems.length || !r.write) return;
    const rec = target.rec;
    const before = JSON.stringify(rec);
    rec.watchSearch = r.write.watchSearch;
    if (r.write.videos) { rec.videos = r.write.videos; tally[r.write.videos[0].verifiedBy === 'pack' ? 'pack' : 'pass']++; }
    else { delete rec.videos; tally.search++; }
    if (JSON.stringify(rec) !== before) {
      frags.find((x) => x.f === target.f).changed = true;
      lines.push('write  ' + target.f + ': ' + ev.key + (r.write.videos ? ' video ' + r.write.videos[0].id + ' (' + r.write.videos[0].verifiedBy + ')' : ' search link only') + ', watchSearch "' + r.write.watchSearch + '"');
    }
  });
  const changed = frags.filter((x) => x.changed && JSON.stringify(x.frag, null, 1) + '\n' !== x.raw);
  return { problems, lines, changed, evidence: evFiles.length, tally };
}

module.exports = { run, readEvidence, idOf, packIds, titleKey };

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.indexOf('--help') >= 0 || args.indexOf('-h') >= 0) {
    console.log('usage: node .scripts/regions/apply-videos.cjs [--dry] [--fragments <dir>] [--videos <dir>] [--pack <path>] [--date YYYY-MM-DD]');
    console.log('  --dry        print every write and write nothing');
    console.log('  --fragments  the folder of fragments (default .scripts/regions/fragments)');
    console.log('  --videos     the folder of evidence files (default .scripts/regions/videos)');
    console.log('  --pack       the house pack (default OOT_SHARED/packs/..., else the site checkout beside this repo)');
    console.log('  --date       the checkedOn for a video whose evidence and record carry none (default today, UTC)');
    process.exit(0);
  }
  const opts = { dry: false, fragments: path.join(__dirname, 'fragments'), videos: path.join(__dirname, 'videos'), pack: null, date: new Date().toISOString().slice(0, 10) };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--dry') opts.dry = true;
    else if (a === '--fragments') opts.fragments = args[++i];
    else if (a === '--videos') opts.videos = args[++i];
    else if (a === '--pack') opts.pack = args[++i];
    else if (a === '--date') opts.date = args[++i];
    else { console.error('apply-videos: unknown argument ' + a); process.exit(2); }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(opts.date || '')) { console.error('apply-videos: --date YYYY-MM-DD'); process.exit(2); }
  if (!opts.pack) opts.pack = process.env.OOT_SHARED ? path.join(process.env.OOT_SHARED, PACK_NAME) : path.join(__dirname, '..', '..', '..', 'zpullen98-gif.github.io', 'shared', PACK_NAME);
  if (!fs.existsSync(opts.fragments)) { console.error('apply-videos: no fragments folder at ' + opts.fragments); process.exit(1); }
  const r = run(opts);
  r.lines.forEach((l) => console.log(l));
  if (r.problems.length) {
    r.problems.forEach((p) => console.log('refuse ' + p));
    console.log('\napply-videos: ' + r.problems.length + ' problem(s), nothing written');
    process.exit(1);
  }
  const head = 'apply-videos' + (opts.dry ? ' --dry' : '') + ': ' + r.evidence + ' evidence file(s) (' + r.tally.pass + ' passed by two searches, ' + r.tally.pack + ' from the pack, ' + r.tally.search + ' search links' + (r.tally.skipped ? ', ' + r.tally.skipped + ' set aside with no record yet' : '') + ')';
  if (!r.changed.length) { console.log(head + '; nothing to write'); process.exit(0); }
  if (!opts.dry) r.changed.forEach((x) => fs.writeFileSync(path.join(opts.fragments, x.f), JSON.stringify(x.frag, null, 1) + '\n'));
  console.log(head + '; ' + (opts.dry ? 'would write ' : 'wrote ') + r.changed.map((x) => x.f).join(', '));
  process.exit(0);
}
