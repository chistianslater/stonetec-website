import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

/* ─── Reveal Component ───────────────────────────────────────── */
function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Magazine Data ──────────────────────────────────────────── */
export const articles = [
  {
    id: 'grossformatfliesen-verlegen-in-bocholt',
    title: 'Großformatfliesen verlegen in Bocholt – Präzision, Technik und Meisterkompetenz',
    excerpt: 'Warum XXL-Fliesen mehr als nur ein Trend sind und welche technischen Herausforderungen sie an das Handwerk stellen.',
    category: 'Fachwissen',
    readTime: '10 Min.',
    date: 'Februar 2026',
    image: '/images/website-extract/Raumgefuehl-4-3.jpg',
    featured: true,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Sie möchten Großformatfliesen verlegen in Bocholt lassen und legen Wert auf ein modernes, nahezu fugenloses Design? Dann ist die Wahl des richtigen Fachbetriebs entscheidend. Denn während Großformatfliesen optisch für Eleganz und Großzügigkeit stehen, gehören sie technisch zu den anspruchsvollsten Disziplinen im Fliesenhandwerk.</p>
          <p>Das Großformatfliesen verlegen in Bocholt erfordert präzise Planung, absolut ebene Untergründe, spezielles Werkzeug und fundiertes Fachwissen. In diesem Beitrag erfahren Sie, worauf es wirklich ankommt, welche Herausforderungen auftreten können und warum professionelle Meisterarbeit hier unverzichtbar ist.</p>
        </section>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Warum Großformatfliesen so gefragt sind</h2>
          <p>Großformatige Fliesen – häufig in Formaten wie 80×80 cm, 100×100 cm oder 120×120 cm – sorgen für ein ruhiges, modernes Raumgefühl. Weniger Fugen bedeuten:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>eine großzügige, offene Raumwirkung</li>
            <li>leichtere Reinigung und geringere Schmutzanfälligkeit</li>
            <li>ein hochwertiges, minimalistisches Design</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Technik ist entscheidend</h2>
          <p>Je größer die Fliese, desto höher die Anforderungen an den Untergrund. Beim Großformatfliesen verlegen in Bocholt gelten strengere Toleranzen als bei Standardformaten. Entscheidend sind:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-warm-anthrazit/5 border-l-2 border-warm-stein">perfekte Ebenheit des Untergrunds</div>
            <div className="p-4 bg-warm-anthrazit/5 border-l-2 border-warm-stein">fachgerechte Spachtelarbeiten</div>
            <div className="p-4 bg-warm-anthrazit/5 border-l-2 border-warm-stein">Buttering-Floating-Verfahren</div>
            <div className="p-4 bg-warm-anthrazit/5 border-l-2 border-warm-stein">Nivelliersysteme zur Höhenkontrolle</div>
          </div>
        </section>
        
        <blockquote className="text-2xl font-light italic border-l-4 border-warm-stein pl-8 py-4 my-12 text-warm-mittel">
          "Großformatfliesen verzeihen keine Fehler. Wahre Meisterschaft zeigt sich in der Vorbereitung."
        </blockquote>
        
        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Herausforderungen im Bad</h2>
          <p>Gerade im Bad ist das Großformatfliesen verlegen technisch anspruchsvoll. In Duschen müssen Gefälle exakt berechnet werden, damit Wasser zuverlässig abläuft. Ein professioneller Fachbetrieb achtet auf normgerechte Verbundabdichtung und saubere Silikonfugen.</p>
        </section>
      </div>
    `
  },
  {
    id: 'hochwertiger-fliesenleger',
    title: 'Hochwertiger Fliesenleger – Was macht ihn wirklich aus?',
    excerpt: 'Qualität im Handwerk ist messbar. Erfahren Sie, worauf Sie bei der Wahl Ihres Fliesenlegers achten sollten.',
    category: 'Unternehmen',
    readTime: '8 Min.',
    date: 'Januar 2026',
    image: '/images/website-extract/Raumgefuehl-8-2-scaled-1.jpg',
    featured: false,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Die Suche nach einem hochwertigen Fliesenleger führt oft über Empfehlungen und Referenzen. Doch was unterscheidet einen Meisterbetrieb von einem Standard-Verleger?</p>
        </section>
        
        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Qualität ist kein Zufall</h2>
          <p>Ein hochwertiger Fliesenleger zeichnet sich durch Beratungskompetenz, technisches Verständnis und Liebe zum Detail aus. Es geht nicht nur um das Kleben von Fliesen, sondern um das Schaffen von Werten.</p>
          <h3 className="text-xl font-medium mt-8 mb-4">Wichtige Kriterien:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Transparente Angebotserstellung (Pauschalpreise)</li>
            <li>Eigene Meister im Team (keine Subunternehmer)</li>
            <li>Moderne Werkzeuge und Verlegetechniken</li>
            <li>Umfassende Beratung vor Ort</li>
          </ul>
        </section>
      </div>
    `
  },
  {
    id: 'fliesenberatung',
    title: 'Individuelle Fliesenberatung: Von der Idee zum Konzept',
    excerpt: 'Wie wir gemeinsam mit Ihnen Räume planen, die Ihre Persönlichkeit widerspiegeln.',
    category: 'Beratung',
    readTime: '5 Min.',
    date: 'Juni 2025',
    image: '/images/website-extract/Beratung-und-Konzeptentwicklung.jpg',
    featured: false,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Jedes Projekt beginnt mit einem Gespräch. In unserer Ausstellung in Bocholt nehmen wir uns Zeit für Ihre Vision.</p>
        </section>
        
        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Materialien erleben</h2>
          <p>Haptik kann man nicht digital vermitteln. Deshalb setzen wir auf echte Materialcollagen und Bemusterungen vor Ort.</p>
          <p>In intensiven Beratungsgesprächen entwickeln wir gemeinsam ein maßgeschneidertes Konzept, das Funktionalität und Ästhetik vereint.</p>
        </section>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Digitale Planung</h2>
          <p>Dank modernster 3D-Visualisierungen und Virtual-Reality-Technologien können Sie Ihr Projekt bereits vor der Umsetzung realitätsnah erleben.</p>
        </section>
      </div>
    `
  },
  {
    id: 'fugenloses-bad',
    title: 'Fugenloses Bad: Maximale Ruhe durch XXL-Keramik',
    excerpt: 'Fugenlose Flächen liegen im Trend. Erfahren Sie, wie wir mit großformatiger Keramik fugenlose Träume wahr machen.',
    category: 'Bad',
    readTime: '7 Min.',
    date: 'Mai 2025',
    image: '/images/website-extract/Perfekte-Linien_1-scaled.jpg',
    featured: false,
    content: `
      <div className="space-y-12">
        <section>
          <p className="text-xl leading-relaxed mb-8">Ein fugenloses Bad wirkt wie aus einem Guss. Es strahlt Ruhe aus und ist zudem extrem pflegeleicht.</p>
        </section>
        
        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Die Rolle der Keramik</h2>
          <p>Mit Platten bis zu 3,20 Meter Höhe lassen sich Wände nahezu ohne horizontale Unterbrechung gestalten.</p>
          <p>Das Ergebnis ist eine homogene Fläche, die den Raum optisch vergrößert und eine exklusive Atmosphäre schafft.</p>
        </section>

        <section>
          <h2 className="text-3xl font-light tracking-tight mb-6">Vorteile auf einen Blick</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Hygienisch und leicht zu reinigen</li>
            <li>Keine verfärbten Fugen mehr</li>
            <li>Moderne, architektonische Optik</li>
            <li>Individuelle Maßanfertigung</li>
          </ul>
        </section>
      </div>
    `
  }
  }
]

const categories = ['Alle', 'Fachwissen', 'Handwerk', 'Unternehmen', 'Beratung', 'Bad']

/* ─── Article Card Component ─────────────────────────────────── */
function ArticleCard({ article, index, featured = false }) {
  if (featured) {
    return (
      <Reveal delay={index * 100}>
        <Link to={`/magazin/${article.id}`} className="group block">
          <article className="grid lg:grid-cols-2 gap-8 bg-dark-bg rounded-[2rem] overflow-hidden shadow-xl">
            <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-1.5 bg-inv-light/10 font-dm text-[0.7rem] text-inv-mid uppercase tracking-[2px]">
                  {article.category}
                </span>
                <span className="font-dm text-[0.75rem] text-inv-tagline uppercase tracking-widest">{article.readTime} Lesezeit</span>
              </div>
              <h2 className="font-sora font-extralight text-2xl md:text-4xl text-inv-light tracking-tight mb-6 leading-tight">
                {article.title}
              </h2>
              <p className="font-dm text-[1.05rem] text-inv-muted leading-relaxed mb-8">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-3 font-dm text-[0.82rem] font-semibold text-inv-light uppercase tracking-widest group-hover:text-white transition-colors">
                <span>Beitrag lesen</span>
                <motion.div 
                  className="w-8 h-[1px] bg-inv-light/50"
                  whileHover={{ width: 48 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </article>
        </Link>
      </Reveal>
    )
  }

  return (
    <Reveal delay={index * 100}>
      <Link to={`/magazin/${article.id}`} className="group block">
        <article className="h-full">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 shadow-sm">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-warm-bg/90 backdrop-blur-sm font-dm text-[0.65rem] text-warm-text uppercase tracking-[2px]">
                {article.category}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-warm-mittel">
              <span className="font-dm text-[0.7rem] uppercase tracking-widest">{article.date}</span>
              <span className="w-1 h-1 rounded-full bg-warm-stein/30" />
              <span className="font-dm text-[0.7rem] uppercase tracking-widest">{article.readTime}</span>
            </div>
            <h3 className="font-sora font-light text-xl text-warm-text tracking-tight leading-snug group-hover:text-warm-anthrazit transition-colors">
              {article.title}
            </h3>
            <p className="font-dm text-[0.9rem] text-warm-mittel leading-relaxed line-clamp-2">
              {article.excerpt}
            </p>
          </div>
        </article>
      </Link>
    </Reveal>
  )
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function Magazin() {
  const [filter, setFilter] = useState('Alle')
  
  const featuredArticle = articles.find(a => a.featured)
  const filteredArticles = filter === 'Alle' 
    ? articles.filter(a => !a.featured)
    : articles.filter(a => a.category === filter && !a.featured)

  return (
    <div className="bg-warm-bg min-h-screen pt-48 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-16">
        <Reveal>
          <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
            Wissen & Inspiration
          </p>
          <h1 className="font-sora font-extralight text-[clamp(3rem,8vw,6rem)] text-warm-text leading-[1] tracking-[-0.03em] max-w-4xl mb-8">
            Unser Magazin.
          </h1>
          <p className="font-dm text-[1.1rem] text-warm-mittel max-w-2xl leading-relaxed">
            Fachwissen, Einblicke und Inspiration aus der Welt der Premium-Fliesenverlegung. Ehrlich, kompetent und auf den Punkt.
          </p>
        </Reveal>
      </div>

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-16">
        <div className="flex flex-wrap gap-2 border-b border-warm-anthrazit/10 pb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 font-dm text-[0.82rem] font-semibold tracking-wider uppercase transition-all duration-500 relative ${
                filter === cat 
                  ? 'text-warm-text' 
                  : 'text-warm-mittel hover:text-warm-text'
              }`}
            >
              {cat}
              {filter === cat && (
                <motion.div 
                  layoutId="activeCategory"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-warm-stein"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Article */}
      {featuredArticle && filter === 'Alle' && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-20">
          <ArticleCard article={featuredArticle} index={0} featured />
        </div>
      )}

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
          {filteredArticles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-32">
        <Reveal>
          <div className="bg-dark-bg rounded-[2rem] p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-sora font-extralight text-3xl md:text-4xl text-inv-light tracking-tight mb-4">
                  Bleiben Sie informiert.
                </h2>
                <p className="font-dm text-[1rem] text-inv-muted leading-relaxed">
                  Einmal im Monat: Fachwissen, Projekt-Einblicke und Inspiration direkt in Ihr Postfach. Kein Spam, nur Relevanz.
                </p>
              </div>
              <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Ihre E-Mail-Adresse"
                  className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-none font-dm text-[0.95rem] text-inv-light placeholder:text-inv-tagline focus:outline-none focus:border-white/30 transition-colors"
                />
                <button
                  type="submit"
                  className="px-10 py-4 bg-warm-bg text-warm-text font-dm text-[0.82rem] font-semibold tracking-widest uppercase hover:bg-white transition-all duration-500 rounded-none whitespace-nowrap"
                >
                  Anmelden
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
