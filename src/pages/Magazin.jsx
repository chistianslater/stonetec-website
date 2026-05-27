import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

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

const articles = [
  {
    id: 1,
    title: 'Großformate: Was bei der Verlegung wirklich wichtig ist',
    excerpt: 'Keramikplatten bis 160×320 cm verlangen mehr als gute Materialien. Sie verlangen Präzision, Erfahrung und das richtige Werkzeug. Was Sie über Großformate wissen sollten.',
    category: 'Fachwissen',
    readTime: '5 Min.',
    date: 'Dezember 2024',
    image: '/images/magazin-1.jpg',
    featured: true
  },
  {
    id: 2,
    title: 'Der Gehrungsschnitt: Ein Detail, das den Unterschied macht',
    excerpt: 'Sie sehen ihn nicht. Aber Sie würden es merken, wenn er nicht perfekt wäre. Warum der Gehrungsschnitt die Qualität einer Verlegung definiert.',
    category: 'Handwerk',
    readTime: '4 Min.',
    date: 'November 2024',
    image: '/images/magazin-2.jpg',
    featured: false
  },
  {
    id: 3,
    title: 'Warum wir keine Subunternehmer beschäftigen',
    excerpt: 'Sieben Meister unter einem Dach. Null Fremdfirmen. Eine bewusste Entscheidung, die Qualität garantiert — und Verantwortung erlebbar macht.',
    category: 'Unternehmen',
    readTime: '3 Min.',
    date: 'Oktober 2024',
    image: '/images/magazin-3.jpg',
    featured: false
  },
  {
    id: 4,
    title: 'Materialien, die wir empfehlen (und warum)',
    excerpt: 'Vom Feinsteinzeug bis zum hochtechnologischen SLAB: Welche Materialien unseren Ansprüchen entsprechen — und was Sie bei der Auswahl beachten sollten.',
    category: 'Materialkunde',
    readTime: '6 Min.',
    date: 'September 2024',
    image: '/images/magazin-4.jpg',
    featured: false
  },
  {
    id: 5,
    title: 'Pauschalpreis vs. Stundensatz: Was ist fair?',
    excerpt: 'Warum wir auf Pauschalpreise setzen — und wie Sie als Kunde davon profitieren. Eine ehrliche Betrachtung über Preistransparenz im Handwerk.',
    category: 'Fachwissen',
    readTime: '4 Min.',
    date: 'August 2024',
    image: '/images/magazin-5.jpg',
    featured: false
  },
  {
    id: 6,
    title: 'Villa Münsterland: Ein Projekt im Detail',
    excerpt: '145 m² Großformatverlegung, maßgefertigte Waschtische, fugenlose Dusche. Ein Einblick in eines unserer Highlights 2024.',
    category: 'Projekte',
    readTime: '7 Min.',
    date: 'Juli 2024',
    image: '/images/magazin-6.jpg',
    featured: false
  }
]

const categories = ['Alle', 'Fachwissen', 'Handwerk', 'Unternehmen', 'Materialkunde', 'Projekte']

function ArticleCard({ article, index, featured = false }) {
  if (featured) {
    return (
      <Reveal delay={index * 100}>
        <Link to={`/magazin/${article.id}`} className="group block">
          <article className="grid md:grid-cols-2 gap-6 bg-dark-bg rounded-xl overflow-hidden">
            <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-inv-light/10 font-dm text-[0.72rem] text-inv-mid uppercase tracking-wide">
                  {article.category}
                </span>
                <span className="font-dm text-[0.75rem] text-inv-tagline">{article.readTime}</span>
              </div>
              <h2 className="font-sora font-light text-xl md:text-2xl text-inv-light tracking-[-0.01em] mb-3 leading-snug">
                {article.title}
              </h2>
              <p className="font-dm text-[0.9rem] text-inv-muted leading-relaxed mb-4">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-2 font-dm text-[0.82rem] text-inv-light group-hover:text-white transition-colors">
                Weiterlesen
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
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
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-warm-bg/90 backdrop-blur-sm font-dm text-[0.72rem] text-warm-text tracking-wide">
                {article.category}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-warm-mittel">
              <span className="font-dm text-[0.75rem]">{article.date}</span>
              <span className="w-1 h-1 rounded-full bg-warm-mittel" />
              <span className="font-dm text-[0.75rem]">{article.readTime}</span>
            </div>
            <h3 className="font-sora font-light text-lg text-warm-text tracking-[-0.01em] leading-snug group-hover:text-warm-anthrazit transition-colors">
              {article.title}
            </h3>
            <p className="font-dm text-[0.85rem] text-warm-mittel leading-relaxed line-clamp-2">
              {article.excerpt}
            </p>
          </div>
        </article>
      </Link>
    </Reveal>
  )
}

export default function Magazin() {
  const [filter, setFilter] = useState('Alle')
  
  const featuredArticle = articles.find(a => a.featured)
  const filteredArticles = filter === 'Alle' 
    ? articles.filter(a => !a.featured)
    : articles.filter(a => a.category === filter && !a.featured)

  return (
    <div className="bg-warm-bg min-h-screen pt-32 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-12">
        <Reveal>
          <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
            Wissen & Inspiration
          </p>
          <h1 className="font-sora font-extralight text-[clamp(2.5rem,5vw,4rem)] text-warm-text leading-tight tracking-[-0.02em] max-w-3xl mb-6">
            Magazin
          </h1>
          <p className="font-dm text-[0.95rem] text-warm-mittel max-w-2xl leading-relaxed">
            Fachwissen, Einblicke und Inspiration aus der Welt der Premium-Fliesenverlegung.
          </p>
        </Reveal>
      </div>

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-12">
        <Reveal delay={100}>
          <div className="flex flex-wrap gap-2 border-b border-warm-anthrazit/10 pb-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 font-dm text-[0.8rem] tracking-wide transition-all duration-300 ${
                  filter === cat 
                    ? 'bg-warm-text text-warm-bg' 
                    : 'bg-transparent text-warm-mittel hover:text-warm-text'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Featured Article */}
      {featuredArticle && filter === 'Alle' && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-12">
          <ArticleCard article={featuredArticle} index={0} featured />
        </div>
      )}

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-20">
        <Reveal>
          <div className="bg-dark-bg rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-sora font-extralight text-2xl md:text-3xl text-inv-light tracking-[-0.01em] mb-3">
                  Neuigkeiten per E-Mail
                </h2>
                <p className="font-dm text-[0.9rem] text-inv-muted leading-relaxed">
                  Einmal im Monat: Fachwissen, Projekt-Einblicke und Inspiration. 
                  Kein Spam, kein Bullshit. Abmeldung jederzeit möglich.
                </p>
              </div>
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="deine@email.de"
                  className="flex-1 px-4 py-3 bg-inv-light/10 border border-inv-light/20 rounded-lg font-dm text-[0.9rem] text-inv-light placeholder:text-inv-tagline focus:outline-none focus:border-inv-light/40 transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-warm-bg text-warm-text font-dm text-[0.8rem] font-semibold tracking-wider uppercase hover:bg-white transition-colors duration-300 whitespace-nowrap"
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
