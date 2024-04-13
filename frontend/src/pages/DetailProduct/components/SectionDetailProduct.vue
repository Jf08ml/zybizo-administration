<template>
  <div class="col-xs-12 col-md-6 col-lg-6 q-pa-md column full-height-on-mobile">
    <div class="q-ma-auto text-center" style="height: 10%">
      <span class="text-h6">{{ product.name }}</span>
    </div>
    <q-separator class="q-mb-md" />
    <div
      style="height: 40%"
      v-if="product?.references && product?.references.length > 0"
    >
      <div
        v-for="(reference, index) in product.references"
        :key="index"
        class="q-pb-md"
      >
        <span class="text-weight-medium">{{ reference.name }} </span>
        <div class="q-pt-xs" style="width: 100%">
          <q-btn-toggle
            v-model="reference.selectedOption"
            @update:model-value="updateReferenceOption(index, $event)"
            toggle-color="primary"
            :options="reference.options"
          />
        </div>
      </div>
    </div>

    <div style="margin: auto; height: auto" align="center">
      <q-input
        v-model="quantity"
        @update:model-value="updateQuantity"
        label="Cantidad"
        type="number"
        min="1"
      />
      <q-chip class="q-mt-md" square>
        <q-avatar icon="sell" color="red" text-color="white" />
        <span class="text-h6 text-deep-orange-13">{{
          formatPrice(totalPrice)
        }}</span>
      </q-chip>
    </div>

    <q-separator class="q-mb-md" />

    <div class="flex justify-center" style="height: 10%">
      <q-btn
        rounded
        color="primary"
        label="Comprar"
        class="q-mx-xs"
        @click="buyItem"
      />
      <q-btn
        outline
        rounded
        color="primary"
        label="Añadir a la cesta"
        class="q-mx-xs"
        @click="addCar"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { formatPrice } from "src/utils/utilsFunctions";

const props = defineProps({
  product: Object,
});

const emit = defineEmits([
  "buy-item",
  "add-car",
  "update-reference-option",
  "update-quantity",
]);

const quantity = ref(1);

const buyItem = () => {
  emit("buy-item");
};

const addCar = () => {
  emit("add-car");
};

const updateReferenceOption = (referenceIndex, selectedOption) => {
  emit("update-reference-option", { referenceIndex, selectedOption });
};

const updateQuantity = () => {
  emit("update-quantity", quantity.value);
};

const totalPrice = computed(() => {
  return quantity.value * props.product.salePrice;
});

watch(quantity, (newValue, oldValue) => {
  if (newValue <= 1) {
    quantity.value = 1;
  }
});
</script>
