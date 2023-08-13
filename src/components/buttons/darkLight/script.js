let darkLight = document.getElementById("darkLight")
let background = document.querySelector(".background")
let box = document.querySelector(".box")
let body = document.querySelector("body")

darkLight.onclick = function () {
    if (background.classList.contains("dark") == false) {
        background.classList.add("dark")
        body.classList.add("dark")
        localStorage.setItem("theme", "dark")
    } else {
        background.classList.remove("dark")
        body.classList.remove("dark")
        localStorage.setItem("theme", "light")
    }
}

if (localStorage.theme == "dark") {
    background.classList.add("dark")
    body.classList.add("dark")
    darkLight.checked = false
}