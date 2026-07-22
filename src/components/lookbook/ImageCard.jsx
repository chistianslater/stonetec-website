// eslint-disable-next-line no-unused-vars -- `motion` wird als `motion.div` im JSX genutzt
import { motion } from 'framer-motion'

function HerzIcon({ filled }) {
  return (
    <svg
      className="w-5 h-5"
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

export default function ImageCard({ image, index, categoryLabel, isPicked, onTogglePick, onOpen }) {
  const caption = image.caption?.trim() ? image.caption : categoryLabel

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: Math.min(index, 8) * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="group relative">
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${caption} vergrößern`}
          className="block w-full cursor-pointer text-left"
        >
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-sm">
            <img
              src={image.src}
              alt={caption}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06060680] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <p className="font-dm text-[0.65rem] text-inv-muted uppercase tracking-[2px] mb-1">{categoryLabel}</p>
              <h4 className="font-sora font-light text-sm text-inv-light">{caption}</h4>
            </div>
          </div>
        </button>

        {/* Auf Touch-Geräten dauerhaft sichtbar, am Desktop beim Überfahren —
            und immer sichtbar, sobald das Bild gemerkt ist.
            focus-visible:opacity-100 ist nicht optional: ohne das bliebe der
            Knopf für Tastaturnutzer fokussierbar, aber unsichtbar. */}
        <button
          type="button"
          onClick={onTogglePick}
          aria-pressed={isPicked}
          aria-label={isPicked ? `${caption} aus der Auswahl entfernen` : `${caption} zur Auswahl hinzufügen`}
          className={`absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full backdrop-blur-sm transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-stein ${
            isPicked
              ? 'bg-warm-bg text-warm-text opacity-100'
              : 'bg-black/30 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 hover:bg-black/50'
          }`}
        >
          <HerzIcon filled={isPicked} />
        </button>
      </div>
    </motion.div>
  )
}
