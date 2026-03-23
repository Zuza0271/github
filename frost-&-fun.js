// -------- ÅBNINGSTIDER --------
const status = document.getElementById("status");

if (status) {
  const hour = new Date().getHours();

  if (hour >= 12 && hour < 20) {
    status.textContent = "Vi har åbent 🍦";
    status.style.color = "green";
  } else {
    status.textContent = "Vi er lukket";
    status.style.color = "red";
  }
}

// -------- PRODUKTER --------
const products = [
  { name: "Vaniljeis", price: 30, category: "Is" },
  { name: "Chokoladeis", price: 30, category: "Is" },
  { name: "Jordbæris", price: 30, category: "Is" },
  { name: "Mango sorbet", price: 32, category: "Is" },
  { name: "2 kugler (valgfri smag)", price: 55, category: "Is" },
  { name: "3 kugler (valgfri smag)", price: 75, category: "Is" },

  { name: "Vanilje milkshake", price: 45, category: "Milkshake" },
  { name: "Chokolade milkshake", price: 45, category: "Milkshake" },
  { name: "Jordbær milkshake", price: 45, category: "Milkshake" },
  { name: "Oreo milkshake", price: 50, category: "Milkshake" },
  { name: "Deluxe milkshake (med topping)", price: 55, category: "Milkshake" },

  { name: "Lille softice", price: 25, category: "Softice" },
  { name: "Mellem softice", price: 35, category: "Softice" },
  { name: "Stor softice", price: 45, category: "Softice" },

  { name: "Krymmel", price: 5, category: "Topping" },
  { name: "Chokoladesauce", price: 7, category: "Topping" },
  { name: "Karamelsauce", price: 7, category: "Topping" },
  { name: "Friske bær", price: 10, category: "Topping" },
  { name: "Oreo stykker", price: 10, category: "Topping" },
  { name: "Skumfiduser", price: 8, category: "Topping" },

  { name: "Vaffel", price: 5, category: "Ekstra" },
  { name: "Bæger", price: 0, category: "Ekstra" },
  { name: "Ekstra kugle", price: 20, category: "Ekstra" },
];

// -------- FÆLLES KURV --------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productsContainer = document.getElementById("products");
const cartItemsContainer = document.getElementById("cartItems");
const totalPriceElement = document.getElementById("totalPrice");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");
const payBtn = document.getElementById("payBtn");
const receiptDiv = document.getElementById("receipt");

// -------- VIS PRODUKTER PÅ PRODUKTER.HTML --------
if (productsContainer) {
  showProducts();
}

// -------- VIS KURV PÅ SIDER MED KURV --------
if (cartItemsContainer && totalPriceElement) {
  updateCart();
}

// -------- TØM KURV --------
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", function () {
    cart = [];
    localStorage.removeItem("cart");
    updateCart();

    if (receiptDiv) {
      receiptDiv.innerHTML = "";
    }
  });
}

// -------- GÅ TIL KURV.HTML --------
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", function () {
    if (cart.length === 0) {
      alert("Din kurv er tom!");
    } else {
      window.location.href = "kurv.html";
    }
  });
}

// -------- BETAL PÅ KURV.HTML --------
if (payBtn && receiptDiv) {
  payBtn.addEventListener("click", function () {
    if (cart.length === 0) {
      alert("Din kurv er tom!");
    } else {
      let total = 0;
      let itemsHTML = "";

      cart.forEach((item) => {
        itemsHTML += `<p>${item.name} - ${item.price} kr.</p>`;
        total += item.price;
      });

      const time = new Date().toLocaleTimeString();

      receiptDiv.innerHTML = `
        <h3>🧾 Kvittering</h3>
        ${itemsHTML}
        <p><strong>Samlet pris: ${total} kr.</strong></p>
        <p>Tidspunkt: ${time}</p>
        <p>Tak for din bestilling! 🍦</p>
      `;

      cart = [];
      localStorage.removeItem("cart");
      updateCart();
    }
  });
}

function showProducts() {
  const categories = {};

  products.forEach((product) => {
    if (!categories[product.category]) {
      categories[product.category] = [];
    }
    categories[product.category].push(product);
  });

  for (let category in categories) {
    const categoryTitle = document.createElement("h2");
    categoryTitle.textContent = category;
    categoryTitle.classList.add("category-title");
    productsContainer.appendChild(categoryTitle);

    categories[category].forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      productCard.innerHTML = `
        <h3>${product.name}</h3>
        <p>Pris: ${product.price} kr.</p>
        <button class="btn">Tilføj til kurv</button>
      `;

      const button = productCard.querySelector("button");

      button.addEventListener("click", function () {
        addToCart(product);
      });

      productsContainer.appendChild(productCard);
    });
  }
}

function addToCart(product) {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function updateCart() {
  if (!cartItemsContainer || !totalPriceElement) return;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Din kurv er tom.</p>";
    totalPriceElement.textContent = "Samlet pris: 0 kr.";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <p>${item.name} - ${item.price} kr.</p>
      <button class="btn remove-btn" data-index="${index}">Fjern</button>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  totalPriceElement.textContent = `Samlet pris: ${total} kr.`;

  const removeButtons = document.querySelectorAll(".remove-btn");

  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const itemIndex = this.dataset.index;
      removeFromCart(itemIndex);
    });
  });
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function goBack() {
  window.location.href = "produkter.html";
}

// -------- KONTAKTFORM --------
const form = document.getElementById("contactForm");
const response = document.getElementById("response");

if (form && response) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const time = new Date().toLocaleTimeString();

    response.textContent = `Tak ${name}! Din besked er sendt ✅ (kl. ${time})`;

    response.style.color = "green";

    form.reset();
  });
}
