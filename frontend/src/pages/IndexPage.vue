<template>
  <q-page class="flex flex-center column items-center justify-space-between">
    <header class="text-h3 text-weight-bold q-my-md text-center">
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
    <div style="width: 80%; height: auto; padding: 10px; overflow: auto">
      <q-carousel
        v-model="slide"
        swipeable
        animated
        thumbnails
        infinite
        arrows
        control-color="white"
        :autoplay="true"
        class="rounded-borders"
      >
        <q-carousel-slide name="1" img-src="https://i.ibb.co/f0hpwQn/1.jpg" />
        <q-carousel-slide
          name="2"
          img-src="https://i.ibb.co/RYyFBYq/presentation.jpg"
        />
        <q-carousel-slide name="3" img-src="https://i.ibb.co/3M2ywsn/yy.jpg" />
      </q-carousel>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useMeta } from "quasar";

const slide = ref("1");

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
        "Zybizo Bazar, Zybizo tienda, Zybizobazar, productos de calidad, compras online, bazar online, Zybizo oferta, Zibizo, Zybyzo, Zybiso, Zibyzo, Sybizo, Zybizzo, Zyvizoo, Zyvizo, Zybiso, Zybeezo, Zibiso, Sybiso, Zibizo, Sibyso, Zybzio, sibiso, sybiso",
    },
  },
}));
</script>

<style scoped></style>
