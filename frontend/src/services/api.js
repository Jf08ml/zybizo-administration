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

const apiAuth = createAxiosInstance(
  "https://api.zybizobazar.com/api/auth"
);
const apiProduct = createAxiosInstance(
  "https://api.zybizobazar.com/api/product"
);
const apiProductSale = createAxiosInstance(
  "https://api.zybizobazar.com/api/productSale"
);
const apiExpense = createAxiosInstance(
  "https://api.zybizobazar.com/api/expense"
);
const apiRewards = createAxiosInstance(
  "https://api.zybizobazar.com/api/rewards"
);

// const apiAuth = createAxiosInstance("http://localhost:5000/api/auth");
// const apiProduct = createAxiosInstance("http://localhost:5000/api/product");
// const apiProductSale = createAxiosInstance(
//   "http://localhost:5000/api/productSale"
// );
// const apiExpense = createAxiosInstance("http://localhost:5000/api/expense");
// const apiRewards = createAxiosInstance("http://localhost:5000/api/rewards");

export { apiAuth, apiProduct, apiProductSale, apiExpense, apiRewards };
