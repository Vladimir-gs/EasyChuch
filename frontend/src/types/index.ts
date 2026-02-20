export type Role = 'ADMIN' | 'TREASURER' | 'MEMBER';

export type IncomeCategory = 'TITHES' | 'OFFERINGS' | 'DONATIONS' | 'EVENTS';
export type ExpenseCategory = 'UTILITIES' | 'MAINTENANCE' | 'SALARIES' | 'EVENTS';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: Role;
  joinedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Income {
  id: string;
  amount: number;
  category: IncomeCategory;
  description?: string;
  date: string;
  createdById: string;
  createdBy: { name: string };
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description?: string;
  date: string;
  createdById: string;
  createdBy: { name: string };
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  monthlyData: Array<{ month: string; income: number; expenses: number }>;
  recentTransactions: Array<(Income | Expense) & { type: 'income' | 'expense' }>;
}

export interface MonthlyReport {
  year: number;
  month: number;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  incomes: Income[];
  expenses: Expense[];
}

export interface AuthResponse {
  user: User;
  token: string;
}
