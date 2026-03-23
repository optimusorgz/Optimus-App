import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { Request, Response } from 'express';

interface AuthRequest extends Request {
    user?: { id: number; role: string; email: string };
}

export const addToWishlist = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { product_id } = req.body;

        if (!product_id) {
            return res.status(400).json({ message: 'Please provide product_id' });
        }

        const productId = parseInt(product_id, 10);
        const product = await Product.getById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const isInWishlist = await Wishlist.isInWishlist(req.user.id, productId);
        if (isInWishlist) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        const wishlistItem = await Wishlist.add(req.user.id, productId);

        res.status(201).json({
            message: 'Product added to wishlist',
            wishlistItem
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to wishlist', error: (error as Error).message });
    }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { product_id } = req.params;
        const productId = parseInt(product_id, 10);

        const removed = await Wishlist.remove(req.user.id, productId);
        if (!removed) {
            return res.status(404).json({ message: 'Item not in wishlist' });
        }

        res.json({ message: 'Product removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from wishlist', error: (error as Error).message });
    }
};

export const getWishlist = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { limit = '20', offset = '0' } = req.query as any;
        const limitNum = parseInt(limit as string, 10) || 20;
        const offsetNum = parseInt(offset as string, 10) || 0;

        const wishlistItems = await Wishlist.getByUserId(req.user.id, limitNum, offsetNum);

        res.json({
            message: 'Wishlist fetched successfully',
            wishlist: wishlistItems,
            count: wishlistItems.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wishlist', error: (error as Error).message });
    }
};

export const isInWishlist = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { product_id } = req.params;
        const productId = parseInt(product_id, 10);

        const inWishlist = await Wishlist.isInWishlist(req.user.id, productId);

        res.json({
            product_id: productId,
            inWishlist
        });
    } catch (error) {
        res.status(500).json({ message: 'Error checking wishlist', error: (error as Error).message });
    }
};
