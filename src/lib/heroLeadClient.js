import { getGaClientId, getGaSessionId } from './gaClient.js'

export async function submitLead(formData) {
  // GA client_id/session_id mitschicken, damit die serverseitige Conversion
  // (lead.php → GA4 Measurement Protocol) an dieselbe Session attribuiert wird.
  const payload = {
    ...formData,
    ga_client_id: getGaClientId(),
    ga_session_id: getGaSessionId(),
  }
  const res = await fetch('/api/lead.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  let body = null
  try { body = await res.json() } catch { /* ignorieren */ }
  if (!res.ok || body?.status !== 'success') {
    const err = new Error(body?.message || 'Senden fehlgeschlagen. Bitte später erneut versuchen.')
    err.fieldErrors = body?.errors || null
    throw err
  }
  return body
}
