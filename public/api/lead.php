<?php
// Lead-Proxy: nimmt die Formulardaten entgegen, validiert sie und leitet sie
// serverseitig an die Hero Lead-API weiter. Der API-Key bleibt serverseitig
// (ENV oder config.php) und taucht nie im ausgelieferten Frontend auf.

header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/lookbook_store.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Konfiguration: Umgebungsvariablen haben Vorrang, sonst config.php (nicht im Repo).
$cfg = @include __DIR__ . '/config.php';
if (!is_array($cfg)) {
    $cfg = [];
}
$key = getenv('HERO_API_KEY') ?: ($cfg['HERO_API_KEY'] ?? '');

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

// Merkzettel: die vom Besucher gemerkten Lookbook-Bilder als klickbare Links.
// Bewusst Links statt Dateianhänge — das images-Format der Hero-API ist nicht
// dokumentiert, Links funktionieren garantiert.
$picks = $data['lookbookPicks'] ?? [];
if (is_array($picks) && $picks !== []) {
    // Feste Basis-URL statt HTTP_HOST: der Host-Header ist vom Aufrufer
    // steuerbar und würde sonst fremde Links ins CRM tragen.
    $siteUrl = rtrim(getenv('SITE_URL') ?: ($cfg['SITE_URL'] ?? 'https://stonetec-bocholt.de'), '/');
    $entries = lookbook_resolve_ids(lookbook_read(), $picks, 20);

    if ($entries !== []) {
        $count = count($entries);
        $kopf = 'Merkzettel (' . $count . ($count === 1 ? ' Bild' : ' Bilder');
        if (count($picks) > $count) {
            $kopf .= ' von ' . count($picks) . ' ausgewählten';
        }
        $kopf .= '):';

        $block = [$kopf];
        foreach ($entries as $img) {
            $block[] = $siteUrl . $img['src'];
        }
        $lines[] = implode("\n", $block);
    }
}

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

// Server-seitige GA4-Conversion (Measurement Protocol): feuert `generate_lead`
// unabhängig von Browser, Consent-Timing, Ad-Blockern und 503-Drosselung.
// Fehler hier brechen die Erfolgsantwort an den Nutzer NIE ab.
sendGa4LeadEvent($data, $cfg);

echo json_encode(['status' => 'success']);

/**
 * Löst den GA4 Measurement-Protocol-Secret robust auf: zuerst korrekt benannte
 * Env-Variable/config, dann Fallback über einen Env-Key, dessen Name auf
 * `A4_API_SECRET` endet — toleriert Panel-Tippfehler/Propagationsverzögerung
 * beim Hosting (der Wert liegt vor, nur unter abweichendem Namen).
 */
function resolveGa4Secret(array $cfg): string {
    $s = getenv('GA4_API_SECRET') ?: ($cfg['GA4_API_SECRET'] ?? '');
    if ($s !== '') {
        return $s;
    }
    foreach (array_merge($_ENV, $_SERVER, getenv() ?: []) as $k => $v) {
        if (is_string($k) && is_string($v) && $v !== '' && preg_match('/A4_API_SECRET$/i', $k)) {
            return $v;
        }
    }
    return '';
}

/**
 * Sendet das `generate_lead`-Conversion-Event serverseitig an GA4
 * (Measurement Protocol). Attribuiert über die vom Browser mitgeschickte
 * client_id/session_id an dieselbe Session (Google-Ads-Attribution bleibt erhalten).
 */
function sendGa4LeadEvent(array $data, array $cfg): void {
    $measurementId = getenv('GA4_MEASUREMENT_ID') ?: ($cfg['GA4_MEASUREMENT_ID'] ?? 'G-2CWR9BSMGL');
    $apiSecret     = resolveGa4Secret($cfg);
    if ($apiSecret === '') {
        error_log('[lead] GA4_API_SECRET fehlt – generate_lead nicht serverseitig gesendet');
        return;
    }

    $clientId = trim((string) ($data['ga_client_id'] ?? ''));
    if ($clientId === '') {
        // Fallback, damit das Event trotzdem landet (Attribution dann schwächer).
        $clientId = random_int(100000000, 999999999) . '.' . time();
    }

    // engagement_time_msec ist Pflicht, damit das MP-Event in den
    // GA4-Standardreports/Sessions gezählt wird (Google-MP-Doku).
    $params = ['method' => 'form', 'form' => 'anfrage_wizard', 'engagement_time_msec' => 100];
    $sessionId = trim((string) ($data['ga_session_id'] ?? ''));
    if ($sessionId !== '') {
        $params['session_id'] = $sessionId;
    }

    $body = json_encode([
        'client_id' => $clientId,
        'events'    => [['name' => 'generate_lead', 'params' => $params]],
    ]);

    $url = 'https://www.google-analytics.com/mp/collect?measurement_id=' . urlencode($measurementId)
         . '&api_secret=' . urlencode($apiSecret);
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS     => $body,
        CURLOPT_TIMEOUT        => 5,
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);

    if ($err !== '' || $code < 200 || $code >= 300) {
        error_log('[lead] GA4 MP Fehler ' . $code . ' ' . $err . ' ' . substr((string) $resp, 0, 300));
    }
}
