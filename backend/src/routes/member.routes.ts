import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { listMembers, createMember, updateMember, deleteMember, memberValidation } from '../controllers/member.controller';

const router = Router();

router.use(authenticate);
router.get('/', listMembers);
router.post('/', authorize('ADMIN'), memberValidation, createMember);
router.put('/:id', authorize('ADMIN'), memberValidation, updateMember);
router.delete('/:id', authorize('ADMIN'), deleteMember);

export default router;
