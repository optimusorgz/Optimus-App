# Migration from Raw SQL to Prisma

## Overview
This project has been migrated from using raw SQL queries with the `pg` library to **Prisma ORM**. This change provides:

- **Type Safety**: Auto-generated types for all database models
- **Better Developer Experience**: No need to write SQL manually
- **Automatic Migrations**: Easy schema management
- **Query Optimization**: Better query composition
- **Less Boilerplate**: Cleaner, more readable code

## Changes Made

### 1. Models Converted to Prisma
All models in `/server/models/` have been converted:
- ✅ User.js
- ✅ Product.js
- ✅ Order.js
- ✅ Review.js
- ✅ Wishlist.js
- ✅ Category.js

### 2. Configuration Added
- **`prisma/schema.prisma`**: Database schema definition
- **`config/prisma.js`**: Prisma client initialization
- **`.env`**: Added `DATABASE_URL` for Prisma

### 3. SQL vs Prisma Examples

#### **Creating a Product (SQL)**
```javascript
const query = `
    INSERT INTO products (seller_id, category_id, title, description, price, ...)
    VALUES ($1, $2, $3, $4, $5, ...)
    RETURNING *
`;
const result = await pool.query(query, [sellerId, categoryId, title, description, price, ...]);
```

#### **Creating a Product (Prisma)**
```javascript
const product = await prisma.product.create({
    data: {
        sellerId: seller_id,
        categoryId: category_id,
        title,
        description,
        price,
        // ... other fields
    },
});
```

#### **Fetching Products with Relations (SQL)**
```javascript
const query = `
    SELECT p.*, c.name as category_name, u.name as seller_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN users u ON p.seller_id = u.id
    WHERE p.status = 'active'
    LIMIT $1 OFFSET $2
`;
const result = await pool.query(query, [limit, offset]);
```

#### **Fetching Products with Relations (Prisma)**
```javascript
const products = await prisma.product.findMany({
    where: { status: 'active' },
    include: {
        category: { select: { name: true } },
        seller: { select: { name: true } },
    },
    skip: offset,
    take: limit,
});
```

## Setup & Migration

### 1. Install Prisma
```bash
npm install @prisma/client prisma
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Create/Update Database Schema
If you're starting fresh:
```bash
npx prisma migrate dev --name init
```

If you have an existing database:
```bash
npx prisma db push
```

### 4. (Optional) Seed Database
You can create a seed script at `prisma/seed.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Electronics', iconUrl: 'https://...' },
    { name: 'Fashion', iconUrl: 'https://...' },
    // ... more categories
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
```

Then run:
```bash
npx prisma db seed
```

## Benefits

| Feature | Raw SQL | Prisma |
|---------|---------|--------|
| Type Safety | ❌ | ✅ |
| SQL Injection Prone | ⚠️ | ✅ Safe |
| Query Optimization | Manual | ✅ Auto |
| Relations (Joins) | Complex | ✅ Simple |
| Migrations | Manual | ✅ Automated |
| Code Readability | ⚠️ | ✅ Excellent |
| Learning Curve | Low | ✅ Medium |

## Key Prisma Features Used

### 1. **Relations**
```javascript
// Automatically populate related data
await prisma.product.findUnique({
  where: { id: 1 },
  include: {
    category: true,
    seller: true,
    reviews: true,
  },
});
```

### 2. **Filtering & Search**
```javascript
// Case-insensitive search
await prisma.product.findMany({
  where: {
    OR: [
      { title: { contains: 'laptop', mode: 'insensitive' } },
      { description: { contains: 'laptop', mode: 'insensitive' } },
    ],
  },
});
```

### 3. **Pagination**
```javascript
// Built-in skip and take
await prisma.product.findMany({
  skip: offset,
  take: limit,
  orderBy: { createdAt: 'desc' },
});
```

### 4. **Aggregations**
```javascript
// Easy calculations
const productCount = await prisma.product.count({
  where: { status: 'active' },
});

const avgRating = await prisma.review.aggregate({
  _avg: { rating: true },
  where: { productId: 1 },
});
```

## Useful Prisma Commands

```bash
# Generate Prisma client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name add_new_field

# Push schema changes to database (without migrations)
npx prisma db push

# Seed the database
npx prisma db seed

# Open Prisma Studio (visual database browser)
npx prisma studio

# Reset database (WARNING: deletes all data!)
npx prisma migrate reset
```

## Migration Checklist

- [x] Install Prisma dependencies
- [x] Create Prisma schema
- [x] Convert all models
- [x] Update environment variables
- [ ] Run database migrations
- [ ] Test all endpoints
- [ ] Optional: Add Prisma seed script
- [ ] Remove old PostgreSQL pool connection if not needed

## Troubleshooting

### "Unsupported introspection database version"
Ensure PostgreSQL 12+ is installed and running.

### Database connection failed
Check `.env` file and verify `DATABASE_URL` is correct.

### TypeScript errors with Prisma types
Run `npx prisma generate` to regenerate Prisma client.

## Next Steps

1. Test all API endpoints to ensure functionality
2. Consider adding Prisma logging for development
3. Implement database transaction for complex operations
4. Add more validation using Prisma middleware
5. Consider using Prisma Extensions for custom functionality

## Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma Database Support](https://www.prisma.io/docs/reference/database-reference)
- [Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/query-optimization-performance)
