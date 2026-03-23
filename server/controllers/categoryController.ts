import Category from '../models/Category.js';
import { Request, Response } from 'express';

export const getAllCategories = async (req: Request, res: Response): Promise<any> => {
    try {
        const categories = await Category.getAll();

        res.json({
            message: 'Categories fetched successfully',
            categories,
            count: categories.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: (error as Error).message });
    }
};

export const getCategoryById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const categoryId = parseInt(id, 10);

        const category = await Category.getById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({
            message: 'Category fetched successfully',
            category
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error: (error as Error).message });
    }
};

export const createCategory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, icon_url, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Please provide category name' });
        }

        const category = await Category.create({
            name,
            icon_url: icon_url || '',
            description: description || ''
        });

        res.status(201).json({
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        if ((error as Error).message.includes('duplicate')) {
            return res.status(400).json({ message: 'Category already exists' });
        }
        res.status(500).json({ message: 'Error creating category', error: (error as Error).message });
    }
};
