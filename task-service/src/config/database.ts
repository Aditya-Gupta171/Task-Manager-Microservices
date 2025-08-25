import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected');
    return prisma;
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};