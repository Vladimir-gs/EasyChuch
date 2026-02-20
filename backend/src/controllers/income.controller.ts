import { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { AuthRequest } from '../middlewares/auth.middleware';
import { handleValidationErrors } from '../middlewares/validation.middleware';
import * as incomeService from '../services/income.service';
import { IncomeCategory } from '@prisma/client';

export const incomeValidation = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('category').isIn(Object.values(IncomeCategory)).withMessage('Invalid category'),
  body('date').isISO8601().withMessage('Valid date is required'),
  handleValidationErrors,
];

export const listIncomes = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { startDate, endDate, category } = req.query as {
      startDate?: string;
      endDate?: string;
      category?: string;
    };
    const result = await incomeService.getIncomes(page, limit, startDate, endDate, category);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const createIncome = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { amount, category, description, date } = req.body;
    const income = await incomeService.createIncome(amount, category, description, date, req.user!.id);
    res.status(201).json(income);
  } catch (err) {
    next(err);
  }
};

export const updateIncome = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount, category, description, date } = req.body;
    const income = await incomeService.updateIncome(id, amount, category, description, date);
    res.json(income);
  } catch (err) {
    next(err);
  }
};

export const deleteIncome = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await incomeService.deleteIncome(id);
    res.json({ message: 'Income deleted successfully' });
  } catch (err) {
    next(err);
  }
};
