import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { listExpenses, createExpense, updateExpense, deleteExpense, expenseValidation } from '../controllers/expense.controller';

const router = Router();

router.use(authenticate);
router.get('/', listExpenses);
router.post('/', authorize('ADMIN', 'TREASURER'), expenseValidation, createExpense);
router.put('/:id', authorize('ADMIN', 'TREASURER'), expenseValidation, updateExpense);
router.delete('/:id', authorize('ADMIN', 'TREASURER'), deleteExpense);

export default router;
