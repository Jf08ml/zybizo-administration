import { Router } from "express";
import orderController from "../controllers/orderController.js";
// import { verifyToken } from "../middleware/auth.js";

const router = Router();

// POS Routes - Sistema de punto de venta
router.post("/", orderController.createOrder);
router.get("/", orderController.getOrders);
router.get("/today", orderController.getTodaysOrders);
router.get("/dashboard", orderController.getPOSDashboard);
router.get("/stats", orderController.getSalesStats);
router.get("/:id", orderController.getOrder);

// Order Management
router.patch("/:id/status", orderController.updateOrderStatus);
router.patch("/:id/cancel", orderController.cancelOrder);

export default router;
