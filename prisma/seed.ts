/**
 * Database Seed Script
 * 
 * This script seeds the database with sample data for development.
 * 
 * Usage:
 *   npm run db:seed
 * 
 * Note: Only run in development environment!
 */

import { PrismaClient, UserRole, OrderStatus, PaymentMethod, PaymentStatus, ReviewStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Clearing existing data...');
  try {
    // Delete in reverse order of dependencies
    // Note: Prisma Client model names are camelCase
    await prisma.reviewVote.deleteMany();
    await prisma.review.deleteMany();
    await prisma.whatsAppEvent.deleteMany(); // Note: whatsAppEvent (capital A)
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Existing data cleared');
  } catch (error: any) {
    console.log('⚠️  Error clearing data:', error.message);
    console.log('⚠️  Continuing anyway...');
    // Don't throw - continue with seed
  }

  // Create Admin User
  console.log('👤 Creating admin user...');
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@thebutton.com',
      name: 'Admin User',
      passwordHash: adminPasswordHash,
      role: UserRole.admin,
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Create Sample Customer
  console.log('👤 Creating sample customer...');
  const customerPasswordHash = await bcrypt.hash('password123', 10);
  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      name: 'John Doe',
      phone: '+919876543210',
      passwordHash: customerPasswordHash,
      role: UserRole.customer,
    },
  });
  console.log(`✅ Customer created: ${customer.email}`);

  // Create Sample Products
  console.log('📦 Creating sample products...');
  const products = [
    {
      name: 'Classic White Shirt',
      price: 1999,
      compareAtPrice: 2499,
      description: 'Premium quality white shirt made from 100% cotton. Perfect for formal occasions and business meetings.',
      images: [
        'https://images.unsplash.com/photo-1594938291221-94f18c8ae8b0?w=800',
        'https://images.unsplash.com/photo-1594938291221-94f18c8ae8b0?w=800',
      ],
      sizes: [
        { value: 'S', available: true, stock: 5 },
        { value: 'M', available: true, stock: 8 },
        { value: 'L', available: true, stock: 3 },
        { value: 'XL', available: false, stock: 0 },
      ],
      inStock: true,
      sku: 'SHIRT-WH-001',
      collection: 'Shirts',
      searchKeywords: ['shirt', 'white', 'formal', 'cotton', 'classic'],
    },
    {
      name: 'Navy Blue T-Shirt',
      price: 899,
      compareAtPrice: 1199,
      description: 'Comfortable and stylish navy blue t-shirt. Made from premium cotton blend for all-day comfort.',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      ],
      sizes: [
        { value: 'S', available: true, stock: 10 },
        { value: 'M', available: true, stock: 15 },
        { value: 'L', available: true, stock: 12 },
        { value: 'XL', available: true, stock: 8 },
      ],
      inStock: true,
      sku: 'TSHIRT-NAV-001',
      collection: 'T-Shirts',
      searchKeywords: ['tshirt', 't-shirt', 'navy', 'blue', 'casual', 'cotton'],
    },
    {
      name: 'Slim Fit Chinos',
      price: 2499,
      compareAtPrice: 2999,
      description: 'Modern slim-fit chinos in classic khaki. Versatile pants that work for both casual and semi-formal occasions.',
      images: [
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800',
      ],
      sizes: [
        { value: '28', available: true, stock: 3 },
        { value: '30', available: true, stock: 5 },
        { value: '32', available: true, stock: 7 },
        { value: '34', available: false, stock: 0 },
      ],
      inStock: true,
      sku: 'CHINOS-KHA-001',
      collection: 'Pants',
      searchKeywords: ['chinos', 'pants', 'khaki', 'slim', 'fit', 'casual'],
    },
  ];

  const createdProducts = [];
  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData,
    });
    createdProducts.push(product);
    console.log(`✅ Product created: ${product.name} (${product.sku})`);
  }

  // Create Sample Order
  console.log('📦 Creating sample order...');
  const order = await prisma.order.create({
    data: {
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userId: customer.id,
      userEmail: customer.email,
      status: OrderStatus.confirmed,
      paymentMethod: PaymentMethod.cod,
      paymentStatus: PaymentStatus.pending,
      subtotal: 2898,
      shipping: 99,
      total: 2997,
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'customer@example.com',
        phone: '+919876543210',
        address: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      },
      items: {
        create: [
          {
            productId: createdProducts[0].id,
            name: createdProducts[0].name,
            price: createdProducts[0].price,
            compareAtPrice: createdProducts[0].compareAtPrice,
            size: 'M',
            quantity: 1,
            image: (createdProducts[0].images as string[])[0],
          },
          {
            productId: createdProducts[1].id,
            name: createdProducts[1].name,
            price: createdProducts[1].price,
            compareAtPrice: createdProducts[1].compareAtPrice,
            size: 'L',
            quantity: 1,
            image: (createdProducts[1].images as string[])[0],
          },
        ],
      },
    },
  });
  console.log(`✅ Order created: ${order.orderId}`);

  // Create Sample Review
  console.log('⭐ Creating sample review...');
  const review = await prisma.review.create({
    data: {
      productId: createdProducts[0].id,
      userId: customer.id,
      userEmail: customer.email,
      userName: customer.name,
      rating: 5,
      comment: 'Excellent quality! The shirt fits perfectly and the material is very comfortable. Highly recommended!',
      verifiedPurchase: true,
      helpfulCount: 2,
      status: ReviewStatus.approved,
    },
  });
  console.log(`✅ Review created for product: ${createdProducts[0].name}`);

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - Users: 2 (1 admin, 1 customer)`);
  console.log(`   - Products: ${createdProducts.length}`);
  console.log(`   - Orders: 1`);
  console.log(`   - Reviews: 1`);
  console.log('');
  console.log('🔑 Login Credentials:');
  console.log('   Admin:');
  console.log('     Email: admin@thebutton.com');
  console.log('     Password: admin123');
  console.log('   Customer:');
  console.log('     Email: customer@example.com');
  console.log('     Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

