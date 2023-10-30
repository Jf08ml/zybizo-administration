import { Router } from "express";

const router = Router();

import { createProduct, getProducts } from "../controllers/productController";

router.post("/addProduct", createProduct);
router.get("/getProducts", getProducts);
export default router;
