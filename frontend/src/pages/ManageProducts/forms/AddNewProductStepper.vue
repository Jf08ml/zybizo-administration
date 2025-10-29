<template>
  <q-stepper v-model="step" ref="stepper" :color="isEditMode ? 'orange' : 'pink'" animated>
    <q-step :name="1" title="Info. Básica" icon="info" :done="step > 1">
      <div class="row q-gutter-md">
        <!-- Información básica -->
        <div class="col-12 col-md-5">
          <div class="text-h6 q-mb-md">Información del producto</div>

          <q-input
            outlined
            dense
            required
            v-model="product.name"
            label="Nombre del producto *"
            class="q-mb-md"
            hint="Nombre interno para gestión"
          />

          <q-input
            outlined
            dense
            v-model="product.namePublic"
            label="Nombre público"
            class="q-mb-md"
            hint="Nombre que verán los clientes (opcional)"
          />

          <q-input
            outlined
            dense
            v-model="product.description"
            label="Descripción"
            type="textarea"
            rows="3"
            class="q-mb-md"
            hint="Descripción detallada del producto"
          />

          <q-select
            outlined
            dense
            v-model="product.category"
            :options="categoryStore.categories"
            option-value="_id"
            option-label="name"
            emit-value
            map-options
            label="Categoría"
            class="q-mb-md"
            hint="Selecciona una categoría"
            clearable
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <q-icon :name="scope.opt.icon || 'category'" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.name }}</q-item-label>
                  <q-item-label caption>Nivel {{ scope.opt.level || 0 }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <!-- Inventario y precios -->
        <div class="col-12 col-md-5">
          <div class="text-h6 q-mb-md">Inventario y precios</div>

          <div class="row q-gutter-sm q-mb-md">
            <div class="col">
              <q-input
                outlined
                dense
                v-model="product.sku"
                label="SKU (opcional)"
                hint="Se genera automáticamente si está vacío"
              />
            </div>
            <div class="col">
              <q-input
                outlined
                dense
                v-model="product.batch"
                label="Lote"
                hint="Número de lote o batch"
              />
            </div>
          </div>

          <div class="row q-gutter-sm q-mb-md">
            <div class="col">
              <q-input
                outlined
                dense
                required
                v-model.number="product.stock"
                type="number"
                min="0"
                label="Stock inicial *"
              />
            </div>
            <div class="col">
              <q-input
                outlined
                dense
                v-model.number="product.minStock"
                type="number"
                min="0"
                label="Stock mínimo"
                hint="Alerta cuando llegue a este nivel"
              />
            </div>
          </div>

          <q-input
            outlined
            dense
            required
            v-model.number="product.basePrice"
            type="number"
            min="0"
            step="0.01"
            label="Precio base *"
            class="q-mb-md"
            hint="Precio de compra o costo"
          />

          <q-input
            outlined
            dense
            required
            v-model.number="product.salePrice"
            type="number"
            min="0"
            step="0.01"
            label="Precio de venta *"
            class="q-mb-md"
          />

          <div class="row q-gutter-sm">
            <div class="col">
              <q-input
                outlined
                dense
                v-model.number="product.wholesalePrice"
                type="number"
                min="0"
                step="0.01"
                label="Precio mayoreo"
              />
            </div>
            <div class="col">
              <q-input
                outlined
                dense
                v-model.number="product.wholesaleQuantity"
                type="number"
                min="1"
                label="Cantidad mínima mayoreo"
              />
            </div>
          </div>
        </div>
      </div>
    </q-step>

    <q-step :name="2" title="Multimedia y configuración" icon="image" :done="step > 2">
      <div class="row q-gutter-md">
        <!-- Multimedia -->
        <div class="col-12 col-md-5">
          <div class="text-h6 q-mb-md">Imágenes y contenido</div>

          <q-input
            type="textarea"
            outlined
            v-model="product.characteristics"
            label="Características y descripción"
            autogrow
            rows="4"
            class="q-mb-md"
            hint="Características detalladas para mostrar al cliente"
          />

          <q-file
            outlined
            multiple
            label="Cargar imágenes"
            v-model="product.images"
            :rules="[
              (val) =>
                !val || val.length <= 5 || 'Puede cargar hasta 5 imágenes',
            ]"
            :max-files="5"
            use-chips
            class="q-mb-md"
            hint="Hasta 5 imágenes del producto"
          />

          <q-input
            outlined
            dense
            v-model="tagsInput"
            label="Etiquetas (separadas por comas)"
            class="q-mb-md"
            hint="Ej: nuevo, promoción, destacado"
            @update:model-value="updateTags"
          />
        </div>

        <!-- Configuración -->
        <div class="col-12 col-md-5">
          <div class="text-h6 q-mb-md">Configuración</div>

          <div class="q-gutter-md">
            <q-toggle
              v-model="product.isActive"
              label="Producto activo"
              color="positive"
              class="q-mb-sm"
            />
            <div class="text-caption text-grey-6 q-mb-md">
              Los productos inactivos no aparecerán en el sistema
            </div>

            <q-toggle
              v-model="product.isActiveInCatalog"
              label="Visible en catálogo público"
              color="primary"
              class="q-mb-sm"
            />
            <div class="text-caption text-grey-6 q-mb-md">
              Activar para que aparezca en la tienda online
            </div>

            <q-toggle
              v-model="product.isOffer"
              label="Producto en oferta"
              color="orange"
              class="q-mb-sm"
            />
            <div class="text-caption text-grey-6 q-mb-md">
              Marcar si tiene precio especial
            </div>

            <q-toggle
              v-model="product.isWholesaleMix"
              label="Permitir mezcla en mayoreo"
              color="purple"
              class="q-mb-sm"
            />
            <div class="text-caption text-grey-6">
              Permitir combinar con otros productos para precio mayoreo
            </div>
          </div>
        </div>
      </div>
    </q-step>

    <q-step :name="3" title="Variantes (opcional)" icon="tune">
      <div class="row">
        <div class="col-12">
          <div class="text-h6 q-mb-md">Referencias y variantes del producto</div>
          <div class="text-caption text-grey-6 q-mb-md">
            Añade variantes como colores, tallas, materiales, etc. Solo si el producto las tiene.
          </div>
        </div>

        <div
          v-for="(reference, indexReference) in product.references"
          :key="indexReference"
          class="col-12 col-md-6"
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
          :label="step === 3 ? (isEditMode ? 'Actualizar' : 'Guardar') : 'Continuar'"
        />
      </q-stepper-navigation>
    </template>
  </q-stepper>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { formatPrice } from "src/utils/utilsFunctions";
import { useCategoryStore } from "src/stores/categories";

const props = defineProps({
  initialProduct: {
    type: Object,
    default: null
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["add-product"]);
const categoryStore = useCategoryStore();

const step = ref(1);
const tagsInput = ref("");

// Cargar categorías y producto inicial al montar el componente
onMounted(async () => {
  if (!categoryStore.categories.length) {
    await categoryStore.fetchCategories();
  }

  // Si estamos en modo edición, cargar el producto
  if (props.isEditMode && props.initialProduct) {
    product.value = { ...props.initialProduct };

    // Cargar tags si existen
    if (product.value.tags && Array.isArray(product.value.tags)) {
      tagsInput.value = product.value.tags.join(', ');
    }

    // Si no hay referencias, inicializar con estructura por defecto
    if (!product.value.references || product.value.references.length === 0) {
      product.value.references = [{ name: "", options: [{ label: "", value: "", stocks: 0 }] }];
    }

    // Asegurar que las imágenes sean un array
    if (!product.value.images) {
      product.value.images = [];
    }
  }
});

const product = ref({
  // Información básica
  name: "",
  namePublic: "",
  description: "",
  characteristics: "",

  // Categorización
  category: null,
  tags: [],

  // Identificación
  sku: "",
  batch: "",

  // Inventario
  quantity: 0,
  stock: 0,
  minStock: 5,

  // Precios
  basePrice: 0,
  salePrice: 0,
  wholesalePrice: 0,
  wholesaleQuantity: 1,

  // Multimedia
  images: [],

  // Referencias/Variantes
  references: [{ name: "", options: [{ label: "", value: "", stocks: 0 }] }],

  // Estado y configuración
  isActiveInCatalog: false,
  isActive: true,
  isWholesaleMix: false,
  isOffer: false
});

const handleAddProduct = () => {
  // Sincronizar quantity con stock
  product.value.quantity = product.value.stock;

  emit("add-product", product.value);
  // resetProduct();
};

const updateTags = (value) => {
  if (value) {
    product.value.tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  } else {
    product.value.tags = [];
  }
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
