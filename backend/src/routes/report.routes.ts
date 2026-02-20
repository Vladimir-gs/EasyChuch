import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { getMonthlyReport, exportReport } from '../controllers/report.controller';

const router = Router();

router.use(authenticate, authorize('ADMIN', 'TREASURER'));
router.get('/monthly', getMonthlyReport);
router.get('/export', exportReport);

export default router;
