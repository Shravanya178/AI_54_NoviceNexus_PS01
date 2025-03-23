// routes/auth.js
import express from 'express';
import { 
  register, 
  login, 
  verifyEmail, 
  forgotPassword, 
  resetPassword, 
  logout, 
  getMe 
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;
