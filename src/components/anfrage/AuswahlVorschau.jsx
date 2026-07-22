import { useEffect, useState } from 'react'
import { useMerkzettel } from '../../hooks/useMerkzettel.js'
import { loadLookbook } from '../../lib/lookbookData.js'

// Zeigt über dem Wizard, welche gemerkten Bilder mit der Anfrage rausgehen.
// Lädt den Bildbestand selbst — der Aufruf ist 60 Sekunden zwischengespeichert
// und kostet auf der Kontaktseite praktisch nichts.
export default function AuswahlVorschau() {
  const merkzettel = useMerkzettel()
  const [sections, setSections] = useState([])

  useEffect(() => {
    let cancelled = false
    loadLookbook().then((next) => {
      if (!cancelled) setSections(next)
    })
    return () => { cancelled = true }
  }, [])

  if (merkzettel.count === 0) return null

  const byId = new Map()
  for (const section of sections) {
    for (const image of section.images) byId.set(image.id, { ...image, categoryLabel: section.title })
  }
  const picked = merkzettel.ids.map((id) => byId.get(id)).filter(Boolean)
  if (picked.length === 0) return null

  return (
    <div className="mb-6 rounded-xl border border-warm-anthrazit/15 bg-warm-anthrazit/5 p-5">
      <p className="mb-4 font-dm text-[0.85rem] text-warm-text">
        {picked.length === 1
          ? '1 Bild aus deiner Auswahl wird mitgeschickt.'
          : `${picked.length} Bilder aus deiner Auswahl werden mitgeschickt.`}
      </p>
      <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
        {picked.map((image) => (
          <li key={image.id} className="relative">
            <img
              src={image.src}
              alt={image.caption?.trim() ? image.caption : image.categoryLabel}
              loading="lazy"
              className="aspect-square w-full rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={() => merkzettel.remove(image.id)}
              aria-label="Aus der Auswahl entfernen"
              className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-dark-bg text-inv-light transition-colors hover:bg-warm-anthrazit"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
