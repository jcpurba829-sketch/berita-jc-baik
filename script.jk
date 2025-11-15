// Password admin
const ADMIN_PASSWORD = "admin123";

// Ambil berita dari localStorage
let beritaList = JSON.parse(localStorage.getItem("berita")) || [];

// Elemen
const beritaContainer = document.getElementById("berita-container");
const loginPopup = document.getElementById("loginPopup");
const addPopup = document.getElementById("addPopup");

// Tampilkan semua berita
function tampilkanBerita() {
    beritaContainer.innerHTML = "";
    beritaList.forEach((b, i) => {
        const box = document.createElement("div");
        box.className = "berita-box";
        box.innerHTML = `
            <h3>${b.judul}</h3>
            <p>${b.isi}</p>
        `;
        beritaContainer.appendChild(box);
    });
}

// Login admin
document.getElementById("adminBtn").onclick = () => {
    loginPopup.style.display = "flex";
};

document.getElementById("closePopup").onclick = () => {
    loginPopup.style.display = "none";
};

document.getElementById("login").onclick = () => {
    let pw = document.getElementById("password").value;

    if (pw === ADMIN_PASSWORD) {
        loginPopup.style.display = "none";
        addPopup.style.display = "flex";
    } else {
        alert("Password salah!");
    }
};

// Tambah berita
document.getElementById("simpanBerita").onclick = () => {
    const judul = document.getElementById("judul").value;
    const isi = document.getElementById("isi").value;

    if (judul.trim() === "" || isi.trim() === "") {
        alert("Isi semua kolom!");
        return;
    }

    beritaList.push({ judul, isi });

    localStorage.setItem("berita", JSON.stringify(beritaList));

    addPopup.style.display = "none";
    tampilkanBerita();
};

document.getElementById("closeAdd").onclick = () =>
    addPopup.style.display = "none";

// Tampilkan berita saat pertama dibuka
tampilkanBerita();
