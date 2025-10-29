<template>
  <q-card class="my-card q-pa-sm full-width" style="margin: auto;">
    <q-card-section class="bg-light text-dark" align="center">
      <div class="text-h5 text-center text-pink q-pb-md">
        ¡Bienvenido al sorteo de ofertas y artículos!
      </div>
      <q-separator />
      <div class="text-h6 text-center">
        <p class="q-pt-md">
          Premio mayor: <span class="text-primary">Kit de insumos.</span>
        </p>
        <q-img
          alt="Galaxia Glamour Store"
          src="https://ik.imagekit.io/6cx9tc1kx/Productos/1.webp?updatedAt=1726326925710"
          class="img-lottery shadow-23 q-ma-md"
        />
      </div>
      <p class="text-body1 text-center q-mt-md">
        <span class="text-red text-weight-bolder">Nota: </span>Síguenos en
        nuestras redes sociales para poder recibir tus recompensas.
      </p>
      <q-separator />
    </q-card-section>

    <q-card-actions class="column">
      <span class="text-body1 text-justify q-mb-sm">¿Quieres participar?</span>
      <q-btn
        rounded
        color="pink"
        size="md"
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
.img-lottery {
  width: 80%;
}

/* Estilos para tablets y pantallas medianas */
@media (min-width: 600px) {
  .img-lottery {
    width: 80%;
  }
}

/* Estilos para pantallas grandes y desktop */
@media (min-width: 1024px) {
  .img-lottery {
    width: 40%;
  }
}
</style>
