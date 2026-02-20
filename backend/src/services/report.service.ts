import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMonthlyReport = async (year: number, month: number) => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);

  const [incomes, expenses] = await Promise.all([
    prisma.income.findMany({
      where: { date: { gte: startOfMonth, lte: endOfMonth } },
      include: { createdBy: { select: { name: true } } },
      orderBy: { date: 'asc' },
    }),
    prisma.expense.findMany({
      where: { date: { gte: startOfMonth, lte: endOfMonth } },
      include: { createdBy: { select: { name: true } } },
      orderBy: { date: 'asc' },
    }),
  ]);

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  return { year, month, totalIncome, totalExpenses, netBalance, incomes, expenses };
};

export const exportReport = async (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const [incomes, expenses] = await Promise.all([
    prisma.income.findMany({
      where: { date: { gte: start, lte: end } },
      include: { createdBy: { select: { name: true } } },
      orderBy: { date: 'asc' },
    }),
    prisma.expense.findMany({
      where: { date: { gte: start, lte: end } },
      include: { createdBy: { select: { name: true } } },
      orderBy: { date: 'asc' },
    }),
  ]);

  const rows: string[] = ['Type,Date,Category,Amount,Description,Created By'];

  incomes.forEach((i) => {
    rows.push(`Income,${i.date.toISOString().split('T')[0]},${i.category},${i.amount},"${i.description || ''}",${i.createdBy.name}`);
  });

  expenses.forEach((e) => {
    rows.push(`Expense,${e.date.toISOString().split('T')[0]},${e.category},${e.amount},"${e.description || ''}",${e.createdBy.name}`);
  });

  return rows.join('\n');
};
