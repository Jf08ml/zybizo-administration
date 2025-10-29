<template>
  <q-page class="catalog-page">
    <!-- Header Section -->
    <section class="catalog-header">
      <div class="header-content">
        <h1 class="catalog-title">
          Catálogo <span class="brand-accent">Galaxia Glamour Store</span>
        </h1>
        <p class="catalog-subtitle">
          Descubre nuestra colección completa de pestañas profesionales e
          insumos especializados
        </p>
      </div>
    </section>

    <!-- Search and Filters Section -->
    <section class="search-section">
      <div class="search-container">
        <div class="search-wrapper">
          <q-input
            v-model="searchTerm"
            rounded
            outlined
            placeholder="Buscar productos..."
            class="search-input"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="search" color="grey-6" />
            </template>
          </q-input>
        </div>

        <!-- Filter Chips -->
        <div class="filter-chips">
          <q-chip
            v-for="category in categories"
            :key="category.value"
            :selected="selectedCategory === category.value"
            @click="toggleCategory(category.value)"
            :color="selectedCategory === category.value ? 'black' : 'grey-3'"
            :text-color="
              selectedCategory === category.value ? 'white' : 'grey-8'
            "
            clickable
            class="filter-chip"
          >
            <q-icon :name="category.icon" size="18px" class="q-mr-xs" />
            {{ category.label }}
          </q-chip>
        </div>
      </div>
    </section>

    <!-- Results Info -->
    <section class="results-info">
      <div class="results-container">
        <p class="results-text">
          <span class="results-count">{{ filteredProducts.length }}</span>
          producto{{ filteredProducts.length !== 1 ? "s" : "" }} encontrado{{
            filteredProducts.length !== 1 ? "s" : ""
          }}
        </p>
        <q-btn
          v-if="selectedCategory"
          flat
          dense
          @click="clearFilters"
          color="grey-8"
          icon="clear"
          label="Limpiar filtros"
          class="clear-btn"
        />
      </div>
    </section>

    <!-- Products Grid -->
    <section class="products-section">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <q-spinner-gears size="60px" color="black" />
        <p class="loading-text">Cargando productos...</p>
      </div>

      <!-- Products Grid -->
      <div v-else-if="filteredProducts.length > 0" class="products-grid">
        <div
          v-for="product in filteredProducts"
          :key="product._id"
          class="product-item"
        >
          <ProductCard :product="product" class="product-card-enhanced" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <q-icon name="search_off" size="64px" color="grey-5" />
        <h3 class="empty-title">No se encontraron productos</h3>
        <p class="empty-subtitle">
          Intenta con otros términos de búsqueda o cambia los filtros
        </p>
        <q-btn
          v-if="searchTerm || selectedCategory"
          rounded
          unelevated
          color="black"
          label="Ver todos los productos"
          @click="clearAllFilters"
          class="q-mt-md"
        />
      </div>
    </section>

    <!-- Info Dialog -->
    <q-dialog v-model="showPopup">
      <q-card class="info-dialog">
        <!-- Close Button -->
        <q-btn
          flat
          round
          dense
          icon="close"
          class="close-dialog-btn"
          @click="showPopup = false"
        />

        <q-card-section class="dialog-header">
          <div class="dialog-icon">
            <q-icon name="info" size="32px" color="white" />
          </div>
          <h3 class="dialog-title">¡Bienvenida a Galaxia Glamour Store!</h3>
          <p class="dialog-subtitle">Tu distribuidora de confianza</p>
        </q-card-section>

        <q-card-section class="dialog-content">
          <div class="payment-info">
            <img
              src="https://ik.imagekit.io/6cx9tc1kx/galaxia-store/pago-contraentrega?updatedAt=1761766493364"
              class="payment-img"
              ratio="16/9"
            />
          </div>
          <div class="info-steps">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content">
                <h4>Explora nuestros productos</h4>
                <p>Navega por nuestro catálogo especializado</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content">
                <h4>Añade al carrito</h4>
                <p>Selecciona los productos que necesitas</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content">
                <h4>Realiza tu pedido</h4>
                <p>Finaliza tu compra de forma segura</p>
              </div>
            </div>
          </div>

          <div class="contact-info">
            <p class="contact-text">
              <strong>¿Necesitas asesoría profesional?</strong><br />
              Contáctanos para precios al por mayor y soporte técnico
            </p>
          </div>
        </q-card-section>

        <q-card-actions class="dialog-actions">
          <q-btn
            unelevated
            rounded
            color="black"
            text-color="white"
            label="¡Entendido, empecemos!"
            @click="showPopup = false"
            class="dialog-btn"
            size="md"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onUnmounted, computed } from "vue";
import { getProductsCatalog } from "../../services/productService.js";
import { useCategoryStore } from "../../stores/categories";
import ProductCard from "./cards/ProductCard.vue";

// Stores
const categoryStore = useCategoryStore();

// Estado reactivo
const products = ref([]);
const searchTerm = ref("");
const showPopup = ref(false);
const selectedCategory = ref("");
const loading = ref(false);

// Categorías computadas desde el store
const categories = computed(() => {
  const allCategories = [{ value: "", label: "Todos", icon: "apps" }];

  // Agregar categorías del store con sus íconos
  categoryStore.categories.forEach((cat) => {
    allCategories.push({
      value: cat._id,
      label: cat.name,
      icon: cat.icon || "category",
    });
  });

  return allCategories;
});

// Computed properties
const filteredProducts = computed(() => {
  let filtered = products.value;

  // Filtrar por búsqueda
  if (searchTerm.value) {
    const searchLower = searchTerm.value.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchLower) ||
        product.namePublic?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.characteristics?.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower)
    );
  }

  // Filtrar por categoría usando el _id de la categoría
  if (selectedCategory.value) {
    filtered = filtered.filter((product) => {
      // Si el producto tiene categoría poblada
      if (product.category && typeof product.category === "object") {
        return product.category._id === selectedCategory.value;
      }
      // Si la categoría es solo el ID
      return product.category === selectedCategory.value;
    });
  }

  return filtered;
});

// Lifecycle hooks
onBeforeMount(async () => {
  // Cargar categorías primero
  if (!categoryStore.categories.length) {
    await categoryStore.fetchCategories();
  }
  // Luego cargar productos
  await getAllProducts();
});

onMounted(() => {
  checkFirstVisit();
  window.addEventListener("beforeunload", clearLocalStorage);
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", clearLocalStorage);
});

// Métodos
const checkFirstVisit = () => {
  if (!localStorage.getItem("catalogVisited")) {
    showPopup.value = true;
    localStorage.setItem("catalogVisited", "true");
  }
};

const clearLocalStorage = () => {
  localStorage.removeItem("catalogVisited");
};

const getAllProducts = async () => {
  loading.value = true;
  try {
    const response = await getProductsCatalog();
    console.log("Productos del catálogo:", response);

    // La API puede devolver con o sin paginación
    const productsData = response.data?.data || response.data || [];

    products.value = productsData.map((product) => ({
      ...product,
      slideIndex: 0,
      // Asegurar que tengamos el rating inicializado
      rating: product.rating || 4.5,
    }));

    console.log("Productos cargados:", products.value.length);
  } catch (error) {
    console.error("Error al cargar productos del catálogo:", error);
    products.value = [];
  } finally {
    loading.value = false;
  }
};

const toggleCategory = (category) => {
  selectedCategory.value = selectedCategory.value === category ? "" : category;
};

const clearFilters = () => {
  selectedCategory.value = "";
};

const clearAllFilters = () => {
  searchTerm.value = "";
  selectedCategory.value = "";
};
</script>

<style scoped>
/* Page Layout */
.catalog-page {
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
  min-height: 100vh;
}

/* Header Section */
.catalog-header {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  color: white;
  padding: 60px 20px 40px;
  margin-bottom: 40px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.catalog-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 16px;
  line-height: 1.2;
}

.brand-accent {
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.catalog-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
}

/* Search Section */
.search-section {
  padding: 0 20px 32px;
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-wrapper {
  margin-bottom: 24px;
}

.search-input {
  max-width: 600px;
  margin: 0 auto;
  font-size: 16px;
}

.search-input :deep(.q-field__control) {
  border-radius: 50px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 2px solid #e0e0e0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  min-height: 52px;
}

.search-input :deep(.q-field__control):hover {
  border-color: #999;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.search-input :deep(.q-field--focused .q-field__control) {
  border-color: #000000;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.search-input :deep(.q-field__native) {
  font-weight: 500;
}

/* Filter Chips */
.filter-chips {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-chip {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  font-size: 13px;
  border-radius: 20px;
  padding: 8px 16px;
}

.filter-chip:not(.q-chip--selected) {
  background: white !important;
  border: 1.5px solid #e0e0e0;
}

.filter-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  border-color: #000;
}

.filter-chip.q-chip--selected {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

/* Results Info */
.results-info {
  padding: 0 20px 24px;
}

.results-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.results-text {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
}

.results-count {
  font-weight: 600;
  color: #000;
}

.clear-btn {
  font-size: 0.875rem;
}

/* Products Grid */
.products-section {
  padding: 0 20px 60px;
  min-height: 400px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 20px;
}

.loading-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.products-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.product-item {
  display: flex;
}

.product-card-enhanced {
  width: 100%;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  max-width: 400px;
  margin: 0 auto;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 16px 0 8px;
}

.empty-subtitle {
  color: #666;
  margin: 0 0 24px;
}

/* Info Dialog */
.info-dialog {
  max-width: 520px;
  width: 100%;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.close-dialog-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.close-dialog-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.dialog-header {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  color: white;
  text-align: center;
  padding: 40px 24px 32px;
  position: relative;
}

.dialog-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  backdrop-filter: blur(10px);
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 8px;
  line-height: 1.3;
}

.dialog-subtitle {
  opacity: 0.9;
  margin: 0;
  font-size: 1rem;
}

.dialog-content {
  padding: 32px 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.info-steps {
  margin-bottom: 24px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

.step-item:nth-child(1) {
  animation-delay: 0.1s;
}
.step-item:nth-child(2) {
  animation-delay: 0.2s;
}
.step-item:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-number {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  margin-right: 16px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.step-content h4 {
  margin: 0 0 4px;
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.step-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.payment-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
}

.payment-img {
  border-radius: 8px;
  width: 100%;
  height: auto;
}

.contact-info {
  background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 1px solid #e0e0e0;
}

.contact-text {
  margin: 0;
  color: #333;
  font-size: 0.95rem;
  line-height: 1.6;
}

.dialog-actions {
  padding: 20px 24px 24px;
  justify-content: center;
  background: #fafafa;
}

.dialog-btn {
  padding: 12px 32px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  min-width: 200px;
}

.dialog-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

/* Responsive Design */
@media (max-width: 768px) {
  .catalog-title {
    font-size: 2rem;
  }

  .catalog-subtitle {
    font-size: 1rem;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .filter-chips {
    gap: 8px;
  }

  .results-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .search-section {
    padding: 0 16px 24px;
  }

  .results-info {
    padding: 0 16px 20px;
  }

  .products-section {
    padding: 0 16px 40px;
  }
}

@media (max-width: 480px) {
  .catalog-header {
    padding: 40px 12px 32px;
  }

  .catalog-title {
    font-size: 1.75rem;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .filter-chips {
    justify-content: flex-start;
  }

  .search-input {
    max-width: 100%;
  }

  .search-section {
    padding: 0 12px 20px;
  }

  .results-info {
    padding: 0 12px 16px;
  }

  .products-section {
    padding: 0 12px 32px;
  }

  /* Dialog Mobile Styles */
  .info-dialog {
    max-width: calc(100vw - 32px);
    margin: 16px;
  }

  .dialog-header {
    padding: 32px 20px 24px;
  }

  .dialog-title {
    font-size: 1.25rem;
  }

  .dialog-subtitle {
    font-size: 0.9rem;
  }

  .dialog-icon {
    width: 56px;
    height: 56px;
  }

  .dialog-icon .q-icon {
    font-size: 28px;
  }

  .dialog-content {
    padding: 24px 20px;
    max-height: 50vh;
  }

  .step-item {
    margin-bottom: 16px;
  }

  .step-number {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .step-content h4 {
    font-size: 0.95rem;
  }

  .step-content p {
    font-size: 0.85rem;
  }

  .payment-info {
    padding: 10px;
  }

  .contact-info {
    padding: 16px;
  }

  .contact-text {
    font-size: 0.85rem;
  }

  .dialog-actions {
    padding: 16px 20px 20px;
  }

  .dialog-btn {
    min-width: 100%;
    padding: 12px 24px;
    font-size: 0.95rem;
  }

  .close-dialog-btn {
    top: 8px;
    right: 8px;
  }
}
</style>
