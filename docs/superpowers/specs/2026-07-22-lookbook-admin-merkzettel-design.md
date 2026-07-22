# Lookbook: Selbstverwaltung durch den Kunden + Merkzettel

**Datum:** 2026-07-22 · **Status:** Konzept abgestimmt, Implementierung offen

## Ziel

Zwei zusammenhängende Fähigkeiten für das Lookbook:

1. **Selbstverwaltung** — Tim (StoneTec) lädt Fotos eigenständig hoch, betitelt und sortiert
   sie, ohne Entwickler, Build oder Deploy.
2. **Merkzettel** — Besucher markieren gefallende Bilder, schicken die Auswahl mit ihrer
   Anfrage mit oder teilen sie über die üblichen Kanäle (WhatsApp, E-Mail, Messenger).

## Ausgangslage

| Aspekt | Ist-Zustand |
|---|---|
| Lookbook-Daten | Hartkodiertes Array in `src/pages/Lookbook.jsx:20` — 5 Kategorien, ~45 Bilder |
| Bilddateien | `public/images/lookbook/<kategorie>/` |
| Hosting | Hostinger, **statisches `dist/` + PHP** (`public/api/lead.php`). Kein Node in Produktion; `server.js`/`server/` sind Altlast |
| Deploy | Lokaler `npm run build`, manuelles Hochladen von `dist/` |
| Anfrage | 6-Schritt-Wizard (`src/components/anfrage/AnfrageWizard.jsx`) → `POST /api/lead.php` → Hero-CRM + GA4 Measurement Protocol |

**Kritische Randbedingung:** Weil `dist/` beim Deploy vollständig ersetzt wird, dürfen von
Tim hochgeladene Dateien **niemals** innerhalb des Deploy-Baums liegen.

## Abgestimmte Entscheidungen

| Frage | Entscheidung | Begründung |
|---|---|---|
| Upload-Weg | Eigener PHP-Mini-Admin auf dem vorhandenen Hosting | Keine Fremddienste, keine laufenden Kosten, Bildoptimierung serverseitig erzwingbar |
| Admin-Umfang | **Nur Fotos** (hochladen, betiteln, sortieren, löschen) | Kategorien und deren Texte bleiben im Code — Tim kann die Seitenstruktur nicht verwildern lassen |
| Auswahl → Anfrage | In den bestehenden 6-Schritt-Wizard | Ein Lead-Weg, eine Conversion, keine Doppelpflege |
| Teilen | Auswahl in der URL, **kein Serverspeicher** | Keine Datenhaltung, keine Löschfristen, keine Anpassung der Datenschutzerklärung |

---

# Teil 1 — Datenhaltung & Admin

## Verzeichnisstruktur auf dem Server

| Pfad | Inhalt | Vom Deploy überschrieben |
|---|---|---|
| `/images/lookbook/…` | Die 45 Bestandsfotos (Teil des Repos) | ja |
| `/uploads/lookbook/<kategorie>/…` | Alles von Tim Hochgeladene | **nein** |
| `/uploads/lookbook.json` | Manifest: Bildliste, Reihenfolge, Bildunterschriften | **nein** |
| `/api/lookbook.php` | Liefert das Manifest als JSON aus | ja (Code) |
| `/admin/` | Admin-Oberfläche (PHP) | ja (Code) |

`/uploads/` liegt als Geschwister von `dist/`-Inhalten im Webroot und wird beim Deploy nie
angefasst. **Diese Regel gehört verbindlich in die README** — ein „Webroot leeren und neu
hochladen" würde Tims Fotos vernichten.

## Manifest-Format (`/uploads/lookbook.json`)

```json
{
  "version": 1,
  "sections": {
    "badezimmer": [
      { "id": "b3f7", "src": "/images/lookbook/badezimmer/stonetec-lookbook-badezimmer-1.jpg", "caption": "Fugenlose Dusche in Sichtbeton-Optik" },
      { "id": "b8k2", "src": "/uploads/lookbook/badezimmer/a7f39c21.webp", "caption": "Waschtisch aus einem Stück" }
    ],
    "wohnraum": [],
    "terrasse": [],
    "manufaktur": [],
    "details": []
  }
}
```

- Die **Reihenfolge im Array ist die Anzeigereihenfolge** — kein separates `order`-Feld.
- `id` ist eine kurze, zufällige, **dauerhaft stabile** Kennung (4 Zeichen, `[a-z0-9]`,
  kollisionsgeprüft über alle Kategorien). Sie wird beim Anlegen vergeben und **nie neu
  vergeben**, auch nicht nach dem Löschen eines Bildes — sonst würden geteilte Links auf
  falsche Bilder zeigen.
- `src` ist ein absoluter Pfad. Bestands- und Upload-Bilder stehen gleichberechtigt
  nebeneinander; die Herkunft ist am Pfad erkennbar.
- Kategorie-Schlüssel sind fest: `badezimmer`, `wohnraum`, `terrasse`, `manufaktur`, `details`.

### Einmalige Migration

Ein Script erzeugt aus dem heutigen Array in `Lookbook.jsx` das initiale `lookbook.json`.
Die Bilddateien **bleiben liegen**, es wandern nur ihre Einträge ins Manifest. Damit kann
Tim Bestandsbilder ab Tag eins sortieren, betiteln und aussortieren, ohne dass 45 Dateien
verschoben werden.

Das Feld `specs` („Meisterhafte Verlegung", heute bei jedem Bild identisch) entfällt als
Bilddatum. Die kleine Versalzeile in Kachel und Großansicht zeigt stattdessen den fest im
Code hinterlegten Kategorienamen.

## Auslieferung: `GET /api/lookbook.php`

- Liest `/uploads/lookbook.json`, gibt es als JSON zurück.
- `Cache-Control: public, max-age=60` — Tims Änderungen sind binnen einer Minute sichtbar.
- Fehlt die Datei oder ist sie unlesbar: HTTP 200 mit leeren Sektionen. Das Frontend
  entscheidet dann über den Fallback.

## Frontend-Anbindung

`src/lib/lookbookData.js`:
- `FALLBACK_SECTIONS` — die heutigen Kategorie-Metadaten (`id`, `title`, `subtitle`,
  `description`) **inklusive** der heutigen Bildlisten.
- `loadLookbook()` — holt `/api/lookbook.php`, mischt die Bildlisten in die
  Kategorie-Metadaten. Bei Fehler oder leerem Ergebnis wird `FALLBACK_SECTIONS`
  unverändert zurückgegeben. **Die Seite ist nie leer.**

`src/pages/Lookbook.jsx` (heute 502 Zeilen) wird aufgeteilt:

| Datei | Verantwortung |
|---|---|
| `src/pages/Lookbook.jsx` | Seitengerüst, Kategorie-Tabs, Datenladung (~130 Zeilen) |
| `src/components/lookbook/ImageCard.jsx` | Bildkachel inkl. Merken-Herz |
| `src/components/lookbook/Lightbox.jsx` | Großansicht inkl. Merken-Herz |
| `src/lib/lookbookData.js` | Laden, Fallback, Kategorie-Metadaten |

Während des Ladens zeigt das Raster Platzhalterkacheln in der Höhe der späteren Bilder
(`aspect-[4/5]`) — kein Layout-Sprung, CLS bleibt bei 0.

## Admin unter `/admin/`

### Authentifizierung

- Ein einziges Passwort für Tim. Ablage als **bcrypt-Hash** (`password_hash`) in der
  bereits vorhandenen, gitignorierten `public/api/config.php` (Schlüssel `ADMIN_PW_HASH`)
  oder als Umgebungsvariable — dasselbe Muster wie `HERO_API_KEY`.
- Session-Cookie: `httponly`, `secure`, `samesite=Strict`, Sitzungsdauer 8 Stunden.
- Login-Drosselung: nach 5 Fehlversuchen aus derselben IP 15 Minuten Sperre
  (dateibasierter Zähler unter `/uploads/.private/throttle/`). `/uploads/.private/` wird
  per eigener `.htaccess` (`Require all denied`) vollständig vom Web abgeschottet — im
  Gegensatz zu `lookbook.json` und den Bildern, die öffentlich lesbar sein müssen.
- Keine Benutzerverwaltung, keine Registrierung, keine Passwort-vergessen-Funktion.

### Funktionen

| Funktion | Verhalten |
|---|---|
| Hochladen | Mehrfachauswahl und Drag&Drop, Zielkategorie per Auswahlfeld |
| Betiteln | Bildunterschrift direkt in der Liste eintippbar, Speichern beim Verlassen des Feldes |
| Sortieren | Drag&Drop innerhalb der Kategorie |
| Löschen | Mit Rückfrage; entfernt Manifest-Eintrag **und** Datei (nur bei Dateien unter `/uploads/`; Bestandsbilder unter `/images/` werden ausschließlich aus dem Manifest entfernt) |

### Bildverarbeitung beim Upload

Verbindliche Kette, serverseitig:

1. Dateityp am **Inhalt** prüfen (`finfo` + `getimagesize`), nicht an der Endung.
   Erlaubt: JPEG, PNG, WebP. Maximal 25 MB Rohdatei.
2. EXIF-Ausrichtung auswerten und Bild entsprechend drehen.
3. Längste Kante auf **2000 px** begrenzen (kleinere Bilder nicht hochskalieren).
4. Als **WebP mit Qualität 82** speichern. Alle relevanten Browser unterstützen WebP.
5. Beim Neu-Encodieren werden sämtliche EXIF-Daten **inklusive GPS-Koordinaten**
   verworfen — Tims Handyfotos verraten keine Privatadressen.
6. Dateiname: zufällige 8 Hex-Zeichen + `.webp`. Der Originalname wird nicht übernommen.

Ergebnis: aus einem 8-MB-Handyfoto werden rund 250 KB.

### Absicherung

- `/uploads/.htaccess`: `php_flag engine off` und Verweigerung der Ausführung von
  `.php`/`.phtml`/`.cgi` — eine hochgeladene Datei kann nie ausgeführt werden.
- CSRF-Token in jedem Formular, serverseitig gegen die Session geprüft.
- Alle schreibenden Aktionen nur per POST.
- `lookbook.json` wird **atomar** geschrieben: in temporäre Datei, dann `rename()`, mit
  `flock()` gegen gleichzeitige Zugriffe. Ein abgebrochener Schreibvorgang kann das
  Manifest nicht zerstören.
- Vor jedem Schreiben wird die Vorgängerversion als `lookbook.json.bak` gesichert.

### Vor der Umsetzung zu prüfen

1. **GD/Imagick mit WebP-Unterstützung** auf dem Hostinger-Paket vorhanden? Falls nicht,
   Rückfallebene: JPEG bei Qualität 85 statt WebP — der Rest des Designs bleibt unverändert.
2. **HEIC-Uploads vom iPhone**: iOS wandelt beim Web-Upload in der Regel selbst nach JPEG
   um. Falls doch HEIC ankommt, wird es abgelehnt mit der Meldung „Bitte in den
   iPhone-Einstellungen unter Kamera → Formate ‚Maximale Kompatibilität' wählen".

---

# Teil 2 — Merkzettel, Teilen, Anfrage

## Sammeln

- Herz-Symbol auf jeder Bildkachel (oben rechts, dauerhaft sichtbar auf Touch-Geräten,
  bei Hover auf Desktop) und in der Großansicht.
- Kein Konto, keine Anmeldung.
- Speicherung im `localStorage` unter `stonetec:merkzettel` als Liste von Bild-IDs.
  Die Auswahl überlebt das Neuladen der Seite und den nächsten Besuch.
- Obergrenze **40 Bilder**; darüber Hinweis „Deine Auswahl ist voll".

Zustandsverwaltung: `src/lib/merkzettel.js` als kleiner Store mit
`useSyncExternalStore`-Anbindung (`src/hooks/useMerkzettel.js`). Damit bleiben mehrere
geöffnete Tabs synchron (`storage`-Event) und es entsteht kein Context-Re-Render-Problem.

## Merkzettel-Leiste

- Schwebende Leiste am unteren Rand, sichtbar sobald mindestens ein Bild gemerkt ist:
  **„Meine Auswahl (3)"**.
- Klick öffnet ein Panel mit den Miniaturen, jede einzeln entfernbar, plus „Alle löschen".
- Zwei Aktionen: **Auswahl anfragen** und **Auswahl teilen**.

## Teilen

Die Auswahl steckt vollständig in der URL:

```
https://stonetec-bocholt.de/lookbook?auswahl=b3f7,t1a9,d7c4
```

- **Mobil**: natives Teilen-Menü über die Web Share API (`navigator.share`) — dadurch
  erscheinen automatisch WhatsApp, Mail, iMessage, Signal, AirDrop und alles weitere
  Installierte.
- **Desktop / ohne Web Share API**: „Link kopieren" (`navigator.clipboard`) plus direkte
  Schaltflächen für WhatsApp (`https://wa.me/?text=…`) und E-Mail (`mailto:`).

**Öffnen eines geteilten Links:** Die IDs aus `?auswahl=` werden in den Merkzettel
übernommen (bestehende Auswahl wird ersetzt, nicht ergänzt — der Empfänger soll genau das
sehen, was geteilt wurde). Hinweisleiste: „Geteilte Auswahl — 7 Bilder". Unbekannte IDs
werden stillschweigend übersprungen, mit Zusatz „1 Bild ist nicht mehr verfügbar", falls
mindestens eine ID fehlschlägt. Anschließend wird `?auswahl=` per `history.replaceState`
aus der Adresszeile entfernt.

Grenze: 40 IDs à 4 Zeichen plus Trennkomma ergeben rund 200 Zeichen Parameter, mit
Basis-URL etwa 240 Zeichen — für WhatsApp, E-Mail und Messenger unkritisch.

**Bewusst nicht gewählt:** serverseitige Kurzlinks (`/s/A7K2M`). Hübscher, aber sie
erfordern Serverspeicher, eine Aufbewahrungs- und Löschregelung sowie eine Ergänzung der
Datenschutzerklärung. Der Nutzen rechtfertigt den Aufwand hier nicht.

## In die Anfrage

1. „Auswahl anfragen" navigiert auf `/kontakt`. Die Auswahl wird nicht über die URL
   übergeben, sondern direkt aus dem Merkzettel-Store gelesen — der Wizard und die
   Lookbook-Seite teilen denselben Store.
2. Über dem Wizard erscheint eine Zeile mit den Miniaturen:
   *„7 Bilder aus deiner Auswahl werden mitgeschickt."* Mit Möglichkeit, einzelne
   Bilder vor dem Absenden zu entfernen.
3. `submitLead()` schickt zusätzlich `lookbookPicks: ["b3f7", "t1a9", …]` an
   `/api/lead.php`.

### Serverseitig in `lead.php`

- IDs gegen `/uploads/lookbook.json` auflösen, unbekannte verwerfen.
- Auf **maximal 20** Einträge kappen, damit der Hero-Kommentar nicht überläuft.
- Als eigener Block an `project_match.comment` anhängen:

```
Merkzettel (7 Bilder):
https://stonetec-bocholt.de/uploads/lookbook/badezimmer/a7f39c21.webp
https://stonetec-bocholt.de/images/lookbook/terrasse/stonetec-lookbook-terrasse-1.jpg
…
```

**Bewusst Links statt Dateianhänge:** Laut README ist das Bildformat der Hero-API nicht
öffentlich dokumentiert und Anhänge sind der fragilste Teil der Schnittstelle. Links
kommen garantiert an und sind mit einem Klick einsehbar.

**Der bestehende Lead-Weg bleibt unangetastet.** Es ändert sich ausschließlich der
Kommentartext. Validierung, Honeypot, Hero-Aufruf und die serverseitige
`generate_lead`-Conversion via GA4 Measurement Protocol laufen unverändert weiter.

## Tracking

Über die bestehende `track()`-Hilfsfunktion (`src/lib/track.js`), consent-gebunden wie
bisher:

| Event | Auslöser | Parameter |
|---|---|---|
| `add_to_wishlist` | Bild gemerkt | `item_id`, `item_category` |
| `remove_from_wishlist` | Bild entfernt | `item_id` |
| `share` | Auswahl geteilt | `method` (`native`/`copy`/`whatsapp`/`email`), `item_count` |
| `view_shared_selection` | Geteilter Link geöffnet | `item_count` |

Damit ist nach vier Wochen belegbar, ob das Feature genutzt wird.

## Datenschutz

Die Auswahl liegt ausschließlich im Browser des Besuchers und wird nur übertragen, wenn er
selbst die Anfrage absendet — dort willigt er ohnehin ein. Der `localStorage`-Zugriff ist
einwilligungsfrei nach § 25 Abs. 2 Nr. 2 TDDDG, weil er genau die Funktion erfüllt, die
der Nutzer aktiv angefordert hat. **Der Cookie-Banner braucht keine Anpassung.**

---

# Nicht im Umfang (bewusst)

- Kategorien anlegen, umbenennen, löschen oder sortieren
- Bearbeiten der Kategorie-Einleitungstexte
- Merkzettel auf anderen Seiten als dem Lookbook (z. B. Projekte)
- Serverseitig gespeicherte Kurzlinks
- Mehrbenutzerverwaltung im Admin
- Bilder als Dateianhang an das Hero-CRM

# Erfolgskriterien

1. Tim lädt ein Handyfoto hoch und sieht es binnen einer Minute im Lookbook — ohne
   Entwickler, ohne Build, ohne Deploy.
2. Ein Deploy der Website löscht keine hochgeladenen Fotos und keine Bildunterschriften.
3. Ein 8-MB-Handyfoto liegt nach dem Upload unter 400 KB und enthält keine GPS-Daten.
4. Ein geteilter Link öffnet beim Empfänger exakt dieselbe Auswahl, auch Tage später.
5. Eine Anfrage mit Merkzettel erscheint in Hero mit klickbaren Bild-Links, und die
   `generate_lead`-Conversion feuert unverändert.
6. Fällt `/api/lookbook.php` aus, zeigt das Lookbook weiterhin Bilder.
