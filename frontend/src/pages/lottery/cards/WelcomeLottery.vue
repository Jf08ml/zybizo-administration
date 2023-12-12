<template>
  <q-card class="my-card q-pa-md">
    <q-card-section class="bg-light text-dark" align="center">
      <div class="text-h4 text-center text-primary q-pb-md">
        ¡Bienvenido al sorteo de ofertas y artículos!
      </div>
      <q-separator />
      <div class="text-h6 text-center">
        <p class="q-pt-md">
          Premio mayor: <span class="text-green">GM2 Pro</span>
        </p>
        <q-img
          alt="Zybizo Bazar"
          src="~assets/imgs/img-sorteo.jpg"
          class="img-sorteo"
        />
      </div>
      <p class="text-body1 text-justify q-mt-md">
        <span class="text-red text-weight-bolder">Nota: </span>Síguenos en
        nuestras redes sociales para poder recibir tus recompensas.
      </p>
      <q-separator />
    </q-card-section>

    <q-card-actions class="column">
      <span class="text-body1 text-justify q-mb-sm">¿Quieres participar?</span>
      <q-btn
        rounded
        color="light-blue"
        label="¡Haz clic aquí!"
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

<style scoped>
.img-sorteo {
  box-shadow: 0 0 5px gold;
  width: 60%;
}

@media (max-width: 768px) {
  .img-sorteo {
    max-width: 100%;
  }
}

@media (max-width: 450px) {
  .img-sorteo {
    width: 100%;
  }
}
</style>
