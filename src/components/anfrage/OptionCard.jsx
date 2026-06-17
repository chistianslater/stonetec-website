export default function OptionCard({ label, hint, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group w-full text-left rounded-xl border p-5 transition-all duration-200
        ${selected
          ? 'border-inv-light/60 bg-inv-light/10'
          : 'border-inv-light/15 bg-inv-light/[0.03] hover:border-inv-light/35 hover:bg-inv-light/[0.06]'}`}
    >
      <span className="block font-sora font-light text-[1.05rem] text-inv-light tracking-[-0.01em]">{label}</span>
      {hint && <span className="mt-1 block font-dm text-[0.8rem] text-inv-muted">{hint}</span>}
    </button>
  )
}
