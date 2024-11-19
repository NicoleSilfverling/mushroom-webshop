import "./src/assets/scss/style.scss";

const productContainer = document.querySelector("#productContainer");

const toggleTheme = document.querySelector("#toggleThemeBtn");
toggleTheme.addEventListener("click", toggleDarkLightMode);
let isThemeDark = false;
const mushrooms = [
  {
    id: 0,
    name: "Kantarell",
    price: 100,
    category: "Matsvamp",
    rating: 5,
    img: {
      src: "/mushroom.png",
      alt: "Kantarell",
    },
  },
  {
    id: 1,
    name: "Flugsvamp",
    price: 1000,
    category: "Giftig",
    rating: 1,
    img: {
      src: "/mushroom.png",
      alt: "Flugsvamp",
    },
  },
  {
    id: 2,
    name: "Discosvamp",
    price: 150,
    category: "Prydnad",
    rating: 4,
    img: {
      src: "/mushroom.png",
      alt: "Discokula formad som en svamp",
    },
  },
];

printProducts();

//---------------------------------------------------------------

/**
 * Prints all products
 */
function printProducts() {
  mushrooms.forEach((mushroom) => {
    console.log(mushroom);
    productContainer.innerHTML += `
        <article class="product-card">
          <img src=${mushroom.img.src} alt=${mushroom.img.alt}>
          <h2>${mushroom.name}</h2>
          <h4>${mushroom.price} kr</h4>
          <p>Rating: ${mushroom.rating}</p>
          <button>-</button>
          <button>+</button>
        </article>
      `;
  });
}
//---------------------------------------------------------------

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
