<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <q-expansion-item label="Add Product" icon="add" default-closed>
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
        @create-catalog-product="createCatalogProduct"
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
      <q-dialog v-model="changeStateItem">
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">
              Add information
              <span class="text-positive">{{ productUpdate.name }}</span>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              dense
              v-model="productOfCatalog.NamePublic"
              label="Nombre al publico"
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
import AddNewProduct from "./Forms/AddNewProduct.vue";
import ProductCard from "./Cards/ProductCard.vue";

const productSale = ref({
  name: "",
  quantity: 0,
  batch: 0,
  salePrice: 0,
  productId: null,
});

const productUpdate = ref({});

const productOfCatalog = ref({
  NamePublic: "",
});

const products = ref([]);

const loadingAdd = ref(false);
const sellDialog = ref(false);
const addItemStock = ref(false);
const changeStateItem = ref(false);

onBeforeMount(async () => {
  await getAllProducts();
});

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

const ConfirmSellProduct = (product) => {
  sellDialog.value = true;
  productSale.value = {
    name: product.name,
    batch: product.batch,
    salePrice: product.salePrice,
    productId: product._id,
  };
};

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

const deleteItem = async (product) => {
  await deleteProduct(product._id);
  await getAllProducts();
};

const dialogAddStock = async (product) => {
  productUpdate.value = { ...product };
  addItemStock.value = true;
};

const sendUpdateProduct = async () => {
  await updateProduct(productUpdate.value._id, productUpdate.value);
  await getAllProducts();
};

const createCatalogProduct = async (productCatalog) => {
  productUpdate.value = { ...productCatalog };
  productUpdate.value.isActiveInCatalog =
    !productUpdate.value.isActiveInCatalog;
  await updateProduct(productUpdate.value._id, productUpdate.value);
  await getAllProducts();
};

const getAllProducts = async () => {
  try {
    const response = await getProducts();
    products.value = response.products;
  } catch (error) {
    console.error(error);
  }
};
</script>
