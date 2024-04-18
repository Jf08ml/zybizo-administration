<template>
  <div class="col-xs-12 col-md-7 col-lg-8 q-pa-md column full-height-on-mobile">
    <q-separator />
    <div class="q-ma-auto q-my-sm text-center">
      <span class="text-h5 text-weight-medium">{{ product.name }}</span>
    </div>
    <q-separator />

    <div v-if="product?.references && product?.references.length > 0">
      <div
        v-for="(reference, index) in product.references"
        :key="index"
        class="q-py-sm"
      >
        <div>
          <span class="text-weight-medium q-mr-md">{{ reference.name }} :</span>
          <q-btn-toggle
            v-model="reference.selectedOption"
            @update:model-value="updateReferenceOption(index, $event)"
            toggle-color="black"
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
      <q-chip class="q-my-md q-pa-sm shadow-3" square>
        <q-avatar icon="sell" color="pink" text-color="white" />
        <span class="text-h5 text-pink">{{ formatPrice(totalPrice) }}</span>
      </q-chip>
    </div>

    <q-separator />

    <div class="flex justify-center q-my-md">
      <q-btn
        rounded
        color="pink"
        label="Comprar"
        class="q-mx-xs"
        @click="buyItem"
      />
      <q-btn
        outline
        rounded
        color="black"
        label="Añadir a la cesta"
        class="q-mx-xs"
        @click="addCar"
      />
    </div>

    <q-separator />
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
