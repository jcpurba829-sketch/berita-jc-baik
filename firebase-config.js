// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBab2pklCIaeEkqg8pqQpUUQ02r4ZJZfyk",
  authDomain: "web-berita-tbj.firebaseapp.com",
  projectId: "web-berita-tbj",
  storageBucket: "web-berita-tbj.appspot.com",
  messagingSenderId: "111379599206",
  appId: "1:111379599206:web:fb91302a34ff26271bc2a7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
