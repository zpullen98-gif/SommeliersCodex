export const meta = {
  name: 'card-sale-rebuild',
  description: 'The sale line for 271 Brennan\'s wines and the five-star review of every forty-five second description, ten staged chunks by one author each in two lanes, then a sample checker per lane; every chunk pushed to card-sale-wip',
  phases: [
    { title: 'Chunks', detail: 'ten chunks, one author each, two lanes' },
    { title: 'Check', detail: 'one checker per lane reads ten wines from each of its chunks' },
  ],
}

const WT = '/home/user/worldtable'
const PLANF = '/home/user/sommelierscodex/.wip/PLAN.md'
const SP = '/tmp/claude-0/-home-user-zpullen98-gif-github-io/09201eae-82ec-5cba-9316-4d6cf5955e5e/scratchpad'
const TRAILER = 'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01VL9yU4iZw9wxc8Yt7TShYD'
const CHUNKS = {
  'sale-1': 'every wine on the menus (list is not "bottle"): the 15 by the glass, the 6 tasting pours, the Auslese half bottle and the 12 Bubbles bottles (34)',
  'sale-2': 'the floor section "Champagne bottles" (29)',
  'sale-3': 'the floor section "Half-bottles", the FIRST 19 wines in the pack\'s order',
  'sale-4': 'the floor section "Half-bottles", wines 20 to 38 in the pack\'s order (19)',
  'sale-5': 'the floor sections "White Burgundy" (18) and "Rhône" (11)',
  'sale-6': 'the floor section "Other whites" (33)',
  'sale-7': 'the floor sections "Red Burgundy" (16) and "Other reds" (9)',
  'sale-8': 'the floor sections "Bordeaux" (19) and "Large formats" (7)',
  'sale-9': 'the floor sections "Italy and Spain" (17) and "California Cabernet and Napa" (15)',
  'sale-10': 'the floor section "Dessert and fortified" (25)',
}
const LANES = (typeof args === 'object' && args && args.lanes) || [['sale-1', 'sale-2', 'sale-3', 'sale-4', 'sale-5'], ['sale-6', 'sale-7', 'sale-8', 'sale-9', 'sale-10']]
const STG = WT + '/tools/house/brennans/_staging'
const BUILD = (n) => `flock -w 900 ${SP}/card/staging.lock sh -c 'cd ${WT} && node tools/house/build-brennans.mjs --staging ${n} && node tools/house/validate-pack.mjs --staging ${n}'`
const PUSH = (paths, msg) => `flock -w 900 ${SP}/card/git.lock sh -c 'cd ${WT} && git add ${paths} && git commit -q -m "${msg}" --trailer "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" --trailer "Claude-Session: https://claude.ai/code/session_01VL9yU4iZw9wxc8Yt7TShYD" && git push -q origin card-sale-wip'`

const RULES = `Rules for every string you write: no dash of any kind (not U+2014, not U+2013, not an entity, not a spaced double hyphen; use a comma, a colon or a full stop); British spelling in the override value (the builder americanises at build); nobody living named (a founder only when dead and found in the research); no superlative (best, finest, greatest, most anything, legendary, iconic, world class); none of the engine's BANNED_WORDS (grep BANNED_WORDS ${WT}/tools/house/engine.mjs); no hedge (confirm whether, may be, might be); no price figure; no question to the guest; no allergen talk; every proper name and year must stand in the hay (tools/house/brennans/guide.txt, pages/*, research/*): the builder prints names found in neither, and each is fixed by a name the hay holds or by leaving it out. Never edit overrides.json, the fragments, the engine or the builder; write only your chunk's files under ${STG}/.
DURABILITY (binding): the last container was reclaimed and every unpushed file was lost. Write your staged file early and add to it wine by wine (it must parse after every save). After every eight wines or so, and before you end your turn, commit and push your chunk's files with exactly this command (it takes a lock, since another lane shares the checkout): ${PUSH('<your two or three files>', 'card-sale: <chunk> <what>')} . Before you start, read ${STG}/ and git log --oneline -10 on branch card-sale-wip: a previous run may have pushed part of your chunk; keep every entry that is right and go on from it. Never run a command in the background and end your turn; your final message IS your report.
THE SETTLED RULES (a lost round of authors and refuters found these; apply them all): THE SALE is exactly two sentences, 15 to 45 words by the engine's own word counter (it counts "46°F" as two words, so check with the engine's words() and sentences() in tools/house/engine.mjs). Sentence one is the hook (what it tastes like in concrete words, or what makes it ours). Sentence two is the table and the step. Name a dish by its printed name ONLY when the wine is in that dish's pairing as its first pick (the wine's firstPickIds), its second choice (secondFor) or one of its bottle tiers (offeredWith, said as the value bottle, the classic, the celebration or the half bottle); NEVER a snack or dish with no pairing link to this wine, and never "our first pick" unless that dish's own pick is this wine; a wine with no link speaks of the kind of plate its goesWith names. The step is true to the record: "by the glass" only with a glass price; "the Coravin pour" only when serve says so; "the half bottle" for 375 ml; the magnum or the format by size; the six tasting pours (no glass or bottle price) say "the 4 oz pour on the Traditional Breakfast" or "on the Dinner Tasting Menu"; the Bubbles rosés say "by the bottle at Bubbles"; otherwise "by the bottle". THE DESCRIPTION (lines.s45) is five-star only when it opens on the wine as the list prints it (never on the house, founder or story); names grape and place; carries one clause on how it is made; says how it tastes in concrete words; names dishes only under the same link rule as the sale; says how we pour it from serve; carries one line of story from the hay; shares no run of eight or more words with the s20 word for word; names nobody living; uses no hedge; and runs 104 to 110 engine words (cap 110). Read each s45 against every point; where it fails any, write a new one that keeps every right and sourced fact. Expect many to fail: in the lost run every Champagne bottle's description failed (snack names, false picks, living founders), and a refuter overturned five of the menu chunk's eleven five-star verdicts.`

const AUTHOR = (n) => `You are a master sommelier and the floor's best server, writing chunk ${n} of the sale for Brennan's wines: ${CHUNKS[n]}. Repo ${WT}, branch card-sale-wip. ${RULES}
Read ${PLANF} (the context and the settled rules again), then ${WT}/tools/house/brennans/guide.txt (the WINE and pairing blocks), and select your wines from the shipped pack ${WT}/static/shared/packs/brennans-new-orleans.v1.oothouse.json with a small node script (house.wines by list and section as the chunk says; print for each: name, section, list, price, glass, bottle, bin, size, grapes, region, producer, vintage, parts, lines, profile, goesWith, serve, say, guest, why, origin, the kept notes, firstPickIds, secondFor, offeredWith, and for each dish id in those three the dish's printed name). Read the research the wine rests on (grep -ril the producer in tools/house/brennans/research/ and pages/) before writing about it. Copy the entry shape from five existing lines.s45 wine entries in tools/house/brennans/overrides.json.
Write ${STG}/${n}.overrides.json as { "entries": [ ... ] } (target "wine:<the exact name as the pack prints it>", field, op "set", value, reason, source): for EVERY wine one "lines.sale" entry, plus a "lines.s45" entry wherever the description fails a point. Write ${STG}/${n}.review.json: { "wines": [ { "name", "s45": "five-star" | "rewritten", "reason", "dishes": [the printed names the sale names] } ] }. When every wine is done run, as one command, ${BUILD(n)} ; it must end with 0 fatal: fix your staged file until it does. Then push. Report: sales written, descriptions kept and rewritten with the reasons grouped, the dishes named and for which wines, names fixed, and validate-pack's last two lines.`

const CHECK = (names) => `You are a second master sommelier whose brief is to refute, not to admire. Check a sample of the staged sale chunks ${names.join(', ')} for Brennan's wines. Repo ${WT}, branch card-sale-wip. ${RULES}
For EACH chunk, read ${STG}/<chunk>.overrides.json and .review.json and pick ten wines spread across the chunk (at least three with a rewritten description, three kept five-star, and every wine whose sale names a dish). For each sampled wine read its record in the shipped pack (lines, serve, glass, bottle, size, list, firstPickIds, secondFor, offeredWith and the dishes those name) and test the sale and the description against every settled rule: word and sentence counts by the engine's own functions; the dish link rule; the step; the banned, superlative, hedge, price, question, living person and dash rules; every proper name and year in the hay; the run of eight words against the s20; the five-star points. Fix every failure in place, then scan the WHOLE chunk mechanically (a node script) for the failure kinds you found, and fix every instance. Run ${BUILD('<chunk>')} per chunk (0 fatal), write ${STG}/<chunk>.check.json ({ "sampled": [names], "fixed": [ { "name", "field", "what" } ], "swept": "<what the scan looked for and found>" }) and push each chunk's files as you finish it. Report per chunk: sampled, fixed, the sweep, the build's last line.`

phase('Chunks')
const lane = (names) => (async () => {
  const out = {}
  for (const n of names) out[n] = String(await agent(AUTHOR(n), { label: `author:${n}`, phase: 'Chunks' })).slice(0, 2500)
  phase('Check')
  out.check = String(await agent(CHECK(names), { label: `check:${names[0]}..${names[names.length - 1]}`, phase: 'Check' })).slice(0, 3000)
  return out
})()
const results = await parallel(LANES.map((names) => () => lane(names)))
return results.filter(Boolean)
