import { useEffect, useRef } from 'react'
import SEO from '../components/SEO.jsx'

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
  return (
    <div className={`reveal visible ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

const teamGroups = [
  {
    title: 'Büro | Planung & Design',
    members: [
      {
        id: 1,
        name: 'Tim Dunkerbeck',
        role: 'Geschäftsführer | Fliesen-, Platten- und Mosaiklegermeister',
        quote: 'Qualität ist keine Zufälligkeit. Sie ist das Ergebnis bewusster Entscheidungen.',
        image: '/images/website-extract/Tim-Dunkerbeck.jpg',
        expertise: ['Strategie', 'Technik', 'Innovation']
      },
      {
        id: 14,
        name: 'Lisa Niestegge',
        role: 'Geprüfte Bilanzbuchhalterin | Geprüfte Wirtschaftsfachwirtin',
        quote: 'Hinter jedem meisterhaften Projekt steht ein starkes Team.',
        image: '/images/website-extract/Lisa-Niestegge-1.jpg',
        expertise: ['Organisation', 'Finanzen', 'Service']
      },
      {
        id: 13,
        name: 'Laura Hoffmann',
        role: 'Interior Designerin (Bachelor of Arts)',
        quote: 'Struktur ist das Fundament für kreative Freiheit.',
        image: '/images/website-extract/Laura-Hoffmann.jpg',
        expertise: ['Planung', 'Kundenbetreuung', 'Konzept']
      },
      {
        id: 15,
        name: 'Simone Lueg',
        role: 'Beratung & Design',
        quote: 'Wo Beratung und Design zusammentreffen.',
        image: '/images/website-extract/Simone-Lueg.jpg',
        expertise: ['Kundenbetreuung', 'Ausstellung', 'Design']
      },
      {
        id: 16,
        name: 'Lotte Storm',
        role: 'Planung & Design',
        quote: 'Von den Besten lernen, um selbst meisterhaft zu werden.',
        image: '/images/website-extract/Lotte-Storm.jpg',
        expertise: ['Handwerk', 'Lernen', 'Präzision']
      },
      {
        id: 17,
        name: 'Sky',
        role: 'Fliesen-, Platten- & Mosaikaufseher',
        quote: 'Wuff! (Ich habe hier alles im Blick.)',
        image: '/images/website-extract/Sky-Niestegge.jpg',
        expertise: ['Aufsicht', 'Motivation', 'Sicherheit']
      }
    ]
  },
  {
    title: 'Meister & Techniker ihres Faches',
    members: [
      {
        id: 2,
        name: 'Frank Brendjes',
        role: 'Fliesen-, Platten- und Mosaiklegermeister',
        quote: 'Präzision ist keine Fähigkeit. Sie ist eine Haltung.',
        image: '/images/website-extract/Frank-Brendjes.jpg',
        expertise: ['Keramik', 'Naturstein', 'Details']
      },
      {
        id: 4,
        name: 'Mario Weidemann',
        role: 'Fliesen-, Platten- und Mosaiklegermeister',
        quote: 'Der Gehrungsschnitt zeigt, wer wirklich Meister ist.',
        image: '/images/website-extract/Mario-Weidemann.jpg',
        expertise: ['Großformate', 'Sanierung', 'Spezialanfertigungen']
      },
      {
        id: 5,
        name: 'Thorsten Ueffing',
        role: 'Fliesen-, Platten- und Mosaiklegermeister | Staatl. gepr. Hochbau Techniker',
        quote: 'Das Material verdient Respekt. Wir geben ihm den richtigen Rahmen.',
        image: '/images/website-extract/Thorsten-Ueffing.jpg',
        expertise: ['QS', 'Technik', 'Schulung']
      },
      {
        id: 9,
        name: 'Tim Grasedieck',
        role: 'Fliesen-, Platten- und Mosaiklegermeister',
        quote: 'Wir verlegen nicht nur Fliesen, wir gestalten Lebensraum.',
        image: '/images/website-extract/Tim-Grasedieck-1.jpg',
        expertise: ['Keramikmanufaktur', 'Spezialbau', 'Technik']
      },
      {
        id: 18,
        name: 'Noah Pokart',
        role: 'Fliesen-, Platten- und Mosaiklegermeister',
        quote: 'Die nächste Generation des Handwerks.',
        image: '/images/website-extract/Noah-Pokart.jpg',
        expertise: ['Innovation', 'Präzision', 'Technik']
      },
      {
        id: 19,
        name: 'Ben Brendjes',
        role: 'Fliesen-, Platten- und Mosaiklegermeister',
        quote: 'Meisterschaft liegt in der Familie.',
        image: '/images/website-extract/Ben-Brendjes.jpg',
        expertise: ['Handwerk', 'Details', 'Bäder']
      }
    ]
  },
  {
    title: 'Verlegung',
    members: [
      {
        id: 3,
        name: 'Matthias Krabbe',
        role: 'Fliesen-, Platten- und Mosaiklegergeselle',
        quote: 'Jede Fuge erzählt eine Geschichte über die Person, die sie gesetzt hat.',
        image: '/images/website-extract/Matthias-Krabbe.jpg',
        expertise: ['Großformate', 'Präzision', 'Handwerk']
      },
      {
        id: 11,
        name: 'Marcel Demming',
        role: 'Fliesen-, Platten- und Mosaiklegergeselle',
        quote: 'Handwerk ist Leidenschaft, die man in jedem Detail sieht.',
        image: '/images/website-extract/Marcel-Demming.jpg',
        expertise: ['Bäder', 'Bodenbeläge', 'Wandbeläge']
      },
      {
        id: 20,
        name: 'Felix Terlinden',
        role: 'Fliesen-, Platten- und Mosaiklegergeselle',
        quote: 'Präzision bis ins letzte Detail.',
        image: '/images/website-extract/Felix-Terlinden.jpg',
        expertise: ['Verlegung', 'Technik', 'Sauberkeit']
      },
      {
        id: 6,
        name: 'Lars Brodzinski',
        role: 'Fliesen-, Platten- und Mosaiklegergeselle',
        quote: 'Ein guter Raum fühlt sich an wie nach Hause kommen.',
        image: '/images/website-extract/Lars-Brodzinski.jpg',
        expertise: ['Bäder', 'Wand- und Bodenbeläge']
      },
      {
        id: 7,
        name: 'Mujo Pobric',
        role: 'Allrounder Verlegung',
        quote: 'Handwerk lebt von der Überzeugung, dass es anders nicht geht.',
        image: '/images/website-extract/Mujo-Pobric.jpg',
        expertise: ['Balkone', 'Terrassen', 'Handwerk']
      },
      {
        id: 8,
        name: 'Fabian Schmidt',
        role: 'Fliesen-, Platten- und Mosaiklegergeselle',
        quote: 'Echte Qualität entsteht dort, wo man nicht mehr weglassen kann.',
        image: '/images/website-extract/Fabian-Schmidt.jpg',
        expertise: ['Handwerk', 'Großformate', 'Details']
      },
      {
        id: 10,
        name: 'Tim Lintfert',
        role: 'Fliesen-, Platten- und Mosaiklegergeselle',
        quote: 'Perfektion ist das Ziel, Exzellenz der Standard.',
        image: '/images/website-extract/Tim-Lintfert.jpg',
        expertise: ['Sanierung', 'Keramik', 'Großformate']
      }
    ]
  },
  {
    title: 'Unser Universalgenie',
    members: [
      {
        id: 21,
        name: 'Stephan Wollny',
        role: 'Universalgenie',
        quote: 'Es gibt kein Problem, das man nicht lösen kann.',
        image: '/images/website-extract/Stephan-Wollny.jpg',
        expertise: ['Allrounder', 'Technik', 'Lösungen']
      },
      {
        id: 12,
        name: 'Samuel Nordmann',
        role: 'Universalgenie',
        quote: 'Ein Meisterstück ist die Summe aus Erfahrung und Hingabe.',
        image: '/images/website-extract/Samuel-Nordmann-1.jpg',
        expertise: ['Allrounder', 'Technik', 'Lösungen']
      }
    ]
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
    <div className="bg-warm-bg min-h-screen pt-48 pb-24">
      <SEO 
        title="Das Team — Sieben Meister für dein Projekt"
        description="Lerne das Team hinter stonetec Bocholt kennen. Sieben Fliesenlegermeister, Interior Designer und Spezialisten für dein Bauvorhaben."
      />
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
              <p className="font-sora font-extralight text-4xl text-warm-text mb-1">180+</p>
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

      {/* Team Groups */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-24 space-y-24">
        {teamGroups.map((group, groupIndex) => (
          <div key={group.title}>
            <Reveal delay={groupIndex * 100}>
              <h2 className="font-sora font-extralight text-2xl md:text-3xl text-warm-text tracking-[-0.01em] mb-12 border-l-2 border-warm-stein pl-6">
                {group.title}
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {group.members.map((member, index) => (
                <Reveal key={member.id} delay={index * 0.1}>
                  <div className="group">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-dark-bg">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060606cc] via-[#06060640] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Quote Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                        <blockquote className="font-dm text-[0.95rem] text-white italic leading-relaxed border-l-2 border-warm-stein pl-4">
                          "{member.quote}"
                        </blockquote>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-sora font-light text-lg text-warm-text tracking-[-0.01em]">
                          {member.name}
                        </h3>
                        <p className="font-dm text-[0.8rem] text-warm-mittel">{member.role}</p>
                      </div>
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
        ))}
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
            <Reveal key={value.title} delay={index * 0.1}>
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
          <div className="bg-dark-bg rounded-xl p-8 md:p-12 text-center">
            <h2 className="font-sora font-extralight text-2xl md:text-3xl text-inv-light tracking-[-0.01em] mb-4">
              Du bist Meister und suchst neue Herausforderungen?
            </h2>
            <p className="font-dm text-[0.9rem] text-inv-muted max-w-xl mx-auto mb-8 leading-relaxed">
              Wir suchen keine Arbeitskräfte. Wir suchen Menschen, die ihren Beruf verstehen 
              und jeden Tag beweisen, warum sie Meister sind.
            </p>
            <a
              href="mailto:fliesen@stonetec-bocholt.de?subject=Bewerbung Fliesenlegermeister"
              className="inline-flex items-center gap-3 px-8 py-4 bg-warm-bg text-warm-text font-dm text-[0.82rem] font-semibold tracking-wider uppercase hover:bg-white transition-colors duration-300 rounded-none"
            >
              Bewirb dich bei uns
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
