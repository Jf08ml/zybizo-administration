import expenseService from "../services/expense.service.js";
import sendResponse from "../utils/response.js";

async function createExpense(req, res) {
  try {
    const newExpense = await expenseService.createExpense(req.body.spent);
    sendResponse(res, 201, newExpense, "Gasto creado exitosamente.");
  } catch (error) {
    next(error);
  }
}

async function getExpenses(req, res, next) {
  try {
    const expenses = await expenseService.getExpenses();
    sendResponse(
      res,
      200,
      expenses,
      expenses.length > 0 ? "Gastos encontrados." : "No se encontraron gastos."
    );
  } catch (error) {
    next(error);
  }
}

export { createExpense, getExpenses };
