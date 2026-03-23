import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { Request, Response } from 'express';

interface AuthRequest extends Request {
    user?: { id: number; role: string; email: string };
}

export const getAllProducts = async (req: Request, res: Response): Promise<any> => {
    try {
        const { category_id, search, sortBy, limit = '20', offset = '0' } = req.query as any;

        const filters: any = {};
        if (category_id) filters.category_id = parseInt(category_id, 10);
        if (search) filters.search = search;
        if (sortBy) filters.sortBy = sortBy;

        const limitNum = parseInt(limit as string, 10) || 20;
        const offsetNum = parseInt(offset as string, 10) || 0;

        const products = await Product.getAll(limitNum, offsetNum, filters);

        res.json({
            message: 'Products fetched successfully',
            products,
            count: products.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: (error as Error).message });
    }
};

export const getProductById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const productId = parseInt(id, 10);

        const product = await Product.getById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Get reviews
        const reviews = await Review.getByProductId(productId);

        res.json({
            message: 'Product fetched successfully',
            product: {
                ...product,
                reviews
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: (error as Error).message });
    }
};

export const getSellerProducts = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const sellerId = req.user?.id;
        if (!sellerId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { limit = '20', offset = '0' } = req.query as any;
        const limitNum = parseInt(limit as string, 10) || 20;
        const offsetNum = parseInt(offset as string, 10) || 0;

        const products = await Product.getBySellerId(sellerId, limitNum, offsetNum);

        res.json({
            message: 'Seller products fetched successfully',
            products,
            count: products.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching seller products', error: (error as Error).message });
    }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (req.user.role !== 'company_seller' && req.user.role !== 'student_seller') {
            return res.status(403).json({ message: 'Only sellers can create products' });
        }

        const { category_id, title, description, price, original_price, discount_percentage, image_url, stock_quantity } = req.body;

        if (!title || !price || !category_id) {
            return res.status(400).json({ message: 'Please provide title, price and category' });
        }

        const categoryId = parseInt(category_id, 10);

        const product = await Product.create({
            seller_id: req.user.id,
            category_id: categoryId,
            title,
            description,
            price,
            original_price,
            discount_percentage: discount_percentage || 0,
            image_url,
            stock_quantity: stock_quantity || 0
        });

        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: (error as Error).message });
    }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { id } = req.params;
        const productId = parseInt(id, 10);
        const product = await Product.getById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.sellerId !== req.user.id) {
            return res.status(403).json({ message: 'You can only update your own products' });
        }

        const updatedProduct = await Product.update(productId, req.body);

        res.json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: (error as Error).message });
    }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { id } = req.params;
        const productId = parseInt(id, 10);
        const product = await Product.getById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.sellerId !== req.user.id) {
            return res.status(403).json({ message: 'You can only delete your own products' });
        }

        await Product.delete(productId);

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: (error as Error).message });
    }
};

export const searchProducts = async (req: Request, res: Response): Promise<any> => {
    try {
        const { query, limit = '20' } = req.query as any;

        if (!query) {
            return res.status(400).json({ message: 'Please provide a search query' });
        }

        const limitNum = parseInt(limit as string, 10) || 20;

        const products = await Product.search(query as string, limitNum);

        res.json({
            message: 'Search results',
            products,
            count: products.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Error searching products', error: (error as Error).message });
    }
};

export const addReview = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { id } = req.params;
        const productId = parseInt(id, 10);
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Please provide a valid rating between 1-5' });
        }

        const product = await Product.getById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const review = await Review.create({
            product_id: productId,
            user_id: req.user.id,
            rating,
            comment: comment || ''
        });

        res.status(201).json({
            message: 'Review added successfully',
            review
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error: (error as Error).message });
    }
};

export const getProductReviews = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { limit = '10', offset = '0' } = req.query as any;
        
        const productId = parseInt(id, 10);
        const limitNum = parseInt(limit as string, 10) || 10;
        const offsetNum = parseInt(offset as string, 10) || 0;

        const product = await Product.getById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const reviews = await Review.getByProductId(productId, limitNum, offsetNum);

        res.json({
            message: 'Reviews fetched successfully',
            reviews,
            count: reviews.length,
            productRating: product.rating
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: (error as Error).message });
    }
};
