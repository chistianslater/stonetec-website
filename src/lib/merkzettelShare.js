// Teilen des Merkzettels — ohne Serverspeicher.
//
// Die Auswahl steckt vollständig in der URL. Dadurch gibt es keine Datenbank,
// keine Aufbewahrungsfristen und keinen Eintrag in der Datenschutzerklärung.
// Ein geteilter Link funktioniert, solange die Bilder existieren; gelöschte
// Bilder werden beim Öffnen stillschweigend übersprungen.

import { sanitizeIds } from './merkzettel.js'

export const SHARE_PARAM = 'auswahl'

const SHARE_SUBJECT = 'Meine Auswahl aus dem stonetec-Lookbook'

export function shareText(count) {
  const bilder = count === 1 ? '1 Bild' : `${count} Bilder`
  return `Schau mal — ${bilder} aus dem stonetec-Lookbook, die mir gefallen:`
}

export function buildShareUrl(baseUrl, ids) {
  const clean = sanitizeIds(ids)
  // Basis für relative Eingaben; für absolute URLs bleibt sie wirkungslos.
  const url = new URL(baseUrl, 'https://stonetec-bocholt.de')
  if (clean.length === 0) {
    url.searchParams.delete(SHARE_PARAM)
  } else {
    url.searchParams.set(SHARE_PARAM, clean.join(','))
  }
  // searchParams kodiert Kommas zu %2C — für die Lesbarkeit zurückdrehen.
  return url.toString().replace(/%2C/g, ',')
}

export function parseShareParam(search) {
  const value = new URLSearchParams(search).get(SHARE_PARAM)
  if (!value) return []
  return sanitizeIds(value.split(','))
}

export function hasShareParam(search) {
  return new URLSearchParams(search).has(SHARE_PARAM)
}

export function stripShareParam(search) {
  const params = new URLSearchParams(search)
  params.delete(SHARE_PARAM)
  const rest = params.toString()
  return rest === '' ? '' : `?${rest}`
}

export function buildWhatsappUrl(url, count) {
  return `https://wa.me/?text=${encodeURIComponent(`${shareText(count)}\n${url}`)}`
}

export function buildMailtoUrl(url, count) {
  const subject = encodeURIComponent(SHARE_SUBJECT)
  const body = encodeURIComponent(`${shareText(count)}\n\n${url}`)
  return `mailto:?subject=${subject}&body=${body}`
}
