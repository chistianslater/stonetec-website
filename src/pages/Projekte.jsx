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
    id: 1,
    title: 'Design Statement',
    category: 'Badezimmer',
    location: 'Borken',
    year: '2024',
    description: 'Maximale Fugenreduktion trifft auf skulpturale Formgebung. Ein Bad, das Ruhe ausstrahlt und handwerkliche Perfektion in jedem Detail feiert.',
    mainImage: '/images/website-extract/Design-Statement-2.jpg',
    gallery: [
      '/images/website-extract/Design-Statement-1.jpg',
      '/images/website-extract/Design-Statement-3.jpg',
      '/images/website-extract/Design-Statement-4.jpg',
      '/images/website-extract/Design-Statement-5.jpg',
      '/images/website-extract/Design-Statement-6.jpg'
    ],
    stats: { area: '145 m²', duration: '8 Wochen', materials: 'Keramik SLAB 160×320' }
  },
  {
    id: 2,
    title: 'praemium GmbH',
    category: 'Gewerbe | Interior Design',
    location: 'Bocholt',
    year: '2024',
    description: 'Repräsentativer Empfangsbereich mit monolithischem Charakter. Großformatige Keramik schafft eine nahtlose Verbindung zwischen Architektur und Design.',
    mainImage: '/images/website-extract/Interior-Design-1.jpg',
    gallery: [],
    stats: { area: '280 m²', duration: '12 Wochen', materials: 'SLAB-Keramik Tresen' }
  },
  {
    id: 3,
    title: 'Perfekte Linien',
    category: 'Wellness | Spa',
    location: 'Ahaus',
    year: '2023',
    description: 'Präzision bis in die letzte Fuge. Ein privater Wellnessbereich, der durch klare Linienführung und hochwertige Materialität besticht.',
    mainImage: '/images/website-extract/Perfekte-Linien_11.jpg',
    gallery: [],
    stats: { area: '95 m²', duration: '16 Wochen', materials: 'Rutschhemmende Keramik' }
  },
  {
    id: 4,
    title: 'Natural Beauty',
    category: 'Wohnraum',
    location: 'Isselburg',
    year: '2023',
    description: 'Die Wärme von Naturstein vereint mit der Beständigkeit von Feinsteinzeug. Ein Wohnkonzept, das Natürlichkeit und Moderne harmonisch verbindet.',
    mainImage: '/images/website-extract/Natural-Beauty-5.jpg',
    gallery: [],
    stats: { area: '120 m²', duration: '6 Wochen', materials: 'Natursteinoptik Feinsteinzeug' }
  }
]

/* ─── Project Section Component ──────────────────────────────── */
function ProjectSection({ project, index }) {
  const containerRef = useRef(null)
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
            className="relative aspect-[4/5] md:aspect-[16/10] lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
          >
            <img 
              src={project.mainImage} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06060630] to-transparent" />
          </motion.div>
          
          {/* Decorative Stats Card */}
          <motion.div 
            initial={{ x: isEven ? 40 : -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className={`absolute -bottom-10 bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl hidden md:block max-w-[280px] ${isEven ? '-left-10 md:-left-20' : '-right-10 md:-right-20'}`}
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
        description="Entdecken Sie unsere abgeschlossenen Projekte in Bocholt und Umgebung. Von luxuriösen Badezimmern bis hin zu repräsentativen Gewerbeobjekten."
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
                  <p className="font-sora font-extralight text-5xl md:text-6xl text-inv-light">350+</p>
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
