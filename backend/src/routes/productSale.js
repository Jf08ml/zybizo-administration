import { Router } from "express";

const router = Router();

import { createProductSale, getProductsSale } from "../controllers/productSaleController";

router.post("/addProductSale", createProductSale);
router.get("/getProductsSale", getProductsSale);
export default router;
