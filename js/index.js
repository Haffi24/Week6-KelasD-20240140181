
const API_URL = "https://dummyjson.com/products?limit=100";

const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const productGrid = document.getElementById("productGrid");
const statusElement = document.getElementById("status");

let products = [];

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(price);
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const imageContainer = document.createElement("div");
  imageContainer.className = "product-image";

  const image = document.createElement("img");
  image.src = product.thumbnail;
  image.alt = product.title;
  image.loading = "lazy";

  image.addEventListener("error", function () {
    imageContainer.textContent = "Gambar tidak tersedia";
  });

  imageContainer.appendChild(image);

  const info = document.createElement("div");
  info.className = "product-info";

  const category = document.createElement("span");
  category.className = "product-category";
  category.textContent = product.category || "Lainnya";

  const title = document.createElement("h2");
  title.textContent = product.title;

  const description = document.createElement("p");
  description.className = "product-description";
  description.textContent = product.description;

  const bottom = document.createElement("div");
  bottom.className = "product-bottom";

  const price = document.createElement("span");
  price.className = "product-price";
  price.textContent = formatPrice(product.price);

  const rating = document.createElement("span");
  rating.className = "product-rating";
  rating.textContent = `★ ${product.rating}`;

  bottom.append(price, rating);
  info.append(category, title, description, bottom);
  card.append(imageContainer, info);

  return card;
}

function renderProducts(items) {
  productGrid.replaceChildren();

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Produk tidak ditemukan.";
    productGrid.appendChild(empty);
    statusElement.textContent = "Tidak ada hasil yang cocok.";
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach(function (product) {
    fragment.appendChild(createProductCard(product));
  });

  productGrid.appendChild(fragment);
  statusElement.textContent = `${items.length} produk ditemukan`;
}

function populateCategories(items) {
  const categories = [...new Set(
    items.map(function (product) {
      return product.category;
    })
  )].sort();

  categories.forEach(function (category) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

function filterProducts() {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedCategory = categorySelect.value;

  const filteredProducts = products.filter(function (product) {
    const matchesName = product.title.toLowerCase().includes(keyword);
    const matchesCategory = !selectedCategory ||
      product.category === selectedCategory;

    return matchesName && matchesCategory;
  });

  renderProducts(filteredProducts);
}

async function fetchProducts() {
  statusElement.className = "";
  statusElement.textContent = "Memuat produk...";
  productGrid.replaceChildren();

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.products)) {
      throw new Error("Format data tidak valid");
    }

    products = data.products;
    populateCategories(products);
    renderProducts(products);
  } catch (error) {
    statusElement.className = "error";
    statusElement.textContent =
      "Gagal memuat produk. Periksa koneksi internet dan coba muat ulang halaman.";

    const retryButton = document.createElement("button");
    retryButton.type = "button";
    retryButton.textContent = "Coba Lagi";
    retryButton.addEventListener("click", fetchProducts);

    statusElement.appendChild(document.createTextNode(" "));
    statusElement.appendChild(retryButton);

    console.error("Fetch produk gagal:", error);
  }
}

searchInput.addEventListener("input", filterProducts);
categorySelect.addEventListener("change", filterProducts);

fetchProducts();
