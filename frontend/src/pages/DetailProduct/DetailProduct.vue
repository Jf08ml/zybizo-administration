<template>
  <q-page class="product-detail-page">
    <!-- Header con breadcrumb -->
    <div class="page-header">
      <div class="container">
        <q-btn
          flat
          dense
          no-caps
          icon="arrow_back"
          label="Volver al catálogo"
          class="back-btn"
          @click="$router.push('/catalogo')"
        />
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="container q-py-lg">
      <div class="row q-col-gutter-xl">
        <!-- Columna de imágenes -->
        <div class="col-12 col-md-6">
          <div class="image-section">
            <CarouselDetailItem :product="product" />
          </div>
        </div>

        <!-- Columna de información -->
        <div class="col-12 col-md-6">
          <div class="info-section">
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
      </div>

      <!-- Sección de detalles -->
      <div class="details-section q-mt-xl">
        <q-card flat bordered class="details-card">
          <q-tabs
            v-model="activeTab"
            dense
            class="text-grey-8"
            active-color="black"
            indicator-color="black"
            align="left"
          >
            <q-tab name="description" label="Descripción" icon="description" />
            <q-tab name="shipping" label="Envío" icon="local_shipping" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="activeTab" animated>
            <!-- Panel de descripción -->
            <q-tab-panel name="description">
              <div class="text-body1 text-grey-8">
                <div v-if="product.characteristics" class="q-mb-md">
                  <p style="white-space: pre-line;">{{ product.characteristics }}</p>
                </div>
                <div v-else class="text-grey-6 text-center q-py-lg">
                  <q-icon name="info" size="3rem" class="q-mb-md" />
                  <div>No hay características disponibles para este producto</div>
                </div>
              </div>
            </q-tab-panel>

            <!-- Panel de envío -->
            <q-tab-panel name="shipping">
              <div class="shipping-info">
                <q-card flat bordered class="q-mb-md shipping-card-local">
                  <q-card-section>
                    <div class="row items-center">
                      <q-icon name="local_shipping" size="2rem" color="black" class="q-mr-md" />
                      <div>
                        <div class="text-subtitle1 text-weight-bold">Envío Local - Neiva</div>
                        <div class="text-body2 text-grey-7">
                          Envío gratis según disponibilidad. Entrega inmediata con costo adicional.
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>

                <q-card flat bordered class="shipping-card-national">
                  <q-card-section>
                    <div class="row items-center">
                      <q-icon name="public" size="2rem" color="grey-8" class="q-mr-md" />
                      <div>
                        <div class="text-subtitle1 text-weight-bold">Envío Nacional</div>
                        <div class="text-body2 text-grey-7">
                          Costo aproximado entre $10.000 - $20.000 según destino.
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>

    <!-- Drawer de resumen -->
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
const activeTab = ref("description");

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

<style lang="scss" scoped>
.product-detail-page {
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  min-height: 100vh;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.back-btn {
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(-4px);
  }
}

.image-section {
  position: sticky;
  top: 100px;
}

.info-section {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.details-section {
  .details-card {
    border-radius: 12px;
    overflow: hidden;
  }
}

.shipping-info {
  .q-card {
    border-radius: 8px;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }

  .shipping-card-local {
    background: #f5f5f5;
    border: 1px solid #e0e0e0;
  }

  .shipping-card-national {
    background: #fafafa;
    border: 1px solid #e0e0e0;
  }
}

.reviews-section {
  .q-rating {
    font-size: 2rem;
  }
}

// Responsive
@media (max-width: 1023px) {
  .container {
    padding: 0 16px;
  }

  .image-section {
    position: static;
    margin-bottom: 24px;
  }

  .q-col-gutter-xl > * {
    padding: 0 12px;
  }

  .details-section {
    margin-top: 40px !important;
  }
}

@media (max-width: 599px) {
  .product-detail-page {
    background: white;
  }

  .container {
    padding: 0;
  }

  .page-header {
    padding: 12px 0;

    .container {
      padding: 0 12px;
    }
  }

  .back-btn {
    font-size: 0.875rem;
    padding: 8px 12px;
  }

  .q-py-lg {
    padding-top: 16px !important;
    padding-bottom: 16px !important;
  }

  .row.q-col-gutter-xl {
    margin: 0;

    > div {
      padding: 0;
    }
  }

  .image-section {
    margin-bottom: 16px;
    padding: 0 12px;
  }

  .info-section {
    padding: 0 12px;
  }

  .details-section {
    margin-top: 24px !important;
    padding: 0 12px;

    .details-card {
      border-radius: 8px;
    }
  }

  .shipping-info {
    .q-card {
      &:hover {
        transform: none;
      }
    }
  }
}
</style>
