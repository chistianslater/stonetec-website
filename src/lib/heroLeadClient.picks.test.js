import { describe, it, expect, vi, afterEach } from 'vitest'
import { submitLead } from './heroLeadClient.js'

afterEach(() => vi.unstubAllGlobals())

function stubFetch() {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ status: 'success' }),
  })
  vi.stubGlobal('fetch', fetchMock)
  vi.stubGlobal('window', {})
  vi.stubGlobal('document', { cookie: '' })
  return fetchMock
}

describe('submitLead mit Merkzettel', () => {
  it('reicht lookbookPicks unverändert an den Endpoint weiter', async () => {
    const fetchMock = stubFetch()
    await submitLead({ email: 'test@example.org', lookbookPicks: ['bad01', 'ter02'] })

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/lead.php')
    expect(JSON.parse(options.body).lookbookPicks).toEqual(['bad01', 'ter02'])
  })

  it('kommt ohne Merkzettel aus', async () => {
    const fetchMock = stubFetch()
    await submitLead({ email: 'test@example.org' })

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.lookbookPicks).toBeUndefined()
    expect(body.email).toBe('test@example.org')
  })
})
