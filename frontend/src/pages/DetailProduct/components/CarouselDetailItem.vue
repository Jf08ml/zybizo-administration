<template>
  <q-carousel
    v-model="fullScreenSlide"
    swipeable
    animated
    thumbnails
    infinite
    :autoplay="true"
    class="rounded-borders "
  >
    <q-carousel-slide
      v-for="(image, index) in product.images"
      :name="index"
      :key="index"
      :img-src="image"
      @click="openZoomDialog(image)"
    />
  </q-carousel>

  <q-dialog
    v-model="zoomDialog"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-carousel
      v-model="fullScreenSlide"
      swipeable
      animated
      thumbnails
      infinite
      class="rounded-borders fit"
    >
      <q-carousel-slide
        v-for="(image, index) in product.images"
        :name="index"
        :key="index"
        :img-src="image"
        @click="openZoomDialog(image)"
      />
    </q-carousel>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";

const fullScreenSlide = ref(0);
const zoomDialog = ref(false);
const currentZoomImage = ref("");

const props = defineProps({
  product: Object,
});

function openZoomDialog(image) {
  currentZoomImage.value = image;
  zoomDialog.value = true;
}
</script>
