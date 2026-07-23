import { Link } from 'react-router-dom'

// Visueller Beweis für Ad-Besucher: echte Bäder aus echten Projekten.
// Bilder kommen aus der Slug-Konfiguration der Landingpage.
export default function ProjektGalerie({ items }) {
  return (
    <div>
      <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
        Referenzen
      </p>
      <h2 className="font-sora font-extralight text-[clamp(1.9rem,3.2vw,2.8rem)] text-warm-text tracking-[-0.02em] leading-[1.05] mb-4">
        Echte Bäder. Echte Projekte.
      </h2>
      <p className="font-dm text-[0.95rem] text-warm-mittel max-w-2xl leading-relaxed mb-10">
        Kein Stockfoto, kein Rendering — jedes dieser Bäder haben unsere Meister geplant und umgesetzt.
      </p>

      <ul className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {items.map((item) => (
          <li key={item.src} className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-warm-anthrazit/10">
            <img
              src={item.src}
              alt={`${item.title} — Badsanierung von stonetec`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#060606cc] to-transparent px-4 pb-3 pt-10 font-dm text-[0.8rem] text-inv-light">
              {item.title}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Link
          to="/projekte"
          className="inline-flex items-center gap-2 font-dm text-[0.82rem] font-semibold tracking-wider uppercase text-warm-text hover:text-warm-anthrazit transition-colors"
        >
          Alle Projekte ansehen
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
