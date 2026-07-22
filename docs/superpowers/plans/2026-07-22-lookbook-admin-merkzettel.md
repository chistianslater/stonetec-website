# Lookbook-Selbstverwaltung & Merkzettel — Umsetzungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** StoneTec pflegt Lookbook-Fotos ohne Build/Deploy selbst, und Besucher sammeln Bilder, teilen sie per Link und schicken sie mit ihrer Anfrage an das Hero-CRM.

**Architecture:** Ein JSON-Manifest außerhalb des Deploy-Baums (`/uploads/lookbook.json`) ist die einzige veränderliche Quelle. Ein PHP-Endpoint liefert es aus, ein PHP-Admin schreibt es. Das React-Frontend liest es beim Laden und fällt bei jedem Fehler auf die im Code hinterlegten Bestandsdaten zurück. Der Merkzettel lebt ausschließlich im `localStorage` des Besuchers; geteilt wird über einen URL-Parameter, ohne Serverspeicher.

**Tech Stack:** React 19 + Vite 8, Tailwind 4, framer-motion, Vitest (Node-Umgebung), PHP 8 mit GD auf Hostinger-Shared-Hosting.

**Spec:** [2026-07-22-lookbook-admin-merkzettel-design.md](../specs/2026-07-22-lookbook-admin-merkzettel-design.md)

## Global Constraints

- **Commits nur mit expliziten Pfaden.** Das Arbeitsverzeichnis enthält viele unabhängige, nicht committete Änderungen. Niemals `git add -A`, `git add .` oder `git commit -a` — immer `git add -- <pfad> <pfad>`.
- **`/uploads/` darf niemals unter `public/` im Repo liegen.** `vite build` kopiert alles aus `public/` nach `dist/`; ein Upload-Ordner dort würde bei jedem Deploy überschrieben. `/uploads/` existiert ausschließlich auf dem Server.
- **Tests laufen in der Node-Umgebung** (`vitest.config.js` → `environment: 'node'`). Es gibt kein jsdom und kein `@testing-library/react`. Getestet werden deshalb ausschließlich reine Funktionen und Stores mit injizierbaren Abhängigkeiten — keine gerenderten Komponenten. Neue Testdateien müssen dem Muster `src/**/*.test.js` folgen.
- **Testbefehl:** `npm test` (alles) bzw. `npx vitest run src/lib/<datei>.test.js` für eine einzelne Datei.
- **Tracking-Funktion heißt `trackEvent(name, params)`** aus `src/lib/track.js` — die Spec nennt sie verkürzt `track()`.
- **Bild-IDs sind 5 Zeichen** aus `[a-z0-9]` — die Spec nennt 4; korrigiert in Task 1, weil 5 Zeichen den Kollisionsraum von 1,7 Mio. auf 60 Mio. heben und die geteilte URL trotzdem unter 250 Zeichen bleibt.
- **Kategorie-Schlüssel sind fest:** `badezimmer`, `wohnraum`, `terrasse`, `manufaktur`, `details`.
- **PHP hat in diesem Repo keine automatisierten Tests.** Jede PHP-Task endet stattdessen mit einem konkreten, ausformulierten Verifikationsschritt.
- **PHP-Mindestversion 8.1.** Der Plan nutzt `never` als Rückgabetyp (8.1), `\GdImage`, `match` und `str_starts_with` (8.0). **Vor Task 10** auf dem Server `php -v` prüfen bzw. im hPanel nachsehen. Liegt die Version darunter: die beiden `: never`-Rückgabetypen in `auth.php` und `actions.php` streichen — alles andere bleibt unverändert.

## Abweichungen von der Spec (bewusst, in Task 1 in die Spec eingepflegt)

1. **ID-Länge 5 statt 4 Zeichen** — siehe oben.
2. **Bestands-IDs sind sprechend statt zufällig** (`bad01`, `woh03`, `det14`). Sie müssen zwischen Fallback im Code und Manifest auf dem Server garantiert identisch sein; sprechende IDs erreichen das ohne Abgleich-Mechanik. Neu hochgeladene Bilder bekommen weiterhin zufällige IDs aus PHP.
3. **Keine Platzhalterkacheln beim Laden.** Die Seite rendert die Fallback-Daten sofort und tauscht sie aus, sobald das Manifest da ist. Damit ist nie ein leerer Zustand sichtbar — besser als ein Skeleton und einfacher.

---

## Dateistruktur

**Neu — Frontend**

| Datei | Verantwortung |
|---|---|
| `src/lib/lookbookData.js` | Kategorie-Metadaten, Bestandsbilder als Fallback, Manifest-Zusammenführung, Laden |
| `src/lib/merkzettel.js` | Merkzettel-Store (localStorage, Abonnenten) + reine Listenhelfer |
| `src/lib/merkzettelShare.js` | Teilen-URL bauen und lesen |
| `src/hooks/useMerkzettel.js` | React-Anbindung via `useSyncExternalStore` |
| `src/components/lookbook/ImageCard.jsx` | Bildkachel inkl. Merken-Herz |
| `src/components/lookbook/Lightbox.jsx` | Großansicht inkl. Merken-Herz |
| `src/components/lookbook/MerkzettelBar.jsx` | Schwebende Leiste + Panel + Teilen |
| `src/components/anfrage/AuswahlVorschau.jsx` | Miniaturen über dem Wizard |
| `scripts/generate-lookbook-manifest.mjs` | Erzeugt das initiale `lookbook.json` |

**Neu — Server**

| Datei | Verantwortung |
|---|---|
| `public/api/lookbook_store.php` | Gemeinsame Manifest-Funktionen (lesen, atomar schreiben, IDs, Auflösung) |
| `public/api/lookbook.php` | Liefert das Manifest als JSON |
| `public/admin/auth.php` | Session, Login-Prüfung, Drosselung, CSRF |
| `public/admin/imaging.php` | Bildprüfung, Drehung, Skalierung, WebP-Ausgabe |
| `public/admin/actions.php` | POST-Handler: Upload, Bildunterschrift, Sortierung, Löschen |
| `public/admin/index.php` | Login-Maske und Verwaltungsoberfläche |
| `public/admin/admin.js` | Drag&Drop-Sortierung, Upload-Rückmeldung |
| `public/admin/admin.css` | Gestaltung der Oberfläche |

**Geändert**

| Datei | Änderung |
|---|---|
| `src/pages/Lookbook.jsx` | Daten aus `lookbookData.js`; Kachel und Lightbox ausgelagert; Merkzettel-Leiste eingebunden |
| `src/components/anfrage/AnfrageWizard.jsx` | `lookbookPicks` mitsenden, Auswahl-Vorschau anzeigen |
| `src/lib/heroLeadClient.js` | `lookbookPicks` in die Nutzlast |
| `public/api/lead.php` | Merkzettel-Block an den Hero-Kommentar anhängen |
| `README.md` | Deploy-Regel für `/uploads/`, Admin-Einrichtung |
| `docs/superpowers/specs/2026-07-22-lookbook-admin-merkzettel-design.md` | Die drei Abweichungen oben |

---

## Task 1: Datenschicht mit Fallback

**Files:**
- Create: `src/lib/lookbookData.js`
- Create: `src/lib/lookbookData.test.js`
- Modify: `docs/superpowers/specs/2026-07-22-lookbook-admin-merkzettel-design.md`

**Interfaces:**
- Consumes: nichts
- Produces:
  - `SECTION_META: Array<{id: string, title: string, subtitle: string, description: string}>`
  - `fallbackSections(): Array<Section>` mit `Section = {id, title, subtitle, description, images: Image[]}` und `Image = {id: string, src: string, caption: string}`
  - `mergeManifest(manifest: unknown): Array<Section>`
  - `loadLookbook(fetchImpl?: typeof fetch): Promise<Array<Section>>`

- [ ] **Step 1: Write the failing test**

Create `src/lib/lookbookData.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/lookbookData.test.js`
Expected: FAIL — `Failed to resolve import "./lookbookData.js"`

- [ ] **Step 3: Write the implementation**

Create `src/lib/lookbookData.js`:

```js
// Einzige Quelle für die Lookbook-Daten des Frontends.
//
// Kategorie-Metadaten (Titel, Untertitel, Beschreibung) bleiben bewusst im Code:
// der Admin verwaltet ausschließlich Fotos, damit die Seitenstruktur stabil bleibt.
// Die Bildlisten kommen zur Laufzeit aus /api/lookbook.php; schlägt das fehl,
// rendert die Seite die hier hinterlegten Bestandsbilder. Sie ist damit nie leer.

const MANIFEST_URL = '/api/lookbook.php'

export const SECTION_META = [
  {
    id: 'badezimmer',
    title: 'Badezimmer',
    subtitle: 'Räume der Ruhe',
    description: 'Von der fugenlosen Dusche bis zum monolithischen Waschtisch. Wir verwandeln Badezimmer in private Wellness-Oasen.',
  },
  {
    id: 'wohnraum',
    title: 'Wohnraum & Boden',
    subtitle: 'Weite und Beständigkeit',
    description: 'Großformatige Bodenbeläge schaffen eine durchgängige Optik und ein großzügiges Raumgefühl in jedem Wohnbereich.',
  },
  {
    id: 'terrasse',
    title: 'Terrasse & Pool',
    subtitle: 'Sommerliche Eleganz',
    description: 'Keramik im Außenbereich verbindet Ästhetik mit extremer Beständigkeit gegen Witterung und Frost.',
  },
  {
    id: 'manufaktur',
    title: 'Keramikmanufaktur',
    subtitle: 'Unikate aus Meisterhand',
    description: 'In unserer eigenen Manufaktur fertigen wir Waschtische, Treppenstufen und Sonderlösungen aus Keramik — passgenau für dein Projekt.',
  },
  {
    id: 'details',
    title: 'Details & Handwerk',
    subtitle: 'Präzision im Fokus',
    description: 'Wahre Meisterschaft zeigt sich im Detail. Wir legen Wert auf perfekte Kanten, saubere Fugen und eine durchdachte Planung.',
  },
]

// Die Bestandsbilder folgen einem festen Namensschema. Ihre IDs sind sprechend
// und damit garantiert identisch mit denen im Manifest auf dem Server — ohne
// Abgleich-Mechanik. Neu hochgeladene Bilder bekommen zufällige IDs aus PHP.
function legacyImages(dir, prefix, count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}${String(i + 1).padStart(2, '0')}`,
    src: `/images/lookbook/${dir}/stonetec-lookbook-${dir}-${i + 1}.jpg`,
    caption: '',
  }))
}

const LEGACY_IMAGES = {
  badezimmer: legacyImages('badezimmer', 'bad', 10),
  wohnraum: legacyImages('wohnraum', 'woh', 7),
  terrasse: legacyImages('terrasse', 'ter', 7),
  manufaktur: legacyImages('manufaktur', 'man', 7),
  details: legacyImages('details', 'det', 14),
}

export function fallbackSections() {
  return SECTION_META.map((meta) => ({ ...meta, images: [...LEGACY_IMAGES[meta.id]] }))
}

// Behält nur vollständige Einträge. Ein einzelner kaputter Datensatz im Manifest
// darf die gesamte Kategorie nicht mitreißen.
function sanitizeImages(raw) {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((img) => img && typeof img.id === 'string' && img.id !== ''
      && typeof img.src === 'string' && img.src !== '')
    .map((img) => ({
      id: img.id,
      src: img.src,
      caption: typeof img.caption === 'string' ? img.caption : '',
    }))
}

export function mergeManifest(manifest) {
  const raw = manifest?.sections
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return fallbackSections()

  const merged = SECTION_META.map((meta) => ({ ...meta, images: sanitizeImages(raw[meta.id]) }))

  // Eine einzelne leere Kategorie ist eine gültige Entscheidung des Betreibers.
  // Sind ausnahmslos alle leer, ist das Manifest kaputt oder noch nicht angelegt.
  const hasAnyImage = merged.some((section) => section.images.length > 0)
  return hasAnyImage ? merged : fallbackSections()
}

export async function loadLookbook(fetchImpl = globalThis.fetch) {
  try {
    const res = await fetchImpl(MANIFEST_URL, { headers: { Accept: 'application/json' } })
    if (!res.ok) return fallbackSections()
    return mergeManifest(await res.json())
  } catch {
    return fallbackSections()
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/lookbookData.test.js`
Expected: PASS — 10 Tests grün

- [ ] **Step 5: Spec an die drei Abweichungen angleichen**

In `docs/superpowers/specs/2026-07-22-lookbook-admin-merkzettel-design.md` drei Stellen ersetzen.

Erstens im Abschnitt „Manifest-Format" den Aufzählungspunkt, der mit „`id` ist eine kurze, zufällige" beginnt, ersetzen durch:

```markdown
- `id` ist eine kurze, **dauerhaft stabile** Kennung (5 Zeichen, `[a-z0-9]`,
  kollisionsgeprüft über alle Kategorien). Bestandsbilder tragen sprechende IDs
  (`bad01`, `woh03`, `det14`), damit Fallback im Code und Manifest auf dem Server
  ohne Abgleich-Mechanik garantiert übereinstimmen; neu hochgeladene Bilder
  bekommen zufällige IDs aus PHP. Eine ID wird **nie neu vergeben**, auch nicht
  nach dem Löschen eines Bildes — sonst würden geteilte Links auf falsche Bilder
  zeigen.
```

Zweitens im Abschnitt „Frontend-Anbindung" den Absatz, der mit „Während des Ladens zeigt das Raster Platzhalterkacheln" beginnt, ersetzen durch:

```markdown
Ein Ladezustand mit Platzhalterkacheln entfällt: Die Seite rendert die
Fallback-Daten sofort und tauscht sie aus, sobald das Manifest eingetroffen ist.
Damit ist zu keinem Zeitpunkt ein leerer Zustand sichtbar.
```

Drittens im Abschnitt „Tracking" die Einleitungszeile ersetzen durch:

```markdown
Über die bestehende `trackEvent()`-Hilfsfunktion (`src/lib/track.js`),
consent-gebunden wie bisher:
```

- [ ] **Step 6: Commit**

```bash
git add -- src/lib/lookbookData.js src/lib/lookbookData.test.js docs/superpowers/specs/2026-07-22-lookbook-admin-merkzettel-design.md
git commit -m "feat: Lookbook-Datenschicht mit Manifest-Laden und Fallback"
```

---

## Task 2: Migrationsscript für das initiale Manifest

**Files:**
- Create: `scripts/generate-lookbook-manifest.mjs`
- Modify: `package.json`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `fallbackSections()` aus `src/lib/lookbookData.js`
- Produces: Datei `<ziel>/lookbook.json` im Format `{version: 1, sections: {<key>: Image[]}}`

- [ ] **Step 1: Write the script**

Create `scripts/generate-lookbook-manifest.mjs`:

```js
#!/usr/bin/env node
// Erzeugt das initiale lookbook.json aus den Bestandsdaten im Code.
//
// Einmalig vor dem ersten Deploy des Admins auszuführen. Das Ergebnis wird per
// FTP nach /uploads/lookbook.json auf den Server gelegt. Die Bilddateien bleiben
// liegen, wo sie sind — es wandern nur ihre Einträge ins Manifest.
//
// Aufruf: npm run lookbook:manifest [zielverzeichnis]
// Ohne Argument landet die Datei in build-output/uploads/lookbook.json.

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fallbackSections } from '../src/lib/lookbookData.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const targetDir = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(here, '..', 'build-output', 'uploads')

const sections = Object.fromEntries(
  fallbackSections().map((section) => [section.id, section.images]),
)

const manifest = { version: 1, sections }
const targetFile = path.join(targetDir, 'lookbook.json')

await mkdir(targetDir, { recursive: true })
await writeFile(targetFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

const total = Object.values(sections).reduce((sum, list) => sum + list.length, 0)
console.log(`lookbook.json geschrieben: ${targetFile}`)
console.log(`${Object.keys(sections).length} Kategorien, ${total} Bilder`)
```

- [ ] **Step 2: Add the npm script**

In `package.json` im Block `"scripts"` die Zeile `"start": "node server.js"` ersetzen durch:

```json
    "start": "node server.js",
    "lookbook:manifest": "node scripts/generate-lookbook-manifest.mjs"
```

- [ ] **Step 3: Keep the output out of the repo**

In `.gitignore` direkt unter der Zeile `dist-ssr` ergänzen:

```
build-output
```

- [ ] **Step 4: Run it and verify the output**

Run: `npm run lookbook:manifest`
Expected:
```
lookbook.json geschrieben: <repo>/build-output/uploads/lookbook.json
5 Kategorien, 45 Bilder
```

Run: `node -e "const m=JSON.parse(require('fs').readFileSync('build-output/uploads/lookbook.json','utf8')); const ids=Object.values(m.sections).flat().map(i=>i.id); console.log(ids.length, new Set(ids).size, m.sections.badezimmer[0].id)"`
Expected: `45 45 bad01`

Run: `git status --short -- build-output`
Expected: keine Ausgabe (durch `.gitignore` ausgeschlossen)

- [ ] **Step 5: Commit**

```bash
git add -- scripts/generate-lookbook-manifest.mjs package.json .gitignore
git commit -m "feat: Script erzeugt das initiale Lookbook-Manifest aus den Bestandsdaten"
```

---

## Task 3: Manifest-Speicher und Auslieferungs-Endpoint (PHP)

**Files:**
- Create: `public/api/lookbook_store.php`
- Create: `public/api/lookbook.php`
- Create: `public/uploads-README.md`

**Interfaces:**
- Consumes: nichts
- Produces (aus `lookbook_store.php`, genutzt von Task 10 und 11–13):
  - `lookbook_dir(): string` — absoluter Pfad zu `<docroot>/uploads`
  - `lookbook_file(): string` — absoluter Pfad zu `<docroot>/uploads/lookbook.json`
  - `lookbook_section_keys(): array`
  - `lookbook_read(): array` — Manifest oder leeres Gerüst
  - `lookbook_write(array $manifest): bool` — atomar, mit Sperre und `.bak`
  - `lookbook_new_id(array $manifest): string`
  - `lookbook_resolve_ids(array $manifest, array $ids, int $limit): array`

- [ ] **Step 1: Write the shared store**

Create `public/api/lookbook_store.php`:

```php
<?php
// Gemeinsame Funktionen für das Lookbook-Manifest.
//
// Das Manifest liegt bewusst AUSSERHALB des Deploy-Baums unter <docroot>/uploads/.
// Da dieses Verzeichnis nie Teil von dist/ ist, überlebt es jedes Website-Update.
// Eingebunden von api/lookbook.php, api/lead.php und den Dateien unter admin/.

declare(strict_types=1);

const LOOKBOOK_SECTIONS = ['badezimmer', 'wohnraum', 'terrasse', 'manufaktur', 'details'];
const LOOKBOOK_ID_LENGTH = 5;
const LOOKBOOK_ID_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

function lookbook_section_keys(): array
{
    return LOOKBOOK_SECTIONS;
}

/** <docroot>/uploads — sowohl von api/ als auch von admin/ aus eine Ebene höher. */
function lookbook_dir(): string
{
    return dirname(__DIR__) . '/uploads';
}

function lookbook_file(): string
{
    return lookbook_dir() . '/lookbook.json';
}

function lookbook_empty_manifest(): array
{
    $sections = [];
    foreach (LOOKBOOK_SECTIONS as $key) {
        $sections[$key] = [];
    }
    return ['version' => 1, 'sections' => $sections];
}

/**
 * Liest das Manifest. Fehlt es oder ist es unlesbar, kommt ein leeres zurück —
 * das Frontend entscheidet dann selbst über seinen Fallback.
 */
function lookbook_read(): array
{
    $file = lookbook_file();
    if (!is_readable($file)) {
        return lookbook_empty_manifest();
    }
    $raw = file_get_contents($file);
    if ($raw === false) {
        return lookbook_empty_manifest();
    }
    $data = json_decode($raw, true);
    if (!is_array($data) || !isset($data['sections']) || !is_array($data['sections'])) {
        return lookbook_empty_manifest();
    }

    $manifest = lookbook_empty_manifest();
    foreach (LOOKBOOK_SECTIONS as $key) {
        $list = $data['sections'][$key] ?? [];
        if (!is_array($list)) {
            continue;
        }
        foreach ($list as $img) {
            if (!is_array($img)) {
                continue;
            }
            $id  = isset($img['id']) && is_string($img['id']) ? $img['id'] : '';
            $src = isset($img['src']) && is_string($img['src']) ? $img['src'] : '';
            if ($id === '' || $src === '') {
                continue;
            }
            $manifest['sections'][$key][] = [
                'id'      => $id,
                'src'     => $src,
                'caption' => isset($img['caption']) && is_string($img['caption']) ? $img['caption'] : '',
            ];
        }
    }
    return $manifest;
}

/**
 * Schreibt atomar: erst in eine temporäre Datei, dann rename(). Ein Abbruch
 * mitten im Schreiben kann das Manifest damit nicht zerstören. Die Sperrdatei
 * serialisiert gleichzeitige Zugriffe; die Vorgängerversion bleibt als .bak.
 */
function lookbook_write(array $manifest): bool
{
    $dir = lookbook_dir();
    if (!is_dir($dir) && !@mkdir($dir, 0755, true) && !is_dir($dir)) {
        error_log('[lookbook] Upload-Verzeichnis nicht anlegbar: ' . $dir);
        return false;
    }

    $file = lookbook_file();
    $lock = fopen($file . '.lock', 'c');
    if ($lock === false) {
        error_log('[lookbook] Sperrdatei nicht anlegbar');
        return false;
    }
    if (!flock($lock, LOCK_EX)) {
        fclose($lock);
        error_log('[lookbook] Sperre nicht erhalten');
        return false;
    }

    try {
        if (is_readable($file)) {
            @copy($file, $file . '.bak');
        }
        $json = json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($json === false) {
            error_log('[lookbook] Manifest nicht serialisierbar');
            return false;
        }
        $tmp = $file . '.tmp';
        if (file_put_contents($tmp, $json . "\n") === false) {
            error_log('[lookbook] temporäre Datei nicht schreibbar');
            return false;
        }
        if (!rename($tmp, $file)) {
            @unlink($tmp);
            error_log('[lookbook] rename fehlgeschlagen');
            return false;
        }
        return true;
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

function lookbook_all_ids(array $manifest): array
{
    $ids = [];
    foreach (LOOKBOOK_SECTIONS as $key) {
        foreach ($manifest['sections'][$key] ?? [] as $img) {
            $ids[$img['id']] = true;
        }
    }
    return $ids;
}

/** Zufällige, im gesamten Manifest noch nicht vergebene ID. */
function lookbook_new_id(array $manifest): string
{
    $taken = lookbook_all_ids($manifest);
    $max = strlen(LOOKBOOK_ID_ALPHABET) - 1;
    for ($attempt = 0; $attempt < 1000; $attempt++) {
        $id = '';
        for ($i = 0; $i < LOOKBOOK_ID_LENGTH; $i++) {
            $id .= LOOKBOOK_ID_ALPHABET[random_int(0, $max)];
        }
        if (!isset($taken[$id])) {
            return $id;
        }
    }
    // Praktisch unerreichbar (60 Mio. Möglichkeiten); die längere ID bleibt gültig.
    return bin2hex(random_bytes(6));
}

/**
 * Löst Merkzettel-IDs zu Manifest-Einträgen auf. Reihenfolge folgt den
 * übergebenen IDs, unbekannte werden verworfen, die Menge wird gekappt.
 */
function lookbook_resolve_ids(array $manifest, array $ids, int $limit): array
{
    $byId = [];
    foreach (LOOKBOOK_SECTIONS as $key) {
        foreach ($manifest['sections'][$key] ?? [] as $img) {
            $byId[$img['id']] = $img;
        }
    }

    $out = [];
    foreach ($ids as $id) {
        if (!is_string($id) || !isset($byId[$id])) {
            continue;
        }
        $out[] = $byId[$id];
        if (count($out) >= $limit) {
            break;
        }
    }
    return $out;
}
```

- [ ] **Step 2: Write the delivery endpoint**

Create `public/api/lookbook.php`:

```php
<?php
// Liefert das Lookbook-Manifest an das Frontend.
// Antwortet immer mit HTTP 200 und gültigem JSON — fehlt das Manifest, kommen
// leere Kategorien, und das Frontend nutzt seine eingebauten Bestandsdaten.

declare(strict_types=1);

require __DIR__ . '/lookbook_store.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=60');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

echo json_encode(lookbook_read(), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
```

- [ ] **Step 3: Document the server-side directory contract**

Create `public/uploads-README.md`:

````markdown
# Warum es hier kein `uploads/` gibt

Das Verzeichnis `/uploads/` existiert **ausschließlich auf dem Server**, niemals im Repo.

Grund: `vite build` kopiert alles aus `public/` nach `dist/`, und `dist/` wird beim
Deploy vollständig hochgeladen. Läge der Upload-Ordner hier, würde jedes
Website-Update die vom Kunden hochgeladenen Fotos und das Manifest überschreiben.

Auf dem Server sieht es so aus:

```
<docroot>/
  index.html          ← aus dist/, wird bei jedem Deploy ersetzt
  api/                ← aus dist/, wird bei jedem Deploy ersetzt
  admin/              ← aus dist/, wird bei jedem Deploy ersetzt
  images/             ← aus dist/, wird bei jedem Deploy ersetzt
  uploads/            ← NIEMALS anfassen
    lookbook.json
    lookbook/<kategorie>/*.webp
    .private/
```

Die PHP-Dateien finden das Verzeichnis über `dirname(__DIR__) . '/uploads'` —
sowohl aus `api/` als auch aus `admin/` heraus eine Ebene über sich.
````

- [ ] **Step 4: Verify the endpoint**

Run: `php -v`

**Ist PHP vorhanden:**

```bash
mkdir -p /tmp/lookbook-test/api /tmp/lookbook-test/uploads
cp public/api/lookbook_store.php public/api/lookbook.php /tmp/lookbook-test/api/
cp build-output/uploads/lookbook.json /tmp/lookbook-test/uploads/
php -S 127.0.0.1:8765 -t /tmp/lookbook-test > /tmp/lookbook-test/server.log 2>&1 &
sleep 1
curl -s http://127.0.0.1:8765/api/lookbook.php | head -c 200
```

Expected: JSON, beginnend mit
`{"version":1,"sections":{"badezimmer":[{"id":"bad01","src":"/images/lookbook/badezimmer/stonetec-lookbook-badezimmer-1.jpg","caption":""}`

**Fehlt PHP lokal** (`command not found`): Diesen Schritt nach dem nächsten Deploy auf dem Server nachholen mit `curl -s https://stonetec-bocholt.de/api/lookbook.php | head -c 200` — dieselbe Ausgabe wird erwartet. Das Ergebnis in der Task-Notiz festhalten, **nicht überspringen**.

- [ ] **Step 5: Verify the empty-manifest path**

```bash
mv /tmp/lookbook-test/uploads/lookbook.json /tmp/lookbook-test/uploads/lookbook.json.aus
curl -s -o /tmp/lookbook-test/out.json -w "%{http_code}\n" http://127.0.0.1:8765/api/lookbook.php
cat /tmp/lookbook-test/out.json
```

Expected:
```
200
{"version":1,"sections":{"badezimmer":[],"wohnraum":[],"terrasse":[],"manufaktur":[],"details":[]}}
```

Aufräumen: `kill %1` und `rm -rf /tmp/lookbook-test`

- [ ] **Step 6: Commit**

```bash
git add -- public/api/lookbook_store.php public/api/lookbook.php public/uploads-README.md
git commit -m "feat: Manifest-Speicher und Auslieferungs-Endpoint fuer das Lookbook"
```

---

## Task 4: Merkzettel-Store

**Files:**
- Create: `src/lib/merkzettel.js`
- Create: `src/lib/merkzettel.test.js`
- Create: `src/hooks/useMerkzettel.js`

**Interfaces:**
- Consumes: nichts
- Produces:
  - Konstanten: `MAX_PICKS = 40`, `STORAGE_KEY = 'stonetec:merkzettel'`
  - Reine Helfer: `sanitizeIds(value: unknown, max?: number): string[]`, `addId(ids: string[], id: string, max?: number): string[]`, `removeId(ids: string[], id: string): string[]`, `parseStored(raw: unknown): string[]`
  - Store: `initMerkzettel(storage?: Storage | null): void`, `getSnapshot(): string[]`, `subscribe(listener: () => void): () => void`, `toggle(id: string): boolean` (true = jetzt gemerkt), `remove(id: string): void`, `clear(): void`, `replaceAll(ids: string[]): void`, `isFull(): boolean`, `syncFromStorage(): void`
  - Hook: `useMerkzettel(): {ids: string[], count: number, has: (id) => boolean, toggle, remove, clear, replaceAll, isFull: boolean}`

- [ ] **Step 1: Write the failing test**

Create `src/lib/merkzettel.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/merkzettel.test.js`
Expected: FAIL — `Failed to resolve import "./merkzettel.js"`

- [ ] **Step 3: Write the implementation**

Create `src/lib/merkzettel.js`:

```js
// Merkzettel: die Bildauswahl des Besuchers.
//
// Liegt ausschließlich im Browser (localStorage) — es geht nichts an den Server,
// solange der Besucher nicht selbst eine Anfrage absendet. Der Speicher erfüllt
// damit genau die Funktion, die der Nutzer angefordert hat, und ist nach
// § 25 Abs. 2 Nr. 2 TDDDG einwilligungsfrei.
//
// Bewusst ein eigener kleiner Store statt React-Context: die Auswahl wird auf
// jeder Bildkachel gelesen, und ein Context würde bei jedem Herz-Klick den
// gesamten Teilbaum neu rendern. useSyncExternalStore rendert nur die
// Komponenten neu, die wirklich abonniert haben.

export const MAX_PICKS = 40
export const STORAGE_KEY = 'stonetec:merkzettel'

// Bestands-IDs sind 5 Zeichen (bad01), neue ebenfalls. Der weitere Rahmen
// verträgt spätere Formatänderungen, ohne alte Links zu brechen.
const ID_PATTERN = /^[a-z0-9]{2,12}$/

export function sanitizeIds(value, max = MAX_PICKS) {
  if (!Array.isArray(value)) return []
  const out = []
  const seen = new Set()
  for (const raw of value) {
    if (typeof raw !== 'string' || !ID_PATTERN.test(raw) || seen.has(raw)) continue
    seen.add(raw)
    out.push(raw)
    if (out.length >= max) break
  }
  return out
}

export function addId(ids, id, max = MAX_PICKS) {
  if (typeof id !== 'string' || !ID_PATTERN.test(id)) return ids
  if (ids.includes(id) || ids.length >= max) return ids
  return [...ids, id]
}

export function removeId(ids, id) {
  if (!ids.includes(id)) return ids
  return ids.filter((entry) => entry !== id)
}

export function parseStored(raw) {
  if (typeof raw !== 'string' || raw === '') return []
  try {
    return sanitizeIds(JSON.parse(raw))
  } catch {
    return []
  }
}

/* ─── Store ──────────────────────────────────────────────────── */

let storageRef = null
let current = []
const listeners = new Set()

function readStorage() {
  if (!storageRef) return []
  try {
    return parseStored(storageRef.getItem(STORAGE_KEY))
  } catch {
    // Safari im privaten Modus wirft beim Zugriff. Der Merkzettel arbeitet dann
    // nur für die Dauer des Seitenbesuchs — das ist besser als ein Absturz.
    return []
  }
}

function writeStorage(ids) {
  if (!storageRef) return
  try {
    storageRef.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // siehe oben
  }
}

function commit(next) {
  if (next === current) return
  current = next
  writeStorage(current)
  for (const listener of listeners) listener()
}

function defaultStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

export function initMerkzettel(storage = defaultStorage()) {
  storageRef = storage ?? null
  current = readStorage()
  for (const listener of listeners) listener()
}

/** Stabile Referenz — Voraussetzung für useSyncExternalStore. */
export function getSnapshot() {
  return current
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function isFull() {
  return current.length >= MAX_PICKS
}

/** @returns {boolean} true, wenn das Bild jetzt gemerkt ist. */
export function toggle(id) {
  if (current.includes(id)) {
    commit(removeId(current, id))
    return false
  }
  commit(addId(current, id))
  // Nach dem Commit steht in `current` das Ergebnis — bei voller Liste
  // unverändert, sonst mit der neuen ID.
  return current.includes(id)
}

export function remove(id) {
  commit(removeId(current, id))
}

export function clear() {
  commit(current.length === 0 ? current : [])
}

export function replaceAll(ids) {
  const next = sanitizeIds(ids)
  if (next.length === current.length && next.every((id, i) => id === current[i])) return
  commit(next)
}

/** Für das storage-Event: übernimmt Änderungen aus anderen Tabs. */
export function syncFromStorage() {
  const next = readStorage()
  if (next.length === current.length && next.every((id, i) => id === current[i])) return
  commit(next)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/merkzettel.test.js`
Expected: PASS — alle Tests grün

- [ ] **Step 5: Write the React binding**

Create `src/hooks/useMerkzettel.js`:

```js
import { useCallback, useEffect, useSyncExternalStore } from 'react'
import {
  MAX_PICKS, STORAGE_KEY,
  initMerkzettel, getSnapshot, subscribe, syncFromStorage,
  toggle as toggleId, remove as removeIdFromStore, clear as clearStore, replaceAll as replaceAllInStore,
} from '../lib/merkzettel.js'

let initialized = false

const EMPTY = []

export function useMerkzettel() {
  if (!initialized && typeof window !== 'undefined') {
    initMerkzettel()
    initialized = true
  }

  const ids = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY)

  // Mehrere offene Tabs halten dieselbe Auswahl.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) syncFromStorage()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const has = useCallback((id) => ids.includes(id), [ids])

  return {
    ids,
    count: ids.length,
    has,
    isFull: ids.length >= MAX_PICKS,
    toggle: toggleId,
    remove: removeIdFromStore,
    clear: clearStore,
    replaceAll: replaceAllInStore,
  }
}
```

- [ ] **Step 6: Verify the whole suite still passes**

Run: `npm test`
Expected: PASS — bestehende Tests (`track`, `heroLeadClient`, `heroLead`) plus die neuen

- [ ] **Step 7: Commit**

```bash
git add -- src/lib/merkzettel.js src/lib/merkzettel.test.js src/hooks/useMerkzettel.js
git commit -m "feat: Merkzettel-Store mit localStorage und Tab-Synchronisierung"
```

---

## Task 5: Teilen-Helfer

**Files:**
- Create: `src/lib/merkzettelShare.js`
- Create: `src/lib/merkzettelShare.test.js`

**Interfaces:**
- Consumes: `sanitizeIds` aus `src/lib/merkzettel.js`
- Produces:
  - `SHARE_PARAM = 'auswahl'`
  - `buildShareUrl(baseUrl: string, ids: string[]): string`
  - `parseShareParam(search: string): string[]`
  - `hasShareParam(search: string): boolean`
  - `stripShareParam(search: string): string`
  - `shareText(count: number): string`
  - `buildWhatsappUrl(url: string, count: number): string`
  - `buildMailtoUrl(url: string, count: number): string`

- [ ] **Step 1: Write the failing test**

Create `src/lib/merkzettelShare.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/merkzettelShare.test.js`
Expected: FAIL — `Failed to resolve import "./merkzettelShare.js"`

- [ ] **Step 3: Write the implementation**

Create `src/lib/merkzettelShare.js`:

```js
// Teilen des Merkzettels — ohne Serverspeicher.
//
// Die Auswahl steckt vollständig in der URL. Dadurch gibt es keine Datenbank,
// keine Aufbewahrungsfristen und keinen Eintrag in der Datenschutzerklärung.
// Ein geteilter Link funktioniert, solange die Bilder existieren; gelöschte
// Bilder werden beim Öffnen stillschweigend übersprungen.

import { sanitizeIds } from './merkzettel.js'

export const SHARE_PARAM = 'auswahl'

const SHARE_SUBJECT = 'Meine Auswahl aus dem stonetec-Lookbook'

export function shareText(count) {
  const bilder = count === 1 ? '1 Bild' : `${count} Bilder`
  return `Schau mal — ${bilder} aus dem stonetec-Lookbook, die mir gefallen:`
}

export function buildShareUrl(baseUrl, ids) {
  const clean = sanitizeIds(ids)
  // Basis für relative Eingaben; für absolute URLs bleibt sie wirkungslos.
  const url = new URL(baseUrl, 'https://stonetec-bocholt.de')
  if (clean.length === 0) {
    url.searchParams.delete(SHARE_PARAM)
  } else {
    url.searchParams.set(SHARE_PARAM, clean.join(','))
  }
  // searchParams kodiert Kommas zu %2C — für die Lesbarkeit zurückdrehen.
  return url.toString().replace(/%2C/g, ',')
}

export function parseShareParam(search) {
  const value = new URLSearchParams(search).get(SHARE_PARAM)
  if (!value) return []
  return sanitizeIds(value.split(','))
}

export function hasShareParam(search) {
  return new URLSearchParams(search).has(SHARE_PARAM)
}

export function stripShareParam(search) {
  const params = new URLSearchParams(search)
  params.delete(SHARE_PARAM)
  const rest = params.toString()
  return rest === '' ? '' : `?${rest}`
}

export function buildWhatsappUrl(url, count) {
  return `https://wa.me/?text=${encodeURIComponent(`${shareText(count)}\n${url}`)}`
}

export function buildMailtoUrl(url, count) {
  const subject = encodeURIComponent(SHARE_SUBJECT)
  const body = encodeURIComponent(`${shareText(count)}\n\n${url}`)
  return `mailto:?subject=${subject}&body=${body}`
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/merkzettelShare.test.js`
Expected: PASS — alle Tests grün

- [ ] **Step 5: Commit**

```bash
git add -- src/lib/merkzettelShare.js src/lib/merkzettelShare.test.js
git commit -m "feat: Teilen-Helfer fuer den Merkzettel ohne Serverspeicher"
```

---

## Task 6: Lookbook-Seite auf das Manifest umstellen

Die Seite trägt heute 270 Zeilen Bilddaten und zwei eingebettete Komponenten. Beides wird herausgelöst; die Daten kommen ab jetzt aus Task 1, das Merken aus Task 4.

**Files:**
- Create: `src/components/lookbook/ImageCard.jsx`
- Create: `src/components/lookbook/Lightbox.jsx`
- Modify: `src/pages/Lookbook.jsx` (vollständig ersetzen)

**Interfaces:**
- Consumes: `loadLookbook`, `fallbackSections` (Task 1); `useMerkzettel` (Task 4)
- Produces:
  - `ImageCard({ image, index, categoryLabel, isPicked, onTogglePick, onOpen })`
  - `Lightbox({ image, categoryLabel, isPicked, onTogglePick, onClose, onNext, onPrev })`

- [ ] **Step 1: Write the image card**

Create `src/components/lookbook/ImageCard.jsx`:

```jsx
// eslint-disable-next-line no-unused-vars -- `motion` wird als `motion.div` im JSX genutzt
import { motion } from 'framer-motion'

function HerzIcon({ filled }) {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  )
}

export default function ImageCard({ image, index, categoryLabel, isPicked, onTogglePick, onOpen }) {
  const caption = image.caption?.trim() ? image.caption : categoryLabel

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: Math.min(index, 8) * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="group relative">
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${caption} vergrößern`}
          className="block w-full cursor-pointer text-left"
        >
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-sm">
            <img
              src={image.src}
              alt={caption}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06060680] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <p className="font-dm text-[0.65rem] text-inv-muted uppercase tracking-[2px] mb-1">{categoryLabel}</p>
              <h4 className="font-sora font-light text-sm text-inv-light">{caption}</h4>
            </div>
          </div>
        </button>

        {/* Auf Touch-Geräten dauerhaft sichtbar, am Desktop beim Überfahren —
            und immer sichtbar, sobald das Bild gemerkt ist. */}
        <button
          type="button"
          onClick={onTogglePick}
          aria-pressed={isPicked}
          aria-label={isPicked ? `${caption} aus der Auswahl entfernen` : `${caption} zur Auswahl hinzufügen`}
          className={`absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full backdrop-blur-sm transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-stein ${
            isPicked
              ? 'bg-warm-bg text-warm-text opacity-100'
              : 'bg-black/30 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-black/50'
          }`}
        >
          <HerzIcon filled={isPicked} />
        </button>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Write the lightbox**

Create `src/components/lookbook/Lightbox.jsx`:

```jsx
import { useEffect } from 'react'
// eslint-disable-next-line no-unused-vars -- `motion` wird als `motion.div` im JSX genutzt
import { motion } from 'framer-motion'

function HerzIcon({ filled }) {
  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  )
}

export default function Lightbox({ image, categoryLabel, isPicked, onTogglePick, onClose, onNext, onPrev }) {
  // Tastatursteuerung: Escape schließt, Pfeile blättern.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowRight') onNext()
      else if (event.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, onNext, onPrev])

  if (!image) return null

  const caption = image.caption?.trim() ? image.caption : categoryLabel

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={caption}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-12"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Schließen"
        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110]"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        aria-label="Vorheriges Bild"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-[110] p-4"
      >
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext() }}
        aria-label="Nächstes Bild"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-[110] p-4"
      >
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.src}
          alt={caption}
          className="max-w-full max-h-[78vh] object-contain shadow-2xl rounded-lg"
        />
        <div className="mt-8 text-center">
          <p className="font-dm text-[0.7rem] text-white/40 uppercase tracking-[3px] mb-2">{categoryLabel}</p>
          <h3 className="font-sora font-extralight text-xl md:text-2xl text-white mb-6">{caption}</h3>

          <button
            type="button"
            onClick={onTogglePick}
            aria-pressed={isPicked}
            className={`inline-flex items-center gap-3 rounded-full px-8 py-4 font-dm text-[0.72rem] uppercase tracking-[2px] transition-all duration-300 ${
              isPicked
                ? 'bg-warm-bg text-warm-text hover:bg-white'
                : 'border border-white/25 text-white hover:border-white/60'
            }`}
          >
            <HerzIcon filled={isPicked} />
            {isPicked ? 'Gemerkt' : 'Merken'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
```

- [ ] **Step 3: Replace the page**

Replace the entire contents of `src/pages/Lookbook.jsx` with:

```jsx
import { useCallback, useEffect, useMemo, useState } from 'react'
// eslint-disable-next-line no-unused-vars -- `motion` wird als `motion.div` im JSX genutzt
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import ImageCard from '../components/lookbook/ImageCard.jsx'
import Lightbox from '../components/lookbook/Lightbox.jsx'
import { loadLookbook, fallbackSections } from '../lib/lookbookData.js'
import { useMerkzettel } from '../hooks/useMerkzettel.js'
import { trackEvent } from '../lib/track.js'

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Lookbook() {
  // Die Bestandsdaten stehen sofort — die Seite ist zu keiner Sekunde leer.
  // Das Manifest vom Server ersetzt sie, sobald es eingetroffen ist.
  const [sections, setSections] = useState(() => fallbackSections())
  const [activeSection, setActiveSection] = useState('badezimmer')
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const merkzettel = useMerkzettel()

  useEffect(() => {
    let cancelled = false
    loadLookbook().then((next) => {
      if (!cancelled) setSections(next)
    })
    return () => { cancelled = true }
  }, [])

  const currentSection = useMemo(
    () => sections.find((s) => s.id === activeSection) ?? sections[0],
    [sections, activeSection],
  )
  const images = currentSection?.images ?? []

  // Wechselt der Datenstand, während die Großansicht offen ist, kann der Index
  // ins Leere zeigen — dann schließen statt abstürzen.
  useEffect(() => {
    if (selectedImageIndex !== null && selectedImageIndex >= images.length) {
      setSelectedImageIndex(null)
    }
  }, [images.length, selectedImageIndex])

  const handleTogglePick = useCallback((image) => {
    const nowPicked = merkzettel.toggle(image.id)
    trackEvent(nowPicked ? 'add_to_wishlist' : 'remove_from_wishlist', {
      item_id: image.id,
      item_category: activeSection,
    })
  }, [merkzettel, activeSection])

  const handleNext = useCallback(() => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const handlePrev = useCallback(() => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const selectedImage = selectedImageIndex !== null ? images[selectedImageIndex] : null

  return (
    <div className="bg-warm-bg min-h-screen pt-48 pb-24">
      <SEO
        title="Lookbook — Inspiration für dein Zuhause"
        description="Lass dich von unseren Referenzen inspirieren. Badezimmer, Wohnräume und maßgefertigte Keramik-Unikate in höchster Qualität."
      />

      <AnimatePresence>
        {selectedImage && (
          <Lightbox
            image={selectedImage}
            categoryLabel={currentSection.title}
            isPicked={merkzettel.has(selectedImage.id)}
            onTogglePick={() => handleTogglePick(selectedImage)}
            onClose={() => setSelectedImageIndex(null)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-16">
        <Reveal>
          <p className="font-dm text-[0.68rem] font-medium tracking-[3px] uppercase text-warm-mittel mb-4">
            Inspiration
          </p>
          <h1 className="font-sora font-extralight text-[clamp(3rem,7vw,5.5rem)] text-warm-text leading-[1] tracking-[-0.03em] max-w-4xl mb-8">
            Unser Lookbook.
          </h1>
          <p className="font-dm text-[1.1rem] text-warm-mittel max-w-2xl leading-relaxed">
            Materialien, Ideen, Details. Entdecke die Möglichkeiten moderner Keramik und lass dich von unseren Realisierungen inspirieren.
            Was dir gefällt, kannst du mit dem Herz merken und uns mit deiner Anfrage schicken.
          </p>
        </Reveal>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-16">
        <div className="flex flex-wrap gap-3 md:gap-4 border-b border-warm-anthrazit/10 pb-8">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => { setActiveSection(section.id); setSelectedImageIndex(null) }}
              className={`px-6 py-3 font-dm text-[0.82rem] font-semibold tracking-wider uppercase transition-all duration-500 relative ${
                activeSection === section.id ? 'text-warm-text' : 'text-warm-mittel hover:text-warm-text'
              }`}
            >
              {section.title}
              {activeSection === section.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-warm-stein"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Aktive Kategorie */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="col-span-1 md:col-span-2 lg:col-span-1 mb-8 lg:mb-0">
                <h2 className="font-sora font-extralight text-4xl text-warm-text mb-4">{currentSection.subtitle}</h2>
                <p className="font-dm text-warm-mittel leading-relaxed max-w-md">
                  {currentSection.description}
                </p>
              </div>
              {images.map((img, i) => (
                <ImageCard
                  key={img.id}
                  image={img}
                  index={i}
                  categoryLabel={currentSection.title}
                  isPicked={merkzettel.has(img.id)}
                  onTogglePick={() => handleTogglePick(img)}
                  onOpen={() => setSelectedImageIndex(i)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-32 mt-24">
        <div className="bg-dark-bg rounded-3xl p-12 md:p-24 text-center noise relative overflow-hidden">
          <Reveal>
            <h2 className="font-sora font-extralight text-[clamp(2rem,5vw,3.5rem)] text-inv-light leading-tight tracking-[-0.02em] mb-12 relative z-10">
              Vom Lookbook zur Realität.<br />Lass uns planen.
            </h2>
            <Link
              to="/kontakt"
              className="inline-block bg-inv-light text-dark-bg font-dm text-[0.7rem] uppercase tracking-[3px] px-12 py-6 rounded-full hover:bg-warm-mittel hover:text-inv-light transition-all duration-500 relative z-10"
            >
              Beratungstermin vereinbaren
            </Link>
          </Reveal>

          <div className="absolute top-0 right-0 w-64 h-64 bg-warm-stein/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-warm-mittel/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Lint and build**

Run: `npm run lint`
Expected: keine Fehler in den drei berührten Dateien

Run: `npm run build`
Expected: `✓ built in …` ohne Fehler

- [ ] **Step 5: Verify in the browser**

Dev-Server über das Preview-Werkzeug starten (nicht über Bash) und `/lookbook` öffnen. Zu prüfen:

1. Alle fünf Kategorie-Reiter schalten um, Bilder erscheinen wie zuvor.
2. Ein Klick auf das Herz färbt es aus; Neuladen der Seite behält den Zustand.
3. Konsole zeigt einen fehlgeschlagenen Aufruf von `/api/lookbook.php` (im Dev-Server gibt es kein PHP) — die Bilder sind trotzdem da. **Genau das ist der Fallback-Beweis.**
4. Großansicht: Escape schließt, Pfeiltasten blättern, der Merken-Knopf wechselt seine Beschriftung.

- [ ] **Step 6: Commit**

```bash
git add -- src/components/lookbook/ImageCard.jsx src/components/lookbook/Lightbox.jsx src/pages/Lookbook.jsx
git commit -m "feat: Lookbook laedt aus dem Manifest und Bilder lassen sich merken"
```

---

## Task 7: Merkzettel-Leiste, Teilen und geteilte Links

**Files:**
- Create: `src/components/lookbook/MerkzettelBar.jsx`
- Modify: `src/pages/Lookbook.jsx`

**Interfaces:**
- Consumes: `useMerkzettel` (Task 4); `buildShareUrl`, `parseShareParam`, `hasShareParam`, `stripShareParam`, `shareText`, `buildWhatsappUrl`, `buildMailtoUrl` (Task 5); `MAX_PICKS` (Task 4)
- Produces: `MerkzettelBar({ sections })` — findet die Bilddaten zu den gemerkten IDs selbst

- [ ] **Step 1: Write the bar**

Create `src/components/lookbook/MerkzettelBar.jsx`:

```jsx
import { useMemo, useState } from 'react'
// eslint-disable-next-line no-unused-vars -- `motion` wird als `motion.div` im JSX genutzt
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useMerkzettel } from '../../hooks/useMerkzettel.js'
import { MAX_PICKS } from '../../lib/merkzettel.js'
import {
  buildShareUrl, buildWhatsappUrl, buildMailtoUrl, shareText,
} from '../../lib/merkzettelShare.js'
import { trackEvent } from '../../lib/track.js'

const SHARE_TITLE = 'Meine Auswahl aus dem stonetec-Lookbook'

export default function MerkzettelBar({ sections }) {
  const merkzettel = useMerkzettel()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [copyState, setCopyState] = useState('idle') // idle | copied | failed

  // Gemerkte IDs zu vollständigen Bilddaten auflösen, in der Reihenfolge des
  // Merkens. Bilder, die es nicht mehr gibt, fallen still heraus.
  const picked = useMemo(() => {
    const byId = new Map()
    for (const section of sections) {
      for (const image of section.images) {
        byId.set(image.id, { ...image, categoryLabel: section.title })
      }
    }
    return merkzettel.ids.map((id) => byId.get(id)).filter(Boolean)
  }, [sections, merkzettel.ids])

  const count = merkzettel.count
  if (count === 0) return null

  const shareUrl = buildShareUrl(
    typeof window !== 'undefined' ? `${window.location.origin}/lookbook` : '/lookbook',
    merkzettel.ids,
  )
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: SHARE_TITLE, text: shareText(count), url: shareUrl })
      trackEvent('share', { method: 'native', item_count: count })
    } catch {
      // Der Nutzer hat das Teilen-Menü abgebrochen — kein Fehlerfall.
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopyState('copied')
      trackEvent('share', { method: 'copy', item_count: count })
    } catch {
      // Ohne Clipboard-Erlaubnis bekommt der Nutzer den Link zum Markieren.
      setCopyState('failed')
    }
  }

  const handleRequest = () => {
    trackEvent('select_content', { content_type: 'merkzettel_anfrage', item_count: count })
    setIsOpen(false)
    navigate('/kontakt')
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[90] pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 pb-4 md:px-12 md:pb-6 flex justify-center">
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            className="pointer-events-auto inline-flex items-center gap-3 rounded-full bg-dark-bg px-7 py-4 font-dm text-[0.78rem] uppercase tracking-[2px] text-inv-light shadow-lg transition-colors duration-300 hover:bg-warm-anthrazit"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            Meine Auswahl ({count})
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[95] bg-black/40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              role="dialog"
              aria-label="Meine Auswahl"
              className="fixed bottom-0 left-0 right-0 z-[96] max-h-[85vh] overflow-y-auto rounded-t-3xl bg-warm-bg p-6 shadow-2xl md:p-10"
            >
              <div className="mx-auto max-w-3xl">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-sora text-2xl font-extralight text-warm-text">Meine Auswahl</h2>
                    <p className="mt-1 font-dm text-[0.85rem] text-warm-mittel">
                      {count === 1 ? '1 Bild gemerkt' : `${count} Bilder gemerkt`}
                      {count >= MAX_PICKS && ' — deine Auswahl ist voll'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Schließen"
                    className="text-warm-mittel transition-colors hover:text-warm-text"
                  >
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <ul className="mb-8 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                  {picked.map((image) => (
                    <li key={image.id} className="group relative">
                      <img
                        src={image.src}
                        alt={image.caption?.trim() ? image.caption : image.categoryLabel}
                        loading="lazy"
                        className="aspect-square w-full rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => merkzettel.remove(image.id)}
                        aria-label="Aus der Auswahl entfernen"
                        className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-dark-bg text-inv-light transition-colors hover:bg-warm-anthrazit"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleRequest}
                    className="flex-1 bg-dark-bg px-8 py-4 font-dm text-[0.8rem] font-semibold uppercase tracking-wider text-inv-light transition-colors hover:bg-warm-anthrazit"
                  >
                    Auswahl anfragen
                  </button>

                  {canNativeShare ? (
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="flex-1 border border-warm-anthrazit/30 px-8 py-4 font-dm text-[0.8rem] font-semibold uppercase tracking-wider text-warm-text transition-colors hover:border-warm-anthrazit"
                    >
                      Auswahl teilen
                    </button>
                  ) : (
                    <div className="flex flex-1 gap-3">
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="flex-1 border border-warm-anthrazit/30 px-6 py-4 font-dm text-[0.8rem] font-semibold uppercase tracking-wider text-warm-text transition-colors hover:border-warm-anthrazit"
                      >
                        {copyState === 'copied' ? 'Link kopiert' : 'Link kopieren'}
                      </button>
                      <a
                        href={buildWhatsappUrl(shareUrl, count)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent('share', { method: 'whatsapp', item_count: count })}
                        className="grid place-items-center border border-warm-anthrazit/30 px-5 font-dm text-[0.8rem] uppercase tracking-wider text-warm-text transition-colors hover:border-warm-anthrazit"
                      >
                        WhatsApp
                      </a>
                      <a
                        href={buildMailtoUrl(shareUrl, count)}
                        onClick={() => trackEvent('share', { method: 'email', item_count: count })}
                        className="grid place-items-center border border-warm-anthrazit/30 px-5 font-dm text-[0.8rem] uppercase tracking-wider text-warm-text transition-colors hover:border-warm-anthrazit"
                      >
                        E-Mail
                      </a>
                    </div>
                  )}
                </div>

                {copyState === 'failed' && (
                  <label className="mt-4 block font-dm text-[0.8rem] text-warm-mittel">
                    Kopieren wurde vom Browser blockiert — hier ist der Link zum Markieren:
                    <input
                      readOnly
                      value={shareUrl}
                      onFocus={(e) => e.target.select()}
                      className="mt-2 w-full rounded-lg border border-warm-anthrazit/20 bg-white px-3 py-2 font-dm text-[0.8rem] text-warm-text"
                    />
                  </label>
                )}

                <button
                  type="button"
                  onClick={() => merkzettel.clear()}
                  className="mt-6 font-dm text-[0.8rem] text-warm-mittel underline underline-offset-4 transition-colors hover:text-warm-text"
                >
                  Alle entfernen
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
```

- [ ] **Step 2: Wire the bar and the shared-link handling into the page**

In `src/pages/Lookbook.jsx` die Import-Zeilen um zwei Einträge ergänzen:

```jsx
import MerkzettelBar from '../components/lookbook/MerkzettelBar.jsx'
import { parseShareParam, hasShareParam, stripShareParam } from '../lib/merkzettelShare.js'
```

Direkt unter `const merkzettel = useMerkzettel()` einfügen:

```jsx
  const [sharedInfo, setSharedInfo] = useState(null) // {applied: number, missing: number}
```

Den Lade-Effekt vollständig ersetzen durch:

```jsx
  useEffect(() => {
    let cancelled = false
    loadLookbook().then((next) => {
      if (cancelled) return
      setSections(next)

      // Geteilten Link übernehmen — erst jetzt, weil wir den Bildbestand
      // kennen müssen, um fehlende IDs benennen zu können.
      if (typeof window === 'undefined' || !hasShareParam(window.location.search)) return
      const wanted = parseShareParam(window.location.search)
      const known = new Set(next.flatMap((s) => s.images.map((img) => img.id)))
      const applied = wanted.filter((id) => known.has(id))

      // Ersetzen, nicht ergänzen: der Empfänger soll genau das sehen, was
      // geteilt wurde.
      merkzettel.replaceAll(applied)
      setSharedInfo({ applied: applied.length, missing: wanted.length - applied.length })
      trackEvent('view_shared_selection', { item_count: applied.length })

      // Parameter aus der Adresszeile nehmen, damit ein Neuladen die eigene
      // Auswahl nicht erneut überschreibt.
      const rest = stripShareParam(window.location.search)
      window.history.replaceState({}, '', `${window.location.pathname}${rest}${window.location.hash}`)
    })
    return () => { cancelled = true }
    // merkzettel.replaceAll ist über den Store stabil; der Effekt soll genau
    // einmal beim Betreten der Seite laufen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
```

Direkt vor dem `{/* Navigation */}`-Block einfügen:

```jsx
      {sharedInfo && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-10">
          <div className="rounded-2xl border border-warm-anthrazit/15 bg-warm-anthrazit/5 px-6 py-4">
            <p className="font-dm text-[0.88rem] text-warm-text">
              Geteilte Auswahl — {sharedInfo.applied === 1 ? '1 Bild' : `${sharedInfo.applied} Bilder`}
              {sharedInfo.missing > 0 && (
                <span className="text-warm-mittel">
                  {' '}({sharedInfo.missing === 1 ? '1 Bild ist' : `${sharedInfo.missing} Bilder sind`} nicht mehr verfügbar)
                </span>
              )}
            </p>
          </div>
        </div>
      )}
```

Und unmittelbar vor dem schließenden `</div>` der Seite, nach dem CTA-Block:

```jsx
      <MerkzettelBar sections={sections} />
```

- [ ] **Step 3: Lint and build**

Run: `npm run lint`
Expected: keine Fehler

Run: `npm run build`
Expected: `✓ built in …`

- [ ] **Step 4: Verify in the browser**

Dev-Server über das Preview-Werkzeug, `/lookbook`:

1. Ohne gemerkte Bilder ist keine Leiste sichtbar.
2. Ein Bild merken → Leiste erscheint mit „Meine Auswahl (1)".
3. Panel öffnen: Miniatur sichtbar, das kleine X entfernt sie, „Alle entfernen" leert.
4. Drei Bilder merken, „Link kopieren", die kopierte URL in einem neuen Tab öffnen. Erwartung: Banner „Geteilte Auswahl — 3 Bilder", genau diese drei Herzen sind gefüllt, und `?auswahl=` verschwindet aus der Adresszeile.
5. Eine erfundene ID anhängen (`?auswahl=bad01,zzzzz`) und öffnen. Erwartung: „Geteilte Auswahl — 1 Bild (1 Bild ist nicht mehr verfügbar)".
6. Am Handy oder in einem Browser mit Web-Share-Unterstützung erscheint statt der drei Knöpfe ein einzelner „Auswahl teilen".

- [ ] **Step 5: Commit**

```bash
git add -- src/components/lookbook/MerkzettelBar.jsx src/pages/Lookbook.jsx
git commit -m "feat: Merkzettel-Leiste mit Teilen und Uebernahme geteilter Links"
```

---

## Task 8: Auswahl in den Anfrage-Wizard

**Files:**
- Create: `src/components/anfrage/AuswahlVorschau.jsx`
- Create: `src/lib/heroLeadClient.picks.test.js`
- Modify: `src/components/anfrage/AnfrageWizard.jsx`

**Interfaces:**
- Consumes: `useMerkzettel` (Task 4), `loadLookbook` (Task 1), `submitLead` (bestehend)
- Produces: `AuswahlVorschau()` — eigenständig, ohne Props

**Hinweis:** `submitLead()` verteilt seine Nutzlast bereits mit `{...formData}`. Ein zusätzliches Feld `lookbookPicks` im Wizard-Zustand landet dadurch **ohne Änderung an `heroLeadClient.js`** in der Anfrage. Der neue Test hält genau das fest, damit es niemand versehentlich zurückbaut.

- [ ] **Step 1: Write the failing test**

Create `src/lib/heroLeadClient.picks.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npx vitest run src/lib/heroLeadClient.picks.test.js`
Expected: PASS

Dieser Test ist bewusst von Anfang an grün — er sichert bestehendes Verhalten ab, das die folgenden Schritte voraussetzen. Schlägt er fehl, greift `submitLead` nicht mehr auf `{...formData}` zurück; dann muss `src/lib/heroLeadClient.js` das Feld explizit durchreichen, bevor es weitergeht.

- [ ] **Step 3: Write the preview component**

Create `src/components/anfrage/AuswahlVorschau.jsx`:

```jsx
import { useEffect, useState } from 'react'
import { useMerkzettel } from '../../hooks/useMerkzettel.js'
import { loadLookbook } from '../../lib/lookbookData.js'

// Zeigt über dem Wizard, welche gemerkten Bilder mit der Anfrage rausgehen.
// Lädt den Bildbestand selbst — der Aufruf ist 60 Sekunden zwischengespeichert
// und kostet auf der Kontaktseite praktisch nichts.
export default function AuswahlVorschau() {
  const merkzettel = useMerkzettel()
  const [sections, setSections] = useState([])

  useEffect(() => {
    let cancelled = false
    loadLookbook().then((next) => {
      if (!cancelled) setSections(next)
    })
    return () => { cancelled = true }
  }, [])

  if (merkzettel.count === 0) return null

  const byId = new Map()
  for (const section of sections) {
    for (const image of section.images) byId.set(image.id, { ...image, categoryLabel: section.title })
  }
  const picked = merkzettel.ids.map((id) => byId.get(id)).filter(Boolean)
  if (picked.length === 0) return null

  return (
    <div className="mb-6 rounded-xl border border-warm-anthrazit/15 bg-warm-anthrazit/5 p-5">
      <p className="mb-4 font-dm text-[0.85rem] text-warm-text">
        {picked.length === 1
          ? '1 Bild aus deiner Auswahl wird mitgeschickt.'
          : `${picked.length} Bilder aus deiner Auswahl werden mitgeschickt.`}
      </p>
      <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
        {picked.map((image) => (
          <li key={image.id} className="relative">
            <img
              src={image.src}
              alt={image.caption?.trim() ? image.caption : image.categoryLabel}
              loading="lazy"
              className="aspect-square w-full rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={() => merkzettel.remove(image.id)}
              aria-label="Aus der Auswahl entfernen"
              className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-dark-bg text-inv-light transition-colors hover:bg-warm-anthrazit"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 4: Wire it into the wizard**

In `src/components/anfrage/AnfrageWizard.jsx` zwei Importe ergänzen:

```jsx
import AuswahlVorschau from './AuswahlVorschau.jsx'
import { useMerkzettel } from '../../hooks/useMerkzettel.js'
```

Unter `const reduce = useReducedMotion()` einfügen:

```jsx
  const merkzettel = useMerkzettel()
```

In `handleSubmit` die Zeile `await submitLead(data)` ersetzen durch:

```jsx
      await submitLead({ ...data, lookbookPicks: merkzettel.ids })
```

Im JSX die Zeile `<WizardProgress current={step} total={steps.length} />` ersetzen durch:

```jsx
      <AuswahlVorschau />
      <WizardProgress current={step} total={steps.length} />
```

**Wichtig:** Die Vorschau steht innerhalb des dunklen Wizard-Kastens. Falls der helle Kasten dort optisch bricht, stattdessen in `src/pages/Kontakt.jsx` direkt über `<AnfrageWizard />` setzen und den Import entsprechend verschieben — die Komponente ist an beiden Stellen lauffähig, weil sie ihre Daten selbst holt.

- [ ] **Step 5: Lint, test, build**

Run: `npm run lint`
Expected: keine Fehler

Run: `npm test`
Expected: PASS — alles grün

Run: `npm run build`
Expected: `✓ built in …`

- [ ] **Step 6: Verify in the browser**

Dev-Server über das Preview-Werkzeug:

1. Auf `/lookbook` drei Bilder merken.
2. Panel öffnen, „Auswahl anfragen" — Sprung auf `/kontakt`.
3. Über dem Wizard steht „3 Bilder aus deiner Auswahl werden mitgeschickt." mit drei Miniaturen.
4. Eine Miniatur entfernen → Text sagt „2 Bilder", und auf `/lookbook` ist das Herz dort wieder leer.
5. Netzwerk-Tab öffnen, Wizard ausfüllen und absenden. Der `POST /api/lead.php` scheitert im Dev-Server (kein PHP) — entscheidend ist die **Nutzlast**: sie muss `"lookbookPicks":["…","…"]` enthalten.

- [ ] **Step 7: Commit**

```bash
git add -- src/components/anfrage/AuswahlVorschau.jsx src/components/anfrage/AnfrageWizard.jsx src/lib/heroLeadClient.picks.test.js
git commit -m "feat: gemerkte Bilder gehen mit der Anfrage an das Hero-CRM"
```

---

## Task 9: Merkzettel-Links im Hero-Kommentar

**Files:**
- Modify: `public/api/lead.php`

**Interfaces:**
- Consumes: `lookbook_read()`, `lookbook_resolve_ids()` aus `public/api/lookbook_store.php` (Task 3)
- Produces: nichts für spätere Tasks

**Warum Links statt Anhänge:** Das Bildformat der Hero-API ist laut README nicht öffentlich dokumentiert, und Anhänge sind der fragilste Teil der Schnittstelle. Links kommen garantiert an und sind mit einem Klick einsehbar.

- [ ] **Step 1: Include the store**

In `public/api/lead.php` direkt unter der Zeile `header('Content-Type: application/json; charset=utf-8');` einfügen:

```php
require __DIR__ . '/lookbook_store.php';
```

- [ ] **Step 2: Append the merkzettel block to the comment**

In `public/api/lead.php` den Abschnitt, der heute so aussieht:

```php
$message = trim($data['message'] ?? '');
if ($message !== '') $lines[] = 'Nachricht: "' . $message . '"';
$comment = implode("\n", $lines);
```

ersetzen durch:

```php
$message = trim($data['message'] ?? '');
if ($message !== '') $lines[] = 'Nachricht: "' . $message . '"';

// Merkzettel: die vom Besucher gemerkten Lookbook-Bilder als klickbare Links.
// Bewusst Links statt Dateianhänge — das images-Format der Hero-API ist nicht
// dokumentiert, Links funktionieren garantiert.
$picks = $data['lookbookPicks'] ?? [];
if (is_array($picks) && $picks !== []) {
    // Feste Basis-URL statt HTTP_HOST: der Host-Header ist vom Aufrufer
    // steuerbar und würde sonst fremde Links ins CRM tragen.
    $siteUrl = rtrim(getenv('SITE_URL') ?: ($cfg['SITE_URL'] ?? 'https://stonetec-bocholt.de'), '/');
    $entries = lookbook_resolve_ids(lookbook_read(), $picks, 20);

    if ($entries !== []) {
        $count = count($entries);
        $kopf = 'Merkzettel (' . $count . ($count === 1 ? ' Bild' : ' Bilder');
        if (count($picks) > $count) {
            $kopf .= ' von ' . count($picks) . ' ausgewählten';
        }
        $kopf .= '):';

        $block = [$kopf];
        foreach ($entries as $img) {
            $block[] = $siteUrl . $img['src'];
        }
        $lines[] = implode("\n", $block);
    }
}

$comment = implode("\n", $lines);
```

- [ ] **Step 3: Verify the comment assembly**

Ohne PHP-Testframework wird der Zusammenbau mit einem Wegwerf-Script geprüft.

```bash
mkdir -p /tmp/lead-test/api /tmp/lead-test/uploads
cp public/api/lookbook_store.php /tmp/lead-test/api/
cp build-output/uploads/lookbook.json /tmp/lead-test/uploads/
cat > /tmp/lead-test/pruefung.php <<'PHP'
<?php
require '/tmp/lead-test/api/lookbook_store.php';
$manifest = lookbook_read();

// Fall 1: drei bekannte IDs, eine unbekannte
$treffer = lookbook_resolve_ids($manifest, ['bad01', 'zzzzz', 'ter02', 'det14'], 20);
echo "Fall 1 — gefunden: " . count($treffer) . "\n";
foreach ($treffer as $t) { echo "  https://stonetec-bocholt.de" . $t['src'] . "\n"; }

// Fall 2: Kappung bei 20
$viele = array_map(fn($i) => 'bad' . str_pad((string)$i, 2, '0', STR_PAD_LEFT), range(1, 10));
echo "Fall 2 — Kappung auf 2: " . count(lookbook_resolve_ids($manifest, $viele, 2)) . "\n";

// Fall 3: nur unbekannte IDs
echo "Fall 3 — leer: " . count(lookbook_resolve_ids($manifest, ['aaaaa', 'bbbbb'], 20)) . "\n";
PHP
php /tmp/lead-test/pruefung.php
```

Expected:
```
Fall 1 — gefunden: 3
  https://stonetec-bocholt.de/images/lookbook/badezimmer/stonetec-lookbook-badezimmer-1.jpg
  https://stonetec-bocholt.de/images/lookbook/terrasse/stonetec-lookbook-terrasse-2.jpg
  https://stonetec-bocholt.de/images/lookbook/details/stonetec-lookbook-details-14.jpg
Fall 2 — Kappung auf 2: 2
Fall 3 — leer: 0
```

Aufräumen: `rm -rf /tmp/lead-test`

Fehlt PHP lokal, entfällt dieser Schritt; die Verifikation erfolgt dann in Schritt 4 auf dem Server und **muss dort nachgeholt werden**.

- [ ] **Step 4: Verify against the live CRM after deployment**

Nach dem nächsten Deploy: auf `/lookbook` zwei Bilder merken, über „Auswahl anfragen" eine echte Testanfrage absenden. In Hero unter **Projekte → neue Anfragen** prüfen:

1. Der Kommentar endet mit einem Block `Merkzettel (2 Bilder):` und zwei vollständigen `https://`-Links.
2. Beide Links öffnen im Browser das richtige Bild.
3. Die Anfrage ist trotz des längeren Kommentars angekommen — Hero hat sie nicht abgewiesen.
4. In GA4 (Echtzeit) ist `generate_lead` unverändert eingegangen.

Schlägt Punkt 3 wegen Kommentarlänge fehl, in Schritt 2 die `20` auf einen kleineren Wert setzen und die Spec entsprechend anpassen.

- [ ] **Step 5: Commit**

```bash
git add -- public/api/lead.php
git commit -m "feat: Merkzettel-Bilder als Links im Hero-Kommentar"
```

---

## Task 10: Admin-Zugang und Absicherung

**Files:**
- Create: `public/admin/auth.php`
- Create: `public/admin/index.php`
- Create: `public/admin/admin.css`
- Modify: `public/api/config.example.php`

**Interfaces:**
- Consumes: `lookbook_dir()` aus `public/api/lookbook_store.php` (Task 3)
- Produces (aus `auth.php`, genutzt von Task 11 und 12):
  - `admin_start_session(): void`
  - `admin_is_logged_in(): bool`
  - `admin_login(string $password): bool`
  - `admin_logout(): void`
  - `admin_require_login(): void`
  - `admin_csrf_token(): string`
  - `admin_check_csrf(?string $token): bool`
  - `admin_is_locked(): bool`
  - `admin_lock_remaining(): int`
  - `admin_ensure_upload_guards(): void`
  - `admin_redirect(string $status): never`

- [ ] **Step 1: Write the auth layer**

Create `public/admin/auth.php`:

```php
<?php
// Zugang zum Lookbook-Admin.
//
// Ein einziges Passwort, als bcrypt-Hash in der nicht committeten config.php
// (gleiches Muster wie HERO_API_KEY). Keine Benutzerverwaltung, keine
// Registrierung, keine Passwort-vergessen-Funktion — der Zugang ist für eine
// Person gedacht.

declare(strict_types=1);

require __DIR__ . '/../api/lookbook_store.php';

const ADMIN_SESSION_FLAG   = 'lookbook_admin_ok';
const ADMIN_SESSION_START  = 'lookbook_admin_since';
const ADMIN_SESSION_CSRF   = 'lookbook_admin_csrf';
const ADMIN_SESSION_TTL    = 8 * 3600;
const ADMIN_MAX_ATTEMPTS   = 5;
const ADMIN_LOCK_SECONDS   = 900;

function admin_config(): array
{
    $cfg = @include __DIR__ . '/../api/config.php';
    return is_array($cfg) ? $cfg : [];
}

function admin_password_hash(): string
{
    $cfg = admin_config();
    return (string) (getenv('ADMIN_PW_HASH') ?: ($cfg['ADMIN_PW_HASH'] ?? ''));
}

function admin_start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/admin/',
        'httponly' => true,
        // Auf einer lokalen http-Testumgebung würde ein erzwungenes `secure`
        // das Cookie verwerfen und den Login unmöglich machen.
        'secure'   => !empty($_SERVER['HTTPS']),
        'samesite' => 'Strict',
    ]);
    session_name('stonetec_admin');
    session_start();

    // Abgelaufene Sitzung verwerfen.
    $since = $_SESSION[ADMIN_SESSION_START] ?? 0;
    if (!empty($_SESSION[ADMIN_SESSION_FLAG]) && (time() - (int) $since) > ADMIN_SESSION_TTL) {
        admin_logout();
    }
}

function admin_is_logged_in(): bool
{
    return !empty($_SESSION[ADMIN_SESSION_FLAG]);
}

/* ─── Drosselung ────────────────────────────────────────────────
   Dateibasierter Zähler je IP unter /uploads/.private/throttle/.
   Das Verzeichnis ist per .htaccess vollständig vom Web abgeschottet. */

function admin_private_dir(): string
{
    return lookbook_dir() . '/.private';
}

function admin_throttle_file(): string
{
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unbekannt');
    return admin_private_dir() . '/throttle/' . hash('sha256', $ip) . '.json';
}

function admin_throttle_read(): array
{
    $file = admin_throttle_file();
    if (!is_readable($file)) {
        return ['count' => 0, 'until' => 0];
    }
    $data = json_decode((string) file_get_contents($file), true);
    if (!is_array($data)) {
        return ['count' => 0, 'until' => 0];
    }
    return ['count' => (int) ($data['count'] ?? 0), 'until' => (int) ($data['until'] ?? 0)];
}

function admin_lock_remaining(): int
{
    $state = admin_throttle_read();
    return max(0, $state['until'] - time());
}

function admin_is_locked(): bool
{
    return admin_lock_remaining() > 0;
}

function admin_note_failure(): void
{
    $dir = admin_private_dir() . '/throttle';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        error_log('[admin] Drosselungsverzeichnis nicht anlegbar');
        return;
    }
    $state = admin_throttle_read();
    $state['count']++;
    if ($state['count'] >= ADMIN_MAX_ATTEMPTS) {
        $state['until'] = time() + ADMIN_LOCK_SECONDS;
        $state['count'] = 0;
    }
    @file_put_contents(admin_throttle_file(), json_encode($state));
}

function admin_clear_failures(): void
{
    @unlink(admin_throttle_file());
}

/* ─── Anmeldung ──────────────────────────────────────────────── */

function admin_login(string $password): bool
{
    if (admin_is_locked()) {
        return false;
    }
    $hash = admin_password_hash();
    if ($hash === '') {
        error_log('[admin] ADMIN_PW_HASH fehlt — Login nicht möglich');
        return false;
    }
    if (!password_verify($password, $hash)) {
        admin_note_failure();
        return false;
    }

    // Session-ID nach der Anmeldung wechseln (Session-Fixation).
    session_regenerate_id(true);
    $_SESSION[ADMIN_SESSION_FLAG]  = true;
    $_SESSION[ADMIN_SESSION_START] = time();
    admin_clear_failures();
    return true;
}

function admin_logout(): void
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
}

function admin_require_login(): void
{
    if (!admin_is_logged_in()) {
        header('Location: index.php');
        exit;
    }
}

/* ─── CSRF ───────────────────────────────────────────────────── */

function admin_csrf_token(): string
{
    if (empty($_SESSION[ADMIN_SESSION_CSRF])) {
        $_SESSION[ADMIN_SESSION_CSRF] = bin2hex(random_bytes(32));
    }
    return (string) $_SESSION[ADMIN_SESSION_CSRF];
}

function admin_check_csrf(?string $token): bool
{
    $expected = $_SESSION[ADMIN_SESSION_CSRF] ?? '';
    return is_string($token) && $expected !== '' && hash_equals((string) $expected, $token);
}

/* ─── Schutzdateien im Upload-Verzeichnis ─────────────────────
   /uploads/ liegt nicht im Repo und wird zur Laufzeit angelegt — die
   Schutzdateien muss deshalb PHP schreiben, sonst werden sie beim Einrichten
   vergessen. Die Website nutzt bereits .htaccess für ihr Routing, AllowOverride
   ist also aktiv. */

function admin_ensure_upload_guards(): void
{
    $uploads = lookbook_dir();
    if (!is_dir($uploads) && !@mkdir($uploads, 0755, true) && !is_dir($uploads)) {
        return;
    }

    $uploadGuard = $uploads . '/.htaccess';
    if (!file_exists($uploadGuard)) {
        // Nowdoc (<<<'…'), damit PHP nichts im Regex-Ausdruck zu interpolieren versucht.
        @file_put_contents($uploadGuard, <<<'HTACCESS'
        # Hochgeladene Dateien dürfen unter keinen Umständen ausgeführt werden.
        php_flag engine off
        AddType text/plain .php .phtml .php3 .php4 .php5 .php7 .phps .cgi .pl

        <FilesMatch "\.(php|phtml|php[0-9]|phps|cgi|pl|py|sh)$">
          Require all denied
        </FilesMatch>

        HTACCESS);
    }

    $private = admin_private_dir();
    if (!is_dir($private) && !@mkdir($private, 0700, true) && !is_dir($private)) {
        return;
    }
    $privateGuard = $private . '/.htaccess';
    if (!file_exists($privateGuard)) {
        @file_put_contents($privateGuard, "Require all denied\n");
    }
}

/** Nach einer POST-Aktion zurück zur Übersicht (Post/Redirect/Get). */
function admin_redirect(string $status): never
{
    header('Location: index.php?status=' . urlencode($status));
    exit;
}
```

- [ ] **Step 2: Write the login page**

Create `public/admin/index.php`:

```php
<?php
declare(strict_types=1);

require __DIR__ . '/auth.php';

admin_start_session();
admin_ensure_upload_guards();

$fehler = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    if (admin_is_locked()) {
        $minuten = (int) ceil(admin_lock_remaining() / 60);
        $fehler = "Zu viele Fehlversuche. Bitte in {$minuten} Minuten erneut versuchen.";
    } elseif (admin_login((string) ($_POST['password'] ?? ''))) {
        header('Location: index.php');
        exit;
    } else {
        $fehler = 'Passwort falsch.';
    }
}

if (isset($_GET['logout'])) {
    admin_logout();
    header('Location: index.php');
    exit;
}

$angemeldet = admin_is_logged_in();
?>
<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Lookbook verwalten — stonetec</title>
  <link rel="stylesheet" href="admin.css">
</head>
<body>
<?php if (!$angemeldet): ?>
  <main class="login">
    <h1>Lookbook verwalten</h1>
    <?php if ($fehler !== ''): ?>
      <p class="fehler"><?= htmlspecialchars($fehler, ENT_QUOTES, 'UTF-8') ?></p>
    <?php endif; ?>
    <form method="post" autocomplete="off">
      <label for="password">Passwort</label>
      <input type="password" id="password" name="password" required autofocus>
      <button type="submit" name="login" value="1">Anmelden</button>
    </form>
  </main>
<?php else: ?>
  <header class="kopf">
    <h1>Lookbook verwalten</h1>
    <a class="abmelden" href="index.php?logout=1">Abmelden</a>
  </header>
  <main class="inhalt">
    <p>Angemeldet. Die Verwaltung der Fotos folgt in den nächsten Schritten.</p>
  </main>
<?php endif; ?>
</body>
</html>
```

- [ ] **Step 3: Write the stylesheet**

Create `public/admin/admin.css`:

```css
/* Bewusst schlicht und großflächig — die Oberfläche wird überwiegend
   auf dem Handy zwischen zwei Baustellen bedient. */
:root {
  --bg: #f7f5f2;
  --text: #1c1a18;
  --mid: #6b6560;
  --line: #ddd7d0;
  --akzent: #1c1a18;
  --fehler: #a3261f;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 16px;
  line-height: 1.5;
}

h1 { font-size: 1.35rem; font-weight: 600; margin: 0; }

.login {
  max-width: 22rem;
  margin: 15vh auto;
  padding: 2rem;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
}

.login h1 { margin-bottom: 1.5rem; }

label { display: block; font-size: 0.85rem; color: var(--mid); margin-bottom: 0.35rem; }

input[type="password"],
input[type="text"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--line);
  border-radius: 8px;
  font: inherit;
  background: #fff;
}

button {
  margin-top: 1rem;
  width: 100%;
  padding: 0.85rem;
  border: 0;
  border-radius: 8px;
  background: var(--akzent);
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

button:hover { opacity: 0.9; }

.fehler {
  padding: 0.7rem 0.9rem;
  border-radius: 8px;
  background: #fdeceb;
  color: var(--fehler);
  font-size: 0.9rem;
}

.kopf {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: #fff;
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  z-index: 10;
}

.abmelden { color: var(--mid); font-size: 0.9rem; }

.inhalt { max-width: 60rem; margin: 0 auto; padding: 1.5rem 1.25rem 6rem; }
```

- [ ] **Step 4: Add the password hash to the config template**

In `public/api/config.example.php` vor der schließenden Zeile `];` ergänzen:

```php

    // Zugang zum Lookbook-Admin unter /admin/.
    // Hash erzeugen (lokal oder auf dem Server):
    //   php -r "echo password_hash('DEIN-PASSWORT', PASSWORD_DEFAULT), PHP_EOL;"
    // Der erzeugte Hash beginnt mit $2y$ — das Klartext-Passwort steht nirgends.
    'ADMIN_PW_HASH' => 'hier-den-bcrypt-hash-eintragen',
```

- [ ] **Step 5: Verify login, lockout and guard files**

```bash
mkdir -p /tmp/admin-test/api /tmp/admin-test/admin
cp public/api/lookbook_store.php /tmp/admin-test/api/
cp public/admin/auth.php public/admin/index.php public/admin/admin.css /tmp/admin-test/admin/
php -r "file_put_contents('/tmp/admin-test/api/config.php', \"<?php return ['ADMIN_PW_HASH' => '\" . password_hash('testpasswort', PASSWORD_DEFAULT) . \"'];\");"
php -S 127.0.0.1:8766 -t /tmp/admin-test > /tmp/admin-test/server.log 2>&1 &
sleep 1
```

**Anmeldung mit falschem Passwort:**
```bash
curl -s -c /tmp/admin-test/cookies -d "login=1&password=falsch" http://127.0.0.1:8766/admin/index.php | grep -o "Passwort falsch."
```
Expected: `Passwort falsch.`

**Anmeldung mit richtigem Passwort:**
```bash
curl -s -c /tmp/admin-test/cookies -b /tmp/admin-test/cookies -L -d "login=1&password=testpasswort" http://127.0.0.1:8766/admin/index.php | grep -o "Angemeldet."
```
Expected: `Angemeldet.`

**Schutzdateien:**
```bash
ls -a /tmp/admin-test/uploads /tmp/admin-test/uploads/.private
cat /tmp/admin-test/uploads/.private/.htaccess
```
Expected: `uploads/` enthält `.htaccess` und `.private/`; `.private/.htaccess` enthält `Require all denied`

**Sperre nach fünf Fehlversuchen:**
```bash
rm -f /tmp/admin-test/cookies
for i in 1 2 3 4 5; do curl -s -d "login=1&password=falsch$i" http://127.0.0.1:8766/admin/index.php > /dev/null; done
curl -s -d "login=1&password=testpasswort" http://127.0.0.1:8766/admin/index.php | grep -o "Zu viele Fehlversuche"
```
Expected: `Zu viele Fehlversuche` — **auch mit dem richtigen Passwort**, das ist der Beweis, dass die Sperre greift.

Aufräumen: `kill %1` und `rm -rf /tmp/admin-test`

Fehlt PHP lokal, wird dieser Schritt vollständig auf dem Server nach dem Deploy nachgeholt — **nicht überspringen**, es ist die einzige Prüfung des Zugangsschutzes.

- [ ] **Step 6: Commit**

```bash
git add -- public/admin/auth.php public/admin/index.php public/admin/admin.css public/api/config.example.php
git commit -m "feat: passwortgeschuetzter Zugang zum Lookbook-Admin"
```

---

## Task 11: Bildverarbeitung und Upload

**Files:**
- Create: `public/admin/imaging.php`
- Create: `public/admin/actions.php`
- Modify: `public/admin/index.php`
- Modify: `public/admin/admin.css`

**Interfaces:**
- Consumes: `auth.php` (Task 10), `lookbook_read/write/new_id` (Task 3)
- Produces (aus `imaging.php`, genutzt von Task 12 nur indirekt):
  - `imaging_capabilities(): array` — `['gd' => bool, 'webp' => bool, 'exif' => bool]`
  - `imaging_process(string $tmpPath, string $targetDir): array` — `['ok' => bool, 'file' => string, 'error' => string]`
- Produces (aus `actions.php`): POST-Endpoint `action=upload`

- [ ] **Step 1: Write the image processing**

Create `public/admin/imaging.php`:

```php
<?php
// Bildaufbereitung für hochgeladene Lookbook-Fotos.
//
// Aus einem 8-MB-Handyfoto werden rund 250 KB. Nebenbei — und das ist der
// wichtigere Teil — verschwinden beim Neu-Encodieren sämtliche EXIF-Daten
// inklusive GPS-Koordinaten. Fotos von Privatkunden verraten so keine Adressen.

declare(strict_types=1);

const IMAGING_MAX_EDGE       = 2000;
const IMAGING_WEBP_QUALITY   = 82;
const IMAGING_JPEG_QUALITY   = 85;
const IMAGING_MAX_BYTES      = 25 * 1024 * 1024;
// Ein Bild mit mehr Pixeln sprengt auf Shared Hosting den Arbeitsspeicher,
// bevor GD überhaupt fertig ist. Lieber sauber ablehnen als fatal abstürzen.
const IMAGING_MAX_PIXELS     = 50_000_000;

function imaging_capabilities(): array
{
    return [
        'gd'   => function_exists('imagecreatetruecolor'),
        'webp' => function_exists('imagewebp'),
        'exif' => function_exists('exif_read_data'),
    ];
}

function imaging_load(string $path, int $type): ?\GdImage
{
    $img = match ($type) {
        IMAGETYPE_JPEG => @imagecreatefromjpeg($path),
        IMAGETYPE_PNG  => @imagecreatefrompng($path),
        IMAGETYPE_WEBP => @imagecreatefromwebp($path),
        default        => false,
    };
    return $img instanceof \GdImage ? $img : null;
}

/** Dreht das Bild gemäß EXIF-Ausrichtung — Hochformat vom Handy landet sonst quer. */
function imaging_apply_orientation(\GdImage $img, string $path, int $type): \GdImage
{
    if ($type !== IMAGETYPE_JPEG || !function_exists('exif_read_data')) {
        return $img;
    }
    $exif = @exif_read_data($path);
    $orientation = (int) ($exif['Orientation'] ?? 1);

    $rotated = match ($orientation) {
        3 => imagerotate($img, 180, 0),
        6 => imagerotate($img, -90, 0),
        8 => imagerotate($img, 90, 0),
        default => null,
    };
    if ($rotated instanceof \GdImage) {
        imagedestroy($img);
        return $rotated;
    }
    return $img;
}

function imaging_resize(\GdImage $img): \GdImage
{
    $w = imagesx($img);
    $h = imagesy($img);
    $longest = max($w, $h);
    if ($longest <= IMAGING_MAX_EDGE) {
        return $img; // Kleinere Bilder werden nicht hochskaliert.
    }

    $faktor = IMAGING_MAX_EDGE / $longest;
    $neuW = max(1, (int) round($w * $faktor));
    $neuH = max(1, (int) round($h * $faktor));

    $ziel = imagecreatetruecolor($neuW, $neuH);
    imagealphablending($ziel, false);
    imagesavealpha($ziel, true);
    imagecopyresampled($ziel, $img, 0, 0, 0, 0, $neuW, $neuH, $w, $h);
    imagedestroy($img);
    return $ziel;
}

/**
 * Prüft, verkleinert und speichert ein hochgeladenes Bild.
 *
 * @return array{ok: bool, file: string, error: string}
 */
function imaging_process(string $tmpPath, string $targetDir): array
{
    $fehler = static fn(string $text): array => ['ok' => false, 'file' => '', 'error' => $text];

    $caps = imaging_capabilities();
    if (!$caps['gd']) {
        return $fehler('Auf diesem Server fehlt die Bildbibliothek GD. Bitte den Hoster kontaktieren.');
    }

    $groesse = @filesize($tmpPath);
    if ($groesse === false || $groesse === 0) {
        return $fehler('Die Datei ist leer.');
    }
    if ($groesse > IMAGING_MAX_BYTES) {
        return $fehler('Die Datei ist größer als 25 MB.');
    }

    // Typ am Inhalt bestimmen, nicht an der Dateiendung.
    $info = @getimagesize($tmpPath);
    if ($info === false) {
        return $fehler('Das ist keine Bilddatei.');
    }
    [$breite, $hoehe, $typ] = $info;

    if (!in_array($typ, [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP], true)) {
        return $fehler('Nur JPG, PNG und WebP werden unterstützt. Bei iPhone-Fotos: Einstellungen → Kamera → Formate → „Maximale Kompatibilität".');
    }
    if (((int) $breite * (int) $hoehe) > IMAGING_MAX_PIXELS) {
        return $fehler('Das Bild hat zu viele Bildpunkte. Bitte vorher verkleinern.');
    }

    // GD braucht ein Vielfaches der Bildgröße im Speicher.
    @ini_set('memory_limit', '512M');

    $img = imaging_load($tmpPath, $typ);
    if ($img === null) {
        return $fehler('Das Bild konnte nicht gelesen werden.');
    }

    $img = imaging_apply_orientation($img, $tmpPath, $typ);
    $img = imaging_resize($img);

    if (!is_dir($targetDir) && !@mkdir($targetDir, 0755, true) && !is_dir($targetDir)) {
        imagedestroy($img);
        return $fehler('Zielordner konnte nicht angelegt werden.');
    }

    // Zufälliger Dateiname — der Originalname wird bewusst nicht übernommen,
    // er kann Kundennamen oder Ähnliches enthalten.
    $useWebp = $caps['webp'];
    $name = bin2hex(random_bytes(4)) . ($useWebp ? '.webp' : '.jpg');
    $ziel = rtrim($targetDir, '/') . '/' . $name;

    if ($useWebp) {
        $ok = imagewebp($img, $ziel, IMAGING_WEBP_QUALITY);
    } else {
        // Rückfallebene, falls GD ohne WebP gebaut wurde.
        $flach = imagecreatetruecolor(imagesx($img), imagesy($img));
        imagefilledrectangle($flach, 0, 0, imagesx($img), imagesy($img), imagecolorallocate($flach, 255, 255, 255));
        imagecopy($flach, $img, 0, 0, 0, 0, imagesx($img), imagesy($img));
        $ok = imagejpeg($flach, $ziel, IMAGING_JPEG_QUALITY);
        imagedestroy($flach);
    }
    imagedestroy($img);

    if (!$ok) {
        return $fehler('Das Bild konnte nicht gespeichert werden.');
    }
    @chmod($ziel, 0644);
    return ['ok' => true, 'file' => $name, 'error' => ''];
}
```

- [ ] **Step 2: Write the upload action**

Create `public/admin/actions.php`:

```php
<?php
// POST-Endpunkte des Lookbook-Admins.
// Alle Aktionen: nur POST, nur angemeldet, nur mit gültigem CSRF-Token.

declare(strict_types=1);

require __DIR__ . '/auth.php';
require __DIR__ . '/imaging.php';

admin_start_session();
admin_require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed');
}
if (!admin_check_csrf($_POST['csrf'] ?? null)) {
    http_response_code(403);
    exit('Ungültiges Formular-Token. Bitte die Seite neu laden.');
}

$aktion = (string) ($_POST['action'] ?? '');

if ($aktion === 'upload') {
    $kategorie = (string) ($_POST['section'] ?? '');
    if (!in_array($kategorie, lookbook_section_keys(), true)) {
        admin_redirect('Unbekannte Kategorie.');
    }

    $dateien = $_FILES['photos'] ?? null;
    if (!is_array($dateien) || !isset($dateien['tmp_name']) || !is_array($dateien['tmp_name'])) {
        admin_redirect('Keine Datei ausgewählt.');
    }

    $zielVerzeichnis = lookbook_dir() . '/lookbook/' . $kategorie;
    $manifest = lookbook_read();
    $erfolgreich = 0;
    $fehlermeldungen = [];

    foreach ($dateien['tmp_name'] as $i => $tmp) {
        $code = (int) ($dateien['error'][$i] ?? UPLOAD_ERR_NO_FILE);
        if ($code === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        if ($code === UPLOAD_ERR_INI_SIZE || $code === UPLOAD_ERR_FORM_SIZE) {
            $fehlermeldungen[] = 'Eine Datei war zu groß für den Server.';
            continue;
        }
        if ($code !== UPLOAD_ERR_OK || !is_uploaded_file((string) $tmp)) {
            $fehlermeldungen[] = 'Eine Datei kam unvollständig an.';
            continue;
        }

        $ergebnis = imaging_process((string) $tmp, $zielVerzeichnis);
        if (!$ergebnis['ok']) {
            $fehlermeldungen[] = $ergebnis['error'];
            continue;
        }

        $manifest['sections'][$kategorie][] = [
            'id'      => lookbook_new_id($manifest),
            'src'     => '/uploads/lookbook/' . $kategorie . '/' . $ergebnis['file'],
            'caption' => '',
        ];
        $erfolgreich++;
    }

    if ($erfolgreich > 0 && !lookbook_write($manifest)) {
        admin_redirect('Die Bilder wurden gespeichert, aber die Liste konnte nicht aktualisiert werden.');
    }

    $meldung = $erfolgreich === 1 ? '1 Foto hinzugefügt.' : "$erfolgreich Fotos hinzugefügt.";
    if ($fehlermeldungen !== []) {
        $meldung .= ' ' . implode(' ', array_unique($fehlermeldungen));
    }
    admin_redirect($meldung);
}

admin_redirect('Unbekannte Aktion.');
```

**Wichtig:** `lookbook_new_id($manifest)` wird innerhalb der Schleife aufgerufen und `$manifest` wächst dabei mit — dadurch kann derselbe Zufallswert innerhalb eines Uploads nicht zweimal vergeben werden.

- [ ] **Step 3: Add the upload form to the admin page**

In `public/admin/index.php` den Block zwischen `<main class="inhalt">` und `</main>` ersetzen durch:

```php
    <?php if (isset($_GET['status'])): ?>
      <p class="hinweis"><?= htmlspecialchars((string) $_GET['status'], ENT_QUOTES, 'UTF-8') ?></p>
    <?php endif; ?>

    <?php $caps = imaging_capabilities(); ?>
    <?php if (!$caps['gd']): ?>
      <p class="fehler">Auf diesem Server fehlt die Bildbibliothek GD — Uploads sind nicht möglich. Bitte den Hoster kontaktieren.</p>
    <?php elseif (!$caps['webp']): ?>
      <p class="hinweis">Hinweis: WebP steht nicht zur Verfügung, die Fotos werden als JPG gespeichert.</p>
    <?php endif; ?>

    <form class="upload" method="post" action="actions.php" enctype="multipart/form-data">
      <input type="hidden" name="csrf" value="<?= htmlspecialchars(admin_csrf_token(), ENT_QUOTES, 'UTF-8') ?>">
      <input type="hidden" name="action" value="upload">

      <label for="section">Kategorie</label>
      <select id="section" name="section" required>
        <?php foreach ($kategorieTitel as $key => $titel): ?>
          <option value="<?= htmlspecialchars($key, ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($titel, ENT_QUOTES, 'UTF-8') ?></option>
        <?php endforeach; ?>
      </select>

      <label for="photos">Fotos auswählen</label>
      <input type="file" id="photos" name="photos[]" accept="image/jpeg,image/png,image/webp" multiple required>

      <button type="submit">Hochladen</button>
      <p class="klein">Große Handyfotos sind kein Problem — sie werden automatisch verkleinert und von Standortdaten befreit.</p>
    </form>
  </main>
```

Und im PHP-Kopf von `index.php`, direkt unter `require __DIR__ . '/auth.php';`, ergänzen:

```php
require __DIR__ . '/imaging.php';

// Anzeigenamen der Kategorien — die Schlüssel stammen aus lookbook_store.php,
// die Titel spiegeln die Beschriftung im Frontend.
$kategorieTitel = [
    'badezimmer' => 'Badezimmer',
    'wohnraum'   => 'Wohnraum & Boden',
    'terrasse'   => 'Terrasse & Pool',
    'manufaktur' => 'Keramikmanufaktur',
    'details'    => 'Details & Handwerk',
];
```

- [ ] **Step 4: Extend the stylesheet**

An `public/admin/admin.css` anhängen:

```css
.hinweis {
  padding: 0.7rem 0.9rem;
  border-radius: 8px;
  background: #eef3ee;
  color: #2c4a2f;
  font-size: 0.9rem;
}

.upload {
  padding: 1.25rem;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  margin-bottom: 2rem;
}

.upload label { margin-top: 0.75rem; }
.upload label:first-of-type { margin-top: 0; }

select,
input[type="file"] {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid var(--line);
  border-radius: 8px;
  font: inherit;
  background: #fff;
}

.klein { font-size: 0.8rem; color: var(--mid); margin-bottom: 0; }
```

- [ ] **Step 5: Verify upload, shrinking and EXIF removal**

```bash
mkdir -p /tmp/admin-test/api /tmp/admin-test/admin
cp public/api/lookbook_store.php /tmp/admin-test/api/
cp public/admin/*.php public/admin/admin.css /tmp/admin-test/admin/
php -r "file_put_contents('/tmp/admin-test/api/config.php', \"<?php return ['ADMIN_PW_HASH' => '\" . password_hash('testpasswort', PASSWORD_DEFAULT) . \"'];\");"

# Großes Testbild mit GPS-freiem, aber vorhandenem EXIF-Block erzeugen
php -r '$i=imagecreatetruecolor(4000,3000); imagefilledrectangle($i,0,0,4000,3000,imagecolorallocate($i,200,120,60)); imagejpeg($i,"/tmp/admin-test/gross.jpg",95);'
ls -la /tmp/admin-test/gross.jpg

php -S 127.0.0.1:8767 -t /tmp/admin-test > /tmp/admin-test/server.log 2>&1 &
sleep 1
curl -s -c /tmp/admin-test/ck -b /tmp/admin-test/ck -d "login=1&password=testpasswort" http://127.0.0.1:8767/admin/index.php > /dev/null
CSRF=$(curl -s -b /tmp/admin-test/ck http://127.0.0.1:8767/admin/index.php | grep -o 'name="csrf" value="[a-f0-9]*"' | head -1 | grep -o '[a-f0-9]\{64\}')
curl -s -b /tmp/admin-test/ck -L \
  -F "csrf=$CSRF" -F "action=upload" -F "section=badezimmer" \
  -F "photos[]=@/tmp/admin-test/gross.jpg" \
  http://127.0.0.1:8767/admin/actions.php | grep -o "1 Foto hinzugefügt."
```
Expected: `1 Foto hinzugefügt.`

```bash
ls -la /tmp/admin-test/uploads/lookbook/badezimmer/
php -r '$f=glob("/tmp/admin-test/uploads/lookbook/badezimmer/*")[0]; $i=getimagesize($f); echo basename($f)," ",$i[0],"x",$i[1]," ",filesize($f)," Bytes\n";'
```
Expected: eine `.webp`-Datei, Maße `2000x1500`, deutlich unter 400.000 Bytes

```bash
cat /tmp/admin-test/uploads/lookbook.json | head -12
```
Expected: unter `"badezimmer"` ein neuer Eintrag mit 5-stelliger `id`, `src` beginnend mit `/uploads/lookbook/badezimmer/` und leerer `caption`

**CSRF-Schutz prüfen:**
```bash
curl -s -o /dev/null -w "%{http_code}\n" -b /tmp/admin-test/ck \
  -F "csrf=falsch" -F "action=upload" -F "section=badezimmer" \
  -F "photos[]=@/tmp/admin-test/gross.jpg" \
  http://127.0.0.1:8767/admin/actions.php
```
Expected: `403`

**Nicht-Bild abweisen:**
```bash
echo "<?php echo 'boese';" > /tmp/admin-test/boese.php
curl -s -b /tmp/admin-test/ck -L -F "csrf=$CSRF" -F "action=upload" -F "section=badezimmer" \
  -F "photos[]=@/tmp/admin-test/boese.php" http://127.0.0.1:8767/admin/actions.php | grep -o "Das ist keine Bilddatei."
```
Expected: `Das ist keine Bilddatei.` — und in `uploads/lookbook/badezimmer/` liegt **keine** neue Datei

Aufräumen: `kill %1` und `rm -rf /tmp/admin-test`

- [ ] **Step 6: Commit**

```bash
git add -- public/admin/imaging.php public/admin/actions.php public/admin/index.php public/admin/admin.css
git commit -m "feat: Foto-Upload mit Verkleinerung, Drehung und EXIF-Entfernung"
```

---

## Task 12: Fotos betiteln, sortieren und löschen

**Files:**
- Modify: `public/admin/actions.php`
- Modify: `public/admin/index.php`
- Modify: `public/admin/admin.css`
- Create: `public/admin/admin.js`

**Interfaces:**
- Consumes: `auth.php` (Task 10), `lookbook_read/write` (Task 3)
- Produces: POST-Endpunkte `action=caption`, `action=sort`, `action=delete` — jeweils mit `ajax=1` als JSON-Antwort `{"ok": bool, "message": string}`

- [ ] **Step 1: Add the JSON answer helper**

In `public/admin/actions.php` unmittelbar nach dem CSRF-Block einfügen:

```php
$istAjax = !empty($_POST['ajax']);

/** Antwortet je nach Aufrufart als JSON oder per Weiterleitung. */
function admin_finish(bool $ok, string $meldung): never
{
    global $istAjax;
    if ($istAjax) {
        header('Content-Type: application/json; charset=utf-8');
        if (!$ok) {
            http_response_code(422);
        }
        echo json_encode(['ok' => $ok, 'message' => $meldung]);
        exit;
    }
    admin_redirect($meldung);
}
```

Im bestehenden Upload-Zweig die drei `admin_redirect(...)`-Aufrufe **nicht** ändern — der Upload läuft weiterhin als normales Formular.

- [ ] **Step 2: Add the three actions**

In `public/admin/actions.php` vor der letzten Zeile `admin_redirect('Unbekannte Aktion.');` einfügen:

```php
if ($aktion === 'caption') {
    $id = (string) ($_POST['id'] ?? '');
    // Bildunterschriften werden im Frontend als Text gerendert (React escapt
    // automatisch); die Längenbegrenzung hält den Hero-Kommentar handhabbar.
    $text = trim((string) ($_POST['caption'] ?? ''));
    if (mb_strlen($text) > 160) {
        $text = mb_substr($text, 0, 160);
    }

    $manifest = lookbook_read();
    $gefunden = false;
    foreach (lookbook_section_keys() as $key) {
        foreach ($manifest['sections'][$key] as $i => $img) {
            if ($img['id'] === $id) {
                $manifest['sections'][$key][$i]['caption'] = $text;
                $gefunden = true;
                break 2;
            }
        }
    }
    if (!$gefunden) {
        admin_finish(false, 'Bild nicht gefunden.');
    }
    if (!lookbook_write($manifest)) {
        admin_finish(false, 'Speichern fehlgeschlagen.');
    }
    admin_finish(true, 'Gespeichert.');
}

if ($aktion === 'sort') {
    $kategorie = (string) ($_POST['section'] ?? '');
    if (!in_array($kategorie, lookbook_section_keys(), true)) {
        admin_finish(false, 'Unbekannte Kategorie.');
    }
    $reihenfolge = array_filter(explode(',', (string) ($_POST['order'] ?? '')));

    $manifest = lookbook_read();
    $vorhanden = [];
    foreach ($manifest['sections'][$kategorie] as $img) {
        $vorhanden[$img['id']] = $img;
    }

    // Erst die übermittelte Reihenfolge, dann alles, was nicht genannt wurde —
    // so geht bei einem veralteten Formular kein Bild verloren.
    $neu = [];
    foreach ($reihenfolge as $id) {
        if (isset($vorhanden[$id])) {
            $neu[] = $vorhanden[$id];
            unset($vorhanden[$id]);
        }
    }
    foreach ($vorhanden as $rest) {
        $neu[] = $rest;
    }

    $manifest['sections'][$kategorie] = $neu;
    if (!lookbook_write($manifest)) {
        admin_finish(false, 'Speichern fehlgeschlagen.');
    }
    admin_finish(true, 'Reihenfolge gespeichert.');
}

if ($aktion === 'delete') {
    $id = (string) ($_POST['id'] ?? '');

    $manifest = lookbook_read();
    $treffer = null;
    foreach (lookbook_section_keys() as $key) {
        foreach ($manifest['sections'][$key] as $i => $img) {
            if ($img['id'] === $id) {
                $treffer = $img;
                array_splice($manifest['sections'][$key], $i, 1);
                break 2;
            }
        }
    }
    if ($treffer === null) {
        admin_finish(false, 'Bild nicht gefunden.');
    }
    if (!lookbook_write($manifest)) {
        admin_finish(false, 'Speichern fehlgeschlagen.');
    }

    // Nur selbst hochgeladene Dateien werden gelöscht. Bestandsbilder unter
    // /images/ gehören zum Deploy und verschwinden lediglich aus der Liste.
    if (str_starts_with($treffer['src'], '/uploads/lookbook/')) {
        $pfad = lookbook_dir() . substr($treffer['src'], strlen('/uploads'));
        $echt = realpath($pfad);
        $wurzel = realpath(lookbook_dir());
        // Doppelter Boden gegen Pfad-Ausbrüche über ../ im Manifest.
        if ($echt !== false && $wurzel !== false && str_starts_with($echt, $wurzel . DIRECTORY_SEPARATOR)) {
            @unlink($echt);
        }
    }

    admin_finish(true, 'Bild gelöscht.');
}
```

- [ ] **Step 3: Render the photo list**

In `public/admin/index.php` unmittelbar vor `</main>` einfügen:

```php
    <?php $manifest = lookbook_read(); ?>
    <?php foreach ($kategorieTitel as $key => $titel): ?>
      <section class="kategorie" data-section="<?= htmlspecialchars($key, ENT_QUOTES, 'UTF-8') ?>">
        <h2><?= htmlspecialchars($titel, ENT_QUOTES, 'UTF-8') ?>
          <span class="anzahl"><?= count($manifest['sections'][$key]) ?></span>
        </h2>

        <?php if ($manifest['sections'][$key] === []): ?>
          <p class="klein">Noch keine Fotos in dieser Kategorie.</p>
        <?php else: ?>
          <ul class="fotos">
            <?php foreach ($manifest['sections'][$key] as $img): ?>
              <li class="foto" draggable="true" data-id="<?= htmlspecialchars($img['id'], ENT_QUOTES, 'UTF-8') ?>">
                <img src="<?= htmlspecialchars($img['src'], ENT_QUOTES, 'UTF-8') ?>" alt="" loading="lazy">
                <input
                  type="text"
                  class="caption"
                  value="<?= htmlspecialchars($img['caption'], ENT_QUOTES, 'UTF-8') ?>"
                  placeholder="Bildunterschrift (optional)"
                  maxlength="160"
                  data-id="<?= htmlspecialchars($img['id'], ENT_QUOTES, 'UTF-8') ?>">
                <button type="button" class="loeschen" data-id="<?= htmlspecialchars($img['id'], ENT_QUOTES, 'UTF-8') ?>">Löschen</button>
              </li>
            <?php endforeach; ?>
          </ul>
        <?php endif; ?>
      </section>
    <?php endforeach; ?>

    <div id="statusleiste" class="statusleiste" hidden></div>
    <script>window.ADMIN_CSRF = <?= json_encode(admin_csrf_token()) ?>;</script>
    <script src="admin.js"></script>
```

Den Platzhalterabsatz `<p>Angemeldet. Die Verwaltung der Fotos folgt in den nächsten Schritten.</p>` aus Task 10 dabei entfernen.

- [ ] **Step 4: Write the client script**

Create `public/admin/admin.js`:

```js
// Bedienlogik des Lookbook-Admins: Bildunterschrift speichern, Reihenfolge per
// Ziehen ändern, Foto löschen. Alles ohne Seitenneuladen — Tim soll auf dem
// Handy zügig durch viele Fotos kommen.
(function () {
  'use strict'

  const statusleiste = document.getElementById('statusleiste')
  let statusTimer = null

  function melden(text, istFehler) {
    statusleiste.textContent = text
    statusleiste.classList.toggle('fehlerhaft', Boolean(istFehler))
    statusleiste.hidden = false
    clearTimeout(statusTimer)
    statusTimer = setTimeout(() => { statusleiste.hidden = true }, 2500)
  }

  async function senden(felder) {
    const body = new FormData()
    body.append('csrf', window.ADMIN_CSRF)
    body.append('ajax', '1')
    for (const [name, wert] of Object.entries(felder)) body.append(name, wert)

    try {
      const res = await fetch('actions.php', { method: 'POST', body })
      const daten = await res.json().catch(() => ({ ok: false, message: 'Unerwartete Antwort.' }))
      melden(daten.message || (daten.ok ? 'Gespeichert.' : 'Fehlgeschlagen.'), !daten.ok)
      return Boolean(daten.ok)
    } catch {
      melden('Keine Verbindung zum Server.', true)
      return false
    }
  }

  /* Bildunterschrift — speichern, wenn das Feld verlassen wird und sich der
     Text tatsächlich geändert hat. */
  document.querySelectorAll('input.caption').forEach((feld) => {
    let letzter = feld.value
    feld.addEventListener('blur', async () => {
      if (feld.value === letzter) return
      const ok = await senden({ action: 'caption', id: feld.dataset.id, caption: feld.value })
      if (ok) letzter = feld.value
      else feld.value = letzter
    })
    feld.addEventListener('keydown', (e) => { if (e.key === 'Enter') feld.blur() })
  })

  /* Löschen */
  document.querySelectorAll('button.loeschen').forEach((knopf) => {
    knopf.addEventListener('click', async () => {
      if (!window.confirm('Dieses Foto wirklich löschen?')) return
      const ok = await senden({ action: 'delete', id: knopf.dataset.id })
      if (ok) knopf.closest('li.foto').remove()
    })
  })

  /* Reihenfolge per Ziehen */
  document.querySelectorAll('section.kategorie').forEach((bereich) => {
    const liste = bereich.querySelector('ul.fotos')
    if (!liste) return
    let gezogen = null

    liste.addEventListener('dragstart', (e) => {
      gezogen = e.target.closest('li.foto')
      if (gezogen) gezogen.classList.add('zieht')
    })

    liste.addEventListener('dragover', (e) => {
      e.preventDefault()
      const ziel = e.target.closest('li.foto')
      if (!ziel || !gezogen || ziel === gezogen) return
      const rechteck = ziel.getBoundingClientRect()
      const dahinter = (e.clientY - rechteck.top) > rechteck.height / 2
      liste.insertBefore(gezogen, dahinter ? ziel.nextSibling : ziel)
    })

    liste.addEventListener('dragend', async () => {
      if (!gezogen) return
      gezogen.classList.remove('zieht')
      gezogen = null
      const order = Array.from(liste.querySelectorAll('li.foto')).map((li) => li.dataset.id).join(',')
      await senden({ action: 'sort', section: bereich.dataset.section, order })
    })
  })
})()
```

- [ ] **Step 5: Extend the stylesheet**

An `public/admin/admin.css` anhängen:

```css
.kategorie { margin-bottom: 2.5rem; }

.kategorie h2 {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.9rem;
}

.anzahl {
  padding: 0.1rem 0.55rem;
  border-radius: 999px;
  background: var(--line);
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--mid);
}

.fotos {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
}

.foto {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0.5rem;
  cursor: grab;
}

.foto.zieht { opacity: 0.4; }

.foto img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: 6px;
  display: block;
  margin-bottom: 0.5rem;
  pointer-events: none; /* sonst zieht der Browser das Bild statt der Kachel */
}

.foto .caption {
  font-size: 0.82rem;
  padding: 0.4rem 0.5rem;
  margin-bottom: 0.4rem;
}

.loeschen {
  width: 100%;
  margin: 0;
  padding: 0.4rem;
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--mid);
  font-size: 0.78rem;
  font-weight: 500;
}

.loeschen:hover { color: var(--fehler); border-color: var(--fehler); opacity: 1; }

.statusleiste {
  position: fixed;
  left: 50%;
  bottom: 1.25rem;
  transform: translateX(-50%);
  padding: 0.65rem 1.2rem;
  border-radius: 999px;
  background: var(--akzent);
  color: #fff;
  font-size: 0.85rem;
  box-shadow: 0 6px 20px rgb(0 0 0 / 18%);
}

.statusleiste.fehlerhaft { background: var(--fehler); }
```

- [ ] **Step 6: Verify the three actions**

Testumgebung wie in Task 11 aufsetzen (`/tmp/admin-test`), anmelden, `$CSRF` holen und ein Foto hochladen. Dann:

**Bildunterschrift:**
```bash
ID=$(php -r '$m=json_decode(file_get_contents("/tmp/admin-test/uploads/lookbook.json"),true); echo $m["sections"]["badezimmer"][0]["id"];')
curl -s -b /tmp/admin-test/ck -d "csrf=$CSRF&ajax=1&action=caption&id=$ID&caption=Fugenlose Dusche" http://127.0.0.1:8767/admin/actions.php
php -r '$m=json_decode(file_get_contents("/tmp/admin-test/uploads/lookbook.json"),true); echo $m["sections"]["badezimmer"][0]["caption"],"\n";'
```
Expected: `{"ok":true,"message":"Gespeichert."}` und danach `Fugenlose Dusche`

**Sortierung** (zwei Fotos hochladen, dann tauschen):
```bash
IDS=$(php -r '$m=json_decode(file_get_contents("/tmp/admin-test/uploads/lookbook.json"),true); $i=array_column($m["sections"]["badezimmer"],"id"); echo $i[1],",",$i[0];')
curl -s -b /tmp/admin-test/ck -d "csrf=$CSRF&ajax=1&action=sort&section=badezimmer&order=$IDS" http://127.0.0.1:8767/admin/actions.php
php -r '$m=json_decode(file_get_contents("/tmp/admin-test/uploads/lookbook.json"),true); echo implode(",",array_column($m["sections"]["badezimmer"],"id")),"\n";'
```
Expected: `{"ok":true,...}` und die Reihenfolge entspricht `$IDS`

**Löschen — Upload-Datei verschwindet auch von der Platte:**
```bash
DATEI=$(php -r '$m=json_decode(file_get_contents("/tmp/admin-test/uploads/lookbook.json"),true); echo $m["sections"]["badezimmer"][0]["src"];')
ID=$(php -r '$m=json_decode(file_get_contents("/tmp/admin-test/uploads/lookbook.json"),true); echo $m["sections"]["badezimmer"][0]["id"];')
curl -s -b /tmp/admin-test/ck -d "csrf=$CSRF&ajax=1&action=delete&id=$ID" http://127.0.0.1:8767/admin/actions.php
ls /tmp/admin-test/uploads/lookbook/badezimmer/
```
Expected: `{"ok":true,"message":"Bild gelöscht."}` und die zu `$DATEI` gehörende Datei ist weg

**Löschen eines Bestandsbildes lässt die Datei in Ruhe:**
```bash
cp build-output/uploads/lookbook.json /tmp/admin-test/uploads/lookbook.json
curl -s -b /tmp/admin-test/ck -d "csrf=$CSRF&ajax=1&action=delete&id=bad01" http://127.0.0.1:8767/admin/actions.php
php -r '$m=json_decode(file_get_contents("/tmp/admin-test/uploads/lookbook.json"),true); echo count($m["sections"]["badezimmer"]),"\n";'
```
Expected: `{"ok":true,...}` und `9` — der Eintrag ist raus, die Datei unter `/images/` bleibt unangetastet (sie liegt außerhalb von `uploads/` und wird von der `realpath`-Prüfung geschützt)

**Ohne Anmeldung kein Zugriff:**
```bash
curl -s -o /dev/null -w "%{http_code}\n" -d "action=delete&id=bad02" http://127.0.0.1:8767/admin/actions.php
```
Expected: `302` (Weiterleitung zur Anmeldung) — **kein** `200`

Aufräumen: `kill %1` und `rm -rf /tmp/admin-test`

- [ ] **Step 7: Verify the admin in a browser**

`/admin/` im Browser öffnen (lokaler PHP-Server oder Server nach Deploy):

1. Anmelden, drei Fotos in eine Kategorie hochladen.
2. Bildunterschrift eintippen, Feld verlassen → Statusleiste „Gespeichert.".
3. Eine Kachel an eine andere Position ziehen → „Reihenfolge gespeichert.". Seite neu laden — die Reihenfolge hält.
4. Ein Foto löschen, Rückfrage bestätigen → Kachel verschwindet.
5. Auf `/lookbook` prüfen: Reihenfolge, Bildunterschriften und Löschung sind binnen einer Minute sichtbar.

- [ ] **Step 8: Commit**

```bash
git add -- public/admin/actions.php public/admin/index.php public/admin/admin.js public/admin/admin.css
git commit -m "feat: Fotos im Admin betiteln, sortieren und loeschen"
```

---

## Task 13: Inbetriebnahme und Abnahme

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: alles Vorherige
- Produces: nichts

- [ ] **Step 1: Document the deployment rule and the setup**

An `README.md` anhängen:

````markdown
## Lookbook-Verwaltung (`/admin/`)

Der Kunde pflegt die Lookbook-Fotos selbst — ohne Build und ohne Deploy.

### Die eine Regel, die niemand brechen darf

```
<docroot>/uploads/     ← beim Deploy NIEMALS löschen oder überschreiben
```

Hier liegen alle vom Kunden hochgeladenen Fotos **und** `lookbook.json` mit
Reihenfolge und Bildunterschriften. Das Verzeichnis ist bewusst nicht Teil von
`dist/` und existiert nicht im Repo. Ein „Webroot leeren und neu hochladen"
vernichtet die gesamte Pflegearbeit des Kunden.

Beim Deploy werden ausschließlich die Inhalte von `dist/` ersetzt:
`index.html`, `assets/`, `api/`, `admin/`, `images/`.

### Ersteinrichtung (einmalig)

1. **Manifest erzeugen und hochladen**

   ```bash
   npm run lookbook:manifest
   ```

   Ergebnis: `build-output/uploads/lookbook.json`. Diese Datei per FTP nach
   `<docroot>/uploads/lookbook.json` legen. Sie enthält die 45 Bestandsbilder.

2. **Admin-Passwort setzen**

   Hash erzeugen:

   ```bash
   php -r "echo password_hash('DAS-GEWUENSCHTE-PASSWORT', PASSWORD_DEFAULT), PHP_EOL;"
   ```

   Den ausgegebenen Hash (beginnt mit `$2y$`) in `<docroot>/api/config.php`
   unter `ADMIN_PW_HASH` eintragen. Das Klartext-Passwort steht nirgends auf dem
   Server; es wird dem Kunden über einen sicheren Kanal übergeben.

3. **Schreibrechte prüfen**

   Der Webserver-Benutzer muss in `<docroot>/uploads/` schreiben dürfen (0755
   für Verzeichnisse genügt bei üblicher Hostinger-Konfiguration). Beim ersten
   Aufruf von `/admin/` legt PHP `uploads/.htaccess` und `uploads/.private/`
   selbst an — beides schottet hochgeladene Dateien gegen Ausführung ab.

4. **Funktion prüfen**

   `https://stonetec-bocholt.de/admin/` aufrufen, anmelden, ein Testfoto
   hochladen, auf `/lookbook` kontrollieren, Testfoto wieder löschen.

### Was der Kunde kann

Fotos hochladen, Bildunterschriften schreiben, Reihenfolge per Ziehen ändern,
Fotos löschen. Kategorien und deren Einleitungstexte liegen bewusst im Code
(`src/lib/lookbookData.js`) — sie ändert der Entwickler.

### Merkzettel

Besucher merken Fotos per Herz. Die Auswahl liegt ausschließlich im
`localStorage` des Besuchers, wird über einen URL-Parameter geteilt
(`?auswahl=…`, kein Serverspeicher) und geht beim Absenden der Anfrage als
Linkliste im Hero-Kommentar mit. Der Cookie-Banner braucht dafür keine
Anpassung.
````

- [ ] **Step 2: Run the full check**

Run: `npm run lint`
Expected: keine Fehler

Run: `npm test`
Expected: alle Tests grün

Run: `npm run build`
Expected: `✓ built in …`

Run: `ls dist/admin dist/api`
Expected: `dist/admin` enthält `index.php`, `auth.php`, `actions.php`, `imaging.php`, `admin.js`, `admin.css`; `dist/api` enthält `lead.php`, `lookbook.php`, `lookbook_store.php`, `config.example.php`

Run: `test -e dist/uploads && echo "FEHLER: uploads im Build" || echo "OK: kein uploads im Build"`
Expected: `OK: kein uploads im Build`

- [ ] **Step 3: Deploy and set up**

`dist/` auf den Server laden — **ohne** `uploads/` anzutasten. Danach die
Ersteinrichtung aus Step 1 durchführen (Manifest hochladen, Passwort-Hash
eintragen).

- [ ] **Step 4: Verify the six success criteria from the spec**

Jedes Kriterium einzeln abhaken und das Ergebnis notieren:

1. **Pflege ohne Entwickler** — Handyfoto über `/admin/` hochladen, danach
   `/lookbook` neu laden. Das Foto ist binnen einer Minute sichtbar.
2. **Deploy löscht nichts** — `npm run build` und `dist/` erneut hochladen.
   Anschließend `/lookbook` prüfen: das in Punkt 1 hochgeladene Foto und alle
   Bildunterschriften sind noch da.
3. **Bildgröße und Datenschutz** —
   ```bash
   curl -sI https://stonetec-bocholt.de/uploads/lookbook/<kategorie>/<datei>.webp | grep -i content-length
   ```
   Erwartung: unter 400000. Datei herunterladen und prüfen:
   ```bash
   php -r 'var_dump(@exif_read_data("<datei>.webp"));'
   ```
   Erwartung: `false` oder keine GPS-Felder.
4. **Geteilte Links halten** — Auswahl teilen, Link in einem anderen Browser
   oder Privatfenster öffnen. Erwartung: identische Auswahl.
5. **Anfrage mit Merkzettel** — zwei Bilder merken, Anfrage absenden. In Hero
   unter Projekte → neue Anfragen: Kommentar enthält den Merkzettel-Block mit
   funktionierenden Links. In GA4 Echtzeit: `generate_lead` ist eingegangen.
6. **Ausfallsicherheit** — auf dem Server `uploads/lookbook.json` kurzzeitig
   umbenennen, `/lookbook` neu laden. Erwartung: die Seite zeigt weiterhin die
   45 Bestandsbilder. Danach zurückbenennen.

- [ ] **Step 5: Commit**

```bash
git add -- README.md
git commit -m "docs: Einrichtung und Deploy-Regel fuer die Lookbook-Verwaltung"
```

---

## Abnahme

Fertig, wenn alle sechs Kriterien aus Step 4 der Task 13 bestätigt sind und der
Kunde einmal eigenständig — ohne Anleitung am Telefon — ein Foto hochgeladen,
betitelt und wieder gelöscht hat.
