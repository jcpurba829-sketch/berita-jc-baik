// admin.js
import { auth, db, storage } from './firebase-config.js';
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc, getDocs
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  ref as sRef, uploadBytesResumable, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

const emailEl = document.getElementById('email');
const passEl = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authMsg = document.getElementById('authMsg');
const panel = document.getElementById('panel');
const manage = document.getElementById('manage');
const titleEl = document.getElementById('title');
const imageEl = document.getElementById('image');
const contentEl = document.getElementById('content');
const publishBtn = document.getElementById('publishBtn');
const manageList = document.getElementById('manage-list');

let isAdmin = false;
let currentUser = null;

// login
loginBtn.onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, emailEl.value, passEl.value);
    authMsg.textContent = "Login berhasil!";
  } catch(e){
    authMsg.textContent = "Login gagal: " + e.message;
  }
};

logoutBtn.onclick = async () => {
  await signOut(auth);
  authMsg.textContent = "Logout berhasil.";
};

// check admin
import { doc as docRef, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
async function checkAdmin(uid){
  if(!uid) return false;
  const a = await getDoc(docRef(db, 'admins', uid));
  return a.exists();
}

// auth listener
onAuthStateChanged(auth, async user => {
  currentUser = user;
  if(user){
    const ok = await checkAdmin(user.uid);
    if(ok){
      isAdmin = true;
      panel.style.display = 'block';
      manage.style.display = 'block';
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'block';
      emailEl.style.display = 'none';
      passEl.style.display = 'none';
      authMsg.textContent = "Admin: " + user.email;
      loadManageList();
    } else {
      isAdmin = false;
      panel.style.display = 'none';
      manage.style.display = 'none';
      authMsg.textContent = "Akun ini bukan admin.";
    }
  } else {
    isAdmin = false;
    panel.style.display = 'none';
    manage.style.display = 'none';
    loginBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
    emailEl.style.display = 'block';
    passEl.style.display = 'block';
    authMsg.textContent = "";
  }
});

// publish berita
publishBtn.onclick = async () => {
  if(!isAdmin) return alert("Anda bukan admin.");

  const title = titleEl.value.trim();
  const content = contentEl.value.trim();
  if(!title || !content) return alert("Judul & Isi wajib diisi");

  let imageURL = "";
  let imagePath = "";

  if(imageEl.files && imageEl.files[0]){
    const file = imageEl.files[0];
    imagePath = "articles/" + Date.now() + "_" + file.name;
    const ref = sRef(storage, imagePath);
    const uploadTask = uploadBytesResumable(ref, file);

    await new Promise((resolve, reject)=>{
      uploadTask.on("state_changed", null, reject, async ()=>{
        imageURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve();
      });
    });
  }

  await addDoc(collection(db, "articles"), {
    title, content, imageURL, imagePath,
    author: currentUser.email,
    createdAt: serverTimestamp()
  });

  titleEl.value = "";
  contentEl.value = "";
  imageEl.value = "";
  alert("Berita berhasil diterbitkan!");
};

// load manage list
function loadManageList(){
  const q = query(collection(db,"articles"), orderBy("createdAt","desc"));
  onSnapshot(q, snap=>{
    manageList.innerHTML = "";
    snap.forEach(docSnap=>{
      const d = docSnap.data();
      const id = docSnap.id;
      const row = document.createElement("div");
      row.className = "manage-item";
      row.innerHTML = `<strong>${d.title}</strong>`;

      const btn = document.createElement("button");
      btn.textContent = "Hapus";
      btn.className = "small";

      btn.onclick = async ()=>{
        if(!confirm("Hapus berita ini?")) return;

        // hapus komentar
        const cSnap = await getDocs(collection(db,"articles",id,"comments"));
        for(const c of cSnap.docs){
          await deleteDoc(doc(db,"articles",id,"comments",c.id));
        }

        await deleteDoc(doc(db,"articles",id));

        if(d.imagePath){
          try{ await deleteObject(sRef(storage, d.imagePath)); }catch(err){}
        }
      };

      row.appendChild(btn);
      manageList.appendChild(row);
    });
  });
}
