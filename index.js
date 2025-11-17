// index.js
import { db, auth } from './firebase-config.js';
import {
  collection, query, orderBy, onSnapshot, addDoc, serverTimestamp,
  doc, deleteDoc, getDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const newsList = document.getElementById('news-list');

let currentIsAdmin = false;

// helper
function escapeHTML(str='') {
  return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'" :'&#39;'})[m]);
}
function timeString(ts){
  if(!ts) return '';
  return ts.toDate().toLocaleString();
}

// cek admin
async function checkAdmin(uid){
  if(!uid) return false;
  const admRef = doc(db, 'admins', uid);
  const admSnap = await getDoc(admRef);
  return admSnap.exists();
}

// render article
function renderArticle(docSnap){
  const data = docSnap.data();
  const id = docSnap.id;

  const article = document.createElement('article');
  article.className = 'news-card card';
  article.innerHTML = `
    <div style="flex:0 0 160px;">
      ${data.imageURL ? `<img class="news-thumb" src="${data.imageURL}">` : `<div class="news-thumb"></div>`}
    </div>
    <div class="news-body" style="flex:1">
      <h3>${escapeHTML(data.title)}</h3>
      <p class="meta">${timeString(data.createdAt)}</p>
      <div class="content">${data.content || ''}</div>

      <h4>Komentar</h4>
      <div id="comments-${id}" class="comment-list"></div>

      <form data-article-id="${id}" class="comment-form">
        <input name="name" placeholder="Nama (opsional)">
        <textarea name="text" placeholder="Tulis komentar..." required></textarea>
        <button type="submit">Kirim</button>
      </form>
    </div>
  `;

  // komentar submit
  const form = article.querySelector('.comment-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const articleId = form.dataset.articleId;
    const name = form.name.value.trim() || 'Pengunjung';
    const text = form.text.value.trim();
    if(!text) return;
    await addDoc(collection(db, 'articles', articleId, 'comments'), {
      name, text, createdAt: serverTimestamp()
    });
    form.text.value = '';
  });

  // realtime comments
  const commentsContainer = article.querySelector(`#comments-${id}`);
  const q = query(collection(db, 'articles', id, 'comments'), orderBy('createdAt','asc'));
  onSnapshot(q, (snap) => {
    commentsContainer.innerHTML = '';
    snap.forEach(cdoc => {
      const c = cdoc.data();
      const div = document.createElement('div');
      div.className = 'comment';
      div.innerHTML = `<strong>${escapeHTML(c.name)}:</strong> ${escapeHTML(c.text)}`;

      if(currentIsAdmin){
        const btn = document.createElement('button');
        btn.textContent = 'Hapus';
        btn.className = 'small';
        btn.onclick = async () => {
          await deleteDoc(doc(db, 'articles', id, 'comments', cdoc.id));
        };
        div.appendChild(btn);
      }

      commentsContainer.appendChild(div);
    });
  });

  newsList.appendChild(article);
}

// realtime articles
const q = query(collection(db, 'articles'), orderBy('createdAt','desc'));
onSnapshot(q, snap => {
  newsList.innerHTML = '';
  snap.forEach(docSnap => renderArticle(docSnap));
});

// auth listener
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
onAuthStateChanged(auth, async user => {
  if(user){
    currentIsAdmin = await checkAdmin(user.uid);
  } else {
    currentIsAdmin = false;
  }
});
