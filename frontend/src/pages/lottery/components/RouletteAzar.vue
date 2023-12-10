<template>
  <q-page class="flex flex-center column w-full">
    <q-card class="flex flex-center column">
      <q-card-section>
        <q-separator />
        <span class="text-overline">Giros disponibles: {{ giros }} / 3</span>
        <q-separator />
        <div class="slot-column">
          <div class="slot-symbol">{{ symbols[currentSymbolIndex] }}</div>
        </div>
      </q-card-section>
      <q-card-actions>
        <q-btn
          style="background: #ff0080; color: white"
          v-if="giros != 0"
          :disabled="spinning"
          @click="spin"
          >{{ spinning ? "Girando..." : "Girar" }}</q-btn
        >
        <q-chip
          v-else
          color="red"
          text-color="white"
          label="Actividad finalizada, selecciona tu recompensa"
        />
      </q-card-actions>
    </q-card>

    <CardClaimRewards
      v-if="giros === 0 && listaPremios.length > 0 && !todosPerdidos"
      @submit-reward="submitReward"
      :listaPremios="listaPremios"
    />

    <CardCuponReward
      v-if="giros === 0 && todosPerdidos"
      @save-cupon="saveCupon"
      :cuponGenerado="cuponGenerado"
    />

    <q-dialog v-model="won">
      <CardWinOrLose
        @añadir-premio="añadirPremio()"
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
  "¡Buena suerte la proxima vez!",
]);
const currentSymbolIndex = ref(0);
const spinning = ref(false);
const won = ref(false);
const winningSymbol = ref("");
const giros = ref(3);
const listaPremios = ref([]);

const cuponGenerado = ref("");

const submitReward = (selectedReward) => {
  emit("save-reward", selectedReward)
};

const saveCupon = () => {
  emit("save-cupon", cuponGenerado.value);
};

const todosPerdidos = computed(() => {
  return listaPremios.value.every(
    (premio) => premio === "¡Buena suerte la proxima vez!"
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
  0.01, 0.01, 0.2, 0.2, 0.1, 0.01, 0.01, 0.01, 0.01, 1.1,
];
// const symbolsProbabilities = [
//   0, 0, 0, 0, 0, 0, 0, 0, 0, 0.7,
// ];
const añadirPremio = () => {
  listaPremios.value.push(winningSymbol.value);
};

const verificarPremiosYGenerarCupon = () => {
  if (
    listaPremios.value.every(
      (premio) => premio === "¡Buena suerte la proxima vez!"
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

.winning-message {
  font-size: 1.5rem;
  padding: 10px;
  font-weight: bold;
  margin: auto;
  color: #28a745;
}
</style>