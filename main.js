import "./src/assets/scss/style.scss";

const productContainer = document.querySelector("#productContainer");

const toggleTheme = document.querySelector("#toggleThemeBtn");
toggleTheme.addEventListener("click", toggleDarkLightMode);
let isThemeDark = false;

const cartContainer = document.querySelector("#cart");

let starsRating = "";

const products = [
  {
    id: 0,
    name: "Kantarell",
    price: 100,
    category: "Matsvamp",
    rating: 5,
    amount: 0,
    img: {
      src: "src/assets/images/chanterelle-mushroom.jpg",
      alt: "Kantarell",
    },
  },
  {
    id: 1,
    name: "Flugsvamp",
    price: 1000,
    category: "Giftig",
    rating: 1.3,
    amount: 0,
    img: {
      src: "src/assets/images/fly-agaric-mushroom.jpg",
      alt: "Flugsvamp",
    },
  },
  {
    id: 2,
    name: "Discosvamp",
    price: 150,
    category: "Prydnad",
    rating: 4,
    amount: 0,
    img: {
      src: "/src/assets/images/discoball-mushroom.jpg",
      alt: "Discokula formad som en svamp",
    },
  },
];

printProducts();
printAndAddToCart();

//---------------------------------------------------------------

/**
 * Prints all products
 */
function printProducts() {
  products.forEach((mushroom, index) => {
    console.log(mushroom);
    productContainer.innerHTML += `
        <article class="product-card">
          <img src=${mushroom.img.src} alt=${mushroom.img.alt}>
          <h2>${mushroom.name}</h2>
          <h4>${mushroom.price} kr</h4>
          <p>Rating: ${mushroom.rating}</p>
          <div id="ratingId" class="rating-icon-container"> ${rating(
            mushroom.rating
          )}</div>
          <button class="decrement" data-id="${index}">-</button>
          <input type="number" id="amount-${index}" value="${mushroom.amount}">
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
  printAndAddToCart();
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
  printAndAddToCart();
}

//------------------------------------------------

/**
 * Print basket
 *
 * @todo Print carts total price
 *
 */

function printAndAddToCart() {
  const cart = [];

  products.forEach((product) => {
    if (product.amount > 0) {
      cart.push(product);
    }
  });
  cartContainer.innerHTML = "";

  cart.forEach((product) => {
    cartContainer.innerHTML += `
      <div>
        ${product.name}: ${product.amount} st - ${
      product.amount * product.price
    } kr
      </div>
    `;
  });
}

//------------------------------------------------

/**
 * Toggle dark/light mode
 */
function toggleDarkLightMode() {
  isThemeDark = !isThemeDark;
  document.body.classList.toggle("dark-mode");

  isThemeDark
    ? (toggleTheme.innerHTML = "Light mode")
    : (toggleTheme.innerHTML = "Dark mode");
}

//------------------------------------------------

/**
 * Rating
 * @todo change emojis to icons, add halfstar function
 */
function rating(rating) {
  starsRating = "";

  //floor removes decimal
  for (let index = 0; index < Math.floor(rating); index++) {
    starsRating += `<img src="./src/assets/images/star.png" alt="rating star">`;
  }
  if (rating % 1 != 0) {
    // if decimal add halfstar
    starsRating += `<img src="./src/assets/images/star-half-empty.png" alt="rating star half empty">`;
  }
  return starsRating;
}
