import SEO from '../components/SEO.jsx'

const linkCls = 'underline underline-offset-2 hover:text-warm-mittel transition-colors'

function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-sora font-light text-lg text-warm-text tracking-[-0.01em] mb-3">{title}</h2>
      <div className="font-dm text-[0.95rem] text-warm-text/80 leading-relaxed">{children}</div>
    </section>
  )
}

export default function Impressum() {
  return (
    <div className="bg-warm-bg min-h-screen pt-48 pb-24">
      <SEO
        title="Impressum"
        description="Impressum und Anbieterkennzeichnung der StoneTec GmbH, Bocholt."
      />
      <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-20">
        <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
          Rechtliches
        </p>
        <h1 className="font-sora font-extralight text-[clamp(2.5rem,5vw,4rem)] text-warm-text leading-tight tracking-[-0.02em] mb-12">
          Impressum
        </h1>

        <div className="space-y-10">
          <Section title="Angaben gemäß § 5 DDG">
            <p>
              StoneTec GmbH<br />
              Hamalandstraße 2<br />
              46399 Bocholt<br />
              Deutschland
            </p>
          </Section>

          <Section title="Vertreten durch">
            <p>Geschäftsführer: Tim Dunkerbeck</p>
          </Section>

          <Section title="Kontakt">
            <p>
              Telefon: <a href="tel:+4928719912480" className={linkCls}>+49 (0) 2871 99 12 480</a><br />
              E-Mail: <a href="mailto:fliesen@stonetec-bocholt.de" className={linkCls}>fliesen@stonetec-bocholt.de</a><br />
              Website: <a href="https://www.stonetec-bocholt.de" className={linkCls}>www.stonetec-bocholt.de</a>
            </p>
          </Section>

          <Section title="Registereintrag">
            <p>
              Eintragung im Handelsregister.<br />
              Registergericht: Amtsgericht Coesfeld<br />
              Registernummer: HRB 14999
            </p>
          </Section>

          <Section title="Umsatzsteuer-ID">
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
              DE 815494572
            </p>
          </Section>

          <Section title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
            <p>
              Tim Dunkerbeck<br />
              Hamalandstraße 2<br />
              46399 Bocholt
            </p>
          </Section>

          <Section title="Verbraucherstreitbeilegung / Universalschlichtungsstelle">
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </Section>
        </div>
      </div>
    </div>
  )
}
