import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'Superadmin') {
    return NextResponse.json({ error: 'Forbidden. Superadmin role required.' }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        is_active: true,
        login_attempts: true,
        locked_until: true,
      },
      orderBy: {
        email: 'asc',
      },
    });

    return NextResponse.json({ data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'Superadmin') {
    return NextResponse.json({ error: 'Forbidden. Superadmin role required.' }, { status: 403 });
  }

  try {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Email, password, dan role harus diisi.' }, { status: 400 });
    }

    if (role !== 'Admin' && role !== 'Superadmin') {
      return NextResponse.json({ error: 'Role tidak valid.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email sudah terdaftar.' }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password_hash,
        role,
        is_active: true,
      },
    });

    // Audit Log for creating a user
    const currentUser = await prisma.user.findUnique({ where: { id: session.userId } });
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'User',
        entityId: user.id,
        details: JSON.stringify({ id: user.id, email: user.email, role: user.role }),
        userId: session.userId,
        userEmail: currentUser?.email || 'Unknown',
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: user.id, email: user.email, role: user.role, is_active: user.is_active },
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
  }
}
