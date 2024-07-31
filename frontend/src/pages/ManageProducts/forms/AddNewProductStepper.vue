<template>
  <q-stepper v-model="step" ref="stepper" color="pink" animated>
    <q-step :name="1" title="Info. Básica" icon="info" :done="step > 1">
      <div class="row justify-center">
        <div class="col-md-6 col-sm-12">
          <q-input
            outlined
            dense
            required
            v-model="product.name"
            label="Nombre"
            class="q-pa-xs"
          />
          <q-input
            outlined
            dense
            required
            v-model="product.quantity"
            type="number"
            label="Cantidad"
            class="q-pa-xs"
          />
          <q-input
            outlined
            dense
            required
            v-model="product.batch"
            type="number"
            label="Lote"
            class="q-pa-xs"
          />
        </div>

        <div class="col-md-6 col-sm-12">
          <q-input
            outlined
            dense
            required
            v-model="product.basePrice"
            type="number"
            label="Precio base"
            class="q-pa-xs"
          />
          <q-input
            outlined
            dense
            required
            v-model="product.salePrice"
            type="number"
            label="Precio de venta"
            class="q-pa-xs"
          />
          <q-input
            outlined
            dense
            required
            v-model="product.wholesalePrice"
            type="number"
            label="Precio al por mayor"
            class="q-pa-xs"
          />
        </div>
      </div>
    </q-step>

    <q-step :name="2" title="Info. Catálogo" icon="list" :done="step > 2">
      <div class="row justify-center">
        <div class="col-md-6 col-sm-12">
          <q-input
            outlined
            dense
            required
            v-model="product.namePublic"
            label="Nombre en el catálogo *"
            class="q-mb-xs"
          />
          <q-input
            type="textarea"
            outlined
            required
            v-model="product.characteristics"
            label="Características y descripción *"
            autogrow
            class="q-mb-xs"
          />
          <q-file
            outlined
            multiple
            label="Cargar imágenes *"
            v-model="product.images"
            required
            :rules="[
              (val) =>
                !val || val.length <= 5 || 'Puede cargar hasta 5 imágenes',
            ]"
            :max-files="5"
            use-chips
            class="q-mb-xs"
          />
        </div>
      </div>
    </q-step>

    <q-step :name="3" title="Referencias" icon="view_cozy">
      <div class="row">
        <div
          v-for="(reference, indexReference) in product.references"
          :key="indexReference"
          class="col-6"
        >
          <div
            class="q-ma-xs flex column content-center"
            style="
              width: auto;
              border: 1px solid black;
              padding: 5px;
              overflow: auto;
            "
          >
            <label
              >Nombre referencia:
              <input
                placeholder="Ejemplo: Color, Material"
                class="no-border rounded-borders q-my-xs"
                v-model="reference.name"
              />
            </label>
            <q-separator class="q-my-xs" />
            <span
              >Opciones
              <q-btn
                outline
                round
                size="xs"
                icon="add"
                @click="addOption(indexReference)"
            /></span>

            <div style="overflow: auto; height: 10rem">
              <q-expansion-item
                v-for="(option, indexOption) in reference.options"
                :key="indexOption"
                dense
                expand-separator
                :label="`Opción ${indexOption + 1}`"
                style="position: relative"
              >
                <div class="flex column bordered q-px-md">
                  <label
                    >Valor:
                    <input
                      placeholder="Ejemplo: Azul, Algodón"
                      class="no-border rounded-borders q-my-xs"
                      v-model="option.value"
                    />
                  </label>
                  <label
                    >Nombre:
                    <input
                      placeholder="Ejemplo: Azul, Algodón"
                      class="no-border rounded-borders q-my-xs"
                      v-model="option.label"
                    />
                  </label>
                  <label
                    >Cantidades:
                    <input
                      type="number"
                      placeholder="Ingrese cantidades"
                      class="no-border rounded-borders q-my-xs"
                      v-model="option.stocks"
                    />
                  </label>
                  <div
                    class="flex items-center justify-center"
                    style="position: absolute; left: 85%"
                  >
                    <q-btn
                      round
                      outline
                      size="sm"
                      color="red"
                      icon="delete"
                      @click="deleteOption(indexReference, indexOption)"
                    />
                  </div>
                </div>
              </q-expansion-item>
            </div>

            <div class="flex items-center justify-center q-mt-md">
              <q-btn
                rounded
                outline
                color="red"
                icon="delete"
                label="Referencia"
                @click="deleteReference(index)"
              />
            </div>
          </div>
        </div>
        <q-btn
          outline
          color="pink"
          label="Agregar referencia"
          @click="addReference"
          class="col-6"
        />
      </div>
    </q-step>

    <template v-slot:navigation>
      <q-stepper-navigation class="flex justify-end">
        <q-btn
          v-if="step > 1"
          flat
          color="primary"
          @click="$refs.stepper.previous()"
          label="Atrás"
          class="q-ml-sm"
        />
        <q-btn
          @click="step === 3 ? handleAddProduct() : $refs.stepper.next()"
          color="primary"
          :label="step === 3 ? 'Guardar' : 'Continuar'"
        />
      </q-stepper-navigation>
    </template>
  </q-stepper>
</template>
<script setup>
import { ref } from "vue";
import { formatPrice } from "src/utils/utilsFunctions";

const emit = defineEmits(["add-product"]);

const step = ref(1);

const product = ref({
  name: "",
  quantity: 0,
  batch: 0,
  basePrice: 0,
  salePrice: 0,
  wholesalePrice: 0,
  namePublic: "",
  characteristics: "",
  images: [],
  references: [{ name: "", options: [{ label: "", value: "", stocks: 0 }] }],
  variants: [],
});

const handleAddProduct = () => {
  console.log("Guardando");
  emit("add-product", product.value);
  // resetProduct();
};

const addReference = () => {
  product.value.references.push({
    name: "",
    options: [{ label: "", value: "", stocks: 0 }],
  });
};

const deleteReference = (index) => {
  product.value.references.splice(index, 1);
};

const addOption = (indexReference) => {
  product.value.references[indexReference].options.push({
    label: "",
    value: "",
    stocks: 0,
  });
};

const deleteOption = (indexReference, indexOption) => {
  product.value.references[indexReference].options.splice(indexOption, 1);
};
</script>
