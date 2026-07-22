<?php
declare(strict_types=1);

require __DIR__ . '/auth.php';

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
    <p>Angemeldet. Die Verwaltung der Fotos folgt in den nächsten Schritten.</p>
  </main>
<?php endif; ?>
</body>
</html>
