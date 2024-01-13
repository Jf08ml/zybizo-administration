import Expense from "../models/expense.js";
import expenseService from "../services/expense.service.js";

async function createExpense(req, res) {
  try {
    const response = expenseService.createExpense(req.body.spent);
    res.status(200).json({ message: "Expense saved successfully", response });
  } catch (error) {
    res.status(500).json({ message: "Error saving expense", error });
  }
}

async function getExpenses(req, res) {
  try {
    const expenses = await expenseService.getExpenses();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
}

export { createExpense, getExpenses };
