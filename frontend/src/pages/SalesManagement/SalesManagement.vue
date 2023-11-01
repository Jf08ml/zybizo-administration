<template>
  <q-page class="q-pa-md">
    <q-table
      :rows="sales"
      row-key="_id"
      :columns="columns"
      virtual-scroll
      v-model:pagination="pagination"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            @click="openReturnDialog(props.row)"
            icon="undo"
            label="Marcar como devolución"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Diálogo para marcar como devolución -->
    <q-dialog v-model="returnDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Marcar Venta como Devolución</div>
          <q-select
            v-model="returnReason"
            :options="returnReasons"
            label="Motivo de Devolución"
            outlined
          />
          <q-select
            v-if="returnReason === 'Product exchange'"
            v-model="exchangeProduct"
            :options="productsList"
            label="Producto para Intercambio"
            outlined
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Confirmar" @click="markAsReturn" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { getProducts } from "src/services/productService";
import {
  getProductsSale,
  handleReturn,
} from "../../services/productSaleService.js";

const sales = ref([]);
const returnDialog = ref(false);
const returnReason = ref("");
const selectedSale = ref(null);
const exchangeProduct = ref(null);
const productsList = ref([]);
const returnReasons = ["Product exchange", "Defective product"];
const columns = [
  { name: "name", label: "Producto", align: "left", field: "name" },
  { name: "quantity", label: "Cantidad", align: "left", field: "quantity" },
  {
    name: "salePrice",
    label: "Precio de Venta",
    align: "left",
    field: "salePrice",
  },
  { name: "status", label: "Estado", align: "left", field: "status" },
  { name: "actions", label: "Acciones", align: "left", field: "actions" },
];
const pagination = ref({
  rowsPerPage: 0,
});

// Obtener todas las ventas al montar el componente
onBeforeMount(async () => {
  await getSaleProducts();

  await listProducts();
});

const openReturnDialog = (sale) => {
  selectedSale.value = sale;
  returnDialog.value = true;
};

const getSaleProducts = async () => {
  try {
    const response = await getProductsSale();
    sales.value = response.products;
  } catch (error) {
    console.error("Error fetching sales data:", error);
  }
};

const listProducts = async () => {
  try {
    const response = await getProducts();
    productsList.value = response.products.map((product) => ({
      label: product.name, // Asumiendo que cada producto tiene una propiedad 'name'
      value: product._id, // y una propiedad '_id'
    }));
  } catch (error) {
    console.error("Error listing products:", error);
  }
};

const markAsReturn = async () => {
  if (returnReason.value) {
    try {
      const exchangeProductId =
        returnReason.value === "Product exchange"
          ? exchangeProduct.value.value
          : null;
      await handleReturn(
        selectedSale.value._id,
        "Refund",
        returnReason.value,
        exchangeProductId
      );
      await getSaleProducts();
      returnDialog.value = false;
    } catch (error) {
      console.error("Error updating sale status:", error);
    }
  }
};
</script>
