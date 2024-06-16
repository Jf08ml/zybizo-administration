<template>
  <q-banner
    v-if="isInstallPromptAvailable"
    class="bg-primary text-white"
    inline-actions
  >
    <template v-slot:avatar>
      <q-icon name="add" />
    </template>
    <div>
      ¡Añade esta aplicación a tu pantalla de inicio para una mejor experiencia!
    </div>
    <template v-slot:action>
      <q-btn flat label="Añadir" color="white" @click="installApp" />
    </template>
  </q-banner>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isInstallPromptAvailable = ref(false);

onMounted(() => {
  isInstallPromptAvailable.value = window.$isInstallPromptAvailable;
});

const installApp = () => {
  window.$showInstallPromotion();
};
</script>

<style scoped>
.bg-primary {
  background-color: #027be3;
}
</style>
