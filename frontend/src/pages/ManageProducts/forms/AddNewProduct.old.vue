<template>
  <form @submit.prevent="handleAddProduct">
    <div style="height: 60vh; overflow: auto">
      <div class="flex justify-around q-pb-xs">
        <q-input
          outlined
          dense
          required
          v-model="product.name"
          label="Nombre"
        />
        <q-input
          outlined
          dense
          required
          v-model="product.quantity"
          type="number"
          label="Cantidad"
        />
        <q-input
          outlined
          dense
          required
          v-model="product.batch"
          type="number"
          label="Lote"
          class="q-mb-md"
        />
      </div>
      <div class="flex justify-around q-pb-xs">
        <q-input
          outlined
          dense
          required
          v-model="product.basePrice"
          type="number"
          label="Precio base"
          class="q-mb-md"
        />
        <q-input
          outlined
          dense
          required
          v-model="product.salePrice"
          type="number"
          label="Precio de venta"
          class="q-mb-md"
        />
        <q-input
          outlined
          dense
          required
          v-model="product.wholesalePrice"
          type="number"
          label="Precio al por mayor"
          class="q-mb-md"
        />
      </div>
      
      <q-separator class="q-mb-md" />
      <q-input
        filled
        dense
        required
        v-model="product.namePublic"
        label="Nombre en el catálogo *"
        class="q-mb-xs"
      />
      <q-input
        type="textarea"
        filled
        dense
        required
        v-model="product.characteristics"
        label="Características y descripción *"
        autogrow
        class="q-mb-xs"
      />
      <q-file
        filled
        multiple
        dense
        label="Cargar imágenes *"
        v-model="product.images"
        required
        :rules="[
          (val) => !val || val.length <= 5 || 'Puede cargar hasta 5 imágenes',
        ]"
        :max-files="5"
        use-chips
        class="q-mb-xs"
      />
      <q-separator class="q-mb-md" />
      <span class="text-h6"
        >Se requiere mínimo la referencia base del producto</span
      >
      <div class="text-center">
        <q-btn
          @click="addReference"
          color="pink"
          rounded
          label="Añadir referencia"
          class="q-mb-md"
          type="button"
        />
      </div>
      <div
        v-for="(reference, refIndex) in product.references"
        :key="refIndex"
        class="q-mt-md"
      >
        <q-separator class="q-my-md" />
        <q-input
          filled
          dense
          required
          v-model="reference.name"
          label="Nombre de la referencia"
          hint="Ejemplo: Talla, Color, Sabor, etc."
          class="q-mb-xs"
        />
        <div class="text-center">
          <q-btn
            @click="() => addOptionToReference(refIndex)"
            color="pink"
            rounded
            label="Añadir opción"
            class="q-my-md"
            type="button"
          />
          <q-btn
            @click="() => removeReference(refIndex)"
            color="negative"
            rounded
            label="Eliminar referencia"
            class="q-my-md"
            type="button"
          />
        </div>
        <div v-for="(option, optIndex) in reference.options" :key="optIndex">
          <q-separator class="q-my-md" />
          <q-input
            filled
            dense
            required
            v-model="option.label"
            label="Etiqueta de la opción"
            hint="Ejemplo: Grande, pequeña, mediana, etc."
            class="q-mb-xs"
          />
          <q-input
            filled
            dense
            required
            v-model="option.value"
            label="Valor de la opción"
            hint="Ejemplo: Grande, pequeña, mediana, etc."
            class="q-mb-xs"
          />
          <!-- <q-input
            filled
            dense
            required
            v-model="option.stocks"
            label="Número de existencias de la opción"
            class="q-mb-xs"
          /> -->
          <div class="text-center">
            <q-btn
              @click="() => removeOptionFromReference(refIndex, optIndex)"
              color="negative"
              rounded
              label="Eliminar opción"
              class="q-my-md"
              type="button"
            />
          </div>
        </div>
      </div>
      <q-separator class="q-mb-md" />
      <div align="center">
        <q-btn
          @click="generateVariants"
          color="pink"
          rounded
          label="Generar variantes"
          class="q-mb-md"
          type="button"
        />
      </div>
      <div v-for="(variant, varIndex) in product.variants" :key="varIndex">
        <q-separator class="q-my-md" />
        <span>{{ variant.referenceString }}</span>
        <q-input
          filled
          dense
          required
          v-model="variant.stock"
          label="Stock para esta variante"
          class="q-mb-xs"
        />
        <div class="text-center">
          <q-btn
            @click="() => removeVariant(varIndex)"
            color="negative"
            rounded
            label="Eliminar variante"
            class="q-my-md"
            type="button"
          />
        </div>
      </div>
      <div align="center">
        <q-btn
          size="md"
          color="pink"
          label="Añadir"
          type="submit"
          :loading="loadingAdd"
        />
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  loadingAdd: Boolean,
  productData: Object,
});

const emit = defineEmits(["add-product"]);

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
  emit("add-product", product.value);
  // resetProduct();
};

const generateVariants = () => {
  const references = product.value.references;
  const variants = [];

  const generateCombinations = (arr, prefix = []) => {
    if (!arr.length) {
      variants.push({ referenceString: prefix.join(", "), stock: 0 });
      return;
    }
    const [head, ...tail] = arr;
    for (let option of head.options) {
      generateCombinations(tail, [...prefix, `${head.name}: ${option.value}`]);
    }
  };

  generateCombinations(references);
  product.value.variants = variants;
};

const resetProduct = () => {
  Object.assign(product.value, {
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
};

const addReference = () => {
  product.value.references.push({
    name: "",
    options: [{ label: "", value: "", stocks: 0 }],
  });
};

const removeReference = (index) => {
  product.value.references.splice(index, 1);
};

const addOptionToReference = (referenceIndex) => {
  product.value.references[referenceIndex].options.push({
    label: "",
    value: "",
    stocks: 0,
  });
};

const removeOptionFromReference = (referenceIndex, optionIndex) => {
  product.value.references[referenceIndex].options.splice(optionIndex, 1);
};

const removeVariant = (index) => {
  product.value.variants.splice(index, 1);
};
</script>
