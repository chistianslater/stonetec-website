# Anfrageformular → Hero CRM (Lead-API)

**Datum:** 2026-06-16 · **Status:** Konzept abgestimmt, Implementierung offen

## Ziel
Das Anfrageformular der stonetec-Website speist Anfragen direkt in das Hero-CRM ein
(Hero Lead-API), wo sie als **neue Anfrage** unter „Projekte" erscheinen. Das Formular
wird zu einem mehrstufigen Wizard umgebaut, der sich **leicht und hochwertig** anfühlt.

## Design-Leitmotiv (verbindlich)
„Leicht & hochwertig." Konkret: ein Thema pro Schritt, viel Weißraum, klare Typo
(bestehende Sora/DM-Schriften), weiche Übergänge via framer-motion (bereits installiert),
ein Klick statt Tippen wo möglich, kein überladenes Formular. Kompositionsfreundliche
Animationen (transform/opacity), `prefers-reduced-motion` respektieren.

## Wizard-Schritte
1. **Was ist geplant?** — Neubau / Sanierung / Reparatur (große Kacheln, 1 Klick → auto-advance)
2. **Welcher Bereich?** — Bad / Küche / Wohnbereich / Außen & Terrasse / Gewerbe / Sonstiges (Kacheln)
3. **Ort des Bauvorhabens** — PLZ (Pflicht) + Ort
4. **Projekt & Bilder** — optionales Freitextfeld + optionaler Bild-Upload (bis 5 Bilder; jpg/png/webp/heic; max ~5 MB/Bild)
5. **Wann passt's dir?** — Wochentage als Mehrfach-Chips (Mo–Sa) + Vormittags/Nachmittags
6. **Kontaktdaten & Absenden** — Vorname, Nachname, E-Mail, Telefon + Datenschutz-Häkchen → Absenden

Fortschrittsanzeige „Schritt X von 6". Reihenfolge bewusst: niedrigschwellige Projektfragen
zuerst, persönliche Kontaktdaten zuletzt (höhere Abschlussquote).

## Feld-Mapping (Hero Lead-API)
Endpoint: `POST https://login.hero-software.de/api/v1/Projects/create`, Auth `Bearer <HERO_API_KEY>`.

| Formular | Hero-Feld |
|---|---|
| Vorname / Nachname | `customer.first_name` / `customer.last_name` |
| E-Mail | `customer.email` *(Pflicht)* |
| Telefon | `customer.phone_mobile` |
| PLZ / Ort | `address.zipcode` *(Pflicht)* / `address.city` |
| Art + Bereich + Beschreibung + Terminwunsch | `project_match.comment` (formatierter Klartext) |
| Bilder | `images[]` |
| fix | `project_match.status_code: 201` (neue Anfrage), `measure: "PRJ"`, `project.source: "stonetec Website – Kontaktformular"`, `inform_partner: true` |

Beispiel `project_match.comment`:
```
Vorhaben: Sanierung · Bereich: Badezimmer
Erreichbarkeit: Mo, Di, Do – vormittags
Nachricht: "Gäste-WC komplett neu, ca. 6 m²."
```

## Architektur
- **`server.js` (Express)** = Startdatei der Hostinger Node.js Web App.
  - Liefert das gebaute `dist/` aus (statisch + SPA-Fallback, ersetzt vercel.json-Rolle).
  - `POST /api/lead`: validiert Eingaben serverseitig, mappt auf Hero, hängt `HERO_API_KEY`
    (ENV) an, ruft Hero server-zu-server auf, gibt strukturierte Erfolgs-/Fehlerantwort zurück.
  - Hört auf `process.env.PORT`.
- **Kontakt.jsx** → Wizard-Komponente(n); echter `fetch('/api/lead')` statt Simulation;
  Lade-/Erfolgs-/Fehlerzustände.
- Key niemals im Client/Repo. Browser ruft nur eigene Domain → kein Key-Leak, kein CORS.

## Sicherheit / Robustheit
- Serverseitige Validierung (E-Mail, PLZ Pflicht; Bildanzahl/-größe/-typ).
- Honeypot-Feld gegen Bots; einfache Rate-Begrenzung am Endpoint.
- Fehler nutzerfreundlich anzeigen, Details serverseitig loggen (keine Key-Leaks in Logs).

## Offen / beim Bauen zu verifizieren
- Genaues Hero-Bildformat (`images[]`): Base64-Data-URI vs. Upload. Fallback: Bilder an
  Benachrichtigungs-E-Mail hängen, falls Hero das Inline-Format ablehnt.
- Test mit echter Test-Anfrage gegen das Kunden-Hero (status 201 sichtbar?).

## hPanel-Setup (Kunde/Deploy)
Startdatei = `server.js`, Node-Version setzen, ENV-Variable `HERO_API_KEY` hinterlegen.
