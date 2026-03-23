import prisma from '../config/prisma.js';

interface OrderCreateInput {
    buyer_id: number;
    seller_id: number;
    total_amount: number;
    delivery_address: string;
    delivery_city: string;
    delivery_state: string;
    delivery_zipcode: string;
}

interface OrderItemInput {
    order_id: number;
    product_id: number;
    quantity: number;
    price_at_purchase: number;
}

class Order {
    static async create(orderData: OrderCreateInput): Promise<any> {
        const { buyer_id, seller_id, total_amount, delivery_address, delivery_city, delivery_state, delivery_zipcode } = orderData;

        try {
            return await prisma.order.create({
                data: {
                    buyerId: buyer_id,
                    sellerId: seller_id,
                    totalAmount: total_amount,
                    deliveryAddress: delivery_address,
                    deliveryCity: delivery_city,
                    deliveryState: delivery_state,
                    deliveryZipcode: delivery_zipcode,
                },
            });
        } catch (error) {
            throw new Error(`Error creating order: ${(error as Error).message}`);
        }
    }

    static async addOrderItem(itemData: OrderItemInput): Promise<any> {
        const { order_id, product_id, quantity, price_at_purchase } = itemData;

        try {
            return await prisma.orderItem.create({
                data: {
                    orderId: order_id,
                    productId: product_id,
                    quantity,
                    priceAtPurchase: price_at_purchase,
                },
            });
        } catch (error) {
            throw new Error(`Error adding order item: ${(error as Error).message}`);
        }
    }

    static async getById(orderId: number): Promise<any | null> {
        try {
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    items: {
                        select: {
                            productId: true,
                            quantity: true,
                            priceAtPurchase: true,
                        },
                    },
                },
            });
            return order || null;
        } catch (error) {
            throw new Error(`Error fetching order: ${(error as Error).message}`);
        }
    }

    static async getByBuyerId(buyerId: number, limit: number = 20, offset: number = 0): Promise<any[]> {
        try {
            return await prisma.order.findMany({
                where: { buyerId },
                include: {
                    items: true,
                },
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit,
            });
        } catch (error) {
            throw new Error(`Error fetching buyer orders: ${(error as Error).message}`);
        }
    }

    static async getBySellerId(sellerId: number, limit: number = 20, offset: number = 0): Promise<any[]> {
        try {
            return await prisma.order.findMany({
                where: { sellerId },
                include: {
                    items: true,
                },
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit,
            });
        } catch (error) {
            throw new Error(`Error fetching seller orders: ${(error as Error).message}`);
        }
    }

    static async updateStatus(orderId: number, status: string): Promise<any> {
        try {
            return await prisma.order.update({
                where: { id: orderId },
                data: { status },
            });
        } catch (error) {
            throw new Error(`Error updating order status: ${(error as Error).message}`);
        }
    }
}

export default Order;
