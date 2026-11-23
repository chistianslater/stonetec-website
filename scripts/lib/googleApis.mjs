// Schlanke REST-Clients für Google Ads und GA4 (ohne zusätzliche Abhängigkeiten).
// Zugangsdaten kommen ausschließlich aus Umgebungsvariablen bzw. einer Service-
// Account-Datei — nichts davon steht im Repo.

import { createSign } from 'node:crypto'
import { readFile } from 'node:fs/promises'

const ADS_BASE = 'https://googleads.googleapis.com/v24'

async function postJson(url, body, headers = {}, fetchImpl = fetch) {
  const res = await fetchImpl(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  let json = null
  try { json = JSON.parse(text) } catch { /* kein JSON */ }
  if (!res.ok) throw new Error(`HTTP ${res.status} von ${new URL(url).host}: ${text.slice(0, 300)}`)
  return json
}

// ── Google Ads ────────────────────────────────────────────────────────────────

export function adsCredentialsFromEnv(env = process.env) {
  const need = ['GOOGLE_ADS_DEVELOPER_TOKEN', 'GOOGLE_ADS_CLIENT_ID', 'GOOGLE_ADS_CLIENT_SECRET', 'GOOGLE_ADS_REFRESH_TOKEN']
  const missing = need.filter((k) => !env[k])
  if (missing.length) throw new Error(`Fehlende Umgebungsvariablen: ${missing.join(', ')}`)
  return {
    developerToken: env.GOOGLE_ADS_DEVELOPER_TOKEN,
    clientId: env.GOOGLE_ADS_CLIENT_ID,
    clientSecret: env.GOOGLE_ADS_CLIENT_SECRET,
    refreshToken: env.GOOGLE_ADS_REFRESH_TOKEN,
    loginCustomerId: (env.GOOGLE_ADS_MCC_CUSTOMER_ID || '').replace(/-/g, ''),
  }
}

export async function adsAccessToken(creds, fetchImpl = fetch) {
  const body = new URLSearchParams({
    client_id: creds.clientId, client_secret: creds.clientSecret,
    refresh_token: creds.refreshToken, grant_type: 'refresh_token',
  })
  const res = await fetchImpl('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body,
  })
  const json = await res.json()
  if (!res.ok || !json.access_token) throw new Error(`Ads-OAuth fehlgeschlagen: ${json.error_description || json.error || res.status}`)
  return json.access_token
}

function adsHeaders(creds, accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`,
    'developer-token': creds.developerToken,
    ...(creds.loginCustomerId ? { 'login-customer-id': creds.loginCustomerId } : {}),
  }
}

export async function adsSearch(creds, accessToken, customerId, query, fetchImpl = fetch) {
  const json = await postJson(`${ADS_BASE}/customers/${customerId}/googleAds:search`, { query }, adsHeaders(creds, accessToken), fetchImpl)
  return json?.results ?? []
}

export function uploadClickConversions(creds, accessToken, customerId, conversions, { validateOnly = false } = {}, fetchImpl = fetch) {
  return postJson(
    `${ADS_BASE}/customers/${customerId}:uploadClickConversions`,
    { conversions, partialFailure: true, validateOnly },
    adsHeaders(creds, accessToken), fetchImpl,
  )
}

/** Legt eine Conversion-Aktion für den Klick-Upload an — bewusst SEKUNDÄR (steuert kein Bidding). */
export function createUploadConversionAction(creds, accessToken, customerId, name, { validateOnly = false } = {}, fetchImpl = fetch) {
  return postJson(
    `${ADS_BASE}/customers/${customerId}/conversionActions:mutate`,
    {
      operations: [{
        create: {
          name, type: 'UPLOAD_CLICKS', category: 'SUBMIT_LEAD_FORM', status: 'ENABLED',
          primaryForGoal: false, countingType: 'ONE_PER_CLICK',
          valueSettings: { defaultValue: 0, alwaysUseDefaultValue: true },
          attributionModelSettings: { attributionModel: 'GOOGLE_ADS_LAST_CLICK' },
        },
      }],
      validateOnly,
    },
    adsHeaders(creds, accessToken), fetchImpl,
  )
}

// ── GA4 Data API (Service-Account) ───────────────────────────────────────────

function b64url(input) {
  return Buffer.from(input).toString('base64url')
}

export async function ga4AccessToken(serviceAccountFile, fetchImpl = fetch) {
  const sa = JSON.parse(await readFile(serviceAccountFile, 'utf8'))
  const now = Math.floor(Date.now() / 1000)
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claim = b64url(JSON.stringify({
    iss: sa.client_email, scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
  }))
  const signature = createSign('RSA-SHA256').update(`${header}.${claim}`).sign(sa.private_key, 'base64url')
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${header}.${claim}.${signature}`,
  })
  const res = await fetchImpl('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body,
  })
  const json = await res.json()
  if (!res.ok || !json.access_token) throw new Error(`GA4-OAuth fehlgeschlagen: ${json.error_description || json.error || res.status}`)
  return json.access_token
}

export async function ga4Report(accessToken, propertyId, request, fetchImpl = fetch) {
  return postJson(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    request, { Authorization: `Bearer ${accessToken}` }, fetchImpl,
  )
}
