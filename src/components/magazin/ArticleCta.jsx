import { Link } from 'react-router-dom'
import { trackEvent } from '../../lib/track.js'

// Brücke vom Ratgeber-Artikel zur Anfrage-Landingpage (Ads-Maßnahme 2026-10-7).
export default function ArticleCta({ cta, articleId }) {
  if (!cta) return null

  const onClick = (target) => () =>
    trackEvent('ratgeber_cta_click', { article_id: articleId, cta_target: target })

  return (
    <aside
      aria-label={cta.label}
      className="not-prose my-16 bg-dark-bg rounded-2xl p-8 md:p-12 text-inv-light"
    >
      <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-stein mb-4">
        {cta.label}
      </p>
      <h2 className="font-sora font-extralight text-[clamp(1.6rem,3vw,2.3rem)] leading-[1.15] tracking-[-0.02em] mb-5">
        {cta.title}
      </h2>
      <p className="font-dm text-[1rem] text-inv-muted leading-relaxed mb-8 max-w-xl">{cta.text}</p>
      <div className="flex flex-wrap gap-4">
        <Link
          to={cta.primary.to}
          onClick={onClick(cta.primary.to)}
          className="px-8 py-4 bg-warm-bg text-warm-text font-dm text-[0.82rem] font-semibold tracking-wider uppercase hover:bg-white transition-colors duration-300"
        >
          {cta.primary.label}
        </Link>
        {cta.secondary && (
          <Link
            to={cta.secondary.to}
            onClick={onClick(cta.secondary.to)}
            className="px-8 py-4 border border-inv-muted/40 text-inv-light font-dm text-[0.82rem] font-semibold tracking-wider uppercase hover:border-inv-light transition-colors duration-300"
          >
            {cta.secondary.label}
          </Link>
        )}
      </div>
    </aside>
  )
}
