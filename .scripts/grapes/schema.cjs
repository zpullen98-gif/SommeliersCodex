#!/usr/bin/env node
/* schema: the one validator of a grape's fragment and of the roster of the Grapes tab at the table (codex57).

     const S = require('./schema.cjs');
     const plan = S.loadPlan();                       // .scripts/grapes/plan.json
     const problems = S.validate(fragment, plan);     // [] when sound
     const notes = S.advise(fragment, plan);          // never a failure: what a second reader should look at

   Every problem names its field first and then the rule ("lines.s45: 84 words, 90 to 110"). build-grapes.cjs refuses
   a fragment that fails here, and the gate reads the same rules, so each lives once. Nothing here writes a file.

   The voice is the Codex's own. The dash, glyph and American spelling tests are build-cms.cjs's (dashProblems,
   americanProblems), the retired word, the numbered level and the prose spellings are check-fragment.cjs's
   (voiceProblems, proseProblems) and the superlative list is check-fragment.cjs's SUPERLATIVE, here a failure and
   never a note: they are required and reused, never copied. The rules of its own are below, each a named constant:
   the caps (CAPS, the one statement of every limit), the glass families (GLASS_FAMILIES), the generic refusal
   (GENERIC_NOTE, GENERIC_PROSE), the spoken line rules, the degree sign, the price, the volatile fact, the producer
   and the people tests.

   node .scripts/grapes/schema.cjs --caps prints the caps and the families as the brief states them. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const CF = require(path.join(__dirname, '..', 'regions', 'check-fragment.cjs'));
const CMS = require(path.join(__dirname, '..', 'cms', 'build-cms.cjs'));

const DIR = __dirname;
const ROOT = path.join(__dirname, '..', '..');
const JS_DIR = path.join(ROOT, 'js');

/* ---- the roster's own words ---- */
const COLOURS = ['white', 'red'];
const KINDS = ['grape', 'family'];
const STATUSES = ['full', 'thin', 'new'];
const MODES = ['contrast', 'home'];
const WORLDS = ['old', 'new', 'both'];
const CHUNKS = ['pilots', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12'];
const ROSTER = 75;
const PLAN_ROW_FIELDS = ['slug', 'name', 'colour', 'kind', 'chunk', 'status', 'mode', 'modeWhy', 'aliases', 'world', 'court', 'neighbours'];
/* the id prefix of a table card and a table question: nothing else in the Codex mints with it (build-grapes proves it) */
const ID_PREFIX = 'gt-';
const ID_RE = /^gt-[0-9a-z]{8}$/;

/* ---- a fragment's fields, in the order the build ships them ---- */
const FIELDS = ['slug', 'name', 'colour', 'kind', 'aliases', 'notIn', 'say', 'lines', 'glass', 'worlds', 'service', 'food', 'labels', 'guest', 'compare', 'profile', 'targets', 'cards', 'questions', 'sources'];
/* provenance: read by the checker and the integrator, never shipped */
const PROVENANCE = ['sayWhy', 'report', 'checked'];
/* copied from the grape's row of plan.json, exactly */
const COPIED = ['name', 'colour', 'kind', 'aliases'];
const LINE_FIELDS = ['s10', 's20', 's45', 'sale'];
const GLASS_FIELDS = ['lead', 'notes', 'ladder', 'structure'];
const CLIMATES = ['cool', 'moderate', 'warm'];
const SIDE_FIELDS = ['where', 'glass', 'cellar'];
const CONTRAST_FIELDS = ['old', 'new', 'why', 'blur', 'call'];
const HOME_FIELDS = ['home', 'abroad'];
const SERVICE_FIELDS = ['temp', 'glass', 'decant', 'age'];
const PROFILE_FIELDS = ['c', 'st', 'fruit', 'other', 'tell', 'regions', 'confuse'];
const QUESTION_FIELDS = ['q', 'opts', 'a', 'exp', 'tag'];
const QUESTION_TAGS = ['worlds'];

/* The glass families, chosen once (9 November 2026). A group's family is one of these words, written exactly, and the
   page prints it as the group's label; it is the only place a family word may stand alone. */
const GLASS_FAMILIES = [
  'citrus', 'orchard fruit', 'stone fruit', 'tropical fruit', 'red fruit', 'black fruit', 'blue fruit', 'dried fruit',
  'floral', 'herbal', 'spice', 'earth', 'mineral', 'savoury', 'nutty', 'honeyed', 'lees and cellar', 'oak', 'age'
];
/* what each family holds, for the brief and for a reader of a refusal */
const FAMILY_NAMES_THE_THING = {
  'citrus': 'lemon zest, Meyer lemon, lime cordial, pink grapefruit, bergamot',
  'orchard fruit': 'green apple, russet apple, ripe pear, quince',
  'stone fruit': 'white peach, nectarine, apricot kernel',
  'tropical fruit': 'pineapple, mango, passion fruit, guava, lychee, honeydew melon',
  'red fruit': 'sour cherry, wild strawberry, raspberry, cranberry, redcurrant',
  'black fruit': 'cassis, blackberry, black plum, bilberry',
  'blue fruit': 'blueberry, damson, boysenberry',
  'dried fruit': 'raisin, dried fig, prune, date',
  'floral': 'violet, rose petal, orange blossom, acacia, honeysuckle, elderflower',
  'herbal': 'cut grass, green bell pepper, mint, eucalyptus, bay leaf, thyme, tomato leaf',
  'spice': 'cracked black pepper, clove, liquorice, star anise, cinnamon',
  'earth': 'forest floor, dried leaves, truffle, tar, leather',
  'mineral': 'wet slate, crushed chalk, struck flint, oyster shell',
  'savoury': 'cured meat, black olive, bacon fat, soy',
  'nutty': 'bitter almond, marzipan, walnut',
  'honeyed': 'acacia honey, beeswax, orange marmalade, saffron',
  'lees and cellar': 'brioche, bread dough, fresh cream, butter, struck match',
  'oak': 'vanilla pod, toasted hazelnut, cedar, coconut, coffee, wood smoke',
  'age': 'petrol, dried mushroom, toast, old leather'
};

/* Every limit, in words unless named otherwise. A pair is [least, most]. */
const CAPS = {
  say: 14,
  lines: { s10: [12, 25], s20: [25, 50], s45: [90, 110], sale: [15, 45] },
  lineSentences: { s10: [1, 1], s20: [2, 2], s45: [4, 8], sale: [2, 2] },
  lineSentenceWords: 32, /* no sentence of a spoken line runs longer: it must be said in a breath */
  lineList: 3, /* no list longer than three in a spoken line */
  s45NameWithin: 5, /* the forty-five second line opens on the grape's name: within its first five words */
  glass: { lead: [8, 28], groups: [3, 6], notes: [2, 4], noteWords: [1, 4], ladder: [2, 3], where: [2, 12], structure: [6, 30] },
  contrast: { where: [2, 12], glass: [15, 40], cellar: [8, 30], why: [15, 40], blur: [10, 30], call: [8, 25] },
  home: { home: [25, 60], abroad: [8, 40] },
  service: [3, 20],
  food: { with: [3, 5], dish: [1, 8], why: [3, 12] },
  labels: { n: [2, 5], term: [1, 5], means: [4, 20] },
  guest: { n: [2, 4], q: [3, 20], a: [8, 40] },
  compare: { n: [1, 3], tell: [8, 30] },
  profile: [2, 30],
  targets: [1, 12],
  notIn: 12,
  cards: { n: 3, front: [6, 14], back: [2, 40] },
  questions: { n: 3, stem: [8, 55], option: [1, 12], exp: [8, 45] },
  sources: { n: [2, 4], title: [2, 20], web: 1 },
  entry: 900 /* the reading words a page shows: lines, glass, worlds, service, food, labels, guest and the compare tells */
};

/* ---- small readers ---- */
function isStr(v) { return typeof v === 'string'; }
function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
function isList(v) { return Array.isArray(v); }
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function words(s) { return CF.words(s); }
function fold(s) { return CF.fold(s); }
function hasPhrase(text, term) { const t = fold(term); return !!t && (' ' + fold(text) + ' ').indexOf(' ' + t + ' ') >= 0; }
/* The sentences of a string. A stop inside a run of initials or after a short title does not end one. */
function sentenceList(s) {
  const HOLD = String.fromCharCode(1);
  const t = String(s == null ? '' : s).trim()
    .replace(/\b(?:[A-Z]\.){2,}/g, (m) => m.replace(/\./g, HOLD))
    .replace(/\b(?:St|Ste|Mt|No|Dr|Mr|Mrs|Ms|Jr|Sr|vs|ca)\./g, (m) => m.replace(/\./g, HOLD))
    .replace(/\b([A-Z])\.(?=\s+[A-Z])/g, '$1' + HOLD);
  if (!t) return [];
  const out = [];
  const re = /[^.!?]*[.!?]+["'’”)\]]*(?=\s|$)|[^.!?]+$/g;
  let m;
  while ((m = re.exec(t))) { const x = m[0].trim(); if (x) out.push(x.split(HOLD).join('.')); if (re.lastIndex >= t.length) break; }
  return out;
}
function sentences(s) { return sentenceList(s).length; }
/* the words that name a grape: the parts of its roster name (a bracket dropped, a slash parting two names) and its aliases */
function nameParts(name) { return String(name == null ? '' : name).replace(/\([^)]*\)/g, ' ').split('/').map((p) => p.trim()).filter(Boolean); }
function terms(row) { return nameParts(row && row.name).concat(isList(row && row.aliases) ? row.aliases : []); }
function namesGrape(text, row) { return terms(row).some((t) => hasPhrase(text, t)); }
function firstWords(s, n) { return String(s || '').trim().split(/\s+/).slice(0, n).join(' '); }

function loadPlan(file) { return JSON.parse(fs.readFileSync(file || path.join(DIR, 'plan.json'), 'utf8')); }
function rowOf(plan, slug) { return (plan && isList(plan.grapes) ? plan.grapes : []).find((g) => g && g.slug === slug) || null; }

/* ---- what the Codex already holds: the Court's respellings, the regions a target may name, its own producers ---- */
const FACTS = {};
function runData(jsDir, file, expose) {
  const p = path.join(jsDir, file);
  if (!fs.existsSync(p)) return null;
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(p, 'utf8') + '\n;this.__out = ' + expose + ';', ctx, { filename: file });
  return ctx.__out;
}
/* A producer of the Codex's own list that a sentence could name by accident is no test: a vineyard, an appellation or
   a wine's printed name is left to the reader (PRODUCER_SKIP), and so is a single word that is also a place or a word. */
const PRODUCER_SKIP = /^(?:Clos|Le|La|Les|L['’]|Chablis|Chambertin|Gevrey|Vosne|Savennières|Châteauneuf|Côte|Ermitage|Hermitage|Amarone|Barbaresco|Barolo|Franciacorta|Valdobbiadene|Brunello|Trebbiano|Tokaji|Tokaj|Niederhäuser|Ried|Wehlener|Vintage|Gran|Castillo|Vin|Mount|Chalk|Dry|Monte|Cask|Hill|Sorì|Ben|Flaccianello|Inocente|Barca|Kracher|Rare|Wine|Y)\b/;
const PRODUCER_SINGLE_SKIP = ['Musigny', 'Corton-Charlemagne', 'Romanée-Conti', 'Château-Grillet', 'Château-Fuissé', 'Scharzhofberger', 'Salon', 'COS', 'Rivera', 'Ferrari', 'Cristal', 'Sassicaia', 'Feist', 'Broadbent', 'Argyle', 'Rockford', 'Insignia', 'Dominus', 'Graci', 'Bucci', 'Almaviva'];
function facts(jsDir) {
  const dir = path.resolve(jsDir || JS_DIR);
  if (FACTS[dir]) return FACTS[dir];
  const f = { dir, gridSay: {}, regions: new Set(), countries: new Set(), producers: [] };
  try { f.gridSay = runData(dir, 'data-grid.js', 'GRID_SAY') || {}; } catch (e) { f.gridSay = {}; }
  try {
    const R = runData(dir, 'data-regions.js', '({ regions: REGIONS.regions.map(function (r) { return r.slug; }), countries: Object.keys(REGIONS.countries) })');
    if (R) { R.regions.forEach((s) => f.regions.add(s)); R.countries.forEach((s) => f.countries.add(s)); }
  } catch (e) { /* a tree with no regions data: a target cannot be proved there */ }
  try {
    const names = runData(dir, 'data-producers.js', '(typeof WINE_PRODUCERS !== "undefined" ? WINE_PRODUCERS : []).map(function (p) { return p.p; })') || [];
    const seen = {};
    names.forEach((n) => {
      if (!isStr(n)) return;
      const name = n.split(' (')[0].trim();
      if (!name || name.length < 4 || name.indexOf(',') >= 0 || seen[name] || PRODUCER_SKIP.test(name)) return;
      if (!/\s/.test(name) && PRODUCER_SINGLE_SKIP.indexOf(name) >= 0) return;
      seen[name] = 1; f.producers.push(name);
    });
  } catch (e) { f.producers = []; }
  FACTS[dir] = f;
  return f;
}

/* ---- the voice: rules of this pipeline's own ---- */
const DEGREE = /[°º˚℃℉]/;
const PER_CENT_SIGN = /%/;
const PRICE = /[$£€¥¢]|\b(?:price[ds]?|pricing|pricey|costs?|costly|dollars?|euros?|cheap(?:er|est|ly)?|expensive|inexpensive|bargains?|value for money|good value|affordable|budget|splurge|retail(?:s|ing)?)\b/i;
const VOLATILE = /\b(?:hectares?|acres?|acreage|plantings?|most (?:widely )?planted|(?:second|third|fourth|fifth) most|ranks?|ranked|rankings?|allocat\w*|owned by|now owns?|bought by|sold to|acquired by|was acquired|acquisition|sold out|in stock|market share|best[- ]selling|top[- ]selling)\b/i;
/* the house list of check-fragment.cjs, and the words that sell where a tableside line should teach */
const SUPERLATIVE_MORE = /\b(?:noblest|grandest|most (?:celebrated|prized|revered|renowned|sought|popular|important|prestigious|noble|loved|beloved|admired|coveted)|world[’']s|world famous|world renowned|renowned|unrivall?ed|unparalleled|peerless|ultimate|quintessential|king of|queen of|holy grail|cult|sought[- ]after|award[- ]winning|unbeatable|unsurpassed|second to none)\b/i;
const NUMBERED_LEVEL = /\bLevel\s+(?:I|II|III|IV|[1-4]|one|two|three|four)\b/i;
const HYPHEN_RANGE = /(?<![\d-])\d+\s?-\s?\d+(?![\d-])/;
const SPACED_HYPHEN = /\s-\s/;
const HOUSE_NAME = /Brennan/i;
/* American forms beyond check-fragment's list that a page about grapes reaches for */
const AMERICAN_MORE = /\b(?:fibers?|odors?|somber|meager|luster|theaters?|maneuvers?|licorice|chilis?|favor(?:s|ed|able|ably)?|behaviors?|rigor|candor|splendor|glamor|traveling|labeling|barreled|barreling|leveled|fueled|marveled|jeweled|channeled|funneled|offense|pretense|dialog|analog|enroll|willful|woolen|aluminum|afterward|(?:caramel|crystall|harmon|popular|pasteur|standard|author|general|modern|neutral|carbon|central|local|natural|commercial|categor|critic|final|legal|summar|synthes|symbol|util|fertil|homogen|personal|aromat|vapor|mineral|priorit|maxim|minim|civil)iz(?:e|es|ed|ing|ation|ations))\b/i;
/* A producer by its form: a house word and then a name, or a name and then a company word. */
const PRODUCER_PREFIX = /\b(?:Ch[âa]teau|Domaine|Maison|Bodegas?|Weingut|Tenuta|Cantina|Azienda|Quinta|Fattoria|Podere|Castello|Marchesi|Viña|Viñedos|Schloss|Kloster|Herdade|Adega)\s+(?:d[eu]s?\s+|de\s+la\s+|del(?:la|le)?\s+|di\s+|do\s+|da\s+|dos\s+|l[’']|d[’'])?[A-Z]/;
const PRODUCER_SUFFIX = /\b[A-Z][A-Za-zÀ-ɏ'’-]+\s+(?:Winery|Wineries|Vineyards|Cellars?|Wine\s+Company|Wine\s+Co|Family\s+Wines|Family\s+Vineyards|Family\s+Estate|et\s+Fils|Père\s+et\s+Fils|Frères|&\s+Sons|and\s+Sons|&\s+Fils|&\s+Cie)\b/;
/* A person by a title or a trade and then a name: nobody living is named, and the long dead need no title. */
const NAMED_ROLE = /\b(?:Mr|Mrs|Ms|Dr|Prof|Professor|Sir|Dame|Baron|Baroness|Madame|Monsieur|Mme)\.?\s+[A-Z][a-zà-ɏ]+|\b(?:winemakers?|oenologists?|enologists?|consultants?|critics?|proprietors?|chefs?|sommeliers?|viticulturists?|vignerons?|négociants?|founders?|Master of Wine|Master Sommelier)\s+[A-Z][a-zà-ɏ]+\s+(?:(?:de|du|von|van|di|della|d[’'])\s*)?[A-Z][a-zà-ɏ]+/;
/* The living writers and scientists a grape page is most often tempted to cite, in prose, a title or an address. */
const LIVING = /jancis\s?-?robinson|robert\s?-?(?:m\.?\s)?parker|james\s?-?suckling|tim\s?-?atkin|jeb\s?-?dunnuck|karen\s?-?macneil|hugh\s?-?johnson|oz\s?-?clarke|andrew\s?-?jefford|tom\s?-?stevenson|eric\s?-?asimov|antonio\s?-?galloni|madeline\s?-?puckette|ian\s?-?d[’']?agata|julia\s?-?harding|jos[eé]\s?-?vouillamoz|kevin\s?-?zraly|stephen\s?-?brook|jasper\s?-?morris|peter\s?-?liem|wink\s?-?lorch|carole\s?-?meredith|john\s?-?bowers|jamie\s?-?goode|jon\s?-?bonn[eé]|michel\s?-?rolland|richard\s?-?juhlin|essi\s?-?avellan|james\s?-?halliday|matt\s?-?kramer|lisa\s?-?perrotti/i;

/* The spoken lines (lines.s10, s20, s45 and sale): what cannot be said at a table. */
const LINE_BRACKET = /[()\[\]{}]/;
const LINE_ABBREVIATION = /\b(?:e\.g|i\.e|etc|vs|approx|ABV|MLF|RS|TA|pH|AOC|AOP|DOCG|DOC|DOP|DO|DOCa|IGT|IGP|AVA|GI|VDP|QbA|GG|VDN|NV|MW|MS)\b|[&/+=<>#@*]/;
const LINE_ALCOHOL = /\b(?:ABV|abv|alcohol by volume|proof)\b|\d[\d.,]*\s*(?:per cent|%)[^.!?]*\balcohol\b|\balcohol\b[^.!?]*\d[\d.,]*\s*(?:per cent|%)/i;
/* never said to a guest, explained or not */
const LINE_JARGON = /\b(?:pyrazines?|methoxypyrazines?|terpenes?|thiols?|rotundone|phenolics?|autolysis|autolytic|brettanomyces|brett|volatile acidity|malolactic conversion|bâtonnage|batonnage|élevage|elevage|typicity|organoleptic|anthocyanins?|polyphenols?|must weight|titratable|chaptalis\w+)\b/i;
/* a second reader looks at these: fine when the same breath explains them */
const LINE_JARGON_SOFT = /\b(?:malolactic|lees|botrytis|carbonic|dosage|terroir|tirage|disgorg\w+|riddling|skin contact|whole bunch|whole cluster|reductive|oxidative|flor|solera|cuv[eé]e|lieu-dit|monopole|appellation)\b/i;
/* an absolute where a typical style is being described */
const ABSOLUTE = /\b(?:always|never|invariably|without exception|every single|all Old World|all New World)\b/i;
const HEDGE = /\b(?:tends?|tend to|typically|usually|often|generally|as a rule|more often|in the main|most|many|commonly|likely|can|may|leans?)\b/i;

/* ---- the generic refusal ----
   A family word may stand alone only as a group's family. As a whole note (glass.notes, glass.ladder) and standing
   alone between commas or beside an "and" in the prose that describes the glass, it is refused: name the thing. */
const NOTE_FILLER = /\s+(?:notes?|aromas?|flavours?|tones?|characters?|hints?|nuances?|scents?)$/;
const GENERIC_NOTE = [
  'citrus', 'citrus fruit', 'citrus fruits', 'citrusy', 'citrus zest', 'citrus peel', 'citrus pith', 'citrus oil', 'citrus blossom', 'citrus rind',
  'orchard fruit', 'orchard fruits', 'tree fruit', 'tree fruits', 'pome fruit', 'stone fruit', 'stone fruits', 'tropical fruit', 'tropical fruits', 'exotic fruit', 'exotic fruits',
  'red fruit', 'red fruits', 'red berry', 'red berries', 'red berry fruit', 'black fruit', 'black fruits', 'dark fruit', 'dark fruits', 'black berries', 'dark berries', 'black berry fruit',
  'blue fruit', 'blue fruits', 'dried fruit', 'dried fruits', 'fruit', 'fruits', 'fruity', 'ripe fruit', 'fresh fruit', 'berry', 'berries', 'mixed berries', 'berry fruit', 'white fruit', 'yellow fruit',
  'floral', 'florals', 'flower', 'flowers', 'white flower', 'white flowers', 'blossom', 'blossoms', 'spring flowers', 'white blossom',
  'herbal', 'herbs', 'herb', 'herbaceous', 'green', 'green notes', 'fresh herbs', 'dried herbs', 'garden herbs', 'vegetal',
  'spice', 'spices', 'spicy', 'spiced', 'baking spice', 'baking spices', 'sweet spice', 'sweet spices', 'warm spice', 'warm spices', 'exotic spice', 'exotic spices', 'brown spice', 'brown spices', 'oak spice',
  'mineral', 'minerals', 'minerality', 'minerally',
  'oak', 'oaky', 'oaked', 'new oak', 'old oak', 'wood', 'woody',
  'earth', 'earthy', 'earthiness',
  'savoury', 'savory', 'nutty', 'nuts', 'nut', 'honeyed', 'age', 'aged', 'lees', 'lees and cellar', 'cellar'
];
const GENERIC_PROSE = [
  'citrus', 'citrus fruit', 'citrus fruits', 'citrusy', 'orchard fruit', 'orchard fruits', 'tree fruit', 'tree fruits', 'stone fruit', 'stone fruits', 'tropical fruit', 'tropical fruits',
  'red fruit', 'red fruits', 'red berries', 'red berry fruit', 'black fruit', 'black fruits', 'dark fruit', 'dark fruits', 'dark berries', 'blue fruit', 'blue fruits', 'dried fruit', 'dried fruits',
  'floral', 'flowers', 'white flowers', 'blossom', 'spice', 'spices', 'spicy', 'baking spice', 'baking spices', 'sweet spice', 'sweet spices',
  'mineral', 'minerals', 'minerality', 'oak', 'oaky', 'earth', 'earthy', 'herbal', 'herbs', 'herbaceous'
];
/* the words in front of a list item that leave it as generic as it was */
const ITEM_LEAD = /^(?:(?:and|or|then|plus|with|of|the|a|an|its|some|more|less|much|little|a little|a touch of|a hint of|hints of|notes of|aromas of|flavours of|lots of|plenty of|layers of|ripe|riper|fresh|bright|soft|gentle|light|subtle|sweet|pure|simple|just|even|often|sometimes|always)\s+)+/;
/* the fields that describe the glass, where the prose rule holds; the cellar, the causes, the service, the food and the
   label are about making and serving, where "oak" and "spice" are things and not notes */
function tastePath(where) {
  return /^(?:lines\.|glass\.(?:lead|structure)|worlds\.contrast\.(?:old|new)\.glass|worlds\.contrast\.(?:blur|call)|worlds\.home\.|guest\[|compare\[\d+\]\.tell|profile\.(?:fruit|other|tell|confuse)|cards\[|questions\[)/.test(where);
}
function genericNote(note) {
  let f = fold(note);
  if (GENERIC_NOTE.indexOf(f) >= 0) return f;
  const cut = f.replace(NOTE_FILLER, '');
  if (cut !== f && (GENERIC_NOTE.indexOf(cut) >= 0 || GLASS_FAMILIES.indexOf(cut) >= 0)) return cut;
  if (GLASS_FAMILIES.indexOf(f) >= 0) return f;
  return '';
}
/* the items of a sentence that reads as a list: between commas, semicolons, colons, middle dots and beside and, or */
function proseItems(s) {
  return String(s || '').split(/[,;:.!?·()]|\s(?:and|or|with|over|then|plus|but)\s/i).map((x) => fold(x).replace(ITEM_LEAD, '').trim()).filter(Boolean);
}
function genericInProse(s) {
  const hit = [];
  proseItems(s).forEach((it) => { if (GENERIC_PROSE.indexOf(it) >= 0 && hit.indexOf(it) < 0) hit.push(it); });
  return hit;
}
function nameTheThing(word) {
  const fam = GLASS_FAMILIES.find((g) => word === g || word.indexOf(g.split(' ')[0]) === 0) || (/(berr|fruit)/.test(word) ? (/(black|dark)/.test(word) ? 'black fruit' : 'red fruit') : /flower|blossom|floral/.test(word) ? 'floral' : /spic/.test(word) ? 'spice' : /herb|green|veget/.test(word) ? 'herbal' : /wood|oak/.test(word) ? 'oak' : /earth/.test(word) ? 'earth' : /mineral/.test(word) ? 'mineral' : '');
  return fam && FAMILY_NAMES_THE_THING[fam] ? ' (' + FAMILY_NAMES_THE_THING[fam] + ')' : '';
}

/* a list longer than three in one sentence: "lemon, apple, peach and cream", or four set off by commas alone */
const CLAUSE_LEAD = /^(?:in|on|at|from|with|by|for|when|where|while|but|so|then|which|who|that|and|or|yet|as|if|though|because|since|until|after|before|like|unlike)\b/i;
function longList(sentence, most) {
  const segs = String(sentence || '').split(/,\s*/).map((x) => x.trim());
  let run = 0;
  for (let i = 1; i < segs.length; i++) {
    const seg = segs[i];
    const closer = seg.match(/^((?:\S+\s+){0,3}\S+)\s+(?:and|or)\s+\S/i);
    const plainShort = !!seg && words(seg.replace(/[.!?]+$/, '')) <= 4 && !/\b(?:and|or)\b/i.test(seg) && !CLAUSE_LEAD.test(seg);
    if (closer && !CLAUSE_LEAD.test(seg)) { if (1 + run + 2 > most) return true; run = 0; }
    else if (plainShort) { run++; if (1 + run > most) return true; }
    else run = 0;
  }
  return false;
}

/* ---- the voice walk: every string of a fragment ---- */
function pathKind(where) {
  if (/^sources\[\d+\]\.url$/.test(where)) return 'url';
  if (/^sources\[\d+\]\.title$/.test(where)) return 'title';
  if (/^(?:sayWhy|report\[\d+\]|checked)/.test(where)) return 'provenance';
  if (/^(?:slug|colour|kind|aliases\[\d+\]|notIn\[\d+\]|targets\[\d+\]|compare\[\d+\]\.slug|glass\.notes\[\d+\]\.family|glass\.ladder\[\d+\]\.climate|questions\[\d+\]\.tag|profile\.c|name|say)$/.test(where)) return 'key';
  return 'prose';
}
function tidyProblems(s, where) {
  const out = [];
  if (s !== s.trim()) out.push(where + ': a space at an end');
  if (/\s{2,}|[\t\n\r]/.test(s)) out.push(where + ': two spaces together, a tab or a line break');
  return out;
}
function producerProblems(s, where, f) {
  const out = [];
  const a = s.match(PRODUCER_PREFIX) || s.match(PRODUCER_SUFFIX);
  if (a) out.push(where + ': "' + a[0] + '" reads as a producer (no producer is named in an entry: the house\'s own bottles are drawn live)');
  const letter = /[A-Za-zÀ-ɏ]/;
  (f ? f.producers : []).some((n) => {
    let at = s.indexOf(n);
    while (at >= 0) {
      const before = at > 0 ? s.charAt(at - 1) : ' ';
      const after = at + n.length < s.length ? s.charAt(at + n.length) : ' ';
      if (!letter.test(before) && !letter.test(after)) { out.push(where + ': names the producer ' + n + ' (no producer is named in an entry)'); return true; }
      at = s.indexOf(n, at + 1);
    }
    return false;
  });
  return out;
}
function voiceProblems(frag, f) {
  const out = [];
  CF.walkStrings(frag, '', (s, w) => {
    const where = w.replace(/^\./, '');
    const kind = pathKind(where);
    if (kind === 'url') { if (s) CF.urlProblems(s, where).forEach((p) => out.push(p)); if (LIVING.test(s)) out.push(where + ': the address names a living person'); return; }
    CMS.dashProblems(s, where).forEach((p) => out.push(p));
    if (SPACED_HYPHEN.test(s)) out.push(where + ': a hyphen standing alone between spaces (a dash by another name: use a comma, a colon or a full stop)');
    if (DEGREE.test(s)) out.push(where + ': a degree sign (write the word degrees)');
    tidyProblems(s, where).forEach((p) => out.push(p));
    if (kind === 'provenance') return;
    if (LIVING.test(s)) out.push(where + ': names a living person (' + s.match(LIVING)[0] + ')');
    if (HOUSE_NAME.test(s)) out.push(where + ': names the house (an entry never does)');
    if (kind === 'title' || kind === 'key') return;
    CF.voiceProblems(s, where).filter((p) => /retired word|numbered level/.test(p)).forEach((p) => out.push(p));
    if (NUMBERED_LEVEL.test(s) && !/\bLevel\s+(I|II|III|IV)\b/.test(s)) out.push(where + ': a numbered level (levels are named, never numbered)');
    CMS.americanProblems(s, where).forEach((p) => out.push(p));
    CF.proseProblems(s, where).forEach((p) => out.push(p));
    const am = s.match(AMERICAN_MORE);
    if (am) out.push(where + ': American spelling "' + am[0] + '"');
    const sup = s.match(CF.SUPERLATIVE) || s.match(SUPERLATIVE_MORE);
    if (sup) out.push(where + ': "' + String(sup[0]).toLowerCase() + '" is a superlative or sells where the line should teach');
    if (PER_CENT_SIGN.test(s)) out.push(where + ': a per cent sign (write per cent)');
    const pr = s.match(PRICE);
    if (pr) out.push(where + ': "' + pr[0] + '" talks price (no price anywhere)');
    const vo = s.match(VOLATILE);
    if (vo) out.push(where + ': "' + vo[0] + '" is volatile (rankings, hectares, plantings, allocations, owners)');
    if (HYPHEN_RANGE.test(s)) out.push(where + ': a range with a hyphen (write "10 to 13")');
    const nr = s.match(NAMED_ROLE);
    if (nr) out.push(where + ': "' + nr[0] + '" names a person by a title or a trade (nobody living; the long dead by name alone, and only where the fact needs them)');
    producerProblems(s, where, f).forEach((p) => out.push(p));
    if (tastePath(where)) genericInProse(s).forEach((g) => out.push(where + ': the family word "' + g + '" stands alone: name the thing' + nameTheThing(g)));
  });
  return out;
}

/* ---- the pieces of a fragment ---- */
function capped(out, where, v, lo, hi) {
  if (!isStr(v) || !v.trim()) { out.push(where + ': a string'); return false; }
  const n = words(v);
  if (n < lo || n > hi) out.push(where + ': ' + n + ' words, ' + (lo > 1 ? lo + ' to ' + hi : 'at most ' + hi));
  return true;
}
function unknown(out, rec, allowed, where, what) {
  Object.keys(rec).filter((k) => allowed.indexOf(k) < 0).forEach((k) => out.push((where ? where + '.' : '') + k + ': no field of ' + what + ' (' + allowed.join(', ') + ')'));
}
function counted(out, where, list, lo, hi, what) {
  if (!isList(list)) { out.push(where + ': a list of ' + what); return false; }
  if (list.length < lo || list.length > hi) out.push(where + ': ' + (lo === hi ? 'exactly ' + lo : lo + ' to ' + hi) + ' ' + what + ' (' + list.length + ')');
  return true;
}

function sayProblems(frag, row, f) {
  const out = [];
  const s = frag.say;
  if (!isStr(s) || !s.trim()) return ['say: the respelling, syllables joined by hyphens with the stressed one in capitals (shar-doh-NAY)'];
  if (words(s) > CAPS.say) out.push('say: ' + words(s) + ' words, at most ' + CAPS.say);
  if (!/^[A-Za-z][A-Za-z ,'-]*$/.test(s)) out.push('say: letters, hyphens, commas and spaces only (no marks, no brackets, no stop)');
  if (!/[A-Z]{2,}/.test(s) || s.indexOf('-') < 0) out.push('say: syllables joined by hyphens, the stressed one in capitals (shar-doh-NAY)');
  const court = f && f.gridSay && isStr(f.gridSay[row.slug]) ? f.gridSay[row.slug] : '';
  if (court && s.indexOf(court) !== 0) {
    if (!isStr(frag.sayWhy) || words(frag.sayWhy) < 8) out.push('say: the Court\'s grid already says "' + court + '" (GRID_SAY): open on it, and add a local form after a comma, or state in sayWhy, in eight words or more, why that one is wrong');
  }
  if (frag.sayWhy !== undefined && (!isStr(frag.sayWhy) || !frag.sayWhy.trim())) out.push('sayWhy: a sentence when present');
  if (frag.sayWhy !== undefined && (!court || s.indexOf(court) === 0)) out.push('sayWhy: only where say departs from GRID_SAY');
  return out;
}

function lineProblems(frag, row) {
  const out = [];
  const L = frag.lines;
  if (!isObj(L)) return ['lines: { s10, s20, s45, sale }'];
  LINE_FIELDS.filter((k) => !(k in L)).forEach((k) => out.push('lines.' + k + ': missing'));
  unknown(out, L, LINE_FIELDS, 'lines', 'the lines');
  LINE_FIELDS.forEach((k) => {
    if (!(k in L)) return;
    const w = 'lines.' + k;
    if (!capped(out, w, L[k], CAPS.lines[k][0], CAPS.lines[k][1])) return;
    const s = L[k];
    const list = sentenceList(s);
    const lim = CAPS.lineSentences[k];
    if (list.length < lim[0] || list.length > lim[1]) {
      const rule = k === 'sale' ? 'exactly two sentences (the hook, then the pour)' : k === 's10' ? 'one sentence, one breath' : k === 's20' ? 'exactly two sentences, two breaths' : lim[0] + ' to ' + lim[1] + ' sentences';
      out.push(w + ': ' + rule + ', found ' + list.length);
    }
    if (!/[.!?]$/.test(s.trim())) out.push(w + ': ends on a full stop');
    list.forEach((sen) => {
      if (words(sen) > CAPS.lineSentenceWords) out.push(w + ': a sentence of ' + words(sen) + ' words ("' + firstWords(sen, 6) + '..."), at most ' + CAPS.lineSentenceWords + ' in a spoken line');
      if (longList(sen, CAPS.lineList)) out.push(w + ': a list longer than three ("' + firstWords(sen, 6) + '..."): say three things, then stop');
    });
    if (LINE_BRACKET.test(s)) out.push(w + ': a bracket (a spoken line has none)');
    if (/;/.test(s)) out.push(w + ': a semicolon (a spoken line has none)');
    const ab = s.match(LINE_ABBREVIATION);
    if (ab) out.push(w + ': "' + ab[0] + '" is an abbreviation or a sign (say the words)');
    const al = s.match(LINE_ALCOHOL);
    if (al) out.push(w + ': a figure of alcohol ("' + al[0] + '"): say light, moderate or full');
    const ja = s.match(LINE_JARGON);
    if (ja) out.push(w + ': "' + ja[0] + '" is a term no guest should need explained (say what it tastes of)');
  });
  ['s10', 's45'].forEach((k) => { if (isStr(L[k]) && !namesGrape(L[k], row)) out.push('lines.' + k + ': names the grape (' + terms(row).join(', ') + ')'); });
  if (isStr(L.s45) && namesGrape(L.s45, row) && !namesGrape(firstWords(L.s45, CAPS.s45NameWithin), row)) out.push('lines.s45: opens on the grape\'s name (within its first ' + CAPS.s45NameWithin + ' words)');
  return out;
}

function notesProblems(out, where, list, seen) {
  if (!counted(out, where, list, CAPS.glass.notes[0], CAPS.glass.notes[1], 'notes')) return;
  list.forEach((n, i) => {
    const w = where + '[' + i + ']';
    if (!isStr(n) || !n.trim()) { out.push(w + ': a note'); return; }
    const k = words(n);
    if (k < CAPS.glass.noteWords[0] || k > CAPS.glass.noteWords[1]) out.push(w + ': ' + k + ' words, ' + CAPS.glass.noteWords[0] + ' to ' + CAPS.glass.noteWords[1]);
    if (/[,;:.]/.test(n)) out.push(w + ': one note, no comma or stop inside it');
    const g = genericNote(n);
    if (g) out.push(w + ': "' + n + '" is a family word standing alone: name the thing' + nameTheThing(g));
    if (seen) { const f = fold(n); if (seen[f]) out.push(w + ': "' + n + '" is given already at ' + seen[f]); else seen[f] = w; }
  });
}
function glassProblems(frag, row) {
  const out = [];
  const G = frag.glass;
  if (!isObj(G)) return ['glass: { lead, notes, ladder, structure }'];
  GLASS_FIELDS.filter((k) => !(k in G)).forEach((k) => out.push('glass.' + k + ': missing'));
  unknown(out, G, GLASS_FIELDS, 'glass', 'the glass');
  if ('lead' in G && capped(out, 'glass.lead', G.lead, CAPS.glass.lead[0], CAPS.glass.lead[1])) {
    if (sentences(G.lead) !== 1) out.push('glass.lead: one sentence, found ' + sentences(G.lead));
    if (!/\.$/.test(G.lead.trim())) out.push('glass.lead: ends on a full stop');
  }
  if ('notes' in G && counted(out, 'glass.notes', G.notes, CAPS.glass.groups[0], CAPS.glass.groups[1], 'groups')) {
    const fams = {}; const seen = {};
    G.notes.forEach((g, i) => {
      const w = 'glass.notes[' + i + ']';
      if (!isObj(g)) { out.push(w + ': { family, notes }'); return; }
      unknown(out, g, ['family', 'notes'], w, 'a group');
      if (GLASS_FAMILIES.indexOf(g.family) < 0) out.push(w + '.family: one of ' + GLASS_FAMILIES.join(', '));
      else if (fams[g.family]) out.push(w + '.family: ' + g.family + ' twice'); else fams[g.family] = 1;
      notesProblems(out, w + '.notes', g.notes, seen);
    });
  }
  if ('ladder' in G && counted(out, 'glass.ladder', G.ladder, CAPS.glass.ladder[0], CAPS.glass.ladder[1], 'rungs')) {
    let last = -1;
    G.ladder.forEach((r, i) => {
      const w = 'glass.ladder[' + i + ']';
      if (!isObj(r)) { out.push(w + ': { climate, where, notes }'); return; }
      unknown(out, r, ['climate', 'where', 'notes'], w, 'a rung');
      const at = CLIMATES.indexOf(r.climate);
      if (at < 0) out.push(w + '.climate: cool, moderate or warm');
      else { if (at <= last) out.push(w + '.climate: the ladder climbs from cool to warm, each climate once'); last = at; }
      capped(out, w + '.where', r.where, CAPS.glass.where[0], CAPS.glass.where[1]);
      notesProblems(out, w + '.notes', r.notes, null);
    });
  }
  if ('structure' in G && capped(out, 'glass.structure', G.structure, CAPS.glass.structure[0], CAPS.glass.structure[1])) {
    const s = G.structure.toLowerCase();
    const want = [['acid', 'acidity'], ['bod', 'body'], ['alcohol', 'alcohol']].concat(row.colour === 'red' ? [['tannin', 'tannin']] : []);
    want.forEach((p) => { if (s.indexOf(p[0]) < 0) out.push('glass.structure: states the ' + p[1] + ' (acidity, ' + (row.colour === 'red' ? 'tannin, ' : '') + 'alcohol and body, in words)'); });
    if (/\d/.test(G.structure)) out.push('glass.structure: in words, no figure');
  }
  return out;
}

function worldsProblems(frag, row) {
  const out = [];
  const W = frag.worlds;
  if (!isObj(W)) return ['worlds: { ' + row.mode + ': ... }'];
  const keys = Object.keys(W);
  if (keys.length !== 1 || keys[0] !== row.mode) out.push('worlds: the plan gives this grape ' + (row.mode === 'contrast' ? 'the side by side: worlds.contrast alone, with both sides' : 'at home and abroad: worlds.home alone') + ' (found ' + (keys.join(', ') || 'nothing') + ')');
  if (row.mode === 'contrast' && isObj(W.contrast)) {
    const C = W.contrast;
    CONTRAST_FIELDS.filter((k) => !(k in C)).forEach((k) => out.push('worlds.contrast.' + k + ': missing'));
    unknown(out, C, CONTRAST_FIELDS, 'worlds.contrast', 'the side by side');
    ['old', 'new'].forEach((side) => {
      const w = 'worlds.contrast.' + side;
      if (!(side in C)) return;
      if (!isObj(C[side])) { out.push(w + ': { where, glass, cellar }'); return; }
      SIDE_FIELDS.filter((k) => !(k in C[side])).forEach((k) => out.push(w + '.' + k + ': missing'));
      unknown(out, C[side], SIDE_FIELDS, w, 'a side');
      SIDE_FIELDS.forEach((k) => { if (k in C[side]) capped(out, w + '.' + k, C[side][k], CAPS.contrast[k][0], CAPS.contrast[k][1]); });
      ['glass', 'cellar'].forEach((k) => { const ab = isStr(C[side][k]) && C[side][k].match(ABSOLUTE); if (ab) out.push(w + '.' + k + ': "' + ab[0] + '" is an absolute (a typical style is hedged: tends to, typically, often)'); });
    });
    ['why', 'blur', 'call'].forEach((k) => { if (k in C) capped(out, 'worlds.contrast.' + k, C[k], CAPS.contrast[k][0], CAPS.contrast[k][1]); });
    const glasses = ['old', 'new'].map((side) => (isObj(C[side]) && isStr(C[side].glass)) ? C[side].glass : '').join(' ');
    if (glasses.trim() && !HEDGE.test(glasses)) out.push('worlds.contrast: neither side\'s glass is hedged (tends to, typically, often, usually): these are typical styles, not laws');
    const ab = isStr(C.call) && C.call.match(ABSOLUTE);
    if (ab) out.push('worlds.contrast.call: "' + ab[0] + '" is an absolute (the call is what a blind taster leans on, not a law)');
    if (isObj(C.old) && isObj(C.new) && isStr(C.old.glass) && C.old.glass === C.new.glass) out.push('worlds.contrast: the two sides read the same');
  } else if (row.mode === 'contrast' && 'contrast' in W) out.push('worlds.contrast: { old, new, why, blur, call }');
  if (row.mode === 'home' && isObj(W.home)) {
    HOME_FIELDS.filter((k) => !(k in W.home)).forEach((k) => out.push('worlds.home.' + k + ': missing'));
    unknown(out, W.home, HOME_FIELDS, 'worlds.home', 'at home and abroad');
    HOME_FIELDS.forEach((k) => { if (k in W.home) capped(out, 'worlds.home.' + k, W.home[k], CAPS.home[k][0], CAPS.home[k][1]); });
  } else if (row.mode === 'home' && 'home' in W) out.push('worlds.home: { home, abroad }');
  return out;
}

const TEMP_F = /\b\d{2}(?:\s+to\s+\d{2})?\s+degrees\s+Fahrenheit\b/;
const TEMP_C = /\b\d{1,2}(?:\s+to\s+\d{1,2})?\s+degrees\s+Celsius\b/;
function serviceProblems(frag) {
  const out = [];
  const S = frag.service;
  if (!isObj(S)) return ['service: { temp, glass, decant, age }'];
  SERVICE_FIELDS.filter((k) => !(k in S)).forEach((k) => out.push('service.' + k + ': missing'));
  unknown(out, S, SERVICE_FIELDS, 'service', 'the service');
  SERVICE_FIELDS.forEach((k) => { if (k in S) capped(out, 'service.' + k, S[k], CAPS.service[0], CAPS.service[1]); });
  if (isStr(S.temp)) {
    const f = S.temp.search(TEMP_F), c = S.temp.search(TEMP_C);
    if (f < 0 || c < 0 || c < f) out.push('service.temp: degrees Fahrenheit, then degrees Celsius, in figures with the word degrees ("50 to 55 degrees Fahrenheit, 10 to 13 degrees Celsius")');
  }
  return out;
}

function pairsProblems(out, where, list, lim, shape) {
  if (!counted(out, where, list, lim[0], lim[1], 'entries')) return;
  const seen = {};
  list.forEach((x, i) => {
    const w = where + '[' + i + ']';
    const keys = shape.map((p) => p[0]);
    if (!isObj(x)) { out.push(w + ': { ' + keys.join(', ') + ' }'); return; }
    keys.filter((k) => !(k in x)).forEach((k) => out.push(w + '.' + k + ': missing'));
    unknown(out, x, keys, w, 'this entry');
    shape.forEach((p) => { if (p[0] in x) capped(out, w + '.' + p[0], x[p[0]], p[1][0], p[1][1]); });
    const first = isStr(x[keys[0]]) ? fold(x[keys[0]]) : '';
    if (first) { if (seen[first]) out.push(w + '.' + keys[0] + ': given twice'); seen[first] = 1; }
  });
}

function compareProblems(frag, row, plan) {
  const out = [];
  if (!counted(out, 'compare', frag.compare, CAPS.compare.n[0], CAPS.compare.n[1], 'neighbours')) return out;
  const seen = {};
  frag.compare.forEach((c, i) => {
    const w = 'compare[' + i + ']';
    if (!isObj(c)) { out.push(w + ': { slug, tell }'); return; }
    unknown(out, c, ['slug', 'tell'], w, 'a comparison');
    if (!isStr(c.slug) || !rowOf(plan, c.slug)) out.push(w + '.slug: ' + JSON.stringify(c.slug) + ' is no slug of the roster');
    else if (c.slug === row.slug) out.push(w + '.slug: a grape is never compared with itself');
    else if (seen[c.slug]) out.push(w + '.slug: ' + c.slug + ' twice');
    seen[c.slug] = 1;
    capped(out, w + '.tell', c.tell, CAPS.compare.tell[0], CAPS.compare.tell[1]);
  });
  return out;
}

function profileProblems(frag, row) {
  const out = [];
  const needs = row.status === 'thin' || row.status === 'new';
  if (!needs) { if ('profile' in frag) out.push('profile: only a thin or a new grape carries one (this grape\'s reviewed profile stands)'); return out; }
  const P = frag.profile;
  if (!isObj(P)) return ['profile: a ' + row.status + ' grape carries { ' + PROFILE_FIELDS.join(', ') + ' }'];
  PROFILE_FIELDS.filter((k) => !(k in P)).forEach((k) => out.push('profile.' + k + ': missing'));
  unknown(out, P, PROFILE_FIELDS, 'profile', 'a profile');
  const c = row.colour === 'white' ? 'w' : 'r';
  if ('c' in P && P.c !== c) out.push('profile.c: "' + c + '" for a ' + row.colour + ' grape, as GRAPES writes it');
  PROFILE_FIELDS.filter((k) => k !== 'c' && k in P).forEach((k) => capped(out, 'profile.' + k, P[k], CAPS.profile[0], CAPS.profile[1]));
  return out;
}

function targetsProblems(frag, row, f) {
  const out = [];
  if (row.status !== 'new') { if ('targets' in frag) out.push('targets: only a new grape carries them'); return out; }
  const T = frag.targets;
  if (!counted(out, 'targets', T, CAPS.targets[0], CAPS.targets[1], 'slugs of REGIONS')) return out;
  const seen = {};
  T.forEach((t, i) => {
    if (!isStr(t) || !t) { out.push('targets[' + i + ']: a slug'); return; }
    if (seen[t]) out.push('targets[' + i + ']: ' + t + ' twice');
    seen[t] = 1;
    if (f && (f.regions.size || f.countries.size) && !f.regions.has(t) && !f.countries.has(t)) out.push('targets[' + i + ']: "' + t + '" is no region slug or country key of REGIONS');
  });
  return out;
}

function cardsProblems(frag) {
  const out = [];
  if (!counted(out, 'cards', frag.cards, CAPS.cards.n, CAPS.cards.n, 'cards')) return out;
  const seen = {};
  frag.cards.forEach((c, i) => {
    const w = 'cards[' + i + ']';
    if (!isObj(c)) { out.push(w + ': { front, back }'); return; }
    if ('id' in c) out.push(w + '.id: only the build mints ids');
    unknown(out, c, ['front', 'back', 'id'], w, 'a card');
    capped(out, w + '.front', c.front, CAPS.cards.front[0], CAPS.cards.front[1]);
    capped(out, w + '.back', c.back, CAPS.cards.back[0], CAPS.cards.back[1]);
    if (isStr(c.front)) { const k = fold(c.front); if (seen[k]) out.push(w + '.front: the same cue twice'); seen[k] = 1; }
    if (isStr(c.front) && isStr(c.back) && fold(c.back) && (' ' + fold(c.front) + ' ').indexOf(' ' + fold(c.back) + ' ') >= 0) out.push(w + ': the front gives the back away');
  });
  return out;
}

function questionsProblems(frag, row) {
  const out = [];
  if (!counted(out, 'questions', frag.questions, CAPS.questions.n, CAPS.questions.n, 'questions')) return out;
  const stems = {};
  let tagged = 0;
  frag.questions.forEach((q, i) => {
    const w = 'questions[' + i + ']';
    if (!isObj(q)) { out.push(w + ': { q, opts, a, exp }'); return; }
    if ('id' in q) out.push(w + '.id: only the build mints ids');
    unknown(out, q, QUESTION_FIELDS.concat(['id']), w, 'a question');
    CMS.questionProblems({ q: q.q, opts: q.opts, a: q.a, exp: q.exp }, w, { grapes: [], topics: [] }).forEach((p) => out.push(p));
    if (isStr(q.q)) {
      const n = words(q.q);
      if (n < CAPS.questions.stem[0] || n > CAPS.questions.stem[1]) out.push(w + '.q: ' + n + ' words, ' + CAPS.questions.stem[0] + ' to ' + CAPS.questions.stem[1]);
      if (!/\?$/.test(q.q.trim())) out.push(w + '.q: a question, ending on a question mark');
      const k = fold(q.q); if (stems[k]) out.push(w + '.q: the same stem twice'); stems[k] = 1;
    }
    if (isList(q.opts)) q.opts.forEach((o, j) => { if (isStr(o) && words(o) > CAPS.questions.option[1]) out.push(w + '.opts[' + j + ']: ' + words(o) + ' words, at most ' + CAPS.questions.option[1]); });
    if (isStr(q.exp) && words(q.exp) > CAPS.questions.exp[1]) out.push(w + '.exp: ' + words(q.exp) + ' words, at most ' + CAPS.questions.exp[1]);
    if ('tag' in q) { if (QUESTION_TAGS.indexOf(q.tag) < 0) out.push(w + '.tag: worlds, or absent'); else tagged++; }
  });
  if (row.mode === 'contrast' && tagged !== 1) out.push('questions: a side by side grape carries exactly one question tagged worlds (Old World against New World), found ' + tagged);
  if (row.mode === 'home' && tagged) out.push('questions: the worlds tag is for a side by side grape; this one is at home');
  return out;
}

function sourcesProblems(frag) {
  const out = [];
  if (!counted(out, 'sources', frag.sources, CAPS.sources.n[0], CAPS.sources.n[1], 'sources')) return out;
  const urls = {}; const titles = {};
  let web = 0;
  frag.sources.forEach((s, i) => {
    const w = 'sources[' + i + ']';
    if (!isObj(s) || !isStr(s.title) || !isStr(s.url)) { out.push(w + ': { title, url } (url "" for a reference work cited by its title alone)'); return; }
    unknown(out, s, ['title', 'url'], w, 'a source');
    capped(out, w + '.title', s.title, CAPS.sources.title[0], CAPS.sources.title[1]);
    if (/\bby\s+[A-Z][a-z]+\s+[A-Z]/.test(s.title) || /\b(?:ed\.|edited by|author)\b/i.test(s.title)) out.push(w + '.title: a work is cited by its title alone, never its author or editor');
    const t = fold(s.title); if (titles[t]) out.push(w + '.title: the same source twice'); titles[t] = 1;
    if (s.url) { web++; if (urls[s.url]) out.push(w + '.url: the same address twice'); urls[s.url] = 1; }
  });
  if (web < CAPS.sources.web) out.push('sources: at least ' + CAPS.sources.web + ' with an https address the author read');
  return out;
}

/* the reading words of an entry: what its page shows above the profile and the drill */
const READING = ['lines', 'glass', 'worlds', 'service', 'food', 'labels', 'guest'];
function readingWords(frag) {
  let n = 0;
  READING.forEach((k) => CF.walkStrings(frag && frag[k], k, (s, w) => { if (!/\.(?:family|climate)$/.test(w)) n += words(s); }));
  (isList(frag && frag.compare) ? frag.compare : []).forEach((c) => { if (c && isStr(c.tell)) n += words(c.tell); });
  return n;
}

/* ---- a grape's fragment ---- */
function validate(frag, plan, opts) {
  const o = opts || {};
  const out = [];
  if (!isObj(frag)) return ['fragment: one JSON object'];
  const row = rowOf(plan, frag.slug);
  if (!isStr(frag.slug) || !row) return ['slug: ' + JSON.stringify(frag.slug) + ' is no slug of the roster (plan.json)'];
  const f = o.facts || facts(o.jsDir);
  const required = FIELDS.filter((k) => k !== 'profile' && k !== 'targets');
  required.filter((k) => !(k in frag)).forEach((k) => out.push(k + ': missing'));
  unknown(out, frag, FIELDS.concat(PROVENANCE), '', 'a fragment');
  COPIED.forEach((k) => { if (k in frag && !same(frag[k], row[k])) out.push(k + ': copied from the roster exactly, ' + JSON.stringify(row[k])); });

  if ('notIn' in frag) {
    if (!isList(frag.notIn) || frag.notIn.some((x) => !isStr(x))) out.push('notIn: a list of phrases ([] for none)');
    else {
      if (frag.notIn.length > CAPS.notIn) out.push('notIn: at most ' + CAPS.notIn + ' phrases');
      const own = terms(row).map(fold);
      frag.notIn.forEach((x, i) => {
        if (!x || x !== fold(x) || x.length < 3) out.push('notIn[' + i + ']: a folded phrase (lower case, no marks, three letters or more)');
        else if (own.indexOf(x) >= 0) out.push('notIn[' + i + ']: "' + x + '" is the grape\'s own name: it would shut its own questions out');
      });
    }
  }
  if ('say' in frag) sayProblems(frag, row, f).forEach((p) => out.push(p));
  if ('lines' in frag) lineProblems(frag, row).forEach((p) => out.push(p));
  if ('glass' in frag) glassProblems(frag, row).forEach((p) => out.push(p));
  if ('worlds' in frag) worldsProblems(frag, row).forEach((p) => out.push(p));
  if ('service' in frag) serviceProblems(frag).forEach((p) => out.push(p));
  if ('food' in frag) {
    if (!isObj(frag.food)) out.push('food: { with: [...] }');
    else { unknown(out, frag.food, ['with'], 'food', 'the food'); pairsProblems(out, 'food.with', frag.food.with, CAPS.food.with, [['dish', CAPS.food.dish], ['why', CAPS.food.why]]); }
  }
  if ('labels' in frag) pairsProblems(out, 'labels', frag.labels, CAPS.labels.n, [['term', CAPS.labels.term], ['means', CAPS.labels.means]]);
  if ('guest' in frag) {
    pairsProblems(out, 'guest', frag.guest, CAPS.guest.n, [['q', CAPS.guest.q], ['a', CAPS.guest.a]]);
    (isList(frag.guest) ? frag.guest : []).forEach((g, i) => { if (isObj(g) && isStr(g.q) && !/\?$/.test(g.q.trim())) out.push('guest[' + i + '].q: the guest\'s question, ending on a question mark'); });
  }
  if ('compare' in frag) compareProblems(frag, row, plan).forEach((p) => out.push(p));
  profileProblems(frag, row).forEach((p) => out.push(p));
  targetsProblems(frag, row, f).forEach((p) => out.push(p));
  if ('cards' in frag) cardsProblems(frag).forEach((p) => out.push(p));
  if ('questions' in frag) questionsProblems(frag, row).forEach((p) => out.push(p));
  if ('sources' in frag) sourcesProblems(frag).forEach((p) => out.push(p));
  if (frag.report !== undefined && (!isList(frag.report) || frag.report.some((x) => !isStr(x) || !x.trim()))) out.push('report: a list of sentences when present (what the integrator and the owner should know)');
  if (frag.checked !== undefined && frag.checked !== null && !isObj(frag.checked)) out.push('checked: null or the checker\'s record');
  /* a stem or a cue that is another's, inside the entry */
  const fronts = (isList(frag.cards) ? frag.cards : []).map((c) => (c && isStr(c.front)) ? fold(c.front) : '');
  (isList(frag.questions) ? frag.questions : []).forEach((q, i) => { if (q && isStr(q.q) && fronts.indexOf(fold(q.q)) >= 0) out.push('questions[' + i + '].q: the same words as a card\'s front'); });
  const total = readingWords(frag);
  if (total > CAPS.entry) out.push('entry: ' + total + ' reading words (lines, glass, worlds, service, food, labels, guest and the compare tells), at most ' + CAPS.entry);
  voiceProblems(frag, f).forEach((p) => out.push(p));
  return out;
}

/* ---- what a second reader should look at: never a failure ---- */
const FAMILY_IN_PROSE = /\b(?:citrus|orchard fruits?|stone fruits?|tropical fruits?|red fruits?|black fruits?|dark fruits?|blue fruits?|dried fruits?|red berries|floral|spic[ey]|minerality|mineral|oaky|earthy|herbal|herbaceous)\b/i;
const EST = /\b(?:the (?:most|least) [a-z]+|(?:old|larg|bigg|small|great|high|low|rich|pur|rar|fin|earli|lat|light|heavi|dark|pal|sweet|dri|long|short|grand)est)\b/i;
const CREOLE = /gumbo|[eé]touff[eé]e|remoulade|r[eé]moulade|turtle soup|bananas foster|redfish|gulf oyster|crawfish|jambalaya|beignet|po.?boy|court.?bouillon|grillades|pralin/i;
function advise(frag, plan) {
  const out = [];
  if (!isObj(frag)) return out;
  CF.walkStrings(frag, '', (s, w) => {
    const where = w.replace(/^\./, '');
    if (pathKind(where) !== 'prose') return;
    if (tastePath(where)) { const m = s.match(FAMILY_IN_PROSE); if (m && genericInProse(s).length === 0) out.push(where + ': uses the family word "' + m[0] + '" in a sentence: name the thing unless the family is the point'); }
    const e = s.match(EST);
    if (e) out.push(where + ': "' + e[0] + '" reads as a superlative: measure it against a source, or cut it');
    if (/^lines\./.test(where)) { const j = s.match(LINE_JARGON_SOFT); if (j) out.push(where + ': "' + j[0] + '" needs the same breath to explain it, or a plainer word'); }
  });
  const creole = (isObj(frag.food) && isList(frag.food.with) ? frag.food.with : []).filter((x) => x && isStr(x.dish) && CREOLE.test(x.dish)).length;
  if (creole > 1) out.push('food.with: ' + creole + ' dishes from the Creole table; one may come from it, where it truly suits');
  const row = rowOf(plan, frag.slug);
  if (row && isList(frag.compare) && isList(row.neighbours)) frag.compare.forEach((c, i) => { if (c && isStr(c.slug) && row.neighbours.indexOf(c.slug) < 0) out.push('compare[' + i + '].slug: ' + c.slug + ' is not among the plan\'s candidates (' + row.neighbours.join(', ') + '): fine when a guest truly confuses the two'); });
  out.push('entry: ' + readingWords(frag) + ' reading words of ' + CAPS.entry);
  return out;
}

/* ---- the roster itself, before any fragment is read ----
   join, when given, is what the app holds: { list: [{ slug, name, colour, court, world, profile }], slugOf(name), keyOf(name) }
   (build-grapes.cjs --plan hands it over from the chain). Without it only the file's own shape is proved. */
function planProblems(plan, join) {
  const out = [];
  if (!isObj(plan) || !isList(plan.grapes)) return ['plan.json: { grapes: [...] }'];
  if (plan.prefix !== ID_PREFIX) out.push('plan.prefix: ' + ID_PREFIX);
  if (!same(plan.chunks, CHUNKS)) out.push('plan.chunks: ' + CHUNKS.join(', '));
  if (!isStr(plan.edition) || !/^\d{4}-\d{2}-\d{2}$/.test(plan.edition)) out.push('plan.edition: a date, YYYY-MM-DD');
  if (!isList(plan.unresolved) || plan.unresolved.some((x) => !isStr(x) || !x)) out.push('plan.unresolved: the names that must stay unresolved');
  if (plan.grapes.length !== ROSTER) out.push('plan.grapes: ' + ROSTER + ' grapes (' + plan.grapes.length + ')');
  const slugs = {}; const owner = {};
  let sawNew = false;
  plan.grapes.forEach((g, i) => {
    const at = 'plan.grapes[' + i + '] ' + JSON.stringify(g && g.slug);
    if (!isObj(g)) { out.push(at + ': an object'); return; }
    unknown(out, g, PLAN_ROW_FIELDS, at, 'a roster row');
    ['slug', 'name', 'colour', 'kind', 'chunk', 'status', 'mode', 'aliases', 'court', 'neighbours'].filter((k) => !(k in g)).forEach((k) => out.push(at + '.' + k + ': missing'));
    if (!isStr(g.slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(g.slug)) out.push(at + '.slug: lower case words and hyphens');
    if (slugs[g.slug]) out.push(at + '.slug: twice');
    slugs[g.slug] = 1;
    if (!isStr(g.name) || !g.name.trim()) out.push(at + '.name: the grape');
    if (COLOURS.indexOf(g.colour) < 0) out.push(at + '.colour: white or red');
    if (KINDS.indexOf(g.kind) < 0) out.push(at + '.kind: grape or family');
    if (CHUNKS.indexOf(g.chunk) < 0) out.push(at + '.chunk: ' + CHUNKS.join(', '));
    if (STATUSES.indexOf(g.status) < 0) out.push(at + '.status: full, thin or new');
    if (g.status === 'new') sawNew = true; else if (sawNew) out.push(at + ': the join\'s grapes come first and the new ones after');
    if (MODES.indexOf(g.mode) < 0) out.push(at + '.mode: contrast or home');
    if ('modeWhy' in g && (!isStr(g.modeWhy) || words(g.modeWhy) < 6)) out.push(at + '.modeWhy: one line when present');
    if ('world' in g && WORLDS.indexOf(g.world) < 0) out.push(at + '.world: old, new or both (TASTE.world), or absent');
    if (g.world === 'both' && g.mode !== 'contrast') out.push(at + '.mode: the Codex flags this grape both, so it takes the side by side');
    if (g.status !== 'full' && 'world' in g) out.push(at + '.world: only a grape with a reviewed profile has one');
    if (typeof g.court !== 'boolean') out.push(at + '.court: true or false');
    if (!isList(g.aliases) || g.aliases.some((a) => !isStr(a) || !fold(a))) out.push(at + '.aliases: a list of names ([] for none)');
    else terms(g).forEach((t) => { const k = fold(t); if (owner[k] && owner[k] !== g.slug) out.push(at + ': the name "' + t + '" is ' + owner[k] + '\'s too'); owner[k] = g.slug; });
    if (isStr(g.modeWhy) || isStr(g.name)) [g.modeWhy, g.name].concat(isList(g.aliases) ? g.aliases : []).forEach((s) => { if (isStr(s)) CMS.dashProblems(s, at).forEach((p) => out.push(p)); });
  });
  plan.grapes.forEach((g, i) => {
    if (!isObj(g) || !isList(g.neighbours)) return;
    const at = 'plan.grapes[' + i + '] ' + JSON.stringify(g.slug) + '.neighbours';
    if (!g.neighbours.length) out.push(at + ': at least one candidate');
    g.neighbours.forEach((n) => { if (!slugs[n]) out.push(at + ': ' + JSON.stringify(n) + ' is no slug of the roster'); else if (n === g.slug) out.push(at + ': a grape is no neighbour of itself'); });
  });
  CHUNKS.forEach((c) => { const n = plan.grapes.filter((g) => g && g.chunk === c).length; if (!n) out.push('plan.chunks: ' + c + ' holds no grape'); });
  (isList(plan.unresolved) ? plan.unresolved : []).forEach((n) => { if (owner[fold(n)]) out.push('plan.unresolved: "' + n + '" must stay unresolved and is ' + owner[fold(n)] + '\'s name or alias'); });
  if (join) {
    const held = plan.grapes.filter((g) => g && g.status !== 'new');
    const first = join.list.slice(0, held.length);
    if (join.list.length < held.length) out.push('plan: the join holds ' + join.list.length + ' grapes, the plan ' + held.length + ' that are not new');
    held.forEach((g, i) => {
      const j = first[i];
      if (!j) return;
      if (j.slug !== g.slug) out.push('plan.grapes[' + i + ']: the join holds ' + j.slug + ' here, the plan ' + g.slug + ' (the join\'s own order)');
      else {
        if (j.name !== g.name) out.push('plan.grapes[' + i + '] "' + g.slug + '".name: the join says ' + JSON.stringify(j.name));
        if (j.colour !== g.colour) out.push('plan.grapes[' + i + '] "' + g.slug + '".colour: the join says ' + j.colour);
        if (!!j.court !== g.court) out.push('plan.grapes[' + i + '] "' + g.slug + '".court: the tasting list says ' + !!j.court);
        if ((j.world || undefined) !== g.world) out.push('plan.grapes[' + i + '] "' + g.slug + '".world: TASTE says ' + JSON.stringify(j.world || null));
        if ((j.profile ? 'full' : 'thin') !== g.status) out.push('plan.grapes[' + i + '] "' + g.slug + '".status: the join ' + (j.profile ? 'holds a profile (full)' : 'holds no profile (thin)'));
      }
    });
    plan.grapes.forEach((g, i) => {
      if (!isObj(g)) return;
      const at = 'plan.grapes[' + i + '] "' + g.slug + '"';
      if (g.status === 'new') {
        const s = join.slugOf(g.name);
        if (s !== g.slug) out.push(at + '.slug: v53GrapeSlugOf gives ' + JSON.stringify(s) + ' for ' + JSON.stringify(g.name));
        const k = join.keyOf(g.name);
        if (k && k !== g.slug) out.push(at + '.name: resolves today to ' + k);
      }
      (isList(g.aliases) ? g.aliases : []).forEach((a) => { const k = join.keyOf(a); if (k && k !== g.slug) out.push(at + '.aliases: "' + a + '" resolves to ' + k + ', another grape'); });
    });
    (isList(plan.unresolved) ? plan.unresolved : []).forEach((n) => { const k = join.keyOf(n); if (k) out.push('plan.unresolved: "' + n + '" resolves today to ' + k); });
  }
  return out;
}

module.exports = {
  validate, advise, planProblems, loadPlan, rowOf, facts, readingWords, sentences, sentenceList, words, fold, hasPhrase, terms, nameParts, namesGrape,
  genericNote, genericInProse, proseItems, longList, tastePath, pathKind, voiceProblems,
  CAPS, GLASS_FAMILIES, FAMILY_NAMES_THE_THING, GENERIC_NOTE, GENERIC_PROSE, FIELDS, PROVENANCE, COPIED, LINE_FIELDS, GLASS_FIELDS, CLIMATES, SIDE_FIELDS, CONTRAST_FIELDS,
  HOME_FIELDS, SERVICE_FIELDS, PROFILE_FIELDS, QUESTION_FIELDS, QUESTION_TAGS, PLAN_ROW_FIELDS, COLOURS, KINDS, STATUSES, MODES, WORLDS, CHUNKS, ROSTER, ID_PREFIX, ID_RE,
  DEGREE, PRICE, VOLATILE, SUPERLATIVE_MORE, PRODUCER_PREFIX, PRODUCER_SUFFIX, NAMED_ROLE, LIVING, LINE_ABBREVIATION, LINE_ALCOHOL, LINE_JARGON, LINE_JARGON_SOFT, ABSOLUTE, HEDGE,
  DIR, ROOT, JS_DIR
};

if (require.main === module) {
  const arg = process.argv[2];
  if (arg !== '--caps') { console.log('usage: node .scripts/grapes/schema.cjs --caps   (the caps and the glass families; the validator is required by build-grapes.cjs)'); process.exit(arg === '--help' || arg === '-h' ? 0 : 2); }
  const pair = (p) => (Array.isArray(p) ? (p[0] === p[1] ? 'exactly ' + p[0] : p[0] + ' to ' + p[1]) : 'at most ' + p);
  const rows = [
    ['say', 'at most ' + CAPS.say + ' words'],
    ['lines.s10', pair(CAPS.lines.s10) + ' words, one sentence, names the grape'],
    ['lines.s20', pair(CAPS.lines.s20) + ' words, two sentences'],
    ['lines.s45', pair(CAPS.lines.s45) + ' words, ' + pair(CAPS.lineSentences.s45) + ' sentences, the grape named within the first ' + CAPS.s45NameWithin + ' words'],
    ['lines.sale', pair(CAPS.lines.sale) + ' words, exactly two sentences'],
    ['a spoken sentence', 'at most ' + CAPS.lineSentenceWords + ' words, no list longer than ' + CAPS.lineList],
    ['glass.lead', pair(CAPS.glass.lead) + ' words, one sentence'],
    ['glass.notes', pair(CAPS.glass.groups) + ' groups, each a family and ' + pair(CAPS.glass.notes) + ' notes of ' + pair(CAPS.glass.noteWords) + ' words'],
    ['glass.ladder', pair(CAPS.glass.ladder) + ' rungs, cool to warm, where ' + pair(CAPS.glass.where) + ' words, ' + pair(CAPS.glass.notes) + ' notes'],
    ['glass.structure', pair(CAPS.glass.structure) + ' words'],
    ['worlds.contrast.old and new', 'where ' + pair(CAPS.contrast.where) + ', glass ' + pair(CAPS.contrast.glass) + ', cellar ' + pair(CAPS.contrast.cellar) + ' words'],
    ['worlds.contrast', 'why ' + pair(CAPS.contrast.why) + ', blur ' + pair(CAPS.contrast.blur) + ', call ' + pair(CAPS.contrast.call) + ' words'],
    ['worlds.home', 'home ' + pair(CAPS.home.home) + ', abroad ' + pair(CAPS.home.abroad) + ' words'],
    ['service.temp, glass, decant, age', pair(CAPS.service) + ' words each'],
    ['food.with', pair(CAPS.food.with) + ' dishes, dish ' + pair(CAPS.food.dish) + ', why ' + pair(CAPS.food.why) + ' words'],
    ['labels', pair(CAPS.labels.n) + ', term ' + pair(CAPS.labels.term) + ', means ' + pair(CAPS.labels.means) + ' words'],
    ['guest', pair(CAPS.guest.n) + ', q ' + pair(CAPS.guest.q) + ', a ' + pair(CAPS.guest.a) + ' words'],
    ['compare', pair(CAPS.compare.n) + ', tell ' + pair(CAPS.compare.tell) + ' words'],
    ['profile (thin and new)', PROFILE_FIELDS.join(', ') + ': ' + pair(CAPS.profile) + ' words each'],
    ['targets (new)', pair(CAPS.targets) + ' slugs of REGIONS'],
    ['cards', 'exactly ' + CAPS.cards.n + ', front ' + pair(CAPS.cards.front) + ', back ' + pair(CAPS.cards.back) + ' words'],
    ['questions', 'exactly ' + CAPS.questions.n + ', stem ' + pair(CAPS.questions.stem) + ', an option at most ' + CAPS.questions.option[1] + ', exp ' + pair(CAPS.questions.exp) + ' words'],
    ['sources', pair(CAPS.sources.n) + ', title ' + pair(CAPS.sources.title) + ' words, at least ' + CAPS.sources.web + ' https address'],
    ['entry', 'at most ' + CAPS.entry + ' reading words']
  ];
  rows.forEach((r) => console.log(r[0] + ': ' + r[1]));
  console.log('glass families: ' + GLASS_FAMILIES.join(', '));
  process.exit(0);
}
