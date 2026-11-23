<?php
// Lead-Proxy: nimmt die Formulardaten entgegen, validiert sie und leitet sie
// serverseitig an die Hero Lead-API weiter. Der API-Key bleibt serverseitig
// (ENV oder config.php) und taucht nie im ausgelieferten Frontend auf.

header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/lookbook_store.php';
require __DIR__ . '/lead_journal.php';

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
$key = lead_env('HERO_API_KEY', $cfg);

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

// Journal: Eingang der (gültigen) Anfrage festhalten, BEVOR irgendein externer
// Dienst angefragt wird. So bleibt jede Anfrage nachvollziehbar, auch wenn Hero
// oder GA4 ausfallen. Keine Klartext-Kontaktdaten, nur Hash + technische Werte.
$leadId = lead_journal_new_id();
lead_journal_append([
    'id'            => $leadId,
    'stage'         => 'received',
    'gclid'         => lead_journal_clean_click_id($data['gclid'] ?? null),
    'gbraid'        => lead_journal_clean_click_id($data['gbraid'] ?? null),
    'wbraid'        => lead_journal_clean_click_id($data['wbraid'] ?? null),
    'consent'       => lead_journal_clean_consent($data['consent'] ?? null),
    'path'          => lead_journal_clean_path($data['landing_path'] ?? null),
    'has_ga_client' => trim((string) ($data['ga_client_id'] ?? '')) !== '',
]);
lead_journal_prune_sometimes();

// Bricht die Verarbeitung ab, bevor Hero oder Fallback-Mail beantwortet haben
// (PHP-Fehler, Timeout), bleibt der Eintrag sonst ohne Ausgang. Dann einen
// Fehlschlag festhalten, damit der Wächter die Anfrage als VERLOREN erkennt.
$leadSettled = false;
register_shutdown_function(function () use (&$leadSettled, $leadId): void {
    if (!$leadSettled) {
        lead_journal_append(['id' => $leadId, 'stage' => 'hero', 'ok' => false, 'code' => -1]);
    }
});

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
$weekdays = is_array($data['weekdays'] ?? null) ? $data['weekdays'] : [];
$daytimes = is_array($data['daytimes'] ?? null) ? $data['daytimes'] : [];
$days = implode(', ', array_map(fn($d) => $weekdayLabels[$d] ?? $d, $weekdays));
$zeit = implode(' / ', array_map(fn($t) => $tageszeitLabels[$t] ?? $t, $daytimes));
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

// Übermittlung an Hero. Jede Stufe landet im Journal; schlägt Hero fehl, geht die
// Anfrage — wenn LEAD_FALLBACK_EMAIL gesetzt ist — per Mail an den Betrieb, damit
// kein Lead verloren geht. Nur wenn auch das scheitert, sieht der Besucher einen
// Fehler.
$heroCode = 0;
$heroOk = false;
if (!$key) {
    error_log('[lead] HERO_API_KEY fehlt');
} else {
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
    $heroCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr  = curl_error($ch);

    if ($curlErr) {
        error_log('[lead] cURL-Fehler: ' . $curlErr);
    } elseif ($heroCode < 200 || $heroCode >= 300) {
        error_log('[lead] Hero-Fehler ' . $heroCode . ' ' . substr((string) $response, 0, 500));
    } else {
        $heroOk = true;
    }
}
lead_journal_append(['id' => $leadId, 'stage' => 'hero', 'ok' => $heroOk, 'code' => $heroCode]);
$leadSettled = true;

$delivered = $heroOk;
if (!$heroOk) {
    $mailOk = sendLeadFallbackMail($data, $comment, $cfg, $leadId);
    lead_journal_append(['id' => $leadId, 'stage' => 'mail', 'ok' => $mailOk, 'code' => 0]);
    $delivered = $mailOk;
}

if (!$delivered) {
    http_response_code($key ? 502 : 500);
    echo json_encode(['status' => 'error', 'message' => $key ? 'Übermittlung fehlgeschlagen.' : 'Serverkonfiguration unvollständig.']);
    exit;
}

// Server-seitige GA4-Conversion (Measurement Protocol): feuert `generate_lead`
// unabhängig von Browser, Consent-Timing, Ad-Blockern und 503-Drosselung.
// Fehler hier brechen die Erfolgsantwort an den Nutzer NIE ab — sie landen im Journal.
$ga4 = sendGa4LeadEvent($data, $cfg);
lead_journal_append(['id' => $leadId, 'stage' => 'ga4', 'ok' => $ga4['ok'], 'code' => $ga4['code']]);

echo json_encode(['status' => 'success']);

/**
 * Sendet das `generate_lead`-Conversion-Event serverseitig an GA4
 * (Measurement Protocol). Attribuiert über die vom Browser mitgeschickte
 * client_id/session_id an dieselbe Session (Google-Ads-Attribution bleibt erhalten).
 */
function sendGa4LeadEvent(array $data, array $cfg): array {
    $measurementId = getenv('GA4_MEASUREMENT_ID') ?: ($cfg['GA4_MEASUREMENT_ID'] ?? 'G-2CWR9BSMGL');
    $apiSecret     = resolveGa4Secret($cfg);
    if ($apiSecret === '') {
        error_log('[lead] GA4_API_SECRET fehlt – generate_lead nicht serverseitig gesendet');
        return ['ok' => false, 'code' => 0];
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

    $ok = $err === '' && $code >= 200 && $code < 300;
    if (!$ok) {
        error_log('[lead] GA4 MP Fehler ' . $code . ' ' . $err . ' ' . substr((string) $resp, 0, 300));
    }
    return ['ok' => $ok, 'code' => $code];
}

/**
 * Notfall-Weg, wenn Hero die Anfrage nicht annimmt: schickt die Anfrage per Mail
 * an LEAD_FALLBACK_EMAIL (Umgebungsvariable oder config.php). Ohne gesetzte
 * Adresse passiert nichts (Rückgabe false). Kopfzeilen-Injection verhindert $clean
 * (entfernt CR/LF); Reply-To wird zusätzlich nur bei gültiger Adresse gesetzt.
 */
function sendLeadFallbackMail(array $data, string $comment, array $cfg, string $leadId): bool {
    $to = lead_env('LEAD_FALLBACK_EMAIL', $cfg);
    if (filter_var($to, FILTER_VALIDATE_EMAIL) === false) {
        return false;
    }
    $clean = fn($v): string => trim(str_replace(["\r", "\n"], ' ', (string) $v));
    $body = implode("\n", [
        'Diese Anfrage konnte NICHT an Hero übermittelt werden und kommt deshalb per Mail.',
        'Bitte manuell in Hero anlegen. (Referenz: ' . $leadId . ')',
        '',
        'Name:    ' . $clean($data['firstName'] ?? '') . ' ' . $clean($data['lastName'] ?? ''),
        'E-Mail:  ' . $clean($data['email'] ?? ''),
        'Telefon: ' . $clean($data['phone'] ?? ''),
        'PLZ/Ort: ' . $clean($data['zipcode'] ?? '') . ' ' . $clean($data['city'] ?? ''),
        '',
        $comment,
    ]);
    $replyTo = filter_var($clean($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
    $headers = array_filter([
        'From: StoneTec Website <noreply@stonetec-bocholt.de>',
        $replyTo !== false ? 'Reply-To: ' . $replyTo : null,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
    ]);
    return @mail($to, '=?UTF-8?B?' . base64_encode('Anfrage per Notfall-Weg (Hero nicht erreichbar)') . '?=', $body, implode("\r\n", $headers));
}
