<template>
  <q-card
    @click="redirectDetailProduct"
    class="bg-grey-1 full-width full-height card-container"
  >
    <div
      v-if="product.isOffer"
      :class="['bg-pink-5', getMessageClass('offer')]"
      style="border-radius: 3px; box-shadow: 0 0 2px black"
    >
      ¡En oferta!
    </div>
    <div
      v-if="product.wholesalePrice != 0"
      :class="['bg-pink-5', getMessageClass('wholesale')]"
      style="border-radius: 3px; box-shadow: 0 0 2px black"
    >
      Por mayor y detal
    </div>

    <q-card-section class="card-section-carousel">
      <q-carousel
      v-model="fullScreenSlide"
      swipeable
      animated
      infinite
      arrows
      width="100%"
      height="180px"
    >
      <q-carousel-slide
        v-for="(image, index) in product.images"
        :name="index"
        :key="index"
        :img-src="image"
      />
    </q-carousel>
    </q-card-section>

    <q-card-section class="card-section">
      <span class="product-name">{{ product.namePublic }}</span>
    </q-card-section>

    <div class="price-section-wrapper">
      <q-card-section v-if="product.stock > 0" class="card-section">
        <div class="row items-center">
          <div class="col-12">
            <q-chip size="xs" class="text-pink text-weight-bolder">
              <q-avatar icon="sell" color="pink" text-color="white" />
              <span class="sale-price">{{ formatPrice(product.salePrice) }}</span>
            </q-chip>
            <q-chip size="xs" class="sold-quantity">
              {{ product.quantitiesSold }} vendidos
            </q-chip>
          </div>
          <div class="col-12 flex justify-center">
            <q-rating
              v-model="product.rating"
              max="5"
              size="1rem"
              color="grey"
              icon="star_border"
              icon-selected="star"
              icon-half="star_half"
              no-dimming
              readonly
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section v-else class="card-section price-section">
        <q-chat-message
          :style="{fontSize: '0.7rem'}"
          avatar="icons/android-chrome-512x512.png"
          text-color="white"
          :text="['Disponible pronto.']"
          sent
          bg-color="red-5"
        />
      </q-card-section>
    </div>
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

const getMessageClass = (type) => {
  return product.isOffer && product.wholesalePrice
    ? `${type}-message-multiple`
    : "single-message";
};
</script>

<style scoped>
.single-message,
.offer-message-multiple,
.wholesale-message-multiple {
  position: absolute;
  top: 10px;
  right: -3px;
  color: white;
  padding: 5px 10px;
  font-size: 0.5rem;
  font-weight: bold;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.offer-message-multiple {
  top: 10px;
}

.wholesale-message-multiple {
  top: 35px;
}

.card-container {
  display: flex;
  flex-direction: column;
}

.card-section {
  width: 100%;
  padding: 4px;
}

.card-section-carousel {
  width: 100%;
  padding: 0px;
}

.product-name {
  font-size: 0.8rem;
  width: 100%;
  font-weight: bold;
}

.price-section-wrapper {
  margin-top: auto;
}

.sale-price {
  font-size: 0.7rem;
}

.sold-quantity {
  font-size: 0.5rem;
}
</style>
