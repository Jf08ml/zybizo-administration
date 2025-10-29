<template>
  <q-card
    @click="redirectDetailProduct"
    class="catalog-product-card"
    flat
    bordered
  >
    <!-- Badges superiores -->
    <div class="badges-container">
      <q-badge
        v-if="product.isOffer"
        color="black"
        text-color="white"
        class="offer-badge"
      >
        OFERTA
      </q-badge>
      <q-badge
        v-if="product.wholesalePrice && product.wholesalePrice > 0"
        color="grey-8"
        text-color="white"
        class="wholesale-badge"
      >
        MAYOREO
      </q-badge>
      <q-badge
        v-if="product.stock <= 5 && product.stock > 0"
        color="orange"
        text-color="white"
        class="stock-badge"
      >
        ¡ÚLTIMAS UNIDADES!
      </q-badge>
    </div>

    <!-- Imagen del producto -->
    <div class="image-section">
      <q-carousel
        v-model="fullScreenSlide"
        swipeable
        animated
        infinite
        :autoplay="3000"
        transition-prev="slide-right"
        transition-next="slide-left"
        class="product-carousel"
      >
        <q-carousel-slide
          v-for="(image, index) in product.images"
          :name="index"
          :key="index"
          class="carousel-slide"
        >
          <img :src="image" :alt="product.namePublic" class="product-image" />
        </q-carousel-slide>
      </q-carousel>

      <!-- Stock badge en la imagen -->
      <div class="stock-indicator" v-if="product.stock > 0">
        <q-icon name="inventory_2" size="14px" />
        <span>{{ product.stock }} disponibles</span>
      </div>
    </div>

    <!-- Información del producto -->
    <q-card-section class="product-info">
      <!-- Categoría si está disponible -->
      <div v-if="product.category" class="category-tag">
        <q-icon
          :name="getCategoryIcon()"
          size="12px"
          class="q-mr-xs"
        />
        <span>{{ getCategoryName() }}</span>
      </div>

      <h3 class="product-name">{{ product.namePublic || product.name }}</h3>

      <!-- Rating y ventas -->
      <!-- <div class="rating-section" v-if="product.stock > 0">
        <q-rating
          v-model="product.rating"
          max="5"
          size="14px"
          color="black"
          icon="star_border"
          icon-selected="star"
          readonly
          dense
        />
        <span class="sold-count">{{ product.quantitiesSold || 0 }} vendidos</span>
      </div> -->

      <!-- Precios -->
      <div v-if="product.stock > 0" class="prices-container">
        <div class="price-main">
          <span class="price-label">Precio</span>
          <span class="price-value">{{ formatPrice(product.salePrice) }}</span>
        </div>

        <div v-if="product.wholesalePrice && product.wholesalePrice > 0" class="price-wholesale">
          <span class="wholesale-label">Mayoreo ({{ product.wholesaleQuantity }}+ und)</span>
          <span class="wholesale-value">{{ formatPrice(product.wholesalePrice) }}</span>
        </div>
      </div>

      <!-- Sin stock -->
      <div v-else class="out-of-stock">
        <q-icon name="schedule" size="20px" />
        <span>Disponible pronto</span>
      </div>

      <!-- Botón de acción -->
      <q-btn
        v-if="product.stock > 0"
        unelevated
        color="black"
        text-color="white"
        label="Ver detalles"
        class="view-details-btn"
        @click.stop="redirectDetailProduct"
      >
        <q-icon name="arrow_forward" size="18px" class="q-ml-xs" />
      </q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { formatPrice } from "../../../utils/utilsFunctions.js";
import { useRouter } from "vue-router";

const router = useRouter();

const redirectDetailProduct = () => {
  router.push({ name: "DetailProduct", params: { productId: product._id } });
};

const props = defineProps({
  product: Object,
});

const fullScreenSlide = ref(0);
const product = props.product;

const getCategoryName = () => {
  if (typeof product.category === 'object' && product.category !== null) {
    return product.category.name;
  }
  return '';
};

const getCategoryIcon = () => {
  if (typeof product.category === 'object' && product.category !== null) {
    return product.category.icon || 'category';
  }
  return 'category';
};

const getMessageClass = (type) => {
  return product.isOffer && product.wholesalePrice
    ? `${type}-message-multiple`
    : "single-message";
};
</script>

<style scoped>
.catalog-product-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.catalog-product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: #000;
}

/* Badges superiores */
.badges-container {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
}

.offer-badge,
.wholesale-badge,
.stock-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 4px 10px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Imagen del producto */
.image-section {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f8f8f8;
}

.product-carousel {
  height: 100%;
}

.carousel-slide {
  padding: 0;
  background: transparent;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.catalog-product-card:hover .product-image {
  transform: scale(1.05);
}

.stock-indicator {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 2;
}

/* Información del producto */
.product-info {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-tag {
  display: inline-flex;
  align-items: center;
  background: #f5f5f5;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 9px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.product-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 34px;
}

/* Rating y ventas */
.rating-section {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
}

.sold-count {
  font-size: 10px;
  color: #666;
  font-weight: 500;
}

/* Precios */
.prices-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 0;
  border-top: 1px solid #f0f0f0;
}

.price-main {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.price-label {
  font-size: 11px;
  color: #666;
  font-weight: 500;
}

.price-value {
  font-size: 17px;
  font-weight: 700;
  color: #000;
  letter-spacing: -0.5px;
}

.price-wholesale {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  background: #f8f8f8;
  padding: 6px 10px;
  border-radius: 4px;
  margin-top: 2px;
}

.wholesale-label {
  font-size: 10px;
  color: #666;
  font-weight: 600;
}

.wholesale-value {
  font-size: 14px;
  font-weight: 700;
  color: #000;
}

/* Sin stock */
.out-of-stock {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  border-radius: 6px;
  color: #666;
  font-size: 12px;
  font-weight: 600;
  margin-top: auto;
}

/* Botón de acción */
.view-details-btn {
  margin-top: auto;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.view-details-btn:hover {
  background: #1a1a1a;
  transform: translateX(4px);
}

/* Responsive */
@media (max-width: 768px) {
  .image-section {
    height: 160px;
  }

  .product-info {
    padding: 10px;
    gap: 6px;
  }

  .product-name {
    font-size: 12px;
    min-height: 32px;
  }

  .price-value {
    font-size: 16px;
  }

  .wholesale-value {
    font-size: 13px;
  }

  .view-details-btn {
    font-size: 11px;
    padding: 7px 14px;
  }
}
</style>
