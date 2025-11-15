import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { 
    getStorage, ref, uploadBytes, getDownloadURL, deleteObject 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// ------------------- FIREBASE CONFIG -------------------

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
const storage = getStorage(app);

// =================== LOGIN ADMIN ===================

const ADMIN_PASSWORD = "tbjadmin123"; // ganti kalau mau

document.getElementById("login-btn").onclick = () => {
    const pw = document.getElementById("password").value;

    if (pw === ADMIN_PASSWORD) {
        document.getElementById("login-box").style.display = "none";
        document.getElementById("admin-panel").style.display = "block";
        loadAdminBerita();
    } else {
        alert("Password salah!");
    }
};

// =================== UPLOAD BERITA ===================

document.getElementById("kirim").onclick = async () => {
    const judul = document.getElementById("judul").value;
    const isi = document.getElementById("isi").value;
    const file = document.getElementById("gambar").files[0];

    if (!judul || !isi || !file) {
        return alert("Isi semua form dan upload gambar!");
    }

    // Upload gambar ke Storage
    const lokasi = "gambar/" + Date.now() + "-" + file.name;
    const storageRef = ref(storage, lokasi);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    // Simpan berita ke Firestore
    await addDoc(collection(db, "berita"), {
        judul,
        isi,
        gambar: url,
        lokasiGambar: lokasi,
        waktu: Date.now()
    });

    alert("Berita berhasil ditambahkan!");

    document.getElementById("judul").value = "";
    document.getElementById("isi").value = "";
    document.getElementById("gambar").value = "";

    loadAdminBerita();
};

// =================== TAMPILKAN BERITA DI ADMIN ===================

async function loadAdminBerita() {
    const list = document.getElementById("admin-berita-list");
    list.innerHTML = "Loading...";

    const q = query(collection(db, "berita"), orderBy("waktu", "desc"));
    const snap = await getDocs(q);

    let html = "";

    snap.forEach((docu) => {
        const data = docu.data();

        html += `
            <div class="admin-berita-item">
                <img src="${data.gambar}" class="thumb-admin">
                <div>
                    <b>${data.judul}</b>
                    <p>${data.isi.substring(0, 50)}...</p>
                    <button onclick="hapusBerita('${docu.id}', '${data.lokasiGambar}')">Hapus</button>
                </div>
            </div>
        `;
    });

    list.innerHTML = html;
}

// =================== HAPUS BERITA ===================

window.hapusBerita = async function(id, lokasiGambar) {
    const yakin = confirm("Hapus berita ini?");

    if (!yakin) return;

    // Hapus gambar
    const gambarRef = ref(storage, lokasiGambar);
    await deleteObject(gambarRef);

    // Hapus dokumen berita
    await deleteDoc(doc(db, "berita", id));

    alert("Berita berhasil dihapus!");
    loadAdminBerita();
};
