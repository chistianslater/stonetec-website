// Zentrales Event-Tracking für GA4 unter Google Consent Mode v2.
// Der Google-Tag wird per initConsentMode() IMMER geladen (Default "denied"),
// daher feuert das Event, sobald gtag verfügbar ist. Die Cookielosigkeit vor
// Einwilligung regelt der Consent Mode selbst — nicht das Unterdrücken des
// Events. So werden Conversions auch ohne Vollzustimmung DSGVO-konform
// gemessen/modelliert.
//
// Aktuell genutzt für `generate_lead` (erfolgreicher Anfrage-Formular-Abschluss) —
// das in GA4 fehlende „Lead abgesendet"-Event, das als primäre Conversion nach
// Google Ads importiert wird (siehe SEO/Tracking-Setup.md).
//
// Anruf-/E-Mail-Klicks werden NICHT hier getrackt: dafür existieren bereits die
// GA4-seitig angelegten Events `phone_click` / `email_click` (kein Doppel-Tracking).

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
