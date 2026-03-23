import prisma from '../config/prisma.js';

interface CategoryCreateInput {
    name: string;
    icon_url?: string;
    description?: string;
}

class Category {
    static async getAll(): Promise<any[]> {
        try {
            return await prisma.category.findMany({
                orderBy: { name: 'asc' },
            });
        } catch (error) {
            throw new Error(`Error fetching categories: ${(error as Error).message}`);
        }
    }

    static async getById(id: number): Promise<any> {
        try {
            return await prisma.category.findUnique({
                where: { id },
            });
        } catch (error) {
            throw new Error(`Error fetching category: ${(error as Error).message}`);
        }
    }

    static async create(categoryData: CategoryCreateInput): Promise<any> {
        const { name, icon_url, description } = categoryData;

        try {
            return await prisma.category.create({
                data: {
                    name,
                    iconUrl: icon_url,
                    description,
                },
            });
        } catch (error) {
            throw new Error(`Error creating category: ${(error as Error).message}`);
        }
    }
}

export default Category;
