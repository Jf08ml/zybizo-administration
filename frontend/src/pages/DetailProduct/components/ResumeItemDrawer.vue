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
    <div style="height: 10%" align="center">
      <span class="text-h6">Resumen</span>
      <q-separator></q-separator>
    </div>
    <div style="height: 68%" class="q-pa-xs">
      <div>
        <q-card class="full-width" flat bordered>
        <q-card-section horizontal>
          <q-card-section class="q-pt-xs">
            <div class="text-overline q-mt-sm q-mb-xs">
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
          <span class="text-h6"> {{ formatPrice(totalPrice) }} </span>
        </q-card-actions>
      </q-card>
      </div>
    </div>
    <q-separator />
    <div
      style="
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 10%;
      "
    >
      <div style="display: flex; flex-direction: column">
        <span class="text-caption text-blue-grey-8">Productos:</span>
        <span class="text-caption text-blue-grey-8">Envio:</span>
        <span class="text-subtitle2 text-deep-orange-14">Total a pagar:</span>
      </div>
      <div style="display: flex; flex-direction: column; margin-inline: 15px">
        <span class="text-caption text-blue-grey-8">{{
          formatPrice(totalPrice)
        }}</span>
        <span class="text-caption text-blue-grey-8">{{
          formatPrice(20000)
        }}</span>
        <span class="text-subtitle2 text-deep-orange-14">{{
          formatPrice(totalPrice + 20000)
        }}</span>
      </div>
    </div>
    <div align="center" style="width: 80%; margin: auto">
      <span class="text-caption text-blue-grey-10"
        >Nota: El costo del envió se ajusta al ir a pagar.</span
      >
    </div>
    <q-separator />
    <div
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 8%;
      "
    >
      <q-btn
        style="margin: auto"
        class="q-mx-xs"
        label="Ir a pagar"
        color="primary"
        rounded
        @click="handleGoToPay"
      />
      <q-btn
        style="margin: auto"
        label="Cancelar"
        color="primary"
        outline
        rounded
        @click="handleDrawerChange(false)"
      />
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
