import { describe, it, expect } from 'vitest'
import { validateLead, buildHeroPayload, PROJECT_SOURCE } from './heroLead.js'

const valid = {
  firstName: 'Anna', lastName: 'Schmidt',
  email: 'anna@example.com', phone: '+49170123',
  zipcode: '46399', city: 'Bocholt',
  vorhaben: 'sanierung', bereich: 'bad',
  weekdays: ['mo', 'di', 'do'], daytimes: ['vormittags'],
  message: 'Gäste-WC neu', privacy: true,
}

describe('validateLead', () => {
  it('akzeptiert vollständige Daten', () => {
    expect(validateLead(valid).valid).toBe(true)
  })
  it('verlangt E-Mail und PLZ', () => {
    const r = validateLead({ ...valid, email: '', zipcode: '' })
    expect(r.valid).toBe(false)
    expect(r.errors.email).toBeTruthy()
    expect(r.errors.zipcode).toBeTruthy()
  })
  it('lehnt fehlende Datenschutz-Zustimmung ab', () => {
    expect(validateLead({ ...valid, privacy: false }).valid).toBe(false)
  })
  it('lehnt ungültige PLZ ab', () => {
    expect(validateLead({ ...valid, zipcode: 'abc' }).valid).toBe(false)
  })
})

describe('buildHeroPayload', () => {
  const p = buildHeroPayload(valid)
  it('setzt Pflichtfelder und Status 201', () => {
    expect(p.customer.email).toBe('anna@example.com')
    expect(p.address.zipcode).toBe('46399')
    expect(p.project_match.status_code).toBe(201)
    expect(p.project.source).toBe(PROJECT_SOURCE)
    expect(p.measure).toBe('PRJ')
  })
  it('baut einen lesbaren Kommentar mit Vorhaben, Bereich, Erreichbarkeit, Nachricht', () => {
    expect(p.project_match.comment).toContain('Sanierung')
    expect(p.project_match.comment).toContain('Badezimmer')
    expect(p.project_match.comment).toContain('Mo, Di, Do')
    expect(p.project_match.comment).toContain('vormittags')
    expect(p.project_match.comment).toContain('Gäste-WC neu')
  })
  it('lässt optionale Felder weg, wenn leer', () => {
    const min = buildHeroPayload({ ...valid, phone: '', city: '' })
    expect(min.customer.phone_mobile).toBeUndefined()
    expect(min.address.city).toBeUndefined()
  })
})
