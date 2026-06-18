// Einwilligungs-Verwaltung für nicht-notwendige Cookies/Dienste.
// Statistik-Tools (Google Analytics, Microsoft Clarity) werden NUR nach
// ausdrücklicher Zustimmung geladen. IDs eintragen, sobald vorhanden.

const KEY = 'stonetec-cookie-consent' // 'accepted' | 'declined'

// Sobald die Kennungen vorliegen, hier eintragen — dann laden sie automatisch
// nach Einwilligung. Solange leer, wird nichts geladen.
const GA_ID = '' // GA4 Measurement-ID, z. B. 'G-XXXXXXXXXX'
const CLARITY_ID = '' // Microsoft Clarity Projekt-ID, z. B. 'abcd1234'

export function getConsent() {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function setConsent(value) {
  try {
    localStorage.setItem(KEY, value)
  } catch {
    /* localStorage nicht verfügbar — ignorieren */
  }
  if (value === 'accepted') loadAnalytics()
}

let loaded = false

export function loadAnalytics() {
  if (loaded || typeof document === 'undefined') return
  loaded = true

  if (GA_ID) {
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(s)
    window.dataLayer = window.dataLayer || []
    const gtag = function () { window.dataLayer.push(arguments) }
    gtag('js', new Date())
    gtag('config', GA_ID, { anonymize_ip: true })
  }

  if (CLARITY_ID) {
    const c = document.createElement('script')
    c.type = 'text/javascript'
    c.async = true
    c.innerHTML =
      `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};` +
      `t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;` +
      `y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${CLARITY_ID}");`
    document.head.appendChild(c)
  }
}
