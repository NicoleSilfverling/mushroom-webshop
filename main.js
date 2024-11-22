import "./scss/style.scss";
const cart = [];
const products = [
  {
    id: 0,
    name: "Kantarell",
    price: 100,
    category: "Matsvamp",
    rating: 5,
    amount: 0,
    img: {
      src: "./assets/images/products/chanterelle-mushroom.jpg",
      alt: "Kantarell",
    },
  },
  {
    id: 1,
    name: "Flugsvamp",
    price: 1000,
    category: "Giftig",
    rating: 0.3,
    amount: 0,
    img: {
      src: "./assets/images/products/fly-agaric-mushroom.jpg",
      alt: "Flugsvamp",
    },
  },
  {
    id: 2,
    name: "Discosvamp",
    price: 150,
    category: "Inredning",
    rating: 4,
    amount: 0,
    img: {
      src: "./assets/images/products/discoball-mushroom.jpg",
      alt: "Discokula formad som en svamp",
    },
  },
  {
    id: 3,
    name: "Portobello",
    price: 100,
    category: "Matsvamp",
    rating: 5,
    amount: 0,
    img: {
      src: "./assets/images/products/portobello.jpg",
      alt: "Portobello",
    },
  },
  {
    id: 4,
    name: "Fjällskivling",
    price: 30,
    category: "Matsvamp",
    rating: 1.3,
    amount: 0,
    img: {
      src: "./assets/images/products/parasol-mushroom.jpg",
      alt: "Fjällskivling",
    },
  },
  {
    id: 5,
    name: "Champinjon",
    price: 150,
    category: "Matsvamp",
    rating: 4,
    amount: 0,
    img: {
      src: "./assets/images/products/button-mushroom.jpg",
      alt: "Champinjon",
    },
  },
  {
    id: 6,
    name: "Korg",
    price: 675,
    category: "Verktyg och tillbehör",
    rating: 5,
    amount: 0,
    img: {
      src: "./assets/images/products/mushroom-basket.webp",
      alt: "Korg",
    },
  },
  {
    id: 7,
    name: "Julkula",
    price: 299,
    category: "Inredning",
    rating: 4.3,
    amount: 0,
    img: {
      src: "./assets/images/products/christmas-mushroom.jpg",
      alt: "Julkula formad som en flugsvamp",
    },
  },
  {
    id: 8,
    name: "Tvättsvamp",
    price: 25,
    category: "Verktyg och tillbehör",
    rating: 3,
    amount: 0,
    img: {
      src: "./assets/images/products/cleaning-sponge.jpg",
      alt: "Tvättsvamp",
    },
  },
  {
    id: 9,
    name: "Svampkniv",
    price: 300,
    category: "Verktyg och tillbehör",
    rating: 4.5,
    amount: 0,
    img: {
      src: "./assets/images/products/mushroom-knife.webp",
      alt: "Svampkniv med inbyggd borste",
    },
  },
];
let totalPrice = 0;
let starsRating = "";

const productContainer = document.querySelector("#productContainer");

const toggleTheme = document.querySelector("#toggleThemeBtn");
toggleTheme.addEventListener("click", toggleDarkLightMode);
let isThemeDark = false;

const cartContainer = document.querySelector("#cartItems");
const cartSummary = document.querySelector("#cartSummary");
const buyBtn = document.querySelector("#buyBtn");
buyBtn.addEventListener("click", printPurchaseConfirmation);

printProducts();

//---------------------------------------------------------------

/**
 * Prints all products
 */
function printProducts() {
  products.forEach((product, index) => {
    productContainer.innerHTML += `
        <article class="product-card">
          <img src=${product.img.src} alt=${product.img.alt}>
          <h2>${product.name}</h2>
          <h4>${product.price} kr</h4>
          <p>Betyg: ${product.rating}</p>
          <div id="ratingId" class="rating-icon-container"> ${printRating(
            product.rating
          )}</div>
          <button class="decrement" data-id="${index}">-</button>
          <input type="number" id="amount-${index}" value="${product.amount}">
          <button class="increment" data-id="${index}">+</button>
        </article>
      `;
  });
  const incrementBtns = document.querySelectorAll("button.increment");
  const decrementBtns = document.querySelectorAll("button.decrement");

  incrementBtns.forEach((btn) => {
    btn.addEventListener("click", increment);

    decrementBtns.forEach((btn) => {
      btn.addEventListener("click", decrement);
    });
  });
}
//--------------------------------------------------
/**
 * Increments products value by 1 and prints it
 */
function increment(e) {
  const id = e.target.dataset.id;
  products[id].amount += 1;
  const inputField = document.querySelector(`#amount-${id}`);
  inputField.value = products[id].amount;
  updateCart();
  printCart();
}

//-----------------------------------------------
/**
 * Decrements products value by 1 and prints it
 */

function decrement(e) {
  const id = e.target.dataset.id;

  if (products[id].amount < 1) {
    return;
  }
  products[id].amount -= 1;
  const inputField = document.querySelector(`#amount-${id}`);
  inputField.value = products[id].amount;
  updateCart();
  printCart();
}
//------------------------------------------------

function updateCart() {
  cart.length = 0;
  totalPrice = 0;

  products.forEach((product) => {
    if (product.amount > 0) {
      cart.push(product);
      totalPrice += product.amount * product.price;
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
    starsRating += `<img src="./assets/images/icons/star.png" alt="rating star">`;
  }
  if (rating % 1 != 0) {
    // if decimal add halfstar
    starsRating += `<img src="./assets/images/icons/star-half-empty.png" alt="rating star half empty">`;
  }
  return starsRating;
}
