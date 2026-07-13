<?php
// Vorlage. Kopiere diese Datei auf dem Server zu `config.php` (im selben Ordner)
// und trage den echten Hero-API-Key ein. `config.php` wird NICHT committet.
// Alternativ kann der Key als Umgebungsvariable HERO_API_KEY gesetzt werden.
return [
    'HERO_API_KEY' => 'hier-den-hero-api-key-eintragen',

    // GA4 Measurement Protocol – serverseitiges `generate_lead`-Conversion-Tracking.
    // Secret in GA4 erstellen: Verwaltung → Datenströme → (Web-Stream stonetec) →
    // "Measurement Protocol API secrets" → Erstellen. Danach hier eintragen.
    'GA4_MEASUREMENT_ID' => 'G-2CWR9BSMGL',
    'GA4_API_SECRET' => 'hier-das-ga4-measurement-protocol-secret-eintragen',
];
