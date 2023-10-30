import { apiProductSale } from "./api.js";

export async function createProductSale(productSale) {
  try {
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
  }
}

export async function getProductsSale() {
  try {
    const response = await apiProductSale.get("/getProductsSale", {
      headers: { "Cache-Control": "no-cache" },
    });

    return response.data;
  } catch (error) {
    return await Promise.reject(error.response.data);
  }
}
