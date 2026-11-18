// Angebots- und Vertrauensblock für den Landingpage-Hero (above the fold).
// Optional pro Landingpage über `heroOffer` / `trustPoints` gesteuert.

export function HeroOffer({ offer }) {
  if (!offer) return null
  return (
    <div className="mt-8 max-w-2xl border-l-2 border-warm-stein bg-black/35 backdrop-blur-sm px-5 py-4 md:px-6 md:py-5">
      <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-stein mb-3">
        {offer.label}
      </p>
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 font-dm text-[0.95rem] text-inv-light mb-2">
        {offer.steps.map((step, i) => (
          <li key={step} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden="true" className="text-inv-muted">→</span>}
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p className="font-dm text-[0.95rem] text-inv-muted leading-relaxed">{offer.text}</p>
    </div>
  )
}

export function TrustPoints({ items }) {
  if (!items?.length) return null
  return (
    <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 max-w-2xl">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 font-dm text-[0.85rem] text-inv-light/90">
          <span aria-hidden="true" className="mt-[0.45em] w-1.5 h-1.5 shrink-0 rounded-full bg-warm-stein" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
