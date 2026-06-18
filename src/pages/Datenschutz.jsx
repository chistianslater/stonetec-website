import SEO from '../components/SEO.jsx'

const linkCls = 'underline underline-offset-2 hover:text-warm-mittel transition-colors'

function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-sora font-light text-lg text-warm-text tracking-[-0.01em] mb-3">{title}</h2>
      <div className="font-dm text-[0.95rem] text-warm-text/80 leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

export default function Datenschutz() {
  return (
    <div className="bg-warm-bg min-h-screen pt-48 pb-24">
      <SEO
        title="Datenschutzerklärung"
        description="Informationen zur Verarbeitung personenbezogener Daten auf der Website der StoneTec GmbH."
      />
      <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-20">
        <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
          Rechtliches
        </p>
        <h1 className="font-sora font-extralight text-[clamp(2.5rem,5vw,4rem)] text-warm-text leading-tight tracking-[-0.02em] mb-12">
          Datenschutzerklärung
        </h1>

        <div className="space-y-10">
          <Section title="1. Verantwortlicher">
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            </p>
            <p>
              StoneTec GmbH<br />
              Hamalandstraße 2, 46399 Bocholt, Deutschland<br />
              Telefon: <a href="tel:+4928719912480" className={linkCls}>+49 (0) 2871 99 12 480</a><br />
              E-Mail: <a href="mailto:fliesen@stonetec-bocholt.de" className={linkCls}>fliesen@stonetec-bocholt.de</a>
            </p>
          </Section>

          <Section title="2. Allgemeines zur Datenverarbeitung">
            <p>
              Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung einer
              funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist oder
              Sie eingewilligt haben. Rechtsgrundlagen sind insbesondere Art. 6 Abs. 1 lit. a
              (Einwilligung), lit. b (Vertrag/Anbahnung), lit. f (berechtigtes Interesse) DSGVO.
            </p>
          </Section>

          <Section title="3. Hosting & Server-Logfiles">
            <p>
              Die Website wird bei der Hostinger International Ltd. gehostet. Beim Aufruf der Seite
              erhebt der Server automatisch Informationen in sogenannten Server-Logfiles (z. B.
              IP-Adresse, Datum und Uhrzeit, abgerufene Datei, Browsertyp). Dies ist zur sicheren
              und stabilen Bereitstellung technisch erforderlich (Art. 6 Abs. 1 lit. f DSGVO). Mit
              dem Hosting-Anbieter besteht ein Auftragsverarbeitungsvertrag (Art. 28 DSGVO).
            </p>
          </Section>

          <Section title="4. Cookies & Einwilligung">
            <p>
              Wir setzen technisch notwendige Cookies bzw. vergleichbare Speichertechniken ein, die
              für den Betrieb der Seite erforderlich sind. Ihre Cookie-Entscheidung speichern wir
              lokal in Ihrem Browser. Statistik- und Analyse-Dienste laden wir ausschließlich nach
              Ihrer ausdrücklichen Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Ihre Einwilligung
              können Sie jederzeit über den Link „Cookie-Einstellungen" im Seitenfuß mit Wirkung
              für die Zukunft widerrufen.
            </p>
          </Section>

          <Section title="5. Anfrageformular & CRM (Hero)">
            <p>
              Wenn Sie das Anfrage-/Terminformular nutzen, verarbeiten wir die von Ihnen angegebenen
              Daten (Vor- und Nachname, E-Mail-Adresse, Telefonnummer, Postleitzahl/Ort, Angaben zum
              Vorhaben sowie Ihre Terminpräferenz), um Ihre Anfrage zu bearbeiten und Kontakt
              aufzunehmen (Art. 6 Abs. 1 lit. b und lit. f DSGVO).
            </p>
            <p>
              Zur Bearbeitung werden diese Daten an unser CRM-System „Hero" (HERO Software GmbH,
              Deutschland) übermittelt und dort gespeichert. Mit dem Anbieter besteht ein
              Auftragsverarbeitungsvertrag. Die Daten werden gelöscht, sobald sie für die
              Zweckerreichung nicht mehr erforderlich sind und keine gesetzlichen
              Aufbewahrungsfristen entgegenstehen.
            </p>
          </Section>

          <Section title="6. Google Fonts">
            <p>
              Diese Website nutzt Schriftarten von Google Fonts. Beim Seitenaufruf werden die
              Schriften von Servern der Google Ireland Limited geladen, wobei Ihre IP-Adresse an
              Google übertragen wird (Art. 6 Abs. 1 lit. f DSGVO). Anbieter: Google Ireland Limited,
              Gordon House, Barrow Street, Dublin 4, Irland.
            </p>
          </Section>

          <Section title="7. Google Maps">
            <p>
              Auf der Kontaktseite binden wir Kartenmaterial von Google Maps ein, um unseren
              Standort anzuzeigen. Dabei wird eine Verbindung zu Servern von Google hergestellt und
              Ihre IP-Adresse übertragen. Anbieter: Google Ireland Limited, Dublin, Irland.
            </p>
          </Section>

          <Section title="8. Bewertungs-Widget (Schau & Horch / Cockpit)">
            <p>
              Wir binden ein Bewertungs-Widget („Cockpit") ein, das von der Agentur Schau & Horch
              bereitgestellt und von deren Servern geladen wird. Dabei können technische
              Verbindungsdaten (z. B. IP-Adresse) verarbeitet werden, um das Widget auszuliefern
              (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
          </Section>

          <Section title="9. Statistik & Reichweitenmessung (nur mit Einwilligung)">
            <p>
              Nach Ihrer Einwilligung setzen wir Google Analytics (Google Ireland Limited) und
              Microsoft Clarity (Microsoft Ireland Operations Ltd.) ein, um die Nutzung unserer
              Website auszuwerten und zu verbessern (Art. 6 Abs. 1 lit. a DSGVO). Dabei können
              Cookies gesetzt und Nutzungsdaten (z. B. gekürzte IP-Adresse, Seitenaufrufe,
              Interaktionen) verarbeitet werden. Ohne Ihre Einwilligung werden diese Dienste nicht
              geladen. Sie können Ihre Einwilligung jederzeit widerrufen.
            </p>
          </Section>

          <Section title="10. Ihre Rechte">
            <p>
              Sie haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung
              (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20)
              sowie Widerspruch (Art. 21 DSGVO). Eine erteilte Einwilligung können Sie jederzeit mit
              Wirkung für die Zukunft widerrufen.
            </p>
            <p>
              Zudem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren,
              etwa bei der Landesbeauftragten für Datenschutz und Informationsfreiheit
              Nordrhein-Westfalen.
            </p>
          </Section>

          <Section title="11. SSL-/TLS-Verschlüsselung">
            <p>
              Diese Seite nutzt aus Sicherheitsgründen eine SSL-/TLS-Verschlüsselung. Eine
              verschlüsselte Verbindung erkennen Sie am „https://" in der Adresszeile Ihres
              Browsers.
            </p>
          </Section>

          <Section title="12. Aktualität und Änderung dieser Erklärung">
            <p>
              Diese Datenschutzerklärung wird angepasst, sobald sich die Datenverarbeitung ändert
              (z. B. bei Einführung neuer Dienste). Es gilt jeweils die hier veröffentlichte
              aktuelle Fassung.
            </p>
          </Section>
        </div>
      </div>
    </div>
  )
}
