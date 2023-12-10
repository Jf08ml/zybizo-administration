<template>
  <q-card class="my-card q-pa-md">
    <q-card-section class="bg-light text-dark" align="center">
      <div class="text-h4 text-center text-primary q-pb-md">
        ¡Bienvenido al sorteo de ofertas y artículos!
      </div>
      <q-separator />
      <div class="text-h6 text-center">
        <p class="q-pt-md">Premio mayor: <a class="text-green">GM2 Pro</a> </p>
        <q-img alt="Zybizo Bazar" src="~assets/imgs/img-sorteo.jpg" style="box-shadow: 0 0 5px gold; width: 400px"/>
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
