import { useMemo, useState } from 'react'
// eslint-disable-next-line no-unused-vars -- `motion` wird als `motion.div` im JSX genutzt
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useMerkzettel } from '../../hooks/useMerkzettel.js'
import { MAX_PICKS } from '../../lib/merkzettel.js'
import { buildShareUrl, buildWhatsappUrl, buildMailtoUrl, shareText } from '../../lib/merkzettelShare.js'
import { trackEvent } from '../../lib/track.js'

const SHARE_TITLE = 'Meine Auswahl aus dem stonetec-Lookbook'

export default function MerkzettelBar({ sections }) {
  const merkzettel = useMerkzettel()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [copyState, setCopyState] = useState('idle') // idle | copied | failed

  // Gemerkte IDs zu vollständigen Bilddaten auflösen, in der Reihenfolge des
  // Merkens. Bilder, die es nicht mehr gibt, fallen still heraus.
  const picked = useMemo(() => {
    const byId = new Map()
    for (const section of sections) {
      for (const image of section.images) {
        byId.set(image.id, { ...image, categoryLabel: section.title })
      }
    }
    return merkzettel.ids.map((id) => byId.get(id)).filter(Boolean)
  }, [sections, merkzettel.ids])

  const count = merkzettel.count
  if (count === 0) return null

  const shareUrl = buildShareUrl(
    typeof window !== 'undefined' ? `${window.location.origin}/lookbook` : '/lookbook',
    merkzettel.ids,
  )
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: SHARE_TITLE, text: shareText(count), url: shareUrl })
      trackEvent('share', { method: 'native', item_count: count })
    } catch {
      // Der Nutzer hat das Teilen-Menü abgebrochen — kein Fehlerfall.
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopyState('copied')
      trackEvent('share', { method: 'copy', item_count: count })
    } catch {
      // Ohne Clipboard-Erlaubnis bekommt der Nutzer den Link zum Markieren.
      setCopyState('failed')
    }
  }

  const handleRequest = () => {
    trackEvent('select_content', { content_type: 'merkzettel_anfrage', item_count: count })
    setIsOpen(false)
    navigate('/kontakt')
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[90] pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 pb-4 md:px-12 md:pb-6 flex justify-center">
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            className="pointer-events-auto inline-flex items-center gap-3 rounded-full bg-dark-bg px-7 py-4 font-dm text-[0.78rem] uppercase tracking-[2px] text-inv-light shadow-lg transition-colors duration-300 hover:bg-warm-anthrazit"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            Meine Auswahl ({count})
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[95] bg-black/40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              role="dialog"
              aria-label="Meine Auswahl"
              className="fixed bottom-0 left-0 right-0 z-[96] max-h-[85vh] overflow-y-auto rounded-t-3xl bg-warm-bg p-6 shadow-2xl md:p-10"
            >
              <div className="mx-auto max-w-3xl">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-sora text-2xl font-extralight text-warm-text">Meine Auswahl</h2>
                    <p className="mt-1 font-dm text-[0.85rem] text-warm-mittel">
                      {count === 1 ? '1 Bild gemerkt' : `${count} Bilder gemerkt`}
                      {count >= MAX_PICKS && ' — deine Auswahl ist voll'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Schließen"
                    className="text-warm-mittel transition-colors hover:text-warm-text"
                  >
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <ul className="mb-8 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                  {picked.map((image) => (
                    <li key={image.id} className="relative">
                      <img
                        src={image.src}
                        alt={image.caption?.trim() ? image.caption : image.categoryLabel}
                        loading="lazy"
                        className="aspect-square w-full rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => merkzettel.remove(image.id)}
                        aria-label="Aus der Auswahl entfernen"
                        className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-dark-bg text-inv-light transition-colors hover:bg-warm-anthrazit"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleRequest}
                    className="flex-1 bg-dark-bg px-8 py-4 font-dm text-[0.8rem] font-semibold uppercase tracking-wider text-inv-light transition-colors hover:bg-warm-anthrazit"
                  >
                    Auswahl anfragen
                  </button>

                  {canNativeShare ? (
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="flex-1 border border-warm-anthrazit/30 px-8 py-4 font-dm text-[0.8rem] font-semibold uppercase tracking-wider text-warm-text transition-colors hover:border-warm-anthrazit"
                    >
                      Auswahl teilen
                    </button>
                  ) : (
                    <div className="flex flex-1 gap-3">
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="flex-1 border border-warm-anthrazit/30 px-6 py-4 font-dm text-[0.8rem] font-semibold uppercase tracking-wider text-warm-text transition-colors hover:border-warm-anthrazit"
                      >
                        {copyState === 'copied' ? 'Link kopiert' : 'Link kopieren'}
                      </button>
                      <a
                        href={buildWhatsappUrl(shareUrl, count)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent('share', { method: 'whatsapp', item_count: count })}
                        className="grid place-items-center border border-warm-anthrazit/30 px-5 font-dm text-[0.8rem] uppercase tracking-wider text-warm-text transition-colors hover:border-warm-anthrazit"
                      >
                        WhatsApp
                      </a>
                      <a
                        href={buildMailtoUrl(shareUrl, count)}
                        onClick={() => trackEvent('share', { method: 'email', item_count: count })}
                        className="grid place-items-center border border-warm-anthrazit/30 px-5 font-dm text-[0.8rem] uppercase tracking-wider text-warm-text transition-colors hover:border-warm-anthrazit"
                      >
                        E-Mail
                      </a>
                    </div>
                  )}
                </div>

                {copyState === 'failed' && (
                  <label className="mt-4 block font-dm text-[0.8rem] text-warm-mittel">
                    Kopieren wurde vom Browser blockiert — hier ist der Link zum Markieren:
                    <input
                      readOnly
                      value={shareUrl}
                      onFocus={(e) => e.target.select()}
                      className="mt-2 w-full rounded-lg border border-warm-anthrazit/20 bg-white px-3 py-2 font-dm text-[0.8rem] text-warm-text"
                    />
                  </label>
                )}

                <button
                  type="button"
                  onClick={() => merkzettel.clear()}
                  className="mt-6 font-dm text-[0.8rem] text-warm-mittel underline underline-offset-4 transition-colors hover:text-warm-text"
                >
                  Alle entfernen
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
