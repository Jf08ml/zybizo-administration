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
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Administration </q-item-label>

        <EssentialLink
          v-for="link in linksList"
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
import { useRoute } from "vue-router";
import EssentialLink from "components/EssentialLink.vue";

const route = useRoute();

const leftDrawerOpen = ref(false);

const linksList = [
  {
    title: "Manage products",
    caption: "",
    icon: "fact_check",
    link: "/products",
  },
  {
    title: "Financial analysis",
    caption: "",
    icon: "attach_money",
    link: "/financial",
  },
  {
    title: "Sales management",
    caption: "",
    icon: "price_check",
    link: "/sales",
  },
  {
    title: "Expense management",
    caption: "",
    icon: "payments",
    link: "/expense",
  },
  {
    title: "Zybizo",
    caption: "@ZybizoBazar",
    icon: "facebook",
    link: "",
  },
  {
    title: "Zybizo page",
    caption: "Page official",
    icon: "public",
    link: "",
  },
];

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const fullTitle = computed(() => {
  const matchedLink = linksList.find((link) => link.link === route.path);
  const subTitle = matchedLink ? matchedLink.title : "";
  return `Zybizo Bazar / ${subTitle}`;
});
</script>
