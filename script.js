const beritaContainer = document.getElementById("berita-container");

// Contoh data berita
const dataBerita = [
    {
        judul: "Judul Berita Pertama",
        isi: "Isi berita pertama yang kamu tulis sendiri di sini..."
    },
    {
        judul: "Judul Berita Kedua",
        isi: "Isi berita kedua..."
    }
];

// Tampilkan berita
beritaContainer.innerHTML = "";
dataBerita.forEach(berita => {
    const box = document.createElement("div");
    box.className = "berita-box";
    box.innerHTML = `
        <h2>${berita.judul}</h2>
        <p>${berita.isi}</p>
    `;
    beritaContainer.appendChild(box);
});
