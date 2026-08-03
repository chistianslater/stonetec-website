import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function SEO({ title, description, keywords, image, canonical, jsonLd }) {
  const location = useLocation()
  const baseUrl = 'https://stonetec-bocholt.de'
  const fullTitle = title ? `${title} | stonetec Bocholt` : 'stonetec — Räume, die man spürt. | Premium Fliesenverlegung Bocholt'
  const fullDescription = description || 'Meisterhafte Fliesenverlegung, eigene Keramikmanufaktur und 3D-Visualisierung in Bocholt. 7 Meister, Pauschalpreise, null Subunternehmer.'
  const fullKeywords = keywords || 'Fliesenleger Bocholt, Großformate, Keramikmanufaktur, Premium Fliesen, 3D Visualisierung, stonetec'
  const fullImage = image || `${baseUrl}/images/hero-2.jpg`
  const fullCanonical = canonical || `${baseUrl}${location.pathname}`

  useEffect(() => {
    document.title = fullTitle
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) metaDescription.setAttribute('content', fullDescription)

    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) metaKeywords.setAttribute('content', fullKeywords)

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', fullTitle)

    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) ogDescription.setAttribute('content', fullDescription)

    const ogImage = document.querySelector('meta[property="og:image"]')
    if (ogImage) ogImage.setAttribute('content', fullImage)

    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) ogUrl.setAttribute('content', fullCanonical)

    const linkCanonical = document.querySelector('link[rel="canonical"]')
    if (linkCanonical) linkCanonical.setAttribute('href', fullCanonical)
  }, [fullTitle, fullDescription, fullKeywords, fullImage, fullCanonical])

  // Strukturierte Daten (z. B. FAQPage) als eigenes JSON-LD-Script pflegen —
  // pro Seite maximal eins; beim Routenwechsel ohne jsonLd wird es entfernt.
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : null
  useEffect(() => {
    const SCRIPT_ID = 'seo-jsonld'
    let el = document.getElementById(SCRIPT_ID)
    if (!jsonLdString) {
      if (el) el.remove()
      return
    }
    if (!el) {
      el = document.createElement('script')
      el.type = 'application/ld+json'
      el.id = SCRIPT_ID
      document.head.appendChild(el)
    }
    el.textContent = jsonLdString
  }, [jsonLdString])

  return null
}
