// Google-Ads-Klick-IDs (gclid/gbraid/wbraid) für die Server-Seite festhalten.
//
// Warum: Die serverseitige Conversion-Kette hängt sonst an GA4-Cookies und
// Einwilligung. Mit der Klick-ID im Lead-Journal kann der Offline-Upload
// (scripts/ads-offline-upload.mjs) die Anfrage unabhängig von GA4 an die
// Anzeige zurückmelden.
//
// Datenschutz: Die ID steht beim Landen in der URL und liegt im Arbeitsspeicher.
// In sessionStorage wird sie NUR nach aktiver Zustimmung ("accepted") gelegt, weil
// das ein Zugriff auf das Endgerät ist. Ohne Zustimmung gilt sie nur für die
// aktuelle Seiten-Sitzung ohne Neuladen (SPA-Navigation reicht für das Formular).

import { getConsent } from './consent.js'

const STORAGE_KEY = 'stonetec-ad-click'
const PARAMS = ['gclid', 'gbraid', 'wbraid']
const SAFE_ID = /^[A-Za-z0-9_-]{1,200}$/

let memory = {}

function pick(search) {
  const params = new URLSearchParams(search || '')
  const found = {}
  for (const name of PARAMS) {
    const value = params.get(name)
    if (value && SAFE_ID.test(value)) found[name] = value
  }
  return found
}

function readStored() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return pick(new URLSearchParams(parsed).toString())
  } catch {
    return {}
  }
}

function writeStored(ids) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    /* sessionStorage nicht verfügbar — ignorieren */
  }
}

// Beim App-Start aufrufen: liest die Klick-ID aus der URL (neue ID gewinnt).
export function captureClickIds(search = typeof window === 'undefined' ? '' : window.location.search) {
  const found = pick(search)
  if (Object.keys(found).length === 0) return
  memory = found
  if (getConsent() === 'accepted') writeStored(found)
}

// Liefert die aktuell bekannten Klick-IDs (Arbeitsspeicher, sonst Storage bei Zustimmung).
export function getClickIds() {
  if (Object.keys(memory).length > 0) return { ...memory }
  return getConsent() === 'accepted' ? readStored() : {}
}

// Nach einer Zustimmung im selben Besuch: im Speicher gehaltene ID nachträglich ablegen.
export function persistClickIdsAfterConsent() {
  if (Object.keys(memory).length > 0 && getConsent() === 'accepted') writeStored(memory)
}

// Nur für Tests.
export function _resetClickIds() {
  memory = {}
}
