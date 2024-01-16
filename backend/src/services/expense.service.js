import Expense from "../models/expense.js";
import CustomErrors from "../errors/CustomErrors.js";

const { DatabaseError, NotFoundError, ValidationError } = CustomErrors;

class ExpenseService {
  async createExpense(data) {
    try {
      const newExpense = new Expense(data);
      return await newExpense.save();
    } catch (error) {
      throw new DatabaseError("Error al crear el gasto");
    }
  }

  async getExpenses() {
    try {
      return await Expense.find({});
    } catch (error) {
      throw new DatabaseError("Error al obtener los gastos");
    }
  }

  async updateExpense(expenseId, updateData) {
    try {
      const updatedExpense = await Expense.findByIdAndUpdate(
        expenseId,
        updateData,
        {
          new: true,
        }
      );
      if (!updatedExpense) {
        throw new NotFoundError("Gasto no encontrado para actualizar");
      }
      return updatedExpense;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error al actualizar el gasto");
    }
  }

  async deleteExpense(expenseId) {
    try {
      const deleteExpense = await Expense.findByIdAndDelete(expenseId);
      if (!deleteExpense) {
        throw new NotFoundError("Gasto no encontrado para eliminar");
      }
      return deleteExpense;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Error al eliminar el gasto");
    }
  }
}

export default new ExpenseService();
