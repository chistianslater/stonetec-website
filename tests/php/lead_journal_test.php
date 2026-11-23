<?php
// Einfacher Test ohne Framework: php tests/php/lead_journal_test.php
// Beendet mit Exit-Code 1 bei der ersten fehlgeschlagenen Prüfung.
declare(strict_types=1);

$dir = sys_get_temp_dir() . '/lead-journal-test-' . bin2hex(random_bytes(4));
putenv('LEAD_JOURNAL_DIR=' . $dir);
require __DIR__ . '/../../public/api/lead_journal.php';

function check(bool $cond, string $label): void
{
    if (!$cond) {
        fwrite(STDERR, "FAIL: $label\n");
        exit(1);
    }
    echo "ok - $label\n";
}

// Click-ID-Filter
check(lead_journal_clean_click_id('Cj0KCQ_abc-123') === 'Cj0KCQ_abc-123', 'gclid gültig');
check(lead_journal_clean_click_id('x"; DROP') === '', 'gclid mit Sonderzeichen verworfen');
check(lead_journal_clean_click_id(str_repeat('a', 201)) === '', 'gclid zu lang verworfen');
check(lead_journal_clean_click_id(['a']) === '', 'gclid Nicht-String verworfen');

// Consent / Pfad
check(lead_journal_clean_consent('accepted') === 'accepted', 'consent accepted');
check(lead_journal_clean_consent('bogus') === 'unknown', 'consent unbekannt');
check(lead_journal_clean_path('https://x.de/badsanierung-bocholt?gclid=abc') === '/badsanierung-bocholt', 'Pfad ohne Query');
check(lead_journal_clean_path('javascript:alert(1)') === '', 'Pfad ungültig');

// Schreiben + Lesen + Zusammenfassen
$now = 1_800_000_000; // fester Zeitpunkt
$id1 = 'aaaa111122223333';
$id2 = 'bbbb111122223333';
$id3 = 'cccc111122223333';
check(lead_journal_append(['id' => $id1, 'stage' => 'received', 'gclid' => 'G1', 'gbraid' => '', 'wbraid' => '', 'consent' => 'accepted', 'path' => '/a', 'has_ga_client' => true], $now - 3600), 'append received 1');
lead_journal_append(['id' => $id1, 'stage' => 'hero', 'ok' => true, 'code' => 200], $now - 3590);
lead_journal_append(['id' => $id1, 'stage' => 'ga4', 'ok' => true, 'code' => 204], $now - 3580);
// Lead 2: Hero fehlgeschlagen, Fallback-Mail ok
lead_journal_append(['id' => $id2, 'stage' => 'received', 'gclid' => '', 'gbraid' => '', 'wbraid' => '', 'consent' => 'declined', 'path' => '/b', 'has_ga_client' => false], $now - 7200);
lead_journal_append(['id' => $id2, 'stage' => 'hero', 'ok' => false, 'code' => 502], $now - 7190);
lead_journal_append(['id' => $id2, 'stage' => 'mail', 'ok' => true, 'code' => 0], $now - 7189);
// Lead 3: nur eingegangen, nichts geliefert
lead_journal_append(['id' => $id3, 'stage' => 'received', 'gclid' => '', 'gbraid' => '', 'wbraid' => '', 'consent' => 'unknown', 'path' => '', 'has_ga_client' => false], $now - 100);
lead_journal_append(['id' => $id3, 'stage' => 'hero', 'ok' => false, 'code' => 0], $now - 90);

$leads = lead_journal_leads(lead_journal_read($now - 86400, $now));
check(count($leads) === 3, 'drei Leads zusammengeführt');
check(!array_key_exists('email_hash', $leads[0]), 'keine E-Mail-Hashes im Journal');
check($leads[0]['id'] === $id2, 'nach Zeit sortiert');
$byId = array_column($leads, null, 'id');
check($byId[$id1]['delivered'] === true && $byId[$id1]['gclid'] === 'G1', 'Lead 1 geliefert mit gclid');
check($byId[$id2]['delivered'] === true && $byId[$id2]['hero']['ok'] === false, 'Lead 2 per Mail geliefert');
check($byId[$id3]['delivered'] === false, 'Lead 3 nicht geliefert');

$sum = lead_journal_summary($leads, $now);
check($sum['received_7d'] === 3 && $sum['delivered_7d'] === 2, 'Summary received/delivered');
check($sum['hero_failed_7d'] === 2, 'Summary Hero-Fehler');
check($sum['last_delivered_ts'] === $now - 3600, 'Summary letzter Lead');
check($sum['lost_7d'] === 0, 'Summary: ganz frische, noch offene Anfrage (< 10 Min.) gilt noch nicht als verloren');

// Absturz ohne hero/mail-Zeile → verloren; ganz frischer Lead (< 10 Min.) noch nicht
lead_journal_append(['id' => 'dddd111122223333', 'stage' => 'received', 'gclid' => '', 'gbraid' => '', 'wbraid' => '', 'consent' => 'unknown', 'path' => '', 'has_ga_client' => false], $now - 3000);
lead_journal_append(['id' => 'eeee111122223333', 'stage' => 'received', 'gclid' => '', 'gbraid' => '', 'wbraid' => '', 'consent' => 'unknown', 'path' => '', 'has_ga_client' => false], $now - 60);
$sum2 = lead_journal_summary(lead_journal_leads(lead_journal_read($now - 86400, $now)), $now);
check($sum2['lost_7d'] === 1, 'Absturz ohne Ausgang (älter als 10 Min.) = verloren, frische Anfragen nicht');

// Lesen ignoriert Zeilen vor dem Zeitfenster
check(count(lead_journal_read($now - 600, $now)) === 3, 'Lesen respektiert Zeitfenster');

// Kaputte Zeile stört nicht
file_put_contents(lead_journal_file($now - 3600), "kein json\n", FILE_APPEND);
check(count(lead_journal_leads(lead_journal_read($now - 86400, $now))) === 5, 'kaputte Zeile ignoriert');
check(substr(sprintf('%o', fileperms(lead_journal_file($now - 3600))), -3) === '640', 'Datei mit 0640 angelegt');

// Pruning nach Alter: Datei von vor 91 Tagen weg, von vor 89 Tagen bleibt
$edge = $now - 89 * 86400;
lead_journal_append(['id' => 'edge000000000000', 'stage' => 'received'], $edge);
$old = $now - 200 * 86400;
lead_journal_append(['id' => 'old0000000000000', 'stage' => 'received'], $old);
check(is_file(lead_journal_file($old)), 'alte Datei angelegt');
check(lead_journal_prune($now) >= 1 && !is_file(lead_journal_file($old)), 'alte Datei gelöscht');
check(is_file(lead_journal_file($now)), 'aktuelle Datei bleibt');
check(is_file(lead_journal_file($edge)), 'Datei innerhalb von 90 Tagen bleibt');
$tooOld = $now - 91 * 86400;
lead_journal_append(['id' => 'toold00000000000', 'stage' => 'received'], $tooOld);
check(lead_journal_prune($now) === 1 && !is_file(lead_journal_file($tooOld)), 'Datei von vor 91 Tagen gelöscht');

// Aufräumen
foreach (glob($dir . '/*') ?: [] as $f) { @unlink($f); }
@rmdir($dir);
echo "ALLE TESTS BESTANDEN\n";
