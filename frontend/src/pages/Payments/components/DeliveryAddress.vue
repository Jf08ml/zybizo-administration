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
                <q-select
                  class="col-12 col-md-6 full-width"
                  dense
                  filled
                  v-model="deliveryAddress.department"
                  :options="filteredDepartments"
                  option-label="name"
                  option-value="id"
                  label="Departamento"
                  use-input
                  required
                  @filter="filterDepartments"
                />
                <q-select
                  class="col-12 col-md-6 full-width"
                  dense
                  filled
                  v-model="deliveryAddress.city"
                  :options="filteredCities"
                  option-label="name"
                  option-value="id"
                  label="Ciudad"
                  use-input
                  required
                  @filter="filterCities"
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
import { ref, onMounted, watch } from "vue";
import axios from "axios";

const isExpanded = ref(true);

const deliveryAddress = ref({
  contactName: "",
  phoneContact: "",
  department: "",
  city: "",
  neighborhood: "",
  address: "",
  indications: "",
});

const departments = ref([]);
const filteredDepartments = ref([]);
const cities = ref([]);
const filteredCities = ref([]);

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
  filteredDepartments.value = departments.value;
  filteredCities.value = cities.value;
};

const fetchDepartments = async () => {
  try {
    const response = await axios.get("https://api-colombia.com/api/v1/Department");
    departments.value = response.data;
    filteredDepartments.value = response.data;
  } catch (error) {
    console.error("Error al obtener los departamentos:", error);
  }
};

const fetchCities = async (departmentId) => {
  try {
    const response = await axios.get(
      `https://api-colombia.com/api/v1/Department/${departmentId}/cities`
    );
    cities.value = response.data;
    filteredCities.value = response.data;
  } catch (error) {
    console.error("Error al obtener las ciudades:", error);
  }
};

const filterDepartments = (val, update) => {
  if (val === "") {
    update(() => {
      filteredDepartments.value = departments.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    const filtered = departments.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
    filteredDepartments.value = filtered.length ? filtered : [{ name: "No encontrado" }];
  });
};

const filterCities = (val, update) => {
  if (val === "") {
    update(() => {
      filteredCities.value = cities.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    const filtered = cities.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
    filteredCities.value = filtered.length ? filtered : [{ name: "No encontrado" }];
  });
};

watch(
  () => deliveryAddress.value.department,
  (newDepartment) => {
    if (newDepartment) {
      fetchCities(newDepartment.id);
    }
  }
);

onMounted(fetchDepartments);
</script>
