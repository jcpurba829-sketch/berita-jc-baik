// Firebase Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBab2pklCIaeEkqg8pqQpUUQ02r4ZJZfyk",
  authDomain: "web-berita-tbj.firebaseapp.com",
  projectId: "web-berita-tbj",
  storageBucket: "web-berita-tbj.appspot.com",
  messagingSenderId: "111379599206",
  appId: "1:111379599206:web:55fe575f9b4f0b051bc2a7"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
