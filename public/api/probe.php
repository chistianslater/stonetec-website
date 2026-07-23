<?php
// DIAGNOSE — Machbarkeit "uploads ausserhalb public_html". Nach Gebrauch loeschen.
declare(strict_types=1);
header('Content-Type: text/plain; charset=utf-8');

$home = dirname(__DIR__, 2);              // <home>  (public_html/api -> <home>)
$dir  = $home . '/lookbook-uploads';
$mk   = @mkdir($dir, 0755, true) || is_dir($dir);
$wr   = $mk && @file_put_contents($dir . '/t.txt', 'x') !== false;

echo "__DIR__:         " . __DIR__ . "\n";
echo "DOCUMENT_ROOT:   " . ($_SERVER['DOCUMENT_ROOT'] ?? '(unbekannt)') . "\n";
echo "home (D,2):      $home\n";
echo "ziel-dir:        $dir\n";
echo "dir angelegt:    " . ($mk ? 'JA' : 'NEIN') . "\n";
echo "schreibbar:      " . ($wr ? 'JA' : 'NEIN') . "\n";
echo "open_basedir:    " . (ini_get('open_basedir') ?: '(keine Beschraenkung)') . "\n";
echo "realpath(home):  " . (realpath($home) ?: '(nicht aufloesbar)') . "\n";
echo "realpath(dir):   " . (realpath($dir) ?: '(nicht aufloesbar)') . "\n";

@unlink($dir . '/t.txt');
