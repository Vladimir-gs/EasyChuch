import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as dashboardService from '../services/dashboard.service';

export const getSummary = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };
    const data = await dashboardService.getSummary(startDate, endDate);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
