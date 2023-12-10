import { apiRewards } from "./api.js";
import { showLoading, hideLoading } from "../stores/loadingStore.js";

export async function createReward(reward) {
  try {
    showLoading();
    const response = await apiRewards.post(
      "/rewards",
      { reward },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  } finally {
    hideLoading();
  }
}
