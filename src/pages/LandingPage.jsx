import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../components/SEO.jsx'
import AnfrageWizard from '../components/anfrage/AnfrageWizard.jsx'
import AuswahlVorschau from '../components/anfrage/AuswahlVorschau.jsx'
import ProjektGalerie from '../components/landing/ProjektGalerie.jsx'
import ProzessSchritte from '../components/landing/ProzessSchritte.jsx'
import KundenStimmen from '../components/landing/KundenStimmen.jsx'
import FaqBlock from '../components/landing/FaqBlock.jsx'
import StickyCta from '../components/landing/StickyCta.jsx'

// Bad-Projekte aus /projekte (echte Referenzen, keine Stockfotos)
const badGallery = [
  { src: '/images/projekte/Van_Gessel/stonetec-projekt-van_gessel-1.jpg', title: 'Privates Bad' },
  { src: '/images/projekte/Derksen/stonetec-projekt-derksen-1.jpg', title: 'Natürliches Bad' },
  { src: '/images/projekte/Weidemann/stonetec-projekt-weidemann-1.jpg', title: 'Exklusives Bad' },
  { src: '/images/projekte/Klump/stonetec-projekt-klump-1.jpg', title: 'Stilvolles Badkonzept' },
  { src: '/images/projekte/Moritz/stonetec-projekt-moritz-1.jpg', title: 'Harmonisches Bad' },
  { src: '/images/projekte/Kempkes_&_Storm/stonetec-projekt-kempkes__storm-1.jpg', title: 'Modernes Retro-Bad' },
]

const badFaq = [
  {
    frage: 'Was kostet eine Badsanierung?',
    antwort: 'Das hängt von Größe, Ausstattung und Aufwand ab — seriös lässt sich das erst nach einem Blick auf dein Bad sagen. Deshalb bekommst du nach Erstberatung und 3D-Planung ein Festpreis-Angebot: ein Preis, keine versteckten Kosten, Festpreis-Garantie.',
  },
  {
    frage: 'Wie lange dauert die Sanierung?',
    antwort: 'Je nach Umfang unterschiedlich — nach der Planung bekommst du einen verbindlichen Zeitplan, und daran halten wir uns. Ein Team koordiniert alle Schritte, du musst nichts organisieren.',
  },
  {
    frage: 'Muss ich mich um andere Gewerke kümmern?',
    antwort: 'Nein. Alles aus einer Hand heißt bei uns: ein Ansprechpartner, keine Subunternehmer, keine Koordination zwischen verschiedenen Firmen.',
  },
  {
    frage: 'Wie funktioniert die 3D-Badplanung?',
    antwort: 'Wir erstellen ein fotorealistisches Modell deines Bads, in dem du Materialien, Formate und Verlegemuster virtuell ausprobierst. Du entscheidest erst, wenn du siehst, wie es wird.',
  },
  {
    frage: 'In welcher Region seid ihr unterwegs?',
    antwort: 'Unser Zuhause ist Bocholt — wir arbeiten am gesamten Niederrhein und im Westmünsterland, vom Kreis Borken über Wesel und Duisburg bis Düsseldorf.',
  },
]

const landingPages = {
  'fliesenleger-bocholt': {
    title: 'Fliesenleger Bocholt — Meisterhafte Verlegung',
    description: 'Du suchst einen erstklassigen Fliesenleger in Bocholt? stonetec bietet meisterhafte Verlegung, Großformate und individuelle Beratung für dein Projekt.',
    heroTitle: 'Dein Meister-Fliesenleger in Bocholt.',
    heroSubtitle: 'Präzision, Leidenschaft und sieben Meister unter einem Dach. Wir machen aus Fliesen Räume, die man spürt.',
    heroImage: '/images/website-extract/Verlegung-2.jpg',
    contentImage: '/images/projekte/Krasemann/stonetec-projekt-krasemann-1.jpg',
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
    heroTitle: 'Badsanierung vom Meisterbetrieb. Ehrlich & meisterhaft.',
    heroSubtitle: 'Vom ersten Entwurf bis zur letzten Fuge — von Bocholt über den Niederrhein bis Düsseldorf. Wir koordinieren dein Projekt und garantieren ein Ergebnis auf Meister-Niveau.',
    heroImage: '/images/website-extract/Harmonie-im-Bad-1.jpg',
    contentImage: '/images/projekte/Van_Gessel/stonetec-projekt-van_gessel-1.jpg',
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
    ],
    gallery: badGallery,
    faq: badFaq
  },
  'grossformatfliesen-verlegen': {
    title: 'Großformatfliesen verlegen — Präzision bis 320 cm',
    description: 'Großformatfliesen verlangen Meister-Erfahrung. stonetec ist dein Spezialist für XXL-Fliesen und nahezu fugenlose Flächen.',
    heroTitle: 'Großformate. Keine Kompromisse.',
    heroSubtitle: 'Keramikplatten bis 160 x 320 cm erfordern Spezialwerkzeug und jahrelange Erfahrung. Wir bringen beides mit.',
    heroImage: '/images/slider-grossformate/stonetec-grossformat-1.jpg',
    contentImage: '/images/slider-grossformate/stonetec-grossformat-2.jpg',
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
    heroImage: '/images/website-extract/KERAMIKMANUFAKTUR.jpg',
    contentImage: '/images/Keramik-Manufaktur/IMG_5118-web.webp',
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
  },
  '3d-badplanung-bocholt': {
    title: '3D-Badplanung Bocholt — Dein Bad vorab erleben',
    description: 'Erlebe dein neues Badezimmer in 3D, bevor der erste Stein liegt. stonetec bietet fotorealistische Planung und Virtual Reality in Bocholt.',
    heroTitle: '3D-Planung. Deine Vision wird greifbar.',
    heroSubtitle: 'Kein Rätselraten mehr. Wir visualisieren dein Projekt mit echten Materialien und Lichtstimmungen — für maximale Entscheidungssicherheit.',
    heroImage: '/images/website-extract/Raumgefuehl-8-2-scaled-1.jpg',
    contentImage: '/images/website-extract/Raumgefuehl-4-3.jpg',
    content: (
      <>
        <p>
          Die größte Herausforderung bei einer Sanierung oder Neugestaltung ist die Vorstellungskraft. Wie wirken die großformatigen Fliesen im Raum? Passt die Fugenfarbe zum Waschtisch? Wie verändert das Licht die Atmosphäre?
        </p>
        <p>
          Mit unserer professionellen 3D-CAD-Planung nehmen wir die Unsicherheit aus dem Prozess. Wir erstellen ein fotorealistisches Modell deines Raumes, in dem du verschiedene Materialien, Formate und Verlegemuster virtuell ausprobieren kannst. So triffst du Entscheidungen, die sich auch Jahre später noch richtig anfühlen.
        </p>
      </>
    ),
    features: [
      'Fotorealistische Renderings',
      'Echte Materialtexturen',
      'Virtual Reality Erlebnis',
      'Zentimetergenaue Planung'
    ],
    gallery: badGallery,
    faq: badFaq
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

  // FAQPage-Schema für Seiten mit FAQ-Block (Rich Results / AI Overviews).
  const faqJsonLd = page.faq
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faq.map((f) => ({
          '@type': 'Question',
          name: f.frage,
          acceptedAnswer: { '@type': 'Answer', text: f.antwort },
        })),
      }
    : undefined

  return (
    <div className="bg-warm-bg min-h-screen">
      <SEO title={page.title} description={page.description} jsonLd={faqJsonLd} />

      {/* Hero */}
      <section className="relative min-h-[70vh] py-28 md:py-36 flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            src={page.heroImage} 
            alt={page.heroTitle}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#06060640] to-transparent" />
        </div>

        <div className="relative z-10 w-full px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-inv-muted mb-4">
                Expertise & Handwerk
              </p>
              <h1 className="font-sora font-extralight text-[clamp(2.5rem,6vw,5rem)] text-inv-light leading-[1.1] tracking-[-0.03em] max-w-4xl mb-8">
                {page.heroTitle}
              </h1>
              <p className="font-dm text-xl text-inv-muted max-w-2xl leading-relaxed">
                {page.heroSubtitle}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <a
                  href="#anfrage"
                  className="px-8 py-4 bg-warm-bg text-warm-text font-dm text-[0.82rem] font-semibold tracking-wider uppercase hover:bg-white transition-colors duration-300"
                >
                  Kostenlose Erstberatung
                </a>
                <a
                  href="tel:+4928719912480"
                  className="px-8 py-4 border border-inv-muted/40 text-inv-light font-dm text-[0.82rem] font-semibold tracking-wider uppercase hover:border-inv-light transition-colors duration-300"
                >
                  Jetzt anrufen
                </a>
              </div>
              <p className="mt-6 font-dm text-[0.8rem] tracking-wide text-inv-muted">
                <span className="text-warm-stein">★</span> 5,0 bei Google (31 Rezensionen) &middot; 7 Fliesenlegermeister &middot; Festpreis-Garantie
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-white/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-8">
            <Reveal>
              <div className="font-dm text-lg text-warm-mittel leading-relaxed space-y-6">
                {page.content}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl mt-12">
                <img 
                  src={page.contentImage} 
                  alt={page.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </Reveal>
          </div>
          
          <div className="lg:col-span-5">
            <Reveal delay={0.3}>
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
                <div className="mt-12 space-y-4">
                  <a
                    href="#anfrage"
                    className="block w-full py-4 bg-warm-bg text-warm-text text-center font-dm text-[0.82rem] font-semibold tracking-wider uppercase hover:bg-white transition-colors duration-300"
                  >
                    Jetzt anfragen
                  </a>
                  <a
                    href="tel:+4928719912480"
                    className="block w-full py-4 border border-inv-muted/40 text-inv-light text-center font-dm text-[0.82rem] font-semibold tracking-wider uppercase hover:border-inv-light transition-colors duration-300"
                  >
                    +49 (0) 2871 99 12 480
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Projekt-Galerie — visueller Beweis vor der Anfrage */}
      {page.gallery && (
        <section className="py-24 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <ProjektGalerie items={page.gallery} />
            </Reveal>
          </div>
        </section>
      )}

      {/* Prozess — nimmt die Angst vor der Baustelle */}
      {page.gallery && (
        <section className="py-24 px-6 md:px-12 lg:px-20 bg-dark-bg">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <ProzessSchritte />
            </Reveal>
          </div>
        </section>
      )}

      {/* Kundenstimmen — echte Google-Rezensionen */}
      {page.gallery && (
        <section className="py-24 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <KundenStimmen />
            </Reveal>
          </div>
        </section>
      )}

      {/* FAQ — Einwandbehandlung */}
      {page.faq && (
        <section className="py-24 px-6 md:px-12 lg:px-20 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <FaqBlock items={page.faq} />
            </Reveal>
          </div>
        </section>
      )}

      {/* Anfrage Section — Formular direkt auf der Seite, kein Umweg über /kontakt */}
      <section id="anfrage" className="py-24 px-6 md:px-12 lg:px-20 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="mb-6">
              <h2 className="font-sora font-extralight text-[clamp(1.9rem,3.2vw,2.8rem)] text-warm-text tracking-[-0.02em] leading-[1.05]">
                Jetzt unverbindlich anfragen
              </h2>
              <p className="font-dm text-[0.95rem] text-warm-mittel mt-3 max-w-xl leading-relaxed">
                In wenigen Schritten — wir melden uns danach telefonisch bei dir.
                Oder ruf direkt an:{' '}
                <a href="tel:+4928719912480" className="whitespace-nowrap text-warm-text underline underline-offset-4 hover:text-warm-anthrazit transition-colors">
                  +49 (0) 2871 99 12 480
                </a>
              </p>
            </div>
            <AuswahlVorschau />
            <AnfrageWizard />
          </Reveal>
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
              <a
                href="#anfrage"
                className="px-10 py-5 bg-dark-bg text-inv-light font-dm text-sm font-semibold tracking-widest uppercase hover:bg-black transition-all duration-500"
              >
                Termin vereinbaren
              </a>
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

      <StickyCta />
    </div>
  )
}
