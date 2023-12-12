<template>
  <q-card class="flex q-mt-md column">
    <q-card-section>
      <div>
        <span class="text-body1 text-weight-bolder">Has ganado las siguientes recompensas:</span>
      </div>
      <q-select
        v-model="selectedReward"
        :options="listaPremios"
        label="Recompensas"
      />
      <div>
        <span class="text-body2"><a class="text-red text-weight-bolder">Nota: </a> Solo puedes reclamar 1.</span>
      </div>
    </q-card-section>

    <q-card-actions align="center">
      <q-btn
        unelevated
        rounded
        color="light-blue"
        :disabled="!selectedReward"
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
