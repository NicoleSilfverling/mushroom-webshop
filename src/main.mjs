import "./scss/style.scss";
import products from "./modules/products.mjs";
const cart = [];
let filteredProducts = [...products];
let totalPrice = 0;
let amountOfItemsInCart = 0;
let starsRating = "";
let isThemeDark = false;

const productContainer = document.querySelector("#productContainer");
const toggleTheme = document.querySelector("#toggleThemeBtn");
const cartContainer = document.querySelector("#cartItems");
const cartSummary = document.querySelector("#cartSummary");
const itemsInCart = document.querySelector("#itemsInCart");
const buyBtn = document.querySelector("#buyBtn");
const sort = document.querySelector("#sort");
const filter = document.querySelector("#filter");

//EventListeners
toggleTheme.addEventListener("click", toggleDarkLightMode);
buyBtn.addEventListener("click", printPurchaseConfirmation);
sort.addEventListener("change", sortProducts);
filter.addEventListener("change", filterProducts);

printProducts();

//---------------------------------------------------------------

/**
 * Prints all products
 */
function printProducts() {
  productContainer.innerHTML = "";
  filteredProducts.forEach((product, index) => {
    productContainer.innerHTML += `
        <article class="product-card">
          <img src=${product.img.src} alt=${product.img.alt}>
          <h2>${product.name}</h2>
          <h4>${product.price} kr</h4>
          <p>Betyg: ${product.rating}</p>
          <div id="ratingId" class="rating-icon-container"> ${printRating(
            product.rating
          )}</div>
          <button class="productCount" data-id="decrease-${
            product.id
          }">-</button>
          <input type="number" id="amount-${product.id}" value="${
      product.amount
    }">
          <button class="productCount" data-id="increase-${
            product.id
          }">+</button>
        </article>
      `;
  });
  const productCountBtns = document.querySelectorAll("button.productCount");

  productCountBtns.forEach((btn) => {
    btn.addEventListener("click", increaseDecreaseProductCount);
  });
}

//--------------------------------------------------
/**
 * Sort products
 */

function sortProducts(e) {
  filteredProducts.sort((product1, product2) => {
    switch (e.target.value) {
      case "ascPrice":
        return product1.price - product2.price;
      case "descPrice":
        return product2.price - product1.price;
      case "ascRating":
        return product1.rating - product2.rating;
      case "descRating":
        return product2.rating - product1.rating;
      case "ascName":
        if (product1.name < product2.name) {
          return -1;
        }
        if (product1.name > product2.name) {
          return 1;
        }
        return 0;
      case "descName":
        if (product2.name < product1.name) {
          return -1;
        }
        if (product2.name > product1.name) {
          return 1;
        }
        return 0;
      default:
        break;
    }
  });
  printProducts();
}

//--------------------------------------------------
/**
 * Filter products
 */

function filterProducts(e) {
  if (e.target.value === "") {
    filteredProducts = [...products];
  } else {
    filteredProducts = products.filter(
      (product) => product.category === e.target.value
    );
  }

  printProducts();
}

//--------------------------------------------------
/**
 * Increase or decrease product count by 1
 */
function increaseDecreaseProductCount(e) {
  const stringId = e.target.dataset.id;
  const id = stringId.replace(/^\D+-/, ""); //replace all non-digits and - with empty string
  if (stringId.includes("increase")) {
    products[id].amount += 1;
  } else {
    if (products[id].amount < 1) {
      return;
    }
    products[id].amount -= 1;
  }
  const inputField = document.querySelector(`#amount-${id}`);
  inputField.value = products[id].amount;
  updateCart();
  printCart();
}

//------------------------------------------------

function updateCart() {
  cart.length = 0;
  totalPrice = 0;
  amountOfItemsInCart = 0;

  products.forEach((product) => {
    if (product.amount > 0) {
      cart.push(product);
      totalPrice += product.amount * product.price;
      amountOfItemsInCart += product.amount;
    }
  });
}

function printCart() {
  cartContainer.innerHTML = "";

  cart.forEach((product) => {
    cartContainer.innerHTML += `
     <div class="item">
        <img src=${product.img.src} alt=${product.img.alt}>
        <div class="details">
          <h3>${product.name}</h3>
          <p class="price">${product.amount * product.price} kr</p>
          <p class="quantity">Antal: ${product.amount}</p>
        </div>
      </div>
    `;
  });
  cartSummary.innerHTML = `
          <p class="total-price">${totalPrice}</p>
  `;

  itemsInCart.innerHTML = `<div class="items-in-cart">${amountOfItemsInCart}</div>`;
}

//------------------------------------------------

/**
 * Purchase confirmation
 */

function printPurchaseConfirmation() {
  console.log("woho purchase made!");
  updateCart();
  console.table(cart);
}

//------------------------------------------------

/**
 * Toggle dark/light mode
 */
function toggleDarkLightMode() {
  isThemeDark = !isThemeDark;
  document.body.classList.toggle("dark-mode");

  isThemeDark
    ? (toggleTheme.innerHTML = "Ljust läge")
    : (toggleTheme.innerHTML = "Mörkt läge");
}

//------------------------------------------------

/**
 * Prints rating with star icons
 */
function printRating(rating) {
  starsRating = "";

  //floor removes decimal
  for (let index = 0; index < Math.floor(rating); index++) {
    starsRating += `<img src="./icons/star.png" alt="stjärna">`;
  }
  if (rating % 1 != 0) {
    // if decimal add halfstar
    starsRating += `<img src="./icons/star-half-empty.png" alt="halv stjärna">`;
  }
  return starsRating;
}
