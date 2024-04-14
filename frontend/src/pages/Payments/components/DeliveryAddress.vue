<template>
  <div>
    <q-list class="rounded-borders full-width shadow-1">
      <q-expansion-item
        expand-separator
        v-model="isExpanded"
        class="full-width text-uppercase"
        icon="bi-signpost"
        header-class="text-pink"
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
                  color="black"
                  flat
                  class="q-ml-sm"
                />
                <q-btn label="Guardar" type="submit" rounded color="pink" />
              </div>
            </q-form>
          </q-card-section> </q-card
      ></q-expansion-item>
    </q-list>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({});

const emit = defineEmits(['updateDeliveryAddress']);

const deliveryAddress = ref({
  contactName: "",
  phoneContact: "",
  department: "",
  city: "",
  neighborhood: "",
  address: "",
});

const isExpanded = ref(true);

const onSaveAddress = () => {
  isExpanded.value = false;
  emit('updateDeliveryAddress', deliveryAddress.value);
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
