import { useState } from 'react'
// eslint-disable-next-line no-unused-vars -- `motion` is used as `motion.div` in JSX (flat config lacks JSX-member detection)
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import WizardProgress from './WizardProgress.jsx'
import AuswahlVorschau from './AuswahlVorschau.jsx'
import { useMerkzettel } from '../../hooks/useMerkzettel.js'
import { StepVorhaben, StepBereich, StepOrt, StepProjekt, StepTermin, StepKontakt } from './WizardSteps.jsx'
import { submitLead } from '../../lib/heroLeadClient.js'

const INITIAL = {
  vorhaben: '', bereich: [], zipcode: '', city: '', message: '',
  weekdays: [], daytimes: [], firstName: '', lastName: '', email: '', phone: '',
  privacy: false, company: '', images: [],
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AnfrageWizard() {
  const reduce = useReducedMotion()
  const merkzettel = useMerkzettel()
  const [step, setStep] = useState(0)
  const [data, setData] = useState(INITIAL)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const update = (field, value) => setData((d) => ({ ...d, [field]: value }))

  const steps = [
    { node: (p) => <StepVorhaben {...p} />, valid: () => !!data.vorhaben, auto: true },
    { node: (p) => <StepBereich {...p} />, valid: () => data.bereich.length > 0 },
    { node: (p) => <StepOrt {...p} />, valid: () => /^\d{4,5}$/.test(data.zipcode.trim()) },
    { node: (p) => <StepProjekt {...p} />, valid: () => true },
    { node: (p) => <StepTermin {...p} />, valid: () => true },
    { node: (p) => <StepKontakt {...p} />,
      valid: () => data.firstName.trim() && data.lastName.trim() && EMAIL_RE.test(data.email.trim()) && data.privacy },
  ]

  const isLast = step === steps.length - 1
  const canNext = steps[step].valid()
  const goNext = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const goBack = () => setStep((s) => Math.max(s - 1, 0))
  const advanceIfAuto = () => { if (steps[step].auto) setTimeout(goNext, 180) }

  const handleSubmit = async () => {
    setStatus('sending'); setErrorMsg('')
    try {
      await submitLead({ ...data, lookbookPicks: merkzettel.ids })
      setStatus('success')
      // Conversion `generate_lead` wird jetzt serverseitig in lead.php gefeuert
      // (GA4 Measurement Protocol) — zuverlässig und immun gegen Ad-Blocker.
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Senden fehlgeschlagen.')
    }
  }

  // Mit Enter weiter bzw. absenden — außer in der Beschreibung (Zeilenumbruch),
  // auf Buttons/Links (native Aktion) und während des Sendens.
  const handleKeyDown = (e) => {
    if (e.key !== 'Enter' || status === 'sending') return
    const tag = e.target.tagName
    if (tag === 'TEXTAREA' || tag === 'BUTTON' || tag === 'A') return
    if (!canNext) return
    e.preventDefault()
    if (isLast) handleSubmit()
    else goNext()
  }

  if (status === 'success') {
    return (
      <div className="bg-dark-bg rounded-xl p-8 text-center">
        <svg className="mx-auto mb-4 h-12 w-12 text-inv-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="font-sora font-light text-lg text-inv-light mb-2">Vielen Dank für deine Terminanfrage</h3>
        <p className="font-dm text-[0.85rem] text-inv-muted leading-relaxed">
          Wir melden uns in Kürze telefonisch bei dir zurück, um den genauen Termin abzustimmen.
        </p>
      </div>
    )
  }

  const variants = reduce
    ? { initial: { opacity: 1 }, enter: { opacity: 1 }, exit: { opacity: 1 } }
    : { initial: { opacity: 0, x: 24 }, enter: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 } }

  return (
    <div className="bg-dark-bg rounded-xl p-6 md:p-8 overflow-hidden" onKeyDown={handleKeyDown}>
      <AuswahlVorschau />
      <WizardProgress current={step} total={steps.length} />

      <AnimatePresence mode="wait">
        <motion.div key={step} variants={variants} initial="initial" animate="enter" exit="exit"
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>
          {steps[step].node({ data, update, onAdvance: advanceIfAuto })}
        </motion.div>
      </AnimatePresence>

      {status === 'error' && (
        <p className="mt-5 font-dm text-[0.82rem] text-red-300" role="alert">{errorMsg}</p>
      )}

      <div className="mt-8 flex items-center justify-between gap-4">
        <button type="button" onClick={goBack} disabled={step === 0}
          className="font-dm text-[0.82rem] text-inv-muted hover:text-inv-light disabled:opacity-0 transition-colors">
          ← Zurück
        </button>
        {isLast ? (
          <button type="button" onClick={handleSubmit} disabled={!canNext || status === 'sending'}
            className="px-8 py-3.5 bg-warm-bg text-warm-text font-dm text-[0.85rem] font-semibold uppercase tracking-wider hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            {status === 'sending' ? 'Wird gesendet …' : 'Terminanfrage senden'}
          </button>
        ) : (
          <button type="button" onClick={goNext} disabled={!canNext}
            className="px-8 py-3.5 bg-warm-bg text-warm-text font-dm text-[0.85rem] font-semibold uppercase tracking-wider hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Weiter →
          </button>
        )}
      </div>

      <p className="mt-6 border-t border-inv-light/10 pt-4 font-dm text-[0.8rem] text-inv-muted">
        Du möchtest nur kurz etwas fragen?{' '}
        <a href="mailto:fliesen@stonetec-bocholt.de" className="text-inv-light underline underline-offset-2 hover:text-white transition-colors">
          Schreib uns direkt eine E-Mail
        </a>.
      </p>
    </div>
  )
}
