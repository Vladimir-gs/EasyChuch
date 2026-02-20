import { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { AuthRequest } from '../middlewares/auth.middleware';
import { handleValidationErrors } from '../middlewares/validation.middleware';
import * as expenseService from '../services/expense.service';
import { ExpenseCategory } from '@prisma/client';

export const expenseValidation = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('category').isIn(Object.values(ExpenseCategory)).withMessage('Invalid category'),
  body('date').isISO8601().withMessage('Valid date is required'),
  handleValidationErrors,
];

export const listExpenses = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { startDate, endDate, category } = req.query as {
      startDate?: string;
      endDate?: string;
      category?: string;
    };
    const result = await expenseService.getExpenses(page, limit, startDate, endDate, category);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const createExpense = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { amount, category, description, date } = req.body;
    const expense = await expenseService.createExpense(amount, category, description, date, req.user!.id);
    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
};

export const updateExpense = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount, category, description, date } = req.body;
    const expense = await expenseService.updateExpense(id, amount, category, description, date);
    res.json(expense);
  } catch (err) {
    next(err);
  }
};

export const deleteExpense = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await expenseService.deleteExpense(id);
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    next(err);
  }
};
