import { apiExpense } from "./api.js";

export async function createExpense(spent) {
  try {
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
  }
}

export async function getExpenses() {
  try {
    const response = await apiExpense.get("/expenses", {
      headers: { "Cache-Control": "no-cache" },
    });

    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  }
}
