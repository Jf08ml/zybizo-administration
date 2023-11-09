<template>
  <q-page class="flex flex-center">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Acceso a la plataforma</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <q-input
            filled
            v-model="loginInfo.identifier"
            label="Usuario o correo electrónico"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                'Por favor ingrese su usuario o correo electrónico',
            ]"
          />
          <q-input
            filled
            v-model="loginInfo.password"
            label="Contraseña"
            type="password"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Por favor ingrese su contraseña',
            ]"
          />

          <div align="center">
            <q-btn label="Iniciar sesión" type="submit" color="primary" />
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

const $router = useRouter();
const loginInfo = ref({
  identifier: "",
  password: "",
});

const onSubmit = async () => {
  try {
    const response = await login(loginInfo.value);
    if (response.result === "success") {
      $router.push({ name: "ManageProducts" });
    }
  } catch (error) {
    console.error(error);
  }
};
const onReset = () => {
  loginInfo.value.identifier = "";
  loginInfo.value.password = "";
};
</script>

<style>
.my-card {
  width: 400px;
  max-width: 90%;
}
</style>
