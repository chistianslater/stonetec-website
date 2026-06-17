import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateLead, buildHeroPayload } from './heroLead.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST_DIR = path.resolve(__dirname, '..', 'dist')
const HERO_URL = process.env.HERO_API_URL || 'https://login.hero-software.de/api/v1/Projects/create'
const HERO_KEY = process.env.HERO_API_KEY

// Sehr einfache In-Memory-Drossel: max 5 Anfragen pro IP pro 10 min.
const hits = new Map()
function rateLimited(ip) {
  const now = Date.now()
  const windowMs = 10 * 60 * 1000
  const entry = (hits.get(ip) || []).filter((t) => now - t < windowMs)
  entry.push(now)
  hits.set(ip, entry)
  return entry.length > 5
}

export function createApp() {
  const app = express()
  app.use(express.json({ limit: '12mb' }))

  app.post('/api/lead', async (req, res) => {
    if (req.body?.company) return res.status(200).json({ status: 'success' }) // Honeypot
    if (rateLimited(req.ip)) return res.status(429).json({ status: 'error', message: 'Zu viele Anfragen.' })

    const { valid, errors } = validateLead(req.body)
    if (!valid) return res.status(422).json({ status: 'error', errors })
    if (!HERO_KEY) {
      console.error('[lead] HERO_API_KEY fehlt')
      return res.status(500).json({ status: 'error', message: 'Serverkonfiguration unvollständig.' })
    }
    try {
      const payload = buildHeroPayload(req.body)
      const postToHero = (body) => fetch(HERO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${HERO_KEY}` },
        body: JSON.stringify(body),
      })

      let r = await postToHero(payload)
      let imagesDropped = false
      // Hero dokumentiert das Bildformat nicht öffentlich. Falls die Bilder
      // abgelehnt werden, ohne Bilder erneut senden — der Lead muss immer ankommen.
      if (!r.ok && payload.images) {
        console.error('[lead] Hero lehnte Payload mit Bildern ab', r.status, await r.text())
        const withoutImages = { ...payload }
        delete withoutImages.images
        imagesDropped = true
        r = await postToHero(withoutImages)
      }
      if (!r.ok) {
        console.error('[lead] Hero-Fehler', r.status, await r.text())
        return res.status(502).json({ status: 'error', message: 'Übermittlung fehlgeschlagen.' })
      }
      return res.status(200).json({ status: 'success', imagesDropped })
    } catch (err) {
      console.error('[lead] Ausnahme', err)
      return res.status(500).json({ status: 'error', message: 'Unerwarteter Fehler.' })
    }
  })

  app.use(express.static(DIST_DIR))
  app.use((_req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')))
  return app
}
