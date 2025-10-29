<template>
  <div class="product-gallery">
    <!-- Imagen principal -->
    <div class="main-image-container">
      <q-img
        :src="selectedImage"
        :ratio="1"
        class="main-image"
        @click="openZoomDialog"
      >
        <template v-slot:loading>
          <div class="flex flex-center full-width full-height">
            <q-spinner-gears color="primary" size="50px" />
          </div>
        </template>

        <!-- Badge de zoom -->
        <div class="zoom-badge">
          <q-icon name="zoom_in" size="sm" />
          <span class="text-caption">Click para ampliar</span>
        </div>

        <!-- Indicador de múltiples imágenes -->
        <div v-if="product.images && product.images.length > 1" class="image-counter">
          <q-icon name="image" size="xs" class="q-mr-xs" />
          {{ currentIndex + 1 }} / {{ product.images.length }}
        </div>
      </q-img>

      <!-- Navegación de imágenes (si hay más de una) -->
      <div v-if="product.images && product.images.length > 1" class="image-navigation">
        <q-btn
          round
          flat
          icon="chevron_left"
          color="white"
          class="nav-btn nav-btn-prev"
          @click="previousImage"
        />
        <q-btn
          round
          flat
          icon="chevron_right"
          color="white"
          class="nav-btn nav-btn-next"
          @click="nextImage"
        />
      </div>
    </div>

    <!-- Thumbnails -->
    <div v-if="product.images && product.images.length > 1" class="thumbnails-container">
      <div
        v-for="(image, index) in product.images"
        :key="index"
        class="thumbnail"
        :class="{ active: currentIndex === index }"
        @click="selectImage(index)"
      >
        <q-img
          :src="image"
          :ratio="1"
          class="thumbnail-image"
        >
          <template v-slot:loading>
            <q-spinner color="primary" size="20px" />
          </template>
        </q-img>
      </div>
    </div>

    <!-- Dialog para zoom -->
    <q-dialog
      v-model="zoomDialog"
      maximized
      transition-show="fade"
      transition-hide="fade"
    >
      <q-card class="bg-black">
        <q-btn
          icon="close"
          flat
          round
          dense
          color="white"
          class="close-btn"
          v-close-popup
        />

        <q-carousel
          v-model="fullScreenSlide"
          swipeable
          animated
          infinite
          height="100vh"
          control-color="white"
          class="zoom-carousel"
        >
          <q-carousel-slide
            v-for="(image, index) in product.images"
            :name="index"
            :key="index"
            class="flex flex-center"
          >
            <q-img
              :src="image"
              fit="contain"
              class="zoom-image"
            />
          </q-carousel-slide>
        </q-carousel>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  product: Object,
});

const currentIndex = ref(0);
const fullScreenSlide = ref(0);
const zoomDialog = ref(false);

const selectedImage = computed(() => {
  if (props.product?.images && props.product.images.length > 0) {
    return props.product.images[currentIndex.value];
  }
  return '';
});

function openZoomDialog() {
  fullScreenSlide.value = currentIndex.value;
  zoomDialog.value = true;
}

function selectImage(index) {
  currentIndex.value = index;
}

function nextImage() {
  if (props.product?.images && props.product.images.length > 0) {
    currentIndex.value = (currentIndex.value + 1) % props.product.images.length;
  }
}

function previousImage() {
  if (props.product?.images && props.product.images.length > 0) {
    currentIndex.value = currentIndex.value === 0
      ? props.product.images.length - 1
      : currentIndex.value - 1;
  }
}
</script>

<style lang="scss" scoped>
.product-gallery {
  .main-image-container {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    background: #f8f9fa;

    .main-image {
      cursor: pointer;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.02);
      }
    }

    .zoom-badge {
      position: absolute;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    &:hover .zoom-badge {
      opacity: 1;
    }

    .image-counter {
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
    }

    .image-navigation {
      .nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        transition: all 0.3s ease;

        &:hover {
          background: rgba(0, 0, 0, 0.7);
          transform: translateY(-50%) scale(1.1);
        }

        &.nav-btn-prev {
          left: 16px;
        }

        &.nav-btn-next {
          right: 16px;
        }
      }
    }
  }

  .thumbnails-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 12px;
    margin-top: 16px;

    .thumbnail {
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.3s ease;
      aspect-ratio: 1;

      &:hover {
        border-color: var(--q-primary);
        transform: translateY(-2px);
      }

      &.active {
        border-color: var(--q-primary);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .thumbnail-image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 10;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);

    &:hover {
      background: rgba(0, 0, 0, 0.7);
    }
  }

  .zoom-carousel {
    .zoom-image {
      max-height: 90vh;
      width: auto;
    }
  }
}

// Responsive
@media (max-width: 1023px) {
  .product-gallery {
    .main-image-container {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

      .main-image {
        &:hover {
          transform: none;
        }
      }
    }

    .thumbnails-container {
      grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
      gap: 10px;
      margin-top: 14px;
    }
  }
}

@media (max-width: 599px) {
  .product-gallery {
    .main-image-container {
      border-radius: 0;
      box-shadow: none;

      .zoom-badge {
        display: none;
      }

      .image-counter {
        top: 8px;
        right: 8px;
        padding: 4px 8px;
        font-size: 0.7rem;
      }

      .image-navigation .nav-btn {
        width: 32px;
        height: 32px;

        &.nav-btn-prev {
          left: 4px;
        }

        &.nav-btn-next {
          right: 4px;
        }

        :deep(.q-icon) {
          font-size: 1.2rem;
        }
      }
    }

    .thumbnails-container {
      grid-template-columns: repeat(auto-fill, minmax(55px, 1fr));
      gap: 6px;
      margin-top: 10px;

      .thumbnail {
        border-radius: 6px;

        &:hover {
          transform: none;
        }
      }
    }

    .close-btn {
      top: 12px;
      right: 12px;
    }

    .zoom-carousel {
      .zoom-image {
        max-height: 80vh;
      }
    }
  }
}

@media (max-width: 400px) {
  .product-gallery {
    .thumbnails-container {
      grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
      gap: 4px;
    }
  }
}
</style>
