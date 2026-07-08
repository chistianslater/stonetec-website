import { describe, it, expect, vi, afterEach } from 'vitest'
import { trackEvent } from './track.js'

afterEach(() => vi.unstubAllGlobals())

describe('trackEvent (Consent Mode v2)', () => {
  it('feuert das Event, sobald gtag geladen ist', () => {
    // Unter Consent Mode v2 wird der Google-Tag immer geladen (Default
    // "denied"); die Cookielosigkeit regelt der Consent Mode, nicht das
    // Unterdrücken des Events. Conversions werden so auch ohne Vollzustimmung
    // gemessen/modelliert.
    const gtag = vi.fn()
    vi.stubGlobal('window', { gtag })
    trackEvent('generate_lead', { method: 'form' })
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', { method: 'form' })
  })

  it('wirft nicht, wenn gtag fehlt (Tag noch nicht geladen)', () => {
    vi.stubGlobal('window', {})
    expect(() => trackEvent('generate_lead', { method: 'form' })).not.toThrow()
  })
})
