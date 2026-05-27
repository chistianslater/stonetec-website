import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Reveal Component ───────────────────────────────────────── */
function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Lookbook Data ──────────────────────────────────────────── */
const lookbookSections = [
  {
    id: 'badezimmer',
    title: 'Badezimmer',
    subtitle: 'Räume der Ruhe',
    description: 'Von der fugenlosen Dusche bis zum monolithischen Waschtisch. Wir verwandeln Badezimmer in private Wellness-Oasen.',
    images: [
      { src: '/images/Sonstiges/IMG_0655-web.webp', caption: 'Großformatige Wandverkleidung', specs: '160×320 cm · Marmoroptik' },
      { src: '/images/Sonstiges/IMG_0657-web.webp', caption: 'Fugenlose Duschgestaltung', specs: 'Präzisionsverlegung' },
      { src: '/images/Sonstiges/IMG_0659-web.webp', caption: 'Modernes Badkonzept', specs: 'Minimalistisches Design' },
      { src: '/images/Sonstiges/IMG_0714-web.webp', caption: 'Detailverliebte Planung', specs: 'Harmonische Materialwahl' },
      { src: '/images/Sonstiges/IMG_0715-web.webp', caption: 'Licht & Keramik', specs: 'Indirekte Beleuchtung' },
      { src: '/images/Sonstiges/IMG_0485-web.webp', caption: 'Edle Oberflächen', specs: 'Haptik die begeistert' }
    ]
  },
  {
    id: 'wohnraum',
    title: 'Wohnraum & Boden',
    subtitle: 'Weite und Beständigkeit',
    description: 'Großformatige Bodenbeläge schaffen eine durchgängige Optik und ein großzügiges Raumgefühl in jedem Wohnbereich.',
    images: [
      { src: '/images/Sonstiges/IMG_0450-2-web.webp', caption: 'Großzügiger Wohnbereich', specs: 'Durchgängige Verlegung' },
      { src: '/images/Sonstiges/IMG_0581-web.webp', caption: 'Naturstein-Optik', specs: 'Zeitlose Eleganz' },
      { src: '/images/Sonstiges/IMG_0594-web.webp', caption: 'Fließende Übergänge', specs: 'Minimale Fugen' },
      { src: '/images/Sonstiges/IMG_0605-web.webp', caption: 'Moderne Architektur', specs: 'Beton-Look' },
      { src: '/images/Sonstiges/IMG_0816-web.webp', caption: 'Wärme & Struktur', specs: 'Feinsteinzeug' }
    ]
  },
  {
    id: 'manufaktur',
    title: 'Keramikmanufaktur',
    subtitle: 'Unikate aus Meisterhand',
    description: 'In unserer eigenen Manufaktur fertigen wir Waschtische, Treppenstufen und Sonderlösungen aus Keramik — passgenau für Ihr Projekt.',
    images: [
      { src: '/images/Keramik-Manufaktur/IMG_5118-web.webp', caption: 'Maßgefertigter Waschtisch', specs: 'SLAB-Verarbeitung' },
      { src: '/images/Keramik-Manufaktur/IMG_5120-web.webp', caption: 'Präziser Gehrungsschnitt', specs: 'Handwerkliche Perfektion' },
      { src: '/images/Keramik-Manufaktur/IMG_5125-web.webp', caption: 'Sonderanfertigung', specs: 'Individuelle Lösung' },
      { src: '/images/Keramik-Manufaktur/IMG_5130-web.webp', caption: 'Materialprüfung', specs: 'Qualitätssicherung' },
      { src: '/images/Keramik-Manufaktur/IMG_5145-web.webp', caption: 'Fertigungsprozess', specs: 'Eigene Werkstatt' }
    ]
  },
  {
    id: 'details',
    title: 'Details & Handwerk',
    subtitle: 'Präzision im Fokus',
    description: 'Wahre Meisterschaft zeigt sich im Detail. Wir legen Wert auf perfekte Kanten, saubere Fugen und eine durchdachte Planung.',
    images: [
      { src: '/images/Sonstiges/Matthias @Work-web.webp', caption: 'Meister am Werk', specs: 'Präzisionsverlegung' },
      { src: '/images/Sonstiges/IMG_0948-web.webp', caption: '3D-Planung', specs: 'Digitale Präzision' },
      { src: '/images/Sonstiges/Beratung und Konzeptentwicklung-web.webp', caption: 'Materialcollage', specs: 'Konzeptentwicklung' },
      { src: '/images/Sonstiges/IMG_0782-web.webp', caption: 'Perfekte Kanten', specs: 'Gehrungstechnik' },
      { src: '/images/Sonstiges/IMG_0824-web.webp', caption: 'Fugenbild', specs: 'Symmetrie & Ruhe' }
    ]
  }
]

/* ─── Image Card Component ───────────────────────────────────── */
function ImageCard({ image, index }) {
  return (
    <Reveal delay={index * 0.05}>
      <div className="group cursor-pointer">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-sm">
          <img
            src={image.src}
            alt={image.caption}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06060680] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <p className="font-dm text-[0.65rem] text-inv-muted uppercase tracking-[2px] mb-1">{image.specs}</p>
            <h4 className="font-sora font-light text-sm text-inv-light">{image.caption}</h4>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function Lookbook() {
  const [activeSection, setActiveSection] = useState('badezimmer')
  const currentSection = lookbookSections.find(s => s.id === activeSection)

  return (
    <div className="bg-warm-bg min-h-screen pt-32 pb-24">
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
            Materialien, Ideen, Details. Entdecken Sie die Möglichkeiten moderner Keramik und lassen Sie sich von unseren Realisierungen inspirieren.
          </p>
        </Reveal>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-16">
        <div className="flex flex-wrap gap-3 md:gap-4 border-b border-warm-anthrazit/10 pb-8">
          {lookbookSections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-6 py-3 font-dm text-[0.82rem] font-semibold tracking-wider uppercase transition-all duration-500 relative ${
                activeSection === section.id 
                  ? 'text-warm-text' 
                  : 'text-warm-mittel hover:text-warm-text'
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

      {/* Active Section Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-16 max-w-2xl">
              <h2 className="font-sora font-light text-2xl md:text-3xl text-warm-text tracking-tight mb-4">
                {currentSection.subtitle}
              </h2>
              <p className="font-dm text-[1rem] text-warm-mittel leading-relaxed">
                {currentSection.description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {currentSection.images.map((image, index) => (
                <ImageCard key={image.src} image={image} index={index} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Experience CTA */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-32">
        <Reveal>
          <div className="bg-dark-bg rounded-[2rem] p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            
            <div className="relative z-10 max-w-xl">
              <h3 className="font-sora font-extralight text-3xl md:text-4xl text-inv-light tracking-tight mb-6">
                Materialien hautnah erleben.
              </h3>
              <p className="font-dm text-[1rem] text-inv-muted leading-relaxed mb-8">
                Kein Bildschirm kann die Haptik und Wirkung echter Keramik ersetzen. Besuchen Sie unseren Showroom in Bocholt und finden Sie Ihr Material.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/kontakt"
                  className="px-8 py-4 bg-warm-bg text-warm-text font-dm text-[0.82rem] font-semibold tracking-wider uppercase hover:bg-white transition-all duration-500 rounded-none"
                >
                  Termin vereinbaren
                </a>
              </div>
            </div>
            
            <div className="relative z-10 w-full lg:w-1/3 aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
              <img src="/images/website-extract/Showroom.jpg" alt="StoneTec Showroom" className="w-full h-full object-cover" />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
