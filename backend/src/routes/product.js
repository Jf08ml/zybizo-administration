import { Router } from "express";

const router = Router();

import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

router.post("/addProduct", createProduct);
router.get("/products", getProducts);
router.put("/products/:id", updateProduct);
router.delete("/productRemove/:id", deleteProduct);
export default router;
