import { apiProduct } from "./api.js";

export async function createProduct(product) {
  try {
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
  }
}

export async function getProducts() {
  try {
    const response = await apiProduct.get("/products", {
      headers: { "Cache-Control": "no-cache" },
    });

    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  }
}

export async function updateProduct(id, updatedFields) {
  try {
    const response = await apiProduct.put(`/products/${id}`, updatedFields);

    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  }
}

export async function deleteProduct(id) {
  try {
    const response = await apiProduct.delete(`/sales/${id}/return`);

    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  }
}
