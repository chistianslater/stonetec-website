import { describe, it, expect, vi, afterEach } from 'vitest'
import { getGaClientId, getGaSessionId } from './gaClient.js'

afterEach(() => vi.unstubAllGlobals())

describe('getGaClientId', () => {
  it('liest die client_id aus dem _ga-Cookie', () => {
    vi.stubGlobal('document', { cookie: '_ga=GA1.1.708937304.1753263794' })
    expect(getGaClientId()).toBe('708937304.1753263794')
  })

  it('gibt null zurück, wenn kein _ga-Cookie existiert (Consent verweigert)', () => {
    vi.stubGlobal('document', { cookie: '' })
    expect(getGaClientId()).toBeNull()
  })
})

describe('getGaSessionId', () => {
  it('liest die session_id aus dem alten GS1-Cookieformat', () => {
    vi.stubGlobal('document', {
      cookie: '_ga_2CWR9BSMGL=GS1.1.1753263794.5.1.1753263999.60.0.0',
    })
    expect(getGaSessionId()).toBe('1753263794')
  })

  it('liest die session_id aus dem aktuellen GS2-Cookieformat ($-Trenner, s-Präfix)', () => {
    // Seit 2025 setzt gtag.js das Format GS2.1.s<session_id>$o<n>$g<n>$t<ts>$j..$l..$h..
    vi.stubGlobal('document', {
      cookie: '_ga_2CWR9BSMGL=GS2.1.s1753263794$o5$g1$t1753263999$j60$l0$h0',
    })
    expect(getGaSessionId()).toBe('1753263794')
  })

  it('gibt null zurück, wenn kein Session-Cookie existiert', () => {
    vi.stubGlobal('document', { cookie: '_ga=GA1.1.708937304.1753263794' })
    expect(getGaSessionId()).toBeNull()
  })
})
