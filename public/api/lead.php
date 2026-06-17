<?php
// Lead-Proxy: nimmt die Formulardaten entgegen, validiert sie und leitet sie
// serverseitig an die Hero Lead-API weiter. Der API-Key bleibt serverseitig
// (ENV oder config.php) und taucht nie im ausgelieferten Frontend auf.

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Key: zuerst aus der Umgebung, sonst aus config.php (nicht im Repo).
$key = getenv('HERO_API_KEY');
if (!$key) {
    $cfg = @include __DIR__ . '/config.php';
    if (is_array($cfg) && !empty($cfg['HERO_API_KEY'])) {
        $key = $cfg['HERO_API_KEY'];
    }
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Ungültige Daten']);
    exit;
}

// Honeypot: stille Erfolgsantwort, nichts an Hero senden.
if (!empty($data['company'])) {
    echo json_encode(['status' => 'success']);
    exit;
}

$firstName = trim($data['firstName'] ?? '');
$lastName  = trim($data['lastName'] ?? '');
$email     = trim($data['email'] ?? '');
$zipcode   = trim($data['zipcode'] ?? '');
$privacy   = !empty($data['privacy']);

$errors = [];
if ($firstName === '') $errors['firstName'] = 'Vorname fehlt';
if ($lastName === '')  $errors['lastName']  = 'Nachname fehlt';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Gültige E-Mail erforderlich';
if (!preg_match('/^\d{4,5}$/', $zipcode)) $errors['zipcode'] = 'Gültige PLZ erforderlich';
if (!$privacy) $errors['privacy'] = 'Zustimmung erforderlich';
if ($errors) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'errors' => $errors]);
    exit;
}

if (!$key) {
    error_log('[lead] HERO_API_KEY fehlt');
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Serverkonfiguration unvollständig.']);
    exit;
}

// Lesbaren Kommentar bauen (erscheint im Hero-Logbuch).
$vorhabenLabels  = ['neubau' => 'Neubau', 'sanierung' => 'Sanierung', 'reparatur' => 'Reparatur'];
$bereichLabels   = ['bad' => 'Badezimmer', 'kueche' => 'Küche', 'wohnbereich' => 'Wohnbereich', 'aussen' => 'Außen & Terrasse', 'gewerbe' => 'Gewerbe', 'sonstiges' => 'Sonstiges'];
$tageszeitLabels = ['vormittags' => 'vormittags', 'nachmittags' => 'nachmittags'];
$weekdayLabels   = ['mo' => 'Mo', 'di' => 'Di', 'mi' => 'Mi', 'do' => 'Do', 'fr' => 'Fr', 'sa' => 'Sa'];

$vorhaben = $vorhabenLabels[$data['vorhaben'] ?? ''] ?? ($data['vorhaben'] ?? '—');
$bereichArr = $data['bereich'] ?? [];
if (!is_array($bereichArr)) $bereichArr = $bereichArr ? [$bereichArr] : [];
$bereich = implode(', ', array_map(fn($b) => $bereichLabels[$b] ?? $b, $bereichArr));
if ($bereich === '') $bereich = '—';

$lines = ["Vorhaben: $vorhaben · Bereich: $bereich"];
$days = implode(', ', array_map(fn($d) => $weekdayLabels[$d] ?? $d, $data['weekdays'] ?? []));
$zeit = implode(' / ', array_map(fn($t) => $tageszeitLabels[$t] ?? $t, $data['daytimes'] ?? []));
if ($days || $zeit) {
    $lines[] = 'Erreichbarkeit: ' . ($days ?: 'flexibel') . ($zeit ? " – $zeit" : '');
}
$message = trim($data['message'] ?? '');
if ($message !== '') $lines[] = 'Nachricht: "' . $message . '"';
$comment = implode("\n", $lines);

$payload = [
    'measure'  => 'PRJ',
    'customer' => [
        'email'      => $email,
        'first_name' => $firstName,
        'last_name'  => $lastName,
    ],
    'address' => ['zipcode' => $zipcode],
    'project' => [
        'source'        => 'stonetec Website – Kontaktformular',
        'source_sub'    => 'stonetec-bocholt.de',
        'source_medium' => 'Anfrageformular',
    ],
    'project_match' => [
        'status_code'    => 201,
        'comment'        => $comment,
        'inform_partner' => true,
    ],
];
$phone = trim($data['phone'] ?? '');
if ($phone !== '') $payload['customer']['phone_mobile'] = $phone;
$city = trim($data['city'] ?? '');
if ($city !== '') $payload['address']['city'] = $city;

$heroUrl = getenv('HERO_API_URL') ?: 'https://login.hero-software.de/api/v1/Projects/create';
$ch = curl_init($heroUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json', 'Authorization: Bearer ' . $key],
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_TIMEOUT        => 20,
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr  = curl_error($ch);
curl_close($ch);

if ($curlErr) {
    error_log('[lead] cURL-Fehler: ' . $curlErr);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unerwarteter Fehler.']);
    exit;
}
if ($httpCode < 200 || $httpCode >= 300) {
    error_log('[lead] Hero-Fehler ' . $httpCode . ' ' . substr((string) $response, 0, 500));
    http_response_code(502);
    echo json_encode(['status' => 'error', 'message' => 'Übermittlung fehlgeschlagen.']);
    exit;
}

echo json_encode(['status' => 'success']);
