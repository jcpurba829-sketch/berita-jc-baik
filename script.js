import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, doc, getDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBab2pklCIaeEkQg8pqQpUUQ02r4ZJZfyk",
  authDomain: "web-berita-tbj.firebaseapp.com",
  projectId: "web-berita-tbj",
  storageBucket: "web-berita-tbj.firebasestorage.app",
  messagingSenderId: "111379599206",
  appId: "1:111379599206:web:6001dda917d9dd1b1bc2a7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ------------------- LOAD BERITA -------------------

async function loadBerita() {
    const q = query(collection(db, "berita"), orderBy("waktu", "desc"));
    const snap = await getDocs(q);

    let html = "";

    snap.forEach((doc) => {
        const data = doc.data();

        html += `
            <div class="berita-card">
                <h2>${data.judul}</h2>
                <img src="${data.gambar}" class="thumb">
                <p>${data.isi}</p>

                <h3>Komentar</h3>
                <div id="komen-${doc.id}"></div>

                <input id="nama-${doc.id}" placeholder="Nama">
                <textarea id="komentar-${doc.id}" placeholder="Tulis komentar..."></textarea>
                <button onclick="kirimKomentar('${doc.id}')">Kirim</button>
            </div>
        `;

        loadKomentar(doc.id);
    });

    document.getElementById("berita-container").innerHTML = html;
}

// ------------------- KOMENTAR -------------------

async function loadKomentar(beritaId) {
    const q = query(collection(db, `berita/${beritaId}/komentar`), orderBy("waktu"));

    const snap = await getDocs(q);

    let html = "";

    snap.forEach((doc) => {
        const komen = doc.data();

        html += `
            <div class="komentar">
                <b>${komen.nama}</b>: ${komen.teks}
                <div class="balasan-container" id="balasan-${beritaId}-${doc.id}"></div>

                <textarea placeholder="Balas..." id="reply-${beritaId}-${doc.id}"></textarea>
                <button onclick="balasKomentar('${beritaId}', '${doc.id}')">Balas</button>
            </div>
        `;

        loadBalasan(beritaId, doc.id);
    });

    document.getElementById(`komen-${beritaId}`).innerHTML = html;
}

// ------------------- BALASAN -------------------

async function loadBalasan(beritaId, komentarId) {
    const q = query(collection(db, `berita/${beritaId}/komentar/${komentarId}/balasan`));

    const snap = await getDocs(q);
    let html = "";

    snap.forEach((doc) => {
        const balasan = doc.data();
        html += `<div class="balasan"><b>${balasan.nama}</b>: ${balasan.teks}</div>`;
    });

    document.getElementById(`balasan-${beritaId}-${komentarId}`).innerHTML = html;
}

// ------------------- KIRIM KOMENTAR -------------------

window.kirimKomentar = async function (id) {
    const nama = document.getElementById(`nama-${id}`).value;
    const teks = document.getElementById(`komentar-${id}`).value;

    if (!nama || !teks) return alert("Isi nama dan komentar!");

    await addDoc(collection(db, `berita/${id}/komentar`), {
        nama,
        teks,
        waktu: Date.now()
    });

    loadKomentar(id);
};

// ------------------- BALAS KOMENTAR -------------------

window.balasKomentar = async function (beritaId, komentarId) {
    const teks = document.getElementById(`reply-${beritaId}-${komentarId}`).value;

    if (!teks) return alert("Isi balasan!");

    await addDoc(collection(db, `berita/${beritaId}/komentar/${komentarId}/balasan`), {
        nama: "Admin",
        teks,
        waktu: Date.now()
    });

    loadBalasan(beritaId, komentarId);
};

loadBerita();
