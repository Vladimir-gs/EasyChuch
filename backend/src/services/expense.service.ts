import { PrismaClient, ExpenseCategory } from '@prisma/client';
import { AppError } from '../middlewares/error.middleware';

const prisma = new PrismaClient();

export const getExpenses = async (
  page: number,
  limit: number,
  startDate?: string,
  endDate?: string,
  category?: string
) => {
  const skip = (page - 1) * limit;
  const where: {
    date?: { gte?: Date; lte?: Date };
    category?: ExpenseCategory;
  } = {};

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  if (category && Object.values(ExpenseCategory).includes(category as ExpenseCategory)) {
    where.category = category as ExpenseCategory;
  }

  const [data, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: 'desc' },
      include: { createdBy: { select: { name: true } } },
    }),
    prisma.expense.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const createExpense = async (
  amount: number,
  category: ExpenseCategory,
  description: string | undefined,
  date: string,
  createdById: string
) => {
  return prisma.expense.create({
    data: { amount, category, description, date: new Date(date), createdById },
    include: { createdBy: { select: { name: true } } },
  });
};

export const updateExpense = async (
  id: string,
  amount: number,
  category: ExpenseCategory,
  description: string | undefined,
  date: string
) => {
  const existing = await prisma.expense.findUnique({ where: { id } });
  if (!existing) throw new AppError('Expense record not found', 404);

  return prisma.expense.update({
    where: { id },
    data: { amount, category, description, date: new Date(date) },
    include: { createdBy: { select: { name: true } } },
  });
};

export const deleteExpense = async (id: string) => {
  const existing = await prisma.expense.findUnique({ where: { id } });
  if (!existing) throw new AppError('Expense record not found', 404);
  await prisma.expense.delete({ where: { id } });
};
