<template>
  <router-view />
  <SpeedInsights />
  <loading />
  
  <q-fab
    color="pink"
    text-color="white"
    icon="chat"
    direction="left"
    class="fixed-bottom-right q-ma-md"
    v-if="showButtonAction()"
  >
    <q-btn
      round
      @click="redirectToWhatsApp"
      class="q-ma-md social-button"
      style="background: #25d366; color: white"
    >
      <q-icon name="bi-whatsapp" size="xl"></q-icon>
    </q-btn>
    <q-btn
      round
      @click="redirectToInstagram"
      class="q-ma-md social-button"
      style="background: #e1306c; color: white"
    >
      <q-icon name="bi-instagram" size="xl"></q-icon>
    </q-btn>
    <q-btn
      round
      @click="redirectToFacebook"
      class="q-ma-md social-button"
      style="background: #3b5998; color: white"
    >
      <q-icon name="bi-facebook" size="xl"></q-icon>
    </q-btn>
  </q-fab>
</template>

<script setup>
import { onMounted } from "vue";
import { SpeedInsights } from "@vercel/speed-insights/vue";
import { inject } from "@vercel/analytics";
import Loading from "./components/LoadingView.vue";
import EventBus from "./utils/eventBus";
import { useAuthStore } from "./stores/auth.js";
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();

inject();

onMounted(() => {
  EventBus.on("logout", () => {
    authStore.logout();
  });
});

const showButtonAction = () => {
  if (route.path != '/payment' && route.path != '/ordersend') {
    return true;
  } else {
    return false;
  }
}


const redirectToWhatsApp = () => {
  window.open("https://wa.me/message/LRMCRWYN6JRNO1", "_blank");
};

const redirectToInstagram = () => {
  window.open("https://www.facebook.com/zybizo.bazar", "_blank");
};

const redirectToFacebook = () => {
  window.open("https://www.facebook.com/zybizo", "_blank");
};
</script>
