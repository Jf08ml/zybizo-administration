import { apiProductSale } from "./api.js";
import { showLoading, hideLoading } from "../stores/loadingStore.js";

export async function createProductSale(productSale) {
  try {
    showLoading();

    const response = await apiProductSale.post(
      "/addProductSale",
      { productSale },
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

export async function getProductsSale() {
  try {
    showLoading();

    const response = await apiProductSale.get("/getProductsSale", {
      headers: { "Cache-Control": "no-cache" },
    });

    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  } finally {
    hideLoading();
  }
}

export async function handleReturn(
  saleId,
  status,
  returnReason,
  exchangeProductId
) {
  try {
    showLoading();

    const response = await apiProductSale.put(`/sales/${saleId}/return`, {
      status: status,
      returnReason: returnReason,
      exchangeProductId: exchangeProductId,
    });
    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  } finally {
    hideLoading();
  }
}
