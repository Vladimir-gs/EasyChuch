import { PrismaClient, IncomeCategory } from '@prisma/client';
import { AppError } from '../middlewares/error.middleware';

const prisma = new PrismaClient();

export const getIncomes = async (
  page: number,
  limit: number,
  startDate?: string,
  endDate?: string,
  category?: string
) => {
  const skip = (page - 1) * limit;
  const where: {
    date?: { gte?: Date; lte?: Date };
    category?: IncomeCategory;
  } = {};

  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  if (category && Object.values(IncomeCategory).includes(category as IncomeCategory)) {
    where.category = category as IncomeCategory;
  }

  const [data, total] = await Promise.all([
    prisma.income.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: 'desc' },
      include: { createdBy: { select: { name: true } } },
    }),
    prisma.income.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const createIncome = async (
  amount: number,
  category: IncomeCategory,
  description: string | undefined,
  date: string,
  createdById: string
) => {
  return prisma.income.create({
    data: { amount, category, description, date: new Date(date), createdById },
    include: { createdBy: { select: { name: true } } },
  });
};

export const updateIncome = async (
  id: string,
  amount: number,
  category: IncomeCategory,
  description: string | undefined,
  date: string
) => {
  const existing = await prisma.income.findUnique({ where: { id } });
  if (!existing) throw new AppError('Income record not found', 404);

  return prisma.income.update({
    where: { id },
    data: { amount, category, description, date: new Date(date) },
    include: { createdBy: { select: { name: true } } },
  });
};

export const deleteIncome = async (id: string) => {
  const existing = await prisma.income.findUnique({ where: { id } });
  if (!existing) throw new AppError('Income record not found', 404);
  await prisma.income.delete({ where: { id } });
};
