export default function Chip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border px-4 py-2 font-dm text-[0.85rem] transition-all duration-200
        ${selected
          ? 'border-inv-light/60 bg-inv-light text-warm-text'
          : 'border-inv-light/20 text-inv-light hover:border-inv-light/40'}`}
    >
      {label}
    </button>
  )
}
