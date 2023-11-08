<template>
  <q-page padding>

    <div class="row q-col-gutter-md">
      <div
        class="col-xs-12 col-md-6 col-lg-4"
        v-for="product in products"
        :key="product.id"
      >
        <q-card>
          <q-carousel
            animated
            v-model="slide"
            navigation
            infinite
            :autoplay="autoplay"
            arrows
            transition-prev="slide-right"
            transition-next="slide-left"
            @mouseenter="autoplay = false"
            @mouseleave="autoplay = true"
            v-if="product.images.length"
            height="200px"
          >
            <q-carousel-slide
              :name="index"
              v-for="(image, index) in product.images"
              :key="index"
              :img-src="image"
            />
          </q-carousel>
          <q-card-section>
            <div class="text-h6">{{ product.namePublic }}</div>
            <div class="text-caption q-mb-md">
              {{ product.characteristics }}
            </div>
          </q-card-section>
          <q-card-section class="row items-center">
            <div class="col-6">
              <div class="text-subtitle2">
                <q-chip square>
                  <q-avatar icon="sell" color="red" text-color="white" />
                  {{ formatPrice(product.salePrice) }}
                </q-chip>
              </div>
              <div class="text-caption">
                <q-chip size="sm" square> {{ product.quantitiesSold }} Vendidos </q-chip>
              </div>
            </div>
            <div class="col-6 flex justify-end">
              <q-btn
                flat
                round
                @click="redirectToWhatsApp(product)"
                class="q-ma-md social-button"
              >
                <img
                  src="/icons/whatsapp.svg"
                  class="social-icon"
                  alt="WhatsApp"
                />
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { getProductsCatalog } from "../../services/productService.js";
import { formatPrice } from "../../utils/utilsFunctions.js";

const products = ref([]);
const loadingProducts = ref(false);

const slide = ref(0);
const autoplay = ref(true);

onBeforeMount(async () => {
  await getAllProducts();
});

const getAllProducts = async () => {
  try {
    loadingProducts.value = true;
    const response = await getProductsCatalog();
    products.value = response.products;
  } catch (error) {
    console.error(error);
  } finally {
    loadingProducts.value = false;
  }
};

const redirectToWhatsApp = (product) => {
  const defaultMessage = `Hola, estoy interesado en ${product.namePublic}.`;
  const encodedMessage = encodeURIComponent(defaultMessage);
  window.open(`https://wa.me/+573165892611?text=${encodedMessage}`, "_blank");
};
</script>

<style>
.q-carousel-slide {
  background-size: cover;
  background-position: center;
}

.q-card {
  max-width: 350px;
}
</style>
