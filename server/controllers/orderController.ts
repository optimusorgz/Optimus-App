import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { Request, Response } from 'express';

interface AuthRequest extends Request {
    user?: { id: number; role: string; email: string };
}

export const createOrder = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { items, delivery_address, delivery_city, delivery_state, delivery_zipcode, seller_id } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order must contain at least one item' });
        }

        if (!delivery_address || !delivery_city || !delivery_state || !delivery_zipcode) {
            return res.status(400).json({ message: 'Please provide complete delivery address' });
        }

        let totalAmount = 0;
        const itemDetails: any[] = [];

        // Calculate total and validate items
        for (const item of items) {
            const productId = parseInt(item.product_id, 10);
            const product = await Product.getById(productId);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.product_id} not found` });
            }

            if (product.stockQuantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.title}` });
            }

            totalAmount += Number(product.price) * item.quantity;
            itemDetails.push({
                product_id: productId,
                quantity: item.quantity,
                price_at_purchase: product.price,
                seller_id: product.sellerId
            });
        }

        // Create order
        const sellerId = seller_id ? parseInt(seller_id, 10) : itemDetails[0].seller_id;
        const order = await Order.create({
            buyer_id: req.user.id,
            seller_id: sellerId,
            total_amount: totalAmount,
            delivery_address,
            delivery_city,
            delivery_state,
            delivery_zipcode
        });

        // Add items to order
        for (const item of itemDetails) {
            await Order.addOrderItem({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price_at_purchase: item.price_at_purchase
            });
        }

        const fullOrder = await Order.getById(order.id);

        res.status(201).json({
            message: 'Order created successfully',
            order: fullOrder
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: (error as Error).message });
    }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { id } = req.params;
        const orderId = parseInt(id, 10);

        const order = await Order.getById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is buyer or seller of this order
        if (order.buyerId !== req.user.id && order.sellerId !== req.user.id) {
            return res.status(403).json({ message: 'You do not have access to this order' });
        }

        res.json({
            message: 'Order fetched successfully',
            order
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: (error as Error).message });
    }
};

export const getBuyerOrders = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { limit = '20', offset = '0' } = req.query as any;
        const limitNum = parseInt(limit as string, 10) || 20;
        const offsetNum = parseInt(offset as string, 10) || 0;

        const orders = await Order.getByBuyerId(req.user.id, limitNum, offsetNum);

        res.json({
            message: 'Buyer orders fetched successfully',
            orders,
            count: orders.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: (error as Error).message });
    }
};

export const getSellerOrders = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (req.user.role !== 'company_seller' && req.user.role !== 'student_seller') {
            return res.status(403).json({ message: 'Only sellers can view orders' });
        }

        const { limit = '20', offset = '0' } = req.query as any;
        const limitNum = parseInt(limit as string, 10) || 20;
        const offsetNum = parseInt(offset as string, 10) || 0;

        const orders = await Order.getBySellerId(req.user.id, limitNum, offsetNum);

        res.json({
            message: 'Seller orders fetched successfully',
            orders,
            count: orders.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: (error as Error).message });
    }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { id } = req.params;
        const orderId = parseInt(id, 10);
        const { status } = req.body;

        if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const order = await Order.getById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Only seller or admin can update status
        if (order.sellerId !== req.user.id) {
            return res.status(403).json({ message: 'You can only update your own orders' });
        }

        const updatedOrder = await Order.updateStatus(orderId, status);

        res.json({
            message: 'Order status updated successfully',
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: (error as Error).message });
    }
};

export const cancelOrder = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { id } = req.params;
        const orderId = parseInt(id, 10);

        const order = await Order.getById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.buyerId !== req.user.id) {
            return res.status(403).json({ message: 'You can only cancel your own orders' });
        }

        if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
            return res.status(400).json({ message: 'Cannot cancel order with status: ' + order.status });
        }

        const cancelledOrder = await Order.updateStatus(orderId, 'cancelled');

        res.json({
            message: 'Order cancelled successfully',
            order: cancelledOrder
        });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling order', error: (error as Error).message });
    }
};
