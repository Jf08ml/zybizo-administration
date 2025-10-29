import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategory,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  getCategoryHierarchy,
  reorderCategories,
  getCategoryStats
} from "../controllers/categoryController.js";

const router = Router();

// Rutas públicas (no requieren autenticación)
router.get("/categories", getCategories);
router.get("/categories/tree", getCategories); // Con query param tree=true
router.get("/categories/slug/:slug", getCategoryBySlug);
router.get("/categories/:id", getCategory);
router.get("/categories/:id/hierarchy", getCategoryHierarchy);

// CRUD de categorías (temporalmente públicas para pruebas)
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Operaciones especiales (temporalmente públicas para pruebas)
router.patch("/categories/reorder", reorderCategories);
router.get("/categories-stats", getCategoryStats);

// Rutas protegidas (requieren autenticación) - comentadas temporalmente
// router.use(authenticateToken);

export default router;