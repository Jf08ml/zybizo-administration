<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <q-btn
        label="Añadir producto"
        icon="add"
        @click="showAddProductDialog = true"
      />
    </div>
    <q-separator class="q-mb-md" />

    <!-- Visualización de productos en tarjetas -->
    <div class="q-gutter-md row flex-center">
      <ProductCard
        v-for="item in products"
        :key="item.id"
        :product="item"
        @sell-product="confirmSellProduct"
        @delete-product="deleteItem"
        @add-stock="dialogAddStock"
        @create-catalog-product="toggleProductCatalog"
      />
    </div>

    <!-- Diálogo para añadir producto -->
    <q-dialog v-model="showAddProductDialog">
      <q-card style="width: 700px; max-width: 100vw">
        <div class="flex justify-end">
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <AddNewProductStepper
          :loadingAdd="loadingAdd"
          @add-product="addProduct"
        />
      </q-card>
    </q-dialog>

    <!-- Dialog para marcar venta -->
    <SaleDialog
      :showSellDialog="sellDialog"
      :productSale="productSale"
      @update:showSellDialog="sellDialog = $event"
      @confirmSale="saleProduct"
    />

    <q-dialog v-model="addItemStock" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">
            Añadir existencias
            <span class="text-positive">{{ productUpdate.name }}</span>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="productUpdate.stock"
            label="Existencias"
            autofocus
            @keyup.enter="prompt = false"
          />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            flat
            label="Confirmar"
            v-close-popup
            @click="sendUpdateProduct"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
import { uploadImagesFile } from "../../services/uploadImages";
import SaleDialog from "./dialogs/SaleDialog.vue";
import ProductCard from "./Cards/ProductCard.vue";
import AddNewProductStepper from "./forms/AddNewProductStepper.vue";

const productSale = ref({
  name: "",
  quantity: 0,
  batch: 0,
  salePrice: 0,
  productId: null,
  references: [],
  option: null,
});

const productUpdate = ref({});
const products = ref([]);
const loadingAdd = ref(false);
const sellDialog = ref(false);
const addItemStock = ref(false);
const showAddProductDialog = ref(false);

onBeforeMount(async () => {
  await getAllProducts();
});

const getAllProducts = async () => {
  try {
    const response = await getProducts();
    products.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const addProduct = async (product) => {
  loadingAdd.value = true;
  try {
    const imageUrls = await getUrlImg(product);
    if (imageUrls) {
      product.images = imageUrls;
    }
    await createProduct(product);
    showAddProductDialog.value = false;
    await getAllProducts();
  } catch (error) {
    console.error(error);
  }
  loadingAdd.value = false;
};

const getUrlImg = async (product) => {
  if (product.images.length > 0) {
    try {
      const uploadedImageUrls = await Promise.all(
        product.images.map((file) => uploadImagesFile(file))
      );
      return uploadedImageUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Error uploading images");
    }
  }
  return [];
};

const confirmSellProduct = (product) => {
  sellDialog.value = true;
  productSale.value = {
    name: product.name,
    batch: product.batch,
    salePrice: product.salePrice,
    references: product.references,
    option: product.references[0]?.options[0],
    productId: product._id,
  };
};

const dialogAddStock = async (product) => {
  productUpdate.value = { ...product };
  addItemStock.value = true;
};

const deleteItem = async (product) => {
  await deleteProduct(product._id);
  await getAllProducts();
};

const saleProduct = async (saleData) => {
  try {
    await createProductSale(saleData);
    await getAllProducts();
    Object.assign(productSale.value, {
      name: "",
      quantity: 0,
      batch: 0,
      salePrice: 0,
      references: [],
      option: null,
    });
  } catch (error) {
    console.error(error);
  }
};

const toggleProductCatalog = async (productCatalog) => {
  productCatalog.isActiveInCatalog = !productCatalog.isActiveInCatalog;
  await updateProduct(productCatalog._id, productCatalog);
  await getAllProducts();
};
</script>
