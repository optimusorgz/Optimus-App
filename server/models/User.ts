import prisma from '../config/prisma.js';
import bcrypt from 'bcrypt';

interface UserCreateInput {
    name: string;
    email: string;
    password: string;
    role?: 'buyer' | 'company_seller' | 'student_seller';
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipcode?: string;
}

interface UserUpdateInput {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipcode?: string;
}

interface UserResponse {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    zipcode?: string | null;
    role: string;
    companyName?: string | null;
    gstNumber?: string | null;
    createdAt?: Date;
}

class User {
    static async create(userData: UserCreateInput): Promise<UserResponse> {
        const { name, email, password, role = 'buyer', phone, address, city, state, zipcode } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role,
                    phone,
                    address,
                    city,
                    state,
                    zipcode,
                },
            });

            // Return without password
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            throw new Error(`Error creating user: ${(error as Error).message}`);
        }
    }

    static async findByEmail(email: string): Promise<any> {
        try {
            return await prisma.user.findUnique({
                where: { email },
            });
        } catch (error) {
            throw new Error(`Error finding user: ${(error as Error).message}`);
        }
    }

    static async findById(id: number): Promise<UserResponse | null> {
        try {
            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    city: true,
                    state: true,
                    zipcode: true,
                    role: true,
                    companyName: true,
                    gstNumber: true,
                    createdAt: true,
                },
            });
            return user || null;
        } catch (error) {
            throw new Error(`Error finding user: ${(error as Error).message}`);
        }
    }

    static async updateProfile(userId: number, userData: UserUpdateInput): Promise<UserResponse> {
        const { name, phone, address, city, state, zipcode } = userData;

        try {
            return await prisma.user.update({
                where: { id: userId },
                data: {
                    ...(name && { name }),
                    ...(phone && { phone }),
                    ...(address && { address }),
                    ...(city && { city }),
                    ...(state && { state }),
                    ...(zipcode && { zipcode }),
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    city: true,
                    state: true,
                    zipcode: true,
                    role: true,
                },
            });
        } catch (error) {
            throw new Error(`Error updating user profile: ${(error as Error).message}`);
        }
    }

    static async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}

export default User;
