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

### 1. Server (Hostinger → Umgebungsvariablen, dann deployen)

| Variable | Wert |
|---|---|
| `LEAD_HEALTH_TOKEN` | Zufallswert, mind. 24 Zeichen: `openssl rand -hex 24` |
| `LEAD_FALLBACK_EMAIL` | Adresse, die Notfall-Anfragen bekommt (z. B. Tims Postfach) |

Hinweis: Hostinger zerstört `$` in Umgebungsvariablen (siehe Admin-Hash-Commit) — nur Hex/Buchstaben verwenden.

Prüfen nach dem Deploy:
```bash
curl -s -H "X-Lead-Token: $LEAD_HEALTH_TOKEN" "https://stonetec-bocholt.de/api/lead_health.php?days=7&check_ga4=1"
```
Erwartet: `config` mit vier `true`, `ga4_check.ok: true`. Ohne Token → 401.

### 2. Wächter (Mac mini, täglich)

Umgebung aus einer Datei außerhalb des Repos laden, z. B. `~/.lead-watchdog/env`:
```
LEAD_HEALTH_TOKEN=…
GA4_SERVICE_ACCOUNT_FILE=/pfad/zum/service-account.json   # optional, aktiviert GA4-Abgleich
GOOGLE_ADS_DEVELOPER_TOKEN=… GOOGLE_ADS_CLIENT_ID=… GOOGLE_ADS_CLIENT_SECRET=… GOOGLE_ADS_REFRESH_TOKEN=…  # optional
TELEGRAM_BOT_TOKEN=… TELEGRAM_CHAT_ID=…                  # optional
```
Aufruf (z. B. LaunchAgent täglich 08:00): `set -a; . ~/.lead-watchdog/env; set +a; node scripts/lead-watchdog.mjs`
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
