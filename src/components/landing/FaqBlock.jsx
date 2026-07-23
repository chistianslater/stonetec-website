// Einwandbehandlung für Ad-Besucher — native <details> für Semantik und
// Tastaturbedienung, kein JS-State nötig.
export default function FaqBlock({ items }) {
  return (
    <div>
      <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
        Häufige Fragen
      </p>
      <h2 className="font-sora font-extralight text-[clamp(1.9rem,3.2vw,2.8rem)] text-warm-text tracking-[-0.02em] leading-[1.05] mb-10">
        Was du vorher wissen willst.
      </h2>

      <div className="divide-y divide-warm-anthrazit/10 border-y border-warm-anthrazit/10">
        {items.map((item) => (
          <details key={item.frage} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-dm text-[1rem] font-medium text-warm-text [&::-webkit-details-marker]:hidden">
              {item.frage}
              <svg
                className="w-5 h-5 shrink-0 text-warm-mittel transition-transform duration-300 group-open:rotate-45"
                fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </summary>
            <p className="pt-4 font-dm text-[0.95rem] text-warm-mittel leading-relaxed max-w-3xl">
              {item.antwort}
            </p>
          </details>
        ))}
      </div>
    </div>
  )
}
