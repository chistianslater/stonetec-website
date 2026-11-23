<?php
// Vorlage. EMPFOHLEN auf Hostinger: als `lead-config.php` im Ordner ÜBER public_html
// ablegen (<home>/domains/<domain>/lead-config.php, neben lookbook-uploads/). Dort
// überlebt sie jeden Deploy. Die Umgebungsvariablen im hPanel gelten bei Vite-Publish
// nur beim Bauen, nicht für PHP zur Laufzeit.
// Alternativ `config.php` in diesem Ordner — wird bei einem Deploy aber überschrieben.
// Nichts davon wird committet.
return [
    'HERO_API_KEY' => 'hier-den-hero-api-key-eintragen',

    // GA4 Measurement Protocol – serverseitiges `generate_lead`-Conversion-Tracking.
    // Secret in GA4 erstellen: Verwaltung → Datenströme → (Web-Stream stonetec) →
    // "Measurement Protocol API secrets" → Erstellen. Danach hier eintragen.
    'GA4_MEASUREMENT_ID' => 'G-2CWR9BSMGL',
    'GA4_API_SECRET' => 'hier-das-ga4-measurement-protocol-secret-eintragen',

    // Zugang zum Lookbook-Admin unter /admin/.
    // Hash erzeugen (lokal oder auf dem Server):
    //   php -r "echo password_hash('DEIN-PASSWORT', PASSWORD_DEFAULT), PHP_EOL;"
    // Der erzeugte Hash beginnt mit $2y$ — das Klartext-Passwort steht nirgends.
    // Lead-Überwachung (siehe docs/ads/2026-11-23-lead-monitoring.md)
    'LEAD_HEALTH_TOKEN'   => 'zufallswert-mind-24-zeichen',   // openssl rand -hex 24
    'LEAD_FALLBACK_EMAIL' => 'anfragen@beispiel.de',

    'ADMIN_PW_HASH' => 'hier-den-bcrypt-hash-eintragen',
];
