import api from './api';
import { Member, PaginatedResponse } from '../types';

export const memberService = {
  async list(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Member>> {
    const { data } = await api.get<PaginatedResponse<Member>>('/members', { params });
    return data;
  },

  async create(payload: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    role?: string;
    joinedDate?: string;
  }): Promise<Member> {
    const { data } = await api.post<Member>('/members', payload);
    return data;
  },

  async update(
    id: string,
    payload: { name: string; email: string; phone?: string; address?: string; role?: string; joinedDate?: string }
  ): Promise<Member> {
    const { data } = await api.put<Member>(`/members/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/members/${id}`);
  },
};
