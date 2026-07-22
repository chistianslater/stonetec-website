<?php
// Bildaufbereitung für hochgeladene Lookbook-Fotos.
//
// Aus einem 8-MB-Handyfoto werden rund 250 KB. Nebenbei — und das ist der
// wichtigere Teil — verschwinden beim Neu-Encodieren sämtliche EXIF-Daten
// inklusive GPS-Koordinaten. Fotos von Privatkunden verraten so keine Adressen.

declare(strict_types=1);

const IMAGING_MAX_EDGE     = 2000;
const IMAGING_WEBP_QUALITY = 82;
const IMAGING_JPEG_QUALITY = 85;
const IMAGING_MAX_BYTES    = 25 * 1024 * 1024;
// Ein Bild mit mehr Pixeln sprengt auf Shared Hosting den Arbeitsspeicher,
// bevor GD überhaupt fertig ist. Lieber sauber ablehnen als fatal abstürzen.
const IMAGING_MAX_PIXELS   = 50000000;

function imaging_capabilities(): array
{
    return [
        'gd'   => function_exists('imagecreatetruecolor'),
        'webp' => function_exists('imagewebp'),
        'exif' => function_exists('exif_read_data'),
    ];
}

function imaging_load(string $path, int $type): ?\GdImage
{
    $img = match ($type) {
        IMAGETYPE_JPEG => @imagecreatefromjpeg($path),
        IMAGETYPE_PNG  => @imagecreatefrompng($path),
        IMAGETYPE_WEBP => @imagecreatefromwebp($path),
        default        => false,
    };
    return $img instanceof \GdImage ? $img : null;
}

/** Dreht das Bild gemäß EXIF-Ausrichtung — Hochformat vom Handy landet sonst quer. */
function imaging_apply_orientation(\GdImage $img, string $path, int $type): \GdImage
{
    if ($type !== IMAGETYPE_JPEG || !function_exists('exif_read_data')) {
        return $img;
    }
    $exif = @exif_read_data($path);
    $orientation = (int) ($exif['Orientation'] ?? 1);

    $rotated = match ($orientation) {
        3 => imagerotate($img, 180, 0),
        6 => imagerotate($img, -90, 0),
        8 => imagerotate($img, 90, 0),
        default => null,
    };
    if ($rotated instanceof \GdImage) {
        imagedestroy($img);
        return $rotated;
    }
    return $img;
}

function imaging_resize(\GdImage $img): \GdImage
{
    $w = imagesx($img);
    $h = imagesy($img);
    $longest = max($w, $h);
    if ($longest <= IMAGING_MAX_EDGE) {
        return $img; // Kleinere Bilder werden nicht hochskaliert.
    }

    $faktor = IMAGING_MAX_EDGE / $longest;
    $neuW = max(1, (int) round($w * $faktor));
    $neuH = max(1, (int) round($h * $faktor));

    $ziel = imagecreatetruecolor($neuW, $neuH);
    imagealphablending($ziel, false);
    imagesavealpha($ziel, true);
    imagecopyresampled($ziel, $img, 0, 0, 0, 0, $neuW, $neuH, $w, $h);
    imagedestroy($img);
    return $ziel;
}

/**
 * Prüft, verkleinert und speichert ein hochgeladenes Bild.
 *
 * @return array{ok: bool, file: string, error: string}
 */
function imaging_process(string $tmpPath, string $targetDir): array
{
    $fehler = static fn(string $text): array => ['ok' => false, 'file' => '', 'error' => $text];

    $caps = imaging_capabilities();
    if (!$caps['gd']) {
        return $fehler('Auf diesem Server fehlt die Bildbibliothek GD. Bitte den Hoster kontaktieren.');
    }

    $groesse = @filesize($tmpPath);
    if ($groesse === false || $groesse === 0) {
        return $fehler('Die Datei ist leer.');
    }
    if ($groesse > IMAGING_MAX_BYTES) {
        return $fehler('Die Datei ist größer als 25 MB.');
    }

    // Typ am Inhalt bestimmen, nicht an der Dateiendung.
    $info = @getimagesize($tmpPath);
    if ($info === false) {
        return $fehler('Das ist keine Bilddatei.');
    }
    [$breite, $hoehe, $typ] = $info;

    if (!in_array($typ, [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP], true)) {
        return $fehler('Nur JPG, PNG und WebP werden unterstützt. Bei iPhone-Fotos: Einstellungen → Kamera → Formate → „Maximale Kompatibilität".');
    }
    if (((int) $breite * (int) $hoehe) > IMAGING_MAX_PIXELS) {
        return $fehler('Das Bild hat zu viele Bildpunkte. Bitte vorher verkleinern.');
    }

    // GD braucht ein Vielfaches der Bildgröße im Speicher.
    @ini_set('memory_limit', '512M');

    $img = imaging_load($tmpPath, $typ);
    if ($img === null) {
        return $fehler('Das Bild konnte nicht gelesen werden.');
    }

    $img = imaging_apply_orientation($img, $tmpPath, $typ);
    $img = imaging_resize($img);

    if (!is_dir($targetDir) && !@mkdir($targetDir, 0755, true) && !is_dir($targetDir)) {
        imagedestroy($img);
        return $fehler('Zielordner konnte nicht angelegt werden.');
    }

    // Zufälliger Dateiname — der Originalname wird bewusst nicht übernommen,
    // er kann Kundennamen oder Ähnliches enthalten.
    $useWebp = $caps['webp'];
    $name = bin2hex(random_bytes(4)) . ($useWebp ? '.webp' : '.jpg');
    $ziel = rtrim($targetDir, '/') . '/' . $name;

    if ($useWebp) {
        $ok = imagewebp($img, $ziel, IMAGING_WEBP_QUALITY);
    } else {
        // Rückfallebene, falls GD ohne WebP gebaut wurde.
        $flach = imagecreatetruecolor(imagesx($img), imagesy($img));
        imagefilledrectangle($flach, 0, 0, imagesx($img), imagesy($img), imagecolorallocate($flach, 255, 255, 255));
        imagecopy($flach, $img, 0, 0, 0, 0, imagesx($img), imagesy($img));
        $ok = imagejpeg($flach, $ziel, IMAGING_JPEG_QUALITY);
        imagedestroy($flach);
    }
    imagedestroy($img);

    if (!$ok) {
        return $fehler('Das Bild konnte nicht gespeichert werden.');
    }
    @chmod($ziel, 0644);
    return ['ok' => true, 'file' => $name, 'error' => ''];
}
