import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  MAX_PICKS, STORAGE_KEY,
  sanitizeIds, addId, removeId, parseStored,
  initMerkzettel, getSnapshot, subscribe, toggle, remove, clear, replaceAll, isFull,
} from './merkzettel.js'

// Minimaler Ersatz für localStorage — die Testumgebung ist Node, dort gibt es keinen.
function fakeStorage(initial = {}) {
  const map = new Map(Object.entries(initial))
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    _map: map,
  }
}

describe('sanitizeIds', () => {
  it('behält gültige IDs und verwirft alles andere', () => {
    expect(sanitizeIds(['bad01', 'x1a2b', '', null, 42, 'MIT GROSS', 'zu-lang-fuer-eine-id-wirklich'])).toEqual(['bad01', 'x1a2b'])
  })

  it('entfernt Duplikate unter Beibehaltung der Reihenfolge', () => {
    expect(sanitizeIds(['bad01', 'woh03', 'bad01'])).toEqual(['bad01', 'woh03'])
  })

  it('kappt bei der Obergrenze', () => {
    const viele = Array.from({ length: 60 }, (_, i) => `a${String(i).padStart(4, '0')}`)
    expect(sanitizeIds(viele)).toHaveLength(MAX_PICKS)
  })

  it('liefert eine leere Liste für Unsinn', () => {
    expect(sanitizeIds(null)).toEqual([])
    expect(sanitizeIds('bad01')).toEqual([])
    expect(sanitizeIds({ a: 1 })).toEqual([])
  })
})

describe('addId / removeId', () => {
  it('hängt hinten an', () => {
    expect(addId(['bad01'], 'woh03')).toEqual(['bad01', 'woh03'])
  })

  it('gibt bei bereits vorhandener ID dieselbe Referenz zurück', () => {
    const ids = ['bad01']
    expect(addId(ids, 'bad01')).toBe(ids)
  })

  it('gibt bei voller Liste dieselbe Referenz zurück', () => {
    const voll = Array.from({ length: MAX_PICKS }, (_, i) => `a${String(i).padStart(4, '0')}`)
    expect(addId(voll, 'neuid')).toBe(voll)
  })

  it('entfernt eine ID', () => {
    expect(removeId(['bad01', 'woh03'], 'bad01')).toEqual(['woh03'])
  })

  it('gibt bei unbekannter ID dieselbe Referenz zurück', () => {
    const ids = ['bad01']
    expect(removeId(ids, 'gibtsnicht')).toBe(ids)
  })
})

describe('parseStored', () => {
  it('liest eine gespeicherte Liste', () => {
    expect(parseStored('["bad01","woh03"]')).toEqual(['bad01', 'woh03'])
  })

  it('verträgt kaputten Inhalt', () => {
    expect(parseStored('{kaputt')).toEqual([])
    expect(parseStored(null)).toEqual([])
    expect(parseStored('"bad01"')).toEqual([])
  })
})

describe('Store', () => {
  beforeEach(() => initMerkzettel(fakeStorage()))

  it('startet leer', () => {
    expect(getSnapshot()).toEqual([])
  })

  it('lädt eine vorhandene Auswahl aus dem Speicher', () => {
    initMerkzettel(fakeStorage({ [STORAGE_KEY]: '["bad01","det14"]' }))
    expect(getSnapshot()).toEqual(['bad01', 'det14'])
  })

  it('merkt und entfernt per toggle', () => {
    expect(toggle('bad01')).toBe(true)
    expect(getSnapshot()).toEqual(['bad01'])
    expect(toggle('bad01')).toBe(false)
    expect(getSnapshot()).toEqual([])
  })

  it('schreibt jede Änderung in den Speicher', () => {
    const storage = fakeStorage()
    initMerkzettel(storage)
    toggle('bad01')
    expect(storage.getItem(STORAGE_KEY)).toBe('["bad01"]')
  })

  it('behält die Referenz, wenn sich nichts ändert', () => {
    toggle('bad01')
    const vorher = getSnapshot()
    remove('gibtsnicht')
    expect(getSnapshot()).toBe(vorher)
  })

  it('benachrichtigt Abonnenten nur bei echten Änderungen', () => {
    const listener = vi.fn()
    const unsubscribe = subscribe(listener)
    toggle('bad01')
    expect(listener).toHaveBeenCalledTimes(1)
    remove('gibtsnicht')
    expect(listener).toHaveBeenCalledTimes(1)
    unsubscribe()
    toggle('woh03')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('ersetzt die gesamte Auswahl', () => {
    toggle('bad01')
    replaceAll(['ter02', 'man05', 'kaputt!'])
    expect(getSnapshot()).toEqual(['ter02', 'man05'])
  })

  it('leert die Auswahl', () => {
    toggle('bad01')
    clear()
    expect(getSnapshot()).toEqual([])
  })

  it('meldet Vollstand und nimmt nichts mehr auf', () => {
    replaceAll(Array.from({ length: MAX_PICKS }, (_, i) => `a${String(i).padStart(4, '0')}`))
    expect(isFull()).toBe(true)
    expect(toggle('neuid')).toBe(false)
    expect(getSnapshot()).toHaveLength(MAX_PICKS)
  })

  it('arbeitet ohne Speicher weiter (privater Modus)', () => {
    initMerkzettel(null)
    expect(toggle('bad01')).toBe(true)
    expect(getSnapshot()).toEqual(['bad01'])
  })

  it('überlebt einen werfenden Speicher', () => {
    initMerkzettel({
      getItem: () => { throw new Error('blockiert') },
      setItem: () => { throw new Error('blockiert') },
      removeItem: () => {},
    })
    expect(() => toggle('bad01')).not.toThrow()
    expect(getSnapshot()).toEqual(['bad01'])
  })
})
