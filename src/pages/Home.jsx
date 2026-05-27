import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

/* ─── Magnetic Link Component ──────────────────────────────────── */
function MagneticLink({ to, children, className }) {
  const ref = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (clientX - left - width / 2) * 0.2
    const y = (clientY - top - height / 2) * 0.2
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 15, mass: 0.5 }}
    >
      <Link to={to} className={className}>
        {children}
      </Link>
    </motion.div>
  )
}

/* ─── Text Reveal Component ──────────────────────────────────── */
function TextReveal({ children, className = '', delay = 0 }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ 
          duration: 0.8, 
          delay,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/* ─── Scroll Word Reveal Component ──────────────────────────────────── */
function ScrollRevealText({ text, className = '' }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"]
  })

  const words = text.split(" ")

  return (
    <p ref={containerRef} className={`${className} flex flex-wrap`}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        )
      })}
    </p>
  )
}

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.15, 1])
  return (
    <span className="relative mr-[0.25em] mt-[0.1em]">
      <span className="absolute opacity-[0.15]">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  )
}

/* ─── Stagger Container ──────────────────────────────────── */
function StaggerContainer({ children, className = '', staggerDelay = 0.1 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1]
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════ */
function Hero() {
  const [imgLoaded, setImgLoaded] = useState(false)
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  
  const springY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const springScale = useSpring(scale, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <section ref={containerRef} className="relative h-screen min-h-[700px] flex items-end overflow-hidden">
      {/* Parallax Background */}
      <motion.div className="absolute inset-0" style={{ y: springY, scale: springScale }}>
        <motion.img
          src="/images/hero-2.jpg"
          alt="Luxuriöses Badezimmer mit großformatigen Fliesen von StoneTec Bocholt"
          className="w-full h-full object-cover"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={imgLoaded ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          onLoad={() => setImgLoaded(true)}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#06060680] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606cc] via-transparent to-transparent" />
      </motion.div>

      {/* Hero Content */}
      <motion.div 
        className="relative z-10 w-full px-6 md:px-12 lg:px-20 pb-16 md:pb-24"
        style={{ opacity }}
      >
        <div className="overflow-hidden mb-8">
          <motion.div 
            className="w-16 h-[1px] bg-warm-stein/50"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        
        <div className="overflow-hidden">
          <motion.h1 
            className="font-sora font-extralight text-[clamp(2.8rem,7vw,5.5rem)] text-inv-light leading-[1.05] tracking-[-0.03em] max-w-4xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            Räume,<br />die man spürt.
          </motion.h1>
        </div>
        
        <div className="overflow-hidden mt-6">
          <motion.p 
            className="font-dm text-inv-muted text-[clamp(0.95rem,1.5vw,1.15rem)] max-w-lg leading-relaxed"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Meisterhafte Fliesenverlegung, eigene Keramikmanufaktur und 3D&#8209;Visualisierung in Bocholt — alles aus einer Hand.
          </motion.p>
        </div>

        <motion.div 
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <MagneticLink
            to="/kontakt"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-inv-light text-warm-text font-dm text-[0.82rem] font-semibold tracking-wider uppercase hover:bg-white transition-colors duration-300 overflow-hidden relative"
          >
            <span className="relative z-10">Zeig uns deinen Raum</span>
            <motion.span 
              className="inline-block w-6 h-[1px] bg-warm-text/60 relative z-10"
              whileHover={{ width: 32 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div 
              className="absolute inset-0 bg-white"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </MagneticLink>
          
          <MagneticLink
            to="#leistungen"
            className="group inline-flex items-center gap-3 px-8 py-4 border border-inv-light/40 text-inv-light font-dm text-[0.82rem] font-medium tracking-wider uppercase hover:bg-inv-light/10 hover:border-inv-light/70 transition-all duration-300"
          >
            <span>Leistungen ansehen</span>
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.span>
          </MagneticLink>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="font-dm text-[0.7rem] text-inv-muted uppercase tracking-widest">Scroll</span>
        <motion.div 
          className="w-px h-8 bg-inv-muted/50"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   INTRO
   ═══════════════════════════════════════════════════════════ */
function Intro() {
  const text1 = "Zwischen der Vision in deinem Kopf und der Realität in deinem Raum liegen Entscheidungen, die sich endgültig anfühlen. Materialien, die du nicht kennst. Formate, die Präzision verlangen. Und die Frage, wem du das anvertraust."
  const text2 = "Dafür gibt es uns. Zwölf Meister, eigene Fertigung, ein klarer Prozess — und den Anspruch, dass jeder Raum genau so wird, wie du ihn dir vorstellst. Oder besser."

  return (
    <section className="bg-warm-bg py-24 md:py-36 noise relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20">
        <ScrollRevealText 
          text={text1}
          className="font-sora font-extralight text-[clamp(1.6rem,3vw,2.6rem)] text-warm-text leading-[1.35] tracking-[-0.02em]"
        />
        
        <div className="mt-12">
          <TextReveal delay={0.5}>
            <p className="font-dm text-[0.95rem] text-warm-mittel max-w-2xl leading-relaxed">
              {text2}
            </p>
          </TextReveal>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   LEISTUNGEN — Bento Grid
   ═══════════════════════════════════════════════════════════ */
const services = [
  { img: '/images/website-extract/Verlegung-2.jpg', title: 'Premium Fliesenverlegung', sub: 'Meister-Niveau in jeder Fuge', desc: 'Zwölf Fliesenlegermeister. Null Subunternehmer. Großformate, Sanierung, Reparatur — auf höchstem Niveau.', large: true },
  { img: '/images/website-extract/KERAMIKMANUFAKTUR.jpg', title: 'Keramikmanufaktur', sub: 'Unikate aus eigener Fertigung', desc: 'Maßgefertigte Waschtische, Nischenlösungen, SLAB-Verarbeitung — was es von der Stange nicht gibt, fertigen wir selbst.' },
  { img: '/images/website-extract/StoneTec_Startseite_rechteckig.jpg', title: '3D-Planung & Visualisierung', sub: 'Dein Raum, bevor der erste Stein liegt', desc: 'Fotorealistische 3D-CAD-Planung. Du entscheiden erst, wenn du siehst, wie es wird.' },
  { img: '/images/website-extract/StoneTec_Startseite_quadratisch.jpg', title: 'Ausstellung & Beratung', sub: 'Sehen. Fühlen. Entscheiden.', desc: 'Haptik, Ästhetik und Meister-Fachwissen — in unserem Showroom in Bocholt werden Ideen zu Lösungen.' },
]

function ServiceCard({ service, index }) {
  const ref = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={service.large ? 'md:col-span-2' : ''}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to="/kontakt" className="group block relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-auto md:h-[420px] cursor-pointer">
        <motion.div 
          className="absolute inset-0"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={service.img}
            alt={`${service.title} — StoneTec Bocholt`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1815ee] via-[#1A181540] to-transparent" />
        
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-6 md:p-10"
          animate={{ y: isHovered ? -8 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.p 
            className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-stein mb-2"
            animate={{ opacity: isHovered ? 0.7 : 1 }}
          >
            {service.sub}
          </motion.p>
          <h3 className="font-sora font-light text-[clamp(1.4rem,2.5vw,2rem)] text-white leading-tight tracking-[-0.01em] mb-3">
            {service.title}
          </h3>
          <motion.p 
            className="font-dm text-[0.88rem] text-[#b0aaa5] max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {service.desc}
          </motion.p>
        </motion.div>

        {/* Hover Arrow */}
        <motion.div 
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </motion.div>
      </Link>
    </motion.div>
  )
}

function Leistungen() {
  return (
    <section id="leistungen" className="bg-dark-bg py-24 md:py-36 noise">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="overflow-hidden mb-4">
          <motion.p 
            className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-tagline"
            initial={{ y: '100%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Was wir tun
          </motion.p>
        </div>
        
        <div className="overflow-hidden mb-16">
          <motion.h2 
            className="font-sora font-extralight text-[clamp(2rem,4vw,3.2rem)] text-inv-light leading-tight tracking-[-0.02em] max-w-3xl"
            initial={{ y: '100%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Fliesenverlegung, Keramikmanufaktur<br />und 3D-Raumplanung aus Bocholt.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   MARKENVERSPRECHEN
   ═══════════════════════════════════════════════════════════ */
function Markenversprechen() {
  const facts = [
    '12 Fliesenlegermeister unter einem Dach',
    'Eigene Keramikmanufaktur für Unikate',
    '3D-Visualisierung vor Baubeginn',
    'Pauschalpreise — keine Nachträge',
    'Null Subunternehmer. Nur eigene Hände.',
  ]

  return (
    <section className="bg-warm-bg py-24 md:py-36 noise">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <TextReveal>
              <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
                So arbeiten wir
              </p>
            </TextReveal>
            
            <TextReveal delay={0.1}>
              <h2 className="font-sora font-extralight text-[clamp(1.8rem,3vw,2.8rem)] text-warm-text leading-[1.2] tracking-[-0.02em] mb-6">
                Du siehst dein Ergebnis, bevor wir anfangen. Du kennst den Preis, bevor wir anfangen. Und du weißt, wer bei dir arbeitet.
              </h2>
            </TextReveal>
            
            <StaggerContainer className="mt-8 space-y-4" staggerDelay={0.1}>
              {facts.map((fact) => (
                <StaggerItem key={fact}>
                  <div className="flex items-start gap-4">
                    <motion.span 
                      className="mt-2 w-1.5 h-1.5 bg-warm-stein rounded-full flex-shrink-0"
                      whileInView={{ scale: [0, 1.2, 1] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, ease: 'backOut' }}
                    />
                    <p className="font-dm text-[0.92rem] text-warm-mittel leading-relaxed">{fact}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <img src="/images/website-extract/Beratung.jpg" alt="StoneTec Beratungsgespräch im Showroom Bocholt" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06060640] to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   GROßFORMATE — Horizontal Scroll Gallery
   ═══════════════════════════════════════════════════════════ */
function Grossformate() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })
  
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])

  const images = [
    { src: '/images/Sonstiges/IMG_0655-web.webp', alt: 'Großformatige Fliesen im Badezimmer — StoneTec Bocholt' },
    { src: '/images/Sonstiges/IMG_0657-web.webp', alt: 'Großformat Feinsteinzeug Wohnraum' },
    { src: '/images/Sonstiges/IMG_0659-web.webp', alt: 'Großformatige Keramikplatten Showroom Bocholt' },
    { src: '/images/Sonstiges/IMG_0714-web.webp', alt: 'Großformat Fliesen Design' },
    { src: '/images/Sonstiges/IMG_0715-web.webp', alt: 'Großformat Fliesen minimalistisch' },
  ]

  return (
    <section ref={containerRef} id="grossformate" className="bg-dark-bg py-24 md:py-36 noise overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-12">
        <TextReveal>
          <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-tagline mb-4">Großformate bis 320 cm</p>
        </TextReveal>
        
        <TextReveal delay={0.1}>
          <h2 className="font-sora font-extralight text-[clamp(2rem,4vw,3.2rem)] text-inv-light leading-tight tracking-[-0.02em]">
            Großformatige Fliesen.<br />Präzise verlegt.
          </h2>
        </TextReveal>
        
        <TextReveal delay={0.2}>
          <p className="font-dm text-[0.95rem] text-inv-muted mt-4 max-w-lg leading-relaxed">
            Keramikplatten bis 160 &times; 320 cm. Nahezu fugenlose Flächen, die Weite schaffen. Die Verarbeitung verlangt Meister-Erfahrung und Spezialwerkzeug — beides bringen wir mit.
          </p>
        </TextReveal>
      </div>
      
      <motion.div 
        className="flex gap-5 px-6 md:px-12 lg:px-20"
        style={{ x }}
      >
        {images.map((img, i) => (
          <motion.div 
            key={img.src}
            className="flex-shrink-0 w-[75vw] md:w-[45vw] lg:w-[35vw] aspect-[3/2] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   PROZESS — Horizontal Scroll Reveal
   ═══════════════════════════════════════════════════════════ */
const steps = [
  { 
    num: '01', 
    title: 'Gespräch', 
    desc: 'Du erzählst. Wir hören zu, stellen die richtigen Fragen und geben dir eine erste Einschätzung — ehrlich, unverbindlich, auf den Punkt.',
    detail: 'Kein Verkaufsgespräch, sondern eine fachliche Einordnung deiner Vision.'
  },
  { 
    num: '02', 
    title: 'Visualisierung', 
    desc: 'Du siehst deinen Raum in 3D, mit echten Materialien. Dazu ein transparenter Pauschalpreis. Keine Überraschungen, keine Nachträge.',
    detail: 'Wir machen deine Vision greifbar, bevor der erste Stein liegt.'
  },
  { 
    num: '03', 
    title: 'Umsetzung', 
    desc: 'Unsere Meister arbeiten bei dir — saubere Baustelle, klare Zeitpläne, eigene Leute. Jeden Tag.',
    detail: 'Handwerkliche Präzision ohne Kompromisse und ohne Subunternehmer.'
  },
  { 
    num: '04', 
    title: 'Ergebnis', 
    desc: 'Ein Raum, der genau so aussieht wie die Visualisierung. Oder besser.',
    detail: 'Die Qualität, die man nicht nur sieht, sondern jeden Tag spürt.'
  },
]

function Prozess() {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  })

  // We have 4 steps + 1 CTA card. 
  // To scroll through all of them, we need a larger negative X value.
  // -80% is usually a good starting point for 5 large cards.
  const x = useTransform(scrollYProgress, [0, 0.95], ['0%', '-82%'])

  return (
    <section ref={targetRef} className="relative h-[500vh] bg-warm-bg">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="relative flex flex-col w-full">
          {/* Header Area */}
          <div className="px-6 md:px-12 lg:px-20 mb-16">
            <TextReveal>
              <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">Der Weg</p>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2 className="font-sora font-extralight text-[clamp(2rem,4vw,3.2rem)] text-warm-text leading-tight tracking-[-0.02em] max-w-2xl">
                Vier Schritte.<br />Kein Rätselraten.
              </h2>
            </TextReveal>
          </div>

          {/* Horizontal Track - Added more bottom padding to avoid overlap */}
          <div className="pb-24">
            <motion.div style={{ x }} className="flex gap-8 px-6 md:px-12 lg:px-20">
              {steps.map((step, i) => (
                <div key={step.num} className="relative flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw]">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white/40 backdrop-blur-sm border border-warm-anthrazit/5 p-8 md:p-12 lg:p-16 rounded-2xl h-full flex flex-col justify-between group hover:bg-white/60 transition-colors duration-700"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <div className="flex items-baseline gap-4 mb-8">
                        <span className="font-sora font-extralight text-6xl lg:text-8xl text-warm-stein/20 group-hover:text-warm-stein/40 transition-colors duration-700">
                          {step.num}
                        </span>
                        <h3 className="font-sora font-light text-3xl lg:text-4xl text-warm-text tracking-tight">
                          {step.title}
                        </h3>
                      </div>
                      <p className="font-dm text-lg lg:text-xl text-warm-text/80 leading-relaxed mb-6">
                        {step.desc}
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="pt-8 border-t border-warm-anthrazit/10"
                    >
                      <p className="font-dm text-sm text-warm-mittel uppercase tracking-widest mb-2">Details</p>
                      <p className="font-dm text-base text-warm-mittel leading-relaxed">
                        {step.detail}
                      </p>
                    </motion.div>

                    {/* Decorative element */}
                    <div className="absolute top-12 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <svg className="w-12 h-12 text-warm-stein/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </motion.div>
                </div>
              ))}
              
              {/* Final CTA Card */}
              <div className="flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] pr-20">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="bg-dark-bg p-8 md:p-12 lg:p-16 rounded-2xl h-full flex flex-col justify-center items-center text-center"
                >
                  <h3 className="font-sora font-extralight text-3xl lg:text-5xl text-inv-light mb-8 leading-tight">
                    Bereit für deinen<br />neuen Raum?
                  </h3>
                  <MagneticLink
                    to="/kontakt"
                    className="px-10 py-5 bg-warm-bg text-warm-text font-dm text-sm font-semibold tracking-widest uppercase hover:bg-white transition-colors duration-300 rounded-none"
                  >
                    Projekt starten
                  </MagneticLink>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Progress Bar - Positioned clearly below the cards */}
          <div className="absolute bottom-8 left-6 md:left-12 lg:left-20 right-6 md:right-12 lg:right-20 h-[2px] bg-warm-anthrazit/5">
            <motion.div 
              className="h-full bg-warm-stein origin-left"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SHOWROOM CTA
   ═══════════════════════════════════════════════════════════ */
function Showroom() {
  return (
    <section id="showroom" className="relative min-h-[70vh] flex items-center overflow-hidden">
      <motion.div 
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src="/images/website-extract/Showroom.jpg"
          alt="StoneTec Fliesenausstellung und Showroom in Bocholt"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[#060606cc]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 w-full">
        <TextReveal>
          <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-tagline mb-4">Showroom Bocholt</p>
        </TextReveal>
        
        <TextReveal delay={0.1}>
          <h2 className="font-sora font-extralight text-[clamp(2.2rem,4.5vw,3.8rem)] text-inv-light leading-tight tracking-[-0.02em] max-w-2xl">
            Komm vorbei.<br />Lass dich inspirieren.
          </h2>
        </TextReveal>
        
        <TextReveal delay={0.2}>
          <address className="font-dm text-inv-muted mt-6 max-w-md leading-relaxed not-italic">
            Hamalandstraße 2, 46399 Bocholt<br />
            Beratung nach Terminvereinbarung
          </address>
        </TextReveal>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <MagneticLink
            to="/kontakt"
            className="group inline-flex items-center gap-3 mt-10 px-8 py-4 bg-warm-bg text-warm-text font-dm text-[0.82rem] tracking-wider uppercase hover:bg-white transition-colors duration-300 overflow-hidden relative"
          >
            <span className="relative z-10">Termin vereinbaren</span>
            <motion.div 
              className="absolute inset-0 bg-white"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </MagneticLink>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   FAQ Accordion
   ═══════════════════════════════════════════════════════════ */
const faqs = [
  {
    q: 'Warum ist eine Terminvereinbarung vorab notwendig?',
    a: 'Damit wir uns vollständig auf dein Projekt konzentrieren können. Feste Termine bedeuten: keine Wartezeiten, optimale Vorbereitung und eine Beratung, die deinem Vorhaben gerecht wird.',
  },
  {
    q: 'Wie finde ich das passende Material und Design?',
    a: 'Gemeinsam. Wir begleiten dich von der ersten Idee bis zur finalen Umsetzung — mit Materialcollagen, Designkonzepten und fotorealistischen 3D-Visualisierungen, die dein Projekt greifbar machen.',
  },
  {
    q: 'Was macht die professionelle Verlegung bei Großformaten so wichtig?',
    a: 'Großformatige Keramik und Premium-Feinsteinzeug erfordern höchste Präzision. Fachgerechte Planung, Spezialwerkzeug und Meister-Erfahrung — ohne das bleibt das Material unter seinem Potenzial.',
  },
  {
    q: 'Was sind großformatige Keramiken?',
    a: 'Keramikplatten ab 120 × 120 cm bis 160 × 320 cm. Sie schaffen nahezu fugenlose Flächen mit beeindruckender Raumwirkung — pflegeleicht, robust und vielseitig einsetzbar.',
  },
  {
    q: 'Wie stelle ich sicher, dass keine unerwarteten Kosten entstehen?',
    a: 'Pauschalpreis. Von der Planung bis zur Ausführung — ein Angebot, ein Preis, keine Nachträge.',
  },
]

function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section className="bg-dark-bg py-24 md:py-36 noise">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <TextReveal>
          <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-tagline mb-4">Häufige Fragen</p>
        </TextReveal>
        
        <TextReveal delay={0.1}>
          <h2 className="font-sora font-extralight text-[clamp(1.8rem,3vw,2.6rem)] text-inv-light leading-tight tracking-[-0.02em] mb-12">
            Was du wissen solltest.
          </h2>
        </TextReveal>

        <motion.div 
          className="space-y-0 border-t border-[#ffffff08]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {faqs.map((f, i) => (
            <motion.div 
              key={i} 
              className="border-b border-[#ffffff08]"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
              }}
            >
              <motion.button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-start justify-between py-6 text-left group cursor-pointer"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.3 }}
              >
                <span className={`font-dm font-medium text-[0.95rem] pr-8 leading-snug transition-colors duration-300 ${open === i ? 'text-inv-light' : 'text-inv-mid group-hover:text-inv-light'}`}>
                  {f.q}
                </span>
                <motion.span 
                  className="mt-1 flex-shrink-0 w-5 h-5 flex items-center justify-center text-inv-muted"
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1.2"/></svg>
                </motion.span>
              </motion.button>
              
              <AnimatePresence>
                {open === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <motion.p 
                      className="font-dm text-[0.88rem] text-inv-muted leading-relaxed pr-12 pb-6"
                      initial={{ y: -10 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      {f.a}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Leistungen />
      <Markenversprechen />
      <Grossformate />
      <Prozess />
      <Showroom />
      <FAQ />
    </>
  )
}
