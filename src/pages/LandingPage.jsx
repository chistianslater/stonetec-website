import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../components/SEO.jsx'

const landingPages = {
  'fliesenleger-bocholt': {
    title: 'Fliesenleger Bocholt — Meisterhafte Verlegung',
    description: 'Du suchst einen erstklassigen Fliesenleger in Bocholt? stonetec bietet meisterhafte Verlegung, Großformate und individuelle Beratung für dein Projekt.',
    heroTitle: 'Dein Meister-Fliesenleger in Bocholt.',
    heroSubtitle: 'Präzision, Leidenschaft und sieben Meister unter einem Dach. Wir machen aus Fliesen Räume, die man spürt.',
    content: (
      <>
        <p>
          Wenn du in Bocholt und Umgebung nach einem Fliesenleger suchst, der nicht nur Fliesen klebt, sondern Räume gestaltet, bist du bei stonetec genau richtig. Als Meisterbetrieb mit sieben Fliesenlegermeistern garantieren wir dir höchste handwerkliche Qualität und eine Projektabwicklung ohne Subunternehmer.
        </p>
        <p>
          Ob modernes Badezimmer, großzügiger Wohnbereich oder repräsentative Gewerbefläche — wir bringen die Erfahrung und das Spezialwerkzeug mit, um auch anspruchsvollste Wünsche wie Großformatfliesen bis 320 cm perfekt umzusetzen.
        </p>
      </>
    ),
    features: [
      '7 Fliesenlegermeister',
      'Eigene Keramikmanufaktur',
      '3D-Visualisierung',
      'Pauschalpreis-Garantie'
    ]
  },
  'badsanierung-bocholt': {
    title: 'Badsanierung Bocholt — Alles aus einer Hand',
    description: 'Plane deine Badsanierung in Bocholt mit stonetec. Von der 3D-Planung bis zur meisterhaften Verlegung — wir schaffen dein Traumbad.',
    heroTitle: 'Badsanierung in Bocholt. Ehrlich & meisterhaft.',
    heroSubtitle: 'Vom ersten Entwurf bis zur letzten Fuge. Wir koordinieren dein Projekt und garantieren ein Ergebnis auf Meister-Niveau.',
    content: (
      <>
        <p>
          Eine Badsanierung ist eine Investition in deine Lebensqualität. Bei stonetec in Bocholt verstehen wir das. Deshalb begleiten wir dich durch den gesamten Prozess — ohne Stress und ohne versteckte Kosten.
        </p>
        <p>
          In unserem Showroom in Bocholt zeigen wir dir modernste Materialien und entwickeln gemeinsam mit dir ein Designkonzept, das exakt zu deinem Stil passt. Dank unserer fotorealistischen 3D-Planung siehst du dein neues Bad, bevor wir den ersten Stein bewegen.
        </p>
      </>
    ),
    features: [
      'Komplettbetreuung',
      '3D-Badplanung',
      'Termintreue',
      'Saubere Baustelle'
    ]
  },
  'grossformatfliesen-verlegen': {
    title: 'Großformatfliesen verlegen — Präzision bis 320 cm',
    description: 'Großformatfliesen verlangen Meister-Erfahrung. stonetec ist dein Spezialist für XXL-Fliesen und nahezu fugenlose Flächen.',
    heroTitle: 'Großformate. Keine Kompromisse.',
    heroSubtitle: 'Keramikplatten bis 160 x 320 cm erfordern Spezialwerkzeug und jahrelange Erfahrung. Wir bringen beides mit.',
    content: (
      <>
        <p>
          Großformatige Fliesen schaffen eine unvergleichliche Weite und eine moderne, ruhige Ästhetik. Doch die Verlegung von XXL-Platten verzeiht keine Fehler. Bei stonetec haben wir uns auf die Verarbeitung dieser anspruchsvollen Materialien spezialisiert.
        </p>
        <p>
          Wir verfügen über das notwendige Equipment für den Transport und den Zuschnitt von Platten bis zu einer Größe von 320 cm. Unsere Meister sorgen für eine präzise Fugenführung und ein perfektes Ebenbild — für Flächen, die wie aus einem Guss wirken.
        </p>
      </>
    ),
    features: [
      'XXL-Formate bis 320 cm',
      'Spezialwerkzeug',
      'Nahezu fugenlos',
      'Eigene Manufaktur'
    ]
  },
  'keramikmanufaktur-nrw': {
    title: 'Keramikmanufaktur NRW — Unikate nach Maß',
    description: 'In unserer Keramikmanufaktur fertigen wir Waschtische, Treppen und Sonderlösungen aus hochwertiger Keramik — individuell für dich.',
    heroTitle: 'Keramikmanufaktur. Handarbeit aus Bocholt.',
    heroSubtitle: 'Was es von der Stange nicht gibt, fertigen wir selbst. Maßgeschneiderte Unikate aus Meisterhand.',
    content: (
      <>
        <p>
          In unserer hauseigenen Keramikmanufaktur in Bocholt entstehen Werkstücke, die es so kein zweites Mal gibt. Wir verarbeiten hochwertiges Feinsteinzeug zu maßgefertigten Waschtischen, fugenlosen Treppenstufen, Nischenlösungen und individuellen Design-Objekten.
        </p>
        <p>
          Für Architekten, Interior Designer und anspruchsvolle Privatkunden in ganz NRW sind wir der Partner, wenn es um die technische Umsetzung kreativer Ideen geht. Wir kombinieren modernste Bearbeitungstechniken mit traditioneller Handwerkskunst.
        </p>
      </>
    ),
    features: [
      'Maßgefertigte Waschtische',
      'Fugenlose Treppen',
      'Individuelle Nischen',
      'Echtes Handwerk'
    ]
  }
}

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function LandingPage() {
  const { slug } = useParams()
  const page = landingPages[slug]

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-bg">
        <div className="text-center">
          <h1 className="font-sora font-extralight text-4xl text-warm-text mb-6">Seite nicht gefunden</h1>
          <Link to="/" className="text-warm-mittel hover:text-warm-text transition-colors">Zurück zur Startseite</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-warm-bg min-h-screen">
      <SEO title={page.title} description={page.description} />
      
      {/* Hero */}
      <section className="pt-48 pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
              Expertise & Handwerk
            </p>
            <h1 className="font-sora font-extralight text-[clamp(2.5rem,6vw,5rem)] text-warm-text leading-[1.1] tracking-[-0.03em] max-w-4xl mb-8">
              {page.heroTitle}
            </h1>
            <p className="font-dm text-xl text-warm-mittel max-w-2xl leading-relaxed">
              {page.heroSubtitle}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-white/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-8 font-dm text-lg text-warm-mittel leading-relaxed">
            <Reveal>
              {page.content}
            </Reveal>
          </div>
          
          <div className="lg:col-span-5">
            <Reveal delay={0.2}>
              <div className="bg-dark-bg rounded-2xl p-10 text-inv-light">
                <h3 className="font-sora font-light text-2xl mb-8">Warum stonetec?</h3>
                <ul className="space-y-6">
                  {page.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-4">
                      <span className="w-1.5 h-1.5 bg-warm-stein rounded-full" />
                      <span className="font-dm text-[1rem] text-inv-muted">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-12">
                  <Link 
                    to="/kontakt"
                    className="block w-full py-4 bg-warm-bg text-warm-text text-center font-dm text-[0.82rem] font-semibold tracking-wider uppercase hover:bg-white transition-colors duration-300"
                  >
                    Jetzt anfragen
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h2 className="font-sora font-extralight text-3xl md:text-5xl text-warm-text mb-8 tracking-tight">
              Bereit für dein Projekt?
            </h2>
            <p className="font-dm text-lg text-warm-mittel mb-12 leading-relaxed">
              Lass uns gemeinsam über deine Ideen sprechen. Ehrlich, kompetent und auf den Punkt. 
              Besuche uns in unserem Showroom in Bocholt oder vereinbare direkt einen Termin.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                to="/kontakt"
                className="px-10 py-5 bg-dark-bg text-inv-light font-dm text-sm font-semibold tracking-widest uppercase hover:bg-black transition-all duration-500"
              >
                Termin vereinbaren
              </Link>
              <Link 
                to="/projekte"
                className="px-10 py-5 border border-warm-anthrazit/20 text-warm-text font-dm text-sm font-semibold tracking-widest uppercase hover:bg-warm-anthrazit/5 transition-all duration-500"
              >
                Projekte ansehen
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
