<template>
  <q-drawer
    :model-value="drawerState"
    @update:model-value="handleDrawerChange"
    overlay
    bordered
    side="right"
    class="q-pa-xs"
    :width="drawerWidth"
    :breakpoint="500"
    v-if="itemToBuy != null"
  >
    <div class="q-ma-sm" align="center">
      <span class="text-h6">Resumen</span>
    </div>

    <q-separator />

    <div class="q-pa-xs">
      <q-card class="full-width" flat bordered>
        <q-card-section horizontal>
          <q-card-section class="q-pt-xs">
            <div class="q-mt-sm q-mb-xs">
              {{ product.name }}
            </div>
            <div class="text-caption text-grey">
              Cantidad: {{ itemToBuy.quantity }}
            </div>
            <div
              class="text-caption text-grey"
              v-if="itemToBuy.references && itemToBuy.references.length > 0"
            >
              {{
                itemToBuy.references
                  .map((reference) => reference.selectedOption)
                  .join(", ")
              }}
            </div>
          </q-card-section>

          <q-card-section v-if="product.images" class="col-5 flex flex-center">
            <q-img class="rounded-borders" :src="product?.images[0]" />
          </q-card-section>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center">
          <span class="text-subtitle1 text-pink text-weight-bold">
            {{ formatPrice(totalPrice) }}
          </span>
        </q-card-actions>
      </q-card>
    </div>

    <div
      class="flex justify-center align-center q-py-sm fixed-bottom full-width shadow-up-1"
    >
      <div class="flex row justify-center full-width">
        <div class="flex column">
          <span class="text-subtitle1 text-pink text-weight-bold"
            >Total a pagar:</span
          >
        </div>

        <div class="flex column q-mx-md">
          <span class="text-subtitle1 text-pink text-weight-bold">{{
            formatPrice(totalPrice)
          }}</span>
        </div>
      </div>

      <div class="flex column" align="center">
        <div class="q-mt-md">
          <q-btn
            class="q-mx-md"
            label="Ir a pagar"
            color="pink"
            rounded
            @click="handleGoToPay"
          />
          <q-btn
            class="q-mx-md"
            label="Cerrar"
            color="black"
            outline
            rounded
            @click="handleDrawerChange(false)"
          />
        </div>
      </div>
    </div>
  </q-drawer>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { formatPrice } from "src/utils/utilsFunctions";

const props = defineProps({
  modelValue: Boolean,
  product: Object,
  itemToBuy: Object,
});

const emit = defineEmits(["update:model-value", "go-to-pay"]);

const drawerState = ref(props.modelValue);
const drawerWidth = ref("400px");

function updateDrawerWidth() {
  const breakpoint = 768;

  const isMobile = window.innerWidth < breakpoint;

  const widthPercentage = isMobile ? 100 : 30;

  const widthInPixels = (window.innerWidth * widthPercentage) / 100;
  drawerWidth.value = parseInt(`${widthInPixels}px`);
}

onMounted(() => {
  updateDrawerWidth();
  window.addEventListener("resize", updateDrawerWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateDrawerWidth);
});

const handleDrawerChange = (newState) => {
  drawerState.value = newState;
  emit("update:model-value", newState);
};

const handleGoToPay = () => {
  console.log("Clic");
  emit("go-to-pay");
};

watch(
  () => props.modelValue,
  (newVal) => {
    drawerState.value = newVal;
  }
);

const totalPrice = computed(() => {
  return props.itemToBuy.quantity * props.product.salePrice;
});
</script>
