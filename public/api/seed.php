<?php
// EINMALIGER SEEDER — nach Gebrauch löschen.
//
// Schreibt das initiale Manifest (45 Bestandsbilder, alle unter /images/...) an
// die neue persistente Stelle <home>/lookbook-uploads/lookbook.json — aber NUR,
// falls dort noch keins liegt. Überschreibt niemals vorhandene Daten, ist also
// gefahrlos mehrfach aufrufbar.
//
// Nötig, weil das Manifest ausserhalb public_html wandert (deploy-fest) und der
// neue Ort anfangs leer ist. Ohne Seed würde der erste Upload ein Manifest mit
// nur diesem einen Bild erzeugen und die 45 Bestandsbilder verdrängen.

declare(strict_types=1);

require __DIR__ . '/lookbook_store.php';
header('Content-Type: text/plain; charset=utf-8');

$file = lookbook_file();
if (is_file($file)) {
    echo "schon vorhanden — nichts getan: $file\n";
    exit;
}

// Muss exakt legacyImages() aus src/lib/lookbookData.js entsprechen: id
// null-gepolstert (bad01), Dateiname NICHT gepolstert (...-1.jpg). Nur so lösen
// bestehende Merkzettel-Links (gespeicherte IDs) weiterhin auf.
$legacy = [
    ['badezimmer', 'bad', 10],
    ['wohnraum',   'woh', 7],
    ['terrasse',   'ter', 7],
    ['manufaktur', 'man', 7],
    ['details',    'det', 14],
];

$manifest = lookbook_empty_manifest();
$total = 0;
foreach ($legacy as [$dir, $prefix, $count]) {
    for ($i = 1; $i <= $count; $i++) {
        $manifest['sections'][$dir][] = [
            'id'      => $prefix . str_pad((string) $i, 2, '0', STR_PAD_LEFT),
            'src'     => '/images/lookbook/' . $dir . '/stonetec-lookbook-' . $dir . '-' . $i . '.jpg',
            'caption' => '',
        ];
        $total++;
    }
}

if (lookbook_write($manifest)) {
    echo "geschrieben: $file ($total Bilder)\n";
} else {
    echo "FEHLER beim Schreiben: $file\n";
}
