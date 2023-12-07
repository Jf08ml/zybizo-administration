<template>
  <q-card class="my-card q-pa-md">
    <q-card-section class="bg-light text-dark">
      <div class="text-h4 text-center text-primary">
        Bienvenido al sorteo de ofertas y artículos
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="center">
      <q-btn
        unelevated
        rounded
        color="light-blue"
        label="¡Quiero participar!"
        @click="changeWelcomeCard"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
const props = defineProps({
  winningSymbol: String,
});

const emit = defineEmits(["change-welcome-card"]);

const changeWelcomeCard = () => {
  emit("change-welcome-card", false);
};
</script>
