<template>
  <q-card>
    <q-card-section>
      <q-input outlined v-model="product.name" label="Name" class="q-mb-md" />
      <q-input
        outlined
        v-model="product.quantity"
        type="number"
        label="Quantity"
        class="q-mb-md"
      />
      <q-input
        outlined
        v-model="product.batch"
        type="number"
        label="Batch"
        class="q-mb-md"
      />
      <q-input
        outlined
        v-model="product.basePrice"
        type="number"
        label="Base price"
        class="q-mb-md"
      />
      <q-input
        outlined
        v-model="product.salePrice"
        type="number"
        label="Sale price"
        class="q-mb-md"
      />
    </q-card-section>
    <q-card-actions vertical align="center">
      <q-btn
        size="md"
        style="width: 100px"
        label="Add"
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
  });
};
</script>
