<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <q-expansion-item label="Añadir producto" icon="add" default-closed>
        <AddNewProduct @add-product="addProduct" />
      </q-expansion-item>
      <q-separator />
    </div>

    <!-- Visualización de productos en tarjetas -->
    <div class="q-gutter-md row flex-center">
      <ProductCard
        v-for="item in products"
        :key="item.id"
        :product="item"
        @sell-product="ConfirmSellProduct"
        @delete-product="deleteItem"
        @add-stock="dialogAddStock"
        @create-catalog-product="showFormProductCatalog"
      />
    </div>

    <div>
      <q-dialog v-model="sellDialog" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">
              Confirm sale
              <span class="text-positive">{{ productSale.name }}</span>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              dense
              v-model="productSale.quantity"
              label="Quantity"
              autofocus
              @keyup.enter="prompt = false"
            />
            <q-input
              dense
              v-model="productSale.salePrice"
              label="Price"
              autofocus
              @keyup.enter="prompt = false"
            />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Confirm" v-close-popup @click="saleProduct" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <div>
      <q-dialog v-model="addItemStock" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">
              Add stock
              <span class="text-positive">{{ productUpdate.name }}</span>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              dense
              v-model="productUpdate.stock"
              label="Stock"
              autofocus
              @keyup.enter="prompt = false"
            />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn
              flat
              label="Confirm"
              v-close-popup
              @click="sendUpdateProduct"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <div>
      <q-dialog v-model="showFormCatalog">
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">
              Añadir información:
              <span class="text-positive">{{ productOfCatalog.name }}</span>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-form @submit.prevent="createCatalogProduct">
              <q-input
                filled
                v-model="productOfCatalog.namePublic"
                label="Nombre en el catálogo *"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type something',
                ]"
              />

              <q-input
                type="textarea"
                filled
                v-model="productOfCatalog.characteristics"
                label="Caracteristicas y descripción *"
                autogrow
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Please provide a description',
                ]"
              >
              </q-input>

              <q-file
                filled
                multiple
                label="Cargar imagenes *"
                v-model="productOfCatalog.images"
                :rules="[
                  (val) =>
                    !val ||
                    val.length <= 5 ||
                    'You can only upload up to 5 images',
                ]"
                :max-files="5"
                use-chips
              >
              </q-file>

              <q-btn
                @click="addReference"
                label="Añadir referencia"
                type="button"
              />

              <div
                v-for="(reference, refIndex) in productOfCatalog.references"
                :key="refIndex"
              >
                <q-input
                  filled
                  v-model="reference.name"
                  label="Nombre de la referencia"
                />
                <q-btn
                  @click="() => addOptionToReference(refIndex)"
                  label="Añadir opción"
                  type="button"
                />

                <div
                  v-for="(option, optIndex) in reference.options"
                  :key="optIndex"
                >
                  <q-input
                    filled
                    v-model="option.label"
                    label="Etiqueta de la opción"
                  />
                  <q-input
                    filled
                    v-model="option.value"
                    label="Valor de la opción"
                  />
                  <q-input
                    filled
                    v-model="option.stocks"
                    label="Valor de existencias"
                  />
                </div>
              </div>

              <div align="right">
                <q-btn
                  flat
                  label="Cerrar"
                  v-close-popup
                  @click="showFormProductCatalog"
                  color="primary"
                  class="q-ml-sm"
                />
                <q-btn label="Activar" type="submit" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../../services/productService.js";
import { createProductSale } from "../../services/productSaleService.js";
import { uploadImagesFile } from "../../services/uploadImages.js";
import ProductCard from "./Cards/ProductCard.vue";
import AddNewProduct from "./Forms/AddNewProduct.vue";

const productSale = ref({
  name: "",
  quantity: 0,
  batch: 0,
  salePrice: 0,
  productId: null,
});

const productUpdate = ref({});

const productOfCatalog = ref({
  name: "",
  namePublic: "",
  characteristics: "",
  images: [],
  references: [{ name: "", options: [{ label: "", value: "" }] }],
});

const products = ref([]);

const originalProductSale = ref({});
const originalProductUpdate = ref({});
const originalProductOfCatalog = ref({});

const loadingAdd = ref(false);
const sellDialog = ref(false);
const addItemStock = ref(false);
const showFormCatalog = ref(false);

onBeforeMount(async () => {
  await getAllProducts();
});

// Funciones para manejar un producto
const addProduct = async (product) => {
  loadingAdd.value = true;
  try {
    await createProduct(product);
  } catch (error) {
    console.error(error);
  }

  await getAllProducts();
  loadingAdd.value = false;
};

const getAllProducts = async () => {
  try {
    const response = await getProducts();
    products.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const sendUpdateProduct = async () => {
  await updateProduct(productUpdate.value._id, productUpdate.value);
  await getAllProducts();
};

const deleteItem = async (product) => {
  await deleteProduct(product._id);
  await getAllProducts();
};

// Funciones para manejar una venta
const saleProduct = async () => {
  try {
    await createProductSale(productSale.value);
  } catch (error) {
    console.error(error);
  }

  await getAllProducts();

  Object.assign(productSale.value, {
    name: "",
    quantity: 0,
    batch: 0,
    salePrice: 0,
  });
};

// Funcion para guardar las imagenes del produto y retornar la url
const getUrlImg = async () => {
  if (productOfCatalog.value.images.length > 0) {
    try {
      // Este array contendrá las URLs de las imágenes cargadas
      const uploadedImageUrls = await Promise.all(
        productOfCatalog.value.images.map((file) => uploadImagesFile(file))
      );

      // Asigna las URLs cargadas al objeto de producto
      productOfCatalog.value.images = uploadedImageUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Error uploading images");
    }
  }
};

const ConfirmSellProduct = (product) => {
  sellDialog.value = true;
  productSale.value = {
    name: product.name,
    batch: product.batch,
    salePrice: product.salePrice,
    productId: product._id,
  };
};

const dialogAddStock = async (product) => {
  productUpdate.value = { ...product };
  addItemStock.value = true;
};

const showFormProductCatalog = (productCatalog) => {
  originalProductOfCatalog.value = { ...productCatalog };
  productOfCatalog.value = { ...productCatalog };
  if (showFormCatalog.value) {
    resetProductCatalog();
  }
  if (productCatalog.isActiveInCatalog) {
    changeStateCatalog();
  } else {
    showFormCatalog.value = !showFormCatalog.value;
  }
};

const createCatalogProduct = async () => {
  try {
    const imageUrls = await getUrlImg();

    const changes = Object.entries(productOfCatalog.value).reduce(
      (acc, [key, value]) => {
        if (
          !originalProductOfCatalog.value[key] ||
          originalProductOfCatalog.value[key] !== value
        ) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    if (imageUrls) {
      changes.images = imageUrls;
    }

    if (Object.keys(changes).length > 0) {
      await updateProduct(productOfCatalog.value._id, changes);
    }
    productOfCatalog.value.isActiveInCatalog =
      !productOfCatalog.value.isActiveInCatalog;
    await updateProduct(productOfCatalog.value._id, productOfCatalog.value);

    showFormCatalog.value = false;
    await getAllProducts();
  } catch (error) {
    console.error("Error creating/updating catalog product:", error);
  }
};

const changeStateCatalog = async () => {
  productOfCatalog.value.isActiveInCatalog =
    !productOfCatalog.value.isActiveInCatalog;
  await updateProduct(productOfCatalog.value._id, productOfCatalog.value);
  await getAllProducts();
};

const resetProductCatalog = () => {
  productOfCatalog.value = { images: [], isActiveInCatalog: false };
};

function addReference() {
  console.log(productOfCatalog.value);
  productOfCatalog.value.references.push({
    name: "",
    options: [{ label: "", value: "" }],
  });
}

function addOptionToReference(referenceIndex) {
  productOfCatalog.value.references[referenceIndex].options.push({
    label: "",
    value: "",
  });
}
</script>
