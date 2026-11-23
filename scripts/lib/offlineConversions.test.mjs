import { describe, it, expect } from 'vitest'
import { buildClickConversion, formatAdsDateTime, selectUploadable, summarizeUploadResponse, failedIndices, updateUploadState } from './offlineConversions.mjs'

const NOW = 1_800_000_000
const DAY = 86400
const mk = (over = {}) => ({
  id: 'L1', ts: NOW - DAY, delivered: true, consent: 'accepted', gclid: 'G1', gbraid: '', wbraid: '', ...over,
})

describe('formatAdsDateTime', () => {
  it('liefert Winterzeit mit +01:00', () => {
    // 2026-01-15 12:00:00 UTC → 13:00 Berlin
    expect(formatAdsDateTime(Date.UTC(2026, 0, 15, 12, 0, 0) / 1000)).toBe('2026-01-15 13:00:00+01:00')
  })
  it('liefert Sommerzeit mit +02:00', () => {
    expect(formatAdsDateTime(Date.UTC(2026, 6, 15, 12, 0, 0) / 1000)).toBe('2026-07-15 14:00:00+02:00')
  })
})

describe('selectUploadable', () => {
  it('nimmt zugestellte Leads mit Klick-ID und Einwilligung', () => {
    expect(selectUploadable([mk()], { nowSec: NOW })).toHaveLength(1)
  })
  it.each([
    ['ohne Klick-ID', { gclid: '' }],
    ['ohne Einwilligung', { consent: 'declined' }],
    ['unbekannte Einwilligung', { consent: 'unknown' }],
    ['nicht zugestellt', { delivered: false }],
    ['älter als 90 Tage', { ts: NOW - 91 * DAY }],
  ])('verwirft Lead %s', (_label, over) => {
    expect(selectUploadable([mk(over)], { nowSec: NOW })).toHaveLength(0)
  })
  it('überspringt bereits hochgeladene IDs', () => {
    expect(selectUploadable([mk()], { nowSec: NOW, uploadedIds: new Set(['L1']) })).toHaveLength(0)
  })
})

describe('buildClickConversion', () => {
  const action = 'customers/1011974649/conversionActions/123'
  it('baut gclid-Conversion mit orderId und Consent', () => {
    expect(buildClickConversion(mk(), action)).toMatchObject({
      gclid: 'G1', conversionAction: action, orderId: 'L1',
      consent: { adUserData: 'GRANTED', adPersonalization: 'GRANTED' },
    })
  })
  it('nutzt genau eine Klick-ID (gclid vor gbraid vor wbraid)', () => {
    const c = buildClickConversion(mk({ gclid: 'G', gbraid: 'B', wbraid: 'W' }), action)
    expect(c.gclid).toBe('G')
    expect(c.gbraid).toBeUndefined()
    expect(buildClickConversion(mk({ gclid: '', gbraid: 'B', wbraid: 'W' }), action).gbraid).toBe('B')
  })
  it('wirft ohne Klick-ID', () => {
    expect(() => buildClickConversion(mk({ gclid: '' }), action)).toThrow()
  })
})

describe('summarizeUploadResponse', () => {
  it('erkennt Teilfehler', () => {
    const s = summarizeUploadResponse({ partialFailureError: { details: [{ errors: [{}, {}] }] }, results: [{}, { gclid: 'x' }] }, 2)
    expect(s).toMatchObject({ failureCount: 2, hasPartialFailure: true, accepted: 1 })
  })
  it('meldet Erfolg ohne Fehler', () => {
    expect(summarizeUploadResponse({ results: [{ gclid: 'x' }] }, 1).hasPartialFailure).toBe(false)
  })
})

describe('Teilfehler und Upload-Zustand', () => {
  const failure = (...idx) => ({
    partialFailureError: { details: [{ errors: idx.map((index) => ({ location: { fieldPathElements: [{ fieldName: 'conversions', index }] } })) }] },
  })
  const cands = [mk({ id: 'A' }), mk({ id: 'B' }), mk({ id: 'C' })]

  it('liest die Indizes abgelehnter Einträge', () => {
    expect([...failedIndices(failure(1, 2))]).toEqual([1, 2])
  })
  it('markiert nur erfolgreiche als erledigt, abgelehnte zählen hoch', () => {
    const s = updateUploadState({}, cands, failure(1))
    expect(s.uploadedIds.sort()).toEqual(['A', 'C'])
    expect(s.attempts).toEqual({ B: 1 })
  })
  it('gibt einen dauerhaft abgelehnten Eintrag nach 3 Versuchen auf', () => {
    let state = {}
    for (let i = 0; i < 3; i++) state = updateUploadState(state, [cands[1]], failure(0))
    expect(state.uploadedIds).toContain('B')
    expect(state.attempts).toEqual({})
  })
  it('markiert nichts, wenn der Teilfehler nicht zuordenbar ist', () => {
    const s = updateUploadState({}, cands, { partialFailureError: { details: [] } })
    expect(s.uploadedIds).toEqual([])
  })
  it('alles erledigt bei Erfolg ohne Fehler', () => {
    expect(updateUploadState({}, cands, { results: [{}, {}, {}] }).uploadedIds.sort()).toEqual(['A', 'B', 'C'])
  })
})
