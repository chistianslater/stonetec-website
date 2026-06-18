import SEO from '../components/SEO.jsx'
import AnfrageWizard from '../components/anfrage/AnfrageWizard.jsx'
import MapEmbed from '../components/MapEmbed.jsx'

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <div className={`reveal visible ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export default function Kontakt() {
  return (
    <div className="bg-warm-bg min-h-screen pt-48 pb-24">
      <SEO 
        title="Kontakt — Dein Termin im Showroom Bocholt"
        description="Plane dein Projekt mit uns. Vereinbare einen persönlichen Beratungstermin in unserem Showroom in Bocholt. Wir freuen uns auf deinen Raum."
      />
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-12">
        <Reveal>
          <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
            Kontakt
          </p>
          <h1 className="font-sora font-extralight text-[clamp(2.5rem,5vw,4rem)] text-warm-text leading-tight tracking-[-0.02em] max-w-3xl mb-6">
            Zeig uns deinen Raum.
          </h1>
          <p className="font-dm text-[0.95rem] text-warm-mittel max-w-2xl leading-relaxed">
            Ob konkrete Anfrage oder erste Idee: Wir nehmen uns Zeit. 
            Deshalb beraten wir ausschließlich nach Terminvereinbarung.
          </p>
        </Reveal>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <Reveal delay={100}>
              <div className="bg-dark-bg rounded-xl p-6">
                <h3 className="font-sora font-light text-lg text-inv-light tracking-[-0.01em] mb-4">
                  stonetec GmbH
                </h3>
                <address className="not-italic space-y-3 font-dm text-[0.9rem] text-inv-mid leading-relaxed">
                  <p>Hamalandstraße 2</p>
                  <p>46399 Bocholt</p>
                  <p className="pt-3">
                    <a href="tel:+4928719912480" className="hover:text-inv-light transition-colors">
                      +49 (0) 2871 99 12 480
                    </a>
                  </p>
                  <p>
                    <a href="mailto:fliesen@stonetec-bocholt.de" className="hover:text-inv-light transition-colors">
                      fliesen@stonetec-bocholt.de
                    </a>
                  </p>
                </address>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="bg-dark-bg rounded-xl p-6">
                <h3 className="font-sora font-light text-lg text-inv-light tracking-[-0.01em] mb-4">
                  Öffnungszeiten
                </h3>
                <p className="font-dm text-[0.85rem] text-inv-muted leading-relaxed mb-3">
                  Beratung nach Terminvereinbarung
                </p>
                <p className="font-dm text-[0.85rem] text-inv-mid leading-relaxed">
                  Dein individuelles Konzept verdient Zeit — und die schenken wir dir. 
                  So garantieren wir volle Aufmerksamkeit und Raum für echte Entscheidungen.
                </p>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="bg-warm-anthrazit/5 rounded-xl p-6 border border-warm-anthrazit/10">
                <h3 className="font-sora font-light text-lg text-warm-text tracking-[-0.01em] mb-3">
                  Direkt zum Showroom
                </h3>
                <p className="font-dm text-[0.85rem] text-warm-mittel leading-relaxed mb-4">
                  In unserem Showroom in Bocholt präsentieren wir ausgewählte Materialien, 
                  Oberflächen und Konzepte — kombiniert zu stimmigen Raumideen.
                </p>
                <a 
                  href="https://maps.google.com/?q=Hamalandstraße+2,+46399+Bocholt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-dm text-[0.82rem] text-warm-text hover:text-warm-anthrazit transition-colors"
                >
                  Route planen
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </Reveal>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Reveal delay={150}>
              <div className="mb-6">
                <h2 className="font-sora font-extralight text-[clamp(1.9rem,3.2vw,2.8rem)] text-warm-text tracking-[-0.02em] leading-[1.05]">
                  Beratungstermin anfragen
                </h2>
                <p className="font-dm text-[0.95rem] text-warm-mittel mt-3 max-w-xl leading-relaxed">
                  In wenigen Schritten und unverbindlich — wir melden uns danach telefonisch bei dir, um alles Weitere zu besprechen.
                </p>
              </div>
              <AnfrageWizard />
            </Reveal>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-16">
        <Reveal>
          <MapEmbed />
        </Reveal>
      </div>
    </div>
  )
}
