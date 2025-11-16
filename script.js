// script.js — works for index.html, post.html, admin.html
const POSTS_URL = 'posts.json';

async function fetchPosts(){
  try{
    const res = await fetch(POSTS_URL, {cache: 'no-store'});
    if(!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    return data.posts||[];
  }catch(e){
    // fallback to localStorage
    const raw = localStorage.getItem('tbj_posts');
    return raw?JSON.parse(raw):[];
  }
}

function saveLocalPosts(posts){
  localStorage.setItem('tbj_posts', JSON.stringify(posts));
}

function makeId(){return 'p'+Math.random().toString(36).slice(2,9)}

// INDEX
async function renderIndex(){
  const posts = await fetchPosts();
  const container = document.getElementById('posts');
  if(!container) return;
  container.innerHTML = '';
  const tpl = document.getElementById('post-card');
  posts.slice().reverse().forEach(p=>{
    const el = tpl.content.cloneNode(true);
    el.querySelector('.thumb').src = p.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23707b85">No+Image</text></svg>';
    el.querySelector('.card-title').textContent = p.title;
    el.querySelector('.card-excerpt').textContent = (p.content||'').replace(/<[^>]+>/g,'').slice(0,140) + '...';
    el.querySelector('.date').textContent = p.date;
    el.querySelector('.author').textContent = p.author||'Anonim';
    const link = el.querySelector('.read-more');
    link.href = `post.html?id=${encodeURIComponent(p.id)}`;
    el.querySelector('.thumb-link').href = link.href;
    container.appendChild(el);
  });
}

// POST VIEW
async function renderPost(){
  const el = document.getElementById('post');
  if(!el) return;
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const posts = await fetchPosts();
  const post = posts.find(x=>x.id===id);
  if(!post){ el.innerHTML = '<p>Berita tidak ditemukan.</p>'; return; }
  el.innerHTML = `
    <h2>${post.title}</h2>
    <div class="meta">${post.date} • ${post.author||'Anonim'}</div>
    ${post.image?`<img src="${post.image}" alt="gambar">`:''}
    <div class="content">${post.content}</div>
  `;

  // comments
  const commentList = document.getElementById('commentList');
  const form = document.getElementById('commentForm');
  if(commentList){
    const comments = post.comments||[];
    commentList.innerHTML = comments.map(c=>`<div class="comment"><strong>${escapeHtml(c.name)}</strong><div>${escapeHtml(c.text)}</div></div>`).join('')
  }
  if(form){
    form.onsubmit = async (e)=>{
      e.preventDefault();
      const fd = new FormData(form);
      const comment = {name: fd.get('name'), text: fd.get('text'), date: new Date().toISOString()};
      post.comments = post.comments||[];
      post.comments.push(comment);
      // save to localStorage only (serverless)
      const posts = await fetchPosts();
      const idx = posts.findIndex(x=>x.id===post.id);
      if(idx>=0) posts[idx]=post; else posts.push(post);
      saveLocalPosts(posts);
      // re-render
      renderPost();
      form.reset();
    }
  }
}

function escapeHtml(s){return (s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c])}

// ADMIN
async function adminInit(){
  const loginBox = document.getElementById('loginBox');
  const adminPanel = document.getElementById('adminPanel');
  if(!loginBox) return;
  const passInput = document.getElementById('adminPass');
  document.getElementById('loginBtn').onclick = ()=>{
    const val = passInput.value;
    if(val === localStorage.getItem('tbj_admin_pass') || (val === 'tbjadmin123' && !localStorage.getItem('tbj_admin_pass'))){
      loginBox.hidden = true; adminPanel.hidden = false; loadAdminList();
    }else alert('Password salah');
  }

  // allow setting custom admin password
  if(!localStorage.getItem('tbj_admin_pass')) localStorage.setItem('tbj_admin_pass','tbjadmin123');

  const form = document.getElementById('postForm');
  form.onsubmit = async (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const title = fd.get('title');
    const author = fd.get('author');
    const content = fd.get('content');
    const file = fd.get('image');
    let image = null;
    if(file && file.size){
      image = await fileToDataURL(file);
    }
    const posts = await fetchPosts();
    const post = {id: makeId(), title, author, content, date: new Date().toISOString().slice(0,10), image, comments: []};
    posts.push(post);
    saveLocalPosts(posts);
    loadAdminList();
    alert('Berita disimpan di browser. Untuk membuatnya tersedia untuk semua orang, klik Download posts.json dan upload ke repo GitHub Pages Anda.');
    form.reset();
  }

  document.getElementById('downloadJson').onclick = async ()=>{
    const posts = await fetchPosts();
    const blob = new Blob([JSON.stringify({posts},null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'posts.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  document.getElementById('saveRemote').onclick = async ()=>{
    // simple GitHub commit flow (user must supply token + repo)
    const repo = document.getElementById('ghRepo').value.trim();
    const br = document.getElementById('ghBranch').value.trim()||'gh-pages';
    const token = document.getElementById('ghToken').value.trim();
    if(!repo || !token){ alert('Isi field repo dan token'); return; }
    try{
      const posts = await fetchPosts();
      const content = btoa(unescape(encodeURIComponent(JSON.stringify({posts},null,2))));
      // get file sha if exists
      const apiBase = `https://api.github.com/repos/${repo}/contents/posts.json`;
      const getRes = await fetch(apiBase + `?ref=${br}`, {headers:{Authorization:'token '+token}});
      let sha = null;
      if(getRes.ok){ const j = await getRes.json(); sha = j.sha; }
      const putRes = await fetch(apiBase, {method:'PUT', headers:{Authorization:'token '+token, 'Content-Type':'application/json'}, body: JSON.stringify({message:'Update posts via TBJ admin', branch:br, content, sha})});
      if(!putRes.ok) throw new Error('commit failed');
      alert('Posts.json berhasil di-commit. Tunggu beberapa menit agar GitHub Pages memperbarui.');
    }catch(err){ console.error(err); alert('Gagal commit. Anda masih bisa download posts.json manual.'); }
  }
}

async function loadAdminList(){
  const node = document.getElementById('adminList');
  const posts = await fetchPosts();
  node.innerHTML = '';
  posts.slice().reverse().forEach(p=>{
    const div = document.createElement('div'); div.className='card'; div.style.padding='10px';
    div.innerHTML = `<strong>${p.title}</strong><div class="meta">${p.date} • ${p.author||''}</div>`;
    const btnDel = document.createElement('button'); btnDel.textContent='Hapus'; btnDel.style.marginLeft='8px';
    btnDel.onclick = ()=>{
      if(!confirm('Hapus berita ini?')) return;
      const remaining = posts.filter(x=>x.id!==p.id);
      saveLocalPosts(remaining);
      loadAdminList();
    }
    div.appendChild(btnDel);
    node.appendChild(div);
  });
}

function fileToDataURL(file){
  return new Promise((res,rej)=>{
    const r = new FileReader(); r.onload = ()=>res(r.result); r.onerror = rej; r.readAsDataURL(file);
  });
}

// auto-run where appropriate
if(document.querySelector('.posts-grid')) renderIndex();
if(document.getElementById('post')) renderPost();
if(document.getElementById('adminPanel') || document.getElementById('loginBox')) adminInit();
