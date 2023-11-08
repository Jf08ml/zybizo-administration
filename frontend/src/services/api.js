import axios from "axios";
import { refreshToken } from "./refreshToken";
import EventBus from "../utils/eventBus";

const createAxiosInstance = (baseURL) => {
  const api = axios.create({
    baseURL,
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.log(error.response.data.message);
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

// const apiProduct = createAxiosInstance(
//   "https://zybizo-administration-backend-ksc13n7na-jf08ml.vercel.app/api/product"
// );
// const apiProductSale = createAxiosInstance(
//   "https://zybizo-administration-backend-ksc13n7na-jf08ml.vercel.app/api/productSale"
// );
// const apiExpense = createAxiosInstance(
//   "https://zybizo-administration-backend-ksc13n7na-jf08ml.vercel.app/api/expense"
// );
const apiAuth = createAxiosInstance("http://localhost:5000/api/auth");
const apiProduct = createAxiosInstance("http://localhost:5000/api/product");
const apiProductSale = createAxiosInstance(
  "http://localhost:5000/api/productSale"
);
const apiExpense = createAxiosInstance("http://localhost:5000/api/expense");

export { apiAuth, apiProduct, apiProductSale, apiExpense };
