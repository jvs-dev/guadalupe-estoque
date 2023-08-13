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
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, setDoc, onSnapshot, query, where, updateDoc, arrayUnion, arrayRemove, serverTimestamp, deleteDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);
let addTask = document.getElementById("addTask")
let createTask = document.getElementById("createTask")
let confirmCreate = document.getElementById("confirmCreate")
let taskText = document.getElementById("taskText")

addTask.onclick = function () {
    if (createTask.style.display == "none") {
        addTask.style.rotate = "45deg"
        createTask.style.display = "flex"
        setTimeout(() => {
            createTask.style.opacity = "1"
        }, 1);
    } else {
        addTask.style.rotate = "0deg"
        createTask.style.opacity = "0"
        setTimeout(() => {
            createTask.style.display = "none"
        }, 200);
    }
}


confirmCreate.onclick = function () {
    if (taskText.value != "") {
        addTaskFct(taskText.value)
    } else {

    }
}


async function addTaskFct(taskText) {
    addTask.style.rotate = "0deg"
    createTask.style.opacity = "0"
    setTimeout(() => {
        createTask.style.display = "none"
    }, 200);
    let docRef = await addDoc(collection(db, "tasks"), {
        taskText: `${taskText}`,
        resolved: false
    })
    let taskTextInput = document.getElementById("taskText")
    taskTextInput.value = ""
    tasksSection.innerHTML = ""
    loadTasks()
}


async function loadTasks() {
    let tasksSection = document.getElementById("tasksSection")
    tasksSection.innerHTML = ""
    let querySnapshot = await getDocs(collection(db, "tasks"));
    querySnapshot.forEach((doc) => {
        let article = document.createElement("article")
        let label = document.createElement("label")
        let input = document.createElement("input")
        let p = document.createElement("p")
        let deleteTask = document.createElement("button")
        tasksSection.insertAdjacentElement("beforeend", article)
        article.classList.add("taskCard")
        article.insertAdjacentElement("beforeend", label)
        label.classList.add("taskCard__container")
        label.innerHTML = `
        <svg viewBox="0 0 64 64" height="2em" width="2em">
            <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" class="path"></path>
        </svg>`
        label.insertAdjacentElement("afterbegin", input)
        input.type = "checkbox"
        article.insertAdjacentElement("beforeend", p)
        p.classList.add("taskCard__text")
        p.textContent = `${doc.data().taskText}`
        if (doc.data().resolved == true) {
            p.style.textDecoration = "line-through"
            input.checked = true
        }
        article.insertAdjacentElement("beforeend", deleteTask)
        deleteTask.classList.add("taskCard__delete")
        deleteTask.innerHTML = `<ion-icon name="trash-outline"></ion-icon>`
        deleteTask.onclick = function () {
            deleteTaskFct(doc.id)
        }
        input.onclick = function () {
            if (p.style.textDecoration == "line-through") {
                p.style.textDecoration = "none"
                taskResolved(false, doc.id)
            } else {
                p.style.textDecoration = "line-through"
                taskResolved(true, doc.id)
            }
        }
    });
}


async function taskResolved(boolean, taskId) {
    let washingtonRef = doc(db, "tasks", `${taskId}`);
    if (boolean == true) {
        await updateDoc(washingtonRef, {
            resolved: true
        });
    } else {
        await updateDoc(washingtonRef, {
            resolved: false
        });
    }
}


async function deleteTaskFct(docId) {
    await deleteDoc(doc(db, "tasks", `${docId}`));
    tasksSection.innerHTML = ""
    loadTasks()
}