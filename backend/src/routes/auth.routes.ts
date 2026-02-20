import { Router } from 'express';
import { register, login, me, registerValidation, loginValidation } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, me);

export default router;
