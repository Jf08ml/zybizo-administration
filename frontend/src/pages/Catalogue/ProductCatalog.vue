<template>
  <q-page padding>
    <div class="row q-col-gutter-md" align="center">
      <div
        class="col-xs-12 col-md-6 col-lg-4"
        v-for="product in products"
        :key="product.id"
      >
        <ProductCard
          :product="product"
          @open-carousel="openFullScreenCarousel"
          @redirect-to-whatsApp="redirectToWhatsApp"
        />
      </div>
    </div>
  </q-page>

  <FullScreenCarousel
    :images="currentImages"
    v-model="fullScreenCarouselOpen"
  />
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { getProductsCatalog } from "../../services/productService.js";
import ProductCard from "./cards/ProductCard.vue";
import FullScreenCarousel from "./cards/FullScreenCarousel.vue";

const products = ref([]);

const fullScreenCarouselOpen = ref(false);
const currentImages = ref([]);

onBeforeMount(async () => {
  await getAllProducts();
});

const getAllProducts = async () => {
  try {
    const response = await getProductsCatalog();
    products.value = response.products.map((product) => ({
      ...product,
      slideIndex: 0, // Agrega un nuevo campo para rastrear el índice de la diapositiva
    }));
  } catch (error) {
    console.error(error);
  }
};

const redirectToWhatsApp = (product) => {
  const defaultMessage = `Hola, estoy interesado en ${product.namePublic}.`;
  const encodedMessage = encodeURIComponent(defaultMessage);
  window.open(`https://wa.me/+573165892611?text=${encodedMessage}`, "_blank");
};

const openFullScreenCarousel = (images) => {
  currentImages.value = images;
  fullScreenCarouselOpen.value = true;
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
  max-width: 350px;
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
    max-width: 100%;
  }

  .fullscreen-carousel {
    width: 100vw;
    height: 50vh;
  }
}
</style>
