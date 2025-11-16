// =========================
// LOGIN ADMIN
// =========================
const ADMIN_USER = "admin";
const ADMIN_PASS = "12345";

function loginAdmin() {
    let u = document.getElementById("username").value;
    let p = document.getElementById("password").value;

    if (u === ADMIN_USER && p === ADMIN_PASS) {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";
    } else {
        alert("Username atau password salah!");
    }
}

// =========================
// LOAD BERITA DARI LOCALSTORAGE
// =========================
let news = JSON.parse(localStorage.getItem("newsData") || "[]");

// =========================
// SIMPAN BERITA OTOMATIS
// =========================
function saveNews() {
    localStorage.setItem("newsData", JSON.stringify(news));
}

// =========================
// BUAT BERITA (DENGAN GAMBAR BASE64)
// =========================
function addNews() {
    let title = document.getElementById("title").value;
    let content = document.getElementById("content").value;
    let imageFile = document.getElementById("imageUpload").files[0];

    if (!title || !content) {
        alert("Judul dan isi berita wajib diisi!");
        return;
    }

    if (!imageFile) {
        alert("Pilih gambar terlebih dahulu!");
        return;
    }

    let reader = new FileReader();

    reader.onload = function(e) {
        let imgBase64 = e.target.result;

        let newItem = {
            id: Date.now(),
            title: title,
            content: content,
            image: imgBase64,
            comments: []
        };

        news.push(newItem);
        saveNews();
        alert("Berita berhasil diunggah!");
    };

    reader.readAsDataURL(imageFile);
                                            }
