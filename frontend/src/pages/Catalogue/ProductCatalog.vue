<template>
  <q-page padding>
    <div class="q-my-md row justify-center">
      <q-input
        rounded
        dense
        standout
        v-model="searchTerm"
        class="col-8 col-xs-11"
        label="Busca aquí el producto que deseas"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div class="row q-col-gutter-md" align="center">
      <div
        class="col-xs-6 col-sm-3 col-md-2 col-lg-2"
        v-for="product in filteredProducts"
        :key="product._id"
      >
        <ProductCard :product="product" />
      </div>
    </div>
  </q-page>

  <q-dialog v-model="showPopup">
    <q-card style="width: 300px; height: auto">
      <q-card-section>
        <div class="text-subtitle1 text-pink text-weight-bolder">
          Información para hacer un pedido
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pt-none text-body2 text-center q-ma-xs">
        <p>
          ¡Haz <span class="text-weight-bold">clic en el producto</span> y
          <span class="text-weight-bold">añade al carrito</span>!
        </p>

        <q-img src="https://i.ibb.co/NrmnyZx/boton-contra-entrega-1.webp" />
      </q-card-section>
      <q-card-section
        class="q-pt-none text-body2 text-primary text-justify q-ma-xs"
      >
        Para mayor información y precios al por mayor, comunícate con nosotros.
        En nuestras redes sociales.
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="bg-white text-primary">
        <q-btn color="pink" label="Entiendo" rounded v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onUnmounted, computed } from "vue";
import { getProductsCatalog } from "../../services/productService.js";
import ProductCard from "./cards/ProductCard.vue";

const products = ref([]);
const searchTerm = ref("");
const showPopup = ref(false);

const filteredProducts = computed(() => {
  return products.value.filter((product) =>
    product.namePublic.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

onBeforeMount(async () => {
  await getAllProducts();
});

onMounted(() => {
  checkFirstVisit();
  window.addEventListener("beforeunload", clearLocalStorage);
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", clearLocalStorage);
});

const checkFirstVisit = () => {
  if (!localStorage.getItem("hasVisited")) {
    showPopup.value = true;
    localStorage.setItem("hasVisited", "true");
  }
};

const clearLocalStorage = () => {
  localStorage.removeItem("hasVisited");
};

const getAllProducts = async () => {
  try {
    const response = await getProductsCatalog();
    products.value = response.data.map((product) => ({
      ...product,
      slideIndex: 0,
    }));
  } catch (error) {
    console.error(error);
  }
};

</script>
