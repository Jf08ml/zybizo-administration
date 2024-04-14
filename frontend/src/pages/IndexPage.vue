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
      <p class="text-h4 text-blue text-weight-bold" >
        Zybizo Bazar
      </p>
    </header>

    <main class="q-pa-md description-text text-center">
      <p>
        En nuestra tienda, ofrecemos productos garantizados de alta calidad a
        precios competitivos. ¡Explora nuestro <a href="/catalogozybizo">catálogo</a> y descubre los mejores
        precios!
      </p>
    </main>

    <q-img
      alt="Zybizo Bazar"
      src="https://i.ibb.co/Gxr3GSs/fondo.jpg"
      class="my-picture rounded-borders"
      style="width: 220px;"
    />

    <div class="q-mt-lg flex flex-center">
      <q-btn
        flat
        round
        @click="redirectToWhatsApp"
        class="q-ma-md social-button"
        style="background: #25d366; color: white"
      >
        <q-icon name="bi-whatsapp" size="xl"></q-icon>
      </q-btn>
      <q-btn
        flat
        round
        @click="redirectToInstagram"
        class="q-ma-md social-button"
        style="background: #e1306c; color: white"
      >
        <q-icon name="bi-instagram" size="xl"></q-icon>
      </q-btn>
      <q-btn
        flat
        round
        @click="redirectToFacebook"
        class="q-ma-md social-button"
        style="background: #3b5998; color: white"
      >
        <q-icon name="bi-facebook" size="xl"></q-icon>
      </q-btn>
    </div>
  </q-page>
</template>

<script setup>
import { useMeta } from "quasar";

const redirectToWhatsApp = () => {
  window.open("https://wa.me/+573165892611", "_blank");
};

const redirectToInstagram = () => {
  window.open("https://www.instagram.com/zybizobazar", "_blank");
};

const redirectToFacebook = () => {
  window.open("https://www.facebook.com/zybizo", "_blank");
};

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
