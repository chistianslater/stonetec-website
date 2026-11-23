# Lead-Überwachung & Offline-Conversions (StoneTec)

**Stand:** 23.11.2026 · **Anlass:** GA4 zählt seit 30.10.2026 kein `generate_lead` mehr, ohne dass es jemand
bemerkt hat. Ziel: Die Lead-Kette ist nie wieder unbemerkt gebrochen — und Google Ads erfährt von Anfragen
auch dann, wenn GA4/Cookies/Consent ausfallen.

## Aufbau

```
Formular ──► lead.php ──► (1) Lead-Journal  (jede Anfrage, jede Stufe, 90 Tage)
                      ├─► (2) Hero (CRM)    ── bei Fehler: Fallback-Mail an LEAD_FALLBACK_EMAIL
                      └─► (3) GA4 Measurement Protocol  (Ergebnis wird im Journal festgehalten)

lead_health.php (Token) ──► Wächter (täglich)  ──► Telegram bei Abweichung
                        └─► Offline-Upload (täglich) ──► Google Ads (uploadClickConversions)
```

| Baustein | Datei | Aufgabe |
|---|---|---|
| Journal | `public/api/lead_journal.php` | Protokoll pro Anfrage: Eingang, Hero-, GA4-, Mail-Status. Keine Kontaktdaten (auch keine E-Mail-Hashes), nur Klick-ID, Einwilligung, Pfad, Status. Liegt außerhalb von `public_html` (`<home>/lead-journal/`). |
| Fallback | `public/api/lead.php` | Hero down → Anfrage per Mail an `LEAD_FALLBACK_EMAIL`, Besucher sieht Erfolg, GA4-Event wird trotzdem gesendet. |
| Health | `public/api/lead_health.php` | Token-geschützt: Kennzahlen, Konfigurationsstatus, GA4-Debug-Prüfung, Export pro Anfrage. |
| Klick-ID | `src/lib/adsClickId.js` | gclid/gbraid/wbraid aus der URL; Speicherung nur nach Zustimmung. |
| Wächter | `scripts/lead-watchdog.mjs` | Gleicht Journal ↔ GA4 ↔ Ads ab, meldet per Telegram. |
| Upload | `scripts/ads-offline-upload.mjs` | Meldet Anfragen mit Klick-ID + Einwilligung als Offline-Conversion an Ads zurück. |

## Einrichtung

### 1. Server: Konfigurationsdatei außerhalb des Webroots

**Wichtig:** Die Umgebungsvariablen im hPanel gelten bei diesem Hosting (Vite-Publish) nur beim *Build* („variables loaded from .env“),
nicht für PHP zur Laufzeit. Deshalb liest PHP seine Geheimnisse aus einer Datei **neben** `public_html`, die jeden Deploy überlebt
(wie `lookbook-uploads/`): `/home/<user>/domains/stonetec-bocholt.de/lead-config.php`. Anlegen im hPanel-Dateimanager:

```php
<?php return [
    'HERO_API_KEY'        => '…',
    'GA4_API_SECRET'      => '…',
    'GA4_MEASUREMENT_ID'  => 'G-2CWR9BSMGL',
    'LEAD_HEALTH_TOKEN'   => '…',   // openssl rand -hex 24 — nur Hex/Buchstaben, kein "$"
    'LEAD_FALLBACK_EMAIL' => '…',   // Adresse, die Notfall-Anfragen bekommt
    'ADMIN_PW_HASH_B64'   => '…',   // optional, falls das Lookbook-Admin dieselbe Quelle nutzen soll
];
```
Dateirechte 0640. Datei nie committen. Vorlage: `public/api/config.example.php`.

Prüfen nach dem Anlegen (kein Deploy nötig):
```bash
curl -s -H "X-Lead-Token: $LEAD_HEALTH_TOKEN" "https://stonetec-bocholt.de/api/lead_health.php?days=7&check_ga4=1"
```
Erwartet: `config` mit `hero_key_set`, `ga4_secret_set`, `fallback_mail_set`, `private_config_found` alle `true`, `ga4_check.ok: true`. Ohne Token → 401.

### 2. Wächter (Mac mini, täglich)

Umgebung aus einer Datei außerhalb des Repos laden, z. B. `~/.lead-watchdog/env`:
```
LEAD_HEALTH_TOKEN=…
GA4_SERVICE_ACCOUNT_FILE=/pfad/zum/service-account.json   # optional, aktiviert GA4-Abgleich
GOOGLE_ADS_DEVELOPER_TOKEN=… GOOGLE_ADS_CLIENT_ID=… GOOGLE_ADS_CLIENT_SECRET=… GOOGLE_ADS_REFRESH_TOKEN=…  # optional
TELEGRAM_BOT_TOKEN=… TELEGRAM_CHAT_ID=…                  # optional
```
Aufruf: `set -a; . ~/.lead-watchdog/env; set +a; node scripts/lead-watchdog.mjs`

**Mail statt Telegram (Standard bei StoneTec):** Mit `--channel=agent` versendet das Skript selbst nichts, sondern liefert im JSON
`notify`, `subject` und `text`. Ein täglich geplanter Agent-Lauf (T3 „scheduled task“, 08:00) führt es aus und sendet bei
`notify: true` die Mail an christian@schauundhorch.de. Mailweg testen: `--channel=agent --test-mail --dry`.
Exit-Code 0 = ok, 1 = Warnung, 2 = Alarm. Meldungen nur bei Änderung oder nach 24 h Dauerstörung; Entwarnung einmalig.
Trockenlauf ohne Versand/Zustand: `--dry`.

Geprüft werden u. a.: Endpunkt erreichbar, Konfiguration vollständig, Hero-/GA4-Zustellfehler, **verlorene Anfragen** (eingegangen, aber weder Hero noch Mail — auch bei PHP-Abstürzen), keine Leads trotz Traffic,
Journal ↔ GA4 (14-Tage-Fenster, 2 Tage Verzug), Anfragen mit Klick-ID ohne Ads-Conversion.

### 3. Offline-Upload nach Google Ads (erst nach Freigabe)

1. Trockenlauf: `node scripts/ads-offline-upload.mjs --create-action` (validateOnly, ändert nichts).
2. Anlegen: `… --create-action --apply` → Conversion-Aktion „StoneTec Lead (Server)", **sekundär** (steuert kein Bidding).
3. Die ID aus `resourceName` als `ADS_OFFLINE_CONVERSION_ACTION_ID` setzen.
4. `node scripts/ads-offline-upload.mjs` (zeigt, was hochgeladen würde) → `--validate` → `--apply`.
5. Nach einigen Wochen vergleichen: stimmen Journal, GA4 und Offline-Upload überein? **Erst dann** entscheiden, ob die Server-Aktion
   die primäre Lead-Conversion wird (und `generate_lead` aus GA4 auf sekundär geht) — niemals beide primär (Doppelzählung).

## Datenschutz

- Journal: nur Klick-ID, Einwilligungsstand, Landingpage-Pfad und Status; **keine** Kontaktdaten und keine E-Mail-Hashes; Tagesdateien, Löschung nach 90 Tagen. Dateirechte 0640, Ordner außerhalb des Webroots.
- Klick-ID im Browser: Arbeitsspeicher; `sessionStorage` nur nach „Alle akzeptieren".
- Offline-Upload nur für Anfragen mit `consent = accepted`.
- Die Datenschutzerklärung sollte die serverseitige Protokollierung (Zweck: Zustellung/Fehlerprüfung, 90 Tage) und den
  Conversion-Upload an Google erwähnen — bitte mit Tim/Datenschutz abstimmen.

## Bekannte Grenzen

- **Das GA4-Secret wird nicht auf Gültigkeit geprüft:** Measurement Protocol antwortet auch bei falschem Secret mit 2xx, ebenso der Debug-Endpunkt. Ob GA4 die Events wirklich zählt, belegt nur der Abgleich Journal ↔ GA4-Report im Wächter — er braucht deshalb `GA4_SERVICE_ACCOUNT_FILE`. Ist er eingerichtet, aber nicht abrufbar, warnt der Wächter.
- Der Health-Endpunkt hat kein Rate-Limit (Token ≥ 24 Zeichen, `hash_equals`); bei Bedarf serverseitig drosseln.
- Ohne Einwilligung sendet der Server das GA4-Event weiterhin (wie bisher, mit zufälliger client_id); mit der Datenschutzerklärung abstimmen.
- Nur zugestellt über die Fallback-Mail = Lead zählt als Conversion, steht aber nicht in Hero.

- Hero-Schlüssel wird nicht aktiv geprüft (keine bekannte schreibfreie Hero-Abfrage); Ausfälle zeigt das Journal erst mit der nächsten echten Anfrage.
  Ein Ausbleiben von Anfragen erkennt der Wächter über „keine Leads trotz Traffic".
- Der Offline-Upload ist gegen die Live-API **nicht** getestet; deshalb zuerst `--create-action` und `--validate` (validateOnly).
- Ohne Einwilligung bleibt die Anfrage im Journal (Wahrheit für Zählung), geht aber nicht an Google.
