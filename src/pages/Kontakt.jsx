import { useEffect, useRef, useState } from 'react'

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

export default function Kontakt() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    timeline: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate form submission
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="bg-warm-bg min-h-screen pt-32 pb-24">
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
                  StoneTec GmbH
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
                    <a href="mailto:info@stonetec-bocholt.de" className="hover:text-inv-light transition-colors">
                      info@stonetec-bocholt.de
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
                  Ihr individuelles Konzept verdient Zeit — und die schenken wir Ihnen. 
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
              <div className="bg-dark-bg rounded-xl p-6 md:p-8">
                <h2 className="font-sora font-light text-xl text-inv-light tracking-[-0.01em] mb-6">
                  Termin anfragen
                </h2>

                {submitted ? (
                  <div className="bg-warm-bg/10 rounded-lg p-6 text-center">
                    <svg className="w-12 h-12 text-inv-light mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <h3 className="font-sora font-light text-lg text-inv-light mb-2">
                      Anfrage gesendet
                    </h3>
                    <p className="font-dm text-[0.85rem] text-inv-muted">
                      Wir melden uns innerhalb von 24 Stunden bei dir.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block font-dm text-[0.75rem] text-inv-tagline uppercase tracking-wide mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-inv-light/10 border border-inv-light/20 rounded-lg font-dm text-[0.9rem] text-inv-light placeholder:text-inv-tagline focus:outline-none focus:border-inv-light/40 transition-colors"
                          placeholder="Dein Name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block font-dm text-[0.75rem] text-inv-tagline uppercase tracking-wide mb-2">
                          E-Mail *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-inv-light/10 border border-inv-light/20 rounded-lg font-dm text-[0.9rem] text-inv-light placeholder:text-inv-tagline focus:outline-none focus:border-inv-light/40 transition-colors"
                          placeholder="deine@email.de"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="phone" className="block font-dm text-[0.75rem] text-inv-tagline uppercase tracking-wide mb-2">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-inv-light/10 border border-inv-light/20 rounded-lg font-dm text-[0.9rem] text-inv-light placeholder:text-inv-tagline focus:outline-none focus:border-inv-light/40 transition-colors"
                          placeholder="+49 ..."
                        />
                      </div>
                      <div>
                        <label htmlFor="projectType" className="block font-dm text-[0.75rem] text-inv-tagline uppercase tracking-wide mb-2">
                          Projekttyp
                        </label>
                        <select
                          id="projectType"
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-inv-light/10 border border-inv-light/20 rounded-lg font-dm text-[0.9rem] text-inv-light focus:outline-none focus:border-inv-light/40 transition-colors appearance-none cursor-pointer"
                        >
                          <option value="">Bitte wählen</option>
                          <option value="bad">Badezimmer</option>
                          <option value="kueche">Küche / Wohnraum</option>
                          <option value="gewerbe">Gewerbeprojekt</option>
                          <option value="sanierung">Sanierung / Reparatur</option>
                          <option value="manufaktur">Manufaktur-Anfrage</option>
                          <option value="andere">Andere</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="timeline" className="block font-dm text-[0.75rem] text-inv-tagline uppercase tracking-wide mb-2">
                        Geplanter Zeitraum
                      </label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-inv-light/10 border border-inv-light/20 rounded-lg font-dm text-[0.9rem] text-inv-light focus:outline-none focus:border-inv-light/40 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Bitte wählen</option>
                        <option value="sofort">Sofort</option>
                        <option value="1-3">In 1-3 Monaten</option>
                        <option value="3-6">In 3-6 Monaten</option>
                        <option value="6-12">In 6-12 Monaten</option>
                        <option value="spaeter">Später</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block font-dm text-[0.75rem] text-inv-tagline uppercase tracking-wide mb-2">
                        Deine Nachricht
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-inv-light/10 border border-inv-light/20 rounded-lg font-dm text-[0.9rem] text-inv-light placeholder:text-inv-tagline focus:outline-none focus:border-inv-light/40 transition-colors resize-none"
                        placeholder="Erzähl uns von deinem Projekt, deinen Vorstellungen und was dir wichtig ist..."
                      />
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="privacy"
                        required
                        className="mt-1 w-4 h-4 rounded border-inv-light/20 bg-inv-light/10 text-warm-text focus:ring-0"
                      />
                      <label htmlFor="privacy" className="font-dm text-[0.8rem] text-inv-muted leading-relaxed">
                        Ich stimme der Verarbeitung meiner Daten gemäß der 
                        <a href="/datenschutz" className="text-inv-light hover:underline"> Datenschutzerklärung</a> zu.
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full px-8 py-4 bg-warm-bg text-warm-text font-dm text-[0.85rem] font-semibold tracking-wider uppercase hover:bg-white transition-colors duration-300"
                    >
                      Termin anfragen
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-16">
        <Reveal>
          <div className="bg-dark-bg rounded-xl overflow-hidden aspect-[21/9]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2468.6384717856164!2d6.5978!3d51.8399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8b7c3b7b7b7b7%3A0x0!2zNTHCsDUwJzI0LjAiTiA2wrAzNSc1Mi4wIkU!5e0!3m2!1sde!2sde!4v1600000000000"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="StoneTec Showroom Bocholt"
            />
          </div>
        </Reveal>
      </div>
    </div>
  )
}
