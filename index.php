<?php
/*
  index.php
  Single-file Web Berita (in-memory only)
  - Semua data hanya ada di memori (array PHP)
  - Data BERITA & KOMENTAR akan hilang setelah reload / request baru
  - Tidak menggunakan JSON, file, database, atau Firebase
  - Admin login sederhana menggunakan session (password hardcode)

  Cara pakai: simpan sebagai index.php dan buka di localhost / hosting PHP.
*/
session_start();

// ---------- CONFIG ---------- //
$ADMIN_PASSWORD = 'admin123'; // ganti kalau mau

// ---------- SEED DATA (in-memory) ---------- //
// Mulai dengan satu sample artikel untuk demo. Semua perubahan hanya berlaku pada request sekarang.
$articles = [
    [
        'id' => 1,
        'title' => 'Selamat Datang di Web Berita (Demo)',
        'content' => "Ini adalah contoh berita. Data hanya tersimpan di memori dan akan hilang setelah reload.",
        'author' => 'Redaksi',
        'created_at' => date('Y-m-d H:i:s'),
        'comments' => [
            [ 'id' => 101, 'name' => 'Pembaca', 'text' => 'Bagus, terima kasih!', 'time' => date('Y-m-d H:i:s') ],
        ],
    ],
];

// helper untuk menemukan index artikel di array berdasarkan id
function find_article_index(&$arr, $id) {
    foreach ($arr as $i => $a) {
        if ($a['id'] == $id) return $i;
    }
    return false;
}

// ---------- HANDLE AUTH ---------- //
if (isset($_POST['login'])) {
    if (isset($_POST['password']) && $_POST['password'] === $ADMIN_PASSWORD) {
        $_SESSION['is_admin'] = true;
        $flash = 'Berhasil login sebagai admin.';
    } else {
        $flash = 'Password admin salah.';
    }
}
if (isset($_GET['logout'])) {
    unset($_SESSION['is_admin']);
    $flash = 'Logout berhasil.';
}

// ---------- HANDLE ACTIONS (only affect current request) ---------- //
// Note: Because we keep $articles purely in memory, setiap aksi hanya terlihat sampai browser melakukan request baru.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // create article (admin only)
    if (isset($_POST['action']) && $_POST['action'] === 'create_article' && !empty($_SESSION['is_admin'])) {
        $newId = rand(1000, 9999); // id sederhana
        $articles[] = [
            'id' => $newId,
            'title' => trim($_POST['title'] ?? ''),
            'content' => trim($_POST['content'] ?? ''),
            'author' => 'Admin',
            'created_at' => date('Y-m-d H:i:s'),
            'comments' => [],
        ];
        $flash = 'Berita baru ditambahkan (sementara, di memori).';
    }

    // delete article (admin only)
    if (isset($_POST['action']) && $_POST['action'] === 'delete_article' && !empty($_SESSION['is_admin'])) {
        $aid = intval($_POST['article_id']);
        $idx = find_article_index($articles, $aid);
        if ($idx !== false) {
            array_splice($articles, $idx, 1);
            $flash = 'Berita dihapus (sementara, di memori).';
        }
    }

    // add comment (public)
    if (isset($_POST['action']) && $_POST['action'] === 'add_comment') {
        $aid = intval($_POST['article_id']);
        $idx = find_article_index($articles, $aid);
        if ($idx !== false) {
            $articles[$idx]['comments'][] = [
                'id' => rand(2000, 9999),
                'name' => trim($_POST['name']) ?: 'Anonim',
                'text' => trim($_POST['comment']) ?: '',
                'time' => date('Y-m-d H:i:s'),
            ];
            $flash = 'Komentar ditambahkan (sementara, di memori).';
        }
    }
}
?><!doctype html>

<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Web Berita - Demo (In-memory)</title>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;background:#f3f4f6;margin:0;padding:20px}
    .container{max-width:900px;margin:0 auto}
    header{display:flex;justify-content:space-between;align-items:center}
    .card{background:#fff;padding:16px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.06);margin-bottom:16px}
    input,textarea,button{font-family:inherit}
    input,textarea{width:100%;padding:8px;margin-top:6px;border:1px solid #ddd;border-radius:6px}
    button{padding:8px 12px;border-radius:6px;border:0;background:#2b6cb0;color:#fff;cursor:pointer}
    .small{font-size:13px;color:#6b7280}
    .muted{color:#6b7280}
    .admin-badge{background:#e6fffa;color:#065f46;padding:4px 8px;border-radius:999px;font-weight:600}
    .danger{background:#fff1f2;color:#b91c1c;border:1px solid #fecaca;padding:6px;border-radius:6px}
    .flex{display:flex;gap:8px}
    .row{display:flex;gap:8px}
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>Web Berita — Demo (In-memory)</h1>
        <div class="small">Admin dapat membuat/hapus berita; komentar untuk publik. Semua perubahan hilang setelah reload.</div>
      </div>
      <div>
        <?php if (!empty($_SESSION['is_admin'])): ?>
          <span class="admin-badge">Admin</span>
          <a href="?logout" style="margin-left:10px;text-decoration:none;" class="small">Logout</a>
        <?php else: ?>
          <form method="POST" style="display:flex;gap:8px;align-items:center">
            <input type="password" name="password" placeholder="Password admin" style="width:150px">
            <button name="login">Masuk</button>
          </form>
        <?php endif; ?>
      </div>
    </header><?php if (isset($flash)): ?>
  <div class="card" style="border-left:4px solid #f59e0b"><b><?= htmlspecialchars($flash) ?></b></div>
<?php endif; ?>

<main>
  <div class="card">
    <h2>Buat Berita</h2>
    <?php if (!empty($_SESSION['is_admin'])): ?>
      <form method="POST">
        <input type="hidden" name="action" value="create_article">
        <label>Judul</label>
        <input name="title" required>
        <label style="margin-top:8px">Isi</label>
        <textarea name="content" rows="4" required></textarea>
        <div style="margin-top:8px"><button type="submit">Buat Berita</button></div>
      </form>
    <?php else: ?>
      <div class="muted">Masuk sebagai admin untuk membuat berita.</div>
    <?php endif; ?>
  </div>

  <section>
    <?php if (empty($articles)): ?>
      <div class="card">Belum ada berita.</div>
    <?php else: foreach ($articles as $art): ?>
      <article class="card">
        <div style="display:flex;justify-content:space-between;align-items:start">
          <div>
            <h3><?= htmlspecialchars($art['title']) ?></h3>
            <div class="small">Oleh <?= htmlspecialchars($art['author']) ?> • <?= htmlspecialchars($art['created_at']) ?></div>
          </div>
          <?php if (!empty($_SESSION['is_admin'])): ?>
            <form method="POST" onsubmit="return confirm('Hapus berita ini?');">
              <input type="hidden" name="action" value="delete_article">
              <input type="hidden" name="article_id" value="<?= $art['id'] ?>">
              <button type="submit" class="danger">Hapus</button>
            </form>
          <?php endif; ?>
        </div>

        <div style="margin-top:12px;white-space:pre-wrap"><?= htmlspecialchars($art['content']) ?></div>

        <div style="margin-top:14px;border-top:1px solid #eee;padding-top:12px">
          <h4>Komentar (<?= count($art['comments']) ?>)</h4>

          <?php if (!empty($art['comments'])): foreach ($art['comments'] as $c): ?>
            <div style="background:#f8fafc;padding:8px;border-radius:6px;margin-top:8px">
              <div class="small"><b><?= htmlspecialchars($c['name']) ?></b> • <span class="muted"><?= htmlspecialchars($c['time']) ?></span></div>
              <div style="margin-top:4px"><?= htmlspecialchars($c['text']) ?></div>
            </div>
          <?php endforeach; endif; ?>

          <form method="POST" style="margin-top:10px">
            <input type="hidden" name="action" value="add_comment">
            <input type="hidden" name="article_id" value="<?= $art['id'] ?>">
            <input name="name" placeholder="Nama (opsional)" style="margin-bottom:6px;">
            <textarea name="comment" rows="2" placeholder="Tulis komentar..." required></textarea>
            <div style="margin-top:6px"><button type="submit">Kirim Komentar</button></div>
          </form>
        </div>
      </article>
    <?php endforeach; endif; ?>
  </section>
</main>

<footer style="text-align:center;margin-top:20px;color:#6b7280">&copy; <?= date('Y') ?> Web Berita — Demo (in-memory)</footer>

  </div>
</body>
</html>
