<?php
// Liefert das Lookbook-Manifest an das Frontend.
// Antwortet immer mit HTTP 200 und gültigem JSON — fehlt das Manifest, kommen
// leere Kategorien, und das Frontend nutzt seine eingebauten Bestandsdaten.

declare(strict_types=1);

require __DIR__ . '/lookbook_store.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=60');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

echo json_encode(lookbook_read(), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
