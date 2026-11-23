// Offline-Conversions aus dem Lead-Journal für den Google-Ads-Upload aufbereiten.
// Reine Funktionen — keine Netzwerkzugriffe.

const DAY = 86400
export const MAX_AGE_DAYS = 90 // Google akzeptiert Klick-Conversions bis 90 Tage nach dem Klick

/** "2026-11-23 05:43:39+01:00" in der angegebenen Zeitzone. */
export function formatAdsDateTime(tsSec, timeZone = 'Europe/Berlin') {
  const date = new Date(tsSec * 1000)
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone, hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).formatToParts(date).map((p) => [p.type, p.value]),
  )
  const offsetName = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
    .formatToParts(date).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT'
  const offset = offsetName === 'GMT' ? '+00:00' : offsetName.replace('GMT', '')
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}${offset}`
}

/** Genau EINE Klick-ID pro Conversion (Priorität gclid > gbraid > wbraid). */
export function clickIdFields(lead) {
  if (lead.gclid) return { gclid: lead.gclid }
  if (lead.gbraid) return { gbraid: lead.gbraid }
  if (lead.wbraid) return { wbraid: lead.wbraid }
  return null
}

/**
 * Welche Anfragen dürfen hochgeladen werden?
 * - zugestellt (Hero oder Fallback-Mail), sonst ist es kein echter Lead
 * - Klick-ID vorhanden
 * - Einwilligung "accepted" — Voraussetzung für Ad-Daten (Consent Mode v2 / DMA)
 * - noch nicht hochgeladen und nicht älter als 90 Tage
 */
export function selectUploadable(leads, { uploadedIds = new Set(), nowSec }) {
  return leads.filter((l) =>
    l.delivered &&
    clickIdFields(l) &&
    l.consent === 'accepted' &&
    !uploadedIds.has(l.id) &&
    nowSec - l.ts <= MAX_AGE_DAYS * DAY,
  )
}

export function buildClickConversion(lead, conversionActionResource) {
  const click = clickIdFields(lead)
  if (!click) throw new Error(`Lead ${lead.id} hat keine Klick-ID`)
  return {
    ...click,
    conversionAction: conversionActionResource,
    conversionDateTime: formatAdsDateTime(lead.ts),
    // order_id macht den Upload idempotent: Google verwirft Duplikate derselben ID.
    orderId: lead.id,
    consent: { adUserData: 'GRANTED', adPersonalization: 'GRANTED' },
  }
}

/** Zählt Ablehnungsgründe/Teilfehler der API-Antwort (partialFailureError). */
export function summarizeUploadResponse(response, sent) {
  const failureCount = response?.partialFailureError?.details?.[0]?.errors?.length ?? 0
  const results = Array.isArray(response?.results) ? response.results : []
  const accepted = results.filter((r) => r && Object.keys(r).length > 0).length
  return { sent, accepted, failureCount, hasPartialFailure: Boolean(response?.partialFailureError) }
}

/** Indizes der abgelehnten Einträge aus partialFailureError (Reihenfolge wie gesendet). */
export function failedIndices(response) {
  const indices = new Set()
  for (const detail of response?.partialFailureError?.details ?? []) {
    for (const error of detail?.errors ?? []) {
      const idx = error?.location?.fieldPathElements?.find((e) => e.fieldName === 'conversions')?.index
      if (Number.isInteger(idx)) indices.add(idx)
    }
  }
  return indices
}

export const MAX_ATTEMPTS = 3

/**
 * Aktualisiert den Upload-Zustand nach einem Versuch:
 * erfolgreich → erledigt; abgelehnt → bis MAX_ATTEMPTS erneut versuchen, dann aufgeben
 * (verhindert, dass ein dauerhaft ungültiger Eintrag täglich neu gesendet wird);
 * ist der Teilfehler nicht zuordenbar, wird NICHTS als erledigt markiert.
 */
export function updateUploadState(state, candidates, response) {
  const uploaded = new Set(state.uploadedIds ?? [])
  const attempts = { ...(state.attempts ?? {}) }
  const failed = failedIndices(response)
  const unattributable = Boolean(response?.partialFailureError) && failed.size === 0
  if (unattributable) return { uploadedIds: [...uploaded], attempts }
  candidates.forEach((lead, i) => {
    if (!failed.has(i)) { uploaded.add(lead.id); delete attempts[lead.id]; return }
    attempts[lead.id] = (attempts[lead.id] ?? 0) + 1
    if (attempts[lead.id] >= MAX_ATTEMPTS) { uploaded.add(lead.id); delete attempts[lead.id] }
  })
  return { uploadedIds: [...uploaded], attempts }
}
