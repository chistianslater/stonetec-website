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
