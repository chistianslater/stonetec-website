import { describe, it, expect, vi, afterEach } from 'vitest'
import { submitLead } from './heroLeadClient.js'

afterEach(() => vi.restoreAllMocks())

describe('submitLead', () => {
  it('löst auf bei status success', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ status: 'success' }) })))
    await expect(submitLead({ email: 'a@b.de' })).resolves.toEqual({ status: 'success' })
  })
  it('wirft mit Feldfehlern bei 422', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, json: async () => ({ status: 'error', errors: { email: 'x' } }) })))
    await expect(submitLead({})).rejects.toMatchObject({ fieldErrors: { email: 'x' } })
  })
})

describe('submitLead Journal-Felder', () => {
  it('schickt Klick-ID, Einwilligungsstand und Landingpage mit', async () => {
    const store = new Map([['stonetec-cookie-consent', 'accepted']])
    vi.stubGlobal('localStorage', { getItem: (k) => store.get(k) ?? null, setItem: () => {} })
    vi.stubGlobal('sessionStorage', { getItem: () => null, setItem: () => {} })
    vi.stubGlobal('window', { location: { pathname: '/badsanierung-bocholt', search: '?gclid=ABC_1' } })
    const { captureClickIds, _resetClickIds } = await import('./adsClickId.js')
    _resetClickIds()
    captureClickIds('?gclid=ABC_1')
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({ status: 'success' }) }))
    vi.stubGlobal('fetch', fetchMock)
    await submitLead({ email: 'a@b.de' })
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(sent).toMatchObject({ gclid: 'ABC_1', consent: 'accepted', landing_path: '/badsanierung-bocholt' })
  })
})
