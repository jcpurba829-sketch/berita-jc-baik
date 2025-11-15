// Ambil berita dari localStorage
let berita = JSON.parse(localStorage.getItem("berita_tbj")) || [];

// Container
let list = document.getElementById("news-list");

// Render Berita
function tampilkanBerita() {
    list.innerHTML = "";

    berita.forEach((b, i) => {
        let card = document.createElement("div");
        card.className = "news-card";

        card.innerHTML = `
            <img src="${b.gambar}" alt="">
            <h3>${b.judul}</h3>
            <p>${b.isi.substring(0, 80)}...</p>
        `;

        card.onclick = () => {
            alert(
                "Judul: " + b.judul + "\n\n" +
                "Berita:\n" + b.isi
            );
        };

        list.appendChild(card);
    });
}

tampilkanBerita();
