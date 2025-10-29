import { Router } from "express";

const router = Router();

import { createProductSale, getProductsSale, handleReturn } from "../controllers/productSaleController.js";

router.post("/addProductSale", createProductSale);
router.get("/getProductsSale", getProductsSale);
router.put('/sales/:id/return', handleReturn);
export default router;
