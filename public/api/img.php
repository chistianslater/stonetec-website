<?php
// Bild-Passthrough für hochgeladene Lookbook-Fotos.
//
// Die Uploads liegen ausserhalb von public_html (deploy-fest) und sind deshalb
// nicht direkt per URL erreichbar. Dieses Skript liefert eine Datei aus
// <home>/lookbook-uploads/lookbook/<kategorie>/<datei> aus. Bestandsbilder unter
// /images/lookbook/... laufen NICHT hierüber, sie werden direkt ausgeliefert.

declare(strict_types=1);

require __DIR__ . '/lookbook_store.php';

$p = (string) ($_GET['p'] ?? '');
// Streng: <kategorie>/<datei>.<endung>, keine Traversale, keine Unterordner.
// Upload-Dateinamen sind bin2hex(random_bytes(4)) = 8 Hex-Zeichen + Endung.
if (!preg_match('#^[a-z0-9]+/[a-f0-9]{8,}\.(webp|jpe?g|png)$#', $p)) {
    http_response_code(404);
    exit;
}

$file = lookbook_dir() . '/lookbook/' . $p;
$real = realpath($file);
$root = realpath(lookbook_dir() . '/lookbook');
// Doppelter Boden: der aufgelöste Pfad muss echt unterhalb des Upload-Wurzel-
// verzeichnisses liegen — sonst 404, egal was im $p stand.
if ($real === false || $root === false || !str_starts_with($real, $root . DIRECTORY_SEPARATOR)) {
    http_response_code(404);
    exit;
}

$mime = match (strtolower(pathinfo($real, PATHINFO_EXTENSION))) {
    'webp'  => 'image/webp',
    'png'   => 'image/png',
    default => 'image/jpeg',
};

header('Content-Type: ' . $mime);
header('Cache-Control: public, max-age=31536000, immutable');
header('Content-Length: ' . filesize($real));
readfile($real);
