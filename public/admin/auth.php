<?php
// Zugang zum Lookbook-Admin.
//
// Ein einziges Passwort, als bcrypt-Hash in der nicht committeten config.php
// (gleiches Muster wie HERO_API_KEY). Keine Benutzerverwaltung, keine
// Registrierung, keine Passwort-vergessen-Funktion — der Zugang ist für eine
// Person gedacht.

declare(strict_types=1);

require __DIR__ . '/../api/lookbook_store.php';

const ADMIN_SESSION_FLAG  = 'lookbook_admin_ok';
const ADMIN_SESSION_START = 'lookbook_admin_since';
const ADMIN_SESSION_CSRF  = 'lookbook_admin_csrf';
const ADMIN_SESSION_TTL   = 8 * 3600;
const ADMIN_MAX_ATTEMPTS  = 5;
const ADMIN_LOCK_SECONDS  = 900;

function admin_config(): array
{
    $cfg = @include __DIR__ . '/../api/config.php';
    return is_array($cfg) ? $cfg : [];
}

function admin_password_hash(): string
{
    $cfg = admin_config();

    // Bevorzugt: base64-kodierter Hash aus der Umgebungsvariable.
    // base64 enthält kein '$' — deshalb kann das Hosting-Panel den Wert nicht
    // verändern (bcrypt-Hashes mit '$' werden dort zerstört, siehe die analoge
    // GA4-Workaround-Logik in api/lead.php). Die Umgebungsvariable überlebt
    // zudem jeden Rebuild des Webroots.
    $b64 = getenv('ADMIN_PW_HASH_B64') ?: ($cfg['ADMIN_PW_HASH_B64'] ?? '');
    if (is_string($b64) && $b64 !== '') {
        $decoded = base64_decode($b64, true);
        // Nur einen plausiblen bcrypt-Hash akzeptieren, keine Dekodier-Reste.
        if (is_string($decoded) && str_starts_with($decoded, '$2')) {
            return $decoded;
        }
    }

    // Fallback: roher Hash aus Umgebung oder config.php (falls dort gesetzt).
    return (string) (getenv('ADMIN_PW_HASH') ?: ($cfg['ADMIN_PW_HASH'] ?? ''));
}

function admin_start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/admin/',
        'httponly' => true,
        // Auf einer lokalen http-Testumgebung würde ein erzwungenes `secure`
        // das Cookie verwerfen und den Login unmöglich machen.
        'secure'   => !empty($_SERVER['HTTPS']),
        'samesite' => 'Strict',
    ]);
    session_name('stonetec_admin');
    session_start();

    // Abgelaufene Sitzung verwerfen.
    $since = $_SESSION[ADMIN_SESSION_START] ?? 0;
    if (!empty($_SESSION[ADMIN_SESSION_FLAG]) && (time() - (int) $since) > ADMIN_SESSION_TTL) {
        admin_logout();
    }
}

function admin_is_logged_in(): bool
{
    return !empty($_SESSION[ADMIN_SESSION_FLAG]);
}

/* ─── Drosselung ────────────────────────────────────────────────
   Dateibasierter Zähler je IP unter /uploads/.private/throttle/.
   Das Verzeichnis ist per .htaccess vollständig vom Web abgeschottet. */

function admin_private_dir(): string
{
    return lookbook_dir() . '/.private';
}

function admin_throttle_file(): string
{
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unbekannt');
    return admin_private_dir() . '/throttle/' . hash('sha256', $ip) . '.json';
}

function admin_throttle_read(): array
{
    $file = admin_throttle_file();
    if (!is_readable($file)) {
        return ['count' => 0, 'until' => 0];
    }
    $data = json_decode((string) file_get_contents($file), true);
    if (!is_array($data)) {
        return ['count' => 0, 'until' => 0];
    }
    return ['count' => (int) ($data['count'] ?? 0), 'until' => (int) ($data['until'] ?? 0)];
}

function admin_lock_remaining(): int
{
    $state = admin_throttle_read();
    return max(0, $state['until'] - time());
}

function admin_is_locked(): bool
{
    return admin_lock_remaining() > 0;
}

function admin_note_failure(): void
{
    $dir = admin_private_dir() . '/throttle';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        error_log('[admin] Drosselungsverzeichnis nicht anlegbar');
        return;
    }
    $state = admin_throttle_read();
    $state['count']++;
    if ($state['count'] >= ADMIN_MAX_ATTEMPTS) {
        $state['until'] = time() + ADMIN_LOCK_SECONDS;
        $state['count'] = 0;
    }
    @file_put_contents(admin_throttle_file(), json_encode($state));
}

function admin_clear_failures(): void
{
    @unlink(admin_throttle_file());
}

/* ─── Anmeldung ──────────────────────────────────────────────── */

function admin_login(string $password): bool
{
    if (admin_is_locked()) {
        return false;
    }
    $hash = admin_password_hash();
    if ($hash === '') {
        error_log('[admin] ADMIN_PW_HASH fehlt — Login nicht möglich');
        return false;
    }
    if (!password_verify($password, $hash)) {
        admin_note_failure();
        return false;
    }

    // Session-ID nach der Anmeldung wechseln (Session-Fixation).
    session_regenerate_id(true);
    $_SESSION[ADMIN_SESSION_FLAG]  = true;
    $_SESSION[ADMIN_SESSION_START] = time();
    admin_clear_failures();
    return true;
}

function admin_logout(): void
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
}

function admin_require_login(): void
{
    if (!admin_is_logged_in()) {
        header('Location: index.php');
        exit;
    }
}

/* ─── CSRF ───────────────────────────────────────────────────── */

function admin_csrf_token(): string
{
    if (empty($_SESSION[ADMIN_SESSION_CSRF])) {
        $_SESSION[ADMIN_SESSION_CSRF] = bin2hex(random_bytes(32));
    }
    return (string) $_SESSION[ADMIN_SESSION_CSRF];
}

function admin_check_csrf(?string $token): bool
{
    $expected = $_SESSION[ADMIN_SESSION_CSRF] ?? '';
    return is_string($token) && $expected !== '' && hash_equals((string) $expected, $token);
}

/* ─── Schutzdateien im Upload-Verzeichnis ─────────────────────
   /uploads/ liegt nicht im Repo und wird zur Laufzeit angelegt — die
   Schutzdateien muss deshalb PHP schreiben, sonst werden sie beim Einrichten
   vergessen. Die Website nutzt bereits .htaccess für ihr Routing, AllowOverride
   ist also aktiv. */

function admin_ensure_upload_guards(): void
{
    $uploads = lookbook_dir();
    if (!is_dir($uploads) && !@mkdir($uploads, 0755, true) && !is_dir($uploads)) {
        return;
    }

    $uploadGuard = $uploads . '/.htaccess';
    if (!file_exists($uploadGuard)) {
        // Nowdoc, damit PHP nichts im Regex-Ausdruck zu interpolieren versucht.
        @file_put_contents($uploadGuard, <<<'HTACCESS'
# Hochgeladene Dateien duerfen unter keinen Umstaenden ausgefuehrt werden.
php_flag engine off
AddType text/plain .php .phtml .php3 .php4 .php5 .php7 .phps .cgi .pl

<FilesMatch "\.(php|phtml|php[0-9]|phps|cgi|pl|py|sh)$">
  Require all denied
</FilesMatch>

HTACCESS);
    }

    $private = admin_private_dir();
    if (!is_dir($private) && !@mkdir($private, 0700, true) && !is_dir($private)) {
        return;
    }
    $privateGuard = $private . '/.htaccess';
    if (!file_exists($privateGuard)) {
        @file_put_contents($privateGuard, "Require all denied\n");
    }
}

/** Nach einer POST-Aktion zurück zur Übersicht (Post/Redirect/Get). */
function admin_redirect(string $status): never
{
    header('Location: index.php?status=' . urlencode($status));
    exit;
}
