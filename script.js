import { db, storage } from "./firebase.js";
import {
collection, addDoc, getDocs, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
uploadBytes, getDownloadURL, ref
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const newsCol = collection(db, "berita");

const btn = document.getElementById("kirim");
if (btn) {
btn.onclick = async () => {
const judul = document.getElementById("judul").value;
const isi = document.getElementById("isi").value;
const gambarFile = document.getElementById("gambar").files[0];
let gambarURL = "";
if (gambarFile) {
const storageRef = ref(storage, "gambar/" + gambarFile.name);
await uploadBytes(storageRef, gambarFile);
gambarURL = await getDownloadURL(storageRef);
}
await addDoc(newsCol, {
judul,
isi,
gambar: gambarURL,
waktu: Date.now()
});
alert("Berita berhasil dikirim!");
location.reload();
}
}

const list = document.getElementById("news-list");
if (list) {
(async () => {
const snap = await getDocs(newsCol);
snap.forEach(d => {
const data = d.data();
list.innerHTML += `
<div class='news-card'>
<h3>${data.judul}</h3>
<img src="${data.gambar}">
<p>${data.isi}</p>
</div>`;
});
})();
}

const adminDiv = document.getElementById("admin-news");
if (adminDiv) {
(async () => {
const snap = await getDocs(newsCol);
snap.forEach(d => {
const data = d.data();
adminDiv.innerHTML += `
<div class='news-card'>
<h3>${data.judul}</h3>
<button onclick="hapus('${d.id}')">Hapus</button>
</div>`;
});
})();
}

window.hapus = async (id) => {
await deleteDoc(doc(db, "berita", id));
alert("Berita dihapus");
location.reload();
};
