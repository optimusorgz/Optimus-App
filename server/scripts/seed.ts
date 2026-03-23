import prisma from '../config/prisma.ts';
import bcrypt from 'bcrypt';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // 1. Create Categories
    console.log('📁 Creating categories...');
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { name: 'Electronics' },
        update: {},
        create: {
          name: 'Electronics',
          iconUrl: 'https://cdn-icons-png.flaticon.com/128/3659/3659899.png',
          description: 'Electronic devices and gadgets',
        },
      }),
      prisma.category.upsert({
        where: { name: 'Fashion' },
        update: {},
        create: {
          name: 'Fashion',
          iconUrl: 'https://cdn-icons-png.flaticon.com/128/3050/3050253.png',
          description: 'Clothing and accessories',
        },
      }),
      prisma.category.upsert({
        where: { name: 'Books' },
        update: {},
        create: {
          name: 'Books',
          iconUrl: 'https://cdn-icons-png.flaticon.com/128/2232/2232688.png',
          description: 'Textbooks and educational materials',
        },
      }),
      prisma.category.upsert({
        where: { name: 'Sports' },
        update: {},
        create: {
          name: 'Sports',
          iconUrl: 'https://cdn-icons-png.flaticon.com/128/857/857681.png',
          description: 'Sports equipment and gear',
        },
      }),
      prisma.category.upsert({
        where: { name: 'Rentals' },
        update: {},
        create: {
          name: 'Rentals',
          iconUrl: 'https://cdn-icons-png.flaticon.com/128/1584/1584808.png',
          description: 'Items available for rent',
        },
      }),
    ]);
    console.log(`✓ Created ${categories.length} categories\n`);

    // 2. Create Users for each role
    console.log('👥 Creating users...');
    
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    const buyerUser = await prisma.user.upsert({
      where: { email: 'buyer@optimus.com' },
      update: {},
      create: {
        name: 'John Buyer',
        email: 'buyer@optimus.com',
        password: hashedPassword,
        role: 'buyer',
        phone: '+1-555-0101',
        address: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        zipcode: '94105',
      },
    });

    const companySeller = await prisma.user.upsert({
      where: { email: 'company@optimus.com' },
      update: {},
      create: {
        name: 'TechStore Company',
        email: 'company@optimus.com',
        password: hashedPassword,
        role: 'company_seller',
        phone: '+1-555-0201',
        address: '456 Commerce Ave',
        city: 'San Francisco',
        state: 'CA',
        zipcode: '94102',
        companyName: 'TechStore Inc.',
        gstNumber: 'GST123456789',
      },
    });

    const studentSeller = await prisma.user.upsert({
      where: { email: 'student@optimus.com' },
      update: {},
      create: {
        name: 'Emma Student',
        email: 'student@optimus.com',
        password: hashedPassword,
        role: 'student_seller',
        phone: '+1-555-0301',
        address: '789 Campus Blvd',
        city: 'Berkeley',
        state: 'CA',
        zipcode: '94704',
      },
    });

    console.log(`✓ Created 3 users (1 buyer, 1 company, 1 student)\n`);

    // 3. Create Products from Company Seller
    console.log('📦 Creating products from company seller...');
    const companyProducts = await Promise.all([
      prisma.product.create({
        data: {
          title: 'MacBook Pro 14"',
          description: 'Latest MacBook Pro with M3 chip, 16GB RAM, 512GB SSD',
          price: 199900,
          originalPrice: 229900,
          discountPercentage: 13,
          imageUrl: 'https://via.placeholder.com/300?text=MacBook+Pro',
          stockQuantity: 15,
          status: 'active',
          sellerId: companySeller.id,
          categoryId: categories[0].id, // Electronics
        },
      }),
      prisma.product.create({
        data: {
          title: 'AirPods Pro',
          description: 'Wireless earbuds with noise cancellation',
          price: 24900,
          originalPrice: 29900,
          discountPercentage: 17,
          imageUrl: 'https://via.placeholder.com/300?text=AirPods+Pro',
          stockQuantity: 50,
          status: 'active',
          sellerId: companySeller.id,
          categoryId: categories[0].id,
        },
      }),
      prisma.product.create({
        data: {
          title: 'USB-C Hub',
          description: '7-in-1 USB-C Hub with HDMI, USB 3.0, SD Card reader',
          price: 4999,
          originalPrice: 6999,
          discountPercentage: 29,
          imageUrl: 'https://via.placeholder.com/300?text=USB-C+Hub',
          stockQuantity: 100,
          status: 'active',
          sellerId: companySeller.id,
          categoryId: categories[0].id,
        },
      }),
      prisma.product.create({
        data: {
          title: 'Mechanical Keyboard',
          description: 'RGB Mechanical Gaming Keyboard with Cherry MX Switches',
          price: 12999,
          originalPrice: 16999,
          discountPercentage: 24,
          imageUrl: 'https://via.placeholder.com/300?text=Mechanical+Keyboard',
          stockQuantity: 30,
          status: 'active',
          sellerId: companySeller.id,
          categoryId: categories[0].id,
        },
      }),
    ]);
    console.log(`✓ Created ${companyProducts.length} products from company seller\n`);

    // 4. Create Products from Student Seller
    console.log('📚 Creating products from student seller...');
    const studentProducts = await Promise.all([
      prisma.product.create({
        data: {
          title: 'Introduction to Algorithms',
          description: 'Used textbook - slightly worn but all pages intact',
          price: 1499,
          originalPrice: 3499,
          discountPercentage: 57,
          imageUrl: 'https://via.placeholder.com/300?text=Algorithms+Book',
          stockQuantity: 2,
          status: 'active',
          sellerId: studentSeller.id,
          categoryId: categories[2].id, // Books
        },
      }),
      prisma.product.create({
        data: {
          title: 'Calculus Textbook',
          description: 'Well-used calculus textbook with notes',
          price: 899,
          originalPrice: 2499,
          discountPercentage: 64,
          imageUrl: 'https://via.placeholder.com/300?text=Calculus+Book',
          stockQuantity: 1,
          status: 'active',
          sellerId: studentSeller.id,
          categoryId: categories[2].id,
        },
      }),
      prisma.product.create({
        data: {
          title: 'Bicycle',
          description: 'Used mountain bike - great condition, recently serviced',
          price: 8999,
          originalPrice: 15999,
          discountPercentage: 44,
          imageUrl: 'https://via.placeholder.com/300?text=Mountain+Bike',
          stockQuantity: 1,
          status: 'active',
          sellerId: studentSeller.id,
          categoryId: categories[3].id, // Sports
        },
      }),
    ]);
    console.log(`✓ Created ${studentProducts.length} products from student seller\n`);

    // 5. Create Orders for Buyer
    console.log('🛒 Creating orders...');
    const order = await prisma.order.create({
      data: {
        buyerId: buyerUser.id,
        sellerId: companySeller.id,
        totalAmount: Number(companyProducts[0].price) + Number(companyProducts[1].price),
        status: 'delivered',
        deliveryAddress: '123 Main Street',
        deliveryCity: 'San Francisco',
        deliveryState: 'CA',
        deliveryZipcode: '94105',
      },
    });

    await Promise.all([
      prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: companyProducts[0].id,
          quantity: 1,
          priceAtPurchase: Number(companyProducts[0].price),
        },
      }),
      prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: companyProducts[1].id,
          quantity: 2,
          priceAtPurchase: Number(companyProducts[1].price),
        },
      }),
    ]);
    console.log(`✓ Created order with 2 items\n`);

    // 6. Create Wishlist items
    console.log('❤️ Creating wishlist items...');
    await Promise.all([
      prisma.wishlist.create({
        data: {
          userId: buyerUser.id,
          productId: companyProducts[2].id,
        },
      }),
      prisma.wishlist.create({
        data: {
          userId: buyerUser.id,
          productId: companyProducts[3].id,
        },
      }),
      prisma.wishlist.create({
        data: {
          userId: buyerUser.id,
          productId: studentProducts[2].id,
        },
      }),
    ]);
    console.log(`✓ Created 3 wishlist items\n`);

    // 7. Create Reviews
    console.log('⭐ Creating reviews...');
    await Promise.all([
      prisma.review.create({
        data: {
          productId: companyProducts[0].id,
          userId: buyerUser.id,
          rating: 5,
          comment: 'Excellent product! Fast delivery and great quality.',
        },
      }),
      prisma.review.create({
        data: {
          productId: companyProducts[1].id,
          userId: buyerUser.id,
          rating: 4,
          comment: 'Good quality, battery life is decent.',
        },
      }),
    ]);
    console.log(`✓ Created 2 reviews\n`);

    // 8. Summary
    console.log('✅ Database seeding completed successfully!\n');
    console.log('📋 Summary:');
    console.log('   • 5 Categories created');
    console.log('   • 3 Users created:');
    console.log(`     - Buyer: ${buyerUser.email}`);
    console.log(`     - Company Seller: ${companySeller.email}`);
    console.log(`     - Student Seller: ${studentSeller.email}`);
    console.log(`   • 7 Products created (4 company, 3 student)`);
    console.log(`   • 1 Order with 2 items`);
    console.log(`   • 3 Wishlist items`);
    console.log(`   • 2 Reviews\n`);
    console.log('🔐 Test Credentials:');
    console.log('   Email: buyer@optimus.com');
    console.log('   Email: company@optimus.com');
    console.log('   Email: student@optimus.com');
    console.log('   Password: Password123!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', (error as Error).message);
    process.exit(1);
  }
};

seedDatabase();
