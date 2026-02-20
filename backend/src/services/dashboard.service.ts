import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSummary = async (startDate?: string, endDate?: string) => {
  const where: { date?: { gte?: Date; lte?: Date } } = {};

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const [incomeResult, expenseResult, recentIncomes, recentExpenses] = await Promise.all([
    prisma.income.aggregate({ _sum: { amount: true }, where }),
    prisma.expense.aggregate({ _sum: { amount: true }, where }),
    prisma.income.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: { createdBy: { select: { name: true } } },
    }),
    prisma.expense.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: { createdBy: { select: { name: true } } },
    }),
  ]);

  const totalIncome = incomeResult._sum.amount || 0;
  const totalExpenses = expenseResult._sum.amount || 0;
  const netBalance = totalIncome - totalExpenses;

  // Monthly chart data for the last 6 months
  const monthlyData = await getMonthlyChartData();

  const recentTransactions = [
    ...recentIncomes.map((i) => ({ ...i, type: 'income' as const })),
    ...recentExpenses.map((e) => ({ ...e, type: 'expense' as const })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return { totalIncome, totalExpenses, netBalance, monthlyData, recentTransactions };
};

const getMonthlyChartData = async () => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const [incomeResult, expenseResult] = await Promise.all([
      prisma.income.aggregate({
        _sum: { amount: true },
        where: { date: { gte: startOfMonth, lte: endOfMonth } },
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: { date: { gte: startOfMonth, lte: endOfMonth } },
      }),
    ]);

    months.push({
      month: `${year}-${String(month).padStart(2, '0')}`,
      income: incomeResult._sum.amount || 0,
      expenses: expenseResult._sum.amount || 0,
    });
  }
  return months;
};
