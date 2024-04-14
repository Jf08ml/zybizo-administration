<template>
  <q-page
    class="flex flex-center column items-center justify-space-between q-pa-md"
    style="height: 100%; box-sizing: border-box"
  >
    <header
      class="text-h3 text-weight-bold q-my-md text-center"
      style="color: #3e454f"
    >
      <p>Bienvenido a la tienda</p>
      <p class="text-h4 text-blue text-weight-bold">Zybizo Bazar</p>
    </header>

    <main class="q-pa-md description-text text-center">
      <p>
        En nuestra tienda, ofrecemos productos garantizados de alta calidad a
        precios competitivos. ¡Explora nuestro
        <a href="/catalogozybizo">catálogo</a> y descubre los mejores precios!
      </p>
    </main>

    <q-img
      alt="Zybizo Bazar"
      src="https://i.ibb.co/Gxr3GSs/fondo.jpg"
      class="my-picture rounded-borders"
      style="width: 220px"
    />
  </q-page>
</template>

<script setup>
import { useMeta } from "quasar";

useMeta(() => ({
  title: "Zybizo Bazar - Tienda Online",
  meta: {
    description: {
      name: "description",
      content:
        "En nuestra tienda, ofrecemos productos garantizados de alta calidad a precios competitivos. ¡Explora nuestro catálogo y descubre los mejores precios!",
    },
    keywords: {
      name: "keywords",
      content:
        "zybizo, tienda, bazar, productos de calidad, precios competitivos",
    },
  },
}));
</script>

<style>
.rounded-borders {
  border-radius: 8px;
}
</style>
