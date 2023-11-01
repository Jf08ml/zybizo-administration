import { Router } from "express";
import { createExpense, getExpenses } from '../controllers/expenseController.js';

const router = Router();

router.post("/spent", createExpense);
router.get("/expenses", getExpenses);

export default router;
