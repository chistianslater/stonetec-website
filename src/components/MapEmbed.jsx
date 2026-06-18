import { useState, useEffect } from 'react'
import { getConsent, setConsent } from '../lib/consent.js'

const MAP_SRC =
  'https://maps.google.com/maps?q=stonetec%20GmbH%20Hamalandstra%C3%9Fe%202%20Bocholt&t=&z=15&ie=UTF8&iwloc=&output=embed'

export default function MapEmbed() {
  const [allowed, setAllowed] = useState(() => getConsent() === 'accepted')

  useEffect(() => {
    const onChange = (e) => setAllowed(e.detail === 'accepted')
    window.addEventListener('cookie-consent:changed', onChange)
    return () => window.removeEventListener('cookie-consent:changed', onChange)
  }, [])

  if (allowed) {
    return (
      <div className="bg-dark-bg rounded-xl overflow-hidden aspect-[21/9]">
        <iframe
          src={MAP_SRC}
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="stonetec Showroom Bocholt"
        />
      </div>
    )
  }

  return (
    <div className="bg-dark-bg rounded-xl aspect-[21/9] flex flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="font-dm text-[0.9rem] text-inv-muted max-w-md leading-relaxed">
        Die Karte wird über Google Maps geladen. Beim Anzeigen werden Daten an Google übertragen.
      </p>
      <button
        type="button"
        onClick={() => setConsent('accepted')}
        className="rounded-lg bg-warm-bg px-6 py-3 font-dm text-[0.8rem] font-semibold uppercase tracking-wider text-warm-text hover:bg-white transition-colors"
      >
        Karte laden
      </button>
      <a
        href="https://maps.google.com/?q=Hamalandstraße+2,+46399+Bocholt"
        target="_blank"
        rel="noopener noreferrer"
        className="font-dm text-[0.78rem] text-inv-tagline underline underline-offset-2 hover:text-inv-light transition-colors"
      >
        Stattdessen in Google Maps öffnen
      </a>
    </div>
  )
}
