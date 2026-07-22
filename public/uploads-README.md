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
