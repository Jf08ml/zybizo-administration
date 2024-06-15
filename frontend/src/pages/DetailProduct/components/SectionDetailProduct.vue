<template>
  <div class="col-xs-12 col-md-7 col-lg-8 column full-height-on-mobile">
    <div class="q-ma-auto q-my-sm text-center">
      <span class="text-h5 text-weight-medium">{{ product.name }}</span>
    </div>

    <q-separator />

    <q-card class="q-pa-sm q-my-sm rounded">
      <div v-if="product?.references && product?.references.length > 0">
        <div
          v-for="(reference, index) in product.references"
          :key="index"
          class="q-py-sm"
          style="display: flex; align-items: center"
        >
          <div align="right">
            <span class="text-weight-medium q-mr-md"
              >{{ reference.name }} :</span
            >
          </div>
          <div>
            <q-btn-toggle
              dense
              v-model="reference.selectedOption"
              @update:model-value="updateReferenceOption(index, $event)"
              toggle-color="black"
              :options="reference.options"
            />
          </div>
        </div>
      </div>
    </q-card>

    <q-card>
      <div class="q-py-md" align="center">
        <span class="text-grey q-mr-sm">Cantidad</span>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-around;
            width: 100px;
          "
        >
          <q-btn
            btn
            round
            size="xs"
            icon="remove"
            class="text-body2 text-pink"
            @click="changeQuantity(-1)"
          />
          <input
            v-model="quantity"
            @update:model-value="updateQuantity"
            style="text-align: center; border: none; width: 20%"
          />
          <q-btn
            btn
            round
            size="xs"
            icon="add"
            class="text-body2 text-pink"
            @click="changeQuantity(1)"
          />
        </div>
      </div>

      <div align="center">
        <div>
          <q-chip class="q-my-md q-pa-sm shadow-3">
            <q-avatar icon="sell" color="pink" text-color="white" />
            <span class="text-h5 text-pink">{{ formatPrice(totalPrice) }}</span>
          </q-chip>
        </div>
        <div v-if="product.wholesaleQuantity > 0">
          <q-toggle
            v-model="buyWholesale"
            color="green"
            label="Activa aquí el precio mayorista"
            style="font-size: 0.7rem"
          />
          <p class="text-caption">
            Precio mayorista
            <span class="text-pink text-weight-bold">{{
              formatPrice(product.wholesalePrice)
            }}</span>
            al comprar
            <span class="text-pink text-weight-bold">{{
              product.wholesaleQuantity
            }}</span>
            o más unidades de diferente referencia, para hacer una compra mayorista debes añadir a la cesta los productos.
          </p>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { formatPrice } from "src/utils/utilsFunctions";

const props = defineProps({
  product: Object,
  totalPrice: Number,
});

const emit = defineEmits([
  "buy-item",
  "add-car",
  "update-reference-option",
  "update-quantity",
  "update-buy-wholesale"
]);

const quantity = ref(1);
const buyWholesale = ref(false);

const changeQuantity = (increment) => {
  if (increment === 1) {
    quantity.value++;
    emit("update-quantity", quantity.value);
  } else if (increment === -1 && quantity.value > 1) {
    quantity.value--;
    emit("update-quantity", quantity.value);
  }
};

const updatedWholesalePrice = () => {
  console.log("Hola");
};

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
watch(quantity, (newValue, oldValue) => {
  if (newValue <= 1) {
    quantity.value = 1;
  }
});

watch(buyWholesale, (newValue, oldValue) => {
  emit("update-buy-wholesale", newValue);
});
</script>
