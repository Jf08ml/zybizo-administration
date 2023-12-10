<template>
  <q-card class="bg-grey-1" align="left">
    <q-img
      :src="product.images[0]"
      height="200px"
      @click="openCarousel(product.images)"
    />

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
</template>

<script setup>
import { ref } from "vue";
import { formatPrice } from "../../../utils/utilsFunctions.js";

const props = defineProps({
  product: Object,
});

const emit = defineEmits(["open-carousel", "redirect-to-whatsApp"]);

const openCarousel = (images) => {
  emit("open-carousel", images);
};
const redirectToWhatsApp = (product) => {
  emit("redirect-to-whatsApp", product);
};
const product = props.product;
</script>
