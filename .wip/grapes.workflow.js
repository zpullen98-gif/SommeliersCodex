export const meta = {
  name: 'grapes-at-the-table',
  description: 'The Grapes tab at the table (codex57): a tableside description at the top of every grape, the glass in specific words, Old World and New World side by side, sixteen new grapes; built on codex57-wip and pushed as it goes',
  phases: [
    { title: 'Spec', detail: 'the pipeline, the schema, the brief and four pilot grapes' },
    { title: 'Build', detail: 'two layer engineers in sequence beside three content lanes (author then refuter per chunk)' },
    { title: 'Gates', detail: 'the full build, the new gate with mutations, every gate, the phone walk' },
    { title: 'Review', detail: 'an adversarial code review beside a second sommelier and a voice editor' },
    { title: 'Integrate', detail: 'freeze, every gate, six grapes read on a phone, the audit against the request' },
  ],
}

const C = '/home/user/sommelierscodex'
const L = '/home/user/bartendersledger'
const WT = '/home/user/worldtable'
const SITE = '/home/user/zpullen98-gif.github.io'
const SP = '/tmp/claude-0/-home-user-zpullen98-gif-github-io/09201eae-82ec-5cba-9316-4d6cf5955e5e/scratchpad'
const G = C + '/.scripts/grapes'
const PUSH = (paths, msg) => `flock -w 900 ${SP}/g57-git.lock sh -c 'cd ${C} && git add ${paths} && git commit -q -m "${msg}" --trailer "Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>" --trailer "Claude-Session: https://claude.ai/code/session_01VL9yU4iZw9wxc8Yt7TShYD" && git push -q origin codex57-wip'`

const CHUNKS = {
  g1: 'Sauvignon Blanc; Chenin Blanc; Melon de Bourgogne; Aligoté (new); Pinot Blanc (thin); Sémillon',
  g2: 'Riesling; Gewürztraminer; Grüner Veltliner; Muscat Blanc; Silvaner (thin); Müller-Thurgau (new)',
  g3: 'Viognier; Marsanne; Roussanne (thin); Grenache Blanc (new); Vermentino; Pinot Gris / Grigio',
  g4: 'Albariño; Godello; Verdejo; Macabeo (new); Palomino (thin); Pedro Ximénez (new)',
  g5: 'Garganega (thin); Cortese (thin); Arneis (new); Fiano (new); Verdicchio (new); Trebbiano (new, a family)',
  g6: 'Torrontés; Assyrtiko; Furmint; Savagnin; Petit Manseng',
  g7: 'Merlot; Cabernet Franc; Malbec; Petit Verdot (thin); Carmenère; Tannat',
  g8: 'Pinot Noir; Gamay; Zweigelt (thin); Blaufränkisch; Pinotage; Cinsault (thin)',
  g9: 'Syrah / Shiraz; Grenache / Garnacha; Mourvèdre / Monastrell; Carignan; Petite Sirah (new); Zinfandel',
  g10: 'Nebbiolo; Sangiovese; Barbera; Dolcetto (thin); Corvina; Montepulciano (new)',
  g11: 'Aglianico; Sagrantino; Nero d\'Avola (thin); Nerello Mascalese; Lambrusco (new, a family); Xinomavro',
  g12: 'Tempranillo; Graciano (new); Mencía; Touriga Nacional; Touriga Franca (new); Agiorgitiko (new)',
}
const LANES = [['g1', 'g4', 'g7', 'g10'], ['g2', 'g5', 'g8', 'g11'], ['g3', 'g6', 'g9', 'g12']]

const RULES = `THE OWNER'S RULE: Outside Of Time is the owner's own study tool, never sold and used by the owner alone; no legal pages, notices, paywalls or gating, ever. Claude does engineering and ChatGPT the art: never undo or edit ChatGPT's work.
READ FIRST: ${C}/CLAUDE.md lines 1 to 180 (grep it for anything else you touch), then ${C}/.wip/PLAN.md whole: the plan and its technical appendix are your brief, with the owner's request verbatim in appendix section 0.
HOUSE RULES for everything shipped or shown: no em or en dash anywhere (not U+2014, not U+2013, not an entity, not a spaced double hyphen; write a range with "to"); British spelling in our own words; never the word practice or practise in prose (use rehearse, drill, study); nobody living named (the long dead only, and only where the fact needs them); no price; nothing volatile (rankings, hectares, plantings, allocations, owners); no superlative (best, finest, greatest, most famous, iconic, legendary, world-class); levels named never numbered; no model or assistant name in any file or commit message. Never edit js/codex1.js to js/codex56.js, boot.js, any existing data file or any file of ChatGPT's: new behaviour goes in js/codex57.js and new data in js/data-grapes-table.js through the pipeline in .scripts/grapes.
DURABILITY: a container reclaim once lost a day of uncommitted work. Everyone works in ONE checkout, ${C}, branch codex57-wip, alongside other agents, so every commit and push goes through this command, which takes a shared lock (stage only your own paths; never git add -A or git add .; a plain message with no quote marks or apostrophes): ${PUSH('<your paths>', '<your message>')} . Commit and push after every finished section and before you end your turn. Never rebase, force push, stash, reset or switch branch. First read git log --oneline -15 and git status and go on from what a previous run of you pushed. Never leave a command running in the background when you end your turn; a long command runs in the foreground with a long timeout. Your final message IS your report: plain facts, no preamble.
GATES: bash ${C}/.wip/gates.sh runs every gate (about eight minutes, one line each, exit 1 on a failure; words after it filter by name, for example: bash .wip/gates.sh grapes card nav). It sets the browser paths and serves the source itself; give it your own port with PORT=<number> so two agents never share one. Every gate was green at master (.wip/gates-baseline.txt). Never weaken a gate to pass it; a pin moves only where the plan says it moves.`

const WRITING = `THE WRITING STANDARD (the same for every grape; ${G}/BRIEF.md, once written, is the full statement and the four pilot fragments are the measure):
- The forty-five second line (lines.s45, 90 to 110 words) is what a sommelier says standing at the table when a guest asks what this grape is like. It opens on the grape's name and moves through five beats in order: what it is and where it is at home; how it tastes, in named fruit and then structure in plain words; what the cellar does to it, and in one clause how the Old World and the New World differ where that applies; what to eat with it; one line of story or a hook. Plain declarative sentences that can be said aloud: no brackets, no semicolons, no abbreviations, no list longer than three, no figure of alcohol, no term a guest would need explained unless the same breath explains it.
- The sale (lines.sale) is exactly two sentences, 15 to 45 words: the hook (why this grape tonight), then the pour (the dish or the guest it suits). The ten second line (lines.s10, 12 to 25 words, names the grape) is one breath; the twenty (lines.s20, 25 to 50 words) is two.
- Say it: a respelling in hyphenated syllables with the stressed syllable in capitals (shar-doh-NAY); give the local form too where a guest meets both. For the Court's twenty it agrees with GRID_SAY in js/data-grid.js unless that one is wrong (say so in your report).
- The glass names the thing, never the family. Citrus becomes lemon zest, Meyer lemon, lime cordial, pink grapefruit, bergamot; orchard fruit becomes green apple, russet apple, ripe pear, quince; stone fruit becomes white peach, nectarine, apricot kernel; tropical fruit becomes pineapple, mango, passion fruit, guava; red fruit becomes sour cherry, wild strawberry, raspberry, cranberry, redcurrant; black fruit becomes cassis, blackberry, black plum, bilberry; floral becomes violet, rose petal, orange blossom, acacia, honeysuckle; spice becomes cracked black pepper, clove, liquorice, star anise; mineral becomes wet slate, crushed chalk, struck flint, oyster shell; oak becomes vanilla pod, toasted hazelnut, cedar, coconut, coffee, wood smoke; earth becomes forest floor, dried leaves, truffle, tar, leather. The build refuses a bare family word standing alone. The climate ladder is honest: what truly changes from a cool site to a warm one, and where.
- Old World and New World: describe the typical styles a guest meets on a list, hedged honestly (tends to, typically); the Old World is Europe and the Mediterranean rim, the New World the Americas, Australia, New Zealand and South Africa. why states the causes (climate and ripeness, oak, yeast and lees, the law, the label naming a place or a grape); blur must admit the exceptions (cool New World sites, modern Old World cellars); call is the one tell a blind taster leans on. A grape that stays at home gets home and abroad instead.
- Service: temperature as degrees Fahrenheit then Celsius in figures with the word degrees (never the sign), the glass, whether to decant, how it ages; agree with the Codex's own service reference (js/data-service-ref.js, js/data-floor.js, js/data-pairing.js) where it speaks. Food: three to five dishes with the reason in a few words; one may come from the Creole table of the owner's dining room (Gulf oysters, shrimp remoulade, gumbo, redfish, crawfish étouffée, turtle soup, bananas Foster) where it truly suits, never a menu item by its printed name.
- Build on what the Codex already teaches: read the grape's existing records first (GRAPES in js/reference.js, GRAPES_PLUS in js/data-grapes-plus.js, TASTE in js/data-tasting.js, INTRO_GRAPES in js/data-intro.js, GRID_READS in js/data-grid.js) and never contradict a reviewed fact; where you believe one is wrong, keep your entry right and say so in your report.
- Facts: every fact stands on two sources or one primary one (the appellation's rule, the regional or national wine body, a university or a standard reference work cited by its title alone). A source's title or address never names a living person. Leave out what you cannot confirm. No producer is named anywhere in an entry (the house's own bottles are drawn live on the page).
- Questions: a scene at a table or a blind glass, four options of one kind, one key, never all or none of the above, the answer never given away by the stem, an explanation of at most 45 words. Cards: the front is a cue, the back the answer.`

const SPEC = `You write the pipeline and the four pilot grapes of the Grapes tab edition (codex57) of the Sommelier's Codex. Repo ${C}, branch codex57-wip. ${RULES}
${WRITING}
Your targets are the plan's sections A and C and the appendix's sections 1, 5 and 6. Read too: the model pipelines (.scripts/cms/build-cms.cjs for the id minting and the dealing of answer positions; .scripts/regions/check-fragment.cjs, whose exported voice tests you require and reuse, never copy; .scripts/cms/chain.cjs, which loads the app into a vm), the Ledger's tableside schema for the lines' rules (${L}/tools/caskstyles/schema.mjs and one fragment beside it), and the grape data the pages draw today.
Write, committing and pushing after each:
1. ${G}/plan.json: the 75 grapes in the appendix's order, each with slug (the join's own for the 59; for the sixteen new the slug v53GrapeSlugOf gives the name, proved by loading the chain), name (the join's own name for the 59), colour, kind (grape or family), chunk (pilots, g1 to g12 exactly as the appendix lists them), status (full, thin or new), mode (contrast or home by the appendix's rule, with a one line modeWhy for every judged grape; expect about thirty contrast), aliases, world (TASTE.world where it exists) and court (true for the Court's twenty).
2. ${G}/schema.cjs: validate(fragment, plan) returns a list of problems naming the field and the rule. It holds every cap of the appendix's section 5 (tighten where the pilots show a cap is loose, never loosen), the sale's two sentences, s10 and s45 naming the grape, the generic refusal (a bare family word standing alone as a note or between commas in prose), the voice tests required from check-fragment.cjs (dashes, American forms, the retired word, superlatives, numbered levels) and these of its own: no degree sign, no price or currency, no producer pattern you can test, a compare slug in the roster and never the grape itself, contrast grapes carrying worlds.contrast with both sides and one question tagged worlds, thin and new grapes carrying profile, new grapes carrying targets, an entry within 900 reading words. Choose the glass family enum once and write it down.
3. ${G}/build-grapes.cjs exactly as the appendix's section 6 states: --lint <slug>... validates and writes nothing; the writing build makes js/data-grapes-table.js (var GRAPE_TABLE keyed by slug, in the plan's order, plus what the layer needs to look up an alias, in the manner and encoding of the Codex's other generated data files); --partial accepts a roster not yet whole and skips a failing fragment with a note; --check proves the shipped file equals the build. Ids are minted with a prefix nothing else in the Codex uses (prove it by grep), from the slug and the text, and frozen in ${G}/keys.v1.json; answer positions are dealt round robin.
4. ${G}/BRIEF.md: the writer's brief, complete enough that an author holding only it, plan.json and the pilots writes to the standard: the writing standard above made concrete, every field with its cap and one good and one refused example, the sources rule, how to lint.
5. The four pilots in full, researched (WebSearch), to the standard every other grape will be held to: ${G}/fragments/chardonnay.json and cabernet-sauvignon.json (both contrast: these two are the owner's own examples, so the side by side must be exemplary), meunier.json (new) and glera.json (thin). Lint each, then run the writing build with --partial and --check.
Do not touch index.html, sw.js or any gate: the engineer wires the shell.
Report: the schema's fields and caps as written, the glass families, the id prefix, the plan as a table (slug, chunk, status, mode), the exact lint and build commands, and anything an author must know that the brief does not say.`

const ENG1 = (spec) => `You build the first half of the layer js/codex57.js of the Sommelier's Codex: the shell, the join, the grape page and the root rows. Repo ${C}, branch codex57-wip. ${RULES}
The specification agent reports (trimmed): ${String(spec || '').slice(0, 3000)}
Your targets are the plan's section B and the appendix's sections 2, 3, 4, 7, 8 and 9. Read too: js/codex53.js lines 1223 to 1262 and 2060 to 3066 (the Grapes section you wrap), js/codex54.js lines 185 to 304 and 970 to 1000 (the tableside look and a wrapper of the root), js/codex56.js lines 495 to 520 (the wrapping idiom) and the head of codex56.js for a layer's skeleton, ${G}/schema.cjs and the built js/data-grapes-table.js. The data holds the four pilots now and the other grapes arrive while you work: never run the writing build, and draw a grape that has no table record exactly as codex53 draws it today.
In order, committing and pushing after each, with PORT=8791 for the gates:
1. The shell: js/codex57.js with the layers' skeleton (a header in their manner, var and function only, V57_WORDS read by v57W, one v57-style element whose every selector starts .wrap, day and night both read well); the two tags in index.html after codex56 and before boot; sw.js to codex-v116 with the two assets; the nine script-order lists of appendix section 7. Every gate green.
2. The join (appendix section 4): v57JoinAdd adds the new grapes the data holds in the join's own record shape, gives a thin or new grape its r.g from the table's profile, adds alias keys first writer wins, attaches targets. Move the pins of check-grapes.js and check-card.js as section 7 says (with --partial the counts follow the data; without it exactly 75 and no thin grape). Prove in a scratch script, and say in your report, that every name that resolved before resolves to the same slug, that the names which must stay unresolved do, and that the decks grapes and grapes-all, the blind flight and the Régionale table are untouched. Every gate green.
3. The page (wrap v53GrapeHtml): the At the table block first, in place of the lone Say it line (the forty-five second line large in the reading face, a rule, The sale, the ten second line, the twenty second line, Say it), restating codex54's look in v57-style; the fruit section led by the glass (the lead, then the notes by family with each family a quiet label and its named notes, the climate ladder cool to warm with where, the line of structure) above the rows codex53 already draws; new sections with their chips: Old World and New World (the two sides side by side at phone width as two stacked cards with the same three rows, then Why they differ, Where the line blurs, The blind call; or At home and Abroad for a home grape) before the regions, then before the Court's grid: Service and the table (temperature, glass, decanting, age; then At the table with food), What guests ask, On the label, Compare with (each neighbour a door to its page with the tell), and Sources closed at the foot. The Where it is grown pair is dropped where the table says more. All six v53-gs ids, Previous, Next and All stay; tags stay balanced.
4. The root rows (wrap v53GrapeShort): the glass lead for every grape that has one.
5. On Brennan's list (appendix section 4): the house's wines of this grape under Old World and New World, each row opening its wine card and Back returning to the grape; nothing drawn when no house is loaded.
Draw the pilots in the sandbox at all four levels through chain.cjs's cleanProblem and look at Chardonnay, Meunier and Glera in Chromium at 390 px, day and night (bash .wip/gates.sh shows the environment; .wip/serve.mjs serves the source; save the screenshots under ${SP}/grapes57/shots/eng1/). Every gate green before your last push.
Report: what you built by function name, every pin moved with its old and new value, anything the second engineer must know, every gate's last line.`

const ENG2 = (spec, e1) => `You build the second half of the layer js/codex57.js of the Sommelier's Codex: study, the three views and the root's new section. Repo ${C}, branch codex57-wip. ${RULES}
The specification agent reports (trimmed): ${String(spec || '').slice(0, 1800)}
The first engineer reports (trimmed): ${String(e1 || '').slice(0, 3000)}
Your targets are the plan's section B (the root and study) and the appendix's sections 4, 7, 8 and 9. Read js/codex57.js as the first engineer left it and keep its manner; read js/codex32.js lines 400 to 520 and 1590 to 1640 (decks, card faces, grades), js/codex53.js lines 2225 to 2320 and 2847 to 2890, js/codex56.js lines 350 to 700 (its schedule: reuse only v56Step, v56Today and v56AddDays, typeof guarded with a local fallback). Never run the writing build; the data fills while you work.
In order, committing and pushing after each, with PORT=8791 for the gates:
1. Study: decks grapecards (every table card), grapecards:<slug> and grapesdue through v32DeckDef; the card face gtable through v32CardFace; grades through v32Grade and v32Learnt into a slot of the layer's own, oot-codex-grapesrs-v1 through OOT.profiles.key, with the inner grape mark still running; the table's questions joined to each grape's drill through v53GrapeQuestions with the grape's notIn phrases; a grape page gains Cards at the table (its three cards, a due count) inside its cards section.
2. The root (wrap v53GrapesRootHtml): a new section At the table, before the Tasting section, with three doors and a filter of the rows (All, White, Red, On our list) that hides rows without redrawing; a due count on the cards door.
3. The three views, each owned by Grapes with Back to the root and a cold address that works: grapeworlds (the side by side grapes as an index, and a call drill: a described glass, Old World or New World, the answer with the tell, ten to a round, scored), grapecompare (choose two grapes; the glass, the structure, the tell and service side by side), grapepresent (the name shown, you speak, reveal the forty-five second line and The sale, mark yourself said it or not yet; the mark feeds the schedule).
4. The pins: check-house-only.cjs rows for the three views, the chip pin, anything in check-nav.js the new views touch. Every gate green.
Look at the root, each view and a graded card in Chromium at 390 px, day and night (screenshots under ${SP}/grapes57/shots/eng2/); every control at least 44 px, no sideways scroll, a clean console.
Report: what you built by function name, storage keys and their shape, every pin moved, every gate's last line.`

const AUTHOR = (k) => `You are a master sommelier and the floor's finest teacher of servers, writing the Grapes tab's tableside entries for chunk ${k}: ${CHUNKS[k]}. Repo ${C}, branch codex57-wip. ${RULES}
${WRITING}
Read ${G}/BRIEF.md, ${G}/plan.json (your grapes: slug, status, mode, aliases), ${G}/schema.cjs and the four pilot fragments in ${G}/fragments/ (chardonnay, cabernet-sauvignon, meunier, glera) before you write a word; they are the measure. For each grape of your chunk, in the chunk's order: read what the Codex already holds on it, research what you need (WebSearch, at most six calls a grape; two sources or one primary for every fact), write ${G}/fragments/<slug>.json whole, run node ${G}/build-grapes.cjs --lint <slug> until it is clean, then commit and push that one fragment before you start the next. Never run the writing build and never touch another file. A thin or new grape needs its profile, a new grape its targets (slugs that exist in REGIONS: check them in js/data-regions-index.js or with the chain). Compare a grape with the neighbours a guest truly confuses it with, by slugs of the roster.
Read each forty-five second line aloud in your head before you keep it: if you would not say it to a guest, rewrite it. No two of your grapes may open or close the same way.
Report: per grape the sources, the mode, and anything uncertain or anything in the Codex's existing records you believe is wrong.`

const CHECK = (k) => `You are a second master sommelier whose brief is to refute, not to admire, the Grapes tab entries of chunk ${k}: ${CHUNKS[k]}. Repo ${C}, branch codex57-wip. ${RULES}
${WRITING}
Read ${G}/BRIEF.md, ${G}/plan.json, ${G}/schema.cjs and the pilot fragments, then every fragment of the chunk in ${G}/fragments/. For each entry try to break it: every fact against two sources (WebSearch, at most five calls a grape), the grape's parentage, home and synonyms, the appellation rules it leans on, the service figures; the glass against the grape as a taster knows it (would a blind taster nod at every note, and is anything a bare family word in disguise such as citrus fruits or red berries); the Old World and New World entry for a false or lazy generalisation, a missing exception in blur, a call that would not survive a blind flight, and agreement with TASTE.world and with the Codex's existing records for the grape; the four lines by count and by ear (say the forty-five second line aloud: is it what a sommelier would say at a table, five beats in order, nothing a guest must have explained); the sale's two sentences; nobody living, no producer, no price, nothing volatile, no superlative, no dash, British spelling, never the retired word; the three cards and three questions (one key, four options of one kind, nothing given away, the worlds question where the plan asks one); the compare slugs and tells from both sides; a new grape's targets and a thin grape's profile. Fix every failure in the fragment itself, run node ${G}/build-grapes.cjs --lint on the chunk until clean, write ${G}/reviews/check-${k}.json (per grape: what you tested, what you changed and why, with the source), then commit and push the fragments and the review. Never run the writing build and never touch another file.
Report: the fixes by kind and by grape, and anything you could not settle.`

const GATES = (spec, e2, lanes) => `You write the Grapes tab edition's own gate and prove the whole edition. Repo ${C}, branch codex57-wip. ${RULES}
The specification agent reports (trimmed): ${String(spec || '').slice(0, 1500)}
The second engineer reports (trimmed): ${String(e2 || '').slice(0, 2500)}
The content lanes report (trimmed): ${String(lanes || '').slice(0, 2500)}
Your targets are the plan's sections C and Verification and the appendix's sections 6 and 7. You are independent of the engineers: read js/codex57.js as a stranger would. In order, committing and pushing after each, with PORT=8792 for the gates:
1. The data: node ${G}/build-grapes.cjs --lint on all 75, then the writing build with no --partial and --check. A fragment that fails is fixed at its form only (a cap, a bare generic, a spelling), never its facts; list each fix. Commit the data file and the keys.
2. The pins made exact: check-grapes.js and check-card.js at 75 with no thin grape and no synthesised card, run without --partial.
3. .scripts/check-grapes-table.js on the model of check-atlas-course.js (lines 800 to 828 for its mutations) and the Ledger's ${L}/tools/check-caskstyles.mjs (lines 846 to 888): the roster whole and in the plan's order; every record through schema.cjs; every cap; the sale's two sentences; no bare generic in any shown string; every contrast grape with both sides and its worlds question; aliases resolving to their own grape and to no other, the names that must stay unresolved still unresolved, and every name that resolved at master resolving to the same slug; compare slugs real and never the grape itself; all 75 pages drawn at all four levels clean (cleanProblem, the voice test) with the At the table block before the chips, the six v53-gs ids kept and the new sections present; the root listing all 75 once each with a lead on every row; the 59 old pages still holding everything they held at master (draw master's page from git show into a second sandbox and compare the old sections); On Brennan's list rows on the fixture house opening real cards and split by world; the decks, the card face, the schedule on seeded grades (a card graded right is due later, wrong is due sooner) in its own slot with the grape cards' slot untouched; the table's questions in the drill and the notIn phrases kept out; the three views drawing and climbing back; ids frozen against keys.v1.json; the data equal to the build; the shell (the two tags in order, codex-v116 or later, both assets); every list in .scripts that names codex56.js naming the two new files straight after it; js/codex57.js var and function only, typeof guarded wrappers, every .wrap selector, every shown word from V57_WORDS, no dash. With --mutations at least twelve seeded faults, each caught by name. It takes [jsDir] like check-grapes.js so the site's wing copy can be checked, and skips a tree with no codex57.js.
4. bash .wip/gates.sh: every gate green. A failure in the layer is fixed in js/codex57.js; say what you fixed.
5. The phone walk .wip/walk-grapes.mjs on the model of .wip/walk54.mjs (same harness and environment), at 375 and 390 px, day and night, clean console, every control at least 44 px, no sideways scroll: the root (rows with leads, the filter, the new section), Chardonnay and Cabernet Sauvignon (the block first with the forty-five second line at reading size, the side by side, a house wine opened and Back to the grape), Meunier (reached from a house wine's grape door), Glera, Old World and New World with a round of the call drill, compare two grapes, Present it, a card graded and due later, cold reloads of a grape page and each view. Then .wip/walk54.mjs once at 390 px by day as a regression, moving its Grapes step only where this edition moved the page. Save screenshots of the top of the Chardonnay page, its side by side, the root, Meunier, Glera and each view, day and night at 390 px, under ${SP}/grapes57/shots/gates/.
Report: the build's counts, every form fix, the gate's checks and mutations by name, every gate's last line, the walk's results, the screenshot paths, anything you fixed in the layer.`

const CODEREVIEW = (e1, e2, gates) => `You are an adversarial reviewer of js/codex57.js, the Grapes tab layer of the Sommelier's Codex, written by others. Your brief is to find what is wrong, not to approve. Repo ${C}, branch codex57-wip. ${RULES}
The engineers and the gates agent report (trimmed): ${String(e1 || '').slice(0, 1200)} ... ${String(e2 || '').slice(0, 1200)} ... ${String(gates || '').slice(0, 1500)}
Read the plan's section B and the appendix's sections 2, 3, 4 and 9, then js/codex57.js whole, then the functions it wraps in codex53, codex54, codex32, codex28 and codex56. Hunt, with a scratch sandbox through .scripts/cms/chain.cjs and Chromium where it helps (PORT=8793):
- side effects of the join on other tabs: house wine cards' grape doors (v54CodexDoors), region pages' grape lists (v55Grapes), the Court's grid distractors (v53GrapeChoices), drill pools through new alias keys (v53Hays), search; a key stolen from an existing grape; a grape resolving that the gates say must not;
- a wrapper that is not typeof guarded, not outermost, that throws to the page, re-registers a view, mutates a data array or record it did not create (GRAPES, GRAPES_PLUS, INTRO_GRAPES, TASTE, GRID_READS and the join's own cached records count), or breaks when the table, a record, a field or the house is missing;
- storage: the layer's slot read and written only through OOT.profiles.key, never codexStats, the grape cards' slot and its key by name untouched, a corrupt or empty slot survived;
- markup: unbalanced tags, a duplicate id, an unescaped value, a control under 44 px, a string shown that is not in V57_WORDS, a selector not starting .wrap, a rule that leaks onto another page, night service unreadable, sideways scroll at 320 px;
- the routes: cold addresses, Back from every new view and from a house card to the grape, the bar word lit, a bad slug.
Fix every real fault in js/codex57.js (and add its check to .scripts/check-grapes-table.js so it cannot return), then bash .wip/gates.sh. Another reviewer is editing fragments while you work, so the one check that the data equals the build may lag until the integrator rebuilds: that alone you may leave. Commit and push after each fix.
Report: every fault found with its proof, the fix, and what you tried that held.`

const WORLDS = (lanes) => `You are a master sommelier and a blind tasting examiner giving the second reading of every Old World and New World entry of the Grapes tab. Your brief is to refute. Repo ${C}, branch codex57-wip. ${RULES}
${WRITING}
The content lanes report (trimmed): ${String(lanes || '').slice(0, 2500)}
Read ${G}/BRIEF.md and ${G}/plan.json, then the worlds field, the glass ladder and the worlds question of all 75 fragments in ${G}/fragments/. Test, across the set and not one at a time: is the mode right for each grape by the appendix's rule (a contrast grape whose New World side is thin belongs at home, and a home grape a guest meets from both worlds belongs side by side: change plan.json and the fragment together, and keep every grape TASTE.world flags both as contrast); is each generalisation true and fairly hedged; does blur name the real exceptions; would call survive a blind flight; do the entries agree with one another (what Chardonnay's entry says of Burgundy and California against Pinot Noir's, Cabernet Sauvignon's against Merlot's and Cabernet Franc's, Syrah's against Grenache's and Mourvèdre's, Sauvignon Blanc's against Sémillon's) and with the region articles of the Codex where they speak (js/data-regions-*.js through the chain); are the two sides written to the same three rows so they read side by side; is the compare tell of each pair true from both sides. Verify what you doubt (WebSearch, at most forty calls in all). Fix in the fragments, lint all 75 (node ${G}/build-grapes.cjs --lint with every slug), write ${G}/reviews/worlds.json (per grape: verdict, change, source), commit and push the fragments, plan.json and the review. Never run the writing build.
Report: every change with its reason, the final count of side by side grapes, anything unsettled.`

const VOICE = (lanes, worlds) => `You are the editor of the Grapes tab's spoken lines, a sommelier who has trained a dining room's servers for years. Thirteen writers wrote 75 entries; your work is to make them one voice at the standard of the pilots. Repo ${C}, branch codex57-wip. ${RULES}
${WRITING}
The second sommelier reports (trimmed): ${String(worlds || '').slice(0, 1500)}
Read ${G}/BRIEF.md and the four pilots, then say, lines (s10, s20, s45, sale) and glass.lead of all 75 fragments. Fix, in the fragments: a forty-five second line that cannot be said aloud, that misses a beat or runs them out of order, that leans on a term a guest must have explained, or that lists more than three things; openings and closings repeated across the set (no construction may open more than six of the 75 forty-five second lines, and no two sales may share their hook); a sale that is not two sentences or does not end on the pour; a ten second line that is not one breath; one respelling system across all 75 (hyphenated syllables, the stressed one in capitals, agreeing with GRID_SAY for the Court's twenty); a glass lead that hides a bare family word; anything formulaic that a guest would hear as recited. Change no fact: where a line is wrong in fact, note it in your report and correct it only with a source. Lint all 75, write ${G}/reviews/voice.json (per grape: what changed), commit and push. Then, as the last content hand, run the writing build (node ${G}/build-grapes.cjs, then --check) and commit and push js/data-grapes-table.js and ${G}/keys.v1.json.
Report: the changes by kind with counts, the openings tally, anything left for the integrator.`

const INTEGRATE = (gates, code, worlds, voice) => `You integrate the Grapes tab edition (codex57) of the Sommelier's Codex. Repo ${C}, branch codex57-wip. ${RULES}
The gates agent reports (trimmed): ${String(gates || '').slice(0, 2200)}
The code reviewer reports (trimmed): ${String(code || '').slice(0, 1800)}
The second sommelier and the voice editor report (trimmed): ${String(worlds || '').slice(0, 1200)} ... ${String(voice || '').slice(0, 1200)}
In order, committing and pushing after each, with PORT=8794 for the gates:
1. node ${G}/build-grapes.cjs --lint on all 75, the writing build, --check; the keys frozen; the counts stated (grapes, side by side, new, thin filled, cards, questions, words).
2. bash .wip/gates.sh: every gate green, with node .scripts/check-grapes-table.js and its --mutations; fix at the layer or at a fragment's form.
3. The walk .wip/walk-grapes.mjs at 375 and 390 px, day and night; then read six grapes on screen at 390 px, day and night, top to bottom as the owner would (Chardonnay, Cabernet Sauvignon, Riesling, Nebbiolo, Meunier, Trebbiano) and fix anything that reads or sits badly; save the final screenshots under ${SP}/grapes57/shots/final/ (the top of each of the six, Chardonnay's and Cabernet Sauvignon's side by side, the root, the three views; day and night).
4. The audit against the owner's request (appendix section 0), each line answered with proof from the built app, not from memory: every one of the 75 pages opens on the tableside description; no Grapes tab surface (a page's top and glass, a root row, a table card) shows a bare family word such as citrus standing alone (scan the drawn HTML of all 75 pages and the root); Chardonnay and Cabernet Sauvignon and every other side by side grape describe the Old World and the New World; list the further improvements delivered. Fix what the audit finds.
5. ${C}/CLAUDE.md: a section for this edition in the manner of the codex56 section (the request, what was found, the files, the schema and pipeline with its commands, who may run the writing build, the wrappers by name, the storage slot, the views and addresses, the gate and its usage line, every pin that moved, what was deliberately left alone), the worker line and the layer list moved, codex58 named next (lines 52 to 53, 72 to 73, 171 to 172 and the gate usage near 148, 223 and 293). Every gate green after it.
Report: the counts, the audit line by line with its proof, every gate's last line, the walk's results, the screenshot paths, the final commit, and anything the owner should know (facts left out for want of a source, Codex records the writers believe are wrong).`

phase('Spec')
const s = await agent(SPEC, { label: 'spec', phase: 'Spec' })

phase('Build')
const lanesRun = async () => {
  const res = await parallel(LANES.map((ks) => () => (async () => {
    const out = {}
    for (const k of ks) {
      out[k] = String(await agent(AUTHOR(k), { label: `author:${k}`, phase: 'Build' })).slice(0, 700)
      out[k + '-check'] = String(await agent(CHECK(k), { label: `check:${k}`, phase: 'Build' })).slice(0, 700)
    }
    return out
  })()))
  return Object.assign({}, ...res.filter(Boolean))
}
const engRun = async () => {
  const e1 = await agent(ENG1(s), { label: 'engineer:join-page', phase: 'Build' })
  const e2 = await agent(ENG2(s, e1), { label: 'engineer:study-views', phase: 'Build' })
  return [e1, e2]
}
const [lanes, eng] = await parallel([() => lanesRun(), () => engRun()])
const [e1, e2] = eng || []
const lanesText = JSON.stringify(lanes || {})

phase('Gates')
const g = await agent(GATES(s, e2, lanesText), { label: 'gates', phase: 'Gates' })

phase('Review')
const contentReview = async () => {
  const w = await agent(WORLDS(lanesText), { label: 'review:worlds', phase: 'Review' })
  const v = await agent(VOICE(lanesText, w), { label: 'review:voice', phase: 'Review' })
  return [w, v]
}
const [code, content] = await parallel([
  () => agent(CODEREVIEW(e1, e2, g), { label: 'review:code', phase: 'Review' }),
  () => contentReview(),
])
const [w, v] = content || []

phase('Integrate')
const i = await agent(INTEGRATE(g, code, w, v), { label: 'integrate', phase: 'Integrate' })
return {
  spec: String(s).slice(0, 2500),
  engineers: [String(e1).slice(0, 1800), String(e2).slice(0, 1800)],
  lanes: lanesText.slice(0, 6000),
  gates: String(g).slice(0, 3000),
  code: String(code).slice(0, 2500),
  worlds: String(w).slice(0, 2000),
  voice: String(v).slice(0, 2000),
  integrate: String(i).slice(0, 5000),
}
