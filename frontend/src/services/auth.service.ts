import api from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },

  async register(email: string, password: string, name: string, role?: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', { email, password, name, role });
    return data;
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },
};
