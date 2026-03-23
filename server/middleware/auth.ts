import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User.js';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
    user?: { id: number; role: string; email: string };
}

interface DecodedToken extends JwtPayload {
    id: number;
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'optimus_secret_key') as DecodedToken;
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = { id: user.id, role: user.role, email: user.email };

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', error: (error as Error).message });
    }
};

export default authMiddleware;
