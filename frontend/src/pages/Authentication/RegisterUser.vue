<template>
    <q-page class="flex flex-center">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">Registrarse en la tienda</div>
        </q-card-section>
  
        <q-card-section>
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-input
              filled
              v-model="registerInfo.email"
              label="Correo electrónico"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Por favor ingrese su usuario o correo electrónico',
              ]"
            />
            <q-input
              filled
              v-model="registerInfo.password"
              label="Contraseña"
              type="password"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Por favor ingrese su contraseña',
              ]"
            />
  
            <div align="center">
              <q-btn label="Registrarse" type="submit" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-page>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { signup } from "../../services/auth.js";
  import { useRouter } from "vue-router";
  
  const $router = useRouter();
  const registerInfo = ref({
    email: "",
    password: "",
  });
  
  const onSubmit = async () => {
    try {
      const response = await signup(registerInfo.value);
      console.log(response);
      if (response.status === "success") {
        $router.push({ name: "Catalogue" });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const onReset = () => {
    registerInfo.value.email = "";
    registerInfo.value.password = "";
  };
  </script>
  
  <style>
  .my-card {
    width: 400px;
    max-width: 90%;
  }
  </style>
  