<template>
  <q-banner v-if="showBanner" dense class="bg-primary text-white">
    <div align="center" style="font-size: 0.8rem;">
      ¡Puedes añadir la tienda como una aplicación en tu teléfono móvil para
      mejorar tu experiencia!  !Sin descargas! 📱
    </div>
    <template v-slot:action>
      <div style="width: 100%" align="center">
        <q-btn
          rounded
          outline
          class="text-capitalize"
          label="Añadir"
          color="white"
          @click="installApp"
        />
        <q-btn
          class="text-capitalize"
          flat
          label="Cerrar"
          color="white"
          @click="showBanner = false"
        />
      </div>
    </template>
  </q-banner>
</template>

<script setup>
import { ref, onMounted } from "vue";

const showBanner = ref(false);
let deferredPrompt = null;

const installApp = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      deferredPrompt = null;
      showBanner.value = false;
    });
  }
};

onMounted(() => {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showBanner.value = true;
  });
});
</script>

<style scoped>
.bg-primary {
  background-color: #027be3;
}
</style>
