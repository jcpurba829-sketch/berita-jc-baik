// =========================
// PASSWORD ADMIN
// =========================
const ADMIN_PASSWORD = "tbj123"; // Ubah password sesuai keinginan

function loginAdmin() {
    const input = document.getElementById("adminPassword").value;

    if (input === ADMIN_PASSWORD) {
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";
        loadAdminBerita();
    } else {
        alert("Password salah!");
    }
}

// =========================
// KONVERSI GAMBAR KE BASE64
// =========================
function convertToBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
}

// =========================
// SIMPAN BERITA (ADMIN)
// =========================
if (document.getElementById("simpanBerita")) {
    document.getElementById("simpanBerita").onclick = () => {
        const judul = document.getElementById("judul").value;
        const konten = document.getElementById("konten").value;
        const gambar = document.getElementById("gambar").files[0];

        if (!judul || !konten || !gambar) {
            alert("Isi semua data berita!");
            return;
        }

        convertToBase64(gambar, (img) => {
            const berita = JSON.parse(localStorage.getItem("berita")) || [];

            berita.push({
                id: Date.now(),
                judul,
                konten,
                gambar: img
            });

            localStorage.setItem("berita", JSON.stringify(berita));
            alert("Berita berhasil ditambahkan!");
            window.location.href = "admin.html";
        });
    };
}

// =========================
// LOAD BERITA UNTUK ADMIN
// =========================
function loadAdminBerita() {
    const list = document.getElementById("adminBeritaList");
    if (!list) return;

    list.innerHTML = "";
    const berita = JSON.parse(localStorage.getItem("berita")) || [];

    berita.forEach(item => {
        list.innerHTML += `
            <div class="card">
                <img src="${item.gambar}">
                <h3>${item.judul}</h3>
                <button class="delete-btn" onclick="hapusBerita(${item.id})">Hapus</button>
            </div>
        `;
    });
}

// =========================
// HAPUS BERITA
// =========================
function hapusBerita(id) {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;

    let berita = JSON.parse(localStorage.getItem("berita")) || [];
    berita = berita.filter(b => b.id !== id);

    localStorage.setItem("berita", JSON.stringify(berita));
    alert("Berita berhasil dihapus!");
    location.reload();
}

// =========================
// TAMPILKAN BERITA DI HALAMAN UTAMA
// =========================
if (document.getElementById("beritaContainer")) {
    const box = document.getElementById("beritaContainer");
    const berita = JSON.parse(localStorage.getItem("berita")) || [];

    berita.reverse().forEach(item => {
        box.innerHTML += `
            <div class="card" onclick="openDetail(${item.id})">
                <img src="${item.gambar}">
                <h3>${item.judul}</h3>
            </div>
        `;
    });
}

// =========================
// BUKA DETAIL
// =========================
function openDetail(id) {
    localStorage.setItem("detailId", id);
    window.location.href = "detail.html";
}

// =========================
// TAMPILKAN DETAIL BERITA
// =========================
if (document.getElementById("detailContainer")) {
    const id = localStorage.getItem("detailId");
    const berita = JSON.parse(localStorage.getItem("berita")) || [];
    const item = berita.find(b => b.id == id);

    document.getElementById("detailContainer").innerHTML = `
        <h2>${item.judul}</h2>
        <img src="${item.gambar}" class="detail-img">
        <p>${item.konten}</p>
    `;
                        }
