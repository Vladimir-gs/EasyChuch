import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getSummary } from '../controllers/dashboard.controller';

const router = Router();

router.get('/summary', authenticate, getSummary);

export default router;
