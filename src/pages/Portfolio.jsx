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

const portfolioItems = [
  {
    id: 1,
    title: 'Villa Münsterland',
    category: 'Badezimmer',
    location: 'Borken',
    image: '/images/portfolio-1.jpg',
    description: 'Großformatige Keramikplatten 160×320 cm, fugenlose Dusche, maßgefertigte Waschtischkombination aus unserer Manufaktur.',
    year: '2024'
  },
  {
    id: 2,
    title: 'Penthouse Bocholt',
    category: 'Wohnraum',
    location: 'Bocholt',
    image: '/images/portfolio-2.jpg',
    description: 'Durchgängige Großformatverlegung über 280 m², reduzierte Fugenführung, Spezialanfertigung Treppenstufen.',
    year: '2024'
  },
  {
    id: 3,
    title: 'Landsitz Ahaus',
    category: 'Wellness & Spa',
    location: 'Ahaus',
    image: '/images/portfolio-3.jpg',
    description: 'Private Spa-Anlage mit Dampfbad, Keramik-Sonderanfertigungen, beheizte Bodenfliesen.',
    year: '2023'
  },
  {
    id: 4,
    title: 'Einfamilienhaus Isselburg',
    category: 'Küche & Wohnen',
    location: 'Isselburg',
    image: '/images/portfolio-4.jpg',
    description: 'Offene Wohnküche mit durchgängigem Bodenbelag, Küchenrückwand als Einzelanfertigung.',
    year: '2023'
  },
  {
    id: 5,
    title: 'Villa Rhede',
    category: 'Badezimmer',
    location: 'Rhede',
    image: '/images/portfolio-5.jpg',
    description: 'Doppeltes Masterbad mit identischer Materialität, Nischenlösungen aus SLAB-Material.',
    year: '2023'
  },
  {
    id: 6,
    title: 'Loft Dülmen',
    category: 'Gewerbe',
    location: 'Dülmen',
    image: '/images/portfolio-6.jpg',
    description: 'Büroetage mit repräsentativer Eingangshalle, Großformat-Empfangstresen in Keramik.',
    year: '2022'
  }
]

export default function Portfolio() {
  const [filter, setFilter] = useState('Alle')
  const categories = ['Alle', 'Badezimmer', 'Wohnraum', 'Wellness & Spa', 'Küche & Wohnen', 'Gewerbe']

  const filteredItems = filter === 'Alle' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter)

  return (
    <div className="bg-warm-bg min-h-screen pt-32 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-12">
        <Reveal>
          <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
            Unsere Arbeit
          </p>
          <h1 className="font-sora font-extralight text-[clamp(2.5rem,5vw,4rem)] text-warm-text leading-tight tracking-[-0.02em] max-w-3xl">
            Räume, die wir geschaffen haben.
          </h1>
        </Reveal>
      </div>

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-12">
        <Reveal delay={100}>
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 font-dm text-[0.82rem] tracking-wide transition-all duration-300 ${
                  filter === cat 
                    ? 'bg-warm-text text-warm-bg' 
                    : 'bg-transparent border border-warm-anthrazit/20 text-warm-mittel hover:border-warm-anthrazit/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Portfolio Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <Reveal key={item.id} delay={index * 100}>
              <article className="group cursor-pointer">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06060680] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-warm-bg/90 backdrop-blur-sm font-dm text-[0.72rem] text-warm-text tracking-wide">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-sora font-light text-lg text-warm-text tracking-[-0.01em]">
                      {item.title}
                    </h3>
                    <span className="font-dm text-[0.75rem] text-warm-mittel">{item.year}</span>
                  </div>
                  <p className="font-dm text-[0.82rem] text-warm-mittel">{item.location}</p>
                  <p className="font-dm text-[0.82rem] text-warm-mittel/80 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-20">
        <Reveal>
          <div className="bg-dark-bg rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-sora font-extralight text-2xl md:text-3xl text-inv-light tracking-[-0.01em] mb-2">
                Dein Projekt als nächstes Highlight?
              </h2>
              <p className="font-dm text-[0.9rem] text-inv-muted">
                Jeder Raum erzählt eine Geschichte. Wir sorgen dafür, dass es deine ist.
              </p>
            </div>
            <a
              href="/kontakt"
              className="inline-flex items-center gap-3 px-8 py-4 bg-warm-bg text-warm-text font-dm text-[0.82rem] font-semibold tracking-wider uppercase hover:bg-white transition-colors duration-300 whitespace-nowrap rounded-none"
            >
              Projekt besprechen
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
