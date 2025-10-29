import axios from "axios";
import { refreshToken } from "./refreshToken";
import EventBus from "../utils/eventBus";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_URL;

const createAxiosInstance = (baseURL) => {
  const api = axios.create({
    baseURL,
  });

  // Interceptor para agregar token de autorización
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token && token !== "null" && token !== "undefined") {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (
        error.response.status === 401 &&
        error.response.data.message === "jwt expired"
      ) {
        try {
          const response = await refreshToken();
          const originalRequest = error.config;
          originalRequest.headers.Authorization = response.token;
          return api(originalRequest);
        } catch (refreshError) {
          EventBus.emit("logout");
          throw new Error("refreshTokenExpired");
        }
      }
      throw error;
    }
  );

  return api;
};

const apiAuth = createAxiosInstance(`${API_BASE_URL}/api/auth`);
const apiProduct = createAxiosInstance(`${API_BASE_URL}/api/product`);
const apiProductSale = createAxiosInstance(`${API_BASE_URL}/api/productSale`);
const apiExpense = createAxiosInstance(`${API_BASE_URL}/api/expense`);
const apiRewards = createAxiosInstance(`${API_BASE_URL}/api/rewards`);
const apiOrder = createAxiosInstance(`${API_BASE_URL}/api/orders`);
const apiImages = createAxiosInstance(`${API_BASE_URL}/api/images`);
const api = createAxiosInstance(`${API_BASE_URL}/api`);

export default api;
export {
  apiAuth,
  apiProduct,
  apiProductSale,
  apiExpense,
  apiRewards,
  apiOrder,
  apiImages,
  api
};
