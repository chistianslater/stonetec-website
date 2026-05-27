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

const projects = [
  {
    id: 1,
    title: 'Villa Münsterland',
    client: 'Privat',
    location: 'Borken',
    year: '2024',
    duration: '8 Wochen',
    area: '145 m²',
    category: 'Badezimmer',
    challenge: 'Maximale Fugenreduktion bei komplexer Raumgeometrie',
    solution: 'Großformatige Keramikplatten 160×320 cm mit präziser Schnittführung',
    materials: ['Keramik SLAB 160×320', 'Marmoroptik Feinsteinzeug', 'Maßgefertigte Waschtische'],
    images: ['/images/projekt-1-1.jpg', '/images/projekt-1-2.jpg', '/images/projekt-1-3.jpg'],
    featured: true
  },
  {
    id: 2,
    title: 'Penthouse Bocholt',
    client: 'Privat',
    location: 'Bocholt',
    year: '2024',
    duration: '12 Wochen',
    area: '280 m²',
    category: 'Wohnraum',
    challenge: 'Durchgängige Verlegung über mehrere Räume ohne Übergänge',
    solution: 'Reduzierte Fugenführung mit Spezialanfertigung für Treppenstufen',
    materials: ['Großformat Feinsteinzeug', 'Dekor-Fliesen Akzente', 'Beheizte Böden'],
    images: ['/images/projekt-2-1.jpg', '/images/projekt-2-2.jpg'],
    featured: true
  },
  {
    id: 3,
    title: 'Landsitz Ahaus',
    client: 'Privat',
    location: 'Ahaus',
    year: '2023',
    duration: '16 Wochen',
    area: '95 m²',
    category: 'Wellness',
    challenge: 'Private Spa-Anlage mit Dampfbad und speziellen Feuchtigkeitsanforderungen',
    solution: 'Spezialkeramiken mit abriebfester Oberfläche, maßgefertigte Sitzbänke',
    materials: ['Rutschhemmende Keramik', 'Mosaik-Akzente', 'Maßgefertigte Möbel'],
    images: ['/images/projekt-3-1.jpg', '/images/projekt-3-2.jpg', '/images/projekt-3-3.jpg'],
    featured: false
  },
  {
    id: 4,
    title: 'Küchenmanufaktur Isselburg',
    client: 'Gewerbe',
    location: 'Isselburg',
    year: '2023',
    duration: '6 Wochen',
    area: '120 m²',
    category: 'Gewerbe',
    challenge: 'Repräsentativer Empfangsbereich mit hoher Belastbarkeit',
    solution: 'Großformat-Empfangstresen aus SLAB-Keramik, fugenlose Böden',
    materials: ['SLAB-Keramik Tresen', 'Großformat Boden', 'Wandgestaltung'],
    images: ['/images/projekt-4-1.jpg', '/images/projekt-4-2.jpg'],
    featured: false
  }
]

function ProjectCard({ project, index }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Reveal delay={index * 150}>
      <article className={`bg-dark-bg rounded-xl overflow-hidden ${project.featured ? 'md:col-span-2' : ''}`}>
        <div className={`grid ${project.featured ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Image */}
          <div className={`relative ${project.featured ? 'aspect-[4/3]' : 'aspect-[16/9]'} overflow-hidden`}>
            <img
              src={project.images[0]}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-warm-bg/90 backdrop-blur-sm font-dm text-[0.72rem] text-warm-text tracking-wide">
                {project.category}
              </span>
            </div>
            {project.featured && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1.5 bg-inv-light/90 backdrop-blur-sm font-dm text-[0.72rem] text-warm-text tracking-wide font-semibold">
                  Highlight
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-sora font-light text-xl md:text-2xl text-inv-light tracking-[-0.01em] mb-1">
                  {project.title}
                </h3>
                <p className="font-dm text-[0.82rem] text-inv-muted">{project.location} · {project.year}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-inv-light/10">
              <div>
                <p className="font-dm text-[0.72rem] text-inv-tagline uppercase tracking-wide">Fläche</p>
                <p className="font-sora font-light text-lg text-inv-light">{project.area}</p>
              </div>
              <div>
                <p className="font-dm text-[0.72rem] text-inv-tagline uppercase tracking-wide">Dauer</p>
                <p className="font-sora font-light text-lg text-inv-light">{project.duration}</p>
              </div>
              <div>
                <p className="font-dm text-[0.72rem] text-inv-tagline uppercase tracking-wide">Bereich</p>
                <p className="font-sora font-light text-lg text-inv-light">{project.category}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6 flex-1">
              <div>
                <p className="font-dm text-[0.72rem] text-inv-tagline uppercase tracking-wide mb-1">Herausforderung</p>
                <p className="font-dm text-[0.9rem] text-inv-mid leading-relaxed">{project.challenge}</p>
              </div>
              <div>
                <p className="font-dm text-[0.72rem] text-inv-tagline uppercase tracking-wide mb-1">Lösung</p>
                <p className="font-dm text-[0.9rem] text-inv-mid leading-relaxed">{project.solution}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.materials.map(material => (
                <span key={material} className="px-3 py-1.5 bg-inv-light/10 font-dm text-[0.75rem] text-inv-mid">
                  {material}
                </span>
              ))}
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 font-dm text-[0.82rem] text-inv-light hover:text-white transition-colors"
            >
              {isExpanded ? 'Weniger anzeigen' : 'Projektdetails'}
              <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div className="mt-6 pt-6 border-t border-inv-light/10 grid grid-cols-2 gap-4">
                {project.images.slice(1).map((img, i) => (
                  <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden">
                    <img src={img} alt={`${project.title} Detail ${i + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  )
}

export default function Projekte() {
  return (
    <div className="bg-warm-bg min-h-screen pt-32 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-16">
        <Reveal>
          <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
            Ausgewählte Projekte
          </p>
          <h1 className="font-sora font-extralight text-[clamp(2.5rem,5vw,4rem)] text-warm-text leading-tight tracking-[-0.02em] max-w-3xl mb-6">
            Das Beste an unserer Arbeit sieht man nicht.
          </h1>
          <p className="font-dm text-[0.95rem] text-warm-mittel max-w-2xl leading-relaxed">
            Jedes Projekt ist eine Geschichte — von der ersten Idee bis zur letzten Fuge. 
            Hier zeigen wir ausgewählte Realisierungen, die uns besonders wichtig sind.
          </p>
        </Reveal>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-24">
        <Reveal>
          <div className="bg-dark-bg rounded-xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="font-sora font-extralight text-4xl md:text-5xl text-inv-light mb-2">350+</p>
                <p className="font-dm text-[0.82rem] text-inv-muted">Realisierte Projekte</p>
              </div>
              <div className="text-center">
                <p className="font-sora font-extralight text-4xl md:text-5xl text-inv-light mb-2">12</p>
                <p className="font-dm text-[0.82rem] text-inv-muted">Fliesenlegermeister</p>
              </div>
              <div className="text-center">
                <p className="font-sora font-extralight text-4xl md:text-5xl text-inv-light mb-2">25+</p>
                <p className="font-dm text-[0.82rem] text-inv-muted">Jahre Erfahrung</p>
              </div>
              <div className="text-center">
                <p className="font-sora font-extralight text-4xl md:text-5xl text-inv-light mb-2">0</p>
                <p className="font-dm text-[0.82rem] text-inv-muted">Subunternehmer</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
