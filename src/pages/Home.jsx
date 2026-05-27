import { useEffect, useRef, useState } from 'react'

/* ─── Scroll Reveal Hook ──────────────────────────────────── */
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

/* ─── Overline Label ──────────────────────────────────────── */
function Overline({ children, dark = false }) {
  return (
    <p className={`font-dm text-[0.68rem] font-medium tracking-[3px] uppercase mb-4 ${dark ? 'text-warm-tagline' : 'text-warm-mittel'}`}>
      {children}
    </p>
  )
}

/* ═══════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════ */
function Hero() {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <section className="relative h-screen min-h-[700px] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/hero-2.jpg"
          alt="Luxuriöses Badezimmer mit großformatigen Fliesen von StoneTec Bocholt"
          className={`w-full h-full object-cover transition-transform duration-[2s] ease-out ${imgLoaded ? 'scale-100' : 'scale-110'}`}
          onLoad={() => setImgLoaded(true)}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#06060680] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606cc] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 pb-16 md:pb-24 hero-stagger">
        <div className="w-16 h-[1px] bg-warm-stein/50 mb-8" />
        <h1 className="font-sora font-extralight text-[clamp(2.8rem,7vw,5.5rem)] text-inv-light leading-[1.05] tracking-[-0.03em] max-w-4xl">
          Räume,<br />die man spürt.
        </h1>
        <p className="font-dm text-inv-muted text-[clamp(0.95rem,1.5vw,1.15rem)] mt-6 max-w-lg leading-relaxed">
          Meisterhafte Fliesenverlegung, eigene Keramikmanufaktur und 3D&#8209;Visualisierung in Bocholt — alles aus einer Hand.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="/kontakt"
            className="inline-flex items-center gap-3 px-8 py-4 bg-inv-light text-warm-text font-dm text-[0.82rem] font-semibold tracking-wider uppercase hover:bg-white transition-colors duration-300"
          >
            <span>Zeig uns deinen Raum</span>
            <span className="inline-block w-6 h-[1px] bg-warm-text/60" />
          </a>
          <a
            href="#leistungen"
            className="inline-flex items-center gap-3 px-8 py-4 border border-inv-light/40 text-inv-light font-dm text-[0.82rem] font-medium tracking-wider uppercase hover:bg-inv-light/10 hover:border-inv-light/70 transition-all duration-300"
          >
            Leistungen ansehen
          </a>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   INTRO
   ═══════════════════════════════════════════════════════════ */
function Intro() {
  return (
    <section className="bg-warm-bg py-24 md:py-36 noise">
      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <p className="font-sora font-extralight text-[clamp(1.6rem,3vw,2.6rem)] text-warm-text leading-[1.35] tracking-[-0.02em]">
            Zwischen der Vision in deinem Kopf und der Realität in deinem Raum liegen Entscheidungen, die sich endgültig anfühlen. Materialien, die du nicht kennst. Formate, die Präzision verlangen. Und die Frage, wem du das anvertraust.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <p className="font-dm text-[0.95rem] text-warm-mittel mt-8 max-w-2xl leading-relaxed">
            Dafür gibt es uns. Sieben Meister, eigene Fertigung, ein klarer Prozess — und den Anspruch, dass jeder Raum genau so wird, wie du ihn dir vorstellst. Oder besser.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   LEISTUNGEN — Bento Grid
   ═══════════════════════════════════════════════════════════ */
const services = [
  { img: '/images/verlegung.jpg', title: 'Premium Fliesenverlegung', sub: 'Meister-Niveau in jeder Fuge', desc: 'Sieben Fliesenlegermeister. Null Subunternehmer. Großformate, Sanierung, Reparatur — auf höchstem Niveau.', large: true },
  { img: '/images/keramikmanufaktur.jpg', title: 'Keramikmanufaktur', sub: 'Unikate aus eigener Fertigung', desc: 'Maßgefertigte Waschtische, Nischenlösungen, SLAB-Verarbeitung — was es von der Stange nicht gibt, fertigen wir selbst.' },
  { img: '/images/visualisierung.jpg', title: '3D-Planung & Visualisierung', sub: 'Dein Raum, bevor der erste Stein liegt', desc: 'Fotorealistische 3D-CAD-Planung. Du entscheidest erst, wenn du siehst, wie es wird.' },
  { img: '/images/ausstellung.jpg', title: 'Ausstellung & Beratung', sub: 'Sehen. Fühlen. Entscheiden.', desc: 'Haptik, Ästhetik und Meister-Fachwissen — in unserem Showroom in Bocholt werden Ideen zu Lösungen.' },
]

function Leistungen() {
  return (
    <section id="leistungen" className="bg-dark-bg py-24 md:py-36 noise">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <Overline dark>Was wir tun</Overline>
          <h2 className="font-sora font-extralight text-[clamp(2rem,4vw,3.2rem)] text-inv-light leading-tight tracking-[-0.02em] max-w-3xl">
            Fliesenverlegung, Keramikmanufaktur<br />und 3D-Raumplanung aus Bocholt.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 100} className={s.large ? 'md:col-span-2' : ''}>
              <a href="/kontakt" className="group block relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-auto md:h-[420px] cursor-pointer">
                <img
                  src={s.img}
                  alt={`${s.title} — StoneTec Bocholt`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1815ee] via-[#1A181540] to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-stein mb-2">{s.sub}</p>
                  <h3 className="font-sora font-light text-[clamp(1.4rem,2.5vw,2rem)] text-white leading-tight tracking-[-0.01em]">{s.title}</h3>
                  <p className="font-dm text-[0.88rem] text-[#b0aaa5] mt-3 max-w-md leading-relaxed opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">{s.desc}</p>
                </div>
              </a>
            </Reveal>
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
    '7 Fliesenlegermeister unter einem Dach',
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
            <Reveal>
              <Overline>So arbeiten wir</Overline>
              <h2 className="font-sora font-extralight text-[clamp(1.8rem,3vw,2.8rem)] text-warm-text leading-[1.2] tracking-[-0.02em] mb-6">
                Du siehst dein Ergebnis, bevor wir anfangen. Du kennst den Preis, bevor wir anfangen. Und du weißt, wer bei dir arbeitet.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-8 space-y-4">
                {facts.map((p) => (
                  <div key={p} className="flex items-start gap-4">
                    <span className="mt-2 w-1.5 h-1.5 bg-warm-stein rounded-full flex-shrink-0" />
                    <p className="font-dm text-[0.92rem] text-warm-mittel leading-relaxed">{p}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={300}>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <img src="/images/beratung.jpg" alt="StoneTec Beratungsgespräch im Showroom Bocholt" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06060640] to-transparent" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   GROßFORMATE — Horizontal Scroll Gallery
   ═══════════════════════════════════════════════════════════ */
function Grossformate() {
  const images = [
    { src: '/images/grossformat-1.jpg', alt: 'Großformatige Fliesen im Badezimmer — StoneTec Bocholt' },
    { src: '/images/grossformat-2.jpg', alt: 'Großformat Feinsteinzeug Wohnraum' },
    { src: '/images/grossformat-3.jpg', alt: 'Großformatige Keramikplatten Showroom Bocholt' },
    { src: '/images/grossformat-4.jpg', alt: 'Großformat Fliesen Design' },
    { src: '/images/hero-4.jpg', alt: 'Großformat Fliesen minimalistisch' },
  ]

  return (
    <section id="grossformate" className="bg-dark-bg py-24 md:py-36 noise">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-12">
        <Reveal>
          <Overline dark>Großformate bis 320 cm</Overline>
          <h2 className="font-sora font-extralight text-[clamp(2rem,4vw,3.2rem)] text-inv-light leading-tight tracking-[-0.02em]">
            Großformatige Fliesen.<br />Präzise verlegt.
          </h2>
          <p className="font-dm text-[0.95rem] text-inv-muted mt-4 max-w-lg leading-relaxed">
            Keramikplatten bis 160 &times; 320 cm. Nahezu fugenlose Flächen, die Weite schaffen. Die Verarbeitung verlangt Meister-Erfahrung und Spezialwerkzeug — beides bringen wir mit.
          </p>
        </Reveal>
      </div>
      <div className="scroll-gallery">
        {images.map((img, i) => (
          <Reveal key={img.src} delay={i * 80}>
            <div className="w-[75vw] md:w-[45vw] lg:w-[35vw] aspect-[3/2] rounded-xl overflow-hidden">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   PROZESS — Timeline
   ═══════════════════════════════════════════════════════════ */
const steps = [
  { num: '01', title: 'Gespräch', desc: 'Du erzählst. Wir hören zu, stellen die richtigen Fragen und geben dir eine erste Einschätzung — ehrlich, unverbindlich, auf den Punkt.' },
  { num: '02', title: 'Visualisierung', desc: 'Du siehst deinen Raum in 3D, mit echten Materialien. Dazu ein transparenter Pauschalpreis. Keine Überraschungen, keine Nachträge.' },
  { num: '03', title: 'Umsetzung', desc: 'Unsere Meister arbeiten bei dir — saubere Baustelle, klare Zeitpläne, eigene Leute. Jeden Tag.' },
  { num: '04', title: 'Ergebnis', desc: 'Ein Raum, der genau so aussieht wie die Visualisierung. Oder besser.' },
]

function Prozess() {
  return (
    <section id="prozess" className="bg-warm-bg py-24 md:py-36 noise">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <Overline>Der Weg</Overline>
          <h2 className="font-sora font-extralight text-[clamp(2rem,4vw,3.2rem)] text-warm-text leading-tight tracking-[-0.02em] max-w-2xl">
            Vier Schritte.<br />Kein Rätselraten.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px mt-20 bg-warm-anthrazit/10 rounded-2xl overflow-hidden">
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 120}>
              <div className="bg-warm-bg p-8 md:p-10 h-full flex flex-col">
                <span className="font-sora font-extralight text-4xl text-warm-stein/30 mb-6">{s.num}</span>
                <h3 className="font-sora font-light text-xl text-warm-text mb-4 tracking-[-0.01em]">{s.title}</h3>
                <p className="font-dm text-[0.88rem] text-warm-mittel leading-relaxed mt-auto">{s.desc}</p>
              </div>
            </Reveal>
          ))}
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
      <img
        src="/images/showroom.jpg"
        alt="StoneTec Fliesenausstellung und Showroom in Bocholt"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[#060606cc]" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 w-full">
        <Reveal>
          <Overline dark>Showroom Bocholt</Overline>
          <h2 className="font-sora font-extralight text-[clamp(2.2rem,4.5vw,3.8rem)] text-inv-light leading-tight tracking-[-0.02em] max-w-2xl">
            Komm vorbei.<br />Lass dich inspirieren.
          </h2>
          <address className="font-dm text-inv-muted mt-6 max-w-md leading-relaxed not-italic">
            Hamalandstraße 2, 46399 Bocholt<br />
            Beratung nach Terminvereinbarung
          </address>
          <a
            href="/kontakt"
            className="inline-flex items-center gap-3 mt-10 px-8 py-4 bg-warm-bg text-warm-text font-dm text-[0.82rem] tracking-wider uppercase hover:bg-white transition-colors duration-300"
          >
            Termin vereinbaren
          </a>
        </Reveal>
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
        <Reveal>
          <Overline dark>Häufige Fragen</Overline>
          <h2 className="font-sora font-extralight text-[clamp(1.8rem,3vw,2.6rem)] text-inv-light leading-tight tracking-[-0.02em] mb-12">
            Was du wissen solltest.
          </h2>
        </Reveal>

        <div className="space-y-0 border-t border-[#ffffff08]">
          {faqs.map((f, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="border-b border-[#ffffff08]">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-start justify-between py-6 text-left group cursor-pointer"
                >
                  <span className="font-dm font-medium text-[0.95rem] text-inv-mid pr-8 leading-snug group-hover:text-inv-light transition-colors">{f.q}</span>
                  <span className={`mt-1 flex-shrink-0 w-5 h-5 flex items-center justify-center text-inv-muted transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1.2"/></svg>
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-out ${open === i ? 'max-h-96 pb-6' : 'max-h-0'}`}>
                  <p className="font-dm text-[0.88rem] text-inv-muted leading-relaxed pr-12">{f.a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
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
