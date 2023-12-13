<template>
  <q-page class="flex flex-center column w-full">
    <q-card class="flex flex-center column">
      <q-card-section class="text-body1">
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label caption lines="2"> Participante: </q-item-label>
              <q-item-label>
                {{ competitorData.participantName }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption lines="2">
                Giros disponibles:
              </q-item-label>
              <q-item-label>
                <span :style="giros !== 0 ? 'color: green' : 'color: red'">
                  {{ giros }} / 3</span
                >
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div class="slot-column">
          <div class="slot-symbol">{{ symbols[currentSymbolIndex] }}</div>
        </div>
      </q-card-section>
      <q-card-actions>
        <q-btn
          push
          color="primary"
          v-if="giros != 0"
          :disabled="spinning"
          @click="spin"
          >{{ spinning ? "Jugando..." : "Jugar" }}</q-btn
        >
        <q-chip
          v-else
          color="red"
          text-color="white"
          label="Actividad finalizada, selecciona tu recompensa."
        />
      </q-card-actions>
    </q-card>

    <CardClaimRewards
      v-if="listaPremios.length > 0 && !todosPerdidos"
      @submit-reward="submitReward"
      :listaPremios="listaPremios"
    />

    <CardCuponReward
      v-if="giros === 0 && todosPerdidos"
      @save-cupon="saveCupon"
      :cuponGenerado="cuponGenerado"
    />

    <q-dialog v-model="won" persistent no-backdrop-dismiss>
      <CardWinOrLose
        @añadir-premio="añadirPremio"
        :winningSymbol="winningSymbol"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import CardClaimRewards from "../cards/ClaimRewards.vue";
import CardCuponReward from "../cards/CuponReward.vue";
import CardWinOrLose from "../cards/WinOrLose.vue";

const props = defineProps({
  competitorData: Object,
});

const emit = defineEmits(["save-reward", "save-cupon"]);

const symbols = ref([
  "¡Auriculares + envió gratis!",
  "¡Auriculares sin envió gratis!",
  "¡Bono de $10.000!",
  "Descuento del 10%",
  "Descuento del 20%",
  "Descuento del 30%",
  "Descuento del 40%",
  "Descuento del 50%",
  "Descuento del 60%",
  "¡Buena suerte la próxima vez!",
]);
const currentSymbolIndex = ref(0);
const spinning = ref(false);
const won = ref(false);
const winningSymbol = ref("");
const giros = ref(3);
const listaPremios = ref([]);

const cuponGenerado = ref("");

const submitReward = (selectedReward) => {
  emit("save-reward", selectedReward);
};

const saveCupon = () => {
  emit("save-cupon", cuponGenerado.value);
};

const todosPerdidos = computed(() => {
  return listaPremios.value.every(
    (premio) => premio === "¡Buena suerte la próxima vez!"
  );
});

const generarCupon = () => {
  let cupon = "";
  const caracteres = "ZYBIZOBAZAR0123456789";
  const longitud = 10;

  for (let i = 0; i < longitud; i++) {
    cupon += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return cupon;
};

const symbolsProbabilities = [
  0.00009, // "¡Auriculares + envió gratis!" 0.009%
  0.00009, // "¡Auriculares sin envió gratis!" 0.009%
  0.04941, // "¡Bono de $10.000!" 4.941%
  0.04941, // "Descuento del 10%" 4.941%
  0.02, // "Descuento del 20%" 2%
  0.02, // "Descuento del 30%" 2%
  0.01, // "Descuento del 40%" 1%
  0.01, // "Descuento del 50%" 1%
  0.01, // "Descuento del 60%" 1%
  0.831, // "¡Buena suerte la próxima vez!" ajustado al 83.1%
];

const añadirPremio = () => {
  if (winningSymbol.value === "¡Buena suerte la próxima vez!") {
    return;
  } else {
    listaPremios.value.push(winningSymbol.value);
  }
};

const verificarPremiosYGenerarCupon = () => {
  if (
    listaPremios.value.every(
      (premio) => premio === "¡Buena suerte la próxima vez!"
    )
  ) {
    cuponGenerado.value = generarCupon();
  }
};

const spin = () => {
  if (giros.value != 0) {
    if (spinning.value) return;
    spinning.value = true;
    won.value = false;

    const random = Math.random();
    let cumulativeProbability = 0;
    let winningSymbolIndex = 0;

    for (let i = 0; i < symbolsProbabilities.length; i++) {
      cumulativeProbability += symbolsProbabilities[i];
      if (random <= cumulativeProbability) {
        winningSymbolIndex = i;
        break;
      }
    }

    let currentIndex = 0;
    const spinInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % symbols.value.length;
      currentSymbolIndex.value = currentIndex;
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      currentSymbolIndex.value = winningSymbolIndex;
      winningSymbol.value = symbols.value[winningSymbolIndex];
      spinning.value = false;
      giros.value -= 1;
      won.value = true;
      if (giros.value === 0) {
        verificarPremiosYGenerarCupon();
      }
    }, 1000);
  }
};
</script>

<style scoped>
.slot-column {
  width: 300px;
  height: 100%;
  border: 2px solid #2d86e6;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-block: 20px;
  font-size: 1rem;
  padding: 10px;
  font-weight: bold;
  background-color: #fff;
  color: #00aeff;
  text-transform: uppercase;
}
</style>
