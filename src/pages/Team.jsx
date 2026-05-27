import { useEffect, useRef } from 'react'

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

const teamMembers = [
  {
    id: 1,
    name: 'Tim Dunkerbeck',
    role: 'Geschäftsführung',
    quote: 'Qualität ist keine Zufälligkeit. Sie ist das Ergebnis bewusster Entscheidungen.',
    experience: '25+ Jahre',
    expertise: ['Strategie', 'Manufaktur', 'Großformate'],
    image: '/images/team-tim.jpg'
  },
  {
    id: 2,
    name: 'Markus Weber',
    role: 'Leitender Fliesenlegermeister',
    quote: 'Der Gehrungsschnitt zeigt, wer wirklich Meister ist.',
    experience: '20 Jahre',
    expertise: ['Großformate', 'Sanierung', 'Spezialanfertigungen'],
    image: '/images/team-markus.jpg'
  },
  {
    id: 3,
    name: 'Stefan Klein',
    role: 'Fliesenlegermeister',
    quote: 'Jede Fuge erzählt eine Geschichte über die Person, die sie gesetzt hat.',
    experience: '18 Jahre',
    expertise: ['Bäder', 'Bodenbeläge', 'Wandgestaltung'],
    image: '/images/team-stefan.jpg'
  },
  {
    id: 4,
    name: 'Andreas Müller',
    role: 'Fliesenlegermeister',
    quote: 'Präzision ist keine Fähigkeit. Sie ist eine Haltung.',
    experience: '15 Jahre',
    expertise: ['Keramik', 'Naturstein', 'Details'],
    image: '/images/team-andreas.jpg'
  },
  {
    id: 5,
    name: 'Michael Schäfer',
    role: 'Fliesenlegermeister',
    quote: 'Das Material verdient Respekt. Wir geben ihm den richtigen Rahmen.',
    experience: '12 Jahre',
    expertise: ['Großformate', 'Technik', 'Schulung'],
    image: '/images/team-michael.jpg'
  },
  {
    id: 6,
    name: 'Thomas Bauer',
    role: 'Fliesenlegermeister',
    quote: 'Ein guter Raum fühlt sich an wie nach Hause kommen.',
    experience: '10 Jahre',
    expertise: ['Visualisierung', 'Kundenberatung', 'Planung'],
    image: '/images/team-thomas.jpg'
  },
  {
    id: 7,
    name: 'Jürgen Hoffmann',
    role: 'Fliesenlegermeister',
    quote: 'Handwerk lebt von der Überzeugung, dass es anders nicht geht.',
    experience: '8 Jahre',
    expertise: ['Manufaktur', 'Sonderlösungen', 'Innovation'],
    image: '/images/team-juergen.jpg'
  }
]

const values = [
  {
    title: 'Meisterhand',
    description: 'Kein Subunternehmer. Nur eigene Meister. Sieben Fliesenlegermeister unter einem Dach.'
  },
  {
    title: 'Präzision',
    description: 'Der Gehrungsschnitt, den man nicht sieht. Die Fuge, die perfekt sitzt.'
  },
  {
    title: 'Transparenz',
    description: 'Pauschalpreise, keine Nachträge. Du kennst den Preis, bevor wir anfangen.'
  },
  {
    title: 'Verantwortung',
    description: 'Von der ersten Idee bis zur letzten Fuge. Ein Ansprechpartner, ein Ergebnis.'
  }
]

export default function Team() {
  return (
    <div className="bg-warm-bg min-h-screen pt-32 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-16">
        <Reveal>
          <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
            Das Team
          </p>
          <h1 className="font-sora font-extralight text-[clamp(2.5rem,5vw,4rem)] text-warm-text leading-tight tracking-[-0.02em] max-w-3xl mb-6">
            Auf jeder Baustelle steht ein Meister.
          </h1>
          <p className="font-dm text-[0.95rem] text-warm-mittel max-w-2xl leading-relaxed">
            Sieben Fliesenlegermeister. Ein Unternehmen. Null Subunternehmer. 
            Jeder von uns hat seine Spezialität, alle teilen denselben Anspruch.
          </p>
        </Reveal>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-20">
        <Reveal delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-warm-anthrazit/10">
            <div>
              <p className="font-sora font-extralight text-4xl text-warm-text mb-1">7</p>
              <p className="font-dm text-[0.82rem] text-warm-mittel">Fliesenlegermeister</p>
            </div>
            <div>
              <p className="font-sora font-extralight text-4xl text-warm-text mb-1">108+</p>
              <p className="font-dm text-[0.82rem] text-warm-mittel">Jahre Erfahrung</p>
            </div>
            <div>
              <p className="font-sora font-extralight text-4xl text-warm-text mb-1">0</p>
              <p className="font-dm text-[0.82rem] text-warm-mittel">Subunternehmer</p>
            </div>
            <div>
              <p className="font-sora font-extralight text-4xl text-warm-text mb-1">1</p>
              <p className="font-dm text-[0.82rem] text-warm-mittel">Ansprechpartner</p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Team Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Reveal key={member.id} delay={index * 100}>
              <div className="group">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-dark-bg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06060680] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-sora font-light text-lg text-warm-text tracking-[-0.01em]">
                      {member.name}
                    </h3>
                    <p className="font-dm text-[0.8rem] text-warm-mittel">{member.role}</p>
                  </div>
                  <blockquote className="font-dm text-[0.85rem] text-warm-mittel italic leading-relaxed border-l-2 border-warm-stein pl-4">
                    "{member.quote}"
                  </blockquote>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {member.expertise.map(skill => (
                      <span key={skill} className="px-2.5 py-1 bg-warm-anthrazit/10 font-dm text-[0.72rem] text-warm-mittel">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <h2 className="font-sora font-extralight text-2xl md:text-3xl text-warm-text tracking-[-0.01em] mb-10 text-center">
            Was uns verbindet
          </h2>
        </Reveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Reveal key={value.title} delay={index * 100}>
              <div className="bg-dark-bg rounded-xl p-6 h-full">
                <h3 className="font-sora font-light text-lg text-inv-light tracking-[-0.01em] mb-3">
                  {value.title}
                </h3>
                <p className="font-dm text-[0.85rem] text-inv-muted leading-relaxed">
                  {value.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Recruiting CTA */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-20">
        <Reveal>
          <div className="bg-dark-bg rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-sora font-extralight text-2xl md:text-3xl text-inv-light tracking-[-0.01em] mb-4">
              Du bist Meister und sucht neue Herausforderungen?
            </h2>
            <p className="font-dm text-[0.9rem] text-inv-muted max-w-xl mx-auto mb-8 leading-relaxed">
              Wir suchen keine Arbeitskräfte. Wir suchen Menschen, die ihren Beruf verstehen 
              und jeden Tag beweisen, warum sie Meister sind.
            </p>
            <a
              href="mailto:info@stonetec-bocholt.de?subject=Bewerbung Fliesenlegermeister"
              className="inline-flex items-center gap-3 px-8 py-4 bg-warm-bg text-warm-text font-dm text-[0.82rem] font-semibold tracking-wider uppercase hover:bg-white transition-colors duration-300"
            >
              Bewirb dich bei uns
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
