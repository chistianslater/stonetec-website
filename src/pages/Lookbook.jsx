import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

/* ─── Reveal Component ─────────────────────────────────────────── */
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

/* ─── Lookbook Data ──────────────────────────────────────────── */
const lookbookSections = [
  {
    "id": "badezimmer",
    "title": "Badezimmer",
    "subtitle": "Räume der Ruhe",
    "description": "Von der fugenlosen Dusche bis zum monolithischen Waschtisch. Wir verwandeln Badezimmer in private Wellness-Oasen.",
    "dir": "badezimmer",
    "images": [
      {
        "src": "/images/lookbook/badezimmer/stonetec-lookbook-badezimmer-1.jpg",
        "caption": "Badezimmer Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/badezimmer/stonetec-lookbook-badezimmer-2.jpg",
        "caption": "Badezimmer Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/badezimmer/stonetec-lookbook-badezimmer-3.jpg",
        "caption": "Badezimmer Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/badezimmer/stonetec-lookbook-badezimmer-4.jpg",
        "caption": "Badezimmer Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/badezimmer/stonetec-lookbook-badezimmer-5.jpg",
        "caption": "Badezimmer Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/badezimmer/stonetec-lookbook-badezimmer-6.jpg",
        "caption": "Badezimmer Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/badezimmer/stonetec-lookbook-badezimmer-7.jpg",
        "caption": "Badezimmer Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/badezimmer/stonetec-lookbook-badezimmer-8.jpg",
        "caption": "Badezimmer Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/badezimmer/stonetec-lookbook-badezimmer-9.jpg",
        "caption": "Badezimmer Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/badezimmer/stonetec-lookbook-badezimmer-10.jpg",
        "caption": "Badezimmer Inspiration",
        "specs": "Meisterhafte Verlegung"
      }
    ]
  },
  {
    "id": "wohnraum",
    "title": "Wohnraum & Boden",
    "subtitle": "Weite und Beständigkeit",
    "description": "Großformatige Bodenbeläge schaffen eine durchgängige Optik und ein großzügiges Raumgefühl in jedem Wohnbereich.",
    "dir": "wohnraum",
    "images": [
      {
        "src": "/images/lookbook/wohnraum/stonetec-lookbook-wohnraum-1.jpg",
        "caption": "Wohnraum & Boden Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/wohnraum/stonetec-lookbook-wohnraum-2.jpg",
        "caption": "Wohnraum & Boden Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/wohnraum/stonetec-lookbook-wohnraum-3.jpg",
        "caption": "Wohnraum & Boden Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/wohnraum/stonetec-lookbook-wohnraum-4.jpg",
        "caption": "Wohnraum & Boden Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/wohnraum/stonetec-lookbook-wohnraum-5.jpg",
        "caption": "Wohnraum & Boden Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/wohnraum/stonetec-lookbook-wohnraum-6.jpg",
        "caption": "Wohnraum & Boden Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/wohnraum/stonetec-lookbook-wohnraum-7.jpg",
        "caption": "Wohnraum & Boden Inspiration",
        "specs": "Meisterhafte Verlegung"
      }
    ]
  },
  {
    "id": "terrasse",
    "title": "Terrasse & Pool",
    "subtitle": "Sommerliche Eleganz",
    "description": "Keramik im Außenbereich verbindet Ästhetik mit extremer Beständigkeit gegen Witterung und Frost.",
    "dir": "terrasse",
    "images": [
      {
        "src": "/images/lookbook/terrasse/stonetec-lookbook-terrasse-1.jpg",
        "caption": "Terrasse & Pool Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/terrasse/stonetec-lookbook-terrasse-2.jpg",
        "caption": "Terrasse & Pool Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/terrasse/stonetec-lookbook-terrasse-3.jpg",
        "caption": "Terrasse & Pool Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/terrasse/stonetec-lookbook-terrasse-4.jpg",
        "caption": "Terrasse & Pool Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/terrasse/stonetec-lookbook-terrasse-5.jpg",
        "caption": "Terrasse & Pool Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/terrasse/stonetec-lookbook-terrasse-6.jpg",
        "caption": "Terrasse & Pool Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/terrasse/stonetec-lookbook-terrasse-7.jpg",
        "caption": "Terrasse & Pool Inspiration",
        "specs": "Meisterhafte Verlegung"
      }
    ]
  },
  {
    "id": "manufaktur",
    "title": "Keramikmanufaktur",
    "subtitle": "Unikate aus Meisterhand",
    "description": "In unserer eigenen Manufaktur fertigen wir Waschtische, Treppenstufen und Sonderlösungen aus Keramik — passgenau für Ihr Projekt.",
    "dir": "manufaktur",
    "images": [
      {
        "src": "/images/lookbook/manufaktur/stonetec-lookbook-manufaktur-1.jpg",
        "caption": "Keramikmanufaktur Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/manufaktur/stonetec-lookbook-manufaktur-2.jpg",
        "caption": "Keramikmanufaktur Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/manufaktur/stonetec-lookbook-manufaktur-3.jpg",
        "caption": "Keramikmanufaktur Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/manufaktur/stonetec-lookbook-manufaktur-4.jpg",
        "caption": "Keramikmanufaktur Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/manufaktur/stonetec-lookbook-manufaktur-5.jpg",
        "caption": "Keramikmanufaktur Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/manufaktur/stonetec-lookbook-manufaktur-6.jpg",
        "caption": "Keramikmanufaktur Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/manufaktur/stonetec-lookbook-manufaktur-7.jpg",
        "caption": "Keramikmanufaktur Inspiration",
        "specs": "Meisterhafte Verlegung"
      }
    ]
  },
  {
    "id": "details",
    "title": "Details & Handwerk",
    "subtitle": "Präzision im Fokus",
    "description": "Wahre Meisterschaft zeigt sich im Detail. Wir legen Wert auf perfekte Kanten, saubere Fugen und eine durchdachte Planung.",
    "dir": "details",
    "images": [
      {
        "src": "/images/lookbook/details/stonetec-lookbook-details-1.jpg",
        "caption": "Details & Handwerk Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/details/stonetec-lookbook-details-2.jpg",
        "caption": "Details & Handwerk Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/details/stonetec-lookbook-details-3.jpg",
        "caption": "Details & Handwerk Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/details/stonetec-lookbook-details-4.jpg",
        "caption": "Details & Handwerk Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/details/stonetec-lookbook-details-5.jpg",
        "caption": "Details & Handwerk Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/details/stonetec-lookbook-details-6.jpg",
        "caption": "Details & Handwerk Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/details/stonetec-lookbook-details-7.jpg",
        "caption": "Details & Handwerk Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/details/stonetec-lookbook-details-8.jpg",
        "caption": "Details & Handwerk Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/details/stonetec-lookbook-details-9.jpg",
        "caption": "Details & Handwerk Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/details/stonetec-lookbook-details-10.jpg",
        "caption": "Details & Handwerk Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/details/stonetec-lookbook-details-11.jpg",
        "caption": "Details & Handwerk Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/details/stonetec-lookbook-details-12.jpg",
        "caption": "Details & Handwerk Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/details/stonetec-lookbook-details-13.jpg",
        "caption": "Details & Handwerk Inspiration",
        "specs": "Meisterhafte Verlegung"
      },
      {
        "src": "/images/lookbook/details/stonetec-lookbook-details-14.jpg",
        "caption": "Details & Handwerk Inspiration",
        "specs": "Meisterhafte Verlegung"
      }
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
    <div className="bg-warm-bg min-h-screen pt-48 pb-24">
      <SEO 
        title="Lookbook — Inspiration für Ihr Zuhause"
        description="Lassen Sie sich von unseren Referenzen inspirieren. Badezimmer, Wohnräume und maßgefertigte Keramik-Unikate in höchster Qualität."
      />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="col-span-1 md:col-span-2 lg:col-span-1 mb-8 lg:mb-0">
                <h2 className="font-sora font-extralight text-4xl text-warm-text mb-4">{currentSection.subtitle}</h2>
                <p className="font-dm text-warm-mittel leading-relaxed max-w-md">
                  {currentSection.description}
                </p>
              </div>
              {currentSection.images.map((img, i) => (
                <ImageCard key={img.src} image={img} index={i} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA Section */}
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
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-warm-stein/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-warm-mittel/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        </div>
      </div>
    </div>
  )
}
