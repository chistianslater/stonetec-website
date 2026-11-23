<?php
// Gesundheits- und Export-Endpunkt für die Lead-Überwachung.
//
// Geschützt per Token (LEAD_HEALTH_TOKEN, Header "Authorization: Bearer …" oder "X-Lead-Token").
// Ohne gesetztes Token antwortet der Endpunkt mit 503 — er ist dann wirkungslos,
// statt offen zu sein. Es werden keine Klartext-Kontaktdaten ausgegeben.
//
//   GET /api/lead_health.php?days=30            → Kennzahlen + Konfigurationsstatus
//   GET /api/lead_health.php?days=30&export=1   → zusätzlich pro Anfrage ein Datensatz
//                                                 (Hash, Click-IDs, Consent, Stufen)
//   GET /api/lead_health.php?check_ga4=1        → prüft das GA4-Secret gegen den
//                                                 Debug-Endpunkt (zeichnet nichts auf)

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

require __DIR__ . '/lead_journal.php';

function health_fail(int $status, string $message): never
{
    http_response_code($status);
    echo json_encode(['status' => 'error', 'message' => $message]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    health_fail(405, 'Method not allowed');
}

$cfg = lead_load_config();

$expected = lead_env('LEAD_HEALTH_TOKEN', $cfg);
if (strlen($expected) < 24) {
    // Nur Namen (keine Werte) der sichtbaren LEAD_*-Variablen: zeigt, ob die Variable
    // überhaupt bei PHP ankommt oder unter anderem Namen/zu kurz vorliegt.
    http_response_code(503);
    echo json_encode(['status' => 'error', 'message' => 'Nicht konfiguriert', 'visible_lead_vars' => lead_env_names(), 'private_config_found' => is_readable(lead_private_config_file()), 'token_length_ok' => false]);
    exit;
}
// Manche Shared-Hosting-Setups entfernen den Authorization-Header; X-Lead-Token ist der Ersatz.
$header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
$given = is_string($header) && str_starts_with($header, 'Bearer ') ? substr($header, 7) : '';
if ($given === '' && isset($_SERVER['HTTP_X_LEAD_TOKEN']) && is_string($_SERVER['HTTP_X_LEAD_TOKEN'])) {
    $given = $_SERVER['HTTP_X_LEAD_TOKEN'];
}
if (!hash_equals($expected, $given)) {
    health_fail(401, 'Nicht autorisiert');
}

$now = time();
$days = max(1, min(LEAD_JOURNAL_RETENTION_DAYS, (int) ($_GET['days'] ?? 30)));
lead_journal_prune(); // täglicher Wächter-Aufruf reicht als Aufräum-Takt
$leads = lead_journal_leads(lead_journal_read($now - $days * 86400, $now));

$secret = resolveGa4Secret($cfg);
$result = [
    'status'  => 'ok',
    'now'     => $now,
    'days'    => $days,
    'config'  => [
        'hero_key_set'       => lead_env('HERO_API_KEY', $cfg) !== '',
        'ga4_secret_set'     => $secret !== '',
        'fallback_mail_set'  => lead_env('LEAD_FALLBACK_EMAIL', $cfg) !== '',
        'private_config_found' => is_readable(lead_private_config_file()),
        'journal_writable'   => is_dir(lead_journal_dir()) ? is_writable(lead_journal_dir()) : is_writable(dirname(lead_journal_dir())),
    ],
    'summary' => lead_journal_summary($leads, $now),
];

if (($_GET['check_ga4'] ?? '') === '1') {
    $result['ga4_check'] = ['ok' => false, 'messages' => []];
    if ($secret === '') {
        $result['ga4_check']['messages'] = ['GA4_API_SECRET fehlt'];
    } else {
        $measurementId = getenv('GA4_MEASUREMENT_ID') ?: ($cfg['GA4_MEASUREMENT_ID'] ?? 'G-2CWR9BSMGL');
        $url = 'https://www.google-analytics.com/debug/mp/collect?measurement_id=' . urlencode($measurementId)
             . '&api_secret=' . urlencode($secret);
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_POSTFIELDS     => json_encode([
                'client_id' => 'health.check',
                'events'    => [['name' => 'generate_lead', 'params' => ['method' => 'health_check', 'engagement_time_msec' => 1]]],
            ]),
            CURLOPT_TIMEOUT => 8,
        ]);
        $body = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $decoded = is_string($body) ? json_decode($body, true) : null;
        $messages = is_array($decoded) ? ($decoded['validationMessages'] ?? []) : [];
        // ACHTUNG: Das Debug-Endpoint prüft Payload und Format, aber NICHT zuverlässig,
        // ob das Secret gültig ist (Measurement Protocol antwortet auch dann 2xx).
        // Ob GA4 die Events wirklich zählt, belegt nur der Abgleich Journal ↔ GA4-Report
        // im Wächter.
        $result['ga4_check'] = [
            'ok'       => $code === 200 && is_array($decoded) && $messages === [],
            'http'     => $code,
            'messages' => array_map(fn($m) => (string) ($m['description'] ?? ''), is_array($messages) ? $messages : []),
        ];
    }
}

if (($_GET['export'] ?? '') === '1') {
    $result['leads'] = $leads;
}

echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
