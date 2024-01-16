import expenseService from "../services/expense.service.js";

async function createExpense(req, res) {
  try {
    const newExpense = await expenseService.createExpense(req.body.spent);
    res.status(201).json({
      status: "success",
      data: newExpense,
      message: "Gasto creado exitosamente.",
    });
  } catch (error) {
    next(error);
  }
}

async function getExpenses(req, res) {
  try {
    const expenses = await expenseService.getExpenses();
    res.status(200).json({
      status: "success",
      data: expenses,
      message:
      expenses.length > 0
          ? "Gastos encontrados."
          : "No se encontraron gastos.",
    });
  } catch (error) {
    next(error);
  }
}

export { createExpense, getExpenses };
