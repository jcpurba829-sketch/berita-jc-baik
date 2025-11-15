const ADMIN_PASSWORD = "admin123";

// Area login
window.login = function () {
    let pw = document.getElementById("password").value;

    if (pw === ADMIN_PASSWORD) {
        document.getElementById("login-box").style.display = "none";
        document.getElementById("editor").style.display = "block";
    } else {
        document.getElementById("wrong").style.display = "block";
    }
};

// Load berita
let berita = JSON.parse(localStorage.getItem("berita_tbj")) || [];
let daftar = document.getElementById("daftar-admin");

// Tambah berita
window.tambahBerita = function () {
    let judul = document.getElementById("judul").value;
    let isi = document.getElementById("isi").value;
    let gambarFile = document.getElementById("gambar").files[0];

    if (!judul || !isi || !gambarFile) {
        alert("Lengkapi semua data!");
        return;
    }

    let reader = new FileReader();
    reader.onload = function (e) {
        berita.push({
            judul: judul,
            isi: isi,
            gambar: e.target.result
        });

        localStorage.setItem("berita_tbj", JSON.stringify(berita));
        tampilkanAdmin();
        alert("Berita berhasil ditambah!");
    };

    reader.readAsDataURL(gambarFile);
};

// Tampilkan berita di admin
function tampilkanAdmin() {
    daftar.innerHTML = "";

    berita.forEach((b, i) => {
        let div = document.createElement("div");
        div.className = "news-card";

        div.innerHTML = `
            <img src="${b.gambar}">
            <h3>${b.judul}</h3>
            <button onclick="hapusBerita(${i})">Hapus</button>
        `;

        daftar.appendChild(div);
    });
}

window.hapusBerita = function (i) {
    if (confirm("Yakin hapus berita ini?")) {
        berita.splice(i, 1);
        localStorage.setItem("berita_tbj", JSON.stringify(berita));
        tampilkanAdmin();
    }
};

tampilkanAdmin();
