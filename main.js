import "./sass/style.scss";

const productContainer = document.querySelector("#productContainer");
console.log(productContainer);

const mushrooms = [
  {
    id: 0,
    name: "Kantarell",
    price: 100,
    category: "Matsvamp",
    rating: 5,
    img: {
      src: "", //img src
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
      src: "", //img src
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
      src: "", //img src
      alt: "Discokula formad som en svamp",
    },
  },
];

function printProducts() {
  mushrooms.forEach((mushroom) => {
    console.log(mushroom);
    productContainer.innerHTML += `
        <article class="product-card">
          <h4>${mushroom.name}</h4>
          <p>${mushroom.price} kr</p>
          <p>Rating: ${mushroom.rating}</p>
        </article>
      `;
  });
}

printProducts();
