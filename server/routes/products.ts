import express from 'express';
const router = express.Router();
import * as productController from '../controllers/productController.js';
import authMiddleware from '../middleware/auth.js';

// Public routes
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);
router.get('/:id/reviews', productController.getProductReviews);

// Protected routes
router.post('/', authMiddleware, productController.createProduct);
router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);
router.post('/:id/reviews', authMiddleware, productController.addReview);
router.get('/seller/products', authMiddleware, productController.getSellerProducts);

export default router;
