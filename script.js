
import { db } from "./firebase.js";
import { collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

onSnapshot(collection(db,"news"), snap=>{
  const list=document.getElementById("news-list");
  list.innerHTML="";
  snap.forEach(d=>{
    const n=d.data();
    list.innerHTML+=`<div class='news-item'>
      <h3>${n.title}</h3>
      <img src='${n.imgURL}' width='200'>
      <p>${n.content}</p>
    </div>`;
  });
});

document.getElementById("sendComment").onclick=async()=>{
  const t=document.getElementById("commentInput").value;
  if(!t) return;
  await addDoc(collection(db,"comments"),{text:t});
  document.getElementById("commentInput").value="";
};

onSnapshot(collection(db,"comments"), snap=>{
  const c=document.getElementById("comments");
  c.innerHTML="";
  snap.forEach(d=>c.innerHTML+=`<div class='comment-item'>${d.data().text}</div>`);
});
