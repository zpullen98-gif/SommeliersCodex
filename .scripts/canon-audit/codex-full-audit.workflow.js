export const meta = {
  name: 'codex-question-full-audit',
  description: 'Accuracy audit of every Sommelier Codex question (4,213 after the pilot): a Master Sommelier examiner per batch of sixteen, a skeptic per finding re-opens the legal texts and sources',
  phases: [
    { title: 'Examine', detail: 'one examiner per batch of sixteen questions' },
    { title: 'Verify', detail: 'a skeptic per finding' },
  ],
}

const DIR = args.dir
const N = args.batches

const FINDINGS = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'the question id, or for a question with no id its bank and the first words of its stem' },
          kind: { type: 'string', enum: ['wrong-key', 'second-correct-option', 'wrong-explanation', 'outdated', 'ambiguous-stem', 'wrong-fact-in-option', 'accept-list'] },
          claim: { type: 'string', description: 'the exact words in the stem, option, explanation or accept list that are wrong' },
          because: { type: 'string', description: 'what is true, with the source' },
          sources: { type: 'array', items: { type: 'string' } },
          fix: { type: 'string', description: 'the minimal correction, as replacement text or the right key index; never an instruction to someone else' },
        },
        required: ['id', 'kind', 'claim', 'because', 'sources', 'fix'],
      },
    },
  },
  required: ['findings'],
}

const VERDICT = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['confirmed', 'refuted', 'confirmed-with-better-fix'] },
    reason: { type: 'string' },
    sources: { type: 'array', items: { type: 'string' } },
    fix: { type: 'string' },
  },
  required: ['verdict', 'reason', 'sources', 'fix'],
}

const HOUSE = `
THE SOMMELIER CODEX is a study app for the Court of Master Sommeliers path (its levels are named Regionale, Village, Premier Cru, Grand Cru). Its banks hold two shapes of question:
- multiple choice: {id, cat, q (stem), opts (options), a (index of the keyed answer, 0-based), exp (explanation)};
- short answer: {id, cat, q, sa: true, ans (the model answer), accept (the list of answers the grader takes), exp}.
A candidate who learns a wrong key fails an exam on it, so an error here costs real money. A pilot of 178 questions found about one in ten faulty: wrong keys, a second correct option, facts stated in options or explanations that are false, rules that changed, founding dates wrong by decades, a family's history on one hill put on another.

REPORT ONLY:
- wrong-key: the keyed answer (or the model answer) is wrong.
- second-correct-option: another option is also correct.
- accept-list: the short-answer accept list takes a wrong answer or refuses a plainly right one.
- wrong-fact-in-option / wrong-explanation: a stated fact is false (a grape, a law, a minimum, an aging rule, a date, a place, a producer, a person).
- outdated: correct once, wrong under current law or classification; say when it changed.
- ambiguous-stem: a careful expert could reasonably key a different answer.
NOT a finding: style, a missing extra fact, a quibble, a brief explanation. Most questions are fine; an empty list is a good result.

EVIDENCE: check with the web (load WebSearch and WebFetch with ToolSearch "select:WebSearch,WebFetch"): the appellation's own legal text (INAO cahiers des charges, Italian disciplinari, the EU eAmbrosia register, TTB AVA rules, Spanish, Portuguese, German and Austrian law), the consorzi, interprofessions and producers' own pages, GuildSomm, Jancis Robinson and the Oxford Companion to Wine, the Court's own published material. Cite what you opened. If you cannot confirm, do not report it.
`

const examine = (i) => agent(`${HOUSE}
YOU ARE A MASTER SOMMELIER EXAMINER. Read your batch in full from ${DIR}/batch-${String(i).padStart(3, '0')}.json (each question carries its bank, id, category and fields). Check each: is the keyed or model answer right, is every other option wrong, does the accept list grade fairly, is every stated fact right and current? Return only real findings.`, { label: `examine:${i}`, phase: 'Examine', schema: FINDINGS, effort: 'high' })
  .then((r) => ((r && r.findings) || []).map((f) => ({ ...f, batch: i })))

const verify = (f) => agent(`${HOUSE}
YOU ARE THE SKEPTIC. An examiner claims this Codex question is faulty. REFUTE it if you can: re-open the sources yourself (legal texts first), and rule.
- "refuted": the question is right, or the finding does not hold.
- "confirmed": the question is faulty as the examiner says and the fix is right.
- "confirmed-with-better-fix": faulty, but the fix is off: give the better fix as replacement text.
Default to "refuted" when the evidence is not clear.

THE FINDING:
${JSON.stringify(f, null, 1)}

The question itself is in ${DIR}/batch-${String(f.batch).padStart(3, '0')}.json.`, { label: `verify:${f.id}`, phase: 'Verify', schema: VERDICT, effort: 'high' })
  .then((v) => (v ? { ...f, verdict: v.verdict, verifyReason: v.reason, verifySources: v.sources, finalFix: v.fix } : { ...f, verdict: 'unverified' }))

const idx = Array.from({ length: N }, (_, k) => k + 1)
const results = await pipeline(idx, (i) => examine(i), (fs) => parallel((fs || []).map((f) => () => verify(f))))
const dead = results.map((r, k) => (r === null ? k + 1 : null)).filter(Boolean)
if (dead.length) log(`${dead.length} batch(es) lost an agent: ${dead.join(', ')}; re-run them`)
const all = results.filter(Boolean).flat().filter(Boolean)
const confirmed = all.filter((f) => f.verdict === 'confirmed' || f.verdict === 'confirmed-with-better-fix')
log(`${all.length} findings: ${confirmed.length} confirmed`)
return { confirmed, refuted: all.filter((f) => f.verdict === 'refuted'), unverified: all.filter((f) => f.verdict === 'unverified'), deadBatches: dead }
