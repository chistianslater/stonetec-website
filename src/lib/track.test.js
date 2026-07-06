import { describe, it, expect, vi, afterEach } from 'vitest'
import { trackEvent } from './track.js'

function stubConsent(value) {
  vi.stubGlobal('localStorage', { getItem: () => value, setItem: () => {} })
}

afterEach(() => vi.unstubAllGlobals())

describe('trackEvent', () => {
  it('feuert kein Event ohne Einwilligung', () => {
    const gtag = vi.fn()
    stubConsent('declined')
    vi.stubGlobal('window', { gtag })
    trackEvent('generate_lead', { method: 'form' })
    expect(gtag).not.toHaveBeenCalled()
  })

  it('feuert Event nach Einwilligung', () => {
    const gtag = vi.fn()
    stubConsent('accepted')
    vi.stubGlobal('window', { gtag })
    trackEvent('generate_lead', { method: 'form' })
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', { method: 'form' })
  })

  it('wirft nicht, wenn gtag fehlt (noch kein Consent-Load)', () => {
    stubConsent('accepted')
    vi.stubGlobal('window', {})
    expect(() => trackEvent('contact', { method: 'phone' })).not.toThrow()
  })
})
