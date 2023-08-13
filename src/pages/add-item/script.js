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
import { getFirestore, collection, addDoc, doc, getDoc, setDoc, onSnapshot, query, where, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getStorage, ref, uploadString } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);
let setItemName = document.getElementById("setItemName")
let setItemQuanty = document.getElementById("setItemQuanty")
let createItem = document.getElementById("createItem")
let setItemImg = document.getElementById("setItemImg")
let previewImg = document.getElementById("previewImg")
let previewName = document.getElementById("previewName")
let previewQuanty = document.getElementById("previewQuanty")



setItemName.addEventListener("input", () => {
    if (setItemName.value != "") {
        previewName.innerHTML = `${setItemName.value}`
    } else {
        previewName.innerHTML = `Nome do item`
    }
})

setItemQuanty.addEventListener("input", () => {
    if (setItemQuanty.value != "") {
        previewQuanty.innerHTML = `TOTAL: ${setItemQuanty.value} unid.`
    } else {
        previewQuanty.innerHTML = `TOTAL: X unid.`
    }
})

setItemImg.addEventListener('change', function () {
    let file = setItemImg.files[0];
    if (file) {
        let reader = new FileReader();

        reader.onload = function (e) {
            previewImg.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
});

createItem.onclick = function () {
    if (setItemImg.files.length > 0 && setItemName.value != "" && setItemQuanty.value != "") {
        addItem(previewImg.src, setItemName.value, setItemQuanty.value)
    } else {
        console.log("preencha tudo");
    }
}


async function addItem(itemImg, itemName, itemQuanty) {
    let addingItem = document.querySelector(".addingItem")
    addingItem.style.display = "flex"
    setTimeout(() => {
        addingItem.style.opacity = "1"
    }, 1);
    let docRef = await addDoc(collection(db, "items"), {
        itemName: `${itemName}`,
        itemQuanty: `${itemQuanty}`,
    });
    let itemsImagesRef = ref(storage, `items/${docRef.id}.jpg`);
    let image = `${itemImg}`;
    uploadString(itemsImagesRef, image, 'data_url').then((snapshot) => {
        setItemName.value=""
        setItemQuanty.value=""
        addingItem.style.opacity = "0"
        setTimeout(() => {
            addingItem.style.display = "none"
        }, 0);
    });
}