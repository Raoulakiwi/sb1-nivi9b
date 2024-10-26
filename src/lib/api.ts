import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createInitialAdmin() {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123'; // This should be changed immediately after first login

  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: adminPassword,
          role: 'ADMIN',
        },
      });
      console.log('Initial admin user created');
    }
  } catch (error) {
    console.error('Failed to create initial admin:', error);
  }
}