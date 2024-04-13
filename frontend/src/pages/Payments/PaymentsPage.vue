<template>
  <q-page class="row">
    <!-- Primera columna -->
    <div class="col-xs-12 col-md-6 col-lg-6 q-pa-md">
      <!-- Sección de dirección de entrega -->
      <div>
        <q-list class="rounded-borders full-width shadow-1">
          <q-expansion-item
            expand-separator
            v-model="isExpanded"
            class="full-width text-uppercase"
            icon="bi-signpost"
            label="Dirección de entrega"
            :caption="viewAddress()"
          >
            <q-card class="full-width">
              <q-card-section>
                <q-form
                  @submit.prevent="onSaveAddress"
                  @reset="onReset"
                  class="q-gutter-md"
                  align="center"
                >
                  <div class="row q-gutter-x-xs">
                    <q-input
                      class="col"
                      dense
                      filled
                      v-model="deliveryAddress.contactName"
                      label="Nombre de quien recibe"
                      required
                    />

                    <q-input
                      class="col"
                      dense
                      filled
                      type="number"
                      v-model="deliveryAddress.phoneContact"
                      label="Telefono de contacto"
                      required
                    />
                  </div>

                  <div class="row q-gutter-x-xs">
                    <q-input
                      class="col"
                      dense
                      filled
                      v-model="deliveryAddress.department"
                      label="Departamento"
                      required
                    />

                    <q-input
                      class="col"
                      dense
                      filled
                      v-model="deliveryAddress.city"
                      label="Ciudad"
                      required
                    />
                  </div>

                  <div class="row q-gutter-x-xs">
                    <q-input
                      class="col"
                      dense
                      filled
                      v-model="deliveryAddress.neighborhood"
                      label="Barrio"
                      required
                    />

                    <q-input
                      class="col"
                      dense
                      filled
                      v-model="deliveryAddress.address"
                      label="Dirección de entrega"
                      required
                      hint="Ejemplo: Calle 5 sur # 1a - 81"
                    />
                  </div>
                  <div class="flex justify-end">
                    <q-btn
                      label="Limpiar campos"
                      type="reset"
                      color="primary"
                      flat
                      class="q-ml-sm"
                    />
                    <q-btn
                      label="Guardar"
                      type="submit"
                      rounded
                      color="primary"
                    />
                  </div>
                </q-form>
              </q-card-section> </q-card
          ></q-expansion-item>
        </q-list>
      </div>

      <!-- Sección de método de pago -->
      <div>
        <q-card class="q-ma-md full-width">
          <q-card-section>
            <div class="text-h6">Método de pago</div>
            <q-separator class="q-my-xs" />
            <span class="text-caption"
              >El pago del pedido es contraentrega, una vez se de clic en
              "Realizar pedido", nos comunicaremos por Whatsapp o llamada al
              número ingresado en la dirección para confirmar el envió del
              pedido.</span
            >
          </q-card-section>
        </q-card>
      </div>

      <!-- Sección de lista de cosas a comprar -->
      <div>
        <q-card class="q-ma-md full-width">
          <q-card-section>
            <div class="text-h6">Lista de productos</div>
            <q-separator />
            <div
              class="q-mt-sm"
              v-for="(itemToBuy, index) in listItems"
              :key="itemToBuy._id"
            >
              <q-card flat>
                <q-card-section horizontal class="full-width">
                  <q-card-section
                    class="flex flex-grow column justify-between full-width"
                  >
                    <div>
                      <div class="text-overline q-mt-sm q-mb-xs">
                        {{ itemToBuy.name }}
                      </div>

                      <div class="text-caption text-grey">
                        Cantidad:
                        <input
                          v-model="itemToBuy.quantity"
                          style="width: 30px; text-align: center"
                          @change="reCalculate(index)"
                        />
                      </div>

                      <div
                        class="text-caption text-grey"
                        v-if="
                          itemToBuy.references &&
                          itemToBuy.references.length > 0
                        "
                      >
                        {{
                          itemToBuy.references
                            .map((reference) => reference.selectedOption)
                            .join(", ")
                        }}
                      </div>
                    </div>

                    <div
                      class="flex justify-center text-h6 q-mt-xs q-mb-xs text-primary shadow-2"
                      align="center"
                    >
                      <span class="q-mt-xs">{{
                        formatPrice(itemToBuy.totalPrice)
                      }}</span>
                      <div>
                        <q-btn
                          flat
                          round
                          color="red"
                          icon="delete"
                          @click="removeItem(itemToBuy._id)"
                        />
                      </div>
                    </div>
                  </q-card-section>

                  <q-card-section
                    v-if="itemToBuy.image"
                    class="col-xs-6 col-md-4 col-lg-3 flex flex-center"
                  >
                    <q-img class="rounded-borders" :src="itemToBuy?.image" />
                  </q-card-section>
                </q-card-section>
              </q-card>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Segunda columna -->
    <div class="col-xs-12 col-md-6 col-lg-6 q-pa-md">
      <!-- Sección de resumen y botón de realizar pedido -->
      <div v-if="!isMobile">
        <q-card class="q-ma-5">
          <q-card-section>
            <div class="text-h6">Resumen</div>
            <q-separator class="q-my-xs" />
            <div class="row">
              <div class="col flex column">
                <span class="text-subtitle1 text-blue-grey-8">
                  Productos:
                </span>
                <span class="text-subtitle1 text-blue-grey-8"> Envió: </span>
                <span class="text-subtitle1 text-primary text-weight-bold"
                  >Total a pagar:
                </span>
              </div>
              <div class="col flex column">
                <span class="text-subtitle1 text-blue-grey-8">
                  {{ formatPrice(getTotalToPay()) }}
                </span>
                <span class="text-subtitle1 text-blue-grey-8">
                  {{
                    formatPrice(
                      deliveryAddress.city.toLowerCase() === "neiva" ? 0 : 20000
                    )
                  }}
                </span>
                <span class="text-subtitle1 text-primary text-weight-bold">
                  {{
                    formatPrice(
                      getTotalToPay() +
                        (deliveryAddress.city.toLowerCase() === "neiva"
                          ? 0
                          : 20000)
                    )
                  }}</span
                >
              </div>
            </div>
          </q-card-section>
          <q-card-actions>
            <q-btn label="Realizar pedido" color="green" class="full-width" />
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
                    {{ formatPrice(getTotalToPay()) }}
                  </span>
                  <span class="text-subtitle1 text-blue-grey-8">
                    {{
                      formatPrice(
                        deliveryAddress.city.toLowerCase() === "neiva"
                          ? 0
                          : 20000
                      )
                    }}
                  </span>
                </div>
              </div>
            </div>
          </q-slide-transition>

          <q-card-section>
            <div class="row justify-between">
              <span class="text-h6">Total a pagar:</span>

              <span class="text-subtitle1 text-primary text-weight-bold">
                <q-btn
                  flat
                  @click="showSummaryDetails = !showSummaryDetails"
                  icon="expand_more"
                />
                {{
                  formatPrice(
                    getTotalToPay() +
                      (deliveryAddress.city.toLowerCase() === "neiva"
                        ? 0
                        : 20000)
                  )
                }}
              </span>
              <q-btn label="Realizar pedido" color="green" class="full-width" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { formatPrice } from "src/utils/utilsFunctions";
import { useCarStore } from "src/stores/car";
import { useRoute } from "vue-router";

const carStore = useCarStore();
const $route = useRoute();

const deliveryAddress = ref({
  contactName: "Juan Mosquera",
  phoneContact: 3132735116,
  department: "Huila",
  city: "Neiva",
  neighborhood: "Fortalecillas",
  address: "Calle 5 # 1 - 81",
});

const isExpanded = ref(false);
const showSummaryDetails = ref(false);
const isMobile = ref(false);
const listItems = ref(null);

function updateDrawerWidth() {
  const breakpoint = 768;

  const mobile = window.innerWidth < breakpoint;
  isMobile.value = mobile;
}

const removeItem = (itemId) => {
  const index = listItems.value.findIndex((item) => item._id === itemId);
  if (index !== -1) {
    listItems.value.splice(index, 1);
  }
  carStore.removeFromItems(itemId);
  asignItemOrder();
};

onMounted(() => {
  asignItemOrder();
  updateDrawerWidth();
  window.addEventListener("resize", updateDrawerWidth);
});

const reCalculate = (index) => {
  const newPrice =
    listItems.value[index].priceUnit *
    parseInt(listItems.value[index].quantity);
  listItems.value[index].totalPrice = newPrice;
};

const asignItemOrder = () => {
  if ($route.query.type === "buy") {
    listItems.value = [...carStore.order];
  } else {
    listItems.value = [...carStore.items];
  }
};

const getTotalToPay = () => {
  if (listItems.value) {
    const total = listItems.value.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );
    return total;
  }
};

const onSaveAddress = () => {
  isExpanded.value = false;
};

const viewAddress = () => {
  if (deliveryAddress.value.address) {
    return deliveryAddress.value.address;
  }
};

const onReset = () => {
  deliveryAddress.value = {
    contactName: "",
    phoneContact: 0,
    department: "",
    city: "",
    neighborhood: "",
    address: "",
  };
};

watch(
  () => $route.query.type,
  (newValue, oldValue) => {
    asignItemOrder();
  }
);
</script>

<style scoped></style>
