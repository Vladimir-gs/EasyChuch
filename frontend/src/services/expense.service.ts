import api from './api';
import { Expense, PaginatedResponse } from '../types';

export const expenseService = {
  async list(params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    category?: string;
  }): Promise<PaginatedResponse<Expense>> {
    const { data } = await api.get<PaginatedResponse<Expense>>('/expenses', { params });
    return data;
  },

  async create(payload: {
    amount: number;
    category: string;
    description?: string;
    date: string;
  }): Promise<Expense> {
    const { data } = await api.post<Expense>('/expenses', payload);
    return data;
  },

  async update(
    id: string,
    payload: { amount: number; category: string; description?: string; date: string }
  ): Promise<Expense> {
    const { data } = await api.put<Expense>(`/expenses/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/expenses/${id}`);
  },
};
