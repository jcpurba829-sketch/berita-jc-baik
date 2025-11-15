const ADMIN_PASSWORD = "admin123";

let beritaList = JSON.parse(localStorage.getItem("berita")) || [];

const beritaContainer = document.getElementById("berita-container");
const loginPopup = document.getElementById("loginPopup");
const addPopup = document.getElementById("addPopup");

function convertToBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
}

function tampilkanBerita() {
    beritaContainer.innerHTML = "";

    beritaList.forEach((b, i) => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${b.gambar}">
            <h3>${b.judul}</h3>
            <p>${b.isi.substring(0, 70)}...</p>
        `;

        card.onclick = () => {
            window.location.href = `detail.html?id=${i}`;
        };

        beritaContainer.appendChild(card);
    });
}

document.getElementById("adminBtn").onclick = () => {
    loginPopup.style.display = "flex";
};

document.getElementById("closePopup").onclick = () =>
    loginPopup.style.display = "none";

document.getElementById("closeAdd").onclick = () =>
    addPopup.style.display = "none";

document.getElementById("login").onclick = () => {
    let pw = document.getElementById("password").value;

    if (pw === ADMIN_PASSWORD) {
        loginPopup.style.display = "none";
        addPopup.style.display = "flex";
    } else {
        alert("Password salah!");
    }
};

document.getElementById("simpanBerita").onclick = () => {
    const judul = document.getElementById("judul").value;
    const isi = document.getElementById("isi").value;
    const file = document.getElementById("gambar").files[0];

    if (!judul || !isi) {
        alert("Isi judul dan berita!");
        return;
    }

    if (!file) {
        alert("Pilih gambar!");
        return;
    }

    convertToBase64(file, (base64) => {
        beritaList.push({
            judul,
            isi,
            gambar: base64
        });

        localStorage.setItem("berita", JSON.stringify(beritaList));
        addPopup.style.display = "none";
        tampilkanBerita();
    });
};

tampilkanBerita();
