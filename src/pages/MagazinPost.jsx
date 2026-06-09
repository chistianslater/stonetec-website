import { useParams, Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useState, useEffect } from 'react'
import { articles } from './Magazin.jsx'
import SEO from '../components/SEO.jsx'

/* ─── Hover Preview Component ────────────────────────────────── */
function HoverPreview({ image, isVisible }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 250 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <motion.div
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-120%',
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0.8 
      }}
      className="fixed top-0 left-0 z-[100] w-64 aspect-[16/10] rounded-xl overflow-hidden shadow-2xl border-4 border-white/20"
    >
      <img src={image} alt="Preview" className="w-full h-full object-cover" />
    </motion.div>
  )
}

export default function MagazinPost() {
  const { id } = useParams()
  const article = articles.find(a => a.id === id)
  const [hoveredArticle, setHoveredArticle] = useState(null)

  const currentIndex = articles.findIndex(a => a.id === id)
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-bg">
        <div className="text-center">
          <h1 className="font-sora text-4xl mb-4">Beitrag nicht gefunden</h1>
          <Link to="/magazin" className="text-warm-mittel hover:text-warm-text underline">Zurück zur Übersicht</Link>
        </div>
      </div>
    )
  }

  return (
    <article className="bg-warm-bg min-h-screen pt-48 pb-24">
      <SEO 
        title={article.title}
        description={article.excerpt}
        image={article.image}
      />
      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 md:px-12 mb-16">
        <Link to="/magazin" className="inline-flex items-center gap-2 font-dm text-[0.75rem] uppercase tracking-[2px] text-warm-mittel hover:text-warm-text transition-colors mb-12 group">
          <svg className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          Zurück zur Übersicht
        </Link>
        
        <div className="flex items-center gap-4 mb-6">
          <span className="px-4 py-1.5 bg-warm-anthrazit/5 font-dm text-[0.7rem] text-warm-mittel uppercase tracking-[2px]">
            {article.category}
          </span>
        </div>
        
        <h1 className="font-sora font-extralight text-[clamp(2.5rem,5vw,4.5rem)] text-warm-text leading-[1.1] tracking-[-0.03em] mb-8">
          {article.title}
        </h1>
        
        <div className="flex items-center gap-4 border-t border-warm-anthrazit/10 pt-8">
          <div className="w-10 h-10 rounded-full bg-warm-stein/20 flex items-center justify-center text-warm-text font-sora text-sm">ST</div>
          <div>
            <p className="font-dm text-[0.85rem] font-semibold text-warm-text">stonetec Redaktion</p>
            <p className="font-dm text-[0.75rem] text-warm-mittel">{article.date}</p>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-20">
        <div className="aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div 
          className="magazin-content prose prose-lg prose-stone max-w-none font-dm text-warm-text/90 leading-relaxed
            prose-headings:font-sora prose-headings:font-light prose-headings:tracking-tight prose-headings:text-warm-text
            prose-h2:text-3xl prose-h2:mt-20 prose-h2:mb-8 prose-h2:pb-4 prose-h2:border-b prose-h2:border-warm-anthrazit/5
            prose-h3:text-xl prose-h3:mt-12 prose-h3:mb-4 prose-h3:font-medium
            prose-p:mb-8 prose-p:text-[1.1rem]
            prose-blockquote:border-l-warm-stein prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:font-light prose-blockquote:my-16 prose-blockquote:pl-8 prose-blockquote:text-warm-mittel
            prose-ul:my-8 prose-li:mb-2
          "
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        
        {/* Post Navigation */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-warm-anthrazit/10 pt-16 relative">
          {prevArticle ? (
            <Link 
              to={`/magazin/${prevArticle.id}`} 
              className="group block"
              onMouseEnter={() => setHoveredArticle(prevArticle)}
              onMouseLeave={() => setHoveredArticle(null)}
            >
              <p className="font-dm text-[0.7rem] uppercase tracking-[3px] text-warm-mittel mb-4">Vorheriger Beitrag</p>
              <h4 className="font-sora font-light text-xl text-warm-text group-hover:text-warm-stein transition-colors duration-500 leading-tight">{prevArticle.title}</h4>
            </Link>
          ) : <div />}
          
          {nextArticle ? (
            <Link 
              to={`/magazin/${nextArticle.id}`} 
              className="group block text-right"
              onMouseEnter={() => setHoveredArticle(nextArticle)}
              onMouseLeave={() => setHoveredArticle(null)}
            >
              <p className="font-dm text-[0.7rem] uppercase tracking-[3px] text-warm-mittel mb-4">Nächster Beitrag</p>
              <h4 className="font-sora font-light text-xl text-warm-text group-hover:text-warm-stein transition-colors duration-500 leading-tight">{nextArticle.title}</h4>
            </Link>
          ) : <div />}

          {/* Hover Preview Overlay */}
          {hoveredArticle && <HoverPreview image={hoveredArticle.image} isVisible={!!hoveredArticle} />}
        </div>

        {/* Back to Overview */}
        <div className="mt-20 text-center">
          <Link to="/magazin" className="inline-flex items-center gap-4 px-10 py-5 bg-dark-bg text-inv-light font-dm text-[0.82rem] font-semibold tracking-widest uppercase hover:bg-black transition-all duration-500 rounded-none shadow-lg">
            Zurück zur Übersicht
          </Link>
        </div>

        {/* Footer CTA */}
        <footer className="mt-32 pt-16 border-t border-warm-anthrazit/10">
          <div className="bg-dark-bg rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative z-10">
              <h3 className="font-sora font-extralight text-3xl md:text-4xl text-inv-light mb-8 tracking-tight">Hast du Fragen zu diesem Thema?</h3>
              <p className="font-dm text-[1.1rem] text-inv-muted mb-12 max-w-xl mx-auto leading-relaxed">
                Unsere Experten beraten dich gerne persönlich zu deinem individuellen Projekt. Ehrlich, kompetent und auf den Punkt.
              </p>
              <Link 
                to="/kontakt" 
                className="inline-flex items-center gap-4 px-12 py-6 bg-warm-bg text-warm-text font-dm text-[0.85rem] font-semibold tracking-widest uppercase hover:bg-white transition-all duration-500 rounded-none"
              >
                Beratungstermin vereinbaren
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </article>
  )
}
