import { useEffect, useRef, useState } from 'react'

function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

const lookbookSections = [
  {
    id: 'materials',
    title: 'Materialien',
    subtitle: 'Texturen, die überzeugen',
    description: 'Vom Naturstein bis zum hochtechnologischen SLAB — wir arbeiten ausschließlich mit Materialien, die unseren Ansprüchen entsprechen.',
    images: [
      { src: '/images/material-1.jpg', caption: 'Marmoroptik Feinsteinzeug', specs: '120×280 cm · Glänzend' },
      { src: '/images/material-2.jpg', caption: 'Betonoptik Keramik', specs: '160×320 cm · Matt' },
      { src: '/images/material-3.jpg', caption: 'Holzoptik Feinsteinzeug', specs: '30×180 cm · Strukturiert' },
      { src: '/images/material-4.jpg', caption: 'Naturstein Travertin', specs: '60×120 cm · Gebürstet' },
    ]
  },
  {
    id: 'großformate',
    title: 'Großformate',
    subtitle: 'Weite schaffen',
    description: 'Keramikplatten bis 160×320 cm ermöglichen nahezu fugenlose Flächen mit maximalem Wirkungsgrad.',
    images: [
      { src: '/images/grossformat-1.jpg', caption: 'Badezimmer Großformat', specs: '160×320 cm · Wand & Boden' },
      { src: '/images/grossformat-2.jpg', caption: 'Wohnbereich', specs: '120×280 cm · Fliesenboden' },
      { src: '/images/grossformat-3.jpg', caption: 'Dusche fugenlos', specs: '160×320 cm · Wandverkleidung' },
    ]
  },
  {
    id: 'manufaktur',
    title: 'Manufaktur',
    subtitle: 'Maßgefertigte Lösungen',
    description: 'Was es von der Stange nicht gibt, fertigen wir selbst. Waschtische, Nischen, Sonderanfertigungen.',
    images: [
      { src: '/images/manufaktur-1.jpg', caption: 'Maßgefertigter Waschtisch', specs: 'SLAB-Keramik · Gehrungsschnitt' },
      { src: '/images/manufaktur-2.jpg', caption: 'Nischenlösung', specs: 'Passgenau gefertigt' },
      { src: '/images/manufaktur-3.jpg', caption: 'Duschwanne integriert', specs: 'Ebenerdig · Fugenlos' },
      { src: '/images/manufaktur-4.jpg', caption: 'Treppenstufen', specs: 'Großformat · Präzision' },
    ]
  },
  {
    id: 'details',
    title: 'Details',
    subtitle: 'Präzision, die man spürt',
    description: 'Der Gehrungsschnitt, den man nicht sieht. Die Fuge, die perfekt sitzt. Details, die den Unterschied machen.',
    images: [
      { src: '/images/detail-1.jpg', caption: 'Perfekte Gehrung', specs: '45° Schnitt · Nahtlos' },
      { src: '/images/detail-2.jpg', caption: 'Fugenführung', specs: 'Minimal · Präzise' },
      { src: '/images/detail-3.jpg', caption: 'Übergang Boden-Wand', specs: 'Nahtlos · Wasserdicht' },
    ]
  }
]

function ImageCard({ image, index }) {
  return (
    <Reveal delay={index * 100}>
      <div className="group cursor-pointer">
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-3">
          <img
            src={image.src}
            alt={image.caption}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06060660] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <h4 className="font-sora font-light text-base text-warm-text tracking-[-0.01em] mb-1">
          {image.caption}
        </h4>
        <p className="font-dm text-[0.75rem] text-warm-mittel">{image.specs}</p>
      </div>
    </Reveal>
  )
}

export default function Lookbook() {
  const [activeSection, setActiveSection] = useState('materials')
  const currentSection = lookbookSections.find(s => s.id === activeSection)

  return (
    <div className="bg-warm-bg min-h-screen pt-32 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-12">
        <Reveal>
          <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
            Inspiration
          </p>
          <h1 className="font-sora font-extralight text-[clamp(2.5rem,5vw,4rem)] text-warm-text leading-tight tracking-[-0.02em] max-w-3xl mb-6">
            Unser Lookbook
          </h1>
          <p className="font-dm text-[0.95rem] text-warm-mittel max-w-2xl leading-relaxed">
            Materialien, Ideen, Details. Stöbere durch unsere Sammlung und finde Inspiration für dein Projekt.
          </p>
        </Reveal>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-12">
        <Reveal delay={100}>
          <div className="flex flex-wrap gap-2 border-b border-warm-anthrazit/10 pb-6">
            {lookbookSections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-5 py-2.5 font-dm text-[0.85rem] tracking-wide transition-all duration-300 ${
                  activeSection === section.id 
                    ? 'bg-warm-text text-warm-bg' 
                    : 'bg-transparent text-warm-mittel hover:text-warm-text'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Active Section Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <Reveal delay={150}>
          <div className="mb-10">
            <h2 className="font-sora font-light text-2xl md:text-3xl text-warm-text tracking-[-0.01em] mb-2">
              {currentSection.subtitle}
            </h2>
            <p className="font-dm text-[0.9rem] text-warm-mittel max-w-xl leading-relaxed">
              {currentSection.description}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentSection.images.map((image, index) => (
            <ImageCard key={image.src} image={image} index={index} />
          ))}
        </div>
      </div>

      {/* All Sections Overview */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-24">
        <Reveal>
          <h2 className="font-sora font-extralight text-2xl text-warm-text tracking-[-0.01em] mb-8">
            Alle Kategorien
          </h2>
        </Reveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lookbookSections.map((section, index) => (
            <Reveal key={section.id} delay={index * 100}>
              <button
                onClick={() => setActiveSection(section.id)}
                className={`group relative aspect-[16/9] rounded-xl overflow-hidden text-left ${
                  activeSection === section.id ? 'ring-2 ring-warm-text' : ''
                }`}
              >
                <img
                  src={section.images[0].src}
                  alt={section.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060606cc] via-[#06060660] to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-dm text-[0.68rem] font-medium tracking-[2px] uppercase text-inv-muted mb-1">
                    {section.subtitle}
                  </p>
                  <h3 className="font-sora font-light text-xl text-inv-light tracking-[-0.01em]">
                    {section.title}
                  </h3>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Download CTA */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-16">
        <Reveal>
          <div className="bg-dark-bg rounded-xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-sora font-light text-xl text-inv-light tracking-[-0.01em] mb-2">
                Vollständiges Lookbook als PDF
              </h3>
              <p className="font-dm text-[0.85rem] text-inv-muted">
                Alle Materialien, Projekte und Gestaltungsideen zum Mitnehmen.
              </p>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-3 px-6 py-3 bg-warm-bg text-warm-text font-dm text-[0.8rem] font-semibold tracking-wider uppercase hover:bg-white transition-colors duration-300 whitespace-nowrap rounded-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF herunterladen
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
