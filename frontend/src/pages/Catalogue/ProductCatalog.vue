<template>
  <q-page padding>
    <div class="full-width q-mb-md" align="center">
      <q-input
        rounded
        standout
        v-model="searchTerm"
        label="Buscar..."
        style="width: 70%"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div class="row q-col-gutter-md" align="center">
      <div
        class="col-xs-12 col-sm-4 col-md-4 col-lg-4"
        v-for="product in filteredProducts"
        :key="product._id"
      >
        <ProductCard :product="product" />
      </div>
    </div>
  </q-page>

  <FullScreenCarousel
    :images="currentImages"
    v-model="fullScreenCarouselOpen"
  />

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
          <span class="text-weight-bold">añade a la cesta</span>!
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
import FullScreenCarousel from "./cards/FullScreenCarousel.vue";

const products = ref([]);
const searchTerm = ref("");
const showPopup = ref(false);

const filteredProducts = computed(() => {
  return products.value.filter((product) =>
    product.namePublic.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const fullScreenCarouselOpen = ref(false);
const currentImages = ref([]);

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

<style>
.text-h6 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.q-carousel-slide {
  background-size: cover;
  background-position: center;
}

.q-card {
  width: 100%;
  height: 100%;
}

.fullscreen-carousel {
  width: 80vw;
  height: 60vh;
  max-width: 600px;
  max-height: 400px;
}

.carousel-fullscreen {
  width: 100%;
  height: 100%;
}

.fullscreen-slide {
  height: 100%;
  width: 100%;
  object-fit: scale-down;
  background-position: center;
  background-repeat: no-repeat;
}

@media (max-width: 600px) {
  .q-card {
    width: 100%;
    height: 100%;
  }

  .fullscreen-carousel {
    width: 100vw;
    height: 50vh;
  }
}
</style>
