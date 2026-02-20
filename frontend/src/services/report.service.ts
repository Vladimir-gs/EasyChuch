import api from './api';
import { MonthlyReport } from '../types';

export const reportService = {
  async monthly(year: number, month: number): Promise<MonthlyReport> {
    const { data } = await api.get<MonthlyReport>('/reports/monthly', { params: { year, month } });
    return data;
  },

  async exportCsv(startDate: string, endDate: string): Promise<Blob> {
    const { data } = await api.get('/reports/export', {
      params: { startDate, endDate },
      responseType: 'blob',
    });
    return data;
  },
};
