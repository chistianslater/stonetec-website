// Zentrales, consent-gated Event-Tracking für GA4.
// Feuert Events NUR, wenn der Nutzer eingewilligt hat (getConsent() === 'accepted')
// und gtag geladen ist. Die Events werden in GA4 als Key Events markiert und als
// Conversions nach Google Ads importiert (siehe SEO/Fundament-Plan.md, Block A).
import { getConsent } from './consent.js'

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return
  if (getConsent() !== 'accepted') return
  if (typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}

let contactBound = false

// Ein einziger delegierter Listener fängt Klicks auf alle tel:-Links ab —
// seitenübergreifend und auch für später hinzugefügte Links. Zählt den
// Anruf-Wunsch als `contact`-Event (schwaches Signal bis echte Call-Conversion).
export function initContactTracking() {
  if (contactBound || typeof document === 'undefined') return
  contactBound = true
  document.addEventListener('click', (e) => {
    const link = e.target?.closest?.('a[href^="tel:"]')
    if (!link) return
    trackEvent('contact', { method: 'phone' })
  })
}
