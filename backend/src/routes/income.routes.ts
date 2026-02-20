import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { listIncomes, createIncome, updateIncome, deleteIncome, incomeValidation } from '../controllers/income.controller';

const router = Router();

router.use(authenticate);
router.get('/', listIncomes);
router.post('/', authorize('ADMIN', 'TREASURER'), incomeValidation, createIncome);
router.put('/:id', authorize('ADMIN', 'TREASURER'), incomeValidation, updateIncome);
router.delete('/:id', authorize('ADMIN', 'TREASURER'), deleteIncome);

export default router;
