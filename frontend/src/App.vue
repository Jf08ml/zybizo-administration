<template>
  <router-view />
  <SpeedInsights />
  <loading />

  <q-fab
    v-model="fabActions"
    color="green"
    text-color="white"
    icon="bi-whatsapp"
    direction="up"
    class="fixed-bottom-right q-ma-md"
    v-if="hiddenButtonsActions()"
  >
    <q-fab-action
      round
      @click="redirectToWhatsApp"
      class="q-ma-md bg-green text-white social-button"
    >
      <q-icon name="bi-whatsapp" size="md"></q-icon>
    </q-fab-action>
    <q-fab-action
      round
      @click="redirectToInstagram"
      class="q-ma-md bg-pink text-white social-button"
    >
      <q-icon name="bi-instagram" size="md"></q-icon>
    </q-fab-action>
    <q-fab-action
      round
      @click="redirectToFacebook"
      class="q-ma-md bg-blue-10 text-white social-button"
    >
      <q-icon name="bi-facebook" size="md"></q-icon>
    </q-fab-action>
    <q-fab-action
      round
      @click="redirectToSorteo"
      class="q-ma-md bg-blue text-white social-button"
      label-class="bg-grey-3 text-grey-8"
      external-label
      label-position="left"
      label="¡Ganate un kit de insumos!"
    >
      <q-icon name="bi-gift" size="md"></q-icon>
    </q-fab-action>
  </q-fab>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { SpeedInsights } from "@vercel/speed-insights/vue";
import { inject } from "@vercel/analytics";
import Loading from "./components/LoadingView.vue";
import EventBus from "./utils/eventBus";
import { useAuthStore } from "./stores/auth.js";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

inject();

const fabActions = ref(true);

onMounted(() => {
  EventBus.on("logout", () => {
    authStore.logout();
  });
});

const hiddenButtonsActions = () => {
  if (route.path != "/payment" && route.path != "/ordersend") {
    return true;
  } else {
    return false;
  }
};

const redirectToWhatsApp = () => {
  window.open("https://wa.me/message/LRMCRWYN6JRNO1", "_blank");
};

const redirectToInstagram = () => {
  window.open("https://www.instagram.com/zybizobazar", "_blank");
};

const redirectToFacebook = () => {
  window.open("https://www.facebook.com/zybizo.bazar", "_blank");
};

const redirectToSorteo = () => {
  router.push("/sorteozybizo");
};
</script>
