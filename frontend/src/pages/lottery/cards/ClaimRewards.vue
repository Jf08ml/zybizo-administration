<template>
  <q-card class="flex q-mt-md column">
    <q-card-section>
      <div class="text-h6">Selecciona tu recompensa</div>
      <q-select
        v-model="selectedReward"
        :options="listaPremios"
        label="Recompensas"
      />
    </q-card-section>

    <q-card-actions align="center">
      <q-btn
        unelevated
        rounded
        color="light-blue"
        label="Reclamar recompensa"
        @click="submitReward"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  listaPremios: Array,
});

const emit = defineEmits(["submit-reward", "redirect-to-whatsApp"]);

const selectedReward = ref("");

const submitReward = () => {
  emit("submit-reward", selectedReward.value);
};
</script>
