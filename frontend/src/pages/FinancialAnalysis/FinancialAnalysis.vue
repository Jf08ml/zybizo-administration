<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Resume</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-gutter-md">
            <div class="col-4">
              <div class="text-h6">{{ formatPrice(totalInvestment) }}</div>
              <div class="text-caption text-primary">Total inversion</div>
            </div>
            <div class="col-4">
              <div class="text-h6">{{ formatPrice(expectedProfit) }}</div>
              <div class="text-caption text-primary">Ganancia esperada</div>
            </div>
            <div class="col-4">
              <div class="text-h6">{{ formatPrice(actualSalesIncome) }}</div>
              <div class="text-caption text-primary">
                Total de ventas
              </div>
            </div>
            <div class="col-4">
              <div class="text-h6">{{ formatPrice(totalRefunds) }}</div>
              <div class="text-caption text-primary">Total reembolsos</div>
            </div>
            <div class="col-4">
              <div class="text-h6">{{ formatPrice(totalExchanges) }}</div>
              <div class="text-caption text-primary">Total cambios</div>
            </div>
            <div class="col-4">
              <div class="text-h6">{{ formatPrice(grossProfit) }}</div>
              <div class="text-caption text-primary">
                Ganancia
              </div>
            </div>
            <div class="col-4">
              <div class="text-h6">{{ formatPrice(cashOnHand) }}</div>
              <div class="text-caption text-primary">
                Saldo en efectivo
              </div>
            </div>
            <div class="col-4">
              <div class="text-h6">{{ formatPrice(totalExpenses) }}</div>
              <div class="text-caption text-primary">Gastos</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Aquí puedes agregar más detalles o gráficos si lo deseas -->
    </div>
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { formatPrice } from "../../utils/utilsFunctions.js";
import { getProducts } from "../../services/productService.js";
import { getProductsSale } from "../../services/productSaleService.js";
import { getExpenses } from "../../services/expenseService.js";

const totalInvestment = ref(0);
const expectedProfit = ref(0);
const actualSalesIncome = ref(0);
const totalRefunds = ref(0); // Almacenará el total de las devoluciones
const totalExchanges = ref(0); // Almacenará el total de los intercambios
const grossProfit = ref(0); // Ganancia hasta el momento
const cashOnHand = ref(0); // Saldo en efectivo que debería tener
const totalExpenses = ref(0);

onBeforeMount(async () => {
  try {
    const productsResponse = await getProducts();
    const productsData = productsResponse.products;

    const salesResponse = await getProductsSale();
    const salesData = salesResponse.products;

    const expensesResponse = await getExpenses();
    const expensesData = expensesResponse;

    expensesData.forEach((expense) => {
      totalExpenses.value += expense.amount;
    });

    productsData.forEach((product) => {
      totalInvestment.value += product.basePrice * product.quantity;
      expectedProfit.value += product.salePrice * product.quantity;
    });

    salesData.forEach((sale) => {
      if (
        sale.status === "Refund" &&
        sale.returnReason === "Product exchange"
      ) {
        // No afecta al ingreso de ventas ni a las devoluciones
        totalExchanges.value += sale.salePrice * sale.quantity; // Suponiendo que 'refundAmount' es en realidad el precio de venta del producto intercambiado
      } else if (sale.status === "Refund") {
        totalRefunds.value += sale.salePrice * sale.quantity;
      } else {
        actualSalesIncome.value += sale.salePrice * sale.quantity;
      }
    });
    
    cashOnHand.value = actualSalesIncome.value - totalExpenses.value; // Resta los gastos al saldo en efectivo que deberías tener
    grossProfit.value = actualSalesIncome.value - totalInvestment.value;

    // Ajustar el ingreso de ventas actuales
    actualSalesIncome.value =
      actualSalesIncome.value - totalRefunds.value + totalExchanges.value;
  } catch (error) {
    console.error("Error fetching financial data:", error);
  }
});
</script>

<style scoped>
/* Aquí puedes añadir estilos adicionales si lo necesitas */
</style>
