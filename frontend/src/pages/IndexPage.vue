<template>
  <q-page
    class="flex flex-center column items-center justify-space-between q-pa-md"
    style="height: 100%; box-sizing: border-box"
  >
    <header
      class="text-h3 text-weight-bold q-my-md text-center clandestine-neon"
      style="color: #3e454f"
    >
      <p>Bienvenido a la tienda</p>
      <p class="clandestine-neon-red">Zybizo Bazar</p>
    </header>

    <main class="q-pa-md description-text">
      <p>
        En nuestra tienda, ofrecemos productos garantizados de alta calidad a
        precios competitivos. ¡Explora nuestro catálogo y descubre los mejores
        precios!
      </p>
    </main>

    <q-img
      alt="Zybizo Bazar"
      src="https://i.ibb.co/Gxr3GSs/fondo.jpg"
      class="my-picture"
    />

    <div class="q-mt-lg">
      <q-btn
        flat
        round
        @click="redirectToWhatsApp"
        class="q-ma-md social-button"
      >
        <q-icon name="bi-whatsapp" size="xl" color="teal"></q-icon>
      </q-btn>
      <q-btn
        flat
        round
        @click="redirectToInstagram"
        class="q-ma-md social-button"
      >
        <q-icon name="bi-instagram" size="xl" color="pink"></q-icon>
      </q-btn>
      <q-btn
        flat
        round
        @click="redirectToFacebook"
        class="q-ma-md social-button"
      >
        <q-icon name="bi-facebook" size="xl" color="blue"></q-icon>
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
      content: "zybizo, tienda, bazar, productos de calidad, precios competitivos",
    },
  },
}));
</script>
