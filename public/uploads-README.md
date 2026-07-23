# Wo die hochgeladenen Fotos liegen

Die vom Kunden hochgeladenen Fotos und das Manifest `lookbook.json` liegen
**ausserhalb von `public_html`**, als Geschwister des Webroots:

```
<home>/                         (z. B. /home/uXXXXXXXX/domains/stonetec-bocholt.de)
  public_html/                  ← der Webroot, wird bei JEDEM Deploy neu gebaut
    index.html                  ← aus dist/, bei jedem Deploy ersetzt
    api/                        ← aus dist/, bei jedem Deploy ersetzt
    admin/                      ← aus dist/, bei jedem Deploy ersetzt
    images/                     ← aus dist/, bei jedem Deploy ersetzt (Bestandsbilder)
  lookbook-uploads/             ← NIEMALS anfassen, liegt ausserhalb public_html
    lookbook.json
    lookbook/<kategorie>/*.webp
    .private/
```

## Warum ausserhalb?

Hostinger baut `public_html` bei **jedem** Deploy komplett neu und löscht dabei
alles, was nicht aus dem Repo (`dist/`) kommt. Ein Upload-Ordner **im** Webroot
(früher `<docroot>/uploads/`) überlebt das **nicht** — genau das war der Bug.
Ein Ordner ausserhalb `public_html` wird vom Deploy nicht angefasst und überlebt
jedes Website-Update.

Die PHP-Dateien finden das Verzeichnis über `dirname(__DIR__, 2) . '/lookbook-uploads'`
(siehe `api/lookbook_store.php`, Funktion `lookbook_dir()`) — sowohl aus `api/`
als auch aus `admin/` heraus genau zwei Ebenen höher (`public_html/api` → `<home>`).

## Auslieferung der Bilder

Weil `lookbook-uploads/` ausserhalb des Webroots liegt, sind die Bilder **nicht**
direkt per URL erreichbar. Sie werden über das kleine Passthrough-Skript
`api/img.php` ausgeliefert; der Manifest-`src` eines hochgeladenen Bildes lautet
`/api/img.php?p=<kategorie>/<datei>.webp`.

Bestandsbilder (`/images/lookbook/...`) liegen weiter im Repo und werden direkt
ausgeliefert — nur **neu hochgeladene** Bilder laufen über den Passthrough.
