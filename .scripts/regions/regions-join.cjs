#!/usr/bin/env node
/* regions-join: the one resolver a house wine's region string goes through.
   codex39's v39SlugFor mirrors slugFor below, rule for rule (the fold, the
   index and the steps are the same code); the gate (check-regions.js)
   counts the house's wines through this copy, so the two must never drift.
   It is written with var and function only so the mirror is a paste.

   The index holds a LIST of targets per folded key, so one key may name an
   article in each of two countries (la rioja is Spain's Rioja by alias and
   the Argentine La Rioja by name); the builder refuses two targets for one
   key inside one country. Within a list the order is: region names, then
   TERROIR rows, then aliases (for the country table: country keys and
   names, then rows, then aliases), each in the file's order.

   A target's country is its sheet's (an article) or itself (a country key);
   the four United States sheets (california, oregon, washington, new-york)
   are one country, and usa, us and united states name it.

   The rule, in order:
     1. fold the string (accents stripped, lower case, every run of anything
        but a letter or a digit one space), split on commas, drop the empty
        parts;
     2. find the string's country: the parts right to left, the first that is
        usa, us or united states, or a country key (hyphens read as spaces),
        a folded country name, or an alias or TERROIR row to country keys,
        whose targets lie in one country; none means any country;
     3. MOST SPECIFIC FIRST, the parts left to right: a part that is exactly a
        folded region name, an alias to an article or a folded TERROIR row
        name resolves to the first of its articles in the string's country
        (an article of another country is refused);
     4. else the parts left to right again, by containment: a part that holds
        a key with an article in that country as whole words (the longest
        such key wins), or that is itself held in one as whole words (the
        shortest such key wins; a hit of the first kind beats one of the
        second). An exact country part is skipped here, so France alone
        cannot become South West France; other parts still find their region;
     5. else the parts left to right on the country table, exactly first,
        then by the same containment, in the string's country;
     6. else nothing.
   So Elgin, Cape South Coast, South Africa is elgin before the cape south
   coast alias, Rioja Alta, La Rioja, Spain is rioja, and Fleurie,
   Beaujolais, Burgundy, France is beaujolais.
   Usage as a script: node .scripts/regions/regions-join.cjs <jsDir> "<region string>" */
'use strict';

var US_SHEETS = ['california', 'oregon', 'washington', 'new-york'];
var US_WORDS = ['usa', 'us', 'u s', 'u s a', 'united states', 'united states of america'];

function fold(s) {
  var t = String(s == null ? '' : s);
  try { t = t.normalize('NFD'); } catch (e) { }
  return t.replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/* A country key to its country: the four US sheets are one. */
function countryGroup(key) {
  return US_SHEETS.indexOf(key) >= 0 ? 'usa' : String(key == null ? '' : key);
}

function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
/* A join value (a target, or a list of targets in different countries) as a list. */
function targetList(v) {
  var out = [], i;
  if (typeof v === 'string') { if (v) out.push(v); }
  else if (Array.isArray(v)) { for (i = 0; i < v.length; i++) if (typeof v[i] === 'string' && v[i] && out.indexOf(v[i]) < 0) out.push(v[i]); }
  return out;
}
function addTarget(table, key, t) {
  if (!key || !t) return;
  if (!own(table, key)) table[key] = [];
  if (table[key].indexOf(t) < 0) table[key].push(t);
}

/* The folded lookup tables, built once from REGIONS (memoise on the object in the app). */
function joinIndex(R) {
  var article = {};
  var country = {};
  var group = {};
  var words = {};
  var regions = (R && R.regions) || [];
  var countries = (R && R.countries) || {};
  var join = (R && R.join) || {};
  var terroir = join.terroir || {};
  var aliases = join.aliases || {};
  var keys = {};
  var i, j, k, list;
  for (k in countries) if (own(countries, k) && countries[k] && typeof countries[k] === 'object') { keys[k] = 1; group[k] = countryGroup(k); }
  for (i = 0; i < regions.length; i++) {
    if (regions[i] && regions[i].name && regions[i].slug) {
      group[regions[i].slug] = countryGroup(regions[i].sheet);
      addTarget(article, fold(regions[i].name), regions[i].slug);
    }
  }
  for (k in keys) if (own(keys, k)) {
    addTarget(country, fold(k), k);
    if (countries[k].name) addTarget(country, fold(countries[k].name), k);
  }
  for (k in terroir) if (own(terroir, k)) {
    list = targetList(terroir[k]);
    for (j = 0; j < list.length; j++) addTarget(keys[list[j]] ? country : article, fold(k), list[j]);
  }
  for (k in aliases) if (own(aliases, k)) {
    list = targetList(aliases[k]);
    for (j = 0; j < list.length; j++) addTarget(keys[list[j]] ? country : article, fold(k), list[j]);
  }
  for (i = 0; i < US_WORDS.length; i++) words[US_WORDS[i]] = 'usa';
  return { article: article, country: country, group: group, words: words, articleKeys: Object.keys(article), countryKeys: Object.keys(country) };
}

function containsWords(outer, inner) {
  return (' ' + outer + ' ').indexOf(' ' + inner + ' ') >= 0;
}

/* The first target of a list in the country, or the first of all when the country is unknown. */
function pick(list, where, index) {
  var i;
  if (!list || !list.length) return null;
  if (!where) return list[0];
  for (i = 0; i < list.length; i++) if (index.group[list[i]] === where) return list[i];
  return null;
}

/* A part against a table by containment, in the country: the longest key the part holds, else the shortest key that holds the part. */
function byContainment(part, table, tableKeys, where, index) {
  var best = null, bestLen = 0, j, key;
  for (j = 0; j < tableKeys.length; j++) {
    key = tableKeys[j];
    if (key !== part && key.length > bestLen && containsWords(part, key) && pick(table[key], where, index)) { best = key; bestLen = key.length; }
  }
  if (best) return pick(table[best], where, index);
  bestLen = 0;
  for (j = 0; j < tableKeys.length; j++) {
    key = tableKeys[j];
    if (key !== part && (bestLen === 0 || key.length < bestLen) && containsWords(key, part) && pick(table[key], where, index)) { best = key; bestLen = key.length; }
  }
  return best ? pick(table[best], where, index) : null;
}

function splitParts(region) {
  var raw = String(region == null ? '' : region).split(',');
  var parts = [];
  var i, p;
  for (i = 0; i < raw.length; i++) { p = fold(raw[i]); if (p) parts.push(p); }
  return parts;
}

/* The string's country: the parts right to left, the first that names one country; '' when none does. */
function countryOf(parts, index) {
  var i, j, list, g, many;
  for (i = parts.length - 1; i >= 0; i--) {
    if (own(index.words, parts[i])) return index.words[parts[i]];
    if (!own(index.country, parts[i])) continue;
    list = index.country[parts[i]];
    g = index.group[list[0]] || '';
    many = false;
    for (j = 1; j < list.length; j++) if (index.group[list[j]] !== g) many = true;
    if (g && !many) return g;
  }
  return '';
}

/* The resolver. Returns { slug, how } for an article, { key, how } for a country, or null. */
function slugFor(region, index) {
  var parts = splitParts(region);
  var where = countryOf(parts, index);
  var i, hit;
  for (i = 0; i < parts.length; i++) {
    hit = own(index.article, parts[i]) ? pick(index.article[parts[i]], where, index) : null;
    if (hit) return { slug: hit, how: 'exact' };
  }
  for (i = 0; i < parts.length; i++) {
    if (own(index.country, parts[i]) && pick(index.country[parts[i]], where, index)) continue;
    hit = byContainment(parts[i], index.article, index.articleKeys, where, index);
    if (hit) return { slug: hit, how: 'containment' };
  }
  for (i = 0; i < parts.length; i++) {
    hit = own(index.country, parts[i]) ? pick(index.country[parts[i]], where, index) : null;
    if (hit) return { key: hit, how: 'country' };
  }
  for (i = 0; i < parts.length; i++) {
    hit = byContainment(parts[i], index.country, index.countryKeys, where, index);
    if (hit) return { key: hit, how: 'country containment' };
  }
  return null;
}

module.exports = { fold, joinIndex, slugFor, splitParts, containsWords, byContainment, countryOf, countryGroup, targetList, pick, US_SHEETS, US_WORDS };

if (require.main === module) {
  var fs = require('fs');
  var path = require('path');
  var vm = require('vm');
  var jsDir = process.argv[2];
  var region = process.argv[3];
  if (!jsDir || region === undefined) { console.error('usage: regions-join.cjs <jsDir> "<region string>"'); process.exit(2); }
  var ctx = {}; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(jsDir, 'data-regions.js'), 'utf8'), ctx, { filename: 'data-regions.js' });
  var r = slugFor(region, joinIndex(ctx.REGIONS));
  console.log(JSON.stringify(r));
}
