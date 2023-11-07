<template>
  <q-page padding>
    <q-title>Productos en Venta</q-title>
    <div v-if="loadingProducts" align="center">
      <q-spinner-puff color="primary" size="5em" />
    </div>
    <div class="q-pa-md">
      <q-list bordered separator>
        <q-item v-for="product in products" :key="product.id" clickable>
          <q-item-section avatar>
            <q-avatar>
              <img :src="product.image" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ product.name }}</q-item-label>
            <q-item-label caption>{{ product.description }}</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label>{{ product.price }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-btn flat icon="shopping_cart" @click="addToCart(product)" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { getProducts } from "../../services/productService.js";

const products = ref([]);
const loadingProducts = ref(false);

onBeforeMount(async () => {
  await getAllProducts();
});

const getAllProducts = async () => {
  try {
    loadingProducts.value = true;
    const response = await getProducts();
    products.value = response.products;
  } catch (error) {
    console.error(error);
  } finally {
    loadingProducts.value = false;
  }
};
</script>

<style>
.q-title {
  text-align: center;
  margin-bottom: 1rem;
}
</style>
