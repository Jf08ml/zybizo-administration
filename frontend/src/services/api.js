import axios from "axios";

const createAxiosInstance = (baseURL) => {
  const api = axios.create({
    baseURL,
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.log(error.response.data.message);
      throw error;
    }
  );

  return api;
};

const apiProduct = createAxiosInstance(
  "https://zybizo-administration-backend-d2ngwsnq3-jf08ml.vercel.app/api/product"
);
const apiProductSale = createAxiosInstance(
  "https://zybizo-administration-backend-d2ngwsnq3-jf08ml.vercel.app/api/productSale"
);
// const apiProduct = createAxiosInstance("http://localhost:5000/api/product");
// const apiProductSale = createAxiosInstance(
//   "http://localhost:5000/api/productSale"
// );

export { apiProduct, apiProductSale };
