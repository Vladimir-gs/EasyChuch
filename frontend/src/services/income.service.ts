import api from './api';
import { Income, PaginatedResponse } from '../types';

export const incomeService = {
  async list(params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    category?: string;
  }): Promise<PaginatedResponse<Income>> {
    const { data } = await api.get<PaginatedResponse<Income>>('/income', { params });
    return data;
  },

  async create(payload: {
    amount: number;
    category: string;
    description?: string;
    date: string;
  }): Promise<Income> {
    const { data } = await api.post<Income>('/income', payload);
    return data;
  },

  async update(
    id: string,
    payload: { amount: number; category: string; description?: string; date: string }
  ): Promise<Income> {
    const { data } = await api.put<Income>(`/income/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/income/${id}`);
  },
};
