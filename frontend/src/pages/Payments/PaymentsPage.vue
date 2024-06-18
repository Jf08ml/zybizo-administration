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

            <div v-if="deliveryAddress.city.toLowerCase() === 'neiva'">
              <q-select
                borderless
                v-model="deliveryType"
                :options="optionsDeliveryType"
                label="Seleccione tipo de domicilio"
                class="q-px-md"
              />
            </div>

            <div
              class="flex full-width"
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
              "
            >
              <div style="flex-grow: 1; margin-right: 8px">
                <q-input
                  class="q-mt-md"
                  dense
                  filled
                  v-model="cupon"
                  label="Cupón de descuento"
                  required
                  :disable="inputCuponDisabled"
                />
              </div>
              <div>
                <q-btn
                  v-if="!inputCuponDisabled"
                  @click="aplicarDescuento()"
                  label="Aplicar"
                  color="pink"
                  style="margin-top: 13px"
                />
                <q-btn
                  v-else
                  @click="
                    (inputCuponDisabled = false),
                      (cupon = ''),
                      (cuponDiscount = 0)
                  "
                  label="Quitar"
                  color="pink"
                  style="margin-top: 13px"
                />
              </div>
            </div>
          </q-card-section>
          <q-card-actions>
            <q-btn
              :disable="disableSendOrder"
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
                  <span
                    v-if="
                      deliveryAddress.city && deliveryAddress.city.length >= 4
                    "
                    class="text-subtitle1 text-blue-grey-8"
                  >
                    Envió:
                  </span>
                </div>
                <div class="col flex column" align="right">
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
                </div>
              </div>
              <div v-if="deliveryAddress.city.toLowerCase() === 'neiva'">
                <q-select
                  borderless
                  v-model="deliveryType"
                  :options="optionsDeliveryType"
                  label="Seleccione tipo de domicilio"
                  class="q-px-md"
                />
              </div>
              <div
                class="flex full-width"
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding-inline: 10px;
                "
              >
                <div style="flex-grow: 1; margin-right: 8px">
                  <q-input
                    class="q-mt-md"
                    dense
                    filled
                    v-model="cupon"
                    label="Cupón de descuento"
                    required
                    :disable="inputCuponDisabled"
                  />
                </div>
                <div>
                  <q-btn
                    v-if="!inputCuponDisabled"
                    @click="aplicarDescuento()"
                    label="Aplicar"
                    color="pink"
                    style="margin-top: 13px"
                  />
                  <q-btn
                    v-else
                    @click="
                      (inputCuponDisabled = false),
                        (cupon = ''),
                        (cuponDiscount = 0)
                    "
                    label="Quitar"
                    color="pink"
                    style="margin-top: 13px"
                  />
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
                :disable="disableSendOrder"
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
import { searchReward } from "src/services/rewardService";
import { createOrder } from "src/services/orderService";
import { formatPrice } from "src/utils/utilsFunctions";
import { useCarStore } from "src/stores/car";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import DeliveryAddress from "./components/DeliveryAddress.vue";
import PaymentMethod from "./components/PaymentMethod.vue";
import ListItems from "./components/ListsItems.vue";
import { Notify } from "quasar";

const carStore = useCarStore();
const $route = useRoute();
const $router = useRouter();
const deliveryAddress = ref({
  contactName: "",
  phoneContact: "",
  department: "",
  city: "",
  neighborhood: "",
  address: "",
});

const cupon = ref("");
const cuponDiscount = ref(0);
const inputCuponDisabled = ref(false);

const showSummaryDetails = ref(false);
const isMobile = ref(false);

const listItems = ref([]);

const deliveryType = ref(null);
const optionsDeliveryType = [
  "Entrega normal (1 día habil sin costo)",
  "Entrega inmediata ( 10 a 30 mins, costo según domicilio)",
];

const disableSendOrder = computed(() => {
  if (
    deliveryAddress.value.address === "" ||
    (deliveryAddress.value.city.toLowerCase() === "neiva" &&
      deliveryType.value === null)
  ) {
    return true;
  } else {
    return false;
  }
});

function updateDrawerWidth() {
  const breakpoint = 768;

  const mobile = window.innerWidth < breakpoint;
  isMobile.value = mobile;
}

const removeItem = (index) => {
  carStore.removeItem(index);
  asignItemOrder();
};

const reCalculate = () => {
  const totalPrice = getTotalProducts();
  const itemsMix = listItems.value
    .filter((item) => item.isWholesaleMix)
    .reduce((acumulator, item) => acumulator + item.quantity, 0);

  const updatedItems = listItems.value.map((item) => {
    let newPrice = item.priceUnit * item.quantity;

    if (
      (item.isWholesaleMix && itemsMix >= item.wholesaleQuantity) ||
      totalPrice >= 100000
    ) {
      if (item.wholesalePrice > 0) {
        newPrice = item.wholesalePrice * item.quantity;
      }
    }

    return { ...item, totalPrice: newPrice };
  });

  // Recalcular totalPrice después de actualizar los precios
  const newTotalPrice = updatedItems.reduce(
    (acc, item) => acc + item.totalPrice,
    0
  );

  // Verificar si el nuevo totalPrice requiere una actualización de los precios mayoristas
  const finalItems = updatedItems.map((item) => {
    let newPrice = item.priceUnit * item.quantity;

    if (
      (item.isWholesaleMix && itemsMix >= item.wholesaleQuantity) ||
      newTotalPrice >= 100000
    ) {
      if (item.wholesalePrice > 0) {
        newPrice = item.wholesalePrice * item.quantity;
      }
    }

    return { ...item, totalPrice: newPrice };
  });

  listItems.value = finalItems;
};

onMounted(() => {
  asignItemOrder();
  updateDrawerWidth();
  window.addEventListener("resize", updateDrawerWidth);
});

const updateDeliveryAddress = (newAddress) => {
  deliveryAddress.value = { ...newAddress };
  showSummaryDetails.value = true;
};

const asignItemOrder = () => {
  if ($route.query.type === "buy") {
    listItems.value = [...carStore.order];
  } else {
    let items = [...carStore.items];

    const itemsMixFilter = items.filter((item) => item.isWholesaleMix);

    const itemsMixTotal = itemsMixFilter.reduce(
      (acumulator, item) => acumulator + item.quantity,
      0
    );
    const totalPrice = items.reduce(
      (acumulator, item) => acumulator + item.totalPrice,
      0
    );

    if (
      itemsMixTotal >= itemsMixFilter[0]?.wholesaleQuantity ||
      totalPrice >= 100000
    ) {
      items = items.map((item) => ({
        ...item,
        totalPrice:
          item.wholesalePrice > 0
            ? item.wholesalePrice * item.quantity
            : item.priceUnit * item.quantity,
      }));

      listItems.value = items;
    } else {
      items = items.map((item) => ({
        ...item,
        totalPrice: item.quantity * item.priceUnit,
      }));

      listItems.value = items;
    }
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
  const productsTotal = getTotalProducts();
  const shipping =
    deliveryAddress.value.city && deliveryAddress.value.city.length >= 4
      ? deliveryAddress.value.city.toLowerCase() === "neiva"
        ? 0
        : 20000
      : 0;

  const total = productsTotal + shipping - cuponDiscount.value;
  return total;
});

const aplicarDescuento = async () => {
  try {
    if (cupon.value === "") {
      return;
    }
    const response = await searchReward({ "cupon.codeCupon": cupon.value });
    if (response.data.cupon.used === true) {
      Notify.create({
        icon: "info",
        message: "El cupon ya ha sido usado.",
        color: "negative",
      });
      return;
    }
    cuponDiscount.value = response.data.cupon.valorCupon;
    inputCuponDisabled.value = true;
  } catch (error) {
    console.error(error);
  }
};

const sendOrder = async () => {
  const response = await createOrder({
    deliveryAddress: deliveryAddress.value,
    items: listItems.value,
    totalToPay: totalPayment.value,
    deliveryType: deliveryType.value,
  });
  if (response.data.status === "success") {
    $router.push({ name: "OrderSend" });
  }
};

watch(
  () => $route.query.type,
  (newValue, oldValue) => {
    asignItemOrder();
  }
);
</script>

<style scoped></style>
