<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <q-expansion-item label="Add Product" icon="add" default-closed>
        <q-card>
          <q-card-section>
            <q-input
              outlined
              v-model="product.name"
              label="Name"
              class="q-mb-md"
            />
            <q-input
              outlined
              v-model="product.quantity"
              type="number"
              label="Quantity"
              class="q-mb-md"
            />
            <q-input
              outlined
              v-model="product.batch"
              type="number"
              label="Batch"
              class="q-mb-md"
            />
            <q-input
              outlined
              v-model="product.basePrice"
              type="number"
              label="Base price"
              class="q-mb-md"
            />
            <q-input
              outlined
              v-model="product.salePrice"
              type="number"
              label="Sale price"
              class="q-mb-md"
            />
          </q-card-section>
          <q-card-actions vertical align="center">
            <q-btn
              size="md"
              style="width: 100px"
              label="Add"
              @click="addProduct"
              :loading="loadingAdd"
            />
          </q-card-actions>
        </q-card>
        <q-separator />
      </q-expansion-item>
      <q-separator />
    </div>

    <!-- Visualización de productos en tarjetas -->
    <div v-if="loadingProducts" align="center">
      <q-spinner-puff color="primary" size="5em" />
    </div>
    <div class="q-gutter-md row flex-center">
      <q-card v-for="item in products" :key="item.id" style="width: 300px">
        <q-card-section>
          <div class="text-h6">
            {{ item.name }}
            <q-icon v-if="item.stock > 0" color="green" name="check_circle" />
            <q-icon v-else color="red" name="new_releases" />
          </div>
          <q-separator />
          <div class="text-caption">Quantity: {{ item.quantity }}</div>
          <div class="text-caption">Sold: {{ item.quantitiesSold }}</div>
          <div class="text-caption text-weight-bold">
            Stock: {{ item.stock }}
          </div>
          <div class="text-caption">Batch: {{ item.batch }}</div>
          <q-separator />
          <div class="text-caption">
            Base price: {{ formatPrice(item.basePrice) }}
          </div>
          <div class="text-caption text-weight-bold">
            Price sale: {{ formatPrice(item.salePrice) }}
          </div>
          <q-separator />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            @click="ConfirmSellProduct(item)"
            label="Sell"
            :loading="loadingSell"
            :disabled="item.stock == 0"
          />
          <q-btn
            v-if="item.quantitiesSold == 0"
            @click="deleteItem(item)"
            label="Delete"
          />
          <q-btn
            v-if="item.stock == 0"
            @click="dialogAddStock(item)"
            label="Add stock"
          />
        </q-card-actions>
      </q-card>
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
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { formatPrice } from "../../utils/utilsFunctions.js";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../../services/productService.js";
import { createProductSale } from "../../services/productSaleService.js";

const product = ref({
  name: "",
  quantity: 0,
  batch: 0,
  basePrice: 0,
  salePrice: 0,
});

const productSale = ref({
  name: "",
  quantity: 0,
  batch: 0,
  salePrice: 0,
  productId: null,
});

const productUpdate = ref({});

const products = ref([]);

const loadingAdd = ref(false);
const loadingSell = ref(false);
const sellDialog = ref(false);
const loadingProducts = ref(false);
const addItemStock = ref(false);

onBeforeMount(async () => {
  await getAllProducts();
});

const addProduct = async () => {
  loadingAdd.value = true;
  try {
    await createProduct(product.value);
  } catch (error) {
    console.error(error);
  }

  await getAllProducts();

  Object.assign(product.value, {
    name: "",
    quantity: 0,
    batch: 0,
    basePrice: 0,
    salePrice: 0,
  });
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
  loadingSell.value = true;
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
  loadingSell.value = false;
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

const getAllProducts = async () => {
  try {
    loadingProducts.value = true;
    const response = await getProducts();
    products.value = response.products;
  } catch (error) {
    console.error(error);
  } finally {
    loadingProducts.value = false;
  }
};
</script>
