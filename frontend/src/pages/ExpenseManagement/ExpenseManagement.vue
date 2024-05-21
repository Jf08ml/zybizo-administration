<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <q-input v-model="expense.description" label="Descripción" outlined />
        <q-input
          v-model.number="expense.amount"
          label="Cantidad"
          type="number"
          outlined
        />
        <q-select
          v-model="expense.type"
          :options="['Order', 'Discount', 'Other']"
          label="Type"
          outlined
        />
      </q-card-section>
      <q-card-actions>
        <q-btn label="Añadir gasto" @click="addExpense" />
      </q-card-actions>
    </q-card>
    <q-separator class="q-my-md" />
    <q-table :rows="expenses" row-key="_id" :columns="columns" virtual-scroll>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { createExpense, getExpenses } from "../../services/expenseService.js"; // Asume que tienes un servicio para gestionar gastos

const expenses = ref([]);

const columns = [
  {
    name: "description",
    label: "Descripción",
    align: "left",
    field: "description",
  },
  { name: "amount", label: "Monto", align: "left", field: "amount" },
  { name: "type", label: "Tipo", align: "left", field: "type" },
  {
    name: "date",
    label: "Fecha",
    align: "left",
    field: (row) => new Date(row.date).toLocaleDateString(),
  },
];

const expense = ref({
  description: "",
  amount: 0,
  type: "Order",
});

onBeforeMount(async () => {
  await getAllExpenses();
});

const addExpense = async () => {
  try {
    await createExpense(expense.value);
    // Reset the expense form
    await getAllExpenses();
    expense.value = { description: "", amount: 0, type: "Order" };
  } catch (error) {
    console.error("Error adding expense:", error);
  }
};

const getAllExpenses = async () => {
  try {
    const response = await getExpenses();
    expenses.value = response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
};
</script>
