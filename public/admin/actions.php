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

        // $manifest waechst mit — dadurch kann lookbook_new_id() denselben
        // Zufallswert innerhalb eines Uploads nicht zweimal vergeben.
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
