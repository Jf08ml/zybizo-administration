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
    const response = await apiProduct.get("/getProducts", {
      headers: { "Cache-Control": "no-cache" },
    });

    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  }
}
