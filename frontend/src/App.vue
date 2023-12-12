<template>
  <router-view />
  <SpeedInsights />
  <loading />
</template>

<script setup>
import { onMounted } from "vue";
import { SpeedInsights } from '@vercel/speed-insights/vue';
import Loading from "./components/LoadingView.vue";
import EventBus from "./utils/eventBus";
import { useAuthStore } from "./stores/auth.js";

const authStore = useAuthStore();

onMounted(() => {
  EventBus.on("logout", () => {
    authStore.logout();
  });
});
</script>
