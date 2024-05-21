<template>
  <q-dialog v-model="showSellDialog" persistent>
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
        <q-btn flat label="Cerrar" @click="closeDialog" />
        <q-btn flat label="Confirmar" @click="handleConfirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";

const productSale = ref({
  name: "",
  quantity: 0,
  batch: 0,
  salePrice: 0,
  productId: null,
});

defineEmits(["update:showSellDialog", "confirmSale"]);

defineProps({
  showSellDialog: Boolean,
});

const closeDialog = () => {
  emit("update:showSellDialog", false);
};

const handleConfirm = () => {
  emit("confirmSale", productSale.value);
  closeDialog();
};
</script>
