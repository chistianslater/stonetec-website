<?php
declare(strict_types=1);

require __DIR__ . '/auth.php';
require __DIR__ . '/imaging.php';

// Anzeigenamen der Kategorien — die Schlüssel stammen aus lookbook_store.php,
// die Titel spiegeln die Beschriftung im Frontend.
$kategorieTitel = [
    'badezimmer' => 'Badezimmer',
    'wohnraum'   => 'Wohnraum & Boden',
    'terrasse'   => 'Terrasse & Pool',
    'manufaktur' => 'Keramikmanufaktur',
    'details'    => 'Details & Handwerk',
];

admin_start_session();
admin_ensure_upload_guards();

$fehler = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    if (admin_is_locked()) {
        $minuten = (int) ceil(admin_lock_remaining() / 60);
        $fehler = "Zu viele Fehlversuche. Bitte in {$minuten} Minuten erneut versuchen.";
    } elseif (admin_login((string) ($_POST['password'] ?? ''))) {
        header('Location: index.php');
        exit;
    } else {
        $fehler = 'Passwort falsch.';
    }
}

if (isset($_GET['logout'])) {
    admin_logout();
    header('Location: index.php');
    exit;
}

$angemeldet = admin_is_logged_in();
?>
<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Lookbook verwalten — stonetec</title>
  <link rel="stylesheet" href="admin.css">
</head>
<body>
<?php if (!$angemeldet): ?>
  <main class="login">
    <h1>Lookbook verwalten</h1>
    <?php if ($fehler !== ''): ?>
      <p class="fehler"><?= htmlspecialchars($fehler, ENT_QUOTES, 'UTF-8') ?></p>
    <?php endif; ?>
    <form method="post" autocomplete="off">
      <label for="password">Passwort</label>
      <input type="password" id="password" name="password" required autofocus>
      <button type="submit" name="login" value="1">Anmelden</button>
    </form>
  </main>
<?php else: ?>
  <header class="kopf">
    <h1>Lookbook verwalten</h1>
    <a class="abmelden" href="index.php?logout=1">Abmelden</a>
  </header>
  <main class="inhalt">
    <?php if (isset($_GET['status'])): ?>
      <p class="hinweis"><?= htmlspecialchars((string) $_GET['status'], ENT_QUOTES, 'UTF-8') ?></p>
    <?php endif; ?>

    <?php $caps = imaging_capabilities(); ?>
    <?php if (!$caps['gd']): ?>
      <p class="fehler">Auf diesem Server fehlt die Bildbibliothek GD — Uploads sind nicht möglich. Bitte den Hoster kontaktieren.</p>
    <?php elseif (!$caps['webp']): ?>
      <p class="hinweis">Hinweis: WebP steht nicht zur Verfügung, die Fotos werden als JPG gespeichert.</p>
    <?php endif; ?>

    <form class="upload" method="post" action="actions.php" enctype="multipart/form-data">
      <input type="hidden" name="csrf" value="<?= htmlspecialchars(admin_csrf_token(), ENT_QUOTES, 'UTF-8') ?>">
      <input type="hidden" name="action" value="upload">

      <label for="section">Kategorie</label>
      <select id="section" name="section" required>
        <?php foreach ($kategorieTitel as $key => $titel): ?>
          <option value="<?= htmlspecialchars($key, ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($titel, ENT_QUOTES, 'UTF-8') ?></option>
        <?php endforeach; ?>
      </select>

      <label for="photos">Fotos auswählen</label>
      <input type="file" id="photos" name="photos[]" accept="image/jpeg,image/png,image/webp" multiple required>

      <button type="submit">Hochladen</button>
      <p class="klein">Große Handyfotos sind kein Problem — sie werden automatisch verkleinert und von Standortdaten befreit.</p>
    </form>

    <?php $manifest = lookbook_read(); ?>
    <?php foreach ($kategorieTitel as $key => $titel): ?>
      <section class="kategorie" data-section="<?= htmlspecialchars($key, ENT_QUOTES, 'UTF-8') ?>">
        <h2><?= htmlspecialchars($titel, ENT_QUOTES, 'UTF-8') ?>
          <span class="anzahl"><?= count($manifest['sections'][$key]) ?></span>
        </h2>

        <?php if ($manifest['sections'][$key] === []): ?>
          <p class="klein">Noch keine Fotos in dieser Kategorie.</p>
        <?php else: ?>
          <ul class="fotos">
            <?php foreach ($manifest['sections'][$key] as $img): ?>
              <li class="foto" draggable="true" data-id="<?= htmlspecialchars($img['id'], ENT_QUOTES, 'UTF-8') ?>">
                <img src="<?= htmlspecialchars($img['src'], ENT_QUOTES, 'UTF-8') ?>" alt="" loading="lazy">
                <input
                  type="text"
                  class="caption"
                  value="<?= htmlspecialchars($img['caption'], ENT_QUOTES, 'UTF-8') ?>"
                  placeholder="Bildunterschrift (optional)"
                  maxlength="160"
                  data-id="<?= htmlspecialchars($img['id'], ENT_QUOTES, 'UTF-8') ?>">
                <button type="button" class="loeschen" data-id="<?= htmlspecialchars($img['id'], ENT_QUOTES, 'UTF-8') ?>">Löschen</button>
              </li>
            <?php endforeach; ?>
          </ul>
        <?php endif; ?>
      </section>
    <?php endforeach; ?>

    <div id="statusleiste" class="statusleiste" hidden></div>
    <script>window.ADMIN_CSRF = <?= json_encode(admin_csrf_token()) ?>;</script>
    <script src="admin.js"></script>
  </main>
<?php endif; ?>
</body>
</html>
