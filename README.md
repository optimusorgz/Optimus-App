# Optimus - E-Commerce Mobile App

A full-stack e-commerce application built with React Native for mobile and Express.js for the backend. The platform supports both buyers and sellers with features like product listings, order management, wishlist, cart, and seller analytics.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)

## 📁 Project Structure

```
optimus app/
├── mobile/                          # React Native/Expo mobile app
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js           # Axios HTTP client with interceptors
│   │   │   └── services.js         # Service layer for API calls
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   └── ProductCard.js
│   │   ├── context/
│   │   │   └── CartContext.js      # Cart state management
│   │   ├── navigation/
│   │   │   ├── AppNavigator.js
│   │   │   ├── BuyerNavigator.js
│   │   │   └── SellerNavigator.js
│   │   └── screens/
│   │       ├── Authentication/
│   │       ├── buyer/              # Buyer-specific screens
│   │       └── seller/             # Seller-specific screens
│   ├── App.js
│   ├── index.js
│   ├── app.json
│   └── package.json
│
├── server/                          # Express.js backend
│   ├── config/
│   │   └── db.js                   # PostgreSQL connection pool
│   ├── database/
│   │   └── schema.sql              # Database DDL
│   ├── models/                     # Data models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   └── Wishlist.js
│   ├── controllers/                # Business logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── categoryController.js
│   │   └── wishlistController.js
│   ├── routes/                     # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── categories.js
│   │   └── wishlist.js
│   ├── middleware/
│   │   └── auth.js                 # JWT authentication middleware
│   ├── scripts/
│   │   └── migrate.js              # Database setup script
│   ├── index.js                    # Express server entry point
│   ├── .env                        # Environment variables
│   └── package.json
│
└── README.md                        # This file
```

## 🛠 Tech Stack

### Frontend (Mobile)
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **Axios**: HTTP client with request/response interceptors
- **AsyncStorage**: Local storage for tokens and user data
- **React Navigation**: Navigation between screens
- **Ionicons**: Icon library

### Backend
- **Express.js**: Web framework
- **Prisma ORM**: Type-safe database client and query builder
- **PostgreSQL**: Relational database
- **JWT**: Authentication and authorization
- **bcrypt**: Password hashing
- **node-postgres (pg)**: PostgreSQL connection support

### Database
- **PostgreSQL 12+**
- 8 interconnected tables with proper normalization
- Indexes on frequently queried columns
- Foreign key constraints for data integrity

## ✨ Features

### Buyer Features
- User authentication (register/login)
- Browse categories and products
- Search and filter products
- View product details and reviews
- Add to cart and checkout
- Place orders and track status
- Wishlist management
- User profile management
- Settings and preferences

### Seller Features
- Seller registration and authentication
- Product management (add/edit/delete)
- Inventory tracking
- Order management and fulfillment
- Seller analytics dashboard
- Order status updates
- Revenue tracking

### General Features
- JWT-based authentication
- Token refresh mechanism
- Role-based access control (buyer/seller)
- Error handling and validation
- Loading states and empty states
- Pull-to-refresh functionality
- Real-time data synchronization

## 🚀 Setup Instructions

### Prerequisites
- Node.js 14+ and npm/yarn
- PostgreSQL 12+
- Expo CLI (`npm install -g expo-cli`)
- Git

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file with the following variables:**
   ```env
   PORT=8000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=optimus_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/optimus_db?schema=public"
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Create PostgreSQL database:**
   ```bash
   createdb optimus_db
   ```

5. **Setup Prisma (ORM):**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # (Optional) Seed initial data
   npx prisma db seed
   ```

6. **Start the server:**
   ```bash
   npm start
   # For development with auto-reload:
   npm run dev
   ```
   Server runs on `http://localhost:8000`

**Note:** This project uses **Prisma ORM** instead of raw SQL queries. See [PRISMA_MIGRATION.md](./server/PRISMA_MIGRATION.md) for more details.

### Frontend Setup

1. **Navigate to mobile directory:**
   ```bash
   cd mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Update API URL in `src/api/client.js`:**
   - Change `API_URL` to your server's local IP address
   - Example: `http://192.168.1.31:8000/api` (for physical devices/emulators)

4. **Start the Expo server:**
   ```bash
   npm start
   # or
   expo start
   ```

5. **Run on device/emulator:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register              # Register new user
POST   /api/auth/login                 # User login
POST   /api/auth/verify-token          # Verify JWT token
GET    /api/auth/profile               # Get user profile (protected)
```

### Products
```
GET    /api/products                   # Get all products (with filters)
GET    /api/products/:id               # Get product details
POST   /api/products                   # Create product (seller only)
PUT    /api/products/:id               # Update product (seller only)
DELETE /api/products/:id               # Delete product (seller only)
GET    /api/products/search            # Search products
GET    /api/products/:id/reviews       # Get product reviews
POST   /api/products/:id/reviews       # Add review (protected)
```

### Orders
```
POST   /api/orders                     # Create new order (protected)
GET    /api/orders/:id                 # Get order details (protected)
GET    /api/orders/buyer/orders        # Get buyer's orders (protected)
GET    /api/orders/seller/orders       # Get seller's orders (protected)
PUT    /api/orders/:id/status          # Update order status (protected)
PUT    /api/orders/:id/cancel          # Cancel order (protected)
```

### Categories
```
GET    /api/categories                 # Get all categories
GET    /api/categories/:id             # Get category details
POST   /api/categories                 # Create category (admin only)
```

### Wishlist
```
GET    /api/wishlist                   # Get user's wishlist (protected)
POST   /api/wishlist                   # Add to wishlist (protected)
DELETE /api/wishlist/:id               # Remove from wishlist (protected)
GET    /api/wishlist/:id/check         # Check if product in wishlist (protected)
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  user_type ENUM('buyer', 'seller') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER NOT NULL REFERENCES users(id),
  category_id INTEGER NOT NULL REFERENCES categories(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER NOT NULL,
  image_url VARCHAR(255),
  rating DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  buyer_id INTEGER NOT NULL REFERENCES users(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'completed', 'cancelled') DEFAULT 'pending',
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  rating INTEGER CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Wishlist Table
```sql
CREATE TABLE wishlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Cart Table
```sql
CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);
```

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm start
# Server running on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd mobile
npm start
# Expo running on http://localhost:19000
```

### Test Credentials

**Buyer Account:**
- Email: `buyer@test.com`
- Password: `password123`

**Seller Account:**
- Email: `seller@test.com`
- Password: `password123`

## 🔐 Authentication Flow

1. User enters credentials and submits login form
2. Backend validates credentials and generates JWT token
3. Token is stored in AsyncStorage on mobile
4. Token is automatically attached to all subsequent requests via axios interceptor
5. If token expires (401 response), it's cleared and user is redirected to login
6. User can register new account with email, password, name, and user type

## 📱 Frontend Architecture

### Service Layer Pattern
All API calls are centralized in `src/api/services.js`:
```javascript
- authService: Authentication & profile
- productService: Product listing & details
- categoryService: Category management
- orderService: Order operations
- wishlistService: Wishlist management
```

### State Management
- **Context API**: CartContext for cart state
- **Local Component State**: useState for screen-specific data
- **AsyncStorage**: Token and user persistence

### Navigation Structure
- **AppNavigator**: Root navigator handling auth/main flows
- **BuyerNavigator**: Tab-based navigation for buyers
- **SellerNavigator**: Drawer/tab navigation for sellers

## 🐛 Troubleshooting

### Cannot connect to backend
- Check if server is running on port 8000
- Verify API URL in `src/api/client.js` matches your machine's IP
- Ensure Android emulator/iOS simulator can reach your machine's IP
- Test with: `curl http://YOUR_IP:8000/api/categories`

### Database connection errors
- Ensure PostgreSQL is running
- Check `.env` file has correct database credentials
- Run migration script: `npm run migrate`
- Check logs: `psql optimus_db` to connect directly

### Images not loading
- Products use placeholder images from Unsplash/placeholder services
- Ensure internet connection on device
- Check image URLs in database are valid

### Token expiration issues
- Tokens are stored in AsyncStorage
- Expired tokens trigger 401 and redirect to login
- Clear app cache if issues persist: `expo prebuild -c`

### Build/compilation errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Expo cache: `expo start -c`
- Check Node version matches requirements

## 📝 Environment Variables

### Server (.env)
```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=optimus_db
JWT_SECRET=your_secret_key_min_32_chars
NODE_ENV=development
```

### Frontend (src/api/client.js)
```javascript
const API_URL = 'http://192.168.1.31:8000/api'; // Update to your IP
```

## 🔄 API Response Format

All endpoints return JSON in this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* relevant data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "error_code"
}
```

## 📦 Key Dependencies

### Frontend
- `react-native@latest`
- `expo@latest`
- `axios@latest`
- `@react-navigation/native@latest`
- `@react-native-community/async-storage@latest`

### Backend
- `express@5.x`
- `pg@8.x`
- `jsonwebtoken@9.x`
- `bcrypt@5.x`
- `dotenv@16.x`

## 📄 License

This project is proprietary and confidential.

## 👥 Contributors

- Development Team

## 📧 Support

For issues and questions, please create an issue in the repository.

---

**Last Updated:** March 23, 2026
**Version:** 1.0.0
