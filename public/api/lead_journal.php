<?php
// Lead-Journal: unabhängige "Wahrheit" über jede Formular-Anfrage.
//
// Warum: Die Anfrage landet in Hero (CRM), die Conversion in GA4 und von dort in
// Google Ads. Fällt eine Stufe still aus, merkt es sonst niemand (so geschehen
// ab 30.10.2026). Das Journal hält pro Anfrage fest, WAS passiert ist — Eingang,
// Hero-Antwort, GA4-Antwort, Fallback-Mail — und ist die Datenbasis für den
// täglichen Wächter (scripts/lead-watchdog.mjs) und den Ads-Offline-Upload.
//
// Datenschutz: Es werden KEINE Kontaktdaten gespeichert (auch keine E-Mail-Hashes) —
// nur Click-IDs, Einwilligungsstand, Landingpage-Pfad und technische Statuswerte.
// Aufbewahrung 90 Tage (Tagesdateien, die nach Ablauf gelöscht werden).
//
// Liegt AUSSERHALB von public_html (wie lookbook-uploads), damit es weder per URL
// erreichbar ist noch bei einem Deploy gelöscht wird.
// Eingebunden von api/lead.php und api/lead_health.php.

declare(strict_types=1);

const LEAD_JOURNAL_RETENTION_DAYS = 90;
const LEAD_JOURNAL_CLICK_ID_MAX = 200;

/** <home>/lead-journal — deploy-fest. Für Tests per LEAD_JOURNAL_DIR überschreibbar. */
function lead_journal_dir(): string
{
    $override = getenv('LEAD_JOURNAL_DIR');
    if (is_string($override) && $override !== '') {
        return rtrim($override, '/');
    }
    return dirname(__DIR__, 2) . '/lead-journal';
}

/** Tagesdatei (UTC), z. B. leads-2026-11-23.jsonl — Pruning nach Alter ohne Umschreiben. */
function lead_journal_file(int $ts): string
{
    return lead_journal_dir() . '/leads-' . gmdate('Y-m-d', $ts) . '.jsonl';
}

function lead_journal_new_id(): string
{
    return bin2hex(random_bytes(8));
}

/** Click-IDs (gclid/gbraid/wbraid) nur in sicherer Form übernehmen. */
function lead_journal_clean_click_id($value): string
{
    if (!is_string($value)) {
        return '';
    }
    $value = trim($value);
    if ($value === '' || strlen($value) > LEAD_JOURNAL_CLICK_ID_MAX) {
        return '';
    }
    return preg_match('/^[A-Za-z0-9_\-]+$/', $value) === 1 ? $value : '';
}

/** Einwilligungsstand des Besuchers beim Absenden. */
function lead_journal_clean_consent($value): string
{
    return $value === 'accepted' || $value === 'declined' ? $value : 'unknown';
}

/** Landingpage-Pfad (nur Pfad, keine Query), damit keine IDs im Klartext wandern. */
function lead_journal_clean_path($value): string
{
    if (!is_string($value)) {
        return '';
    }
    $path = parse_url(trim($value), PHP_URL_PATH);
    if (!is_string($path) || $path === '' || $path[0] !== '/') {
        return '';
    }
    return substr(preg_replace('/[^A-Za-z0-9_\-\/\.]/', '', $path) ?? '', 0, 120);
}

/**
 * Hängt eine Zeile ans Journal an. Wirft nie: Das Journal darf eine Anfrage
 * niemals blockieren. Rückgabe false = nicht geschrieben (wird sonst ignoriert).
 */
function lead_journal_append(array $entry, ?int $now = null): bool
{
    $now = $now ?? time();
    $entry['ts'] = $now;

    $dir = lead_journal_dir();
    if (!is_dir($dir) && !@mkdir($dir, 0750, true) && !is_dir($dir)) {
        error_log('[lead-journal] Ordner nicht anlegbar: ' . $dir);
        return false;
    }

    $line = json_encode($entry, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($line === false) {
        return false;
    }
    $file = lead_journal_file($now);
    $isNew = !is_file($file);
    $written = @file_put_contents($file, $line . "\n", FILE_APPEND | LOCK_EX);
    if ($written === false) {
        error_log('[lead-journal] Schreiben fehlgeschlagen');
        return false;
    }
    if ($isNew) {
        @chmod($file, 0640);
    }
    return true;
}

/** Löscht Tagesdateien, die älter als die Aufbewahrungsfrist sind. */
function lead_journal_prune(?int $now = null): int
{
    $now = $now ?? time();
    $cutoffDay = gmdate('Y-m-d', $now - LEAD_JOURNAL_RETENTION_DAYS * 86400);
    $removed = 0;
    foreach (glob(lead_journal_dir() . '/leads-*.jsonl') ?: [] as $file) {
        if (preg_match('/leads-(\d{4}-\d{2}-\d{2})\.jsonl$/', $file, $m) && $m[1] < $cutoffDay && @unlink($file)) {
            $removed++;
        }
    }
    return $removed;
}

/** Gelegentliches Aufräumen im Request-Pfad (ca. jeder 20. Aufruf), ohne Dauerlast. */
function lead_journal_prune_sometimes(): void
{
    if (random_int(1, 20) === 1) {
        lead_journal_prune();
    }
}

/** Liest alle Zeilen ab $sinceTs (nur die dafür nötigen Tagesdateien). */
function lead_journal_read(int $sinceTs, ?int $now = null): array
{
    $now = $now ?? time();
    $rows = [];
    for ($day = $sinceTs - ($sinceTs % 86400); $day <= $now; $day += 86400) {
        $file = lead_journal_file($day);
        if (!is_readable($file)) {
            continue;
        }
        foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
            $row = json_decode($line, true);
            if (is_array($row) && ($row['ts'] ?? 0) >= $sinceTs) {
                $rows[] = $row;
            }
        }
    }
    return $rows;
}

/**
 * Fasst die Zeilen pro Anfrage-ID zu einem Datensatz zusammen:
 * { id, ts, gclid, gbraid, wbraid, consent, path,
 *   hero: {ok, code}|null, ga4: {ok, code}|null, mail: {ok}|null, delivered: bool }
 * "delivered" = Anfrage ist beim Betrieb angekommen (Hero ok ODER Fallback-Mail ok).
 */
function lead_journal_leads(array $rows): array
{
    $leads = [];
    foreach ($rows as $row) {
        $id = $row['id'] ?? null;
        if (!is_string($id) || $id === '') {
            continue;
        }
        $leads[$id] = $leads[$id] ?? [
            'id' => $id, 'ts' => (int) ($row['ts'] ?? 0),
            'gclid' => '', 'gbraid' => '', 'wbraid' => '',
            'consent' => 'unknown', 'path' => '', 'has_ga_client' => false,
            'hero' => null, 'ga4' => null, 'mail' => null, 'delivered' => false,
        ];
        $stage = $row['stage'] ?? '';
        if ($stage === 'received') {
            foreach (['ts', 'gclid', 'gbraid', 'wbraid', 'consent', 'path', 'has_ga_client'] as $k) {
                if (array_key_exists($k, $row)) {
                    $leads[$id][$k] = $row[$k];
                }
            }
        } elseif (in_array($stage, ['hero', 'ga4', 'mail'], true)) {
            $leads[$id][$stage] = ['ok' => (bool) ($row['ok'] ?? false), 'code' => (int) ($row['code'] ?? 0)];
        }
    }
    foreach ($leads as &$lead) {
        $lead['delivered'] = ($lead['hero']['ok'] ?? false) || ($lead['mail']['ok'] ?? false);
    }
    unset($lead);
    usort($leads, fn(array $a, array $b): int => $a['ts'] <=> $b['ts']);
    return array_values($leads);
}

/** Kennzahlen über einen Zeitraum — Grundlage für den Wächter. */
function lead_journal_summary(array $leads, int $now): array
{
    $count = fn(int $days, callable $pred): int => count(array_filter(
        $leads,
        fn(array $l): bool => $l['ts'] >= $now - $days * 86400 && $pred($l)
    ));
    $all = fn(array $l): bool => true;
    $delivered = fn(array $l): bool => $l['delivered'];
    $heroFailed = fn(array $l): bool => $l['hero'] !== null && !$l['hero']['ok'];
    $ga4Failed = fn(array $l): bool => $l['ga4'] !== null && !$l['ga4']['ok'];
    // "Verloren": nicht zugestellt und älter als 10 Min. (laufende Anfragen ausnehmen).
    // Deckt auch Abstürze ab, bei denen gar keine Hero-/Mail-Zeile geschrieben wurde.
    $lost = fn(array $l): bool => !$l['delivered'] && $l['ts'] < $now - 600;

    $last = null;
    foreach ($leads as $l) {
        if ($l['delivered']) {
            $last = max($last ?? 0, $l['ts']);
        }
    }

    return [
        'received_1d' => $count(1, $all), 'received_7d' => $count(7, $all), 'received_30d' => $count(30, $all),
        'delivered_7d' => $count(7, $delivered), 'delivered_30d' => $count(30, $delivered),
        'hero_failed_7d' => $count(7, $heroFailed), 'ga4_failed_7d' => $count(7, $ga4Failed),
        'lost_7d' => $count(7, $lost),
        'last_delivered_ts' => $last,
    ];
}

/**
 * Löst den GA4 Measurement-Protocol-Secret robust auf: zuerst korrekt benannte
 * Env-Variable/config, dann Fallback über einen Env-Key, dessen Name auf
 * `A4_API_SECRET` endet — toleriert Panel-Tippfehler/Propagationsverzögerung
 * beim Hosting (der Wert liegt vor, nur unter abweichendem Namen).
 * Gemeinsam genutzt von lead.php und lead_health.php, damit beide dasselbe sehen.
 */
function resolveGa4Secret(array $cfg): string
{
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
 * Ort der privaten Konfigurationsdatei: <home>/domains/<domain>/lead-config.php, also
 * ein Geschwister von public_html. Dort überlebt sie jeden Deploy (Hostinger baut
 * public_html bei jedem Build neu) und ist nicht per URL erreichbar.
 *
 * Warum nicht nur Umgebungsvariablen: Die Variablen im hPanel gelten bei Vite-Publish
 * nur für den BUILD (".env" beim Bauen), nicht für PHP zur Laufzeit. Hostinger empfiehlt
 * für PHP-Anwendungen ausdrücklich eine Konfigurationsdatei außerhalb des Repos.
 * Für Tests per LEAD_PRIVATE_CONFIG überschreibbar.
 */
function lead_private_config_file(): string
{
    $override = getenv('LEAD_PRIVATE_CONFIG');
    if (is_string($override) && $override !== '') {
        return $override;
    }
    return dirname(__DIR__, 2) . '/lead-config.php';
}

/**
 * Lädt die Konfiguration: zuerst api/config.php (Altbestand), darüber die private
 * Datei außerhalb des Webroots (hat Vorrang). Liefert immer ein Array.
 */
function lead_load_config(): array
{
    $merged = [];
    foreach ([__DIR__ . '/config.php', lead_private_config_file()] as $file) {
        if (is_readable($file)) {
            $cfg = @include $file;
            if (is_array($cfg)) {
                $merged = array_merge($merged, $cfg);
            }
        }
    }
    return $merged;
}

/**
 * Liest eine Konfigurationsvariable robust. Auf Shared Hosting (LiteSpeed/Apache) ist
 * eine Umgebungsvariable je nach Setup nur in getenv(), nur in $_SERVER/$_ENV oder mit
 * dem Präfix REDIRECT_ sichtbar (z. B. nach internem Rewrite). Reihenfolge: Umgebung,
 * danach die Konfigurationsdateien (siehe lead_load_config). Leerer String = nicht gesetzt.
 */
function lead_env(string $name, array $cfg = []): string
{
    foreach ([getenv($name), $_ENV[$name] ?? null, $_SERVER[$name] ?? null, $_SERVER['REDIRECT_' . $name] ?? null] as $value) {
        if (is_string($value) && $value !== '') {
            return $value;
        }
    }
    $fromCfg = $cfg[$name] ?? '';
    return is_string($fromCfg) ? $fromCfg : '';
}

/** Namen (nie Werte) aller sichtbaren LEAD_*-Variablen — Diagnose, wenn eine fehlt. */
function lead_env_names(): array
{
    $names = [];
    foreach (array_merge(array_keys($_ENV), array_keys($_SERVER), array_keys(getenv() ?: [])) as $key) {
        if (is_string($key) && preg_match('/^(REDIRECT_)?LEAD_[A-Z_]+$/', $key)) {
            $names[$key] = true;
        }
    }
    ksort($names);
    return array_keys($names);
}
