
import { db, storage } from "./firebase.js";
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { uploadBytes, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const PASS="admin123";

document.getElementById("loginBtn").onclick=()=>{
  if(document.getElementById("adminPass").value===PASS){
    document.getElementById("adminArea").style.display="block";
  }
};

document.getElementById("postBtn").onclick=async()=>{
  const title=document.getElementById("titleInput").value;
  const content=document.getElementById("contentInput").value;
  const file=document.getElementById("imgInput").files[0];
  if(!file) return;

  const r=ref(storage,"img_"+Date.now());
  await uploadBytes(r,file);
  const url=await getDownloadURL(r);

  await addDoc(collection(db,"news"),{title,content,imgURL:url});
};

onSnapshot(collection(db,"news"), snap=>{
  const list=document.getElementById("adminNewsList");
  list.innerHTML="";
  snap.forEach(d=>{
    list.innerHTML+=`<div class='news-item'>
      <h3>${d.data().title}</h3>
      <button onclick="window.delNews('${d.id}')">Hapus</button>
    </div>`;
  });
});

window.delNews=async(id)=>{
  await deleteDoc(doc(db,"news",id));
};
