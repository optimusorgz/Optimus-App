# Optimus - E-Commerce Mobile App

A modern, full-stack e-commerce platform built with **TypeScript**, React Native, and Express.js featuring type-safe APIs, Prisma ORM, and comprehensive database seeding. Supports both buyers and sellers with features like product listings, order management, wishlist, cart, and seller analytics.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Database & Seeding](#database--seeding)
- [API Endpoints](#api-endpoints)
- [Test Accounts](#test-accounts)
- [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

Optimus is a complete e-commerce solution with:
- ✅ **Full TypeScript** - Backend and frontend written in TypeScript for type safety
- ✅ **Prisma ORM** - Type-safe database queries with automatic migrations
- ✅ **ES6 Modules** - Modern JavaScript module system across entire backend
- ✅ **PostgreSQL** - Robust relational database with Docker support
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Comprehensive Seeding** - Pre-populated database with test data for all user roles
- ✅ **React Native + Expo** - Cross-platform mobile development
- ✅ **AsyncStorage** - Client-side data persistence with proper React Native integration

## 📁 Project Structure

```
optimus app/
├── mobile/                          # React Native/Expo mobile app (TypeScript)
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.tsx          # Axios HTTP client with AsyncStorage interceptors
│   │   │   └── services.tsx        # Type-safe service layer for API calls
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   └── ProductCard.tsx
│   │   ├── context/
│   │   │   └── CartContext.tsx     # Cart state management with TypeScript
│   │   ├── navigation/
│   │   │   ├── AppNavigator.tsx
│   │   │   ├── BuyerNavigator.tsx
│   │   │   └── SellerNavigator.tsx
│   │   ├── types/
│   │   │   └── index.tsx           # TypeScript interfaces
│   │   └── screens/
│   │       ├── LoginScreen.tsx
│   │       ├── RegisterScreen.tsx
│   │       ├── ModeSelectionScreen.tsx
│   │       ├── buyer/              # Buyer-specific screens
│   │       └── seller/             # Seller-specific screens
│   ├── App.tsx
│   ├── index.tsx
│   ├── app.json
│   ├── tsconfig.json               # TypeScript configuration
│   ├── babel.config.ts             # Expo babel configuration
│   └── package.json
│
├── server/                          # Express.js backend (TypeScript + Node.js)
│   ├── prisma/
│   │   ├── schema.prisma           # Prisma schema (6 models)
│   │   └── migrations/             # Database migration history
│   ├── src/
│   │   ├── models/                 # Prisma models (TypeScript)
│   │   │   ├── User.ts
│   │   │   ├── Product.ts
│   │   │   ├── Category.ts
│   │   │   ├── Order.ts
│   │   │   ├── OrderItem.ts
│   │   │   ├── Review.ts
│   │   │   └── Wishlist.ts
│   │   ├── controllers/            # Business logic (TypeScript)
│   │   │   ├── authController.ts
│   │   │   ├── productController.ts
│   │   │   ├── orderController.ts
│   │   │   ├── categoryController.ts
│   │   │   └── wishlistController.ts
│   │   ├── routes/                 # API routes (ES6 modules)
│   │   │   ├── auth.ts
│   │   │   ├── products.ts
│   │   │   ├── orders.ts
│   │   │   ├── categories.ts
│   │   │   └── wishlist.ts
│   │   ├── middleware/
│   │   │   └── auth.ts            # JWT authentication middleware
│   │   ├── config/
│   │   │   └── prisma.ts          # Prisma client instance
│   │   └── index.ts               # Express server entry point
│   ├── scripts/
│   │   └── seed.ts                # Database seeding script with test data
│   ├── tsconfig.json              # TypeScript configuration
│   ├── .env                       # Environment variables
│   └── package.json
│
├── TYPESCRIPT_MIGRATION.md        # Migration documentation
├── PRISMA_BENEFITS.md             # Prisma ORM benefits & features
└── README.md                       # This file
```

## 🛠 Tech Stack

### Frontend (Mobile)
- **TypeScript 5.3.3** - Strict type checking throughout frontend code
- **React Native 0.81.5** - Cross-platform mobile framework
- **Expo 54.0.33** - Managed development platform with metro bundler
- **React Navigation 7.x** - Type-safe screen navigation
- **Axios** - HTTP client with TypeScript interfaces
- **@react-native-async-storage/async-storage@2.2.0** - Persistent local storage (proper React Native integration)
- **React Context API** - State management for cart and authentication
- **Ionicons** - Icon library

### Backend (Server)
- **TypeScript 5.3.3** - Full type safety with strict mode enabled (ES2020 target)
- **Node.js + Express.js 4.18.2** - Web framework with ES6 module support
- **Prisma 5.22.0** - Next-generation ORM with type safety
- **PostgreSQL 12+** - Production-grade relational database
- **jsonwebtoken 9.0.0** - JWT authentication and refresh tokens
- **bcrypt 5.1.1** - Password hashing
- **dotenv** - Environment variable management
- **ts-node** - TypeScript script execution (for seeding)
- **nodemon** - Development auto-reload

### Database
- **PostgreSQL 12+** - Docker hosted (`optimus_db`)
- **Prisma Migrations** - Version-controlled schema changes
- **6 Core Models** with relationships:
  - User (authentication, profiles, roles)
  - Product (inventory, pricing, images)
  - Category (product classification)
  - Order (purchase orders)
  - OrderItem (line items in orders)
  - Review (product ratings)
  - Wishlist (saved items)

## ✨ Features

### Buyer Features
- ✅ User authentication (register/login with bcrypt hashing)
- ✅ Browse categories and products with filtering
- ✅ Search products with advanced filters (price range, ratings)
- ✅ View product details, images, and reviews
- ✅ Add to cart and manage cart items (Context API)
- ✅ Secure checkout with order placement
- ✅ Track order status and history
- ✅ Wishlist management (add/remove items)
- ✅ Leave product reviews and ratings
- ✅ User profile and settings management
- ✅ Address management for delivery

### Seller Features (Company & Student)
- ✅ Seller registration with company/student details
- ✅ Product management (add/edit/delete)
- ✅ Inventory and stock tracking
- ✅ Order management and fulfillment
- ✅ Order status updates
- ✅ Seller analytics dashboard
- ✅ Revenue tracking and reports
- ✅ View customer reviews

### Technical Features
- ✅ JWT-based authentication with token refresh
- ✅ Role-based access control (buyer/seller/admin)
- ✅ Type-safe APIs with TypeScript interfaces
- ✅ Comprehensive error handling and validation
- ✅ Request/response logging
- ✅ Database transaction support via Prisma
- ✅ Pre-populated test data via seeding
- ✅ Pull-to-refresh functionality
- ✅ Real-time data synchronization
- ✅ Automatic database migrations with Prisma

## 📋 Prerequisites

- **Node.js 18+** and npm 9+
- **PostgreSQL 12+** (can run in Docker)
- **Expo CLI** - `npm install -g expo-cli`
- **Git** for version control
- **Docker & Docker Compose** (optional, for PostgreSQL container)

## 🚀 Setup Instructions

### Backend Setup (TypeScript + Express + Prisma)

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   PORT=8000
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/optimus_db?schema=public"
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. **Start PostgreSQL (Docker):**
   ```bash
   docker run --name optimus_db \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=optimus_db \
     -p 5432:5432 \
     -d postgres:12
   ```
   Or skip if using local PostgreSQL installation.

5. **Setup Prisma ORM:**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations (creates database schema)
   npx prisma migrate deploy
   ```

6. **Seed database with test data:**
   ```bash
   npm run seed
   ```
   This creates:
   - 5 product categories
   - 3 test user accounts (buyer, company seller, student seller)
   - 7 sample products
   - 1 complete order with items
   - 3 wishlist items
   - 2 product reviews

7. **Build TypeScript:**
   ```bash
   npm run build
   ```

8. **Start the backend server:**
   ```bash
   # Production mode
   npm start
   
   # Development mode with auto-reload
   npm run dev
   ```
   Server runs on `http://localhost:8000`

**Key Server Features:**
- ✅ Full TypeScript with strict type checking
- ✅ ES6 module imports throughout
- ✅ Prisma ORM for type-safe database queries
- ✅ Automatic database migration management
- ✅ JWT authentication middleware
- ✅ Database connection verification on startup

### Frontend Setup (React Native + TypeScript + Expo)

1. **Navigate to mobile directory:**
   ```bash
   cd mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or with legacy peer deps for compatibility:
   npm install --legacy-peer-deps
   ```

3. **Update API URL in `src/api/client.tsx`:**
   Change the `API_URL` constant to your backend server's address:
   ```typescript
   const API_URL = 'http://10.42.180.144:8000/api'; // Replace IP with your server IP
   ```

4. **Start Expo development server:**
   ```bash
   npm start
   ```

5. **Run on device/emulator:**
   - Press `i` → Open iOS simulator
   - Press `a` → Open Android emulator
   - Scan QR code → Use Expo Go app on physical device

**Key Frontend Features:**
- ✅ Full TypeScript with strict types
- ✅ All components as `.tsx` files
- ✅ Proper AsyncStorage integration (React Native Async Storage package)
- ✅ Type-safe API services and context
- ✅ React Navigation v7
- ✅ Axios HTTP client with interceptors

## ▶️ Running the Application

### Quick Start (All at Once)

**Terminal 1 - Start Backend:**
```bash
cd server
npm install
npm run seed
npm start
```

**Terminal 2 - Start Frontend:**
```bash
cd mobile
npm install
npm start
```

Then press `i` for iOS or `a` for Android to run the app.

### System Architecture Flow
```
┌─────────────────┐
│  iOS/Android    │
│   Simulator     │
└────────┬────────┘
         │ (Axios HTTP)
         ▼
┌─────────────────────────────────┐
│  Expo Dev Server                │
│  (Metro Bundler)                │
│  Port: 8081                     │
└────────┬────────────────────────┘
         │ (HTTP/REST API)
         ▼
┌──────────────────────────────────┐
│  Express.js Backend              │
│  Port: 8000                      │
│  (TypeScript + Prisma ORM)       │
└────────┬───────────────────────┬─┘
         │                       │
         │ (SQL Queries)         │ (Verify Connection)
         ▼                       ▼
┌──────────────────────────────────┐
│  PostgreSQL Database             │
│  (optimus_db)                    │
│  Docker Container/Local          │
└──────────────────────────────────┘
```

## 🌱 Database & Seeding

### What Gets Seeded

The `npm run seed` command populates the database with:

**5 Categories:**
- Electronics
- Fashion
- Books
- Sports
- Rentals

**3 Test User Accounts:**
1. **Buyer Account**
   - Email: buyer@optimus.com
   - Role: buyer

2. **Company Seller Account**
   - Email: company@optimus.com
   - Role: company_seller

3. **Student Seller Account**
   - Email: student@optimus.com
   - Role: student_seller

**All accounts have password:** `Password123!`

**7 Products:**
- 4 products from company seller (electronics)
- 3 products from student seller (books, sporting goods)

**Test Data Includes:**
- 1 complete order (from buyer to company seller)
- 3 wishlist items
- 2 product reviews

### Seeding Workflow

```bash
# Clear and reseed database
rm -f ./prisma/dev.db  # if using SQLite
npm run seed

# Check data in Prisma Studio
npx prisma studio

# View raw data
# Visit: http://localhost:5555 (Prisma Studio)
```

## 🧪 Test Accounts

Use these credentials to test the app:

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Buyer | buyer@optimus.com | Password123! | Test buying flow, wishlist, reviews |
| Company Seller | company@optimus.com | Password123! | Test product management, orders |
| Student Seller | student@optimus.com | Password123! | Test seller analytics |

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

## 📊 Database Schema (Prisma Models)

The database schema is defined in `/server/prisma/schema.prisma`. Prisma manages all migrations automatically.

### Core Models:

**User Model** - Authentication & Profiles
- id, email (unique), password hash, full name, role (buyer/seller/company_seller/student_seller)
- Relationships: products (seller), orders (buyer), reviews, wishlist items

**Product Model** - Inventory & Catalog
- id, title, description, price, discount_percent, image_url
- seller_id (relationship to User), category_id (relationship to Category)
- stock_quantity, rating, created_at, updated_at

**Category Model** - Product Classification
- id, name (unique), description
- Relationships: products

**Order Model** - Purchase Orders
- id, buyer_id, total_amount, status (pending/processing/shipped/completed/cancelled)
- shipping_address, created_at, updated_at
- Relationships: buyer (User), order_items (OrderItem)

**OrderItem Model** - Line Items in Orders
- id, order_id, product_id, quantity, price_at_time_of_order
- Relationships: order (Order), product (Product)

**Review Model** - Product Ratings
- id, product_id, user_id, rating (1-5), comment, created_at
- Relationships: product (Product), author (User)

**Wishlist Model** - Saved Items
- id, user_id, product_id, created_at
- Unique constraint on (user_id, product_id)
- Relationships: user (User), product (Product)

### View Prisma Schema
```bash
# Open Prisma Studio to view/edit data visually
cd server
npx prisma studio
```

## 🐛 Troubleshooting

### Backend Issues

#### Error: "Database connection refused"
```bash
# Check if PostgreSQL is running
docker ps | grep optimus_db

# If not running, start it
docker run --name optimus_db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=optimus_db \
  -p 5432:5432 \
  -d postgres:12
```

#### Error: "Port 8000 already in use"
```bash
# Kill process using port 8000
lsof -ti:8000 | xargs kill -9
```

#### Error: "Cannot find module Prisma client"
```bash
cd server
npx prisma generate
npm install
```

### Frontend Issues

#### Error: "AsyncStorage has been removed from react-native"
```bash
# Install correct version for your Expo version
npm install @react-native-async-storage/async-storage@2.2.0
```

#### Error: "Metro cache deserialization error"
```bash
# Clear Metro and bundler cache
rm -rf .metro node_modules/.cache
npm start -- --clear
```

#### Error: "Cannot connect to backend API"
```bash
# Check:
# 1. Backend is running on port 8000
# 2. Update API_URL in src/api/client.tsx with correct IP
# 3. Both are on same network
ping <backend-ip>
```

#### Error: "Port 8081 already in use"
```bash
# Kill process using port 8081
lsof -ti:8081 | xargs kill -9
```

### Database Issues

#### Error: "The table 'X' does not exist"
```bash
# Run Prisma migrations
cd server
npx prisma migrate deploy
```

#### Error: "Cannot reset database"
```bash
# Reset database and reseed
cd server
npx prisma migrate reset  # Warning: deletes all data!
npm run seed
```

## 📚 Documentation

- [TYPESCRIPT_MIGRATION.md](./TYPESCRIPT_MIGRATION.md) - TypeScript implementation details
- [PRISMA_BENEFITS.md](./server/PRISMA_BENEFITS.md) - Prisma ORM advantages
- [Prisma Documentation](https://www.prisma.io/docs/) - Official Prisma docs
- [Express.js Guide](https://expressjs.com/) - Express framework docs
- [React Native Docs](https://reactnative.dev/) - React Native documentation
- [Expo Documentation](https://docs.expo.dev/) - Expo framework docs

## 📝 Git Commits

Latest commit includes:
- ✅ Full TypeScript migration (backend + frontend)
- ✅ Prisma ORM setup with 6 models
- ✅ ES6 module conversion
- ✅ AsyncStorage React Native integration fix
- ✅ Comprehensive database seeding
- ✅ Production-ready error handling

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/feature-name`
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Last Updated:** March 23, 2026  
**Version:** 2.0.0 (TypeScript + Prisma)  
**Status:** Production Ready ✅
