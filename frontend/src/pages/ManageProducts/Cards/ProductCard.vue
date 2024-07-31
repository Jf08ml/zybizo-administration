<template>
  <q-card style="width: 300px;">
    <q-card-section>
      <div class="text-body1">
        {{ product.name }}
        <q-icon :color="product.stock > 0 ? 'green' : 'red'"
          :name="product.stock > 0 ? 'check_circle' : 'new_releases'" />
      </div>
      <q-separator />
      <div class="text-caption">Cantidades: {{ product.quantity }}</div>
      <div class="text-caption">Vendidas: {{ product.quantitiesSold }}</div>
      <div class="text-caption text-weight-bold">
        Disponible: {{ product.stock }}
      </div>
      <q-separator />
      <div class="text-caption">
        Precio base: {{ formatPrice(product.basePrice) }}
      </div>
      <div class="text-caption text-weight-bold">
        Precio de venta: {{ formatPrice(product.salePrice) }}
      </div>
      <div v-if="product.wholesalePrice" class="text-caption text-weight-bold">
        Precio al por mayor: {{ formatPrice(product.wholesalePrice) }}
      </div>
      <q-separator />

      <!-- Añadir referencias y opciones como expansiones -->
      <q-expansion-item
        v-for="reference in product.references"
        :key="reference.name"
        :label="reference.name"
        expand-separator
        dense
      >
        <div v-for="option in reference.options" :key="option.value" class="text-caption">
          {{ option.label }}: {{ option.stocks }} unidades
        </div>
      </q-expansion-item>
    </q-card-section>

    <q-card-actions align="center" class="q-gutter-sm">
      <q-btn v-if="product.stock != 0" @click="sellProduct(product)" label="Marcar venta" color="pink"
        :disabled="product.stock === 0" class="full-width" />
      <template v-if="product.quantitiesSold === 0 || product.stock === 0">
        <q-btn v-if="product.quantitiesSold === 0" @click="deleteProduct(product)" label="Eliminar" color="red"
          class="full-width" />
        <q-btn v-if="product.stock === 0" @click="addStock(product)" label="Añadir disponibles" color="blue" class="full-width" />
      </template>
      <q-btn @click="changeStateCatalog(product)" :label="product.isActiveInCatalog
          ? 'Inactivar en el catálogo'
          : 'Activar en el catálogo'
        " :color="product.isActiveInCatalog ? 'grey' : 'green'" class="full-width" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { formatPrice } from "../../../utils/utilsFunctions.js";

const props = defineProps({
  product: Object,
});

const emit = defineEmits([
  "sell-product",
  "delete-product",
  "add-stock",
  "create-catalog-product",
]);
const sellProduct = (product) => {
  emit("sell-product", product);
};

const deleteProduct = (product) => {
  emit("delete-product", product);
};

const addStock = (product) => {
  emit("add-stock", product);
};

const changeStateCatalog = (product) => {
  emit("create-catalog-product", product);
};
</script>

<style scoped>
.full-width {
  width: 100%;
}

.q-gutter-sm>* {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
