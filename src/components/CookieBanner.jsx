import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getConsent, setConsent, loadAnalytics } from '../lib/consent.js'

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => !getConsent())

  useEffect(() => {
    if (getConsent() === 'accepted') loadAnalytics()

    const open = () => setVisible(true)
    window.addEventListener('cookie-settings:open', open)
    return () => window.removeEventListener('cookie-settings:open', open)
  }, [])

  if (!visible) return null

  const choose = (value) => {
    setConsent(value)
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie-Hinweis"
      className="fixed inset-x-0 bottom-0 z-50 p-4 md:p-6"
    >
      <div className="mx-auto max-w-3xl rounded-xl bg-dark-bg p-6 shadow-2xl shadow-black/30 md:flex md:items-center md:gap-8">
        <p className="font-dm text-[0.85rem] text-inv-muted leading-relaxed">
          Wir verwenden notwendige Cookies für den Betrieb der Seite. Mit deiner
          Einwilligung nutzen wir zusätzlich Statistik-Dienste (Google Analytics,
          Microsoft Clarity), um die Seite zu verbessern. Mehr dazu in der{' '}
          <Link to="/datenschutz" className="text-inv-light underline underline-offset-2 hover:text-white transition-colors">
            Datenschutzerklärung
          </Link>
          .
        </p>
        <div className="mt-5 flex shrink-0 gap-3 md:mt-0">
          <button
            type="button"
            onClick={() => choose('declined')}
            className="flex-1 whitespace-nowrap rounded-lg border border-inv-light/25 px-5 py-3 font-dm text-[0.8rem] font-medium text-inv-light hover:border-inv-light/50 transition-colors md:flex-none"
          >
            Nur notwendige
          </button>
          <button
            type="button"
            onClick={() => choose('accepted')}
            className="flex-1 whitespace-nowrap rounded-lg bg-warm-bg px-5 py-3 font-dm text-[0.8rem] font-semibold uppercase tracking-wider text-warm-text hover:bg-white transition-colors md:flex-none"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  )
}
