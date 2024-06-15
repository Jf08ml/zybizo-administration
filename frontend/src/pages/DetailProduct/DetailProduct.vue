<template>
  <q-page
    class="flex flex-center column items-center justify-space-between full-width"
  >
    <div class="flex flex-start full-width q-my-sm">
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
    <q-card>
      <div
        class="row full-width custom-padding"
        :class="{ dimmed: showDrawer }"
      >
        <div class="col-xs-12 col-md-5 col-lg-5 q-mt-md">
          <CarouselDetailItem :product="product" />

          <div class="flex full-width align-center justify-center q-mt-md">
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
        </div>

        <div class="col-xs-12 col-md-7 col-lg-7 q-my-md q-px-md">
          <SectionDetailProduct
            :product="product"
            :totalPrice="totalPrice"
            :buyWholesale="buyWholesale"
            @buy-item="buyItem"
            @add-car="addCar"
            @update-reference-option="updateReferenceOption"
            @update-quantity="updateQuantity"
            @update-buy-wholesale="updateBuyWholesale"
          />
        </div>
      </div>

      <div class="row full-width custom-padding q-mt-md">
        <span class="col-12 text-h5 q-mb-md">Detalles de envió</span>
        <div class="col-12 text-justify q-mb-lg">
          <div>
            <p class="text-body2 text-pink">
              El envió para la ciudad de Neiva es gratis según disponibilidad y
              para entrega inmediata tiene un costo adicional.
            </p>
            <p>
              Para otras ciudades tiene un costo apróximado entre $10.000 a
              $20.000.
            </p>
          </div>
        </div>
      </div>

      <div class="row full-width custom-padding">
        <span class="col-12 text-h5 q-mb-md">Detalles del producto</span>
        <div class="col-12 text-justify q-mb-lg">
          <p class="text-body2">{{ product.characteristics }}</p>
        </div>
      </div>
    </q-card>

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
import { onMounted, ref, computed } from "vue";
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
const buyWholesale = ref(false);

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

const totalPrice = computed(() => {
  const { salePrice, wholesalePrice, wholesaleQuantity } = product.value;

  const unitPrice = buyWholesale.value
    ? wholesalePrice
    : quantity.value >= wholesaleQuantity && wholesaleQuantity > 0
    ? wholesalePrice
    : salePrice;

  return quantity.value * unitPrice;
});

const updateBuyWholesale = (value) => {
  buyWholesale.value = value;
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
      position: "top-right",
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
    totalPrice: totalPrice,
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
      position: "top-right",
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
    wholesalePrice: product.value.wholesalePrice,
    wholesaleQuantity: product.value.wholesaleQuantity,
    isWholesaleMix: product.value.isWholesaleMix,
    buyWholesale: buyWholesale.value,
    priceUnit: product.value.salePrice,
    totalPrice: totalPrice,
  };

  carStore.addItem(itemToBuy.value);

  Notify.create({
    type: "positive",
    message: "Añadido a la cesta.",
    progress: true,
    textColor: "white",
    position: "top-right",
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
.custom-padding {
  padding: 0 80px;
}
@media (max-width: 599px) {
  .full-height-on-mobile {
    height: 100%;
  }
  .custom-padding {
    padding: 0 20px;
  }
}
</style>
