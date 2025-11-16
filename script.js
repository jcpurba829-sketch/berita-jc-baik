// Ambil berita dari localStorage
let news = JSON.parse(localStorage.getItem('news')) || [];

// Simpan berita ke localStorage
function saveNews() {
    localStorage.setItem('news', JSON.stringify(news));
}

// Render berita untuk pengunjung
function renderNews() {
    const newsList = document.getElementById('news-list');
    if(!newsList) return;
    newsList.innerHTML = '';
    news.forEach((n, i) => {
        const div = document.createElement('div');
        div.className = 'news-item';
        div.innerHTML = `
            <h3>${n.title}</h3>
            ${n.image ? `<img src="${n.image}" alt="${n.title}">` : ''}
            <p>${n.content.substring(0, 100)}...</p>
            <button onclick="viewNews(${i})">Baca Selengkapnya</button>
        `;
        newsList.appendChild(div);
    });
}

// Render berita untuk admin
function renderNewsAdmin() {
    const newsList = document.getElementById('news-list-admin');
    if(!newsList) return;
    newsList.innerHTML = '';
    news.forEach((n, i) => {
        const div = document.createElement('div');
        div.className = 'news-item';
        div.innerHTML = `
            <h3>${n.title}</h3>
            ${n.image ? `<img src="${n.image}" alt="${n.title}">` : ''}
            <p>${n.content.substring(0, 100)}...</p>
            <button onclick="deleteNews(${i})">Hapus</button>
        `;
        newsList.appendChild(div);
    });
}

// Tambah berita (admin)
const form = document.getElementById('news-form');
if(form){
    form.addEventListener('submit', e => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const fileInput = document.getElementById('image-file');
        const file = fileInput.files[0];

        if(file){
            const reader = new FileReader();
            reader.onload = function(e){
                const imageBase64 = e.target.result;
                news.push({title, content, image: imageBase64, comments: []});
                saveNews();
                renderNewsAdmin();
                form.reset();
            }
            reader.readAsDataURL(file);
        } else {
            news.push({title, content, image: null, comments: []});
            saveNews();
            renderNewsAdmin();
            form.reset();
        }
    });
}

// Hapus berita
function deleteNews(index){
    if(confirm("Yakin ingin menghapus berita ini?")){
        news.splice(index,1);
        saveNews();
        renderNewsAdmin();
        renderNews();
    }
}

// Lihat detail berita
function viewNews(index){
    const n = news[index];
    const div = document.createElement('div');
    div.className = 'news-item news-item-detail';
    div.innerHTML = `
        <h2>${n.title}</h2>
        ${n.image ? `<img src="${n.image}" alt="${n.title}">` : ''}
        <p>${n.content}</p>
        <h3>Komentar:</h3>
        <div id="comments-list">
            ${n.comments.map(c => `<p>${c}</p>`).join('')}
        </div>
        <input type="text" id="comment-input-${index}" placeholder="Tulis komentar">
        <button onclick="addComment(${index})">Kirim</button>
        <button onclick="backToList()">Kembali</button>
    `;
    const newsList = document.getElementById('news-list');
    if(newsList){
        newsList.innerHTML = '';
        newsList.appendChild(div);
    }
}

// Tambah komentar
function addComment(index){
    const input = document.getElementById(`comment-input-${index}`);
    const comment = input.value.trim();
    if(comment){
        news[index].comments.push(comment);
        saveNews();
        viewNews(index);
    }
}

// Kembali ke daftar berita
function backToList(){
    renderNews();
}

// Render awal
renderNews();
renderNewsAdmin();
