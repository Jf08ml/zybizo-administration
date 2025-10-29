import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  getProductsCatalog,
  updateProduct,
  updateStock,
  deleteProduct,
  getProductStats,
  getLowStockProducts,
  getProductsByCategory,
} from "../controllers/productController.js";
import verifyToken from "../middleware/auth.js";

const router = Router();

// Rutas públicas (no requieren autenticación)
router.get("/productsCatalog", getProductsCatalog);
router.get("/productDetail/:id", getProduct);

// Rutas protegidas específicas (comentadas temporalmente para desarrollo)
router.get("/products/stats", /* verifyToken, */ getProductStats);
router.get("/products/lowStock", /* verifyToken, */ getLowStockProducts);
router.get("/products/category/:categoryId", /* verifyToken, */ getProductsByCategory);

// Middleware de autenticación para las rutas restantes (comentado temporalmente para desarrollo)
// router.use(verifyToken);

// CRUD de productos
router.post("/addProduct", createProduct);
router.get("/products", getProducts);
router.put("/products/:id", updateProduct);
router.delete("/productRemove/:id", deleteProduct);

// Gestión de stock
router.patch("/products/:id/stock", updateStock);

export default router;
