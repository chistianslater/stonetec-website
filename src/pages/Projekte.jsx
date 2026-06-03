import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
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

/* ─── Project Data ───────────────────────────────────────────── */
const projects = [
  {
    id: 'albrecht',
    title: 'Albrecht',
    category: 'Badezimmer | Wohnraum',
    location: 'Bocholt',
    year: '2024',
    description: 'Zeitlose Eleganz durch die Kombination von Marmor- und Betonoptik. Ein harmonisches Gesamtkonzept für modernes Wohnen.',
    mainImage: '/images/hero-1.jpg',
    gallery: [],
    stats: { area: '40 m²', duration: '5 Wochen', materials: 'Feinsteinzeug · Marmoroptik · Betonoptik' }
  },
  {
    id: 'derksen',
    title: 'Derksen',
    category: 'Badezimmer',
    location: 'Bocholt',
    year: '2024',
    description: 'Natürlichkeit im Fokus. Hochwertige Natursteinoptik schafft eine warme und einladende Atmosphäre im Badbereich.',
    mainImage: '/images/hero-2.jpg',
    gallery: [],
    stats: { area: '40 m²', duration: '4 Wochen', materials: 'Feinsteinzeug · Natursteinoptik' }
  },
  {
    id: 'esterabadeyan',
    title: 'Esterabadeyan',
    category: 'Wellness | Spa',
    location: 'Bocholt',
    year: '2024',
    description: 'Ein großzügiges Wellness-Projekt mit exklusivem Glasmosaik. Luxus und Entspannung auf höchstem handwerklichem Niveau.',
    mainImage: '/images/hero-3.jpg',
    gallery: [],
    stats: { area: '300 m²', duration: '4 Monate', materials: 'Feinsteinzeug · Glasmosaik' }
  },
  {
    id: 'goerz',
    title: 'Görz',
    category: 'Badezimmer',
    location: 'Bocholt',
    year: '2024',
    description: 'Die perfekte Symbiose aus Naturstein- und Marmoroptik. Ein Statement für hochwertiges Baddesign.',
    mainImage: '/images/hero-4.jpg',
    gallery: [],
    stats: { area: '50 m²', duration: '6 Wochen', materials: 'Feinsteinzeug · Natursteinoptik · Marmoroptik' }
  },
  {
    id: 'heis-bruns',
    title: 'Heis Bruns',
    category: 'Individuelles Wohnen',
    location: 'Bocholt',
    year: '2024',
    description: 'Kreative Wandgestaltung mit Metrofliesen und Dekor-Elementen. Einzigartiger Charakter durch Liebe zum Detail.',
    mainImage: '/images/hero-1.jpg',
    gallery: [],
    stats: { area: '60 m²', duration: '4 Wochen', materials: 'Feinsteinzeug · Marmoroptik · Metrofliesen · Dekor-Fliesen' }
  },
  {
    id: 'han',
    title: 'Han',
    category: 'Großprojekt Wohnen',
    location: 'Bocholt',
    year: '2024',
    description: 'Großformatige Keramik auf 300 Quadratmetern. Ein monolithisches Raumerlebnis durch präzise Fugenführung.',
    mainImage: '/images/hero-2.jpg',
    gallery: [],
    stats: { area: '300 m²', duration: '3 Monate', materials: 'Feinsteinzeug · Natursteinoptik · Marmoroptik' }
  },
  {
    id: 'kempkes-storm',
    title: 'Kempkes & Storm',
    category: 'Badezimmer',
    location: 'Bocholt',
    year: '2024',
    description: 'Moderner Retro-Look durch Terrazzooptik und Metrofliesen. Handwerkliche Präzision trifft auf zeitloses Design.',
    mainImage: '/images/hero-3.jpg',
    gallery: [],
    stats: { area: '40 m²', duration: '3 Wochen', materials: 'Feinsteinzeug · Terrazzooptik · Metrofliesen' }
  },
  {
    id: 'klump',
    title: 'Klump',
    category: 'Badezimmer',
    location: 'Bocholt',
    year: '2024',
    description: 'Stilvolle Kombination aus Terrazzo und Metrofliesen. Ein Badkonzept mit Charakter und Qualität.',
    mainImage: '/images/hero-4.jpg',
    gallery: [],
    stats: { area: '50 m²', duration: '4 Wochen', materials: 'Feinsteinzeug · Terrazzooptik · Metrofliesen' }
  },
  {
    id: 'lamers',
    title: 'Lamers',
    category: 'Wohnraum',
    location: 'Bocholt',
    year: '2024',
    description: 'Klassisches Fischgrät-Muster in moderner Betonoptik. Ein Bodenbelag, der Tradition und Moderne verbindet.',
    mainImage: '/images/hero-1.jpg',
    gallery: [],
    stats: { area: '40 m²', duration: '5 Wochen', materials: 'Feinsteinzeug · Betonoptik · Fischgrät' }
  },
  {
    id: 'krasemann',
    title: 'Krasemann',
    category: 'Exklusives Wohnen',
    location: 'Bocholt',
    year: '2024',
    description: 'Meisterhafte Verlegung auf 500 Quadratmetern. Naturstein- und Marmoroptik in ihrer edelsten Form.',
    mainImage: '/images/hero-2.jpg',
    gallery: [],
    stats: { area: '500 m²', duration: '5 Monate', materials: 'Feinsteinzeug · Natursteinoptik · Marmoroptik' }
  },
  {
    id: 'moritz',
    title: 'Moritz',
    category: 'Badezimmer',
    location: 'Bocholt',
    year: '2024',
    description: 'Harmonisches Zusammenspiel von Naturstein und Marmor. Ein Ort der Ruhe und Entspannung.',
    mainImage: '/images/hero-3.jpg',
    gallery: [],
    stats: { area: '50 m²', duration: '5 Wochen', materials: 'Feinsteinzeug · Natursteinoptik · Marmoroptik' }
  },
  {
    id: 'mpalaskas',
    title: 'Mpalaskas',
    category: 'Badezimmer',
    location: 'Bocholt',
    year: '2024',
    description: 'Präzise Handwerkskunst trifft auf edle Optik. Ein Bad, das durch Materialität und Ausführung überzeugt.',
    mainImage: '/images/hero-4.jpg',
    gallery: [],
    stats: { area: '50 m²', duration: '4 Wochen', materials: 'Feinsteinzeug · Natursteinoptik · Marmoroptik' }
  },
  {
    id: 'onori',
    title: 'Onori',
    category: 'Badezimmer',
    location: 'Bocholt',
    year: '2024',
    description: 'Reduziertes Design in Marmoroptik. Klarheit und Struktur für ein modernes Badezimmer.',
    mainImage: '/images/hero-1.jpg',
    gallery: [],
    stats: { area: '40 m²', duration: '4 Wochen', materials: 'Feinsteinzeug · Marmoroptik' }
  },
  {
    id: 'pehr',
    title: 'Pehr',
    category: 'Wohnraum',
    location: 'Bocholt',
    year: '2024',
    description: 'Moderne Betonoptik für ein urbanes Lebensgefühl. Robust, pflegeleicht und ästhetisch ansprechend.',
    mainImage: '/images/hero-2.jpg',
    gallery: [],
    stats: { area: '60 m²', duration: '6 Wochen', materials: 'Feinsteinzeug · Betonoptik' }
  },
  {
    id: 'praemium',
    title: 'Praemium',
    category: 'Gewerbe',
    location: 'Bocholt',
    year: '2024',
    description: 'Repräsentative Gewerbeflächen in Natursteinoptik. Langlebigkeit und Exklusivität für den professionellen Einsatz.',
    mainImage: '/images/hero-3.jpg',
    gallery: [],
    stats: { area: '150 m²', duration: '2 Monate', materials: 'Feinsteinzeug · Natursteinoptik' }
  },
  {
    id: 'schwiening',
    title: 'Schwiening',
    category: 'Badezimmer',
    location: 'Bocholt',
    year: '2024',
    description: 'Individuelle Badgestaltung mit hochwertigen Keramik-Oberflächen. Ein Unikat aus Meisterhand.',
    mainImage: '/images/hero-4.jpg',
    gallery: [],
    stats: { area: '70 m²', duration: '6 Wochen', materials: 'Feinsteinzeug · Natursteinoptik · Marmoroptik' }
  },
  {
    id: 'spoeler',
    title: 'Spöler',
    category: 'Wohnraum | Bad',
    location: 'Bocholt',
    year: '2024',
    description: 'Großflächige Verlegung in Naturstein- und Betonoptik. Ein durchgängiges Gestaltungskonzept.',
    mainImage: '/images/hero-1.jpg',
    gallery: [],
    stats: { area: '150 m²', duration: '10 Wochen', materials: 'Feinsteinzeug · Natursteinoptik · Betonoptik' }
  },
  {
    id: 'van-gessel',
    title: 'Van Gessel',
    category: 'Badezimmer',
    location: 'Bocholt',
    year: '2024',
    description: 'Kompaktes Design mit großer Wirkung. Natursteinoptik für ein zeitloses Badezimmer.',
    mainImage: '/images/hero-2.jpg',
    gallery: [],
    stats: { area: '30 m²', duration: '3 Wochen', materials: 'Feinsteinzeug · Natursteinoptik' }
  },
  {
    id: 'landhotel-voshoevel',
    title: 'Landhotel Voshövel',
    category: 'Gewerbe | Hotel',
    location: 'Schermbeck',
    year: '2024',
    description: 'Exklusive Hotelgestaltung mit Terrazzooptik und Metrofliesen. Ein Ort der Gastfreundschaft und des Designs.',
    mainImage: '/images/hero-3.jpg',
    gallery: [],
    stats: { area: '200 m²', duration: '2 Monate', materials: 'Feinsteinzeug · Terrazzooptik · Metrofliesen' }
  },
  {
    id: 'weidemann',
    title: 'Weidemann',
    category: 'Badezimmer',
    location: 'Bocholt',
    year: '2024',
    description: 'Moderne Kombination aus Beton- und Marmoroptik. Hochwertige Materialien für ein exklusives Bad.',
    mainImage: '/images/hero-4.jpg',
    gallery: [],
    stats: { area: '40 m²', duration: '4 Wochen', materials: 'Feinsteinzeug · Betonoptik · Marmoroptik' }
  },
  {
    id: 'weidemann-pool',
    title: 'Weidemann Pool',
    category: 'Pool | Wellness',
    location: 'Bocholt',
    year: '2024',
    description: 'Poolgestaltung in Natursteinoptik. Beständigkeit und Ästhetik für den Außenbereich.',
    mainImage: '/images/hero-1.jpg',
    gallery: [],
    stats: { area: '30 m²', duration: '3 Wochen', materials: 'Feinsteinzeug · Natursteinoptik' }
  }
]

/* ─── Project Section Component ──────────────────────────────── */
function ProjectSection({ project, index }) {
  const containerRef = useRef(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = [project.mainImage, ...(project.gallery || [])]
  
  useEffect(() => {
    if (images.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [images.length])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 1, 1, 0])
  const isEven = index % 2 === 0

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden"
    >
      <motion.div 
        style={{ opacity, scale }}
        className="container mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center"
      >
        {/* Text Content */}
        <div className={`lg:col-span-5 z-10 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
          <Reveal delay={0.1}>
            <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
              {project.category}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <h2 className="font-sora font-extralight text-[clamp(2.5rem,5vw,4.5rem)] text-warm-text leading-[1.1] tracking-[-0.03em] mb-8">
              {project.title}
            </h2>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="font-dm text-[1.1rem] text-warm-mittel leading-relaxed mb-10 max-w-md">
              {project.description}
            </p>
          </Reveal>
          
          <Reveal delay={0.4}>
            <div className="grid grid-cols-2 gap-8 py-8 border-y border-warm-anthrazit/10 mb-10">
              <div>
                <p className="font-dm text-[0.7rem] text-warm-mittel uppercase tracking-widest mb-1">Ort</p>
                <p className="font-sora font-light text-lg text-warm-text">{project.location}</p>
              </div>
              <div>
                <p className="font-dm text-[0.7rem] text-warm-mittel uppercase tracking-widest mb-1">Jahr</p>
                <p className="font-sora font-light text-lg text-warm-text">{project.year}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <Link 
              to="/kontakt" 
              className="group inline-flex items-center gap-4 px-8 py-4 bg-dark-bg text-inv-light font-dm text-[0.82rem] font-semibold tracking-wider uppercase hover:bg-black transition-all duration-500 rounded-none"
            >
              <span>Projekt anfragen</span>
              <motion.span 
                className="w-8 h-[1px] bg-inv-light/50"
                whileHover={{ width: 48 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </Reveal>
        </div>

        {/* Image Display */}
        <div className={`lg:col-span-7 relative ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
          <motion.div 
            style={{ y }}
            className="relative aspect-[4/5] md:aspect-[16/10] lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-dark-bg"
          >
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentImageIndex}
                src={images[currentImageIndex]} 
                alt={project.title} 
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#06060630] to-transparent pointer-events-none" />
            
            {/* Image Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {images.map((_, i) => (
                  <div 
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
          
          {/* Decorative Stats Card */}
          <motion.div 
            initial={{ x: isEven ? 40 : -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className={`absolute -bottom-10 bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl hidden md:block max-w-[280px] z-30 ${isEven ? '-left-10 md:-left-20' : '-right-10 md:-right-20'}`}
          >
            <div className="space-y-6">
              <div>
                <p className="font-dm text-[0.65rem] text-warm-mittel uppercase tracking-[2px] mb-1">Material</p>
                <p className="font-sora font-light text-sm text-warm-text leading-tight">{project.stats.materials}</p>
              </div>
              <div className="flex justify-between gap-8">
                <div>
                  <p className="font-dm text-[0.65rem] text-warm-mittel uppercase tracking-[2px] mb-1">Fläche</p>
                  <p className="font-sora font-light text-sm text-warm-text">{project.stats.area}</p>
                </div>
                <div>
                  <p className="font-dm text-[0.65rem] text-warm-mittel uppercase tracking-[2px] mb-1">Dauer</p>
                  <p className="font-sora font-light text-sm text-warm-text">{project.stats.duration}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function Projekte() {
  return (
    <div className="bg-warm-bg min-h-screen pt-48">
      <SEO 
        title="Projekte — Referenzen & Inspiration"
        description="Entdecke unsere abgeschlossenen Projekte in Bocholt und Umgebung. Von luxuriösen Badezimmern bis hin zu repräsentativen Gewerbeobjekten."
      />
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-24">
        <Reveal>
          <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
            Portfolio
          </p>
          <h1 className="font-sora font-extralight text-[clamp(3rem,8vw,6rem)] text-warm-text leading-[0.95] tracking-[-0.04em] max-w-4xl mb-8">
            Das Beste an unserer Arbeit sieht man nicht.
          </h1>
          <div className="w-24 h-[1px] bg-warm-stein/30 mb-8" />
          <p className="font-dm text-[1.1rem] text-warm-mittel max-w-2xl leading-relaxed">
            Jedes Projekt ist eine Geschichte — von der ersten Idee bis zur letzten Fuge. 
            Wir gestalten Räume, die bleiben. Mit Leidenschaft fürs Detail und einem Blick fürs Ganze.
          </p>
        </Reveal>
      </div>

      {/* Projects List */}
      <div className="space-y-0">
        {projects.map((project, index) => (
          <ProjectSection key={project.id} project={project} index={index} />
        ))}
      </div>

      {/* Stats Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-32">
        <Reveal>
          <div className="bg-dark-bg rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-warm-stein/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-warm-stein/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="font-sora font-extralight text-3xl md:text-5xl text-inv-light mb-16 tracking-tight">
                Meisterschaft in Zahlen.
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                <div className="space-y-2">
                  <p className="font-sora font-extralight text-5xl md:text-6xl text-inv-light">500+</p>
                  <p className="font-dm text-[0.75rem] text-inv-muted uppercase tracking-[2px]">Projekte</p>
                </div>
                <div className="space-y-2">
                  <p className="font-sora font-extralight text-5xl md:text-6xl text-inv-light">7</p>
                  <p className="font-dm text-[0.75rem] text-inv-muted uppercase tracking-[2px]">Meister</p>
                </div>
                <div className="space-y-2">
                  <p className="font-sora font-extralight text-5xl md:text-6xl text-inv-light">180+</p>
                  <p className="font-dm text-[0.75rem] text-inv-muted uppercase tracking-[2px]">Jahre Erfahrung</p>
                </div>
                <div className="space-y-2">
                  <p className="font-sora font-extralight text-5xl md:text-6xl text-inv-light">0</p>
                  <p className="font-dm text-[0.75rem] text-inv-muted uppercase tracking-[2px]">Subunternehmer</p>
                </div>
              </div>
              
              <div className="mt-20">
                <Link 
                  to="/kontakt" 
                  className="inline-flex items-center gap-4 px-10 py-5 bg-warm-bg text-warm-text font-dm text-sm font-semibold tracking-widest uppercase hover:bg-white transition-all duration-500 rounded-none"
                >
                  Dein Projekt starten
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
