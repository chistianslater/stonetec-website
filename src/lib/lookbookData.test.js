import { describe, it, expect, vi } from 'vitest'
import { SECTION_META, fallbackSections, mergeManifest, loadLookbook } from './lookbookData.js'

describe('fallbackSections', () => {
  it('liefert alle fünf Kategorien mit den Bestandsbildern', () => {
    const sections = fallbackSections()
    expect(sections.map((s) => s.id)).toEqual([
      'badezimmer', 'wohnraum', 'terrasse', 'manufaktur', 'details',
    ])
    expect(sections[0].images).toHaveLength(10)
    expect(sections[0].images[0]).toEqual({
      id: 'bad01',
      src: '/images/lookbook/badezimmer/stonetec-lookbook-badezimmer-1.jpg',
      caption: '',
    })
  })

  it('vergibt über alle Kategorien hinweg eindeutige IDs', () => {
    const ids = fallbackSections().flatMap((s) => s.images.map((i) => i.id))
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('mergeManifest', () => {
  it('übernimmt die Bilder des Manifests und behält die Metadaten aus dem Code', () => {
    const sections = mergeManifest({
      version: 1,
      sections: {
        badezimmer: [{ id: 'x1a2b', src: '/uploads/lookbook/badezimmer/a1.webp', caption: 'Neu' }],
        wohnraum: [], terrasse: [], manufaktur: [], details: [],
      },
    })
    expect(sections[0].title).toBe(SECTION_META[0].title)
    expect(sections[0].images).toEqual([
      { id: 'x1a2b', src: '/uploads/lookbook/badezimmer/a1.webp', caption: 'Neu' },
    ])
    expect(sections[1].images).toEqual([])
  })

  it('verwirft Einträge ohne id oder src', () => {
    const sections = mergeManifest({
      sections: {
        badezimmer: [
          { id: 'ok123', src: '/uploads/lookbook/badezimmer/a.webp' },
          { id: 'kaputt' },
          { src: '/uploads/lookbook/badezimmer/b.webp' },
        ],
        wohnraum: [], terrasse: [], manufaktur: [], details: [],
      },
    })
    expect(sections[0].images).toEqual([
      { id: 'ok123', src: '/uploads/lookbook/badezimmer/a.webp', caption: '' },
    ])
  })

  it('fällt auf die Bestandsdaten zurück, wenn das Manifest unbrauchbar ist', () => {
    expect(mergeManifest(null)).toEqual(fallbackSections())
    expect(mergeManifest({})).toEqual(fallbackSections())
    expect(mergeManifest({ sections: 'kaputt' })).toEqual(fallbackSections())
  })

  it('fällt zurück, wenn ausnahmslos alle Kategorien leer sind', () => {
    const leer = { badezimmer: [], wohnraum: [], terrasse: [], manufaktur: [], details: [] }
    expect(mergeManifest({ sections: leer })).toEqual(fallbackSections())
  })

  it('akzeptiert eine einzelne leere Kategorie als gewollt', () => {
    const sections = mergeManifest({
      sections: {
        badezimmer: [], wohnraum: [], terrasse: [], manufaktur: [],
        details: [{ id: 'd1a2b', src: '/uploads/lookbook/details/x.webp' }],
      },
    })
    expect(sections[0].images).toEqual([])
    expect(sections[4].images).toHaveLength(1)
  })
})

describe('loadLookbook', () => {
  it('liefert die Manifest-Daten bei Erfolg', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        sections: {
          badezimmer: [{ id: 'q9z8y', src: '/uploads/lookbook/badezimmer/n.webp', caption: 'Frisch' }],
          wohnraum: [], terrasse: [], manufaktur: [], details: [],
        },
      }),
    })
    const sections = await loadLookbook(fetchImpl)
    expect(fetchImpl).toHaveBeenCalledWith('/api/lookbook.php', expect.any(Object))
    expect(sections[0].images[0].caption).toBe('Frisch')
  })

  it('fällt bei HTTP-Fehler auf die Bestandsdaten zurück', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) })
    expect(await loadLookbook(fetchImpl)).toEqual(fallbackSections())
  })

  it('fällt bei Netzwerkfehler auf die Bestandsdaten zurück', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error('offline'))
    expect(await loadLookbook(fetchImpl)).toEqual(fallbackSections())
  })

  it('fällt bei kaputtem JSON auf die Bestandsdaten zurück', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => { throw new SyntaxError('unexpected token') },
    })
    expect(await loadLookbook(fetchImpl)).toEqual(fallbackSections())
  })
})
