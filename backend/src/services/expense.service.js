import Expense from "../models/expense.js";

class ExpenseService {
  async createExpense(data) {
    try {
      const newExpense = new Expense(data);
      return await newExpense.save();
    } catch (error) {
      throw error;
    }
  }

  async getExpenses() {
    try {
      return await Expense.find({});
    } catch (error) {
      throw error;
    }
  }

  async updateExpense(expenseId, updateData) {
    try {
      return await Expense.findByIdAndUpdate(expenseId, updateData, {
        new: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteExpense(expenseId) {
    try {
      return await Expense.findByIdAndDelete(expenseId);
    } catch (error) {
      throw error;
    }
  }
}

export default new ExpenseService();
