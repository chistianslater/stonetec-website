# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deployment (Hostinger Node.js Web App)

Die Seite läuft als **Node.js Web App** (Hostinger, Business-Plan+). Ein Express-Prozess
(`server.js`) liefert das gebaute `dist/` aus **und** stellt den Endpoint `POST /api/lead`
bereit, der Anfragen aus dem Kontaktformular an das Hero-CRM weiterleitet.

### Build & Start

```bash
npm install
npm run build      # erzeugt dist/, das der Server ausliefert
npm start          # startet server.js (hört auf process.env.PORT)
```

### Konfiguration im hPanel

- **Startdatei / Application startup file:** `server.js`
- **Node-Version:** 18 oder höher (für natives `fetch`)
- **Umgebungsvariablen:**
  - `HERO_API_KEY` — der Lead-API-Schlüssel von Hero (**Pflicht**). Wird ausschließlich
    serverseitig verwendet und darf **niemals** ins Repo committet werden.
  - `HERO_API_URL` — optional; Default ist der Live-Endpoint
    `https://login.hero-software.de/api/v1/Projects/create`.

Nach jeder Änderung der Umgebungsvariablen die App im hPanel **neu starten**.

### Hero-Lead-Anbindung

- Anfragen erscheinen in Hero unter **Projekte → neue Anfragen** (`status_code 201`).
- Pflichtfelder seitens Hero: E-Mail und PLZ.
- **Bilder:** Das Bildformat der Hero-API ist nicht öffentlich dokumentiert. Der Server
  sendet eine Anfrage automatisch **ohne Bilder** erneut, falls Hero die Bilder ablehnt —
  der Lead geht also nie verloren. Bevor Bilder zuverlässig in Hero ankommen, muss das
  exakte `images`-Format mit dem Hero-Support abgestimmt werden.

### Test der Anbindung

```bash
HERO_API_KEY="<key>" npm start
# dann auf der Kontaktseite eine Test-Anfrage abschicken und in Hero prüfen
```

## Lookbook-Verwaltung (`/admin/`)

Der Kunde pflegt die Lookbook-Fotos selbst — ohne Build und ohne Deploy.

### Die eine Regel, die niemand brechen darf

```
<docroot>/uploads/     ← beim Deploy NIEMALS löschen oder überschreiben
```

Hier liegen alle vom Kunden hochgeladenen Fotos **und** `lookbook.json` mit Reihenfolge
und Bildunterschriften. Das Verzeichnis ist bewusst nicht Teil von `dist/` und existiert
nicht im Repo. Ein „Webroot leeren und neu hochladen" vernichtet die gesamte Pflegearbeit
des Kunden.

Beim Deploy werden ausschließlich die Inhalte von `dist/` ersetzt: `index.html`,
`assets/`, `api/`, `admin/`, `images/`.

### Ersteinrichtung (einmalig)

1. **Manifest erzeugen und hochladen**

   ```bash
   npm run lookbook:manifest
   ```

   Ergebnis: `build-output/uploads/lookbook.json` mit den 45 Bestandsbildern. Diese Datei
   per FTP nach `<docroot>/uploads/lookbook.json` legen.

2. **Admin-Passwort setzen**

   Hash erzeugen:

   ```bash
   php -r "echo password_hash('DAS-GEWUENSCHTE-PASSWORT', PASSWORD_DEFAULT), PHP_EOL;"
   ```

   Den ausgegebenen Hash (beginnt mit `$2y$`) in `<docroot>/api/config.php` unter
   `ADMIN_PW_HASH` eintragen. Das Klartext-Passwort steht nirgends auf dem Server; es wird
   dem Kunden über einen sicheren Kanal übergeben.

3. **Schreibrechte prüfen**

   Der Webserver-Benutzer muss in `<docroot>/uploads/` schreiben dürfen. Beim ersten
   Aufruf von `/admin/` legt PHP `uploads/.htaccess` und `uploads/.private/` selbst an —
   beides schottet hochgeladene Dateien gegen Ausführung ab.

4. **Funktion prüfen**

   `https://stonetec-bocholt.de/admin/` aufrufen, anmelden, ein Testfoto hochladen, auf
   `/lookbook` kontrollieren, Testfoto wieder löschen.

### Was der Kunde kann

Fotos hochladen, Bildunterschriften schreiben, Reihenfolge per Ziehen ändern, Fotos
löschen. Kategorien und deren Einleitungstexte liegen bewusst im Code
(`src/lib/lookbookData.js`) — die ändert der Entwickler.

Beim Upload wird jedes Foto auf 2000 px längste Kante verkleinert, nach WebP gewandelt und
dabei **von allen EXIF-Daten inklusive GPS-Koordinaten befreit**. Aus einem 8-MB-Handyfoto
werden rund 250 KB.

### Voraussetzungen auf dem Server

- **PHP 8.1 oder neuer** (der Admin nutzt `never` als Rückgabetyp).
- **GD mit WebP-Unterstützung.** Fehlt WebP, speichert der Admin automatisch als JPG und
  weist im Kopf der Seite darauf hin. Fehlt GD ganz, sind Uploads nicht möglich.

### Merkzettel

Besucher merken Fotos per Herz. Die Auswahl liegt ausschließlich im `localStorage` des
Besuchers, wird über einen URL-Parameter geteilt (`?auswahl=…`, kein Serverspeicher) und
geht beim Absenden der Anfrage als Linkliste im Hero-Kommentar mit (maximal 20 Bilder).
Der Cookie-Banner braucht dafür keine Anpassung: Der Speicherzugriff erfüllt genau die vom
Nutzer angeforderte Funktion und ist nach § 25 Abs. 2 Nr. 2 TDDDG einwilligungsfrei.
