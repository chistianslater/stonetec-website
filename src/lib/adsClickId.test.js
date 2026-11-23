import { describe, it, expect, beforeEach, vi } from 'vitest'

function stubStorage(consent) {
  const store = new Map()
  const make = () => ({
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
  })
  vi.stubGlobal('localStorage', { ...make(), getItem: (k) => (k === 'stonetec-cookie-consent' ? consent : null) })
  vi.stubGlobal('sessionStorage', make())
  return store
}

describe('adsClickId', () => {
  beforeEach(async () => {
    vi.unstubAllGlobals()
    const mod = await import('./adsClickId.js')
    mod._resetClickIds()
  })

  it('liest gclid aus der URL in den Arbeitsspeicher', async () => {
    stubStorage(null)
    const { captureClickIds, getClickIds } = await import('./adsClickId.js')
    captureClickIds('?gclid=Cj0_abc-1&utm_source=google')
    expect(getClickIds()).toEqual({ gclid: 'Cj0_abc-1' })
  })

  it('verwirft unsichere Werte', async () => {
    stubStorage(null)
    const { captureClickIds, getClickIds } = await import('./adsClickId.js')
    captureClickIds('?gclid=<script>alert(1)</script>')
    expect(getClickIds()).toEqual({})
  })

  it('speichert OHNE Zustimmung nichts im sessionStorage', async () => {
    const store = stubStorage('declined')
    const { captureClickIds } = await import('./adsClickId.js')
    captureClickIds('?gclid=AAA')
    expect(store.size).toBe(0)
  })

  it('speichert MIT Zustimmung im sessionStorage und liest nach Neuladen', async () => {
    const store = stubStorage('accepted')
    const mod = await import('./adsClickId.js')
    mod.captureClickIds('?wbraid=WB1')
    expect(store.get('stonetec-ad-click')).toContain('WB1')
    mod._resetClickIds()
    expect(mod.getClickIds()).toEqual({ wbraid: 'WB1' })
  })

  it('liest nach Neuladen ohne Zustimmung nichts aus dem Storage', async () => {
    stubStorage('declined')
    const mod = await import('./adsClickId.js')
    sessionStorage.setItem('stonetec-ad-click', JSON.stringify({ gclid: 'ALT' }))
    expect(mod.getClickIds()).toEqual({})
  })

  it('persistiert eine im Speicher gehaltene ID nach nachträglicher Zustimmung', async () => {
    const store = stubStorage('declined')
    const mod = await import('./adsClickId.js')
    mod.captureClickIds('?gclid=LATE')
    expect(store.size).toBe(0)
    vi.stubGlobal('localStorage', { getItem: () => 'accepted', setItem: () => {} })
    mod.persistClickIdsAfterConsent()
    expect(store.get('stonetec-ad-click')).toContain('LATE')
  })
})
