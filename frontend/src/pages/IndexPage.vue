<template>
  <q-page class="flex flex-center column items-center justify-space-between q-pa-md w-full"
    style="height: 100%; box-sizing: border-box;">
    <div class="text-h3 text-weight-bold q-my-md text-center clandestine-neon" style="color: #3e454f">
      Bienvenido a la tienda clandestina
    </div>

    <div class="q-pa-md description-text">
      En nuestra tienda, ofrecemos productos garantizados de alta calidad a
      precios competitivos. ¡Explora nuestro catálogo y descubre los mejores
      precios!
    </div>

    <q-img alt="Zybizo Bazar" src="~assets/fondo.jpeg" class="my-picture" />

    <div class="q-mt-lg">
      <q-btn flat round @click="redirectToWhatsApp" class="q-ma-md social-button">
        <q-icon name="bi-whatsapp" size="xl" color="teal"></q-icon>
      </q-btn>
      <q-btn flat round @click="redirectToInstagram" class="q-ma-md social-button">
        <q-icon name="bi-instagram" size="xl" color="pink"></q-icon>
      </q-btn>
    </div>
  </q-page>
</template>

<script setup>
const redirectToWhatsApp = () => {
  window.open("https://wa.me/+573165892611", "_blank");
};

const redirectToInstagram = () => {
  window.open("https://www.instagram.com/zybizobazar", "_blank");
};
</script>
