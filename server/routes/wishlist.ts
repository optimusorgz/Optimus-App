import express from 'express';
const router = express.Router();
import * as wishlistController from '../controllers/wishlistController.js';
import authMiddleware from '../middleware/auth.js';

// All wishlist operations require authentication
router.get('/', authMiddleware, wishlistController.getWishlist);
router.post('/', authMiddleware, wishlistController.addToWishlist);
router.delete('/:product_id', authMiddleware, wishlistController.removeFromWishlist);
router.get('/:product_id/check', authMiddleware, wishlistController.isInWishlist);

export default router;
