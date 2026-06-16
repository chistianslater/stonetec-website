// Reine Helfer für die Hero Lead-API. Kein I/O — unit-testbar.
export const PROJECT_SOURCE = 'stonetec Website – Kontaktformular'

const VORHABEN_LABELS = { neubau: 'Neubau', sanierung: 'Sanierung', reparatur: 'Reparatur' }
const BEREICH_LABELS = {
  bad: 'Badezimmer', kueche: 'Küche', wohnbereich: 'Wohnbereich',
  aussen: 'Außen & Terrasse', gewerbe: 'Gewerbe', sonstiges: 'Sonstiges',
}
const TAGESZEIT_LABELS = { vormittags: 'vormittags', nachmittags: 'nachmittags' }
const WEEKDAY_LABELS = { mo: 'Mo', di: 'Di', mi: 'Mi', do: 'Do', fr: 'Fr', sa: 'Sa' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLead(data) {
  if (!data || typeof data !== 'object') return { valid: false, errors: { _: 'Ungültige Daten' } }
  const errors = {}
  if (!data.firstName?.trim()) errors.firstName = 'Vorname fehlt'
  if (!data.lastName?.trim()) errors.lastName = 'Nachname fehlt'
  if (!data.email?.trim() || !EMAIL_RE.test(data.email.trim())) errors.email = 'Gültige E-Mail erforderlich'
  if (!data.zipcode?.trim() || !/^\d{4,5}$/.test(data.zipcode.trim())) errors.zipcode = 'Gültige PLZ erforderlich'
  if (!data.privacy) errors.privacy = 'Zustimmung erforderlich'
  return { valid: Object.keys(errors).length === 0, errors }
}

function buildComment(data) {
  const lines = []
  const vorhaben = VORHABEN_LABELS[data.vorhaben] || data.vorhaben || '—'
  const bereichList = Array.isArray(data.bereich) ? data.bereich : (data.bereich ? [data.bereich] : [])
  const bereich = bereichList.map((b) => BEREICH_LABELS[b] || b).join(', ') || '—'
  lines.push(`Vorhaben: ${vorhaben} · Bereich: ${bereich}`)
  const days = (data.weekdays || []).map((d) => WEEKDAY_LABELS[d] || d).join(', ')
  const zeit = (data.daytimes || []).map((t) => TAGESZEIT_LABELS[t] || t).join(' / ')
  if (days || zeit) lines.push(`Erreichbarkeit: ${days || 'flexibel'}${zeit ? ` – ${zeit}` : ''}`)
  if (data.message?.trim()) lines.push(`Nachricht: "${data.message.trim()}"`)
  return lines.join('\n')
}

export function buildHeroPayload(data) {
  const payload = {
    measure: 'PRJ',
    customer: {
      email: data.email.trim(),
      first_name: data.firstName?.trim() || '',
      last_name: data.lastName?.trim() || '',
    },
    address: { zipcode: data.zipcode.trim() },
    project: {
      source: PROJECT_SOURCE,
      source_sub: 'stonetec-bocholt.de',
      source_medium: 'Anfrageformular',
    },
    project_match: { status_code: 201, comment: buildComment(data), inform_partner: true },
  }
  if (data.phone?.trim()) payload.customer.phone_mobile = data.phone.trim()
  if (data.city?.trim()) payload.address.city = data.city.trim()
  if (Array.isArray(data.images) && data.images.length) payload.images = data.images
  return payload
}
