import { prisma } from "./src/lib/prisma.js"

async function initDb() {
  try {
    // Create enums first
    console.log("Creating enums...")
    await prisma.$executeRawUnsafe(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Badge') THEN CREATE TYPE "Badge" AS ENUM ('new', 'sale', 'hot'); END IF; END $$;`
    )
    
    await prisma.$executeRawUnsafe(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OrderStatus') THEN CREATE TYPE "OrderStatus" AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled'); END IF; END $$;`
    )
    
    console.log("Creating tables...")
    
    // Create User table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        "passwordHash" TEXT NOT NULL,
        name TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Create Product table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Product" (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        price INTEGER NOT NULL,
        "originalPrice" INTEGER,
        category TEXT NOT NULL,
        colors TEXT[],
        sizes TEXT[],
        image TEXT NOT NULL,
        images TEXT[],
        badge "Badge",
        description TEXT NOT NULL,
        rating DOUBLE PRECISION DEFAULT 0,
        "reviewCount" INTEGER DEFAULT 0,
        stock INTEGER DEFAULT 0
      )
    `)
    
    // Create CartItem table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "CartItem" (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        "productId" INTEGER NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL,
        size TEXT,
        color TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("userId", "productId", size, color)
      )
    `)
    
    // Create Order table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Order" (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        status "OrderStatus" DEFAULT 'pending',
        "totalPrice" INTEGER NOT NULL,
        address TEXT,
        city TEXT,
        phone TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Create OrderItem table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "OrderItem" (
        id SERIAL PRIMARY KEY,
        "orderId" INTEGER NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
        "productId" INTEGER NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL,
        price INTEGER NOT NULL,
        size TEXT,
        color TEXT
      )
    `)
    
    console.log("✓ Database tables created successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error initializing database:", error)
    process.exit(1)
  }
}

initDb()
