import Expense from "../models/expense.js";

async function createExpense(req, res) {
  const spent = req.body.spent;
  try {
    const expense = new Expense(spent);
    await expense.save();
    res.status(200).json({ message: "Expense saved successfully", expense });
  } catch (error) {
    res.status(500).json({ message: "Error saving expense", error });
  }
}

async function getExpenses(req, res) {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
}

export { createExpense, getExpenses };
