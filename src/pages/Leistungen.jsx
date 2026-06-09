import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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
    image: '/images/website-extract/stonetec_Highlights_rechteckig-5.jpg',
    features: ['Individuelle Bedarfsanalyse', 'Materialcollagen & Haptik', '3D-Visualisierung', 'VR-Erlebnis']
  },
  {
    id: 'verlegung',
    title: 'Fliesenverlegung aus Meisterhand',
    subtitle: 'Präzision in jeder Fuge',
    description: 'Unsere erfahrenen Fliesenlegermeister setzen dein Projekt mit höchster Präzision und Sorgfalt um. Wir verwenden ausschließlich hochwertige Materialien und moderne Techniken.',
    details: 'Ob großformatige Keramik, filigrane Mosaike oder klassische Natursteinarbeiten — wir garantieren langlebige und ästhetisch ansprechende Ergebnisse auf Meister-Niveau.',
    image: '/images/website-extract/stonetec_Highlights_rechteckig-6.jpg',
    features: ['Großformat-Spezialisten', 'Meistergeführte Teams', 'Staubfreie Sanierung', 'Termintreue']
  },
  {
    id: 'manufaktur',
    title: 'Keramikmanufaktur',
    subtitle: 'Unikate jenseits des Standards',
    description: 'In unserer hauseigenen Manufaktur entstehen individuelle Sonderanfertigungen aus Keramik — von maßgeschneiderten Waschtischen über Arbeitsplatten bis hin zu kunstvoll gestalteten Wandpaneelen.',
    details: 'Wir setzen deiner Kreativität keine Grenzen. Jedes Stück ist ein handgefertigtes Unikat, das exakt auf deine Räumlichkeiten und Bedürfnisse zugeschnitten ist.',
    image: '/images/Keramik-Manufaktur/IMG_5118-web.webp',
    features: ['Maßgefertigte Waschtische', 'Treppenstufen aus Keramik', 'Küchenarbeitsplatten', 'Nischenlösungen']
  },
  {
    id: 'komplettloesungen',
    title: 'Komplettlösungen',
    subtitle: 'Alles aus einer Hand',
    description: 'Wir bieten dir alles aus einer Hand — von der ersten Idee bis zur finalen Umsetzung. Unser ganzheitlicher Ansatz ermöglicht es, deine Räumlichkeiten vollständig zu transformieren.',
    details: 'Wir koordinieren alle Gewerke und sorgen für einen reibungslosen Ablauf. So entsteht ein harmonisches Gesamtbild ohne Stress für dich.',
    image: '/images/website-extract/Komplettloesungen.jpg',
    features: ['Gewerkeübergreifend', 'Projektleitung', 'Pauschalpreisgarantie', 'Sorgenfrei-Paket']
  }
]

/* ─── Service Section Component ──────────────────────────────── */
function ServiceSection({ service, index }) {
  const containerRef = useRef(null)
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
                to="/kontakt" 
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
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl"
            >
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06060620] to-transparent" />
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
          <h1 className="font-sora font-extralight text-[clamp(3rem,7vw,5.5rem)] text-warm-text leading-[1] tracking-[-0.03em] max-w-4xl">
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
