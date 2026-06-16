export async function submitLead(formData) {
  const res = await fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
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
