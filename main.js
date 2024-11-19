import "./src/assets/scss/style.scss";

const productContainer = document.querySelector("#productContainer");

const toggleTheme = document.querySelector("#toggleThemeBtn");
toggleTheme.addEventListener("click", toggleDarkLightMode);
let isThemeDark = false;

const basketContainer = document.querySelector("#basket");
let basket = [];

const mushrooms = [
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
    rating: 1,
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
printBasket();

//---------------------------------------------------------------

/**
 * Prints all products
 */
function printProducts() {
  mushrooms.forEach((mushroom, index) => {
    console.log(mushroom);
    productContainer.innerHTML += `
        <article class="product-card">
          <img src=${mushroom.img.src} alt=${mushroom.img.alt}>
          <h2>${mushroom.name}</h2>
          <h4>${mushroom.price} kr</h4>
          <p>Rating: ${mushroom.rating}</p>
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
  mushrooms[id].amount += 1;
  const inputField = document.querySelector(`#amount-${id}`);
  inputField.value = mushrooms[id].amount;
  printBasket();
}

//-----------------------------------------------
/**
 * Decrements products value by 1 and prints it
 */

function decrement(e) {
  const id = e.target.dataset.id;

  if (mushrooms[id].amount < 1) {
    return;
  }
  mushrooms[id].amount -= 1;
  const inputField = document.querySelector(`#amount-${id}`);
  inputField.value = mushrooms[id].amount;
  printBasket();
}

//------------------------------------------------

/**
 * Print basket
 * @todo save items in array
 */

function printBasket() {
  basketContainer.innerHTML = ""; //reset message
  mushrooms.forEach((product) => {
    if (product.amount > 0) {
      basketContainer.innerHTML += `<li>${product.name} ${product.amount}</li>`;
    }
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
