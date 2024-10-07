import { Router } from 'express';
import { sendPasswordReset, resetPassword } from '../controllers/password.controller.js';

const router = Router();


router.post('/forgot-password', sendPasswordReset);

router.post('/reset-password/:token', resetPassword);

export default router;
