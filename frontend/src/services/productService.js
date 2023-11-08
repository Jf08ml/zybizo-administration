import { apiProduct } from "./api.js";
import { showLoading, hideLoading } from "../stores/loadingStore.js";

export async function createProduct(product) {
  try {
    showLoading();
    const response = await apiProduct.post(
      "/addProduct",
      { product },
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

export async function getProducts() {
  try {
    showLoading();
    const response = await apiProduct.get("/products", {
      headers: { "Cache-Control": "no-cache" },
    });

    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  } finally {
    hideLoading();
  }
}

export async function getProductsCatalog() {
  try {
    showLoading();
    const response = await apiProduct.get("/productsCatalog", {
      headers: { "Cache-Control": "no-cache" },
    });

    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  } finally {
    hideLoading();
  }
}

export async function updateProduct(id, updatedFields) {
  try {
    showLoading();
    const response = await apiProduct.put(`/products/${id}`, updatedFields);

    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  } finally {
    hideLoading();
  }
}

export async function deleteProduct(id) {
  try {
    showLoading();

    const response = await apiProduct.delete(`/productRemove/${id}`);

    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  } finally {
    hideLoading();
  }
}
