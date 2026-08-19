import { useEffect, useState } from 'react'

// Mobile-Sticky-CTA für Landingpages: Der Anfrage-Wizard liegt ~8 Bildschirm-
// höhen tief — diese Leiste hält ihn jederzeit auf einen Daumen-Tipp erreichbar.
// Blendet sich aus, sobald die Anfrage-Section selbst sichtbar ist (dann wäre
// sie nur Deckung über dem Formular).
export default function StickyCta() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const target = document.getElementById('anfrage')
    if (!target || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting))
    io.observe(target)
    return () => io.disconnect()
  }, [])

  if (hidden) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-warm-anthrazit/10 bg-warm-bg/95 p-3 backdrop-blur md:hidden">
      <a
        href="#anfrage"
        className="flex-[2] rounded-lg bg-dark-bg py-3.5 text-center font-dm text-[0.8rem] font-semibold tracking-wider uppercase text-inv-light"
      >
        Jetzt Termin anfragen
      </a>
      <a
        href="tel:+4928719912480"
        className="flex-1 rounded-lg border border-warm-anthrazit/25 py-3.5 text-center font-dm text-[0.8rem] font-semibold tracking-wider uppercase text-warm-text"
      >
        Anrufen
      </a>
    </div>
  )
}
