import { apiExpense } from "./api.js";
import { showLoading, hideLoading } from "../stores/loadingStore.js";

export async function createExpense(spent) {
  try {
    showLoading();

    const response = await apiExpense.post(
      "/spent",
      { spent },
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

export async function getExpenses() {
  try {
    showLoading();
    const response = await apiExpense.get("/expenses", {
      headers: { "Cache-Control": "no-cache" },
    });

    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  } finally {
    hideLoading();
  }
}
