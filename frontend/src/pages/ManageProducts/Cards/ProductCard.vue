<template>
  <q-card
    class="product-card"
    style="width: 100%; max-width: 320px"
    flat
    bordered
  >
    <!-- Imagen del producto -->
    <div
      v-if="product.images && product.images.length > 0"
      class="image-wrapper"
    >
      <div class="image-container">
        <img
          :src="product.images[0]"
          :alt="product.name"
          class="product-image"
        />

        <!-- Badges en la imagen -->
        <div class="badges-container">
          <q-badge
            :color="getStockStatusColor()"
            :label="getStockStatusLabel()"
            class="q-px-sm"
          />
          <q-badge
            v-if="!product.isActive"
            color="negative"
            label="Inactivo"
            class="q-px-sm q-ml-xs"
          />
        </div>
      </div>
    </div>

    <!-- Placeholder si no hay imagen -->
    <div v-else class="image-placeholder">
      <q-icon name="image" size="48px" color="grey-5" />
    </div>

    <!-- Botones de acción SIEMPRE visibles (fuera del v-if/v-else) -->
    <div class="actions-container">
      <q-btn
        icon="inventory"
        size="sm"
        round
        color="primary"
        unelevated
        @click.stop="addStock(product)"
        class="action-btn"
      >
        <q-tooltip>Gestionar stock</q-tooltip>
      </q-btn>
      <q-btn
        icon="edit"
        size="sm"
        round
        color="orange"
        unelevated
        @click.stop="editProduct(product)"
        class="action-btn"
      >
        <q-tooltip>Editar producto</q-tooltip>
      </q-btn>
      <q-btn
        :icon="product.isActiveInCatalog ? 'storefront' : 'store'"
        size="sm"
        round
        :color="product.isActiveInCatalog ? 'positive' : 'grey-6'"
        unelevated
        @click.stop="toggleCatalog(product)"
        class="action-btn"
      >
        <q-tooltip>{{
          product.isActiveInCatalog ? "En catálogo" : "Añadir a catálogo"
        }}</q-tooltip>
      </q-btn>
      <q-btn
        :icon="product.isActive ? 'visibility' : 'visibility_off'"
        size="sm"
        round
        :color="product.isActive ? 'positive' : 'grey-6'"
        unelevated
        @click.stop="toggleActive(product)"
        class="action-btn"
      >
        <q-tooltip>{{ product.isActive ? "Activo" : "Inactivo" }}</q-tooltip>
      </q-btn>
      <q-btn
        v-if="product.quantitiesSold === 0"
        icon="delete"
        size="sm"
        round
        color="negative"
        unelevated
        @click.stop="deleteProduct(product)"
        class="action-btn"
      >
        <q-tooltip>Eliminar producto</q-tooltip>
      </q-btn>
    </div>

    <!-- Información del producto compacta -->
    <q-card-section class="q-pa-sm">
      <!-- Nombre y categoría -->
      <div class="q-mb-xs">
        <div class="text-subtitle1 text-weight-bold ellipsis-2-lines">
          {{ product.name }}
        </div>
        <div class="row items-center q-gutter-xs q-mt-xs">
          <q-chip
            v-if="product.category"
            :icon="product.category.icon || 'category'"
            :label="product.category.name"
            size="sm"
            dense
            class="q-py-none"
          />
          <q-chip
            v-if="product.sku"
            :label="product.sku"
            size="sm"
            dense
            outline
            class="q-py-none"
          />
        </div>
      </div>

      <q-separator class="q-my-sm" />

      <!-- Información clave en grid compacto -->
      <div class="info-grid q-mb-sm">
        <div class="info-item">
          <q-icon name="inventory_2" size="xs" color="grey-6" class="q-mr-xs" />
          <span class="text-caption">{{ product.stock || 0 }} und</span>
        </div>
        <div class="info-item">
          <q-icon name="trending_up" size="xs" color="grey-6" class="q-mr-xs" />
          <span class="text-caption"
            >{{ product.quantitiesSold || 0 }} vendidos</span
          >
        </div>
      </div>

      <!-- Precios destacados -->
      <div class="prices-section q-mb-sm">
        <div class="row items-center justify-between">
          <div>
            <div class="text-caption text-grey-6">Precio venta</div>
            <div class="text-h6 text-weight-bold text-primary">
              {{ formatPrice(product.salePrice) }}
            </div>
          </div>
          <div v-if="product.wholesalePrice" class="text-right">
            <div class="text-caption text-grey-6">Mayoreo</div>
            <div class="text-body2 text-weight-bold text-orange">
              {{ formatPrice(product.wholesalePrice) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Badges de estado -->
      <div class="row q-gutter-xs items-center flex-wrap">
        <q-badge
          v-if="product.isActiveInCatalog"
          color="positive"
          label="Catálogo"
          class="badge-mini"
        />
        <q-badge
          v-if="product.isOffer"
          color="orange"
          label="Oferta"
          class="badge-mini"
        />
        <q-badge
          v-if="
            product.references &&
            product.references.length > 0 &&
            product.references[0].name
          "
          color="purple"
          label="Variantes"
          class="badge-mini"
        />
      </div>

      <!-- Referencias/Variantes -->
      <q-expansion-item
        v-if="
          product.references &&
          product.references.length > 0 &&
          product.references[0].name
        "
        dense
        dense-toggle
        expand-separator
        icon="tune"
        label="Variantes"
        class="q-mt-sm"
      >
        <q-card flat bordered class="q-pa-xs">
          <div
            v-for="reference in product.references"
            :key="reference.name"
            class="q-pa-xs"
          >
            <div class="text-caption text-weight-bold">
              {{ reference.name }}:
            </div>
            <div class="row q-gutter-xs q-mt-xs">
              <q-chip
                v-for="option in reference.options"
                :key="option.value"
                size="sm"
                dense
                outline
              >
                {{ option.value }}: <strong>{{ option.stocks || 0 }}</strong>
              </q-chip>
            </div>
          </div>
        </q-card>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { formatPrice } from "../../../utils/utilsFunctions.js";

const props = defineProps({
  product: Object,
});

const emit = defineEmits([
  "delete-product",
  "add-stock",
  "edit-product",
  "toggle-catalog",
  "toggle-active",
]);

const getStockStatusColor = () => {
  const stock = props.product.stock || 0;
  const minStock = props.product.minStock || 0;
  if (stock === 0) return "negative";
  if (stock <= minStock) return "warning";
  return "positive";
};

const getStockStatusLabel = () => {
  const stock = props.product.stock || 0;
  const minStock = props.product.minStock || 0;
  if (stock === 0) return "Sin stock";
  if (stock <= minStock) return "Stock bajo";
  return "Disponible";
};

// Eventos
const deleteProduct = (product) => emit("delete-product", product);
const addStock = (product) => emit("add-stock", product);
const editProduct = (product) => emit("edit-product", product);
const toggleCatalog = (product) => emit("toggle-catalog", product);
const toggleActive = (product) => emit("toggle-active", product);
</script>

<style scoped lang="scss">
.product-card {
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
}

.image-wrapper {
  position: relative;
  width: 100%;
}
.image-container {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-radius: 4px 4px 0 0;
}
.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-placeholder {
  width: 100%;
  height: 160px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px 4px 0 0;
}

.badges-container {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
  z-index: 2;
}

/* Barra de acciones debajo de la imagen, siempre visible */
.actions-container {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.7));
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: 12px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  min-height: 50px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.action-btn {
  flex-shrink: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.info-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background: var(--q-grey-1);
  border-radius: 4px;
}

.prices-section {
  padding: 8px;
  background: var(--q-blue-1);
  border-radius: 4px;
}
.badge-mini {
  font-size: 10px;
  padding: 2px 6px;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ellipsis-2-lines {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3;
  max-height: 2.6em;
}

@media (max-width: 768px) {
  .product-card:hover {
    transform: none;
  }
}
</style>
