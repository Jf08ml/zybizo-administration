<template>
  <q-page
    class="flex flex-center column items-center justify-space-between q-pa-md full-width"
  >
    <transition name="fade" mode="out-in">
      <div v-if="showWelcomeCard" key="welcome">
        <CardWelcomeLottery @change-welcome-card="changeWelcomeCard" />
      </div>
      <div v-else-if="showFormCompetitor" key="form">
        <FormCompetitor @save-competitor="saveCompetitor" />
      </div>
      <div v-else-if="showRoulette" key="roulette">
        <RouletteAzar
          @save-reward="saveReward"
          @save-cupon="saveCupon"
          :competitorData="rewardCreated"
        />
      </div>
      <div v-else-if="showSorteo">
        <CardThanksFinish />
      </div>
    </transition>
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
import { Notify } from "quasar";
import RouletteAzar from "./components/RouletteAzar.vue";
import CardWelcomeLottery from "./cards/WelcomeLottery.vue";
import FormCompetitor from "./forms/FormCompetitor.vue";
import CardThanksFinish from "./cards/ThanksFinish.vue";
import {
  createReward,
  updatedReward,
  getAllRewards,
} from "../../services/rewardService";

const showWelcomeCard = ref(true);
const showFormCompetitor = ref(false);
const showRoulette = ref(false);
const showSorteo = ref(false);
const rewardCreated = ref("");
const giftsClaimed = ref({});
const infoParticipante = ref({
  participantName: "",
  phoneNumber: "",
  usernameInsta: "",
});

const intervalId = ref(null);
const timeoutIds = ref([]);

onBeforeMount(async () => {
  await getGifts();
  await showRandomGifts();
});

const getGifts = async () => {
  try {
    const response = await getAllRewards();
    giftsClaimed.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const showRandomGifts = async () => {
  if (!giftsClaimed.value || giftsClaimed.value.length === 0) return;

  const shuffledGifts = giftsClaimed.value.sort(() => 0.5 - Math.random());
  const selectedGifts = shuffledGifts.slice(0, 10);

  selectedGifts.forEach((gift, index) => {
    const timeoutId = setTimeout(() => {
      Notify.create({
        icon: "contactless",
        html: true,
        message: gift.reward
          ? `${gift.participantName} ha ganado: ${gift.reward}.`
          : `${gift.participantName} ha ganado un cupon.`,
        progress: true,
        textColor: "white",
      });
    }, index * 5000);
    timeoutIds.value.push(timeoutId);
  });
};

intervalId.value = setInterval(async () => {
  await getGifts();
  showRandomGifts();
}, 60000);

const changeWelcomeCard = (state) => {
  showWelcomeCard.value = state;
  showFormCompetitor.value = !state;
};

const saveCompetitor = async (competitor) => {
  infoParticipante.value = { ...competitor };
  const response = await createReward(infoParticipante.value);
  if (response.data == "Error") {
    Notify.create({
      icon: "error",
      type: 'negative',
      message: response.message,
      textColor: "white",
    });
    return;
  }
  rewardCreated.value = response.data.data;
  showRoulette.value = true;
  showFormCompetitor.value = false;
};

const saveCupon = async (cupon) => {
  rewardCreated.value.cupon = cupon;
  try {
    await updatedReward(rewardCreated.value._id, rewardCreated.value);
    Notify.create({
      message: "¡Premio cargado correctamente, escríbenos para canjearlo!",
      color: "positive",
    });
    showRoulette.value = false;
    showSorteo.value = true;
  } catch (error) {
    Notify.create({
      message: error.message,
      color: "negative",
    });
    console.error(error);
  }
};

const saveReward = async (reward) => {
  rewardCreated.value.reward = reward;
  try {
    const response = await updatedReward(
      rewardCreated.value._id,
      rewardCreated.value
    );
    Notify.create({
      message: "¡Premio cargado correctamente, escríbenos para canjearlo!",
      color: "positive",
    });
    showRoulette.value = false;
    showSorteo.value = true;
  } catch (error) {
    Notify.create({
      message: error.message,
      color: "negative",
    });
    console.error(error);
  }
};

onBeforeUnmount(() => {
  timeoutIds.value.forEach((id) => {
    clearTimeout(id);
  });

  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
</script>

<style scoped></style>
