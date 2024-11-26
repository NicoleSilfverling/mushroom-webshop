import "./scss/style.scss";
const cart = [];
const products = [
  {
    id: 0,
    name: "Kantarell",
    price: 100,
    category: "food",
    rating: 5,
    amount: 0,
    img: {
      src: "./products/chanterelle-mushroom.jpg",
      alt: "Kantarell",
    },
  },
  {
    id: 1,
    name: "Flugsvamp",
    price: 1000,
    category: "poisonous",
    rating: 0.3,
    amount: 0,
    img: {
      src: "./products/fly-agaric-mushroom.jpg",
      alt: "Flugsvamp",
    },
  },
  {
    id: 2,
    name: "Discosvamp",
    price: 150,
    category: "decor",
    rating: 4,
    amount: 0,
    img: {
      src: "./products/discoball-mushroom.jpg",
      alt: "Discokula formad som en svamp",
    },
  },
  {
    id: 3,
    name: "Portobello",
    price: 100,
    category: "food",
    rating: 5,
    amount: 0,
    img: {
      src: "./products/portobello.jpg",
      alt: "Portobello",
    },
  },
  {
    id: 4,
    name: "Fjällskivling",
    price: 30,
    category: "food",
    rating: 1.3,
    amount: 0,
    img: {
      src: "./products/parasol-mushroom.jpg",
      alt: "Fjällskivling",
    },
  },
  {
    id: 5,
    name: "Champinjon",
    price: 150,
    category: "food",
    rating: 4,
    amount: 0,
    img: {
      src: "./products/button-mushroom.jpg",
      alt: "Champinjon",
    },
  },
  {
    id: 6,
    name: "Korg",
    price: 675,
    category: "tools",
    rating: 5,
    amount: 0,
    img: {
      src: "./products/mushroom-basket.webp",
      alt: "Korg",
    },
  },
  {
    id: 7,
    name: "Julkula",
    price: 299,
    category: "decor",
    rating: 4.3,
    amount: 0,
    img: {
      src: "./products/christmas-mushroom.jpg",
      alt: "Julkula formad som en flugsvamp",
    },
  },
  {
    id: 8,
    name: "Tvättsvamp",
    price: 25,
    category: "tools",
    rating: 3,
    amount: 0,
    img: {
      src: "./products/cleaning-sponge.jpg",
      alt: "Tvättsvamp",
    },
  },
  {
    id: 9,
    name: "Svampkniv",
    price: 300,
    category: "tools",
    rating: 4.5,
    amount: 0,
    img: {
      src: "./products/mushroom-knife.webp",
      alt: "Svampkniv med inbyggd borste",
    },
  },
];
let filteredProducts = [...products];
let totalPrice = 0;
let amountOfItemsInCart = 0;
let starsRating = "";

const productContainer = document.querySelector("#productContainer");

const toggleTheme = document.querySelector("#toggleThemeBtn");
toggleTheme.addEventListener("click", toggleDarkLightMode);
let isThemeDark = false;

const cartContainer = document.querySelector("#cartItems");
const cartSummary = document.querySelector("#cartSummary");
const itemsInCart = document.querySelector("#itemsInCart");
const buyBtn = document.querySelector("#buyBtn");
buyBtn.addEventListener("click", printPurchaseConfirmation);

const sort = document.querySelector("#sort");
sort.addEventListener("change", sortProducts);

const filter = document.querySelector("#filter");
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
          <button class="decrement" data-id="${product.id}">-</button>
          <input type="number" id="amount-${product.id}" value="${
      product.amount
    }">
          <button class="increment" data-id="${product.id}">+</button>
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
    starsRating += `<img src="./icons/star.png" alt="rating star">`;
  }
  if (rating % 1 != 0) {
    // if decimal add halfstar
    starsRating += `<img src="./icons/star-half-empty.png" alt="rating star half empty">`;
  }
  return starsRating;
}
