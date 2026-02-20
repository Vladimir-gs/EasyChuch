import { PrismaClient, Role } from '@prisma/client';
import { AppError } from '../middlewares/error.middleware';

const prisma = new PrismaClient();

export const getMembers = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.member.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.member.count(),
  ]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const createMember = async (
  name: string,
  email: string,
  phone?: string,
  address?: string,
  role?: Role,
  joinedDate?: string
) => {
  const existing = await prisma.member.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already in use', 400);

  return prisma.member.create({
    data: { name, email, phone, address, role: role || Role.MEMBER, joinedDate: joinedDate ? new Date(joinedDate) : new Date() },
  });
};

export const updateMember = async (
  id: string,
  name: string,
  email: string,
  phone?: string,
  address?: string,
  role?: Role,
  joinedDate?: string
) => {
  const existing = await prisma.member.findUnique({ where: { id } });
  if (!existing) throw new AppError('Member not found', 404);

  return prisma.member.update({
    where: { id },
    data: { name, email, phone, address, role: role || Role.MEMBER, joinedDate: joinedDate ? new Date(joinedDate) : undefined },
  });
};

export const deleteMember = async (id: string) => {
  const existing = await prisma.member.findUnique({ where: { id } });
  if (!existing) throw new AppError('Member not found', 404);
  await prisma.member.delete({ where: { id } });
};
