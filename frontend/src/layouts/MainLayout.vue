<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <InstallBanner />
      <q-toolbar class="bg-black text-white">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> {{ fullTitle }}</q-toolbar-title>
        <q-btn
          v-if="!isAuthenticated"
          :size="reSize"
          outline
          class="text-no-wrap"
          label="Iniciar sesión"
          @click="redirectToLogin"
        />
        <q-btn
          v-if="!isAuthenticated"
          :size="reSize"
          outline
          class="q-mx-sm"
          label="Registrarse"
          @click="redirectToRegister"
        />

        <div
          @click="goToPay"
          class="q-pa-xs q-ma-xs rounded-borders shadow-2 icon-container cursor-pointer"
        >
          <span style="text-decoration: underline;">Ver carrito</span>
          <span class="icon-number">{{ itemsCar }}</span>
          <q-icon name="bi-cart3" size="sm" />
        </div>

        <div v-if="isAuthenticated" class="q-pa-xs rounded-borders shadow-2">
          <q-icon
            name="bi-box-arrow-in-left"
            size="sm"
            class="q-px-sm cursor-pointer"
            @click="logout"
          />
          <q-avatar size="md" class="shadow-2 cursor-pointer">
            <img
              src="https://i.ibb.co/r6SG6Fh/avatar.webp"
              alt="avatar-zybizo"
            />
          </q-avatar>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      overlay
      bordered
      :width="250"
      :breakpoint="500"
    >
      <q-list>
        <q-item-label header> Menú </q-item-label>

        <EssentialLink
          v-for="link in filteredLinksList"
          :key="link.title"
          v-bind="link"
          @click="leftDrawerOpen = false"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { useCarStore } from "src/stores/car.js";
import EssentialLink from "components/EssentialLink.vue";
import InstallBanner from "components/InstallBanner.vue";
import { useQuasar } from "quasar";

const $router = useRouter();
const authStore = useAuthStore();
const carStore = useCarStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const $q = useQuasar();

const reSize = computed(() => {
  if ($q.screen.lt.sm) {
    return "xs";
  } else {
    return "md";
  }
});

const itemsCar = computed(() => carStore.itemCount);

const leftDrawerOpen = ref(false);

const goToPay = () => {
  $router.push({
    name: "PaymentPage",
    query: { type: "car", time: Date.now() },
  });
};

const redirectToLogin = () => {
  $router.push({ name: "Login" });
};

const redirectToRegister = () => {
  $router.push({ name: "Register" });
};

const linksList = [
  {
    title: "Inicio",
    caption: "",
    icon: "bi-house",
    link: "/home",
  },
  {
    title: "Catálogo",
    caption: "",
    icon: "bi-cart-check",
    link: "/catalogozybizo",
  },
  {
    title: "Sorteo de descuentos",
    caption: "",
    icon: "bi-gift-fill",
    link: "/sorteozybizo",
  },
  {
    title: "Stock de productos",
    caption: "",
    icon: "bi-card-checklist",
    link: "/products",
    role: "Administrator",
  },
  {
    title: "Análisis financiero",
    caption: "",
    icon: "bi-graph-up",
    link: "/financial",
    role: "Administrator",
  },
  {
    title: "Ventas",
    caption: "",
    icon: "bi-cash-stack",
    link: "/sales",
    role: "Administrator",
  },
  {
    title: "Gastos",
    caption: "",
    icon: "bi-credit-card",
    link: "/expense",
    role: "Administrator",
  },
  {
    title: "Facebook",
    caption: "/zybizo.bazar",
    icon: "bi-facebook",
    link: "https://www.facebook.com/zybizo.bazar",
  },
  {
    title: "Instagram",
    caption: "@zybizobazar",
    icon: "bi-instagram",
    link: "https://www.instagram.com/zybizobazar",
  },
  {
    title: "Whatsapp",
    caption: "@ZybizoBazar",
    icon: "bi-whatsapp",
    link: "https://wa.me/message/LRMCRWYN6JRNO1",
  },
  {
    title: "Zybizo page",
    caption: "Page official",
    icon: "bi-globe-americas",
    link: "https://www.zybizobazar.com/catalogozybizo",
  },
];

const filteredLinksList = computed(() => {
  return linksList.filter((link) => {
    if (link.title === "Iniciar sesión" && isAuthenticated.value) {
      return false;
    }
    if (link.role && link.role !== authStore.userRole) {
      return false;
    }
    return true;
  });
});

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const logout = () => {
  authStore.logout();
  $router.push({ name: "Home" });
};

const fullTitle = computed(() => {
  const matchedLink = linksList.find(
    (link) => link.link === $router.currentRoute.value.path
  );
  const subTitle = matchedLink ? matchedLink.title : "";
  return `${subTitle}`;
});
</script>

<style scoped>
.icon-container {
  position: relative;
  display: inline-block;
}

.icon-number {
  position: absolute;
  top: 28px;
  right: 32px;
  background-color: red;
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  z-index: 1;
}
</style>
