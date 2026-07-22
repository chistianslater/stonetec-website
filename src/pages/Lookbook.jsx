import { useCallback, useEffect, useMemo, useState } from 'react'
// eslint-disable-next-line no-unused-vars -- `motion` wird als `motion.div` im JSX genutzt
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import ImageCard from '../components/lookbook/ImageCard.jsx'
import Lightbox from '../components/lookbook/Lightbox.jsx'
import { loadLookbook, fallbackSections } from '../lib/lookbookData.js'
import { useMerkzettel } from '../hooks/useMerkzettel.js'
import { trackEvent } from '../lib/track.js'

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Lookbook() {
  // Die Bestandsdaten stehen sofort — die Seite ist zu keiner Sekunde leer.
  // Das Manifest vom Server ersetzt sie, sobald es eingetroffen ist.
  const [sections, setSections] = useState(() => fallbackSections())
  const [activeSection, setActiveSection] = useState('badezimmer')
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const merkzettel = useMerkzettel()

  useEffect(() => {
    let cancelled = false
    loadLookbook().then((next) => {
      if (!cancelled) setSections(next)
    })
    return () => { cancelled = true }
  }, [])

  const currentSection = useMemo(
    () => sections.find((s) => s.id === activeSection) ?? sections[0],
    [sections, activeSection],
  )
  const images = currentSection?.images ?? []

  const handleTogglePick = useCallback((image) => {
    const nowPicked = merkzettel.toggle(image.id)
    trackEvent(nowPicked ? 'add_to_wishlist' : 'remove_from_wishlist', {
      item_id: image.id,
      item_category: activeSection,
    })
  }, [merkzettel, activeSection])

  const handleNext = useCallback(() => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const handlePrev = useCallback(() => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  // Wechselt der Datenstand, während die Großansicht offen ist, kann der Index
  // ins Leere zeigen. Das wird hier abgeleitet statt per Effekt nachgezogen:
  // ein synchrones setState im Effekt löst eine zweite Renderrunde aus.
  const selectedImage = selectedImageIndex !== null ? (images[selectedImageIndex] ?? null) : null

  return (
    <div className="bg-warm-bg min-h-screen pt-48 pb-24">
      <SEO
        title="Lookbook — Inspiration für dein Zuhause"
        description="Lass dich von unseren Referenzen inspirieren. Badezimmer, Wohnräume und maßgefertigte Keramik-Unikate in höchster Qualität."
      />

      <AnimatePresence>
        {selectedImage && (
          <Lightbox
            image={selectedImage}
            categoryLabel={currentSection.title}
            isPicked={merkzettel.has(selectedImage.id)}
            onTogglePick={() => handleTogglePick(selectedImage)}
            onClose={() => setSelectedImageIndex(null)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-16">
        <Reveal>
          <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
            Inspiration
          </p>
          <h1 className="font-sora font-extralight text-[clamp(3rem,7vw,5.5rem)] text-warm-text leading-[1] tracking-[-0.03em] max-w-4xl mb-8">
            Unser Lookbook.
          </h1>
          <p className="font-dm text-[1.1rem] text-warm-mittel max-w-2xl leading-relaxed">
            Materialien, Ideen, Details. Entdecke die Möglichkeiten moderner Keramik und lass dich von unseren Realisierungen inspirieren.
            Was dir gefällt, kannst du mit dem Herz merken und uns mit deiner Anfrage schicken.
          </p>
        </Reveal>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-16">
        <div className="flex flex-wrap gap-3 md:gap-4 border-b border-warm-anthrazit/10 pb-8">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => { setActiveSection(section.id); setSelectedImageIndex(null) }}
              className={`px-6 py-3 font-dm text-[0.82rem] font-semibold tracking-wider uppercase transition-all duration-500 relative ${
                activeSection === section.id ? 'text-warm-text' : 'text-warm-mittel hover:text-warm-text'
              }`}
            >
              {section.title}
              {activeSection === section.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-warm-stein"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Aktive Kategorie */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="col-span-1 md:col-span-2 lg:col-span-1 mb-8 lg:mb-0">
                <h2 className="font-sora font-extralight text-4xl text-warm-text mb-4">{currentSection.subtitle}</h2>
                <p className="font-dm text-warm-mittel leading-relaxed max-w-md">
                  {currentSection.description}
                </p>
              </div>
              {images.map((img, i) => (
                <ImageCard
                  key={img.id}
                  image={img}
                  index={i}
                  categoryLabel={currentSection.title}
                  isPicked={merkzettel.has(img.id)}
                  onTogglePick={() => handleTogglePick(img)}
                  onOpen={() => setSelectedImageIndex(i)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-32 mt-24">
        <div className="bg-dark-bg rounded-3xl p-12 md:p-24 text-center noise relative overflow-hidden">
          <Reveal>
            <h2 className="font-sora font-extralight text-[clamp(2rem,5vw,3.5rem)] text-inv-light leading-tight tracking-[-0.02em] mb-12 relative z-10">
              Vom Lookbook zur Realität.<br />Lass uns planen.
            </h2>
            <Link
              to="/kontakt"
              className="inline-block bg-inv-light text-dark-bg font-dm text-[0.7rem] uppercase tracking-[3px] px-12 py-6 rounded-full hover:bg-warm-mittel hover:text-inv-light transition-all duration-500 relative z-10"
            >
              Beratungstermin vereinbaren
            </Link>
          </Reveal>

          <div className="absolute top-0 right-0 w-64 h-64 bg-warm-stein/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-warm-mittel/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        </div>
      </div>
    </div>
  )
}
