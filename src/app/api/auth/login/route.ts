import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { createSession } from '@/lib/auth';

const prisma = new PrismaClient();

// In-memory rate limiting for auth endpoints (10 req/min/IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: Request) {
  // Rate Limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const oneMinute = 60 * 1000;
  
  let rateData = rateLimitMap.get(ip);
  if (!rateData || now > rateData.resetTime) {
    rateData = { count: 1, resetTime: now + oneMinute };
  } else {
    rateData.count++;
  }
  rateLimitMap.set(ip, rateData);

  if (rateData.count > 10) {
    return NextResponse.json({ error: 'Terlalu banyak percobaan. Silakan coba lagi nanti.' }, { status: 429 });
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password harus diisi.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'Kredensial tidak valid.' }, { status: 401 });
    }

    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json({ error: 'Akun Anda dinonaktifkan. Hubungi Superadmin.' }, { status: 403 });
    }

    // Check lockout
    if (user.locked_until && new Date() < user.locked_until) {
      return NextResponse.json({ error: 'Akun Anda terkunci. Silakan coba beberapa saat lagi.' }, { status: 403 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      const newAttempts = user.login_attempts + 1;
      let lockedUntil = null;
      if (newAttempts >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes lockout
      }
      
      await prisma.user.update({
        where: { id: user.id },
        data: { login_attempts: newAttempts, locked_until: lockedUntil },
      });

      if (newAttempts >= 5) {
        return NextResponse.json({ error: 'Terlalu banyak percobaan gagal. Akun dikunci selama 15 menit.' }, { status: 403 });
      }

      return NextResponse.json({ error: 'Kredensial tidak valid.' }, { status: 401 });
    }

    // Success login
    await prisma.user.update({
      where: { id: user.id },
      data: { login_attempts: 0, locked_until: null },
    });

    await createSession(user.id, user.role);

    return NextResponse.json({ success: true, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}
