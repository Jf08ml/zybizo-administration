<template>
  <q-page class="flex flex-center">
    <div>
      <q-card>
        <q-card-section class="bg-pink text-white" align="center">
          <div class="text-h6">¡Gracias por comprar con nosotros!</div>
        </q-card-section>

        <q-card-section align="center">
          <div class="text-primary text-subtitle1 text-weight-bold q-mb-md">
            Hemos recibido tu pedido, pronto nos comunicaremos contigo.
          </div>
          <p class="q-mt-md text-justify">
            <span class="text-body2 text-red text-weight-bolder">Nota: </span
            >Recuerda que para que el envió se realice deberás confirmar el
            pedido cuando nos comuniquemos contigo.
          </p>
          <div>
            <q-img
              alt="Zybizo Bazar"
              src="https://i.ibb.co/Qcw6sfF/logo.png"
              class="my-picture rounded-borders"
            />
            <p class="text-subtitle2">
              Sigue nuestras redes sociales y mantente al tanto de nuestros
              productos y servicios.
            </p>
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
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
const redirectToWhatsApp = () => {
  window.open("https://wa.me/message/LRMCRWYN6JRNO1", "_blank");
};

const redirectToInstagram = () => {
  window.open("https://www.facebook.com/zybizo.bazar", "_blank");
};

const redirectToFacebook = () => {
  window.open("https://www.facebook.com/zybizo", "_blank");
};
</script>

<style scoped></style>
