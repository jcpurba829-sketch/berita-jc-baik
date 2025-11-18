import React, { useEffect, useState } from "react";

// Single-file React app (default export) for a simple news site with: // - Admin-only create & delete news // - Public comments per article // - Persistence via localStorage // - Tailwind CSS utility classes used for styling // To use: paste this file into a React project (e.g. create-react-app or Vite + React), // ensure Tailwind CSS is set up, then import and render <App /> in index.jsx.

export default function App() { // Admin state (simple password check). In a real app use proper auth. const [isAdmin, setIsAdmin] = useState(false); const [adminPasswordInput, setAdminPasswordInput] = useState("");

// Articles state const [articles, setArticles] = useState([]);

// New article form state const [newTitle, setNewTitle] = useState(""); const [newSummary, setNewSummary] = useState(""); const [newContent, setNewContent] = useState("");

// UI helpers const [flash, setFlash] = useState(null);

const LOCAL_KEY = "webberita_articles_v1"; const ADMIN_KEY = "webberita_admin_v1"; const ADMIN_PASSWORD = "admin123"; // change this in production

// Load from localStorage useEffect(() => { const raw = localStorage.getItem(LOCAL_KEY); if (raw) { try { setArticles(JSON.parse(raw)); } catch (e) { console.error("Failed to parse stored articles", e); } } else { // seed sample article const seed = [ { id: Date.now(), title: "Selamat Datang di WebBerita", summary: "Portal demo. Admin dapat membuat & menghapus berita. Ada fitur komentar.", content: "Ini adalah contoh artikel. Anda bisa menulis berita lengkap di kolom admin. Komentar tersedia untuk setiap artikel.", author: "Redaksi", createdAt: new Date().toISOString(), comments: [ { id: 1, name: "Pembaca", text: "Keren! Fitur ini sangat membantu.", createdAt: new Date().toISOString(), }, ], }, ]; setArticles(seed); }

const adminFlag = localStorage.getItem(ADMIN_KEY) === "true";
setIsAdmin(adminFlag);

}, []);

// Persist to localStorage useEffect(() => { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(articles)); } catch (e) { console.error("Failed to store articles", e); } }, [articles]);

useEffect(() => { localStorage.setItem(ADMIN_KEY, isAdmin ? "true" : "false"); }, [isAdmin]);

function showFlash(message, ms = 2500) { setFlash(message); setTimeout(() => setFlash(null), ms); }

// Admin login (very simple) function handleAdminLogin(e) { e.preventDefault(); if (adminPasswordInput === ADMIN_PASSWORD) { setIsAdmin(true); setAdminPasswordInput(""); showFlash("Masuk sebagai admin"); } else { showFlash("Password admin salah", 2500); } }

function handleAdminLogout() { setIsAdmin(false); showFlash("Keluar dari admin"); }

// Create article (admin only) function handleCreateArticle(e) { e.preventDefault(); if (!isAdmin) return showFlash("Hanya admin yang bisa membuat berita"); if (!newTitle.trim() || !newContent.trim()) return showFlash("Judul & isi wajib diisi");

const article = {
  id: Date.now(),
  title: newTitle.trim(),
  summary: newSummary.trim(),
  content: newContent.trim(),
  author: "Admin",
  createdAt: new Date().toISOString(),
  comments: [],
};

setArticles((s) => [article, ...s]);
setNewTitle("");
setNewSummary("");
setNewContent("");
showFlash("Berita berhasil dibuat");

}

// Delete article (admin only) function handleDeleteArticle(id) { if (!isAdmin) return showFlash("Hanya admin yang bisa menghapus berita"); if (!confirm("Hapus berita ini? Aksi tidak dapat dibatalkan.")) return;

setArticles((s) => s.filter((a) => a.id !== id));
showFlash("Berita dihapus");

}

// Add comment function handleAddComment(articleId, name, text, resetFn) { if (!text.trim()) { return showFlash("Komentar kosong tidak boleh"); }

setArticles((prev) =>
  prev.map((a) => {
    if (a.id !== articleId) return a;
    const next = {
      ...a,
      comments: [
        ...a.comments,
        { id: Date.now(), name: name.trim() || "Anonim", text: text.trim(), createdAt: new Date().toISOString() },
      ],
    };
    return next;
  })
);
resetFn();
showFlash("Komentar ditambahkan");

}

// Delete comment (admin only) function handleDeleteComment(articleId, commentId) { if (!isAdmin) return showFlash("Hanya admin yang bisa menghapus komentar"); if (!confirm("Hapus komentar ini?")) return;

setArticles((prev) =>
  prev.map((a) => {
    if (a.id !== articleId) return a;
    return { ...a, comments: a.comments.filter((c) => c.id !== commentId) };
  })
);
showFlash("Komentar dihapus");

}

return ( <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans"> <div className="max-w-5xl mx-auto"> {/* Header */} <header className="flex items-center justify-between mb-8"> <div> <h1 className="text-3xl md:text-4xl font-extrabold">WebBerita — Demo</h1> <p className="text-sm text-gray-600">Hanya admin yang membuat / menghapus berita. Semua orang boleh komentar.</p> </div>

<div className="flex items-center gap-4">
        {isAdmin ? (
          <>
            <span className="px-3 py-1 rounded bg-green-100 text-green-800 text-sm">Admin</span>
            <button
              onClick={handleAdminLogout}
              className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-100 text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <form onSubmit={handleAdminLogin} className="flex gap-2 items-center">
            <input
              type="password"
              placeholder="Password admin"
              value={adminPasswordInput}
              onChange={(e) => setAdminPasswordInput(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
            />
            <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white text-sm">Masuk</button>
          </form>
        )}
      </div>
    </header>

    {/* Flash */}
    {flash && (
      <div className="mb-4 px-4 py-2 rounded bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">{flash}</div>
    )}

    <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left/center: Articles */}
      <section className="md:col-span-2">
        {articles.length === 0 ? (
          <div className="p-6 bg-white rounded shadow">Belum ada berita.</div>
        ) : (
          articles.map((a) => <ArticleCard key={a.id} article={a} isAdmin={isAdmin} onDelete={handleDeleteArticle} onDeleteComment={handleDeleteComment} onAddComment={handleAddComment} />)
        )}
      </section>

      {/* Right: Admin panel + About */}
      <aside>
        <div className="sticky top-6 space-y-4">
          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold mb-2">Panel Admin</h3>
            {isAdmin ? (
              <div className="space-y-2">
                <form onSubmit={handleCreateArticle}>
                  <label className="text-sm">Judul</label>
                  <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full px-3 py-2 border rounded mt-1 mb-2 text-sm" />

                  <label className="text-sm">Ringkasan (opsional)</label>
                  <input value={newSummary} onChange={(e) => setNewSummary(e.target.value)} className="w-full px-3 py-2 border rounded mt-1 mb-2 text-sm" />

                  <label className="text-sm">Isi</label>
                  <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={4} className="w-full px-3 py-2 border rounded mt-1 mb-3 text-sm" />

                  <div className="flex gap-2">
                    <button type="submit" className="px-3 py-2 rounded bg-indigo-600 text-white text-sm">Buat Berita</button>
                    <button type="button" onClick={() => { setNewTitle(""); setNewSummary(""); setNewContent(""); }} className="px-3 py-2 rounded border text-sm">Batal</button>
                  </div>
                </form>

                <p className="text-xs text-gray-500 mt-2">Tip: Password admin demo adalah <code className="bg-gray-100 px-1 rounded">admin123</code>. Ganti di kode untuk produksi.</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Masuk sebagai admin untuk membuat atau menghapus berita.</p>
            )}
          </div>

          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold mb-2">Tentang</h3>
            <p className="text-sm text-gray-600">Demo aplikasi berita sederhana. Data disimpan pada browser (localStorage). Untuk produksi, hubungkan ke backend dengan otentikasi nyata.</p>
          </div>
        </div>
      </aside>
    </main>

    <footer className="mt-12 text-center text-gray-500 text-sm">© {new Date().getFullYear()} WebBerita — Demo</footer>
  </div>
</div>

); }

function ArticleCard({ article, isAdmin, onDelete, onAddComment, onDeleteComment }) { const [showFull, setShowFull] = useState(false); const [commentName, setCommentName] = useState(""); const [commentText, setCommentText] = useState("");

function resetCommentForm() { setCommentName(""); setCommentText(""); }

return ( <article className="mb-6 bg-white p-6 rounded shadow"> <div className="flex items-start justify-between gap-4"> <div> <h2 className="text-xl font-semibold">{article.title}</h2> <div className="text-sm text-gray-500">{article.author} · {new Date(article.createdAt).toLocaleString()}</div> </div>

{isAdmin && (
      <div className="flex items-center gap-2">
        <button onClick={() => onDelete(article.id)} className="text-sm px-3 py-1 rounded border hover:bg-red-50 text-red-600">Hapus</button>
      </div>
    )}
  </div>

  <p className="mt-3 text-gray-700">{article.summary || (article.content.length > 180 ? article.content.slice(0, 180) + "..." : article.content)}</p>

  {article.content && article.content.length > 0 && (
    <div className="mt-3">
      {!showFull ? (
        article.content.length > 300 ? (
          <button onClick={() => setShowFull(true)} className="text-sm text-blue-600">Baca selengkapnya</button>
        ) : (
          <p className="text-gray-700 mt-2">{article.content}</p>
        )
      ) : (
        <div className="mt-2 text-gray-700">
          <p>{article.content}</p>
          <button onClick={() => setShowFull(false)} className="text-sm text-blue-600 mt-2">Tutup</button>
        </div>
      )}
    </div>
  )}

  {/* Comments */}
  <div className="mt-4 border-t pt-4">
    <h4 className="font-semibold">Komentar ({article.comments.length})</h4>

    {article.comments.length === 0 ? (
      <p className="text-sm text-gray-500 mt-2">Belum ada komentar. Jadilah yang pertama!</p>
    ) : (
      <ul className="space-y-3 mt-3">
        {article.comments.map((c) => (
          <li key={c.id} className="bg-gray-50 p-3 rounded">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
              </div>
              {isAdmin && (
                <button onClick={() => onDeleteComment(article.id, c.id)} className="text-xs text-red-600">hapus</button>
              )}
            </div>
            <p className="mt-2 text-gray-700">{c.text}</p>
          </li>
        ))}
      </ul>
    )}

    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAddComment(article.id, commentName, commentText, resetCommentForm);
      }}
      className="mt-4"
    >
      <label className="text-sm">Nama</label>
      <input value={commentName} onChange={(e) => setCommentName(e.target.value)} className="w-full px-3 py-2 border rounded mt-1 text-sm" placeholder="Nama (opsional)" />

      <label className="text-sm mt-2">Komentar</label>
      <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded mt-1 text-sm" placeholder="Tulis komentar..."></textarea>

      <div className="mt-2 flex gap-2">
        <button type="submit" className="px-3 py-2 rounded bg-green-600 text-white text-sm">Kirim</button>
        <button type="button" onClick={resetCommentForm} className="px-3 py-2 rounded border text-sm">Bersihkan</button>
      </div>
    </form>
  </div>
</article>

); }
