<template>
  <q-card class="my-card q-pa-md">
    <q-card-section>
      <div class="text-h5 text-center q-pb-md">Registro del participante</div>
      <p class="text-body2 text-pink text-sm text-justify">
        Los datos siguientes serán usados para validar entrega de recompensas
      </p>
      <q-form @submit="saveCompetitor">
        <q-input
          filled
          dense
          v-model="infoParticipante.participantName"
          class="q-mt-sm"
          label="Nombres completos"
          required
        />
        <q-input
          filled
          dense
          v-model="infoParticipante.phoneNumber"
          class="q-mt-sm"
          type="number"
          label="Número de Teléfono"
          required
        />
        <q-input
          filled
          dense
          v-model="infoParticipante.usernameInsta"
          class="q-mt-sm"
          label="Nombre de usuario en instagram"
          required
        />
        <q-btn
          rounded
          color="pink"
          class="q-mt-md"
          label="Confirmar"
          type="submit"
        />
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";

const infoParticipante = ref({
  participantName: "",
  phoneNumber: "",
  usernameInsta: "",
});

const emit = defineEmits(["save-competitor"]);

const saveCompetitor = () => {
  emit("save-competitor", infoParticipante.value);
};
</script>
