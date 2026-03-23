import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/prisma.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req: Request, res: Response) => {
    res.send('Optimus API is running');
});

// Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import categoryRoutes from './routes/categories.js';
import wishlistRoutes from './routes/wishlist.js';

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Database connection check and server startup
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✓ Database connection successful');
    
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('✗ Database connection failed:', (error as Error).message);
    process.exit(1);
  }
};

startServer();
