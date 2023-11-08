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
        <q-avatar v-if="isAuthenticated" @click="logout">
          <q-icon name="logout"></q-icon>
        </q-avatar>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
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
import EssentialLink from "components/EssentialLink.vue";

const $router = useRouter();
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

const leftDrawerOpen = ref(false);

const linksList = [
  {
    title: "Catálogo",
    caption: "",
    icon: "shopping_cart_checkout",
    link: "/catalogozybizo",
  },
  {
    title: "Iniciar sesión",
    caption: "",
    icon: "login",
    link: "/login",
    requiresNoAuth: true,
  },
  {
    title: "Manage products",
    caption: "",
    icon: "fact_check",
    link: "/products",
    role: "Administrator",
  },
  {
    title: "Financial analysis",
    caption: "",
    icon: "attach_money",
    link: "/financial",
    role: "Administrator",
  },
  {
    title: "Sales management",
    caption: "",
    icon: "price_check",
    link: "/sales",
    role: "Administrator",
  },
  {
    title: "Expense management",
    caption: "",
    icon: "payments",
    link: "/expense",
    role: "Administrator",
  },
  {
    title: "Facebook",
    caption: "/zybizo",
    icon: "facebook",
    link: "https://www.facebook.com/zybizo",
  },
  {
    title: "Instagram",
    caption: "@zybizobazar",
    icon: "instagram",
    link: "https://www.instagram.com/zybizobazar",
  },
  {
    title: "Whatsapp",
    caption: "@ZybizoBazar",
    icon: "chat",
    link: "https://wa.me/+573165892611",
  },
  {
    title: "Zybizo page",
    caption: "Page official",
    icon: "public",
    link: "",
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
  const matchedLink = linksList.find((link) => link.link === $router.path);
  const subTitle = matchedLink ? matchedLink.title : "";
  return `Zybizo Bazar / ${subTitle}`;
});
</script>
