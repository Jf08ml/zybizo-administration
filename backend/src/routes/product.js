import { Router } from "express";

const router = Router();

import {
  createProduct,
  getProducts,
  getProduct,
  getProductsCatalog,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

router.post("/addProduct", createProduct);
router.get("/products", getProducts);
router.get("/productDetail/:id", getProduct);
router.get("/productsCatalog", getProductsCatalog);
router.put("/products/:id", updateProduct);
router.delete("/productRemove/:id", deleteProduct);
export default router;
