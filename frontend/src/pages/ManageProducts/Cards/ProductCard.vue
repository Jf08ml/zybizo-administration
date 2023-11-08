<template>
  <q-card style="width: 300px">
    <q-card-section>
      <div class="text-h6">
        {{ product.name }}
        <q-icon :color="product.stock > 0 ? 'green' : 'red'"
          :name="product.stock > 0 ? 'check_circle' : 'new_releases'" />
      </div>
      <q-separator />
      <div class="text-caption">Quantity: {{ product.quantity }}</div>
      <div class="text-caption">Sold: {{ product.quantitiesSold }}</div>
      <div class="text-caption text-weight-bold">
        Stock: {{ product.stock }}
      </div>
      <div class="text-caption">Batch: {{ product.batch }}</div>
      <q-separator />
      <div class="text-caption">
        Base price: {{ formatPrice(product.basePrice) }}
      </div>
      <div class="text-caption text-weight-bold">
        Price sale: {{ formatPrice(product.salePrice) }}
      </div>
      <q-separator />
    </q-card-section>

    <q-card-actions align="center" class="q-gutter-sm">
      <q-btn v-if="product.stock != 0" @click="sellProduct(product)" label="Sell" color="green"
        :disabled="product.stock === 0" class="full-width" />
      <template v-if="product.quantitiesSold === 0 || product.stock === 0">
        <q-btn v-if="product.quantitiesSold === 0" @click="deleteProduct(product)" label="Delete" color="red"
          class="full-width" />
        <q-btn v-if="product.stock === 0" @click="addStock(product)" label="Add stock" color="blue" class="full-width" />
      </template>
      <q-btn @click="changeStateCatalog(product)" :label="product.isActiveInCatalog
          ? 'Inactive in catalog'
          : 'Active in catalog'
        " :color="product.isActiveInCatalog ? 'orange' : 'green'" class="full-width" />
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
