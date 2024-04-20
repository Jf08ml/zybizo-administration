import { apiOrder } from "./api.js";
import { showLoading, hideLoading } from "../stores/loadingStore.js";

export async function createOrder(order) {
  try {
    showLoading();
    const response = await apiOrder.post(
      "/order",
      { order },
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

export async function updatedOrder(orderId, order) {
  try {
    showLoading();
    const response = await apiOrder.put(
      `/order/${orderId}`,
      { order },
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

export async function getAllOrders() {
  try {
    const response = await apiOrder.get(`/order`, {
      headers: { "Cache-Control": "no-cache" },
    });

    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  }
}

export async function searchOrder(queryParams) {
  try {
    const response = await apiOrder.get(`/order/by-field`, {
      params: queryParams,
      headers: { "Cache-Control": "no-cache" },
    });

    return response.data;
  } catch (error) {
    return Promise.reject(error.response ? error.response.data : error);
  }
}
