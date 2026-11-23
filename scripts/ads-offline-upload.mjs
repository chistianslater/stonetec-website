#!/usr/bin/env node
// Meldet Formular-Anfragen aus dem Lead-Journal als Offline-Conversion an Google Ads
// zurück — unabhängig von GA4-Cookies und Tag-Auslieferung.
//
//   node scripts/ads-offline-upload.mjs --create-action            Trockenlauf: Conversion-Aktion anlegen
//   node scripts/ads-offline-upload.mjs --create-action --apply    legt "StoneTec Lead (Server)" an (SEKUNDÄR)
//   node scripts/ads-offline-upload.mjs                            Trockenlauf: zeigt, was hochgeladen würde
//   node scripts/ads-offline-upload.mjs --apply                    lädt hoch
//
// Standard ist immer der Trockenlauf; ohne --apply wird in Google Ads nichts geschrieben.
// (--validate nutzt validateOnly: Google prüft den Upload, ohne ihn zu speichern.)
//
// Umgebungsvariablen: LEAD_HEALTH_TOKEN, LEAD_HEALTH_URL (optional), GOOGLE_ADS_*,
// ADS_OFFLINE_CONVERSION_ACTION_ID (Zahl, nach --create-action), UPLOAD_STATE (optional).
//
// Nur Anfragen mit Einwilligung ("accepted") werden hochgeladen — ohne Zustimmung
// dürfen Ad-Daten nicht an Google übermittelt werden (Consent Mode v2 / DMA).

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { buildClickConversion, selectUploadable, summarizeUploadResponse, updateUploadState } from './lib/offlineConversions.mjs'
import { adsAccessToken, adsCredentialsFromEnv, createUploadConversionAction, uploadClickConversions } from './lib/googleApis.mjs'

const CUSTOMER = '1011974649'
const args = new Set(process.argv.slice(2))
const APPLY = args.has('--apply')
const VALIDATE = args.has('--validate')
if (APPLY && VALIDATE) throw new Error('--apply und --validate schließen sich aus: --validate prüft nur, --apply lädt hoch.')
const env = process.env
const nowSec = Math.floor(Date.now() / 1000)

const creds = adsCredentialsFromEnv(env)
const accessToken = await adsAccessToken(creds)

if (args.has('--create-action')) {
  const res = await createUploadConversionAction(creds, accessToken, CUSTOMER, 'StoneTec Lead (Server)', { validateOnly: !APPLY })
  process.stdout.write(JSON.stringify({ applied: APPLY, response: res }, null, 2) + '\n')
  if (APPLY) process.stdout.write('Die ID aus resourceName (…/conversionActions/<ID>) als ADS_OFFLINE_CONVERSION_ACTION_ID setzen.\n')
  process.exit(0)
}

const actionId = env.ADS_OFFLINE_CONVERSION_ACTION_ID
if (!actionId || !/^\d+$/.test(actionId)) throw new Error('ADS_OFFLINE_CONVERSION_ACTION_ID fehlt oder ist keine Zahl (erst --create-action ausführen)')
if (!env.LEAD_HEALTH_TOKEN) throw new Error('LEAD_HEALTH_TOKEN fehlt')

const stateFile = env.UPLOAD_STATE || path.join(os.homedir(), '.lead-watchdog', 'stonetec-offline-upload.json')
let state = {}
try { state = JSON.parse(await readFile(stateFile, 'utf8')) } catch { /* erster Lauf */ }
const uploadedIds = new Set(state.uploadedIds ?? [])

const base = env.LEAD_HEALTH_URL || 'https://stonetec-bocholt.de/api/lead_health.php'
const url = new URL(`${base}?days=90&export=1`)
if (url.protocol !== 'https:' && !['127.0.0.1', 'localhost'].includes(url.hostname)) throw new Error('LEAD_HEALTH_URL muss https sein')
const res = await fetch(url, {
  headers: { Authorization: `Bearer ${env.LEAD_HEALTH_TOKEN}`, 'X-Lead-Token': env.LEAD_HEALTH_TOKEN },
  redirect: 'error', // Token nie über Redirects weitergeben
  signal: AbortSignal.timeout(20000),
})
if (!res.ok) throw new Error(`Health-Endpunkt HTTP ${res.status}`)
const { leads = [] } = await res.json()

const actionResource = `customers/${CUSTOMER}/conversionActions/${actionId}`
const candidates = selectUploadable(leads, { uploadedIds, nowSec })
const conversions = candidates.map((l) => buildClickConversion(l, actionResource))

if (conversions.length === 0) {
  process.stdout.write(JSON.stringify({ applied: APPLY, candidates: 0, note: 'Nichts hochzuladen.' }, null, 2) + '\n')
  process.exit(0)
}
if (!APPLY && !VALIDATE) {
  process.stdout.write(JSON.stringify({ applied: false, candidates: conversions.length, preview: conversions.map((c) => ({ ...c, gclid: c.gclid ? '…' : undefined })) }, null, 2) + '\n')
  process.exit(0)
}

const response = await uploadClickConversions(creds, accessToken, CUSTOMER, conversions, { validateOnly: !APPLY })
const summary = summarizeUploadResponse(response, conversions.length)
process.stdout.write(JSON.stringify({ applied: APPLY, ...summary, response }, null, 2) + '\n')

// Zustand fortschreiben: erfolgreiche und nach 3 Versuchen aufgegebene Einträge gelten als
// erledigt, abgelehnte werden erneut versucht. Google verwirft Duplikate zusätzlich per orderId.
if (APPLY) {
  const next = updateUploadState(state, candidates, response)
  await mkdir(path.dirname(stateFile), { recursive: true })
  await writeFile(stateFile, JSON.stringify(next, null, 2))
}
process.exit(summary.hasPartialFailure ? 1 : 0)
