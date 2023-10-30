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

const apiProduct = createAxiosInstance("http://localhost:5000/api/product");
const apiProductSale = createAxiosInstance(
  "http://localhost:5000/api/productSale"
);

export { apiProduct, apiProductSale };
