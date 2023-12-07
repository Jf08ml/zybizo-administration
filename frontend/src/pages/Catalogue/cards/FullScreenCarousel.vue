<template>
  <q-dialog>
    <q-card class="fullscreen-carousel">
      <q-carousel
        v-model="fullScreenSlide"
        :autoplay="true"
        navigation
        infinite
        arrows
        class="carousel-fullscreen"
      >
        <q-carousel-slide
          v-for="(image, index) in images"
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
import { ref } from "vue";

const props = defineProps({
  images: Object,
});

const emit = defineEmits(["openCarousel"]);

const fullScreenSlide = ref(0);
</script>
