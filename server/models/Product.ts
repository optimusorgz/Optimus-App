import prisma from '../config/prisma.js';

interface ProductCreateInput {
    seller_id: number;
    category_id: number;
    title: string;
    description?: string;
    price: number;
    original_price?: number;
    discount_percentage?: number;
    image_url?: string;
    stock_quantity?: number;
}

interface ProductUpdateInput {
    title?: string;
    description?: string;
    price?: number;
    original_price?: number;
    discount_percentage?: number;
    stock_quantity?: number;
    status?: string;
}

interface ProductFilters {
    category_id?: number;
    search?: string;
    sortBy?: 'price_low' | 'price_high' | 'rating';
}

class Product {
    static async create(productData: ProductCreateInput): Promise<any> {
        const { seller_id, category_id, title, description, price, original_price, discount_percentage, image_url, stock_quantity } = productData;

        try {
            return await prisma.product.create({
                data: {
                    sellerId: seller_id,
                    categoryId: category_id,
                    title,
                    description,
                    price,
                    originalPrice: original_price,
                    discountPercentage: discount_percentage || 0,
                    imageUrl: image_url,
                    stockQuantity: stock_quantity || 0,
                },
            });
        } catch (error) {
            throw new Error(`Error creating product: ${(error as Error).message}`);
        }
    }

    static async getAll(limit: number = 20, offset: number = 0, filters: ProductFilters = {}): Promise<any[]> {
        try {
            const where: any = { status: 'active' };

            if (filters.category_id) {
                where.categoryId = filters.category_id;
            }

            if (filters.search) {
                where.OR = [
                    { title: { contains: filters.search, mode: 'insensitive' } },
                    { description: { contains: filters.search, mode: 'insensitive' } },
                ];
            }

            let orderBy: any = { createdAt: 'desc' };
            if (filters.sortBy === 'price_low') {
                orderBy = { price: 'asc' };
            } else if (filters.sortBy === 'price_high') {
                orderBy = { price: 'desc' };
            } else if (filters.sortBy === 'rating') {
                orderBy = { rating: 'desc' };
            }

            return await prisma.product.findMany({
                where,
                include: {
                    category: { select: { name: true } },
                    seller: { select: { name: true } },
                },
                orderBy,
                skip: offset,
                take: limit,
            });
        } catch (error) {
            throw new Error(`Error fetching products: ${(error as Error).message}`);
        }
    }

    static async getById(id: number): Promise<any | null> {
        try {
            const product = await prisma.product.findUnique({
                where: { id },
                include: {
                    category: { select: { name: true } },
                    seller: { select: { name: true, id: true, phone: true } },
                },
            });

            if (!product) return null;

            // Format response to match old SQL structure
            return {
                ...product,
                category_name: product.category.name,
                seller_name: product.seller.name,
                seller_id: product.seller.id,
                seller_phone: product.seller.phone,
            };
        } catch (error) {
            throw new Error(`Error fetching product: ${(error as Error).message}`);
        }
    }

    static async getBySellerId(sellerId: number, limit: number = 50, offset: number = 0): Promise<any[]> {
        try {
            return await prisma.product.findMany({
                where: { sellerId },
                include: {
                    category: { select: { name: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit,
            });
        } catch (error) {
            throw new Error(`Error fetching seller products: ${(error as Error).message}`);
        }
    }

    static async update(productId: number, updateData: ProductUpdateInput): Promise<any> {
        const { title, description, price, original_price, discount_percentage, stock_quantity, status } = updateData;

        try {
            return await prisma.product.update({
                where: { id: productId },
                data: {
                    ...(title && { title }),
                    ...(description && { description }),
                    ...(price && { price }),
                    ...(original_price && { originalPrice: original_price }),
                    ...(discount_percentage !== undefined && { discountPercentage: discount_percentage }),
                    ...(stock_quantity !== undefined && { stockQuantity: stock_quantity }),
                    ...(status && { status }),
                },
            });
        } catch (error) {
            throw new Error(`Error updating product: ${(error as Error).message}`);
        }
    }

    static async delete(productId: number): Promise<any> {
        try {
            return await prisma.product.delete({
                where: { id: productId },
            });
        } catch (error) {
            throw new Error(`Error deleting product: ${(error as Error).message}`);
        }
    }

    static async search(searchTerm: string, limit: number = 20): Promise<any[]> {
        try {
            return await prisma.product.findMany({
                where: {
                    status: 'active',
                    OR: [
                        { title: { contains: searchTerm, mode: 'insensitive' } },
                        { description: { contains: searchTerm, mode: 'insensitive' } },
                    ],
                },
                include: {
                    category: { select: { name: true } },
                    seller: { select: { name: true } },
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
            });
        } catch (error) {
            throw new Error(`Error searching products: ${(error as Error).message}`);
        }
    }
}

export default Product;
