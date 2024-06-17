<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section class="bg-pink text-white">
        <div class="text-h6">¡Gracias por participar!</div>
      </q-card-section>

      <q-card-section align="center">
        <div class="text-subtitle2">
          Tu participación es muy valiosa para nosotros.
        </div>
        <p>
          Sigue nuestras redes sociales y mantente al tanto de nuestros
          productos y servicios.
        </p>
        <div>
          <q-img alt="Zybizo Bazar" src="/icons/android-chrome-512x512.png" class="my-picture" />
          <p class="text-justify"><span class="text-body1 text-red text-weight-bolder">Nota: </span>Recuerda que para reclamar tu premio deberás escribirnos, tener a la mano el
            número de teléfono y nombre de
            usuario de Instagram que registraste en el formulario inicial para poder recibir tu recompensa.</p>
          <div class="q-mt-lg">
            <q-btn flat round @click="redirectToWhatsApp" class="q-ma-md social-button">
              <q-icon name="bi-whatsapp" size="xl" color="teal"></q-icon>
            </q-btn>
            <q-btn flat round @click="redirectToInstagram" class="q-ma-md social-button">
              <q-icon name="bi-instagram" size="xl" color="pink"></q-icon>
            </q-btn>
            <q-btn flat round @click="redirectToFacebook" class="q-ma-md social-button">
              <q-icon name="bi-facebook" size="xl" color="blue"></q-icon>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
const redirectToWhatsApp = () => {
  window.open("https://wa.me/+573165892611", "_blank");
};

const redirectToInstagram = () => {
  window.open("https://www.instagram.com/zybizobazar", "_blank");
};

const redirectToFacebook = () => {
  window.open("https://www.facebook.com/zybizo", "_blank");
};
</script>

<style>
.my-card {
  width: 350px;
}
</style>
