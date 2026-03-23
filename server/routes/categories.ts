import express from 'express';
const router = express.Router();
import * as categoryController from '../controllers/categoryController.js';
import authMiddleware from '../middleware/auth.js';

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes (only admins can create categories)
router.post('/', authMiddleware, categoryController.createCategory);

export default router;
