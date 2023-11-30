<template>
  <q-page padding>
    <div class="row q-col-gutter-md" align="center">
      <div
        class="col-xs-12 col-md-6 col-lg-4"
        v-for="product in products"
        :key="product.id"
      >
        <q-card class="bg-grey-1" align="left">
          <q-carousel
            animated
            v-model="product.slideIndex"
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
              @click="openFullScreenCarousel(product.images)"
              spinner-color="white"
              style="height: 200px; max-width: 100%; object-fit: scale-down"
            />
          </q-carousel>
          <q-card-section>
            <div class="text-h6 text-grey-9">{{ product.namePublic }}</div>
            <q-expansion-item label="Descripción" icon="description">
              <div class="text-caption text-justify q-mt-md text-blue-grey-7">
                {{ product.characteristics }}
              </div>
            </q-expansion-item>
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
                <q-chip size="sm" square>
                  {{ product.quantitiesSold }} Vendidos
                </q-chip>
              </div>
            </div>
            <div class="col-6 flex justify-end">
              <q-btn
                flat
                round
                @click="redirectToWhatsApp(product)"
                class="q-ma-md social-button"
              >
                <q-icon name="bi-whatsapp " size="xl" color="teal"></q-icon>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
  <q-dialog v-model="fullScreenCarouselOpen">
    <q-card class="fullscreen-carousel">
      <q-carousel
        v-model="fullScreenSlide"
        :autoplay="autoplay"
        navigation
        infinite
        arrows
        class="carousel-fullscreen"
      >
        <q-carousel-slide
          v-for="(image, index) in currentImages"
          :name="index"
          :key="index"
          :img-src="image"
          class="fullscreen-slide"
        />
      </q-carousel>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { getProductsCatalog } from "../../services/productService.js";
import { formatPrice } from "../../utils/utilsFunctions.js";

const products = ref([]);

const slide = ref(0);
const autoplay = ref(true);

const fullScreenCarouselOpen = ref(false);
const fullScreenSlide = ref(0);
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
  currentImages.value = images; // Establece las imágenes actuales para el carrusel
  fullScreenSlide.value = 0; // Reinicia el índice del carrusel a 0
  fullScreenCarouselOpen.value = true; // Abre el modal
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
