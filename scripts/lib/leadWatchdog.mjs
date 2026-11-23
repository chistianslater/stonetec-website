// Bewertet die Gesundheit der Lead-Kette (Formular → Hero → GA4 → Google Ads).
// Reine Funktionen ohne Netzwerk, damit sie testbar sind. Die Datenbeschaffung
// liegt in scripts/lead-watchdog.mjs.

const DAY = 86400
const LEVELS = { ok: 0, warn: 1, alarm: 2 }

function finding(level, code, message) {
  return { level, code, message }
}

// Kalendertag in Europe/Berlin ("2026-11-23") — GA4 und Ads rechnen in Property-/Kontozeitzone.
export function berlinDate(sec) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(sec * 1000))
}

// Fenster für den Abgleich mit GA4/Ads, in GANZEN Berliner Tagen auf beiden Seiten.
// Die letzten Tage bleiben außen vor, weil GA4 bis zu ~48 h nachliefert.
export function reconciliationDates(nowSec, spanDays = 14, lagDays = 2) {
  return { from: berlinDate(nowSec - (spanDays + lagDays) * DAY), to: berlinDate(nowSec - lagDays * DAY) }
}

function inWindow(lead, dates) {
  const day = berlinDate(lead.ts)
  return day >= dates.from && day <= dates.to
}

/**
 * @param {object} input
 * @param {object|null} input.health      Antwort von lead_health.php (mit export=1) oder null, wenn nicht erreichbar
 * @param {number} input.nowSec           aktueller Unix-Zeitpunkt
 * @param {{leads:number, sessions7d:number, baselineLeadsPerDay:number}|null} [input.ga4]
 *        GA4-Zahlen: generate_lead im Abgleichsfenster, Sitzungen der letzten 7 Tage,
 *        durchschnittliche Leads pro Tag der letzten 60 Tage (Basislinie)
 * @param {{conversions:number}|null} [input.ads]  Ads-Conversions der Kampagne im Abgleichsfenster
 * @param {boolean} [input.ga4Expected]   GA4-Abgleich ist eingerichtet — fehlen die Zahlen, ist das selbst ein Befund
 * @param {boolean} [input.adsExpected]   dito für Google Ads
 * @param {number} [input.minSessions7d]  ab dieser Besucherzahl gilt "kein Lead" als verdächtig
 * @returns {{status:'ok'|'warn'|'alarm', findings:Array}}
 */
export function evaluateLeadHealth({ health, nowSec, ga4 = null, ads = null, ga4Expected = false, adsExpected = false, minSessions7d = 40 }) {
  const findings = []

  if (!health || health.status !== 'ok') {
    return {
      status: 'alarm',
      findings: [finding('alarm', 'health_unreachable',
        'Lead-Health-Endpunkt nicht erreichbar oder nicht autorisiert — die Überwachung ist blind. Server, Token und LEAD_HEALTH_TOKEN prüfen.')],
    }
  }

  const { config = {}, summary = {}, leads = [] } = health

  if (!config.hero_key_set) findings.push(finding('alarm', 'hero_key_missing', 'HERO_API_KEY ist auf dem Server nicht gesetzt — Anfragen gehen nicht ins CRM.'))
  if (!config.ga4_secret_set) findings.push(finding('alarm', 'ga4_secret_missing', 'GA4_API_SECRET fehlt — die serverseitige Conversion wird nicht gesendet.'))
  if (!config.journal_writable) findings.push(finding('alarm', 'journal_not_writable', 'Lead-Journal ist nicht beschreibbar — Anfragen werden nicht protokolliert.'))
  if (!config.fallback_mail_set) findings.push(finding('warn', 'fallback_mail_missing', 'LEAD_FALLBACK_EMAIL ist nicht gesetzt — fällt Hero aus, geht die Anfrage verloren.'))

  if (health.ga4_check && health.ga4_check.ok === false) {
    const detail = (health.ga4_check.messages || []).join('; ') || `HTTP ${health.ga4_check.http ?? '?'}`
    findings.push(finding('alarm', 'ga4_check_failed', `GA4-Prüfung fehlgeschlagen: ${detail}`))
  }

  const lost = summary.lost_7d ?? leads.filter((l) => l.ts >= nowSec - 7 * DAY && l.ts < nowSec - 600 && !l.delivered).length
  if ((summary.hero_failed_7d || 0) > 0) {
    findings.push(finding('alarm', 'hero_failures',
      `${summary.hero_failed_7d} Anfrage(n) in 7 Tagen konnten nicht an Hero übergeben werden` +
      (lost > 0 ? '' : ' (per Fallback-Mail zugestellt)') + '.'))
  }
  // Auch Abstürze ohne Hero-/Mail-Eintrag: Anfrage eingegangen, aber nirgends angekommen.
  if (lost > 0) {
    findings.push(finding('alarm', 'leads_lost',
      `${lost} Anfrage(n) der letzten 7 Tage wurden NICHT zugestellt (VERLOREN) — Kontaktdaten stehen nicht im Journal, beim Besucher nachfassen bzw. Server-Log prüfen.`))
  }
  if ((summary.ga4_failed_7d || 0) > 0) {
    findings.push(finding('alarm', 'ga4_delivery_failures',
      `Bei ${summary.ga4_failed_7d} Anfrage(n) der letzten 7 Tage ist das GA4-Event nicht angekommen.`))
  }

  // Abgleich eingerichtet, aber Zahlen nicht abrufbar → nicht stillschweigend überspringen
  if (ga4Expected && !ga4) findings.push(finding('warn', 'ga4_reconcile_unavailable', 'GA4-Abgleich ist eingerichtet, die Abfrage ist aber fehlgeschlagen — der Hauptausfallweg (GA4 zählt nicht) ist derzeit nicht überwacht.'))
  if (adsExpected && !ads) findings.push(finding('warn', 'ads_reconcile_unavailable', 'Ads-Abgleich ist eingerichtet, die Abfrage ist aber fehlgeschlagen.'))

  // Keine Leads trotz Besuchern
  if (ga4 && (summary.received_7d || 0) === 0) {
    const expectsLeads = ga4.baselineLeadsPerDay >= 0.1
    if (expectsLeads && ga4.sessions7d >= minSessions7d) {
      findings.push(finding('alarm', 'no_leads_with_traffic',
        `7 Tage keine Anfrage, obwohl ${ga4.sessions7d} Sitzungen (üblich: ${(ga4.baselineLeadsPerDay * 7).toFixed(1)} Anfragen/Woche). Formular und Kette prüfen.`))
    }
  }

  // Journal ↔ GA4
  const dates = reconciliationDates(nowSec)
  const delivered = leads.filter((l) => l.delivered && inWindow(l, dates))
  // Ohne Einwilligung feuert zusätzlich der cookielose Browser-Ping → GA4 darf pro
  // solcher Anfrage einen mehr zählen, ohne dass das auffällt.
  const withoutConsent = delivered.filter((l) => l.consent !== 'accepted').length
  if (ga4 && typeof ga4.leads === 'number') {
    const gap = delivered.length - ga4.leads
    if (gap >= 2 || (ga4.leads === 0 && delivered.length >= 1)) {
      findings.push(finding('alarm', 'ga4_missing_leads',
        `Journal: ${delivered.length} zugestellte Anfragen, GA4 zählt ${ga4.leads} (Fenster 14 Tage, 2 Tage Verzug). GA4 verliert Leads.`))
    } else if (ga4.leads - delivered.length >= 2 + withoutConsent) {
      findings.push(finding('warn', 'ga4_extra_leads',
        `GA4 zählt ${ga4.leads} Leads, das Journal nur ${delivered.length} — mögliche Doppelzählung (Browser- und Server-Event) oder Testanfragen.`))
    }
  }

  // Journal ↔ Ads: Anfragen mit Klick-ID müssen als Conversion auftauchen
  if (ads && typeof ads.conversions === 'number') {
    // Nur Anfragen mit Einwilligung: ohne sie importiert Google keine Conversion.
    const clickLeads = delivered.filter((l) => l.consent === 'accepted' && (l.gclid || l.gbraid || l.wbraid))
    if (clickLeads.length >= 2 && ads.conversions === 0) {
      findings.push(finding('warn', 'ads_not_counting',
        `${clickLeads.length} Anfragen mit Anzeigen-Klick-ID, aber 0 Conversions in Google Ads — Import/Attribution prüfen (Offline-Upload kann das auffangen).`))
    }
  }

  const status = findings.reduce((acc, f) => (LEVELS[f.level] > LEVELS[acc] ? f.level : acc), 'ok')
  return { status, findings }
}

/** Kurznachricht für Telegram o. Ä. */
export function formatAlert(result, label = 'StoneTec Lead-Kette') {
  const icon = result.status === 'alarm' ? '🚨' : result.status === 'warn' ? '⚠️' : '✅'
  if (result.findings.length === 0) return `${icon} ${label}: alles in Ordnung.`
  const lines = result.findings.map((f) => `${f.level === 'alarm' ? '🔴' : '🟡'} ${f.message}`)
  return `${icon} ${label}: ${result.status.toUpperCase()}\n${lines.join('\n')}`
}

/** Soll eine Meldung raus? Nur bei geänderter Lage oder nach 24 h Dauerstörung; Entwarnung einmalig. */
export function shouldNotify(prev, result, nowSec) {
  const codes = result.findings.map((f) => f.code).sort().join(',')
  if (result.status === 'ok') return Boolean(prev && prev.status !== 'ok')
  if (!prev || prev.status === 'ok') return true
  if (prev.codes !== codes) return true
  return nowSec - (prev.notifiedAt || 0) >= DAY
}

export function nextState(prev, result, nowSec, notified) {
  const codes = result.findings.map((f) => f.code).sort().join(',')
  return {
    status: result.status,
    codes,
    checkedAt: nowSec,
    notifiedAt: notified ? nowSec : (prev?.notifiedAt ?? 0),
  }
}
