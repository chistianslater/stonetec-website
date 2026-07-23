// Echte Google-Rezensionen (Profil StoneTec GmbH, Stand 2026-07: 5,0 ★ bei 31
// Bewertungen). Zitate gekürzt, Auslassungen mit „…" markiert — nie umformulieren.
const bewertungen = [
  {
    name: 'Laura Pyschny',
    text: 'Top! Wir haben … unsere Traumfliese gefunden und nach anschließender 3D-Visualisierung auch direkt unser Traumbad kreiert. Immer wieder gerne!',
  },
  {
    name: 'Tim Hofstede',
    text: 'Ich bin total zufrieden mit der Planung und Ausführung durch die Firma StoneTec!',
  },
  {
    name: 'Jack Ha',
    text: 'Super freundliche und kompetente Beratung … Wir freuen uns schon riesig auf unsere neuen Bäder!',
  },
]

function Sterne() {
  return (
    <span className="text-warm-stein" aria-label="5 von 5 Sternen">
      {'★★★★★'}
    </span>
  )
}

export default function KundenStimmen() {
  return (
    <div>
      <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
        Kundenstimmen
      </p>
      <h2 className="font-sora font-extralight text-[clamp(1.9rem,3.2vw,2.8rem)] text-warm-text tracking-[-0.02em] leading-[1.05] mb-4">
        5,0 von 5 Sternen bei Google.
      </h2>
      <p className="font-dm text-[0.95rem] text-warm-mittel mb-10">
        <Sterne /> <span className="ml-1">31 Google-Rezensionen</span>
      </p>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bewertungen.map((bewertung) => (
          <li key={bewertung.name} className="rounded-2xl border border-warm-anthrazit/10 bg-white/60 p-7">
            <p className="mb-4 text-[0.85rem]"><Sterne /></p>
            <blockquote className="font-dm text-[0.95rem] text-warm-text leading-relaxed mb-5">
              „{bewertung.text}"
            </blockquote>
            <footer className="font-dm text-[0.8rem] text-warm-mittel">
              {bewertung.name} · Google-Rezension
            </footer>
          </li>
        ))}
      </ul>
    </div>
  )
}
