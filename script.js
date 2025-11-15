// Convert gambar ke Base64
function convertToBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
}

// Simpan berita
if (document.getElementById("simpanBerita")) {
    document.getElementById("simpanBerita").onclick = () => {
        const judul = document.getElementById("judul").value;
        const konten = document.getElementById("konten").value;
        const gambar = document.getElementById("gambar").files[0];

        if (!judul || !konten) {
            alert("Isi judul dan berita!");
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
            window.location.href = "index.html";
        });
    };
}

// Tampilkan daftar berita di halaman utama
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

// Buka halaman detail
function openDetail(id) {
    localStorage.setItem("detailId", id);
    window.location.href = "detail.html";
}

// Tampilkan detail berita
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
