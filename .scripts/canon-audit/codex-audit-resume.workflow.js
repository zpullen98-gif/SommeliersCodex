export const meta = {
  name: 'codex-question-audit-resume',
  description: 'Finish the Codex question audit: skeptics for the 97 findings already found, and examiners plus skeptics for the 106 batches the session limit stopped',
  phases: [
    { title: 'Verify pending', detail: 'a skeptic per finding already on file' },
    { title: 'Examine', detail: 'one examiner per remaining batch of sixteen' },
    { title: 'Verify', detail: 'a skeptic per new finding' },
  ],
}

const DIR = args.dir
const PENDING = args.pendingDir
const NPEND = args.pendingCount
const MISSING = args.missingBatches

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
          claim: { type: 'string' },
          because: { type: 'string' },
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
    fix: { type: 'string', description: 'replacement text or the right key index, never an instruction' },
  },
  required: ['verdict', 'reason', 'sources', 'fix'],
}

const HOUSE = `
THE SOMMELIER CODEX is a study app for the Court of Master Sommeliers path (its levels are named Regionale, Village, Premier Cru, Grand Cru). Its banks hold two shapes of question:
- multiple choice: {id, cat, q (stem), opts (options), a (index of the keyed answer, 0-based), exp (explanation)};
- short answer: {id, cat, q, sa: true, ans (the model answer), accept (the list of answers the grader takes), exp}.
A candidate who learns a wrong key fails an exam on it, so an error here costs real money. A pilot of 178 questions found about one in ten faulty.

REPORT ONLY:
- wrong-key: the keyed answer (or the model answer) is wrong.
- second-correct-option: another option is also correct.
- accept-list: the short-answer accept list takes a wrong answer or refuses a plainly right one (the grader is matchSA in C:/Users/zpull/SommeliersCodex/js/core.js).
- wrong-fact-in-option / wrong-explanation: a stated fact is false.
- outdated: correct once, wrong under current law or classification; say when it changed.
- ambiguous-stem: a careful expert could reasonably key a different answer.
NOT a finding: style, a missing extra fact, a quibble. Most questions are fine; an empty list is a good result.

EVIDENCE: check with the web (load WebSearch and WebFetch with ToolSearch "select:WebSearch,WebFetch"): the appellation's own legal text (INAO cahiers des charges, Italian disciplinari, the EU eAmbrosia register, TTB AVA rules, Spanish, Portuguese, German and Austrian law), consorzi, interprofessions and producers' own pages, GuildSomm, Jancis Robinson, the Oxford Companion to Wine. Cite what you opened. If you cannot confirm, do not report it.
`

const SKEPTIC = (where) => `${HOUSE}
YOU ARE THE SKEPTIC. An examiner claims a Codex question is faulty. REFUTE it if you can: re-open the sources yourself (legal texts first), and rule.
- "refuted": the question is right, or the finding does not hold.
- "confirmed": the question is faulty as the examiner says and the fix is right.
- "confirmed-with-better-fix": faulty, but the fix is off: give the better fix as replacement text.
Default to "refuted" when the evidence is not clear.
${where}`

const verifyFile = (k) => {
  const path = `${PENDING}/finding-${String(k).padStart(3, '0')}.json`
  return agent(SKEPTIC(`THE FINDING is in ${path} (read it in full; its "batch" number names the question file ${DIR}/batch-NNN.json, three digits, where the question itself is).`), { label: `verify-pending:${k}`, phase: 'Verify pending', schema: VERDICT, effort: 'high' })
    .then((v) => (v ? { pendingFile: path, verdict: v.verdict, verifyReason: v.reason, verifySources: v.sources, finalFix: v.fix } : { pendingFile: path, verdict: 'unverified' }))
}

const examine = (i) => agent(`${HOUSE}
YOU ARE A MASTER SOMMELIER EXAMINER. Read your batch in full from ${DIR}/batch-${String(i).padStart(3, '0')}.json. Check each question: is the keyed or model answer right, is every other option wrong, does the accept list grade fairly, is every stated fact right and current? Return only real findings.`, { label: `examine:${i}`, phase: 'Examine', schema: FINDINGS, effort: 'high' })
  .then((r) => ((r && r.findings) || []).map((f) => ({ ...f, batch: i })))

const verifyNew = (f) => agent(SKEPTIC(`THE FINDING:
${JSON.stringify(f, null, 1)}

The question itself is in ${DIR}/batch-${String(f.batch).padStart(3, '0')}.json.`), { label: `verify:${f.id}`, phase: 'Verify', schema: VERDICT, effort: 'high' })
  .then((v) => (v ? { ...f, verdict: v.verdict, verifyReason: v.reason, verifySources: v.sources, finalFix: v.fix } : { ...f, verdict: 'unverified' }))

const [pending, fresh] = await parallel([
  () => parallel(Array.from({ length: NPEND }, (_, k) => () => verifyFile(k + 1))),
  () => pipeline(MISSING, (i) => examine(i), (fs) => parallel((fs || []).map((f) => () => verifyNew(f)))),
])
const pend = (pending || []).filter(Boolean)
const freshFlat = (fresh || []).filter(Boolean).flat().filter(Boolean)
const deadBatches = MISSING.filter((b, k) => !fresh || fresh[k] === null)
const ok = (v) => v === 'confirmed' || v === 'confirmed-with-better-fix'
log(`pending: ${pend.filter((p) => ok(p.verdict)).length} confirmed of ${pend.length}; new: ${freshFlat.filter((f) => ok(f.verdict)).length} confirmed of ${freshFlat.length}; ${deadBatches.length} batch(es) lost`)
return { pending: pend, fresh: freshFlat, deadBatches }
