import "./scss/style.scss";
import products from "./modules/products.mjs";
import { validateForm } from "./modules/form.mjs";

const cart = [];
let filteredProducts = [...products];
let totalPrice = 0;
let amountOfItemsInCart = 0;
let starsRating = "";
let isThemeDark = false;
let discountMessages = [];
let shippingInfo = {};

const productContainer = document.querySelector("#productContainer");
const toggleTheme = document.querySelector("#toggleThemeBtn");
const cartContainer = document.querySelector("#cartItems");
const cartSummary = document.querySelector("#cartSummary");
const shippingContainer = document.querySelector("#shipping");
const discountsContainer = document.querySelector("#discounts");
const itemsInCart = document.querySelector("#itemsInCart");
const goToCheckoutBtn = document.querySelector("#goToCheckout");
const sort = document.querySelector("#sort");
const filter = document.querySelector("#filter");
const checkout = document.querySelector("#checkout");
const checkoutForm = document.querySelector("#checkoutForm");
const countDown = document.querySelector("#countDown");

//EventListeners
toggleTheme.addEventListener("click", toggleDarkLightMode);
goToCheckoutBtn.addEventListener("click", goToCheckout);
sort.addEventListener("change", sortProducts);
filter.addEventListener("change", filterProducts);
checkoutForm.addEventListener("submit", handleSubmit);

priceChange();

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
  sort.value = ""; //reset sort
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
}

//------------------------------------------------

function updateCart() {
  cart.length = 0;
  amountOfItemsInCart = 0;

  products.forEach((product) => {
    if (product.amount > 0) {
      cart.push(product);
      amountOfItemsInCart += product.amount;
    }
  });
  if (amountOfItemsInCart > 0) {
    goToCheckoutBtn.removeAttribute("disabled"); // Enable functionality
  } else {
    goToCheckoutBtn.setAttribute("disabled", "");
  }
  applyDiscounts();
  calculatePrice();
  printCart();
  countDownOrderReset();
}

//------------------------------------------------

function calculatePrice() {
  totalPrice = 0;

  cart.forEach((product) => {
    totalPrice += product.amount * product.price;
  });

  totalPrice += calculateShipping(amountOfItemsInCart);
}

//------------------------------------------------

function printCart() {
  cartContainer.innerHTML = "";
  cart.forEach((product) => {
    const price = (product.amount * product.price).toFixed(2);
    const discount = (
      product.amount * product.originalPrice -
      product.amount * product.price
    ).toFixed(2);
    const originalPrice = (product.amount * product.originalPrice).toFixed(2);

    cartContainer.innerHTML += `
     <div class="item">
        <img src=${product.img.src} alt=${product.img.alt}>
        <div class="details">
          <h3>${product.name}</h3>
          <p class="price">${price} kr</p>
          ${
            product.originalPrice !== product.price
              ? `<p class="price discount">-${discount} kr</p>
                 <p class="price original-price">${originalPrice} kr</p>`
              : ""
          }
          <p class="quantity">Antal: ${product.amount}</p>
        </div>
      </div>
    `;
  });
  discountsContainer.innerHTML = discountMessages
    .map((message) => `<p>${message}</p>`)
    .join("");
  shippingContainer.innerHTML = `<span>${shippingInfo.message}</span>`;
  if (shippingInfo.shippingTotal !== 0) {
    shippingContainer.innerHTML += `<span>${shippingInfo.shippingTotal} kr</span>`;
  }
  cartSummary.innerHTML = `
    <p class="total-price">${totalPrice.toFixed(2)} kr</p>
  `;
  itemsInCart.innerHTML = `<div class="items-in-cart">${amountOfItemsInCart}</div>`;
}

//------------------------------------------------

function handleSubmit(e) {
  e.preventDefault(); //prevents page to reload on submit

  const formData = new FormData(checkoutForm);

  const errors = validateForm(formData);
  printFormValidationErrors(errors);
}

//------------------------------------------------

/**
 * Prints all form validation errors
 * @param {*} errors
 */
function printFormValidationErrors(errors) {
  clearPrintedErrors();

  // Prints error message
  Object.entries(errors).forEach(([field, message]) => {
    const errorElement = document.querySelector(`#${field}-error`);
    const input = document.querySelector(`#${field}-input`);

    if (errorElement) {
      errorElement.innerHTML = message;
      input.classList.add("input-error");
    }
  });
}
//------------------------------------------------

/**
 * Clear all printed error messages and removes error css class
 */
function clearPrintedErrors() {
  //Clear all printed error messages
  const errorElements = document.querySelectorAll("[id$='-error']"); // select all with id that ends with "-error"
  errorElements.forEach((error) => {
    error.innerHTML = "";
  });

  // Select all inputs with potential error messages
  const inputElements = document.querySelectorAll("[id$='-input']");

  // Clear all error classes from inputs
  inputElements.forEach((input) => {
    input.classList.remove("input-error");
  });
}

//------------------------------------------------

function clearCartAndForms() {
  //Clear form and error messages
  checkoutForm.reset();
  clearPrintedErrors();

  // Remove products added to cart
  products.forEach((product) => {
    product.amount = 0;
  });

  // update and print
  updateCart();
  printProducts();
  printCart();
}
//------------------------------------------------

/**
 * Timer that empties cart and form if inactive for 15 mins
 */

let timer;
function countDownOrderReset() {
  let sec = 0;
  let min = 15;

  if (timer) {
    clearInterval(timer);
  }

  timer = setInterval(function () {
    if (sec > 0) {
      sec -= 1;
    } else if (min > 0) {
      sec = 59;
      min -= 1;
    }

    countDown.innerHTML = `Tid kvar för att beställa: ${min}:${String(
      sec
    ).padStart(2, "0")}`;
    if (amountOfItemsInCart === 0) {
      clearInterval(timer);
      countDown.innerHTML = "";
    } else if (min === 0 && sec === 0) {
      clearInterval(timer);
      clearCartAndForms();
      countDown.innerHTML = "Du var för långsam, korgen tömdes!";
    }
  }, 1000);
}
//------------------------------------------------
/**
 * Go to checkout
 */

function goToCheckout() {
  checkout.classList.remove("hidden");
  checkout.scrollIntoView();
  countDownOrderReset(); // gives user 15 mins to finish order
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
    starsRating += `<img src="./icons/star.png" alt="hel stjärna">`;
  }
  if (rating % 1 != 0) {
    // if decimal add halfstar
    starsRating += `<img src="./icons/star-half-empty.png" alt="halv stjärna">`;
  }
  return starsRating;
}

//------------------------------------------------

//Weekend surcharge for products
function priceChange() {
  const today = new Date();
  const day = today.getDay(); // 0 Sunday to 6 Saturday
  const hour = today.getHours();

  if (
    (day === 5 && hour >= 15) ||
    day === 6 ||
    day === 0 ||
    (day === 1 && hour < 3)
  ) {
    products.forEach((product) => {
      product.price = Number((product.price * 1.15).toFixed(2)); // Adds 15% to price
    });
  }
}

//------------------------------------------------
/**
 * Apply discount to items in cart
 * @returns Array of string messages
 */

function applyDiscounts() {
  const today = new Date();
  const day = today.getDay(); // 0 Sunday to 6 Saturday
  const hour = today.getHours();

  discountMessages = []; // Stores all discount messages

  cart.forEach((product) => {
    // Check if we need to reset the price
    if (!product.originalPrice) {
      product.originalPrice = product.price; // Save the original price
    } else {
      product.price = product.originalPrice; // Reset to the original price
    }

    // Monday discount
    if (day === 1 && hour < 10) {
      product.price = product.price * 0.9; // Apply 10% discount

      if (
        !discountMessages.includes("Måndagsrabatt: 10 % på hela beställningen")
      ) {
        discountMessages.push("Måndagsrabatt: 10 % på hela beställningen");
      }
    }

    // Discount if 10 or more
    if (product.amount >= 10) {
      product.price = product.price * 0.9; // Apply 10% discount
      discountMessages.push(`Mängdrabatt: 10 % på ${product.name}`);
    }
  });
}

/**
 * Calculate shipping price
 *
 * @param {Number} amountOfItemsInCart
 * @returns {Number} Calculated shipping amount
 */
function calculateShipping(amountOfItemsInCart) {
  shippingInfo = {};
  if (amountOfItemsInCart > 15) {
    shippingInfo = { message: "Fri frakt", shippingTotal: 0 };
    return 0;
  } else {
    shippingInfo = {
      message: "Frakt: ",
      shippingTotal: (25 + totalPrice * 0.1).toFixed(2),
    };
    return 25 + totalPrice * 0.1;
  }
}

// TODO
// Om kunden har beställt för totalt mer än 800 kr ska det inte gå att välja faktura som betalsätt.
