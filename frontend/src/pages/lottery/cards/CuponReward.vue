<template>
  <q-card class="flex q-mt-md column">
    <q-card-section class="text-center">
      <div class="text-h6">Lo sentimos!</div>
      <p class="text-justify">
        Como no has ganado ningún premio, te llevas un descuento de $ 5.000 en
        tu próxima compra, <span class="text-weight-bolder">por favor guardalo tomando captura o copiando el codigo de tu cupón</span>.
      </p>
      <q-chip
        outline
        square
        color="red"
        text-color="white"
        icon="bi-ticket-perforated-fill"
        :label="cuponGenerado"
      />
      <q-card-actions align="center">
        <q-btn color="primary" @click="saveCupon"
          >Enviar cupón a Zybizo Bazar</q-btn
        >
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script setup>
const props = defineProps({
  cuponGenerado: String,
});

const emit = defineEmits(["save-cupon", "redirect-to-whatsApp"]);

const saveCupon = () => {
  emit("save-cupon");
};
</script>
