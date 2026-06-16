import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import WizardProgress from './WizardProgress.jsx'
import { StepVorhaben, StepBereich, StepOrt, StepProjekt, StepTermin, StepKontakt } from './WizardSteps.jsx'
import { submitLead } from '../../lib/heroLeadClient.js'

const INITIAL = {
  vorhaben: '', bereich: '', zipcode: '', city: '', message: '',
  weekdays: [], daytimes: [], firstName: '', lastName: '', email: '', phone: '',
  privacy: false, company: '', images: [],
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AnfrageWizard() {
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0)
  const [data, setData] = useState(INITIAL)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const update = (field, value) => setData((d) => ({ ...d, [field]: value }))

  const steps = [
    { node: (p) => <StepVorhaben {...p} />, valid: () => !!data.vorhaben, auto: true },
    { node: (p) => <StepBereich {...p} />, valid: () => !!data.bereich, auto: true },
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
      await submitLead(data)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Senden fehlgeschlagen.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-dark-bg rounded-xl p-8 text-center">
        <svg className="mx-auto mb-4 h-12 w-12 text-inv-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="font-sora font-light text-lg text-inv-light mb-2">Anfrage gesendet</h3>
        <p className="font-dm text-[0.85rem] text-inv-muted">Wir melden uns innerhalb von 24 Stunden bei dir.</p>
      </div>
    )
  }

  const variants = reduce
    ? { initial: { opacity: 1 }, enter: { opacity: 1 }, exit: { opacity: 1 } }
    : { initial: { opacity: 0, x: 24 }, enter: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 } }

  return (
    <div className="bg-dark-bg rounded-xl p-6 md:p-8">
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
            {status === 'sending' ? 'Wird gesendet …' : 'Anfrage senden'}
          </button>
        ) : (
          <button type="button" onClick={goNext} disabled={!canNext}
            className="px-8 py-3.5 bg-warm-bg text-warm-text font-dm text-[0.85rem] font-semibold uppercase tracking-wider hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Weiter →
          </button>
        )}
      </div>
    </div>
  )
}
