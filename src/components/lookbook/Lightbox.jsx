import { useEffect } from 'react'
// eslint-disable-next-line no-unused-vars -- `motion` wird als `motion.div` im JSX genutzt
import { motion } from 'framer-motion'

function HerzIcon({ filled }) {
  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  )
}

export default function Lightbox({ image, categoryLabel, isPicked, onTogglePick, onClose, onNext, onPrev }) {
  // Tastatursteuerung: Escape schließt, Pfeile blättern.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowRight') onNext()
      else if (event.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, onNext, onPrev])

  if (!image) return null

  const caption = image.caption?.trim() ? image.caption : categoryLabel

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={caption}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-12"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Schließen"
        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110]"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        aria-label="Vorheriges Bild"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-[110] p-4"
      >
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext() }}
        aria-label="Nächstes Bild"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-[110] p-4"
      >
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.src}
          alt={caption}
          className="max-w-full max-h-[78vh] object-contain shadow-2xl rounded-lg"
        />
        <div className="mt-8 text-center">
          <p className="font-dm text-[0.7rem] text-white/40 uppercase tracking-[3px] mb-2">{categoryLabel}</p>
          <h3 className="font-sora font-extralight text-xl md:text-2xl text-white mb-6">{caption}</h3>

          <button
            type="button"
            onClick={onTogglePick}
            aria-pressed={isPicked}
            className={`inline-flex items-center gap-3 rounded-full px-8 py-4 font-dm text-[0.72rem] uppercase tracking-[2px] transition-all duration-300 ${
              isPicked
                ? 'bg-warm-bg text-warm-text hover:bg-white'
                : 'border border-white/25 text-white hover:border-white/60'
            }`}
          >
            <HerzIcon filled={isPicked} />
            {isPicked ? 'Gemerkt' : 'Merken'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
