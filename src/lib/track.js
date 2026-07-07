// Zentrales, consent-gated Event-Tracking für GA4.
// Feuert Events NUR, wenn der Nutzer eingewilligt hat (getConsent() === 'accepted')
// und gtag geladen ist.
//
// Aktuell genutzt für `generate_lead` (erfolgreicher Anfrage-Formular-Abschluss) —
// das in GA4 fehlende „Lead abgesendet"-Event, das als primäre Conversion nach
// Google Ads importiert wird (siehe SEO/Tracking-Setup.md).
//
// Anruf-/E-Mail-Klicks werden NICHT hier getrackt: dafür existieren bereits die
// GA4-seitig angelegten Events `phone_click` / `email_click` (kein Doppel-Tracking).
import { getConsent } from './consent.js'

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return
  if (getConsent() !== 'accepted') return
  if (typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
