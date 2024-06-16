<template>
  <q-page class="flex flex-center">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Acceso a la tienda</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input
            filled
            v-model="loginInfo.email"
            label="Correo electrónico"
            lazy-rules
            :rules="emailRules"
          />
          <q-input
            filled
            v-model="loginInfo.password"
            label="Contraseña"
            type="password"
            lazy-rules
            :rules="passwordRules"
          />
          <div v-if="errorMessage" class="q-pa-md text-negative" align="center">
            {{ errorMessage }}
          </div>
          <div align="center">
            <q-btn rounded="" label="Iniciar sesión" type="submit" color="pink" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { login } from "../../services/auth.js";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";

const authStore = useAuthStore();
const $router = useRouter();
const loginInfo = ref({
  email: "",
  password: "",
});
const errorMessage = ref("");

const emailRules = [
  (val) =>
    (val && val.length > 0) ||
    "Por favor ingrese su usuario o correo electrónico",
];
const passwordRules = [
  (val) => (val && val.length > 0) || "Por favor ingrese su contraseña",
];

const onSubmit = async () => {
  try {
    const response = await login(loginInfo.value);
    if (
      response.status === "success" &&
      authStore.$state.userRole === "Administrator"
    ) {
      $router.push({ name: "ManageProducts" });
    } else {
      $router.push({ name: "Catalogue" });
    }
  } catch (error) {
    errorMessage.value = error.message;
    console.error(error);
  }
};

const onReset = () => {
  loginInfo.value.identifier = "";
  loginInfo.value.password = "";
  errorMessage.value = "";
};
</script>

<style>
.my-card {
  width: 400px;
  max-width: 90%;
}
</style>
