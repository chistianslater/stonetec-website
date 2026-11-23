import { describe, it, expect } from 'vitest'
import { evaluateLeadHealth, formatAlert, shouldNotify, nextState, reconciliationDates, berlinDate } from './leadWatchdog.mjs'

const NOW = 1_800_000_000
const DAY = 86400

const baseHealth = (over = {}) => ({
  status: 'ok',
  config: { hero_key_set: true, ga4_secret_set: true, fallback_mail_set: true, journal_writable: true },
  summary: { received_7d: 2, delivered_7d: 2, hero_failed_7d: 0, ga4_failed_7d: 0 },
  leads: [],
  ...over,
})

const lead = (over = {}) => ({
  id: 'x', ts: NOW - 5 * DAY, delivered: true, gclid: '', gbraid: '', wbraid: '', consent: 'accepted', ...over,
})

const codes = (r) => r.findings.map((f) => f.code)

describe('evaluateLeadHealth', () => {
  it('alles gut → ok', () => {
    expect(evaluateLeadHealth({ health: baseHealth(), nowSec: NOW }).status).toBe('ok')
  })

  it('Endpunkt nicht erreichbar → Alarm', () => {
    const r = evaluateLeadHealth({ health: null, nowSec: NOW })
    expect(r.status).toBe('alarm')
    expect(codes(r)).toEqual(['health_unreachable'])
  })

  it('fehlende Konfiguration → Alarm, fehlende Fallback-Mail → nur Warnung', () => {
    const r = evaluateLeadHealth({
      health: baseHealth({ config: { hero_key_set: false, ga4_secret_set: true, fallback_mail_set: false, journal_writable: true } }),
      nowSec: NOW,
    })
    expect(codes(r)).toEqual(expect.arrayContaining(['hero_key_missing', 'fallback_mail_missing']))
    expect(r.findings.find((f) => f.code === 'fallback_mail_missing').level).toBe('warn')
    expect(r.status).toBe('alarm')
  })

  it('Hero-Ausfall mit verlorener Anfrage → leads_lost', () => {
    const r = evaluateLeadHealth({
      health: baseHealth({
        summary: { received_7d: 1, hero_failed_7d: 1, ga4_failed_7d: 0, lost_7d: 1 },
        leads: [lead({ ts: NOW - DAY, delivered: false })],
      }),
      nowSec: NOW,
    })
    expect(r.findings.find((f) => f.code === 'leads_lost').message).toContain('VERLOREN')
  })

  it('Absturz ohne Hero-/Mail-Eintrag wird als verloren erkannt', () => {
    const r = evaluateLeadHealth({
      health: baseHealth({
        summary: { received_7d: 1, hero_failed_7d: 0, ga4_failed_7d: 0, lost_7d: 1 },
        leads: [lead({ ts: NOW - DAY, delivered: false, hero: null })],
      }),
      nowSec: NOW,
    })
    expect(codes(r)).toContain('leads_lost')
    expect(r.status).toBe('alarm')
  })

  it('Hero-Ausfall mit Fallback-Mail → Alarm, aber nicht verloren', () => {
    const r = evaluateLeadHealth({
      health: baseHealth({
        summary: { received_7d: 1, hero_failed_7d: 1, ga4_failed_7d: 0 },
        leads: [lead({ ts: NOW - DAY, delivered: true })],
      }),
      nowSec: NOW,
    })
    expect(r.findings.find((f) => f.code === 'hero_failures').message).toContain('Fallback-Mail')
    expect(codes(r)).not.toContain('leads_lost')
  })

  it('GA4-Zustellfehler → Alarm', () => {
    const r = evaluateLeadHealth({ health: baseHealth({ summary: { received_7d: 1, ga4_failed_7d: 2 } }), nowSec: NOW })
    expect(codes(r)).toContain('ga4_delivery_failures')
  })

  it('keine Leads trotz Traffic und üblicher Rate → Alarm', () => {
    const r = evaluateLeadHealth({
      health: baseHealth({ summary: { received_7d: 0 } }),
      nowSec: NOW,
      ga4: { leads: 0, sessions7d: 120, baselineLeadsPerDay: 0.22 },
    })
    expect(codes(r)).toContain('no_leads_with_traffic')
  })

  it('keine Leads bei wenig Traffic → kein Alarm', () => {
    const r = evaluateLeadHealth({
      health: baseHealth({ summary: { received_7d: 0 } }),
      nowSec: NOW,
      ga4: { leads: 0, sessions7d: 10, baselineLeadsPerDay: 0.22 },
    })
    expect(codes(r)).not.toContain('no_leads_with_traffic')
  })

  it('Journal hat Leads, GA4 zählt 0 → Alarm', () => {
    const r = evaluateLeadHealth({
      health: baseHealth({ leads: [lead({ ts: NOW - 6 * DAY })] }),
      nowSec: NOW,
      ga4: { leads: 0, sessions7d: 100, baselineLeadsPerDay: 0.2 },
    })
    expect(codes(r)).toContain('ga4_missing_leads')
  })

  it('Leads in den letzten 2 Tagen zählen für den Abgleich nicht (GA4-Verzug)', () => {
    const r = evaluateLeadHealth({
      health: baseHealth({ leads: [lead({ ts: NOW - 1 * DAY })] }),
      nowSec: NOW,
      ga4: { leads: 0, sessions7d: 100, baselineLeadsPerDay: 0.2 },
    })
    expect(codes(r)).not.toContain('ga4_missing_leads')
  })

  it('GA4 zählt deutlich mehr als das Journal → Warnung', () => {
    const r = evaluateLeadHealth({
      health: baseHealth({ leads: [lead()] }),
      nowSec: NOW,
      ga4: { leads: 4, sessions7d: 100, baselineLeadsPerDay: 0.2 },
    })
    expect(r.findings.find((f) => f.code === 'ga4_extra_leads').level).toBe('warn')
  })

  it('GA4-Abgleich eingerichtet, aber nicht abrufbar → Warnung statt Stille', () => {
    const r = evaluateLeadHealth({ health: baseHealth(), nowSec: NOW, ga4: null, ga4Expected: true })
    expect(r.findings.find((f) => f.code === 'ga4_reconcile_unavailable').level).toBe('warn')
  })

  it('zusätzliche GA4-Leads durch Browser-Ping ohne Einwilligung sind kein Fehlalarm', () => {
    const r = evaluateLeadHealth({
      health: baseHealth({ leads: [lead({ consent: 'declined' }), lead({ id: 'y', consent: 'declined' })] }),
      nowSec: NOW,
      ga4: { leads: 4, sessions7d: 100, baselineLeadsPerDay: 0.2 },
    })
    expect(codes(r)).not.toContain('ga4_extra_leads')
  })

  it('Anfragen mit Klick-ID ohne Einwilligung zählen für Ads nicht', () => {
    const r = evaluateLeadHealth({
      health: baseHealth({ leads: [lead({ id: 'a', gclid: 'G1', consent: 'declined' }), lead({ id: 'b', gclid: 'G2', consent: 'declined' })] }),
      nowSec: NOW,
      ga4: { leads: 2, sessions7d: 100, baselineLeadsPerDay: 0.2 },
      ads: { conversions: 0 },
    })
    expect(codes(r)).not.toContain('ads_not_counting')
  })

  it('Anfragen mit Klick-ID, aber 0 Ads-Conversions → Warnung', () => {
    const r = evaluateLeadHealth({
      health: baseHealth({ leads: [lead({ id: 'a', gclid: 'G1' }), lead({ id: 'b', gclid: 'G2' })] }),
      nowSec: NOW,
      ga4: { leads: 2, sessions7d: 100, baselineLeadsPerDay: 0.2 },
      ads: { conversions: 0 },
    })
    expect(codes(r)).toContain('ads_not_counting')
    expect(r.status).toBe('warn')
  })

  it('fehlgeschlagene GA4-Prüfung → Alarm', () => {
    const r = evaluateLeadHealth({
      health: baseHealth({ ga4_check: { ok: false, http: 200, messages: ['api_secret invalid'] } }),
      nowSec: NOW,
    })
    expect(r.findings.find((f) => f.code === 'ga4_check_failed').message).toContain('api_secret invalid')
  })
})

describe('Benachrichtigung', () => {
  const alarm = { status: 'alarm', findings: [{ level: 'alarm', code: 'a', message: 'm' }] }
  const ok = { status: 'ok', findings: [] }

  it('meldet neuen Alarm sofort', () => {
    expect(shouldNotify(null, alarm, NOW)).toBe(true)
  })
  it('wiederholt gleiche Störung erst nach 24 h', () => {
    const prev = nextState(null, alarm, NOW, true)
    expect(shouldNotify(prev, alarm, NOW + 3600)).toBe(false)
    expect(shouldNotify(prev, alarm, NOW + DAY)).toBe(true)
  })
  it('meldet geänderte Lage sofort', () => {
    const prev = nextState(null, alarm, NOW, true)
    const other = { status: 'alarm', findings: [{ level: 'alarm', code: 'b', message: 'x' }] }
    expect(shouldNotify(prev, other, NOW + 60)).toBe(true)
  })
  it('meldet Entwarnung genau einmal', () => {
    const prev = nextState(null, alarm, NOW, true)
    expect(shouldNotify(prev, ok, NOW + 60)).toBe(true)
    expect(shouldNotify(nextState(prev, ok, NOW + 60, true), ok, NOW + 120)).toBe(false)
  })
  it('formatiert Text', () => {
    expect(formatAlert(ok)).toContain('alles in Ordnung')
    expect(formatAlert(alarm)).toContain('ALARM')
  })
  it('Abgleichsfenster hält 2 Tage Abstand und deckt 15 Berliner Kalendertage ab', () => {
    const w = reconciliationDates(NOW)
    expect(w.to).toBe(berlinDate(NOW - 2 * DAY))
    expect(w.from).toBe(berlinDate(NOW - 16 * DAY))
  })
  it('berlinDate rechnet in Berliner Zeit (23:30 UTC ist schon der nächste Tag)', () => {
    expect(berlinDate(Date.UTC(2026, 0, 15, 23, 30) / 1000)).toBe('2026-01-16')
  })
})
