import express from 'express';
const router = express.Router();
import * as orderController from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

// Protected routes (all order operations require authentication)
router.post('/', authMiddleware, orderController.createOrder);
router.get('/buyer/orders', authMiddleware, orderController.getBuyerOrders);
router.get('/seller/orders', authMiddleware, orderController.getSellerOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id/status', authMiddleware, orderController.updateOrderStatus);
router.put('/:id/cancel', authMiddleware, orderController.cancelOrder);

export default router;
