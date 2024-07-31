<template>
  <q-dialog v-model="internalShowSellDialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">
          Confirmar venta
          <span class="text-positive">{{ localProductSale.name }}</span>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          dense
          required
          type="number"
          v-model="localProductSale.quantity"
          label="Cantidad"
          autofocus
        />
        <q-input
          dense
          v-model="formattedSalePrice"
          label="Precio"
          @blur="updateSalePrice"
          @focus="removeFormatting"
        />

        <div
          v-for="(reference, index) in localProductSale.references"
          :key="index"
        >
          <q-select
            v-model="selectedReferences[index]"
            :options="
              reference.options.map((option) => ({
                label: option.label,
                value: option.value,
              }))
            "
            :label="reference.name"
            option-label="label"
            option-value="value"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cerrar" @click="closeDialog" />
        <q-btn flat label="Confirmar" @click="handleConfirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { formatPrice } from "src/utils/utilsFunctions";

const props = defineProps({
  showSellDialog: Boolean,
  productSale: Object,
});

const emit = defineEmits(["update:showSellDialog", "confirmSale"]);

const localProductSale = ref({ ...props.productSale });
const selectedReferences = ref([]);

watch(
  () => props.productSale,
  (newProductSale) => {
    localProductSale.value = { ...newProductSale };
    selectedReferences.value = newProductSale.references.map(
      (ref) => ref.options[0]?.value
    );
    formattedSalePrice.value = formatPrice(localProductSale.value.salePrice);
  },
  { deep: true }
);

const internalShowSellDialog = computed({
  get() {
    return props.showSellDialog;
  },
  set(value) {
    emit("update:showSellDialog", value);
  },
});

const closeDialog = () => {
  internalShowSellDialog.value = false;
};

const handleConfirm = () => {
  if(localProductSale.value.quantity === undefined) {
    alert("Añada cantidades vendidas")
    return;
  }
  const selectedRefs = localProductSale.value.references.map((ref, index) => ({
    reference: ref.name,
    option: ref.options.find(
      (opt) =>
        opt.value === selectedReferences.value[index].value ||
        opt.value === selectedReferences.value[index]
    )?.value,
  }));

  emit("confirmSale", {
    ...localProductSale.value,
    selectedReferences: selectedRefs,
  });
  closeDialog();
};

// Formatear el precio visualmente
const removeFormatting = () => {
  formattedSalePrice.value = localProductSale.value.salePrice.toString();
};

const updateSalePrice = () => {
  const parsedValue = parseFloat(formattedSalePrice.value.replace(/[^\d.-]/g, ""));
  localProductSale.value.salePrice = isNaN(parsedValue) ? 0 : parsedValue;
  formattedSalePrice.value = formatPrice(localProductSale.value.salePrice);
};

// Computed para el precio formateado
const formattedSalePrice = ref(formatPrice(localProductSale.value.salePrice));

watch(
  () => localProductSale.value.salePrice,
  (newValue) => {
    formattedSalePrice.value = formatPrice(newValue);
  }
);
</script>
