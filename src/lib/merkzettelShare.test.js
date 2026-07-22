import { describe, it, expect } from 'vitest'
import {
  SHARE_PARAM, buildShareUrl, parseShareParam, hasShareParam, stripShareParam,
  shareText, buildWhatsappUrl, buildMailtoUrl,
} from './merkzettelShare.js'

describe('buildShareUrl', () => {
  it('hängt die Auswahl als Komma-Liste an', () => {
    expect(buildShareUrl('https://stonetec-bocholt.de/lookbook', ['bad01', 'ter02']))
      .toBe('https://stonetec-bocholt.de/lookbook?auswahl=bad01,ter02')
  })

  it('ersetzt einen bereits vorhandenen Parameter', () => {
    expect(buildShareUrl('https://stonetec-bocholt.de/lookbook?auswahl=alt01', ['bad01']))
      .toBe('https://stonetec-bocholt.de/lookbook?auswahl=bad01')
  })

  it('lässt die URL bei leerer Auswahl unverändert', () => {
    expect(buildShareUrl('https://stonetec-bocholt.de/lookbook', []))
      .toBe('https://stonetec-bocholt.de/lookbook')
  })

  it('bleibt bei voller Auswahl unter 300 Zeichen', () => {
    const ids = Array.from({ length: 40 }, (_, i) => `a${String(i).padStart(4, '0')}`)
    expect(buildShareUrl('https://stonetec-bocholt.de/lookbook', ids).length).toBeLessThan(300)
  })
})

describe('parseShareParam', () => {
  it('liest die IDs aus der Adresszeile', () => {
    expect(parseShareParam('?auswahl=bad01,ter02')).toEqual(['bad01', 'ter02'])
  })

  it('verwirft ungültige Einträge', () => {
    expect(parseShareParam('?auswahl=bad01,,GROSS,<script>,ter02')).toEqual(['bad01', 'ter02'])
  })

  it('liefert eine leere Liste ohne Parameter', () => {
    expect(parseShareParam('')).toEqual([])
    expect(parseShareParam('?andere=1')).toEqual([])
    expect(parseShareParam('?auswahl=')).toEqual([])
  })
})

describe('hasShareParam / stripShareParam', () => {
  it('erkennt den Parameter', () => {
    expect(hasShareParam('?auswahl=bad01')).toBe(true)
    expect(hasShareParam('?andere=1')).toBe(false)
  })

  it('entfernt nur den eigenen Parameter', () => {
    expect(stripShareParam('?auswahl=bad01&utm_source=whatsapp')).toBe('?utm_source=whatsapp')
    expect(stripShareParam('?auswahl=bad01')).toBe('')
  })
})

describe('Teilen-Texte', () => {
  it('formuliert Einzahl und Mehrzahl', () => {
    expect(shareText(1)).toContain('1 Bild')
    expect(shareText(7)).toContain('7 Bilder')
  })

  it('baut einen WhatsApp-Link mit kodiertem Text', () => {
    const url = buildWhatsappUrl('https://stonetec-bocholt.de/lookbook?auswahl=bad01', 1)
    expect(url.startsWith('https://wa.me/?text=')).toBe(true)
    expect(decodeURIComponent(url)).toContain('https://stonetec-bocholt.de/lookbook?auswahl=bad01')
  })

  it('baut einen mailto-Link mit Betreff und Text', () => {
    const url = buildMailtoUrl('https://stonetec-bocholt.de/lookbook?auswahl=bad01', 3)
    expect(url.startsWith('mailto:?subject=')).toBe(true)
    expect(url).toContain('&body=')
    expect(decodeURIComponent(url)).toContain('3 Bilder')
  })
})

it('exportiert den Parameternamen', () => {
  expect(SHARE_PARAM).toBe('auswahl')
})
