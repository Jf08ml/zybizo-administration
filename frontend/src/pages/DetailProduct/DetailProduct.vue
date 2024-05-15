<template>
  <div class="flex flex-start full-width">
    <q-btn
      flat
      rounded
      no-caps
      size="md"
      icon="arrow_back_ios"
      label="Volver al catálogo"
      @click="$router.push('/catalogozybizo')"
    />
  </div>
  <q-page
    class="flex flex-center column items-center justify-space-between q-pa-md full-width"
  >
    <div class="row full-width" :class="{ dimmed: showDrawer }">
      <div class="col-xs-12 col-md-5 col-lg-4 q-pa-xs">
        <CarouselDetailItem :product="product" />
      </div>

      <SectionDetailProduct
        :product="product"
        @buy-item="buyItem"
        @add-car="addCar"
        @update-reference-option="updateReferenceOption"
        @update-quantity="updateQuantity"
      />
    </div>

    <div class="row full-width q-mt-xs q-pa-sm">
      <span class="col-12 text-h4 q-mb-md">Detalles</span>
      <div class="lg:col-6 md:col-6 sm:col-12 xs:col-12 text-justify q-mb-lg">
        <span class="text-body2 text-pink"
          >El envió para la ciudad de Neiva es gratis, para otras ciudades tiene
          un costo apróximado entre $10.000 a $20.000.</span
        >
      </div>
      <div class="lg:col-6 md:col-6 sm:col-12 xs:col-12 text-justify q-pl-lg">
        <span class="text-body2">{{ product.characteristics }}</span>
      </div>
    </div>

    <ResumeItemDrawer
      :model-value="showDrawer"
      :product="product"
      :itemToBuy="itemToBuy"
      @go-to-pay="goToPay"
      @update:model-value="showDrawer = $event"
    />
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Notify } from "quasar";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useCarStore } from "src/stores/car";
import { getProduct } from "src/services/productService";
import CarouselDetailItem from "./components/CarouselDetailItem.vue";
import SectionDetailProduct from "./components/SectionDetailProduct.vue";
import ResumeItemDrawer from "./components/ResumeItemDrawer.vue";

const $route = useRoute();
const $router = useRouter();

const carStore = useCarStore();
const productId = ref("");
const product = ref({});
const quantity = ref(1);
const itemToBuy = ref(null);
const showDrawer = ref(false);

onMounted(async () => {
  productId.value = $route.params.productId;
  await getDetailProduct();
});

const getDetailProduct = async () => {
  try {
    const response = await getProduct(productId.value);
    response.data.references.forEach((reference) => {
      if (reference.options.length === 1) {
        reference.selectedOption = reference.options[0].value;
      }
    });
    product.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const buyItem = () => {
  const allReferencesSelected = product.value?.references.every(
    (reference) => reference.selectedOption != null
  );

  if (!allReferencesSelected) {
    Notify.create({
      type: "warning",
      message: "Debes seleccionar las referencias",
      progress: true,
      textColor: "white",
      position: "bottom-right",
    });
    return;
  }

  itemToBuy.value = {
    _id: product.value._id,
    name: product.value.name,
    image: product.value.images[0],
    references: product.value?.references.map((reference) => ({
      name: reference.name,
      selectedOption: reference.selectedOption,
    })),
    quantity: quantity.value,
    priceUnit: product.value.salePrice,
    totalPrice: quantity.value * product.value.salePrice,
  };

  showDrawer.value = true;
};

const goToPay = () => {
  carStore.addOrder(itemToBuy.value);
  $router.push({
    name: "PaymentPage",
    query: { type: "buy", time: Date.now() },
  });
};

const addCar = () => {
  const allReferencesSelected = product.value.references.every(
    (reference) => reference.selectedOption != null
  );

  if (!allReferencesSelected) {
    Notify.create({
      type: "warning",
      message: "Debes seleccionar las referencias",
      progress: true,
      textColor: "white",
      position: "bottom-right",
    });
    return;
  }

  itemToBuy.value = {
    _id: product.value._id,
    name: product.value.name,
    image: product.value.images[0],
    references: product.value?.references.map((reference) => ({
      name: reference.name,
      selectedOption: reference.selectedOption,
    })),
    quantity: quantity.value,
    priceUnit: product.value.salePrice,
    totalPrice: quantity.value * product.value.salePrice,
  };

  carStore.addItem(itemToBuy.value);

  Notify.create({
    type: "positive",
    message: "Añadido a la cesta.",
    progress: true,
    textColor: "white",
    position: "bottom-right",
  });
};

const updateReferenceOption = (reference) => {
  product.value.references[reference.referenceIndex].selectedOption =
    reference.selectedOption;
};

const updateQuantity = (newVal) => {
  if (newVal < 1) {
    quantity.value = 1;
  } else {
    quantity.value = newVal;
  }
};
</script>

<style scoped>
@media (max-width: 599px) {
  .full-height-on-mobile {
    height: 100%;
  }
}
</style>
