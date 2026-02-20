import { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { AuthRequest } from '../middlewares/auth.middleware';
import { handleValidationErrors } from '../middlewares/validation.middleware';
import * as memberService from '../services/member.service';
import { Role } from '@prisma/client';

export const memberValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  handleValidationErrors,
];

export const listMembers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await memberService.getMembers(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const createMember = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, phone, address, role, joinedDate } = req.body;
    const member = await memberService.createMember(name, email, phone, address, role as Role, joinedDate);
    res.status(201).json(member);
  } catch (err) {
    next(err);
  }
};

export const updateMember = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, role, joinedDate } = req.body;
    const member = await memberService.updateMember(id, name, email, phone, address, role as Role, joinedDate);
    res.json(member);
  } catch (err) {
    next(err);
  }
};

export const deleteMember = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await memberService.deleteMember(id);
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    next(err);
  }
};
