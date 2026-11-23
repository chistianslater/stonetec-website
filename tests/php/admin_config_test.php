<?php
// php tests/php/admin_config_test.php — der Admin-Hash kommt aus der privaten Konfigurationsdatei.
declare(strict_types=1);

$hash = password_hash('geheim-test', PASSWORD_BCRYPT);
$file = sys_get_temp_dir() . '/lead-config-admin-' . bin2hex(random_bytes(4)) . '.php';
file_put_contents($file, "<?php return ['ADMIN_PW_HASH_B64' => '" . base64_encode($hash) . "'];\n");
putenv('LEAD_PRIVATE_CONFIG=' . $file);
putenv('ADMIN_PW_HASH_B64'); // nicht gesetzt: simuliert, dass die Umgebungsvariable PHP nicht erreicht

require __DIR__ . '/../../public/admin/auth.php';

function check(bool $cond, string $label): void
{
    if (!$cond) {
        fwrite(STDERR, "FAIL: $label\n");
        @unlink($GLOBALS['file']);
        exit(1);
    }
    echo "ok - $label\n";
}

$loaded = admin_password_hash();
check($loaded === $hash, 'Hash wird aus der privaten Konfigurationsdatei gelesen und dekodiert');
check(password_verify('geheim-test', $loaded), 'Passwort verifiziert gegen den gelesenen Hash');
check(!password_verify('falsch', $loaded), 'falsches Passwort wird abgelehnt');

putenv('LEAD_PRIVATE_CONFIG=/nicht/vorhanden.php');
check(admin_password_hash() === '', 'ohne Konfiguration kein Hash (Login nicht möglich)');

@unlink($file);
echo "ALLE TESTS BESTANDEN\n";
