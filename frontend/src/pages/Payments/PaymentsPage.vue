<template>
  <q-page class="flex flex-wrap justify-center">
    <!-- Primera columna -->
    <div class="flex flex-center column full-width">
      <!-- Sección de dirección de entrega -->
      <q-list bordered class="rounded-borders full-width shadow-1">
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

      <!-- Sección de método de pago -->
      <q-card class="my-card full-width">
        <q-card-section>
          <div class="text-h6">Método de pago</div>
          <span class="text-caption"
            >El pago del pedido es contraentrega, una vez se de clic en
            "Realizar pedido", nos comunicaremos por Whatsapp o llamada al
            número ingresado en la dirección para confirmar el envió del
            pedido.</span
          >
        </q-card-section>
      </q-card>

      <!-- Sección de lista de cosas a comprar -->
      <q-card class="my-card full-width">
        <q-card-section>
          <div class="text-h6">Lista de productos</div>
          <!-- Aquí iría la lista de productos -->
        </q-card-section>
      </q-card>
    </div>

    <!-- Segunda columna -->
    <div class="flex flex-center column">
      <!-- Sección de resumen y botón de realizar pedido -->
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">Resumen</div>
          <!-- Aquí iría el resumen del pedido -->
        </q-card-section>
        <q-card-actions>
          <q-btn label="Realizar pedido" color="primary" class="full-width" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCarStore } from "src/stores/car";

const carStore = useCarStore();

const deliveryAddress = ref({
  contactName: "Juan Mosquera",
  phoneContact: 3132735116,
  department: "Huila",
  city: "Neiva",
  neighborhood: "Fortalecillas",
  address: "Calle 5 # 1 - 81",
});

const isExpanded = ref(false);
const listItems = ref(null);

onMounted(() => {
  asignItemOrder;
});

const asignItemOrder = () => {
  listItems.value = carStore.$state.order;
  console.log(listItems.value);
};

const onSaveAddress = () => {
  console.log("save");
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
</script>

<style>
.my-card {
  width: 300px;
  margin: 10px;
}
.column {
  flex: 1;
  padding: 10px;
}
@media (max-width: 768px) {
  .column {
    flex-basis: 100%;
  }
}
</style>
