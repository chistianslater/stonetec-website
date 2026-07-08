// Einwilligungs-Verwaltung + Google Consent Mode v2 (Advanced).
//
// Der Google-Tag wird IMMER geladen, aber standardmäßig im Zustand "denied"
// (Consent Mode v2). Vor der Einwilligung setzt gtag KEINE Cookies und sendet
// nur cookielose, ad-id-redigierte Pings — das erlaubt DSGVO-konformes
// Conversion-Modeling (Google modelliert nicht-eingewilligte Conversions).
// Erst nach aktiver Zustimmung ("Alle akzeptieren") werden Cookies/volle
// Messung + Microsoft Clarity aktiviert.

const KEY = 'stonetec-cookie-consent' // 'accepted' | 'declined' | null

const GA_ID = 'G-2CWR9BSMGL' // GA4 Measurement-ID
const CLARITY_ID = 'x8xlypjs2t' // Microsoft Clarity Projekt-ID

export function getConsent() {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

// Consent-Mode-Signale: nur technisch Notwendiges erlaubt, Rest verweigert.
const DENIED = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
}
const GRANTED = {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
}

let initialized = false

// Lädt den Google-Tag EINMAL im Consent-Mode-Default "denied".
// Muss vor jeder Messung laufen und ist idempotent.
export function initConsentMode() {
  if (initialized || typeof document === 'undefined') return
  initialized = true

  window.dataLayer = window.dataLayer || []
  // gtag global exponieren, damit der Event-Layer (lib/track.js) dieselbe
  // Instanz nutzt.
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments) }

  // 1) Consent-Default VOR dem Config-Befehl setzen (alles denied).
  window.gtag('consent', 'default', {
    ...DENIED,
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500,
  })
  // Solange keine Einwilligung vorliegt: Ad-Click-IDs redigieren und gclid
  // cookielos via URL weiterreichen.
  window.gtag('set', 'ads_data_redaction', true)
  window.gtag('set', 'url_passthrough', true)

  // 2) Google-Tag laden (sendet danach cookielose Pings im denied-Zustand).
  if (GA_ID) {
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(s)
    window.gtag('js', new Date())
    window.gtag('config', GA_ID, { anonymize_ip: true })
  }

  // 3) Bereits gespeicherte Zustimmung sofort anwenden.
  if (getConsent() === 'accepted') grantConsent()
}

function grantConsent() {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('consent', 'update', GRANTED)
  loadClarity()
}

function denyConsent() {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('consent', 'update', DENIED)
}

let clarityLoaded = false

// Microsoft Clarity kennt kein Consent-Mode → nur nach expliziter Zustimmung.
function loadClarity() {
  if (clarityLoaded || !CLARITY_ID || typeof document === 'undefined') return
  clarityLoaded = true
  const c = document.createElement('script')
  c.type = 'text/javascript'
  c.async = true
  c.innerHTML =
    `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};` +
    `t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;` +
    `y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${CLARITY_ID}");`
  document.head.appendChild(c)
}

export function setConsent(value) {
  try {
    localStorage.setItem(KEY, value)
  } catch {
    /* localStorage nicht verfügbar — ignorieren */
  }
  // Falls der Banner-Klick vor der Initialisierung kam: sicher nachziehen.
  initConsentMode()
  if (value === 'accepted') grantConsent()
  else denyConsent()
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cookie-consent:changed', { detail: value }))
  }
}
