import { Router } from "express";

const router = Router();

import {
  createOrder,
  getOrders,
  getOrderById,
  getOrderByField,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController";

router.post("/order", createOrder);
router.get("/order/by-field", getOrderByField);
router.get("/order/:id", getOrderById);
router.get("/order", getOrders);
router.put("/order/:id", updateOrder);
router.delete("/order/:id", deleteOrder);

export default router;
