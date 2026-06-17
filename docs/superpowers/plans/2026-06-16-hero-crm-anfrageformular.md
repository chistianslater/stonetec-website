# Hero-CRM Anfrageformular — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Das stonetec-Anfrageformular wird ein mehrstufiger Wizard, der Anfragen über einen Express-Proxy direkt als „neue Anfrage" in das Hero-CRM einspeist.

**Architecture:** Ein Express-Prozess (`server.js`) liefert das gebaute Vite-`dist/` aus und stellt `POST /api/lead` bereit. Der Endpoint validiert serverseitig, mappt die Formulardaten auf die Hero-Lead-API und ruft Hero server-zu-server mit dem `HERO_API_KEY` (ENV) auf. Das Frontend (`Kontakt.jsx`) rendert einen animierten 6-Schritt-Wizard und sendet JSON an `/api/lead`.

**Tech Stack:** Vite + React 19, framer-motion (vorhanden), Express, Vitest (neu), Hostinger Node.js Web App. ESM (`"type": "module"`), natives `fetch` (Node 18+).

---

## File Structure

| Datei | Verantwortung |
|---|---|
| `server.js` (root) | Startdatei der Hostinger-App: startet Express, hört auf `process.env.PORT` |
| `server/index.js` | `createApp()` — Express-App: `/api/lead`-Route + statisches `dist/` + SPA-Fallback |
| `server/heroLead.js` | Reine Logik: `validateLead()` + `buildHeroPayload()` (unit-getestet) |
| `server/heroLead.test.js` | Vitest-Tests für die reine Logik |
| `vitest.config.js` | Test-Runner-Konfig (node-Umgebung) |
| `src/lib/heroLeadClient.js` | `submitLead()` — Fetch-Wrapper vom Browser zu `/api/lead` |
| `src/components/anfrage/AnfrageWizard.jsx` | Wizard-Orchestrator: Schritt-State, Übergänge, Submit, Erfolg/Fehler |
| `src/components/anfrage/WizardSteps.jsx` | Die 6 Schritt-Komponenten |
| `src/components/anfrage/OptionCard.jsx` | Wiederverwendbare antippbare Kachel |
| `src/components/anfrage/Chip.jsx` | Wiederverwendbarer Auswahl-Chip (Wochentage/Tageszeit) |
| `src/components/anfrage/WizardProgress.jsx` | Schmale Fortschrittsanzeige |
| `src/pages/Kontakt.jsx` | Bindet `<AnfrageWizard />` statt des alten `<form>` ein |

Reihenfolge der Tasks de-riskt bewusst: Logik + Server + Wizard + echter Hero-Test zuerst (Tasks 1–9), **Bild-Upload als letzter Task 10** (hängt am unverifizierten Hero-Bildformat). Task 11 = Deploy-Doku.

---

### Task 1: Tooling (Express + Vitest)

**Files:**
- Modify: `package.json`
- Create: `vitest.config.js`

- [ ] **Step 1: Express + Vitest installieren**

Run:
```bash
npm install express
npm install -D vitest
```
Expected: beide erscheinen in `package.json`.

- [ ] **Step 2: Scripts ergänzen** in `package.json` (`scripts`-Block):

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest",
  "start": "node server.js"
}
```

- [ ] **Step 3: `vitest.config.js` anlegen**

```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['server/**/*.test.js', 'src/**/*.test.{js,jsx}'],
  },
})
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json vitest.config.js
git commit -m "chore: add express runtime and vitest test runner"
```

---

### Task 2: Hero-Logik (TDD)

Reine Funktionen, kein I/O — der kritische, exakt zu treffende Teil.

**Files:**
- Create: `server/heroLead.js`
- Test: `server/heroLead.test.js`

- [ ] **Step 1: Failing test schreiben** — `server/heroLead.test.js`

```js
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
```

- [ ] **Step 2: Tests laufen lassen (müssen fehlschlagen)**

Run: `npm test`
Expected: FAIL — `heroLead.js` existiert noch nicht.

- [ ] **Step 3: `server/heroLead.js` implementieren**

```js
// Reine Helfer für die Hero Lead-API. Kein I/O — unit-testbar.
export const PROJECT_SOURCE = 'stonetec Website – Kontaktformular'

const VORHABEN_LABELS = { neubau: 'Neubau', sanierung: 'Sanierung', reparatur: 'Reparatur' }
const BEREICH_LABELS = {
  bad: 'Badezimmer', kueche: 'Küche', wohnbereich: 'Wohnbereich',
  aussen: 'Außen & Terrasse', gewerbe: 'Gewerbe', sonstiges: 'Sonstiges',
}
const TAGESZEIT_LABELS = { vormittags: 'vormittags', nachmittags: 'nachmittags' }
const WEEKDAY_LABELS = { mo: 'Mo', di: 'Di', mi: 'Mi', do: 'Do', fr: 'Fr', sa: 'Sa' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLead(data) {
  if (!data || typeof data !== 'object') return { valid: false, errors: { _: 'Ungültige Daten' } }
  const errors = {}
  if (!data.firstName?.trim()) errors.firstName = 'Vorname fehlt'
  if (!data.lastName?.trim()) errors.lastName = 'Nachname fehlt'
  if (!data.email?.trim() || !EMAIL_RE.test(data.email.trim())) errors.email = 'Gültige E-Mail erforderlich'
  if (!data.zipcode?.trim() || !/^\d{4,5}$/.test(data.zipcode.trim())) errors.zipcode = 'Gültige PLZ erforderlich'
  if (!data.privacy) errors.privacy = 'Zustimmung erforderlich'
  return { valid: Object.keys(errors).length === 0, errors }
}

function buildComment(data) {
  const lines = []
  const vorhaben = VORHABEN_LABELS[data.vorhaben] || data.vorhaben || '—'
  const bereich = BEREICH_LABELS[data.bereich] || data.bereich || '—'
  lines.push(`Vorhaben: ${vorhaben} · Bereich: ${bereich}`)
  const days = (data.weekdays || []).map((d) => WEEKDAY_LABELS[d] || d).join(', ')
  const zeit = (data.daytimes || []).map((t) => TAGESZEIT_LABELS[t] || t).join(' / ')
  if (days || zeit) lines.push(`Erreichbarkeit: ${days || 'flexibel'}${zeit ? ` – ${zeit}` : ''}`)
  if (data.message?.trim()) lines.push(`Nachricht: "${data.message.trim()}"`)
  return lines.join('\n')
}

export function buildHeroPayload(data) {
  const payload = {
    measure: 'PRJ',
    customer: {
      email: data.email.trim(),
      first_name: data.firstName?.trim() || '',
      last_name: data.lastName?.trim() || '',
    },
    address: { zipcode: data.zipcode.trim() },
    project: {
      source: PROJECT_SOURCE,
      source_sub: 'stonetec-bocholt.de',
      source_medium: 'Anfrageformular',
    },
    project_match: { status_code: 201, comment: buildComment(data), inform_partner: true },
  }
  if (data.phone?.trim()) payload.customer.phone_mobile = data.phone.trim()
  if (data.city?.trim()) payload.address.city = data.city.trim()
  if (Array.isArray(data.images) && data.images.length) payload.images = data.images
  return payload
}
```

- [ ] **Step 4: Tests laufen lassen (müssen bestehen)**

Run: `npm test`
Expected: PASS (alle heroLead-Tests grün).

- [ ] **Step 5: Commit**

```bash
git add server/heroLead.js server/heroLead.test.js
git commit -m "feat: add Hero lead validation and payload mapping"
```

---

### Task 3: Express-Server

**Files:**
- Create: `server/index.js`
- Create: `server.js`

- [ ] **Step 1: `server/index.js` anlegen**

```js
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
      const r = await fetch(HERO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${HERO_KEY}` },
        body: JSON.stringify(buildHeroPayload(req.body)),
      })
      if (!r.ok) {
        console.error('[lead] Hero-Fehler', r.status, await r.text())
        return res.status(502).json({ status: 'error', message: 'Übermittlung fehlgeschlagen.' })
      }
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      console.error('[lead] Ausnahme', err)
      return res.status(500).json({ status: 'error', message: 'Unerwarteter Fehler.' })
    }
  })

  app.use(express.static(DIST_DIR))
  app.get('*', (_req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')))
  return app
}
```

- [ ] **Step 2: `server.js` (root, Startdatei) anlegen**

```js
import { createApp } from './server/index.js'

const port = process.env.PORT || 3000
createApp().listen(port, () => console.log(`stonetec server läuft auf :${port}`))
```

- [ ] **Step 3: Lokaler Smoke-Test (ohne echten Key)**

Run:
```bash
npm run build
HERO_API_KEY="" node server.js &
sleep 1
curl -s -X POST localhost:3000/api/lead -H 'Content-Type: application/json' -d '{"firstName":"A","lastName":"B","email":"a@b.de","zipcode":"46399","privacy":true,"vorhaben":"sanierung","bereich":"bad"}'
kill %1
```
Expected: JSON `{"status":"error","message":"Serverkonfiguration unvollständig."}` (Validierung ok, nur Key fehlt → beweist Routing + Validierung). Eine fehlerhafte Eingabe (z. B. ohne `zipcode`) muss `422` liefern.

- [ ] **Step 4: Commit**

```bash
git add server/index.js server.js
git commit -m "feat: add express server with /api/lead proxy and static serving"
```

---

### Task 4: Frontend-Submit-Client (TDD)

**Files:**
- Create: `src/lib/heroLeadClient.js`
- Test: `src/lib/heroLeadClient.test.js`

- [ ] **Step 1: Failing test** — `src/lib/heroLeadClient.test.js`

```js
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
```

- [ ] **Step 2: Test laufen lassen (FAIL)** — Run: `npm test` → FAIL (Datei fehlt).

- [ ] **Step 3: `src/lib/heroLeadClient.js` implementieren**

```js
export async function submitLead(formData) {
  const res = await fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
  let body = null
  try { body = await res.json() } catch { /* ignorieren */ }
  if (!res.ok || body?.status !== 'success') {
    const err = new Error(body?.message || 'Senden fehlgeschlagen. Bitte später erneut versuchen.')
    err.fieldErrors = body?.errors || null
    throw err
  }
  return body
}
```

- [ ] **Step 4: Test laufen lassen (PASS)** — Run: `npm test` → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/heroLeadClient.js src/lib/heroLeadClient.test.js
git commit -m "feat: add browser lead submission client"
```

---

### Task 5: Wizard-Atoms

Visuelle Sprache aus `Kontakt.jsx` übernehmen: dunkle Karte `bg-dark-bg`, Text `text-inv-light`/`text-inv-muted`, Schriften `font-sora`/`font-dm`. „Leicht & hochwertig": viel Luft, klare States.

**Files:**
- Create: `src/components/anfrage/OptionCard.jsx`
- Create: `src/components/anfrage/Chip.jsx`
- Create: `src/components/anfrage/WizardProgress.jsx`

- [ ] **Step 1: `OptionCard.jsx`** — antippbare Kachel mit ausgewähltem Zustand

```jsx
export default function OptionCard({ label, hint, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group w-full text-left rounded-xl border p-5 transition-all duration-200
        ${selected
          ? 'border-inv-light/60 bg-inv-light/10'
          : 'border-inv-light/15 bg-inv-light/[0.03] hover:border-inv-light/35 hover:bg-inv-light/[0.06]'}`}
    >
      <span className="block font-sora font-light text-[1.05rem] text-inv-light tracking-[-0.01em]">{label}</span>
      {hint && <span className="mt-1 block font-dm text-[0.8rem] text-inv-muted">{hint}</span>}
    </button>
  )
}
```

- [ ] **Step 2: `Chip.jsx`** — Mehrfach-Auswahl-Pille

```jsx
export default function Chip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border px-4 py-2 font-dm text-[0.85rem] transition-all duration-200
        ${selected
          ? 'border-inv-light/60 bg-inv-light text-warm-text'
          : 'border-inv-light/20 text-inv-light hover:border-inv-light/40'}`}
    >
      {label}
    </button>
  )
}
```

- [ ] **Step 3: `WizardProgress.jsx`** — schmale Leiste + „Schritt X von N"

```jsx
export default function WizardProgress({ current, total }) {
  const pct = Math.round(((current + 1) / total) * 100)
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between font-dm text-[0.7rem] uppercase tracking-[2px] text-inv-tagline">
        <span>Schritt {current + 1} von {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-inv-light/10">
        <div className="h-full rounded-full bg-inv-light transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/anfrage/OptionCard.jsx src/components/anfrage/Chip.jsx src/components/anfrage/WizardProgress.jsx
git commit -m "feat: add wizard UI atoms (OptionCard, Chip, WizardProgress)"
```

---

### Task 6: Wizard-Schritte

**Files:**
- Create: `src/components/anfrage/WizardSteps.jsx`

Ein State-Objekt wird von oben gereicht; jede Step-Komponente bekommt `{ data, update }` (und `onAdvance` bei Auto-Advance-Schritten). `update(field, value)` setzt unveränderlich. Eingabe-Styles wie in `Kontakt.jsx` (`bg-inv-light/10`, `border-inv-light/20`, `rounded-lg`).

- [ ] **Step 1: `WizardSteps.jsx` mit allen sechs Schritten anlegen**

```jsx
import OptionCard from './OptionCard.jsx'
import Chip from './Chip.jsx'

const inputCls =
  'w-full px-4 py-3 bg-inv-light/10 border border-inv-light/20 rounded-lg font-dm text-[0.9rem] text-inv-light placeholder:text-inv-tagline focus:outline-none focus:border-inv-light/40 transition-colors'
const labelCls = 'block font-dm text-[0.75rem] text-inv-tagline uppercase tracking-wide mb-2'

const VORHABEN = [
  { value: 'neubau', label: 'Neubau', hint: 'Neu fliesen von Grund auf' },
  { value: 'sanierung', label: 'Sanierung', hint: 'Bestehendes erneuern' },
  { value: 'reparatur', label: 'Reparatur', hint: 'Ausbessern / einzelne Stellen' },
]
const BEREICH = [
  { value: 'bad', label: 'Badezimmer' },
  { value: 'kueche', label: 'Küche' },
  { value: 'wohnbereich', label: 'Wohnbereich' },
  { value: 'aussen', label: 'Außen & Terrasse' },
  { value: 'gewerbe', label: 'Gewerbe' },
  { value: 'sonstiges', label: 'Sonstiges' },
]
const WEEKDAYS = [
  { value: 'mo', label: 'Mo' }, { value: 'di', label: 'Di' }, { value: 'mi', label: 'Mi' },
  { value: 'do', label: 'Do' }, { value: 'fr', label: 'Fr' }, { value: 'sa', label: 'Sa' },
]
const DAYTIMES = [
  { value: 'vormittags', label: 'Vormittags' },
  { value: 'nachmittags', label: 'Nachmittags' },
]

function StepTitle({ kicker, title }) {
  return (
    <div className="mb-6">
      <p className="font-dm text-[0.7rem] uppercase tracking-[2px] text-inv-tagline mb-2">{kicker}</p>
      <h3 className="font-sora font-extralight text-[1.6rem] text-inv-light tracking-[-0.01em]">{title}</h3>
    </div>
  )
}

function toggle(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function StepVorhaben({ data, update, onAdvance }) {
  return (
    <div>
      <StepTitle kicker="Dein Projekt" title="Was ist geplant?" />
      <div className="grid gap-3">
        {VORHABEN.map((o) => (
          <OptionCard key={o.value} label={o.label} hint={o.hint} selected={data.vorhaben === o.value}
            onClick={() => { update('vorhaben', o.value); onAdvance?.() }} />
        ))}
      </div>
    </div>
  )
}

export function StepBereich({ data, update, onAdvance }) {
  return (
    <div>
      <StepTitle kicker="Dein Projekt" title="Welcher Bereich?" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BEREICH.map((o) => (
          <OptionCard key={o.value} label={o.label} selected={data.bereich === o.value}
            onClick={() => { update('bereich', o.value); onAdvance?.() }} />
        ))}
      </div>
    </div>
  )
}

export function StepOrt({ data, update }) {
  return (
    <div>
      <StepTitle kicker="Standort" title="Wo ist das Bauvorhaben?" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="sm:col-span-1">
          <label htmlFor="zipcode" className={labelCls}>PLZ *</label>
          <input id="zipcode" name="zipcode" inputMode="numeric" required value={data.zipcode}
            onChange={(e) => update('zipcode', e.target.value)} className={inputCls} placeholder="46399" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="city" className={labelCls}>Ort</label>
          <input id="city" name="city" value={data.city}
            onChange={(e) => update('city', e.target.value)} className={inputCls} placeholder="Bocholt" />
        </div>
      </div>
    </div>
  )
}

export function StepProjekt({ data, update }) {
  return (
    <div>
      <StepTitle kicker="Details" title="Erzähl uns kurz davon" />
      <label htmlFor="message" className={labelCls}>Beschreibung (optional)</label>
      <textarea id="message" name="message" rows={5} value={data.message}
        onChange={(e) => update('message', e.target.value)}
        className={`${inputCls} resize-none`}
        placeholder="Größe, Wünsche, Material, Zeitvorstellung …" />
      {/* Bild-Upload wird in Task 10 ergänzt */}
    </div>
  )
}

export function StepTermin({ data, update }) {
  return (
    <div>
      <StepTitle kicker="Erreichbarkeit" title="Wann passt es dir?" />
      <p className={labelCls}>Wochentage</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {WEEKDAYS.map((d) => (
          <Chip key={d.value} label={d.label} selected={data.weekdays.includes(d.value)}
            onClick={() => update('weekdays', toggle(data.weekdays, d.value))} />
        ))}
      </div>
      <p className={labelCls}>Tageszeit</p>
      <div className="flex flex-wrap gap-2">
        {DAYTIMES.map((t) => (
          <Chip key={t.value} label={t.label} selected={data.daytimes.includes(t.value)}
            onClick={() => update('daytimes', toggle(data.daytimes, t.value))} />
        ))}
      </div>
    </div>
  )
}

export function StepKontakt({ data, update }) {
  return (
    <div>
      <StepTitle kicker="Fast geschafft" title="Wie erreichen wir dich?" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="firstName" className={labelCls}>Vorname *</label>
          <input id="firstName" required value={data.firstName}
            onChange={(e) => update('firstName', e.target.value)} className={inputCls} placeholder="Anna" />
        </div>
        <div>
          <label htmlFor="lastName" className={labelCls}>Nachname *</label>
          <input id="lastName" required value={data.lastName}
            onChange={(e) => update('lastName', e.target.value)} className={inputCls} placeholder="Schmidt" />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>E-Mail *</label>
          <input id="email" type="email" required value={data.email}
            onChange={(e) => update('email', e.target.value)} className={inputCls} placeholder="anna@email.de" />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>Telefon</label>
          <input id="phone" type="tel" value={data.phone}
            onChange={(e) => update('phone', e.target.value)} className={inputCls} placeholder="+49 …" />
        </div>
      </div>
      {/* Honeypot — für Menschen unsichtbar */}
      <input type="text" tabIndex={-1} autoComplete="off" value={data.company}
        onChange={(e) => update('company', e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0" aria-hidden="true" />
      <div className="flex items-start gap-3 pt-5">
        <input id="privacy" type="checkbox" checked={data.privacy}
          onChange={(e) => update('privacy', e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-inv-light/20 bg-inv-light/10" />
        <label htmlFor="privacy" className="font-dm text-[0.8rem] text-inv-muted leading-relaxed">
          Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu. *
        </label>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/anfrage/WizardSteps.jsx
git commit -m "feat: add six wizard step components"
```

---

### Task 7: Wizard-Orchestrator

**Files:**
- Create: `src/components/anfrage/AnfrageWizard.jsx`

Verantwortung: Schritt-State (0–5), unveränderliches `update`, Validierung pro Schritt (gating für „Weiter"), framer-motion-Übergänge (mit `prefers-reduced-motion`-Fallback), Submit über `submitLead`, Erfolgs-/Fehlerzustand. Auto-Advance bei Schritt 0/1.

- [ ] **Step 1: `AnfrageWizard.jsx` anlegen**

```jsx
import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import WizardProgress from './WizardProgress.jsx'
import { StepVorhaben, StepBereich, StepOrt, StepProjekt, StepTermin, StepKontakt } from './WizardSteps.jsx'
import { submitLead } from '../../lib/heroLeadClient.js'

const INITIAL = {
  vorhaben: '', bereich: '', zipcode: '', city: '', message: '',
  weekdays: [], daytimes: [], firstName: '', lastName: '', email: '', phone: '',
  privacy: false, company: '', images: [],
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AnfrageWizard() {
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0)
  const [data, setData] = useState(INITIAL)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const update = (field, value) => setData((d) => ({ ...d, [field]: value }))

  const steps = [
    { node: (p) => <StepVorhaben {...p} />, valid: () => !!data.vorhaben, auto: true },
    { node: (p) => <StepBereich {...p} />, valid: () => !!data.bereich, auto: true },
    { node: (p) => <StepOrt {...p} />, valid: () => /^\d{4,5}$/.test(data.zipcode.trim()) },
    { node: (p) => <StepProjekt {...p} />, valid: () => true },
    { node: (p) => <StepTermin {...p} />, valid: () => true },
    { node: (p) => <StepKontakt {...p} />,
      valid: () => data.firstName.trim() && data.lastName.trim() && EMAIL_RE.test(data.email.trim()) && data.privacy },
  ]

  const isLast = step === steps.length - 1
  const canNext = steps[step].valid()
  const goNext = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const goBack = () => setStep((s) => Math.max(s - 1, 0))
  const advanceIfAuto = () => { if (steps[step].auto) setTimeout(goNext, 180) }

  const handleSubmit = async () => {
    setStatus('sending'); setErrorMsg('')
    try {
      await submitLead(data)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Senden fehlgeschlagen.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-dark-bg rounded-xl p-8 text-center">
        <svg className="mx-auto mb-4 h-12 w-12 text-inv-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="font-sora font-light text-lg text-inv-light mb-2">Anfrage gesendet</h3>
        <p className="font-dm text-[0.85rem] text-inv-muted">Wir melden uns innerhalb von 24 Stunden bei dir.</p>
      </div>
    )
  }

  const variants = reduce
    ? { initial: { opacity: 1 }, enter: { opacity: 1 }, exit: { opacity: 1 } }
    : { initial: { opacity: 0, x: 24 }, enter: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 } }

  return (
    <div className="bg-dark-bg rounded-xl p-6 md:p-8">
      <WizardProgress current={step} total={steps.length} />

      <AnimatePresence mode="wait">
        <motion.div key={step} variants={variants} initial="initial" animate="enter" exit="exit"
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>
          {steps[step].node({ data, update, onAdvance: advanceIfAuto })}
        </motion.div>
      </AnimatePresence>

      {status === 'error' && (
        <p className="mt-5 font-dm text-[0.82rem] text-red-300" role="alert">{errorMsg}</p>
      )}

      <div className="mt-8 flex items-center justify-between gap-4">
        <button type="button" onClick={goBack} disabled={step === 0}
          className="font-dm text-[0.82rem] text-inv-muted hover:text-inv-light disabled:opacity-0 transition-colors">
          ← Zurück
        </button>
        {isLast ? (
          <button type="button" onClick={handleSubmit} disabled={!canNext || status === 'sending'}
            className="px-8 py-3.5 bg-warm-bg text-warm-text font-dm text-[0.85rem] font-semibold uppercase tracking-wider hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            {status === 'sending' ? 'Wird gesendet …' : 'Anfrage senden'}
          </button>
        ) : (
          <button type="button" onClick={goNext} disabled={!canNext}
            className="px-8 py-3.5 bg-warm-bg text-warm-text font-dm text-[0.85rem] font-semibold uppercase tracking-wider hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Weiter →
          </button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/anfrage/AnfrageWizard.jsx
git commit -m "feat: add multi-step Anfrage wizard orchestrator"
```

---

### Task 8: In Kontakt.jsx einbinden

**Files:**
- Modify: `src/pages/Kontakt.jsx`

Den kompletten `{submitted ? … : ( <form> … </form> )}`-Block innerhalb der „Contact Form"-Karte durch `<AnfrageWizard />` ersetzen. Den linken Info-/Karten-Bereich und die Map unverändert lassen. Ungenutzten Form-State (`formData`, `submitted`, `handleSubmit`, `handleChange`) entfernen.

- [ ] **Step 1: Import ergänzen** (oben in `Kontakt.jsx`)

```jsx
import AnfrageWizard from '../components/anfrage/AnfrageWizard.jsx'
```

- [ ] **Step 2: Die rechte Spalte (`lg:col-span-3`) ersetzen** — den Inhalt der `<Reveal delay={150}>`-Karte auf den Wizard reduzieren:

```jsx
<div className="lg:col-span-3">
  <Reveal delay={150}>
    <AnfrageWizard />
  </Reveal>
</div>
```

- [ ] **Step 3: Toten Code entfernen** — `useState`-Form-State, `handleSubmit`, `handleChange` aus der `Kontakt`-Funktion löschen (werden nicht mehr referenziert). `useReveal`/`Reveal` bleiben.

- [ ] **Step 4: Lint + Build**

Run: `npm run lint && npm run build`
Expected: keine Fehler; `dist/` baut durch.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Kontakt.jsx
git commit -m "feat: wire Anfrage wizard into Kontakt page, remove simulated form"
```

---

### Task 9: Verifizieren (Preview + echter Hero-Test)

**Files:** keine (nur Verifikation)

- [ ] **Step 1: Dev-Server + Preview** — `preview_start`, Seite `/kontakt` öffnen.
- [ ] **Step 2: Wizard durchklicken** — alle 6 Schritte; prüfen: Auto-Advance bei Schritt 1/2, „Weiter" deaktiviert ohne PLZ/Pflichtfelder, Zurück-Button, Fortschrittsbalken. `preview_snapshot` + `preview_screenshot` bei 1440 und 375 (responsive).
- [ ] **Step 3: `prefers-reduced-motion`** prüfen (kein horizontales Sliden).
- [ ] **Step 4: Konsole prüfen** — `preview_console_logs` ohne Fehler.
- [ ] **Step 5: Echter Hero-Test** — Server mit echtem Key starten:

```bash
HERO_API_KEY="<test-key>" npm start
```
Eine Test-Anfrage absenden. Erwartung: `200`/Erfolgsbildschirm. **Im Hero-CRM prüfen:** erscheint die Anfrage unter „Projekte → neue Anfragen" (status 201) mit korrektem Kommentar (Vorhaben, Bereich, Erreichbarkeit, Nachricht)? Bei `422` die `validationErrors` aus dem Server-Log lesen und Mapping nachziehen.

- [ ] **Step 6:** Nach erfolgreichem Test: Befund kurz dokumentieren (in der Spec „Offen"-Sektion abhaken).

---

### Task 10: Bild-Upload (optional, zuletzt — Hero-Format verifizieren)

**Files:**
- Modify: `src/components/anfrage/WizardSteps.jsx` (StepProjekt)
- Create: `src/lib/imagePrep.js`
- Modify: `server/index.js` (nur falls Hero ein anderes Bildformat verlangt)

- [ ] **Step 1: `src/lib/imagePrep.js`** — Dateien lesen, auf max. Kantenlänge 1600 px herunterskalieren (Canvas), als Base64-Data-URI zurückgeben; max 5 Bilder, Typen jpg/png/webp/heic.

```js
const MAX_FILES = 5
const MAX_EDGE = 1600

export async function prepareImages(fileList) {
  const files = Array.from(fileList).slice(0, MAX_FILES)
  const out = []
  for (const file of files) {
    if (!/^image\//.test(file.type)) continue
    out.push(await downscaleToDataUrl(file))
  }
  return out
}

function downscaleToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    img.onerror = reject
    img.src = url
  })
}
```

- [ ] **Step 2: In `StepProjekt` ein Upload-Feld ergänzen** (unter dem Textarea), das `prepareImages` aufruft und `update('images', dataUrls)` setzt; ausgewählte Bilder als kleine Vorschau-Thumbnails zeigen mit Entfernen-Option.

- [ ] **Step 3: Hero-Bildformat verifizieren** — eine Test-Anfrage **mit** Bild senden. Hero erwartet laut Doku ein `images[]`. Prüfen, ob Data-URIs akzeptiert werden oder ob ein Objekt-Format (`{ filename, content }`) nötig ist; `buildHeroPayload` / `server/index.js` entsprechend anpassen. **Falls Hero Inline-Bilder ablehnt:** Fallback — Bilder serverseitig nicht an Hero, sondern an eine Benachrichtigungs-E-Mail an stonetec hängen (Kommentar im Hero ergänzt „N Bilder per E-Mail").

- [ ] **Step 4: Payload-Größe absichern** — Server `express.json({ limit })` passend; Client warnt, wenn Gesamtgröße zu groß.

- [ ] **Step 5: Commit**

```bash
git add src/lib/imagePrep.js src/components/anfrage/WizardSteps.jsx server/index.js
git commit -m "feat: add optional image upload to Anfrage wizard"
```

---

### Task 11: Deploy-/hPanel-Dokumentation

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Abschnitt „Deployment (Hostinger Node.js Web App)" in README ergänzen:**
  - Startdatei: `server.js`
  - Build vor Deploy: `npm install && npm run build` (erzeugt `dist/`, das der Server ausliefert)
  - ENV-Variable im hPanel: `HERO_API_KEY` (von Hero Support). Optional `HERO_API_URL` (Default = Live-Endpoint).
  - Node-Version setzen; App neu starten nach ENV-Änderung.
  - Hinweis: `HERO_API_KEY` niemals committen.

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: document Hostinger deployment and HERO_API_KEY setup"
```

---

## Self-Review

**Spec coverage:** Wizard-Schritte 1–6 → Tasks 6–8. Hero-Mapping (status 201, comment, Pflichtfelder) → Task 2. Express-Proxy + Key in ENV → Task 3. Echter Hero-Test → Task 9. Bild-Upload + Format-Verifikation + E-Mail-Fallback → Task 10. „Leicht & hochwertig" (framer-motion, Atoms, reduced-motion) → Tasks 5/7. hPanel-Setup → Task 11. Sicherheit (Validierung, Honeypot, Rate-Limit) → Tasks 2/3/6. Keine offene Spec-Anforderung ohne Task.

**Placeholder-Scan:** Kein „TBD/TODO" in Code-Schritten; jeder Code-Schritt enthält vollständigen Code. Task 10 Step 2/3 bewusst als geführte (an Hero zu verifizierende) Schritte beschrieben, nicht als Code-Platzhalter.

**Typ-Konsistenz:** Feldnamen einheitlich (`vorhaben`, `bereich`, `zipcode`, `city`, `message`, `weekdays`, `daytimes`, `firstName`, `lastName`, `email`, `phone`, `privacy`, `company`, `images`) über `INITIAL`, `validateLead`, `buildHeroPayload`, Steps und `submitLead`. `createApp`/`submitLead`/`buildHeroPayload`/`validateLead`/`prepareImages` konsistent benannt.
