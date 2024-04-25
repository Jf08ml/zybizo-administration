<template>
  <q-card class="bg-grey-1" align="left">
    <q-carousel
      v-model="fullScreenSlide"
      class="fullscreen-carousel"
      swipeable
      animated
      thumbnails
      infinite
    >
      <q-carousel-slide
        v-for="(image, index) in product.images"
        :name="index"
        :key="index"
        :img-src="image"
        @click="redirectDetailProduct"
      />
    </q-carousel>

    <q-card-section @click="redirectDetailProduct">
      <span class="text-subtitle1 text-weight-bolder" style="font-size: 1.5rem;">{{
        product.namePublic
      }}</span>
    </q-card-section>

    <q-card-section
      v-if="product.stock > 0"
      class="row items-center"
      @click="redirectDetailProduct"
    >
      <div class="col-5">
        <div>
          <q-chip class="text-pink text-weight-bolder">
            <q-avatar icon="sell" color="pink" text-color="white" />
            <span>{{ formatPrice(product.salePrice) }}</span>
          </q-chip>
        </div>

        <div class="text-caption" style="display: flex">
          <q-chip size="sm" quare>
            {{ product.quantitiesSold }} vendidos
          </q-chip>
        </div>
      </div>

      <div class="col-7 flex justify-end">
        <q-rating
          v-model="product.rating"
          max="5"
          size="1.5rem"
          color="pink-5"
          icon="star_border"
          icon-selected="star"
          icon-half="star_half"
          no-dimming
          readonly
        />
        <q-chip size="sm" quare> Envió gratis para Neiva </q-chip>
      </div>
    </q-card-section>

    <q-card-section v-else>
      <div>
        <q-chat-message
          avatar="https://i.ibb.co/njBrkRL/logo.png"
          text-color="white"
          :text="['Lo sentimos, el producto se encuentra agotado.']"
          stamp="Disponible pronto..."
          sent
          bg-color="red-5"
        />
      </div>
    </q-card-section>
    <q-card-section style="background-color: pink; padding: 0" align="center">
      <span class="text-body2 text-pink text-weight-bolder">
        ¡Precio de oferta por lanzamiento de marca!
      </span>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { formatPrice } from "../../../utils/utilsFunctions.js";
import { useRouter } from "vue-router";

const $router = useRouter();

const redirectDetailProduct = () => {
  $router.push({ name: "DetailProduct", params: { productId: product._id } });
};

const props = defineProps({
  product: Object,
});

const fullScreenSlide = ref(0);
const product = props.product;
</script>

<style scoped>
.fullscreen-carousel {
  width: 100%;
  height: 40vh;
}
</style>
