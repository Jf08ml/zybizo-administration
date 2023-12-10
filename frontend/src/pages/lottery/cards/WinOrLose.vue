<template>
  <q-card style="width: 300px">
    <q-card-section class="text-center">
      <span
        class="text-red text-body1"
        v-if="winningSymbol === '¡Buena suerte la proxima vez!'"
        >Lo sentimos, {{ winningSymbol }}</span
      >
      <span class="text-green text-body1" v-else
        >¡Felicidades! Has ganado: {{ winningSymbol }}</span
      >
    </q-card-section>
    <q-separator />
    <q-card-actions align="right">
      <q-btn
        color="primary"
        label="Añadir a premios"
        v-close-popup
        @click="añadirPremio()"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
const props = defineProps({
  winningSymbol: String,
});

const emit = defineEmits(["añadir-premio"]);

const añadirPremio = () => {
  emit("añadir-premio");
};
</script>
