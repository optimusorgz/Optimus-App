import prisma from '../config/prisma.js';

class Wishlist {
    static async add(userId: number, productId: number): Promise<any> {
        try {
            return await prisma.wishlist.create({
                data: {
                    userId,
                    productId,
                },
            });
        } catch (error) {
            throw new Error(`Error adding to wishlist: ${(error as Error).message}`);
        }
    }

    static async remove(userId: number, productId: number): Promise<any> {
        try {
            return await prisma.wishlist.delete({
                where: {
                    userId_productId: {
                        userId,
                        productId,
                    },
                },
            });
        } catch (error) {
            throw new Error(`Error removing from wishlist: ${(error as Error).message}`);
        }
    }

    static async getByUserId(userId: number, limit: number = 20, offset: number = 0): Promise<any[]> {
        try {
            return await prisma.wishlist.findMany({
                where: { userId },
                include: {
                    product: {
                        include: {
                            category: { select: { name: true } },
                            seller: { select: { name: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit,
            });
        } catch (error) {
            throw new Error(`Error fetching wishlist: ${(error as Error).message}`);
        }
    }

    static async isInWishlist(userId: number, productId: number): Promise<boolean> {
        try {
            const item = await prisma.wishlist.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId,
                    },
                },
            });
            return !!item;
        } catch (error) {
            throw new Error(`Error checking wishlist: ${(error as Error).message}`);
        }
    }
}

export default Wishlist;
