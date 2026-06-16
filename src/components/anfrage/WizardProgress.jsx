export default function WizardProgress({ current, total }) {
  const pct = Math.round(((current + 1) / total) * 100)
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between font-dm text-[0.7rem] uppercase tracking-[2px] text-inv-tagline">
        <span>Schritt {current + 1} von {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-inv-light/10">
        <div className="h-full rounded-full bg-inv-light transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
