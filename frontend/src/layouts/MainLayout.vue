<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
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
          outline
          class="text-no-wrapq-mx-sm"
          label="Iniciar sesión"
          @click="redirectToLogin"
        />
        <q-btn
          v-if="!isAuthenticated"
          outline
          class="q-mx-sm"
          label="Registrarse"
          @click="redirectToRegister"
        />

        <div v-if="isAuthenticated" class="q-pa-xs q-ma-xs rounded-borders shadow-2 icon-container">
          <span class="icon-number">{{ itemsCar }}</span>
          <q-icon name="bi-cart3" size="md" />
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

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header> Menú </q-item-label>

        <EssentialLink
          v-for="link in filteredLinksList"
          :key="link.title"
          v-bind="link"
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

const $router = useRouter();
const authStore = useAuthStore();
const carStore = useCarStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

const itemsCar = computed(() => carStore.$state.car);

const leftDrawerOpen = ref(false);

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
    link: "/",
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
    caption: "/zybizo",
    icon: "bi-facebook",
    link: "https://www.facebook.com/zybizo",
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
    link: "https://wa.me/+573165892611",
  },
  {
    title: "Zybizo page",
    caption: "Page official",
    icon: "bi-globe-americas",
    link: "https://www.zybizobazar.com/#/catalogozybizo",
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
  right: 30px;
  background-color: red;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  z-index: 1;
}
</style>
