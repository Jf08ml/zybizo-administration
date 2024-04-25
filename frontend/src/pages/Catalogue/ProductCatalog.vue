<template>
  <q-page padding>
    <div class="row q-col-gutter-md" align="center">
      <div
        class="col-xs-12 col-sm-4 col-md-4 col-lg-4"
        v-for="product in products"
        :key="product.id"
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
      <q-card-section class="q-pt-none text-body2 text-justify q-ma-xs">
        Haz clic en el producto de interés, puedes comprarlo o añadirlo a la cesta.
        <span class="text-pink text-weight-bold text-uppercase"
          >Recuerda que pagas al recibir el pedido</span
        >, ya que manejamos pedidos únicamente en la modalidad contra entrega.
      </q-card-section>
      <q-card-section class="q-pt-none text-body2 text-primary text-justify q-ma-xs">
        Para mayor información y precios al por mayor, comunícate con nosotros.
        En nuestras redes sociales.
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="bg-white text-primary">
        <q-btn color="positive" label="Entiendo" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { getProductsCatalog } from "../../services/productService.js";
import ProductCard from "./cards/ProductCard.vue";
import FullScreenCarousel from "./cards/FullScreenCarousel.vue";

const products = ref([]);
const showPopup = ref(true);

const fullScreenCarouselOpen = ref(false);
const currentImages = ref([]);

onBeforeMount(async () => {
  await getAllProducts();
});

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
