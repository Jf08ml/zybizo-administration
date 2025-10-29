<template>
  <router-view />
  <SpeedInsights />
  <loading />

  <!-- Floating Action Button para redes sociales -->
  <q-fab
    v-model="fabActions"
    color="black"
    text-color="white"
    icon="bi-whatsapp"
    direction="up"
    class="fixed-bottom-right q-ma-md fab-main"
    v-if="shouldShowFab"
    :class="{ 'fab-hidden': !shouldShowFab }"
  >
    <q-fab-action
      round
      @click="redirectToWhatsApp"
      class="q-ma-sm fab-whatsapp"
      color="green"
    >
      <q-icon name="bi-whatsapp" size="md" />
      <q-tooltip
        class="bg-green text-white"
        anchor="center left"
        self="center right"
      >
        Contáctanos por WhatsApp
      </q-tooltip>
    </q-fab-action>

    <q-fab-action
      round
      @click="redirectToInstagram"
      class="q-ma-sm fab-instagram"
      color="purple"
    >
      <q-icon name="bi-instagram" size="md" />
      <q-tooltip
        class="bg-purple text-white"
        anchor="center left"
        self="center right"
      >
        Síguenos en Instagram
      </q-tooltip>
    </q-fab-action>

    <q-fab-action
      round
      @click="redirectToSorteo"
      class="q-ma-sm fab-sorteo"
      color="orange"
      label-class="fab-label"
      external-label
      label-position="left"
      label="¡Participa en el sorteo!"
    >
      <q-icon name="bi-gift-fill" size="md" />
      <q-tooltip
        class="bg-orange text-white"
        anchor="top middle"
        self="bottom middle"
      >
        Participa en nuestro sorteo
      </q-tooltip>
    </q-fab-action>
  </q-fab>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { SpeedInsights } from "@vercel/speed-insights/vue";
import { inject } from "@vercel/analytics";
import Loading from "./components/LoadingView.vue";
import EventBus from "./utils/eventBus";
import { useAuthStore } from "./stores/auth.js";
import { useRoute, useRouter } from "vue-router";

// Importación de estilos de iconos
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/mdi-v7/mdi-v7.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Stores y routing
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Inicializar analytics
inject();

// Estado reactivo
const fabActions = ref(false);

// Computed properties
const shouldShowFab = computed(() => {
  const hiddenRoutes = ['/payment', '/ordersend', '/login', '/register'];
  return !hiddenRoutes.includes(route.path);
});

// URLs actualizadas para Galaxia Glamour
const socialLinks = {
  whatsapp: "https://wa.me/573000000000?text=Hola,%20quiero%20información%20sobre%20Galaxia%20Glamour%20Lashes",
  instagram: "https://www.instagram.com/galaxia.glamourr",
};

// Lifecycle hooks
onMounted(() => {
  EventBus.on("logout", handleLogout);
});

onUnmounted(() => {
  EventBus.off("logout", handleLogout);
});

// Métodos
const handleLogout = () => {
  authStore.logout();
  router.push('/home');
};

const redirectToWhatsApp = () => {
  window.open(socialLinks.whatsapp, "_blank", "noopener,noreferrer");
};

const redirectToInstagram = () => {
  window.open(socialLinks.instagram, "_blank", "noopener,noreferrer");
};

const redirectToSorteo = () => {
  router.push("/sorteozybizo");
  fabActions.value = false; // Cerrar FAB después de navegación
};
</script>

<style scoped>
/* Floating Action Button Styles */
.fab-main {
  z-index: 9999;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fab-main:hover {
  transform: scale(1.05);
}

.fab-hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(100px);
}

/* FAB Actions Styling */
.fab-whatsapp {
  transition: all 0.3s ease;
}

.fab-whatsapp:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
}

.fab-instagram {
  transition: all 0.3s ease;
}

.fab-instagram:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(156, 39, 176, 0.4);
}

.fab-facebook {
  transition: all 0.3s ease;
}

.fab-facebook:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.4);
}

.fab-sorteo {
  transition: all 0.3s ease;
}

.fab-sorteo:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(255, 152, 0, 0.4);
}

/* Label styling */
.fab-label {
  background: rgba(0, 0, 0, 0.8) !important;
  color: white !important;
  border-radius: 16px !important;
  padding: 8px 12px !important;
  font-weight: 500 !important;
  font-size: 12px !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .fab-main {
    transform: scale(0.9);
  }

  .fab-label {
    font-size: 11px !important;
    padding: 6px 10px !important;
  }
}

/* Animation for FAB appearance */
@keyframes fabSlideIn {
  from {
    opacity: 0;
    transform: translateY(100px) scale(0.3);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.fab-main {
  animation: fabSlideIn 0.5s ease-out;
}

/* Accessibility improvements */
.fab-main:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}

/* Loading component improvements */
:deep(.loading-overlay) {
  backdrop-filter: blur(4px);
  background: rgba(0, 0, 0, 0.3);
}
</style>
