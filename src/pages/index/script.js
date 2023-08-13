import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_API_KEY}`,
  authDomain: `${import.meta.env.VITE_AUTH_DOMAIN}`,
  projectId: `${import.meta.env.VITE_PROJECT_ID}`,
  storageBucket: `${import.meta.env.VITE_STORAGE_BUCKET}`,
  messagingSenderId: `${import.meta.env.VITE_MESSAGING_SENDER_ID}`,
  appId: `${import.meta.env.VITE_APP_ID}`
};
const app = initializeApp(firebaseConfig);
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, setDoc, onSnapshot, query, where, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);
let itemsSecion = document.getElementById("itemsSecion")

async function loadItems() {
  let querySnapshot = await getDocs(collection(db, "items"));
  querySnapshot.forEach((doc) => {
    getDownloadURL(ref(storage, `items/${doc.id}.jpg`))
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();
        let article = document.createElement("article")
        itemsSecion.insertAdjacentElement("beforeend", article)
        article.classList.add("item-card")
        article.innerHTML = `
        <div class="item-card__divImg">
          <img class="item-card__img" src="${url}" alt="" id="previewImg">
        </div>
        <p class="item-card__name" id="previewName">${doc.data().itemName}</p>
        <p class="item-card__quanty" id="previewQuanty">TOTAL: ${doc.data().itemQuanty} unid.</p>
        <div class="item-card__div">
          <button class="item-card__btn" style="--clr: #132330;">-</button>
          <button class="item-card__btn" style="--clr: #4684B5;">+</button>
        </div>`
      })
      .catch((error) => {
      });
  });
}

loadItems()