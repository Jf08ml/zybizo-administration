<template>
  <q-page class="row" padding>
    <!-- Primera columna -->
    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-pa-md">
      <!-- Sección de dirección de entrega -->

      <DeliveryAddress @updateDeliveryAddress="updateDeliveryAddress" />

      <!-- Sección de método de pago -->
      <PaymentMethod />

      <!-- Sección de lista de cosas a comprar -->
      <ListItems
        :listItems="listItems"
        @reCalculate="reCalculate"
        @removeItem="removeItem"
      />
    </div>

    <!-- Segunda columna -->
    <div class="col-xs-12 col-md-6 col-lg-6 q-pa-md">
      <!-- Sección de resumen y botón de realizar pedido -->
      <div v-if="!isMobile">
        <q-card
          class="q-ma-5"
          style="
            position: fixed;
            top: 13%;
            right: 40px;
            width: calc(50% - 15px);
            max-width: 46%;
            height: auto;
          "
        >
          <q-card-section align="center">
            <div class="text-h6">Resumen</div>
            <q-separator class="q-my-xs" />
            <div class="row">
              <div class="col flex column">
                <span class="text-subtitle1 text-blue-grey-8">
                  Productos:
                </span>
                <span
                  v-if="
                    deliveryAddress.city && deliveryAddress.city.length >= 4
                  "
                  class="text-subtitle1 text-blue-grey-8"
                >
                  Envió:
                </span>
                <span class="text-subtitle1 text-pink text-weight-bold"
                  >Total a pagar:
                </span>
              </div>
              <div class="col flex column">
                <span class="text-subtitle1 text-blue-grey-8">
                  {{ formatPrice(getTotalProducts()) }}
                </span>
                <span
                  v-if="
                    deliveryAddress.city && deliveryAddress.city.length >= 4
                  "
                  class="text-subtitle1 text-blue-grey-8"
                >
                  {{ shippingCost }}
                </span>
                <span class="text-subtitle1 text-pink text-weight-bold">
                  {{ formatPrice(totalPayment) }}</span
                >
              </div>
            </div>
          </q-card-section>
          <q-card-actions>
            <q-btn
              @click="sendOrder()"
              label="Realizar pedido"
              color="pink"
              class="full-width"
            />
          </q-card-actions>
        </q-card>
      </div>

      <div v-else class="fixed-bottom full-width">
        <q-card>
          <q-slide-transition>
            <div v-show="showSummaryDetails">
              <div class="row" style="padding: 10px">
                <div class="col flex column">
                  <span class="text-subtitle1 text-blue-grey-8">
                    Productos:
                  </span>
                  <span class="text-subtitle1 text-blue-grey-8"> Envió: </span>
                </div>
                <div class="col flex column" align="right">
                  <span class="text-subtitle1 text-blue-grey-8">
                    {{ formatPrice(getTotalProducts()) }}
                  </span>
                  <span class="text-subtitle1 text-blue-grey-8">
                    {{ shippingCost }}
                  </span>
                </div>
              </div>
            </div>
          </q-slide-transition>

          <q-card-section>
            <div class="row justify-between">
              <span class="text-h6">Total a pagar:</span>

              <span class="text-subtitle1 text-pink text-weight-bold">
                <q-btn
                  flat
                  @click="showSummaryDetails = !showSummaryDetails"
                  icon="expand_more"
                />
                {{ formatPrice(totalPayment) }}
              </span>
              <q-btn
                @click="sendOrder()"
                label="Realizar pedido"
                color="pink"
                class="full-width"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { formatPrice } from "src/utils/utilsFunctions";
import { useCarStore } from "src/stores/car";
import { useRoute } from "vue-router";
import DeliveryAddress from "./components/DeliveryAddress.vue";
import PaymentMethod from "./components/PaymentMethod.vue";
import ListItems from "./components/ListsItems.vue";

const carStore = useCarStore();
const $route = useRoute();

const deliveryAddress = ref({
  contactName: "",
  phoneContact: "",
  department: "",
  city: "",
  neighborhood: "",
  address: "",
});

const showSummaryDetails = ref(false);
const isMobile = ref(false);

const listItems = ref([]);

function updateDrawerWidth() {
  const breakpoint = 768;

  const mobile = window.innerWidth < breakpoint;
  isMobile.value = mobile;
}

const removeItem = (index) => {
  carStore.removeItem(index);
  asignItemOrder();
};

const reCalculate = (index) => {
  const newPrice =
    listItems.value[index].priceUnit *
    parseInt(listItems.value[index].quantity);
  listItems.value[index].totalPrice = newPrice;
};

onMounted(() => {
  asignItemOrder();
  updateDrawerWidth();
  window.addEventListener("resize", updateDrawerWidth);
});

const updateDeliveryAddress = (newAddress) => {
  deliveryAddress.value = { ...newAddress };
};

const asignItemOrder = () => {
  if ($route.query.type === "buy") {
    listItems.value = [...carStore.order];
  } else {
    listItems.value = [...carStore.items];
  }
};

const getTotalProducts = () => {
  if (listItems.value) {
    const total = listItems.value.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );
    return total;
  }
};

const shippingCost = computed(() => {
  return formatPrice(
    deliveryAddress.value.city.toLowerCase() === "neiva" ? 0 : 20000
  );
});

const totalPayment = computed(() => {
  const total =
    getTotalProducts() +
    (deliveryAddress.value.city && deliveryAddress.value.city.length >= 4
      ? deliveryAddress.value.city.toLowerCase() === "neiva"
        ? 0
        : 20000
      : 0);
  return total;
});

const sendOrder = () => {
  console.log(deliveryAddress.value);
  console.log(listItems.value);
  console.log(totalPayment.value);
};

watch(
  () => $route.query.type,
  (newValue, oldValue) => {
    asignItemOrder();
  }
);
</script>

<style scoped></style>
