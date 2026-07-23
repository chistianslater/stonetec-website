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

        // $manifest waechst mit — dadurch kann lookbook_new_id() denselben
        // Zufallswert innerhalb eines Uploads nicht zweimal vergeben.
        // Die Datei liegt jetzt ausserhalb public_html und ist nicht direkt per
        // URL erreichbar — der Manifest-src zeigt deshalb auf den Passthrough.
        $manifest['sections'][$kategorie][] = [
            'id'      => lookbook_new_id($manifest),
            'src'     => '/api/img.php?p=' . $kategorie . '/' . $ergebnis['file'],
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
    // Hochgeladene Bilder tragen den Passthrough-src /api/img.php?p=<kat>/<datei>.
    $praefix = '/api/img.php?p=';
    if (str_starts_with($treffer['src'], $praefix)) {
        $rel  = substr($treffer['src'], strlen($praefix));
        $pfad = lookbook_dir() . '/lookbook/' . $rel;
        $echt = realpath($pfad);
        // Wurzel bewusst eng auf .../lookbook: so kann ein manipuliertes Manifest
        // mit ../ nicht das Manifest selbst oder .private/ treffen.
        $wurzel = realpath(lookbook_dir() . '/lookbook');
        if ($echt !== false && $wurzel !== false && str_starts_with($echt, $wurzel . DIRECTORY_SEPARATOR)) {
            @unlink($echt);
        }
    }

    admin_finish(true, 'Bild gelöscht.');
}

admin_redirect('Unbekannte Aktion.');
