<template>
  <q-card>
    <q-card-section>
      <q-input outlined v-model="product.name" label="Nombre" class="q-mb-md" />
      <q-input
        outlined
        v-model="product.quantity"
        type="number"
        label="Cantidad"
        class="q-mb-md"
      />
      <q-input
        outlined
        v-model="product.batch"
        type="number"
        label="Lote"
        class="q-mb-md"
      />
      <q-input
        outlined
        v-model="product.basePrice"
        type="number"
        label="Precio base"
        class="q-mb-md"
      />
      <q-input
        outlined
        v-model="product.salePrice"
        type="number"
        label="Precio de venta"
        class="q-mb-md"
      />
      <q-input
        outlined
        v-model="product.wholesalePrice"
        type="number"
        label="Precio al por mayor"
        class="q-mb-md"
      />
    </q-card-section>
    <q-card-actions vertical align="center">
      <q-btn
        size="md"
        style="width: 100px"
        label="Añadir"
        @click="addProduct"
        :loading="loadingAdd"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  loadingAdd: Boolean,
});

const product = ref({
  name: "",
  quantity: 0,
  batch: 0,
  basePrice: 0,
  salePrice: 0,
  wholesalePrice: 0
});
const emit = defineEmits(["add-product"]);

const addProduct = () => {
  emit("add-product", product.value);
  Object.assign(product.value, {
    name: "",
    quantity: 0,
    batch: 0,
    basePrice: 0,
    salePrice: 0,
    wholesalePrice: 0
  });
};
</script>
