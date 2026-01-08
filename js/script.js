"use strict";

const cartImg = document.querySelector(".cart__img");
const disLikeBtn = document.getElementById("dislike");
const likeBtn = document.getElementById("like");
const btns = document.querySelectorAll(".btn");
const catListElem = document.querySelector(".cat-list");
const cartElem = document.querySelector(".cart");
const modale = document.querySelector(".modale");
const modaleCloser = document.querySelector(".modale__closer");
const modaleImg = document.querySelector(".modale img");
const catRemoveBtn = document.querySelector(".cat-remove");
const catDownloadBtn = document.querySelector(".cat-download");

const catsList = [];

const baseUrl =
  "https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1";

const cartGnrat = async () => {
  cartImg.setAttribute("src", "./load.gif");
  const response = await fetch(baseUrl);
  const data = await response.json();
  const { url } = data[0];

  cartImg.setAttribute("src", url);
  likeBtn.addEventListener("click", () => likeCat(data[0]), { once: true });
};
const setLocale = () =>
  localStorage.setItem("cat-list", JSON.stringify(catsList));

const likeCat = (data) => {
  catsList.push(data);
  setLocale();
  cartGnrat();
};

const catsListLocale = JSON.parse(localStorage.getItem("cat-list"));
if (catsListLocale) catsListLocale.forEach((catCart) => catsList.push(catCart));

btns.forEach((btn) =>
  btn.addEventListener("click", () => {
    document.querySelector(".btn--active").classList.remove("btn--active");
    btn.classList.add("btn--active");
    const { page } = btn.dataset;

    if (page === "cart") {
      catListElem.classList.remove("cat-list--active");
      cartElem.classList.add("cart--active");
    } else if (page === "cat-list") {
      cartElem.classList.remove("cart--active");
      catListElem.classList.add("cat-list--active");
      gneraitor();
    }
  })
);

const gneraitor = () => {
  catListElem.innerHTML = "";
  if (catsList.length) {
    catsList.forEach((cart) =>
      catListElem.insertAdjacentHTML(
        "beforeend",
        `
    <li class="cat-list__item" onclick="showimage('${cart.id}')">
      <img src="${cart.url}" class="cat-list__img">
    </li>`
      )
    );
  } else {
    catListElem.innerHTML = `<li class="cat-list__item" style="width: 200px; height: 200px; cursor: default;">
      <img src="./mouse.svg" class="cat-list__img">
      <p class="cat-list__text">اینجا موش وجود دارد لطفا گربه بیاورید😅</p>
    </li>`;
  }
};

const showimage = (id) => {
  const target = catsList.find((cart) => cart.id === id);

  modaleImg.src = target.url;
  modale.classList.add("modale--active");
  catRemoveBtn.setAttribute("data-id", target.id);
  catDownloadBtn.setAttribute("href", target.url);
};

const closeModale = () => {
  modale.classList.remove("modale--active");
};

const removeCatCart = () => {
  const { id } = catRemoveBtn.dataset;
  const cartIndex = catsList.findIndex((cart) => cart.id === id);

  if (cartIndex > -1) {
    catsList.splice(cartIndex, 1);
  }

  setLocale();
  gneraitor();
  closeModale();
};

disLikeBtn.addEventListener("click", cartGnrat);
window.addEventListener("load", cartGnrat);
modaleCloser.addEventListener("click", closeModale);
catRemoveBtn.addEventListener("click", removeCatCart);
