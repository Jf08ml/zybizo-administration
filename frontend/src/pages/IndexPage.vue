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
      <p class="text-h4 text-pink text-weight-bold">Zybizo Bazar</p>
    </header>

    <main class="q-pa-md description-text text-center">
      <p class="text-body1">
        En nuestra tienda, ofrecemos productos garantizados de alta calidad a
        precios competitivos. ¡Explora nuestro
        <a href="/catalogozybizo">catálogo</a> y descubre los mejores precios!
      </p>
      <p class="text-h6">
        Ven y conoce nuestra alianza con la nueva marca de pestañas,
        <strong>Galaxia Glamour Lashes</strong>, para lashitstas profesionales!
      </p>
    </main>
    <div align="center">
      <q-img
        alt="Lashes pestañas"
        src="https://i.ibb.co/f0hpwQn/1.jpg"
        class="rounded-borders custom-width-img"
      />
      <q-img
        alt="Lashes pestañas"
        src="https://i.ibb.co/RYyFBYq/presentation.jpg"
        class="rounded-borders q-ma-xs custom-width-img"
      />
      <q-img
        alt="Lashes pestañas"
        src="https://i.ibb.co/3M2ywsn/yy.jpg"
        class="rounded-borders custom-width-img"
      />
    </div>
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

.custom-width-img {
  width: 220px;
}

@media (min-width: 600px) {
  .custom-width-img {
    width: 30px;
  }
}

/* Estilos para pantallas grandes y desktop */
@media (min-width: 1024px) {
  .custom-width-img {
    width: 220px;
  }
}
</style>
