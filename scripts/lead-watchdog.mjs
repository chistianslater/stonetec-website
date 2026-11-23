#!/usr/bin/env node
// Täglicher Wächter für die Lead-Kette (Formular → Hero → GA4 → Google Ads).
//
//   node scripts/lead-watchdog.mjs                    prüft, meldet bei Bedarf per Telegram
//   node scripts/lead-watchdog.mjs --channel=agent    prüft und liefert "notify"/"subject"/"text" im JSON;
//                                                     der aufrufende Agent versendet die Mail
//   node scripts/lead-watchdog.mjs --dry              prüft nur, sendet nichts, schreibt keinen Zustand
//   node scripts/lead-watchdog.mjs --test-mail        erzwingt notify=true mit Testtext (Mailweg prüfen)
//
// Exit-Code: 0 = ok, 1 = Warnung, 2 = Alarm. Ausgabe: JSON auf stdout.
//
// Umgebungsvariablen (Werte nie ins Repo):
//   LEAD_HEALTH_TOKEN            Pflicht — Token für /api/lead_health.php
//   LEAD_HEALTH_URL              optional, Standard https://stonetec-bocholt.de/api/lead_health.php
//   GA4_SERVICE_ACCOUNT_FILE     optional — aktiviert den Abgleich mit GA4
//   GA4_PROPERTY_ID              optional, Standard 542254764
//   GOOGLE_ADS_*                 optional — aktiviert den Abgleich mit Google Ads (Kunde 1011974649)
//   TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID   optional — Benachrichtigung
//   LEAD_WATCHDOG_STATE          optional, Standard ~/.lead-watchdog/stonetec.json

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { evaluateLeadHealth, formatAlert, nextState, reconciliationDates, shouldNotify } from './lib/leadWatchdog.mjs'
import { adsAccessToken, adsCredentialsFromEnv, adsSearch, ga4AccessToken, ga4Report } from './lib/googleApis.mjs'

const DRY = process.argv.includes('--dry')
const AGENT_CHANNEL = process.argv.includes('--channel=agent')
const TEST_MAIL = process.argv.includes('--test-mail')
const ADS_CUSTOMER = '1011974649'
const env = process.env
const nowSec = Math.floor(Date.now() / 1000)


async function fetchHealth() {
  const token = env.LEAD_HEALTH_TOKEN
  if (!token) throw new Error('LEAD_HEALTH_TOKEN fehlt')
  const base = env.LEAD_HEALTH_URL || 'https://stonetec-bocholt.de/api/lead_health.php'
  const url = new URL(`${base}?days=30&export=1&check_ga4=1`)
  // Token nur über TLS (lokaler Test gegen 127.0.0.1 ausgenommen) und nie über Redirects.
  if (url.protocol !== 'https:' && !['127.0.0.1', 'localhost'].includes(url.hostname)) throw new Error('LEAD_HEALTH_URL muss https sein')
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, 'X-Lead-Token': token },
    redirect: 'error',
    signal: AbortSignal.timeout(20000),
  })
  if (!res.ok) throw new Error(`Health-Endpunkt HTTP ${res.status}`)
  return res.json()
}

async function fetchGa4() {
  if (!env.GA4_SERVICE_ACCOUNT_FILE) return null
  const property = env.GA4_PROPERTY_ID || '542254764'
  const token = await ga4AccessToken(env.GA4_SERVICE_ACCOUNT_FILE)
  const win = reconciliationDates(nowSec)
  const leadFilter = { filter: { fieldName: 'eventName', stringFilter: { matchType: 'EXACT', value: 'generate_lead' } } }

  const [window, sessions, baseline] = await Promise.all([
    ga4Report(token, property, {
      dateRanges: [{ startDate: win.from, endDate: win.to }],
      metrics: [{ name: 'eventCount' }], dimensionFilter: leadFilter,
    }),
    ga4Report(token, property, { dateRanges: [{ startDate: '7daysAgo', endDate: 'yesterday' }], metrics: [{ name: 'sessions' }] }),
    ga4Report(token, property, {
      dateRanges: [{ startDate: '60daysAgo', endDate: 'yesterday' }],
      metrics: [{ name: 'eventCount' }], dimensionFilter: leadFilter,
    }),
  ])
  const num = (r) => Number(r?.rows?.[0]?.metricValues?.[0]?.value ?? 0)
  return { leads: num(window), sessions7d: num(sessions), baselineLeadsPerDay: num(baseline) / 60 }
}

async function fetchAds() {
  let creds
  try { creds = adsCredentialsFromEnv(env) } catch { return null }
  const token = await adsAccessToken(creds)
  const win = reconciliationDates(nowSec)
  // Konto-Ebene: Anfragen stammen aus allen Kampagnen. Hinweis: segments.date ist das
  // Klick-, nicht das Conversion-Datum — der Vergleich dient nur als Warnsignal.
  const rows = await adsSearch(creds, token, ADS_CUSTOMER,
    `SELECT metrics.conversions FROM customer WHERE segments.date BETWEEN '${win.from}' AND '${win.to}'`)
  return { conversions: rows.reduce((sum, r) => sum + Number(r.metrics?.conversions ?? 0), 0) }
}

async function safe(label, fn) {
  try { return await fn() } catch (err) {
    process.stderr.write(`[watchdog] ${label}: ${err.message}\n`)
    return null
  }
}

async function readState(file) {
  try { return JSON.parse(await readFile(file, 'utf8')) } catch { return null }
}

async function notifyTelegram(text) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return false
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text }),
  })
  return res.ok
}

const health = await safe('health', fetchHealth)
const [ga4, ads] = health ? await Promise.all([safe('ga4', fetchGa4), safe('ads', fetchAds)]) : [null, null]
const ga4Expected = Boolean(env.GA4_SERVICE_ACCOUNT_FILE)
const adsExpected = ['GOOGLE_ADS_DEVELOPER_TOKEN', 'GOOGLE_ADS_REFRESH_TOKEN'].every((k) => env[k])
const result = evaluateLeadHealth({ health, nowSec, ga4, ads, ga4Expected, adsExpected })
const text = formatAlert(result)

const stateFile = env.LEAD_WATCHDOG_STATE || path.join(os.homedir(), '.lead-watchdog', 'stonetec.json')
const prev = await readState(stateFile)
const due = TEST_MAIL || shouldNotify(prev, result, nowSec)
let notified = false
if (!DRY && !TEST_MAIL && due) {
  // Agent-Kanal: Der Agent versendet die Mail; der Zustand gilt ab jetzt als gemeldet.
  notified = AGENT_CHANNEL ? true : (await safe('telegram', () => notifyTelegram(text)) === true)
}
const statusLabel = result.status === 'alarm' ? 'ALARM' : result.status === 'warn' ? 'Warnung' : 'Entwarnung'
const subject = TEST_MAIL ? '[StoneTec] Lead-Wächter: Testmail' : `[StoneTec] Lead-Kette: ${statusLabel}`
const mailText = TEST_MAIL ? 'Testmail des Lead-Wächters. Der Mailweg funktioniert.\n\n' + text : text
if (!DRY) {
  await mkdir(path.dirname(stateFile), { recursive: true })
  await writeFile(stateFile, JSON.stringify(nextState(prev, result, nowSec, notified), null, 2))
}

process.stdout.write(JSON.stringify({ ...result, text: mailText, subject, notify: AGENT_CHANNEL && due, summary: health?.summary ?? null, ga4, ads, notified }, null, 2) + '\n')
process.exit(result.status === 'alarm' ? 2 : result.status === 'warn' ? 1 : 0)
