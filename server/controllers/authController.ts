import User from '../models/User.js';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';

interface AuthRequest extends Request {
    user?: { id: number; role: string; email: string };
}

interface DecodedToken extends JwtPayload {
    id: number;
}

const generateToken = (userId: number): string => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'optimus_secret_key', { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, password, confirmPassword, role = 'buyer', phone, address, city, state, zipcode } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email and password' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create user
        const newUser = await User.create({
            name,
            email,
            password,
            role,
            phone,
            address,
            city,
            state,
            zipcode
        });

        const token = generateToken(newUser.id);

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user', error: (error as Error).message });
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Find user
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate password
        const isPasswordValid = await User.validatePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user.id);

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
                city: user.city,
                state: user.state,
                zipcode: user.zipcode
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error: (error as Error).message });
    }
};

export const verifyToken = async (req: Request, res: Response): Promise<any> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'optimus_secret_key') as DecodedToken;
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', error: (error as Error).message });
    }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: (error as Error).message });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const updateData = req.body;

        const updatedUser = await User.updateProfile(userId, updateData);

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: (error as Error).message });
    }
};
