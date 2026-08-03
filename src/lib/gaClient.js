// Liest die GA4 client_id und session_id aus den First-Party-Cookies (_ga …),
// damit die serverseitige Conversion (lead.php → GA4 Measurement Protocol) an
// dieselbe Session/denselben Nutzer attribuiert wird. Nur so bleibt die
// Google-Ads-Attribution (gclid/Kampagne) beim serverseitigen Event erhalten.

const MEASUREMENT_ID = 'G-2CWR9BSMGL'
// Session-Cookie heißt _ga_<STREAM>; beim Web-Stream ist STREAM die Mess-ID ohne "G-".
const SESSION_COOKIE = `_ga_${MEASUREMENT_ID.replace(/^G-/, '')}`

function readCookie(name) {
  if (typeof document === 'undefined') return null
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

// _ga = "GA1.1.<a>.<b>"  →  client_id = "<a>.<b>"
export function getGaClientId() {
  const raw = readCookie('_ga')
  if (!raw) return null
  const parts = raw.split('.')
  return parts.length >= 4 ? `${parts[2]}.${parts[3]}` : null
}

// GS1-Format: "GS1.1.<session_id>.<...>" (Punkt-getrennt)
// GS2-Format (gtag.js seit 2025): "GS2.1.s<session_id>$o<n>$g<n>$..." —
// das 3. Punkt-Feld trägt die restlichen Werte $-getrennt und die session_id
// mit "s"-Präfix.
export function getGaSessionId() {
  const raw = readCookie(SESSION_COOKIE)
  if (!raw) return null
  const parts = raw.split('.')
  if (parts.length < 3) return null
  const match = parts[2].match(/^s?(\d+)/)
  return match ? match[1] : null
}
