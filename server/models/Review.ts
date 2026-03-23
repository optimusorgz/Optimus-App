import prisma from '../config/prisma.js';

interface ReviewCreateInput {
    product_id: number;
    user_id: number;
    rating: number;
    comment?: string;
}

class Review {
    static async create(reviewData: ReviewCreateInput): Promise<any> {
        const { product_id, user_id, rating, comment } = reviewData;

        try {
            const review = await prisma.review.create({
                data: {
                    productId: product_id,
                    userId: user_id,
                    rating,
                    comment,
                },
            });
            
            // Update product rating
            await this.updateProductRating(product_id);
            
            return review;
        } catch (error) {
            throw new Error(`Error creating review: ${(error as Error).message}`);
        }
    }

    static async getByProductId(productId: number, limit: number = 10, offset: number = 0): Promise<any[]> {
        try {
            return await prisma.review.findMany({
                where: { productId },
                include: {
                    user: { select: { name: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit,
            });
        } catch (error) {
            throw new Error(`Error fetching reviews: ${(error as Error).message}`);
        }
    }

    static async updateProductRating(productId: number): Promise<void> {
        try {
            const reviews = await prisma.review.findMany({
                where: { productId },
            });

            if (reviews.length === 0) {
                await prisma.product.update({
                    where: { id: productId },
                    data: { rating: 0 },
                });
            } else {
                const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
                await prisma.product.update({
                    where: { id: productId },
                    data: { rating: averageRating },
                });
            }
        } catch (error) {
            throw new Error(`Error updating product rating: ${(error as Error).message}`);
        }
    }
}

export default Review;
