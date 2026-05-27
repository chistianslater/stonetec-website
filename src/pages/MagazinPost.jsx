import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { articles } from './Magazin.jsx'

export default function MagazinPost() {
  const { id } = useParams()
  const article = articles.find(a => a.id === id)

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-bg">
        <div className="text-center">
          <h1 className="font-sora text-4xl mb-4">Beitrag nicht gefunden</h1>
          <Link to="/magazin" className="text-warm-mittel hover:text-warm-text underline">Zurück zum Magazin</Link>
        </div>
      </div>
    )
  }

  return (
    <article className="bg-warm-bg min-h-screen pt-32 pb-24">
      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 md:px-12 mb-16">
        <Link to="/magazin" className="inline-flex items-center gap-2 font-dm text-[0.75rem] uppercase tracking-[2px] text-warm-mittel hover:text-warm-text transition-colors mb-12">
          <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          Zurück zum Magazin
        </Link>
        
        <div className="flex items-center gap-4 mb-6">
          <span className="px-4 py-1.5 bg-warm-anthrazit/5 font-dm text-[0.7rem] text-warm-mittel uppercase tracking-[2px]">
            {article.category}
          </span>
          <span className="font-dm text-[0.75rem] text-warm-mittel uppercase tracking-widest">{article.readTime} Lesezeit</span>
        </div>
        
        <h1 className="font-sora font-extralight text-[clamp(2.5rem,5vw,4.5rem)] text-warm-text leading-[1.1] tracking-[-0.03em] mb-8">
          {article.title}
        </h1>
        
        <div className="flex items-center gap-4 border-t border-warm-anthrazit/10 pt-8">
          <div className="w-10 h-10 rounded-full bg-warm-stein/20 flex items-center justify-center text-warm-text font-sora text-sm">ST</div>
          <div>
            <p className="font-dm text-[0.85rem] font-semibold text-warm-text">StoneTec Redaktion</p>
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
          className="prose prose-lg prose-stone max-w-none font-dm text-warm-text/90 leading-relaxed
            prose-headings:font-sora prose-headings:font-light prose-headings:tracking-tight
            prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6
            prose-p:mb-8
            prose-blockquote:border-l-warm-stein prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:font-light prose-blockquote:my-16 prose-blockquote:pl-8
          "
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        
        {/* Footer */}
        <footer className="mt-24 pt-12 border-t border-warm-anthrazit/10">
          <div className="bg-dark-bg rounded-[2rem] p-8 md:p-12 text-center">
            <h3 className="font-sora font-extralight text-2xl text-inv-light mb-6">Haben Sie Fragen zu diesem Thema?</h3>
            <p className="font-dm text-inv-muted mb-8 max-w-lg mx-auto">
              Unsere Experten beraten Sie gerne persönlich zu Ihrem individuellen Projekt.
            </p>
            <Link 
              to="/kontakt" 
              className="inline-flex items-center gap-4 px-10 py-5 bg-warm-bg text-warm-text font-dm text-sm font-semibold tracking-widest uppercase hover:bg-white transition-all duration-500 rounded-none"
            >
              Beratungstermin vereinbaren
            </Link>
          </div>
        </footer>
      </div>
    </article>
  )
}
