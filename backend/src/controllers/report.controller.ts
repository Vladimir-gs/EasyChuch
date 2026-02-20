import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as reportService from '../services/report.service';
import { AppError } from '../middlewares/error.middleware';

export const getMonthlyReport = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const year = parseInt(req.query.year as string);
    const month = parseInt(req.query.month as string);

    if (!year || !month || month < 1 || month > 12) {
      throw new AppError('Valid year and month (1-12) are required', 400);
    }

    const report = await reportService.getMonthlyReport(year, month);
    res.json(report);
  } catch (err) {
    next(err);
  }
};

export const exportReport = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };

    if (!startDate || !endDate) {
      throw new AppError('startDate and endDate are required', 400);
    }

    const csv = await reportService.exportReport(startDate, endDate);
    // Sanitize date strings to prevent header injection (allow only date characters)
    const safeStart = startDate.replace(/[^0-9\-]/g, '');
    const safeEnd = endDate.replace(/[^0-9\-]/g, '');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="easychurch-report-${safeStart}-${safeEnd}.csv"`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
