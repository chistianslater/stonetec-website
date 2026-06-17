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
