import { describe, it, expect } from 'vitest'
import { splitContentAtCta, CTA_MARKER } from './articleCta.js'
import { ratgeberArticles } from '../data/ratgeberArticles.js'

describe('splitContentAtCta', () => {
  it('teilt den Inhalt an der Markierung', () => {
    const result = splitContentAtCta(`<p>A</p>${CTA_MARKER}<p>B</p>`)
    expect(result).toEqual({ before: '<p>A</p>', after: '<p>B</p>', hasMarker: true })
  })

  it('lässt Inhalte ohne Markierung ungeteilt', () => {
    expect(splitContentAtCta('<p>A</p>')).toEqual({ before: '<p>A</p>', after: '', hasMarker: false })
  })

  it('verträgt fehlenden Inhalt', () => {
    expect(splitContentAtCta(undefined).hasMarker).toBe(false)
  })
})

describe('Fugenfarbe-Artikel', () => {
  const article = ratgeberArticles.find((a) => a.id === 'die-fugenfarbe')

  it('hat eine Bad-planen-Brücke zur Badsanierungs-Landingpage', () => {
    expect(article.cta?.primary?.to).toBe('/badsanierung-bocholt')
  })

  it('setzt die CTA-Markierung direkt hinter die Fugenfarben-Tabelle', () => {
    const { before, hasMarker } = splitContentAtCta(article.content)
    expect(hasMarker).toBe(true)
    expect(before).toContain('</table>')
  })
})
