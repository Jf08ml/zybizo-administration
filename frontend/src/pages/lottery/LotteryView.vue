<template>
  <q-page class="flex flex-center column items-center justify-space-between q-pa-md w-full">
    <transition name="fade" mode="out-in">
      <div v-if="showWelcomeCard" key="welcome">
        <CardWelcomeLottery @change-welcome-card="changeWelcomeCard" />
      </div>
      <div v-else-if="showFormCompetitor" key="form">
        <FormCompetitor @save-competitor="saveCompetitor" />
      </div>
      <div v-else-if="showRoulette" key="roulette">
        <RouletteAzar @save-reward="saveReward" @save-cupon="saveCupon" :competitorData="rewardCreated"/>
      </div>
      <div v-else-if="showSorteo">
        <CardThanksFinish />
      </div>
    </transition>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { Notify } from "quasar";
import { useRouter } from "vue-router";
import RouletteAzar from "./components/RouletteAzar.vue";
import CardWelcomeLottery from "./cards/WelcomeLottery.vue";
import FormCompetitor from "./forms/FormCompetitor.vue";
import CardThanksFinish from "./cards/ThanksFinish.vue";
import { createReward, updatedReward } from "../../services/rewardService";

const $router = useRouter();


const showWelcomeCard = ref(true);
const showFormCompetitor = ref(false);
const showRoulette = ref(false);
const showSorteo = ref(false);
const rewardCreated = ref("");

const infoParticipante = ref({
  participantName: "",
  phoneNumber: "",
  usernameInsta: "",
});

const changeWelcomeCard = (state) => {
  showWelcomeCard.value = state;
  showFormCompetitor.value = !state;
};

const saveCompetitor = async (competitor) => {
  infoParticipante.value = { ...competitor };
  const response = await createReward(infoParticipante.value);
  rewardCreated.value = response.newReward;
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
    const response = await updatedReward(rewardCreated.value._id, rewardCreated.value);
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
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
  {
  opacity: 0;
}
</style>
