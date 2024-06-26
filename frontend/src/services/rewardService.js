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

    return response;
  } catch (error) {
    console.error(error.response.data);
    return error.response.data;
  } finally {
    hideLoading();
  }
}

export async function updatedReward(rewardId, reward) {
  try {
    showLoading();
    const response = await apiRewards.put(
      `/rewards/${rewardId}`,
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

export async function getAllRewards() {
  try {
    const response = await apiRewards.get(`/rewards`, {
      headers: { "Cache-Control": "no-cache" },
    });

    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  }
}

export async function searchReward(queryParams) {
  try {
    const response = await apiRewards.get(`/rewards/by-field`, {
      params: queryParams,
      headers: { "Cache-Control": "no-cache" },
    });

    return response.data;
  } catch (error) {
    return Promise.reject(error.response ? error.response.data : error);
  }
}
