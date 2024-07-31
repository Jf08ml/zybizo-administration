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
                  class="col-12 col-md-6 full-width text-normal-case"
                  dense
                  filled
                  v-model="deliveryAddress.email"
                  label="Correo eléctronico"
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
                  option-value="name"
                  label="Departamento"
                  use-input
                  @filter="filterDepartments"
                  @update:model-value="updateDepartment"
                />
                <q-select
                  class="col-12 col-md-6 full-width"
                  dense
                  filled
                  v-model="deliveryAddress.city"
                  :options="filteredCities"
                  option-label="name"
                  option-value="name"
                  label="Ciudad"
                  use-input
                  @filter="filterCities"
                  @update:model-value="updateCity"
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
import { ref, onMounted } from "vue";
import axios from "axios";
import { Notify } from "quasar";

const isExpanded = ref(true);

const deliveryAddress = ref({
  contactName: "",
  email:"",
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
  if(!deliveryAddress.value.department || !deliveryAddress.value.city) {
    Notify.create({
      message: "Por favor, selecciona un departamento y una ciudad.",
      color: "negative",
    });
    return;
  } else {
    isExpanded.value = false;
    emit("updateDeliveryAddress", deliveryAddress.value);
  }
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
    const response = await axios.get(
      "https://api-colombia.com/api/v1/Department"
    );
    departments.value = response.data;
    filteredDepartments.value = response.data;
  } catch (error) {
    console.error("Error al obtener los departamentos:", error);
  }
};

const updateDepartment = (val) => {
  const department = filteredDepartments.value.find(
    (dept) => dept.id === val.id
  );
  if (department) {
    deliveryAddress.value.department = department.name;
    fetchCities(department.id);
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

const updateCity = (val) => {
  const city = filteredCities.value.find((city) => city.id === val.id);
  if (city) {
    deliveryAddress.value.city = city.name;
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
    filteredDepartments.value = filtered.length
      ? filtered
      : [{ name: "No encontrado" }];
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
    filteredCities.value = filtered.length
      ? filtered
      : [{ name: "No encontrado" }];
  });
};

// watch(
//   () => deliveryAddress.value.department,
//   () => {
//     if (deliveryAddress.value.department) {
//       const departmentId = filteredDepartments.value.find(
//         (dept) => dept.name === deliveryAddress.value.department
//       );

//       fetchCities(departmentId.id);
//     }
//   }
// );

onMounted(fetchDepartments);
</script>
