import { PrismaClient, Role, IncomeCategory, ExpenseCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.income.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.member.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const treasurerPassword = await bcrypt.hash('treasurer123', 10);
  const memberPassword = await bcrypt.hash('member123', 10);

  const admin = await prisma.user.create({
    data: { email: 'admin@easychurch.com', password: adminPassword, name: 'Admin User', role: Role.ADMIN },
  });

  const treasurer = await prisma.user.create({
    data: { email: 'treasurer@easychurch.com', password: treasurerPassword, name: 'Treasurer User', role: Role.TREASURER },
  });

  await prisma.user.create({
    data: { email: 'member@easychurch.com', password: memberPassword, name: 'Member User', role: Role.MEMBER },
  });

  // Create members
  await prisma.member.createMany({
    data: [
      { name: 'John Doe', email: 'john@example.com', phone: '+1234567890', address: '123 Main St', role: Role.MEMBER, joinedDate: new Date('2024-01-15') },
      { name: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891', address: '456 Oak Ave', role: Role.TREASURER, joinedDate: new Date('2023-06-20') },
      { name: 'Bob Johnson', email: 'bob@example.com', phone: '+1234567892', address: '789 Pine Rd', role: Role.MEMBER, joinedDate: new Date('2024-03-10') },
      { name: 'Alice Williams', email: 'alice@example.com', phone: '+1234567893', address: '321 Elm St', role: Role.MEMBER, joinedDate: new Date('2023-11-05') },
      { name: 'Charlie Brown', email: 'charlie@example.com', phone: '+1234567894', address: '654 Maple Dr', role: Role.MEMBER, joinedDate: new Date('2024-02-28') },
    ],
  });

  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Create income records
  const incomeData = [
    { amount: 5000, category: IncomeCategory.TITHES, description: 'Sunday tithes collection', date: new Date(now.getFullYear(), now.getMonth(), 5), createdById: admin.id },
    { amount: 3200, category: IncomeCategory.OFFERINGS, description: 'Weekly offerings', date: new Date(now.getFullYear(), now.getMonth(), 7), createdById: treasurer.id },
    { amount: 2500, category: IncomeCategory.DONATIONS, description: 'Anonymous donation', date: new Date(now.getFullYear(), now.getMonth(), 10), createdById: admin.id },
    { amount: 1800, category: IncomeCategory.EVENTS, description: 'Annual fundraising event', date: new Date(now.getFullYear(), now.getMonth(), 12), createdById: treasurer.id },
    { amount: 4200, category: IncomeCategory.TITHES, description: 'Mid-month tithes', date: new Date(now.getFullYear(), now.getMonth(), 15), createdById: admin.id },
    { amount: 1500, category: IncomeCategory.OFFERINGS, description: 'Special service offering', date: new Date(now.getFullYear(), now.getMonth(), 18), createdById: treasurer.id },
    // Last month
    { amount: 4800, category: IncomeCategory.TITHES, description: 'Monthly tithes', date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 5), createdById: admin.id },
    { amount: 2900, category: IncomeCategory.OFFERINGS, description: 'Weekly offerings', date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 10), createdById: treasurer.id },
    { amount: 3100, category: IncomeCategory.DONATIONS, description: 'Community donations', date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 15), createdById: admin.id },
    { amount: 1200, category: IncomeCategory.EVENTS, description: 'Christmas celebration', date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 20), createdById: treasurer.id },
  ];

  await prisma.income.createMany({ data: incomeData });

  // Create expense records
  const expenseData = [
    { amount: 1200, category: ExpenseCategory.UTILITIES, description: 'Monthly electricity bill', date: new Date(now.getFullYear(), now.getMonth(), 3), createdById: admin.id },
    { amount: 800, category: ExpenseCategory.UTILITIES, description: 'Water and gas bills', date: new Date(now.getFullYear(), now.getMonth(), 5), createdById: treasurer.id },
    { amount: 2500, category: ExpenseCategory.SALARIES, description: 'Staff salaries', date: new Date(now.getFullYear(), now.getMonth(), 8), createdById: admin.id },
    { amount: 600, category: ExpenseCategory.MAINTENANCE, description: 'Building maintenance', date: new Date(now.getFullYear(), now.getMonth(), 11), createdById: treasurer.id },
    { amount: 1500, category: ExpenseCategory.EVENTS, description: 'Youth event expenses', date: new Date(now.getFullYear(), now.getMonth(), 14), createdById: admin.id },
    // Last month
    { amount: 1100, category: ExpenseCategory.UTILITIES, description: 'Electricity bill', date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 4), createdById: admin.id },
    { amount: 2500, category: ExpenseCategory.SALARIES, description: 'Monthly salaries', date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 8), createdById: treasurer.id },
    { amount: 900, category: ExpenseCategory.MAINTENANCE, description: 'Roof repair', date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 12), createdById: admin.id },
    { amount: 750, category: ExpenseCategory.EVENTS, description: 'Community outreach event', date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 18), createdById: treasurer.id },
    { amount: 450, category: ExpenseCategory.UTILITIES, description: 'Internet service', date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 22), createdById: admin.id },
  ];

  await prisma.expense.createMany({ data: expenseData });

  console.log('✅ Database seeded successfully!');
  console.log('\nDefault accounts:');
  console.log('  Admin:     admin@easychurch.com / admin123');
  console.log('  Treasurer: treasurer@easychurch.com / treasurer123');
  console.log('  Member:    member@easychurch.com / member123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
