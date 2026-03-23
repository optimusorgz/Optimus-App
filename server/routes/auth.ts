import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-token', authController.verifyToken);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);

export default router;
