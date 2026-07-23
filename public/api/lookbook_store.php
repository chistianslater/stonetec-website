<?php
// Gemeinsame Funktionen für das Lookbook-Manifest.
//
// Das Manifest liegt bewusst AUSSERHALB von public_html, als Geschwister des
// Webroots unter <home>/lookbook-uploads/. Hostinger baut public_html bei jedem
// Deploy neu und löscht dabei alles Nicht-Repo — ein Ordner IM Webroot (früher
// <docroot>/uploads/) überlebt das NICHT. Ausserhalb von public_html fasst der
// Deploy nichts an, also überleben Manifest und hochgeladene Fotos jedes Update.
// Eingebunden von api/lookbook.php, api/img.php, api/lead.php und admin/.

declare(strict_types=1);

const LOOKBOOK_SECTIONS = ['badezimmer', 'wohnraum', 'terrasse', 'manufaktur', 'details'];
const LOOKBOOK_ID_LENGTH = 5;
const LOOKBOOK_ID_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

function lookbook_section_keys(): array
{
    return LOOKBOOK_SECTIONS;
}

/**
 * <home>/lookbook-uploads — deploy-fest, weil ausserhalb public_html.
 *
 * Von api/  (public_html/api)   → dirname(__DIR__, 2) = <home>.
 * Von admin/(public_html/admin) → dirname(__DIR__, 2) = <home>.
 * Beide liegen genau eine Ebene unter public_html, die Rechnung stimmt für beide.
 */
function lookbook_dir(): string
{
    return dirname(__DIR__, 2) . '/lookbook-uploads';
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
