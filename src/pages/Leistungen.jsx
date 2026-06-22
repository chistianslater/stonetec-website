import { useEffect, useRef, useState } from 'react'
// eslint-disable-next-line no-unused-vars -- `motion` is used as `motion.*` in JSX (flat config lacks JSX-member detection)
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'

/* ─── Reveal Component ───────────────────────────────────────── */
function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Service Data ───────────────────────────────────────────── */
const services = [
  {
    id: 'beratung',
    title: 'Beratung & Konzeptentwicklung',
    subtitle: 'Der Anfang jeder Vision',
    description: 'Wir nehmen uns Zeit, deine Wünsche und Anforderungen genau zu verstehen. In intensiven Beratungsgesprächen entwickeln wir gemeinsam ein maßgeschneidertes Konzept, das Funktionalität und Ästhetik vereint.',
    details: 'Dank modernster 3D-Visualisierungen und Virtual-Reality-Technologien kannst du dein Projekt bereits vor der Umsetzung realitätsnah erleben.',
    image: '/images/website-extract/StoneTec_Highlights_rechteckig-5.jpg',
    features: ['Individuelle Bedarfsanalyse', 'Materialcollagen & Haptik', '3D-Visualisierung', 'VR-Erlebnis'],
    link: '/3d-badplanung-bocholt'
  },
  {
    id: 'verlegung',
    title: 'Fliesenverlegung aus Meisterhand',
    subtitle: 'Präzision in jeder Fuge',
    description: 'Unsere erfahrenen Fliesenlegermeister setzen dein Projekt mit höchster Präzision und Sorgfalt um. Wir verwenden ausschließlich hochwertige Materialien und moderne Techniken.',
    details: 'Ob großformatige Keramik, filigrane Mosaike oder klassische Natursteinarbeiten — wir garantieren langlebige und ästhetisch ansprechende Ergebnisse auf Meister-Niveau.',
    image: '/images/website-extract/StoneTec_Highlights_rechteckig-6.jpg',
    features: ['Großformat-Spezialisten', 'Meistergeführte Teams', 'Staubfreie Sanierung', 'Termintreue'],
    link: '/fliesenleger-bocholt'
  },
  {
    id: 'manufaktur',
    title: 'Keramikmanufaktur',
    subtitle: 'Unikate jenseits des Standards',
    description: 'In unserer hauseigenen Manufaktur entstehen individuelle Sonderanfertigungen aus Keramik — von maßgeschneiderten Waschtischen über Arbeitsplatten bis hin zu kunstvoll gestalteten Wandpaneelen.',
    details: 'Wir setzen deiner Kreativität keine Grenzen. Jedes Stück ist ein handgefertigtes Unikat, das exakt auf deine Räumlichkeiten und Bedürfnisse zugeschnitten ist.',
    image: '/images/Keramik-Manufaktur/IMG_5118-web.webp',
    features: ['Maßgefertigte Waschtische', 'Treppenstufen aus Keramik', 'Küchenarbeitsplatten', 'Nischenlösungen'],
    link: '/keramikmanufaktur-nrw'
  },
  {
    id: 'komplettloesungen',
    title: 'Komplettlösungen',
    subtitle: 'Alles aus einer Hand',
    description: 'Wir bieten dir alles aus einer Hand — von der ersten Idee bis zur finalen Umsetzung. Unser ganzheitlicher Ansatz ermöglicht es, deine Räumlichkeiten vollständig zu transformieren.',
    details: 'Wir koordinieren alle Gewerke und sorgen für einen reibungslosen Ablauf. So entsteht ein harmonisches Gesamtbild ohne Stress für dich.',
    image: '/images/website-extract/Komplettloesungen.jpg',
    features: ['Gewerkeübergreifend', 'Projektleitung', 'Pauschalpreisgarantie', 'Sorgenfrei-Paket'],
    link: '/badsanierung-bocholt'
  }
]

/* ─── Leistungs-Slideshow-Bilder (kuratiert & optimiert) ──────── */
const serviceImages = {
  beratung: [
    '/images/leistungen/beratung/stonetec-leistung-beratung-1.jpg',
    '/images/leistungen/beratung/stonetec-leistung-beratung-2.jpg',
    '/images/leistungen/beratung/stonetec-leistung-beratung-3.jpg',
    '/images/leistungen/beratung/stonetec-leistung-beratung-4.jpg',
    '/images/leistungen/beratung/stonetec-leistung-beratung-5.jpg',
    '/images/leistungen/beratung/stonetec-leistung-beratung-6.jpg',
  ],
  verlegung: [
    '/images/leistungen/verlegung/stonetec-leistung-verlegung-1.jpg',
    '/images/leistungen/verlegung/stonetec-leistung-verlegung-2.jpg',
    '/images/leistungen/verlegung/stonetec-leistung-verlegung-3.jpg',
    '/images/leistungen/verlegung/stonetec-leistung-verlegung-4.jpg',
  ],
  manufaktur: [
    '/images/leistungen/manufaktur/stonetec-leistung-manufaktur-1.jpg',
    '/images/leistungen/manufaktur/stonetec-leistung-manufaktur-2.jpg',
    '/images/leistungen/manufaktur/stonetec-leistung-manufaktur-3.jpg',
    '/images/leistungen/manufaktur/stonetec-leistung-manufaktur-4.jpg',
    '/images/leistungen/manufaktur/stonetec-leistung-manufaktur-5.jpg',
    '/images/leistungen/manufaktur/stonetec-leistung-manufaktur-6.jpg',
  ],
  komplettloesungen: [
    '/images/leistungen/komplettloesungen/stonetec-leistung-komplettloesungen-1.jpg',
    '/images/leistungen/komplettloesungen/stonetec-leistung-komplettloesungen-2.jpg',
    '/images/leistungen/komplettloesungen/stonetec-leistung-komplettloesungen-3.jpg',
    '/images/leistungen/komplettloesungen/stonetec-leistung-komplettloesungen-4.jpg',
    '/images/leistungen/komplettloesungen/stonetec-leistung-komplettloesungen-5.jpg',
    '/images/leistungen/komplettloesungen/stonetec-leistung-komplettloesungen-6.jpg',
  ],
}

/* ─── Service Section Component ──────────────────────────────── */
function ServiceSection({ service, index }) {
  const containerRef = useRef(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const images = serviceImages[service.id] || [service.image]

  useEffect(() => {
    if (images.length <= 1 || isHovered) return
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [images.length, isHovered])

  const goPrev = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  const goNext = () => setCurrentImageIndex((prev) => (prev + 1) % images.length)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const isEven = index % 2 === 0

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[80vh] flex items-center py-24 overflow-hidden border-b border-warm-anthrazit/5"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-16 items-center ${isEven ? '' : 'lg:direction-rtl'}`}>
          {/* Text Content */}
          <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
            <Reveal delay={0.1}>
              <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
                {service.subtitle}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <h2 className="font-sora font-extralight text-[clamp(2rem,4vw,3.5rem)] text-warm-text leading-tight tracking-[-0.02em] mb-8">
                {service.title}
              </h2>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="space-y-6 mb-10">
                <p className="font-dm text-[1.1rem] text-warm-text/80 leading-relaxed">
                  {service.description}
                </p>
                <p className="font-dm text-[0.95rem] text-warm-mittel leading-relaxed">
                  {service.details}
                </p>
              </div>
            </Reveal>
            
            <Reveal delay={0.4}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {service.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-warm-stein rounded-full" />
                    <span className="font-dm text-[0.85rem] text-warm-mittel">{feature}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.5}>
              <Link 
                to={service.link || "/kontakt"} 
                className="group inline-flex items-center gap-4 px-8 py-4 border border-warm-text text-warm-text font-dm text-[0.82rem] font-semibold tracking-wider uppercase hover:bg-warm-text hover:text-warm-bg transition-all duration-500 rounded-none"
              >
                <span>Mehr erfahren</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </Reveal>
          </div>

          {/* Image */}
          <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
            <motion.div
              style={{ y }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-dark-bg"
            >
              <AnimatePresence initial={false}>
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt={service.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#06060620] to-transparent pointer-events-none" />

              {images.length > 1 && (
                <>
                  <motion.button
                    type="button"
                    aria-label="Vorheriges Bild"
                    onClick={goPrev}
                    initial={false}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
                    className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm hover:bg-black/45 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
                  </motion.button>
                  <motion.button
                    type="button"
                    aria-label="Nächstes Bild"
                    onClick={goNext}
                    initial={false}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
                    className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm hover:bg-black/45 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                  </motion.button>
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {images.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/40 w-1.5'}`} />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function Leistungen() {
  return (
    <div className="bg-warm-bg min-h-screen pt-48">
      <SEO 
        title="Leistungen — Von der Planung bis zur Meister-Verlegung"
        description="Entdecke unsere Leistungen: Beratung, 3D-Planung, Fliesenverlegung und individuelle Keramik-Manufaktur in Bocholt."
      />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-32">
        <Reveal>
          <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
            Unsere Expertise
          </p>
          <h1 className="font-sora font-extralight text-[clamp(1.9rem,7vw,5.5rem)] text-warm-text leading-[1.05] tracking-[-0.03em] max-w-4xl break-words">
            Meisterhandwerk.<br />Neu definiert.
          </h1>
          <p className="font-dm text-[1.1rem] text-warm-mittel max-w-2xl mt-8 leading-relaxed">
            Wir kombinieren traditionelles Handwerk mit modernster Technologie und einem Auge für zeitloses Design.
          </p>
        </Reveal>
      </div>

      {/* Services List */}
      <div className="pb-24">
        {services.map((service, index) => (
          <ServiceSection key={service.id} service={service} index={index} />
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-dark-bg py-32 noise">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center">
          <Reveal>
            <h2 className="font-sora font-extralight text-[clamp(2.5rem,5vw,4rem)] text-inv-light leading-tight tracking-[-0.02em] mb-12">
              Lass uns gemeinsam<br />etwas Besonderes schaffen.
            </h2>
            <Link 
              to="/kontakt"
              className="inline-block bg-inv-light text-dark-bg font-dm text-[0.7rem] uppercase tracking-[3px] px-12 py-6 rounded-full hover:bg-warm-mittel hover:text-inv-light transition-all duration-500"
            >
              Kostenlose Erstberatung
            </Link>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
