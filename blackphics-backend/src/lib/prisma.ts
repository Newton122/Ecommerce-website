import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

async function initializeDatabase() {
  try {
    await prisma.$connect();
    await prisma.user.findFirst();
    console.log("✓ Database schema is ready");
  } catch (error: unknown) {
    console.error("✗ Database initialization failed:", error);
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
}

initializeDatabase().catch((err) => {
  console.error("Failed to initialize database:", err);
  if (process.env.NODE_ENV !== "production") {
    process.exit(1);
  }
});
