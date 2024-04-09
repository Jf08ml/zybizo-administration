<template>
  <div>
    <q-carousel
      v-model="fullScreenSlide"
      swipeable
      animated
      thumbnails
      infinite
      class="rounded-borders"
    >
      <q-carousel-slide
        v-for="(image, index) in product.images"
        :name="index"
        :key="index"
        :img-src="image"
      />
    </q-carousel>
  </div>
</template>
<script setup>
import { onMounted, ref, computed, watch } from "vue";
const fullScreenSlide = ref(0);

const props = defineProps({
  product: Object,
});
</script>
