import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function createUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const mfaSecret = speakeasy.generateSecret();

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      mfaSecret: mfaSecret.base32,
    },
  });

  const qrCodeUrl = await QRCode.toDataURL(mfaSecret.otpauth_url);
  return { user, qrCodeUrl };
}

export async function verifyMFA(userId: string, token: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.mfaSecret) return false;

  return speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: 'base32',
    token,
  });
}

export async function login(email: string, password: string, mfaToken: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error('Invalid credentials');

  if (user.mfaEnabled) {
    const validMFA = await verifyMFA(user.id, mfaToken);
    if (!validMFA) throw new Error('Invalid MFA token');
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { user, token };
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}