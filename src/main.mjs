import "./scss/style.scss";
import products from "./modules/products.mjs";
import { validateForm, validateFormField } from "./modules/form.mjs";
import {
  prettyDate,
  calculateProductPrice,
  calculateProductOriginalPrice,
  calculateProductPriceDiscount,
} from "./modules/helpers.mjs";
import { validatePersonalId, validateGdpr } from "./modules/payment.mjs";

const cart = [];
let filteredProducts = [...products];
let totalPrice = 0;
let amountOfItemsInCart = 0;
let starsRating = "";
let isThemeDark = false;
let discountMessages = [];
let shippingInfo = {};
let selectedPaymentOption = "card";
let submittedForm = {};

const productContainer = document.querySelector("#productContainer");
const toggleTheme = document.querySelector("#toggleThemeBtn");
const cartContainer = document.querySelector("#cartItems");
const cartSummary = document.querySelector("#cartSummary");
const shippingContainer = document.querySelector("#shipping");
const discountsContainer = document.querySelector("#discounts");
const itemsInCart = document.querySelector("#itemsInCart");
const goToCheckoutBtn = document.querySelector("#goToCheckout");
const clearOrder = document.querySelector("#clearOrder");
const sort = document.querySelector("#sort");
const filter = document.querySelector("#filter");
const checkout = document.querySelector("#checkout");
const checkoutForm = document.querySelector("#checkoutForm");
const countDown = document.querySelector("#countDown");
const payment = document.querySelector("#payment");
const goToPaymentBtn = document.querySelector("#goToPayment");
const cardContainer = document.querySelector("#card");
const invoiceContainer = document.querySelector("#invoice");
const radios = document.querySelector("#radios");
const radioButtons = document.querySelectorAll('input[name="payment-option"]');
const payBtn = document.querySelector("#payBtn");
const orderSummary = document.querySelector("#orderSummary");

//Checkout form inputs
const inputs = [
  document.querySelector("#fname"),
  document.querySelector("#lname"),
  document.querySelector("#street"),
  document.querySelector("#zip"),
  document.querySelector("#city"),
  document.querySelector("#entrycode"),
  document.querySelector("#phone"),
  document.querySelector("#email"),
];
// payment form inputs
const personalId = document.querySelector("#personalId");
const gdpr = document.querySelector("#gdpr");

//EventListeners
toggleTheme.addEventListener("click", toggleDarkLightMode);
goToCheckoutBtn.addEventListener("click", goToCheckout);
clearOrder.addEventListener("click", clearCartAndForms);
sort.addEventListener("change", sortProducts);
filter.addEventListener("change", filterProducts);
checkoutForm.addEventListener("submit", goToPayment);
payBtn.addEventListener("click", submitPayment);
personalId.addEventListener("change", validatePayment);
gdpr.addEventListener("change", validatePayment);

inputs.forEach((input) => {
  input.addEventListener("focusout", (e) => {
    handleFocusOutForm(e);
  });
});

radioButtons.forEach((radio) => {
  radio.addEventListener("change", switchPaymentMethod);
});

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
          <img src=${product.img.src} alt=${
      product.img.alt
    } width="250" height="250">
          <h2>${product.name}</h2>
          <h4>${product.price} kr</h4>
          <p>Betyg: ${product.rating}</p>
          <div id="ratingId" class="rating-icon-container"> ${printRating(
            product.rating
          )}</div>
          <button class="productCount" data-id="decrease-${
            product.id
          }">-</button>
          <span id="amount-${product.id}" class="product-amount">${
      product.amount
    }</span>
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
  const amountField = document.querySelector(`#amount-${id}`);
  amountField.textContent = products[id].amount;
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
    const price = calculateProductPrice(product);
    const discount = calculateProductPriceDiscount(product);
    const originalPrice = calculateProductOriginalPrice(product);

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

  //displays amount of items in cart
  itemsInCart.innerHTML = `<div class="items-in-cart">${amountOfItemsInCart}</div>`;

  const itemsElement = itemsInCart.querySelector(".items-in-cart");

  // Add scale up
  itemsElement.classList.add("scale-up");

  // Remove scale-up after the transition to bring it back to normal size
  setTimeout(() => {
    itemsElement.classList.remove("scale-up");
  }, 300); // Match the CSS transition duration (0.3s)
}

//------------------------------------------------

/**
 * Validates form when focus out
 * @param {*} e
 */

function handleFocusOutForm(e) {
  const fieldName = e.target.id;
  const fieldValue = e.target.value;

  // Validate the field
  const error = validateFormField(fieldName, fieldValue);

  // Display validation errors
  printFormValidationErrors({ [fieldName]: error });

  // Validates full form
  const formData = new FormData(checkoutForm);
  const errors = validateForm(formData);

  //If no errors enable go to payment
  if (Object.keys(errors).length === 0) {
    goToPaymentBtn.removeAttribute("disabled");
  }
}

//------------------------------------------------

/**
 * Go to payment
 * @param {*} e
 */

function goToPayment(e) {
  e.preventDefault(); //prevents page to reload on submit

  const formData = new FormData(checkoutForm);

  formData.forEach((value, key) => {
    submittedForm[key] = value;
  });

  removeInvoiceOption();
  payment.classList.remove("hidden");
  payment.scrollIntoView();
}

//------------------------------------------------

/**
 * Prints all form validation errors
 * @param {*} errors
 */
function printFormValidationErrors(errors) {
  // Prints error message
  Object.entries(errors).forEach(([field, message]) => {
    const errorElement = document.querySelector(`#${field}-error`);
    const input = document.querySelector(`#${field}`);

    if (message) {
      errorElement.innerHTML = message;
      input.classList.add("input-error");
    } else {
      errorElement.innerHTML = "";
      input.classList.remove("input-error");
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
    error.innerHTML = ""; // Clear the error message
  });

  // Select all inputs with potential error messages
  const inputElements = document.querySelectorAll("input");

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

  //Reset checkout form
  checkout.classList.add("hidden");
  goToPaymentBtn.setAttribute("disabled", "");

  // update and print
  updateCart();
  printProducts();
  printCart();

  // Reset the payment
  payment.classList.add("hidden");
  const cardRadioButton = document.querySelector(
    'input[name="payment-option"][value="card"]'
  );
  cardRadioButton.checked = true;
  switchPaymentMethod(null, "card");
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
    starsRating += `<img src="./icons/star.png" class="star-icon" alt="hel stjärna" width="20" height="20">`;
  }
  if (rating % 1 != 0) {
    // if decimal add halfstar
    starsRating += `<img src="./icons/star-half-empty.png" class="star-icon" alt="halv stjärna" width="20" height="20">`;
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
//------------------------------------------------
/**
 * Calculate shipping price
 *
 * @param {Number} amountOfItemsInCart
 * @returns {Number} Calculated shipping amount
 */
function calculateShipping(amountOfItemsInCart) {
  shippingInfo = {};
  if (amountOfItemsInCart === 0) {
    shippingInfo = { message: "", shippingTotal: 0 };
    return null;
  } else if (amountOfItemsInCart > 15) {
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

//------------------------------------------------

function switchPaymentMethod(e, value) {
  // If event is passed, use its value, else use the manual value
  let paymentMethod = e ? e.target.value : value;

  if (paymentMethod == "card") {
    cardContainer.classList.remove("hidden");
    invoiceContainer.classList.add("hidden");
  } else {
    cardContainer.classList.add("hidden");
    invoiceContainer.classList.remove("hidden");
  }

  selectedPaymentOption = paymentMethod;

  validatePayment();
}

//------------------------------------------------
/**
 * Hide invoice option
 */
function removeInvoiceOption() {
  if (totalPrice > 800) {
    radios.classList.add("hidden");
    cardContainer.classList.remove("hidden");
    invoiceContainer.classList.add("hidden");
  } else {
    radios.classList.remove("hidden");
  }
}

function validatePayment() {
  const personalIdError = document.querySelector("#personalIdError");
  const gdprError = document.querySelector("#gdprError");

  // Clear error messages
  personalIdError.textContent = "";
  gdprError.textContent = "";

  // Validate GDPR
  const gdprErrorMessage = validateGdpr(gdpr);
  if (gdprErrorMessage) {
    gdprError.textContent = gdprErrorMessage;
    return payBtn.setAttribute("disabled", "");
  }

  // Handle invoice payment option
  if (selectedPaymentOption === "invoice") {
    const personalIdErrorMessage = validatePersonalId(personalId);
    if (personalIdErrorMessage) {
      personalIdError.textContent = personalIdErrorMessage;
      return payBtn.setAttribute("disabled", "");
    }
  }

  // Enable the button if all validations pass
  payBtn.removeAttribute("disabled");
}

function submitPayment(e) {
  e.preventDefault();
  printOrderSummary();
}

function printOrderSummary() {
  const today = new Date();
  const nextThreeDays = new Date(today);
  nextThreeDays.setDate(today.getDate() + 3);

  orderSummary.innerHTML = `
    <h2>Order bekräftelse</h2>
    <p>Tack för din beställning ${submittedForm.fname}!</p>
    <p>Orderbekräftelse skickas till ${submittedForm.email} inom kort.</p>
    <p>Datum: ${prettyDate(today)}</p>
    <h3>Skickas till</h3>
    <p>${submittedForm.street}</p>
    <p>${submittedForm.city}</p>
    <p>${submittedForm.zip}</p>
    <p>Leverans datum: ${prettyDate(nextThreeDays)}</p>
    <h3>Produkter</h3>
    <div id="productList">
      <!-- Rows will be dynamically inserted here -->
    </div>
    <p id="finalShipping"></p>
    <h3>Totalt: ${totalPrice}</h3>

  `;

  const productList = document.getElementById("productList");
  const finalShipping = document.getElementById("finalShipping");

  finalShipping.innerHTML = `<span>${shippingInfo.message}</span>`;
  if (shippingInfo.shippingTotal !== 0) {
    finalShipping.innerHTML += `<span>${shippingInfo.shippingTotal} kr</span>`;
  }

  productList.innerHTML = "";

  cart.forEach((product) => {
    const price = calculateProductPrice(product);
    const discount = calculateProductPriceDiscount(product);
    const originalPrice = calculateProductOriginalPrice(product);

    productList.innerHTML += `
        <h4>${product.name}</h4>
        <p>Pris: ${product.price} kr</p>
        <p>Antal: ${product.amount}</p>
        <p>Totalt: ${price} kr</p>
        ${
          product.originalPrice !== product.price
            ? `<p class="discount">Rabatt: ${discount}</p>
            <p class="original-price">Ordinarie pris: ${originalPrice}</p>`
            : ""
        }
    `;
  });
}
