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
if (window.location.pathname == "/index.html") {
  let main = document.getElementById("main")
  main.innerHTML=`<div class="tasks-background" id="taskBackground">
  <section class="tasks-section">
    <button type="button" class="tasks-section__close" id="closeTasks"><ion-icon name="close-outline"></ion-icon></button>
    <h2 class="task-section__h2">Tarefas</h2>
    <div class="task-section__div" id="tasksSection">
      
    </div>
    <article class="tasks-section__createTask" id="createTask" style="display: none;">
      <input type="text" class="createTask__input" id="taskText" placeholder="Descrição da taréfa">
      <button class="createTask__btn" id="confirmCreate">Criar tarefa</button>
    </article>
    <button type="button" class="task-section__add-item" id="addTask"><ion-icon name="add-circle-outline"></ion-icon></button>
  </section>
</div>
<div class="background"></div>
<header class="main__header">
  <input type="checkbox" class="main__darkLight" id="darkLight" checked>
  <div class="fontTitle">ESTOQUE DE ITENS</div>
</header>
<nav class="main__nav nav--side-bar">
  <div class="side-bar__div">
    <a href="index.html" class="side-bar__icon"><i class="bi bi-box-seam"></i>Estoque</a>
    <button class="side-bar__icon btn" id="showTasks"><i class="bi bi-clipboard-check"></i>Tarefas</button>
    <a href="addItem.html" class="side-bar__icon"><ion-icon name="add-circle-outline"></ion-icon>Criar item</a>
    <a href="" class="side-bar__icon"><ion-icon name="person-add-outline"></ion-icon>Criar conta</a>
  </div>
  <a href="" class="side-bar__icon"><i class="bi bi-box-arrow-left"></i>Sair</a>
</nav>
<section class="main__cardsSection" id="itemsSecion">

</section>`
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
}
if (window.location.pathname == "/addItem.html") {
  let main = document.getElementById("main")
  main.innerHTML=`<div class="addingItem">
  <div class="addingItem__loader">
    <div class="box1"></div>
    <div class="box2"></div>
    <div class="box3"></div>
  </div>
  <p class="addingItem__p">Adicionando item...</p>
</div>
<div class="tasks-background" id="taskBackground">
  <section class="tasks-section">
    <button type="button" class="tasks-section__close" id="closeTasks"><ion-icon name="close-outline"></ion-icon></button>
    <h2 class="task-section__h2">Tarefas</h2>
    <div class="task-section__div" id="tasksSection">
      
    </div>
    <article class="tasks-section__createTask" id="createTask" style="display: none;">
      <input type="text" class="createTask__input" id="taskText" placeholder="Descrição da taréfa">
      <button class="createTask__btn" id="confirmCreate">Criar tarefa</button>
    </article>
    <button type="button" class="task-section__add-item" id="addTask"><ion-icon name="add-circle-outline"></ion-icon></button>
  </section>
</div>
<div class="background"></div>
<header class="main__header">
  <input type="checkbox" class="main__darkLight" id="darkLight" checked>
  <div class="fontTitle">Adição de itens</div>
</header>
<nav class="main__nav nav--side-bar">
  <div class="side-bar__div">
    <a href="index.html" class="side-bar__icon"><i class="bi bi-box-seam"></i>Estoque</a>
    <button class="side-bar__icon btn" id="showTasks"><i class="bi bi-clipboard-check"></i>Tarefas</button>
    <a href="addItem.html" class="side-bar__icon"><ion-icon name="add-circle-outline"></ion-icon>Criar item</a>
    <a href="" class="side-bar__icon"><ion-icon name="person-add-outline"></ion-icon>Criar conta</a>
  </div>
  <a href="" class="side-bar__icon"><i class="bi bi-box-arrow-left"></i>Sair</a>
</nav>
<div class="main__addItem-background">
  <article class="addItem__preview-card item-card">
    <div class="item-card__divImg">
      <img class="item-card__img" src="assets/image-outline.svg" alt="" id="previewImg">
    </div>
    <p class="item-card__name" id="previewName">Nome do item</p>
    <p class="item-card__quanty" id="previewQuanty">TOTAL: X unid.</p>
    <div class="item-card__div">
      <button class="item-card__btn" style="--clr: #132330;">-</button>
      <button class="item-card__btn" style="--clr: #4684B5;">+</button>
    </div>
  </article>
  <form action="" class="addItem__form">
    <label for="setItemImg" class="form__addItem">
      Clique ou arraste uma imagem.
      <input type="file" class="addItem__img" id="setItemImg" name="setItemImg" accept="image/png, image/jpeg, image/jpg, image/webp"/>
    </label>
    <input type="text" placeholder="Nome do item" class="addItem__input" id="setItemName">
    <input type="number" placeholder="Quantidade" class="addItem__input" id="setItemQuanty">
    <button type="button" class="addItem__btn" id="createItem">Criar item</button>
  </form>
</div>`
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
          setItemName.value = ""
          setItemQuanty.value = ""
          addingItem.style.opacity = "0"
          setTimeout(() => {
              addingItem.style.display = "none"
          }, 0);
      });
  }
}