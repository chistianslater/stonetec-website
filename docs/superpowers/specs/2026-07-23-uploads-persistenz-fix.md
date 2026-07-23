# Fix: Lookbook-Uploads deploy-fest machen

**Datum:** 2026-07-23 · **Status:** ✅ erledigt — umgesetzt & Persistenz live bewiesen (origin/main = `f9ee8f7`)

> Umsetzung: `lookbook_dir()` → `<home>/lookbook-uploads`, Passthrough `api/img.php`,
> Upload/Delete-src auf Passthrough, 45 Bestandsbilder geseedet (Legacy-IDs erhalten).
> Persistenzbeweis: Foto hochgeladen → Deploy (public_html-Rebuild) → Foto überlebt
> (`img.php` 200, `lookbook.php` listet es). probe.php/seed.php/whoami.php entfernt.

> Anschluss an [2026-07-22-lookbook-admin-merkzettel-design.md](2026-07-22-lookbook-admin-merkzettel-design.md).

## Problem (auf dem Server bewiesen)

Hostinger baut `public_html` bei **jedem** Deploy neu. Alles, was nicht im Git-Repo liegt,
wird dabei gelöscht — also `public_html/uploads/` mit Tims Fotos **und** `lookbook.json`.

Beweis: leerer Commit `a2da178` gepusht → Deploy → `api/lookbook.php` liefert wieder leere
Kategorien, die zuvor hochgeladene `uploads/lookbook.json` ist weg. Hostinger bietet **keine**
Option, einen Ordner vom Deploy auszunehmen (vom Kunden bestätigt).

**Nicht betroffen und live funktionsfähig:** der gesamte besucherseitige Teil (Merkzettel
sammeln, teilen, mit der Anfrage ans Hero-CRM senden) sowie Admin-Login, Upload und
Verwaltung. **Einziger Defekt:** hochgeladene Fotos überleben keinen Deploy.

## Lösungsidee

`uploads/` aus `public_html` heraus in einen Ordner verlegen, den der Deploy nicht anfasst
(`<home>/lookbook-uploads/`, Geschwister von `public_html`). Weil dieser Ordner außerhalb
des Webroots liegt und damit **nicht** direkt per URL erreichbar ist, werden die Bilder über
ein kleines PHP-Passthrough-Skript ausgeliefert.

Bestandsbilder (`/images/lookbook/...`, im Repo) bleiben unverändert und werden weiter direkt
ausgeliefert — nur **neu hochgeladene** Bilder laufen über den Passthrough.

---

## SCHRITT 0 — Machbarkeit prüfen (entscheidet alles)

Kann PHP überhaupt außerhalb von `public_html` schreiben? (Manche Hoster sperren das per
`open_basedir`.) Test-Skript `public_html/api/probe.php` anlegen, im Browser aufrufen,
danach löschen:

```php
<?php
header('Content-Type: text/plain');
$home = dirname(__DIR__, 2);              // <home>  (public_html/api -> <home>)
$dir  = $home . '/lookbook-uploads';
$mk   = @mkdir($dir, 0755, true) || is_dir($dir);
$wr   = $mk && @file_put_contents($dir . '/t.txt', 'x') !== false;
echo "home:            $home\n";
echo "schreibbar:      " . ($wr ? 'JA' : 'NEIN') . "\n";
echo "open_basedir:    " . (ini_get('open_basedir') ?: '(keine Beschraenkung)') . "\n";
@unlink($dir . '/t.txt');
```

- **schreibbar: JA** → weiter mit Schritt 1.
- **schreibbar: NEIN** (`open_basedir` sperrt auf `public_html`) → dieser Weg geht nicht.
  Dann Alternativen abwägen (größerer Umbau, **vorher** mit dem Kunden klären):
  1. Externe Objektspeicherung (z. B. Bunny/S3) für die Uploads.
  2. Deploy-Verfahren wechseln (statt Git-Rebuild ein Verfahren, das `uploads/` erhält —
     z. B. Deploy nur von `dist/` per FTP, wie ursprünglich in der README beschrieben).
  3. Uploads in eine DB (unpraktisch für Bilder, nicht empfohlen).

---

## SCHRITT 1 — persistenten Pfad einführen

`public/api/lookbook_store.php`, Funktion `lookbook_dir()`:

```php
// vorher:
return dirname(__DIR__) . '/uploads';            // <home>/public_html/uploads (wird gewischt)
// nachher:
return dirname(__DIR__, 2) . '/lookbook-uploads'; // <home>/lookbook-uploads   (deploy-fest)
```

Damit wandern automatisch mit: `lookbook.json`, `.bak`, `.lock`, das Upload-Verzeichnis
`lookbook/<kat>/` und `.private/throttle/` — alle nutzen `lookbook_dir()`.

## SCHRITT 2 — Bild-Passthrough `public/api/img.php`

Liefert eine Datei aus `<home>/lookbook-uploads/lookbook/<kat>/<datei>` aus:

```php
<?php
declare(strict_types=1);
require __DIR__ . '/lookbook_store.php';

$p = (string) ($_GET['p'] ?? '');
// Streng: <kategorie>/<datei>.<endung>, keine Traversale.
if (!preg_match('#^[a-z0-9]+/[a-f0-9]{8,}\.(webp|jpe?g|png)$#', $p)) {
    http_response_code(404); exit;
}
$file = lookbook_dir() . '/lookbook/' . $p;
$real = realpath($file);
$root = realpath(lookbook_dir() . '/lookbook');
if ($real === false || $root === false || !str_starts_with($real, $root . DIRECTORY_SEPARATOR)) {
    http_response_code(404); exit;
}
$mime = match (strtolower(pathinfo($real, PATHINFO_EXTENSION))) {
    'webp' => 'image/webp', 'png' => 'image/png', default => 'image/jpeg',
};
header('Content-Type: ' . $mime);
header('Cache-Control: public, max-age=31536000, immutable');
header('Content-Length: ' . filesize($real));
readfile($real);
```

## SCHRITT 3 — Upload schreibt neuen `src`

`public/admin/actions.php`, Upload-Zweig: Zielverzeichnis bleibt
`lookbook_dir() . '/lookbook/<kat>/'` (liegt jetzt außerhalb Webroot). Der Manifest-`src`
wird **nicht mehr** `/uploads/lookbook/<kat>/<datei>`, sondern:

```php
'src' => '/api/img.php?p=' . $kategorie . '/' . $ergebnis['file'],
```

Löschen-Zweig: Bedingung `str_starts_with($treffer['src'], '/uploads/lookbook/')` ersetzen
durch Erkennung der Passthrough-URL (`/api/img.php?p=`), Dateipfad daraus rekonstruieren
(`$rel = substr($src, strlen('/api/img.php?p=')); $pfad = lookbook_dir().'/lookbook/'.$rel;`),
realpath-Schutz wie bisher.

## SCHRITT 4 — Bestandsbilder unverändert

Legacy-`src` bleibt `/images/lookbook/...` → direkt aus dem Repo ausgeliefert, deploy-fest.
Nur neu Hochgeladenes läuft über `img.php`. Frontend braucht **keine** Änderung (rendert
`<img src={image.src}>` unverändert). Hero-Links funktionieren (absolute URL auf `img.php`).

## SCHRITT 5 — Guards

`public/admin/auth.php` `admin_ensure_upload_guards()`: legt `lookbook_dir()` + `.private/`
jetzt außerhalb Webroot an (unverändert, folgt automatisch `lookbook_dir()`). Die
`.htaccess`-Ausführsperre ist dort unkritisch (nicht web-erreichbar), darf bleiben.

## SCHRITT 6 — Manifest platzieren

`lookbook.json` liegt künftig unter `<home>/lookbook-uploads/lookbook.json`. Einmal das
initiale Manifest (45 Bestandsbilder, alle `/images/...`) dorthin legen —
`npm run lookbook:manifest` erzeugt es, Zielpfad auf dem Server ist
`<home>/lookbook-uploads/lookbook.json`.

---

## Test → Deploy → Persistenzbeweis

1. **Lokal** (MAMP-PHP vorhanden, `/Applications/MAMP/bin/php/php8.3.14/bin/php`): mit
   `php -S` die Endpunkte prüfen — Upload schreibt außerhalb, `img.php` liefert das Bild,
   `lookbook.php` listet es.
2. Sauber branchen von `origin/main`: `git checkout -b fix/uploads-persistenz origin/main`.
   Änderungen committen. **Push macht der Nutzer im Terminal** (`git push`-Tool ist blockiert):
   `git push origin fix/uploads-persistenz:main`.
3. Nach Deploy: Foto im Admin hochladen → erscheint auf `/lookbook` (via `img.php`).
4. **Persistenzbeweis:** leeren Commit pushen → Deploy → prüfen, dass das Foto **noch da**
   ist (`curl https://stonetec-bocholt.de/api/lookbook.php` listet es weiter). Erst wenn das
   gilt, ist der Fix bestätigt.

## Kontext für die frische Session

- `origin/main` = `a2da178` — live, funktioniert für Besucher.
- Lokaler Git-Stand ist wieder aligned (`main` = `origin/main`).
- **Netzlaufwerk ist langsam:** keine Vollbaum-Git-Operationen (Checkout/Reset über alles
  läuft ins Timeout); gezielt einzelne Dateien anfassen. `git config core.fileMode false`
  ist gesetzt (unterdrückt 767 Dateirechte-Pseudoänderungen).
- **Admin-Login funktioniert:** Passwort `Fomwy2rn!`, Hash env-sicher als base64 in der
  Umgebungsvariable `ADMIN_PW_HASH_B64` (siehe `auth.php`, `admin_password_hash()`).
- Diagnose-/Testdateien auf dem Server (`whoami.php`, `probe.php`) nach Gebrauch löschen.
