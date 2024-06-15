<template>
  <div>
    <q-list bordered class="rounded-borders full-width shadow-1">
      <q-expansion-item
        expand-separator
        v-model="isExpanded"
        class="full-width"
        icon="bi-signpost"
        header-class="text-pink text-body1"
        label="Dirección de entrega"
        :caption="viewAddress()"
        dense
      >
        <q-card flat class="q-pa-xs">
          <q-card-section>
            <q-form
              @submit.prevent="onSaveAddress"
              @reset="onReset"
              class="q-gutter-md"
            >
              <div>
                <q-input
                  class="col-12 col-md-6 full-width text-capitalize"
                  dense
                  filled
                  v-model="deliveryAddress.contactName"
                  label="Nombre de quien recibe"
                  required
                />
                <q-input
                  class="col-12 col-md-6 full-width"
                  dense
                  filled
                  type="number"
                  v-model="deliveryAddress.phoneContact"
                  label="Teléfono de contacto"
                  required
                  hint="Nota: El teléfono debe tener WhatsApp"
                />
              </div>

              <div>
                <q-input
                  class="col-12 col-md-6 full-width text-capitalize"
                  dense
                  filled
                  v-model="deliveryAddress.department"
                  label="Departamento"
                  required
                />
                <q-input
                  class="col-12 col-md-6 full-width text-capitalize"
                  dense
                  filled
                  v-model="deliveryAddress.city"
                  label="Ciudad"
                  required
                />
              </div>

              <div>
                <q-input
                  class="col-12 col-md-6 full-width text-capitalize"
                  dense
                  filled
                  v-model="deliveryAddress.neighborhood"
                  label="Barrio"
                  required
                />
                <q-input
                  class="col-12 col-md-6 full-width"
                  dense
                  filled
                  v-model="deliveryAddress.address"
                  label="Dirección de entrega"
                  required
                  hint="Ejemplo: Calle 5 sur # 1a - 81"
                />
                <q-input
                  class="col-12 col-md-6 full-width"
                  dense
                  filled
                  v-model="deliveryAddress.indications"
                  label="Indicaciones"
                  hint="Ejemplo: Salón de Belleza Bellas Artes"
                />
              </div>

              <div class="flex justify-end q-gutter-sm">
                <q-btn
                  label="Limpiar campos"
                  type="reset"
                  color="black"
                  flat
                  class="q-ml-sm"
                />
                <q-btn label="Guardar" type="submit" rounded color="pink" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isExpanded = ref(true);

const deliveryAddress = ref({
  contactName: "Juan Mosquera",
  phoneContact: "3132735116",
  department: "Huila",
  city: "Neiva",
  neighborhood: "Candido",
  address: "calle 5 # 1 - 81",
  indications: "",
});

const emit = defineEmits(["updateDeliveryAddress"]);

const onSaveAddress = () => {
  isExpanded.value = false;
  emit("updateDeliveryAddress", deliveryAddress.value);
};

const viewAddress = () =>
  deliveryAddress.value.address ||
  "Por favor, completa la dirección de entrega.";

const onReset = () => {
  Object.keys(deliveryAddress.value).forEach((key) => {
    deliveryAddress.value[key] = key === "phoneContact" ? 0 : "";
  });
};
</script>
